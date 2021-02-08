/*
* Copyright (c) 2017 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2017
*/

#ifndef AGORA_NODE_EVENT_HANDLER_H
#define AGORA_NODE_EVENT_HANDLER_H

#include "IAgoraRtcEngine.h"
#include "agora_node_ext.h"
#include <unordered_map>
#include <string>
#include <uv.h>
#include "node_napi_api.h"
#include "agora_video_source.h"
namespace agora {
    namespace rtc {
#define RTC_EVENT_JOIN_CHANNEL "joinchannel"
#define RTC_EVENT_REJOIN_CHANNEL "rejoinchannel"
#define RTC_EVENT_WARNING "warning"
#define RTC_EVENT_ERROR "error"
#define RTC_EVENT_AUDIO_QUALITY "audioquality"
#define RTC_EVENT_AUDIO_VOLUME_INDICATION "audiovolumeindication"
#define RTC_EVENT_LEAVE_CHANNEL "leavechannel"
#define RTC_EVENT_RTC_STATS "rtcstats"
#define RTC_EVENT_AUDIO_DEVICE_STATE_CHANGED "audiodevicestatechanged"
#define RTC_EVENT_AUDIO_MIXING_FINISHED "audiomixingfinished"
#define RTC_EVENT_REMOTE_AUDIO_MIXING_BEGIN "remoteaudiomixingbegin"
#define RTC_EVENT_REMOTE_AUDIO_MIXING_END "remoteaudiomixingend"
#define RTC_EVENT_AUDIO_EFFECT_FINISHED "audioeffectfinished"
#define RTC_EVENT_VIDEO_DEVICE_STATE_CHANGED "videodevicestatechanged"
#define RTC_EVENT_NETWORK_QUALITY "networkquality"
#define RTC_EVENT_LASTMILE_QUALITY "lastmilequality"
#define RTC_EVENT_FIRST_LOCAL_VIDEO_FRAME "firstlocalvideoframe"
#define RTC_EVENT_FIRST_REMOTE_VIDEO_DECODED "firstremotevideodecoded"
#define RTC_EVENT_VIDEO_SIZE_CHANGED "videosizechanged"
#define RTC_EVENT_REMOTE_VIDEO_STATE_CHANGED "remoteVideoStateChanged"
#define RTC_EVENT_FIRST_REMOTE_VIDEO_FRAME "firstremotevideoframe"
#define RTC_EVENT_USER_JOINED "userjoined"
#define RTC_EVENT_USER_OFFLINE "useroffline"
#define RTC_EVENT_USER_MUTE_AUDIO "usermuteaudio"
#define RTC_EVENT_USER_MUTE_VIDEO "usermutevideo"
#define RTC_EVENT_USER_ENABLE_VIDEO "userenablevideo"
#define RTC_EVENT_USER_ENABLE_LOCAL_VIDEO "userenablelocalvideo"
#define RTC_EVENT_APICALL_EXECUTED "apicallexecuted"
#define RTC_EVENT_LOCAL_VIDEO_STATS "localvideostats"
#define RTC_EVENT_LOCAL_AUDIO_STATS "localAudioStats"
#define RTC_EVENT_REMOTE_VIDEO_STATS "remotevideostats"
#define RTC_EVENT_REMOTE_AUDIO_STATS "remoteAudioStats"
#define RTC_EVENT_CAMERA_READY "cameraready"
#define RTC_EVENT_CAMERA_FOCUS_AREA_CHANGED "cameraFocusAreaChanged"
#define RTC_EVENT_CAMERA_EXPOSURE_AREA_CHANGED "cameraExposureAreaChanged"
#define RTC_EVENT_VIDEO_STOPPED "videostopped"
#define RTC_EVENT_CONNECTION_LOST "connectionlost"
#define RTC_EVENT_CONNECTION_INTERRUPTED "connectioninterrupted"
#define RTC_EVENT_CONNECTION_BANNED "connectionbanned"
#define RTC_EVENT_REFRESH_RECORDING_SERVICE_STATUS "refreshrecordingservicestatus"
#define RTC_EVENT_STREAM_MESSAGE "streammessage"
#define RTC_EVENT_STREAM_MESSAGE_ERROR "streammessageerror"
#define RTC_EVENT_MEDIA_ENGINE_LOAD_SUCCESS "mediaengineloadsuccess"
#define RTC_EVENT_MEDIA_ENGINE_STARTCALL_SUCCESS "mediaenginestartcallsuccess"
#define RTC_EVENT_REQUEST_TOKEN "requesttoken"
#define RTC_EVENT_TOKEN_PRIVILEGE_WILL_EXPIRE "tokenPrivilegeWillExpire"
#define RTC_EVENT_FIRST_LOCAL_AUDIO_FRAME "firstlocalaudioframe"
#define RTC_EVENT_FIRST_REMOTE_AUDIO_FRAME "firstremoteaudioframe"
#define RTC_EVENT_FIRST_REMOTE_AUDIO_DECODED "firstRemoteAudioDecoded"
#define RTC_EVENT_ACTIVE_SPEAKER "activespeaker"
#define RTC_EVENT_STREAM_PUBLISHED "streamPublished"
#define RTC_EVENT_STREAM_UNPUBLISHED "streamUnpublished"
#define RTC_EVENT_TRANSCODING_UPDATED "transcodingUpdated"
#define RTC_EVENT_STREAM_INJECT_STATUS "streamInjectStatus"
#define RTC_EVENT_LOCAL_PUBLISH_FALLBACK_TO_AUDIO_ONLY "localPublishFallbackToAudioOnly"
#define RTC_EVENT_REMOTE_SUBSCRIBE_FALLBACK_TO_AUDIO_ONLY "remoteSubscribeFallbackToAudioOnly"
#define RTC_EVENT_CLIENT_ROLE_CHANGED "clientrolechanged"
#define RTC_EVENT_AUDIO_DEVICE_VOLUME_CHANGED "audiodevicevolumechanged"
#define RTC_EVENT_REMOTE_AUDIO_TRANSPORT_STATS "remoteAudioTransportStats"
#define RTC_EVENT_REMOTE_VIDEO_TRANSPORT_STATS "remoteVideoTransportStats"
#define RTC_EVENT_MICROPHONE_ENABLED "microphoneEnabled"
#define RTC_EVENT_CONNECTION_STATE_CHANED "connectionStateChanged"
#define RTC_EVENT_AUDIO_MIXING_STATE_CHANGED "audioMixingStateChanged"
#define RTC_EVENT_LASTMILE_PROBE_RESULT "lastmileProbeResult"
#define RTC_EVENT_LOCAL_USER_REGISTERED "localUserRegistered"
#define RTC_EVENT_USER_INFO_UPDATED "userInfoUpdated"
#define RTC_EVENT_LOCAL_VIDEO_STATE_CHANGED "localVideoStateChanged"
#define RTC_EVENT_LOCAL_AUDIO_STATE_CHANGED "localAudioStateChanged"
#define RTC_EVENT_REMOTE_AUDIO_STATE_CHANGED "remoteAudioStateChanged"
#define RTC_EVENT_CHANNEL_MEDIA_RELAY_STATE  "channelMediaRelayState"
#define RTC_EVENT_CHANNEL_MEDIA_RELAY_EVENT "channelMediaRelayEvent"
#define RTC_EVENT_RTMP_STREAMING_STATE_CHANGED "rtmpStreamingStateChanged"

#define RTC_EVENT_VIDEO_SOURCE_JOIN_SUCCESS "videosourcejoinsuccess"
#define RTC_EVENT_VIDEO_SOURCE_REQUEST_NEW_TOKEN "videosourcerequestnewtoken"
#define RTC_EVENT_VIDEO_SOURCE_LEAVE_CHANNEL "videosourceleavechannel"
#define RTC_EVENT_VIDEO_SOURCE_LOCAL_AUDIO_STATS "videoSourceLocalAudioStats"
#define RTC_EVENT_VIDEO_SOURCE_LOCAL_VIDEO_STATS "videoSourceLocalVideoStats"
#define RTC_EVENT_VIDEO_SOURCE_VIDEO_SIZE_CHANGED "videoSourceVideoSizeChanged"

#define RTC_EVENT_FIRST_LOCAL_AUDIO_FRAME_PUBLISH "firstLocalAudioFramePublished"
#define RTC_EVENT_FIRST_LOCAL_VIDEO_FRAME_PUBLISH "firstLocalVideoFramePublished"
#define RTC_EVENT_RTMP_STREAMING_EVENT "rtmpStreamingEvent"
#define RTC_EVENT_AUDIO_PUBLISH_STATE_CHANGED "audioPublishStateChanged"
#define RTC_EVENT_VIDEO_PUBLISH_STATE_CHANGED "videoPublishStateChanged"
#define RTC_EVENT_AUDIO_SUBSCRIBE_STATE_CHANGED "audioSubscribeStateChanged"
#define RTC_EVENT_VIDEO_SUBSCRIBE_STATE_CHANGED "videoSubscribeStateChanged"
#define RTC_EVENT_AUDIO_ROUTE_CHANGED "audioRouteChanged"
#define RTC_EVENT_API_ERROR "apierror"
#define RTC_EVENT_UPLOAD_LOG_RESULT "uploadLogResult"
        class NodeRtcEngine;
        class NodeUid;
        class NodeEventHandler : public IRtcEngineEventHandler, public IAgoraVideoSourceEventHandler
        {
        public:
            struct NodeEventCallback
            {
                Persistent<Function> callback;
                Persistent<Object> js_this;
            };
        public:
            NodeEventHandler(NodeRtcEngine* pEngine);
            ~NodeEventHandler();
            virtual void onJoinChannelSuccess(const char* channel, uid_t uid, int elapsed) override;
            virtual void onRejoinChannelSuccess(const char* channel, uid_t uid, int elapsed) override;
            virtual void onWarning(int warn, const char* msg) override;
            virtual void onError(int err, const char* msg) override;
            virtual void onAudioQuality(uid_t uid, int quality, unsigned short delay, unsigned short lost) override;
            virtual void onAudioVolumeIndication(const AudioVolumeInfo* sperkers, unsigned int speakerNumber, int totalVolume) override;
            virtual void onLeaveChannel(const RtcStats& stats) override;
            virtual void onRtcStats(const RtcStats& stats) override;
            virtual void onAudioDeviceStateChanged(const char* deviceId, int deviceType, int deviceState) override;
            virtual void onAudioMixingFinished() override;
            virtual void onRemoteAudioMixingBegin() override;
            virtual void onRemoteAudioMixingEnd() override;
            virtual void onAudioEffectFinished(int soundId) override;
            virtual void onVideoDeviceStateChanged(const char* deviceId, int deviceType, int deviceState) override;
            virtual void onNetworkQuality(uid_t uid, int txQuality, int rxQuality) override;
            virtual void onLastmileQuality(int quality) override;
            virtual void onFirstLocalVideoFrame(int width, int height, int elapsed) override;
            virtual void onFirstRemoteVideoDecoded(uid_t uid, int width, int height, int elapsed) override;
            virtual void onVideoSizeChanged(uid_t uid, int width, int height, int rotation) override;
            virtual void onRemoteVideoStateChanged(uid_t uid, REMOTE_VIDEO_STATE state, REMOTE_VIDEO_STATE_REASON reason, int elapsed) override;
            virtual void onUserJoined(uid_t uid, int elapsed) override;
            virtual void onUserOffline(uid_t uid, USER_OFFLINE_REASON_TYPE reason) override;
            virtual void onUserMuteAudio(uid_t uid, bool muted) override;
            virtual void onUserMuteVideo(uid_t uid, bool muted) override;
            virtual void onUserEnableVideo(uid_t uid, bool enabled) override;
            virtual void onUserEnableLocalVideo(uid_t uid, bool enabled) override;
            virtual void onApiCallExecuted(int err, const char* api, const char* result) override;
            virtual void onLocalVideoStats(const LocalVideoStats& stats) override;
            virtual void onRemoteVideoStats(const RemoteVideoStats& stats) override;
            virtual void onCameraReady() override;
            virtual void onCameraFocusAreaChanged(int x, int y, int width, int height) override;
            virtual void onCameraExposureAreaChanged(int x, int y, int width, int height) override;
            virtual void onVideoStopped() override;
            virtual void onConnectionLost() override;
            virtual void onConnectionInterrupted() override;
            virtual void onConnectionBanned() override;
            virtual void onStreamMessage(uid_t uid, int streamId, const char* data, size_t length) override;
            virtual void onStreamMessageError(uid_t uid, int streamId, int code, int missed, int cached) override;
            virtual void onMediaEngineLoadSuccess() override;
            virtual void onMediaEngineStartCallSuccess() override;
            virtual void onRequestToken() override;
            virtual void onTokenPrivilegeWillExpire(const char* token) override;
            virtual void onFirstLocalAudioFrame(int elapsed) override;
            virtual void onFirstRemoteAudioDecoded(uid_t uid, int elapsed) override;
            virtual void onTranscodingUpdated() override;
            virtual void onStreamInjectedStatus(const char* url, uid_t uid, int status) override;
            virtual void onLocalPublishFallbackToAudioOnly(bool isFallbackOrRecover) override;
            virtual void onRemoteSubscribeFallbackToAudioOnly(uid_t uid, bool isFallbackOrRecover) override;
            virtual void onActiveSpeaker(uid_t uid) override;
            virtual void onClientRoleChanged(CLIENT_ROLE_TYPE oldRole, CLIENT_ROLE_TYPE newRole) override;
            virtual void onAudioDeviceVolumeChanged(MEDIA_DEVICE_TYPE deviceType, int volume, bool muted) override;
            virtual void onRemoteAudioTransportStats(agora::rtc::uid_t uid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate)override;
            virtual void onRemoteVideoTransportStats(agora::rtc::uid_t uid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate)override;
            virtual void onRemoteAudioStats(const RemoteAudioStats & stats) override;
            virtual void onMicrophoneEnabled(bool enabled) override;
            virtual void onConnectionStateChanged(CONNECTION_STATE_TYPE state, CONNECTION_CHANGED_REASON_TYPE reason) override;

