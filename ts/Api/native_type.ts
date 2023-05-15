import { PluginInfo } from './plugin';

export type UInt8ArrayBuffer = ArrayBufferLike;

export interface RendererOptions {
  append: boolean;
}

/** screencapture filter window err.
 *
 *
 */
export enum FILT_WINDOW_ERROR {
  /** negative : fail to filter window.
   */
  FILT_WINDOW_ERROR_FAIL = -1,
  /** 0: none define.
   */
  FILT_WINDOW_ERROR_NONE = 0,
}
export interface ScreenCaptureInfo {
  cardType: string;
  errCode: FILT_WINDOW_ERROR;
}

export interface SIZE {
  width: number;
  height: number;
}

/**
 * The image content of the thumbnail or icon.
 *
 * @since v3.5.2
 *
 * @note The default image is in the RGBA format. If you need to use another format, you need to convert the image on
 * your own.
 */
export interface ThumbImageBuffer {
  /**
   * The buffer of the thumbnail or icon.
   */
  buffer: Uint8ArrayBuffer;
  /**
   * The actual width (px) of the thumbnail or icon.
   */
  width: number;
  /**
   * The actual height (px) of the thumbnail or icon.
   */
  height: number;
};
/**
 * The type of the shared target.
 *
 * @since v3.5.2
 */
enum ScreenCaptureSourceType {
  /**
   * -1: Unknown type.
   */
  ScreenCaptureSourceType_Unknown = -1,
  /**
   * 0: The shared target is a window.
   */
  ScreenCaptureSourceType_Window = 0,
  /**
   * 1: The shared target is a screen of a particular monitor.
   */
  ScreenCaptureSourceType_Screen = 1,
  /**
   * 2: Reserved parameter.
   */
  ScreenCaptureSourceType_Custom = 2,
};
/**
 * The information about the specified shareable window or screen.
 *
 * @since v3.5.2
 */
export interface ScreenCaptureSourceInfo {
  /**
   * The type of the shared target. See \ref agora::rtc::ScreenCaptureSourceType "ScreenCaptureSourceType".
   */
  type: ScreenCaptureSourceType;
  /**
   * The window ID for a window or the display ID for a screen.
   */
  sourceId: number;
  /**
   * The name of the window or screen. UTF-8 encoding.
   */
  sourceName: string;
  /**
   * The image content of the thumbnail. See ThumbImageBuffer.
   */
  thumbImage: ThumbImageBuffer;
  /**
   * The image content of the icon. See ThumbImageBuffer.
   */
  iconImage: ThumbImageBuffer;
  /**
   * The process to which the window belongs. UTF-8 encoding.
   */
  processPath: string;
  /**
   * The title of the window. UTF-8 encoding.
   */
  sourceTitle: string;
  /**
   * Determines whether the screen is the primary display:
   * - true: The screen is the primary display.
   * - false: The screen is not the primary display.
   */
  primaryMonitor: boolean;
  /**
   * Determines whether the window is minimized.
   */
  minimizeWindow?: boolean;
};

/**
 * Network quality types:
 *
 * - 0: The network quality is unknown.
 * - 1: The network quality is excellent.
 * - 2: The network quality is quite good, but the bitrate may be slightly
 * lower than excellent.
 * - 3: Users can feel the communication slightly impaired.
 * - 4: Users cannot communicate smoothly.
 * - 5: The network is so bad that users can barely communicate.
 * - 6: The network is down and users cannot communicate at all.
 * - 7: Users cannot detect the network quality.
 * - 8: Detecting the network quality.
 */
export enum AgoraNetworkQuality {
  /** The network quality is unknown. */
  AgoraNetworkQualityUnknown = 0,
  /** The network quality is excellent. */
  AgoraNetworkQualityExcellent = 1,
  /** The network quality is quite good, but the bitrate may be slightly lower than excellent. */
  AgoraNetworkQualityGood = 2,
  /** Users can feel the communication slightly impaired. */
  AgoraNetworkQualityPoor = 3,
  /** Users can communicate only not very smoothly. */
  AgoraNetworkQualityBad = 4,
  /** The network quality is so bad that users can hardly communicate. */
  AgoraNetworkQualityVBad = 5,
  /** The network is disconnected and users cannot communicate at all. */
  AgoraNetworkQualityDown = 6,
  /** Users cannot detect the network quality. (Not in use.) */
  AgoraNetworkQualityUnsupported = 7,
  /** Detecting the network quality. */
  AgoraNetworkQualityDetecting = 8,
}
/**
 * The codec type of the local video：
 * - 0: VP8
 * - 1: (Default) H.264
 */
export enum VIDEO_CODEC_TYPE {
  /** 1: VP8 */
  VIDEO_CODEC_VP8 = 1,
  /** 2: (Default) H.264 */
  VIDEO_CODEC_H264 = 2,
  /** 3: Enhanced VP8 */
  VIDEO_CODEC_EVP = 3,
  /** 4: Enhanced H.264 */
  VIDEO_CODEC_E264 = 4,
}

/**
 * Client roles in the live streaming.
 *
 * - 1: Host.
 * - 2: Audience.
 */
export enum ClientRoleType {
  /** 1: Host. A host can both send and receive streams. */
  CLIENT_ROLE_BROADCASTER = 1,
  /** 2: (Default) Audience. An `audience` member can only receive streams. */
  CLIENT_ROLE_AUDIENCE = 2,
}

/** Video stream types.
 *
 * - 0: High-stream video.
 * - 1: Low-stream video.
 */
export enum StreamType {
  /** 0: High-stream video. */
  REMOTE_VIDEO_STREAM_HIGH = 0,
  /** 1: Low-stream video. */
  REMOTE_VIDEO_STREAM_LOW = 1,
}
/** Media Device Type.
 * - -1: Unknown device type.
 * - 0: Audio playback device.
 * - 1: Audio recording device.
 * - 2: Video renderer.
 * - 3: Video capturer.
 * - 4: Application audio playback device.
 */
export enum MediaDeviceType {
  /** -1: Unknown device type.
   */
  UNKNOWN_AUDIO_DEVICE = -1,
  /** 0: Audio playback device.
   */
  AUDIO_PLAYOUT_DEVICE = 0,
  /** 1: Audio capturing device.
   */
  AUDIO_RECORDING_DEVICE = 1,
  /** 2: Video renderer.
   */
  VIDEO_RENDER_DEVICE = 2,
  /** 3: Video capturer.
   */
  VIDEO_CAPTURE_DEVICE = 3,
  /** 4: Application audio playback device.
   */
  AUDIO_APPLICATION_PLAYOUT_DEVICE = 4,
}
/**
 * The TranscodingUser class.
 */
export interface TranscodingUser {
  /** User ID of the user displaying the video in the CDN live. */
  uid: number;
  /** Horizontal position from the top left corner of the video frame. */
  x: number;
  /** Vertical position from the top left corner of the video frame. */
  y: number;
  /** Width of the video frame. The default value is 360. */
  width: number;
  /** Height of the video frame. The default value is 640. */
  height: number;
  /**
   * Layer position of the video frame. The value ranges between 0 and 100.
   *
   * - 0: (Default) Lowest.
   * - 100: Highest.
   */
  zOrder: number;
  /**
   * Transparency of the video frame in CDN live.
   * The value ranges between 0 and 1:
   *
   * - 0: Completely transparent.
   * - 1: (Default) Opaque.
   */
  alpha: number;
  /** The audio channel of the sound.
   * - 0: (Default) Supports dual channels at most, depending on the upstream
   * of the host.
   * - 1: The audio stream of the host uses the FL audio channel.
   * If the upstream of the host uses multiple audio channels,
   * these channels will be mixed into mono first.
   * - 2: The audio stream of the host uses the FC audio channel.
   * If the upstream of the host uses multiple audio channels,
   * these channels will be mixed into mono first.
   * - 3: The audio stream of the host uses the FR audio channel.
   * If the upstream of the host uses multiple audio channels,
   * these channels will be mixed into mono first.
   * - 4: The audio stream of the host uses the BL audio channel.
   * If the upstream of the host uses multiple audio channels,
   * these channels will be mixed into mono first.
   * - 5: The audio stream of the host uses the BR audio channel.
   * If the upstream of the host uses multiple audio channels,
   * these channels will be mixed into mono first.
   */
  audioChannel: number;
}

export interface RtcImage {
  /**
   * HTTP/HTTPS URL address of the image on the broadcasting video.
   *
   * The maximum length of this parameter is 1024 bytes.
   */
  url: string;
  /** Horizontal position of the image from the upper left of the
   * broadcasting video.
   */
  x: number;
  /** Vertical position of the image from the upper left of the broadcasting
   * video.
   */
  y: number;
  /** Width of the image on the broadcasting video. */
  width: number;
  /** Height of the image on the broadcasting video. */
  height: number;
  /**
   * The layer number of the watermark or background image. The value range is
   * [0,255]:
   * - `0`: (Default) The bottom layer.
   * - `255`: The top layer.
   *
   * @since v3.6.1.4
   */
  zOrder: number;
  /** The transparency of the watermark or background image. The value range is [0.0,1.0]:
   * - `0.0`: Completely transparent.
   * - `1.0`: (Default) Opaque.
   *
   * @since v3.6.1.4
   */
  alpha: number;
}
/**
 * Sets the CDN live audio/video transcoding settings.
 */
export interface TranscodingConfig {
  /**
   * Width of the video. The default value is 360.
   *
   * When pushing video streams to the CDN, the value range of `width` is
   * [64,1920]. If the value is less than 64, Agora server automatically adjusts
   * it to 64; if the value is greater than 1920, Agora server automatically
   * adjusts it to 1920.
   *
   * When pushing audio streams to the CDN, set the value of width x height to
   * 0 x 0 (px).
   */
  width: number;
  /**
   * Height of the video. The default value is 640.
   *
   * When pushing video streams to the CDN, the value range of `height` is
   * [64,1080]. If the value is less than 64, Agora server automatically adjusts
   * it to 64; if the value is greater than 1080, Agora server automatically
   * adjusts it to 1080.
   *
   * When pushing audio streams to the CDN, set the value of width x height to
   * 0 x 0 (px).
   */
  height: number;
  /**
   * Bitrate of the CDN live output video stream.
   * The default value is 400 Kbps.
   *
   * Set this parameter according to the Video Bitrate Table.
   *
   * If you set a bitrate beyond the proper range, the SDK automatically
   * adapts it to a value within the range.
   */
  videoBitrate: number;
  /**
   * Frame rate (fps) of the CDN live output video stream.
   * The value range is (0, 30]. The default value is 15.
   *
   * **Note**: Agora adjusts all values over 30 to 30.
   */
  videoFrameRate: number;
  /**
   * Latency mode.
   * - true: Low latency with unassured quality.
   * - false: (Default) High latency with assured quality.
   */
  lowLatency: boolean;
  /**
   * Video GOP in frames. The default value is 30 fps.
   */
  videoGop: number;
  /** Self-defined video codec profile.
   * - VIDEO_CODEC_PROFILE_BASELINE = 66: Baseline video codec profile.
   * Generally used in video calls on mobile phones.
   * - VIDEO_CODEC_PROFILE_MAIN = 77: Main video codec profile.
   * Generally used in mainstream electronics, such as MP4 players, portable
   * video players, PSP, and iPads.
   * - VIDEO_CODEC_PROFILE_HIGH = 100: (Default) High video codec profile.
   * Generally used in high-resolution broadcasts or television.
   */
  videoCodecProfile: number;
  /**
   * The background color in RGB hex value. Value only, do not include a #.
   * For example, 0xFFB6C1 (light pink). The default value is 0x000000 (black).
   */
  backgroundColor: number;
  /**
   * The video codec type of the output video stream. See {@link VIDEO_CODEC_TYPE_FOR_STREAM}.
   */
  videoCodecType?: VIDEO_CODEC_TYPE_FOR_STREAM;
  /** Self-defined audio-sample rate:
   * - AUDIO_SAMPLE_RATE_32000 = 32000 Hz
   * - AUDIO_SAMPLE_RATE_44100 = (Default)44100 Hz
   * - AUDIO_SAMPLE_RATE_48000 = 48000 Hz
   */
  audioSampleRate: number;
  /**
   * Agora's self-defined audio-channel types.
   *
   * We recommend choosing option 1 or 2.
   *
   * A special player is required if you choose option 3, 4, or 5:
   * - 1: (Default) Mono.
   * - 2: Two-channel stereo.
   * - 3: Three-channel stereo.
   * - 4: Four-channel stereo.
   * - 5: Five-channel stereo.
   */
  audioChannels: number;
  /** Bitrate of the CDN live audio output stream. The default value is 48
   * Kbps, and the highest value is 128.
   */
  audioBitrate: number;
  /**
   * The reserved property.
   *
   * Extra user-defined information to send SEI for the H.264 or H.265 stream
   * to the CDN streaming client. The maximum length is 4096 bytes.
   *
   * See [SEI-related FAQ](https://docs.agora.io/en/faq/sei) for more details.
   */
  transcodingExtraInfo: string;
  /** The watermark image added to the CDN live publishing stream. */
  watermark: RtcImage[];
  /**
   * @since v3.2.0
   *
   * The background image added to the CDN live publishing stream.
   *
   * Once a background image is added, the audience of the CDN live publishing
   * stream can see the background image.
   */
  backgroundImage: RtcImage[];

  /** The TranscodingUsers Array. */
  transcodingUsers: TranscodingUser[];

  /** Self-defined audio codec profile: #AUDIO_CODEC_PROFILE_TYPE.
   */
  audioCodecProfile?: AUDIO_CODEC_PROFILE_TYPE;
  /** Advanced features of the RTMP or RTMPS streaming with transcoding. See
   * LiveStreamAdvancedFeature.
   *
   * @since v3.1.0
   */
  advancedFeatures?: LiveStreamAdvancedFeature[];
}
/**
 * Configurations of the last-mile network probe test.
 */
export interface LastmileProbeConfig {
  /**
   * Sets whether or not to test the uplink network. Some users, for example,
   * the audience in a Live-broadcast channel, do not need such a test.
   *
   * - true: test
   * - false: do not test
   */
  probeUplink: boolean;
  /**
   * Sets whether or not to test the downlink network.
   *
   * - true: test
   * - false: do not test
   */
  probeDownlink: boolean;
  /**
   * The expected maximum sending bitrate (bps) of the local user.
   * The value ranges between 100000 and 5000000.
   */
  expectedUplinkBitrate: number;
  /**
   * The expected maximum receiving bitrate (bps) of the local user.
   * The value ranges between 100000 and 5000000.
   */
  expectedDownlinkBitrate: number;
}
/** The one-way last-mile probe result. */
export interface LastmileProbeOneWayResult {
  /** The packet loss rate (%). */
  packetLossRate: number;
  /** The network jitter (ms). */
  jitter: number;
  /** The estimated available bandwidth (Kbps). */
  availableBandwidth: number;
}
/** The uplink and downlink last-mile network probe test result. */
export interface LastmileProbeResult {
  /** States of the last-mile network probe test.
   *
   * - 1: The last-mile network probe test is complete.
   * - 2: The last-mile network probe test is incomplete and the bandwidth
   * estimation is not available, probably due to limited test resources.
   * - 3: The last-mile network probe test is not carried out, probably due
   * to poor network conditions.
   */
  state: number;
  /**
   * The uplink last-mile network probe test result.
   * See {@link LastmileProbeOneWayResult}.
   */
  uplinkReport: LastmileProbeOneWayResult;
  /** The downlink last-mile network probe test result.
   * See {@link LastmileProbeOneWayResult}.
   */
  downlinkReport: LastmileProbeOneWayResult;
  /** The round-trip delay time (ms). */
  rtt: number;
}
/** The user information. */
export interface UserInfo {
  /** The user ID. */
  uid: number;
  /** The user account.
   *
   * The maximum length of this parameter is 255 bytes.
   *
   * Ensure that you set this parameter and do not set it as null.
   */
  userAccount: string;
}

/**
 * @deprecated Deprecated from v3.2.0.
 *
 * Local voice changer options.
 */
export enum VoiceChangerPreset {
  /**
   * The original voice (no local voice change).
   */
  VOICE_CHANGER_OFF = 0x00000000, //Turn off the voice changer
  /**
   * The voice of an old man.
   */
  VOICE_CHANGER_OLDMAN = 0x00000001,
  /**
   * The voice of a little boy.
   */
  VOICE_CHANGER_BABYBOY = 0x00000002,
  /**
   * The voice of a little girl.
   */
  VOICE_CHANGER_BABYGIRL = 0x00000003,
  /**
   * The voice of Zhu Bajie, a character in Journey to the West who has a voice like that of a growling bear.
   */
  VOICE_CHANGER_ZHUBAJIE = 0x00000004,
  /**
   * The ethereal voice.
   */
  VOICE_CHANGER_ETHEREAL = 0x00000005,
  /**
   * The voice of Hulk.
   */
  VOICE_CHANGER_HULK = 0x00000006,
  /**
   * A more vigorous voice.
   */
  VOICE_BEAUTY_VIGOROUS = 0x00100001, //7,
  /**
   * A deeper voice.
   */
  VOICE_BEAUTY_DEEP = 0x00100002,
  /**
   * A mellower voice.
   */
  VOICE_BEAUTY_MELLOW = 0x00100003,
  /**
   * Falsetto.
   */
  VOICE_BEAUTY_FALSETTO = 0x00100004,
  /**
   * A fuller voice.
   */
  VOICE_BEAUTY_FULL = 0x00100005,
  /**
   * A clearer voice.
   */
  VOICE_BEAUTY_CLEAR = 0x00100006,
  /**
   * A more resounding voice.
   */
  VOICE_BEAUTY_RESOUNDING = 0x00100007,
  /**
   * A more ringing voice.
   */
  VOICE_BEAUTY_RINGING = 0x00100008,
  /**
   * A more spatially resonant voice.
   */
  VOICE_BEAUTY_SPACIAL = 0x00100009,
  /**
   * (For male only) A more magnetic voice. Do not use it when the speaker is a female; otherwise, voice distortion occurs.
   */
  GENERAL_BEAUTY_VOICE_MALE_MAGNETIC = 0x00200001,
  /**
   * (For female only) A fresher voice. Do not use it when the speaker is a male; otherwise, voice distortion occurs.
   */
  GENERAL_BEAUTY_VOICE_FEMALE_FRESH = 0x00200002,
  /**
   * (For female only) A more vital voice. Do not use it when the speaker is a male; otherwise, voice distortion occurs.
   */
  GENERAL_BEAUTY_VOICE_FEMALE_VITALITY = 0x00200003,
}

/** The video codec type of the output video stream. */
export enum VIDEO_CODEC_TYPE_FOR_STREAM {
  /**
   * 1: (Default) H.264
   */
  VIDEO_CODEC_H264_FOR_STREAM = 1,
  /**
   * 2: H.265
   */
  VIDEO_CODEC_H265_FOR_STREAM = 2,
}

/** @deprecated Deprecated from v3.2.0.
 *
 *  Local voice reverberation presets.
 */
export enum AudioReverbPreset {
  /**
   * Turn off local voice reverberation, that is, to use the original voice.
   */
  AUDIO_REVERB_OFF = 0x00000000, // Turn off audio reverb
  /**
   * The reverberation style typical of a KTV venue (enhanced).
   */
  AUDIO_REVERB_FX_KTV = 0x00100001,
  /**
   * The reverberation style typical of a concert hall (enhanced).
   */
  AUDIO_REVERB_FX_VOCAL_CONCERT = 0x00100002,
  /**
   * The reverberation style typical of an uncle's voice.
   */
  AUDIO_REVERB_FX_UNCLE = 0x00100003,
  /**
   * The reverberation style typical of a little sister's voice.
   */
  AUDIO_REVERB_FX_SISTER = 0x00100004,
  /**
   * The reverberation style typical of a recording studio (enhanced).
   */
  AUDIO_REVERB_FX_STUDIO = 0x00100005,
  /**
   * The reverberation style typical of popular music (enhanced).
   */
  AUDIO_REVERB_FX_POPULAR = 0x00100006,
  /**
   * The reverberation style typical of R&B music (enhanced).
   */
  AUDIO_REVERB_FX_RNB = 0x00100007,
  /**
   * The reverberation style typical of the vintage phonograph.
   */
  AUDIO_REVERB_FX_PHONOGRAPH = 0x00100008,
  /**
   * The reverberation style typical of popular music.
   */
  AUDIO_REVERB_POPULAR = 0x00000001,
  /**
   * The reverberation style typical of R&B music.
   */
  AUDIO_REVERB_RNB = 0x00000002,
  /**
   * The reverberation style typical of rock music.
   */
  AUDIO_REVERB_ROCK = 0x00000003,
  /**
   * The reverberation style typical of hip-hop music.
   */
  AUDIO_REVERB_HIPHOP = 0x00000004,
  /**
   * The reverberation style typical of a concert hall.
   */
  AUDIO_REVERB_VOCAL_CONCERT = 0x00000005,
  /**
   * The reverberation style typical of a KTV venue.
   */
  AUDIO_REVERB_KTV = 0x00000006,
  /**
   * The reverberation style typical of a recording studio.
   */
  AUDIO_REVERB_STUDIO = 0x00000007,
  /**
   * The reverberation of the virtual stereo. The virtual stereo is an effect that renders the monophonic
   * audio as the stereo audio, so that all users in the channel can hear the stereo voice effect.
   * To achieve better virtual stereo reverberation, Agora recommends setting `profile` in `setAudioProfile`
   * as `5`.
   */
  AUDIO_VIRTUAL_STEREO = 0x00200001,
}
/** The brightness level of the video image captured by the local camera.
 *
 * @since v3.3.1
 */
