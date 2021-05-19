#include "iris_rtc_c_api.h"
#include "iris_event_handler.h"
#include "iris_rtc_channel.h"
#include "iris_rtc_device_manager.h"
#include "iris_rtc_engine.h"

#if defined(IRIS_DEBUG)
#include "internal/iris_rtc_tester.h"
#endif

namespace agora {
namespace iris {
namespace rtc {
namespace internal {
class IrisRtcEventHandler : public IrisEventHandler {
 public:
  explicit IrisRtcEventHandler(const IrisCEventHandler &event_handler) {
    event_handler_ = event_handler;
  }

  void OnEvent(const char *event, const char *data) override {
    event_handler_.onEvent(event, data);
  }

  void OnEvent(const char *event, const char *data, const void *buffer,
               unsigned int length) override {
    event_handler_.onEventWithBuffer(event, data, buffer, length);
  }

 private:
  IrisCEventHandler event_handler_{};
};
}// namespace internal
}// namespace rtc
}// namespace iris
}// namespace agora

using namespace agora::iris::rtc;
#if defined(IRIS_DEBUG)
using namespace agora::iris::rtc::test;
#endif

#ifdef __cplusplus
extern "C" {
#endif

IrisRtcEnginePtr CreateIrisRtcEngine() {
  auto *engine = new IrisRtcEngine();
  return engine;
}

void DestroyIrisRtcEngine(IrisRtcEnginePtr engine_ptr) {
  auto *engine = reinterpret_cast<IrisRtcEngine *>(engine_ptr);
  delete engine;
}

void SetIrisRtcEngineEventHandler(IrisRtcEnginePtr engine_ptr,
                                  IrisCEventHandler *event_handler) {
  auto rtc_event_handler = new internal::IrisRtcEventHandler(*event_handler);
  reinterpret_cast<IrisRtcEngine *>(engine_ptr)
      ->SetEventHandler(rtc_event_handler);
}

int CallIrisRtcEngineApi(IrisRtcEnginePtr engine_ptr, ApiTypeEngine api_type,
                         const char *params, char *result) {
  int ret = reinterpret_cast<IrisRtcEngine *>(engine_ptr)
                ->CallApi(api_type, params, result);
  return ret;
}

int CallIrisRtcEngineApiWithBuffer(IrisRtcEnginePtr engine_ptr,
                                   ApiTypeEngine api_type, const char *params,
                                   void *buffer, char *result) {
  int ret = reinterpret_cast<IrisRtcEngine *>(engine_ptr)
                ->CallApi(api_type, params, buffer, result);
  return ret;
}

IrisRtcChannelPtr GetIrisRtcChannel(IrisRtcEnginePtr engine_ptr) {
  auto channel = reinterpret_cast<IrisRtcEngine *>(engine_ptr)->channel();
  return channel;
}

void SetIrisRtcChannelEventHandler(IrisRtcChannelPtr channel_ptr,
                                   IrisCEventHandler *event_handler) {
  auto rtc_event_handler = new internal::IrisRtcEventHandler(*event_handler);
  reinterpret_cast<IrisRtcChannel *>(channel_ptr)
      ->SetEventHandler(rtc_event_handler);
}

int CallIrisRtcChannelApi(IrisRtcChannelPtr channel_ptr,
                          ApiTypeChannel api_type, const char *params,
                          char *result) {
  int ret = reinterpret_cast<IrisRtcChannel *>(channel_ptr)
                ->CallApi(api_type, params, result);
  return ret;
}

int CallIrisRtcChannelApiWithBuffer(IrisRtcChannelPtr channel_ptr,
                                    ApiTypeChannel api_type, const char *params,
                                    void *buffer, char *result) {
  int ret = reinterpret_cast<IrisRtcChannel *>(channel_ptr)
                ->CallApi(api_type, params, buffer, result);
  return ret;
}

IrisRtcDeviceManagerPtr GetIrisRtcDeviceManager(IrisRtcEnginePtr engine_ptr) {
  auto device_manager =
      reinterpret_cast<IrisRtcEngine *>(engine_ptr)->device_manager();
  return device_manager;
}

int CallIrisRtcAudioDeviceManagerApi(IrisRtcDeviceManagerPtr device_manager_ptr,
                                     ApiTypeAudioDeviceManager api_type,
                                     const char *params, char *result) {
  int ret = reinterpret_cast<IrisRtcDeviceManager *>(device_manager_ptr)
                ->CallApi(api_type, params, result);
  return ret;
}

int CallIrisRtcVideoDeviceManagerApi(IrisRtcDeviceManagerPtr device_manager_ptr,
                                     ApiTypeVideoDeviceManager api_type,
                                     const char *params, char *result) {
  int ret = reinterpret_cast<IrisRtcDeviceManager *>(device_manager_ptr)
                ->CallApi(api_type, params, result);
  return ret;
}

void SetProxy(IrisRtcTesterPtr tester_ptr, IrisRtcEnginePtr engine_ptr) {
  //  reinterpret_cast<IrisRtcEngine *>(engine_ptr)
  //      ->SetProxy(reinterpret_cast<IrisRtcTester *>(tester_ptr));
}

#if defined(IRIS_DEBUG)
IrisRtcTesterPtr CreateIrisRtcTester(const char *dump_file_path) {
  auto test = new IrisRtcTester(dump_file_path);
  return test;
}

void DestroyIrisRtcTester(IrisRtcTesterPtr tester_ptr) {
  auto *test = reinterpret_cast<IrisRtcTester *>(tester_ptr);
  delete test;
}

void BeginApiTestByFile(IrisRtcTesterPtr tester_ptr, const char *case_file_path,
                        struct IrisCEventHandler *event_handler) {
  auto rtc_event_handler = new internal::IrisRtcEventHandler(*event_handler);
  reinterpret_cast<IrisRtcTester *>(tester_ptr)
      ->BeginApiTestByFile(case_file_path, rtc_event_handler);
}

void BeginApiTest(IrisRtcTesterPtr tester_ptr, const char *case_content,
                  struct IrisCEventHandler *event_handler) {
  auto rtc_event_handler = new internal::IrisRtcEventHandler(*event_handler);
  reinterpret_cast<IrisRtcTester *>(tester_ptr)
      ->BeginApiTest(case_content, rtc_event_handler);
}

void BeginEventTestByFile(IrisRtcTesterPtr tester_ptr,
                          const char *case_file_path,
                          struct IrisCEventHandler *event_handler) {
  auto rtc_event_handler = new internal::IrisRtcEventHandler(*event_handler);
  reinterpret_cast<IrisRtcTester *>(tester_ptr)
      ->BeginEventTestByFile(case_file_path, rtc_event_handler);
}

void BeginEventTest(IrisRtcTesterPtr tester_ptr, const char *case_content,
                    struct IrisCEventHandler *event_handler) {
  auto rtc_event_handler = new internal::IrisRtcEventHandler(*event_handler);
  reinterpret_cast<IrisRtcTester *>(tester_ptr)
      ->BeginEventTest(case_content, rtc_event_handler);
}

void OnEventReceived(IrisRtcTesterPtr tester_ptr, const char *event,
                     const char *data) {
  reinterpret_cast<IrisRtcTester *>(tester_ptr)->OnEventReceived(event, data);
}
#endif

#ifdef __cplusplus
}
#endif
