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
#include "IAgoraRtcEngineEx.h"
#include "agora_node_ext.h"
#include "node_napi_api.h"
#include <string>
#include <unordered_map>
#include <uv.h>
#include "AgoraBase.h"
namespace agora {
namespace rtc {
#define RTC_EVENT_WARNING "warning"
#define RTC_EVENT_ERROR "error"
#define RTC_EVENT_APICALL_EXECUTED "apicallexecuted"

#define RTC_EVENT_JOIN_CHANNEL "joinchannel"
#define RTC_EVENT_REJOIN_CHANNEL "rejoinchannel"
#define RTC_EVENT_AUDIO_QUALITY "audioquality"
#define RTC_EVENT_LASTMILE_PROBE_RESULT "lastmileProbeResult"
#define RTC_EVENT_AUDIO_VOLUME_INDICATION "audiovolumeindication"
#define RTC_EVENT_LEAVE_CHANNEL "leavechannel"
#define RTC_EVENT_RTC_STATS "rtcstats"
#define RTC_EVENT_AUDIO_DEVICE_STATE_CHANGED "audiodevicestatechanged"
#define RTC_EVENT_AUDIO_MIXING_FINISHED "audiomixingfinished"
#define RTC_EVENT_AUDIO_EFFECT_FINISHED "audioeffectfinished"
#define RTC_EVENT_VIDEO_DEVICE_STATE_CHANGED "videodevicestatechanged"
#define RTC_EVENT_MEDIA_DEVICE_CHANGED "mediaDeviceChanged"
#define RTC_EVENT_NETWORK_QUALITY "networkquality"
#define RTC_EVENT_INTRAREQUESTRECEIVED "intraRequestReceived"
#define RTC_EVENT_UPLINKNETWORKINFOUPDATED "uplinkNetworkInfoUpdated"
#define RTC_EVENT_DOWNLINKNETWORKINFOUPDATED "downlinkNetworkInfoUpdated"
#define RTC_EVENT_LASTMILE_QUALITY "lastmilequality"
#define RTC_EVENT_FIRST_LOCAL_VIDEO_FRAME "firstlocalvideoframe"
#define RTC_EVENT_FIRST_LOCAL_VIDEO_FRAME_PUBLISH                              \
  "firstLocalVideoFramePublished"
#define RTC_EVENT_VIDEO_SOURCE_FRAME_SIZE_CHANGED "videoSourceFrameSizeChanged"
#define RTC_EVENT_FIRST_REMOTE_VIDEO_DECODED "firstremotevideodecoded"
#define RTC_EVENT_VIDEO_SIZE_CHANGED "videosizechanged"
#define RTC_EVENT_LOCAL_VIDEO_STATE_CHANGED "localVideoStateChanged"
#define RTC_EVENT_REMOTE_VIDEO_STATE_CHANGED "remoteVideoStateChanged"
#define RTC_EVENT_FIRST_REMOTE_VIDEO_FRAME "firstremotevideoframe"
#define RTC_EVENT_USER_JOINED "userjoined"
#define RTC_EVENT_USER_OFFLINE "useroffline"
#define RTC_EVENT_USER_MUTE_VIDEO "usermutevideo"
#define RTC_EVENT_USER_ENABLE_VIDEO "userenablevideo"
#define RTC_EVENT_USER_ENABLE_LOCAL_VIDEO "userenablelocalvideo"
#define RTC_EVENT_LOCAL_AUDIO_STATS "localAudioStats"
#define RTC_EVENT_REMOTE_AUDIO_STATS "remoteAudioStats"
#define RTC_EVENT_LOCAL_VIDEO_STATS "localvideostats"
#define RTC_EVENT_REMOTE_VIDEO_STATS "remotevideostats"
#define RTC_EVENT_CAMERA_READY "cameraReady"
#define RTC_EVENT_CAMERA_FOCUS_AREA_CHANGED "cameraFocusAreaChanged"
#define RTC_EVENT_CAMERA_EXPOSURE_AREA_CHANGED "cameraExposureAreaChanged"
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
#define RTC_EVENT_FACE_POSITION_CHANGED "facePositionChanged"
#endif
#define RTC_EVENT_VIDEO_STOPPED "videostopped"
#define RTC_EVENT_AUDIO_MIXING_STATE_CHANGED "audioMixingStateChanged"
#define RTC_EVENT_CONNECTION_LOST "connectionlost"
#define RTC_EVENT_CONNECTION_INTERRUPTED "connectioninterrupted"
#define RTC_EVENT_CONNECTION_BANNED "connectionbanned"
#define RTC_EVENT_STREAM_MESSAGE "streammessage"
#define RTC_EVENT_STREAM_MESSAGE_ERROR "streammessageerror"
#define RTC_EVENT_REQUEST_TOKEN "requestToken"
#define RTC_EVENT_TOKEN_PRIVILEGE_WILL_EXPIRE "tokenPrivilegeWillExpire"
#define RTC_EVENT_FIRST_LOCAL_AUDIO_FRAME_PUBLISH                              \
  "firstLocalAudioFramePublished"
#define RTC_EVENT_LOCAL_AUDIO_STATE_CHANGED "localAudioStateChanged"
#define RTC_EVENT_REMOTE_AUDIO_STATE_CHANGED "remoteAudioStateChanged"
#define RTC_EVENT_ACTIVE_SPEAKER "activespeaker"
#define RTC_EVENT_CLIENT_ROLE_CHANGED "clientrolechanged"
#define RTC_EVENT_AUDIO_DEVICE_VOLUME_CHANGED "audiodevicevolumechanged"
#define RTC_EVENT_RTMP_STREAMING_STATE_CHANGED "rtmpStreamingStateChanged"
#define RTC_EVENT_REMOTE_AUDIO_TRANSPORT_STATS "remoteAudioTransportStats"
#define RTC_EVENT_STREAM_PUBLISHED "streamPublished"
#define RTC_EVENT_STREAM_UNPUBLISHED "streamUnpublished"
#define RTC_EVENT_TRANSCODING_UPDATED "transcodingUpdated"
// not match
#define RTC_EVENT_AUDIO_ROUTING_CHANGED "audioRouteChanged"
// not match
#define RTC_EVENT_CHANNEL_MEDIA_RELAY_STATE_CHANGED "channelMediaRelayState"
#define RTC_EVENT_CHANNEL_MEDIA_RELAY_EVENT "channelMediaRelayEvent"
#define RTC_EVENT_LOCAL_PUBLISH_FALLBACK_TO_AUDIO_ONLY                         \
  "localPublishFallbackToAudioOnly"
#define RTC_EVENT_REMOTE_SUBSCRIBE_FALLBACK_TO_AUDIO_ONLY                      \
  "remoteSubscribeFallbackToAudioOnly"
#define RTC_EVENT_REMOTE_VIDEO_TRANSPORT_STATS "remoteVideoTransportStats"
#define RTC_EVENT_CONNECTION_STATE_CHANGED "connectionStateChanged"
#define RTC_EVENT_NETWORK_TYPE_CHANGED "networkTypeChanged"
#define RTC_EVENT_ENCRYPTION_ERROR "encryptionError"
#define RTC_EVENT_PERMISSION_ERROR "permissionError"
#define RTC_EVENT_LOCAL_USER_REGISTERED "localUserRegistered"
#define RTC_EVENT_USER_INFO_UPDATED "userInfoUpdated"
#define RTC_EVENT_AUDIO_SUBSCRIBE_STATE_CHANGED "audioSubscribeStateChanged"
#define RTC_EVENT_VIDEO_SUBSCRIBE_STATE_CHANGED "videoSubscribeStateChanged"
#define RTC_EVENT_AUDIO_PUBLISH_STATE_CHANGED "audioPublishStateChanged"
#define RTC_EVENT_VIDEO_PUBLISH_STATE_CHANGED "videoPublishStateChanged"
#define RTC_EVENT_EXTENSION_EVENT "extensionEvent"
#define RTC_EVENT_EXTENSION_STARTED "extensionStarted"
#define RTC_EVENT_EXTENSION_STOPPED "extensionStopped"
#define RTC_EVENT_EXTENSION_ERRORED "extensionErrored"
#define RTC_EVENT_USER_ACCOUNT_UPDATED "userAccountUpdated"

// not use
#define RTC_EVENT_REMOTE_AUDIO_MIXING_BEGIN "remoteaudiomixingbegin"
#define RTC_EVENT_REMOTE_AUDIO_MIXING_END "remoteaudiomixingend"
#define RTC_EVENT_USER_MUTE_AUDIO "usermuteaudio"
#define RTC_EVENT_REFRESH_RECORDING_SERVICE_STATUS                             \
  "refreshrecordingservicestatus"
#define RTC_EVENT_MEDIA_ENGINE_LOAD_SUCCESS "mediaengineloadsuccess"
#define RTC_EVENT_MEDIA_ENGINE_STARTCALL_SUCCESS "mediaenginestartcallsuccess"
#define RTC_EVENT_FIRST_LOCAL_AUDIO_FRAME "firstlocalaudioframe"
#define RTC_EVENT_FIRST_REMOTE_AUDIO_FRAME "firstremoteaudioframe"
#define RTC_EVENT_FIRST_REMOTE_AUDIO_DECODED "firstRemoteAudioDecoded"
#define RTC_EVENT_STREAM_INJECT_STATUS "streamInjectStatus"
#define RTC_EVENT_RTMP_STREAMING_EVENT "rtmpStreamingEvent"
#define RTC_EVENT_MICROPHONE_ENABLED "microphoneEnabled"
#define RTC_EVENT_VIDEO_SOURCE_JOIN_SUCCESS "videosourcejoinsuccess"
#define RTC_EVENT_VIDEO_SOURCE_REQUEST_NEW_TOKEN "videosourcerequestnewtoken"
#define RTC_EVENT_VIDEO_SOURCE_LEAVE_CHANNEL "videosourceleavechannel"
#define RTC_EVENT_API_ERROR "apierror"
#define RTC_EVENT_LOCAL_VIDEO_TRANSCODER_ERROR "localvideotranscodererror"
class NodeRtcEngine;
class NodeUid;
class CustomRtcConnection;
class NodeEventHandler : public IRtcEngineEventHandlerEx {
public:
  struct NodeEventCallback {
    Persistent<Function> callback;
    Persistent<Object> js_this;
  };

public:
  NodeEventHandler(NodeRtcEngine *pEngine);
  ~NodeEventHandler();
  void fireApiError(const char *funcName);
  void addEventHandler(const std::string &eventName, Persistent<Object> &obj,
                       Persistent<Function> &callback);

