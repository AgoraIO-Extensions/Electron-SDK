/**
 * Network quality types:
 * 
 * - 0: The network quality is unknown
 * - 1: The network quality is excellent.
 * - 2: The network quality is quite good, but the bitrate may be slightly lower than excellent.
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
 * Client roles in a live broadcast.
 * 
 * - 1: Host 
 * - 2: Audience 
 * */
export type ClientRoleType = 1 | 2;

/** Video stream types.
 * 
 * - 0: High-stream video
 * - 1: Low-stream video 
 */
export type StreamType = 0 | 1;

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
  /** Layer position of the video frame. The value ranges between 0 and 100.
   *
   * - 0: (Default) Lowest
   * - 100: Highest  
   */
  zOrder: number;
  /**  Transparency of the video frame in CDN live. The value ranges between 0 and 1.0:
   *
   * - 0: Completely transparent
   * - 1.0: (Default) Opaque
   */
  alpha: number;
  /** The audio channel of the sound. The default value is 0:
   * - 0: (Default) Supports dual channels at most, depending on the upstream of the broadcaster.
   * - 1: The audio stream of the broadcaster uses the FL audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
   * - 2: The audio stream of the broadcaster uses the FC audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
   * - 3: The audio stream of the broadcaster uses the FR audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
   * - 4: The audio stream of the broadcaster uses the BL audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
   * - 5: The audio stream of the broadcaster uses the BR audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
   */
  audioChannel: number;
}

