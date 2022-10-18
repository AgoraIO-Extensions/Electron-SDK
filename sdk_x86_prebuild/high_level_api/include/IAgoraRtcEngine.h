//
//  Agora Rtc Engine SDK
//
//  Copyright (c) 2018 Agora.io. All rights reserved.
//
#pragma once

#include "AgoraBase.h"
#include "AgoraOptional.h"
#include "IAgoraLog.h"

/** Gets the SDK version number.
 *
 * @param build Build number of the Agora SDK.
 * @return
 * - 0: Success.
 * - < 0: Failure.
 */
AGORA_API const char* AGORA_CALL getAgoraSdkVersion(int* build);

namespace agora {
namespace rtc {

class IVideoFilter;

/**
 * The maximum device ID length.
 */
enum MAX_DEVICE_ID_LENGTH_TYPE {
  /**
   * The maximum device ID length is 512.
   */
  MAX_DEVICE_ID_LENGTH = 512
};

/**
 * The media device types.
 */
enum MEDIA_DEVICE_TYPE {
  /**
   * -1: Unknown device type.
   */
  UNKNOWN_AUDIO_DEVICE = -1,
  /**
   * 0: The audio playback device.
   */
  AUDIO_PLAYOUT_DEVICE = 0,
  /**
   * 1: The audio recording device.
   */
  AUDIO_RECORDING_DEVICE = 1,
  /**
   * 2: The video renderer.
   */
  VIDEO_RENDER_DEVICE = 2,
  /**
   * 3: The video capturer.
   */
  VIDEO_CAPTURE_DEVICE = 3,
  /**
   * 4: The audio playback device of the app.
   */
  AUDIO_APPLICATION_PLAYOUT_DEVICE = 4,
};

/**
 * The audio recording quality type.
 */
enum AUDIO_RECORDING_QUALITY_TYPE {
  /**
   * 0: Low audio recording quality.
   */
  AUDIO_RECORDING_QUALITY_LOW = 0,
  /**
   * 1: Medium audio recording quality.
   */
  AUDIO_RECORDING_QUALITY_MEDIUM = 1,
  /**
   * 2: High audio recording quality.
   */
  AUDIO_RECORDING_QUALITY_HIGH = 2,
};

/**
 The states of the local user's audio mixing file.
 */
enum AUDIO_MIXING_STATE_TYPE {
 /** 710: The audio mixing file is playing. */
  AUDIO_MIXING_STATE_PLAYING = 710,
  /** 711: The audio mixing file pauses playing. */
  AUDIO_MIXING_STATE_PAUSED = 711,
  /** 713: The audio mixing file stops playing. */
  AUDIO_MIXING_STATE_STOPPED = 713,
  /** 714: An exception occurs when playing the audio mixing file. 
   See #AUDIO_MIXING_ERROR_TYPE. 
   */
  AUDIO_MIXING_STATE_FAILED = 714,
  /** 715: The audio mixing file is played once. */
  AUDIO_MIXING_STATE_COMPLETED = 715,
  /** 716: The audio mixing file is all played out. */
  AUDIO_MIXING_STATE_ALL_LOOPS_COMPLETED = 716,
};

/**
 The error codes of the local user's audio mixing file.
 */
enum AUDIO_MIXING_ERROR_TYPE {
  /** 701: The SDK cannot open the audio mixing file. */
  AUDIO_MIXING_ERROR_CAN_NOT_OPEN = 701,
  /** 702: The SDK opens the audio mixing file too frequently. */
  AUDIO_MIXING_ERROR_TOO_FREQUENT_CALL = 702,
  /** 703: The audio mixing file playback is interrupted. */
  AUDIO_MIXING_ERROR_INTERRUPTED_EOF = 703,
  /** 0: The SDK can open the audio mixing file. */
  AUDIO_MIXING_ERROR_OK = 0,
};

/**
 * The status of importing an external video stream in a live broadcast.
 */
enum INJECT_STREAM_STATUS {
  /**
   * 0: The media stream is injected successfully.
   */
  INJECT_STREAM_STATUS_START_SUCCESS = 0,
  /**
   * 1: The media stream already exists.
   */
  INJECT_STREAM_STATUS_START_ALREADY_EXISTS = 1,
  /**
   * 2: The media stream injection is unauthorized.
   */
  INJECT_STREAM_STATUS_START_UNAUTHORIZED = 2,
  /**
   * 3: Timeout occurs when injecting a media stream.
   */
  INJECT_STREAM_STATUS_START_TIMEDOUT = 3,
  /**
   * 4: The media stream injection fails.
   */
  INJECT_STREAM_STATUS_START_FAILED = 4,
  /**
   * 5: The media stream stops being injected successfully.
   */
  INJECT_STREAM_STATUS_STOP_SUCCESS = 5,
  /**
   * 6: The media stream injection that you want to stop is found.
   */
  INJECT_STREAM_STATUS_STOP_NOT_FOUND = 6,
  /**
   * 7: You are not authorized to stop the media stream injection.
   */
  INJECT_STREAM_STATUS_STOP_UNAUTHORIZED = 7,
  /**
   * 8: Timeout occurs when you stop injecting the media stream.
   */
  INJECT_STREAM_STATUS_STOP_TIMEDOUT = 8,
  /**
   * 9: Stopping injecting the media stream fails.
   */
  INJECT_STREAM_STATUS_STOP_FAILED = 9,
  /**
   * 10: The media stream is broken.
   */
  INJECT_STREAM_STATUS_BROKEN = 10,
};

enum RAW_AUDIO_FRAME_OP_MODE_TYPE {
  /** 0: Read-only mode: Users only read the
     agora::media::IAudioFrameObserver::AudioFrame data without modifying
     anything. For example, when users acquire data with the Agora SDK then push
     the RTMP streams. */
  RAW_AUDIO_FRAME_OP_MODE_READ_ONLY = 0,
  /** 1: Write-only mode: Users replace the AudioFrame data with their own data
     and pass them to the SDK for encoding. For example, when users acquire
     data. */
  RAW_AUDIO_FRAME_OP_MODE_WRITE_ONLY = 1,
  /** 2: Read and write mode: Users read the data from AudioFrame, modify it,
     and then play it. For example, when users have their own sound-effect
     processing module and do some voice pre-processing such as a voice change.
   */
  RAW_AUDIO_FRAME_OP_MODE_READ_WRITE = 2,
};

/**
 * The audio equalization band frequency.
 */
enum AUDIO_EQUALIZATION_BAND_FREQUENCY {
  /**
   * 0: 31 Hz.
   */
  AUDIO_EQUALIZATION_BAND_31 = 0,
  /**
   * 1: 62 Hz.
   */
  AUDIO_EQUALIZATION_BAND_62 = 1,
  /**
   * 2: 125 Hz.
   */
  AUDIO_EQUALIZATION_BAND_125 = 2,
  /**
   * 3: 250 Hz.
   */
  AUDIO_EQUALIZATION_BAND_250 = 3,
  /**
   * 4: 500 Hz.
   */
  AUDIO_EQUALIZATION_BAND_500 = 4,
  /**
   * 5: 1 KHz.
   */
  AUDIO_EQUALIZATION_BAND_1K = 5,
  /**
   * 6: 2 KHz.
   */
  AUDIO_EQUALIZATION_BAND_2K = 6,
  /**
   * 7: 4 KHz.
   */
  AUDIO_EQUALIZATION_BAND_4K = 7,
  /**
   * 8: 8 KHz.
   */
  AUDIO_EQUALIZATION_BAND_8K = 8,
  /**
   * 9: 16 KHz.
   */
  AUDIO_EQUALIZATION_BAND_16K = 9,
};

/**
 * The audio reverberation type.
 */
enum AUDIO_REVERB_TYPE {
  /**
   * 0: (-20 to 10 dB), the level of the dry signal.
   */
  AUDIO_REVERB_DRY_LEVEL = 0,
  /**
   * 1: (-20 to 10 dB), the level of the early reflection signal (wet signal).
   */
  AUDIO_REVERB_WET_LEVEL = 1,
  /**
   * 2: (0 to 100 dB), the room size of the reflection.
   */
  AUDIO_REVERB_ROOM_SIZE = 2,
  /**
   * 3: (0 to 200 ms), the length of the initial delay of the wet signal in ms.
   */
  AUDIO_REVERB_WET_DELAY = 3,
  /**
   * 4: (0 to 100), the strength of the late reverberation.
   */
  AUDIO_REVERB_STRENGTH = 4,
};

enum STREAM_FALLBACK_OPTIONS {
  /** 0: (Default) No fallback operation for the stream when the network
     condition is poor. The stream quality cannot be guaranteed. */

  STREAM_FALLBACK_OPTION_DISABLED = 0,
  /** 1: Under poor network conditions, the SDK will send or receive
     agora::rtc::REMOTE_VIDEO_STREAM_LOW. You can only set this option in
     RtcEngineParameters::setRemoteSubscribeFallbackOption. Nothing happens when
     you set this in RtcEngineParameters::setLocalPublishFallbackOption. */
  STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW = 1,
  /** 2: Under poor network conditions, the SDK may receive
     agora::rtc::REMOTE_VIDEO_STREAM_LOW first, but if the network still does
     not allow displaying the video, the SDK will send or receive audio only. */
  STREAM_FALLBACK_OPTION_AUDIO_ONLY = 2,
};

enum PRIORITY_TYPE {
  /** 50: High priority.
   */
  PRIORITY_HIGH = 50,
  /** 100: (Default) normal priority.
   */
  PRIORITY_NORMAL = 100,
};

/** Statistics of the local video stream.
 */
struct LocalVideoStats {
	/**
	* ID of the local user whose video is sent.
	*/
	uid_t uid;
	/** Bitrate (Kbps) sent in the reported interval, which does not include
	 * the bitrate of the retransmission video after packet loss.
	 */
	int sentBitrate;
	/** Frame rate (fps) sent in the reported interval, which does not include
	 * the frame rate of the retransmission video after packet loss.
	 */
	int sentFrameRate;
	/** The encoder output frame rate (fps) of the local video.
	 */
	int encoderOutputFrameRate;
	/** The render output frame rate (fps) of the local video.
	 */
	int rendererOutputFrameRate;
	/** The target bitrate (Kbps) of the current encoder. This value is estimated by the SDK based on the current network conditions.
	  */
	int targetBitrate;
	/** The target frame rate (fps) of the current encoder.
	  */
	int targetFrameRate;
	/** The encoding bitrate (Kbps), which does not include the bitrate of the
	 * re-transmission video after packet loss.
	 */
	int encodedBitrate;
	/** The width of the encoding frame (px).
	 */
	int encodedFrameWidth;
	/** The height of the encoding frame (px).
	 */
	int encodedFrameHeight;
	/** The value of the sent frames, represented by an aggregate value.
	 */
	int encodedFrameCount;
	/** The codec type of the local video:
	 * - VIDEO_CODEC_VP8 = 1: VP8.
	 * - VIDEO_CODEC_H264 = 2: (Default) H.264.
	 */
	VIDEO_CODEC_TYPE codecType;
};

/**
 * The statistics of the remote video stream.
 */
struct RemoteVideoStats {
   /**
   User ID of the remote user sending the video streams.
   */
	uid_t uid;
	/** **DEPRECATED** Time delay (ms).
    */
	int delay;
	/**
	 Width (pixels) of the video stream.
	 */
	int width;
	/**
   Height (pixels) of the video stream.
   */
	int height;
	/**
   Bitrate (Kbps) received since the last count.
   */
	int receivedBitrate;
	/** The decoder output frame rate (fps) of the remote video.
	 */
	int decoderOutputFrameRate;
	/** The render output frame rate (fps) of the remote video.
	 */
	int rendererOutputFrameRate;
	/** The video frame loss rate (%) of the remote video stream in the reported interval.
	 */
	int frameLossRate;
	/** Packet loss rate (%) of the remote video stream after using the anti-packet-loss method.
	 */
	int packetLossRate;
	REMOTE_VIDEO_STREAM_TYPE rxStreamType;
	/**
	 The total freeze time (ms) of the remote video stream after the remote user joins the channel.
	 In a video session where the frame rate is set to no less than 5 fps, video freeze occurs when
	 the time interval between two adjacent renderable video frames is more than 500 ms.
	 */
	int totalFrozenTime;
	/**
	 The total video freeze time as a percentage (%) of the total time when the video is available.
	 */
	int frozenRate;
};

struct VideoCompositingLayout {
  struct Region {
    /** User ID of the user whose video is to be displayed in the region.
     */
    uid_t uid;
    user_id_t userId;
    /** Horizontal position of the region on the screen.
     */
    double x;  // [0,1]
    /** Vertical position of the region on the screen.
     */
    double y;  // [0,1]
    /**
     Actual width of the region.
    */
    double width;  // [0,1]
    /** Actual height of the region. */
    double height;  // [0,1]
    /** 0 means the region is at the bottom, and 100 means the region is at the
     * top.
     */
    int zOrder;  // optional, [0, 100] //0 (default): bottom most, 100: top most

    /** 0 means the region is transparent, and 1 means the region is opaque. The
     * default value is 1.0.
     */
    double alpha;

    media::base::RENDER_MODE_TYPE
    renderMode;  // RENDER_MODE_HIDDEN: Crop, RENDER_MODE_FIT: Zoom to fit

    Region()
        : uid(0),
          userId(NULL),
          x(0),
          y(0),
          width(0),
          height(0),
          zOrder(0),
          alpha(1.0),
          renderMode(media::base::RENDER_MODE_HIDDEN) {}
  };

  /** Ignore this parameter. The width of the canvas is set by
   agora::rtc::IRtcEngine::configPublisher, and not by
   agora::rtc::VideoCompositingLayout::canvasWidth.
  */
  int canvasWidth;
  /** Ignore this parameter. The height of the canvas is set by
   agora::rtc::IRtcEngine::configPublisher, and not by
   agora::rtc::VideoCompositingLayout::canvasHeight.
  */
  int canvasHeight;
  /** Enter any of the 6-digit symbols defined in RGB.
   */
  const char* backgroundColor;  // e.g. "#C0C0C0" in RGB
  /** Region array. Each host in the channel can have a region to display the
   * video on the screen.
   */
  const Region* regions;
  /** Number of users in the channel.
   */
  int regionCount;
  /** User-defined data.
   */
  const char* appData;
  /** Length of the user-defined data.
   */
  int appDataLength;

  VideoCompositingLayout()
      : canvasWidth(0),
        canvasHeight(0),
        backgroundColor(NULL),
        regions(NULL),
        regionCount(0),
        appData(NULL),
        appDataLength(0) {}
};

/** The definition of InjectStreamConfig.
 */
struct InjectStreamConfig {
  /** Width of the stream to be added into the broadcast. The default value is
  0; same width as the original stream.
  */
  int width;
  /** Height of the stream to be added into the broadcast. The default value is
  0; same height as the original stream.
  */
  int height;
  /** Video GOP of the stream to be added into the broadcast. The default value
  is 30.
  */
  int videoGop;
  /** Video frame rate of the stream to be added into the broadcast. The
  default value is 15 fps.
  */
  int videoFramerate;
  /** Video bitrate of the stream to be added into the broadcast. The default
  value is 400 Kbps.
  */
  int videoBitrate;
  /** Audio-sampling rate of the stream to be added into the broadcast:
  #AUDIO_SAMPLE_RATE_TYPE. The default value is 48000.
  */
  AUDIO_SAMPLE_RATE_TYPE audioSampleRate;
  /** Audio bitrate of the stream to be added into the broadcast. The default
  value is 48.
  */
  int audioBitrate;
  /** Audio channels to be added into the broadcast. The default value is 1.
  */
  int audioChannels;

  // width / height default set to 0 means pull the stream with its original
  // resolution
  InjectStreamConfig()
      : width(0),
        height(0),
        videoGop(30),
        videoFramerate(15),
        videoBitrate(400),
        audioSampleRate(AUDIO_SAMPLE_RATE_48000),
        audioBitrate(48),
        audioChannels(1) {}
};

/** The video stream lifecycle of CDN Live.
 */
enum RTMP_STREAM_LIFE_CYCLE_TYPE {
  /** Bound to the channel lifecycle.
  */
  RTMP_STREAM_LIFE_CYCLE_BIND2CHANNEL = 1,
  /** Bound to the owner identity of the RTMP stream.
  */
  RTMP_STREAM_LIFE_CYCLE_BIND2OWNER = 2,
};

/** The definition of PublisherConfiguration.
*/
struct PublisherConfiguration {
  /** Width of the output data stream set for CDN Live. The default value is
  360.
  */
  int width;
  /** Height of the output data stream set for CDN Live. The default value is
  640.
  */
  int height;
  /** Frame rate of the output data stream set for CDN Live. The default value
  is 15 fps.
  */
  int framerate;
  /** Bitrate of the output data stream set for CDN Live. The default value is
  500 Kbps.
  */
  int bitrate;
  /** The default layout:
  - 0: Tile horizontally
  - 1: Layered windows
  - 2: Tile vertically
  */
  int defaultLayout;
  /** The video stream lifecycle of CDN Live: RTMP_STREAM_LIFE_CYCLE_TYPE
  */
  int lifecycle;
  /** Whether the current user is the owner of the RTMP stream:
  - True: Yes (default). The push-stream configuration takes effect.
  - False: No. The push-stream configuration will not work.
  */
  bool owner;
  /** Width of the stream to be injected. Set it as 0.
  */
  int injectStreamWidth;
  /** Height of the stream to be injected. Set it as 0.
  */
  int injectStreamHeight;
  /** URL address of the stream to be injected to the channel.
  */
  const char* injectStreamUrl;
  /** Push-stream URL address for the picture-in-picture layouts. The default
  value is NULL.
  */
  const char* publishUrl;
  /** Push-stream URL address of the original stream which does not require
  picture-blending. The default value is NULL.
  */
  const char* rawStreamUrl;
  /** Reserved field. The default value is NULL.
  */
  const char* extraInfo;

  PublisherConfiguration()
      : width(640),
        height(360),
        framerate(15),
        bitrate(500),
        defaultLayout(1),
        lifecycle(RTMP_STREAM_LIFE_CYCLE_BIND2CHANNEL),
        owner(true),
        injectStreamWidth(0),
        injectStreamHeight(0),
        injectStreamUrl(NULL),
        publishUrl(NULL),
        rawStreamUrl(NULL),
        extraInfo(NULL) {}
};

enum CAMERA_DIRECTION {
  /** The rear camera. */
  CAMERA_REAR = 0,
  /** The front camera. */
  CAMERA_FRONT = 1,
};

/** Camera capturer configuration.*/
struct CameraCapturerConfiguration {
  /** Camera direction settings (for Android/iOS only). See: #CAMERA_DIRECTION. */
  CAMERA_DIRECTION cameraDirection;
  /** For windows */
  char deviceId[MAX_DEVICE_ID_LENGTH];
  VideoFormat format;
};

struct ScreenCaptureConfiguration {
  bool isCaptureWindow; // true - capture window, false - capture display
  unsigned int displayId; // MacOS only
  Rectangle screenRect; //Windows only
  view_t windowId;
  ScreenCaptureParameters params;
  Rectangle regionRect;

  ScreenCaptureConfiguration() : isCaptureWindow(false) {}
};

/**
 * The channel media options.
 */
struct ChannelMediaOptions {
  /**
   * Determines whether to publish the video of the camera track.
   * - true: Publish the video track of the camera capturer.
   * - false: (Default) Do not publish the video track of the camera capturer.
   */
  base::Optional<bool> publishCameraTrack;
  /**
   * Determines whether to publish the video of the secondary camera track.
   * - true: Publish the video track of the secondary camera capturer.
   * - false: (Default) Do not publish the video track of the secondary camera capturer.
   */
  base::Optional<bool> publishSecondaryCameraTrack;
  /**
   * Determines whether to publish the recorded audio.
   * - true: Publish the recorded audio.
   * - false: (Default) Do not publish the recorded audio.
   */
  base::Optional<bool> publishAudioTrack;
  /**
   * Determines whether to publish the video of the screen track.
   * - true: Publish the video track of the screen capturer.
   * - false: (Default) Do not publish the video track of the screen capturer.
   */
  base::Optional<bool> publishScreenTrack;
  /**
   * Determines whether to publish the video of the secondary screen track.
   * - true: Publish the video track of the secondary screen capturer.
   * - false: (Default) Do not publish the video track of the secondary screen capturer.
   */
  base::Optional<bool> publishSecondaryScreenTrack;
  /**
   * Determines whether to publish the audio of the custom audio track.
   * - true: Publish the audio of the custom audio track.
   * - false: (Default) Do not publish the audio of the custom audio track.
   */
  base::Optional<bool> publishCustomAudioTrack;
  /**
   * Determines whether to publish the video of the custom video track.
   * - true: Publish the video of the custom video track.
   * - false: (Default) Do not publish the video of the custom video track.
   */
  base::Optional<bool> publishCustomVideoTrack;
  /**
   * Determines whether to publish the video of the encoded video track.
   * - true: Publish the video of the encoded video track.
   * - false: (default) Do not publish the video of the encoded video track.
   */
  base::Optional<bool> publishEncodedVideoTrack;
  /**
  * Determines whether to publish the audio track of media player source.
  * - true: Publish the audio track of media player source.
  * - false: (default) Do not publish the audio track of media player source.
  */
  base::Optional<bool> publishMediaPlayerAudioTrack;
  /**
  * Determines whether to publish the video track of media player source.
  * - true: Publish the video track of media player source.
  * - false: (default) Do not publish the video track of media player source.
  */
  base::Optional<bool> publishMediaPlayerVideoTrack;

  base::Optional<bool> publishTrancodedVideoTrack;
  /**
   * Determines whether to subscribe to all audio streams automatically. It can replace calling \ref IRtcEngine::setDefaultMuteAllRemoteAudioStreams
   * "setDefaultMuteAllRemoteAudioStreams" before joining a channel.
   * - true: Subscribe to all audio streams automatically.
   * - false: (Default) Do not subscribe to any audio stream automatically.
   */
  base::Optional<bool> autoSubscribeAudio;
  /**
   * Determines whether to subscribe to all video streams automatically. It can replace calling \ref IRtcEngine::setDefaultMuteAllRemoteVideoStreams
   * "setDefaultMuteAllRemoteVideoStreams" before joining a channel.
   * - true: Subscribe to all video streams automatically.
   * - false: (Default) do not subscribe to any video stream automatically.
   */
  base::Optional<bool> autoSubscribeVideo;
  /**
  * Determines which media player source should be published.
  * - DEFAULT_PLAYER_ID(0) is default.
  */
  base::Optional<int> publishMediaPlayerId;
  /**
   * Determines whether to enable audio recording or playout.
   * - true: It's used to publish audio and mix microphone, or subscribe audio and playout
   * - false: It's used to publish extenal audio frame only without mixing microphone, or no need audio device to playout audio either
   */
  base::Optional<bool> enableAudioRecordingOrPlayout;
  /**
   * The client role type: #CLIENT_ROLE_TYPE.
   */
  base::Optional<CLIENT_ROLE_TYPE> clientRoleType;
  /**
   * The default video stream type: #REMOTE_VIDEO_STREAM_TYPE.
   */
  base::Optional<REMOTE_VIDEO_STREAM_TYPE> defaultVideoStreamType;
  /**
   * The channel profile: #CHANNEL_PROFILE_TYPE.
   */
  base::Optional<CHANNEL_PROFILE_TYPE> channelProfile;

  ChannelMediaOptions() = default;
  ~ChannelMediaOptions() = default;

