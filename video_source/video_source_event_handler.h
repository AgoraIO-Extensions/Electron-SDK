/*
* Copyright (c) 2018 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2018
*/

#ifndef AGORA_VIDEO_SOURCE_EVNET_HANDLER_H
#define AGORA_VIDEO_SOURCE_EVNET_HANDLER_H

#include "IAgoraRtcEngine.h"
#include "video_source.h"
using agora::rtc::IRtcEngineEventHandler;
using agora::rtc::uid_t;
using agora::rtc::RtcStats;
using agora::rtc::LocalVideoStats;

/**
 * AgoraVideoSourceEventHandler provide implementation of IRtcEngienEventHandler.
 * AgoraVideoSourceEventHandler rely on video source to transfer event to sink.
 */
class AgoraVideoSourceEventHandler : public IRtcEngineEventHandler
{
public:
    AgoraVideoSourceEventHandler(AgoraVideoSource& videoSource);
    ~AgoraVideoSourceEventHandler();

    virtual void onJoinChannelSuccess(const char* channel, uid_t uid, int elapsed) override;
    virtual void onRejoinChannelSuccess(const char* channel, uid_t uid, int elapsed) override;
    virtual void onWarning(int warn, const char* msg) override;
    virtual void onError(int err, const char* msg) override;
    virtual void onLeaveChannel(const RtcStats& stats) override;
    virtual void onRtcStats(const RtcStats& stats) override;
    virtual void onVideoDeviceStateChanged(const char* deviceId, int deviceType, int deviceState) override;
    virtual void onNetworkQuality(uid_t uid, int txQuality, int rxQuality) override;
    virtual void onLastmileQuality(int quality) override;
    virtual void onFirstLocalVideoFrame(int width, int height, int elapsed) override;
    virtual void onVideoSizeChanged(uid_t uid, int width, int height, int rotation) override;
#if defined(_WIN32)
    virtual void onApiCallExecuted(const char* api, int error) override;
#elif defined(__APPLE__)
    virtual void onApiCallExecuted(int err, const char* api, const char* result);
#endif
    virtual void onLocalVideoStats(const LocalVideoStats& stats) override;
    virtual void onCameraReady() override;
    virtual void onVideoStopped() override;
    virtual void onConnectionLost() override;
    virtual void onConnectionInterrupted() override;
    virtual void onConnectionBanned() override;
    virtual void onRefreshRecordingServiceStatus(int status) override;
#if defined(_WIN32)
    virtual void onRequestChannelKey() override;
#elif defined(__APPLE__)
    virtual void onRequestToken() override;
#endif
private:
    AgoraVideoSource& m_videoSource;
};

#endif