/** Sets the CDN live audio/video transcoding settings. */
export interface TranscodingConfig {
  /** Width of the video. The default value is 360. The minimum value of width × height is 16 × 16. */
  width: number;
  /** Height of the video. The default value is 640. The minimum value of width × height is 16 × 16. */
  height: number;
  /** Bitrate of the CDN live output video stream. The default value is 400 Kbps. 
   * Set this parameter according to the Video Bitrate Table. 
   * If you set a bitrate beyond the proper range, the SDK automatically adapts it to a value within the range. */
  videoBitrate: number;
  /** Frame rate of the output video stream set for the CDN live broadcast. The default value is 15 fps.
   * 
   * **Note**: Agora adjusts all values over 30 to 30.
   */
  videoFrameRate: number;
  /** Latency mode:
   * 
   * - true: Low latency with unassured quality
   * - false: (Default) High latency with assured quality
   */
  lowLatency: boolean;
  /** Self-defined video codec profile.
   * 
   * If you set this parameter to other values, Agora adjusts it to the default value of 100.
   */
  videoGop: number;
  /** Self-defined video codec profile.
   * 
   * - VIDEO_CODEC_PROFILE_BASELINE = 66: Baseline video codec profile. Generally used in video calls on mobile phones
   * - VIDEO_CODEC_PROFILE_MAIN = 77: Main video codec profile. Generally used in mainstream electronics 
   * such as MP4 players, portable video players, PSP, and iPads.
   * - VIDEO_CODEC_PROFILE_HIGH = 100: (Default) High video codec profile. Generally used in high-resolution broadcasts or television
   */
  videoCodecProfile: number;
  /** RGB hex value. 
   * 
   * Background color of the output video stream for the CDN live broadcast defined as int color 
   * = (A & 0xff) << 24 | (R & 0xff) << 16 | (G & 0xff) << 8 | (B & 0xff)
   * 
   * **Note**: Value only, do not include a #. For example, 0xC0C0C0.
   */
  backgroundColor: number;
  /** The number of users in the live broadcast. */
  userCount: number;
  /** Self-defined audio-sample rate:
   * 
   * - AUDIO_SAMPLE_RATE_32000 = 32000
   * - AUDIO_SAMPLE_RATE_44100 = 44100 (default)
   * - AUDIO_SAMPLE_RATE_48000 = 48000
   */
  audioSampleRate: number;
  /** Agora's self-defined audio-channel types. We recommend choosing option 1 or 2. 
   * A special player is required if you choose option 3, 4, or 5:
   * 
   * - 1: (Default) Mono
   * - 2: Two-channel stereo
   * - 3: Three-channel stereo
   * - 4: Four-channel stereo
   * - 5: Five-channel stereo
   */
  audioChannels: number;
  /** The watermark image added to the CDN live publishing stream. */
  watermark: {
    /** HTTP/HTTPS URL address of the image on the broadcasting video. 
     * The maximum length of this parameter is 1024 bytes. */
    url: string;
    /** Horizontal position of the image from the upper left of the broadcasting video. */
    x: number;
    /** Vertical position of the image from the upper left of the broadcasting video. */
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
   * Sets whether or not to test the uplink network. Some users, for example, the audience in a Live-broadcast channel, 
   * do not need such a test:
   * 
   * - true: test
   * - false: do not test
   */
  probeUplink: boolean;
  /**
   * Sets whether or not to test the downlink network:
   * 
   * - true: test
   * - false: do not test
   */
  probeDownlink: boolean;
  /**
   * The expected maximum sending bitrate (Kbps) of the local user. The value ranges between 100 and 5000.
   */
  expectedUplinkBitrate: number;
  /**
   * The expected maximum receiving bitrate (Kbps) of the local user. The value ranges between 100 and 5000.
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
  /** States of the last-mile network probe test:
   * 
   * - 1: The last-mile network probe test is complete
   * - 2: The last-mile network probe test is incomplete and the bandwidth estimation is not available, 
   * probably due to limited test resources
   * - 3: The last-mile network probe test is not carried out, probably due to poor network conditions
   */
  state: number;
  /** The uplink last-mile network probe test result. See {@link LastmileProbeOneWayResult}. */
  uplinkReport: LastmileProbeOneWayResult;
  /** The downlink last-mile network probe test result. See {@link LastmileProbeOneWayResult}. */
  downlinkReport: LastmileProbeOneWayResult;
  /** The round-trip delay time (ms). */
  rtt: number;
}

export interface UserInfo {
  uid: number;
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
  /** Width of the added stream in the live broadcast. The default value is 0 (same width as the original stream). */
  width: number;
  /** Height of the added stream in the live broadcast. The default value is 0 (same height as the original stream). */
  height: number;
  /** Video bitrate of the added stream in the live broadcast. The default value is 400 Kbps. */
  videoBitrate: number;
  /** Video frame rate of the added stream in the live broadcast. The default value is 15 fps. */
  videoFrameRate: number;
  /** Video GOP of the added stream in the live broadcast in frames. The default value is 30 fps. */
  videoGop: number;
  /**
   * Audio-sampling rate of the added stream in the live broadcast. The default value is 48000 Hz.
   * **Note**: Agora recommends setting the default value.
   * - AUDIO_SAMPLE_RATE_32000 = 32000
   * - AUDIO_SAMPLE_RATE_44100 = 44100(default)
   * - AUDIO_SAMPLE_RATE_48000 = 48000
   */
  audioSampleRate: number;
  /**
   * Audio bitrate of the added stream in the live broadcast. The default value is 48.
   * **Note**: Agora recommends setting the default value.
   */
  audioBitrate: number;
  /** Audio channels in the live broadcast.
   * - 1: (Default) Mono
   * - 2: Two-channel stereo
   * **Note**: Agora recommends setting the default value.
   */
  audioChannels: number;
}
/**
 * Prioritizes a remote user's stream.
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
  /** Audio transmission bitrate (Kbps), represented by an instantaneous value. */
  txAudioKBitRate: number;
  /** Video receive bitrate (Kbps), represented by an instantaneous value. */
  rxVideoKBitRate: number;
  /** Video transmission bitrate (Kbps), represented by an instantaneous value. */
  txVideoKBitRate: number;
  /** Number of users in the channel. */
  userCount: number;
  /** Application CPU usage (%). */
  cpuAppUsage: number;
  /** Application CPU usage (%). */
  cpuTotalUsage: number;
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
  /** Bitrate (Kbps) sent since the last count. */
  sentBitrate: number;
  /** Frame rate (fps) sent since the last count. */
  sentFrameRate: number;
  /** The target bitrate (Kbps) of the current encoder. This value is estimated by the SDK 
   * based on the current network conditions. 
   */
  targetBitrate: number;
  /** The target frame rate (fps) of the current encoder. */
  targetFrameRate: number;
  /** Quality change of the local video in terms of target frame rate and target bit rate 
   * since last count. See {@link QualityAdaptIndication}.
   */
  qualityAdaptIndication: QualityAdaptIndication;
}
/** VideoEncoderConfiguration */
export interface VideoEncoderConfiguration {
  /** Width (pixels) of the video. */
  width: number;
  /** Height (pixels) of the video. */
  height: number;
  /**
   * The frame rate of the video. Note that we do not recommend setting this to a value greater than 30.
   */
  frameRate: number; 
  /**
   * The minimum frame rate of the video. The default value is -1.
   */
  minFrameRate: number; 
   /** The video encoding bitrate (Kbps).
    * Choose one of the following options:
    * 
    * - 0: (Recommended) The standard bitrate.
    *  - The Communication profile: the encoding bitrate equals the base bitrate.
    *  - The Live-broadcast profile: the encoding bitrate is twice the base bitrate.
    * - 1: The compatible bitrate: the bitrate stays the same regardless of the profile.
    * 
    * The Communication profile prioritizes smoothness, while the Live-broadcast profile prioritizes video quality (requiring a higher bitrate). We recommend setting the bitrate mode as #STANDARD_BITRATE to address this difference.
    *
    * The following table lists the recommended video encoder configurations, where the base bitrate applies to the Communication profile. 
    * Set your bitrate based on this table. If you set a bitrate beyond the proper range, the SDK automatically sets it to within the range.
    * 
    * <table>
    *     <tr>
    *         <th>分辨率</th>
    *         <th>帧率（fps）</th>
    *         <th>基准码率（通信场景）（Kbps）</th>
    *         <th>直播码率（直播场景）（Kbps）</th>
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
  minBitrate: number; 
  orientationMode: OrientationMode;
  degradationPreference: DegradationPreference;
}

export enum DegradationPreference {
  /** 0: (Default) Degrade the frame rate in order to maintain the video quality. */
  MAINTAIN_QUALITY = 0,
  /** 1: Degrade the video quality in order to maintain the frame rate. */
  MAINTAIN_FRAMERATE = 1,
  /** 2: (For future use) Maintain a balance between the frame rate and video quality. */
  MAINTAIN_BALANCED = 2,
}


