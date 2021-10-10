/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:33
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-10-10 22:08:10
 */
#pragma once
#include <node_api.h>
#include "iris_rtc_device_manager.h"

namespace agora {
namespace rtc {
namespace electron {
class NodeIrisRtcDeviceManager {
 public:
  static iris::rtc::IrisRtcDeviceManager* _staticDeviceManager;
  explicit NodeIrisRtcDeviceManager(
      napi_env env,
      iris::rtc::IrisRtcDeviceManager* deviceManager);
  virtual ~NodeIrisRtcDeviceManager();

  static napi_value Init(napi_env env);
  static napi_value New(napi_env env, napi_callback_info info);
  static napi_value NewInstance(napi_env env);
  static napi_value CallApiAudioDevice(napi_env env, napi_callback_info info);
  static napi_value CallApiVideoDevice(napi_env env, napi_callback_info info);
  static napi_value Release(napi_env env, napi_callback_info info);

  static void ReleaseNodeSource(void* selfPtr);

 private:
  static const char* _class_name;
  static const char* _ret_code_str;
  static const char* _ret_result_str;
  static napi_value Constructor(napi_env env);
  static void Destructor(napi_env env, void* nativeObject, void* finalize_hint);

  napi_env _env;
  napi_ref _ref;
  iris::rtc::IrisRtcDeviceManager* _deviceManager;
};
}  // namespace electron
}  // namespace rtc
}  // namespace agora
