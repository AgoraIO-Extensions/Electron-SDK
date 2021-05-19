/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:52:54
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-16 21:56:34
 */
#include "nan_api.h"

namespace agora {
namespace rtc {
namespace electron {
std::string nan_api_get_value_utf8string_(const v8_Local<v8_Value> &value) {
  Nan_Utf8_String _dataValue(value);
  return std::string(*_dataValue);
}

int nan_api_get_value_int32_(const v8_Local<v8_Value> &value) {
  return Nan::To<v8_Int32>(value).ToLocalChecked()->Value();
}

unsigned int nan_api_get_value_uint32_(const v8_Local<v8_Value> &value) {
  return Nan::To<v8_Uint32>(value).ToLocalChecked()->Value();
}

v8_Local<v8_Value> nan_create_local_value_string_(v8_Isolate *isolate,
                                                  const char *value) {
  return v8_String::NewFromUtf8(isolate, value ? value : "",
                                v8::NewStringType::kInternalized)
      .ToLocalChecked();
}

v8_Local<v8_Object> nan_api_get_value_object_(v8_Isolate *isolate,
                                              const v8_Local<v8_Value> &value) {
  return value->ToObject(isolate->GetCurrentContext()).ToLocalChecked();
}

v8_Local<v8_Value>
nan_api_get_object_property_value_(v8_Isolate *isolate,
                                   const v8_Local<v8_Object> &obj,
                                   const std::string &propName) {
  v8_Local<v8_Name> _keyName = Nan::New<v8_String>(propName).ToLocalChecked();
  return obj->Get(isolate->GetCurrentContext(), _keyName).ToLocalChecked();
}

int nan_api_get_object_int32_(v8_Isolate *isolate,
                              const v8_Local<v8_Object> &obj,
                              const std::string &propName) {
  v8_Local<v8_Value> value =
      nan_api_get_object_property_value_(isolate, obj, propName);
  return nan_api_get_value_int32_(value);
}

unsigned int nan_api_get_object_uint32_(v8_Isolate *isolate,
                                        const v8_Local<v8_Object> &obj,
                                        const std::string &propName) {
  v8_Local<v8_Value> value =
      nan_api_get_object_property_value_(isolate, obj, propName);
  return nan_api_get_value_uint32_(value);
}

std::string nan_api_get_object_utf8string_(v8_Isolate *isolate,
                                           const v8_Local<v8_Object> &obj,
                                           const std::string &propName) {
  v8_Local<v8_Value> value =
      nan_api_get_object_property_value_(isolate, obj, propName);
  return nan_api_get_value_utf8string_(value);
}
} // namespace electron
} // namespace rtc
} // namespace agora