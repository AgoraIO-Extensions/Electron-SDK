/*
* Copyright (c) 2019 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

#ifndef AGORA_NODE_VIDEO_FRAME_H
#define AGORA_NODE_VIDEO_FRAME_H

#include "IAgoraMediaEngine.h"
#include "IAgoraRtcEngine.h"

namespace agora {
    namespace rtc {
        using media::IVideoFrameObserver;
        using media::IVideoFrame;
        
        /**
         * IExternalVideoRenderFactory implementation used to create video render.
         */
        class NodeVideoFrameObserver : public IVideoFrameObserver
        {
        public:
            NodeVideoFrameObserver(char* authdata, int authsize);
            ~NodeVideoFrameObserver();
            virtual bool onCaptureVideoFrame(VideoFrame& videoFrame) override;
            virtual bool onRenderVideoFrame(unsigned int uid, VideoFrame& videoFrame) override;
        private:
            unsigned char *yuvData(VideoFrame& videoFrame);
            int yuvSize(VideoFrame& videoFrame);
            void videoFrameData(VideoFrame& videoFrame, unsigned char *yuvData);
			char* auth_package;
			int auth_package_size;
        };
    }
}

#endif
