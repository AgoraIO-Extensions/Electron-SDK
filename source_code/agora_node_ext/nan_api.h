/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:01
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-07-28 17:34:40
 */
#pragma once
#include <node_buffer.h>
#include <memory>
#include <string>
#include <vector>
#include "node_base.h"

namespace agora {
namespace rtc {
namespace electron {
#define DECLARE_NAPI_METHOD(name, func) \
  { name, 0, func, 0, 0, 0, napi_default, 0 }

#define RETURE_NAPI_OBJ()                                                      \
  napi_value retObj;                                                           \
  status = napi_create_object(env, &retObj);                                   \
  std::string resultStr = std::string(result);                                 \
  napi_obj_set_property<int>(env, retObj, _ret_code_str, ret);                 \
  napi_obj_set_property<std::string>(env, retObj, _ret_result_str, resultStr); \
  return retObj

napi_status napi_get_value_utf8string(napi_env& env,
                                      napi_value& value,
                                      std::string& str) {
  napi_status status;
  size_t length = 0;
  status = napi_get_value_string_utf8(env, value, nullptr, 0, &length);

  std::vector<char> strData;
  strData.resize(length + 1);

  size_t result = 0;
  status =
      napi_get_value_string_utf8(env, value, strData.data(), length, &result);
  str = strData.data();
  return status;
}

template <typename T>
napi_status napi_obj_set_property(napi_env& env,
                                  napi_value& object,
                                  const char* utf8name,
                                  T& value,
                                  int length = 0) {
  napi_status status;
  napi_value result;
  napi_value n_value;
  if (typeid(T) == typeid(int)) {
    n_value = napi_create_int32(env, value, &result);
  } else if (typeid(T) == typeid(std::string)) {
    n_value = napi_create_string_utf8(env, value.c_str(), sizeof(T), &result);
  } else if (typeid(T) == typeid(uint32_t)) {
    n_value = napi_create_uint32(env, value, &result);
  } else if (typeid(T) == typeid(float)) {
    n_value = napi_create_double(env, value, &result);
  } else if (typeid(T) == typeid(bool)) {
    n_value = napi_create_int32(env, value, &result);
  } else if (typeid(T) == typeid(double)) {
    n_value = napi_create_double(env, value, &result);
  } else if (typeid(T) == typeid(int64_t)) {
    n_value = napi_create_int64(env, value, &result);
  } else if (typeid(T) == typeid(unsigned char*)) {
    n_value = napi_create_external_arraybuffer(env, value, length, nullptr,
                                               nullptr, &result);
  } else if (typeid(T) == typeid(napi_value)) {
    n_value = value;
  }

  status = napi_set_named_property(env, object, utf8name, n_value);
  return status;
}

template <typename T>
napi_status napi_obj_get_property(napi_env& env,
                                  napi_value& object,
                                  const char* utf8name,
                                  T& result) {
  napi_status status;
  napi_value retValue;
  if (typeid(T) == typeid(int)) {
    napi_get_named_property(env, object, utf8name, &retValue);
    napi_get_value_int32(env, retValue, &result);
  } else if (typeid(T) == typeid(uint32_t)) {
    napi_get_named_property(env, object, utf8name, &retValue);
    napi_get_value_uint32(env, retValue, &result);
  } else if (typeid(T) == typeid(std::string)) {
    napi_get_named_property(env, object, utf8name, &retValue);
    napi_get_value_utf8string(env, retValue, result);
  } else if (typeid(T) == typeid(napi_value)) {
    napi_get_named_property(env, object, utf8name, result);
  }
}
}  // namespace electron
}  // namespace rtc
}  // namespace agora