export enum CAPTURE_BRIGHTNESS_LEVEL_TYPE {
  /** -1: The SDK does not detect the brightness level of the video image.
   * Wait a few seconds to get the brightness level from
   * `CAPTURE_BRIGHTNESS_LEVEL_TYPE` in the next callback.
   */
  CAPTURE_BRIGHTNESS_LEVEL_INVALID = -1,
  /** 0: The brightness level of the video image is normal.
   */
  CAPTURE_BRIGHTNESS_LEVEL_NORMAL = 0,
  /** 1: The brightness level of the video image is too bright.
   */
  CAPTURE_BRIGHTNESS_LEVEL_BRIGHT = 1,
  /** 2: The brightness level of the video image is too dark.
   */
  CAPTURE_BRIGHTNESS_LEVEL_DARK = 2,
}
/**
 * Configuration of the imported live streaming voice or video stream.
 */
export interface InjectStreamConfig {
  /**
   * Width of the added stream in the live streaming.
   *
   * The default value is 0 pixel (same width as the original stream).
   */
  width: number;
  /**
   * Height of the added stream in the live streaming.
   *
   * The default value is 0 pixel (same height as the original stream).
   */
  height: number;
  /**
   * Video bitrate of the added stream in the live streaming.
   *
   * The default value is 400 Kbps.
   */
  videoBitrate: number;
  /** Video frame rate of the added stream in the live streaming.
   *
   * The default value is 15 fps.
   */
  videoFramerate: number;
  /** Video GOP of the added stream in the live streaming in frames.
   *
   * The default value is 30 fps.
   */
  videoGop: number;
  /**
   * Audio-sampling rate of the added stream in the live streaming.
   *
   * The default value is 44100 Hz.
   *
   * **Note**: Agora recommends setting the default value.
   * - AUDIO_SAMPLE_RATE_32000 = 32000 Hz
   * - AUDIO_SAMPLE_RATE_44100 = 44100 Hz
   * - AUDIO_SAMPLE_RATE_48000 = 48000 Hz
   */
  audioSampleRate: number;
  /**
   * Audio bitrate of the added stream in the live streaming.
   *
   * The default value is 48 Kbps.
   *
   * **Note**: Agora recommends setting the default value.
   */
  audioBitrate: number;
  /** Audio channels in the live streaming.
   * - 1: (Default) Mono
   * - 2: Two-channel stereo
   *
   * **Note**: Agora recommends setting the default value.
   */
  audioChannels: number;
}
/**
 * The priority of the remote user.
 */
export enum Priority {
  /** 50: The user's priority is high. */
  PRIORITY_HIGH = 50,
  /** 100: (Default) The user's priority is normal. */
  PRIORITY_NORMAL = 100,
}
/**
 * Statistics of the channel.
 */
export interface RtcStats {
  /** Call duration (s), represented by an aggregate value. */
  duration: number;
  /** Total number of bytes transmitted, represented by an aggregate value. */
  txBytes: number;
  /** Total number of bytes received, represented by an aggregate value. */
  rxBytes: number;
  /** Transmission bitrate (Kbps), represented by an instantaneous value. */
  txKBitRate: number;
  /** Receive bitrate (Kbps), represented by an instantaneous value. */
  rxKBitRate: number;
  /** Audio receive bitrate (Kbps), represented by an instantaneous value. */
  rxAudioKBitRate: number;
  /** Audio transmission bitrate (Kbps), represented by an instantaneous
   * value.
   */
  txAudioKBitRate: number;
  /** Video receive bitrate (Kbps), represented by an instantaneous value. */
  rxVideoKBitRate: number;
  /** Video transmission bitrate (Kbps), represented by an instantaneous
   * value.
   */
  txVideoKBitRate: number;
  /**
   * @since 2.9.0
   *
   * Total number of audio bytes received (bytes), represented by an aggregate
   * value.
   */
  rxAudioKBytes: number;
  /**
   * @since 2.9.0
   *
   * Total number of audio bytes sent (bytes), represented by an aggregate
   * value.
   */
  txAudioKBytes: number;
  /**
   * @since 2.9.0
   *
   * Total number of video bytes received (bytes), represented by an aggregate
   * value.
   */
  rxVideoKBytes: number;
  /**
   * @since 2.9.0
   *
   * Total number of video bytes sent (bytes), represented by an aggregate
   * value.
   */
  txVideoKBytes: number;
  /** Client-server latency. */
  lastmileDelay: number;
  /** The packet loss rate (%) from the local client to Agora's edge server,
   * before using the anti-packet-loss method.
   */
  txPacketLossRate: number;
  /** The packet loss rate (%) from Agora's edge server to the local client,
   * before using the anti-packet-loss method.
   */
  rxPacketLossRate: number;
  /** Number of users in the channel. */
  userCount: number;
  /** Application CPU usage (%). */
  cpuAppUsage: number;
  /** System CPU usage (%). */
  cpuTotalUsage: number;
  /**
   * @since v3.0.0
   *
   * The round-trip time delay from the client to the local router.
   */
  gatewayRtt: number;
  /**
   * @since v3.0.0
   *
   * The memory usage ratio of the app (%).
   *
   * This value is for reference only. Due to system limitations, you may not
   * get the value of this member.
   */
  memoryAppUsageRatio: number;
  /**
   * @since v3.0.0
   *
   * The memory usage ratio of the system (%).
   *
   * This value is for reference only. Due to system limitations, you may not
   * get the value of this member.
   */
  memoryTotalUsageRatio: number;
  /**
   * @since v3.0.0
   *
   * The memory usage of the app (KB).
   *
   * This value is for reference only. Due to system limitations, you may not
   * get the value of this member.
   */
  memoryAppUsageInKbytes: number;
}
/** Quality change of the local video. */
export enum QualityAdaptIndication {
  /** 0: The quality of the local video stays the same. */
  ADAPT_NONE = 0,
  /** 1: The quality improves because the network bandwidth increases. */
  ADAPT_UP_BANDWIDTH = 1,
  /** 2: The quality worsens because the network bandwidth decreases. */
  ADAPT_DOWN_BANDWIDTH = 2,
}
/** Statistics of the local video. */
export interface LocalVideoStats {
  /** Bitrate (Kbps) sent in the reported interval, which does not include
   * the bitrate of the re-transmission video after packet loss.
   */
  sentBitrate: number;
  /** Frame rate (fps) sent in the reported interval, which does not include
   * the frame rate of the re-transmission video after packet loss.
   */
  sentFrameRate: number;
  /** The encoder output frame rate (fps) of the local video. */
  encoderOutputFrameRate: number;
  /** The renderer output frame rate (fps) of the local video. */
  rendererOutputFrameRate: number;
  /** The target bitrate (Kbps) of the current encoder.
   *
   * This value is estimated by the SDK based on the current network
   * conditions.
   */
  targetBitrate: number;
  /** The target frame rate (fps) of the current encoder. */
  targetFrameRate: number;
  /** Quality change of the local video in terms of target frame rate and
   * target bit rate in this reported interval.
   * See {@link QualityAdaptIndication}.
   */
  qualityAdaptIndication: QualityAdaptIndication;
  /**
   * @since 2.9.0
   *
   * The encoding bitrate (Kbps), which does not include the bitrate of the
   * retransmission video after packet loss.
   */
  encodedBitrate: number;
  /**
   * @since 2.9.0
   *
   * The width of the encoding frame (px).
   */
  encodedFrameWidth: number;
  /**
   * @since 2.9.0
   *
   * The height of the encoding frame (px).
   */
  encodedFrameHeight: number;
  /**
   * @since 2.9.0
   *
   * The value of the sent frames, represented by an aggregate value.
   */
  encodedFrameCount: number;
  /**
   * @since 2.9.0
   *
   * The codec type of the local video. See {@link VIDEO_CODEC_TYPE}.
   */
  codecType: number;
  /** The video packet loss rate (%) from the local client to the Agora edge
   * server before applying the anti-packet loss strategies.
   *
   * @since v3.2.0
   */
  txPacketLossRate: number;
  /** The capture frame rate (fps) of the local video.
   *
   * @since v3.2.0
   */
  captureFrameRate: number;
  /** The brightness level of the video image captured by the local camera.
   * See {@link CAPTURE_BRIGHTNESS_LEVEL_TYPE}.
   *
   * @since v3.3.1
   */
  captureBrightnessLevel: CAPTURE_BRIGHTNESS_LEVEL_TYPE;
}
/**
 * The statistics of the local audio stream.
 */
export interface LocalAudioStats {
  /**
   * The number of channels.
   */
  numChannels: number;
  /**
   * The sample rate (Hz).
   */
  sentSampleRate: number;
  /**
   * The average sending bitrate (Kbps).
   */
  sentBitrate: number;
  /**
   * The audio packet loss rate (%) from the local client to the Agora edge
   * server before applying the anti-packet loss strategies.
   *
   * @since v3.2.0
   */
  txPacketLossRate: number;
}
/** VideoEncoderConfiguration */
export interface VideoEncoderConfiguration {
  /** Width (pixels) of the video.
   *
   * The default value is 640(width) x 360(hight).
   */
  width: number;
  /** Height (pixels) of the video.
   *
   * The default value is 640(width) x 360(hight).
   */
  height: number;
  /**
   * The frame rate (fps) of the video.
   *
   * The default value is 15 fps.
   *
   * **Noete**:
   * We do not recommend setting this to a value greater than 30 fps.
   */
  frameRate: number;
  /**
   * The minimum frame rate of the video.
   *
   * The default value is -1.
   */
  minFrameRate: number;
  /** The video encoding bitrate (Kbps).
   *
   * Set your bitrate based on the following table. If you set a bitrate
   * beyond the proper range, the SDK automatically sets it to within the
   * range.
   *
   * You can also choose one of the following bitrate options:
   * - `0`: (Recommended) The standard bitrate.
   *  - The communication(`0`) profile: the encoding bitrate equals the base
   * bitrate.
   *  - The `1` (live streaming) profile: the encoding bitrate is twice the base
   * bitrate.
   * - `-1`: The compatible bitrate.
   *  - The communication(`0`) profile: the encoding bitrate equals the base
   * bitrate.
   *  - The `1` (live streaming) profile: the encoding bitrate equals the base
   * bitrate.
   *
   * The communication(`0`) profile prioritizes smoothness, while the
   * `1` (live streaming) profile prioritizes video quality
   * (requiring a higher bitrate). We recommend setting the bitrate mode as
   * `0` to address this difference.
   *
   * The following table lists the recommended video encoder configurations.
   *
   * | Resolution             | Frame Rate (fps) | Base Bitrate (Kbps)   |
   * |------------------------|------------------|-----------------------|
   * | 160 * 120              | 15               | 65                    |
   * | 120 * 120              | 15               | 50                    |
   * | 320 * 180              | 15               | 140                   |
   * | 180 * 180              | 15               | 100                   |
   * | 240 * 180              | 15               | 120                   |
   * | 320 * 240              | 15               | 200                   |
   * | 240 * 240              | 15               | 140                   |
   * | 424 * 240              | 15               | 220                   |
   * | 640 * 360              | 15               | 400                   |
   * | 360 * 360              | 15               | 260                   |
   * | 640 * 360              | 30               | 600                   |
   * | 360 * 360              | 30               | 400                   |
   * | 480 * 360              | 15               | 320                   |
   * | 480 * 360              | 30               | 490                   |
   * | 640 * 480              | 15               | 500                   |
   * | 480 * 480              | 15               | 400                   |
   * | 640 * 480              | 30               | 750                   |
   * | 480 * 480              | 30               | 600                   |
   * | 848 * 480              | 15               | 610                   |
   * | 848 * 480              | 30               | 930                   |
   * | 640 * 480              | 10               | 400                   |
   * | 1280 * 720             | 15               | 1130                  |
   * | 1280 * 720             | 30               | 1710                  |
   * | 960 * 720              | 15               | 910                   |
   * | 960 * 720              | 30               | 1380                  |
   * | 1920 * 1080            | 15               | 2080                  |
   * | 1920 * 1080            | 30               | 3150                  |
   * | 1920 * 1080            | 60               | 4780                  |
   *
   */
  bitrate: number;
  /**
   * The minimum encoding bitrate (Kbps).
   *
   * The default value is 1 kbps.
   *
   * Using a value greater than the default value
   * forces the video encoder to output high-quality images but may cause more
   * packet loss and hence sacrifice the smoothness of the video transmission.
   * That said, unless you have special requirements for image quality,
   * Agora does not recommend changing this value.
   *
   */
  minBitrate: number;
  /**
   * The orientation mode. See {@link OrientationMode}.
   */
  orientationMode: OrientationMode;
  /**
   * The video encoding degradation preference under limited bandwidth.
   * See {@link DegradationPreference}.
   */
  degradationPreference: DegradationPreference;
  /**
   * @since v3.0.0
   *
   * Sets the mirror mode of the published local video stream. It only affects
   * the video that the remote user sees. See {@link VideoMirrorModeType}
   *
   * @note The SDK disables the mirror mode by default.
   */
  mirrorMode: VideoMirrorModeType;
}
/**
 * The type of video mirror mode.
 */
export enum VideoMirrorModeType {
  /**
   * `0`: (Default) The SDK determines whether enable the mirror mode.
   */
  AUTO = 0,
  /**
   * `1`: Enable mirror mode.
   */
  ENABLED = 1,
  /**
   * `2`: Disable mirror mode.
   */
  DISABLED = 2,
}

/** Video degradation preferences under limited bandwidth. */
export enum DegradationPreference {
  /** 0: (Default) Prefers to reduce the video frame rate while maintaining
   * video quality during video encoding under limited bandwidth. This
   * degradation preference is suitable for scenarios where video quality is
   * prioritized.
   *
   * @note In the `COMMUNICATION` channel profile, the resolution of the video
   * sent may change, so remote users need to handle this issue.
   * See `videoSizeChanged`.
   */
  MAINTAIN_QUALITY = 0,
  /** 1: Prefers to reduce the video quality while maintaining the video frame
   * rate during video encoding under limited bandwidth. This degradation
   * preference is suitable for scenarios where smoothness is prioritized and
   * video quality is allowed to be reduced.
   */
  MAINTAIN_FRAMERATE = 1,
  /** 2: Reduces the video frame rate and video quality simultaneously during
   * video encoding under limited bandwidth. `MAINTAIN_BALANCED` has a lower
   * reduction than `MAINTAIN_QUALITY` and `MAINTAIN_FRAMERATE`, and this
   * preference is suitable for scenarios where both smoothness and video
   * quality are a priority.
   *
   * @note The resolution of the video sent may change, so remote users need
   * to handle this issue.
   * See `videoSizeChanged`.
   */
  MAINTAIN_BALANCED = 2,
}
/** The orientation mode. */
export enum OrientationMode {
  /**
   * 0: (Default) The output video always follows the orientation of the
   * captured video, because the receiver takes the rotational information
   * passed on from the video encoder.
   *
   * Mainly used between Agora SDK.
   * - If the captured video is in landscape mode, the output video is in
   * landscape mode.
   * - If the captured video is in portrait mode, the output video is in
   * portrait mode.
   */
  ORIENTATION_MODE_ADAPTIVE = 0,
  /**
   * 1: The output video is always in landscape mode.
   *
   * If the captured video is
   * in portrait mode, the video encoder crops it to fit the output. Applies to
   * situations where the receiving end cannot process the rotational
   * information.
   *
   * For example, Media Push.
   */
  ORIENTATION_MODE_FIXED_LANDSCAPE = 1,
  /**
   * 2: The output video is always in portrait mode.
   *
   * If the captured video is in landscape mode, the video encoder crops it to
   * fit the output. Applies to situations where the receiving end cannot process
   * the rotational information.
   *
   * For example, Media Push.
   */
  ORIENTATION_MODE_FIXED_PORTRAIT = 2,
}
/**
 * Video statistics of the remote stream.
 */
export interface RemoteVideoStats {
  /** User ID of the user sending the video streams. */
  uid: number;
  /**
   * @deprecated This parameter is deprecated.
   * Time delay (ms).
   */
  delay: number;
  /** Width (pixels) of the remote video. */
  width: number;
  /** Height (pixels) of the remote video. */
  height: number;
  /** Bitrate (Kbps) received in the reported interval. */
  receivedBitrate: number;
  /** The decoder output frame rate (fps) of the remote video. */
  decoderOutputFrameRate: number;
  /** The renderer output frame rate (fps) of the remote video. */
  rendererOutputFrameRate: number;
  /**
   * Video stream type:
   * - 0: High-stream
   * - 1: Low-stream
   */
  rxStreamType: StreamType;
  /**
   * The total freeze time (ms) of the remote video stream after the
   * remote user joins the channel.
   *
   * In a video session where the frame rate is set to no less than 5 fps,
   * video freeze occurs when the time interval between two adjacent renderable
   * video frames is more than 500 ms.
   */
  totalFrozenTime: number;
  /**
   * The total video freeze time as a percentage (%) of the total time when
   * the video is available.
   */
  frozenRate: number;
  /**
   * @since v2.9.0
   *
   * Packet loss rate (%) of the remote video stream after using the
   * anti-packet-loss method.
   */
  packetLossRate: number;
  /**
   * The total time (ms) when the remote user in the `0` (communication)
   * profile or the remote host in the `1` (live streaming) profile neither
   * stops sending the video stream nor
   * disables the video module after joining the channel.
   *
   * @since v3.2.0
   *
   */
  totalActiveTime: number;
  /**
   * The total publish duration (ms) of the remote video stream.
   *
   * @since v3.2.0
   */
  publishDuration: number;
}
/** Sets the camera capturer preference. */
export enum CaptureOutPreference {
  /** 0: (Default) self-adapts the camera output parameters to the system
   * performance and network conditions to balance CPU consumption and video
   * preview quality.
   */
  CAPTURER_OUTPUT_PREFERENCE_AUTO = 0,
  /** 1: Prioritizes the system performance.
   *
   * The SDK chooses the dimension
   * and frame rate of the local camera capture closest to those set
   * by the {@link setVideoEncoderConfiguration} method.
   */
  CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE = 1,
  /** 2: Prioritizes the local preview quality.
   *
   * The SDK chooses higher camera output parameters to improve the local
   * video preview quality. This option requires extra CPU and RAM usage for
   * video pre-processing.
   */
  CAPTURER_OUTPUT_PREFERENCE_PREVIEW = 2,
  /** 3: Allows you to customize the width and height of the video image
   * captured by the local camera.
   *
   * @since v3.3.1
   */
  CAPTURER_OUTPUT_PREFERENCE_MANUAL = 3,
}
/** Camera capturer configuration. */
export interface CameraCapturerConfiguration {
  /** The output preference of camera capturer. */
  preference: CaptureOutPreference;
  /** The width (px) of the video image captured by the local camera.
   * To customize the width of the video image, set `preference`
   * as `CAPTURER_OUTPUT_PREFERENCE_MANUAL(3)` first,
   * and then use `captureWidth`.
   *
   * @since v3.3.1
   */
  captureWidth: number;
  /** The height (px) of the video image captured by the local camera.
   * To customize the height of the video image, set `preference` as
   * `CAPTURER_OUTPUT_PREFERENCE_MANUAL(3)` first,
   * and then use `captureHeight`.
   *
   * @since v3.3.1
   */
  captureHeight: number;
}
/** The relative location of the region to the screen or window. */
export interface Rectangle {
  /** The horizontal offset from the top-left corner. */
  x: number; // The horizontal offset from the top-left corner.
  /** The vertical offset from the top-left corner. */
  y: number; // The vertical offset from the top-left corner.
  /** The width of the region. */
  width: number; // The width of the region.
  /** The height of the region. */
  height: number; // The height of the region.
}
/**
 * The screen symbol:
 * - The screen symbol on the macOS platform, see {@link MacScreenSymbol}
 * - The screen symbol on the Windows platform, see {@link WindowsScreenSymbol}
 */
export type ScreenSymbol = MacScreenSymbol | WindowsScreenSymbol;

export type MacScreenSymbol = DisplayId;

export type WindowsScreenSymbol = Rectangle;

