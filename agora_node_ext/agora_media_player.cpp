#include "agora_meida_player.h"
#include "agora_rtc_channel_publish_helper.h"

namespace agora {
    namespace rtc {
        DEFINE_CLASS(NodeMediaPlayer);
        NodeMediaPlayer::NodeMediaPlayer(Isolate *_isolate) : isolate(_isolate) {
            LOG_F(INFO, "NodeMediaPlayer::NodeMediaPlayer");
        }

        NodeMediaPlayer::~NodeMediaPlayer() {
            if (mMediaPlayer) {
                mMediaPlayer->release();
                mMediaPlayer = NULL;
            }

            if (nodeMediaPlayerObserver) {
                delete nodeMediaPlayerObserver;
                nodeMediaPlayerObserver = NULL;
            }

            if (nodeMediaPlayerVideoFrameObserver) {
                delete nodeMediaPlayerVideoFrameObserver;
                nodeMediaPlayerVideoFrameObserver = NULL;
            }

            if (nodeMediaPlayerAudioFrameObserver) {
                delete nodeMediaPlayerAudioFrameObserver;
                nodeMediaPlayerAudioFrameObserver = NULL;
            }
            LOG_F(INFO, "NodeMediaPlayer::~NodeMediaPlayer");
        }

        void NodeMediaPlayer::Init(Local<Object>& module) {
            LOG_F(INFO, "NodeMediaPlayer::Init ");
            Isolate *isolate = module->GetIsolate();
            v8::Local<v8::Context> context = isolate->GetCurrentContext();
            BEGIN_PROPERTY_DEFINE(NodeMediaPlayer, createInstance, 4)
                PROPERTY_METHOD_DEFINE(onEvent);
                PROPERTY_METHOD_DEFINE(initialize);
                PROPERTY_METHOD_DEFINE(open);
                PROPERTY_METHOD_DEFINE(play);
                PROPERTY_METHOD_DEFINE(pause);
                PROPERTY_METHOD_DEFINE(stop);
                PROPERTY_METHOD_DEFINE(seek);
                PROPERTY_METHOD_DEFINE(mute);
                PROPERTY_METHOD_DEFINE(getMute);
                PROPERTY_METHOD_DEFINE(adjustPlayoutVolume);
                PROPERTY_METHOD_DEFINE(getPlayoutVolume);
                PROPERTY_METHOD_DEFINE(getPlayPosition);
                PROPERTY_METHOD_DEFINE(getDuration);
                PROPERTY_METHOD_DEFINE(getState);
                PROPERTY_METHOD_DEFINE(getStreamCount);
                PROPERTY_METHOD_DEFINE(getStreamInfo);
                PROPERTY_METHOD_DEFINE(setView);
                PROPERTY_METHOD_DEFINE(setRenderMode);
                PROPERTY_METHOD_DEFINE(connect);
                PROPERTY_METHOD_DEFINE(disconnect);
                PROPERTY_METHOD_DEFINE(publishVideo);
                PROPERTY_METHOD_DEFINE(unpublishVideo);
                PROPERTY_METHOD_DEFINE(publishAudio);
                PROPERTY_METHOD_DEFINE(unpublishAudio);
                PROPERTY_METHOD_DEFINE(adjustPublishSignalVolume);
                PROPERTY_METHOD_DEFINE(setLogFile);
                PROPERTY_METHOD_DEFINE(setLogFilter);
                PROPERTY_METHOD_DEFINE(setPlayerOption);
                PROPERTY_METHOD_DEFINE(changePlaybackSpeed);
                PROPERTY_METHOD_DEFINE(selectAudioTrack);
                PROPERTY_METHOD_DEFINE(release);
                PROPERTY_METHOD_DEFINE(registerVideoFrameObserver);
                PROPERTY_METHOD_DEFINE(unregisterVideoFrameObserver);
                PROPERTY_METHOD_DEFINE(setVideoRotation);
                PROPERTY_METHOD_DEFINE(publishVideoToRtc);
                PROPERTY_METHOD_DEFINE(unpublishVideoFromRtc);
                PROPERTY_METHOD_DEFINE(publishAudioToRtc);
                PROPERTY_METHOD_DEFINE(unpublishAudioFromRtc);
                PROPERTY_METHOD_DEFINE(attachPlayerToRtc);
                PROPERTY_METHOD_DEFINE(detachPlayerFromRtc);  
            EN_PROPERTY_DEFINE()
            module->Set(context, Nan::New<v8::String>("NodeMediaPlayer").ToLocalChecked(), tpl->GetFunction(context).ToLocalChecked());
        }

