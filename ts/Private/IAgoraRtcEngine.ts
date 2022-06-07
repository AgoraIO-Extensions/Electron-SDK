import { QualityAdaptIndication, VideoCodecType, VideoStreamType, AudioSampleRateType, VideoFormat, Rectangle, ScreenCaptureParameters, ClientRoleType, AudienceLatencyLevelType, ChannelProfileType, LastmileProbeResult, AudioVolumeInfo, RtcStats, UplinkNetworkInfo, DownlinkNetworkInfo, VideoSourceType, LocalVideoStreamState, LocalVideoStreamError, RemoteVideoState, RemoteVideoStateReason, UserOfflineReasonType, LocalAudioStats, RemoteAudioStats, LocalAudioStreamState, LocalAudioStreamError, RemoteAudioState, RemoteAudioStateReason, ClientRoleChangeFailedReason, RtmpStreamPublishState, RtmpStreamPublishErrorType, RtmpStreamingEvent, ChannelMediaRelayState, ChannelMediaRelayError, ConnectionStateType, ConnectionChangedReasonType, NetworkType, EncryptionErrorType, PermissionType, UserInfo, UploadErrorReason, StreamSubscribeState, StreamPublishState, AudioScenarioType, ThreadPriorityType, InterfaceIdType, ClientRoleOptions, LastmileProbeConfig, VideoEncoderConfiguration, BeautyOptions, VirtualBackgroundSource, VideoCanvas, AudioProfileType, AudioRecordingQualityType, AudioRecordingConfiguration, SpatialAudioParams, VoiceBeautifierPreset, AudioEffectPreset, VoiceConversionPreset, VideoMirrorModeType, SimulcastStreamConfig, AudioSessionOperationRestriction, VideoContentHint, LiveTranscoding, LocalTranscoderConfiguration, VideoOrientation, EncryptionConfig, DataStreamConfig, RtcImage, WatermarkOptions, ChannelMediaRelayConfiguration, FishCorrectionParams } from './AgoraBase'
import { RenderModeType, NlpAggressiveness, ContentInspectResult, MediaSourceType, RawAudioFrameOpModeType, ExternalVideoFrame, SnapShotConfig, ContentInspectConfig, AdvancedAudioOptions } from './AgoraMediaBase'
import { RhythmPlayerStateType, RhythmPlayerErrorType, AgoraRhythmPlayerConfig } from './IAgoraRhythmPlayer'
import { LogConfig, LogLevel } from './IAgoraLog'
import { IMediaPlayer } from './IAgoraMediaPlayer'
import { IAudioDeviceManager } from './IAudioDeviceManager'

export enum MediaDeviceType {
UnknownAudioDevice = -1,
AudioPlayoutDevice = 0,
AudioRecordingDevice = 1,
VideoRenderDevice = 2,
VideoCaptureDevice = 3,
AudioApplicationPlayoutDevice = 4,
}

export enum AudioMixingStateType {
AudioMixingStatePlaying = 710,
AudioMixingStatePaused = 711,
AudioMixingStateStopped = 713,
AudioMixingStateFailed = 714,
AudioMixingStateCompleted = 715,
AudioMixingStateAllLoopsCompleted = 716,
}

export enum AudioMixingErrorType {
AudioMixingErrorCanNotOpen = 701,
AudioMixingErrorTooFrequentCall = 702,
AudioMixingErrorInterruptedEof = 703,
AudioMixingErrorOk = 0,
}

export enum InjectStreamStatus {
InjectStreamStatusStartSuccess = 0,
InjectStreamStatusStartAlreadyExists = 1,
InjectStreamStatusStartUnauthorized = 2,
InjectStreamStatusStartTimedout = 3,
InjectStreamStatusStartFailed = 4,
InjectStreamStatusStopSuccess = 5,
InjectStreamStatusStopNotFound = 6,
InjectStreamStatusStopUnauthorized = 7,
InjectStreamStatusStopTimedout = 8,
InjectStreamStatusStopFailed = 9,
InjectStreamStatusBroken = 10,
}

export enum AudioEqualizationBandFrequency {
AudioEqualizationBand31 = 0,
AudioEqualizationBand62 = 1,
AudioEqualizationBand125 = 2,
AudioEqualizationBand250 = 3,
AudioEqualizationBand500 = 4,
AudioEqualizationBand1k = 5,
AudioEqualizationBand2k = 6,
AudioEqualizationBand4k = 7,
AudioEqualizationBand8k = 8,
AudioEqualizationBand16k = 9,
}

export enum AudioReverbType {
AudioReverbDryLevel = 0,
AudioReverbWetLevel = 1,
AudioReverbRoomSize = 2,
AudioReverbWetDelay = 3,
AudioReverbStrength = 4,
}

export enum StreamFallbackOptions {
StreamFallbackOptionDisabled = 0,
StreamFallbackOptionVideoStreamLow = 1,
StreamFallbackOptionAudioOnly = 2,
}

export enum PriorityType {
PriorityHigh = 50,
PriorityNormal = 100,
}

export class LocalVideoStats {
  uid?: number
  sentBitrate?: number
  sentFrameRate?: number
  captureFrameRate?: number
  captureFrameWidth?: number
  captureFrameHeight?: number
  regulatedCaptureFrameRate?: number
  regulatedCaptureFrameWidth?: number
  regulatedCaptureFrameHeight?: number
  encoderOutputFrameRate?: number
  encodedFrameWidth?: number
  encodedFrameHeight?: number
  rendererOutputFrameRate?: number
  targetBitrate?: number
  targetFrameRate?: number
  qualityAdaptIndication?: QualityAdaptIndication
  encodedBitrate?: number
  encodedFrameCount?: number
  codecType?: VideoCodecType
  txPacketLossRate?: number
  static fromJSON (json: any): LocalVideoStats {
    const obj = new LocalVideoStats()
    obj.uid = json.uid
    obj.sentBitrate = json.sentBitrate
    obj.sentFrameRate = json.sentFrameRate
    obj.captureFrameRate = json.captureFrameRate
    obj.captureFrameWidth = json.captureFrameWidth
    obj.captureFrameHeight = json.captureFrameHeight
    obj.regulatedCaptureFrameRate = json.regulatedCaptureFrameRate
    obj.regulatedCaptureFrameWidth = json.regulatedCaptureFrameWidth
    obj.regulatedCaptureFrameHeight = json.regulatedCaptureFrameHeight
    obj.encoderOutputFrameRate = json.encoderOutputFrameRate
    obj.encodedFrameWidth = json.encodedFrameWidth
    obj.encodedFrameHeight = json.encodedFrameHeight
    obj.rendererOutputFrameRate = json.rendererOutputFrameRate
    obj.targetBitrate = json.targetBitrate
    obj.targetFrameRate = json.targetFrameRate
    obj.qualityAdaptIndication = json.qualityAdaptIndication
    obj.encodedBitrate = json.encodedBitrate
    obj.encodedFrameCount = json.encodedFrameCount
    obj.codecType = json.codecType
    obj.txPacketLossRate = json.txPacketLossRate
    return obj
  }

  toJSON? () {
    return {
      uid: this.uid,
      sentBitrate: this.sentBitrate,
      sentFrameRate: this.sentFrameRate,
      captureFrameRate: this.captureFrameRate,
      captureFrameWidth: this.captureFrameWidth,
      captureFrameHeight: this.captureFrameHeight,
      regulatedCaptureFrameRate: this.regulatedCaptureFrameRate,
      regulatedCaptureFrameWidth: this.regulatedCaptureFrameWidth,
      regulatedCaptureFrameHeight: this.regulatedCaptureFrameHeight,
      encoderOutputFrameRate: this.encoderOutputFrameRate,
      encodedFrameWidth: this.encodedFrameWidth,
      encodedFrameHeight: this.encodedFrameHeight,
      rendererOutputFrameRate: this.rendererOutputFrameRate,
      targetBitrate: this.targetBitrate,
      targetFrameRate: this.targetFrameRate,
      qualityAdaptIndication: this.qualityAdaptIndication,
      encodedBitrate: this.encodedBitrate,
      encodedFrameCount: this.encodedFrameCount,
      codecType: this.codecType,
      txPacketLossRate: this.txPacketLossRate
    }
  }
}

