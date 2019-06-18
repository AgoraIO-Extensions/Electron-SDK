export type AgoraNetworkQuality =
  | 0 // unknown
  | 1 // excellent
  | 2 // good
  | 3 // poor
  | 4 // bad
  | 5 // very bad
  | 6; // down

/**
 * 用户角色类型：
 * - 1：主播
 * - 2：观众
 */
export type ClientRoleType = 1 | 2;

/** 0 for high, 1 for low */
export type StreamType = 0 | 1;

export type MediaDeviceType =
  | -1 // Unknown device type
  | 0 // Audio playback device
  | 1 // Audio recording device
  | 2 // Video renderer
  | 3 // Video capturer
  | 4; // Application audio playback device

export interface TranscodingUser {
  /** stream uid */
  uid: number;
  /** x start positon of stream */
  x: number;
  /** y start positon of stream */
  y: number;
  /** selected width of stream */
  width: number;
  /** selected height of stream */
  height: number;
  /** zorder of the stream, [1,100] */
  zOrder: number;
  /** (double) transparency alpha of the stream, [0,1] */
  alpha: number;
  /**
   * - 0: (Default) Supports dual channels at most, depending on the upstream of the broadcaster.
   * - 1: The audio stream of the broadcaster uses the FL audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
   * - 2: The audio stream of the broadcaster uses the FC audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
   * - 3: The audio stream of the broadcaster uses the FR audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
   * - 4: The audio stream of the broadcaster uses the BL audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
   * - 5: The audio stream of the broadcaster uses the BR audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
   */
  audioChannel: number;
}

/** Transcoding Sets the CDN live audio/video transcoding settings. See LiveTranscoding. */
export interface TranscodingConfig {
  /** width of canvas */
  width: number;
  /** height of canvas */
  height: number;
  /** kbps value, for 1-1 mapping pls look at https://docs.agora.io/cn/Interactive%20Broadcast/API%20Reference/cpp/structagora_1_1rtc_1_1_video_encoder_configuration.html */
  videoBitrate: number;
  /** fps, default 15 */
  videoFrameRate: number;
  /** true for low latency, no video quality garanteed; false - high latency, video quality garanteed */
  lowLatency: boolean;
  /** Video GOP in frames, default 30 */
  videoGop: number;
  /**
   * - VIDEO_CODEC_PROFILE_BASELINE = 66
   * Baseline video codec profile. Generally used in video calls on mobile phones
   * - VIDEO_CODEC_PROFILE_MAIN = 77
   * Main video codec profile. Generally used in mainstream electronics such as MP4 players, portable video players, PSP, and iPads.
   * - VIDEO_CODEC_PROFILE_HIGH = 100
   * (Default) High video codec profile. Generally used in high-resolution broadcasts or television
   */
  videoCodecProfile: number;
  /**
   * RGB hex value. Value only, do not include a #. For example, 0xC0C0C0.
   * number color = (A & 0xff) << 24 | (R & 0xff) << 16 | (G & 0xff) << 8 | (B & 0xff)
   */
  backgroundColor: number;
  /** The number of users in the live broadcast */
  userCount: number;
  /**
   * - AUDIO_SAMPLE_RATE_32000 = 32000
   * - AUDIO_SAMPLE_RATE_44100 = 44100
   * - AUDIO_SAMPLE_RATE_48000 = 48000
   */
  audioSampleRate: number;
  /**
   * - 1: (Default) Mono
   * - 2: Two-channel stereo
   * - 3: Three-channel stereo
   * - 4: Four-channel stereo
   * - 5: Five-channel stereo
   * > A special player is required if you choose option 3, 4, or 5
   */
  audioChannels: number;
  watermark: {
    /**  url of the image */
    url: string;
    /** x start position of image */
    x: number;
    /** y start position of image */
    y: number;
    /** width of image */
    width: number;
    /** height of image */
    height: number;
  };
  /** transcodingusers array */
  transcodingUsers: Array<TranscodingUser>;
}

export interface LastmileProbeConfig {
  probeUplink: boolean;
  probeDownlink: boolean;
  expectedUplinkBitrate: number;
  expectedDownlinkBitrate: number;
}

