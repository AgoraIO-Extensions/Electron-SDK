/*
* Copyright (c) 2017 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2017
*/
#include "node_video_stream_channel.h"
#include "node_video_render.h"
#include "node_async_queue.h"
#include "node.h"
#include "node_buffer.h"
#include "v8.h"
#ifndef _WIN32
#include <sys/time.h>
#endif
namespace agora {
    namespace rtc {
        using namespace agora::media;

        NodeVideoStreamChannel::NodeVideoStreamChannel(NodeRenderContext *context)
        {
            m_context.reset(context);
            LOG_INFO("Create video stream channel for type : %d, uid :%d\n", context->m_type, context->m_uid);
        }

        NodeVideoStreamChannel::~NodeVideoStreamChannel()
        {
            LOG_INFO("%s\n", __FUNCTION__);
        }

        int NodeVideoStreamChannel::deliverFrame(const agora::media::IVideoFrame& videoFrame, int rotation, bool mirrored)
        {
            LOG_ENTER;
            auto *pTransporter = getNodeVideoFrameTransporter();
            if (pTransporter) {
                pTransporter->deliverFrame_I420(m_context->m_type, m_context->m_uid, m_context->m_channelId, videoFrame, rotation, mirrored);
            }
            LOG_LEAVE;
            return 0;
        }
    }
}
