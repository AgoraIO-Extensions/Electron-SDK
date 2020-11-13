//  Agora SDK
//
//  Copyright (c) 2018 Agora.io. All rights reserved.
//

#pragma once  // NOLINT(build/header_guard)

#include "AgoraBase.h"
#include "AgoraOptional.h"

namespace agora {
namespace rtc {
class IRtcConnection;
class ILocalUser;
class IMediaDeviceManager;
class INGAudioDeviceManager;
struct TConnectionInfo;
struct RtcConnectionConfiguration;
class ILocalAudioTrack;
class IMediaPlayer;
class IMediaPlayerSource;
class ICameraCapturer;
class IScreenCapturer;
class IAudioPcmDataSender;
class IAudioEncodedFrameSender;
class IVideoFrameSender;
class IVideoEncodedImageSender;
class IVideoSourceNode;
class IVideoMixerSource;
class IVideoFrameTransceiver;
class ILocalVideoTrack;
class IMediaNodeFactory;
class IRecordingDeviceSource;
class IRtmpStreamingService;
class IMediaPacketSender;
class IExtensionControl;
class IMediaRelayService;

class IRtcEngine;
/**
 * The audio encoder configuration.
 */
struct AudioEncoderConfiguration {
  /**
   * The audio profile: #AUDIO_PROFILE_TYPE
   */
  AUDIO_PROFILE_TYPE audioProfile = AUDIO_PROFILE_DEFAULT;
  // absl::optional<DtxStatus> dtx;
  // double bitrate_priority = 1.0;
  // absl::optional<int> ptime;
  // FEC parameters
  // Rtx parameters
};

}  // namespace rtc

namespace signaling {
class ISignalingEngine;
}

namespace rtm {
class IRtmService;
}

namespace base {
class IEngineBase;

/**
 * The global configurations for \ref agora::base::IAgoraService "AgoraService".
 *
 * Set these configurations when calling \ref agora::base::IAgoraService::initialize "initialize".
 */
struct AgoraServiceConfiguration {
  /**
   * Whether to enable the audio processing module.
   * - `true`: (Default) Enable the audio processing module. Once enabled, the underlying
   * audio processing module is initialized in advance.
   * - `false`: Disable the audio processing module. Set this member as `false` if you
   * do not need audio.
   */
  bool enableAudioProcessor = true;
  /**
   * Whether to enable the audio device module.
   * - `true`: (Default) Enable the audio device module. Once enabled, the underlying
   * audio device module is initialized in advance to support audio
   * recording and playback.
   * - `false`: Disable the audio device module. Set this member as `false` if
   * you do not need to record or play the audio.
   *
   * @note
   * If you set `enableAudioDevice` as `false` and set `enableAudioProcessor` as `true`,
   * you can still pull PCM audio data.
   */
  bool enableAudioDevice = true;
  /**
   * Whether to enable video.
   * - `true`: Enable video. Once enabled, the underlying video engine is
   * initialized in advance.
   * - `false`: (Default) Disable video. Set this parameter as `false` if you
   * do not need video.
   */
  bool enableVideo = false;
  /**
   * The user context. For example, the activity context in Android.
   */
  void* context = nullptr;
  /**
   * The App ID of your project.
   */
  const char* appId = nullptr;
  /**
   * The audio scenario. See \ref agora::rtc::AUDIO_SCENARIO_TYPE "AUDIO_SCENARIO_TYPE". The default value is `AUDIO_SCENARIO_DEFAULT`.
   */
  rtc::AUDIO_SCENARIO_TYPE audioScenario = rtc::AUDIO_SCENARIO_DEFAULT;
  /**
   * The log dir.
   */
  const char* logDir = nullptr;
};
/**
 * The global audio session configurations.
 *
 * Set these configurations when calling \ref agora::base::IAgoraService::setAudioSessionConfiguration "setAudioSessionConfiguration".
 */
struct AudioSessionConfiguration {
  /**
   * Whether to enable audio input (recording) and audio output (playback):
   * - `true`: Enable audio recording and playback.
   * - `false`: Disable audio recording and playback, which prevents audio input
   * and output.
   *
   * @note
   * - For the recording function to work, the user must grant permission for audio recording.
   * - By default, the audio of your app is nonmixable, which means
   * activating audio sessions in your app interrupts other nonmixable audio sessions.
   * To allow mixing, set `allowMixWithOthers` as `true`.
   */
  Optional<bool> playbackAndRecord;
  /**
   * Whether to enable chat mode:
   * - `true`: Enable chat mode. This mode is for apps that are engaged in two-way
   * real-time communication, such as a voice or video chat.
   * - `false`: Disable chat mode.
   *
   * For a video chat, set this member as `true` and set the audio route to the speaker.
   */
  Optional<bool> chatMode;
  /**
   * Whether the audio defaults to the built-in speaker:
   * - `true`: The audio defaults to the built-in speaker.
   * - `false`: The audio does not default to the built-in speaker.
   *
   * @note
   * This member is available only when `playbackAndRecord` is set as `true`.
   */
  Optional<bool> defaultToSpeaker;
  /**
   * Whether to temporarily change the current audio route to the built-in speaker:
   * - `true`: Set the current audio route to the built-in speaker.
   * - `false`: Do not set the current audio route to the built-in speaker.
   *
   * @note
   * This member is available only when the `playbackAndRecord` member is set as `true`.
   */
  Optional<bool> overrideSpeaker;
  /**
   * Whether to mix the audio from this session with the audio from active audio sessions in other apps.
   * - `true`: Mix the audio sessions.
   * - `false`: Do not mix the audio session.
   *
   * @note
   * This member is available only when the `playbackAndRecord` member is set as `true`.
   */
  Optional<bool> allowMixWithOthers;
  /**
   * Whether to allow Bluetooth handsfree devices to appear as available audio input
   * devices:
   * - `true`: Allow Bluetooth handsfree devices to appear as available audio input routes.
   * - `false`: Do not allow Bluetooth handsfree devices to appear as available audio input
   * routes.
   *
   * @note
   * This member is available only when the `playbackAndRecord` member is set as `true`.
   */
  Optional<bool> allowBluetooth;
  /**
   * Whether to allow the audio from this session to be routed to Bluetooth
   * devices that support the Advanced Audio Distribution Profile (A2DP).
   * - `true`: Allow the audio from this session to be routed to Bluetooth devices that
   * support the Advanced Audio Distribution Profile (A2DP).
   * - `false`: Do not allow the audio from this session to be routed to Bluetooth devices that
   * support the Advanced Audio Distribution Profile (A2DP).
   *
   * @note
   * This member is available only when the `playbackAndRecord` member is set as `true`.
   */
  Optional<bool> allowBluetoothA2DP;
  /**
   * The expected audio sample rate (kHz) of this session.
   *
   * The value range is [8, 48]. The actual sample rate may differ based on the audio sampling
   * device in use.
   */
  Optional<double> sampleRate;
  /**
   * The expected input and output buffer duration (ms) of this session.
   *
   * The value range is [0, 93]. The actual I/O buffer duration might be lower
   * than the set value based on the hardware in use.
   */
  Optional<double> ioBufferDuration;
  /**
   * The expected number of input audio channels of this session.
   */
  Optional<int> inputNumberOfChannels;
  /**
   * The expected number of output audio channels of this session.
   */
  Optional<int> outputNumberOfChannels;

