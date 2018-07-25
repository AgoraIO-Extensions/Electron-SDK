/*
* Copyright (c) 2017 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2017
*/

#include "node_event_handler.h"
#include "node_log.h"
#include <stdio.h>
#include "node_uid.h"
#include "agora_rtc_engine.h"
#include "uv.h"
#include "node_async_queue.h"
namespace agora {
    namespace rtc {

#define FUNC_TRACE 

        NodeEventHandler::NodeEventHandler(NodeRtcEngine *pEngine)
            : m_engine(pEngine)
        {
        }

        NodeEventHandler::~NodeEventHandler() 
        {
            for (auto& handler : m_callbacks) {
                delete handler.second;
            }
        }

#define MAKE_JS_CALL_0(ev) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            NodeEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(cb.js_this.Get(isolate), 0, nullptr);\
        }

#define MAKE_JS_CALL_1(ev, type, param) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            Local<Value> argv[1]{ napi_create_##type##_(isolate, param)\
                                };\
            NodeEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(cb.js_this.Get(isolate), 1, argv);\
        }

#define MAKE_JS_CALL_2(ev, type1, param1, type2, param2) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            Local<Value> argv[2]{ napi_create_##type1##_(isolate, param1),\
                                  napi_create_##type2##_(isolate, param2)\
                                };\
            NodeEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(cb.js_this.Get(isolate), 2, argv);\
        }

#define MAKE_JS_CALL_3(ev, type1, param1, type2, param2, type3, param3) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            Local<Value> argv[3]{ napi_create_##type1##_(isolate, param1),\
                                  napi_create_##type2##_(isolate, param2),\
                                  napi_create_##type3##_(isolate, param3) \
                                };\
            NodeEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(cb.js_this.Get(isolate), 3, argv);\
        }

#define MAKE_JS_CALL_4(ev, type1, param1, type2, param2, type3, param3, type4, param4) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            Local<Value> argv[4]{ napi_create_##type1##_(isolate, param1),\
                                  napi_create_##type2##_(isolate, param2),\
                                  napi_create_##type3##_(isolate, param3), \
                                  napi_create_##type4##_(isolate, param4), \
                                };\
            NodeEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(cb.js_this.Get(isolate), 4, argv);\
        }

#define MAKE_JS_CALL_5(ev, type1, param1, type2, param2, type3, param3, type4, param4, type5, param5) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            Local<Value> argv[5]{ napi_create_##type1##_(isolate, param1),\
                                  napi_create_##type2##_(isolate, param2),\
                                  napi_create_##type3##_(isolate, param3), \
                                  napi_create_##type4##_(isolate, param4), \
                                  napi_create_##type5##_(isolate, param5), \
                                };\
            NodeEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(cb.js_this.Get(isolate), 5, argv);\
        }

