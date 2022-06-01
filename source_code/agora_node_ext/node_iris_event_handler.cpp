/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:49
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2022-05-29 14:16:02
 */
#include "node_iris_event_handler.h"
#include <memory.h>
#include <node_api.h>
#include <string>
#include "agora_electron_bridge.h"
namespace agora {
namespace rtc {
namespace electron {
NodeIrisEventHandler::NodeIrisEventHandler() {
  node_async_call::close(false);
}

NodeIrisEventHandler::~NodeIrisEventHandler() {
  node_async_call::close(true);

  // TODO release call back memory and ref
  for (auto it = _callbacks.begin(); it != _callbacks.end();) {
    auto item = it->second;
    auto ref = item->call_back_ref;
    napi_delete_reference(item->env, ref);
    delete item;
    item = nullptr;
    _callbacks.erase(it++);
  }
  _callbacks.clear();
}

void NodeIrisEventHandler::addEvent(const std::string& eventName,
                                    napi_env& env,
                                    napi_value& call_bcak,
                                    napi_value& global) {
  auto callback = new EventCallback();
  callback->env = env;

  napi_status status =
      napi_create_reference(env, call_bcak, 1, &(callback->call_back_ref));
  _callbacks[eventName] = callback;
}

void NodeIrisEventHandler::OnEvent(const char* event,
                                   const char* data,
                                   const void** buffer,
                                   unsigned int* length,
                                   unsigned int buffer_count) {
  std::string eventName(event);
  std::string eventData(data);
  std::vector<char> stringData;

  node_async_call::async_call([this, eventName, eventData] {
    auto it = _callbacks.find("call_back_with_buffer");
    if (it != _callbacks.end()) {
      size_t argc = 5;
      napi_value args[5];
      napi_value result;
      napi_status status;
      status = napi_create_string_utf8(it->second->env, eventName.c_str(),
                                       eventName.length(), &args[0]);
      status = napi_create_string_utf8(it->second->env, eventData.c_str(),
                                       eventData.length(), &args[1]);
    status = napi_create_array(it->second->env, &args[2]);
    status = napi_create_uint32(it->second->env, 0, &args[3]);
    status = napi_create_uint32(it->second->env, 0, &args[4]);
      
        

      napi_value call_back_value;
      status = napi_get_reference_value(
          it->second->env, it->second->call_back_ref, &call_back_value);

      napi_value recv_value;
      status = napi_get_undefined(it->second->env, &recv_value);

      status = napi_call_function(it->second->env, recv_value, call_back_value,
                                  argc, args, &result);
    }
  });
}

}  // namespace electron
}  // namespace rtc
}  // namespace agora
