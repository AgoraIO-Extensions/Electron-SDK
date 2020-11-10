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

namespace agora {
    namespace rtc {
        class NodeVideoFrameObserver : public media::IVideoFrameObserver
        {
            public:
            virtual ~NodeVideoFrameObserver() = default;
            virtual bool onCaptureVideoFrame(agora::media::IVideoFrameObserver::VideoFrame& videoFrame) override;
            virtual bool onRenderVideoFrame(unsigned int uid, agora::media::IVideoFrameObserver::VideoFrame& videoFrame) override;
        };
    }
}

#endif
