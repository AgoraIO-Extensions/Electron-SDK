/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 11:41:00
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-18 23:24:14
 */

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
/** Network quality types. */
export enum QUALITY_TYPE {
  /** 0: The network quality is unknown. */
  QUALITY_UNKNOWN = 0,
  /**  1: The network quality is excellent. */
  QUALITY_EXCELLENT = 1,
  /** 2: The network quality is quite good, but the bitrate may be slightly lower than excellent. */
  QUALITY_GOOD = 2,
  /** 3: Users can feel the communication slightly impaired. */
  QUALITY_POOR = 3,
  /** 4: Users cannot communicate smoothly. */
  QUALITY_BAD = 4,
  /** 5: The network is so bad that users can barely communicate. */
  QUALITY_VBAD = 5,
  /** 6: The network is down and users cannot communicate at all. */
  QUALITY_DOWN = 6,
  /** 7: Users cannot detect the network quality. (Not in use.) */
  QUALITY_UNSUPPORTED = 7,
  /** 8: Detecting the network quality. */
  QUALITY_DETECTING = 8,
}

/** Video codec types */
export enum VIDEO_CODEC_TYPE {
  /** Standard VP8 */
  VIDEO_CODEC_VP8 = 1,
  /** Standard H264 */
  VIDEO_CODEC_H264 = 2,
  /** Enhanced VP8 */
  VIDEO_CODEC_EVP = 3,
  /** Enhanced H264 */
  VIDEO_CODEC_E264 = 4,
}

/** The role of a user in a live interactive streaming. */
export enum CLIENT_ROLE_TYPE {
  /** 1: Host. A host can both send and receive streams. */
  CLIENT_ROLE_BROADCASTER = 1,
  /** 2: (Default) Audience. An `audience` member can only receive streams. */
  CLIENT_ROLE_AUDIENCE = 2,
}

/** Remote video stream types. */
export enum REMOTE_VIDEO_STREAM_TYPE {
  /** 0: High-stream video. */
  REMOTE_VIDEO_STREAM_HIGH = 0,
  /** 1: Low-stream video. */
  REMOTE_VIDEO_STREAM_LOW = 1,
}

/** Media device types.
 */
export enum MEDIA_DEVICE_TYPE {
  /** -1: Unknown device type.
   */
  UNKNOWN_AUDIO_DEVICE = -1,
  /** 0: Audio playback device.
   */
  AUDIO_PLAYOUT_DEVICE = 0,
  /** 1: Audio recording device.
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

/** Video codec profile types. */
export enum VIDEO_CODEC_PROFILE_TYPE /** 66: Baseline video codec profile. Generally used in video calls on mobile phones. */ {
  VIDEO_CODEC_PROFILE_BASELINE = 66,
  /** 77: Main video codec profile. Generally used in mainstream electronics such as MP4 players, portable video players, PSP, and iPads. */
  VIDEO_CODEC_PROFILE_MAIN = 77,
  /** 100: (Default) High video codec profile. Generally used in high-resolution live streaming or television. */
  VIDEO_CODEC_PROFILE_HIGH = 100,
}

/** Video Codec types for publishing streams. */
export enum VIDEO_CODEC_TYPE_FOR_STREAM {
  VIDEO_CODEC_H264_FOR_STREAM = 1,
  VIDEO_CODEC_H265_FOR_STREAM = 2,
}

/** States of the last-mile network probe test. */
export enum LASTMILE_PROBE_RESULT_STATE {
  /** 1: The last-mile network probe test is complete. */
  LASTMILE_PROBE_RESULT_COMPLETE = 1,
  /** 2: The last-mile network probe test is incomplete and the bandwidth estimation is not available, probably due to limited test resources. */
  LASTMILE_PROBE_RESULT_INCOMPLETE_NO_BWE = 2,
  /** 3: The last-mile network probe test is not carried out, probably due to poor network conditions. */
  LASTMILE_PROBE_RESULT_UNAVAILABLE = 3,
}

/**
 * @deprecated Deprecated from v3.2.0.
 *
 * Local voice changer options.
 */
export enum VOICE_CHANGER_PRESET {
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
   * 	(For female only) A more vital voice. Do not use it when the speaker is a male; otherwise, voice distortion occurs.
   */
  GENERAL_BEAUTY_VOICE_FEMALE_VITALITY = 0x00200003,
}

/** The reason for the remote video state change. */
export enum REMOTE_VIDEO_STATE_REASON {
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

/** @deprecated Deprecated from v3.2.0.
 *
 *  Local voice reverberation presets.
 */
export enum AUDIO_REVERB_PRESET {
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
   * as `AUDIO_PROFILE_MUSIC_HIGH_QUALITY_STEREO(5)`.
   */
  AUDIO_VIRTUAL_STEREO = 0x00200001,
  /** 1: Electronic Voice.*/
  AUDIO_ELECTRONIC_VOICE = 0x00300001,
  /** 1: 3D Voice.*/
  AUDIO_THREEDIM_VOICE = 0x00400001,
}

export enum CAPTURE_BRIGHTNESS_LEVEL_TYPE {
  CAPTURE_BRIGHTNESS_LEVEL_INVALID = -1,

