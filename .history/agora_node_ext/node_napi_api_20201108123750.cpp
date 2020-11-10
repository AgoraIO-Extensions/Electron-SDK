/*
* Copyright (c) 2017 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2017
*/

#include "node_napi_api.h"
#include "node_uid.h"
#include "node_log.h"
#include "node_video_stream_channel.h"
#include "node_async_queue.h"
#include "libyuv.h"
#include <chrono>
#include <string>
using namespace libyuv;
NodeVideoFrameTransporter g_transport;

NodeVideoFrameTransporter* getNodeVideoFrameTransporter()
{
    return &g_transport;
}

NodeVideoFrameTransporter::NodeVideoFrameTransporter()
: init(false)
, env(nullptr)
, m_highFPS(15)
, m_FPS(10)
{
    
}

NodeVideoFrameTransporter::~NodeVideoFrameTransporter()
{
    deinitialize();
}

bool NodeVideoFrameTransporter::initialize(v8::Isolate *isolate, const Nan::FunctionCallbackInfo<v8::Value> &callbackinfo)
{
    if (init) {
        deinitialize();
    }
    m_stopFlag = false;
    env = isolate;
    callback.Reset(callbackinfo[0].As<Function>());
    js_this.Reset(callbackinfo.This());
    m_thread.reset(new std::thread(&NodeVideoFrameTransporter::FlushVideo, this));
    m_highThread.reset(new std::thread(&NodeVideoFrameTransporter::highFlushVideo, this));
    init = true;
    return true;
}

bool NodeVideoFrameTransporter::deinitialize()
{
    if (!init)
        return true;
    m_stopFlag = 1;
    if (m_thread->joinable())
        m_thread->join();
    if (m_highThread->joinable())
        m_highThread->join();
    init = false;
    m_highThread.reset();
    m_thread.reset();
    env = nullptr;
    callback.Reset();
    js_this.Reset();
    return true;
}

int NodeVideoFrameTransporter::setVideoDimension(NodeRenderType type, agora::rtc::uid_t uid, std::string channelId, uint32_t width, uint32_t height)
{
    if (!init)
        return -1;
    std::lock_guard<std::mutex> lck(m_lock);
    if (type == NODE_RENDER_TYPE_REMOTE) {
        auto cit = m_remoteHighVideoFrames.find(channelId);
        if (cit != m_remoteHighVideoFrames.end()) {
            auto it = cit->second.find(uid);
            if (it != cit->second.end()) {
                it->second.m_destWidth = width;
                it->second.m_destHeight = height;
                return 0;
            }
        }
    }
    VideoFrameInfo& info = getVideoFrameInfo(type, uid, channelId);
    info.m_destWidth = width;
    info.m_destHeight = height;
    return 0;
}

VideoFrameInfo& NodeVideoFrameTransporter::getVideoFrameInfo(NodeRenderType type, agora::rtc::uid_t uid, std::string channelId)
{
    if (type == NodeRenderType::NODE_RENDER_TYPE_LOCAL) {
        if (!m_localVideoFrame.get())
            m_localVideoFrame.reset(new VideoFrameInfo(NODE_RENDER_TYPE_LOCAL));
        return *m_localVideoFrame.get();
    }
    else if (type == NODE_RENDER_TYPE_REMOTE) {
        //try looking in high streams first
        auto hcit = m_remoteHighVideoFrames.find(channelId);
        if(hcit != m_remoteHighVideoFrames.end()){
            auto hit = m_remoteHighVideoFrames[channelId].find(uid);
            if (hit != m_remoteHighVideoFrames[channelId].end()) 
                return m_remoteHighVideoFrames[channelId][uid];
        }

        //if not exists, try looking in low streams
        auto cit = m_remoteVideoFrames.find(channelId);
        if(cit == m_remoteVideoFrames.end()){
            m_remoteVideoFrames[channelId] = std::unordered_map<agora::rtc::uid_t, VideoFrameInfo>();
        }
        auto it = m_remoteVideoFrames[channelId].find(uid);
        if (it == m_remoteVideoFrames[channelId].end()) 
            m_remoteVideoFrames[channelId][uid] = VideoFrameInfo(NODE_RENDER_TYPE_REMOTE, uid, channelId);

        return m_remoteVideoFrames[channelId][uid];
    }
    else if (type == NODE_RENDER_TYPE_DEVICE_TEST) {
        if (!m_devTestVideoFrame.get())
            m_devTestVideoFrame.reset(new VideoFrameInfo(NODE_RENDER_TYPE_DEVICE_TEST));
        return *m_devTestVideoFrame.get();
    }
    else {
        if (!m_videoSourceVideoFrame.get())
            m_videoSourceVideoFrame.reset(new VideoFrameInfo(NODE_RENDER_TYPE_VIDEO_SOURCE));
        return *m_videoSourceVideoFrame.get();
    }
}

