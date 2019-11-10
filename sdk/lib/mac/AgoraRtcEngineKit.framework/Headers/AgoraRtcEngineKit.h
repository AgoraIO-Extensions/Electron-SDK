//
//  AgoraRtcEngineKit.h
//  AgoraRtcEngineKit
//
//  Copyright (c) 2018 Agora. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AgoraConstants.h"
#import "AgoraObjects.h"
#import "AgoraMediaIO.h"
#import "AgoraMediaMetadata.h"

/** Agora provides ensured quality of experience (QoE) for worldwide Internet-based voice and video communications through a virtual global network optimized for real-time web and mobile-to-mobile applications.

 The AgoraRtcEngineKit class is the entry point of the SDK providing API methods for apps to easily start voice and video communication.
 */
@class AgoraRtcEngineKit;
@class AgoraRtcChannel;

/** The AgoraRtcEngineDelegate protocol enables callbacks to your app.

 The SDK uses delegate callbacks in the AgoraRtcEngineDelegate protocol to report runtime events to the app.
 From v1.1, some block callbacks in the SDK are replaced with delegate callbacks. The old block callbacks are therefore deprecated, but can still be used in the current version. However, Agora recommends replacing block callbacks with delegate callbacks. The SDK calls the block callback if a callback is defined in both the block and delegate callbacks.
 */
@protocol AgoraRtcEngineDelegate <NSObject>
@optional

#pragma mark Delegate Methods

/**-----------------------------------------------------------------------------
 * @name Delegate Methods

 The SDK uses delegate callbacks in the AgoraRtcEngineDelegate protocol to report runtime events to the app.
 From v1.1, some block callbacks in the SDK are replaced with delegate callbacks. The old block callbacks are therefore deprecated, but can still be used in the current version. However, Agora recommends replacing block callbacks with delegate callbacks. The SDK calls the block callback if a callback is defined in both the block and delegate callbacks.
 * -----------------------------------------------------------------------------
 */

#pragma mark Core Delegate Methods

/**-----------------------------------------------------------------------------
 * @name Core Delegate Methods
 * -----------------------------------------------------------------------------
 */

/** Reports a warning during SDK runtime.

 In most cases, the app can ignore the warning reported by the SDK because the SDK can usually fix the issue and resume running.

 For instance, the SDK may report an AgoraWarningCodeOpenChannelTimeout(106) warning upon disconnection from the server and attempts to reconnect.

 See [AgoraWarningCode](AgoraWarningCode).

 @param engine      AgoraRtcEngineKit object
 @param warningCode Warning code: AgoraWarningCode
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didOccurWarning:(AgoraWarningCode)warningCode;

/** Reports an error during SDK runtime.

In most cases, the SDK cannot fix the issue and resume running. The SDK requires the app to take action or informs the user about the issue.

For example, the SDK reports an AgoraErrorCodeStartCall = 1002 error when failing to initialize a call. The app informs the user that the call initialization failed and invokes the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method to leave the channel.

See [AgoraErrorCode](AgoraErrorCode).

 @param engine    AgoraRtcEngineKit object
 @param errorCode Error code: AgoraErrorCode
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didOccurError:(AgoraErrorCode)errorCode;

/** Occurs when a method is executed by the SDK.

 @param engine AgoraRtcEngineKit object.
 @param error  The error code (AgoraErrorCode) returned by the SDK when the method call fails. If the SDK returns 0, then the method call succeeds.
 @param api    The method executed by the SDK.
 @param result The result of the method call.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didApiCallExecute:(NSInteger)error api:(NSString * _Nonnull)api result:(NSString * _Nonnull)result;

/** Occurs when the local user joins a specified channel.

 Same as `joinSuccessBlock` in the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method.

 @param engine  AgoraRtcEngineKit object.
 @param channel Channel name.
 @param uid     User ID. If the `uid` is specified in the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method, the specified user ID is returned. If the user ID is not specified when the joinChannel method is called, the server automatically assigns a `uid`.
 @param elapsed Time elapsed (ms) from the user calling the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method until the SDK triggers this callback.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didJoinChannel:(NSString * _Nonnull)channel withUid:(NSUInteger)uid elapsed:(NSInteger) elapsed;

/** Occurs when the local user rejoins a channel.

 If the client loses connection with the server because of network problems, the SDK automatically attempts to reconnect and then triggers this callback upon reconnection, indicating that the user rejoins the channel with the assigned channel ID and user ID.

 @param engine  AgoraRtcEngineKit object.
 @param channel Channel name.
 @param uid     User ID. If the `uid` is specified in the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method, the specified user ID is returned. If the user ID is not specified when the joinChannel method is called, the server automatically assigns a `uid`.
 @param elapsed Time elapsed (ms) from starting to reconnect to a successful reconnection.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didRejoinChannel:(NSString * _Nonnull)channel withUid:(NSUInteger)uid elapsed:(NSInteger) elapsed;

/** Occurs when the local user leaves a channel.

 When the app calls the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method, this callback notifies the app that a user leaves a channel.

 With this callback, the app retrieves information, such as the call duration and the statistics of the received/transmitted data reported by the [audioQualityOfUid]([AgoraRtcEngineDelegate rtcEngine:audioQualityOfUid:quality:delay:lost:]) callback.

 @param engine AgoraRtcEngineKit object.
 @param stats  Statistics of the call: [AgoraChannelStats](AgoraChannelStats).
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didLeaveChannelWithStats:(AgoraChannelStats * _Nonnull)stats;

/** Occurs when the local user successfully registers a user account by calling the [registerLocalUserAccount]([AgoraRtcEngineKit registerLocalUserAccount:appId:]) or [joinChannelByUserAccount]([AgoraRtcEngineKit joinChannelByUserAccount:token:channelId:joinSuccess:]) method.

This callback reports the user ID and user account of the local user.

@param engine AgoraRtcEngineKit object.
@param userAccount The user account of the local user.
@param uid The ID of the local user.
*/
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didRegisteredLocalUser:(NSString * _Nonnull)userAccount withUid:(NSUInteger)uid;

/** Occurs when the SDK gets the user ID and user account of the remote user.

After a remote user joins the channel, the SDK gets the user ID and user account of the remote user, caches them in a mapping table object (`userInfo`), and triggers this callback on the local client.

@param engine AgoraRtcEngineKit object.
@param userInfo The [AgoraUserInfo](AgoraUserInfo) object that contains the user ID and user account of the remote user.
@param uid The ID of the remote user.
*/
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didUpdatedUserInfo:(AgoraUserInfo * _Nonnull)userInfo withUid:(NSUInteger)uid;

/** Occurs when the local user role switches in a live broadcast.

The SDK triggers this callback when the local user switches the user role by calling the [setClientRole]([AgoraRtcEngineKit setClientRole:]) method after joining the channel.

 @param engine  AgoraRtcEngineKit object.
 @param oldRole Role that the user switches from: AgoraClientRole.
 @param newRole Role that the user switches to: AgoraClientRole.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didClientRoleChanged:(AgoraClientRole)oldRole newRole:(AgoraClientRole)newRole;

/** Occurs when a remote user or host joins a channel. Same as [userJoinedBlock]([AgoraRtcEngineKit userJoinedBlock:]).

 - Communication profile: This callback notifies the app that another user joins the channel. If other users are already in the channel, the SDK also reports to the app on the existing users.
 - Live-broadcast profile: This callback notifies the app that a host joins the channel. If other hosts are already in the channel, the SDK also reports to the app on the existing hosts. Agora recommends limiting the number of hosts to 17.

 The SDK triggers this callback under one of the following circumstances:
 - A remote user/host joins the channel by calling the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method.
 - A remote user switches the user role to the host by calling the [setClientRole]([AgoraRtcEngineKit setClientRole:]) method after joining the channel.
 - A remote user/host rejoins the channel after a network interruption.
 - A host injects an online media stream into the channel by calling the [addInjectStreamUrl]([AgoraRtcEngineKit addInjectStreamUrl:config:]) method.

 **Note:**

 Live-broadcast profile:

 * The host receives this callback when another host joins the channel.
 * The audience in the channel receives this callback when a new host joins the channel.
 * When a web application joins the channel, the SDK triggers this callback as long as the web application publishes streams.

 @param engine  AgoraRtcEngineKit object.
 @param uid     ID of the user or host who joins the channel. If the `uid` is specified in the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method, the specified user ID is returned. If the `uid` is not specified in the joinChannelByToken method, the Agora server automatically assigns a `uid`.
 @param elapsed Time elapsed (ms) from the local user calling the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) or [setClientRole]([AgoraRtcEngineKit setClientRole:]) method until the SDK triggers this callback.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didJoinedOfUid:(NSUInteger)uid elapsed:(NSInteger)elapsed;

/** Occurs when a remote user (Communication)/host (Live Broadcast) leaves a channel. Same as [userOfflineBlock]([AgoraRtcEngineKit userOfflineBlock:]).

There are two reasons for users to be offline:

- Leave a channel: When the user/host leaves a channel, the user/host sends a goodbye message. When the message is received, the SDK assumes that the user/host leaves a channel.
- Drop offline: When no data packet of the user or host is received for a certain period of time (20 seconds for the Communication profile, and more for the Live-broadcast profile), the SDK assumes that the user/host drops offline. Unreliable network connections may lead to false detections, so Agora recommends using a signaling system for more reliable offline detection.

 @param engine AgoraRtcEngineKit object.
 @param uid    ID of the user or host who leaves a channel or goes offline.
 @param reason Reason why the user goes offline, see AgoraUserOfflineReason.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didOfflineOfUid:(NSUInteger)uid reason:(AgoraUserOfflineReason)reason;

/** Occurs when the network connection state changes.

The SDK triggers this callback to report on the current network connection state when it changes, and the reason of the change.

@param engine AgoraRtcEngineKit object.
@param state The current network connection state, see AgoraConnectionStateType.
@param reason The reason of the connection state change, see AgoraConnectionChangedReason.
*/
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine connectionChangedToState:(AgoraConnectionStateType)state reason:(AgoraConnectionChangedReason)reason;

/** Occurs when the local network type changes.

When the network connection is interrupted, this callback indicates whether the interruption is caused by a network type change or poor network conditions.

@param engine AgoraRtcEngineKit object.
@param type The network type, see AgoraNetworkType.
*/
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine networkTypeChangedToType:(AgoraNetworkType)type;

/** Occurs when the SDK cannot reconnect to Agora's edge server 10 seconds after its connection to the server is interrupted.

The SDK triggers this callback when it cannot connect to the server 10 seconds after calling the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method, regardless of whether it is in the channel or not.

This callback is different from [rtcEngineConnectionDidInterrupted]([AgoraRtcEngineDelegate rtcEngineConnectionDidInterrupted:]):

- The SDK triggers the [rtcEngineConnectionDidInterrupted]([AgoraRtcEngineDelegate rtcEngineConnectionDidInterrupted:]) callback when it loses connection with the server for more than four seconds after it successfully joins the channel.
- The SDK triggers the [rtcEngineConnectionDidLost]([AgoraRtcEngineDelegate rtcEngineConnectionDidLost:]) callback when it loses connection with the server for more than 10 seconds, regardless of whether it joins the channel or not.

For both callbacks, the SDK tries to reconnect to the server until the app calls the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method.

@param engine AgoraRtcEngineKit object.
 */
- (void)rtcEngineConnectionDidLost:(AgoraRtcEngineKit * _Nonnull)engine;

/** Occurs when the token expires in 30 seconds.

 The user becomes offline if the `token` used in the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method expires. The SDK triggers this callback 30 seconds before the `token` expires to remind the app to get a new `token`.
 Upon receiving this callback, generate a new `token` on the server and call the [renewToken]([AgoraRtcEngineKit renewToken:]) method to pass the new `token` to the SDK.

 @param engine AgoraRtcEngineKit object.
 @param token  The `token` that expires in 30 seconds.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine tokenPrivilegeWillExpire:(NSString *_Nonnull)token;

/** Occurs when the token expires.

 After a `token` is specified by calling the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method, if the SDK losses connection to the Agora server due to network issues, the `token` may expire after a certain period of time and a new `token` may be required to reconnect to the server.

 Th SDK triggers this callback to notify the app to generate a new `token`. Call the [renewToken]([AgoraRtcEngineKit renewToken:]) method to renew the `token`.

 @param engine AgoraRtcEngineKit object.
 */
- (void)rtcEngineRequestToken:(AgoraRtcEngineKit * _Nonnull)engine;


#pragma mark Media Delegate Methods

/**-----------------------------------------------------------------------------
 * @name Media Delegate Methods
 * -----------------------------------------------------------------------------
 */

/** Occurs when the microphone is enabled/disabled.

 **DEPRECATED** from v2.9.0. Use AgoraAudioLocalStateStopped(0) or AgoraAudioLocalStateRecording(1) in the [localAudioStateChange]([AgoraRtcEngineDelegate rtcEngine:localAudioStateChange:error:]) callback instead.

 The SDK triggers this callback when the local user resumes or stops capturing the local audio stream by calling the [enableLocalAudio]([AgoraRtcEngineKit enableLocalAudio:]) method.

 @param engine AgoraRtcEngineKit object.
 @param enabled  Whether the microphone is enabled/disabled:

 * YES: Enabled.
 * NO: Disabled.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didMicrophoneEnabled:(BOOL)enabled;

/** Reports which users are speaking and the speakers' volume at the moment.

 Same as [audioVolumeIndicationBlock]([AgoraRtcEngineKit audioVolumeIndicationBlock:]).

 This callback reports the ID and volume of the loudest speakers at the moment in the channel. The audio volume returned in this callback is the sum of the voice volume and audio-mixing volume of the remote user.

 This callback is disabled by default and can be enabled by the [enableAudioVolumeIndication]([AgoraRtcEngineKit enableAudioVolumeIndication:smooth:]) method.

 The local user and the remote speakers are reported in separate callbacks:

 - In the local user's callback, the `speakers` array contains `uid`= 0 and `volume` = `totalVolume` regardless of whether the local user speaks or not.
 - In the remote speakers' callback, the `speakers` array contains the user ID and volume of each speaker.

**Note:**

- Calling the [muteLocalAudioStream]([AgoraRtcEngineKit muteLocalAudioStream:]) method affects the behavior of the SDK:
    - If the local user calls the [muteLocalAudioStream]([AgoraRtcEngineKit muteLocalAudioStream:]) method, the SDK stops returning the local user's callback immediately.
    - 15 seconds after a remote speaker calls the [muteLocalAudioStream]([AgoraRtcEngineKit muteLocalAudioStream:]) method, the remote speakers' callback excludes information of this user; 15 seconds after all remote users call the [muteLocalAudioStream]([AgoraRtcEngineKit muteLocalAudioStream:]) method, the SDK stops triggering the remote speakers' callback.
- An empty `speakers` array in the callback indicates that no remote user is speaking at the moment.

 @param engine      AgoraRtcEngineKit object.
 @param speakers    An array containing the user ID and volume information for each speaker: AgoraRtcAudioVolumeInfo.

- uid: User ID of the speaker.
- volume: Volume of the speaker. The value ranges between 0 (lowest volume) and 255 (highest volume).

 @param totalVolume Total volume of all speakers. The value ranges between 0 (lowest volume) and 255 (highest volume).
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine reportAudioVolumeIndicationOfSpeakers:(NSArray<AgoraRtcAudioVolumeInfo *> * _Nonnull)speakers totalVolume:(NSInteger)totalVolume;

/** Reports which user is the loudest speaker over a period of time.

This callback reports the speaker with the highest accumulative volume during a certain period.
If the user enables the audio volume indication by calling the [enableAudioVolumeIndication]([AgoraRtcEngineKit enableAudioVolumeIndication:smooth:]) method, this callback returns the user ID of the active speaker whose voice is detected by the audio volume detection module of the SDK.

**Note:**

* To receive this callback, you need to call the [enableAudioVolumeIndication]([AgoraRtcEngineKit enableAudioVolumeIndication:smooth:]) method.
* This callback returns the user ID of the user with the highest voice volume during a period of time, instead of at the moment.
 @param engine     AgoraRtcEngineKit object.
 @param speakerUid The user ID of the active speaker. A `speakerUid` of 0 represents the local user.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine activeSpeaker:(NSUInteger)speakerUid;

/** Occurs when the engine sends the first local audio frame.

 @param engine  AgoraRtcEngineKit object.
 @param elapsed Time elapsed (ms) from the local user calling the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method until the SDK triggers this callback.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine firstLocalAudioFrame:(NSInteger)elapsed;

/** Occurs when the engine receives the first audio frame from a specified remote user.

 This callback is triggered in either of the following scenarios:

 - The remote user joins the channel and sends the audio stream.
 - The remote user stops sending the audio stream and re-sends it after 15 seconds. Possible reasons include:

    - The remote user leaves channel.
    - The remote user drops offline.
    - The remote user calls [muteLocalAudioStream]([AgoraRtcEngineKit muteLocalAudioStream:]).
    - The remote user calls [disableAudio]([AgoraRtcEngineKit disableAudio]).

 @param engine  AgoraRtcEngineKit object.
 @param uid     User ID of the remote user.
 @param elapsed Time elapsed (ms) from the local user calling the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method until the SDK triggers this callback.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine firstRemoteAudioFrameOfUid:(NSUInteger)uid elapsed:(NSInteger)elapsed;

/** Occurs when the SDK decodes the first remote audio frame for playback.

 @param engine AgoraRtcEngineKit object.
 @param uid User ID of the remote user sending the audio stream.
 @param elapsed The time elapsed (ms) from the local user calling the joinChannel method until the SDK triggers this callback.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine firstRemoteAudioFrameDecodedOfUid:(NSUInteger)uid elapsed:(NSInteger)elapsed;

 /** Occurs when the engine sends the first local video frame.

 Same as [firstLocalVideoFrameBlock]([AgoraRtcEngineKit firstLocalVideoFrameBlock:]).
 @param engine  AgoraRtcEngineKit object.
 @param size    Size of the first local video frame (width and height).
 @param elapsed Time elapsed (ms) from the local user calling the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method until the SDK calls this callback.

 If the [startPreview]([AgoraRtcEngineKit startPreview]) method is called before the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method, then `elapsed` is the time elapsed from calling the [startPreview]([AgoraRtcEngineKit startPreview]) method until the SDK triggers this callback.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine firstLocalVideoFrameWithSize:(CGSize)size elapsed:(NSInteger)elapsed;

/** Occurs when the first remote video frame is received and decoded.

 **DEPRECATED** from v2.9.0. Use AgoraVideoRemoteStateStarting(1) or AgoraVideoRemoteStateDecoding(2) in the [remoteVideoStateChangedOfUid]([AgoraRtcEngineDelegate rtcEngine:remoteVideoStateChangedOfUid:state:reason:elapsed:]) callback instead.

 Same as [firstRemoteVideoDecodedBlock]([AgoraRtcEngineKit firstRemoteVideoDecodedBlock:]).

 This callback is triggered in either of the following scenarios:

 - The remote user joins the channel and sends the video stream.
 - The remote user stops sending the video stream and re-sends it after 15 seconds. Possible reasons include:

    - The remote user leaves channel.
    - The remote user drops offline.
    - The remote user calls [muteLocalVideoStream]([AgoraRtcEngineKit muteLocalVideoStream:]).
    - The remote user calls [disableVideo]([AgoraRtcEngineKit disableVideo]).

 @param engine  AgoraRtcEngineKit object.
 @param uid     User ID of the remote user sending the video stream.
 @param size    Size of the video frame (width and height).
 @param elapsed Time elapsed (ms) from the local user calling the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method until the SDK triggers this callback.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine firstRemoteVideoDecodedOfUid:(NSUInteger)uid size:(CGSize)size elapsed:(NSInteger)elapsed;

/** Occurs when the first remote video frame is rendered.

Same as [firstRemoteVideoFrameBlock]([AgoraRtcEngineKit firstRemoteVideoFrameBlock:]).

 @param engine  AgoraRtcEngineKit object.
 @param uid     User ID of the remote user sending the video stream.
 @param size    Size of the video frame (width and height).
 @param elapsed Time elapsed (ms) from the local user calling the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method until the SDK triggers this callback.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine firstRemoteVideoFrameOfUid:(NSUInteger)uid size:(CGSize)size elapsed:(NSInteger)elapsed;

/** Occurs when a remote user's audio stream is muted/unmuted.

 
 The SDK triggers this callback when the remote user stops or resumes sending the audio stream by calling the [muteLocalAudioStream]([AgoraRtcEngineKit muteLocalAudioStream:]) method.

 @note This callback is invalid when the number of the users or broadcasters in a channel exceeds 20.
 @param engine AgoraRtcEngineKit object.
 @param muted  Whether the remote user's audio stream is muted/unmuted:

 * YES: Muted.
 * NO: Unmuted.
 @param uid  ID of the remote user.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didAudioMuted:(BOOL)muted byUid:(NSUInteger)uid;

/** Occurs when a remote user's video stream playback pauses/resumes.

 **DEPRECATED** from v2.9.0. This callback is deprecated and replaced by the [remoteVideoStateChangedOfUid]([AgoraRtcEngineDelegate rtcEngine:remoteVideoStateChangedOfUid:state:reason:elapsed:]) callback with the following parameters: 

 - AgoraVideoRemoteStateStopped(0) and AgoraVideoRemoteStateReasonRemoteMuted(5).
 - AgoraVideoRemoteStateDecoding(2) and AgoraVideoRemoteStateReasonRemoteUnmuted(6).
 
 Same as [userMuteVideoBlock]([AgoraRtcEngineKit userMuteVideoBlock:]).

 The SDK triggers this callback when the remote user stops or resumes sending the video stream by calling the [muteLocalVideoStream]([AgoraRtcEngineKit muteLocalVideoStream:]) method.

 **Note:**

 This callback is invalid when the number of users or broadcasters in a channel exceeds 20.

 @param engine AgoraRtcEngineKit object.
 @param muted  A remote user's video stream playback pauses/resumes:

 * YES: Pause.
 * NO: Resume.

 @param uid    User ID of the remote user.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didVideoMuted:(BOOL)muted byUid:(NSUInteger)uid;

/** Occurs when a specific remote user enables/disables the video module.

 **DEPRECATED** from v2.9.0. This callback is deprecated and replaced by the [remoteVideoStateChangedOfUid]([AgoraRtcEngineDelegate rtcEngine:remoteVideoStateChangedOfUid:state:reason:elapsed:]) callback with the following parameters:

 - AgoraVideoRemoteStateStopped(0) and AgoraVideoRemoteStateReasonRemoteMuted(5).
 - AgoraVideoRemoteStateDecoding(2) and AgoraVideoRemoteStateReasonRemoteUnmuted(6).

 Once the video module is disabled, the remote user can only use a voice call. The remote user cannot send or receive any video from other users.

 The SDK triggers this callback when the remote user enables or disables the video module by calling the [enableVideo](enableVideo) or [disableVideo](disableVideo) method.

 @param engine  AgoraRtcEngineKit object.
 @param enabled Whether the remote user enables/disables the video module:

 * YES: Enable. The remote user can enter a video session.
 * NO: Disable. The remote user can only enter a voice session, and cannot send or receive any video stream.

 @param uid  User ID of the remote user.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didVideoEnabled:(BOOL)enabled byUid:(NSUInteger)uid;

/** Occurs when a specific remote user enables/disables the local video capturing function.

 **DEPRECATED** from v2.9.0. This callback is deprecated and replaced by the [remoteVideoStateChangedOfUid]([AgoraRtcEngineDelegate rtcEngine:remoteVideoStateChangedOfUid:state:reason:elapsed:]) callback with the following parameters:

 - AgoraVideoRemoteStateStopped(0) and AgoraVideoRemoteStateReasonRemoteMuted(5).
 - AgoraVideoRemoteStateDecoding(2) and AgoraVideoRemoteStateReasonRemoteUnmuted(6).

 This callback is only applicable to the scenario when the user only wants to watch the remote video without sending any video stream to the other user.

 @param engine  AgoraRtcEngineKit object.
 @param enabled Whether the specific remote user enables/disables the local video capturing function:

 * YES: Enable. Other users in the channel can see the video of this remote user.
 * NO: Disable. Other users in the channel do not receive the video stream from this remote user, while this remote user can still receive the video streams from other users.

 @param uid  User ID of the remote user.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didLocalVideoEnabled:(BOOL)enabled byUid:(NSUInteger)uid;

/** Occurs when the video size or rotation of a specific remote user changes.

 @param engine   AgoraRtcEngineKit object.
 @param uid      User ID of the remote user or local user (0) whose video size or rotation changes.
 @param size     New video size.
 @param rotation New rotation of the video. The value ranges between 0 and 360.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine videoSizeChangedOfUid:(NSUInteger)uid size:(CGSize)size rotation:(NSInteger)rotation;

/** Occurs when the remote video stream state changes.

 **DEPRECATED**
 This callback is deprecated. Use [remoteVideoStateChangedOfUid]([AgoraRtcEngineDelegate rtcEngine:remoteVideoStateChangedOfUid:state:reason:elapsed:])2 instead.

 This callback is triggered when the time interval between two video frames equals or exceeds 600 ms.

 @param engine AgoraRtcEngineKit object.
 @param uid    ID of the user whose video state changes.
 @param state  State of the remote video: Stopped playing, playing normally, or frozen. See [AgoraVideoRemoteState](AgoraVideoRemoteState).

 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine remoteVideoStateChangedOfUid:(NSUInteger)uid state:(AgoraVideoRemoteState)state;

/** Occurs when the remote video state changes.
 
 @param engine AgoraRtcEngineKit object.
 @param uid ID of the remote user whose video state changes.
 @param state The state of the remote video. See [AgoraVideoRemoteState](AgoraVideoRemoteState).
 @param reason The reason of the remote video state change. See [AgoraVideoRemoteStateReason](AgoraVideoRemoteStateReason).
 @param elapsed The time elapsed (ms) from the local user calling the [joinChannel]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method until the SDK triggers this callback.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine remoteVideoStateChangedOfUid:(NSUInteger)uid state:(AgoraVideoRemoteState)state reason:(AgoraVideoRemoteStateReason)reason elapsed:(NSInteger)elapsed;

/** Occurs when the local video stream state changes.

The SDK reports the current video state in this callback.

 @param engine AgoraRtcEngineKit object.
 @param state The local video state, see AgoraLocalVideoStreamState. When the state is AgoraLocalVideoStreamStateFailed(3), see the `error` parameter for details.
 @param error The detailed error information of the local video, see AgoraLocalVideoStreamError.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine localVideoStateChange:(AgoraLocalVideoStreamState)state error:(AgoraLocalVideoStreamError)error;

/** Occurs when the local audio state changes.

 This callback indicates the state change of the local audio stream, including the state of the audio recording and encoding, and allows you to troubleshoot issues when exceptions occur.
 
 @param engine See AgoraRtcEngineKit.
 @param uid ID of the remote user whose audio state changes.
 @param state  State of the remote audio. See [AgoraAudioRemoteState](AgoraAudioRemoteState).
 @param reason The reason of the remote audio state change. See [AgoraAudioRemoteStateReason](AgoraAudioRemoteStateReason).
 @param elapsed Time elapsed (ms) from the local user calling the [joinChannel]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method until the SDK triggers this callback.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine remoteAudioStateChangedOfUid:(NSUInteger)uid state:(AgoraAudioRemoteState)state reason:(AgoraAudioRemoteStateReason)reason elapsed:(NSInteger)elapsed;

/** Occurs when the local audio state changes.

 This callback indicates the state change of the local audio stream, including the state of the audio recording and encoding, and allows you to troubleshoot issues when exceptions occur.

 @param engine See AgoraRtcEngineKit.
 @param state The state of the local audio. See [AgoraAudioLocalState](AgoraAudioLocalState).
 @param error The error information of the local audio. See [AgoraAudioLocalError](AgoraAudioLocalError).

 @note When the state is AgoraAudioLocalStateFailed(3), see the `error` parameter for details.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine localAudioStateChange:(AgoraAudioLocalState)state error:(AgoraAudioLocalError)error;

#pragma mark Fallback Delegate Methods

/**-----------------------------------------------------------------------------
 * @name Fallback Delegate Methods
 * -----------------------------------------------------------------------------
 */

