/**
 * 网络质量：
 * - 0：质量未知
 * - 1：质量极好
 * - 2：主观感觉和极好差不多，但码率可能略低于极好
 * - 3：主观感受有瑕疵但不影响沟通
 * - 4：勉强能沟通但不顺畅
 * - 5：网络质量非常差，基本不能沟通
 * - 6：网络连接已断开，完全无法沟通
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
 * 用户角色类型：
 * - 1：主播
 * - 2：观众
 */
export type ClientRoleType = 1 | 2;

/**
 * 视频流类型：
 * - 0：视频大流，即高分辨率、高码率视频流
 * - 1：视频小流，即低分辨率、低码率视频流
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
 * TranscodingUser 类。
 */
export interface TranscodingUser {
  /** 旁路推流的主播用户 ID。 */
  uid: number;
  /** 直播视频上用户视频在布局中的横坐标绝对值。 */
  x: number;
  /** 直播视频上用户视频在布局中的纵坐标绝对值。 */
  y: number;
  /** 直播视频上用户视频的宽度，默认值为 360。 */
  width: number;
  /** 直播视频上用户视频的高度，默认值为 640。 */
  height: number;
  /** 直播视频上用户视频帧的图层编号。取值范围为 [0, 100] 中的整型：
   * - 最小值为 0（默认值），表示该区域图像位于最下层
   * - 最大值为 100，表示该区域图像位于最上层
   */
  zOrder: number;
  /** 直播视频上用户视频的透明度。取值范围为 [0.0, 1.0]。0.0 表示该区域图像完全透明，而 1.0 表示该区域图像完全不透明。默认值为 1.0。 */
  alpha: number;
  /**
   * 直播音频所在声道。取值范围为 [0, 5]，默认值为 0。选项不为 0 时，需要特殊的播放器支持。
   * - 0：（推荐）默认混音设置，最多支持双声道，与主播端上行音频相关
   * - 1：对应主播的音频，推流中位于 FL 声道。如果主播上行为双声道，会先把多声道混音成单声道
   * - 2：对应主播的音频，推流中位于 FC 声道。如果主播上行为双声道，会先把多声道混音成单声道
   * - 3：对应主播的音频，推流中位于 FR 声道。如果主播上行为双声道，会先把多声道混音成单声道
   * - 4：对应主播的音频，推流中位于 BL 声道。如果主播上行为双声道，会先把多声道混音成单声道
   * - 5：对应主播的音频，推流中位于 BR 声道。如果主播上行为双声道，会先把多声道混音成单声道
   */
  audioChannel: number;
}

/**
 * 直播转码的相关配置。
 */
export interface TranscodingConfig {
  /** 用于旁路直播的输出视频的总宽度，默认值为 360。width × height 的最小值为 16 × 16。*/
  width: number;
  /** 用于旁路直播的输出视频的总高度，默认值为 640。width × height 的最小值为 16 × 16。*/
  height: number;
  /** 用于旁路直播的输出视频的码率，单位为 Kbps，默认值为 400 Kbps。用户可以根据码率参考表中的码率值进行设置；如果设置的码率超出合理范围，Agora 服务器会在合理区间内自动调整码率值。 */
  videoBitrate: number;
  /** 用于旁路直播的输出视频的帧率，单位为帧每秒，取值范围为 [15, 30]，默认值为 15 fps。服务器会将低于 15 的帧率设置改为 15，将高于 30 的帧率设置改为 30。*/
  videoFrameRate: number;
  /** 是否启用低延时模式：
   * - true：低延时，不保证画质
   * - false：（默认值）高延时，保证画质
   */
  lowLatency: boolean;
  /** 用于旁路直播的输出视频的 GOP，单位为帧。默认值为 30 帧。*/
  videoGop: number;
  /**
   * 用于旁路直播的输出视频的编解码规格。可以设置为 BASELINE、MAIN 或 HIGH；如果设置其他值，服务端会统一设为默认值 HIGH。
   * - VIDEO_CODEC_PROFILE_BASELINE = 66：Baseline 级别的视频编码规格，一般用于视频通话、手机视频等。
   * - VIDEO_CODEC_PROFILE_MAIN = 77：Main 级别的视频编码规格，一般用于主流消费类电子产品，如 mp4、便携的视频播放器、PSP 和 iPad 等
   * - VIDEO_CODEC_PROFILE_HIGH = 100：（默认）High 级别的视频编码规格，一般用于广播及视频碟片存储，高清电视
   */
  videoCodecProfile: number;
  /**
   * 设置旁路直播的背景颜色。格式为 RGB 定义下的 Hex 值，不要带 # 号，如 0xC0C0C0。
   * 颜色对应的 Hex 值 = (A & 0xff) << 24 | (R & 0xff) << 16 | (G & 0xff) << 8 | (B & 0xff)
   */
  backgroundColor: number;
  /** 获取旁路直播中的用户人数。*/
  userCount: number;
  /**
   * 用于旁路直播的输出音频的采样率：
   * - AUDIO_SAMPLE_RATE_32000 = 32000
   * - AUDIO_SAMPLE_RATE_44100 = 44100（默认）
   * - AUDIO_SAMPLE_RATE_48000 = 48000
   */
  audioSampleRate: number;
  /**
   * 用于旁路直播的输出音频的声道数，取值范围为 [1, 5] 中的整型，默认值为 1。建议取 1 或 2，其余三个选项需要特殊播放器支持：
   * - 1：单声道
   * - 2：双声道
   * - 3：三声道
   * - 4：四声道
   * - 5：五声道
   */
  audioChannels: number;
  watermark: {
    /** 直播视频上图片的 HTTP/HTTPS 地址，字符长度不得超过 1024 字节。 */
    url: string;
    /** 图片左上角在视频帧上的横轴坐标。*/
    x: number;
    /** 图片左上角在视频帧上的纵轴坐标。*/
    y: number;
    /** 图片在视频帧上的宽度。*/
    width: number;
    /** 图片在视频帧上的高度。*/
    height: number;
  };
  /** TranscodingUser 类。 */
  transcodingUsers: Array<TranscodingUser>;
}

