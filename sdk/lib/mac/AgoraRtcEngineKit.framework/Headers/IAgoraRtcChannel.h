//
//  AgoraRtcEngine SDK
//
//  Copyright (c) 2019 Agora.io. All rights reserved.
//

#ifndef IAgoraRtcChannel_h
#define IAgoraRtcChannel_h
#include "IAgoraRtcEngine.h"

namespace agora {
namespace rtc {

struct ChannelMediaOptions {
    bool autoSubscribeAudio;
    bool autoSubscribeVideo;
    ChannelMediaOptions()
    : autoSubscribeAudio(true)
    , autoSubscribeVideo(true)
    {}
};

class IChannel;
class IChannelEventHandler
{
public:
    virtual ~IChannelEventHandler() {}
    
    virtual void onChannelWarning(IChannel *rtcChannel, int warn, const char* msg) {
        (void)rtcChannel;
        (void)warn;
        (void)msg;
    }
    
    virtual void onChannelError(IChannel *rtcChannel, int err, const char* msg) {
        (void)rtcChannel;
        (void)err;
        (void)msg;
    }
    
    virtual void onJoinChannelSuccess(IChannel *rtcChannel, uid_t uid, int elapsed) {
        (void)rtcChannel;
        (void)uid;
        (void)elapsed;
    }
    
    virtual void onRejoinChannelSuccess(IChannel *rtcChannel, uid_t uid, int elapsed) {
        (void)rtcChannel;
        (void)uid;
        (void)elapsed;
    }
    
    virtual void onLeaveChannel(IChannel *rtcChannel, const RtcStats& stats) {
        (void)rtcChannel;
        (void)stats;
    }
    
    virtual void onClientRoleChanged(IChannel *rtcChannel, CLIENT_ROLE_TYPE oldRole, CLIENT_ROLE_TYPE newRole) {
        (void)rtcChannel;
        (void)oldRole;
        (void)newRole;
    }
    
    virtual void onUserJoined(IChannel *rtcChannel, uid_t uid, int elapsed) {
        (void)rtcChannel;
        (void)uid;
        (void)elapsed;
    }
    
    virtual void onUserOffline(IChannel *rtcChannel, uid_t uid, USER_OFFLINE_REASON_TYPE reason) {
        (void)rtcChannel;
        (void)uid;
        (void)reason;
    }
    
    virtual void onConnectionLost(IChannel *rtcChannel) {
        (void)rtcChannel;
    }
    
    virtual void onRequestToken(IChannel *rtcChannel) {
        (void)rtcChannel;
    }
    
    virtual void onTokenPrivilegeWillExpire(IChannel *rtcChannel, const char* token) {
        (void)rtcChannel;
        (void)token;
    }
    
    virtual void onRtcStats(IChannel *rtcChannel, const RtcStats& stats) {
        (void)rtcChannel;
        (void)stats;
    }
    
    virtual void onNetworkQuality(IChannel *rtcChannel, uid_t uid, int txQuality, int rxQuality) {
        (void)rtcChannel;
        (void)uid;
        (void)txQuality;
        (void)rxQuality;
    }
    
    virtual void onRemoteVideoStats(IChannel *rtcChannel, const RemoteVideoStats& stats) {
        (void)rtcChannel;
        (void)stats;
    }
    
    virtual void onRemoteAudioStats(IChannel *rtcChannel, const RemoteAudioStats& stats) {
        (void)rtcChannel;
        (void)stats;
    }
    
    virtual void onRemoteAudioStateChanged(IChannel *rtcChannel, uid_t uid, REMOTE_AUDIO_STATE state, REMOTE_AUDIO_STATE_REASON reason, int elapsed) {
        (void)rtcChannel;
        (void)uid;
        (void)state;
        (void)reason;
        (void)elapsed;
    }
    
    virtual void onActiveSpeaker(IChannel *rtcChannel, uid_t uid) {
        (void)rtcChannel;
        (void)uid;
    }
    
