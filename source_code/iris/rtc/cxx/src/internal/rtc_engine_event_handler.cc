//
// Created by LXH on 2021/1/19.
//

#include "internal/rtc_engine_event_handler.h"
#include "internal/iris_json_utils.h"
#include "internal/iris_rtc_json_encoder.h"

#define ON_EVENT(event, res, ...)                                              \
  IRtcEngineEventHandler::event(__VA_ARGS__);                                  \
  event_handler_->OnEvent(#event, res);

#define ON_EVENT_BUFFER(event, res, buffer, length, ...)                       \
  IRtcEngineEventHandler::event(__VA_ARGS__);                                  \
  event_handler_->OnEvent(#event, res, reinterpret_cast<void *>(buffer),       \
                          length);

#define SET_VALUE$(doc, val, key) SET_VALUE(doc, val, key, key)

#define SET_VALUE_CHAR$(doc, val, key) SET_VALUE_CHAR(doc, val, key, key)

#define SET_VALUE_OBJ$(doc, val, key) SET_VALUE_OBJ(doc, val, key, key)

#define SET_VALUE_ARR$(doc, val, key, count)                                   \
  SET_VALUE_ARR(doc, val, key, key, count)

namespace agora {
using namespace rtc;

namespace iris {
namespace rtc {
using rapidjson::Document;
using rapidjson::Value;

void RtcEngineEventHandler::onWarning(int warn, const char *msg) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, warn)
  SET_VALUE_CHAR$(document, value, msg)

  ON_EVENT(onWarning, ToJsonString(value).c_str(), warn, msg)
}

void RtcEngineEventHandler::onError(int err, const char *msg) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, err)
  SET_VALUE_CHAR$(document, value, msg)

  ON_EVENT(onError, ToJsonString(value).c_str(), err, msg)
}

void RtcEngineEventHandler::onJoinChannelSuccess(const char *channel, uid_t uid,
                                                 int elapsed) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channel)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, elapsed)

  ON_EVENT(onJoinChannelSuccess, ToJsonString(value).c_str(), channel, uid,
           elapsed)
}

void RtcEngineEventHandler::onRejoinChannelSuccess(const char *channel,
                                                   uid_t uid, int elapsed) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channel)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, elapsed)

  ON_EVENT(onRejoinChannelSuccess, ToJsonString(value).c_str(), channel, uid,
           elapsed)
}

void RtcEngineEventHandler::onLeaveChannel(const RtcStats &stats) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, value, stats)

  ON_EVENT(onLeaveChannel, ToJsonString(value).c_str(), stats)
}

void RtcEngineEventHandler::onClientRoleChanged(CLIENT_ROLE_TYPE oldRole,
                                                CLIENT_ROLE_TYPE newRole) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, oldRole)
  SET_VALUE$(document, value, newRole)

  ON_EVENT(onClientRoleChanged, ToJsonString(value).c_str(), oldRole, newRole)
}

void RtcEngineEventHandler::onUserJoined(uid_t uid, int elapsed) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, elapsed)

  ON_EVENT(onUserJoined, ToJsonString(value).c_str(), uid, elapsed)
}

void RtcEngineEventHandler::onUserOffline(uid_t uid,
                                          USER_OFFLINE_REASON_TYPE reason) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, reason)

  ON_EVENT(onUserOffline, ToJsonString(value).c_str(), uid, reason)
}

void RtcEngineEventHandler::onLastmileQuality(int quality) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, quality)

  ON_EVENT(onLastmileQuality, ToJsonString(value).c_str(), quality)
}

void RtcEngineEventHandler::onLastmileProbeResult(
    const LastmileProbeResult &result) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, value, result)

  ON_EVENT(onLastmileProbeResult, ToJsonString(value).c_str(), result)
}

void RtcEngineEventHandler::onConnectionInterrupted() {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);

  ON_EVENT(onConnectionInterrupted, ToJsonString(value).c_str())
}

void RtcEngineEventHandler::onConnectionLost() {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);

  ON_EVENT(onConnectionLost, ToJsonString(value).c_str())
}

void RtcEngineEventHandler::onConnectionBanned() {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);

  ON_EVENT(onConnectionBanned, ToJsonString(value).c_str())
}

