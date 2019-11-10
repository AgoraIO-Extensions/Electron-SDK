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
#define RTC_CHANNEL_EVENT_JOIN_SUCCEESS "joinChannelSuccess"
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
            
            virtual void onJoinChannelSuccess(IChannel *rtcChannel, uid_t uid, int elapsed) override;

        private:

        private:
            std::unordered_map<std::string, NodeEventCallback*> m_callbacks;
            NodeRtcChannel* m_channel;
        };
    }
}

#endif
