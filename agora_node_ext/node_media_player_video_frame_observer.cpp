#include "node_media_player_video_frame_observer.h"
#include <chrono>
#include "IAgoraMediaEngine.h"
#include "loguru.hpp"
#include "libyuv.h"


namespace agora {
    namespace rtc {

        long long GetHighAccuracyTickCount() {
            auto tse = std::chrono::system_clock::now();
            auto milliseconds = std::chrono::duration_cast<std::chrono::milliseconds>(tse.time_since_epoch()).count();
            return milliseconds;
        }

        NodeMediaPlayerVideoFrameObserver::NodeMediaPlayerVideoFrameObserver() {
            LOG_F(INFO, "NodeMediaPlayerVideoFrameObserver::NodeMediaPlayerVideoFrameObserver contruct");
        }

        NodeMediaPlayerVideoFrameObserver::~NodeMediaPlayerVideoFrameObserver() {
            mIsolate = nullptr;
            mCallback.Reset();
            mJsThis.Reset();
            dataList.clear();
            dataList.resize(0);
            LOG_F(INFO, "NodeMediaPlayerVideoFrameObserver::~NodeMediaPlayerVideoFrameObserver");
        }

        void NodeMediaPlayerVideoFrameObserver::onFrame(const agora::media::base::VideoFrame* frame) {
            std::unique_lock<std::mutex> lck(m_lock); 

            if (isPublishVideoFrame && rtc_engine_) {
                int size = frame->width * frame->height;
                unsigned char *tmp = (unsigned char *)malloc(size * 3/2);
                memcpy(tmp, frame->yBuffer, size);
                memcpy(tmp + size, frame->uBuffer, size >> 2);
                memcpy(tmp+ size + frame->width * frame->height/4, frame->vBuffer, size >> 2);
                agora::media::ExternalVideoFrame vframe;
                vframe.stride = frame->yStride;
                vframe.height = frame->height;
                vframe.timestamp = static_cast<long long>(GetHighAccuracyTickCount());
                vframe.rotation = realRotation;
                vframe.type = agora::media::ExternalVideoFrame::VIDEO_BUFFER_TYPE::VIDEO_BUFFER_RAW_DATA;
                vframe.format = agora::media::ExternalVideoFrame::VIDEO_PIXEL_FORMAT::VIDEO_PIXEL_I420;
                vframe.cropLeft = 0;
                vframe.cropTop = 0;
                vframe.cropBottom = 0;
                vframe.cropRight = 0;
                vframe.buffer = tmp;
                agora::util::AutoPtr<agora::media::IMediaEngine> mediaEngine;
                mediaEngine.queryInterface(rtc_engine_, agora::AGORA_IID_MEDIA_ENGINE);

                if (mediaEngine)
                    mediaEngine->pushVideoFrame(&vframe);

                free(tmp);
            }
            
            int _realWidth;
            int _realHeight;
            int _yStride;
            int _uStride;
            int _vStride;

            if (frame->width % 4 != 0 || frame->height % 4 != 0 || _yStride != frame->width) {
                _realWidth = frame->width / 4 * 4;
                _realHeight = frame->height / 4 * 4;
                _yStride = _realWidth;
                _uStride = _realWidth/2;
                _vStride = _realWidth/2;
            } else {
                _realWidth = frame->width;
                _realHeight = frame->height;
                _yStride = frame->yStride;
                _uStride = frame->uStride;
                _vStride = frame->vStride;
            }
            
            imageHeader.format = htons(0);
            imageHeader.mirrored = htons(0);
            imageHeader.width = htons(_realWidth);
            imageHeader.height = htons(_realHeight);
            imageHeader.left = htons(0);
            imageHeader.top = htons(0);
            imageHeader.right = htons(0);
            imageHeader.bottom = htons(0);
            imageHeader.rotation = htons(realRotation);
            imageHeader.timestamp = htons(frame->renderTimeMs);
            size_t videoFrameSize = _yStride * _realHeight + _uStride * _realHeight / 2 + _vStride * _realHeight / 2;
            if (dataList.size() < videoFrameSize || dataList.size() > (videoFrameSize * 2))
            {
                dataList.resize(videoFrameSize);
            }
 
            unsigned char *yData = &dataList[0];
            unsigned char *uData = yData + _yStride * _realHeight;
            unsigned char *vData = uData + _uStride * _realHeight / 2;
            if (frame->width % 4 != 0 || frame->height % 4 != 0 || _yStride != frame->width) {
                libyuv::I420Scale(frame->yBuffer, frame->yStride, frame->uBuffer, frame->uStride, frame->vBuffer, frame->vStride, frame->width, frame->height, (uint8*)yData, _yStride, (uint8*)uData, _uStride, (uint8*)vData, _vStride, _realWidth, _realHeight, libyuv::kFilterNone);
            } else {
                memcpy(yData, frame->yBuffer, _yStride * _realHeight);
                memcpy(uData, frame->uBuffer, _uStride * _realHeight / 2);
                memcpy(vData, frame->vBuffer, _vStride * _realHeight / 2);
            }
            bufferList[0].buffer = (unsigned char *)&imageHeader;
            bufferList[0].length = sizeof(image_header_type);
            bufferList[1].buffer = &dataList[0];
            bufferList[1].length = _yStride * _realHeight;
            bufferList[2].buffer = bufferList[1].buffer + bufferList[1].length;
            bufferList[2].length = _uStride * _realHeight / 2;
            bufferList[3].buffer = bufferList[2].buffer + bufferList[2].length;
            bufferList[3].length = _vStride * _realHeight / 2;
            lck.unlock();
            agora::rtc::node_async_call::async_call([this]() {
                v8::Isolate* isolate = mIsolate;
                std::unique_lock<std::mutex> lock(m_lock);
                // Local<v8::Array> infos = v8::Array::New(isolate);
                Local<v8::Object> obj = Object::New(isolate);
                auto it = bufferList.begin();
                NODE_SET_OBJ_PROP_HEADER(obj, it);
                ++it;
                NODE_SET_OBJ_PROP_DATA(obj, "ydata", it);
                ++it;
                NODE_SET_OBJ_PROP_DATA(obj, "udata", it);
                ++it;
                NODE_SET_OBJ_PROP_DATA(obj, "vdata", it);
                Local<v8::Value> args[1] = { obj };
                mCallback.Get(isolate)->Call(isolate->GetCurrentContext(), mJsThis.Get(isolate), 1, args);
                lock.unlock();
            });
        }

        int NodeMediaPlayerVideoFrameObserver::setVideoRotation(int rotation) {
            realRotation = rotation;
            return 0;
        }

        void NodeMediaPlayerVideoFrameObserver::initialize(v8::Isolate *isolate, const Nan::FunctionCallbackInfo<v8::Value> &callbackinfo) {
            mIsolate = isolate;
            mCallback.Reset(callbackinfo[0].As<Function>());
            mJsThis.Reset(callbackinfo.This()); 
        }

        void NodeMediaPlayerVideoFrameObserver::publishVideoToRtc(IRtcEngine *rtc_engine) {
            std::unique_lock<std::mutex> lck(m_lock);
            isPublishVideoFrame = true;
            rtc_engine_ = rtc_engine;
        }
        
        void NodeMediaPlayerVideoFrameObserver::unpublishVideoToRtc() {
            std::unique_lock<std::mutex> lck(m_lock);
            isPublishVideoFrame = false;
            rtc_engine_ = nullptr;
        }


    }
}