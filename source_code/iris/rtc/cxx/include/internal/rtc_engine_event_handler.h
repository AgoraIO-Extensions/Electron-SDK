//
// Created by LXH on 2021/1/19.
//

#ifndef RTC_ENGINE_EVENT_HANDLER_H_
#define RTC_ENGINE_EVENT_HANDLER_H_

#include "IAgoraRtcEngine.h"
#include "iris_event_handler.h"

namespace agora {
namespace iris {
namespace rtc {
class RtcEngineEventHandler : public agora::rtc::IRtcEngineEventHandler {
 public:
  void onWarning(int warn, const char *msg) override;

  void onError(int err, const char *msg) override;

  void onJoinChannelSuccess(const char *channel, agora::rtc::uid_t uid,
                            int elapsed) override;

  void onRejoinChannelSuccess(const char *channel, agora::rtc::uid_t uid,
                              int elapsed) override;

  void onLeaveChannel(const agora::rtc::RtcStats &stats) override;

  void onClientRoleChanged(agora::rtc::CLIENT_ROLE_TYPE oldRole,
                           agora::rtc::CLIENT_ROLE_TYPE newRole) override;

  void onUserJoined(agora::rtc::uid_t uid, int elapsed) override;

  void onUserOffline(agora::rtc::uid_t uid,
                     agora::rtc::USER_OFFLINE_REASON_TYPE reason) override;

  void onLastmileQuality(int quality) override;

  void
  onLastmileProbeResult(const agora::rtc::LastmileProbeResult &result) override;

  void onConnectionInterrupted() override;

  void onConnectionLost() override;

  void onConnectionBanned() override;

  void onApiCallExecuted(int err, const char *api, const char *result) override;

  void onRequestToken() override;

  void onTokenPrivilegeWillExpire(const char *token) override;

  void onAudioQuality(agora::rtc::uid_t uid, int quality, unsigned short delay,
                      unsigned short lost) override;

  void onRtcStats(const agora::rtc::RtcStats &stats) override;

  void onNetworkQuality(agora::rtc::uid_t uid, int txQuality,
                        int rxQuality) override;

  void onLocalVideoStats(const agora::rtc::LocalVideoStats &stats) override;

  void onRemoteVideoStats(const agora::rtc::RemoteVideoStats &stats) override;

  void onLocalAudioStats(const agora::rtc::LocalAudioStats &stats) override;

  void onRemoteAudioStats(const agora::rtc::RemoteAudioStats &stats) override;

  void
  onLocalAudioStateChanged(agora::rtc::LOCAL_AUDIO_STREAM_STATE state,
                           agora::rtc::LOCAL_AUDIO_STREAM_ERROR error) override;

  void onRemoteAudioStateChanged(agora::rtc::uid_t uid,
                                 agora::rtc::REMOTE_AUDIO_STATE state,
                                 agora::rtc::REMOTE_AUDIO_STATE_REASON reason,
                                 int elapsed) override;

  void onAudioPublishStateChanged(const char *channel,
                                  agora::rtc::STREAM_PUBLISH_STATE oldState,
                                  agora::rtc::STREAM_PUBLISH_STATE newState,
                                  int elapseSinceLastState) override;

  void onVideoPublishStateChanged(const char *channel,
                                  agora::rtc::STREAM_PUBLISH_STATE oldState,
                                  agora::rtc::STREAM_PUBLISH_STATE newState,
                                  int elapseSinceLastState) override;

  void onAudioSubscribeStateChanged(const char *channel, agora::rtc::uid_t uid,
                                    agora::rtc::STREAM_SUBSCRIBE_STATE oldState,
                                    agora::rtc::STREAM_SUBSCRIBE_STATE newState,
                                    int elapseSinceLastState) override;

  void onVideoSubscribeStateChanged(const char *channel, agora::rtc::uid_t uid,
                                    agora::rtc::STREAM_SUBSCRIBE_STATE oldState,
                                    agora::rtc::STREAM_SUBSCRIBE_STATE newState,
                                    int elapseSinceLastState) override;

  void onAudioVolumeIndication(const agora::rtc::AudioVolumeInfo *speakers,
                               unsigned int speakerNumber,
                               int totalVolume) override;

  void onActiveSpeaker(agora::rtc::uid_t uid) override;

  void onVideoStopped() override;

  void onFirstLocalVideoFrame(int width, int height, int elapsed) override;

  void onFirstLocalVideoFramePublished(int elapsed) override;

  void onFirstRemoteVideoDecoded(agora::rtc::uid_t uid, int width, int height,
                                 int elapsed) override;

  void onFirstRemoteVideoFrame(agora::rtc::uid_t uid, int width, int height,
                               int elapsed) override;

  void onUserMuteAudio(agora::rtc::uid_t uid, bool muted) override;

  void onUserMuteVideo(agora::rtc::uid_t uid, bool muted) override;

  void onUserEnableVideo(agora::rtc::uid_t uid, bool enabled) override;

  void onAudioDeviceStateChanged(const char *deviceId, int deviceType,
                                 int deviceState) override;

