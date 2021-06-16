/*
* Copyright (c) 2018 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2018
*/

#include "video_source_event_handler.h"
#include "node_log.h"
#include "loguru.hpp"

AgoraVideoSourceEventHandler::AgoraVideoSourceEventHandler(AgoraVideoSource& videoSource)
    : m_videoSource(videoSource)
{
}

AgoraVideoSourceEventHandler::~AgoraVideoSourceEventHandler()
{}

void AgoraVideoSourceEventHandler::onJoinChannelSuccess(const char* channel, uid_t uid, int elapsed)
{
    LOG_F(INFO, "%s, channel :%s, uid : %d, elapsed :%d", __FUNCTION__, channel, uid, elapsed);
    m_videoSource.notifyJoinedChannel(uid);
}

void AgoraVideoSourceEventHandler::onRejoinChannelSuccess(const char* channel, uid_t uid, int elapsed)
{
    LOG_F(INFO, "%s, channel :%s, uid: %d, elapsed :%d", __FUNCTION__, channel, uid, elapsed);
    m_videoSource.notifyJoinedChannel(uid);
}

void AgoraVideoSourceEventHandler::onWarning(int warn, const char* msg)
{
    LOG_F(INFO, "%s, warn :%d, msg :%s", __FUNCTION__, warn, msg);
}

void AgoraVideoSourceEventHandler::onError(int err, const char* msg)
{
    LOG_F(INFO, "%s, err : %d, msg :%s", __FUNCTION__, err, msg);
}

void AgoraVideoSourceEventHandler::onLeaveChannel(const RtcStats& stats)
{
    LOG_F(INFO, "%s", __FUNCTION__);
    m_videoSource.notifyLeaveChannel();
}

void AgoraVideoSourceEventHandler::onRtcStats(const RtcStats& stats)
{
    LOG_F(INFO, "%s", __FUNCTION__);
}

void AgoraVideoSourceEventHandler::onVideoDeviceStateChanged(const char* deviceId, int deviceType, int deviceState)
{
    LOG_F(INFO, "%s, deviceId :%s, deviceType :%d, deviceStatus :%d", __FUNCTION__, deviceId, deviceType, deviceState);
}

void AgoraVideoSourceEventHandler::onNetworkQuality(uid_t uid, int txQuality, int rxQuality)
{
    //LOG_F(INFO, "%s, uid :%d, txQuality :%d, rxQuality:%d", __FUNCTION__, uid, txQuality, rxQuality);
}

void AgoraVideoSourceEventHandler::onLastmileQuality(int quality)
{
    LOG_F(INFO, "%s, quality :%d", __FUNCTION__, quality);
}

void AgoraVideoSourceEventHandler::onFirstLocalVideoFrame(int width, int height, int elapsed)
{
    LOG_F(INFO, "%s, width :%d, height :%d, elapsed: %d", __FUNCTION__, width, height, elapsed);
}

void AgoraVideoSourceEventHandler::onVideoSizeChanged(uid_t uid, int width, int height, int rotation)
{
    LOG_F(INFO,"%s, uid :%d, width :%d, height:%d, rotation :%d", __FUNCTION__, uid, width, height, rotation);
    m_videoSource.notifyVideoSizeChanged(uid, width, height, rotation);
}

void AgoraVideoSourceEventHandler::onApiCallExecuted(int err, const char* api, const char* result)
{
    LOG_F(INFO, "%s, err :%d, api :%s", __FUNCTION__, err, api);
}

void AgoraVideoSourceEventHandler::onLocalVideoStats(const LocalVideoStats& stats)
{
    m_videoSource.notifyLocalVideoStats(stats);
    LOG_F(INFO, "%s", __FUNCTION__);
}

void AgoraVideoSourceEventHandler::onCameraReady()
{
    LOG_F(INFO, "%s", __FUNCTION__);
}

void AgoraVideoSourceEventHandler::onCameraFocusAreaChanged(int x, int y, int width, int height)
{
    LOG_F(INFO, "%s, x :%d, y:%d, width:%d, heigh:%d", __FUNCTION__, x, y, width, height);
}

void AgoraVideoSourceEventHandler::onVideoStopped()
{
    LOG_F(INFO, "%s", __FUNCTION__);
}

void AgoraVideoSourceEventHandler::onConnectionLost()
{
    LOG_F(INFO, "%s", __FUNCTION__);
}

void AgoraVideoSourceEventHandler::onConnectionInterrupted()
{
    LOG_F(INFO, "%s", __FUNCTION__);
}

void AgoraVideoSourceEventHandler::onConnectionBanned()
{
    LOG_F(INFO, "%s", __FUNCTION__);
}

void AgoraVideoSourceEventHandler::onRequestToken()
{
    LOG_F(INFO, "%s", __FUNCTION__);
    m_videoSource.notifyRequestNewToken();
}

void AgoraVideoSourceEventHandler::onLocalAudioStats(const LocalAudioStats& stats)
{
    m_videoSource.notifyLocalAudioStats(stats);
}

void AgoraVideoSourceEventHandler::onLocalAudioStateChanged(LOCAL_AUDIO_STREAM_STATE state, LOCAL_AUDIO_STREAM_ERROR error)
{
    m_videoSource.notifyLocalAudioStateChanged(state, error);
}

void AgoraVideoSourceEventHandler::onLocalVideoStateChanged(LOCAL_VIDEO_STREAM_STATE localVideoState, LOCAL_VIDEO_STREAM_ERROR error)
{
    m_videoSource.notifyLocalVideoStateChanged(localVideoState, error);
}