/** Occurs when the published video stream falls back to an audio-only stream due to unreliable network conditions or switches back to the video when the network conditions improve.

 If you call the [setLocalPublishFallbackOption]([AgoraRtcEngineKit setLocalPublishFallbackOption:]) method and set `option` as AgoraStreamFallbackOptionAudioOnly, the SDK triggers this callback when the published stream falls back to audio-only mode due to unreliable uplink conditions, or when the audio stream switches back to the video when the uplink network condition improves.

 **Note:**

 Once the published stream falls back to audio only, the remote app receives the [userMuteVideoBlock]([AgoraRtcEngineKit userMuteVideoBlock:]) callback.

 @param engine              AgoraRtcEngineKit object.
 @param isFallbackOrRecover Whether the published stream falls back to audio-only or switches back to the video:

 * YES: The published stream falls back to audio-only due to unreliable network conditions.
 * NO: The published stream switches back to the video after the network conditions improve.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didLocalPublishFallbackToAudioOnly:(BOOL)isFallbackOrRecover;

 /** Occurs when the remote video stream falls back to an audio-only stream due to unreliable network conditions or switches back to the video after the network conditions improve.

 If you call [setRemoteSubscribeFallbackOption]([AgoraRtcEngineKit setRemoteSubscribeFallbackOption:]) and set `option` as `AgoraStreamFallbackOptionAudioOnly`, the SDK triggers this callback when the remote media stream falls back to audio only due to unreliable network conditions or switches back to the video after the network condition improves.

 **Note:**

 Once the remote media stream is switched to the low stream due to unreliable network conditions, you can monitor the stream switch between a high stream and low stream in the [remoteVideoStats]([AgoraRtcEngineDelegate rtcEngine:remoteVideoStats:]) callback.

 @param engine              AgoraRtcEngineKit object.
 @param isFallbackOrRecover Whether the remote media stream falls back to audio-only or switches back to the video:

 * YES: The remote media stream falls back to audio-only due to unreliable network conditions.
 * NO: The remote media stream switches back to the video stream after the network conditions improve.
 @param uid                 ID of the remote user sending the stream.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didRemoteSubscribeFallbackToAudioOnly:(BOOL)isFallbackOrRecover byUid:(NSUInteger)uid;


#pragma mark Device Delegate Methods

/**-----------------------------------------------------------------------------
 * @name Device Delegate Methods
 * -----------------------------------------------------------------------------
 */

#if (!(TARGET_OS_IPHONE) && (TARGET_OS_MAC))

/** Occurs when the device state changes. (macOS only.)

 @param engine     AgoraRtcEngineKit object.
 @param deviceId   Device ID.
 @param deviceType Device type: AgoraMediaDeviceType.
 @param state      State of the device:

 * 0: Added.
 * 1: Removed.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine device:(NSString * _Nonnull)deviceId type:(AgoraMediaDeviceType)deviceType stateChanged:(NSInteger) state;

#endif

/** Occurs when the local audio route changes.

The SDK triggers this callback when the local audio route switches to an earpiece, speakerphone, headset, or Bluetooth device.

 @param engine  AgoraRtcEngineKit object.
 @param routing Audio route: AgoraAudioOutputRouting.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didAudioRouteChanged:(AgoraAudioOutputRouting)routing;

#if TARGET_OS_IPHONE

/** Occurs when a camera focus area changes. (iOS only.)

The SDK triggers this callback when the local user changes the camera focus position by calling the [setCameraFocusPositionInPreview](setCameraFocusPositionInPreview:) method.

 @param engine AgoraRtcEngineKit object.
 @param rect   Rectangular area in the camera zoom specifying the focus area.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine cameraFocusDidChangedToRect:(CGRect)rect;
#endif

#if TARGET_OS_IPHONE
/** Occurs when the camera exposure area changes. (iOS only)

The SDK triggers this callback when the local user changes the camera exposure position by calling the [setCameraExposurePosition](setCameraExposurePosition:) method.

@param engine AgoraRtcEngineKit object.
@param rect   Rectangular area in the camera zoom specifying the exposure area.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine cameraExposureDidChangedToRect:(CGRect)rect;
#endif


#pragma mark Statistics Delegate Methods

/**-----------------------------------------------------------------------------
 * @name Statistics Delegate Methods
 * -----------------------------------------------------------------------------
 */

/** Reports the statistics of the current call session once every two seconds.

 Same as [rtcStatsBlock]([AgoraRtcEngineKit rtcStatsBlock:]).

 @param engine AgoraRtcEngineKit object.
 @param stats  RTC engine statistics: [AgoraChannelStats](AgoraChannelStats).
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine reportRtcStats:(AgoraChannelStats * _Nonnull)stats;

/** Reports the last mile network quality of the local user once every two seconds before the user joins a channel.

Last mile refers to the connection between the local device and Agora's edge server. After the app calls the [enableLastmileTest]([AgoraRtcEngineKit enableLastmileTest]) method, the SDK triggers this callback once every two seconds to report the uplink and downlink last mile network conditions of the local user before the user joins the channel.

 @param engine  AgoraRtcEngineKit object.
 @param quality The last mile network quality based on the uplink and dowlink packet loss rate and jitter. See AgoraNetworkQuality.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine lastmileQuality:(AgoraNetworkQuality)quality;

/** Reports the last mile network quality of each user in the channel once every two seconds.

 Last mile refers to the connection between the local device and Agora's edge server. The SDK triggers this callback once every two seconds to report the last mile network conditions of each user in the channel. If a channel includes multiple users, the SDK triggers this callback as many times.

 @param engine    AgoraRtcEngineKit object.
 @param uid       User ID. The network quality of the user with this `uid` is reported. If `uid` is 0, the local network quality is reported.
 @param txQuality Uplink transmission quality of the user in terms of the transmission bitrate, packet loss rate, average RTT (Round-Trip Time), and jitter of the uplink network. `txQuality` is a quality rating helping you understand how well the current uplink network conditions can support the selected AgoraVideoEncoderConfiguration. For example, a 1000-Kbps uplink network may be adequate for video frames with a resolution of 640 &times; 480 and a frame rate of 15 fps in the Live-broadcast profile, but may be inadequate for resolutions higher than 1280 &times; 720. See  AgoraNetworkQuality.
 @param rxQuality Downlink network quality rating of the user in terms of packet loss rate, average RTT, and jitter of the downlink network.  See AgoraNetworkQuality.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine networkQuality:(NSUInteger)uid txQuality:(AgoraNetworkQuality)txQuality rxQuality:(AgoraNetworkQuality)rxQuality;

/** Reports the last-mile network probe result.

The SDK triggers this callback within 30 seconds after the app calls the [startLastmileProbeTest]([AgoraRtcEngineKit startLastmileProbeTest:]) method.

 @param engine AgoraRtcEngineKit object.
 @param result The uplink and downlink last-mile network probe test result, see [AgoraLastmileProbeResult](AgoraLastmileProbeResult).
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine lastmileProbeTestResult:(AgoraLastmileProbeResult * _Nonnull)result;

/** Reports the statistics of the uploading local video streams once every two seconds. Same as [localVideoStatBlock]([AgoraRtcEngineKit localVideoStatBlock:]).

 @param engine AgoraRtcEngineKit object.
 @param stats Statistics of the uploading local video streams. See [AgoraRtcLocalVideoStats](AgoraRtcLocalVideoStats).
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine localVideoStats:(AgoraRtcLocalVideoStats * _Nonnull)stats;

/** Reports the statistics of the local audio stream.
 
 The SDK triggers this callback once every two seconds.
 
 @param engine See AgoraRtcEngineKit.
 @param stats The statistics of the local audio stream. See [AgoraRtcLocalAudioStats](AgoraRtcLocalAudioStats).
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine localAudioStats:(AgoraRtcLocalAudioStats * _Nonnull)stats;

/** Reports the statistics of the video stream from each remote user/host.

The SDK triggers this callback once every two seconds for each remote user/host. If a channel includes multiple remote users, the SDK triggers this callback as many times.

 This callback reports the statistics more closely linked to the real-user experience of the video transmission quality than the statistics that the [videoTransportStatsOfUid]([AgoraRtcEngineDelegate rtcEngine:videoTransportStatsOfUid:delay:lost:rxKBitRate:]) callback reports. This callback reports more about media layer statistics such as the frame loss rate, while the [videoTransportStatsOfUid]([AgoraRtcEngineDelegate rtcEngine:videoTransportStatsOfUid:delay:lost:rxKBitRate:]) callback reports more about the transport layer statistics such as the packet loss rate.

Schemes such as FEC (Forward Error Correction) or retransmission counter the frame loss rate. Hence, users may find the overall video quality acceptable even when the packet loss rate is high.


 @param engine AgoraRtcEngineKit object.
 @param stats  Statistics of the received remote video streams. See [AgoraRtcRemoteVideoStats](AgoraRtcRemoteVideoStats).
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine remoteVideoStats:(AgoraRtcRemoteVideoStats * _Nonnull)stats;

/** Reports the statistics of the audio stream from each remote user/host.

 This callback replaces the [audioQualityOfUid]([AgoraRtcEngineDelegate rtcEngine:audioQualityOfUid:quality:delay:lost:]) callback.

 The SDK triggers this callback once every two seconds for each remote user/host. If a channel includes multiple remote users, the SDK triggers this callback as many times.

 This callback reports the statistics more closely linked to the real-user experience of the audio transmission quality than the statistics that the [audioTransportStatsOfUid]([AgoraRtcEngineDelegate rtcEngine:audioTransportStatsOfUid:delay:lost:rxKBitRate:]) callback reports. This callback reports more about media layer statistics such as the frame loss rate, while the [audioTransportStatsOfUid]([AgoraRtcEngineDelegate rtcEngine:audioTransportStatsOfUid:delay:lost:rxKBitRate:]) callback reports more about the transport layer statistics such as the packet loss rate.

Schemes such as FEC (Forward Error Correction) or retransmission counter the frame loss rate. Hence, users may find the overall audio quality acceptable even when the packet loss rate is high.

 @param engine AgoraRtcEngineKit object.
 @param stats  Statistics of the received remote audio streams. See AgoraRtcRemoteAudioStats.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine remoteAudioStats:(AgoraRtcRemoteAudioStats * _Nonnull)stats;

/** Reports the transport-layer statistics of each remote audio stream.

 **DEPRECATED** from v2.9.0. Use the [remoteVideoStateChangedOfUid]([AgoraRtcEngineDelegate rtcEngine:remoteVideoStateChangedOfUid:state:reason:elapsed:]) callback instead.

 This callback reports the transport-layer statistics, such as the packet loss rate and network time delay, once every two seconds after the local user receives an audio packet from a remote user.

 @param engine     AgoraRtcEngineKit object.
 @param uid        User ID of the remote user sending the audio packet.
 @param delay      Network time delay (ms) from the remote user sending the audio packet to the local user.
 @param lost       Packet loss rate (%) of the audio packet sent from the remote user.
 @param rxKBitRate Received bitrate (Kbps) of the audio packet sent from the remote user.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine audioTransportStatsOfUid:(NSUInteger)uid delay:(NSUInteger)delay lost:(NSUInteger)lost rxKBitRate:(NSUInteger)rxKBitRate;

/** Reports the transport-layer statistics of each remote video stream.

 **DEPRECATED** from v2.9.0. Use the [remoteVideoStateChangedOfUid]([AgoraRtcEngineDelegate rtcEngine:remoteVideoStateChangedOfUid:state:reason:elapsed:]) callback instead.

 This callback reports the transport layer statistics, such as the packet loss rate and network time delay, once every two seconds after the local user receives a video packet from a remote user.

 @param engine     AgoraRtcEngineKit object.
 @param uid        User ID of the remote user sending the video packet.
 @param delay      Network time delay (ms) from the remote user sending the video packet to the local user.
 @param lost       Packet loss rate (%) of the video packet sent from the remote user.
 @param rxKBitRate Received bitrate (Kbps) of the video packet sent from the remote user.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine videoTransportStatsOfUid:(NSUInteger)uid delay:(NSUInteger)delay lost:(NSUInteger)lost rxKBitRate:(NSUInteger)rxKBitRate;


#pragma mark Audio Player Delegate Methods

/**-----------------------------------------------------------------------------
 * @name Audio Player Delegate Methods
 * -----------------------------------------------------------------------------
 */

/** Occurs when the audio mixing file playback finishes.

You can start an audio mixing file playback by calling the [startAudioMixing]([AgoraRtcEngineKit startAudioMixing:loopback:replace:cycle:]) method. The SDK triggers this callback when the audio mixing file playback finishes.

 If the [startAudioMixing]([AgoraRtcEngineKit startAudioMixing:loopback:replace:cycle:]) method call fails, a warning code, AgoraWarningCodeAudioMixingOpenError, returns in the [didOccurWarning]([AgoraRtcEngineDelegate rtcEngine:didOccurWarning:]) callback.

 @param engine AgoraRtcEngineKit object.
 */
- (void)rtcEngineLocalAudioMixingDidFinish:(AgoraRtcEngineKit * _Nonnull)engine;

/** Occurs when the state of the local user's audio mixing file changes.

- When the audio mixing file plays, pauses playing, or stops playing, this callback returns 710, 711, or 713  in state, and 0 in `errorCode`.
- When exceptions occur during playback, this callback returns 714 in `state` and an error in `errorCode`.
- If the local audio mixing file does not exist, or if the SDK does not support the file format or cannot access the music file URL, the SDK returns `AgoraWarningCodeAudioMixingOpenError = 701`.

@param engine AgoraRtcEngineKit object.
@param state The state code, see AgoraAudioMixingStateCode.
@param errorCode The error code, see AgoraAudioMixingErrorCode.
*/
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine localAudioMixingStateDidChanged:(AgoraAudioMixingStateCode)state errorCode:(AgoraAudioMixingErrorCode)errorCode;

/** Occurs when a remote user starts audio mixing.

 The SDK triggers this callback when a remote user calls the [startAudioMixing]([AgoraRtcEngineKit startAudioMixing:loopback:replace:cycle:]) method.

 @param engine AgoraRtcEngineKit object.
 */
- (void)rtcEngineRemoteAudioMixingDidStart:(AgoraRtcEngineKit * _Nonnull)engine;

/** Occurs when a remote user finishes audio mixing.

 @param engine AgoraRtcEngineKit object.
 */
- (void)rtcEngineRemoteAudioMixingDidFinish:(AgoraRtcEngineKit * _Nonnull)engine;

/** Occurs when the local audio effect playback finishes.

 You can start a local audio effect playback by calling the [playEffect]([AgoraRtcEngineKit playEffect:filePath:loopCount:pitch:pan:gain:publish:]) method. The SDK triggers this callback when the local audio effect file playback finishes.

 @param engine  AgoraRtcEngineKit object.
 @param soundId ID of the local audio effect. Each local audio effect has a unique ID.
 */
- (void)rtcEngineDidAudioEffectFinish:(AgoraRtcEngineKit * _Nonnull)engine soundId:(NSInteger)soundId;

#pragma mark CDN Publisher Delegate Methods

/**-----------------------------------------------------------------------------
 * @name CDN Live Streaming Delegate Methods
 * -----------------------------------------------------------------------------
 */

/** Occurs when the state of the RTMP streaming changes.

The SDK triggers this callback to report the result of the local user calling the [addPublishStreamUrl](addPublishStreamUrl:transcodingEnabled:) or [removePublishStreamUrl](removePublishStreamUrl:) method.

This callback returns the URL and its current streaming state.

This callback indicates the state of the RTMP streaming. When exceptions occur, you can troubleshoot issues by referring to the detailed error descriptions in the `errorCode` parameter.

@param engine AgoraRtcEngineKit object.
@param url The RTMP URL address.
@param state The RTMP streaming state: AgoraRtmpStreamingState. When the streaming state is AgoraRtmpStreamingStateFailure(4), see the `errorCode` parameter for details.
@param errorCode The detailed error information for streaming: AgoraRtmpStreamingErrorCode.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine rtmpStreamingChangedToState:(NSString * _Nonnull)url state:(AgoraRtmpStreamingState)state errorCode:(AgoraRtmpStreamingErrorCode)errorCode;

/** Reports the result of calling the [addPublishStreamUrl]([AgoraRtcEngineKit addPublishStreamUrl:transcodingEnabled:]) method.

 @param engine    AgoraRtcEngineKit object.
 @param url       The RTMP URL address.
 @param errorCode Error code: [AgoraErrorCode](AgoraErrorCode). Main errors include:

 - AgoraErrorCodeNoError(0): The publishing succeeds.
 - AgoraErrorCodeFailed(1): The publishing fails.
 - AgoraErrorCodeInvalidArgument(2): Invalid argument used. If, for example, you do not call the [setLiveTranscoding]([AgoraRtcEngineKit setLiveTranscoding:]) method to configure AgoraLiveTranscoding before calling the [addPublishStreamUrl]([AgoraRtcEngineKit addPublishStreamUrl:transcodingEnabled:]) method, the SDK reports this error.
 - AgoraErrorCodeTimedOut(10): The publishing times out.
 - AgoraErrorCodeAlreadyInUse(19): The RTMP URL address is already in use for CDN live streaming.
 - AgoraErrorCodeAbort(20): The SDK disconnects from the CDN live streaming server, and the CDN live streaming stops.
 - AgoraErrorCodeResourceLimited(22): The backend system does not have enough resources for the CDN live streaming.
 - AgoraErrorCodeEncryptedStreamNotAllowedPublish(130): You cannot publish an encrypted stream.
 - AgoraErrorCodePublishStreamCDNError(151): CDN related errors. Remove the original URL address and add a new one by calling the [removePublishStreamUrl]([AgoraRtcEngineKit removePublishStreamUrl:]) and [addPublishStreamUrl]([AgoraRtcEngineKit addPublishStreamUrl:transcodingEnabled:]) methods.
 - AgoraErrorCodePublishStreamNumReachLimit(152): The host publishes more than 10 URLs. Delete the unnecessary URLs before adding new ones.
 - AgoraErrorCodePublishStreamNotAuthorized(153): The host manipulates other hosts' URLs. Check your app logic.
 - AgoraErrorCodePublishStreamInternalServerError(154): An error occurs in Agora's streaming server. Call the [addPublishStreamUrl]([AgoraRtcEngineKit addPublishStreamUrl:transcodingEnabled:]) method to publish the streaming again.
 - AgoraErrorCodePublishStreamFormatNotSuppported(156): The format of the RTMP stream URL is not supported. Check whether the URL format is correct.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine streamPublishedWithUrl:(NSString * _Nonnull)url errorCode:(AgoraErrorCode)errorCode;

/** Reports the result of calling the [removePublishStreamUrl]([AgoraRtcEngineKit removePublishStreamUrl:]) method.

This callback indicates whether you have successfully removed an RTMP stream from the CDN.

 @param engine AgoraRtcEngineKit object.
 @param url    The RTMP URL address.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine streamUnpublishedWithUrl:(NSString * _Nonnull)url;

/** Occurs when the CDN live streaming settings are updated.

 @param engine AgoraRtcEngineKit object.
 */
- (void)rtcEngineTranscodingUpdated:(AgoraRtcEngineKit * _Nonnull)engine;


#pragma mark Inject Stream URL Delegate Methods

/**-----------------------------------------------------------------------------
 * @name Inject Online Stream Delegate Methods
 * -----------------------------------------------------------------------------
 */

/** Reports the status of injecting an online stream to a live broadcast.

@param engine  AgoraRtcEngineKit object.
@param url     URL address of the externally injected stream.
@param uid     User ID.
@param status  Status of the externally injected stream. See AgoraInjectStreamStatus.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine streamInjectedStatusOfUrl:(NSString * _Nonnull)url uid:(NSUInteger)uid status:(AgoraInjectStreamStatus)status;

#pragma mark Stream Message Delegate Methods

/**-----------------------------------------------------------------------------
 * @name Stream Message Delegate Methods
 * -----------------------------------------------------------------------------
 */

/** Occurs when the local user receives the data stream from a remote user within five seconds.

The SDK triggers this callback when the local user receives the stream message that the remote user sends by calling the [sendStreamMessage](sendStreamMessage:data:) method.

 @param engine   AgoraRtcEngineKit object.
 @param uid      User ID of the remote user sending the message.
 @param streamId Stream ID.
 @param data     Data received by the local user.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine receiveStreamMessageFromUid:(NSUInteger)uid streamId:(NSInteger)streamId data:(NSData * _Nonnull)data;

/** Occurs when the local user does not receive the data stream from the remote user within five seconds.

 The SDK triggers this callback when the local user fails to receive the stream message that the remote user sends by calling the [sendStreamMessage](sendStreamMessage:data:) method.

 @param engine   AgoraRtcEngineKit object.
 @param uid      User ID of the remote user sending the message.
 @param streamId Stream ID.
 @param error    Error code. See AgoraErrorCode.
 @param missed Number of lost messages.
 @param cached Number of incoming cached messages when the data stream is interrupted.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didOccurStreamMessageErrorFromUid:(NSUInteger)uid streamId:(NSInteger)streamId error:(NSInteger)error missed:(NSInteger)missed cached:(NSInteger)cached;


#pragma mark Miscellaneous Delegate Methods

/**-----------------------------------------------------------------------------
 * @name Miscellaneous Delegate Methods
 * -----------------------------------------------------------------------------
 */

/** Occurs when the media engine loads.

 @param engine AgoraRtcEngineKit object.
 */
- (void)rtcEngineMediaEngineDidLoaded:(AgoraRtcEngineKit * _Nonnull)engine;

