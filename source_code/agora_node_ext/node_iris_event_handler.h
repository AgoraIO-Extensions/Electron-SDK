/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:53
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2022-07-29 10:08:04
 */
#pragma once
#include "iris_module.h"
#include "node_api_header.h"
#include "node_async_queue.h"
#include "node_base.h"
#include <unordered_map>

namespace agora {
namespace rtc {
namespace electron {
typedef struct NodeEventCallback {
  napi_env env;
  napi_ref call_back_ref;
} EventCallback;

class AgoraElectronBridge;
class NodeIrisEventHandler : public iris::IrisEventHandler {
 public:
  NodeIrisEventHandler();
  ~NodeIrisEventHandler() override;

  void OnEvent(EventParam *param) override;

  void fireEvent(const char *callback_name, const char *event, const char *data,
                 void **buffer, unsigned int *length,
                 unsigned int buffer_count);

  void addEvent(const std::string &eventName, napi_env &env,
                napi_value &call_bcak, napi_value &global);

  void removeEvent(const std::string &eventName);

 private:
  std::unordered_map<std::string, EventCallback *> _callbacks;
  const char *_callback_key = "call_back_with_buffer";
  const char *_callback_with_encoded_video_frame_key = "call_back_with_encoded_video_frame";
};
}// namespace electron
}// namespace rtc
}// namespace agora