export type CaptureRect = Rectangle;
/** The video source encoding parameters. */
export interface CaptureParam {
  /** Width (pixels) of the video. */
  width: number; // Width (pixels) of the video
  /** Height (pixels) of the video. */
  height: number; // Height (pixels) of the video
  /** The frame rate (fps) of the shared region.
   *
   * The default value is 5.
   *
   * We do not recommend setting this to a value greater than 15.
   */
  frameRate: number; // The frame rate (fps) of the shared region. The default value is 5. We do not recommend setting this to a value greater than 15.
  /**
   * The bitrate (Kbps) of the shared region.
   *
   * The default value is 0 (the SDK works out a bitrate according to the
   * dimensions of the current screen).
   */
  bitrate: number; //  The bitrate (Kbps) of the shared region. The default value is 0 (the SDK works out a bitrate according to the dimensions of the current screen).
  /** Sets whether or not to capture the mouse for screen sharing:
   * - true: (Default) Capture the mouse.
   * - false: Do not capture the mouse.
   *
   * @since v3.2.0
   */
  captureMouseCursor: boolean;
  /** Whether to bring the window to the front when calling
   * {@link startScreenCaptureByWindow} to share the window:
   * - true: Bring the window to the front.
   * - false: (Default) Do not bring the window to the front.
   *
   * @since v3.2.0
   */
  windowFocus: boolean;
  /** A list of IDs of windows to be blocked.
   *
   * When calling {@link startScreenCaptureByScreen} to start screen
   * sharing, you can use this parameter to block the specified windows.
   * When calling {@link updateScreenCaptureParameters} to update the
   * configuration for screen sharing, you can use this parameter to
   * dynamically block the specified windows during screen sharing.
   *
   * @since v3.2.0
   */
  excludeWindowList: Array<number>;
  /** The number of windows to be blocked.
   *
   * @since v3.2.0
   */
  excludeWindowCount: number;
  /** The select window show highligt frame width.
   */
  highLightWidth?: number;
  /** The select window show highligt frame color RGBA.
   */
  highLightColor?: number;
  /** The select window show highligt frame
   - true: show highligt frame
   - false: (Default) not show highligt frame
   */
  enableHighLight?: boolean;
}

/**
 * Content hints for screen sharing.
 */
export enum VideoContentHint {
  /**
   * 0: (Default) No content hint.
   */
  CONTENT_HINT_NONE = 0,
  /**
   * 1: Motion-intensive content.
   *
   * Choose this option if you prefer smoothness or when you are sharing a
   * video clip, movie, or video game.
   */
  CONTENT_HINT_MOTION = 1,
  /**
   * 2: Motionless content.
   *
   * Choose this option if you prefer sharpness or when you are sharing a
   * picture, PowerPoint slide, or text.
   */
  CONTENT_HINT_DETAILS = 2,
}

export enum SCREEN_SCENARIO_TYPE {
  SCREEN_SCENARIO_DOCUMENT = 1,
  SCREEN_SCENARIO_GAMING = 2,
  SCREEN_SCENARIO_VIDEO = 3,
  SCREEN_SCENARIO_RDC = 4,
}

export enum FeatureType {
  VIDEO_PREPROCESS_VIRTUAL_BACKGROUND = 1,
  VIDEO_PREPROCESS_BEAUTY = 2,
};

/**
 * @deprecated This callback is deprecated. Use the remoteVideoStats callback
 * instead.
 *
 * Reports the transport-layer statistics of each remote video stream.
 */
export interface RemoteVideoTransportStats {
  /** User ID of the remote user sending the video packet. */
  uid: number;
  /** Network time delay (ms) from the remote user sending the video packet to
   * the local user.
   */
  delay: number;
  /** Packet loss rate (%) of the video packet sent from the remote user. */
  lost: number;
  /** Received bitrate (Kbps) of the video packet sent from the remote user. */
  rxKBitRate: number;
}

/**
 * @deprecated This callback is deprecated. Use the remoteAudioStats callback
 * instead.
 *
 * Reports the transport-layer statistics of each remote audio stream.
 */
export interface RemoteAudioTransportStats {
  /** User ID of the remote user sending the audio packet. */
  uid: number;
  /** Network time delay (ms) from the remote user sending the audio packet to
   * the local user. */
  delay: number;
  /** Packet loss rate (%) of the audio packet sent from the remote user. */
  lost: number;
  /** Received bitrate (Kbps) of the audio packet sent from the remote user. */
  rxKBitRate: number;
}

/**
 * Reports the statistics of the remote audio.
 */
export interface RemoteAudioStats {
  /** User ID of the remote user sending the audio streams. */
  uid: number;
  /** Audio quality received by the user. See {@link AgoraNetworkQuality}. */
  quality: AgoraNetworkQuality;
  /** Network delay (ms) from the sender to the receiver. */
  networkTransportDelay: number;
  /** Network delay (ms) from the receiver to the jitter buffer. */
  jitterBufferDelay: number;
  /** Packet loss rate in the reported interval. */
  audioLossRate: number;
  /** The number of the channels. */
  numChannels: number;
  /**
   * The sample rate (Hz) of the received audio stream in the reported
   * interval.
   */
  receivedSampleRate: number;
  /** The average bitrate (Kbps) of the received audio stream in the reported
   * interval.
   */
  receivedBitrate: number;
  /**
   * The total freeze time (ms) of the remote audio stream after the remote
   * user joins the channel.
   *
   * In the reported interval, audio freeze occurs when the audio frame loss
   * rate reaches 4%. Agora uses 2 seconds as an audio piece unit to calculate
   * the audio freeze time. The total audio freeze time = The audio freeze
   * number × 2000 ms.
   */
  totalFrozenTime: number;
  /**
   * The total audio freeze time as a percentage (%) of the total time
   * when the audio is available.
   */
  frozenRate: number;
  /**
   * The total time (ms) when the remote user in the `0` (communication)
   * profile or the remote host in the `1` (live streaming) profile neither
   * stops sending the audio stream nor
   * disables the audio module after joining the channel.
   *
   * @since v3.2.0
   *
   */
  totalActiveTime: number;
  /**
   * The total publish duration (ms) of the remote audio stream.
   *
   * @since v3.2.0
   */
  publishDuration: number;
  /**
   * Quality of experience (QoE) of the local user when receiving a remote
   * audio stream:
   * - `0`: QoE of the local user is good.
   * - `1`: QoE of the local user is poor.
   *
   * @since v3.3.1
   */
  qoeQuality: number;
  /**
   * The reason for poor QoE of the local user when receiving a remote audio
   * stream:
   * - `0`: No reason, indicating good QoE of the local user.
   * - `1`: The remote user's network quality is poor.
   * - `2`: The local user's network quality is poor.
   * - `4`: The local user's Wi-Fi or mobile network signal is weak.
   * - `8`: The local user enables both Wi-Fi and bluetooth, and their signals
   * interfere with each other. As a result, audio transmission quality is
   * undermined.
   *
   * @since v3.3.1
   */
  qualityChangedReason: number;
  /**
   * The quality of the remote audio stream as determined by the Agora
   * real-time audio MOS (Mean Opinion Score) measurement method in the
   * reported interval. The return value ranges from 0 to 500. Dividing the
   * return value by 100 gets the MOS score, which ranges from 0 to 5. The
   * higher the score, the better the audio quality.
   *
   * @since v3.3.1
   *
   * The subjective perception of audio quality corresponding to the Agora
   * real-time audio MOS scores is as follows:
   *
   * <table>
   * <thead>
   *   <tr>
   *     <th>MOS score</th>
   *     <th>Perception of audio quality</th>
   *   </tr>
   * </thead>
   * <tbody>
   *   <tr>
   *     <td>Greater than 4</td>
   *     <td>Excellent. The audio sounds clear and smooth.</td>
   *   </tr>
   *   <tr>
   *     <td>From 3.5 to 4</td>
   *     <td>Good. The audio has some perceptible impairment, but still
   * sounds clear.</td>
   *   </tr>
   *   <tr>
   *     <td>From 3 to 3.5</td>
   *     <td>Fair. The audio freezes occasionally and requires attentive
   * listening.</td>
   *   </tr>
   *   <tr>
   *     <td>From 2.5 to 3</td>
   *     <td>Poor. The audio sounds choppy and requires considerable effort
   * to understand.</td>
   *   </tr>
   *   <tr>
   *     <td>From 2 to 2.5</td>
   *     <td>Bad. The audio has occasional noise. Consecutive audio dropouts
   * occur, resulting in some information loss. The users can communicate
   * only with difficulty.</td>
   *   </tr>
   *   <tr>
   *     <td>Less than 2</td>
   *     <td>Very bad. The audio has persistent noise. Consecutive audio
   * dropouts are frequent, resulting in severe information loss.
   * Communication is nearly impossible.</td>
   *   </tr>
   * </tbody>
   * </table>
   */
  mosValue: number;
}

/**
 * State of the remote video:
 *
 * - 0: The remote video is in the default state.
 * - 1: The first remote video packet is received.
 * - 2: The remote video stream is decoded and plays normally.
 * - 3: The remote video is frozen.
 * - 4: The remote video fails to start.
 */
export enum RemoteVideoState {
  /** 0: The remote video is in the default state, probably due to #REMOTE_VIDEO_STATE_REASON_LOCAL_MUTED (3), #REMOTE_VIDEO_STATE_REASON_REMOTE_MUTED (5), or #REMOTE_VIDEO_STATE_REASON_REMOTE_OFFLINE (7).
   */
  REMOTE_VIDEO_STATE_STOPPED = 0,

  /** 1: The first remote video packet is received.
   */
  REMOTE_VIDEO_STATE_STARTING = 1,

  /** 2: The remote video stream is decoded and plays normally, probably due to #REMOTE_VIDEO_STATE_REASON_NETWORK_RECOVERY (2), #REMOTE_VIDEO_STATE_REASON_LOCAL_UNMUTED (4), #REMOTE_VIDEO_STATE_REASON_REMOTE_UNMUTED (6), or #REMOTE_VIDEO_STATE_REASON_AUDIO_FALLBACK_RECOVERY (9).
   */
  REMOTE_VIDEO_STATE_DECODING = 2,

  /** 3: The remote video is frozen, probably due to #REMOTE_VIDEO_STATE_REASON_NETWORK_CONGESTION (1) or #REMOTE_VIDEO_STATE_REASON_AUDIO_FALLBACK (8).
   */
  REMOTE_VIDEO_STATE_FROZEN = 3,

  /** 4: The remote video fails to start, probably due to #REMOTE_VIDEO_STATE_REASON_INTERNAL (0).
   */
  REMOTE_VIDEO_STATE_FAILED = 4,
}
/**
 * - 0: Internal reasons.
 * - 1: Network congestion.
 * - 2: Network recovery.
 * - 3: The local user stops receiving the remote video stream or disables the
 * video module.
 * - 4: The local user resumes receiving the remote video stream or enables the
 * video module.
 * - 5: The remote user stops sending the video stream or disables the video
 * module.
 * - 6: The remote user resumes sending the video stream or enables the video
 * module.
 * - 7: The remote user leaves the channel.
 * - 8: The remote media stream falls back to the audio-only stream due to poor
 * network conditions.
 * - 9: The remote media stream switches back to the video stream after the
 * network conditions improve.
 */
export enum RemoteVideoStateReason {
  /** 0: The SDK reports this reason when the video state changes.
   */
  REMOTE_VIDEO_STATE_REASON_INTERNAL = 0,

  /** 1: Network congestion.
   */
  REMOTE_VIDEO_STATE_REASON_NETWORK_CONGESTION = 1,

  /** 2: Network recovery.
   */
  REMOTE_VIDEO_STATE_REASON_NETWORK_RECOVERY = 2,

  /** 3: The local user stops receiving the remote video stream or disables the video module.
   */
  REMOTE_VIDEO_STATE_REASON_LOCAL_MUTED = 3,

  /** 4: The local user resumes receiving the remote video stream or enables the video module.
   */
  REMOTE_VIDEO_STATE_REASON_LOCAL_UNMUTED = 4,

  /** 5: The remote user stops sending the video stream or disables the video module.
   */
  REMOTE_VIDEO_STATE_REASON_REMOTE_MUTED = 5,

  /** 6: The remote user resumes sending the video stream or enables the video module.
   */
  REMOTE_VIDEO_STATE_REASON_REMOTE_UNMUTED = 6,

  /** 7: The remote user leaves the channel.
   */
  REMOTE_VIDEO_STATE_REASON_REMOTE_OFFLINE = 7,

  /** 8: The remote audio-and-video stream falls back to the audio-only stream due to poor network conditions.
   */
  REMOTE_VIDEO_STATE_REASON_AUDIO_FALLBACK = 8,

  /** 9: The remote audio-only stream switches back to the audio-and-video stream after the network conditions improve.
   */
  REMOTE_VIDEO_STATE_REASON_AUDIO_FALLBACK_RECOVERY = 9,
}

/**
 * State of the remote audio stream.
 * - 0: The remote audio is in the default state.
 * - 1: The first remote audio packet is received.
 * - 2: The remote audio stream is decoded and plays normally.
 * - 3: The remote audio is frozen.
 * - 4: The remote audio fails to start.
 */
export enum RemoteAudioState {
  /** 0: The remote audio is in the default state, probably due to
   * #REMOTE_AUDIO_REASON_LOCAL_MUTED (3),
   * #REMOTE_AUDIO_REASON_REMOTE_MUTED (5), or
   * #REMOTE_AUDIO_REASON_REMOTE_OFFLINE (7).
   */
  REMOTE_AUDIO_STATE_STOPPED = 0, // Default state, audio is started or remote user disabled/muted audio stream
  /** 1: The first remote audio packet is received.
   */
  REMOTE_AUDIO_STATE_STARTING = 1, // The first audio frame packet has been received
  /** 2: The remote audio stream is decoded and plays normally, probably
   * due to #REMOTE_AUDIO_REASON_NETWORK_RECOVERY (2),
   * #REMOTE_AUDIO_REASON_LOCAL_UNMUTED (4), or
   * #REMOTE_AUDIO_REASON_REMOTE_UNMUTED (6).
   */
  REMOTE_AUDIO_STATE_DECODING = 2, // The first remote audio frame has been decoded or fronzen state ends
  /** 3: The remote audio is frozen, probably due to
   * #REMOTE_AUDIO_REASON_NETWORK_CONGESTION (1).
   */
  REMOTE_AUDIO_STATE_FROZEN = 3, // Remote audio is frozen, probably due to network issue
  /** 4: The remote audio fails to start, probably due to
   * #REMOTE_AUDIO_REASON_INTERNAL (0).
   */
  REMOTE_AUDIO_STATE_FAILED = 4, // Remote audio play failed
}

/**
 * The reason of the remote audio state change.
 * - 0: Internal reasons.
 * - 1: Network congestion.
 * - 2: Network recovery.
 * - 3: The local user stops receiving the remote audio stream or disables the
 * audio module.
 * - 4: The local user resumes receiving the remote audio stream or enables the
 * audio module.
 * - 5: The remote user stops sending the audio stream or disables the audio
 * module.
 * - 6: The remote user resumes sending the audio stream or enables the audio
 * module.
 * - 7: The remote user leaves the channel.
 */
export enum RemoteAudioStateReason {
  /** 0: The SDK reports this reason when the audio state changes.
   */
  REMOTE_AUDIO_REASON_INTERNAL = 0,
  /** 1: Network congestion.
   */
  REMOTE_AUDIO_REASON_NETWORK_CONGESTION = 1,
  /** 2: Network recovery.
   */
  REMOTE_AUDIO_REASON_NETWORK_RECOVERY = 2,
  /** 3: The local user stops receiving the remote audio stream or
   * disables the audio module.
   */
  REMOTE_AUDIO_REASON_LOCAL_MUTED = 3,
  /** 4: The local user resumes receiving the remote audio stream or
   * enables the audio module.
   */
  REMOTE_AUDIO_REASON_LOCAL_UNMUTED = 4,
  /** 5: The remote user stops sending the audio stream or disables the
   * audio module.
   */
  REMOTE_AUDIO_REASON_REMOTE_MUTED = 5,
  /** 6: The remote user resumes sending the audio stream or enables the
   * audio module.
   */
  REMOTE_AUDIO_REASON_REMOTE_UNMUTED = 6,
  /** 7: The remote user leaves the channel.
   */
  REMOTE_AUDIO_REASON_REMOTE_OFFLINE = 7,
}
/**
 * Connection states.
 * - 1: The SDK is disconnected from Agora's edge server.
 *  - This is the initial state before calling the
 * {@link AgoraRtcEngine.joinChannel} method.
 *  - The SDK also enters this state when the application calls the
 * {@link AgoraRtcEngine.leaveChannel} method.
 * - 2: The SDK is connecting to Agora's edge server. When the application
 * calls the {@link AgoraRtcEngine.joinChannel} method, the SDK starts to
 * establish a connection to the specified channel.
 *  - When the SDK successfully joins the channel, it triggers the
 * connectionStateChanged callback and switches to the 3 state.
 *  - After the SDK joins the channel and when it finishes initializing the
 * media engine, the SDK triggers the joinedChannel callback.
 * - 3: The SDK is connected to Agora's edge server and has joined a channel.
 * You can now publish or subscribe to a media stream in the channel.If the
 * connection to the channel is lost because, for example,
 * if the network is down or switched, the SDK automatically tries to reconnect
 * and triggers:
 *  - The connectionStateChanged callback and switches to the 4 state.
 * - 4: The SDK keeps rejoining the channel after being disconnected from a
 * joined channel because of network issues.
 *  - If the SDK cannot rejoin the channel within 10 seconds after being
 * disconnected from Agora's edge server, the SDK triggers the connectionLost
 * callback, stays in this state, and keeps rejoining the channel.
 *  - If the SDK fails to rejoin the channel 20 minutes after being
 * disconnected from Agora's edge server, the SDK triggers the
 * connectionStateChanged callback, switches to the 5 state, and stops
 * rejoining the channel.
 * - 5: The SDK fails to connect to Agora's edge server or join the channel.
 * You must call the {@link AgoraRtcEngine.leaveChannel leaveChannel} method
 * to leave this state.
 *  - Calls the {@link AgoraRtcEngine.joinChannel joinChannel} method again to
 * rejoin the channel.
 *  - If the SDK is banned from joining the channel by Agora's edge server
 * (through the RESTful API), the SDK triggers connectionStateChanged
 * callbacks.
 */
export enum ConnectionState {
  /** 1: The SDK is disconnected from Agora's edge server.

   - This is the initial state before calling the \ref agora::rtc::IRtcEngine::joinChannel "joinChannel" method.
   - The SDK also enters this state when the application calls the \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method.
   */
  CONNECTION_STATE_DISCONNECTED = 1,
  /** 2: The SDK is connecting to Agora's edge server.

   - When the application calls the \ref agora::rtc::IRtcEngine::joinChannel "joinChannel" method, the SDK starts to establish a connection to the specified channel, triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback, and switches to the #CONNECTION_STATE_CONNECTING state.
   - When the SDK successfully joins the channel, it triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback and switches to the #CONNECTION_STATE_CONNECTED state.
   - After the SDK joins the channel and when it finishes initializing the media engine, the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onJoinChannelSuccess "onJoinChannelSuccess" callback.
   */
  CONNECTION_STATE_CONNECTING = 2,
  /** 3: The SDK is connected to Agora's edge server and has joined a channel. You can now publish or subscribe to a media stream in the channel.

   If the connection to the channel is lost because, for example, if the network is down or switched, the SDK automatically tries to reconnect and triggers:
   - The \ref agora::rtc::IRtcEngineEventHandler::onConnectionInterrupted "onConnectionInterrupted" callback (deprecated).
   - The \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback and switches to the #CONNECTION_STATE_RECONNECTING state.
   */
  CONNECTION_STATE_CONNECTED = 3,
  /** 4: The SDK keeps rejoining the channel after being disconnected from a joined channel because of network issues.

   - If the SDK cannot rejoin the channel within 10 seconds after being disconnected from Agora's edge server, the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionLost "onConnectionLost" callback, stays in the #CONNECTION_STATE_RECONNECTING state, and keeps rejoining the channel.
   - If the SDK fails to rejoin the channel 20 minutes after being disconnected from Agora's edge server, the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback, switches to the #CONNECTION_STATE_FAILED state, and stops rejoining the channel.
   */
  CONNECTION_STATE_RECONNECTING = 4,
  /** 5: The SDK fails to connect to Agora's edge server or join the channel.

   You must call the \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method to leave this state, and call the \ref agora::rtc::IRtcEngine::joinChannel "joinChannel" method again to rejoin the channel.

   If the SDK is banned from joining the channel by Agora's edge server (through the RESTful API), the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionBanned "onConnectionBanned" (deprecated) and \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callbacks.
   */
  CONNECTION_STATE_FAILED = 5,
}

/**
 * Reasons for a connection state change.
 *
 * - 0: The SDK is connecting to Agora's edge server.
 * - 1: The SDK has joined the channel successfully.
 * - 2: The connection between the SDK and Agora's edge server is
 * interrupted.
 * - 3: The connection between the SDK and Agora's edge server is banned by
 * Agora's edge server.
 * - 4: The SDK fails to join the channel for more than 20 minutes and stops
 * reconnecting to the channel.
 * - 5: The SDK has left the channel.
 * - 6: Invalid App ID.
 * - 7: Invalid Channel Name.
 * - 8: Invalid Token.
 * - 9: Token Expired.
 * - 10: This user has been banned by server.
 * - 11: SDK reconnects for setting proxy server.
 * - 12: Network status change for renew token.
 * - 13: Client IP Address changed.
 */
