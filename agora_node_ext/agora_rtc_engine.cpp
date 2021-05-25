/*
* Copyright (c) 2017 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2017
*/

#include "agora_rtc_engine.h"
#include "node_video_render.h"
#include "node_uid.h"
#include "node_napi_api.h"
#include "IAgoraRtcEngine2.h"
#include "IAgoraRtcEngineEx.h"
#include <string>
#include <nan.h>
#include "agora_media_player.h"
#include "loguru.hpp"


#if defined(__APPLE__) || defined(_WIN32)
#include "node_screen_window_info.h"
#endif

#if defined(__APPLE__)
#include <dlfcn.h>
#endif

using std::string;
namespace agora {
    namespace rtc {

        DEFINE_CLASS(NodeRtcEngine);

        /**
         * To declared class and member functions that could be used in JS layer directly.
         */
        void NodeRtcEngine::Init(Local<Object>& module)
        {
            Isolate *isolate = module->GetIsolate();
            v8::Local<v8::Context> context = isolate->GetCurrentContext();
            BEGIN_PROPERTY_DEFINE(NodeRtcEngine, createInstance, 5)
                PROPERTY_METHOD_DEFINE(onEvent)
                PROPERTY_METHOD_DEFINE(initialize)
                PROPERTY_METHOD_DEFINE(getVersion)
                PROPERTY_METHOD_DEFINE(getErrorDescription)
                PROPERTY_METHOD_DEFINE(joinChannel)
                PROPERTY_METHOD_DEFINE(leaveChannel)
                PROPERTY_METHOD_DEFINE(renewToken)
                PROPERTY_METHOD_DEFINE(setChannelProfile)
                PROPERTY_METHOD_DEFINE(setClientRole)
                PROPERTY_METHOD_DEFINE(startEchoTest)
                PROPERTY_METHOD_DEFINE(stopEchoTest)
                // PROPERTY_METHOD_DEFINE(enableLastmileTest)
                // PROPERTY_METHOD_DEFINE(disableLastmileTest)
                PROPERTY_METHOD_DEFINE(enableVideo)
                PROPERTY_METHOD_DEFINE(disableVideo)
                PROPERTY_METHOD_DEFINE(startPreview)
                PROPERTY_METHOD_DEFINE(stopPreview)
                // PROPERTY_METHOD_DEFINE(setVideoProfile)
                PROPERTY_METHOD_DEFINE(setVideoEncoderConfiguration)
                PROPERTY_METHOD_DEFINE(enableAudio)
                PROPERTY_METHOD_DEFINE(disableAudio)
                PROPERTY_METHOD_DEFINE(setAudioProfile)
                PROPERTY_METHOD_DEFINE(getCallId)
                PROPERTY_METHOD_DEFINE(rate)
                PROPERTY_METHOD_DEFINE(complain)
                PROPERTY_METHOD_DEFINE(setEncryptionSecret)
                PROPERTY_METHOD_DEFINE(createDataStream)
                PROPERTY_METHOD_DEFINE(sendStreamMessage)
                PROPERTY_METHOD_DEFINE(muteLocalAudioStream)
                PROPERTY_METHOD_DEFINE(muteAllRemoteAudioStreams)
                PROPERTY_METHOD_DEFINE(setDefaultMuteAllRemoteAudioStreams)
                PROPERTY_METHOD_DEFINE(muteRemoteAudioStream)
                PROPERTY_METHOD_DEFINE(muteLocalVideoStream)
                PROPERTY_METHOD_DEFINE(enableLocalVideo)
                PROPERTY_METHOD_DEFINE(enableLocalAudio)
                PROPERTY_METHOD_DEFINE(muteAllRemoteVideoStreams)
                PROPERTY_METHOD_DEFINE(setDefaultMuteAllRemoteVideoStreams)
                PROPERTY_METHOD_DEFINE(muteRemoteVideoStream)
                PROPERTY_METHOD_DEFINE(setRemoteVideoStreamType)
                PROPERTY_METHOD_DEFINE(setRemoteDefaultVideoStreamType)
                PROPERTY_METHOD_DEFINE(enableAudioVolumeIndication)
                PROPERTY_METHOD_DEFINE(startAudioRecording)
                PROPERTY_METHOD_DEFINE(stopAudioRecording)
                PROPERTY_METHOD_DEFINE(startAudioMixing)
                PROPERTY_METHOD_DEFINE(stopAudioMixing)
                PROPERTY_METHOD_DEFINE(pauseAudioMixing)
                PROPERTY_METHOD_DEFINE(resumeAudioMixing)
                PROPERTY_METHOD_DEFINE(adjustAudioMixingVolume)
                PROPERTY_METHOD_DEFINE(adjustAudioMixingPlayoutVolume)
                PROPERTY_METHOD_DEFINE(adjustAudioMixingPublishVolume)
                PROPERTY_METHOD_DEFINE(getAudioMixingPlayoutVolume)
                PROPERTY_METHOD_DEFINE(getAudioMixingPublishVolume)
                PROPERTY_METHOD_DEFINE(getAudioMixingDuration)
                PROPERTY_METHOD_DEFINE(getAudioMixingCurrentPosition)
                PROPERTY_METHOD_DEFINE(setAudioMixingPosition)
                PROPERTY_METHOD_DEFINE(getEffectsVolume)
                PROPERTY_METHOD_DEFINE(setEffectsVolume)
                PROPERTY_METHOD_DEFINE(setVolumeOfEffect)
                PROPERTY_METHOD_DEFINE(playEffect)
                PROPERTY_METHOD_DEFINE(stopEffect)
                PROPERTY_METHOD_DEFINE(stopAllEffects)
                PROPERTY_METHOD_DEFINE(preloadEffect)
                PROPERTY_METHOD_DEFINE(unloadEffect)
                PROPERTY_METHOD_DEFINE(pauseEffect)
                PROPERTY_METHOD_DEFINE(pauseAllEffects)
                PROPERTY_METHOD_DEFINE(resumeEffect)
                PROPERTY_METHOD_DEFINE(resumeAllEffects)
                PROPERTY_METHOD_DEFINE(setLocalVoicePitch)
                PROPERTY_METHOD_DEFINE(setLocalVoiceEqualization)
                PROPERTY_METHOD_DEFINE(setLocalVoiceReverb)
                // PROPERTY_METHOD_DEFINE(setExternalAudioSink)
                // PROPERTY_METHOD_DEFINE(setLocalPublishFallbackOption)
                // PROPERTY_METHOD_DEFINE(setRemoteSubscribeFallbackOption)
                PROPERTY_METHOD_DEFINE(setAudioProfile)
                PROPERTY_METHOD_DEFINE(pauseAudio)
                PROPERTY_METHOD_DEFINE(resumeAudio)
                PROPERTY_METHOD_DEFINE(setExternalAudioSource)
                PROPERTY_METHOD_DEFINE(getScreenWindowsInfo)
                PROPERTY_METHOD_DEFINE(getScreenDisplaysInfo)
                // PROPERTY_METHOD_DEFINE(startScreenCapture)
                PROPERTY_METHOD_DEFINE(stopScreenCapture)
                PROPERTY_METHOD_DEFINE(updateScreenCaptureRegion)
                PROPERTY_METHOD_DEFINE(setLogFile)
                PROPERTY_METHOD_DEFINE(setLogFilter)
                PROPERTY_METHOD_DEFINE(setLocalVideoMirrorMode)
                PROPERTY_METHOD_DEFINE(enableDualStreamMode)
                PROPERTY_METHOD_DEFINE(setRecordingAudioFrameParameters)
                PROPERTY_METHOD_DEFINE(setPlaybackAudioFrameParameters)
                PROPERTY_METHOD_DEFINE(setMixedAudioFrameParameters)
                PROPERTY_METHOD_DEFINE(adjustRecordingSignalVolume)
                PROPERTY_METHOD_DEFINE(adjustPlaybackSignalVolume)
                // PROPERTY_METHOD_DEFINE(setHighQualityAudioParameters)
                PROPERTY_METHOD_DEFINE(enableWebSdkInteroperability)
                // PROPERTY_METHOD_DEFINE(setVideoQualityParameters)
                PROPERTY_METHOD_DEFINE(enableLoopbackRecording)
                PROPERTY_METHOD_DEFINE(enableLoopbackRecording2)
                PROPERTY_METHOD_DEFINE(registerDeliverFrame)
                PROPERTY_METHOD_DEFINE(setupLocalVideo)
                PROPERTY_METHOD_DEFINE(subscribe)
                PROPERTY_METHOD_DEFINE(unsubscribe)
                PROPERTY_METHOD_DEFINE(getVideoDevices)
                PROPERTY_METHOD_DEFINE(setVideoDevice)
                PROPERTY_METHOD_DEFINE(getCurrentVideoDevice)
                PROPERTY_METHOD_DEFINE(startVideoDeviceTest)
                PROPERTY_METHOD_DEFINE(stopVideoDeviceTest)
                PROPERTY_METHOD_DEFINE(getAudioPlaybackDevices)
                PROPERTY_METHOD_DEFINE(setAudioPlaybackDevice)
                PROPERTY_METHOD_DEFINE(getPlaybackDeviceInfo)
                PROPERTY_METHOD_DEFINE(getCurrentAudioPlaybackDevice)
                PROPERTY_METHOD_DEFINE(setAudioPlaybackVolume)
                PROPERTY_METHOD_DEFINE(getAudioPlaybackVolume)
                PROPERTY_METHOD_DEFINE(getAudioRecordingDevices)
                PROPERTY_METHOD_DEFINE(setAudioRecordingDevice)
                PROPERTY_METHOD_DEFINE(getRecordingDeviceInfo)
                PROPERTY_METHOD_DEFINE(getCurrentAudioRecordingDevice)
                PROPERTY_METHOD_DEFINE(getAudioRecordingVolume)
                PROPERTY_METHOD_DEFINE(setAudioRecordingVolume)
                PROPERTY_METHOD_DEFINE(startAudioPlaybackDeviceTest)
                PROPERTY_METHOD_DEFINE(stopAudioPlaybackDeviceTest)
                PROPERTY_METHOD_DEFINE(startAudioRecordingDeviceTest)
                PROPERTY_METHOD_DEFINE(stopAudioRecordingDeviceTest)
                PROPERTY_METHOD_DEFINE(getAudioPlaybackDeviceMute)
                PROPERTY_METHOD_DEFINE(setAudioPlaybackDeviceMute)
                PROPERTY_METHOD_DEFINE(getAudioRecordingDeviceMute)
                PROPERTY_METHOD_DEFINE(setAudioRecordingDeviceMute)
                PROPERTY_METHOD_DEFINE(setEncryptionMode)
                PROPERTY_METHOD_DEFINE(addPublishStreamUrl)
                PROPERTY_METHOD_DEFINE(removePublishStreamUrl)
                PROPERTY_METHOD_DEFINE(addVideoWatermark)
                PROPERTY_METHOD_DEFINE(clearVideoWatermarks)
                PROPERTY_METHOD_DEFINE(setLiveTranscoding)
                PROPERTY_METHOD_DEFINE(addInjectStreamUrl)
                PROPERTY_METHOD_DEFINE(removeInjectStreamUrl)
                PROPERTY_METHOD_DEFINE(setBool);
                PROPERTY_METHOD_DEFINE(setInt);
                PROPERTY_METHOD_DEFINE(setUInt);
                PROPERTY_METHOD_DEFINE(setNumber);
                PROPERTY_METHOD_DEFINE(setString);
                PROPERTY_METHOD_DEFINE(setObject);
                PROPERTY_METHOD_DEFINE(getBool);
                PROPERTY_METHOD_DEFINE(getInt);
                PROPERTY_METHOD_DEFINE(getUInt);
                PROPERTY_METHOD_DEFINE(getNumber);
                PROPERTY_METHOD_DEFINE(getString);
                PROPERTY_METHOD_DEFINE(getObject);
                PROPERTY_METHOD_DEFINE(getArray);
                PROPERTY_METHOD_DEFINE(setParameters);
                // PROPERTY_METHOD_DEFINE(setProfile);
                PROPERTY_METHOD_DEFINE(convertPath);
                PROPERTY_METHOD_DEFINE(setVideoRenderDimension);
                PROPERTY_METHOD_DEFINE(setHighFPS);
                PROPERTY_METHOD_DEFINE(setFPS);
                PROPERTY_METHOD_DEFINE(addToHighVideo);
                PROPERTY_METHOD_DEFINE(removeFromHighVideo);

                //plugin apis
                PROPERTY_METHOD_DEFINE(initializePluginManager);
                PROPERTY_METHOD_DEFINE(releasePluginManager);
                PROPERTY_METHOD_DEFINE(registerPlugin);
                PROPERTY_METHOD_DEFINE(unregisterPlugin);
                PROPERTY_METHOD_DEFINE(enablePlugin);
                PROPERTY_METHOD_DEFINE(getPlugins);
                PROPERTY_METHOD_DEFINE(setPluginParameter);
                PROPERTY_METHOD_DEFINE(getPluginParameter);

                //2.3.3 apis
                PROPERTY_METHOD_DEFINE(getConnectionState);
                PROPERTY_METHOD_DEFINE(release);

                //2.4.0 apis
                // PROPERTY_METHOD_DEFINE(setBeautyEffectOptions);
                PROPERTY_METHOD_DEFINE(setLocalVoiceChanger);
                PROPERTY_METHOD_DEFINE(setLocalVoiceReverbPreset);
                // PROPERTY_METHOD_DEFINE(enableSoundPositionIndication);
                // PROPERTY_METHOD_DEFINE(setRemoteVoicePosition);
                PROPERTY_METHOD_DEFINE(startLastmileProbeTest);
                PROPERTY_METHOD_DEFINE(stopLastmileProbeTest);
                PROPERTY_METHOD_DEFINE(setRemoteUserPriority);
                // PROPERTY_METHOD_DEFINE(startEchoTestWithInterval);
                PROPERTY_METHOD_DEFINE(startRecordingDeviceTest);
                PROPERTY_METHOD_DEFINE(stopRecordingDeviceTest);
                // PROPERTY_METHOD_DEFINE(setCameraCapturerConfiguration);
                PROPERTY_METHOD_DEFINE(setLogFileSize);

                /**
                 * 2.8.0 Apis
                 */
                // PROPERTY_METHOD_DEFINE(registerLocalUserAccount);
                // PROPERTY_METHOD_DEFINE(joinChannelWithUserAccount);
                // PROPERTY_METHOD_DEFINE(getUserInfoByUserAccount);
                // PROPERTY_METHOD_DEFINE(getUserInfoByUid);

                /**
                 * 2.9.0 Apis
                 */
                // PROPERTY_METHOD_DEFINE(switchChannel);
                PROPERTY_METHOD_DEFINE(startChannelMediaRelay);
                PROPERTY_METHOD_DEFINE(updateChannelMediaRelay);
                PROPERTY_METHOD_DEFINE(stopChannelMediaRelay);


                /**
                 * 2.9.0.100 Apis
                 */
                PROPERTY_METHOD_DEFINE(startScreenCaptureByScreen);
                PROPERTY_METHOD_DEFINE(startScreenCaptureByWindow);
                PROPERTY_METHOD_DEFINE(updateScreenCaptureParameters);
                PROPERTY_METHOD_DEFINE(setScreenCaptureContentHint);


                /**
                 * 3.0.0 Apis
                 */
                // PROPERTY_METHOD_DEFINE(adjustUserPlaybackSignalVolume);

                // PROPERTY_METHOD_DEFINE(setAudioMixingPitch);
                PROPERTY_METHOD_DEFINE(sendMetadata);
                PROPERTY_METHOD_DEFINE(addMetadataEventHandler);
                PROPERTY_METHOD_DEFINE(setMaxMetadataSize);
                PROPERTY_METHOD_DEFINE(registerMediaMetadataObserver);
                PROPERTY_METHOD_DEFINE(unRegisterMediaMetadataObserver);

                PROPERTY_METHOD_DEFINE(sendCustomReportMessage);
                PROPERTY_METHOD_DEFINE(enableEncryption);

                PROPERTY_METHOD_DEFINE(startLocalVideoTranscoder);
                PROPERTY_METHOD_DEFINE(updateLocalTranscoderConfiguration);
                PROPERTY_METHOD_DEFINE(stopLocalVideoTranscoder);
                PROPERTY_METHOD_DEFINE(joinChannelEx);
                PROPERTY_METHOD_DEFINE(joinChannel2);
                PROPERTY_METHOD_DEFINE(updateChannelMediaOptions);

                PROPERTY_METHOD_DEFINE(createMediaPlayer);

                PROPERTY_METHOD_DEFINE(startPrimaryCameraCapture);
                PROPERTY_METHOD_DEFINE(startSecondaryCameraCapture);
                PROPERTY_METHOD_DEFINE(stopPrimaryCameraCapture);
                PROPERTY_METHOD_DEFINE(stopSecondaryCameraCapture);
                PROPERTY_METHOD_DEFINE(startPrimaryScreenCapture);
                PROPERTY_METHOD_DEFINE(startSecondaryScreenCapture);
                PROPERTY_METHOD_DEFINE(stopPrimaryScreenCapture);
                PROPERTY_METHOD_DEFINE(stopSecondaryScreenCapture);
                PROPERTY_METHOD_DEFINE(adjustLoopbackRecordingVolume);
                PROPERTY_METHOD_DEFINE(setCameraDeviceOrientation);

                // Extension
                PROPERTY_METHOD_DEFINE(enableExtension);
                PROPERTY_METHOD_DEFINE(setExtensionProperty);
                PROPERTY_METHOD_DEFINE(setScreenCaptureOrientation);
                

            EN_PROPERTY_DEFINE()
            module->Set(context, Nan::New<v8::String>("NodeRtcEngine").ToLocalChecked(), tpl->GetFunction(context).ToLocalChecked());
        }

        /**
         * The function is used as class constructor in JS layer
         */
        void NodeRtcEngine::createInstance(const FunctionCallbackInfo<Value>& args)
        {
            LOG_ENTER;
            Isolate *isolate = args.GetIsolate();
            /*
            *  Called from new
            */
            if (args.IsConstructCall()) {
                NodeRtcEngine *engine = new NodeRtcEngine(isolate);
                engine->Wrap(args.This());
                args.GetReturnValue().Set(args.This());
            }
            else {
                Local<Function> cons = Local<Function>::New(isolate, constructor);
                Local<Context> context = isolate->GetCurrentContext();
                Local<Object> instance = cons->NewInstance(context).ToLocalChecked();
                args.GetReturnValue().Set(instance);
            }
            LOG_LEAVE;
        }

        /**
         * Constructor
         */
        NodeRtcEngine::NodeRtcEngine(Isolate* isolate)
            : m_isolate(isolate)
        {
            LOG_ENTER;
            /** m_engine provide SDK functionality */
            m_engine = createAgoraRtcEngine();
            /** m_eventHandler provide SDK event handler. */
            m_eventHandler.reset(new NodeEventHandler(this));
            /** Node ADDON takes advantage of self render interface */
            m_nodeVideoFrameObserver.reset(new NodeVideoFrameObserver());
            /** Video/Audio Plugins */
            m_avPluginManager.reset(new IAVFramePluginManager());
            metadataObserver.reset(new NodeMetadataObserver());
            LOG_LEAVE;
        }

