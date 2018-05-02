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
, m_render(false)
, m_highFPS(15)
, m_FPS(10)
{
    
}

NodeVideoFrameTransporter::~NodeVideoFrameTransporter()
{
    m_stopFlag = 1;
    if (m_thread->joinable())
        m_thread->join();
    if(m_highThread->joinable())
        m_highThread->join();
}

bool NodeVideoFrameTransporter::initialize(v8::Isolate *isolate, const FunctionCallbackInfo<v8::Value> &callbackinfo)
{
    env = isolate;
    callback.Reset(isolate, callbackinfo[0].As<Function>());
    js_this.Reset(isolate, callbackinfo.This());
    m_thread.reset(new std::thread(&NodeVideoFrameTransporter::FlushVideo, this));
    m_highThread.reset(new std::thread(&NodeVideoFrameTransporter::highFlushVideo, this));
    init = true;
    return true;
}

int NodeVideoFrameTransporter::setVideoDimension(NodeRenderType type, agora::rtc::uid_t uid, uint32_t width, uint32_t height)
{
    std::lock_guard<std::mutex> lck(m_lock);
    if (type == NODE_RENDER_TYPE_REMOTE) {
        auto it = m_remoteHighVideoFrames.find(uid);
        if (it != m_remoteHighVideoFrames.end()) {
            it->second.m_destWidth = width;
            it->second.m_destHeight = height;
            return 0;
        }
    }
    VideoFrameInfo& info = getVideoFrameInfo(type, uid);
    info.m_destWidth = width;
    info.m_destHeight = height;
    return 0;
}