  void SetAll(const ChannelMediaOptions& change) {
#define SET_FROM(X) SetFrom(&X, change.X)

      SET_FROM(publishCameraTrack);
      SET_FROM(publishSecondaryCameraTrack);
      SET_FROM(publishAudioTrack);
      SET_FROM(publishScreenTrack);
      SET_FROM(publishSecondaryScreenTrack);
      SET_FROM(publishTrancodedVideoTrack);
      SET_FROM(publishCustomAudioTrack);
      SET_FROM(publishCustomVideoTrack);
      SET_FROM(publishEncodedVideoTrack);
      SET_FROM(publishMediaPlayerAudioTrack);
      SET_FROM(publishMediaPlayerVideoTrack);
      SET_FROM(autoSubscribeVideo);
      SET_FROM(publishMediaPlayerId);
      SET_FROM(enableAudioRecordingOrPlayout);
      SET_FROM(clientRoleType);
      SET_FROM(defaultVideoStreamType);
      SET_FROM(channelProfile);

#undef SET_FROM
  }

  bool operator==(const ChannelMediaOptions& o) const {
#define BEGIN_COMPARE() bool b = true
#define ADD_COMPARE(X) b = (b && (X == o.X))
#define END_COMPARE()

      BEGIN_COMPARE();
      ADD_COMPARE(publishCameraTrack);
      ADD_COMPARE(publishSecondaryCameraTrack);
      ADD_COMPARE(publishAudioTrack);
      ADD_COMPARE(publishScreenTrack);
      ADD_COMPARE(publishSecondaryScreenTrack);
      ADD_COMPARE(publishTrancodedVideoTrack);
      ADD_COMPARE(publishCustomAudioTrack);
      ADD_COMPARE(publishCustomVideoTrack);
      ADD_COMPARE(publishEncodedVideoTrack);
      ADD_COMPARE(publishMediaPlayerAudioTrack);
      ADD_COMPARE(publishMediaPlayerVideoTrack);
      ADD_COMPARE(autoSubscribeAudio);
      ADD_COMPARE(autoSubscribeVideo);
      ADD_COMPARE(publishMediaPlayerId);
      ADD_COMPARE(enableAudioRecordingOrPlayout);
      ADD_COMPARE(clientRoleType);
      ADD_COMPARE(defaultVideoStreamType);
      ADD_COMPARE(channelProfile);
      END_COMPARE();

#undef BEGIN_COMPARE
#undef ADD_COMPARE
#undef END_COMPARE
      return b;
  }

  ChannelMediaOptions& operator=(const ChannelMediaOptions& replace) {
    if (this != &replace) {
#define REPLACE_BY(X) ReplaceBy(&X, replace.X)

        REPLACE_BY(publishCameraTrack);
        REPLACE_BY(publishSecondaryCameraTrack);
        REPLACE_BY(publishAudioTrack);
        REPLACE_BY(publishScreenTrack);
        REPLACE_BY(publishSecondaryScreenTrack);
        REPLACE_BY(publishTrancodedVideoTrack);
        REPLACE_BY(publishCustomAudioTrack);
        REPLACE_BY(publishCustomVideoTrack);
        REPLACE_BY(publishEncodedVideoTrack);
        REPLACE_BY(publishMediaPlayerAudioTrack);
        REPLACE_BY(publishMediaPlayerVideoTrack);
        REPLACE_BY(autoSubscribeAudio);
        REPLACE_BY(autoSubscribeVideo);
        REPLACE_BY(publishMediaPlayerId);
        REPLACE_BY(enableAudioRecordingOrPlayout);
        REPLACE_BY(clientRoleType);
        REPLACE_BY(defaultVideoStreamType);
        REPLACE_BY(channelProfile);

#undef REPLACE_BY
    }
    return *this;
  }

  template <typename T>
  static void SetFrom(base::Optional<T>* s, const base::Optional<T>& o) {
    if (o) {
      *s = o;
    }
  }

  template <typename T>
  static void ReplaceBy(base::Optional<T>* s, const base::Optional<T>& o) {
    *s = o;
  }
};

/**
 * The leave channel options.
 */
struct LeaveChannelOptions {
  /**
   * Determines whether to stop playing and mixing the music file when leave channel.
   * - true: (Default) Stop playing and mixing the music file.
   * - false: Do not stop playing and mixing the music file.
   */
  bool stopAudioMixing;
  /**
   * Determines whether to stop microphone recording when leave channel.
   * - true: (Default) Stop microphone recording.
   * - false: Do not stop microphone recording.
  */
  bool stopMicrophoneRecording;

  LeaveChannelOptions() : stopAudioMixing(true), stopMicrophoneRecording(true) {}
};

/**
 * The IRtcEngineEventHandler class.
 *
 * The SDK uses this class to send callback event notifications to the app, and the app inherits
 * the methods in this class to retrieve these event notifications.
 *
 * All methods in this class have their default (empty)  implementations, and the app can inherit
 * only some of the required events instead of all. In the callback methods, the app should avoid
 * time-consuming tasks or calling blocking APIs, otherwise the SDK may not work properly.
 */
class IRtcEngineEventHandler {
 public:
  virtual ~IRtcEngineEventHandler() {}

  /**
   * Occurs when the local user successfully joins the specified channel.
   *
   * @param channel The channel name.
   * @param uid The user ID.
   * - If you specified a `uid` in the `joinChannel` method, the SDK returns the specified ID;
   * - If not, this callback returns an ID that is automatically assigned by the Agora server.
   * @param elapsed The time elapsed (ms) from the local user calling \ref IRtcEngine::joinChannel
   * "joinChannel" until this event occurs.
   */
  virtual void onJoinChannelSuccess(const char* channel, uid_t uid, int elapsed) {
    (void)channel;
    (void)uid;
    (void)elapsed;
  }

  /**
   * Occurs when the local user rejoins the channel after being disconnected due to
   * network problems.
   *
   * When the app loses connection with the server because of network
   * problems, the SDK automatically tries to reconnect to the server, and triggers this
   * callback method upon reconnection.
   *
   * @param channel The channel name.
   * @param uid The user ID.
   * @param elapsed The time elapsed (ms) from the local user calling
   * \ref IRtcEngine::joinChannel "joinChannel" until this event occurs.
   */
  virtual void onRejoinChannelSuccess(const char* channel, uid_t uid, int elapsed) {
    (void)channel;
    (void)uid;
    (void)elapsed;
  }

  /** A warning occurs during the SDK runtime.

  In most cases, the app can ignore the warnings reported by the SDK,
  because the SDK can fix the issues and resume running.

  @param warn The warning code.
  @param msg The detailed warning message: #WARN_CODE_TYPE.
  */
  virtual void onWarning(int warn, const char* msg) {
    (void)warn;
    (void)msg;
  }

  /** An error occurs during the SDK runtime.

  @param err The error code.
  @param msg The detailed error message: #ERROR_CODE_TYPE.
  */
  virtual void onError(int err, const char* msg) {
    (void)err;
    (void)msg;
  }

  /** Reports the statistics of the audio stream from each remote
  user/broadcaster.

  The SDK triggers this callback once every two seconds to report the audio
  quality of each remote user/host sending an audio stream. If a channel has
  multiple remote users/hosts sending audio streams, the SDK triggers this
  callback as many times.

  @param uid The user ID of the speaker.
  @param quality The audio quality of the user: #QUALITY_TYPE
  @param delay The time delay (ms) of the audio packet from the sender to the
  receiver.
  @param lost The audio packet loss rate (%) from the sender to the receiver.
  */
  virtual void onAudioQuality(uid_t uid, int quality, unsigned short delay,
                              unsigned short lost) {
    (void)uid;
    (void)quality;
    (void)delay;
    (void)lost;
  }

  /** Reports the result of the last-mile network probe result.
   * The SDK triggers this callback within 30 seconds after the app calls the 
   * \ref IRtcEngine::startLastmileProbeTest "startLastmileProbeTest" method.
   * @param result The uplink and downlink last-mile network probe test result: 
   * LastmileProbeResult.
   */
  virtual void onLastmileProbeResult(const LastmileProbeResult& result) {
      (void)result;
  }

  /**
   * Reports which users are speaking and the speaker‘s volume.
   *
   * This callback reports the IDs and volumes of the loudest speakers at the moment in the channel,
   * and whether the local user is speaking. Once enabled, this callback is triggered at the set interval,
   * regardless of whether a user speaks or not.
   *
   * The SDK triggers two independent `onAudioVolumeIndication` callbacks at one time, which separately
   * report the volume information of the local user and all the remote speakers. For more information,
   * see the detailed parameter descriptions.
   *
   * Calling the \ref IRtcEngine::muteLocalAudioStream "muteLocalAudioStream" method affects
   * the SDK's behavior.
   * - If the local user calls the `muteLocalAudioStream` method, the SDK stops triggering the local
   * user's callback.
   * - 20 seconds after a remote speaker calls the `muteLocalAudioStream` method, the remote speakers'
   * callback does not include information of this remote user; 20 seconds after all remote users call the
   * `muteLocalAudioStream` method, the SDK stops triggering the remote speakers' callback.
   *
   * @param speakers An array containing the user ID and volume information for each speaker: AudioVolumeInfo.
   * - In the local user's callback, this array contains the following members:
   *   - `uid` = 0,
   *   - `volume` = `totalVolume`, which reports the sum of the voice volume and audio-mixing volume of the
   * local user.
   * - In the remote users' callback, this array contains the following members:
   *   - `uid` of each remote speaker.
   *   - `volume`, which reports the sum of the voice volume and audio-mixing volume of each remote speaker.
   *
   *   An empty `speakers` array in the callback indicates that no remote user is speaking at the moment.
   * @param speakerNumber The total number of speakers. The value range is [0, 3].
   * - In the local user's callback, `speakerNumber` = `, regardless of whether the local user speaks or not.
   * - In the remote speakers' callback, the callback reports the IDs and volumes of the three loudest speakers
   * when there are more than three remote users in the channel, and `speakerNumber` = 3.
   * @param totalVolume The total volume after audio mixing. The value ranges between 0 (the lowest volume)
   * and 255 (the highest volume).
   * - In the local user's callback, `totalVolume` is the sum of the voice volume and audio-mixing volume
   * of the local user.
   * - In the remote users' callback, `totalVolume` is the sum of the voice volume and audio-mixing volume
   * of all the remote speakers.
   */
  virtual void onAudioVolumeIndication(const AudioVolumeInfo* speakers, unsigned int speakerNumber,
                                       int totalVolume) {
    (void)speakers;
    (void)speakerNumber;
    (void)totalVolume;
  }

  /**
   * Occurs when the local user successfully leaves the channel.
   *
   * When the user successfully leaves the channel after calling \ref IRtcEngine::leaveChannel "leaveChannel",
   * the SDK uses this callback to notify the app that the user has left the channel.
   *
   * This callback also reports information such as the call duration and the statistics of data received
   * or transmitted by the SDK.
   *
   * @param stats The statistics on the call: RtcStats.
   */
  virtual void onLeaveChannel(const RtcStats& stats) { (void)stats; }

  /**
   * Reports the statistics of the current call.
   *
   * This callback is triggered once every two seconds after the user joins the channel.
   *
   * @param stats The statistics of the current call: RtcStats.
   */
  virtual void onRtcStats(const RtcStats& stats) { (void)stats; }

  /** Occurs when the audio device state changes.

   This callback notifies the application that the system's audio device state
   is changed. For example, a headset is unplugged from the device.

   @param deviceId Pointer to the device ID.
   @param deviceType Device type: #MEDIA_DEVICE_TYPE.
   @param deviceState Device state: #MEDIA_DEVICE_STATE_TYPE.
   */
  virtual void onAudioDeviceStateChanged(const char* deviceId, int deviceType, int deviceState) {
    (void)deviceId;
    (void)deviceType;
    (void)deviceState;
  }
  
  /** Occurs when the audio mixing file playback finishes.
   @deprecated This method is deprecated, use onAudioMixingStateChanged instead.

   You can start an audio mixing file playback by calling the
   \ref IRtcEngine::startAudioMixing "startAudioMixing" method. The SDK
   triggers this callback when the audio mixing file playback finishes.
   */
  virtual void onAudioMixingFinished() {}

  virtual void onRemoteAudioMixingBegin() {}

  virtual void onRemoteAudioMixingEnd() {}

  virtual void onAudioEffectFinished(int soundId) {
    (void)soundId;
  }
  
  /** Occurs when the video device state changes.

   This callback notifies the application that the system's video device state
   is changed.

   @param deviceId Pointer to the device ID.
   @param deviceType Device type: #MEDIA_DEVICE_TYPE.
   @param deviceState Device state: #MEDIA_DEVICE_STATE_TYPE.
   */
  virtual void onVideoDeviceStateChanged(const char* deviceId, int deviceType, int deviceState) {
    (void)deviceId;
    (void)deviceType;
    (void)deviceState;
  }

  /**
   * Reports the network quality of each user.
   *
   * This callback is triggered once every two seconds after the user joins the channel.
   *
   * @param uid The user ID. If `uid` is 0, the SDK reports the local network quality.
   * @param txQuality The transmission quality of the user: #QUALITY_TYPE.
   * @param rxQuality The receiving quality of the user: #QUALITY_TYPE.
   */
  virtual void onNetworkQuality(uid_t uid, int txQuality, int rxQuality) {
    (void)uid;
    (void)txQuality;
    (void)rxQuality;
  }

  /**
   * Occurs when intra request from remote user is received.
   * 
   * This callback is triggered once remote user needs one Key frame.
   * 
   */
  virtual void onIntraRequestReceived() {}

  /**
   * Occurs when network info is updated.
   * 
   * This callback is used for notifying user to adjust the send pace based
   * on the target bitrate.
   * 
   * @param info The network info collections.
   */
  virtual void onBandwidthEstimationUpdated(const NetworkInfo& info) {
    (void)info;
  }

  /**
   * Reports the last-mile network quality of the local user.
   *
   * This callback is triggered once after
   * \ref IRtcEngine::startLastmileProbeTest "startLastmileProbeTest" is called.
   *
   * When the user is not in a channel and the last-mile network test is enabled
   * (by calling `startLastmileProbeTest`), this callback function is triggered
   * to update the app on the network connection quality of the local user.
   *
   * @param quality The network quality: #QUALITY_TYPE.
   */
  virtual void onLastmileQuality(int quality) {
    (void)quality;
  }
  
  /** Occurs when the first local video frame is displayed on the video window.
  @param width The width (pixels) of the video stream.
  @param height The height (pixels) of the video stream.
  @param elapsed The time elapsed (ms) from the local user calling
  \ref IRtcEngine::joinChannel "joinChannel" until this callback is triggered.
  */
  virtual void onFirstLocalVideoFrame(int width, int height, int elapsed) {
    (void)width;
    (void)height;
    (void)elapsed;
  }

  virtual void onVideoSourceFrameSizeChanged(VIDEO_SOURCE_TYPE sourceType, int width, int height) {
    (void)sourceType;
    (void)width;
    (void)height;
  }

  /** Occurs when the first remote video frame is received and decoded.

  This callback is triggered upon the SDK receiving and successfully decoding
  the first video frame from a remote video. The app can configure the
  user view settings in this callback.

  @param uid ID of the user whose video streams are received.
  @param width The width (pixels) of the video stream.
  @param height The height (pixels) of the video stream.
  @param elapsed The time elapsed (ms) from the local user calling
  \ref IRtcEngine::joinChannel "joinChannel" until this callback is triggered.
  */
  virtual void onFirstRemoteVideoDecoded(uid_t uid, int width, int height, int elapsed) {
    (void)uid;
    (void)width;
    (void)height;
    (void)elapsed;
  }

  virtual void onVideoSizeChanged(uid_t uid, int width, int height, int rotation) {
    (void)uid;
    (void)width;
    (void)height;
    (void)rotation;
  }
  
  /** Occurs when the local video stream state changes
   *
   * This callback indicates the state of the local video stream, including camera capturing and video encoding,
   * and allows you to troubleshoot issues when exceptions occur.
   *
   * @note For some device models, the SDK will not trigger this callback when the state of the local video changes
   * while the local video capturing device is in use, so you have to make your own timeout judgment.
   * @param state State type #LOCAL_VIDEO_STREAM_STATE. When the state is LOCAL_VIDEO_STREAM_STATE_FAILED (3), see the `error` parameter for details.
   * @param error The detailed error information: #LOCAL_VIDEO_STREAM_ERROR.
   */
  virtual void onLocalVideoStateChanged(LOCAL_VIDEO_STREAM_STATE state, LOCAL_VIDEO_STREAM_ERROR error) {
    (void)state;
    (void)error;
  }

  /**
   * Occurs when the remote video state has changed.
   *
   * @param uid ID of the user whose video state has changed.
   * @param state The remote video state: #REMOTE_VIDEO_STATE.
   * @param reason The reason of the remote video state change: #REMOTE_VIDEO_STATE_REASON.
   * @param elapsed The time elapsed (ms) from the local user calling ref IRtcEngine::joinChannel "joinChannel" until this callback is triggered.
   */
  virtual void onRemoteVideoStateChanged(uid_t uid, REMOTE_VIDEO_STATE state, REMOTE_VIDEO_STATE_REASON reason, int elapsed) {
    (void)uid;
    (void)state;
    (void)reason;
    (void)elapsed;
  }

  virtual void onFirstRemoteVideoFrame(uid_t uid, int width, int height, int elapsed) {
    (void)uid;
    (void)width;
    (void)height;
    (void)elapsed;
  }

  /**
   * Occurs when a remote user or broadcaster joins the channel.
   *
   * If other users are already in the channel, the SDK also reports to the app on the existing users.
   *
   * The SDK triggers this callback under one of the following circumstances:
   * - A remote user or broadcaster joins the channel by calling \ref IRtcEngine::joinChannel "joinChannel".
   * - A remote user switches the user role to broadcaster by calling \ref IRtcEngine::setClientRole "setClientRole"
   * after joining the channel.
   * - A remote user or broadcaster rejoins the channel after a network interruption.
   *
   * @note
   * When a Web app joins the channel, this callback is triggered as long as the app publishes a stream.
   *
   * @param uid ID of the remote user or broadcaster joining the channel.
   * @param elapsed The time elapsed (ms) from the local user calling `joinChannel` or `setClientRole`
   * until this callback is triggered.
  */
  virtual void onUserJoined(uid_t uid, int elapsed) {
    (void)uid;
    (void)elapsed;
  }

  /**
   * Occurs when a remote user or broadcaster goes offline.
   *
   * There are two reasons for a user to go offline:
   * - Leave the channel: When the user leaves the channel, the user sends a goodbye message. When this
   * message is received, the SDK determines that the user leaves the channel.
   * - Drop offline: When no data packet of the user is received for a certain period of time, the SDK assumes
   * that the user drops offline. A poor network connection may lead to false detection, so we recommend using
   * the RTM SDK for reliable offline detection.
   * - The user switches the user role from a broadcaster to an audience.
   *
   * @param uid ID of the remote user or broadcaster who leaves the channel or drops offline.
   * @param reason The reason why the remote user goes offline: #USER_OFFLINE_REASON_TYPE.
   */
  virtual void onUserOffline(uid_t uid, USER_OFFLINE_REASON_TYPE reason) {
    (void)uid;
    (void)reason;
  }

  /** Occurs when a remote user pauses or resumes sending the video stream.
  @deprecated Use onRemoteVideoStateChanged instead of.

  @note
  This callback is invalid when the number of users or broadacasters in a
  channel exceeds 20.

  @param uid ID of the remote user.
  @param muted

  - True: The remote user has paused sending the video stream.
  - False: The remote user has resumed sending the video stream.
  */
  virtual void onUserMuteVideo(uid_t uid, bool muted) {
    (void)uid;
    (void)muted;
  }

  /** Occurs when a remote user enables or disables the video module.

  Once the video function is disabled, the users cannot see any video.
  @deprecated Use onRemoteVideoStateChanged instead of.

  @note
  This callback is invalid when the number of users or broadcasters in a channel
  exceeds 20.

  @param uid ID of the remote user.
  @param enabled

  - True: The remote user has enabled the video module.
  - False: The remote user has disabled the video module.
  */
  virtual void onUserEnableVideo(uid_t uid, bool enabled) {
    (void)uid;
    (void)enabled;
  }

  /** Occurs when a remote user enables or disables the local video function.
  @deprecated Use onRemoteVideoStateChanged instead of.

  @param uid ID of the remote user.
  @param enabled

  - True: The remote user has enabled the local video function.
  - False: The remote user has disabled the local video function.
  */
  virtual void onUserEnableLocalVideo(uid_t uid, bool enabled) {
    (void)uid;
    (void)enabled;
  }

  /**
   * Occurs when an API method is executed.
   *
   * @param api The API method that the SDK executes.
   * @param err The error code that the SDK returns when the method call fails.
   * @param result The result of the method call.
   */
  virtual void onApiCallExecuted(int err, const char* api, const char* result) {
    (void)err;
    (void)api;
    (void)result;
  }

  /** Reports the statistics of the local audio stream.
   *
   * The SDK triggers this callback once every two seconds.
   *
   * @param stats The statistics of the local audio stream.
   * See LocalAudioStats.
   */
  virtual void onLocalAudioStats(const LocalAudioStats& stats) {
    (void)stats;
  }

  /** Reports the statistics of the audio stream from each remote user/host.

   This callback replaces the \ref IRtcEngineEventHandler::onAudioQuality "onAudioQuality" callback.

   The SDK triggers this callback once every two seconds for each remote
   user/host. If a channel includes multiple remote users, the SDK triggers
   this callback as many times.

   @param stats Statistics of the received remote audio streams. See RemoteAudioStats.
   */
  virtual void onRemoteAudioStats(const RemoteAudioStats& stats) {
    (void)stats;
  }

  /**
   * Reports the statistics of the local video.
   *
   * The SDK triggers this callback once every two seconds after the user joins the channel.
   *
   * @param stats The statistics of the uploading local video stream: LocalVideoStats.
   */
  virtual void onLocalVideoStats(const LocalVideoStats& stats) {
    (void)stats;
  }

  /** Reports the statistics of the remote video.
   *
   * The SDK triggers this callback once every two seconds for each remote user or broadcaster. If
   * there are multiple users or broadcasters in the channel, the SDK triggers this callback
   * as many times.
   * @param stats The statistics of the remote video streams: RemoteVideoStats.
   */
  virtual void onRemoteVideoStats(const RemoteVideoStats& stats) {
    (void)stats;
  }

  virtual void onCameraReady() {}

  virtual void onCameraFocusAreaChanged(int x, int y, int width, int height) {
    (void)x;
    (void)y;
    (void)width;
    (void)height;
  }

  virtual void onCameraExposureAreaChanged(int x, int y, int width, int height) {
    (void)x;
    (void)y;
    (void)width;
    (void)height;
  }

  virtual void onVideoStopped() {}

  /** Occurs when the state of the local user's audio mixing file changes.
   When you call the \ref IRtcEngine::startAudioMixing "startAudioMixing"
   method and the state of audio mixing file changes, the SDK triggers this
   callback.

   - When the audio mixing file plays, pauses playing, or stops playing, this
   callback returns 710, 711, or 713 in `state`, and 0 in `errorCode`.
   - When exceptions occur during playback, this callback returns 714 in
   `state` and an error in `errorCode`.
   - If the local audio mixing file does not exist, or if the SDK does not
   support the file format or cannot access the music file URL, the SDK
   returns #WARN_AUDIO_MIXING_OPEN_ERROR (701).

   @param state The state code. See #AUDIO_MIXING_STATE_TYPE.
   @param errorCode The error code. See #AUDIO_MIXING_ERROR_TYPE.
   */
  virtual void onAudioMixingStateChanged(AUDIO_MIXING_STATE_TYPE state, AUDIO_MIXING_ERROR_TYPE errorCode) {
    (void)state;
    (void)errorCode;
  }

  /**
   * Occurs when the SDK cannot reconnect to the server 10 seconds after its connection to the server is
   * interrupted.
   *
   * The SDK triggers this callback when it cannot connect to the server 10 seconds after calling
   * \ref IRtcEngine::joinChannel "joinChannel", regardless of whether it is in the channel or not.
   */
  virtual void onConnectionLost() {}

