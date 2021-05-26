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

void v8_set_object_prop_string(v8_Isolate *isolate, v8_Local<v8_Object> &obj,
                               const char *name, const char *value) {
  auto _prop_name =
      v8_String::NewFromUtf8(isolate, name, v8::NewStringType::kInternalized)
          .ToLocalChecked();
  auto _prop_value =
      v8_String::NewFromUtf8(isolate, value, v8::NewStringType::kInternalized)
          .ToLocalChecked();
  auto _result =
      obj->Set(isolate->GetCurrentContext(), _prop_name, _prop_value);
  v8_MAYBE_CHECK_RESULT(_result);
}

void v8_set_object_prop_uint8_array(v8_Isolate *isolate,
                                    v8_Local<v8_Object> &obj, const char *name,
                                    void *buffer, int size) {
  auto propName =
      v8_String::NewFromUtf8(isolate, name, v8::NewStringType::kInternalized)
          .ToLocalChecked();
  auto arrayBuffer = v8_ArrayBuffer::New(isolate, size);
  memcpy(arrayBuffer->GetContents().Data(), buffer, size);
  auto uint8Array = v8_Uint8Array::New(arrayBuffer, 0, size);
  auto result = obj->Set(isolate->GetCurrentContext(), propName, uint8Array);
  v8_MAYBE_CHECK_RESULT(result);
}

std::string nan_api_get_value_utf8string_(const v8_Local<v8_Value> &value) {
  Nan_Utf8_String _dataValue(value);
  return std::string(*_dataValue);
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