  CAPTURE_BRIGHTNESS_LEVEL_NORMAL = 0,

  CAPTURE_BRIGHTNESS_LEVEL_BRIGHT = 1,

  CAPTURE_BRIGHTNESS_LEVEL_DARK = 2,
}

export enum AUDIO_SAMPLE_RATE_TYPE {
  /** 32000: 32 kHz */
  AUDIO_SAMPLE_RATE_32000 = 32000,
  /** 44100: 44.1 kHz */
  AUDIO_SAMPLE_RATE_44100 = 44100,
  /** 48000: 48 kHz */
  AUDIO_SAMPLE_RATE_48000 = 48000,
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
  x: number;
  y: number;
  width: number;
  height: number;
  url: string;
}

/**
 * Sets the CDN live audio/video transcoding settings.
 */
export interface LiveTranscoding {
  /**
   * Width of the video. The default value is 360.
   *
   * If you push video streams to the CDN, set the value of width x height to
   * at least 64 x 64 (px), or the SDK will adjust it to 64 x 64 (px).
   *
   * If you push audio streams to the CDN, set the value of width x height to
   * 0 x 0 (px).
   */
  width: number;
  /**
   * Height of the video. The default value is 640.
   *
   * If you push video streams to the CDN, set the value of width x height to
   * at least 64 x 64 (px), or the SDK will adjust it to 64 x 64 (px).
   *
   * If you push audio streams to the CDN, set the value of width x height to
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
  videoFramerate: number;
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
  videoCodecProfile: VIDEO_CODEC_PROFILE_TYPE;

  videoCodecType: VIDEO_CODEC_TYPE_FOR_STREAM;
  /**
   * The background color in RGB hex value. Value only, do not include a #.
   * For example, 0xFFB6C1 (light pink). The default value is 0x000000 (black).
   */
  backgroundColor: number;
  /** The number of users in the live streaming. */
  userCount: number;
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
  watermark: RtcImage;
  /**
   * @since v3.2.0
   *
   * The background image added to the CDN live publishing stream.
   *
   * Once a background image is added, the audience of the CDN live publishing
   * stream can see the background image.
   */
  backgroundImage: RtcImage;

  /** The TranscodingUsers Array. */
  transcodingUsers: Array<TranscodingUser>;
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
  state: LASTMILE_PROBE_RESULT_STATE;
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
  audioSampleRate: AUDIO_SAMPLE_RATE_TYPE;
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

/** The priority of the remote user.
 */
export enum PRIORITY_TYPE {
  /** 50: The user's priority is high.
   */
  PRIORITY_HIGH = 50,
  /** 100: (Default) The user's priority is normal.
   */
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
/** Quality change of the local video in terms of target frame rate and target bit rate since last count.
 */
export enum QUALITY_ADAPT_INDICATION {
  /** The quality of the local video stays the same. */
  ADAPT_NONE = 0,
  /** The quality improves because the network bandwidth increases. */
  ADAPT_UP_BANDWIDTH = 1,
  /** The quality worsens because the network bandwidth decreases. */
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
   * See {@link QUALITY_ADAPT_INDICATION}.
   */
  qualityAdaptIndication: QUALITY_ADAPT_INDICATION;
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
  codecType: VIDEO_CODEC_TYPE;
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

export enum FRAME_RATE {
  /** 1: 1 fps */
  FRAME_RATE_FPS_1 = 1,
  /** 7: 7 fps */
  FRAME_RATE_FPS_7 = 7,
  /** 10: 10 fps */
  FRAME_RATE_FPS_10 = 10,
  /** 15: 15 fps */
  FRAME_RATE_FPS_15 = 15,
  /** 24: 24 fps */
  FRAME_RATE_FPS_24 = 24,
  /** 30: 30 fps */
  FRAME_RATE_FPS_30 = 30,
  /** 60: 60 fps (Windows and macOS only) */
  FRAME_RATE_FPS_60 = 60,
}

export interface VideoDimensions {
  /** Width (pixels) of the video. */
  width: number;
  /** Height (pixels) of the video. */
  height: number;
}

export interface BeautyOptions {
  /** The contrast level, used with the @p lightening parameter.
   */
  lighteningContrastLevel: LIGHTENING_CONTRAST_LEVEL;