  /** Occurs when the connection between the SDK and the server is interrupted.

  The SDK triggers this callback when it loses connection with the serer for more
  than 4 seconds after the connection is established. After triggering this
  callback, the SDK tries to reconnect to the server. If the reconnection fails
  within a certain period (10 seconds by default), the onConnectionLost()
  callback is triggered.

  Once the connection is lost, the SDK continues to reconnect until the
  app calls \ref IRtcEngine::leaveChannel "leaveChannel".
  */
  virtual void onConnectionInterrupted() {}

  /** Occurs when your connection is banned by the Agora Server.
   */
  virtual void onConnectionBanned() {}

  virtual void onRefreshRecordingServiceStatus(int status) {
    (void)status;
  }

  /** Occurs when the local user receives the data stream from the peer user.

  The SDK triggers this callback when the local user receives the stream message
  that the remote user sends by calling the \ref IRtcEngine::sendStreamMessage
  "sendStreamMessage()" method.

  @param uid ID of the remote user that sends the data message.
  @param streamId The stream ID.
  @param data The data received by the local user.
  @param length The length of the data (bytes).
  */
  virtual void onStreamMessage(uid_t uid, int streamId, const char* data, size_t length) {
    (void)uid;
    (void)streamId;
    (void)data;
    (void)length;
  }

  /** Occurs when the local user fails to receive a remote data stream.

  The SDK triggers this callback when the local user fails to receive the stream
  message that the remote user sends by calling the \ref IRtcEngine::sendStreamMessage
  "sendStreamMessage()"
  method.

  @param uid ID of the remote user who sends the data stream.
  @param streamId The stream ID.
  @param code The error code: #ERROR_CODE_TYPE.
  @param missed The number of lost messages.
  @param cached The number of incoming cached messages when the data stream is
  interrupted.
  *
  */
  virtual void onStreamMessageError(uid_t uid, int streamId, int code, int missed, int cached) {
    (void)uid;
    (void)streamId;
    (void)code;
    (void)missed;
    (void)cached;
  }

  virtual void onMediaEngineLoadSuccess() {}
  virtual void onMediaEngineStartCallSuccess() {}

  /**
   * Occurs when the token has expired.
   *
   * If a token is specified when calling the \ref IRtcEngine::joinChannel "joinChannel" method,
   * the token expires after a certain period of time and you need a new token to reconnect to the server.
   *
   * Upon receiving this callback, generate a new token at your app server and call
   * \ref IRtcEngine::renewToken "renewToken" to pass the new token to the SDK.
   *
   * @sa [How to generate a token](https://docs.agora.io/en/Interactive%20Broadcast/token_server_cpp?platform=CPP).
   */
  virtual void onRequestToken() {}

  /**
   * Occurs when the token will expire in 30 seconds.
   *
   * If the token you specified when calling \ref IRtcEngine::joinChannel "joinChannel" expires,
   * the user will drop offline. This callback is triggered 30 seconds before the token expires, to
   * remind you to renew the token.

   * Upon receiving this callback, generate a new token at your app server and call
   * \ref IRtcEngine::renewToken "renewToken" to pass the new Token to the SDK.
   *
   * @sa [How to generate a token](https://docs.agora.io/en/Interactive%20Broadcast/token_server_cpp?platform=CPP).
   *
   * @param token The token that will expire in 30 seconds.
   */
  virtual void onTokenPrivilegeWillExpire(const char* token) {
    (void)token;
  }

  /** Occurs when the first local audio frame is published.

   @param elapsed The time elapsed (ms) from the local user calling
   \ref IRtcEngine::joinChannel "joinChannel" to the SDK triggers this callback.
  */
  virtual void onFirstLocalAudioFramePublished(int elapsed) {
    (void)elapsed;
  }

  /** Occurs when the local audio state changes.
   *
   * This callback indicates the state change of the local audio stream,
   * including the state of the audio recording and encoding, and allows
   * you to troubleshoot issues when exceptions occur.
   *
   * @note
   * When the state is #LOCAL_AUDIO_STREAM_STATE_FAILED (3), see the `error`
   * parameter for details.
   *
   * @param state State of the local audio. See #LOCAL_AUDIO_STREAM_STATE.
   * @param error The error information of the local audio.
   * See #LOCAL_AUDIO_STREAM_ERROR.
   */
  virtual void onLocalAudioStateChanged(LOCAL_AUDIO_STREAM_STATE state, LOCAL_AUDIO_STREAM_ERROR error) {
    (void)state;
    (void)error;
  }

  /** Occurs when the remote audio state changes.
   *
   * This callback indicates the state change of the remote audio stream.
   *
   * @param uid ID of the remote user whose audio state changes.
   * @param state State of the remote audio. See #REMOTE_AUDIO_STATE.
   * @param reason The reason of the remote audio state change.
   * See #REMOTE_AUDIO_STATE_REASON.
   * @param elapsed Time elapsed (ms) from the local user calling the
   * \ref IRtcEngine::joinChannel "joinChannel" method until the SDK
   * triggers this callback.
   */
  virtual void onRemoteAudioStateChanged(uid_t uid, REMOTE_AUDIO_STATE state, REMOTE_AUDIO_STATE_REASON reason, int elapsed) {
    (void)uid;
    (void)state;
    (void)reason;
    (void)elapsed;
  }

  /**
   * Occurs when an active speaker is detected.
   *
   * If you have called the \ref IRtcEngine::enableAudioVolumeIndication "enableAudioVolumeIndication()"
   * method, this callback is triggered when the volume detecting unit has detected an active speaker
   * in the channel. This callback also returns the `uid` of the active speaker.
   *
   * You can add relative functions on your app, for example, the active speaker, once detected,
   * will have the portrait zoomed in.
   *
   * @note
   * - You need to call \ref IRtcEngine::enableAudioVolumeIndication "enableAudioVolumeIndication()" to
   * receive this callback.
   * - The active speaker means the user ID of the speaker who speaks at the highest volume during a
   * certain period of time.
   *
   * @param uid The ID of the active speaker. A `uid` of 0 means the local user.
   */
  virtual void onActiveSpeaker(uid_t uid) { (void)uid; }

  /**
   * Occurs when the user role in a Live-Broadcast channel has switched, for example, from a broadcaster
   * to an audience or vice versa.
   *
   * @param oldRole The old role of the user: #CLIENT_ROLE_TYPE.
   * @param newRole The new role of the user: #CLIENT_ROLE_TYPE.
   */
  virtual void onClientRoleChanged(CLIENT_ROLE_TYPE oldRole, CLIENT_ROLE_TYPE newRole) {
    (void)oldRole;
    (void)newRole;
  }

  /** Occurs when the audio device volume changes.
   @param deviceType The device type, see #MEDIA_DEVICE_TYPE
   @param volume The volume of the audio device.
   @param muted Whether the audio device is muted:
   - true: The audio device is muted.
   - false: The audio device is not muted.
   */
  virtual void onAudioDeviceVolumeChanged(MEDIA_DEVICE_TYPE deviceType, int volume, bool muted) {
    (void)deviceType;
    (void)volume;
    (void)muted;
  }

  /**
   * Occurs when the state of the RTMP streaming changes.
   *
   * The SDK triggers this callback to report the result of the local user calling the \ref IRtcEngine::addPublishStreamUrl
   * "addPublishStreamUrl" or \ref IRtcEngine::removePublishStreamUrl "removePublishStreamUrl" method.
   *
   * This callback indicates the state of the RTMP streaming. When exceptions occur, you can
   * troubleshoot issues by referring to the detailed error descriptions in the `errCode` parameter.
   *
   * @param url The RTMP URL address.
   * @param state The RTMP streaming state. See: #RTMP_STREAM_PUBLISH_STATE.
   * @param errCode The detailed error information for streaming: #RTMP_STREAM_PUBLISH_ERROR.
   */
  virtual void onRtmpStreamingStateChanged(const char* url, RTMP_STREAM_PUBLISH_STATE state,
                                           RTMP_STREAM_PUBLISH_ERROR errCode) {
    (void)url;
    (void)state;
    (void)errCode;
  }

  /**
   * Reports the result of calling the \ref IRtcEngine::addPublishStreamUrl
   * "addPublishStreamUrl()" method.
   * @deprecated Use \ref onRtmpStreamingStateChanged "onRtmpStreamingStateChanged" instead.
   *
   * This callback indicates whether you have successfully added an RTMP stream to
   * the CDN.
   *
   * @param url The RTMP URL address.
   * @param error The error code. Main errors include:
   * - ERR_OK(0): The publishing succeeded.
   * - ERR_FAILED(1): The publishing failed.
   * - ERR_INVALID_ARGUMENT(2): Invalid argument used. If, for example, you have
   * not called \ref IRtcEngine::setLiveTranscoding "setLiveTranscoding" to
   * configure LiveTranscoding before calling \ref IRtcEngine::addPublishStreamUrl
   * "addPublishStreamUrl".
   * - ERR_TIMEOUT(10): The publishing timed out.
   * - ERR_ALREADY_IN_USE(19): The chosen HTTP/HTTPS URL address is already in use
   * for CDN live streaming.
   * - ERR_ENCRYPTED_STREAM_NOT_ALLOWED_PUBLISHED(130): You cannot publish an
   * encrypted stream.
   * - ERR_PUBLISH_STREAM_CDN_ERROR(151): CDN related errors. Remove the original
   * URL address and add a new one by calling the
   * \ref IRtcEngine::removePublishStreamUrl "removePublishStreamUrl()" and
   * \ref IRtcEngine::addPublishStreamUrl "addPublishStreamUrl()" methods.
   * - ERR_PUBLISH_STREAM_NUM_REACH_LIMIT(152): The host manipulates more than 10
   * URLs. Delete the unnecessary URLs before adding new ones.
   * - ERR_PUBLISH_STREAM_NOT_AUTHORIZED(153): The host manipulates other hosts'
   * URLs. Check your app logic.
   * - ERR_PUBLISH_STREAM_INTERNAL_SERVER_ERROR(154): An error occurs in Agora's
   * streaming server. Call the \ref IRtcEngine::addPublishStreamUrl
   * "addPublishStreamUrl()" method to publish the streaming again.
   * - ERR_PUBLISH_STREAM_FORMAT_NOT_SUPPORTED(156): The format of the RTMP stream
   * URL is not supported. Check whether the URL format is correct.
   */
  virtual void onStreamPublished(const char* url, int error) {
    (void)url;
    (void)error;
  }

  /**
   * Reports the result of calling the \ref IRtcEngine::removePublishStreamUrl "removePublishStreamUrl()"
   * method.
   *
   * @deprecated Use \ref onRtmpStreamingStateChanged "onRtmpStreamingStateChanged" instead.
   *
   * This callback indicates whether you have successfully removed an RTMP stream from the CDN.
   *
   * @param url The RTMP URL address.
   */
  virtual void onStreamUnpublished(const char* url) {
    (void)url;
  }

  /**
   * Occurs when the publisher's transcoding settings are updated.
   *
   * When the `LiveTranscoding` class in \ref IRtcEngine::setLiveTranscoding "setLiveTranscoding" 
   * updates, the SDK triggers this
   * callback to report the update information.
   *
   * @note
   * If you call the `setLiveTranscoding` method to set the `LiveTranscoding` class for the first time, the SDK
   * does not trigger this callback.
   */
  virtual void onTranscodingUpdated() {}

  /** Reports the status of injecting the online media stream.

  @param url The URL address of theinjected stream.
  @param uid The user ID.
  @param status Status of the injected stream: #INJECT_STREAM_STATUS.
  */
  virtual void onStreamInjectedStatus(const char* url, uid_t uid, int status) {
    (void)url;
    (void)uid;
    (void)status;
  }
  
  /** Occurs when the local audio route changes (for Android and iOS only).

   The SDK triggers this callback when the local audio route switches to an
   earpiece, speakerphone, headset, or Bluetooth device.
   @param routing Audio output routing:
   - -1: Default.
   - 0: Headset.
   - 1: Earpiece.
   - 2: Headset with no microphone.
   - 3: Speakerphone.
   - 4: Loudspeaker.
   - 5: Bluetooth headset.
   */
  virtual void onAudioRoutingChanged(int routing) {
    (void)routing;
  }

  /**
   * Occurs when the state of the media stream relay changes.
   *
   * The SDK reports the state of the current media relay and possible error messages in this
   * callback.
   *
   * @param state The state code:
   * - `RELAY_STATE_IDLE(0)`: The SDK is initializing.
   * - `RELAY_STATE_CONNECTING(1)`: The SDK tries to relay the media stream to the destination
   * channel.
   * - `RELAY_STATE_RUNNING(2)`: The SDK successfully relays the media stream to the destination
   * channel.
   * - `RELAY_STATE_FAILURE(3)`: A failure occurs. See the details in `code`.
   * @param code The error code:
   * - `RELAY_OK(0)`: The state is normal.
   * - `RELAY_ERROR_SERVER_ERROR_RESPONSE(1)`: An error occurs in the server response.
   * - `RELAY_ERROR_SERVER_NO_RESPONSE(2)`: No server response. You can call the leaveChannel method
   * to leave the channel.
   * - `RELAY_ERROR_NO_RESOURCE_AVAILABLE(3)`: The SDK fails to access the service, probably due to
   * limited resources of the server.
   * - `RELAY_ERROR_FAILED_JOIN_SRC(4)`: Fails to send the relay request.
   * - `RELAY_ERROR_FAILED_JOIN_DEST(5)`: Fails to accept the relay request.
   * - `RELAY_ERROR_FAILED_PACKET_RECEIVED_FROM_SRC(6)`: The server fails to receive the media
   * stream.
   * - `RELAY_ERROR_FAILED_PACKET_SENT_TO_DEST(7)`: The server fails to send the media stream.
   * - `RELAY_ERROR_SERVER_CONNECTION_LOST(8)`: The SDK disconnects from the server due to poor
   * network connections. You can call the leaveChannel method to leave the channel.
   * - `RELAY_ERROR_INTERNAL_ERROR(9)`: An internal error occurs in the server.
   * - `RELAY_ERROR_SRC_TOKEN_EXPIRED(10)`: The token of the source channel has expired.
   * - `RELAY_ERROR_DEST_TOKEN_EXPIRED(11)`: The token of the destination channel has expired.
   */
  virtual void onChannelMediaRelayStateChanged(int state, int code) {
    (void)state;
    (void)code;
  }

  /**
   * Reports events during the media stream relay.
   *
   * @param code The event code for media stream relay:
   * - `RELAY_EVENT_NETWORK_DISCONNECTED(0)`: The user disconnects from the server due to poor
   * network connections.
   * - `RELAY_EVENT_NETWORK_CONNECTED(1)`: The network reconnects.
   * - `RELAY_EVENT_PACKET_JOINED_SRC_CHANNEL(2)`: The user joins the source channel.
   * - `RELAY_EVENT_PACKET_JOINED_DEST_CHANNEL(3)`: The user joins the destination channel.
   * - `RELAY_EVENT_PACKET_SENT_TO_DEST_CHANNEL(4)`: The SDK starts relaying the media stream to the
   * destination channel.
   * - `RELAY_EVENT_PACKET_RECEIVED_VIDEO_FROM_SRC(5)`: The server receives the video stream from
   * the source channel.
   * - `RELAY_EVENT_PACKET_RECEIVED_AUDIO_FROM_SRC(6)`: The server receives the audio stream from
   * the source channel.
   * - `RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL(7)`: The destination channel is updated.
   * - `RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_REFUSED(8)`: The destination channel update fails due
   * to internal reasons.
   * - `RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_NOT_CHANGE(9)`: The destination channel does not
   * change, which means that the destination channel fails to be updated.
   * - `RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_IS_NULL(10)`: The destination channel name is NULL.
   * - `RELAY_EVENT_VIDEO_PROFILE_UPDATE(11)`: The video profile is sent to the server.
   */
  virtual void onChannelMediaRelayEvent(int code) {
    (void)code;
  }

  virtual void onLocalPublishFallbackToAudioOnly(bool isFallbackOrRecover) {
    (void)isFallbackOrRecover;
  }

  virtual void onRemoteSubscribeFallbackToAudioOnly(uid_t uid, bool isFallbackOrRecover) {
    (void)uid;
    (void)isFallbackOrRecover;
  }

  /** Reports the transport-layer statistics of each remote audio stream.

  This callback is triggered every two seconds once the user has received the
  audio data packet sent from a remote user.

  @param uid ID of the remote user whose audio data packet is received.
  @param delay The network time delay (ms) from the remote user sending the
  audio packet to the local user.
  @param lost The Packet loss rate (%) of the audio packet sent from the remote
  user.
  @param rxKBitRate Received bitrate (Kbps) of the audio packet sent from the
  remote user.
  */
  virtual void onRemoteAudioTransportStats(uid_t uid, unsigned short delay, unsigned short lost,
                                           unsigned short rxKBitRate) {
    (void)uid;
    (void)delay;
    (void)lost;
    (void)rxKBitRate;
  }

  /** Reports the transport-layer statistics of each remote video stream.

  This callback is triggered every two seconds once the user has received the
  video data packet sent from a remote user.

  @param uid ID of the remote user whose video packet is received.
  @param delay The network time delay (ms) from the remote user sending the
  video packet to the local user.
  @param lost The packet loss rate (%) of the video packet sent from the remote
  user.
  @param rxKBitRate The Received bitrate (Kbps) of the video packet sent from
  the remote user.
  */
  virtual void onRemoteVideoTransportStats(uid_t uid, unsigned short delay, unsigned short lost,
                                           unsigned short rxKBitRate) {
    (void)uid;
    (void)delay;
    (void)lost;
    (void)rxKBitRate;
  }

  /** Occurs when the connection state of the SDK to the server is changed.

  @param state See #CONNECTION_STATE_TYPE.
  @param reason See #CONNECTION_CHANGED_REASON_TYPE.
   */
  virtual void onConnectionStateChanged(
      CONNECTION_STATE_TYPE state, CONNECTION_CHANGED_REASON_TYPE reason) {
    (void)state;
    (void)reason;
  }

  /** Occurs when the network type is changed.

  @param type See #NETWORK_TYPE.
   */
  virtual void onNetworkTypeChanged(NETWORK_TYPE type) {
    (void)type;
  }
};

/**
 * The IVideoDeviceCollection class.
 */
class IVideoDeviceCollection {
 public:
  virtual ~IVideoDeviceCollection() = default;

  /**
   * Gets the total number of the indexed video capture devices in the system.
   *
   * @return The total number of the indexed video capture devices.
   */
  virtual int getCount() = 0;

  /**
   * Specifies a device with the device ID.
   *
   * @param deviceId The device ID.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setDevice(const char deviceIdUTF8[MAX_DEVICE_ID_LENGTH]) = 0;

  /**
   * Gets the information of a specified video capture device.
   *
   * @param index An input parameter that specifies the device. It is a specified
   * index and must be smaller than the return value of \ref getCount "getCount".
   * @param deviceName An output parameter that indicates the device name.
   * @param deviceId An output parameter that indicates the device ID.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getDevice(int index, char deviceNameUTF8[MAX_DEVICE_ID_LENGTH],
                        char deviceIdUTF8[MAX_DEVICE_ID_LENGTH]) = 0;

  /**
   * Releases all IVideoDeviceCollection resources.
   */
  virtual void release() = 0;
};

/**
 * The IVideoDeviceManager class.
 */
class IVideoDeviceManager {
 public:
  virtual ~IVideoDeviceManager() = default;
  /**
   * Enumerates the video capture devices.
   *
   * This method returns an IVideoDeviceCollection object that includes all the
   * video capture devices in the system. With the IVideoDeviceCollection object,
   * the app can enumerate the video capture devices. Ensure that you call the
   * \ref agora::rtc::IVideoDeviceCollection::release "IVideoDeviceCollection::release"
   * method to release the returned object after using it.
   *
   * @return
   * - A pointer to the IVideoDeviceCollection object that includes all the
   * video capture devices in the system, if the method call succeeds.
   * - The empty pointed NULL, if the method call fails.
  */
  virtual IVideoDeviceCollection* enumerateVideoDevices() = 0;

  /**
   * Specifies a device with the device ID.
   *
   * @param deviceId ID of the video capture device. You can call \ref enumerateVideoDevices "enumerateVideoDevices"
   * method to retrieve it. Plugging or unplugging the device does not change the device ID.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setDevice(const char deviceIdUTF8[MAX_DEVICE_ID_LENGTH]) = 0;

  /**
   * Gets the video capture device that is in use.
   * @param deviceId An output parameter that specifies the ID of the video capture device.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getDevice(char deviceIdUTF8[MAX_DEVICE_ID_LENGTH]) = 0;

  /**
   * Starts the video capture device test.
   *
   * This method tests whether the video capture device works properly.
   * Before calling this method, ensure that you have already called
   * \ref IRtcEngine::enableVideo "enableVideo", and the HWND window handle of
   * the incoming parameter is valid.
   *
   * @param hwnd An Output parameter that specifies the window handle to display the video.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int startDeviceTest(view_t hwnd) = 0;

  /**
   * Stops the video capture device test.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int stopDeviceTest() = 0;

  /**
   * Releases all IVideoDeviceManager resources.
   */
  virtual void release() = 0;
};

/**
 * The IAudioDeviceCollection class.
 */
class IAudioDeviceCollection {
 public:
  virtual ~IAudioDeviceCollection() = default;

  /**
   * Gets the total number of the playback or recording devices.
   *
   * Call \ref IAudioDeviceManager::enumeratePlaybackDevices "enumeratePlaybackDevices" first, and then
   * call this method to return the number of the audio playback devices.
   *
   * @return
   * - The number of the audio devices, if the method call succeeds.
   * - < 0, if the method call fails.
   */
  virtual int getCount() = 0;

  /**
   * Gets the information of a specified audio device.
   * @param index An input parameter that specifies the audio device.
   * @param deviceName An output parameter that indicates the device name.
   * @param deviceId An output parameter that indicates the device ID.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getDevice(int index, char deviceName[MAX_DEVICE_ID_LENGTH],
                        char deviceId[MAX_DEVICE_ID_LENGTH]) = 0;

  /**
   * Specifies a device with the device ID.
   * @param deviceId The device ID.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setDevice(const char deviceId[MAX_DEVICE_ID_LENGTH]) = 0;

  /**
   * Sets the volume of the app.
   *
   * @param volume The volume of the app. The value range is [0, 255].
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setApplicationVolume(int volume) = 0;

  /**
   * Gets the volume of the app.
   *
   * @param volume The volume of the app. The value range is [0, 255]
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getApplicationVolume(int& volume) = 0;

  /** Mutes or unmutes the app.
   *
   * @param mute Determines whether to mute the app:
   * - true: Mute the app.
   * - false: Unmute the app.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setApplicationMute(bool mute) = 0;

  /**
   * Gets the mute state of the app.
   *
   * @param mute A reference to the mute state of the app:
   * - true: The app is muted.
   * - false: The app is not muted.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int isApplicationMute(bool& mute) = 0;

  /**
   * Releases all IAudioDeviceCollection resources.
   */
  virtual void release() = 0;
};

/**
 * The IAudioDeviceManager class.
 */
class IAudioDeviceManager {
 public:
  virtual ~IAudioDeviceManager() {}

  /**
   * Enumerates the audio playback devices.
   *
   * This method returns an IAudioDeviceCollection object that includes all the
   * audio playback devices in the system. With the IAudioDeviceCollection object,
   * the app can enumerate the audio playback devices. The app must call the
   * \ref IAudioDeviceCollection::release "IAudioDeviceCollection::release" method to
   * release the returned object after using it.
   *
   * @return
   * - A pointer to the IAudioDeviceCollection object that includes all the audio
   * playback devices in the system, if the method call succeeds.
   * - The empty pointer NULL, if the method call fails.
   */
  virtual IAudioDeviceCollection* enumeratePlaybackDevices() = 0;