        NodeRtcEngine::~NodeRtcEngine()
        {
            LOG_ENTER;
            if (m_audioVdm) {
                m_audioVdm->release();
                //delete[] m_audioVdm;
                m_audioVdm = nullptr;
            }
            if (m_videoVdm) {
                m_videoVdm->release();
                //delete[] m_videoVdm;
                m_videoVdm = nullptr;
            }
            if (m_engine) {
                m_engine->release();
                m_engine = nullptr;
            }
            if (metadataObserver.get()) {
                metadataObserver.reset(nullptr);
            }
            m_nodeVideoFrameObserver.reset(nullptr);
            m_eventHandler.reset(nullptr);
            m_avPluginManager.reset(nullptr);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE_WRAPPER_PARAM_0(startEchoTest);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(stopEchoTest);

        // NAPI_API_DEFINE_WRAPPER_PARAM_0(enableLastmileTest);

        // NAPI_API_DEFINE_WRAPPER_PARAM_0(disableLastmileTest);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(enableVideo);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(disableVideo);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(startPreview);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(stopPreview);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(enableAudio);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(disableAudio);

        // NAPI_API_DEFINE_WRAPPER_PARAM_2(adjustUserPlaybackSignalVolume, uid_t, int32);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(stopAudioRecording);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(stopAudioMixing);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(pauseAudioMixing);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(resumeAudioMixing);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(pauseAudio);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(resumeAudio);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(getEffectsVolume);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(setEffectsVolume, int32);

        NAPI_API_DEFINE_WRAPPER_PARAM_2(setVolumeOfEffect, int32, int32);

        NAPI_API_DEFINE_WRAPPER_PARAM_7(playEffect, int32, nodestring, int32, double, double, int32, bool);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(stopEffect, int32);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(stopAllEffects);

        NAPI_API_DEFINE_WRAPPER_PARAM_2(preloadEffect, int32, nodestring);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(unloadEffect, int32);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(pauseEffect, int32);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(pauseAllEffects);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(resumeEffect, int32);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(resumeAllEffects);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(muteLocalAudioStream, bool);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(muteAllRemoteAudioStreams, bool);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(setDefaultMuteAllRemoteAudioStreams, bool);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(muteLocalVideoStream, bool);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(enableLocalVideo, bool);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(muteAllRemoteVideoStreams, bool);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(setDefaultMuteAllRemoteVideoStreams, bool);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(adjustAudioMixingVolume, int32);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(adjustAudioMixingPlayoutVolume, int32);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(adjustAudioMixingPublishVolume, int32);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(setAudioMixingPosition, int32);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(setLocalVoicePitch, double);

        //NAPI_API_DEFINE_WRAPPER_PARAM_3(setExternalAudioSink, bool, int32, int32);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(setLogFile, nodestring);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(setLogFilter, uint32);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(enableDualStreamMode, bool);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(adjustRecordingSignalVolume, int32);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(adjustPlaybackSignalVolume, int32);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(enableWebSdkInteroperability, bool);

        NAPI_API_DEFINE_WRAPPER_PARAM_1(adjustLoopbackRecordingVolume, int32);

        // NAPI_API_DEFINE_WRAPPER_PARAM_1(setVideoQualityParameters, bool);

        NAPI_API_DEFINE(NodeRtcEngine, addPublishStreamUrl)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring url;
                bool transcodingEnabled;
                napi_status status = napi_get_value_nodestring_(args[0], url);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_bool_(args[1], transcodingEnabled);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->addPublishStreamUrl(url, transcodingEnabled);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE_WRAPPER_PARAM_1(removePublishStreamUrl, nodestring);
        NAPI_API_DEFINE(NodeRtcEngine, addVideoWatermark)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status;

                CHECK_ARG_NUM(pEngine, args, 2);

                nodestring url;
                status = napi_get_value_nodestring_(args[0], url);
                CHECK_NAPI_STATUS(pEngine, status);

                agora::rtc::WatermarkOptions watermarkOptions;
                Local<Object> options;
                BEGIN_OBJECT_DEFINE(options, args[1]);

                GET_OBJECT_PROPERTY(options, bool, "visibleInPreview", watermarkOptions.visibleInPreview);

                Local<Object> landscapemode;
                agora::rtc::Rectangle positionInLandscapeMode;
                BEGIN_SUB_OBJECT_DEFINE(landscapemode, options, "positionInLandscapeMode");
                GET_OBJECT_PROPERTY(landscapemode, int32, "x", positionInLandscapeMode.x);
                GET_OBJECT_PROPERTY(landscapemode, int32, "y", positionInLandscapeMode.y);
                GET_OBJECT_PROPERTY(landscapemode, int32, "width", positionInLandscapeMode.width);
                GET_OBJECT_PROPERTY(landscapemode, int32, "height", positionInLandscapeMode.height);
                watermarkOptions.positionInLandscapeMode = positionInLandscapeMode;

                Local<Object> portraitmode;
                agora::rtc::Rectangle positionInPortraitMode;
                BEGIN_SUB_OBJECT_DEFINE(portraitmode, options, "positionInPortraitMode");
                GET_OBJECT_PROPERTY(portraitmode, int32, "x", positionInLandscapeMode.x);
                GET_OBJECT_PROPERTY(portraitmode, int32, "y", positionInLandscapeMode.y);
                GET_OBJECT_PROPERTY(portraitmode, int32, "width", positionInLandscapeMode.width);
                GET_OBJECT_PROPERTY(portraitmode, int32, "height", positionInLandscapeMode.height);
                watermarkOptions.positionInPortraitMode = positionInPortraitMode;

                result = pEngine->m_engine->addVideoWatermark(url, watermarkOptions);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }
        NAPI_API_DEFINE_WRAPPER_PARAM_0(clearVideoWatermarks);

        NAPI_API_DEFINE(NodeRtcEngine, startLocalVideoTranscoder)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            TranscodingVideoStream* videoInputStreams = nullptr;
            nodestring* imageUrlList = nullptr;
            int result = -1;
            do {
                //---------------------
                LocalTranscoderConfiguration localTranscoderConfiguration;
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                CHECK_ARG_NUM(pEngine, args, 1);

                unsigned int streamCount;
                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[0], obj);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_uint32_(isolate, obj, "streamCount", streamCount);
                CHECK_NAPI_STATUS(pEngine, status);
                localTranscoderConfiguration.streamCount = streamCount;
                if (streamCount > 0) {
                    videoInputStreams = new TranscodingVideoStream[streamCount];
                    imageUrlList = new nodestring[streamCount];

                    Local<Name> keyName = Nan::New<String>("videoInputStreams").ToLocalChecked();
                    Local<Value> videoInputStreamsObj = obj->Get(isolate->GetCurrentContext(), keyName).ToLocalChecked();
                    if (videoInputStreamsObj->IsNullOrUndefined() || !videoInputStreamsObj->IsArray()) {
                        status = napi_invalid_arg;
                        CHECK_NAPI_STATUS(pEngine, status);
                    }
                    auto videoInputStreamsValue = v8::Array::Cast(*videoInputStreamsObj);
                    if (videoInputStreamsValue->Length() != streamCount) {
                        status = napi_invalid_arg;
                        CHECK_NAPI_STATUS(pEngine, status);
                    }
                    for (uint32 i = 0; i < streamCount; i++) {
                        Local<Value> value = videoInputStreamsValue->Get(context, i).ToLocalChecked();
                        Local<Object> videoInputStreamObj;
                        status = napi_get_value_object_(isolate, value, videoInputStreamObj);
                        if (videoInputStreamObj->IsNullOrUndefined()) {
                            status = napi_invalid_arg;
                            break;
                        }

                        int sourceType;
                        napi_get_object_property_int32_(isolate, videoInputStreamObj, "sourceType", sourceType);
                        CHECK_NAPI_STATUS(pEngine, status);
                        videoInputStreams[i].sourceType = (MEDIA_SOURCE_TYPE)sourceType;
                        napi_get_object_property_uint32_(isolate, videoInputStreamObj, "remoteUserUid", videoInputStreams[i].remoteUserUid);
                        napi_get_object_property_uint32_(isolate, videoInputStreamObj, "connectionId", videoInputStreams[i].connectionId);
                        napi_get_object_property_nodestring_(isolate, videoInputStreamObj, "imageUrl", imageUrlList[i]);
                        if (status == napi_ok) {
                            if (videoInputStreams[i].sourceType == VIDEO_SOURCE_MEDIA_PLAYER) {
                                char* buffer = imageUrlList[i];
                                if (buffer) {
                                    int sourceId = atoi(buffer);
                                    videoInputStreams[i].imageUrl = (char*) sourceId;
                                }
                            } else {
                                videoInputStreams[i].imageUrl = imageUrlList[i];
                            }
                        }
						double x, y, width, height;
						napi_get_object_property_double_(isolate, videoInputStreamObj, "x", x);
                        CHECK_NAPI_STATUS(pEngine, status);
						napi_get_object_property_double_(isolate, videoInputStreamObj, "y", y);
                        CHECK_NAPI_STATUS(pEngine, status);
						napi_get_object_property_double_(isolate, videoInputStreamObj, "width", width);
                        CHECK_NAPI_STATUS(pEngine, status);
						napi_get_object_property_double_(isolate, videoInputStreamObj, "height", height);
                        CHECK_NAPI_STATUS(pEngine, status);

						videoInputStreams[i].x = (int)x;
						videoInputStreams[i].y = (int)y;
						videoInputStreams[i].width = (int)width;
						videoInputStreams[i].height = (int)height;

                        napi_get_object_property_int32_(isolate, videoInputStreamObj, "zOrder", videoInputStreams[i].zOrder);
                        napi_get_object_property_double_(isolate, videoInputStreamObj, "alpha", videoInputStreams[i].alpha);
                        napi_get_object_property_bool_(isolate, videoInputStreamObj, "mirror", videoInputStreams[i].mirror);
                    }
                    localTranscoderConfiguration.VideoInputStreams = videoInputStreams;
                }

                VideoDimensions dimensions;
                VideoEncoderConfiguration config;
                Local<Object> videoOutputConfigurationObj;

                Local<Name> keyName = Nan::New<String>("videoOutputConfiguration").ToLocalChecked();
                Local<Value> videoOutputConfigurationValue = obj->Get(isolate->GetCurrentContext(), keyName).ToLocalChecked();
                if (!videoOutputConfigurationValue->IsNullOrUndefined()) {
                    Local<Object> videoOutputConfigurationObj;
					status = napi_get_value_object_(isolate, videoOutputConfigurationValue, videoOutputConfigurationObj);
                    CHECK_NAPI_STATUS(pEngine, status);
                    status = napi_get_object_property_int32_(isolate, videoOutputConfigurationObj, "width", dimensions.width);
                    CHECK_NAPI_STATUS(pEngine, status);
                    status = napi_get_object_property_int32_(isolate, videoOutputConfigurationObj, "height", dimensions.height);
                    CHECK_NAPI_STATUS(pEngine, status);
                    config.dimensions = dimensions;
                    status = napi_get_object_property_int32_(isolate, videoOutputConfigurationObj, "bitrate", config.bitrate);
                    CHECK_NAPI_STATUS(pEngine, status);
                    status = napi_get_object_property_int32_(isolate, videoOutputConfigurationObj, "minBitrate", config.minBitrate);
                    CHECK_NAPI_STATUS(pEngine, status);

                    int frameRateVal;
                    FRAME_RATE frameRate;
                    status = napi_get_object_property_int32_(isolate, videoOutputConfigurationObj, "frameRate", frameRateVal);
                    CHECK_NAPI_STATUS(pEngine, status);
                    config.frameRate = (FRAME_RATE)frameRateVal;
                    int orientationModeVal;
                    ORIENTATION_MODE orientationMode;
                    status = napi_get_object_property_int32_(isolate, videoOutputConfigurationObj, "orientationMode", orientationModeVal);
                    CHECK_NAPI_STATUS(pEngine, status);

                    switch(orientationModeVal) {
                        case 0:
                            orientationMode = ORIENTATION_MODE_ADAPTIVE;
                            break;
                        case 1:
                            orientationMode = ORIENTATION_MODE_FIXED_LANDSCAPE;
                            break;
                        case 2:
                            orientationMode = ORIENTATION_MODE_FIXED_PORTRAIT;
                            break;
                        default:
                            status = napi_invalid_arg;
                            break;
                    }
                    CHECK_NAPI_STATUS(pEngine, status);
                    config.orientationMode = orientationMode;
                    int degradationPrefValue;
                    DEGRADATION_PREFERENCE degradationPref;
                    status = napi_get_object_property_int32_(isolate, videoOutputConfigurationObj, "degradationPreference", degradationPrefValue);
                    CHECK_NAPI_STATUS(pEngine, status);

                    switch(degradationPrefValue) {
                        case 0:
                            degradationPref = MAINTAIN_QUALITY;
                            break;
                        case 1:
                            degradationPref = MAINTAIN_FRAMERATE;
                            break;
                        case 2:
                            degradationPref = MAINTAIN_BALANCED;
                            break;
                        default:
                            status = napi_invalid_arg;
                            break;
                    }
                    CHECK_NAPI_STATUS(pEngine, status);
                    config.degradationPreference = degradationPref;

                    int mirrorMode;
                    status = napi_get_object_property_int32_(isolate, videoOutputConfigurationObj, "mirrorMode", mirrorMode);
                    config.mirrorMode = VIDEO_MIRROR_MODE_TYPE(mirrorMode);
                }

