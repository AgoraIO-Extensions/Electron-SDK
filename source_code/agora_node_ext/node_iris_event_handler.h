/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:53
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-10-19 14:13:45
 */
#pragma once
#include <unordered_map>
#include "iris_event_handler.h"
#include "node_api_header.h"
#include "node_async_queue.h"
#include "node_base.h"

namespace agora {
namespace rtc {
namespace electron {
enum CallBackModule { RTC = 0, MPK };

class AgoraElectronBridge;
class NodeIrisEventHandler : public iris::IrisEventHandler {
 public:
  typedef struct NodeEventCallback {
    napi_env env;
    napi_ref call_back_ref;
  } EventCallback;

 public:
  NodeIrisEventHandler();
  virtual ~NodeIrisEventHandler();

  // virtual void OnEvent(const char* event, const char* data) override;

  
  virtual void OnEvent(const char* event,
                       const char* data,
                       const void** buffer,
                       unsigned int* length,
                       unsigned int buffer_count) override;

  void addEvent(const std::string& eventName,
                napi_env& env,
                napi_value& call_bcak,
                napi_value& global);

 private:
  std::unordered_map<std::string, EventCallback*> _callbacks;
};
}  // namespace electron
}  // namespace rtc
}  // namespace agora