void RtcEngineEventHandler::onApiCallExecuted(int err, const char *api,
                                              const char *result) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, err)
  SET_VALUE_CHAR$(document, value, api)
  SET_VALUE_CHAR$(document, value, result)

  ON_EVENT(onApiCallExecuted, ToJsonString(value).c_str(), err, api, result)
}

void RtcEngineEventHandler::onRequestToken() {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);

  ON_EVENT(onRequestToken, ToJsonString(value).c_str())
}

void RtcEngineEventHandler::onTokenPrivilegeWillExpire(const char *token) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, token)

  ON_EVENT(onTokenPrivilegeWillExpire, ToJsonString(value).c_str(), token)
}

void RtcEngineEventHandler::onAudioQuality(uid_t uid, int quality,
                                           unsigned short delay,
                                           unsigned short lost) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, quality)
  SET_VALUE$(document, value, delay)
  SET_VALUE$(document, value, lost)

  ON_EVENT(onAudioQuality, ToJsonString(value).c_str(), uid, quality, delay,
           lost)
}

void RtcEngineEventHandler::onRtcStats(const RtcStats &stats) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, value, stats)

  ON_EVENT(onRtcStats, ToJsonString(value).c_str(), stats)
}

void RtcEngineEventHandler::onNetworkQuality(uid_t uid, int txQuality,
                                             int rxQuality) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, txQuality)
  SET_VALUE$(document, value, rxQuality)

  ON_EVENT(onNetworkQuality, ToJsonString(value).c_str(), uid, txQuality,
           rxQuality)
}

void RtcEngineEventHandler::onLocalVideoStats(const LocalVideoStats &stats) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, value, stats)

  ON_EVENT(onLocalVideoStats, ToJsonString(value).c_str(), stats)
}

void RtcEngineEventHandler::onRemoteVideoStats(const RemoteVideoStats &stats) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, value, stats)

  ON_EVENT(onRemoteVideoStats, ToJsonString(value).c_str(), stats)
}

void RtcEngineEventHandler::onLocalAudioStats(const LocalAudioStats &stats) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, value, stats)

  ON_EVENT(onLocalAudioStats, ToJsonString(value).c_str(), stats)
}

void RtcEngineEventHandler::onRemoteAudioStats(const RemoteAudioStats &stats) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_OBJ$(document, value, stats)

  ON_EVENT(onRemoteAudioStats, ToJsonString(value).c_str(), stats)
}

void RtcEngineEventHandler::onLocalAudioStateChanged(
    LOCAL_AUDIO_STREAM_STATE state, LOCAL_AUDIO_STREAM_ERROR error) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, state)
  SET_VALUE$(document, value, error)

  ON_EVENT(onLocalAudioStateChanged, ToJsonString(value).c_str(), state, error)
}

void RtcEngineEventHandler::onRemoteAudioStateChanged(
    uid_t uid, REMOTE_AUDIO_STATE state, REMOTE_AUDIO_STATE_REASON reason,
    int elapsed) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, state)
  SET_VALUE$(document, value, reason)
  SET_VALUE$(document, value, elapsed)

  ON_EVENT(onRemoteAudioStateChanged, ToJsonString(value).c_str(), uid, state,
           reason, elapsed)
}

void RtcEngineEventHandler::onAudioPublishStateChanged(
    const char *channel, STREAM_PUBLISH_STATE oldState,
    STREAM_PUBLISH_STATE newState, int elapseSinceLastState) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channel)
  SET_VALUE$(document, value, oldState)
  SET_VALUE$(document, value, newState)
  SET_VALUE$(document, value, elapseSinceLastState)

  ON_EVENT(onAudioPublishStateChanged, ToJsonString(value).c_str(), channel,
           oldState, newState, elapseSinceLastState)
}

void RtcEngineEventHandler::onVideoPublishStateChanged(
    const char *channel, STREAM_PUBLISH_STATE oldState,
    STREAM_PUBLISH_STATE newState, int elapseSinceLastState) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channel)
  SET_VALUE$(document, value, oldState)
  SET_VALUE$(document, value, newState)
  SET_VALUE$(document, value, elapseSinceLastState)

  ON_EVENT(onVideoPublishStateChanged, ToJsonString(value).c_str(), channel,
           oldState, newState, elapseSinceLastState)
}