                localTranscoderConfiguration.videoOutputConfiguration = config;
                result = pEngine->m_engine->startLocalVideoTranscoder(localTranscoderConfiguration);
            } while (false);
            if (videoInputStreams) {
                delete[] videoInputStreams;
                videoInputStreams = nullptr;
            }
            if (imageUrlList) {
                delete[] imageUrlList;
                imageUrlList = nullptr;
            }
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, updateLocalTranscoderConfiguration)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            TranscodingVideoStream* videoInputStreams = nullptr;
            nodestring* imageUrlList = nullptr;
            int result = -1;
            do {
                //---------------------
                LocalTranscoderConfiguration localTranscoderConfiguration;
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                CHECK_ARG_NUM(pEngine, args, 1);

                unsigned int streamCount;
                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[0], obj);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_uint32_(isolate, obj, "streamCount", streamCount);
                CHECK_NAPI_STATUS(pEngine, status);
                localTranscoderConfiguration.streamCount = streamCount;
                if (streamCount > 0) {
                    videoInputStreams = new TranscodingVideoStream[streamCount];
                    imageUrlList = new nodestring[streamCount];

                    Local<Name> keyName = Nan::New<String>("videoInputStreams").ToLocalChecked();
                    Local<Value> videoInputStreamsObj = obj->Get(isolate->GetCurrentContext(), keyName).ToLocalChecked();
                    if (videoInputStreamsObj->IsNullOrUndefined() || !videoInputStreamsObj->IsArray()) {
                        status = napi_invalid_arg;
                        CHECK_NAPI_STATUS(pEngine, status);
                    }
                    auto videoInputStreamsValue = v8::Array::Cast(*videoInputStreamsObj);
                    if (videoInputStreamsValue->Length() != streamCount) {
                        status = napi_invalid_arg;
                        CHECK_NAPI_STATUS(pEngine, status);
                    }
                    for (uint32 i = 0; i < streamCount; i++) {
                        Local<Value> value = videoInputStreamsValue->Get(context, i).ToLocalChecked();
                        Local<Object> videoInputStreamObj;
                        status = napi_get_value_object_(isolate, value, videoInputStreamObj);
                        if (videoInputStreamObj->IsNullOrUndefined()) {
                            status = napi_invalid_arg;
                            break;
                        }
                        int sourceType;
                        napi_get_object_property_int32_(isolate, videoInputStreamObj, "sourceType", sourceType);
                        CHECK_NAPI_STATUS(pEngine, status);
                        videoInputStreams[i].sourceType = (MEDIA_SOURCE_TYPE)sourceType;
                        napi_get_object_property_uint32_(isolate, videoInputStreamObj, "remoteUserUid", videoInputStreams[i].remoteUserUid);
                        CHECK_NAPI_STATUS(pEngine, status);
                        napi_get_object_property_uint32_(isolate, videoInputStreamObj, "connectionId", videoInputStreams[i].connectionId);
                        CHECK_NAPI_STATUS(pEngine, status);
                        napi_get_object_property_nodestring_(isolate, videoInputStreamObj, "imageUrl", imageUrlList[i]);
                        CHECK_NAPI_STATUS(pEngine, status);
                        if (status == napi_ok) {
                            if (videoInputStreams[i].sourceType == VIDEO_SOURCE_MEDIA_PLAYER) {
                                char* buffer = imageUrlList[i];
                                if (buffer) {
                                    int sourceId = atoi(buffer);
                                    videoInputStreams[i].imageUrl = (char*) sourceId;
                                }
                            } else {
                                videoInputStreams[i].imageUrl = imageUrlList[i];
                            }
                        }
						double x, y, width, height;
						napi_get_object_property_double_(isolate, videoInputStreamObj, "x", x);
                        CHECK_NAPI_STATUS(pEngine, status);
						napi_get_object_property_double_(isolate, videoInputStreamObj, "y", y);
                        CHECK_NAPI_STATUS(pEngine, status);
						napi_get_object_property_double_(isolate, videoInputStreamObj, "width", width);
                        CHECK_NAPI_STATUS(pEngine, status);
						napi_get_object_property_double_(isolate, videoInputStreamObj, "height", height);
                        CHECK_NAPI_STATUS(pEngine, status);
						videoInputStreams[i].x = (int)x;
						videoInputStreams[i].y = (int)y;
						videoInputStreams[i].width = (int)width;
						videoInputStreams[i].height = (int)height;
                        napi_get_object_property_int32_(isolate, videoInputStreamObj, "zOrder", videoInputStreams[i].zOrder);
                        CHECK_NAPI_STATUS(pEngine, status);
                        napi_get_object_property_double_(isolate, videoInputStreamObj, "alpha", videoInputStreams[i].alpha);
                        CHECK_NAPI_STATUS(pEngine, status);
                        napi_get_object_property_bool_(isolate, videoInputStreamObj, "mirror", videoInputStreams[i].mirror);
                    }
                    localTranscoderConfiguration.VideoInputStreams = videoInputStreams;
                }

                VideoDimensions dimensions;
                VideoEncoderConfiguration config;
                Local<Object> videoOutputConfigurationObj;

                Local<Name> keyName = Nan::New<String>("videoOutputConfiguration").ToLocalChecked();
                Local<Value> videoOutputConfigurationValue = obj->Get(isolate->GetCurrentContext(), keyName).ToLocalChecked();
                if (!videoOutputConfigurationValue->IsNullOrUndefined()) {
                    Local<Object> videoOutputConfigurationObj;
					status = napi_get_value_object_(isolate, videoOutputConfigurationValue, videoOutputConfigurationObj);
                    CHECK_NAPI_STATUS(pEngine, status)
                    status = napi_get_object_property_int32_(isolate, videoOutputConfigurationObj, "width", dimensions.width);
                    CHECK_NAPI_STATUS(pEngine, status);
                    status = napi_get_object_property_int32_(isolate, videoOutputConfigurationObj, "height", dimensions.height);
                    CHECK_NAPI_STATUS(pEngine, status);
                    config.dimensions = dimensions;
                    status = napi_get_object_property_int32_(isolate, videoOutputConfigurationObj, "bitrate", config.bitrate);
                    CHECK_NAPI_STATUS(pEngine, status);
                    status = napi_get_object_property_int32_(isolate, videoOutputConfigurationObj, "minBitrate", config.minBitrate);
                    CHECK_NAPI_STATUS(pEngine, status);

                    int frameRateVal;
                    FRAME_RATE frameRate;
                    status = napi_get_object_property_int32_(isolate, videoOutputConfigurationObj, "frameRate", frameRateVal);
                    CHECK_NAPI_STATUS(pEngine, status);
                    config.frameRate = (FRAME_RATE)frameRateVal;
                    int orientationModeVal;
                    ORIENTATION_MODE orientationMode;
                    status = napi_get_object_property_int32_(isolate, videoOutputConfigurationObj, "orientationMode", orientationModeVal);
                    CHECK_NAPI_STATUS(pEngine, status);

                    switch(orientationModeVal) {
                        case 0:
                            orientationMode = ORIENTATION_MODE_ADAPTIVE;
                            break;
                        case 1:
                            orientationMode = ORIENTATION_MODE_FIXED_LANDSCAPE;
                            break;
                        case 2:
                            orientationMode = ORIENTATION_MODE_FIXED_PORTRAIT;
                            break;
                        default:
                            status = napi_invalid_arg;
                            break;
                    }
                    CHECK_NAPI_STATUS(pEngine, status);
                    config.orientationMode = orientationMode;
                    int degradationPrefValue;
                    DEGRADATION_PREFERENCE degradationPref;
                    status = napi_get_object_property_int32_(isolate, videoOutputConfigurationObj, "degradationPreference", degradationPrefValue);
                    CHECK_NAPI_STATUS(pEngine, status);

                    switch(degradationPrefValue) {
                        case 0:
                            degradationPref = MAINTAIN_QUALITY;
                            break;
                        case 1:
                            degradationPref = MAINTAIN_FRAMERATE;
                            break;
                        case 2:
                            degradationPref = MAINTAIN_BALANCED;
                            break;
                        default:
                            status = napi_invalid_arg;
                            break;
                    }
                    CHECK_NAPI_STATUS(pEngine, status);
                    config.degradationPreference = degradationPref;

                    int mirrorMode;
                    status = napi_get_object_property_int32_(isolate, videoOutputConfigurationObj, "mirrorMode", mirrorMode);
                    config.mirrorMode = VIDEO_MIRROR_MODE_TYPE(mirrorMode);
                }
                localTranscoderConfiguration.videoOutputConfiguration = config;
                result = pEngine->m_engine->updateLocalTranscoderConfiguration(localTranscoderConfiguration);
            } while (false);
            if (videoInputStreams) {
                delete[] videoInputStreams;
                videoInputStreams = nullptr;
            }
            if (imageUrlList) {
                delete[] imageUrlList;
                imageUrlList = nullptr;
            }
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE_WRAPPER_PARAM_0(stopLocalVideoTranscoder);

        NAPI_API_DEFINE(NodeRtcEngine, setLiveTranscoding)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            TranscodingUser *users = nullptr;
            RtcImage wkImage;
            RtcImage bgImage;
            do {
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_status status;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                CHECK_ARG_NUM(pEngine, args, 1);

                LiveTranscoding transcoding;
                nodestring extrainfo;
                int videoCodecProfile, audioSampleRateType;
                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[0], obj);
                CHECK_NAPI_STATUS(pEngine, status);

                nodestring transcodingExtraInfo;
                status = napi_get_object_property_int32_(isolate, obj, "width", transcoding.width);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "height", transcoding.height);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "videoBitrate", transcoding.videoBitrate);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "videoFrameRate", transcoding.videoFramerate);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_bool_(isolate, obj, "lowLatency", transcoding.lowLatency);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "videoGop", transcoding.videoGop);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, obj, "videoCodecProfile", videoCodecProfile);
                CHECK_NAPI_STATUS(pEngine, status);
                transcoding.videoCodecProfile = (VIDEO_CODEC_PROFILE_TYPE)videoCodecProfile;

                status = napi_get_object_property_uint32_(isolate, obj, "backgroundColor", transcoding.backgroundColor);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_uint32_(isolate, obj, "userCount", transcoding.userCount);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, obj, "audioSampleRate", audioSampleRateType);
                transcoding.audioSampleRate = (AUDIO_SAMPLE_RATE_TYPE)audioSampleRateType;
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, obj, "audioBitrate", transcoding.audioBitrate);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, obj, "audioChannels", transcoding.audioChannels);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_nodestring_(isolate, obj, "transcodingExtraInfo", transcodingExtraInfo);
                CHECK_NAPI_STATUS(pEngine, status);
                transcoding.transcodingExtraInfo = transcodingExtraInfo;

                nodestring wmurl;
                Local<Name> keyName = Nan::New<String>("watermark").ToLocalChecked();
                Local<Value> wmValue = obj->Get(isolate->GetCurrentContext(), keyName).ToLocalChecked();
                if (!wmValue->IsNullOrUndefined()) {
                    Local<Object> objWm;
                    napi_get_value_object_(isolate, wmValue, objWm);

                    status = napi_get_object_property_nodestring_(isolate, objWm, "url", wmurl);
                    CHECK_NAPI_STATUS(pEngine, status);
                    wkImage.url = wmurl;

                    status = napi_get_object_property_int32_(isolate, objWm, "x", wkImage.x);
                    CHECK_NAPI_STATUS(pEngine, status);

                    status = napi_get_object_property_int32_(isolate, objWm, "y", wkImage.y);
                    CHECK_NAPI_STATUS(pEngine, status);

                    status = napi_get_object_property_int32_(isolate, objWm, "width", wkImage.width);
                    CHECK_NAPI_STATUS(pEngine, status);

                    status = napi_get_object_property_int32_(isolate, objWm, "height", wkImage.height);
                    CHECK_NAPI_STATUS(pEngine, status);
                    transcoding.watermark = &wkImage;
                }

                nodestring bgurl;
                Local<Name> keyNameBackground = Nan::New<String>("backgroundImage").ToLocalChecked();
                Local<Value> bgValue = obj->Get(isolate->GetCurrentContext(), keyNameBackground).ToLocalChecked();
                if (!bgValue->IsNullOrUndefined()) {
                    Local<Object> objBg;
                    napi_get_value_object_(isolate, bgValue, objBg);

                    status = napi_get_object_property_nodestring_(isolate, objBg, "url", bgurl);
                    CHECK_NAPI_STATUS(pEngine, status);
                    bgImage.url = bgurl;

                    status = napi_get_object_property_int32_(isolate, objBg, "x", bgImage.x);
                    CHECK_NAPI_STATUS(pEngine, status);

                    status = napi_get_object_property_int32_(isolate, objBg, "y", bgImage.y);
                    CHECK_NAPI_STATUS(pEngine, status);

                    status = napi_get_object_property_int32_(isolate, objBg, "width", bgImage.width);
                    CHECK_NAPI_STATUS(pEngine, status);

                    status = napi_get_object_property_int32_(isolate, objBg, "height", bgImage.height);
                    CHECK_NAPI_STATUS(pEngine, status);
                    transcoding.backgroundImage = &bgImage;
                }

                if (transcoding.userCount > 0) {
                    users = new TranscodingUser[transcoding.userCount];
                    Local<Name> keyName = Nan::New<String>("transcodingUsers").ToLocalChecked();
                    Local<Value> objUsers = obj->Get(isolate->GetCurrentContext(), keyName).ToLocalChecked();
                    if (objUsers->IsNullOrUndefined() || !objUsers->IsArray()) {
                        status = napi_invalid_arg;
                        CHECK_NAPI_STATUS(pEngine, status);
                    }
                    auto usersValue = v8::Array::Cast(*objUsers);
                    if (usersValue->Length() != transcoding.userCount) {
                        status = napi_invalid_arg;
                        CHECK_NAPI_STATUS(pEngine, status);
                    }
                    for (uint32 i = 0; i < transcoding.userCount; i++) {
                        Local<Value> value = usersValue->Get(context, i).ToLocalChecked();
                        Local<Object> userObj;
                        status = napi_get_value_object_(isolate, value, userObj);
                        if (userObj->IsNullOrUndefined()) {
                            status = napi_invalid_arg;
                            break;
                        }
                        napi_get_object_property_uid_(isolate, userObj, "uid", users[i].uid);
                        napi_get_object_property_int32_(isolate, userObj, "x", users[i].x);
                        napi_get_object_property_int32_(isolate, userObj, "y", users[i].y);
                        napi_get_object_property_int32_(isolate, userObj, "width", users[i].width);
                        napi_get_object_property_int32_(isolate, userObj, "height", users[i].height);
                        napi_get_object_property_int32_(isolate, userObj, "zOrder", users[i].zOrder);
                        napi_get_object_property_double_(isolate, userObj, "alpha", users[i].alpha);
                        napi_get_object_property_int32_(isolate, userObj, "audioChannel", users[i].audioChannel);
                    }
                    CHECK_NAPI_STATUS(pEngine, status);
                    transcoding.transcodingUsers = users;
                }
                result = pEngine->m_engine->setLiveTranscoding(transcoding);
            } while (false);
            if (users) {
                delete[] users;
            }
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, addInjectStreamUrl)
        {
            LOG_ENTER;
            int result = -1;
            napi_status status = napi_ok;
            do {
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                CHECK_ARG_NUM(pEngine, args, 2);

                nodestring url;
                InjectStreamConfig config;
                status = napi_get_value_nodestring_(args[0], url);
                CHECK_NAPI_STATUS(pEngine, status);

                Local<Object> configObj;
                status = napi_get_value_object_(isolate, args[1], configObj);
                CHECK_NAPI_STATUS(pEngine, status);

                int audioSampleRate;
                status = napi_get_object_property_int32_(isolate, configObj, "width", config.width);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, configObj, "height", config.height);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, configObj, "videoGop", config.videoGop);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, configObj, "videoFramerate", config.videoFramerate);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, configObj, "videoBitrate", config.videoBitrate);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, configObj, "audioSampleRate", audioSampleRate);
                CHECK_NAPI_STATUS(pEngine, status);
                config.audioSampleRate = (AUDIO_SAMPLE_RATE_TYPE)audioSampleRate;

                status = napi_get_object_property_int32_(isolate, configObj, "audioBitrate", config.audioBitrate);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, configObj, "audioChannels", config.audioChannels);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->addInjectStreamUrl(url, config);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE_WRAPPER_PARAM_1(removeInjectStreamUrl, nodestring);

        // NAPI_API_DEFINE(NodeRtcEngine, setBeautyEffectOptions)
        // {
        //     LOG_ENTER;
        //     napi_status status = napi_ok;
        //     int result = -1;
        //     do {
        //         Isolate *isolate = args.GetIsolate();
        //         NodeRtcEngine *pEngine = nullptr;
        //         napi_get_native_this(args, pEngine);
        //         CHECK_NATIVE_THIS(pEngine);
        //         bool enabled;
        //         status = napi_get_value_bool_(args[0], enabled);
        //         CHECK_NAPI_STATUS(pEngine, status);
        //         BeautyOptions opts;

        //         if(args[1]->IsObject()) {
        //             Local<Object> obj;
        //             status = napi_get_value_object_(isolate, args[1], obj);
        //             CHECK_NAPI_STATUS(pEngine, status);

        //             int contrast_value = 1;
        //             status = napi_get_object_property_int32_(isolate, obj, "lighteningContrastLevel", contrast_value);
        //             CHECK_NAPI_STATUS(pEngine, status);

        //             switch(contrast_value) {
        //                 case 0:
        //                     opts.lighteningContrastLevel = BeautyOptions::LIGHTENING_CONTRAST_LOW;
        //                     break;
        //                 case 1:
        //                     opts.lighteningContrastLevel = BeautyOptions::LIGHTENING_CONTRAST_NORMAL;
        //                     break;
        //                 case 2:
        //                     opts.lighteningContrastLevel = BeautyOptions::LIGHTENING_CONTRAST_HIGH;
        //                     break;
        //                 default:
        //                     status = napi_invalid_arg;
        //                     break;
        //             }
        //             CHECK_NAPI_STATUS(pEngine, status);

        //             double lightening, smoothness, redness;
        //             status = napi_get_object_property_double_(isolate, obj, "lighteningLevel", lightening);
        //             CHECK_NAPI_STATUS(pEngine, status);
        //             status = napi_get_object_property_double_(isolate, obj, "smoothnessLevel", smoothness);
        //             CHECK_NAPI_STATUS(pEngine, status);
        //             status = napi_get_object_property_double_(isolate, obj, "rednessLevel", redness);
        //             CHECK_NAPI_STATUS(pEngine, status);
        //             opts.lighteningLevel = lightening;
        //             opts.smoothnessLevel = smoothness;
        //             opts.rednessLevel = redness;

        //         }

        //         result = pEngine->m_engine->setBeautyEffectOptions(enabled, opts);
        //     } while (false);
        //     napi_set_int_result(args, result);
        //     LOG_LEAVE;
        // }

        NAPI_API_DEFINE(NodeRtcEngine, setLocalVoiceChanger)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                VOICE_CHANGER_PRESET preset = VOICE_CHANGER_OFF;
                int preset_value = 0;
                status = napi_get_value_int32_(args[0], preset_value);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->setLocalVoiceChanger(VOICE_CHANGER_PRESET(preset_value));
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setLocalVoiceReverbPreset)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                int preset_value = 0;
                status = napi_get_value_int32_(args[0], preset_value);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->setLocalVoiceReverbPreset(AUDIO_REVERB_PRESET(preset_value));
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        // NAPI_API_DEFINE(NodeRtcEngine, enableSoundPositionIndication)
        // {
        //     LOG_ENTER;
        //     napi_status status = napi_ok;
        //     int result = -1;
        //     do {
        //         NodeRtcEngine *pEngine = nullptr;
        //         napi_get_native_this(args, pEngine);
        //         CHECK_NATIVE_THIS(pEngine);
        //         bool enabled;
        //         status = napi_get_value_bool_(args[0], enabled);
        //         CHECK_NAPI_STATUS(pEngine, status);

        //         result = pEngine->m_engine->enableSoundPositionIndication(enabled);
        //     } while (false);
        //     napi_set_int_result(args, result);
        //     LOG_LEAVE;
        // }

        // NAPI_API_DEFINE(NodeRtcEngine, setRemoteVoicePosition)
        // {
        //     LOG_ENTER;
        //     napi_status status = napi_ok;
        //     int result = -1;
        //     do {
        //         NodeRtcEngine *pEngine = nullptr;
        //         napi_get_native_this(args, pEngine);
        //         CHECK_NATIVE_THIS(pEngine);

        //         uid_t uid;
        //         double pan = 0, gain = 0;

        //         status = NodeUid::getUidFromNodeValue(args[0], uid);
        //         CHECK_NAPI_STATUS(pEngine, status);

        //         status = napi_get_value_double_(args[1], pan);
        //         CHECK_NAPI_STATUS(pEngine, status);

        //         status = napi_get_value_double_(args[2], gain);
        //         CHECK_NAPI_STATUS(pEngine, status);

        //         result = pEngine->m_engine->setRemoteVoicePosition(uid, pan, gain);
        //     } while (false);
        //     napi_set_int_result(args, result);
        //     LOG_LEAVE;
        // }

        NAPI_API_DEFINE(NodeRtcEngine, startLastmileProbeTest)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                Isolate *isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                if(!args[0]->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pEngine, status);
                }

                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[0], obj);
                CHECK_NAPI_STATUS(pEngine, status);

                LastmileProbeConfig config;
                status = napi_get_object_property_bool_(isolate, obj, "probeUplink", config.probeUplink);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_bool_(isolate, obj, "probeDownlink", config.probeDownlink);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_uint32_(isolate, obj, "expectedUplinkBitrate", config.expectedUplinkBitrate);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_uint32_(isolate, obj, "expectedDownlinkBitrate", config.expectedDownlinkBitrate);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->startLastmileProbeTest(config);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, stopLastmileProbeTest)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                result = pEngine->m_engine->stopLastmileProbeTest();
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setRemoteUserPriority)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                uid_t uid;
                status = NodeUid::getUidFromNodeValue(args[0], uid);
                CHECK_NAPI_STATUS(pEngine, status);

                int priority = 100;
                PRIORITY_TYPE type;
                status = napi_get_value_int32_(args[1], priority);
                if(priority == 100) {
                    type = PRIORITY_NORMAL;
                } else if(priority == 50) {
                    type = PRIORITY_HIGH;
                } else {
                    status = napi_invalid_arg;
                }
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->setRemoteUserPriority(uid, type);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        // NAPI_API_DEFINE(NodeRtcEngine, startEchoTestWithInterval)
        // {
        //     LOG_ENTER;
        //     napi_status status = napi_ok;
        //     int result = -1;
        //     do {
        //         NodeRtcEngine *pEngine = nullptr;
        //         napi_get_native_this(args, pEngine);
        //         CHECK_NATIVE_THIS(pEngine);

        //         int interval;
        //         status = napi_get_value_int32_(args[0], interval);
        //         CHECK_NAPI_STATUS(pEngine, status);

        //         result = pEngine->m_engine->startEchoTest(interval);
        //     } while (false);
        //     napi_set_int_result(args, result);
        //     LOG_LEAVE;
        // }

        NAPI_API_DEFINE(NodeRtcEngine, startRecordingDeviceTest)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                int interval;
                status = napi_get_value_int32_(args[0], interval);
                CHECK_NAPI_STATUS(pEngine, status);

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                result = adm->startRecordingDeviceTest(interval);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, stopRecordingDeviceTest)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);


                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                result = adm->stopRecordingDeviceTest();
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        // NAPI_API_DEFINE(NodeRtcEngine, setCameraCapturerConfiguration)
        // {
        //     LOG_ENTER;
        //     napi_status status = napi_ok;
        //     int result = -1;
        //     do {
        //         Isolate *isolate = args.GetIsolate();
        //         NodeRtcEngine *pEngine = nullptr;
        //         napi_get_native_this(args, pEngine);
        //         CHECK_NATIVE_THIS(pEngine);
        //         RtcEngineParameters param(pEngine->m_engine);

        //         if(!args[0]->IsObject()) {
        //             status = napi_invalid_arg;
        //             CHECK_NAPI_STATUS(pEngine, status);
        //         }

        //         Local<Object> obj;
        //         status = napi_get_value_object_(isolate, args[0], obj);
        //         CHECK_NAPI_STATUS(pEngine, status);
        //         CameraCapturerConfiguration config;
        //         int preference = 0;

        //         status = napi_get_object_property_int32_(isolate, obj, "preference", preference);
        //         CHECK_NAPI_STATUS(pEngine, status);

        //         switch(preference) {
        //             case 0:
        //                 config.preference = CAPTURER_OUTPUT_PREFERENCE_AUTO;
        //                 break;
        //             case 1:
        //                 config.preference = CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE;
        //                 break;
        //             case 2:
        //                 config.preference = CAPTURER_OUTPUT_PREFERENCE_PREVIEW;
        //                 break;
        //             default:
        //                 status = napi_invalid_arg;
        //                 break;
        //         }
        //         CHECK_NAPI_STATUS(pEngine, status);

        //         result = param.setCameraCapturerConfiguration(config);
        //     } while (false);
        //     napi_set_int_result(args, result);
        //     LOG_LEAVE;
        // }

        NAPI_API_DEFINE(NodeRtcEngine, setLogFileSize)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                Isolate *isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                unsigned int size;
                status = napi_get_value_uint32_(args[0], size);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->setLogFileSize(size);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setBool)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring key;
                bool value;
                status = napi_get_value_nodestring_(args[0], key);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_bool_(args[1], value);
                CHECK_NAPI_STATUS(pEngine, status);
                agora::base::AParameter param(pEngine->m_engine);
                result = param->setBool(key, value);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setInt)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring key;
                int32_t value;
                status = napi_get_value_nodestring_(args[0], key);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_int32_(args[1], value);
                CHECK_NAPI_STATUS(pEngine, status);
                agora::base::AParameter param(pEngine->m_engine);
                result = param->setInt(key, value);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setUInt)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring key;
                uint32_t value;
                status = napi_get_value_nodestring_(args[0], key);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_uint32_(args[1], value);
                CHECK_NAPI_STATUS(pEngine, status);
                agora::base::AParameter param(pEngine->m_engine);
                result = param->setUInt(key, value);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setNumber)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring key;
                double value;
                status = napi_get_value_nodestring_(args[0], key);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_double_(args[1], value);
                CHECK_NAPI_STATUS(pEngine, status);
                agora::base::AParameter param(pEngine->m_engine);
                result = param->setNumber(key, value);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setString)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring key;
                nodestring value;
                status = napi_get_value_nodestring_(args[0], key);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_nodestring_(args[1], value);
                CHECK_NAPI_STATUS(pEngine, status);
                agora::base::AParameter param(pEngine->m_engine);
                result = param->setString(key, value);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setObject)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring key;
                nodestring value;
                status = napi_get_value_nodestring_(args[0], key);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_nodestring_(args[1], value);
                CHECK_NAPI_STATUS(pEngine, status);
                agora::base::AParameter param(pEngine->m_engine);
                result = param->setObject(key, value);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getBool)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring key;
                bool value;
                status = napi_get_value_nodestring_(args[0], key);
                CHECK_NAPI_STATUS(pEngine, status);
                agora::base::AParameter param(pEngine->m_engine);
                param->getBool(key, value);
                napi_set_bool_result(args, value);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getInt)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring key;
                int32 value;
                status = napi_get_value_nodestring_(args[0], key);
                CHECK_NAPI_STATUS(pEngine, status);
                agora::base::AParameter param(pEngine->m_engine);
                param->getInt(key, value);
                napi_set_int_result(args, value);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getUInt)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring key;
                uint32 value;
                status = napi_get_value_nodestring_(args[0], key);
                CHECK_NAPI_STATUS(pEngine, status);
                agora::base::AParameter param(pEngine->m_engine);
                param->getUInt(key, value);
                args.GetReturnValue().Set(v8::Uint32::New(args.GetIsolate(), value));
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getNumber)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring key;
                double value;
                status = napi_get_value_nodestring_(args[0], key);
                CHECK_NAPI_STATUS(pEngine, status);
                agora::base::AParameter param(pEngine->m_engine);
                param->getNumber(key, value);
                args.GetReturnValue().Set(v8::Number::New(args.GetIsolate(), value));
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getString)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring key;
                agora::util::AString value;
                status = napi_get_value_nodestring_(args[0], key);
                CHECK_NAPI_STATUS(pEngine, status);
                agora::base::AParameter param(pEngine->m_engine);
                param->getString(key, value);
                napi_set_string_result(args, value->c_str());
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getObject)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring key;
                agora::util::AString value;
                status = napi_get_value_nodestring_(args[0], key);
                CHECK_NAPI_STATUS(pEngine, status);
                agora::base::AParameter param(pEngine->m_engine);
                param->getObject(key, value);
                napi_set_string_result(args, value->c_str());
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getArray)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring key;
                agora::util::AString value;
                status = napi_get_value_nodestring_(args[0], key);
                CHECK_NAPI_STATUS(pEngine, status);
                agora::base::AParameter param(pEngine->m_engine);
                // param->getArray(key, value);
                napi_set_string_result(args, value->c_str());
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setParameters)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring param;
                status = napi_get_value_nodestring_(args[0], param);
                CHECK_NAPI_STATUS(pEngine, status);
                agora::base::AParameter ap(pEngine->m_engine);
                result = ap->setParameters(param);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        // NAPI_API_DEFINE(NodeRtcEngine, setProfile)
        // {
        //     LOG_ENTER;
        //     napi_status status = napi_ok;
        //     int result = -1;
        //     do {
        //         NodeRtcEngine *pEngine = nullptr;
        //         napi_get_native_this(args, pEngine);
        //         CHECK_NATIVE_THIS(pEngine);
        //         nodestring profile;
        //         bool merge;
        //         status = napi_get_value_nodestring_(args[0], profile);
        //         CHECK_NAPI_STATUS(pEngine, status);
        //         status = napi_get_value_bool_(args[1], merge);
        //         CHECK_NAPI_STATUS(pEngine, status);
        //         agora::base::AParameter param(pEngine->m_engine);
        //         result = param->setProfile(profile, merge);
        //     } while (false);
        //     napi_set_int_result(args, result);
        //     LOG_LEAVE;
        // }

        NAPI_API_DEFINE(NodeRtcEngine, convertPath)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring path;
                agora::util::AString value;
                status = napi_get_value_nodestring_(args[0], path);
                CHECK_NAPI_STATUS(pEngine, status);
                agora::base::AParameter param(pEngine->m_engine);
                param->convertPath(path, value);
                napi_set_string_result(args, value->c_str());
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setExternalAudioSource)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int sampleRate, channels;
                bool enabled;
                status = napi_get_value_bool_(args[0], enabled);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_int32_(args[1], sampleRate);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_int32_(args[2], channels);
                CHECK_NAPI_STATUS(pEngine, status);
                result = pEngine->m_engine->setExternalAudioSource(enabled, sampleRate, channels);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setLocalVideoMirrorMode)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int32 mirrorType;
                status = napi_get_value_int32_(args[0], mirrorType);
                CHECK_NAPI_STATUS(pEngine, status);
                result = pEngine->m_engine->setLocalVideoMirrorMode((agora::rtc::VIDEO_MIRROR_MODE_TYPE)mirrorType);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, enableLoopbackRecording)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                bool enable;
                NodeString deviceName;
                status = napi_get_value_bool_(args[0], enable);
                CHECK_NAPI_STATUS(pEngine, status);
                result = pEngine->m_engine->enableLoopbackRecording(enable);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, enableLoopbackRecording2)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                bool enable;
                unsigned int connectionId;
                NodeString deviceName;
                status = napi_get_value_uint32_(args[0], connectionId);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_value_bool_(args[1], enable);
                CHECK_NAPI_STATUS(pEngine, status);
                result = pEngine->m_engine->enableLoopbackRecording(connectionId, enable);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setLocalVoiceEqualization)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int32 bandFrequency, bandGain;
                status = napi_get_value_int32_(args[0], bandFrequency);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_int32_(args[1], bandGain);
                CHECK_NAPI_STATUS(pEngine, status);
                result = pEngine->m_engine->setLocalVoiceEqualization((AUDIO_EQUALIZATION_BAND_FREQUENCY)bandFrequency, bandGain);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setLocalVoiceReverb)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int32 reverbKey, value;
                status = napi_get_value_int32_(args[0], reverbKey);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_int32_(args[1], value);
                CHECK_NAPI_STATUS(pEngine, status);
                result = pEngine->m_engine->setLocalVoiceReverb((AUDIO_REVERB_TYPE)reverbKey, value);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        // NAPI_API_DEFINE(NodeRtcEngine, setLocalPublishFallbackOption)
        // {
        //     LOG_ENTER;
        //     napi_status status = napi_ok;
        //     int result = -1;
        //     do {
        //         NodeRtcEngine *pEngine = nullptr;
        //         napi_get_native_this(args, pEngine);
        //         CHECK_NATIVE_THIS(pEngine);
        //         int32 option;
        //         status = napi_get_value_int32_(args[0], option);
        //         CHECK_NAPI_STATUS(pEngine, status);
        //         result = param.setLocalPublishFallbackOption((STREAM_FALLBACK_OPTIONS)option);
        //     } while (false);
        //     napi_set_int_result(args, result);
        //     LOG_LEAVE;
        // }

        // NAPI_API_DEFINE(NodeRtcEngine, setRemoteSubscribeFallbackOption)
        // {
        //     LOG_ENTER;
        //     napi_status status = napi_ok;
        //     int result = -1;
        //     do {
        //         NodeRtcEngine *pEngine = nullptr;
        //         napi_get_native_this(args, pEngine);
        //         CHECK_NATIVE_THIS(pEngine);
        //         RtcEngineParameters param(pEngine->m_engine);
        //         int32 option;
        //         status = napi_get_value_int32_(args[0], option);
        //         CHECK_NAPI_STATUS(pEngine, status);
        //         result = param.setRemoteSubscribeFallbackOption((STREAM_FALLBACK_OPTIONS)option);
        //     } while (false);
        //     napi_set_int_result(args, result);
        //     LOG_LEAVE;
        // }

        NAPI_API_DEFINE(NodeRtcEngine, leaveChannel)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                result = pEngine->m_engine->leaveChannel();
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, enableLocalAudio)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                bool enable;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status = napi_get_value_bool_(args[0], enable);
                CHECK_NAPI_STATUS(pEngine, status);
                result = pEngine->m_engine->enableLocalAudio(enable);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, renewToken)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                NodeString newkey;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status = napi_get_value_nodestring_(args[0], newkey);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->renewToken(newkey);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, registerDeliverFrame)
        {
            LOG_ENTER;
            int result = false;
            do {
                Isolate *isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                NodeVideoFrameTransporter* pTransporter = getNodeVideoFrameTransporter();
                if(pTransporter) {
                    result = pTransporter->initialize(isolate, args);
                }
            } while (false);
            napi_set_bool_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, initialize)
        {
            LOG_ENTER;
            int result = -1;
            std::string key;
            Extension* extensions = nullptr;
            nodestring* idList = nullptr;
            nodestring* pathList = nullptr;
            nodestring* configList = nullptr;
            do {
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                NodeString appid;
                napi_status status = napi_get_value_nodestring_(args[0], appid);
                key = "appId";
                CHECK_NAPI_STATUS_STR(pEngine, status, key);
;
                Local<Value> extensionsList = args[1];
                if (extensionsList->IsNullOrUndefined() || !extensionsList->IsArray()) {
                    status = napi_invalid_arg;
                    key = "Extensions";
                    CHECK_NAPI_STATUS_STR(pEngine, status, key);
                }
                auto extensionsListValue = v8::Array::Cast(*extensionsList);

                int extensionCount = extensionsListValue->Length();
                if (extensionCount > 0) {
                    extensions = new Extension[extensionCount];
                    idList = new nodestring[extensionCount];
                    pathList = new nodestring[extensionCount];
                    configList = new nodestring[extensionCount];
                    for (int i = 0; i < extensionCount; i++ ) {
                        Local<Value> value = extensionsListValue->Get(isolate->GetCurrentContext(), i).ToLocalChecked();
                        Local<Object> extensionObj;
                        status = napi_get_value_object_(isolate, value, extensionObj);
                        if (extensionObj->IsNullOrUndefined()) {
                            status = napi_invalid_arg;
                            break;
                        }
                        napi_get_object_property_nodestring_(isolate, extensionObj, "id", idList[i]);
                        napi_get_object_property_nodestring_(isolate, extensionObj, "path", pathList[i]);
                        napi_get_object_property_nodestring_(isolate, extensionObj, "config", configList[i]);
                        extensions[i].id = idList[i];
                        extensions[i].path = pathList[i];
                        extensions[i].config = configList[i];
                    }
                    key = "extension item";
                    CHECK_NAPI_STATUS_STR(pEngine, status, key);
                }

                unsigned int areaCode;
                status = napi_get_value_uint32_(args[2], areaCode);
                key = "areaCode";
                CHECK_NAPI_STATUS_STR(pEngine, status, key);

                RtcEngineContextEx context;
                context.eventHandlerEx = pEngine->m_eventHandler.get();
                context.appId = appid;
                context.areaCode = areaCode;
                if (extensionCount > 0) {
                    context.extensions = extensions;
                    context.numExtension = extensionCount;
                }
                auto engineEx = (IRtcEngineEx*) pEngine->m_engine;
                int suc = engineEx->initialize(context);
                if (0 != suc) {
                    LOG_ERROR("Rtc engine initialize failed with error :%d\n", suc);
                    status = napi_invalid_arg;
                    key = "initialize";
                    CHECK_NAPI_STATUS_STR(pEngine, status, key);
                    break;
                }

                agora::media::IMediaEngine* pMediaEngine = nullptr;
                pEngine->getRtcEngine()->queryInterface(agora::rtc::INTERFACE_ID_TYPE::AGORA_IID_MEDIA_ENGINE, (void**)&pMediaEngine);
                if (pMediaEngine && pEngine->m_nodeVideoFrameObserver.get())
                {
                    pMediaEngine->registerVideoFrameObserver(pEngine->m_nodeVideoFrameObserver.get());
                    result = 0;
                }

                pEngine->m_engine->enableVideo();
                pEngine->m_engine->enableLocalVideo(true);
                result = 0;
            } while (false);
            delete [] extensions;
            delete [] idList;
            delete [] pathList;
            delete [] configList;
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getVersion)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int build = 0;
                const char* strVersion = pEngine->m_engine->getVersion(&build);
                Local<Object> obj = Object::New(args.GetIsolate());
                CHECK_NAPI_OBJECT(obj);
                Local<Value> key = String::NewFromUtf8(args.GetIsolate(), "version", NewStringType::kInternalized).ToLocalChecked();
                CHECK_NAPI_OBJECT(key);
                Local<Value> value = String::NewFromUtf8(args.GetIsolate(), strVersion, NewStringType::kInternalized).ToLocalChecked();
                CHECK_NAPI_OBJECT(value);
                obj->Set(args.GetIsolate()->GetCurrentContext(), key, value);
                Local<Value> buildKey = String::NewFromUtf8(args.GetIsolate(), "build", NewStringType::kInternalized).ToLocalChecked();
                CHECK_NAPI_OBJECT(buildKey);
                Local<Value> buildValue = Integer::New(args.GetIsolate(), build);
                CHECK_NAPI_OBJECT(buildValue);
                obj->Set(args.GetIsolate()->GetCurrentContext(), buildKey, buildValue);
                args.GetReturnValue().Set(obj);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setEncryptionMode)
        {
            LOG_ENTER;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring mode;
                napi_status status = napi_get_value_nodestring_(args[0], mode);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->setEncryptionMode(mode);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getErrorDescription)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int errorCode;
                napi_status status = napi_get_value_int32_(args[0], errorCode);
                CHECK_NAPI_STATUS(pEngine, status);
                const char* desc = pEngine->m_engine->getErrorDescription(errorCode);
                Local<Value> descValue = String::NewFromUtf8(args.GetIsolate(), desc, NewStringType::kInternalized).ToLocalChecked();
                CHECK_NAPI_OBJECT(descValue);
                args.GetReturnValue().Set(descValue);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, joinChannel)
        {
            LOG_ENTER;
            int result = -1;
            NodeString key, name, chan_info;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                uid_t uid;
                napi_status status = napi_get_value_nodestring_(args[0], key);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_value_nodestring_(args[1], name);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_value_nodestring_(args[2], chan_info);
                CHECK_NAPI_STATUS(pEngine, status);

                status = NodeUid::getUidFromNodeValue(args[3], uid);
                CHECK_NAPI_STATUS(pEngine, status);

                std::string extra_info = "";

                if (chan_info && strlen(chan_info) > 0){
                    extra_info = "Electron_";
                    extra_info += chan_info;
                }
                else{
                    extra_info = "Electron";
                }

                result = pEngine->m_engine->joinChannel(key, name, extra_info.c_str(), uid);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        // NAPI_API_DEFINE(NodeRtcEngine, switchChannel)
        // {
        //     LOG_ENTER;
        //     int result = -1;
        //     NodeString key, name;
        //     do {
        //         NodeRtcEngine *pEngine = nullptr;
        //         napi_get_native_this(args, pEngine);
        //         CHECK_NATIVE_THIS(pEngine);
        //         napi_status status = napi_get_value_nodestring_(args[0], key);
        //         CHECK_NAPI_STATUS(pEngine, status);

        //         status = napi_get_value_nodestring_(args[1], name);
        //         CHECK_NAPI_STATUS(pEngine, status);

        //         result = pEngine->m_engine->switchChannel(key, name);
        //     } while (false);
        //     napi_set_int_result(args, result);
        //     LOG_LEAVE;
        // }

        NAPI_API_DEFINE(NodeRtcEngine, setChannelProfile)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status = napi_ok;
                unsigned int profile = 0;
                status = napi_get_value_uint32_(args[0], profile);
                CHECK_NAPI_STATUS(pEngine, status);
                result = pEngine->m_engine->setChannelProfile(CHANNEL_PROFILE_TYPE(profile));
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setClientRole)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status = napi_ok;
                unsigned int role;
                status = napi_get_value_uint32_(args[0], role);
                CHECK_NAPI_STATUS(pEngine, status);
                result = pEngine->m_engine->setClientRole(CLIENT_ROLE_TYPE(role));
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        // NAPI_API_DEFINE(NodeRtcEngine, setVideoProfile)
        // {
        //     LOG_ENTER;
        //     int result = -1;
        //     do {
        //         NodeRtcEngine *pEngine = nullptr;
        //         napi_get_native_this(args, pEngine);
        //         CHECK_NATIVE_THIS(pEngine);
        //         napi_status status = napi_ok;
        //         unsigned int profile;
        //         bool swapWandH;
        //         napi_get_param_2(args, uint32, profile, bool, swapWandH);
        //         CHECK_NAPI_STATUS(pEngine, status);
        //         result = pEngine->m_engine->setVideoProfile(VIDEO_PROFILE_TYPE(profile), swapWandH);
        //     } while (false);
        //     napi_set_int_result(args, result);
        //     LOG_LEAVE;
        // }

        NAPI_API_DEFINE(NodeRtcEngine, setVideoEncoderConfiguration)
        {
            LOG_ENTER;
            int result = -1;
            do {
                napi_status status = napi_ok;
                Isolate *isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                if(!args[0]->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pEngine, status);
                }
                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[0], obj);
                CHECK_NAPI_STATUS(pEngine, status);
                VideoDimensions dimensions;
                VideoEncoderConfiguration config;

                status = napi_get_object_property_int32_(isolate, obj, "width", dimensions.width);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "height", dimensions.height);
                CHECK_NAPI_STATUS(pEngine, status);
                config.dimensions = dimensions;
                status = napi_get_object_property_int32_(isolate, obj, "bitrate", config.bitrate);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "minBitrate", config.minBitrate);
                CHECK_NAPI_STATUS(pEngine, status);
                // status = napi_get_object_property_int32_(isolate, obj, "minFrameRate", config.minFrameRate);
                // CHECK_NAPI_STATUS(pEngine, status);

                int frameRateVal;
                FRAME_RATE frameRate;
                status = napi_get_object_property_int32_(isolate, obj, "frameRate", frameRateVal);
                CHECK_NAPI_STATUS(pEngine, status);



                config.frameRate = (FRAME_RATE)frameRateVal;

                int orientationModeVal;
                ORIENTATION_MODE orientationMode;
                status = napi_get_object_property_int32_(isolate, obj, "orientationMode", orientationModeVal);
                CHECK_NAPI_STATUS(pEngine, status);

                switch(orientationModeVal) {
                    case 0:
                        orientationMode = ORIENTATION_MODE_ADAPTIVE;
                        break;
                    case 1:
                        orientationMode = ORIENTATION_MODE_FIXED_LANDSCAPE;
                        break;
                    case 2:
                        orientationMode = ORIENTATION_MODE_FIXED_PORTRAIT;
                        break;
                    default:
                        status = napi_invalid_arg;
                        break;
                }
                CHECK_NAPI_STATUS(pEngine, status);
                config.orientationMode = orientationMode;


                int degradationPrefValue;
                DEGRADATION_PREFERENCE degradationPref;
                status = napi_get_object_property_int32_(isolate, obj, "degradationPreference", degradationPrefValue);
                CHECK_NAPI_STATUS(pEngine, status);

                switch(degradationPrefValue) {
                    case 0:
                        degradationPref = MAINTAIN_QUALITY;
                        break;
                    case 1:
                        degradationPref = MAINTAIN_FRAMERATE;
                        break;
                    case 2:
                        degradationPref = MAINTAIN_BALANCED;
                        break;
                    default:
                        status = napi_invalid_arg;
                        break;
                }
                CHECK_NAPI_STATUS(pEngine, status);
                config.degradationPreference = degradationPref;

                int mirrorMode;
                status = napi_get_object_property_int32_(isolate, obj, "mirrorMode", mirrorMode);
                config.mirrorMode = VIDEO_MIRROR_MODE_TYPE(mirrorMode);

                result = pEngine->m_engine->setVideoEncoderConfiguration(config);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setAudioProfile)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status = napi_ok;
                unsigned int profile, scenario;
                napi_get_param_2(args, uint32, profile, uint32, scenario);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->setAudioProfile(AUDIO_PROFILE_TYPE(profile));
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getCallId)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                util::AString callId;
                if (-ERR_FAILED != pEngine->m_engine->getCallId(callId)) {
                    napi_set_string_result(args, callId->c_str());
                }
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, rate)
        {
            LOG_ENTER;
            NodeString callId, desc;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status = napi_ok;
                int rating;
                napi_get_value_nodestring_(args[0], callId);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_int32_(args[1], rating);
                CHECK_NAPI_STATUS(pEngine, status);
                napi_get_value_nodestring_(args[2], desc);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->rate(callId, rating, desc);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, complain)
        {
            LOG_ENTER;
            NodeString callId, desc;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status = napi_ok;

                napi_get_value_nodestring_(args[0], callId);
                CHECK_NAPI_STATUS(pEngine, status);
                napi_get_value_nodestring_(args[1], desc);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->complain(callId, desc);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setEncryptionSecret)
        {
            LOG_ENTER;
            NodeString secret;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                napi_status status = napi_ok;
                CHECK_NATIVE_THIS(pEngine);
                napi_get_value_nodestring_(args[0], secret);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->setEncryptionSecret(secret);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, createDataStream)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status = napi_ok;
                int streamId;
                bool reliable, ordered;
                napi_get_param_2(args, bool, reliable, bool, ordered);
                CHECK_NAPI_STATUS(pEngine, status);

                int result = pEngine->m_engine->createDataStream(&streamId, reliable, ordered);
                if(result < 0) {
                    napi_set_int_result(args, result);
                } else {
                    napi_set_int_result(args, streamId);
                }
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, sendStreamMessage)
        {
            LOG_ENTER;
            NodeString msg;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status = napi_ok;
                int streamId;
                status = napi_get_value_int32_(args[0], streamId);
                CHECK_NAPI_STATUS(pEngine, status);
                napi_get_value_nodestring_(args[1], msg);
                CHECK_NAPI_STATUS(pEngine, status);
                result = pEngine->m_engine->sendStreamMessage(streamId, msg, strlen(msg));
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, muteRemoteAudioStream)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                uid_t uid;
                bool mute;
                unsigned int connectionId;
                status = NodeUid::getUidFromNodeValue(args[0], uid);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_bool_(args[1], mute);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_uint32_(args[2], connectionId);
                result = pEngine->m_engine->muteRemoteAudioStream(uid, mute, connectionId);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, subscribe)
        {
            LOG_ENTER;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                int renderType;
                status = napi_get_value_int32_(args[0], renderType);
                CHECK_NAPI_STATUS(pEngine, status);
                if(renderType < NODE_RENDER_TYPE_LOCAL || renderType > NODE_RENDER_TYPE_TRANSCODED) {
                    LOG_ERROR("Invalid render type : %d\n", renderType);
                    pEngine->m_eventHandler->fireApiError(__FUNCTION__);
                    break;
                }
                uid_t uid;
                status = napi_get_value_uid_t_(args[1], uid);
                CHECK_NAPI_STATUS(pEngine, status);
                unsigned int connectionId;
                status = napi_get_value_uint32_(args[2], connectionId);
                CHECK_NAPI_STATUS(pEngine, status);
                int deviceId;
                status = napi_get_value_int32_(args[3], deviceId);
                CHECK_NAPI_STATUS(pEngine, status);

                auto *pTransporter = getNodeVideoFrameTransporter();
                if (pTransporter) {
                    pTransporter->subscribe((NodeRenderType) renderType, uid, connectionId, deviceId);
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, unsubscribe)
        {
            LOG_ENTER;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                int renderType;
                status = napi_get_value_int32_(args[0], renderType);
                CHECK_NAPI_STATUS(pEngine, status);
                if(renderType < NODE_RENDER_TYPE_LOCAL || renderType > NODE_RENDER_TYPE_TRANSCODED) {
                    LOG_ERROR("Invalid render type : %d\n", renderType);
                    pEngine->m_eventHandler->fireApiError(__FUNCTION__);
                    break;
                }
                uid_t uid;
                status = napi_get_value_uid_t_(args[1], uid);
                CHECK_NAPI_STATUS(pEngine, status);
                unsigned int connectionId;
                status = napi_get_value_uint32_(args[2], connectionId);
                CHECK_NAPI_STATUS(pEngine, status);
                int deviceId;
                status = napi_get_value_int32_(args[3], deviceId);
                CHECK_NAPI_STATUS(pEngine, status);

                auto *pTransporter = getNodeVideoFrameTransporter();
                if (pTransporter) {
                    pTransporter->unsubscribe((NodeRenderType) renderType, uid, connectionId, deviceId);
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setupLocalVideo)
        {
            LOG_ENTER;
            int result = -1;
            do {
                // NodeRtcEngine *pEngine = nullptr;
                // napi_get_native_this(args, pEngine);
                // CHECK_NATIVE_THIS(pEngine);
                // auto context = new NodeRenderContext(NODE_RENDER_TYPE_LOCAL);
                // VideoCanvas canvas;
                // canvas.uid = 0;
                // canvas.renderMode = agora::media::base::RENDER_MODE_HIDDEN;
                // canvas.view = (view_t)context;
                // pEngine->m_engine->setupLocalVideo(canvas);
                result = 0;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setVideoRenderDimension)
        {
            LOG_ENTER;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                NodeRenderType type;
                int renderType, width, height;
                nodestring channelId;
                agora::rtc::uid_t uid;
                napi_status status = napi_ok;
                status = napi_get_value_int32_(args[0], renderType);
                CHECK_NAPI_STATUS(pEngine, status);
                if(renderType < NODE_RENDER_TYPE_LOCAL || renderType > NODE_RENDER_TYPE_TRANSCODED) {
                    LOG_ERROR("Invalid render type : %d\n", renderType);
                    break;
                }
                type = (NodeRenderType)renderType;
                status = NodeUid::getUidFromNodeValue(args[1], uid);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_int32_(args[2], width);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_int32_(args[3], height);
                CHECK_NAPI_STATUS(pEngine, status);
                // agora::rtc:: conn_id_t connectionId;
                // status = napi_get_value_uint32_(args[4], connectionId);
                // CHECK_NAPI_STATUS(pEngine, status);
                // int deviceId;
                // status = napi_get_value_int32_(args[5], deviceId);
                // CHECK_NAPI_STATUS(pEngine, status);

                auto *pTransporter = getNodeVideoFrameTransporter();
                if (pTransporter) {
                    pTransporter->setVideoDimension(type, uid, 0, 0, width, height);
                    result = 0;
                }
            }while(false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setHighFPS)
        {
            LOG_ENTER;
            int result = -1;
            napi_status status = napi_invalid_arg;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                uint32_t fps;
                status = napi_get_value_uint32_(args[0], fps);
                CHECK_NAPI_STATUS(pEngine, status);
                if(fps == 0) {
                    status = napi_invalid_arg;
                    break;
                }
                auto pTransporter = getNodeVideoFrameTransporter();
                if(pTransporter) {
                    pTransporter->setHighFPS(fps);
                    result = 0;
                }
            }while(false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setFPS)
        {
            LOG_ENTER;
            int result = -1;
            napi_status status = napi_invalid_arg;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                uint32_t fps;
                status = napi_get_value_uint32_(args[0], fps);
                CHECK_NAPI_STATUS(pEngine, status);
                if(fps == 0) {
                    status = napi_invalid_arg;
                    break;
                }
                auto pTransporter = getNodeVideoFrameTransporter();
                if(pTransporter) {
                    pTransporter->setFPS(fps);
                    result = 0;
                }
            } while(false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, addToHighVideo)
        {
            LOG_ENTER;
            int result = -1;
            napi_status status = napi_invalid_arg;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                agora::rtc::uid_t uid;
                status = NodeUid::getUidFromNodeValue(args[0], uid);
                CHECK_NAPI_STATUS(pEngine, status);
                // agora::rtc:: conn_id_t connectionId;
                // status = napi_get_value_uint32_(args[1], connectionId);
                // CHECK_NAPI_STATUS(pEngine, status);
                auto pTransporter = getNodeVideoFrameTransporter();
                if(pTransporter) {
                    pTransporter->addToHighVideo(uid, 0);
                    result = 0;
                }
            }while(false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, removeFromHighVideo)
        {
            LOG_ENTER;
            int result = -1;
            napi_status status = napi_invalid_arg;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                agora::rtc::uid_t uid;
                status = NodeUid::getUidFromNodeValue(args[0], uid);
                CHECK_NAPI_STATUS(pEngine, status);
                // agora::rtc:: conn_id_t connectionId;
                // status = napi_get_value_uint32_(args[1], connectionId);
                // CHECK_NAPI_STATUS(pEngine, status);

                auto pTransporter = getNodeVideoFrameTransporter();
                if(pTransporter) {
                    pTransporter->removeFromeHighVideo(uid, 0);
                    result = 0;
                }
            }while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getConnectionState)
        {
            LOG_ENTER;
            int result = -1;
            napi_status status = napi_invalid_arg;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                CONNECTION_STATE_TYPE type = pEngine->m_engine->getConnectionState();
                result = type;
            }while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, release)
        {
            LOG_ENTER;
            int result = -1;
            napi_status status = napi_invalid_arg;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                if (pEngine->m_audioVdm) {
                    pEngine->m_audioVdm->release();
                    //delete[] m_audioVdm;
                    pEngine->m_audioVdm = nullptr;
                }
                if (pEngine->m_videoVdm) {
                    pEngine->m_videoVdm->release();
                    //delete[] m_videoVdm;
                    pEngine->m_videoVdm = nullptr;
                }
				if (pEngine->m_engine) {
					agora::media::IMediaEngine* pMediaEngine = nullptr;
					pEngine->getRtcEngine()->queryInterface(agora::rtc::INTERFACE_ID_TYPE::AGORA_IID_MEDIA_ENGINE, (void**)&pMediaEngine);
					if (pMediaEngine && pEngine->m_nodeVideoFrameObserver.get())
					{
						pMediaEngine->registerVideoFrameObserver(nullptr);
					}
				}
                if (pEngine->m_engine) {
                    pEngine->m_engine->release(false);
                    pEngine->m_engine = nullptr;
                }
				pEngine->m_nodeVideoFrameObserver.reset();
                result = 0;
            }while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, muteRemoteVideoStream)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                uid_t uid;
                bool mute;
                unsigned int connectionId;
                status = NodeUid::getUidFromNodeValue(args[0], uid);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_bool_(args[1], mute);
                CHECK_NAPI_STATUS(pEngine, status);
                napi_get_value_uint32_(args[2], connectionId);
                CHECK_NAPI_STATUS(pEngine, status)
                result = pEngine->m_engine->muteRemoteVideoStream(uid, mute, connectionId);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setRemoteVideoStreamType)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                uid_t uid;
                int streamType;
                status = NodeUid::getUidFromNodeValue(args[0], uid);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_int32_(args[1], streamType);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->setRemoteVideoStreamType(uid, VIDEO_STREAM_TYPE(streamType));
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setRemoteDefaultVideoStreamType)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine;
                napi_status status = napi_ok;
                int streamType;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_get_param_1(args, int32, streamType);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->setRemoteDefaultVideoStreamType(VIDEO_STREAM_TYPE(streamType));
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE_WRAPPER_PARAM_2(enableAudioVolumeIndication, int32, int32);

        NAPI_API_DEFINE(NodeRtcEngine, startAudioRecording)
        {
            LOG_ENTER;
            int result = -1;
            NodeString filePath;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                nodestring filePath;
                int quality;

                napi_get_param_2(args, nodestring, filePath, int32, quality);

                result = pEngine->m_engine->startAudioRecording(filePath, AUDIO_RECORDING_QUALITY_TYPE(quality));
            } while (false);
            napi_set_int_result(args, result);

            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, startAudioMixing)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                NodeString filepath;
                bool loopback, replace;
                int cycle;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_get_param_4(args, nodestring, filepath, bool, loopback, bool, replace, int32, cycle);
                CHECK_NAPI_STATUS(pEngine, status);
                result = pEngine->m_engine->startAudioMixing(filepath, loopback, replace, cycle);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getAudioMixingDuration)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                int duration = pEngine->m_engine->getAudioMixingDuration();
                napi_set_int_result(args, duration);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getAudioMixingCurrentPosition)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                int position = pEngine->m_engine->getAudioMixingCurrentPosition();
                napi_set_int_result(args, position);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getAudioMixingPlayoutVolume)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                int volume = pEngine->m_engine->getAudioMixingPlayoutVolume();
                napi_set_int_result(args, volume);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getAudioMixingPublishVolume)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                int volume = pEngine->m_engine->getAudioMixingPublishVolume();
                napi_set_int_result(args, volume);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setRecordingAudioFrameParameters)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int sampleRate, channel, mode, samplesPerCall;
                napi_get_param_4(args, int32, sampleRate, int32, channel, int32, mode, int32, samplesPerCall);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->setRecordingAudioFrameParameters(sampleRate, channel, RAW_AUDIO_FRAME_OP_MODE_TYPE(mode), samplesPerCall);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setPlaybackAudioFrameParameters)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                int sampleRate, channel, mode, samplesPerCall;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_get_param_4(args, int32, sampleRate, int32, channel, int32, mode, int32, samplesPerCall);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->setPlaybackAudioFrameParameters(sampleRate, channel, RAW_AUDIO_FRAME_OP_MODE_TYPE(mode), samplesPerCall);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setMixedAudioFrameParameters)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                int sampleRate, samplesPerCall, channel;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_get_param_3(args, int32, sampleRate, int32, channel, int32, samplesPerCall);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->setMixedAudioFrameParameters(sampleRate, channel, samplesPerCall);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        // NAPI_API_DEFINE(NodeRtcEngine, setHighQualityAudioParameters)
        // {
        //     LOG_ENTER;
        //     int result = -1;
        //     do {
        //         NodeRtcEngine *pEngine = nullptr;
        //         napi_status status = napi_ok;
        //         bool fullband, stereo, fullBitrate;
        //         napi_get_native_this(args, pEngine);
        //         CHECK_NATIVE_THIS(pEngine);
        //         napi_get_param_3(args, bool, fullband, bool, stereo, bool, fullBitrate);
        //         CHECK_NAPI_STATUS(pEngine, status);

        //         RtcEngineParameters rep(pEngine->m_engine);
        //         result = rep.setHighQualityAudioParameters(fullband, stereo, fullBitrate);
        //     } while (false);
        //     napi_set_int_result(args, result);
        //     LOG_LEAVE;
        // }
