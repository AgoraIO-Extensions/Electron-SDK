//
//  AgoraRtcEngineKit.h
//  AgoraRtcEngineKit
//
//  Created by Sting Feng on 2015-8-11.
//  Copyright (c) 2015 Agora. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AgoraObjects.h"
#import "AgoraMediaIO.h"

@class AgoraRtcEngineKit;

@protocol AgoraRtcEngineDelegate <NSObject>
@optional
#pragma mark SDK common delegates
/**
 *  The warning occurred in SDK. The APP could igonre the warning, and the SDK could try to resume automically.
 *
 *  @param engine      The engine kit
 *  @param warningCode The warning code
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didOccurWarning:(AgoraWarningCode)warningCode;

/**
 *  The error occurred in SDK. The SDK couldn't resume to normal state, and the app need to handle it.
 *
 *  @param engine    The engine kit
 *  @param errorCode The error code
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didOccurError:(AgoraErrorCode)errorCode;

/**
 *  Event of load media engine success
 *
 *  @param engine The engine kit
 */
- (void)rtcEngineMediaEngineDidLoaded:(AgoraRtcEngineKit * _Nonnull)engine;

/**
 *  Event of media engine start call success
 *
 *  @param engine The engine kit
 */
- (void)rtcEngineMediaEngineDidStartCall:(AgoraRtcEngineKit * _Nonnull)engine;

/**
 * when token is enabled, and specified token is invalid or expired, this function will be called.
 * APP should generate a new token and call renewToken() to refresh the token.
 * NOTE: to be compatible with previous version, ERR_TOKEN_EXPIRED and ERR_INVALID_TOKEN are also reported via onError() callback.
 * You should move renew of token logic into this callback.
 *  @param engine The engine kit
 */
- (void)rtcEngineRequestToken:(AgoraRtcEngineKit * _Nonnull)engine;

/**
 *  Event of disconnected with server. This event is reported at the moment SDK loses connection with server.
 *  In the mean time SDK automatically tries to reconnect with the server until APP calls leaveChannel.
 *
 *  @param engine The engine kit
 */
- (void)rtcEngineConnectionDidInterrupted:(AgoraRtcEngineKit * _Nonnull)engine;

/**
 *  Event of loss connection with server. This event is reported after the connection is interrupted and exceed the retry period (10 seconds by default).
 *  In the mean time SDK automatically tries to reconnect with the server until APP calls leaveChannel.
 *
 *  @param engine The engine kit
 */
- (void)rtcEngineConnectionDidLost:(AgoraRtcEngineKit * _Nonnull)engine;

/**
 *  Event of connection banned by server. This event is reported after the connection is banned by server.
 *  In the mean time SDK will not try to reconnect the server.
 */
- (void)rtcEngineConnectionDidBanned:(AgoraRtcEngineKit * _Nonnull)engine;

/**
 *  Statistics of rtc engine status. Updated every two seconds.
 *
 *  @param engine The engine kit
 *  @param stats  The statistics of rtc status, including duration, sent bytes and received bytes
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine reportRtcStats:(AgoraChannelStats * _Nonnull)stats;

/**
 *  The network quality of lastmile test.
 *
 *  @param engine  The engine kit
 *  @param quality The network quality
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine lastmileQuality:(AgoraNetworkQuality)quality;

/**
 *  Event of API call executed
 *
 *  @param engine The engine kit
 *  @param api    The API description
 *  @param error  The error code
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didApiCallExecute:(NSInteger)error api:(NSString * _Nonnull)api result:(NSString * _Nonnull)result;

/**
 *  This callback returns the status code after executing the refreshRecordingServiceStatus method successfully.
 *
 *  @param engine The engine kit
 *  @param status 0：Recording is stopped. 1：Recording is ongoing.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didRefreshRecordingServiceStatus:(NSInteger)status;

#if (!(TARGET_OS_IPHONE) && (TARGET_OS_MAC))
/**
 *  the notificaitoin of device added removed
 *
 *  @param engine The engine kit
 *  @param deviceId   the identification of device
 *  @param deviceType type of device: -1: audio unknown; 0: audio recording ; 1: audio playout ; 2: render; 4: capture
 *  @param state      state of device: 0: added; 1: removed
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine device:(NSString * _Nonnull) deviceId type:(AgoraMediaDeviceType) deviceType stateChanged:(NSInteger) state;

#endif

#pragma mark Local user common delegates
/**
 *  Event of the user joined the channel.
 *
 *  @param engine  The engine kit
 *  @param channel The channel name
 *  @param uid     The remote user id
 *  @param elapsed The elapsed time (ms) from session beginning
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didJoinChannel:(NSString * _Nonnull)channel withUid:(NSUInteger)uid elapsed:(NSInteger) elapsed;

/**
 *  Event of the user rejoined the channel
 *
 *  @param engine  The engine kit
 *  @param channel The channel name
 *  @param uid     The user id
 *  @param elapsed The elapsed time (ms) from session beginning
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didRejoinChannel:(NSString * _Nonnull)channel withUid:(NSUInteger)uid elapsed:(NSInteger) elapsed;

/**
 *  Event of cient role change. only take effect under broadcasting mode
 *
 *  @param engine The engine kit
 *  @param oldRole the previous role
 *  @param newRole the new role
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didClientRoleChanged:(AgoraClientRole)oldRole newRole:(AgoraClientRole)newRole;

/**
 *  The statistics of the call when leave channel
 *
 *  @param engine The engine kit
 *  @param stats  The statistics of the call, including duration, sent bytes and received bytes
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didLeaveChannelWithStats:(AgoraChannelStats * _Nonnull)stats;

/**
 *  The network quality of local user.
 *
 *  @param engine  The engine kit
 *  @param uid     The id of user
 *  @param txQuality The sending network quality
 *  @param rxQuality The receiving network quality
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine networkQuality:(NSUInteger)uid txQuality:(AgoraNetworkQuality)txQuality rxQuality:(AgoraNetworkQuality)rxQuality;

#pragma mark Local user audio delegates
/**
 *  Event of the first audio frame is sent.
 *
 *  @param engine  The engine kit
 *  @param elapsed The elapsed time(ms) from the beginning of the session.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine firstLocalAudioFrame:(NSInteger)elapsed;

/**
 *  Event of local audio route changed
 *
 *  @param engine The engine kit
 *  @param routing the current audio output routing
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didAudioRouteChanged:(AgoraAudioOutputRouting)routing;

/**
 *  Event of finish audio mixing.
 *
 *  @param engine The engine kit
 */
