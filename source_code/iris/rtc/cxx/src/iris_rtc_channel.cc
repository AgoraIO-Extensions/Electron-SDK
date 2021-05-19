//
// Created by LXH on 2021/1/19.
//

#include "iris_rtc_channel.h"
#include "IAgoraRtcEngine2.h"
#include "internal/iris_json_utils.h"
#include "internal/iris_rtc_json_decoder.h"
#include "internal/rtc_channel_event_handler.h"
#include "internal/rtc_metadata_observer.h"
#include "iris_proxy.h"
#include <map>

#define GET_VALUE_DEF$(val, key) GET_VALUE_DEF(val, key, key)

#define GET_VALUE_DEF_CHAR$(val, key) GET_VALUE_DEF_CHAR(val, key, key)

#define GET_VALUE_DEF_OBJ$(val, key) GET_VALUE_DEF_OBJ(val, key, key)

#define GET_VALUE_DEF_PTR$(val, obj, key, type)                                \
  GET_VALUE_DEF_PTR(val, key, (obj).key, type)

#define GET_VALUE_DEF_ARR$(val, obj, key, count, type)                         \
  GET_VALUE_DEF_ARR(val, key, (obj).key, (obj).count, type)

#define GET_VALUE$(val, key, type) GET_VALUE(val, key, key, type)

#define GET_VALUE_UINT$(val, key, type) GET_VALUE_UINT(val, key, key, type)

#define GET_VALUE_OBJ$(val, key) GET_VALUE_OBJ(val, key, key)

#define GET_VALUE_PTR$(val, obj, key, type)                                    \
  GET_VALUE_PTR(val, key, (obj).key, type)

#define GET_VALUE_ARR$(val, obj, key, count, type)                             \
  GET_VALUE_ARR(val, key, (obj).key, (obj).count, type)

namespace agora {
using namespace rtc;

namespace iris {
namespace rtc {
using namespace std;
using rapidjson::Document;
using rapidjson::Value;

class IrisEventHandlerWrapper : public IrisEventHandler {
 public:
  void OnEvent(const char *event, const char *data) override {
    Document document;
    document.Parse(data);
    auto channelId = document["channelId"].GetString();
    auto it = event_handler_map_.find(channelId);
    if (it != event_handler_map_.end()) { it->second->OnEvent(event, data); }
  }

  void OnEvent(const char *event, const char *data, const void *buffer,
               unsigned int length) override {
    Document document;
    document.Parse(data);
    auto channelId = document["channelId"].GetString();
    auto it = event_handler_map_.find(channelId);
    if (it != event_handler_map_.end()) {
      it->second->OnEvent(event, data, buffer, length);
    }
  }

 public:
  map<string, IrisEventHandler *> event_handler_map_;
};

class IrisRtcChannel::IrisRtcChannelImpl {
 public:
  IrisRtcChannelImpl()
      : rtc_engine_(nullptr),
        rtc_channel_event_handler_(new RtcChannelEventHandler),
        iris_event_handler_wrapper_(new IrisEventHandlerWrapper) {}

  ~IrisRtcChannelImpl() {
    if (rtc_channel_event_handler_) {
      delete rtc_channel_event_handler_;
      rtc_channel_event_handler_ = nullptr;
    }
    if (iris_event_handler_wrapper_) {
      delete iris_event_handler_wrapper_;
      iris_event_handler_wrapper_ = nullptr;
    }
  }

  void Initialize(IRtcEngine *engine) { rtc_engine_ = engine; }

  void Release() { rtc_engine_ = nullptr; }

  void SetEventHandler(IrisEventHandler *event_handler) {
    rtc_channel_event_handler_->event_handler_ = event_handler;
  }

  void RegisterEventHandler(const char *channel_id,
                            IrisEventHandler *event_handler) {
    iris_event_handler_wrapper_->event_handler_map_.emplace(channel_id,
                                                            event_handler);
    rtc_channel_event_handler_->event_handler_ = iris_event_handler_wrapper_;
  }

  void UnRegisterEventHandler(const char *channel_id) {
    iris_event_handler_wrapper_->event_handler_map_.erase(channel_id);
    rtc_channel_event_handler_->event_handler_ = iris_event_handler_wrapper_;
  }

