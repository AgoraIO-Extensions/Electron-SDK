/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:49
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2022-07-31 14:38:39
 */
#include "node_iris_event_handler.h"
#include "agora_electron_bridge.h"
#include <memory.h>
#include <node_api.h>

namespace agora {
namespace rtc {
namespace electron {

NodeIrisEventHandler::NodeIrisEventHandler() { node_async_call::close(false); }

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

void NodeIrisEventHandler::addEvent(const std::string &eventName, napi_env &env,
                                    napi_value &call_bcak, napi_value &global) {
  auto it = _callbacks.find(eventName);
  if (it == _callbacks.end()) {
    auto callback = new EventCallback();
    callback->env = env;
    _callbacks[eventName] = callback;
  }

  napi_status status = napi_create_reference(
      env, call_bcak, 1, &(_callbacks[eventName]->call_back_ref));
}

void NodeIrisEventHandler::removeEvent(const std::string &eventName) {
  auto it = _callbacks.find(eventName);
  if (it != _callbacks.end()) {
    napi_delete_reference(it->second->env, it->second->call_back_ref);
    delete it->second;
    _callbacks.erase(it);
  }
}

void NodeIrisEventHandler::OnEvent(EventParam *param) {
  const char *event = "VideoEncodedFrameObserver_onEncodedVideoFrameReceived";

  if (strcmp(event, param->event) == 0) {
    fireEvent(_callback_with_encoded_video_frame_key, param->event, param->data,
              param->buffer, param->length, param->buffer_count);
  } else {
    fireEvent(_callback_key, param->event, param->data, param->buffer,
              param->length, param->buffer_count);
  }
}

void NodeIrisEventHandler::fireEvent(const char *callback_name,
                                     const char *event, const char *data,
                                     void **buffer, unsigned int *length,
                                     unsigned int buffer_count) {
  std::string eventName = "";
  if (event) { eventName = event; }
  std::string eventData = "";
  if (data) { eventData = data; }
  std::string callback_name_str(callback_name);
  std::vector<std::vector<unsigned char>> buffer_array;
  buffer_array.resize(buffer_count);

  for (int i = 0; i < buffer_count; i++) {
    buffer_array[i].resize(length[i]);
    memcpy(buffer_array[i].data(), buffer[i], length[i]);
  }

  std::vector<unsigned int> buffer_lengths;
  buffer_lengths.resize(buffer_count);

  for (int i = 0; i < buffer_count; i++) { buffer_lengths[i] = length[i]; }

  node_async_call::async_call([this, callback_name_str, eventName, eventData,
                               buffer_array, buffer_lengths, buffer_count] {
    auto it = _callbacks.find(callback_name_str.c_str());
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

      std::vector<napi_value> buffer_array_item;
      buffer_array_item.resize(buffer_count);
      for (int i = 0; i < buffer_count; i++) {
        napi_create_buffer_copy(it->second->env, buffer_lengths[i],
                                buffer_array[i].data(), nullptr,
                                &buffer_array_item[i]);
        napi_set_element(it->second->env, args[2], i, buffer_array_item[i]);
      }

      status = napi_create_array(it->second->env, &args[3]);

      std::vector<napi_value> buffer_length_item;
      buffer_length_item.resize(buffer_count);
      for (int i = 0; i < buffer_count; i++) {
        napi_status status;
        napi_create_uint32(it->second->env, buffer_lengths[i],
                           &buffer_length_item[i]);
        napi_set_element(it->second->env, args[3], i, buffer_length_item[i]);
      }

      status = napi_create_uint32(it->second->env, buffer_count, &args[4]);

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

}// namespace electron
}// namespace rtc
}// namespace agora