void RtcEngineEventHandler::onAudioSubscribeStateChanged(
    const char *channel, uid_t uid, STREAM_SUBSCRIBE_STATE oldState,
    STREAM_SUBSCRIBE_STATE newState, int elapseSinceLastState) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channel)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, oldState)
  SET_VALUE$(document, value, newState)
  SET_VALUE$(document, value, elapseSinceLastState)

  ON_EVENT(onAudioSubscribeStateChanged, ToJsonString(value).c_str(), channel,
           uid, oldState, newState, elapseSinceLastState)
}

void RtcEngineEventHandler::onVideoSubscribeStateChanged(
    const char *channel, uid_t uid, STREAM_SUBSCRIBE_STATE oldState,
    STREAM_SUBSCRIBE_STATE newState, int elapseSinceLastState) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, channel)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, oldState)
  SET_VALUE$(document, value, newState)
  SET_VALUE$(document, value, elapseSinceLastState)

  ON_EVENT(onVideoSubscribeStateChanged, ToJsonString(value).c_str(), channel,
           uid, oldState, newState, elapseSinceLastState)
}

void RtcEngineEventHandler::onAudioVolumeIndication(
    const AudioVolumeInfo *speakers, unsigned int speakerNumber,
    int totalVolume) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_ARR$(document, value, speakers, speakerNumber)
  SET_VALUE$(document, value, speakerNumber)
  SET_VALUE$(document, value, totalVolume)

  ON_EVENT(onAudioVolumeIndication, ToJsonString(value).c_str(), speakers,
           speakerNumber, totalVolume)
}

void RtcEngineEventHandler::onActiveSpeaker(uid_t uid) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)

  ON_EVENT(onActiveSpeaker, ToJsonString(value).c_str(), uid)
}

void RtcEngineEventHandler::onVideoStopped() {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);

  ON_EVENT(onVideoStopped, ToJsonString(value).c_str())
}

void RtcEngineEventHandler::onFirstLocalVideoFrame(int width, int height,
                                                   int elapsed) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, width)
  SET_VALUE$(document, value, height)
  SET_VALUE$(document, value, elapsed)

  ON_EVENT(onFirstLocalVideoFrame, ToJsonString(value).c_str(), width, height,
           elapsed)
}

void RtcEngineEventHandler::onFirstLocalVideoFramePublished(int elapsed) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, elapsed)

  ON_EVENT(onFirstLocalVideoFramePublished, ToJsonString(value).c_str(),
           elapsed)
}

void RtcEngineEventHandler::onFirstRemoteVideoDecoded(uid_t uid, int width,
                                                      int height, int elapsed) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, width)
  SET_VALUE$(document, value, height)
  SET_VALUE$(document, value, elapsed)

  ON_EVENT(onFirstRemoteVideoDecoded, ToJsonString(value).c_str(), uid, width,
           height, elapsed)
}

void RtcEngineEventHandler::onFirstRemoteVideoFrame(uid_t uid, int width,
                                                    int height, int elapsed) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, width)
  SET_VALUE$(document, value, height)
  SET_VALUE$(document, value, elapsed)

  ON_EVENT(onFirstRemoteVideoFrame, ToJsonString(value).c_str(), uid, width,
           height, elapsed)
}

void RtcEngineEventHandler::onUserMuteAudio(uid_t uid, bool muted) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, muted)

  ON_EVENT(onUserMuteAudio, ToJsonString(value).c_str(), uid, muted)
}

void RtcEngineEventHandler::onUserMuteVideo(uid_t uid, bool muted) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, muted)

  ON_EVENT(onUserMuteVideo, ToJsonString(value).c_str(), uid, muted)
}

void RtcEngineEventHandler::onUserEnableVideo(uid_t uid, bool enabled) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, enabled)

  ON_EVENT(onUserEnableVideo, ToJsonString(value).c_str(), uid, enabled)
}

void RtcEngineEventHandler::onAudioDeviceStateChanged(const char *deviceId,
                                                      int deviceType,
                                                      int deviceState) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, deviceId)
  SET_VALUE$(document, value, deviceType)
  SET_VALUE$(document, value, deviceState)

  ON_EVENT(onAudioDeviceStateChanged, ToJsonString(value).c_str(), deviceId,
           deviceType, deviceState)
}

void RtcEngineEventHandler::onAudioDeviceVolumeChanged(
    MEDIA_DEVICE_TYPE deviceType, int volume, bool muted) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, deviceType)
  SET_VALUE$(document, value, volume)
  SET_VALUE$(document, value, muted)

  ON_EVENT(onAudioDeviceVolumeChanged, ToJsonString(value).c_str(), deviceType,
           volume, muted)
}

