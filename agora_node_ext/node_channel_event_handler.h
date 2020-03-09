/*
* Copyright (c) 2017 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2017
*/

#ifndef AGORA_NODE_CHANNEL_EVENT_HANDLER_H
#define AGORA_NODE_CHANNEL_EVENT_HANDLER_H

#include "IAgoraRtcChannel.h"
#include "agora_node_ext.h"
#include <unordered_map>
#include <string>
#include <uv.h>
#include "node_napi_api.h"
namespace agora {
    namespace rtc {
#define RTC_CHANNEL_EVENT_CHANNEL_WARNING "channelWarning"
#define RTC_CHANNEL_EVENT_CHANNEL_ERROR "channelError"
#define RTC_CHANNEL_EVENT_JOIN_SUCCEESS "joinChannelSuccess"
#define RTC_CHANNEL_EVENT_REJOIN_SUCCEESS "rejoinChannelSuccess"
#define RTC_CHANNEL_EVENT_LEAVE_CHANNEL "leaveChannel"
#define RTC_CHANNEL_EVENT_CLIENT_ROLE_CHANGED "clientRoleChanged"
#define RTC_CHANNEL_EVENT_USER_JOINED "userJoined"
#define RTC_CHANNEL_EVENT_USER_OFFLINE "userOffline"
#define RTC_CHANNEL_EVENT_CONN_LOST "connectionLost"
#define RTC_CHANNEL_EVENT_REQUEST_TOKEN "requestToken"
#define RTC_CHANNEL_EVENT_TOKEN_PRIVILEGE_EXPIRE "tokenPrivilegeWillExpire"
#define RTC_CHANNEL_EVENT_RTC_STATS "rtcStats"
#define RTC_CHANNEL_EVENT_NETWORK_QUALITY "networkQuality"
#define RTC_CHANNEL_EVENT_REMOTE_VIDEO_STATS "remoteVideoStats"
#define RTC_CHANNEL_EVENT_REMOTE_AUDIO_STATS "remoteAudioStats"
#define RTC_CHANNEL_EVENT_REMOTE_AUDIO_STATE_CHANGED "remoteAudioStateChanged"
#define RTC_CHANNEL_EVENT_ACTIVE_SPEAKER "activeSpeaker"
#define RTC_CHANNEL_EVENT_FIRST_REMOTE_VIDEO_FRAME "firstRemoteVideoFrame"
#define RTC_CHANNEL_EVENT_FIRST_REMOTE_AUDIO_DECODED "firstRemoteAudioDecoded"
#define RTC_CHANNEL_EVENT_VIDEO_SIZE_CHANGED "videoSizeChanged"
#define RTC_CHANNEL_EVENT_REMOTE_VIDEO_STATE_CHANGED "remoteVideoStateChanged"
#define RTC_CHANNEL_EVENT_STREAM_MESSAGE "streamMessage"
#define RTC_CHANNEL_EVENT_STREAM_MESSAGE_ERROR "streamMessageError"
#define RTC_CHANNEL_EVENT_CHANNEL_MEDIA_RELAY_STATE_CHANGED "channelMediaRelayStateChanged"
#define RTC_CHANNEL_EVENT_CHANNEL_MEDIA_RELAY_EVENT "channelMediaRelayEvent"
#define RTC_CHANNEL_EVENT_FIRST_REMOTE_AUDIO_FRAME "firstRemoteAudioFrame"
#define RTC_CHANNEL_EVENT_RTMP_STREAMING_STATE_CHANGED "rtmpStreamingStateChanged"
#define RTC_CHANNEL_EVENT_STREAM_PUBLISHED "streamPublished"
#define RTC_CHANNEL_EVENT_STREAM_UNPUBLISHED "streamUnpublished"
#define RTC_CHANNEL_EVENT_TRANSCODING_UPDATED "transcodingUpdated"
#define RTC_CHANNEL_EVENT_STREAM_INJECED_STATUS "streamInjectedStatus"
#define RTC_CHANNEL_EVENT_REMOTE_SUBSCRIBE_FALLBACK_TO_AUDIO_ONLY "remoteSubscribeFallbackToAudioOnly"
#define RTC_CHANNEL_EVENT_CONN_STATE_CHANGED "connectionStateChanged"
        class NodeRtcChannel;
        class NodeUid;
        class NodeChannelEventHandler : public IChannelEventHandler
        {
        public:
            struct NodeEventCallback
            {
                Persistent<Function> callback;
                Persistent<Object> js_this;
            };
        public:
            NodeChannelEventHandler(NodeRtcChannel* pChannel);
            ~NodeChannelEventHandler();
            void fireApiError(const char* funcName);
            void addEventHandler(const std::string& eventName, Persistent<Object>& obj, Persistent<Function>& callback);
            