- (void)rtcEngineLocalAudioMixingDidFinish:(AgoraRtcEngineKit * _Nonnull)engine;

/**
 *  Event of finish audio effect.
 *
 *  @param engine The engine kit
 */
- (void)rtcEngineDidAudioEffectFinish:(AgoraRtcEngineKit * _Nonnull)engine soundId:(NSInteger)soundId;


#pragma mark Local user video delegates
/**
 *  Event of camera opened
 *
 *  @param engine The engine kit
 */
- (void)rtcEngineCameraDidReady:(AgoraRtcEngineKit * _Nonnull)engine;

#if TARGET_OS_IPHONE
/**
 *  Event of camera focus position changed
 *
 *  @param engine The engine kit
 *  @param rect   The focus rect in local preview
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine cameraFocusDidChangedToRect:(CGRect)rect;
#endif

/**
 *  Event of camera stopped
 *
 *  @param engine The engine kit
 */
- (void)rtcEngineVideoDidStop:(AgoraRtcEngineKit * _Nonnull)engine;

/**
 *  Event of the first local frame starts rendering on the screen.
 *
 *  @param engine  The engine kit
 *  @param size    The size of local video stream
 *  @param elapsed The elapsed time(ms) from the beginning of the session.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine firstLocalVideoFrameWithSize:(CGSize)size elapsed:(NSInteger)elapsed;

/**
 *  The statistics of local video stream. Update every two seconds.
 *
 *  @param engine        The engine kit
 *  @param stats         The statistics of local video, including sent bitrate, sent framerate
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine localVideoStats:(AgoraRtcLocalVideoStats * _Nonnull)stats;

#pragma mark Remote user common delegates
/**
 *  Event of remote user joined
 *
 *  @param engine  The engine kit
 *  @param uid     The remote user id
 *  @param elapsed The elapsed time(ms) from the beginning of the session.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didJoinedOfUid:(NSUInteger)uid elapsed:(NSInteger)elapsed;

/**
 *  Event of remote user offlined
 *
 *  @param engine The engine kit
 *  @param uid    The remote user id
 *  @param reason Reason of user offline, quit, drop or became audience
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didOfflineOfUid:(NSUInteger)uid reason:(AgoraUserOfflineReason)reason;

/**
 *  receive custom data from remote user
 *
 *  @param engine The engine kit
 *  @param uid    The remote user id
 *  @param streamId The stream id
 *  @param data   The user defined data
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine receiveStreamMessageFromUid:(NSUInteger)uid streamId:(NSInteger)streamId data:(NSData * _Nonnull)data;

/**
 *  the local user has not received the data stream from the other user within 5 seconds.
 *
 *  @param engine The engine kit
 *  @param uid    The remote user id
 *  @param streamId The stream id
 *  @param error    The error code
 *  @param missed   The number of lost messages
 *  @param cached   The number of incoming cached messages when the data stream is interrupted
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didOccurStreamMessageErrorFromUid:(NSUInteger)uid streamId:(NSInteger)streamId error:(NSInteger)error missed:(NSInteger)missed cached:(NSInteger)cached;

#pragma mark Remote user audio delegates
/**
 *  Event of the first audio frame from remote user is received.
 *
 *  @param engine  The engine kit
 *  @param uid     The remote user id
 *  @param elapsed The elapsed time(ms) from the beginning of the session.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine firstRemoteAudioFrameOfUid:(NSUInteger)uid elapsed:(NSInteger)elapsed;

/**
 *  Event of remote user audio muted or unmuted
 *
 *  @param engine The engine kit
 *  @param muted  Muted or unmuted
 *  @param uid    The remote user id
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didAudioMuted:(BOOL)muted byUid:(NSUInteger)uid;

/**
 *  The sdk reports the volume of a speaker. The interface is disable by default, and it could be enable by API "enableAudioVolumeIndication"
 *
 *  @param engine      The engine kit
 *  @param speakers    AgoraRtcAudioVolumeInfo array
 *  @param totalVolume The total volume of speakers
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine reportAudioVolumeIndicationOfSpeakers:(NSArray<AgoraRtcAudioVolumeInfo *> * _Nonnull)speakers totalVolume:(NSInteger)totalVolume;

/**
 *  The sdk reports who is active speaker in the channel
 *
 *  @param engine      The engine kit
 *  @param speakerUid  The speaker who is talking
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine activeSpeaker:(NSUInteger)speakerUid;

/**
 *  Event of remote start audio mixing.
 *
 *  @param engine The engine kit
 */
- (void)rtcEngineRemoteAudioMixingDidStart:(AgoraRtcEngineKit * _Nonnull)engine;

