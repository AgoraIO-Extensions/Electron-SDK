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
namespace agora {
    namespace rtc {

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

        void NodeEventHandler::onJoinChannelSuccess_node(conn_id_t connId, const char* channel, uid_t id, int elapsed)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_4(RTC_EVENT_JOIN_CHANNEL, uint32, connId, string, channel, uid, id, int32, elapsed);
        }

        void NodeEventHandler::onJoinChannelSuccess(conn_id_t connId, const char* channel, uid_t uid, int elapsed)
        {
            FUNC_TRACE;
            std::string channelName = channel;
            node_async_call::async_call([this, connId, channelName, uid, elapsed]() {
                this->onJoinChannelSuccess_node(connId, channelName.c_str(), uid, elapsed);
            });
        }

        void NodeEventHandler::onRejoinChannelSuccess_node(conn_id_t connId, const char* channel, uid_t uid, int elapsed)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_4(RTC_EVENT_REJOIN_CHANNEL, uint32, connId, string, channel, uid, uid, int32, elapsed);
        }

        void NodeEventHandler::onRejoinChannelSuccess(conn_id_t connId, const char* channel, uid_t uid, int elapsed)
        {
            FUNC_TRACE;
            std::string channelName(channel);
            node_async_call::async_call([this, connId, channelName, uid, elapsed]() {
                this->onRejoinChannelSuccess_node(connId, channelName.c_str(), uid, elapsed);
            });
        }

        void NodeEventHandler::onWarning_node(conn_id_t connId, int warn, const char* msg)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_WARNING, uint32, connId, int32, warn, string, msg);
        }

        void NodeEventHandler::onWarning(conn_id_t connId, int warn, const char* msg)
        {
            FUNC_TRACE;
            std::string message;
            if (msg)
                message.assign(msg);
            node_async_call::async_call([this, connId, warn, message]() {
                this->onWarning_node(connId, warn, message.c_str());
            });
        }

        void NodeEventHandler::onError_node(conn_id_t connId, int err, const char* msg)
        {
            MAKE_JS_CALL_3(RTC_EVENT_ERROR, uint32, connId, int32, err, string, msg);
        }

        void NodeEventHandler::onError(conn_id_t connId, int err, const char* msg)
        {
            std::string errorDesc;
            if (msg)
                errorDesc.assign(msg);
            node_async_call::async_call([this, connId, err, errorDesc] {
                this->onError_node(connId, err, errorDesc.c_str());
            });
        }

        void NodeEventHandler::onAudioQuality_node(conn_id_t connId, uid_t uid, int quality, unsigned short dealy, unsigned short lost)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_5(RTC_EVENT_AUDIO_QUALITY, uint32, connId,  uid, uid, int32, quality, uint16, dealy, uint16, lost);
        }

        void NodeEventHandler::onAudioQuality(conn_id_t connId, uid_t uid, int quality, unsigned short dealy, unsigned short lost)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, uid, quality, dealy, lost] {
                this->onAudioQuality_node(connId, uid, quality, dealy, lost);
            });
        }

        void NodeEventHandler::onAudioVolumeIndication_node(conn_id_t connId, AudioVolumeInfo* speakers, unsigned int speakerNumber, int totalVolume)
        {
            FUNC_TRACE;
            auto it = m_callbacks.find(RTC_EVENT_AUDIO_VOLUME_INDICATION);
            if (it != m_callbacks.end()) {
                Isolate *isolate = Isolate::GetCurrent();
                HandleScope scope(isolate);
                Local<Context> context = isolate->GetCurrentContext();
                Local<v8::Array> arrSpeakers = v8::Array::New(isolate, speakerNumber);
                for(unsigned int i = 0; i < speakerNumber; i++) {
                    Local<Object> obj = Object::New(isolate);
                    obj->Set(context, napi_create_string_(isolate, "uid"), napi_create_uid_(isolate, speakers[i].uid));
                    obj->Set(context, napi_create_string_(isolate, "volume"), napi_create_uint32_(isolate, speakers[i].volume));
                    arrSpeakers->Set(context, i, obj);
                }

                Local<Value> argv[4]{napi_create_uint32_(isolate, connId), 
                                    arrSpeakers,
                                    napi_create_uint32_(isolate, speakerNumber),
                                    napi_create_uint32_(isolate, totalVolume)
                                    };
                NodeEventCallback& cb = *it->second;
                cb.callback.Get(isolate)->Call(context, cb.js_this.Get(isolate), 4, argv);
            }
            // MAKE_JS_CALL_4(RTC_EVENT_AUDIO_VOLUME_INDICATION, uid, speaker.uid, uint32, speaker.volume, uint32, speakerNumber, int32, totalVolume);
        }

        void NodeEventHandler::onAudioVolumeIndication(conn_id_t connId, const AudioVolumeInfo* speaker, unsigned int speakerNumber, int totalVolume)
        {
            FUNC_TRACE;
            if (speaker) {
                AudioVolumeInfo* localSpeakers = new AudioVolumeInfo[speakerNumber];
                for(unsigned int i = 0; i < speakerNumber; i++) {
                    AudioVolumeInfo tmp = speaker[i];
                    localSpeakers[i].uid = tmp.uid;
                    localSpeakers[i].volume = tmp.volume;
                }
                node_async_call::async_call([this, connId, localSpeakers, speakerNumber, totalVolume] {
                    this->onAudioVolumeIndication_node(connId, localSpeakers, speakerNumber, totalVolume);
                    delete []localSpeakers;
                });
            } else {
                node_async_call::async_call([this, connId, speakerNumber, totalVolume] {
                    this->onAudioVolumeIndication_node(connId, NULL, speakerNumber, totalVolume);
                });
            }
        }

        void NodeEventHandler::onLeaveChannel_node(conn_id_t connId, const RtcStats& stats)
        {
            FUNC_TRACE;
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

                Local<Value> arg[2] = {napi_create_uint32_(isolate, connId), obj };
                auto it = m_callbacks.find(RTC_EVENT_LEAVE_CHANNEL);
                if (it != m_callbacks.end()) {
                    it->second->callback.Get(isolate)->Call(context, it->second->js_this.Get(isolate), 2, arg); \
                }
            } while (false);
        }

        void NodeEventHandler::onLeaveChannel(conn_id_t connId, const RtcStats& stats)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, stats] {
                this->onLeaveChannel_node(connId, stats);
            });
        }

        void NodeEventHandler::onRtcStats_node(conn_id_t connId, const RtcStats& stats)
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

                Local<Value> arg[2] = {napi_create_uint32_(isolate, connId),  obj };
                auto it = m_callbacks.find(RTC_EVENT_RTC_STATS);
                if (it != m_callbacks.end()) {
                    it->second->callback.Get(isolate)->Call(context, it->second->js_this.Get(isolate), 2, arg); \
                }
            } while (false);
        }

        void NodeEventHandler::onRtcStats(conn_id_t connId, const RtcStats& stats)
        {
            node_async_call::async_call([this, connId, stats] {
                this->onRtcStats_node(connId, stats);
            });
        }

        void NodeEventHandler::onAudioDeviceStateChanged_node(conn_id_t connId, const char* deviceId, int deviceType, int deviceStats)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_4(RTC_EVENT_AUDIO_DEVICE_STATE_CHANGED, uint32, connId, string, deviceId, int32, deviceType, int32, deviceStats);
        }

        void NodeEventHandler::onAudioDeviceStateChanged(conn_id_t connId, const char* deviceId, int deviceType, int deviceStats)
        {
            FUNC_TRACE;
            std::string id(deviceId);
            node_async_call::async_call([this, connId, id, deviceType, deviceStats] {
                this->onAudioDeviceStateChanged_node(connId, id.c_str(), deviceType, deviceStats);
            });
        }

        void NodeEventHandler::onAudioMixingFinished_node()
        {
            FUNC_TRACE;
            MAKE_JS_CALL_0(RTC_EVENT_AUDIO_MIXING_FINISHED);
        }

        // void NodeEventHandler::onAudioMixingFinished()
        // {
        //     FUNC_TRACE;
        //     node_async_call::async_call([this] {
        //         this->onAudioMixingFinished_node();
        //     });
        // }

        void NodeEventHandler::onRemoteAudioMixingBegin_node()
        {
            FUNC_TRACE;
            MAKE_JS_CALL_0(RTC_EVENT_REMOTE_AUDIO_MIXING_BEGIN);
        }

        // void NodeEventHandler::onRemoteAudioMixingBegin()
        // {
        //     FUNC_TRACE;
        //     node_async_call::async_call([this] {
        //         this->onRemoteAudioMixingBegin_node();
        //     });
        // }

        void NodeEventHandler::onRemoteAudioMixingEnd_node()
        {
            FUNC_TRACE;
            MAKE_JS_CALL_0(RTC_EVENT_REMOTE_AUDIO_MIXING_END);
        }

        // void NodeEventHandler::onRemoteAudioMixingEnd()
        // {
        //     FUNC_TRACE;
        //     node_async_call::async_call([this] {
        //         this->onRemoteAudioMixingEnd_node();
        //     });
        // }

        void NodeEventHandler::onAudioEffectFinished_node(conn_id_t connId, int soundId)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_2(RTC_EVENT_AUDIO_EFFECT_FINISHED, uint32, connId, int32, soundId);
        }

        void NodeEventHandler::onAudioEffectFinished(conn_id_t connId, int soundId)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, soundId] {
                this->onAudioEffectFinished_node(connId, soundId);
            });
        }

        void NodeEventHandler::onVideoDeviceStateChanged_node(conn_id_t connId, const char* deviceId, int deviceType, int deviceState)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_4(RTC_EVENT_VIDEO_DEVICE_STATE_CHANGED, uint32, connId, string, deviceId, int32, deviceType, int32, deviceState);
        }

        void NodeEventHandler::onVideoDeviceStateChanged(conn_id_t connId, const char* deviceId, int deviceType, int deviceState)
        {
            FUNC_TRACE;
            std::string id(deviceId);
            node_async_call::async_call([this, connId, id, deviceType, deviceState] {
                this->onVideoDeviceStateChanged_node(connId, id.c_str(), deviceType, deviceState);
            });
        }

        void NodeEventHandler::onNetworkQuality_node(conn_id_t connId, uid_t uid, int txQuality, int rxQuality)
        {
            //event_log("uid : %d, txQuality :%d, rxQuality :%d\n", uid, txQuality, rxQuality);
            MAKE_JS_CALL_4(RTC_EVENT_NETWORK_QUALITY, uint32, connId,  uid, uid, int32, txQuality, int32, rxQuality);
        }

        void NodeEventHandler::onNetworkQuality(conn_id_t connId, uid_t uid, int txQuality, int rxQuality)
        {
            node_async_call::async_call([this, connId, uid, txQuality, rxQuality] {
                this->onNetworkQuality_node(connId, uid, txQuality, rxQuality);
            });
        }

        void NodeEventHandler::onLastmileQuality_node(conn_id_t connId, int quality)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_2(RTC_EVENT_LASTMILE_QUALITY, uint32, connId, int32, quality);
        }

        void NodeEventHandler::onLastmileQuality(conn_id_t connId, int quality)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, quality] {
                this->onLastmileQuality_node(connId, quality);
            });
        }

        void NodeEventHandler::onFirstLocalVideoFrame_node(conn_id_t connId, int width, int height, int elapsed)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_4(RTC_EVENT_FIRST_LOCAL_VIDEO_FRAME, uint32, connId, int32, width, int32, height, int32, elapsed);
        }

        void NodeEventHandler::onFirstLocalVideoFrame(conn_id_t connId, int width, int height, int elapsed)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, width, height, elapsed] {
                this->onFirstLocalVideoFrame_node(connId, width, height, elapsed);
            });
        }

        void NodeEventHandler::onFirstRemoteVideoDecoded_node(conn_id_t connId, uid_t uid, int width, int height, int elapsed)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_5(RTC_EVENT_FIRST_REMOTE_VIDEO_DECODED, uint32, connId, uid, uid, int32, width, int32, height, int32, elapsed);
        }

        void NodeEventHandler::onFirstRemoteVideoDecoded(conn_id_t connId, uid_t uid, int width, int height, int elapsed)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, uid, width, height, elapsed] {
                this->onFirstRemoteVideoDecoded_node(connId, uid, width, height, elapsed);
            });
        }

        void NodeEventHandler::onVideoSizeChanged_node(conn_id_t connId, uid_t uid, int width, int height, int rotation)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_5(RTC_EVENT_VIDEO_SIZE_CHANGED, uint32, connId, uid, uid, int32, width, int32, height, int32, rotation);
        }

        void NodeEventHandler::onVideoSizeChanged(conn_id_t connId, uid_t uid, int width, int height, int rotation)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, uid, width, height, rotation] {
                this->onVideoSizeChanged_node(connId, uid, width, height, rotation);
            });
        }

        void NodeEventHandler::onRemoteVideoStateChanged_node(conn_id_t connId, uid_t uid, REMOTE_VIDEO_STATE state, REMOTE_VIDEO_STATE_REASON reason, int elapsed)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_5(RTC_EVENT_REMOTE_VIDEO_STATE_CHANGED, uint32, connId, uid, uid, int32, state, int32, reason, int32, elapsed);
        }

        void NodeEventHandler::onRemoteVideoStateChanged(conn_id_t connId, uid_t uid, REMOTE_VIDEO_STATE state, REMOTE_VIDEO_STATE_REASON reason, int elapsed)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, uid, state, reason, elapsed] {
                this->onRemoteVideoStateChanged_node(connId, uid, state, reason, elapsed);
            });
        }

        void NodeEventHandler::onFirstRemoteVideoFrame_node(uid_t uid, int width, int height, int elapsed)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_4(RTC_EVENT_FIRST_REMOTE_VIDEO_FRAME, uid, uid, int32, width, int32, height, int32, elapsed);
        }

        void NodeEventHandler::onUserJoined_node(conn_id_t connId, uid_t uid, int elapsed)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_USER_JOINED, uint32, connId, uid, uid, int32, elapsed);
        }

        void NodeEventHandler::onUserJoined(conn_id_t connId, uid_t uid, int elapsed)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, uid, elapsed] {
                this->onUserJoined_node(connId, uid, elapsed);
            });
        }

        void NodeEventHandler::onUserOffline_node(conn_id_t connId, uid_t uid, USER_OFFLINE_REASON_TYPE reason)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_USER_OFFLINE, uint32, connId, uid, uid, int32, reason);
        }

        void NodeEventHandler::onUserOffline(conn_id_t connId, uid_t uid, USER_OFFLINE_REASON_TYPE reason)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, uid, reason] {
                this->onUserOffline_node(connId, uid, reason);
            });
        }

        // void NodeEventHandler::onUserMuteAudio_node(uid_t uid, bool muted)
        // {
        //     FUNC_TRACE;
        //     MAKE_JS_CALL_2(RTC_EVENT_USER_MUTE_AUDIO, uid, uid, int32, muted);
        // }

        // void NodeEventHandler::onUserMuteAudio(uid_t uid, bool muted)
        // {
        //     FUNC_TRACE;
        //     node_async_call::async_call([this, uid, muted] {
        //         this->onUserMuteAudio_node(uid, muted);
        //     });
        // }

        void NodeEventHandler::onUserMuteVideo_node(conn_id_t connId, uid_t uid, bool muted)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_USER_MUTE_VIDEO, uint32, connId, uid, uid, int32, muted);
        }

        void NodeEventHandler::onUserMuteVideo(conn_id_t connId, uid_t uid, bool muted)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, uid, muted] {
                this->onUserMuteVideo_node(connId, uid, muted);
            });
        }

        void NodeEventHandler::onUserEnableVideo_node(conn_id_t connId, uid_t uid, bool enabled)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_USER_ENABLE_VIDEO, uint32, connId, uid, uid, int32, enabled);
        }

        void NodeEventHandler::onUserEnableVideo(conn_id_t connId, uid_t uid, bool enabled)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, uid, enabled] {
                this->onUserEnableVideo_node(connId, uid, enabled);
            });
        }

        void NodeEventHandler::onUserEnableLocalVideo_node(conn_id_t connId, uid_t uid, bool enabled)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_USER_ENABLE_LOCAL_VIDEO, uint32, connId, uid, uid, int32, enabled);
        }

        void NodeEventHandler::onUserEnableLocalVideo(conn_id_t connId, uid_t uid, bool enabled)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, uid, enabled] {
                this->onUserEnableLocalVideo_node(connId, uid, enabled);
            });
        }

        void NodeEventHandler::onApiCallExecuted_node(conn_id_t connId, const char* api, int error)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_APICALL_EXECUTED, uint32, connId, string, api, int32, error);
        }

        void NodeEventHandler::onApiCallExecuted(conn_id_t connId, int err, const char* api, const char* result)
        {
            FUNC_TRACE;
            std::string apiName(api);
            node_async_call::async_call([this, connId, apiName, err] {
                this->onApiCallExecuted_node(connId, apiName.c_str(), err);
            });
        }

        void NodeEventHandler::onLocalVideoStats_node(conn_id_t connId, const LocalVideoStats& stats)
        {
            FUNC_TRACE;
            do {
                Isolate *isolate = Isolate::GetCurrent();
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

                Local<Value> arg[2] = {napi_create_uint32_(isolate, connId),  obj };
                auto it = m_callbacks.find(RTC_EVENT_LOCAL_VIDEO_STATS);
                if (it != m_callbacks.end()) {
                    it->second->callback.Get(isolate)->Call(context, it->second->js_this.Get(isolate), 2, arg); \
                }
            } while (false);
        }

        void NodeEventHandler::onLocalVideoStats(conn_id_t connId, const LocalVideoStats& stats)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, stats] {
                this->onLocalVideoStats_node(connId, stats);
            });
        }

        void NodeEventHandler::onRemoteVideoStats_node(conn_id_t connId, const RemoteVideoStats& stats)
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
                Local<Value> arg[2] = {napi_create_uint32_(isolate, connId), obj };
                auto it = m_callbacks.find(RTC_EVENT_REMOTE_VIDEO_STATS);
                if (it != m_callbacks.end()) {
                    it->second->callback.Get(isolate)->Call(context, it->second->js_this.Get(isolate), 2, arg);
                }
            } while (false);
        }

        void NodeEventHandler::onRemoteVideoStats(conn_id_t connId, const RemoteVideoStats& stats)
        {
            FUNC_TRACE;
            printf("frame rate : %d, bitrate : %d, width %d, height %d\n", stats.rendererOutputFrameRate, stats.receivedBitrate, stats.width, stats.height);
            node_async_call::async_call([this, connId, stats] {
                this->onRemoteVideoStats_node(connId, stats);
            });
        }

        void NodeEventHandler::onCameraReady_node(conn_id_t connId)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_1(RTC_EVENT_CAMERA_READY, uint32, connId);
        }

        void NodeEventHandler::onCameraReady(conn_id_t connId)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId] {
                this->onCameraReady_node(connId);
            });
        }

        void NodeEventHandler::onCameraFocusAreaChanged_node(conn_id_t connId, int x, int y, int width, int height)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_5(RTC_EVENT_CAMERA_FOCUS_AREA_CHANGED, uint32, connId, int32, x, int32, y, int32, width, int32, height);
        }

        void NodeEventHandler::onCameraFocusAreaChanged(conn_id_t connId, int x, int y, int width, int height)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, x, y, width, height] {
                this->onCameraFocusAreaChanged_node(connId, x, y, width, height);
            });
        }

        void NodeEventHandler::onCameraExposureAreaChanged_node(conn_id_t connId, int x, int y, int width, int height)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_5(RTC_EVENT_CAMERA_FOCUS_AREA_CHANGED, uint32, connId, int32, x, int32, y, int32, width, int32, height);
        }

        void NodeEventHandler::onCameraExposureAreaChanged(conn_id_t connId, int x, int y, int width, int height)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, x, y, width, height] {
                this->onCameraExposureAreaChanged_node(connId, x, y, width, height);
            });
        }

        void NodeEventHandler::onVideoStopped_node(conn_id_t connId)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_1(RTC_EVENT_VIDEO_STOPPED, uint32, connId);
        }

        void NodeEventHandler::onVideoStopped(conn_id_t connId)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId] {
                this->onVideoStopped_node(connId);
            });
        }

        void NodeEventHandler::onConnectionLost_node(conn_id_t connId)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_1(RTC_EVENT_CONNECTION_LOST, uint32, connId);
        }

        void NodeEventHandler::onConnectionLost(conn_id_t connId)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId] {
                this->onConnectionLost_node(connId);
            });
        }

        void NodeEventHandler::onConnectionInterrupted_node(conn_id_t connId)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_1(RTC_EVENT_CONNECTION_INTERRUPTED, uint32, connId);
        }

        void NodeEventHandler::onConnectionInterrupted(conn_id_t connId)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId] {
                this->onConnectionInterrupted_node(connId);
            });
        }

        void NodeEventHandler::onConnectionBanned_node(conn_id_t connId)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_1(RTC_EVENT_CONNECTION_BANNED, uint32, connId);
        }

        void NodeEventHandler::onConnectionBanned(conn_id_t connId)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId] {
                this->onConnectionBanned_node(connId);
            });
        }

        void NodeEventHandler::onStreamMessage_node(conn_id_t connId, uid_t uid, int streamId, const char* data, size_t length)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_5(RTC_EVENT_STREAM_MESSAGE, uint32, connId, uid, uid, int32, streamId, string, data, int32, length);
        }

        void NodeEventHandler::onStreamMessage(conn_id_t connId, uid_t uid, int streamId, const char* data, size_t length)
        {
            FUNC_TRACE;
            std::string msg(data);
            node_async_call::async_call([this, connId, uid, streamId, msg, length] {
                this->onStreamMessage_node(connId, uid, streamId, msg.c_str(), length);
            });
        }

        void NodeEventHandler::onStreamMessageError_node(conn_id_t connId, uid_t uid, int streamId, int code, int missed, int cached)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_6(RTC_EVENT_STREAM_MESSAGE_ERROR, uint32, connId, uid, uid, int32, streamId, int32, code, int32, missed, int32, cached);
        }

        void NodeEventHandler::onStreamMessageError(conn_id_t connId, uid_t uid, int streamId, int code, int missed, int cached)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, uid, streamId, code, missed, cached] {
                this->onStreamMessageError_node(connId, uid, streamId, code, missed, cached);
            });
        }

        void NodeEventHandler::onMediaEngineLoadSuccess_node(conn_id_t connId)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_1(RTC_EVENT_MEDIA_ENGINE_LOAD_SUCCESS, uint32, connId);
        }

        void NodeEventHandler::onMediaEngineLoadSuccess(conn_id_t connId)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId] {
                this->onMediaEngineLoadSuccess_node(connId);
            });
        }

        void NodeEventHandler::onMediaEngineStartCallSuccess_node(conn_id_t connId)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_1(RTC_EVENT_MEDIA_ENGINE_STARTCALL_SUCCESS, uint32, connId);
        }

        void NodeEventHandler::onMediaEngineStartCallSuccess(conn_id_t connId)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId] {
                this->onMediaEngineStartCallSuccess_node(connId);
            });
        }

        void NodeEventHandler::onRequestToken_node(conn_id_t connId)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_1(RTC_EVENT_REQUEST_TOKEN, uint32, connId);
        }

        void NodeEventHandler::onRequestToken(conn_id_t connId)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId] {
                this->onRequestToken_node(connId);
            });
        }

        void NodeEventHandler::onTokenPrivilegeWillExpire_node(conn_id_t connId, const char* token)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_2(RTC_EVENT_TOKEN_PRIVILEGE_WILL_EXPIRE, uint32, connId, string, token);
        }

        void NodeEventHandler::onTokenPrivilegeWillExpire(conn_id_t connId, const char* token)
        {
            FUNC_TRACE;
            std::string sToken(token);
            node_async_call::async_call([this, connId, sToken] {
                this->onTokenPrivilegeWillExpire_node(connId, sToken.c_str());
            });
        }

        // void NodeEventHandler::onFirstLocalAudioFrame_node(int elapsed)
        // {
        //     FUNC_TRACE;
        //     MAKE_JS_CALL_1(RTC_EVENT_FIRST_LOCAL_AUDIO_FRAME, int32, elapsed);
        // }

        // void NodeEventHandler::onFirstLocalAudioFrame(int elapsed)
        // {
        //     FUNC_TRACE;
        //     node_async_call::async_call([this, elapsed] {
        //         this->onFirstLocalAudioFrame_node(elapsed);
        //     });
        // }

        void NodeEventHandler::onFirstRemoteAudioFrame_node(uid_t uid, int elapsed)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_2(RTC_EVENT_FIRST_REMOTE_AUDIO_FRAME, uid, uid, int32, elapsed);
        }

        // void NodeEventHandler::onFirstRemoteAudioDecoded_node(uid_t uid, int elapsed)
        // {
        //     FUNC_TRACE;
        //     MAKE_JS_CALL_2(RTC_EVENT_FIRST_REMOTE_AUDIO_DECODED, uid, uid, int32, elapsed);
        // }

        // void NodeEventHandler::onFirstRemoteAudioDecoded(uid_t uid, int elapsed)
        // {
        //     FUNC_TRACE;
        //     node_async_call::async_call([this, uid, elapsed] {
        //         this->onFirstRemoteAudioDecoded_node(uid, elapsed);
        //     });
        // }

        void NodeEventHandler::onStreamPublished(conn_id_t connId, const char* url, int error)
        {
            FUNC_TRACE;
            std::string sUrl(url);
            node_async_call::async_call([this, connId, sUrl, error] {
                this->onStreamPublished_node(connId, sUrl.c_str(), error);
            });
        }

        void NodeEventHandler::onStreamPublished_node(conn_id_t connId, const char *url, int error)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_STREAM_PUBLISHED, uint32, connId, string, url, int32, error);
        }

        void NodeEventHandler::onStreamUnpublished(conn_id_t connId, const char* url)
        {
            FUNC_TRACE;
            std::string sUrl(url);
            node_async_call::async_call([this, connId, sUrl] {
                this->onStreamUnpublished_node(connId, sUrl.c_str());
            });
        }

        void NodeEventHandler::onStreamUnpublished_node(conn_id_t connId, const char *url)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_2(RTC_EVENT_STREAM_UNPUBLISHED, uint32, connId, string, url);
        }

        void NodeEventHandler::onTranscodingUpdated_node(conn_id_t connId)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_1(RTC_EVENT_TRANSCODING_UPDATED, uint32, connId);
        }

        void NodeEventHandler::onTranscodingUpdated(conn_id_t connId)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId] {
                this->onTranscodingUpdated_node(connId);
            });
        }

        void NodeEventHandler::onStreamInjectedStatus_node(conn_id_t connId, const char* url, uid_t uid, int status)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_4(RTC_EVENT_STREAM_INJECT_STATUS, uint32, connId, string, url, uid, uid, int32, status);
        }

        void NodeEventHandler::onStreamInjectedStatus(conn_id_t connId, const char* url, uid_t uid, int status)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, url, uid, status] {
                this->onStreamInjectedStatus_node(connId, url, uid, status);
            });
        }
        
        void NodeEventHandler::onLocalPublishFallbackToAudioOnly_node(conn_id_t connId, bool isFallbackOrRecover)
        {

            FUNC_TRACE;
            MAKE_JS_CALL_2(RTC_EVENT_LOCAL_PUBLISH_FALLBACK_TO_AUDIO_ONLY, uint32, connId, bool, isFallbackOrRecover);
        }

        void NodeEventHandler::onLocalPublishFallbackToAudioOnly(conn_id_t connId, bool isFallbackOrRecover)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, isFallbackOrRecover] {
                this->onLocalPublishFallbackToAudioOnly_node(connId, isFallbackOrRecover);
            });
        }

        void NodeEventHandler::onRemoteSubscribeFallbackToAudioOnly_node(conn_id_t connId, uid_t uid, bool isFallbackOrRecover)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_REMOTE_SUBSCRIBE_FALLBACK_TO_AUDIO_ONLY, uint32, connId, uid, uid, bool, isFallbackOrRecover);
            
        }

        void NodeEventHandler::onRemoteSubscribeFallbackToAudioOnly(conn_id_t connId, uid_t uid, bool isFallbackOrRecover)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, uid, isFallbackOrRecover] {
                this->onRemoteSubscribeFallbackToAudioOnly_node(connId, uid, isFallbackOrRecover);
            });
        }

        void NodeEventHandler::onActiveSpeaker_node(conn_id_t connId, uid_t uid)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_2(RTC_EVENT_ACTIVE_SPEAKER, uint32, connId, uid, uid);
        }

        void NodeEventHandler::onActiveSpeaker(conn_id_t connId, uid_t uid)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, uid] {
                this->onActiveSpeaker_node(connId, uid);
            });
        }

        void NodeEventHandler::onClientRoleChanged_node(conn_id_t connId, CLIENT_ROLE_TYPE oldRole, CLIENT_ROLE_TYPE newRole)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_CLIENT_ROLE_CHANGED, uint32, connId, int32, oldRole, int32, newRole);
        }

        void NodeEventHandler::onClientRoleChanged(conn_id_t connId, CLIENT_ROLE_TYPE oldRole, CLIENT_ROLE_TYPE newRole)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, oldRole, newRole] {
                this->onClientRoleChanged_node(connId, oldRole, newRole);
            });
        }

        void NodeEventHandler::onAudioDeviceVolumeChanged_node(conn_id_t connId, MEDIA_DEVICE_TYPE deviceType, int volume, bool muted)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_4(RTC_EVENT_AUDIO_DEVICE_VOLUME_CHANGED, uint32, connId, int32, deviceType, int32, volume, int32, muted);
        }

        void NodeEventHandler::onAudioDeviceVolumeChanged(conn_id_t connId, MEDIA_DEVICE_TYPE deviceType, int volume, bool muted)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, deviceType, volume, muted] {
                this->onAudioDeviceVolumeChanged_node(connId, deviceType, volume, muted);
            });
        }

        void NodeEventHandler::onRemoteAudioTransportStats_node(conn_id_t connId, agora::rtc::uid_t uid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_5(RTC_EVENT_REMOTE_AUDIO_TRANSPORT_STATS, uint32, connId, uid, uid, uint16, delay, uint16, lost, uint16, rxKBitRate);
        }

        void NodeEventHandler::onRemoteAudioTransportStats(conn_id_t connId, agora::rtc::uid_t uid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, uid, delay, lost, rxKBitRate] {
                this->onRemoteAudioTransportStats_node(connId, uid, delay, lost, rxKBitRate);
            });
        }

        void NodeEventHandler::onRemoteVideoTransportStats_node(conn_id_t connId, agora::rtc::uid_t uid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_5(RTC_EVENT_REMOTE_VIDEO_TRANSPORT_STATS, uint32, connId, uid, uid, uint16, delay, uint16, lost, uint16, rxKBitRate);
        }

        void NodeEventHandler::onRemoteVideoTransportStats(conn_id_t connId, agora::rtc::uid_t uid, unsigned short delay, unsigned short lost, unsigned short rxKBitRate)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, uid, delay, lost, rxKBitRate] {
                this->onRemoteVideoTransportStats_node(connId, uid, delay, lost, rxKBitRate);
            });
        }

        void NodeEventHandler::onRemoteAudioStats_node(conn_id_t connId, const RemoteAudioStats & stats)
        {
            FUNC_TRACE;
            do {
                Isolate *isolate = Isolate::GetCurrent();
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

                Local<Value> arg[2] = {napi_create_uint32_(isolate, connId),  obj };
                auto it = m_callbacks.find(RTC_EVENT_REMOTE_AUDIO_STATS);
                if (it != m_callbacks.end()) {
                    it->second->callback.Get(isolate)->Call(context, it->second->js_this.Get(isolate), 2, arg); 
                }
            } while (false);
        }

        void NodeEventHandler::onRemoteAudioStats(conn_id_t connId, const RemoteAudioStats & stats)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, stats] {
                this->onRemoteAudioStats_node(connId, stats);
            });
        }

        // void NodeEventHandler::onMicrophoneEnabled_node(bool enabled)
        // {
        //     FUNC_TRACE;
        //     MAKE_JS_CALL_1(RTC_EVENT_MICROPHONE_ENABLED, bool, enabled);
        // }
       
        // void NodeEventHandler::onMicrophoneEnabled(bool enabled)
        // {
        //     FUNC_TRACE;
        //     node_async_call::async_call([this, enabled] {
        //         this->onMicrophoneEnabled_node(enabled);
        //     });
        // }

        void NodeEventHandler::onConnectionStateChanged_node(conn_id_t connId, CONNECTION_STATE_TYPE state, CONNECTION_CHANGED_REASON_TYPE reason)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_CONNECTION_STATE_CHANED, uint32, connId, int32, state, int32, reason);
        }

        void NodeEventHandler::onConnectionStateChanged(conn_id_t connId, CONNECTION_STATE_TYPE state, CONNECTION_CHANGED_REASON_TYPE reason)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, state, reason] {
                this->onConnectionStateChanged_node(connId, state, reason);
            });
        }

        void NodeEventHandler::addEventHandler(const std::string& eventName, Persistent<Object>& obj, Persistent<Function>& callback)
        {
            FUNC_TRACE;
            NodeEventCallback *cb = new NodeEventCallback();;
            cb->js_this.Reset(obj);
            cb->callback.Reset(callback);
            m_callbacks.emplace(eventName, cb);
        }

        void NodeEventHandler::fireApiError(const char* funcName)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_1(RTC_EVENT_API_ERROR, string, funcName);
        }

        void NodeEventHandler::onAudioMixingStateChanged(conn_id_t connId, AUDIO_MIXING_STATE_TYPE state, AUDIO_MIXING_ERROR_TYPE errorCode)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, state, errorCode] {
                this->onAudioMixingStateChanged_node(connId, state, errorCode);
            });
        }

        void NodeEventHandler::onAudioMixingStateChanged_node(conn_id_t connId, AUDIO_MIXING_STATE_TYPE state, AUDIO_MIXING_ERROR_TYPE errorCode)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_AUDIO_MIXING_STATE_CHANGED, uint32, connId, int32, state, int32, errorCode);
        }

        void NodeEventHandler::onLastmileProbeResult(conn_id_t connId, const LastmileProbeResult &result)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, result] {
                this->onLastmileProbeResult_node(connId, result);
            });
        }

        void NodeEventHandler::onLastmileProbeResult_node(conn_id_t connId, const LastmileProbeResult &result)
        {
            FUNC_TRACE;
            do {
                Isolate *isolate = Isolate::GetCurrent();
                HandleScope scope(isolate);
                Local<Context> context = isolate->GetCurrentContext();
                Local<Object> obj = Object::New(isolate);
                CHECK_NAPI_OBJ(obj);
                NODE_SET_OBJ_PROP_UINT32(obj, "state", result.state);
                NODE_SET_OBJ_PROP_UINT32(obj, "rtt", result.rtt);

                Local<Object> uplink = Object::New(isolate);
                CHECK_NAPI_OBJ(uplink);
                NODE_SET_OBJ_PROP_UINT32(uplink, "packetLossRate", result.uplinkReport.packetLossRate);
                NODE_SET_OBJ_PROP_UINT32(uplink, "jitter", result.uplinkReport.jitter);
                NODE_SET_OBJ_PROP_UINT32(uplink, "availableBandwidth", result.uplinkReport.availableBandwidth);

                Local<Object> downlink = Object::New(isolate);
                CHECK_NAPI_OBJ(downlink);
                NODE_SET_OBJ_PROP_UINT32(downlink, "packetLossRate", result.downlinkReport.packetLossRate);
                NODE_SET_OBJ_PROP_UINT32(downlink, "jitter", result.downlinkReport.jitter);
                NODE_SET_OBJ_PROP_UINT32(downlink, "availableBandwidth", result.downlinkReport.availableBandwidth);

                obj->Set(isolate->GetCurrentContext(), napi_create_string_(isolate, "uplinkReport"), uplink);
                obj->Set(isolate->GetCurrentContext(), napi_create_string_(isolate, "downlinkReport"), downlink);

                Local<Value> arg[2] = {napi_create_uint32_(isolate, connId), obj };
                auto it = m_callbacks.find(RTC_EVENT_LASTMILE_PROBE_RESULT);
                if (it != m_callbacks.end()) {
                    it->second->callback.Get(isolate)->Call(context, it->second->js_this.Get(isolate), 2, arg);
                }
            } while (false);
        }

        /**
         * 2.8.0
         */
        // void NodeEventHandler::onLocalUserRegistered(uid_t uid, const char* userAccount)
        // {
        //     FUNC_TRACE;
        //     std::string mUserAccount = std::string(userAccount);
        //     node_async_call::async_call([this, uid, mUserAccount] {
        //         this->onLocalUserRegistered_node(uid, mUserAccount.c_str());
        //     });
        // }
        // void NodeEventHandler::onLocalUserRegistered_node(uid_t uid, const char* userAccount)
        // {
        //     FUNC_TRACE;
        //     MAKE_JS_CALL_2(RTC_EVENT_LOCAL_USER_REGISTERED, uid, uid, string, userAccount);
        // }

        // void NodeEventHandler::onUserInfoUpdated(uid_t uid, const UserInfo& info)
        // {
        //     FUNC_TRACE;
        //     node_async_call::async_call([this, uid, info] {
        //         this->onUserInfoUpdated_node(uid, info);
        //     });
        // }
        // void NodeEventHandler::onUserInfoUpdated_node(uid_t uid, const UserInfo& info)
        // {
        //     FUNC_TRACE;
        //     do{
        //         Isolate *isolate = Isolate::GetCurrent();
        //         HandleScope scope(isolate);
        //         Local<Context> context = isolate->GetCurrentContext();
        //         Local<Object> obj = Object::New(isolate);
        //         CHECK_NAPI_OBJ(obj);
                
        //         NODE_SET_OBJ_PROP_UID(obj, "uid", info.uid);
        //         NODE_SET_OBJ_PROP_STRING(obj, "userAccount", info.userAccount);

        //         Local<Value> arg[2] = {
        //             napi_create_uid_(isolate, uid),
        //             obj 
        //         };
        //         auto it = m_callbacks.find(RTC_EVENT_USER_INFO_UPDATED);
        //         if (it != m_callbacks.end()) {
        //             it->second->callback.Get(isolate)->Call(context, it->second->js_this.Get(isolate), 2, arg); \
        //         }
        //     }while(false);
        // }

        void NodeEventHandler::onLocalVideoStateChanged(conn_id_t connId, LOCAL_VIDEO_STREAM_STATE localVideoState, LOCAL_VIDEO_STREAM_ERROR error)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, localVideoState, error] {
                this->onLocalVideoStateChanged_node(connId, localVideoState, error);
            });
        }

        void NodeEventHandler::onLocalVideoStateChanged_node(conn_id_t connId, LOCAL_VIDEO_STREAM_STATE localVideoState, LOCAL_VIDEO_STREAM_ERROR error)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_LOCAL_VIDEO_STATE_CHANGED, uint32, connId, int32, localVideoState, int32, error);
        }

        void NodeEventHandler::onLocalAudioStats_node(conn_id_t connId, const LocalAudioStats& stats)
        {
            FUNC_TRACE;
            do {
                Isolate *isolate = Isolate::GetCurrent();
                HandleScope scope(isolate);
                Local<Context> context = isolate->GetCurrentContext();
                Local<Object> obj = Object::New(isolate);
                CHECK_NAPI_OBJ(obj);

                NODE_SET_OBJ_PROP_UINT32(obj, "numChannels", stats.numChannels);
                NODE_SET_OBJ_PROP_UINT32(obj, "sentSampleRate", stats.sentSampleRate);
                NODE_SET_OBJ_PROP_UINT32(obj, "sentBitrate", stats.sentBitrate);

                Local<Value> arg[2] = {napi_create_uint32_(isolate, connId), obj };
                auto it = m_callbacks.find(RTC_EVENT_LOCAL_AUDIO_STATS);
                if (it != m_callbacks.end()) {
                    it->second->callback.Get(isolate)->Call(context, it->second->js_this.Get(isolate), 2, arg); 
                }
            } while (false);
        }

        void NodeEventHandler::onLocalAudioStats(conn_id_t connId, const LocalAudioStats& stats)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, stats] {
                this->onLocalAudioStats_node(connId, stats);
            });
        }

        void NodeEventHandler::onLocalAudioStateChanged(conn_id_t connId, LOCAL_AUDIO_STREAM_STATE state, LOCAL_AUDIO_STREAM_ERROR error)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, state, error] {
                this->onLocalAudioStateChanged_node(connId, state, error);
            });
        }

        void NodeEventHandler::onLocalAudioStateChanged_node(conn_id_t connId, LOCAL_AUDIO_STREAM_STATE state, LOCAL_AUDIO_STREAM_ERROR error)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_3(RTC_EVENT_LOCAL_AUDIO_STATE_CHANGED, uint32, connId, int32, state, int32, error);
        }

        void NodeEventHandler::onRemoteAudioStateChanged(conn_id_t connId, uid_t uid, REMOTE_AUDIO_STATE state, REMOTE_AUDIO_STATE_REASON reason, int elapsed)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, uid, state, reason, elapsed] {
                this->onRemoteAudioStateChanged_node(connId, uid, state, reason, elapsed);
            });
        }

        void NodeEventHandler::onRemoteAudioStateChanged_node(conn_id_t connId, uid_t uid, REMOTE_AUDIO_STATE state, REMOTE_AUDIO_STATE_REASON reason, int elapsed)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_5(RTC_EVENT_REMOTE_AUDIO_STATE_CHANGED, uint32, connId, uid, uid, int32, state, int32, reason, int32, elapsed);
        }

        // void NodeEventHandler::onChannelMediaRelayEvent(CHANNEL_MEDIA_RELAY_EVENT code)
        // {
        //     FUNC_TRACE;
        //     node_async_call::async_call([this, code] {
        //         this->onChannelMediaRelayEvent_node(code);
        //     });
        // }

        // void NodeEventHandler::onChannelMediaRelayEvent_node(CHANNEL_MEDIA_RELAY_EVENT code)
        // {
        //     FUNC_TRACE;
        //     MAKE_JS_CALL_1(RTC_EVENT_CHANNEL_MEDIA_RELAY_EVENT, int32, code);
        // }

        // void NodeEventHandler::onChannelMediaRelayStateChanged(CHANNEL_MEDIA_RELAY_STATE state,CHANNEL_MEDIA_RELAY_ERROR code)
        // {
        //     FUNC_TRACE;
        //     node_async_call::async_call([this, state, code] {
        //         this->onChannelMediaRelayStateChanged_node(state, code);
        //     });
        // }

        // void NodeEventHandler::onChannelMediaRelayStateChanged_node(CHANNEL_MEDIA_RELAY_STATE state,CHANNEL_MEDIA_RELAY_ERROR code)
        // {
        //     FUNC_TRACE;
        //     MAKE_JS_CALL_2(RTC_EVENT_CHANNEL_MEDIA_RELAY_STATE, int32, state, int32, code);
        // }

        void NodeEventHandler::onRtmpStreamingStateChanged(conn_id_t connId, const char *url, agora::rtc::RTMP_STREAM_PUBLISH_STATE state, agora::rtc::RTMP_STREAM_PUBLISH_ERROR errCode)
        {
            FUNC_TRACE;
            std::string sUrl(url);
            node_async_call::async_call([this, connId, sUrl, state, errCode] {
                MAKE_JS_CALL_4(RTC_EVENT_RTMP_STREAMING_STATE_CHANGED, uint32, connId, string, sUrl.c_str(), int32, state, int32, errCode)
            });
        }

        void NodeEventHandler::onFirstLocalAudioFramePublished(conn_id_t connId, int elapsed)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, elapsed] {
                MAKE_JS_CALL_2(RTC_EVENT_FIRST_LOCAL_AUDIO_FRAME_PUBLISH, uint32, connId, int32, elapsed);
            });
        }

        // void NodeEventHandler::onFirstLocalVideoFramePublished(int elapsed)
        // {
        //     FUNC_TRACE;
        //     node_async_call::async_call([this, elapsed] {
        //         MAKE_JS_CALL_1(RTC_EVENT_FIRST_LOCAL_VIDEO_FRAME_PUBLISH, int32, elapsed);
        //     });
        // }

        // void NodeEventHandler::onRtmpStreamingEvent(const char* url, RTMP_STREAMING_EVENT eventCode)
        // {
        //     FUNC_TRACE;
        //     std::string mUrl(url);
        //     node_async_call::async_call([this, mUrl, eventCode] {
        //         MAKE_JS_CALL_2(RTC_EVENT_RTMP_STREAMING_EVENT, string, mUrl.c_str(), int32, (int)eventCode);
        //     });
        // }

        // void NodeEventHandler::onAudioPublishStateChanged(const char* channel, STREAM_PUBLISH_STATE oldState, STREAM_PUBLISH_STATE newState, int elapseSinceLastState)
        // {
        //     FUNC_TRACE;
        //     std::string mChannel(channel);
        //     node_async_call::async_call([this, mChannel, oldState, newState, elapseSinceLastState] {
        //         MAKE_JS_CALL_4(RTC_EVENT_AUDIO_PUBLISH_STATE_CHANGED, string, mChannel.c_str(), int32, (int)oldState, int32, (int)newState, int32, elapseSinceLastState);
        //     });
        // }

        // void NodeEventHandler::onVideoPublishStateChanged(const char* channel, STREAM_PUBLISH_STATE oldState, STREAM_PUBLISH_STATE newState, int elapseSinceLastState)
        // {
        //     FUNC_TRACE;
        //     std::string mChannel(channel);
        //     node_async_call::async_call([this, mChannel, oldState, newState, elapseSinceLastState] {
        //         MAKE_JS_CALL_4(RTC_EVENT_VIDEO_PUBLISH_STATE_CHANGED, string, mChannel.c_str(), int32, oldState, int32, newState, int32, elapseSinceLastState);
        //     });
        // }

        // void NodeEventHandler::onAudioSubscribeStateChanged(const char* channel, uid_t uid, STREAM_SUBSCRIBE_STATE oldState, STREAM_SUBSCRIBE_STATE newState, int elapseSinceLastState)
        // {
        //     FUNC_TRACE;
        //     std::string mChannel(channel);
        //     node_async_call::async_call([this, mChannel, uid, oldState, newState, elapseSinceLastState] {
        //         MAKE_JS_CALL_5(RTC_EVENT_AUDIO_SUBSCRIBE_STATE_CHANGED, string, mChannel.c_str(), uid, uid, int32, oldState, int32, newState, int32, elapseSinceLastState);
        //     });
        // }

        // void NodeEventHandler::onVideoSubscribeStateChanged(const char* channel, uid_t uid, STREAM_SUBSCRIBE_STATE oldState, STREAM_SUBSCRIBE_STATE newState, int elapseSinceLastState)
        // {
        //     FUNC_TRACE;
        //     std::string mChannel(channel);
        //     node_async_call::async_call([this, mChannel, uid, oldState, newState, elapseSinceLastState]{
        //         MAKE_JS_CALL_5(RTC_EVENT_VIDEO_SUBSCRIBE_STATE_CHANGED, string, mChannel.c_str(), uid, uid, int32, oldState, int32, newState, int32, elapseSinceLastState);
        //     });
        // }

        void NodeEventHandler::onAudioRoutingChanged(conn_id_t connId, int routing) {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, routing] {
                MAKE_JS_CALL_2(RTC_EVENT_AUDIO_ROUTE_CHANGED, uint32, connId, int32, (int)routing);
            });

        }

        void NodeEventHandler::onVideoSourceFrameSizeChanged(VIDEO_SOURCE_TYPE sourceType, int width, int height) {
            FUNC_TRACE;
            node_async_call::async_call([this, sourceType, width, height] {
                MAKE_JS_CALL_3(RTC_EVENT_VIDEO_FRAME_SIZE_CHANGED, int32, sourceType, int32, width, int32, height);
            });
        }

        void NodeEventHandler::onMediaDeviceChanged(conn_id_t connId, int deviceType) {
            FUNC_TRACE;
            node_async_call::async_call([this, connId, deviceType] {
                MAKE_JS_CALL_2(RTC_EVENT_MEDIA_DEVICE_CHANGED, uint32, connId, int32, deviceType);
            });
        }

        void NodeEventHandler::onExtensionEvent(const char* id, const char* key, const char* json_value) {
            FUNC_TRACE
            std::string sId(id);
            std::string sKey(key);
            std::string sJsonValue(json_value);
            node_async_call::async_call([this, sId, sKey, sJsonValue] {
                MAKE_JS_CALL_3(RTC_EVENT_EXTENSION_EVENT, string, sId.c_str(), string, sKey.c_str(), string, sJsonValue.c_str());
            });
        }
    }
}