export class RemoteVideoStats {
  uid?: number
  delay?: number
  width?: number
  height?: number
  receivedBitrate?: number
  decoderOutputFrameRate?: number
  rendererOutputFrameRate?: number
  frameLossRate?: number
  packetLossRate?: number
  rxStreamType?: VideoStreamType
  totalFrozenTime?: number
  frozenRate?: number
  avSyncTimeMs?: number
  totalActiveTime?: number
  publishDuration?: number
  superResolutionType?: number
  static fromJSON (json: any): RemoteVideoStats {
    const obj = new RemoteVideoStats()
    obj.uid = json.uid
    obj.delay = json.delay
    obj.width = json.width
    obj.height = json.height
    obj.receivedBitrate = json.receivedBitrate
    obj.decoderOutputFrameRate = json.decoderOutputFrameRate
    obj.rendererOutputFrameRate = json.rendererOutputFrameRate
    obj.frameLossRate = json.frameLossRate
    obj.packetLossRate = json.packetLossRate
    obj.rxStreamType = json.rxStreamType
    obj.totalFrozenTime = json.totalFrozenTime
    obj.frozenRate = json.frozenRate
    obj.avSyncTimeMs = json.avSyncTimeMs
    obj.totalActiveTime = json.totalActiveTime
    obj.publishDuration = json.publishDuration
    obj.superResolutionType = json.superResolutionType
    return obj
  }

  toJSON? () {
    return {
      uid: this.uid,
      delay: this.delay,
      width: this.width,
      height: this.height,
      receivedBitrate: this.receivedBitrate,
      decoderOutputFrameRate: this.decoderOutputFrameRate,
      rendererOutputFrameRate: this.rendererOutputFrameRate,
      frameLossRate: this.frameLossRate,
      packetLossRate: this.packetLossRate,
      rxStreamType: this.rxStreamType,
      totalFrozenTime: this.totalFrozenTime,
      frozenRate: this.frozenRate,
      avSyncTimeMs: this.avSyncTimeMs,
      totalActiveTime: this.totalActiveTime,
      publishDuration: this.publishDuration,
      superResolutionType: this.superResolutionType
    }
  }
}

export class Region {
  uid?: number
  x?: number
  y?: number
  width?: number
  height?: number
  zOrder?: number
  alpha?: number
  renderMode?: RenderModeType
  static fromJSON (json: any): Region {
    const obj = new Region()
    obj.uid = json.uid
    obj.x = json.x
    obj.y = json.y
    obj.width = json.width
    obj.height = json.height
    obj.zOrder = json.zOrder
    obj.alpha = json.alpha
    obj.renderMode = json.renderMode
    return obj
  }

  toJSON? () {
    return {
      uid: this.uid,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      zOrder: this.zOrder,
      alpha: this.alpha,
      renderMode: this.renderMode
    }
  }
}

export class VideoCompositingLayout {
  canvasWidth?: number
  canvasHeight?: number
  backgroundColor?: string
  regions?: Region[]
  regionCount?: number
  appData?: Uint8Array
  appDataLength?: number
  static fromJSON (json: any): VideoCompositingLayout {
    const obj = new VideoCompositingLayout()
    obj.canvasWidth = json.canvasWidth
    obj.canvasHeight = json.canvasHeight
    obj.backgroundColor = json.backgroundColor
    obj.regions = json.regions?.map((it: any) => Region.fromJSON(it))
    obj.regionCount = json.regionCount
    obj.appData = json.appData
    obj.appDataLength = json.appDataLength
    return obj
  }

  toJSON? () {
    return {
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      backgroundColor: this.backgroundColor,
      regions: this.regions,
      regionCount: this.regionCount,
      appDataLength: this.appDataLength
    }
  }
}

export class InjectStreamConfig {
  width?: number
  height?: number
  videoGop?: number
  videoFramerate?: number
  videoBitrate?: number
  audioSampleRate?: AudioSampleRateType
  audioBitrate?: number
  audioChannels?: number
  static fromJSON (json: any): InjectStreamConfig {
    const obj = new InjectStreamConfig()
    obj.width = json.width
    obj.height = json.height
    obj.videoGop = json.videoGop
    obj.videoFramerate = json.videoFramerate
    obj.videoBitrate = json.videoBitrate
    obj.audioSampleRate = json.audioSampleRate
    obj.audioBitrate = json.audioBitrate
    obj.audioChannels = json.audioChannels
    return obj
  }

  toJSON? () {
    return {
      width: this.width,
      height: this.height,
      videoGop: this.videoGop,
      videoFramerate: this.videoFramerate,
      videoBitrate: this.videoBitrate,
      audioSampleRate: this.audioSampleRate,
      audioBitrate: this.audioBitrate,
      audioChannels: this.audioChannels
    }
  }
}

export enum RtmpStreamLifeCycleType {
RtmpStreamLifeCycleBind2channel = 1,
RtmpStreamLifeCycleBind2owner = 2,
}

export class PublisherConfiguration {
  width?: number
  height?: number
  framerate?: number
  bitrate?: number
  defaultLayout?: number
  lifecycle?: number
  owner?: boolean
  injectStreamWidth?: number
  injectStreamHeight?: number
  injectStreamUrl?: string
  publishUrl?: string
  rawStreamUrl?: string
  extraInfo?: string
  static fromJSON (json: any): PublisherConfiguration {
    const obj = new PublisherConfiguration()
    obj.width = json.width
    obj.height = json.height
    obj.framerate = json.framerate
    obj.bitrate = json.bitrate
    obj.defaultLayout = json.defaultLayout
    obj.lifecycle = json.lifecycle
    obj.owner = json.owner
    obj.injectStreamWidth = json.injectStreamWidth
    obj.injectStreamHeight = json.injectStreamHeight
    obj.injectStreamUrl = json.injectStreamUrl
    obj.publishUrl = json.publishUrl
    obj.rawStreamUrl = json.rawStreamUrl
    obj.extraInfo = json.extraInfo
    return obj
  }

  toJSON? () {
    return {
      width: this.width,
      height: this.height,
      framerate: this.framerate,
      bitrate: this.bitrate,
      defaultLayout: this.defaultLayout,
      lifecycle: this.lifecycle,
      owner: this.owner,
      injectStreamWidth: this.injectStreamWidth,
      injectStreamHeight: this.injectStreamHeight,
      injectStreamUrl: this.injectStreamUrl,
      publishUrl: this.publishUrl,
      rawStreamUrl: this.rawStreamUrl,
      extraInfo: this.extraInfo
    }
  }
}

export class AudioTrackConfig {
  enableLocalPlayback?: boolean
  static fromJSON (json: any): AudioTrackConfig {
    const obj = new AudioTrackConfig()
    obj.enableLocalPlayback = json.enableLocalPlayback
    return obj
  }

  toJSON? () {
    return {
      enableLocalPlayback: this.enableLocalPlayback
    }
  }
}

export enum CameraDirection {
CameraRear = 0,
CameraFront = 1,
}

export enum CloudProxyType {
NoneProxy = 0,
UdpProxy = 1,
TcpProxy = 2,
}

export class CameraCapturerConfiguration {
  cameraDirection?: CameraDirection
  deviceId?: string
  format?: VideoFormat
  static fromJSON (json: any): CameraCapturerConfiguration {
    const obj = new CameraCapturerConfiguration()
    obj.cameraDirection = json.cameraDirection
    obj.deviceId = json.deviceId
    obj.format = VideoFormat.fromJSON(json.format)
    return obj
  }

  toJSON? () {
    return {
      cameraDirection: this.cameraDirection,
      deviceId: this.deviceId,
      format: this.format
    }
  }
}

