/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 20:53:01
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-21 20:12:13
 */
#pragma once
#include "node_base.h"
#include <memory>
#include <nan.h>
#include <node.h>
#include <string>

namespace agora {
namespace rtc {
namespace electron {
template <typename T> using Nan_Persistent = Nan::Persistent<T>;
template <typename T>
using Nan_FunctionCallbackInfo = Nan::FunctionCallbackInfo<T>;
template <typename T>
using v8_FunctionCallbackInfo = v8::FunctionCallbackInfo<T>;
template <typename T> using v8_Local = v8::Local<T>;
template <class T> using v8_Maybe = v8::Maybe<T>;
using Nan_Utf8_String = Nan::Utf8String;
using v8_Object = v8::Object;
using v8_Value = v8::Value;
using v8_Context = v8::Context;
using v8_Isolate = v8::Isolate;
using v8_FunctionTemplate = v8::FunctionTemplate;
using v8_String = v8::String;
using v8_Uint32 = v8::Uint32;
using v8_Int32 = v8::Int32;
using v8_Function = v8::Function;
using v8_HandleScope = v8::HandleScope;
using v8_External = v8::External;
using v8_Array = v8::Array;
using v8_ArrayBuffer = v8::ArrayBuffer;
using v8_Boolean = v8::Boolean;
using v8_Uint8Array = v8::Uint8Array;
using v8_Name = v8::Name;

template <typename T, typename O>
void v8_set_object_prop_value(v8_Isolate *isolate, v8_Local<v8_Object> &obj,
                              const char *name, T value) {
  auto _prop_name =
      v8_String::NewFromUtf8(isolate, name, v8::NewStringType::kInternalized)
          .ToLocalChecked();

  auto _prop_value = O::New(isolate, value);
  auto _result =
      obj->Set(isolate->GetCurrentContext(), _prop_name, _prop_value);
}

void v8_set_object_prop_string(v8_Isolate *isolate, v8_Local<v8_Object> &obj,
                               const char *name, const char *value);

void v8_set_object_prop_uint8_array(v8_Isolate *isolate,
                                    v8_Local<v8_Object> &obj, const char *name,
                                    void *buffer, int size);

#define v8_MAYBE_CHECK_RESULT(maybe)                                           \
  {                                                                            \
    if (maybe.IsNothing()) {                                                   \
    }                                                                          \
  }

#define v8_MAYBE_LOCAL_CHECK_RESULT(maybe)                                     \
  {                                                                            \
    if (maybe.IsEmpty()) {                                                     \
    }                                                                          \
  }

std::string nan_api_get_value_utf8string_(const v8_Local<v8_Value> &value);

v8_Local<v8_Value>
nan_api_get_object_property_value_(v8_Isolate *isolate,
                                   const v8_Local<v8_Object> &obj,
                                   const std::string &propName);

template <typename T, typename N>
T nan_api_get_value(const v8_Local<v8_Value> &value) {
  return Nan::To<N>(value).ToLocalChecked()->Value();
}

template <typename T, typename N>
T nan_api_get_object_value(v8_Isolate *isolate, const v8_Local<v8_Object> &obj,
                           const std::string &propName) {
  auto value = nan_api_get_object_property_value_(isolate, obj, propName);
  return nan_api_get_value<T, N>(value);
}

v8_Local<v8_Object> nan_api_get_value_object_(v8_Isolate *isolate,
                                              const v8_Local<v8_Value> &value);

std::string nan_api_get_object_utf8string_(v8_Isolate *isolate,
                                           const v8_Local<v8_Object> &obj,
                                           const std::string &propName);

v8_Local<v8_Value> nan_create_local_value_string_(v8_Isolate *isolate,
                                                  const char *value);

} // namespace electron
} // namespace rtc
} // namespace agora
