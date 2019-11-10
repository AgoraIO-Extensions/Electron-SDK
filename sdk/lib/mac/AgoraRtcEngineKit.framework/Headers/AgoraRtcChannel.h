//
//  AgoraRtcChannel.h
//  AgoraRtcEngineKit
//
//  Copyright (c) 2019 Agora. All rights reserved.
//

#import "AgoraRtcEngineKit.h"

@class AgoraRtcChannelMediaOptions;
@protocol AgoraRtcChannelDelegate;
@interface AgoraRtcEngineKit ()


/** Gets AgoraRtcChannel object.
 */
- (AgoraRtcChannel * _Nullable)createRtcChannel:(NSString * _Nonnull)channelId;

@end

__attribute__((visibility("default"))) @interface AgoraRtcChannel : NSObject

- (int)destroy;

- (void)setRtcChannelDelegate:(id<AgoraRtcChannelDelegate> _Nullable)channelDelegate;

/** Gets channel id of the connection.
 */
- (NSString * _Nullable)getChannelId;

- (NSString * _Nullable)getCallId;

- (AgoraConnectionStateType)getConnectionState;

/** Starts to join channel.
 */
- (int)joinChannelByToken:(NSString * _Nullable)token
                       info:(NSString * _Nullable)info
                        uid:(NSUInteger)uid
                    options:(AgoraRtcChannelMediaOptions * _Nonnull)options;

- (int)joinChannelByUserAccount:(NSString * _Nonnull)userAccount
                            token:(NSString * _Nullable)token
                          options:(AgoraRtcChannelMediaOptions * _Nonnull)options;

/** Leaves channel.
 */
- (int)leaveChannel;

/** Allows this connection to upload stream. This method will unpublish the current publishing connection if there exists.
 */
- (int)publish;

/** Stops publishing stream.
 */

- (int)unpublish;


- (int)setClientRole:(AgoraClientRole)role;

/** Renews token.
 */
- (int)renewToken:(NSString * _Nonnull)token;

/** Sets the secret of the channel.
 */
- (int)setEncryptionSecret:(NSString * _Nullable)secret;

/** Sets the encryption mode the channel.
 */
- (int)setEncryptionMode:(NSString * _Nullable)encryptionMode;

- (int)setRemoteUserPriority:(NSUInteger)uid
                        type:(AgoraUserPriority)userPriority;

- (int) setRemoteVoicePosition:(NSUInteger) uid
                           pan:(double) pan
                          gain:(double) gain;

- (int)setRemoteRenderMode:(NSUInteger)uid
                      mode:(AgoraVideoRenderMode)mode;

/** Sets default remote audio stream muted state.
 */
- (int)setDefaultMuteAllRemoteAudioStreams:(BOOL)mute;

- (int)setDefaultMuteAllRemoteVideoStreams:(BOOL)mute;

/** Mutes audio stream with specific uid.
 */
- (int)muteRemoteAudioStream:(NSUInteger)uid
                        mute:(BOOL)mute;

/** Mutes all remote audio streams.
 */
- (int)muteAllRemoteAudioStreams:(BOOL)mute;

/** Mutes video stream with specific uid.
 */
- (int)muteRemoteVideoStream:(NSUInteger)uid
                        mute:(BOOL)mute;

/** Enables/disables video with specific uid.
 */
- (int)enableRemoteVideo:(BOOL)enabled andUid:(NSUInteger)uid;

/** Mutes all video streams.
 */
- (int)muteAllRemoteVideoStreams:(BOOL)mute;

- (int)setRemoteVideoStream:(NSUInteger)uid
                       type:(AgoraVideoStreamType)streamType;

- (int)setRemoteDefaultVideoStreamType:(AgoraVideoStreamType)streamType;

- (int)addInjectStreamUrl:(NSString * _Nonnull)url config:(AgoraLiveInjectStreamConfig * _Nonnull)config;

- (int)removeInjectStreamUrl:(NSString * _Nonnull)url;

- (int)addPublishStreamUrl:(NSString * _Nonnull)url transcodingEnabled:(BOOL)transcodingEnabled;

- (int)removePublishStreamUrl:(NSString * _Nonnull)url;

- (int)setLiveTranscoding:(AgoraLiveTranscoding *_Nullable)transcoding;

- (int)createDataStream:(NSInteger * _Nonnull)streamId
               reliable:(BOOL)reliable
                ordered:(BOOL)ordered;

- (int)sendStreamMessage:(NSInteger)streamId
                    data:(NSData * _Nonnull)data;

- (int)startChannelMediaRelay:(AgoraChannelMediaRelayConfiguration * _Nonnull)config;

- (int)updateChannelMediaRelay:(AgoraChannelMediaRelayConfiguration * _Nonnull)config;

- (int)stopChannelMediaRelay;

#if TARGET_OS_IPHONE
- (int)enableRemoteSuperResolution:(NSUInteger)uid enabled:(BOOL)enabled;
#endif

- (BOOL)setMediaMetadataDataSource:(id<AgoraMediaMetadataDataSource> _Nullable) metadataDataSource withType:(AgoraMetadataType)type;