export enum OrientationMode  {
  ORIENTATION_MODE_ADAPTIVE = 0, // 0: (Default) Adaptive mode.
  ORIENTATION_MODE_FIXED_LANDSCAPE = 1, // 1: Landscape mode
  ORIENTATION_MODE_FIXED_PORTRAIT = 2, // 2: Portrait mode.
}

export interface RemoteVideoStats {
  uid: number;
  delay: number;
  width: number;
  height: number;
  receivedBitrate: number;
  rendererOutputFrameRate: number;
  /**
   * 0 for high stream and 1 for low stream
   */
  rxStreamType: StreamType;
}

export enum CaptureOutPreference {
  /** 0: (Default) self-adapts the camera output parameters to the system performance and network conditions to balance CPU consumption and video preview quality.
   */
  CAPTURER_OUTPUT_PREFERENCE_AUTO = 0,
  /** 2: Prioritizes the system performance. The SDK chooses the dimension and frame rate of the local camera capture closest to those set by \ref IRtcEngine::setVideoEncoderConfiguration "setVideoEncoderConfiguration".
   */
  CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE = 1,
  /** 2: Prioritizes the local preview quality. The SDK chooses higher camera output parameters to improve the local video preview quality. This option requires extra CPU and RAM usage for video pre-processing.
   */
  CAPTURER_OUTPUT_PREFERENCE_PREVIEW = 2
}

