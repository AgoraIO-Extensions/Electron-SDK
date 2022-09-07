/*
 * Copyright (c) 2021 Agora.io
 * All rights reserved.
 * Proprietry and Confidential -- Agora.io
 */

/*
 *  Created by Luo Hao, 2021
 */

#include "node_event_handler.h"
#include "agora_rtc_engine.h"
#include "node_async_queue.h"
#include "node_log.h"
#include "node_uid.h"
#include "uv.h"
#include <iostream>
#include <stdio.h>
#include <vector>
namespace agora {
namespace rtc {
struct CustomRtcConnection {
  std::string channelId;
  uid_t localUid;
  CustomRtcConnection(const RtcConnection &rtcConnection) {
    channelId = rtcConnection.channelId ? rtcConnection.channelId : "";
    localUid = rtcConnection.localUid;
  }
};
#define FUNC_TRACE

NodeEventHandler::NodeEventHandler(NodeRtcEngine *pEngine)
    : m_engine(pEngine) {}

NodeEventHandler::~NodeEventHandler() {
  for (auto &handler : m_callbacks) {
    delete handler.second;
  }
}

#define MAKE_JS_CALL_0(ev)                                                     \
  auto it = m_callbacks.find(ev);                                              \
  if (it != m_callbacks.end()) {                                               \
    Isolate *isolate = Isolate::GetCurrent();                                  \
    HandleScope scope(isolate);                                                \
    Local<Context> context = isolate->GetCurrentContext();                     \
    NodeEventCallback &cb = *it->second;                                       \
    cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 0,        \
                                   nullptr);                                   \
  }

#define MAKE_JS_CALL_1(ev, type, param)                                        \
  auto it = m_callbacks.find(ev);                                              \
  if (it != m_callbacks.end()) {                                               \
    Isolate *isolate = Isolate::GetCurrent();                                  \
    HandleScope scope(isolate);                                                \
    Local<Context> context = isolate->GetCurrentContext();                     \
    Local<Value> argv[1]{napi_create_##type##_(isolate, param)};               \
    NodeEventCallback &cb = *it->second;                                       \
    cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 1, argv); \
  }

#define MAKE_JS_CALL_2(ev, type1, param1, type2, param2)                       \
  auto it = m_callbacks.find(ev);                                              \
  if (it != m_callbacks.end()) {                                               \
    Isolate *isolate = Isolate::GetCurrent();                                  \
    HandleScope scope(isolate);                                                \
    Local<Context> context = isolate->GetCurrentContext();                     \
    Local<Value> argv[2]{napi_create_##type1##_(isolate, param1),              \
                         napi_create_##type2##_(isolate, param2)};             \
    NodeEventCallback &cb = *it->second;                                       \
    cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 2, argv); \
  }

#define MAKE_JS_CALL_3(ev, type1, param1, type2, param2, type3, param3)        \
  auto it = m_callbacks.find(ev);                                              \
  if (it != m_callbacks.end()) {                                               \
    Isolate *isolate = Isolate::GetCurrent();                                  \
    HandleScope scope(isolate);                                                \
    Local<Context> context = isolate->GetCurrentContext();                     \
    Local<Value> argv[3]{napi_create_##type1##_(isolate, param1),              \
                         napi_create_##type2##_(isolate, param2),              \
                         napi_create_##type3##_(isolate, param3)};             \
    NodeEventCallback &cb = *it->second;                                       \
    cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 3, argv); \
  }

#define MAKE_JS_CALL_4(ev, type1, param1, type2, param2, type3, param3, type4, \
                       param4)                                                 \
  auto it = m_callbacks.find(ev);                                              \
  if (it != m_callbacks.end()) {                                               \
    Isolate *isolate = Isolate::GetCurrent();                                  \
    HandleScope scope(isolate);                                                \
    Local<Context> context = isolate->GetCurrentContext();                     \
    Local<Value> argv[4]{                                                      \
        napi_create_##type1##_(isolate, param1),                               \
        napi_create_##type2##_(isolate, param2),                               \
        napi_create_##type3##_(isolate, param3),                               \
        napi_create_##type4##_(isolate, param4),                               \
    };                                                                         \
    NodeEventCallback &cb = *it->second;                                       \
    cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 4, argv); \
  }

#define MAKE_JS_CALL_5(ev, type1, param1, type2, param2, type3, param3, type4, \
                       param4, type5, param5)                                  \
  auto it = m_callbacks.find(ev);                                              \
  if (it != m_callbacks.end()) {                                               \
    Isolate *isolate = Isolate::GetCurrent();                                  \
    HandleScope scope(isolate);                                                \
    Local<Context> context = isolate->GetCurrentContext();                     \
    Local<Value> argv[5]{                                                      \
        napi_create_##type1##_(isolate, param1),                               \
        napi_create_##type2##_(isolate, param2),                               \
        napi_create_##type3##_(isolate, param3),                               \
        napi_create_##type4##_(isolate, param4),                               \
        napi_create_##type5##_(isolate, param5),                               \
    };                                                                         \
    NodeEventCallback &cb = *it->second;                                       \
    cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 5, argv); \
  }

#define MAKE_JS_CALL_6(ev, type1, param1, type2, param2, type3, param3, type4, \
                       param4, type5, param5, type6, param6)                   \
  auto it = m_callbacks.find(ev);                                              \
  if (it != m_callbacks.end()) {                                               \
    Isolate *isolate = Isolate::GetCurrent();                                  \
    HandleScope scope(isolate);                                                \
    Local<Context> context = isolate->GetCurrentContext();                     \
    Local<Value> argv[6]{                                                      \
        napi_create_##type1##_(isolate, param1),                               \
        napi_create_##type2##_(isolate, param2),                               \
        napi_create_##type3##_(isolate, param3),                               \
        napi_create_##type4##_(isolate, param4),                               \
        napi_create_##type5##_(isolate, param5),                               \
        napi_create_##type6##_(isolate, param6),                               \
    };                                                                         \
    NodeEventCallback &cb = *it->second;                                       \
    cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 6, argv); \
  }

#define CHECK_NAPI_OBJ(obj)                                                    \
  if (obj.IsEmpty())                                                           \
    break;

#define NODE_SET_OBJ_PROP_STRING(obj, name, val)                               \
  {                                                                            \
    Local<Value> propName =                                                    \
        String::NewFromUtf8(isolate, name, NewStringType::kInternalized)       \
            .ToLocalChecked();                                                 \
    CHECK_NAPI_OBJ(propName);                                                  \
    Local<Value> propVal =                                                     \
        String::NewFromUtf8(isolate, val, NewStringType::kInternalized)        \
            .ToLocalChecked();                                                 \
    CHECK_NAPI_OBJ(propVal);                                                   \
    v8::Maybe<bool> ret =                                                      \
        obj->Set(isolate->GetCurrentContext(), propName, propVal);             \
    if (!ret.IsNothing()) {                                                    \
      if (!ret.ToChecked()) {                                                  \
        break;                                                                 \
      }                                                                        \
    }                                                                          \
  }

#define NODE_SET_OBJ_PROP_UINT32(obj, name, val)                               \
  {                                                                            \
    Local<Value> propName =                                                    \
        String::NewFromUtf8(isolate, name, NewStringType::kInternalized)       \
            .ToLocalChecked();                                                 \
    CHECK_NAPI_OBJ(propName);                                                  \
    Local<Value> propVal = v8::Uint32::New(isolate, val);                      \
    CHECK_NAPI_OBJ(propVal);                                                   \
    v8::Maybe<bool> ret =                                                      \
        obj->Set(isolate->GetCurrentContext(), propName, propVal);             \
    if (!ret.IsNothing()) {                                                    \
      if (!ret.ToChecked()) {                                                  \
        break;                                                                 \
      }                                                                        \
    }                                                                          \
  }