/**
 *  Event of remote finish audio mixing.
 *
 *  @param engine The engine kit
 */
- (void)rtcEngineRemoteAudioMixingDidFinish:(AgoraRtcEngineKit * _Nonnull)engine;

/**
 *  The audio quality of the user. updated every two seconds.
 *
 *  @param engine  The engine kit
 *  @param uid     The id of user
 *  @param quality The audio quality
 *  @param delay   The delay from the remote user
 *  @param lost    The percentage of lost packets
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine audioQualityOfUid:(NSUInteger)uid quality:(AgoraNetworkQuality)quality delay:(NSUInteger)delay lost:(NSUInteger)lost;

#pragma mark Remote user video delegates
/**
 *  Event of the first frame of remote user is decoded successfully.
 *
 *  @param engine  The engine kit
 *  @param uid     The remote user id
 *  @param size    The size of video stream
 *  @param elapsed The elapsed time(ms) from the beginning of the session.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine firstRemoteVideoDecodedOfUid:(NSUInteger)uid size:(CGSize)size elapsed:(NSInteger)elapsed;

/**
 *  Event of the first frame of remote user is rendering on the screen.
 *
 *  @param engine  The engine kit
 *  @param uid     The remote user id
 *  @param size    The size of video stream
 *  @param elapsed The elapsed time(ms) from the beginning of the session.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine firstRemoteVideoFrameOfUid:(NSUInteger)uid size:(CGSize)size elapsed:(NSInteger)elapsed;

/**
 *  Event of video size changed for local or remote user
 *
 *  @param engine  The engine kit
 *  @param uid     The user id
 *  @param size    The new size of video
 *  @param rotation  The new rotate of video
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine videoSizeChangedOfUid:(NSUInteger)uid size:(CGSize)size rotation:(NSInteger)rotation;

/**
 *  Event of remote user video muted or unmuted
 *
 *  @param engine The engine kit
 *  @param muted  Muted or unmuted
 *  @param uid    The remote user id
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didVideoMuted:(BOOL)muted byUid:(NSUInteger)uid;

/**
 *  Event of remote user video enabled or disabled
 *
 *  @param engine The engine kit
 *  @param enabled  Enabled or disabled
 *  @param uid    The remote user id
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didVideoEnabled:(BOOL)enabled byUid:(NSUInteger)uid;

/**
 *  Event of remote user local video enabled or disabled
 *
 *  @param engine The engine kit
 *  @param enabled  Enabled or disabled
 *  @param uid    The remote user id
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didLocalVideoEnabled:(BOOL)enabled byUid:(NSUInteger)uid;

/**
 *  The statistics of remote video stream. Update every two seconds.
 *
 *  @param engine            The engine kit
 *  @param stats             The statistics of remote video, including user id, delay, resolution, received bitrate, received framerate, video stream type
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine remoteVideoStats:(AgoraRtcRemoteVideoStats * _Nonnull)stats;


- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine streamPublishedWithUrl:(NSString * _Nonnull)url errorCode:(AgoraErrorCode)errorCode;

- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine streamUnpublishedWithUrl:(NSString * _Nonnull)url;

- (void)rtcEngineTranscodingUpdated:(AgoraRtcEngineKit * _Nonnull)engine;

- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine publishingRequestReceivedFromUid:(NSUInteger)uid;
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine publishingRequestAnsweredByOwner:(NSUInteger)uid accepted:(BOOL)accepted error:(AgoraErrorCode)error;
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine unpublishingRequestReceivedFromOwner:(NSUInteger)uid;
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine streamInjectedStatusOfUrl:(NSString * _Nonnull)url uid:(NSUInteger)uid status:(AgoraInjectStreamStatus)status;

@end

#pragma mark - AgoraRtcEngineKit

__attribute__((visibility("default"))) @interface AgoraRtcEngineKit : NSObject
/**
 *  Set / Get the AgoraRtcEngineDelegate
 */
@property (nonatomic, weak) id<AgoraRtcEngineDelegate> _Nullable delegate;

/**
 *  Initializes the AgoraRtcEngineKit object.
 *
 *  @param appId The appId is issued to the application developers by Agora.
 *  @param delegate The AgoraRtcEngineDelegate
 *
 *  @return an object of AgoraRtcEngineKit class
 */
+ (instancetype _Nonnull)sharedEngineWithAppId:(NSString * _Nonnull)appId
                                      delegate:(id<AgoraRtcEngineDelegate> _Nullable)delegate;

/**
 *  deprecated
 */
+ (instancetype _Nonnull)sharedEngineWithAppId:(NSString * _Nonnull)AppId error:(void(^ _Nullable)(AgoraErrorCode errorCode))errorBlock __deprecated;

+ (void)destroy;

/**
 *  Get the version of Agora SDK.
 *
 *  @return string, sdk version
 */
+ (NSString * _Nonnull)getSdkVersion;

/**
 *  Get the version of Media Engine
 *
 *  @return string, engine version
 */
+ (NSString * _Nonnull)getMediaEngineVersion;

/**
 *  Get the native handler of sdk Engine
 */
- (void * _Nullable)getNativeHandle;