    virtual void onFirstRemoteVideoFrame(IChannel *rtcChannel, uid_t uid, int width, int height, int elapsed) {
        (void)rtcChannel;
        (void)uid;
        (void)width;
        (void)height;
        (void)elapsed;
    }
    
    virtual void onUserMuteAudio(IChannel *rtcChannel, uid_t uid, bool muted) {
        (void)rtcChannel;
        (void)uid;
        (void)muted;
    }
    
    virtual void onFirstRemoteAudioDecoded(IChannel *rtcChannel, uid_t uid, int elapsed) {
        (void)rtcChannel;
        (void)uid;
        (void)elapsed;
    }
    
    virtual void onVideoSizeChanged(IChannel *rtcChannel, uid_t uid, int width, int height, int rotation) {
        (void)rtcChannel;
        (void)uid;
        (void)width;
        (void)height;
        (void)rotation;
    }
    
    virtual void onRemoteVideoStateChanged(IChannel *rtcChannel, uid_t uid, REMOTE_VIDEO_STATE state, REMOTE_VIDEO_STATE_REASON reason, int elapsed) {
        (void)rtcChannel;
        (void)uid;
        (void)state;
        (void)reason;
        (void)elapsed;
    }
    
    virtual void onStreamMessage(IChannel *rtcChannel, uid_t uid, int streamId, const char* data, size_t length) {
        (void)rtcChannel;
        (void)uid;
        (void)streamId;
        (void)data;
        (void)length;
    }
    
    virtual void onStreamMessageError(IChannel *rtcChannel, uid_t uid, int streamId, int code, int missed, int cached) {
        (void)rtcChannel;
        (void)uid;
        (void)streamId;
        (void)code;
        (void)missed;
        (void)cached;
    }
    
    virtual void onChannelMediaRelayStateChanged(IChannel *rtcChannel, CHANNEL_MEDIA_RELAY_STATE state,CHANNEL_MEDIA_RELAY_ERROR code) {
        (void)rtcChannel;
        (void)state;
        (void)code;
    }
    
    virtual void onChannelMediaRelayEvent(IChannel *rtcChannel, CHANNEL_MEDIA_RELAY_EVENT code) {
        (void)rtcChannel;
        (void)code;
    }
    
    virtual void onFirstRemoteAudioFrame(IChannel *rtcChannel, uid_t uid, int elapsed) {
        (void)rtcChannel;
        (void)uid;
        (void)elapsed;
    }
    
    virtual void onRtmpStreamingStateChanged(IChannel *rtcChannel, const char *url, RTMP_STREAM_PUBLISH_STATE state, RTMP_STREAM_PUBLISH_ERROR errCode) {
        (void)rtcChannel;
        (void) url;
        (RTMP_STREAM_PUBLISH_STATE) state;
        (RTMP_STREAM_PUBLISH_ERROR) errCode;
    }
    
    virtual void onStreamPublished(IChannel *rtcChannel, const char *url, int error) {
        (void)rtcChannel;
        (void)url;
        (void)error;
    }
    
    virtual void onStreamUnpublished(IChannel *rtcChannel, const char *url) {
        (void)rtcChannel;
        (void)url;
    }
    
    virtual void onTranscodingUpdated(IChannel *rtcChannel) {
        (void)rtcChannel;
    }
    
    virtual void onStreamInjectedStatus(IChannel *rtcChannel, const char* url, uid_t uid, int status) {
        (void)rtcChannel;
        (void)url;
        (void)uid;
        (void)status;
    }
    
    virtual void onRemoteSubscribeFallbackToAudioOnly(IChannel *rtcChannel, uid_t uid, bool isFallbackOrRecover) {
        (void)rtcChannel;
        (void)uid;
        (void)isFallbackOrRecover;
    }
    
    virtual void onConnectionStateChanged(IChannel *rtcChannel,
                                          CONNECTION_STATE_TYPE state,
                                          CONNECTION_CHANGED_REASON_TYPE reason) {
        (void)rtcChannel;
        (void)state;
        (void)reason;
    }
};

class IChannel
{
public:
    virtual ~IChannel() {}
    
