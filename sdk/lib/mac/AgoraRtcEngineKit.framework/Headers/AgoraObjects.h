//
//  AgoraObjects.h
//  AgoraRtcEngineKit
//
//  Copyright (c) 2018 Agora. All rights reserved.
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

/** Properties of the video canvas object.
 */
__attribute__((visibility("default"))) @interface AgoraRtcVideoCanvas : NSObject
/** The video display view.

 VIEW_CLASS is a general name for this property. See the following definitions for iOS and macOS:

 - iOS: UIView
 - MacOS: NSView
 */
@property (strong, nonatomic) VIEW_CLASS* _Nullable view;
/** Render mode of the view: AgoraVideoRenderMode
 */
@property (assign, nonatomic) AgoraVideoRenderMode renderMode;
/** User ID of the view.
 */
@property (assign, nonatomic) NSUInteger uid;
@end

/** The configurations of the last-mile network probe test. */
__attribute__((visibility("default"))) @interface AgoraLastmileProbeConfig : NSObject
/** Sets whether or not to test the uplink network. Some users, for example, the audience in a Live-broadcast channel, do not need such a test.

- NO: disables the test.
- YES: enables the test.
*/
@property (assign, nonatomic) BOOL probeUplink;
/** Sets whether or not to test the downlink network.

- NO: disables the test.
- YES: enables the test.
*/
@property (assign, nonatomic) BOOL probeDownlink;
/** The expected maximum sending bitrate (Kbps) of the local user.

The value ranges between 100 and 5000. We recommend setting this parameter according to the bitrate value set by [setVideoEncoderConfiguration]([AgoraRtcEngineKit setVideoEncoderConfiguration:]). */
@property (assign, nonatomic) NSUInteger expectedUplinkBitrate;
/** The expected maximum receiving bitrate (Kbps) of the local user.

The value ranges between 100 and 5000.
*/
@property (assign, nonatomic) NSUInteger expectedDownlinkBitrate;
@end

/** The last-mile network probe test result in one direction (uplink or downlink). */
__attribute__((visibility("default"))) @interface AgoraLastmileProbeOneWayResult : NSObject
/** The packet loss rate (%). */
@property (assign, nonatomic) NSUInteger packetLossRate;
/** The network jitter (ms). */
@property (assign, nonatomic) NSUInteger jitter;
/* The estimated available bandwidth (Kbps). */
@property (assign, nonatomic) NSUInteger availableBandwidth;
@end

/** The uplink and downlink last-mile network probe test result. */
__attribute__((visibility("default"))) @interface AgoraLastmileProbeResult : NSObject
/* The state of the probe test.

See [AgoraLastmileProbeResultState](AgoraLastmileProbeResultState).
*/
@property (assign, nonatomic) AgoraLastmileProbeResultState state;
/** The round-trip delay time (ms). */
@property (assign, nonatomic) NSUInteger rtt;
/** The uplink last-mile network report

See [AgoraLastmileProbeOneWayResult](AgoraLastmileProbeOneWayResult).
*/
@property (strong, nonatomic) AgoraLastmileProbeOneWayResult *_Nonnull uplinkReport;
/** The downlink last-mile network report

See [AgoraLastmileProbeOneWayResult](AgoraLastmileProbeOneWayResult).
*/
@property (strong, nonatomic) AgoraLastmileProbeOneWayResult *_Nonnull downlinkReport;
@end

/** Statistics of the local video stream.
 */
__attribute__((visibility("default"))) @interface AgoraRtcLocalVideoStats : NSObject
/** The average sending bitrate (Kbps) since the last count. */
@property (assign, nonatomic) NSUInteger sentBitrate;
/** The average sending frame rate (fps) since last count. */
@property (assign, nonatomic) NSUInteger sentFrameRate;
/** The encoder output frame rate (fps) of the local video. */
@property (assign, nonatomic) NSUInteger encoderOutputFrameRate;
/** The renderer output frame rate (fps) of the local video. */
@property (assign, nonatomic) NSUInteger rendererOutputFrameRate;
/** The target bitrate (Kbps) of the current encoder. This value is estimated by the SDK based on the current network conditions. */
@property (assign, nonatomic) NSUInteger sentTargetBitrate;
/** The target frame rate (fps) of the current encoder. */
@property (assign, nonatomic) NSUInteger sentTargetFrameRate;
/** Quality change of the local video in terms of target frame rate and target bit rate since last count, see [AgoraVideoQualityAdaptIndication](AgoraVideoQualityAdaptIndication). */
@property (assign, nonatomic) AgoraVideoQualityAdaptIndication qualityAdaptIndication;
@end

/** Statistics of the remote video stream.
 */
__attribute__((visibility("default"))) @interface AgoraRtcRemoteVideoStats : NSObject
/** User ID of the user sending the video streams.
 */
@property (assign, nonatomic) NSUInteger uid;
/** Time delay (ms). **DEPRECATED**
 */
@property (assign, nonatomic) NSUInteger __deprecated delay;
/** Width (pixels) of the video stream.
 */
@property (assign, nonatomic) NSUInteger width;
/** Height (pixels) of the video stream.
 */
