import {
  PluginInfo,
  Plugin
} from './plugin';
import { type } from 'os';

export interface RendererOptions
{
  append: boolean
}

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
 */
export type AgoraNetworkQuality =
  | 0 // unknown
  | 1 // excellent
  | 2 // good
  | 3 // poor
  | 4 // bad
  | 5 // very bad
  | 6; // down
/**
 * The codec type of the local video：
 * - 0: VP8
 * - 1: (Default) H.264
 */
export type VIDEO_CODEC_TYPE =
  | 0 // VP8
  | 1; // H264

/**
 * Client roles in a live broadcast.
 *
 * - 1: Host.
 * - 2: Audience.
 */
export type ClientRoleType = 1 | 2;

/** Video stream types.
 *
 * - 0: High-stream video.
 * - 1: Low-stream video.
 */
export type StreamType = 0 | 1;
/** Media Device Type.
 * - -1: Unknown device type.
 * - 0: Audio playback device.
 * - 1: Audio recording device.
 * - 2: Video renderer.
 * - 3: Video capturer.
 * - 4: Application audio playback device.
 */
export type MediaDeviceType =
  | -1 // Unknown device type
  | 0 // Audio playback device
  | 1 // Audio recording device
  | 2 // Video renderer
  | 3 // Video capturer
  | 4; // Application audio playback device
 
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
   * of the broadcaster.
   * - 1: The audio stream of the broadcaster uses the FL audio channel. 
   * If the upstream of the broadcaster uses multiple audio channels, 
   * these channels will be mixed into mono first.
   * - 2: The audio stream of the broadcaster uses the FC audio channel. 
   * If the upstream of the broadcaster uses multiple audio channels, 
   * these channels will be mixed into mono first.
   * - 3: The audio stream of the broadcaster uses the FR audio channel. 
   * If the upstream of the broadcaster uses multiple audio channels, 
   * these channels will be mixed into mono first.
   * - 4: The audio stream of the broadcaster uses the BL audio channel. 
   * If the upstream of the broadcaster uses multiple audio channels, 
   * these channels will be mixed into mono first.
   * - 5: The audio stream of the broadcaster uses the BR audio channel. 
   * If the upstream of the broadcaster uses multiple audio channels, 
   * these channels will be mixed into mono first.
   */
  audioChannel: number;
}

/** 
 * Sets the CDN live audio/video transcoding settings. 
 */
export interface TranscodingConfig {
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
  /** The number of users in the live broadcast. */
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
  /** Bitrate of the CDN live audio output stream. The default value is 48 Kbps, and the highest value is 128.
   */
  audioBitrate: number;
  /** Reserved property. Extra user-defined information to send SEI for the H.264/H.265 video stream to the CDN live client. Maximum length: 4096 Bytes.

    For more information on SEI frame, see [SEI-related questions](https://docs.agora.io/cn/Agora%20Platform/live_related_faq?platform=%E7%9B%B4%E6%92%AD%E7%9B%B8%E5%85%B3#sei).
    */
  transcodingExtraInfo: string;
  /** The watermark image added to the CDN live publishing stream. */
  watermark: {
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
  };

  background: {
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
  };
  
  /** The TranscodingUsers Array. */
  transcodingUsers: Array<TranscodingUser>;
}

/**
 * Video source types definition.
 * - 0: Video captured by the camera.
 * - 1: Video captured by the secondary camera.
 * - 2: Video for screen sharing.
 * - 3: Video for the secondary screen sharing.
 * - 4: Video for custom video.
 * - 5: Video of MediaPlayer
 * - 6: Video for png image.
 * - 7: Video for jpg image.
 * - 8: Video for gif image.
 * - 9: Remote video received from network.
 * - 10: Video for transcoded.
 */
export declare type VIDEO_SOURCE_TYPE = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export interface TranscodingVideoStream {
    /**
     * Source type of video stream.
     */
    sourceType: VIDEO_SOURCE_TYPE;
    /**
     * Remote user uid if sourceType is VIDEO_SOURCE_REMOTE.
     */
    remoteUserUid: number;
    /**
     * connectionId of Remote user uid if sourceType is VIDEO_SOURCE_REMOTE.
     * Set to 0 if you only join single channel.
     */
    connectionId: number;
    /**
     * RTC image if sourceType is VIDEO_SOURCE_RTC_IMAGE.
     */
    imageUrl: string;
    /**
     * The horizontal position of the top left corner of the video frame.
     */
    x: number;
    /**
     * The vertical position of the top left corner of the video frame.
     */
    y: number;
    /**
     * The width of the video frame.
     */
    width: number;
    /**
     * The height of the video frame.
     */
    height: number;
    /**
     * The layer of the video frame that ranges from 1 to 100:
     * - 1: (Default) The lowest layer.
     * - 100: The highest layer.
     */
    zOrder: number;
    /**
     * The transparency of the video frame.
     */
    alpha: number;
    mirror: boolean;
}

