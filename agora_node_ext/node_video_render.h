/*
* Copyright (c) 2017 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2017
*/

#ifndef AGORA_NODE_VIDEO_RENDER_H
#define AGORA_NODE_VIDEO_RENDER_H

#include "IAgoraMediaEngine.h"
#include "IAgoraRtcEngine.h"
#include "agora_rtc_engine.h"
#include "node_video_stream_channel.h"

namespace agora {
    namespace rtc {
        using media::IExternalVideoRenderFactory;
        using media::IExternalVideoRender;
        using media::ExternalVideoRenerContext;
        using media::IVideoFrame;
        using media::IExternalVideoRenderCallback;
        
        struct NodeRenderContext
        {
            enum NodeRenderType m_type;
            uid_t m_uid;
            
            NodeRenderContext(enum NodeRenderType type, uid_t uid = 0)
            : m_type(type)
            , m_uid(uid)
            {
            }
        };
        
        /**
         * IExternalVideoRenderFactory implementation used to create video render.
         */
        class NodeVideoRenderFactory : public IExternalVideoRenderFactory
        {
        public:
            NodeVideoRenderFactory(NodeRtcEngine& engine);
            ~NodeVideoRenderFactory();

        public:
            virtual IExternalVideoRender* createRenderInstance(const ExternalVideoRenerContext& context) override;
        protected:
            NodeRtcEngine& m_engine;
        };

        /**
         * IExtenral Video Render implementation used to render video data.
         */
        class NodeVideoRender : public IExternalVideoRender
        {
        public:
            NodeVideoRender(NodeRenderContext* nrc, const ExternalVideoRenerContext& context);
            ~NodeVideoRender();

        public:
            virtual void release() override;
            virtual int initialize() override;
            virtual int deliverFrame(const IVideoFrame& videoFrame, int rotation, bool mirrored) override;
        private:
            std::unique_ptr<NodeVideoStreamChannel> m_channel;
        };
    }
}

#endif
