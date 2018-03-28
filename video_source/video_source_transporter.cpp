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
    int width = videoFrame.width();
    int height = videoFrame.height();
    if(width > MAX_VIDEO_WIDTH || height > MAX_VIDEO_HEIGHT) {
        return 0;
    }
    
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

    char* pbuf = m_buf.data();
    rotation = rotation < 0 ? rotation + 360 : rotation;
    image_frame_info *info = (image_frame_info*)pbuf;
    info->stride = stride;
    info->stride0 = stride0;
    info->width = width;
    info->height = height;
    info->strideU = strideU;
    info->strideV = strideV;

    image_header_type *hdr = (image_header_type*)(pbuf + sizeof(image_frame_info));
    hdr->mirrored = mirrored;
    hdr->rotation = htons(rotation);
    hdr->width = htons(width);
    hdr->height = htons(height);
    hdr->right = htons((unsigned short)(stride - width));
    hdr->left = htons((uint16_t)0);
    hdr->top = htons((uint16_t)0);
    hdr->bottom = htons((uint16_t)0);
    hdr->timestamp = htons(0);
    int width2 = width / 2;
    int height2 = height / 2;

    char* y = pbuf + sizeof(image_frame_info) + sizeof(image_header_type);
    char* u = y + stride * height;
    char* v = u + stride / 2 * height2;
    const unsigned char* planeY = videoFrame.buffer(IVideoFrame::Y_PLANE);
    const unsigned char* planeU = videoFrame.buffer(IVideoFrame::U_PLANE);
    const unsigned char* planeV = videoFrame.buffer(IVideoFrame::V_PLANE);
    int i = 0;
    for (i = 0; i < height2; i++){
        memcpy(y + i * stride, planeY + i * stride0, width);
        memcpy(u + i * stride / 2, planeU + i * strideU, width2);
        memcpy(v + i * stride / 2, planeV + i * strideV, width2);
    }

    for (; i < height; i++){
        memcpy(y + i * stride, planeY + i * stride0, width);
    }
    return 0;
}

IAgoraVideoSourceTransporter* createAgoraVideoSourceTransporter(AgoraVideoSource& videoSource)
{
    return new AgoraVideoSourceTransporter(videoSource);
}