  void SetAll(AudioSessionConfiguration& change) {
    SetFrom(&playbackAndRecord, change.playbackAndRecord);
    SetFrom(&chatMode, change.chatMode);
    SetFrom(&defaultToSpeaker, change.defaultToSpeaker);
    SetFrom(&overrideSpeaker, change.overrideSpeaker);
    SetFrom(&allowMixWithOthers, change.allowMixWithOthers);
    SetFrom(&allowBluetooth, change.allowBluetooth);
    SetFrom(&allowBluetoothA2DP, change.allowBluetoothA2DP);
    SetFrom(&sampleRate, change.sampleRate);
    SetFrom(&ioBufferDuration, change.ioBufferDuration);
    SetFrom(&inputNumberOfChannels, change.inputNumberOfChannels);
    SetFrom(&outputNumberOfChannels, change.outputNumberOfChannels);
  }

  bool operator==(const AudioSessionConfiguration& o) const {
    return playbackAndRecord == o.playbackAndRecord && chatMode == o.chatMode &&
           defaultToSpeaker == o.defaultToSpeaker && overrideSpeaker == o.overrideSpeaker &&
           allowMixWithOthers == o.allowMixWithOthers && allowBluetooth == o.allowBluetooth &&
           allowBluetoothA2DP == o.allowBluetoothA2DP && sampleRate == o.sampleRate &&
           ioBufferDuration == o.ioBufferDuration &&
           inputNumberOfChannels == o.inputNumberOfChannels &&
           outputNumberOfChannels == o.outputNumberOfChannels;
  }
  bool operator!=(const AudioSessionConfiguration& o) const { return !(*this == o); }