        void NodeMediaPlayer::createInstance(const FunctionCallbackInfo<Value>& args) {
            LOG_F(INFO, "NodeMediaPlayer createInstance");
            Isolate *isolate = args.GetIsolate();

            /*
            *  Called from new
            */
            if (args.IsConstructCall()) {
                NodeMediaPlayer *nodeMediaPlayer = new NodeMediaPlayer(isolate);
                nodeMediaPlayer->Wrap(args.This());
                args.GetReturnValue().Set(args.This());
            }
            else {
                Local<Function> cons = Local<Function>::New(isolate, constructor);
                Local<Context> context = isolate->GetCurrentContext();
                Local<Object> instance = cons->NewInstance(context).ToLocalChecked();
                args.GetReturnValue().Set(instance);
            }
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, initialize) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS_MEDIA_PlAYER(mediaPlayer);

                mediaPlayer->mMediaPlayer = createAgoraMediaPlayer();
                if (mediaPlayer->nodeMediaPlayerObserver) {
                    delete mediaPlayer->nodeMediaPlayerObserver;
                    mediaPlayer->nodeMediaPlayerObserver = NULL;
                }

                if (mediaPlayer->nodeMediaPlayerVideoFrameObserver) {
                    AgoraRtcChannelPublishHelper::Get()->unpublishVideoToRtc(mediaPlayer->nodeMediaPlayerVideoFrameObserver);
                    delete mediaPlayer->nodeMediaPlayerVideoFrameObserver;
                    mediaPlayer->nodeMediaPlayerVideoFrameObserver = NULL;
                }

                if (mediaPlayer->nodeMediaPlayerAudioFrameObserver) {
                    AgoraRtcChannelPublishHelper::Get()->unpublishAudioToRtc(mediaPlayer->nodeMediaPlayerAudioFrameObserver);
                    delete mediaPlayer->nodeMediaPlayerAudioFrameObserver;
                    mediaPlayer->nodeMediaPlayerAudioFrameObserver = NULL;
                }