int NodeVideoFrameTransporter::deliverVideoSourceFrame(const char* payload, int len)
{
    if (!init)
        return -1;
    image_frame_info *info = (image_frame_info*)payload;
    image_header_type *hdr = (image_header_type*)(payload + sizeof(image_frame_info));
    unsigned int uv_len = (info->stride / 2) * (info->height / 2);
    char* y = (char*)(hdr + 1);
    char* u = y + uv_len * 4;
    char* v = u + uv_len;
    std::lock_guard<std::mutex> lck(m_lock);
    VideoFrameInfo& videoInfo = getVideoFrameInfo(NODE_RENDER_TYPE_VIDEO_SOURCE, 0, "");
    int destWidth = videoInfo.m_destWidth ? videoInfo.m_destWidth : info->width;
    int destHeight = videoInfo.m_destHeight ? videoInfo.m_destHeight : info->height;
    size_t imageSize = sizeof(image_header_type) + destWidth * destHeight * 3 / 2;
    auto s = videoInfo.m_buffer.size();
    if (s < imageSize || s >= imageSize * 2)
        videoInfo.m_buffer.resize(imageSize);
    image_header_type *localHdr = (image_header_type*)&videoInfo.m_buffer[0];
    localHdr->format = hdr->format;
    localHdr->mirrored = hdr->mirrored;
    localHdr->timestamp = htons(hdr->timestamp);
    localHdr->rotation = htons(hdr->rotation);
    localHdr->width = htons(destWidth);
    localHdr->height = htons(destHeight);
    localHdr->left = htons(0);
    localHdr->right = htons(0);
    localHdr->top = htons(0);
    localHdr->bottom = htons(0);
    unsigned char* desty = &videoInfo.m_buffer[0] + sizeof(image_header_type);
    unsigned char* destu = desty + destWidth * destHeight;
    unsigned char* destv = destu + destWidth / 2 * destHeight / 2;
    I420Scale((const uint8*)y, info->stride0, (const uint8*)u, info->strideU, (const uint8*)v, info->strideV, info->width, info->height, 
        (uint8*)desty, destWidth, (uint8*)destu, destWidth / 2, (uint8*)destv, destWidth / 2, destWidth, destHeight, kFilterNone);
    videoInfo.m_bufferList[0].buffer = (unsigned char*)localHdr;
    videoInfo.m_bufferList[0].length = sizeof(*localHdr);
    videoInfo.m_bufferList[1].buffer = (unsigned char*)desty;
    videoInfo.m_bufferList[1].length = destWidth * destHeight;
    videoInfo.m_bufferList[2].buffer = (unsigned char*)destu;
    videoInfo.m_bufferList[2].length = destWidth / 2 * destHeight / 2;
    videoInfo.m_bufferList[3].buffer = (unsigned char*)destv;
    videoInfo.m_bufferList[3].length = destWidth / 2 * destHeight / 2;
    videoInfo.m_count = 0;
    videoInfo.m_needUpdate = true;
    return 0;
}

int NodeVideoFrameTransporter::deliverFrame_I420(NodeRenderType type, agora::rtc::uid_t uid, std::string channelId, const agora::media::IVideoFrame& videoFrame, int rotation, bool mirrored)
{
    if (!init)
        return -1;
    int stride, stride0 = videoFrame.stride(IVideoFrame::Y_PLANE);
    stride = stride0;
    if (stride & 0xf) {
        stride = (((stride + 15) >> 4) << 4);
    }
    rotation = rotation < 0 ? rotation + 360 : rotation;
    std::lock_guard<std::mutex> lck(m_lock);
    VideoFrameInfo& info = getVideoFrameInfo(type, uid, channelId);
    int destStride = info.m_destWidth ? info.m_destWidth : stride;
    int destWidth = info.m_destWidth ? info.m_destWidth : videoFrame.width();
    int destHeight = info.m_destHeight ? info.m_destHeight : videoFrame.height();
    size_t imageSize = sizeof(image_header_type) + destStride * destHeight * 3 / 2;
    auto s = info.m_buffer.size();
    if (s < imageSize || s >= imageSize * 2)
        info.m_buffer.resize(imageSize);
    image_header_type* hdr = reinterpret_cast<image_header_type*>(&info.m_buffer[0]);
    hdr->mirrored = mirrored ? 1 : 0;
    hdr->rotation = htons(rotation);
    setupFrameHeader(hdr, destStride, destWidth, destHeight);
    
    copyFrame(videoFrame, info, destStride, stride0, destWidth, destHeight);
    info.m_count = 0;
    info.m_needUpdate = true;
    return 0;
    
}

