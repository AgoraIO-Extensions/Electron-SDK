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
#include "agora_video_source.h"
#include "node_napi_api.h"
#include <string>
#include <nan.h>

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
        DEFINE_CLASS(NodeRtcChannel);

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
                PROPERTY_METHOD_DEFINE(enableLastmileTest)
                PROPERTY_METHOD_DEFINE(disableLastmileTest)
                PROPERTY_METHOD_DEFINE(enableVideo)
                PROPERTY_METHOD_DEFINE(disableVideo)
                PROPERTY_METHOD_DEFINE(startPreview)
                PROPERTY_METHOD_DEFINE(stopPreview)
                PROPERTY_METHOD_DEFINE(setVideoProfile)
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
                PROPERTY_METHOD_DEFINE(setExternalAudioSink)
                PROPERTY_METHOD_DEFINE(setLocalPublishFallbackOption)
                PROPERTY_METHOD_DEFINE(setRemoteSubscribeFallbackOption)
                PROPERTY_METHOD_DEFINE(setInEarMonitoringVolume)
                PROPERTY_METHOD_DEFINE(setAudioProfile)
                PROPERTY_METHOD_DEFINE(pauseAudio)
                PROPERTY_METHOD_DEFINE(resumeAudio)
                PROPERTY_METHOD_DEFINE(setExternalAudioSource)
                PROPERTY_METHOD_DEFINE(getScreenWindowsInfo)
                PROPERTY_METHOD_DEFINE(getScreenDisplaysInfo)
                PROPERTY_METHOD_DEFINE(startScreenCapture)
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
                PROPERTY_METHOD_DEFINE(setHighQualityAudioParameters)
                PROPERTY_METHOD_DEFINE(enableWebSdkInteroperability)
                PROPERTY_METHOD_DEFINE(setVideoQualityParameters)
                PROPERTY_METHOD_DEFINE(enableLoopbackRecording)
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
                PROPERTY_METHOD_DEFINE(startScreenCapture2)
                PROPERTY_METHOD_DEFINE(stopScreenCapture2)
                PROPERTY_METHOD_DEFINE(videoSourceInitialize)
                PROPERTY_METHOD_DEFINE(videoSourceJoin)
                PROPERTY_METHOD_DEFINE(videoSourceLeave)
                PROPERTY_METHOD_DEFINE(videoSourceRenewToken)
                PROPERTY_METHOD_DEFINE(videoSourceSetChannelProfile)
                PROPERTY_METHOD_DEFINE(videoSourceSetVideoProfile)
                PROPERTY_METHOD_DEFINE(videoSourceRelease)
                PROPERTY_METHOD_DEFINE(videoSourceStartPreview)
                PROPERTY_METHOD_DEFINE(videoSourceStopPreview)
                PROPERTY_METHOD_DEFINE(videoSourceEnableWebSdkInteroperability)
                PROPERTY_METHOD_DEFINE(videoSourceEnableDualStreamMode)
                PROPERTY_METHOD_DEFINE(videoSourceSetLogFile)
                PROPERTY_METHOD_DEFINE(videoSourceSetParameter)
                PROPERTY_METHOD_DEFINE(videoSourceUpdateScreenCaptureRegion)
                PROPERTY_METHOD_DEFINE(videoSourceEnableLoopbackRecording)
                PROPERTY_METHOD_DEFINE(videoSourceEnableAudio)
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
                PROPERTY_METHOD_DEFINE(setProfile);
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
                PROPERTY_METHOD_DEFINE(setBeautyEffectOptions);
                PROPERTY_METHOD_DEFINE(setLocalVoiceChanger);
                PROPERTY_METHOD_DEFINE(setLocalVoiceReverbPreset);
                PROPERTY_METHOD_DEFINE(enableSoundPositionIndication);
                PROPERTY_METHOD_DEFINE(setRemoteVoicePosition);
                PROPERTY_METHOD_DEFINE(startLastmileProbeTest);
                PROPERTY_METHOD_DEFINE(stopLastmileProbeTest);
                PROPERTY_METHOD_DEFINE(setRemoteUserPriority);
                PROPERTY_METHOD_DEFINE(startEchoTestWithInterval);
                PROPERTY_METHOD_DEFINE(startAudioDeviceLoopbackTest);
                PROPERTY_METHOD_DEFINE(stopAudioDeviceLoopbackTest);
                PROPERTY_METHOD_DEFINE(setCameraCapturerConfiguration);
                PROPERTY_METHOD_DEFINE(setLogFileSize);
                PROPERTY_METHOD_DEFINE(videosourceStartScreenCaptureByScreen);
                PROPERTY_METHOD_DEFINE(videosourceStartScreenCaptureByWindow);
                PROPERTY_METHOD_DEFINE(videosourceUpdateScreenCaptureParameters);
                PROPERTY_METHOD_DEFINE(videosourceSetScreenCaptureContentHint);

                /**
                 * 2.8.0 Apis
                 */
                PROPERTY_METHOD_DEFINE(registerLocalUserAccount);
                PROPERTY_METHOD_DEFINE(joinChannelWithUserAccount);
                PROPERTY_METHOD_DEFINE(getUserInfoByUserAccount);
                PROPERTY_METHOD_DEFINE(getUserInfoByUid);

                /**
                 * 2.9.0 Apis
                 */
                PROPERTY_METHOD_DEFINE(switchChannel);
                PROPERTY_METHOD_DEFINE(startChannelMediaRelay);
                PROPERTY_METHOD_DEFINE(updateChannelMediaRelay);
                PROPERTY_METHOD_DEFINE(stopChannelMediaRelay);


                /**
                 * 2.9.0.100 Apis
                 */
                PROPERTY_METHOD_DEFINE(createChannel);
                PROPERTY_METHOD_DEFINE(startScreenCaptureByScreen);
                PROPERTY_METHOD_DEFINE(startScreenCaptureByWindow);
                PROPERTY_METHOD_DEFINE(updateScreenCaptureParameters);
                PROPERTY_METHOD_DEFINE(setScreenCaptureContentHint);

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
            m_externalVideoRenderFactory.reset(new NodeVideoRenderFactory(*this));
            /** Video/Audio Plugins */
            m_avPluginManager.reset(new IAVFramePluginManager());
            /** m_videoSourceSink provide facilities to multiple video source based on multiple process */
            m_videoSourceSink.reset(createVideoSource());
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
            m_videoSourceSink.reset(nullptr);
            m_externalVideoRenderFactory.reset(nullptr);
            m_eventHandler.reset(nullptr);
            m_avPluginManager.reset(nullptr);
            LOG_LEAVE;
        }

        void NodeRtcEngine::destroyVideoSource()
        {
            if (m_videoSourceSink.get())
                m_videoSourceSink->release();
        }

        NAPI_API_DEFINE_WRAPPER_PARAM_0(startEchoTest);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(stopEchoTest);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(enableLastmileTest);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(disableLastmileTest);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(enableVideo);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(disableVideo);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(startPreview);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(stopPreview);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(enableAudio);

        NAPI_API_DEFINE_WRAPPER_PARAM_0(disableAudio);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_0(stopAudioRecording);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_0(stopAudioMixing);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_0(pauseAudioMixing);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_0(resumeAudioMixing);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_0(pauseAudio);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_0(resumeAudio);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_0(getEffectsVolume);	

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(setEffectsVolume, int32);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_2(setVolumeOfEffect, int32, int32);	
        
        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_7(playEffect, int32, nodestring, int32, double, double, int32, bool);	
        
        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(stopEffect, int32);	
        
        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_0(stopAllEffects);	
        
        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_2(preloadEffect, int32, nodestring);	
        
        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(unloadEffect, int32);	
        
        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(pauseEffect, int32);	
        
        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_0(pauseAllEffects);	
        
        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(resumeEffect, int32);	
        
        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_0(resumeAllEffects);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(muteLocalAudioStream, bool);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(muteAllRemoteAudioStreams, bool);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(setDefaultMuteAllRemoteAudioStreams, bool);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(muteLocalVideoStream, bool);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(enableLocalVideo, bool);
        
        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(muteAllRemoteVideoStreams, bool);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(setDefaultMuteAllRemoteVideoStreams, bool);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(adjustAudioMixingVolume, int32);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(adjustAudioMixingPlayoutVolume, int32);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(adjustAudioMixingPublishVolume, int32);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(setAudioMixingPosition, int32);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(setLocalVoicePitch, double);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_3(setExternalAudioSink, bool, int32, int32);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(setInEarMonitoringVolume, int32);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(setLogFile, nodestring);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(setLogFilter, uint32);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(enableDualStreamMode, bool);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(adjustRecordingSignalVolume, int32);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(adjustPlaybackSignalVolume, int32);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(enableWebSdkInteroperability, bool);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(setVideoQualityParameters, bool);

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

        NAPI_API_DEFINE(NodeRtcEngine, removePublishStreamUrl)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring url;
                napi_status status = napi_get_value_nodestring_(args[0], url);
                CHECK_NAPI_STATUS(pEngine, status);
                result = pEngine->m_engine->removePublishStreamUrl(url);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }
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
                RtcImage vwm;

                Local<Object> vmwObj;
                status = napi_get_value_object_(isolate, args[1], vmwObj);
                CHECK_NAPI_STATUS(pEngine, status);
                
                status = napi_get_object_property_nodestring_(isolate, vmwObj, "url", url);
                CHECK_NAPI_STATUS(pEngine, status);
                vwm.url = url;

                status = napi_get_object_property_int32_(isolate, vmwObj, "x", vwm.x);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, vmwObj, "y", vwm.y);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, vmwObj, "width", vwm.width);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, vmwObj, "height", vwm.height);
                CHECK_NAPI_STATUS(pEngine, status);

                result = pEngine->m_engine->addVideoWatermark(vwm);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, clearVideoWatermarks)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                result = pEngine->m_engine->clearVideoWatermarks();
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setLiveTranscoding)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            TranscodingUser *users = nullptr;
            RtcImage* vwm = nullptr;
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
                status = napi_get_object_property_int32_(isolate, obj, "videoFramerate", transcoding.videoFramerate);
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
                
                status = napi_get_object_property_int32_(isolate, obj, "audioSampleRateType", audioSampleRateType);
                transcoding.audioSampleRate = (AUDIO_SAMPLE_RATE_TYPE)audioSampleRateType;
                CHECK_NAPI_STATUS(pEngine, status);
                
                status = napi_get_object_property_int32_(isolate, obj, "audioBitrate", transcoding.audioBitrate);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_int32_(isolate, obj, "audioChannels", transcoding.audioChannels);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_object_property_nodestring_(isolate, obj, "transcodingExtraInfo", transcodingExtraInfo);
                CHECK_NAPI_STATUS(pEngine, status);
                transcoding.transcodingExtraInfo = transcodingExtraInfo;

                RtcImage* wm = new RtcImage;

                Local<Name> keyName = Nan::New<String>("watermark").ToLocalChecked();
                Local<Value> wmValue = obj->Get(isolate->GetCurrentContext(), keyName).ToLocalChecked();
                if (!wmValue->IsNullOrUndefined()) {
                    Local<Object> objWm;
                    napi_get_value_object_(isolate, wmValue, objWm);
                    
                    nodestring wmurl;
                    status = napi_get_object_property_nodestring_(isolate, objWm, "url", wmurl);
                    CHECK_NAPI_STATUS(pEngine, status);
                    wm->url = wmurl;

                    status = napi_get_object_property_int32_(isolate, objWm, "x", wm->x);
                    CHECK_NAPI_STATUS(pEngine, status);

                    status = napi_get_object_property_int32_(isolate, objWm, "y", wm->y);
                    CHECK_NAPI_STATUS(pEngine, status);

                    status = napi_get_object_property_int32_(isolate, objWm, "width", wm->width);
                    CHECK_NAPI_STATUS(pEngine, status);
                    
                    status = napi_get_object_property_int32_(isolate, objWm, "height", wm->height);
                    CHECK_NAPI_STATUS(pEngine, status);
                    transcoding.watermark = wm;
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

        NAPI_API_DEFINE(NodeRtcEngine, removeInjectStreamUrl)
        {
            LOG_ENTER;
            int result = -1;
            napi_status status = napi_ok;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring url;
                status = napi_get_value_nodestring_(args[0], url);
                CHECK_NAPI_STATUS(pEngine, status);
                result = pEngine->m_engine->removeInjectStreamUrl(url);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setBeautyEffectOptions)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                Isolate *isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                bool enabled;
                status = napi_get_value_bool_(args[0], enabled);
                CHECK_NAPI_STATUS(pEngine, status);

                if(!args[1]->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pEngine, status);
                }
                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[1], obj);
                CHECK_NAPI_STATUS(pEngine, status);

                BeautyOptions opts;
                int contrast_value = 1;
                status = napi_get_object_property_int32_(isolate, obj, "lighteningContrastLevel", contrast_value);
                CHECK_NAPI_STATUS(pEngine, status);

                switch(contrast_value) {
                    case 0: 
                        opts.lighteningContrastLevel = BeautyOptions::LIGHTENING_CONTRAST_LOW;
                        break;
                    case 1:
                        opts.lighteningContrastLevel = BeautyOptions::LIGHTENING_CONTRAST_NORMAL;
                        break;
                    case 2:
                        opts.lighteningContrastLevel = BeautyOptions::LIGHTENING_CONTRAST_HIGH;
                        break;
                    default:
                        status = napi_invalid_arg;
                        break;
                }
                CHECK_NAPI_STATUS(pEngine, status);

                double lightening, smoothness, redness;
                status = napi_get_object_property_double_(isolate, obj, "lighteningLevel", lightening);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_double_(isolate, obj, "smoothnessLevel", smoothness);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_object_property_double_(isolate, obj, "rednessLevel", redness);
                CHECK_NAPI_STATUS(pEngine, status);
                opts.lighteningLevel = lightening;
                opts.smoothnessLevel = smoothness;
                opts.rednessLevel = redness;

                result = pEngine->m_engine->setBeautyEffectOptions(enabled, opts);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setLocalVoiceChanger)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                RtcEngineParameters param(pEngine->m_engine);

                VOICE_CHANGER_PRESET preset = VOICE_CHANGER_OFF;
                int preset_value = 0;
                status = napi_get_value_int32_(args[0], preset_value);
                CHECK_NAPI_STATUS(pEngine, status);

                switch(preset_value) {
                    case 0:
                        preset = VOICE_CHANGER_OFF;
                        break;
                    case 1:
                        preset = VOICE_CHANGER_OLDMAN;
                        break;
                    case 2:
                        preset = VOICE_CHANGER_BABYBOY;
                        break;
                    case 3:
                        preset = VOICE_CHANGER_BABYGIRL;
                        break;
                    case 4:
                        preset = VOICE_CHANGER_ZHUBAJIE;
                        break;
                    case 5:
                        preset = VOICE_CHANGER_ETHEREAL;
                        break;
                    case 6:
                        preset = VOICE_CHANGER_HULK;
                        break;
                    default:
                        status = napi_invalid_arg;
                        break;
                }
                CHECK_NAPI_STATUS(pEngine, status);

                result = param.setLocalVoiceChanger(preset);
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
                RtcEngineParameters param(pEngine->m_engine);

                AUDIO_REVERB_PRESET preset = AUDIO_REVERB_OFF;
                int preset_value = 0;
                status = napi_get_value_int32_(args[0], preset_value);
                CHECK_NAPI_STATUS(pEngine, status);

                switch(preset_value) {
                    case 0:
                        preset = AUDIO_REVERB_OFF;
                        break;
                    case 1:
                        preset = AUDIO_REVERB_POPULAR;
                        break;
                    case 2:
                        preset = AUDIO_REVERB_RNB;
                        break;
                    case 3:
                        preset = AUDIO_REVERB_ROCK;
                        break;
                    case 4:
                        preset = AUDIO_REVERB_HIPHOP;
                        break;
                    case 5:
                        preset = AUDIO_REVERB_VOCAL_CONCERT;
                        break;
                    case 6:
                        preset = AUDIO_REVERB_KTV;
                        break;
                    case 7:
                        preset = AUDIO_REVERB_STUDIO;
                        break;
                    default:
                        status = napi_invalid_arg;
                        break;
                }
                CHECK_NAPI_STATUS(pEngine, status);

                result = param.setLocalVoiceReverbPreset(preset);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, enableSoundPositionIndication)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                RtcEngineParameters param(pEngine->m_engine);

                bool enabled;
                status = napi_get_value_bool_(args[0], enabled);

                result = param.enableSoundPositionIndication(enabled);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setRemoteVoicePosition)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                RtcEngineParameters param(pEngine->m_engine);

                uid_t uid;
                double pan = 0, gain = 0;

                status = NodeUid::getUidFromNodeValue(args[0], uid);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_value_double_(args[1], pan);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_value_double_(args[2], gain);
                CHECK_NAPI_STATUS(pEngine, status);

                result = param.setRemoteVoicePosition(uid, pan, gain);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

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

        NAPI_API_DEFINE(NodeRtcEngine, startEchoTestWithInterval)
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

                result = pEngine->m_engine->startEchoTest(interval);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, startAudioDeviceLoopbackTest)
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
                result = adm->startAudioDeviceLoopbackTest(interval);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, stopAudioDeviceLoopbackTest)
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
                result = adm->stopAudioDeviceLoopbackTest();
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setCameraCapturerConfiguration)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                Isolate *isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                RtcEngineParameters param(pEngine->m_engine);

                if(!args[0]->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pEngine, status);
                }

                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[0], obj);
                CHECK_NAPI_STATUS(pEngine, status);
                CameraCapturerConfiguration config;
                int preference = 0;
                
                status = napi_get_object_property_int32_(isolate, obj, "preference", preference);
                CHECK_NAPI_STATUS(pEngine, status);

                switch(preference) {
                    case 0: 
                        config.preference = CAPTURER_OUTPUT_PREFERENCE_AUTO;
                        break;
                    case 1: 
                        config.preference = CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE;
                        break;
                    case 2: 
                        config.preference = CAPTURER_OUTPUT_PREFERENCE_PREVIEW;
                        break;
                    default:
                        status = napi_invalid_arg;
                        break;
                }
                CHECK_NAPI_STATUS(pEngine, status);

                result = param.setCameraCapturerConfiguration(config);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

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
                RtcEngineParameters param(pEngine->m_engine);
                
                unsigned int size;
                status = napi_get_value_uint32_(args[0], size);
                CHECK_NAPI_STATUS(pEngine, status);

                result = param.setLogFileSize(size);
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
                AParameter param(pEngine->m_engine);
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
                AParameter param(pEngine->m_engine);
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
                AParameter param(pEngine->m_engine);
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
                AParameter param(pEngine->m_engine);
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
                AParameter param(pEngine->m_engine);
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
                AParameter param(pEngine->m_engine);
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
                AParameter param(pEngine->m_engine);
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
                AParameter param(pEngine->m_engine);
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
                AParameter param(pEngine->m_engine);
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
                AParameter param(pEngine->m_engine);
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
                AParameter param(pEngine->m_engine);
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
                AParameter param(pEngine->m_engine);
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
                AParameter param(pEngine->m_engine);
                param->getArray(key, value);
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
                AParameter ap(pEngine->m_engine);
                result = ap->setParameters(param);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setProfile)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring profile;
                bool merge;
                status = napi_get_value_nodestring_(args[0], profile);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_bool_(args[1], merge);
                CHECK_NAPI_STATUS(pEngine, status);
                AParameter param(pEngine->m_engine);
                result = param->setProfile(profile, merge);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

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
                AParameter param(pEngine->m_engine);
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
                RtcEngineParameters param(pEngine->m_engine);
                int sampleRate, channels;
                bool enabled;
                status = napi_get_value_bool_(args[0], enabled);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_int32_(args[1], sampleRate);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_int32_(args[2], channels);
                CHECK_NAPI_STATUS(pEngine, status);
                result = param.setExternalAudioSource(enabled, sampleRate, channels);
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
                RtcEngineParameters param(pEngine->m_engine);
                result = param.setLocalVideoMirrorMode((agora::rtc::VIDEO_MIRROR_MODE_TYPE)mirrorType);
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
                if (!args[1]->IsNull()) {
                    status = napi_get_value_nodestring_(args[1], deviceName);
                    CHECK_NAPI_STATUS(pEngine, status);
                    RtcEngineParameters param(pEngine->m_engine);
                    result = param.enableLoopbackRecording(enable, deviceName);
                } else {
                    RtcEngineParameters param(pEngine->m_engine);
                    result = param.enableLoopbackRecording(enable);
                }

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
                RtcEngineParameters param(pEngine->m_engine);
                int32 bandFrequency, bandGain;
                status = napi_get_value_int32_(args[0], bandFrequency);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_int32_(args[1], bandGain);
                CHECK_NAPI_STATUS(pEngine, status);
                result = param.setLocalVoiceEqualization((AUDIO_EQUALIZATION_BAND_FREQUENCY)bandFrequency, bandGain);
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
                RtcEngineParameters param(pEngine->m_engine);
                int32 reverbKey, value;
                status = napi_get_value_int32_(args[0], reverbKey);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_int32_(args[1], value);
                CHECK_NAPI_STATUS(pEngine, status);
                result = param.setLocalVoiceReverb((AUDIO_REVERB_TYPE)reverbKey, value);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setLocalPublishFallbackOption)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                RtcEngineParameters param(pEngine->m_engine);
                int32 option;
                status = napi_get_value_int32_(args[0], option);
                CHECK_NAPI_STATUS(pEngine, status);
                result = param.setLocalPublishFallbackOption((STREAM_FALLBACK_OPTIONS)option);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setRemoteSubscribeFallbackOption)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                RtcEngineParameters param(pEngine->m_engine);
                int32 option;
                status = napi_get_value_int32_(args[0], option);
                CHECK_NAPI_STATUS(pEngine, status);
                result = param.setRemoteSubscribeFallbackOption((STREAM_FALLBACK_OPTIONS)option);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceInitialize)
        {
            LOG_ENTER;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                NodeString appid;
                napi_status status = napi_get_value_nodestring_(args[0], appid);
                CHECK_NAPI_STATUS(pEngine, status);
                if (!pEngine->m_videoSourceSink.get() || !pEngine->m_videoSourceSink->initialize(pEngine->m_eventHandler.get(), appid)) {
                    break;
                }
                result = 0;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceJoin)
        {
            LOG_ENTER;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                NodeString key, name, chan_info;
                uid_t uid;
                napi_status status = napi_get_value_nodestring_(args[0], key);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_value_nodestring_(args[1], name);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_value_nodestring_(args[2], chan_info);
                CHECK_NAPI_STATUS(pEngine, status);

                status = NodeUid::getUidFromNodeValue(args[3], uid);
                CHECK_NAPI_STATUS(pEngine, status);
                if (pEngine->m_videoSourceSink.get()){
                    pEngine->m_videoSourceSink->join(key, name, chan_info, uid);
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceLeave)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                if (pEngine->m_videoSourceSink.get()) {
                    pEngine->m_videoSourceSink->leave();
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceRenewToken)
        {
            LOG_ENTER;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                NodeString token;
                napi_status status = napi_get_value_nodestring_(args[0], token);
                CHECK_NAPI_STATUS(pEngine, status);
                if (pEngine->m_videoSourceSink.get()) {
                    pEngine->m_videoSourceSink->renewVideoSourceToken(token);
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceSetChannelProfile)
        {
            LOG_ENTER;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int profile;
                NodeString permissionKey;
                napi_status status = napi_get_value_int32_(args[0], profile);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_value_nodestring_(args[1], permissionKey);
                CHECK_NAPI_STATUS(pEngine, status);

                if (pEngine->m_videoSourceSink.get()) {
                    pEngine->m_videoSourceSink->setVideoSourceChannelProfile((agora::rtc::CHANNEL_PROFILE_TYPE)profile, permissionKey);
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceSetVideoProfile)
        {
            LOG_ENTER;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int profile;
                bool swapWidthAndHeight;
                napi_status status = napi_get_value_int32_(args[0], profile);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_bool_(args[1], swapWidthAndHeight);
                CHECK_NAPI_STATUS(pEngine, status);
                if (pEngine->m_videoSourceSink.get()) {
                    pEngine->m_videoSourceSink->setVideoSourceVideoProfile((agora::rtc::VIDEO_PROFILE_TYPE)profile, swapWidthAndHeight);
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, startScreenCapture2)
        {
            LOG_ENTER;
            int result = -1;
            napi_status status = napi_ok;
            do{
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                uint32_t captureFreq, bitrate;
                int top, left, bottom, right;

#if defined(__APPLE__)
                unsigned int windowId;
                status = napi_get_value_uint32_(args[0], windowId);
                CHECK_NAPI_STATUS(pEngine, status);
#elif defined(_WIN32)
#if defined(_WIN64)
                int64_t wid;
                status = napi_get_value_int64_(args[0], wid);
#else
                uint32_t wid;
                status = napi_get_value_uint32_(args[0], wid);
#endif

                CHECK_NAPI_STATUS(pEngine, status);
                HWND windowId = (HWND)wid;
#endif
                status = napi_get_value_uint32_(args[1], captureFreq);
                CHECK_NAPI_STATUS(pEngine, status);

                Local<Object> rect;
                status = napi_get_value_object_(isolate, args[2], rect);
                CHECK_NAPI_STATUS(pEngine, status);
                Local<Name> topKey = String::NewFromUtf8(args.GetIsolate(), "top", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> topValue = rect->Get(args.GetIsolate()->GetCurrentContext(), topKey).ToLocalChecked();
                top = topValue->Int32Value(args.GetIsolate()->GetCurrentContext()).ToChecked();
                Local<Name> leftKey = String::NewFromUtf8(args.GetIsolate(), "left", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> leftValue = rect->Get(args.GetIsolate()->GetCurrentContext(), leftKey).ToLocalChecked();
                left = leftValue->Int32Value();

                Local<Name> bottomKey = String::NewFromUtf8(args.GetIsolate(), "bottom", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> bottomValue = rect->Get(args.GetIsolate()->GetCurrentContext(), bottomKey).ToLocalChecked();
                bottom = bottomValue->Int32Value();

                Local<Name> rightKey = String::NewFromUtf8(args.GetIsolate(), "right", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> rightValue = rect->Get(args.GetIsolate()->GetCurrentContext(), rightKey).ToLocalChecked();
                right = rightValue->Int32Value();

                status = napi_get_value_uint32_(args[3], bitrate);
                CHECK_NAPI_STATUS(pEngine, status);
                Rect region(top, left, bottom, right);
               
                if (pEngine->m_videoSourceSink.get()) {
                    pEngine->m_videoSourceSink->captureScreen(windowId, captureFreq, &region, bitrate);
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, stopScreenCapture2)
        {
            LOG_ENTER;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                if (pEngine->m_videoSourceSink.get()) {
                    pEngine->m_videoSourceSink->stopCaptureScreen();
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceSetLogFile)
        {
            LOG_ENTER;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                NodeString file;
                napi_status status = napi_get_value_nodestring_(args[0], file);
                CHECK_NAPI_STATUS(pEngine, status);
                if (pEngine->m_videoSourceSink.get()) {
                    pEngine->m_videoSourceSink->setLogFile(file);
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceRelease)
        {
            LOG_ENTER;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                if (pEngine->m_videoSourceSink.get()) {
                    pEngine->m_videoSourceSink->release();
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceStartPreview)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                if (pEngine->m_videoSourceSink.get()) {
                    pEngine->m_videoSourceSink->startPreview();
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceStopPreview)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                if (pEngine->m_videoSourceSink.get()) {
                    pEngine->m_videoSourceSink->stopPreview();
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }
        
        NAPI_API_DEFINE(NodeRtcEngine, videoSourceEnableWebSdkInteroperability)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                
                bool enabled;
                napi_status status = napi_ok;
                status = napi_get_value_bool_(args[0], enabled);
                CHECK_NAPI_STATUS(pEngine, status);
                
                if(pEngine->m_videoSourceSink.get()) {
                    pEngine->m_videoSourceSink->enableWebSdkInteroperability(enabled);
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceEnableDualStreamMode)
        {
            LOG_ENTER;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                bool enable;
                napi_status status = napi_get_value_bool_(args[0], enable);
                CHECK_NAPI_STATUS(pEngine, status);
                if (!pEngine->m_videoSourceSink.get() || !pEngine->m_videoSourceSink->enableDualStreamMode(enable)) {
                    break;
                }

                result = 0;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceSetParameter)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                
                nodestring param;
                napi_status status = napi_ok;
                status = napi_get_value_nodestring_(args[0], param);
                CHECK_NAPI_STATUS(pEngine, status);
                if(pEngine->m_videoSourceSink.get()) {
                    pEngine->m_videoSourceSink->setParameters(param);
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceUpdateScreenCaptureRegion)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                Isolate *isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                int top, left, bottom, right;
                Local<Object> rect;
                napi_status status = napi_get_value_object_(isolate, args[0], rect);
                CHECK_NAPI_STATUS(pEngine, status);
                Local<Name> topKey = String::NewFromUtf8(args.GetIsolate(), "top", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> topValue = rect->Get(args.GetIsolate()->GetCurrentContext(), topKey).ToLocalChecked();
                top = topValue->Int32Value();

                Local<Name> leftKey = String::NewFromUtf8(args.GetIsolate(), "left", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> leftValue = rect->Get(args.GetIsolate()->GetCurrentContext(), leftKey).ToLocalChecked();
                left = leftValue->Int32Value();

                Local<Name> bottomKey = String::NewFromUtf8(args.GetIsolate(), "bottom", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> bottomValue = rect->Get(args.GetIsolate()->GetCurrentContext(), bottomKey).ToLocalChecked();
                bottom = bottomValue->Int32Value();

                Local<Name> rightKey = String::NewFromUtf8(args.GetIsolate(), "right", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> rightValue = rect->Get(args.GetIsolate()->GetCurrentContext(), rightKey).ToLocalChecked();
                right = rightValue->Int32Value();
                Rect region(top, left, bottom, right);
                if(pEngine->m_videoSourceSink.get()) {
                    pEngine->m_videoSourceSink->updateScreenCapture(&region);
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }


        NAPI_API_DEFINE(NodeRtcEngine, videosourceStartScreenCaptureByScreen)
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
                captureParams.dimensions = dimensions;

                if (pEngine->m_videoSourceSink.get()) {
                    pEngine->m_videoSourceSink->startScreenCaptureByScreen(screen, regionRect, captureParams);
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videosourceStartScreenCaptureByWindow)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do{
                Isolate *isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                agora::rtc::IRtcEngine::WindowIDType windowId;
                // screenId
#if defined(__APPLE__)
                status = napi_get_value_uint32_(args[0], windowId);
                CHECK_NAPI_STATUS(pEngine, status);
#elif defined(_WIN32)
#if defined(_WIN64)
                int64_t wid;
                status = napi_get_value_int64_(args[0], wid);
#else
                uint32_t wid;
                status = napi_get_value_uint32_(args[0], wid);
#endif

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
                captureParams.dimensions = dimensions;

                if (pEngine->m_videoSourceSink.get()) {
                    pEngine->m_videoSourceSink->startScreenCaptureByWindow(windowId, regionRect, captureParams);
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videosourceUpdateScreenCaptureParameters)
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
                captureParams.dimensions = dimensions;

                if (pEngine->m_videoSourceSink.get()) {
                    pEngine->m_videoSourceSink->updateScreenCaptureParameters(captureParams);
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videosourceSetScreenCaptureContentHint)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                VideoContentHint hint;
                int value = 0;
                napi_get_value_int32_(args[0], value);
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

                if (pEngine->m_videoSourceSink.get()) {
                    pEngine->m_videoSourceSink->setScreenCaptureContentHint(hint);
                    result = 0;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceEnableLoopbackRecording)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                if (pEngine->m_videoSourceSink.get()) {
                    bool enable;
                    napi_status status = napi_get_value_bool_(args[0], enable);
                    CHECK_NAPI_STATUS(pEngine, status);
                    
                    nodestring deviceName;
                    status = napi_get_value_nodestring_(args[1], deviceName);
                    CHECK_NAPI_STATUS(pEngine, status);
                    
                    if(deviceName == NULL) {
                        pEngine->m_videoSourceSink->enableLoopbackRecording(enable, NULL);
                        result = 0;
                    } else {
                        string mDeviceName(deviceName);
                        pEngine->m_videoSourceSink->enableLoopbackRecording(enable, mDeviceName.c_str());
                        result = 0;
                    }
                    
                }
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceEnableAudio)
        {
            LOG_ENTER;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                if (!pEngine->m_videoSourceSink.get() || pEngine->m_videoSourceSink->enableAudio() != node_ok) {
                    break;
                }
                result = 0;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

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
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                NodeString appid;
                napi_status status = napi_get_value_nodestring_(args[0], appid);
                CHECK_NAPI_STATUS(pEngine, status);
                RtcEngineContext context;
                context.eventHandler = pEngine->m_eventHandler.get();
                context.appId = appid;
                int suc = pEngine->m_engine->initialize(context);
                if (0 != suc) {
                    LOG_ERROR("Rtc engine initialize failed with error :%d\n", suc);
                    break;
                }
                agora::util::AutoPtr<agora::media::IMediaEngine> pMediaEngine;
                pMediaEngine.queryInterface(pEngine->m_engine, AGORA_IID_MEDIA_ENGINE);
                if (pMediaEngine) {
                    pMediaEngine->registerVideoRenderFactory(pEngine->m_externalVideoRenderFactory.get());
                }
                pEngine->m_engine->enableVideo();
                RtcEngineParameters rep(pEngine->m_engine);
                rep.enableLocalVideo(true);
                result = 0;
            } while (false);
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

        NAPI_API_DEFINE(NodeRtcEngine, switchChannel)
        {
            LOG_ENTER;
            int result = -1;
            NodeString key, name;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status = napi_get_value_nodestring_(args[0], key);
                CHECK_NAPI_STATUS(pEngine, status);
                
                status = napi_get_value_nodestring_(args[1], name);
                CHECK_NAPI_STATUS(pEngine, status);
               
                result = pEngine->m_engine->switchChannel(key, name);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

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

        NAPI_API_DEFINE(NodeRtcEngine, setVideoProfile)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status = napi_ok;
                unsigned int profile;
                bool swapWandH;
                napi_get_param_2(args, uint32, profile, bool, swapWandH);
                CHECK_NAPI_STATUS(pEngine, status);
                result = pEngine->m_engine->setVideoProfile(VIDEO_PROFILE_TYPE(profile), swapWandH);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

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
                status = napi_get_object_property_int32_(isolate, obj, "minFrameRate", config.minFrameRate);
                CHECK_NAPI_STATUS(pEngine, status);

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

                result = pEngine->m_engine->setAudioProfile(AUDIO_PROFILE_TYPE(profile), AUDIO_SCENARIO_TYPE(scenario));
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
                status = NodeUid::getUidFromNodeValue(args[0], uid);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_bool_(args[1], mute);
                CHECK_NAPI_STATUS(pEngine, status);

                RtcEngineParameters rep(pEngine->m_engine);
                result = rep.muteRemoteAudioStream(uid, mute);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, subscribe)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                uid_t uid;
                nodestring channel;
                status = napi_get_value_uid_t_(args[0], uid);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_value_nodestring_(args[1], channel);
                CHECK_NAPI_STATUS(pEngine, status);
                
                auto context = new NodeRenderContext(NODE_RENDER_TYPE_REMOTE, uid);
                if(!context) {
                    LOG_ERROR("Failed to allocate NodeRenderContext\n");
                    break;
                }
                VideoCanvas canvas;
                canvas.uid = uid;
                canvas.renderMode = RENDER_MODE_HIDDEN;
                canvas.view = (view_t)context;
                if(channel) {
                    strlcpy(canvas.channelId, channel, agora::rtc::MAX_CHANNEL_ID_LENGTH);
                }
                pEngine->m_engine->setupRemoteVideo(canvas);
                result = 0;
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
                uid_t uid;
                nodestring channel;
                status = napi_get_value_uid_t_(args[0], uid);
                CHECK_NAPI_STATUS(pEngine, status);

                status = napi_get_value_nodestring_(args[1], channel);
                CHECK_NAPI_STATUS(pEngine, status);
                VideoCanvas canvas;
                canvas.uid = uid;
                if(channel) {
                    strlcpy(canvas.channelId, channel, agora::rtc::MAX_CHANNEL_ID_LENGTH);
                }
                pEngine->m_engine->setupRemoteVideo(canvas);
                result = 0;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setupLocalVideo)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                auto context = new NodeRenderContext(NODE_RENDER_TYPE_LOCAL);
                VideoCanvas canvas;
                canvas.uid = 0;
                canvas.renderMode = RENDER_MODE_HIDDEN;
                canvas.view = (view_t)context;
                pEngine->m_engine->setupLocalVideo(canvas);
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
                agora::rtc::uid_t uid;
                napi_status status = napi_ok;
                status = napi_get_value_int32_(args[0], renderType);
                CHECK_NAPI_STATUS(pEngine, status);
                if(renderType < NODE_RENDER_TYPE_LOCAL || renderType > NODE_RENDER_TYPE_VIDEO_SOURCE) {
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
                
                auto *pTransporter = getNodeVideoFrameTransporter();
                if (pTransporter) {
                    pTransporter->setVideoDimension(type, uid, width, height);
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
                auto pTransporter = getNodeVideoFrameTransporter();
                if(pTransporter) {
                    pTransporter->addToHighVideo(uid);
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
                auto pTransporter = getNodeVideoFrameTransporter();
                if(pTransporter) {
                    pTransporter->removeFromeHighVideo(uid);
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
                    pEngine->m_engine->release();
                    pEngine->m_engine = nullptr;
                }
                if (pEngine->m_videoSourceSink.get()) {
                    pEngine->m_videoSourceSink->release();
                }
                pEngine->m_videoSourceSink.reset(nullptr);
                pEngine->m_externalVideoRenderFactory.reset(nullptr);
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
                status = NodeUid::getUidFromNodeValue(args[0], uid);
                CHECK_NAPI_STATUS(pEngine, status);
                status = napi_get_value_bool_(args[1], mute);
                CHECK_NAPI_STATUS(pEngine, status);

                RtcEngineParameters rep(pEngine->m_engine);
                result = rep.muteRemoteVideoStream(uid, mute);
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

                RtcEngineParameters rep(pEngine->m_engine);
                result = rep.setRemoteVideoStreamType(uid, REMOTE_VIDEO_STREAM_TYPE(streamType));
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

                RtcEngineParameters rep(pEngine->m_engine);
                result = rep.setRemoteDefaultVideoStreamType(REMOTE_VIDEO_STREAM_TYPE(streamType));
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, enableAudioVolumeIndication)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                int interval, smooth;
                bool report_vad;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_get_param_3(args, int32, interval, int32, smooth, bool, report_vad);
                CHECK_NAPI_STATUS(pEngine, status);

                RtcEngineParameters rep(pEngine->m_engine);
                result = rep.enableAudioVolumeIndication(interval, smooth, report_vad);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

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

                status = napi_get_value_nodestring_(args[0], filePath);
                CHECK_NAPI_STATUS(pEngine, status);
                int quality;
                status = napi_get_value_int32_(args[1], quality);
                RtcEngineParameters rep(pEngine->m_engine);
                result = rep.startAudioRecording(filePath, AUDIO_RECORDING_QUALITY_TYPE(quality));
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
                RtcEngineParameters rep(pEngine->m_engine);
                result = rep.startAudioMixing(filepath, loopback, replace, cycle);
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

                RtcEngineParameters rep(pEngine->m_engine);
                int duration = rep.getAudioMixingDuration();
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

                RtcEngineParameters rep(pEngine->m_engine);
                int position = rep.getAudioMixingCurrentPosition();
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

                RtcEngineParameters rep(pEngine->m_engine);
                int volume = rep.getAudioMixingPlayoutVolume();
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

                RtcEngineParameters rep(pEngine->m_engine);
                int volume = rep.getAudioMixingPublishVolume();
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

                RtcEngineParameters rep(pEngine->m_engine);
                result = rep.setRecordingAudioFrameParameters(sampleRate, channel, RAW_AUDIO_FRAME_OP_MODE_TYPE(mode), samplesPerCall);
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

                RtcEngineParameters rep(pEngine->m_engine);
                result = rep.setPlaybackAudioFrameParameters(sampleRate, channel, RAW_AUDIO_FRAME_OP_MODE_TYPE(mode), samplesPerCall);
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
                int sampleRate, samplesPerCall;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_get_param_2(args, int32, sampleRate, int32, samplesPerCall);
                CHECK_NAPI_STATUS(pEngine, status);

                RtcEngineParameters rep(pEngine->m_engine);
                result = rep.setMixedAudioFrameParameters(sampleRate, samplesPerCall);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setHighQualityAudioParameters)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                bool fullband, stereo, fullBitrate;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_get_param_3(args, bool, fullband, bool, stereo, bool, fullBitrate);
                CHECK_NAPI_STATUS(pEngine, status);

                RtcEngineParameters rep(pEngine->m_engine);
                result = rep.setHighQualityAudioParameters(fullband, stereo, fullBitrate);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }
#if defined(__APPLE__) || defined(_WIN32)
        NAPI_API_DEFINE(NodeRtcEngine, startScreenCapture)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                int captureFreq, bitrate;
                int top, left, bottom, right;

#if defined(__APPLE__)
                unsigned int windowId;
                status = napi_get_value_uint32_(args[0], windowId);
                CHECK_NAPI_STATUS(pEngine, status);
#elif defined(_WIN32)
#if defined(_WIN64)
                int64_t wid;
                status = napi_get_value_int64_(args[0], wid);
#else
                int32_t wid;
                status = napi_get_value_int32_(args[0], wid);
#endif

                CHECK_NAPI_STATUS(pEngine, status);
                HWND windowId = (HWND)wid;
#endif
                status = napi_get_value_int32_(args[1], captureFreq);
                CHECK_NAPI_STATUS(pEngine, status);
                
                Local<Object> rect;
                status = napi_get_value_object_(isolate, args[2], rect);
                CHECK_NAPI_STATUS(pEngine, status);
                Local<Name> topKey = String::NewFromUtf8(args.GetIsolate(), "top", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> topValue = rect->Get(args.GetIsolate()->GetCurrentContext(), topKey).ToLocalChecked();
                top = topValue->Int32Value();

                Local<Name> leftKey = String::NewFromUtf8(args.GetIsolate(), "left", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> leftValue = rect->Get(args.GetIsolate()->GetCurrentContext(), leftKey).ToLocalChecked();
                left = leftValue->Int32Value();

                Local<Name> bottomKey = String::NewFromUtf8(args.GetIsolate(), "bottom", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> bottomValue = rect->Get(args.GetIsolate()->GetCurrentContext(), bottomKey).ToLocalChecked();
                bottom = bottomValue->Int32Value();

                Local<Name> rightKey = String::NewFromUtf8(args.GetIsolate(), "right", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> rightValue = rect->Get(args.GetIsolate()->GetCurrentContext(), rightKey).ToLocalChecked();
                right = rightValue->Int32Value();

                status = napi_get_value_int32_(args[3], bitrate);
                CHECK_NAPI_STATUS(pEngine, status);

                Rect region(top, left, bottom, right);
                result = pEngine->m_engine->startScreenCapture(windowId, captureFreq, &region, bitrate);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

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

                int top, left, bottom, right; 
                Local<Object> rect;
                napi_status status = napi_get_value_object_(isolate, args[0], rect);
                CHECK_NAPI_STATUS(pEngine, status);
                Local<Name> topKey = String::NewFromUtf8(args.GetIsolate(), "top", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> topValue = rect->Get(args.GetIsolate()->GetCurrentContext(), topKey).ToLocalChecked();
                top = topValue->Int32Value();

                Local<Name> leftKey = String::NewFromUtf8(args.GetIsolate(), "left", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> leftValue = rect->Get(args.GetIsolate()->GetCurrentContext(), leftKey).ToLocalChecked();
                left = leftValue->Int32Value();

                Local<Name> bottomKey = String::NewFromUtf8(args.GetIsolate(), "bottom", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> bottomValue = rect->Get(args.GetIsolate()->GetCurrentContext(), bottomKey).ToLocalChecked();
                bottom = bottomValue->Int32Value();

                Local<Name> rightKey = String::NewFromUtf8(args.GetIsolate(), "right", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> rightValue = rect->Get(args.GetIsolate()->GetCurrentContext(), rightKey).ToLocalChecked();
                right = rightValue->Int32Value();
                Rect region(top, left, bottom, right);

                result = pEngine->m_engine->updateScreenCaptureRegion(&region);
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
                auto context = new NodeRenderContext(NODE_RENDER_TYPE_DEVICE_TEST);
                
                if (!pEngine->m_videoVdm) {
                    pEngine->m_videoVdm = new AVideoDeviceManager(pEngine->m_engine);
                }
                IVideoDeviceManager* vdm = pEngine->m_videoVdm->get();
                result = vdm ? vdm->startDeviceTest(context) : -1;
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
                pEngine->getRtcEngine()->queryInterface(agora::AGORA_IID_MEDIA_ENGINE, (void**)&pMediaEngine);
                if (pEngine->m_avPluginManager.get())
                {
                    pMediaEngine->registerVideoFrameObserver(pEngine->m_avPluginManager.get());
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
                pEngine->getRtcEngine()->queryInterface(agora::AGORA_IID_MEDIA_ENGINE, (void**)&pMediaEngine);
                pMediaEngine->registerVideoFrameObserver(NULL);
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

        NAPI_API_DEFINE(NodeRtcEngine, registerLocalUserAccount)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                NodeString appId, userAccount;

                napi_status status = napi_get_value_nodestring_(args[0], appId);
                CHECK_NAPI_STATUS(pEngine, status);
                
                status = napi_get_value_nodestring_(args[1], userAccount);
                CHECK_NAPI_STATUS(pEngine, status);
               
                result = pEngine->m_engine->registerLocalUserAccount(appId, userAccount);
            } while (false);
            napi_set_array_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, joinChannelWithUserAccount)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                NodeString token, channel, userAccount;

                napi_status status = napi_get_value_nodestring_(args[0], token);
                CHECK_NAPI_STATUS(pEngine, status);
                
                status = napi_get_value_nodestring_(args[1], channel);
                CHECK_NAPI_STATUS(pEngine, status);
                
                status = napi_get_value_nodestring_(args[2], userAccount);
                CHECK_NAPI_STATUS(pEngine, status);
               
                result = pEngine->m_engine->joinChannelWithUserAccount(token, channel, userAccount);
            } while (false);
            napi_set_array_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getUserInfoByUserAccount)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                NodeString userAccount;
                UserInfo userInfo;
                
                napi_status status = napi_get_value_nodestring_(args[0], userAccount);
                CHECK_NAPI_STATUS(pEngine, status);
               
                result = pEngine->m_engine->getUserInfoByUserAccount(userAccount, &userInfo);
                Local<v8::Object> obj = Object::New(isolate);
                NODE_SET_OBJ_PROP_UINT32(isolate, obj, "errorCode", result);

                Local<v8::Object> userObj = Object::New(isolate);
                NODE_SET_OBJ_PROP_UINT32(isolate, userObj, "uid", userInfo.uid);
                NODE_SET_OBJ_PROP_String(isolate, userObj, "userAccount", userInfo.userAccount);
                Local<Value> propName = String::NewFromUtf8(isolate, "userInfo", NewStringType::kInternalized).ToLocalChecked();
                obj->Set(context, propName, userObj);
                args.GetReturnValue().Set(obj);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getUserInfoByUid)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();

                uid_t uid;
                UserInfo userInfo;
                
                napi_status status = napi_get_value_uint32_(args[0], uid);
                CHECK_NAPI_STATUS(pEngine, status);
               
                result = pEngine->m_engine->getUserInfoByUid(uid, &userInfo);
                Local<v8::Object> obj = Object::New(isolate);
                NODE_SET_OBJ_PROP_UINT32(isolate, obj, "errorCode", result);

                Local<v8::Object> userObj = Object::New(isolate);
                NODE_SET_OBJ_PROP_UINT32(isolate, userObj, "uid", userInfo.uid);
                NODE_SET_OBJ_PROP_String(isolate, userObj, "userAccount", userInfo.userAccount);
                Local<Value> propName = String::NewFromUtf8(isolate, "userInfo", NewStringType::kInternalized).ToLocalChecked();
                obj->Set(context, propName, userObj);
                args.GetReturnValue().Set(obj);
            } while (false);
            LOG_LEAVE;
        }

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


        NAPI_API_DEFINE(NodeRtcEngine, createChannel)
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

                IRtcEngine2* engine = (IRtcEngine2*)(pEngine->m_engine);
                IChannel* pChannel = engine->createChannel(channelName);

                if(!pChannel) {
                    break;
                }

                // Prepare constructor template
                Local<Object> jschannel = NodeRtcChannel::Init(isolate, pChannel);
                args.GetReturnValue().Set(jschannel);
            } while (false);
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

                agora::rtc::IRtcEngine::WindowIDType windowId;
                // screenId
#if defined(__APPLE__)
                status = napi_get_value_uint32_(args[0], windowId);
                CHECK_NAPI_STATUS(pEngine, status);
#elif defined(_WIN32)
#if defined(_WIN64)
                int64_t wid;
                status = napi_get_value_int64_(args[0], wid);
#else
                uint32_t wid;
                status = napi_get_value_uint32_(args[0], wid);
#endif

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
                captureParams.dimensions = dimensions;

                result = pEngine->m_engine->startScreenCaptureByWindowId(reinterpret_cast<agora::rtc::view_t>(windowId), regionRect, captureParams);
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

                VideoContentHint hint;
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
         * NodeRtcChannel
         */


        /**
         * To declared class and member functions that could be used in JS layer directly.
         */
        Local<Object> NodeRtcChannel::Init(Isolate* isolate, IChannel* pChannel)
        {
            Local<Context> context = isolate->GetCurrentContext();
            BEGIN_PROPERTY_DEFINE(NodeRtcChannel, createInstance, 5)
                PROPERTY_METHOD_DEFINE(onEvent)
                PROPERTY_METHOD_DEFINE(joinChannel)
                PROPERTY_METHOD_DEFINE(joinChannelWithUserAccount)
                PROPERTY_METHOD_DEFINE(publish)
                PROPERTY_METHOD_DEFINE(unpublish)
                PROPERTY_METHOD_DEFINE(channelId)
                PROPERTY_METHOD_DEFINE(getCallId)
                PROPERTY_METHOD_DEFINE(renewToken)
                PROPERTY_METHOD_DEFINE(setEncryptionMode)
                PROPERTY_METHOD_DEFINE(setEncryptionSecret)
                PROPERTY_METHOD_DEFINE(setClientRole)
                PROPERTY_METHOD_DEFINE(setRemoteUserPriority)
                PROPERTY_METHOD_DEFINE(setRemoteVoicePosition)
                PROPERTY_METHOD_DEFINE(setRemoteRenderMode)
                PROPERTY_METHOD_DEFINE(setDefaultMuteAllRemoteAudioStreams)
                PROPERTY_METHOD_DEFINE(setDefaultMuteAllRemoteVideoStreams)
                PROPERTY_METHOD_DEFINE(muteAllRemoteAudioStreams)
                PROPERTY_METHOD_DEFINE(muteRemoteAudioStream)
                PROPERTY_METHOD_DEFINE(muteAllRemoteVideoStreams)
                PROPERTY_METHOD_DEFINE(muteRemoteVideoStream)
                PROPERTY_METHOD_DEFINE(setRemoteVideoStreamType)
                PROPERTY_METHOD_DEFINE(setRemoteDefaultVideoStreamType)
                PROPERTY_METHOD_DEFINE(createDataStream)
                PROPERTY_METHOD_DEFINE(sendStreamMessage)
                PROPERTY_METHOD_DEFINE(addPublishStreamUrl)
                PROPERTY_METHOD_DEFINE(removePublishStreamUrl)
                PROPERTY_METHOD_DEFINE(setLiveTranscoding)
                PROPERTY_METHOD_DEFINE(addInjectStreamUrl)
                PROPERTY_METHOD_DEFINE(removeInjectStreamUrl)
                PROPERTY_METHOD_DEFINE(startChannelMediaRelay)
                PROPERTY_METHOD_DEFINE(updateChannelMediaRelay)
                PROPERTY_METHOD_DEFINE(stopChannelMediaRelay)
                PROPERTY_METHOD_DEFINE(getConnectionState)
                PROPERTY_METHOD_DEFINE(leaveChannel)
                PROPERTY_METHOD_DEFINE(release)

            EN_PROPERTY_DEFINE()
            
            Local<Function> cons = tpl->GetFunction(context).ToLocalChecked();
            Local<v8::External> argChannel = Local<v8::External>::New(isolate, v8::External::New(isolate, pChannel));
            Local<v8::Value> argv[1] = {argChannel};
            Local<Object> jschannel = cons->NewInstance(context, 1, argv).ToLocalChecked();
            return jschannel;
        }

        /**
         * The function is used as class constructor in JS layer
         */
        void NodeRtcChannel::createInstance(const FunctionCallbackInfo<Value>& args)
        {
            LOG_ENTER;
            Isolate *isolate = args.GetIsolate();

            Local<v8::External> argChannel = Local<v8::External>::Cast(args[0]);
            IChannel* pChannel = static_cast<IChannel*>(argChannel->Value());
            NodeRtcChannel *channel = new NodeRtcChannel(isolate, pChannel);
            channel->Wrap(args.This());
            args.GetReturnValue().Set(args.This());

            LOG_LEAVE;
        }

        /**
         * Constructor
         */
        NodeRtcChannel::NodeRtcChannel(Isolate* isolate, IChannel* pChannel)
            : m_isolate(isolate), m_channel(pChannel)
        {
            LOG_ENTER;
            /** m_eventHandler provide SDK event handler. */
            m_eventHandler.reset(new NodeChannelEventHandler(this));

            m_channel->setChannelEventHandler(m_eventHandler.get());
            LOG_LEAVE;
        }

        NodeRtcChannel::~NodeRtcChannel()
        {
            LOG_ENTER;
            if (m_channel) {
                m_channel->release();
                m_channel = nullptr;
            }
            m_eventHandler.reset(nullptr);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcChannel, onEvent)
        {
            //LOG_ENTER;
            do {
                NodeRtcChannel *pChannel = nullptr;
                napi_status status = napi_ok;
                napi_get_native_channel(args, pChannel);
                CHECK_NATIVE_CHANNEL(pChannel);

                NodeString eventName;
                status = napi_get_value_nodestring_(args[0], eventName);
                CHECK_NAPI_STATUS(pChannel, status);

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
                pChannel->m_eventHandler->addEventHandler((char*)eventName, persistObj, persist);
            } while (false);
            //LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcChannel, joinChannel)
        {
            LOG_ENTER;
            int result = -1;
            NodeString key, name, chan_info;
            do {
                Isolate* isolate = args.GetIsolate();
                NodeRtcChannel *pChannel = nullptr;
                napi_get_native_channel(args, pChannel);
                CHECK_NATIVE_CHANNEL(pChannel);
                uid_t uid;
                napi_status status = napi_get_value_nodestring_(args[0], key);
                CHECK_NAPI_STATUS(pChannel, status);

                status = napi_get_value_nodestring_(args[1], chan_info);
                CHECK_NAPI_STATUS(pChannel, status);

                status = NodeUid::getUidFromNodeValue(args[2], uid);
                CHECK_NAPI_STATUS(pChannel, status);

                Local<Value> vChannelMediaOptions = args[3];
                if(!vChannelMediaOptions->IsObject()) {
                    pChannel->m_eventHandler->fireApiError(__FUNCTION__);
                    break;
                }
                Local<Object> oChannelMediaOptions;
                status = napi_get_value_object_(isolate, vChannelMediaOptions, oChannelMediaOptions);
                CHECK_NAPI_STATUS(pChannel, status);

                ChannelMediaOptions options;
                status = napi_get_object_property_bool_(isolate, oChannelMediaOptions, "autoSubscribeAudio", options.autoSubscribeAudio);
                CHECK_NAPI_STATUS(pChannel, status);
                status = napi_get_object_property_bool_(isolate, oChannelMediaOptions, "autoSubscribeVideo", options.autoSubscribeVideo);
                CHECK_NAPI_STATUS(pChannel, status);

                std::string extra_info = "";

                if (chan_info && strlen(chan_info) > 0){
                    extra_info = "Electron_";
                    extra_info += chan_info;
                }
                else{
                    extra_info = "Electron";
                }
               
                result = pChannel->m_channel->joinChannel(key, extra_info.c_str(), uid, options);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcChannel, joinChannelWithUserAccount)
        {
            LOG_ENTER;
            int result = -1;
            do {
                Isolate* isolate = args.GetIsolate();
                NodeRtcChannel *pChannel = nullptr;
                napi_get_native_channel(args, pChannel);
                CHECK_NATIVE_CHANNEL(pChannel);

                NodeString token, channel, userAccount;

                napi_status status = napi_get_value_nodestring_(args[0], token);
                CHECK_NAPI_STATUS(pChannel, status);
                
                status = napi_get_value_nodestring_(args[1], userAccount);
                CHECK_NAPI_STATUS(pChannel, status);

                Local<Value> vChannelMediaOptions = args[2];
                if(!vChannelMediaOptions->IsObject()) {
                    pChannel->m_eventHandler->fireApiError(__FUNCTION__);
                    break;
                }
                Local<Object> oChannelMediaOptions;
                status = napi_get_value_object_(isolate, vChannelMediaOptions, oChannelMediaOptions);
                CHECK_NAPI_STATUS(pChannel, status);

                ChannelMediaOptions options;
                status = napi_get_object_property_bool_(isolate, oChannelMediaOptions, "autoSubscribeAudio", options.autoSubscribeAudio);
                CHECK_NAPI_STATUS(pChannel, status);
                status = napi_get_object_property_bool_(isolate, oChannelMediaOptions, "autoSubscribeVideo", options.autoSubscribeVideo);
                CHECK_NAPI_STATUS(pChannel, status);
               
                result = pChannel->m_channel->joinChannelWithUserAccount(token, userAccount, options);
            } while (false);
            napi_set_array_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcChannel, channelId)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            do {
                Isolate* isolate = args.GetIsolate();
                NodeRtcChannel *pChannel = nullptr;
                napi_get_native_channel(args, pChannel);
                CHECK_NATIVE_CHANNEL(pChannel);

                const char* channelId = pChannel->m_channel->channelId();
                napi_set_string_result(args, channelId);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcChannel, getCallId)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            do {
                Isolate* isolate = args.GetIsolate();
                NodeRtcChannel *pChannel = nullptr;
                napi_get_native_channel(args, pChannel);
                CHECK_NATIVE_CHANNEL(pChannel);

                util::AString callId;
                if (-ERR_FAILED != pChannel->m_channel->getCallId(callId)) {
                    napi_set_string_result(args, callId->c_str());
                }
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcChannel, setClientRole)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcChannel *pChannel = nullptr;
                napi_get_native_channel(args, pChannel);
                CHECK_NATIVE_CHANNEL(pChannel);
                unsigned int role;
                napi_status status = napi_get_value_uint32_(args[0], role);
                CHECK_NAPI_STATUS(pChannel, status);

                result = pChannel->m_channel->setClientRole(CLIENT_ROLE_TYPE(role));
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcChannel, setRemoteUserPriority)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcChannel *pChannel = nullptr;
                napi_get_native_channel(args, pChannel);
                CHECK_NATIVE_CHANNEL(pChannel);

                uid_t uid;
                napi_status status = napi_get_value_uid_t_(args[0], uid);
                CHECK_NAPI_STATUS(pChannel, status);

                unsigned int priority = 100;
                status = napi_get_value_uint32_(args[1], priority);
                CHECK_NAPI_STATUS(pChannel, status);

                result = pChannel->m_channel->setRemoteUserPriority(uid, PRIORITY_TYPE(priority));
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcChannel, setRemoteRenderMode)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcChannel *pChannel = nullptr;
                napi_get_native_channel(args, pChannel);
                CHECK_NATIVE_CHANNEL(pChannel);
                napi_status status;

                uid_t uid;
                status = napi_get_value_uid_t_(args[0], uid);
                CHECK_NAPI_STATUS(pChannel, status);

                unsigned int renderMode;
                status = napi_get_value_uint32_(args[1], renderMode);
                CHECK_NAPI_STATUS(pChannel, status);

                unsigned int mirrorMode;
                status = napi_get_value_uint32_(args[2], mirrorMode);
                CHECK_NAPI_STATUS(pChannel, status);

                result = pChannel->m_channel->setRemoteRenderMode(uid, RENDER_MODE_TYPE(renderMode), VIDEO_MIRROR_MODE_TYPE(mirrorMode));
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }
        
        NAPI_API_CHANNEL_DEFINE_WRAPPER_1(renewToken, nodestring);
        NAPI_API_CHANNEL_DEFINE_WRAPPER_1(setEncryptionSecret, nodestring);
        NAPI_API_CHANNEL_DEFINE_WRAPPER_1(setEncryptionMode, nodestring);
        NAPI_API_CHANNEL_DEFINE_WRAPPER_3(setRemoteVoicePosition, int32, double, double);
        NAPI_API_CHANNEL_DEFINE_WRAPPER_1(setDefaultMuteAllRemoteAudioStreams, bool);
        NAPI_API_CHANNEL_DEFINE_WRAPPER_1(setDefaultMuteAllRemoteVideoStreams, bool);
        NAPI_API_CHANNEL_DEFINE_WRAPPER_1(muteAllRemoteAudioStreams, bool);
        NAPI_API_CHANNEL_DEFINE_WRAPPER_2(muteRemoteAudioStream, uid_t, bool);
        NAPI_API_CHANNEL_DEFINE_WRAPPER_1(muteAllRemoteVideoStreams, bool);
        NAPI_API_CHANNEL_DEFINE_WRAPPER_2(muteRemoteVideoStream, uid_t, bool);

        NAPI_API_DEFINE(NodeRtcChannel, setRemoteVideoStreamType)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcChannel *pChannel = nullptr;
                napi_get_native_channel(args, pChannel);
                CHECK_NATIVE_CHANNEL(pChannel);
                napi_status status;

                uid_t uid;
                status = napi_get_value_uid_t_(args[0], uid);
                CHECK_NAPI_STATUS(pChannel, status);

                unsigned int streamType;
                status = napi_get_value_uint32_(args[1], streamType);
                CHECK_NAPI_STATUS(pChannel, status);

                result = pChannel->m_channel->setRemoteVideoStreamType(uid, REMOTE_VIDEO_STREAM_TYPE(streamType));
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcChannel, setRemoteDefaultVideoStreamType)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcChannel *pChannel = nullptr;
                napi_get_native_channel(args, pChannel);
                CHECK_NATIVE_CHANNEL(pChannel);
                napi_status status;

                unsigned int streamType;
                status = napi_get_value_uint32_(args[0], streamType);
                CHECK_NAPI_STATUS(pChannel, status);

                result = pChannel->m_channel->setRemoteDefaultVideoStreamType(REMOTE_VIDEO_STREAM_TYPE(streamType));
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcChannel, createDataStream)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcChannel *pChannel = nullptr;
                napi_get_native_channel(args, pChannel);
                CHECK_NATIVE_CHANNEL(pChannel);
                napi_status status;

                int streamId;
                bool reliable, ordered;
                napi_get_param_2(args, bool, reliable, bool, ordered);
                CHECK_NAPI_STATUS(pChannel, status);

                result = pChannel->m_channel->createDataStream(&streamId, reliable, ordered);
                if(result == 0) {
                    result = streamId;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcChannel, sendStreamMessage)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcChannel *pChannel = nullptr;
                napi_get_native_channel(args, pChannel);
                CHECK_NATIVE_CHANNEL(pChannel);
                napi_status status;

                NodeString msg;
                int streamId;
                status = napi_get_value_int32_(args[0], streamId);
                CHECK_NAPI_STATUS(pChannel, status);
                status = napi_get_value_nodestring_(args[1], msg);
                CHECK_NAPI_STATUS(pChannel, status);
                result = pChannel->m_channel->sendStreamMessage(streamId, msg, strlen(msg));
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_CHANNEL_DEFINE_WRAPPER_2(addPublishStreamUrl, nodestring, bool);
        NAPI_API_CHANNEL_DEFINE_WRAPPER_1(removePublishStreamUrl, nodestring);
        NAPI_API_DEFINE(NodeRtcChannel, setLiveTranscoding)
        {
            LOG_ENTER;
            int result = -1;
            TranscodingUser *users = nullptr;
            do {
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                NodeRtcChannel *pChannel = nullptr;
                napi_get_native_channel(args, pChannel);
                CHECK_NATIVE_CHANNEL(pChannel);
                napi_status status;

                LiveTranscoding transcoding;
                int videoCodecProfile, audioSampleRateType;

                if(args[0]->IsNull() || !args[0]->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pChannel, status);
                }

                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[0], obj);
                CHECK_NAPI_STATUS(pChannel, status);
                nodestring transcodingExtraInfo;
                status = napi_get_object_property_int32_(isolate, obj, "width", transcoding.width);
                CHECK_NAPI_STATUS(pChannel, status);

                status = napi_get_object_property_int32_(isolate, obj, "height", transcoding.height);
                CHECK_NAPI_STATUS(pChannel, status);

                status = napi_get_object_property_int32_(isolate, obj, "videoBitrate", transcoding.videoBitrate);
                CHECK_NAPI_STATUS(pChannel, status);

                status = napi_get_object_property_int32_(isolate, obj, "videoFrameRate", transcoding.videoFramerate);
                CHECK_NAPI_STATUS(pChannel, status);

                status = napi_get_object_property_bool_(isolate, obj, "lowLatency", transcoding.lowLatency);
                CHECK_NAPI_STATUS(pChannel, status);
                
                status = napi_get_object_property_int32_(isolate, obj, "videoGop", transcoding.videoGop);
                CHECK_NAPI_STATUS(pChannel, status);
                
                status = napi_get_object_property_int32_(isolate, obj, "videoCodecProfile", videoCodecProfile);
                CHECK_NAPI_STATUS(pChannel, status);
                transcoding.videoCodecProfile = VIDEO_CODEC_PROFILE_TYPE(videoCodecProfile);

                status = napi_get_object_property_uint32_(isolate, obj, "backgroundColor", transcoding.backgroundColor);
                CHECK_NAPI_STATUS(pChannel, status);
                
                status = napi_get_object_property_uint32_(isolate, obj, "userCount", transcoding.userCount);
                CHECK_NAPI_STATUS(pChannel, status);
                
                status = napi_get_object_property_int32_(isolate, obj, "audioSampleRate", audioSampleRateType);
                CHECK_NAPI_STATUS(pChannel, status);
                transcoding.audioSampleRate = AUDIO_SAMPLE_RATE_TYPE(audioSampleRateType);

                status = napi_get_object_property_int32_(isolate, obj, "audioBitrate", transcoding.audioBitrate);
                CHECK_NAPI_STATUS(pChannel, status);
                
                status = napi_get_object_property_int32_(isolate, obj, "audioChannels", transcoding.audioChannels);
                CHECK_NAPI_STATUS(pChannel, status);

                status = napi_get_object_property_nodestring_(isolate, obj, "transcodingExtraInfo", transcodingExtraInfo);
                CHECK_NAPI_STATUS(pChannel, status);
                transcoding.transcodingExtraInfo = transcodingExtraInfo;

                RtcImage* wm = new RtcImage;

                Local<Name> keyName = String::NewFromUtf8(isolate, "watermark", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> wmValue = obj->Get(context, keyName).ToLocalChecked();
                if (wmValue->IsNull() || !wmValue->IsObject()) {
                    Local<Object> objWm;
                    status = napi_get_value_object_(isolate, wmValue, objWm);
                    CHECK_NAPI_STATUS(pChannel, status);
                    nodestring wmurl;
                    status = napi_get_object_property_nodestring_(isolate, objWm, "url", wmurl);
                    CHECK_NAPI_STATUS(pChannel, status);
                    wm->url = wmurl;

                    status = napi_get_object_property_int32_(isolate, objWm, "x", wm->x);
                    CHECK_NAPI_STATUS(pChannel, status);
                    
                    status = napi_get_object_property_int32_(isolate, objWm, "y", wm->y);
                    CHECK_NAPI_STATUS(pChannel, status);
                    
                    status = napi_get_object_property_int32_(isolate, objWm, "width", wm->width);
                    CHECK_NAPI_STATUS(pChannel, status);
                    
                    status = napi_get_object_property_int32_(isolate, objWm, "height", wm->height);
                    CHECK_NAPI_STATUS(pChannel, status);
                    
                    transcoding.watermark = wm;
                }
                
                if (transcoding.userCount > 0) {
                    users = new TranscodingUser[transcoding.userCount];
                    Local<Name> keyName = String::NewFromUtf8(isolate, "transcodingUsers", NewStringType::kInternalized).ToLocalChecked();
                    Local<Value> objUsers = obj->Get(context, keyName).ToLocalChecked();
                    if (objUsers->IsNull() || !objUsers->IsArray()) {
                        status = napi_invalid_arg;
                        break;
                    }
                    auto usersValue = v8::Array::Cast(*objUsers);
                    if (usersValue->Length() != transcoding.userCount) {
                        status = napi_invalid_arg;
                        break;
                    }
                    for (uint32 i = 0; i < transcoding.userCount; i++) {
                        Local<Value> value = usersValue->Get(context, i).ToLocalChecked();
                        Local<Object> userObj;
                        status = napi_get_value_object_(isolate, value, userObj);
                        CHECK_NAPI_STATUS(pChannel, status);
                        if (userObj->IsNull() || !objUsers->IsObject()) {
                            status = napi_invalid_arg;
                            break;
                        }
                        status = napi_get_object_property_uid_(isolate, userObj, "uid", users[i].uid);
                        CHECK_NAPI_STATUS(pChannel, status);
                        
                        status = napi_get_object_property_int32_(isolate, userObj, "x", users[i].x);
                        CHECK_NAPI_STATUS(pChannel, status);
                        
                        status = napi_get_object_property_int32_(isolate, userObj, "y", users[i].y);
                        CHECK_NAPI_STATUS(pChannel, status);
                        
                        status = napi_get_object_property_int32_(isolate, userObj, "width", users[i].width);
                        CHECK_NAPI_STATUS(pChannel, status);

                        status = napi_get_object_property_int32_(isolate, userObj, "height", users[i].height);
                        CHECK_NAPI_STATUS(pChannel, status);

                        status = napi_get_object_property_int32_(isolate, userObj, "zOrder", users[i].zOrder);
                        CHECK_NAPI_STATUS(pChannel, status);
                        
                        status = napi_get_object_property_double_(isolate, userObj, "alpha", users[i].alpha);
                        CHECK_NAPI_STATUS(pChannel, status);
                        
                        status = napi_get_object_property_int32_(isolate, userObj, "audioChannel", users[i].audioChannel);
                        CHECK_NAPI_STATUS(pChannel, status);
                    }
                    transcoding.transcodingUsers = users;
                }
                result = pChannel->m_channel->setLiveTranscoding(transcoding);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcChannel, addInjectStreamUrl)
        {
            LOG_ENTER;
            int result = -1;
            do {
                Isolate* isolate = args.GetIsolate();
                NodeRtcChannel *pChannel = nullptr;
                napi_get_native_channel(args, pChannel);
                CHECK_NATIVE_CHANNEL(pChannel);
                napi_status status;

                nodestring url;
                InjectStreamConfig config;
                status = napi_get_value_nodestring_(args[0], url);
                CHECK_NAPI_STATUS(pChannel, status);

                if(!args[1]->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pChannel, status);
                }
                Local<Object> configObj;
                status = napi_get_value_object_(isolate, args[1], configObj);
                CHECK_NAPI_STATUS(pChannel, status);

                int audioSampleRate;
                status = napi_get_object_property_int32_(isolate, configObj, "width", config.width);
                CHECK_NAPI_STATUS(pChannel, status);

                status = napi_get_object_property_int32_(isolate, configObj, "height", config.height);
                CHECK_NAPI_STATUS(pChannel, status);

                status = napi_get_object_property_int32_(isolate, configObj, "videoGop", config.videoGop);
                CHECK_NAPI_STATUS(pChannel, status);
                
                status = napi_get_object_property_int32_(isolate, configObj, "videoFramerate", config.videoFramerate);
                CHECK_NAPI_STATUS(pChannel, status);

                status = napi_get_object_property_int32_(isolate, configObj, "videoBitrate", config.videoBitrate);
                CHECK_NAPI_STATUS(pChannel, status);

                status = napi_get_object_property_int32_(isolate, configObj, "audioSampleRate", audioSampleRate);
                CHECK_NAPI_STATUS(pChannel, status);
                config.audioSampleRate = AUDIO_SAMPLE_RATE_TYPE(audioSampleRate);

                status = napi_get_object_property_int32_(isolate, configObj, "audioBitrate", config.audioBitrate);
                CHECK_NAPI_STATUS(pChannel, status);
                
                status = napi_get_object_property_int32_(isolate, configObj, "audioChannels", config.audioChannels);
                CHECK_NAPI_STATUS(pChannel, status);

                result = pChannel->m_channel->addInjectStreamUrl(url, config);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }
        NAPI_API_CHANNEL_DEFINE_WRAPPER_1(removeInjectStreamUrl, nodestring);

        NAPI_API_DEFINE(NodeRtcChannel, startChannelMediaRelay)
        {
            LOG_ENTER;
            int result = -1;
            do {
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                NodeRtcChannel *pChannel = nullptr;
                napi_get_native_channel(args, pChannel);
                CHECK_NATIVE_CHANNEL(pChannel);
                napi_status status;

                ChannelMediaRelayConfiguration config;
                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[0], obj);
                CHECK_NAPI_STATUS(pChannel, status);

                if (args[0]->IsNull() || !args[0]->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pChannel, status);
                }

                //srcInfo
                Local<Name> keyName = String::NewFromUtf8(isolate, "srcInfo", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> srcInfoValue = obj->Get(context, keyName).ToLocalChecked();
                ChannelMediaInfo srcInfo;

                if (srcInfoValue->IsNull() || !srcInfoValue->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pChannel, status);
                }
                NodeString channelName, token;
                Local<Object> objSrcInfo;
                status = napi_get_value_object_(isolate, srcInfoValue, objSrcInfo);
                CHECK_NAPI_STATUS(pChannel, status);
                status = napi_get_object_property_nodestring_(isolate, objSrcInfo, "channelName", channelName);
                CHECK_NAPI_STATUS(pChannel, status);
                
                status = napi_get_object_property_nodestring_(isolate, objSrcInfo, "token", token);
                CHECK_NAPI_STATUS(pChannel, status);
                
                status = napi_get_object_property_uid_(isolate, objSrcInfo, "uid", srcInfo.uid);
                CHECK_NAPI_STATUS(pChannel, status);
                
                string mChannelName(channelName);
                string mToken(token);
                srcInfo.channelName = mChannelName.c_str();
                srcInfo.token = mToken.c_str();
                

                //destInfos
                keyName = String::NewFromUtf8(isolate, "destInfos", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> objDestInfos = obj->Get(context, keyName).ToLocalChecked();
                if (objDestInfos->IsNull() || !objDestInfos->IsArray()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pChannel, status);
                }
                auto destInfosValue = v8::Array::Cast(*objDestInfos);
                int destInfoCount = destInfosValue->Length();
                ChannelMediaInfo* destInfos = new ChannelMediaInfo[destInfoCount];
                for (uint32 i = 0; i < destInfoCount; i++) {
                    Local<Value> value = destInfosValue->Get(context, i).ToLocalChecked();
                    Local<Object> destInfoObj;
                    status = napi_get_value_object_(isolate, value, destInfoObj);
                    CHECK_NAPI_STATUS(pChannel, status);
                    if (destInfoObj->IsNull() || !destInfoObj->IsObject()) {
                        status = napi_invalid_arg;
                        break;
                    }
                    NodeString channelName, token;
                    status = napi_get_object_property_nodestring_(isolate, destInfoObj, "channelName", channelName);
                    CHECK_NAPI_STATUS(pChannel, status);
                    
                    status = napi_get_object_property_nodestring_(isolate, destInfoObj, "token", token);
                    CHECK_NAPI_STATUS(pChannel, status);
                    
                    status = napi_get_object_property_uid_(isolate, destInfoObj, "uid", destInfos[i].uid);
                    CHECK_NAPI_STATUS(pChannel, status);
                    
                    string mChannelName(channelName);
                    string mToken(token);
                    srcInfo.channelName = mChannelName.c_str();
                    srcInfo.token = mToken.c_str();
                }
                CHECK_NAPI_STATUS(pChannel, status);

                config.srcInfo = &srcInfo;
                config.destInfos = &destInfos[0];
                config.destCount = destInfoCount;

                result = pChannel->m_channel->startChannelMediaRelay(config);
                
                if(destInfos){
                    delete[] destInfos;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcChannel, updateChannelMediaRelay)
        {
            LOG_ENTER;
            int result = -1;
            do {
                Isolate* isolate = args.GetIsolate();
                Local<Context> context = isolate->GetCurrentContext();
                NodeRtcChannel *pChannel = nullptr;
                napi_get_native_channel(args, pChannel);
                CHECK_NATIVE_CHANNEL(pChannel);
                napi_status status;

                ChannelMediaRelayConfiguration config;
                Local<Object> obj;
                status = napi_get_value_object_(isolate, args[0], obj);
                CHECK_NAPI_STATUS(pChannel, status);

                if (args[0]->IsNull() || !args[0]->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pChannel, status);
                }

                //srcInfo
                Local<Name> keyName = String::NewFromUtf8(isolate, "srcInfo", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> srcInfoValue = obj->Get(context, keyName).ToLocalChecked();
                ChannelMediaInfo srcInfo;

                if (srcInfoValue->IsNull() || !srcInfoValue->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pChannel, status);
                }
                NodeString channelName, token;
                Local<Object> objSrcInfo;
                status = napi_get_value_object_(isolate, srcInfoValue, objSrcInfo);
                CHECK_NAPI_STATUS(pChannel, status);
                status = napi_get_object_property_nodestring_(isolate, objSrcInfo, "channelName", channelName);
                CHECK_NAPI_STATUS(pChannel, status);
                
                status = napi_get_object_property_nodestring_(isolate, objSrcInfo, "token", token);
                CHECK_NAPI_STATUS(pChannel, status);
                
                status = napi_get_object_property_uid_(isolate, objSrcInfo, "uid", srcInfo.uid);
                CHECK_NAPI_STATUS(pChannel, status);
                
                string mChannelName(channelName);
                string mToken(token);
                srcInfo.channelName = mChannelName.c_str();
                srcInfo.token = mToken.c_str();
                

                //destInfos
                keyName = String::NewFromUtf8(isolate, "destInfos", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> objDestInfos = obj->Get(context, keyName).ToLocalChecked();
                if (objDestInfos->IsNull() || !objDestInfos->IsArray()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pChannel, status);
                }
                auto destInfosValue = v8::Array::Cast(*objDestInfos);
                int destInfoCount = destInfosValue->Length();
                ChannelMediaInfo* destInfos = new ChannelMediaInfo[destInfoCount];
                for (uint32 i = 0; i < destInfoCount; i++) {
                    Local<Value> value = destInfosValue->Get(context, i).ToLocalChecked();
                    Local<Object> destInfoObj;
                    status = napi_get_value_object_(isolate, value, destInfoObj);
                    CHECK_NAPI_STATUS(pChannel, status);
                    if (destInfoObj->IsNull() || !destInfoObj->IsObject()) {
                        status = napi_invalid_arg;
                        break;
                    }
                    NodeString channelName, token;
                    status = napi_get_object_property_nodestring_(isolate, destInfoObj, "channelName", channelName);
                    CHECK_NAPI_STATUS(pChannel, status);
                    
                    status = napi_get_object_property_nodestring_(isolate, destInfoObj, "token", token);
                    CHECK_NAPI_STATUS(pChannel, status);
                    
                    status = napi_get_object_property_uid_(isolate, destInfoObj, "uid", destInfos[i].uid);
                    CHECK_NAPI_STATUS(pChannel, status);
                    
                    string mChannelName(channelName);
                    string mToken(token);
                    srcInfo.channelName = mChannelName.c_str();
                    srcInfo.token = mToken.c_str();
                }
                CHECK_NAPI_STATUS(pChannel, status);

                config.srcInfo = &srcInfo;
                config.destInfos = &destInfos[0];
                config.destCount = destInfoCount;

                result = pChannel->m_channel->updateChannelMediaRelay(config);
                
                if(destInfos){
                    delete[] destInfos;
                }
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }
        NAPI_API_CHANNEL_DEFINE_WRAPPER(stopChannelMediaRelay);

        NAPI_API_DEFINE(NodeRtcChannel, getConnectionState)
        {
            LOG_ENTER;
            int result = -1;
            do {
                NodeRtcChannel *pChannel = nullptr;
                napi_get_native_channel(args, pChannel);
                CHECK_NATIVE_CHANNEL(pChannel);
                napi_status status;

                result = pChannel->m_channel->getConnectionState();
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_CHANNEL_DEFINE_WRAPPER(publish);
        NAPI_API_CHANNEL_DEFINE_WRAPPER(unpublish);
        NAPI_API_CHANNEL_DEFINE_WRAPPER(leaveChannel);

        NAPI_API_DEFINE(NodeRtcChannel, release)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                Isolate* isolate = args.GetIsolate();
                NodeRtcChannel *pChannel = nullptr;
                napi_get_native_channel(args, pChannel);
                CHECK_NATIVE_CHANNEL(pChannel);

                if (pChannel->m_channel) {
                    pChannel->m_channel->release();
                    pChannel->m_channel = nullptr;
                }

                result = 0;
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