  int CallApi(ApiTypeChannel api_type, const char *params,
              char result[kBasicResultLength]) {
    int error_code = -ERROR_CODE_TYPE::ERR_FAILED;
    Document document;
    document.Parse(params);

    const char *channelId;
    GET_VALUE$(document, channelId, const char *)
    auto channel = rtc_channels_[channelId];

    if (api_type == kChannelCreateChannel) {
      if (channel) {
        error_code = ERROR_CODE_TYPE::ERR_OK;
      } else {
        if (!rtc_engine_) {
          error_code = -ERROR_CODE_TYPE::ERR_NOT_INITIALIZED;
        } else {
          auto engine = reinterpret_cast<IRtcEngine2 *>(rtc_engine_);
          if (!engine) {
            error_code = -ERROR_CODE_TYPE::ERR_NOT_INITIALIZED;
          } else {
            auto rtc_channel = engine->createChannel(channelId);
            if (rtc_channel) {
              rtc_channel->setChannelEventHandler(rtc_channel_event_handler_);
              rtc_channels_[channelId] = rtc_channel;
              error_code = ERROR_CODE_TYPE::ERR_OK;
            }
          }
        }
      }
    } else {
      if (!channel) {
        error_code = -ERROR_CODE_TYPE::ERR_NOT_INITIALIZED;
        return error_code;
      }

      switch (api_type) {
        case kChannelRelease: {
          error_code = channel->release();
          rtc_channels_.erase(channelId);
          break;
        }
        case kChannelJoinChannel: {
          const char *token;
          GET_VALUE_DEF_CHAR$(document, token)
          const char *info;
          GET_VALUE_DEF_CHAR$(document, info)
          unsigned int uid;
          GET_VALUE$(document, uid, unsigned int)
          ChannelMediaOptions options;
          GET_VALUE_DEF_OBJ$(document, options)
          error_code = channel->joinChannel(token, info, uid, options);
          break;
        }
        case kChannelJoinChannelWithUserAccount: {
          const char *token;
          GET_VALUE_DEF_CHAR$(document, token)
          const char *userAccount;
          GET_VALUE$(document, userAccount, const char *)
          ChannelMediaOptions options;
          GET_VALUE_DEF_OBJ$(document, options)
          error_code =
              channel->joinChannelWithUserAccount(token, userAccount, options);
          break;
        }
        case kChannelLeaveChannel: {
          error_code = channel->leaveChannel();
          break;
        }
        case kChannelPublish: {
          error_code = channel->publish();
          break;
        }
        case kChannelUnPublish: {
          error_code = channel->unpublish();
          break;
        }
        case kChannelChannelId: {
          strcpy(result, channel->channelId());
          error_code = ERROR_CODE_TYPE::ERR_OK;
          break;
        }
        case kChannelGetCallId: {
          agora::util::AString callId;
          error_code = channel->getCallId(callId);
          strcpy(result, callId->c_str());
          break;
        }
        case kChannelRenewToken: {
          const char *token;
          GET_VALUE$(document, token, const char *)
          error_code = channel->renewToken(token);
          break;
        }
        case kChannelSetEncryptionSecret: {
          const char *secret;
          GET_VALUE$(document, secret, const char *)
          error_code = channel->setEncryptionSecret(secret);
          break;
        }
        case kChannelSetEncryptionMode: {
          const char *encryptionMode;
          GET_VALUE$(document, encryptionMode, const char *)
          error_code = channel->setEncryptionMode(encryptionMode);
          break;
        }
        case kChannelEnableEncryption: {
          bool enabled;
          GET_VALUE$(document, enabled, bool)
          EncryptionConfig config;
          GET_VALUE_DEF_OBJ$(document, config);
          error_code = channel->enableEncryption(enabled, config);
          break;
        }
        case kChannelRegisterMediaMetadataObserver: {
          if (metadata_observers_.find(channelId)
              == metadata_observers_.end()) {
            IMetadataObserver::METADATA_TYPE type;
            GET_VALUE_UINT$(document, type, IMetadataObserver::METADATA_TYPE)
            auto metadata_observer = new RtcMetadataObserver;
            metadata_observers_[channelId] = new RtcMetadataObserver;
            error_code =
                channel->registerMediaMetadataObserver(metadata_observer, type);
          }
          break;
        }
        case kChannelUnRegisterMediaMetadataObserver: {
          auto it = metadata_observers_.find(channelId);
          if (it != metadata_observers_.end()) {
            IMetadataObserver::METADATA_TYPE type;
            GET_VALUE_UINT$(document, type, IMetadataObserver::METADATA_TYPE)
            error_code = channel->registerMediaMetadataObserver(nullptr, type);
            delete it->second;
            metadata_observers_.erase(channelId);
          }
          break;
        }
        case kChannelSetMaxMetadataSize: {
          auto it = metadata_observers_.find(channelId);
          if (it != metadata_observers_.end()) {
            int size;
            GET_VALUE$(document, size, int)
            error_code = it->second->SetMaxMetadataSize(size);
          }
          break;
        }
        case kChannelSetClientRole: {
          CLIENT_ROLE_TYPE role;
          GET_VALUE_UINT$(document, role, CLIENT_ROLE_TYPE)
          try {
            ClientRoleOptions options;
            GET_VALUE_OBJ$(document, options)
            error_code = channel->setClientRole(role, options);
          } catch (invalid_argument &) {
            error_code = channel->setClientRole(role);
          }
          break;
        }
        case kChannelSetRemoteUserPriority: {
          unsigned int uid;
          GET_VALUE$(document, uid, unsigned int)
          PRIORITY_TYPE userPriority;
          GET_VALUE_UINT$(document, userPriority, PRIORITY_TYPE)
          error_code = channel->setRemoteUserPriority(uid, userPriority);
          break;
        }
        case kChannelSetRemoteVoicePosition: {
          unsigned int uid;
          GET_VALUE$(document, uid, unsigned int)
          double pan;
          GET_VALUE$(document, pan, double)
          double gain;
          GET_VALUE$(document, gain, double)
          error_code = channel->setRemoteVoicePosition(uid, pan, gain);
          break;
        }
        case kChannelSetRemoteRenderMode: {
          unsigned int userId;
          GET_VALUE$(document, userId, unsigned int)
          RENDER_MODE_TYPE renderMode;
          GET_VALUE_UINT$(document, renderMode, RENDER_MODE_TYPE)
          VIDEO_MIRROR_MODE_TYPE mirrorMode;
          GET_VALUE_UINT$(document, mirrorMode, VIDEO_MIRROR_MODE_TYPE)
          error_code =
              channel->setRemoteRenderMode(userId, renderMode, mirrorMode);
          break;
        }
        case kChannelSetDefaultMuteAllRemoteAudioStreams: {
          bool mute;
          GET_VALUE$(document, mute, bool)
          error_code = channel->setDefaultMuteAllRemoteAudioStreams(mute);
          break;
        }
        case kChannelSetDefaultMuteAllRemoteVideoStreams: {
          bool mute;
          GET_VALUE$(document, mute, bool)
          error_code = channel->setDefaultMuteAllRemoteVideoStreams(mute);
          break;
        }
        case kChannelMuteAllRemoteAudioStreams: {
          bool mute;
          GET_VALUE$(document, mute, bool)
          error_code = channel->muteAllRemoteAudioStreams(mute);
          break;
        }
        case kChannelAdjustUserPlaybackSignalVolume: {
          unsigned int uid;
          GET_VALUE$(document, uid, unsigned int)
          int volume;
          GET_VALUE$(document, volume, int)
          error_code = channel->adjustUserPlaybackSignalVolume(uid, volume);
          break;
        }
        case kChannelMuteRemoteAudioStream: {
          unsigned int userId;
          GET_VALUE$(document, userId, unsigned int)
          bool mute;
          GET_VALUE$(document, mute, bool)
          error_code = channel->muteRemoteAudioStream(userId, mute);
          break;
        }
        case kChannelMuteAllRemoteVideoStreams: {
          bool mute;
          GET_VALUE$(document, mute, bool)
          error_code = channel->muteAllRemoteVideoStreams(mute);
          break;
        }
        case kChannelMuteRemoteVideoStream: {
          unsigned int userId;
          GET_VALUE$(document, userId, unsigned int)
          bool mute;
          GET_VALUE$(document, mute, bool)
          error_code = channel->muteRemoteVideoStream(userId, mute);
          break;
        }
        case kChannelSetRemoteVideoStreamType: {
          unsigned int userId;
          GET_VALUE$(document, userId, unsigned int)
          REMOTE_VIDEO_STREAM_TYPE streamType;
          GET_VALUE_UINT$(document, streamType, REMOTE_VIDEO_STREAM_TYPE)
          error_code = channel->setRemoteVideoStreamType(userId, streamType);
          break;
        }
        case kChannelSetRemoteDefaultVideoStreamType: {
          REMOTE_VIDEO_STREAM_TYPE streamType;
          GET_VALUE_UINT$(document, streamType, REMOTE_VIDEO_STREAM_TYPE)
          error_code = channel->setRemoteDefaultVideoStreamType(streamType);
          break;
        }
        case kChannelCreateDataStream: {
          int streamId;
          try {
            DataStreamConfig config{};
            GET_VALUE_OBJ$(document, config)
            error_code = channel->createDataStream(&streamId, config);
          } catch (invalid_argument &) {
            bool reliable;
            GET_VALUE$(document, reliable, bool)
            bool ordered;
            GET_VALUE$(document, ordered, bool)
            error_code =
                channel->createDataStream(&streamId, reliable, ordered);
          }
          if (error_code == ERROR_CODE_TYPE::ERR_OK) { error_code = streamId; }
          break;
        }
        case kChannelAddPublishStreamUrl: {
          const char *url;
          GET_VALUE$(document, url, const char *)
          bool transcodingEnabled;
          GET_VALUE$(document, transcodingEnabled, bool)
          error_code = channel->addPublishStreamUrl(url, transcodingEnabled);
          break;
        }
        case kChannelRemovePublishStreamUrl: {
          const char *url;
          GET_VALUE$(document, url, const char *)
          error_code = channel->removePublishStreamUrl(url);
          break;
        }
        case kChannelSetLiveTranscoding: {
          LiveTranscoding transcoding;
          GET_VALUE_OBJ$(document, transcoding)
          GET_VALUE_ARR$(value_transcoding, transcoding, transcodingUsers,
                         userCount, TranscodingUser)
          GET_VALUE_DEF_PTR$(value_transcoding, transcoding, watermark,
                             RtcImage)
          GET_VALUE_DEF_PTR$(value_transcoding, transcoding, backgroundImage,
                             RtcImage)
          GET_VALUE_DEF_ARR$(value_transcoding, transcoding, advancedFeatures,
                             advancedFeatureCount, LiveStreamAdvancedFeature)
          error_code = channel->setLiveTranscoding(transcoding);
          break;
        }
        case kChannelAddInjectStreamUrl: {
          const char *url;
          GET_VALUE$(document, url, const char *)
          InjectStreamConfig config;
          GET_VALUE_DEF_OBJ$(document, config)
          error_code = channel->addInjectStreamUrl(url, config);
          break;
        }
        case kChannelRemoveInjectStreamUrl: {
          const char *url;
          GET_VALUE$(document, url, const char *)
          error_code = channel->removeInjectStreamUrl(url);
          break;
        }
        case kChannelStartChannelMediaRelay: {
          ChannelMediaRelayConfiguration configuration;
          GET_VALUE_OBJ$(document, configuration)
          GET_VALUE_PTR$(value_configuration, configuration, srcInfo,
                         ChannelMediaInfo)
          GET_VALUE_ARR$(value_configuration, configuration, destInfos,
                         destCount, ChannelMediaInfo)
          error_code = channel->startChannelMediaRelay(configuration);
          break;
        }
        case kChannelUpdateChannelMediaRelay: {
          ChannelMediaRelayConfiguration configuration;
          GET_VALUE_OBJ$(document, configuration)
          GET_VALUE_PTR$(value_configuration, configuration, srcInfo,
                         ChannelMediaInfo)
          GET_VALUE_ARR$(value_configuration, configuration, destInfos,
                         destCount, ChannelMediaInfo)
          error_code = channel->updateChannelMediaRelay(configuration);
          break;
        }
        case kChannelStopChannelMediaRelay: {
          error_code = channel->stopChannelMediaRelay();
          break;
        }
        case kChannelGetConnectionState: {
          error_code = channel->getConnectionState();
          break;
        }
        case kChannelEnableRemoteSuperResolution: {
          unsigned int userId;
          GET_VALUE$(document, userId, unsigned int)
          bool enable;
          GET_VALUE$(document, enable, bool)
          error_code = channel->enableRemoteSuperResolution(userId, enable);
          break;
        }
        default: {
          error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
          break;
        }
      }
    }

    return error_code;
  }

