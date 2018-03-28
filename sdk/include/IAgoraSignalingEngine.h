//
//  Agora Signaling Engine SDK
//
//  Created by Sting Feng in 2017-11.
//  Copyright (c) 2017 Agora IO. All rights reserved.
//

#ifndef AGORA_SIGNALING_ENGINE_H
#define AGORA_SIGNALING_ENGINE_H
#include "AgoraBase.h"

namespace agora {
namespace signaling {

/**
* the event call back interface
*/
class ISignalingEngineEventHandler
{
public:
    virtual ~ISignalingEngineEventHandler() {}

    virtual void onApiCallExecuted(int err, const char* api, const char* result) {
        (void)err;
        (void)api;
        (void)result;
    }
    virtual void onChannelUserListUpdated(const char** userAccounts, size_t count) {
        (void)userAccounts;
        (void)count;
    }
    virtual void onChannelAttributesUpdated(const char** userAccounts, size_t count) {
        (void)userAccounts;
        (void)count;
    }
    virtual void onUserJoinChannel(const char* userAccount) {
        (void)userAccount;
    }
    virtual void onUserLeaveChannel(const char* userAccount) {
        (void)userAccount;
    }
#if 0
    virtual void onLogin(int err) {
        (void)err;
    }
    virtual void onLogout(int err) {
        (void)err;
    }
    /**
    * when join channel success, the function will be called
    * @param [in] channel
    *        the channel name you have joined
    */
    virtual void onJoinChannel(int err) {
        (void)err;
    }

    virtual void onLeaveChannel(int err) {
        (void)err;
    }

    virtual void onIsChannelUserOnline(int err, const char* userAccount, bool online) {
        (void)err;
        (void)userAccount;
        (void)online;
    }
    virtual void onGetChannelUserCount(int err, int userCount) {
        (void)err;
        (void)userCount;
    }
    virtual void onSetChannelAttribute(int err, const char* attributeName, const char* attributeValue) {
        (void)err;
        (void)attributeName;
        (void)attributeValue;
    }
    virtual void onDeleteChannelAttribute(int err, const char* attributeName) {
        (void)err;
        (void)attributeName;
    }
    virtual void onClearAllChannelAttributes(int err) {
        (void)err;
    }
    virtual void onGetUserAttribute(int err, const char* userAccount, const char* attributeName, const char* attributeValue) {
        (void)err;
        (void)userAccount;
        (void)attributeName;
        (void)attributeValue;
    }
    virtual void onGetUserAllAttributes(int err, const char* userAccount, const char* attributeValues) {
        (void)err;
        (void)userAccount;
        (void)attributeValues;
    }
#endif
    /**
    * when warning message coming, the function will be called
    * @param [in] warn
    *        warning code
    * @param [in] msg
    *        the warning message
    */
    virtual void onWarning(int warn, const char* msg) {
        (void)warn;
        (void)msg;
    }

    /**
    * when error message come, the function will be called
    * @param [in] err
    *        error code
    * @param [in] msg
    *        the error message
    */
    virtual void onError(int err, const char* msg) {
        (void)err;
        (void)msg;
    }

    /**
    * when the network can not worked well, the function will be called
    */
    virtual void onConnectionLost() {}

    /**
    * when local user disconnected by accident, the function will be called(then SDK will try to reconnect itself)
    */
    virtual void onConnectionInterrupted() {}
    virtual void onConnectionRestored() {}
};

struct SignalingEngineContext
{
    ISignalingEngineEventHandler* eventHandler;
    const char* appId;
    SignalingEngineContext()
    :eventHandler(NULL)
    ,appId(NULL)
    {}
};


class ISignalingEngine
{
public:
    /**
    * release the engine resource
    * @param [in] sync
    *        true: release the engine resources and return after all resources have been destroyed.
    *              APP should try not to call release(true) in the engine's callbacks, call it this way in a separate thread instead.
    *        false: notify engine to release its resources and returns without waiting for resources are really destroyed
    */
    virtual void release(bool sync=false) = 0;
	
	/**
    * initialize the engine
    * @param [in] context
    *        the RTC engine context
    * @return return 0 if success or an error code
    */
    virtual int initialize(const SignalingEngineContext& context) = 0;

    /**
    * onApiCallExecuted(err, "sig.api.login")
    */
    virtual int login(const char* uesrAccount, const char* token) = 0;
    /**
    * onApiCallExecuted(err, "sig.api.logout")
    */
    virtual int logout() = 0;
    /**
    * local: onApiCallExecuted(err, "sig.api.sendMessageToUser")
    * peer: onReceiveUserMessage
    */
    virtual int sendMessageToUser(const char* userAccount, const char* message, int messageId) = 0;
    virtual int setUserAttribute(const char* attributeName, const char* attributeValue) = 0;
    /**
    * onApiCallExecuted(err, "sig.api.getUserAttribute")
    */
    virtual int getUserAttribute(const char* uesrAccount, const char* attributeName) = 0;
    /**
    * onApiCallExecuted(err, "sig.api.getAllUserAttribytes")
    */
    virtual int getAllUserAttribytes(const char* uesrAccount) = 0;
    virtual int isOnline(bool& online) = 0;
    /**
    * onApiCallExecuted(err, "sig.api.joinChannel")
    */
    virtual int joinChannel(const char* channelId) = 0;
    /**
    * onApiCallExecuted(err, "sig.api.leaveChannel")
    */
    virtual int leaveChannel() = 0;
    /**
    * onApiCallExecuted(err, "sig.api.getChannelUserCount")
    */
    virtual int getChannelUserCount() = 0;
    /**
    * onApiCallExecuted(err, "sig.api.isChannelUserOnline")
    */
    virtual int isChannelUserOnline(const char* userAccount) = 0;
    /**
    * onApiCallExecuted(err, "sig.api.setChannelAttribute")
    */
    virtual int setChannelAttribute(const char* attributeName, const char* attributeValue) = 0;
    /**
    * onApiCallExecuted(err, "sig.api.deleteChannelAttribute")
    */
    virtual int deleteChannelAttribute(const char* attributeName) = 0;
    /**
    * onApiCallExecuted(err, "sig.api.clearAllChannelAttributes")
    */
    virtual int clearAllChannelAttributes() = 0;
    /**
    * local: onApiCallExecuted(err, "sig.api.broadcastChannelMessage")
    * peer: onReceiveChannelMessage
    */
    virtual int broadcastChannelMessage(const char* message, int messageId) = 0;
};

}}
/**
* create a signaling engine object and return the pointer
* @return returns pointer of the created signaling engine object
*/
AGORA_API agora::signaling::ISignalingEngine* AGORA_CALL createAgoraSignalingEngine();

#endif
