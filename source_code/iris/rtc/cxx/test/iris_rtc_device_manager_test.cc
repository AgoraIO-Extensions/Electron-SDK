//
// Created by LXH on 2021/1/22.
//

#include "iris_rtc_engine.h"
#include "iris_test_utils.h"
#include "gtest/gtest.h"

#define CALL_YES(api_type, params)                                             \
  EXPECT_LE(0, device_manager_->CallApi(api_type, params, result_))

#define CALL_NO(api_type, params)                                              \
  EXPECT_GT(0, device_manager_->CallApi(api_type, params, result_))

#define CALL_P_YES(api_type, params, ptr)                                      \
  EXPECT_LE(0, device_manager_->CallApi(api_type, params, result_, ptr))

#define CALL_P_NO(api_type, params, ptr)                                       \
  EXPECT_GT(0, device_manager_->CallApi(api_type, params, result_, ptr))

namespace agora {
namespace iris {
namespace rtc {
namespace test {
class IrisRtcDeviceManagerTest : public testing::Test {
 public:
  IrisRtcDeviceManagerTest() : engine_(nullptr), device_manager_(nullptr) {}

 protected:
  void SetUp() override {
    engine_ = new IrisRtcEngine;
    device_manager_ = engine_->device_manager();
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
    delete[] result_;
  }

 protected:
  IrisRtcEngine *engine_;
  IrisRtcDeviceManager *device_manager_;
  char *result_ = new char[kMaxResultLength];
};

TEST_F(IrisRtcDeviceManagerTest, AudioDeviceManager) {
  EXPECT_EQ(0,
            device_manager_->CallApi(kGetCurrentAudioPlaybackDeviceInfo,
                                     R"({})", result_));
  printf("%s\n", result_);
  EXPECT_EQ(0,
            device_manager_->CallApi(kGetCurrentAudioRecordingDeviceInfo,
                                     R"({})", result_));
  printf("%s\n", result_);
  EXPECT_EQ(0,
            device_manager_->CallApi(kSetCurrentAudioPlaybackDeviceId,
                                     R"({"deviceId": "1"})", result_));
  EXPECT_EQ(0,
            device_manager_->CallApi(kSetCurrentAudioRecordingDeviceId,
                                     R"({"deviceId": "2"})", result_));
  EXPECT_EQ(0,
            device_manager_->CallApi(
                kStartAudioPlaybackDeviceTest,
                R"({"testAudioFilePath": "audioPlaybackTest.wav"})", result_));
  EXPECT_EQ(
      0,
      device_manager_->CallApi(kStopAudioPlaybackDeviceTest, R"({})", result_));
  EXPECT_EQ(0,
            device_manager_->CallApi(kSetAudioPlaybackDeviceVolume,
                                     R"({"volume": 50})", result_));
  EXPECT_EQ(50,
            device_manager_->CallApi(kGetAudioPlaybackDeviceVolume, R"({})",
                                     result_));
  printf("%s\n", result_);
  EXPECT_EQ(0,
            device_manager_->CallApi(kSetAudioRecordingDeviceVolume,
                                     R"({"volume": 50})", result_));
  EXPECT_LT(0,
            device_manager_->CallApi(kGetAudioRecordingDeviceVolume, R"({})",
                                     result_));
  printf("%s\n", result_);
  EXPECT_EQ(0,
            device_manager_->CallApi(kSetAudioPlaybackDeviceMute,
                                     R"({"mute": true})", result_));
  EXPECT_TRUE(
      device_manager_->CallApi(kGetAudioPlaybackDeviceMute, R"({})", result_));
  printf("%s\n", result_);
  EXPECT_EQ(0,
            device_manager_->CallApi(kSetAudioRecordingDeviceMute,
                                     R"({"mute": true})", result_));
  EXPECT_NO_THROW(
      device_manager_->CallApi(kGetAudioRecordingDeviceMute, R"({})", result_));
  printf("%s\n", result_);
  EXPECT_EQ(0,
            device_manager_->CallApi(kStartAudioRecordingDeviceTest,
                                     R"({"indicationInterval": 200})",
                                     result_));
  EXPECT_EQ(0,
            device_manager_->CallApi(kStopAudioRecordingDeviceTest, R"({})",
                                     result_));
  EXPECT_EQ(0,
            device_manager_->CallApi(kGetCurrentAudioPlaybackDeviceId, R"({})",
                                     result_));
  printf("%s\n", result_);
  EXPECT_EQ(0,
            device_manager_->CallApi(kGetCurrentAudioPlaybackDeviceInfo,
                                     R"({})", result_));
  printf("%s\n", result_);
  EXPECT_EQ(0,
            device_manager_->CallApi(kGetCurrentAudioRecordingDeviceInfo,
                                     R"({})", result_));
  printf("%s\n", result_);
  EXPECT_EQ(0,
            device_manager_->CallApi(kStartAudioDeviceLoopbackTest,
                                     R"({"indicationInterval": 200})",
                                     result_));
  EXPECT_EQ(
      0,
      device_manager_->CallApi(kStopAudioDeviceLoopbackTest, R"({})", result_));
}

TEST_F(IrisRtcDeviceManagerTest, VideoDeviceManager) {
  EXPECT_EQ(
      0, device_manager_->CallApi(kGetCurrentVideoDeviceId, R"({})", result_));
  printf("%s\n", result_);
  EXPECT_EQ(0,
            device_manager_->CallApi(kSetCurrentVideoDeviceId,
                                     R"({"deviceId": "123"})", result_));
  EXPECT_EQ(0,
            device_manager_->CallApi(kStartVideoDeviceTest, R"({"hwnd":123})",
                                     result_));
  EXPECT_EQ(0,
            device_manager_->CallApi(kStopVideoDeviceTest, R"({})", result_));
}
}// namespace test
}// namespace rtc
}// namespace iris
}// namespace agora
