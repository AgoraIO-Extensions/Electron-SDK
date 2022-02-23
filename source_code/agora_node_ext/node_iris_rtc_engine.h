/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:44
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-10-19 18:14:39
 */
#pragma once
#include <node_api.h>

#include <exception>

#include "iris_rtc_engine.h"
#include "iris_rtc_raw_data.h"
#include "iris_rtc_raw_data_plugin_manager.h"
#include "iris_video_processor.h"
#include "node_base.h"
#include "node_iris_rtc_channel.h"
#include "node_iris_rtc_device_manager.h"
#include "node_screen_window_info.h"

namespace agora {
namespace rtc {
namespace electron {

class NodeIrisEventHandler;

class NodeIrisRtcEngine {
 public:
  explicit NodeIrisRtcEngine();
  virtual ~NodeIrisRtcEngine();

  static napi_value Init(napi_env env, napi_value exports);
  static napi_value Constructor(napi_env env);
  static napi_value New(napi_env env, napi_callback_info info);
  static void Destructor(napi_env env, void* nativeObject, void* finalize_hint);
  static napi_value CallApi(napi_env env, napi_callback_info info);
  static napi_value CallApiWithBuffer(napi_env env, napi_callback_info info);
  static napi_value OnEvent(napi_env env, napi_callback_info info);
  static napi_value CreateChannel(napi_env env, napi_callback_info info);
  static napi_value GetDeviceManager(napi_env env, napi_callback_info info);
  static napi_value GetScreenWindowsInfo(napi_env env, napi_callback_info info);
  static napi_value GetScreenDisplaysInfo(napi_env env,
                                          napi_callback_info info);
  static napi_value PluginCallApi(napi_env env, napi_callback_info info);
  static napi_value EnableVideoFrameCache(napi_env env,
                                          napi_callback_info info);
  static napi_value DisableVideoFrameCache(napi_env env,
                                           napi_callback_info info);
  static napi_value GetVideoStreamData(napi_env env, napi_callback_info info);
  static napi_value SetAddonLogFile(napi_env env, napi_callback_info info);
  static napi_value Release(napi_env env, napi_callback_info info);
  void OnApiError(const char* errorMessage);

  napi_env _env;
  napi_ref _ref;

  static const char* _class_name;

 private:
  static napi_ref* _ref_construcotr_ptr;
  static const char* _ret_code_str;
  static const char* _ret_result_str;

  std::shared_ptr<iris::IrisVideoFrameBufferManager>
      _iris_video_frame_buffer_manager;
  std::shared_ptr<iris::rtc::IrisRtcEngine> _iris_engine;
  std::shared_ptr<NodeIrisEventHandler> _iris_event_handler;
  iris::rtc::IrisRtcRawData* _iris_raw_data;
  iris::rtc::IIrisRtcRawDataPluginManager* _iris_raw_data_plugin_manager;

  std::shared_ptr<iris::rtc::IrisRtcEngine> _iris_sub_process_engine;
  iris::rtc::IrisRtcRawData* _iris_raw_data_for_sub_process;
  std::shared_ptr<iris::IrisVideoFrameBufferManager>
      _iris_video_frame_buffer_manager_for_sub_process;
  std::shared_ptr<NodeIrisEventHandler> _iris_event_handler_for_sub_process;
  iris::rtc::IIrisRtcRawDataPluginManager*
      _iris_raw_data_plugin_manager_for_sub_process;
};
}  // namespace electron
}  // namespace rtc
}  // namespace agora
