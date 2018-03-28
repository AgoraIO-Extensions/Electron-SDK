/*
* Copyright (c) 2018 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2018
*/

#ifndef AGORA_VIDEO_SOURCE_TRANSPORTER_H
#define AGORA_VIDEO_SOURCE_TRANSPORTER_H
#include "IAgoraMediaEngine.h"
#include <string>

using agora::media::IVideoFrame;

/**
 * IAgoraVideoSourceTransporter provide video data convey service.
 */
class IAgoraVideoSourceTransporter
{
public:
    IAgoraVideoSourceTransporter() {}
    virtual ~IAgoraVideoSourceTransporter(){}

    virtual bool initialize() = 0;
    virtual void release() = 0;

    virtual int deliverFrame(const IVideoFrame& videoFrame, int rotation, bool mirrored) = 0;
};

struct image_frame_info {
    int stride;
    int stride0;
    int width;
    int height;
    int strideU;
    int strideV;
};

struct image_header_type {
    unsigned char format;
    unsigned char mirrored;
    unsigned short width;
    unsigned short height;
    unsigned short left;
    unsigned short top;
    unsigned short right;
    unsigned short bottom;
    unsigned short rotation;
    unsigned int timestamp;
};

class AgoraVideoSource;
IAgoraVideoSourceTransporter* createAgoraVideoSourceTransporter(AgoraVideoSource& videoSource);

#endif