@property (assign, nonatomic) NSUInteger height;
/** Data receive bitrate (Kbps) since last count.
 */
@property (assign, nonatomic) NSUInteger receivedBitrate;
/** The decoder output frame rate (fps) of the remote video.
 */
@property (assign, nonatomic) NSUInteger decoderOutputFrameRate;
/** The renderer output frame rate (fps) of the remote video.
 */
@property (assign, nonatomic) NSUInteger rendererOutputFrameRate;
/** Video stream type (high-stream or low-stream).
 */
@property (assign, nonatomic) AgoraVideoStreamType rxStreamType;
/** The total freeze time (ms) of the remote video stream after the remote user joins the channel. In a video session where the frame rate is set to no less than 5 fps, video freeze occurs when the time interval between two adjacent renderable video frames is more than 500 ms.
 */
@property (assign, nonatomic) NSUInteger totalFrozenTime;
/** The total video freeze time as a percentage (%) of the total time when the video is available.
 */
@property (assign, nonatomic) NSUInteger frozenRate;
@end

/** Statistics of the remote audio stream.
 */
__attribute__((visibility("default"))) @interface AgoraRtcRemoteAudioStats : NSObject
/** User ID of the user sending the audio stream.
 */
@property (assign, nonatomic) NSUInteger uid;
/** Audio quality received by the user.
 */
@property (assign, nonatomic) NSUInteger quality;
/** Network delay from the sender to the receiver.
 */
@property (assign, nonatomic) NSUInteger networkTransportDelay;
/** Jitter buffer delay at the receiver.
 */
@property (assign, nonatomic) NSUInteger jitterBufferDelay;
/** Packet loss rate in the reported interval.
 */
@property (assign, nonatomic) NSUInteger audioLossRate;
/** The number of channels.
 */
@property (assign, nonatomic) NSUInteger numChannels;
/** The sample rate (Hz) of the received audio stream, represented by an instantaneous value.
 */
@property (assign, nonatomic) NSUInteger receivedSampleRate;
/** The bitrate (Kbps) of the received audio stream, represented by an instantaneous value.
 */
@property (assign, nonatomic) NSUInteger receivedBitrate;
/** The total freeze time (ms) of the remote audio stream after the remote user joins the channel. In a session, audio freeze occurs when the audio frame loss rate reaches 4% within two seconds.
 */
@property (assign, nonatomic) NSUInteger totalFrozenTime;
/** The total audio freeze time as a percentage (%) of the total time when the audio is available.
 */
@property (assign, nonatomic) NSUInteger frozenRate;
@end

/** Properties of the audio volume information.

An array containing the user ID and volume information for each speaker:

- uid: User ID of the speaker. The uid of the local user is 0.
- volume：Volume of the speaker. The value ranges between 0 (lowest volume) and 255 (highest volume).
 */
__attribute__((visibility("default"))) @interface AgoraRtcAudioVolumeInfo : NSObject
/** User ID of the speaker.
 */
@property (assign, nonatomic) NSUInteger uid;
/** The volume of the speaker. The value ranges between 0 (lowest volume) to 255 (highest volume).
 */
@property (assign, nonatomic) NSUInteger volume;
@end

/** Statistics of the channel
 */
__attribute__((visibility("default"))) @interface AgoraChannelStats: NSObject
/** Call duration (s), represented by an aggregate value.
 */
@property (assign, nonatomic) NSInteger duration;
/** Total number of bytes transmitted, represented by an aggregate value.
 */
@property (assign, nonatomic) NSInteger txBytes;
/** Total number of bytes received, represented by an aggregate value.
 */
@property (assign, nonatomic) NSInteger rxBytes;
/** Audio packet transmission bitrate (Kbps), represented by an instantaneous value.
 */
@property (assign, nonatomic) NSInteger txAudioKBitrate;
/** Audio receive bitrate (Kbps), represented by an instantaneous value.
 */
@property (assign, nonatomic) NSInteger rxAudioKBitrate;
/** Video transmission bitrate (Kbps), represented by an instantaneous value.
 */
@property (assign, nonatomic) NSInteger txVideoKBitrate;
/** Video receive bitrate (Kbps), represented by an instantaneous value.
 */
@property (assign, nonatomic) NSInteger rxVideoKBitrate;
/** Client-server latency (ms)
 */
@property (assign, nonatomic) NSInteger lastmileDelay;
/** The packet loss rate (%) from the local client to Agora's edge server.
 */
@property (assign, nonatomic) NSInteger txPacketLossRate;
/** The packet loss rate (%) from Agora's edge server to the local client.
 */
@property (assign, nonatomic) NSInteger rxPacketLossRate;
/** Number of users in the channel.

- Communication profile: The number of users in the channel.
- Live broadcast profile:

  - If the local user is an audience: The number of users in the channel = The number of hosts in the channel + 1.
  - If the user is a host: The number of users in the channel = The number of hosts in the channel.
 */
@property (assign, nonatomic) NSInteger userCount;
/** Application CPU usage (%).
 */
@property (assign, nonatomic) double cpuAppUsage;
/** System CPU usage (%).
 */
@property (assign, nonatomic) double cpuTotalUsage;
@end

