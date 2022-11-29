/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:01
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2022-05-29 14:13:19
 */
#pragma once
#include <node_buffer.h>
#include <string.h>
#include <memory>
#include <vector>
#include "node_base.h"

namespace agora {
namespace rtc {
namespace electron {

#define NAPI_CALL(env, call)                                                   \
  do {                                                                         \
    napi_status status = (call);                                               \
    assert(status == napi_ok);                                                 \
    if (status != napi_ok) {                                                   \
      const napi_extended_error_info *error_info = NULL;                       \
      napi_get_last_error_info((env), &error_info);                            \
      const char *err_message = error_info->error_message;                     \
      bool is_pending;                                                         \
      napi_is_exception_pending((env), &is_pending);                           \
      if (!is_pending) {                                                       \
        const char *message =                                                  \
            (err_message == NULL) ? "empty error message" : err_message;       \
        LOG_F(ERROR, "napi error: %s", message);                               \
        napi_throw_error((env), NULL, message);                                \
        return NULL;                                                           \
      }                                                                        \
    }                                                                          \
  } while (0)

#define NAPI_CALL_NORETURN(env, call)                                          \
  do {                                                                         \
    napi_status status = (call);                                               \
    assert(status == napi_ok);                                                 \
    if (status != napi_ok) {                                                   \
      const napi_extended_error_info *error_info = NULL;                       \
      napi_get_last_error_info((env), &error_info);                            \
      const char *err_message = error_info->error_message;                     \
      bool is_pending;                                                         \
      napi_is_exception_pending((env), &is_pending);                           \
      const char *message =                                                    \
          (err_message == NULL) ? "empty error message" : err_message;         \
      LOG_F(ERROR, "napi error: %s", message);                                 \
      if (!is_pending) {                                                       \
        napi_throw_error((env), NULL, message);                                \
        return;                                                                \
      }                                                                        \
    }                                                                          \
  } while (0)

#define DECLARE_NAPI_METHOD(name, func) \
  { name, 0, func, 0, 0, 0, napi_default, 0 }

#define RETURE_NAPI_OBJ()                                                      \
  napi_value retObj;                                                           \
  NAPI_CALL(env, napi_create_object(env, &retObj));                            \
  NAPI_CALL(env, napi_obj_set_property(env, retObj, _ret_code_str, ret));      \
  NAPI_CALL(env, napi_obj_set_property(env, retObj, _ret_result_str,           \
                                       agoraElectronBridge->_result));         \
  return retObj

napi_status napi_get_value_utf8string(napi_env& env,
                                      napi_value& value,
                                      std::string& str);

napi_status napi_obj_set_property(napi_env& env,
                                  napi_value& object,
                                  const char* utf8name,
                                  int& value,
                                  int length = 0);

napi_status napi_obj_set_property(napi_env& env,
                                  napi_value& object,
                                  const char* utf8name,
                                  const char* value,
                                  int length = 0);

napi_status napi_obj_set_property(napi_env& env,
                                  napi_value& object,
                                  const char* utf8name,
                                  uint32_t& value,
                                  int length = 0);

napi_status napi_obj_set_property(napi_env& env,
                                  napi_value& object,
                                  const char* utf8name,
                                  float& value,
                                  int length = 0);

napi_status napi_obj_set_property(napi_env& env,
                                  napi_value& object,
                                  const char* utf8name,
                                  bool& value,
                                  int length = 0);

napi_status napi_obj_set_property(napi_env& env,
                                  napi_value& object,
                                  const char* utf8name,
                                  double& value,
                                  int length = 0);

napi_status napi_obj_set_property(napi_env& env,
                                  napi_value& object,
                                  const char* utf8name,
                                  int64_t& value,
                                  int length = 0);

napi_status napi_obj_set_property(napi_env& env,
                                  napi_value& object,
                                  const char* utf8name,
                                  unsigned char* value,
                                  int length = 0);

napi_status napi_obj_set_property(napi_env& env,
                                  napi_value& object,
                                  const char* utf8name,
                                  napi_value& value,
                                  int length = 0);

napi_status napi_obj_get_property(napi_env& env,
                                  napi_value& object,
                                  const char* utf8name,
                                  int& result);

napi_status napi_obj_get_property(napi_env& env,
                                  napi_value& object,
                                  const char* utf8name,
                                  uint32_t& result);

napi_status napi_obj_get_property(napi_env& env,
                                  napi_value& object,
                                  const char* utf8name,
                                  std::string& result);

napi_status napi_obj_get_property(napi_env& env,
                                  napi_value& object,
                                  const char* utf8name,
                                  napi_value& result);
}  // namespace electron
}  // namespace rtc
}  // namespace agora
