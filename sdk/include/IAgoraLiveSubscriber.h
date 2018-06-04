//
//  Agora Rtc Engine SDK
//
//  Created by Sting Feng in 2015-02.
//  Copyright (c) 2015 Agora IO. All rights reserved.
//

#ifndef AGORA_RTC_LIVE_SUBSCRIBER_H
#define AGORA_RTC_LIVE_SUBSCRIBER_H

#include <stddef.h>
#include <stdio.h>
#include <stdarg.h>

#if defined(_WIN32)
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#define AGORA_CALL __cdecl
#if defined(AGORARTC_EXPORT)
#define AGORA_API extern "C" __declspec(dllexport)
#else
#define AGORA_API extern "C" __declspec(dllimport)
#endif
#elif defined(__APPLE__)
#define AGORA_API __attribute__((visibility("default"))) extern "C"
#define AGORA_CALL
#elif defined(__ANDROID__) || defined(__linux__)
#define AGORA_API extern "C" __attribute__((visibility("default")))
#define AGORA_CALL
#else
#define AGORA_API extern "C"
#define AGORA_CALL
#endif
#include "IAgoraRtcEngine.h"
namespace agora {
    namespace rtc {
        /**
        * the event call back interface
        */
        class ISubscriberEventHandler
        {
        public:
            virtual ~ISubscriberEventHandler() {}

            /**
            * when the first remote video frame decoded, the function will be called
            * @param [in] uid
            *        the UID of the remote user
            * @param [in] width
            *        the width of the video frame
            * @param [in] height
            *        the height of the video frame
            * @param [in] elapsed
            *        the time elapsed from channel joined in ms
            */
            virtual void onFirstRemoteVideoDecoded(uid_t uid, int width, int height, int elapsed) {
                (void)uid;
                (void)width;
                (void)height;
                (void)elapsed;
            }

            /**
             * when video size changed or rotation changed, the function will be called
             * @param [in] uid
             *        the UID of the remote user or local user (0)
             * @param [in] width
             *        the new width of the video
             * @param [in] height
             *        the new height of the video
             * @param [in] rotation
             *        the rotation of the video
             */
            virtual void onVideoSizeChanged(uid_t uid, int width, int height, int rotation) {
                (void)uid;
                (void)width;
                (void)height;
                (void)rotation;
            }

			/*
			* when remote user published, the function will be called.
			* @param [in] uid
			*		 the UID of the remote user
			* @param [type]
			*		 the media type of publish
			*/
            virtual void onUserPublished(uid_t uid, MEDIA_TYPE type) {
                (void)uid;
                (void)type;
            }

			/*
			* when remote user unpublished ,the function will be called.
			* @param [in] uid
			*		 the UID of the remote user.
			*/
            virtual void onUserUnpublished(uid_t uid) {
                (void)uid;
            }

			/*
			* when remote user publish stream type changed, the function will be called.
			* @param [in] uid
			*		 the UID of the remote user.
			* @param [in] newType
			*		 the new media type
			*/
            virtual void onStreamTypeChanged(uid_t uid, MEDIA_TYPE newType) {
                (void)uid;
                (void)newType;
            }
        };

        class ILiveEngine;
        enum MEDIA_TYPE;

        class ISubscriberEngine
        {
        public:
            /**
            * release the subscriber engine resource
            * @param [in] sync
            *        true: release the engine resources and return after all resources have been destroyed.
            *              APP should try not to call release(true) in the engine's callbacks, call it this way in a separate thread instead.
            *        false: notify engine to release its resources and returns without waiting for resources are really destroyed
            */
            virtual void release(bool sync = false) = 0;

            /**
            * initialize the engine
            * @param [in] context
            *        the RTC engine context
            * @return return 0 if success or an error code
            */
            virtual int initialize(ILiveEngine *engine) = 0;

			/*
			* Set event handler of subscriber engine.
			* @param [in] eventHandler
			*		 the event handler
			*/
            virtual int setEventHandler(ISubscriberEventHandler *eventHandler) = 0;

			/*
			* to subscribe remote user
			* @param [in] uid
			*		 the UID of remote user
			* @param [in] type
			*		 the media type
			* @param [in] view
			*		 reserved view
			* @param [in] mode
			*		 render mode
			* @param [in] streamType
			*		 remote user stream type
			*/
            virtual int subscribe(uid_t uid, MEDIA_TYPE type, view_t view, RENDER_MODE_TYPE mode, REMOTE_VIDEO_STREAM_TYPE streamType) = 0;

			/*
			* unsubscribe user
			* @param [in] uid
			*		 the UID of remote user.
			*/
            virtual int unsubscribe(uid_t uid) = 0;

        };
    }
}

/**
* create the RTC live subscriber engine object and return the pointer
* @return returns the pointer of the RTC engine object
*/
AGORA_API agora::rtc::ISubscriberEngine* AGORA_CALL createAgoraLiveSubscriberEngine();

#endif
