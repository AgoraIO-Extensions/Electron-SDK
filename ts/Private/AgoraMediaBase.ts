
/*
 * TODO(doc)
 */
export enum AudioRoute {
/*
 * TODO(doc)
 */
RouteDefault = -1,
/*
 * TODO(doc)
 */
RouteHeadset = 0,
/*
 * TODO(doc)
 */
RouteEarpiece = 1,
/*
 * TODO(doc)
 */
RouteHeadsetnomic = 2,
/*
 * TODO(doc)
 */
RouteSpeakerphone = 3,
/*
 * TODO(doc)
 */
RouteLoudspeaker = 4,
/*
 * TODO(doc)
 */
RouteHeadsetbluetooth = 5,
/*
 * TODO(doc)
 */
RouteHdmi = 6,
/*
 * TODO(doc)
 */
RouteUsb = 7,
}

/*
 * TODO(doc)
 */
export enum NlpAggressiveness {
/*
 * TODO(doc)
 */
NlpNotSpecified = 0,
/*
 * TODO(doc)
 */
NlpMild = 1,
/*
 * TODO(doc)
 */
NlpNormal = 2,
/*
 * TODO(doc)
 */
NlpAggressive = 3,
/*
 * TODO(doc)
 */
NlpSuperAggressive = 4,
/*
 * TODO(doc)
 */
NlpExtreme = 5,
}

/*
 * TODO(doc)
 */
export enum BytesPerSample {
/*
 * TODO(doc)
 */
TwoBytesPerSample = 2,
}

/*
 * TODO(doc)
 */
export class AudioParameters {
/*
 * TODO(doc)
 */
  sample_rate?: number
  /*
   * TODO(doc)
   */
  channels?: number
  /*
   * TODO(doc)
   */
  frames_per_buffer?: number
}

/*
 * 音频数据的使用模式。
 */
export enum RawAudioFrameOpModeType {
/*
 * 0: 只读模式，用户仅获取 SDK 返回的原始数据，不作任何修改。例如: 若用户通过 Agora SDK 采集数据，自己进行旁路推流，则可以选择该模式。
 */
RawAudioFrameOpModeReadOnly = 0,
/*
 * 2: 读写模式, 用户修改 SDK 返回的原始视频，并返回给 SDK 进行编码传输。例如: 若用户自己有音效处理模块，且想要根据实际需要对数据进行前处理(例如变声)，则可以选择该模式。
 */
RawAudioFrameOpModeReadWrite = 2,
}

/*
 * 媒体源类型。
 */
export enum MediaSourceType {
/*
 * 0: 音频播放设备。
 */
AudioPlayoutSource = 0,
/*
 * 1: 音频采集设备。
 */
AudioRecordingSource = 1,
/*
 * TODO(doc)
 */
PrimaryCameraSource = 2,
/*
 * TODO(doc)
 */
SecondaryCameraSource = 3,
/*
 * TODO(doc)
 */
PrimaryScreenSource = 4,
/*
 * TODO(doc)
 */
SecondaryScreenSource = 5,
/*
 * TODO(doc)
 */
CustomVideoSource = 6,
/*
 * TODO(doc)
 */
MediaPlayerSource = 7,
/*
 * TODO(doc)
 */
RtcImagePngSource = 8,
/*
 * TODO(doc)
 */
RtcImageJpegSource = 9,
/*
 * TODO(doc)
 */
RtcImageGifSource = 10,
/*
 * TODO(doc)
 */
RemoteVideoSource = 11,
/*
 * TODO(doc)
 */
TranscodedVideoSource = 12,
/*
 * TODO(doc)
 */
UnknownMediaSource = 100,
}

/*
 * TODO(doc)
 */
export class PacketOptions {
/*
 * TODO(doc)
 */
  timestamp?: number
  /*
   * TODO(doc)
   */
  audioLevelIndication?: number
}

/*
 * 音频前处理的声道数。
 * 在演唱会等需要增强真实感的场景中，本地用户可能需要采集立体声并发送立体声信号给远端用户。
 * 例如，在演唱会的舞台上，主唱、吉他手、鼓手分别站在不同的位置，现场设备采集到了三者的立体声，并把立体声信号发送给远端用户，远端用户可以像亲临舞台一样听到来自不同方向的歌声、吉他声和鼓声。
 * 通过该类，你可以设置双声道处理，实现立体声。Agora 推荐按如下步骤设置： 
 * 前处理：调用 setAdvancedAudioOptions 并在 AdvancedAudioOptions 中设置 audioProcessingChannels 为 AudioProcessingStereo (2)。
 * 后处理：调用 setAudioProfile 并将 profile 设为 AudioProfileMusicStandardStereo (3) 或 AudioProfileMusicHighQualityStereo (5)。 
 * 立体声设置仅在媒体音量下生效。
 */
