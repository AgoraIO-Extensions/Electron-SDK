
export enum AudioRoute {
RouteDefault = -1,
RouteHeadset = 0,
RouteEarpiece = 1,
RouteHeadsetnomic = 2,
RouteSpeakerphone = 3,
RouteLoudspeaker = 4,
RouteHeadsetbluetooth = 5,
RouteHdmi = 6,
RouteUsb = 7,
}

export enum NlpAggressiveness {
NlpNotSpecified = 0,
NlpMild = 1,
NlpNormal = 2,
NlpAggressive = 3,
NlpSuperAggressive = 4,
NlpExtreme = 5,
}

export enum BytesPerSample {
TwoBytesPerSample = 2,
}

export class AudioParameters {
  sampleRate?: number
  channels?: number
  framesPerBuffer?: number
  static fromJSON (json: any): AudioParameters {
    const obj = new AudioParameters()
    obj.sampleRate = json.sample_rate
    obj.channels = json.channels
    obj.framesPerBuffer = json.frames_per_buffer
    return obj
  }

  toJSON? () {
    return {
      sample_rate: this.sampleRate,
      channels: this.channels,
      frames_per_buffer: this.framesPerBuffer
    }
  }
}

export enum RawAudioFrameOpModeType {
RawAudioFrameOpModeReadOnly = 0,
RawAudioFrameOpModeReadWrite = 2,
}

export enum MediaSourceType {
AudioPlayoutSource = 0,
AudioRecordingSource = 1,
PrimaryCameraSource = 2,
SecondaryCameraSource = 3,
PrimaryScreenSource = 4,
SecondaryScreenSource = 5,
CustomVideoSource = 6,
MediaPlayerSource = 7,
RtcImagePngSource = 8,
RtcImageJpegSource = 9,
RtcImageGifSource = 10,
RemoteVideoSource = 11,
TranscodedVideoSource = 12,
UnknownMediaSource = 100,
}

export class PacketOptions {
  timestamp?: number
  audioLevelIndication?: number
  static fromJSON (json: any): PacketOptions {
    const obj = new PacketOptions()
    obj.timestamp = json.timestamp
    obj.audioLevelIndication = json.audioLevelIndication
    return obj
  }

  toJSON? () {
    return {
      timestamp: this.timestamp,
      audioLevelIndication: this.audioLevelIndication
    }
  }
}

export enum AudioProcessingChannels {
AudioProcessingMono = 1,
AudioProcessingStereo = 2,
}

export class AdvancedAudioOptions {
  audioProcessingChannels?: AudioProcessingChannels
  static fromJSON (json: any): AdvancedAudioOptions {
    const obj = new AdvancedAudioOptions()
    obj.audioProcessingChannels = json.audioProcessingChannels
    return obj
  }

  toJSON? () {
    return {
      audioProcessingChannels: this.audioProcessingChannels
    }
  }
}

export class AudioEncodedFrameInfo {
  sendTs?: number
  codec?: number
  static fromJSON (json: any): AudioEncodedFrameInfo {
    const obj = new AudioEncodedFrameInfo()
    obj.sendTs = json.sendTs
    obj.codec = json.codec
    return obj
  }

  toJSON? () {
    return {
      sendTs: this.sendTs,
      codec: this.codec
    }
  }
}

export class AudioPcmFrame {
  captureTimestamp?: number
  samplesPerChannel?: number
  sampleRateHz?: number
  numChannels?: number
  bytesPerSample?: BytesPerSample
  data?: number[]
  static fromJSON (json: any): AudioPcmFrame {
    const obj = new AudioPcmFrame()
    obj.captureTimestamp = json.capture_timestamp
    obj.samplesPerChannel = json.samples_per_channel_
    obj.sampleRateHz = json.sample_rate_hz_
    obj.numChannels = json.num_channels_
    obj.bytesPerSample = json.bytes_per_sample
    obj.data = json.data_
    return obj
  }

  toJSON? () {
    return {
      capture_timestamp: this.captureTimestamp,
      samples_per_channel_: this.samplesPerChannel,
      sample_rate_hz_: this.sampleRateHz,
      num_channels_: this.numChannels,
      bytes_per_sample: this.bytesPerSample
    }
  }
}

export enum AudioDualMonoMode {
AudioDualMonoStereo = 0,
AudioDualMonoL = 1,
AudioDualMonoR = 2,
AudioDualMonoMix = 3,
}