export class ScreenCaptureConfiguration {
  isCaptureWindow?: boolean
  displayId?: number
  screenRect?: Rectangle
  windowId?: any
  params?: ScreenCaptureParameters
  regionRect?: Rectangle
  static fromJSON (json: any): ScreenCaptureConfiguration {
    const obj = new ScreenCaptureConfiguration()
    obj.isCaptureWindow = json.isCaptureWindow
    obj.displayId = json.displayId
    obj.screenRect = Rectangle.fromJSON(json.screenRect)
    obj.windowId = json.windowId
    obj.params = ScreenCaptureParameters.fromJSON(json.params)
    obj.regionRect = Rectangle.fromJSON(json.regionRect)
    return obj
  }

  toJSON? () {
    return {
      isCaptureWindow: this.isCaptureWindow,
      displayId: this.displayId,
      screenRect: this.screenRect,
      windowId: this.windowId,
      params: this.params,
      regionRect: this.regionRect
    }
  }
}

export class AudioOptionsExternal {
  enableAecExternalCustom?: boolean
  enableAgcExternalCustom?: boolean
  enableAnsExternalCustom?: boolean
  aecAggressivenessExternalCustom?: NlpAggressiveness
  enableAecExternalLoopback?: boolean
  static fromJSON (json: any): AudioOptionsExternal {
    const obj = new AudioOptionsExternal()
    obj.enableAecExternalCustom = json.enable_aec_external_custom_
    obj.enableAgcExternalCustom = json.enable_agc_external_custom_
    obj.enableAnsExternalCustom = json.enable_ans_external_custom_
    obj.aecAggressivenessExternalCustom = json.aec_aggressiveness_external_custom_
    obj.enableAecExternalLoopback = json.enable_aec_external_loopback_
    return obj
  }

  toJSON? () {
    return {
      enable_aec_external_custom_: this.enableAecExternalCustom,
      enable_agc_external_custom_: this.enableAgcExternalCustom,
      enable_ans_external_custom_: this.enableAnsExternalCustom,
      aec_aggressiveness_external_custom_: this.aecAggressivenessExternalCustom,
      enable_aec_external_loopback_: this.enableAecExternalLoopback
    }
  }
}

export class SIZE {
  width?: number
  height?: number
  static fromJSON (json: any): SIZE {
    const obj = new SIZE()
    obj.width = json.width
    obj.height = json.height
    return obj
  }

  toJSON? () {
    return {
      width: this.width,
      height: this.height
    }
  }
}

export class ThumbImageBuffer {
  buffer?: Uint8Array
  length?: number
  width?: number
  height?: number
  static fromJSON (json: any): ThumbImageBuffer {
    const obj = new ThumbImageBuffer()
    obj.buffer = json.buffer
    obj.length = json.length
    obj.width = json.width
    obj.height = json.height
    return obj
  }

  toJSON? () {
    return {
      length: this.length,
      width: this.width,
      height: this.height
    }
  }
}

export enum ScreenCaptureSourceType {
ScreencapturesourcetypeUnknown = -1,
ScreencapturesourcetypeWindow = 0,
ScreencapturesourcetypeScreen = 1,
ScreencapturesourcetypeCustom = 2,
}

export class ScreenCaptureSourceInfo {
  type?: ScreenCaptureSourceType
  sourceId?: any
  sourceName?: string
  thumbImage?: ThumbImageBuffer
  iconImage?: ThumbImageBuffer
  processPath?: string
  sourceTitle?: string
  primaryMonitor?: boolean
  isOccluded?: boolean
  static fromJSON (json: any): ScreenCaptureSourceInfo {
    const obj = new ScreenCaptureSourceInfo()
    obj.type = json.type
    obj.sourceId = json.sourceId
    obj.sourceName = json.sourceName
    obj.thumbImage = ThumbImageBuffer.fromJSON(json.thumbImage)
    obj.iconImage = ThumbImageBuffer.fromJSON(json.iconImage)
    obj.processPath = json.processPath
    obj.sourceTitle = json.sourceTitle
    obj.primaryMonitor = json.primaryMonitor
    obj.isOccluded = json.isOccluded
    return obj
  }

  toJSON? () {
    return {
      type: this.type,
      sourceId: this.sourceId,
      sourceName: this.sourceName,
      thumbImage: this.thumbImage,
      iconImage: this.iconImage,
      processPath: this.processPath,
      sourceTitle: this.sourceTitle,
      primaryMonitor: this.primaryMonitor,
      isOccluded: this.isOccluded
    }
  }
}

export class ChannelMediaOptions {
  publishCameraTrack?: boolean
  publishSecondaryCameraTrack?: boolean
  publishAudioTrack?: boolean
  publishScreenTrack?: boolean
  publishSecondaryScreenTrack?: boolean
  publishCustomAudioTrack?: boolean
  publishCustomAudioSourceId?: number
  publishCustomAudioTrackEnableAec?: boolean
  publishDirectCustomAudioTrack?: boolean
  publishCustomAudioTrackAec?: boolean
  publishCustomVideoTrack?: boolean
  publishEncodedVideoTrack?: boolean
  publishMediaPlayerAudioTrack?: boolean
  publishMediaPlayerVideoTrack?: boolean
  publishTrancodedVideoTrack?: boolean
  autoSubscribeAudio?: boolean
  autoSubscribeVideo?: boolean
  startPreview?: boolean
  enableAudioRecordingOrPlayout?: boolean
  publishMediaPlayerId?: number
  clientRoleType?: ClientRoleType
  audienceLatencyLevel?: AudienceLatencyLevelType
  defaultVideoStreamType?: VideoStreamType
  channelProfile?: ChannelProfileType
  audioDelayMs?: number
  mediaPlayerAudioDelayMs?: number
  token?: string
  enableBuiltInMediaEncryption?: boolean
  publishRhythmPlayerTrack?: boolean
  audioOptionsExternal?: AudioOptionsExternal
  static fromJSON (json: any): ChannelMediaOptions {
    const obj = new ChannelMediaOptions()
    obj.publishCameraTrack = json.publishCameraTrack
    obj.publishSecondaryCameraTrack = json.publishSecondaryCameraTrack
    obj.publishAudioTrack = json.publishAudioTrack
    obj.publishScreenTrack = json.publishScreenTrack
    obj.publishSecondaryScreenTrack = json.publishSecondaryScreenTrack
    obj.publishCustomAudioTrack = json.publishCustomAudioTrack
    obj.publishCustomAudioSourceId = json.publishCustomAudioSourceId
    obj.publishCustomAudioTrackEnableAec = json.publishCustomAudioTrackEnableAec
    obj.publishDirectCustomAudioTrack = json.publishDirectCustomAudioTrack
    obj.publishCustomAudioTrackAec = json.publishCustomAudioTrackAec
    obj.publishCustomVideoTrack = json.publishCustomVideoTrack
    obj.publishEncodedVideoTrack = json.publishEncodedVideoTrack
    obj.publishMediaPlayerAudioTrack = json.publishMediaPlayerAudioTrack
    obj.publishMediaPlayerVideoTrack = json.publishMediaPlayerVideoTrack
    obj.publishTrancodedVideoTrack = json.publishTrancodedVideoTrack
    obj.autoSubscribeAudio = json.autoSubscribeAudio
    obj.autoSubscribeVideo = json.autoSubscribeVideo
    obj.startPreview = json.startPreview
    obj.enableAudioRecordingOrPlayout = json.enableAudioRecordingOrPlayout
    obj.publishMediaPlayerId = json.publishMediaPlayerId
    obj.clientRoleType = json.clientRoleType
    obj.audienceLatencyLevel = json.audienceLatencyLevel
    obj.defaultVideoStreamType = json.defaultVideoStreamType
    obj.channelProfile = json.channelProfile
    obj.audioDelayMs = json.audioDelayMs
    obj.mediaPlayerAudioDelayMs = json.mediaPlayerAudioDelayMs
    obj.token = json.token
    obj.enableBuiltInMediaEncryption = json.enableBuiltInMediaEncryption
    obj.publishRhythmPlayerTrack = json.publishRhythmPlayerTrack
    obj.audioOptionsExternal = AudioOptionsExternal.fromJSON(json.audioOptionsExternal)
    return obj
  }