#define NODE_SET_OBJ_PROP_UID(obj, name, val)                                  \
  {                                                                            \
    Local<Value> propName =                                                    \
        String::NewFromUtf8(isolate, name, NewStringType::kInternalized)       \
            .ToLocalChecked();                                                 \
    CHECK_NAPI_OBJ(propName);                                                  \
    Local<Value> propVal = NodeUid::getNodeValue(isolate, val);                \
    CHECK_NAPI_OBJ(propVal);                                                   \
    v8::Maybe<bool> ret =                                                      \
        obj->Set(isolate->GetCurrentContext(), propName, propVal);             \
    if (!ret.IsNothing()) {                                                    \
      if (!ret.ToChecked()) {                                                  \
        break;                                                                 \
      }                                                                        \
    }                                                                          \
  }

#define NODE_SET_OBJ_PROP_NUMBER(obj, name, val)                               \
  {                                                                            \
    Local<Value> propName =                                                    \
        String::NewFromUtf8(isolate, name, NewStringType::kInternalized)       \
            .ToLocalChecked();                                                 \
    CHECK_NAPI_OBJ(propName);                                                  \
    Local<Value> propVal = v8::Number::New(isolate, val);                      \
    CHECK_NAPI_OBJ(propVal);                                                   \
    v8::Maybe<bool> ret =                                                      \
        obj->Set(isolate->GetCurrentContext(), propName, propVal);             \
    if (!ret.IsNothing()) {                                                    \
      if (!ret.ToChecked()) {                                                  \
        break;                                                                 \
      }                                                                        \
    }                                                                          \
  }

// private
void NodeEventHandler::onWarning(int warn, const char *msg) {
  FUNC_TRACE;
  std::string message;
  if (msg)
    message.assign(msg);
  node_async_call::async_call([this, warn, message]() {
    MAKE_JS_CALL_2(RTC_EVENT_WARNING, int32, warn, string, message.c_str());
  });
}

void NodeEventHandler::onError(int err, const char *msg) {
  std::string errorDesc;
  if (msg)
    errorDesc.assign(msg);
  node_async_call::async_call([this, err, errorDesc] {
    MAKE_JS_CALL_2(RTC_EVENT_ERROR, int32, err, string, errorDesc.c_str());
  });
}

void NodeEventHandler::onApiCallExecuted(int err, const char *api,
                                         const char *result) {
  FUNC_TRACE;
  std::string apiName(api);
  node_async_call::async_call([this, apiName, err] {
    MAKE_JS_CALL_2(RTC_EVENT_APICALL_EXECUTED, string, apiName.c_str(), int32,
                   err);
  });
}

void NodeEventHandler::onLastmileProbeResult(
    const LastmileProbeResult &result) {
  FUNC_TRACE;
  do {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    Local<Context> context = isolate->GetCurrentContext();
    Local<Object> obj = Object::New(isolate);
    CHECK_NAPI_OBJ(obj);
    NODE_SET_OBJ_PROP_UINT32(obj, "state", result.state);
    NODE_SET_OBJ_PROP_UINT32(obj, "rtt", result.rtt);

    Local<Object> uplink = Object::New(isolate);
    CHECK_NAPI_OBJ(uplink);
    NODE_SET_OBJ_PROP_UINT32(uplink, "packetLossRate",
                             result.uplinkReport.packetLossRate);
    NODE_SET_OBJ_PROP_UINT32(uplink, "jitter", result.uplinkReport.jitter);
    NODE_SET_OBJ_PROP_UINT32(uplink, "availableBandwidth",
                             result.uplinkReport.availableBandwidth);

    Local<Object> downlink = Object::New(isolate);
    CHECK_NAPI_OBJ(downlink);
    NODE_SET_OBJ_PROP_UINT32(downlink, "packetLossRate",
                             result.downlinkReport.packetLossRate);
    NODE_SET_OBJ_PROP_UINT32(downlink, "jitter", result.downlinkReport.jitter);
    NODE_SET_OBJ_PROP_UINT32(downlink, "availableBandwidth",
                             result.downlinkReport.availableBandwidth);

    obj->Set(isolate->GetCurrentContext(),
             napi_create_string_(isolate, "uplinkReport"), uplink);
    obj->Set(isolate->GetCurrentContext(),
             napi_create_string_(isolate, "downlinkReport"), downlink);

    Local<Value> arg[1] = {obj};
    auto it = m_callbacks.find(RTC_EVENT_LASTMILE_PROBE_RESULT);
    if (it != m_callbacks.end()) {
      it->second->callback.Get(isolate)->Call(
          context, it->second->js_this.Get(isolate), 1, arg);
    }
  } while (false);
}

void NodeEventHandler::onAudioDeviceStateChanged(const char *deviceId,
                                                 int deviceType,
                                                 int deviceStats) {
  FUNC_TRACE;
  std::string id(deviceId);
  node_async_call::async_call([this, id, deviceType, deviceStats] {
    MAKE_JS_CALL_3(RTC_EVENT_AUDIO_DEVICE_STATE_CHANGED, string, id.c_str(),
                   int32, deviceType, int32, deviceStats);
  });
}

void NodeEventHandler::onAudioMixingFinished() {
  FUNC_TRACE;
  node_async_call::async_call(
      [this] { MAKE_JS_CALL_0(RTC_EVENT_AUDIO_MIXING_FINISHED); });
}

void NodeEventHandler::onAudioEffectFinished(int soundId) {
  FUNC_TRACE;
  node_async_call::async_call([this, soundId] {
    MAKE_JS_CALL_1(RTC_EVENT_AUDIO_EFFECT_FINISHED, int32, soundId);
  });
}

void NodeEventHandler::onVideoDeviceStateChanged(const char *deviceId,
                                                 int deviceType,
                                                 int deviceState) {
  FUNC_TRACE;
  std::string id(deviceId);
  node_async_call::async_call([this, id, deviceType, deviceState] {
    MAKE_JS_CALL_3(RTC_EVENT_VIDEO_DEVICE_STATE_CHANGED, string, id.c_str(),
                   int32, deviceType, int32, deviceState);
  });
}

void NodeEventHandler::onMediaDeviceChanged(int deviceType) {
  FUNC_TRACE;
  node_async_call::async_call([this, deviceType] {
    MAKE_JS_CALL_1(RTC_EVENT_MEDIA_DEVICE_CHANGED, int32, deviceType);
  });
}

void NodeEventHandler::onUplinkNetworkInfoUpdated(
    const UplinkNetworkInfo &info) {
  FUNC_TRACE;
  do {
    Isolate *isolate = Isolate::GetCurrent();
    if (nullptr == isolate)
      return;
    HandleScope scope(isolate);
    Local<Context> context = isolate->GetCurrentContext();
    Local<Object> obj = Object::New(isolate);
    CHECK_NAPI_OBJ(obj);
    NODE_SET_OBJ_PROP_UINT32(obj, "video_encoder_target_bitrate_bps",
                             info.video_encoder_target_bitrate_bps);

    Local<Value> arg[1] = {obj};
    auto it = m_callbacks.find(RTC_EVENT_UPLINKNETWORKINFOUPDATED);
    if (it != m_callbacks.end()) {
      it->second->callback.Get(isolate)->Call(
          context, it->second->js_this.Get(isolate), 1, arg);
    }
  } while (false);
}