/**
 * Last-mile 网络质量探测配置。
 */
export interface LastmileProbeConfig {
  /**
   * 是否探测上行网络。有些用户，如直播频道中的普通观众，不需要进行网络探测：
   * - true：探测
   * - false：不探测
   */
  probeUplink: boolean;
  /** 是否探测下行网络：
   * - true：探测
   * - false：不探测
   */
  probeDownlink: boolean;
  /**
   * 用户期望的最高发送码率，单位为 Kbps，范围为 [100, 5000]。
   */
  expectedUplinkBitrate: number;
  /**
   * 用户期望的最高接收码率，单位为 Kbps，范围为 [100, 5000]。
   */
  expectedDownlinkBitrate: number;
}
/**
 * 单向 Last-mile 质量探测结果。
 */
export interface LastmileProbeOneWayResult {
  /** 丢包率。*/
  packetLossRate: number;
  /** 网络抖动，单位为毫秒。*/
  jitter: number;
  /** 可用网络带宽预计，单位为 Kbps。*/
  availableBandwidth: number;
}
/**
 * 上下行 Last-mile 质量探测结果。
 */
export interface LastmileProbeResult {
  /**
   * Last-mile 质量探测结果的状态，有如下几种：
   * - 1：表示本次 Last-mile 质量探测是完整的
   * - 2：表示本次 Last-mile 质量探测未进行带宽预测，因此结果不完整。一个可能的原因是测试资源暂时受限
   * - 3：未进行 Last-mile 质量探测。一个可能的原因是网络连接中断
   */
  state: number;
  /**
   * 上行网络质量报告，详见 {@link LastmileProbeOneWayResult}。
   */
  uplinkReport: LastmileProbeOneWayResult;
  /**
   * 下行网络质量报告，详见 {@link LastmileProbeOneWayResult}。
   */
  downlinkReport: LastmileProbeOneWayResult;
  /**
   * 往返时延，单位为毫秒。
   */
  rtt: number;
}

/** 本地语音的变声效果选项 */
export enum VoiceChangerPreset {
  /** 0：原声，即关闭本地语音变声。 */
  VOICE_CHANGER_OFF = 0,
  /** 1：老男孩。 */
  VOICE_CHANGER_OLDMAN = 1,
  /** 2：小男孩。 */
  VOICE_CHANGER_BABYBOY = 2,
  /** 3：小女孩。 */
  VOICE_CHANGER_BABYGIRL = 3,
  /** 4：猪八戒。 */
  VOICE_CHANGER_ZHUBAJIE = 4,
  /** 5：空灵。 */
  VOICE_CHANGER_ETHEREAL = 5,
  /** 6：绿巨人。 */
  VOICE_CHANGER_HULK = 6
}
/**
 * 预设的本地语音混响效果选项：
 */