  toJSON? () {
    return {
      publishCameraTrack: this.publishCameraTrack,
      publishSecondaryCameraTrack: this.publishSecondaryCameraTrack,
      publishAudioTrack: this.publishAudioTrack,
      publishScreenTrack: this.publishScreenTrack,
      publishSecondaryScreenTrack: this.publishSecondaryScreenTrack,
      publishCustomAudioTrack: this.publishCustomAudioTrack,
      publishCustomAudioSourceId: this.publishCustomAudioSourceId,
      publishCustomAudioTrackEnableAec: this.publishCustomAudioTrackEnableAec,
      publishDirectCustomAudioTrack: this.publishDirectCustomAudioTrack,
      publishCustomAudioTrackAec: this.publishCustomAudioTrackAec,
      publishCustomVideoTrack: this.publishCustomVideoTrack,
      publishEncodedVideoTrack: this.publishEncodedVideoTrack,
      publishMediaPlayerAudioTrack: this.publishMediaPlayerAudioTrack,
      publishMediaPlayerVideoTrack: this.publishMediaPlayerVideoTrack,
      publishTrancodedVideoTrack: this.publishTrancodedVideoTrack,
      autoSubscribeAudio: this.autoSubscribeAudio,
      autoSubscribeVideo: this.autoSubscribeVideo,
      startPreview: this.startPreview,
      enableAudioRecordingOrPlayout: this.enableAudioRecordingOrPlayout,
      publishMediaPlayerId: this.publishMediaPlayerId,
      clientRoleType: this.clientRoleType,
      audienceLatencyLevel: this.audienceLatencyLevel,
      defaultVideoStreamType: this.defaultVideoStreamType,
      channelProfile: this.channelProfile,
      audioDelayMs: this.audioDelayMs,
      mediaPlayerAudioDelayMs: this.mediaPlayerAudioDelayMs,
      token: this.token,
      enableBuiltInMediaEncryption: this.enableBuiltInMediaEncryption,
      publishRhythmPlayerTrack: this.publishRhythmPlayerTrack,
      audioOptionsExternal: this.audioOptionsExternal
    }
  }
}

export enum LocalProxyMode {
kConnectivityFirst = 0,
kLocalOnly = 1,
}

export class LocalAccessPointConfiguration {
  ipList?: string
  ipListSize?: number
  domainList?: string
  domainListSize?: number
  verifyDomainName?: string
  mode?: LocalProxyMode
  static fromJSON (json: any): LocalAccessPointConfiguration {
    const obj = new LocalAccessPointConfiguration()
    obj.ipList = json.ipList
    obj.ipListSize = json.ipListSize
    obj.domainList = json.domainList
    obj.domainListSize = json.domainListSize
    obj.verifyDomainName = json.verifyDomainName
    obj.mode = json.mode
    return obj
  }

  toJSON? () {
    return {
      ipList: this.ipList,
      ipListSize: this.ipListSize,
      domainList: this.domainList,
      domainListSize: this.domainListSize,
      verifyDomainName: this.verifyDomainName,
      mode: this.mode
    }
  }
}

export class LeaveChannelOptions {
  stopAudioMixing?: boolean
  stopAllEffect?: boolean
  stopMicrophoneRecording?: boolean
  static fromJSON (json: any): LeaveChannelOptions {
    const obj = new LeaveChannelOptions()
    obj.stopAudioMixing = json.stopAudioMixing
    obj.stopAllEffect = json.stopAllEffect
    obj.stopMicrophoneRecording = json.stopMicrophoneRecording
    return obj
  }

  toJSON? () {
    return {
      stopAudioMixing: this.stopAudioMixing,
      stopAllEffect: this.stopAllEffect,
      stopMicrophoneRecording: this.stopMicrophoneRecording
    }
  }
}

export abstract class IRtcEngineEventHandler {
  eventHandlerType?(): string;

  onJoinChannelSuccess?(channel: string, uid: number, elapsed: number): void;

  onRejoinChannelSuccess?(channel: string, uid: number, elapsed: number): void;

  onWarning?(warn: number, msg: string): void;

  onError?(err: number, msg: string): void;

  onAudioQuality?(uid: number, quality: number, delay: number, lost: number): void;

  onLastmileProbeResult?(result: LastmileProbeResult): void;

  onAudioVolumeIndication?(speakers: AudioVolumeInfo[], speakerNumber: number, totalVolume: number): void;

  onLeaveChannel?(stats: RtcStats): void;

  onRtcStats?(stats: RtcStats): void;

  onAudioDeviceStateChanged?(deviceId: string, deviceType: number, deviceState: number): void;

  onAudioMixingFinished?(): void;

  onAudioEffectFinished?(soundId: number): void;

  onVideoDeviceStateChanged?(deviceId: string, deviceType: number, deviceState: number): void;

  onMediaDeviceChanged?(deviceType: number): void;

  onNetworkQuality?(uid: number, txQuality: number, rxQuality: number): void;

  onIntraRequestReceived?(): void;

  onUplinkNetworkInfoUpdated?(info: UplinkNetworkInfo): void;

  onDownlinkNetworkInfoUpdated?(info: DownlinkNetworkInfo): void;

  onLastmileQuality?(quality: number): void;

  onFirstLocalVideoFrame?(width: number, height: number, elapsed: number): void;

  onFirstLocalVideoFramePublished?(elapsed: number): void;

  onVideoSourceFrameSizeChanged?(sourceType: VideoSourceType, width: number, height: number): void;

  onFirstRemoteVideoDecoded?(uid: number, width: number, height: number, elapsed: number): void;

  onVideoSizeChanged?(uid: number, width: number, height: number, rotation: number): void;

  onLocalVideoStateChanged?(state: LocalVideoStreamState, error: LocalVideoStreamError): void;

  onRemoteVideoStateChanged?(uid: number, state: RemoteVideoState, reason: RemoteVideoStateReason, elapsed: number): void;

  onFirstRemoteVideoFrame?(userId: number, width: number, height: number, elapsed: number): void;

  onUserJoined?(uid: number, elapsed: number): void;

  onUserOffline?(uid: number, reason: UserOfflineReasonType): void;

  onUserMuteAudio?(uid: number, muted: boolean): void;

  onUserMuteVideo?(userId: number, muted: boolean): void;

  onUserEnableVideo?(uid: number, enabled: boolean): void;

  onUserStateChanged?(uid: number, state: number): void;

  onUserEnableLocalVideo?(uid: number, enabled: boolean): void;

  onApiCallExecuted?(err: number, api: string, result: string): void;

  onLocalAudioStats?(stats: LocalAudioStats): void;

  onRemoteAudioStats?(stats: RemoteAudioStats): void;

  onLocalVideoStats?(stats: LocalVideoStats): void;

  onRemoteVideoStats?(stats: RemoteVideoStats): void;

  onCameraReady?(): void;

  onCameraFocusAreaChanged?(x: number, y: number, width: number, height: number): void;

  onCameraExposureAreaChanged?(x: number, y: number, width: number, height: number): void;

  onFacePositionChanged?(imageWidth: number, imageHeight: number, vecRectangle: Rectangle, vecDistance: number, numFaces: number): void;

  onVideoStopped?(): void;

  onAudioMixingStateChanged?(state: AudioMixingStateType, errorCode: AudioMixingErrorType): void;

  onRhythmPlayerStateChanged?(state: RhythmPlayerStateType, errorCode: RhythmPlayerErrorType): void;

  onConnectionLost?(): void;

  onConnectionInterrupted?(): void;

  onConnectionBanned?(): void;

  onStreamMessage?(userId: number, streamId: number, data: Uint8Array, length: number, sentTs: number): void;

  onStreamMessageError?(userId: number, streamId: number, code: number, missed: number, cached: number): void;