void NodeEventHandler::onDownlinkNetworkInfoUpdated(
    const DownlinkNetworkInfo &info) {
  FUNC_TRACE;
  do {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    Local<Context> context = isolate->GetCurrentContext();
    Local<Object> obj = Object::New(isolate);
    CHECK_NAPI_OBJ(obj);
    NODE_SET_OBJ_PROP_UINT32(obj, "bandwidth_estimation_bps",
                             info.bandwidth_estimation_bps);
    NODE_SET_OBJ_PROP_UINT32(obj, "total_downscale_level_count",
                             info.total_downscale_level_count);

    NODE_SET_OBJ_PROP_UINT32(obj, "total_received_video_count",
                             info.total_received_video_count);

    Local<Value> arg[1] = {obj};
    auto it = m_callbacks.find(RTC_EVENT_DOWNLINKNETWORKINFOUPDATED);
    if (it != m_callbacks.end()) {
      it->second->callback.Get(isolate)->Call(
          context, it->second->js_this.Get(isolate), 1, arg);
    }
  } while (false);
}

void NodeEventHandler::onLastmileQuality(int quality) {
  FUNC_TRACE;
  node_async_call::async_call([this, quality] {
    MAKE_JS_CALL_1(RTC_EVENT_LASTMILE_QUALITY, int32, quality);
  });
}

void NodeEventHandler::onCameraReady() {
  FUNC_TRACE;
  node_async_call::async_call(
      [this] { MAKE_JS_CALL_0(RTC_EVENT_CAMERA_READY); });
}

void NodeEventHandler::onCameraFocusAreaChanged(int x, int y, int width,
                                                int height) {
  FUNC_TRACE;
  node_async_call::async_call([this, x, y, width, height] {
    MAKE_JS_CALL_4(RTC_EVENT_CAMERA_FOCUS_AREA_CHANGED, int32, x, int32, y,
                   int32, width, int32, height);
  });
}

void NodeEventHandler::onCameraExposureAreaChanged(int x, int y, int width,
                                                   int height) {
  FUNC_TRACE;
  node_async_call::async_call([this, x, y, width, height] {
    MAKE_JS_CALL_4(RTC_EVENT_CAMERA_EXPOSURE_AREA_CHANGED, int32, x, int32, y,
                   int32, width, int32, height);
  });
}

void NodeEventHandler::onVideoStopped() {
  FUNC_TRACE;
  node_async_call::async_call(
      [this] { MAKE_JS_CALL_0(RTC_EVENT_VIDEO_STOPPED); });
}

void NodeEventHandler::onAudioMixingStateChanged(
    AUDIO_MIXING_STATE_TYPE state, AUDIO_MIXING_ERROR_TYPE errorCode) {
  FUNC_TRACE;
  node_async_call::async_call([this, state, errorCode] {
    MAKE_JS_CALL_2(RTC_EVENT_AUDIO_MIXING_STATE_CHANGED, uint32, state, uint32,
                   errorCode);
  });
}

void NodeEventHandler::onAudioDeviceVolumeChanged(MEDIA_DEVICE_TYPE deviceType,
                                                  int volume, bool muted) {
  FUNC_TRACE;
  node_async_call::async_call([this, deviceType, volume, muted] {
    MAKE_JS_CALL_3(RTC_EVENT_AUDIO_DEVICE_VOLUME_CHANGED, uint32, deviceType,
                   int32, volume, bool, muted);
  });
}

void NodeEventHandler::onRtmpStreamingStateChanged(
    const char *url, RTMP_STREAM_PUBLISH_STATE state,
    RTMP_STREAM_PUBLISH_ERROR errCode) {
  FUNC_TRACE;
  std::string sUrl(url);
  node_async_call::async_call([this, sUrl, state, errCode] {
    MAKE_JS_CALL_3(RTC_EVENT_RTMP_STREAMING_STATE_CHANGED, string, sUrl.c_str(),
                   uint32, state, uint32, errCode)
  });
}

void NodeEventHandler::onStreamPublished(const char *url, int error) {
  FUNC_TRACE;
  std::string sUrl(url);
  node_async_call::async_call([this, sUrl, error] {
    MAKE_JS_CALL_2(RTC_EVENT_STREAM_PUBLISHED, string, sUrl.c_str(), int32,
                   error);
  });
}

void NodeEventHandler::onStreamUnpublished(const char *url) {
  FUNC_TRACE;
  std::string sUrl(url);
  node_async_call::async_call([this, sUrl] {
    MAKE_JS_CALL_1(RTC_EVENT_STREAM_UNPUBLISHED, string, sUrl.c_str());
  });
}

void NodeEventHandler::onTranscodingUpdated() {
  FUNC_TRACE;
  MAKE_JS_CALL_0(RTC_EVENT_TRANSCODING_UPDATED);
}

void NodeEventHandler::onAudioRoutingChanged(int routing) {
  FUNC_TRACE;
  node_async_call::async_call([this, routing] {
    MAKE_JS_CALL_1(RTC_EVENT_AUDIO_ROUTING_CHANGED, int32, (int)routing);
  });
}

void NodeEventHandler::onChannelMediaRelayStateChanged(int state, int code) {
  FUNC_TRACE;
  node_async_call::async_call([this, state, code] {
    MAKE_JS_CALL_2(RTC_EVENT_CHANNEL_MEDIA_RELAY_STATE_CHANGED, int32, state,
                   int32, code);
  });
}

void NodeEventHandler::onChannelMediaRelayEvent(int code) {
  FUNC_TRACE;
  node_async_call::async_call([this, code] {
    MAKE_JS_CALL_1(RTC_EVENT_CHANNEL_MEDIA_RELAY_EVENT, int32, code);
  });
}

void NodeEventHandler::onLocalPublishFallbackToAudioOnly(
    bool isFallbackOrRecover) {
  FUNC_TRACE;
  node_async_call::async_call([this, isFallbackOrRecover] {
    MAKE_JS_CALL_1(RTC_EVENT_LOCAL_PUBLISH_FALLBACK_TO_AUDIO_ONLY, bool,
                   isFallbackOrRecover);
  });
}

void NodeEventHandler::onRemoteSubscribeFallbackToAudioOnly(
    uid_t uid, bool isFallbackOrRecover) {
  FUNC_TRACE;
  node_async_call::async_call([this, uid, isFallbackOrRecover] {
    MAKE_JS_CALL_2(RTC_EVENT_REMOTE_SUBSCRIBE_FALLBACK_TO_AUDIO_ONLY, uid, uid,
                   bool, isFallbackOrRecover);
  });
}

void NodeEventHandler::onPermissionError(PERMISSION_TYPE permissionType) {
  FUNC_TRACE;
  node_async_call::async_call([this, permissionType] {
    MAKE_JS_CALL_1(RTC_EVENT_PERMISSION_ERROR, uint32, permissionType);
  });
}

void NodeEventHandler::onLocalUserRegistered(uid_t uid,
                                             const char *userAccount) {
  FUNC_TRACE;
  std::string mUserAccount = std::string(userAccount);
  node_async_call::async_call([this, uid, mUserAccount] {
    MAKE_JS_CALL_2(RTC_EVENT_LOCAL_USER_REGISTERED, uid, uid, string,
                   mUserAccount.c_str());
  });
}

void NodeEventHandler::onUserInfoUpdated(uid_t uid, const UserInfo &info) {
  FUNC_TRACE;
  node_async_call::async_call(
      [this, uid, info] { this->onUserInfoUpdated_node(uid, info); });
}

void NodeEventHandler::onUserInfoUpdated_node(uid_t uid, const UserInfo &info) {
  FUNC_TRACE;
  do {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    Local<Context> context = isolate->GetCurrentContext();
    Local<Object> obj = Object::New(isolate);
    CHECK_NAPI_OBJ(obj);

    NODE_SET_OBJ_PROP_UID(obj, "uid", info.uid);
    NODE_SET_OBJ_PROP_STRING(obj, "userAccount", info.userAccount);

    Local<Value> arg[2] = {napi_create_uid_(isolate, uid), obj};
    auto it = m_callbacks.find(RTC_EVENT_USER_INFO_UPDATED);
    if (it != m_callbacks.end()) {
      it->second->callback.Get(isolate)->Call(
          context, it->second->js_this.Get(isolate), 2, arg);
    }
  } while (false);
}

