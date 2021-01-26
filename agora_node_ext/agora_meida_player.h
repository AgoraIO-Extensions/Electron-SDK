#ifndef AGORA_ELECTRON_MEDIA_PLAYER
#define AGORA_ELECTRON_MEDIA_PLAYER

#include <node.h>
#include <node_object_wrap.h>
#include "node_log.h"
#include "node_napi_api.h"
#include <functional>
#include <list>
#include <mutex>
#include <unordered_set>
#include <map>
#include "IAgoraMediaPlayer.h"
#include "node_media_player_observer.h"
#include "node_media_player_video_frame_observer.h"
#include "../common/loguru.hpp"

namespace agora {
    namespace rtc {
        /*
        * Used to declare native interface to nodejs
        */
        #define NAPI_API_MEDIA_PLAYER(m) \
            static void (m)(const Nan::FunctionCallbackInfo<Value>& args)

        /*
        * Used to define native interface which is exposed to nodejs
        */
        #define NAPI_API_DEFINE_MEDIA_PLAYER(cls, method) \
            void cls::method(const Nan::FunctionCallbackInfo<Value>& args)

        /*
        * Use to extract native this pointer from JS object
        */
        #define napi_get_native_this(args, native) \
                    native = ObjectWrap::Unwrap<NodeMediaPlayer>(args.Holder());

        /**
         * Helper MACRO to check whether the extracted native this is valid.
         */
        #define CHECK_NATIVE_THIS(mediaPlayer) \
                if(!mediaPlayer || !(mediaPlayer->mMediaPlayer)) { \
                    LOG_ERROR("mediaPlayer is null.\n");\
                    break;\
                }

        #define CHECK_NATIVE_THIS_MEDIA_PlAYER(mediaPlayer) \
        if(!mediaPlayer) { \
            LOG_ERROR("mediaPlayer is null.\n");\
            break;\
        }

        /*
        * to return int value for JS call.
        */
        #define media_player_napi_set_int_result(args, result) (args).GetReturnValue().Set(Integer::New(args.GetIsolate(), (result)))

        /**
        * to return bool value for JS call
        */
        #define napi_set_bool_result(args, result) (args).GetReturnValue().Set(v8::Boolean::New(args.GetIsolate(), (result)))

        #define CHECK_NAPI_STATUS(mediaPlayer, status) \
        if(status != napi_ok) { \
            LOG_ERROR("Error :%s, :%d\n", __FUNCTION__, __LINE__); \
            mediaPlayer->nodeMediaPlayerObserver->fireApiError(__FUNCTION__); \
            break; \
        }

        #define CHECK_NAPI_OBJ(obj) \
            if (obj.IsEmpty()) \
                break;

        #define NODE_SET_OBJ_PROP_STRING(obj, name, val) \
            { \
                Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
                CHECK_NAPI_OBJ(propName); \
                Local<Value> propVal = String::NewFromUtf8(isolate, val, NewStringType::kInternalized).ToLocalChecked(); \
                CHECK_NAPI_OBJ(propVal); \
                v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, propVal); \
                if(!ret.IsNothing()) { \
                    if(!ret.ToChecked()) { \
                        break; \
                    } \
                } \
            }

