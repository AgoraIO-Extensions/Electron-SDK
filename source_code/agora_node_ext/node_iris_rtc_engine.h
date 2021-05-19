/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:44
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-19 20:08:46
 */
#pragma once
#include "iris_rtc_engine.h"
#include "iris_rtc_raw_data.h"
#include "iris_rtc_raw_data_plugin_manager.h"
#include "nan_api.h"
#include "node_base.h"
#include "node_iris_rtc_channel.h"
#include "node_iris_rtc_device_manager.h"
#include "node_screen_window_info.h"
#include "video_processer.h"
#include "video_source_proxy.h"
#include <exception>

namespace agora {
namespace rtc {
namespace electron {
class NodeIrisEventHandler;

class NodeIrisRtcEngine : public node::ObjectWrap {
public:
  explicit NodeIrisRtcEngine(v8_Isolate *isolate);
  virtual ~NodeIrisRtcEngine();

  static void Init(v8_Local<v8_Object> &module);
  static void CreateInstance(const v8_FunctionCallbackInfo<v8_Value> &args);
  static void CallApi(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void CallApiWithBuffer(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void OnEvent(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void CreateChannel(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void GetDeviceManager(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void
  GetScreenWindowsInfo(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void
  GetScreenDisplaysInfo(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void PluginCallApi(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void
  EnableVideoFrameCache(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void
  DisableVideoFrameCache(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void
  GetVideoStreamData(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void
  VideoSourceInitialize(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void
  VideoSourceRelease(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void
  VideoSourceSetAddonLogFile(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void SetAddonLogFile(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void Release(const Nan_FunctionCallbackInfo<v8_Value> &args);
  void OnApiError(const char *errorMessage);
  int VideoSourceRelease();

private:
  static Nan_Persistent<v8_Function> _constructor;
  v8_Isolate *_isolate;
  std::unique_ptr<VideoSourceProxy> _video_source_proxy;
  std::shared_ptr<VideoProcesser> _video_processer;
  std::shared_ptr<iris::rtc::IrisRtcEngine> _iris_engine;
  std::shared_ptr<NodeIrisEventHandler> _iris_event_handler;
  iris::rtc::IrisRtcRawDataPluginManager *_iris_raw_data_plugin_manager;
  iris::rtc::IrisRtcRawData *_iris_raw_data;
};
} // namespace electron
} // namespace rtc
} // namespace agora