/** Properties of the video encoder configuration.
 */
__attribute__((visibility("default"))) @interface AgoraVideoEncoderConfiguration: NSObject
/** The video frame dimension used to specify the video quality in the total number of pixels along a frame's width and height.

You can customize the dimension, or select from the following list:

 - AgoraVideoDimension120x120
 - AgoraVideoDimension160x120
 - AgoraVideoDimension180x180
 - AgoraVideoDimension240x180
 - AgoraVideoDimension320x180
 - AgoraVideoDimension240x240
 - AgoraVideoDimension320x240
 - AgoraVideoDimension424x240
 - AgoraVideoDimension360x360
 - AgoraVideoDimension480x360
 - AgoraVideoDimension640x360
 - AgoraVideoDimension480x480
 - AgoraVideoDimension640x480
 - AgoraVideoDimension840x480
 - AgoraVideoDimension960x720
 - AgoraVideoDimension1280x720
 - AgoraVideoDimension1920x1080 (macOS only)
 - AgoraVideoDimension2540x1440 (macOS only)
 - AgoraVideoDimension3840x2160 (macOS only)

 Note:

 - The dimension does not specify the orientation mode of the output ratio. For how to set the video orientation, see [AgoraVideoOutputOrientationMode](AgoraVideoOutputOrientationMode).
 - Whether 720p can be supported depends on the device. If the device cannot support 720p, the frame rate will be lower than the one listed in the table. Agora optimizes the video in lower-end devices.
 - iPhones do not support video frame dimensions above 720p.
 */
@property (assign, nonatomic) CGSize dimensions;

/** The frame rate of the video (fps).

You can either set the frame rate manually or choose from the following options. We do not recommend setting this to a value greater than 30.

  *  AgoraVideoFrameRateFps1(1): 1 fps
  *  AgoraVideoFrameRateFps7(7): 7 fps
  *  AgoraVideoFrameRateFps10(10): 10 fps
  *  AgoraVideoFrameRateFps15(15): 15 fps
  *  AgoraVideoFrameRateFps24(24): 24 fps
  *  AgoraVideoFrameRateFps30(30): 30 fps
  *  AgoraVideoFrameRateFps60(30): 60 fps (macOS only)
 */
@property (assign, nonatomic) NSInteger frameRate;

/** The minimum video encoder frame rate (fps).

The default value is DEFAULT_MIN_BITRATE(-1) (the SDK uses the lowest encoder frame rate). For information on scenarios and considerations, see [Set the Video Profile (iOS)](../../../videoProfile_ios) or [Set the Video Profile (macOS)](../../../videoProfile_mac).
*/
@property (assign, nonatomic) NSInteger minFrameRate;

/** The bitrate of the video.

 Sets the video bitrate (Kbps). Refer to the table below and set your bitrate. If you set a bitrate beyond the proper range, the SDK automatically adjusts it to a value within the range. You can also choose from the following options:

 - AgoraVideoBitrateStandard: (recommended) the standard bitrate mode. In this mode, the bitrates differ between the Live-broadcast and Communication profiles:

     - Communication profile: the video bitrate is the same as the base bitrate.
     - Live-broadcast profile: the video bitrate is twice the base bitrate.

 - AgoraVideoBitrateCompatible: the compatible bitrate mode. In this mode, the bitrate stays the same regardless of the profile. In the Live-broadcast profile, if you choose this mode, the video frame rate may be lower than the set value.

Agora uses different video codecs for different profiles to optimize the user experience. For example, the Communication profile prioritizes the smoothness while the Live-broadcast profile prioritizes the video quality (a higher bitrate). Therefore, Agora recommends setting this parameter as AgoraVideoBitrateStandard.

**Video Bitrate Table**

| Resolution        	| Frame Rate (fps) 	| Base Bitrate (Kbps, for Communication) 	| Live Bitrate (Kbps, for Live Broadcast) 	|
|-------------------	|------------------	|----------------------------------------	|-----------------------------------------	|
| 160 &times; 120   	| 15               	| 65                                     	| 130                                     	|
| 120 &times; 120   	| 15               	| 50                                     	| 100                                     	|
| 320 &times; 180   	| 15               	| 140                                    	| 280                                     	|
| 180 &times; 180   	| 15               	| 100                                    	| 200                                     	|
| 240 &times; 180   	| 15               	| 120                                    	| 240                                     	|
| 320 &times; 240   	| 15               	| 200                                    	| 400                                     	|
| 240 &times; 240   	| 15               	| 140                                    	| 280                                     	|
| 424 &times; 240   	| 15               	| 220                                    	| 440                                     	|
| 640 &times; 360   	| 15               	| 400                                    	| 800                                     	|
| 360 &times; 360   	| 15               	| 260                                    	| 520                                     	|
| 640 &times; 360   	| 30               	| 600                                    	| 1200                                    	|
| 360 &times; 360   	| 30               	| 400                                    	| 800                                     	|
| 480 &times; 360   	| 15               	| 320                                    	| 640                                     	|
| 480 &times; 360   	| 30               	| 490                                    	| 980                                     	|
| 640 &times; 480   	| 15               	| 500                                    	| 1000                                    	|
| 480 &times; 480   	| 15               	| 400                                    	| 800                                     	|
| 640 &times; 480   	| 30               	| 750                                    	| 1500                                    	|
| 480 &times; 480   	| 30               	| 600                                    	| 1200                                    	|
| 848 &times; 480   	| 15               	| 610                                    	| 1220                                    	|
| 848 &times; 480   	| 30               	| 930                                    	| 1860                                    	|
| 640 &times; 480   	| 10               	| 400                                    	| 800                                     	|
| 1280 &times; 720  	| 15               	| 1130                                   	| 2260                                    	|
| 1280 &times; 720  	| 30               	| 1710                                   	| 3420                                    	|
| 960 &times; 720   	| 15               	| 910                                    	| 1820                                    	|
| 960 &times; 720   	| 30               	| 1380                                   	| 2760                                    	|
| 1920 &times; 1080 	| 15               	| 2080                                   	| 4160                                    	|
| 1920 &times; 1080 	| 30               	| 3150                                   	| 6300                                    	|
| 1920 &times; 1080 	| 60               	| 4780                                   	| 6500                                    	|
| 2560 &times; 1440 	| 30               	| 4850                                   	| 6500                                    	|
| 2560 &times; 1440 	| 60               	| 6500                                   	| 6500                                    	|
| 3840 &times; 2160 	| 30               	| 6500                                   	| 6500                                    	|
| 3840 &times; 2160 	| 60               	| 6500                                   	| 6500                                    	|


**Note:**

The base bitrate in this table applies to the Communication profile. The Live-broadcast profile generally requires a higher bitrate for better video quality. Agora recommends setting the bitrate mode as AgoraVideoBitrateStandard. You can also set the bitrate as twice the base bitrate.


*/
@property (assign, nonatomic) NSInteger bitrate;