 private:
  template <typename T>
  static void SetFrom(Optional<T>* s, const Optional<T>& o) {
    if (o) {
      *s = o;
    }
  }
};
/**
 * The audio mixing mode.
 */
enum TMixMode {
  /**
   * Mix all the local audio tracks in the channel.
   */
  MIX_ENABLED,
  /**
   * Do not mix the local audio tracks in the channel.
   */
  MIX_DISABLED,
};
/**
 * The CC (Congestion Control) mode options.
 */
enum TCcMode {
  /**
   * Enable CC mode.
   */
  CC_ENABLED,
  /**
   * Disable CC mode.
   */
  CC_DISABLED,
};

/**
 * The configuration for creating a local video track with an encoded image sender.
 */
struct SenderOptions {
  /**
   * Whether to enable CC mode: #TCcMode.
   */
  TCcMode ccMode;
  /**
   * The codec type used for the encoded images: \ref agora::rtc::VIDEO_CODEC_TYPE "VIDEO_CODEC_TYPE".
   */
  rtc::VIDEO_CODEC_TYPE codecType;

  /**
   * Target bitrate (Kbps) for video encoding.
   *
   * Choose one of the following options:
   *
   * - #STANDARD_BITRATE: (Recommended) Standard bitrate.
   *   - Communication profile: The encoding bitrate equals the base bitrate.
   *   - Live-broadcast profile: The encoding bitrate is twice the base bitrate.
   * - #COMPATIBLE_BITRATE: Compatible bitrate. The bitrate stays the same
   * regardless of the profile.
   *
   * The Communication profile prioritizes smoothness, while the Live Broadcast
   * profile prioritizes video quality (requiring a higher bitrate). Agora
   * recommends setting the bitrate mode as #STANDARD_BITRATE or simply to
   * address this difference.
   *
   * The following table lists the recommended video encoder configurations,
   * where the base bitrate applies to the communication profile. Set your
   * bitrate based on this table. If the bitrate you set is beyond the proper
   * range, the SDK automatically sets it to within the range.

   | Resolution             | Frame Rate (fps) | Base Bitrate (Kbps, for Communication) | Live Bitrate (Kbps, for Live Broadcast)|
   |------------------------|------------------|----------------------------------------|----------------------------------------|
   | 160 &times; 120        | 15               | 65                                     | 130 | 
   |120 &times; 120        | 15               | 50                                     | 100 | 
   | 320 &times; 180        | 15               | 140                                    | 280 | 
   | 180 &times; 180        | 15               | 100                                    | 200 | 
   | 240 &times; 180        | 15               | 120                                    | 240 | 
   | 320 &times; 240        | 15               | 200                                    | 400 | 
   | 240 &times; 240        | 15               | 140                                    | 280 |
   | 424 &times; 240        | 15               | 220                                    | 440 | 
   | 640 &times; 360        | 15               | 400                                    | 800 | 
   | 360 &times; 360        | 15               | 260                                    | 520 | 
   | 640 &times; 360        | 30               | 600                                    | 1200 | 
   | 360 &times; 360        | 30               | 400                                    | 800 | 
   | 480 &times; 360        | 15               | 320                                    | 640 |
   | 480 &times; 360        | 30               | 490                                    | 980 | 
   | 640 &times; 480        | 15               | 500                                    | 1000 | 
   | 480 &times; 480        | 15               | 400                                    | 800 | 
   | 640 &times; 480        | 30               | 750                                    | 1500 |
   | 480 &times; 480        | 30               | 600                                    | 1200 | 
   | 848 &times; 480        | 15               | 610                                    | 1220 | 
   | 848 &times; 480        | 30               | 930                                    | 1860 | 
   | 640 &times; 480        | 10               | 400                                    | 800 |
   | 1280 &times; 720       | 15               | 1130                                   | 2260 | 
   | 1280 &times; 720       | 30               | 1710                                   | 3420 | 
   | 960 &times; 720        | 15               | 910                                    | 1820 |
   | 960 &times; 720        | 30               | 1380                                   | 2760 | 
   | 1920 &times; 1080      | 15               | 2080                                   | 4160 |
   | 1920 &times; 1080      | 30               | 3150                                   | 6300 |
   | 1920 &times; 1080      | 60               | 4780                                   | 6500 | 
   | 2560 &times; 1440      | 30               | 4850                                   | 6500 |
   | 2560 &times; 1440      | 60               | 6500                                   | 6500 | 
   | 3840 &times; 2160      | 30               | 6500                                   | 6500 | 
   | 3840 &times; 2160      | 60               | 6500                                   | 6500 |
   */
  int targetBitrate;