#if defined(__APPLE__) || defined(_WIN32)
//         NAPI_API_DEFINE(NodeRtcEngine, startScreenCapture)
//         {
//             LOG_ENTER;
//             int result = -1;
//             do {
//                 NodeRtcEngine *pEngine = nullptr;
//                 Isolate* isolate = args.GetIsolate();
//                 Local<Context> context = isolate->GetCurrentContext();
//                 napi_status status = napi_ok;
//                 napi_get_native_this(args, pEngine);
//                 CHECK_NATIVE_THIS(pEngine);

//                 int captureFreq, bitrate;
//                 int top, left, bottom, right;

// #if defined(__APPLE__)
//                 unsigned int windowId;
//                 status = napi_get_value_uint32_(args[0], windowId);
//                 CHECK_NAPI_STATUS(pEngine, status);
// #elif defined(_WIN32)
// #if defined(_WIN64)
//                 int64_t wid;
//                 status = napi_get_value_int64_(args[0], wid);
// #else
//                 int32_t wid;
//                 status = napi_get_value_int32_(args[0], wid);
// #endif

//                 CHECK_NAPI_STATUS(pEngine, status);
//                 HWND windowId = (HWND)wid;
// #endif
//                 status = napi_get_value_int32_(args[1], captureFreq);
//                 CHECK_NAPI_STATUS(pEngine, status);