    virtual int release() = 0;
    
    virtual int setChannelEventHandler(IChannelEventHandler *channelEh) = 0;

    virtual int joinChannel(const char* token,
                            const char* info,
                            uid_t uid,
                            const ChannelMediaOptions& options) = 0;

    virtual int joinChannelWithUserAccount(const char* token,
                                           const char* userAccount,
                                           const ChannelMediaOptions& options) = 0;
    
    virtual int leaveChannel() = 0;
    
    /** Allows this connection to upload stream. This method will unpublish the current publishing connection if there exists.
     */
    virtual int publish() = 0;
    
    /** Stops publishing stream.
     */
    virtual int unpublish() = 0;
    
    /** Gets the channel ID of IChannel.
     
     @return Channel ID of IChannel.
     */
    virtual const char *channelId() = 0;
    
    virtual int getCallId(agora::util::AString& callId) = 0;

    virtual int renewToken(const char* token) = 0;
    
    virtual int setEncryptionSecret(const char* secret) = 0;
    
    virtual int setEncryptionMode(const char* encryptionMode) = 0;
    
    virtual int registerPacketObserver(IPacketObserver* observer) = 0;
    
    virtual int registerMediaMetadataObserver(IMetadataObserver *observer, IMetadataObserver::METADATA_TYPE type) = 0;
    
    virtual int setClientRole(CLIENT_ROLE_TYPE role) = 0;
    
    virtual int setRemoteUserPriority(uid_t uid, PRIORITY_TYPE userPriority) = 0;

    virtual int setRemoteVoicePosition(int uid, double pan, double gain) = 0;

    virtual int setRemoteRenderMode(uid_t userId, RENDER_MODE_TYPE renderMode) = 0;

    virtual int setDefaultMuteAllRemoteAudioStreams(bool mute) = 0;
    
    virtual int setDefaultMuteAllRemoteVideoStreams(bool mute) = 0;
    
    virtual int muteAllRemoteAudioStreams(bool mute) = 0;
    
    virtual int muteRemoteAudioStream(uid_t userId, bool mute) = 0;
    
    virtual int muteAllRemoteVideoStreams(bool mute) = 0;
    
    virtual int muteRemoteVideoStream(uid_t userId, bool mute) = 0;
    
    virtual int setRemoteVideoStreamType(uid_t userId, REMOTE_VIDEO_STREAM_TYPE streamType) = 0;
    
    virtual int setRemoteDefaultVideoStreamType(REMOTE_VIDEO_STREAM_TYPE streamType) = 0;

    virtual int createDataStream(int* streamId, bool reliable, bool ordered) = 0;
    
    virtual int sendStreamMessage(int streamId, const char* data, size_t length) = 0;
    
    virtual int addPublishStreamUrl(const char *url, bool transcodingEnabled) = 0;
    
    virtual int removePublishStreamUrl(const char *url) = 0;
    
    virtual int setLiveTranscoding(const LiveTranscoding &transcoding) = 0;
    
    virtual int addInjectStreamUrl(const char* url, const InjectStreamConfig& config) = 0;
    
    virtual int removeInjectStreamUrl(const char* url) = 0;
    
    virtual int startChannelMediaRelay(const ChannelMediaRelayConfiguration &configuration) = 0;
    
    virtual int updateChannelMediaRelay(const ChannelMediaRelayConfiguration &configuration) = 0;
    
    virtual int stopChannelMediaRelay() = 0;
    
    virtual CONNECTION_STATE_TYPE getConnectionState() = 0;
};

class IRtcEngine2 : public IRtcEngine
{
public:
    
    /** Gets a the *IChannel* object.
     
     @param channelId Channel ID of the RTC connection.
     @return Pointer to the *IChannel* object. If the connection hasn't been created, NULL will be returned.
     */
    virtual IChannel* createChannel(const char *channelId) = 0;
    
};


}
}


#endif /* IAgoraRtcChannel_h */
