//
// Created by LXH on 2021/1/19.
//

#ifndef RTC_CHANNEL_EVENT_HANDLER_H_
#define RTC_CHANNEL_EVENT_HANDLER_H_

#include "IAgoraRtcChannel.h"
#include "iris_event_handler.h"

namespace agora {
namespace iris {
namespace rtc {
class RtcChannelEventHandler : public agora::rtc::IChannelEventHandler {
 public:
  void onChannelWarning(agora::rtc::IChannel *rtcChannel, int warn,
                        const char *msg) override;

  void onChannelError(agora::rtc::IChannel *rtcChannel, int err,
                      const char *msg) override;

  void onJoinChannelSuccess(agora::rtc::IChannel *rtcChannel,
                            agora::rtc::uid_t uid, int elapsed) override;

  void onRejoinChannelSuccess(agora::rtc::IChannel *rtcChannel,
                              agora::rtc::uid_t uid, int elapsed) override;

  void onLeaveChannel(agora::rtc::IChannel *rtcChannel,
                      const agora::rtc::RtcStats &stats) override;

  void onClientRoleChanged(agora::rtc::IChannel *rtcChannel,
                           agora::rtc::CLIENT_ROLE_TYPE oldRole,
                           agora::rtc::CLIENT_ROLE_TYPE newRole) override;

  void onUserJoined(agora::rtc::IChannel *rtcChannel, agora::rtc::uid_t uid,
                    int elapsed) override;

  void onUserOffline(agora::rtc::IChannel *rtcChannel, agora::rtc::uid_t uid,
                     agora::rtc::USER_OFFLINE_REASON_TYPE reason) override;

  void onConnectionLost(agora::rtc::IChannel *rtcChannel) override;

  void onRequestToken(agora::rtc::IChannel *rtcChannel) override;

  void onTokenPrivilegeWillExpire(agora::rtc::IChannel *rtcChannel,
                                  const char *token) override;

  void onRtcStats(agora::rtc::IChannel *rtcChannel,
                  const agora::rtc::RtcStats &stats) override;

  void onNetworkQuality(agora::rtc::IChannel *rtcChannel, agora::rtc::uid_t uid,
                        int txQuality, int rxQuality) override;

  void onRemoteVideoStats(agora::rtc::IChannel *rtcChannel,
                          const agora::rtc::RemoteVideoStats &stats) override;

  void onRemoteAudioStats(agora::rtc::IChannel *rtcChannel,
                          const agora::rtc::RemoteAudioStats &stats) override;

  void onRemoteAudioStateChanged(agora::rtc::IChannel *rtcChannel,
                                 agora::rtc::uid_t uid,
                                 agora::rtc::REMOTE_AUDIO_STATE state,
                                 agora::rtc::REMOTE_AUDIO_STATE_REASON reason,
                                 int elapsed) override;

  void onAudioPublishStateChanged(agora::rtc::IChannel *rtcChannel,
                                  agora::rtc::STREAM_PUBLISH_STATE oldState,
                                  agora::rtc::STREAM_PUBLISH_STATE newState,
                                  int elapseSinceLastState) override;

  void onVideoPublishStateChanged(agora::rtc::IChannel *rtcChannel,
                                  agora::rtc::STREAM_PUBLISH_STATE oldState,
                                  agora::rtc::STREAM_PUBLISH_STATE newState,
                                  int elapseSinceLastState) override;

  void onAudioSubscribeStateChanged(agora::rtc::IChannel *rtcChannel,
                                    agora::rtc::uid_t uid,
                                    agora::rtc::STREAM_SUBSCRIBE_STATE oldState,
                                    agora::rtc::STREAM_SUBSCRIBE_STATE newState,
                                    int elapseSinceLastState) override;

  void onVideoSubscribeStateChanged(agora::rtc::IChannel *rtcChannel,
                                    agora::rtc::uid_t uid,
                                    agora::rtc::STREAM_SUBSCRIBE_STATE oldState,
                                    agora::rtc::STREAM_SUBSCRIBE_STATE newState,
                                    int elapseSinceLastState) override;

  void onUserSuperResolutionEnabled(
      agora::rtc::IChannel *rtcChannel, agora::rtc::uid_t uid, bool enabled,
      agora::rtc::SUPER_RESOLUTION_STATE_REASON reason) override;

  void onActiveSpeaker(agora::rtc::IChannel *rtcChannel,
                       agora::rtc::uid_t uid) override;

  void onVideoSizeChanged(agora::rtc::IChannel *rtcChannel,
                          agora::rtc::uid_t uid, int width, int height,
                          int rotation) override;

  void onRemoteVideoStateChanged(agora::rtc::IChannel *rtcChannel,
                                 agora::rtc::uid_t uid,
                                 agora::rtc::REMOTE_VIDEO_STATE state,
                                 agora::rtc::REMOTE_VIDEO_STATE_REASON reason,
                                 int elapsed) override;

  void onStreamMessage(agora::rtc::IChannel *rtcChannel, agora::rtc::uid_t uid,
                       int streamId, const char *data, size_t length) override;

  void onStreamMessageError(agora::rtc::IChannel *rtcChannel,
                            agora::rtc::uid_t uid, int streamId, int code,
                            int missed, int cached) override;

  void onChannelMediaRelayStateChanged(
      agora::rtc::IChannel *rtcChannel,
      agora::rtc::CHANNEL_MEDIA_RELAY_STATE state,
      agora::rtc::CHANNEL_MEDIA_RELAY_ERROR code) override;

  void
  onChannelMediaRelayEvent(agora::rtc::IChannel *rtcChannel,
                           agora::rtc::CHANNEL_MEDIA_RELAY_EVENT code) override;

  void onRtmpStreamingStateChanged(
      agora::rtc::IChannel *rtcChannel, const char *url,
      agora::rtc::RTMP_STREAM_PUBLISH_STATE state,
      agora::rtc::RTMP_STREAM_PUBLISH_ERROR errCode) override;

  void
  onRtmpStreamingEvent(agora::rtc::IChannel *rtcChannel, const char *url,
                       agora::rtc::RTMP_STREAMING_EVENT eventCode) override;

  void onTranscodingUpdated(agora::rtc::IChannel *rtcChannel) override;

  void onStreamInjectedStatus(agora::rtc::IChannel *rtcChannel, const char *url,
                              agora::rtc::uid_t uid, int status) override;

  void onLocalPublishFallbackToAudioOnly(agora::rtc::IChannel *rtcChannel,
                                         bool isFallbackOrRecover) override;

  void onRemoteSubscribeFallbackToAudioOnly(agora::rtc::IChannel *rtcChannel,
                                            agora::rtc::uid_t uid,
                                            bool isFallbackOrRecover) override;

  void onConnectionStateChanged(
      agora::rtc::IChannel *rtcChannel, agora::rtc::CONNECTION_STATE_TYPE state,
      agora::rtc::CONNECTION_CHANGED_REASON_TYPE reason) override;

 public:
  IrisEventHandler *event_handler_ = nullptr;
};
}// namespace rtc
}// namespace iris
}// namespace agora

#endif// RTC_CHANNEL_EVENT_HANDLER_H_