                LOG_F(INFO, "NodeMediaPlayer::initialize");
                mediaPlayer->nodeMediaPlayerObserver = new NodeMediaPlayerObserver();
                mediaPlayer->nodeMediaPlayerVideoFrameObserver = new NodeMediaPlayerVideoFrameObserver();
                mediaPlayer->nodeMediaPlayerAudioFrameObserver = new NodeMediaPlayerAudioFrameObserver();
                const MediaPlayerContext mediaPlayerContext;
                result = mediaPlayer->mMediaPlayer->initialize(mediaPlayerContext);
                mediaPlayer->mMediaPlayer->registerPlayerObserver(mediaPlayer->nodeMediaPlayerObserver);
                mediaPlayer->mMediaPlayer->registerAudioFrameObserver(mediaPlayer->nodeMediaPlayerAudioFrameObserver);
            } while(false);
            media_player_napi_set_int_result(args, result);
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
                result = mediaPlayer->mMediaPlayer->open(url, position);
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, play) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                result = mediaPlayer->mMediaPlayer->play();
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, pause) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                result = mediaPlayer->mMediaPlayer->pause();       
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, stop) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                result = mediaPlayer->mMediaPlayer->stop();
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
                result = mediaPlayer->mMediaPlayer->seek(position); 
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, mute) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer); 
                bool mute;
                napi_status status = napi_ok;
                status = napi_get_value_bool_(args[0], mute);
                CHECK_NAPI_STATUS(mediaPlayer, status);
                result = mediaPlayer->mMediaPlayer->mute(mute);
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, getMute) {
            bool result = false;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                mediaPlayer->mMediaPlayer->getMute(result);
            } while(false);
            napi_set_bool_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, adjustPlayoutVolume) {
            int result = 1;
            do {    
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                int volume;
                napi_status status = napi_ok;
                status = napi_get_value_int32_(args[0], volume);
                CHECK_NAPI_STATUS(mediaPlayer, status);
                result = mediaPlayer->mMediaPlayer->adjustPlayoutVolume(volume);   
                AgoraRtcChannelPublishHelper::Get()->adjustPlayoutSignalVolume(volume);
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, getPlayoutVolume) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                mediaPlayer->mMediaPlayer->getPlayoutVolume(result);          
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
                mediaPlayer->mMediaPlayer->getPlayPosition(position);
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
                mediaPlayer->mMediaPlayer->getDuration(result);  
            } while(false);
            media_player_napi_set_int_result(args, (int)result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, getState) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer); 
                result = mediaPlayer->mMediaPlayer->getState();
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, getStreamCount) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer); 
                mediaPlayer->mMediaPlayer->getStreamCount(result);
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
                agora::media::MediaStreamInfo *streamInfo = new agora::media::MediaStreamInfo();
                result = mediaPlayer->mMediaPlayer->getStreamInfo(index, streamInfo);
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

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, setView) {
            //int result = 1;
            
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, setRenderMode) {
            // int result = 1;
            // mediaPlayer->setRenderMode
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, connect) {
            int result = 1;
            napi_status status = napi_ok;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                nodestring token;
                nodestring channelId;
                nodestring uid;
                status = napi_get_value_nodestring_(args[0], token);
                CHECK_NAPI_STATUS(mediaPlayer, status);
                status = napi_get_value_nodestring_(args[1], channelId);
                CHECK_NAPI_STATUS(mediaPlayer, status);
                status = napi_get_value_nodestring_(args[2], uid);
                CHECK_NAPI_STATUS(mediaPlayer, status);
                result = mediaPlayer->mMediaPlayer->connect(token, channelId, uid);
            } while (false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, disconnect) {
            bool result = false;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                result = mediaPlayer->mMediaPlayer->disconnect();
            } while(false);
            napi_set_bool_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, publishVideo) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                result = mediaPlayer->mMediaPlayer->publishVideo();  
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, unpublishVideo) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                result = mediaPlayer->mMediaPlayer->unpublishVideo();
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, publishAudio) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                result = mediaPlayer->mMediaPlayer->publishAudio();   
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, unpublishAudio) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                result = mediaPlayer->mMediaPlayer->unpublishAudio();   
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, adjustPublishSignalVolume) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                int volume;
                napi_status status = napi_ok;
                status = napi_get_value_int32_(args[0], volume);
                CHECK_NAPI_STATUS(mediaPlayer, status);
                result = mediaPlayer->mMediaPlayer->adjustPublishSignalVolume(volume);
                AgoraRtcChannelPublishHelper::Get()->adjustPublishSignalVolume(volume);
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, setLogFile) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                nodestring file;
                napi_status status = napi_ok;
                status = napi_get_value_nodestring_(args[0], file);
                CHECK_NAPI_STATUS(mediaPlayer, status);
                result = mediaPlayer->mMediaPlayer->setLogFile(file);
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, setLogFilter) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                unsigned int filter;
                napi_status status = napi_ok;
                status = napi_get_value_uint32_(args[0], filter);
                CHECK_NAPI_STATUS(mediaPlayer, status);
                result = mediaPlayer->mMediaPlayer->setLogFilter(filter);
            } while(false);
            media_player_napi_set_int_result(args, result);
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
                result = mediaPlayer->mMediaPlayer->setPlayerOption(key, value);
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
                result = mediaPlayer->mMediaPlayer->changePlaybackSpeed((agora::media::MEDIA_PLAYER_PLAY_SPEED)speed);
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
                result = mediaPlayer->mMediaPlayer->selectAudioTrack(index);   
            } while(false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, release) {
            int result = 1;
            do {
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                mediaPlayer->mMediaPlayer->unregisterPlayerObserver(NULL);
                mediaPlayer->mMediaPlayer->unregisterVideoFrameObserver(NULL);
                mediaPlayer->mMediaPlayer->unregisterAudioFrameObserver(NULL);
                if (mediaPlayer->nodeMediaPlayerObserver) {
                    delete mediaPlayer->nodeMediaPlayerObserver;
                    mediaPlayer->nodeMediaPlayerObserver = NULL;
                }

                if (mediaPlayer->nodeMediaPlayerVideoFrameObserver) {
                    AgoraRtcChannelPublishHelper::Get()->unpublishVideoToRtc(mediaPlayer->nodeMediaPlayerVideoFrameObserver);
                    delete mediaPlayer->nodeMediaPlayerVideoFrameObserver;
                    mediaPlayer->nodeMediaPlayerVideoFrameObserver = NULL;
                }

                if (mediaPlayer->nodeMediaPlayerAudioFrameObserver) {
                    AgoraRtcChannelPublishHelper::Get()->unpublishAudioToRtc(mediaPlayer->nodeMediaPlayerAudioFrameObserver);
                    delete mediaPlayer->nodeMediaPlayerAudioFrameObserver;
                    mediaPlayer->nodeMediaPlayerAudioFrameObserver = NULL;
                }
                mediaPlayer->mMediaPlayer->release(true);
                mediaPlayer->mMediaPlayer = nullptr;
                result = 0;
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

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, registerVideoFrameObserver)
        {
            int result = 1;
            do {
                Isolate *isolate = args.GetIsolate();
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);

                if (!args[0]->IsFunction()) {
                    LOG_ERROR("Function expected");
                    break;
                }

                Local<Function> callback = args[0].As<Function>();
                if (callback.IsEmpty()) {
                    LOG_ERROR("Function expected.");
                    break;
                }

                mediaPlayer->nodeMediaPlayerVideoFrameObserver->initialize(isolate, args);
                result = mediaPlayer->mMediaPlayer->registerVideoFrameObserver(mediaPlayer->nodeMediaPlayerVideoFrameObserver);
            } while (false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, unregisterVideoFrameObserver)
        {
            int result = 1;
            LOG_F(INFO, "unregisterVideoFrameObserver");
            do {
                Isolate *isolate = args.GetIsolate();
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                result = mediaPlayer->mMediaPlayer->unregisterVideoFrameObserver(NULL);
            } while (false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, setVideoRotation)
        {
            int result = 1;
            LOG_F(INFO, "setVideoRotation");
            do {
                Isolate *isolate = args.GetIsolate();
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                int rotation;
                status = napi_get_value_int32_(args[0], rotation);
                CHECK_NAPI_STATUS(mediaPlayer, status);
                if (mediaPlayer->nodeMediaPlayerVideoFrameObserver) {
                    result = mediaPlayer->nodeMediaPlayerVideoFrameObserver->setVideoRotation(rotation);
                } else {
                    result = -7;
                } 
            } while (false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, publishVideoToRtc)
        {
            int result = 1;
            LOG_F(INFO, "publishVideoToRtc");
            do {
                Isolate *isolate = args.GetIsolate();
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                if (mediaPlayer->nodeMediaPlayerVideoFrameObserver) {
                    AgoraRtcChannelPublishHelper::Get()->publishVideoToRtc(mediaPlayer->nodeMediaPlayerVideoFrameObserver);
                    result = 0;
                } else {
                    result = -7;
                } 
            } while (false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, unpublishVideoFromRtc)
        {
            int result = 1;
            LOG_F(INFO, "unpublishVideoToRtc");
            do {
                Isolate *isolate = args.GetIsolate();
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                if (mediaPlayer->nodeMediaPlayerVideoFrameObserver) {
                    AgoraRtcChannelPublishHelper::Get()->unpublishVideoToRtc(mediaPlayer->nodeMediaPlayerVideoFrameObserver);
                    result = 0;
                } else {
                    result = -7;
                } 
            } while (false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, publishAudioToRtc)
        {
            int result = 1;
            LOG_F(INFO, "publishAudioToRtc");
            do {
                Isolate *isolate = args.GetIsolate();
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                bool publishAudio = false;
                napi_get_value_bool_(args[0], publishAudio);

                bool playbackAudio = false;
                napi_get_value_bool_(args[1], playbackAudio);
                if (mediaPlayer->nodeMediaPlayerAudioFrameObserver) {
                    AgoraRtcChannelPublishHelper::Get()->publishAudioToRtc(mediaPlayer->nodeMediaPlayerAudioFrameObserver, publishAudio, playbackAudio);
                    result = 0;
                } else {
                    result = -7;
                } 
            } while (false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, unpublishAudioFromRtc)
        {
            int result = 1;
            LOG_F(INFO, "unpublishAudioFromRtc");
            do {
                Isolate *isolate = args.GetIsolate();
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                if (mediaPlayer->nodeMediaPlayerAudioFrameObserver) {
                    AgoraRtcChannelPublishHelper::Get()->unpublishAudioToRtc(mediaPlayer->nodeMediaPlayerAudioFrameObserver);
                    result = 0;
                } else {
                    result = -7;
                } 
            } while (false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, attachPlayerToRtc)
        {
            int result = 1;
            LOG_F(INFO, "attachPlayerToRtc");
            do {
                Isolate *isolate = args.GetIsolate();
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                result = AgoraRtcChannelPublishHelper::Get()->attachPlayerToRtc();
            } while (false);
            media_player_napi_set_int_result(args, result);
        }

        NAPI_API_DEFINE_MEDIA_PLAYER(NodeMediaPlayer, detachPlayerFromRtc)
        {
            int result = 1;
            LOG_F(INFO, "detachPlayerFromRtc");
            do {
                Isolate *isolate = args.GetIsolate();
                NodeMediaPlayer *mediaPlayer = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, mediaPlayer);
                CHECK_NATIVE_THIS(mediaPlayer);
                result = AgoraRtcChannelPublishHelper::Get()->detachPlayerFromRtc();
            } while (false);
            media_player_napi_set_int_result(args, result);
        }
    }
}
