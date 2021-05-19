/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:33
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-06 16:58:58
 */
#pragma once
#include "iris_rtc_device_manager.h"
#include "nan_api.h"

namespace agora {
namespace rtc {
namespace electron {
class NodeIrisRtcDeviceManager : public node::ObjectWrap {
public:
  explicit NodeIrisRtcDeviceManager(
      v8_Isolate *isolate, iris::rtc::IrisRtcDeviceManager *deviceManager);
  virtual ~NodeIrisRtcDeviceManager();

  static v8_Local<v8_Object>
  Init(v8_Isolate *isolate, iris::rtc::IrisRtcDeviceManager *deviceManager);
  static void CreateInstance(const v8_FunctionCallbackInfo<v8_Value> &args);
  static void
  CallApiAudioDevice(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void
  CallApiVideoDevice(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void Release(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void ReleaseNodeSource(void *selfPtr);

private:
  static Nan_Persistent<v8_Function> _constructor;
  v8_Isolate *_isolate;
  iris::rtc::IrisRtcDeviceManager *_deviceManager;
};
} // namespace electron
} // namespace rtc
} // namespace agora