/** Occurs when the media engine call starts.

 @param engine AgoraRtcEngineKit object.
 */
- (void)rtcEngineMediaEngineDidStartCall:(AgoraRtcEngineKit * _Nonnull)engine;


#pragma mark Deprecated Delegates

/**-----------------------------------------------------------------------------
 * @name Deprecated Delegates
 * -----------------------------------------------------------------------------
 */

/** Occurs when the connection between the SDK and the server is interrupted.

**DEPRECATED** from v2.3.2. Use the [connectionChangedToState]([AgoraRtcEngineDelegate rtcEngine:connectionChangedToState:reason:]) callback instead.

The SDK triggers this callback when it loses connection with the server for more than four seconds after a connection is established.

After triggering this callback, the SDK tries reconnecting to the server. You can use this callback to implement pop-up reminders.

This callback is different from [rtcEngineConnectionDidLost]([AgoraRtcEngineDelegate rtcEngineConnectionDidLost:]):

- The SDK triggers the [rtcEngineConnectionDidInterrupted]([AgoraRtcEngineDelegate rtcEngineConnectionDidInterrupted:]) callback when it loses connection with the server for more than four seconds after it joins the channel.
- The SDK triggers the [rtcEngineConnectionDidLost]([AgoraRtcEngineDelegate rtcEngineConnectionDidLost:]) callback when it loses connection with the server for more than 10 seconds, regardless of whether it joins the channel or not.

Whichever callback the SDK triggers, it tries reconnecting to the server until the app calls the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method.
 @param engine AgoraRtcEngineKit object.
 */
- (void)rtcEngineConnectionDidInterrupted:(AgoraRtcEngineKit * _Nonnull)engine;

/** Occurs when your connection is banned by the Agora server.

**DEPRECATED** from v2.3.2. Use [connectionChangedToState]([AgoraRtcEngineDelegate rtcEngine:connectionChangedToState:reason:]) instead.

@param engine AgoraRtcEngineKit object
 */
- (void)rtcEngineConnectionDidBanned:(AgoraRtcEngineKit * _Nonnull)engine;

/** Reports the audio quality of the remote user.

Same as [audioQualityBlock]([AgoraRtcEngineKit audioQualityBlock:]).

**DEPRECATED** from v2.3.2. Use [remoteAudioStats]([AgoraRtcEngineDelegate rtcEngine:remoteAudioStats:]) instead.

The SDK triggers this callback once every two seconds. This callback reports the audio quality of each remote user/host sending an audio stream. If a channel has multiple users/hosts sending audio streams, then the SDK triggers this callback as many times.

 @see [remoteAudioStats]([AgoraRtcEngineDelegate rtcEngine:remoteAudioStats:])
 @param engine  AgoraRtcEngineKit object.
 @param uid     User ID of the speaker.
 @param quality Audio quality of the user, see AgoraNetworkQuality.
 @param delay   Time delay (ms) of the audio packet sent from the sender to the receiver, including the time delay from audio sampling pre-processing, transmission, and the jitter buffer.
 @param lost    Packet loss rate (%) of the audio packet sent from the sender to the receiver.
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine audioQualityOfUid:(NSUInteger)uid quality:(AgoraNetworkQuality)quality delay:(NSUInteger)delay lost:(NSUInteger)lost;

/** Occurs when the camera turns on and is ready to capture video.

**DEPRECATED** from v2.4.1. Use AgoraLocalVideoStreamStateCapturing(1) in the `state` parameter of [localVideoStateChange]([AgoraRtcEngineDelegate rtcEngine:localVideoStateChange:error:]) instead.

 Same as [cameraReadyBlock]([AgoraRtcEngineKit cameraReadyBlock:]).

 @see [localVideoStateChange]([AgoraRtcEngineDelegate rtcEngine:localVideoStateChange:error:])
 @param engine AgoraRtcEngineKit object.
 */
- (void)rtcEngineCameraDidReady:(AgoraRtcEngineKit * _Nonnull)engine;

/** Occurs when the video stops playing.

**DEPRECATED** from v2.4.1. Use AgoraLocalVideoStreamStateStopped(0) in the `state` parameter of [localVideoStateChange]([AgoraRtcEngineDelegate rtcEngine:localVideoStateChange:error:]) instead

 The app can use this callback to change the configuration of the view (for example, to display other screens in the view) after the video stops.

 @see [localVideoStateChange]([AgoraRtcEngineDelegate rtcEngine:localVideoStateChange:error:])
 @param engine AgoraRtcEngineKit object.
 */
- (void)rtcEngineVideoDidStop:(AgoraRtcEngineKit * _Nonnull)engine;

/** Occurs when the state of the media stream relay changes.

 The SDK reports the state of the current media relay and possible error messages in this callback.
 
 @param engine AgoraRtcEngineKit object.
 @param state The state code in [AgoraChannelMediaRelayState](AgoraChannelMediaRelayState).
 @param error The error code in [AgoraChannelMediaRelayError](AgoraChannelMediaRelayError).
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine channelMediaRelayStateDidChange:(AgoraChannelMediaRelayState)state error:(AgoraChannelMediaRelayError)error;

/** Reports events during the media stream relay.
 
 @param engine AgoraRtcEngineKit object.
 @param event The event code in [AgoraChannelMediaRelayEvent](AgoraChannelMediaRelayEvent).
 */
- (void)rtcEngine:(AgoraRtcEngineKit * _Nonnull)engine didReceiveChannelMediaRelayEvent:(AgoraChannelMediaRelayEvent)event;


@end

#pragma mark - AgoraRtcEngineKit

/** The AgoraRtcEngineKit class provides all methods invoked by your app.

 Agora provides ensured quality of experience (QoE) for worldwide Internet-based voice and video communications through a virtual global network optimized for real-time web and mobile-to-mobile apps.

 AgoraRtcEngineKit is the basic interface class of the SDK. Creating an AgoraRtcEngineKit object and then calling the methods of this object enables the use of the SDK’s communication functionality.
*/
__attribute__((visibility("default"))) @interface AgoraRtcEngineKit : NSObject

#pragma mark Core Service

/**-----------------------------------------------------------------------------
 * @name Core Service
 * -----------------------------------------------------------------------------
 */

/** Initializes the AgoraRtcEngineKit object.

 Call this method to initialize the service before using AgoraRtcEngineKit.
 @note Ensure that you call this method before calling any other API.
 @warning Only users with the same App ID can call each other.
 @warning One AgoraRtcEngineKit can use only one App ID. If you need to change the App ID, call [destroy](destroy) to release the current instance first, and then call this method to create a new instance.
 @param appId    App ID issued to you by Agora. Apply for a new one from Agora if it is missing in your kit. Each project is assigned a unique App ID. The App ID identifies your project and organization in the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method to access the Agora Global Network, and enable one-to-one or one-to-more communication or live-broadcast sessions using a unique channel name for your App ID.
 @param delegate AgoraRtcEngineDelegate.

 @return An object of the AgoraRtcEngineKit class.
 */
+ (instancetype _Nonnull)sharedEngineWithAppId:(NSString * _Nonnull)appId
                                      delegate:(id<AgoraRtcEngineDelegate> _Nullable)delegate;

/** Destroys the RtcEngine instance and releases all resources used by the SDK.

 This method is useful for apps that occasionally make voice or video calls, to free up resources for other operations when not making calls.

 Once the app calls this method to release the created RtcEngine instance, no other methods in the SDK can be used and no callbacks can occur. To start communications again, initialize [sharedEngineWithappId]([AgoraRtcEngineKit sharedEngineWithAppId:delegate:]) to establish a new AgoraRtcEngineKit instance.

 **Note:**

 - Call this method in the subthread.
 - This method call is synchronous. The result returns after the AgoraRtcEngineKit object resources are released. The app should not call this interface in the callback generated by the SDK. Otherwise, the SDK must wait for the callback to return before it can reclaim the related object resources, causing a deadlock.
 */
+ (void)destroy;

/** Sets the channel profile.

The SDK needs to know the application scenario to set the appropriate channel profile to apply different optimization methods.

The Agora Native SDK supports the following channel profiles:

- Communication
- Live Broadcast
- Gaming (for the Agora Gaming SDK only)

**Note:**

* Users in the same channel must use the same channel profile.
* Before calling this method to set a new channel profile, [destroy](destroy) the current engine and create a new engine using [sharedEngineWithAppId](AgoraRtcEngine sharedEngineWithAppId).
* Call this method before a user [joins a channel](joinChannelByToken:channelId:info:uid:joinSuccess:) because you cannot configure the channel profile when the channel is in use.
* In the Communication profile, the SDK supports encoding only in raw data, not in texture.

 @param profile Channel profile: [AgoraChannelProfile](AgoraChannelProfile).

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setChannelProfile:(AgoraChannelProfile)profile;

/** Sets the role of a user.

This method is applicable only to the Live-broadcast profile.

Sets the role of a user, such as a host or an audience (default), before joining a channel.

This method can be used to switch the user role after a user joins a channel.

When a user switches user roles after joining a channel, a successful method call triggers the following callback:

- The local client: [didClientRoleChanged]([AgoraRtcEngineDelegate rtcEngine:didClientRoleChanged:newRole:])
- Remote clients: [didJoinedOfUid]([AgoraRtcEngineDelegate rtcEngine:didJoinedOfUid:elapsed:]) or [didOfflineOfUid(AgoraUserOfflineReasonBecomeAudience)]([AgoraRtcEngineDelegate rtcEngine:didOfflineOfUid:reason:])

 @param role Role of the client: AgoraClientRole.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setClientRole:(AgoraClientRole)role;

/** Allows a user to join a channel.

Users in the same channel can talk to each other, and multiple users in the same channel can start a group chat. Users with different App IDs cannot call each other even if they join the same channel.

You must call the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method to exit the current call before entering another channel. This method call is asynchronous; therefore, you can call this method in the main user interface thread.

The SDK uses the iOS's AVAudioSession shared object for audio recording and playback. Using this object may affect the SDK’s audio functions.

If the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method call succeeds, the SDK triggers`joinSuccessBlock`. If you implement both `joinSuccessBlock` and [didJoinChannel]([AgoraRtcEngineDelegate rtcEngine:didJoinChannel:withUid:elapsed:]), `joinSuccessBlock` takes higher priority than [didJoinChannel]([AgoraRtcEngineDelegate rtcEngine:didJoinChannel:withUid:elapsed:]).

We recommend you set `joinSuccessBlock` as nil to use [didJoinChannel]([AgoraRtcEngineDelegate rtcEngine:didJoinChannel:withUid:elapsed:]).

A successful joinChannel method call triggers the following callbacks:

- The local client: [didJoinChannel]([AgoraRtcEngineDelegate rtcEngine:didJoinChannel:withUid:elapsed:])
- The remote client: [didJoinedOfUid]([AgoraRtcEngineDelegate rtcEngine:didJoinedOfUid:elapsed:]), if the user joining the channel is in the Communication profile, or is a BROADCASTER in the Live Broadcast profile.

When the connection between the client and Agora's server is interrupted due to poor network conditions, the SDK tries reconnecting to the server. When the local client successfully rejoins the channel, the SDK triggers the [didRejoinChannel]([AgoraRtcEngineDelegate rtcEngine:didRejoinChannel:withUid:elapsed:]) callback on the local client.

**Note:**

- A channel does not accept duplicate UIDs, such as two users with the same `uid`. If you set `uid` as 0, the system automatically assigns a `uid`. If you want to join the same channel on different devices, ensure that different uids are used for each device.
- When joining a channel, the SDK calls `setCategory(AVAudioSessionCategoryPlayAndRecord)` to set `AVAudioSession` to `PlayAndRecord` mode. When `AVAudioSession` is set to `PlayAndRecord` mode, the sound played (for example a ringtone) is interrupted. The app should not set `AVAudioSession` to any other mode.

 @param token A `token` generated by the app server. In most circumstances, the static App ID suffices. For added security, use a `token`.

 * If the user uses a static App ID, `token` is optional and can be set as nil.
 * If the user uses a `token`, Agora issues an additional App Certificate for you to generate a token based on the algorithm and App Certificate for user authentication on the server.
 * Ensure that the App ID used for creating the `token` is the same App ID used by [sharedEngineWithappId]([AgoraRtcEngineKit sharedEngineWithAppId:delegate:]) for initializing the RTC engine. Otherwise, the CDN live streaming may fail.

 @param channelId Unique channel name for the AgoraRTC session in the string format. The string length must be less than 64 bytes.
 Supported character scopes are:

 * The 26 lowercase English letters: a to z
 * The 26 uppercase English letters: A to Z
 * The 10 numbers: 0 to 9
 * The space
 * "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","

@param info (Optional) Additional information about the channel. This parameter can be set to nil or contain channel related information. Other users in the channel do not receive this message.
@param uid User ID. A 32-bit unsigned integer with a value ranging from 1 to (2<sup>32</sup>-1). The `uid` must be unique. If a `uid` is not assigned (or set to 0), the SDK assigns and returns a `uid` in `joinSuccessBlock`. Your app must record and maintain the returned `uid` since the SDK does not do so.
@param joinSuccessBlock Returns that the user joins the specified channel. Same as [didJoinChannel]([AgoraRtcEngineDelegate rtcEngine:didJoinChannel:withUid:elapsed:]). If `joinSuccessBlock` is nil, the SDK triggers the [didJoinChannel]([AgoraRtcEngineDelegate rtcEngine:didJoinChannel:withUid:elapsed:]) callback.

@return * 0: Success.
* < 0: Failure.
*/
- (int)joinChannelByToken:(NSString * _Nullable)token
                channelId:(NSString * _Nonnull)channelId
                     info:(NSString * _Nullable)info
                      uid:(NSUInteger)uid
              joinSuccess:(void(^ _Nullable)(NSString * _Nonnull channel, NSUInteger uid, NSInteger elapsed))joinSuccessBlock;

/** Joins the channel with a user account.

After the user successfully joins the channel, the SDK triggers the following callbacks:

- On the local client: [didRegisteredLocalUser]([AgoraRtcEngineDelegate rtcEngine:didRegisteredLocalUser:withUid:]) and [didJoinChannel]([AgoraRtcEngineDelegate rtcEngine:didJoinChannel:withUid:elapsed:]).
- On the remote client: [didJoinedOfUid]([AgoraRtcEngineDelegate rtcEngine:didJoinedOfUid:elapsed:]) and [didUpdatedUserInfo]([AgoraRtcEngineDelegate rtcEngine:didUpdatedUserInfo:withUid:]), if the user joining the channel is in the Communication profile, or is a BROADCASTER in the Live Broadcast profile.

@note To ensure smooth communication, use the same parameter type to identify the user. For example, if a user joins the channel with a user ID, then ensure all the other users use the user ID too. The same applies to the user account. If a user joins the channel with the Agora Web SDK, ensure that the uid of the user is set to the same parameter type.

@param userAccount The user account. The maximum length of this parameter is 255 bytes. Ensure that you set this parameter and do not set it as null. Supported character scopes are:

- The 26 lowercase English letters: a to z.
- The 26 uppercase English letters: A to Z.
- The 10 numbers: 0 to 9.
- The space.
- "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
@param token The token generated at your server:

- For low-security requirements: You can use the temporary token generated at Dashboard. For details, see [Get a temporary token](https://docs.agora.io/en/Voice/token?platform=All%20Platforms#get-a-temporary-token).
- For high-security requirements: Set it as the token generated at your server. For details, see [Get a token](https://docs.agora.io/en/Voice/token?platform=All%20Platforms#get-a-token).
@param channelId The channel name. The maximum length of this parameter is 64 bytes. Supported character scopes are:

- The 26 lowercase English letters: a to z.
- The 26 uppercase English letters: A to Z.
- The 10 numbers: 0 to 9.
- The space.
- "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
@param joinSuccessBlock Returns that the user joins the specified channel. Same as [didJoinChannel]([AgoraRtcEngineDelegate rtcEngine:didJoinChannel:withUid:elapsed:]). If `joinSuccessBlock` is nil, the SDK triggers the [didJoinChannel]([AgoraRtcEngineDelegate rtcEngine:didJoinChannel:withUid:elapsed:]) callback.

@return * 0: Success.
* < 0: Failure.
*/
- (int)joinChannelByUserAccount:(NSString * _Nonnull)userAccount
                          token:(NSString * _Nullable)token
                      channelId:(NSString * _Nonnull)channelId
                    joinSuccess:(void(^ _Nullable)(NSString * _Nonnull channel, NSUInteger uid, NSInteger elapsed))joinSuccessBlock;

/** Registers a user account.

Once registered, the user account can be used to identify the local user when the user joins the channel. After the user successfully registers a user account,  the SDK triggers the [didRegisteredLocalUser]([AgoraRtcEngineDelegate rtcEngine:didRegisteredLocalUser:withUid:]) callback on the local client, reporting the user ID and user account of the local user.

To join a channel with a user account, you can choose either of the following:

- Call the [registerLocalUserAccount]([AgoraRtcEngineKit registerLocalUserAccount:appId:]) method to create a user account, and then the [joinChannelByUserAccount]([AgoraRtcEngineKit joinChannelByUserAccount:token:channelId:joinSuccess:]) method to join the channel.
- Call the [joinChannelByUserAccount]([AgoraRtcEngineKit joinChannelByUserAccount:token:channelId:joinSuccess:]) method to join the channel.

The difference between the two is that for the former, the time elapsed between calling the [joinChannelByUserAccount]([AgoraRtcEngineKit joinChannelByUserAccount:token:channelId:joinSuccess:]) method and joining the channel is shorter than the latter.

**Note:**

- Ensure that you set the `userAccount` parameter. Otherwise, this method does not take effect.
- Ensure that the value of the `userAccount` parameter is unique in the channel.
- To ensure smooth communication, use the same parameter type to identify the user. For example, if a user joins the channel with a user ID, then ensure that all the other users use the user ID too. The same applies to the user account. If a user joins the channel with the Agora Web SDK, ensure that the `uid` of the user is set to the same parameter type.

@param userAccount The user account. The maximum length of this parameter is 255 bytes. Ensure that you set this parameter and do not set it as null. Supported character scopes are:

- The 26 lowercase English letters: a to z.
- The 26 uppercase English letters: A to Z.
- The 10 numbers: 0 to 9.
- The space.
- "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
@param appId The App ID of your project.

@return * 0: Success.
* < 0: Failure.
*/
- (int)registerLocalUserAccount:(NSString * _Nonnull)userAccount
                          appId:(NSString * _Nonnull)appId;

/** Gets the user information by passing in the user account.

After a remote user joins the channel, the SDK gets the user ID and user account of the remote user, caches them in a mapping table object (`AgoraUserInfo`), and triggers the [didUpdatedUserInfo]([AgoraRtcEngineDelegate rtcEngine:didUpdatedUserInfo:withUid:]) callback on the local client.

After receiving the [didUpdatedUserInfo]([AgoraRtcEngineDelegate rtcEngine:didUpdatedUserInfo:withUid:]) callback, you can call this method to get the user ID of the remote user from the `userInfo` object by passing in the user account.

@param userAccount The user account of the user. Ensure that you set this parameter.
@param error The pointer to [AgoraErrorCode](AgoraErrorCode). It can be set as nil.

@return An [AgoraUserInfo](AgoraUserInfo) object that contains the user account and user ID of the user.
*/
- (AgoraUserInfo* _Nullable)getUserInfoByUserAccount:(NSString * _Nonnull)userAccount
                                           withError:(AgoraErrorCode * _Nullable)error;

/** Gets the user information by passing in the user ID.

After a user joins the channel, the SDK gets the user ID and user account of the remote user, caches them in a mapping table object (`AgoraUserInfo`), and triggers the [didUpdatedUserInfo]([AgoraRtcEngineDelegate rtcEngine:didUpdatedUserInfo:withUid:]) callback on the local client.

After receiving the [didUpdatedUserInfo]([AgoraRtcEngineDelegate rtcEngine:didUpdatedUserInfo:withUid:]) callback, you can call this method to get the user account of the user from the `userInfo` object by passing in the user ID.

@param uid The user ID of the user. Ensure that you set this parameter.
@param error The pointer to [AgoraErrorCode](AgoraErrorCode). It can be set as nil.

@return An [AgoraUserInfo](AgoraUserInfo) object that contains the user account and user ID of the user.
*/
- (AgoraUserInfo* _Nullable)getUserInfoByUid:(NSUInteger)uid
                                   withError:(AgoraErrorCode * _Nullable)error;

/** Switches to a different channel.

 This method allows the audience of a Live-broadcast channel to switch to a different channel.

 After the user successfully switches to another channel, the [didLeaveChannelWithStats]([AgoraRtcEngineDelegate rtcEngine:didLeaveChannelWithStats:]) and [didJoinChannel]([AgoraRtcEngineDelegate rtcEngine:didJoinChannel:withUid:elapsed:]) callbacks are triggered to indicate that the user has left the original channel and joined a new one.

 @param token The token generated at your server:

 - For low-security requirements: You can use the temporary token generated in Dashboard. For details, see [Get a temporary token](https://docs.agora.io/en/Agora%20Platform/token?platform=All%20Platforms#get-a-temporary-token).
 - For high-security requirements: Use the token generated at your server. For details, see [Get a token](https://docs.agora.io/en/Agora%20Platform/token?platform=All%20Platforms#get-a-token).
 @param channelId Unique channel name for the AgoraRTC session in the string format. The string length must be less than 64 bytes. Supported character scopes are:

 - The 26 lowercase English letters: a to z.
 - The 26 uppercase English letters: A to Z.
 - The 10 numbers: 0 to 9.
 - The space.
 - "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
 @param joinSuccessBlock Returns that the user joins the specified channel. Same as [didJoinChannel]([AgoraRtcEngineDelegate rtcEngine:didJoinChannel:withUid:elapsed:]). If `joinSuccessBlock` is nil, the SDK triggers the [didJoinChannel]([AgoraRtcEngineDelegate rtcEngine:didJoinChannel:withUid:elapsed:]) callback.
 
 @note This method applies to the audience role in a Live-broadcast channel only.

 @return - 0: Success.
 - <0: Failure.
 */
- (int)switchChannelByToken:(NSString * _Nullable)token
                  channelId:(NSString * _Nonnull)channelId
                joinSuccess:(void(^ _Nullable)(NSString * _Nonnull channel, NSUInteger uid, NSInteger elapsed))joinSuccessBlock;

/** Allows a user to leave a channel, such as hanging up or exiting a call.

After joining a channel, the user must call the leaveChannel method to end the call before joining another channel.

This method returns 0 if the user leaves the channel and releases all resources related to the call.

This method call is asynchronous, and the user has not exited the channel when the method call returns.

A successful leaveChannel method call triggers the following callbacks:

- The local client: [didLeaveChannelWithStats]([AgoraRtcEngineDelegate rtcEngine:didLeaveChannelWithStats:])
- The remote client: [didOfflineOfUid(AgoraUserOfflineReasonBecomeAudience)]([AgoraRtcEngineDelegate rtcEngine:didOfflineOfUid:reason:]), if the user leaving the channel is in the Communication channel, or is a BROADCASTER in the Live Broadcast profile.

**Note:**

- If you call [destroy](destroy) immediately after leaveChannel, the leaveChannel process interrupts, and the SDK does not trigger the [didLeaveChannelWithStats]([AgoraRtcEngineDelegate rtcEngine:didLeaveChannelWithStats:]) callback.
- If you call this method during CDN live streaming, the SDK triggers the [removePublishStreamUrl](removePublishStreamUrl:) method.
- When you call this method, the SDK deactivates the audio session on iOS by default, and may affect other apps. If you do not want this default behavior, use [setAudioSessionOperationRestriction](setAudioSessionOperationRestriction:) to set `AgoraAudioSessionOperationRestrictionDeactivateSession` so that when you call the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method, the SDK does not deactivate the audio session.

 @param leaveChannelBlock This callback indicates that a user leaves a channel, and provides the statistics of the call. See [AgoraChannelStats](AgoraChannelStats).

 @return * 0: Success.
* < 0: Failure.
 */
- (int)leaveChannel:(void(^ _Nullable)(AgoraChannelStats * _Nonnull stat))leaveChannelBlock;

/** Gets a new token when the current token expires after a period of time.

The `token` expires after a period of time once the token schema is enabled when:

  - The SDK triggers the [tokenPrivilegeWillExpire]([AgoraRtcEngineDelegate rtcEngine:tokenPrivilegeWillExpire:]) callback, or
  - [connectionChangedToState]([AgoraRtcEngineDelegate rtcEngine:connectionChangedToState:reason:]) reports AgoraConnectionChangedTokenExpired(9) in the`reason` parameter.

 **Note:**

 Agora recommends using the [rtcEngineRequestToken]([AgoraRtcEngineDelegate rtcEngineRequestToken:]) callback to report the AgoraErrorCodeTokenExpired(-109) error, not using the [didOccurError]([AgoraRtcEngineDelegate rtcEngine:didOccurError:]) callback.

 The app should call this method to get the `token`. Failure to do so results in the SDK disconnecting from the server.

 @param token The new token.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)renewToken:(NSString * _Nonnull)token;

/** Enables interoperability with the Agora Web SDK.

 This method is applicable to the Live-broadcast profile only. In the Communication profile, the SDK is interoperable with the Web SDK by default.

 @param enabled Sets whether to enable/disable interoperability with the Agora Web SDK:

 * YES: Enable.
 * NO: (Default) Disable.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)enableWebSdkInteroperability:(BOOL)enabled;

/** Gets the connection state of the app.

@return The connection state, see [AgoraConnectionStateType](AgoraConnectionStateType).
*/
- (AgoraConnectionStateType)getConnectionState;