        #define NODE_SET_OBJ_PROP_UINT32(obj, name, val) \
            { \
                Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
                CHECK_NAPI_OBJ(propName); \
                Local<Value> propVal = v8::Uint32::New(isolate, val); \
                CHECK_NAPI_OBJ(propVal); \
                v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, propVal); \
                if(!ret.IsNothing()) { \
                    if(!ret.ToChecked()) { \
                        break; \
                    } \
                } \
            }

        #define NODE_SET_OBJ_PROP_UID(obj, name, val) \
            { \
                Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
                CHECK_NAPI_OBJ(propName); \
                Local<Value> propVal = NodeUid::getNodeValue(isolate, val); \
                CHECK_NAPI_OBJ(propVal); \
                v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, propVal); \
                if(!ret.IsNothing()) { \
                    if(!ret.ToChecked()) { \
                        break; \
                    } \
                } \
            }

        #define NODE_SET_OBJ_PROP_NUMBER(obj, name, val) \
            { \
                Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
                CHECK_NAPI_OBJ(propName); \
                Local<Value> propVal = v8::Number::New(isolate, val); \
                CHECK_NAPI_OBJ(propVal); \
                v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, propVal); \
                if(!ret.IsNothing()) { \
                    if(!ret.ToChecked()) { \
                        break; \
                    } \
                } \
            }

         class NodeMediaPlayer : public node::ObjectWrap {
             
             typedef NodeString nodestring;

            public:
                NodeMediaPlayer(Isolate *isolate);
                ~NodeMediaPlayer();
                static void createInstance(const FunctionCallbackInfo<Value>& args);
                static void Init(Local<Object>& module);
                NAPI_API_MEDIA_PLAYER(initialize);
                NAPI_API_MEDIA_PLAYER(open);
                NAPI_API_MEDIA_PLAYER(play);
                NAPI_API_MEDIA_PLAYER(pause);
                NAPI_API_MEDIA_PLAYER(stop);
                NAPI_API_MEDIA_PLAYER(seek);
                NAPI_API_MEDIA_PLAYER(mute);
                NAPI_API_MEDIA_PLAYER(getMute);
                NAPI_API_MEDIA_PLAYER(adjustPlayoutVolume);
                NAPI_API_MEDIA_PLAYER(getPlayoutVolume);
                NAPI_API_MEDIA_PLAYER(getPlayPosition);
                NAPI_API_MEDIA_PLAYER(getDuration);
                NAPI_API_MEDIA_PLAYER(getState);
                NAPI_API_MEDIA_PLAYER(getStreamCount);
                NAPI_API_MEDIA_PLAYER(getStreamInfo);
                NAPI_API_MEDIA_PLAYER(setView);
                NAPI_API_MEDIA_PLAYER(setRenderMode);
                NAPI_API_MEDIA_PLAYER(connect);
                NAPI_API_MEDIA_PLAYER(disconnect);
                NAPI_API_MEDIA_PLAYER(publishVideo);
                NAPI_API_MEDIA_PLAYER(unpublishVideo);
                NAPI_API_MEDIA_PLAYER(publishAudio);
                NAPI_API_MEDIA_PLAYER(unpublishAudio);
                NAPI_API_MEDIA_PLAYER(adjustPublishSignalVolume);
                NAPI_API_MEDIA_PLAYER(setLogFile);
                NAPI_API_MEDIA_PLAYER(setLogFilter);
                NAPI_API_MEDIA_PLAYER(setPlayerOption);
                NAPI_API_MEDIA_PLAYER(changePlaybackSpeed);
                NAPI_API_MEDIA_PLAYER(selectAudioTrack);
                NAPI_API_MEDIA_PLAYER(release);
                NAPI_API_MEDIA_PLAYER(onEvent);
                NAPI_API_MEDIA_PLAYER(registerVideoFrameObserver);
                NAPI_API_MEDIA_PLAYER(unregisterVideoFrameObserver);
                NAPI_API_MEDIA_PLAYER(setVideoRotation);

//   virtual int registerPlayerObserver(IMediaPlayerObserver* observer) = 0;
//   virtual int unregisterPlayerObserver(IMediaPlayerObserver* observer) = 0;
//   virtual int registerVideoFrameObserver(agora::media::base::IVideoFrameObserver* observer) = 0;
//   virtual int unregisterVideoFrameObserver(agora::media::base::IVideoFrameObserver* observer) = 0;
//   virtual int registerAudioFrameObserver(agora::media::base::IAudioFrameObserver* observer) = 0;
//   virtual int unregisterAudioFrameObserver(agora::media::base::IAudioFrameObserver* observer) = 0;
            private:
                DECLARE_CLASS;
                IMediaPlayer *mMediaPlayer = NULL;
                Isolate *isolate = NULL;
                NodeMediaPlayerObserver *nodeMediaPlayerObserver = NULL;
                NodeMediaPlayerVideoFrameObserver *nodeMediaPlayerVideoFrameObserver = NULL;
         };
    }
}



#endif