//                 Local<Object> rect;
//                 status = napi_get_value_object_(isolate, args[2], rect);
//                 CHECK_NAPI_STATUS(pEngine, status);

//                 status = napi_get_object_property_int32_(isolate, rect, "top", top);
//                 CHECK_NAPI_STATUS(pEngine, status);
//                 status = napi_get_object_property_int32_(isolate, rect, "left", left);
//                 CHECK_NAPI_STATUS(pEngine, status);
//                 status = napi_get_object_property_int32_(isolate, rect, "bottom", bottom);
//                 CHECK_NAPI_STATUS(pEngine, status);
//                 status = napi_get_object_property_int32_(isolate, rect, "right", right);
//                 CHECK_NAPI_STATUS(pEngine, status);

//                 status = napi_get_value_int32_(args[3], bitrate);
//                 CHECK_NAPI_STATUS(pEngine, status);

//                 Rect region(top, left, bottom, right);
//                 result = pEngine->m_engine->startScreenCapture(windowId, captureFreq, &region, bitrate);
//             } while (false);
//             napi_set_int_result(args, result);
//             LOG_LEAVE;
//         }

        NAPI_API_DEFINE(NodeRtcEngine, stopScreenCapture)
        {
            LOG_ENTER;
            int result = -1;
            do
            {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                result = pEngine->m_engine->stopScreenCapture();
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, updateScreenCaptureRegion)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                int x, y, width, height;
                Local<Object> rect;
                napi_status status = napi_get_value_object_(isolate, args[0], rect);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, rect, "x", x);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, rect, "y", y);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, rect, "width", width);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, rect, "height", height);
                CHECK_NAPI_STATUS(pEngine, status);

                Rectangle rectangle(x, y, width, height);

                result = pEngine->m_engine->updateScreenCaptureRegion(rectangle);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }
#endif

        NAPI_API_DEFINE(NodeRtcEngine, onEvent)
        {
            //LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                NodeString eventName;
                status = napi_get_value_nodestring_(args[0], eventName);
                CHECK_NAPI_STATUS(pEngine, status);

                if (!args[1]->IsFunction()) {
                    LOG_ERROR("Function expected");
                    break;
                }

                Local<Function> callback = args[1].As<Function>();
                if (callback.IsEmpty()) {
                    LOG_ERROR("Function expected.");
                    break;
                }
                Persistent<Function> persist;
                persist.Reset(callback);
                Local<Object> obj = args.This();
                Persistent<Object> persistObj;
                persistObj.Reset(obj);
                pEngine->m_eventHandler->addEventHandler((char*)eventName, persistObj, persist);
            } while (false);
            //LOG_LEAVE;
        }


        NAPI_API_DEFINE(NodeRtcEngine, getVideoDevices)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                if (!pEngine->m_videoVdm) {
                    pEngine->m_videoVdm = new AVideoDeviceManager(pEngine->m_engine);
                }
                IVideoDeviceManager* vdm = pEngine->m_videoVdm->get();
                auto vdc = vdm ? vdm->enumerateVideoDevices() : nullptr;
                int count = vdc ? vdc->getCount() : 0;
                Local<v8::Array> devices = v8::Array::New(args.GetIsolate(), count);
                char deviceName[MAX_DEVICE_ID_LENGTH] = { 0 };
                char deviceId[MAX_DEVICE_ID_LENGTH] = { 0 };
                for (int i = 0; i < count; i++) {
                    Local<v8::Object> dev = v8::Object::New(args.GetIsolate());
                    vdc->getDevice(i, deviceName, deviceId);
                    auto dn = v8::String::NewFromUtf8(args.GetIsolate(), deviceName, NewStringType::kInternalized).ToLocalChecked();
                    auto di = v8::String::NewFromUtf8(args.GetIsolate(), deviceId, NewStringType::kInternalized).ToLocalChecked();
                    dev->Set(context, Nan::New<String>("devicename").ToLocalChecked(), dn);
                    dev->Set(context, Nan::New<String>("deviceid").ToLocalChecked(), di);
                    devices->Set(context, i, dev);
                    deviceName[0] = '\0';
                    deviceId[0] = '\0';
                }
                args.GetReturnValue().Set(devices);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setVideoDevice)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                NodeString deviceId;
                status = napi_get_value_nodestring_(args[0], deviceId);
                CHECK_NAPI_STATUS(pEngine, status);

                if (!pEngine->m_videoVdm) {
                    pEngine->m_videoVdm = new AVideoDeviceManager(pEngine->m_engine);
                }
                IVideoDeviceManager* vdm = pEngine->m_videoVdm->get();
                result = vdm ? vdm->setDevice(deviceId) : -1;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getCurrentVideoDevice)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                char deviceId[MAX_DEVICE_ID_LENGTH] = { 0 };

                if (!pEngine->m_videoVdm) {
                    pEngine->m_videoVdm = new AVideoDeviceManager(pEngine->m_engine);
                }
                IVideoDeviceManager* vdm = pEngine->m_videoVdm->get();
                if(vdm) {
                    vdm->getDevice(deviceId);
                }
                napi_set_string_result(args, deviceId);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, startVideoDeviceTest)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                // auto context = new NodeRenderContext(NODE_RENDER_TYPE_DEVICE_TEST);

                if (!pEngine->m_videoVdm) {
                    pEngine->m_videoVdm = new AVideoDeviceManager(pEngine->m_engine);
                }
                IVideoDeviceManager* vdm = pEngine->m_videoVdm->get();
                result = vdm ? vdm->startDeviceTest(nullptr) : -1;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, stopVideoDeviceTest)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                if (!pEngine->m_videoVdm) {
                    pEngine->m_videoVdm = new AVideoDeviceManager(pEngine->m_engine);
                }
                IVideoDeviceManager* vdm = pEngine->m_videoVdm->get();
                result = vdm ? vdm->stopDeviceTest() : -1;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getAudioPlaybackDevices)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                auto pdc = adm ? adm->enumeratePlaybackDevices() : nullptr;
                int count = pdc ? pdc->getCount() : 0;
                Local<v8::Array> devices = v8::Array::New(args.GetIsolate(), count);
                char deviceName[MAX_DEVICE_ID_LENGTH] = { 0 };
                char deviceId[MAX_DEVICE_ID_LENGTH] = { 0 };
                for (int i = 0; i < count; i++) {
                    Local<v8::Object> dev = v8::Object::New(args.GetIsolate());
                    pdc->getDevice(i, deviceName, deviceId);
                    auto dn = v8::String::NewFromUtf8(args.GetIsolate(), deviceName, NewStringType::kInternalized).ToLocalChecked();
                    auto di = v8::String::NewFromUtf8(args.GetIsolate(), deviceId, NewStringType::kInternalized).ToLocalChecked();
                    dev->Set(context, Nan::New<String>("devicename").ToLocalChecked(), dn);
                    dev->Set(context, Nan::New<String>("deviceid").ToLocalChecked(), di);
                    devices->Set(context, i, dev);
                    deviceName[0] = '\0';
                    deviceId[0] = '\0';
                }
                args.GetReturnValue().Set(devices);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setAudioPlaybackDevice)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                NodeString deviceId;
                status = napi_get_value_nodestring_(args[0], deviceId);
                CHECK_NAPI_STATUS(pEngine, status);

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                result = adm ? adm->setPlaybackDevice(deviceId) : -1;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getPlaybackDeviceInfo)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                auto pdc = adm ? adm->enumeratePlaybackDevices() : nullptr;
                int count = pdc ? pdc->getCount() : 0;

                char deviceName[MAX_DEVICE_ID_LENGTH] = { 0 };
                char deviceId[MAX_DEVICE_ID_LENGTH] = { 0 };
                Local<v8::Array> devices = v8::Array::New(args.GetIsolate(), 1);
                if (count > 0) {
                    Local<v8::Object> dev = v8::Object::New(args.GetIsolate());
                    adm->getPlaybackDeviceInfo(deviceId, deviceName);

                    auto dn = v8::String::NewFromUtf8(args.GetIsolate(), deviceName, NewStringType::kInternalized).ToLocalChecked();
                    auto di = v8::String::NewFromUtf8(args.GetIsolate(), deviceId, NewStringType::kInternalized).ToLocalChecked();
                    dev->Set(context, Nan::New<String>("devicename").ToLocalChecked(), dn);
                    dev->Set(context, Nan::New<String>("deviceid").ToLocalChecked(), di);
                    devices->Set(context, 0, dev);
                    deviceName[0] = '\0';
                    deviceId[0] = '\0';
                }
                args.GetReturnValue().Set(devices);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getCurrentAudioPlaybackDevice)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                char deviceId[MAX_DEVICE_ID_LENGTH] = { 0 };

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                if(adm) {
                    adm->getPlaybackDevice(deviceId);
                }
                napi_set_string_result(args, deviceId);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setAudioPlaybackVolume)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int volume;
                status = napi_get_value_int32_(args[0], volume);
                CHECK_NAPI_STATUS(pEngine, status);

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                result = adm ? adm->setPlaybackDeviceVolume(volume) : -1;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getAudioPlaybackVolume)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int volume;

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                if(adm) {
                    adm->getPlaybackDeviceVolume(&volume);
                }
                napi_set_int_result(args, volume);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getAudioRecordingDevices)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                auto pdc = adm ? adm->enumerateRecordingDevices() : nullptr;
                int count = pdc ? pdc->getCount() : 0;
                Local<v8::Array> devices = v8::Array::New(args.GetIsolate(), count);
                char deviceName[MAX_DEVICE_ID_LENGTH] = { 0 };
                char deviceId[MAX_DEVICE_ID_LENGTH] = { 0 };
                for (int i = 0; i < count; i++) {
                    Local<v8::Object> dev = v8::Object::New(args.GetIsolate());
                    pdc->getDevice(i, deviceName, deviceId);
                    auto dn = v8::String::NewFromUtf8(args.GetIsolate(), deviceName, NewStringType::kInternalized).ToLocalChecked();
                    auto di = v8::String::NewFromUtf8(args.GetIsolate(), deviceId, NewStringType::kInternalized).ToLocalChecked();
                    dev->Set(context, Nan::New<String>("devicename").ToLocalChecked(), dn);
                    dev->Set(context, Nan::New<String>("deviceid").ToLocalChecked(), di);
                    devices->Set(context, i, dev);
                    deviceName[0] = '\0';
                    deviceId[0] = '\0';
                }
                args.GetReturnValue().Set(devices);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setAudioRecordingDevice)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                NodeString deviceId;
                status = napi_get_value_nodestring_(args[0], deviceId);
                CHECK_NAPI_STATUS(pEngine, status);

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                result = adm ? adm->setRecordingDevice(deviceId) : -1;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getRecordingDeviceInfo)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                auto pdc = adm ? adm->enumerateRecordingDevices() : nullptr;
                int count = pdc ? pdc->getCount() : 0;

                char deviceName[MAX_DEVICE_ID_LENGTH] = { 0 };
                char deviceId[MAX_DEVICE_ID_LENGTH] = { 0 };
                Local<v8::Array> devices = v8::Array::New(args.GetIsolate(), 1);
                if (count > 0) {
                    Local<v8::Object> dev = v8::Object::New(args.GetIsolate());
                    adm->getRecordingDeviceInfo(deviceId, deviceName);

                    auto dn = v8::String::NewFromUtf8(args.GetIsolate(), deviceName, NewStringType::kInternalized).ToLocalChecked();
                    auto di = v8::String::NewFromUtf8(args.GetIsolate(), deviceId, NewStringType::kInternalized).ToLocalChecked();
                    dev->Set(context, Nan::New<String>("devicename").ToLocalChecked(), dn);
                    dev->Set(context, Nan::New<String>("deviceid").ToLocalChecked(), di);
                    devices->Set(context, 0, dev);
                    deviceName[0] = '\0';
                    deviceId[0] = '\0';
                }
                args.GetReturnValue().Set(devices);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getCurrentAudioRecordingDevice)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                char deviceId[MAX_DEVICE_ID_LENGTH] = { 0 };

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                if(adm) {
                    adm->getRecordingDevice(deviceId);
                }
                napi_set_string_result(args, deviceId);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getAudioRecordingVolume)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int volume;

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                if(adm) {
                    adm->getRecordingDeviceVolume(&volume);
                }
                napi_set_int_result(args, volume);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setAudioRecordingVolume)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int volume;
                status = napi_get_value_int32_(args[0], volume);
                CHECK_NAPI_STATUS(pEngine, status);

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                result = adm ? adm->setRecordingDeviceVolume(volume) : -1;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, startAudioPlaybackDeviceTest)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                NodeString filePath;
                status = napi_get_value_nodestring_(args[0], filePath);
                CHECK_NAPI_STATUS(pEngine, status);

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                result = adm ? adm->startPlaybackDeviceTest(filePath) : -1;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, stopAudioPlaybackDeviceTest)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                result = adm ? adm->stopPlaybackDeviceTest() : -1;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, startAudioRecordingDeviceTest)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int indicateInterval;
                status = napi_get_value_int32_(args[0], indicateInterval);
                CHECK_NAPI_STATUS(pEngine, status);

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                result = adm ? adm->startRecordingDeviceTest(indicateInterval) : -1;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, stopAudioRecordingDeviceTest)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                result = adm ? adm->stopRecordingDeviceTest() : -1;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getAudioPlaybackDeviceMute)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                bool mute;

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                if(adm) {
                    adm->getPlaybackDeviceMute(&mute);
                }
                napi_set_bool_result(args, mute);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setAudioPlaybackDeviceMute)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                bool mute;
                status = napi_get_value_bool_(args[0], mute);
                CHECK_NAPI_STATUS(pEngine, status);

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                result = adm ? adm->setPlaybackDeviceMute(mute) : -1;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getAudioRecordingDeviceMute)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                bool mute;

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                if(adm) {
                    adm->getRecordingDeviceMute(&mute);
                }
                napi_set_bool_result(args, mute);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setAudioRecordingDeviceMute)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                bool mute;
                status = napi_get_value_bool_(args[0], mute);
                CHECK_NAPI_STATUS(pEngine, status);

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                result = adm ? adm->setRecordingDeviceMute(mute) : -1;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, initializePluginManager)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                agora::media::IMediaEngine* pMediaEngine = nullptr;
                pEngine->getRtcEngine()->queryInterface(agora::rtc::INTERFACE_ID_TYPE::AGORA_IID_MEDIA_ENGINE, (void**)&pMediaEngine);
                if (pEngine->m_avPluginManager.get())
                {
                    // pMediaEngine->registerVideoFrameObserver(pEngine->m_avPluginManager.get());
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, releasePluginManager)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                agora::media::IMediaEngine* pMediaEngine = nullptr;
                pEngine->getRtcEngine()->queryInterface(agora::rtc::INTERFACE_ID_TYPE::AGORA_IID_MEDIA_ENGINE, (void**)&pMediaEngine);
                // pMediaEngine->registerVideoFrameObserver(NULL);
                result = 0;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, registerPlugin)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                Isolate *isolate = args.GetIsolate();

                CHECK_PLUGIN_MANAGER_EXIST(pEngine);

                napi_status status = napi_ok;
                if(!args[0]->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pEngine, status);
                }

                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[0], obj);
                CHECK_NAPI_STATUS(pEngine, status);
                nodestring pluginId, pluginFilePath;
                string mPluginId, mPluginFilePath, mPluginFolderPath;
                status = napi_get_object_property_nodestring_(isolate, obj, "id", pluginId);
                CHECK_NAPI_STATUS(pEngine, status);
                mPluginId = pluginId;
                CHECK_PLUGIN_INFO_NOT_EXIST(pEngine, mPluginId);//has exist => break

                status = napi_get_object_property_nodestring_(isolate, obj, "path", pluginFilePath);
                mPluginFilePath = pluginFilePath;

                agora_plugin_info pluginInfo;

                strncpy(pluginInfo.id, mPluginId.c_str(), MAX_PLUGIN_ID);