export enum ConnectionChangeReason {
  /** 0: The SDK is connecting to Agora's edge server. */
  CONNECTION_CHANGED_CONNECTING = 0,
  /** 1: The SDK has joined the channel successfully. */
  CONNECTION_CHANGED_JOIN_SUCCESS = 1,
  /** 2: The connection between the SDK and Agora's edge server is interrupted. */
  CONNECTION_CHANGED_INTERRUPTED = 2,
  /** 3: The user is banned by the server. This error occurs when the user is kicked out the channel from the server. */
  CONNECTION_CHANGED_BANNED_BY_SERVER = 3,
  /** 4: The SDK fails to join the channel for more than 20 minutes and stops reconnecting to the channel. */
  CONNECTION_CHANGED_JOIN_FAILED = 4,
  /** 5: The SDK has left the channel. */
  CONNECTION_CHANGED_LEAVE_CHANNEL = 5,
  /**
   * 6: The specified App ID is invalid. Try to rejoin the channel with a valid App ID.
   */
  CONNECTION_CHANGED_INVALID_APP_ID = 6,
  /** 7: The connection failed since channel name is not valid. */
  CONNECTION_CHANGED_INVALID_CHANNEL_NAME = 7,
  /** 8: The connection failed since token is not valid, possibly because:

   - The App Certificate for the project is enabled in Console, but you do not use Token when joining the channel. If you enable the App Certificate, you must use a token to join the channel.
   - The uid that you specify in the \ref agora::rtc::IRtcEngine::joinChannel "joinChannel" method is different from the uid that you pass for generating the token.
   */
  CONNECTION_CHANGED_INVALID_TOKEN = 8,
  /** 9: The connection failed since token is expired. */
  CONNECTION_CHANGED_TOKEN_EXPIRED = 9,
  /** 10: The connection is rejected by server. This error usually occurs in the following situations:
   * - When the user is already in the channel, and still calls the method to join the channel, for example,
   * \ref IRtcEngine::joinChannel "joinChannel".
   * - When the user tries to join a channel during \ref IRtcEngine::startEchoTest "startEchoTest". Once you
   * call \ref IRtcEngine::startEchoTest "startEchoTest", you need to call \ref IRtcEngine::stopEchoTest "stopEchoTest" before joining a channel.
   *
   */
  CONNECTION_CHANGED_REJECTED_BY_SERVER = 10,
  /** 11: The connection changed to reconnecting since SDK has set a proxy server. */
  CONNECTION_CHANGED_SETTING_PROXY_SERVER = 11,
  /** 12: When SDK is in connection failed, the renew token operation will make it connecting. */
  CONNECTION_CHANGED_RENEW_TOKEN = 12,
  /** 13: The IP Address of SDK client has changed. i.e., Network type or IP/Port changed by network operator might change client IP address. */
  CONNECTION_CHANGED_CLIENT_IP_ADDRESS_CHANGED = 13,
  /** 14: Timeout for the keep-alive of the connection between the SDK and Agora's edge server. The connection state changes to CONNECTION_STATE_RECONNECTING(4). */
  CONNECTION_CHANGED_KEEP_ALIVE_TIMEOUT = 14,
}

/** Encryption mode. Agora recommends using either the `AES_128_GCM2` or
 * `AES_256_GCM2` encryption mode, both of which support adding a salt and
 * are more secure.
 */
export enum ENCRYPTION_MODE {
  /** 1: 128-bit AES encryption, XTS mode.
   */
  AES_128_XTS = 1,
  /** 2: 128-bit AES encryption, ECB mode.
   */
  AES_128_ECB = 2,
  /** 3: 256-bit AES encryption, XTS mode.
   */
  AES_256_XTS = 3,
  /** 4: 128-bit SM4 encryption, ECB mode.
   */
  SM4_128_ECB = 4,
  /** 5: 128-bit AES encryption, GCM mode.
   *
   * @since v3.3.1
   */
  AES_128_GCM = 5,
  /** 6: 256-bit AES encryption, GCM mode.
   *
   * @since v3.3.1
   */
  AES_256_GCM = 6,
  /** 7: (Default) 128-bit AES encryption, GCM mode. This mode requires
   * you to set the salt (`encryptionKdfSalt`).
   *
   * @since v3.4.5
   */
  AES_128_GCM2 = 7,
  /** 8: 256-bit AES encryption, GCM mode. This mode requires
   * you to set the salt (`encryptionKdfSalt`).
   *
   * @since v3.4.5
   */
  AES_256_GCM2 = 8,
  /**
   * @ignore
   * Enumerator boundary.
   */
  MODE_END,
}

type Uint8ArrayBuffer = ArrayBuffer;

/**
 * Configurations of built-in encryption schemas.
 */
export interface EncryptionConfig {
  /**
   * Encryption mode. The default encryption mode is `AES_128_GCM2`.
   */
  encryptionMode: ENCRYPTION_MODE;
  /**
   * Encryption key in string type.
   *
   * @note If you do not set an encryption key or set it as NULL, you
   * cannot use the built-in encryption, and the SDK returns the error code
   * `-2`.
   */
  encryptionKey: string;
  /**
   * @since v3.4.5
   *
   * The salt with the length of 32 bytes. Agora recommends using OpenSSL to
   * generate the salt on your server.
   *
   * For details, see *Media Stream Encryption*.
   *
   * @note This parameter is only valid when you set the encryption mode as
   * `AES_128_GCM2` or `AES_256_GCM2`. In this case, ensure that this parameter
   * is not `0`.
   *
   */
  encryptionKdfSalt: Uint8ArrayBuffer;
}

/**
 * @deprecated Video profile.
 */
export enum VIDEO_PROFILE_TYPE {
  /** 0: 160 &times; 120, frame rate 15 fps, bitrate 65 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_120P = 0,
  /** 2: 120 &times; 120, frame rate 15 fps, bitrate 50 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_120P_3 = 2,
  /** 10: 320&times;180, frame rate 15 fps, bitrate 140 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_180P = 10,
  /** 12: 180 &times; 180, frame rate 15 fps, bitrate 100 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_180P_3 = 12,
  /** 13: 240 &times; 180, frame rate 15 fps, bitrate 120 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_180P_4 = 13,
  /** 20: 320 &times; 240, frame rate 15 fps, bitrate 200 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_240P = 20,
  /** 22: 240 &times; 240, frame rate 15 fps, bitrate 140 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_240P_3 = 22,
  /** 23: 424 &times; 240, frame rate 15 fps, bitrate 220 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_240P_4 = 23,
  /** 30: 640 &times; 360, frame rate 15 fps, bitrate 400 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_360P = 30,
  /** 32: 360 &times; 360, frame rate 15 fps, bitrate 260 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_360P_3 = 32,
  /** 33: 640 &times; 360, frame rate 30 fps, bitrate 600 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_360P_4 = 33,
  /** 35: 360 &times; 360, frame rate 30 fps, bitrate 400 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_360P_6 = 35,
  /** 36: 480 &times; 360, frame rate 15 fps, bitrate 320 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_360P_7 = 36,
  /** 37: 480 &times; 360, frame rate 30 fps, bitrate 490 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_360P_8 = 37,
  /** 38: 640 &times; 360, frame rate 15 fps, bitrate 800 Kbps.
   * **Note**: `1` (live streaming) profile only.
   */
  VIDEO_PROFILE_LANDSCAPE_360P_9 = 38,
  /** 39: 640 &times; 360, frame rate 24 fps, bitrate 800 Kbps.
   * **Note**: `1` (live streaming) profile only.
   */
  VIDEO_PROFILE_LANDSCAPE_360P_10 = 39,
  /** 100: 640 &times; 360, frame rate 24 fps, bitrate 1000 Kbps.
   * **Note**: `1` (live streaming) profile only.
   */
  VIDEO_PROFILE_LANDSCAPE_360P_11 = 100,
  /** 40: 640 &times; 480, frame rate 15 fps, bitrate 500 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_480P = 40,
  /** 42: 480 &times; 480, frame rate 15 fps, bitrate 400 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_480P_3 = 42,
  /** 43: 640 &times; 480, frame rate 30 fps, bitrate 750 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_480P_4 = 43,
  /** 45: 480 &times; 480, frame rate 30 fps, bitrate 600 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_480P_6 = 45,
  /** 47: 848 &times; 480, frame rate 15 fps, bitrate 610 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_480P_8 = 47,
  /** 48: 848 &times; 480, frame rate 30 fps, bitrate 930 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_480P_9 = 48,
  /** 49: 640 &times; 480, frame rate 10 fps, bitrate 400 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_480P_10 = 49,
  /** 50: 1280 &times; 720, frame rate 15 fps, bitrate 1130 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_720P = 50,
  /** 52: 1280 &times; 720, frame rate 30 fps, bitrate 1710 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_720P_3 = 52,
  /** 54: 960 &times; 720, frame rate 15 fps, bitrate 910 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_720P_5 = 54,
  /** 55: 960 &times; 720, frame rate 30 fps, bitrate 1380 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_720P_6 = 55,
  /** 60: 1920 &times; 1080, frame rate 15 fps, bitrate 2080 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_1080P = 60,
  /** 62: 1920 &times; 1080, frame rate 30 fps, bitrate 3150 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_1080P_3 = 62,
  /** 64: 1920 &times; 1080, frame rate 60 fps, bitrate 4780 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_1080P_5 = 64,
  /** 66: 2560 &times; 1440, frame rate 30 fps, bitrate 4850 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_1440P = 66,
  /** 67: 2560 &times; 1440, frame rate 60 fps, bitrate 6500 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_1440P_2 = 67,
  /** 70: 3840 &times; 2160, frame rate 30 fps, bitrate 6500 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_4K = 70,
  /** 72: 3840 &times; 2160, frame rate 60 fps, bitrate 6500 Kbps. */
  VIDEO_PROFILE_LANDSCAPE_4K_3 = 72,
  /** 1000: 120 &times; 160, frame rate 15 fps, bitrate 65 Kbps. */
  VIDEO_PROFILE_PORTRAIT_120P = 1000,
  /** 1002: 120 &times; 120, frame rate 15 fps, bitrate 50 Kbps. */
  VIDEO_PROFILE_PORTRAIT_120P_3 = 1002,
  /** 1010: 180 &times; 320, frame rate 15 fps, bitrate 140 Kbps. */
  VIDEO_PROFILE_PORTRAIT_180P = 1010,
  /** 1012: 180 &times; 180, frame rate 15 fps, bitrate 100 Kbps. */
  VIDEO_PROFILE_PORTRAIT_180P_3 = 1012,
  /** 1013: 180 &times; 240, frame rate 15 fps, bitrate 120 Kbps. */
  VIDEO_PROFILE_PORTRAIT_180P_4 = 1013,
  /** 1020: 240 &times; 320, frame rate 15 fps, bitrate 200 Kbps. */
  VIDEO_PROFILE_PORTRAIT_240P = 1020,
  /** 1022: 240 &times; 240, frame rate 15 fps, bitrate 140 Kbps. */
  VIDEO_PROFILE_PORTRAIT_240P_3 = 1022,
  /** 1023: 240 &times; 424, frame rate 15 fps, bitrate 220 Kbps. */
  VIDEO_PROFILE_PORTRAIT_240P_4 = 1023,
  /** 1030: 360 &times; 640, frame rate 15 fps, bitrate 400 Kbps. */
  VIDEO_PROFILE_PORTRAIT_360P = 1030,
  /** 1032: 360 &times; 360, frame rate 15 fps, bitrate 260 Kbps. */
  VIDEO_PROFILE_PORTRAIT_360P_3 = 1032,
  /** 1033: 360 &times; 640, frame rate 30 fps, bitrate 600 Kbps. */
  VIDEO_PROFILE_PORTRAIT_360P_4 = 1033,
  /** 1035: 360 &times; 360, frame rate 30 fps, bitrate 400 Kbps. */
  VIDEO_PROFILE_PORTRAIT_360P_6 = 1035,
  /** 1036: 360 &times; 480, frame rate 15 fps, bitrate 320 Kbps. */
  VIDEO_PROFILE_PORTRAIT_360P_7 = 1036,
  /** 1037: 360 &times; 480, frame rate 30 fps, bitrate 490 Kbps. */
  VIDEO_PROFILE_PORTRAIT_360P_8 = 1037,
  /** 1038: 360 &times; 640, frame rate 15 fps, bitrate 800 Kbps.
   * **Note**: `1` (live streaming) profile only.
   */
  VIDEO_PROFILE_PORTRAIT_360P_9 = 1038,
  /** 1039: 360 &times; 640, frame rate 24 fps, bitrate 800 Kbps.
   * **Note**: `1` (live streaming) profile only.
   */
  VIDEO_PROFILE_PORTRAIT_360P_10 = 1039,
  /** 1100: 360 &times; 640, frame rate 24 fps, bitrate 1000 Kbps.
   * **Note**: `1` (live streaming) profile only.
   */
  VIDEO_PROFILE_PORTRAIT_360P_11 = 1100,
  /** 1040: 480 &times; 640, frame rate 15 fps, bitrate 500 Kbps. */
  VIDEO_PROFILE_PORTRAIT_480P = 1040,
  /** 1042: 480 &times; 480, frame rate 15 fps, bitrate 400 Kbps. */
  VIDEO_PROFILE_PORTRAIT_480P_3 = 1042,
  /** 1043: 480 &times; 640, frame rate 30 fps, bitrate 750 Kbps. */
  VIDEO_PROFILE_PORTRAIT_480P_4 = 1043,
  /** 1045: 480 &times; 480, frame rate 30 fps, bitrate 600 Kbps. */
  VIDEO_PROFILE_PORTRAIT_480P_6 = 1045,
  /** 1047: 480 &times; 848, frame rate 15 fps, bitrate 610 Kbps. */
  VIDEO_PROFILE_PORTRAIT_480P_8 = 1047,
  /** 1048: 480 &times; 848, frame rate 30 fps, bitrate 930 Kbps. */
  VIDEO_PROFILE_PORTRAIT_480P_9 = 1048,
  /** 1049: 480 &times; 640, frame rate 10 fps, bitrate 400 Kbps. */
  VIDEO_PROFILE_PORTRAIT_480P_10 = 1049,
  /** 1050: 720 &times; 1280, frame rate 15 fps, bitrate 1130 Kbps. */
  VIDEO_PROFILE_PORTRAIT_720P = 1050,
  /** 1052: 720 &times; 1280, frame rate 30 fps, bitrate 1710 Kbps. */
  VIDEO_PROFILE_PORTRAIT_720P_3 = 1052,
  /** 1054: 720 &times; 960, frame rate 15 fps, bitrate 910 Kbps. */
  VIDEO_PROFILE_PORTRAIT_720P_5 = 1054,
  /** 1055: 720 &times; 960, frame rate 30 fps, bitrate 1380 Kbps. */
  VIDEO_PROFILE_PORTRAIT_720P_6 = 1055,
  /** 1060: 1080 &times; 1920, frame rate 15 fps, bitrate 2080 Kbps. */
  VIDEO_PROFILE_PORTRAIT_1080P = 1060,
  /** 1062: 1080 &times; 1920, frame rate 30 fps, bitrate 3150 Kbps. */
  VIDEO_PROFILE_PORTRAIT_1080P_3 = 1062,
  /** 1064: 1080 &times; 1920, frame rate 60 fps, bitrate 4780 Kbps. */
  VIDEO_PROFILE_PORTRAIT_1080P_5 = 1064,
  /** 1066: 1440 &times; 2560, frame rate 30 fps, bitrate 4850 Kbps. */
  VIDEO_PROFILE_PORTRAIT_1440P = 1066,
  /** 1067: 1440 &times; 2560, frame rate 60 fps, bitrate 6500 Kbps. */
  VIDEO_PROFILE_PORTRAIT_1440P_2 = 1067,
  /** 1070: 2160 &times; 3840, frame rate 30 fps, bitrate 6500 Kbps. */
  VIDEO_PROFILE_PORTRAIT_4K = 1070,
  /** 1072: 2160 &times; 3840, frame rate 60 fps, bitrate 6500 Kbps. */
  VIDEO_PROFILE_PORTRAIT_4K_3 = 1072,
  /** Default 640 &times; 360, frame rate 15 fps, bitrate 400 Kbps. */
  VIDEO_PROFILE_DEFAULT = VIDEO_PROFILE_LANDSCAPE_360P,
}
/** Events during the RTMP or RTMPS streaming.
 *
 * @since v3.2.0
 */
export enum RTMP_STREAMING_EVENT {
  /** 1: An error occurs when you add a background image or a watermark image to the RTMP or RTMPS stream.
   */
  RTMP_STREAMING_EVENT_FAILED_LOAD_IMAGE = 1,
  /** 2: The streaming URL is already being used for Media Push. If you want to start new streaming, use a new streaming URL.
   *
   * @since v3.4.5
   */
  RTMP_STREAMING_EVENT_URL_ALREADY_IN_USE = 2,
  /** 3: The feature is not supported.
   *
   * @since v3.6.1.4
   */
  RTMP_STREAMING_EVENT_ADVANCED_FEATURE_NOT_SUPPORT = 3,
  /** 4: Reserved.
   *
   * @since v3.6.1.4
   */
  RTMP_STREAMING_EVENT_REQUEST_TOO_OFTEN = 4,
}
/** The options for SDK preset audio effects.
 *
 * @since v3.2.0
 */
export enum AUDIO_EFFECT_PRESET {
  /** Turn off audio effects and use the original voice.
   */
  AUDIO_EFFECT_OFF = 0x00000000,
  /** An audio effect typical of a KTV venue.
   *
   * @note To achieve better audio effect quality, Agora recommends
   * calling {@link setAudioProfile}
   * and setting the `profile` parameter to `4` or `5`
   * before setting this enumerator.
   */
  ROOM_ACOUSTICS_KTV = 0x02010100,
  /** An audio effect typical of a concert hall.
   *
   * @note To achieve better audio effect quality, Agora recommends
   * calling {@link setAudioProfile}
   * and setting the `profile` parameter to `4` or `5`
   * before setting this enumerator.
   */
  ROOM_ACOUSTICS_VOCAL_CONCERT = 0x02010200,
  /** An audio effect typical of a recording studio.
   *
   * @note To achieve better audio effect quality, Agora recommends
   * calling {@link setAudioProfile}
   * and setting the `profile` parameter to `4` or `5`
   * before setting this enumerator.
   */
  ROOM_ACOUSTICS_STUDIO = 0x02010300,
  /** An audio effect typical of a vintage phonograph.
   *
   * @note To achieve better audio effect quality, Agora recommends
   * calling {@link setAudioProfile}
   * and setting the `profile` parameter to `4` or `5`
   * before setting this enumerator.
   */
  ROOM_ACOUSTICS_PHONOGRAPH = 0x02010400,
  /** A virtual stereo effect that renders monophonic audio as stereo audio.
   *
   * @note Call {@link setAudioProfile} and set the `profile` parameter to
   * `3` or `5` before setting this
   * enumerator; otherwise, the enumerator setting does not take effect.
   */
  ROOM_ACOUSTICS_VIRTUAL_STEREO = 0x02010500,
  /** A more spatial audio effect.
   *
   * @note To achieve better audio effect quality, Agora recommends
   * calling {@link setAudioProfile}
   * and setting the `profile` parameter to `4` or `5`
   * before setting this enumerator.
   */
  ROOM_ACOUSTICS_SPACIAL = 0x02010600,
  /** A more ethereal audio effect.
   *
   * @note To achieve better audio effect quality, Agora recommends
   * calling {@link setAudioProfile}
   * and setting the `profile` parameter to `4` or `5`
   * before setting this enumerator.
   */
  ROOM_ACOUSTICS_ETHEREAL = 0x02010700,
  /** A 3D voice effect that makes the voice appear to be moving around
   * the user. The default cycle period of the 3D
   * voice effect is 10 seconds. To change the cycle period,
   * call {@link setAudioEffectParameters}
   * after this method.
   *
   * @note
   * - Call {@link setAudioProfile} and set the `profile` parameter to `3`
   * or `5` before setting this enumerator; otherwise, the enumerator
   * setting does not take effect.
   * - If the 3D voice effect is enabled, users need to use stereo audio
   * playback devices to hear the anticipated voice effect.
   */
  ROOM_ACOUSTICS_3D_VOICE = 0x02010800,
  /** The voice of an uncle.
   *
   * @note
   * - Agora recommends using this enumerator to process a male-sounding
   * voice; otherwise, you may not hear the anticipated voice effect.
   * - To achieve better audio effect quality, Agora recommends
   * calling {@link setAudioProfile}
   * and setting the `profile` parameter to `4` or `5`
   * before setting this enumerator.
   */
  VOICE_CHANGER_EFFECT_UNCLE = 0x02020100,
  /** The voice of an old man.
   *
   * @note
   * - Agora recommends using this enumerator to process a male-sounding
   * voice; otherwise, you may not hear the anticipated voice effect.
   * - To achieve better audio effect quality, Agora recommends
   * calling {@link setAudioProfile}
   * and setting the `profile` parameter to `4` or `5`
   * before setting this enumerator.
   */
  VOICE_CHANGER_EFFECT_OLDMAN = 0x02020200,
  /** The voice of a boy.
   *
   * @note
   * - Agora recommends using this enumerator to process a male-sounding
   * voice; otherwise, you may not hear the anticipated voice effect.
   * - To achieve better audio effect quality, Agora recommends
   * calling {@link setAudioProfile}
   * and setting the `profile` parameter to `4` or `5`
   * before setting this enumerator.
   */
  VOICE_CHANGER_EFFECT_BOY = 0x02020300,
  /** The voice of a young woman.
   *
   * @note
   * - Agora recommends using this enumerator to process a female-sounding
   * voice; otherwise, you may not hear the anticipated voice effect.
   * - To achieve better audio effect quality, Agora recommends
   * calling {@link setAudioProfile}
   * and setting the `profile` parameter to `4` or `5`
   * before setting this enumerator.
   */
  VOICE_CHANGER_EFFECT_SISTER = 0x02020400,
  /** The voice of a girl.
   *
   * @note
   * - Agora recommends using this enumerator to process a female-sounding
   * voice; otherwise, you may not hear the anticipated voice effect.
   * - To achieve better audio effect quality, Agora recommends
   * calling {@link setAudioProfile}
   * and setting the `profile` parameter to `4` or `5`
   * before setting this enumerator.
   */
  VOICE_CHANGER_EFFECT_GIRL = 0x02020500,
  /** The voice of Pig King, a character in Journey to the West who has a
   * voice like a growling bear.
   *
   * @note To achieve better audio effect quality, Agora recommends
   * calling {@link setAudioProfile}
   * and setting the `profile` parameter to `4` or `5`
   * before setting this enumerator.
   */
  VOICE_CHANGER_EFFECT_PIGKING = 0x02020600,
  /** The voice of Hulk.
   *
   * @note To achieve better audio effect quality, Agora recommends
   * calling {@link setAudioProfile}
   * and setting the `profile` parameter to `4` or `5`
   * before setting this enumerator.
   */
  VOICE_CHANGER_EFFECT_HULK = 0x02020700,
  /** An audio effect typical of R&B music.
   *
   * @note Call {@link setAudioProfile} and set the `profile` parameter
   * to `4` or `5` before setting this enumerator; otherwise, the enumerator
   * setting does not take effect.
   */
  STYLE_TRANSFORMATION_RNB = 0x02030100,
  /** An audio effect typical of popular music.
   *
   * @note Call {@link setAudioProfile} and set the `profile` parameter
   * to `4` or `5` before setting this enumerator; otherwise, the enumerator
   * setting does not take effect.
   */
  STYLE_TRANSFORMATION_POPULAR = 0x02030200,
  /** A pitch correction effect that corrects the user's pitch based on
   * the pitch of the natural C major scale.
   * To change the basic mode and tonic pitch,
   * call {@link setAudioEffectParameters} after this method.
   *
   * @note To achieve better audio effect quality, Agora recommends
   * calling {@link setAudioProfile}
   * and setting the `profile` parameter to `4` or `5`
   * before setting this enumerator.
   */
  PITCH_CORRECTION = 0x02040100,
}

