//
// Created by LXH on 2021/1/19.
//

#include "internal/rtc_channel_event_handler.h"
#include "internal/iris_json_utils.h"
#include "internal/iris_rtc_json_encoder.h"

#define ON_EVENT(event, res, ...)                                              \
  IChannelEventHandler::event(__VA_ARGS__);                                    \
  event_handler_->OnEvent(#event, res);

#define ON_EVENT_BUFFER(event, res, buffer, length, ...)                       \
  IChannelEventHandler::event(__VA_ARGS__);                                    \
  event_handler_->OnEvent(#event, res, reinterpret_cast<void *>(buffer),       \
                          length);

#define SET_VALUE$(doc, val, key) SET_VALUE(doc, val, key, key)

#define SET_VALUE_CHAR$(doc, val, key) SET_VALUE_CHAR(doc, val, key, key)

#define SET_VALUE_OBJ$(doc, val, key) SET_VALUE_OBJ(doc, val, key, key)

namespace agora {
using namespace rtc;

namespace iris {
namespace rtc {
using rapidjson::Document;
using rapidjson::Value;

void RtcChannelEventHandler::onChannelWarning(IChannel *rtcChannel, int warn,
                                              const char *msg) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, warn)
  SET_VALUE_CHAR$(document, value, msg)

  ON_EVENT(onChannelWarning, ToJsonString(value).c_str(), rtcChannel, warn, msg)
}

void RtcChannelEventHandler::onChannelError(IChannel *rtcChannel, int err,
                                            const char *msg) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, err)
  SET_VALUE_CHAR$(document, value, msg)

  ON_EVENT(onChannelError, ToJsonString(value).c_str(), rtcChannel, err, msg)
}

void RtcChannelEventHandler::onJoinChannelSuccess(IChannel *rtcChannel,
                                                  uid_t uid, int elapsed) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, elapsed)

  ON_EVENT(onJoinChannelSuccess, ToJsonString(value).c_str(), rtcChannel, uid,
           elapsed)
}

void RtcChannelEventHandler::onRejoinChannelSuccess(IChannel *rtcChannel,
                                                    uid_t uid, int elapsed) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, elapsed)

  ON_EVENT(onRejoinChannelSuccess, ToJsonString(value).c_str(), rtcChannel, uid,
           elapsed)
}

void RtcChannelEventHandler::onLeaveChannel(IChannel *rtcChannel,
                                            const RtcStats &stats) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE_OBJ$(document, value, stats)

  ON_EVENT(onLeaveChannel, ToJsonString(value).c_str(), rtcChannel, stats)
}

void RtcChannelEventHandler::onClientRoleChanged(IChannel *rtcChannel,
                                                 CLIENT_ROLE_TYPE oldRole,
                                                 CLIENT_ROLE_TYPE newRole) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, oldRole)
  SET_VALUE$(document, value, newRole)

  ON_EVENT(onClientRoleChanged, ToJsonString(value).c_str(), rtcChannel,
           oldRole, newRole)
}

void RtcChannelEventHandler::onUserJoined(IChannel *rtcChannel, uid_t uid,
                                          int elapsed) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, elapsed)

  ON_EVENT(onUserJoined, ToJsonString(value).c_str(), rtcChannel, uid, elapsed)
}

void RtcChannelEventHandler::onUserOffline(IChannel *rtcChannel, uid_t uid,
                                           USER_OFFLINE_REASON_TYPE reason) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, reason)

  ON_EVENT(onUserOffline, ToJsonString(value).c_str(), rtcChannel, uid, reason)
}

void RtcChannelEventHandler::onConnectionLost(IChannel *rtcChannel) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)

  ON_EVENT(onConnectionLost, ToJsonString(value).c_str(), rtcChannel)
}

void RtcChannelEventHandler::onRequestToken(IChannel *rtcChannel) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)

  ON_EVENT(onRequestToken, ToJsonString(value).c_str(), rtcChannel)
}

void RtcChannelEventHandler::onTokenPrivilegeWillExpire(IChannel *rtcChannel,
                                                        const char *token) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE_CHAR$(document, value, token)

  ON_EVENT(onTokenPrivilegeWillExpire, ToJsonString(value).c_str(), rtcChannel,
           token)
}

void RtcChannelEventHandler::onRtcStats(IChannel *rtcChannel,
                                        const RtcStats &stats) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE_OBJ$(document, value, stats)

  ON_EVENT(onRtcStats, ToJsonString(value).c_str(), rtcChannel, stats)
}

void RtcChannelEventHandler::onNetworkQuality(IChannel *rtcChannel, uid_t uid,
                                              int txQuality, int rxQuality) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, txQuality)
  SET_VALUE$(document, value, rxQuality)

  ON_EVENT(onNetworkQuality, ToJsonString(value).c_str(), rtcChannel, uid,
           txQuality, rxQuality)
}

