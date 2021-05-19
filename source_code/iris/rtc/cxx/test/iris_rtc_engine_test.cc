//
// Created by LXH on 2021/1/22.
//

#include "iris_rtc_engine.h"
#include "iris_test_utils.h"
#include "gtest/gtest.h"

#define CALL_YES(api_type, params)                                             \
  EXPECT_LE(0, engine_->CallApi(api_type, params, result_))

#define CALL_NO(api_type, params)                                              \
  EXPECT_GT(0, engine_->CallApi(api_type, params, result_))

#define CALL_P_YES(api_type, params, ptr)                                      \
  EXPECT_LE(0, engine_->CallApi(api_type, params, result_, ptr))

#define CALL_P_NO(api_type, params, ptr)                                       \
  EXPECT_GT(0, engine_->CallApi(api_type, params, result_, ptr))

namespace agora {
namespace iris {
namespace rtc {
namespace test {
class IrisRtcEngineEventHandler : public IrisEventHandler {
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

class IrisRtcEngineTester : public testing::Test {
 public:
  IrisRtcEngineTester() : engine_(nullptr), event_handler_(nullptr) {}

  void JoinChannel() {
    EXPECT_EQ(
        0,
        engine_->CallApi(
            ApiTypeEngine::kEngineJoinChannel,
            R"({"token":null, "channelId":"123", "info":"abc", "uid":123})",
            result_));
    EXPECT_TRUE(event_handler_->WaitForEvent("onJoinChannelSuccess"));
  }

 protected:
  void SetUp() override {
    engine_ = new IrisRtcEngine;
    event_handler_ = new IrisRtcEngineEventHandler;
    engine_->SetEventHandler(event_handler_);
    auto params = R"({"context":{"appId":")" + std::string(kTestAppId)
        + R"(", "areaCode":1}})";
    EXPECT_EQ(0,
              engine_->CallApi(ApiTypeEngine::kEngineInitialize, params.c_str(),
                               result_));
    EXPECT_EQ(
        0,
        engine_->CallApi(ApiTypeEngine::kEngineEnableAudio, R"({})", result_));
    EXPECT_EQ(
        0,
        engine_->CallApi(ApiTypeEngine::kEngineEnableVideo, R"({})", result_));
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
  IrisRtcEngineEventHandler *event_handler_;
  char *result_ = new char[kBasicResultLength];
};

TEST_F(IrisRtcEngineTester, SetAppType) {
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetAppType,
                             R"({"appType":14})", result_));
}

TEST_F(IrisRtcEngineTester, JoinChannel) {
  JoinChannel();
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineGetUserInfoByUid,
                             R"({"uid":123})", result_));
}

TEST_F(IrisRtcEngineTester, SwitchChannel) {
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetChannelProfile,
                             R"({"profile": 1})", result_));
  JoinChannel();
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSwitchChannel,
                             R"({"token":null, "channelId":"321"})", result_));
  EXPECT_TRUE(event_handler_->WaitForEvent("onLeaveChannel"));
  EXPECT_TRUE(event_handler_->WaitForEvent("onJoinChannelSuccess"));
}

TEST_F(IrisRtcEngineTester, SetChannelProfile) {
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetChannelProfile,
                             R"({"profile":0})", result_));
}

TEST_F(IrisRtcEngineTester, SetClientRole) {
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetChannelProfile,
                             R"({"profile":1})", result_));
  JoinChannel();
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetClientRole,
                             R"({"role":1})", result_));
  EXPECT_TRUE(event_handler_->WaitForEvent("onClientRoleChanged"));
}

TEST_F(IrisRtcEngineTester, LeaveChannel) {
  JoinChannel();
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineLeaveChannel, R"({})", result_));
  EXPECT_TRUE(event_handler_->WaitForEvent("onLeaveChannel"));
}

TEST_F(IrisRtcEngineTester, RegisterLocalUserAccount) {
  auto param = R"({"appId":")" + std::string(kTestAppId)
      + R"(", "userAccount":"Jackie"})";
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineRegisterLocalUserAccount,
                             param.c_str(), result_));
  EXPECT_TRUE(event_handler_->WaitForEvent("onLocalUserRegistered"));
}