void NodeEventHandler::onAudioSubscribeStateChanged(
    const char *channel, uid_t uid, STREAM_SUBSCRIBE_STATE oldState,
    STREAM_SUBSCRIBE_STATE newState, int elapseSinceLastState) {
  FUNC_TRACE;
  std::string mChannel(channel);
  node_async_call::async_call(
      [this, mChannel, uid, oldState, newState, elapseSinceLastState] {
        MAKE_JS_CALL_5(RTC_EVENT_AUDIO_SUBSCRIBE_STATE_CHANGED, string,
                       mChannel.c_str(), uid, uid, uint32, oldState, uint32,
                       newState, int32, elapseSinceLastState);
      });
}

void NodeEventHandler::onVideoSubscribeStateChanged(
    const char *channel, uid_t uid, STREAM_SUBSCRIBE_STATE oldState,
    STREAM_SUBSCRIBE_STATE newState, int elapseSinceLastState) {
  FUNC_TRACE;
  std::string mChannel(channel);
  node_async_call::async_call(
      [this, mChannel, uid, oldState, newState, elapseSinceLastState] {
        MAKE_JS_CALL_5(RTC_EVENT_VIDEO_SUBSCRIBE_STATE_CHANGED, string,
                       mChannel.c_str(), uid, uid, uint32, oldState, uint32,
                       newState, int32, elapseSinceLastState);
      });
}

void NodeEventHandler::onAudioPublishStateChanged(const char *channel,
                                                  STREAM_PUBLISH_STATE oldState,
                                                  STREAM_PUBLISH_STATE newState,
                                                  int elapseSinceLastState) {
  FUNC_TRACE;
  std::string mChannel(channel);
  node_async_call::async_call(
      [this, mChannel, oldState, newState, elapseSinceLastState] {
        MAKE_JS_CALL_4(RTC_EVENT_AUDIO_PUBLISH_STATE_CHANGED, string,
                       mChannel.c_str(), uint32, oldState, uint32, newState,
                       int32, elapseSinceLastState);
      });
}

void NodeEventHandler::onVideoPublishStateChanged(const char *channel,
                                                  STREAM_PUBLISH_STATE oldState,
                                                  STREAM_PUBLISH_STATE newState,
                                                  int elapseSinceLastState) {
  FUNC_TRACE;
  std::string mChannel(channel);
  node_async_call::async_call(
      [this, mChannel, oldState, newState, elapseSinceLastState] {
        MAKE_JS_CALL_4(RTC_EVENT_VIDEO_PUBLISH_STATE_CHANGED, string,
                       mChannel.c_str(), uint32, oldState, uint32, newState,
                       int32, elapseSinceLastState);
      });
}

void NodeEventHandler::onExtensionEvent(const char *provider_name,
                                        const char *ext_name, const char *key,
                                        const char *json_value) {
  FUNC_TRACE;
  std::string sProviderName(provider_name);
  std::string sExtName(ext_name);
  std::string sKey(key);
  std::string sJsonValue(json_value);
  node_async_call::async_call(
      [this, sProviderName, sExtName, sKey, sJsonValue] {
        MAKE_JS_CALL_4(RTC_EVENT_EXTENSION_EVENT, string, sProviderName.c_str(),
                       string, sExtName.c_str(), string, sKey.c_str(), string,
                       sJsonValue.c_str());
      });
}

void NodeEventHandler::onExtensionStarted(const char *provider_name,
                                          const char *ext_name) {
  FUNC_TRACE;
  std::string sProviderName(provider_name);
  std::string sExtName(ext_name);
  node_async_call::async_call([this, sProviderName, sExtName] {
    MAKE_JS_CALL_2(RTC_EVENT_EXTENSION_STARTED, string, sProviderName.c_str(),
                   string, sExtName.c_str());
  });
}

void NodeEventHandler::onExtensionStopped(const char *provider_name,
                                          const char *ext_name) {
  FUNC_TRACE;
  std::string sProviderName(provider_name);
  std::string sExtName(ext_name);
  node_async_call::async_call([this, sProviderName, sExtName] {
    MAKE_JS_CALL_2(RTC_EVENT_EXTENSION_STOPPED, string, sProviderName.c_str(),
                   string, sExtName.c_str());
  });
}

void NodeEventHandler::onExtensionErrored(const char *provider_name,
                                          const char *ext_name, int error,
                                          const char *msg) {
  FUNC_TRACE;
  std::string sProviderName(provider_name);
  std::string sExtName(ext_name);
  std::string sMsg(msg);
  node_async_call::async_call([this, sProviderName, sExtName, sMsg] {
    MAKE_JS_CALL_3(RTC_EVENT_EXTENSION_ERRORED, string, sProviderName.c_str(),
                   string, sExtName.c_str(), string, sMsg.c_str());
  });
}

//-------------------------------- ex --------------------------------
void NodeEventHandler::onJoinChannelSuccess(const RtcConnection &connection,
                                            int elapsed) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, elapsed] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_JOIN_CHANNEL, 2, _connection,
                               napi_create_int32_(isolate, elapsed));
  });
}

void NodeEventHandler::onRejoinChannelSuccess(const RtcConnection &connection,
                                              int elapsed) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, elapsed] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_REJOIN_CHANNEL, 2, _connection,
                               napi_create_int32_(isolate, elapsed));
  });
}

void NodeEventHandler::onAudioQuality(const RtcConnection &connection,
                                      uid_t remoteUid, int quality,
                                      unsigned short delay,
                                      unsigned short lost) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call(
      [this, _connection, remoteUid, quality, delay, lost] {
        Isolate *isolate = Isolate::GetCurrent();
        HandleScope scope(isolate);
        this->sendJSWithConnection(RTC_EVENT_AUDIO_QUALITY, 5, _connection,
                                   napi_create_uint32_(isolate, remoteUid),
                                   napi_create_int32_(isolate, quality),
                                   napi_create_uint32_(isolate, delay),
                                   napi_create_uint32_(isolate, lost));
      });
}

void NodeEventHandler::onAudioVolumeIndication_node(
    const CustomRtcConnection &connection, AudioVolumeInfo *speakers,
    unsigned int speakerNumber, int totalVolume) {
  FUNC_TRACE;
  auto it = m_callbacks.find(RTC_EVENT_AUDIO_VOLUME_INDICATION);
  if (it != m_callbacks.end()) {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    Local<Context> context = isolate->GetCurrentContext();
    Local<v8::Array> arrSpeakers = v8::Array::New(isolate, speakerNumber);
    for (unsigned int i = 0; i < speakerNumber; i++) {
      Local<Object> obj = Object::New(isolate);
      obj->Set(context, napi_create_string_(isolate, "uid"),
               napi_create_uid_(isolate, speakers[i].uid));
      obj->Set(context, napi_create_string_(isolate, "volume"),
               napi_create_uint32_(isolate, speakers[i].volume));
      arrSpeakers->Set(context, i, obj);
    }

    Local<Object> connectionObj = Object::New(isolate);
    connectionObj->Set(context, napi_create_string_(isolate, "localUid"),
                       napi_create_uid_(isolate, connection.localUid));
    connectionObj->Set(
        context, napi_create_string_(isolate, "channelId"),
        napi_create_string_(isolate, connection.channelId.c_str()));

    Local<Value> argv[4]{connectionObj, arrSpeakers,
                         napi_create_uint32_(isolate, speakerNumber),
                         napi_create_uint32_(isolate, totalVolume)};
    NodeEventCallback &cb = *it->second;
    cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 4, argv);
  }
}