export enum AudioProcessingChannels {
/*
 * 1: （默认）单声道。
 */
AudioProcessingMono = 1,
/*
 * 2: 双声道。
 */
AudioProcessingStereo = 2,
}

/*
 *  音频的高级选项。 
 */
export class AdvancedAudioOptions {
/*
 * 音频前处理的声道数。详见 
 * AudioProcessingChannels 
 * 。
 */
  audioProcessingChannels?: AudioProcessingChannels
}

/*
 * TODO(doc)
 */
export class AudioEncodedFrameInfo {
/*
 * TODO(doc)
 */
  sendTs?: number
  /*
   * TODO(doc)
   */
  codec?: number
}

/*
 * TODO(doc)
 */
export class AudioPcmFrame {
/*
 * TODO(doc)
 */
  capture_timestamp?: number
  /*
   * TODO(doc)
   */
  samples_per_channel_?: number
  /*
   * TODO(doc)
   */
  sample_rate_hz_?: number
  /*
   * TODO(doc)
   */
  num_channels_?: number
  /*
   * TODO(doc)
   */
  bytes_per_sample?: BytesPerSample
  /*
   * TODO(doc)
   */
  data_?: number[]
}

/*
 * 声道模式。
 */
export enum AudioDualMonoMode {
/*
 * 0: 原始模式。
 */
AudioDualMonoStereo = 0,
/*
 * 1: 左声道模式。该模式用左声道的音频替换右声道的音频，即用户只能听到左声道的音频。
 */
AudioDualMonoL = 1,
/*
 * 2: 右声道模式。该模式用右声道的音频替换左声道的音频，即用户只能听到右声道的音频。
 */
AudioDualMonoR = 2,
/*
 * 3: 混合模式。该模式将左右声道的数据叠加，即用户能同时听到左声道和右声道的音频。
 */
AudioDualMonoMix = 3,
}

/*
 * 视频像素格式。
 */
export enum VideoPixelFormat {
/*
 * TODO(doc)
 */
VideoPixelUnknown = 0,
/*
 * 1: I420 格式。
 */
VideoPixelI420 = 1,
/*
 * 2: BGRA 格式。
 */
VideoPixelBgra = 2,
/*
 * TODO(doc)
 */
VideoPixelNv21 = 3,
/*
 * TODO(doc)
 */
VideoPixelRgba = 4,
/*
 * 8: NV12 格式。
 */
VideoPixelNv12 = 8,
/*
 * TODO(doc)
 */
VideoTexture2d = 10,
/*
 * TODO(doc)
 */
VideoTextureOes = 11,
/*
 * TODO(doc)
 */
VideoPixelI422 = 16,
}

/*
 * 视频显示模式。
 */
export enum RenderModeType {
/*
 * 1: 视频尺寸等比缩放。优先保证视窗被填满。因视频尺寸与显示视窗尺寸不一致而多出的视频将被截掉。
 */
RenderModeHidden = 1,
/*
 * 2: 视频尺寸等比缩放。优先保证视频内容全部显示。因视频尺寸与显示视窗尺寸不一致造成的视窗未被填满的区域填充黑色。
 */
RenderModeFit = 2,
/*
 * TODO(doc)
 */
RenderModeAdaptive = 3,
}

/*
 * TODO(doc)
 */
export enum EglContextType {
/*
 * TODO(doc)
 */
EglContext10 = 0,
/*
 * TODO(doc)
 */
EglContext14 = 1,
}

/*
 * 视频 buffer 类型。
 */
export enum VideoBufferType {
/*
 * 1: 类型为原始数据。
 */
VideoBufferRawData = 1,
/*
 * TODO(doc)
 */
VideoBufferArray = 2,
/*
 * TODO(doc)
 */
VideoBufferTexture = 3,
}

/*
 * TODO(doc)
 */
export enum MediaPlayerSourceType {
/*
 * TODO(doc)
 */
MediaPlayerSourceDefault = 0,
/*
 * TODO(doc)
 */
MediaPlayerSourceFullFeatured = 1,
/*
 * TODO(doc)
 */
MediaPlayerSourceSimple = 2,
}

/*
 * TODO(doc)
 */