/** Starts to relay media streams across channels.

 After a successful method call, the SDK triggers the [channelMediaRelayStateDidChange]([AgoraRtcEngineDelegate rtcEngine:channelMediaRelayStateDidChange:error:]) and [didReceiveChannelMediaRelayEvent]([AgoraRtcEngineDelegate rtcEngine:didReceiveChannelMediaRelayEvent:]) callbacks, and these callbacks return the state and events of the media stream relay.
 
 - If the `channelMediaRelayStateDidChange` callback returns AgoraChannelMediaRelayStateRunning(2) and AgoraChannelMediaRelayStateIdle(0), and the `didReceiveChannelMediaRelayEvent` callback returns  AgoraChannelMediaRelayEventSentToDestinationChannel(4), the SDK starts relaying media streams between the original and the destination channel.
 - If the `channelMediaRelayStateDidChange` callback returns AgoraChannelMediaRelayStateFailure(3), an exception occurs during the media stream relay.
 
 **Note**

 - Call this method after the [joinChannel]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method.
 - This method takes effect only when you are a broadcaster in a Live-broadcast channel.
 - After a successful method call, if you want to call this method again, ensure that you call the [stopChannelMediaRelay]([AgoraRtcEngineKit stopChannelMediaRelay]) method to quit the current relay.
 
 @param config The configuration of the media stream relay: [AgoraChannelMediaRelayConfiguration](AgoraChannelMediaRelayConfiguration).

 @return - 0: Success.
 - < 0: Failure.
 */
- (int)startChannelMediaRelay:(AgoraChannelMediaRelayConfiguration * _Nonnull)config;

/** Updates the channels for media stream relay. 

 After the channel media relay starts, if you want to relay the media stream to more channels, or leave the current relay channel, you can call the [updateChannelMediaRelay]([AgoraRtcEngineKit updateChannelMediaRelay:]) method.

 After a successful method call, the SDK triggers the [channelMediaRelayStateDidChange]([AgoraRtcEngineDelegate rtcEngine:channelMediaRelayStateDidChange:error:]) callback with the AgoraChannelMediaRelayEventUpdateDestinationChannel(7) state code.

 **Note**

 - Call this method after the [startChannelMediaRelay]([AgoraRtcEngineKit startChannelMediaRelay:]) method to update the destination channel.
 - This method supports adding at most four destination channels in the relay. If there are already four destination channels in the relay, remove the unnecessary ones with the `removeDestinationInfoForChannelName` method in channelMediaRelayConfiguration before calling this method.
 
 @param config The media stream relay configuration: [AgoraChannelMediaRelayConfiguration](AgoraChannelMediaRelayConfiguration).

 @return - 0: Success.
 - < 0: Failure.
 */
- (int)updateChannelMediaRelay:(AgoraChannelMediaRelayConfiguration * _Nonnull)config;

/** Stops the media stream relay.

 Once the relay stops, the broadcaster quits all the destination channels.

 After a successful method call, the SDK triggers the [channelMediaRelayStateDidChange]([AgoraRtcEngineDelegate rtcEngine:channelMediaRelayStateDidChange:error:]) callback. If the callback returns  AgoraChannelMediaRelayStateIdle(0) and AgoraChannelMediaRelayErrorNone(0), the broadcaster successfully stops the relay.

 @note If the method call fails, the SDK triggers the [channelMediaRelayStateDidChange]([AgoraRtcEngineDelegate rtcEngine:channelMediaRelayStateDidChange:error:]) callback with the AgoraChannelMediaRelayErrorServerNoResponse(2) or AgoraChannelMediaRelayEventUpdateDestinationChannelRefused(8) state code. You can leave the channel by calling the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method, and the media stream relay automatically stops.
 
 @return - 0: Success.
 - < 0: Failure.
 */
- (int)stopChannelMediaRelay;

#pragma mark Core Audio

/**-----------------------------------------------------------------------------
 * @name Core Audio
 * -----------------------------------------------------------------------------
 */

/** Enables the audio module.

 The audio module is enabled by default.

 **Note:**

- This method affects the internal engine and can be called after the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method. You can call this method either before or after joining a channel.
- This method resets the internal engine and takes some time to take effect. Agora recommends using the following API methods to control the audio engine modules separately:

    * [enableLocalAudio]([AgoraRtcEngineKit enableLocalAudio:]): Whether to enable the microphone to create the local audio stream.
    * [muteLocalAudioStream]([AgoraRtcEngineKit muteLocalAudioStream:]): Whether to publish the local audio stream.
    * [muteRemoteAudioStream]([AgoraRtcEngineKit muteRemoteAudioStream:mute:]): Whether to subscribe to and play the remote audio stream.
    * [muteAllRemoteAudioStreams]([AgoraRtcEngineKit muteAllRemoteAudioStreams:]): Whether to subscribe to and play all remote audio streams.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)enableAudio;

/** Disables the audio module.

 **Note:**

- This method affects the internal engine and can be called after the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method. You can call this method either before or after joining a channel.
- This method resets the internal engine and takes some time to take effect. Agora recommends using the following API methods to control the audio engine modules separately:

    * [enableLocalAudio]([AgoraRtcEngineKit enableLocalAudio:]): Whether to enable the microphone to create the local audio stream.
    * [muteLocalAudioStream]([AgoraRtcEngineKit muteLocalAudioStream:]): Whether to publish the local audio stream.
    * [muteRemoteAudioStream]([AgoraRtcEngineKit muteRemoteAudioStream:mute:]): Whether to subscribe to and play the remote audio stream.
    * [muteAllRemoteAudioStreams]([AgoraRtcEngineKit muteAllRemoteAudioStreams:]): Whether to subscribe to and play all remote audio streams.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)disableAudio;

/** Sets the audio parameters and application scenarios.

 **Note:**

 * You must call this method before the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method.
 * In the Communication profile, you can set the profile but not the scenario.
 * In the Communication and Live-broadcast profiles, the bitrates may be different from your settings due to network self-adaptation.
 * In scenarios involving music education, Agora recommends setting `profile` as AgoraAudioProfileMusicHighQuality(4) and `scenario` as AgoraAudioScenarioGameStreaming(3) in AgoraAudioScenario.

 @param profile  Sets the sample rate, bitrate, encoding mode, and the number of channels. See AgoraAudioProfile.
 @param scenario Sets the audio application scenario. See AgoraAudioScenario. Under different audio scenarios, the device uses different volume tracks, i.e. either the in-call volume or the media volume. For details, see [What is the difference between the in-call volume and the media volume?](https://docs.agora.io/en/faq/system_volume).

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setAudioProfile:(AgoraAudioProfile)profile
              scenario:(AgoraAudioScenario)scenario;

/** Adjusts the recording volume.

 @param volume Recording volume. The value ranges between 0 and 400:

 * 0: Mute.
 * 100: Original volume.
 * 400: (Maximum) Four times the original volume with signal clipping protection.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)adjustRecordingSignalVolume:(NSInteger)volume;

/** Adjusts the playback volume.

 @param volume Playback volume. The value ranges between 0 and 400:

 * 0: Mute.
 * 100: Original volume.
 * 400: (Maximum) Four times the original volume with signal clipping protection.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)adjustPlaybackSignalVolume:(NSInteger)volume;

/** Enables the SDK to regularly report to the app on which users are speaking and the speakers' volume.

 @param interval Sets the time interval between two consecutive volume indications:

 * &le; 0: Disables the volume indication.
 * &gt; 0: The time interval (ms) between two consecutive volume indications. Agora recommends setting `interval` &ge; 200 ms. Once this method is enabled, the SDK returns the volume indications at the set time interval in the [reportAudioVolumeIndicationOfSpeakers]([AgoraRtcEngineDelegate rtcEngine:reportAudioVolumeIndicationOfSpeakers:totalVolume:]) and [audioVolumeIndicationBlock](audioVolumeIndicationBlock:) callbacks, regardless of whether any user is speaking in the channel.

 @param smooth The smoothing factor sets the sensitivity of the audio volume indicator. The value ranges between 0 and 10. The greater the value, the more sensitive the indicator. The recommended value is 3.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)enableAudioVolumeIndication:(NSInteger)interval
                            smooth:(NSInteger)smooth;

/** Enables/Disables the local audio capture.

When an app joins a channel, the audio module is enabled by default. This method disables or re-enables the local audio capture, that is, to stop or restart local audio capturing and processing.

This method does not affect receiving or playing the remote audio streams, and enableLocalAudio(NO) is applicable to scenarios where the user wants to receive remote audio streams without sending any audio stream to other users in the channel.

The SDK triggers the [didMicrophoneEnabled]([AgoraRtcEngineDelegate rtcEngine:didMicrophoneEnabled:]) callback once the local audio module is disabled or re-enabled.

**Note:**

Call this method after the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method.

This method is different from the [muteLocalAudioStream]([AgoraRtcEngineKit muteLocalAudioStream:]) method:

- [enableLocalAudio]([AgoraRtcEngineKit enableLocalAudio:]): Disables/Re-enables the local audio capturing and processing.
- [muteLocalAudioStream]([AgoraRtcEngineKit muteLocalAudioStream:]): Sends/Stops sending the local audio stream.

 @param enabled * YES: (Default) Enable the local audio module, that is, to start local audio capturing and processing.
 * NO: Disable the local audio module, that is, to stop local audio capturing and processing.
 @return * 0: Success.
* < 0: Failure.
 */
- (int)enableLocalAudio:(BOOL)enabled;

/** Sends/Stops sending the local audio stream.

 Use this method to stop/start sending the local audio stream. A successful muteLocalAudioStream method call triggers the [didAudioMuted]([AgoraRtcEngineDelegate rtcEngine:didAudioMuted:byUid:]) callback on the remote client.

 **Note:**

 When `mute` is set as `YES`, this method does not disable the microphone and thus does not affect any ongoing recording.

 @param mute Sets whether to send/stop sending the local audio stream:

 * YES: Stops sending the local audio stream.
 * NO: (Default) Sends the local audio stream.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)muteLocalAudioStream:(BOOL)mute;

/** Receives/Stops receiving a specified remote user’s audio stream.

 **Note:**

 If you call the [muteAllRemoteAudioStreams]([AgoraRtcEngineKit muteAllRemoteAudioStreams:]) method and set `mute` as `YES` to mute all remote audio streams, call the [muteAllRemoteAudioStreams]([AgoraRtcEngineKit muteAllRemoteAudioStreams:]) method again and set `mute` as `NO` before calling this method. The [muteAllRemoteAudioStreams]([AgoraRtcEngineKit muteAllRemoteAudioStreams:]) method sets all remote streams, while the [muteRemoteAudioStream]([AgoraRtcEngineKit muteRemoteAudioStream:mute:])method sets a specified stream.

 @param uid  User ID of the specified remote user.
 @param mute Sets whether to receive/stop receiving a specified remote user’s audio stream:

 * YES: Stop receiving a specified remote user’s audio stream.
 * NO: (Default) Receive a specified remote user’s audio stream.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)muteRemoteAudioStream:(NSUInteger)uid mute:(BOOL)mute;

/** Receives/Stops receiving all remote audio streams.

 @param mute Sets whether to receive/stop receiving all remote audio streams:

 * YES: Stop receiving all remote audio streams.
 * NO: (Default) Receive all remote audio streams.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)muteAllRemoteAudioStreams:(BOOL)mute;

/** Sets whether to receive all remote audio streams by default.

You can call this method either before or after joining a channel. If you call this method after joining a channel, then the audio streams of all users joining afterwards are not received.

 @param mute Sets whether to receive/stop receiving all remote audio streams by default:

 * YES: Stop receiving all remote audio streams by default.
 * NO: (Default) Receive all remote audio streams by default.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setDefaultMuteAllRemoteAudioStreams:(BOOL)mute;


#pragma mark Core Video

/**-----------------------------------------------------------------------------
 * @name Core Video
 * -----------------------------------------------------------------------------
 */

/** Enables the video module.

You can call this method either before entering a channel or during a call. If you call this method before entering a channel, the service starts in the video mode. If you call this method during an audio call, the audio mode switches to the video mode.

A successful enableVideo method call triggers the [didVideoEnabled(YES)]([AgoraRtcEngineDelegate rtcEngine:didVideoEnabled:byUid:]) callback on the remote client.


To disable the video, call the disableVideo method.

**Note:**

- This method affects the internal engine and can be called after the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method.
- This method resets the internal engine and takes some time to take effect. Agora recommends using the following API methods to control the video engine modules separately:

    * [enableLocalVideo]([AgoraRtcEngineKit enableLocalVideo:]): Whether to enable the camera to create the local video stream.
    * [muteLocalVideoStream]([AgoraRtcEngineKit muteLocalVideoStream:]): Whether to publish the local video stream.
    * [muteRemoteVideoStream]([AgoraRtcEngineKit muteRemoteVideoStream:mute:]): Whether to subscribe to and play the remote video stream.
    * [muteAllRemoteVideoStreams]([AgoraRtcEngineKit muteAllRemoteVideoStreams:]): Whether to subscribe to and play all remote video streams.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)enableVideo;

/** Disables the video module.

   You can call this method before entering a channel or during a call. If you call this method before entering a channel, the service starts in the audio mode. If you call this method during a video call, the video mode switches to the audio mode. To enable the video module, call the [enableVideo](enableVideo) method.

   A successful disableVideo method call triggers the [didVideoEnabled(NO)]([AgoraRtcEngineDelegate rtcEngine:didVideoEnabled:byUid:]) callback on the remote client.

 **Note:**

- This method affects the internal engine and can be called after the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method.
- This method resets the internal engine and takes some time to take effect. Agora recommends using the following API methods to control the video engine modules separately:

    * [enableLocalVideo]([AgoraRtcEngineKit enableLocalVideo:]): Whether to enable the camera to create the local video stream.
    * [muteLocalVideoStream]([AgoraRtcEngineKit muteLocalVideoStream:]): Whether to publish the local video stream.
    * [muteRemoteVideoStream]([AgoraRtcEngineKit muteRemoteVideoStream:mute:]): Whether to subscribe to and play the remote video stream.
    * [muteAllRemoteVideoStreams]([AgoraRtcEngineKit muteAllRemoteVideoStreams:]): Whether to subscribe to and play all remote video streams.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)disableVideo;

/** Sets the video encoder configuration.

Each video encoder configuration corresponds to a set of video parameters, including the resolution, frame rate, bitrate, and video orientation.

The parameters specified in this method are the maximum values under ideal network conditions. If the video engine cannot render the video using the specified parameters due to unreliable network conditions, the parameters further down the list are considered until a successful configuration is found.

 If you do not need to set the video encoder configuration after joining a channel, you can call this method before calling the enableVideo method to reduce the render time of the first video frame.

 **Note:**

 From v2.3.0, the following API methods are deprecated:

 - [setVideoProfile](setVideoProfile:swapWidthAndHeight:)
 - [setVideoResolution](setVideoResolution:andFrameRate:bitrate:)

 @param config Video encoder configuration: AgoraVideoEncoderConfiguration
 @return * 0: Success.
* < 0: Failure.
 */
- (int)setVideoEncoderConfiguration:(AgoraVideoEncoderConfiguration * _Nonnull)config;

/** Sets the local video view and configures the video display settings on the local machine.

The app calls this method to bind each video window (view) of the local video streams and configures the video display settings. Call this method after initialization to configure the local video display settings before entering a channel. The binding is still valid after the user leaves the channel, which means the window still displays. To unbind the view, set the `view` in AgoraRtcVideoCanvas to nil.

 @param local Sets the local video view and settings. See AgoraRtcVideoCanvas.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setupLocalVideo:(AgoraRtcVideoCanvas * _Nullable)local;

/** Sets the remote video view.

This method binds the remote user to the video display window (sets the view for the user of the specified `uid`).

The app specifies the `uid` of the remote video in this method call before the user joins a channel.

If the remote `uid` is unknown to the app, set it after the app receives the [userJoinedBlock]([AgoraRtcEngineKit userJoinedBlock:]) callback.

If the Video Recording function is enabled, the Video Recording Service joins the channel as a dummy client, causing other clients to also receive the [didJoinedOfUid]([AgoraRtcEngineDelegate rtcEngine:didJoinedOfUid:elapsed:]) callback. Do not bind the dummy client to the app view because the dummy client does not send any video streams. If your app does not recognize the dummy client, bind the remote user to the view when the SDK triggers the [firstRemoteVideoDecodedOfUid]([AgoraRtcEngineDelegate rtcEngine:firstRemoteVideoDecodedOfUid:size:elapsed:]) callback.

  To unbind the remote user from the view, set the `view` in AgoraRtcVideoCanvas as nil. Once the remote user leaves the channel, the SDK unbinds the remote user.

 @param remote Sets the remote video view and settings. See AgoraRtcVideoCanvas.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setupRemoteVideo:(AgoraRtcVideoCanvas * _Nonnull)remote;

/** Sets the local video display mode.

 This method can be invoked multiple times during a call to change the display mode.

 @param mode Sets the local video display mode. See AgoraVideoRenderMode.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setLocalRenderMode:(AgoraVideoRenderMode)mode;

/** Sets the remote video display mode.

This method can be invoked multiple times during a call to change the display mode.

 @param uid  User ID of the remote user sending the video streams.
 @param mode Sets the remote video display mode. See AgoraVideoRenderMode.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setRemoteRenderMode:(NSUInteger)uid
                      mode:(AgoraVideoRenderMode)mode;

/** Starts the local video preview before joining a channel.

By default, the local preview enables the mirror mode.

Before calling this method, you must:

 - Call the [setupLocalVideo]([AgoraRtcEngineKit setupLocalVideo:]) method to set up the local preview window and configure the attributes.
 - Call the [enableVideo]([AgoraRtcEngineKit enableVideo]) method to enable video.

**Note:**

 Once you call this method to start the local video preview, if you leave the channel by calling the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method, the local video preview remains until you call the stopPreview method to disable it.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)startPreview;

/** Stops the local video preview and the video.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)stopPreview;

/** Disables the local video.

 This method disables the local video and enableLocalVideo(NO) is only applicable when the user wants to watch the remote video without sending any video stream to the other user.

 Call this method after calling the [enableVideo](enableVideo) method. Otherwise, this method may not work properly.

 After the enableVideo method is called, the local video is enabled by default. You can use this method to disable the local video while the remote video remains unaffected.

 A successful enableLocalVideo method call triggers the [didLocalVideoEnabled]([AgoraRtcEngineDelegate rtcEngine:didLocalVideoEnabled:byUid:]) callback on the remote client.

 **Note:**

 This method enables the internal engine and can be called after calling the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method.

 @param enabled Sets whether to enable/disable the local video, including the capturer, renderer, and sender:

 * YES: (Default) Enable the local video.
 * NO: Disable the local video. Once the local video is disabled, the remote users can no longer receive the video stream of this user, while this user can still receive the video streams of other remote users.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)enableLocalVideo:(BOOL)enabled;

/** Sends/Stops sending the local video stream.

 When you set `mute` as `YES`, this method does not disable the camera, and thus does not affect the retrieval of the local video stream. This method responds faster compared to the [enableLocalVideo]([AgoraRtcEngineKit enableLocalVideo:]) method which controls the sending of local video streams.

 A successful muteLocalVideoStream method call triggers the [didVideoMuted]([AgoraRtcEngineDelegate rtcEngine:didVideoMuted:byUid:]) callback on the remote client.

 @param mute Sets whether to send/stop sending the local video stream:

 * YES: Stop sending the local video stream.
 * NO: (Default) Send the local video stream.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)muteLocalVideoStream:(BOOL)mute;

/** Receives/Stops receiving all remote video streams.

 @param mute Sets whether to receive/stop receiving all remote video streams:

 * YES: Stops receiving all remote video streams.
 * NO: (Default) Receives all remote video streams.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)muteAllRemoteVideoStreams:(BOOL)mute;

/** Receives/Stops receiving a specified remote user’s video stream.

**Note:**

 If you call the [muteAllRemoteVideoStreams]([AgoraRtcEngineKit muteAllRemoteVideoStreams:]) method and set `mute` as `YES` to stop receiving all remote video streams, call the muteAllRemoteVideoStreams method again and set `mute` as `NO` before calling this method.

 @param uid  User ID of the specified remote user.
 @param mute Sets whether to receive/stop receiving a specified remote user’s video stream.

 * YES: Stops receiving a specified remote user’s video stream.
 * NO: (Default) Receives a specified remote user’s video stream.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)muteRemoteVideoStream:(NSUInteger)uid
                        mute:(BOOL)mute;

/** Sets whether to receive all remote video streams by default.

 @param mute Sets whether to receive/stop receiving all remote video streams by default.

 * YES: Stop receiving all remote video streams by default.
 * NO: (Default) Receive all remote video streams by default.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setDefaultMuteAllRemoteVideoStreams:(BOOL)mute;


#pragma mark Video Pre-Process and Post-Process
/**-----------------------------------------------------------------------------
 * @name Video Pre-Process and Post-Process
 * -----------------------------------------------------------------------------
 */

/** Enables/Disables image enhancement and sets the options. (iOS only)

@param enable 	Sets whether or not to enable image enhancement:

- `YES`: enables image enhancement.
- `NO`: disables image enhancement.
@param options 	The image enhancement options, see AgoraBeautyOptions.

@return * 0: Success.
* < 0: Failure.
*/
- (int)setBeautyEffectOptions:(BOOL)enable options:(AgoraBeautyOptions * _Nullable)options;

#if TARGET_OS_IPHONE
- (int)enableRemoteSuperResolution:(NSUInteger)uid enabled:(BOOL)enabled;
#endif


#pragma mark Audio Routing Controller

/**-----------------------------------------------------------------------------
 * @name Audio Routing Controller
 * -----------------------------------------------------------------------------
 */

#if TARGET_OS_IPHONE
/** Sets the default audio route. (iOS only.)

 This method sets whether the received audio is routed to the earpiece or speakerphone by default before joining a channel. If a user does not call this method, the audio is routed to the earpiece by default.

 If you need to change the default audio route after joining a channel, call the [setEnableSpeakerphone](setEnableSpeakerphone:) method.

 **Note:**

 * This method only works in audio mode.
 * Call this method before calling the [joinChannel](joinChannelByToken:channelId:info:uid:joinSuccess:) method.

 The default settings for each mode:

 * Voice: Earpiece.
 * Video: Speakerphone. If a user in the Communication profile calls the [disableVideo](disableVideo) method or if a user calls the [muteLocalVideoStream]([AgoraRtcEngineKit muteLocalVideoStream:]) and [muteAllRemoteVideoStreams]([AgoraRtcEngineKit muteAllRemoteVideoStreams:]) methods, the default audio route is switched to the earpiece automatically.
 * Live Broadcast: Speakerphone.
 * Gaming Voice: Speakerphone.

 @param defaultToSpeaker Sets the default audio route:

 * YES: Speakerphone.
 * NO: (Default) Earpiece.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setDefaultAudioRouteToSpeakerphone:(BOOL)defaultToSpeaker;

/** Enables/Disables the audio route to the speakerphone. (iOS only.)

 This method sets whether the audio is routed to the speakerphone. After this method is called, the SDK returns the [didAudioRouteChanged]([AgoraRtcEngineDelegate rtcEngine:didAudioRouteChanged:]) callback, indicating that the audio route changes.

 **Note:**

 * Ensure that you have successfully called the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method before calling this method.
 * The SDK calls setCategory(AVAudioSessionCategoryPlayAndRecord) with options to configure the headset/speakerphone, so this method applies to all audio playback in the system.

 @param enableSpeaker Sets whether to route the audio to the speakerphone or earpiece:

 * YES: Route the audio to the speakerphone.
 * NO: Route the audio to the earpiece. If a headset is plugged in, the audio is routed to the headset.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setEnableSpeakerphone:(BOOL)enableSpeaker;

/** Checks whether the speakerphone is enabled. (iOS only.)

 @return * YES: The speakerphone is enabled, and the audio plays from the speakerphone.
 * NO: The speakerphone is not enabled, and the audio plays from devices other than the speakerphone. For example, the headset or earpiece.
 */
- (BOOL)isSpeakerphoneEnabled;
#endif


#pragma mark In Ear Monitor

