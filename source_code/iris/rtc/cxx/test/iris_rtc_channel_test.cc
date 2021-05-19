//
// Created by LXH on 2021/1/22.
//

#include "iris_rtc_engine.h"
#include "iris_test_utils.h"
#include "gtest/gtest.h"

#define CALL_YES(api_type, params)                                             \
  EXPECT_LE(0, channel_->CallApi(api_type, params, result_))

#define CALL_NO(api_type, params)                                              \
  EXPECT_GT(0, channel_->CallApi(api_type, params, result_))

#define CALL_P_YES(api_type, params, ptr)                                      \
  EXPECT_LE(0, channel_->CallApi(api_type, params, result_, ptr))

#define CALL_P_NO(api_type, params, ptr)                                       \
  EXPECT_GT(0, channel_->CallApi(api_type, params, result_, ptr))

namespace agora {
namespace iris {
namespace rtc {
namespace test {
class IrisRtcChannelEventHandler : public IrisEventHandler {
 public:
  void OnEvent(const char *event, const char *data) override {
    if (event_name_ == event) {
      event_.Set();
      printf("%s - %s\n", event, data);
    }
  }

  void OnEvent(const char *event, const char *data, const void *buffer,
               unsigned length) override {
    if (event_name_ == event) {
      event_.Set();
      printf("%s - %s\n", event, data);
    }
  }

  bool WaitForEvent(const char *event_name) {
    event_name_ = event_name;
    return event_.Wait(10000) == 0;
  }

 private:
  std::string event_name_;
  AutoResetEvent event_;
};

class IrisRtcChannelTester : public testing::Test {
 public:
  IrisRtcChannelTester()
      : engine_(nullptr), channel_(nullptr), event_handler_(nullptr) {}

  void JoinChannel() {
    CALL_YES(
        kChannelJoinChannel,
        R"({"token":null, "channelId":"0", "info":null, "uid":0, "options":{"autoSubscribeAudio":true, "autoSubscribeVideo":true}})");
    EXPECT_TRUE(event_handler_->WaitForEvent("onJoinChannelSuccess"));
  }

  void RegisterMediaMetadataObserver() {
    CALL_YES(kChannelRegisterMediaMetadataObserver,
             R"({"channelId":"0", "type": 0})");
  }

 protected:
  void SetUp() override {
    engine_ = new IrisRtcEngine;
    channel_ = engine_->channel();
    event_handler_ = new IrisRtcChannelEventHandler;
    channel_->SetEventHandler(event_handler_);
    auto params =
        R"({"context":{"appId":")" + std::string(kTestAppId) + R"("}})";
    engine_->CallApi(ApiTypeEngine::kEngineInitialize, params.c_str(), nullptr);
    engine_->CallApi(ApiTypeEngine::kEngineEnableAudio, R"({})", nullptr);
    engine_->CallApi(ApiTypeEngine::kEngineEnableVideo, R"({})", nullptr);
    engine_->CallApi(ApiTypeEngine::kEngineSetChannelProfile,
                     R"({"profile":1})", nullptr);
  }

  void TearDown() override {
    delete engine_;
    engine_ = nullptr;
    delete event_handler_;
    event_handler_ = nullptr;
    delete[] result_;
  }