export interface LocalTranscoderConfiguration {
    /**
     * The number of VideoInputStreams in the transcoder.
     */
    streamCount: number;
    /**
     * The video stream layout configuration in the transcoder.
     */
    videoInputStreams: TranscodingVideoStream [];
    /**
     * The video encoder configuration of transcoded video.
     */ 
    videoOutputConfiguration: VideoEncoderConfiguration;
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
   * The expected maximum sending bitrate (Kbps) of the local user. 
   * The value ranges between 100 and 5000.
   */
  expectedUplinkBitrate: number;
  /**
   * The expected maximum receiving bitrate (Kbps) of the local user. 
   * The value ranges between 100 and 5000.
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

/**  */
export enum RenderType
{
    RENDER_TYPE_LOCAL = 0,
    RENDER_TYPE_REMOTE = 1,
    RENDER_TYPE_DEVICE_TEST = 2,
    RENDER_TYPE_VIDEO_SOURCE = 3,
    RENDER_TYPE_TRANSCODED = 4
};

/** Sets the local voice changer option. */
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
  VOICE_BEAUTY_VIGOROUS = 0x00100001,//7,
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
  GENERAL_BEAUTY_VOICE_FEMALE_VITALITY = 0x00200003

}
/**
 * Sets the local voice changer option.
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
   * as `AUDIO_PROFILE_MUSIC_HIGH_QUALITY_STEREO(5)`.
   */
  AUDIO_VIRTUAL_STEREO = 0x00200001
}
/**
 * Configuration of the imported live broadcast voice or video stream.
 */