/**-----------------------------------------------------------------------------
 * @name In-ear Monitor
 * -----------------------------------------------------------------------------
 */

#if TARGET_OS_IPHONE

/** Enables in-ear monitoring. (iOS only.)

 @param enabled Sets whether to enable/disable in-ear monitoring.

 * YES: Enable.
 * NO: (Default) Disable.

 @return * 0: Success.
* < 0: Failure.
  */
- (int)enableInEarMonitoring:(BOOL)enabled;

/** Sets the volume of the in-ear monitor. (iOS only.)

 @param volume Sets the volume of the in-ear monitor. The value ranges between 0 and 100 (default).

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setInEarMonitoringVolume:(NSInteger)volume;
#endif


#pragma mark Audio Sound Effect

/**-----------------------------------------------------------------------------
 * @name Audio Sound Effect
 * -----------------------------------------------------------------------------
 */

/** Changes the voice pitch of the local speaker.

 @param pitch Sets the voice pitch. The value ranges between 0.5 and 2.0. The lower the value, the lower the voice pitch. The default value is 1.0 (no change to the local voice pitch).

 @return * 0: Success.
* -1: Failure.
 */
- (int)setLocalVoicePitch:(double)pitch;

/** Sets the local voice equalization effect.

 @param bandFrequency Sets the band frequency. The value ranges between 0 and 9, representing the respective 10-band center frequencies of the voice effects, including 31, 62, 125, 500, 1k, 2k, 4k, 8k, and 16k Hz. See AgoraAudioEqualizationBandFrequency.
 @param gain          Sets the gain of each band (dB). The value ranges between -15 and 15. The default value is 0.

 @return * 0: Success.
* -1: Failure.
*/
- (int)setLocalVoiceEqualizationOfBandFrequency:(AgoraAudioEqualizationBandFrequency)bandFrequency withGain:(NSInteger)gain;

/** Sets the local voice reverberation.

 v2.4.0 adds the [setLocalVoiceReverbPreset]([AgoraRtcEngineKit setLocalVoiceReverbPreset:]) method, a more user-friendly method for setting the local voice reverberation. You can use this method to set the local reverberation effect, such as Popular, R&B, Rock, Hip-hop, and more.
 @param reverbType Sets the reverberation type. See AgoraAudioReverbType.
 @param value      Sets the effect of the reverberation type. See AgoraAudioReverbType for the value range.

 @return * 0: Success.
* -1: Failure.
 */
- (int)setLocalVoiceReverbOfType:(AgoraAudioReverbType)reverbType withValue:(NSInteger)value;

/** Sets the local voice changer option.

Sets the local voice changer option.

**Note:**

Do not use this method together with [setLocalVoiceReverbPreset]([AgoraRtcEngineKit setLocalVoiceReverbPreset:]), or the method called earlier does not take effect.

@param voiceChanger The local voice changer option, see [AgoraAudioVoiceChanger](AgoraAudioVoiceChanger).

@return * 0: Success.
* < 0: Failure.
*/
- (int) setLocalVoiceChanger:(AgoraAudioVoiceChanger)voiceChanger;

/** Sets the preset local voice reverberation effect.

**Note:**

- Do not use this method together with [setLocalVoiceReverbOfType]([AgoraRtcEngineKit setLocalVoiceReverbOfType:withValue:]).
- Do not use this method together with [setLocalVoiceChanger]([AgoraRtcEngineKit setLocalVoiceChanger:]), or the method called earlier does not take effect.

 @param reverbPreset The preset local voice reverberation option, see [AgoraAudioReverbPreset](AgoraAudioReverbPreset).

 @return * 0: Success.
* -1: Failure.
 */
- (int) setLocalVoiceReverbPreset:(AgoraAudioReverbPreset)reverbPreset;

/** Enables/Disables stereo panning for remote users.

If you need to use the [setRemoteVoicePosition]([AgoraRtcEngineKit setRemoteVoicePosition:pan:gain:]) method, ensure that you call this method before joining a channel to enable stereo panning for remote users.

 @param enabled Sets whether or not to enable stereo panning for remote users:

 - `YES`: enables stereo panning.
 - `NO`: disables stereo panning.

@return * 0: Success.
* -1: Failure.
 */
- (int) enableSoundPositionIndication:(BOOL)enabled;

/** Sets the sound position and gain of a remote user.

 When the local user calls this method to set the sound position of a remote user, the sound difference between the left and right channels allows the local user to track the real-time position of the remote user, creating a real sense of space. This method applies to massively multiplayer online games, such as Battle Royale games.

**Note:**

- For this method to work, enable stereo panning for remote users by calling [enableSoundPositionIndication]([AgoraRtcEngineKit enableSoundPositionIndication:]) before joining a channel.
This method requires hardware support.
- For the best effect, we recommend using the following audio output devices:
  - (iOS) A stereo headset.
  - (macOS) A stereo loudspeaker.
 @param uid The ID of the remote user.
 @param pan The sound position of the remote user. The value ranges from -1.0 to 1.0:

 * 0.0: (default) the remote sound comes from the front.
 * -1.0: the remote sound comes from the left.
 * 1.0: the remote sound comes from the right.

 @param gain Gain of the remote user. The value ranges from 0.0 to 100.0. The default value is 100.0 (the original gain of the remote user). The smaller the value, the less the gain.

 @return * 0: Success.
* -1: Failure.
 */
- (int) setRemoteVoicePosition:(NSUInteger) uid
                           pan:(double) pan
                          gain:(double) gain;


#pragma mark Music File Playback and Mixing

/**-----------------------------------------------------------------------------
 * @name Music File Playback and Mixing
 * -----------------------------------------------------------------------------
 */

/** Starts audio mixing.

  This method mixes the specified local audio file with the audio stream from the microphone, or replaces the microphone's audio stream with the specified local audio file. You can choose whether the other user can hear the local audio playback and specify the number of playback loops. This method also supports online music playback.

 A successful startAudioMixing method call triggers the [localAudioMixingStateDidChanged]([AgoraRtcEngineDelegate rtcEngine:localAudioMixingStateDidChanged:errorCode:])(AgoraAudioMixingStatePlaying) callback on the local client.

 When the audio mixing file playback finishes, the SDK triggers the [localAudioMixingStateDidChanged]([AgoraRtcEngineDelegate rtcEngine:localAudioMixingStateDidChanged:errorCode:])(AgoraAudioMixingStateStopped) callback on the local client.

 **Note:**

 * To use this method, ensure that the iOS device version is 8.0 and later.
 * Call this method when you are in a channel.
 * If you want to play an online music file, ensure that the time interval between playing the online music file and calling this method is greater than 100 ms, or the AudioFileOpenTooFrequent(702) warning occurs.
 * If the local audio mixing file does not exist, or if the SDK does not support the file format or cannot access the music file URL, the SDK returns AgoraWarningCodeAudioMixingOpenError(701).

 @param filePath The absolute path of the local or online audio file to be mixed. Supported audio formats: mp3, aac, m4a, 3gp, and wav.

 @param loopback Sets which user can hear the audio mixing:

 * YES: Only the local user can hear the audio mixing.
 * NO: Both users can hear the audio mixing.

 @param replace Sets the audio mixing content:

 * YES: Only the specified audio file is published; the audio stream received by the microphone is not published.
 * NO: The local audio file mixed with the audio stream from the microphone.

 @param cycle Sets the number of playback loops:

 * Positive integer: Number of playback loops.
 * -1：Infinite playback loops.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)startAudioMixing:(NSString *  _Nonnull)filePath
               loopback:(BOOL)loopback
                replace:(BOOL)replace
                  cycle:(NSInteger)cycle;

/** Stops audio mixing.

 Call this method when you are in a channel.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)stopAudioMixing;

/** Pauses audio mixing.

 Call this method when you are in a channel.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)pauseAudioMixing;

/** Resumes audio mixing.

 Call this method when you are in a channel.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)resumeAudioMixing;

/** Adjusts the volume of audio mixing.

 Call this method when you are in a channel.

 @param volume Audio mixing volume. The value ranges between 0 and 100 (default).
 @return * 0: Success.
* < 0: Failure.
 */
- (int)adjustAudioMixingVolume:(NSInteger)volume;

/** Adjusts the volume of audio mixing for local playback.

 Call this method when you are in a channel.

 @param volume Audio mixing volume for local playback. The value ranges between 0 and 100 (default).
 @return * 0: Success.
 * < 0: Failure.
 */
- (int)adjustAudioMixingPlayoutVolume:(NSInteger)volume;

/** Adjusts the volume of audio mixing for publishing (sending to other users).

 Call this method when you are in a channel.

 @param volume Audio mixing volume for publishing. The value ranges between 0 and 100 (default).
 @return * 0: Success.
 * < 0: Failure.
 */
- (int)adjustAudioMixingPublishVolume:(NSInteger)volume;

/** Gets the audio mixing volume for publishing.

This method helps troubleshoot audio volume related issues.
*/
- (int)getAudioMixingPublishVolume;

/** Gets the audio mixing volume for local playback.

This method helps troubleshoot audio volume related issues.
*/
- (int)getAudioMixingPlayoutVolume;

/** Retrieves the duration (ms) of audio mixing.

 Call this method when you are in a channel.

 @return * &ge; 0: The audio mixing duration, if this method call is successful.

* < 0: Failure.
 */

- (int)getAudioMixingDuration;

/** Retrieves the playback position (ms) of the audio mixing file.

 Call this method when you are in a channel.

 @return * &ge; 0: The current playback position of the audio mixing file, if this method call is successful.

* < 0: Failure.
 */
- (int)getAudioMixingCurrentPosition;

/** Sets the playback position of the audio mixing file to a different starting position (the default plays from the beginning).

 @param pos The playback starting position (ms) of the audio mixing file.

 @return * 0: Success.
* < 0: Failure.

 */
- (int)setAudioMixingPosition:(NSInteger)pos;


#pragma mark Audio Effect File Playback

/**-----------------------------------------------------------------------------
 * @name Audio Effect File Playback
 * -----------------------------------------------------------------------------
 */

/** Retrieves the volume of the audio effects.

The value ranges between 0.0 and 100.0.

@return * &ge; 0: Volume of the audio effects, if this method call is successful.

* < 0: Failure.
 */
- (double)getEffectsVolume;

/** Sets the volume of the audio effects.

 @param volume Volume of the audio effects. The value ranges between 0.0 and 100.0 (default).

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setEffectsVolume:(double)volume;

/** Sets the volume of a specified audio effect.

 @param soundId ID of the audio effect. Each audio effect has a unique ID.
 @param volume Volume of the audio effect. The value ranges between 0.0 and 100.0 (default).

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setVolumeOfEffect:(int)soundId
              withVolume:(double)volume;

/** Plays a specified audio effect.

You can use this method to add specific audio effects for specific scenarios, for example, gaming.

With this method, you can set the loop count, pitch, pan, and gain of the audio effect file and whether the remote user can hear the audio effect.

To play multiple audio effect files simultaneously, call this method multiple times with different soundIds and filePaths. We recommend playing no more than three audio effect files at the same time.

When the audio effect file playback is finished, the SDK triggers the [rtcEngineDidAudioEffectFinish]([AgoraRtcEngineDelegate rtcEngineDidAudioEffectFinish:soundId:]) callback.

@note Playing multiple online audio effect files simultaneously is not supported on macOS.
 @param soundId ID of the specified audio effect. Each audio effect has a unique ID.
 If the audio effect is preloaded into the memory through the [preloadEffect](preloadEffect:filePath:) method, ensure that the `soundId` value is set to the same value as in [preloadEffect](preloadEffect:filePath:).
 @param filePath The absolute path of the local audio effect file or the URL of the online audio effect file.
 @param loopCount Sets the number of times the audio effect loops:

 * 0: Plays the audio effect once.
 * 1: Plays the audio effect twice.
 * -1: Plays the audio effect in an indefinite loop until you call the [stopEffect](stopEffect:) or [stopAllEffects](stopAllEffects) method.

 @param pitch Sets the pitch of the audio effect. The value ranges between 0.5 and 2. The default value is 1 (no change to the pitch). The lower the value, the lower the pitch.
 @param pan Sets the spatial position of the audio effect. The value ranges between -1.0 and 1.0.

 * 0.0: The audio effect displays ahead.
 * 1.0: The audio effect displays to the right.
 * -1.0: The audio effect displays to the left.

 @param gain Sets the volume of the audio effect. The value ranges between 0.0 and 100.0 (default). The lower the value, the lower the volume of the audio effect.
 @param publish Sets whether or not to publish the specified audio effect to the remote stream:

 * YES: The played audio effect is published to the Agora Cloud and the remote users can hear it.
 * NO: The played audio effect is not published to the Agora Cloud and the remote users cannot hear it.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)playEffect:(int)soundId
         filePath:(NSString * _Nullable)filePath
        loopCount:(int)loopCount
            pitch:(double)pitch
              pan:(double)pan
             gain:(double)gain
          publish:(BOOL)publish;

/** Stops playing a specified audio effect.

 @param soundId ID of the audio effect. Each audio effect has a unique ID.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)stopEffect:(int)soundId;

/** Stops playing all audio effects.
 */
- (int)stopAllEffects;

/** Preloads a specified audio effect file into the memory.

 To ensure smooth communication, limit the size of the audio effect file. Agora recommends using this method to preload the audio effect before calling the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method.

 Supported audio formats: mp3, aac, m4a, 3gp, and wav.

 @note This method does not support online audio effect files.
 @param soundId  ID of the audio effect. Each audio effect has a unique ID.
 @param filePath Absolute path of the audio effect file.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)preloadEffect:(int)soundId
            filePath:(NSString * _Nullable)filePath;

/** Releases a specified preloaded audio effect from the memory.

 @param soundId ID of the audio effect. Each audio effect has a unique ID.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)unloadEffect:(int)soundId;

/** Pauses a specified audio effect.

 @param soundId ID of the audio effect. Each audio effect has a unique ID.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)pauseEffect:(int)soundId;

/** Pauses all audio effects.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)pauseAllEffects;

/** Resumes playing a specified audio effect.

 @param soundId ID of the audio effect. Each audio effect has a unique ID.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)resumeEffect:(int)soundId;

/** Resumes playing all audio effects.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)resumeAllEffects;


#pragma mark Audio Recorder

/**-----------------------------------------------------------------------------
 * @name Audio Recorder
 * -----------------------------------------------------------------------------
 */

/** Starts an audio recording.

 The SDK allows recording during a call. Supported formats:

 * .wav: Large file size with high fidelity.
 * .aac: Small file size with low fidelity.

 Ensure that the directory to save the recording file exists and is writable. You can call this method after calling the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method. The recording automatically stops when you call the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method.

 @param filePath Absolute file path of the recording file. The string of the file name is in UTF-8.
 @param quality  Sets the audio recording quality. See AgoraAudioRecordingQuality.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)startAudioRecording:(NSString * _Nonnull)filePath
                   quality:(AgoraAudioRecordingQuality)quality;

/** Stops an audio recording on the client.

 **Note:**

 You can call this method before calling the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method, else the recording automatically stops when you call the leaveChannel method.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)stopAudioRecording;

#pragma mark Loopback Recording

/**-----------------------------------------------------------------------------
 * @name Loopback Recording
 * -----------------------------------------------------------------------------
 */

#if (!(TARGET_OS_IPHONE) && (TARGET_OS_MAC))
/** Enables loopback recording. (macOS only)

 If you enable loopback recording, the output of the sound card is mixed into the audio stream sent to the other end.

 **Note:**

 macOS does not support loopback recording of the default sound card. If you need to use this method, please use a virtual sound card and pass its name to the `deviceName` parameter. Agora has tested and recommends using soundflower.

 @param enabled Sets whether to enable/disable loopback recording.

 * YES: Enable loopback recording.
 * NO: (Default) Disable loopback recording.

 @param deviceName Pointer to the device name of the sound card. The default value is nil (default sound card). If you use a virtual sound card like "Soundflower", set this parameter as the name of the sound card, "Soundflower", and the SDK will find the corresponding sound card and start capturing.
 @return * 0: Success.
* < 0: Failure.
 */
-(int)enableLoopbackRecording:(BOOL)enabled
                   deviceName:(NSString * _Nullable)deviceName;
#endif


#pragma mark Miscellaneous Audio Control

/**-----------------------------------------------------------------------------
 * @name Miscellaneous Audio Control
 * -----------------------------------------------------------------------------
 */

#if TARGET_OS_IPHONE
/** Sets the audio session's operational restriction. (iOS only.)

 The SDK and the app can both configure the audio session by default. The app may occasionally use other apps or third-party components to manipulate the audio session and restrict the SDK from doing so. This method allows the app to restrict the SDK's manipulation of the audio session.

 You can call this method at any time to return the control of the audio sessions to the SDK.

 **Note:**

 This method restricts the SDK's manipulation of the audio session. Any operation to the audio session relies solely on the app, other apps, or third-party components.

 @param restriction The operational restriction (bit mask) of the SDK on the audio session. See [AgoraAudioSessionOperationRestriction](AgoraAudioSessionOperationRestriction).

 */
- (void)setAudioSessionOperationRestriction:(AgoraAudioSessionOperationRestriction)restriction;
#endif


#pragma mark Network-related Test

/**-----------------------------------------------------------------------------
 * @name Network-related Test
 * -----------------------------------------------------------------------------
 */

/** Starts an audio call test.

This method starts an audio call test to determine whether the audio devices (for example, headset and speaker) and the network connection are working properly.

In the audio call test, you record your voice. If the recording plays back within the set time interval, the audio devices and the network connection are working properly.

**Note:**

- Call this method before joining a channel.

- After calling this method, call the stopEchoTest method to end the test. Otherwise, the app cannot run the next echo test, or join a channel.

- In the Live-broadcast profile, only a host can call this method.

@param interval The time interval (s) between when you speak and when the recording plays back.
@param successBlock The SDK triggers the `successBlock` callback if this method call is successful.

@return * 0: Success.
* < 0: Failure.
*/
- (int)startEchoTestWithInterval:(NSInteger)interval
                  successBlock:(void(^ _Nullable)(NSString * _Nonnull channel, NSUInteger uid, NSInteger elapsed))successBlock;

/** Stops the audio call test.

 @return * 0: Success.
* < 0: Failure. For example, AgoraErrorCodeRefused(-5)：Failed to stop the echo test. The echo test may not be running.
 */
- (int)stopEchoTest;

/** Enables the network connection quality test.

  This method tests the quality of the user’s network connection and is disabled by default.

 Before users join a channel or before an audience switches to a host, call this method to check the uplink network quality.

 This method consumes additional network traffic, which may affect the communication quality. We do not recommend calling this method together with [startLastmileProbeTest]([AgoraRtcEngineKit startLastmileProbeTest:]).

 Call the [disableLastmileTest](disableLastmileTest) method to disable this test after receiving the [lastmileQuality]([AgoraRtcEngineDelegate rtcEngine:lastmileQuality:]) callback, and before the user joins the channel or switches the user role.

 **Note:**

 - Do not call any other methods before receiving the [lastmileQuality]([AgoraRtcEngineDelegate rtcEngine:lastmileQuality:]) callback. Otherwise, the callback may be interrupted by other methods and may not execute.

 - In the Live-broadcast profile, a host should not call this method after joining a channel.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)enableLastmileTest;

/** Disables the network connection quality test.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)disableLastmileTest;

/** Starts the last-mile network probe test.


Starts the last-mile network probe test before joining a channel to get the uplink and downlink last-mile network statistics, including the bandwidth, packet loss, jitter, and round-trip time (RTT).

Call this method to check the uplink network quality before users join a channel or before an audience switches to a host.

Once this method is enabled, the SDK returns the following callbacks:

- [lastmileQuality]([AgoraRtcEngineDelegate rtcEngine:lastmileQuality:]): the SDK triggers this callback within two seconds depending on the network conditions. This callback rates the network conditions and is more closely linked to the user experience.
- [lastmileProbeResult]([AgoraRtcEngineDelegate rtcEngine:lastmileProbeTestResult:])the SDK triggers this callback within 30 seconds depending on the network conditions. This callback returns the real-time statistics of the network conditions and is more objective.

**Note:**

- This method consumes extra network traffic and may affect communication quality. We do not recommend calling this method together with [enableLastmileTest]([AgoraRtcEngineKit enableLastmileTest]).
- Do not call other methods before receiving the [lastmileQuality]([AgoraRtcEngineDelegate rtcEngine:lastmileQuality:]) and [lastmileProbeResult]([AgoraRtcEngineDelegate rtcEngine:lastmileProbeTestResult:]) callbacks. Otherwise, the callbacks may be interrupted.
- In the Live-broadcast profile, a host should not call this method after joining a channel.

@param config The configurations of the last-mile network probe test, see [AgoraLastmileProbeConfig](AgoraLastmileProbeConfig).

@return * 0: Success.
* < 0: Failure.
*/
- (int)startLastmileProbeTest:(AgoraLastmileProbeConfig *_Nullable)config;

/** Stops the last-mile network probe test.

@return * 0: Success.
* < 0: Failure.
*/
- (int)stopLastmileProbeTest;

#pragma mark Custom Video Module

/**-----------------------------------------------------------------------------
 * @name Custom Video Module
 * -----------------------------------------------------------------------------
 */

/** Sets the video source.

In real-time communications, the SDK uses the default video input source (the built-in camera) to publish streams. To use an external video source, call AgoraVideoSourceProtocol to set the custom video source and then use this method to add the external video source into the SDK.

 @param videoSource AgoraVideoSourceProtocol
 */
- (void)setVideoSource:(id<AgoraVideoSourceProtocol> _Nullable)videoSource;

/** Sets the local video renderer.

In real-time communications, the SDK uses the default video renderer to render the video. To use an external video renderer, call AgoraVideoSinkProtocol to set the custom local video renderer and then use this method to add the external renderer into the SDK.

 @param videoRenderer Sets the local video renderer. See AgoraVideoSinkProtocol.
 */
- (void)setLocalVideoRenderer:(id<AgoraVideoSinkProtocol> _Nullable)videoRenderer;

/** Sets the remote video renderer.

 This method sets the remote renderer. In real-time communications, the SDK uses the default video renderer to render the video. To use an external video renderer, call AgoraVideoSinkProtocol to set the custom remote video renderer and then use this method to add the external renderer into the SDK.

 @param videoRenderer Sets the video renderer of the remote user. See AgoraVideoSinkProtocol.
 @param userId ID of the remote user.
 */
- (void)setRemoteVideoRenderer:(id<AgoraVideoSinkProtocol> _Nullable)videoRenderer forUserId:(NSUInteger)userId;

/** Retrieves the video source.

  @return Video source. See AgoraVideoSourceProtocol.
 */
- (id<AgoraVideoSourceProtocol> _Nullable)videoSource;

/** Retrieves the local video renderer.

 @return Local video renderer. See AgoraVideoSinkProtocol.
 */
- (id<AgoraVideoSinkProtocol> _Nullable)localVideoRenderer;

/** Retrieves the video renderer of a specified remote user.

 @param userId ID of the remote user.
 @return Video renderer of the remote user. See AgoraVideoSinkProtocol.
 */
- (id<AgoraVideoSinkProtocol> _Nullable)remoteVideoRendererOfUserId:(NSUInteger)userId;


#pragma mark External Audio Data
/** Enables the external audio sink.
 
 This method applies to scenarios where you want to use external audio data for playback. After enabling the external audio sink, you can call the [pullPlaybackAudioFrameRawData]([AgoraRtcEngineKit pullPlaybackAudioFrameRawData:lengthInByte:]) / [pullPlaybackAudioFrameSampleBufferByLengthInByte]([AgoraRtcEngineKit pullPlaybackAudioFrameSampleBufferByLengthInByte:]) method to pull the remote audio data, process it, and play it with the audio effects that you want.
 
 @param sampleRate Sets the sample rate (Hz) of the external audio sink. You can set this parameter as 8000, 16000, 32000, 44100 or 48000.
 @param channels Sets the number of audio channels of the external audio sink:

 - 1: Mono
 - 2: Stereo
 
 @note Once you enable the external audio sink, the app will not retrieve any audio data from the `onPlaybackAudioFrame` callback.
 */
- (void)enableExternalAudioSink:(NSUInteger)sampleRate
                               channels:(NSUInteger)channels;

/** Disables the external audio sink.
 */
- (void)disableExternalAudioSink;

