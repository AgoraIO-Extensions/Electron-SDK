//
// Created by LXH on 2021/1/14.
//

#ifndef IRIS_JSON_UTILS_H_
#define IRIS_JSON_UTILS_H_

#include "document.h"
#include "stringbuffer.h"
#include "writer.h"
#include <stdexcept>
#include <string>
#include <type_traits>

#define GET_VALUE_DEF(val, name, key) key = GetValue(val, #name, key);

#define GET_VALUE_DEF_UINT(val, name, key, type)                               \
  key = (type) GetValue<uint64_t>(val, #name, 0);

#define GET_VALUE_DEF_CHAR(val, name, key)                                     \
  key = GetValue<const char *>(val, #name, nullptr);

#define GET_VALUE_DEF_OBJ(val, name, key)                                      \
  const Value value_##name(rapidjson::kObjectType);                            \
  JsonDecode(                                                                  \
      GetValue<Value::ConstObject>(val, #name, value_##name.GetObject()),      \
      key);

#define GET_VALUE_DEF_PTR(val, name, key, type)                                \
  type obj_##name{};                                                           \
  do {                                                                         \
    try {                                                                      \
      GetValue<Value::ConstObject>(val, #name);                                \
    } catch (std::invalid_argument &) {                                        \
      (key) = nullptr;                                                         \
      break;                                                                   \
    }                                                                          \
    const Value value_##name(rapidjson::kObjectType);                          \
    JsonDecode(                                                                \
        GetValue<Value::ConstObject>(val, #name, value_##name.GetObject()),    \
        obj_##name);                                                           \
    (key) = &obj_##name;                                                       \
  } while (0);

#define GET_VALUE_DEF_ARR(val, name, key, count, type)                         \
  std::vector<type> vector_##name;                                             \
  const Value value_##name(rapidjson::kArrayType);                             \
  JsonDecode(GetValue<Value::ConstArray>(val, #name, value_##name.GetArray()), \
             vector_##name);                                                   \
  (key) = vector_##name.data();                                                \
  (count) = vector_##name.size();

#define GET_VALUE(val, name, key, type) key = GetValue<type>(val, #name);

#define GET_VALUE_UINT(val, name, key, type)                                   \
  key = (type) GetValue<uint64_t>(val, #name);

#define GET_VALUE_CHAR(val, name, key)                                         \
  strcpy(key, GetValue<const char *>(val, #name));

#define GET_VALUE_OBJ(val, name, key)                                          \
  auto value_##name = GetValue<Value::ConstObject>(val, #name);                \
  JsonDecode(value_##name, key);

#define GET_VALUE_PTR(val, name, key, type)                                    \
  type obj_##name{};                                                           \
  auto value_##name = GetValue<Value::ConstObject>(val, #name);                \
  JsonDecode(value_##name, obj_##name);                                        \
  (key) = &obj_##name;

#define GET_VALUE_ARR(val, name, key, count, type)                             \
  std::vector<type> vector_##name;                                             \
  JsonDecode(GetValue<Value::ConstArray>(val, #name), vector_##name);          \
  (key) = vector_##name.data();                                                \
  (count) = vector_##name.size();

#define SET_VALUE(doc, val, name, key)                                         \
  val.AddMember(#name, key, (doc).GetAllocator());

#define SET_VALUE_CHAR(doc, val, name, key)                                    \
  if ((key) == nullptr) {                                                      \
    (val).AddMember(#name, Value().Move(), (doc).GetAllocator());              \
  } else {                                                                     \
    (val).AddMember(#name, Value(key, (doc).GetAllocator()).Move(),            \
                    (doc).GetAllocator());                                     \
  }

#define SET_VALUE_OBJ(doc, val, name, key)                                     \
  Value value_##name(rapidjson::kObjectType);                                  \
  JsonEncode(doc, value_##name, key);                                          \
  (val).AddMember(#name, value_##name, (doc).GetAllocator());

#define SET_VALUE_PTR(doc, val, name, key)                                     \
  if ((key) == nullptr) {                                                      \
    (val).AddMember(#name, Value().Move(), (doc).GetAllocator());              \
  } else {                                                                     \
    Value value_##name(rapidjson::kObjectType);                                \
    JsonEncode(doc, value_##name, *(key));                                     \
    (val).AddMember(#name, value_##name, (doc).GetAllocator());                \
  }

#define SET_VALUE_ARR(doc, val, name, key, count)                              \
  if ((key) == nullptr) {                                                      \
    (val).AddMember(#name, Value().Move(), (doc).GetAllocator());              \
  } else {                                                                     \
    Value value_##name(rapidjson::kArrayType);                                 \
    JsonEncode(doc, value_##name, key, count);                                 \
    (val).AddMember(#name, value_##name, (doc).GetAllocator());                \
  }

namespace agora {
namespace iris {
template<typename T>
T GetValue(const rapidjson::Value &value, const char *key_name) {
  if (!value.HasMember(key_name)) {
    auto message = std::string("Json object has no member: ");
    throw std::invalid_argument(message + key_name);
  }
  if (!value[key_name].Is<T>()) {
    auto message = std::string("Not except type: ");
    throw std::invalid_argument(message + key_name);
  }
  return value[key_name].Get<T>();
}

template<typename T>
T GetValue(const rapidjson::Value &value, const char *key_name,
           T default_value) {
  if (!value.HasMember(key_name) || value[key_name].IsNull()) {
    return default_value;
  }
  if (!value[key_name].Is<T>()) {
    auto message = std::string("Not except type: ");
    throw std::invalid_argument(message + key_name);
  }
  return value[key_name].Get<T>();
}

static std::string ToJsonString(const rapidjson::Value &value) {
  rapidjson::StringBuffer buffer;
  rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
  value.Accept(writer);
  return buffer.GetString();
}
}// namespace iris
}// namespace agora

#endif// IRIS_JSON_UTILS_H_