  /**
   * Enumerates the audio recording devices.
   *
   * This method returns an IAudioDeviceCollection object that includes all the
   * audio recording devices in the system. With the IAudioDeviceCollection object,
   * the app can enumerate the audio recording devices. The app needs to call the
   * \ref IAudioDeviceCollection::release "IAudioDeviceCollection::release" method to
   * release the returned object after using it.
   *
   * @return
   * - A pointer to the IAudioDeviceCollection object that includes all the audio recording devices
   * in the system, if the method call succeeds.
   * - The empty pointer NULL, if the method call fails.
   */
  virtual IAudioDeviceCollection* enumerateRecordingDevices() = 0;

  /**
   * Specifies an audio playback device with the device ID.
   *
   * @param deviceId ID of the audio playback device. It can be retrieved by the
   * \ref enumeratePlaybackDevices "enumeratePlaybackDevices" method. Plugging or unplugging the
   * audio device does not change the device ID.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setPlaybackDevice(const char deviceId[MAX_DEVICE_ID_LENGTH]) = 0;

  /**
   * Gets the ID of the audio playback device.
   * @param deviceId An output parameter that specifies the ID of the audio playback device.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getPlaybackDevice(char deviceId[MAX_DEVICE_ID_LENGTH]) = 0;

  /**
   * Gets the device ID and device name of the audio playback device.
   * @param deviceId An output parameter that specifies the ID of the audio playback device.
   * @param deviceName An output parameter that specifies the name of the audio playback device.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getPlaybackDeviceInfo(char deviceId[MAX_DEVICE_ID_LENGTH],
                                    char deviceName[MAX_DEVICE_ID_LENGTH]) = 0;

  /**
   * Sets the volume of the audio playback device.
   * @param volume The volume of the audio playing device. The value range is [0, 255].
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setPlaybackDeviceVolume(int volume) = 0;

  /**
   * Gets the volume of the audio playback device.
   * @param volume The volume of the audio playback device. The value range is [0, 255].
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getPlaybackDeviceVolume(int* volume) = 0;

  /**
   * Specifies an audio recording device with the device ID.
   *
   * @param deviceId ID of the audio recording device. It can be retrieved by
   * the \ref enumerateRecordingDevices "enumerateRecordingDevices" method. Plugging or unplugging the
   * audio device does not change the device ID.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setRecordingDevice(const char deviceId[MAX_DEVICE_ID_LENGTH]) = 0;

  /**
   * Gets the audio recording device by the device ID.
   *
   * @param deviceId ID of the audio recording device.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getRecordingDevice(char deviceId[MAX_DEVICE_ID_LENGTH]) = 0;

  /**
   * Gets the information of the audio recording device by the device ID and device name.
   *
   * @param deviceId ID of the audio recording device.
   * @param deviceName The name of the audio recording device.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getRecordingDeviceInfo(char deviceId[MAX_DEVICE_ID_LENGTH],
                                     char deviceName[MAX_DEVICE_ID_LENGTH]) = 0;

  /**
   * Sets the volume of the recording device.
   * @param volume The volume of the recording device. The value range is [0, 255].
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setRecordingDeviceVolume(int volume) = 0;

  /**
   * Gets the volume of the recording device.
   * @param volume The volume of the microphone, ranging from 0 to 255.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getRecordingDeviceVolume(int* volume) = 0;

  /**
   * Mutes or unmutes the audio playback device.
   *
   * @param mute Determines whether to mute the audio playback device.
   * - true: Mute the device.
   * - false: Unmute the device.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setPlaybackDeviceMute(bool mute) = 0;

  /**
   * Gets the mute state of the playback device.
   *
   * @param mute A pointer to the mute state of the playback device.
   * - true: The playback device is muted.
   * - false: The playback device is unmuted.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getPlaybackDeviceMute(bool* mute) = 0;

  /**
   * Mutes or unmutes the audio recording device.
   *
   * @param mute Determines whether to mute the recording device.
   * - true: Mute the microphone.
   * - false: Unmute the microphone.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setRecordingDeviceMute(bool mute) = 0;

  /**
   * Gets the mute state of the audio recording device.
   *
   * @param mute A pointer to the mute state of the recording device.
   * - true: The microphone is muted.
   * - false: The microphone is unmuted.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getRecordingDeviceMute(bool* mute) = 0;

  /**
   * Starts the audio playback device test.
   *
   * This method tests if the playback device works properly. In the test, the SDK
   * plays an audio file specified by the user. If the user hears the audio, the
   * playback device works properly.
   *
   * @param testAudioFilePath The file path of the audio file for the test, which
   * is an absolute path in UTF8:
   * - Supported file format: wav, mp3, m4a, and aac.
   * - Supported file sampling rate: 8000, 16000, 32000, 44100, and 48000.
   *
   * @return
   * - 0, if the method call succeeds and you can hear the sound of the specified audio file.
   * - An error code, if the method call fails.
   */
  virtual int startPlaybackDeviceTest(const char* testAudioFilePath) = 0;

  /**
   * Stops the audio playback device test.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int stopPlaybackDeviceTest() = 0;

  /**
   * Starts the recording device test.
   *
   * This method tests whether the recording device works properly. Once the test starts,
   * the SDK uses the \ref IRtcEngineEventHandler::onAudioVolumeIndication "onAudioVolumeIndication"
   * callback to notify the app on the volume information.
   *
   * @param indicationInterval The time interval (ms) between which the SDK triggers the
   * `onAudioVolumeIndication` callback.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int startRecordingDeviceTest(int indicationInterval) = 0;

  /**
   * Stops the recording device test.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int stopRecordingDeviceTest() = 0;

   /**
   * Starts the audio device loopback test.
   *
   * This method tests whether the local audio devices are working properly.
   * After calling this method, the microphone captures the local audio and
   * plays it through the speaker, and the \ref
   * IRtcEngineEventHandler::onAudioVolumeIndication "onAudioVolumeIndication"
   * callback returns the local audio volume information at the set interval.
   *
   * @note This method tests the local audio devices and does not report the
   * network conditions.
   * @param indicationInterval The time interval (ms) at which the \ref
   * IRtcEngineEventHandler::onAudioVolumeIndication "onAudioVolumeIndication"
   * callback returns.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int startAudioDeviceLoopbackTest(int indicationInterval) = 0;

  /**
   * Stops the audio device loopback test.
   *
   * @note Ensure that you call this method to stop the loopback test after
   * calling the \ref IAudioDeviceManager::startAudioDeviceLoopbackTest
   * "startAudioDeviceLoopbackTest" method.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int stopAudioDeviceLoopbackTest() = 0;

  /**
   * Releases all IAudioDeviceManager resources.
   */
  virtual void release() = 0;
};

/**
 * The definition of RTCEngineContext.
 */
class IRtcEngineEventHandlerEx;

struct RtcEngineContext {
  /**
   * The event handler for IRtcEngine.
   */
  IRtcEngineEventHandler* eventHandler;
  IRtcEngineEventHandlerEx* eventHandlerEx;

  /**
   * The App ID issued to the developers by Agora. Apply for a new one from Agora if it is missing from
   * your kit.
   */
  const char* appId;

  /**
   * - For Android, it is the context of Activity or Application.
   * - For Windows, it is the window handle of app. Once set, this parameter enables you to plug
   * or unplug the video devices while they are powered.
   */
  void* context;

  /**
   * Determines whether to subscribe to audio when joining a channel.
   * - true: (Default) Subscribe to the audio.
   * - false: Do not subscribe to the audio.
   *
   * Use this member to enable or disable the audio before joining the channel.
   */
  bool enableAudio;

  /**
   * Determines whether to subscribe to video when joining a channel.
   * - true: Subscribe to the video.
   * - false: (Default) Do not subscribe to the video.
   *
   * Use this member to enable or disable the video before joining the channel.
   */
  bool enableVideo;

  /**
   * Determines the default channel profile.
   *
   * Use this member to set default channel profile.
   */
  CHANNEL_PROFILE_TYPE channelProfile;

  /**
   * Determines the default audio scenario.
   *
   * Use this member to set default audio scenario.
   */
  AUDIO_SCENARIO_TYPE audioScenario;

  /**
   * Determines IP in which areas to be used
   * You can use one or a combination of the AREA_CODE
   * Default is use IP in all areas (AREA_CODE_GLOBAL)
   */
  unsigned int areaCode;

  /*
   * The log dir.
   */
  const char* logDir;

  RtcEngineContext()
      : eventHandler(NULL), eventHandlerEx(NULL), appId(NULL), context(NULL),
        enableAudio(true), enableVideo(false),
        channelProfile(CHANNEL_PROFILE_LIVE_BROADCASTING),
        audioScenario(AUDIO_SCENARIO_DEFAULT),
        areaCode(AREA_CODE_GLOBAL),
        logDir(NULL) {}
};

/** Definition of IMetadataObserver
*/
class IMetadataObserver {
public:
    /** Metadata type of the observer.
     @note We only support video metadata for now.
     */
    enum METADATA_TYPE
    {
        /** -1: the metadata type is unknown.
         */
        UNKNOWN_METADATA = -1,
        /** 0: the metadata type is video.
         */
        VIDEO_METADATA = 0,
    };
    /**
      * The maximum medata size.
      */
    enum MAX_METADATA_SIZE_TYPE
    {
        INVALID_METADATA_SIZE_IN_BYTE = -1,
        DEFAULT_METADATA_SIZE_IN_BYTE = 512,
        MAX_METADATA_SIZE_IN_BYTE = 1024
    };

    struct Metadata
    {
        /** The User ID.

         - For the receiver: the ID of the user who sent the metadata.
         - For the sender: ignore it.
         */
        unsigned int uid;
        /** Buffer size of the sent or received Metadata.
         */
        unsigned int size;
        /** Buffer address of the sent or received Metadata.
         */
        unsigned char *buffer;
        /** Time statmp of the frame following the metadata.
         */
        long long timeStampMs;
    };

    virtual ~IMetadataObserver() {}

    /** Occurs when the SDK requests the maximum size of the Metadata.

     The metadata includes the following parameters:
     - `uid`: ID of the user who sends the metadata.
     - `size`: The size of the sent or received metadata.
     - `buffer`: The sent or received metadata.
     - `timeStampMs`: The timestamp of the metadata.

     The SDK triggers this callback after you successfully call the \ref agora::rtc::IRtcEngine::registerMediaMetadataObserver "registerMediaMetadataObserver" method. You need to specify the maximum size of the metadata in the return value of this callback.

     @return The maximum size of the buffer of the metadata that you want to use. The highest value is 1024 bytes. Ensure that you set the return value.
     */
    virtual int getMaxMetadataSize() { return DEFAULT_METADATA_SIZE_IN_BYTE; }

    /** Occurs when the SDK requests the video source type of the Metadata.

     @return The video source that you want to attach metadata.
     */
    virtual VIDEO_SOURCE_TYPE getMetadataSourceType() { return VIDEO_SOURCE_CAMERA_PRIMARY; }

    /** Occurs when the SDK is ready to receive and send metadata.

     @note Ensure that the size of the metadata does not exceed the value set in the \ref agora::rtc::IMetadataObserver::getMaxMetadataSize "getMaxMetadataSize" callback.

     @param metadata The Metadata to be sent.
     @return
     - true:  Send.
     - false: Do not send.
     */
    virtual bool onReadyToSendMetadata(Metadata &metadata) = 0;

    /** Occurs when the local user receives the metadata.

     @param metadata The received Metadata.
     */
    virtual void onMetadataReceived(const Metadata &metadata) = 0;
};

class IMediaPlayerSource;

/**
 * The IRtcEngine class.
 *
 * This class provides the main methods that can be invoked by your app.
 *
 * IRtcEngine is the basic interface class of the Agora Native SDK.
 * Creating an IRtcEngine object and then calling the methods of
 * this object enables you to use Agora Native SDK's communication functionality.
 */
class IRtcEngine : public agora::base::IEngineBase {
 public:
  /**
   * Releases the IRtcEngine object.
   *
   * @param sync Determines whether this method is a synchronous call.
   * - true: This method is a synchronous call, which means that the result of this method call
   * returns after the IRtcEngine object resources are released. Do not call this method
   * in any callback generated by the SDK, or it may result in a deadlock. The SDK automatically
   * detects the deadlock and turns this method into an asynchronous call, but the test itself takes
   * extra time.
   * - false: This method is an asynchronous call. The result returns immediately even when the
   * IRtcEngine object resources are not released.
   *
   * @note
   * - Do not immediately uninstall the SDK's dynamic library after the call,
   * or it may crash because the SDK clean-up thread has not quit.
   * - Call this method in the sub-thread.
   * - Once the app destroys the created IRtcEngine instance, you cannot use any method or
   * callback in the SDK.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual void release(bool sync = false) = 0;

  /**
   * Initializes the Agora SDK service.
   *
   * In this method, you need to enter the issued Agora App ID to start initialization.
   * After creating an IRtcEngine object, call this method to initialize the service
   * before calling any other methods. After the initialization, the service is set to enable
   * audio by default.
   * @param context The RtcEngineContext object.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int initialize(const RtcEngineContext& context) = 0;

  virtual int queryInterface(INTERFACE_ID_TYPE iid, void** inter) = 0;

  /**
   * Gets the SDK version.
   * @param build The build number.
   * @return The version of the current SDK in the string format.
   */
  virtual const char* getVersion(int* build) = 0;

  /**
   * Gets the warning or error description.
   * @param code The warning or error code.
   * @return The detailed warning or error description.
   */
  virtual const char* getErrorDescription(int code) = 0;

  /**
   * Joins a channel.
   *
   * Users in the same channel can talk to each other; and multiple users in the same
   * channel can start a group chat. Note that users using different App IDs cannot call each
   * other.
   *
   * @note
   * - This method allows you to join only one channel at a time.
   * - A channel does not accept duplicate `uid`s, that is, two users with the same uid. If you set `uid`
   * as 0, the system automatically assigns a user ID.
   * - Ensure that the app ID you use to generate the token is the same app ID that you pass in the \ref initialize
   * "initialize" method.
   *
   * @param token The token for authentication.
   * - In situations not requiring high security: You can use the temporary token generated at Console.
   * For details, see [Get a temporary token](https://docs.agora.io/en/Agora%20Platform/token?platform=All%20Platforms#get-a-temporary-token).
   * - In situations requiring high security: Set it as the token generated at you server. For details,
   * see [Generate a token](https://docs.agora.io/en/Agora%20Platform/token?platform=All%20Platforms#get-a-token).
   *
   * @param channelId The unique channel name for the AgoraRTC session in the string format. The string
   * length must be less than 64 bytes. Supported character scopes are:
   * - All lowercase English letters: a to z.
   * - All uppercase English letters: A to Z.
   * - All numeric characters: 0 to 9.
   * - The space character.
   * - Punctuation characters and other symbols, including: "!", "#", "$", "%", "&", "(", ")", "+", "-",
   * ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
   * @param info (Optional) Additional information about the channel that you want
   * to add. It can be set as a NULL string or channel related information.
   * Other users in the channel will not receive this message.
   * @param uid (Optional) User ID: A 32-bit unsigned integer ranging from 1 to
   * (2^32-1). It must be unique. If not assigned (or set to 0), the SDK assigns one
   * and reports it in the \ref IRtcEngineEventHandler::onJoinChannelSuccess "onJoinChannelSuccess" callback.
   * Your app must record and maintain the returned value as the SDK does not maintain it.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int joinChannel(const char* token, const char* channelId, const char* info,
                          uid_t uid) = 0;

  /**
   * Joins a channel with media options.
   *
   * Users in the same channel can talk to each other; and multiple users in the same
   * channel can start a group chat. Note that users using different App IDs cannot call each
   * other.
   *
   * @note
   * - This method allows you to join only one channel at a time.
   * - A channel does not accept duplicate `uid`s, that is, two users with the same uid. If you set `uid`
   * as 0, the system automatically assigns a user ID.
   * - Ensure that the app ID you use to generate the token is the same app ID that you pass in the \ref initialize
   * "initialize" method.
   *
   * @param token The token for authentication.
   * - In situations not requiring high security: You can use the temporary token generated at Console.
   * For details, see [Get a temporary token](https://docs.agora.io/en/Agora%20Platform/token?platform=All%20Platforms#get-a-temporary-token).
   * - In situations requiring high security: Set it as the token generated at you server. For details,
   * see [Generate a token](https://docs.agora.io/en/Agora%20Platform/token?platform=All%20Platforms#get-a-token).
   *
   * @param channelId The unique channel name for the AgoraRTC session in the string format. The string
   * length must be less than 64 bytes. Supported character scopes are:
   * - All lowercase English letters: a to z.
   * - All uppercase English letters: A to Z.
   * - All numeric characters: 0 to 9.
   * - The space character.
   * - Punctuation characters and other symbols, including: "!", "#", "$", "%", "&", "(", ")", "+", "-",
   * ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
   * @param uid (Optional) User ID: A 32-bit unsigned integer ranging from 1 to
   * (2^32-1). It must be unique. If not assigned (or set to 0), the SDK assigns one
   * and reports it in the \ref IRtcEngineEventHandler::onJoinChannelSuccess "onJoinChannelSuccess" callback.
   * Your app must record and maintain the returned value as the SDK does not maintain it.
   * @param options The channel media options: ChannelMediaOptions.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int joinChannel(const char* token, const char* channelId, uid_t uid,
                          const ChannelMediaOptions& options) = 0;

  /**
   * Joins a channel with the connection ID.
   *
   * You can call this method multiple times to join more than one channels at a time.
   *
   * @note
   * - If you are already in a channel, you cannot rejoin it with the same uid.
   * - We recommend using different user IDs for different channels.
   * - If you want to join the same channel from different devices, ensure that the user IDs in all devices are different.
   * - Ensure that the app ID you use to generate the token is the same with the app ID used when creating the RtcEngine instance.
   * @param token The token generated at your server:
   * - In situations not requiring high security: You can use the temporary token generated at Console. For details, see [Get a temporary token](https://docs.agora.io/en/Agora%20Platform/token?platform=All%20Platforms#get-a-temporary-token).
   * - In situations requiring high security: Set it as the token generated at your server. For details, see [Generate a token](https://docs.agora.io/en/Interactive%20Broadcast/token_server_cpp?platform=CPP).
   * @param channelId The unique channel name for the AgoraRTC session in the string format. The string length must be less than 64 bytes. Supported character scopes are:
   * - All lowercase English letters: a to z.
   * - All uppercase English letters: A to Z.
   * - All numeric characters: 0 to 9.
   * - The space character.
   * - Punctuation characters and other symbols, including: "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
   * @param uid The user ID. A 32-bit unsigned integer with a value ranging from 1 to (2^32-1).
   * @param options The channel media options: ChannelMediaOptions.
   * @param eventHandler The pointer to the IRtcEngine event handler: IRtcEngineEventHandler.
   * @param connectionId[in,out] The connection ID to control different connection instances when
   * you join the same channel multiple times. 
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int joinChannelEx(const char* token, const char* channelId, uid_t uid,
                            const ChannelMediaOptions& options,
                            IRtcEngineEventHandler* eventHandler,
                            conn_id_t* connectionId) = 0;

  /**
   *  Updates the channel media options after joining the channel.
   *
   * @param options The channel media options: ChannelMediaOptions.
   * @param connectionId The ID of the current connection.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int updateChannelMediaOptions(const ChannelMediaOptions& options,
                                        conn_id_t connectionId = agora::rtc::DEFAULT_CONNECTION_ID) = 0;

  /**
   * Leaves the channel with the connection ID.
   *
   * @param channelId The channel name.
   * @param connectionId The connection ID.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int leaveChannelEx(const char* channelId, conn_id_t connectionId) = 0;

  /**
   * Leaves the channel.
   *
   * This method allows a user to leave the channel, for example, by hanging up or exiting a call.
   *
   * This method is an asynchronous call, which means that the result of this method returns even before
   * the user has not actually left the channel. Once the user successfully leaves the channel, the
   * SDK triggers the \ref IRtcEngineEventHandler::onLeaveChannel "onLeaveChannel" callback.
   *
   * @note
   * If you call \ref release "release" immediately after this method, the leaveChannel process will be
   * interrupted, and the SDK will not trigger the `onLeaveChannel` callback.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int leaveChannel() = 0;

  /**
   * Leaves the channel.
   *
   * @param options The leave channel options.
   *
   * This method allows a user to leave the channel, for example, by hanging up or exiting a call.
   *
   * This method is an asynchronous call, which means that the result of this method returns even before
   * the user has not actually left the channel. Once the user successfully leaves the channel, the
   * SDK triggers the \ref IRtcEngineEventHandler::onLeaveChannel "onLeaveChannel" callback.
   *
   * @note
   * If you call \ref release "release" immediately after this method, the leaveChannel process will be
   * interrupted, and the SDK will not trigger the `onLeaveChannel` callback.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int leaveChannel(const LeaveChannelOptions& options) = 0;

  /**
   * Renews the token.
   *
   * Once a token is enabled and used, it expires after a certain period of time.
   *
   * Under the following circumstances, generate a new token on your server, and then call this method to
   * renew it. Failure to do so results in the SDK disconnecting from the server.
   * - The \ref IRtcEngineEventHandler onTokenPrivilegeWillExpire "onTokenPrivilegeWillExpire" callback is triggered;
   * - The \ref IRtcEngineEventHandler::onRequestToken "onRequestToken" callback is triggered;
   * - The `ERR_TOKEN_EXPIRED(-109)` error is reported.
   *
   * @param token The new token.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int renewToken(const char* token) = 0;

  /**
   * Sets the channel profile.
   *
   * The IRtcEngine differentiates channel profiles and applies different optimization algorithms accordingly.
   * For example, it prioritizes smoothness and low latency for a video call, and prioritizes video quality
   * for a video broadcast.
   *
   * @note
   * - To ensure the quality of real-time communication, we recommend that all users in a channel use the
   * same channel profile.
   * - Call this method before calling \ref joinChannel "joinChannel". You cannot set the channel profile
   * once you have joined the channel.
   *
   * @param profile The channel profile: #CHANNEL_PROFILE_TYPE.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setChannelProfile(CHANNEL_PROFILE_TYPE profile) = 0;

  /**
   * Sets the role of a user.
   *
   * This method sets the user role as either BROADCASTER or AUDIENCE (default).
   * - The broadcaster sends and receives streams.
   * - The audience receives streams only.
   *
   * By default, all users are audience regardless of the channel profile.
   * Call this method to change the user role to BROADCASTER so that the user can
   * send a stream.
   *
   * @param role The role of the client: #CLIENT_ROLE_TYPE.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setClientRole(CLIENT_ROLE_TYPE role) = 0;

  /** Starts an audio call test.

  This method launches an audio call test to determine whether the audio devices
  (for example, headset and speaker) and the network connection are working
  properly.

  In the test, the user first speaks, and the recording is played back
  in 10 seconds. If the user can hear the recording in 10 seconds, it indicates
  that the audio devices and network connection work properly.

  @note
  After calling the startEchoTest() method, always call stopEchoTest() to end
  the test. Otherwise, the app cannot run the next echo test, nor can
  it call the joinChannel() method.

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int startEchoTest() = 0;

  /** Stops the audio call test.
  @return

  - 0: Success.
  - < 0: Failure.
  */
  virtual int stopEchoTest() = 0;