TEST_F(IrisRtcEngineTester, JoinChannelWithUserAccount) {
  EXPECT_EQ(0,
            engine_->CallApi(
                ApiTypeEngine::kEngineJoinChannelWithUserAccount,
                R"({"token":null, "channelId":"123", "userAccount":"Jackie"})",
                result_));
  EXPECT_TRUE(event_handler_->WaitForEvent("onJoinChannelSuccess"));
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineGetUserInfoByUserAccount,
                             R"({"userAccount":"Jackie"})", result_));
  printf("%s\n", result_);
}

TEST_F(IrisRtcEngineTester, EchoTest) {
  // StartEchoTest (Deprecated)
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineStartEchoTest, R"({})", result_));
  // StopEchoTest
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineStopEchoTest, R"({})", result_));
  // StartEchoTest
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineStartEchoTest,
                             R"({"intervalInSeconds":2})", result_));
  // StopEchoTest
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineStopEchoTest, R"({})", result_));
}

TEST_F(IrisRtcEngineTester, VideoRelatedApis) {
  // DisableVideo
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineDisableVideo, R"({})", result_));
  // EnableVideo
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineStopEchoTest, R"({})", result_));
  // muteLocalVideoStream
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineMuteLocalVideoStream,
                             R"({"mute":true})", result_));
  // enableLocalVideo
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineEnableLocalVideo,
                             R"({"enabled":true})", result_));
  // muteAllRemoteVideoStreams
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineMuteAllRemoteVideoStreams,
                             R"({"mute":true})", result_));
  // setDefaultMuteAllRemoteVideoStreams
  EXPECT_EQ(0,
            engine_->CallApi(
                ApiTypeEngine::kEngineSetDefaultMuteAllRemoteVideoStreams,
                R"({"mute":false})", result_));
  // muteRemoteVideoStream
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineMuteRemoteVideoStream,
                             R"({"userId":123, "mute":true})", result_));
  // setRemoteVideoStreamType
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetRemoteVideoStreamType,
                             R"({"userId":123, "streamType":0})", result_));
  // setRemoteDefaultVideoStreamType
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineSetRemoteDefaultVideoStreamType,
                       R"({"streamType":0})", result_));
}

TEST_F(IrisRtcEngineTester, SetVideoProfile) {
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetVideoProfile,
                             R"({"profile":1060, "swapWidthAndHeight":false})",
                             result_));
}

TEST_F(IrisRtcEngineTester, SetVideoEncoderConfiguration) {
  auto params = R"({
                  "config":{
                    "dimensions":{"width":640, "height":360},
                    "minFrameRate":15,
                    "bitrate":600,
                    "minBitrate":400,
                    "frameRate":30,
                    "orientationMode":0,
                    "degradationPreference":0,
                    "mirrorMode":0
                  }
                })";
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetVideoEncoderConfiguration,
                             params, result_));
}

TEST_F(IrisRtcEngineTester, SetCameraCapturerConfiguration) {
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineSetCameraCapturerConfiguration,
                       R"({"config":{"preference":0, "cameraDirection":0}})",
                       result_));
}

TEST_F(IrisRtcEngineTester, SetupLocalVideo) {
  EXPECT_EQ(
      0,
      engine_->CallApi(
          ApiTypeEngine::kEngineSetupLocalVideo,
          R"({"canvas":{"view":0, "renderMode":1, "channelId":"", "uid":0, "mirrorMode":1}})",
          result_));
}

TEST_F(IrisRtcEngineTester, SetupRemoteVideo) {
  JoinChannel();
  EXPECT_EQ(
      0,
      engine_->CallApi(
          ApiTypeEngine::kEngineSetupRemoteVideo,
          R"({"canvas":{"view":0, "renderMode":1, "channelId":"", "uid":1, "mirrorMode":1}})",
          result_));
}

TEST_F(IrisRtcEngineTester, StartStopPreview) {
  // StartPreview
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineStartPreview, R"({})", result_));
  // StopPreview
  EXPECT_EQ(
      0, engine_->CallApi(ApiTypeEngine::kEngineStopPreview, R"({})", result_));
}

TEST_F(IrisRtcEngineTester, SetRemoteUserPriority) {
  JoinChannel();
  // SetRemoteUserPriority
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetRemoteUserPriority,
                             R"({"uid":123, "userPriority":50})", result_));
}

