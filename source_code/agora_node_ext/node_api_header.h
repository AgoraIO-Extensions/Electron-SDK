/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:01
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2022-05-29 14:13:19
 */
#pragma once
#include "node_base.h"
#include <memory>
#include <node_buffer.h>
#include <string>
#include <vector>

namespace agora {
namespace rtc {
namespace electron {

#define DECLARE_NAPI_METHOD(name, func)                                        \
  { name, 0, func, 0, 0, 0, napi_default, 0 }

#define RETURE_NAPI_OBJ()                                                      \
  napi_value retObj;                                                           \
  status = napi_create_object(env, &retObj);                                   \
  napi_obj_set_property(env, retObj, _ret_code_str, ret);                      \
  napi_obj_set_property(env, retObj, _ret_result_str,                          \
                        agoraElectronBridge->_result);                         \
  return retObj

napi_status napi_get_value_utf8string(napi_env &env, napi_value &value,
                                      std::string &str);

napi_status napi_obj_set_property(napi_env &env, napi_value &object,
                                  const char *utf8name, int &value,
                                  int length = 0);

napi_status napi_obj_set_property(napi_env &env, napi_value &object,
                                  const char *utf8name, const char *value,
                                  int length = 0);

napi_status napi_obj_set_property(napi_env &env, napi_value &object,
                                  const char *utf8name, uint32_t &value,
                                  int length = 0);

napi_status napi_obj_set_property(napi_env &env, napi_value &object,
                                  const char *utf8name, float &value,
                                  int length = 0);

napi_status napi_obj_set_property(napi_env &env, napi_value &object,
                                  const char *utf8name, bool &value,
                                  int length = 0);

napi_status napi_obj_set_property(napi_env &env, napi_value &object,
                                  const char *utf8name, double &value,
                                  int length = 0);

napi_status napi_obj_set_property(napi_env &env, napi_value &object,
                                  const char *utf8name, int64_t &value,
                                  int length = 0);

napi_status napi_obj_set_property(napi_env &env, napi_value &object,
                                  const char *utf8name, unsigned char *value,
                                  int length = 0);

napi_status napi_obj_set_property(napi_env &env, napi_value &object,
                                  const char *utf8name, napi_value &value,
                                  int length = 0);

napi_status napi_obj_get_property(napi_env &env, napi_value &object,
                                  const char *utf8name, int &result);

napi_status napi_obj_get_property(napi_env &env, napi_value &object,
                                  const char *utf8name, uint32_t &result);

napi_status napi_obj_get_property(napi_env &env, napi_value &object,
                                  const char *utf8name, std::string &result);

napi_status napi_obj_get_property(napi_env &env, napi_value &object,
                                  const char *utf8name, napi_value &result);

}// namespace electron
}// namespace rtc
}// namespace agora