#pragma mark Common methods
/**
 *  Create an open UDP socket to the AgoraRtcEngineKit cloud service to join a channel.
    Users in the same channel can talk to each other with same appId.
    Users using different appIds cannot call each other.
    The method is asynchronous.
 *
 *  @param token        token generated by APP using sign certificate.
 *  @param channelId       Joining in the same channel indicates those clients have entered in one room.
 *  @param info              Optional, this argument can be whatever the programmer likes personally.
 *  @param uid               Optional, this argument is the unique ID for each member in one channel.
                             If not specified, or set to 0, the SDK automatically allocates an ID, and the id could be gotten in onJoinChannelSuccess.
 *  @param joinSuccessBlock  This callback indicates that the user has successfully joined the specified channel. Same as rtcEngine:didJoinChannel:withUid:elapsed:. If nil, the callback rtcEngine:didJoinChannel:withUid:elapsed: will works.
 *
 *  @return 0 when executed successfully, and return negative value when failed.
 */
- (int)joinChannelByToken:(NSString * _Nullable)token
            channelId:(NSString * _Nonnull)channelId
                   info:(NSString * _Nullable)info
                    uid:(NSUInteger)uid
            joinSuccess:(void(^ _Nullable)(NSString * _Nonnull channel, NSUInteger uid, NSInteger elapsed))joinSuccessBlock;

/**
 *  lets the user leave a channel, i.e., hanging up or exiting a call.
    After joining a channel, the user must call the leaveChannel method to end the call before joining another one.
    It is synchronous, i.e., it only returns until the call ends and all resources are released.
 *  @param leaveChannelBlock indicate the statistics of this call, from joinChannel to leaveChannel, including duration, tx bytes and rx bytes in the call.
 *
 *  @return 0 if executed successfully, or return negative value if failed.
 */
- (int)leaveChannel:(void(^ _Nullable)(AgoraChannelStats * _Nonnull stat))leaveChannelBlock;

/**
 *  Set the channel profile: such as communication, live broadcasting
 *
 *  @param profile the channel profile
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)setChannelProfile:(AgoraChannelProfile)profile;

/**
 *  Set the role of user: such as broadcaster, audience
 *
 *  @param role the role of client
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)setClientRole:(AgoraClientRole)role;

- (int)addPublishStreamUrl:(NSString * _Nonnull)url transcodingEnabled:(BOOL) transcodingEnabled;

- (int)removePublishStreamUrl:(NSString * _Nonnull)url;

- (int)setLiveTranscoding:(AgoraLiveTranscoding *_Nullable) transcoding;

- (int)sendPublishingRequestToOwner:(NSUInteger) uid;
- (int)answerPublishingRequestOfUid:(NSUInteger) uid accepted:(bool)accepted;
- (int)sendUnpublishingRequestToUid:(NSUInteger) uid;
- (int)addInjectStreamUrl:(NSString * _Nonnull) url config:(AgoraLiveInjectStreamConfig * _Nonnull)config;
- (int)removeInjectStreamUrl:(NSString * _Nonnull) url;


/**
 *  Renew token, refresh the new key into agora engine. APP should call this API when SDK reports error ERR_TOKEN_EXPIRED.
 *
 *  @param token new token
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)renewToken:(NSString * _Nonnull)token;

- (int)enableWebSdkInteroperability:(BOOL)enabled;

/**
 *  Enables the network quality test. When enabled, the callback 'networkQualityBlock' notifies the application about the user's network connection quality.
 Note: Once the network test is enabled, it uses the network bandwidth even when the application is not in a call.
 Recommandation: When the application is foreground, enable the network connection test; and when the application is switched to background, disable network test  in order to reduce network traffic.
 By default, the network test is disabled
 *
 *  @return 0 when executed successfully, and return negative value when failed.
 */
- (int)enableLastmileTest;

/**
 *  Disables the network quality test.
 *
 *  @return 0 when executed successfully, and return negative value when failed.
 */
- (int)disableLastmileTest;

/**
 *  Specify sdk parameters
 *
 *  @param options sdk options in json format.
 */
- (int)setParameters:(NSString * _Nonnull)options;

- (NSString * _Nullable)getParameter:(NSString * _Nonnull)parameter
                                args:(NSString * _Nullable)args;

/**
 *  Specifies the SDK output log file.
 *
 *  @param filePath The full file path of the log file.
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)setLogFile:(NSString * _Nonnull)filePath;

/**
 *  Specifiy the log level of output
 *
 *  @param filter The log level
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)setLogFilter:(NSUInteger)filter;

/**
 *  The call id of current client. The call id could be used in 'rate' and 'complain' method.
 *
 *  @return The current call id.
 */
- (NSString * _Nullable)getCallId;

/**
 *  Let user rate the call. Often called after the call ends.
 *
 *  @param callId      The call ID retrieved from the 'getCallId' method.
 *  @param rating      The rating for the call between 1 (lowest score) to 10 (highest score).
 *  @param description Optional, decribed by user for the call with a length less than 800 bytes.
 *
 *  @return 0 when executed successfully. return ERR_INVALID_ARGUMENT (-2)：The passed argument is invalid, e.g., callId invalid. return ERR_NOT_READY (-3)：The SDK status is incorrect, e.g., initialization failed.
 */
- (int)rate:(NSString * _Nonnull)callId
     rating:(NSInteger)rating
description:(NSString * _Nullable)description;

/**
 *  Let user complain the quality of the call. Often called after the call ends.
 *
 *  @param callId      The call ID retrieved from the 'getCallId' method.
 *  @param description Optional, decribed by user for the call with a length less than 800 bytes.
 *
 *  @return 0 when executed successfully. return ERR_INVALID_ARGUMENT (-2)：The passed argument is invalid, e.g., callId invalid. return ERR_NOT_READY (-3)：The SDK status is incorrect, e.g., initialization failed.
 */
- (int)complain:(NSString * _Nonnull)callId
    description:(NSString * _Nullable)description;

