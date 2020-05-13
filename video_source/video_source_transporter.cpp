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
    void copyAndCentreYuv(const unsigned char* srcYPlane, const unsigned char* srcUPlane, const unsigned char* srcVPlane, int width, int height, int srcStride,
char* dstYPlane, char* dstUPlane, char* dstVPlane, int dstStride);
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
    // VIDEO_PROFILE_TYPE profile = m_videoSource.getVideoProfile();
    // getVideoSize(profile, destWidth, destHeight);
    destWidth = stride;
    destHeight = height;
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
	// I420Scale(planeY, stride0, planeU, strideU, planeV, strideV, width, height, 
    //     (uint8*)y, destWidth, (uint8*)u, destWidthU, (uint8*)v, destWidthU, destWidth, destHeight, kFilterNone);
    int src_stride = stride0;
    int dest_stride = stride;
    int width2 = dest_stride / 2;


    if (videoFrame.width() == width && videoFrame.height() == height)
    {
        copyAndCentreYuv(planeY, planeU, planeV, videoFrame.width(), videoFrame.height(), src_stride, y, u, v, dest_stride);
    }
    else
    {
        I420Scale(planeY, stride0, planeU, strideU, planeV, strideV, videoFrame.width(), videoFrame.height(), (uint8*)y, dest_stride, (uint8*)u, width2, (uint8*)v, width2, width, height, kFilterNone);
    }
    // memcpy(y, planeY, destWidth * destHeight);
    // memcpy(u, planeU, destWidthU * destHeightU);
    // memcpy(v, planeV, destWidthU * destHeightU);
    return 0;
}

void AgoraVideoSourceTransporter::copyAndCentreYuv(const unsigned char* srcYPlane, const unsigned char* srcUPlane, const unsigned char* srcVPlane, int width, int height, int srcStride,
char* dstYPlane, char* dstUPlane, char* dstVPlane, int dstStride)
{
    if (srcStride == width && dstStride == width)
    {
        memcpy(dstYPlane, srcYPlane, width * height);
        memcpy(dstUPlane, srcUPlane, width * height / 4);
        memcpy(dstVPlane, srcVPlane, width * height / 4);
        return;
    }

    int dstDiff = dstStride - width;
    //RGB(0,0,0) to YUV(0,128,128)
    memset(dstYPlane, 0, dstStride * height);
    memset(dstUPlane, 128, dstStride * height / 4);
    memset(dstVPlane, 128, dstStride * height / 4);

    for (int i = 0; i < height; ++i)
    {
        memcpy(dstYPlane + (dstDiff >> 1), srcYPlane, width);
        srcYPlane += srcStride;
        dstYPlane += dstStride;

        if (i % 2 == 0)
        {
            memcpy(dstUPlane + (dstDiff >> 2), srcUPlane, width >> 1);
            srcUPlane += srcStride >> 1;
            dstUPlane += dstStride >> 1;

            memcpy(dstVPlane + (dstDiff >> 2), srcVPlane, width >> 1);
            srcVPlane += srcStride >> 1;
            dstVPlane += dstStride >> 1;
        }
    }
}

void AgoraVideoSourceTransporter::getVideoSize(VIDEO_PROFILE_TYPE profile, int& width, int& height)
{
    switch (profile) {

    case VIDEO_PROFILE_LANDSCAPE_120P:         // 160x120   15   65
        width = 160;
        height = 120;
        break;
    case VIDEO_PROFILE_LANDSCAPE_120P_3:      // 120x120   15   50
        width = 120;
        height = 120;
        break;
    case VIDEO_PROFILE_LANDSCAPE_180P:        // 320x180   15   140
        width = 320;
        height = 180;
        break;
    case VIDEO_PROFILE_LANDSCAPE_180P_3:     // 180x180   15   100
        width = 180;
        height = 180;
        break;
    case VIDEO_PROFILE_LANDSCAPE_180P_4:     // 240x180   15   120
        width = 240;
        height = 180;
        break;
    case VIDEO_PROFILE_LANDSCAPE_240P:       // 320x240   15   200
        width = 320;
        height = 240;
        break;
    case VIDEO_PROFILE_LANDSCAPE_240P_3:      // 240x240   15   140
        width = 240;
        height = 240;
        break;
    case VIDEO_PROFILE_LANDSCAPE_240P_4:     // 424x240   15   220
        width = 424;
        height = 240;
        break;
    case VIDEO_PROFILE_LANDSCAPE_360P_3:    // 360x360   15   260
    case VIDEO_PROFILE_LANDSCAPE_360P_6:    // 360x360   30   400
        width = 360;
        height = 360;
        break;
    case VIDEO_PROFILE_LANDSCAPE_360P_4:    // 640x360   30   600
    case VIDEO_PROFILE_LANDSCAPE_360P_9:    // 640x360   15   800
    case VIDEO_PROFILE_LANDSCAPE_360P_10:   // 640x360   24   800
    case VIDEO_PROFILE_LANDSCAPE_360P_11:   // 640x360   24   1000
        width = 640;
        height = 360;
        break;
    case VIDEO_PROFILE_LANDSCAPE_360P_7:    // 480x360   15   320
    case VIDEO_PROFILE_LANDSCAPE_360P_8:    // 480x360   30   490
        width = 480;
        height = 360;
        break;

    case VIDEO_PROFILE_LANDSCAPE_480P:      // 640x480   15   500
    case VIDEO_PROFILE_LANDSCAPE_480P_3:    // 480x480   15   400
    case VIDEO_PROFILE_LANDSCAPE_480P_4:    // 640x480   30   750
    case VIDEO_PROFILE_LANDSCAPE_480P_10:   // 640x480   10   400
        width = 640;
        height = 480;
        break;
    case VIDEO_PROFILE_LANDSCAPE_480P_6:    // 480x480   30   600
        width = 480;
        height = 480;
        break;
    case VIDEO_PROFILE_LANDSCAPE_480P_8:    // 848x480   15   610
    case VIDEO_PROFILE_LANDSCAPE_480P_9:    // 848x480   30   930
        width = 848;
        height = 480;
        break;
    case VIDEO_PROFILE_LANDSCAPE_720P:      // 1280x720  15   1130
    case VIDEO_PROFILE_LANDSCAPE_720P_3:    // 1280x720  30   1710
        width = 1280;
        height = 720;
        break;
    case VIDEO_PROFILE_LANDSCAPE_720P_5:    // 960x720   15   910
    case VIDEO_PROFILE_LANDSCAPE_720P_6:    // 960x720   30   1380
        width = 960;
        height = 720;
        break;
    case VIDEO_PROFILE_LANDSCAPE_1080P:     // 1920x1080 15   2080
    case VIDEO_PROFILE_LANDSCAPE_1080P_3:   // 1920x1080 30   3150
    case VIDEO_PROFILE_LANDSCAPE_1080P_5:   // 1920x1080 60   4780
        width = 1920;
        height = 1080;
        break;
    case VIDEO_PROFILE_LANDSCAPE_1440P:     // 2560x1440 30   4850
    case VIDEO_PROFILE_LANDSCAPE_1440P_2:   // 2560x1440 60   7350
        width = 2560;
        height = 1440;
        break;
    case VIDEO_PROFILE_LANDSCAPE_4K:     // 2560x1440 30   4850
    case VIDEO_PROFILE_LANDSCAPE_4K_3:   // 2560x1440 60   7350
        width = 3840;
        height = 2160;
        break;
    }
}

IAgoraVideoSourceTransporter* createAgoraVideoSourceTransporter(AgoraVideoSource& videoSource)
{
    return new AgoraVideoSourceTransporter(videoSource);
}
