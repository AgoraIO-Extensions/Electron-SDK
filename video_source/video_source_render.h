/*
* Copyright (c) 2018 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2018
*/

#ifndef AGORA_VIDEO_SOURCE_RENDER_H
#define AGORA_VIDEO_SOURCE_RENDER_H

#include "IAgoraRtcEngine.h"
#include "IAgoraMediaEngine.h"
#include "video_source_transporter.h"
#include <memory>

class AgoraVideoSource;

using agora::media::IExternalVideoRenderFactory;
using agora::media::IExternalVideoRender;
using agora::media::ExternalVideoRenerContext;
using agora::media::IVideoFrame;

/**
 * IExternalVideoRenderFactory implementation.
 */
class AgoraVideoSourceRenderFactory : public IExternalVideoRenderFactory
{
public:
    AgoraVideoSourceRenderFactory(AgoraVideoSource& videoSource);
    ~AgoraVideoSourceRenderFactory();

    virtual IExternalVideoRender* createRenderInstance(const ExternalVideoRenerContext& context) override;
private:
    AgoraVideoSource& m_videoSource;
};

/**
 * IExternalVideoRender implementation.
 */
class AgoraVideoSourceRender : public IExternalVideoRender
{
public:
    AgoraVideoSourceRender(AgoraVideoSource& videoSource);
    ~AgoraVideoSourceRender();

    virtual void release() override;
    virtual int initialize() override;
    virtual int deliverFrame(const IVideoFrame& videoFrame, int rotation, bool mirrored) override;
private:
    AgoraVideoSource& m_videoSource;
    /**
     * AgoraVideoSourceRender rely on IAgoraVideoSourceTransporter to convey video data to sink.
     */
    std::unique_ptr<IAgoraVideoSourceTransporter> m_transporter;
};

#endif