export enum VideoPixelFormat {
VideoPixelUnknown = 0,
VideoPixelI420 = 1,
VideoPixelBgra = 2,
VideoPixelNv21 = 3,
VideoPixelRgba = 4,
VideoPixelNv12 = 8,
VideoTexture2d = 10,
VideoTextureOes = 11,
VideoPixelI422 = 16,
}

export enum RenderModeType {
RenderModeHidden = 1,
RenderModeFit = 2,
RenderModeAdaptive = 3,
}

export enum EglContextType {
EglContext10 = 0,
EglContext14 = 1,
}

export enum VideoBufferType {
VideoBufferRawData = 1,
VideoBufferArray = 2,
VideoBufferTexture = 3,
}

export class ExternalVideoFrame {
  type?: VideoBufferType
  format?: VideoPixelFormat
  buffer?: Uint8Array
  stride?: number
  height?: number
  cropLeft?: number
  cropTop?: number
  cropRight?: number
  cropBottom?: number
  rotation?: number
  timestamp?: number
  eglContext?: any
  eglType?: EglContextType
  textureId?: number
  matrix?: number[]
  metadataBuffer?: Uint8Array
  metadataSize?: number
  static fromJSON (json: any): ExternalVideoFrame {
    const obj = new ExternalVideoFrame()
    obj.type = json.type
    obj.format = json.format
    obj.buffer = json.buffer
    obj.stride = json.stride
    obj.height = json.height
    obj.cropLeft = json.cropLeft
    obj.cropTop = json.cropTop
    obj.cropRight = json.cropRight
    obj.cropBottom = json.cropBottom
    obj.rotation = json.rotation
    obj.timestamp = json.timestamp
    obj.eglContext = json.eglContext
    obj.eglType = json.eglType
    obj.textureId = json.textureId
    obj.matrix = json.matrix
    obj.metadataBuffer = json.metadata_buffer
    obj.metadataSize = json.metadata_size
    return obj
  }

  toJSON? () {
    return {
      type: this.type,
      format: this.format,
      stride: this.stride,
      height: this.height,
      cropLeft: this.cropLeft,
      cropTop: this.cropTop,
      cropRight: this.cropRight,
      cropBottom: this.cropBottom,
      rotation: this.rotation,
      timestamp: this.timestamp,
      eglType: this.eglType,
      textureId: this.textureId,
      matrix: this.matrix,
      metadata_size: this.metadataSize
    }
  }
}

export class VideoFrame {
  type?: VideoPixelFormat
  width?: number
  height?: number
  yStride?: number
  uStride?: number
  vStride?: number
  yBuffer?: Uint8Array
  uBuffer?: Uint8Array
  vBuffer?: Uint8Array
  rotation?: number
  renderTimeMs?: number
  avsyncType?: number
  metadataBuffer?: Uint8Array
  metadataSize?: number
  sharedContext?: any
  textureId?: number
  matrix?: number[]
  static fromJSON (json: any): VideoFrame {
    const obj = new VideoFrame()
    obj.type = json.type
    obj.width = json.width
    obj.height = json.height
    obj.yStride = json.yStride
    obj.uStride = json.uStride
    obj.vStride = json.vStride
    obj.yBuffer = json.yBuffer
    obj.uBuffer = json.uBuffer
    obj.vBuffer = json.vBuffer
    obj.rotation = json.rotation
    obj.renderTimeMs = json.renderTimeMs
    obj.avsyncType = json.avsync_type
    obj.metadataBuffer = json.metadata_buffer
    obj.metadataSize = json.metadata_size
    obj.sharedContext = json.sharedContext
    obj.textureId = json.textureId
    obj.matrix = json.matrix
    return obj
  }

  toJSON? () {
    return {
      type: this.type,
      width: this.width,
      height: this.height,
      yStride: this.yStride,
      uStride: this.uStride,
      vStride: this.vStride,
      rotation: this.rotation,
      renderTimeMs: this.renderTimeMs,
      avsync_type: this.avsyncType,
      metadata_size: this.metadataSize,
      textureId: this.textureId,
      matrix: this.matrix
    }
  }
}

export enum MediaPlayerSourceType {
MediaPlayerSourceDefault = 0,
MediaPlayerSourceFullFeatured = 1,
MediaPlayerSourceSimple = 2,
}

export enum VideoModulePosition {
PositionPostCapturer = 1 << 0,
PositionPreRenderer = 1 << 1,
PositionPreEncoder = 1 << 2,
PositionPostFilters = 1 << 3,
}

export enum AudioFrameType {
FrameTypePcm16 = 0,
}