export interface CameraCapturerConfiguration {
  preference: CaptureOutPreference;
}

export interface Rectangle {
  x: number; // The horizontal offset from the top-left corner.
  y: number; // The vertical offset from the top-left corner.
  width: number; // The width of the region.
  height: number; // The height of the region.
}

export type ScreenSymbol = MacScreenSymbol | WindowsScreenSymbol;

export type MacScreenSymbol = number;

export type WindowsScreenSymbol = Rectangle;

export type CaptureRect = Rectangle;

export interface CaptureParam {
  width: number; // Width (pixels) of the video
  height: number; // Height (pixels) of the video
  frameRate: number; // The frame rate (fps) of the shared region. The default value is 5. We do not recommend setting this to a value greater than 15.
  bitrate: number; //  The bitrate (Kbps) of the shared region. The default value is 0 (the SDK works out a bitrate according to the dimensions of the current screen).
}

export enum VideoContentHint {
  CONTENT_HINT_NONE = 0, // (Default) No content hint
  CONTENT_HINT_MOTION = 1, // Motion-intensive content. Choose this option if you prefer smoothness or when you are sharing a video clip, movie, or video game.
  CONTENT_HINT_DETAILS = 2 // Motionless content. Choose this option if you prefer sharpness or when you are sharing a picture, PowerPoint slide, or text.
}

export interface RemoteVideoTransportStats {
  uid: number;
  delay: number;
  lost: number;
  rxKBitRate: number;
}

export interface RemoteAudioTransportStats {
  uid: number;
  delay: number;
  lost: number;
  rxKBitRate: number;
}

export interface RemoteAudioStats {
  /** User ID of the remote user sending the audio streams. */
  uid: number;
  /** Audio quality received by the user: #QUALITY_TYPE. */
  quality: number;
  /** Network delay from the sender to the receiver. */
  networkTransportDelay: number;
  /** Jitter buffer delay at the receiver. */
  jitterBufferDelay: number;
  /** Packet loss rate in the reported interval. */
  audioLossRate: number;
}

export type RemoteVideoState =
  | 1 // running
  | 2; // frozen, usually caused by network reason

export type ConnectionState =
  | 1 // 1: The SDK is disconnected from Agora's edge server
  | 2 // 2: The SDK is connecting to Agora's edge server.
  | 3 // 3: The SDK is connected to Agora's edge server and has joined a channel. You can now publish or subscribe to a media stream in the channel.
  | 4 // 4: The SDK keeps rejoining the channel after being disconnected from a joined channel because of network issues.
  | 5; // 5: The SDK fails to connect to Agora's edge server or join the channel.

export type ConnectionChangeReason =
  | 0 // 0: The SDK is connecting to Agora's edge server.
  | 1 // 1: The SDK has joined the channel successfully.
  | 2 // 2: The connection between the SDK and Agora's edge server is interrupted.
  | 3 // 3: The connection between the SDK and Agora's edge server is banned by Agora's edge server.
  | 4 // 4: The SDK fails to join the channel for more than 20 minutes and stops reconnecting to the channel.
  | 5; // 5: The SDK has left the channel.

