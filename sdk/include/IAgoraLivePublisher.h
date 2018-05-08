//
//  Agora Rtc Engine SDK
//
//  Created by Sting Feng in 2015-02.
//  Copyright (c) 2015 Agora IO. All rights reserved.
//

#ifndef AGORA_RTC_LIVE_PUBLISHER_H
#define AGORA_RTC_LIVE_PUBLISHER_H

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
        class ILiveEngine;
        enum MEDIA_TYPE;
        /**
        * the event call back interface
        */
        class IPublisherEventHandler
        {
        public:
            virtual ~IPublisherEventHandler() {}

            /**
            * When new publish url added, the function will be called.
            * @param [in] url
            *        new added url
            */
            virtual void onUrlAdded(const char *url) {
                (void)url;
            }

            /**
            * When publish url removed, the function will be called
            * @param [in] url
            *        the removed url
            */
            virtual void onUrlRemoved(const char *url) {
                (void)url;
            }

            /**
            * When publish success, the function will be called
            */
            virtual void onPublished() {
            }

			/*
			* When unpublish, the function will be called.
			*/
            virtual void onUnpublished() {
            }

            /**
            * When transcoding update, the function will be called.
            */
            virtual void onTranscodingUpdated() {
            }

			/*
			* When inject stream requested, the funtion will be called.
			*/
            virtual void onStreamInjectedStatus(const char* url, uid_t uid, int status) {
                (void)url;
                (void)uid;
                (void)status;
            }
        };

        class IPublisherEngine
        {
        public:
            /**
            * release the engine resource
            */
            virtual void release() = 0;

            /**
            * initialize the engine
            * @param [in] engine
            *        the ILiveEngine instance
            * @return return 0 if success or an error code
            */
            virtual int initialize(ILiveEngine *engine) = 0;

			/*
			* set event handler for publisher Engine.
			* @param [in] eventHandler
			*		 registered event handler.
			*/
            virtual int setEventHandler(IPublisherEventHandler *eventHandler) = 0;

			/*
			* Publish stream.
			*/
            virtual int publish() = 0;

			/*
			* unpublish stream
			*/
            virtual int unpublish() = 0;

			/*
			* Add publish stream url.
			* @param [in] url
			*		 added publish stream url
			* @param [in] transcodingEnabled
			*		 Whether the transcoding is enabled.
			*/
            virtual int addStreamUrl(const char *url, bool transcodingEnabled) = 0;

			/*
			* Remove publish stream url
			* @param [in] url
					 removed publish stream url.
			*/
            virtual int removeStreamUrl(const char *url) = 0;

			/*
			* Set publish media type
			* @param [in] type
			*		 The media type going to set.
			*/
            virtual int setMediaType(MEDIA_TYPE type) = 0;

			/*
			* Set live transcoding
			* @param [in] transcoding
			*		 the transcoding going to set.
			*/
            virtual int setLiveTranscoding(const LiveTranscoding &transcoding) = 0;

			/*
			* Add inject stream url
			* @param [in] url
			*		 The added injected stream url
			* @param [in] config
			*		 The inject stream configuration
			*/
            virtual int addInjectStreamUrl(const char* url, const InjectStreamConfig& config) = 0;

			/*
			* Remove injected stream url
			* @param [in] url
			*		 the injected stream url that to be removed.
			*/
            virtual int removeInjectStreamUrl(const char* url) = 0;

			/*
			* set video profile
			* @param [in] profile
			*		 The video profile going to set.
			*/
            virtual int setVideoProfile(VIDEO_PROFILE_TYPE profile) = 0;
        };
    }
}

/**
* create the RTC live publisher engine object and return the pointer
* @return returns the pointer of the RTC engine object
*/
AGORA_API agora::rtc::IPublisherEngine* AGORA_CALL createAgoraLivePublisherEngine();
#endif
