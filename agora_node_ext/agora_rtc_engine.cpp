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

#if defined(__APPLE__) || defined(_WIN32)
#include "node_screen_window_info.h"
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

            EN_PROPERTY_DEFINE()
            module->Set(String::NewFromUtf8(isolate, "NodeRtcEngine"), tpl->GetFunction());
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

#if 0
        NAPI_API_DEFINE_WRAPPER_PARAM_0(clearVideoCompositingLayout)
#endif
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

        NAPI_API_DEFINE(NodeRtcEngine, configPublisher)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                PublisherConfiguration config;
                nodestring injectStreamUrl, publishUrl, rawStreamUrl, extraInfo;
                Local<Object> obj = args[0]->ToObject(args.GetIsolate());
                napi_get_object_property_int32_(args.GetIsolate(), obj, "width", config.width);
                napi_get_object_property_int32_(args.GetIsolate(), obj, "height", config.height);
                napi_get_object_property_int32_(args.GetIsolate(), obj, "framerate", config.framerate);
                napi_get_object_property_int32_(args.GetIsolate(), obj, "bitrate", config.bitrate);
                napi_get_object_property_int32_(args.GetIsolate(), obj, "defaultlayout", config.defaultLayout);
                napi_get_object_property_int32_(args.GetIsolate(), obj, "lifecycle", config.lifecycle);
                napi_get_object_property_bool_(args.GetIsolate(), obj, "owner", config.owner);
                napi_get_object_property_int32_(args.GetIsolate(), obj, "injectstreamwidth", config.injectStreamWidth);
                napi_get_object_property_int32_(args.GetIsolate(), obj, "injectstreamheight", config.injectStreamHeight);
                if (napi_get_object_property_nodestring_(args.GetIsolate(), obj, "injectstreamurl", injectStreamUrl) == napi_ok) {
                    config.injectStreamUrl = injectStreamUrl;
                }
                if (napi_get_object_property_nodestring_(args.GetIsolate(), obj, "publishurl", publishUrl) == napi_ok) {
                    config.publishUrl = publishUrl;
                }
                if (napi_get_object_property_nodestring_(args.GetIsolate(), obj, "rawstreamurl", rawStreamUrl) == napi_ok) {
                    config.rawStreamUrl = rawStreamUrl;
                }
                if (napi_get_object_property_nodestring_(args.GetIsolate(), obj, "extrainfo", extraInfo) == napi_ok) {
                    config.extraInfo = extraInfo;
                }
                result = pEngine->m_engine->configPublisher(config);
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        
        NAPI_API_DEFINE(NodeRtcEngine, setVideoCompositingLayout)
        {
            LOG_ENTER;
            int result = -1;
            napi_status status = napi_ok;
            VideoCompositingLayout::Region *regions = nullptr;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                VideoCompositingLayout layout;
                nodestring bg, appdata;
                Local<Object> obj = args[0]->ToObject(args.GetIsolate());
                napi_get_object_property_int32_(args.GetIsolate(), obj, "canvaswidth", layout.canvasWidth);
                napi_get_object_property_int32_(args.GetIsolate(), obj, "canvasheight", layout.canvasHeight);
                if (napi_get_object_property_nodestring_(args.GetIsolate(), obj, "backgroundcolor", bg) == napi_ok) {
                    layout.backgroundColor = bg;
                }
                napi_get_object_property_int32_(args.GetIsolate(), obj, "regioncount", layout.regionCount);
                if (napi_get_object_property_nodestring_(args.GetIsolate(), obj, "appdata", appdata) == napi_ok) {
                    layout.appData = appdata;
                }
                napi_get_object_property_int32_(args.GetIsolate(), obj, "appdatalength", layout.appDataLength);
                if (layout.regionCount > 0) {
                    regions = new VideoCompositingLayout::Region[layout.regionCount];
                    Local<Name> keyName = String::NewFromUtf8(args.GetIsolate(), "regions", NewStringType::kInternalized).ToLocalChecked();
                    Local<Value> objUsers = obj->Get(args.GetIsolate()->GetCurrentContext(), keyName).ToLocalChecked();
                    if (objUsers->IsNull() || !objUsers->IsArray()) {
                        status = napi_invalid_arg;
                        break;
                    }
                    auto regionsValue = v8::Array::Cast(*objUsers);
                    if (regionsValue->Length() != layout.regionCount) {
                        status = napi_invalid_arg;
                        break;
                    }
                    for (int32 i = 0; i < layout.regionCount; i++) {
                        Local<Value> value = regionsValue->Get(i);
                        Local<Object> regionObj = value->ToObject(args.GetIsolate());
                        if (regionObj->IsNull())
                            status = napi_invalid_arg;
                        break;
                        int rendermode;
                        napi_get_object_property_uid_(args.GetIsolate(), regionObj, "uid", regions[i].uid);
                        napi_get_object_property_double_(args.GetIsolate(), regionObj, "x", regions[i].x);
                        napi_get_object_property_double_(args.GetIsolate(), regionObj, "y", regions[i].y);
                        napi_get_object_property_double_(args.GetIsolate(), regionObj, "width", regions[i].width);
                        napi_get_object_property_double_(args.GetIsolate(), regionObj, "height", regions[i].height);
                        napi_get_object_property_int32_(args.GetIsolate(), regionObj, "zorder", regions[i].zOrder);
                        napi_get_object_property_double_(args.GetIsolate(), regionObj, "alpha", regions[i].alpha);
                        if (napi_get_object_property_int32_(args.GetIsolate(), regionObj, "rendermode", rendermode) == napi_ok) {
                            regions[i].renderMode = (RENDER_MODE_TYPE)rendermode;
                        }
                    }
                    layout.regions = regions;
                }
                result = pEngine->m_engine->setVideoCompositingLayout(layout);
            } while (false);
            if (regions) {
                delete[] regions;
            }
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, clearVideoCompositingLayout)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            int result = -1;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                result = pEngine->m_engine->clearVideoCompositingLayout();
            } while (false);
             napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, addPublishStreamUrl)
        {
            LOG_ENTER;
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

                int result = pEngine->m_engine->addPublishStreamUrl(url, transcodingEnabled);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, removePublishStreamUrl)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring url;
                napi_status status = napi_get_value_nodestring_(args[0], url);
                CHECK_NAPI_STATUS(pEngine, status);
                int result = pEngine->m_engine->removePublishStreamUrl(url);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }
        NAPI_API_DEFINE(NodeRtcEngine, addVideoWatermark)
        {
            LOG_ENTER;

            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring url;
                napi_status status = napi_get_value_nodestring_(args[0], url);
                CHECK_NAPI_STATUS(pEngine, status);
                RtcImage vwm;
                Local<Object> vmwObj = args[0]->ToObject(args.GetIsolate());
                if (napi_get_object_property_nodestring_(args.GetIsolate(), vmwObj, "url", url) == napi_ok) {
                    vwm.url = url;
                }
                napi_get_object_property_int32_(args.GetIsolate(), vmwObj, "x", vwm.x);
                napi_get_object_property_int32_(args.GetIsolate(), vmwObj, "y", vwm.y);
                napi_get_object_property_int32_(args.GetIsolate(), vmwObj, "width", vwm.width);
                napi_get_object_property_int32_(args.GetIsolate(), vmwObj, "height", vwm.height);
                pEngine->m_engine->addVideoWatermark(vwm);
            } while (false);

            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, clearVideoWatermarks)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int result = pEngine->m_engine->clearVideoWatermarks();
                napi_set_int_result(args, result);
            } while (false);
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
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                LiveTranscoding transcoding;
                nodestring extrainfo;
                int videoCodecProfile, audioSampleRateType;
                Local<Object> obj = args[0]->ToObject(args.GetIsolate());
                nodestring transcodingExtraInfo;
                napi_get_object_property_int32_(args.GetIsolate(), obj, "width", transcoding.width);
                napi_get_object_property_int32_(args.GetIsolate(), obj, "height", transcoding.height);
                napi_get_object_property_int32_(args.GetIsolate(), obj, "videoBitrate", transcoding.videoBitrate);
                napi_get_object_property_int32_(args.GetIsolate(), obj, "videoFramerate", transcoding.videoFramerate);
                napi_get_object_property_bool_(args.GetIsolate(), obj, "lowLatency", transcoding.lowLatency);
                napi_get_object_property_int32_(args.GetIsolate(), obj, "videoGop", transcoding.videoGop);
                if (napi_get_object_property_int32_(args.GetIsolate(), obj, "videoCodecProfile", videoCodecProfile) == napi_ok) {
                    transcoding.videoCodecProfile = (VIDEO_CODEC_PROFILE_TYPE)videoCodecProfile;
                }
                napi_get_object_property_uint32_(args.GetIsolate(), obj, "backgroundColor", transcoding.backgroundColor);
                napi_get_object_property_uint32_(args.GetIsolate(), obj, "userCount", transcoding.userCount);
                if (napi_get_object_property_int32_(args.GetIsolate(), obj, "audioSampleRateType", audioSampleRateType) == napi_ok) {
                    transcoding.audioSampleRate = (AUDIO_SAMPLE_RATE_TYPE)audioSampleRateType;
                }
                napi_get_object_property_int32_(args.GetIsolate(), obj, "audioBitrate", transcoding.audioBitrate);
                napi_get_object_property_int32_(args.GetIsolate(), obj, "audioChannels", transcoding.audioChannels);

                if (napi_get_object_property_nodestring_(args.GetIsolate(), obj, "transcodingExtraInfo", transcodingExtraInfo) == napi_ok) {
                    transcoding.transcodingExtraInfo = transcodingExtraInfo;
                }

                RtcImage* wm = new RtcImage;

                Local<Name> keyName = String::NewFromUtf8(args.GetIsolate(), "watermark", NewStringType::kInternalized).ToLocalChecked();
                Local<Value> wmValue = obj->Get(args.GetIsolate()->GetCurrentContext(), keyName).ToLocalChecked();
                if (!wmValue->IsNull()) {
                    Local<Object> objWm = wmValue->ToObject(args.GetIsolate());
                    nodestring wmurl;
                    if (napi_get_object_property_nodestring_(args.GetIsolate(), objWm, "url", wmurl) == napi_ok) {
                        wm->url = wmurl;
                    }
                    napi_get_object_property_int32_(args.GetIsolate(), objWm, "x", wm->x);
                    napi_get_object_property_int32_(args.GetIsolate(), objWm, "y", wm->y);
                    napi_get_object_property_int32_(args.GetIsolate(), objWm, "width", wm->width);
                    napi_get_object_property_int32_(args.GetIsolate(), objWm, "height", wm->height);
                    transcoding.watermark = wm;
                }
                
                if (transcoding.userCount > 0) {
                    users = new TranscodingUser[transcoding.userCount];
                    Local<Name> keyName = String::NewFromUtf8(args.GetIsolate(), "transcodingUsers", NewStringType::kInternalized).ToLocalChecked();
                    Local<Value> objUsers = obj->Get(args.GetIsolate()->GetCurrentContext(), keyName).ToLocalChecked();
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
                        Local<Value> value = usersValue->Get(i);
                        Local<Object> userObj = value->ToObject(args.GetIsolate());
                        if (userObj->IsNull()) {
                            status = napi_invalid_arg;
                            break;
                        }
                        napi_get_object_property_uid_(args.GetIsolate(), userObj, "uid", users[i].uid);
                        napi_get_object_property_int32_(args.GetIsolate(), userObj, "x", users[i].x);
                        napi_get_object_property_int32_(args.GetIsolate(), userObj, "y", users[i].y);
                        napi_get_object_property_int32_(args.GetIsolate(), userObj, "width", users[i].width);
                        napi_get_object_property_int32_(args.GetIsolate(), userObj, "height", users[i].height);
                        napi_get_object_property_int32_(args.GetIsolate(), userObj, "zOrder", users[i].zOrder);
                        napi_get_object_property_double_(args.GetIsolate(), userObj, "alpha", users[i].alpha);
                        napi_get_object_property_int32_(args.GetIsolate(), userObj, "audioChannel", users[i].audioChannel);
                    }
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
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring url;
                InjectStreamConfig config;
                status = napi_get_value_nodestring_(args[0], url);
                CHECK_NAPI_STATUS(pEngine, status);
                Local<Object> configObj = args[1]->ToObject(args.GetIsolate());
                int audioSampleRate;
                napi_get_object_property_int32_(args.GetIsolate(), configObj, "width", config.width);
                napi_get_object_property_int32_(args.GetIsolate(), configObj, "height", config.height);
                napi_get_object_property_int32_(args.GetIsolate(), configObj, "videoGop", config.videoGop);
                napi_get_object_property_int32_(args.GetIsolate(), configObj, "videoFramerate", config.videoFramerate);
                napi_get_object_property_int32_(args.GetIsolate(), configObj, "videoBitrate", config.videoBitrate);
                if (napi_get_object_property_int32_(args.GetIsolate(), configObj, "audioSampleRate", audioSampleRate) == napi_ok) {
                    config.audioSampleRate = (AUDIO_SAMPLE_RATE_TYPE)audioSampleRate;
                }
                napi_get_object_property_int32_(args.GetIsolate(), configObj, "audioBitrate", config.audioBitrate);
                napi_get_object_property_int32_(args.GetIsolate(), configObj, "audioChannels", config.audioChannels);
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
                Local<Object> obj = args[1]->ToObject();

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

                Local<Object> obj = args[0]->ToObject();

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

                Local<Object> obj = args[0]->ToObject();
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
                if (pEngine->m_videoSourceSink.get())
                    pEngine->m_videoSourceSink->join(key, name, chan_info, uid);
                result = 0;
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
                if (pEngine->m_videoSourceSink.get())
                    pEngine->m_videoSourceSink->leave();
                result = 0;
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
                if (pEngine->m_videoSourceSink.get())
                    pEngine->m_videoSourceSink->renewVideoSourceToken(token);
                result = 0;
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

                if (pEngine->m_videoSourceSink.get())
                    pEngine->m_videoSourceSink->setVideoSourceChannelProfile((agora::rtc::CHANNEL_PROFILE_TYPE)profile, permissionKey);
                result = 0;
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
                if (pEngine->m_videoSourceSink.get())
                    pEngine->m_videoSourceSink->setVideoSourceVideoProfile((agora::rtc::VIDEO_PROFILE_TYPE)profile, swapWidthAndHeight);
                result = 0;
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

                Local<Object> rect = args[2]->ToObject(args.GetIsolate());
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
               
                if (pEngine->m_videoSourceSink.get())
                    pEngine->m_videoSourceSink->captureScreen(windowId, captureFreq, &region, bitrate);
                result = 0;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, stopScreenCapture2)
        {
            LOG_ENTER;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                if (pEngine->m_videoSourceSink.get())
                    pEngine->m_videoSourceSink->stopCaptureScreen();
                napi_set_int_result(args, 0);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceSetLogFile)
        {
            LOG_ENTER;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                NodeString file;
                napi_status status = napi_get_value_nodestring_(args[0], file);
                CHECK_NAPI_STATUS(pEngine, status);
                if (pEngine->m_videoSourceSink.get())
                    pEngine->m_videoSourceSink->setLogFile(file);
                napi_set_int_result(args, 0);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceRelease)
        {
            LOG_ENTER;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                if (pEngine->m_videoSourceSink.get())
                    pEngine->m_videoSourceSink->release();
                napi_set_int_result(args, 0);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceStartPreview)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                if (pEngine->m_videoSourceSink.get())
                    pEngine->m_videoSourceSink->startPreview();
                napi_set_int_result(args, 0);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceStopPreview)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                if (pEngine->m_videoSourceSink.get())
                    pEngine->m_videoSourceSink->stopPreview();
                napi_set_int_result(args, 0);
            } while (false);
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
                
                if(pEngine->m_videoSourceSink.get())
                    pEngine->m_videoSourceSink->enableWebSdkInteroperability(enabled);
                result = 0;
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
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                
                nodestring param;
                napi_status status = napi_ok;
                status = napi_get_value_nodestring_(args[0], param);
                CHECK_NAPI_STATUS(pEngine, status);
                if(pEngine->m_videoSourceSink.get())
                    pEngine->m_videoSourceSink->setParameters(param);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, videoSourceUpdateScreenCaptureRegion)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                int top, left, bottom, right;
                Local<Object> rect = args[0]->ToObject(args.GetIsolate());
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
                if(pEngine->m_videoSourceSink.get())
                    pEngine->m_videoSourceSink->updateScreenCapture(&region);
            } while (false);
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
                Local<Object> screenRectObj = args[0]->ToObject();

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
                Local<Object> displayIdObj = args[0]->ToObject();
                status = napi_get_object_property_uint32_(isolate, displayIdObj, "id", screen.idVal);
                CHECK_NAPI_STATUS(pEngine, status);