            virtual void onVideoSourceJoinedChannel(agora::rtc::uid_t uid) override;
            virtual void onVideoSourceRequestNewToken() override;
            virtual void onVideoSourceLeaveChannel() override;
            virtual void onVideoSourceLocalAudioStats(const LocalAudioStats& stats) override;
            virtual void onVideoSourceVideoSizeChanged(uid_t uid, int width, int height, int rotation) override;
            virtual void onVideoSourceLocalVideoStats(const LocalVideoStats& stats) override;
            virtual void onVideoSourceExit() override;
            void fireApiError(const char* funcName);
            void addEventHandler(const std::string& eventName, Persistent<Object>& obj, Persistent<Function>& callback);

            //2.4.0
            virtual void onAudioMixingStateChanged(AUDIO_MIXING_STATE_TYPE state, AUDIO_MIXING_ERROR_TYPE errorCode) override;
            virtual void onLastmileProbeResult(const LastmileProbeResult &result) override;

            //2.8.0
            virtual void onLocalUserRegistered(uid_t uid, const char* userAccount) override;
            virtual void onUserInfoUpdated(uid_t uid, const UserInfo& info) override;
            virtual void onLocalVideoStateChanged(LOCAL_VIDEO_STREAM_STATE localVideoState, LOCAL_VIDEO_STREAM_ERROR error) override;