  // send to js
  virtual void onWarning(int warn, const char *msg) override;
  virtual void onError(int err, const char *msg) override;
  virtual void onApiCallExecuted(int err, const char *api,
                                 const char *result) override;

  virtual void
  onLastmileProbeResult(const LastmileProbeResult &result) override;
  virtual void onAudioDeviceStateChanged(const char *deviceId, int deviceType,
                                         int deviceState) override;
  virtual void onAudioMixingFinished() override;
  virtual void onAudioEffectFinished(int soundId) override;
  virtual void onVideoDeviceStateChanged(const char *deviceId, int deviceType,
                                         int deviceState) override;
  virtual void onMediaDeviceChanged(int deviceType) override;
  virtual void
  onUplinkNetworkInfoUpdated(const UplinkNetworkInfo &info) override;
  virtual void
  onDownlinkNetworkInfoUpdated(const DownlinkNetworkInfo &info) override;
  virtual void onLastmileQuality(int quality) override;
  virtual void onCameraReady() override;
  virtual void onCameraFocusAreaChanged(int x, int y, int width,
                                        int height) override;
  virtual void onCameraExposureAreaChanged(int x, int y, int width,
                                           int height) override;
#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
  virtual void onFacePositionChanged(int imageWidth, int imageHeight,
                                     const Rectangle *vecRectangle,
                                     const int *vecDistance,
                                     int numFaces) override;
#endif
  virtual void onVideoStopped() override;
  virtual void
  onAudioMixingStateChanged(AUDIO_MIXING_STATE_TYPE state,
                            AUDIO_MIXING_ERROR_TYPE errorCode) override;
  virtual void onAudioDeviceVolumeChanged(MEDIA_DEVICE_TYPE deviceType,
                                          int volume, bool muted) override;
  virtual void
  onRtmpStreamingStateChanged(const char *url, RTMP_STREAM_PUBLISH_STATE state,
                              RTMP_STREAM_PUBLISH_ERROR errCode) override;
  virtual void onStreamPublished(const char *url, int error) override;
  virtual void onStreamUnpublished(const char *url) override;
  virtual void onTranscodingUpdated() override;
  virtual void onAudioRoutingChanged(int routing) override;
  virtual void onChannelMediaRelayStateChanged(int state, int code) override;
  virtual void onChannelMediaRelayEvent(int code) override;
  virtual void
  onLocalPublishFallbackToAudioOnly(bool isFallbackOrRecover) override;
  virtual void
  onRemoteSubscribeFallbackToAudioOnly(uid_t uid,
                                       bool isFallbackOrRecover) override;
  virtual void onPermissionError(PERMISSION_TYPE permissionType) override;
  virtual void onLocalUserRegistered(uid_t uid,
                                     const char *userAccount) override;
  virtual void onUserInfoUpdated(uid_t uid, const UserInfo &info) override;
  virtual void onAudioSubscribeStateChanged(const char *channel, uid_t uid,
                                            STREAM_SUBSCRIBE_STATE oldState,
                                            STREAM_SUBSCRIBE_STATE newState,
                                            int elapseSinceLastState) override;
  virtual void onVideoSubscribeStateChanged(const char *channel, uid_t uid,
                                            STREAM_SUBSCRIBE_STATE oldState,
                                            STREAM_SUBSCRIBE_STATE newState,
                                            int elapseSinceLastState) override;
  virtual void onAudioPublishStateChanged(const char *channel,
                                          STREAM_PUBLISH_STATE oldState,
                                          STREAM_PUBLISH_STATE newState,
                                          int elapseSinceLastState) override;
  virtual void onVideoPublishStateChanged(const char *channel,
                                          STREAM_PUBLISH_STATE oldState,
                                          STREAM_PUBLISH_STATE newState,
                                          int elapseSinceLastState) override;
  // para changed
  virtual void onExtensionEvent(const char *provider_name, const char *ext_name,
                                const char *key,
                                const char *json_value) override;
  // new
  virtual void onExtensionStarted(const char *provider_name,
                                  const char *ext_name) override;
  virtual void onExtensionStopped(const char *provider_name,
                                  const char *ext_name) override;
  virtual void onExtensionErrored(const char *provider_name,
                                  const char *ext_name, int error,
                                  const char *msg) override;