  SenderOptions()
  : ccMode(CC_ENABLED),
    codecType(rtc::VIDEO_CODEC_H264),
    targetBitrate(6500) {}
};

/**
 * The IAgoraService class.
 *
 * `IAgoraService` is the entry point of Agora low-level APIs. Use this interface to
 * create access points to Agora interfaces, including RTC connection, media tracks.
 *
 * You can create an `IAgoraService` object by calling \ref agora::base::IAgoraService::createAgoraService "createAgoraService".
 *
 * You can configure the `IAgoraService` object for different user scenarios on the global level by using `AgoraServiceConfiguration`.
 */
class IAgoraService {
 public:
  /**
   * Initializes the \ref agora::base::IAgoraService "AgoraService" object.
   *
   * @param config The configurations of the initialization. For details, see \ref agora::base::AgoraServiceConfiguration "AgoraServiceConfiguration".
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *   - `ERR_INVALID_ARGUMENT`, if `context` in `AgoraServiceConfiguration` is not provided for
   * Android.
   *   - `ERR_INIT_NET_ENGINE`, if the event engine cannot be initialized. On Windows, the error occurs mostly because the connection to the local port is disabled by the firewall. In this case, turn off the firewall and then turn it on again.
   */
  virtual int initialize(const AgoraServiceConfiguration& config) = 0;

  /**
   * Releases the \ref agora::base::IAgoraService "AgoraService" object.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int release() = 0;

  /**
   * Configures the preset audio scenario.
   *
   * @param scenario The preset audio scenario: \ref agora::rtc::AUDIO_SCENARIO_TYPE
   * "AUDIO_SCENARIO_TYPE".
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setAudioSessionPreset(agora::rtc::AUDIO_SCENARIO_TYPE scenario) = 0;

  /**
   * Customizes the audio session configuration.
   *
   * @param config The reference to the audio session configuration: \ref agora::base::AudioSessionConfiguration "AudioSessionConfiguration".
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setAudioSessionConfiguration(const AudioSessionConfiguration& config) = 0;

  /**
   * Gets the audio session configuration.
   *
   * @param config[out] The pointer to the audio session configuration: \ref agora::base::AudioSessionConfiguration "AudioSessionConfiguration".
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int getAudioSessionConfiguration(AudioSessionConfiguration* config) = 0;

  /**
   * Sets the path and size of the SDK log files.
   *
   * The SDK records all the log data during the SDK runtime in two log files,
   * each with a default size of 512 KB. If you set `fileSize` as 1024 KB,
   * the SDK outputs log files with a maximum size of 2 MB. If the total size
   * of the log files exceeds the set value, the new output log
   * overwrites the old output log.
   *
   * @note
   * To ensure that the output log is complete, call this method immediately after calling
   * the \ref agora::base::IAgoraService::initialize "initialize" method.
   *
   * @param filePath The pointer to the log file. Ensure that the directory of the log file exists and is writable.
   * @param fileSize The size of the SDK log file size (KB).
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setLogFile(const char* filePath, unsigned int fileSize) = 0;
  /**
   * Sets the SDK log output filter.
   *
   * The log level follows the sequence of OFF, CRITICAL, ERROR, WARNING, INFO, and DEBUG.
   *
   * Select a level to output the logs in and above the selected level.
   * For example, if you set the log level to WARNING, you can see the logs in the levels of CRITICAL, ERROR, and WARNING.
   *
   * @param filters The log output filter.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  virtual int setLogFilter(unsigned int filters) = 0;

  /**
   * Creates an \ref agora::rtc::IRtcConnection "RtcConnection" object and returns the pointer.
   *
   * @param cfg The reference to the RTC connection configuration: \ref agora::rtc::RtcConnectionConfiguration "RtcConnectionConfiguration".
   * @return
   * - The pointer to \ref rtc::IRtcConnection "IRtcConnection", if the method call succeeds.
   * - A null pointer, if the method call fails.
   */
  virtual agora_refptr<rtc::IRtcConnection> createRtcConnection(
      const rtc::RtcConnectionConfiguration& cfg) = 0;