VideoFrameInfo& NodeVideoFrameTransporter::getVideoFrameInfo(NodeRenderType type, agora::rtc::uid_t uid)
{
    if (type == NodeRenderType::NODE_RENDER_TYPE_LOCAL) {
        if (!m_localVideoFrame.get())
            m_localVideoFrame.reset(new VideoFrameInfo(NODE_RENDER_TYPE_LOCAL));
        return *m_localVideoFrame.get();
    }
    else if (type == NODE_RENDER_TYPE_REMOTE) {
        auto it = m_remoteVideoFrames.find(uid);
        if (it == m_remoteVideoFrames.end()) {
            m_remoteVideoFrames[uid] = VideoFrameInfo(NODE_RENDER_TYPE_REMOTE, uid);
        }
        return m_remoteVideoFrames[uid];
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
    image_frame_info *info = (image_frame_info*)payload;
    image_header_type *hdr = (image_header_type*)(payload + sizeof(image_frame_info));
    unsigned int uv_len = (info->stride / 2) * (info->height / 2);
    char* y = (char*)(hdr + 1);
    char* u = y + uv_len * 4;
    char* v = u + uv_len;
    std::lock_guard<std::mutex> lck(m_lock);
    VideoFrameInfo& videoInfo = getVideoFrameInfo(NODE_RENDER_TYPE_VIDEO_SOURCE, 0);
    videoInfo.m_bufferList[0].buffer = (unsigned char*)hdr;
    videoInfo.m_bufferList[0].length = sizeof(*hdr);
    videoInfo.m_bufferList[1].buffer = (unsigned char*)y;
    videoInfo.m_bufferList[1].length = uv_len * 4;
    videoInfo.m_bufferList[2].buffer = (unsigned char*)u;
    videoInfo.m_bufferList[2].length = uv_len;
    videoInfo.m_bufferList[3].buffer = (unsigned char*)v;
    videoInfo.m_bufferList[3].length = uv_len;
    videoInfo.m_count = 0;
    videoInfo.m_needUpdate = true;
    return 0;
}

int NodeVideoFrameTransporter::deliverFrame_I420(NodeRenderType type, agora::rtc::uid_t uid, const agora::media::IVideoFrame& videoFrame, int rotation, bool mirrored)
{
    int stride, stride0 = videoFrame.stride(IVideoFrame::Y_PLANE);
    stride = stride0;
    if (stride & 0xf) {
        stride = (((stride + 15) >> 4) << 4);
    }
    rotation = rotation < 0 ? rotation + 360 : rotation;
    std::lock_guard<std::mutex> lck(m_lock);
    VideoFrameInfo& info = getVideoFrameInfo(type, uid);
    int destWidth = info.m_destWidth ? info.m_destWidth : videoFrame.width();
    int destHeight = info.m_destHeight ? info.m_destHeight : videoFrame.height();
    size_t imageSize = sizeof(image_header_type) + destWidth * destHeight * 3 / 2;
    auto s = info.m_buffer.size();
    if (s < imageSize || s >= imageSize * 2)
        info.m_buffer.resize(imageSize);
    image_header_type* hdr = reinterpret_cast<image_header_type*>(&info.m_buffer[0]);
    hdr->mirrored = mirrored ? 1 : 0;
    hdr->rotation = htons(rotation);
    setupFrameHeader(hdr, destWidth, destWidth, destHeight);
    
    copyFrame(videoFrame, info, destWidth, stride0, destWidth, destHeight);
    info.m_count = 0;
    info.m_needUpdate = true;
    return 0;
    
}

void NodeVideoFrameTransporter::setupFrameHeader(image_header_type*header, int stride, int width, int height)
{
    int left = 0;
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
    int width2 = width / 2, heigh2 = height / 2;
    int strideY = videoFrame.stride(IVideoFrame::Y_PLANE);
    int strideU = videoFrame.stride(IVideoFrame::U_PLANE);
    int strideV = videoFrame.stride(IVideoFrame::V_PLANE);

    unsigned char* y = &info.m_buffer[0] + sizeof(image_header_type);
    unsigned char* u = y + dest_stride * height;
    unsigned char* v = u + width2 * heigh2;
    const unsigned char* planeY = videoFrame.buffer(IVideoFrame::Y_PLANE);
    const unsigned char* planeU = videoFrame.buffer(IVideoFrame::U_PLANE);
    const unsigned char* planeV = videoFrame.buffer(IVideoFrame::V_PLANE);

    I420Scale(planeY, strideY, planeU, strideU, planeV, strideV, videoFrame.width(), videoFrame.height(), (uint8*)y, width, (uint8*)u, width2, (uint8*)v, width2, width, height, kFilterNone);

    info.m_bufferList[0].buffer = &info.m_buffer[0];
    info.m_bufferList[0].length = sizeof(image_header_type);

    info.m_bufferList[1].buffer = y;
    info.m_bufferList[1].length = dest_stride * height;

    info.m_bufferList[2].buffer = u;
    info.m_bufferList[2].length = width2 * heigh2;

    info.m_bufferList[3].buffer = v;
    info.m_bufferList[3].length = width2 * heigh2;
}

VideoFrameInfo& NodeVideoFrameTransporter::getHighVideoFrameInfo(agora::rtc::uid_t uid)
{
    auto it = m_remoteHighVideoFrames.find(uid);
    if (it == m_remoteHighVideoFrames.end()) {
        m_remoteHighVideoFrames[uid] = VideoFrameInfo(NODE_RENDER_TYPE_REMOTE, uid);
    }
    return m_remoteHighVideoFrames[uid];
}

void NodeVideoFrameTransporter::addToHighVideo(agora::rtc::uid_t uid)
{
    std::lock_guard<std::mutex> lck(m_lock);
    auto it = m_remoteVideoFrames.find(uid);
    if(it != m_remoteVideoFrames.end())
        m_remoteVideoFrames.erase(it);
    getHighVideoFrameInfo(uid);
}

void NodeVideoFrameTransporter::removeFromeHighVideo(agora::rtc::uid_t uid)
{
    std::lock_guard<std::mutex> lck(m_lock);
    auto it = m_remoteHighVideoFrames.find(uid);
    if(it != m_remoteHighVideoFrames.end())
        m_remoteHighVideoFrames.erase(it);
    getVideoFrameInfo(NODE_RENDER_TYPE_REMOTE, uid);
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
        Local<Value> propVal = v8::Int32::New(isolate, val); \
        obj->Set(isolate->GetCurrentContext(), propName, propVal); \
    }
#define NODE_SET_OBJ_PROP_HEADER(obj, it) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, "header", NewStringType::kInternalized).ToLocalChecked(); \
        Local<v8::ArrayBuffer> buff = v8::ArrayBuffer::New(isolate, (it)->buffer, (it)->length); \
        obj->Set(isolate->GetCurrentContext(), propName, buff); \
    }

#define NODE_SET_OBJ_PROP_DATA(obj, name, it) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        Local<v8::ArrayBuffer> buff = v8::ArrayBuffer::New(isolate, (it)->buffer, (it)->length); \
        Local<v8::Uint8Array> dataarray = v8::Uint8Array::New(buff, 0, it->length);\
        obj->Set(isolate->GetCurrentContext(), propName, dataarray); \
    }

