#include "agora_meida_player.h"

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

        // #define CHECK_NAPI_STATUS(mediaPlayer, status) \
        // if(status != napi_ok) { \
        //     LOG_ERROR("Error :%s, :%d\n", __FUNCTION__, __LINE__); \
        //     LOG_F(INFO, "Error :%s, :%d\n", __FUNCTION__, __LINE__); \
        //     break; \
        // }

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

namespace agora {
    namespace rtc {
        DEFINE_CLASS(NodeMediaPlayer);
        NodeMediaPlayer::NodeMediaPlayer(Isolate *_isolate, IMediaPlayerSourceWraper* mediaPlayer) : isolate(_isolate), mMediaPlayer(mediaPlayer) {
            LOG_F(INFO, "NodeMediaPlayer::NodeMediaPlayer");
            nodeMediaPlayerObserver = new NodeMediaPlayerObserver();
            mMediaPlayer->m_mediaPlayerSource->registerPlayerSourceObserver(nodeMediaPlayerObserver);
        }

        NodeMediaPlayer::~NodeMediaPlayer() {
            mMediaPlayer->m_mediaPlayerSource->unregisterPlayerSourceObserver(nodeMediaPlayerObserver);

            delete nodeMediaPlayerObserver;

            delete mMediaPlayer;
            LOG_F(INFO, "NodeMediaPlayer::~NodeMediaPlayer");
        }

        Local<Object> NodeMediaPlayer::Init(Isolate* isolate, agora_refptr<IMediaPlayer> mediaPlayer) {
            LOG_F(INFO, "NodeMediaPlayer init");

            v8::Local<v8::Context> context = isolate->GetCurrentContext();
            BEGIN_PROPERTY_DEFINE(NodeMediaPlayer, createInstance, 4)
                PROPERTY_METHOD_DEFINE(onEvent);
                PROPERTY_METHOD_DEFINE(open);
                PROPERTY_METHOD_DEFINE(play);
                PROPERTY_METHOD_DEFINE(pause);
                PROPERTY_METHOD_DEFINE(stop);
                PROPERTY_METHOD_DEFINE(seek);
                PROPERTY_METHOD_DEFINE(getPlayPosition);
                PROPERTY_METHOD_DEFINE(getDuration);
                PROPERTY_METHOD_DEFINE(getStreamCount);
                PROPERTY_METHOD_DEFINE(getSourceId);
                PROPERTY_METHOD_DEFINE(getStreamInfo);
                PROPERTY_METHOD_DEFINE(setPlayerOption);
                PROPERTY_METHOD_DEFINE(changePlaybackSpeed);
                PROPERTY_METHOD_DEFINE(selectAudioTrack);
            EN_PROPERTY_DEFINE()

            Local<Function> cons = tpl->GetFunction(context).ToLocalChecked();
            IMediaPlayerSourceWraper* pMediaPlayerSourceWrper = new IMediaPlayerSourceWraper();
            pMediaPlayerSourceWrper->m_mediaPlayerSource = mediaPlayer;
            Local<v8::External> argMediaPlayer = Local<v8::External>::New(isolate, v8::External::New(isolate, pMediaPlayerSourceWrper));
            Local<v8::Value> argv[1] = {argMediaPlayer};
            Local<Object> jsmediaPlayer = cons->NewInstance(context, 1, argv).ToLocalChecked();
            return jsmediaPlayer;
        }