void NodeVideoFrameTransporter::setupFrameHeader(image_header_type*header, int stride, int width, int height)
{
    int left = (stride - width) / 2;
    int top = 0;
    header->format = 0;
    header->width = htons(width);
    header->height = htons(height);
    header->left = htons((uint16_t)left);
    header->top = htons((uint16_t)top);
    header->right = htons((uint16_t)(stride - width - left));
    header->bottom = htons((uint16_t)0);
    header->timestamp = 0;
}

void NodeVideoFrameTransporter::copyFrame(const agora::media::IVideoFrame& videoFrame, VideoFrameInfo& info, int dest_stride, int src_stride, int width, int height)
{
    int width2 = dest_stride / 2, heigh2 = height / 2;
    int strideY = videoFrame.stride(IVideoFrame::Y_PLANE);
    int strideU = videoFrame.stride(IVideoFrame::U_PLANE);
    int strideV = videoFrame.stride(IVideoFrame::V_PLANE);

    unsigned char* y = &info.m_buffer[0] + sizeof(image_header_type);
    unsigned char* u = y + dest_stride * height;
    unsigned char* v = u + width2 * heigh2;
    const unsigned char* planeY = videoFrame.buffer(IVideoFrame::Y_PLANE);
    const unsigned char* planeU = videoFrame.buffer(IVideoFrame::U_PLANE);
    const unsigned char* planeV = videoFrame.buffer(IVideoFrame::V_PLANE);

    if (videoFrame.width() == width && videoFrame.height() == height)
    {
        copyAndCentreYuv(planeY, planeU, planeV, videoFrame.width(), videoFrame.height(), src_stride, y, u, v, dest_stride);
    }
    else
    {
        I420Scale(planeY, strideY, planeU, strideU, planeV, strideV, videoFrame.width(), videoFrame.height(), (uint8*)y, dest_stride, (uint8*)u, width2, (uint8*)v, width2, width, height, kFilterNone);
    }

    info.m_bufferList[0].buffer = &info.m_buffer[0];
    info.m_bufferList[0].length = sizeof(image_header_type);

    info.m_bufferList[1].buffer = y;
    info.m_bufferList[1].length = dest_stride * height;

    info.m_bufferList[2].buffer = u;
    info.m_bufferList[2].length = width2 * heigh2;

    info.m_bufferList[3].buffer = v;
    info.m_bufferList[3].length = width2 * heigh2;
}

void NodeVideoFrameTransporter::copyAndCentreYuv(const unsigned char* srcYPlane, const unsigned char* srcUPlane, const unsigned char* srcVPlane, int width, int height, int srcStride,
unsigned char* dstYPlane, unsigned char* dstUPlane, unsigned char* dstVPlane, int dstStride)
{
    if (srcStride == width && dstStride == width)
    {
        memcpy(dstYPlane, srcYPlane, width * height);
        memcpy(dstUPlane, srcUPlane, width * height / 4);
        memcpy(dstVPlane, srcVPlane, width * height / 4);
        return;
    }

    int dstDiff = dstStride - width;
    //RGB(0,0,0) to YUV(0,128,128)
    memset(dstYPlane, 0, dstStride * height);
    memset(dstUPlane, 128, dstStride * height / 4);
    memset(dstVPlane, 128, dstStride * height / 4);

    for (int i = 0; i < height; ++i)
    {
        memcpy(dstYPlane + (dstDiff >> 1), srcYPlane, width);
        srcYPlane += srcStride;
        dstYPlane += dstStride;

        if (i % 2 == 0)
        {
            memcpy(dstUPlane + (dstDiff >> 2), srcUPlane, width >> 1);
            srcUPlane += srcStride >> 1;
            dstUPlane += dstStride >> 1;

            memcpy(dstVPlane + (dstDiff >> 2), srcVPlane, width >> 1);
            srcVPlane += srcStride >> 1;
            dstVPlane += dstStride >> 1;
        }
    }
}