#endif   

                // regionRect
                if(!args[1]->IsObject()) {
                    status = napi_invalid_arg;
                    CHECK_NAPI_STATUS(pEngine, status);
                }
                Local<Object> obj = args[1]->ToObject();

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
                obj = args[2]->ToObject();
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

                if (pEngine->m_videoSourceSink.get())
                    pEngine->m_videoSourceSink->startScreenCaptureByScreen(screen, regionRect, captureParams);
                result = 0;
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
                Local<Object> obj = args[1]->ToObject();

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
                obj = args[2]->ToObject();
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

                if (pEngine->m_videoSourceSink.get())
                    pEngine->m_videoSourceSink->startScreenCaptureByWindow(windowId, regionRect, captureParams);
                result = 0;
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
                Local<Object> obj = args[0]->ToObject();
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

                if (pEngine->m_videoSourceSink.get())
                    pEngine->m_videoSourceSink->updateScreenCaptureParameters(captureParams);
                result = 0;
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

                if (pEngine->m_videoSourceSink.get())
                    pEngine->m_videoSourceSink->setScreenCaptureContentHint(hint);
                result = 0;
            } while (false);
            napi_set_int_result(args, result);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, leaveChannel)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int result = pEngine->m_engine->leaveChannel();
                args.GetReturnValue().Set(Integer::New(args.GetIsolate(), result));
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, enableLocalAudio)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                bool enable;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status = napi_get_value_bool_(args[0], enable);
                CHECK_NAPI_STATUS(pEngine, status);
                int result = pEngine->m_engine->enableLocalAudio(enable);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, renewToken)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                NodeString newkey;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status = napi_get_value_nodestring_(args[0], newkey);
                CHECK_NAPI_STATUS(pEngine, status);

                int result = pEngine->m_engine->renewToken(newkey);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, registerDeliverFrame)
        {
            LOG_ENTER;
            do {
                Isolate *isolate = args.GetIsolate();
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                NodeVideoFrameTransporter* pTransporter = getNodeVideoFrameTransporter();
                if(pTransporter) {
                    pTransporter->initialize(isolate, args);
                }
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, initialize)
        {
            LOG_ENTER;            
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
            } while (false);
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
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                nodestring mode;
                napi_status status = napi_get_value_nodestring_(args[0], mode);
                CHECK_NAPI_STATUS(pEngine, status);

                int result = pEngine->m_engine->setEncryptionMode(mode);
                napi_set_int_result(args, result);
            } while (false);
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
               
                int result = pEngine->m_engine->joinChannel(key, name, extra_info.c_str(), uid);
                args.GetReturnValue().Set(Integer::New(args.GetIsolate(), result));
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setChannelProfile)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status = napi_ok;
                unsigned int profile = 0;
                status = napi_get_value_uint32_(args[0], profile);
                CHECK_NAPI_STATUS(pEngine, status);
                int result = pEngine->m_engine->setChannelProfile(CHANNEL_PROFILE_TYPE(profile));
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setClientRole)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status = napi_ok;
                unsigned int role;
                status = napi_get_value_uint32_(args[0], role);
                CHECK_NAPI_STATUS(pEngine, status);
                int result = pEngine->m_engine->setClientRole(CLIENT_ROLE_TYPE(role));
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setVideoProfile)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status = napi_ok;
                unsigned int profile;
                bool swapWandH;
                napi_get_param_2(args, uint32, profile, bool, swapWandH);
                CHECK_NAPI_STATUS(pEngine, status);
                int result = pEngine->m_engine->setVideoProfile(VIDEO_PROFILE_TYPE(profile), swapWandH);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setVideoEncoderConfiguration)
        {
            LOG_ENTER;
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
                Local<Object> obj = args[0]->ToObject();
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

                switch(frameRateVal) {
                    case 1:
                        frameRate = FRAME_RATE_FPS_1;
                        break;
                    case 7:
                        frameRate = FRAME_RATE_FPS_7;
                        break;
                    case 10:
                        frameRate = FRAME_RATE_FPS_10;
                        break;
                    case 15:
                        frameRate = FRAME_RATE_FPS_15;
                        break;
                    case 24:
                        frameRate = FRAME_RATE_FPS_24;
                        break;
                    case 30:
                        frameRate = FRAME_RATE_FPS_30;
                        break;
                    case 60:
                        frameRate = FRAME_RATE_FPS_60;
                        break;
                    default:
                        status = napi_invalid_arg;
                        break;
                }
                CHECK_NAPI_STATUS(pEngine, status);
                config.frameRate = frameRate;

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

                int result = pEngine->m_engine->setVideoEncoderConfiguration(config);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setAudioProfile)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status = napi_ok;
                unsigned int profile, scenario;
                napi_get_param_2(args, uint32, profile, uint32, scenario);
                CHECK_NAPI_STATUS(pEngine, status);

                int result = pEngine->m_engine->setAudioProfile(AUDIO_PROFILE_TYPE(profile), AUDIO_SCENARIO_TYPE(scenario));
                napi_set_int_result(args, result);
            } while (false);
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

                int result = pEngine->m_engine->rate(callId, rating, desc);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, complain)
        {
            LOG_ENTER;
            NodeString callId, desc;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_status status = napi_ok;

                napi_get_value_nodestring_(args[0], callId);
                CHECK_NAPI_STATUS(pEngine, status);
                napi_get_value_nodestring_(args[1], desc);
                CHECK_NAPI_STATUS(pEngine, status);

                int result = pEngine->m_engine->complain(callId, desc);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setEncryptionSecret)
        {
            LOG_ENTER;
            NodeString secret;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                napi_status status = napi_ok;
                CHECK_NATIVE_THIS(pEngine);
                napi_get_value_nodestring_(args[0], secret);
                CHECK_NAPI_STATUS(pEngine, status);

                int result = pEngine->m_engine->setEncryptionSecret(secret);
                napi_set_int_result(args, result);
            } while (false);
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

                pEngine->m_engine->createDataStream(&streamId, reliable, ordered);
                napi_set_int_result(args, streamId);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, sendStreamMessage)
        {
            LOG_ENTER;
            NodeString msg;
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
                int result = pEngine->m_engine->sendStreamMessage(streamId, msg, strlen(msg));
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, muteRemoteAudioStream)
        {
            LOG_ENTER;
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
                int result = rep.muteRemoteAudioStream(uid, mute);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, subscribe)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                uid_t uid;
                status = NodeUid::getUidFromNodeValue(args[0], uid);
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
                pEngine->m_engine->setupRemoteVideo(canvas);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, unsubscribe)
        {
            LOG_ENTER;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                uid_t uid;
                status = NodeUid::getUidFromNodeValue(args[0], uid);
                CHECK_NAPI_STATUS(pEngine, status);
                VideoCanvas canvas;
                canvas.uid = uid;
                pEngine->m_engine->setupRemoteVideo(canvas);
                args.GetReturnValue().Set(0);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setupLocalVideo)
        {
            LOG_ENTER;
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
            } while (false);
            LOG_LEAVE;
        }
        
        NAPI_API_DEFINE(NodeRtcEngine, setVideoRenderDimension)
        {
            LOG_ENTER;
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
                }
            }while(false);
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
                int result = rep.muteRemoteVideoStream(uid, mute);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setRemoteVideoStreamType)
        {
            LOG_ENTER;
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
                int result = rep.setRemoteVideoStreamType(uid, REMOTE_VIDEO_STREAM_TYPE(streamType));
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setRemoteDefaultVideoStreamType)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine;
                napi_status status = napi_ok;
                int streamType;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_get_param_1(args, int32, streamType);
                CHECK_NAPI_STATUS(pEngine, status);

                RtcEngineParameters rep(pEngine->m_engine);
                int result = rep.setRemoteDefaultVideoStreamType(REMOTE_VIDEO_STREAM_TYPE(streamType));
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, enableAudioVolumeIndication)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                int interval, smooth;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_get_param_2(args, int32, interval, int32, smooth);
                CHECK_NAPI_STATUS(pEngine, status);

                RtcEngineParameters rep(pEngine->m_engine);
                int result = rep.enableAudioVolumeIndication(interval, smooth);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, startAudioRecording)
        {
            LOG_ENTER;
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
                int result = rep.startAudioRecording(filePath, AUDIO_RECORDING_QUALITY_TYPE(quality));
                napi_set_int_result(args, result);
            } while (false);

            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, startAudioMixing)
        {
            LOG_ENTER;
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
                int result = rep.startAudioMixing(filepath, loopback, replace, cycle);
                napi_set_int_result(args, result);
            } while (false);
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

        NAPI_API_DEFINE(NodeRtcEngine, setRecordingAudioFrameParameters)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int sampleRate, channel, mode, samplesPerCall;
                napi_get_param_4(args, int32, sampleRate, int32, channel, int32, mode, int32, samplesPerCall);
                CHECK_NAPI_STATUS(pEngine, status);

                RtcEngineParameters rep(pEngine->m_engine);
                int result = rep.setRecordingAudioFrameParameters(sampleRate, channel, RAW_AUDIO_FRAME_OP_MODE_TYPE(mode), samplesPerCall);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setPlaybackAudioFrameParameters)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                int sampleRate, channel, mode, samplesPerCall;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_get_param_4(args, int32, sampleRate, int32, channel, int32, mode, int32, samplesPerCall);
                CHECK_NAPI_STATUS(pEngine, status);

                RtcEngineParameters rep(pEngine->m_engine);
                int result = rep.setPlaybackAudioFrameParameters(sampleRate, channel, RAW_AUDIO_FRAME_OP_MODE_TYPE(mode), samplesPerCall);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setMixedAudioFrameParameters)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                int sampleRate, samplesPerCall;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_get_param_2(args, int32, sampleRate, int32, samplesPerCall);
                CHECK_NAPI_STATUS(pEngine, status);

                RtcEngineParameters rep(pEngine->m_engine);
                int result = rep.setMixedAudioFrameParameters(sampleRate, samplesPerCall);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setHighQualityAudioParameters)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                bool fullband, stereo, fullBitrate;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                napi_get_param_3(args, bool, fullband, bool, stereo, bool, fullBitrate);
                CHECK_NAPI_STATUS(pEngine, status);

                RtcEngineParameters rep(pEngine->m_engine);
                int result = rep.setHighQualityAudioParameters(fullband, stereo, fullBitrate);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }
#if defined(__APPLE__) || defined(_WIN32)
        NAPI_API_DEFINE(NodeRtcEngine, startScreenCapture)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
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
                
                Local<Object> rect = args[2]->ToObject(args.GetIsolate());
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
                int result = pEngine->m_engine->startScreenCapture(windowId, captureFreq, &region, bitrate); 
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, stopScreenCapture)
        {
            LOG_ENTER;
            do 
            {
                NodeRtcEngine *pEngine = nullptr;
                napi_status status = napi_ok;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                int result = pEngine->m_engine->stopScreenCapture();
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }
        
        NAPI_API_DEFINE(NodeRtcEngine, updateScreenCaptureRegion)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                int top, left, bottom, right; 
                Local<Object> rect = args[0]->ToObject(args.GetIsolate());
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

                pEngine->m_engine->updateScreenCaptureRegion(&region);
            } while (false);
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
                persist.Reset(args.GetIsolate(), callback);
                Local<Object> obj = args.This();
                Persistent<Object> persistObj;
                persistObj.Reset(args.GetIsolate(), obj);
                pEngine->m_eventHandler->addEventHandler((char*)eventName, persistObj, persist);
            } while (false);
            //LOG_LEAVE;
        }


        NAPI_API_DEFINE(NodeRtcEngine, getVideoDevices)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                if (!pEngine->m_videoVdm) {
                    pEngine->m_videoVdm = new AVideoDeviceManager(pEngine->m_engine);
                }
                IVideoDeviceManager* vdm = pEngine->m_videoVdm->get();
                auto vdc =vdm->enumerateVideoDevices();
                int count = vdc ? vdc->getCount() : 0;
                Local<v8::Array> devices = v8::Array::New(args.GetIsolate(), count);
                char deviceName[MAX_DEVICE_ID_LENGTH] = { 0 };
                char deviceId[MAX_DEVICE_ID_LENGTH] = { 0 };
                for (int i = 0; i < count; i++) {
                    Local<v8::Object> dev = v8::Object::New(args.GetIsolate());
                    vdc->getDevice(i, deviceName, deviceId);
                    auto dn = v8::String::NewFromUtf8(args.GetIsolate(), deviceName, NewStringType::kInternalized).ToLocalChecked();
                    auto di = v8::String::NewFromUtf8(args.GetIsolate(), deviceId, NewStringType::kInternalized).ToLocalChecked();
                    dev->Set(v8::String::NewFromUtf8(args.GetIsolate(), "devicename", NewStringType::kInternalized).ToLocalChecked(), dn);
                    dev->Set(v8::String::NewFromUtf8(args.GetIsolate(), "deviceid", NewStringType::kInternalized).ToLocalChecked(), di);
                    devices->Set(i, dev);
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
                int result = vdm->setDevice(deviceId);
                napi_set_int_result(args, result);
            } while (false);
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
                vdm->getDevice(deviceId);
                napi_set_string_result(args, deviceId);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, startVideoDeviceTest)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                auto context = new NodeRenderContext(NODE_RENDER_TYPE_DEVICE_TEST);
                
                if (!pEngine->m_videoVdm) {
                    pEngine->m_videoVdm = new AVideoDeviceManager(pEngine->m_engine);
                }
                IVideoDeviceManager* vdm = pEngine->m_videoVdm->get();
                vdm->startDeviceTest(context);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, stopVideoDeviceTest)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
               
                if (!pEngine->m_videoVdm) {
                    pEngine->m_videoVdm = new AVideoDeviceManager(pEngine->m_engine);
                }
                IVideoDeviceManager* vdm = pEngine->m_videoVdm->get();
                vdm->stopDeviceTest();
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getAudioPlaybackDevices)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
              
                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                auto pdc = adm->enumeratePlaybackDevices();
                int count = pdc ? pdc->getCount() : 0;
                Local<v8::Array> devices = v8::Array::New(args.GetIsolate(), count);
                char deviceName[MAX_DEVICE_ID_LENGTH] = { 0 };
                char deviceId[MAX_DEVICE_ID_LENGTH] = { 0 };
                for (int i = 0; i < count; i++) {
                    Local<v8::Object> dev = v8::Object::New(args.GetIsolate());
                    pdc->getDevice(i, deviceName, deviceId);
                    auto dn = v8::String::NewFromUtf8(args.GetIsolate(), deviceName, NewStringType::kInternalized).ToLocalChecked();
                    auto di = v8::String::NewFromUtf8(args.GetIsolate(), deviceId, NewStringType::kInternalized).ToLocalChecked();
                    dev->Set(v8::String::NewFromUtf8(args.GetIsolate(), "devicename", NewStringType::kInternalized).ToLocalChecked(), dn);
                    dev->Set(v8::String::NewFromUtf8(args.GetIsolate(), "deviceid", NewStringType::kInternalized).ToLocalChecked(), di);
                    devices->Set(i, dev);
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
                int result = adm->setPlaybackDevice(deviceId);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getPlaybackDeviceInfo)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                auto pdc = adm->enumeratePlaybackDevices();
                int count = pdc ? pdc->getCount() : 0;
               
                char deviceName[MAX_DEVICE_ID_LENGTH] = { 0 };
                char deviceId[MAX_DEVICE_ID_LENGTH] = { 0 };
                if (count > 0) {
                    Local<v8::Array> devices = v8::Array::New(args.GetIsolate(), 1);
                    Local<v8::Object> dev = v8::Object::New(args.GetIsolate());
                    adm->getPlaybackDeviceInfo(deviceId, deviceName);

                    auto dn = v8::String::NewFromUtf8(args.GetIsolate(), deviceName, NewStringType::kInternalized).ToLocalChecked();
                    auto di = v8::String::NewFromUtf8(args.GetIsolate(), deviceId, NewStringType::kInternalized).ToLocalChecked();
                    dev->Set(v8::String::NewFromUtf8(args.GetIsolate(), "devicename", NewStringType::kInternalized).ToLocalChecked(), dn);
                    dev->Set(v8::String::NewFromUtf8(args.GetIsolate(), "deviceid", NewStringType::kInternalized).ToLocalChecked(), di);
                    devices->Set(0, dev);
                    deviceName[0] = '\0';
                    deviceId[0] = '\0';
                    args.GetReturnValue().Set(devices);
                }   
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
                adm->getPlaybackDevice(deviceId);
                napi_set_string_result(args, deviceId);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setAudioPlaybackVolume)
        {
            LOG_ENTER;
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
                int result = adm->setPlaybackDeviceVolume(volume);
                napi_set_int_result(args, result);
            } while (false);
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
                adm->getPlaybackDeviceVolume(&volume);
                napi_set_int_result(args, volume);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getAudioRecordingDevices)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
               
                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                auto pdc = adm->enumerateRecordingDevices();
                int count = pdc ? pdc->getCount() : 0;
                Local<v8::Array> devices = v8::Array::New(args.GetIsolate(), count);
                char deviceName[MAX_DEVICE_ID_LENGTH] = { 0 };
                char deviceId[MAX_DEVICE_ID_LENGTH] = { 0 };
                for (int i = 0; i < count; i++) {
                    Local<v8::Object> dev = v8::Object::New(args.GetIsolate());
                    pdc->getDevice(i, deviceName, deviceId);
                    auto dn = v8::String::NewFromUtf8(args.GetIsolate(), deviceName, NewStringType::kInternalized).ToLocalChecked();
                    auto di = v8::String::NewFromUtf8(args.GetIsolate(), deviceId, NewStringType::kInternalized).ToLocalChecked();
                    dev->Set(v8::String::NewFromUtf8(args.GetIsolate(), "devicename", NewStringType::kInternalized).ToLocalChecked(), dn);
                    dev->Set(v8::String::NewFromUtf8(args.GetIsolate(), "deviceid", NewStringType::kInternalized).ToLocalChecked(), di);
                    devices->Set(i, dev);
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
                int result = adm->setRecordingDevice(deviceId);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, getRecordingDeviceInfo)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);

                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                auto pdc = adm->enumerateRecordingDevices();
                int count = pdc ? pdc->getCount() : 0;

                char deviceName[MAX_DEVICE_ID_LENGTH] = { 0 };
                char deviceId[MAX_DEVICE_ID_LENGTH] = { 0 };
                if (count > 0) {
                    Local<v8::Array> devices = v8::Array::New(args.GetIsolate(), 1);
                    Local<v8::Object> dev = v8::Object::New(args.GetIsolate());
                    adm->getRecordingDeviceInfo(deviceId, deviceName);

                    auto dn = v8::String::NewFromUtf8(args.GetIsolate(), deviceName, NewStringType::kInternalized).ToLocalChecked();
                    auto di = v8::String::NewFromUtf8(args.GetIsolate(), deviceId, NewStringType::kInternalized).ToLocalChecked();
                    dev->Set(v8::String::NewFromUtf8(args.GetIsolate(), "devicename", NewStringType::kInternalized).ToLocalChecked(), dn);
                    dev->Set(v8::String::NewFromUtf8(args.GetIsolate(), "deviceid", NewStringType::kInternalized).ToLocalChecked(), di);
                    devices->Set(0, dev);
                    deviceName[0] = '\0';
                    deviceId[0] = '\0';
                    args.GetReturnValue().Set(devices);
                }
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
                adm->getRecordingDevice(deviceId);
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
                adm->getRecordingDeviceVolume(&volume);
                napi_set_int_result(args, volume);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setAudioRecordingVolume)
        {
            LOG_ENTER;
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
                int result = adm->setRecordingDeviceVolume(volume);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, startAudioPlaybackDeviceTest)
        {
            LOG_ENTER;
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
                int result = adm->startPlaybackDeviceTest(filePath);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, stopAudioPlaybackDeviceTest)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
               
                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                int result = adm->stopPlaybackDeviceTest();
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, startAudioRecordingDeviceTest)
        {
            LOG_ENTER;
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
                int result = adm->startRecordingDeviceTest(indicateInterval);
                napi_set_int_result(args, result);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, stopAudioRecordingDeviceTest)
        {
            LOG_ENTER;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
               
                if (!pEngine->m_audioVdm) {
                    pEngine->m_audioVdm = new AAudioDeviceManager(pEngine->m_engine);
                }
                IAudioDeviceManager* adm = pEngine->m_audioVdm->get();
                int result = adm->stopRecordingDeviceTest();
                napi_set_int_result(args, result);
            } while (false);
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
                adm->getPlaybackDeviceMute(&mute);
                napi_set_bool_result(args, mute);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setAudioPlaybackDeviceMute)
        {
            LOG_ENTER;
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
                int result = adm->setPlaybackDeviceMute(mute);
                napi_set_int_result(args, result);
            } while (false);
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
                adm->getRecordingDeviceMute(&mute);
                napi_set_bool_result(args, mute);
            } while (false);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, setAudioRecordingDeviceMute)
        {
            LOG_ENTER;
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
                int result = adm->setRecordingDeviceMute(mute);
                napi_set_int_result(args, result);
            } while (false);
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
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                
                Isolate* isolate = pEngine->getIsolate();
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

                    infos->Set(i, obj);
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
                    
                    infos->Set(i, obj);
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
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                
                Isolate* isolate = pEngine->getIsolate();
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
                    obj->Set(propName, displayIdObj);

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

                    infos->Set(i, obj);
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
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                Isolate *isolate = args.GetIsolate();

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
                obj->Set(propName, userObj);
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
                Isolate *isolate = args.GetIsolate();

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
                obj->Set(propName, userObj);
                args.GetReturnValue().Set(obj);
            } while (false);
            LOG_LEAVE;
        }
    }
}