            //2.9.0
            virtual void onLocalAudioStats(const LocalAudioStats& stats) override;
            virtual void onLocalAudioStateChanged(LOCAL_AUDIO_STREAM_STATE state, LOCAL_AUDIO_STREAM_ERROR error) override;
            virtual void onRemoteAudioStateChanged(uid_t uid, REMOTE_AUDIO_STATE state, REMOTE_AUDIO_STATE_REASON reason, int elapsed) override;
            virtual void onChannelMediaRelayStateChanged(CHANNEL_MEDIA_RELAY_STATE state,CHANNEL_MEDIA_RELAY_ERROR code) override;
            virtual void onChannelMediaRelayEvent(CHANNEL_MEDIA_RELAY_EVENT code) override;

            //3.0.0
            virtual void onRtmpStreamingStateChanged(const char *url, RTMP_STREAM_PUBLISH_STATE state, RTMP_STREAM_PUBLISH_ERROR errCode) override;

            //3.1.0
            virtual void onFirstLocalAudioFramePublished(int elapsed);
            virtual void onFirstLocalVideoFramePublished(int elapsed);
            virtual void onRtmpStreamingEvent(const char* url, RTMP_STREAMING_EVENT eventCode);
            virtual void onAudioPublishStateChanged(const char* channel, STREAM_PUBLISH_STATE oldState, STREAM_PUBLISH_STATE newState, int elapseSinceLastState);
            virtual void onVideoPublishStateChanged(const char* channel, STREAM_PUBLISH_STATE oldState, STREAM_PUBLISH_STATE newState, int elapseSinceLastState);
            virtual void onAudioSubscribeStateChanged(const char* channel, uid_t uid, STREAM_SUBSCRIBE_STATE oldState, STREAM_SUBSCRIBE_STATE newState, int elapseSinceLastState);
            virtual void onVideoSubscribeStateChanged(const char* channel, uid_t uid, STREAM_SUBSCRIBE_STATE oldState, STREAM_SUBSCRIBE_STATE newState, int elapseSinceLastState);
            virtual void onAudioRouteChanged(AUDIO_ROUTE_TYPE routing);
            virtual void onStreamPublished(const char *url, int error);
            virtual void onStreamUnpublished(const char *url);
            