export interface InjectStreamConfig {
  /** 
   * Width of the added stream in the live broadcast. 
   * 
   * The default value is 0 pixel (same width as the original stream). 
   */
  width: number;
  /** 
   * Height of the added stream in the live broadcast. 
   * 
   * The default value is 0 pixel (same height as the original stream). 
   */
  height: number;
  /** 
   * Video bitrate of the added stream in the live broadcast. 
   * 
   * The default value is 400 Kbps. 
   */
  videoBitrate: number;
  /** Video frame rate of the added stream in the live broadcast. 
   * 
   * The default value is 15 fps. 
   */
  videoFrameRate: number;
  /** Video GOP of the added stream in the live broadcast in frames. 
   * 
   * The default value is 30 fps. 
   */
  videoGop: number;
  /**
   * Audio-sampling rate of the added stream in the live broadcast. 
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
   * Audio bitrate of the added stream in the live broadcast. 
   * 
   * The default value is 48 Kbps.
   * 
   * **Note**: Agora recommends setting the default value.
   */
  audioBitrate: number;
  /** Audio channels in the live broadcast.
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
  PRIORITY_NORMAL = 100
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
  /** Number of users in the channel. */
  userCount: number;
  /** Application CPU usage (%). */
  cpuAppUsage: number;
  /** System CPU usage (%). */
  cpuTotalUsage: number;
  memoryAppUsageRatio: number;
  memoryAppUsageInKbytes: number;
  memoryTotalUsageRatio: number;
}
/** Quality change of the local video. */
export enum QualityAdaptIndication {
  /** 0: The quality of the local video stays the same. */
  ADAPT_NONE = 0,
  /** 1: The quality improves because the network bandwidth increases. */
  ADAPT_UP_BANDWIDTH = 1,
  /** 2: The quality worsens because the network bandwidth decreases. */
  ADAPT_DOWN_BANDWIDTH = 2
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
  // minFrameRate: number;
   /** The video encoding bitrate (Kbps).
    * 
    * Choose one of the following options:
    * - 0: (Recommended) The standard bitrate.
    *  - The Communication profile: the encoding bitrate equals the base 
    * bitrate.
    *  - The Live-broadcast profile: the encoding bitrate is twice the base 
    * bitrate.
    * - -1: The compatible bitrate: the bitrate stays the same regardless of 
    * the profile.
    *
    * The Communication profile prioritizes smoothness, while the 
    * Live-broadcast profile prioritizes video quality 
    * (requiring a higher bitrate). We recommend setting the bitrate mode to 
    * address this difference.
    *
    * The following table lists the recommended video encoder configurations, 
    * where the base bitrate applies to the Communication profile.
    * Set your bitrate based on this table. If you set a bitrate beyond the 
    * proper range, the SDK automatically sets it to within the range.
    *
    * <table>
    *     <tr>
    *         <th>Resolution</th>
    *         <th>Frame Rate (fps)</th>
    *         <th>Base Bitrate (Kbps, for Communication)</th>
    *         <th>Live Bitrate (Kbps, for Live Broadcast)</th>
    *     </tr>
    *     <tr>
    *         <td>160 &times; 120</td>
    *         <td>15</td>
    *         <td>65</td>
    *         <td>130</td>
    *     </tr>
    *     <tr>
    *         <td>120 &times; 120</td>
    *         <td>15</td>
    *         <td>50</td>
    *         <td>100</td>
    *     </tr>
    *     <tr>
    *         <td>320 &times; 180</td>
    *         <td>15</td>
    *         <td>140</td>
    *         <td>280</td>
    *     </tr>
    *     <tr>
    *         <td>180 &times; 180</td>
    *         <td>15</td>
    *         <td>100</td>
    *         <td>200</td>
    *     </tr>
    *     <tr>
    *         <td>240 &times; 180</td>
    *         <td>15</td>
    *         <td>120</td>
    *         <td>240</td>
    *     </tr>
    *     <tr>
    *         <td>320 &times; 240</td>
    *         <td>15</td>
    *         <td>200</td>
    *         <td>400</td>
    *     </tr>
    *     <tr>
    *         <td>240 &times; 240</td>
    *         <td>15</td>
    *         <td>140</td>
    *         <td>280</td>
    *     </tr>
    *     <tr>
    *         <td>424 &times; 240</td>
    *         <td>15</td>
    *         <td>220</td>
    *         <td>440</td>
    *     </tr>
    *     <tr>
    *         <td>640 &times; 360</td>
    *         <td>15</td>
    *         <td>400</td>
    *         <td>800</td>
    *     </tr>
    *     <tr>
    *         <td>360 &times; 360</td>
    *         <td>15</td>
    *         <td>260</td>
    *         <td>520</td>
    *     </tr>
    *     <tr>
    *         <td>640 &times; 360</td>
    *         <td>30</td>
    *         <td>600</td>
    *         <td>1200</td>
    *     </tr>
    *     <tr>
    *         <td>360 &times; 360</td>
    *         <td>30</td>
    *         <td>400</td>
    *         <td>800</td>
    *     </tr>
    *     <tr>
    *         <td>480 &times; 360</td>
    *         <td>15</td>
    *         <td>320</td>
    *         <td>640</td>
    *     </tr>
    *     <tr>
    *         <td>480 &times; 360</td>
    *         <td>30</td>
    *         <td>490</td>
    *         <td>980</td>
    *     </tr>
    *     <tr>
    *         <td>640 &times; 480</td>
    *         <td>15</td>
    *         <td>500</td>
    *         <td>1000</td>
    *     </tr>
    *     <tr>
    *         <td>480 &times; 480</td>
    *         <td>15</td>
    *         <td>400</td>
    *         <td>800</td>
    *     </tr>
    *     <tr>
    *         <td>640 &times; 480</td>
    *         <td>30</td>
    *         <td>750</td>
    *         <td>1500</td>
    *     </tr>
    *     <tr>
    *         <td>480 &times; 480</td>
    *         <td>30</td>
    *         <td>600</td>
    *         <td>1200</td>
    *     </tr>
    *     <tr>
    *         <td>848 &times; 480</td>
    *         <td>15</td>
    *         <td>610</td>
    *         <td>1220</td>
    *     </tr>
    *     <tr>
    *         <td>848 &times; 480</td>
    *         <td>30</td>
    *         <td>930</td>
    *         <td>1860</td>
    *     </tr>
    *     <tr>
    *         <td>640 &times; 480</td>
    *         <td>10</td>
    *         <td>400</td>
    *         <td>800</td>
    *     </tr>
    *     <tr>
    *         <td>1280 &times; 720</td>
    *         <td>15</td>
    *         <td>1130</td>
    *         <td>2260</td>
    *     </tr>
    *     <tr>
    *         <td>1280 &times; 720</td>
    *         <td>30</td>
    *         <td>1710</td>
    *         <td>3420</td>
    *     </tr>
    *     <tr>
    *         <td>960 &times; 720</td>
    *         <td>15</td>
    *         <td>910</td>
    *         <td>1820</td>
    *     </tr>
    *     <tr>
    *         <td>960 &times; 720</td>
    *         <td>30</td>
    *         <td>1380</td>
    *         <td>2760</td>
    *     </tr>
    * </table>
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
  DISABLED = 2
}

/**
 * (For future use) Video degradation preferences under limited bandwidth.
 */
export enum DegradationPreference {
  /**
   * 0: (Default) Degrade the frame rate and keep resolution to guarantee the video quality.
   */
  MAINTAIN_QUALITY = 0,
  /**
   * 1: Degrade resolution in order to maintain framerate.
   */
  MAINTAIN_FRAMERATE = 1,
  /**
   * 2: Maintain resolution in video quality control process. Under limited bandwidth, degrade video quality first and then degrade frame rate.
   */
  MAINTAIN_BALANCED = 2,
  /**
   * 3: Degrade framerate in order to maintain resolution.
   */
  MAINTAIN_RESOLUTION = 3,
};

/** The orientation mode. */
export enum OrientationMode  {
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
   * @since 2.9.0
   * 
   * Packet loss rate (%) of the remote video stream after using the 
   * anti-packet-loss method.
   */
  packetLossRate: number;
}
/** Sets the camera capturer configuration. */
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
  CAPTURER_OUTPUT_PREFERENCE_PREVIEW = 2
}

export enum CAMERA_DIRECTION {
  /** The rear camera. */
  CAMERA_REAR = 0,
  /** The front camera. */
  CAMERA_FRONT = 1,
};

export interface VideoFormat {
  width: number,
  height: number,
  fps: number
}

/** Camera capturer configuration. */
export interface CameraCapturerConfiguration {
  cameraDirection: CAMERA_DIRECTION,
  deviceId: String,
  format: VideoFormat
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

export type MacScreenSymbol = number;

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

  // captureMouseCursor: boolean;

  // windowFocus: boolean;