  // ex
  virtual void onJoinChannelSuccess(const class RtcConnection &connection,
                                    int elapsed) override;
  virtual void onRejoinChannelSuccess(const RtcConnection &connection,
                                      int elapsed) override;
  virtual void onAudioQuality(const RtcConnection &connection, uid_t remoteUid,
                              int quality, unsigned short delay,
                              unsigned short lost) override;
  virtual void onAudioVolumeIndication(const RtcConnection &connection,
                                       const AudioVolumeInfo *sperkers,
                                       unsigned int speakerNumber,
                                       int totalVolume) override;
  virtual void onLeaveChannel(const RtcConnection &connection,
                              const RtcStats &stats) override;
  virtual void onRtcStats(const RtcConnection &connection,
                          const RtcStats &stats) override;
  virtual void onNetworkQuality(const RtcConnection &connection,
                                uid_t remoteUid, int txQuality,
                                int rxQuality) override;
  virtual void onIntraRequestReceived(const RtcConnection &connection) override;
  virtual void onFirstLocalVideoFrame(const RtcConnection &connection,
                                      int width, int height,
                                      int elapsed) override;
  virtual void onFirstLocalVideoFramePublished(const RtcConnection &connection,
                                               int elapsed) override;
  virtual void onVideoSourceFrameSizeChanged(const RtcConnection &connection,
                                             VIDEO_SOURCE_TYPE sourceType,
                                             int width, int height) override;
  virtual void onFirstRemoteVideoDecoded(const RtcConnection &connection,
                                         uid_t remoteUid, int width, int height,
                                         int elapsed) override;
  virtual void onVideoSizeChanged(const RtcConnection &connection, uid_t uid,
                                  int width, int height, int rotation) override;
  virtual void
  onLocalVideoStateChanged(const RtcConnection &connection,
                           LOCAL_VIDEO_STREAM_STATE state,
                           LOCAL_VIDEO_STREAM_ERROR errorCode) override;