export interface LastmileProbeOneWayResult {
  packetLossRate: number;
  jitter: number;
  availableBandwidth: number;
}

export interface LastmileProbeResult {
  state: number;
  uplinkReport: LastmileProbeOneWayResult;
  downlinkReport: LastmileProbeOneWayResult;
  rtt: number;
}

/** Local voice changer options. */
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

export interface InjectStreamConfig {
  /** Width of the added stream in the live broadcast. The default value is 0 (same width as the original stream) */
  width: number;
  /** Height of the added stream in the live broadcast. The default value is 0 (same height as the original stream) */
  height: number;
  /** Video bitrate of the added stream in the live broadcast. The default value is 400 Kbps. */
  videoBitrate: number;
  /** Video frame rate of the added stream in the live broadcast. The default value is 15 fps */
  videoFrameRate: number;
  /** Video GOP of the added stream in the live broadcast in frames. The default value is 30 fps */
  videoGop: number;
  /**
   * Audio-sampling rate of the added stream in the live broadcast: #AUDIO_SAMPLE_RATE_TYPE. The default value is 48000 Hz
   * **Note**： Agora recommends setting the default value
   * - AUDIO_SAMPLE_RATE_32000 = 32000
   * - AUDIO_SAMPLE_RATE_44100 = 44100
   * - AUDIO_SAMPLE_RATE_48000 = 48000
   */
  audioSampleRate: number;
  /**
   * **Note**： Agora recommends setting the default value
   * Audio bitrate of the added stream in the live broadcast. The default value is 48
   */
  audioBitrate: number;
  /**
   * **Note**： Agora recommends setting the default value
   * - 1: (Default) Mono
   * - 2: Two-channel stereo
   */
  audioChannels: number;
}

/**
 * 远端用户媒体流的优先级。
 */
export enum Priority {
  /** 50：用户媒体流的优先级为高。 */
  PRIORITY_HIGH = 50,
  /** 100：（没骗人）用户媒体流的优先级正常。 */
  PRIORITY_NORMAL = 100
}

export interface RtcStats {
  duration: number;
  txBytes: number;
  rxBytes: number;
  txKBitRate: number;
  rxKBitRate: number;
  rxAudioKBitRate: number;
  txAudioKBitRate: number;
  rxVideoKBitRate: number;
  txVideoKBitRate: number;
  userCount: number;
  cpuAppUsage: number;
  cpuTotalUsage: number;
}

export enum AualityAdaptIndication {
  /** The quality of the local video stays the same. */
  ADAPT_NONE = 0,
  /** The quality improves because the network bandwidth increases. */
  ADAPT_UP_BANDWIDTH = 1,
  /** The quality worsens because the network bandwidth decreases. */
  ADAPT_DOWN_BANDWIDTH = 2,
}

export interface LocalVideoStats {
  sentBitrate: number;
  sentFrameRate: number;
  targetBitrate: number;
  targetFrameRate: number;
  qualityAdaptIndication: AualityAdaptIndication;
}
/**
 * 视频编码属性定义。
 */
export interface VideoEncoderConfiguration {
  /**
   * 视频帧在横轴上的像素。
   */
  width: number;
  /**
   * 视频帧在纵轴上的像素。
   */
  height: number;
  /**
   * 视频编码的帧率（fps）。建议不要超过 30 帧。
   */
  frameRate: number; // we do not recommend setting this to a value greater than 30
  /**
   * 最低视频编码帧率，单位为 fps。默认值为 -1。
   */
  minFrameRate: number; //  The minimum frame rate of the video. The default value is -1.
  /**
   * 视频编码的码率，单位为 Kbps。你可以根据场景需要，参考下面的视频基准码率参考表，手动设置你想要的码率。若设置的视频码率超出合理范围，SDK 会自动按照合理区间处理码率。
   * 你也可以选择如下一种模式：
   * - 0：（推荐）标准码率模式。该模式下，通信码率与基准码率一致；直播码率对照基准码率翻倍
   * - 1：适配码率模式。该模式下，视频在通信和直播模式下的码率与基准码率一致。
   *
   * **视频码率参考表**
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
  bitrate: number; // 0 - standard(recommended), 1 - compatible
  minBitrate: number; // by default -1, changing this value is NOT recommended
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
  receivedFrameRate: number;
  /**
   * 0 for high stream and 1 for low stream
   */
  rxStreamType: StreamType;
}