export enum AudioReverbPreset {
  /** 0：原声，即关闭本地语音混响。 */
  AUDIO_REVERB_OFF = 0, // Turn off audio reverb
  /** 1：流行。 */
  AUDIO_REVERB_POPULAR = 1,
  /** 2：R&B。 */
  AUDIO_REVERB_RNB = 2,
  /** 3：摇滚。 */
  AUDIO_REVERB_ROCK = 3,
  /** 4：嘻哈。 */
  AUDIO_REVERB_HIPHOP = 4,
  /** 5：演唱会。 */
  AUDIO_REVERB_VOCAL_CONCERT = 5,
  /** 6：KTV。 */
  AUDIO_REVERB_KTV = 6,
  /** 7：录音棚。 */
  AUDIO_REVERB_STUDIO = 7
}
/**
 * 外部导入音视频流定义。
 */
export interface InjectStreamConfig {
  /** 添加进入直播的外部视频源宽度。默认值为 0，即保留视频源原始宽度。 */
  width: number;
  /** 添加进入直播的外部视频源高度。默认值为 0，即保留视频源原始高度。 */
  height: number;
  /** 添加进入直播的外部视频源码率。默认设置为 400 Kbps。 */
  videoBitrate: number;
  /** 添加进入直播的外部视频源帧率。默认值为 15 fps。 */
  videoFrameRate: number;
  /** 添加进入直播的外部视频源 GOP。默认值为 30 帧。 */
  videoGop: number;
  /**
   * 添加进入直播的外部音频采样率。默认值为 44100。
   * **Note**：声网建议目前采用默认值，不要自行设置。
   * - AUDIO_SAMPLE_RATE_32000 = 32000
   * - AUDIO_SAMPLE_RATE_44100 = 44100（默认）
   * - AUDIO_SAMPLE_RATE_48000 = 48000
   */
  audioSampleRate: number;
  /**
   * 添加进入直播的外部音频码率。单位为 Kbps，默认值为 48。
   * **Note**：声网建议目前采用默认值，不要自行设置。
   */
  audioBitrate: number;
  /**
   * **Note**：添加进入直播的外部音频频道数。取值范围 [1, 2]，默认值为 1。
   * - 1：单声道（默认）
   * - 2：双声道立体声
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
/**
 * 通话相关的统计信息。
 */
export interface RtcStats {
  /** 通话时长，单位为秒，累计值。*/
  duration: number;
  /** 发送字节数（bytes），累计值。*/
  txBytes: number;
  /** 接收字节数（bytes），累计值。*/
  rxBytes: number;
  /** 发送码率（Kbps），瞬时值。*/
  txKBitRate: number;
  /** 接收码率（Kbps），瞬时值。*/
  rxKBitRate: number;
  /** 音频接收码率（Kbps），瞬时值。*/
  rxAudioKBitRate: number;
  /** 音频包的发送码率（Kbps），瞬时值。*/
  txAudioKBitRate: number;
  /** 视频接收码率（Kbps），瞬时值。*/
  rxVideoKBitRate: number;
  /** 视频发送码率（Kbps），瞬时值。*/
  txVideoKBitRate: number;
  /** 当前频道内的人数。*/
  userCount: number;
  /** 当前系统的 CPU 使用率 (%)。*/
  cpuAppUsage: number;
  /** 当前 App 的 CPU 使用率 (%)。*/
  cpuTotalUsage: number;
}
/**
 * 本地视频自适应情况：
 */
export enum QualityAdaptIndication {
  /** 0：本地视频质量不变。 */
  ADAPT_NONE = 0,
  /** 1：因网络带宽增加，本地视频质量改善。 */
  ADAPT_UP_BANDWIDTH = 1,
  /** 2：因网络带宽减少，本地视频质量变差。 */
  ADAPT_DOWN_BANDWIDTH = 2,
}
/**
 * 本地视频相关的统计信息。
 */
export interface LocalVideoStats {
  /**
   * （上次统计后）发送的码率，单位为 Kbps。
   */
  sentBitrate: number;
  /**
   * 上次统计后）发送的帧率，单位为 fps。
   */
  sentFrameRate: number;
  /**
   * 当前编码器的目标编码码率，单位为 Kbps，该码率为 SDK 根据当前网络状况预估的一个值。
   */
  targetBitrate: number;
  /**
   * 当前编码器的目标编码帧率，单位为 fps。
   */
  targetFrameRate: number;
  /**
   * 自上次统计后本地视频质量的自适应情况（基于目标帧率和目标码率）。详见 {@link QualityAdaptIndication}。
   */
  qualityAdaptIndication: QualityAdaptIndication;
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
  /**
   * 最低视频编码码率。单位为 Kbps，默认值为 -1。
   * 该参数强制视频编码器输出高质量图片。如果将参数设为高于默认值，在网络状况不佳情况下可能会导致网络丢包，并影响视频播放的流畅度。因此如非对画质有特殊需求，Agora 建议不要修改该参数的值。
   */
  minBitrate: number; // by default -1, changing this value is NOT recommended
  /**
   * 视频编码的旋转模式，详见 {@link OrientationMode}
   */
  orientationMode: OrientationMode;
  /**
   * 带宽受限时。视频编码的降低偏好。详见 {@link DegradationPreference}。
   */
  degradationPreference: DegradationPreference;
}
/**
 * 带宽受限时的视频编码降级偏好。
 */
export enum DegradationPreference {
  /** 0：（默认）降低编码帧率以保证视频质量。 */
  MAINTAIN_QUALITY = 0,
  /** 1：降低视频质量以保证编码帧率。 */
  MAINTAIN_FRAMERATE = 1,
  /** 2：（预留参数，暂不支持）在编码帧率和视频质量之间保持平衡。 */
  MAINTAIN_BALANCED = 2,
}

/**
 * 视频编码的方向模式。
 */
export enum OrientationMode  {
  /**
   * 0：（默认）该模式下 SDK 输出的视频方向与采集到的视频方向一致。接收端会根据收到的视频旋转信息对视频进行旋转。该模式适用于接收端可以调整视频方向的场景：
   * - 如果采集的视频是横屏模式，则输出的视频也是横屏模式
   * - 如果采集的视频是竖屏模式，则输出的视频也是竖屏模式
   */
  ORIENTATION_MODE_ADAPTIVE = 0, // 0: (Default) Adaptive mode.
  /**
   * 1：该模式下 SDK 固定输出风景（横屏）模式的视频。如果采集到的视频是竖屏模式，则视频编码器会对其进行裁剪。该模式适用于当接收端无法调整视频方向时，如使用 CDN 推流场景下
   */
  ORIENTATION_MODE_FIXED_LANDSCAPE = 1, // 1: Landscape mode
  /**
   * 2：该模式下 SDK 固定输出人像（竖屏）模式的视频，如果采集到的视频是横屏模式，则视频编码器会对其进行裁剪。该模式适用于当接收端无法调整视频方向时，如使用 CDN 推流场景下
   */
  ORIENTATION_MODE_FIXED_PORTRAIT = 2, // 2: Portrait mode.
}
/**
 * 远端视频相关的统计信息。
 */
export interface RemoteVideoStats {
  /**
   * 用户 ID，指定是哪个用户的视频流。
   */
  uid: number;
  /**
   * @deprecated 该参数已废弃。
   *
   * 延迟，单位为毫秒。
   */
  delay: number;
  /**
   * 远端视频流宽度。
   */
  width: number;
  /**
   * 远端视频流高度。
   */
  height: number;
  /**
   * 接收码率，单位为 fps。
   */
  receivedBitrate: number;
  /**
   * 远端视频渲染器的输出帧率，单位为 fps。
   */
  receivedFrameRate: number;
  /**
   * 视频流类型。
   * - 0：大流
   * - 1：小流
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
/**
 * 摄像头采集偏好设置。
 */
export interface CameraCapturerConfiguration {
  /**
   * 摄像头采集输出偏好设置。
   */
  preference: CaptureOutPreference;
}
/**
 * 待共享区域相对于整个屏幕或窗口的位置，如不填，则表示共享这个屏幕或窗口。
 */
export interface Rectangle {
  /**
   * 左上角的横向偏移。
   */
  x: number; // The horizontal offset from the top-left corner.
  /**
   * 左上角的纵向偏移。
   */
  y: number; // The vertical offset from the top-left corner.
  /**
   * 待共享区域的宽。
   */
  width: number; // The width of the region.
  /**
   * 待共享区域的高。
   */
  height: number; // The height of the region.
}

export type ScreenSymbol = MacScreenSymbol | WindowsScreenSymbol;

export type MacScreenSymbol = number;

export type WindowsScreenSymbol = Rectangle;

export type CaptureRect = Rectangle;
/**
 * 屏幕共享的编码参数配置。
 */
export interface CaptureParam {
  /**
   * 屏幕共享区域的宽。
   */
  width: number; // Width (pixels) of the video
  /**
   * 屏幕共享区域的高。
   */
  height: number; // Height (pixels) of the video
  /**
   * 共享视频的帧率，单位为 fps；默认值为 5，建议不要超过 15.
   */
  frameRate: number; // The frame rate (fps) of the shared region. The default value is 5. We do not recommend setting this to a value greater than 15.
  /**
   * 共享视频的码率，单位为 Kbps；默认值为 0，表示 SDK 根据当前共享屏幕的分辨率计算出一个合理的值。
   */
  bitrate: number; //  The bitrate (Kbps) of the shared region. The default value is 0 (the SDK works out a bitrate according to the dimensions of the current screen).
}
/**
 * 屏幕共享的内容类型。
 */
export enum VideoContentHint {
  /**
   * 0：（默认）无指定的内容类型。
   */
  CONTENT_HINT_NONE = 0, // (Default) No content hint
  /**
   * 1：内容类型为动画。当共享的内容是视频、电影或视频游戏时，推荐选择该内容类型。
   */
  CONTENT_HINT_MOTION = 1, // Motion-intensive content. Choose this option if you prefer smoothness or when you are sharing a video clip, movie, or video game.
  /**
   * 2：内容类型为细节。当共享的内容是图片或文字时，推荐选择该内容类型。
   */
  CONTENT_HINT_DETAILS = 2 // Motionless content. Choose this option if you prefer sharpness or when you are sharing a picture, PowerPoint slide, or text.
}
/**
 * 远端视频流传输的统计信息。
 */
export interface RemoteVideoTransportStats {
  /**
   * 用户 ID，指定是哪个用户/主播的视频包。
   */
  uid: number;
  /**
   * 视频包从发送端到接收端的延时（毫秒）。
   */
  delay: number;
  /**
   * 视频包从发送端到接收端的丢包率 (%)。
   */
  lost: number;
  /**
   * 远端视频包的接收码率（Kbps）。
   */
  rxKBitRate: number;
}
/**
 * 远端音频流传输的统计信息。
 */
export interface RemoteAudioTransportStats {
  /**
   * 用户 ID，指定是哪个用户/主播的音频包。
   */
  uid: number;
  /**
   * 音频包从发送端到接收端的延时（毫秒）。
   */
  delay: number;
  /**
   * 音频包从发送端到接收端的丢包率 (%)。
   */
  lost: number;
  /**
   * 远端音频包的接收码率（Kbps）。
   */
  rxKBitRate: number;
}
/**
 * 远端音频统计信息。
 */
export interface RemoteAudioStats {
  /** 用户 ID，指定是哪个用户/主播的音频流。 */
  uid: number;
  /** 远端用户发送的音频流质量，详见 {@link AgoraNetworkQuality}。 */
  quality: number;
  /** 音频发送端到接收端的网络延迟。 */
  networkTransportDelay: number;
  /** 接收端网络抖动的缓冲延迟。 */
  jitterBufferDelay: number;
  /** 该回调周期内的音频丢帧率。 */
  audioLossRate: number;
}
/**
 * 远端视频状态：
 * - 1：远端视频状态正常
 * - 2：远端视频卡顿，可能是由于网络条件导致
 */
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
/**
 * 引起当前网络状态发生改变的原因：
 * - 0：建立网络连接中
 * - 1：成功加入频道
 * - 2：网络连接中断
 * - 3：网络连接被服务器禁止
 * - 4：加入频道失败。SDK 在尝试加入频道 20 分钟后还是没能加入频道，会返回该状态，并停止尝试重连
 * - 5：离开频道
 * - 6：不是有效的 App ID。请更换有效的 App ID 重新加入频道
 * - 7：不是有效的频道名。请更换有效的频道名重新加入频道
 * - 8：生成的 Token 无效
 * - 9：当前使用的 Token 过期，不再有效，需要重新在你的服务端申请生成 Token
 * - 10：此用户被服务器禁止
 * - 11：由于设置了代理服务器，SDK 尝试重连
 * - 12：更新 Token 引起网络连接状态改变
 * - 13：客户端 IP 地址变更，可能是由于网络类型，或网络运营商的 IP 或端口发生改变引起
 */
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
}
