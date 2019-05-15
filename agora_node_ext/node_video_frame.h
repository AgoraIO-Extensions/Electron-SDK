/*
* Copyright (c) 2019 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

#ifndef AGORA_NODE_VIDEO_FRAME_H
#define AGORA_NODE_VIDEO_FRAME_H

#include "IAgoraMediaEngine.h"
#include "IAgoraRtcEngine.h"
#include <string>

struct FaceUnityOptions
{
	std::string filter_name;
	double filter_level;
	double color_level;
	double red_level;
	double blur_level;
	double skin_detect;
	double nonshin_blur_scale;
	double heavy_blur;
	double blur_blend_ratio;


	FaceUnityOptions()
		: filter_name("origin")
		, filter_level(0)
		, color_level(0)
		, red_level(0)
		, blur_level(0)
		, skin_detect(0)
		, nonshin_blur_scale(0)
		, heavy_blur(0)
		, blur_blend_ratio(0)
	{}
};

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
			int setFaceUnityOptions(FaceUnityOptions options);
        private:
            unsigned char *yuvData(VideoFrame& videoFrame);
            int yuvSize(VideoFrame& videoFrame);
            void videoFrameData(VideoFrame& videoFrame, unsigned char *yuvData);
			char* auth_package;
			int auth_package_size;
			FaceUnityOptions mOptions;
			bool mNeedUpdateFUOptions = true;
        };
    }
}

#endif