/** Pulls the remote audio data in the RawData format.
 
 Before calling this method, call the [enableExternalAudioSink]([AgoraRtcEngineKit enableExternalAudioSink:channels:]) method to enable and set the external audio sink.
 
 After a successful method call, the app pulls the decoded and mixed audio data for playback.

 **Note**
 
 - Once you call the [pullPlaybackAudioFrameRawData]([AgoraRtcEngineKit pullPlaybackAudioFrameRawData:lengthInByte:]) method successfully, the app will not retrieve any audio data from the `onPlaybackAudioFrame` callback.
 - The difference between the `onPlaybackAudioFrame` callback and the `pullPlaybackAudioFrameRawData` method is as follows:
    - `onPlaybackAudioFrame`: The SDK sends the audio data to the app once every 10 ms. Any delay in processing the audio frames may result in audio jitter.
    - `pullPlaybackAudioFrameRawData`: The app pulls the remote audio data autonomously. After setting the audio data parameters, the SDK adjusts the frame buffer and avoids problems caused by jitter in the external audio playback.
 
 @param data The audio data that you want to pull. The data format is in byte[].
 @param lengthInByte The data length (byte) of the external audio data. 
 
 The value of this parameter is related to the value of the `sampleRate` parameter that you set in the [enableExternalAudioSink]([AgoraRtcEngineKit enableExternalAudioSink:channels:]) method: lengthInByte = sampleRate / 100 * 2 * number of channels * time (ms).
 
 @return - YES: Success.
 - NO: Failure.
 */
- (BOOL)pullPlaybackAudioFrameRawData:(void * _Nonnull)data
                              lengthInByte:(NSUInteger)lengthInByte;

/** Pulls the remote audio data in the SampleBuffer format.

 Before calling this method, call the [enableExternalAudioSink]([AgoraRtcEngineKit enableExternalAudioSink:channels:]) method to enable and set the external audio sink.

 After a successful method call, the app pulls the decoded and mixed audio data for playback.

 **Note**

 - Once you call the [pullPlaybackAudioFrameSampleBufferByLengthInByte]([AgoraRtcEngineKit pullPlaybackAudioFrameSampleBufferByLengthInByte:]) method successfully, the app will not retrieve any audio data from the `onPlaybackAudioFrame` callback.
 - The difference between the `onPlaybackAudioFrame` callback and the `pullPlaybackAudioFrameSampleBufferByLengthInByte` method is as follows:
    - `onPlaybackAudioFrame`: The SDK sends the audio data to the app once every 10 ms. Any delay in processing the audio frames may result in audio jitter.
    - `pullPlaybackAudioFrameSampleBufferByLengthInByte`: The app pulls the remote audio data. After setting the audio data parameters, the SDK adjusts the frame buffer and avoids problems caused by jitter in the external audio playback.
 
 @param lengthInByte The data length (byte) of the external audio data. 
 
 The value of this parameter is related to the value of the sampleRate parameter that you set in the [enableExternalAudioSink]([AgoraRtcEngineKit enableExternalAudioSink:channels:]) method:

 - `lengthInByte` = `sampleRate` / 100 * 2 * number of channels * time (ms).
 - This parameter should be divisible by the value of sampleRate.

 @return - YES: Success.
 - NO: Failure.
 */
- (CMSampleBufferRef _Nullable)pullPlaybackAudioFrameSampleBufferByLengthInByte:(NSUInteger)lengthInByte;

/**-----------------------------------------------------------------------------
 * @name External Audio Data (push-mode only)
 * -----------------------------------------------------------------------------
 */

/** Enables the external audio source.

 Call this method before joining the channel.

 @param sampleRate       Sets the sample rate of the external audio source: 8000, 16000, 44100, or 48000 Hz.
 @param channelsPerFrame Sets the number of external audio source channels (two channels maximum).
 */
- (void)enableExternalAudioSourceWithSampleRate:(NSUInteger)sampleRate
                               channelsPerFrame:(NSUInteger)channelsPerFrame;

/** Disables the external audio source.
 */
- (void)disableExternalAudioSource;

/** Pushes the external raw audio frame data to the SDK for encoding.

 @param data      External audio data to be pushed.
 @param samples   Number of samples for the push.
 @param timestamp The timestamp of the external audio frame. It is mandatory. You can use this parameter for the following purposes:

 - Restore the order of the captured audio frame.
 - Synchronize audio and video frames in video-related scenarios, including scenarios where external video sources are used.
 @return * 0: Success.
* < 0: Failure.
 */
- (BOOL)pushExternalAudioFrameRawData:(void * _Nonnull)data
                              samples:(NSUInteger)samples
                            timestamp:(NSTimeInterval)timestamp;

/** Pushes the external CMSampleBuffer audio frame to the SDK for encoding.

 @param sampleBuffer Sample buffer for the push.
 @return * YES: Success.
* NO: Failure.
 */
- (BOOL)pushExternalAudioFrameSampleBuffer:(CMSampleBufferRef _Nonnull)sampleBuffer;


#pragma mark External Video Data

/**-----------------------------------------------------------------------------
 * @name External Video Data (push-mode only)
 * -----------------------------------------------------------------------------
 */

/** Configures the external video source.

 If an external video source is used, call this method before the [enableVideo](enableVideo) or [startPreview](startPreview)method.

 @param enable Sets whether or not to use an external video source:

 * YES: Use an external video source.
 * NO: (Default) Do not use an external video source.

 @param useTexture Sets whether or not to use texture as an input:

 * YES: Use texture as an input.
 * NO: Do not use texture as an input.

 @param pushMode Sets whether or not the external video source needs to call the [pushExternalVideoFrame](pushExternalVideoFrame:) method to send the video frame to the SDK:

 * YES: Use the push mode.
 * NO: Use the pull mode (not supported yet).
 */
- (void)setExternalVideoSource:(BOOL)enable useTexture:(BOOL)useTexture pushMode:(BOOL)pushMode;

/** Pushes the external video frame.

This method pushes the video frame using the AgoraVideoFrame class and passes the video frame to the SDK with the `format` parameter found in AgoraVideoFrame.
Call the [setExternalVideoSource](setExternalVideoSource:useTexture:pushMode:) method and set the `pushMode` parameter as `YES` before calling this method. Otherwise, a failure returns after calling this method.

**Note:**

 In the Communication profile, this method does not support pushing textured video frames.

 @param frame Video frame containing the SDK's encoded video data to be pushed. See AgoraVideoFrame.
 @return * YES: The frame is pushed successfully.
 * NO: Fails to push the frame.
 */
- (BOOL)pushExternalVideoFrame:(AgoraVideoFrame * _Nonnull)frame;


#pragma mark Raw Audio Data

/**-----------------------------------------------------------------------------
 * @name Raw Audio Data
 * -----------------------------------------------------------------------------
 */

/** Sets the audio recording format for the `onRecordAudioFrame` callback.

See [Modify Raw Data](https://docs.agora.io/en/Interactive%20Broadcast/rawdata_ios?platform=iOS).

 @param sampleRate     Sets the audio sample rate (`samplesPerSec`) returned in the `onRecordAudioFrame` callback, which can be set as 8000, 16000, 32000, 44100, or 48000 Hz.
 @param channel        Sets the number of audio channels (`channels`) returned in the `onRecordAudioFrame` callback, which can be set as 1 or 2:

- 1: Mono
- 2: Stereo
 @param mode      Sets the use mode of the `onRecordAudioFrame` callback. See AgoraAudioRawFrameOperationMode.
 @param samplesPerCall Sets the sample points (`samples`) returned in the `onRecordAudioFrame` callback. samplesPerCall is usually set as 1024 for stream pushing. samplesPerCall = (int)(samplesPerSec &times; sampleInterval &times; numChannels), where sampleInterval &ge; 0.01 in seconds.


 @return * 0: Success.
 * < 0: Failure.
 */
- (int)setRecordingAudioFrameParametersWithSampleRate:(NSInteger)sampleRate
                                              channel:(NSInteger)channel
                                                 mode:(AgoraAudioRawFrameOperationMode)mode
                                       samplesPerCall:(NSInteger)samplesPerCall;
/** Sets the audio playback format for the `onPlaybackAudioFrame` callback.

See [Modify Raw Data](https://docs.agora.io/en/Interactive%20Broadcast/rawdata_ios?platform=iOS).

 @param sampleRate     Sets the sample rate (`samplesPerSec`) returned in the `onPlaybackAudioFrame` callback, which can be set as 8000, 16000, 32000, 44100, or 48000 Hz.
 @param channel        Sets the number of audio channels (`channels`) returned in the `onPlaybackAudioFrame` callback, which can be set as 1 or 2:

  * 1: Mono
  * 2: Stereo
 @param mode           Sets the use mode of the `onPlaybackAudioFrame` callback. See AgoraAudioRawFrameOperationMode.
 @param samplesPerCall Sets the sample points (`samples`) returned in the `onPlaybackAudioFrame` callback. samplesPerCall is usually set as 1024 for stream pushing. samplesPerCall = (int)(samplesPerSec &times; sampleInterval &times; numChannels), where sampleInterval &ge; 0.01 in seconds.

 @return * 0: Success.
 * < 0: Failure.
 */
- (int)setPlaybackAudioFrameParametersWithSampleRate:(NSInteger)sampleRate
                                             channel:(NSInteger)channel
                                                mode:(AgoraAudioRawFrameOperationMode)mode
                                      samplesPerCall:(NSInteger)samplesPerCall;

/** Sets the mixed audio format for the `onMixedAudioFrame` callback.

See [Modify Raw Data](https://docs.agora.io/en/Interactive%20Broadcast/rawdata_ios?platform=iOS).

 @param sampleRate     Sets the sample rate (`samplesPerSec`) returned in the `onMixedAudioFrame` callback, which can be set as 8000, 16000, 32000, 44100, or 48000 Hz.
 @param samplesPerCall Sets the sample points (`samples`) returned in the `onMixedAudioFrame` callback. samplesPerCall is usually set as 1024 for stream pushing. samplesPerCall = (int)(samplesPerSec &times; sampleInterval &times; numChannels), where sampleInterval &ge; 0.01 in seconds.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setMixedAudioFrameParametersWithSampleRate:(NSInteger)sampleRate
                                   samplesPerCall:(NSInteger)samplesPerCall;


#pragma mark Watermark

/**-----------------------------------------------------------------------------
 * @name Watermark
 * -----------------------------------------------------------------------------
 */

/** Adds a watermark image to the local video or CDN live stream.

This method adds a PNG watermark to the local video stream for the recording device, channel audience, or CDN live audience to see and capture.

 To add the PNG file onto a CDN live publishing stream only, see the [setLiveTranscoding](setLiveTranscoding:) method.

**Note:**

* The URL descriptions are different for the local video and CDN live streams:
  * In a local video stream, `url` in AgoraImage refers to the absolute path of the added watermark image file in the local video stream.
  * In a CDN live stream, `url` in AgoraImage refers to the URL address of the added watermark image in the CDN live broadcast.
* The source file of the watermark image must be in the PNG file format. If the width and height of the PNG file differ from your settings in this method, the PNG file is cropped to conform to your settings.
* The SDK supports adding only one watermark image onto a local video or CDN live stream. The newly added watermark image replaces the previous one.
* If you set `orientationMode` as `Adaptive` in the [setVideoEncoderConfiguration](setVideoEncoderConfiguration:) method, the watermark image rotates with the video frame and rotates around the upper left corner of the watermark image.

@param watermark Watermark image to be added to the local video stream. See AgoraImage.

@return * 0: Success.
* < 0: Failure.
 */
- (int)addVideoWatermark:(AgoraImage * _Nonnull)watermark NS_SWIFT_NAME(addVideoWatermark(_:));

/** Removes the watermark image from the video stream added by [addVideoWatermark](addVideoWatermark:).

 @return * 0: Success.
* < 0: Failure.
 */
- (int)clearVideoWatermarks;


#pragma mark Stream Fallback

/**-----------------------------------------------------------------------------
 * @name Stream Fallback
 * -----------------------------------------------------------------------------
 */

/** Sets the priority of a remote user's stream.

Use this method with the [setRemoteSubscribeFallbackOption]([AgoraRtcEngineKit setRemoteSubscribeFallbackOption:]) method. If the fallback function is enabled for a remote stream, the SDK ensures the high-priority user gets the best possible stream quality.

**Note:**

The SDK supports setting userPriority as high for one user only.

 @param uid        The ID of the remote user.
 @param userPriority The priority of the remote user, see [AgoraUserPriority](AgoraUserPriority).
 @return * 0: Success.
 * <0: Failure.
 */
- (int)setRemoteUserPriority:(NSUInteger)uid
                        type:(AgoraUserPriority)userPriority;

/** Sets the fallback option for the locally published video stream based on the network conditions.

The default setting for `option` is `AgoraStreamFallbackOptionDisabled`, where there is no fallback behavior for the locally published video stream when the uplink network conditions are unreliable.

If `option` is set as `AgoraStreamFallbackOptionAudioOnly`, the SDK will:

 * Disable the upstream video but enable audio only when the network conditions deteriorate and cannot support both video and audio.
 * Re-enable the video when the network conditions improve.

 When the published video stream falls back to audio only or when the audio-only stream switches back to the video, the SDK triggers the [didLocalPublishFallbackToAudioOnly]([AgoraRtcEngineDelegate rtcEngine:didLocalPublishFallbackToAudioOnly:]) callback.

 **Note:**

 Agora does not recommend using this method for CDN live streaming, because the remote CDN live user will have a noticeable lag when the published video stream falls back to audio-only.

 @param option Sets the fallback option for the published video stream. The default value is AgoraStreamFallbackOptionDisabled. See AgoraStreamFallbackOptions.
 @return * 0: Success.
* < 0: Failure.
 */
- (int)setLocalPublishFallbackOption:(AgoraStreamFallbackOptions)option;

/** Sets the fallback option for the remotely subscribed video stream based on the network conditions.

The default setting for `option` is `AgoraStreamFallbackOptionVideoStreamLow`, where the remotely subscribed video stream falls back to the low-stream (low resolution and low bitrate) video under unreliable downlink network conditions.

If `option` is set as `AgoraStreamFallbackOptionAudioOnly`, the SDK automatically switches the video from a high stream to a low stream, or disables the video when the downlink network conditions cannot support both audio and video to guarantee the quality of the audio. The SDK monitors the network quality and re-enables the video stream when the network conditions improve.
 When the remotely subscribed video stream falls back to audio only or when the audio-only stream switches back to the video, the SDK triggers the [didRemoteSubscribeFallbackToAudioOnly]([AgoraRtcEngineDelegate  rtcEngine:didRemoteSubscribeFallbackToAudioOnly:byUid:]) callback.

 @param option Sets the fallback option for the remotely subscribed video stream. The default value is `AgoraStreamFallbackOptionVideoStreamLow`. See AgoraStreamFallbackOptions.
 @return * 0: Success.
* < 0: Failure.
 */
- (int)setRemoteSubscribeFallbackOption:(AgoraStreamFallbackOptions)option;


#pragma mark Dual-stream Mode

/**-----------------------------------------------------------------------------
 * @name Dual-stream Mode
 * -----------------------------------------------------------------------------
 */

/** Enables/Disables dual-stream mode. (Live broadcast only.)

If dual-stream mode is enabled, the receiver can choose to receive the high-stream (high-resolution high-bitrate) or low-stream (low-resolution low-bitrate) video.

 @param enabled Sets the stream mode:

 * YES: Dual-stream mode.
 * NO: (Default) Single-stream mode.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)enableDualStreamMode:(BOOL)enabled;

/** Sets the remote user’s video stream type received by the local user when the remote user sends dual streams.

This method allows the app to adjust the corresponding video-stream type based on the size of the video window to reduce the bandwidth and resources.

 * If the remote user enables dual-stream mode by calling the [enableDualStreamMode](enableDualStreamMode:) method, the SDK receives the high-stream video by default. You can use this method to switch to the low-stream video.
 * If dual-stream mode is not enabled, the SDK receives the high-stream video by default.

 The method result returns in the [didApiCallExecute]([AgoraRtcEngineDelegate rtcEngine:didApiCallExecute:api:result:]) callback. The SDK receives the high-stream video by default to save the bandwidth. If needed, users may use this method to switch to the low-stream video.

 By default, the aspect ratio of the low-stream video is the same as the high-stream video. Once the resolution of the high-stream video is set, the system automatically sets the resolution, frame rate, and bitrate for the low-stream video.

 @param uid        ID of the remote user sending the video stream.
 @param streamType  Sets the video-stream type. See AgoraVideoStreamType.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setRemoteVideoStream:(NSUInteger)uid
                       type:(AgoraVideoStreamType)streamType;

/** Sets the default video-stream type for the video received by the local user when the remote user sends dual streams.

 @param streamType Sets the default video-stream type. See AgoraVideoStreamType.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setRemoteDefaultVideoStreamType:(AgoraVideoStreamType)streamType;


#pragma mark Encryption

/**-----------------------------------------------------------------------------
 * @name Encryption
 * -----------------------------------------------------------------------------
 */

/** Enables built-in encryption with an encryption password before joining a channel.

All users in a channel must set the same encryption password. The encryption password is automatically cleared once a user leaves the channel.

  If the encryption password is not specified or set to empty, the encryption functionality is disabled.

 **Note:**

 - Do not use this method for CDN live streaming.
 - For optimal transmission, ensure that the encrypted data size does not exceed the original data size + 16 bytes. 16 bytes is the maximum padding size for AES encryption.

 @param secret Encryption password.
 @return * 0: Success.
* < 0: Failure.
 */
- (int)setEncryptionSecret:(NSString * _Nullable)secret;

/** Sets the built-in encryption mode.

 The SDK supports built-in encryption, which is set to the `"aes-128-xts"
` mode by default. Call this method to use other encryption modes.

 All users in the same channel must use the same encryption mode and password.

 Refer to the information related to the AES encryption algorithm on the differences between the encryption modes.

 **Note:**

 - Call the [setEncryptionSecret](setEncryptionSecret:) method to enable the built-in encryption function before calling this method.
 - Do not use this method for CDN live streaming.

 @param encryptionMode Sets the encryption mode.

 - "aes-128-xts": (default) 128-bit AES encryption, XTS mode.
 - "aes-256-xts": 256-bit AES encryption, XTS mode.
 - "aes-128-ecb": 128-bit AES encryption, ECB mode.

When `encryptionMode` is set as NULL, the encryption mode is set as "aes-128-xts" by default.

 @return * 0: Success.
 * < 0: Failure.
 */
- (int)setEncryptionMode:(NSString * _Nullable)encryptionMode;


#pragma mark Inject an Online Media Stream

/**-----------------------------------------------------------------------------
 * @name Inject an Online Media Stream
 * -----------------------------------------------------------------------------
 */

/** Adds a voice or video stream RTMP URL address to a live broadcast.

 The [streamPublishedWithUrl]([AgoraRtcEngineDelegate rtcEngine:streamPublishedWithUrl:errorCode:]) callback returns the inject stream status.

 If this method call is successful, the server pulls the voice or video stream and injects it into a live channel. This is applicable to scenarios where all audience members in the channel can watch a live show and interact with each other.

 The addInjectStreamUrl method call triggers the following callbacks:

 - The local client:

   - [streamInjectedStatusOfUrl]([AgoraRtcEngineDelegate rtcEngine:streamInjectedStatusOfUrl:uid:status:]), with the state of the injecting the online stream.
   - [didJoinedOfUid]([AgoraRtcEngineDelegate rtcEngine:didJoinedOfUid:elapsed:])(uid: 666), if the method call is successful and the online media stream is injected into the channel.

 - The remote client:

   - [didJoinedOfUid]([AgoraRtcEngineDelegate rtcEngine:didJoinedOfUid:elapsed:])(uid: 666), if the method call is successful and the online media stream is injected into the channel.

 **Note:**

 - Contact support@agora.io to enable the CDN streaming function before calling this method.
 - This method applies to the Native SDK v2.4.1 and later.
 @param url    URL address to be added to the ongoing live broadcast. Valid protocols are RTMP, HLS, and FLV.

- Supported FLV audio codec type: AAC.
- Supported FLV video codec type: H264 (AVC).
 @param config AgoraLiveInjectStreamConfig object which contains the configuration information for the added voice or video stream.

@return * 0: Success.
* < 0: Failure.
    - `AgoraErrorCodeInvalidArgument`(2): The injected URL does not exist. Call this method again to inject the stream and ensure that the URL is valid.
    - `AgoraErrorCodeNotReady`(3): The user is not in the channel.
    - `AgoraErrorCodeNotSupported`(4): The channel profile is not Live Broadcast. Call the [setChannelProfile]([AgoraRtcEngineKit setChannelProfile:]) method and set the channel profile to Live Broadcast before calling this method.
    - `AgoraErrorCodeNotInitialized`(7): The SDK is not initialized. Ensure that the RtcEngine object is initialized before using this method.

*/
- (int)addInjectStreamUrl:(NSString * _Nonnull)url config:(AgoraLiveInjectStreamConfig * _Nonnull)config;

/** Removes the voice or video stream RTMP URL address from a live broadcast.

 This method removes the URL address (added by the [addInjectStreamUrl](addInjectStreamUrl:config:) method) from a live broadcast.

 If this method call is successful, the SDK triggers the [didOfflineOfUid]([AgoraRtcEngineDelegate rtcEngine:didOfflineOfUid:reason:]) callback and returns a stream uid of 666.

 @param url URL address of the added stream to be removed.
 @return * 0: Success.
 * < 0: Failure.
 */
- (int)removeInjectStreamUrl:(NSString * _Nonnull)url;


#pragma mark CDN Live Streaming

/**-----------------------------------------------------------------------------
 * @name CDN Live Streaming
 * -----------------------------------------------------------------------------
 */

/** Publishes the local stream to the CDN.

 This method call triggers the [rtmpStreamingChangedToState]([AgoraRtcEngineDelegate rtcEngine:rtmpStreamingChangedToState:state:errorCode:]) callback on the local client to report the state of adding a local stream to the CDN.

 **Note:**

 - This method applies to live-broadcast profile only.
 - Ensure that the user joins the channel before calling this method.
 - This method adds only one stream URL each time it is called.
 - The URL must not contain special characters, such as Chinese language characters.

 @param url  The CDN streaming URL in the RTMP format. The maximum length of this parameter is 1024 bytes.
 @param transcodingEnabled Sets whether transcoding is enabled/disabled:

 - YES: Enable transcoding. To [transcode](https://docs.agora.io/en/Agora%20Platform/terms?platform=All%20Platforms#transcoding) the audio or video streams when publishing them to CDN live, often used for combining the audio and video streams of multiple hosts in CDN live.
 - NO: Disable transcoding.

 @return * 0: Success.
 * < 0: Failure.

  - AgoraErrorCodeInvalidArgument(2): Invalid parameter. The URL is nil or the string length is 0.
  - AgoraErrorCodeNotInitialized(7): You have not initialized the RTC Engine when publishing the stream.
 */
- (int)addPublishStreamUrl:(NSString * _Nonnull)url transcodingEnabled:(BOOL)transcodingEnabled;

/** Removes an RTMP stream from the CDN.

This method removes the RTMP URL address added by the [addPublishStreamUrl](addPublishStreamUrl:transcodingEnabled:) method from a CDN live stream.

This method call triggers the [rtmpStreamingChangedToState]([AgoraRtcEngineDelegate rtcEngine:rtmpStreamingChangedToState:state:errorCode:]) callback on the local client to report the state of removing an RTMP stream from the CDN.

 **Note:**

 * This method applies to live-broadcast profile only.
 * This method removes only one URL each time it is called.
 * The URL must not contain special characters, such as Chinese language characters.

 @param url The RTMP URL address to be removed. The maximum length of this parameter is 1024 bytes.

 @return * 0: Success.
 * < 0: Failure.
 */
- (int)removePublishStreamUrl:(NSString * _Nonnull)url;

/** Sets the video layout and audio settings for CDN live. (CDN live only.)

@note This method applies to live-broadcast profile only.
 @param transcoding Sets the CDN live audio/video transcoding settings. See AgoraLiveTranscoding.

 @return * 0: Success.
 * < 0: Failure.
 */
- (int)setLiveTranscoding:(AgoraLiveTranscoding *_Nullable)transcoding;


#pragma mark Data Stream

/**-----------------------------------------------------------------------------
 * @name Data Stream
 * -----------------------------------------------------------------------------
 */

/** Creates a data stream.

 Each user can create up to five data streams during the lifecycle of the [AgoraRtcEngineKit](AgoraRtcEngineKit).

 **Note:**

 Set both the `reliable` and `ordered` parameters to `YES` or `NO`. Do not set one as `YES` and the other as `NO`.

 @param streamId ID of the created data stream.
 @param reliable Sets whether or not the recipients are guaranteed to receive the data stream from the sender within five seconds:

 * YES: The recipients receive the data stream from the sender within five seconds. If the recipient does not receive the data stream within five seconds, an error is reported to the app.
 * NO: There is no guarantee that the recipients receive the data stream within five seconds and no error message is reported for any delay or missing data stream.

 @param ordered  Sets whether or not the recipients receive the data stream in the sent order:

 * YES: The recipients receive the data stream in the sent order.
 * NO: The recipients do not receive the data stream in the sent order.

 @return * 0: Success.
* < 0: Failure.
*/
- (int)createDataStream:(NSInteger * _Nonnull)streamId
               reliable:(BOOL)reliable
                ordered:(BOOL)ordered;

