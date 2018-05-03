/*
* Copyright (c) 2018 Agora.io
* All rights reserved.
* Proprietary and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2018
*/
#ifdef _WIN32
#include <Windows.h>
#endif
#include "video_source_transporter.h"
#include <memory>
#include "video_source_ipc.h"
#include "video_source.h"
#include <fstream>
#include "libyuv.h"

using namespace libyuv;
using namespace agora::rtc;

/**
 * AgoraVideoSourcetransporter provide IAgroaVideoSourceTransporter implementation based on IPC.
 */
class AgoraVideoSourceTransporter : public IAgoraVideoSourceTransporter
{
public:
    AgoraVideoSourceTransporter(AgoraVideoSource& videoSource);
    ~AgoraVideoSourceTransporter();

    virtual bool initialize() override;
    virtual void release() override;
    virtual int deliverFrame(const IVideoFrame& videoFrame, int rotation, bool mirrored) override;
private:
    void clear();
    int deliverFrame_I420(const agora::media::IVideoFrame& videoFrame, int rotation, bool mirrored);
	void getVideoSize(agora::rtc::VIDEO_PROFILE_TYPE profile, int& width, int& height);
private:
    AgoraVideoSource& m_videoSource;
    std::vector<char> m_buf;
private:
    static const unsigned int S_MAX_DATA_LEN;
    static const unsigned int S_BUF_LEN;
};

#define MAX_VIDEO_WIDTH 2560
#define MAX_VIDEO_HEIGHT 1600

const unsigned int AgoraVideoSourceTransporter::S_MAX_DATA_LEN = MAX_VIDEO_WIDTH * MAX_VIDEO_HEIGHT;

const unsigned int AgoraVideoSourceTransporter::S_BUF_LEN = (int)(MAX_VIDEO_WIDTH * MAX_VIDEO_HEIGHT * 1.5 + 50);

AgoraVideoSourceTransporter::AgoraVideoSourceTransporter(AgoraVideoSource& videoSource)
    : m_videoSource(videoSource)
{
}

AgoraVideoSourceTransporter::~AgoraVideoSourceTransporter()
{
    clear();
}

void AgoraVideoSourceTransporter::clear()
{
}

bool AgoraVideoSourceTransporter::initialize()
{
    clear();
    m_buf.reserve(AgoraVideoSourceTransporter::S_BUF_LEN);
    return true;
}

void AgoraVideoSourceTransporter::release()
{
}

int AgoraVideoSourceTransporter::deliverFrame(const agora::media::IVideoFrame& videoFrame, int rotation, bool mirrored)
{
    /** Convey data. */
    deliverFrame_I420(videoFrame, rotation, mirrored);
    m_videoSource.sendData(m_buf.data(), AgoraVideoSourceTransporter::S_BUF_LEN);
    return 0;
}

int AgoraVideoSourceTransporter::deliverFrame_I420(const agora::media::IVideoFrame& videoFrame, int rotation, bool mirrored)
{
    int stride, stride0 = videoFrame.stride(IVideoFrame::Y_PLANE);
    int strideU = videoFrame.stride(IVideoFrame::U_PLANE);
    int strideV = videoFrame.stride(IVideoFrame::V_PLANE);
    stride = stride0;
    if (stride & 0xf){
        stride = (((stride + 15) >> 4) << 4);
    }
    int width = videoFrame.width();
    int height = videoFrame.height();
    int destWidth = 0, destHeight = 0;
    VIDEO_PROFILE_TYPE profile = m_videoSource.getVideoProfile();
    getVideoSize(profile, destWidth, destHeight);
    int destWidthU = destWidth / 2;
    int destHeightU = destHeight / 2;
    char* pbuf = m_buf.data();
    rotation = rotation < 0 ? rotation + 360 : rotation;
    image_frame_info *info = (image_frame_info*)pbuf;
	info->stride = destWidth;
	info->stride0 = destWidth;
	info->width = destWidth;
	info->height = destHeight;
	info->strideU = destWidthU ;
	info->strideV = destWidthU;

    image_header_type *hdr = (image_header_type*)(pbuf + sizeof(image_frame_info));
    hdr->mirrored = mirrored;
    hdr->rotation = rotation;
    hdr->width = destWidth;
    hdr->height = destHeight;
    hdr->right = 0;
    hdr->left = 0;
    hdr->top = 0;
    hdr->bottom = 0;
    hdr->timestamp = 0;

    char* y = pbuf + sizeof(image_frame_info) + sizeof(image_header_type);
	char* u = y + destWidth * destHeight;
	char* v = u + destWidthU * destHeightU;
    const unsigned char* planeY = videoFrame.buffer(IVideoFrame::Y_PLANE);
    const unsigned char* planeU = videoFrame.buffer(IVideoFrame::U_PLANE);
    const unsigned char* planeV = videoFrame.buffer(IVideoFrame::V_PLANE);
	I420Scale(planeY, stride0, planeU, strideU, planeV, strideV, width, height, 
        (uint8*)y, destWidth, (uint8*)u, destWidthU, (uint8*)v, destWidthU, destWidth, destHeight, kFilterNone);
    return 0;
}