/** @deprecated Video profile. */
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
   * @note Live broadcast profile only.
   */
  VIDEO_PROFILE_LANDSCAPE_360P_9 = 38,
  /** 39: 640 &times; 360, frame rate 24 fps, bitrate 800 Kbps.
   * @note Live broadcast profile only.
   */
  VIDEO_PROFILE_LANDSCAPE_360P_10 = 39,
  /** 100: 640 &times; 360, frame rate 24 fps, bitrate 1000 Kbps.
   * @note Live broadcast profile only.
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
   * @note Live broadcast profile only.
   */
  VIDEO_PROFILE_PORTRAIT_360P_9 = 1038,
  /** 1039: 360 &times; 640, frame rate 24 fps, bitrate 800 Kbps.
   * @note Live broadcast profile only.
   */
  VIDEO_PROFILE_PORTRAIT_360P_10 = 1039,
  /** 1100: 360 &times; 640, frame rate 24 fps, bitrate 1000 Kbps.
   * @note Live broadcast profile only.
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
 * interface for c++ addon (.node)
 */
export interface NodeRtcEngine {
  initialize(appId: string): number;
  getVersion(): string;
  getErrorDescription(errorCode: number): string;
  getConnectionState(): ConnectionState;
  joinChannel(
    token: string,
    channel: string,
    info: string,
    uid: number
  ): number;
  leaveChannel(): number;
  release(): number;
  setHighQualityAudioParameters(
    fullband: boolean,
    stereo: boolean,
    fullBitrate: boolean
  ): number;
  setupLocalVideo(): number;
  subscribe(uid: number): number;
  setVideoRenderDimension(
    rendertype: number,
    uid: number,
    width: number,
    height: number
  ): void;
  setFPS(fps: number): void;
  setHighFPS(fps: number): void;
  addToHighVideo(uid: number): void;
  removeFromHighVideo(uid: number): void;
  renewToken(newToken: string): number;
  setChannelProfile(profile: number): number;
  setClientRole(role: ClientRoleType): number;
  startEchoTest(): number;
  stopEchoTest(): number;
  startEchoTestWithInterval(interval: number): number;
  enableLastmileTest(): number;
  disableLastmileTest(): number;
  startLastmileProbeTest(config: LastmileProbeConfig): number;
  stopLastmileProbeTest(): number;
  enableVideo(): number;
  disableVideo(): number;
  startPreview(): number;
  stopPreview(): number;
  setVideoProfile(
    profile: VIDEO_PROFILE_TYPE,
    swapWidthAndHeight: boolean
  ): number;
  setCameraCapturerConfiguration(config: CameraCapturerConfiguration): number;
  setVideoEncoderConfiguration(
    config: VideoEncoderConfiguration
  ): number;
  setBeautyEffectOptions(
    enable: boolean,
    options: {
      lighteningContrastLevel: 0 | 1 | 2; // 0 for low, 1 for normal, 2 for high
      lighteningLevel: number,
      smoothnessLevel: number,
      rednessLevel: number
    }
  ): number;
  setRemoteUserPriority(uid: number, priority: Priority): number;
  enableAudio(): number;
  disableAudio(): number;
  setAudioProfile(profile: number, scenario: number): number;
  setVideoQualityParameters(preferFrameRateOverImageQuality: boolean): number;
  setEncryptionSecret(secret: string): number;
  muteLocalAudioStream(mute: boolean): number;
  muteAllRemoteAudioStreams(mute: boolean): number;
  setDefaultMuteAllRemoteAudioStreams(mute: boolean): number;
  muteRemoteAudioStream(uid: number, mute: boolean): number;
  muteLocalVideoStream(mute: boolean): number;
  enableLocalVideo(enable: boolean): number;
  enableLocalAudio(enable: boolean): number;
  muteAllRemoteVideoStreams(mute: boolean): number;
  setDefaultMuteAllRemoteVideoStreams(mute: boolean): number;
  enableAudioVolumeIndication(interval: number, smooth: number): number;
  muteRemoteVideoStream(uid: number, mute: boolean): number;
  setInEarMonitoringVolume(volume: number): number;
  pauseAudio(): number;
  resumeAudio(): number;
  setLogFile(filepath: string): number;
  setLogFileSize(size: number): number;
  videoSourceSetLogFile(filepath: string): number;
  setLogFilter(filter: number): number;
  enableDualStreamMode(enable: boolean): number;
  setRemoteVideoStreamType(uid: number, streamType: StreamType): number;
  setRemoteDefaultVideoStreamType(streamType: StreamType): number;
  enableWebSdkInteroperability(enable: boolean): number;
  setLocalVideoMirrorMode(mirrorType: 0 | 1 | 2): number;
  setLocalVoicePitch(pitch: number): number;
  setLocalVoiceEqualization(bandFrequency: number, bandGain: number): number;
  setLocalVoiceReverb(reverbKey: number, value: number): number;
  setLocalVoiceChanger(preset: VoiceChangerPreset): number;
  setLocalVoiceReverbPreset(preset: AudioReverbPreset): number;
  setLocalPublishFallbackOption(option: 0 | 1 | 2): number;
  setRemoteSubscribeFallbackOption(option: 0 | 1 | 2): number;
  setExternalAudioSource(
    enabled: boolean,
    samplerate: number,
    channels: number
  ): number;
  getVideoDevices(): Array<Object>;
  setVideoDevice(deviceId: string): number;
  getCurrentVideoDevice(): Object;
  startVideoDeviceTest(): number;
  stopVideoDeviceTest(): number;
  getAudioPlaybackDevices(): Array<Object>;
  setAudioPlaybackDevice(deviceId: string): number;
  getPlaybackDeviceInfo(deviceId: string, deviceName: string): number;
  getCurrentAudioPlaybackDevice(): Object;
  setAudioPlaybackVolume(volume: number): number;
  getAudioPlaybackVolume(): number;
  getAudioRecordingDevices(): Array<Object>;
  setAudioRecordingDevice(deviceId: string): number;
  getRecordingDeviceInfo(deviceId: string, deviceName: string): number;
  getCurrentAudioRecordingDevice(): Object;
  getAudioRecordingVolume(): number;
  setAudioRecordingVolume(volume: number): number;
  startAudioPlaybackDeviceTest(filepath: string): number;
  stopAudioPlaybackDeviceTest(): number;
  enableLoopbackRecording(enable: boolean, deviceName: string | null): number;
  startAudioRecordingDeviceTest(indicateInterval: number): number;
  stopAudioRecordingDeviceTest(): number;
  startAudioDeviceLoopbackTest(interval: number): number;
  stopAudioDeviceLoopbackTest(): number;
  getAudioPlaybackDeviceMute(): boolean;
  setAudioPlaybackDeviceMute(mute: boolean): number;
  getAudioRecordingDeviceMute(): boolean;
  setAudioRecordingDeviceMute(mute: boolean): number;
  videoSourceInitialize(appId: string): number;
  videoSourceEnableWebSdkInteroperability(enabled: boolean): number;
  videoSourceJoin(
    token: string,
    cname: string,
    info: string,
    uid: number
  ): number;
  videoSourceLeave(): number;
  videoSourceRenewToken(token: string): number;
  videoSourceSetChannelProfile(profile: number): number;
  videoSourceSetVideoProfile(
    profile: VIDEO_PROFILE_TYPE,
    swapWidthAndHeight: boolean
  ): number;
  videosourceStartScreenCaptureByScreen(screenSymbol: ScreenSymbol, rect: CaptureRect, param: CaptureParam): number;
  videosourceStartScreenCaptureByWindow(windowSymbol: number, rect: CaptureRect, param: CaptureParam): number;
  videosourceUpdateScreenCaptureParameters(param: CaptureParam): number;
  videosourceSetScreenCaptureContentHint(hint: VideoContentHint): number;
  getScreenWindowsInfo(): Array<Object>;
  getScreenDisplaysInfo(): Array<Object>;
  startScreenCapture2(
    windowId: number,
    captureFreq: number,
    rect: { left: number; right: number; top: number; bottom: number },
    bitrate: number
  ): number;
  stopScreenCapture2(): number;
  videoSourceStartPreview(): number;
  videoSourceStopPreview(): number;
  videoSourceEnableDualStreamMode(enable: boolean): number;
  videoSourceSetParameter(parameter: string): number;
  videoSourceUpdateScreenCaptureRegion(rect: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }): number;
  videoSourceRelease(): number;
  startScreenCapture(
    windowId: number,
    captureFreq: number,
    rect: { left: number; right: number; top: number; bottom: number },
    bitrate: number
  ): number;
  stopScreenCapture(): number;
  updateScreenCaptureRegion(rect: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }): number;
  startAudioMixing(
    filepath: string,
    loopback: boolean,
    replace: boolean,
    cycle: number
  ): number;
  stopAudioMixing(): number;
  pauseAudioMixing(): number;
  resumeAudioMixing(): number;
  adjustAudioMixingVolume(volume: number): number;
  adjustAudioMixingPlayoutVolume(volume: number): number;
  adjustAudioMixingPublishVolume(volume: number): number;
  getAudioMixingDuration(): number;
  getAudioMixingCurrentPosition(): number;
  setAudioMixingPosition(position: number): number;
  addPublishStreamUrl(url: string, transcodingEnabled: boolean): number;
  removePublishStreamUrl(url: string): number;
  setLiveTranscoding(transcoding: TranscodingConfig): number;
  addInjectStreamUrl(url: string, config: InjectStreamConfig): number;
  removeInjectStreamUrl(url: string): number;

  setRecordingAudioFrameParameters(
    sampleRate: number,
    channel: 1 | 2,
    mode: 0 | 1 | 2,
    samplesPerCall: number
  ): number;
  setPlaybackAudioFrameParameters(
    sampleRate: number,
    channel: 1 | 2,
    mode: 0 | 1 | 2,
    samplesPerCall: number
  ): number;
  setMixedAudioFrameParameters(
    sampleRate: number,
    samplesPerCall: number
  ): number;
  createDataStream(reliable: boolean, ordered: boolean): number;
  sendStreamMessage(streamId: number, msg: string): number;
  getEffectsVolume(): number;
  setEffectsVolume(volume: number): number;
  setVolumeOfEffect(soundId: number, volume: number): number;
  playEffect(
    soundId: number,
    filePath: string,
    loopcount: number,
    pitch: number,
    pan: number,
    gain: number,
    publish: number
  ): number;
  stopEffect(soundId: number): number;
  preloadEffect(soundId: number, filePath: string): number;
  unloadEffect(soundId: number): number;
  pauseEffect(soundId: number): number;
  pauseAllEffects(): number;
  resumeEffect(soundId: number): number;
  resumeAllEffects(): number;
  enableSoundPositionIndication(enable: boolean): number;
  setRemoteVoicePosition(uid: number, pan: number, gain: number): number;
  getCallId(): string;
  rate(callId: string, rating: number, desc: string): number;
  complain(callId: string, desc: string): number;
  setBool(key: string, value: boolean): number;
  setInt(key: string, value: number): number;
  setUInt(key: string, value: number): number;
  setNumber(key: string, value: number): number;
  setString(key: string, value: string): number;
  setObject(key: string, value: string): number;
  getBool(key: string): boolean;
  getInt(key: string): number;
  getUInt(key: string): number;
  getNumber(key: string): number;
  getString(key: string): string;
  getObject(key: string): string;
  getArray(key: string): string;
  setParameters(param: string): number;
  convertPath(path: string): string;
  setProfile(profile: string, merge: boolean): number;
  onEvent(event: string, callback: Function): void;
  unsubscribe(uid: number): number;
  registerDeliverFrame(callback: Function): number;
  registerLocalUserAccount(appId: string, userAccount: string): number;
  joinChannelWithUserAccount(token: string, channel: string, userAccount: string): number;
  getUserInfoByUserAccount(userAccount: string) : {errCode:number, userInfo: UserInfo};
  getUserInfoByUid(uid: number) : {errCode:number, userInfo: UserInfo};
}