void RtcEngineEventHandler::onCameraReady() {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);

  ON_EVENT(onCameraReady, ToJsonString(value).c_str())
}

void RtcEngineEventHandler::onCameraFocusAreaChanged(int x, int y, int width,
                                                     int height) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, x)
  SET_VALUE$(document, value, y)
  SET_VALUE$(document, value, width)
  SET_VALUE$(document, value, height)

  ON_EVENT(onCameraFocusAreaChanged, ToJsonString(value).c_str(), x, y, width,
           height)
}

#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)
void RtcEngineEventHandler::onFacePositionChanged(int imageWidth,
                                                  int imageHeight,
                                                  Rectangle *vecRectangle,
                                                  int *vecDistance,
                                                  int numFaces) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, imageWidth)
  SET_VALUE$(document, value, imageHeight)
  SET_VALUE_ARR$(document, value, vecRectangle, numFaces)
  SET_VALUE_ARR$(document, value, vecDistance, numFaces)
  SET_VALUE$(document, value, numFaces)

  ON_EVENT(onFacePositionChanged, ToJsonString(value).c_str(), imageWidth,
           imageHeight, vecRectangle, vecDistance, numFaces)
}
#endif

void RtcEngineEventHandler::onCameraExposureAreaChanged(int x, int y, int width,
                                                        int height) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, x)
  SET_VALUE$(document, value, y)
  SET_VALUE$(document, value, width)
  SET_VALUE$(document, value, height)

  ON_EVENT(onCameraExposureAreaChanged, ToJsonString(value).c_str(), x, y,
           width, height)
}

void RtcEngineEventHandler::onAudioMixingFinished() {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);

  ON_EVENT(onAudioMixingFinished, ToJsonString(value).c_str())
}

void RtcEngineEventHandler::onAudioMixingStateChanged(
    AUDIO_MIXING_STATE_TYPE state, AUDIO_MIXING_ERROR_TYPE errorCode) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, state)
  SET_VALUE$(document, value, errorCode)

  ON_EVENT(onAudioMixingStateChanged, ToJsonString(value).c_str(), state,
           errorCode)
}

void RtcEngineEventHandler::onRemoteAudioMixingBegin() {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);

  ON_EVENT(onRemoteAudioMixingBegin, ToJsonString(value).c_str())
}

void RtcEngineEventHandler::onRemoteAudioMixingEnd() {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);

  ON_EVENT(onRemoteAudioMixingEnd, ToJsonString(value).c_str())
}

void RtcEngineEventHandler::onAudioEffectFinished(int soundId) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, soundId)

  ON_EVENT(onAudioEffectFinished, ToJsonString(value).c_str(), soundId)
}

void RtcEngineEventHandler::onFirstRemoteAudioDecoded(uid_t uid, int elapsed) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, elapsed)

  ON_EVENT(onFirstRemoteAudioDecoded, ToJsonString(value).c_str(), uid, elapsed)
}

void RtcEngineEventHandler::onVideoDeviceStateChanged(const char *deviceId,
                                                      int deviceType,
                                                      int deviceState) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, deviceId)
  SET_VALUE$(document, value, deviceType)
  SET_VALUE$(document, value, deviceState)

  ON_EVENT(onVideoDeviceStateChanged, ToJsonString(value).c_str(), deviceId,
           deviceType, deviceState)
}

void RtcEngineEventHandler::onLocalVideoStateChanged(
    LOCAL_VIDEO_STREAM_STATE localVideoState, LOCAL_VIDEO_STREAM_ERROR error) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, localVideoState)
  SET_VALUE$(document, value, error)

  ON_EVENT(onLocalVideoStateChanged, ToJsonString(value).c_str(),
           localVideoState, error)
}

void RtcEngineEventHandler::onVideoSizeChanged(uid_t uid, int width, int height,
                                               int rotation) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, width)
  SET_VALUE$(document, value, height)
  SET_VALUE$(document, value, rotation)

  ON_EVENT(onVideoSizeChanged, ToJsonString(value).c_str(), uid, width, height,
           rotation)
}