void NodeEventHandler::onAudioVolumeIndication(const RtcConnection &connection,
                                               const AudioVolumeInfo *speaker,
                                               unsigned int speakerNumber,
                                               int totalVolume) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  if (speaker) {
    AudioVolumeInfo *localSpeakers = new AudioVolumeInfo[speakerNumber];
    for (unsigned int i = 0; i < speakerNumber; i++) {
      AudioVolumeInfo tmp = speaker[i];
      localSpeakers[i].uid = tmp.uid;
      localSpeakers[i].volume = tmp.volume;
    }
    node_async_call::async_call(
        [this, _connection, localSpeakers, speakerNumber, totalVolume] {
          this->onAudioVolumeIndication_node(_connection, localSpeakers,
                                             speakerNumber, totalVolume);
          delete[] localSpeakers;
        });
  } else {
    node_async_call::async_call(
        [this, _connection, speakerNumber, totalVolume] {
          this->onAudioVolumeIndication_node(_connection, NULL, speakerNumber,
                                             totalVolume);
        });
  }
}

void NodeEventHandler::onLeaveChannel(const RtcConnection &connection,
                                      const RtcStats &stats) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, stats] {
    this->onRtcStats_node_with_type(RTC_EVENT_LEAVE_CHANNEL, _connection,
                                    stats);
  });
}

void NodeEventHandler::onRtcStats(const RtcConnection &connection,
                                  const RtcStats &stats) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, stats] {
    this->onRtcStats_node_with_type(RTC_EVENT_RTC_STATS, _connection, stats);
  });
}

void NodeEventHandler::onNetworkQuality(const RtcConnection &connection,
                                        uid_t remoteUid, int txQuality,
                                        int rxQuality) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call(
      [this, _connection, remoteUid, txQuality, rxQuality] {
        Isolate *isolate = Isolate::GetCurrent();
        HandleScope scope(isolate);
        this->sendJSWithConnection(RTC_EVENT_NETWORK_QUALITY, 4, _connection,
                                   napi_create_uid_(isolate, remoteUid),
                                   napi_create_int32_(isolate, txQuality),
                                   napi_create_int32_(isolate, rxQuality));
      });
}

void NodeEventHandler::onIntraRequestReceived(const RtcConnection &connection) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_INTRAREQUESTRECEIVED, 1, _connection);
  });
}

void NodeEventHandler::onFirstLocalVideoFrame(const RtcConnection &connection,
                                              int width, int height,
                                              int elapsed) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, width, height, elapsed] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_FIRST_LOCAL_VIDEO_FRAME, 4,
                               _connection, napi_create_int32_(isolate, width),
                               napi_create_int32_(isolate, height),
                               napi_create_int32_(isolate, elapsed));
  });
}

void NodeEventHandler::onFirstLocalVideoFramePublished(
    const RtcConnection &connection, int elapsed) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, elapsed] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_FIRST_LOCAL_VIDEO_FRAME_PUBLISH, 2,
                               _connection,
                               napi_create_int32_(isolate, elapsed));
  });
}

void NodeEventHandler::onVideoSourceFrameSizeChanged(
    const RtcConnection &connection, VIDEO_SOURCE_TYPE sourceType, int width,
    int height) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, sourceType, width, height] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_VIDEO_SOURCE_FRAME_SIZE_CHANGED, 4,
                               _connection,
                               napi_create_uint32_(isolate, sourceType),
                               napi_create_int32_(isolate, width),
                               napi_create_int32_(isolate, height));
  });
}

void NodeEventHandler::onFirstRemoteVideoDecoded(
    const RtcConnection &connection, uid_t remoteUid, int width, int height,
    int elapsed) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, remoteUid, width, height,
                               elapsed] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(
        RTC_EVENT_FIRST_REMOTE_VIDEO_DECODED, 5, _connection,
        napi_create_uid_(isolate, remoteUid),
        napi_create_int32_(isolate, width), napi_create_int32_(isolate, height),
        napi_create_int32_(isolate, elapsed));
  });
}

void NodeEventHandler::onVideoSizeChanged(const RtcConnection &connection,
                                          uid_t uid, int width, int height,
                                          int rotation) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call(
      [this, _connection, uid, width, height, rotation] {
        Isolate *isolate = Isolate::GetCurrent();
        HandleScope scope(isolate);
        this->sendJSWithConnection(RTC_EVENT_VIDEO_SIZE_CHANGED, 5, _connection,
                                   napi_create_uid_(isolate, uid),
                                   napi_create_int32_(isolate, width),
                                   napi_create_int32_(isolate, height),
                                   napi_create_int32_(isolate, rotation));
      });
}

void NodeEventHandler::onLocalVideoStateChanged(
    const RtcConnection &connection, LOCAL_VIDEO_STREAM_STATE state,
    LOCAL_VIDEO_STREAM_ERROR errorCode) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, state, errorCode] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_LOCAL_VIDEO_STATE_CHANGED, 3,
                               _connection, napi_create_int32_(isolate, state),
                               napi_create_int32_(isolate, errorCode));
  });
}

void NodeEventHandler::onRemoteVideoStateChanged(
    const RtcConnection &connection, uid_t remoteUid, REMOTE_VIDEO_STATE state,
    REMOTE_VIDEO_STATE_REASON reason, int elapsed) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, remoteUid, state, reason] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_REMOTE_VIDEO_STATE_CHANGED, 4,
                               _connection,
                               napi_create_uid_(isolate, remoteUid),
                               napi_create_int32_(isolate, state),
                               napi_create_int32_(isolate, reason));
  });
}

void NodeEventHandler::onFirstRemoteVideoFrame(const RtcConnection &connection,
                                               uid_t remoteUid, int width,
                                               int height, int elapsed) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, remoteUid, width, height,
                               elapsed] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(
        RTC_EVENT_FIRST_REMOTE_VIDEO_FRAME, 5, _connection,
        napi_create_uid_(isolate, remoteUid),
        napi_create_int32_(isolate, width), napi_create_int32_(isolate, height),
        napi_create_int32_(isolate, elapsed));
  });
}

void NodeEventHandler::onUserJoined(const RtcConnection &connection,
                                    uid_t remoteUid, int elapsed) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, remoteUid, elapsed] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_USER_JOINED, 3, _connection,
                               napi_create_uid_(isolate, remoteUid),
                               napi_create_int32_(isolate, elapsed));
  });
}

void NodeEventHandler::onUserOffline(const RtcConnection &connection,
                                     uid_t remoteUid,
                                     USER_OFFLINE_REASON_TYPE reason) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, remoteUid, reason] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_USER_OFFLINE, 3, _connection,
                               napi_create_uid_(isolate, remoteUid),
                               napi_create_int32_(isolate, reason));
  });
}

void NodeEventHandler::onUserMuteVideo(const RtcConnection &connection,
                                       uid_t remoteUid, bool muted) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, remoteUid, muted] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_USER_MUTE_VIDEO, 3, _connection,
                               napi_create_uid_(isolate, remoteUid),
                               napi_create_bool_(isolate, muted));
  });
}

void NodeEventHandler::onUserEnableVideo(const RtcConnection &connection,
                                         uid_t remoteUid, bool enabled) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, remoteUid, enabled] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_USER_ENABLE_VIDEO, 3, _connection,
                               napi_create_uid_(isolate, remoteUid),
                               napi_create_bool_(isolate, enabled));
  });
}

void NodeEventHandler::onUserEnableLocalVideo(const RtcConnection &connection,
                                              uid_t remoteUid, bool enabled) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, remoteUid, enabled] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_USER_ENABLE_LOCAL_VIDEO, 3,
                               _connection,
                               napi_create_uid_(isolate, remoteUid),
                               napi_create_bool_(isolate, enabled));
  });
}

void NodeEventHandler::onLocalAudioStats(const RtcConnection &connection,
                                         const LocalAudioStats &stats) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, stats] {
    this->onLocalAudioStats_node(_connection, stats);
  });
}