VideoFrameInfo& NodeVideoFrameTransporter::getHighVideoFrameInfo(agora::rtc::uid_t uid, std::string channelId)
{
    auto cit = m_remoteHighVideoFrames.find(channelId);
    if (cit == m_remoteHighVideoFrames.end()) {
        m_remoteHighVideoFrames[channelId] = std::unordered_map<agora::rtc::uid_t, VideoFrameInfo>();
    }

    auto it = m_remoteHighVideoFrames[channelId].find(uid);
    if (it == m_remoteHighVideoFrames[channelId].end()) {
        m_remoteHighVideoFrames[channelId][uid] = VideoFrameInfo(NODE_RENDER_TYPE_REMOTE, uid, channelId);
    }
    return m_remoteHighVideoFrames[channelId][uid];
}

void NodeVideoFrameTransporter::addToHighVideo(agora::rtc::uid_t uid, std::string channelId)
{
    std::lock_guard<std::mutex> lck(m_lock);
    auto cit = m_remoteVideoFrames.find(channelId);
    if(cit != m_remoteVideoFrames.end()){
        auto it = m_remoteVideoFrames[channelId].find(uid);
        if(it != m_remoteVideoFrames[channelId].end())
            m_remoteVideoFrames[channelId].erase(it);
    }
    getHighVideoFrameInfo(uid, channelId);
}

void NodeVideoFrameTransporter::removeFromeHighVideo(agora::rtc::uid_t uid, std::string channelId)
{
    std::lock_guard<std::mutex> lck(m_lock);
    auto cit = m_remoteHighVideoFrames.find(channelId);
    if(cit != m_remoteHighVideoFrames.end()){
        auto it = m_remoteHighVideoFrames[channelId].find(uid);
        if(it != m_remoteHighVideoFrames[channelId].end())
            m_remoteHighVideoFrames[channelId].erase(it);
    }
    getVideoFrameInfo(NODE_RENDER_TYPE_REMOTE, uid, channelId);
}

void NodeVideoFrameTransporter::setHighFPS(uint32_t fps)
{
    if(fps == 0)
        return;
    std::lock_guard<std::mutex> lck(m_lock);
    m_highFPS = fps;
}

void NodeVideoFrameTransporter::setFPS(uint32_t fps)
{
    if(fps == 0)
        return;
    std::lock_guard<std::mutex> lck(m_lock);
    m_FPS = fps;
}

#define NODE_SET_OBJ_PROP_UINT32(obj, name, val) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        Local<Value> propVal = napi_create_uint32_(isolate, val); \
        v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, propVal); \
        if(!ret.IsNothing()) { \
            if(!ret.ToChecked()) { \
                break; \
            } \
        } \
    }
#define NODE_SET_OBJ_PROP_STRING(obj, name, val) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        Local<Value> propVal = napi_create_string_(isolate, val); \
        v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, propVal); \
        if(!ret.IsNothing()) { \
            if(!ret.ToChecked()) { \
                break; \
            } \
        } \
    }
#define NODE_SET_OBJ_PROP_HEADER(obj, it) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, "header", NewStringType::kInternalized).ToLocalChecked(); \
        Local<v8::ArrayBuffer> buff = v8::ArrayBuffer::New(isolate, (it)->buffer, (it)->length); \
        v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, buff); \
        if(!ret.IsNothing()) { \
            if(!ret.ToChecked()) { \
                break; \
            } \
        } \
    }

#define NODE_SET_OBJ_PROP_DATA(obj, name, it) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        Local<v8::ArrayBuffer> buff = v8::ArrayBuffer::New(isolate, (it)->buffer, (it)->length); \
        Local<v8::Uint8Array> dataarray = v8::Uint8Array::New(buff, 0, it->length);\
        v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, dataarray); \
        if(!ret.IsNothing()) { \
            if(!ret.ToChecked()) { \
                break; \
            } \
        } \
    }