  /**
   * Enables the video.
   *
   * You can call this method either before joining a channel or during a call.
   * If you call this method before entering a channel, the service starts the video; if you call it
   * during a call, the audio call switches to a video call.
   *
   * @note
   * This method controls the underlying states of the Engine. It is still
   * valid after one leaves the channel.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int enableVideo() = 0;

  /**
   * Disables the video.
   *
   * This method stops capturing the local video and receiving any remote video.
   * To enable the local preview function, call \ref enableLocalVideo "enableLocalVideo" (true).
   * @return
   *
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int disableVideo() = 0;

  /**
   * Starts the local video preview before joining a channel.
   *
   * Once you call this method to start the local video preview, if you leave
   * the channel by calling \ref leaveChannel "leaveChannel", the local video preview remains until
   * you call \ref stopPreview "stopPreview" to disable it.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int startPreview() = 0;

  /**
   * Stops the local video preview and the video.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int stopPreview() = 0;

  /** Starts the last-mile network probe test.

  This method starts the last-mile network probe test before joining a channel 
  to get the uplink and downlink last-mile network statistics, including the 
  bandwidth, packet loss, jitter, and round-trip time (RTT).

  Call this method to check the uplink network quality before users join a 
  channel or before an audience switches to a host. Once this method is 
  enabled, the SDK returns the following callbacks:
  - \ref IRtcEngineEventHandler::onLastmileQuality "onLastmileQuality": the 
  SDK triggers this callback depending on the network 
  conditions. This callback rates the network conditions and is more closely 
  linked to the user experience.
  - \ref IRtcEngineEventHandler::onLastmileProbeResult "onLastmileProbeResult": 
  the SDK triggers this callback within 30 seconds depending on the network 
  conditions. This callback returns the real-time statistics of the network 
  conditions and is more objective.

  @note
  - Do not call other methods before receiving the 
  \ref IRtcEngineEventHandler::onLastmileQuality "onLastmileQuality" and 
  \ref IRtcEngineEventHandler::onLastmileProbeResult "onLastmileProbeResult"
  callbacks. Otherwise, the callbacks may be interrupted.
  - In the Live-broadcast profile, a host should not call this method after 
  joining a channel.

  @param config Sets the configurations of the last-mile network probe test. See
  LastmileProbeConfig.

   @return
   - 0: Success.
   - < 0: Failure.
   */
  virtual int startLastmileProbeTest(const LastmileProbeConfig& config) = 0;

  /** Stops the last-mile network probe test. */
  virtual int stopLastmileProbeTest() = 0;

  /**
   * Sets the video encoder configuration.
   *
   * Each configuration profile corresponds to a set of video parameters, including
   * the resolution, frame rate, and bitrate.
   *
   * The parameters specified in this method are the maximum values under ideal network conditions.
   * If the video engine cannot render the video using the specified parameters due
   * to poor network conditions, the parameters further down the list are considered
   * until a successful configuration is found.
   *
   * @param config The local video encoder configuration: VideoEncoderConfiguration.
   * @param connectionId ID of the connection.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setVideoEncoderConfiguration(const VideoEncoderConfiguration& config,
                               conn_id_t connectionId = DEFAULT_CONNECTION_ID) = 0;

  /**
   * Initializes the video view of a remote user.
   *
   * This method initializes the video view of a remote stream on the local device. It affects only the
   * video view that the local user sees.
   *
   * Usually the app should specify the `uid` of the remote video in the method call before the
   * remote user joins the channel. If the remote `uid` is unknown to the app, set it later when the
   * app receives the \ref IRtcEngineEventHandler::onUserJoined "onUserJoined" callback.
   *
   * To unbind the remote user from the view, set `view` in VideoCanvas as `null`.
   *
   * @note
   * Ensure that you call this method in the UI thread.
   *
   * @param canvas The remote video view settings: VideoCanvas.
   * @param connectionId ID of the current connection.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setupRemoteVideo(const VideoCanvas& canvas,
                               conn_id_t connectionId = DEFAULT_CONNECTION_ID) = 0;

  /**
   * Initializes the local video view.
   *
   * This method initializes the video view of the local stream on the local device. It affects only
   * the video view that the local user sees, not the published local video stream.
   *
   * To unbind the local video from the view, set `view` in VideoCanvas as `null`.
   *
   * @note
   * Call this method before joining a channel.
   *
   * @param canvas The local video view setting: VideoCanvas.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setupLocalVideo(const VideoCanvas& canvas) = 0;

  /**
   * Enables the audio.
   *
   * The audio is enabled by default.
   *
   * @note
   * This method controls the underlying states of the Engine. It is still
   * valid after one leaves channel.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int enableAudio() = 0;

  /**
   * Disables the audio.
   *
   * @note
   * This method controls the underlying states of the Engine. It is still
   * valid after one leaves channel.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int disableAudio() = 0;

  /**
   * Sets the audio parameters and application scenarios.
   * @deprecated From v2.7.1_fury. Scenario is set in initialize(const RtcEngineContext& context),
   * Setting audio profile using setAudioProfile(int profile).
   *
   * @note
   * - Call this method before calling the \ref joinChannel "joinChannel" method.
   * - In scenarios requiring high-quality audio, we recommend setting `profile` as `MUSIC_HIGH_QUALITY`(4)
   * and `scenario` as `AUDIO_SCENARIO_GAME_STREAMING`(3).
   *
   * @param profile Sets the sample rate, bitrate, encoding mode, and the number of channels:
   * #AUDIO_PROFILE_TYPE.
   * @param scenario Sets the audio application scenarios: #AUDIO_SCENARIO_TYPE.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setAudioProfile(AUDIO_PROFILE_TYPE profile, AUDIO_SCENARIO_TYPE scenario) = 0;

  /**
   * Sets the audio parameters.
   *
   * @note
   * - Call this method before calling the \ref joinChannel "joinChannel" method.
   * - In scenarios requiring high-quality audio, we recommend setting `profile` as `MUSIC_HIGH_QUALITY`(4).
   *
   * @param profile Sets the sample rate, bitrate, encoding mode, and the number of channels:
   * #AUDIO_PROFILE_TYPE.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setAudioProfile(AUDIO_PROFILE_TYPE profile) = 0;

  /**
   * Enables or disables the local audio capture.
   *
   * The audio function is enabled by default. This method disables or re-enables the
   * local audio function, that is, to stop or restart local audio capture and
   * processing.
   *
   * This method does not affect receiving or playing the remote audio streams,
   * and `enableLocalAudio` (false) is applicable to scenarios where the user wants
   * to receive remote audio streams without sending any audio stream to other users
   * in the channel.
   *
   * @param enabled Determines whether to disable or re-enable the local audio function:
   * - true: (Default) Re-enable the local audio function, that is, to start local
   * audio capture and processing.
   * - false: Disable the local audio function, that is, to stop local audio
   * capture and processing.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int enableLocalAudio(bool enabled) = 0;

  /**
   Stops or resumes sending the local audio stream.
   
   After calling this method successfully, the SDK triggers the 
   \ref IRtcEngineEventHandler::onRemoteAudioStateChanged "onRemoteAudioStateChanged"
   callback with the following parameters:
   - REMOTE_AUDIO_STATE_STOPPED(0) and REMOTE_AUDIO_REASON_REMOTE_MUTED(5).
   - REMOTE_AUDIO_STATE_DECODING(2) and REMOTE_AUDIO_REASON_REMOTE_UNMUTED(6).

   @note 
   - When `mute` is set as `true`, this method does not disable the 
   microphone, which does not affect any ongoing recording.
   - If you call \ref IRtcEngine::setChannelProfile "setChannelProfile" after 
   this method, the SDK resets whether or not to mute the local audio 
   according to the channel profile and user role. Therefore, we recommend 
   calling this method after the `setChannelProfile` method.
   
   @param mute Determines whether to send or stop sending the local audio stream:
   - true: Stop sending the local audio stream.
   - false: (Default) Send the local audio stream.
   
   @return
   - 0: Success.
   - < 0: Failure.
   */
  virtual int muteLocalAudioStream(bool mute) = 0;

  /**
   Stops or resumes receiving all remote audio stream.
   
   This method works for all remote users that join or will join a channel 
   using the \ref IRtcEngine::joinChannel "joinChannel" method. It is 
   equivalent to the `autoSubscribeAudio` member in the ChannelMediaOptions 
   class. You can call this method before, during, or after a call. 
   - If you call muteAllRemoteAudioStreams(true) before joining a channel, the 
   local user does not receive any audio stream after joining the channel.
   - If you call muteAllRemoteAudioStreams(true) after joining a channel, the 
   local use stops receiving any audio stream from any user in the channel, 
   including any user who joins the channel after you call this method.
   - If you call muteAllRemoteAudioStreams(true) after leaving a channel, the 
   local user does not receive any audio stream the next time the user joins a 
   channel. 

   After you successfully call muteAllRemoteAudioStreams(true), you can take 
   the following actions:
   - To resume receiving all remote audio streams, call 
   muteAllRemoteAudioStreams(false).
   - To resume receiving the audio stream of a specified user, call 
   muteRemoteAudioStream(uid, false), where uid is the ID of the user whose 
   audio stream you want to resume receiving.

   @note 
   - The result of calling this method is affected by calling 
   \ref IRtcEngine::enableAudio "enableAudio" and 
   \ref IRtcEngine::disableAudio "disableAudio". Settings in 
   muteAllRemoteAudioStreams stop taking effect if either of the following occurs:
     - Calling `enableAudio` after muteAllRemoteAudioStreams(true).
     - Calling `disableAudio` after muteAllRemoteAudioStreams(false).
   - This method only works for the channel created by calling 
   \ref IRtcEngine::joinChannel "joinChannel". To set whether to receive remote 
   audio streams for a specific channel, Agora recommends using 
   `autoSubscribeAudio` in the ChannelMediaOptions class.
   @param mute Whether to stop receiving remote audio streams:
   - true: Stop receiving any remote audio stream.
   - false: (Default) Resume receiving all remote audio streams.
   @return
   - 0: Success.
   - < 0: Failure.
   */
  virtual int muteAllRemoteAudioStreams(bool mute) = 0;

  /**
   * Determines whether to receive all remote audio streams by default.
   *
   * @deprecated This method is deprecated. To set whether to receive remote 
   * audio streams by default, call 
   * \ref IRtcEngine::muteAllRemoteAudioStreams "muteAllRemoteAudioStreams" 
   * before calling \ref IRtcEngine::joinChannel "joinChannel"
   *
   * Use this method to set whether to receive audio streams of subsequent peer 
   * users. Agora recommends calling it before joining a channel. 
   *
   * A successful call of setDefaultMuteAllRemoteAudioStreams(true) results in 
   * that the local user not receiving any audio stream after joining a channel.
   * @param mute Whether to receive remote audio streams by default:
   * - true: Do not receive any remote audio stream by default.
   * - false: (Default) Receive remote audio streams by default.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setDefaultMuteAllRemoteAudioStreams(bool mute) = 0;

  /**
   * Stops or resumes receiving the audio stream of a specified user.
   *
   * @note
   * You can call this method before or after joining a channel. If a user 
   * leaves a channel, the settings in this method become invalid.
   *
   * @param uid The ID of the specified user.
   * @param mute Whether to stop receiving the audio stream of the specified user:
   * - true: Stop receiving the audio stream of the specified user.
   * - false: (Default) Resume receiving the audio stream of the specified user.
   * @param connectionId The connection ID.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int muteRemoteAudioStream(uid_t uid, bool mute,
                                    conn_id_t connectionId = DEFAULT_CONNECTION_ID) = 0;

  /**
   * Stops or resumes sending the local video stream.
   *
   * @param mute Determines whether to send or stop sending the local video stream:
   * - true: Stop sending the local video stream.
   * - false: (Default) Send the local video stream.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int muteLocalVideoStream(bool mute) = 0;

  /**
   * Disables or re-enables the local video capture.
   *
   * Once you enable the video using \ref enableVideo "enableVideo", the local video is enabled
   * by default. This method disables or re-enables the local video capture.
   *
   * `enableLocalVideo(false)` applies to scenarios when the user wants to watch the remote video
   * without sending any video stream to the other user.
   *
   * @note
   * Call this method after `enableVideo`. Otherwise, this method may not work properly.
   *
   * @param enabled Determines whether to disable or re-enable the local video, including
   * the capturer, renderer, and sender:
   * - true:  (Default) Re-enable the local video.
   * - false: Disable the local video. Once the local video is disabled, the remote
   * users can no longer receive the video stream of this user, while this user
   * can still receive the video streams of other remote users. When you set
   * `enabled` as `false`, this method does not require a local camera.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int enableLocalVideo(bool enabled) = 0;

  /** Stops or resumes receiving all remote video streams.
   
   This method works for all remote users that join or will join a channel 
   using the \ref IRtcEngine::joinChannel "joinChannel" method. It is 
   equivalent to the `autoSubscribeVideo` member in the ChannelMediaOptions 
   class. You can call this method before, during, or after a call. 
   - If you call muteAllRemoteVideoStreams(true) before joining a channel, the 
   local user does not receive any video stream after joining the channel.
   - If you call muteAllRemoteVideoStreams(true) after joining a channel, the 
   local use stops receiving any video stream from any user in the channel, 
   including any user who joins the channel after you call this method.
   - If you call muteAllRemoteVideoStreams(true) after leaving a channel, 
   the local user does not receive any video stream the next time the user 
   joins a channel.

   After you successfully call muteAllRemoteVideoStreams(true), you can take 
   the following actions:
   - To resume receiving all remote video streams, call 
   muteAllRemoteVideoStreams(false).
   - To resume receiving the video stream of a specified user, call 
   muteRemoteVideoStream(uid, false), where uid is the ID of the user whose 
   video stream you want to resume receiving.

   @note
   - The result of calling this method is affected by calling 
   \ref IRtcEngine::enableVideo "enableVideo" and 
   \ref IRtcEngine::disableVideo "disableVideo". Settings in 
   muteAllRemoteVideoStreams stop taking effect if either of the following occurs:
     - Calling `enableVideo` after muteAllRemoteVideoStreams(true).
     - Calling `disableVideo` after muteAllRemoteVideoStreams(false).
   - This method only works for the channel created by calling `joinChannel`. 
   To set whether to receive remote audio streams for a specific channel, Agora 
   recommends using `autoSubscribeVideo` in the ChannelMediaOptions class.
   @param mute Whether to stop receiving remote video streams:
   - true: Stop receiving any remote video stream.
   - false: (Default) Resume receiving all remote video streams.
   @return
   - 0: Success.
   - < 0: Failure.
   */
  virtual int muteAllRemoteVideoStreams(bool mute) = 0;

  /**
   Determines whether to receive all remote video streams by default.
   
   @deprecated This method is deprecated. To set whether to receive remote 
   video streams by default, call 
   \ref IRtcEngine::muteAllRemoteVideoStreams "muteAllRemoteVideoStreams" 
   before calling \ref IRtcEngine::joinChannel "joinChannel".
   
   Use this method to set whether to receive video streams of subsequent peer 
   users. Agora recommends calling it before joining a channel.

   A successful call of setDefaultMuteAllRemoteVideoStreams(true) results in 
   that the local user not receiving any video stream after joining a channel.

   @param mute Whether to receive remote video streams by default:
   - true: Do not receive any remote video stream by default.
   - false: (Default) Receive remote video streams by default.
   @return
   - 0: Success.
   - < 0: Failure.
   */
  virtual int setDefaultMuteAllRemoteVideoStreams(bool mute) = 0;

  /**
   * Stops or resumes receiving the video stream of a specified user.
   *
   * @note
   * You can call this method before or after joining a channel. If a user 
   * leaves a channel, the settings in this method become invalid.
   *
   * @param uid The ID of the specified user.
   * @param mute Whether to stop receiving the video stream of the specified user:
   * - true: Stop receiving the video stream of the specified user.
   * - false: (Default) Resume receiving the video stream of the specified user.
   * @param connectionId The connection ID.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int muteRemoteVideoStream(uid_t uid, bool mute,
                                    conn_id_t connectionId = DEFAULT_CONNECTION_ID) = 0;

  /**
   * Sets the remote video stream type.
   *
   * If the remote user has enabled the dual-stream mode, by default the SDK receives the high-stream video by
   * Call this method to switch to the low-stream video.
   *
   * @note
   * This method applies to scenarios where the remote user has enabled the dual-stream mode using
   * \ref enableDualStreamMode "enableDualStreamMode"(true) before joining the channel.
   *
   * @param uid ID of the remote user sending the video stream.
   * @param streamType Sets the video stream type: #REMOTE_VIDEO_STREAM_TYPE.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setRemoteVideoStreamType(uid_t uid, REMOTE_VIDEO_STREAM_TYPE streamType) = 0;

  /**
   * Sets the default stream type of the remote video if the remote user has enabled dual-stream.
   *
   * @param streamType Sets the default video stream type: #REMOTE_VIDEO_STREAM_TYPE.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setRemoteDefaultVideoStreamType(REMOTE_VIDEO_STREAM_TYPE streamType) = 0;

  /**
   * Enables the `onAudioVolumeIndication` callback to report on which users are speaking
   * and the speakers' volume.
   *
   * Once the \ref IRtcEngineEventHandler::onAudioVolumeIndication "onAudioVolumeIndication"
   * callback is enabled, the SDK returns the volume indication in the at the time interval set
   * in `enableAudioVolumeIndication`, regardless of whether any user is speaking in the channel.
   *
   * @param interval Sets the time interval between two consecutive volume indications:
   * - ≤ 0: Disables the volume indication.
   * - > 0: Time interval (ms) between two consecutive volume indications.
   * We recommend setting this parameter to a value larger than 200 (included).
   * @param smooth The smoothing factor that sets the sensitivity of the audio volume
   * indicator. The value range is [0, 10]. The greater the value, the more sensitive the
   * indicator. The recommended value is 3.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int enableAudioVolumeIndication(int interval, int smooth) = 0;

  /** Starts an audio recording.

  The SDK allows recording during a call, which supports either one of the
  following two formats:

  - .wav: Large file size with high sound fidelity
  - .aac: Small file size with low sound fidelity

  Ensure that the directory to save the recording file exists and is writable.
  This method is usually called after the joinChannel() method.
  The recording automatically stops when the leaveChannel() method is
  called.

  @param filePath Full file path of the recording file. The string of the file
  name is in UTF-8 code.
  @param quality Sets the audio recording quality: #AUDIO_RECORDING_QUALITY_TYPE.
  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int startAudioRecording(const char* filePath, AUDIO_RECORDING_QUALITY_TYPE quality) = 0;

  /** Stops the audio recording on the client.

  The recording automatically stops when the leaveChannel() method is called.

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int stopAudioRecording() = 0;

  /**
   * Creates a media player source object and return its pointer. If full featured
   * media player source is supported, it will create it, or it will create a simple
   * media player.
   *
   * @return
   * - The pointer to \ref rtc::IMediaPlayerSource "IMediaPlayerSource",
   *   if the method call succeeds.
   * - The empty pointer NULL, if the method call fails.
   */
  virtual agora_refptr<IMediaPlayerSource> createMediaPlayer() = 0;

  /**
   * Destroy a media player source instance.
   * If a media player source instance is destroyed, the video and audio of it cannot
   * be published.
   *
   * @param media_player The pointer to \ref rtc::IMediaPlayerSource.
   *
   * @return
   * - >0: The id of media player source instance.
   * - < 0: Failure.
   */
  virtual int destroyMediaPlayer(agora_refptr<IMediaPlayerSource> media_player) = 0;

  /** Starts playing and mixing the music file.

  This method mixes the specified local audio file with the audio stream from 
  the microphone, or replaces the microphone's audio stream with the specified 
  local audio file. You can choose whether the other user can hear the local 
  audio playback and specify the number of playback loops. This method also 
  supports online music playback.

  After calling this method successfully, the SDK triggers the 

  \ref IRtcEngineEventHandler::onAudioMixingStateChanged "onAudioMixingStateChanged" (PLAY) 
  callback on the local client.
  When the audio mixing file playback finishes after calling this method, the 
  SDK triggers the 
  \ref IRtcEngineEventHandler::onAudioMixingStateChanged "onAudioMixingStateChanged" (STOPPED) 
  callback on the local client.

  @note
  - Call this method after joining a channel, otherwise issues may occur.
  - If the local audio mixing file does not exist, or if the SDK does not 
  support the file format or cannot access the music file URL, the SDK returns 
  #WARN_AUDIO_MIXING_OPEN_ERROR (701).
  - If you want to play an online music file, ensure that the time interval 
  between calling this method is more than 100 ms, or the 
  `AUDIO_MIXING_ERROR_TOO_FREQUENT_CALL(702)` error code occurs.

  @param filePath Pointer to the absolute path (including the suffixes of the 
  filename) of the local or online audio file to mix, for example, c:/music/au
  dio.mp4. Supported audio formats: 3GP, ASF, ADTS, AVI, MP3, MP4, MPEG-4, 
  SAMI, and WAVE.
  @param loopback Sets which user can hear the audio mixing:
  - true: Only the local user can hear the audio mixing.
  - false: Both users can hear the audio mixing.

  @param replace Sets the audio mixing content:
  - true: Only publish the specified audio file. The audio stream from the 
  microphone is not published.
  - false: The local audio file is mixed with the audio stream from the 
  microphone.

  @param cycle Sets the number of playback loops:
  - Positive integer: Number of playback loops.
  - `-1`: Infinite playback loops.

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int startAudioMixing(const char* filePath, bool loopback, bool replace, int cycle) = 0;

  /** Stops playing and mixing the music file.

  Call this method when you are in a channel.

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int stopAudioMixing() = 0;

  /** Pauses playing and mixing the music file.

  Call this method when you are in a channel.

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int pauseAudioMixing() = 0;

  /** Resumes playing and mixing the music file.

  Call this method when you are in a channel.

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int resumeAudioMixing() = 0;

  /** Adjusts the volume during audio mixing.

  Call this method when you are in a channel.

  @note This method does not affect the volume of audio effect file playback 
  invoked by the \ref IRtcEngine::playEffect "playEffect" method.

  @param volume The audio mixing volume. The value ranges between 0 and 100
  (default).

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int adjustAudioMixingVolume(int volume) = 0;

  /** Adjusts the audio mixing volume for publishing (for remote users).
   @note Call this method when you are in a channel.
   @param volume Audio mixing volume for publishing. The value ranges between 0 and 100 (default).
   @return
    - 0: Success.
    - < 0: Failure.
   */
  virtual int adjustAudioMixingPublishVolume(int volume) = 0;

  /** Retrieves the audio mixing volume for publishing.
   This method helps troubleshoot audio volume related issues.
   @note Call this method when you are in a channel.
   @return
    - &ge; 0: The audio mixing volume for publishing, if this method call succeeds. The value range is [0,100].
    - < 0: Failure.
   */
  virtual int getAudioMixingPublishVolume() = 0;

  /** Adjusts the audio mixing volume for local playback.
   @note Call this method when you are in a channel.
   @param volume Audio mixing volume for local playback. The value ranges between 0 and 100 (default).
   @return
    - 0: Success.
    - < 0: Failure.
   */
  virtual int adjustAudioMixingPlayoutVolume(int volume) = 0;

  /** Retrieves the audio mixing volume for local playback.
   This method helps troubleshoot audio volume related issues.
   @note Call this method when you are in a channel.
   @return
    - &ge; 0: The audio mixing volume, if this method call succeeds. The value range is [0,100].
    - < 0: Failure.
   */
  virtual int getAudioMixingPlayoutVolume() = 0;

  /** Gets the duration (ms) of the music file.

   Call this API when you are in a channel.

   @return
   - Returns the audio mixing duration, if the method call is successful.
   - < 0: Failure.
   */
  virtual int getAudioMixingDuration() = 0;

  /** Gets the playback position (ms) of the music file.

   Call this method when you are in a channel.

   @return
   - &ge; 0: The current playback position of the audio mixing, if this method 
   call succeeds.
   - < 0: Failure.
   */
  virtual int getAudioMixingCurrentPosition() = 0;

  /** Sets the playback position of the music file to a different starting 
   position (the default plays from the beginning).

   @param pos The playback starting position (ms) of the audio mixing file.

   @return
   - 0: Success.
   - < 0: Failure.
   */
  virtual int setAudioMixingPosition(int pos /*in ms*/) = 0;