  onRequestToken?(): void;

  onTokenPrivilegeWillExpire?(token: string): void;

  onFirstLocalAudioFramePublished?(elapsed: number): void;

  onFirstRemoteAudioFrame?(uid: number, elapsed: number): void;

  onFirstRemoteAudioDecoded?(uid: number, elapsed: number): void;

  onLocalAudioStateChanged?(state: LocalAudioStreamState, error: LocalAudioStreamError): void;

  onRemoteAudioStateChanged?(uid: number, state: RemoteAudioState, reason: RemoteAudioStateReason, elapsed: number): void;

  onActiveSpeaker?(userId: number): void;

  onContentInspectResult?(result: ContentInspectResult): void;

  onSnapshotTaken?(channel: string, uid: number, filePath: string, width: number, height: number, errCode: number): void;

  onClientRoleChanged?(oldRole: ClientRoleType, newRole: ClientRoleType): void;

  onClientRoleChangeFailed?(reason: ClientRoleChangeFailedReason, currentRole: ClientRoleType): void;

  onAudioDeviceVolumeChanged?(deviceType: MediaDeviceType, volume: number, muted: boolean): void;

  onRtmpStreamingStateChanged?(url: string, state: RtmpStreamPublishState, errCode: RtmpStreamPublishErrorType): void;

  onRtmpStreamingEvent?(url: string, eventCode: RtmpStreamingEvent): void;

  onStreamPublished?(url: string, error: number): void;

  onStreamUnpublished?(url: string): void;

  onTranscodingUpdated?(): void;

  onAudioRoutingChanged?(routing: number): void;

  onChannelMediaRelayStateChanged?(state: ChannelMediaRelayState, code: ChannelMediaRelayError): void;

  onChannelMediaRelayEvent?(code: number): void;

  onLocalPublishFallbackToAudioOnly?(isFallbackOrRecover: boolean): void;

  onRemoteSubscribeFallbackToAudioOnly?(uid: number, isFallbackOrRecover: boolean): void;

  onRemoteAudioTransportStats?(uid: number, delay: number, lost: number, rxKBitRate: number): void;

  onRemoteVideoTransportStats?(uid: number, delay: number, lost: number, rxKBitRate: number): void;

  onConnectionStateChanged?(state: ConnectionStateType, reason: ConnectionChangedReasonType): void;

  onNetworkTypeChanged?(type: NetworkType): void;

  onEncryptionError?(errorType: EncryptionErrorType): void;

  onPermissionError?(permissionType: PermissionType): void;

  onLocalUserRegistered?(uid: number, userAccount: string): void;

  onUserInfoUpdated?(uid: number, info: UserInfo): void;

  onUploadLogResult?(requestId: string, success: boolean, reason: UploadErrorReason): void;

  onAudioSubscribeStateChanged?(channel: string, uid: number, oldState: StreamSubscribeState, newState: StreamSubscribeState, elapseSinceLastState: number): void;

  onVideoSubscribeStateChanged?(channel: string, uid: number, oldState: StreamSubscribeState, newState: StreamSubscribeState, elapseSinceLastState: number): void;

  onAudioPublishStateChanged?(channel: string, oldState: StreamPublishState, newState: StreamPublishState, elapseSinceLastState: number): void;

  onVideoPublishStateChanged?(channel: string, oldState: StreamPublishState, newState: StreamPublishState, elapseSinceLastState: number): void;

  onExtensionEvent?(provider: string, extName: string, key: string, value: string): void;

  onExtensionStarted?(provider: string, extName: string): void;

  onExtensionStopped?(provider: string, extName: string): void;

  onExtensionErrored?(provider: string, extName: string, error: number, msg: string): void;

  onUserAccountUpdated?(uid: number, userAccount: string): void;
}

export abstract class IVideoDeviceManager {
abstract enumerateVideoDevices(): DeviceInfo[];

abstract setDevice(deviceIdUTF8: string): number;

abstract getDevice(): string;

abstract startDeviceTest(hwnd: any): number;

abstract stopDeviceTest(): number;

abstract release(): void;
}

export class RtcEngineContext {
  appId?: string
  enableAudioDevice?: boolean
  channelProfile?: ChannelProfileType
  audioScenario?: AudioScenarioType
  areaCode?: number
  logConfig?: LogConfig
  threadPriority?: ThreadPriorityType
  useExternalEglContext?: boolean
  static fromJSON (json: any): RtcEngineContext {
    const obj = new RtcEngineContext()
    obj.appId = json.appId
    obj.enableAudioDevice = json.enableAudioDevice
    obj.channelProfile = json.channelProfile
    obj.audioScenario = json.audioScenario
    obj.areaCode = json.areaCode
    obj.logConfig = LogConfig.fromJSON(json.logConfig)
    obj.threadPriority = json.threadPriority
    obj.useExternalEglContext = json.useExternalEglContext
    return obj
  }

  toJSON? () {
    return {
      appId: this.appId,
      enableAudioDevice: this.enableAudioDevice,
      channelProfile: this.channelProfile,
      audioScenario: this.audioScenario,
      areaCode: this.areaCode,
      logConfig: this.logConfig,
      threadPriority: this.threadPriority,
      useExternalEglContext: this.useExternalEglContext
    }
  }
}

export enum MetadataType {
UnknownMetadata = -1,
VideoMetadata = 0,
}

export enum MaxMetadataSizeType {
InvalidMetadataSizeInByte = -1,
DefaultMetadataSizeInByte = 512,
MaxMetadataSizeInByte = 1024,
}

export class Metadata {
  uid?: number
  size?: number
  buffer?: Uint8Array
  timeStampMs?: number
  static fromJSON (json: any): Metadata {
    const obj = new Metadata()
    obj.uid = json.uid
    obj.size = json.size
    obj.buffer = json.buffer
    obj.timeStampMs = json.timeStampMs
    return obj
  }

  toJSON? () {
    return {
      uid: this.uid,
      size: this.size,
      buffer: this.buffer,
      timeStampMs: this.timeStampMs
    }
  }
}

export abstract class IMetadataObserver {
  onMetadataReceived?(metadata: Metadata): void;
}

export enum DirectCdnStreamingError {
DirectCdnStreamingErrorOk = 0,
DirectCdnStreamingErrorFailed = 1,
DirectCdnStreamingErrorAudioPublication = 2,
DirectCdnStreamingErrorVideoPublication = 3,
DirectCdnStreamingErrorNetConnect = 4,
DirectCdnStreamingErrorBadName = 5,
}

export enum DirectCdnStreamingState {
DirectCdnStreamingStateIdle = 0,
DirectCdnStreamingStateRunning = 1,
DirectCdnStreamingStateStopped = 2,
DirectCdnStreamingStateFailed = 3,
DirectCdnStreamingStateRecovering = 4,
}

export class DirectCdnStreamingStats {
  videoWidth?: number
  videoHeight?: number
  fps?: number
  videoBitrate?: number
  audioBitrate?: number
  static fromJSON (json: any): DirectCdnStreamingStats {
    const obj = new DirectCdnStreamingStats()
    obj.videoWidth = json.videoWidth
    obj.videoHeight = json.videoHeight
    obj.fps = json.fps
    obj.videoBitrate = json.videoBitrate
    obj.audioBitrate = json.audioBitrate
    return obj
  }

  toJSON? () {
    return {
      videoWidth: this.videoWidth,
      videoHeight: this.videoHeight,
      fps: this.fps,
      videoBitrate: this.videoBitrate,
      audioBitrate: this.audioBitrate
    }
  }
}

export abstract class IDirectCdnStreamingEventHandler {
  onDirectCdnStreamingStateChanged?(state: DirectCdnStreamingState, error: DirectCdnStreamingError, message: string): void;

  onDirectCdnStreamingStats?(stats: DirectCdnStreamingStats): void;
}