  /** The brightness level. The value ranges from 0.0 (original) to 1.0. */
  lighteningLevel: number;

  /** The sharpness level. The value ranges between 0 (original) and 1. This parameter is usually used to remove blemishes.
   */
  smoothnessLevel: number;

  /** The redness level. The value ranges between 0 (original) and 1. This parameter adjusts the red saturation level.
   */
  rednessLevel: number;
}

/** VideoEncoderConfiguration */
export interface VideoEncoderConfiguration {
  dimensions: VideoDimensions;
  /**
   * The frame rate (fps) of the video.
   *
   * The default value is 15 fps.
   *
   * **Noete**:
   * We do not recommend setting this to a value greater than 30 fps.
   */
  frameRate: FRAME_RATE;
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
   * | 2560 * 1440            | 30               | 4850                  |
   * | 2560 * 1440            | 60               | 6500                  |
   * | 3840 * 2160            | 30               | 6500                  |
   * | 3840 * 2160            | 60               | 6500                  |
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
  orientationMode: ORIENTATION_MODE;
  /**
   * The video encoding degradation preference under limited bandwidth.
   * See {@link DegradationPreference}.
   */
  degradationPreference: DEGRADATION_PREFERENCE;
  /**
   * @since v3.0.0
   *
   * Sets the mirror mode of the published local video stream. It only affects
   * the video that the remote user sees. See {@link VideoMirrorModeType}
   *
   * @note The SDK disables the mirror mode by default.
   */
  mirrorMode: VIDEO_MIRROR_MODE_TYPE;
}
/**
 * The type of video mirror mode.
 */
export enum VIDEO_MIRROR_MODE_TYPE {
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

export enum AUDIO_PROFILE_TYPE { // sample rate, bit rate, mono/stereo, speech/music codec
  /**
     0: Default audio profile:
     - For the interactive streaming profile: A sample rate of 48 KHz, music encoding, mono, and a bitrate of up to 64 Kbps.
     - For the `COMMUNICATION` profile:
        - Windows: A sample rate of 16 KHz, music encoding, mono, and a bitrate of up to 16 Kbps.
        - Android/macOS/iOS: A sample rate of 32 KHz, music encoding, mono, and a bitrate of up to 18 Kbps.
    */
  AUDIO_PROFILE_DEFAULT = 0, // use default settings
  /**
     1: A sample rate of 32 KHz, audio encoding, mono, and a bitrate of up to 18 Kbps.
     */
  AUDIO_PROFILE_SPEECH_STANDARD = 1, // 32Khz, 18Kbps, mono, speech
  /**
     2: A sample rate of 48 KHz, music encoding, mono, and a bitrate of up to 64 Kbps.
     */
  AUDIO_PROFILE_MUSIC_STANDARD = 2, // 48Khz, 48Kbps, mono, music
  /**
     3: A sample rate of 48 KHz, music encoding, stereo, and a bitrate of up to 80 Kbps.
     */
  AUDIO_PROFILE_MUSIC_STANDARD_STEREO = 3, // 48Khz, 56Kbps, stereo, music
  /**
     4: A sample rate of 48 KHz, music encoding, mono, and a bitrate of up to 96 Kbps.
     */
  AUDIO_PROFILE_MUSIC_HIGH_QUALITY = 4, // 48Khz, 128Kbps, mono, music
  /**
     5: A sample rate of 48 KHz, music encoding, stereo, and a bitrate of up to 128 Kbps.
     */
  AUDIO_PROFILE_MUSIC_HIGH_QUALITY_STEREO = 5, // 48Khz, 192Kbps, stereo, music
  /**
     6: A sample rate of 16 KHz, audio encoding, mono, and Acoustic Echo Cancellation (AES) enabled.
     */
  AUDIO_PROFILE_IOT = 6,
  AUDIO_PROFILE_NUM = 7,
}

/** Audio application scenarios.
 */
export enum AUDIO_SCENARIO_TYPE { // set a suitable scenario for your app type
  /** 0: Default audio scenario. */
  AUDIO_SCENARIO_DEFAULT = 0,
  /** 1: Entertainment scenario where users need to frequently switch the user role. */
  AUDIO_SCENARIO_CHATROOM_ENTERTAINMENT = 1,
  /** 2: Education scenario where users want smoothness and stability. */
  AUDIO_SCENARIO_EDUCATION = 2,
  /** 3: High-quality audio chatroom scenario where hosts mainly play music. */
  AUDIO_SCENARIO_GAME_STREAMING = 3,
  /** 4: Showroom scenario where a single host wants high-quality audio. */
  AUDIO_SCENARIO_SHOWROOM = 4,
  /** 5: Gaming scenario for group chat that only contains the human voice. */
  AUDIO_SCENARIO_CHATROOM_GAMING = 5,
  /** 6: IoT (Internet of Things) scenario where users use IoT devices with low power consumption. */
  AUDIO_SCENARIO_IOT = 6,
  /** 8: Meeting scenario that mainly contains the human voice.
   *
   * @since v3.2.0
   */
  AUDIO_SCENARIO_MEETING = 8,
  /** The number of elements in the enumeration.
   */
  AUDIO_SCENARIO_NUM = 9,
}

/** The video encoding degradation preference under limited bandwidth. */
export enum DEGRADATION_PREFERENCE {
  /** 0: (Default) Degrade the frame rate in order to maintain the video
   * quality.
   */
  MAINTAIN_QUALITY = 0,
  /** 1: Degrade the video quality in order to maintain the frame rate. */
  MAINTAIN_FRAMERATE = 1,
  /** 2: (For future use) Maintain a balance between the frame rate and video
   * quality.
   */
  MAINTAIN_BALANCED = 2,
}
/** The orientation mode. */
export enum ORIENTATION_MODE {
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
   * For example, CDN live streaming.
   */
  ORIENTATION_MODE_FIXED_LANDSCAPE = 1,
  /**
   * 2: The output video is always in portrait mode.
   *
   * If the captured video is in landscape mode, the video encoder crops it to
   * fit the output. Applies to situations where the receiving end cannot process
   * the rotational information.
   *
   * For example, CDN live streaming.
   */
  ORIENTATION_MODE_FIXED_PORTRAIT = 2,
}

/** Stream fallback options. */
export enum STREAM_FALLBACK_OPTIONS {
  /** 0: No fallback behavior for the local/remote video stream when the uplink/downlink network conditions are poor. The quality of the stream is not guaranteed. */
  STREAM_FALLBACK_OPTION_DISABLED = 0,
  /** 1: Under poor downlink network conditions, the remote video stream, to which you subscribe, falls back to the low-stream (low resolution and low bitrate) video. You can set this option only in the \ref IRtcEngine::setRemoteSubscribeFallbackOption "setRemoteSubscribeFallbackOption" method. Nothing happens when you set this in the \ref IRtcEngine::setLocalPublishFallbackOption "setLocalPublishFallbackOption" method. */
  STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW = 1,
  /** 2: Under poor uplink network conditions, the published video stream falls back to audio only.

    Under poor downlink network conditions, the remote video stream, to which you subscribe, first falls back to the low-stream (low resolution and low bitrate) video; and then to an audio-only stream if the network conditions worsen.*/
  STREAM_FALLBACK_OPTION_AUDIO_ONLY = 2,
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
  rxStreamType: REMOTE_VIDEO_STREAM_TYPE;
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

/** Camera capture preference.
 */
export enum CAPTURER_OUTPUT_PREFERENCE {
  /** 0: (Default) self-adapts the camera output parameters to the system performance and network conditions to balance CPU consumption and video preview quality.
   */
  CAPTURER_OUTPUT_PREFERENCE_AUTO = 0,
  /** 1: Prioritizes the system performance. The SDK chooses the dimension and frame rate of the local camera capture closest to those set by \ref IRtcEngine::setVideoEncoderConfiguration "setVideoEncoderConfiguration".
   */
  CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE = 1,
  /** 2: Prioritizes the local preview quality. The SDK chooses higher camera output parameters to improve the local video preview quality. This option requires extra CPU and RAM usage for video pre-processing.
   */
  CAPTURER_OUTPUT_PREFERENCE_PREVIEW = 2,
  /** 3: Allows you to customize the width and height of the video image captured by the local camera.
   *
   * @since v3.3.0
   */
  CAPTURER_OUTPUT_PREFERENCE_MANUAL = 3,
}

/** Camera capturer configuration. */
export interface CameraCapturerConfiguration {
  /** The output configuration of camera capturer. */
  preference: CAPTURER_OUTPUT_PREFERENCE;
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
export type MacScreenId = {id: number}

export type WindowsScreeId = Rectangle;

export type ScreenSymbol =  MacScreenId | WindowsScreeId ;

/** The video source encoding parameters. */
export interface ScreenCaptureParameters {
  dimensions: VideoDimensions;
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

/**
 * Reports the statistics of the remote audio.
 */
export interface RemoteAudioStats {
  /** User ID of the remote user sending the audio streams. */
  uid: number;
  /** Audio quality received by the user. See {@link AgoraNetworkQuality}. */
  quality: number;
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
}

/** The state of the remote video. */
export enum REMOTE_VIDEO_STATE {
  /** 0: The remote video is in the default state, probably due to #REMOTE_VIDEO_STATE_REASON_LOCAL_MUTED (3), #REMOTE_VIDEO_STATE_REASON_REMOTE_MUTED (5), or #REMOTE_VIDEO_STATE_REASON_REMOTE_OFFLINE (7).
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

/** Remote audio state reasons.
 */
export enum REMOTE_AUDIO_STATE_REASON {
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

/** Remote audio states.
 */
export enum REMOTE_AUDIO_STATE {
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

/** Connection states. */
export enum CONNECTION_STATE_TYPE {
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

export enum CONNECTION_CHANGED_REASON_TYPE {
  /** 0: The SDK is connecting to Agora's edge server. */
  CONNECTION_CHANGED_CONNECTING = 0,
  /** 1: The SDK has joined the channel successfully. */
  CONNECTION_CHANGED_JOIN_SUCCESS = 1,
  /** 2: The connection between the SDK and Agora's edge server is interrupted. */
  CONNECTION_CHANGED_INTERRUPTED = 2,
  /** 3: The connection between the SDK and Agora's edge server is banned by Agora's edge server. */
  CONNECTION_CHANGED_BANNED_BY_SERVER = 3,
  /** 4: The SDK fails to join the channel for more than 20 minutes and stops reconnecting to the channel. */
  CONNECTION_CHANGED_JOIN_FAILED = 4,
  /** 5: The SDK has left the channel. */
  CONNECTION_CHANGED_LEAVE_CHANNEL = 5,
  /** 6: The connection failed since Appid is not valid. */
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

/** Encryption mode.
 */
export enum ENCRYPTION_MODE {
  /** 1: (Default) 128-bit AES encryption, XTS mode.
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
}

/**
 * Configurations of built-in encryption schemas.
 */
export interface EncryptionConfig {
  /**
   * Encryption mode. The default encryption mode is `AES_128_XTS`.
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
  /** An error occurs when you add a background image or a watermark image to the RTMP or RTMPS stream.
   *
   * @since v3.2.0
   */
  RTMP_STREAMING_EVENT_FAILED_LOAD_IMAGE = 1,
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
   * {@link AgoraRtcChannel.muteAllRemoteAudioStreams} method. After joining
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
   * {@link AgoraRtcChannel.muteAllRemoteVideoStreams} method. After joining
   * the channel, you can call the `muteAllRemoteVideoStreams` method to set
   * whether to subscribe to video streams in the channel.
   */
  autoSubscribeVideo: boolean;
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

export interface Rect {
  /** Y-axis of the top line.
   */
  top: number;
  /** X-axis of the left line.
   */
  left: number;
  /** Y-axis of the bottom line.
   */
  bottom: number;
  /** X-axis of the right line.
   */
  right: number;
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
  destCount: number;
}

/** The event code in CHANNEL_MEDIA_RELAY_EVENT. */
export enum CHANNEL_MEDIA_RELAY_EVENT {
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
}

export enum LIGHTENING_CONTRAST_LEVEL {
  /** Low contrast level. */
  LIGHTENING_CONTRAST_LOW = 0,
  /** (Default) Normal contrast level. */
  LIGHTENING_CONTRAST_NORMAL,
  /** High contrast level. */
  LIGHTENING_CONTRAST_HIGH,
}

/** The state code in CHANNEL_MEDIA_RELAY_STATE. */
export enum CHANNEL_MEDIA_RELAY_STATE {
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

export enum CHANNEL_MEDIA_RELAY_ERROR {
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
 *  Regions for connetion.
 */
export enum AREA_CODE {
  /**
   * Mainland China.
   */
  AREA_CODE_CN = 0x00000001,
  /**
   * North America.
   */
  AREA_CODE_NA = 0x00000002,
  /**
   * Europe.
   */
  AREA_CODE_EU = 0x00000004,
  /**
   * Asia, excluding Mainland China.
   */
  AREA_CODE_AS = 0x00000008,
  /**
   * Japan.
   */
  AREA_CODE_JP = 0x00000010,
  /**
   * India.
   */
  AREA_CODE_IN = 0x00000020,
  /**
   * (Default) Global.
   */
  AREA_CODE_GLOB = 0xffffffff,
}

/** The publishing state.
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

/** Audio output routing. */
export enum AUDIO_ROUTE_TYPE {
  /** Default.
   */
  AUDIO_ROUTE_DEFAULT = -1,
  /** Headset.
   */
  AUDIO_ROUTE_HEADSET = 0,
  /** Earpiece.
   */
  AUDIO_ROUTE_EARPIECE = 1,
  /** Headset with no microphone.
   */
  AUDIO_ROUTE_HEADSET_NO_MIC = 2,
  /** Speakerphone.
   */
  AUDIO_ROUTE_SPEAKERPHONE = 3,
  /** Loudspeaker.
   */
  AUDIO_ROUTE_LOUDSPEAKER = 4,
  /** Bluetooth headset.
   */
  AUDIO_ROUTE_BLUETOOTH = 5,
  /** USB peripheral (macOS only).
   */
  AUDIO_ROUTE_USB = 6,
  /** HDMI peripheral (macOS only).
   */
  AUDIO_ROUTE_HDMI = 7,
  /** DisplayPort peripheral (macOS only).
   */
  AUDIO_ROUTE_DISPLAYPORT = 8,
  /** Apple AirPlay (macOS only).
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

/** The cloud proxy type.
 *
 * @since v3.3.0
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

/** The output log level of the SDK.
 *
 * @since v3.3.0
 */
export enum LOG_LEVEL {
  /** 0: Do not output any log. */
  LOG_LEVEL_NONE = 0x0000,
  /** 0x0001: (Default) Output logs of the FATAL, ERROR, WARN and INFO level. We recommend setting your log filter as this level.
   */
  LOG_LEVEL_INFO = 0x0001,
  /** 0x0002: Output logs of the FATAL, ERROR and WARN level.
   */
  LOG_LEVEL_WARN = 0x0002,
  /** 0x0004: Output logs of the FATAL and ERROR level.  */
  LOG_LEVEL_ERROR = 0x0004,
  /** 0x0008: Output logs of the FATAL level.  */
  LOG_LEVEL_FATAL = 0x0008,
}

export interface RtcEngineContext {
  appId: string;
  areaCode?: AREA_CODE;
  logConfig?: LogConfig;
}

export interface LogConfig {
  filePath: string;
  fileSize: number;
  level: LOG_LEVEL;
}

export enum USER_OFFLINE_REASON_TYPE {
  /** 0: The user quits the call. */
  USER_OFFLINE_QUIT = 0,
  /** 1: The SDK times out and the user drops offline because no data packet is received within a certain period of time. If the user quits the call and the message is not passed to the SDK (due to an unreliable channel), the SDK assumes the user dropped offline. */
  USER_OFFLINE_DROPPED = 1,
  /** 2: (`LIVE_BROADCASTING` only.) The client role switched from the host to the audience. */
  USER_OFFLINE_BECOME_AUDIENCE = 2,
}

/** Local audio state types.
 */
export enum LOCAL_AUDIO_STREAM_STATE {
  /** 0: The local audio is in the initial state.
   */
  LOCAL_AUDIO_STREAM_STATE_STOPPED = 0,
  /** 1: The capturing device starts successfully.
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
}

export interface AudioVolumeInfo {
  /**
   * The user ID.
   * - In the local user's callback, `uid = 0`.
   * - In the remote users' callback, `uid` is the ID of a remote user whose instantaneous volume is one of the three highest.
   */
  uid: number;
  /** The volume of each user after audio mixing. The value ranges between 0 (lowest volume) and 255 (highest volume).
   * In the local user's callback, `volume = totalVolume`.
   */
  volume: number;
  /** Voice activity status of the local user.
   * - `0`: The local user is not speaking.
   * - `1`: The local user is speaking.
   *
   * @note
   * - The `vad` parameter cannot report the voice activity status of remote users.
   * In the remote users' callback, `vad` is always `0`.
   * - To use this parameter, you must set the `report_vad` parameter to `true`
   * when calling \ref agora::rtc::IRtcEngine::enableAudioVolumeIndication(int, int, bool) "enableAudioVolumeIndication".
   */
  vad: number;
  /** The name of the channel where the user is in.
   */
  channelId: string;
}

/** The states of the local user's audio mixing file.
 */
export enum AUDIO_MIXING_STATE_TYPE {
  /** 710: The audio mixing file is playing after the method call of
   * \ref IRtcEngine::startAudioMixing "startAudioMixing" or \ref IRtcEngine::resumeAudioMixing "resumeAudioMixing" succeeds.
   */
  AUDIO_MIXING_STATE_PLAYING = 710,
  /** 711: The audio mixing file pauses playing after the method call of \ref IRtcEngine::pauseAudioMixing "pauseAudioMixing" succeeds.
   */
  AUDIO_MIXING_STATE_PAUSED = 711,
  /** 713: The audio mixing file stops playing after the method call of \ref IRtcEngine::stopAudioMixing "stopAudioMixing" succeeds.
   */
  AUDIO_MIXING_STATE_STOPPED = 713,
  /** 714: An exception occurs during the playback of the audio mixing file. See the `errorCode` for details.
   */
  AUDIO_MIXING_STATE_FAILED = 714,
}

/** The error codes of the local user's audio mixing file.
 */
export enum AUDIO_MIXING_ERROR_TYPE {
  /** 701: The SDK cannot open the audio mixing file.
   */
  AUDIO_MIXING_ERROR_CAN_NOT_OPEN = 701,
  /** 702: The SDK opens the audio mixing file too frequently.
   */
  AUDIO_MIXING_ERROR_TOO_FREQUENT_CALL = 702,
  /** 703: The audio mixing file playback is interrupted.
   */
  AUDIO_MIXING_ERROR_INTERRUPTED_EOF = 703,
  /** 0: The SDK can open the audio mixing file.
   */
  AUDIO_MIXING_ERROR_OK = 0,
}

/** Local video state types
 */
export enum LOCAL_VIDEO_STREAM_STATE {
  /** 0: Initial state */
  LOCAL_VIDEO_STREAM_STATE_STOPPED = 0,
  /** 1: The local video capturing device starts successfully.
   *
   * The SDK also reports this state when you share a maximized window by calling \ref IRtcEngine::startScreenCaptureByWindowId "startScreenCaptureByWindowId".
   */
  LOCAL_VIDEO_STREAM_STATE_CAPTURING = 1,
  /** 2: The first video frame is successfully encoded. */
  LOCAL_VIDEO_STREAM_STATE_ENCODING = 2,
  /** 3: The local video fails to start. */
  LOCAL_VIDEO_STREAM_STATE_FAILED = 3,
}

/** Local video state error codes
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
  /** 11: The shared window is minimized when you call \ref IRtcEngine::startScreenCaptureByWindowId "startScreenCaptureByWindowId" to share a window.
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
}

export enum SUPER_RESOLUTION_STATE_REASON {
  /** 0: The super-resolution algorithm is successfully enabled.
   */
  SR_STATE_REASON_SUCCESS = 0,
  /** 1: The origin resolution of the remote video is beyond the range where
   * the super-resolution algorithm can be applied.
   */
  SR_STATE_REASON_STREAM_OVER_LIMITATION = 1,
  /** 2: Another user is already using the super-resolution algorithm.
   */
  SR_STATE_REASON_USER_COUNT_OVER_LIMITATION = 2,
  /** 3: The device does not support the super-resolution algorithm.
   */
  SR_STATE_REASON_DEVICE_NOT_SUPPORTED = 3,
}

/**
 States of the RTMP streaming.
*/
export enum RTMP_STREAM_PUBLISH_STATE {
  /** The RTMP streaming has not started or has ended. This state is also triggered after you remove an RTMP address from the CDN by calling removePublishStreamUrl.
   */
  RTMP_STREAM_PUBLISH_STATE_IDLE = 0,
  /** The SDK is connecting to Agora's streaming server and the RTMP server. This state is triggered after you call the \ref IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" method.
   */
  RTMP_STREAM_PUBLISH_STATE_CONNECTING = 1,
  /** The RTMP streaming publishes. The SDK successfully publishes the RTMP streaming and returns this state.
   */
  RTMP_STREAM_PUBLISH_STATE_RUNNING = 2,
  /** The RTMP streaming is recovering. When exceptions occur to the CDN, or the streaming is interrupted, the SDK tries to resume RTMP streaming and returns this state.
 
  - If the SDK successfully resumes the streaming, #RTMP_STREAM_PUBLISH_STATE_RUNNING (2) returns.
  - If the streaming does not resume within 60 seconds or server errors occur, #RTMP_STREAM_PUBLISH_STATE_FAILURE (4) returns. You can also reconnect to the server by calling the \ref IRtcEngine::removePublishStreamUrl "removePublishStreamUrl" and \ref IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" methods.
  */
  RTMP_STREAM_PUBLISH_STATE_RECOVERING = 3,
  /** The RTMP streaming fails. See the errCode parameter for the detailed error information. You can also call the \ref IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" method to publish the RTMP streaming again.
   */
  RTMP_STREAM_PUBLISH_STATE_FAILURE = 4,
}

/**
Error codes of the RTMP streaming.
*/
export enum RTMP_STREAM_PUBLISH_ERROR {
  /** The RTMP streaming publishes successfully. */
  RTMP_STREAM_PUBLISH_ERROR_OK = 0,
  /** Invalid argument used. If, for example, you do not call the \ref IRtcEngine::setLiveTranscoding "setLiveTranscoding" method to configure the LiveTranscoding parameters before calling the addPublishStreamUrl method, the SDK returns this error. Check whether you set the parameters in the *setLiveTranscoding* method properly. */
  RTMP_STREAM_PUBLISH_ERROR_INVALID_ARGUMENT = 1,
  /** The RTMP streaming is encrypted and cannot be published. */
  RTMP_STREAM_PUBLISH_ERROR_ENCRYPTED_STREAM_NOT_ALLOWED = 2,
  /** Timeout for the RTMP streaming. Call the \ref IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" method to publish the streaming again. */
  RTMP_STREAM_PUBLISH_ERROR_CONNECTION_TIMEOUT = 3,
  /** An error occurs in Agora's streaming server. Call the addPublishStreamUrl method to publish the streaming again. */
  RTMP_STREAM_PUBLISH_ERROR_INTERNAL_SERVER_ERROR = 4,
  /** An error occurs in the RTMP server. */
  RTMP_STREAM_PUBLISH_ERROR_RTMP_SERVER_ERROR = 5,
  /** The RTMP streaming publishes too frequently. */
  RTMP_STREAM_PUBLISH_ERROR_TOO_OFTEN = 6,
  /** The host publishes more than 10 URLs. Delete the unnecessary URLs before adding new ones. */
  RTMP_STREAM_PUBLISH_ERROR_REACH_LIMIT = 7,
  /** The host manipulates other hosts' URLs. Check your app logic. */
  RTMP_STREAM_PUBLISH_ERROR_NOT_AUTHORIZED = 8,
  /** Agora's server fails to find the RTMP streaming. */
  RTMP_STREAM_PUBLISH_ERROR_STREAM_NOT_FOUND = 9,
  /** The format of the RTMP streaming URL is not supported. Check whether the URL format is correct. */
  RTMP_STREAM_PUBLISH_ERROR_FORMAT_NOT_SUPPORTED = 10,
}

/** Network type. */
export enum NETWORK_TYPE {
  /** -1: The network type is unknown. */
  NETWORK_TYPE_UNKNOWN = -1,
  /** 0: The SDK disconnects from the network. */
  NETWORK_TYPE_DISCONNECTED = 0,
  /** 1: The network type is LAN. */
  NETWORK_TYPE_LAN = 1,
  /** 2: The network type is Wi-Fi(including hotspots). */
  NETWORK_TYPE_WIFI = 2,
  /** 3: The network type is mobile 2G. */
  NETWORK_TYPE_MOBILE_2G = 3,
  /** 4: The network type is mobile 3G. */
  NETWORK_TYPE_MOBILE_3G = 4,
  /** 5: The network type is mobile 4G. */
  NETWORK_TYPE_MOBILE_4G = 5,
}

export interface Device {
  deviceId: string;
  deviceName: string;
  deviceid: string;
  devicename: string;
}

export enum METADATA_TYPE {
  UNKNOWN_METADATA = -1,
  /** 0: the metadata type is video.
   */
  VIDEO_METADATA = 0,
}

export enum CHANNEL_PROFILE_TYPE {
  /** (Default) Communication. This profile applies to scenarios such as an audio call or video call,
   * where all users can publish and subscribe to streams.
   */
  CHANNEL_PROFILE_COMMUNICATION = 0,
  /** Live streaming. In this profile, uses have roles, namely, host and audience (default).
   * A host both publishes and subscribes to streams, while an audience subscribes to streams only.
   * This profile applies to scenarios such as a chat room or interactive video streaming.
   */
  CHANNEL_PROFILE_LIVE_BROADCASTING = 1,
  /** 2: Gaming. This profile uses a codec with a lower bitrate and consumes less power. Applies to the gaming scenario, where all game players can talk freely.
   *
   * @note Agora does not recommend using this setting.
   */
  CHANNEL_PROFILE_GAME = 2,
}

export interface WindowInfo {
  windowId: number;
  name: string;
  ownerName: string;
  isOnScreen: boolean;
  width: number;
  height: number;
  originWidth: number;
  originHeight: number;
  image: Uint8Array;
}