  excludeWindowList: Array<number>;

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
  CONTENT_HINT_DETAILS = 2
}

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
export type RemoteVideoState = 0 | 1 | 2 | 3 | 4;
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
export type RemoteVideoStateReason = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
/**
 * State of the remote audio stream.
 * - 0: The remote audio is in the default state.
 * - 1: The first remote audio packet is received.
 * - 2: The remote audio stream is decoded and plays normally.
 * - 3: The remote audio is frozen.
 * - 4: The remote audio fails to start.
 */
export type RemoteAudioState = 0 | 1 | 2 | 3 | 4;
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
export type RemoteAudioStateReason = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
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
export type ConnectionState =
  | 1 // 1: The SDK is disconnected from Agora's edge server
  | 2 // 2: The SDK is connecting to Agora's edge server.
  | 3
  | 4
  | 5; // 5: The SDK fails to connect to Agora's edge server or join the channel.

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
export type ConnectionChangeReason =
  | 0 // 0: The SDK is connecting to Agora's edge server.
  | 1 // 1: The SDK has joined the channel successfully.
  | 2 // 2: The connection between the SDK and Agora's edge server is interrupted.
  | 3 // 3: The connection between the SDK and Agora's edge server is banned by Agora's edge server.
  | 4 // 4: The SDK fails to join the channel for more than 20 minutes and stops reconnecting to the channel.
  | 5 // 5: The SDK has left the channel.
  | 6 // 6: Invalid App ID
  | 7 // 7: Invalid Channel Name
  | 8 // 8: Invalid Token
  | 9 // 9: Token Expired
  | 10 // 10: This user has been banned by server
  | 11 // 11: SDK reconnects for setting proxy server
  | 12 // 12: Network status change for renew token
  | 13; // 13: Client IP Address changed

export enum ENCRYPTION_MODE {
      /* OpenSSL Encryption Mode Start */
      /** 1:"aes-128-xts": (Default) 128-bit AES encryption, XTS mode.
       */
      AES_128_XTS = 1,
      /** 2:"aes-128-ecb": 128-bit AES encryption, ECB mode.
       */
      AES_128_ECB = 2,
      /** 3:"aes-256-xts": 256-bit AES encryption, XTS mode.
       */
      AES_256_XTS = 3,
      /* OpenSSL Encryption Mode End */
  
      /** 4:"sm4-128-ecb": 128-bit SM4 encryption, ECB mode.
       */
      SM4_128_ECB = 4,
};

export interface EncryptionConfig{
    /**
     * Encryption mode.  The Agora SDK supports built-in encryption, which is set to the "aes-128-xts" mode by default. See ENCRYPTION_MODE.
     */
    encryptionMode: ENCRYPTION_MODE;
    /**
     * Pointer to the encryption password.
     */
    encryptionKey: string;
    
};

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
   * **Note**: Live broadcast profile only.
   */
  VIDEO_PROFILE_LANDSCAPE_360P_9 = 38,
  /** 39: 640 &times; 360, frame rate 24 fps, bitrate 800 Kbps.
   * **Note**: Live broadcast profile only.
   */
  VIDEO_PROFILE_LANDSCAPE_360P_10 = 39,
  /** 100: 640 &times; 360, frame rate 24 fps, bitrate 1000 Kbps.
   * **Note**: Live broadcast profile only.
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
   * **Note**: Live broadcast profile only.
   */
  VIDEO_PROFILE_PORTRAIT_360P_9 = 1038,
  /** 1039: 360 &times; 640, frame rate 24 fps, bitrate 800 Kbps.
   * **Note**: Live broadcast profile only.
   */
  VIDEO_PROFILE_PORTRAIT_360P_10 = 1039,
  /** 1100: 360 &times; 640, frame rate 24 fps, bitrate 1000 Kbps.
   * **Note**: Live broadcast profile only.
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
  VIDEO_PROFILE_DEFAULT = VIDEO_PROFILE_LANDSCAPE_360P
}

export enum RTMP_STREAMING_EVENT
{
  RTMP_STREAMING_EVENT_FAILED_LOAD_IMAGE = 1,
};

export type STREAM_SUBSCRIBE_STATE =
  | 0 //SUB_STATE_IDLE
  | 1 //SUB_STATE_NO_SUBSCRIBED
  | 2 //SUB_STATE_SUBSCRIBING
  | 3 //SUB_STATE_SUBSCRIBED

  /**
 * Remote video stream types.
 */
export enum REMOTE_VIDEO_STREAM_TYPE {
  /**
   * 0: The high-quality video stream, which features in high-resolution and high-bitrate.
   */
  REMOTE_VIDEO_STREAM_HIGH = 0,
  /**
   * 1: The low-quality video stream, which features in low-resolution and low-bitrate.
   */
  REMOTE_VIDEO_STREAM_LOW = 1,
};


/**
 * The channel profile.
 */
export enum CHANNEL_PROFILE_TYPE {
  /**
   * 0: Communication.
   *
   * This profile prioritizes smoothness and applies to the one-to-one scenario.
   */
  CHANNEL_PROFILE_COMMUNICATION = 0,
  /**
   * 1: Live Broadcast.
   *
   * This profile prioritizes supporting a large audience in a live broadcast channel.
   */
  CHANNEL_PROFILE_LIVE_BROADCASTING = 1,
  /**
   * 2: Gaming.
   * @deprecated This profile is deprecated.
   */
  CHANNEL_PROFILE_GAME = 2,
  /**
   * 3: Cloud Gaming.
   *
   * This profile prioritizes low end-to-end latency and applies to scenarios where users interact
   * with each other, and any delay affects the user experience.
   */
  CHANNEL_PROFILE_CLOUD_GAMING = 3,

