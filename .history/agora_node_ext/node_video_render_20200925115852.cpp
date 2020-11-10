/*
* Copyright (c) 2017 Agora.io
* All rights reserved.
* Proprietary and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2017
*/

#include "node_video_render.h"

namespace agora {
    namespace rtc {
        using namespace std::placeholders;

        NodeVideoRenderFactory::NodeVideoRenderFactory(NodeRtcEngine& engine)
            : m_engine(engine)
        {}

        NodeVideoRenderFactory::~NodeVideoRenderFactory() {}

        IExternalVideoRender* NodeVideoRenderFactory::createRenderInstance(const ExternalVideoRenerContext& context)
        {
            if (!context.view) {
                LOG_ERROR("Create Render Instance with null view");
                return nullptr;
            }
            return new NodeVideoRender((NodeRenderContext*)context.view, context);
        }

        NodeVideoRender::NodeVideoRender(NodeRenderContext* nrc, const ExternalVideoRenerContext& context)
        {
            m_channel.reset(new NodeVideoStreamChannel(nrc));
        }

        NodeVideoRender::~NodeVideoRender() 
        {
        }

        int NodeVideoRender::initialize()
        {
            return 0;
        }

        void NodeVideoRender::release()
        {

        }

        int NodeVideoRender::deliverFrame(const IVideoFrame& videoFrame, int rotation, bool mirrored)
        {
            if (m_channel.get())
                return m_channel->deliverFrame(videoFrame, rotation, mirrored);
            LOG_ERROR("Null channel");
            return -1;
        }
    }
}