TEST_F(IrisRtcEngineTester, AudioRelatedApis) {
  // DisableAudio
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineDisableAudio, R"({})", result_));
  // EnableAudio
  EXPECT_EQ(
      0, engine_->CallApi(ApiTypeEngine::kEngineEnableAudio, R"({})", result_));
  // EnableLocalAudio
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineEnableLocalAudio,
                             R"({"enabled":false})", result_));
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineEnableLocalAudio,
                             R"({"enabled":true})", result_));
  // SetAudioProfile
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetAudioProfile,
                             R"({"profile":2, "scenario":3})", result_));
  // muteLocalAudioStream
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineMuteLocalAudioStream,
                             R"({"mute":true})", result_));
  // muteAllRemoteAudioStreams
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineMuteAllRemoteAudioStreams,
                             R"({"mute":true})", result_));
  // setDefaultMuteAllRemoteAudioStreams
  EXPECT_EQ(0,
            engine_->CallApi(
                ApiTypeEngine::kEngineSetDefaultMuteAllRemoteAudioStreams,
                R"({"mute":false})", result_));

  JoinChannel();
  // adjustUserPlaybackSignalVolume
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineAdjustUserPlaybackSignalVolume,
                       R"({"uid":123, "volume":100})", result_));
  // muteRemoteAudioStream
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineMuteRemoteAudioStream,
                             R"({"userId":123, "mute":true})", result_));
  // enableAudioVolumeIndication
  EXPECT_EQ(0,
            engine_->CallApi(
                ApiTypeEngine::kEngineEnableAudioVolumeIndication,
                R"({"interval":200, "smooth":3, "report_vad":true})", result_));
  EXPECT_TRUE(event_handler_->WaitForEvent("onAudioVolumeIndication"));
  // startAudioRecording (Deprecated)
  EXPECT_EQ(0,
            engine_->CallApi(
                ApiTypeEngine::kEngineStartAudioRecording,
                R"({"filePath":"testRecording1.wav", "quality":0})", result_));
  // stopAudioRecording
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineStopAudioRecording, R"({})",
                             result_));
  // startAudioRecording
  EXPECT_EQ(
      0,
      engine_->CallApi(
          ApiTypeEngine::kEngineStartAudioRecording,
          R"({"filePath":"testRecording2.wav", "sampleRate":32, "quality":0})",
          result_));
  // stopAudioRecording
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineStopAudioRecording, R"({})",
                             result_));
  // startAudioMixing
  EXPECT_EQ(
      0,
      engine_->CallApi(
          ApiTypeEngine::kEngineStartAudioMixing,
          R"({"filePath":"testRecording1.wav", "loopback":true, "replace":true, "cycle":1})",
          result_));
  EXPECT_TRUE(event_handler_->WaitForEvent("onAudioMixingFinished"));
  EXPECT_TRUE(event_handler_->WaitForEvent("onAudioMixingStateChanged"));
  // pauseAudioMixing
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEnginePauseAudioMixing, R"({})",
                             result_));
  // resumeAudioMixing
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineResumeAudioMixing, R"({})",
                             result_));
  // setHighQualityAudioParameters (Deprecated)
  EXPECT_EQ(0,
            engine_->CallApi(
                ApiTypeEngine::kEngineSetHighQualityAudioParameters,
                R"({"fullband":true, "stereo":true, "fullBitrate":true})",
                result_));
  // adjustAudioMixingVolume
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineAdjustAudioMixingVolume,
                             R"({"volume":50})", result_));
  // adjustAudioMixingPlayoutVolume
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineAdjustAudioMixingPlayoutVolume,
                       R"({"volume":50})", result_));
  // getAudioMixingPlayoutVolume
  EXPECT_LT(0,
            engine_->CallApi(ApiTypeEngine::kEngineGetAudioMixingPlayoutVolume,
                             R"({})", result_));
  // adjustAudioMixingPublishVolume
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineAdjustAudioMixingPublishVolume,
                       R"({"volume":50})", result_));
  // getAudioMixingCurrentPosition
  EXPECT_LT(0,
            engine_->CallApi(ApiTypeEngine::kEngineGetAudioMixingPublishVolume,
                             R"({})", result_));
  // getAudioMixingDuration
  EXPECT_LE(0,
            engine_->CallApi(ApiTypeEngine::kEngineGetAudioMixingDuration,
                             R"({})", result_));
  // getAudioMixingCurrentPosition
  EXPECT_LE(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineGetAudioMixingCurrentPosition,
                       R"({})", result_));
  // setAudioMixingPosition
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetAudioMixingPosition,
                             R"({"pos":10})", result_));
  // setAudioMixingPitch
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetAudioMixingPitch,
                             R"({"pitch":12})", result_));
  // stopAudioMixing
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineStopAudioMixing, R"({})",
                             result_));
  // playEffect
  EXPECT_EQ(
      0,
      engine_->CallApi(
          ApiTypeEngine::kEnginePlayEffect,
          R"({"soundId":123, "filePath":"testRecording1.wav", "loopCount":0,
                "pitch":0.5, "pan":0.1, "gain":50, "publish":false})",
          result_));
  EXPECT_EQ(
      0,
      engine_->CallApi(
          ApiTypeEngine::kEnginePlayEffect,
          R"({"soundId":234, "filePath":"testRecording2.wav", "loopCount":0,
                "pitch":0.5, "pan":0.1, "gain":50, "publish":false})",
          result_));
  // getEffectsVolume
  EXPECT_LT(0,
            engine_->CallApi(ApiTypeEngine::kEngineGetEffectsVolume, R"({})",
                             result_));
  // setEffectsVolume
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetEffectsVolume,
                             R"({"volume":100})", result_));
  // setVolumeOfEffect
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetVolumeOfEffect,
                             R"({"soundId":123, "volume":100})", result_));
  // stopEffect
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineStopEffect,
                             R"({"soundId":123})", result_));
  // preloadEffect
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEnginePreloadEffect,
                       R"({"soundId":123, "filePath":"testRecording1.wav"})",
                       result_));
  // unloadEffect
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineUnloadEffect,
                             R"({"soundId":123})", result_));
  // pauseEffect
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEnginePauseEffect,
                             R"({"soundId":123})", result_));
  // pauseAllEffects
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEnginePauseAllEffects, R"({})",
                             result_));
  // resumeEffect
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineResumeEffect,
                             R"({"soundId":123})", result_));
  // resumeAllEffects
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineResumeAllEffects, R"({})",
                             result_));
  // stopAllEffects
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineStopAllEffects, R"({})", result_));
  // enableSoundPositionIndication
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineStopAllEffects,
                             R"({"enabled":true})", result_));
  // setRemoteVoicePosition
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetRemoteVoicePosition,
                             R"({"uid":123, "pan":0.9, "gain":90.0})",
                             result_));
  // setLocalVoicePitch
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineStopAllEffects,
                             R"({"pitch":1.5})", result_));
  // setLocalVoiceEqualization
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetLocalVoiceEqualization,
                             R"({"bandFrequency":0, "bandGain":10})", result_));
  // setLocalVoiceReverb
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetLocalVoiceReverb,
                             R"({"reverbKey":0, "value":10})", result_));
  // setLocalVoiceChanger (Deprecated)
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetLocalVoiceChanger,
                             R"({"voiceChanger":0})", result_));
  // setLocalVoiceReverbPreset() (Deprecated)
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetLocalVoiceReverbPreset,
                             R"({"reverbPreset":0})", result_));
  // SetAudioProfile
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetAudioProfile,
                             R"({"profile":2, "scenario":3})", result_));
  // setAudioEffectPreset
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetAudioEffectPreset,
                             R"({"preset":33622016})", result_));
  // setAudioEffectParameters
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetAudioEffectParameters,
                             R"({"preset":33816832, "param1":1, "param2":1})",
                             result_));
  // setVoiceBeautifierPreset
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetVoiceBeautifierPreset,
                             R"({"preset":0})", result_));
  // setExternalAudioSource
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineSetExternalAudioSource,
                       R"({"enabled":true, "sampleRate":44100, "channels":1})",
                       result_));
  // setExternalAudioSink
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineSetExternalAudioSink,
                       R"({"enabled":true, "sampleRate":44100, "channels":1})",
                       result_));
  // setRecordingAudioFrameParameters
  EXPECT_EQ(
      0,
      engine_->CallApi(
          ApiTypeEngine::kEngineSetRecordingAudioFrameParameters,
          R"({"sampleRate":44100, "channel":1, "mode":0, "samplesPerCall":1024})",
          result_));
  // setPlaybackAudioFrameParameters
  EXPECT_EQ(
      0,
      engine_->CallApi(
          ApiTypeEngine::kEngineSetRecordingAudioFrameParameters,
          R"({"sampleRate":44100, "channel":1, "mode":0, "samplesPerCall":1024})",
          result_));
  // setMixedAudioFrameParameters
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetMixedAudioFrameParameters,
                             R"({"sampleRate":44100, "samplesPerCall":1024})",
                             result_));
  // adjustRecordingSignalVolume
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineAdjustRecordingSignalVolume,
                             R"({"volume":100})", result_));
  // adjustPlaybackSignalVolume
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineAdjustPlaybackSignalVolume,
                             R"({"volume":100})", result_));
  // setLocalPublishFallbackOption
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineSetLocalPublishFallbackOption,
                       R"({"option":2})", result_));
  // setRemoteSubscribeFallbackOption
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineSetRemoteSubscribeFallbackOption,
                       R"({"option":2})", result_));
  // enableLoopbackRecording
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineEnableLoopBackRecording,
                             R"({"enabled":true, "deviceName":"null"})",
                             result_));
}