/** The minimum encoding bitrate.

Sets the minimum encoding bitrate (Kbps).

The Agora SDK automatically adjusts the encoding bitrate to adapt to network conditions. Using a value greater than the default value forces the video encoder to output high-quality images but may cause more packet loss and hence sacrifice the smoothness of the video transmission. Unless you have special requirements for image quality, Agora does not recommend changing this value.

**Note:**

This parameter applies only to the Live-broadcast profile.*/
@property (assign, nonatomic) NSInteger minBitrate;

/** The video orientation mode of the video: AgoraVideoOutputOrientationMode.

 * AgoraVideoOutputOrientationModeAdaptative(0): (Default) The output video always follows the orientation of the captured video, because the receiver takes the rotational information passed on from the video encoder.
   - If the captured video is in landscape mode, the output video is in landscape mode.
   - If the captured video is in portrait mode, the output video is in portrait mode.
 * AgoraVideoOutputOrientationModeFixedLandscape(1): The output video is always in landscape mode. If the captured video is in portrait mode, the video encoder crops it to fit the output. This applies to situations where the receiver cannot process the rotational information. For example, CDN live streaming.
 * AgoraVideoOutputOrientationModeFixedPortrait(2): The output video is always in portrait mode. If the captured video is in landscape mode, the video encoder crops it to fit the output. This applies to situations where the receiver cannot process the rotational information. For example, CDN live streaming.

For scenarios with video rotation, Agora provides [Basic: Video Rotation Guide](https://docs.agora.io/en/2.3/product/Interactive%20Broadcast/Quickstart%20Guide/rotation_guide_ios) to guide users on how to set this parameter to get the preferred video orientation.

 */
@property (assign, nonatomic) AgoraVideoOutputOrientationMode orientationMode;

/** The video encoding degradation preference under limited bandwidth.

AgoraDegradationPreference:

* AgoraDegradationMaintainQuality(0): (Default) Degrades the frame rate to guarantee the video quality.
* AgoraDegradationMaintainFramerate(1): Degrades the video quality to guarantee the frame rate.
*/
@property (assign, nonatomic) AgoraDegradationPreference degradationPreference;

/** Initializes and returns a newly allocated AgoraVideoEncoderConfiguration object with the specified video resolution.

 @param size Video resolution.
 @param frameRate Video frame rate.
 @param bitrate Video bitrate.
 @param orientationMode AgoraVideoOutputOrientationMode.
 @return An initialized AgoraVideoEncoderConfiguration object.
 */
- (instancetype _Nonnull)initWithSize:(CGSize)size
                            frameRate:(AgoraVideoFrameRate)frameRate
                              bitrate:(NSInteger)bitrate
                      orientationMode:(AgoraVideoOutputOrientationMode)orientationMode;

/** Initializes and returns a newly allocated AgoraVideoEncoderConfiguration object with the specified video width and height.

 @param width Width of the video.
 @param height Height of the video.
 @param frameRate Video frame rate.
 @param bitrate Video bitrate.
 @param orientationMode AgoraVideoOutputOrientationMode.
 @return An initialized AgoraVideoEncoderConfiguration object.
 */
- (instancetype _Nonnull)initWithWidth:(NSInteger)width
                                height:(NSInteger)height
                             frameRate:(AgoraVideoFrameRate)frameRate
                               bitrate:(NSInteger)bitrate
                       orientationMode:(AgoraVideoOutputOrientationMode)orientationMode;