void NodeEventHandler::onLocalAudioStats_node(
    const CustomRtcConnection &connection, const LocalAudioStats &stats) {
  FUNC_TRACE;
  do {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    Local<Context> context = isolate->GetCurrentContext();
    Local<Object> obj = Object::New(isolate);
    CHECK_NAPI_OBJ(obj);

    NODE_SET_OBJ_PROP_UINT32(obj, "numChannels", stats.numChannels);
    NODE_SET_OBJ_PROP_UINT32(obj, "sentSampleRate", stats.sentSampleRate);
    NODE_SET_OBJ_PROP_UINT32(obj, "sentBitrate", stats.sentBitrate);

    Local<Object> connectionObj = Object::New(isolate);
    connectionObj->Set(context, napi_create_string_(isolate, "localUid"),
                       napi_create_uid_(isolate, connection.localUid));
    connectionObj->Set(
        context, napi_create_string_(isolate, "channelId"),
        napi_create_string_(isolate, connection.channelId.c_str()));

    Local<Value> arg[2] = {connectionObj, obj};
    auto it = m_callbacks.find(RTC_EVENT_LOCAL_AUDIO_STATS);
    if (it != m_callbacks.end()) {
      it->second->callback.Get(isolate)->Call(
          context, it->second->js_this.Get(isolate), 2, arg);
    }
  } while (false);
}

void NodeEventHandler::onRemoteAudioStats(const RtcConnection &connection,
                                          const RemoteAudioStats &stats) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, stats] {
    this->onRemoteAudioStats_node(_connection, stats);
  });
}

void NodeEventHandler::onRemoteAudioStats_node(
    const CustomRtcConnection &connection, const RemoteAudioStats &stats) {
  FUNC_TRACE;
  do {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    Local<Context> context = isolate->GetCurrentContext();
    Local<Object> obj = Object::New(isolate);
    CHECK_NAPI_OBJ(obj);
    NODE_SET_OBJ_PROP_UID(obj, "uid", stats.uid);
    NODE_SET_OBJ_PROP_UINT32(obj, "quality", stats.quality);
    NODE_SET_OBJ_PROP_UINT32(obj, "networkTransportDelay",
                             stats.networkTransportDelay);
    NODE_SET_OBJ_PROP_UINT32(obj, "jitterBufferDelay", stats.jitterBufferDelay);
    NODE_SET_OBJ_PROP_UINT32(obj, "audioLossRate", stats.audioLossRate);
    NODE_SET_OBJ_PROP_UINT32(obj, "numChannels", stats.numChannels);
    NODE_SET_OBJ_PROP_UINT32(obj, "receivedSampleRate",
                             stats.receivedSampleRate);
    NODE_SET_OBJ_PROP_UINT32(obj, "receivedBitrate", stats.receivedBitrate);
    NODE_SET_OBJ_PROP_UINT32(obj, "totalFrozenTime", stats.totalFrozenTime);
    NODE_SET_OBJ_PROP_UINT32(obj, "frozenRate", stats.frozenRate);

    Local<Object> connectionObj = Object::New(isolate);
    connectionObj->Set(context, napi_create_string_(isolate, "localUid"),
                       napi_create_uid_(isolate, connection.localUid));
    connectionObj->Set(
        context, napi_create_string_(isolate, "channelId"),
        napi_create_string_(isolate, connection.channelId.c_str()));

    Local<Value> arg[2] = {connectionObj, obj};
    auto it = m_callbacks.find(RTC_EVENT_REMOTE_AUDIO_STATS);
    if (it != m_callbacks.end()) {
      it->second->callback.Get(isolate)->Call(
          context, it->second->js_this.Get(isolate), 2, arg);
    }
  } while (false);
}

void NodeEventHandler::onLocalVideoStats(const RtcConnection &connection,
                                         const LocalVideoStats &stats) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, stats] {
    this->onLocalVideoStats_node(_connection, stats);
  });
}

void NodeEventHandler::onLocalVideoStats_node(
    const CustomRtcConnection &connection, const LocalVideoStats &stats) {
  FUNC_TRACE;
  do {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    Local<Context> context = isolate->GetCurrentContext();
    Local<Object> obj = Object::New(isolate);
    CHECK_NAPI_OBJ(obj);

    NODE_SET_OBJ_PROP_UINT32(obj, "sentBitrate", stats.sentBitrate);
    NODE_SET_OBJ_PROP_UINT32(obj, "sentFrameRate", stats.sentFrameRate);
    NODE_SET_OBJ_PROP_UINT32(obj, "targetBitrate", stats.targetBitrate);
    NODE_SET_OBJ_PROP_UINT32(obj, "targetFrameRate", stats.targetFrameRate);
    NODE_SET_OBJ_PROP_UINT32(obj, "encoderOutputFrameRate",
                             stats.encoderOutputFrameRate);
    NODE_SET_OBJ_PROP_UINT32(obj, "rendererOutputFrameRate",
                             stats.rendererOutputFrameRate);
    NODE_SET_OBJ_PROP_UINT32(obj, "encodedBitrate", stats.encodedBitrate);
    NODE_SET_OBJ_PROP_UINT32(obj, "encodedFrameWidth", stats.encodedFrameWidth);
    NODE_SET_OBJ_PROP_UINT32(obj, "encodedFrameHeight",
                             stats.encodedFrameHeight);
    NODE_SET_OBJ_PROP_UINT32(obj, "encodedFrameCount", stats.encodedFrameCount);
    NODE_SET_OBJ_PROP_UINT32(obj, "codecType", stats.codecType);

    Local<Object> connectionObj = Object::New(isolate);
    connectionObj->Set(context, napi_create_string_(isolate, "localUid"),
                       napi_create_uid_(isolate, connection.localUid));
    connectionObj->Set(
        context, napi_create_string_(isolate, "channelId"),
        napi_create_string_(isolate, connection.channelId.c_str()));

    Local<Value> arg[2] = {connectionObj, obj};
    auto it = m_callbacks.find(RTC_EVENT_LOCAL_VIDEO_STATS);
    if (it != m_callbacks.end()) {
      it->second->callback.Get(isolate)->Call(
          context, it->second->js_this.Get(isolate), 2, arg);
    }
  } while (false);
}

void NodeEventHandler::onRemoteVideoStats(const RtcConnection &connection,
                                          const RemoteVideoStats &stats) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  printf("frame rate : %d, bitrate : %d, width %d, height %d\n",
         stats.rendererOutputFrameRate, stats.receivedBitrate, stats.width,
         stats.height);
  node_async_call::async_call([this, _connection, stats] {
    this->onRemoteVideoStats_node(_connection, stats);
  });
}

void NodeEventHandler::onRemoteVideoStats_node(
    const CustomRtcConnection &connection, const RemoteVideoStats &stats) {
  FUNC_TRACE;
  do {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    Local<Context> context = isolate->GetCurrentContext();
    Local<Object> obj = Object::New(isolate);
    CHECK_NAPI_OBJ(obj);
    NODE_SET_OBJ_PROP_UINT32(obj, "uid", stats.uid);
    NODE_SET_OBJ_PROP_UINT32(obj, "delay", stats.delay);
    NODE_SET_OBJ_PROP_UINT32(obj, "width", stats.width);
    NODE_SET_OBJ_PROP_UINT32(obj, "height", stats.height);
    NODE_SET_OBJ_PROP_UINT32(obj, "receivedBitrate", stats.receivedBitrate);
    NODE_SET_OBJ_PROP_UINT32(obj, "decoderOutputFrameRate",
                             stats.decoderOutputFrameRate);
    NODE_SET_OBJ_PROP_UINT32(obj, "rendererOutputFrameRate",
                             stats.rendererOutputFrameRate);
    NODE_SET_OBJ_PROP_UINT32(obj, "rxStreamType", stats.rxStreamType);
    NODE_SET_OBJ_PROP_UINT32(obj, "totalFrozenTime", stats.totalFrozenTime);
    NODE_SET_OBJ_PROP_UINT32(obj, "frozenRate", stats.frozenRate);
    NODE_SET_OBJ_PROP_UINT32(obj, "packetLossRate", stats.packetLossRate);

    Local<Object> connectionObj = Object::New(isolate);
    connectionObj->Set(context, napi_create_string_(isolate, "localUid"),
                       napi_create_uid_(isolate, connection.localUid));
    connectionObj->Set(
        context, napi_create_string_(isolate, "channelId"),
        napi_create_string_(isolate, connection.channelId.c_str()));

    Local<Value> arg[2] = {connectionObj, obj};
    auto it = m_callbacks.find(RTC_EVENT_REMOTE_VIDEO_STATS);
    if (it != m_callbacks.end()) {
      it->second->callback.Get(isolate)->Call(
          context, it->second->js_this.Get(isolate), 2, arg);
    }
  } while (false);
}