TEST_F(IrisRtcEngineTester, LogRelatedApis) {
  // setLogFileSize (Deprecated)
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetLogFileSize,
                             R"({"fileSizeInKBytes":1024})", result_));
  // setLogFile (Deprecated)
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetLogFile,
                             R"({"filePath":"./"})", result_));
  // setLogFilter (Deprecated)
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetLogFilter,
                             R"({"filter":0})", result_));
}

TEST_F(IrisRtcEngineTester, SetRenderMode) {
  // setLocalRenderMode (Deprecated)
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetLocalRenderMode,
                             R"({"renderMode":1})", result_));
  // setLocalRenderMode
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetLocalRenderMode,
                             R"({"renderMode":1, "mirrorMode":0})", result_));
  // setRemoteRenderMode (Deprecated)
  EXPECT_EQ(0,
            engine_->CallApi(
                ApiTypeEngine::kEngineSetRemoteRenderMode,
                R"({"userId":123, "renderMode":0, "mirrorMode":0})", result_));
  // setRemoteRenderMode
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetRemoteRenderMode,
                             R"({"userId":123, "renderMode":0})", result_));
}

TEST_F(IrisRtcEngineTester, SetLocalVideoMirrorMode) {
  // setLocalVideoMirrorMode (Deprecated)
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetLocalVideoMirrorMode,
                             R"({"mirrorMode":0})", result_));
}

