/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:49
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-10-19 14:13:32
 */
#include "node_iris_event_handler.h"
#include <memory.h>
#include <node_api.h>
#include <string>
#include "node_iris_rtc_engine.h"
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

/*void NodeIrisEventHandler::OnEvent(const char* event, const char* data) {
  std::string _eventName(event);
  std::string _eventData(data);
  node_async_call::async_call([this, _eventName, _eventData] {
    auto it = _callbacks.find("call_back");
    if (it != _callbacks.end()) {
      size_t argc = 2;
      napi_value args[2];
      napi_value result;
      napi_status status;
      status = napi_create_string_utf8(it->second->env, _eventName.c_str(),
                                       _eventName.length(), &args[0]);
      status = napi_create_string_utf8(it->second->env, _eventData.c_str(),
                                       _eventData.length(), &args[1]);

      napi_value call_back_value;
      status = napi_get_reference_value(
          it->second->env, it->second->call_back_ref, &call_back_value);

      napi_value recv_value;
      status = napi_get_undefined(it->second->env, &recv_value);

      status = napi_call_function(it->second->env, recv_value, call_back_value,
                                  argc, args, &result);
    }
  });
}*/

void NodeIrisEventHandler::OnEvent(const char *event, const char *data, const void *buffer,
                                    unsigned int *length, unsigned int buffer_count) {
  std::string _eventName(event);
  std::string _eventData(data);
  std::vector<char> stringData;
  
  if(buffer_count == 1) {
      stringData.resize(*length + 1, '\0');
      memcpy(stringData.data(), buffer, *length);
  }
    
  std::string _eventBuffer(stringData.data());
  node_async_call::async_call([this, _eventName, _eventData, _eventBuffer] {
    auto it = _callbacks.find("call_back_with_buffer");
    if (it != _callbacks.end()) {
      size_t argc = 3;
      napi_value args[3];
      napi_value result;
      napi_status status;
      status = napi_create_string_utf8(it->second->env, _eventName.c_str(),
                                       _eventName.length(), &args[0]);
      status = napi_create_string_utf8(it->second->env, _eventData.c_str(),
                                       _eventData.length(), &args[1]);
      status = napi_create_string_utf8(it->second->env, _eventBuffer.c_str(),
                                       _eventBuffer.length(), &args[2]);

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