- (BOOL)setMediaMetadataDelegate:(id<AgoraMediaMetadataDelegate> _Nullable) metadataDelegate withType:(AgoraMetadataType)type;

@end

@protocol AgoraRtcChannelDelegate <NSObject>
@optional

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel
               didOccurWarning:(AgoraWarningCode)warningCode;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel
                 didOccurError:(AgoraErrorCode)errorCode;

- (void)rtcChannelDidJoinChannel:(AgoraRtcChannel * _Nonnull)rtcChannel
                            withUid:(NSUInteger)uid
                            elapsed:(NSInteger) elapsed;

- (void)rtcChannelDidRejoinChannel:(AgoraRtcChannel * _Nonnull)rtcChannel
                              withUid:(NSUInteger)uid
                              elapsed:(NSInteger) elapsed;

- (void)rtcChannelDidLeaveChannel:(AgoraRtcChannel * _Nonnull)rtcChannel
                           withStats:(AgoraChannelStats * _Nonnull)stats;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel
          didClientRoleChanged:(AgoraClientRole)oldRole
                       newRole:(AgoraClientRole)newRole;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel
                didJoinedOfUid:(NSUInteger)uid
                       elapsed:(NSInteger)elapsed;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel
               didOfflineOfUid:(NSUInteger)uid
                        reason:(AgoraUserOfflineReason)reason;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel
      connectionChangedToState:(AgoraConnectionStateType)state
                        reason:(AgoraConnectionChangedReason)reason;

- (void)rtcChannelDidLost:(AgoraRtcChannel * _Nonnull)rtcChannel;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel
      tokenPrivilegeWillExpire:(NSString *_Nonnull)token;

- (void)rtcChannelRequestToken:(AgoraRtcChannel * _Nonnull)rtcChannel;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel activeSpeaker:(NSUInteger)speakerUid;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel firstRemoteVideoFrameOfUid:(NSUInteger)uid size:(CGSize)size elapsed:(NSInteger)elapsed;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel firstRemoteAudioFrameOfUid:(NSUInteger)uid elapsed:(NSInteger)elapsed;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel firstRemoteAudioFrameDecodedOfUid:(NSUInteger)uid elapsed:(NSInteger)elapsed;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel didAudioMuted:(BOOL)muted byUid:(NSUInteger)uid;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel videoSizeChangedOfUid:(NSUInteger)uid size:(CGSize)size rotation:(NSInteger)rotation;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel remoteVideoStateChangedOfUid:(NSUInteger)uid state:(AgoraVideoRemoteState)state reason:(AgoraVideoRemoteStateReason)reason elapsed:(NSInteger)elapsed;;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel remoteAudioStateChangedOfUid:(NSUInteger)uid state:(AgoraAudioRemoteState)state reason:(AgoraAudioRemoteStateReason)reason elapsed:(NSInteger)elapsed;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel didLocalPublishFallbackToAudioOnly:(BOOL)isFallbackOrRecover;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel didRemoteSubscribeFallbackToAudioOnly:(BOOL)isFallbackOrRecover byUid:(NSUInteger)uid;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel reportRtcStats:(AgoraChannelStats * _Nonnull)stats;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel networkQuality:(NSUInteger)uid txQuality:(AgoraNetworkQuality)txQuality rxQuality:(AgoraNetworkQuality)rxQuality;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel remoteVideoStats:(AgoraRtcRemoteVideoStats * _Nonnull)stats;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel remoteAudioStats:(AgoraRtcRemoteAudioStats * _Nonnull)stats;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel rtmpStreamingChangedToState:(NSString * _Nonnull)url state:(AgoraRtmpStreamingState)state errorCode:(AgoraRtmpStreamingErrorCode)errorCode;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel streamPublishedWithUrl:(NSString * _Nonnull)url errorCode:(AgoraErrorCode)errorCode;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel streamUnpublishedWithUrl:(NSString * _Nonnull)url;

- (void)rtcChannelTranscodingUpdated:(AgoraRtcChannel * _Nonnull)rtcChannel;


#pragma mark Inject Stream URL Delegate Methods

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel streamInjectedStatusOfUrl:(NSString * _Nonnull)url uid:(NSUInteger)uid status:(AgoraInjectStreamStatus)status;

#pragma mark Stream Message Delegate Methods


- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel receiveStreamMessageFromUid:(NSUInteger)uid streamId:(NSInteger)streamId data:(NSData * _Nonnull)data;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel didOccurStreamMessageErrorFromUid:(NSUInteger)uid streamId:(NSInteger)streamId error:(NSInteger)error missed:(NSInteger)missed cached:(NSInteger)cached;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel channelMediaRelayStateDidChange:(AgoraChannelMediaRelayState)state error:(AgoraChannelMediaRelayError)error;

- (void)rtcChannel:(AgoraRtcChannel * _Nonnull)rtcChannel didReceiveChannelMediaRelayEvent:(AgoraChannelMediaRelayEvent)event;

@end