  /** Gets the volume of the audio effects.
   The value ranges between 0 and 100.

   @return
   - Returns the volume, if the method call is successful.
   - < 0: Failure.
   */
  virtual int getEffectsVolume() = 0;

  /** Sets the volume of the audio effects.
   @param volume The volume of the audio effects. The value ranges between 0
   and 100 (default).

   @return
   - 0: Success.
   - < 0: Failure.
   */
  virtual int setEffectsVolume(int volume) = 0;

  /** Preloads a specific audio effect file (compressed audio file) to the
  memory.

  @param soundId ID (Output) of the audio effect generated by SDK.
  Each audio effect has a unique ID.
  @param filePath The absolute path of the audio effect file.

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int preloadEffect(int soundId, const char* filePath) = 0;

  /** Plays a specified local or online audio effect file.

  @param soundId ID of the audio effect generated by SDK.
  Each audio effect has a unique ID.
  @param filePath The absolute path of the audio effect file or the URL of the
  online audio effect file.
  @param loopCount Sets the number of times looping the audio effect:
  - 0: Play the audio effect once.
  - 1: Play the audio effect twice.
  - -1: Play the audio effect in a loop indefinitely, until stopEffect() or
  stopAllEffects() is called.

  @param pitch Sets the pitch of the audio effect. The range is [0.5, 2].
  The default value is 1, which means no change to the pitch. The smaller the
  value, the lower the pitch.

  @param pan Sets the spatial position of the audio effect. The range is
  [-1.0, 1.0]:
  - 0.0: The audio effect shows ahead.
  - 1.0: The audio effect shows on the right.
  - -1.0: The audio effect shows on the left.

  @param gain Sets the volume of the audio effect. The range is [0.0, 100,0].
  The default value is 100.0. The smaller the value, the lower the volume of the
  audio effect.

  @param publish Sets whether to publish the specified audio effect to the remote
  stream:
  - True: The audio effect, played locally, is published to the Agora Cloud and
  the remote users can hear it.
  - False: The audio effect, played locally, is not published to the Agora Cloud
  and the remote users cannot hear it.

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int playEffect(int soundId, const char* filePath, int loopCount, double pitch, double pan, int gain, bool publish = false) = 0;

  /** Plays all local or online audio effect file.
  @param loopCount Sets the number of times looping the audio effect:
  - 0: Play the audio effect once.
  - 1: Play the audio effect twice.
  - -1: Play the audio effect in a loop indefinitely, until stopEffect() or
  stopAllEffects() is called.

  @param pitch Sets the pitch of the audio effect. The range is [0.5, 2].
  The default value is 1, which means no change to the pitch. The smaller the
  value, the lower the pitch.

  @param pan Sets the spatial position of the audio effect. The range is
  [-1.0, 1.0]:
  - 0.0: The audio effect shows ahead.
  - 1.0: The audio effect shows on the right.
  - -1.0: The audio effect shows on the left.

  @param gain Sets the volume of the audio effect. The range is [0.0, 100,0].
  The default value is 100.0. The smaller the value, the lower the volume of the
  audio effect.

  @param publish Sets whether to publish the specified audio effect to the remote
  stream:
  - True: The audio effect is played locally, and is also published to the Agora Cloud
  and the remote users can hear it.
  - False: The audio effect is played locally, but is not published to the Agora Cloud
  and the remote users cannot hear it.

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int playAllEffects(int loopCount, double pitch, double pan, int gain, bool publish = false) = 0;

  /** Get the volume of a specified sound effect.

  The value ranges between 0.0 and 100.0.

  @param soundId ID of the audio effect. Each audio effect has a unique ID.

  @return
   - Returns the volume, if the method call is successful.
   - < 0: Failure.
   */
  virtual int getVolumeOfEffect(int soundId) = 0;

  /** Sets the volume of a specified sound effect.

   @param soundId ID of the audio effect. Each audio effect has a unique ID.
   @param volume Volume of the audio effect. The value ranges between 0.0 and
   100.0 (default).

   @return
  - 0: Success.
  - < 0: Failure.
   */
  virtual int setVolumeOfEffect(int soundId, int volume) = 0;

  /** Pauses a specific audio effect.

  @param soundId ID of the audio effect. Each audio effect has a unique ID.
  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int pauseEffect(int soundId) = 0;

  /** Pauses all the audio effects.

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int pauseAllEffects() = 0;

  /** Resumes playing a specific audio effect.

  @param soundId ID of the audio effect. Each audio effect has a unique ID.
  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int resumeEffect(int soundId) = 0;

  /** Resumes playing all the audio effects.
  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int resumeAllEffects() = 0;

  /** Stops playing a specific audio effect.

  @param soundId ID of the audio effect. Each audio effect has a unique ID.
  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int stopEffect(int soundId) = 0;

  /** Stops playing all the audio effects.

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int stopAllEffects() = 0;

  /** Releases a specific preloaded audio effect from the memory.

   @param soundId ID of the audio effect. Each audio effect has a unique ID.
   @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int unloadEffect(int soundId) = 0;

  /** Release all preloaded audio effect from the memory.
   @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int unloadAllEffects() = 0;

  /** Changes the voice pitch of the local speaker.

  @param pitch The voice pitch. The value ranges between 0.5 and 2.0. The lower 
  the value, the lower the voice pitch. The default value is 1.0 (no change to 
  the local voice pitch).

  @return
  - 0: Success.
  - -1: Failure.
  */
  virtual int setLocalVoicePitch(double pitch) = 0;

  /** Sets the local voice equalization effect.

  @param bandFrequency The band frequency ranging from 0 to 9, representing the
  respective 10-band center frequencies of the voice effects, including 31, 62,
  125, 500, 1k, 2k, 4k, 8k, and 16k Hz.
  @param bandGain  Gain of each band in dB. The value ranges from -15 to 15. The
  default value is 0.
  @return
  - 0: Success.
  - -1: Failure.
  */
  virtual int setLocalVoiceEqualization(AUDIO_EQUALIZATION_BAND_FREQUENCY bandFrequency,
                                        int bandGain) = 0;

  /** Sets the local voice reverberation.

  @param reverbKey The reverberation key: #AUDIO_REVERB_TYPE.
  @param value The value of the reverberation key: #AUDIO_REVERB_TYPE.
  @return
  - 0: Success.
  - -1: Failure.
  */
  virtual int setLocalVoiceReverb(AUDIO_REVERB_TYPE reverbKey, int value) = 0;

  /** Sets the preset local voice reverberation effect.

    @note
    - Do not use this method together with 
    \ref IRtcEngine::setLocalVoiceReverb "setLocalVoiceReverb".
    - Do not use this method together with the 
    \ref IRtcEngine::setLocalVoiceChanger "setLocalVoiceChanger" method, 
    because the method called later overrides the one called earlier.

    @param reverbPreset Sets the preset audio reverberation configuration. 
    See #AUDIO_REVERB_PRESET.

    @return
    - 0: Success.
    - < 0: Failure.
    */
  virtual int setLocalVoiceReverbPreset(AUDIO_REVERB_PRESET reverbPreset) = 0;

    /** Sets the local voice changer option.

     @note Do not use this method together with the 
     \ref IRtcEngine::setLocalVoiceReverbPreset "setLocalVoiceReverbPreset" 
     method, because the method called later overrides the one called earlier.

     @param voiceChanger Sets the local voice changer option. See 
     #VOICE_CHANGER_PRESET.

     @return
     - 0: Success.
     - < 0: Failure.
     */
    virtual int setLocalVoiceChanger(VOICE_CHANGER_PRESET voiceChanger) = 0;

  /**
   * Specifies an SDK output log file.
   *
   * The log file records all log data for the SDK’s operation. Ensure that the
   * directory for the log file exists and is writable.
   *
   * @note
   * Ensure that you call this method immediately after \ref initialize "initialize",
   * or the output log may not be complete.
   *
   * @param filePath File path of the log file. The string of the log file is in UTF-8.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setLogFile(const char* filePath) = 0;

  /**
   * Sets the output log level of the SDK.
   *
   * You can use one or a combination of the filters. The log level follows the
   * sequence of `OFF`, `CRITICAL`, `ERROR`, `WARNING`, `INFO`, and `DEBUG`. Choose a level
   * and you will see logs preceding that level. For example, if you set the log level to
   * `WARNING`, you see the logs within levels `CRITICAL`, `ERROR`, and `WARNING`.
   *
   * @param filter Sets the log filter level:
   * - `LOG_FILTER_DEBUG(0x80f)`: Output all API logs. Set your log filter as DEBUG
   * if you want to get the most complete log file.
   * - `LOG_FILTER_INFO(0x0f)`: Output logs of the CRITICAL, ERROR, WARNING, and INFO
   * level. We recommend setting your log filter as this level.
   * - `LOG_FILTER_WARNING(0x0e)`: Output logs of the CRITICAL, ERROR, and WARNING level.
   * - `LOG_FILTER_ERROR(0x0c)`: Output logs of the CRITICAL and ERROR level.
   * - `LOG_FILTER_CRITICAL(0x08)`: Output logs of the CRITICAL level.
   * - `LOG_FILTER_OFF(0)`: Do not output any log.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setLogFilter(unsigned int filter) = 0;

  /**
   * Sets the output log level of the SDK.
   *
   * You can use one of the level defined in LOG_LEVEL.
   *
   * @param level Sets the log level:
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setLogLevel(commons::LOG_LEVEL level) = 0;

  /**
   * Sets the log file size (KB).
   * 
   * The SDK has two log files, each with a default size of 512 KB. If you set 
   * `fileSizeInBytes` as 1024 KB, the SDK outputs log files with a total 
   * maximum size of 2 MB.
   * If the total size of the log files exceed the set value,
   * the new output log files overwrite the old output log files.
   *
   * @param fileSizeInKBytes The SDK log file size (KB).
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setLogFileSize(unsigned int fileSizeInKBytes) = 0;

  /**
   * Updates the display mode of the local video view.
   *
   * After initializing the local video view, you can call this method to  update its rendering mode.
   * It affects only the video view that the local user sees, not the published local video stream.
   *
   * @note
   * - Ensure that you have called \ref setupLocalVideo "setupLocalVideo" to initialize the local video
   * view before this method.
   * - During a call, you can call this method as many times as necessary to update the local video view.
   *
   * @param renderMode Sets the local display mode. See #RENDER_MODE_TYPE.
   * @param mirrorMode Sets the local mirror mode. See #VIDEO_MIRROR_MODE_TYPE.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setLocalRenderMode(media::base::RENDER_MODE_TYPE renderMode, VIDEO_MIRROR_MODE_TYPE mirrorMode) = 0;

  /**
   * Updates the display mode of the video view of a remote user.
   *
   * After initializing the video view of a remote user, you can call this method to update its
   * rendering and mirror modes. This method affects only the video view that the local user sees.
   *
   * @note
   * - Ensure that you have called \ref setupRemoteVideo "setupRemoteVideo" to initialize the remote video
   * view before calling this method.
   * - During a call, you can call this method as many times as necessary to update the display mode
   * of the video view of a remote user.
   *
   * @param uid ID of the remote user.
   * @param renderMode Sets the remote display mode. See #RENDER_MODE_TYPE.
   * @param mirrorMode Sets the mirror type. See #VIDEO_MIRROR_MODE_TYPE.
   * @param connectionId ID of the connection.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setRemoteRenderMode(uid_t uid, media::base::RENDER_MODE_TYPE renderMode,
                                  VIDEO_MIRROR_MODE_TYPE mirrorMode,
                                  conn_id_t connectionId = DEFAULT_CONNECTION_ID) = 0;

  // The following APIs are either deprecated and going to deleted.

  /**
   * Updates the display mode of the local video view.
   *
   * After initializing the local video view, you can call this method to  update its rendering mode.
   * It affects only the video view that the local user sees, not the published local video stream.
   *
   * @note
   * - Ensure that you have called \ref setupLocalVideo "setupLocalVideo" to initialize the local video
   * view before this method.
   * - During a call, you can call this method as many times as necessary to update the local video view.
   *
   * @param renderMode Sets the local display mode. See #RENDER_MODE_TYPE.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setLocalRenderMode(media::base::RENDER_MODE_TYPE renderMode) = 0;

  /**
   * Updates the display mode of the video view of a remote user.
   *
   * After initializing the video view of a remote user, you can call this method to update its
   * rendering and mirror modes. This method affects only the video view that the local user sees.
   *
   * @note
   * - Ensure that you have called \ref setupRemoteVideo "setupRemoteVideo" to initialize the remote video
   * view before calling this method.
   * - During a call, you can call this method as many times as necessary to update the display mode
   * of the video view of a remote user.
   *
   * @param uid ID of the remote user.
   * @param renderMode Sets the remote display mode. See #RENDER_MODE_TYPE.
   * @param connectionId ID of the connection.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setRemoteRenderMode(uid_t uid, media::base::RENDER_MODE_TYPE renderMode,
                                  conn_id_t connectionId = DEFAULT_CONNECTION_ID) = 0;

  /**
   * Sets the local video mirror mode.
   *
   * Use this method before calling the \ref startPreview "startPreview" method, or the mirror mode
   * does not take effect until you call the `startPreview` method again.
   * @param mirrorMode Sets the local video mirror mode. See #VIDEO_MIRROR_MODE_TYPE.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setLocalVideoMirrorMode(VIDEO_MIRROR_MODE_TYPE mirrorMode) = 0;

  /**
   * Enables or disables the dual video stream mode.
   *
   * If dual-stream mode is enabled, the subscriber can choose to receive the high-stream
   * (high-resolution high-bitrate video stream) or low-stream (low-resolution low-bitrate video stream)
   * video using \ref setRemoteVideoStreamType "setRemoteVideoStreamType".
   *
   * @param enabled
   * - true: Enable the dual-stream mode.
   * - false: (default) Disable the dual-stream mode.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int enableDualStreamMode(bool enabled) = 0;

  /**
   * Enables or disables the dual video stream mode.
   *
   * If dual-stream mode is enabled, the subscriber can choose to receive the high-stream
   * (high-resolution high-bitrate video stream) or low-stream (low-resolution low-bitrate video stream)
   * video using \ref setRemoteVideoStreamType "setRemoteVideoStreamType".
   *
   * @param enabled
   * - true: Enable the dual-stream mode.
   * - false: (default) Disable the dual-stream mode.
   * @param streamConfig
   * - The minor stream config
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int enableDualStreamMode(bool enabled, const SimulcastStreamConfig& streamConfig) = 0;

  /**
   * Sets the external audio source.
   *
   * @note
   * Ensure that you call this method before \ref joinChannel "joinChannel".
   *
   * @param enabled Determines whether to enable the external audio source:
   * - true: Enable the external audio source.
   * - false: (default) Disable the external audio source.
   * @param sampleRate The Sample rate (Hz) of the external audio source, which can set be as
   * 8000, 16000, 32000, 44100, or 48000.
   * @param channels The number of channels of the external audio source, which can be set as 1 or 2:
   * - 1: Mono.
   * - 2: Stereo.
   * @param sourceNumber The number of the external audio sources, should be greater than 0.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setExternalAudioSource(bool enabled, int sampleRate, int channels,
                                     int sourceNumber = 1) = 0;

  /**
   * Sets the audio recording format for the
   * \ref agora::media::IAudioFrameObserver::onRecordAudioFrame "onRecordAudioFrame" callback.
   *
   * @param sampleRate The sample rate (Hz) of the audio data returned in the `onRecordAudioFrame` callback, which can set be
   * as 8000, 16000, 32000, 44100, or 48000.
   * @param channel The number of audio channels of the audio data returned in the `onRecordAudioFrame` callback, which can
   * be set as 1 or 2:
   * - 1: Mono.
   * - 2: Stereo.
   * @param mode This mode is deprecated.
   * @param samplesPerCall not support. Sampling points in the called data returned in
   * onRecordAudioFrame(). For example, it is usually set as 1024 for stream
   * pushing.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setRecordingAudioFrameParameters(int sampleRate, int channel,
                                               RAW_AUDIO_FRAME_OP_MODE_TYPE mode,
                                               int samplesPerCall) = 0;

  /**
   * Sets the audio playback format for the
   * \ref agora::media::IAudioFrameObserver::onPlaybackAudioFrame "onPlaybackAudioFrame" callback.
   *
   * @param sampleRate Sets the sample rate (Hz) of the audio data returned in the `onPlaybackAudioFrame` callback,
   * which can set be as 8000, 16000, 32000, 44100, or 48000.
   * @param channel The number of channels of the audio data returned in the `onPlaybackAudioFrame` callback, which
   * can be set as 1 or 2:
   * - 1: Mono
   * - 2: Stereo
   * @param mode Deprecated. The use mode of the onPlaybackAudioFrame() callback:
   * agora::rtc::RAW_AUDIO_FRAME_OP_MODE_TYPE.
   * @param samplesPerCall not support. Sampling points in the called data returned in
   * onPlaybackAudioFrame(). For example, it is usually set as 1024 for stream
   * pushing.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setPlaybackAudioFrameParameters(int sampleRate, int channel,
                                              RAW_AUDIO_FRAME_OP_MODE_TYPE mode,
                                              int samplesPerCall) = 0;

  /**
   * Sets the mixed audio format for the
   * \ref agora::media::IAudioFrameObserver::onMixedAudioFrame "onMixedAudioFrame" callback.
   *
  * @param sampleRate The sample rate (Hz) of the audio data returned in the `onMixedAudioFrame` callback, which can set
  * be as 8000, 16000, 32000, 44100, or 48000.
  * @param channel The number of channels of the audio data in `onMixedAudioFrame` callback, which can be set as 1 or 2:
  * - 1: Mono
  * - 2: Stereo
  * @param samplesPerCall not support. Sampling points in the called data returned in
  * `onMixedAudioFrame`. For example, it is usually set as 1024 for stream pushing.
  * @return
  * - 0: Success.
  * - < 0: Failure.
  */
  virtual int setMixedAudioFrameParameters(int sampleRate, int channel, int samplesPerCall) = 0;

  /**
   * Sets the audio playback format before mixing in the
   * \ref agora::media::IAudioFrameObserver::onPlaybackAudioFrameBeforeMixing "onPlaybackAudioFrameBeforeMixing"
   * callback.
   *
   * @param sampleRate The sample rate (Hz) of the audio data returned in
   * `onPlaybackAudioFrameBeforeMixing`, which can set be as 8000, 16000, 32000, 44100, or 48000.
   * @param channel Number of channels of the audio data returned in `onPlaybackAudioFrameBeforeMixing`,
   * which can be set as 1 or 2:
   * - 1: Mono
   * - 2: Stereo
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setPlaybackAudioFrameBeforeMixingParameters(int sampleRate, int channel) = 0;

  /** Adjusts the recording volume.

  @param volume The recording volume, which ranges from 0 to 400:

  - 0: Mute the recording volume.
  - 100: The Original volume.
  - 400: (Maximum) Four times the original volume with signal clipping
  protection.

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int adjustRecordingSignalVolume(int volume) = 0;

  /**
   * Mute or resume recording signal volume.
   *
   * @param mute Determines whether to mute or resume the recording signal volume.
   * - true: Mute the recording signal volume.
   * - false: (Default) Resume the recording signal volume.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int muteRecordingSignal(bool mute) = 0;

  /** Adjusts the playback volume.

  @param volume The playback volume, which ranges from 0 to 400:

  - 0: Mute the recoridng volume.
  - 100: The Original volume.
  - 400: (Maximum) Four times the original volume with signal clipping
  protection.

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int adjustPlaybackSignalVolume(int volume) = 0;

  /** Enables loopback recording.

  @param enabled
  - True: Enable the loopback recording. The audio pcm data got from loopback device
          will be sent by default connection.
  - False: Disable the loopback recording.
  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int enableLoopbackRecording(bool enabled) = 0;

  /** Enables loopback recording.

  @param connectionId
  - The id of connection that is used to send the audio pcm data got from loopback
    device.
  @param enabled
  - True: Enable the loopback recording.
  - False: Disable the loopback recording.
  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int enableLoopbackRecording(conn_id_t connectionId, bool enabled) = 0;

  /** Adjusts the loopback recording volume.

  @param volume The loopback volume, which ranges from 0 to 100:

  - 0: Mute the recoridng volume.
  - 100: The Original volume.
  protection.

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int adjustLoopbackRecordingVolume(int volume) = 0;

  /** Retrieves the audio volume for recording loopback.
  @note Call this method when you are in a channel.
  @return
  - &ge; 0: The audio volume for loopback, if this method call succeeds. The value range is [0,100].
  - < 0: Failure.
  */
  virtual int getLoopbackRecordingVolume() = 0;

  /**
   * Enables in-ear monitoring (for Android and iOS only).
   *
   * @param enabled Determines whether to enable in-ear monitoring.
   * - true: Enable.
   * - false: (Default) Disable.
   * @param includeAudioFilter Determines whether to include the audio filter (
   * voice changer or reverberation) in the in-ear monitoring.
   * - true: Include the audio filter.
   * - false: Do not the include audio filter.
   * This parameter will be ignored when `enabled` is set to `false`.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int enableInEarMonitoring(bool enabled, bool includeAudioFilter) = 0;

  /**
   * Sets the volume of the in-ear monitor (for Android and iOS only).
   *
   * @param volume Sets the volume of the in-ear monitor. The value ranges 
   * between 0 and 100 (default).
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setInEarMonitoringVolume(int volume) = 0;

  virtual int enableLocalVideoFilter(const char* name, const char* vendor,
                                     agora_refptr<IVideoFilter> filter, int enable) = 0;

  virtual int enableLocalVideoFilter(const char* name, const char* vendor, int enable) = 0;

  virtual int setLocalVideoFilterProperty(const char* name, const char* vendor, const char* key,
                                          const void* value, int size) = 0;

  virtual int getLocalVideoFilterProperty(const char* name, const char* vendor, const char* key,
                                          void* value, int size) = 0;

  virtual int enableRemoteVideoFilter(const char* name, const char* vendor,
                                      agora_refptr<IVideoFilter> filter, int enable) = 0;
  virtual int enableRemoteVideoFilter(const char* name, const char* vendor, int enable) = 0;

  virtual int setRemoteVideoFilterProperty(const char* name, const char* vendor, const char* key,
                                           const void* value, int size) = 0;

  virtual int getRemoteVideoFilterProperty(const char* name, const char* vendor, const char* key,
                                           void* value, int size) = 0;

#if defined(__ANDROID__) || (defined(__APPLE__) && TARGET_OS_IOS)

  /** 
   * Switches between front and rear cameras.
   *
   * @note This method applies to Android and iOS only.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int switchCamera() = 0;

  /** Sets the camera capture configuration.
   * @note Call this method before enabling the local camera.
   * That said, you can call this method before calling \ref IRtcEngine::joinChannel "joinChannel",
   * \ref IRtcEngine::enableVideo "enableVideo", or \ref IRtcEngine::enableLocalVideo "enableLocalVideo",
   * depending on which method you use to turn on your local camera.
   *
   * @param config Sets the camera capturer configuration. See CameraCapturerConfiguration.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setCameraCapturerConfiguration(const CameraCapturerConfiguration& config) = 0;
 
  /** Sets the default audio route (for Android and iOS only).
   
   Most mobile phones have two audio routes: an earpiece at the top, and a 
   speakerphone at the bottom. The earpiece plays at a lower volume, and the 
   speakerphone at a higher volume.

   When setting the default audio route, you determine whether audio playback 
   comes through the earpiece or speakerphone when no external audio device is 
   connected.

   Depending on the scenario, Agora uses different default audio routes:
   - Voice call: Earpiece
   - Audio broadcast: Speakerphone
   - Video call: Speakerphone
   - Video broadcast: Speakerphone

   Call this method before, during, or after a call, to change the default 
   audio route. When the audio route changes, the SDK triggers the 
   \ref IRtcEngineEventHandler::onAudioRoutingChanged "onAudioRoutingChanged" 
   callback.

   @note The system audio route changes when an external audio device, such as 
   a headphone or a Bluetooth audio device, is connected. See *Principles for changing the audio route*.

   @param defaultToSpeaker Whether to set the speakerphone as the default audio 
   route:
   - true: Set the speakerphone as the default audio route.
   - false: Do not set the speakerphone as the default audio route.

   @return
   - 0: Success.
   - < 0: Failure.
   */
  virtual int setDefaultAudioRouteToSpeakerphone(bool defaultToSpeaker) = 0;