bool AddObj(Isolate* isolate, Local<v8::Array>& infos, int index, VideoFrameInfo& info)
{
    if (!info.m_needUpdate)
        return false;
    info.m_needUpdate = false;
    Local<v8::Object> obj = Object::New(isolate);
    NODE_SET_OBJ_PROP_UINT32(obj, "type", info.m_renderType);
    NODE_SET_OBJ_PROP_UINT32(obj, "uid", info.m_uid);
    auto it = info.m_bufferList.begin();
    NODE_SET_OBJ_PROP_HEADER(obj, it);
    ++it;
    NODE_SET_OBJ_PROP_DATA(obj, "ydata", it);
    ++it;
    NODE_SET_OBJ_PROP_DATA(obj, "udata", it);
    ++it;
    NODE_SET_OBJ_PROP_DATA(obj, "vdata", it);
    infos->Set(index, obj);
    return true;
}
void NodeVideoFrameTransporter::FlushVideo()
{
    while (!m_stopFlag) {
        {
                agora::rtc::node_async_call::async_call([this]() {
                    Isolate *isolate = env;
                    HandleScope scope(isolate);
                    std::lock_guard<std::mutex> lock(m_lock);
                    int count = m_remoteVideoFrames.size();
                    count += m_localVideoFrame.get() ? 1 : 0;
                    count += m_devTestVideoFrame.get() ? 1 : 0;
                    count += m_videoSourceVideoFrame.get() ? 1 : 0;
                    Local<v8::Array> infos = v8::Array::New(isolate);
                    
                    uint32_t i = 0;
                    for (auto& it : m_remoteVideoFrames) {
                        if (AddObj(isolate, infos, i, it.second))
                            ++i;
                        else {
                            ++it.second.m_count;
                        }
                    }
                    if (m_localVideoFrame.get()) {
                        if (AddObj(isolate, infos, i, *m_localVideoFrame.get()))
                            ++i;
                        else {
                            ++m_localVideoFrame->m_count;
                        }
                    }

                    if (m_videoSourceVideoFrame.get()) {
                        if (AddObj(isolate, infos, i, *m_videoSourceVideoFrame.get()))
                            ++i;
                        else {
                            ++m_videoSourceVideoFrame->m_count;
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
                        callback.Get(isolate)->Call(js_this.Get(isolate), 1, args);
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
            agora::rtc::node_async_call::async_call([this]() {
                Isolate *isolate = env;
                HandleScope scope(isolate);
                std::lock_guard<std::mutex> lock(m_lock);
                Local<v8::Array> infos = v8::Array::New(isolate);
                
                uint32_t i = 0;
                for (auto& it : m_remoteHighVideoFrames) {
                    if (AddObj(isolate, infos, i, it.second))
                        ++i;
                    else {
                        ++it.second.m_count;
                    }
                }
                if (i > 0) {
                    Local<v8::Value> args[1] = { infos };
                    callback.Get(isolate)->Call(js_this.Get(isolate), 1, args);
                }
            });
            std::this_thread::sleep_for(std::chrono::milliseconds(1000 / m_highFPS));
        }
    }
}

//bool NodeVideoFrameTransporter::deliveryFrame(enum NodeRenderType type, agora::rtc::uid_t uid, const buffer_list& buffers)
//{
//    std::lock_guard<std::mutex> lck(m_lock);
//    VideoFrameInfo& info = m_videoFrames[uid];
//}

//bool NodeVideoFrameTransporter::deliveryFrame1(enum NodeRenderType type, agora::rtc::uid_t uid, const buffer_list &buffers)
//{
//    if (!init) {
//        LOG_ERROR("NodeVideoFrameTransporter not init");
//        return false;
//    }
//    
//    Isolate *isolate = env;//Isolate::GetCurrent();
//    HandleScope scope(isolate);
//    Local<Value> args[6];
//    args[0] = napi_create_uint32_(isolate, type);
//    args[1] = napi_create_uid_(isolate, uid);
//    int index = 2;
//    for (auto it = buffers.begin(); it != buffers.end(); ++it, ++index) {
//        Local<v8::ArrayBuffer> buff = v8::ArrayBuffer::New(isolate, it->buffer, it->length);
//        if (it != buffers.begin()) {
//            Local<v8::Uint8Array> array = v8::Uint8Array::New(buff, 0, it->length);
//            args[index] = array;
//        }
//        else {
//            args[index] = buff;
//        }
//    }
//    callback.Get(isolate)->Call(js_this.Get(isolate), 6, args);
//    return true;
//}

int napi_get_value_string_utf8_(const Local<Value>& str, char *buffer, uint32_t len)
{
    if (!str->IsString())
        return 0;
    if (!buffer) {
        return str.As<String>()->Utf8Length();
    }
    else {
        int copied = str.As<String>()->WriteUtf8(buffer, len - 1, nullptr, String::REPLACE_INVALID_UTF8 | String::NO_NULL_TERMINATION);
        buffer[copied] = '\0';
        return copied;
    }
}

napi_status napi_get_value_uint32_(const Local<Value>& value, uint32_t& result)
{
    if (!value->IsUint32())
        return napi_invalid_arg;
    result = value->Uint32Value();
    return napi_ok;
}

napi_status napi_get_value_bool_(const Local<Value>& value, bool& result)
{
    if(!value->IsBoolean())
        return napi_invalid_arg;
    result = value->BooleanValue();
    return napi_ok;
}
	
napi_status napi_get_value_int32_(const Local<Value>& value, int32_t& result)
{
    if (!value->IsInt32())
        return napi_invalid_arg;
    result = value->Int32Value();
    return napi_ok;
}

napi_status napi_get_value_double_(const Local<Value>& value, double &result)
{
    if (!value->IsNumber())
        return napi_invalid_arg;

    result = value->NumberValue();
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
    return String::NewFromUtf8(isolate, value ? value : "");
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
    Local<Name> keyName = String::NewFromUtf8(isolate, propName.c_str(), NewStringType::kInternalized).ToLocalChecked();
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