/** The options for SDK preset voice beautifier effects.
 */
export enum VOICE_BEAUTIFIER_PRESET {
  /** Turn off voice beautifier effects and use the original voice.
   */
  VOICE_BEAUTIFIER_OFF = 0x00000000,
  /** A more magnetic voice.
   *
   * @note Agora recommends using this enumerator to process a male-sounding
   * voice; otherwise, you may experience vocal distortion.
   */
  CHAT_BEAUTIFIER_MAGNETIC = 0x01010100,
  /** A fresher voice.
   *
   * @note Agora recommends using this enumerator to process a
   * female-sounding voice; otherwise, you may experience vocal distortion.
   */
  CHAT_BEAUTIFIER_FRESH = 0x01010200,
  /** A more vital voice.
   *
   * @note Agora recommends using this enumerator to process a
   * female-sounding voice; otherwise, you may experience vocal distortion.
   */
  CHAT_BEAUTIFIER_VITALITY = 0x01010300,
  /**
   * @since v3.3.1
   *
   * Singing beautifier effect.
   * - If you call {@link setVoiceBeautifierPreset}(SINGING_BEAUTIFIER),
   * you can beautify a male-sounding voice and add a reverberation
   * effect that sounds like singing in a small room. Agora recommends not
   * using {@link setVoiceBeautifierPreset}(SINGING_BEAUTIFIER)
   * to process a female-sounding voice; otherwise, you may experience vocal
   * distortion.
   * - If you call {@link setVoiceBeautifierParameters}(SINGING_BEAUTIFIER,
   * param1, param2), you can beautify a male- or female-sounding voice and
   * add a reverberation effect.
   */
  SINGING_BEAUTIFIER = 0x01020100,
  /** A more vigorous voice.
   */
  TIMBRE_TRANSFORMATION_VIGOROUS = 0x01030100,
  /** A deeper voice.
   */
  TIMBRE_TRANSFORMATION_DEEP = 0x01030200,
  /** A mellower voice.
   */
  TIMBRE_TRANSFORMATION_MELLOW = 0x01030300,
  /** A falsetto voice.
   */
  TIMBRE_TRANSFORMATION_FALSETTO = 0x01030400,
  /** A fuller voice.
   */
  TIMBRE_TRANSFORMATION_FULL = 0x01030500,
  /** A clearer voice.
   */
  TIMBRE_TRANSFORMATION_CLEAR = 0x01030600,
  /** A more resounding voice.
   */
  TIMBRE_TRANSFORMATION_RESOUNDING = 0x01030700,
  /** A more ringing voice.
   */
  TIMBRE_TRANSFORMATION_RINGING = 0x01030800,
}
/** The latency level of an audience member in interactive live streaming.
 *
 * @note Takes effect only when the user role is audience.
 */
export enum AUDIENCE_LATENCY_LEVEL_TYPE {
  /** 1: Low latency. */
  AUDIENCE_LATENCY_LEVEL_LOW_LATENCY = 1,
  /** 2: (Default) Ultra low latency. */
  AUDIENCE_LATENCY_LEVEL_ULTRA_LOW_LATENCY = 2,
}
/** The subscribing state.
 *
 * @since v3.2.0
 *
 * - 0: The initial subscribing state after joining the channel.
 * - 1: Fails to subscribe to the remote stream. Possible reasons:
 *   - The remote user:
 *     - Calls {@link muteLocalAudioStream muteLocalAudioStream(true)} or
 * {@link muteLocalVideoStream muteLocalVideoStream(true)} to stop
 * sending local streams.
 *     - Calls {@link disableAudio} or {@link disableVideo} to disable the
 * entire audio or video modules.
 *     - Calls {@link enableLocalAudio enableLocalAudio(false)} or
 * {@link enableLocalVideo enableLocalVideo(false)} to disable the local
 * audio sampling or video capturing.
 *     - The role of the remote user is `2` (audience).
 *   - The local user calls the following methods to stop receiving remote
 * streams:
 *     - Calls {@link muteRemoteAudioStream muteRemoteAudioStream(true)},
 * {@link muteAllRemoteAudioStreams muteAllRemoteAudioStreams(true)}, or
 * {@link setDefaultMuteAllRemoteAudioStreams setDefaultMuteAllRemoteAudioStreams(true)}
 * to stop receiving remote audio streams.
 *     - Calls {@link muteRemoteVideoStream muteRemoteVideoStream(true)},
 * {@link muteAllRemoteVideoStreams muteAllRemoteVideoStreams(true)}, or
 * {@link setDefaultMuteAllRemoteVideoStreams setDefaultMuteAllRemoteVideoStreams(true)}
 * to stop receiving remote video streams.
 * - 2: Subscribing.
 * - 3: Subscribes to and receives the remote stream successfully.
 */
export enum STREAM_SUBSCRIBE_STATE {
  /** 0: The initial subscribing state after joining the channel.
   */
  SUB_STATE_IDLE = 0,
  /** 1: Fails to subscribe to the remote stream. Possible reasons:
   * - The remote user:
   *  - Calls \ref IRtcEngine::muteLocalAudioStream "muteLocalAudioStream(true)" or \ref IRtcEngine::muteLocalVideoStream "muteLocalVideoStream(true)" to stop sending local streams.
   *  - Calls \ref IRtcEngine::disableAudio "disableAudio" or \ref IRtcEngine::disableVideo "disableVideo" to disable the entire audio or video modules.
   *  - Calls \ref IRtcEngine::enableLocalAudio "enableLocalAudio(false)" or \ref IRtcEngine::enableLocalVideo "enableLocalVideo(false)" to disable the local audio sampling or video capturing.
   *  - The role of the remote user is `AUDIENCE`.
   * - The local user calls the following methods to stop receiving remote streams:
   *  - Calls \ref IRtcEngine::muteRemoteAudioStream "muteRemoteAudioStream(true)", \ref IRtcEngine::muteAllRemoteAudioStreams "muteAllRemoteAudioStreams(true)", or \ref IRtcEngine::setDefaultMuteAllRemoteAudioStreams "setDefaultMuteAllRemoteAudioStreams(true)" to stop receiving remote audio streams.
   *  - Calls \ref IRtcEngine::muteRemoteVideoStream "muteRemoteVideoStream(true)", \ref IRtcEngine::muteAllRemoteVideoStreams "muteAllRemoteVideoStreams(true)", or \ref IRtcEngine::setDefaultMuteAllRemoteVideoStreams "setDefaultMuteAllRemoteVideoStreams(true)" to stop receiving remote video streams.
   */
  SUB_STATE_NO_SUBSCRIBED = 1,
  /** 2: Subscribing.
   */
  SUB_STATE_SUBSCRIBING = 2,
  /** 3: Subscribes to and receives the remote stream successfully.
   */
  SUB_STATE_SUBSCRIBED = 3,
}

/**
 * The definition of {@link ChannelMediaInfo}.
 */
export interface ChannelMediaInfo {
  /**
   * The channel name.
   *
   * The default value is NULL, which means that
   * the SDK applies the current channel name.
   */
  channelName: string;
  /**
   * The token that enables the user to join the channel.
   *
   * The default value is NULL, which means that the SDK applies the current
   * token.
   */
  token: string;
  /**
   * The user ID.
   */
  uid: number;
}
/**
 * The channel media options.
 */
export interface ChannelMediaOptions {
  /**
   * Determines whether to subscribe to audio streams when the user joins the
   * channel:
   * - true: (Default) Subscribe.
   * - false: Do not subscribe.
   *
   * This member serves a similar function to the
   * `muteAllRemoteAudioStreams` method. After joining
   * the channel, you can call the `muteAllRemoteAudioStreams` method to set
   * whether to subscribe to audio streams in the channel.
   */
  autoSubscribeAudio: boolean;
  /**
   * Determines whether to subscribe to video streams when the user joins the
   * channel:
   * - true: (Default) Subscribe.
   * - false: Do not subscribe.
   *
   * This member serves a similar function to the
   * `muteAllRemoteVideoStreams` method. After joining
   * the channel, you can call the `muteAllRemoteVideoStreams` method to set
   * whether to subscribe to video streams in the channel.
   */
  autoSubscribeVideo: boolean;
  /** Determines whether to publish the local audio stream when the user joins
   * a channel:
   * - true: (Default) Publish.
   * - false: Do not publish.
   *
   * This member serves a similar function to the `muteLocalAudioStream` method.
   * After the user joins the channel, you can call the `muteLocalAudioStream`
   * method to set whether to publish the local audio stream in the channel.
   *
   * @since v3.4.5
   */
  publishLocalAudio: boolean;
  /** Determines whether to publish the local video stream when the user joins
   * a channel:
   * - true: (Default) Publish.
   * - false: Do not publish.
   *
   * This member serves a similar function to the `muteLocalVideoStream` method.
   * After the user joins the channel, you can call the `muteLocalVideoStream`
   * method to set whether to publish the local video stream in the channel.
   *
   * @since v3.4.5
   */
  publishLocalVideo: boolean;
}
/**
 * The watermark's options.
 *
 * @since v3.0.0
 */
export interface WatermarkOptions {
  /**
   * Sets whether or not the watermark image is visible in the local video
   * preview:
   * - true: (Default) The watermark image is visible in preview.
   * - false: The watermark image is not visible in preview.
   */
  visibleInPreview: boolean;
  /**
   * The watermark position in the portrait mode. See {@link Rectangle}
   */
  positionInPortraitMode: Rectangle;
  /**
   * The watermark position in the landscape mode. See {@link Rectangle}
   */
  positionInLandscapeMode: Rectangle;
}

/**
 * The configuration of the media stream relay.
 *
 * **Warning**:
 * - If you want to relay the media stream to multiple channels, define as
 * many {@link ChannelMediaInfo} interface (at most four).
 *
 */

export interface ChannelMediaRelayConfiguration {
  /**
   * The information of the source channel. See {@link ChannelMediaInfo}
   *
   * It contains the following properties:
   *
   * - **Note**:
   *  - If you have not enabled the App Certificate, Token is unnecessary here
   * and set the following properties as the default value.
   *  - If you have enabled the App Certificate, you must use Token.
   *
   * - `channel`: The name of the source channel. The default value is NULL,
   * which means that the SDK passes in the name of the current channel.
   * - `token`: Token for joining the source channel. It is generated with
   * `channel` and `uid` you set in `srcInfo`. The default value is NULL,
   * which means that the SDK passes in the APP ID.
   * - `uid`:
   *  - ID of the host whose media stream you want to relay. The
   * default value is 0, which means that the SDK randomly generates a UID.
   *  - You must set it as 0.
   *
   */
  srcInfo: ChannelMediaInfo;
  /**
   * The information of the destination channel. See {@link ChannelMediaInfo}
   *
   * It contains the following properties:
   *
   * - `channel`: The name of the destination channel.
   * - `token`:Token for joining the destination channel.
   * It is generated with `channel` and `uid` you set in `destInfos`.
   *  - If you have not enabled the App Certificate, Token is unnecessary here
   * and set it as the default value NULL, which means that the SDK passes in
   * the APP ID.
   *  - If you have enabled the App Certificate, you must use Token.
   * - `uid`: ID of the host in the destination channel.
   * The value ranges from 0 to 2<sup>32</sup>-1. To avoid UID conflicts,
   * this `uid` must be different from any other UIDs in the destination
   * channel. The default value is 0, which means the SDK randomly generates
   * a UID.
   *
   */
  destInfos: [ChannelMediaInfo];
}

/** The event code in CHANNEL_MEDIA_RELAY_EVENT. */
export enum ChannelMediaRelayEvent {
  /** 0: The user disconnects from the server due to poor network
   * connections.
   */
  RELAY_EVENT_NETWORK_DISCONNECTED = 0,
  /** 1: The network reconnects.
   */
  RELAY_EVENT_NETWORK_CONNECTED = 1,
  /** 2: The user joins the source channel.
   */
  RELAY_EVENT_PACKET_JOINED_SRC_CHANNEL = 2,
  /** 3: The user joins the destination channel.
   */
  RELAY_EVENT_PACKET_JOINED_DEST_CHANNEL = 3,
  /** 4: The SDK starts relaying the media stream to the destination channel.
   */
  RELAY_EVENT_PACKET_SENT_TO_DEST_CHANNEL = 4,
  /** 5: The server receives the video stream from the source channel.
   */
  RELAY_EVENT_PACKET_RECEIVED_VIDEO_FROM_SRC = 5,
  /** 6: The server receives the audio stream from the source channel.
   */
  RELAY_EVENT_PACKET_RECEIVED_AUDIO_FROM_SRC = 6,
  /** 7: The destination channel is updated.
   */
  RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL = 7,
  /** 8: The destination channel update fails due to internal reasons.
   */
  RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_REFUSED = 8,
  /** 9: The destination channel does not change, which means that the
   * destination channel fails to be updated.
   */
  RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_NOT_CHANGE = 9,
  /** 10: The destination channel name is NULL.
   */
  RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_IS_NULL = 10,
  /** 11: The video profile is sent to the server.
   */
  RELAY_EVENT_VIDEO_PROFILE_UPDATE = 11,
  /** 12: The SDK successfully pauses relaying the media stream to destination channels.
   *
   * @since v3.6.1.4
   */
  RELAY_EVENT_PAUSE_SEND_PACKET_TO_DEST_CHANNEL_SUCCESS = 12,
  /** 13: The SDK fails to pause relaying the media stream to destination channels.
   *
   * @since v3.6.1.4
   */
  RELAY_EVENT_PAUSE_SEND_PACKET_TO_DEST_CHANNEL_FAILED = 13,
  /** 14: The SDK successfully resumes relaying the media stream to destination channels.
   *
   * @since v3.6.1.4
   */
  RELAY_EVENT_RESUME_SEND_PACKET_TO_DEST_CHANNEL_SUCCESS = 14,
  /** 15: The SDK fails to resume relaying the media stream to destination channels.
   *
   * @since v3.6.1.4
   */
  RELAY_EVENT_RESUME_SEND_PACKET_TO_DEST_CHANNEL_FAILED = 15,
}
/**
 * The state code.
 * - 0: The SDK is initializing.
 * - 1: The SDK tries to relay the media stream to the destination channel.
 * - 2: The SDK successfully relays the media stream to the destination
 * channel.
 * - 3: A failure occurs. See the error code in
 * {@link ChannelMediaRelayError}.
 */
export enum ChannelMediaRelayState {
  /** 0: The initial state. After you successfully stop the channel media
   * relay by calling \ref IRtcEngine::stopChannelMediaRelay "stopChannelMediaRelay",
   * the \ref IRtcEngineEventHandler::onChannelMediaRelayStateChanged "onChannelMediaRelayStateChanged" callback returns this state.
   */
  RELAY_STATE_IDLE = 0,
  /** 1: The SDK tries to relay the media stream to the destination channel.
   */
  RELAY_STATE_CONNECTING = 1,
  /** 2: The SDK successfully relays the media stream to the destination
   * channel.
   */
  RELAY_STATE_RUNNING = 2,
  /** 3: A failure occurs. See the details in code.
   */
  RELAY_STATE_FAILURE = 3,
}
/**
 * The error code.
 * - 0: The state is normal.
 * - 1: An error occurs in the server response.
 * - 2: No server response. You can call the {@link leaveChannel} method to
 * leave the channel.
 * - 3: The SDK fails to access the service, probably due to limited resources
 * of the server.
 * - 4: Fails to send the relay request.
 * - 5: Fails to accept the relay request.
 * - 6: The server fails to receive the media stream.
 * - 7: The server fails to send the media stream.
 * - 8: The SDK disconnects from the server due to poor network connections.
 * You can call the {@link leaveChannel} method to leave the channel.
 * - 9: An internal error occurs in the server.
 * - 10: The token of the source channel has expired.
 * - 11: The token of the destination channel has expired.
 */
export enum ChannelMediaRelayError {
  /** 0: The state is normal.
   */
  RELAY_OK = 0,
  /** 1: An error occurs in the server response.
   */
  RELAY_ERROR_SERVER_ERROR_RESPONSE = 1,
  /** 2: No server response.
   *
   * You can call the
   * \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method to
   * leave the channel.
   *
   * This error can also occur if your project has not enabled co-host token
   * authentication. Contact support@agora.io to enable the co-host token
   * authentication service before starting a channel media relay.
   */
  RELAY_ERROR_SERVER_NO_RESPONSE = 2,
  /** 3: The SDK fails to access the service, probably due to limited
   * resources of the server.
   */
  RELAY_ERROR_NO_RESOURCE_AVAILABLE = 3,
  /** 4: Fails to send the relay request.
   */
  RELAY_ERROR_FAILED_JOIN_SRC = 4,
  /** 5: Fails to accept the relay request.
   */
  RELAY_ERROR_FAILED_JOIN_DEST = 5,
  /** 6: The server fails to receive the media stream.
   */
  RELAY_ERROR_FAILED_PACKET_RECEIVED_FROM_SRC = 6,
  /** 7: The server fails to send the media stream.
   */
  RELAY_ERROR_FAILED_PACKET_SENT_TO_DEST = 7,
  /** 8: The SDK disconnects from the server due to poor network
   * connections. You can call the \ref agora::rtc::IRtcEngine::leaveChannel
   * "leaveChannel" method to leave the channel.
   */
  RELAY_ERROR_SERVER_CONNECTION_LOST = 8,
  /** 9: An internal error occurs in the server.
   */
  RELAY_ERROR_INTERNAL_ERROR = 9,
  /** 10: The token of the source channel has expired.
   */
  RELAY_ERROR_SRC_TOKEN_EXPIRED = 10,
  /** 11: The token of the destination channel has expired.
   */
  RELAY_ERROR_DEST_TOKEN_EXPIRED = 11,
}

/**
 * Regions for connection.
 *
 * @since v3.2.0
 *
 * - 1: Mainland China.
 * - 2: North America.
 * - 4: Europe.
 * - 8: Asia, excluding Mainland China.
 * - 16: Japan.
 * - 32: India.
 * - 0xFFFFFFFF: (Default) Global.
 */
export type AREA_CODE =
  | 1 //AREA_CODE_CN = ,
  | 2 //AREA_CODE_NA = ,
  | 4 //AREA_CODE_EUR = ,
  | 8 //AREA_CODE_AS = ,
  | 16 //AREA_CODE_JAPAN = ,
  | 32 //AREA_CODE_INDIA = ,
  | 0xffffffff; //AREA_CODE_GLOBAL =
/** The publishing state.
 *
 * @since v3.2.0
 *
 * - 0: The initial publishing state after joining the channel.
 * - 1: Fails to publish the local stream. Possible reasons:
 *  - The local user calls
 * {@link muteLocalAudioStream muteLocalAudioStream(true)} or
 * {@link muteLocalVideoStream muteLocalVideoStream(true)} to stop
 * sending local streams.
 *  - The local user calls {@link disableAudio} or {@link disableVideo} to
 * disable the entire audio or video module.
 *  - The local user calls {@link enableLocalAudio enableLocalAudio(false)}
 * or {@link enableLocalVideo enableLocalVideo(false)} to disable the
 * local audio sampling or video capturing.
 *  - The role of the local user is `2` (audience).
 * - 2: Publishing.
 * - 3: Publishes successfully.
 */