export class AudioFrame {
  type?: AudioFrameType
  samplesPerChannel?: number
  bytesPerSample?: BytesPerSample
  channels?: number
  samplesPerSec?: number
  buffer?: Uint8Array
  renderTimeMs?: number
  avsyncType?: number
  static fromJSON (json: any): AudioFrame {
    const obj = new AudioFrame()
    obj.type = json.type
    obj.samplesPerChannel = json.samplesPerChannel
    obj.bytesPerSample = json.bytesPerSample
    obj.channels = json.channels
    obj.samplesPerSec = json.samplesPerSec
    obj.buffer = json.buffer
    obj.renderTimeMs = json.renderTimeMs
    obj.avsyncType = json.avsync_type
    return obj
  }

  toJSON? () {
    return {
      type: this.type,
      samplesPerChannel: this.samplesPerChannel,
      bytesPerSample: this.bytesPerSample,
      channels: this.channels,
      samplesPerSec: this.samplesPerSec,
      renderTimeMs: this.renderTimeMs,
      avsync_type: this.avsyncType
    }
  }
}

export class AudioSpectrumData {
  audioSpectrumData?: number[]
  dataLength?: number
  static fromJSON (json: any): AudioSpectrumData {
    const obj = new AudioSpectrumData()
    obj.audioSpectrumData = json.audioSpectrumData
    obj.dataLength = json.dataLength
    return obj
  }

  toJSON? () {
    return {
      audioSpectrumData: this.audioSpectrumData,
      dataLength: this.dataLength
    }
  }
}

export class UserAudioSpectrumInfo {
  uid?: number
  spectrumData?: AudioSpectrumData
  static fromJSON (json: any): UserAudioSpectrumInfo {
    const obj = new UserAudioSpectrumInfo()
    obj.uid = json.uid
    obj.spectrumData = AudioSpectrumData.fromJSON(json.spectrumData)
    return obj
  }

  toJSON? () {
    return {
      uid: this.uid,
      spectrumData: this.spectrumData
    }
  }
}

export enum VideoFrameProcessMode {
ProcessModeReadOnly = 0,
ProcessModeReadWrite = 1,
}

export enum ContentInspectResult {
ContentInspectNeutral = 1,
ContentInspectSexy = 2,
ContentInspectPorn = 3,
}

export enum ContentInspectDeviceType {
ContentInspectDeviceInvalid = 0,
ContentInspectDeviceAgora = 1,
ContentInspectDeviceHive = 2,
ContentInspectDeviceTupu = 3,
}

export enum ContentInspectType {
ContentInspectInvalide = 0,
ContentInspectModeration = 1,
ContentInspectSupervise = 2,
}

export class ContentInspectModule {
  type?: ContentInspectType
  frequency?: number
  static fromJSON (json: any): ContentInspectModule {
    const obj = new ContentInspectModule()
    obj.type = json.type
    obj.frequency = json.frequency
    return obj
  }

  toJSON? () {
    return {
      type: this.type,
      frequency: this.frequency
    }
  }
}

export class ContentInspectConfig {
  enable?: boolean
  DeviceWork?: boolean
  CloudWork?: boolean
  DeviceworkType?: ContentInspectDeviceType
  extraInfo?: string
  modules?: ContentInspectModule[]
  moduleCount?: number
  static fromJSON (json: any): ContentInspectConfig {
    const obj = new ContentInspectConfig()
    obj.enable = json.enable
    obj.DeviceWork = json.DeviceWork
    obj.CloudWork = json.CloudWork
    obj.DeviceworkType = json.DeviceworkType
    obj.extraInfo = json.extraInfo
    obj.modules = json.modules?.map((it: any) => ContentInspectModule.fromJSON(it))
    obj.moduleCount = json.moduleCount
    return obj
  }

  toJSON? () {
    return {
      enable: this.enable,
      DeviceWork: this.DeviceWork,
      CloudWork: this.CloudWork,
      DeviceworkType: this.DeviceworkType,
      extraInfo: this.extraInfo,
      modules: this.modules,
      moduleCount: this.moduleCount
    }
  }
}

export class SnapShotConfig {
  channel?: string
  uid?: number
  filePath?: string
  static fromJSON (json: any): SnapShotConfig {
    const obj = new SnapShotConfig()
    obj.channel = json.channel
    obj.uid = json.uid
    obj.filePath = json.filePath
    return obj
  }

  toJSON? () {
    return {
      channel: this.channel,
      uid: this.uid,
      filePath: this.filePath
    }
  }
}

export enum ExternalVideoSourceType {
VideoFrame = 0,
EncodedVideoFrame = 1,
}