 protected:
  IrisRtcEngine *engine_;
  IrisRtcChannel *channel_;
  IrisRtcChannelEventHandler *event_handler_;
  char *result_ = new char[kBasicResultLength];
};

#define IRIS_CHANNEL_TEST(api_type, func)                                      \
  TEST_F(IrisRtcChannelTester, api_type) {                                     \
    EXPECT_THROW(CALL_YES(api_type, R"({})"), std::invalid_argument);          \
    CALL_NO(api_type, R"({"channelId":"0"})");                                 \
                                                                               \
    CALL_YES(kChannelCreateChannel, R"({"channelId":"0"})");                   \
    func;                                                                      \
  }

TEST_F(IrisRtcChannelTester, kChannelCreateChannel) {
  EXPECT_THROW(CALL_YES(kChannelCreateChannel, R"({})"), std::invalid_argument);
  CALL_YES(kChannelCreateChannel, R"({"channelId":"0"})");
}

IRIS_CHANNEL_TEST(kChannelRelease,
                  { CALL_YES(kChannelRelease, R"({"channelId":"0"})"); })

IRIS_CHANNEL_TEST(kChannelJoinChannel, {
  EXPECT_THROW(CALL_YES(kChannelJoinChannel, R"({"channelId":"0"})"),
               std::invalid_argument);
  CALL_YES(kChannelJoinChannel, R"({"channelId":"0", "uid":0})");
})

IRIS_CHANNEL_TEST(kChannelJoinChannelWithUserAccount, {
  EXPECT_THROW(
      CALL_YES(kChannelJoinChannelWithUserAccount, R"({"channelId":"0"})"),
      std::invalid_argument);
  CALL_YES(kChannelJoinChannelWithUserAccount,
           R"({"channelId":"0", "userAccount":"0"})");
})

IRIS_CHANNEL_TEST(kChannelLeaveChannel, {
  JoinChannel();
  CALL_YES(kChannelLeaveChannel, R"({"channelId":"0"})");
  EXPECT_TRUE(event_handler_->WaitForEvent("onLeaveChannel"));
})

IRIS_CHANNEL_TEST(kChannelPublish, {
  JoinChannel();
  CALL_YES(kChannelSetClientRole, R"({"channelId":"0", "role":1})");
  CALL_YES(kChannelPublish, R"({"channelId":"0"})");
})

IRIS_CHANNEL_TEST(kChannelUnPublish,
                  { CALL_YES(kChannelUnPublish, R"({"channelId":"0"})"); })

IRIS_CHANNEL_TEST(kChannelChannelId, {
  CALL_YES(kChannelChannelId, R"({"channelId":"0"})");
  EXPECT_STREQ("0", result_);
})

IRIS_CHANNEL_TEST(kChannelGetCallId, {
  JoinChannel();
  CALL_YES(kChannelGetCallId, R"({"channelId":"0"})");
  EXPECT_STRNE("", result_);
})

IRIS_CHANNEL_TEST(kChannelRenewToken, {
  EXPECT_THROW(CALL_YES(kChannelRenewToken, R"({"channelId":"0"})"),
               std::invalid_argument);
  CALL_YES(kChannelRenewToken, R"({"channelId":"0", "token": ""})");
})

IRIS_CHANNEL_TEST(kChannelSetEncryptionSecret, {
  EXPECT_THROW(CALL_YES(kChannelSetEncryptionSecret, R"({"channelId":"0"})"),
               std::invalid_argument);
  CALL_YES(kChannelSetEncryptionSecret, R"({"channelId":"0", "secret": ""})");
})

IRIS_CHANNEL_TEST(kChannelSetEncryptionMode, {
  EXPECT_THROW(CALL_YES(kChannelSetEncryptionMode, R"({"channelId":"0"})"),
               std::invalid_argument);
  CALL_YES(kChannelSetEncryptionMode,
           R"({"channelId":"0", "encryptionMode": ""})");
})

IRIS_CHANNEL_TEST(kChannelEnableEncryption, {
  EXPECT_THROW(CALL_YES(kChannelEnableEncryption, R"({"channelId":"0"})"),
               std::invalid_argument);
  CALL_YES(
      kChannelEnableEncryption,
      R"({"channelId":"0", "enabled":true, "config":{"encryptionMode":1, "encryptionKey":"0"}})");
  CALL_YES(kChannelEnableEncryption, R"({"channelId":"0", "enabled":false})");
})

IRIS_CHANNEL_TEST(kChannelRegisterPacketObserver, {
  CALL_P_YES(kChannelRegisterPacketObserver, R"({"channelId":"0"})", nullptr);
})

IRIS_CHANNEL_TEST(kChannelRegisterMediaMetadataObserver, {
  EXPECT_THROW(
      CALL_YES(kChannelRegisterMediaMetadataObserver, R"({"channelId":"0"})"),
      std::invalid_argument);
  RegisterMediaMetadataObserver();
})

IRIS_CHANNEL_TEST(kChannelUnRegisterMediaMetadataObserver, {
  CALL_NO(kChannelUnRegisterMediaMetadataObserver,
          R"({"channelId":"0", "type": 0})");

  RegisterMediaMetadataObserver();
  EXPECT_THROW(
      CALL_YES(kChannelUnRegisterMediaMetadataObserver, R"({"channelId":"0"})"),
      std::invalid_argument);
  CALL_YES(kChannelUnRegisterMediaMetadataObserver,
           R"({"channelId":"0", "type": 0})");
})

IRIS_CHANNEL_TEST(kChannelSetMaxMetadataSize, {
  CALL_NO(kChannelSetMaxMetadataSize, R"({"channelId":"0", "size": 0})");

  RegisterMediaMetadataObserver();
  EXPECT_THROW(CALL_YES(kChannelSetMaxMetadataSize, R"({"channelId":"0"})"),
               std::invalid_argument);
  CALL_YES(kChannelSetMaxMetadataSize, R"({"channelId":"0", "size": 0})");
})

IRIS_CHANNEL_TEST(kChannelSendMetadata, {
  CALL_P_NO(kChannelSendMetadata,
            R"({"channelId":"0", "metadata": {"size":0}})", nullptr);

  RegisterMediaMetadataObserver();
  EXPECT_THROW(
      CALL_P_YES(kChannelSendMetadata, R"({"channelId":"0"})", nullptr),
      std::invalid_argument);
  CALL_P_YES(kChannelSendMetadata,
             R"({"channelId":"0", "metadata": {"size":0}})", nullptr);
})

IRIS_CHANNEL_TEST(kChannelSetClientRole, {
  EXPECT_THROW(CALL_YES(kChannelSetClientRole, R"({"channelId":"0"})"),
               std::invalid_argument);
  CALL_YES(kChannelSetClientRole,
           R"({"channelId":"0", "role":1, "options":{}})");
  CALL_YES(kChannelSetClientRole, R"({"channelId":"0", "role":2})");
  EXPECT_TRUE(event_handler_->WaitForEvent("onClientRoleChanged"));
})

IRIS_CHANNEL_TEST(kChannelSetRemoteUserPriority, {
  EXPECT_THROW(CALL_YES(kChannelSetRemoteUserPriority, R"({"channelId":"0"})"),
               std::invalid_argument);
  EXPECT_THROW(
      CALL_YES(kChannelSetRemoteUserPriority, R"({"channelId":"0", "uid":0})"),
      std::invalid_argument);
  CALL_YES(kChannelSetRemoteUserPriority,
           R"({"channelId":"0", "uid":0, "userPriority":0})");
})

IRIS_CHANNEL_TEST(kChannelSetRemoteVoicePosition, {
  EXPECT_THROW(CALL_YES(kChannelSetRemoteVoicePosition, R"({"channelId":"0"})"),
               std::invalid_argument);
  EXPECT_THROW(
      CALL_YES(kChannelSetRemoteVoicePosition, R"({"channelId":"0", "uid":0})"),
      std::invalid_argument);
  EXPECT_THROW(CALL_YES(kChannelSetRemoteVoicePosition,
                        R"({"channelId":"0", "uid":0, "pan":0.0})"),
               std::invalid_argument);
  CALL_YES(kChannelSetRemoteVoicePosition,
           R"({"channelId":"0", "uid":0, "pan":0.0, "gain":0.0})");
})

IRIS_CHANNEL_TEST(kChannelSetRemoteRenderMode, {
  EXPECT_THROW(CALL_YES(kChannelSetRemoteRenderMode, R"({"channelId":"0"})"),
               std::invalid_argument);
  EXPECT_THROW(
      CALL_YES(kChannelSetRemoteRenderMode, R"({"channelId":"0", "userId":0})"),
      std::invalid_argument);
  EXPECT_THROW(CALL_YES(kChannelSetRemoteRenderMode,
                        R"({"channelId":"0", "userId":0, "renderMode":0})"),
               std::invalid_argument);
  CALL_YES(kChannelSetRemoteRenderMode,
           R"({"channelId":"0", "userId":0, "renderMode":0, "mirrorMode":0})");
})

IRIS_CHANNEL_TEST(kChannelSetDefaultMuteAllRemoteAudioStreams, {
  CALL_YES(kChannelSetDefaultMuteAllRemoteAudioStreams,
           R"({"channelId":"0", "mute":true})");
})

IRIS_CHANNEL_TEST(kChannelSetDefaultMuteAllRemoteVideoStreams, {
  CALL_YES(kChannelSetDefaultMuteAllRemoteVideoStreams,
           R"({"channelId":"0", "mute":true})");
})

IRIS_CHANNEL_TEST(kChannelMuteAllRemoteAudioStreams, {
  CALL_YES(kChannelMuteAllRemoteAudioStreams,
           R"({"channelId":"0", "mute":true})");
})

IRIS_CHANNEL_TEST(kChannelAdjustUserPlaybackSignalVolume, {
  EXPECT_THROW(
      CALL_YES(kChannelAdjustUserPlaybackSignalVolume, R"({"channelId":"0"})"),
      std::invalid_argument);
  EXPECT_THROW(CALL_YES(kChannelAdjustUserPlaybackSignalVolume,
                        R"({"channelId":"0", "uid":0})"),
               std::invalid_argument);
  CALL_YES(kChannelAdjustUserPlaybackSignalVolume,
           R"({"channelId":"0", "uid":0, "volume":0})");
})

IRIS_CHANNEL_TEST(kChannelMuteRemoteAudioStream, {
  EXPECT_THROW(CALL_YES(kChannelMuteRemoteAudioStream, R"({"channelId":"0"})"),
               std::invalid_argument);
  EXPECT_THROW(CALL_YES(kChannelMuteRemoteAudioStream,
                        R"({"channelId":"0", "userId":0})"),
               std::invalid_argument);
  CALL_YES(kChannelMuteRemoteAudioStream,
           R"({"channelId":"0", "userId":0, "mute":true})");
})

IRIS_CHANNEL_TEST(kChannelMuteAllRemoteVideoStreams, {
  CALL_YES(kChannelMuteAllRemoteVideoStreams,
           R"({"channelId":"0", "mute":true})");
})

IRIS_CHANNEL_TEST(kChannelMuteRemoteVideoStream, {
  EXPECT_THROW(CALL_YES(kChannelMuteRemoteVideoStream, R"({"channelId":"0"})"),
               std::invalid_argument);
  EXPECT_THROW(CALL_YES(kChannelMuteRemoteVideoStream,
                        R"({"channelId":"0", "userId":0})"),
               std::invalid_argument);
  CALL_YES(kChannelMuteRemoteVideoStream,
           R"({"channelId":"0", "userId":0, "mute":true})");
})

IRIS_CHANNEL_TEST(kChannelSetRemoteVideoStreamType, {
  EXPECT_THROW(
      CALL_YES(kChannelSetRemoteVideoStreamType, R"({"channelId":"0"})"),
      std::invalid_argument);
  EXPECT_THROW(CALL_YES(kChannelSetRemoteVideoStreamType,
                        R"({"channelId":"0", "userId":0})"),
               std::invalid_argument);
  CALL_YES(kChannelSetRemoteVideoStreamType,
           R"({"channelId":"0", "userId":0, "streamType":0})");
})

IRIS_CHANNEL_TEST(kChannelSetRemoteDefaultVideoStreamType, {
  EXPECT_THROW(
      CALL_YES(kChannelSetRemoteDefaultVideoStreamType, R"({"channelId":"0"})"),
      std::invalid_argument);
  CALL_YES(kChannelSetRemoteDefaultVideoStreamType,
           R"({"channelId":"0", "streamType":0})");
})

IRIS_CHANNEL_TEST(kChannelCreateDataStream, {
  EXPECT_THROW(CALL_YES(kChannelCreateDataStream, R"({"channelId":"0"})"),
               std::invalid_argument);
  EXPECT_THROW(CALL_YES(kChannelCreateDataStream,
                        R"({"channelId":"0", "reliable":true})"),
               std::invalid_argument);
  CALL_YES(kChannelCreateDataStream,
           R"({"channelId":"0", "reliable":true, "ordered":true})");
  CALL_YES(
      kChannelCreateDataStream,
      R"({"channelId":"0", "config":{"syncWithAudio":true, "ordered": true}})");
})

IRIS_CHANNEL_TEST(kChannelSendStreamMessage, {
  EXPECT_THROW(
      CALL_P_YES(kChannelSendStreamMessage, R"({"channelId":"0"})", nullptr),
      std::invalid_argument);
  EXPECT_THROW(CALL_P_YES(kChannelSendStreamMessage,
                          R"({"channelId":"0", "streamId":0})", nullptr),
               std::invalid_argument);
  auto streamId = channel_->CallApi(
      kChannelCreateDataStream,
      R"({"channelId":"0", "config":{"syncWithAudio":true, "ordered": true}})",
      nullptr);
  CALL_P_YES(kChannelSendStreamMessage,
             (R"({"channelId":"0", "streamId":)" + std::to_string(streamId)
              + R"(, "length": 1})")
                 .c_str(),
             nullptr);
})

IRIS_CHANNEL_TEST(kChannelAddPublishStreamUrl, {
  EXPECT_THROW(CALL_YES(kChannelAddPublishStreamUrl, R"({"channelId":"0"})"),
               std::invalid_argument);
  EXPECT_THROW(
      CALL_YES(kChannelAddPublishStreamUrl, R"({"channelId":"0", "url":""})"),
      std::invalid_argument);

  JoinChannel();
  CALL_YES(kChannelAddPublishStreamUrl,
           R"({"channelId":"0", "url":" ", "transcodingEnabled":true})");
  EXPECT_TRUE(event_handler_->WaitForEvent("onRtmpStreamingStateChanged"));
})

IRIS_CHANNEL_TEST(kChannelRemovePublishStreamUrl, {
  EXPECT_THROW(CALL_YES(kChannelRemovePublishStreamUrl, R"({"channelId":"0"})"),
               std::invalid_argument);
  CALL_YES(kChannelRemovePublishStreamUrl, R"({"channelId":"0", "url":" "})");
})

IRIS_CHANNEL_TEST(kChannelSetLiveTranscoding, {
  EXPECT_THROW(CALL_YES(kChannelSetLiveTranscoding, R"({"channelId":"0"})"),
               std::invalid_argument);
  CALL_YES(kChannelSetLiveTranscoding,
           R"({"channelId":"0", "transcoding":{"transcodingUsers":[]}})");
})

IRIS_CHANNEL_TEST(kChannelAddInjectStreamUrl, {
  EXPECT_THROW(CALL_YES(kChannelAddInjectStreamUrl, R"({"channelId":"0"})"),
               std::invalid_argument);
  CALL_YES(kChannelAddInjectStreamUrl, R"({"channelId":"0", "url":" "})");
})

IRIS_CHANNEL_TEST(kChannelRemoveInjectStreamUrl, {
  EXPECT_THROW(CALL_YES(kChannelRemoveInjectStreamUrl, R"({"channelId":"0"})"),
               std::invalid_argument);
  CALL_YES(kChannelRemoveInjectStreamUrl, R"({"channelId":"0", "url":" "})");
})

IRIS_CHANNEL_TEST(kChannelStartChannelMediaRelay, {
  EXPECT_THROW(CALL_YES(kChannelStartChannelMediaRelay, R"({"channelId":"0"})"),
               std::invalid_argument);

  JoinChannel();
  CALL_YES(kChannelStartChannelMediaRelay,
           R"({
                    "channelId":"0",
                    "configuration":{
                      "srcInfo":{"channelName":"0", "token":null, "uid":0},
                      "destInfos":[{"channelName":"0", "token":null, "uid":0}]
                    }
                  })");
  EXPECT_TRUE(event_handler_->WaitForEvent("onChannelMediaRelayStateChanged"));
})

IRIS_CHANNEL_TEST(kChannelUpdateChannelMediaRelay, {
  EXPECT_THROW(
      CALL_YES(kChannelUpdateChannelMediaRelay, R"({"channelId":"0"})"),
      std::invalid_argument);

  CALL_YES(kChannelUpdateChannelMediaRelay,
           R"({
                    "channelId":"0",
                    "configuration":{
                      "srcInfo":{"channelName":"0", "token":null, "uid":0},
                      "destInfos":[{"channelName":"0", "token":null, "uid":0}]
                    }
                  })");
})

IRIS_CHANNEL_TEST(kChannelStopChannelMediaRelay, {
  CALL_YES(kChannelStopChannelMediaRelay, R"({"channelId":"0"})");
})

IRIS_CHANNEL_TEST(kChannelGetConnectionState, {
  CALL_YES(kChannelGetConnectionState, R"({"channelId":"0"})");
})

IRIS_CHANNEL_TEST(kChannelEnableRemoteSuperResolution, {
  EXPECT_THROW(CALL_YES(kChannelEnableRemoteSuperResolution,
                        R"({"channelId":"0", "userId":0})"),
               std::invalid_argument);
  CALL_NO(kChannelEnableRemoteSuperResolution,
          R"({"channelId":"0", "userId":0, "enable":true})");
})
}// namespace test
}// namespace rtc
}// namespace iris
}// namespace agora
