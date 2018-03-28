//
//  AgoraLiveKit.h
//  AgoraLiveKit
//
//  Created by Junhao Wang
//  Copyright (c) 2017 Agora. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "AgoraLivePublisher.h"
#import "AgoraLiveSubscriber.h"
#import "AgoraRtcEngineKit.h"

__attribute__((visibility("default"))) @interface AgoraLiveChannelConfig: NSObject
@property (assign, nonatomic) BOOL videoEnabled;

+(AgoraLiveChannelConfig *_Nonnull) defaultConfig;
@end

@class AgoraLiveKit;

@protocol AgoraLiveDelegate <NSObject>
@optional

/**
 *  The warning occurred in SDK. The APP could igonre the warning, and the SDK could try to resume automically.
 *
 *  @param kit         The live kit
 *  @param warningCode The warning code
 */
- (void)liveKit:(AgoraLiveKit *_Nonnull)kit didOccurWarning:(AgoraWarningCode)warningCode;

/**
 *  The error occurred in SDK. The SDK couldn't resume to normal state, and the app need to handle it.
 *
 *  @param kit       The live kit
 *  @param errorCode The error code
 */
- (void)liveKit:(AgoraLiveKit *_Nonnull)kit didOccurError:(AgoraErrorCode)errorCode;

/**
 *  Event of the user joined the channel.
 *
 *  @param kit     The live kit
 *  @param channel The channel name
 *  @param uid     The local user id
 *  @param elapsed The elapsed time (ms) from session beginning
 */
- (void)liveKit:(AgoraLiveKit *_Nonnull)kit didJoinChannel:(NSString *_Nonnull)channel withUid:(NSUInteger)uid elapsed:(NSInteger) elapsed;

/**
 *  The statistics of the call when leave channel
 *
 *  @param kit    The live kit
 */
- (void)liveKitDidLeaveChannel:(AgoraLiveKit *_Nonnull)kit;

/**
 *  Event of the user rejoined the channel
 *
 *  @param kit     The live kit
 *  @param channel The channel name
 *  @param uid     The user id
 *  @param elapsed The elapsed time (ms) from session beginning
 */
- (void)liveKit:(AgoraLiveKit *_Nonnull)kit didRejoinChannel:(NSString *_Nonnull)channel withUid:(NSUInteger)uid elapsed:(NSInteger) elapsed;

/**
 * when token is enabled, and specified token is invalid or expired, this function will be called.
 * APP should generate a new token and call renewToken() to refresh the key.
 * NOTE: to be compatible with previous version, ERR_TOKEN_EXPIRED and ERR_INVALID_TOKEN are also reported via onError() callback.
 * You should move renew of token logic into this callback.
 *  @param kit The live kit
 */
- (void)liveKitRequestToken:(AgoraLiveKit *_Nonnull)kit;

// statistics

/**
 *  Statistics of rtc live kit status. Updated every two seconds.
 *
 *  @param kit    The live kit
 *  @param stats  The statistics of rtc status, including duration, sent bytes and received bytes
 */
- (void)liveKit:(AgoraLiveKit *_Nonnull)kit reportLiveStats:(AgoraChannelStats *_Nonnull)stats;
// network

/**
 *  Event of disconnected with server. This event is reported at the moment SDK loses connection with server.
 *  In the mean time SDK automatically tries to reconnect with the server until APP calls leaveChannel.
 *
 *  @param kit    The live kit
 */
- (void)liveKitConnectionDidInterrupted:(AgoraLiveKit *_Nonnull)kit;

/**
 *  Event of loss connection with server. This event is reported after the connection is interrupted and exceed the retry period (10 seconds by default).
 *  In the mean time SDK automatically tries to reconnect with the server until APP calls leaveChannel.
 *
 *  @param kit    The live kit
 */
- (void)liveKitConnectionDidLost:(AgoraLiveKit *_Nonnull)kit;

/**
 *  The network quality of local user.
 *
 *  @param kit     The live kit
 *  @param uid     The id of user
 *  @param txQuality The sending network quality
 *  @param rxQuality The receiving network quality
 */
- (void)liveKit:(AgoraLiveKit *_Nonnull)kit networkQuality:(NSUInteger)uid txQuality:(AgoraNetworkQuality)txQuality rxQuality:(AgoraNetworkQuality)rxQuality;

- (void)liveKit:(AgoraLiveKit *_Nonnull)kit publishingRequestAnsweredByOwner:(NSUInteger)uid accepted:(BOOL)accepted error:(AgoraErrorCode)error;

- (void)liveKit:(AgoraLiveKit *_Nonnull)kit unpublishingRequestReceivedFromOwner:(NSUInteger)uid;
@end


__attribute__((visibility("default"))) @interface AgoraLiveKit : NSObject

@property (weak, nonatomic) _Nullable id<AgoraLiveDelegate> delegate;

/**
*  Get the version of Agora SDK.
*
*  @return string, sdk version
*/
+ (NSString *_Nonnull)getSdkVersion;

/**
 *  Get the native handler of sdk Engine
 */
- (AgoraRtcEngineKit *_Nonnull)getRtcEngineKit;

/**
 *  Initializes the AgoraLiveKit object.
 *
 *  @param appId The appId is issued to the application developers by Agora.
 *
 *  @return an object of AgoraLiveKit class
 */
+ (instancetype _Nonnull)sharedLiveKitWithAppId:(NSString *_Nonnull)appId;

+ (void)destroy;

/** BEGIN OF COMMON METHODS */

/**
 *  Create an open UDP socket to the AgoraLiveKit cloud service to join a channel.
    Users in the same channel can talk to each other with same vendor key.
    Users using different vendor keys cannot call each other.
    The method is asynchronous.
 *
 *  @param channelId       Joining in the same channel indicates those clients have entered in one room.
 *  @param token        token generated by APP using sign certificate.
 *  @param channelConfig     configration of channel
 *  @param uid               Optional, this argument is the unique ID for each member in one channel.
                             If set to 0, the SDK automatically allocates an ID, and the id could be gotten in didJoinChannel delegate.
 *
 *  @return 0 when executed successfully, and return negative value when failed.
 */
- (int)joinChannelByToken:(NSString *_Nullable)token
               channelId:(NSString *_Nonnull)channelId
            config:(AgoraLiveChannelConfig *_Nonnull)channelConfig
               uid:(NSUInteger)uid;

/**
 *  lets the user leave a channel, i.e., hanging up or exiting a call.
    After joining a channel, the user must call the leaveChannel method to end the call before joining another one.
    It is synchronous, i.e., it only returns until the call ends and all resources are released.
 *
 *  @return 0 if executed successfully, or return negative value if failed.
 */
- (int)leaveChannel;


/**
 *  Renew token, refresh the new key into agora engine. APP should call this API when SDK reports error ERR_TOKEN_EXPIRED.
 *
 *  @param token new token
 *
 *  @return 0 when executed successfully. return negative value if failed.
 */
- (int)renewToken:(NSString*_Nonnull)token;

/**
 *  start local video preview, while not sending data to server
 *
 *  @return 0 when this method is called successfully, or negative value when this method failed.
 */
- (int)startPreview:(VIEW_CLASS *_Nonnull)view
         renderMode:(AgoraVideoRenderMode)mode;

/**
 *  stop local video preview
 *
 *  @return 0 when this method is called successfully, or negative value when this method failed.
 */
- (int)stopPreview;


- (int)sendPublishingRequestToOwner:(NSUInteger) uid;

@end
