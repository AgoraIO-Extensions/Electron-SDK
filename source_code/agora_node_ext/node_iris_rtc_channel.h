#pragma once
#include <node_api.h>

#include "iris_rtc_channel.h"
#include "node_base.h"
#include "node_iris_event_handler.h"

namespace agora {
namespace rtc {
namespace electron {
class NodeIrisRtcChannel {
 public:
  static iris::rtc::IIrisRtcChannel* _staticIrisChannel;
  static const char* _staticChannelId;
  explicit NodeIrisRtcChannel(napi_env env, iris::rtc::IIrisRtcChannel* channel,
                              const char* channelId);
  virtual ~NodeIrisRtcChannel();
  static napi_value Init(napi_env env);
  static napi_value New(napi_env env, napi_callback_info info);
  static napi_value NewInstance(napi_env env);
  static napi_value CallApi(napi_env env, napi_callback_info info);
  static napi_value CallApiWithBuffer(napi_env env, napi_callback_info info);
  static napi_value OnEvent(napi_env env, napi_callback_info info);
  static napi_value Release(napi_env env, napi_callback_info info);
  static void ReleaseNodeSource(void* selfPtr);
  void OnApiError(const char* errorMessage);

 private:
  static napi_ref* _ref_construcotr_ptr;
  static const char* _class_name;
  static const char* _ret_code_str;
  static const char* _ret_result_str;
  static napi_value Constructor(napi_env env);
  static void Destructor(napi_env env, void* nativeObject, void* finalize_hint);

  napi_env _env;
  napi_ref _ref;
  std::unique_ptr<NodeIrisEventHandler> _iris_channel_event_handler;
  iris::rtc::IIrisRtcChannel* _iris_channel;
  std::string _channel_id;
};
}  // namespace electron
}  // namespace rtc
}  // namespace agora