@end

/** Properties of the screen sharing encoding parameters.
 */
__attribute__((visibility("default"))) @interface AgoraScreenCaptureParameters: NSObject
/**  The maximum encoding dimensions for screen sharing.

The default value is 1920 x 1080 pixels, that is, 2073600 pixels. Agora uses the value of this parameter to calculate the charges.

If the aspect ratio is different between the encoding dimensions and screen dimensions, Agora applies the following algorithms for encoding. Suppose the encoding dimensions are 1920 x 1080:

- If the value of the screen dimensions is lower than that of the encoding dimensions, for example, 1000 x 1000, the SDK uses 1000 x 1000 for encoding.
- If the value of the screen dimensions is higher than that of the encoding dimensions, for example, 2000 x 1500, the SDK uses the maximum value under 1920 x 1080 with the aspect ratio of the screen dimension (4:3) for encoding, that is, 1440 x 1080.

In either case, Agora uses the value of this parameter to calculate the charges.
 */
@property (assign, nonatomic) CGSize dimensions;

/** The frame rate (fps) of the shared region. The default value is 5. We do not recommend setting this to a value greater than 15.
 */
@property (assign, nonatomic) NSInteger frameRate;

/** The bitrate (Kbps) of the shared region. The default value is 0 (the SDK works out a bitrate according to the dimensions of the current screen).
 */
@property (assign, nonatomic) NSInteger bitrate;

/** Sets whether or not to capture the mouse for screen sharing.

- YES: (Default) Capture the mouse.
- NO: Do not capture the mouse.
 */
@property (assign, nonatomic) BOOL captureMouseCursor;

@end

/** A class for providing user-specific CDN live audio/video transcoding settings.
 */
__attribute__((visibility("default"))) @interface AgoraLiveTranscodingUser: NSObject
/** User ID of the CDN live host.
 */
@property (assign, nonatomic) NSUInteger uid;
/** Position and size of the video frame.
 */
@property (assign, nonatomic) CGRect rect;
/**  Layer position of the video frame. The value ranges between 0 and 100.

From v2.3.0, the Agora SDK supports setting zOrder as 0.

    - 0: (Default) Lowest.
    - 100: Highest.

 Note: If the value is set to < 0 or > 100, the ERR_INVALID_ARGUMENT error occurs.
 */
@property (assign, nonatomic) NSInteger zOrder;
/** Transparency of the video frame.

 The value ranges between 0.0 and 1.0:

 * 0.0: Completely transparent.
 * 1.0: (Default) Opaque.
 */
@property (assign, nonatomic) double alpha;
/** The audio channel of the sound.

 The default value is 0:

    - 0: (Default) Supports dual channels. Depends on the upstream of the broadcaster.
    - 1: The audio stream of the broadcaster uses the FL audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
    - 2: The audio stream of the broadcaster uses the FC audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
    - 3: The audio stream of the broadcaster uses the FR audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
    - 4: The audio stream of the broadcaster uses the BL audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
    - 5: The audio stream of the broadcaster uses the BR audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.

Note: If your setting is not 0, you may need a specialized player.
 */
@property (assign, nonatomic) NSInteger audioChannel;
@end

/** Image properties.

 A class for setting the properties of the watermark and background images in live broadcasting.
 */
__attribute__((visibility("default"))) @interface AgoraImage: NSObject
/** URL address of the image on the broadcasting video.

The maximum length of this parameter is 1024 bytes.
 */
@property (strong, nonatomic) NSURL *_Nonnull url;
/** Position and size of the image on the broadcasting video in CGRect.
 */
@property (assign, nonatomic) CGRect rect;
@end

/** A class for managing user-specific CDN live audio/video transcoding settings.
 */
__attribute__((visibility("default"))) @interface AgoraLiveTranscoding: NSObject
/** Size of the video (width and height). The minimum value of width x height is 16 x 16.
 */
@property (assign, nonatomic) CGSize size;
/** Bitrate of the CDN live output video stream.

The default value is 400 Kbps.

Set this parameter according to the Video Bitrate Table. If you set a bitrate beyond the proper range, the SDK automatically adapts it to a value within the range.
 */
@property (assign, nonatomic) NSInteger videoBitrate;
/** Frame rate of the CDN live output video stream.

The default value is 15 fps. Agora adjusts all values over 30 to 30.
 */
@property (assign, nonatomic) NSInteger videoFramerate;
/** Latency mode. **DEPRECATED** from v2.8.0

 * YES: Low latency with unassured quality.
 * NO:（Default）High latency with assured quality.
 */
@property (assign, nonatomic) BOOL lowLatency;
/** Video GOP in frames. The default value is 30 fps. */
@property (assign, nonatomic) NSInteger videoGop;
/** Video codec profile type

Set it as 66, 77, or 100 (default), see AgoraVideoCodecProfileType.

If you set this parameter to other values, Agora adjusts it to the default value of 100.
 */
@property (assign, nonatomic) AgoraVideoCodecProfileType videoCodecProfile;