void NodeEventHandler::onConnectionLost(const RtcConnection &connection) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_CONNECTION_LOST, 1, _connection);
  });
}

void NodeEventHandler::onConnectionInterrupted(
    const RtcConnection &connection) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_CONNECTION_INTERRUPTED, 1,
                               _connection);
  });
}

void NodeEventHandler::onConnectionBanned(const RtcConnection &connection) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_CONNECTION_BANNED, 1, _connection);
  });
}

void NodeEventHandler::onStreamMessage(const RtcConnection &connection,
                                       uid_t remoteUid, int streamId,
                                       const char *data, size_t length,
                                       uint64_t sentTs) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call(
      [this, _connection, remoteUid, streamId, data, length, sentTs] {
        Isolate *isolate = Isolate::GetCurrent();
        HandleScope scope(isolate);
        this->sendJSWithConnection(RTC_EVENT_STREAM_MESSAGE, 6, _connection,
                                   napi_create_uid_(isolate, remoteUid),
                                   napi_create_int32_(isolate, streamId),
                                   napi_create_string_(isolate, data),
                                   napi_create_uint32_(isolate, length),
                                   napi_create_uint32_(isolate, sentTs));
      });
}

void NodeEventHandler::onStreamMessageError(const RtcConnection &connection,
                                            uid_t remoteUid, int streamId,
                                            int code, int missed, int cached) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, remoteUid, streamId, code,
                               missed, cached] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_STREAM_MESSAGE_ERROR, 6, _connection,
                               napi_create_uid_(isolate, remoteUid),
                               napi_create_int32_(isolate, streamId),
                               napi_create_int32_(isolate, code),
                               napi_create_int32_(isolate, missed),
                               napi_create_int32_(isolate, cached));
  });
}

void NodeEventHandler::onRequestToken(const RtcConnection &connection) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_REQUEST_TOKEN, 1, _connection);
  });
}

void NodeEventHandler::onTokenPrivilegeWillExpire(
    const RtcConnection &connection, const char *token) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, token] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_TOKEN_PRIVILEGE_WILL_EXPIRE, 2,
                               _connection,
                               napi_create_string_(isolate, token));
  });
}

void NodeEventHandler::onFirstLocalAudioFramePublished(
    const RtcConnection &connection, int elapsed) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, elapsed] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_FIRST_LOCAL_AUDIO_FRAME_PUBLISH, 2,
                               _connection,
                               napi_create_int32_(isolate, elapsed));
  });
}

void NodeEventHandler::onLocalAudioStateChanged(
    const RtcConnection &connection, LOCAL_AUDIO_STREAM_STATE state,
    LOCAL_AUDIO_STREAM_ERROR error) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, state, error] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_LOCAL_AUDIO_STATE_CHANGED, 3,
                               _connection, napi_create_int32_(isolate, state),
                               napi_create_int32_(isolate, error));
  });
}

void NodeEventHandler::onRemoteAudioStateChanged(
    const RtcConnection &connection, uid_t remoteUid, REMOTE_AUDIO_STATE state,
    REMOTE_AUDIO_STATE_REASON reason, int elapsed) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call(
      [this, _connection, remoteUid, state, reason, elapsed] {
        Isolate *isolate = Isolate::GetCurrent();
        HandleScope scope(isolate);
        this->sendJSWithConnection(RTC_EVENT_REMOTE_AUDIO_STATE_CHANGED, 5,
                                   _connection,
                                   napi_create_uid_(isolate, remoteUid),
                                   napi_create_uint32_(isolate, state),
                                   napi_create_uint32_(isolate, reason),
                                   napi_create_int32_(isolate, elapsed));
      });
}

void NodeEventHandler::onActiveSpeaker(const RtcConnection &connection,
                                       uid_t uid) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, uid] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_ACTIVE_SPEAKER, 2, _connection,
                               napi_create_uint32_(isolate, uid));
  });
}

void NodeEventHandler::onClientRoleChanged(const RtcConnection &connection,
                                           CLIENT_ROLE_TYPE oldRole,
                                           CLIENT_ROLE_TYPE newRole) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, oldRole, newRole] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_CLIENT_ROLE_CHANGED, 3, _connection,
                               napi_create_uint32_(isolate, oldRole),
                               napi_create_uint32_(isolate, newRole));
  });
}

void NodeEventHandler::onRemoteAudioTransportStats(
    const RtcConnection &connection, uid_t remoteUid, unsigned short delay,
    unsigned short lost, unsigned short rxKBitRate) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, remoteUid, delay, lost,
                               rxKBitRate] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(
        RTC_EVENT_REMOTE_AUDIO_TRANSPORT_STATS, 5, _connection,
        napi_create_uid_(isolate, remoteUid),
        napi_create_uint32_(isolate, delay), napi_create_uint32_(isolate, lost),
        napi_create_int32_(isolate, rxKBitRate));
  });
}

void NodeEventHandler::onRemoteVideoTransportStats(
    const RtcConnection &connection, uid_t remoteUid, unsigned short delay,
    unsigned short lost, unsigned short rxKBitRate) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, remoteUid, delay, lost,
                               rxKBitRate] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(
        RTC_EVENT_REMOTE_VIDEO_TRANSPORT_STATS, 5, _connection,
        napi_create_uid_(isolate, remoteUid),
        napi_create_uint32_(isolate, delay), napi_create_uint32_(isolate, lost),
        napi_create_int32_(isolate, rxKBitRate));
  });
}

void NodeEventHandler::onConnectionStateChanged(
    const RtcConnection &connection, CONNECTION_STATE_TYPE state,
    CONNECTION_CHANGED_REASON_TYPE reason) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, state, reason] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_CONNECTION_STATE_CHANGED, 3,
                               _connection, napi_create_uint32_(isolate, state),
                               napi_create_uint32_(isolate, reason));
  });
}

void NodeEventHandler::onNetworkTypeChanged(const RtcConnection &connection,
                                            NETWORK_TYPE type) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, type] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_NETWORK_TYPE_CHANGED, 2, _connection,
                               napi_create_uint32_(isolate, type));
  });
}

void NodeEventHandler::onEncryptionError(const RtcConnection &connection,
                                         ENCRYPTION_ERROR_TYPE errorType) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, errorType] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_ENCRYPTION_ERROR, 2, _connection,
                               napi_create_uint32_(isolate, errorType));
  });
}

void NodeEventHandler::onUserAccountUpdated(const RtcConnection &connection,
                                            uid_t remoteUid,
                                            const char *userAccount) {
  FUNC_TRACE;
  CustomRtcConnection _connection(connection);
  node_async_call::async_call([this, _connection, remoteUid, userAccount] {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    this->sendJSWithConnection(RTC_EVENT_USER_ACCOUNT_UPDATED, 3, _connection,
                               napi_create_uint32_(isolate, remoteUid),
                               napi_create_string_(isolate, userAccount));
  }); 
}