//                pluginInfo.id = mPluginId.c_str();

                const size_t last_slash_idx = mPluginFilePath.find_last_of("\\/");
                if (std::string::npos != last_slash_idx)
                {
                    mPluginFolderPath = mPluginFilePath.substr(0, last_slash_idx + 1);
                }

                #ifdef WIN32
                //AddDllDirectory(mPluginFolderPath.c_str());
                char* wPluginFilePath = U2G(mPluginFilePath.c_str());
                pluginInfo.pluginModule = LoadLibraryEx(wPluginFilePath, NULL, LOAD_WITH_ALTERED_SEARCH_PATH);
                delete[] wPluginFilePath;
                DWORD error = GetLastError();
                LOG_ERROR("LoadLibrary Error :%ld", error);
                CHECK_PLUGIN_MODULE_EXIST(pluginInfo);


                createAgoraAVFramePlugin createPlugin = (createAgoraAVFramePlugin)GetProcAddress((HMODULE)pluginInfo.pluginModule, "createAVFramePlugin");
                if (!createPlugin) {
                    FreeLibrary((HMODULE)pluginInfo.pluginModule);
                    pluginInfo.pluginModule = NULL;
                    LOG_ERROR("Error :%s, :%d,  GetProcAddress \"createAVFramePlugin\" Failed\n", __FUNCTION__, __LINE__, pluginInfo.id);
                    break;
                }
                #else
                pluginInfo.pluginModule = dlopen(mPluginFilePath.c_str(), RTLD_LAZY);
                CHECK_PLUGIN_MODULE_EXIST(pluginInfo);


                createAgoraAVFramePlugin createPlugin = (createAgoraAVFramePlugin)dlsym(pluginInfo.pluginModule, "createAVFramePlugin");
                if (!createPlugin) {
                    dlclose(pluginInfo.pluginModule);
                    pluginInfo.pluginModule = NULL;
                    LOG_ERROR("Error :%s, :%d,  GetProcAddress \"createAVFramePlugin\" Failed\n", __FUNCTION__, __LINE__, pluginInfo.id);
                    break;
                }
                #endif

                pluginInfo.instance = createPlugin();
                CHECK_PLUGIN_INSTANCE_EXIST(pluginInfo);

                #ifdef WIN32

                char* wPluginFolderPath = U2G(mPluginFolderPath.c_str());
                if (pluginInfo.instance->load(wPluginFolderPath) != 0) {
                    LOG_ERROR("Error :%s, :%d, plugin: \"%s\"  IAudioFramePlugin::load Failed\n", __FUNCTION__, __LINE__, pluginInfo.id);
                    break;
                }
                delete[] wPluginFolderPath;
                #else
                if (pluginInfo.instance->load(mPluginFolderPath.c_str()) != 0) {
                    LOG_ERROR("Error :%s, :%d, plugin: \"%s\"  IAVFramePlugin::load Failed\n", __FUNCTION__, __LINE__, pluginInfo.id);
                    break;
                }
                #endif

                pluginInfo.enabled = false;

                pEngine->m_avPluginManager->registerPlugin(pluginInfo);
                result = 0;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, unregisterPlugin)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                CHECK_PLUGIN_MANAGER_EXIST(pEngine);

                std::string pluginId;
                napi_status status = napi_ok;
                READ_PLUGIN_ID(pEngine, status, args[0], pluginId);
                CHECK_PLUGIN_INFO_EXIST(pEngine, pluginId); //not exist

                pEngine->m_avPluginManager->unregisterPlugin(pluginId);
                result = 0;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, enablePlugin)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                CHECK_PLUGIN_MANAGER_EXIST(pEngine);

                napi_status status = napi_ok;
                std::string pluginId;
                READ_PLUGIN_ID(pEngine, status, args[0], pluginId);
                CHECK_PLUGIN_INFO_EXIST(pEngine, pluginId);

                bool enabled = false;
                status = napi_get_value_bool_(args[1], enabled);
                CHECK_NAPI_STATUS(pEngine, status);

                agora_plugin_info pluginInfo;
                pEngine->m_avPluginManager->getPlugin(pluginId, pluginInfo);
                CHECK_PLUGIN_INSTANCE_EXIST(pluginInfo);


                if (enabled) {
                    result = pluginInfo.instance->enable();
                } else {
                    result = pluginInfo.instance->disable();
                }

                if(result != 0) {
                    LOG_ERROR("Error :%s, :%d, plugin: \"%s\"  IAVFramePlugin::enablePlugin return non-zero %d\n", __FUNCTION__, __LINE__, pluginInfo.id, result);
                    break;
                }
                pEngine->m_avPluginManager->enablePlugin(pluginId, enabled);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getPlugins)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                CHECK_PLUGIN_MANAGER_EXIST(pEngine);


                std::vector<std::string> plugins = pEngine->m_avPluginManager->getPlugins();
                Local<v8::Array> result = v8::Array::New(isolate, plugins.size());
                int idx = 0;
                for(auto it = plugins.begin(); it != plugins.end(); it++, idx++ )    {
                    // found nth element..print and break.
                    std::string name = *it;
                    agora_plugin_info pluginInfo;
                    pEngine->m_avPluginManager->getPlugin(name, pluginInfo);
                    Local<Object> obj = Object::New(isolate);
                    obj->Set(context, napi_create_string_(isolate, "id"), napi_create_string_(isolate, pluginInfo.id));
                    result->Set(context, idx, obj);
                }
                args.GetReturnValue().Set(result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setPluginParameter)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                CHECK_PLUGIN_MANAGER_EXIST(pEngine);

                napi_status status = napi_ok;
                std::string pluginId;
                READ_PLUGIN_ID(pEngine, status, args[0], pluginId);
                CHECK_PLUGIN_INFO_EXIST(pEngine, pluginId);

                nodestring param;
                status = napi_get_value_nodestring_(args[1], param);
                CHECK_NAPI_STATUS(pEngine, status);

                agora_plugin_info pluginInfo;
                pEngine->m_avPluginManager->getPlugin(pluginId, pluginInfo);
                CHECK_PLUGIN_INSTANCE_EXIST(pluginInfo);
                result = pluginInfo.instance->setParameter(param);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getPluginParameter)
        {
            LOG_ENTER;
            std::string result = "";
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                CHECK_PLUGIN_MANAGER_EXIST(pEngine);

                napi_status status = napi_ok;
                std::string pluginId;
                READ_PLUGIN_ID(pEngine, status, args[0], pluginId);
                CHECK_PLUGIN_INFO_EXIST(pEngine, pluginId);

                nodestring paramKey;
                status = napi_get_value_nodestring_(args[1], paramKey);
                CHECK_NAPI_STATUS(pEngine, status);

                agora_plugin_info pluginInfo;
                pEngine->m_avPluginManager->getPlugin(pluginId, pluginInfo);
                CHECK_PLUGIN_INSTANCE_EXIST(pluginInfo);
                result = std::string(pluginInfo.instance->getParameter(paramKey));
            } while (false);
            napi_set_string_result(args, result.c_str());
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, sendCustomReportMessage)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring id;
                status = napi_get_value_nodestring_(args[0], id);
                CHECK_NAPI_STATUS(pEngine, status);
                nodestring category;
                status = napi_get_value_nodestring_(args[1], category);
                CHECK_NAPI_STATUS(pEngine, status);
                nodestring event;
                status = napi_get_value_nodestring_(args[2], event);
                CHECK_NAPI_STATUS(pEngine, status);
                nodestring label;
                status = napi_get_value_nodestring_(args[3], label);
                CHECK_NAPI_STATUS(pEngine, status);
                int value;
                status = napi_get_value_int32_(args[4], value);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->sendCustomReportMessage(id, category, event, label, value);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

#define CHECK_NAPI_OBJ(obj) \
    if (obj.IsEmpty()) \
        break;

#define NODE_SET_OBJ_PROP_UINT32(isolate, obj, name, val) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        Local<Value> propVal = v8::Uint32::New(isolate, val); \
        CHECK_NAPI_OBJ(propVal); \
        v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, propVal); \
        if(!ret.IsNothing()) { \
            if(!ret.ToChecked()) { \
                break; \
            } \
        } \
    }

#define NODE_SET_OBJ_PROP_BOOL(isolate, obj, name, val) \
        { \
            Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
            Local<Value> propVal = v8::Boolean::New(isolate, val); \
            CHECK_NAPI_OBJ(propVal); \
            v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, propVal); \
            if(!ret.IsNothing()) { \
                if(!ret.ToChecked()) { \
                    break; \
                } \
            } \
        }

#define NODE_SET_OBJ_PROP_String(isolate, obj, name, val) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        Local<Value> propVal = String::NewFromUtf8(isolate, val, NewStringType::kInternalized).ToLocalChecked(); \
        CHECK_NAPI_OBJ(propVal); \
        v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, propVal); \
        if(!ret.IsNothing()) { \
            if(!ret.ToChecked()) { \
                break; \
            } \
        } \
    }

#define NODE_SET_OBJ_WINDOWINFO_DATA(isolate, obj, name, info) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        Local<v8::ArrayBuffer> buff = v8::ArrayBuffer::New(isolate, info.length); \
        memcpy(buff->GetContents().Data(), info.buffer, info.length); \
        Local<v8::Uint8Array> dataarray = v8::Uint8Array::New(buff, 0, info.length);\
        v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, dataarray); \
        if(!ret.IsNothing()) { \
            if(!ret.ToChecked()) { \
                break; \
            } \
        } \
    }

        NAPI_API_DEFINE(NodeRtcEngine, getScreenWindowsInfo)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                Local<v8::Array> infos = v8::Array::New(isolate);

                std::vector<ScreenWindowInfo> allWindows = getAllWindowInfo();
                for (unsigned int i = 0; i < allWindows.size(); ++i) {
                    ScreenWindowInfo windowInfo = allWindows[i];
                    Local<v8::Object> obj = Object::New(isolate);
#ifdef _WIN32
                    UINT32 windowId = (UINT32)windowInfo.windowId;
#elif defined(__APPLE__)
                    unsigned int windowId = windowInfo.windowId;
#endif
                    NODE_SET_OBJ_PROP_UINT32(isolate, obj, "windowId", windowId);
                    NODE_SET_OBJ_PROP_String(isolate, obj, "name", windowInfo.name.c_str());
                    NODE_SET_OBJ_PROP_String(isolate, obj, "ownerName", windowInfo.ownerName.c_str());
                    NODE_SET_OBJ_PROP_UINT32(isolate, obj, "width", windowInfo.width);
                    NODE_SET_OBJ_PROP_UINT32(isolate, obj, "height", windowInfo.height);

                    if (windowInfo.imageData) {
                        buffer_info imageInfo;
                        imageInfo.buffer = windowInfo.imageData;
                        imageInfo.length = windowInfo.imageDataLength;
                        NODE_SET_OBJ_WINDOWINFO_DATA(isolate, obj, "image", imageInfo);

                        free(windowInfo.imageData);
                    }

                    infos->Set(context, i, obj);
                }
#if 0 // APPLE
                std::vector<ScreenWindowInfo> allWindows = getAllWindowInfo();
                for (unsigned int i = 0; i < allWindows.size(); ++i) {
                    ScreenWindowInfo windowInfo = allWindows[i];
                    Local<v8::Object> obj = Object::New(isolate);
                    NODE_SET_OBJ_PROP_UINT32(isolate, obj, "windowId", windowInfo.windowId);
                    NODE_SET_OBJ_PROP_String(isolate, obj, "name", windowInfo.name.c_str());
                    NODE_SET_OBJ_PROP_String(isolate, obj, "ownerName", windowInfo.ownerName.c_str());
                    NODE_SET_OBJ_PROP_UINT32(isolate, obj, "width", windowInfo.width);
                    NODE_SET_OBJ_PROP_UINT32(isolate, obj, "height", windowInfo.height);

                    if (windowInfo.imageData) {
                        buffer_info imageInfo;
                        imageInfo.buffer = windowInfo.imageData;
                        imageInfo.length = windowInfo.imageDataLength;
                        NODE_SET_OBJ_WINDOWINFO_DATA(isolate, obj, "image", imageInfo);

                        free(windowInfo.imageData);
                    }

                    infos->Set(context, i, obj);
                }
#endif

                napi_set_array_result(args, infos);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getScreenDisplaysInfo)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                Local<v8::Array> infos = v8::Array::New(isolate);

                std::vector<ScreenDisplayInfo> allDisplays = getAllDisplayInfo();


                for (unsigned int i = 0; i < allDisplays.size(); ++i) {
                    ScreenDisplayInfo displayInfo = allDisplays[i];
                    Local<v8::Object> obj = Object::New(isolate);
                    ScreenIDType displayId = displayInfo.displayId;
                    Local<v8::Object> displayIdObj = Object::New(isolate);
#ifdef _WIN32
                    NODE_SET_OBJ_PROP_UINT32(isolate, displayIdObj, "x", displayId.x);
                    NODE_SET_OBJ_PROP_UINT32(isolate, displayIdObj, "y", displayId.y);
                    NODE_SET_OBJ_PROP_UINT32(isolate, displayIdObj, "width", displayId.width);
                    NODE_SET_OBJ_PROP_UINT32(isolate, displayIdObj, "height", displayId.height);
#elif defined(__APPLE__)
                    NODE_SET_OBJ_PROP_UINT32(isolate, displayIdObj, "id", displayId.idVal);
#endif
                    Local<Value> propName = String::NewFromUtf8(isolate, "displayId", NewStringType::kInternalized).ToLocalChecked();
                    obj->Set(context, propName, displayIdObj);

                    NODE_SET_OBJ_PROP_UINT32(isolate, obj, "width", displayInfo.width);
                    NODE_SET_OBJ_PROP_UINT32(isolate, obj, "height", displayInfo.height);
                    NODE_SET_OBJ_PROP_BOOL(isolate, obj, "isMain", displayInfo.isMain);
                    NODE_SET_OBJ_PROP_BOOL(isolate, obj, "isActive", displayInfo.isActive);
                    NODE_SET_OBJ_PROP_BOOL(isolate, obj, "isBuiltin", displayInfo.isBuiltin);

                    if (displayInfo.imageData) {
                        buffer_info imageInfo;
                        imageInfo.buffer = displayInfo.imageData;
                        imageInfo.length = displayInfo.imageDataLength;
                        NODE_SET_OBJ_WINDOWINFO_DATA(isolate, obj, "image", imageInfo);

                        free(displayInfo.imageData);
                    }

                    infos->Set(context, i, obj);
                }
                napi_set_array_result(args, infos);
            } while (false);
            LOG_LEAVE;
        }

        // NAPI_API_DEFINE(NodeRtcEngine, registerLocalUserAccount)
        // {
        //     LOG_ENTER;
        //     int result = -1;
        //     do {
        //         NodeRtcEngine *pEngine = nullptr;
        //         napi_get_native_this(args, pEngine);
        //         CHECK_NATIVE_THIS(pEngine);

        //         NodeString appId, userAccount;

        //         napi_status status = napi_get_value_nodestring_(args[0], appId);
        //         CHECK_NAPI_STATUS(pEngine, status);

        //         status = napi_get_value_nodestring_(args[1], userAccount);
        //         CHECK_NAPI_STATUS(pEngine, status);

        //         result = pEngine->m_engine->registerLocalUserAccount(appId, userAccount);
        //     } while (false);
        //     napi_set_array_result(args, result);
        //     LOG_LEAVE;
        // }

        // NAPI_API_DEFINE(NodeRtcEngine, joinChannelWithUserAccount)
        // {
        //     LOG_ENTER;
        //     int result = -1;
        //     do {
        //         NodeRtcEngine *pEngine = nullptr;
        //         napi_get_native_this(args, pEngine);
        //         CHECK_NATIVE_THIS(pEngine);

        //         NodeString token, channel, userAccount;

        //         napi_status status = napi_get_value_nodestring_(args[0], token);
        //         CHECK_NAPI_STATUS(pEngine, status);

        //         status = napi_get_value_nodestring_(args[1], channel);
        //         CHECK_NAPI_STATUS(pEngine, status);

        //         status = napi_get_value_nodestring_(args[2], userAccount);
        //         CHECK_NAPI_STATUS(pEngine, status);

        //         result = pEngine->m_engine->joinChannelWithUserAccount(token, channel, userAccount);
        //     } while (false);
        //     napi_set_array_result(args, result);
        //     LOG_LEAVE;
        // }

        // NAPI_API_DEFINE(NodeRtcEngine, getUserInfoByUserAccount)
        // {
        //     LOG_ENTER;
        //     int result = -1;
        //     do {
        //         NodeRtcEngine *pEngine = nullptr;
        //         Isolate* isolate = args.GetIsolate();
        //         Local<Context> context = isolate->GetCurrentContext();
        //         napi_get_native_this(args, pEngine);
        //         CHECK_NATIVE_THIS(pEngine);

        //         NodeString userAccount;
        //         UserInfo userInfo;

        //         napi_status status = napi_get_value_nodestring_(args[0], userAccount);
        //         CHECK_NAPI_STATUS(pEngine, status);

        //         result = pEngine->m_engine->getUserInfoByUserAccount(userAccount, &userInfo);
        //         Local<v8::Object> obj = Object::New(isolate);
        //         NODE_SET_OBJ_PROP_UINT32(isolate, obj, "errorCode", result);

        //         Local<v8::Object> userObj = Object::New(isolate);
        //         NODE_SET_OBJ_PROP_UINT32(isolate, userObj, "uid", userInfo.uid);
        //         NODE_SET_OBJ_PROP_String(isolate, userObj, "userAccount", userInfo.userAccount);
        //         Local<Value> propName = String::NewFromUtf8(isolate, "userInfo", NewStringType::kInternalized).ToLocalChecked();
        //         obj->Set(context, propName, userObj);
        //         args.GetReturnValue().Set(obj);
        //     } while (false);
        //     LOG_LEAVE;
        // }

        // NAPI_API_DEFINE(NodeRtcEngine, getUserInfoByUid)
        // {
        //     LOG_ENTER;
        //     int result = -1;
        //     do {
        //         NodeRtcEngine *pEngine = nullptr;
        //         napi_get_native_this(args, pEngine);
        //         CHECK_NATIVE_THIS(pEngine);
        //         Isolate* isolate = args.GetIsolate();
        //         Local<Context> context = isolate->GetCurrentContext();

        //         uid_t uid;
        //         UserInfo userInfo;

        //         napi_status status = napi_get_value_uint32_(args[0], uid);
        //         CHECK_NAPI_STATUS(pEngine, status);

        //         result = pEngine->m_engine->getUserInfoByUid(uid, &userInfo);
        //         Local<v8::Object> obj = Object::New(isolate);
        //         NODE_SET_OBJ_PROP_UINT32(isolate, obj, "errorCode", result);

        //         Local<v8::Object> userObj = Object::New(isolate);
        //         NODE_SET_OBJ_PROP_UINT32(isolate, userObj, "uid", userInfo.uid);
        //         NODE_SET_OBJ_PROP_String(isolate, userObj, "userAccount", userInfo.userAccount);
        //         Local<Value> propName = String::NewFromUtf8(isolate, "userInfo", NewStringType::kInternalized).ToLocalChecked();
        //         obj->Set(context, propName, userObj);
        //         args.GetReturnValue().Set(obj);
        //     } while (false);
        //     LOG_LEAVE;
        // }

        NAPI_API_DEFINE(NodeRtcEngine, startChannelMediaRelay)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                ChannelMediaRelayConfiguration config;
                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[0], obj);
                CHECK_NAPI_STATUS(pEngine, status);

                if (obj->IsNull()) {
                    status = napi_invalid_arg;
                    break;
                }

                //srcInfo
                Local<Name> keyName = String::NewFromUtf8(args.GetIsolate(), "srcInfo", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> srcInfoValue = obj->Get(args.GetIsolate()->GetCurrentContext(), keyName).ToLocalChecked();
                ChannelMediaInfo srcInfo;
                if (!srcInfoValue->IsNull()) {
                    NodeString channelName, token;
                    Local<Object> objSrcInfo;
                    status = napi_get_value_object_(isolate, srcInfoValue, objSrcInfo);
                    CHECK_NAPI_STATUS(pEngine, status);
                    napi_get_object_property_nodestring_(args.GetIsolate(), objSrcInfo, "channelName", channelName);
                    napi_get_object_property_nodestring_(args.GetIsolate(), objSrcInfo, "token", token);
                    napi_get_object_property_uid_(args.GetIsolate(), objSrcInfo, "uid", srcInfo.uid);
                    string mChannelName(channelName);
                    string mToken(token);
                    srcInfo.channelName = mChannelName.c_str();
                    srcInfo.token = mToken.c_str();
                }


                //destInfos
                keyName = String::NewFromUtf8(args.GetIsolate(), "destInfos", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> objDestInfos = obj->Get(args.GetIsolate()->GetCurrentContext(), keyName).ToLocalChecked();
                if (objDestInfos->IsNull() || !objDestInfos->IsArray()) {
                    status = napi_invalid_arg;
                    break;
                }
                auto destInfosValue = v8::Array::Cast(*objDestInfos);
                int destInfoCount = destInfosValue->Length();
                ChannelMediaInfo* destInfos = new ChannelMediaInfo[destInfoCount];
                for (uint32 i = 0; i < destInfoCount; i++) {
                    Local<Value> value = destInfosValue->Get(context, i).ToLocalChecked();
                    Local<Object> destInfoObj;
                    status = napi_get_value_object_(isolate, value, destInfoObj);
                    CHECK_NAPI_STATUS(pEngine, status);
                    if (destInfoObj->IsNull()) {
                        status = napi_invalid_arg;
                        break;
                    }
                    NodeString channelName, token;
                    napi_get_object_property_nodestring_(args.GetIsolate(), destInfoObj, "channelName", channelName);
                    napi_get_object_property_nodestring_(args.GetIsolate(), destInfoObj, "token", token);
                    napi_get_object_property_uid_(args.GetIsolate(), destInfoObj, "uid", destInfos[i].uid);
                    string mChannelName(channelName);
                    string mToken(token);
                    srcInfo.channelName = mChannelName.c_str();
                    srcInfo.token = mToken.c_str();
                }
                config.srcInfo = &srcInfo;
                config.destInfos = &destInfos[0];
                config.destCount = destInfoCount;

                result = pEngine->m_engine->startChannelMediaRelay(config);

                if(destInfos){
                    delete[] destInfos;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, updateChannelMediaRelay)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                ChannelMediaRelayConfiguration config;
                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[0], obj);
                CHECK_NAPI_STATUS(pEngine, status);

                if (obj->IsNull()) {
                    status = napi_invalid_arg;
                    break;
                }

                //srcInfo
                Local<Name> keyName = String::NewFromUtf8(args.GetIsolate(), "srcInfo", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> srcInfoValue = obj->Get(args.GetIsolate()->GetCurrentContext(), keyName).ToLocalChecked();
                ChannelMediaInfo srcInfo;
                if (!srcInfoValue->IsNull()) {
                    NodeString channelName, token;
                    Local<Object> objSrcInfo;
                    status = napi_get_value_object_(isolate, srcInfoValue, objSrcInfo);
                    CHECK_NAPI_STATUS(pEngine, status);
                    napi_get_object_property_nodestring_(args.GetIsolate(), objSrcInfo, "channelName", channelName);
                    napi_get_object_property_nodestring_(args.GetIsolate(), objSrcInfo, "token", token);
                    napi_get_object_property_uid_(args.GetIsolate(), objSrcInfo, "uid", srcInfo.uid);
                    string mChannelName(channelName);
                    string mToken(token);
                    srcInfo.channelName = mChannelName.c_str();
                    srcInfo.token = mToken.c_str();
                }


                //destInfos
                keyName = String::NewFromUtf8(args.GetIsolate(), "destInfos", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> objDestInfos = obj->Get(args.GetIsolate()->GetCurrentContext(), keyName).ToLocalChecked();
                if (objDestInfos->IsNull() || !objDestInfos->IsArray()) {
                    status = napi_invalid_arg;
                    break;
                }
                auto destInfosValue = v8::Array::Cast(*objDestInfos);
                int destInfoCount = destInfosValue->Length();
                ChannelMediaInfo* destInfos = new ChannelMediaInfo[destInfoCount];
                for (uint32 i = 0; i < destInfoCount; i++) {
                    Local<Value> value = destInfosValue->Get(context, i).ToLocalChecked();
                    Local<Object> destInfoObj;
                    status = napi_get_value_object_(isolate, value, destInfoObj);
                    CHECK_NAPI_STATUS(pEngine, status);
                    if (destInfoObj->IsNull()) {
                        status = napi_invalid_arg;
                        break;
                    }
                    NodeString channelName, token;
                    napi_get_object_property_nodestring_(args.GetIsolate(), destInfoObj, "channelName", channelName);
                    napi_get_object_property_nodestring_(args.GetIsolate(), destInfoObj, "token", token);
                    napi_get_object_property_uid_(args.GetIsolate(), destInfoObj, "uid", destInfos[i].uid);
                    string mChannelName(channelName);
                    string mToken(token);
                    srcInfo.channelName = mChannelName.c_str();
                    srcInfo.token = mToken.c_str();
                }
                config.srcInfo = &srcInfo;
                config.destInfos = &destInfos[0];
                config.destCount = destInfoCount;

                result = pEngine->m_engine->updateChannelMediaRelay(config);
                if(destInfos){
                    delete[] destInfos;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, stopChannelMediaRelay)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                result = pEngine->m_engine->stopChannelMediaRelay();
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, startScreenCaptureByWindow)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do{
                Isolate *isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                // screenId
#if defined(__APPLE__)
                unsigned int windowId;
                status = napi_get_value_uint32_(args[0], windowId);
                CHECK_NAPI_STATUS(pEngine, status);
#elif defined(_WIN32)
// #if defined(_WIN64)
//                 int64_t wid;
//                 status = napi_get_value_int64_(args[0], wid);
// #else
//                 uint32_t wid;
//                 status = napi_get_value_uint32_(args[0], wid);
// #endif        int64_t wid;
                agora::view_t windowId;
                int64_t wid;
                status = napi_get_value_int64_(args[0], wid);

                CHECK_NAPI_STATUS(pEngine, status);
                windowId = (HWND)wid;
#endif

                // regionRect
                if(!args[1]->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pEngine, status);
                }
                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[1], obj);
                CHECK_NAPI_STATUS(pEngine, status);

                Rectangle regionRect;
                status = napi_get_object_property_int32_(isolate, obj, "x", regionRect.x);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "y", regionRect.y);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "width", regionRect.width);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "height", regionRect.height);
                CHECK_NAPI_STATUS(pEngine, status);

                // capture parameters
                if(!args[2]->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pEngine, status);
                }
                status = napi_get_value_object_(isolate, args[2], obj);
                CHECK_NAPI_STATUS(pEngine, status);
                ScreenCaptureParameters captureParams;
                VideoDimensions dimensions;
                status = napi_get_object_property_int32_(isolate, obj, "width", dimensions.width);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "height", dimensions.height);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "frameRate", captureParams.frameRate);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "bitrate", captureParams.bitrate);
                CHECK_NAPI_STATUS(pEngine, status);
                // status = napi_get_object_property_bool_(isolate, obj, "captureMouseCursor", captureParams.captureMouseCursor);
                // CHECK_NAPI_STATUS(pEngine, status);
                // status = napi_get_object_property_bool_(isolate, obj, "windowFocus", captureParams.windowFocus);
                // CHECK_NAPI_STATUS(pEngine, status);
                captureParams.dimensions = dimensions;

                result = pEngine->m_engine->startScreenCaptureByWindowId(reinterpret_cast<agora::view_t>(windowId), regionRect, captureParams);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, startScreenCaptureByScreen)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do{
                Isolate *isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                // screenId
                ScreenIDType screen;
#ifdef _WIN32
                if(!args[0]->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pEngine, status);
                }
                Local<Object> screenRectObj;
                status = napi_get_value_object_(isolate, args[0], screenRectObj);
                CHECK_NAPI_STATUS(pEngine, status);

                Rectangle screenRect;
                status = napi_get_object_property_int32_(isolate, screenRectObj, "x", screenRect.x);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, screenRectObj, "y", screenRect.y);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, screenRectObj, "width", screenRect.width);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, screenRectObj, "height", screenRect.height);
                CHECK_NAPI_STATUS(pEngine, status);
                screen = screenRect;