TEST_F(IrisRtcEngineTester, EnableDualStreamMode) {
  // enableDualStreamMode
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetChannelProfile,
                             R"({"profile":1})", result_));
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineEnableDualStreamMode,
                             R"({"enabled":true})", result_));
}

TEST_F(IrisRtcEngineTester, EnableWebSdkInteroperability) {
  // enableWebSdkInteroperability
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetChannelProfile,
                             R"({"profile":1})", result_));
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineEnableWebSdkInteroperability,
                             R"({"enabled":true})", result_));
}

TEST_F(IrisRtcEngineTester, SetVideoQualityParameters) {
  // setVideoQualityParameters
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetChannelProfile,
                             R"({"profile":1})", result_));
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetVideoQualityParameters,
                             R"({"preferFrameRateOverImageQuality":true})",
                             result_));
}

TEST_F(IrisRtcEngineTester, ScreenCapture) {
  JoinChannel();
  {
    auto params = R"({
                    "displayId":1,
                    "regionRect":{
                      "x":10, "y":10, "width":100, "height":50
                    },
                    "captureParams":{
                      "dimensions":{"width":640, "height":480},
                      "frameRate":5,
                      "bitrate":0,
                      "captureMouseCursor":true,
                      "windowFocus":false,
                      "excludeWindowList":[],
                      "excludeWindowCount":0
                    }
                  })";
    EXPECT_EQ(
        0,
        engine_->CallApi(ApiTypeEngine::kEngineStartScreenCaptureByDisplayId,
                         params, result_));
  }
  {
    auto params = R"({
                    "windowId":123,
                    "regionRect":{
                      "x":10, "y":10, "width":100, "height":50
                    },
                    "captureParams":{
                      "dimensions":{"width":640, "height":480},
                      "frameRate":5,
                      "bitrate":0,
                      "captureMouseCursor":true,
                      "windowFocus":false,
                      "excludeWindowList":[],
                      "excludeWindowCount":0
                    }
                  })";
    EXPECT_EQ(
        0,
        engine_->CallApi(ApiTypeEngine::kEngineStartScreenCaptureByWindowId,
                         params, result_));
  }
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetScreenCaptureContentHint,
                             R"({"contentHint":0})", result_));
  {
    auto params = R"({
                  "captureParams":{
                    "dimensions":{"width":640, "height":480},
                    "frameRate":5,
                    "bitrate":0,
                    "captureMouseCursor":true,
                    "windowFocus":false,
                    "excludeWindowList":[],
                    "excludeWindowCount":0
                  }
                })";
    EXPECT_EQ(
        0,
        engine_->CallApi(ApiTypeEngine::kEngineUpdateScreenCaptureParameters,
                         params, result_));
  }
  EXPECT_EQ(0,
            engine_->CallApi(
                ApiTypeEngine::kEngineUpdateScreenCaptureRegion,
                R"({"regionRect":{"x":10, "y":10, "width":100, "height":50}})",
                result_));
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineStopScreenCapture, R"({})",
                             result_));
  EXPECT_EQ(
      0,
      engine_->CallApi(
          ApiTypeEngine::kEngineStartScreenCapture,
          R"({"windowId":0, "captureFreq":15, "rect":{"top":0, "left":0, "bottom":0, "right":0}, "bitrate":10})",
          result_));
}