void RtcEngineEventHandler::onRemoteVideoStateChanged(
    uid_t uid, REMOTE_VIDEO_STATE state, REMOTE_VIDEO_STATE_REASON reason,
    int elapsed) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, state)
  SET_VALUE$(document, value, reason)
  SET_VALUE$(document, value, elapsed)

  ON_EVENT(onRemoteVideoStateChanged, ToJsonString(value).c_str(), uid, state,
           reason, elapsed)
}

void RtcEngineEventHandler::onUserEnableLocalVideo(uid_t uid, bool enabled) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, enabled)

  ON_EVENT(onUserEnableLocalVideo, ToJsonString(value).c_str(), uid, enabled)
}

void RtcEngineEventHandler::onStreamMessage(uid_t uid, int streamId,
                                            const char *data, size_t length) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, streamId)
  SET_VALUE(document, value, length, (unsigned int) length)

  ON_EVENT_BUFFER(onStreamMessage, ToJsonString(value).c_str(),
                  const_cast<char *>(data), length, uid, streamId, data, length)
}

void RtcEngineEventHandler::onStreamMessageError(uid_t uid, int streamId,
                                                 int code, int missed,
                                                 int cached) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, streamId)
  SET_VALUE$(document, value, code)
  SET_VALUE$(document, value, missed)
  SET_VALUE$(document, value, cached)

  ON_EVENT(onStreamMessageError, ToJsonString(value).c_str(), uid, streamId,
           code, missed, cached)
}

void RtcEngineEventHandler::onMediaEngineLoadSuccess() {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);

  ON_EVENT(onMediaEngineLoadSuccess, ToJsonString(value).c_str())
}

void RtcEngineEventHandler::onMediaEngineStartCallSuccess() {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);

  ON_EVENT(onMediaEngineStartCallSuccess, ToJsonString(value).c_str())
}

void RtcEngineEventHandler::onUserSuperResolutionEnabled(
    uid_t uid, bool enabled, SUPER_RESOLUTION_STATE_REASON reason) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, enabled)
  SET_VALUE$(document, value, reason)

  ON_EVENT(onUserSuperResolutionEnabled, ToJsonString(value).c_str(), uid,
           enabled, reason)
}

void RtcEngineEventHandler::onChannelMediaRelayStateChanged(
    CHANNEL_MEDIA_RELAY_STATE state, CHANNEL_MEDIA_RELAY_ERROR code) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, state)
  SET_VALUE$(document, value, code)

  ON_EVENT(onChannelMediaRelayStateChanged, ToJsonString(value).c_str(), state,
           code)
}

void RtcEngineEventHandler::onChannelMediaRelayEvent(
    CHANNEL_MEDIA_RELAY_EVENT code) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, code)

  ON_EVENT(onChannelMediaRelayEvent, ToJsonString(value).c_str(), code)
}

void RtcEngineEventHandler::onFirstLocalAudioFrame(int elapsed) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, elapsed)

  ON_EVENT(onFirstLocalAudioFrame, ToJsonString(value).c_str(), elapsed)
}

void RtcEngineEventHandler::onFirstLocalAudioFramePublished(int elapsed) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, elapsed)

  ON_EVENT(onFirstLocalAudioFramePublished, ToJsonString(value).c_str(),
           elapsed)
}

void RtcEngineEventHandler::onFirstRemoteAudioFrame(uid_t uid, int elapsed) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, elapsed)

  ON_EVENT(onFirstRemoteAudioFrame, ToJsonString(value).c_str(), uid, elapsed)
}

void RtcEngineEventHandler::onRtmpStreamingStateChanged(
    const char *url, RTMP_STREAM_PUBLISH_STATE state,
    RTMP_STREAM_PUBLISH_ERROR errCode) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, url)
  SET_VALUE$(document, value, state)
  SET_VALUE$(document, value, errCode)

  ON_EVENT(onRtmpStreamingStateChanged, ToJsonString(value).c_str(), url, state,
           errCode)
}

void RtcEngineEventHandler::onRtmpStreamingEvent(
    const char *url, RTMP_STREAMING_EVENT eventCode) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, url)
  SET_VALUE$(document, value, eventCode)

  ON_EVENT(onRtmpStreamingEvent, ToJsonString(value).c_str(), url, eventCode)
}

void RtcEngineEventHandler::onStreamPublished(const char *url, int error) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, url)
  SET_VALUE$(document, value, error)

  ON_EVENT(onStreamPublished, ToJsonString(value).c_str(), url, error)
}