export class DirectCdnStreamingMediaOptions {
  publishCameraTrack?: boolean
  publishMicrophoneTrack?: boolean
  publishCustomAudioTrack?: boolean
  publishCustomVideoTrack?: boolean
  publishMediaPlayerAudioTrack?: boolean
  publishMediaPlayerId?: number
  static fromJSON (json: any): DirectCdnStreamingMediaOptions {
    const obj = new DirectCdnStreamingMediaOptions()
    obj.publishCameraTrack = json.publishCameraTrack
    obj.publishMicrophoneTrack = json.publishMicrophoneTrack
    obj.publishCustomAudioTrack = json.publishCustomAudioTrack
    obj.publishCustomVideoTrack = json.publishCustomVideoTrack
    obj.publishMediaPlayerAudioTrack = json.publishMediaPlayerAudioTrack
    obj.publishMediaPlayerId = json.publishMediaPlayerId
    return obj
  }

  toJSON? () {
    return {
      publishCameraTrack: this.publishCameraTrack,
      publishMicrophoneTrack: this.publishMicrophoneTrack,
      publishCustomAudioTrack: this.publishCustomAudioTrack,
      publishCustomVideoTrack: this.publishCustomVideoTrack,
      publishMediaPlayerAudioTrack: this.publishMediaPlayerAudioTrack,
      publishMediaPlayerId: this.publishMediaPlayerId
    }
  }
}

