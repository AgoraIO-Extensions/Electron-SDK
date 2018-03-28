//
//  AgoraObjects.h
//  AgoraRtcEngineKit
//
//  Created by Yuhua Gong
//  Copyright (c) 2017 Agora. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreMedia/CoreMedia.h>
#import "AgoraEnumerates.h"

#if TARGET_OS_IPHONE
#import <UIKit/UIKit.h>
typedef UIView VIEW_CLASS;
typedef UIColor COLOR_CLASS;
#elif TARGET_OS_MAC
#import <AppKit/AppKit.h>
typedef NSView VIEW_CLASS;
typedef NSColor COLOR_CLASS;
#endif

__attribute__((visibility("default"))) @interface AgoraRtcVideoCanvas : NSObject
/**
 *  The video display view. The SDK does not maintain the lifecycle of the view.
 The view can be safely released after calling leaveChannel with a returned value.
 The SDK keeps a cache of the view value, so 'setupLocalVideo' to set the view value to nil could be able to clear cache before switching or releasing view.
 */
@property (strong, nonatomic) VIEW_CLASS* _Nullable view;
@property (assign, nonatomic) AgoraVideoRenderMode renderMode; // the render mode of view: hidden, fit and adaptive
@property (assign, nonatomic) NSUInteger uid; // the user id of view
@end

__attribute__((visibility("default"))) @interface AgoraRtcLocalVideoStats : NSObject
@property (assign, nonatomic) NSUInteger sentBitrate;
@property (assign, nonatomic) NSUInteger sentFrameRate;
@end

__attribute__((visibility("default"))) @interface AgoraRtcRemoteVideoStats : NSObject
@property (assign, nonatomic) NSUInteger uid;
@property (assign, nonatomic) NSUInteger delay __deprecated;
@property (assign, nonatomic) NSUInteger width;
@property (assign, nonatomic) NSUInteger height;
@property (assign, nonatomic) NSUInteger receivedBitrate;
@property (assign, nonatomic) NSUInteger receivedFrameRate;
@property (assign, nonatomic) AgoraVideoStreamType rxStreamType;
@end

__attribute__((visibility("default"))) @interface AgoraRtcAudioVolumeInfo : NSObject
@property (assign, nonatomic) NSUInteger uid;
@property (assign, nonatomic) NSUInteger volume;
@end

__attribute__((visibility("default"))) @interface AgoraChannelStats: NSObject
@property (assign, nonatomic) NSInteger duration;
@property (assign, nonatomic) NSInteger txBytes;
@property (assign, nonatomic) NSInteger rxBytes;
@property (assign, nonatomic) NSInteger txAudioKBitrate;
@property (assign, nonatomic) NSInteger rxAudioKBitrate;
@property (assign, nonatomic) NSInteger txVideoKBitrate;
@property (assign, nonatomic) NSInteger rxVideoKBitrate;
@property (assign, nonatomic) NSInteger userCount;
@property (assign, nonatomic) double cpuAppUsage;
@property (assign, nonatomic) double cpuTotalUsage;
@end

__attribute__((visibility("default"))) @interface AgoraLiveTranscodingUser: NSObject
@property (assign, nonatomic) NSUInteger uid;
@property (assign, nonatomic) CGRect rect;
@property (assign, nonatomic) NSInteger zOrder; //optional, [0, 100] //0 (default): bottom most, 100: top most
@property (assign, nonatomic) double alpha; //optional, [0, 1.0] where 0 denotes throughly transparent, 1.0 opaque
@property (assign, nonatomic) NSInteger audioChannel;
@end

__attribute__((visibility("default"))) @interface AgoraLiveTranscoding: NSObject
@property (assign, nonatomic) CGSize size;
@property (assign, nonatomic) NSInteger videoBitrate;
@property (assign, nonatomic) NSInteger videoFramerate;
@property (assign, nonatomic) BOOL lowLatency;

@property (assign, nonatomic) NSInteger videoGop;
@property (assign, nonatomic) AgoraVideoCodecProfileType videoCodecProfile;

@property (strong, nonatomic) COLOR_CLASS *_Nullable backgroundColor;
@property (copy, nonatomic) NSArray<AgoraLiveTranscodingUser *> *_Nullable transcodingUsers;
@property (copy, nonatomic) NSString *_Nullable transcodingExtraInfo;

@property (assign, nonatomic) AgoraAudioSampleRateType audioSampleRate;
@property (assign, nonatomic) NSInteger audioBitrate;  //kbps
@property (assign, nonatomic) NSInteger audioChannels;

+(AgoraLiveTranscoding *_Nonnull) defaultTranscoding;
@end

__attribute__((visibility("default"))) @interface AgoraLiveInjectStreamConfig: NSObject
@property (assign, nonatomic) CGSize size;
@property (assign, nonatomic) NSInteger videoGop;
@property (assign, nonatomic) NSInteger videoFramerate;
@property (assign, nonatomic) NSInteger videoBitrate;

@property (assign, nonatomic) AgoraAudioSampleRateType audioSampleRate;
@property (assign, nonatomic) NSInteger audioBitrate;  //kbps
@property (assign, nonatomic) NSInteger audioChannels;

+(AgoraLiveInjectStreamConfig *_Nonnull) defaultConfig;
@end