  /**
   * Creates a local audio track object and returns the pointer.
   *
   * By default, the audio track is created from the selected audio input device, such as
   * the built-in microphone on a mobile device.
   *
   * @return
   * - The pointer to \ref rtc::ILocalAudioTrack "ILocalAudioTrack", if the method call succeeds.
   * - A null pointer, if the method call fails.
   * - `INVALID_STATE`, if `enableAudioProcessor` in `AgoraServiceConfiguration` is set as `false`.
   */
  virtual agora_refptr<rtc::ILocalAudioTrack> createLocalAudioTrack() = 0;

  /**
   * Creates a local audio track object with a PCM data sender and returns the pointer.
   *
   * Once created, this track can be used to send PCM audio data.
   *
   * @param audioSource The pointer to the PCM audio data sender: \ref agora::rtc::IAudioPcmDataSender "IAudioPcmDataSender".
   * @return
   * - The pointer to \ref rtc::ILocalAudioTrack "ILocalAudioTrack", if the method call succeeds.
   * - A null pointer, if the method call fails.
   * - `INVALID_STATE`, if `enableAudioProcessor` in `AgoraServiceConfiguration` is set as `false`.
   */
  virtual agora_refptr<rtc::ILocalAudioTrack> createCustomAudioTrack(
      agora_refptr<rtc::IAudioPcmDataSender> audioSource) = 0;

  /**
   * Creates a local audio track object with an encoded audio frame sender and returns the pointer.
   *
   * Once created, this track can be used to send encoded audio frames, such as Opus frames.
   *
   * @param audioSource The pointer to the encoded audio frame sender: \ref agora::rtc::IAudioEncodedFrameSender "IAudioEncoderFrameSender".
   * @param mixMode The mixing mode of the encoded audio in the channel: #TMixMode.
   * @return
   * - The pointer to \ref rtc::ILocalAudioTrack "ILocalAudioTrack", if the method call succeeds.
   * - A null pointer, if the method call fails.
   *   - `INVALID_STATE`, if `enableAudioProcessor` is set as `false` in AgoraServiceConfiguration.
   */
  virtual agora_refptr<rtc::ILocalAudioTrack> createCustomAudioTrack(
      agora_refptr<rtc::IAudioEncodedFrameSender> audioSource, TMixMode mixMode) = 0;
/// @cond (!Linux)
  /**
   * Creates a local audio track object with a media packet sender and returns the pointer.
   *
   * Once created, this track can be used to send audio packets, such as customized UDP/RTP packets.
   *
   * @param source The pointer to the media packet sender: \ref agora::rtc::IMediaPacketSender "IMediaPacketSender".
   * @return
   * - The pointer to \ref rtc::ILocalAudioTrack "ILocalAudioTrack", if the method call succeeds.
   * - A null pointer, if the method call fails.
   * - `INVALID_STATE`, if `enableAudioProcessor` is set as `false` in AgoraServiceConfiguration.
  */
  virtual agora_refptr<rtc::ILocalAudioTrack> createCustomAudioTrack(
      agora_refptr<rtc::IMediaPacketSender> source) = 0;
  /// @endcond
  /**
   * Creates a local audio track object with a media player source and returns the pointer.
   *
   * Once created, this track can be used to send PCM audio data decoded from a media player.
   *
   * @param audioSource The pointer to the player source: IMediaPlayerSource.
   * @return
   * - The pointer to \ref rtc::ILocalAudioTrack "ILocalAudioTrack", if the method call succeeds.
   * - A null pointer, if the method call fails.
   * - `INVALID_STATE`, if `enableAudioProcessor` is set as `false` in AgoraServiceConfiguration.
  */
  virtual agora_refptr<rtc::ILocalAudioTrack> createMediaPlayerAudioTrack(
      agora_refptr<rtc::IMediaPlayerSource> audioSource) = 0;