  /**
   * 4: Communication 1v1.
   *
   * This profile uses a special network transport strategy for communication 1v1.
   */
  CHANNEL_PROFILE_COMMUNICATION_1v1 = 4,
};

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
  channel: string;
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
   * Determines whether to publish the video of the camera track.
   * - true: Publish the video track of the camera capturer.
   * - false: (Default) Do not publish the video track of the camera capturer.
   */
    publishCameraTrack: boolean;
  /**
   * Determines whether to publish the recorded audio.
   * - true: Publish the recorded audio.
   * - false: (Default) Do not publish the recorded audio.
   */
    publishAudioTrack: boolean;
  /**
   * Determines whether to publish the video of the screen track.
   * - true: Publish the video track of the screen capturer.
   * - false: (Default) Do not publish the video track of the screen capturer.
   */
   publishScreenTrack: boolean;
  /**
   * Determines whether to publish the audio of the custom audio track.
   * - true: Publish the audio of the custom audio track.
   * - false: (Default) Do not publish the audio of the custom audio track.
   */
   publishCustomAudioTrack: boolean;
  /**
   * Determines whether to publish the video of the custom video track.
   * - true: Publish the video of the custom video track.
   * - false: (Default) Do not publish the video of the custom video track.
   */
  publishCustomVideoTrack: boolean;
  /**
   * Determines whether to publish the video of the encoded video track.
   * - true: Publish the video of the encoded video track.
   * - false: (default) Do not publish the video of the encoded video track.
   */
  publishEncodedVideoTrack: boolean;
  /**
  * Determines whether to publish the audio track of media player source.
  * - true: Publish the audio track of media player source.
  * - false: (default) Do not publish the audio track of media player source.
  */
  publishMediaPlayerAudioTrack: boolean;
  /**
  * Determines whether to publish the video track of media player source.
  * - true: Publish the video track of media player source.
  * - false: (default) Do not publish the video track of media player source.
  */
   publishMediaPlayerVideoTrack: boolean;
  /**
   * Determines whether to subscribe to all audio streams automatically. It can replace calling \ref IRtcEngine::setDefaultMuteAllRemoteAudioStreams
   * "setDefaultMuteAllRemoteAudioStreams" before joining a channel.
   * - true: Subscribe to all audio streams automatically.
   * - false: (Default) Do not subscribe to any audio stream automatically.
   */
  autoSubscribeAudio: boolean;
  /**
   * Determines whether to subscribe to all video streams automatically. It can replace calling \ref IRtcEngine::setDefaultMuteAllRemoteVideoStreams
   * "setDefaultMuteAllRemoteVideoStreams" before joining a channel.
   * - true: Subscribe to all video streams automatically.
   * - false: (Default) do not subscribe to any video stream automatically.
   */
  autoSubscribeVideo: boolean;
  /**
  * Determines which media player source should be published.
  * - DEFAULT_PLAYER_ID(0) is default.
  */
  publishMediaPlayerId: number;
  /**
   * Determines whether to enable audio recording or playout.
   * - true: It's used to publish audio and mix microphone, or subscribe audio and playout
   * - false: It's used to publish extenal audio frame only without mixing microphone, or no need audio device to playout audio either
   */
  enableAudioRecordingOrPlayout: boolean;
  /**
   * The client role type: #CLIENT_ROLE_TYPE.
   */
  clientRoleType: ClientRoleType;
  /**
   * The default video stream type: #REMOTE_VIDEO_STREAM_TYPE.
   */
  defaultVideoStreamType: REMOTE_VIDEO_STREAM_TYPE;
  /**
   * The channel profile: #CHANNEL_PROFILE_TYPE.
   */
  channelProfile: CHANNEL_PROFILE_TYPE;
}
/**
 * The watermark's options.
 */
export interface WatermarkOptions {
  /**
   * Sets whether or not the watermark image is visible in the local video 
   * preview:
   * - true: (Default) The watermark image is visible in preview.
   * - false: The watermark image is not visible in preview. 
   */
  visibleInPreview: boolean,
  /**
   * The watermark position in the portrait mode. See {@link Rectangle}
   */
  positionInPortraitMode: Rectangle,
  /**
   * The watermark position in the landscape mode. See {@link Rectangle}
   */
  positionInLandscapeMode: Rectangle
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
   *  - ID of the broadcaster whose media stream you want to relay. The 
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
   * - `uid`: ID of the broadcaster in the destination channel. 
   * The value ranges from 0 to 2<sup>32</sup>-1. To avoid UID conflicts, 
   * this `uid` must be different from any other UIDs in the destination 
   * channel. The default value is 0, which means the SDK randomly generates 
   * a UID.
   * 
   */
  destInfos: [ChannelMediaInfo];
}
/**
 * The event code.
 * - 0: The user disconnects from the server due to poor network connections.
 * - 1: The network reconnects.
 * - 2: The user joins the source channel.
 * - 3: The user joins the destination channel.
 * - 4: The SDK starts relaying the media stream to the destination channel.
 * - 5: The server receives the video stream from the source channel.
 * - 6: The server receives the audio stream from the source channel.
 * - 7: The destination channel is updated.
 * - 8: The destination channel update fails due to internal reasons.
 * - 9: The destination channel does not change, which means that the 
 * destination channel fails to be updated.
 * - 10: The destination channel name is NULL.
 * - 11: The video profile is sent to the server.
 */
