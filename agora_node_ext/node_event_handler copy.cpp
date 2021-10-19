/*
* Copyright (c) 2017 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2017
*/

#include "node_event_handler.h"
#include "node_log.h"
#include <stdio.h>
#include "node_uid.h"
#include "agora_rtc_engine.h"
#include "uv.h"
#include "node_async_queue.h"
#include <vector>
#include <iostream>

namespace agora {
    namespace rtc {

      struct CustomRtcConnection {
        std::string channelId;
        uid_t localUid;
        CustomRtcConnection(const RtcConnection &rtcConnection){
          channelId = rtcConnection.channelId;
          localUid = rtcConnection.localUid;
        }
      };
#define FUNC_TRACE 

        NodeEventHandler::NodeEventHandler(NodeRtcEngine *pEngine)
            : m_engine(pEngine)
        {
        }

        NodeEventHandler::~NodeEventHandler() 
        {
            for (auto& handler : m_callbacks) {
                delete handler.second;
            }
        }

#define MAKE_JS_CALL_0(ev) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            Local<Context> context = isolate->GetCurrentContext();\
            NodeEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 0, nullptr);\
        }

#define MAKE_JS_CALL_1(ev, type, param) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            Local<Context> context = isolate->GetCurrentContext();\
            Local<Value> argv[1]{ napi_create_##type##_(isolate, param)\
                                };\
            NodeEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 1, argv);\
        }

#define MAKE_JS_CALL_2(ev, type1, param1, type2, param2) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            Local<Context> context = isolate->GetCurrentContext();\
            Local<Value> argv[2]{ napi_create_##type1##_(isolate, param1),\
                                  napi_create_##type2##_(isolate, param2)\
                                };\
            NodeEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 2, argv);\
        }

#define MAKE_JS_CALL_3(ev, type1, param1, type2, param2, type3, param3) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            Local<Context> context = isolate->GetCurrentContext();\
            Local<Value> argv[3]{ napi_create_##type1##_(isolate, param1),\
                                  napi_create_##type2##_(isolate, param2),\
                                  napi_create_##type3##_(isolate, param3) \
                                };\
            NodeEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 3, argv);\
        }

#define MAKE_JS_CALL_4(ev, type1, param1, type2, param2, type3, param3, type4, param4) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            Local<Context> context = isolate->GetCurrentContext();\
            Local<Value> argv[4]{ napi_create_##type1##_(isolate, param1),\
                                  napi_create_##type2##_(isolate, param2),\
                                  napi_create_##type3##_(isolate, param3), \
                                  napi_create_##type4##_(isolate, param4), \
                                };\
            NodeEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 4, argv);\
        }

#define MAKE_JS_CALL_5(ev, type1, param1, type2, param2, type3, param3, type4, param4, type5, param5) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            Local<Context> context = isolate->GetCurrentContext();\
            Local<Value> argv[5]{ napi_create_##type1##_(isolate, param1),\
                                  napi_create_##type2##_(isolate, param2),\
                                  napi_create_##type3##_(isolate, param3), \
                                  napi_create_##type4##_(isolate, param4), \
                                  napi_create_##type5##_(isolate, param5), \
                                };\
            NodeEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 5, argv);\
        }

#define MAKE_JS_CALL_6(ev, type1, param1, type2, param2, type3, param3, type4, param4, type5, param5, type6, param6) \
        auto it = m_callbacks.find(ev); \
        if (it != m_callbacks.end()) {\
            Isolate *isolate = Isolate::GetCurrent();\
            HandleScope scope(isolate);\
            Local<Context> context = isolate->GetCurrentContext();\
            Local<Value> argv[6]{ napi_create_##type1##_(isolate, param1),\
                                  napi_create_##type2##_(isolate, param2),\
                                  napi_create_##type3##_(isolate, param3), \
                                  napi_create_##type4##_(isolate, param4), \
                                  napi_create_##type5##_(isolate, param5), \
                                  napi_create_##type6##_(isolate, param6), \
                                };\
            NodeEventCallback& cb = *it->second;\
            cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 6, argv);\
        }

#define CHECK_NAPI_OBJ(obj) \
    if (obj.IsEmpty()) \
        break;