bool AddObj(Isolate* isolate, Local<v8::Array>& infos, int index, VideoFrameInfo& info)
{
    if (!info.m_needUpdate)
        return false;
    info.m_needUpdate = false;
    bool result = false;
    do {
        Local<v8::Object> obj = Object::New(isolate);
        NODE_SET_OBJ_PROP_UINT32(obj, "type", info.m_renderType);
        NODE_SET_OBJ_PROP_UINT32(obj, "uid", info.m_uid);
        NODE_SET_OBJ_PROP_STRING(obj, "channelId", info.m_channelId.c_str());
        auto it = info.m_bufferList.begin();
        NODE_SET_OBJ_PROP_HEADER(obj, it);
        ++it;
        NODE_SET_OBJ_PROP_DATA(obj, "ydata", it);
        ++it;
        NODE_SET_OBJ_PROP_DATA(obj, "udata", it);
        ++it;
        NODE_SET_OBJ_PROP_DATA(obj, "vdata", it);
        result = infos->Set(isolate->GetCurrentContext(), index, obj).FromJust();
    }while(false);
    return result;
}

void NodeVideoFrameTransporter::FlushVideo()
{
    while (!m_stopFlag) {
        {
            std::unique_lock<std::mutex> lck(m_lock);
            for (auto cit = m_remoteVideoFrames.begin(); cit != m_remoteVideoFrames.end();) {
                for (auto it = cit->second.begin(); it != cit->second.end();) {
                    if (it->second.m_count > MAX_MISS_COUNT)
                        it = cit->second.erase(it);
                    else
                        ++it;
                }
                ++cit;
            }

            if (m_devTestVideoFrame.get() && m_localVideoFrame && m_localVideoFrame->m_count > MAX_MISS_COUNT) {
                m_devTestVideoFrame.reset();
            }
            lck.unlock();

            agora::rtc::node_async_call::async_call([this]() {
                Isolate *isolate = env;
                HandleScope scope(isolate);
                std::lock_guard<std::mutex> lock(m_lock);
                Local<v8::Array> infos = v8::Array::New(isolate);

                uint32_t i = 0;
                for (auto& cit : m_remoteVideoFrames) {
                    for (auto& it : cit.second) {
                        if (AddObj(isolate, infos, i, it.second))
                            ++i;
                        else {
                            ++it.second.m_count;
                        }
                    }
                }
                if (m_localVideoFrame.get()) {
                    if (AddObj(isolate, infos, i, *m_localVideoFrame.get()))
                        ++i;
                    else {
                        ++m_localVideoFrame->m_count;
                    }
                }

                if (m_devTestVideoFrame.get()) {
                    if (AddObj(isolate, infos, i, *m_devTestVideoFrame.get()))
                        ++i;
                    else {
                        ++m_devTestVideoFrame->m_count;
                    }
                }
                if (i > 0) {
                    Local<v8::Value> args[1] = { infos };
                    callback.Get(isolate)->Call(isolate->GetCurrentContext(), js_this.Get(isolate), 1, args);
                }
            });
            std::this_thread::sleep_for(std::chrono::milliseconds(1000 / m_FPS));
        }
    }
}

void NodeVideoFrameTransporter::highFlushVideo()
{
    while (!m_stopFlag) {
        {
            std::unique_lock<std::mutex> lck(m_lock);
            for (auto cit = m_remoteHighVideoFrames.begin(); cit != m_remoteHighVideoFrames.end();) {
                for (auto it = cit->second.begin(); it != cit->second.end();) {
                    if (it->second.m_count > MAX_MISS_COUNT)
                        it = cit->second.erase(it);
                    else
                        ++it;
                }
                ++cit;
            }

            if (m_videoSourceVideoFrame.get() && m_videoSourceVideoFrame->m_count > MAX_MISS_COUNT)
                m_videoSourceVideoFrame.reset();

            lck.unlock();

            agora::rtc::node_async_call::async_call([this]() {
                Isolate *isolate = env;
                HandleScope scope(isolate);
                std::lock_guard<std::mutex> lock(m_lock);
                Local<v8::Array> infos = v8::Array::New(isolate);
                
                uint32_t i = 0;
                for (auto& cit : m_remoteHighVideoFrames) {
                    for (auto& it : cit.second) {
                        if (AddObj(isolate, infos, i, it.second))
                            ++i;
                        else {
                            ++it.second.m_count;
                        }
                    }
                }

                if (m_videoSourceVideoFrame.get()) {
                    if (AddObj(isolate, infos, i, *m_videoSourceVideoFrame.get()))
                        ++i;
                    else {
                        ++m_videoSourceVideoFrame->m_count;
                    }
                }

                if (i > 0) {
                    Local<v8::Value> args[1] = { infos };
                    callback.Get(isolate)->Call(isolate->GetCurrentContext(), js_this.Get(isolate), 1, args);
                }
            });
            std::this_thread::sleep_for(std::chrono::milliseconds(1000 / m_highFPS));
        }
    }
}