  int CallApi(ApiTypeChannel api_type, const char *params, void *buffer,
              char[kBasicResultLength]) {
    int error_code = -ERROR_CODE_TYPE::ERR_FAILED;
    Document document;
    document.Parse(params);

    const char *channelId;
    GET_VALUE$(document, channelId, const char *)
    auto channel = rtc_channels_[channelId];

    switch (api_type) {
      case kChannelRegisterPacketObserver: {
        error_code = channel->registerPacketObserver(
            reinterpret_cast<IPacketObserver *>(buffer));
        break;
      }
      case kChannelSendStreamMessage: {
        int streamId;
        GET_VALUE$(document, streamId, int)
        size_t length;
        GET_VALUE_UINT$(document, length, size_t)
        error_code = channel->sendStreamMessage(
            streamId, reinterpret_cast<char *>(buffer), length);
        break;
      }
      case kChannelSendMetadata: {
        auto it = metadata_observers_.find(channelId);
        if (it != metadata_observers_.end()) {
          IMetadataObserver::Metadata metadata{};
          GET_VALUE_OBJ$(document, metadata)
          metadata.buffer = reinterpret_cast<unsigned char *>(buffer);
          error_code = it->second->SendMetadata(metadata);
        }
        break;
      }
      default: {
        error_code = -ERROR_CODE_TYPE::ERR_NOT_SUPPORTED;
        break;
      }
    }

    return error_code;
  }