  virtual void onRemoteVideoStateChanged(const RtcConnection &connection,
                                         uid_t remoteUid,
                                         REMOTE_VIDEO_STATE state,
                                         REMOTE_VIDEO_STATE_REASON reason,
                                         int elapsed) override;
  virtual void onFirstRemoteVideoFrame(const RtcConnection &connection,
                                       uid_t remoteUid, int width, int height,
                                       int elapsed) override;
  virtual void onUserJoined(const RtcConnection &connection, uid_t remoteUid,
                            int elapsed) override;
  virtual void onUserOffline(const RtcConnection &connection, uid_t remoteUid,
                             USER_OFFLINE_REASON_TYPE reason) override;
  virtual void onUserMuteVideo(const RtcConnection &connection, uid_t remoteUid,
                               bool muted) override;
  virtual void onUserEnableVideo(const RtcConnection &connection,
                                 uid_t remoteUid, bool enabled) override;
  virtual void onUserEnableLocalVideo(const RtcConnection &connection,
                                      uid_t remoteUid, bool enabled) override;
  virtual void onLocalAudioStats(const RtcConnection &connection,
                                 const LocalAudioStats &stats) override;
  virtual void onRemoteAudioStats(const RtcConnection &connection,
                                  const RemoteAudioStats &stats) override;
  virtual void onLocalVideoStats(const RtcConnection &connection,
                                 const LocalVideoStats &stats) override;
  virtual void onRemoteVideoStats(const RtcConnection &connection,
                                  const RemoteVideoStats &stats) override;
  virtual void onConnectionLost(const RtcConnection &connection) override;
  virtual void
  onConnectionInterrupted(const RtcConnection &connection) override;
  virtual void onConnectionBanned(const RtcConnection &connection) override;
  virtual void onStreamMessage(const RtcConnection &connection, uid_t remoteUid,
                               int streamId, const char *data, size_t length,
                               uint64_t sentTs) override;
  virtual void onStreamMessageError(const RtcConnection &connection,
                                    uid_t remoteUid, int streamId, int code,
                                    int missed, int cached) override;
  virtual void onRequestToken(const RtcConnection &connection) override;
  virtual void onTokenPrivilegeWillExpire(const RtcConnection &connection,
                                          const char *token) override;
  virtual void onFirstLocalAudioFramePublished(const RtcConnection &connection,
                                               int elapsed) override;
  virtual void
  onLocalAudioStateChanged(const RtcConnection &connection,
                           LOCAL_AUDIO_STREAM_STATE state,
                           LOCAL_AUDIO_STREAM_ERROR error) override;
  // [para] uid->remoteUid
  // virtual void onRemoteAudioStateChanged(const RtcConnection& connection,
  // uid_t uid, REMOTE_AUDIO_STATE state, REMOTE_AUDIO_STATE_REASON reason, int
  // elapsed) override;
  virtual void onRemoteAudioStateChanged(const RtcConnection &connection,
                                         uid_t remoteUid,
                                         REMOTE_AUDIO_STATE state,
                                         REMOTE_AUDIO_STATE_REASON reason,
                                         int elapsed) override;
  virtual void onActiveSpeaker(const RtcConnection &connection,
                               uid_t uid) override;
  virtual void onClientRoleChanged(const RtcConnection &connection,
                                   CLIENT_ROLE_TYPE oldRole,
                                   CLIENT_ROLE_TYPE newRole) override;
  virtual void onRemoteAudioTransportStats(const RtcConnection &connection,
                                           uid_t remoteUid,
                                           unsigned short delay,
                                           unsigned short lost,
                                           unsigned short rxKBitRate) override;
  virtual void onRemoteVideoTransportStats(const RtcConnection &connection,
                                           uid_t remoteUid,
                                           unsigned short delay,
                                           unsigned short lost,
                                           unsigned short rxKBitRate) override;
  virtual void
  onConnectionStateChanged(const RtcConnection &connection,
                           CONNECTION_STATE_TYPE state,
                           CONNECTION_CHANGED_REASON_TYPE reason) override;
  virtual void onNetworkTypeChanged(const RtcConnection &connection,
                                    NETWORK_TYPE type) override;
  virtual void onEncryptionError(const RtcConnection &connection,
                                 ENCRYPTION_ERROR_TYPE errorType) override;
  virtual void onUserAccountUpdated(const RtcConnection &connection,
                                    uid_t remoteUid,
                                    const char *userAccount) override;

