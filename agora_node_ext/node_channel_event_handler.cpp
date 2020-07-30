/*
* Copyright (c) 2017 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2017
*/

#include "node_channel_event_handler.h"
#include "node_log.h"
#include <stdio.h>
#include "node_uid.h"
#include "agora_rtc_engine.h"
#include "uv.h"
#include "node_async_queue.h"
namespace agora {
    namespace rtc {

#define FUNC_TRACE 

        NodeChannelEventHandler::NodeChannelEventHandler(NodeRtcChannel *pChannel)
            : m_channel(pChannel)
        {
        }

        NodeChannelEventHandler::~NodeChannelEventHandler() 
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
        void NodeChannelEventHandler::addEventHandler(const std::string& eventName, Persistent<Object>& obj, Persistent<Function>& callback)
        {
            FUNC_TRACE;
            NodeEventCallback *cb = new NodeEventCallback();
            cb->js_this.Reset(obj);
            cb->callback.Reset(callback);
            m_callbacks.emplace(eventName, cb);
        }

        void NodeChannelEventHandler::fireApiError(const char* funcName)
        {
            FUNC_TRACE;
            MAKE_JS_CALL_1(RTC_EVENT_API_ERROR, string, funcName);
        }

        void NodeChannelEventHandler::onJoinChannelSuccess(IChannel *rtcChannel, uid_t uid, int elapsed)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, elapsed] {
                MAKE_JS_CALL_2(RTC_CHANNEL_EVENT_JOIN_SUCCEESS, uid, uid, int32, elapsed);
            });
        }


        void NodeChannelEventHandler::onChannelWarning(IChannel *rtcChannel, int warn, const char* msg){
            FUNC_TRACE;
            std::string m_msg(nullable(msg));
            node_async_call::async_call([this, warn, m_msg] {
                MAKE_JS_CALL_2(RTC_CHANNEL_EVENT_CHANNEL_WARNING, int32, warn, string, m_msg.c_str());
            });
        }
            
        void NodeChannelEventHandler::onChannelError(IChannel *rtcChannel, int err, const char* msg) {
            FUNC_TRACE;
            std::string m_msg(nullable(msg));
            node_async_call::async_call([this, err, m_msg] {
                MAKE_JS_CALL_2(RTC_CHANNEL_EVENT_CHANNEL_ERROR, int32, err, string, m_msg.c_str());
            });
        }
        
        void NodeChannelEventHandler::onRejoinChannelSuccess(IChannel *rtcChannel, uid_t uid, int elapsed) {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, elapsed] {
                MAKE_JS_CALL_2(RTC_CHANNEL_EVENT_REJOIN_SUCCEESS, uid, uid, int32, elapsed);
            });
        }
        
        void NodeChannelEventHandler::onLeaveChannel(IChannel *rtcChannel, const RtcStats& stats) {
            FUNC_TRACE;
            unsigned int usercount = stats.userCount;
            node_async_call::async_call([this, stats, usercount] {
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
                    NODE_SET_OBJ_PROP_UINT32(obj, "txPacketLossRate", stats.txPacketLossRate);
                    NODE_SET_OBJ_PROP_UINT32(obj, "rxPacketLossRate", stats.rxPacketLossRate);
                    NODE_SET_OBJ_PROP_NUMBER(obj, "cpuAppUsage", stats.cpuAppUsage);
                    NODE_SET_OBJ_PROP_NUMBER(obj, "cpuTotalUsage", stats.cpuTotalUsage);
                    NODE_SET_OBJ_PROP_NUMBER(obj, "gatewayRtt", stats.gatewayRtt);
                    NODE_SET_OBJ_PROP_NUMBER(obj, "memoryAppUsageRatio", stats.memoryAppUsageRatio);
                    NODE_SET_OBJ_PROP_NUMBER(obj, "memoryTotalUsageRatio", stats.memoryTotalUsageRatio);
                    NODE_SET_OBJ_PROP_NUMBER(obj, "memoryAppUsageInKbytes", stats.memoryAppUsageInKbytes);
                    Local<Value> arg[1] = { obj };
                    auto it = m_callbacks.find(RTC_CHANNEL_EVENT_LEAVE_CHANNEL);
                    if (it != m_callbacks.end()) {
                        it->second->callback.Get(isolate)->Call(context, it->second->js_this.Get(isolate), 1, arg); \
                    }
                } while(false);
            });
        }
        
        void NodeChannelEventHandler::onClientRoleChanged(IChannel *rtcChannel, CLIENT_ROLE_TYPE oldRole, CLIENT_ROLE_TYPE newRole) {
            FUNC_TRACE;
            node_async_call::async_call([this, oldRole, newRole] {
                MAKE_JS_CALL_2(RTC_CHANNEL_EVENT_CLIENT_ROLE_CHANGED, int32, oldRole, int32, newRole);
            });
        }
        
        void NodeChannelEventHandler::onUserJoined(IChannel *rtcChannel, uid_t uid, int elapsed) {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, elapsed] {
                MAKE_JS_CALL_2(RTC_CHANNEL_EVENT_USER_JOINED, uid, uid, int32, elapsed);
            });
        }
        
        void NodeChannelEventHandler::onUserOffline(IChannel *rtcChannel, uid_t uid, USER_OFFLINE_REASON_TYPE reason) {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, reason] {
                MAKE_JS_CALL_2(RTC_CHANNEL_EVENT_USER_OFFLINE, uid, uid, int32, reason);
            });
        }
        
        void NodeChannelEventHandler::onConnectionLost(IChannel *rtcChannel) {
            FUNC_TRACE;
            node_async_call::async_call([this] {
                MAKE_JS_CALL_0(RTC_CHANNEL_EVENT_CONN_LOST);
            });
        }
        
        void NodeChannelEventHandler::onRequestToken(IChannel *rtcChannel) {
            FUNC_TRACE;
            node_async_call::async_call([this] {
                MAKE_JS_CALL_0(RTC_CHANNEL_EVENT_REQUEST_TOKEN);
            });
        }
        
        void NodeChannelEventHandler::onTokenPrivilegeWillExpire(IChannel *rtcChannel, const char* token) {
            FUNC_TRACE;
            std::string m_token(nullable(token));
            node_async_call::async_call([this, m_token] {
                MAKE_JS_CALL_1(RTC_CHANNEL_EVENT_TOKEN_PRIVILEGE_EXPIRE, string, m_token.c_str());
            });
        }
        
        void NodeChannelEventHandler::onRtcStats(IChannel *rtcChannel, const RtcStats& stats) {
            FUNC_TRACE;
            unsigned int usercount = stats.userCount;
            node_async_call::async_call([this, stats, usercount] {
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
                    NODE_SET_OBJ_PROP_UINT32(obj, "txPacketLossRate", stats.txPacketLossRate);
                    NODE_SET_OBJ_PROP_UINT32(obj, "rxPacketLossRate", stats.rxPacketLossRate);
                    NODE_SET_OBJ_PROP_NUMBER(obj, "cpuAppUsage", stats.cpuAppUsage);
                    NODE_SET_OBJ_PROP_NUMBER(obj, "cpuTotalUsage", stats.cpuTotalUsage);
                    NODE_SET_OBJ_PROP_NUMBER(obj, "gatewayRtt", stats.gatewayRtt);
                    NODE_SET_OBJ_PROP_NUMBER(obj, "memoryAppUsageRatio", stats.memoryAppUsageRatio);
                    NODE_SET_OBJ_PROP_NUMBER(obj, "memoryTotalUsageRatio", stats.memoryTotalUsageRatio);
                    NODE_SET_OBJ_PROP_NUMBER(obj, "memoryAppUsageInKbytes", stats.memoryAppUsageInKbytes);
                    Local<Value> arg[1] = { obj };
                    auto it = m_callbacks.find(RTC_CHANNEL_EVENT_RTC_STATS);
                    if (it != m_callbacks.end()) {
                        it->second->callback.Get(isolate)->Call(context, it->second->js_this.Get(isolate), 1, arg); \
                    }
                } while(false);
            });
        }
        
        void NodeChannelEventHandler::onNetworkQuality(IChannel *rtcChannel, uid_t uid, int txQuality, int rxQuality) {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, txQuality, rxQuality] {
                MAKE_JS_CALL_3(RTC_CHANNEL_EVENT_NETWORK_QUALITY, uid, uid, int32, txQuality, int32, rxQuality);
            });
        }
        
        void NodeChannelEventHandler::onRemoteVideoStats(IChannel *rtcChannel, const RemoteVideoStats& stats) {
            FUNC_TRACE;
            node_async_call::async_call([this, stats] {
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
                    Local<Value> arg[1] = { obj };
                    auto it = m_callbacks.find(RTC_CHANNEL_EVENT_REMOTE_VIDEO_STATS);
                    if (it != m_callbacks.end()) {
                        it->second->callback.Get(isolate)->Call(context, it->second->js_this.Get(isolate), 1, arg); \
                    }
                }while(false);
            });
        }
        
        void NodeChannelEventHandler::onRemoteAudioStats(IChannel *rtcChannel, const RemoteAudioStats& stats) {
            FUNC_TRACE;
            FUNC_TRACE;
            node_async_call::async_call([this, stats] {
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
                    Local<Value> arg[1] = { obj };
                    auto it = m_callbacks.find(RTC_CHANNEL_EVENT_REMOTE_AUDIO_STATS);
                    if (it != m_callbacks.end()) {
                        it->second->callback.Get(isolate)->Call(context, it->second->js_this.Get(isolate), 1, arg); \
                    }
                } while (false);
            });
        }
        
        void NodeChannelEventHandler::onRemoteAudioStateChanged(IChannel *rtcChannel, uid_t uid, REMOTE_AUDIO_STATE state, REMOTE_AUDIO_STATE_REASON reason, int elapsed) {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, state, reason, elapsed] {
                MAKE_JS_CALL_4(RTC_CHANNEL_EVENT_REMOTE_AUDIO_STATE_CHANGED, uid, uid, int32, state, int32, reason, int32, elapsed);
            });
        }
        
        void NodeChannelEventHandler::onActiveSpeaker(IChannel *rtcChannel, uid_t uid) {
            FUNC_TRACE;
            node_async_call::async_call([this, uid] {
                MAKE_JS_CALL_1(RTC_CHANNEL_EVENT_ACTIVE_SPEAKER, uid, uid);
            });
        }
        
        void NodeChannelEventHandler::onVideoSizeChanged(IChannel *rtcChannel, uid_t uid, int width, int height, int rotation) {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, width, height, rotation] {
                MAKE_JS_CALL_4(RTC_CHANNEL_EVENT_VIDEO_SIZE_CHANGED, uid, uid, int32, width, int32, height, int32, rotation);
            });
        }
        
        void NodeChannelEventHandler::onRemoteVideoStateChanged(IChannel *rtcChannel, uid_t uid, REMOTE_VIDEO_STATE state, REMOTE_VIDEO_STATE_REASON reason, int elapsed) {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, state, reason, elapsed] {
                MAKE_JS_CALL_4(RTC_CHANNEL_EVENT_REMOTE_VIDEO_STATE_CHANGED, uid, uid, int32, state, int32, reason, int32, elapsed);
            });
        }
        
        void NodeChannelEventHandler::onStreamMessage(IChannel *rtcChannel, uid_t uid, int streamId, const char* data, size_t length) {
            FUNC_TRACE;
            std::string m_data(nullable(data));
            node_async_call::async_call([this, uid, streamId, m_data] {
                MAKE_JS_CALL_3(RTC_CHANNEL_EVENT_STREAM_MESSAGE, uid, uid, int32, streamId, string, m_data.c_str());
            });
        }
        
        void NodeChannelEventHandler::onStreamMessageError(IChannel *rtcChannel, uid_t uid, int streamId, int code, int missed, int cached) {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, streamId, code, missed, cached] {
                MAKE_JS_CALL_5(RTC_CHANNEL_EVENT_STREAM_MESSAGE_ERROR, uid, uid, int32, streamId, int32, code, int32, missed, int32, cached);
            });
        }
        
        void NodeChannelEventHandler::onChannelMediaRelayStateChanged(IChannel *rtcChannel, CHANNEL_MEDIA_RELAY_STATE state,CHANNEL_MEDIA_RELAY_ERROR code) {
            FUNC_TRACE;
            node_async_call::async_call([this, state, code] {
                MAKE_JS_CALL_2(RTC_CHANNEL_EVENT_CHANNEL_MEDIA_RELAY_STATE_CHANGED, int32, state, int32, code);
            });
        }
        
        void NodeChannelEventHandler::onChannelMediaRelayEvent(IChannel *rtcChannel, CHANNEL_MEDIA_RELAY_EVENT code) {
            FUNC_TRACE;
            node_async_call::async_call([this, code] {
                MAKE_JS_CALL_1(RTC_CHANNEL_EVENT_CHANNEL_MEDIA_RELAY_EVENT, int32, code);
            });
        }
        
        void NodeChannelEventHandler::onRtmpStreamingStateChanged(IChannel *rtcChannel, const char *url, RTMP_STREAM_PUBLISH_STATE state, RTMP_STREAM_PUBLISH_ERROR errCode) {
            FUNC_TRACE;
            std::string m_url(nullable(url));
            node_async_call::async_call([this, m_url, state, errCode] {
                MAKE_JS_CALL_3(RTC_CHANNEL_EVENT_RTMP_STREAMING_STATE_CHANGED, string, m_url.c_str(), int32, state, int32, errCode);
            });
        }
        
        void NodeChannelEventHandler::onTranscodingUpdated(IChannel *rtcChannel) {
            FUNC_TRACE;
            node_async_call::async_call([this] {
                MAKE_JS_CALL_0(RTC_CHANNEL_EVENT_TRANSCODING_UPDATED);
            });
        }
        
        void NodeChannelEventHandler::onStreamInjectedStatus(IChannel *rtcChannel, const char* url, uid_t uid, int status) {
            FUNC_TRACE;
            std::string m_url(nullable(url));
            node_async_call::async_call([this, m_url, uid, status] {
                MAKE_JS_CALL_3(RTC_CHANNEL_EVENT_STREAM_INJECED_STATUS, string, m_url.c_str(), uid, uid, int32, status);
            });
        }
        
        void NodeChannelEventHandler::onRemoteSubscribeFallbackToAudioOnly(IChannel *rtcChannel, uid_t uid, bool isFallbackOrRecover) {
            FUNC_TRACE;
            node_async_call::async_call([this, uid, isFallbackOrRecover] {
                MAKE_JS_CALL_2(RTC_CHANNEL_EVENT_REMOTE_SUBSCRIBE_FALLBACK_TO_AUDIO_ONLY, uid, uid, bool, isFallbackOrRecover);
            });
        }
        
        void NodeChannelEventHandler::onConnectionStateChanged(IChannel *rtcChannel,
                                            CONNECTION_STATE_TYPE state,
                                            CONNECTION_CHANGED_REASON_TYPE reason)
        {
            FUNC_TRACE;
            node_async_call::async_call([this, state, reason] {
                MAKE_JS_CALL_2(RTC_CHANNEL_EVENT_CONN_STATE_CHANGED, int32, state, int32, reason);
            });
        }
    }
}
