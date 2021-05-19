/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:26
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-10 15:18:03
 */
#pragma once
#include "iris_rtc_channel.h"
#include "nan_api.h"
#include "node_base.h"
#include "node_iris_event_handler.h"

namespace agora {
namespace rtc {
namespace electron {
class NodeIrisRtcChannel : public node::ObjectWrap {
public:
  explicit NodeIrisRtcChannel(v8_Isolate *isolate,
                              iris::rtc::IrisRtcChannel *channel,
                              const char *channelId);
  virtual ~NodeIrisRtcChannel();

  static v8_Local<v8_Object> Init(v8_Isolate *isolate,
                                  iris::rtc::IrisRtcChannel *channel,
                                  const char *channelId);
  static void CreateInstance(const v8_FunctionCallbackInfo<v8_Value> &args);
  static void CallApi(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void CallApiWithBuffer(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void OnEvent(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void Release(const Nan_FunctionCallbackInfo<v8_Value> &args);
  static void ReleaseNodeSource(void *data);
  void OnApiError(const char *errorMessage);

private:
  std::unique_ptr<NodeIrisEventHandler> _iris_channel_event_handler;
  v8_Isolate *_isolate;
  static Nan_Persistent<v8_Function> _constructor;
  iris::rtc::IrisRtcChannel *_iris_channel;
  std::string _channel_id;
};
} // namespace electron
} // namespace rtc
} // namespace agora