  /**
   * Creates a local audio track object with the recording device source and returns the pointer.
   *
   * Once created, this track can be used to send audio data got from a recording device.
   * @param audioSource The pointer to the recording device source: IRecordingDeviceSource.
   * @return
   * - The pointer to \ref rtc::ILocalAudioTrack "ILocalAudioTrack", if the method call succeeds.
   * - The empty pointer NULL, if the method call fails.
   * - error code if failed
  */
  virtual agora_refptr<rtc::ILocalAudioTrack> createRecordingDeviceAudioTrack(
      agora_refptr<rtc::IRecordingDeviceSource> audioSource) = 0;

  /**
   * Creates an audio device manager object and returns the pointer.
   *
   * @return
   * - The pointer to \ref rtc::INGAudioDeviceManager "INGAudioDeviceManager", if the method call
   * succeeds.
   * - A null pointer, if the method call fails.
   */
  virtual agora_refptr<rtc::INGAudioDeviceManager> createAudioDeviceManager() = 0;

  /**
   * Creates a media node factory object and returns the pointer.
   *
   * @return
   * - The pointer to \ref rtc::IMediaNodeFactory "IMediaNodeFactory", if the method call succeeds.
   * - A null pointer, if the method call fails.
   */
  virtual agora_refptr<rtc::IMediaNodeFactory> createMediaNodeFactory() = 0;

  /**
   * Creates a local video track object with a camera capturer and returns the pointer.
   *
   * Once created, this track can be used to send video data captured by the camera.
   *
   * @param videoSource The pointer to the camera capturer: \ref agora::rtc::ICameraCapturer "ICameraCapturer".
   *
   * @return
   * - The pointer to \ref rtc::ILocalVideoTrack "ILocalVideoTrack", if the method call succeeds.
   * - A null pointer, if the method call fails.
   */
  virtual agora_refptr<rtc::ILocalVideoTrack> createCameraVideoTrack(
      agora_refptr<rtc::ICameraCapturer> videoSource) = 0;

  /**
   * Creates a local video track object with a screen capturer and returns the pointer.
   *
   * Once created, this track can be used to send video data for screen sharing.
   *
   * @param videoSource The pointer to the screen capturer: \ref agora::rtc::IScreenCapturer "IScreenCapturer".
   * @return
   * - The pointer to \ref rtc::ILocalVideoTrack "ILocalVideoTrack", if the method call succeeds.
   * - A null pointer, if the method call fails.
   */
  virtual agora_refptr<rtc::ILocalVideoTrack> createScreenVideoTrack(
      agora_refptr<rtc::IScreenCapturer> videoSource) = 0;

   /**
   * Creates a local video track object with a video mixer and returns the pointer.
   *
   * Once created, this track can be used to send video data processed by the video mixer.
   *
   * @param videoSource The pointer to the video mixer: IVideoMixerSource.
   *
   * @return
   * - The pointer to \ref rtc::ILocalVideoTrack "ILocalVideoTrack", if the method call succeeds.
   * - A null pointer, if the method call fails.
   */
  virtual agora_refptr<rtc::ILocalVideoTrack> createMixedVideoTrack(agora_refptr<rtc::IVideoMixerSource> videoSource) = 0;

  /**
   * Creates a local video track object with a video frame transceiver and returns the pointer.
   *
   * Once created, this track can be used to send video data processed by the transceiver.
   *
   * @param transceiver The pointer to the video transceiver: IVideoFrameTransceiver.
   *
   * @return
   * - The pointer to \ref rtc::ILocalVideoTrack "ILocalVideoTrack", if the method call succeeds.
   * - A null pointer, if the method call fails.
   */
  virtual agora_refptr<rtc::ILocalVideoTrack> createTranscodedVideoTrack(agora_refptr<rtc::IVideoFrameTransceiver> transceiver) = 0;

/// @cond (!RTSA)
  /**
   * Creates a local video track object with a customized video source and returns the pointer.
   *
   * Once created, this track can be used to send video data from a customized source, such as WebRTC.
   *
   * @param videoSource The pointer to the customized video frame sender: \ref agora::rtc::IVideoFrameSender "IVideoFrameSender".
   * @return
   * - The pointer to \ref rtc::ILocalVideoTrack "ILocalVideoTrack", if the method call succeeds.
   * - A null pointer, if the method call fails.
   */
  virtual agora_refptr<rtc::ILocalVideoTrack> createCustomVideoTrack(
      agora_refptr<rtc::IVideoFrameSender> videoSource) = 0;
/// @endcond

