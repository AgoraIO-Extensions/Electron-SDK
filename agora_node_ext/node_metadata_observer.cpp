#include "node_metadata_observer.h"

namespace agora {
    namespace rtc {

#define CHECK_NAPI_OBJ(obj) \
    if (obj.IsEmpty()) \
        return;

#define NODE_SET_OBJ_PROP_STRING(obj, name, val) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        CHECK_NAPI_OBJ(propName); \
        Local<Value> propVal = String::NewFromUtf8(isolate, val, NewStringType::kInternalized).ToLocalChecked(); \
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

#define NODE_SET_OBJ_PROP_UID(obj, name, val) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        CHECK_NAPI_OBJ(propName); \
        Local<Value> propVal = NodeUid::getNodeValue(isolate, val); \
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

        NodeMetadataObserver::NodeMetadataObserver() {

        }

        NodeMetadataObserver::~NodeMetadataObserver() {
            clearData();
        }

        void NodeMetadataObserver::clearData() {
            std::lock_guard<std::mutex> lock(queueMutex);
            js_this.Reset();
            callback.Reset();
            messageSendCallback.Reset();
            while(!messageQueue.empty()){
                Metadata *metadata = messageQueue.front();
                if (metadata) {
                    if (metadata->buffer) {
                        free(metadata->buffer);
                        metadata->buffer = NULL;
                    }
                    delete metadata;
                    metadata = NULL;
                }
                messageQueue.pop();
            }  
        }

        int NodeMetadataObserver::getMaxMetadataSize() {
            return MAX_META_DATA_SIZE;
        }

        bool NodeMetadataObserver::onReadyToSendMetadata(Metadata& metadata, VIDEO_SOURCE_TYPE source_type) {
            std::lock_guard<std::mutex> lock(queueMutex);
            if (!messageQueue.empty() && messageQueue.size() > 0) {
                Metadata *cachedMetadata = messageQueue.front();
                if (cachedMetadata) {
                    metadata.uid = cachedMetadata->uid;
                    metadata.size = cachedMetadata->size;
                    metadata.timeStampMs = cachedMetadata->timeStampMs;
                    if (cachedMetadata->buffer) {
                        memcpy(metadata.buffer, cachedMetadata->buffer, metadata.size * sizeof(char));
                        cachedMetadata->buffer[cachedMetadata->size * sizeof(char)] = '\0';
                        metadata.buffer[(metadata.size) * sizeof(char)] = '\0';
                        unsigned int _uid = cachedMetadata->uid;
                        unsigned int _size = cachedMetadata->size;
                        std::string _buffer((char *)cachedMetadata->buffer);
                        long long _timeStampMs = cachedMetadata->timeStampMs;
                        node_async_call::async_call([this, _uid, _size, _buffer, _timeStampMs] {
                            Isolate *isolate = Isolate::GetCurrent();
                            Local<Context> context = isolate->GetCurrentContext();
                            HandleScope scope(isolate);
                            Local<Object> obj = Object::New(isolate);
                            NODE_SET_OBJ_PROP_UINT32(obj, "uid", _uid);
                            NODE_SET_OBJ_PROP_UINT32(obj, "size", _size);
                            NODE_SET_OBJ_PROP_STRING(obj, "buffer", _buffer.c_str());
                            NODE_SET_OBJ_PROP_NUMBER(obj, "timeStampMs", _timeStampMs);
                            Local<Value> arg[1] = { obj };
                            if (!messageSendCallback.IsEmpty() && !js_this.IsEmpty()) {
                                messageSendCallback.Get(isolate)->Call(context, js_this.Get(isolate), 1, arg);
                            }
                        });
                        free(cachedMetadata->buffer);
                        cachedMetadata->buffer = NULL;
                    }
                    delete cachedMetadata;
                    cachedMetadata = NULL;
                }
                messageQueue.pop();
                return true;
            }
            return false;
        }

        void NodeMetadataObserver::onMetadataReceived(const Metadata &metadata) {
            unsigned int _uid = metadata.uid;
            unsigned int _size = metadata.size;
            long long _timeStampMs = metadata.timeStampMs;
            //#if defined(_WIN32)
            char cacheBuffer[1024] = {0};
            memcpy(cacheBuffer, metadata.buffer, _size * sizeof(char));
            cacheBuffer[_size * sizeof(char)] = '\0';
            std::string metaBuffer(cacheBuffer);
            // #else
            // void *cachePtr = malloc(_size + 1);
            // if (cachePtr) {
            //     memset(cachePtr, 0, _size);
            //     memcpy(cachePtr, metadata.buffer, _size);
            //     char *cacheBuffer = (char *)cachePtr;
            //     cacheBuffer[_size] = 0;
            //     std::string metaBuffer(cacheBuffer);
            //     free(cacheBuffer);
            //     cacheBuffer = NULL;
            // } else {
            //     return;
            // }
            // #endif
            node_async_call::async_call([this, _uid, _size, metaBuffer, _timeStampMs] {             
                Isolate *isolate = Isolate::GetCurrent();
                Local<Context> context = isolate->GetCurrentContext();
                HandleScope scope(isolate);
                Local<Object> obj = Object::New(isolate);
                NODE_SET_OBJ_PROP_UINT32(obj, "uid", _uid);
                NODE_SET_OBJ_PROP_UINT32(obj, "size", _size);
                NODE_SET_OBJ_PROP_STRING(obj, "buffer", metaBuffer.c_str());
                NODE_SET_OBJ_PROP_NUMBER(obj, "timeStampMs", _timeStampMs);
                Local<Value> arg[1] = { obj };
                if (!callback.IsEmpty() && !js_this.IsEmpty()) {
                    callback.Get(isolate)->Call(context, js_this.Get(isolate), 1, arg);
                }
            });
        }

        int NodeMetadataObserver::addEventHandler(Persistent<Object>& obj, Persistent<Function>& _callback, Persistent<Function>& _callback2) {
            std::lock_guard<std::mutex> lock(queueMutex);
            js_this.Reset(obj);
            callback.Reset(_callback);
            messageSendCallback.Reset(_callback2);
            return 0;
        }

        int NodeMetadataObserver::sendMetadata(unsigned int uid, unsigned int size, unsigned char *buffer, long long timeStampMs) {
            std::lock_guard<std::mutex> lock(queueMutex);
            if (messageQueue.size() > 50) {
                Metadata *metadata = messageQueue.front();
                if (metadata) {
                    if (metadata->buffer) {
                        free(metadata->buffer);
                        metadata->buffer = NULL;
                    }
                    delete metadata;
                    metadata = NULL;
                }
                messageQueue.pop();
            }
            Metadata *metadata = new Metadata();
            metadata->uid = uid;
            metadata->size = size;
            unsigned int memorySize = (size + 1) * sizeof(char);
            void *cachePtr = malloc(memorySize);
            if (cachePtr) {
                metadata->buffer = (unsigned char *) cachePtr;
                memset(cachePtr, 0, memorySize);
                memcpy(metadata->buffer, buffer, size * sizeof(char));
                metadata->timeStampMs = timeStampMs;
                messageQueue.push(metadata);
            }
            return 0;
        }

        int NodeMetadataObserver::setMaxMetadataSize(int size) {
            MAX_META_DATA_SIZE = size;
            return 0;
        }
    }
}