export type ChannelMediaRelayEvent =
  | 0 // 0: RELAY_EVENT_NETWORK_DISCONNECTED
  | 1 // 1: RELAY_EVENT_NETWORK_CONNECTED
  | 2 // 2: RELAY_EVENT_PACKET_JOINED_SRC_CHANNEL
  | 3 // 3: RELAY_EVENT_PACKET_JOINED_DEST_CHANNEL
  | 4 // 4: RELAY_EVENT_PACKET_SENT_TO_DEST_CHANNEL
  | 5 // 5: RELAY_EVENT_PACKET_RECEIVED_VIDEO_FROM_SRC
  | 6 // 6: RELAY_EVENT_PACKET_RECEIVED_AUDIO_FROM_SRC
  | 7 // 7: RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL
  | 8 // 8: RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_REFUSED
  | 9 // 9: RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_NOT_CHANGE
  | 10 // 10: RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_IS_NULL
  | 11; // 11: RELAY_EVENT_VIDEO_PROFILE_UPDATE
/**
 * The state code.
 * - 0: The SDK is initializing.
 * - 1: The SDK tries to relay the media stream to the destination channel.
 * - 2: The SDK successfully relays the media stream to the destination 
 * channel.
 * - 3: A failure occurs. See the error code in 
 * {@link ChannelMediaRelayError}.
 */
export type ChannelMediaRelayState =
  | 0 // 0: RELAY_STATE_IDLE
  | 1 // 1: RELAY_STATE_CONNECTING
  | 2 // 2: RELAY_STATE_RUNNING
  | 3; // 3: RELAY_STATE_FAILURE
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
export type ChannelMediaRelayError =
  | 0 // 0: RELAY_OK
  | 1 // 1: RELAY_ERROR_SERVER_ERROR_RESPONSE
  | 2 // 2: RELAY_ERROR_SERVER_NO_RESPONSE
  | 3 // 3: RELAY_ERROR_NO_RESOURCE_AVAILABLE
  | 4 // 4: RELAY_ERROR_FAILED_JOIN_SRC
  | 5 // 5: RELAY_ERROR_FAILED_JOIN_DEST
  | 6 // 6: RELAY_ERROR_FAILED_PACKET_RECEIVED_FROM_SRC
  | 7 // 7: RELAY_ERROR_FAILED_PACKET_SENT_TO_DEST
  | 8 // 8: RELAY_ERROR_SERVER_CONNECTION_LOST
  | 9 // 9: RELAY_ERROR_INTERNAL_ERROR
  | 10 // 10: RELAY_ERROR_SRC_TOKEN_EXPIRED
  | 11; // 11: RELAY_ERROR_DEST_TOKEN_EXPIRED

export type AREA_CODE =
  | 1 //AREA_CODE_CN = ,
  | 2 //AREA_CODE_NA = ,
  | 4 //AREA_CODE_EUR = ,
  | 8 //AREA_CODE_AS = ,
  | 16//AREA_CODE_JAPAN = ,
  | 32 //AREA_CODE_INDIA = ,
  | (0xFFFFFFFF); //AREA_CODE_GLOBAL = 

export type STREAM_PUBLISH_STATE =
    | 0 //PUB_STATE_IDLE
    | 1 //PUB_STATE_NO_PUBLISHED
    | 2 //PUB_STATE_PUBLISHING
    | 3 //PUB_STATE_PUBLISHED

export type AUDIO_ROUTE_TYPE = 
    | -1 //AUDIO_ROUTE_DEFAULT
    | 0  //AUDIO_ROUTE_HEADSET
    | 1  //AUDIO_ROUTE_EARPIECE
    | 2  //AUDIO_ROUTE_HEADSET_NO_MIC
    | 3  //AUDIO_ROUTE_SPEAKERPHONE
    | 4  //AUDIO_ROUTE_LOUDSPEAKER
    | 5  //AUDIO_ROUTE_BLUETOOTH
    | 6  //AUDIO_ROUTE_USB
    | 7  //AUDIO_ROUTE_HDMI
    | 8  //AUDIO_ROUTE_DISPLAYPORT
    | 9  //AUDIO_ROUTE_AIRPLAY

export interface Metadata {
    /** The User ID.
    - For the receiver: the ID of the user who sent the metadata.
    - For the sender: ignore it.
    */
    uid: number;
    /** Buffer size of the sent or received Metadata.
      */
    size: number;
    /** Buffer address of the sent or received Metadata.
     */
    buffer: string;
    /** Time statmp of the frame following the metadata.
     */
    timeStampMs: number;
  }

