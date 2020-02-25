import {
  PluginInfo,
  Plugin
} from './plugin';

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
   * The minimum value of width × height is 16 × 16. 
   */
  width: number;
  /** 
   * Height of the video. The default value is 640. 
   * The minimum value of width × height is 16 × 16. 
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
   * Frame rate of the output video stream set for the CDN live broadcast. 
   * The default value is 15 fps.
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
  /** RGB hex value.
   *
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

/** Sets the local voice changer option. */
export enum VoiceChangerPreset {
  /** 0: The original voice (no local voice change). */
  VOICE_CHANGER_OFF = 0,
  /** 1: An old man's voice. */
  VOICE_CHANGER_OLDMAN = 1,
  /** 2: A little boy's voice. */
  VOICE_CHANGER_BABYBOY = 2,
  /** 3: A little girl's voice. */
  VOICE_CHANGER_BABYGIRL = 3,
  /** 4: The voice of a growling bear. */
  VOICE_CHANGER_ZHUBAJIE = 4,
  /** 5: Ethereal vocal effects. */
  VOICE_CHANGER_ETHEREAL = 5,
  /** 6: Hulk's voice. */
  VOICE_CHANGER_HULK = 6
}
/**
 * Sets the local voice changer option.
 */
export enum AudioReverbPreset {
  /** 0: The original voice (no local voice reverberation). */
  AUDIO_REVERB_OFF = 0, // Turn off audio reverb
  /** 1: Pop music. */
  AUDIO_REVERB_POPULAR = 1,
  /** 2: R&B. */
  AUDIO_REVERB_RNB = 2,
  /** 3: Rock music. */
  AUDIO_REVERB_ROCK = 3,
  /** 4: Hip-hop. */
  AUDIO_REVERB_HIPHOP = 4,
  /** 5: Pop concert. */
  AUDIO_REVERB_VOCAL_CONCERT = 5,
  /** 6: Karaoke. */
  AUDIO_REVERB_KTV = 6,
  /** 7: Recording studio. */
  AUDIO_REVERB_STUDIO = 7
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
  minFrameRate: number;
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
}
/** The video encoding degradation preference under limited bandwidth. */
export enum DegradationPreference {
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
export enum OrientationMode  {
/**
 * 0: (Default) The output video always follows the orientation of the 
 * captured video, because the receiver takes the rotational information 
 * passed on from the video encoder. 
 * 
 * Mainly used between Agora’s SDKs.
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
/** Camera capturer configuration. */
export interface CameraCapturerConfiguration {
  /** The output configuration of camera capturer. */
  preference: CaptureOutPreference;
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

export type ScreenSymbol = MacScreenSymbol | WindowsScreenSymbol;

export type MacScreenSymbol = number;

export type WindowsScreenSymbol = Rectangle;

export type CaptureRect = Rectangle;

/** Screen sharing encoding parameters. */
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
   * rate reaches 4%. `totalFrozenTime` = the number of audio freeze x 2 x 
   * 1000(ms).
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

/**
 * The definition of {@link ChannelMediaInfo}.
 * 
 * - channel: The channel name. The default value is NULL, which means that 
 * the SDK applies the current channel name.
 * 
 * - token: The token that enables the user to join the channel. 
 * The default value is NULL, which means that the SDK applies the current 
 * token.
 * 
 * - uid: The user ID.
 * 
 * **Note**: 
 * 
 * String user accounts are not supported in media stream relay.
 */
export interface ChannelMediaInfo {
  channel: string;
  token: string;
  uid: number;
}

export interface ChannelMediaOptions {
  autoSubscribeAudio: boolean;
  autoSubscribeVideo: boolean;
}

/**
 * The configuration of the media stream relay.
 * 
 * - srcInfo: The information of the destination channel:
 * {@link ChannelMediaInfo}.
 * 
 * **Note**:
 * - `uid`: ID of the user whose media stream you want to relay. 
 * We recommend setting it as 0, which means that the SDK relays the media 
 * stream of the current broadcaster.
 * - If you do not use a token, we recommend using the default values of the 
 * parameters in {@link ChannelMediaInfo}.
 * - If you use a token, set uid as 0, and ensure that the token is generated 
 * with the `uid` set as 0.
 * 
 * - destInfos: The information of the destination channel: 
 * {@link ChannelMediaInfo}.
 * 
 * **Warning**:
 * - If you want to relay the media stream to multiple channels, define as 
 * many {@link ChannelMediaInfo} interface (at most four).
 * 
 * **Note**:
 * - `uid`: The user ID in the destination channel.
 */

export interface ChannelMediaRelayConfiguration {
  srcInfo: ChannelMediaInfo;
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
 * - 4: The server fails to join the source channel.
 * - 5: The server fails to join the destination channel.
 * - 6: The server fails to receive the data from the source channel.
 * - 7: The source channel fails to transmit data.
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

/**
 * interface for c++ addon (.node)
 * @ignore
 */
export interface NodeRtcEngine {
  /**
   * @ignore
   */
  initialize(appId: string): number;
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
    uid: number
  ): number;
  /**
   * @ignore
   */
  switchChannel(
    token: string,
    channel: string
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
  setVideoEncoderConfiguration(
    config: VideoEncoderConfiguration
  ): number;
  /**
   * @ignore
   */
  setBeautyEffectOptions(
    enable: boolean,
    options: {
      lighteningContrastLevel: 0 | 1 | 2; // 0 for low, 1 for normal, 2 for high
      lighteningLevel: number;
      smoothnessLevel: number;
      rednessLevel: number;
    }
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
  enableAudioVolumeIndication(interval: number, smooth: number): number;
  /**
   * @ignore
   */
  muteRemoteVideoStream(uid: number, mute: boolean): number;
  /**
   * @ignore
   */
  setInEarMonitoringVolume(volume: number): number;
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
  setLocalPublishFallbackOption(option: 0 | 1 | 2): number;
  /**
   * @ignore
   */
  setRemoteSubscribeFallbackOption(option: 0 | 1 | 2): number;
  /**
   * @ignore
   */
  setExternalAudioSource(
    enabled: boolean,
    samplerate: number,
    channels: number
  ): number;
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
  videoSourceInitialize(appId: string): number;
  /**
   * @ignore
   */
  videoSourceEnableWebSdkInteroperability(enabled: boolean): number;
  /**
   * @ignore
   */
  videoSourceJoin(
    token: string,
    cname: string,
    info: string,
    uid: number
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
  videoSourceEnableLoopbackRecording(enable: boolean): number;
  /**
   * @ignore
   */
  videoSourceEnableAudio(): number;
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
  setRecordingAudioFrameParameters(
    sampleRate: number,
    channel: 1 | 2,
    mode: 0 | 1 | 2,
    samplesPerCall: number
  ): number;
  /**
   * @ignore
   */
  setPlaybackAudioFrameParameters(
    sampleRate: number,
    channel: 1 | 2,
    mode: 0 | 1 | 2,
    samplesPerCall: number
  ): number;
  /**
   * @ignore
   */
  setMixedAudioFrameParameters(
    sampleRate: number,
    samplesPerCall: number
  ): number;
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
  getEffectCurrentPosition(soundId: number): number;
  /**
   * @ignore
   */
  setEffectPosition(soundId: number, position: number): number;
  /**
   * @ignore
   */
  getEffectDuration(filePath: string): number;
  /**
   * @ignore
   */
  adjustEffectPlayoutVolume(soundId:number, volume: number): number;
  /**
   * @ignore
   */
  adjustEffectPublishVolume(soundId:number, volume: number): number;
  /**
   * @ignore
   */
  getEffectPlayoutVolume(soundId:number): number;
  /**
   * @ignore
   */
  getEffectPublishVolume(soundId:number): number;
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
    userAccount: string
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
}

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
  setClientRole(
    clientRole: ClientRoleType
  ): number;

  /**
   * @ignore
   */
  setRemoteUserPriority(
    uid: number,
    priority: Priority
  ): number;

  /**
   * @ignore
   */
  renewToken(
    token: string
  ): number;

  /**
   * @ignore
   */
  setEncryptionSecret(
    secret: string
  ): number;

  /**
   * @ignore
   */
  setEncryptionMode(
    mode: string
  ): number;

  /**
   * @ignore
   */
  setRemoteVoicePosition(
    uid: number,
    pan: number,
    gain: number
  ): number;

  /**
   * @ignore
   */
  setDefaultMuteAllRemoteAudioStreams(
    muted: boolean
  ): number;

  /**
   * @ignore
   */
  setDefaultMuteAllRemoteVideoStreams(
    muted: boolean
  ): number;

  /**
   * @ignore
   */
  muteAllRemoteAudioStreams(
    muted: boolean
  ): number;

  /**
   * @ignore
   */
  muteRemoteAudioStream(
    uid: number,
    muted: boolean
  ): number;

  /**
   * @ignore
   */
  muteAllRemoteVideoStreams(
    muted: boolean
  ): number;

  /**
   * @ignore
   */
  muteRemoteVideoStream(
    uid: number,
    muted: boolean
  ): number;
  /**
   * @ignore
   */
  setRemoteVideoStreamType(
    uid: number,
    type: StreamType
  ): number;

  /**
   * @ignore
   */
  setRemoteDefaultVideoStreamType(
    type: StreamType
  ): number;

  /**
   * @ignore
   */
  createDataStream(
    reliable: boolean,
    ordered: boolean
  ): number;

  /**
   * @ignore
   */
  sendStreamMessage(
    streamId: number,
    msg: string
  ): number;

  /**
   * @ignore
   */
  addPublishStreamUrl(
    url: string,
    transcodingEnabled: boolean
  ): number;

  /**
   * @ignore
   */
  removePublishStreamUrl(
    url: string
  ): number;

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
}