void RtcChannelEventHandler::onRemoteVideoStats(IChannel *rtcChannel,
                                                const RemoteVideoStats &stats) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE_OBJ$(document, value, stats)

  ON_EVENT(onRemoteVideoStats, ToJsonString(value).c_str(), rtcChannel, stats)
}

void RtcChannelEventHandler::onRemoteAudioStats(IChannel *rtcChannel,
                                                const RemoteAudioStats &stats) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE_OBJ$(document, value, stats)

  ON_EVENT(onRemoteAudioStats, ToJsonString(value).c_str(), rtcChannel, stats)
}

void RtcChannelEventHandler::onRemoteAudioStateChanged(
    IChannel *rtcChannel, uid_t uid, REMOTE_AUDIO_STATE state,
    REMOTE_AUDIO_STATE_REASON reason, int elapsed) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, state)
  SET_VALUE$(document, value, reason)
  SET_VALUE$(document, value, elapsed)

  ON_EVENT(onRemoteAudioStateChanged, ToJsonString(value).c_str(), rtcChannel,
           uid, state, reason, elapsed)
}

void RtcChannelEventHandler::onAudioPublishStateChanged(
    IChannel *rtcChannel, STREAM_PUBLISH_STATE oldState,
    STREAM_PUBLISH_STATE newState, int elapseSinceLastState) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, oldState)
  SET_VALUE$(document, value, newState)
  SET_VALUE$(document, value, elapseSinceLastState)

  ON_EVENT(onAudioPublishStateChanged, ToJsonString(value).c_str(), rtcChannel,
           oldState, newState, elapseSinceLastState)
}

void RtcChannelEventHandler::onVideoPublishStateChanged(
    IChannel *rtcChannel, STREAM_PUBLISH_STATE oldState,
    STREAM_PUBLISH_STATE newState, int elapseSinceLastState) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, oldState)
  SET_VALUE$(document, value, newState)
  SET_VALUE$(document, value, elapseSinceLastState)

  ON_EVENT(onVideoPublishStateChanged, ToJsonString(value).c_str(), rtcChannel,
           oldState, newState, elapseSinceLastState)
}

void RtcChannelEventHandler::onAudioSubscribeStateChanged(
    IChannel *rtcChannel, uid_t uid, STREAM_SUBSCRIBE_STATE oldState,
    STREAM_SUBSCRIBE_STATE newState, int elapseSinceLastState) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, oldState)
  SET_VALUE$(document, value, newState)
  SET_VALUE$(document, value, elapseSinceLastState)

  ON_EVENT(onAudioSubscribeStateChanged, ToJsonString(value).c_str(),
           rtcChannel, uid, oldState, newState, elapseSinceLastState)
}

void RtcChannelEventHandler::onVideoSubscribeStateChanged(
    IChannel *rtcChannel, uid_t uid, STREAM_SUBSCRIBE_STATE oldState,
    STREAM_SUBSCRIBE_STATE newState, int elapseSinceLastState) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, oldState)
  SET_VALUE$(document, value, newState)
  SET_VALUE$(document, value, elapseSinceLastState)

  ON_EVENT(onVideoSubscribeStateChanged, ToJsonString(value).c_str(),
           rtcChannel, uid, oldState, newState, elapseSinceLastState)
}

void RtcChannelEventHandler::onUserSuperResolutionEnabled(
    IChannel *rtcChannel, uid_t uid, bool enabled,
    SUPER_RESOLUTION_STATE_REASON reason) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, enabled)
  SET_VALUE$(document, value, reason)

  ON_EVENT(onUserSuperResolutionEnabled, ToJsonString(value).c_str(),
           rtcChannel, uid, enabled, reason)
}

void RtcChannelEventHandler::onActiveSpeaker(IChannel *rtcChannel, uid_t uid) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, uid)

  ON_EVENT(onActiveSpeaker, ToJsonString(value).c_str(), rtcChannel, uid)
}

void RtcChannelEventHandler::onVideoSizeChanged(IChannel *rtcChannel, uid_t uid,
                                                int width, int height,
                                                int rotation) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, width)
  SET_VALUE$(document, value, height)
  SET_VALUE$(document, value, rotation)

  ON_EVENT(onVideoSizeChanged, ToJsonString(value).c_str(), rtcChannel, uid,
           width, height, rotation)
}