__attribute__((visibility("default"))) @interface AgoraRtcVideoCompositingRegion : NSObject
@property (assign, nonatomic) NSUInteger uid;
@property (assign, nonatomic) CGFloat x;
@property (assign, nonatomic) CGFloat y;
@property (assign, nonatomic) CGFloat width;
@property (assign, nonatomic) CGFloat height;
@property (assign, nonatomic) NSInteger zOrder; //optional, [0, 100] //0 (default): bottom most, 100: top most
@property (assign, nonatomic) CGFloat alpha; //optional, [0, 1.0] where 0 denotes throughly transparent, 1.0 opaque
@property (assign, nonatomic) AgoraVideoRenderMode renderMode;
@end

__attribute__((visibility("default"))) @interface AgoraRtcVideoCompositingLayout : NSObject
@property (assign, nonatomic) NSInteger canvasWidth;
@property (assign, nonatomic) NSInteger canvasHeight;
@property (copy, nonatomic) NSString * _Nullable backgroundColor;//e.g. "#c0c0c0"
@property (copy, nonatomic) NSArray<AgoraRtcVideoCompositingRegion *> * _Nullable regions;
@property (copy, nonatomic) NSString * _Nullable appData;//app defined data
@end

__attribute__((visibility("default"))) @interface AgoraPublisherConfiguration : NSObject
@property (assign, nonatomic) BOOL owner;
@property (assign, nonatomic) NSInteger width;
@property (assign, nonatomic) NSInteger height;
@property (assign, nonatomic) NSInteger framerate;
@property (assign, nonatomic) NSInteger bitrate;
@property (assign, nonatomic) NSInteger defaultLayout;
@property (assign, nonatomic) AgoraRtmpStreamLifeCycle lifeCycle;
@property (assign, nonatomic) NSInteger injectStreamWidth;
@property (assign, nonatomic) NSInteger injectStreamHeight;
@property (copy, nonatomic) NSString * _Nullable injectStreamUrl;
@property (copy, nonatomic) NSString * _Nullable publishUrl;
@property (copy, nonatomic) NSString * _Nullable rawStreamUrl;
@property (copy, nonatomic) NSString * _Nullable extraInfo;
-(BOOL) validate;
@end

#if (!(TARGET_OS_IPHONE) && (TARGET_OS_MAC))
__attribute__((visibility("default"))) @interface AgoraRtcDeviceInfo : NSObject
@property (assign, nonatomic) int index;
@property (assign, nonatomic) AgoraMediaDeviceType type;
@property (copy, nonatomic) NSString * _Nullable deviceId;
@property (copy, nonatomic) NSString * _Nullable deviceName;
@end
#endif

__attribute__((visibility("default"))) @interface AgoraVideoFrame : NSObject
@property (assign, nonatomic) NSInteger format; /* 12: ios texture (CVPixelBufferRef)
                                                 1: I420
                                                 2: BGRA
                                                 3: NV21
                                                 4: RGBA
                                                 5: IMC2
                                                 7: ARGB
                                                 8: NV12
                                                 */
@property (assign, nonatomic) CMTime time; // time for this frame.
@property (assign, nonatomic) int stride DEPRECATED_MSG_ATTRIBUTE("use strideInPixels instead");
@property (assign, nonatomic) int strideInPixels; // how many pixels between 2 consecutive rows. Note: in pixel, not byte.
// in case of ios texture, it is not used
@property (assign, nonatomic) int height; // how many rows of pixels, in case of ios texture, it is not used

@property (assign, nonatomic) CVPixelBufferRef _Nullable textureBuf;

@property (strong, nonatomic) NSData * _Nullable dataBuf;  // raw data buffer. in case of ios texture, it is not used
@property (assign, nonatomic) int cropLeft;   // how many pixels to crop on the left boundary
@property (assign, nonatomic) int cropTop;    // how many pixels to crop on the top boundary
@property (assign, nonatomic) int cropRight;  // how many pixels to crop on the right boundary
@property (assign, nonatomic) int cropBottom; // how many pixels to crop on the bottom boundary
@property (assign, nonatomic) int rotation;   // 0, 90, 180, 270. See document for rotation calculation
/* Note
 * 1. strideInPixels
 *    Stride is in unit of pixel, not byte
 * 2. About frame width and height
 *    No field defined for width. However, it can be deduced by:
 *       croppedWidth = (strideInPixels - cropLeft - cropRight)
 *    And
 *       croppedHeight = (height - cropTop - cropBottom)
 * 3. About crop
 *    _________________________________________________________________.....
 *    |                        ^                                      |  ^
 *    |                        |                                      |  |
 *    |                     cropTop                                   |  |
 *    |                        |                                      |  |
 *    |                        v                                      |  |
 *    |                ________________________________               |  |
 *    |                |                              |               |  |
 *    |                |                              |               |  |
 *    |<-- cropLeft -->|          valid region        |<- cropRight ->|
 *    |                |                              |               | height
 *    |                |                              |               |
 *    |                |_____________________________ |               |  |
 *    |                        ^                                      |  |
 *    |                        |                                      |  |
 *    |                     cropBottom                                |  |
 *    |                        |                                      |  |
 *    |                        v                                      |  v
 *    _________________________________________________________________......
 *    |                                                               |
 *    |<---------------- strideInPixels ----------------------------->|
 *
 *    If your buffer contains garbage data, you can crop them. E.g. frame size is
 *    360 x 640, often the buffer stride is 368, i.e. there extra 8 pixels on the
 *    right are for padding, and should be removed. In this case, you can set:
 *    strideInPixels = 368;
 *    height = 640;
 *    cropRight = 8;
 *    // cropLeft, cropTop, cropBottom are default to 0
 */

@end
