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
                PROPERTY_METHOD_DEFINE(muteRemoteAudioStream)
                PROPERTY_METHOD_DEFINE(muteLocalVideoStream)
                PROPERTY_METHOD_DEFINE(enableLocalVideo)
                PROPERTY_METHOD_DEFINE(muteAllRemoteVideoStreams)
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
                PROPERTY_METHOD_DEFINE(getAudioMixingDuration)
                PROPERTY_METHOD_DEFINE(getAudioMixingCurrentPosition)
                PROPERTY_METHOD_DEFINE(setAudioMixingPosition)
                PROPERTY_METHOD_DEFINE(setLocalVoicePitch)
                PROPERTY_METHOD_DEFINE(setInEarMonitoringVolume)
                PROPERTY_METHOD_DEFINE(setAudioProfile)
                PROPERTY_METHOD_DEFINE(pauseAudio)
                PROPERTY_METHOD_DEFINE(resumeAudio)
                PROPERTY_METHOD_DEFINE(setExternalAudioSource)
                PROPERTY_METHOD_DEFINE(startScreenCapture)
                PROPERTY_METHOD_DEFINE(stopScreenCapture)
                PROPERTY_METHOD_DEFINE(updateScreenCaptureRegion)
                PROPERTY_METHOD_DEFINE(setLogFile)
                PROPERTY_METHOD_DEFINE(setLogFilter)
                PROPERTY_METHOD_DEFINE(setLocalVideoMirrorMode)
                PROPERTY_METHOD_DEFINE(startRecordingService)
                PROPERTY_METHOD_DEFINE(stopRecordingService)
                PROPERTY_METHOD_DEFINE(refreshRecordingServiceStatus)
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
                PROPERTY_METHOD_DEFINE(getCurrentAudioPlaybackDevice)
                PROPERTY_METHOD_DEFINE(setAudioPlaybackVolume)
                PROPERTY_METHOD_DEFINE(getAudioPlaybackVolume)
                PROPERTY_METHOD_DEFINE(getAudioRecordingDevices)
                PROPERTY_METHOD_DEFINE(setAudioRecordingDevice)
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
#if 0
                PROPERTY_METHOD_DEFINE(setVideoCompositingLayout)
                PROPERTY_METHOD_DEFINE(clearVideoCompositingLayout)
                PROPERTY_METHOD_DEFINE(configPublisher)
#endif
                PROPERTY_METHOD_DEFINE(startScreenCapture2)
                PROPERTY_METHOD_DEFINE(stopScreenCatpure2)
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
                delete[] m_audioVdm;
                m_audioVdm = nullptr;
            }
            if (m_videoVdm) {
                delete[] m_videoVdm;
                m_videoVdm = nullptr;
            }
            if (m_engine) {
                m_engine->release();
                m_engine = nullptr;
            }
            m_videoSourceSink.reset(nullptr);
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

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_0(refreshRecordingServiceStatus);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(muteLocalAudioStream, bool);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(muteAllRemoteAudioStreams, bool);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(muteLocalVideoStream, bool);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(enableLocalVideo, bool);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(muteAllRemoteVideoStreams, bool);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(adjustAudioMixingVolume, int32);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(setAudioMixingPosition, int32);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(setLocalVoicePitch, double);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(setInEarMonitoringVolume, int32);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(setLogFile, nodestring);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(setLogFilter, uint32);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(startRecordingService, nodestring);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(stopRecordingService, nodestring);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(enableDualStreamMode, bool);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(adjustRecordingSignalVolume, int32);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(adjustPlaybackSignalVolume, int32);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(enableWebSdkInteroperability, bool);

        NAPI_API_DEFINE_WRAPPER_SET_PARAMETER_1(setVideoQualityParameters, bool);
