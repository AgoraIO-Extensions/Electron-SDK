#ifndef AGORA_ELECTRON_NODE_MEDIA_PLAYER_OBSERVER
#define AGORA_ELECTRON_NODE_MEDIA_PLAYER_OBSERVER
#include "IAgoraMediaPlayerSource.h"
#include "IAgoraMediaPlayer.h"
#include <unordered_map>
#include "node_napi_api.h"
#include "node_async_queue.h"
#include <string>
#include <uv.h>
#include "loguru.hpp"

namespace agora {
    namespace rtc {

#define MEDIA_PLAYER_ON_PLAYER_STATE_CHANGED "onPlayerStateChanged"
#define MEDIA_PLAYER_ON_POSITION_CHANGED "onPositionChanged"
#define MEDIA_PLAYER_ON_PLAY_EVENT "onPlayEvent"
#define MEDIA_PLAYER_ON_META_DATA "onMetaData"
#define MEDIA_PLAYER_ON_FIRE_API_ERROR "onApiError"


#define MEDIA_PLAYER_MAKE_JS_CALL_0(ev) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            Local<Context> context = isolate->GetCurrentContext();\
            MediaPlayerEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 0, nullptr);\
        }

#define MEDIA_PLAYER_MAKE_JS_CALL_1(ev, type, param) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            Local<Context> context = isolate->GetCurrentContext();\
            Local<Value> argv[1]{ napi_create_##type##_(isolate, param)\
                                };\
            MediaPlayerEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 1, argv);\
        }

#define MEDIA_PLAYER_MAKE_JS_CALL_2(ev, type1, param1, type2, param2) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            Local<Context> context = isolate->GetCurrentContext();\
            Local<Value> argv[2]{ napi_create_##type1##_(isolate, param1),\
                                  napi_create_##type2##_(isolate, param2)\
                                };\
            MediaPlayerEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 2, argv);\
        }

#define MEDIA_PLAYER_MAKE_JS_CALL_3(ev, type1, param1, type2, param2, type3, param3) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            Local<Context> context = isolate->GetCurrentContext();\
            Local<Value> argv[3]{ napi_create_##type1##_(isolate, param1),\
                                  napi_create_##type2##_(isolate, param2),\
                                  napi_create_##type3##_(isolate, param3) \
                                };\
            MediaPlayerEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 3, argv);\
        }

#define MEDIA_PLAYER_MAKE_JS_CALL_4(ev, type1, param1, type2, param2, type3, param3, type4, param4) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            Local<Context> context = isolate->GetCurrentContext();\
            Local<Value> argv[4]{ napi_create_##type1##_(isolate, param1),\
                                  napi_create_##type2##_(isolate, param2),\
                                  napi_create_##type3##_(isolate, param3), \
                                  napi_create_##type4##_(isolate, param4), \
                                };\
            MediaPlayerEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 4, argv);\
        }

#define MEDIA_PLAYER_MAKE_JS_CALL_5(ev, type1, param1, type2, param2, type3, param3, type4, param4, type5, param5) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            Local<Context> context = isolate->GetCurrentContext();\
            Local<Value> argv[5]{ napi_create_##type1##_(isolate, param1),\
                                  napi_create_##type2##_(isolate, param2),\
                                  napi_create_##type3##_(isolate, param3), \
                                  napi_create_##type4##_(isolate, param4), \
                                  napi_create_##type5##_(isolate, param5), \
                                };\
            MediaPlayerEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 5, argv);\
        }

        class NodeMediaPlayerObserver : public IMediaPlayerSourceObserver {
 
        public:
            struct MediaPlayerEventCallback
            {
                Persistent<Function> callback;
                Persistent<Object> js_this;
            };

            NodeMediaPlayerObserver();
            ~NodeMediaPlayerObserver();

            virtual void onPlayerSourceStateChanged(media::base::MEDIA_PLAYER_STATE state,
                                                    media::base::MEDIA_PLAYER_ERROR ec) override;
            virtual void onPositionChanged(int64_t position) override;
            virtual void onPlayerEvent(media::base::MEDIA_PLAYER_EVENT event) override;
            virtual void onMetaData(const void* data, int length) override;  

            virtual void onCompleted() override;

            void fireApiError(const char* funcName);
            void addEventHandler(const std::string& eventName, Persistent<Object>& obj, Persistent<Function>& callback);

        private:
            std::unordered_map<std::string, MediaPlayerEventCallback*> m_callbacks;
        };   
    }
}
#endif