export abstract class IRtcEngine {
abstract release(sync?: boolean): void;

abstract initialize(context: RtcEngineContext): number;

abstract queryInterface(iid: InterfaceIdType): any;

abstract getVersion(): { build: number, result: string };

abstract getErrorDescription(code: number): string;

abstract joinChannel(token: string, channelId: string, info: string, uid: number): number;

abstract joinChannel2(token: string, channelId: string, uid: number, options: ChannelMediaOptions): number;

abstract updateChannelMediaOptions(options: ChannelMediaOptions): number;

abstract leaveChannel(): number;

abstract leaveChannel2(options: LeaveChannelOptions): number;

abstract renewToken(token: string): number;

abstract setChannelProfile(profile: ChannelProfileType): number;

abstract setClientRole(role: ClientRoleType): number;

abstract setClientRole2(role: ClientRoleType, options: ClientRoleOptions): number;

abstract startEchoTest(): number;

abstract startEchoTest2(intervalInSeconds: number): number;

abstract stopEchoTest(): number;

abstract enableVideo(): number;

abstract disableVideo(): number;

abstract startPreview(): number;

abstract startPreview2(sourceType: VideoSourceType): number;

abstract stopPreview(): number;

abstract stopPreview2(sourceType: VideoSourceType): number;

abstract startLastmileProbeTest(config: LastmileProbeConfig): number;

abstract stopLastmileProbeTest(): number;

abstract setVideoEncoderConfiguration(config: VideoEncoderConfiguration): number;

abstract setBeautyEffectOptions(enabled: boolean, options: BeautyOptions, type?: MediaSourceType): number;

abstract enableVirtualBackground(enabled: boolean, backgroundSource: VirtualBackgroundSource): number;

abstract enableRemoteSuperResolution(userId: number, enable: boolean): number;

abstract setupRemoteVideo(canvas: VideoCanvas): number;

abstract setupLocalVideo(canvas: VideoCanvas): number;

abstract enableAudio(): number;

abstract disableAudio(): number;

abstract setAudioProfile(profile: AudioProfileType, scenario: AudioScenarioType): number;

abstract setAudioProfile2(profile: AudioProfileType): number;

abstract enableLocalAudio(enabled: boolean): number;

abstract muteLocalAudioStream(mute: boolean): number;

abstract muteAllRemoteAudioStreams(mute: boolean): number;

abstract setDefaultMuteAllRemoteAudioStreams(mute: boolean): number;

abstract muteRemoteAudioStream(uid: number, mute: boolean): number;

abstract muteLocalVideoStream(mute: boolean): number;

abstract enableLocalVideo(enabled: boolean): number;

abstract muteAllRemoteVideoStreams(mute: boolean): number;

abstract setDefaultMuteAllRemoteVideoStreams(mute: boolean): number;

abstract muteRemoteVideoStream(uid: number, mute: boolean): number;

abstract setRemoteVideoStreamType(uid: number, streamType: VideoStreamType): number;

abstract setRemoteDefaultVideoStreamType(streamType: VideoStreamType): number;

abstract enableAudioVolumeIndication(interval: number, smooth: number, reportVad: boolean): number;

abstract startAudioRecording(filePath: string, quality: AudioRecordingQualityType): number;

abstract startAudioRecording2(filePath: string, sampleRate: number, quality: AudioRecordingQualityType): number;

abstract startAudioRecording3(config: AudioRecordingConfiguration): number;

abstract stopAudioRecording(): number;

abstract createMediaPlayer(): IMediaPlayer;

abstract destroyMediaPlayer(mediaPlayer: IMediaPlayer): number;

abstract startAudioMixing(filePath: string, loopback: boolean, replace: boolean, cycle: number): number;

abstract startAudioMixing2(filePath: string, loopback: boolean, replace: boolean, cycle: number, startPos: number): number;

abstract stopAudioMixing(): number;

abstract pauseAudioMixing(): number;

abstract resumeAudioMixing(): number;

abstract adjustAudioMixingVolume(volume: number): number;

abstract adjustAudioMixingPublishVolume(volume: number): number;

abstract getAudioMixingPublishVolume(): number;

abstract adjustAudioMixingPlayoutVolume(volume: number): number;

abstract getAudioMixingPlayoutVolume(): number;

abstract getAudioMixingDuration(): number;

abstract getAudioMixingCurrentPosition(): number;

abstract setAudioMixingPosition(pos: number): number;

abstract setAudioMixingPitch(pitch: number): number;

abstract getEffectsVolume(): number;

abstract setEffectsVolume(volume: number): number;

abstract preloadEffect(soundId: number, filePath: string, startPos?: number): number;

abstract playEffect(soundId: number, filePath: string, loopCount: number, pitch: number, pan: number, gain: number, publish?: boolean, startPos?: number): number;

abstract playAllEffects(loopCount: number, pitch: number, pan: number, gain: number, publish?: boolean): number;

abstract getVolumeOfEffect(soundId: number): number;

abstract setVolumeOfEffect(soundId: number, volume: number): number;

abstract pauseEffect(soundId: number): number;

abstract pauseAllEffects(): number;

abstract resumeEffect(soundId: number): number;

abstract resumeAllEffects(): number;

abstract stopEffect(soundId: number): number;

abstract stopAllEffects(): number;

abstract unloadEffect(soundId: number): number;

abstract unloadAllEffects(): number;

abstract enableSoundPositionIndication(enabled: boolean): number;

abstract setRemoteVoicePosition(uid: number, pan: number, gain: number): number;

abstract enableSpatialAudio(enabled: boolean): number;

abstract setRemoteUserSpatialAudioParams(uid: number, params: SpatialAudioParams): number;

abstract setVoiceBeautifierPreset(preset: VoiceBeautifierPreset): number;

abstract setAudioEffectPreset(preset: AudioEffectPreset): number;

abstract setVoiceConversionPreset(preset: VoiceConversionPreset): number;

abstract setAudioEffectParameters(preset: AudioEffectPreset, param1: number, param2: number): number;

abstract setVoiceBeautifierParameters(preset: VoiceBeautifierPreset, param1: number, param2: number): number;

abstract setVoiceConversionParameters(preset: VoiceConversionPreset, param1: number, param2: number): number;

abstract setLocalVoicePitch(pitch: number): number;

abstract setLocalVoiceEqualization(bandFrequency: AudioEqualizationBandFrequency, bandGain: number): number;

abstract setLocalVoiceReverb(reverbKey: AudioReverbType, value: number): number;

abstract setLogFile(filePath: string): number;

abstract setLogFilter(filter: number): number;

abstract setLogLevel(level: LogLevel): number;

abstract setLogFileSize(fileSizeInKBytes: number): number;

abstract uploadLogFile(requestId: string): number;

abstract setLocalRenderMode(renderMode: RenderModeType, mirrorMode: VideoMirrorModeType): number;

abstract setRemoteRenderMode(uid: number, renderMode: RenderModeType, mirrorMode: VideoMirrorModeType): number;

abstract setLocalRenderMode2(renderMode: RenderModeType): number;

abstract setLocalVideoMirrorMode(mirrorMode: VideoMirrorModeType): number;

abstract enableDualStreamMode(enabled: boolean): number;

abstract enableDualStreamMode2(sourceType: VideoSourceType, enabled: boolean): number;

abstract enableDualStreamMode3(sourceType: VideoSourceType, enabled: boolean, streamConfig: SimulcastStreamConfig): number;

abstract enableEchoCancellationExternal(enabled: boolean, audioSourceDelay: number): number;

abstract enableCustomAudioLocalPlayback(sourceId: number, enabled: boolean): number;

abstract startPrimaryCustomAudioTrack(config: AudioTrackConfig): number;

abstract stopPrimaryCustomAudioTrack(): number;

abstract startSecondaryCustomAudioTrack(config: AudioTrackConfig): number;

abstract stopSecondaryCustomAudioTrack(): number;

abstract setRecordingAudioFrameParameters(sampleRate: number, channel: number, mode: RawAudioFrameOpModeType, samplesPerCall: number): number;

abstract setPlaybackAudioFrameParameters(sampleRate: number, channel: number, mode: RawAudioFrameOpModeType, samplesPerCall: number): number;

abstract setMixedAudioFrameParameters(sampleRate: number, channel: number, samplesPerCall: number): number;

abstract setPlaybackAudioFrameBeforeMixingParameters(sampleRate: number, channel: number): number;

abstract enableAudioSpectrumMonitor(intervalInMS?: number): number;

abstract disableAudioSpectrumMonitor(): number;

abstract adjustRecordingSignalVolume(volume: number): number;

abstract muteRecordingSignal(mute: boolean): number;

abstract adjustPlaybackSignalVolume(volume: number): number;

abstract adjustUserPlaybackSignalVolume(uid: number, volume: number): number;

abstract setLocalPublishFallbackOption(option: StreamFallbackOptions): number;

abstract setRemoteSubscribeFallbackOption(option: StreamFallbackOptions): number;

abstract enableLoopbackRecording(enabled: boolean, deviceName?: string): number;

abstract adjustLoopbackRecordingVolume(volume: number): number;

abstract getLoopbackRecordingVolume(): number;

abstract enableInEarMonitoring(enabled: boolean, includeAudioFilters: number): number;

abstract setInEarMonitoringVolume(volume: number): number;

abstract loadExtensionProvider(extensionLibPath: string): number;

abstract setExtensionProviderProperty(provider: string, key: string, value: string): number;

abstract enableExtension(provider: string, extension: string, enable?: boolean, type?: MediaSourceType): number;

abstract setExtensionProperty(provider: string, extension: string, key: string, value: string, type?: MediaSourceType): number;

abstract getExtensionProperty(provider: string, extension: string, key: string, bufLen: number, type?: MediaSourceType): string;

abstract setCameraCapturerConfiguration(config: CameraCapturerConfiguration): number;

abstract switchCamera(): number;

abstract isCameraZoomSupported(): boolean;

abstract isCameraFaceDetectSupported(): boolean;

abstract isCameraTorchSupported(): boolean;

abstract isCameraFocusSupported(): boolean;

abstract isCameraAutoFocusFaceModeSupported(): boolean;

abstract setCameraZoomFactor(factor: number): number;

abstract enableFaceDetection(enabled: boolean): number;

abstract getCameraMaxZoomFactor(): number;

abstract setCameraFocusPositionInPreview(positionX: number, positionY: number): number;

abstract setCameraTorchOn(isOn: boolean): number;

abstract setCameraAutoFocusFaceModeEnabled(enabled: boolean): number;

abstract isCameraExposurePositionSupported(): boolean;

abstract setCameraExposurePosition(positionXinView: number, positionYinView: number): number;

abstract isCameraAutoExposureFaceModeSupported(): boolean;

abstract setCameraAutoExposureFaceModeEnabled(enabled: boolean): number;

abstract setDefaultAudioRouteToSpeakerphone(defaultToSpeaker: boolean): number;

abstract setEnableSpeakerphone(speakerOn: boolean): number;

abstract isSpeakerphoneEnabled(): boolean;

abstract getScreenCaptureSources(thumbSize: SIZE, iconSize: SIZE, includeScreen: boolean): ScreenCaptureSourceInfo[];

abstract setAudioSessionOperationRestriction(restriction: AudioSessionOperationRestriction): number;

abstract startScreenCaptureByDisplayId(displayId: number, regionRect: Rectangle, captureParams: ScreenCaptureParameters): number;

abstract startScreenCaptureByScreenRect(screenRect: Rectangle, regionRect: Rectangle, captureParams: ScreenCaptureParameters): number;

abstract startScreenCapture(mediaProjectionPermissionResultData: Uint8Array, captureParams: ScreenCaptureParameters): number;

abstract getAudioDeviceInfo(): DeviceInfo;

abstract startScreenCaptureByWindowId(windowId: any, regionRect: Rectangle, captureParams: ScreenCaptureParameters): number;

abstract setScreenCaptureContentHint(contentHint: VideoContentHint): number;

abstract updateScreenCaptureRegion(regionRect: Rectangle): number;

abstract updateScreenCaptureParameters(captureParams: ScreenCaptureParameters): number;

abstract stopScreenCapture(): number;

abstract getCallId(): string;

abstract rate(callId: string, rating: number, description: string): number;

abstract complain(callId: string, description: string): number;

abstract addPublishStreamUrl(url: string, transcodingEnabled: boolean): number;

abstract removePublishStreamUrl(url: string): number;

abstract setLiveTranscoding(transcoding: LiveTranscoding): number;

abstract startRtmpStreamWithoutTranscoding(url: string): number;

abstract startRtmpStreamWithTranscoding(url: string, transcoding: LiveTranscoding): number;

abstract updateRtmpTranscoding(transcoding: LiveTranscoding): number;

abstract stopRtmpStream(url: string): number;

abstract startLocalVideoTranscoder(config: LocalTranscoderConfiguration): number;

abstract updateLocalTranscoderConfiguration(config: LocalTranscoderConfiguration): number;

abstract stopLocalVideoTranscoder(): number;

abstract startPrimaryCameraCapture(config: CameraCapturerConfiguration): number;

abstract startSecondaryCameraCapture(config: CameraCapturerConfiguration): number;

abstract stopPrimaryCameraCapture(): number;

abstract stopSecondaryCameraCapture(): number;

abstract setCameraDeviceOrientation(type: VideoSourceType, orientation: VideoOrientation): number;

abstract setScreenCaptureOrientation(type: VideoSourceType, orientation: VideoOrientation): number;

abstract startPrimaryScreenCapture(config: ScreenCaptureConfiguration): number;

abstract startSecondaryScreenCapture(config: ScreenCaptureConfiguration): number;

abstract stopPrimaryScreenCapture(): number;

abstract stopSecondaryScreenCapture(): number;

abstract getConnectionState(): ConnectionStateType;

abstract registerEventHandler(eventHandler: IRtcEngineEventHandler): boolean;

abstract unregisterEventHandler(eventHandler: IRtcEngineEventHandler): boolean;

abstract setRemoteUserPriority(uid: number, userPriority: PriorityType): number;

abstract setEncryptionMode(encryptionMode: string): number;

abstract setEncryptionSecret(secret: string): number;

abstract enableEncryption(enabled: boolean, config: EncryptionConfig): number;

abstract createDataStream(reliable: boolean, ordered: boolean): number;

abstract createDataStream2(config: DataStreamConfig): number;

abstract sendStreamMessage(streamId: number, data: Uint8Array, length: number): number;

abstract addVideoWatermark(watermark: RtcImage): number;

abstract addVideoWatermark2(watermarkUrl: string, options: WatermarkOptions): number;

abstract clearVideoWatermark(): number;

abstract clearVideoWatermarks(): number;

abstract addInjectStreamUrl(url: string, config: InjectStreamConfig): number;

abstract removeInjectStreamUrl(url: string): number;

abstract pauseAudio(): number;

abstract resumeAudio(): number;

abstract enableWebSdkInteroperability(enabled: boolean): number;

abstract sendCustomReportMessage(id: string, category: string, event: string, label: string, value: number): number;

abstract registerMediaMetadataObserver(observer: IMetadataObserver, type: MetadataType): number;

abstract unregisterMediaMetadataObserver(observer: IMetadataObserver, type: MetadataType): number;

abstract startAudioFrameDump(channelId: string, userId: number, location: string, uuid: string, passwd: string, durationMs: number, autoUpload: boolean): number;

abstract stopAudioFrameDump(channelId: string, userId: number, location: string): number;

abstract registerLocalUserAccount(appId: string, userAccount: string): number;

abstract joinChannelWithUserAccount(token: string, channelId: string, userAccount: string): number;

abstract joinChannelWithUserAccount2(token: string, channelId: string, userAccount: string, options: ChannelMediaOptions): number;

abstract joinChannelWithUserAccountEx(token: string, channelId: string, userAccount: string, options: ChannelMediaOptions, eventHandler: IRtcEngineEventHandler): number;

abstract getUserInfoByUserAccount(userAccount: string): UserInfo;

abstract getUserInfoByUid(uid: number): UserInfo;

abstract startChannelMediaRelay(configuration: ChannelMediaRelayConfiguration): number;

abstract updateChannelMediaRelay(configuration: ChannelMediaRelayConfiguration): number;

abstract stopChannelMediaRelay(): number;

abstract pauseAllChannelMediaRelay(): number;

abstract resumeAllChannelMediaRelay(): number;

abstract setDirectCdnStreamingAudioConfiguration(profile: AudioProfileType): number;

abstract setDirectCdnStreamingVideoConfiguration(config: VideoEncoderConfiguration): number;

abstract startDirectCdnStreaming(eventHandler: IDirectCdnStreamingEventHandler, publishUrl: string, options: DirectCdnStreamingMediaOptions): number;

abstract stopDirectCdnStreaming(): number;

abstract updateDirectCdnStreamingMediaOptions(options: DirectCdnStreamingMediaOptions): number;

abstract pushDirectCdnStreamingCustomVideoFrame(frame: ExternalVideoFrame): number;

abstract takeSnapshot(config: SnapShotConfig): number;

abstract SetContentInspect(config: ContentInspectConfig): number;

abstract switchChannel(token: string, channel: string): number;

abstract startRhythmPlayer(sound1: string, sound2: string, config: AgoraRhythmPlayerConfig): number;

abstract stopRhythmPlayer(): number;

abstract configRhythmPlayer(config: AgoraRhythmPlayerConfig): number;

abstract adjustCustomAudioPublishVolume(sourceId: number, volume: number): number;

abstract adjustCustomAudioPlayoutVolume(sourceId: number, volume: number): number;

abstract setCloudProxy(proxyType: CloudProxyType): number;

abstract setLocalAccessPoint(config: LocalAccessPointConfiguration): number;

abstract enableFishCorrection(enabled: boolean, params: FishCorrectionParams): number;

abstract setAdvancedAudioOptions(options: AdvancedAudioOptions): number;

abstract setAVSyncSource(channelId: string, uid: number): number;

abstract destroyRendererByView(view: any): void;

abstract destroyRendererByConfig(sourceType: VideoSourceType, channelId: string, uid: number): void;

abstract getAudioDeviceManager(): IAudioDeviceManager;

abstract getVideoDeviceManager(): IVideoDeviceManager;

abstract sendMetaData(metadata: Metadata, sourceType: VideoSourceType): number;
}