void RtcEngineEventHandler::onStreamUnpublished(const char *url) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, url)

  ON_EVENT(onStreamUnpublished, ToJsonString(value).c_str(), url)
}

void RtcEngineEventHandler::onTranscodingUpdated() {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);

  ON_EVENT(onTranscodingUpdated, ToJsonString(value).c_str())
}

void RtcEngineEventHandler::onStreamInjectedStatus(const char *url, uid_t uid,
                                                   int status) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, url)
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, status)

  ON_EVENT(onStreamInjectedStatus, ToJsonString(value).c_str(), url, uid,
           status)
}

void RtcEngineEventHandler::onAudioRouteChanged(AUDIO_ROUTE_TYPE routing) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, routing)

  ON_EVENT(onAudioRouteChanged, ToJsonString(value).c_str(), routing)
}

void RtcEngineEventHandler::onLocalPublishFallbackToAudioOnly(
    bool isFallbackOrRecover) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, isFallbackOrRecover)

  ON_EVENT(onLocalPublishFallbackToAudioOnly, ToJsonString(value).c_str(),
           isFallbackOrRecover)
}

void RtcEngineEventHandler::onRemoteSubscribeFallbackToAudioOnly(
    uid_t uid, bool isFallbackOrRecover) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, isFallbackOrRecover)

  ON_EVENT(onRemoteSubscribeFallbackToAudioOnly, ToJsonString(value).c_str(),
           uid, isFallbackOrRecover)
}

void RtcEngineEventHandler::onRemoteAudioTransportStats(
    uid_t uid, unsigned short delay, unsigned short lost,
    unsigned short rxKBitRate) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, delay)
  SET_VALUE$(document, value, lost)
  SET_VALUE$(document, value, rxKBitRate)

  ON_EVENT(onRemoteAudioTransportStats, ToJsonString(value).c_str(), uid, delay,
           lost, rxKBitRate)
}

void RtcEngineEventHandler::onRemoteVideoTransportStats(
    uid_t uid, unsigned short delay, unsigned short lost,
    unsigned short rxKBitRate) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE$(document, value, delay)
  SET_VALUE$(document, value, lost)
  SET_VALUE$(document, value, rxKBitRate)

  ON_EVENT(onRemoteVideoTransportStats, ToJsonString(value).c_str(), uid, delay,
           lost, rxKBitRate)
}

void RtcEngineEventHandler::onMicrophoneEnabled(bool enabled) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, enabled)

  ON_EVENT(onMicrophoneEnabled, ToJsonString(value).c_str(), enabled)
}

void RtcEngineEventHandler::onConnectionStateChanged(
    CONNECTION_STATE_TYPE state, CONNECTION_CHANGED_REASON_TYPE reason) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, state)
  SET_VALUE$(document, value, reason)

  ON_EVENT(onConnectionStateChanged, ToJsonString(value).c_str(), state, reason)
}

void RtcEngineEventHandler::onNetworkTypeChanged(NETWORK_TYPE type) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, type)

  ON_EVENT(onNetworkTypeChanged, ToJsonString(value).c_str(), type)
}

void RtcEngineEventHandler::onLocalUserRegistered(uid_t uid,
                                                  const char *userAccount) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE_CHAR$(document, value, userAccount)

  ON_EVENT(onLocalUserRegistered, ToJsonString(value).c_str(), uid, userAccount)
}

void RtcEngineEventHandler::onUserInfoUpdated(uid_t uid, const UserInfo &info) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE$(document, value, uid)
  SET_VALUE_OBJ$(document, value, info)

  ON_EVENT(onUserInfoUpdated, ToJsonString(value).c_str(), uid, info)
}

void RtcEngineEventHandler::onUploadLogResult(const char *requestId,
                                              bool success,
                                              UPLOAD_ERROR_REASON reason) {
  if (!event_handler_) return;

  Document document;
  Value value(rapidjson::kObjectType);
  SET_VALUE_CHAR$(document, value, requestId)
  SET_VALUE$(document, value, success)
  SET_VALUE$(document, value, reason)

  ON_EVENT(onUploadLogResult, ToJsonString(value).c_str(), requestId, success,
           reason)
}
}// namespace rtc
}// namespace iris
}// namespace agora