#elif defined(__APPLE__)
                if(!args[0]->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pEngine, status);
                }
                Local<Object> displayIdObj;
                status = napi_get_value_object_(isolate, args[0], displayIdObj);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_uint32_(isolate, displayIdObj, "id", screen.idVal);
                CHECK_NAPI_STATUS(pEngine, status);
#endif

                // regionRect
                if(!args[1]->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pEngine, status);
                }
                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[1], obj);
                CHECK_NAPI_STATUS(pEngine, status);

                Rectangle regionRect;
                status = napi_get_object_property_int32_(isolate, obj, "x", regionRect.x);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "y", regionRect.y);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "width", regionRect.width);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "height", regionRect.height);
                CHECK_NAPI_STATUS(pEngine, status);

                // capture parameters
                if(!args[2]->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pEngine, status);
                }
                status = napi_get_value_object_(isolate, args[2], obj);
                CHECK_NAPI_STATUS(pEngine, status);
                ScreenCaptureParameters captureParams;
                VideoDimensions dimensions;
                status = napi_get_object_property_int32_(isolate, obj, "width", dimensions.width);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "height", dimensions.height);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "frameRate", captureParams.frameRate);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "bitrate", captureParams.bitrate);
                CHECK_NAPI_STATUS(pEngine, status);
                // status = napi_get_object_property_bool_(isolate, obj, "captureMouseCursor", captureParams.captureMouseCursor);
                // CHECK_NAPI_STATUS(pEngine, status);
                // status = napi_get_object_property_bool_(isolate, obj, "windowFocus", captureParams.windowFocus);
                // CHECK_NAPI_STATUS(pEngine, status);
                captureParams.dimensions = dimensions;

                #if defined(_WIN32)
                    result = pEngine->m_engine->startScreenCaptureByScreenRect(screen, regionRect, captureParams);
                #elif defined(__APPLE__)
                    result = pEngine->m_engine->startScreenCaptureByDisplayId(screen.idVal, regionRect, captureParams);
                #endif
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, updateScreenCaptureParameters)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do{
                Isolate *isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                // capture parameters
                if(!args[0]->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pEngine, status);
                }
                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[0], obj);
                CHECK_NAPI_STATUS(pEngine, status);
                ScreenCaptureParameters captureParams;
                VideoDimensions dimensions;
                status = napi_get_object_property_int32_(isolate, obj, "width", dimensions.width);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "height", dimensions.height);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "frameRate", captureParams.frameRate);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "bitrate", captureParams.bitrate);
                CHECK_NAPI_STATUS(pEngine, status);
                // status = napi_get_object_property_bool_(isolate, obj, "captureMouseCursor", captureParams.captureMouseCursor);
                // CHECK_NAPI_STATUS(pEngine, status);
                // status = napi_get_object_property_bool_(isolate, obj, "windowFocus", captureParams.windowFocus);
                // CHECK_NAPI_STATUS(pEngine, status);
                captureParams.dimensions = dimensions;

                result = pEngine->m_engine->updateScreenCaptureParameters(captureParams);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setScreenCaptureContentHint)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                VIDEO_CONTENT_HINT hint;
                int value = 0;
                status = napi_get_value_int32_(args[0], value);
                CHECK_NAPI_STATUS(pEngine, status);

                switch(value) {
                    case 0:
                        hint = CONTENT_HINT_NONE;
                        break;
                    case 1:
                        hint = CONTENT_HINT_MOTION;
                        break;
                    case 2:
                        hint = CONTENT_HINT_DETAILS;
                        break;
                }

                result = pEngine->m_engine->setScreenCaptureContentHint(hint);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }
        /**
         * 3.0.1 Apis
         */
        // NAPI_API_DEFINE_WRAPPER_PARAM_1(setAudioMixingPitch, int32);


        NAPI_API_DEFINE(NodeRtcEngine, registerMediaMetadataObserver)
        {
            LOG_ENTER;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                LOG_F(INFO, "registerMediaMetadataObserver");
                if (!(pEngine->metadataObserver.get())) {
                    pEngine->metadataObserver.reset(new NodeMetadataObserver());
                }
                result = pEngine->m_engine->registerMediaMetadataObserver(pEngine->metadataObserver.get(), IMetadataObserver::METADATA_TYPE::VIDEO_METADATA);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, unRegisterMediaMetadataObserver)
        {
            LOG_ENTER;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                LOG_F(INFO, "unRegisterMediaMetadataObserver");
                result = pEngine->m_engine->registerMediaMetadataObserver(nullptr, IMetadataObserver::METADATA_TYPE::VIDEO_METADATA);
                if (pEngine->metadataObserver.get()) {
                    pEngine->metadataObserver.get()->clearData();
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, sendMetadata)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                Isolate *isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                if(!args[0]->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pEngine, status);
                }

                if (!pEngine->metadataObserver.get()) {
                    result = -100;
                    break;
                }

                unsigned int uid = 0;
                double timeStampMs = 0;
                unsigned int size;
                nodestring buffer;
                char *_buffer;

                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[0], obj);
                CHECK_NAPI_STATUS(pEngine, status);
                // status = napi_get_object_property_uid_(isolate, obj, "uid", uid);
                // CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_uid_(isolate, obj, "size", size);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_nodestring_(isolate, obj, "buffer", buffer);
                _buffer = buffer;
                CHECK_NAPI_STATUS(pEngine, status);
                // status = napi_get_object_property_double_(isolate, obj, "timeStampMs", timeStampMs);
                // CHECK_NAPI_STATUS(pEngine, status);
                result = pEngine->metadataObserver.get()->sendMetadata(uid, size, reinterpret_cast<unsigned char *>(_buffer), timeStampMs);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, addMetadataEventHandler)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                if (!args[0]->IsFunction()) {
                    LOG_ERROR("Function expected");
                    break;
                }

                Local<Function> callback = args[0].As<Function>();
                if (callback.IsEmpty()) {
                    LOG_ERROR("Function expected.");
                    break;
                }

                Local<Function> callback2 = args[1].As<Function>();
                if (callback2.IsEmpty()) {
                    LOG_ERROR("Function expected.");
                    break;
                }

                Persistent<Function> persist;
                persist.Reset(callback);

                Persistent<Function> persist2;
                persist2.Reset(callback2);

                Local<Object> obj = args.This();
                Persistent<Object> persistObj;
                persistObj.Reset(obj);
                result = pEngine->metadataObserver->addEventHandler(persistObj, persist, persist2);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setMaxMetadataSize)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int maxSize;
                status = napi_get_value_int32_(args[0], maxSize);
                CHECK_NAPI_STATUS(pEngine, status);
                result = pEngine->metadataObserver.get()->setMaxMetadataSize(maxSize);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, joinChannelEx)
        {
            LOG_ENTER;
            int result = -1;
            do {
                Isolate *isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring token;
                status = napi_get_value_nodestring_(args[0], token);
                CHECK_NAPI_STATUS(pEngine, status);
                nodestring channelId;
                status = napi_get_value_nodestring_(args[1], channelId);
                CHECK_NAPI_STATUS(pEngine, status);
                uid_t uid;
                status = napi_get_value_uint32_(args[2], uid);
                CHECK_NAPI_STATUS(pEngine, status);

                ChannelMediaOptions channelMediaOptions;
                Local<Object> optionObj;
                status = napi_get_value_object_(isolate, args[3], optionObj);
                CHECK_NAPI_STATUS(pEngine, status);
                bool publishCameraTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishCameraTrack", publishCameraTrack);
                channelMediaOptions.publishCameraTrack = publishCameraTrack;
                bool publishSecondaryCameraTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishSecondaryCameraTrack", publishSecondaryCameraTrack);
                channelMediaOptions.publishSecondaryCameraTrack = publishSecondaryCameraTrack;
                bool publishAudioTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishAudioTrack", publishAudioTrack);
                channelMediaOptions.publishAudioTrack = publishAudioTrack;
                bool publishScreenTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishScreenTrack", publishScreenTrack);
                channelMediaOptions.publishScreenTrack = publishScreenTrack;
                bool publishSecondaryScreenTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishSecondaryScreenTrack", publishSecondaryScreenTrack);
                channelMediaOptions.publishSecondaryScreenTrack = publishSecondaryScreenTrack;
                bool publishCustomAudioTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishCustomAudioTrack", publishCustomAudioTrack);
                channelMediaOptions.publishCustomAudioTrack = publishCustomAudioTrack;
                bool publishCustomVideoTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishCustomVideoTrack", publishCustomVideoTrack);
                channelMediaOptions.publishCustomVideoTrack = publishCustomVideoTrack;
                bool publishEncodedVideoTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishEncodedVideoTrack", publishEncodedVideoTrack);
                channelMediaOptions.publishEncodedVideoTrack = publishEncodedVideoTrack;
                bool publishMediaPlayerAudioTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishMediaPlayerAudioTrack", publishMediaPlayerAudioTrack);
                channelMediaOptions.publishMediaPlayerAudioTrack = publishMediaPlayerAudioTrack;
                bool publishMediaPlayerVideoTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishMediaPlayerVideoTrack", publishMediaPlayerVideoTrack);
                channelMediaOptions.publishMediaPlayerVideoTrack = publishMediaPlayerVideoTrack;
                bool publishTrancodedVideoTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishTrancodedVideoTrack", publishTrancodedVideoTrack);
                channelMediaOptions.publishTrancodedVideoTrack = publishTrancodedVideoTrack;
                bool autoSubscribeAudio = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "autoSubscribeAudio", autoSubscribeAudio);
                channelMediaOptions.autoSubscribeAudio = autoSubscribeAudio;
                bool autoSubscribeVideo = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "autoSubscribeVideo", autoSubscribeVideo);
                channelMediaOptions.autoSubscribeVideo = autoSubscribeVideo;
                int publishMediaPlayerId = 0;
                status = napi_get_object_property_int32_(isolate, optionObj, "publishMediaPlayerId", publishMediaPlayerId);
                channelMediaOptions.publishMediaPlayerId = publishMediaPlayerId;
                bool enableAudioRecordingOrPlayout = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "enableAudioRecordingOrPlayout", enableAudioRecordingOrPlayout);
                channelMediaOptions.enableAudioRecordingOrPlayout = enableAudioRecordingOrPlayout;
                int clientRoleType = 2;
                status = napi_get_object_property_int32_(isolate, optionObj, "clientRoleType", clientRoleType);
                channelMediaOptions.clientRoleType = (CLIENT_ROLE_TYPE)clientRoleType;
                int defaultVideoStreamType = 0;
                status = napi_get_object_property_int32_(isolate, optionObj, "defaultVideoStreamType", defaultVideoStreamType);
                channelMediaOptions.defaultVideoStreamType = (VIDEO_STREAM_TYPE)defaultVideoStreamType;
                int channelProfile = 0;
                status = napi_get_object_property_int32_(isolate, optionObj, "channelProfile", channelProfile);
                channelMediaOptions.channelProfile = (CHANNEL_PROFILE_TYPE)channelProfile;

                // LOG_F(INFO, "parameter token: %s, channelId: %s, uid: %d", (char*)token, (char*)channelId, uid);
                // LOG_F(INFO, "publishCameraTrack: %d", channelMediaOptions.publishCameraTrack.value());
                // LOG_F(INFO, "publishSecondaryCameraTrack: %d", channelMediaOptions.publishSecondaryCameraTrack.value());
                // LOG_F(INFO, "publishAudioTrack: %d", channelMediaOptions.publishAudioTrack.value());
                // LOG_F(INFO, "publishScreenTrack: %d", channelMediaOptions.publishScreenTrack.value());
                // LOG_F(INFO, "publishSecondaryScreenTrack: %d", channelMediaOptions.publishSecondaryScreenTrack.value());
                // LOG_F(INFO, "publishCustomAudioTrack: %d", channelMediaOptions.publishCustomAudioTrack.value());
                // LOG_F(INFO, "publishCustomVideoTrack: %d", channelMediaOptions.publishCustomVideoTrack.value());
                // LOG_F(INFO, "publishEncodedVideoTrack: %d", channelMediaOptions.publishEncodedVideoTrack.value());
                // LOG_F(INFO, "publishMediaPlayerAudioTrack: %d", channelMediaOptions.publishMediaPlayerAudioTrack.value());
                // LOG_F(INFO, "publishMediaPlayerVideoTrack: %d", channelMediaOptions.publishMediaPlayerVideoTrack.value());
                // LOG_F(INFO, "publishTrancodedVideoTrack: %d", channelMediaOptions.publishTrancodedVideoTrack.value());
                // LOG_F(INFO, "autoSubscribeAudio: %d", channelMediaOptions.autoSubscribeAudio.value());
                // LOG_F(INFO, "autoSubscribeVideo: %d", channelMediaOptions.autoSubscribeVideo.value());
                // LOG_F(INFO, "publishMediaPlayerId: %d", channelMediaOptions.publishMediaPlayerId.value());
                // LOG_F(INFO, "enableAudioRecordingOrPlayout: %d", channelMediaOptions.enableAudioRecordingOrPlayout.value());
                // LOG_F(INFO, "clientRoleType: %d", channelMediaOptions.clientRoleType.value());
                // LOG_F(INFO, "defaultVideoStreamType: %d", channelMediaOptions.defaultVideoStreamType.value());
                // LOG_F(INFO, "defaultVideoStreamType: %d", channelMediaOptions.defaultVideoStreamType.value());

                unsigned int connectionId;
                result = pEngine->m_engine->joinChannelEx(token, channelId, uid, channelMediaOptions, nullptr, &connectionId);
                if (result == 0) {
                    result = connectionId;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, joinChannel2)
        {
            LOG_ENTER;
            int result = -1;
            do {
                Isolate *isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring token;
                status = napi_get_value_nodestring_(args[0], token);
                CHECK_NAPI_STATUS(pEngine, status);
                nodestring channelId;
                status = napi_get_value_nodestring_(args[1], channelId);
                CHECK_NAPI_STATUS(pEngine, status);
                uid_t uid;
                status = napi_get_value_uint32_(args[2], uid);
                CHECK_NAPI_STATUS(pEngine, status);

                ChannelMediaOptions channelMediaOptions;
                Local<Object> optionObj;
                status = napi_get_value_object_(isolate, args[3], optionObj);
                CHECK_NAPI_STATUS(pEngine, status);
                bool publishCameraTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishCameraTrack", publishCameraTrack);
                channelMediaOptions.publishCameraTrack = publishCameraTrack;
                bool publishSecondaryCameraTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishSecondaryCameraTrack", publishSecondaryCameraTrack);
                channelMediaOptions.publishSecondaryCameraTrack = publishSecondaryCameraTrack;
                bool publishAudioTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishAudioTrack", publishAudioTrack);
                channelMediaOptions.publishAudioTrack = publishAudioTrack;
                bool publishScreenTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishScreenTrack", publishScreenTrack);
                channelMediaOptions.publishScreenTrack = publishScreenTrack;
                bool publishSecondaryScreenTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishSecondaryScreenTrack", publishSecondaryScreenTrack);
                channelMediaOptions.publishSecondaryScreenTrack = publishSecondaryScreenTrack;
                bool publishCustomAudioTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishCustomAudioTrack", publishCustomAudioTrack);
                channelMediaOptions.publishCustomAudioTrack = publishCustomAudioTrack;
                bool publishCustomVideoTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishCustomVideoTrack", publishCustomVideoTrack);
                channelMediaOptions.publishCustomVideoTrack = publishCustomVideoTrack;
                bool publishEncodedVideoTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishEncodedVideoTrack", publishEncodedVideoTrack);
                channelMediaOptions.publishEncodedVideoTrack = publishEncodedVideoTrack;
                bool publishMediaPlayerAudioTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishMediaPlayerAudioTrack", publishMediaPlayerAudioTrack);
                channelMediaOptions.publishMediaPlayerAudioTrack = publishMediaPlayerAudioTrack;
                bool publishMediaPlayerVideoTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishMediaPlayerVideoTrack", publishMediaPlayerVideoTrack);
                channelMediaOptions.publishMediaPlayerVideoTrack = publishMediaPlayerVideoTrack;
                bool publishTrancodedVideoTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishTrancodedVideoTrack", publishTrancodedVideoTrack);
                channelMediaOptions.publishTrancodedVideoTrack = publishTrancodedVideoTrack;
                bool autoSubscribeAudio = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "autoSubscribeAudio", autoSubscribeAudio);
                channelMediaOptions.autoSubscribeAudio = autoSubscribeAudio;
                bool autoSubscribeVideo = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "autoSubscribeVideo", autoSubscribeVideo);
                channelMediaOptions.autoSubscribeVideo = autoSubscribeVideo;
                int publishMediaPlayerId = 0;
                status = napi_get_object_property_int32_(isolate, optionObj, "publishMediaPlayerId", publishMediaPlayerId);
                channelMediaOptions.publishMediaPlayerId = publishMediaPlayerId;
                bool enableAudioRecordingOrPlayout = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "enableAudioRecordingOrPlayout", enableAudioRecordingOrPlayout);
                channelMediaOptions.enableAudioRecordingOrPlayout = enableAudioRecordingOrPlayout;
                int clientRoleType = 2;
                status = napi_get_object_property_int32_(isolate, optionObj, "clientRoleType", clientRoleType);
                channelMediaOptions.clientRoleType = (CLIENT_ROLE_TYPE)clientRoleType;
                int defaultVideoStreamType = 0;
                status = napi_get_object_property_int32_(isolate, optionObj, "defaultVideoStreamType", defaultVideoStreamType);
                channelMediaOptions.defaultVideoStreamType = (VIDEO_STREAM_TYPE)defaultVideoStreamType;
                int channelProfile = 0;
                status = napi_get_object_property_int32_(isolate, optionObj, "channelProfile", channelProfile);
                channelMediaOptions.channelProfile = (CHANNEL_PROFILE_TYPE)channelProfile;

                result = pEngine->m_engine->joinChannel(token, channelId, uid, channelMediaOptions);

            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

       NAPI_API_DEFINE(NodeRtcEngine, updateChannelMediaOptions)
        {
            LOG_ENTER;
            int result = -1;
            do {
                Isolate *isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                ChannelMediaOptions channelMediaOptions;
                Local<Object> optionObj;
                status = napi_get_value_object_(isolate, args[0], optionObj);
                CHECK_NAPI_STATUS(pEngine, status);
                bool publishCameraTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishCameraTrack", publishCameraTrack);
                channelMediaOptions.publishCameraTrack = publishCameraTrack;
                bool publishAudioTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishAudioTrack", publishAudioTrack);
                channelMediaOptions.publishAudioTrack = publishAudioTrack;
                bool publishScreenTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishScreenTrack", publishScreenTrack);
                channelMediaOptions.publishScreenTrack = publishScreenTrack;
                bool publishCustomAudioTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishCustomAudioTrack", publishCustomAudioTrack);
                channelMediaOptions.publishCustomAudioTrack = publishCustomAudioTrack;
                bool publishCustomVideoTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishCustomVideoTrack", publishCustomVideoTrack);
                channelMediaOptions.publishCustomVideoTrack = publishCustomVideoTrack;
                bool publishEncodedVideoTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishEncodedVideoTrack", publishEncodedVideoTrack);
                channelMediaOptions.publishEncodedVideoTrack = publishEncodedVideoTrack;
                bool publishMediaPlayerAudioTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishMediaPlayerAudioTrack", publishMediaPlayerAudioTrack);
                channelMediaOptions.publishMediaPlayerAudioTrack = publishMediaPlayerAudioTrack;
                bool publishMediaPlayerVideoTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishMediaPlayerVideoTrack", publishMediaPlayerVideoTrack);
                channelMediaOptions.publishMediaPlayerVideoTrack = publishMediaPlayerVideoTrack;
                bool publishTrancodedVideoTrack = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "publishTrancodedVideoTrack", publishTrancodedVideoTrack);
                channelMediaOptions.publishTrancodedVideoTrack = publishTrancodedVideoTrack;
                bool autoSubscribeAudio = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "autoSubscribeAudio", autoSubscribeAudio);
                channelMediaOptions.autoSubscribeAudio = autoSubscribeAudio;
                bool autoSubscribeVideo = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "autoSubscribeVideo", autoSubscribeVideo);
                channelMediaOptions.autoSubscribeVideo = autoSubscribeVideo;
                int publishMediaPlayerId = 0;
                status = napi_get_object_property_int32_(isolate, optionObj, "publishMediaPlayerId", publishMediaPlayerId);
                channelMediaOptions.publishMediaPlayerId = publishMediaPlayerId;
                bool enableAudioRecordingOrPlayout = false;
                status = napi_get_object_property_bool_(isolate, optionObj, "enableAudioRecordingOrPlayout", enableAudioRecordingOrPlayout);
                channelMediaOptions.enableAudioRecordingOrPlayout = enableAudioRecordingOrPlayout;
                int clientRoleType = 2;
                status = napi_get_object_property_int32_(isolate, optionObj, "clientRoleType", clientRoleType);
                channelMediaOptions.clientRoleType = (CLIENT_ROLE_TYPE)clientRoleType;
                int defaultVideoStreamType = 0;
                status = napi_get_object_property_int32_(isolate, optionObj, "defaultVideoStreamType", defaultVideoStreamType);
                channelMediaOptions.defaultVideoStreamType = (VIDEO_STREAM_TYPE)defaultVideoStreamType;
                int channelProfile = 0;
                status = napi_get_object_property_int32_(isolate, optionObj, "channelProfile", channelProfile);
                channelMediaOptions.channelProfile = (CHANNEL_PROFILE_TYPE)channelProfile;

                unsigned int connectionId;
                status = napi_get_value_uint32_(args[1], connectionId);
                CHECK_NAPI_STATUS(pEngine, status);
                result = pEngine->m_engine->updateChannelMediaOptions(channelMediaOptions, connectionId);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, createMediaPlayer)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                Isolate* isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                nodestring channelName;
                napi_status status = napi_get_value_nodestring_(args[0], channelName);
                CHECK_NAPI_STATUS(pEngine, status);
                auto mediaPlayer = pEngine->m_engine->createMediaPlayer();

                // Prepare constructor template
                Local<Object> jsmediaPlayer = NodeMediaPlayer::Init(isolate, mediaPlayer);
                args.GetReturnValue().Set(jsmediaPlayer);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, startPrimaryCameraCapture)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                Isolate* isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[0], obj);
                CHECK_NAPI_STATUS(pEngine, status);
                CameraCapturerConfiguration config;
                int cameraDirection = 0;

                status = napi_get_object_property_int32_(isolate, obj, "cameraDirection", cameraDirection);
                CHECK_NAPI_STATUS(pEngine, status);

                nodestring deviceId;
                status = napi_get_object_property_nodestring_(isolate, obj, "deviceId", deviceId);
                CHECK_NAPI_STATUS(pEngine, status);

                Local<Object> videoFormatObj;
                VideoFormat format;
                napi_get_object_property_object_(isolate, obj, "format", videoFormatObj);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, videoFormatObj, "width", format.width);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, videoFormatObj, "height", format.height);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, videoFormatObj, "fps", format.fps);
                CHECK_NAPI_STATUS(pEngine, status);
                config.cameraDirection = (CAMERA_DIRECTION)cameraDirection;
                strcpy(config.deviceId, deviceId);
                config.format = format;
                result = pEngine->m_engine->startPrimaryCameraCapture(config);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, startSecondaryCameraCapture)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                Isolate* isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[0], obj);
                CHECK_NAPI_STATUS(pEngine, status);
                CameraCapturerConfiguration config;
                int cameraDirection = 0;

                status = napi_get_object_property_int32_(isolate, obj, "cameraDirection", cameraDirection);
                CHECK_NAPI_STATUS(pEngine, status);

                nodestring deviceId;
                status = napi_get_object_property_nodestring_(isolate, obj, "deviceId", deviceId);
                CHECK_NAPI_STATUS(pEngine, status);

                Local<Object> videoFormatObj;
                VideoFormat format;
                napi_get_object_property_object_(isolate, obj, "format", videoFormatObj);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, videoFormatObj, "width", format.width);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, videoFormatObj, "height", format.height);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, videoFormatObj, "fps", format.fps);
                CHECK_NAPI_STATUS(pEngine, status);
                config.cameraDirection = (CAMERA_DIRECTION)cameraDirection;
                strcpy(config.deviceId, deviceId);
                config.format = format;
                result = pEngine->m_engine->startSecondaryCameraCapture(config);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, stopPrimaryCameraCapture)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                Isolate* isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                result = pEngine->m_engine->stopPrimaryCameraCapture();
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, stopSecondaryCameraCapture)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                Isolate* isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                result = pEngine->m_engine->stopSecondaryCameraCapture();
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setCameraDeviceOrientation)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int type = 0;
                status = napi_get_value_int32_(args[0], type);
                CHECK_NAPI_STATUS(pEngine, status);
                int orientation = 0;
                status = napi_get_value_int32_(args[1], orientation);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->setCameraDeviceOrientation((MEDIA_SOURCE_TYPE)type, (VIDEO_ORIENTATION)orientation);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, startPrimaryScreenCapture)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            std::string key = "";
            do {
                Isolate* isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                ScreenCaptureConfiguration configuration;
                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[0], obj);
                CHECK_NAPI_STATUS(pEngine, status);
                key = "isCaptureWindow";
                status = napi_get_object_property_bool_(isolate, obj, key, configuration.isCaptureWindow);
                CHECK_NAPI_STATUS_STR(pEngine, status, key);
                key = "displayId";
                status = napi_get_object_property_uint32_(isolate, obj, key, configuration.displayId);

                Rectangle screenRect;
                Local<Object> screenRectObj;
                key = "screenRect";
                status = napi_get_object_property_object_(isolate, obj, key, screenRectObj);
                if (status == napi_ok) {
                    key = "x";
                    GET_OBJECT_PROPERTY_STR(screenRectObj, int32, key, screenRect.x);
                    key = "y";
                    GET_OBJECT_PROPERTY_STR(screenRectObj, int32, key, screenRect.y);
                    key = "width";
                    GET_OBJECT_PROPERTY_STR(screenRectObj, int32, key, screenRect.width);
                    key = "height";
                    GET_OBJECT_PROPERTY_STR(screenRectObj, int32, key, screenRect.height);

                    configuration.screenRect = screenRect;
                }

                unsigned int windowId;
                key = "windowId";
                status = napi_get_object_property_uint32_(isolate, obj, key, windowId);
                configuration.windowId = (view_t)windowId;

                ScreenCaptureParameters params;
                Local<Object> screenCaptureParameterObj;
                key = "params";
                status = napi_get_object_property_object_(isolate, obj, key, screenCaptureParameterObj);
                if (status == napi_ok) {
                    VideoDimensions dimensions;
                    key = "width";
                    status = napi_get_object_property_int32_(isolate, screenCaptureParameterObj, key, dimensions.width);
                    CHECK_NAPI_STATUS_STR(pEngine, status, key);
                    key = "height";
                    status = napi_get_object_property_int32_(isolate, screenCaptureParameterObj, key, dimensions.height);
                    CHECK_NAPI_STATUS_STR(pEngine, status, key);
                    key = "frameRate";
                    status = napi_get_object_property_int32_(isolate, screenCaptureParameterObj, key, params.frameRate);
                    CHECK_NAPI_STATUS_STR(pEngine, status, key);
                    key = "bitrate";
                    status = napi_get_object_property_int32_(isolate, screenCaptureParameterObj, key, params.bitrate);
                    CHECK_NAPI_STATUS_STR(pEngine, status, key);
                    params.dimensions = dimensions;
                    configuration.params = params;
                }

                Rectangle regionRect;
                Local<Object> regionRectObj;
                key = "regionRect";
                status = napi_get_object_property_object_(isolate, obj, key, regionRectObj);
                if (status == napi_ok) {
                    key = "x";
                    GET_OBJECT_PROPERTY_STR(regionRectObj, int32, key, regionRect.x);
                    key = "y";
                    GET_OBJECT_PROPERTY_STR(regionRectObj, int32, key, regionRect.y);
                    key = "width";
                    GET_OBJECT_PROPERTY_STR(regionRectObj, int32, key, regionRect.width);
                    key = "height";
                    GET_OBJECT_PROPERTY_STR(regionRectObj, int32, key, regionRect.height);
                    configuration.regionRect = regionRect;
                }

                result = pEngine->m_engine->startPrimaryScreenCapture(configuration);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, startSecondaryScreenCapture)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            std::string key = "";
            do {
                Isolate* isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                ScreenCaptureConfiguration configuration;
                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[0], obj);
                CHECK_NAPI_STATUS(pEngine, status);
                key = "isCaptureWindow";
                status = napi_get_object_property_bool_(isolate, obj, key, configuration.isCaptureWindow);
                CHECK_NAPI_STATUS_STR(pEngine, status, key);
                key = "displayId";
                status = napi_get_object_property_uint32_(isolate, obj, key, configuration.displayId);

                Rectangle screenRect;
                Local<Object> screenRectObj;
                key = "screenRect";
                LOG_F(INFO, "Step 1");
                status = napi_get_object_property_object_(isolate, obj, key, screenRectObj);
                if (status == napi_ok) {
                    key = "x";
                    GET_OBJECT_PROPERTY_STR(screenRectObj, int32, key, screenRect.x);
                    key = "y";
                    GET_OBJECT_PROPERTY_STR(screenRectObj, int32, key, screenRect.y);
                    key = "width";
                    GET_OBJECT_PROPERTY_STR(screenRectObj, int32, key, screenRect.width);
                    key = "height";
                    GET_OBJECT_PROPERTY_STR(screenRectObj, int32, key, screenRect.height);

                    configuration.screenRect = screenRect;
                }

                unsigned int windowId;
                key = "windowId";
                status = napi_get_object_property_uint32_(isolate, obj, key, windowId);
                configuration.windowId = (view_t)windowId;

                ScreenCaptureParameters params;
                Local<Object> screenCaptureParameterObj;
                key = "params";
                LOG_F(INFO, "Step 2");
                status = napi_get_object_property_object_(isolate, obj, key, screenCaptureParameterObj);
                if (status == napi_ok) {
                    VideoDimensions dimensions;
                    key = "width";
                    status = napi_get_object_property_int32_(isolate, screenCaptureParameterObj, key, dimensions.width);
                    CHECK_NAPI_STATUS_STR(pEngine, status, key);
                    key = "height";
                    status = napi_get_object_property_int32_(isolate, screenCaptureParameterObj, key, dimensions.height);
                    CHECK_NAPI_STATUS_STR(pEngine, status, key);
                    key = "frameRate";
                    status = napi_get_object_property_int32_(isolate, screenCaptureParameterObj, key, params.frameRate);
                    CHECK_NAPI_STATUS_STR(pEngine, status, key);
                    key = "bitrate";
                    status = napi_get_object_property_int32_(isolate, screenCaptureParameterObj, key, params.bitrate);
                    CHECK_NAPI_STATUS_STR(pEngine, status, key);
                    params.dimensions = dimensions;
                    configuration.params = params;
                }

                Rectangle regionRect;
                Local<Object> regionRectObj;
                key = "regionRect";
                LOG_F(INFO, "Step 3");
                status = napi_get_object_property_object_(isolate, obj, key, regionRectObj);
                if (status == napi_ok) {
                    key = "x";
                    GET_OBJECT_PROPERTY_STR(regionRectObj, int32, key, regionRect.x);
                    key = "y";
                    GET_OBJECT_PROPERTY_STR(regionRectObj, int32, key, regionRect.y);
                    key = "width";
                    GET_OBJECT_PROPERTY_STR(regionRectObj, int32, key, regionRect.width);
                    key = "height";
                    GET_OBJECT_PROPERTY_STR(regionRectObj, int32, key, regionRect.height);
                    configuration.regionRect = regionRect;
                }

                result = pEngine->m_engine->startSecondaryScreenCapture(configuration);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, stopPrimaryScreenCapture)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                Isolate* isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                result = pEngine->m_engine->stopPrimaryScreenCapture();
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, stopSecondaryScreenCapture)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                Isolate* isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                result = pEngine->m_engine->stopSecondaryScreenCapture();
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, enableEncryption)
        {
            LOG_ENTER;
            int result = -1;
            do {
                Isolate *isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                bool enabled;
                status = napi_get_value_bool_(args[0], enabled);
                CHECK_NAPI_STATUS(pEngine, status);

                int encryptionMode;
                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[1], obj);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_int32_(isolate, obj, "encryptionMode", encryptionMode);
                CHECK_NAPI_STATUS(pEngine, status);

                nodestring encryptionKey;
                status = napi_get_object_property_nodestring_(isolate, obj, "encryptionKey", encryptionKey);
                CHECK_NAPI_STATUS(pEngine, status);

                EncryptionConfig config;
                config.encryptionMode = (ENCRYPTION_MODE)encryptionMode;
                config.encryptionKey = encryptionKey;
                result = pEngine->m_engine->enableEncryption(enabled, config);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, enableExtension)
        {
            LOG_ENTER;
            int result = -1;
            std::string key = "";
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int type;
                nodestring id;
                bool enable;

                napi_status status = napi_get_value_int32_(args[0], type);
                status = napi_get_value_nodestring_(args[1], id);
                key = "id";
                CHECK_NAPI_STATUS_STR(pEngine, status, key);
                status = napi_get_value_bool_(args[2], enable);
                key = "enable";
                CHECK_NAPI_STATUS_STR(pEngine, status, key);

                result = pEngine->m_engine->enableExtension((MEDIA_SOURCE_TYPE)type, id, enable);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setExtensionProperty)
        {
            LOG_ENTER;
            int result = -1;
            std::string debugKey = "";
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int type;
                napi_status status = napi_get_value_int32_(args[0], type);

                nodestring id;
                status = napi_get_value_nodestring_(args[1], id);
                debugKey = "id";
                CHECK_NAPI_STATUS_STR(pEngine, status, debugKey);

                nodestring key;
                status = napi_get_value_nodestring_(args[2], key);
                debugKey = "key";
                CHECK_NAPI_STATUS_STR(pEngine, status, debugKey);

                nodestring json_value;
                status = napi_get_value_nodestring_(args[3], json_value);
                debugKey = "jsonValue";
                CHECK_NAPI_STATUS_STR(pEngine, status, debugKey);

                result = pEngine->m_engine->setExtensionProperty((MEDIA_SOURCE_TYPE)type, id, key, json_value);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setScreenCaptureOrientation)
        {
            LOG_ENTER;
            int result = -1;
            std::string debugKey = "";
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int type;
                napi_status status = napi_get_value_int32_(args[0], type);

                int orientation;
                status = napi_get_value_int32_(args[1], orientation);

                result = pEngine->m_engine->setScreenCaptureOrientation((MEDIA_SOURCE_TYPE)type, (VIDEO_ORIENTATION)orientation);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

    }
}

#if defined(_WIN32)
/*
 * '_cups_strlcpy()' - Safely copy two strings.
 */

size_t                   /* O - Length of string */
strlcpy(char *dst,       /* O - Destination string */
        const char *src, /* I - Source string */
        size_t size)     /* I - Size of destination string buffer */
{
    size_t srclen; /* Length of source string */

    /*
	* Figure out how much room is needed...
	*/
    size--;

    srclen = strlen(src);

    /*
	* Copy the appropriate amount...
	*/

    if (srclen > size)
        srclen = size;

    memcpy(dst, src, srclen);
    dst[srclen] = '\0';

    return (srclen);
}

#endif