  /**
   * Creates a local video track object with an encoded video image sender and returns the
   * pointer.
   *
   * Once created, this track can be used to send encoded video images, such as H.264 or VP8
   * frames.
   *
   * @param videoSource The pointer to the encoded video frame sender: IVideoEncodedImageSender.
   * @param options The configuration for creating video encoded image track.
   *
   * @return
   * - The pointer to \ref rtc::ILocalVideoTrack "ILocalVideoTrack", if the method call succeeds.
   * - A null pointer, if the method call fails.
   */
  virtual agora_refptr<rtc::ILocalVideoTrack> createCustomVideoTrack(
      agora_refptr<rtc::IVideoEncodedImageSender> videoSource,
      SenderOptions& options) = 0;

/// @cond (!Linux)
  /**
   * Creates a local video track object with a media packet sender and returns the pointer.
   *
   * Once created, this track can be used to send video packets, for example, customized UDP/RTP packets.
   *
   * @param source The pointer to the media packet sender: \ref agora::rtc::IMediaPacketSender "IMediaPacketSender".
   * @return
   * - The pointer to \ref rtc::ILocalVideoTrack "ILocalVideoTrack", if the method call succeeds.
   * - A null pointer, if the method call fails.
  */
  virtual agora_refptr<rtc::ILocalVideoTrack> createCustomVideoTrack(
      agora_refptr<rtc::IMediaPacketSender> source) = 0;
/// @endcond
  /**
   * Creates a local video track object with a player source and returns the pointer.
   *
   * Once created, this track can be used to send YUV frames decoded from a player.
   *
   * @param videoSource The pointer to the player source: \ref agora::rtc::IMediaPlayerSource "IMediaPlayerSource".
   * @return
   * - The pointer to \ref rtc::ILocalAudioTrack "ILocalAudioTrack", if the method call succeeds.
   * - A null pointer, if the method call fails.
  */
  virtual agora_refptr<rtc::ILocalVideoTrack> createMediaPlayerVideoTrack(
      agora_refptr<rtc::IMediaPlayerSource> videoSource) = 0;

  /**
   * Creates an RTMP streaming service object and returns the pointer.
   *
   * @param rtcConnection The pointer to \ref rtc::IRtcConnection "IRtcConnection".
   * @param appId The App ID of the live streaming service.
   * @return
   * - The pointer to \ref rtc::IRtmpStreamingService "IRtmpStreamingService", if the method call
   * succeeds.
   * - A null pointer, if the method call fails.
   */
  virtual agora_refptr<rtc::IRtmpStreamingService> createRtmpStreamingService(
      agora_refptr<rtc::IRtcConnection> rtcConnection, const char* appId) = 0;

  /**
   * Creates an Media Relay service object and returns the pointer.
   *
   * @param rtcConnection The pointer to \ref rtc::IRtcConnection "IRtcConnection".
   * @param appId The App ID of the media relay service.
   * @return
   * - The pointer to \ref rtc::IMediaRelayService "IMediaRelayService", if the method call
   * succeeds.
   * - A null pointer, if the method call fails.
   */
  virtual agora_refptr<rtc::IMediaRelayService> createMediaRelayService(
      agora_refptr<rtc::IRtcConnection> rtcConnection, const char* appId) = 0;

  /**
   * Creates an RTM servive object and returns the pointer.
   *
   * @return
   * - The pointer to \ref rtm::IRtmService "IRtmService", if the method call succeeds.
   * - A null pointer, if the method call fails.
   */
  virtual rtm::IRtmService* createRtmService() = 0;

  /**
   * @return
   * - The pointer to \ref agora::rtc::IExtensionControl "IExtensionControl", if the method call succeeds.
   * - A null pointer, if the method call fails.
   */
  virtual rtc::IExtensionControl* getExtensionControl() = 0;

 protected:
  virtual ~IAgoraService() {}
};

}  // namespace base
}  // namespace agora

/** \addtogroup createAgoraService
 @{
 */
/**
 * Creates an \ref agora::base::IAgoraService "IAgoraService" object and returns the pointer.
 *
 * @return
 * - The pointer to \ref agora::base::IAgoraService "IAgoraService", if the method call succeeds.
 * - A null pointer, if the method call fails.
 */
AGORA_API agora::base::IAgoraService* AGORA_CALL createAgoraService();
/** @} */