/** An AgoraLiveTranscodingUser object managing the user layout configuration in the CDN live stream. Agora supports a maximum of 17 transcoding users in a CDN live stream channel. See AgoraLiveTranscodingUser.
 */
@property (copy, nonatomic) NSArray<AgoraLiveTranscodingUser *> *_Nullable transcodingUsers;
/** Reserved property. Extra user-defined information to send SEI for the H.264/H.265 video stream to the CDN live client. Maximum length: 4096 bytes. For more information on SEI, see [SEI-related questions](https://docs.agora.io/cn/Agora%20Platform/live_related_faq?platform=%E7%9B%B4%E6%92%AD%E7%9B%B8%E5%85%B3#sei).
 */
@property (copy, nonatomic) NSString *_Nullable transcodingExtraInfo;
/** The watermark image added to the CDN live publishing stream.

The audience of the CDN live publishing stream can see the watermark. Ensure that the format of the image is PNG.

See AgoraImage for the definition of the watermark.
 */
@property (strong, nonatomic) AgoraImage *_Nullable watermark;
/** The background image added to the CDN live publishing stream.

The audience of the CDN live publishing stream can see the background image. See AgoraImage for the definition of the background image.
 */
@property (strong, nonatomic) AgoraImage *_Nullable backgroundImage;
/** The background color in RGB hex value. Value only, do not include a #.

COLOR_CLASS is a general name for the type:

* iOS: UIColor
* MacOS: NSColor
 */
@property (strong, nonatomic) COLOR_CLASS *_Nullable backgroundColor;

/** Self-defined audio sample rate: AgoraAudioSampleRateType.
 */
@property (assign, nonatomic) AgoraAudioSampleRateType audioSampleRate;
/** Bitrate (Kbps) of the CDN live audio output stream. The default value is 48, and the highest value is 128.
 */
@property (assign, nonatomic) NSInteger audioBitrate;
/** Agora’s self-defined audio channel type. Agora recommends choosing 1 or 2. Special players are required if you choose 3, 4, or 5:

 * 1: (Default) Mono
 * 2: Two-channel stereo
 * 3: Three-channel stereo
 * 4: Four-channel stereo
 * 5: Five-channel stereo
 */
@property (assign, nonatomic) NSInteger audioChannels;
/**
 Audio codec profile. See AgoraAudioCodecProfileType.

 The default value is AgoraAudioCodecProfileLCAAC(0).
 */
@property (assign, nonatomic) AgoraAudioCodecProfileType audioCodecProfile;

/** Creates a default transcoding object.

 @return Default AgoraLiveTranscoding object.
 */
+(AgoraLiveTranscoding *_Nonnull) defaultTranscoding;

-(int)addUser:(AgoraLiveTranscodingUser * _Nonnull)user;

-(int)removeUser:(NSUInteger)uid;
@end

/** Configuration of the imported live broadcast voice or video stream.
 */
__attribute__((visibility("default"))) @interface AgoraLiveInjectStreamConfig: NSObject
/** Size of the added stream to the broadcast.

The default value is 0; same size as the original stream.
 */
@property (assign, nonatomic) CGSize size;
/** Video GOP of the added stream to the broadcast.

The default value is 30 fps.
 */
@property (assign, nonatomic) NSInteger videoGop;
/** Video frame rate of the added stream to the broadcast.

The default value is 15 fps.
 */
@property (assign, nonatomic) NSInteger videoFramerate;
/** Video bitrate of the added stream to the broadcast.

The default value is 400 Kbps.

The setting of the video bitrate is closely linked to the resolution. If the video bitrate you set is beyond a reasonable range, the SDK will set it within a reasonable range instead.
 */
@property (assign, nonatomic) NSInteger videoBitrate;

/** Audio sample rate of the added stream to the broadcast.

The default value is 48000 Hz. See AgoraAudioSampleRateType for details.

**Note:**

Agora recommends using the default value.
 */
@property (assign, nonatomic) AgoraAudioSampleRateType audioSampleRate;
/** Audio bitrate of the added stream to the broadcast.

The default value is 48 Kbps.

**Note:**

Agora recommends using the default value.
 */
@property (assign, nonatomic) NSInteger audioBitrate;
/** Number of audio channels to add to the broadcast. The values are 1 and 2.

The default value is 1.

**Note:**

Agora recommends using the default value.
 */
@property (assign, nonatomic) NSInteger audioChannels;

/** Creates a default stream configuration object.

 @return Default stream configuration object.
 */
+(AgoraLiveInjectStreamConfig *_Nonnull) defaultConfig;
@end

/** the configuration of camera capturer.
 */
__attribute__((visibility("default"))) @interface AgoraCameraCapturerConfiguration: NSObject
/** This preference will balance the performance and preview quality by adjusting camera output frame size.
 */
@property (assign, nonatomic) AgoraCameraCaptureOutputPreference preference;
@end

__deprecated

/** Defines the region to show the video on the screen for each host in the channel.

**DEPRECATED**

 */