#define CHECK_NAPI_OBJ(obj) \
    if (obj.IsEmpty()) \
        break;

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

        void NodeEventHandler::onJoinChannelSuccess_node(const char* channel, uid_t id, int elapsed)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_JOIN_CHANNEL, string, channel, uid, id, int32, elapsed);
        }

        void NodeEventHandler::onJoinChannelSuccess(const char* channel, uid_t uid, int elapsed)
        {
            FUNC_TRACE;
            std::string channelName = channel;
            node_async_call::async_call([this, channelName, uid, elapsed]() {
                this->onJoinChannelSuccess_node(channelName.c_str(), uid, elapsed);
            });
        }

        void NodeEventHandler::onRejoinChannelSuccess_node(const char* channel, uid_t uid, int elapsed)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_REJOIN_CHANNEL, string, channel, uid, uid, int32, elapsed);
        }

        void NodeEventHandler::onRejoinChannelSuccess(const char* channel, uid_t uid, int elapsed)
        {
            FUNC_TRACE;
            std::string channelName(channel);
            node_async_call::async_call([this, channelName, uid, elapsed]() {
                this->onRejoinChannelSuccess_node(channelName.c_str(), uid, elapsed);
            });
        }

        void NodeEventHandler::onWarning_node(int warn, const char* msg)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_2(RTC_EVENT_WARNING, int32, warn, string, msg);
        }

        void NodeEventHandler::onWarning(int warn, const char* msg)
        {
            FUNC_TRACE;
            std::string message;
            if (msg)
                message.assign(msg);
            node_async_call::async_call([this, warn, message]() {
                this->onWarning_node(warn, message.c_str());
            });
        }

        void NodeEventHandler::onError_node(int err, const char* msg)
        {
            MAKE_JS_CALL_2(RTC_EVENT_ERROR, int32, err, string, msg);
        }

        void NodeEventHandler::onError(int err, const char* msg)
        {
            std::string errorDesc;
            if (msg)
                errorDesc.assign(msg);
            node_async_call::async_call([this, err, errorDesc] {
                this->onError_node(err, errorDesc.c_str());
            });
        }

        void NodeEventHandler::onAudioQuality_node(uid_t uid, int quality, unsigned short dealy, unsigned short lost)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_4(RTC_EVENT_AUDIO_QUALITY, uid, uid, int32, quality, uint16, dealy, uint16, lost);
        }

        void NodeEventHandler::onAudioQuality(uid_t uid, int quality, unsigned short dealy, unsigned short lost)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, quality, dealy, lost] {
                this->onAudioQuality_node(uid, quality, dealy, lost);
            });
        }

        void NodeEventHandler::onAudioVolumeIndication_node(const AudioVolumeInfo& speaker, unsigned int speakerNumber, int totalVolume)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_4(RTC_EVENT_AUDIO_VOLUME_INDICATION, uid, speaker.uid, uint32, speaker.volume, uint32, speakerNumber, int32, totalVolume);
        }

        void NodeEventHandler::onAudioVolumeIndication(const AudioVolumeInfo* speaker, unsigned int speakerNumber, int totalVolume)
        {
            FUNC_TRACE;
            if (speaker) {
                AudioVolumeInfo localSpeaker = { 0 };
                localSpeaker.uid = speaker->uid;
                localSpeaker.volume = speaker->volume;
                node_async_call::async_call([this, localSpeaker, speakerNumber, totalVolume] {
                    this->onAudioVolumeIndication_node(localSpeaker, speakerNumber, totalVolume);
                });
            }
        }

        void NodeEventHandler::onLeaveChannel_node(const RtcStats& stats)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_0(RTC_EVENT_LEAVE_CHANNEL);
        }

        void NodeEventHandler::onLeaveChannel(const RtcStats& stats)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, stats] {
                this->onLeaveChannel_node(stats);
            });
        }

        void NodeEventHandler::onRtcStats_node(const RtcStats& stats)
        {
            LOG_INFO("duration : %d, tx :%d, rx :%d, txbr :%d, rxbr :%d, txAudioBr :%d, rxAudioBr :%d, users :%d\n",
                stats.duration, stats.txBytes, stats.rxBytes, stats.txKBitRate, stats.rxKBitRate, stats.txAudioKBitRate,
                stats.rxAudioKBitRate, stats.users);
            do {
                Isolate *isolate = Isolate::GetCurrent();
                HandleScope scope(isolate);
                Local<Object> obj = Object::New(isolate);
                CHECK_NAPI_OBJ(obj);
                NODE_SET_OBJ_PROP_UINT32(obj, "duration", stats.duration);
                NODE_SET_OBJ_PROP_UINT32(obj, "txBytes", stats.txBytes);
                NODE_SET_OBJ_PROP_UINT32(obj, "rxBytes", stats.rxBytes);
                NODE_SET_OBJ_PROP_UINT32(obj, "txKBitRate", stats.txKBitRate);
                NODE_SET_OBJ_PROP_UINT32(obj, "rxKBitRate", stats.rxKBitRate);
                NODE_SET_OBJ_PROP_UINT32(obj, "rxAudioKBitRate", stats.rxAudioKBitRate);
                NODE_SET_OBJ_PROP_UINT32(obj, "txAudioKBitRate", stats.txAudioKBitRate);
                NODE_SET_OBJ_PROP_UINT32(obj, "rxVideoKBitRate", stats.rxVideoKBitRate);
                NODE_SET_OBJ_PROP_UINT32(obj, "txVideoKBitRate", stats.txVideoKBitRate);
                NODE_SET_OBJ_PROP_UINT32(obj, "users", stats.users);
                NODE_SET_OBJ_PROP_NUMBER(obj, "cpuAppUsage", stats.cpuAppUsage);
                NODE_SET_OBJ_PROP_NUMBER(obj, "cpuTotalUsage", stats.cpuTotalUsage);
                Local<Value> arg[1] = { obj };
                auto it = m_callbacks.find(RTC_EVENT_RTC_STATS);
                if (it != m_callbacks.end()) {
                    it->second->callback.Get(isolate)->Call(it->second->js_this.Get(isolate), 1, arg); \
                }
            } while (false);
        }

        void NodeEventHandler::onRtcStats(const RtcStats& stats)
        {
            node_async_call::async_call([this, stats] {
                this->onRtcStats_node(stats);
            });
        }

        void NodeEventHandler::onAudioDeviceStateChanged_node(const char* deviceId, int deviceType, int deviceStats)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_AUDIO_DEVICE_STATE_CHANGED, string, deviceId, int32, deviceType, int32, deviceStats);
        }

        void NodeEventHandler::onAudioDeviceStateChanged(const char* deviceId, int deviceType, int deviceStats)
        {
            FUNC_TRACE;
            std::string id(deviceId);
            node_async_call::async_call([this, id, deviceType, deviceStats] {
                this->onAudioDeviceStateChanged_node(id.c_str(), deviceType, deviceStats);
            });
        }

        void NodeEventHandler::onAudioMixingFinished_node()
        {
            FUNC_TRACE;
            MAKE_JS_CALL_0(RTC_EVENT_AUDIO_MIXING_FINISHED);
        }

        void NodeEventHandler::onAudioMixingFinished()
        {
            FUNC_TRACE;
            node_async_call::async_call([this] {
                this->onAudioMixingFinished_node();
            });
        }

        void NodeEventHandler::onRemoteAudioMixingBegin_node()
        {
            FUNC_TRACE;
            MAKE_JS_CALL_0(RTC_EVENT_REMOTE_AUDIO_MIXING_BEGIN);
        }

        void NodeEventHandler::onRemoteAudioMixingBegin()
        {
            FUNC_TRACE;
            node_async_call::async_call([this] {
                this->onRemoteAudioMixingBegin_node();
            });
        }

        void NodeEventHandler::onRemoteAudioMixingEnd_node()
        {
            FUNC_TRACE;
            MAKE_JS_CALL_0(RTC_EVENT_REMOTE_AUDIO_MIXING_END);
        }

        void NodeEventHandler::onRemoteAudioMixingEnd()
        {
            FUNC_TRACE;
            node_async_call::async_call([this] {
                this->onRemoteAudioMixingEnd_node();
            });
        }

        void NodeEventHandler::onAudioEffectFinished_node(int soundId)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_1(RTC_EVENT_AUDIO_EFFECT_FINISHED, int32, soundId);
        }

        void NodeEventHandler::onAudioEffectFinished(int soundId)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, soundId] {
                this->onAudioEffectFinished_node(soundId);
            });
        }

        void NodeEventHandler::onVideoDeviceStateChanged_node(const char* deviceId, int deviceType, int deviceState)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_VIDEO_DEVICE_STATE_CHANGED, string, deviceId, int32, deviceType, int32, deviceState);
        }

        void NodeEventHandler::onVideoDeviceStateChanged(const char* deviceId, int deviceType, int deviceState)
        {
            FUNC_TRACE;
            std::string id(deviceId);
            node_async_call::async_call([this, id, deviceType, deviceState] {
                this->onVideoDeviceStateChanged_node(id.c_str(), deviceType, deviceState);
            });
        }

        void NodeEventHandler::onNetworkQuality_node(uid_t uid, int txQuality, int rxQuality)
        {
            //event_log("uid : %d, txQuality :%d, rxQuality :%d\n", uid, txQuality, rxQuality);
            MAKE_JS_CALL_3(RTC_EVENT_NETWORK_QUALITY, uid, uid, int32, txQuality, int32, rxQuality);
        }

        void NodeEventHandler::onNetworkQuality(uid_t uid, int txQuality, int rxQuality)
        {
            node_async_call::async_call([this, uid, txQuality, rxQuality] {
                this->onNetworkQuality_node(uid, txQuality, rxQuality);
            });
        }

        void NodeEventHandler::onLastmileQuality_node(int quality)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_1(RTC_EVENT_LASTMILE_QUALITY, int32, quality);
        }

        void NodeEventHandler::onLastmileQuality(int quality)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, quality] {
                this->onLastmileQuality_node(quality);
            });
        }

        void NodeEventHandler::onFirstLocalVideoFrame_node(int width, int height, int elapsed)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_FIRST_LOCAL_VIDEO_FRAME, int32, width, int32, height, int32, elapsed);
        }

        void NodeEventHandler::onFirstLocalVideoFrame(int width, int height, int elapsed)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, width, height, elapsed] {
                this->onFirstLocalVideoFrame_node(width, height, elapsed);
            });
        }

        void NodeEventHandler::onFirstRemoteVideoDecoded_node(uid_t uid, int width, int height, int elapsed)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_4(RTC_EVENT_FIRST_REMOTE_VIDEO_DECODED, uid, uid, int32, width, int32, height, int32, elapsed);
        }

        void NodeEventHandler::onFirstRemoteVideoDecoded(uid_t uid, int width, int height, int elapsed)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, width, height, elapsed] {
                this->onFirstRemoteVideoDecoded_node(uid, width, height, elapsed);
            });
        }

        void NodeEventHandler::onVideoSizeChanged_node(uid_t uid, int width, int height, int rotation)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_4(RTC_EVENT_VIDEO_SIZE_CHANGED, uid, uid, int32, width, int32, height, int32, rotation);
        }

        void NodeEventHandler::onVideoSizeChanged(uid_t uid, int width, int height, int rotation)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, width, height, rotation] {
                this->onVideoSizeChanged_node(uid, width, height, rotation);
            });
        }

        void NodeEventHandler::onFirstRemoteVideoFrame_node(uid_t uid, int width, int height, int elapsed)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_4(RTC_EVENT_FIRST_REMOTE_VIDEO_FRAME, uid, uid, int32, width, int32, height, int32, elapsed);
        }

        void NodeEventHandler::onFirstRemoteVideoFrame(uid_t uid, int width, int height, int elapsed)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, width, height, elapsed] {
                this->onFirstRemoteVideoFrame_node(uid, width, height, elapsed);
            });
        }

        void NodeEventHandler::onUserJoined_node(uid_t uid, int elapsed)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_2(RTC_EVENT_USER_JOINED, uid, uid, int32, elapsed);
        }

        void NodeEventHandler::onUserJoined(uid_t uid, int elapsed)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, elapsed] {
                this->onUserJoined_node(uid, elapsed);
            });
        }

        void NodeEventHandler::onUserOffline_node(uid_t uid, USER_OFFLINE_REASON_TYPE reason)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_2(RTC_EVENT_USER_OFFLINE, uid, uid, int32, reason);
        }

        void NodeEventHandler::onUserOffline(uid_t uid, USER_OFFLINE_REASON_TYPE reason)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, reason] {
                this->onUserOffline_node(uid, reason);
            });
        }

        void NodeEventHandler::onUserMuteAudio_node(uid_t uid, bool muted)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_2(RTC_EVENT_USER_MUTE_AUDIO, uid, uid, int32, muted);
        }

        void NodeEventHandler::onUserMuteAudio(uid_t uid, bool muted)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, muted] {
                this->onUserMuteAudio_node(uid, muted);
            });
        }

        void NodeEventHandler::onUserMuteVideo_node(uid_t uid, bool muted)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_2(RTC_EVENT_USER_MUTE_VIDEO, uid, uid, int32, muted);
        }

        void NodeEventHandler::onUserMuteVideo(uid_t uid, bool muted)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, muted] {
                this->onUserMuteVideo_node(uid, muted);
            });
        }

        void NodeEventHandler::onUserEnableVideo_node(uid_t uid, bool enabled)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_2(RTC_EVENT_USER_ENABLE_VIDEO, uid, uid, int32, enabled);
        }

        void NodeEventHandler::onUserEnableVideo(uid_t uid, bool enabled)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, enabled] {
                this->onUserEnableVideo_node(uid, enabled);
            });
        }

        void NodeEventHandler::onUserEnableLocalVideo_node(uid_t uid, bool enabled)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_2(RTC_EVENT_USER_ENABLE_LOCAL_VIDEO, uid, uid, int32, enabled);
        }

        void NodeEventHandler::onUserEnableLocalVideo(uid_t uid, bool enabled)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, enabled] {
                this->onUserEnableLocalVideo_node(uid, enabled);
            });
        }

        void NodeEventHandler::onApiCallExecuted_node(const char* api, int error)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_2(RTC_EVENT_APICALL_EXECUTED, string, api, int32, error);
        }

        void NodeEventHandler::onApiCallExecuted(const char* api, int error)
        {
            FUNC_TRACE;
            std::string apiName(api);
            node_async_call::async_call([this, apiName, error] {
                this->onApiCallExecuted_node(apiName.c_str(), error);
            });
        }

        void NodeEventHandler::onLocalVideoStats_node(const LocalVideoStats& stats)
        {
            FUNC_TRACE;
            do {
                Isolate *isolate = Isolate::GetCurrent();
                HandleScope scope(isolate);
                Local<Object> obj = Object::New(isolate);
                CHECK_NAPI_OBJ(obj);
                NODE_SET_OBJ_PROP_UINT32(obj, "sentBitrate", stats.sentBitrate);
                NODE_SET_OBJ_PROP_UINT32(obj, "sentFrameRate", stats.sentFrameRate);
                Local<Value> arg[1] = { obj };
                auto it = m_callbacks.find(RTC_EVENT_LOCAL_VIDEO_STATS);
                if (it != m_callbacks.end()) {
                    it->second->callback.Get(isolate)->Call(it->second->js_this.Get(isolate), 1, arg); \
                }
            } while (false);
        }

        void NodeEventHandler::onLocalVideoStats(const LocalVideoStats& stats)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, stats] {
                this->onLocalVideoStats_node(stats);
            });
        }

        void NodeEventHandler::onRemoteVideoStats_node(const RemoteVideoStats& stats)
        {
            FUNC_TRACE;
            do {
                Isolate *isolate = Isolate::GetCurrent();
                HandleScope scope(isolate);
                Local<Object> obj = Object::New(isolate);
                CHECK_NAPI_OBJ(obj);
                NODE_SET_OBJ_PROP_UINT32(obj, "uid", stats.uid);
                NODE_SET_OBJ_PROP_UINT32(obj, "delay", stats.delay);
                NODE_SET_OBJ_PROP_UINT32(obj, "width", stats.width);
                NODE_SET_OBJ_PROP_UINT32(obj, "height", stats.height);
                NODE_SET_OBJ_PROP_UINT32(obj, "receivedBitrate", stats.receivedBitrate);
                NODE_SET_OBJ_PROP_UINT32(obj, "receivedFrameRate", stats.receivedFrameRate);
                NODE_SET_OBJ_PROP_UINT32(obj, "rxStreamType", stats.rxStreamType);
                Local<Value> arg[1] = { obj };
                auto it = m_callbacks.find(RTC_EVENT_REMOTE_VIDEO_STATS);
                if (it != m_callbacks.end()) {
                    it->second->callback.Get(isolate)->Call(it->second->js_this.Get(isolate), 1, arg); \
                }
            } while (false);
        }

        void NodeEventHandler::onRemoteVideoStats(const RemoteVideoStats& stats)
        {
            FUNC_TRACE;
            printf("frame rate : %d, bitrate : %d, width %d, height %d\n", stats.receivedFrameRate, stats.receivedBitrate, stats.width, stats.height);
            node_async_call::async_call([this, stats] {
                this->onRemoteVideoStats_node(stats);
            });
        }

        void NodeEventHandler::onCameraReady_node()
        {
            FUNC_TRACE;
            MAKE_JS_CALL_0(RTC_EVENT_CAMERA_READY);
        }

        void NodeEventHandler::onCameraReady()
        {
            FUNC_TRACE;
            node_async_call::async_call([this] {
                this->onCameraReady_node();
            });
        }

        void NodeEventHandler::onVideoStopped_node()
        {
            FUNC_TRACE;
            MAKE_JS_CALL_0(RTC_EVENT_VIDEO_STOPPED);
        }

        void NodeEventHandler::onVideoStopped()
        {
            FUNC_TRACE;
            node_async_call::async_call([this] {
                this->onVideoStopped_node();
            });
        }

        void NodeEventHandler::onConnectionLost_node()
        {
            FUNC_TRACE;
            MAKE_JS_CALL_0(RTC_EVENT_CONNECTION_LOST);
        }

        void NodeEventHandler::onConnectionLost()
        {
            FUNC_TRACE;
            node_async_call::async_call([this] {
                this->onConnectionLost_node();
            });
        }

        void NodeEventHandler::onConnectionInterrupted_node()
        {
            FUNC_TRACE;
            MAKE_JS_CALL_0(RTC_EVENT_CONNECTION_INTERRUPTED);
        }

        void NodeEventHandler::onConnectionInterrupted()
        {
            FUNC_TRACE;
            node_async_call::async_call([this] {
                this->onConnectionInterrupted_node();
            });
        }

        void NodeEventHandler::onConnectionBanned_node()
        {
            FUNC_TRACE;
            MAKE_JS_CALL_0(RTC_EVENT_CONNECTION_BANNED);
        }

        void NodeEventHandler::onConnectionBanned()
        {
            FUNC_TRACE;
            node_async_call::async_call([this] {
                this->onConnectionBanned_node();
            });
        }

        void NodeEventHandler::onRefreshRecordingServiceStatus_node(int status)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_1(RTC_EVENT_REFRESH_RECORDING_SERVICE_STATUS, int32, status);
        }

        void NodeEventHandler::onRefreshRecordingServiceStatus(int status)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, status] {
                this->onRefreshRecordingServiceStatus_node(status);
            });
        }

        void NodeEventHandler::onStreamMessage_node(uid_t uid, int streamId, const char* data, size_t length)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_4(RTC_EVENT_STREAM_MESSAGE, uid, uid, int32, streamId, string, data, int32, length);
        }

        void NodeEventHandler::onStreamMessage(uid_t uid, int streamId, const char* data, size_t length)
        {
            FUNC_TRACE;
            std::string msg(data);
            node_async_call::async_call([this, uid, streamId, msg, length] {
                this->onStreamMessage_node(uid, streamId, msg.c_str(), length);
            });
        }

        void NodeEventHandler::onStreamMessageError_node(uid_t uid, int streamId, int code, int missed, int cached)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_5(RTC_EVENT_STREAM_MESSAGE_ERROR, uid, uid, int32, streamId, int32, code, int32, missed, int32, cached);
        }

        void NodeEventHandler::onStreamMessageError(uid_t uid, int streamId, int code, int missed, int cached)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, streamId, code, missed, cached] {
                this->onStreamMessageError_node(uid, streamId, code, missed, cached);
            });
        }

        void NodeEventHandler::onMediaEngineLoadSuccess_node()
        {
            FUNC_TRACE;
            MAKE_JS_CALL_0(RTC_EVENT_MEDIA_ENGINE_LOAD_SUCCESS);
        }

        void NodeEventHandler::onMediaEngineLoadSuccess()
        {
            FUNC_TRACE;
            node_async_call::async_call([this] {
                this->onMediaEngineLoadSuccess_node();
            });
        }

        void NodeEventHandler::onMediaEngineStartCallSuccess_node()
        {
            FUNC_TRACE;
            MAKE_JS_CALL_0(RTC_EVENT_MEDIA_ENGINE_STARTCALL_SUCCESS);
        }

        void NodeEventHandler::onMediaEngineStartCallSuccess()
        {
            FUNC_TRACE;
            node_async_call::async_call([this] {
                this->onMediaEngineStartCallSuccess_node();
            });
        }

        void NodeEventHandler::onRequestChannelKey_node()
        {
            FUNC_TRACE;
            MAKE_JS_CALL_0(RTC_EVENT_REQUEST_CHANNEL_KEY);
        }

		void NodeEventHandler::onRequestChannelKey()
		{
			FUNC_TRACE;
            node_async_call::async_call([this] {
				this->onRequestChannelKey_node();
            });
		}

        void NodeEventHandler::onFirstLocalAudioFrame_node(int elapsed)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_1(RTC_EVENT_FIRST_LOCAL_AUDIO_FRAME, int32, elapsed);
        }

        void NodeEventHandler::onFirstLocalAudioFrame(int elapsed)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, elapsed] {
                this->onFirstLocalAudioFrame_node(elapsed);
            });
        }

        void NodeEventHandler::onFirstRemoteAudioFrame_node(uid_t uid, int elapsed)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_2(RTC_EVENT_FIRST_REMOTE_AUDIO_FRAME, uid, uid, int32, elapsed);
        }

        void NodeEventHandler::onFirstRemoteAudioFrame(uid_t uid, int elapsed)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, elapsed] {
                this->onFirstRemoteAudioFrame_node(uid, elapsed);
            });
        }

        void NodeEventHandler::onActiveSpeaker_node(uid_t uid)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_1(RTC_EVENT_ACTIVE_SPEAKER, uid, uid);
        }

        void NodeEventHandler::onActiveSpeaker(uid_t uid)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, uid] {
                this->onActiveSpeaker_node(uid);
            });
        }

        void NodeEventHandler::onClientRoleChanged_node(CLIENT_ROLE_TYPE oldRole, CLIENT_ROLE_TYPE newRole)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_2(RTC_EVENT_CLIENT_ROLE_CHANGED, int32, oldRole, int32, newRole);
        }

        void NodeEventHandler::onClientRoleChanged(CLIENT_ROLE_TYPE oldRole, CLIENT_ROLE_TYPE newRole)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, oldRole, newRole] {
                this->onClientRoleChanged_node(oldRole, newRole);
            });
        }

        void NodeEventHandler::onAudioDeviceVolumeChanged_node(MEDIA_DEVICE_TYPE deviceType, int volume, bool muted)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_AUDIO_DEVICE_VOLUME_CHANGED, int32, deviceType, int32, volume, int32, muted);
        }

        void NodeEventHandler::onAudioDeviceVolumeChanged(MEDIA_DEVICE_TYPE deviceType, int volume, bool muted)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, deviceType, volume, muted] {
                this->onAudioDeviceVolumeChanged_node(deviceType, volume, muted);
            });
        }

        void NodeEventHandler::onRemoteAudioTransportStats_node(agora::rtc::uid_t uid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate)
        {
			FUNC_TRACE;
            MAKE_JS_CALL_4(RTC_EVENT_REMOTE_AUDIO_TRANSPORT_STATS, uid, uid, uint16, delay, uint16, lost, uint16, rxKBitRate);
        }

        void NodeEventHandler::onRemoteVideoTransportStats_node(agora::rtc::uid_t uid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate)
        {
			FUNC_TRACE;
            MAKE_JS_CALL_4(RTC_EVENT_REMOTE_VIDEO_STATS, uid, uid, uint16, delay, uint16, lost, uint16, rxKBitRate);
        }

        void NodeEventHandler::onRemoteAudioTransportStats(agora::rtc::uid_t uid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate)
        {
            FUNC_TRACE;
			node_async_call::async_call([this, uid, delay, lost, rxKBitRate] {
				this->onRemoteAudioTransportStats_node(uid, delay, lost, rxKBitRate);
            });
        }

        void NodeEventHandler::onRemoteVideoTransportStats(agora::rtc::uid_t uid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, delay, lost, rxKBitRate] {
                this->onRemoteVideoTransportStats_node(uid, delay, lost, rxKBitRate);
            });
        }

        void NodeEventHandler::onVideoSourceJoinedChannel(agora::rtc::uid_t uid)
        {
            FUNC_TRACE;
            RtcEngineParameters rep(m_engine->getRtcEngine());
            rep.muteRemoteVideoStream(uid, true);
            node_async_call::async_call([this, uid]{
                this->onVideoSourceJoinedChannel_node(uid);
            });
        }

        void NodeEventHandler::onVideoSourceJoinedChannel_node(agora::rtc::uid_t uid)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_1(RTC_EVENT_VIDEO_SOURCE_JOIN_SUCCESS, uid, uid);
        }

        void NodeEventHandler::onVideoSourceRequestNewChannelKey()
        {
            FUNC_TRACE;
            node_async_call::async_call([this]{
                this->onVideoSourceRequestChannelKey_node();
            });
        }

        void NodeEventHandler::onVideoSourceRequestChannelKey_node()
        {
            FUNC_TRACE;
            MAKE_JS_CALL_0(RTC_EVENT_VIDEO_SOURCE_REQUEST_NEW_CHANNEL_KEY);
        }

        void NodeEventHandler::onVideoSourceExit()
        {
            FUNC_TRACE;
            node_async_call::async_call([this] {
                this->onVideoSourceLeaveChannel_node();
            });
            m_engine->destroyVideoSource();
        }

        void NodeEventHandler::onVideoSourceLeaveChannel()
        {
            FUNC_TRACE;
            node_async_call::async_call([this]{
                this->onVideoSourceLeaveChannel_node();
            });
        }

        void NodeEventHandler::onVideoSourceLeaveChannel_node()
        {
            FUNC_TRACE;
            MAKE_JS_CALL_0(RTC_EVENT_VIDEO_SOURCE_LEAVE_CHANNEL);
        }

        void NodeEventHandler::addEventHandler(const std::string& eventName, Persistent<Object>& obj, Persistent<Function>& callback)
        {
            FUNC_TRACE;
            NodeEventCallback *cb = new NodeEventCallback();;
            cb->js_this.Reset(Isolate::GetCurrent(), obj);
            cb->callback.Reset(Isolate::GetCurrent(), callback);
            m_callbacks.emplace(eventName, cb);
        }

        void NodeEventHandler::fireApiError(const char* funcName)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_1(RTC_EVENT_API_ERROR, string, funcName);
        }
    }
}