TEST_F(IrisRtcEngineTester, GetInfo) {
  EXPECT_EQ(
      0, engine_->CallApi(ApiTypeEngine::kEngineGetVersion, R"({})", result_));
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineGetErrorDescription,
                             R"({"code":10})", result_));
  EXPECT_LT(0,
            engine_->CallApi(ApiTypeEngine::kEngineGetConnectionState, R"({})",
                             result_));
}

TEST_F(IrisRtcEngineTester, Evaluation) {
  JoinChannel();
  EXPECT_EQ(
      0, engine_->CallApi(ApiTypeEngine::kEngineGetCallId, R"({})", result_));
  {
    auto param = R"({"callId":")" + std::string(result_)
        + R"(", "rating":5, "description":"Good job!"})";
    EXPECT_EQ(
        0,
        engine_->CallApi(ApiTypeEngine::kEngineRate, param.c_str(), result_));
  }
  {
    auto param = R"({"callId":")" + std::string(result_)
        + R"(", "description":"Good job!"})";
    EXPECT_EQ(0,
              engine_->CallApi(ApiTypeEngine::kEngineComplain, param.c_str(),
                               result_));
  }
}

TEST_F(IrisRtcEngineTester, LastmileTest) {
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineEnableLastMileTest, R"({})",
                             result_));
  EXPECT_TRUE(event_handler_->WaitForEvent("onLastmileQuality"));
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineDisableLastMileTest, R"({})",
                             result_));
}

TEST_F(IrisRtcEngineTester, LastMileProbeTest) {
  EXPECT_EQ(
      0,
      engine_->CallApi(
          ApiTypeEngine::kEngineStartLastMileProbeTest,
          R"({"config":{"probeUplink":true, "probeDownlink":true, "expectedUplinkBitrate":100000, "expectedDownlinkBitrate":100000}})",
          result_));
  EXPECT_TRUE(event_handler_->WaitForEvent("onLastmileProbeResult"));
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineStopLastMileProbeTest,
                             R"({})", result_));
}

TEST_F(IrisRtcEngineTester, Encryption) {
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetEncryptionSecret,
                             R"({"secret":"Sit secret."})", result_));
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetEncryptionMode,
                             R"({"encryptionMode":"aes-128-xts"})", result_));
  EXPECT_EQ(
      0,
      engine_->CallApi(
          ApiTypeEngine::kEngineEnableEncryption,
          R"({"enabled":true, "config":{"encryptionMode":1, "encryptionKey":"key key"}})",
          result_));
}

TEST_F(IrisRtcEngineTester, DataStream) {
  EXPECT_LT(0,
            engine_->CallApi(ApiTypeEngine::kEngineCreateDataStream,
                             R"({"reliable":true, "ordered":true})", result_));
  EXPECT_GT(0,
            engine_->CallApi(ApiTypeEngine::kEngineSendStreamMessage,
                             R"({"streamId":123, "length":1024})", result_,
                             nullptr));
}