export enum STREAM_PUBLISH_STATE {
  /** 0: The initial publishing state after joining the channel.
   */
  PUB_STATE_IDLE = 0,
  /** 1: Fails to publish the local stream. Possible reasons:
   * - The local user calls \ref IRtcEngine::muteLocalAudioStream "muteLocalAudioStream(true)" or \ref IRtcEngine::muteLocalVideoStream "muteLocalVideoStream(true)" to stop sending local streams.
   * - The local user calls \ref IRtcEngine::disableAudio "disableAudio" or \ref IRtcEngine::disableVideo "disableVideo" to disable the entire audio or video module.
   * - The local user calls \ref IRtcEngine::enableLocalAudio "enableLocalAudio(false)" or \ref IRtcEngine::enableLocalVideo "enableLocalVideo(false)" to disable the local audio sampling or video capturing.
   * - The role of the local user is `AUDIENCE`.
   */
  PUB_STATE_NO_PUBLISHED = 1,
  /** 2: Publishing.
   */
  PUB_STATE_PUBLISHING = 2,
  /** 3: Publishes successfully.
   */
  PUB_STATE_PUBLISHED = 3,
}

/**
 * Audio output routing.
 * - -1: Default.
 * - 0: Headset.
 * - 1: Earpiece.
 * - 2: Headset with no microphone.
 * - 3: Speakerphone.
 * - 4: Loudspeaker.
 * - 5: Bluetooth headset.
 * - 6: USB peripheral (macOS only).
 * - 7: HDMI peripheral (macOS only).
 * - 8: DisplayPort peripheral (macOS only).
 * - 9: Apple AirPlay (macOS only).
 */
export enum AUDIO_ROUTE_TYPE {
  /** -1: Default audio route.
   */
  AUDIO_ROUTE_DEFAULT = -1,
  /** 0: The audio route is a headset with a microphone.
   */
  AUDIO_ROUTE_HEADSET = 0,
  /** 1: The audio route is an earpiece.
   */
  AUDIO_ROUTE_EARPIECE = 1,
  /** 2: The audio route is a headset without a microphone.
   */
  AUDIO_ROUTE_HEADSET_NO_MIC = 2,
  /** 3: The audio route is the speaker that comes with the device.
   */
  AUDIO_ROUTE_SPEAKERPHONE = 3,
  /** 4: (iOS and macOS only) The audio route is an external speaker.
   */
  AUDIO_ROUTE_LOUDSPEAKER = 4,
  /** 5: The audio route is a Bluetooth headset.
   */
  AUDIO_ROUTE_BLUETOOTH = 5,
  /** 6: (macOS only) The audio route is a USB peripheral device.
   */
  AUDIO_ROUTE_USB = 6,
  /** 7: (macOS only) The audio route is an HDMI peripheral device.
   */
  AUDIO_ROUTE_HDMI = 7,
  /** 8: (macOS only) The audio route is a DisplayPort peripheral device.
   */
  AUDIO_ROUTE_DISPLAYPORT = 8,
  /** 9: (iOS and macOS only) The audio route is Apple AirPlay.
   */
  AUDIO_ROUTE_AIRPLAY = 9,
}

/**
 * The media metadata.
 */
export interface Metadata {
  /** ID of the user who sends the metadata.
   *
   * @note When sending the metadata, ignore this parameter. When receiving
   * the metadata, use this parameter to determine who sends the metadata.
   */
  uid: number;
  /**
   * The size of the metadata.
   */
  size: number;
  /**
   * The buffer of the metadata.
   */
  buffer: string;
  /** The timestamp (ms) that the metadata sends.
   */
  timeStampMs: number;
}

/** The detailed options of a user.
 */
export interface ClientRoleOptions {
  /**
   * The latency level of an audience member in interactive live streaming.
   */
  audienceLatencyLevel: AUDIENCE_LATENCY_LEVEL_TYPE;
}
/**
 * @since v3.3.1
 *
 * The cloud proxy type.
 * - 0: Do not use the cloud proxy.
 * - 1: The cloud proxy for the UDP protocol.
 * - 2: Reserved type.
 *
 */
export enum CLOUD_PROXY_TYPE {
  /** 0: Do not use the cloud proxy.
   */
  NONE_PROXY = 0,
  /** 1: The cloud proxy for the UDP protocol.
   */
  UDP_PROXY = 1,
  /// @cond
  /** 2: The cloud proxy for the TCP (encrypted) protocol.
   */
  TCP_PROXY = 2,
  /// @endcond
}
/** The configuration of the log files.
 *
 * @since v3.3.1
 */
export interface LogConfig {
  /** The absolute path of log files.
   *
   * Ensure that the directory for the log files exists and is writable.
   * You can use this parameter to rename the log files.
   */
  filePath: string;
  /** The size (KB) of a log file.
   *
   * The default value is 1024 KB. If you set
   * `fileSize` to 1024 KB, the SDK outputs at most 5 MB log files;
   * if you set it to less than 1024 KB, the setting is invalid, and the
   * maximum size of a log file is still 1024 KB.
   */
  fileSize: number;
  /** The output log level of the SDK:
   * - `0x0000`: Do not output any log.
   * - `0x0001`: (Default) Output logs of the FATAL, ERROR, WARN and INFO
   * level. We recommend setting your log filter as this level.
   * - `0x0002`: Output logs of the FATAL, ERROR and WARN level.
   * - `0x0004`: Output logs of the FATAL and ERROR level.
   * - `0x0008`: Output logs of the FATAL level.
   */
  level: number;
}
/** The options for SDK preset voice conversion effects.
 *
 * @since v3.3.1
 */
export enum VOICE_CONVERSION_PRESET {
  /** Turn off voice conversion effects and use the original voice.
   */
  VOICE_CONVERSION_OFF = 0x00000000,
  /** A gender-neutral voice. To avoid audio distortion, ensure that you use
   * this enumerator to process a female-sounding voice.
   */
  VOICE_CHANGER_NEUTRAL = 0x03010100,
  /** A sweet voice. To avoid audio distortion, ensure that you use this
   * enumerator to process a female-sounding voice.
   */
  VOICE_CHANGER_SWEET = 0x03010200,
  /** A steady voice. To avoid audio distortion, ensure that you use this
   * enumerator to process a male-sounding voice.
   */
  VOICE_CHANGER_SOLID = 0x03010300,
  /** A deep voice. To avoid audio distortion, ensure that you use this
   * enumerator to process a male-sounding voice.
   */
  VOICE_CHANGER_BASS = 0x03010400,
}

/** Local video state types.
 */
export enum LOCAL_VIDEO_STREAM_STATE {
  /** 0: Initial state. */
  LOCAL_VIDEO_STREAM_STATE_STOPPED = 0,
  /** 1: The local video capturing device starts successfully.
   *
   * The SDK also reports this state when you share a maximized window by calling {@link startScreenCaptureByWindow}.
   */
  LOCAL_VIDEO_STREAM_STATE_CAPTURING = 1,
  /** 2: The first video frame is successfully encoded. */
  LOCAL_VIDEO_STREAM_STATE_ENCODING = 2,
  /** 3: The local video fails to start. */
  LOCAL_VIDEO_STREAM_STATE_FAILED = 3,
}

/** Local video state error codes.
 */
export enum LOCAL_VIDEO_STREAM_ERROR {
  /** 0: The local video is normal. */
  LOCAL_VIDEO_STREAM_ERROR_OK = 0,
  /** 1: No specified reason for the local video failure. */
  LOCAL_VIDEO_STREAM_ERROR_FAILURE = 1,
  /** 2: No permission to use the local video capturing device. */
  LOCAL_VIDEO_STREAM_ERROR_DEVICE_NO_PERMISSION = 2,
  /** 3: The local video capturing device is in use. */
  LOCAL_VIDEO_STREAM_ERROR_DEVICE_BUSY = 3,
  /** 4: The local video capture fails. Check whether the capturing device is working properly. */
  LOCAL_VIDEO_STREAM_ERROR_CAPTURE_FAILURE = 4,
  /** 5: The local video encoding fails. */
  LOCAL_VIDEO_STREAM_ERROR_ENCODE_FAILURE = 5,
  /** 6: (iOS only) The application is in the background.
   *
   * @since v3.3.0
   */
  LOCAL_VIDEO_STREAM_ERROR_CAPTURE_INBACKGROUND = 6,
  /** 7: (iOS only) The application is running in Slide Over, Split View, or Picture in Picture mode.
   *
   * @since v3.3.0
   */
  LOCAL_VIDEO_STREAM_ERROR_CAPTURE_MULTIPLE_FOREGROUND_APPS = 7,
  /**
   * 8: The SDK cannot find the local video capture device.
   *
   * @since v3.4.0
   */
  LOCAL_VIDEO_STREAM_ERROR_DEVICE_NOT_FOUND = 8,
  /**
   * 10: (macOS and Windows only) The SDK cannot find the video device in the video device list. Check whether the ID
   * of the video device is valid.
   *
   * @since v3.6.1.4
   */
  LOCAL_VIDEO_STREAM_ERROR_DEVICE_INVALID_ID = 10,
  /**
   * 11: The shared window is minimized when you call
   * \ref IRtcEngine::startScreenCaptureByWindowId "startScreenCaptureByWindowId"
   * to share a window.
   */
  LOCAL_VIDEO_STREAM_ERROR_SCREEN_CAPTURE_WINDOW_MINIMIZED = 11,
  /** 12: The error code indicates that a window shared by the window ID has been closed, or a full-screen window
   * shared by the window ID has exited full-screen mode.
   * After exiting full-screen mode, remote users cannot see the shared window. To prevent remote users from seeing a
   * black screen, Agora recommends that you immediately stop screen sharing.
   *
   * Common scenarios for reporting this error code:
   * - When the local user closes the shared window, the SDK reports this error code.
   * - The local user shows some slides in full-screen mode first, and then shares the windows of the slides. After
   * the user exits full-screen mode, the SDK reports this error code.
   * - The local user watches web video or reads web document in full-screen mode first, and then shares the window of
   * the web video or document. After the user exits full-screen mode, the SDK reports this error code.
   */
  LOCAL_VIDEO_STREAM_ERROR_SCREEN_CAPTURE_WINDOW_CLOSED = 12,
  /**
   * 13: (Windows only) The window being shared is overlapped by another window, so the overlapped area is blacked out by
   * the SDK during window sharing.
   *
   * @since v3.6.1.4
   */
  LOCAL_VIDEO_STREAM_ERROR_SCREEN_CAPTURE_WINDOW_OCCLUDED = 13,
  /**
   * 20: (Windows only) The SDK does not support sharing this type of window.
   *
   * @since v3.6.1.4
   */
  LOCAL_VIDEO_STREAM_ERROR_SCREEN_CAPTURE_WINDOW_NOT_SUPPORTED = 20,
  /** 21: The screen capture fails. */
  LOCAL_VIDEO_STREAM_ERROR_SCREEN_CAPTURE_FAILURE = 21,
  LOCAL_VIDEO_STREAM_ERROR_SCREEN_CAPTURE_NO_PERMISSION = 22,
  /** 23: (Windows only The screen capture fails with invalid parameters. */
  LOCAL_VIDEO_STREAM_ERROR_SCREEN_CAPTURE_INVALID_PARAMETERS = 23,
  /**
   * 24: (Windows only The screen capture auto fallback to GDI
   * When this error occurs, it means that the screen sharing failed to filter the specified window list of the user. Mowever, the sereen sharing is still ongoing.
   *
   * @since v3.6.1.17
   */
  LOCAL_VIDEO_STREAM_ERROR_SCREEN_CAPTURE_AUTO_FALLBACK = 24,
}

/** Local audio state types.
 */
export enum LOCAL_AUDIO_STREAM_STATE {
  /** 0: The local audio is in the initial state.
   */
  LOCAL_AUDIO_STREAM_STATE_STOPPED = 0,
  /** 1: The recording device starts successfully.
   */
  LOCAL_AUDIO_STREAM_STATE_RECORDING = 1,
  /** 2: The first audio frame encodes successfully.
   */
  LOCAL_AUDIO_STREAM_STATE_ENCODING = 2,
  /** 3: The local audio fails to start.
   */
  LOCAL_AUDIO_STREAM_STATE_FAILED = 3,
}

/** Local audio state error codes.
 */
export enum LOCAL_AUDIO_STREAM_ERROR {
  /** 0: The local audio is normal.
   */
  LOCAL_AUDIO_STREAM_ERROR_OK = 0,
  /** 1: No specified reason for the local audio failure.
   */
  LOCAL_AUDIO_STREAM_ERROR_FAILURE = 1,
  /** 2: No permission to use the local audio device.
   */
  LOCAL_AUDIO_STREAM_ERROR_DEVICE_NO_PERMISSION = 2,
  /** 3: The microphone is in use.
   */
  LOCAL_AUDIO_STREAM_ERROR_DEVICE_BUSY = 3,
  /** 4: The local audio capturing fails. Check whether the capturing device
   * is working properly.
   */
  LOCAL_AUDIO_STREAM_ERROR_RECORD_FAILURE = 4,
  /** 5: The local audio encoding fails.
   */
  LOCAL_AUDIO_STREAM_ERROR_ENCODE_FAILURE = 5,
  /** 6: The SDK cannot find the local audio recording device.
   *
   * @since v3.4.0
   */
  LOCAL_AUDIO_STREAM_ERROR_NO_RECORDING_DEVICE = 6,
  /** 7: The SDK cannot find the local audio playback device.
   *
   * @since v3.4.0
   */
  LOCAL_AUDIO_STREAM_ERROR_NO_PLAYOUT_DEVICE = 7,
  /**
   * 8: The local audio capturing is interrupted by the system call.
   */
  LOCAL_AUDIO_STREAM_ERROR_INTERRUPTED = 8,
  /** 9: An invalid audio capture device ID.
   *
   * @since v3.6.1.4
   */
  LOCAL_AUDIO_STREAM_ERROR_RECORD_INVALID_ID = 9,
  /** 10: An invalid audio playback device ID.
   *
   * @since v3.6.1.4
   */
  LOCAL_AUDIO_STREAM_ERROR_PLAYOUT_INVALID_ID = 10,
}

/**
 * The reason why the virtual background is not successfully enabled or the
 * message that confirms success.
 *
 * @since v3.4.5
 */
export enum VIRTUAL_BACKGROUND_SOURCE_STATE_REASON {
  /**
   * 0: The virtual background is successfully enabled.
   */
  VIRTUAL_BACKGROUND_SOURCE_STATE_REASON_SUCCESS = 0,
  /**
   * 1: The custom background image does not exist. Please check the value of
   * `source` in {@link VirtualBackgroundSource}.
   */
  VIRTUAL_BACKGROUND_SOURCE_STATE_REASON_IMAGE_NOT_EXIST = 1,
  /**
   * 2: The color format of the custom background image is invalid. Please
   * check the value of `color` in {@link VirtualBackgroundSource}.
   */
  VIRTUAL_BACKGROUND_SOURCE_STATE_REASON_COLOR_FORMAT_NOT_SUPPORTED = 2,
  /**
   * 3: The device does not support using the virtual background.
   */
  VIRTUAL_BACKGROUND_SOURCE_STATE_REASON_DEVICE_NOT_SUPPORTED = 3,
}

/** The configurations for the data stream.
 *
 * @since v3.3.1
 *
 * <table>
 * <thead>
 *   <tr>
 *     <th>`syncWithAudio`</th>
 *     <th>`ordered`</th>
 *     <th>SDK behaviors</th>
 *   </tr>
 * </thead>
 * <tbody>
 *   <tr>
 *     <td>false</td>
 *     <td>false</td>
 *     <td>The SDK triggers the <br>`streamMessage`<br> callback immediately
 * after the receiver receives a data packet.</td>
 *   </tr>
 *   <tr>
 *     <td>true</td>
 *     <td>false</td>
 *     <td>If the data packet delay is within the audio delay, the SDK
 * triggers the <br>`streamMessage`<br> callback when the synchronized audio
 * packet is played out.<br>If the data packet delay exceeds the audio delay,
 * the SDK triggers the <br>`streamMessage`<br> callback as soon as the data
 * packet is received. In this case, the data packet is not synchronized with
 * the audio packet.</td>
 *   </tr>
 *   <tr>
 *     <td>false</td>
 *     <td>true</td>
 *     <td>If the delay of a data packet is within five seconds, the SDK
 * corrects the order of the data packet.<br>If the delay of a data packet
 * exceeds five seconds, the SDK discards the data packet.</td>
 *   </tr>
 *   <tr>
 *     <td>true</td>
 *     <td>true</td>
 *     <td>If the delay of a data packet is within the audio delay, the SDK
 * corrects the order of the data packet.<br>If the delay of a data packet
 * exceeds the audio delay, the SDK discards this data packet.</td>
 *   </tr>
 * </tbody>
 * </table>
 *
 */
export interface DataStreamConfig {
  /** Whether to synchronize the data packet with the published audio packet.
   *
   * - true: Synchronize the data packet with the audio packet.
   * - false: Do not synchronize the data packet with the audio packet.
   *
   * When you set the data packet to synchronize with the audio, then if the
   * data
   * packet delay is within the audio delay, the SDK triggers the
   * `streamMessage` callback when
   * the synchronized audio packet is played out. Do not set this parameter
   * as `true` if you
   * need the receiver to receive the data packet immediately. Agora
   * recommends that you set
   * this parameter to `true` only when you need to implement specific
   * functions, for example
   * lyric synchronization.
   */
  syncWithAudio: boolean;
  /** Whether the SDK guarantees that the receiver receives the data in the
   * sent order.
   *
   * - true: Guarantee that the receiver receives the data in the sent order.
   * - false: Do not guarantee that the receiver receives the data in the sent
   * order.
   *
   * Do not set this parameter to `true` if you need the receiver to receive
   * the data immediately.
   */
  ordered: boolean;
}

/** Network type. */
export enum NETWORK_TYPE {
  /** -1: The network type is unknown. */
  NETWORK_TYPE_UNKNOWN = -1,
  /** 0: The SDK disconnects from the network. */
  NETWORK_TYPE_DISCONNECTED = 0,
  /** 1: The network type is LAN. */
  NETWORK_TYPE_LAN = 1,
  /** 2: The network type is Wi-Fi (including hotspots). */
  NETWORK_TYPE_WIFI = 2,
  /** 3: The network type is mobile 2G. */
  NETWORK_TYPE_MOBILE_2G = 3,
  /** 4: The network type is mobile 3G. */
  NETWORK_TYPE_MOBILE_3G = 4,
  /** 5: The network type is mobile 4G. */
  NETWORK_TYPE_MOBILE_4G = 5,
  /** 6: The network type is mobile 5G.
   *
   * @since v3.6.1.4
   */
  NETWORK_TYPE_MOBILE_5G = 6,
}