void AgoraVideoSourceTransporter::getVideoSize(VIDEO_PROFILE_TYPE profile, int& width, int& height)
{
    switch (profile) {
    case VIDEO_PROFILE_LANDSCAPE_120P:         // 160x120   15
        width = 160;
        height = 120;
        break;
    case VIDEO_PROFILE_LANDSCAPE_120P_3:       // 120x120   15
        width = 120;
        height = 120;
        break;
    case VIDEO_PROFILE_LANDSCAPE_180P:        // 320x180   15
        width = 320;
        height = 180;
        break;
    case VIDEO_PROFILE_LANDSCAPE_180P_3:      // 180x180   15
        width = 180;
        height = 180;
        break;
    case VIDEO_PROFILE_LANDSCAPE_180P_4:      // 240x180   15
        width = 240;
        height = 180;
        break;
    case VIDEO_PROFILE_LANDSCAPE_240P:        // 320x240   15
        width = 320;
        height = 240;
        break;
    case VIDEO_PROFILE_LANDSCAPE_240P_3:      // 240x240   15
        width = 240;
        height = 240;
        break;
    case VIDEO_PROFILE_LANDSCAPE_240P_4:      // 424x240   15
        width = 420;
        height = 240;
        break;
    case VIDEO_PROFILE_LANDSCAPE_360P_3:      // 360x360   15
    case VIDEO_PROFILE_LANDSCAPE_360P_6:      // 360x360   30
        width = 360;
        height = 360;
        break;
    case VIDEO_PROFILE_LANDSCAPE_360P_7:      // 480x360   15
    case VIDEO_PROFILE_LANDSCAPE_360P_8:      // 480x360   30
        width = 480;
        height = 360;
        break;
    case VIDEO_PROFILE_LANDSCAPE_360P_9:      // 640x360   15
    case VIDEO_PROFILE_LANDSCAPE_360P_10:     // 640x360   24
    case VIDEO_PROFILE_LANDSCAPE_360P_11:    // 640x360   24
    case VIDEO_PROFILE_LANDSCAPE_360P:        // 640x360   15
    case VIDEO_PROFILE_LANDSCAPE_360P_4:      // 640x360   30
        width = 640;
        height = 360;
        break;
    case VIDEO_PROFILE_LANDSCAPE_480P:        // 640x480   15
    case VIDEO_PROFILE_LANDSCAPE_480P_4:      // 640x480   30
    case VIDEO_PROFILE_LANDSCAPE_480P_10:     // 640x480   10
        width = 640;
        height = 480;
        break;
    case VIDEO_PROFILE_LANDSCAPE_480P_3:      // 480x480   15
    case VIDEO_PROFILE_LANDSCAPE_480P_6:      // 480x480   30
        width = 480;
        height = 480;
        break;
    case VIDEO_PROFILE_LANDSCAPE_480P_8:      // 848x480   15
    case VIDEO_PROFILE_LANDSCAPE_480P_9:      // 848x480   30
        width = 840;
        height = 480;
        break;
    case VIDEO_PROFILE_LANDSCAPE_720P:        // 1280x720  15
    case VIDEO_PROFILE_LANDSCAPE_720P_3:      // 1280x720  30
        width = 1280;
        height = 720;
        break;
    case VIDEO_PROFILE_LANDSCAPE_720P_5:      // 960x720   15
    case VIDEO_PROFILE_LANDSCAPE_720P_6:      // 960x720   30
        width = 960;
        height = 720;
        break;
    case VIDEO_PROFILE_LANDSCAPE_1080P:       // 1920x1080 15
    case VIDEO_PROFILE_LANDSCAPE_1080P_3:     // 1920x1080 30
    case VIDEO_PROFILE_LANDSCAPE_1080P_5:     // 1920x1080 60
        width = 1920;
        height = 1080;
        break;
    case VIDEO_PROFILE_LANDSCAPE_1440P:       // 2560x1440 30
    case VIDEO_PROFILE_LANDSCAPE_1440P_2:     // 2560x1440 60
    case VIDEO_PROFILE_LANDSCAPE_4K:          // 3840x2160 30
    case VIDEO_PROFILE_LANDSCAPE_4K_3:        // 3840x2160 60
        width = 2560;
        height = 1440;
        break;


    case VIDEO_PROFILE_PORTRAIT_120P:       // 120x160   15
        width = 120;
        height = 160;
        break;
    case VIDEO_PROFILE_PORTRAIT_120P_3:     // 120x120   15
        width = 120;
        height = 120;
        break;
    case VIDEO_PROFILE_PORTRAIT_180P:       // 180x320   15
        width = 180;
        height = 320;
        break;
    case VIDEO_PROFILE_PORTRAIT_180P_3:     // 180x180   15
        width = 180;
        height = 180;
        break;
    case VIDEO_PROFILE_PORTRAIT_180P_4:     // 180x240   15
        width = 180;
        height = 240;
        break;
    case VIDEO_PROFILE_PORTRAIT_240P:       // 240x320   15
        width = 240;
        height = 320;
        break;
    case VIDEO_PROFILE_PORTRAIT_240P_3:     // 240x240   15
        width = 240;
        height = 240;
        break;
    case VIDEO_PROFILE_PORTRAIT_240P_4:     // 240x424   15
        width = 240;
        height = 420;
        break;
    case VIDEO_PROFILE_PORTRAIT_360P:       // 360x640   15
        width = 360;
        height = 640;
        break;
    case VIDEO_PROFILE_PORTRAIT_360P_3:     // 360x360   15
    case VIDEO_PROFILE_PORTRAIT_360P_6:     // 360x360   30
        width = 360;
        height = 360;
        break;
    case VIDEO_PROFILE_PORTRAIT_360P_4:     // 360x640   30
    case VIDEO_PROFILE_PORTRAIT_360P_9:     // 360x640   15
    case VIDEO_PROFILE_PORTRAIT_360P_10:    // 360x640   24
    case VIDEO_PROFILE_PORTRAIT_360P_11:    // 360x640   24
        width = 360;
        height = 640;
        break;
    case VIDEO_PROFILE_PORTRAIT_360P_7:     // 360x480   15
    case VIDEO_PROFILE_PORTRAIT_360P_8:     // 360x480   30
        width = 360;
        height = 480;
        break;
    case VIDEO_PROFILE_PORTRAIT_480P:       // 480x640   15
    case VIDEO_PROFILE_PORTRAIT_480P_4:     // 480x640   30
    case VIDEO_PROFILE_PORTRAIT_480P_10:    // 480x640   10
        width = 480;
        height = 640;
        break;
    case VIDEO_PROFILE_PORTRAIT_480P_3:     // 480x480   15
    case VIDEO_PROFILE_PORTRAIT_480P_6:     // 480x480   30
        width = 480;
        height = 480;
        break;
    case VIDEO_PROFILE_PORTRAIT_480P_8:     // 480x848   15
    case VIDEO_PROFILE_PORTRAIT_480P_9:     // 480x848   30
        width = 480;
        height = 840;
        break;
    case VIDEO_PROFILE_PORTRAIT_720P:       // 720x1280  15
    case VIDEO_PROFILE_PORTRAIT_720P_3:     // 720x1280  30
        width = 720;
        height = 1280;
        break;
    case VIDEO_PROFILE_PORTRAIT_720P_5:     // 720x960   15
    case VIDEO_PROFILE_PORTRAIT_720P_6:     // 720x960   30
        width = 720;
        height = 960;
        break;
    case VIDEO_PROFILE_PORTRAIT_1080P:      // 1080x1920 15
    case VIDEO_PROFILE_PORTRAIT_1080P_3:    // 1080x1920 30
    case VIDEO_PROFILE_PORTRAIT_1080P_5:    // 1080x1920 60
        width = 1080;
        height = 1920;
        break;
    case VIDEO_PROFILE_PORTRAIT_1440P:      // 1440x2560 30
    case VIDEO_PROFILE_PORTRAIT_1440P_2:    // 1440x2560 60
    case VIDEO_PROFILE_PORTRAIT_4K:         // 2160x3840 30
    case VIDEO_PROFILE_PORTRAIT_4K_3:       // 2160x3840 60
        width = 1440;
        height = 2560;
        break;
    }
}

IAgoraVideoSourceTransporter* createAgoraVideoSourceTransporter(AgoraVideoSource& videoSource)
{
    return new AgoraVideoSourceTransporter(videoSource);
}