  /** Enables/Disables the speakerphone temporarily (for Android and iOS only).
   
   When the audio route changes, the SDK triggers the 
   \ref IRtcEngineEventHandler::onAudioRoutingChanged "onAudioRoutingChanged" 
   callback.

   You can call this method before, during, or after a call. However, Agora 
   recommends calling this method only when you are in a channel to change 
   the audio route temporarily.

   @note This method sets the audio route temporarily. Plugging in or 
   unplugging a headphone, or the SDK re-enabling the audio device module 
   (ADM) to adjust the media volume in some scenarios relating to audio, leads 
   to a change in the audio route. See *Principles for changing the audio 
   route*.

   @param speakerOn Whether to set the speakerphone as the temporary audio 
   route:
   - true: Set the speakerphone as the audio route temporarily. (For iOS only: 
   calling setEnableSpeakerphone(true) does not change the audio route to the 
   speakerphone if a headphone or a Bluetooth audio device is connected.)
   - false: Do not set the speakerphone as the audio route.
   @return
   - 0: Success.
   - < 0: Failure.
   */
  virtual int setEnableSpeakerphone(bool speakerOn) = 0;

  /** Checks whether the speakerphone is enabled (for Android and iOS only).

   @return
   - true: The speakerphone is enabled, and the audio plays from the speakerphone.
   - false: The speakerphone is not enabled, and the audio plays from devices 
   other than the speakerphone. For example, the headset or earpiece.
   */
  virtual bool isSpeakerphoneEnabled() = 0;

#endif  // __ANDROID__ || (__APPLE__ && TARGET_OS_IOS)

#if (defined(__APPLE__) && TARGET_OS_MAC && !TARGET_OS_IPHONE)

  /** Shares the whole or part of a screen by specifying the display ID.

  @note This method applies to macOS only.

  @param  displayId The display ID of the screen to be shared. This parameter
  specifies which screen you want to share. For information on how to get the
  displayId, see the advanced guide: Share the Screen.
  @param regionRect (Optional) Sets the relative location of the region to the
  screen. NIL means sharing the whole screen. See Rectangle.
  If the specified region overruns the screen, the SDK shares only the region
  within it; if you set width or height as 0, the SDK shares the whole screen.
  @param captureParams Sets the screen sharing encoding parameters. See
  ScreenCaptureParameters.

  @return
  - 0: Success.
  - < 0: Failure:
    - ERR_INVALID_STATE: The screen sharing state is invalid, probably because
    another screen or window is being shared. Call stopScreenCapture() to stop
    the current screen sharing.
    - ERR_INVALID_ARGUMENT: The argument is invalid.
  */
  virtual int startScreenCaptureByDisplayId(unsigned int displayId, const Rectangle& regionRect,
                                            const ScreenCaptureParameters& captureParams) = 0;

#endif  // __APPLE__ && TARGET_OS_MAC && !TARGET_OS_IPHONE

#if defined(_WIN32)

  /**
   * Shares the whole or part of a screen by specifying the screen rect.
   *
   * @note This method applies to Windows only.
   *
   * @param screenRect Sets the relative location of the screen to the virtual
   * screen. For information on how to get screenRect, see the advanced guide:
   * Share the Screen.
   * @param regionRect (Optional) Sets the relative location of the region to the
   * screen. NULL means sharing the whole screen. See Rectangle.
   * If the specified region overruns the screen, the SDK shares only the region
   * within it; if you set width or height as 0, the SDK shares the whole screen.
   * @param captureParams Sets the screen sharing encoding parameters. See
   * ScreenCaptureParameters.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure:
   *   - ERR_INVALID_STATE: The screen sharing state is invalid, probably because
   * another screen or window is being shared. Call stopScreenCapture() to stop
   * the current screen sharing.
   *   - ERR_INVALID_ARGUMENT: The argument is invalid.
  */
  virtual int startScreenCaptureByScreenRect(const Rectangle& screenRect,
                                             const Rectangle& regionRect,
                                             const ScreenCaptureParameters& captureParams) = 0;

#endif  // _WIN32

#if defined(__ANDROID__)

  /**
   * Screen capturer by specifying a result data which obtained from a succesful screen
   * capture request.
   *
   * This method shares the whole screen.
   *
   * @note
   * This method applies to Android only.
   * @param mediaProjectionPermissionResultData The resulting data from 
   * `android.app.Activity#onActivityResult`.
   * @param captureParams Sets the screen sharing encoding parameters. See
   * ScreenCaptureParameters.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *   - ERR_INVALID_ARGUMENT if mediaProjectionPermissionResultData is null.
   */
  virtual int startScreenCapture(void* mediaProjectionPermissionResultData,
                                 const ScreenCaptureParameters& captureParams) = 0;

#endif  // __ANDROID__

#if defined(_WIN32) || (defined(__APPLE__) && !(TARGET_OS_IPHONE) && (TARGET_OS_MAC))
  
  /** Shares the whole or part of a window by specifying the window ID.

  @param windowId The ID of the window to be shared. For information on how to
  get the windowId, see the advanced guide: Share the Window.
  @param regionRect (Optional) The relative location of the region to the
  window. NULL/NIL means sharing the whole window. See Rectangle. If the
  specified region overruns the window, the SDK shares only the region within
  it; if you set width or height as 0, the SDK shares the whole window.
  @param captureParams The window sharing encoding parameters. See
  ScreenCaptureParameters.

  @return
  - 0: Success.
  - < 0: Failure:
    - ERR_INVALID_STATE: The window sharing state is invalid, probably because
    another screen or window is being shared. Call stopScreenCapture() to stop
    sharing the current window.
    - ERR_INVALID_ARGUMENT: The argument is invalid.
  */
  virtual int startScreenCaptureByWindowId(view_t windowId, const Rectangle& regionRect,
                                           const ScreenCaptureParameters& captureParams) = 0;
  
  /**
   * Sets the content hint for screen sharing.
   *
   * A content hint suggests the type of the content being shared, so that the SDK applies different
   * optimization algorithm to different types of content.
   *
   * @param contentHint Sets the content hint for screen sharing: #VIDEO_CONTENT_HINT.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setScreenCaptureContentHint(VIDEO_CONTENT_HINT contentHint) = 0;

  /**
   * Updates the screen sharing region.
   *
   * @param regionRect Sets the relative location of the region to the screen or
   * window. NIL/NULL means sharing the whole screen or window. See Rectangle.
   * If the specified region overruns the screen or window, the SDK shares only
   * the region within it; if you set width or height as 0, the SDK shares the
   * whole screen or window.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure:
   *   - ERR_NOT_READY: No screen or window is being shared.
   */
  virtual int updateScreenCaptureRegion(const Rectangle& regionRect) = 0;

#endif  // _WIN32 || (__APPLE__ && !TARGET_OS_IPHONE && TARGET_OS_MAC)

#if defined(_WIN32) || (defined(__APPLE__) && !(TARGET_OS_IPHONE) && (TARGET_OS_MAC)) || defined(__ANDROID__)

  /**
   * Updates the screen sharing parameters.
   *
   * @param captureParams Sets the screen sharing encoding parameters: ScreenCaptureParameters.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure:
   *   - ERR_NOT_READY: No screen or windows is being shared.
   */
  virtual int updateScreenCaptureParameters(const ScreenCaptureParameters& captureParams) = 0;

  /**
   * Stops the screen sharing.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int stopScreenCapture() = 0;

#endif  // _WIN32 || (__APPLE__ && !TARGET_OS_IPHONE && TARGET_OS_MAC) || __ANDROID__

  /**
   * Gets the current call ID.
   *
   * When a user joins a channel on a client, a `callId` is generated to identify
   * the call.
   *
   * After a call ends, you can call `rate` or `complain` to gather feedback from the customer.
   * These methods require a `callId` parameter. To use these feedback methods, call the this
   * method first to retrieve the `callId` during the call, and then pass the value as an
   * argument in the `rate` or `complain` method after the call ends.
   *
   * @param callId The reference to the call ID.
   * @return
   * - The call ID if the method call is successful.
   * - < 0: Failure.
  */
  virtual int getCallId(agora::util::AString& callId) = 0;

  /**
   * Allows a user to rate the call.
   *
   * It is usually called after the call ends.
   *
   * @param callId The call ID retrieved from the \ref getCallId "getCallId" method.
   * @param rating The rating of the call between 1 (the lowest score) to 5 (the highest score).
   * @param description (Optional) The description of the rating. The string length must be less than
   * 800 bytes.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int rate(const char* callId, int rating,
                   const char* description) = 0;  // 0~10

  /**
   * Allows a user to complain about the call quality.
   *
   * This method is usually called after the call ends.
   *
   * @param callId The call ID retrieved from the `getCallId` method.
   * @param description (Optional) The description of the complaint. The string length must be less than
   * 800 bytes.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int complain(const char* callId, const char* description) = 0;

  /**
   * Publishes the local stream to the CDN.
   *
   * This method call triggers the \ref IRtcEngineEventHandler::onRtmpStreamingStateChanged
   * "onRtmpStreamingStateChanged" callback on the local client to report the state of adding
   * a local stream to the CDN.
   *
   * @note
   * - This method applies to the Live Broadcast profile only.
   * - This method should be called after \ref joinChannel "joinChannel".
   * - Ensure that you enable the RTMP Converter service before using this function. 
   * See [Prerequisites](https://docs.agora.io/en/Interactive%20Broadcast/cdn_streaming_android?platform=Android#prerequisites).
   * - This method adds only one stream URL each time it is called.
   *
   * @param url The CDN streaming URL in the RTMP format. The maximum length of this parameter is 1024
   * bytes. The URL address must not contain special characters, such as Chinese language characters.
   * @param transcodingEnabled Determines whether to enable transcoding. If you set this parameter as `true`,
   * ensure that you call \ref setLiveTranscoding "setLiveTranscoding" before this method.
   * - true: Enable transcoding, to transcode the audio or video streams when
   * publishing them to CDN live, often used for combining the audio and video
   * streams of multiple hosts in CDN live.
   * - false: Disable transcoding.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *   - ERR_INVALID_ARGUMENT(2): Invalid parameter, usually because the URL address is null or the string
   * length is 0.
   *   - ERR_NOT_INITIALIZED(7): You have not initialized IRtcEngine when publishing the stream.
   */
  virtual int addPublishStreamUrl(const char* url, bool transcodingEnabled) = 0;

  /**
   * Removes an RTMP stream from the CDN.
   *
   * This method removes the RTMP URL address added by `addPublishStreamUrl` from a CDN live stream. The SDK
   * reports the result of this method call in the \ref IRtcEngineEventHandler::onRtmpStreamingStateChanged
   * "onRtmpStreamingStateChanged" callback.
   * @note
   * - This method applies to the Live Broadcast profile only.
   * - This method should be called after \ref joinChannel "joinChannel".
   * - Ensure that you enable the RTMP Converter service before using this function. 
   * See [Prerequisites](https://docs.agora.io/en/Interactive%20Broadcast/cdn_streaming_android?platform=Android#prerequisites).
   * - This method removes only one stream URL each time it is called.
   *
   * @param url The RTMP URL address to be removed. The maximum length of this parameter is 1024 bytes.
   * The URL address must not contain special characters, such as Chinese language characters.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int removePublishStreamUrl(const char* url) = 0;

    /**
     * Sets the video layout and audio settings for CDN live.
     *
     * The SDK triggers the \ref IRtcEngineEventHandler::onTranscodingUpdated "onTranscodingUpdated" callback when you call this method to update the `LiveTranscoding`class.
     * If you call this method to set the `LiveTranscoding` class for the first time, the SDK does not trigger the `onTranscodingUpdated` callback.
     *
     * @note Before calling the methods listed in this section:
     * - This method applies to Live Broadcast only.
     * - Ensure that you enable the RTMP Converter service before using this function. 
     * See [Prerequisites](https://docs.agora.io/en/Interactive%20Broadcast/cdn_streaming_android?platform=Android#prerequisites).
     * - Ensure that you call the `setClientRole` method and set the user role as the host.
     * - Ensure that you call the `setLiveTranscoding` method before \ref addPublishStreamUrl "addPublishStreamUrl" method.
     *
     * @param transcoding Sets the CDN live audio and video transcoding settings: LiveTranscoding.
     *
     * @return
     * - 0: Success.
     * - < 0: Failure.
     */
  virtual int setLiveTranscoding(const LiveTranscoding& transcoding) = 0;

  virtual int startLocalVideoTranscoder(const LocalTranscoderConfiguration& config) = 0;
  virtual int updateLocalTranscoderConfiguration(const LocalTranscoderConfiguration& config) = 0;
  virtual int stopLocalVideoTranscoder() = 0;

  virtual int startPrimaryCameraCapture(const CameraCapturerConfiguration& config) = 0;
  virtual int startSecondaryCameraCapture(const CameraCapturerConfiguration& config) = 0;
  virtual int stopPrimaryCameraCapture() = 0;
  virtual int stopSecondaryCameraCapture() = 0;

  virtual int startPrimaryScreenCapture(const ScreenCaptureConfiguration& config) = 0;
  virtual int startSecondaryScreenCapture(const ScreenCaptureConfiguration& config) = 0;
  virtual int stopPrimaryScreenCapture() = 0;
  virtual int stopSecondaryScreenCapture() = 0;

  /** Gets the current connection state of the SDK.

   @return #CONNECTION_STATE_TYPE.
   */
  virtual CONNECTION_STATE_TYPE getConnectionState(conn_id_t connectionId = 0) = 0;

  // The following APIs are not implemented yet.
  virtual bool registerEventHandler(IRtcEngineEventHandler* eventHandler) = 0;
  virtual bool unregisterEventHandler(IRtcEngineEventHandler* eventHandler) = 0;
  virtual int setRemoteUserPriority(uid_t uid, PRIORITY_TYPE userPriority) = 0;

  /**
   * Registers a packet observer.
   *
   * The Agora Native SDK allows your app to register a packet observer to
   * receive events whenever a voice or video packet is transmitting.
   *
   * @param observer The IPacketObserver object.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int registerPacketObserver(IPacketObserver* observer) = 0;

  /**
   * Sets the built-in encryption mode.
   *
   * The Agora Native SDK supports built-in encryption, which is in AES-128-XTS mode
   * by default. If you want to use other modes, call this API to set the encryption
   * mode.
   *
   * All users in the same channel must use the same encryption mode and password.
   * Refer to information related to the AES encryption algorithm on the differences
   * between encryption modes.
   *
   * @note
   * Call \ref setEncryptionSecret "setEncryptionSecret" to enable the built-in encryption function
   * before calling this API.
   * @param encryptionMode Encryption mode:
   * - "aes-128-xts":128-bit AES encryption, XTS mode
   * - "aes-128-ecb":128-bit AES encryption, ECB mode
   * - "aes-256-xts": 256-bit AES encryption, XTS mode
   * - "": When it is set to NUL string, the encryption is in "aes-128-xts" by
   * default.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setEncryptionMode(const char* encryptionMode) = 0;

  /**
   * Enables built-in encryption.
   *
   * Use this method to specify an encryption password to enable built-in
   * encryption before joining a channel. All users in a channel must set the same
   * encryption password. The encryption password is automatically cleared once a
   * user has left the channel. If the encryption password is not specified or set to
   * empty, the encryption function will be disabled.
   *
   * @param secret The encryption password.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setEncryptionSecret(const char* secret) = 0;

  /** Enables/Disables the built-in encryption.
   *
   * In scenarios requiring high security, Agora recommends calling this method to enable the built-in encryption before joining a channel.
   *
   * All users in the same channel must use the same encryption mode and encryption key. Once all users leave the channel, the encryption key of this channel is automatically cleared.
   *
   * @note
   * - If you enable the built-in encryption, you cannot use the RTMP streaming function.
   * - Agora only supports `SM4_128_ECB` encryption mode for now.
   *
   * @param enabled Whether to enable the built-in encryption:
   * - true: Enable the built-in encryption.
   * - false: Disable the built-in encryption.
   * @param config Configurations of built-in encryption schemas. See EncryptionConfig.
   * @param connectionId The connection ID.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *  - -2(ERR_INVALID_ARGUMENT): An invalid parameter is used. Set the parameter with a valid value.
   *  - -4(ERR_NOT_SUPPORTED): The encryption mode is incorrect or the SDK fails to load the external encryption library. Check the enumeration or reload the external encryption library.
   *  - -7(ERR_NOT_INITIALIZED): The SDK is not initialized. Initialize the `IRtcEngine` instance before calling this method.
   */
  virtual int enableEncryption(bool enabled, const EncryptionConfig& config, conn_id_t connectionId = agora::rtc::DEFAULT_CONNECTION_ID) = 0;

  /** Creates a data stream.

  Each user can only have up to five data channels at the same time.

  @note
  Set `reliable` and `ordered` both as True or both as False. Do not set one as
  True and the other as False.

  @param streamId The stream ID returned by createDataStream().

  @param reliable
  - True: The recipients will receive data from the sender within 5 seconds. If
  the recipient does not receive the sent data within 5 seconds, the data
  channel will report an error to the app.
  - False: The recipients will not receive any data, and it will not report any
  error upon data missing.

  @param ordered
  - True: The recipients will receive data in the order of the sender.
  - False: The recipients will not receive data in the order of the sender.

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int createDataStream(int* streamId, bool reliable, bool ordered) = 0;

  /** Sends data stream messages to all users in a channel.

  Up to 30 packets can be sent per second in a channel with each packet having a
  maximum size of 1 kB. The API controls the data channel transfer rate. Each
  client can send up to 6 kB of data per second. Each user can have up to five
  data channels simultaneously.

  @param streamId The stream ID returned by createDataStream().
  @param data The data to be sent.
  @param length The length of the stream message.

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int sendStreamMessage(int streamId, const char* data, size_t length) = 0;

  /** **DEPRECATED** Adds a watermark image to the local video or CDN live stream.

   This method is not recommend, Use \ref agora::rtc::IRtcEngine::addVideoWatermark(const char* watermarkUrl, const WatermarkOptions& options) "addVideoWatermark"2 instead.

   This method adds a PNG watermark image to the local video stream for the recording device, channel audience, and CDN live audience to view and capture.

   To add the PNG file to the CDN live publishing stream, see the \ref IRtcEngine::setLiveTranscoding "setLiveTranscoding" method.

   @param watermark Pointer to the watermark image to be added to the local video stream. See RtcImage.

   @note
   - The URL descriptions are different for the local video and CDN live streams:
      - In a local video stream, `url` in RtcImage refers to the absolute path of the added watermark image file in the local video stream.
      - In a CDN live stream, `url` in RtcImage refers to the URL address of the added watermark image in the CDN live broadcast.
   - The source file of the watermark image must be in the PNG file format. If the width and height of the PNG file differ from your settings in this method, the PNG file will be cropped to conform to your settings.
   - The Agora SDK supports adding only one watermark image onto a local video or CDN live stream. The newly added watermark image replaces the previous one.

   @return
   - 0: Success.
   - < 0: Failure.
   */
  virtual int addVideoWatermark(const RtcImage& watermark) = 0;

  /** Adds a watermark image to the local video.

   This method adds a PNG watermark image to the local video in a live broadcast. Once the watermark image is added, all the audience in the channel (CDN audience included),
   and the recording device can see and capture it. Agora supports adding only one watermark image onto the local video, and the newly watermark image replaces the previous one.

   The watermark position depends on the settings in the \ref IRtcEngine::setVideoEncoderConfiguration "setVideoEncoderConfiguration" method:
   - If the orientation mode of the encoding video is #ORIENTATION_MODE_FIXED_LANDSCAPE, or the landscape mode in #ORIENTATION_MODE_ADAPTIVE, the watermark uses the landscape orientation.
   - If the orientation mode of the encoding video is #ORIENTATION_MODE_FIXED_PORTRAIT, or the portrait mode in #ORIENTATION_MODE_ADAPTIVE, the watermark uses the portrait orientation.
   - When setting the watermark position, the region must be less than the dimensions set in the `setVideoEncoderConfiguration` method. Otherwise, the watermark image will be cropped.

   @note
   - Ensure that you have called the \ref agora::rtc::IRtcEngine::enableVideo "enableVideo" method to enable the video module before calling this method.
   - If you only want to add a watermark image to the local video for the audience in the CDN live broadcast channel to see and capture, you can call this method or the \ref agora::rtc::IRtcEngine::setLiveTranscoding "setLiveTranscoding" method.
   - This method supports adding a watermark image in the PNG file format only. Supported pixel formats of the PNG image are RGBA, RGB, Palette, Gray, and Alpha_gray.
   - If the dimensions of the PNG image differ from your settings in this method, the image will be cropped or zoomed to conform to your settings.
   - If you have enabled the local video preview by calling the \ref agora::rtc::IRtcEngine::startPreview "startPreview" method, you can use the `visibleInPreview` member in the WatermarkOptions class to set whether or not the watermark is visible in preview.
   - If you have enabled the mirror mode for the local video, the watermark on the local video is also mirrored. To avoid mirroring the watermark, Agora recommends that you do not use the mirror and watermark functions for the local video at the same time. You can implement the watermark function in your application layer.

   @param watermarkUrl The local file path of the watermark image to be added. This method supports adding a watermark image from the local absolute or relative file path.
   @param options Pointer to the watermark's options to be added. See WatermarkOptions for more infomation.
   @param connectionId The ID of the current connection.

   @return
   - 0: Success.
   - < 0: Failure.
   */
  virtual int addVideoWatermark(const char* watermarkUrl, const WatermarkOptions& options, conn_id_t connectionId = agora::rtc::DEFAULT_CONNECTION_ID) = 0;

  /** Removes the watermark image on the video stream added by
  addVideoWatermark().

  @param connectionId The ID of the current connection.

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int clearVideoWatermark(conn_id_t connectionId = agora::rtc::DEFAULT_CONNECTION_ID) = 0;

  /** Removes the watermark image on the video stream added by
  addVideoWatermark().

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int clearVideoWatermarks() = 0;

  /** Injects an online media stream to a live broadcast.

  If the media stream is successfully injected, you can find the stream in the
  channel and the uid of the stream is 666.

  The addInjectStreamUrl() method call triggers the following callbacks:

  - The local client:
    - \ref IRtcEngineEventHandler::onStreamInjectedStatus
    "onStreamInjectedStatus()", with the state of the injecting the online stream.
    - \ref IRtcEngineEventHandler::onUserJoined
    "onUserJoined(uid: 666)", if the method call is successful and the online
    media stream is injected into the channel.
  - The remote client:
    - \ref IRtcEngineEventHandler::onUserJoined
    "onUserJoined(uid: 666)", if the method call is successful and the online
    media stream is injected into the channel.

  @param url The URL address to be added to the ongoing live broadcast. You can
  use the RTMP, HLS, and FLV protocols.
  @param config The definition of the added voice or video stream: InjectStreamConfig.

  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int addInjectStreamUrl(const char* url, const InjectStreamConfig& config) = 0;

  /** Removes the injected online media stream from a live broadcast.

  If this method call is successful, the SDK triggers the
  \ref IRtcEngineEventHandler::onUserOffline "onUserOffline()"
  callback and returns a stream uid of 666.

  @param url The HTTP/HTTPS URL address of the added stream to be removed.
  @return
  - 0: Success.
  - < 0: Failure.
  */
  virtual int removeInjectStreamUrl(const char* url) = 0;

