/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:53
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-19 20:07:39
 */
#pragma once
#include <unordered_map>
#include "iris_event_handler.h"
#include "node_api_header.h"
#include "node_async_queue.h"
#include "node_base.h"
#include "video_source_event_handler.h"

namespace agora {
namespace rtc {
namespace electron {
class NodeIrisRtcEngine;
class NodeIrisEventHandler : public iris::IrisEventHandler,
                             public IVideoSourceEventHandler {
 public:
  typedef struct NodeEventCallback {
    napi_env env;
    napi_value call_back;
    napi_value global;
  } EventCallback;

 public:
  NodeIrisEventHandler(NodeIrisRtcEngine* engine);
  virtual ~NodeIrisEventHandler();

  virtual void OnEvent(const char* event, const char* data) override;

  virtual void OnEvent(const char* event,
                       const char* data,
                       const void* buffer,
                       unsigned length) override;

  virtual void OnVideoSourceEvent(const char* eventName,
                                  const char* eventData) override;

  virtual void OnVideoSourceEvent(const char* eventName,
                                  const char* eventData,
                                  const char* buffer,
                                  int length) override;

  virtual void OnVideoSourceExit() override;

  void addEvent(const std::string& eventName,
                napi_env& env,
                napi_value& call_bcak,
                napi_value& global);

 private:
  std::unordered_map<std::string, EventCallback*> _callbacks;
  NodeIrisRtcEngine* _node_iris_engine;
};
}  // namespace electron
}  // namespace rtc
}  // namespace agora