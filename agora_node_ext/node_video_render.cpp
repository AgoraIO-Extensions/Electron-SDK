/*
* Copyright (c) 2017 Agora.io
* All rights reserved.
* Proprietary and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2017
*/

#include "node_video_render.h"
#include "node_napi_api.h"

namespace agora {
    namespace rtc {
        bool NodeVideoFrameObserver::onCaptureVideoFrame(agora::media::IVideoFrameObserver::VideoFrame& videoFrame) 
        {
            auto *pTransporter = getNodeVideoFrameTransporter();
            pTransporter->deliverFrame_I420(NodeRenderType::NODE_RENDER_TYPE_LOCAL, 0, "", videoFrame);

            return true;
        }

        bool NodeVideoFrameObserver::onRenderVideoFrame(rtc::uid_t uid, rtc::conn_id_t connectionId, agora::media::IVideoFrameObserver::VideoFrame& videoFrame)
        {
            auto *pTransporter = getNodeVideoFrameTransporter();
            pTransporter->deliverFrame_I420(NodeRenderType::NODE_RENDER_TYPE_REMOTE, uid, "", videoFrame);

            return false;
        }

        bool NodeVideoFrameObserver::onScreenCaptureVideoFrame(VideoFrame& videoFrame)
        {
            auto *pTransporter = getNodeVideoFrameTransporter();
            pTransporter->deliverFrame_I420(NodeRenderType::NODE_RENDER_TYPE_VIDEO_SOURCE, 0, "", videoFrame);

            return false;
        }
    }
}