  void onAudioDeviceVolumeChanged(agora::rtc::MEDIA_DEVICE_TYPE deviceType,
                                  int volume, bool muted) override;

  void onCameraReady() override;

  void onCameraFocusAreaChanged(int x, int y, int width, int height) override;

#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
  void onFacePositionChanged(int imageWidth, int imageHeight,
                             agora::rtc::Rectangle *vecRectangle,
                             int *vecDistance, int numFaces) override;
#endif

  void onCameraExposureAreaChanged(int x, int y, int width,
                                   int height) override;

  void onAudioMixingFinished() override;

  void onAudioMixingStateChanged(
      agora::rtc::AUDIO_MIXING_STATE_TYPE state,
      agora::rtc::AUDIO_MIXING_ERROR_TYPE errorCode) override;

  void onRemoteAudioMixingBegin() override;

  void onRemoteAudioMixingEnd() override;

  void onAudioEffectFinished(int soundId) override;

  void onFirstRemoteAudioDecoded(agora::rtc::uid_t uid, int elapsed) override;

  void onVideoDeviceStateChanged(const char *deviceId, int deviceType,
                                 int deviceState) override;

  void
  onLocalVideoStateChanged(agora::rtc::LOCAL_VIDEO_STREAM_STATE localVideoState,
                           agora::rtc::LOCAL_VIDEO_STREAM_ERROR error) override;

  void onVideoSizeChanged(agora::rtc::uid_t uid, int width, int height,
                          int rotation) override;

  void onRemoteVideoStateChanged(agora::rtc::uid_t uid,
                                 agora::rtc::REMOTE_VIDEO_STATE state,
                                 agora::rtc::REMOTE_VIDEO_STATE_REASON reason,
                                 int elapsed) override;

  void onUserEnableLocalVideo(agora::rtc::uid_t uid, bool enabled) override;

  void onStreamMessage(agora::rtc::uid_t uid, int streamId, const char *data,
                       size_t length) override;

  void onStreamMessageError(agora::rtc::uid_t uid, int streamId, int code,
                            int missed, int cached) override;

  void onMediaEngineLoadSuccess() override;

  void onMediaEngineStartCallSuccess() override;

  void onUserSuperResolutionEnabled(
      agora::rtc::uid_t uid, bool enabled,
      agora::rtc::SUPER_RESOLUTION_STATE_REASON reason) override;

  void onChannelMediaRelayStateChanged(
      agora::rtc::CHANNEL_MEDIA_RELAY_STATE state,
      agora::rtc::CHANNEL_MEDIA_RELAY_ERROR code) override;

  void
  onChannelMediaRelayEvent(agora::rtc::CHANNEL_MEDIA_RELAY_EVENT code) override;

  void onFirstLocalAudioFrame(int elapsed) override;

  void onFirstLocalAudioFramePublished(int elapsed) override;

  void onFirstRemoteAudioFrame(agora::rtc::uid_t uid, int elapsed) override;

  void onRtmpStreamingStateChanged(
      const char *url, agora::rtc::RTMP_STREAM_PUBLISH_STATE state,
      agora::rtc::RTMP_STREAM_PUBLISH_ERROR errCode) override;

  void
  onRtmpStreamingEvent(const char *url,
                       agora::rtc::RTMP_STREAMING_EVENT eventCode) override;

  void onStreamPublished(const char *url, int error) override;

  void onStreamUnpublished(const char *url) override;

  void onTranscodingUpdated() override;

  void onStreamInjectedStatus(const char *url, agora::rtc::uid_t uid,
                              int status) override;

  void onAudioRouteChanged(agora::rtc::AUDIO_ROUTE_TYPE routing) override;

  void onLocalPublishFallbackToAudioOnly(bool isFallbackOrRecover) override;

  void onRemoteSubscribeFallbackToAudioOnly(agora::rtc::uid_t uid,
                                            bool isFallbackOrRecover) override;

  void onRemoteAudioTransportStats(agora::rtc::uid_t uid, unsigned short delay,
                                   unsigned short lost,
                                   unsigned short rxKBitRate) override;

  void onRemoteVideoTransportStats(agora::rtc::uid_t uid, unsigned short delay,
                                   unsigned short lost,
                                   unsigned short rxKBitRate) override;

  void onMicrophoneEnabled(bool enabled) override;

  void onConnectionStateChanged(
      agora::rtc::CONNECTION_STATE_TYPE state,
      agora::rtc::CONNECTION_CHANGED_REASON_TYPE reason) override;

  void onNetworkTypeChanged(agora::rtc::NETWORK_TYPE type) override;

  void onLocalUserRegistered(agora::rtc::uid_t uid,
                             const char *userAccount) override;

  void onUserInfoUpdated(agora::rtc::uid_t uid,
                         const agora::rtc::UserInfo &info) override;

  void onUploadLogResult(const char *requestId, bool success,
                         agora::rtc::UPLOAD_ERROR_REASON reason) override;

 public:
  IrisEventHandler *event_handler_ = nullptr;
};
}// namespace rtc
}// namespace iris
}// namespace agora

#endif// RTC_ENGINE_EVENT_HANDLER_H_