export declare type MEDIA_STREAM_TYPE = 
  | 0 //Unknown stream type
  | 1 //Video stream
  | 2 //Audio stream
  | 3 //Subtitle stream

export interface MediaStreamInfo { /* the index of the stream in the media file */
    streamIndex : number;
  
    /* stream type */
    streamType : MEDIA_STREAM_TYPE;
  
    /* stream encoding name */
    codecName : string;
  
    /* streaming language */
    language : string;
  
    /* If it is a video stream, video frames rate */
    videoFrameRate : number;
  
    /* If it is a video stream, video bit rate */
    videoBitRate : number;
  
    /* If it is a video stream, video width */
    videoWidth : number;
  
    /* If it is a video stream, video height */
    videoHeight : number;
  
    /* If it is a video stream, video rotation */
    videoRotation : number;
  
    /* If it is an audio stream, audio bit rate */
    audioSampleRate : number;
  
    /* If it is an audio stream, the number of audio channels */
    audioChannels : number;
  
    /* stream duration in second */
    duration : number;
  };

export declare type MEDIA_PLAYER_PLAY_SPEED = 
  | 100 //origin playback speed
  | 75 //playback speed slow down to 0.75
  | 50 //playback speed slow down to 0.5
  | 125 //playback speed speed up to 1.25
  | 150 //playback speed speed up to 1.5
  | 200 //playback speed speed up to 2.0


export enum MEDIA_PLAYER_STATE {
    /** Player idle
     */
    PLAYER_STATE_IDLE = 0,
    /** Opening media file
     */
    PLAYER_STATE_OPENING,
    /** Media file opened successfully
     */
    PLAYER_STATE_OPEN_COMPLETED,
    /** Player playing
     */
    PLAYER_STATE_PLAYING,
    /** Player paused
     */
    PLAYER_STATE_PAUSED,
    /** Player playback completed
     */
    PLAYER_STATE_PLAYBACK_COMPLETED,
    /** Player stopped
     */
    PLAYER_STATE_STOPPED = PLAYER_STATE_IDLE,
    /** Player pausing (internal)
     */
    PLAYER_STATE_PAUSING_INTERNAL = 50,
    /** Player stopping (internal)
     */
    PLAYER_STATE_STOPPING_INTERNAL,
    /** Player seeking state (internal)
     */
    PLAYER_STATE_SEEKING_INTERNAL,
    /** Player getting state (internal)
     */
    PLAYER_STATE_GETTING_INTERNAL,
    /** None state for state machine (internal)
     */
    PLAYER_STATE_NONE_INTERNAL,
    /** Do nothing state for state machine (internal)
     */
    PLAYER_STATE_DO_NOTHING_INTERNAL,
    /** Player failed
     */
    PLAYER_STATE_FAILED = 100,
  };

export enum MEDIA_PLAYER_ERROR {
    /** No error
     */
    PLAYER_ERROR_NONE = 0,
    /** The parameter is incorrect
     */
    PLAYER_ERROR_INVALID_ARGUMENTS = -1,
    /** Internel error
     */
    PLAYER_ERROR_INTERNAL = -2,
    /** No resource error
     */
    PLAYER_ERROR_NO_RESOURCE = -3,
    /** Media source is invalid
     */
    PLAYER_ERROR_INVALID_MEDIA_SOURCE = -4,
    /** Unknown stream type
     */
    PLAYER_ERROR_UNKNOWN_STREAM_TYPE = -5,
    /** Object is not initialized
     */
    PLAYER_ERROR_OBJ_NOT_INITIALIZED = -6,
    /** Decoder codec not supported
     */
    PLAYER_ERROR_CODEC_NOT_SUPPORTED = -7,
    /** Video renderer is invalid
     */
    PLAYER_ERROR_VIDEO_RENDER_FAILED = -8,
    /** Internal state error
     */
    PLAYER_ERROR_INVALID_STATE = -9,
    /** Url not found
     */
    PLAYER_ERROR_URL_NOT_FOUND = -10,
    /** Invalid connection state
     */
    PLAYER_ERROR_INVALID_CONNECTION_STATE = -11,
    /** Insufficient buffer data
     */
    PLAYER_ERROR_SRC_BUFFER_UNDERFLOW = -12,
  };

export enum MEDIA_PLAYER_EVENT {
    /** player seek begin
     */
    PLAYER_EVENT_SEEK_BEGIN = 0,
    /** player seek complete
     */
    PLAYER_EVENT_SEEK_COMPLETE = 1,
    /** player seek error
     */
    PLAYER_EVENT_SEEK_ERROR = 2,
    /** player video published
     */
    PLAYER_EVENT_VIDEO_PUBLISHED = 3,
    /** player audio published
     */
    PLAYER_EVENT_AUDIO_PUBLISHED = 4,
    /** player audio track changed
     */
    PLAYER_EVENT_AUDIO_TRACK_CHANGED = 5,
  };

  export interface VideoDimensions {
    width: number,
    height: number
  }

  export interface ScreenCaptureParameters {
    width: number,
    height: number,
    frameRate: number,
    bitrate: number
  }
  
  export interface ScreenCaptureConfiguration {
    isCaptureWindow: boolean,
    displayId: number,
    screenRect: Rectangle,
    windowId: number,
    params: ScreenCaptureParameters,
    regionRect: Rectangle
  }