__attribute__((visibility("default"))) @interface AgoraRtcVideoCompositingRegion : NSObject
/** ID of the user whose video is displayed on the screen. */
@property (assign, nonatomic) NSUInteger uid;
/** Horizontal position of the region on the screen. The value ranges between 0.0 and 1.0. */
@property (assign, nonatomic) CGFloat x;
/** Vertical position of the region on the screen. The value ranges between 0.0 and 1.0. */
@property (assign, nonatomic) CGFloat y;
/** Actual width of the region. The value ranges between 0.0 and 1.0. For example, if the width of the screen is 360, and the width of the region is 120, set the value as 0.33. */
@property (assign, nonatomic) CGFloat width;
/** Actual height of the region. The value ranges between 0.0 and 1.0. For example, if the height of the screen is 240, and the height of the region is 120, set the value as 0.5. */
@property (assign, nonatomic) CGFloat height;
/** Layer position of the region. The value ranges between 0 and 100:

- 0: The region is at the bottom layer.
- 100: The region is at the top layer.

From v2.3.0, the Agora SDK supports setting zOrder as 0.
 */
@property (assign, nonatomic) NSInteger zOrder;
/** The transparency of the region. The value ranges between 0.0 and 1.0:

- 0: The region is transparent.
- 1: (Default) The region is opaque.
*/
@property (assign, nonatomic) CGFloat alpha;
/** Please ignore this property. Setting this property will not take effect. */
@property (assign, nonatomic) AgoraVideoRenderMode renderMode;
@end

__deprecated
/** Rtc video compositing layout.

**DEPRECATED**
 */
__attribute__((visibility("default"))) @interface AgoraRtcVideoCompositingLayout : NSObject
/** Please ignore this property.

Width of the entire canvas (display window or screen).
 */
@property (assign, nonatomic) NSInteger canvasWidth;
/** Please ignore this property.

Height of the entire canvas (display window or screen).
 */
@property (assign, nonatomic) NSInteger canvasHeight;
/** The background color in RGB hex value. Value only, do not include a #.
 */
@property (copy, nonatomic) NSString * _Nullable backgroundColor;
/** Screen display region information.

Sets the screen display region of a host or a delegated host in a CDN live stream. See AgoraRtcVideoCompositingRegion.
 */
@property (copy, nonatomic) NSArray<AgoraRtcVideoCompositingRegion *> * _Nullable regions;
/** App defined data. Maximum size of 2048 bytes. */
@property (copy, nonatomic) NSString * _Nullable appData;
@end

/** CDN live stream settings.

 **DEPRECATED**

 Agora recommends using [setLiveTranscoding]([AgoraRtcEngineKit setLiveTranscoding:]) to set the CDN live stream settings.
 */
__deprecated
__attribute__((visibility("default"))) @interface AgoraPublisherConfiguration : NSObject
/** Sets whether or not the current host is the RTMP stream owner.

 - YES: (Default) The current host is the RTMP stream owner and the push-stream configuration is enabled.
 - NO: The current host is not the RTMP stream owner and the push-stream configuration is disabled.
 */
@property (assign, nonatomic) BOOL owner;

/** Width of the CDN live output data stream. The default value is 360.
 */
@property (assign, nonatomic) NSInteger width;
/** Height of the CDN live output data stream. The default value is 640.
 */
@property (assign, nonatomic) NSInteger height;
/** Frame rate of the CDN live output data stream. The default value is 15 fps.
 */
@property (assign, nonatomic) NSInteger framerate;
/** Bitrate of the CDN live output data stream. The default value is 500 Kbps.
 */
@property (assign, nonatomic) NSInteger bitrate;
/** Audio sample rate of the CDN live output data stream. The default value is 48000 Hz.
 */
@property (assign, nonatomic) NSInteger audiosamplerate;
/** Audio bitrate of the CDN live output data stream.  The default value is 48 Kbps.
 */
@property (assign, nonatomic) NSInteger audiobitrate;
/** Number of audio channels of the CDN live output data stream. The default value is 1.
 */
@property (assign, nonatomic) NSInteger audiochannels;
/**

* 0: Tile horizontally.
* 1: Layered windows.
* 2: Tile vertically.
 */
@property (assign, nonatomic) NSInteger defaultLayout;
/** CDN live video stream lifecycle: AgoraRtmpStreamLifeCycle.
 */
@property (assign, nonatomic) AgoraRtmpStreamLifeCycle lifeCycle;

/** Width of the injected stream. Set it as 0.
 */
@property (assign, nonatomic) NSInteger injectStreamWidth;

/** Height of the injected stream. Set it as 0.
 */
@property (assign, nonatomic) NSInteger injectStreamHeight;

/** Address of the injected stream into the channel.
 */
@property (copy, nonatomic) NSString * _Nullable injectStreamUrl;

/** The push-stream address for the picture-in-picture layouts. The default value is nil.
 */
@property (copy, nonatomic) NSString * _Nullable publishUrl;

/** The push-stream RTMP URL address of the original stream before transcoding. The default value is nil.
 */
@property (copy, nonatomic) NSString * _Nullable rawStreamUrl;

/** Reserved field. The default value is nil.
 */
@property (copy, nonatomic) NSString * _Nullable extraInfo;

/** Whether or not the configuration is validated.
 */
-(BOOL) validate;
@end

#if (!(TARGET_OS_IPHONE) && (TARGET_OS_MAC))