export interface DisplayId {
  id: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface DisplayInfo {
  displayId: DisplayId;
  height: number;
  width: number;
  image: Uint8Array;
  isActive: boolean;
  isBuiltin: boolean;
  isMain: boolean;
}

export interface WindowInfo {
  currentProcessId: number;
  height: number;
  image: Uint8Array;
  name: string;
  originHeight: number;
  originWidth: number;
  ownerName: string;
  processId: number;
  width: number;
  windowId: number;
  x: number;
  y: number;
}
/**
 * Audio recording quality, which is set in {@link startAudioRecordingWithConfig}.
 */
export enum AUDIO_RECORDING_QUALITY_TYPE {
  /** 0: Low quality. For example, the size of an AAC file with a sample rate
   * of 32,000 Hz and a 10-minute recording is approximately 1.2 MB.
   */
  AUDIO_RECORDING_QUALITY_LOW = 0,
  /** 1: (Default) Medium quality. For example, the size of an AAC file with
   * a sample rate of 32,000 Hz and a 10-minute recording is approximately
   * 2 MB.
   */
  AUDIO_RECORDING_QUALITY_MEDIUM = 1,
  /** 2: High quality. For example, the size of an AAC file with a sample rate
   * of 32,000 Hz and a 10-minute recording is approximately 3.75 MB.
   */
  AUDIO_RECORDING_QUALITY_HIGH = 2,
}

/** The type of the custom background image.
 *
 * @since v3.4.5
 */
export enum BACKGROUND_SOURCE_TYPE {
  /**
   * 1: (Default) The background image is a solid color.
   */
  BACKGROUND_COLOR = 1,
  /**
   * The background image is a file in PNG or JPG format.
   */
  BACKGROUND_IMG,
  /**
   * The background image is blurred.
   *
   * @since v3.6.1.4
   */
  BACKGROUND_BLUR,
}

/**
 * Recording content, which is set in {@link startAudioRecordingWithConfig}.
 */
export enum AUDIO_RECORDING_POSITION {
  /** 0: (Default) Records the mixed audio of the local user and all remote
   * users.
   */
  AUDIO_RECORDING_POSITION_MIXED_RECORDING_AND_PLAYBACK = 0,
  /** 1: Records the audio of the local user only.
   */
  AUDIO_RECORDING_POSITION_RECORDING = 1,
  /** 2: Records the audio of all remote users only.
   */
  AUDIO_RECORDING_POSITION_MIXED_PLAYBACK = 2,
}

/**
 * Recording configuration, which is set in {@link startAudioRecordingWithConfig}.
 *
 * @since v3.4.2
 */
export interface AudioRecordingConfiguration {
  /** The absolute path (including the filename extensions) of the recording
   * file. For example: `C:\music\audio.aac`.
   *
   * @note Ensure that the path you specify exists and is writable.
   */
  filePath: string;
  /** Audio recording quality. See {@link AUDIO_RECORDING_QUALITY_TYPE}.
   *
   * @note This parameter applies to AAC files only.
   */
  recordingQuality: AUDIO_RECORDING_QUALITY_TYPE;
  /**
   * Recording content. See {@link AUDIO_RECORDING_POSITION}.
   */
  recordingPosition: AUDIO_RECORDING_POSITION;
  /** Recording sample rate (Hz). The following values are supported:
   *
   * - `16000`
   * - (Default) `32000`
   * - `44100`
   * - `48000`
   *
   * @note If this parameter is set to `44100` or `48000`, for better
   * recording effects, Agora recommends recording WAV files or AAC files
   * whose `recordingQuality` is {@link AUDIO_RECORDING_QUALITY_MEDIUM} or
   * {@link AUDIO_RECORDING_QUALITY_HIGH}.
   */
  recordingSampleRate: number;
}

/**
 * The degree of blurring applied to the custom background image.
 *
 * @since v3.6.1.4
 */
export enum BACKGROUND_BLUR_DEGREE {
  /**
   * 1: The degree of blurring applied to the custom background image is low.
   * The user can almost see the background clearly.
   */
  BLUR_DEGREE_LOW = 1,
  /**
   * The degree of blurring applied to the custom background image is medium.
   * It is difficult for the user to recognize details in the background.
   */
  BLUR_DEGREE_MEDIUM,
  /**
   * (Default) The degree of blurring applied to the custom background image is high.
   * The user can barely see any distinguishing features in the background.
   */
  BLUR_DEGREE_HIGH,
}

/**
 * The channel mode. Set in {@link setAudioMixingDualMonoMode}.
 *
 * @since v3.6.1.4
 */
export enum AUDIO_MIXING_DUAL_MONO_MODE {
  /**
   * 0: Original mode.
   */
  AUDIO_MIXING_DUAL_MONO_AUTO = 0,
  /**
   * 1: Left channel mode. This mode replaces the audio of the right channel
   * with the audio of the left channel, which means the user can only hear
   * the audio of the left channel.
   */
  AUDIO_MIXING_DUAL_MONO_L = 1,
  /**
   * 2: Right channel mode. This mode replaces the audio of the left channel with
   * the audio of the right channel, which means the user can only hear the audio
   * of the right channel.
   */
  AUDIO_MIXING_DUAL_MONO_R = 2,
  /**
   * 3: Mixed channel mode. This mode mixes the audio of the left channel and
   * the right channel, which means the user can hear the audio of the left
   * channel and the right channel at the same time.
   */
  AUDIO_MIXING_DUAL_MONO_MIX = 3,
}

/**
 * The information of an audio file. This struct is reported
 * in the `requestAudioFileInfo` callback.
 *
 * @since v3.6.1.4
 */
export interface AudioFileInfo {
  /** The file path.
   */
  filePath: string;
  /** The file duration (ms).
   */
  durationMs: number;
}

/** The information acquisition state. This enum is reported
 * in `requestAudioFileInfo`.
 *
 * @since v3.6.1.4
 */
export enum AUDIO_FILE_INFO_ERROR {
  /** 0: Successfully get the information of an audio file.
   */
  AUDIO_FILE_INFO_ERROR_OK = 0,

  /** 1: Fail to get the information of an audio file.
   */
  AUDIO_FILE_INFO_ERROR_FAILURE = 1,
}

/** The custom background image.
 *
 * @since v3.4.5
 */
export interface VirtualBackgroundSource {
  /** The type of the custom background image.
   *
   * @since v3.4.5
   */
  background_source_type: BACKGROUND_SOURCE_TYPE;
  /**
   * The local absolute path of the custom background image. PNG and JPG formats
   * are supported. If the path is invalid, the SDK replaces the original
   * background image with a white background image.
   *
   * @note This parameter takes effect only when the type of the custom
   * background image is `BACKGROUND_IMG`.
   */
  source: string;
  /**
   * The color of the custom background image. The format is a hexadecimal
   * integer defined by RGB, without the # sign, such as `0xFFB6C1` for light pink.
   * The default value is `0xFFFFFF`, which signifies white. The value range
   * is `[0x000000,0xFFFFFF]`. If the value is invalid, the SDK replaces the
   * original background image with a white background image.
   *
   * @note This parameter takes effect only when the type of the custom
   * background image is `BACKGROUND_COLOR`.
   */
  color: number;

  /**
   * The degree of blurring applied to the custom background image. See #BACKGROUND_BLUR_DEGREE.
   *
   * @note This parameter takes effect only when the type of the custom background image is `BACKGROUND_BLUR`.
   *
   * @since v3.6.1.4
   */
  blur_degree: BACKGROUND_BLUR_DEGREE;
}
/**
 * interface for c++ addon (.node)
 * @ignore
 */
export interface NodeRtcEngine {
  /**
   * @ignore
   */
  initialize(
    appId: string,
    areaCode?: AREA_CODE,
    logConfig?: LogConfig
  ): number;
  /**
   * @ignore
   */
  createChannel(channel: string): any;
  /**
   * @ignore
   */
  getVersion(): string;
  /**
   * @ignore
   */
  getErrorDescription(errorCode: number): string;
  /**
   * @ignore
   */
  getConnectionState(): ConnectionState;
  /**
   * @ignore
   */
  joinChannel(
    token: string,
    channel: string,
    info: string,
    uid: number,
    options?: ChannelMediaOptions
  ): number;
  /**
   * @ignore
   */
  switchChannel(
    token: string,
    channel: string,
    options?: ChannelMediaOptions
  ): number;
  /**
   * @ignore
   */
  leaveChannel(): number;
  /**
   * @ignore
   */
  release(sync: boolean): number;
  /**
   * @ignore
   */
  setHighQualityAudioParameters(
    fullband: boolean,
    stereo: boolean,
    fullBitrate: boolean
  ): number;
  /**
   * @ignore
   */
  setupLocalVideo(): number;
  /**
   * @ignore
   */
  subscribe(uid: number, channel?: string): number;
  /**
   * @ignore
   */
  setVideoRenderDimension(
    rendertype: number,
    uid: number,
    width: number,
    height: number
  ): void;
  /**
   * @ignore
   */
  setFPS(fps: number): void;
  /**
   * @ignore
   */
  setHighFPS(fps: number): void;
  /**
   * @ignore
   */
  addToHighVideo(uid: number): void;
  /**
   * @ignore
   */
  removeFromHighVideo(uid: number): void;
  /**
   * @ignore
   */
  renewToken(newToken: string): number;
  /**
   * @ignore
   */
  setChannelProfile(profile: number): number;
  /**
   * @ignore
   */
  setClientRole(role: ClientRoleType): number;
  /**
   * @ignore
   */
  setClientRoleWithOptions(
    role: ClientRoleType,
    options: ClientRoleOptions
  ): number;
  /**
   * @ignore
   */
  startEchoTest(): number;
  /**
   * @ignore
   */
  stopEchoTest(): number;
  /**
   * @ignore
   */
  startEchoTestWithInterval(interval: number): number;
  /**
   * @ignore
   */
  enableLastmileTest(): number;
  /**
   * @ignore
   */
  disableLastmileTest(): number;
  /**
   * @ignore
   */
  startLastmileProbeTest(config: LastmileProbeConfig): number;
  /**
   * @ignore
   */
  stopLastmileProbeTest(): number;
  /**
   * @ignore
   */
  enableVideo(): number;
  /**
   * @ignore
   */
  disableVideo(): number;
  /**
   * @ignore
   */
  startPreview(): number;
  /**
   * @ignore
   */
  stopPreview(): number;
  /**
   * @ignore
   */
  setVideoProfile(
    profile: VIDEO_PROFILE_TYPE,
    swapWidthAndHeight: boolean
  ): number;
  /**
   * @ignore
   */
  setCameraCapturerConfiguration(config: CameraCapturerConfiguration): number;
  /**
   * @ignore
   */
  setVideoEncoderConfiguration(config: VideoEncoderConfiguration): number;
  /**
   * @ignore
   */
  setBeautyEffectOptions(enable: boolean, options: BeautyOptions): number;
  /**
   * @ignore
   */
  setRemoteUserPriority(uid: number, priority: Priority): number;
  /**
   * @ignore
   */
  enableAudio(): number;
  /**
   * @ignore
   */
  disableAudio(): number;
  /**
   * @ignore
   */
  setAudioProfile(profile: number, scenario: number): number;
  /**
   * @ignore
   */
  setVideoQualityParameters(preferFrameRateOverImageQuality: boolean): number;
  /**
   * @ignore
   */
  setEncryptionMode(mode: string): number;
  /**
   * @ignore
   */
  setEncryptionSecret(secret: string): number;
  /**
   * @ignore
   */
  muteLocalAudioStream(mute: boolean): number;
  /**
   * @ignore
   */
  muteAllRemoteAudioStreams(mute: boolean): number;
  /**
   * @ignore
   */
  setDefaultMuteAllRemoteAudioStreams(mute: boolean): number;
  /**
   * @ignore
   */
  muteRemoteAudioStream(uid: number, mute: boolean): number;
  /**
   * @ignore
   */
  muteLocalVideoStream(mute: boolean): number;
  /**
   * @ignore
   */
  enableLocalVideo(enable: boolean): number;
  /**
   * @ignore
   */
  enableLocalAudio(enable: boolean): number;
  /**
   * @ignore
   */
  muteAllRemoteVideoStreams(mute: boolean): number;
  /**
   * @ignore
   */
  setDefaultMuteAllRemoteVideoStreams(mute: boolean): number;
  /**
   * @ignore
   */
  enableAudioVolumeIndication(
    interval: number,
    smooth: number,
    report_vad: boolean
  ): number;
  /**
   * @ignore
   */
  muteRemoteVideoStream(uid: number, mute: boolean): number;
  /**
   * @ignore
   */
  setLogFile(filepath: string): number;
  /**
   * @ignore
   */
  setAddonLogFile(filepath: string): number;
  /**
   * @ignore
   */
  videoSourceSetAddonLogFile(filepath: string): number;
  /**
   * @ignore
   */
  getAudioTrackCount(): number;
  /**
   * @ignore
   */
  selectAudioTrack(index: number): number;
  /**
   * @ignore
   */
  takeSnapshot(channel: string, uid: number, filepath: string): number;
  /**
   * @ignore
   */
  startRtmpStreamWithoutTranscoding(url: string): number;
  /**
   * @ignore
   */
  startRtmpStreamWithTranscoding(
    url: string,
    transcoding: TranscodingConfig
  ): number;
  /**
   * @ignore
   */
  updateRtmpTranscoding(transcoding: TranscodingConfig): number;
  /**
   * @ignore
   */
  stopRtmpStream(url: string): number;
  /**
   * @ignore
   */
  setAVSyncSource(channelId: string, uid: number): number;
  /**
   * @ignore
   */
  followSystemPlaybackDevice(enable: boolean): number;
  /**
   * @ignore
   */
  followSystemRecordingDevice(enable: boolean): number;
  /**
   * @ignore
   */
  setLogFileSize(size: number): number;
  /**
   * @ignore
   */
  videoSourceSetLogFile(filepath: string): number;
  /**
   * @ignore
   */
  setLogFilter(filter: number): number;
  /**
   * @ignore
   */
  enableDualStreamMode(enable: boolean): number;
  /**
   * @ignore
   */
  setRemoteVideoStreamType(uid: number, streamType: StreamType): number;
  /**
   * @ignore
   */
  setRemoteDefaultVideoStreamType(streamType: StreamType): number;
  /**
   * @ignore
   */
  enableWebSdkInteroperability(enable: boolean): number;
  /**
   * @ignore
   */
  setLocalVideoMirrorMode(mirrorType: 0 | 1 | 2): number;
  /**
   * @ignore
   */
  setLocalVoicePitch(pitch: number): number;
  /**
   * @ignore
   */
  setLocalVoiceEqualization(bandFrequency: number, bandGain: number): number;
  /**
   * @ignore
   */
  setLocalVoiceReverb(reverbKey: number, value: number): number;
  /**
   * @ignore
   */
  setLocalVoiceChanger(preset: VoiceChangerPreset): number;
  /**
   * @ignore
   */
  setLocalVoiceReverbPreset(preset: AudioReverbPreset): number;
  /**
   * @ignore
   */
  setLocalPublishFallbackOption(option: 0 | 1 | 2): number;
  /**
   * @ignore
   */
  setRemoteSubscribeFallbackOption(option: 0 | 1 | 2): number;
  /**
   * @ignore
   */
  getVideoDevices(): Array<Object>;
  /**
   * @ignore
   */
  setVideoDevice(deviceId: string): number;
  /**
   * @ignore
   */
  getCurrentVideoDevice(): Object;
  /**
   * @ignore
   */
  startVideoDeviceTest(): number;
  /**
   * @ignore
   */
  stopVideoDeviceTest(): number;
  /**
   * @ignore
   */
  getAudioPlaybackDevices(): Array<Object>;
  /**
   * @ignore
   */
  setAudioPlaybackDevice(deviceId: string): number;
  /**
   * @ignore
   */
  getPlaybackDeviceInfo(deviceId: string, deviceName: string): number;
  /**
   * @ignore
   */
  getCurrentAudioPlaybackDevice(): Object;
  /**
   * @ignore
   */
  setAudioPlaybackVolume(volume: number): number;
  /**
   * @ignore
   */
  getAudioPlaybackVolume(): number;
  /**
   * @ignore
   */
  getAudioRecordingDevices(): Array<Object>;
  /**
   * @ignore
   */
  setAudioRecordingDevice(deviceId: string): number;
  /**
   * @ignore
   */
  getRecordingDeviceInfo(deviceId: string, deviceName: string): number;
  /**
   * @ignore
   */
  getCurrentAudioRecordingDevice(): Object;
  /**
   * @ignore
   */
  getAudioRecordingVolume(): number;
  /**
   * @ignore
   */
  setAudioRecordingVolume(volume: number): number;
  /**
   * @ignore
   */
  startAudioPlaybackDeviceTest(filepath: string): number;
  /**
   * @ignore
   */
  stopAudioPlaybackDeviceTest(): number;
  /**
   * @ignore
   */
  enableLoopbackRecording(enable: boolean, deviceName: string | null): number;
  /**
   * @ignore
   */
  startAudioRecording(
    filePath: string,
    sampleRate: number,
    quality: number,
    pos: number
  ): number;
  /**
   * @ignore
   */
  stopAudioRecording(): number;
  /**
   * @ignore
   */
  startAudioRecordingDeviceTest(indicateInterval: number): number;
  /**
   * @ignore
   */
  stopAudioRecordingDeviceTest(): number;
  /**
   * @ignore
   */
  startAudioDeviceLoopbackTest(interval: number): number;
  /**
   * @ignore
   */
  stopAudioDeviceLoopbackTest(): number;
  /**
   * @ignore
   */
  getAudioPlaybackDeviceMute(): boolean;
  /**
   * @ignore
   */
  setAudioPlaybackDeviceMute(mute: boolean): number;
  /**
   * @ignore
   */
  getAudioRecordingDeviceMute(): boolean;
  /**
   * @ignore
   */
  setAudioRecordingDeviceMute(mute: boolean): number;
  /**
   * @ignore
   */
  videoSourceInitialize(
    appId: string,
    areaCode: AREA_CODE,
    groupId?: string,
    bundleId?: string
  ): number;
  /**
   * @ignore
   */
  videoSourceEnableWebSdkInteroperability(enabled: boolean): number;
  /**
   * @ignore
   */
  videoSourceMuteAllRemoteVideoStreams(mute: boolean): number;
  /**
   * @ignore
   */
  videoSourceJoin(
    token: string,
    cname: string,
    info: string,
    uid: number,
    options?: ChannelMediaOptions
  ): number;
  /**
   * @ignore
   */
  videoSourceLeave(): number;
  /**
   * @ignore
   */
  videoSourceRenewToken(token: string): number;
  /**
   * @ignore
   */
  videoSourceSetChannelProfile(profile: number): number;
  /**
   * @ignore
   */
  videoSourceSetVideoProfile(
    profile: VIDEO_PROFILE_TYPE,
    swapWidthAndHeight: boolean
  ): number;
  /**
   * @ignore
   */
  videosourceStartScreenCaptureByScreen(
    screenSymbol: ScreenSymbol,
    rect: CaptureRect,
    param: CaptureParam
  ): number;
  /**
   * @ignore
   */
  videosourceStartScreenCaptureByWindow(
    windowSymbol: number,
    rect: CaptureRect,
    param: CaptureParam
  ): number;
  /**
   * @ignore
   */
  videosourceUpdateScreenCaptureParameters(param: CaptureParam): number;
  /**
   * @ignore
   */
  videosourceSetScreenCaptureContentHint(hint: VideoContentHint): number;

  videoSourceStartScreenCaptureByDisplayId(
    displayId: DisplayId,
    rect: CaptureRect,
    param: CaptureParam
  ): number;

