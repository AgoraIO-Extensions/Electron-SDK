#ifndef NODE_MEDIA_PLAYER_VIDEO_FRAME_OBSERVER
#define NODE_MEDIA_PLAYER_VIDEO_FRAME_OBSERVER
#include "IAgoraMediaPlayer.h"
#include <unordered_map>
#include "node_napi_api.h"
#include "node_async_queue.h"
#include <string>
#include <uv.h>
#include <node.h>
#include "loguru.hpp"
#include <mutex>
#include "IAgoraRtcEngine.h"

namespace agora {
    namespace rtc {

#define NODE_SET_OBJ_PROP_UINT32(obj, name, val) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        CHECK_NAPI_OBJ(propName); \
        Local<Value> propVal = v8::Uint32::New(isolate, val); \
        CHECK_NAPI_OBJ(propVal); \
        v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, propVal); \
    }

#define NODE_SET_OBJ_PROP_HEADER(obj, it) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, "header", NewStringType::kInternalized).ToLocalChecked(); \
        Local<v8::ArrayBuffer> buff = v8::ArrayBuffer::New(isolate, (it)->buffer, (it)->length); \
        v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, buff); \
    }

#define NODE_SET_OBJ_PROP_DATA(obj, name, it) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        Local<v8::ArrayBuffer> buff = v8::ArrayBuffer::New(isolate, (it)->buffer, (it)->length); \
        Local<v8::Uint8Array> dataarray = v8::Uint8Array::New(buff, 0, it->length);\
        v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, dataarray); \
    }

        class NodeMediaPlayerVideoFrameObserver : public agora::media::base::IVideoFrameObserver {          

            public:
                NodeMediaPlayerVideoFrameObserver();
                ~NodeMediaPlayerVideoFrameObserver();

                virtual void onFrame(const agora::media::base::VideoFrame* frame) override;
                virtual void initialize(v8::Isolate *isolate, const Nan::FunctionCallbackInfo<v8::Value> &callbackinfo);
                virtual int setVideoRotation(int rotation);

                struct image_frame_info {
                    int stride;
                    int stride0;
                    int width;
                    int height;
                    int strideU;
                    int strideV;
                };

                struct image_header_type {
                    unsigned char format;
                    unsigned char mirrored;
                    unsigned short width;
                    unsigned short height;
                    unsigned short left;
                    unsigned short top;
                    unsigned short right;
                    unsigned short bottom;
                    unsigned short rotation;
                    unsigned int timestamp;
                };

                struct buffer_info {
                    unsigned char* buffer;
                    uint32_t length;
                };

                void publishVideoToRtc(IRtcEngine *rtc_engine);
                void unpublishVideoToRtc();
                
            private:
                v8::Isolate* mIsolate;
                Nan::Persistent<Function> mCallback;
                Nan::Persistent<Object> mJsThis;
                std::vector<unsigned char> dataList;
                image_header_type imageHeader;
                std::mutex m_lock;
                std::array<buffer_info, 4> bufferList;
                int realRotation = 0;
                bool isPublishVideoFrame = false;
                IRtcEngine *rtc_engine_ = nullptr;
         };
    }
}
#endif