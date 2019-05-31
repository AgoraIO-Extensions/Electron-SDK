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
#include "FUConfig.h"

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
	double face_shape;
	double face_shape_level;
	double eye_enlarging;
	double cheek_thinning;
	double intensity_nose;
	double intensity_forehead;
	double intensity_mouth;
	double intensity_chin;
	double change_frames;
	double eye_bright;
	double tooth_whiten;
	double is_beauty_on;

	FaceUnityOptions()
		: filter_name(default_filter_name)
		, filter_level(default_filter_level)
		, color_level(default_color_level)
		, red_level(default_red_level)
		, blur_level(default_blur_level)
		, skin_detect(default_skin_detect)
		, nonshin_blur_scale(default_nonshin_blur_scale)
		, heavy_blur(default_heavy_blur)
		, face_shape(default_face_shape)
	    , face_shape_level(default_face_shape_level)
		, eye_enlarging(default_eye_enlarging)
		, cheek_thinning(default_cheek_thinning)
		, intensity_nose(default_intensity_nose)
		, intensity_forehead(default_intensity_forehead)
		, intensity_mouth(default_intensity_mouth)
		, intensity_chin(default_intensity_chin)
		, change_frames(default_change_frames)
		, eye_bright(default_eye_bright)
		, tooth_whiten(default_tooth_whiten)
		, is_beauty_on(default_is_beauty_on)
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