TEST_F(IrisRtcEngineTester, AddPublishStreamUrl) {
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetChannelProfile,
                             R"({"profile":1})", result_));
  EXPECT_EQ(0,
            engine_->CallApi(
                ApiTypeEngine::kEngineAddPublishStreamUrl,
                R"({"url":"https://www.agora.io", "transcodingEnabled":true})",
                result_));
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineRemovePublishStreamUrl,
                             R"({"url":"https://www.agora.io"})", result_));
}

TEST_F(IrisRtcEngineTester, AddVideoWatermark) {
  EXPECT_EQ(
      0,
      engine_->CallApi(
          ApiTypeEngine::kEngineAddVideoWaterMark,
          R"({"watermark":{"url":"https://www.agora.io", "x":0, "y":0, "width":10, "height":10}})",
          result_));
  {
    auto params = R"({
                    "watermarkUrl":"https://www.agora.io",
                    "options":{
                      "visibleInPreview":true,
                      "positionInLandscapeMode":{"x":0, "y":0, "width":10, "height":10},
                      "positionInPortraitMode":{"x":0, "y":0, "width":10, "height":10}
                    }
                  })";
    EXPECT_EQ(0,
              engine_->CallApi(ApiTypeEngine::kEngineAddVideoWaterMark, params,
                               result_));
  }
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineClearVideoWaterMarks,
                             R"({})", result_));
}

TEST_F(IrisRtcEngineTester, SetBeautyEffectOptions) {
  EXPECT_EQ(
      0,
      engine_->CallApi(
          ApiTypeEngine::kEngineSetBeautyEffectOptions,
          R"({"enabled":true, "options":{"lighteningContrastLevel":0, "lighteningLevel":0.0, "smoothnessLevel":0.0, "rednessLevel":0.0}})",
          result_));
}

TEST_F(IrisRtcEngineTester, addInjectStreamUrl) {
  EXPECT_EQ(
      0,
      engine_->CallApi(
          ApiTypeEngine::kEngineAddInjectStreamUrl,
          R"({"url":"https://www.agora.io", "config":{"width":0, "height":0, "videoGop":30, "videoFramerate":15, "videoBitrate":400, "audioSampleRate":48000, "audioBitrate":48, "audioChannels":1}})",
          result_));
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineRemoveInjectStreamUrl,
                             R"({"url":"https://www.agora.io"})", result_));
}

TEST_F(IrisRtcEngineTester, ChannelMediaRelay) {
  JoinChannel();
  {
    auto params = R"({
                    "configuration":{
                      "srcInfo":{"channelName":"123", "token":null, "uid":0},
                      "destInfos":[
                        {"channelName":"456", "token":null, "uid":0},
                        {"channelName":"789", "token":null, "uid":0}
                      ]
                    }
                  })";
    EXPECT_EQ(0,
              engine_->CallApi(ApiTypeEngine::kEngineStartChannelMediaRelay,
                               params, result_));
  }
  {
    auto params = R"({
                    "configuration":{
                      "srcInfo":{"channelName":"123", "token":null, "uid":0},
                      "destInfos":[
                        {"channelName":"456", "token":null, "uid":0},
                        {"channelName":"789", "token":null, "uid":0}
                      ]
                    }
                  })";
    EXPECT_EQ(0,
              engine_->CallApi(ApiTypeEngine::kEngineUpdateChannelMediaRelay,
                               params, result_));
  }
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineStopChannelMediaRelay,
                             R"({})", result_));
}

TEST_F(IrisRtcEngineTester, SendCustomReportMessage) {
  EXPECT_EQ(
      0,
      engine_->CallApi(
          ApiTypeEngine::kEngineSendCustomReportMessage,
          R"({"id":"123", "category":"abc", "event":"onJoinChannelSuccess", "label":"a", "value":1})",
          result_));
}

TEST_F(IrisRtcEngineTester, RegisterMediaMetadataObserver) {
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineRegisterMediaMetadataObserver,
                       R"({"type":0})", result_));
  EXPECT_EQ(
      0,
      engine_->CallApi(ApiTypeEngine::kEngineUnRegisterMediaMetadataObserver,
                       R"({"type":0})", result_));
}

TEST_F(IrisRtcEngineTester, SetParameters) {
  EXPECT_EQ(0,
            engine_->CallApi(ApiTypeEngine::kEngineSetParameters,
                             R"({"parameters":"{}"})", result_));
}
}// namespace test
}// namespace rtc
}// namespace iris
}// namespace agora