int napi_get_value_string_utf8_(const Local<Value>& str, char *buffer, uint32_t len)
{
    Isolate* isolate = Isolate::GetCurrent();
    if(!isolate) {
        return 0;
    }
    Local<Context> context = isolate->GetCurrentContext();
    if (!str->IsString())
        return 0;
    if (!buffer) {
#if NODE_MAJOR_VERSION <= 10
        return str.As<String>()->Utf8Length();
#else
        return str.As<String>()->Utf8Length(isolate);
#endif
    }
    else {
#if NODE_MAJOR_VERSION <= 10
        int copied = str.As<String>()->WriteUtf8(buffer, len - 1, nullptr, String::REPLACE_INVALID_UTF8 | String::NO_NULL_TERMINATION);
#else
        int copied = str.As<String>()->WriteUtf8(isolate, buffer, len - 1, nullptr, String::REPLACE_INVALID_UTF8 | String::NO_NULL_TERMINATION);
#endif
        
        buffer[copied] = '\0';
        return copied;
    }
}

napi_status napi_get_value_uid_t_(const Local<Value>& value, agora::rtc::uid_t& result)
{
    return agora::rtc::NodeUid::getUidFromNodeValue(value, result);
}

napi_status napi_get_value_uint32_(const Local<Value>& value, uint32_t& result)
{
    if (!value->IsUint32())
        return napi_invalid_arg;
    result = Nan::To<v8::Uint32>(value).ToLocalChecked()->Value();
    return napi_ok;
}

napi_status napi_get_value_bool_(const Local<Value>& value, bool& result)
{
    if(!value->IsBoolean())
        return napi_invalid_arg;
    
    result = Nan::To<v8::Boolean>(value).ToLocalChecked()->Value();
    return napi_ok;
}
	
napi_status napi_get_value_int32_(const Local<Value>& value, int32_t& result)
{
    if (!value->IsInt32())
        return napi_invalid_arg;

    result = Nan::To<v8::Int32>(value).ToLocalChecked()->Value();
    return napi_ok;
}

napi_status napi_get_value_double_(const Local<Value>& value, double &result)
{
    if (!value->IsNumber())
        return napi_invalid_arg;

    result = Nan::To<v8::Number>(value).ToLocalChecked()->Value();
    return napi_ok;
}

napi_status napi_get_value_int64_(const Local<Value>& value, int64_t& result)
{
    int32_t tmp;
    napi_status status = napi_get_value_int32_(value, tmp);
    result = tmp;
    return status;
}

napi_status napi_get_value_nodestring_(const Local<Value>& str, NodeString& nodechar)
{
    napi_status status = napi_ok;
    do {
        int len = napi_get_value_string_utf8_(str, nullptr, 0);
        if (len == 0) {
            break;
        }
        char *outstr = NodeString::alloc_buf(len + 1);
        if (!outstr) {
            status = napi_generic_failure;
            break;
        }
        len = napi_get_value_string_utf8_(str, outstr, len + 1);

        if (status != napi_ok) {
            break;
        }
        nodechar.setBuf(outstr);
    } while (false);
    return status;
}

napi_status napi_get_value_object_(Isolate* isolate, const Local<Value>& value, Local<Object>& object)
{
    if(!value->IsObject()) {
        return napi_invalid_arg;
    }

    object = value->ToObject(isolate->GetCurrentContext()).ToLocalChecked();
    return napi_ok;
}

Local<Value> napi_create_uint32_(Isolate *isolate, const uint32_t& value)
{
    return v8::Number::New(isolate, value);
}

Local<Value> napi_create_bool_(Isolate *isolate, const bool& value)
{
    return v8::Boolean::New(isolate, value);
}

Local<Value> napi_create_string_(Isolate *isolate, const char* value)
{
    return String::NewFromUtf8(isolate, value ? value : "", NewStringType::kInternalized).ToLocalChecked();
}

Local<Value> napi_create_double_(Isolate *isolate, const double &value)
{
    return v8::Number::New(isolate, value);
}