#define NODE_SET_OBJ_PROP_STRING(obj, name, val) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        CHECK_NAPI_OBJ(propName); \
        Local<Value> propVal = String::NewFromUtf8(isolate, val, NewStringType::kInternalized).ToLocalChecked(); \
        CHECK_NAPI_OBJ(propVal); \
        v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, propVal); \
        if(!ret.IsNothing()) { \
            if(!ret.ToChecked()) { \
                break; \
            } \
        } \
    }

#define NODE_SET_OBJ_PROP_UINT32(obj, name, val) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        CHECK_NAPI_OBJ(propName); \
        Local<Value> propVal = v8::Uint32::New(isolate, val); \
        CHECK_NAPI_OBJ(propVal); \
        v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, propVal); \
        if(!ret.IsNothing()) { \
            if(!ret.ToChecked()) { \
                break; \
            } \
        } \
    }

#define NODE_SET_OBJ_PROP_UID(obj, name, val) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        CHECK_NAPI_OBJ(propName); \
        Local<Value> propVal = NodeUid::getNodeValue(isolate, val); \
        CHECK_NAPI_OBJ(propVal); \
        v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, propVal); \
        if(!ret.IsNothing()) { \
            if(!ret.ToChecked()) { \
                break; \
            } \
        } \
    }

