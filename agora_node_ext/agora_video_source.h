/*
* Copyright (c) 2018 Agora.io
* All rights reserved.
* Proprietary and Confidential -- Agora.io
*/

/*
*  Created by Wang Yongli, 2018
*/

#ifndef AGORA_VIDEO_SOURCE_SINK_H
#define AGORA_VIDEO_SOURCE_SINK_H

#include "IAgoraRtcEngine.h"
#include "node_error.h"
#include <string>

namespace agora{
    namespace rtc{

#if defined(__APPLE__)
		typedef unsigned int WindowIDType;
#elif defined(_WIN32)
		typedef HWND WindowIDType;
#endif
        /**
         * Video source need join the same channel, this class used to monitor video source's event.
         * More event maybe needed in future.
         */
        class IAgoraVideoSourceEventHandler
        {
        public:
            virtual ~IAgoraVideoSourceEventHandler(){}
            /**
             * Video source joined channel success event.
             * @param uid : video source's uid.
             */
            virtual void onVideoSourceJoinedChannel(agora::rtc::uid_t uid) = 0;

            /**
             * Video source request new token event.
             */
            virtual void onVideoSourceRequestNewToken() = 0;

            /**
             * Video source leaved channel event.
             */
            virtual void onVideoSourceLeaveChannel() = 0;

            virtual void onVideoSourceExit() = 0;
        };

        /**
         * This is video source stub interface.
         */
        class AgoraVideoSource
        {
        public:
            virtual ~AgoraVideoSource(){}

            /**
             * To initialize Video source.
             * @param eventHandler : video source event handler.
             */
            virtual bool initialize(IAgoraVideoSourceEventHandler *eventHandler, const char* appid) = 0;

            /**
             * To ask video source to join channel with specified parameters.
             * @param token : token if it is enabled.
             * @param cname : channel name.
             * @param chan_info : channel information
             * @param uid : uid of video source.
             */
            virtual node_error join(const char* token, const char* cname, const char* chan_info, uid_t uid) = 0;

            /**
            * To ask video source to leave channel.
            */
            virtual node_error leave() = 0;

            /**
            * To start receive local video of video source.
            */
            virtual node_error startPreview() = 0;

            /**
            * To stop receive local video of video source.
            */
            virtual node_error stopPreview() = 0;

            /**
             * Release video source.
             */
            virtual node_error release() = 0;

            /**
             * To ask video source begin to share screen.
             * @param id : window id whose window will be shared. if the value is 0, then desktop is shared.
             * @param captureFreq : video frequency, 0-15.
             * @param rect : the shared area
             * @param bitrate : bitrate of video
             */
            virtual node_error captureScreen(agora::rtc::WindowIDType id, int captureFreq, agora::rtc::Rect* rect, int bitrate) = 0;

            /**
             * To update shared window area
             * @param rect : updated area
             */
            virtual node_error updateScreenCapture(agora::rtc::Rect* rect) = 0;

            /**
             * To stop screen share
             */
            virtual node_error stopCaptureScreen() = 0;

            /**
             * To renew video source's token.
             * @param token : new token
             */
            virtual node_error renewVideoSourceToken(const char* token) = 0;

            /**
             * To set video source channel profile
             * @param profile : video source's channel profile
             */
            virtual node_error setVideoSourceChannelProfile(agora::rtc::CHANNEL_PROFILE_TYPE profile, const char* permissionKey) = 0;

            /**
             * To set video source's video profile
             * @param profile : the video source's video profile
             * @param swapWidthAndHeight : whether adjust width and height
             */
            virtual node_error setVideoSourceVideoProfile(agora::rtc::VIDEO_PROFILE_TYPE profile, bool swapWidthAndHeight) = 0;
            
            /**
             * Enable interoperability with the Agora Web SDK.
             * @param enabled : whether interoperability with the Agora Web SDK is enabled
             */
            virtual node_error enableWebSdkInteroperability(bool enabled) = 0;

            
            /**
             * Enable dual stream mode with the Agora Web SDK.
             * @param enabled : whether dual stream with the Agora Web SDK is enabled
             */
            virtual node_error enableDualStreamMode(bool enabled) = 0;

            /**
             * set log file path of videosource
             * @param file : filepath of log
             */
            virtual node_error setLogFile(const char* file) = 0;

            /**
            * To set parameters for video source.
            */
            virtual void setParameters(const char* parameters) = 0;

            /**
             * Enable loopbackRecording
             * @param enabled : whether enable loopbackRecording
             */
            virtual node_error enableLoopbackRecording(bool enabled, const char* deviceName) = 0;
        };

        /**
         * Video source may be has different implementation on different platforms. The API is used to generate video source.
         */
        AgoraVideoSource* createVideoSource();
    }
}

#endif