/**
 *  Enable / Disable dispatching delegate to main queue. if disable, the app should dispatch UI operating to main queue by himself.
 *
 *  @param enabled YES: dispatch delegate method to main queue. NO: not dispatch delegate methods to main queue
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)enableMainQueueDispatch:(BOOL)enabled;

#pragma mark Video common
/**
 *  Enables video mode.  Switches from audio to video mode. It could be called during a call and before entering a channel.
 *
 *  @return 0 when this method is called successfully, or negative value when this method failed.
 */
- (int)enableVideo;

/**
 *  Disable video mode. Switch from video to audio mode. It could be called during a call and before entering a channel.
 *
 *  @return 0 when this method is called successfully, or negative value when this method failed.
 */
- (int)disableVideo;

/**
 *  Enables local video.
 *
 *  @param enabled YES to enabled local video capture and render (by default), NO to disable using local camera device.
 *  @return 0 when this method is called successfully, or negative value when this method failed.
 */
- (int)enableLocalVideo:(BOOL)enabled;

/**
 *  set video profile, including resolution, fps, kbps
 *
 *  @param profile enumeration definition about the video resolution, fps and max kbps
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)setVideoProfile:(AgoraVideoProfile)profile
    swapWidthAndHeight:(BOOL)swapWidthAndHeight;

- (int)setVideoResolution: (CGSize)size andFrameRate: (NSInteger)frameRate bitrate: (NSInteger) bitrate;

- (int)enableLocalVideoCapture: (bool)enabled;
- (int)enableLocalVideoRender: (bool)enabled;
- (int)enableLocalVideoSend: (bool)enabled;

- (int)setVideoQualityParameters:(BOOL)preferFrameRateOverImageQuality;

/**
 *  Set up the local video view. The video canvus is initialized with video display setting. And it could be called before entering a channel.
 *
 *  @param local the canvas is composed of view, renderMode and uid. How to initialize 'local'? please take a look at 'AgoraRtcVideoCanvas'
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)setupLocalVideo:(AgoraRtcVideoCanvas * _Nullable)local;

/**
 *  Configure display setting of local view. And it could be called mutiple times during a call.
 *
 *  @param mode There are Hidden(1), Fit(2) and Adaptive(3) mode. Please take a look at definition of enum AgoraVideoRenderMode
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)setLocalRenderMode:(AgoraVideoRenderMode) mode;

/**
 *  Configure setting of local video mirror. And it should be set before open of preview.
 *  If the setting is after the open of preview, it needs reopen the preview to make the setting take effect.
 *  @param mode There are Default(0), Enabled(1) and Disabled(2) mode. Please take a look at definition of enum AgoraVideoMirrorMode
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)setLocalVideoMirrorMode:(AgoraVideoMirrorMode) mode;

/**
 *  start local video preview, while not sending data to server
 *
 *  @return 0 when this method is called successfully, or negative value when this method failed.
 */
- (int)startPreview;

/**
 *  stop local video preview
 *
 *  @return 0 when this method is called successfully, or negative value when this method failed.
 */
- (int)stopPreview;

/**
 *  Switches between front and back cameras.
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)switchCamera;

/**
 *  Set up the remote video view. The video canvus is initialized with video display setting. It could be called after receiving the remote video streams to configure the video settings.
 *
 *  @param remote the canvas is composed of view, renderMode and uid. How to initialize 'remote'? please take a look at 'AgoraRtcVideoCanvas'
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)setupRemoteVideo:(AgoraRtcVideoCanvas * _Nonnull)remote;

/**
 *  Configure display setting of remote view. And it could be called mutiple times during a call.
 *
 *  @param uid  The user id of remote view.
 *  @param mode There are Hidden(1), Fit(2) and Adaptive(3) mode. Please take a look at definition of enum AgoraVideoRenderMode
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)setRemoteRenderMode:(NSUInteger)uid
                      mode:(AgoraVideoRenderMode) mode;

/**
 *  Enable / disable sending local video streams to the network.
 *
 *  @param mute YES: stop sending local video stream to the network, NO: start sending local video stream.
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)muteLocalVideoStream:(BOOL)mute;

/**
 *  Enables / disables playing all remote callers’ video streams.
 *
 *  @param mute YES: stop playing, NO: start playing.
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)muteAllRemoteVideoStreams:(BOOL)mute;

/**
 *  Default enables / disables playing all remote callers’ video streams.
 *
 *  @param mute YES: default not playing, NO: default playing.
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)setDefaultMuteAllRemoteVideoStreams:(BOOL)mute;

/**
 *  Enable / disable a remote user's video stream
 *
 *  @param uid  The remote user id
 *  @param mute YES: discard the video stream from remote user, NO: start receiving remote video stream.
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)muteRemoteVideoStream:(NSUInteger)uid
                        mute:(BOOL)mute;

/**
 *  API deprecated. Please refer to open source https://github.com/AgoraLab/AgoraDemo, the function "onSwitchRemoteUsers" in demo agora-easycall-ios-oc
 *   Switches between video display views of two different users.
 *
 *  @param uid1 The user ID of the user whose video is to be switched.
 *  @param uid2 The user ID of another user whose video is to be switched.
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)switchView:(NSUInteger)uid1
       andAnother:(NSUInteger)uid2 __deprecated;

#pragma mark Video dual stream
- (int)enableDualStreamMode:(BOOL)enabled;
- (int)setRemoteVideoStream:(NSUInteger)uid
                       type:(AgoraVideoStreamType)streamType;
- (int)setRemoteDefaultVideoStreamType:(AgoraVideoStreamType)streamType;

#if TARGET_OS_IPHONE
#pragma mark Video camera control
- (BOOL)isCameraZoomSupported;
- (CGFloat)setCameraZoomFactor:(CGFloat)zoomFactor;

- (BOOL)isCameraFocusPositionInPreviewSupported;
- (BOOL)setCameraFocusPositionInPreview:(CGPoint)position;

- (BOOL)isCameraTorchSupported;
- (BOOL)setCameraTorchOn:(BOOL)isOn;

- (BOOL)isCameraAutoFocusFaceModeSupported;
- (BOOL)setCameraAutoFocusFaceModeEnabled:(BOOL)enable;
#endif

#pragma mark Audio common
/**
 *  Enables audio function, which is enabled by default.
 *
 *  @return 0 when this method is called successfully, or negative value when this method failed.
 */
