//
//  AgoraMediaIO.h
//  AgoraRtcEngineKit
//
//  Created by Yuhua Gong
//  Copyright (c) 2017 Agora. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import "AgoraEnumerates.h"
#import "AgoraObjects.h"

typedef NS_ENUM(NSUInteger, AgoraVideoPixelFormat) {
    AgoraVideoPixelFormatI420   = 1,
    AgoraVideoPixelFormatBGRA   = 2, 
    AgoraVideoPixelFormatNV12   = 8,
};

typedef NS_ENUM(NSInteger, AgoraVideoRotation) {
    AgoraVideoRotationNone      = 0,
    AgoraVideoRotation90        = 1,
    AgoraVideoRotation180       = 2,
    AgoraVideoRotation270       = 3,
};

typedef NS_ENUM(NSInteger, AgoraVideoBufferType) {
    AgoraVideoBufferTypePixelBuffer = 1,
    AgoraVideoBufferTypeRawData     = 2,
};

// Video Source consumer Delegate
@protocol AgoraVideoFrameConsumer <NSObject>
- (void)consumePixelBuffer:(CVPixelBufferRef _Nonnull)pixelBuffer
             withTimestamp:(CMTime)timestamp
                  rotation:(AgoraVideoRotation)rotation;
- (void)consumeRawData:(void * _Nonnull)rawData
         withTimestamp:(CMTime)timestamp
                format:(AgoraVideoPixelFormat)format
                  size:(CGSize)size
              rotation:(AgoraVideoRotation)rotation;
@end

// Video Source Protocol
@protocol AgoraVideoSourceProtocol <NSObject>
@required
@property (strong) id<AgoraVideoFrameConsumer> _Nullable consumer;
- (BOOL)shouldInitialize;
- (void)shouldStart;
- (void)shouldStop;
- (void)shouldDispose;
- (AgoraVideoBufferType)bufferType;
@end

// Video Render Protocol
@protocol AgoraVideoSinkProtocol <NSObject>
@required
- (BOOL)shouldInitialize;
- (void)shouldStart;
- (void)shouldStop;
- (void)shouldDispose;
- (AgoraVideoBufferType)bufferType;
- (AgoraVideoPixelFormat)pixelFormat;
@optional
- (void)renderPixelBuffer:(CVPixelBufferRef _Nonnull)pixelBuffer
                 rotation:(AgoraVideoRotation)rotation;
- (void)renderRawData:(void * _Nonnull)rawData
                 size:(CGSize)size
             rotation:(AgoraVideoRotation)rotation;
@end

#pragma mark - Agora default media io
typedef NS_ENUM(NSInteger, AgoraRtcDefaultCameraPosition) {
    AgoraRtcDefaultCameraPositionFront    = 0,
    AgoraRtcDefaultCameraPositionBack     = 1
};

__attribute__((visibility("default"))) @interface AgoraRtcDefaultCamera: NSObject<AgoraVideoSourceProtocol>
#if TARGET_OS_IPHONE
@property (nonatomic, assign) AgoraRtcDefaultCameraPosition position;
- (instancetype _Nonnull)initWithPosition:(AgoraRtcDefaultCameraPosition)position;
#endif
@end

#if (!(TARGET_OS_IPHONE) && (TARGET_OS_MAC))
__attribute__((visibility("default"))) @interface AgoraRtcScreenCapture: NSObject<AgoraVideoSourceProtocol>
@property (nonatomic, readonly) NSUInteger windowId;
+ (instancetype _Nonnull)fullScreenCaptureWithFrequency:(NSInteger)captureFrequency
                                                bitRate:(NSInteger)bitRate;
+ (instancetype _Nonnull)windowCaptureWithId:(CGWindowID)windowId
                            captureFrequency:(NSInteger)captureFrequency
                                     bitRate:(NSInteger)bitRate
                                        rect:(CGRect)rect;
@end
#endif

__attribute__((visibility("default"))) @interface AgoraRtcDefaultRenderer: NSObject<AgoraVideoSinkProtocol>
@property (nonatomic, strong, readonly) VIEW_CLASS * _Nonnull view;
@property (nonatomic, assign) AgoraVideoRenderMode mode;
- (instancetype _Nonnull)initWithView:(VIEW_CLASS * _Nonnull)view
                           renderMode:(AgoraVideoRenderMode)mode;
@end
