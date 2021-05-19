//
// Created by LXH on 2021/1/4.
//

#include "gtest/gtest.h"

#include "internal/iris_rtc_tester.h"
#include "iris_rtc_engine.h"

using namespace agora::iris;
using namespace agora::iris::rtc;
using namespace agora::iris::rtc::test;

GTEST_API_ int main(int argc, char **argv) {
  testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}

TEST(IrisRtcTest, EventTest) {
  auto test = new IrisRtcTester("./EngineEventDump.json");
  class IrisRtcEngineEventHandler : public IrisEventHandler {
   public:
    explicit IrisRtcEngineEventHandler(IrisRtcTester *test) : test_(test) {}

    void OnEvent(const char *event, const char *data) override {
      test_->OnEventReceived(event, data);
    }

    void OnEvent(const char *event, const char *data, const void *buffer,
                 unsigned length) override {
      test_->OnEventReceived(event, data);
    }

   private:
    IrisRtcTester *test_;
  };
  auto handler = new IrisRtcEngineEventHandler(test);
  test->BeginEventTestByFile("./EngineEventTest.json", handler);
  delete test;
  delete handler;
}

TEST(IrisRtcTest, ApiTest) {
  auto test = new IrisRtcTester("./EngineApiDump.json");
  class IrisRtcEngineEventHandler : public IrisEventHandler {
   public:
    explicit IrisRtcEngineEventHandler(IrisRtcTester *test)
        : engine_(new IrisRtcEngine) {
      engine_->EnableTest(test);
    }

    ~IrisRtcEngineEventHandler() override { delete engine_; }

    void OnEvent(const char *event, const char *data) override {
      rapidjson::Document document;
      document.Parse(data);
      auto apiType = document["apiType"].GetInt();
      auto params = document["params"].GetObject();
      char result[kMaxResultLength];
      engine_->CallApi(static_cast<ApiTypeEngine>(apiType),
                       ToJsonString(params).c_str(), result);
    }

    void OnEvent(const char *event, const char *data, const void *buffer,
                 unsigned length) override {}

   private:
    IrisRtcEngine *engine_;
  };
  auto handler = new IrisRtcEngineEventHandler(test);
  test->BeginApiTestByFile("./EngineApiTest.json", handler);
  delete test;
  delete handler;
}
