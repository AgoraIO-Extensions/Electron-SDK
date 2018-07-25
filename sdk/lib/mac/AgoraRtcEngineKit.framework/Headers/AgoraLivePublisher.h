//
//  AgoraLivePublisher.h
//  AgoraLiveKit
//
//  Created by Sting Feng on 2015-8-11.
//  Copyright (c) 2015 Agora. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AgoraObjects.h"

@class AgoraLiveKit;
@class AgoraLivePublisher;

@protocol AgoraLivePublisherDelegate <NSObject>
@optional
-(void)publisher:(AgoraLivePublisher *_Nonnull)publisher streamPublishedWithUrl:(NSString *_Nonnull)url error:(AgoraErrorCode)error;
-(void)publisher:(AgoraLivePublisher *_Nonnull)publisher streamUnpublishedWithUrl:(NSString *_Nonnull)url;
-(void)publisherTranscodingUpdated: (AgoraLivePublisher *_Nonnull)publisher;

-(void)publisher:(AgoraLivePublisher *_Nonnull)publisher streamInjectedStatusOfUrl:(NSString *_Nonnull)url uid:(NSUInteger)uid status:(AgoraInjectStreamStatus)status;
@end


__attribute__((visibility("default"))) @interface AgoraLivePublisher: NSObject

-(void)setDelegate:(_Nullable id<AgoraLivePublisherDelegate>)delegate;

-(instancetype _Nonnull)initWithLiveKit:(AgoraLiveKit *_Nonnull)kit;

- (void)setVideoResolution:(CGSize)resolution andFrameRate:(NSInteger)frameRate bitrate:(NSInteger)bitrate;

-(void)setLiveTranscoding:(AgoraLiveTranscoding *_Nullable)transcoding;

-(int)addVideoWatermark:(AgoraImage * _Nonnull)watermark  NS_SWIFT_NAME(addVideoWatermark(_:));

-(void)clearVideoWatermarks;

-(void)setMediaType:(AgoraMediaType)mediaType;

-(void)addStreamUrl:(NSString *_Nullable)url transcodingEnabled:(BOOL)transcodingEnabled;

-(void)removeStreamUrl:(NSString *_Nullable)url;

-(void)publish;

-(void)unpublish;

-(void)switchCamera;

- (void)addInjectStreamUrl:(NSString *_Nonnull)url config:(AgoraLiveInjectStreamConfig * _Nonnull)config;

- (void)removeInjectStreamUrl:(NSString *_Nonnull)url;

@end