        void NodeMediaPlayer::createInstance(const FunctionCallbackInfo<Value>& args) {
            LOG_F(INFO, "NodeMediaPlayer createInstance");

            LOG_ENTER;
            Isolate *isolate = args.GetIsolate();
            Local<v8::External> argMediaPlayer = Local<v8::External>::Cast(args[0]);
            IMediaPlayerSourceWraper* pMediaPlayer = static_cast<IMediaPlayerSourceWraper*>(argMediaPlayer->Value());
            NodeMediaPlayer *mediaPlayer = new NodeMediaPlayer(isolate, pMediaPlayer);
            mediaPlayer->Wrap(args.This());
            args.GetReturnValue().Set(args.This());
            LOG_LEAVE;
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, open) {
            int result = 1;
            napi_status status = napi_ok;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);  
                nodestring url;
                status = napi_get_value_nodestring_(args[0], url); 
                CHECK_NAPI_STATUS(mediaPlayer, status);
                int64_t position;
                status = napi_get_value_int64_(args[1], position); 
                CHECK_NAPI_STATUS(mediaPlayer, status);
                result = mediaPlayer->mMediaPlayer->m_mediaPlayerSource->open(url, position);
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, play) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                result = mediaPlayer->mMediaPlayer->m_mediaPlayerSource->play();
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, pause) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                result = mediaPlayer->mMediaPlayer->m_mediaPlayerSource->pause();       
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, stop) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                result = mediaPlayer->mMediaPlayer->m_mediaPlayerSource->stop();
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, seek) {
            int result = 1;
            napi_status status = napi_ok;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer); 
                int64_t position;
                status = napi_get_value_int64_(args[0], position);
                CHECK_NAPI_STATUS(mediaPlayer, status);
                result = mediaPlayer->mMediaPlayer->m_mediaPlayerSource->seek(position); 
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, getPlayPosition) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                int64_t position;
                mediaPlayer->mMediaPlayer->m_mediaPlayerSource->getPlayPosition(position);
                result = (int)position;    
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, getDuration) {
            int64_t result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer); 
                mediaPlayer->mMediaPlayer->m_mediaPlayerSource->getDuration(result);  
            } while(false);
            media_player_napi_set_int_result(args, (int)result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, getStreamCount) {
            int64_t result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer); 
                mediaPlayer->mMediaPlayer->m_mediaPlayerSource->getStreamCount(result);
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, getSourceId) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer); 
                result = mediaPlayer->mMediaPlayer->m_mediaPlayerSource->getMediaPlayerId();
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, getStreamInfo) {
            int result = 1;
            do {
                Isolate *isolate = args.GetIsolate();
                v8::Local<v8::Context> context = isolate->GetCurrentContext();
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                int index;
                napi_status status = napi_ok;
                status = napi_get_value_int32_(args[0], index);
                agora::media::base::MediaStreamInfo *streamInfo = new agora::media::base::MediaStreamInfo();
                result = mediaPlayer->mMediaPlayer->m_mediaPlayerSource->getStreamInfo(index, streamInfo);
                Local<Object> obj = Object::New(isolate);
                obj->Set(context, napi_create_string_(isolate, "streamIndex"), napi_create_int32_(isolate, streamInfo->streamIndex));
                obj->Set(context, napi_create_string_(isolate, "streamType"), napi_create_int32_(isolate, (int)(streamInfo->streamType)));
                obj->Set(context, napi_create_string_(isolate, "codecName"), napi_create_string_(isolate, std::string(streamInfo->codecName).c_str()));
                obj->Set(context, napi_create_string_(isolate, "language"), napi_create_string_(isolate, std::string(streamInfo->language).c_str()));
                obj->Set(context, napi_create_string_(isolate, "videoFrameRate"), napi_create_int32_(isolate, streamInfo->videoFrameRate));
                obj->Set(context, napi_create_string_(isolate, "videoBitRate"), napi_create_int32_(isolate, (int)(streamInfo->videoBitRate)));         
                obj->Set(context, napi_create_string_(isolate, "videoWidth"), napi_create_int32_(isolate, streamInfo->videoWidth));
                obj->Set(context, napi_create_string_(isolate, "videoHeight"), napi_create_int32_(isolate, (int)(streamInfo->videoHeight)));
                obj->Set(context, napi_create_string_(isolate, "videoRotation"), napi_create_int32_(isolate, streamInfo->videoRotation));
                obj->Set(context, napi_create_string_(isolate, "audioSampleRate"), napi_create_int32_(isolate, (int)(streamInfo->audioSampleRate)));
                obj->Set(context, napi_create_string_(isolate, "audioChannels"), napi_create_int32_(isolate, streamInfo->audioChannels));
                obj->Set(context, napi_create_string_(isolate, "duration"), napi_create_int32_(isolate, (int)(streamInfo->duration)));
                args.GetReturnValue().Set(obj);
                delete streamInfo;
                streamInfo = NULL;
            } while(false);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, setPlayerOption) {
            int result = 1;
            napi_status status = napi_ok;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                nodestring key;
                status = napi_get_value_nodestring_(args[0], key);
                CHECK_NAPI_STATUS(mediaPlayer, status);
                int value;
                status = napi_get_value_int32_(args[1], value);
                CHECK_NAPI_STATUS(mediaPlayer, status);
                result = mediaPlayer->mMediaPlayer->m_mediaPlayerSource->setPlayerOption(key, value);
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, changePlaybackSpeed) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                int speed;
                napi_status status = napi_ok;
                status = napi_get_value_int32_(args[0], speed);
                CHECK_NAPI_STATUS(mediaPlayer, status);
                result = mediaPlayer->mMediaPlayer->m_mediaPlayerSource->changePlaybackSpeed((agora::media::base::MEDIA_PLAYER_PLAYBACK_SPEED)speed);
            } while(false);
            media_player_napi_set_int_result(args, result);
        }   

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, selectAudioTrack) {
            int result = 1;
            do {    
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                int index;
                napi_status status = napi_ok;
                status = napi_get_value_int32_(args[0], index);
                CHECK_NAPI_STATUS(mediaPlayer, status);
                result = mediaPlayer->mMediaPlayer->m_mediaPlayerSource->selectAudioTrack(index);   
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, onEvent)
        {
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                nodestring eventName;
                status = napi_get_value_nodestring_(args[0], eventName);
                CHECK_NAPI_STATUS(mediaPlayer, status);

                if (!args[1]->IsFunction()) {
                    LOG_ERROR("Function expected\r\n");
                    break;
                }

                Local<Function> callback = args[1].As<Function>();
                if (callback.IsEmpty()) {
                    LOG_ERROR("Function expected.\r\n");
                    break;
                }

                Persistent<Function> persist;
                persist.Reset(callback);
                Local<Object> obj = args.This();
                Persistent<Object> persistObj;
                persistObj.Reset(obj);
                mediaPlayer->nodeMediaPlayerObserver->addEventHandler((char*)eventName, persistObj, persist);
            } while (false);
            //LOG_LEAVE;
        }

       
    }
}