- (int)enableAudio;

/**
 *  Disable audio function.
 *
 *  @return 0 when this method is called successfully, or negative value when this method failed.
 */
- (int)disableAudio;

/**
 *  Pause audio function in channel.
 *  @return 0 when this method is called successfully, or negative value when this method failed.
 */
- (int)pauseAudio;

/**
 *  Resume audio function in channel.
 *  @return 0 when this method is called successfully, or negative value when this method failed.
 */
- (int)resumeAudio;

/**
 *  Enable / Disable speaker of device
 *
 *  @param enableSpeaker YES: Switches to speakerphone. NO: Switches to headset.
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)setEnableSpeakerphone:(BOOL)enableSpeaker;

/**
 *  test if the speakerphone is enabled or not.
 *
 *  @return YES when speakerphone is enabled. NO when speakerphone is not enabled.
 */
- (BOOL)isSpeakerphoneEnabled;

/**
 *  Set default audio route to Speakerphone
 *
 *  @param defaultToSpeaker YES: default to speakerphone. NO: default to earpiece for voice chat, speaker for video chat.
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)setDefaultAudioRouteToSpeakerphone:(BOOL)defaultToSpeaker;

/**
 *  set audio profile and scenario
 *  including sample rate, bit rate, mono/stereo, speech/music codec
 *
 *  @param profile enumeration definition about the audio's samplerate, bitrate, mono/stereo, speech/music codec
 *  @param scenario enumeration definition about the audio scenario
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)setAudioProfile:(AgoraAudioProfile)profile
              scenario:(AgoraAudioScenario)scenario;

/**
 *  deprecated, use setAudioProfile:scenario: insted
 */
- (int)setHighQualityAudioParametersWithFullband:(BOOL)fullband
                                          stereo:(BOOL)stereo
                                     fullBitrate:(BOOL)fullBitrate __deprecated;

/**
 * adjust recording signal volume
 *
 * @param [in] volume range from 0 to 400
 *
 * @return return 0 if success or an error code
 */
- (int)adjustRecordingSignalVolume:(NSInteger)volume;

/**
 * adjust playback signal volume
 *
 * @param [in] volume range from 0 to 400
 *
 * @return return 0 if success or an error code
 */
- (int)adjustPlaybackSignalVolume:(NSInteger)volume;

/**
 *  Sets the speakerphone volume. The speaker volume could be adjust by MPMusicPlayerController and other iOS API easily.
 *
 *  @param volume between 0 (lowest volume) to 255 (highest volume).
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)setSpeakerphoneVolume:(NSUInteger)volume __deprecated;

/**
 *  Enables to report to the application about the volume of the speakers.
 *
 *  @param interval Specifies the time interval between two consecutive volume indications.
                    <=0: Disables volume indication.
                    >0 : The volume indication interval in milliseconds. Recommandation: >=200ms.
 *  @param smooth   The smoothing factor. Recommended: 3.
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)enableAudioVolumeIndication:(NSInteger)interval
                            smooth:(NSInteger)smooth;

/**
 *  Mutes / Unmutes local audio.
 *
 *  @param mute true: Mutes the local audio. false: Unmutes the local audio.
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)muteLocalAudioStream:(BOOL)mute;

- (int)muteRemoteAudioStream:(NSUInteger)uid mute:(BOOL)mute;

/**
 *  Mutes / Unmutes all remote audio.
 *
 *  @param mute true: Mutes all remote received audio. false: Unmutes all remote received audio.
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)muteAllRemoteAudioStreams:(BOOL)mute;

/**
 *  Default Mutes / Unmutes all remote audio.
 *
 *  @param mute true: default Mutes all remote received audio. false: default Unmutes all remote received audio.
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)setDefaultMuteAllRemoteAudioStreams:(BOOL)mute;

#if TARGET_OS_IPHONE
- (int)enableInEarMonitoring:(BOOL)enabled;
/**
 * Set the audio ears back's volume and effect
 * @param [in] volume
 *        set volume of audio ears back, in the range of [0..100], default value is 100
 *
 * @return return 0 if success or an error code
 */
- (int)setInEarMonitoringVolume:(NSInteger)volume;
#endif

/**
 * Change the pitch of local speaker's voice
 * @param [in] pitch
 *        frequency, in the range of [0.5..2.0], default value is 1.0
 *
 * @return return 0 if success or an error code
 */
- (int)setLocalVoicePitch:(double)pitch;

- (int)setLocalVoiceEqualizationOfBandFrequency:(AgoraAudioEqualizationBandFrequency)bandFrequency withGain:(NSInteger)gain;

- (int)setLocalVoiceReverbOfType:(AgoraAudioReverbType)reverbType withValue:(NSInteger)value;

#pragma mark Audio mixing
- (int)startAudioMixing:(NSString *  _Nonnull)filePath
               loopback:(BOOL)loopback
                replace:(BOOL)replace
                  cycle:(NSInteger)cycle;
