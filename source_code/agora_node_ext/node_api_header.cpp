#include "node_api_header.h"

namespace agora {
namespace rtc {
namespace electron {

napi_status napi_get_value_utf8string(napi_env &env, napi_value &value,
                                      std::string &str) {
  napi_status status;
  size_t length = 0;
  status = napi_get_value_string_utf8(env, value, nullptr, 0, &length);

  std::vector<char> strData;
  // https://github.com/nodejs/node-addon-examples/issues/83
  length += 1;
  strData.resize(length, '\0');

  size_t result = 0;
  status =
      napi_get_value_string_utf8(env, value, strData.data(), length, &result);
  str = strData.data();
  return status;
}

napi_status napi_obj_set_property(napi_env &env, napi_value &object,
                                  const char *utf8name, int &value,
                                  int length) {
  napi_status status;
  napi_value n_value;
  status = napi_create_int32(env, value, &n_value);
  status = napi_set_named_property(env, object, utf8name, n_value);
  return status;
}

napi_status napi_obj_set_property(napi_env &env, napi_value &object,
                                  const char *utf8name, const char *value,
                                  int length) {
  napi_status status;
  napi_value n_value;
  status = napi_create_string_utf8(env, value, strlen(value), &n_value);
  status = napi_set_named_property(env, object, utf8name, n_value);
  return status;
}

napi_status napi_obj_set_property(napi_env &env, napi_value &object,
                                  const char *utf8name, uint32_t &value,
                                  int length) {
  napi_status status;
  napi_value n_value;
  status = napi_create_uint32(env, value, &n_value);
  status = napi_set_named_property(env, object, utf8name, n_value);
  return status;
}

napi_status napi_obj_set_property(napi_env &env, napi_value &object,
                                  const char *utf8name, float &value,
                                  int length) {
  napi_status status;
  napi_value n_value;
  status = napi_create_double(env, value, &n_value);
  status = napi_set_named_property(env, object, utf8name, n_value);
  return status;
}

napi_status napi_obj_set_property(napi_env &env, napi_value &object,
                                  const char *utf8name, bool &value,
                                  int length) {
  napi_status status;
  napi_value n_value;
  status = napi_create_int32(env, value, &n_value);
  status = napi_set_named_property(env, object, utf8name, n_value);
  return status;
}

napi_status napi_obj_set_property(napi_env &env, napi_value &object,
                                  const char *utf8name, double &value,
                                  int length) {
  napi_status status;
  napi_value n_value;
  status = napi_create_double(env, value, &n_value);
  status = napi_set_named_property(env, object, utf8name, n_value);
  return status;
}

napi_status napi_obj_set_property(napi_env &env, napi_value &object,
                                  const char *utf8name, int64_t &value,
                                  int length) {
  napi_status status;
  napi_value n_value;
  status = napi_create_int64(env, value, &n_value);
  status = napi_set_named_property(env, object, utf8name, n_value);
  return status;
}

napi_status napi_obj_set_property(napi_env &env, napi_value &object,
                                  const char *utf8name, unsigned char *value,
                                  int length) {
  napi_status status;
  napi_value n_value;
  // just for get ArrayBuffer pointer.
  unsigned char *array_buffer = value;
  status =
      napi_create_arraybuffer(env, length, (void **) &array_buffer, &n_value);
  memcpy(array_buffer, value, length);

  napi_value typed_array_value;
  status = napi_create_typedarray(env, napi_uint8_array, length, n_value, 0,
                                  &typed_array_value);
  status = napi_set_named_property(env, object, utf8name, typed_array_value);
  return status;
}

napi_status napi_obj_set_property(napi_env &env, napi_value &object,
                                  const char *utf8name, napi_value &value,
                                  int length) {
  napi_status status;
  status = napi_set_named_property(env, object, utf8name, value);
  return status;
}

napi_status napi_obj_get_property(napi_env &env, napi_value &object,
                                  const char *utf8name, int &result) {
  napi_status status;
  napi_value retValue;
  napi_get_named_property(env, object, utf8name, &retValue);
  status = napi_get_value_int32(env, retValue, &result);
  return status;
}

napi_status napi_obj_get_property(napi_env &env, napi_value &object,
                                  const char *utf8name, uint32_t &result) {
  napi_status status;
  napi_value retValue;
  napi_get_named_property(env, object, utf8name, &retValue);
  status = napi_get_value_uint32(env, retValue, &result);
  return status;
}

napi_status napi_obj_get_property(napi_env &env, napi_value &object,
                                  const char *utf8name, std::string &result) {
  napi_status status;
  napi_value retValue;
  napi_get_named_property(env, object, utf8name, &retValue);
  status = napi_get_value_utf8string(env, retValue, result);
  return status;
}

napi_status napi_obj_get_property(napi_env &env, napi_value &object,
                                  const char *utf8name, napi_value &result) {
  napi_status status;
  status = napi_get_named_property(env, object, utf8name, &result);
  return status;
}

}// namespace electron
}// namespace rtc
}// namespace agora
