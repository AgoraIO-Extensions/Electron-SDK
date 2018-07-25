//
//  AgoraLiveSubscriber.h
//  AgoraLiveKit
//
//  Created by Sting Feng on 2015-8-11.
//  Copyright (c) 2015 Agora. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AgoraObjects.h"

@class AgoraLiveKit;
@class AgoraLiveSubscriber;

@protocol AgoraLiveSubscriberDelegate <NSObject>
@optional

// subscriber 相关
- (void)subscriber: (AgoraLiveSubscriber *_Nonnull)subscriber publishedByHostUid:(NSUInteger)uid streamType:(AgoraMediaType) type;

- (void)subscriber: (AgoraLiveSubscriber *_Nonnull)subscriber streamTypeChangedTo:(AgoraMediaType) type byHostUid:(NSUInteger)uid;

// unmute, offline
- (void)subscriber: (AgoraLiveSubscriber *_Nonnull)subscriber unpublishedByHostUid:(NSUInteger)uid;

// video
/**
 *  Event of the first frame of remote user is rendering on the screen.
 *
 *  @param subscriber     The live subscriber
 *  @param uid     The remote user id
 *  @param size    The size of video stream
 *  @param elapsed The elapsed time(ms) from the beginning of the session.
 */
- (void)subscriber:(AgoraLiveSubscriber *_Nonnull)subscriber firstRemoteVideoDecodedOfHostUid:(NSUInteger)uid size:(CGSize)size elapsed:(NSInteger)elapsed;

/**
 *  Event of video size changed for local or remote user
 *
 *  @param subscriber     The live subscriber
 *  @param uid     The user id
 *  @param size    The new size of video
 *  @param rotation  The new rotate of video
 */
- (void)subscriber:(AgoraLiveSubscriber *_Nonnull)subscriber videoSizeChangedOfHostUid:(NSUInteger)uid size:(CGSize)size rotation:(NSInteger)rotation;
@end


__attribute__((visibility("default"))) @interface AgoraLiveSubscriber: NSObject // AgoraLiveSubscriber

-(instancetype _Nonnull)initWithLiveKit:(AgoraLiveKit * _Nonnull)kit;

-(void)setDelegate:(_Nullable id<AgoraLiveSubscriberDelegate>)delegate;

- (void)subscribeToHostUid:(NSUInteger)uid
             mediaType:(AgoraMediaType)mediaType
                  view:(VIEW_CLASS *_Nullable)view
            renderMode:(AgoraVideoRenderMode)mode
             videoType:(AgoraVideoStreamType)videoType;

-(void)unsubscribeToHostUid:(NSUInteger)uid;

@end