#define NODE_SET_OBJ_PROP_NUMBER(obj, name, val) \
    { \
        Local<Value> propName = String::NewFromUtf8(isolate, name, NewStringType::kInternalized).ToLocalChecked(); \
        CHECK_NAPI_OBJ(propName); \
        Local<Value> propVal = v8::Number::New(isolate, val); \
        CHECK_NAPI_OBJ(propVal); \
        v8::Maybe<bool> ret = obj->Set(isolate->GetCurrentContext(), propName, propVal); \
        if(!ret.IsNothing()) { \
            if(!ret.ToChecked()) { \
                break; \
            } \
        } \
    }

      // private

      void NodeEventHandler::onAudioVolumeIndication_node(const CustomRtcConnection& connection, AudioVolumeInfo* speakers, unsigned int speakerNumber, int totalVolume)
      {
        FUNC_TRACE;
        auto it = m_callbacks.find(RTC_EVENT_AUDIO_VOLUME_INDICATION);
        if (it != m_callbacks.end()) {
          Isolate *isolate = Isolate::GetCurrent();
          HandleScope scope(isolate);
          Local<Context> context = isolate->GetCurrentContext();
          Local<v8::Array> arrSpeakers = v8::Array::New(isolate, speakerNumber);
          for (unsigned int i = 0; i < speakerNumber; i++) {
            Local<Object> obj = Object::New(isolate);
            obj->Set(context, napi_create_string_(isolate, "uid"), napi_create_uid_(isolate, speakers[i].uid));
            obj->Set(context, napi_create_string_(isolate, "volume"), napi_create_uint32_(isolate, speakers[i].volume));
            arrSpeakers->Set(context, i, obj);
          }

          Local<Object> connectionObj = Object::New(isolate);
          connectionObj->Set(context, napi_create_string_(isolate, "localUid"), napi_create_uid_(isolate, connection.localUid));
          connectionObj->Set(context, napi_create_string_(isolate, "channelId"), napi_create_string_(isolate, connection.channelId.c_str()));

          Local<Value> argv[4]{
            connectionObj,
            arrSpeakers,
            napi_create_uint32_(isolate, speakerNumber),
            napi_create_uint32_(isolate, totalVolume)
          };
          NodeEventCallback& cb = *it->second;
          cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 4, argv);
        }
      }

      void NodeEventHandler::onRtcStats_node_with_type(const char*type, const CustomRtcConnection& connection, const RtcStats& stats)
      {
        unsigned int usercount = stats.userCount;
        LOG_INFO("duration : %d, tx :%d, rx :%d, txbr :%d, rxbr :%d, txAudioBr :%d, rxAudioBr :%d, users :%d\n",
          stats.duration, stats.txBytes, stats.rxBytes, stats.txKBitRate, stats.rxKBitRate, stats.txAudioKBitRate,
          stats.rxAudioKBitRate, usercount);
        do {
          Isolate *isolate = Isolate::GetCurrent();
          HandleScope scope(isolate);
          Local<Context> context = isolate->GetCurrentContext();
          Local<Object> obj = Object::New(isolate);
          CHECK_NAPI_OBJ(obj);
          NODE_SET_OBJ_PROP_UINT32(obj, "duration", stats.duration);
          NODE_SET_OBJ_PROP_UINT32(obj, "txBytes", stats.txBytes);
          NODE_SET_OBJ_PROP_UINT32(obj, "rxBytes", stats.rxBytes);
          NODE_SET_OBJ_PROP_UINT32(obj, "txKBitRate", stats.txKBitRate);
          NODE_SET_OBJ_PROP_UINT32(obj, "rxKBitRate", stats.rxKBitRate);
          NODE_SET_OBJ_PROP_UINT32(obj, "rxAudioBytes", stats.rxAudioBytes);
          NODE_SET_OBJ_PROP_UINT32(obj, "txAudioBytes", stats.txAudioBytes);
          NODE_SET_OBJ_PROP_UINT32(obj, "rxVideoBytes", stats.rxVideoBytes);
          NODE_SET_OBJ_PROP_UINT32(obj, "txVideoBytes", stats.txVideoBytes);
          NODE_SET_OBJ_PROP_UINT32(obj, "rxAudioKBitRate", stats.rxAudioKBitRate);
          NODE_SET_OBJ_PROP_UINT32(obj, "txAudioKBitRate", stats.txAudioKBitRate);
          NODE_SET_OBJ_PROP_UINT32(obj, "rxVideoKBitRate", stats.rxVideoKBitRate);
          NODE_SET_OBJ_PROP_UINT32(obj, "txVideoKBitRate", stats.txVideoKBitRate);
          NODE_SET_OBJ_PROP_UINT32(obj, "lastmileDelay", stats.lastmileDelay);
          NODE_SET_OBJ_PROP_UINT32(obj, "users", usercount);
          NODE_SET_OBJ_PROP_UINT32(obj, "userCount", stats.userCount);
          NODE_SET_OBJ_PROP_NUMBER(obj, "cpuAppUsage", stats.cpuAppUsage);
          NODE_SET_OBJ_PROP_NUMBER(obj, "cpuTotalUsage", stats.cpuTotalUsage);
          NODE_SET_OBJ_PROP_NUMBER(obj, "memoryAppUsageRatio", stats.memoryAppUsageRatio);
          NODE_SET_OBJ_PROP_NUMBER(obj, "memoryAppUsageInKbytes", stats.memoryAppUsageInKbytes);
          NODE_SET_OBJ_PROP_NUMBER(obj, "memoryTotalUsageRatio", stats.memoryTotalUsageRatio);
          NODE_SET_OBJ_PROP_NUMBER(obj, "txPacketLossRate", stats.txPacketLossRate);
          NODE_SET_OBJ_PROP_NUMBER(obj, "rxPacketLossRate", stats.rxPacketLossRate);
          

          Local<Object> connectionObj = Object::New(isolate);
          connectionObj->Set(context, napi_create_string_(isolate, "localUid"), napi_create_uid_(isolate, connection.localUid));
          connectionObj->Set(context, napi_create_string_(isolate, "channelId"), napi_create_string_(isolate, connection.channelId.c_str()));


          Local<Value> arg[2] = { connectionObj, obj };
          auto it = m_callbacks.find(type);
          if (it != m_callbacks.end()) {
            it->second->callback.Get(isolate)->Call(context, it->second->js_this.Get(isolate), 2, arg);
          }
        } while (false);
      }

      void NodeEventHandler::onLocalAudioStats_node(const CustomRtcConnection& connection, const LocalAudioStats& stats)
      {
        FUNC_TRACE;
        do {
          Isolate* isolate = Isolate::GetCurrent();
          HandleScope scope(isolate);
          Local<Context> context = isolate->GetCurrentContext();
          Local<Object> obj = Object::New(isolate);
          CHECK_NAPI_OBJ(obj);

          NODE_SET_OBJ_PROP_UINT32(obj, "numChannels", stats.numChannels);
          NODE_SET_OBJ_PROP_UINT32(obj, "sentSampleRate", stats.sentSampleRate);
          NODE_SET_OBJ_PROP_UINT32(obj, "sentBitrate", stats.sentBitrate);

          Local<Object> connectionObj = Object::New(isolate);
          connectionObj->Set(context, napi_create_string_(isolate, "localUid"), napi_create_uid_(isolate, connection.localUid));
          connectionObj->Set(context, napi_create_string_(isolate, "channelId"), napi_create_string_(isolate, connection.channelId.c_str()));

          Local<Value> arg[2] = { connectionObj, obj };
          auto it = m_callbacks.find(RTC_EVENT_LOCAL_AUDIO_STATS);
          if (it != m_callbacks.end()) {
            it->second->callback.Get(isolate)->Call(context, it->second->js_this.Get(isolate), 2, arg);
          }
        } while (false);
      }

      void NodeEventHandler::onLocalVideoStats_node(const CustomRtcConnection& connection, const LocalVideoStats& stats)
      {
        FUNC_TRACE;
        do {
          Isolate* isolate = Isolate::GetCurrent();
          HandleScope scope(isolate);
          Local<Context> context = isolate->GetCurrentContext();
          Local<Object> obj = Object::New(isolate);
          CHECK_NAPI_OBJ(obj);

          NODE_SET_OBJ_PROP_UINT32(obj, "sentBitrate", stats.sentBitrate);
          NODE_SET_OBJ_PROP_UINT32(obj, "sentFrameRate", stats.sentFrameRate);
          NODE_SET_OBJ_PROP_UINT32(obj, "targetBitrate", stats.targetBitrate);
          NODE_SET_OBJ_PROP_UINT32(obj, "targetFrameRate", stats.targetFrameRate);
          NODE_SET_OBJ_PROP_UINT32(obj, "encoderOutputFrameRate", stats.encoderOutputFrameRate);
          NODE_SET_OBJ_PROP_UINT32(obj, "rendererOutputFrameRate", stats.rendererOutputFrameRate);
          NODE_SET_OBJ_PROP_UINT32(obj, "encodedBitrate", stats.encodedBitrate);
          NODE_SET_OBJ_PROP_UINT32(obj, "encodedFrameWidth", stats.encodedFrameWidth);
          NODE_SET_OBJ_PROP_UINT32(obj, "encodedFrameHeight", stats.encodedFrameHeight);
          NODE_SET_OBJ_PROP_UINT32(obj, "encodedFrameCount", stats.encodedFrameCount);
          NODE_SET_OBJ_PROP_UINT32(obj, "codecType", stats.codecType);

          Local<Object> connectionObj = Object::New(isolate);
          connectionObj->Set(context, napi_create_string_(isolate, "localUid"), napi_create_uid_(isolate, connection.localUid));
          connectionObj->Set(context, napi_create_string_(isolate, "channelId"), napi_create_string_(isolate, connection.channelId.c_str()));

          Local<Value> arg[2] = { connectionObj, obj };
          auto it = m_callbacks.find(RTC_EVENT_LOCAL_VIDEO_STATS);
          if (it != m_callbacks.end()) {
            it->second->callback.Get(isolate)->Call(context, it->second->js_this.Get(isolate), 2, arg); \
          }
        } while (false);
      }

      void NodeEventHandler::onRemoteVideoStats_node(const CustomRtcConnection& connection, const RemoteVideoStats& stats)
      {
        FUNC_TRACE;
        do {
          Isolate *isolate = Isolate::GetCurrent();
          HandleScope scope(isolate);
          Local<Context> context = isolate->GetCurrentContext();
          Local<Object> obj = Object::New(isolate);
          CHECK_NAPI_OBJ(obj);
          NODE_SET_OBJ_PROP_UINT32(obj, "uid", stats.uid);
          NODE_SET_OBJ_PROP_UINT32(obj, "delay", stats.delay);
          NODE_SET_OBJ_PROP_UINT32(obj, "width", stats.width);
          NODE_SET_OBJ_PROP_UINT32(obj, "height", stats.height);
          NODE_SET_OBJ_PROP_UINT32(obj, "receivedBitrate", stats.receivedBitrate);
          NODE_SET_OBJ_PROP_UINT32(obj, "decoderOutputFrameRate", stats.decoderOutputFrameRate);
          NODE_SET_OBJ_PROP_UINT32(obj, "rendererOutputFrameRate", stats.rendererOutputFrameRate);
          NODE_SET_OBJ_PROP_UINT32(obj, "rxStreamType", stats.rxStreamType);
          NODE_SET_OBJ_PROP_UINT32(obj, "totalFrozenTime", stats.totalFrozenTime);
          NODE_SET_OBJ_PROP_UINT32(obj, "frozenRate", stats.frozenRate);
          NODE_SET_OBJ_PROP_UINT32(obj, "packetLossRate", stats.packetLossRate);

          Local<Object> connectionObj = Object::New(isolate);
          connectionObj->Set(context, napi_create_string_(isolate, "localUid"), napi_create_uid_(isolate, connection.localUid));
          connectionObj->Set(context, napi_create_string_(isolate, "channelId"), napi_create_string_(isolate, connection.channelId.c_str()));

          Local<Value> arg[2] = { connectionObj, obj };
          auto it = m_callbacks.find(RTC_EVENT_REMOTE_VIDEO_STATS);
          if (it != m_callbacks.end()) {
            it->second->callback.Get(isolate)->Call(context, it->second->js_this.Get(isolate), 2, arg);
          }
        } while (false);
      }

      void NodeEventHandler::onRemoteAudioStats_node(const CustomRtcConnection& connection, const RemoteAudioStats& stats)
      {
        FUNC_TRACE;
        do {
          Isolate* isolate = Isolate::GetCurrent();
          HandleScope scope(isolate);
          Local<Context> context = isolate->GetCurrentContext();
          Local<Object> obj = Object::New(isolate);
          CHECK_NAPI_OBJ(obj);
          NODE_SET_OBJ_PROP_UID(obj, "uid", stats.uid);
          NODE_SET_OBJ_PROP_UINT32(obj, "quality", stats.quality);
          NODE_SET_OBJ_PROP_UINT32(obj, "networkTransportDelay", stats.networkTransportDelay);
          NODE_SET_OBJ_PROP_UINT32(obj, "jitterBufferDelay", stats.jitterBufferDelay);
          NODE_SET_OBJ_PROP_UINT32(obj, "audioLossRate", stats.audioLossRate);
          NODE_SET_OBJ_PROP_UINT32(obj, "numChannels", stats.numChannels);
          NODE_SET_OBJ_PROP_UINT32(obj, "receivedSampleRate", stats.receivedSampleRate);
          NODE_SET_OBJ_PROP_UINT32(obj, "receivedBitrate", stats.receivedBitrate);
          NODE_SET_OBJ_PROP_UINT32(obj, "totalFrozenTime", stats.totalFrozenTime);
          NODE_SET_OBJ_PROP_UINT32(obj, "frozenRate", stats.frozenRate);

          Local<Object> connectionObj = Object::New(isolate);
          connectionObj->Set(context, napi_create_string_(isolate, "localUid"), napi_create_uid_(isolate, connection.localUid));
          connectionObj->Set(context, napi_create_string_(isolate, "channelId"), napi_create_string_(isolate, connection.channelId.c_str()));

          Local<Value> arg[2] = { connectionObj, obj };
          auto it = m_callbacks.find(RTC_EVENT_REMOTE_AUDIO_STATS);
          if (it != m_callbacks.end()) {
            it->second->callback.Get(isolate)->Call(context, it->second->js_this.Get(isolate), 2, arg);
          }
        } while (false);
      }

      void NodeEventHandler::sendJSWithConnection(const char* type, int count, const CustomRtcConnection connection, ...) {
        do {
          Isolate* isolate = Isolate::GetCurrent();
          HandleScope scope(isolate);
          Local<Context> context = isolate->GetCurrentContext();
          Local<Object> obj = Object::New(isolate);

          NODE_SET_OBJ_PROP_STRING(obj, "channelId", connection.channelId.c_str());
          NODE_SET_OBJ_PROP_UID(obj, "localUid", connection.localUid);

          va_list ap;
          va_start(ap, connection);

          std::vector<Local<Value>> valueList;
          valueList.push_back(obj);
          for (int i = 0; i < count - 1; i++) {
            auto item = va_arg(ap, Local<Value>);
            valueList.push_back(item);
          }
          va_end(ap);

          auto it = m_callbacks.find(type);
          if (it != m_callbacks.end()) {
            it->second->callback.Get(isolate)->Call(context, it->second->js_this.Get(isolate), count, valueList.data());
          }
        } while (false);
      }
      
      //public
      void NodeEventHandler::fireApiError(const char* funcName)
      {
        FUNC_TRACE;
        MAKE_JS_CALL_1(RTC_EVENT_API_ERROR, string, funcName);
      }

      void NodeEventHandler::addEventHandler(const std::string& eventName, Persistent<Object>& obj, Persistent<Function>& callback)
      {
        FUNC_TRACE;
        NodeEventCallback* cb = new NodeEventCallback();
        cb->js_this.Reset(obj);
        cb->callback.Reset(callback);
        m_callbacks.emplace(eventName, cb);
      }

      void NodeEventHandler::onError(int err, const char* msg)
      {
        std::string errorDesc;
        if (msg)
          errorDesc.assign(msg);
        node_async_call::async_call([this, err, errorDesc] {
          MAKE_JS_CALL_2(RTC_EVENT_ERROR, int32, err, string, errorDesc.c_str());
          });
      }

      void NodeEventHandler::onWarning(int warn, const char* msg)
      {
        FUNC_TRACE;
        std::string message;
        if (msg)
          message.assign(msg);
        node_async_call::async_call([this, warn, message]() {
          MAKE_JS_CALL_2(RTC_EVENT_WARNING, int32, warn, string, message.c_str());
          });
      }

      void NodeEventHandler::onApiCallExecuted(int err, const char* api, const char* result)
      {
        FUNC_TRACE;
        std::string apiName(api);
        node_async_call::async_call([this, apiName, err] {
          MAKE_JS_CALL_2(RTC_EVENT_APICALL_EXECUTED, string, apiName.c_str(), int32, err);
          });
      }

      void NodeEventHandler::onAudioVolumeIndication(const RtcConnection& connection, const AudioVolumeInfo* speaker, unsigned int speakerNumber, int totalVolume)
      {
        FUNC_TRACE;
        CustomRtcConnection  _connection(connection);
        if (speaker) {
          AudioVolumeInfo* localSpeakers = new AudioVolumeInfo[speakerNumber];
          for (unsigned int i = 0; i < speakerNumber; i++) {
            AudioVolumeInfo tmp = speaker[i];
            localSpeakers[i].uid = tmp.uid;
            localSpeakers[i].volume = tmp.volume;
          }
          node_async_call::async_call([this, _connection, localSpeakers, speakerNumber, totalVolume] {
            this->onAudioVolumeIndication_node(_connection, localSpeakers, speakerNumber, totalVolume);
            delete[]localSpeakers;
            });
        }
        else {
          node_async_call::async_call([this, _connection, speakerNumber, totalVolume] {
            this->onAudioVolumeIndication_node(_connection, NULL, speakerNumber, totalVolume);
            });
        }
      }

      void NodeEventHandler::onUserJoined(const RtcConnection& connection, uid_t remoteUid, int elapsed)
      {
        FUNC_TRACE;
        CustomRtcConnection  _connection(connection);
        node_async_call::async_call([this, _connection, remoteUid, elapsed] {
          Isolate* isolate = Isolate::GetCurrent();
          HandleScope scope(isolate);
          this->sendJSWithConnection(RTC_EVENT_USER_JOINED,
            3,
            _connection,
            napi_create_uid_(isolate, remoteUid),
            napi_create_int32_(isolate, elapsed)
          );
          });
      }

      void NodeEventHandler::onUserOffline(const RtcConnection& connection, uid_t remoteUid, USER_OFFLINE_REASON_TYPE reason)
      {
        FUNC_TRACE;
        CustomRtcConnection  _connection(connection);
        node_async_call::async_call([this, _connection, remoteUid, reason] {
          Isolate* isolate = Isolate::GetCurrent();
          HandleScope scope(isolate);
          this->sendJSWithConnection(RTC_EVENT_USER_OFFLINE,
            3,
            _connection,
            napi_create_uid_(isolate, remoteUid),
            napi_create_int32_(isolate, reason)
          );
          });
      }

      void NodeEventHandler::onConnectionStateChanged(const RtcConnection& connection, CONNECTION_STATE_TYPE state, CONNECTION_CHANGED_REASON_TYPE reason)
      {
        FUNC_TRACE;
        CustomRtcConnection  _connection(connection);
        node_async_call::async_call([this, _connection, state, reason] {
          Isolate* isolate = Isolate::GetCurrent();
          HandleScope scope(isolate);
          this->sendJSWithConnection(
            RTC_EVENT_CONNECTION_STATE_CHANED,
            3,
            _connection,
            napi_create_int32_(isolate, state),
            napi_create_int32_(isolate, reason)
          );
          });
      }

      void NodeEventHandler::onNetworkQuality(const RtcConnection& connection, uid_t uid, int txQuality, int rxQuality)
      {
        FUNC_TRACE;
        CustomRtcConnection  _connection(connection);
        node_async_call::async_call([this, _connection, uid, txQuality, rxQuality] {
          Isolate* isolate = Isolate::GetCurrent();
          HandleScope scope(isolate);
          this->sendJSWithConnection(
            RTC_EVENT_NETWORK_QUALITY,
            4,
            _connection,
            napi_create_uid_(isolate, uid),
            napi_create_int32_(isolate, txQuality),
            napi_create_int32_(isolate, rxQuality)
          );
          });
      }

      void NodeEventHandler::onRemoteVideoStateChanged(const RtcConnection& connection, uid_t uid, REMOTE_VIDEO_STATE state, REMOTE_VIDEO_STATE_REASON reason, int elapsed)
      {
        FUNC_TRACE;
        CustomRtcConnection  _connection(connection);
        node_async_call::async_call([this, _connection, uid, state, reason] {
          Isolate* isolate = Isolate::GetCurrent();
          HandleScope scope(isolate);
          this->sendJSWithConnection(
            RTC_EVENT_REMOTE_VIDEO_STATE_CHANGED,
            4,
            _connection,
            napi_create_uid_(isolate, uid),
            napi_create_int32_(isolate, state),
            napi_create_int32_(isolate, reason)
          );
          });
      }

      void NodeEventHandler::onRemoteAudioStateChanged(const RtcConnection& connection, uid_t uid, REMOTE_AUDIO_STATE state, REMOTE_AUDIO_STATE_REASON reason, int elapsed)
      {
        FUNC_TRACE;
        CustomRtcConnection  _connection(connection);
        node_async_call::async_call([this, _connection, uid, state, reason] {
          Isolate* isolate = Isolate::GetCurrent();
          HandleScope scope(isolate);
          this->sendJSWithConnection(
            RTC_EVENT_REMOTE_AUDIO_STATE_CHANGED,
            4,
            _connection,
            napi_create_uid_(isolate, uid),
            napi_create_int32_(isolate, state),
            napi_create_int32_(isolate, reason)
          );
          });
      }

      void NodeEventHandler::onJoinChannelSuccess(const RtcConnection& connection, int elapsed)
      {
        FUNC_TRACE;
        CustomRtcConnection  _connection(connection);
        node_async_call::async_call([this, _connection, elapsed] {
          Isolate* isolate = Isolate::GetCurrent();
          HandleScope scope(isolate);
          this->sendJSWithConnection(
            RTC_EVENT_JOIN_CHANNEL,
            2,
            _connection,
            napi_create_int32_(isolate, elapsed)
          );
          });
      }

      void NodeEventHandler::onLocalVideoStateChanged(const RtcConnection& connection, LOCAL_VIDEO_STREAM_STATE localVideoState, LOCAL_VIDEO_STREAM_ERROR error)
      {
        FUNC_TRACE;
        CustomRtcConnection  _connection(connection);
        node_async_call::async_call([this, _connection, localVideoState, error] {
          Isolate* isolate = Isolate::GetCurrent();
          HandleScope scope(isolate);
          this->sendJSWithConnection(
            RTC_EVENT_LOCAL_VIDEO_STATE_CHANGED,
            3,
            _connection,
            napi_create_int32_(isolate, localVideoState),
            napi_create_int32_(isolate, error)
          );
          });
      }

      void NodeEventHandler::onLocalAudioStateChanged(const RtcConnection& connection, LOCAL_AUDIO_STREAM_STATE state, LOCAL_AUDIO_STREAM_ERROR error)
      {
        FUNC_TRACE;
        CustomRtcConnection  _connection(connection);
        node_async_call::async_call([this, _connection, state, error] {
          Isolate* isolate = Isolate::GetCurrent();
          HandleScope scope(isolate);
          this->sendJSWithConnection(
            RTC_EVENT_LOCAL_AUDIO_STATE_CHANGED,
            3,
            _connection,
            napi_create_int32_(isolate, state),
            napi_create_int32_(isolate, error)
          );
          });
      }

      void NodeEventHandler::onRtcStats(const RtcConnection& connection, const RtcStats& stats)
      {
        CustomRtcConnection  _connection(connection);
        node_async_call::async_call([this, _connection, stats] {
          this->onRtcStats_node_with_type(RTC_EVENT_RTC_STATS,_connection, stats);
          });
      }
      void NodeEventHandler::onLeaveChannel(const RtcConnection& connection, const RtcStats& stats)
      {
        CustomRtcConnection  _connection(connection);
        node_async_call::async_call([this, _connection, stats] {
          this->onRtcStats_node_with_type(RTC_EVENT_LEAVE_CHANNEL, _connection, stats);
          });
      }

      void NodeEventHandler::onLocalAudioStats(const RtcConnection& connection, const LocalAudioStats& stats)
      {
        FUNC_TRACE;
        CustomRtcConnection  _connection(connection);
        node_async_call::async_call([this, _connection, stats] {
          this->onLocalAudioStats_node(_connection, stats);
          });
      }

      void NodeEventHandler::onLocalVideoStats(const RtcConnection& connection, const LocalVideoStats& stats)
      {
        FUNC_TRACE;
        CustomRtcConnection  _connection(connection);
        node_async_call::async_call([this, _connection, stats] {
          this->onLocalVideoStats_node(_connection, stats);
          });
      }

      void NodeEventHandler::onRemoteVideoStats(const RtcConnection& connection, const RemoteVideoStats& stats)
      {
        FUNC_TRACE;
        printf("frame rate : %d, bitrate : %d, width %d, height %d\n", stats.rendererOutputFrameRate, stats.receivedBitrate, stats.width, stats.height);
        CustomRtcConnection  _connection(connection);
        node_async_call::async_call([this, _connection, stats] {
          this->onRemoteVideoStats_node(_connection, stats);
          });
      }

      void NodeEventHandler::onRemoteAudioStats(const RtcConnection& connection, const RemoteAudioStats& stats)
      {
        FUNC_TRACE;
        CustomRtcConnection  _connection(connection);
        node_async_call::async_call([this, _connection, stats] {
          this->onRemoteAudioStats_node(_connection, stats);
          });
      }

      void NodeEventHandler::onLocalPublishFallbackToAudioOnly(bool isFallbackOrRecover)
      {
        FUNC_TRACE;
        node_async_call::async_call([this, isFallbackOrRecover] {
          MAKE_JS_CALL_1(RTC_EVENT_LOCAL_PUBLISH_FALLBACK_TO_AUDIO_ONLY, bool, isFallbackOrRecover);
          });
      }

      void NodeEventHandler::onRemoteSubscribeFallbackToAudioOnly(uid_t uid, bool isFallbackOrRecover)
      {
        FUNC_TRACE;
        node_async_call::async_call([this, uid, isFallbackOrRecover] {
          MAKE_JS_CALL_2(RTC_EVENT_REMOTE_SUBSCRIBE_FALLBACK_TO_AUDIO_ONLY, uid, uid, bool, isFallbackOrRecover);
          });
      }

      void NodeEventHandler::onMediaDeviceChanged(int deviceType) {
        FUNC_TRACE;
        node_async_call::async_call([this, deviceType] {
          MAKE_JS_CALL_1(RTC_EVENT_MEDIA_DEVICE_CHANGED, int32, deviceType);
          });
      }

      void NodeEventHandler::onAudioDeviceStateChanged(const char* deviceId, int deviceType, int deviceStats)
      {
        FUNC_TRACE;
        std::string id(deviceId);
        node_async_call::async_call([this, id, deviceType, deviceStats] {
          MAKE_JS_CALL_3(RTC_EVENT_AUDIO_DEVICE_STATE_CHANGED, string, id.c_str(), int32, deviceType, int32, deviceStats);
          });
      }

      void NodeEventHandler::onVideoDeviceStateChanged(const char* deviceId, int deviceType, int deviceState)
      {
        FUNC_TRACE;
        std::string id(deviceId);
        node_async_call::async_call([this, id, deviceType, deviceState] {
          MAKE_JS_CALL_3(RTC_EVENT_VIDEO_DEVICE_STATE_CHANGED, string, id.c_str(), int32, deviceType, int32, deviceState);
          });
      }
    }    
}