- (int)stopAudioMixing;
- (int)pauseAudioMixing;
- (int)resumeAudioMixing;
- (int)adjustAudioMixingVolume:(NSInteger)volume;
- (int)getAudioMixingDuration;
- (int)getAudioMixingCurrentPosition;
- (int)setAudioMixingPosition:(NSInteger)pos;

#pragma mark Audio effect
- (double)getEffectsVolume;
- (int)setEffectsVolume:(double)volume;
- (int)setVolumeOfEffect:(int)soundId
               withVolume:(double)volume;
- (int)playEffect:(int)soundId
         filePath:(NSString * _Nullable)filePath
             loop:(BOOL)loop
            pitch:(double)pitch
              pan:(double)pan
             gain:(double)gain;
- (int)stopEffect:(int)soundId;
- (int)stopAllEffects;
- (int)preloadEffect:(int)soundId
            filePath:(NSString * _Nullable) filePath;
- (int)unloadEffect:(int)soundId;
- (int)pauseEffect:(int)soundId;
- (int)pauseAllEffects;
- (int)resumeEffect:(int)soundId;
- (int)resumeAllEffects;

#pragma mark Audio local recording
/**
 *  Start recording conversation to file specified by the file path.
 *
 *  @param filePath file path to save recorded conversation.
 *  @param quality  encode quality for the record file
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)startAudioRecording:(NSString * _Nonnull)filePath
                   quality:(AgoraAudioRecordingQuality)quality;

/**
 *  Stop conversation recording
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)stopAudioRecording;

#pragma mark Audio echo test
/**
 *  Launches an echo test to test if the audio devices (e.g., headset and speaker) and the network connection work properly. In the test, the user speaks first, and the recording will be played back in 10 seconds. If the user can hear what he said in 10 seconds, it indicates that the audio devices and network connection work properly.
 Notes: Must call stopEchoTest to end the test, or won't start new test or join channel.
 *
 *  @param successBlock The callback indicates that the user has successfully joined the specified channel.
 *
 *  @return 0 when executed successfully. return negative value if failed. e.g. ERR_REFUSED (-5)：Failed to launch the echo test, e.g., initialization failed.
 */
- (int)startEchoTest:(void(^ _Nullable)(NSString * _Nonnull channel, NSUInteger uid, NSInteger elapsed))successBlock;

/**
 *  Stop echo test.
 *
 *  @return 0 when executed successfully. return negative value if failed. e.g. ERR_REFUSED(-5)：Failed to stop the echo test. It could be that the echo test is not running.
 */
- (int)stopEchoTest;

#pragma mark Media Source
- (void)setVideoSource:(id<AgoraVideoSourceProtocol> _Nullable)videoSource;
- (id<AgoraVideoSourceProtocol> _Nullable)videoSource;

- (void)setLocalVideoRenderer:(id<AgoraVideoSinkProtocol> _Nullable)videoRenderer;
- (id<AgoraVideoSinkProtocol> _Nullable)localVideoRenderer;

- (void)setRemoteVideoRenderer:(id<AgoraVideoSinkProtocol> _Nullable)videoRenderer forUserId:(NSUInteger)userId;
- (id<AgoraVideoSinkProtocol> _Nullable)remoteVideoRendererOfUserId:(NSUInteger)userId;

#pragma mark External media source
// If external video source is to use, call this API before enableVideo/startPreview
- (void)setExternalVideoSource:(BOOL)enable useTexture:(BOOL)useTexture pushMode:(BOOL)pushMode;
// Push a video frame to SDK
- (BOOL)pushExternalVideoFrame:(AgoraVideoFrame * _Nonnull)frame;

- (void)enableExternalAudioSourceWithSampleRate:(NSUInteger)sampleRate
                               channelsPerFrame:(NSUInteger)channelsPerFrame;
- (void)disableExternalAudioSource;
- (BOOL)pushExternalAudioFrameRawData:(void * _Nonnull)data
                              samples:(NSUInteger)samples
                            timestamp:(NSTimeInterval)timestamp;
- (BOOL)pushExternalAudioFrameSampleBuffer:(CMSampleBufferRef _Nonnull)sampleBuffer;

- (int)setRecordingAudioFrameParametersWithSampleRate:(NSInteger)sampleRate
                                              channel:(NSInteger)channel
                                                 mode:(AgoraAudioRawFrameOperationMode)mode
                                       samplesPerCall:(NSInteger)samplesPerCall;
- (int)setPlaybackAudioFrameParametersWithSampleRate:(NSInteger)sampleRate
                                             channel:(NSInteger)channel
                                                mode:(AgoraAudioRawFrameOperationMode)mode
                                      samplesPerCall:(NSInteger)samplesPerCall;
- (int)setMixedAudioFrameParametersWithSampleRate:(NSInteger)sampleRate
                                   samplesPerCall:(NSInteger)samplesPerCall;

#pragma mark Encryption
/**
 * Specify encryption mode of AES encryption algorithm.
 * @param [in] encryptionMode
 *        encryption mode of AES algorithm, could be one of the following:
 *          "aes-128-xts", "aes-256-xts".
 *          The default value is "aes-128-xts". specify NULL value will use default encryption mode.
 * @return return 0 if success or an error code
 */
- (int)setEncryptionMode:(NSString * _Nullable)encryptionMode;

/**
 * Specifying encryption secret enables built-in AES-128 encryption. Leaving channel will clear the secret specified in last channel
 * @param [in] secret
 *        secret to enable encryption
 * @return return 0 if success or an error code
 */
