/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:49
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-10-10 22:07:58
 */
#include "node_iris_event_handler.h"
#include <memory.h>
#include <string>
#include "node_iris_rtc_engine.h"

namespace agora {
namespace rtc {
namespace electron {
NodeIrisEventHandler::NodeIrisEventHandler(NodeIrisRtcEngine* engine)
    : _node_iris_engine(engine) {
  node_async_call::close(false);
}

NodeIrisEventHandler::~NodeIrisEventHandler() {
  node_async_call::close(true);
  _callbacks.clear();
  _node_iris_engine = nullptr;
}

void NodeIrisEventHandler::addEvent(const std::string& eventName,
                                    napi_env& env,
                                    napi_value& call_bcak,
                                    napi_value& global) {
  auto callback = new EventCallback();
  callback->env = env;
  callback->call_back = call_bcak;
  callback->global = global;
  _callbacks[eventName] = callback;
}

void NodeIrisEventHandler::OnEvent(const char* event, const char* data) {
  std::string _eventName(event);
  std::string _eventData(data);
  node_async_call::async_call([this, _eventName, _eventData] {
    auto it = _callbacks.find("call_back");
    if (it != _callbacks.end()) {
      size_t argc = 2;
      napi_value args[2];
      napi_value result;
      napi_create_string_utf8(it->second->env, _eventName.c_str(),
                              sizeof(_eventName), &args[0]);
      napi_create_string_utf8(it->second->env, _eventData.c_str(),
                              sizeof(_eventData), &args[1]);
      napi_call_function(it->second->env, it->second->global,
                         it->second->call_back, argc, args, &result);
    }
  });
}

void NodeIrisEventHandler::OnEvent(const char* event,
                                   const char* data,
                                   const void* buffer,
                                   unsigned int length) {
  std::string _eventName(event);
  std::string _eventData(data);
  std::vector<char> stringData;
  stringData.resize(length + 1, '\0');

  memcpy(stringData.data(), buffer, length);
  std::string _eventBuffer(stringData.data());
  node_async_call::async_call([this, _eventName, _eventData, _eventBuffer] {
    auto it = _callbacks.find("call_back_with_buffer");
    if (it != _callbacks.end()) {
      size_t argc = 3;
      napi_value args[3];
      napi_value result;
      napi_create_string_utf8(it->second->env, _eventName.c_str(),
                              sizeof(_eventName), &args[0]);
      napi_create_string_utf8(it->second->env, _eventData.c_str(),
                              sizeof(_eventData), &args[1]);
      napi_create_string_utf8(it->second->env, _eventBuffer.c_str(),
                              sizeof(_eventBuffer), &args[2]);
      napi_call_function(it->second->env, it->second->global,
                         it->second->call_back, argc, args, &result);
    }
  });
}

void NodeIrisEventHandler::OnVideoSourceEvent(const char* eventName,
                                              const char* eventData) {
  std::string _eventName(eventName);
  std::string _eventData(eventData);
  node_async_call::async_call([this, _eventName, _eventData] {
    auto it = _callbacks.find("video_source_call_back");
    if (it != _callbacks.end()) {
      size_t argc = 2;
      napi_value args[2];
      napi_value result;
      napi_create_string_utf8(it->second->env, _eventName.c_str(),
                              sizeof(_eventName), &args[0]);
      napi_create_string_utf8(it->second->env, _eventData.c_str(),
                              sizeof(_eventData), &args[1]);
      napi_call_function(it->second->env, it->second->global,
                         it->second->call_back, argc, args, &result);
    }
  });
}

void NodeIrisEventHandler::OnVideoSourceEvent(const char* event,
                                              const char* data,
                                              const char* buffer,
                                              int length) {
  std::string _eventName(event);
  std::string _eventData(data);
  std::vector<char> stringData;
  stringData.resize(length + 1, '\0');
  memcpy(stringData.data(), buffer, length);
  std::string _eventBuffer(stringData.data());
  node_async_call::async_call([this, _eventName, _eventData, _eventBuffer] {
    auto it = _callbacks.find("video_source_call_back_with_buffer");
    if (it != _callbacks.end()) {
      size_t argc = 3;
      napi_value args[3];
      napi_value result;
      napi_create_string_utf8(it->second->env, _eventName.c_str(),
                              sizeof(_eventName), &args[0]);
      napi_create_string_utf8(it->second->env, _eventData.c_str(),
                              sizeof(_eventData), &args[1]);
      napi_create_string_utf8(it->second->env, _eventBuffer.c_str(),
                              sizeof(_eventBuffer), &args[2]);
      napi_call_function(it->second->env, it->second->global,
                         it->second->call_back, argc, args, &result);
    }
  });
}

void NodeIrisEventHandler::OnVideoSourceExit() {
  LOG_F(INFO, "NodeIrisEventHandler::OnVideoSourceExit");
  _node_iris_engine->VideoSourceRelease();
}
}  // namespace electron
}  // namespace rtc
}  // namespace agora