            //3.3.0
            virtual void onUploadLogResult(const char * requestId, bool success, UPLOAD_ERROR_REASON reason );
  private:
            void onJoinChannelSuccess_node(const char* channel, uid_t uid, int elapsed) ;
            void onRejoinChannelSuccess_node(const char* channel, uid_t uid, int elapsed) ;
            void onWarning_node(int warn, const char* msg) ;
            void onError_node(int err, const char* msg) ;
            void onAudioQuality_node(uid_t uid, int quality, unsigned short delay, unsigned short lost) ;
            void onAudioVolumeIndication_node(AudioVolumeInfo* sperkers, unsigned int speakerNumber, int totalVolume) ;
            void onLeaveChannel_node(const RtcStats& stats) ;
            void onRtcStats_node(const RtcStats& stats) ;
            void onAudioDeviceStateChanged_node(const char* deviceId, int deviceType, int deviceState) ;
            void onAudioMixingFinished_node() ;
            void onRemoteAudioMixingBegin_node() ;
            void onRemoteAudioMixingEnd_node() ;
            void onAudioEffectFinished_node(int soundId) ;
            void onVideoDeviceStateChanged_node(const char* deviceId, int deviceType, int deviceState) ;
            void onNetworkQuality_node(uid_t uid, int txQuality, int rxQuality) ;
            void onLastmileQuality_node(int quality);
            void onFirstLocalVideoFrame_node(int width, int height, int elapsed) ;
            void onFirstRemoteVideoDecoded_node(uid_t uid, int width, int height, int elapsed) ;
            void onVideoSizeChanged_node(uid_t uid, int width, int height, int rotation) ;
            void onRemoteVideoStateChanged_node(uid_t uid, REMOTE_VIDEO_STATE state, REMOTE_VIDEO_STATE_REASON reason, int elapsed);
            void onFirstRemoteVideoFrame_node(uid_t uid, int width, int height, int elapsed) ;
            void onUserJoined_node(uid_t uid, int elapsed) ;
            void onUserOffline_node(uid_t uid, USER_OFFLINE_REASON_TYPE reason) ;
            void onUserMuteAudio_node(uid_t uid, bool muted) ;
            void onUserMuteVideo_node(uid_t uid, bool muted) ;
            void onUserEnableVideo_node(uid_t uid, bool enabled) ;
            void onUserEnableLocalVideo_node(uid_t uid, bool enabled) ;
            void onApiCallExecuted_node(const char* api, int error) ;
            void onLocalVideoStats_node(const LocalVideoStats& stats) ;
            void onRemoteVideoStats_node(const RemoteVideoStats& stats);
            void onCameraReady_node();
            void onCameraFocusAreaChanged_node(int x, int y, int width, int height);
            void onCameraExposureAreaChanged_node(int x, int y, int width, int height);
            void onVideoStopped_node();
            void onConnectionLost_node();
            void onConnectionInterrupted_node();
            void onConnectionBanned_node();
           void onRefreshRecordingServiceStatus_node(int status);
            void onStreamMessage_node(uid_t uid, int streamId, const char* data, size_t length);
            void onStreamMessageError_node(uid_t uid, int streamId, int code, int missed, int cached);
            void onMediaEngineLoadSuccess_node();
            void onMediaEngineStartCallSuccess_node();
            void onRequestToken_node();
            void onTokenPrivilegeWillExpire_node(const char* token);
            void onFirstLocalAudioFrame_node(int elapsed);
            void onFirstRemoteAudioFrame_node(uid_t uid, int elapsed);
            void onFirstRemoteAudioDecoded_node(uid_t uid, int elapsed);
            void onStreamPublished_node(const char *url, int error);
            void onStreamUnpublished_node(const char *url);
            void onTranscodingUpdated_node();   
            void onStreamInjectedStatus_node(const char* url, uid_t uid, int status);