            virtual void onChannelWarning(IChannel *rtcChannel, int warn, const char* msg) override;
            
            virtual void onChannelError(IChannel *rtcChannel, int err, const char* msg) override;
            
            virtual void onJoinChannelSuccess(IChannel *rtcChannel, uid_t uid, int elapsed) override;
            
            virtual void onRejoinChannelSuccess(IChannel *rtcChannel, uid_t uid, int elapsed) override;
            
            virtual void onLeaveChannel(IChannel *rtcChannel, const RtcStats& stats) override;
            
            virtual void onClientRoleChanged(IChannel *rtcChannel, CLIENT_ROLE_TYPE oldRole, CLIENT_ROLE_TYPE newRole) override;
            
            virtual void onUserJoined(IChannel *rtcChannel, uid_t uid, int elapsed) override;
            
            virtual void onUserOffline(IChannel *rtcChannel, uid_t uid, USER_OFFLINE_REASON_TYPE reason) override;
            
            virtual void onConnectionLost(IChannel *rtcChannel) override;
            
            virtual void onRequestToken(IChannel *rtcChannel) override;
            
            virtual void onTokenPrivilegeWillExpire(IChannel *rtcChannel, const char* token) override;
            
            virtual void onRtcStats(IChannel *rtcChannel, const RtcStats& stats) override;
            
            virtual void onNetworkQuality(IChannel *rtcChannel, uid_t uid, int txQuality, int rxQuality) override;
            
            virtual void onRemoteVideoStats(IChannel *rtcChannel, const RemoteVideoStats& stats) override;
            
            virtual void onRemoteAudioStats(IChannel *rtcChannel, const RemoteAudioStats& stats) override;
            
            virtual void onRemoteAudioStateChanged(IChannel *rtcChannel, uid_t uid, REMOTE_AUDIO_STATE state, REMOTE_AUDIO_STATE_REASON reason, int elapsed) override;
            
            virtual void onActiveSpeaker(IChannel *rtcChannel, uid_t uid) override;
                       
            virtual void onVideoSizeChanged(IChannel *rtcChannel, uid_t uid, int width, int height, int rotation) override;
            
            virtual void onRemoteVideoStateChanged(IChannel *rtcChannel, uid_t uid, REMOTE_VIDEO_STATE state, REMOTE_VIDEO_STATE_REASON reason, int elapsed) override;
            
            virtual void onStreamMessage(IChannel *rtcChannel, uid_t uid, int streamId, const char* data, size_t length) override;
            
            virtual void onStreamMessageError(IChannel *rtcChannel, uid_t uid, int streamId, int code, int missed, int cached) override;
            
            virtual void onChannelMediaRelayStateChanged(IChannel *rtcChannel, CHANNEL_MEDIA_RELAY_STATE state,CHANNEL_MEDIA_RELAY_ERROR code) override;
            
            virtual void onChannelMediaRelayEvent(IChannel *rtcChannel, CHANNEL_MEDIA_RELAY_EVENT code) override;
                        
            virtual void onRtmpStreamingStateChanged(IChannel *rtcChannel, const char *url, RTMP_STREAM_PUBLISH_STATE state, RTMP_STREAM_PUBLISH_ERROR errCode) override;
                                    
            virtual void onTranscodingUpdated(IChannel *rtcChannel) override;
            
            virtual void onStreamInjectedStatus(IChannel *rtcChannel, const char* url, uid_t uid, int status) override;
            
            virtual void onRemoteSubscribeFallbackToAudioOnly(IChannel *rtcChannel, uid_t uid, bool isFallbackOrRecover) override;
            
            virtual void onConnectionStateChanged(IChannel *rtcChannel,
                                                CONNECTION_STATE_TYPE state,
                                                CONNECTION_CHANGED_REASON_TYPE reason) override;

        private:
            std::unordered_map<std::string, NodeEventCallback*> m_callbacks;
            NodeRtcChannel* m_channel;
        };
    }
}

#endif
