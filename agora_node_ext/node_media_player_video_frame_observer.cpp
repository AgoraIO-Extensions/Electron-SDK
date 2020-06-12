#include "node_media_player_video_frame_observer.h"

namespace agora {
    namespace rtc {

        NodeMediaPlayerVideoFrameObserver::NodeMediaPlayerVideoFrameObserver() {
            
        }

        NodeMediaPlayerVideoFrameObserver::~NodeMediaPlayerVideoFrameObserver() {
            mIsolate = nullptr;
            mCallback.Reset();
            mJsThis.Reset();
            dataList.clear();
            dataList.resize(0);
        }

        void NodeMediaPlayerVideoFrameObserver::onFrame(const agora::media::base::VideoFrame* frame) {
            
            LOG_F(INFO, "onFrame");

            // std::unique_lock<std::mutex> lck(m_lock);
            // imageHeader.format = htons(0);
            // imageHeader.width = htons(frame->width);
            // imageHeader.height = htons(frame->height);
            // imageHeader.left = htons(0);
            // imageHeader.top = htons(0);
            // imageHeader.right = htons(0);
            // imageHeader.bottom = htons(0);

            // size_t videoFrameSize = sizeof(image_header_type) + frame->width * frame->height * 3 / 2;

            // if (dataList.size() < videoFrameSize || dataList.size() > (videoFrameSize * 2))
            // {
            //     dataList.resize(videoFrameSize);
            // }

            // uint32_t frameWidth = frame->width;
            // uint32_t frameHeight = frame->height;

            // unsigned char *yData = &dataList[0];
            // unsigned char *uData = yData + frameWidth * frameHeight;
            // unsigned char *vData = uData + frameWidth * frameHeight / 4;

            // memcpy(yData, frame->yBuffer, frameWidth * frameHeight);
            // memcpy(uData, frame->uBuffer, frameWidth * frameHeight);
            // memcpy(vData, frame->vBuffer, frameWidth * frameHeight);

            // bufferList[0].buffer = (unsigned char *)&imageHeader;
            // bufferList[0].length = sizeof(image_header_type);
            // bufferList[1].buffer = &dataList[0];
            // bufferList[1].length = frameWidth * frameHeight;
            // bufferList[2].buffer = &dataList[0] + bufferList[1].length;
            // bufferList[2].length = frameWidth * frameHeight / 4;
            // bufferList[3].buffer = bufferList[2].buffer + frameWidth * frameHeight / 4;
            // bufferList[3].length = frameWidth * frameHeight / 4;
            // lck.unlock();

            // agora::rtc::node_async_call::async_call([this]() {
            //     v8::Isolate* isolate = mIsolate;
            //     std::unique_lock<std::mutex> lock(m_lock);
            //     // Local<v8::Array> infos = v8::Array::New(isolate);
            //     Local<v8::Object> obj = Object::New(isolate);
            //     auto it = bufferList.begin();
            //     NODE_SET_OBJ_PROP_HEADER(obj, it);
            //     ++it;
            //     NODE_SET_OBJ_PROP_DATA(obj, "ydata", it);
            //     ++it;
            //     NODE_SET_OBJ_PROP_DATA(obj, "udata", it);
            //     ++it;
            //     NODE_SET_OBJ_PROP_DATA(obj, "vdata", it);
            //    // infos->Set(mIsolate->GetCurrentContext(), 0, obj).FromJust();
            //     Local<v8::Value> args[1] = { obj };
            //     mCallback.Get(isolate)->Call(isolate->GetCurrentContext(), mJsThis.Get(isolate), 1, args);
            //     lock.unlock();
            // });
        }

        void NodeMediaPlayerVideoFrameObserver::initialize(v8::Isolate *isolate, const Nan::FunctionCallbackInfo<v8::Value> &callbackinfo) {
            mIsolate = isolate;
            mCallback.Reset(callbackinfo[0].As<Function>());
            mJsThis.Reset(callbackinfo.This()); 
        }
    }
}