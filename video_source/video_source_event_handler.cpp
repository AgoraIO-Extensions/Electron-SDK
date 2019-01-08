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

AgoraVideoSourceEventHandler::AgoraVideoSourceEventHandler(AgoraVideoSource& videoSource)
    : m_videoSource(videoSource)
{

}

AgoraVideoSourceEventHandler::~AgoraVideoSourceEventHandler()
{}

void AgoraVideoSourceEventHandler::onJoinChannelSuccess(const char* channel, uid_t uid, int elapsed)
{
    LOG_INFO("%s, channel :%s, uid : %d, elapsed :%d", __FUNCTION__, channel, uid, elapsed);
    m_videoSource.notifyJoinedChannel(uid);
}

void AgoraVideoSourceEventHandler::onRejoinChannelSuccess(const char* channel, uid_t uid, int elapsed)
{
    LOG_INFO("%s, channel :%s, uid: %d, elapsed :%d", __FUNCTION__, channel, uid, elapsed);
    m_videoSource.notifyJoinedChannel(uid);
}

void AgoraVideoSourceEventHandler::onWarning(int warn, const char* msg)
{
    LOG_INFO("%s, warn :%d, msg :%s", __FUNCTION__, warn, msg);
}

void AgoraVideoSourceEventHandler::onError(int err, const char* msg)
{
    LOG_INFO("%s, err : %d, msg :%s", __FUNCTION__, err, msg);
}

void AgoraVideoSourceEventHandler::onLeaveChannel(const RtcStats& stats)
{
    LOG_INFO("%s", __FUNCTION__);
    m_videoSource.notifyLeaveChannel();
}

void AgoraVideoSourceEventHandler::onRtcStats(const RtcStats& stats)
{
    LOG_INFO("%s", __FUNCTION__);
}

void AgoraVideoSourceEventHandler::onVideoDeviceStateChanged(const char* deviceId, int deviceType, int deviceState)
{
    LOG_INFO("%s, deviceId :%s, deviceType :%d, deviceStatus :%d", __FUNCTION__, deviceId, deviceType, deviceState);
}

void AgoraVideoSourceEventHandler::onNetworkQuality(uid_t uid, int txQuality, int rxQuality)
{
    //LOG_INFO("%s, uid :%d, txQuality :%d, rxQuality:%d", __FUNCTION__, uid, txQuality, rxQuality);
}

void AgoraVideoSourceEventHandler::onLastmileQuality(int quality)
{
    LOG_INFO("%s, quality :%d", __FUNCTION__, quality);
}

void AgoraVideoSourceEventHandler::onFirstLocalVideoFrame(int width, int height, int elapsed)
{
    LOG_INFO("%s, width :%d, height :%d, elapsed: %d", __FUNCTION__, width, height, elapsed);
}

void AgoraVideoSourceEventHandler::onVideoSizeChanged(uid_t uid, int width, int height, int rotation)
{
    LOG_INFO("%s, uid :%d, width :%d, height:%d, rotation :%d", __FUNCTION__, uid, width, height, rotation);
}

void AgoraVideoSourceEventHandler::onApiCallExecuted(int err, const char* api, const char* result)
{
    LOG_INFO("%s, err :%d, api :%s", __FUNCTION__, err, api);
}

void AgoraVideoSourceEventHandler::onLocalVideoStats(const LocalVideoStats& stats)
{
    LOG_INFO("%s", __FUNCTION__);
}

void AgoraVideoSourceEventHandler::onCameraReady()
{
    LOG_INFO("%s", __FUNCTION__);
}

void AgoraVideoSourceEventHandler::onCameraFocusAreaChanged(int x, int y, int width, int height)
{
    LOG_INFO("%s, x :%d, y:%d, width:%d, heigh:%d", __FUNCTION__, x, y, width, height);
}

void AgoraVideoSourceEventHandler::onVideoStopped()
{
    LOG_INFO("%s", __FUNCTION__);
}

void AgoraVideoSourceEventHandler::onConnectionLost()
{
    LOG_INFO("%s", __FUNCTION__);
}

void AgoraVideoSourceEventHandler::onConnectionInterrupted()
{
    LOG_INFO("%s", __FUNCTION__);
}

void AgoraVideoSourceEventHandler::onConnectionBanned()
{
    LOG_INFO("%s", __FUNCTION__);
}

void AgoraVideoSourceEventHandler::onRequestToken()
{
    LOG_INFO("%s", __FUNCTION__);
    m_videoSource.notifyRequestNewToken();
}
