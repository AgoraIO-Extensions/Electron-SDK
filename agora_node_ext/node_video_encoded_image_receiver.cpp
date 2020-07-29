#include "node_video_encoded_image_receiver.h"
#include "node_log.h"

namespace agora {
    namespace rtc {

#define CHECK_NAPI_OBJ(obj) \
    if (obj.IsEmpty()) \
        break;

#define NODE_SET_OBJ_PROP_INT32(obj, name, val) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        CHECK_NAPI_OBJ(propName); \
        Local<Value> propVal = v8::Int32::New(isolate, val); \
        CHECK_NAPI_OBJ(propVal); \
        obj->Set(isolate->GetCurrentContext(), propName, propVal); \
    }

#define NODE_SET_OBJ_PROP_UINT32(obj, name, val) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        CHECK_NAPI_OBJ(propName); \
        Local<Value> propVal = v8::Uint32::New(isolate, val); \
        CHECK_NAPI_OBJ(propVal); \
        obj->Set(isolate->GetCurrentContext(), propName, propVal); \
    }

#define NODE_SET_OBJ_PROP_NUMBER(obj, name, val) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        CHECK_NAPI_OBJ(propName); \
        Local<Value> propVal = v8::Number::New(isolate, val); \
        CHECK_NAPI_OBJ(propVal); \
        obj->Set(isolate->GetCurrentContext(), propName, propVal); \
    }

#define NODE_SET_OBJ_PROP_DATA(obj, name, buffer, length) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        CHECK_NAPI_OBJ(propName); \
        Local<v8::ArrayBuffer> buff = v8::ArrayBuffer::New(isolate, buffer, length); \
        CHECK_NAPI_OBJ(buff); \
        Local<v8::Uint8Array> dataarray = v8::Uint8Array::New(buff, 0, length);\
        CHECK_NAPI_OBJ(buff); \
        obj->Set(isolate->GetCurrentContext(), propName, dataarray); \
    }

        NodeVideoEncodedImageReceiver::NodeVideoEncodedImageReceiver() {

        }
        NodeVideoEncodedImageReceiver::~NodeVideoEncodedImageReceiver() {
            ClearEventHandler();
        }

        bool NodeVideoEncodedImageReceiver::OnEncodedVideoImageReceived(const uint8_t* imageBuffer, unsigned int length, const agora::media::EncodedVideoFrameInfo& videoEncodedFrameInfo) {
            int32_t codecType = (int32_t)videoEncodedFrameInfo.codecType;
            int32_t width = videoEncodedFrameInfo.width;
            int32_t height = videoEncodedFrameInfo.height;
            int32_t frameType = (int32_t)videoEncodedFrameInfo.frameType;
            int32_t rotation = (int32_t)videoEncodedFrameInfo.rotation;
            int64_t renderTimeMs = videoEncodedFrameInfo.renderTimeMs;
            uint8_t* imageBufferCache = (uint8_t*)malloc(sizeof(uint8_t) * length);
            memcpy(imageBufferCache, imageBuffer, sizeof(uint8_t) * length);

            node_async_call::async_call([this, imageBufferCache, length, codecType, width, height, frameType, rotation, renderTimeMs] {             
                Isolate *isolate = Isolate::GetCurrent();
                Local<Context> context = isolate->GetCurrentContext();
                HandleScope scope(isolate);
                Local<Object> obj = Object::New(isolate);
                Local<Object> frameInfoObj = Object::New(isolate);
                do {
                    NODE_SET_OBJ_PROP_DATA(obj, "imageBuffer", imageBufferCache, length);
                    NODE_SET_OBJ_PROP_UINT32(obj, "length", length);
                    NODE_SET_OBJ_PROP_INT32(frameInfoObj, "codecType", codecType);
                    NODE_SET_OBJ_PROP_INT32(frameInfoObj, "width", width);
                    NODE_SET_OBJ_PROP_INT32(frameInfoObj, "height", height);
                    NODE_SET_OBJ_PROP_INT32(frameInfoObj, "frameType", frameType);
                    NODE_SET_OBJ_PROP_INT32(frameInfoObj, "rotation", rotation);
                    NODE_SET_OBJ_PROP_NUMBER(frameInfoObj, "renderTimeMs", renderTimeMs);


                    Local<Value> propName = String::NewFromUtf8(isolate, "videoEncodedFrameInfo", NewStringType::kInternalized).ToLocalChecked(); 
                    CHECK_NAPI_OBJ(propName)
                    obj->Set(isolate->GetCurrentContext(), propName, frameInfoObj); 
                    Local<Value> arg[1] = { obj };
                    if (!callback_.IsEmpty() && !js_this_.IsEmpty()) {
                        callback_.Get(isolate)->Call(context, js_this_.Get(isolate), 1, arg);
                    }
                } while (false);
                free(imageBufferCache);
            });
        }

        void NodeVideoEncodedImageReceiver::AddEventHandler(Persistent<Object>& js_this, Persistent<Function>& callback) {
            js_this_.Reset(js_this);
            callback_.Reset(callback);
        }

        void NodeVideoEncodedImageReceiver::ClearEventHandler() {
            js_this_.Reset();
            callback_.Reset();
        }

    }
}