/**
 * 摄像头采集偏好。
 */
export enum CaptureOutPreference {
  /**
   * 0：（默认）自动调整采集参数。SDK 根据实际的采集设备性能及网络情况，选择合适的摄像头输出参数，在设备性能及视频预览质量之间，维持平衡
   */
  CAPTURER_OUTPUT_PREFERENCE_AUTO = 0,
  /**
   * 1：优先保证设备性能。SDK 根据用户在 {@link AgoraRtcEngine.setVideoEncoderConfiguration setVideoEncoderConfiguration} 中设置编码器的分辨率和帧率，选择最接近的摄像头输出参数，从而保证设备性能。在这种情况下，预览质量接近于编码器的输出质量
   */
  CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE = 1,
  /**
   * 2：优先保证视频预览质量。SDK 选择较高的摄像头输出参数，从而提高预览视频的质量。在这种情况下，会消耗更多的 CPU 及内存做视频前处理
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

/** 网络连接状态。
 *
 * 1：网络连接断开。该状态表示 SDK 处于：
 * - 调用 {@link joinChannel} 加入频道前的初始化阶段
 * - 或调用 {@link leaveChannel} 后的离开频道阶段
 *
 * 2：建立网络连接中。该状态表示 SDK 在调用 {@link AgoraRtcEngine.joinChannel joinChannel} 后正在与指定的频道建立连接。
 * - 如果成功加入频道，App 会收到 connectionStateChanged 回调，通知当前网络状态变成 3：网络已连接
 * - 建议连接后，SDK 还会处理媒体初始化，一切就绪后会回调 joinedChannel
 *
 * 3：网络已连接。该状态表示用户已经加入频道，可以在频道内发布或订阅媒体流。如果因网络断开或切换而导致 SDK 与频道的连接中断，SDK 会自动重连，此时 App 会收到：
 * - connectionStateChanged 回调，通知网络状态变成 4：重新建立网络连接中
 *
 * 4：重新建立网络连接中。该状态表示 SDK 之前曾加入过频道，但因网络等原因连接中断了，此时 SDK 会自动尝试重新接入频道。
 * - 如果 SDK 无法在 10 秒内重新接入频道，则 connectionLost 会被触发，SDK 会一致保留该状态，并不断尝试重新加入频道
 * - 如果 SDK 在断开连接后，20 分钟内还是没能重新加入频道，App 会收到 connectionStateChanged 回调，通知当前网络状态进入 5：网络连接失败，SDK 停止尝试重连
 *
 * 5：网络连接失败。该状态表示 SDK 已不再尝试重新加入频道，用户必须要调用 {@link AgoraRtcEngine.leaveChannel leaveChannel} 离开频道。
 * - 如果用户还想重新加入频道，则需要再次调用 {@link AgoraRtcEngine.joinChannel joinChannel}
 * - 如果 SDK 因服务器端使用 RESTful API 禁止加入频道，则 App 会收到 connectionStateChanged 回调
 */
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

/**
 * @deprecated 该枚举已废弃。
 * @description 视频属性。 */
export enum VIDEO_PROFILE_TYPE {
  /** 0：分辨率 160 × 120，帧率 15 fps，码率 65 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_120P = 0,
  /** 2：分辨率 120 × 120，帧率 15 fps，码率 50 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_120P_3 = 2,
  /** 10：分辨率 320 × 180，帧率 15 fps，码率 140 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_180P = 10,
  /** 12：分辨率 180 × 180，帧率 15 fps，码率 100 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_180P_3 = 12,
  /** 13：分辨率 240 × 180，帧率 15 fps，码率 120 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_180P_4 = 13,
  /** 20：分辨率 320 × 240，帧率 15 fps，码率 200 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_240P = 20,
  /** 22：分辨率 240 × 240，帧率 15 fps，码率 140 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_240P_3 = 22,
  /** 23：分辨率 424 × 240，帧率 15 fps，码率 220 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_240P_4 = 23,
  /** 30：分辨率 640 × 360，帧率 15 fps，码率 400 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_360P = 30,
  /** 32：分辨率 360 × 360，帧率 15 fps，码率 260 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_360P_3 = 32,
  /** 33：分辨率 640 × 360，帧率 30 fps，码率 600 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_360P_4 = 33,
  /** 35：分辨率 360 × 360，帧率 30 fps，码率 400 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_360P_6 = 35,
  /** 36：分辨率 480 × 360，帧率 15 fps，码率 320 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_360P_7 = 36,
  /** 37：分辨率 480 × 360，帧率 30 fps，码率 490 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_360P_8 = 37,
  /** 38：分辨率 640 × 360，帧率 15 fps，码率 800 Kbps。
   * **Note**：该视频属性仅适用于直播频道模式。
   */
  VIDEO_PROFILE_LANDSCAPE_360P_9 = 38,
  /** 39：分辨率 640 × 360，帧率 24 fps，码率 800 Kbps。
   * **Note**：该视频属性仅适用于直播频道模式。
   */
  VIDEO_PROFILE_LANDSCAPE_360P_10 = 39,
  /** 100：分辨率 640 × 360，帧率 24 fps，码率 1000 Kbps。
   * **Note**：该视频属性仅适用于直播频道模式。
   */
  VIDEO_PROFILE_LANDSCAPE_360P_11 = 100,
  /** 40：分辨率 640 × 480，帧率 15 fps，码率 500 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_480P = 40,
  /** 42：分辨率 480 × 480，帧率 15 fps，码率 400 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_480P_3 = 42,
  /** 43：分辨率 640 × 480，帧率 30 fps，码率 750 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_480P_4 = 43,
  /** 45：分辨率 480 × 480，帧率 30 fps，码率 600 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_480P_6 = 45,
  /** 47：分辨率 848 × 480，帧率 15 fps，码率 610 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_480P_8 = 47,
  /** 48：分辨率 848 × 480，帧率 30 fps，码率 930 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_480P_9 = 48,
  /** 49：分辨率 640 × 480，帧率 10 fps，码率 400 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_480P_10 = 49,
  /** 50：分辨率 1280 × 720，帧率 15 fps，码率 1130 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_720P = 50,
  /** 52：分辨率 1280 × 720，帧率 30 fps，码率 1710 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_720P_3 = 52,
  /** 54：分辨率 960 × 720，帧率 15 fps，码率 910 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_720P_5 = 54,
  /** 55：分辨率 960 × 720，帧率 30 fps，码率 1380 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_720P_6 = 55,
  /** 60：分辨率 1920 × 1080，帧率 15 fps，码率 2080 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_1080P = 60,
  /** 62：分辨率 1920 × 1080，帧率 30 fps，码率 3150 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_1080P_3 = 62,
  /** 64：分辨率 1920 × 1080，帧率 60 fps，码率 4780 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_1080P_5 = 64,
  /** 66：分辨率 2560 × 1440，帧率 30 fps，码率 4850 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_1440P = 66,
  /** 67：分辨率 2560 × 1440，帧率 60 fps，码率 7350 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_1440P_2 = 67,
  /** 70：分辨率 3840 × 2160，分辨率 30 fps，码率 8910 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_4K = 70,
  /** 72：分辨率 3840 × 2160，帧率 60 fps，码率 13500 Kbps。 */
  VIDEO_PROFILE_LANDSCAPE_4K_3 = 72,
  /** 1000：分辨率 120 × 160，帧率 15 fps，码率 65 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_120P = 1000,
  /** 1002：分辨率 120 × 120，帧率 15 fps，码率 50 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_120P_3 = 1002,
  /** 1010：分辨率 180 × 320，帧率 15 fps，码率 140 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_180P = 1010,
  /** 1012：分辨率 180 × 180，帧率 15 fps，码率 100 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_180P_3 = 1012,
  /** 1013：分辨率 180 × 240，帧率 15 fps，码率 120 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_180P_4 = 1013,
  /** 1020：分辨率 240 × 320，帧率 15 fps，码率 200 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_240P = 1020,
  /** 1022：分辨率 240 × 240，帧率 15 fps，码率 140 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_240P_3 = 1022,
  /** 1023：分辨率 240 × 424，帧率 15 fps，码率 220 Kbps */
  VIDEO_PROFILE_PORTRAIT_240P_4 = 1023,
  /** 1030：分辨率 360 × 640，帧率 15 fps，码率 400 Kbps */
  VIDEO_PROFILE_PORTRAIT_360P = 1030,
  /** 1032：分辨率 360 × 360，帧率 15 fps，码率 260 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_360P_3 = 1032,
  /** 1033：分辨率 360 × 640，帧率 30 fps，码率 600 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_360P_4 = 1033,
  /** 1035：分辨率 360 × 360，帧率 30 fps，码率 400 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_360P_6 = 1035,
  /** 1036：分辨率 360 × 480，帧率 15 fps，码率 320 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_360P_7 = 1036,
  /** 1037：分辨率 360 × 480，帧率 30 fps，码率 490 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_360P_8 = 1037,
  /** 1038：分辨率 360 × 640，帧率 15 fps，码率 800 Kbps。
   * **Note**：该视频属性仅适用于直播频道模式。
   */
  VIDEO_PROFILE_PORTRAIT_360P_9 = 1038,
  /** 1039：分辨率 360 × 640，帧率 24 fps，码率 800 Kbps。
   * **Note**：该视频属性仅适用于直播频道模式。
   */
  VIDEO_PROFILE_PORTRAIT_360P_10 = 1039,
  /** 1100：分辨率 360 × 640，帧率 24 fps，码率 1000 Kbps。
   * **Note**： 该视频属性仅适用于直播频道模式。
   */
  VIDEO_PROFILE_PORTRAIT_360P_11 = 1100,
  /** 1040：分辨率 480 × 640，帧率 15 fps，码率 500 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_480P = 1040,
  /** 1042：分辨率 480 × 480，帧率 15 fps，码率 400 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_480P_3 = 1042,
  /** 1043：分辨率 480 × 640，帧率 30 fps，码率 750 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_480P_4 = 1043,
  /** 1045：分辨率 480 × 480，帧率 30 fps，码率 600 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_480P_6 = 1045,
  /** 1047：分辨率 480 × 848，帧率 15 fps，码率 610 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_480P_8 = 1047,
  /** 1048：分辨率 480 × 848，帧率 30 fps，码率 930 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_480P_9 = 1048,
  /** 1049：分辨率 480 × 640，帧率 10 fps，码率 400 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_480P_10 = 1049,
  /** 1050：分辨率 720 × 1280，帧率 15 fps，码率 1130 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_720P = 1050,
  /** 1052：分辨率 720 × 1280，帧率 30 fps，码率 1710 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_720P_3 = 1052,
  /** 1054：分辨率 720 × 960，帧率 15 fps，码率 910 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_720P_5 = 1054,
  /** 1055：分辨率 720 × 960，帧率 30 fps，码率 1380 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_720P_6 = 1055,
  /** 1060：分辨率 1080 × 1920，帧率 15 fps，码率 2080 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_1080P = 1060,
  /** 1062：分辨率 1080 × 1920，帧率 30 fps，码率 3150 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_1080P_3 = 1062,
  /** 1064：分辨率 1080 × 1920，帧率 60 fps，码率 4780 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_1080P_5 = 1064,
  /** 1066：分辨率 1440 × 2560，帧率 30 fps，码率 4850 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_1440P = 1066,
  /** 1067：分辨率 1440 × 2560，帧率 60 fps，码率 6500 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_1440P_2 = 1067,
  /** 1070：分辨率 2160 × 3840，分辨率 30 fps，码率 6500 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_4K = 1070,
  /** 1072：分辨率 2160 × 3840，帧率 60 fps，码率 6500 Kbps。 */
  VIDEO_PROFILE_PORTRAIT_4K_3 = 1072,
  /** 默认视频属性：分辨率 640 × 360，帧率 15 fps，码率 400 Kbps。 */
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
}
