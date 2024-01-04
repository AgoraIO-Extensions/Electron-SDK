/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:44
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2022-08-04 21:18:20
 */
#pragma once
#include "iris_engine_base.h"
#include "iris_rtc_rendering_cxx.h"
#include "node_base.h"
#include <exception>
#include <memory>
#include <node_api.h>

namespace agora {
namespace rtc {
namespace electron {

class NodeIrisEventHandler;

class AgoraElectronBridge {
 public:
  explicit AgoraElectronBridge();
  virtual ~AgoraElectronBridge();

  static napi_value Init(napi_env env, napi_value exports);
  static napi_value Constructor(napi_env env);
  static napi_value New(napi_env env, napi_callback_info info);
  static void Destructor(napi_env env, void *nativeObject, void *finalize_hint);
  static napi_value CallApi(napi_env env, napi_callback_info info);
  static napi_value GetBuffer(napi_env env, napi_callback_info info);
  static napi_value OnEvent(napi_env env, napi_callback_info info);
  static napi_value EnableVideoFrameCache(napi_env env,
                                          napi_callback_info info);
  static napi_value DisableVideoFrameCache(napi_env env,
                                           napi_callback_info info);
  static napi_value GetVideoFrame(napi_env env, napi_callback_info info);
  static napi_value SetAddonLogFile(napi_env env, napi_callback_info info);
  static napi_value InitializeEnv(napi_env env, napi_callback_info info);
  static napi_value ReleaseEnv(napi_env env, napi_callback_info info);
  static napi_value ReleaseRenderer(napi_env env, napi_callback_info info);
  static napi_value RequestScreenCapturePermission(napi_env env, napi_callback_info info);

  void OnApiError(const char *errorMessage);
  void Init();
  void Release();

 private:
  static const char *_class_name;
  static napi_ref *_ref_construcotr_ptr;
  static const char *_ret_code_str;
  static const char *_ret_result_str;
  napi_env _env;
  napi_ref _ref;
  std::shared_ptr<IApiEngineBase> _iris_api_engine;
  std::shared_ptr<NodeIrisEventHandler> _iris_rtc_event_handler;
  std::shared_ptr<iris::IrisRtcRendering> _iris_rendering;

 private:
  char _result[kBasicResultLength];
};

}// namespace electron
}// namespace rtc
}// namespace agora