/** Sends data stream messages to all users in a channel.

The SDK has the following restrictions on this method:

* Up to 30 packets can be sent per second in a channel with each packet having a maximum size of 1 kB.
* Each client can send up to 6 kB of data per second.
* Each user can have up to five data streams simultaneously.

A successful sendStreamMessage method call triggers the [receiveStreamMessageFromUid]([AgoraRtcEngineDelegate rtcEngine:receiveStreamMessageFromUid:streamId:data:]) callback on the remote client, from which the remote user gets the stream message.

A failed sendStreamMessage method call triggers the [didOccurStreamMessageErrorFromUid]([AgoraRtcEngineDelegate rtcEngine:didOccurStreamMessageErrorFromUid:streamId:error:missed:cached:]) callback on the remote client.

 **Note:**

 This method applies only to the Communication profile or to the hosts in the Live-broadcast profile. If an audience in the Live-broadcast profile calls this method, the audience role may be changed to a host.

 @param streamId ID of the sent data stream returned in the [createDataStream](createDataStream:reliable:ordered:) method.
 @param data   Sent data.

 @return * 0: Success.
 * < 0: Failure.
*/
- (int)sendStreamMessage:(NSInteger)streamId
                    data:(NSData * _Nonnull)data;


#pragma mark Miscellaneous Video Control

/**-----------------------------------------------------------------------------
 * @name Miscellaneous Video Control
 * -----------------------------------------------------------------------------
 */

/** Sets the local video mirror mode.

 Use this method before calling the startPreview method, or the mirror mode does not take effect until you re-enable startPreview.

 @param mode Sets the local video mirror mode. See AgoraVideoMirrorMode.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setLocalVideoMirrorMode:(AgoraVideoMirrorMode)mode;

/** Sets the camera capture preference.

For a video call or live broadcast, generally the SDK controls the camera output parameters. When the default camera capture settings do not meet special requirements or cause performance problems, we recommend using this method to set the camera capture preference:

* If the resolution or frame rate of the captured raw video data is higher than that set by setVideoEncoderConfiguration, processing video frames requires extra CPU and RAM usage and degrades performance. We recommend setting `configuration` as AgoraCameraCaptureOutputPreferencePerformance(1) to avoid such problems.
* If you do not need local video preview or are willing to sacrifice preview quality, we recommend setting `configuration` as AgoraCameraCaptureOutputPreferencePerformance(1) to optimize CPU and RAM usage.
* If you want better quality for the local video preview, we recommend setting `configuration` as AgoraCameraCaptureOutputPreferencePreview(2).

**Note:**

Call this method before enabling the local camera. That said, you can call this method before calling `joinChannel`, `enableVideo`, or `enableLocalVideo`, depending on which method you use to turn on your local camera.

@param configuration The camera capturer configuration, see AgoraCameraCapturerConfiguration.

@return * 0: Success.
* < 0: Failure.
 */
- (int)setCameraCapturerConfiguration:(AgoraCameraCapturerConfiguration * _Nullable)configuration;


#if TARGET_OS_IPHONE
#pragma mark Camera Control

/**-----------------------------------------------------------------------------
 * @name Camera Control
 * -----------------------------------------------------------------------------
 */

/** Switches between front and rear cameras. (iOS only)

 @return * 0: Success.
* < 0: Failure.
 */
- (int)switchCamera;

/** Checks whether the camera zoom function is supported. (iOS only.)

 @return * YES: The device supports the camera zoom function.
 * NO: The device does not support the camera zoom function.
 */
- (BOOL)isCameraZoomSupported;

/** Checks whether the camera flash function is supported. (iOS only.)

 **Note:**

 The app generally enables the front camera by default. If your front camera flash is not supported, this method returns `NO`. If you want to check if the rear camera flash is supported, call the switchCamera method before calling this method.

 @return * YES: The device supports the camera flash function.
 * NO: The device does not support the camera flash function.
 */
- (BOOL)isCameraTorchSupported;

/** Checks whether the camera manual focus function is supported. (iOS only)

 @return * YES: The device supports the camera manual focus function.
 * NO: The device does not support the camera manual focus function.
 */
- (BOOL)isCameraFocusPositionInPreviewSupported;

/** Checks whether the camera manual exposure function is supported. (iOS only)

 @return * YES: The device supports the manual exposure function.
 * NO: The device does not support the manual exposure function.
 */
- (BOOL)isCameraExposurePositionSupported;

/** Checks whether the camera auto-face focus function is supported. (iOS only)

 @return * YES: The device supports the camera auto-face focus function.
 * NO: The device does not support the camera auto-face focus function.
 */
- (BOOL)isCameraAutoFocusFaceModeSupported;

/** Sets the camera zoom ratio. (iOS only)

 @param zoomFactor Sets the camera zoom factor. The value ranges between 1.0 and the maximum zoom supported by the device.

 @return * The set camera zoom factor, if this method call is successful.
 * < 0: Failure.
 */
- (CGFloat)setCameraZoomFactor:(CGFloat)zoomFactor;

/** Sets the manual focus position. (iOS only)

A successful setCameraFocusPositionInPreview method call triggers the o[cameraFocusDidChangedToRect]([AgoraRtcEngineDelegate rtcEngine:cameraFocusDidChangedToRect:]) callback on the local client.

 @param position Coordinates of the touch point in the view.

 @return * YES: Success.
* NO: Failure.
 */
- (BOOL)setCameraFocusPositionInPreview:(CGPoint)position;

/** Sets the camera exposure position. (iOS only)

A successful setCameraExposurePosition method call triggers the [cameraExposureDidChangedToRect]([AgoraRtcEngineDelegate rtcEngine:cameraExposureDidChangedToRect:]) callback on the local client.

 @param positionInView Coordinates of the touch point in the view.

 @return * YES: Success.
 * NO: Failure.
 */
- (BOOL)setCameraExposurePosition:(CGPoint)positionInView;

/** Enables the camera flash function. (iOS only.)

 @param isOn * YES: Enable the camera flash function.
 * NO: Disable the camera flash function.

 @return * YES: Success.
* NO: Failure.
 */
- (BOOL)setCameraTorchOn:(BOOL)isOn;

/** Enables the camera auto-face focus function. (iOS only.)

 @param enable * YES: Enable the camera auto-face focus function.
 * NO: (Default) Disable the camera auto-face focus function.

 @return * YES: Success.
* NO: Failure.
 */
- (BOOL)setCameraAutoFocusFaceModeEnabled:(BOOL)enable;

#endif


#if (!(TARGET_OS_IPHONE) && (TARGET_OS_MAC))
#pragma mark Screen Sharing

/**-----------------------------------------------------------------------------
 * @name Screen Sharing
 * -----------------------------------------------------------------------------
 */

/** Shares the whole or part of a screen by specifying the display ID.  (macOS only.)

@param displayId The display ID of the screen to be shared. This parameter specifies which screen you want to share. For information on how to get the displayId, see [Share the Screen](../../../screensharing_mac).
@param rectangle (Optional) The relative location of the region to the screen. nil means sharing the whole screen. This parameter contains the following properties:

- x: the horizontal offset from the top-left corner.
- y: the vertical offset from the top-left corner.
- width: the width of the region.
- height: the height of the region.

If the specified region overruns the screen, the SDK shares only the region within it; if you set width or height as 0, the SDK shares the whole screen.
@param captureParams The screen sharing encoding parameters, see [AgoraScreenCaptureParameters](AgoraScreenCaptureParameters).

@return * 0: Success.
* < 0: Failure.

    - `ERR_INVALID_STATE`: the screen sharing state is invalid, probably because another screen or window is being shared. Call [stopScreenCapture]([AgoraRtcEngineKit stopScreenCapture]) to stop the current screen sharing.
    - `ERR_INVALID_ARGUMENT`: the argument is invalid.
 */
- (int)startScreenCaptureByDisplayId:(NSUInteger)displayId
                           rectangle:(CGRect)rectangle
                          parameters:(AgoraScreenCaptureParameters * _Nonnull)captureParams;

/** Shares the whole or part of a window by specifying the window ID. (macOS only.)

@param windowId The ID of the window to be shared. This parameter specifies which window you want to share. For information on how to get the windowId, see [Share the Screen](../../../screensharing_mac).
@param rectangle (Optional) The relative location of the region to the window. nil means sharing the whole window. This parameter contains the following properties:

- x: the horizontal offset from the top-left corner.
- y: the vertical offset from the top-left corner.
- width: the width of the region.
- height: the height of the region.

If the specified region overruns the window, the SDK shares only the region within it; if you set width or height as 0, the SDK shares the whole window.
@param captureParams The window sharing encoding parameters, see [AgoraScreenCaptureParameters](AgoraScreenCaptureParameters).

@return * 0: Success.
* < 0: Failure.

    - `ERR_INVALID_STATE`: the window sharing state is invalid, probably because another screen or window is being shared. Call [stopScreenCapture]([AgoraRtcEngineKit stopScreenCapture]) to stop sharing the current window.
    - `ERR_INVALID_ARGUMENT`: the argument is invalid.
 */
- (int)startScreenCaptureByWindowId:(NSUInteger)windowId
                          rectangle:(CGRect)rectangle
                         parameters:(AgoraScreenCaptureParameters * _Nonnull)captureParams;

/** Sets the content hint for screen sharing. (macOS only.)

A content hint suggests the type of the content being shared, so that the SDK applies different optimization algorithm to different types of content.

@param contentHint The content hint for screen sharing, see [AgoraVideoContentHint](AgoraVideoContentHint).

@return * 0: Success.
* < 0: Failure.
*/
- (int)setScreenCaptureContentHint:(AgoraVideoContentHint)contentHint;

/** Updates the screen sharing parameters. (macOS only.)

@param captureParams The screen sharing encoding parameters, see [AgoraScreenCaptureParameters](AgoraScreenCaptureParameters).

@return * 0: Success.
* < 0: Failure.

    - `ERR_NOT_READY`: no screen or windows is being shared.
 */
- (int)updateScreenCaptureParameters:(AgoraScreenCaptureParameters * _Nonnull)captureParams;

/** Updates the screen-sharing region. (macOS only.)

 @param rect The relative location of the region to the screen or window. nil means sharing the whole screen or window. This parameter contains the following properties:

- x: the horizontal offset from the top-left corner.
- y: the vertical offset from the top-left corner.
- width: the width of the region.
- height: the height of the region.

If the specified region overruns the screen or window, the SDK shares only the region within it; if you set width or height as 0, the SDK shares the whole screen or window.

@return * 0: Success.
* < 0: Failure.

    - `ERR_NOT_READY`: no screen or windows is being shared.
*/
- (int)updateScreenCaptureRegion:(CGRect)rect;

/** Stops screen sharing. (macOS only.)

 @return * 0: Success.
* < 0: Failure.
 */
- (int)stopScreenCapture;

#endif


#if (!(TARGET_OS_IPHONE) && (TARGET_OS_MAC))
#pragma mark Device Manager (macOS)
/**-----------------------------------------------------------------------------
 * @name Device Manager (macOS only)
 * -----------------------------------------------------------------------------
 */

/** Monitors the change of a device state. (macOS only.)

 Use this method to monitor the plugging and swapping of external audio/video devices. For example, an external camera.

 @param enabled - YES: Enable the monitoring of a device state change.
 - NO: Disable the monitoring of a device state change.
 */
- (void)monitorDeviceChange:(BOOL)enabled;

/** Retrieves all devices in the system. (macOS only.)

 **Note:**

 Do not call this method in the main thread.

 This method returns an NSArray object, including all audio/video devices in the system.
 Your app can use the AgoraRtcDeviceInfo array object to enumerate the devices.

 @param type Device type: AgoraMediaDeviceType.
 @return An AgoraRtcDeviceInfo NSArray object including all devices, if this method call is successful.
 */
- (NSArray<AgoraRtcDeviceInfo *> * _Nullable)enumerateDevices:(AgoraMediaDeviceType)type;

/** Retrieves the device information; such as a recording, playback, or video-capture device. (macOS only.)

 @param type Device type: AgoraMediaDeviceType.
 @return * The device information (AgoraRtcDeviceInfo), if this method call is successful.
 * nil: Failure.
 */
- (AgoraRtcDeviceInfo * _Nullable)getDeviceInfo:(AgoraMediaDeviceType)type;

/** Sets the playback, recording, or audio-sampling device. (macOS only.)

 @param type    Device type: AgoraMediaDeviceType.
 @param deviceId Device ID of the device, which can be retrieved by calling the [enumerateDevices](enumerateDevices:)method. `deviceId` does not change when the device is plugged or unplugged.
 @return * 0: Success.
* < 0: Failure.
 */

- (int)setDevice:(AgoraMediaDeviceType)type deviceId:(NSString * _Nonnull)deviceId;

/** Retrieves the specified device's volume. (macOS only.)

 @param type Device type: AgoraMediaDeviceType.
 @return * Returns the volume, if this method call is successful.

* < 0: Failure.
 */
- (int)getDeviceVolume:(AgoraMediaDeviceType)type;

/** Sets the specified device's volume. (macOS only.)

 @param type   Device type: AgoraMediaDeviceType
 @param volume Sets the specified device's volume. The value ranges between 0 and 100.
 @return * 0: Success.
* < 0: Failure.
 */
- (int)setDeviceVolume:(AgoraMediaDeviceType)type volume:(int)volume;

/** Starts the microphone test. (macOS only.)

 This method tests whether the microphone works properly. Once the test starts, the SDK reports the volume information by using the [reportAudioVolumeIndicationOfSpeakers]([AgoraRtcEngineDelegate rtcEngine:reportAudioVolumeIndicationOfSpeakers:totalVolume:]) callback.

 @param indicationInterval Interval period (ms) of the [reportAudioVolumeIndicationOfSpeakers]([AgoraRtcEngineDelegate rtcEngine:reportAudioVolumeIndicationOfSpeakers:totalVolume:]) callback cycle.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)startRecordingDeviceTest:(int)indicationInterval;

/** Stops the microphone test. (macOS only.)

 This method stops testing the microphone. You must call this method to stop the test after calling the [startRecordingDeviceTest](startRecordingDeviceTest:) method.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)stopRecordingDeviceTest;

 /** Starts an audio playback device test. (macOS only.)

 This method tests whether the audio playback device works properly with a specified playback audio file.

 @param audioFileName Absolute path of the audio file for the test in UTF-8:

 - Supported file formats: wav, mp3, m4a, and aac.
 - Supported file sample rates: 8000, 16000, 32000, 44100, and 48000 Hz.

 @return * 0: Success, and you can hear the playback of the specified audio file.
* < 0: Failure.
 */
- (int)startPlaybackDeviceTest:(NSString * _Nonnull)audioFileName;

/** Stops the audio playback device test. (macOS only.)

 This method stops testing the audio playback device. You must call this method to stop the test after calling the [startPlaybackDeviceTest](startPlaybackDeviceTest:) method.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)stopPlaybackDeviceTest;

/** Starts a video-capture device test. (macOS only.)

 This method tests whether the video-capture device works properly. Ensure that you call the [enableVideo](enableVideo) method before calling this method and that the parameter view window is valid.

 @param view Input parameter for displaying the video window.

 @return * 0: Success.
* < 0: Failure.

 */
- (int)startCaptureDeviceTest:(NSView * _Nonnull)view;

/** Stops the video-capture device test. (macOS only.)

 This method stops testing the video-capture device. You must call this method to stop the test after calling the [startCaptureDeviceTest](startCaptureDeviceTest:) method.

 @return * 0: Success.
* < 0: Failure.

 */
- (int)stopCaptureDeviceTest;

/** Starts the audio device loopback test. (macOS only.)

This method tests whether the local audio devices are working properly. After calling this method, the microphone captures the local audio and plays it through the speaker. The [reportAudioVolumeIndicationOfSpeakers]([AgoraRtcEngineDelegate rtcEngine:reportAudioVolumeIndicationOfSpeakers:totalVolume:]) callback returns the local audio volume information at the set interval.

**Note:**

This method tests the local audio devices and does not report the network conditions.

@param indicationInterval The time interval (ms) at which the [reportAudioVolumeIndicationOfSpeakers]([AgoraRtcEngineDelegate rtcEngine:reportAudioVolumeIndicationOfSpeakers:totalVolume:]) callback returns. We recommend setting it as greater than 200 ms. The minimum value is 10 ms.

@return * 0: Success.
* < 0: Failure.
*/
-(int)startAudioDeviceLoopbackTest:(int)indicationInterval;

/** Stops the audio device loopback test. (macOS only.)

Ensure that you call this method to stop the loopback test after calling the [startAudioDeviceLoopbackTest]([AgoraRtcEngineKit startAudioDeviceLoopbackTest:]) method.

@return * 0: Success.
* < 0: Failure.
*/
-(int)stopAudioDeviceLoopbackTest;
#endif

#pragma mark Custom Media Metadata

/**-----------------------------------------------------------------------------
 * @name Media Metadata
 * -----------------------------------------------------------------------------
 */

/** Sets the data source of the metadata.

 You need to implement the [AgoraMediaMetadataDataSource](AgoraMediaMetadataDataSource) protocol and specify the type of metadata in this method.

 Use this method with the [setMediaMetadataDelegate]([AgoraRtcEngineKit setMediaMetadataDelegate:withType:]) method to add synchronized metadata in the video stream. You can create more diversified live broadcast interactions, such as sending shopping links, digital coupons, and online quizzes.

 @note Call this method before the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method.
 @note This method applies to the live broadcast channel profile only.

 @param metadataDataSource The AgoraMediaMetadataDataSource protocol.
 @param type The metadata type. See [AgoraMetadataType](AgoraMetadataType). Currently, the SDK supports video metadata only.
 @return * YES: Success.
 * NO: Failure.
 */
- (BOOL)setMediaMetadataDataSource:(id<AgoraMediaMetadataDataSource> _Nullable) metadataDataSource withType:(AgoraMetadataType)type;

/** Sets the delegate of the metadata.

 You need to implement the AgoraMediaMetadataDelegate protocol and specify the type of metadata in this method.

 @note Call this method before the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method.
 @note This method applies to the live broadcast channel profile only.

 @param metadataDelegate The AgoraMediaMetadataDelegate protocol.
 @param type The metadata type. See [AgoraMetadataType](AgoraMetadataType). Currently, the SDK supports video metadata only.
 @return * YES: Success.
 * NO: Failure.
 */
- (BOOL)setMediaMetadataDelegate:(id<AgoraMediaMetadataDelegate> _Nullable) metadataDelegate withType:(AgoraMetadataType)type;

#pragma mark Miscellaneous Methods

/**-----------------------------------------------------------------------------
 * @name Miscellaneous Methods
 * -----------------------------------------------------------------------------
 */

/** Retrieves the current call ID.

 When a user joins a channel on a client, a `callId` is generated to identify the call from the client. Feedback methods, such as the [rate](rate:rating:description:) and [complain](complain:description:) methods, must be called after the call ends to submit feedback to the SDK.

 The [rate](rate:rating:description:) and [complain](complain:description:) methods require the `callId` parameter retrieved from the `getCallId` method during a call. *callId* is passed as an argument into the [rate](rate:rating:description:) and [complain](complain:description:) methods after the call ends.

 @return callId The current call ID.
 */
- (NSString * _Nullable)getCallId;

/** Allows a user to rate a call after the call ends.

 @param callId      Call ID retrieved from the [getCallId]([AgoraRtcEngineKit getCallId]) method.
 @param rating      Rating of the call. The value is between 1 (lowest score) and 5 (highest score). If you set a value out of this range, the AgoraErrorCodeInvalidArgument(-2) error occurs.
 @param description (Optional) Description of the rating. The string length must be less than 800 bytes.

 @return * 0: Success.
 * < 0: Failure.

     * Return AgoraErrorCodeInvalidArgument(-2)：The passed argument is invalid. For example, `callId` is invalid.
     * Return AgoraErrorCodeNotReady(-3)：The SDK status is incorrect. For example, initialization fails.
 */
- (int)rate:(NSString * _Nonnull)callId
     rating:(NSInteger)rating
description:(NSString * _Nullable)description;

/** Allows a user to complain about the call quality after a call ends.

 @param callId      Call ID retrieved from the getCallId method.
 @param description (Optional) Description of the complaint. The string length must be less than 800 bytes.

 @return * 0: Success.
 * < 0: Failure.
 */
- (int)complain:(NSString * _Nonnull)callId
    description:(NSString * _Nullable)description;

/** Enables/Disables dispatching delegate methods to the main queue.

 If disabled, the app should dispatch UI operations to the main queue.

 @param enabled Sets whether or not to dispatch delegate methods to the main queue:

 * YES: Dispatch delegate methods to the main queue.
 * NO: Do not dispatch delegate methods to the main queue

 @return * 0: Success.
* < 0: Failure.
 */
- (int)enableMainQueueDispatch:(BOOL)enabled;

/** Retrieves the SDK version.

 This method returns the string of the version number.

 @return The version of the current SDK in the string format. For example, 2.3.0
 */
+ (NSString * _Nonnull)getSdkVersion;

/** Specifies an SDK output log file.

The log file records all log data for the SDK’s operation. Ensure that the directory to save the log file exists and is writable.

 **Note:**

 - The default log file location is as follows:
   - iOS: `App Sandbox/Library/caches/agorasdk.log`
   - macOS
     - Sandbox enabled: `App Sandbox/Library/Logs/agorasdk.log`, for example `/Users/<username>/Library/Containers/<App Bundle Identifier>/Data/Library/Logs/agorasdk.log`.
     - Sandbox disabled: `～/Library/Logs/agorasdk.log`.
 - Ensure that you call this method immediately after calling the [sharedEngineWithAppId]([AgoraRtcEngineKit sharedEngineWithAppId:delegate:]) method, otherwise the output log might not be complete.

 @param filePath Absolute path of the log file. The string of the log file is in UTF-8.

 @return * 0: Success.
 * < 0: Failure.
 */
- (int)setLogFile:(NSString * _Nonnull)filePath;

/** Sets the output log level of the SDK.

You can use one or a combination of the filters. The log level follows the sequence of OFF, CRITICAL, ERROR, WARNING, INFO, and DEBUG. Choose a level to see the logs preceding that level.

For example, if you set the log level to WARNING, you see the logs within levels CRITICAL, ERROR, and WARNING.

 @param filter Log filter level: AgoraLogFilter.

 @return * 0: Success.
 * < 0: Failure.
 */
- (int)setLogFilter:(NSUInteger)filter;

/** Sets the log file size (KB).

The SDK has two log files, each with a default size of 512 KB. If you set fileSizeInBytes as 1024 KB, the SDK outputs log files with a total maximum size of 2 MB. If the total size of the log files exceed the set value, the new output log files overwrite the old output log files.

@param fileSizeInKBytes The SDK log file size (KB).

@return * 0: Success.
* < 0: Failure.
*/
- (int)setLogFileSize:(NSUInteger)fileSizeInKBytes;

/** Returns the native handler of the SDK engine.

 This interface is used to get the native C++ handler of the SDK engine used in special scenarios, such as registering the audio and video frame observer.
 */
- (void * _Nullable)getNativeHandle;

/** Sets and retrieves the SDK delegate.

 The SDK uses the delegate to inform the app on engine runtime events. All methods defined in the delegate are optional implementation methods.

 */
@property (nonatomic, weak) id<AgoraRtcEngineDelegate> _Nullable delegate;


#pragma mark Customized Methods (Technical Preview)

/**-----------------------------------------------------------------------------
 * @name Customized Methods (Technical Preview)
 * -----------------------------------------------------------------------------
 */

/** Provides the technical preview functionalities or special customizations by configuring the SDK with JSON options.

 **Note:**

 The JSON options are not public by default. Agora is working on making commonly used JSON options public in a standard way. Contact [support@agora.io](mailto:support@agora.io) for more information.

 @param options SDK options in JSON format.
 */
- (int)setParameters:(NSString * _Nonnull)options;

/** Retrieves the SDK's parameters for customization purposes.

 **Note:**

 This method is not public. Contact [support@agora.io](mailto:support@agora.io) for more information.

 */
- (NSString * _Nullable)getParameter:(NSString * _Nonnull)parameter
                                args:(NSString * _Nullable)args;


#pragma mark Deprecated Methods

/**-----------------------------------------------------------------------------
 * @name Deprecated Methods
 * -----------------------------------------------------------------------------
 */