void RtcChannelEventHandler::onRemoteVideoStateChanged(
    IChannel *rtcChannel, uid_t uid, REMOTE_VIDEO_STATE state,
    REMOTE_VIDEO_STATE_REASON reason, int elapsed) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, state)
  SET_VALUE$(document, value, reason)
  SET_VALUE$(document, value, elapsed)

  ON_EVENT(onRemoteVideoStateChanged, ToJsonString(value).c_str(), rtcChannel,
           uid, state, reason, elapsed)
}

void RtcChannelEventHandler::onStreamMessage(IChannel *rtcChannel, uid_t uid,
                                             int streamId, const char *data,
                                             size_t length) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, streamId)
  SET_VALUE(document, value, length, (unsigned int) length)

  ON_EVENT_BUFFER(onStreamMessage, ToJsonString(value).c_str(),
                  const_cast<char *>(data), length, rtcChannel, uid, streamId,
                  data, length)
}

void RtcChannelEventHandler::onStreamMessageError(IChannel *rtcChannel,
                                                  uid_t uid, int streamId,
                                                  int code, int missed,
                                                  int cached) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, streamId)
  SET_VALUE$(document, value, code)
  SET_VALUE$(document, value, missed)
  SET_VALUE$(document, value, cached)

  ON_EVENT(onStreamMessageError, ToJsonString(value).c_str(), rtcChannel, uid,
           streamId, code, missed, cached)
}

void RtcChannelEventHandler::onChannelMediaRelayStateChanged(
    IChannel *rtcChannel, CHANNEL_MEDIA_RELAY_STATE state,
    CHANNEL_MEDIA_RELAY_ERROR code) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, state)
  SET_VALUE$(document, value, code)

  ON_EVENT(onChannelMediaRelayStateChanged, ToJsonString(value).c_str(),
           rtcChannel, state, code)
}

void RtcChannelEventHandler::onChannelMediaRelayEvent(
    IChannel *rtcChannel, CHANNEL_MEDIA_RELAY_EVENT code) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, code)

  ON_EVENT(onChannelMediaRelayEvent, ToJsonString(value).c_str(), rtcChannel,
           code)
}

void RtcChannelEventHandler::onRtmpStreamingStateChanged(
    IChannel *rtcChannel, const char *url, RTMP_STREAM_PUBLISH_STATE state,
    RTMP_STREAM_PUBLISH_ERROR errCode) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE_CHAR$(document, value, url)
  SET_VALUE$(document, value, state)
  SET_VALUE$(document, value, errCode)

  ON_EVENT(onRtmpStreamingStateChanged, ToJsonString(value).c_str(), rtcChannel,
           url, state, errCode)
}

void RtcChannelEventHandler::onRtmpStreamingEvent(
    IChannel *rtcChannel, const char *url, RTMP_STREAMING_EVENT eventCode) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE_CHAR$(document, value, url)
  SET_VALUE$(document, value, eventCode)

  ON_EVENT(onRtmpStreamingEvent, ToJsonString(value).c_str(), rtcChannel, url,
           eventCode)
}

void RtcChannelEventHandler::onTranscodingUpdated(IChannel *rtcChannel) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)

  ON_EVENT(onTranscodingUpdated, ToJsonString(value).c_str(), rtcChannel)
}

void RtcChannelEventHandler::onStreamInjectedStatus(IChannel *rtcChannel,
                                                    const char *url, uid_t uid,
                                                    int status) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE_CHAR$(document, value, url)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, status)

  ON_EVENT(onStreamInjectedStatus, ToJsonString(value).c_str(), rtcChannel, url,
           uid, status)
}

void RtcChannelEventHandler::onLocalPublishFallbackToAudioOnly(
    IChannel *rtcChannel, bool isFallbackOrRecover) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, isFallbackOrRecover)

  ON_EVENT(onLocalPublishFallbackToAudioOnly, ToJsonString(value).c_str(),
           rtcChannel, isFallbackOrRecover)
}

void RtcChannelEventHandler::onRemoteSubscribeFallbackToAudioOnly(
    IChannel *rtcChannel, uid_t uid, bool isFallbackOrRecover) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, isFallbackOrRecover)

  ON_EVENT(onRemoteSubscribeFallbackToAudioOnly, ToJsonString(value).c_str(),
           rtcChannel, uid, isFallbackOrRecover)
}

void RtcChannelEventHandler::onConnectionStateChanged(
    IChannel *rtcChannel, CONNECTION_STATE_TYPE state,
    CONNECTION_CHANGED_REASON_TYPE reason) {
  if (!event_handler_) return;

  auto channelId = rtcChannel->channelId();

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channelId)
  SET_VALUE$(document, value, state)
  SET_VALUE$(document, value, reason)

  ON_EVENT(onConnectionStateChanged, ToJsonString(value).c_str(), rtcChannel,
           state, reason)
}
}// namespace rtc
}// namespace iris
}// namespace agora