  // The following APIs are either deprecated and going to deleted.

  /** @deprecated Use disableAudio() instead.

   Disables the audio function in the channel.

   @return
   - 0: Success.
   - < 0: Failure.
   */
   virtual int pauseAudio() = 0;
   /** @deprecated Use enableAudio() instead.

   Resumes the audio function in the channel.

   @return
   - 0: Success.
   - < 0: Failure.
   */
   virtual int resumeAudio() = 0;

  /**
   * Enables interoperability with the Agora Web SDK (Live Broadcast only).
   * 
   * @deprecated The Agora NG SDK enables the interoperablity with the Web SDK.
   *
   * Use this method when the channel profile is Live Broadcast. Interoperability
   * with the Agora Web SDK is enabled by default when the channel profile is
   * Communication.
   *
   * @param enabled Determines whether to enable interoperability with the Agora Web SDK.
   * - true: (Default) Enable interoperability with the Agora Native SDK.
   * - false: Disable interoperability with the Agora Native SDK.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int enableWebSdkInteroperability(bool enabled) = 0;

  /**
   * Report custom event to argus.
   * 
   * @param id Custom Event ID
   * @param category Custom Event category
   * @param event Custom Event to report
   * @param label Custom Event label
   * @param value Custom Event value
   * @param connectionId The connection ID.
   * 
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int sendCustomReportMessage(
      const char* id, const char* category, const char* event, const char* label, int value,
      conn_id_t connectionId = agora::rtc::DEFAULT_CONNECTION_ID) = 0;

  /** Registers the metadata observer.

   Registers the metadata observer. You need to implement the IMetadataObserver class and specify the metadata type in this method. A successful call of this method triggers the \ref agora::rtc::IMetadataObserver::getMaxMetadataSize "getMaxMetadataSize" callback.
   This method enables you to add synchronized metadata in the video stream for more diversified live broadcast interactions, such as sending shopping links, digital coupons, and online quizzes.

   @note
   - Call this method before the joinChannel method.
   - This method applies to the Live-broadcast channel profile.

   @param observer The IMetadataObserver class. See the definition of IMetadataObserver for details.
   @param type See \ref IMetadataObserver::METADATA_TYPE "METADATA_TYPE". The SDK supports VIDEO_METADATA (0) only for now.

   @return
   - 0: Success.
   - < 0: Failure.
  */
  virtual int registerMediaMetadataObserver(IMetadataObserver *observer, IMetadataObserver::METADATA_TYPE type) = 0;

  /** Start audio frame dump.

   Optional `location` is: "pre_apm_proc", "apm", "pre_send_proc", "filter", "enc", "tx_mixer",
                         "at_record", "atw_record" for audio sending.
                         "dec", "mixed", "play", "rx_mixer", "playback_mixer", "pcm_source_playback_mixer",
                         "pre_play_proc", "at_playout", "atw_playout" for audio receiving.

   */

  virtual int startAudioFrameDump(const char* channel_id, uid_t user_id, const char* location,
      const char* uuid, const char* passwd, int64_t duration_ms, bool auto_upload) = 0;

  virtual int stopAudioFrameDump(const char* channel_id, uid_t user_id, const char* location) = 0;

    /** Starts to relay media streams across channels.
     *
     * After a successful method call, the SDK triggers the
     * \ref agora::rtc::IRtcEngineEventHandler::onChannelMediaRelayStateChanged
     *  "onChannelMediaRelayStateChanged" and
     * \ref agora::rtc::IRtcEngineEventHandler::onChannelMediaRelayEvent
     * "onChannelMediaRelayEvent" callbacks, and these callbacks return the
     * state and events of the media stream relay.
     * - If the
     * \ref agora::rtc::IRtcEngineEventHandler::onChannelMediaRelayStateChanged
     *  "onChannelMediaRelayStateChanged" callback returns
     * #RELAY_STATE_RUNNING (2) and #RELAY_OK (0), and the
     * \ref agora::rtc::IRtcEngineEventHandler::onChannelMediaRelayEvent
     * "onChannelMediaRelayEvent" callback returns
     * #RELAY_EVENT_PACKET_SENT_TO_DEST_CHANNEL (4), the host starts
     * sending data to the destination channel.
     * - If the
     * \ref agora::rtc::IRtcEngineEventHandler::onChannelMediaRelayStateChanged
     *  "onChannelMediaRelayStateChanged" callback returns
     * #RELAY_STATE_FAILURE (3), an exception occurs during the media stream
     * relay.
     *
     * @note
     * - Call this method after the \ref joinChannel() "joinChannel" method.
     * - This method takes effect only when you are a host in a
     * `LIVE_BROADCASTING` channel.
     * - After a successful method call, if you want to call this method
     * again, ensure that you call the
     * \ref stopChannelMediaRelay() "stopChannelMediaRelay" method to quit the
     * current relay.
     * - Contact sales-us@agora.io before implementing this function.
     * - We do not support string user accounts in this API.
     *
     * @param configuration The configuration of the media stream relay:
     * ChannelMediaRelayConfiguration.
     *
     * @return
     * - 0: Success.
     * - < 0: Failure.
     */
  virtual int startChannelMediaRelay(const ChannelMediaRelayConfiguration &configuration) = 0;

    /** Updates the channels for media stream relay. After a successful
     * \ref startChannelMediaRelay() "startChannelMediaRelay" method call, if
     * you want to relay the media stream to more channels, or leave the
     * current relay channel, you can call the
     * \ref updateChannelMediaRelay() "updateChannelMediaRelay" method.
     *
     * After a successful method call, the SDK triggers the
     * \ref agora::rtc::IRtcEngineEventHandler::onChannelMediaRelayEvent
     *  "onChannelMediaRelayEvent" callback with the
     * #RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL (7) state code.
     *
     * @note
     * Call this method after the
     * \ref startChannelMediaRelay() "startChannelMediaRelay" method to update
     * the destination channel.
     *
     * @param configuration The media stream relay configuration:
     * ChannelMediaRelayConfiguration.
     *
     * @return
     * - 0: Success.
     * - < 0: Failure.
     */
  virtual int updateChannelMediaRelay(const ChannelMediaRelayConfiguration &configuration) = 0;

    /** Stops the media stream relay.
     *
     * Once the relay stops, the host quits all the destination
     * channels.
     *
     * After a successful method call, the SDK triggers the
     * \ref agora::rtc::IRtcEngineEventHandler::onChannelMediaRelayStateChanged
     *  "onChannelMediaRelayStateChanged" callback. If the callback returns
     * #RELAY_STATE_IDLE (0) and #RELAY_OK (0), the host successfully
     * stops the relay.
     *
     * @note
     * If the method call fails, the SDK triggers the
     * \ref agora::rtc::IRtcEngineEventHandler::onChannelMediaRelayStateChanged
     *  "onChannelMediaRelayStateChanged" callback with the
     * #RELAY_ERROR_SERVER_NO_RESPONSE (2) or
     * #RELAY_ERROR_SERVER_CONNECTION_LOST (8) state code. You can leave the
     * channel by calling the \ref leaveChannel() "leaveChannel" method, and
     * the media stream relay automatically stops.
     *
     * @return
     * - 0: Success.
     * - < 0: Failure.
     */
  virtual int stopChannelMediaRelay() = 0;
};

class IRtcEngineParameter {
 public:
  virtual ~IRtcEngineParameter() {}

  /**
   * Releases the resource.
   */
  virtual void release() = 0;

  /** Sets the bool value of the JSON.
  @param key Key name
  @param value Value
  @return

  - 0: Success.
  - < 0: Failure.
  */
  virtual int setBool(const char* key, bool value) = 0;

  /** Sets the int value of the JSON.
  @param key Key name
  @param value Value
  @return

  - 0: Success.
  - < 0: Failure.
  */
  virtual int setInt(const char* key, int value) = 0;

  /** Sets the unsigned int value of the JSON.
  @param key Key name
  @param value Value
  @return

- 0: Success.
- < 0: Failure.
  */
  virtual int setUInt(const char* key, unsigned int value) = 0;

  /** Sets the double value of the JSON.
  @param key Key name
  @param value Value
  @return

- 0: Success.
- < 0: Failure.
  */
  virtual int setNumber(const char* key, double value) = 0;

  /** Sets the string value of the JSON.
  @param key Key name
  @param value Value
  @return

- 0: Success.
- < 0: Failure.
  */
  virtual int setString(const char* key, const char* value) = 0;

  /** Sets the object value of the JSON.
  @param key Key name
  @param value Value
  @return

- 0: Success.
- < 0: Failure.
  */
  virtual int setObject(const char* key, const char* value) = 0;

  /** Gets the bool value of the JSON.
  @param key Key name
  @param value Value
  @return

- 0: Success.
- < 0: Failure.
  */
  virtual int getBool(const char* key, bool& value) = 0;

  /** Gets the int value of the JSON.
  @param key Key name
  @param value Value
  @return

- 0: Success.
- < 0: Failure.
  */
  virtual int getInt(const char* key, int& value) = 0;

  /** Gets the unsigned int value of the JSON.
  @param key Key name
  @param value Value
  @return

- 0: Success.
- < 0: Failure.
  */
  virtual int getUInt(const char* key, unsigned int& value) = 0;

  /** Gets the double value of the JSON.
  @param key Key name
  @param value Value
  @return

- 0: Success.
- < 0: Failure.
  */
  virtual int getNumber(const char* key, double& value) = 0;

  /** Gets the string value of the JSON.
  @param key Key name
  @param value Value
  @return

- 0: Success.
- < 0: Failure.
  */
  virtual int getString(const char* key, agora::util::AString& value) = 0;

  /** Gets a child object value of the JSON.
  @param key Key name
  @param value Value
  @return

- 0: Success.
- < 0: Failure.
  */
  virtual int getObject(const char* key, agora::util::AString& value) = 0;

  /** Gets the array value of the JSON.
  @param key Key name
  @param value Value
  @return

- 0: Success.
- < 0: Failure.
  */
  virtual int getArray(const char* key, agora::util::AString& value) = 0;

  /** Sets the parameters of the SDK or engine.
  @param parameters Parameters
  @return

- 0: Success.
- < 0: Failure.
  */
  virtual int setParameters(const char* parameters) = 0;

  /** Sets the profile to control the RTC engine.
  @param profile Profile
  @param merge
   - True: Merge with the original value.
   - False: Do not merge with the orginal value.
  @return

- 0: Success.
- < 0: Failure.
  */
  virtual int setProfile(const char* profile, bool merge) = 0;

  virtual int convertPath(const char* filePath, agora::util::AString& value) = 0;
};

class AAudioDeviceManager : public agora::util::AutoPtr<IAudioDeviceManager> {
 public:
  AAudioDeviceManager(IRtcEngine* engine) {
    queryInterface(engine, AGORA_IID_AUDIO_DEVICE_MANAGER);
  }
};

class AVideoDeviceManager : public agora::util::AutoPtr<IVideoDeviceManager> {
 public:
  AVideoDeviceManager(IRtcEngine* engine) {
    queryInterface(engine, AGORA_IID_VIDEO_DEVICE_MANAGER);
  }
};

// The following types are either deprecated or not implmented yet.
enum QUALITY_REPORT_FORMAT_TYPE {
  /** 0: The quality report in JSON format,
   */
  QUALITY_REPORT_JSON = 0,
  /** 1: The quality report in HTML format.
   */
  QUALITY_REPORT_HTML = 1,
};

/** Media device states. */
enum MEDIA_DEVICE_STATE_TYPE {
  /** 1: The device is active.
   */
  MEDIA_DEVICE_STATE_ACTIVE = 1,
  /** 2: The device is disabled.
   */
  MEDIA_DEVICE_STATE_DISABLED = 2,
  /** 4: The device is not present.
   */
  MEDIA_DEVICE_STATE_NOT_PRESENT = 4,
  /** 8: The device is unplugged.
   */
  MEDIA_DEVICE_STATE_UNPLUGGED = 8
};

enum VIDEO_PROFILE_TYPE {
  /** 0: 160 x 120  @ 15 fps */      // res       fps
  VIDEO_PROFILE_LANDSCAPE_120P = 0,  // 160x120   15
  /** 2: 120 x 120 @ 15 fps */
  VIDEO_PROFILE_LANDSCAPE_120P_3 = 2,   // 120x120   15
                                        /** 10: 320 x 180 @ 15 fps */
  VIDEO_PROFILE_LANDSCAPE_180P = 10,    // 320x180   15
                                        /** 12: 180 x 180  @ 15 fps */
  VIDEO_PROFILE_LANDSCAPE_180P_3 = 12,  // 180x180   15
                                        /** 13: 240 x 180 @ 15 fps */
  VIDEO_PROFILE_LANDSCAPE_180P_4 = 13,  // 240x180   15
                                        /** 20: 320 x 240 @ 15 fps */
  VIDEO_PROFILE_LANDSCAPE_240P = 20,    // 320x240   15
  /** 22: 240 x 240 @ 15 fps */
  VIDEO_PROFILE_LANDSCAPE_240P_3 = 22,  // 240x240   15
  /** 23: 424 x 240 @ 15 fps */
  VIDEO_PROFILE_LANDSCAPE_240P_4 = 23,  // 424x240   15
  /** 30: 640 x 360 @ 15 fps */
  VIDEO_PROFILE_LANDSCAPE_360P = 30,  // 640x360   15
  /** 32: 360 x 360 @ 15 fps */
  VIDEO_PROFILE_LANDSCAPE_360P_3 = 32,  // 360x360   15
  /** 33: 640 x 360 @ 30 fps */
  VIDEO_PROFILE_LANDSCAPE_360P_4 = 33,  // 640x360   30
  /** 35: 360 x 360 @ 30 fps */
  VIDEO_PROFILE_LANDSCAPE_360P_6 = 35,  // 360x360   30
  /** 36: 480 x 360 @ 15 fps */
  VIDEO_PROFILE_LANDSCAPE_360P_7 = 36,  // 480x360   15
  /** 37: 480 x 360 @ 30 fps */
  VIDEO_PROFILE_LANDSCAPE_360P_8 = 37,  // 480x360   30
  /** 38: 640 x 360 @ 15 fps */
  VIDEO_PROFILE_LANDSCAPE_360P_9 = 38,   // 640x360   15
                                         /** 39: 640 x 360 @ 24 fps */
  VIDEO_PROFILE_LANDSCAPE_360P_10 = 39,  // 640x360   24
  /** 100: 640 x 360 @ 24 fps */
  VIDEO_PROFILE_LANDSCAPE_360P_11 = 100,  // 640x360   24
  /** 40: 640 x 480 @ 15 fps */
  VIDEO_PROFILE_LANDSCAPE_480P = 40,  // 640x480   15
  /** 42: 480 x 480 @ 15 fps */
  VIDEO_PROFILE_LANDSCAPE_480P_3 = 42,  // 480x480   15
  /** 43: 640 x 480 @ 30 fps */
  VIDEO_PROFILE_LANDSCAPE_480P_4 = 43,  // 640x480   30
                                        /** 45: 480 x 480 @ 30 fps */
  VIDEO_PROFILE_LANDSCAPE_480P_6 = 45,  // 480x480   30
  /** 47: 848 x 480 @ 15 fps */
  VIDEO_PROFILE_LANDSCAPE_480P_8 = 47,  // 848x480   15
                                        /** 48: 848 x 480 @ 30 fps */
  VIDEO_PROFILE_LANDSCAPE_480P_9 = 48,  // 848x480   30
  /** 49: 640 x 480 @ 10 fps */
  VIDEO_PROFILE_LANDSCAPE_480P_10 = 49,  // 640x480   10
  /** 50: 1280 x 720 @ 15 fps */
  VIDEO_PROFILE_LANDSCAPE_720P = 50,  // 1280x720  15
  /** 52: 1280 x 720 @ 30 fps */
  VIDEO_PROFILE_LANDSCAPE_720P_3 = 52,  // 1280x720  30
  /** 54: 960 x 720 @ 15 fps */
  VIDEO_PROFILE_LANDSCAPE_720P_5 = 54,  // 960x720   15
  /** 55: 960 x 720 @ 30 fps */
  VIDEO_PROFILE_LANDSCAPE_720P_6 = 55,  // 960x720   30
  /** 60: 1920 x 1080 @ 15 fps */
  VIDEO_PROFILE_LANDSCAPE_1080P = 60,  // 1920x1080 15
  /** 62: 1920 x 1080 @ 30 fps */
  VIDEO_PROFILE_LANDSCAPE_1080P_3 = 62,  // 1920x1080 30
  /** 64: 1920 x 1080 @ 60 fps */
  VIDEO_PROFILE_LANDSCAPE_1080P_5 = 64,  // 1920x1080 60
  /** 66: 2560 x 1440 @ 30 fps */
  VIDEO_PROFILE_LANDSCAPE_1440P = 66,  // 2560x1440 30
  /** 67: 2560 x 1440 @ 60 fps */
  VIDEO_PROFILE_LANDSCAPE_1440P_2 = 67,  // 2560x1440 60
  /** 70: 3840 x 2160 @ 30 fps */
  VIDEO_PROFILE_LANDSCAPE_4K = 70,  // 3840x2160 30
  /** 72: 3840 x 2160 @ 60 fps */
  VIDEO_PROFILE_LANDSCAPE_4K_3 = 72,     // 3840x2160 60
                                         /** 1000: 120 x 160 @ 15 fps */
  VIDEO_PROFILE_PORTRAIT_120P = 1000,    // 120x160   15
                                         /** 1002: 120 x 120 @ 15 fps */
  VIDEO_PROFILE_PORTRAIT_120P_3 = 1002,  // 120x120   15
                                         /** 1010: 180 x 320 @ 15 fps */
  VIDEO_PROFILE_PORTRAIT_180P = 1010,    // 180x320   15
  /** 1012: 180 x 180 @ 15 fps */
  VIDEO_PROFILE_PORTRAIT_180P_3 = 1012,  // 180x180   15
  /** 1013: 180 x 240 @ 15 fps */
  VIDEO_PROFILE_PORTRAIT_180P_4 = 1013,  // 180x240   15
  /** 1020: 240 x 320 @ 15 fps */
  VIDEO_PROFILE_PORTRAIT_240P = 1020,  // 240x320   15
  /** 1022: 240 x 240 @ 15 fps */
  VIDEO_PROFILE_PORTRAIT_240P_3 = 1022,  // 240x240   15
  /** 1023: 240 x 424 @ 15 fps */
  VIDEO_PROFILE_PORTRAIT_240P_4 = 1023,  // 240x424   15
  /** 1030: 360 x 640 @ 15 fps */
  VIDEO_PROFILE_PORTRAIT_360P = 1030,  // 360x640   15
  /** 1032: 360 x 360 @ 15 fps */
  VIDEO_PROFILE_PORTRAIT_360P_3 = 1032,  // 360x360   15
  /** 1033: 360 x 640 @ 30 fps */
  VIDEO_PROFILE_PORTRAIT_360P_4 = 1033,  // 360x640   30
                                         /** 1035: 360 x 360 @ 30 fps */
  VIDEO_PROFILE_PORTRAIT_360P_6 = 1035,  // 360x360   30
  /** 1036: 360 x 480 @ 15 fps */
  VIDEO_PROFILE_PORTRAIT_360P_7 = 1036,  // 360x480   15
  /** 1037: 360 x 480 @ 30 fps */
  VIDEO_PROFILE_PORTRAIT_360P_8 = 1037,  // 360x480   30
                                         /** 1038: 360 x 640 @ 15 fps */
  VIDEO_PROFILE_PORTRAIT_360P_9 = 1038,  // 360x640   15
  /** 1039: 360 x 640 @ 24 fps */
  VIDEO_PROFILE_PORTRAIT_360P_10 = 1039,  // 360x640   24
  /** 1100: 360 x 640 @ 24 fps */
  VIDEO_PROFILE_PORTRAIT_360P_11 = 1100,  // 360x640   24
  /** 1040: 480 x 640 @ 15 fps */
  VIDEO_PROFILE_PORTRAIT_480P = 1040,  // 480x640   15
  /** 1042: 480 x 480 @ 15 fps */
  VIDEO_PROFILE_PORTRAIT_480P_3 = 1042,  // 480x480   15
  /** 1043: 480 x 640 @ 30 fps */
  VIDEO_PROFILE_PORTRAIT_480P_4 = 1043,  // 480x640   30
                                         /** 1045: 480 x 480 @ 30 fps */
  VIDEO_PROFILE_PORTRAIT_480P_6 = 1045,  // 480x480   30
                                         /** 1047: 480 x 848 @ 15 fps */
  VIDEO_PROFILE_PORTRAIT_480P_8 = 1047,  // 480x848   15
  /** 1048: 480 x 848 @ 30 fps */
  VIDEO_PROFILE_PORTRAIT_480P_9 = 1048,  // 480x848   30
  /** 1049: 480 x 640 @ 10 fps */
  VIDEO_PROFILE_PORTRAIT_480P_10 = 1049,  // 480x640   10
  /** 1050: 720 x 1280 @ 15 fps */
  VIDEO_PROFILE_PORTRAIT_720P = 1050,  // 720x1280  15
  /** 1052: 720 x 1280 @ 30 fps */
  VIDEO_PROFILE_PORTRAIT_720P_3 = 1052,  // 720x1280  30
  /** 1054: 720 x 960 @ 15 fps */
  VIDEO_PROFILE_PORTRAIT_720P_5 = 1054,  // 720x960   15
                                         /** 1055: 720 x 960 @ 30 fps */
  VIDEO_PROFILE_PORTRAIT_720P_6 = 1055,  // 720x960   30
  /** 1060: 1080 x 1920 @ 15 fps */
  VIDEO_PROFILE_PORTRAIT_1080P = 1060,    // 1080x1920 15
                                          /** 1062: 1080 x 1920 @ 30 fps */
  VIDEO_PROFILE_PORTRAIT_1080P_3 = 1062,  // 1080x1920 30
                                          /** 1064: 1080 x 1920 @ 60 fps */
  VIDEO_PROFILE_PORTRAIT_1080P_5 = 1064,  // 1080x1920 60
  /** 1066: 1440 x 2560 @ 30 fps */
  VIDEO_PROFILE_PORTRAIT_1440P = 1066,  // 1440x2560 30
  /** 1067: 1440 x 2560 @ 60 fps */
  VIDEO_PROFILE_PORTRAIT_1440P_2 = 1067,  // 1440x2560 60
                                          /** 1070: 2160 x 3840 @ 30 fps */
  VIDEO_PROFILE_PORTRAIT_4K = 1070,       // 2160x3840 30
  /** 1072: 2160 x 3840 @ 60 fps */
  VIDEO_PROFILE_PORTRAIT_4K_3 = 1072,  // 2160x3840 60
  /** Default 640 x 360 @ 15 fps */
  VIDEO_PROFILE_DEFAULT = VIDEO_PROFILE_LANDSCAPE_360P,
};

}  // namespace rtc
}  // namespace agora

/** Gets the SDK version number.

@param build Build number of Agora the SDK.
* @return String of the SDK version.
*/
#define getAgoraRtcEngineVersion getAgoraSdkVersion

////////////////////////////////////////////////////////
/** \addtogroup createAgoraRtcEngine
 @{
 */
////////////////////////////////////////////////////////

/** Creates the RTC engine object and returns the pointer.

* @return Pointer of the RTC engine object.
*/
AGORA_API agora::rtc::IRtcEngine* AGORA_CALL createAgoraRtcEngine();

////////////////////////////////////////////////////////
/** @} */
////////////////////////////////////////////////////////

/** Creates the RTC engine object and returns the pointer.

 @param err Error Code.
* @return Description of the Error Code: agora::ERROR_CODE_TYPE
*/
#define getAgoraRtcEngineErrorDescription getAgoraSdkErrorDescription
#define setAgoraRtcEngineExternalSymbolLoader setAgoraSdkExternalSymbolLoader