/** Starts an audio call test.

**DEPRECATED** from v2.4.

This method launches an audio call test to determine whether the audio devices (for example, headset and speaker) and the network connection are working properly.

To conduct the test:

- The user speaks and the recording is played back within 10 seconds.
- If the user can hear the recording within 10 seconds, the audio devices and network connection are working properly.

 **Note:**

 * After calling this method, always call the stopEchoTest method to end the test. Otherwise, the app cannot run the next echo test, nor can it call the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method to start a new call.
 * In the Live-broadcast profile, only the hosts can call this method. If the user switches from the Communication to Live-broadcast profile, the user must call the [setClientRole](setClientRole:) method to change the user role from an audience (default) to a host before calling this method.
 @see [startEchoTestWithInterval]([AgoraRtcEngineKit startEchoTestWithInterval:successBlock:])
 @param successBlock The SDK triggers the `successBlock` callback if this method call is successful.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)startEchoTest:(void(^ _Nullable)(NSString * _Nonnull channel, NSUInteger uid, NSInteger elapsed))successBlock __deprecated_msg("use startEchoTestWithInterval instead.");

/** Sets the preferences for the video quality. (Live broadcast only).

**DEPRECATED** from v2.4.

Under unreliable network connections or the device's CPU is overloaded, the video quality may be affected. You can use this method to choose the video smoothness (frame rate) over the image quality or vice versa.

 @param preferFrameRateOverImageQuality Sets the video quality preference:

 * YES: Frame rate over image quality.
 * NO: (Default) Image quality over frame rate.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setVideoQualityParameters:(BOOL)preferFrameRateOverImageQuality __deprecated_msg("use AgoraDegradationPreference instead.");

/** Initializes the AgoraRtcEngineKit object.

 **DEPRECATED** from v2.3.

 @see [sharedEngineWithappId]([AgoraRtcEngineKit sharedEngineWithAppId:delegate:])
 @param AppId    App ID issued to you by Agora. Apply for a new App ID from Agora if it is missing from your kit. Each project is assigned a unique App ID. The App ID identifies your project and organization in the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method to access the Agora Global Network, and enable one-to-one or one-to-more communication or live-broadcast sessions using a unique channel name for your App ID.
 @param errorBlock Error code: AgoraErrorCode.
 */
+ (instancetype _Nonnull)sharedEngineWithAppId:(NSString * _Nonnull)AppId
                                         error:(void(^ _Nullable)(AgoraErrorCode errorCode))errorBlock __deprecated_msg("use sharedEngineWithAppId:delegate: instead.");

/** Disables the audio function in a channel.

**DEPRECATED** from v2.3

 @see disableAudio
 @return * 0: Success.
* < 0: Failure.
 */
- (int)pauseAudio __deprecated_msg("use disableAudio instead.");

/** Resumes the audio in a channel.

 **DEPRECATED** from v2.3

 @see enableAudio
 @return * 0: Success.
* < 0: Failure.
 */
- (int)resumeAudio __deprecated_msg("use enableAudio instead.");

/** Sets the high-quality audio parameters.

 Replaced with [setAudioProfile](setAudioProfile:scenario:).

**DEPRECATED** from v2.3.

 @param fullband Sets whether to enable/disable full-band codec (48 kHz sample rate). Not compatible with versions earlier than v1.7.4.

  * YES: Enable full-band codec.
  * NO: Disable full-band codec.
 @param stereo Sets whether to enable/disable stereo codec. Not compatible with versions earlier than v1.7.4.

  * YES: Enable stereo codec.
  * NO: Disable stereo codec.
 @param fullBitrate Sets whether to enable/disable high-bitrate mode. Recommended in voice-only mode.

  * YES: Enable high-bitrate mode.
  * NO: Disable high-bitrate mode.
 @return * 0: Success.
 * < 0: Failure.
 */
- (int)setHighQualityAudioParametersWithFullband:(BOOL)fullband
                                          stereo:(BOOL)stereo
                                     fullBitrate:(BOOL)fullBitrate __deprecated_msg("use setAudioProfile:scenario: instead.");

#if (!(TARGET_OS_IPHONE) && (TARGET_OS_MAC))
/** Sets the speakerphone volume. (macOS only.)

 **DEPRECATED** from v2.3.

 @see [setDeviceVolume](setDeviceVolume:volume:).
 @param volume Sets the speakerphone volume. The value ranges between 0 (lowest volume) and 255 (highest volume).

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setSpeakerphoneVolume:(NSUInteger)volume __deprecated_msg("use setDeviceVolume:volume: instead.");

/** Starts screen sharing. (macOS only.)

**DEPRECATED** from v2.4.

 @see [startScreenCaptureByDisplayId]([AgoraRtcEngineKit startScreenCaptureByDisplayId:rectangle:parameters:])
 @see [startScreenCaptureByWindowId]([AgoraRtcEngineKit startScreenCaptureByWindowId:rectangle:parameters:])
 @param windowId Sets to share the whole screen, a specified window, or a specified region:
 * Share the whole screen: Set `windowId` as 0 and set `rect` as nil.
 * Share the specified window: Set `windowId` not as 0. Each window has a `windowId` that is not 0.
 * Share the specified region: Set `windowId` as 0 and set `rect` not as nil. You can share the specified region, for example by dragging the mouse (the logic is implemented by yourself). The specified region is a region on the whole screen. Currently, sharing a specified region in a specific window is not supported.
 @param captureFreq (Mandatory) The captured frame rate. The value ranges between 1 fps and 15 fps.
 @param bitRate The captured bitrate.
 @param rect Specifies the screen-sharing region. `rect` is valid when `windowsId` is set as 0. When you set `rect` as nil, the whole screen is shared.
 @return * 0: Success.
* < 0: Failure.
 */
- (int)startScreenCapture:(NSUInteger)windowId
          withCaptureFreq:(NSInteger)captureFreq
                  bitRate:(NSInteger)bitRate
                  andRect:(CGRect)rect __deprecated_msg("use startScreenCaptureByDisplayId or startScreenCaptureByWindowId: instead.");


#endif

/** Sets the video profile.

 **DEPRECATED** from v2.3.

 Each video profile includes a set of parameters, such as the resolution, frame rate, and bitrate. If the camera device does not support the specified resolution, the SDK automatically chooses a suitable camera resolution, keeping the encoder resolution specified by setVideoProfile.

 **Note:**

 * Always set the video profile after calling the [enableVideo](enableVideo) method.
 * Always set the video profile before calling the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) or [startPreview](startPreview) method.
 * If you do not need to set the video profile after joining the channel, call this method before calling the enableVideo method to reduce the render time of the first video frame.

 @see [setVideoEncoderConfiguration](setVideoEncoderConfiguration:)
 @param profile    Sets the video profile. See AgoraVideoProfile.
 @param swapWidthAndHeight Sets whether or not to swap the width and height of the video:

 * YES: Swap the width and height. The video is in portrait mode.
 * NO: (Default) Do not swap the width and height. The video remains in landscape mode.

 The width and height of the output video are consistent with the set video profile.

 @return * 0: Success.
* < 0: Failure.
 */
- (int)setVideoProfile:(AgoraVideoProfile)profile
    swapWidthAndHeight:(BOOL)swapWidthAndHeight __deprecated_msg("use setVideoEncoderConfiguration: instead.");

/** Sets the video encoding profile manually.

 **DEPRECATED** from v2.3.

 If you do not need to change the video profile after joining the channel, Agora recommends calling this method before calling the enableVideo method to reduce the render time of the first video frame.

 @see setVideoEncoderConfiguration:
 @param size      Sets the size of the video. The highest value is 1280 &times; 720.
 @param frameRate Sets the frame rate of the video. The highest value is 30. You can set it to 5, 10, 15, 24, 30, and so on.
 @param bitrate   Sets the bitrate of the video. You need to manually work out the bitrate according to the width, height, and frame rate. See the bitrate table in AgoraVideoEncoderConfiguration. With the same width and height, the bitrate varies with the change of the frame rate:

 * If the frame rate is 5 fps, divide the recommended bitrate by 2.
 * If the frame rate is 15 fps, use the recommended bitrate.
 * If the frame rate is 30 fps, multiply the recommended bitrate by 1.5.
 * Calculate your bitrate with the ratio if you choose other frame rates.

 For example, the resolution is 320 &times; 240 and the frame rate is 15 fps, hence, the bitrate is 200:

 * If the frame rate is 5 fps, the bitrate is 100.
 * If the frame rate is 30 fps, the bitrate is 300.
 * If you set a bitrate beyond the proper range, the SDK automatically adjusts the bitrate to a value within the proper range.
 */
- (int)setVideoResolution:(CGSize)size andFrameRate:(NSInteger)frameRate bitrate:(NSInteger)bitrate __deprecated_msg("use setVideoEncoderConfiguration: instead.");

/** Retrieves the device type; such as a recording, playback, or video-capture device. (macOS only.)

 **DEPRECATED**  from v2.3.

 @see [getDeviceInfo](getDeviceInfo:).
 @param type Device type: AgoraMediaDeviceType.
 @return * Returns the device ID of the device, if this method call is successful.
 * nil: Failure.
 */
- (NSString * _Nullable)getDeviceId:(AgoraMediaDeviceType)type __deprecated_msg("use getDeviceInfo: instead.");

/** Plays a specified audio effect.

 **DEPRECATED** from v2.3.

 @see [playEffect](playEffect:filePath:loopCount:pitch:pan:gain:publish:)
 @param soundId ID of the audio effect. Each audio effect has a unique ID.

 **Note:** If you preloaded the audio effect into the memory through the [preloadEffect]([AgoraRtcEngineKit preloadEffect:filePath:]) method, ensure that the `soundID` value is set to the same value as in preloadEffect.
 @param filePath Absolute path of the audio effect file.
 @param loopCount Sets the number of times looping the audio effect:

 * 0: Plays the audio effect once.
 * 1: Plays the audio effect twice.
 * -1: Plays the audio effect in an indefinite loop until you call the [stopEffect]([AgoraRtcEngineKit stopEffect:]) or [stopAllEffects]([AgoraRtcEngineKit stopAllEffects]) method

 @param pitch Sets whether to change the pitch of the audio effect. The value ranges between 0.5 and 2.
 The default value is 1 (no change to the pitch). The lower the value, the lower the pitch.
 @param pan Sets the spatial position of the audio effect. The value ranges between -1.0 and 1.0.

 * 0.0: The audio effect displays ahead.
 * 1.0: The audio effect displays to the right.
 * -1.0: The audio effect displays to the left.

 @param gain Sets the volume of the sound effect. The value ranges between 0.0 and 100.0 (default). The lower the value, the lower the volume of the sound effect.
 @return * 0: Success.
* < 0: Failure.
 */
- (int)playEffect:(int)soundId
         filePath:(NSString * _Nullable)filePath
        loopCount:(int)loopCount
            pitch:(double)pitch
              pan:(double)pan
             gain:(double)gain __deprecated_msg("use playEffect:filePath:loopCount:pitch:pan:gain:publish: instead.");

/** Returns the media engine version.

 **DEPRECATED** from v2.3.

 @see getSdkVersion

 @return The media engine version in the string format.
 */
+ (NSString * _Nonnull)getMediaEngineVersion __deprecated;


#pragma mark Deprecated Blocks

/**-----------------------------------------------------------------------------
 * @name Deprecated Blocks
 * -----------------------------------------------------------------------------
 */

/** Reports which users are speaking and the speakers' volume.

 **DEPRECATED** from v1.1.

 This callback is disabled by default and can be enabled by the [enableAudioVolumeIndication]([AgoraRtcEngineKit enableAudioVolumeIndication:smooth:]) method.

 In the returned speakers' array:

 * If `uid` is 0 (the local user is the speaker), the returned volume is `totalVolume`.
 * If `uid` is not 0 and `volume` is 0, the specified user did not speak.
 * If a `uid` is found in the previous speakers' array but not in the current speakers' array, the specified user did not speak.

@see [reportAudioVolumeIndicationOfSpeakers]([AgoraRtcEngineDelegate rtcEngine:reportAudioVolumeIndicationOfSpeakers:totalVolume:])

@param audioVolumeIndicationBlock This block includes:

- speakers: An array containing the user ID and volume information for each speaker.

   - uid: User ID of the speaker.
   - volume：Volume of the speaker. The value ranges between 0 (lowest volume) to 255 (highest volume).
- totalVolume: Total volume after audio mixing between 0 (lowest volume) to 255 (highest volume).
 */
- (void)audioVolumeIndicationBlock:(void(^ _Nullable)(NSArray * _Nonnull speakers, NSInteger totalVolume))audioVolumeIndicationBlock __deprecated_msg("use delegate instead.");

/** Occurs when the engine renders the first local video frame on the video window.

 **DEPRECATED** from v1.1.

 @see [firstLocalVideoFrameWithSize]([AgoraRtcEngineDelegate rtcEngine:firstLocalVideoFrameWithSize:elapsed:])

 @param firstLocalVideoFrameBlock This block includes the:

 - width: Width (pixels) of the video stream.
 - height: Height (pixels) of the video stream.
 - elapsed: Time elapsed (ms) from the local user calling [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) until the SDK triggers this callback.
 */
- (void)firstLocalVideoFrameBlock:(void(^ _Nullable)(NSInteger width, NSInteger height, NSInteger elapsed))firstLocalVideoFrameBlock __deprecated_msg("use delegate instead.");

/** Occurs when the engine decodes the first video frame from a specific remote user.

 **DEPRECATED** from v1.1.

 @see [firstRemoteVideoFrameOfUid]([AgoraRtcEngineDelegate rtcEngine:firstRemoteVideoFrameOfUid:size:elapsed:])

 @param firstRemoteVideoDecodedBlock This block includes the:

 - uid:     User ID of the user sending the video streams.
 - width:   Width (pixels) of the video stream.
 - height:  Height (pixels) of the video stream.
 - elapsed: Time elapsed (ms) from the remote user calling [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) until the SDK triggers this callback.
 */
- (void)firstRemoteVideoDecodedBlock:(void(^ _Nullable)(NSUInteger uid, NSInteger width, NSInteger height, NSInteger elapsed))firstRemoteVideoDecodedBlock __deprecated_msg("use delegate instead.");

/** Occurs when the first remote video frame is rendered.

 **DEPRECATED** from v1.1.

 @see [firstRemoteVideoDecodedOfUid]([AgoraRtcEngineDelegate rtcEngine:firstRemoteVideoDecodedOfUid:size:elapsed:])

 @param firstRemoteVideoFrameBlock This block includes the:

 - uid:     User ID of the remote user sending the video streams.
 - width:   Width (pixels) of the video stream.
 - height:  Height (pixels) of the video stream.
 - elapsed: Time elapsed (ms) from the local user calling [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) until the SDK triggers this callback.
 */
- (void)firstRemoteVideoFrameBlock:(void(^ _Nullable)(NSUInteger uid, NSInteger width, NSInteger height, NSInteger elapsed))firstRemoteVideoFrameBlock __deprecated_msg("use delegate instead.");

/** Occurs when a user joins a channel.

 **DEPRECATED** from v1.1.

 If there are other users in the channel when this user joins, the SDK also reports to the app on the existing users who are already in the channel.

 @see [didJoinedOfUid]([AgoraRtcEngineDelegate rtcEngine:didJoinedOfUid:elapsed:])

 @param userJoinedBlock This block includes the:

 - uid:     User ID. If the `uid` is specified in the [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) method, the specified user ID is returned. If the user ID is not specified in the joinChannel method, the server automatically assigns a `uid`.
 - elapsed: Time elapsed (ms) from the user calling  [joinChannelByToken]([AgoraRtcEngineKit joinChannelByToken:channelId:info:uid:joinSuccess:]) until the SDK triggers this callback.
 */
- (void)userJoinedBlock:(void(^ _Nullable)(NSUInteger uid, NSInteger elapsed))userJoinedBlock __deprecated_msg("use delegate instead.");

/** Occurs when a user leaves a call or goes offline.

 **DEPRECATED** from v1.1.

 The SDK reads the timeout data to determine if a user leaves a channel (or goes offline). If no data packet is received from the user within 15 seconds, the SDK assumes the user is offline. Sometimes a weak network connection may lead to false detections; therefore, Agora recommends using signaling for reliable offline detection.

 @see [didOfflineOfUid]([AgoraRtcEngineDelegate rtcEngine:didOfflineOfUid:reason:])
 @param userOfflineBlock This block includes the user ID, `uid`.
 */
- (void)userOfflineBlock:(void(^ _Nullable)(NSUInteger uid))userOfflineBlock __deprecated_msg("use delegate instead.");

/** Occurs when a remote user's audio stream is muted/unmuted.

 **DEPRECATED** from v1.1.

 @see [didAudioMuted]([AgoraRtcEngineDelegate rtcEngine:didAudioMuted:byUid:])

 @param userMuteAudioBlock This block includes the:

 - uid:   ID of the remote user whose audio stream is muted/unmuted.
 - muted: Whether the remote user's audio stream is muted/unmuted:

     - YES: Muted.
     - NO: Unmuted.
 */
- (void)userMuteAudioBlock:(void(^ _Nullable)(NSUInteger uid, BOOL muted))userMuteAudioBlock __deprecated_msg("use delegate instead.");

/** Occurs when a remote user's video stream playback pauses/resumes.

 **DEPRECATED** from v1.1.

 @see [didVideoMuted]([AgoraRtcEngineDelegate rtcEngine:didVideoMuted:byUid:])
 @param userMuteVideoBlock This block includes the:

 - uid:   ID of the remote user whose video stream playback pauses/resumes.
 - muted: Whether the remote user's video playback pauses/resumes:

     - YES: Pauses.
     - NO: Resumes.
 */
- (void)userMuteVideoBlock:(void(^ _Nullable)(NSUInteger uid, BOOL muted))userMuteVideoBlock __deprecated_msg("use delegate instead.");

/** Reports the statistics of the uploading local video streams once every two seconds.

 **DEPRECATED** from v1.1.

 @see [localVideoStats]([AgoraRtcEngineDelegate rtcEngine:localVideoStats:])
 @param localVideoStatBlock This block includes the:

 - sentBitrate:  Bitrate sent since last count.
 - sentFrameRate: Frame rate sent since last count.
 */
- (void)localVideoStatBlock:(void(^ _Nullable)(NSInteger sentBitrate, NSInteger sentFrameRate))localVideoStatBlock __deprecated_msg("use delegate instead.");

/** Reports the statistics of the receiving remote video streams once every two seconds.

 **DEPRECATED** from v1.1.

  @see [remoteVideoStats]([AgoraRtcEngineDelegate rtcEngine:remoteVideoStats:])

 @param remoteVideoStatBlock This block includes the:

 - uid:                   User ID of the remote user sending the video streams.
 - delay:                 Time delay (ms).
 - receivedBitrate:       Bitrate received since last count.
 - decoderOutputFrameRate:     Frame rate encoder output since last count.
 - renderererOutputFrameRate       Frame rate render output since last count.
 */
- (void)remoteVideoStatBlock:(void(^ _Nullable)(NSUInteger uid, NSInteger delay, NSInteger receivedBitrate, NSInteger decoderOutputFrameRate, NSInteger rendererOutputFrameRate))remoteVideoStatBlock __deprecated_msg("use delegate instead.");

/** Reports the statistics of the receiving remote audio streams once every two seconds.

 **DEPRECATED** from v1.1.

 @see [remoteAudioStats]([AgoraRtcEngineDelegate rtcEngine:remoteAudioStats:])

 @param remoteAudioStatBlock This block includes the:

 - uid:                    User ID of the user sending the audio streams.
 - quality:                Audio receiving quality of the user
 - networkTransportDelay:  Network delay from the sender to the receiver.
 - jitterBufferDelay:      Jitter buffer delay at the receiver.
 - audioLossRate:          Audio packet loss rate in the reported interval.
 */
- (void)remoteAudioStatBlock:(void(^ _Nullable)(NSUInteger uid, NSInteger quality, NSInteger networkTransportDelay, NSInteger jitterBufferDelay, NSInteger audioLossRate))remoteAudioStatBlock __deprecated_msg("use delegate instead.");

/** Occurs when the camera turns on and is ready to capture the video.

 **DEPRECATED** from v1.1.

 @see [rtcEngineCameraDidReady]([AgoraRtcEngineDelegate rtcEngineCameraDidReady:])
 */
- (void)cameraReadyBlock:(void(^ _Nullable)(void))cameraReadyBlock __deprecated_msg("use delegate instead.");

/** Occurs when the connection between the SDK and the server is lost.

 **DEPRECATED** from v1.1.

 @see [rtcEngineConnectionDidInterrupted]([AgoraRtcEngineDelegate rtcEngineConnectionDidInterrupted:])
 @see [rtcEngineConnectionDidLost]([AgoraRtcEngineDelegate rtcEngineConnectionDidLost:])
 */
- (void)connectionLostBlock:(void(^ _Nullable)(void))connectionLostBlock __deprecated_msg("use delegate instead.");

/** Occurs when a user rejoins the channel after disconnection due to network problems.

When the client loses connection with the server because of network problems, the SDK automatically attempts to reconnect and triggers this callback upon reconnection.

 **DEPRECATED** from v1.1.

 @see [didRejoinChannel]([AgoraRtcEngineDelegate rtcEngine:didRejoinChannel:withUid:elapsed:])
 @param rejoinChannelSuccessBlock This block includes the:

 - channel: Channel name.
 - uid:     User ID.
 - elapsed: Time elapsed (ms) from starting to reconnect until this callback occurs.
 */
- (void)rejoinChannelSuccessBlock:(void(^ _Nullable)(NSString * _Nonnull channel, NSUInteger uid, NSInteger elapsed))rejoinChannelSuccessBlock __deprecated_msg("use delegate instead.");

/** Reports the RtcEngine runtime statistics once every two seconds.

 **DEPRECATED** from v1.1.

 @see [reportRtcStats]([AgoraRtcEngineDelegate rtcEngine:reportRtcStats:])
 @param rtcStatsBlock RtcEngine runtime statistics. See [AgoraChannelStats](AgoraChannelStats).
 */
- (void)rtcStatsBlock:(void(^ _Nullable)(AgoraChannelStats * _Nonnull stat))rtcStatsBlock __deprecated_msg("use delegate instead.");

/** Occurs when a user leaves a channel.

 **DEPRECATED** from v1.1.

 When the app calls the [leaveChannel]([AgoraRtcEngineKit leaveChannel:]) method, the SDK uses this callback to notify the app that a user leaves a channel.

 With this callback, the app retrieves information, such as the call duration and statistics of the received/transmitted data in the [audioQualityOfUid]([AgoraRtcEngineDelegate rtcEngine:audioQualityOfUid:quality:delay:lost:]) callback.

 @see [didLeaveChannelWithStats]([AgoraRtcEngineDelegate rtcEngine:didLeaveChannelWithStats:])
 @param leaveChannelBlock Statistics of the call. See [AgoraChannelStats](AgoraChannelStats).
 */
- (void)leaveChannelBlock:(void(^ _Nullable)(AgoraChannelStats * _Nonnull stat))leaveChannelBlock __deprecated_msg("use delegate instead.");

/** Reports the audio quality of the current call once every two seconds.

 **DEPRECATED** from v1.1.

 @see [audioQualityOfUid]([AgoraRtcEngineDelegate rtcEngine:audioQualityOfUid:quality:delay:lost:])
 @param audioQualityBlock This block includes the:

 - uid:     User ID of the speaker.
 - quality: Audio quality of the user: AgoraNetworkQuality.
 - delay:   Time delay (ms).
 - lost:    Audio packet loss rate (%).
 */
- (void)audioQualityBlock:(void(^ _Nullable)(NSUInteger uid, AgoraNetworkQuality quality, NSUInteger delay, NSUInteger lost))audioQualityBlock __deprecated_msg("use delegate instead.");

/** Reports the network quality of a specified user in the Communication or Live Broadcast profile once every two seconds.

 **DEPRECATED** from v1.1.

 @see [networkQuality]([AgoraRtcEngineDelegate rtcEngine:networkQuality:txQuality:rxQuality:])
 @param networkQualityBlock This block includes the:

 - uid:       User ID. The network quality of the user with this `uid` is reported. If `uid` is 0, the local network quality is reported.
 - txQuality: The transmission quality of the user: AgoraNetworkQuality.
 - rxQuality: The receiving quality of the user: AgoraNetworkQuality.
 */
- (void)networkQualityBlock:(void(^ _Nullable)(NSUInteger uid, AgoraNetworkQuality txQuality, AgoraNetworkQuality rxQuality))networkQualityBlock __deprecated_msg("use delegate instead.");

/** Reports the last mile network quality of the local user once every two seconds before the user joins a channel.

 **DEPRECATED** from v1.1.

Last mile refers to the connection between the local device and Agora's edge server. After the app calls the [enableLastmileTest]([AgoraRtcEngineKit enableLastmileTest]) method, this callback reports once every two seconds the uplink and downlink last mile network conditions of the local user before the user joins a channel.

 @param lastmileQualityBlock Network quality. See [AgoraNetworkQuality](AgoraNetworkQuality).
 */
- (void)lastmileQualityBlock:(void(^ _Nullable)(AgoraNetworkQuality quality))lastmileQualityBlock __deprecated_msg("use delegate instead.");

/** Reports a media engine event.

 **DEPRECATED** from v1.1.
 */
- (void)mediaEngineEventBlock:(void(^ _Nullable)(NSInteger code))mediaEngineEventBlock __deprecated_msg("use delegate instead.");



@end