#if 0
        NAPI_API_DEFINE(NodeRtcEngine, configPublisher)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
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
                pEngine->m_engine->configPublisher(config);
            } while (false);
            napi_set_int_result(args, status);
            LOG_LEAVE;
        }

        
        NAPI_API_DEFINE(NodeRtcEngine, setVideoCompositingLayout)
        {
            LOG_ENTER;
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
                    if (objUsers.IsEmpty() || !objUsers->IsArray()) {
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
                        if (regionObj.IsEmpty())
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
                pEngine->m_engine->setVideoCompositingLayout(layout);
            } while (false);
            if (regions) {
                delete[] regions;
            }
            napi_set_int_result(args, status);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, clearVideoCompositingLayout)
        {
            LOG_ENTER;
            napi_status status = napi_ok;
            do{
                pEngine->m_engine->clearVideoCompositingLayout();
            } while (false);
             napi_set_int_result(args, status);
            LOG_LEAVE;
        }
#endif
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
                status = napi_get_value_bool_(args[0], enable);
                CHECK_NAPI_STATUS(pEngine, status);
                RtcEngineParameters param(pEngine->m_engine);
                //result = param.enableLoopbackRecording(enable);
				result = node_generic_error;
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
            } while (false);
            napi_set_int_result(args, status);
            LOG_LEAVE;
        }

        NAPI_API_DEFINE(NodeRtcEngine, stopScreenCatpure2)
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
#if defined(_WIN32)
                int result = pEngine->m_engine->renewChannelKey(newkey);
#elif defined(__APPLE__)
                int result = pEngine->m_engine->renewToken(newkey);
#endif
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
#if defined(_WIN32)
                NodeString permissionKey;
                status = napi_get_value_nodestring_(args[1], permissionKey);
                int result = pEngine->m_engine->setClientRole(CLIENT_ROLE_TYPE(role), permissionKey);
#elif defined(__APPLE__)
                int result = pEngine->m_engine->setClientRole(CLIENT_ROLE_TYPE(role));
#endif
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
                }
            }while(false);
            napi_set_int_result(args, status);
            LOG_LEAVE;
        }
        
        NAPI_API_DEFINE(NodeRtcEngine, setFPS)
        {
            LOG_ENTER;
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
                if(pTransporter)
                    pTransporter->setFPS(fps);
            } while(false);
            napi_set_int_result(args, status);
            LOG_LEAVE;
        }
        
        NAPI_API_DEFINE(NodeRtcEngine, addToHighVideo)
        {
            LOG_ENTER;
            napi_status status = napi_invalid_arg;
            do {
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                agora::rtc::uid_t uid;
                status = NodeUid::getUidFromNodeValue(args[0], uid);
                CHECK_NAPI_STATUS(pEngine, status);
                auto pTransporter = getNodeVideoFrameTransporter();
                if(pTransporter)
                    pTransporter->addToHighVideo(uid);
            }while(false);
            napi_set_int_result(args, status);
            LOG_LEAVE;
        }
        
        NAPI_API_DEFINE(NodeRtcEngine, removeFromHighVideo)
        {
            LOG_ENTER;
            napi_status status = napi_invalid_arg;
            do{
                NodeRtcEngine *pEngine = nullptr;
                napi_get_native_this(args, pEngine);
                CHECK_NATIVE_THIS(pEngine);
                agora::rtc::uid_t uid;
                status = NodeUid::getUidFromNodeValue(args[0], uid);
                CHECK_NAPI_STATUS(pEngine, status);
                auto pTransporter = getNodeVideoFrameTransporter();
                if(pTransporter)
                    pTransporter->removeFromeHighVideo(uid);
            }while (false);
            napi_set_int_result(args, status);
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
#if defined(_WIN32)
                RtcEngineParameters rep(pEngine->m_engine);
                int result = rep.startScreenCapture(windowId, captureFreq, &region);
#elif defined(__APPLE__)
                int result = pEngine->m_engine->startScreenCapture(windowId, captureFreq, &region, bitrate);
#endif
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

#if defined(_WIN32)
                RtcEngineParameters rep(pEngine->m_engine);
                int result = rep.stopScreenCapture();
#elif defined(__APPLE__)
                int result = pEngine->m_engine->stopScreenCapture();
#endif
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
#if defined(_WIN32)
                RtcEngineParameters rep(pEngine->m_engine);
                rep.updateScreenCaptureRegion(&region);
#elif defined(__APPLE__)
                pEngine->m_engine->updateScreenCaptureRegion(&region);
#endif	           
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
    }
}