 private:
  IRtcEngine *rtc_engine_;
  RtcChannelEventHandler *rtc_channel_event_handler_;
  IrisEventHandlerWrapper *iris_event_handler_wrapper_;
  map<string, IChannel *> rtc_channels_;
  map<string, RtcMetadataObserver *> metadata_observers_;
};

IrisRtcChannel::IrisRtcChannel()
    : channel_(new IrisRtcChannelImpl), proxy_(nullptr) {}

IrisRtcChannel::~IrisRtcChannel() {
  if (channel_) {
    delete channel_;
    channel_ = nullptr;
  }
}

void IrisRtcChannel::Initialize(IRtcEngine *engine) {
  channel_->Initialize(engine);
}

void IrisRtcChannel::Release() { channel_->Release(); }

void IrisRtcChannel::SetEventHandler(IrisEventHandler *event_handler) {
  channel_->SetEventHandler(event_handler);
}

void IrisRtcChannel::RegisterEventHandler(const char *channel_id,
                                          IrisEventHandler *event_handler) {
  channel_->RegisterEventHandler(channel_id, event_handler);
}

void IrisRtcChannel::UnRegisterEventHandler(const char *channel_id) {
  channel_->UnRegisterEventHandler(channel_id);
}

void IrisRtcChannel::SetProxy(IrisProxy *proxy) { proxy_ = proxy; }

int IrisRtcChannel::CallApi(ApiTypeChannel api_type, const char *params,
                            char result[kBasicResultLength]) {
  if (proxy_) { return proxy_->CallApi(api_type, params, result); }
  return channel_->CallApi(api_type, params, result);
}

int IrisRtcChannel::CallApi(ApiTypeChannel api_type, const char *params,
                            void *buffer, char result[kBasicResultLength]) {
  if (proxy_) { return proxy_->CallApi(api_type, params, buffer, result); }
  return channel_->CallApi(api_type, params, buffer, result);
}
}// namespace rtc
}// namespace iris
}// namespace agora