/** AgoraRtcDeviceInfo array.
 */
__attribute__((visibility("default"))) @interface AgoraRtcDeviceInfo : NSObject
@property (assign, nonatomic) int __deprecated index;

/** Device type: AgoraMediaDeviceType.
 */
@property (assign, nonatomic) AgoraMediaDeviceType type;

/** Device ID.
 */
@property (copy, nonatomic) NSString * _Nullable deviceId;

/** Device name.
 */
@property (copy, nonatomic) NSString * _Nullable deviceName;
@end
#endif

/** Video frame containing the Agora SDK's encoded video data.
 */
__attribute__((visibility("default"))) @interface AgoraVideoFrame : NSObject
/** Video format:

 * 1: I420
 * 2: BGRA
 * 3: NV21
 * 4: RGBA
 * 5: IMC2
 * 7: ARGB
 * 8: NV12
 * 12: iOS texture (CVPixelBufferRef)
 */
@property (assign, nonatomic) NSInteger format;

/** Timestamp of the incoming video frame (ms).

An incorrect timestamp results in frame loss or unsynchronized audio and video.

 */
@property (assign, nonatomic) CMTime time; // Time for this frame.

@property (assign, nonatomic) int stride DEPRECATED_MSG_ATTRIBUTE("use strideInPixels instead");

/** Line spacing of the incoming video frame, which must be in pixels instead of bytes. For textures, it is the width of the texture.
 */
@property (assign, nonatomic) int strideInPixels; // Number of pixels between two consecutive rows. Note: in pixel, not byte. Not used for iOS textures.

/** Height of the incoming video frame
 */
@property (assign, nonatomic) int height; // Number of rows of pixels. Not used for iOS textures.

/** CVPixelBuffer
 */
@property (assign, nonatomic) CVPixelBufferRef _Nullable textureBuf;

/** Raw data buffer
 */
@property (strong, nonatomic) NSData * _Nullable dataBuf;  // Raw data buffer. Not used for iOS textures.

/** (Optional) The number of pixels trimmed from the left. The default value is 0.
 */
@property (assign, nonatomic) int cropLeft;   // Number of pixels to crop on the left boundary.
/** (Optional) The number of pixels trimmed from the top. The default value is 0.
 */
@property (assign, nonatomic) int cropTop;    // Number of pixels to crop on the top boundary.
/** (Optional) The number of pixels trimmed from the right. The default value is 0.
 */
@property (assign, nonatomic) int cropRight;  // Number of pixels to crop on the right boundary.
/** (Optional) The number of pixels trimmed from the bottom. The default value is 0.
 */
@property (assign, nonatomic) int cropBottom; // Number of pixels to crop on the bottom boundary.
/** (Optional) The clockwise rotation of the incoming video frame.

Optional values: 0, 90, 180, or 270. The default value is 0.
 */
@property (assign, nonatomic) int rotation;   // 0, 90, 180, 270. See document for rotation calculation.
/* Note
 * 1. strideInPixels
 *    Stride is in pixels, not bytes.
 * 2. About the frame width and height.
 *    No field is defined for the width. However, it can be deduced by:
 *       croppedWidth = (strideInPixels - cropLeft - cropRight)
 *    And
 *       croppedHeight = (height - cropTop - cropBottom)
 * 3. About crop.
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
 *    If your buffer contains garbage data, you can crop them. For example, if the frame size is
 *    360 &times; 640, often the buffer stride is 368, that is, the extra 8 pixels on the
 *    right are for padding, and should be removed. In this case, you can set:
 *    strideInPixels = 368;
 *    height = 640;
 *    cropRight = 8;
 *    // cropLeft, cropTop, cropBottom are set to a default of 0
 */
@end

/** The image enhancement options in [setBeautyEffectOptions]([AgoraRtcEngineKit setBeautyEffectOptions:options:]). */
__attribute__((visibility("default"))) @interface AgoraBeautyOptions : NSObject

/** The lightening contrast level

[AgoraLighteningContrastLevel](AgoraLighteningContrastLevel), used with the lighteningLevel property:

- 0: Low contrast level.
- 1: (Default) Normal contrast level.
- 2: High contrast level.
*/
@property (nonatomic, assign) AgoraLighteningContrastLevel lighteningContrastLevel;

/** The brightness level.

The default value is 0.7. The value ranges from 0.0 (original) to 1.0.
 */
@property (nonatomic, assign) float lighteningLevel;

/** The sharpness level.

The default value is 0.5. The value ranges from 0.0 (original) to 1.0. This parameter is usually used to remove blemishes.
 */
@property (nonatomic, assign) float smoothnessLevel;

/** The redness level.

The default value is 0.1. The value ranges from 0.0 (original) to 1.0. This parameter adjusts the red saturation level.
*/
@property (nonatomic, assign) float rednessLevel;

@end

/** The user information, including the user ID and user account. */
__attribute__((visibility("default"))) @interface AgoraUserInfo : NSObject
/** The user ID of a user.
 */
@property (nonatomic, assign) NSUInteger uid;
/** The user account of a user.
 */
@property (copy, nonatomic) NSString * _Nullable userAccount;
@end