Local<Value> napi_create_uint64_(Isolate *isolate, const uint64_t& value)
{
    return v8::Number::New(isolate, (double)value);
}

Local<Value> napi_create_int32_(Isolate *isolate, const int32_t& value)
{
    return v8::Int32::New(isolate, value);
}

Local<Value> napi_create_uint16_(Isolate *isolate, const uint16_t& value)
{
    return v8::Uint32::New(isolate, value);
}

Local<Value> napi_create_uid_(Isolate *isolate, const agora::rtc::uid_t& uid)
{
    return agora::rtc::NodeUid::getNodeValue(isolate, uid);
}

static Local<Value> napi_get_object_property_value(Isolate* isolate, const Local<Object>& obj, const std::string& propName)
{
    Local<Name> keyName = Nan::New<String>(propName).ToLocalChecked();
    return obj->Get(isolate->GetCurrentContext(), keyName).ToLocalChecked();
}

/**
* get uint32 property from V8 object.
*/
napi_status napi_get_object_property_uint32_(Isolate* isolate, const Local<Object>& obj, const std::string& propName, uint32_t& result)
{
    Local<Value> value = napi_get_object_property_value(isolate, obj, propName);
    return napi_get_value_uint32_(value, result);
}

/**
* get bool property from V8 object.
*/
napi_status napi_get_object_property_bool_(Isolate* isolate, const Local<Object>& obj, const std::string& propName, bool& result)
{
    Local<Value> value = napi_get_object_property_value(isolate, obj, propName);
    return napi_get_value_bool_(value, result);
}

/**
* get int32 property from V8 object.
*/
napi_status napi_get_object_property_int32_(Isolate* isolate, const Local<Object>& obj, const std::string& propName, int32_t& result)
{
    Local<Value> value = napi_get_object_property_value(isolate, obj, propName);
    return napi_get_value_int32_(value, result);
}

/**
* get double property from V8 object.
*/
napi_status napi_get_object_property_double_(Isolate* isolate, const Local<Object>& obj, const std::string& propName, double &result)
{
    Local<Value> value = napi_get_object_property_value(isolate, obj, propName);
    return napi_get_value_double_(value, result);
}

/**
* get int64 property from V8 object.
*/
napi_status napi_get_object_property_int64_(Isolate* isolate, const Local<Object>& obj, const std::string& propName, int64_t& result)
{
    Local<Value> value = napi_get_object_property_value(isolate, obj, propName);
    return napi_get_value_int64_(value, result);
}

/**
* get nodestring property from V8 object.
*/
napi_status napi_get_object_property_nodestring_(Isolate* isolate, const Local<Object>& obj, const std::string& propName, NodeString& nodechar)
{
    Local<Value> value = napi_get_object_property_value(isolate, obj, propName);
    return napi_get_value_nodestring_(value, nodechar);
}

/**
* get nodestring property from V8 object.
*/
napi_status napi_get_object_property_uid_(Isolate* isolate, const Local<Object>& obj, const std::string& propName, agora::rtc::uid_t& uid)
{
    Local<Value> value = napi_get_object_property_value(isolate, obj, propName);
    return agora::rtc::NodeUid::getUidFromNodeValue(value, uid);
}

/**
* get object property from V8 object.
*/
napi_status napi_get_object_property_object_(Isolate* isolate, const Local<Object>& obj, const std::string& propName, Local<Object>& childobj)
{
    Local<Value> value = napi_get_object_property_value(isolate, obj, propName);
    return napi_get_value_object_(isolate, value, childobj);
}

const char* nullable( char const* s)
{
    return (s ? s : "");
}

#ifdef _WIN32
char* U2G(const char* srcstr)
{
    int len = MultiByteToWideChar(CP_UTF8, 0, srcstr, -1, NULL, 0);
    wchar_t* wstr = new wchar_t[len + 1];
    memset(wstr, 0, len + 1);
    MultiByteToWideChar(CP_UTF8, 0, srcstr, -1, wstr, len);
    len = WideCharToMultiByte(CP_ACP, 0, wstr, -1, NULL, 0, NULL, NULL);
    char* deststr = new char[len + 1];
    memset(deststr, 0, len+1);
    WideCharToMultiByte(CP_ACP, 0, wstr, -1, deststr, len, NULL, NULL);
    if(wstr) delete[] wstr;
    return deststr;
}
#endif
