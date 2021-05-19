//
// Created by LXH on 2021/1/18.
//

#include "../../../third_party/agora/iris/include/iris_json_utils.h"
#include "internal/iris_rtc_json_decoder.h"
#include "internal/iris_rtc_json_encoder.h"
#include "internal/iris_rtc_struct_extensions.h"
#include "gtest/gtest.h"

namespace agora {
using namespace rtc;
using namespace media;

namespace iris {
namespace rtc {
namespace test {
using AgoraRectangle = agora::rtc::Rectangle;
using AudioFrame = IAudioFrameObserver::AudioFrame;
using VideoFrame = IVideoFrameObserver::VideoFrame;
using Metadata = IMetadataObserver::Metadata;
using namespace rapidjson;

class IrisRtcJsonTest : public testing::Test {
 public:
  template<class T>
  void struct_to_json(T t, std::string &json) {
    Document document;
    Value value(kObjectType);
    JsonEncode(document, value, t);
    json = ToJsonString(value);
  }

  template<class T>
  void json_to_struct(T &t, const char *json) {
    Document document;
    document.Parse(json);
    JsonDecode(document, t);
  }
};

#define JSON_TEST(test_suite_name)                                             \
  TEST_F(IrisRtcJsonTest, test_suite_name) {                                   \
    test_suite_name obj{};                                                     \
    std::string json;                                                          \
    struct_to_json(obj, json);                                                 \
    std::cout << json << std::endl;                                            \
    EXPECT_NO_THROW(json_to_struct(obj, json.c_str()));                        \
    std::cout << obj << std::endl;                                             \
  }

JSON_TEST(AudioFrame)

JSON_TEST(VideoFrame)

JSON_TEST(ExternalVideoRenerContext)

JSON_TEST(ExternalVideoFrame)

JSON_TEST(ChannelMediaOptions)

JSON_TEST(LastmileProbeOneWayResult)

JSON_TEST(LastmileProbeConfig)

JSON_TEST(AudioVolumeInfo)

JSON_TEST(ClientRoleOptions)

JSON_TEST(RtcStats)

JSON_TEST(LocalVideoStats)

JSON_TEST(RemoteVideoStats)

JSON_TEST(LocalAudioStats)

JSON_TEST(RemoteAudioStats)

JSON_TEST(VideoDimensions)

JSON_TEST(VideoEncoderConfiguration)

JSON_TEST(TranscodingUser)

JSON_TEST(RtcImage)

JSON_TEST(LiveStreamAdvancedFeature)

JSON_TEST(LiveTranscoding)

JSON_TEST(CameraCapturerConfiguration)

JSON_TEST(DataStreamConfig)

JSON_TEST(InjectStreamConfig)

JSON_TEST(ChannelMediaInfo)

JSON_TEST(ChannelMediaRelayConfiguration)

JSON_TEST(AgoraRectangle)

JSON_TEST(Rect)

JSON_TEST(WatermarkOptions)

JSON_TEST(ScreenCaptureParameters)

JSON_TEST(VideoCanvas)

JSON_TEST(BeautyOptions)

JSON_TEST(UserInfo)

JSON_TEST(LogConfig)

JSON_TEST(RtcEngineContext)

JSON_TEST(Metadata)

JSON_TEST(EncryptionConfig)
}// namespace test
}// namespace rtc
}// namespace iris
}// namespace agora
