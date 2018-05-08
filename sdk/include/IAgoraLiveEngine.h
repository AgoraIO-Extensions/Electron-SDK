//
//  Agora Rtc Engine SDK
//
//  Created by Sting Feng in 2015-02.
//  Copyright (c) 2015 Agora IO. All rights reserved.
//

#ifndef AGORA_RTC_LIVE_ENGINE_H
#define AGORA_RTC_LIVE_ENGINE_H

#include <stddef.h>
#include <stdio.h>
#include <stdarg.h>

#include "IAgoraRtcEngine.h"
#include "IAgoraLivePublisher.h"
#include "IAgoraLiveSubscriber.h"
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
namespace agora {

namespace rtc {

/*
* meida type of stream 
*/
enum MEDIA_TYPE
{
	/*
	* No audio and video
	*/
    MEDIA_TYPE_NONE = 0,
	/*
	* Audio only
	*/
    MEDIA_TYPE_AUDIO_ONLY = 1,
	/*
	* Video only
	*/
    MEDIA_TYPE_VIDEO_ONLY = 2,
	/*
	* Audio and Video
	*/
    MEDIA_TYPE_AUDIO_AND_VIDEO = 3
};

/*
* Channel configuration
*/
struct LiveChannelConfig {
    bool videoEnabled;
};

/*
* stream statitics
*/
typedef RtcStats LiveStats;

/**
* the event call back interface
*/
class ILiveEngineEventHandler
{
public:
    virtual ~ILiveEngineEventHandler() {}

    /**
     * when warning message coming, the function will be called
     * @param [in] warn
     *        warning code
     * @param [in] msg
     *        the warning message
     */
    virtual void onWarning(int warn) {
        (void)warn;
    }

    /**
     * when error message come, the function will be called
     * @param [in] err
     *        error code
     * @param [in] msg
     *        the error message
     */
    virtual void onError(int err) {
        (void)err;
    }

    /**
    * when join channel success, the function will be called
    * @param [in] channel
    *        the channel name you have joined
    * @param [in] uid
    *        the UID of you in this channel
    * @param [in] elapsed
    *        the time elapsed in ms from the joinChannel been called to joining completed
    */
    virtual void onJoinChannelSuccess(const char* channel, uid_t uid, int elapsed) {
        (void)channel;
        (void)uid;
        (void)elapsed;
    }

    /**
    * when re-join channel success, the function will be called
    * @param [in] channel
    *        the channel name you have joined
    * @param [in] uid
    *        the UID of you in this channel
    * @param [in] elapsed
    *        the time elapsed in ms elapsed
    */
    virtual void onRejoinChannelSuccess(const char* channel, uid_t uid, int elapsed) {
        (void)channel;
        (void)uid;
        (void)elapsed;
    }

	/*
	* When leave channel success, the function will be called.
	*/
    virtual void onLeaveChannel() {
    }

    /**
    * when the information of the RTC engine stats come, the function will be called
    * @param [in] stats
    *        the RTC engine stats
    */
    virtual void onLiveStats(const LiveStats& stats) {
        (void)stats;
    }

    /**
    * report the network quality
	* @param [in] uid
	*        the UID of the remote user
	* @param [in] txQuality
    *        the score of the send network quality 0~5 the higher the better
	* @param [in] rxQuality
	*        the score of the recv network quality 0~5 the higher the better
	*/
    virtual void onNetworkQuality(uid_t uid, int txQuality, int rxQuality) {
		(void)uid;
		(void)txQuality;
		(void)rxQuality;
    }

    /**
    * when the network can not worked well, the function will be called
    */
    virtual void onConnectionLost() {}

    /**
    * when local user disconnected by accident, the function will be called(then SDK will try to reconnect itself)
    */
    virtual void onConnectionInterrupted() {}
    
    /**
    * when token is enabled, and specified token is invalid or expired, this function will be called.
    * APP should request a new token and call renewToken() to refresh the token.
    * NOTE: to be compatible with previous version, ERR_TOKEN_EXPIRED and ERR_INVALID_TOKEN are also reported via onError() callback.
    * You should move renew of token logic into this callback.
    */
    virtual void onRequestToken() {
    }

};

class ILiveEngine
{
public:

    /**
     * initialize the engine
     * @param [in] context
     *        the RTC engine context
     * @return return 0 if success or an error code
     */
    virtual int initialize(const char *appId) = 0;

    /**
     * get the version information of the SDK
     * @param [in, out] build
     *        the build number
     * @return return the version number string in char format
     */
    virtual const char* getVersion(int* build) = 0;

	/*
	* Get IRtcEngine interface
	*/
    virtual IRtcEngine* getRtcEngine() = 0;


    /**
    * release the engine resource
    * @param [in] sync
    *        true: release the engine resources and return after all resources have been destroyed.
    *              APP should try not to call release(true) in the engine's callbacks, call it this way in a separate thread instead.
    *        false: notify engine to release its resources and returns without waiting for resources are really destroyed
    */
    virtual void release(bool sync=false) = 0;

	/*
	* Set event handler for ILiveEngine
	*/
    virtual int setEventHandler(ILiveEngineEventHandler* eventHandler) = 0;

    /**
    * join the channel, if the channel have not been created, it will been created automatically
  * @param [in] token
    *        the token, if you have initialized the engine with an available APP ID, it can be null here. If you enable token on the dashboard, specify token here
    * @param [in] channelId
    *        the channel Id
  * @param [in] info
    *        the additional information, it can be null here
    * @param [in] uid
    *        the uid of you, if 0 the system will automatically allocate one for you
    * @return return 0 if success or an error code
    */
    virtual int joinChannel(const char* token, const char* channelId, struct LiveChannelConfig *config, uid_t uid) = 0;

    /**
    * leave the current channel
    * @return return 0 if success or an error code
    */
    virtual int leaveChannel() = 0;

    /**
    * renew the token for the current channel
    * @param [in] token the renewed token, if old token expired.
    * @return return 0 if success or an error code
    */
    virtual int renewToken(const char* token) = 0;

    /**
    * start the local video previewing
    * @return return 0 if success or an error code
    */
    virtual int startPreview(view_t view, RENDER_MODE_TYPE type) = 0;

    /**
    * stop the local video previewing
    * @return return 0 if success or an error code
    */
    virtual int stopPreview() = 0;
};


} //namespace rtc
} // namespace agora

/**
* create the RTC live engine object and return the pointer
* @return returns the pointer of the RTC engine object
*/
AGORA_API agora::rtc::ILiveEngine* AGORA_CALL createAgoraLiveEngine();

#endif