/**
 * interface for c++ addon (.node)
 * @ignore
 */
export interface NodeRtcEngine {
  /**
   * @ignore
   */
  initialize(appId: string, areaCode?: AREA_CODE): number;
  /**
   * @ignore
   */
  createMediaPlayer(): any;
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
    uid: number
  ): number;
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
  setupLocalVideo(): number;
  /**
   * @ignore
   */
  subscribe(type: number, uid: number, connId: number, deviceId: number): number;
  /**
   * @ignore
   */
  unsubscribe(type: number, uid: number, connId: number, deviceId: number): number;
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
  startEchoTest(): number;
  /**
   * @ignore
   */
  stopEchoTest(): number;
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
  setVideoEncoderConfiguration(
    config: VideoEncoderConfiguration
  ): number;
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
  muteRemoteAudioStream(uid: number, mute: boolean, connectionId: number): number;
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
  enableAudioVolumeIndication(interval: number, smooth: number): number;
  /**
   * @ignore
   */
  muteRemoteVideoStream(uid: number, mute: boolean, connectionId: number): number;
  /**
   * @ignore
   */
  pauseAudio(): number;
  /**
   * @ignore
   */
  resumeAudio(): number;
  /**
   * @ignore
   */
  setLogFile(filepath: string): number;
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
  enableLoopbackRecording(enable: boolean): number;
  /**
   * @ignore
   */
  enableLoopbackRecording2(connection_id: Number, enable: boolean): number;
  /**
   * @ignore
   */
  startAudioRecording(filePath: string, quality: number): number;
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
  startRecordingDeviceTest(interval: number): number;
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
  getScreenWindowsInfo(): Array<Object>;
  /**
   * @ignore
   */
  getScreenDisplaysInfo(): Array<Object>;
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
  stopScreenCapture(): number;
  /**
   * @ignore
   */
  updateScreenCaptureRegion(rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): number;
  /**
   * @ignore
   */
  startAudioMixing(
    filepath: string,
    loopback: boolean,
    replace: boolean,
    cycle: number
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
  // /**
  //  * @ignore
  //  */
  // setAudioMixingPitch(pitch: number): number;
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
  createDataStream(reliable: boolean, ordered: boolean): number;
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
    publish: number
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
  onEvent(event: string, callback: Function): void;
  /**
   * @ignore
   */
  registerDeliverFrame(callback: Function): number;
  /**
   * @ignore
   */
  adjustRecordingSignalVolume(volume: number): number;
  /**
   * @ignore
   */
  adjustPlaybackSignalVolume(volume: number): number;
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
  getPlugins(): Array<{id: string}>;
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
  sendCustomReportMessage(id: string, category: string, event: string, label: string, value: number): number;
  /**
   * @ignore
   */
  enableEncryption(enabled: boolean, config: EncryptionConfig): number;
  /**
   * @ignore
   */
  startLocalVideoTranscoder(config: LocalTranscoderConfiguration): number;
  /**
   * @ignore
   */
  updateLocalTranscoderConfiguration(config: LocalTranscoderConfiguration): number;
  /**
   * @ignore
   */
  stopLocalVideoTranscoder(): number;
  /**
   * @ignore
   */
  joinChannel2(token: string, channelId: string, userId: number, options: ChannelMediaOptions): number;
  /**
   * @ignore
   */
  joinChannelEx(token: string, channelId: string, userId: number, options: ChannelMediaOptions): number;
  /**
   * @ignore
   */
  updateChannelMediaOptions(options: ChannelMediaOptions, connectionId: number): number;
 /**
   * @ignore
   */
  startPrimaryCameraCapture(config: CameraCapturerConfiguration): number;
 /**
   * @ignore
   */
  startSecondaryCameraCapture(config: CameraCapturerConfiguration): number;
  /**
   * @ignore
   */
  stopPrimaryCameraCapture(): number;
  /**
   * @ignore
   */
  stopSecondaryCameraCapture(): number;
  /**
   * @ignore
   */
  startPrimaryScreenCapture(config: ScreenCaptureConfiguration): number;
  /**
   * @ignore
   */
  startSecondaryScreenCapture(config: ScreenCaptureConfiguration): number;
  /**
   * @ignore
   */
  stopPrimaryScreenCapture(): number;
  /**
  * @ignore
  */
  stopSecondaryScreenCapture(): number; 
  /**
  * @ignore
  */
 adjustLoopbackRecordingVolume(volume: number): number; 
}

export interface NodeMediaPlayer {
  onEvent(event: string, callback: Function): void;
  open(url: string, position: number): number;
  play(): number;
  pause(): number;
  stop(): number;
  seek(position: number): number;
  getPlayPosition(): number;
  getDuration(): number;
  getStreamCount(): number;
  getSourceId(): number;
  getStreamInfo(index: number): MediaStreamInfo;
  setPlayerOption(key: string, value: number): number;
  changePlaybackSpeed(speed: MEDIA_PLAYER_PLAY_SPEED): number;
  selectAudioTrack(index: number): number;

}