void NodeEventHandler::onLocalVideoTranscoderError(const TranscodingVideoStream *stream,
                                                   VIDEO_TRANSCODER_ERROR error) {
  FUNC_TRACE;   
  node_async_call::async_call([this, stream, error] {
    this->onLocalVideoTranscoderError_node(stream, error);
  });
}

void NodeEventHandler::onLocalVideoTranscoderError_node(const TranscodingVideoStream *stream,
                                                        VIDEO_TRANSCODER_ERROR error) {
  FUNC_TRACE;
  do {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);    
    Local<Context> context = isolate->GetCurrentContext(); 
    Local<Object> obj = Object::New(isolate); 
    CHECK_NAPI_OBJ(obj); 
    NODE_SET_OBJ_PROP_NUMBER(odj, "sourceType", stream.sourceType);
    NODE_SET_OBJ_PROP_UID(odj, "remoteUserUid", stream.remoteUserUid);
    NODE_SET_OBJ_PROP_STRING(odj, "imageUrl", stream.imageUrl);
    NODE_SET_OBJ_PROP_NUMBER(odj, "mediaPlayerId", stream.mediaPlayerId);
    NODE_SET_OBJ_PROP_NUMBER(odj, "x", stream.x);
    NODE_SET_OBJ_PROP_NUMBER(odj, "y", stream.y);
    NODE_SET_OBJ_PROP_NUMBER(odj, "width", stream.width);
    NODE_SET_OBJ_PROP_NUMBER(odj, "height", stream.height);
    NODE_SET_OBJ_PROP_NUMBER(odj, "zOrder", stream.zOrder);
    obj->Set(context, napi_create_string_(isolate, "alpha"),
                      napi_create_double_(isolate, stream.alpha));
    obj->Set(context, napi_create_string_(isolate, "mirror"),
                      napi_create_bool_(isolate, stream.mirror));
    
    Local<Value> arg[2] = {obj, napi_create_int32_(isolate, error)};
    auto it = m_callbacks.find(RTC_EVENT_LOCAL_VIDEO_TRANSCODER_ERROR);
    if (it != m_callbacks.end()) {
      it->second->callback.Get(isolate)->Call(
          context, it->second->js_this.Get(isolate), 2, arg);
    }

  } while (false);
}

void NodeEventHandler::onRtcStats_node_with_type(
    const char *type, const CustomRtcConnection &connection,
    const RtcStats &stats) {
  unsigned int usercount = stats.userCount;
  LOG_INFO("duration : %d, tx :%d, rx :%d, txbr :%d, rxbr :%d, txAudioBr :%d, "
           "rxAudioBr :%d, users :%d\n",
           stats.duration, stats.txBytes, stats.rxBytes, stats.txKBitRate,
           stats.rxKBitRate, stats.txAudioKBitRate, stats.rxAudioKBitRate,
           usercount);
  do {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    Local<Context> context = isolate->GetCurrentContext();
    Local<Object> obj = Object::New(isolate);
    CHECK_NAPI_OBJ(obj);
    NODE_SET_OBJ_PROP_UINT32(obj, "duration", stats.duration);
    NODE_SET_OBJ_PROP_UINT32(obj, "txBytes", stats.txBytes);
    NODE_SET_OBJ_PROP_UINT32(obj, "rxBytes", stats.rxBytes);
    NODE_SET_OBJ_PROP_UINT32(obj, "txKBitRate", stats.txKBitRate);
    NODE_SET_OBJ_PROP_UINT32(obj, "rxKBitRate", stats.rxKBitRate);
    NODE_SET_OBJ_PROP_UINT32(obj, "rxAudioBytes", stats.rxAudioBytes);
    NODE_SET_OBJ_PROP_UINT32(obj, "txAudioBytes", stats.txAudioBytes);
    NODE_SET_OBJ_PROP_UINT32(obj, "rxVideoBytes", stats.rxVideoBytes);
    NODE_SET_OBJ_PROP_UINT32(obj, "txVideoBytes", stats.txVideoBytes);
    NODE_SET_OBJ_PROP_UINT32(obj, "rxAudioKBitRate", stats.rxAudioKBitRate);
    NODE_SET_OBJ_PROP_UINT32(obj, "txAudioKBitRate", stats.txAudioKBitRate);
    NODE_SET_OBJ_PROP_UINT32(obj, "rxVideoKBitRate", stats.rxVideoKBitRate);
    NODE_SET_OBJ_PROP_UINT32(obj, "txVideoKBitRate", stats.txVideoKBitRate);
    NODE_SET_OBJ_PROP_UINT32(obj, "lastmileDelay", stats.lastmileDelay);
    NODE_SET_OBJ_PROP_UINT32(obj, "users", usercount);
    NODE_SET_OBJ_PROP_UINT32(obj, "userCount", stats.userCount);
    NODE_SET_OBJ_PROP_NUMBER(obj, "cpuAppUsage", stats.cpuAppUsage);
    NODE_SET_OBJ_PROP_NUMBER(obj, "cpuTotalUsage", stats.cpuTotalUsage);
    NODE_SET_OBJ_PROP_NUMBER(obj, "memoryAppUsageRatio",
                             stats.memoryAppUsageRatio);
    NODE_SET_OBJ_PROP_NUMBER(obj, "memoryAppUsageInKbytes",
                             stats.memoryAppUsageInKbytes);
    NODE_SET_OBJ_PROP_NUMBER(obj, "memoryTotalUsageRatio",
                             stats.memoryTotalUsageRatio);
    NODE_SET_OBJ_PROP_NUMBER(obj, "txPacketLossRate", stats.txPacketLossRate);
    NODE_SET_OBJ_PROP_NUMBER(obj, "rxPacketLossRate", stats.rxPacketLossRate);

    Local<Object> connectionObj = Object::New(isolate);
    connectionObj->Set(context, napi_create_string_(isolate, "localUid"),
                       napi_create_uid_(isolate, connection.localUid));
    connectionObj->Set(
        context, napi_create_string_(isolate, "channelId"),
        napi_create_string_(isolate, connection.channelId.c_str()));

    Local<Value> arg[2] = {connectionObj, obj};
    auto it = m_callbacks.find(type);
    if (it != m_callbacks.end()) {
      it->second->callback.Get(isolate)->Call(
          context, it->second->js_this.Get(isolate), 2, arg);
    }
  } while (false);
}

void NodeEventHandler::sendJSWithConnection(
    const char *type, int count, const CustomRtcConnection connection, ...) {
  do {
    Isolate *isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    Local<Context> context = isolate->GetCurrentContext();
    Local<Object> obj = Object::New(isolate);

    NODE_SET_OBJ_PROP_STRING(obj, "channelId", connection.channelId.c_str());
    NODE_SET_OBJ_PROP_UID(obj, "localUid", connection.localUid);

    va_list ap;
    va_start(ap, connection);

    std::vector<Local<Value>> valueList;
    valueList.push_back(obj);
    for (int i = 0; i < count - 1; i++) {
      auto item = va_arg(ap, Local<Value>);
      valueList.push_back(item);
    }
    va_end(ap);

    auto it = m_callbacks.find(type);
    if (it != m_callbacks.end()) {
      it->second->callback.Get(isolate)->Call(
          context, it->second->js_this.Get(isolate), count, valueList.data());
    }
  } while (false);
}

// public
void NodeEventHandler::fireApiError(const char *funcName) {
  FUNC_TRACE;
  MAKE_JS_CALL_1(RTC_EVENT_API_ERROR, string, funcName);
}

void NodeEventHandler::addEventHandler(const std::string &eventName,
                                       Persistent<Object> &obj,
                                       Persistent<Function> &callback) {
  FUNC_TRACE;
  NodeEventCallback *cb = new NodeEventCallback();
  cb->js_this.Reset(obj);
  cb->callback.Reset(callback);
  m_callbacks.emplace(eventName, cb);
}
} // namespace rtc
} // namespace agora