  virtual void onLocalVideoTranscoderError(const TranscodingVideoStream &stream,
                                           VIDEO_TRANSCODER_ERROR error) override;

private:
  std::unordered_map<std::string, NodeEventCallback *> m_callbacks;
  NodeRtcEngine *m_engine;

  void onUserInfoUpdated_node(uid_t uid, const UserInfo &info);

  void onAudioVolumeIndication_node(const CustomRtcConnection &connection,
                                    AudioVolumeInfo *sperkers,
                                    unsigned int speakerNumber,
                                    int totalVolume);
  void onRtcStats_node_with_type(const char *type,
                                 const CustomRtcConnection &connection,
                                 const RtcStats &stats);
  void onLocalAudioStats_node(const CustomRtcConnection &connection,
                              const LocalAudioStats &stats);
  void onLocalVideoStats_node(const CustomRtcConnection &connection,
                              const LocalVideoStats &stats);
  void onRemoteVideoStats_node(const CustomRtcConnection &connection,
                               const RemoteVideoStats &stats);
  void onRemoteAudioStats_node(const CustomRtcConnection &connection,
                               const RemoteAudioStats &stats);
  void sendJSWithConnection(const char *type, int count,
                            const CustomRtcConnection connection, ...);
  void onLocalVideoTranscoderError_node(const TranscodingVideoStream *stream,
                                                        VIDEO_TRANSCODER_ERROR error);                            
};
} // namespace rtc
} // namespace agora

#endif
