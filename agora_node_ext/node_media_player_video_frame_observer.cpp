#include "node_media_player_video_frame_observer.h"


namespace agora {
    namespace rtc {

        NodeMediaPlayerVideoFrameObserver::NodeMediaPlayerVideoFrameObserver() {
            LOG_F(INFO, "NodeMediaPlayerVideoFrameObserver::NodeMediaPlayerVideoFrameObserver");
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
            imageHeader.format = htons(0);
            imageHeader.mirrored = htons(0);
            imageHeader.width = htons(frame->width);
            imageHeader.height = htons(frame->height);
            imageHeader.left = htons(0);
            imageHeader.top = htons(0);
            imageHeader.right = htons(0);
            imageHeader.bottom = htons(0);
            imageHeader.rotation = htons(realRotation);
            imageHeader.timestamp = htons(frame->renderTimeMs);
            size_t videoFrameSize = frame->yStride * frame->height + frame->uStride * frame->height / 2 + frame->vStride * frame->height / 2;
            if (dataList.size() < videoFrameSize || dataList.size() > (videoFrameSize * 2))
            {
                dataList.resize(videoFrameSize);
            }
 
            uint32_t frameWidth = frame->width;
            uint32_t frameHeight = frame->height;
            unsigned char *yData = &dataList[0];
            unsigned char *uData = yData + frame->yStride * frame->height;
            unsigned char *vData = uData + frame->uStride * frame->height / 2;
            memcpy(yData, frame->yBuffer, frame->yStride * frame->height);
            memcpy(uData, frame->uBuffer, frame->uStride * frame->height / 2);
            memcpy(vData, frame->vBuffer, frame->vStride * frame->height / 2);

            bufferList[0].buffer = (unsigned char *)&imageHeader;
            bufferList[0].length = sizeof(image_header_type);
            bufferList[1].buffer = &dataList[0];
            bufferList[1].length = frame->yStride * frame->height;
            bufferList[2].buffer = bufferList[1].buffer + bufferList[1].length;
            bufferList[2].length = frame->uStride * frame->height / 2;
            bufferList[3].buffer = bufferList[2].buffer + bufferList[2].length;
            bufferList[3].length = frame->vStride * frame->height / 2;
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
    }
}