  startScreenCaptureByDisplayId(
    displayId: DisplayId,
    rect: CaptureRect,
    param: CaptureParam
  ): number;
  /**
   * @ignore
   */
  getScreenWindowsInfo(callback: (list: WindowInfo[]) => void): void;
  /**
   * @ignore
   */
  getScreenDisplaysInfo(callback: (list: DisplayInfo[]) => void): void;
  /**
   * @ignore
   */
  getRealScreenDisplayInfo(callback: (list: DisplayInfo[]) => void): void;
  /**
   * @ignore
   */
  startScreenCapture2(
    windowId: number,
    captureFreq: number,
    rect: { left: number; right: number; top: number; bottom: number },
    bitrate: number
  ): number;
  /**
   * @ignore
   */
  stopScreenCapture2(): number;
  /**
   * @ignore
   */
  startScreenCaptureByWindow(
    windowSymbol: number,
    rect: CaptureRect,
    param: CaptureParam
  ): number;
  /**
   * @ignore
   */
  startScreenCaptureByScreen(
    screenSymbol: ScreenSymbol,
    rect: CaptureRect,
    param: CaptureParam
  ): number;
  /**
   * @ignore
   */
  updateScreenCaptureParameters(param: CaptureParam): number;
  /**
   * @ignore
   */
  setScreenCaptureContentHint(hint: VideoContentHint): number;
  /**
   * @ignore
   */
  videoSourceStartPreview(): number;
  /**
   * @ignore
   */
  videoSourceStopPreview(): number;
  /**
   * @ignore
   */
  videoSourceEnableDualStreamMode(enable: boolean): number;
  /**
   * @ignore
   */
  videoSourceSetParameter(parameter: string): number;
  /**
   * @ignore
   */
  videoSourceUpdateScreenCaptureRegion(rect: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }): number;
  /**
   * @ignore
   */
  videoSourceEnableLoopbackRecording(
    enabled: boolean,
    deviceName: string | null
  ): number;
  /**
   * @ignore
   */
  videoSourceEnableAudio(): number;
  /**
   * @ignore
   */
  videoSourceEnableEncryption(
    enabled: boolean,
    encryptionConfig: EncryptionConfig
  ): number;
  /**
   * @ignore
   */
  videoSourceSetEncryptionMode(mode: string): number;
  /**
   * @ignore
   */
  videoSourceSetEncryptionSecret(mode: string): number;
  /**
   * @ignore
   */
  videoSourceRelease(): number;
  /**
   * @ignore
   */
  startScreenCapture(
    windowId: number,
    captureFreq: number,
    rect: { left: number; right: number; top: number; bottom: number },
    bitrate: number
  ): number;
  /**
   * @ignore
   */
  stopScreenCapture(): number;
  /**
   * @ignore
   */
  updateScreenCaptureRegion(rect: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }): number;
  /**
   * @ignore
   */
  startAudioMixing(
    filepath: string,
    loopback: boolean,
    replace: boolean,
    cycle: number,
    startPos?: number
  ): number;
  /**
   * @ignore
   */
  stopAudioMixing(): number;
  /**
   * @ignore
   */
  pauseAudioMixing(): number;
  /**
   * @ignore
   */
  resumeAudioMixing(): number;
  /**
   * @ignore
   */
  adjustAudioMixingVolume(volume: number): number;
  /**
   * @ignore
   */
  adjustAudioMixingPlayoutVolume(volume: number): number;
  /**
   * @ignore
   */
  adjustAudioMixingPublishVolume(volume: number): number;
  /**
   * @ignore
   */
  getAudioMixingDuration(): number;
  /**
   * @ignore
   */
  getAudioMixingCurrentPosition(): number;
  /**
   * @ignore
   */
  getAudioMixingPublishVolume(): number;
  /**
   * @ignore
   */
  getAudioMixingPlayoutVolume(): number;
  /**
   * @ignore
   */
  setAudioMixingPosition(position: number): number;
  /**
   * @ignore
   */
  setAudioMixingPitch(pitch: number): number;
  /**
   * @ignore
   */
  addPublishStreamUrl(url: string, transcodingEnabled: boolean): number;
  /**
   * @ignore
   */
  removePublishStreamUrl(url: string): number;
  /**
   * @ignore
   */
  setLiveTranscoding(transcoding: TranscodingConfig): number;
  /**
   * @ignore
   */
  addInjectStreamUrl(url: string, config: InjectStreamConfig): number;
  /**
   * @ignore
   */
  removeInjectStreamUrl(url: string): number;
  /**
   * @ignore
   */
  createDataStream(
    reliable: boolean | DataStreamConfig,
    ordered?: boolean
  ): number;
  /**
   * @ignore
   */
  sendStreamMessage(streamId: number, msg: string): number;
  /**
   * @ignore
   */
  getEffectsVolume(): number;
  /**
   * @ignore
   */
  setEffectsVolume(volume: number): number;
  /**
   * @ignore
   */
  setVolumeOfEffect(soundId: number, volume: number): number;
  /**
   * @ignore
   */
  playEffect(
    soundId: number,
    filePath: string,
    loopcount: number,
    pitch: number,
    pan: number,
    gain: number,
    publish: boolean,
    startPos?: number
  ): number;
  /**
   * @ignore
   */
  stopEffect(soundId: number): number;
  /**
   * @ignore
   */
  preloadEffect(soundId: number, filePath: string): number;
  /**
   * @ignore
   */
  unloadEffect(soundId: number): number;
  /**
   * @ignore
   */
  pauseEffect(soundId: number): number;
  /**
   * @ignore
   */
  pauseAllEffects(): number;
  /**
   * @ignore
   */
  resumeEffect(soundId: number): number;
  /**
   * @ignore
   */
  resumeAllEffects(): number;
  /**
   * @ignore
   */
  enableSoundPositionIndication(enable: boolean): number;
  /**
   * @ignore
   */
  setRemoteVoicePosition(uid: number, pan: number, gain: number): number;
  /**
   * @ignore
   */
  getCallId(): string;
  /**
   * @ignore
   */
  rate(callId: string, rating: number, desc: string): number;
  /**
   * @ignore
   */
  complain(callId: string, desc: string): number;
  /**
   * @ignore
   */
  setBool(key: string, value: boolean): number;
  /**
   * @ignore
   */
  setInt(key: string, value: number): number;
  /**
   * @ignore
   */
  setUInt(key: string, value: number): number;
  /**
   * @ignore
   */
  setNumber(key: string, value: number): number;
  /**
   * @ignore
   */
  setString(key: string, value: string): number;
  /**
   * @ignore
   */
  setObject(key: string, value: string): number;
  /**
   * @ignore
   */
  getBool(key: string): boolean;
  /**
   * @ignore
   */
  getInt(key: string): number;
  /**
   * @ignore
   */
  getUInt(key: string): number;
  /**
   * @ignore
   */
  getNumber(key: string): number;
  /**
   * @ignore
   */
  getString(key: string): string;
  /**
   * @ignore
   */
  getObject(key: string): string;
  /**
   * @ignore
   */
  getArray(key: string): string;
  /**
   * @ignore
   */
  setParameters(param: string): number;
  /**
   * @ignore
   */
  convertPath(path: string): string;
  /**
   * @ignore
   */
  setProfile(profile: string, merge: boolean): number;
  /**
   * @ignore
   */
  onEvent(event: string, callback: Function): void;
  /**
   * @ignore
   */
  unsubscribe(uid: number, channel?: string): number;
  /**
   * @ignore
   */
  registerDeliverFrame(callback: Function): number;
  /**
   * @ignore
   */
  registerLocalUserAccount(appId: string, userAccount: string): number;
  /**
   * @ignore
   */
  joinChannelWithUserAccount(
    token: string,
    channel: string,
    userAccount: string,
    options?: ChannelMediaOptions
  ): number;
  /**
   * @ignore
   */
  getUserInfoByUserAccount(
    userAccount: string
  ): { errCode: number; userInfo: UserInfo };
  /**
   * @ignore
   */
  getUserInfoByUid(uid: number): { errCode: number; userInfo: UserInfo };
  /**
   * @ignore
   */
  adjustRecordingSignalVolume(volume: number): number;
  /**
   * @ignore
   */
  adjustPlaybackSignalVolume(volume: number): number;
  getDefaultAudioPlaybackDevices(): Object;
  getDefaultAudioRecordingDevices(): Object;
  videoSourceDisableAudio(): number;
  adjustLoopbackSignalVolume(volume: number): number;
  videoSourceAdjustRecordingSignalVolume(volume: number): number;
  videoSourceAdjustLoopbackRecordingSignalVolume(volume: number): number;
  videoSourceMuteRemoteAudioStream(uid: number, mute: boolean): number;
  videoSourceMuteAllRemoteAudioStreams(mute: boolean): number;
  videoSourceMuteRemoteVideoStream(uid: number, mute: boolean): number;
  videoSourceMuteAllRemoteVideoStreams(mute: boolean): number;
  /**
   * @ignore
   */
  stopAllEffects(): number;
  /**
   * @ignore
   */
  startChannelMediaRelay(config: ChannelMediaRelayConfiguration): number;
  /**
   * @ignore
   */
  updateChannelMediaRelay(config: ChannelMediaRelayConfiguration): number;
  /**
   * @ignore
   */
  stopChannelMediaRelay(): number;
  /**
   * @ignore
   */
  registerMediaMetadataObserver(): number;
  /**
   * @ignore
   */
  unRegisterMediaMetadataObserver(): number;
  /**
   * @ignore
   */
  sendMetadata(metadata: Metadata): number;
  /**
   * @ignore
   */
  addMetadataEventHandler(callback: Function, callback2: Function): number;
  /**
   * @ignore
   */
  setMaxMetadataSize(size: number): number;
  /**
   * @ignore
   */
  initializePluginManager(): number;
  /**
   * @ignore
   */
  releasePluginManager(): number;
  /**
   * @ignore
   */
  getPlugins(): Array<{ id: string }>;
  /**
   * @ignore
   */
  registerPlugin(pluginInfo: PluginInfo): number;
  /**
   * @ignore
   */
  unregisterPlugin(pluginId: string): number;
  /**
   * @ignore
   */
  enablePlugin(pluginId: string, enabled: boolean): number;
  /**
   * @ignore
   */
  setPluginParameter(pluginId: string, param: string): number;
  /**
   * @ignore
   */
  getPluginParameter(pluginId: string, paramKey: string): string;
  /**
   * @ignore
   */
  addVideoWatermark(path: string, options: WatermarkOptions): number;
  /**
   * @ignore
   */
  clearVideoWatermarks(): number;
  /**
   * @ignore
   */
  adjustUserPlaybackSignalVolume(uid: number, volume: number): number;
  /**
   * @ignore
   */
  sendCustomReportMessage(
    id: string,
    category: string,
    event: string,
    label: string,
    value: number
  ): number;
  /**
   * @ignore
   */
  enableEncryption(enabled: boolean, config: EncryptionConfig): number;
  /**
   * @ignore
   */
  setAudioEffectPreset(preset: AUDIO_EFFECT_PRESET): number;
  /**
   * @ignore
   */
  setVoiceBeautifierPreset(preset: VOICE_BEAUTIFIER_PRESET): number;
  /**
   * @ignore
   */
  setAudioEffectParameters(
    presset: AUDIO_EFFECT_PRESET,
    param1: number,
    param2: number
  ): number;
  /**
   * @ignore
   */
  setRecordingAudioFrameParameters(
    sampleRate: number,
    channel: number,
    mode: number,
    samplesPerCall: number
  ): number;
  /**
   * @ignore
   */
  setCloudProxy(type: CLOUD_PROXY_TYPE): number;
  /**
   * @ignore
   */
  enableDeepLearningDenoise(enabled: boolean): number;
  /**
   * @ignore
   */
  setVoiceBeautifierParameters(
    preset: VOICE_BEAUTIFIER_PRESET,
    param1: number,
    param2: number
  ): number;
  /**
   * @ignore
   */
  uploadLogFile(): string;
  /**
   * @ignore
   */
  setVoiceConversionPreset(preset: VOICE_CONVERSION_PRESET): number;
  /**
   * @ignore
   */
  adjustLoopbackRecordingSignalVolume(volume: number): number;
  /**
   * @ignore
   */
  setEffectPosition(soundId: number, pos: number): number;
  /**
   * @ignore
   */
  getEffectDuration(filePath: string): number;
  /**
   * @ignore
   */
  getEffectCurrentPosition(soundId: number): number;
  /**
   * @ignore
   */
  getAudioFileInfo(filePath: string): number;

  /**
   * @ignore
   */
  setProcessDpiAwareness(): number;
  /**
   * @ignore
   */
  videoSourceSetProcessDpiAwareness(): number;
  /**
   * @ignore
   */
  startAudioRecordingWithConfig(config: AudioRecordingConfiguration): number;
  /**
   * @ignore
   */
  enableVirtualBackground(
    enabled: Boolean,
    backgroundSource: VirtualBackgroundSource
  ): number;
  /**
   * @ignore
   */
  pauseAllChannelMediaRelay(): number;
  /**
   * @ignore
   */
  resumeAllChannelMediaRelay(): number;

  /**
   * @ignore
   */
  setAudioMixingPlaybackSpeed(speed: number): number;

  /**
   * @ignore
   */
  setAudioMixingDualMonoMode(mode: AUDIO_MIXING_DUAL_MONO_MODE): number;

  /**
   * @ignore
   */
  getScreenCaptureSources(
    thumbSize: SIZE,
    iconSize: SIZE,
    includeScreen: boolean
  ): Array<ScreenCaptureSourceInfo>;

  setLowlightEnhanceOptions(
    enabled: boolean,
    options: LowLightEnhanceOptions
  ): number;
  setVideoDenoiserOptions(
    enabled: boolean,
    options: VideoDenoiserOptions
  ): number;
  setColorEnhanceOptions(
    enabled: boolean,
    options: ColorEnhanceOptions
  ): number;

  setLocalAccessPoint(
    localAccessPointConfiguration: LocalAccessPointConfiguration
  ): number;
  videoSourceSetLocalAccessPoint(
    localAccessPointConfiguration: LocalAccessPointConfiguration
  ): number;
  /**
   * @ignore
   */
  startEchoTestWithConfig(config: EchoTestConfiguration): number;

  sendStreamMessageWithArrayBuffer(
    streamId: number,
    buffer: UInt8ArrayBuffer
  ): number;

  videoSourceSetCloudProxy(
    proxyType: CLOUD_PROXY_TYPE
  ): number;

  videoSourceMuteLocalVideoStream(
    mute: boolean
  ): number;

  videoSourceSetScreenCaptureScenario(
    type: SCREEN_SCENARIO_TYPE
  ): number;

  isFeatureSupported(
    type: FeatureType
  ): boolean;
}
/**
 * @ignore
 */
export interface NodeRtcChannel {
  /**
   * @ignore
   */
  onEvent(event: string, callback: Function): void;
  /**
   * @ignore
   */
  joinChannel(
    token: string,
    info: string,
    uid: number,
    options: ChannelMediaOptions
  ): number;

  /**
   * @ignore
   */
  registerMediaMetadataObserver(): number;
  /**
   * @ignore
   */
  unRegisterMediaMetadataObserver(): number;
  /**
   * @ignore
   */
  sendMetadata(metadata: Metadata): number;
  /**
   * @ignore
   */
  addMetadataEventHandler(callback: Function, callback2: Function): number;
  /**
   * @ignore
   */
  setMaxMetadataSize(size: number): number;

  /**
   * @ignore
   */
  joinChannelWithUserAccount(
    token: string,
    userAccount: string,
    options: ChannelMediaOptions
  ): number;

  /**
   * @ignore
   */
  channelId(): string;

  /**
   * @ignore
   */
  getCallId(): string;

  /**
   * @ignore
   */
  setClientRole(clientRole: ClientRoleType): number;

  /**
   * @ignore
   */
  setClientRoleWithOptions(
    role: ClientRoleType,
    options: ClientRoleOptions
  ): number;

  /**
   * @ignore
   */
  setRemoteUserPriority(uid: number, priority: Priority): number;

  /**
   * @ignore
   */
  renewToken(token: string): number;

  /**
   * @ignore
   */
  setEncryptionSecret(secret: string): number;

  /**
   * @ignore
   */
  setEncryptionMode(mode: string): number;

  /**
   * @ignore
   */
  setRemoteVoicePosition(uid: number, pan: number, gain: number): number;

  /**
   * @ignore
   */
  setDefaultMuteAllRemoteAudioStreams(muted: boolean): number;

  /**
   * @ignore
   */
  setDefaultMuteAllRemoteVideoStreams(muted: boolean): number;

  /**
   * @ignore
   */
  muteAllRemoteAudioStreams(muted: boolean): number;

  /**
   * @ignore
   */
  muteRemoteAudioStream(uid: number, muted: boolean): number;

  /**
   * @ignore
   */
  muteAllRemoteVideoStreams(muted: boolean): number;

  /**
   * @ignore
   */
  muteRemoteVideoStream(uid: number, muted: boolean): number;
  /**
   * @ignore
   */
  setRemoteVideoStreamType(uid: number, type: StreamType): number;

  /**
   * @ignore
   */
  setRemoteDefaultVideoStreamType(type: StreamType): number;

  /**
   * @ignore
   */
  createDataStream(
    reliable: boolean | DataStreamConfig,
    ordered?: boolean
  ): number;

  /**
   * @ignore
   */
  sendStreamMessage(streamId: number, msg: string): number;

  /**
   * @ignore
   */
  addPublishStreamUrl(url: string, transcodingEnabled: boolean): number;

  /**
   * @ignore
   */
  removePublishStreamUrl(url: string): number;

  /**
   * @ignore
   */
  setLiveTranscoding(transcoding: TranscodingConfig): number;

  /**
   * @ignore
   */
  addInjectStreamUrl(url: string, config: InjectStreamConfig): number;

  /**
   * @ignore
   */
  removeInjectStreamUrl(url: string): number;

  /**
   * @ignore
   */
  startChannelMediaRelay(config: ChannelMediaRelayConfiguration): number;
  /**
   * @ignore
   */
  updateChannelMediaRelay(config: ChannelMediaRelayConfiguration): number;
  /**
   * @ignore
   */
  stopChannelMediaRelay(): number;
  /**
   * @ignore
   */
  getConnectionState(): ConnectionState;
  /**
   * @ignore
   */
  publish(): number;
  /**
   * @ignore
   */
  unpublish(): number;
  /**
   * @ignore
   */
  leaveChannel(): number;
  /**
   * @ignore
   */
  release(): number;
  /**
   * @ignore
   */
  adjustUserPlaybackSignalVolume(uid: number, volume: number): number;
  /**
   * @ignore
   */
  enableEncryption(enabled: boolean, config: EncryptionConfig): number;

  muteLocalAudioStream(mute: boolean): number;
  muteLocalVideoStream(mute: boolean): number;
  sendStreamMessageWithArrayBuffer(
    streamId: number,
    buffer: UInt8ArrayBuffer
  ): number
}

/** Audio codec profile types. The default value is LC_ACC. */
export enum AUDIO_CODEC_PROFILE_TYPE {
  /** 0: (Default) LC-AAC */
  AUDIO_CODEC_PROFILE_LC_AAC = 0,
  /** 1: HE-AAC */
  AUDIO_CODEC_PROFILE_HE_AAC = 1,
  /** 2: HE-AAC v2
   *
   * @since v3.6.1.4
   */
  AUDIO_CODEC_PROFILE_HE_AAC_V2 = 2,
}

export interface LiveStreamAdvancedFeature {
  /** The name of the advanced feature. It contains LBHQ and VEO.
   */
  featureName: string;

  /** Whether to enable the advanced feature:
   * - true: Enable the advanced feature.
   * - false: (Default) Disable the advanced feature.
   */
  opened: boolean;
}
enum LIGHTENING_CONTRAST_LEVEL {
  /** 0: Low contrast level. */
  LIGHTENING_CONTRAST_LOW = 0,
  /** (Default) Normal contrast level. */
  LIGHTENING_CONTRAST_NORMAL,
  /** High contrast level. */
  LIGHTENING_CONTRAST_HIGH,
}

/** Image enhancement options.
 */
export interface BeautyOptions {
  lighteningContrastLevel: LIGHTENING_CONTRAST_LEVEL;
  lighteningLevel: number;
  smoothnessLevel: number;
  rednessLevel: number;
  sharpnessLevel: number;
}

export enum LOW_LIGHT_ENHANCE_MODE {
  /** low light enhancement is applied automatically when neccessary. */
  LOW_LIGHT_ENHANCE_AUTO = 0,
  /** low light enhancement is applied manually. */
  LOW_LIGHT_ENHANCE_MANUAL,
}

export enum LOW_LIGHT_ENHANCE_LEVEL {
  /** low light enhancement is applied without reducing frame rate. */
  LOW_LIGHT_ENHANCE_LEVEL_HIGH_QUALITY = 0,
  /** High-quality low light enhancement is applied, at the cost of possibly reduced frame rate and higher cpu usage. */
  LOW_LIGHT_ENHANCE_LEVEL_FAST,
}

/** lowlight enhancement options.
 */
export interface LowLightEnhanceOptions {
  /** lowlight enhancement mode.
   */
  mode: LOW_LIGHT_ENHANCE_MODE;

  /** lowlight enhancement level.
   */
  level: LOW_LIGHT_ENHANCE_LEVEL;
}

/** video noise reduction mode
 */
export enum VIDEO_DENOISER_MODE {
  /** video noise reduction is applied automatically when neccessary. */
  VIDEO_DENOISER_AUTO = 0,
  /** video noise reduction is applied manually. */
  VIDEO_DENOISER_MANUAL,
}

export enum VIDEO_DENOISER_LEVEL {
  /** Video noise reduction is applied for the default scene  */
  VIDEO_DENOISER_LEVEL_HIGH_QUALITY = 0,
  /** Video noise reduction is applied for the fixed-camera scene to save the cpu usage */
  VIDEO_DENOISER_LEVEL_FAST,
  /** Video noise reduction is applied for the high noisy scene to further denoise the video. */
  VIDEO_DENOISER_LEVEL_STRENGTH,
}
export interface VideoDenoiserOptions {
  /** video noise reduction mode.
   */
  mode: VIDEO_DENOISER_MODE;

  /** video noise reduction level.
   */
  level: VIDEO_DENOISER_LEVEL;
}

/** color enhancement options.
 */
export interface ColorEnhanceOptions {
  /** Color enhance strength. The value ranges between 0 (original) and 1.
   */
  strengthLevel: number;

  /** Skin protect level. The value ranges between 0 (original) and 1.
   */
  skinProtectLevel: number;
}
/** The local  proxy mode type. */
export enum LOCAL_PROXY_MODE {
  /** 0: Connect local proxy with high priority, if not connected to local proxy, fallback to sdrtn.
   */
  ConnectivityFirst = 0,
  /** 1: Only connect local proxy
   */
  LocalOnly = 1,
}

export interface UploadServerInfo {
  serverDomain: string;

  serverPath: string;

  serverPort: number;

  serverHttps: boolean;
}
export interface AdvancedConfigInfo {
  // log upload server

  logUploadServer: UploadServerInfo;
}
export interface LocalAccessPointConfiguration {
  /** local access point ip address list.
   */
  ipList: string[];
  /** local access point domain list.
   */
  domainList: string[];
  /** certificate domain name installed on specific local access point. pass "" means using sni domain on specific local access point
   */
  verifyDomainName: string;
  /** local proxy connection mode, connectivity first or local only.
   */
  mode: LOCAL_PROXY_MODE;
  advancedConfig: AdvancedConfigInfo;
}
/**Audio Device Test.different volume Type*/
export enum AudioDeviceTestVolumeType {
  AudioTestRecordingVolume = 0,
  AudioTestPlaybackVolume = 1,
}
export interface EchoTestConfiguration {
  /**
   * Whether to enable the audio device for the call loop test:
   * - true: (Default) Enables the audio device. To test the audio device, set this parameter as `true`.
   * - false: Disables the audio device.
   */
  enableAudio: boolean;
  /**
   * Whether to enable the video device for the call loop test:
   * - true: (Default) Enables the video device. To test the video device, set this parameter as `true`.
   * - false: Disables the video device.
   */
  enableVideo: boolean;
  /**
   * The token used to secure the audio and video call loop test. If you do not enable App Certificate in Agora
   * Console, you do not need to pass a value in this parameter; if you have enabled App Certificate in Agora Console,
   * you must pass a token in this parameter, the `uid` used when you generate the token must be 0xFFFFFFFF, and the
   * channel name used must be the channel name that identifies each audio and video call loop tested. For server-side
   * token generation, see [Authenticate Your Users with Tokens](https://docs.agora.io/en/Interactive%20Broadcast/token_server?platform=All%20Platforms).
   */
  token: string;
  /**
   * The channel name that identifies each audio and video call loop. To ensure proper loop test functionality, the
   * channel name passed in to identify each loop test cannot be the same when users of the same project (App ID)
   * perform audio and video call loop tests on different devices.
   */
  channelId: string;
}