export enum QualityReportFormatType {
QualityReportJson = 0,
QualityReportHtml = 1,
}

export enum MediaDeviceStateType {
MediaDeviceStateIdle = 0,
MediaDeviceStateActive = 1,
MediaDeviceStateDisabled = 2,
MediaDeviceStateNotPresent = 4,
MediaDeviceStateUnplugged = 8,
}

export enum VideoProfileType {
VideoProfileLandscape120p = 0,
VideoProfileLandscape120p3 = 2,
VideoProfileLandscape180p = 10,
VideoProfileLandscape180p3 = 12,
VideoProfileLandscape180p4 = 13,
VideoProfileLandscape240p = 20,
VideoProfileLandscape240p3 = 22,
VideoProfileLandscape240p4 = 23,
VideoProfileLandscape360p = 30,
VideoProfileLandscape360p3 = 32,
VideoProfileLandscape360p4 = 33,
VideoProfileLandscape360p6 = 35,
VideoProfileLandscape360p7 = 36,
VideoProfileLandscape360p8 = 37,
VideoProfileLandscape360p9 = 38,
VideoProfileLandscape360p10 = 39,
VideoProfileLandscape360p11 = 100,
VideoProfileLandscape480p = 40,
VideoProfileLandscape480p3 = 42,
VideoProfileLandscape480p4 = 43,
VideoProfileLandscape480p6 = 45,
VideoProfileLandscape480p8 = 47,
VideoProfileLandscape480p9 = 48,
VideoProfileLandscape480p10 = 49,
VideoProfileLandscape720p = 50,
VideoProfileLandscape720p3 = 52,
VideoProfileLandscape720p5 = 54,
VideoProfileLandscape720p6 = 55,
VideoProfileLandscape1080p = 60,
VideoProfileLandscape1080p3 = 62,
VideoProfileLandscape1080p5 = 64,
VideoProfileLandscape1440p = 66,
VideoProfileLandscape1440p2 = 67,
VideoProfileLandscape4k = 70,
VideoProfileLandscape4k3 = 72,
VideoProfilePortrait120p = 1000,
VideoProfilePortrait120p3 = 1002,
VideoProfilePortrait180p = 1010,
VideoProfilePortrait180p3 = 1012,
VideoProfilePortrait180p4 = 1013,
VideoProfilePortrait240p = 1020,
VideoProfilePortrait240p3 = 1022,
VideoProfilePortrait240p4 = 1023,
VideoProfilePortrait360p = 1030,
VideoProfilePortrait360p3 = 1032,
VideoProfilePortrait360p4 = 1033,
VideoProfilePortrait360p6 = 1035,
VideoProfilePortrait360p7 = 1036,
VideoProfilePortrait360p8 = 1037,
VideoProfilePortrait360p9 = 1038,
VideoProfilePortrait360p10 = 1039,
VideoProfilePortrait360p11 = 1100,
VideoProfilePortrait480p = 1040,
VideoProfilePortrait480p3 = 1042,
VideoProfilePortrait480p4 = 1043,
VideoProfilePortrait480p6 = 1045,
VideoProfilePortrait480p8 = 1047,
VideoProfilePortrait480p9 = 1048,
VideoProfilePortrait480p10 = 1049,
VideoProfilePortrait720p = 1050,
VideoProfilePortrait720p3 = 1052,
VideoProfilePortrait720p5 = 1054,
VideoProfilePortrait720p6 = 1055,
VideoProfilePortrait1080p = 1060,
VideoProfilePortrait1080p3 = 1062,
VideoProfilePortrait1080p5 = 1064,
VideoProfilePortrait1440p = 1066,
VideoProfilePortrait1440p2 = 1067,
VideoProfilePortrait4k = 1070,
VideoProfilePortrait4k3 = 1072,
VideoProfileDefault = 30,
}

export class DeviceInfo {
  deviceId?: string
  deviceName?: string
  static fromJSON (json: any): DeviceInfo {
    const obj = new DeviceInfo()
    obj.deviceId = json.deviceId
    obj.deviceName = json.deviceName
    return obj
  }

  toJSON? () {
    return {
      deviceId: this.deviceId,
      deviceName: this.deviceName
    }
  }
}