- (int)setEncryptionSecret:(NSString * _Nullable)secret;

#pragma mark Data channel
- (int)createDataStream:(NSInteger * _Nonnull)streamId
               reliable:(BOOL)reliable
                ordered:(BOOL)ordered;
- (int)sendStreamMessage:(NSInteger)streamId
                    data:(NSData * _Nonnull)data;

#pragma mark Stream publish
- (int)configPublisher:(AgoraPublisherConfiguration * _Nonnull)config;
- (int)setVideoCompositingLayout:(AgoraRtcVideoCompositingLayout * _Nonnull)layout;
- (int)clearVideoCompositingLayout;

#if (!(TARGET_OS_IPHONE) && (TARGET_OS_MAC))
#pragma mark Screen capture
/**
 *  Start screen capture
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)startScreenCapture:(NSUInteger)windowId
          withCaptureFreq:(NSInteger)captureFreq
                  bitRate:(NSInteger)bitRate
                  andRect:(CGRect)rect;

/**
 *  Stop screen capture
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)stopScreenCapture;

/**
 *  Update screen capture Region
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)updateScreenCaptureRegion:(CGRect)rect;

#pragma mark Device test
- (void)monitorDeviceChange:(BOOL)enabled;
- (NSArray<AgoraRtcDeviceInfo *> * _Nullable)enumerateDevices:(AgoraMediaDeviceType)type;
- (NSString * _Nullable)getDeviceId:(AgoraMediaDeviceType)type;
- (int)setDevice:(AgoraMediaDeviceType)type deviceId:(NSString * _Nonnull)deviceId;
- (int)getDeviceVolume:(AgoraMediaDeviceType)type;
- (int)setDeviceVolume:(AgoraMediaDeviceType)type volume:(int)volume;

- (int)startRecordingDeviceTest:(int)indicationInterval;
- (int)stopRecordingDeviceTest;

- (int)startPlaybackDeviceTest:(NSString * _Nonnull)audioFileName;
- (int)stopPlaybackDeviceTest;

- (int)startCaptureDeviceTest:(NSView * _Nonnull)view;
- (int)stopCaptureDeviceTest;
#endif

#pragma mark Server recording
- (int)startRecordingService:(NSString * _Nonnull)recordingKey;
- (int)stopRecordingService:(NSString * _Nonnull)recordingKey;
- (int)refreshRecordingServiceStatus;

#pragma mark Deprecated blocks
- (void)audioVolumeIndicationBlock:(void(^ _Nullable)(NSArray * _Nonnull speakers, NSInteger totalVolume))audioVolumeIndicationBlock __deprecated;
- (void)firstLocalVideoFrameBlock:(void(^ _Nullable)(NSInteger width, NSInteger height, NSInteger elapsed))firstLocalVideoFrameBlock __deprecated;
- (void)firstRemoteVideoDecodedBlock:(void(^ _Nullable)(NSUInteger uid, NSInteger width, NSInteger height, NSInteger elapsed))firstRemoteVideoDecodedBlock __deprecated;
- (void)firstRemoteVideoFrameBlock:(void(^ _Nullable)(NSUInteger uid, NSInteger width, NSInteger height, NSInteger elapsed))firstRemoteVideoFrameBlock __deprecated;
- (void)userJoinedBlock:(void(^ _Nullable)(NSUInteger uid, NSInteger elapsed))userJoinedBlock __deprecated;
- (void)userOfflineBlock:(void(^ _Nullable)(NSUInteger uid))userOfflineBlock __deprecated;
- (void)userMuteAudioBlock:(void(^ _Nullable)(NSUInteger uid, BOOL muted))userMuteAudioBlock __deprecated;
- (void)userMuteVideoBlock:(void(^ _Nullable)(NSUInteger uid, BOOL muted))userMuteVideoBlock __deprecated;
- (void)localVideoStatBlock:(void(^ _Nullable)(NSInteger sentBitrate, NSInteger sentFrameRate))localVideoStatBlock __deprecated;
- (void)remoteVideoStatBlock:(void(^ _Nullable)(NSUInteger uid, NSInteger delay, NSInteger receivedBitrate, NSInteger receivedFrameRate))remoteVideoStatBlock __deprecated;
- (void)cameraReadyBlock:(void(^ _Nullable)())cameraReadyBlock __deprecated;
- (void)connectionLostBlock:(void(^ _Nullable)())connectionLostBlock __deprecated;
- (void)rejoinChannelSuccessBlock:(void(^ _Nullable)(NSString * _Nonnull channel, NSUInteger uid, NSInteger elapsed))rejoinChannelSuccessBlock __deprecated;
- (void)rtcStatsBlock:(void(^ _Nullable)(AgoraChannelStats * _Nonnull stat))rtcStatsBlock __deprecated;
- (void)leaveChannelBlock:(void(^ _Nullable)(AgoraChannelStats * _Nonnull stat))leaveChannelBlock __deprecated;
- (void)audioQualityBlock:(void(^ _Nullable)(NSUInteger uid, AgoraNetworkQuality quality, NSUInteger delay, NSUInteger lost))audioQualityBlock __deprecated;
- (void)networkQualityBlock:(void(^ _Nullable)(NSUInteger uid, AgoraNetworkQuality txQuality, AgoraNetworkQuality rxQuality))networkQualityBlock __deprecated;
- (void)lastmileQualityBlock:(void(^ _Nullable)(AgoraNetworkQuality quality))lastmileQualityBlock __deprecated;
- (void)mediaEngineEventBlock:(void(^ _Nullable)(NSInteger code))mediaEngineEventBlock __deprecated;
@end