            void onLocalPublishFallbackToAudioOnly_node(bool isFallbackOrRecover);
            void onRemoteSubscribeFallbackToAudioOnly_node(uid_t uid, bool isFallbackOrRecover);
            void onActiveSpeaker_node(uid_t uid);
            void onClientRoleChanged_node(CLIENT_ROLE_TYPE oldRole, CLIENT_ROLE_TYPE newRole);
            void onAudioDeviceVolumeChanged_node(MEDIA_DEVICE_TYPE deviceType, int volume, bool muted);
            void onRemoteAudioTransportStats_node(agora::rtc::uid_t uid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate);
            void onRemoteVideoTransportStats_node(agora::rtc::uid_t uid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate);
            void onRemoteAudioStats_node(const RemoteAudioStats & stats);
            void onMicrophoneEnabled_node(bool enabled);
            void onConnectionStateChanged_node(CONNECTION_STATE_TYPE state, CONNECTION_CHANGED_REASON_TYPE reason);

            void onVideoSourceJoinedChannel_node(agora::rtc::uid_t uid);
            void onVideoSourceRequestToken_node();
            void onVideoSourceLeaveChannel_node();

            //2.4.0
            void onAudioMixingStateChanged_node(AUDIO_MIXING_STATE_TYPE state, AUDIO_MIXING_ERROR_TYPE errorCode);
            void onLastmileProbeResult_node(const LastmileProbeResult &result);

            //2.8.0
            void onLocalUserRegistered_node(uid_t uid, const char* userAccount);
            void onUserInfoUpdated_node(uid_t uid, const UserInfo& info);
            void onLocalVideoStateChanged_node(LOCAL_VIDEO_STREAM_STATE localVideoState, LOCAL_VIDEO_STREAM_ERROR error);

            //2.9.0
            void onLocalAudioStats_node(const LocalAudioStats& stats) ;
            void onLocalAudioStateChanged_node(LOCAL_AUDIO_STREAM_STATE state, LOCAL_AUDIO_STREAM_ERROR error) ;
            void onRemoteAudioStateChanged_node(uid_t uid, REMOTE_AUDIO_STATE state, REMOTE_AUDIO_STATE_REASON reason, int elapsed) ;
            void onChannelMediaRelayStateChanged_node(CHANNEL_MEDIA_RELAY_STATE state,CHANNEL_MEDIA_RELAY_ERROR code);
            void onChannelMediaRelayEvent_node(CHANNEL_MEDIA_RELAY_EVENT code);

            //3.1.0
        private:
            std::unordered_map<std::string, NodeEventCallback*> m_callbacks;
            NodeRtcEngine* m_engine;
        };
    }
}

#endif