export enum VideoModulePosition {
/*
 * TODO(doc)
 */
PositionPostCapturer = 1 << 0,
/*
 * TODO(doc)
 */
PositionPreRenderer = 1 << 1,
/*
 * TODO(doc)
 */
PositionPreEncoder = 1 << 2,
/*
 * TODO(doc)
 */
PositionPostFilters = 1 << 3,
}

/*
 * 音频帧类型。
 */
export enum AudioFrameType {
/*
 * 0: PCM 16
 */
FrameTypePcm16 = 0,
}

/*
 * 音频频谱数据。
 */
export class AudioSpectrumData {
/*
 * 音频频谱数据。Agora 将声音频率分为 160 个频域，通过该参数报告各频域的能量值，每个能量值的取值范围为 [0,1]。
 */
  audioSpectrumData?: number[]
  /*
   * 音频频谱数据长度，单位为 byte。
   */
  dataLength?: number
}

/*
 * 远端用户的音频频谱信息。
 */
export class UserAudioSpectrumInfo {
/*
 * 远端用户 ID。
 */
  uid?: number
  /*
   * 远端用户的音频频谱数据。详见 AudioSpectrumData 。
   */
  spectrumData?: AudioSpectrumData
}

/*
 * 视频帧处理模式。
 */
export enum VideoFrameProcessMode {
/*
 * 只读模式。
 * 只读模式下，你不修改视频帧，视频观测器相当于渲染器。
 */
ProcessModeReadOnly = 0,
/*
 * 读写模式。
 * 读写模式下，你会修改视频帧，视频观测器相当于视频 filter。
 */
ProcessModeReadWrite = 1,
}

/*
 * 鉴黄结果。
 */
export enum ContentInspectResult {
/*
 * 1：正常图片。
 */
ContentInspectNeutral = 1,
/*
 * 2：性感图片。
 */
ContentInspectSexy = 2,
/*
 * 3：色情图片。
 */
ContentInspectPorn = 3,
}

/*
 * 在设备端进行内容审核的类型。
 */
export enum ContentInspectDeviceType {
/*
 * TODO(doc)
 */
ContentInspectDeviceInvalid = 0,
/*
 * TODO(doc)
 */
ContentInspectDeviceAgora = 1,
/*
 * TODO(doc)
 */
ContentInspectDeviceHive = 2,
/*
 * TODO(doc)
 */
ContentInspectDeviceTupu = 3,
}

/*
 * 内容审核类型。
 */
export enum ContentInspectType {
/*
 * TODO(doc)
 */
ContentInspectInvalide = 0,
/*
 * TODO(doc)
 */
ContentInspectModeration = 1,
/*
 * TODO(doc)
 */
ContentInspectSupervise = 2,
}

/*
 *  ContentInspectModule 结构体，用于配置内容审核模块的类型和频率。 
 */
export class ContentInspectModule {
/*
 * 
 */
  type?: ContentInspectType
  /*
   * TODO(doc)
   */
  frequency?: number
}

/*
 * TODO(doc)
 */
export class ContentInspectConfig {
/*
 * TODO(doc)
 */
  enable?: boolean
  /*
   * TODO(doc)
   */
  DeviceWork?: boolean
  /*
   * TODO(doc)
   */
  CloudWork?: boolean
  /*
   * TODO(doc)
   */
  DeviceworkType?: ContentInspectDeviceType
  /*
   * TODO(doc)
   */
  extraInfo?: string
  /*
   * TODO(doc)
   */
  modules?: ContentInspectModule[]
  /*
   * TODO(doc)
   */
  moduleCount?: number
}

/*
 * 视频截图设置。
 */
export class SnapShotConfig {
/*
 * 频道名。
 */
  channel?: string
  /*
   * 用户 ID。如果要对本地用户的视频截图，uid 设为 0。
   */
  uid?: number
  /*
   * 截图的本地保存路径，需精确到文件名及格式， 例如： 
   * Windows: C:\Users\<user_name>\AppData\Local\Agora\<process_name>\example.jpg
   * iOS: /App Sandbox/Library/Caches/example.jpg
   * macOS: ～/Library/Logs/example.jpg
   * Android: /storage/emulated/0/Android/data/<package name>/files/example.jpg
   * 请确保目录存在且可写。
   */
  filePath?: string
}

/*
 * 外部视频帧编码类型。
 */
export enum ExternalVideoSourceType {
/*
 * 0：未编码视频帧。
 */
VideoFrame = 0,
/*
 * 1：已编码视频帧。
 */
EncodedVideoFrame = 1,
}
