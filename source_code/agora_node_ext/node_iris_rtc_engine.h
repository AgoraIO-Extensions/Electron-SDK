/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:44
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-10-18 22:44:00
 */
#pragma once
#include <node_api.h>
#include <exception>
#include "iris_base.h"
#include "iris_rtc_engine.h"
#include "iris_rtc_raw_data.h"
#include "iris_rtc_raw_data_plugin_manager.h"
#include "node_base.h"
#include "node_iris_rtc_channel.h"
#include "node_iris_rtc_device_manager.h"
#include "node_screen_window_info.h"
#include "video_processer.h"

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
  static const char* _ret_code_str;
  static const char* _ret_result_str;
//  std::unique_ptr<VideoSourceProxy> _video_source_proxy;
  iris::rtc::IrisRtcRawDataPluginManager* _iris_raw_data_plugin_manager;
  
  std::shared_ptr<VideoProcesser> _video_processer;
  std::shared_ptr<iris::rtc::IrisRtcEngine> _iris_engine;
  std::shared_ptr<NodeIrisEventHandler> _iris_event_handler;
  iris::rtc::IrisRtcRawData* _iris_raw_data;
    
    
  std::shared_ptr<iris::rtc::IrisRtcEngine> _iris_sub_process_engine;
  std::shared_ptr<VideoProcesser> _video_processer_for_sub_process;
  std::shared_ptr<NodeIrisEventHandler> _iris_event_handler_for_sub_process;
};
}  // namespace electron
}  // namespace rtc
}  // namespace agora
