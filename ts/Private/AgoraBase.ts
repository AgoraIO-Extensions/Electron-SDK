import { MediaSourceType, RenderModeType } from './AgoraMediaBase'

export enum ChannelProfileType {
  ChannelProfileCommunication = 0,
  ChannelProfileLiveBroadcasting = 1,
  ChannelProfileGame = 2,
  ChannelProfileCloudGaming = 3,
  ChannelProfileCommunication1v1 = 4,
  ChannelProfileLiveBroadcasting2 = 5,
}

export enum WarnCodeType {
  WarnInvalidView = 8,
  WarnInitVideo = 16,
  WarnPending = 20,
  WarnNoAvailableChannel = 103,
  WarnLookupChannelTimeout = 104,
  WarnLookupChannelRejected = 105,
  WarnOpenChannelTimeout = 106,
  WarnOpenChannelRejected = 107,
  WarnSwitchLiveVideoTimeout = 111,
  WarnSetClientRoleTimeout = 118,
  WarnOpenChannelInvalidTicket = 121,
  WarnOpenChannelTryNextVos = 122,
  WarnChannelConnectionUnrecoverable = 131,
  WarnChannelConnectionIpChanged = 132,
  WarnChannelConnectionPortChanged = 133,
  WarnChannelSocketError = 134,
  WarnAudioMixingOpenError = 701,
  WarnAdmRuntimePlayoutWarning = 1014,
  WarnAdmRuntimeRecordingWarning = 1016,
  WarnAdmRecordAudioSilence = 1019,
  WarnAdmPlayoutMalfunction = 1020,
  WarnAdmRecordMalfunction = 1021,
  WarnAdmIosCategoryNotPlayandrecord = 1029,
  WarnAdmIosSamplerateChange = 1030,
  WarnAdmRecordAudioLowlevel = 1031,
  WarnAdmPlayoutAudioLowlevel = 1032,
  WarnAdmWindowsNoDataReadyEvent = 1040,
  WarnApmHowling = 1051,
  WarnAdmGlitchState = 1052,
  WarnAdmImproperSettings = 1053,
  WarnAdmWinCoreNoRecordingDevice = 1322,
  WarnAdmWinCoreNoPlayoutDevice = 1323,
  WarnAdmWinCoreImproperCaptureRelease = 1324,
}

export enum ErrorCodeType {
  ErrOk = 0,
  ErrFailed = 1,
  ErrInvalidArgument = 2,
  ErrNotReady = 3,
  ErrNotSupported = 4,
  ErrRefused = 5,
  ErrBufferTooSmall = 6,
  ErrNotInitialized = 7,
  ErrInvalidState = 8,
  ErrNoPermission = 9,
  ErrTimedout = 10,
  ErrCanceled = 11,
  ErrTooOften = 12,
  ErrBindSocket = 13,
  ErrNetDown = 14,
  ErrNetNobufs = 15,
  ErrJoinChannelRejected = 17,
  ErrLeaveChannelRejected = 18,
  ErrAlreadyInUse = 19,
  ErrAborted = 20,
  ErrInitNetEngine = 21,
  ErrResourceLimited = 22,
  ErrInvalidAppId = 101,
  ErrInvalidChannelName = 102,
  ErrNoServerResources = 103,
  ErrTokenExpired = 109,
  ErrInvalidToken = 110,
  ErrConnectionInterrupted = 111,
  ErrConnectionLost = 112,
  ErrNotInChannel = 113,
  ErrSizeTooLarge = 114,
  ErrBitrateLimit = 115,
  ErrTooManyDataStreams = 116,
  ErrStreamMessageTimeout = 117,
  ErrSetClientRoleNotAuthorized = 119,
  ErrDecryptionFailed = 120,
  ErrInvalidUserId = 121,
  ErrClientIsBannedByServer = 123,
  ErrWatermarkParam = 124,
  ErrWatermarkPath = 125,
  ErrWatermarkPng = 126,
  ErrWatermarkrInfo = 127,
  ErrWatermarkArgb = 128,
  ErrWatermarkRead = 129,
  ErrEncryptedStreamNotAllowedPublish = 130,
  ErrLicenseCredentialInvalid = 131,
  ErrInvalidUserAccount = 134,
  ErrCertRaw = 157,
  ErrCertJsonPart = 158,
  ErrCertJsonInval = 159,
  ErrCertJsonNomem = 160,
  ErrCertCustom = 161,
  ErrCertCredential = 162,
  ErrCertSign = 163,
  ErrCertFail = 164,
  ErrCertBuf = 165,
  ErrCertNull = 166,
  ErrCertDuedate = 167,
  ErrCertRequest = 168,
  ErrPcmsendFormat = 200,
  ErrPcmsendBufferoverflow = 201,
  ErrLogoutOther = 400,
  ErrLogoutUser = 401,
  ErrLogoutNet = 402,
  ErrLogoutKicked = 403,
  ErrLogoutPacket = 404,
  ErrLogoutTokenExpired = 405,
  ErrLogoutOldversion = 406,
  ErrLogoutTokenWrong = 407,
  ErrLogoutAlreadyLogout = 408,
  ErrLoginOther = 420,
  ErrLoginNet = 421,
  ErrLoginFailed = 422,
  ErrLoginCanceled = 423,
  ErrLoginTokenExpired = 424,
  ErrLoginOldVersion = 425,
  ErrLoginTokenWrong = 426,
  ErrLoginTokenKicked = 427,
  ErrLoginAlreadyLogin = 428,
  ErrJoinChannelOther = 440,
  ErrSendMessageOther = 440,
  ErrSendMessageTimeout = 441,
  ErrQueryUsernumOther = 450,
  ErrQueryUsernumTimeout = 451,
  ErrQueryUsernumByuser = 452,
  ErrLeaveChannelOther = 460,
  ErrLeaveChannelKicked = 461,
  ErrLeaveChannelByuser = 462,
  ErrLeaveChannelLogout = 463,
  ErrLeaveChannelDisconnected = 464,
  ErrInviteOther = 470,
  ErrInviteReinvite = 471,
  ErrInviteNet = 472,
  ErrInvitePeerOffline = 473,
  ErrInviteTimeout = 474,
  ErrInviteCantRecv = 475,
  ErrLoadMediaEngine = 1001,
  ErrStartCall = 1002,
  ErrStartCamera = 1003,
  ErrStartVideoRender = 1004,
  ErrAdmGeneralError = 1005,
  ErrAdmJavaResource = 1006,
  ErrAdmSampleRate = 1007,
  ErrAdmInitPlayout = 1008,
  ErrAdmStartPlayout = 1009,
  ErrAdmStopPlayout = 1010,
  ErrAdmInitRecording = 1011,
  ErrAdmStartRecording = 1012,
  ErrAdmStopRecording = 1013,
  ErrAdmRuntimePlayoutError = 1015,
  ErrAdmRuntimeRecordingError = 1017,
  ErrAdmRecordAudioFailed = 1018,
  ErrAdmInitLoopback = 1022,
  ErrAdmStartLoopback = 1023,
  ErrAdmNoPermission = 1027,
  ErrAdmRecordAudioIsActive = 1033,
  ErrAdmAndroidJniJavaResource = 1101,
  ErrAdmAndroidJniNoRecordFrequency = 1108,
  ErrAdmAndroidJniNoPlaybackFrequency = 1109,
  ErrAdmAndroidJniJavaStartRecord = 1111,
  ErrAdmAndroidJniJavaStartPlayback = 1112,
  ErrAdmAndroidJniJavaRecordError = 1115,
  ErrAdmAndroidOpenslCreateEngine = 1151,
  ErrAdmAndroidOpenslCreateAudioRecorder = 1153,
  ErrAdmAndroidOpenslStartRecorderThread = 1156,
  ErrAdmAndroidOpenslCreateAudioPlayer = 1157,
  ErrAdmAndroidOpenslStartPlayerThread = 1160,
  ErrAdmIosInputNotAvailable = 1201,
  ErrAdmIosActivateSessionFail = 1206,
  ErrAdmIosVpioInitFail = 1210,
  ErrAdmIosVpioReinitFail = 1213,
  ErrAdmIosVpioRestartFail = 1214,
  ErrAdmIosSetRenderCallbackFail = 1219,
  ErrAdmIosSessionSampleratrZero = 1221,
  ErrAdmWinCoreInit = 1301,
  ErrAdmWinCoreInitRecording = 1303,
  ErrAdmWinCoreInitPlayout = 1306,
  ErrAdmWinCoreInitPlayoutNull = 1307,
  ErrAdmWinCoreStartRecording = 1309,
  ErrAdmWinCoreCreateRecThread = 1311,
  ErrAdmWinCoreCaptureNotStartup = 1314,
  ErrAdmWinCoreCreateRenderThread = 1319,
  ErrAdmWinCoreRenderNotStartup = 1320,
  ErrAdmWinCoreNoRecordingDevice = 1322,
  ErrAdmWinCoreNoPlayoutDevice = 1323,
  ErrAdmWinWaveInit = 1351,
  ErrAdmWinWaveInitRecording = 1353,
  ErrAdmWinWaveInitMicrophone = 1354,
  ErrAdmWinWaveInitPlayout = 1355,
  ErrAdmWinWaveInitSpeaker = 1356,
  ErrAdmWinWaveStartRecording = 1357,
  ErrAdmWinWaveStartPlayout = 1358,
  ErrAdmNoRecordingDevice = 1359,
  ErrAdmNoPlayoutDevice = 1360,
  ErrVdmCameraNotAuthorized = 1501,
  ErrVdmWinDeviceInUse = 1502,
  ErrVcmUnknownError = 1600,
  ErrVcmEncoderInitError = 1601,
  ErrVcmEncoderEncodeError = 1602,
  ErrVcmEncoderSetError = 1603,
}

export enum AudioSessionOperationRestriction {
  AudioSessionOperationRestrictionNone = 0,
  AudioSessionOperationRestrictionSetCategory = 1,
  AudioSessionOperationRestrictionConfigureSession = 1 << 1,
  AudioSessionOperationRestrictionDeactivateSession = 1 << 2,
  AudioSessionOperationRestrictionAll = 1 << 7,
}

export enum UserOfflineReasonType {
  UserOfflineQuit = 0,
  UserOfflineDropped = 1,
  UserOfflineBecomeAudience = 2,
}

export enum InterfaceIdType {
  AgoraIidAudioDeviceManager = 1,
  AgoraIidVideoDeviceManager = 2,
  AgoraIidParameterEngine = 3,
  AgoraIidMediaEngine = 4,
  AgoraIidAudioEngine = 5,
  AgoraIidVideoEngine = 6,
  AgoraIidRtcConnection = 7,
  AgoraIidSignalingEngine = 8,
  AgoraIidMediaEngineRegulator = 9,
  AgoraIidCloudSpatialAudio = 10,
  AgoraIidLocalSpatialAudio = 11,
}

export enum QualityType {
  QualityUnknown = 0,
  QualityExcellent = 1,
  QualityGood = 2,
  QualityPoor = 3,
  QualityBad = 4,
  QualityVbad = 5,
  QualityDown = 6,
  QualityUnsupported = 7,
  QualityDetecting = 8,
}

export enum FitModeType {
  ModeCover = 1,
  ModeContain = 2,
}

export enum VideoOrientation {
  VideoOrientation0 = 0,
  VideoOrientation90 = 90,
  VideoOrientation180 = 180,
  VideoOrientation270 = 270,
}

export enum FrameRate {
  FrameRateFps1 = 1,
  FrameRateFps7 = 7,
  FrameRateFps10 = 10,
  FrameRateFps15 = 15,
  FrameRateFps24 = 24,
  FrameRateFps30 = 30,
  FrameRateFps60 = 60,
}

export enum FrameWidth {
  FrameWidth640 = 640,
}

export enum FrameHeight {
  FrameHeight360 = 360,
}

export enum VideoFrameType {
  VideoFrameTypeBlankFrame = 0,
  VideoFrameTypeKeyFrame = 3,
  VideoFrameTypeDeltaFrame = 4,
  VideoFrameTypeBFrame = 5,
  VideoFrameTypeDroppableFrame = 6,
  VideoFrameTypeUnknow = 7,
}

export enum OrientationMode {
  OrientationModeAdaptive = 0,
  OrientationModeFixedLandscape = 1,
  OrientationModeFixedPortrait = 2,
}

export enum DegradationPreference {
  MaintainQuality = 0,
  MaintainFramerate = 1,
  MaintainBalanced = 2,
  MaintainResolution = 3,
  DISABLED = 100,
}

export class VideoDimensions {
  width?: number
  height?: number
  static fromJSON(json: any): VideoDimensions {
    const obj = new VideoDimensions()
    obj.width = json.width
    obj.height = json.height
    return obj
  }

  toJSON() {
    return {
      width: this.width,
      height: this.height
    }
  }
}

export enum VideoCodecType {
  VideoCodecNone = 0,
  VideoCodecVp8 = 1,
  VideoCodecH264 = 2,
  VideoCodecH265 = 3,
  VideoCodecVp9 = 5,
  VideoCodecGeneric = 6,
  VideoCodecGenericH264 = 7,
  VideoCodecAv1 = 12,
  VideoCodecGenericJpeg = 20,
}

export enum AudioCodecType {
  AudioCodecOpus = 1,
  AudioCodecPcma = 3,
  AudioCodecPcmu = 4,
  AudioCodecG722 = 5,
  AudioCodecAaclc = 8,
  AudioCodecHeaac = 9,
  AudioCodecJc1 = 10,
  AudioCodecHeaac2 = 11,
  AudioCodecLpcnet = 12,
}

export enum AudioEncodingType {
  AudioEncodingTypeAac16000Low = 0x010101,
  AudioEncodingTypeAac16000Medium = 0x010102,
  AudioEncodingTypeAac32000Low = 0x010201,
  AudioEncodingTypeAac32000Medium = 0x010202,
  AudioEncodingTypeAac32000High = 0x010203,
  AudioEncodingTypeAac48000Medium = 0x010302,
  AudioEncodingTypeAac48000High = 0x010303,
  AudioEncodingTypeOpus16000Low = 0x020101,
  AudioEncodingTypeOpus16000Medium = 0x020102,
  AudioEncodingTypeOpus48000Medium = 0x020302,
  AudioEncodingTypeOpus48000High = 0x020303,
}

export enum WatermarkFitMode {
  FitModeCoverPosition = 0,
  FitModeUseImageRatio = 1,
}

export class EncodedAudioFrameAdvancedSettings {
  speech?: boolean
  sendEvenIfEmpty?: boolean
  static fromJSON(json: any): EncodedAudioFrameAdvancedSettings {
    const obj = new EncodedAudioFrameAdvancedSettings()
    obj.speech = json.speech
    obj.sendEvenIfEmpty = json.sendEvenIfEmpty
    return obj
  }

  toJSON() {
    return {
      speech: this.speech,
      sendEvenIfEmpty: this.sendEvenIfEmpty
    }
  }
}

export class EncodedAudioFrameInfo {
  codec?: AudioCodecType
  sampleRateHz?: number
  samplesPerChannel?: number
  numberOfChannels?: number
  advancedSettings?: EncodedAudioFrameAdvancedSettings
  static fromJSON(json: any): EncodedAudioFrameInfo {
    const obj = new EncodedAudioFrameInfo()
    obj.codec = json.codec
    obj.sampleRateHz = json.sampleRateHz
    obj.samplesPerChannel = json.samplesPerChannel
    obj.numberOfChannels = json.numberOfChannels
    obj.advancedSettings = EncodedAudioFrameAdvancedSettings.fromJSON(json.advancedSettings)
    return obj
  }

  toJSON() {
    return {
      codec: this.codec,
      sampleRateHz: this.sampleRateHz,
      samplesPerChannel: this.samplesPerChannel,
      numberOfChannels: this.numberOfChannels,
      advancedSettings: this.advancedSettings
    }
  }
}

export class AudioPcmDataInfo {
  samplesPerChannel?: number
  channelNum?: number
  samplesOut?: number
  elapsedTimeMs?: number
  ntpTimeMs?: number
  static fromJSON(json: any): AudioPcmDataInfo {
    const obj = new AudioPcmDataInfo()
    obj.samplesPerChannel = json.samplesPerChannel
    obj.channelNum = json.channelNum
    obj.samplesOut = json.samplesOut
    obj.elapsedTimeMs = json.elapsedTimeMs
    obj.ntpTimeMs = json.ntpTimeMs
    return obj
  }

  toJSON() {
    return {
      samplesPerChannel: this.samplesPerChannel,
      channelNum: this.channelNum,
      samplesOut: this.samplesOut,
      elapsedTimeMs: this.elapsedTimeMs,
      ntpTimeMs: this.ntpTimeMs
    }
  }
}

export enum H264PacketizeMode {
  NonInterleaved = 0,
  SingleNalUnit = 1,
}

export enum VideoStreamType {
  VideoStreamHigh = 0,
  VideoStreamLow = 1,
}

export class EncodedVideoFrameInfo {
  codecType?: VideoCodecType
  width?: number
  height?: number
  framesPerSecond?: number
  frameType?: VideoFrameType
  rotation?: VideoOrientation
  trackId?: number
  renderTimeMs?: number
  internalSendTs?: number
  uid?: number
  streamType?: VideoStreamType
  static fromJSON(json: any): EncodedVideoFrameInfo {
    const obj = new EncodedVideoFrameInfo()
    obj.codecType = json.codecType
    obj.width = json.width
    obj.height = json.height
    obj.framesPerSecond = json.framesPerSecond
    obj.frameType = json.frameType
    obj.rotation = json.rotation
    obj.trackId = json.trackId
    obj.renderTimeMs = json.renderTimeMs
    obj.internalSendTs = json.internalSendTs
    obj.uid = json.uid
    obj.streamType = json.streamType
    return obj
  }

  toJSON() {
    return {
      codecType: this.codecType,
      width: this.width,
      height: this.height,
      framesPerSecond: this.framesPerSecond,
      frameType: this.frameType,
      rotation: this.rotation,
      trackId: this.trackId,
      renderTimeMs: this.renderTimeMs,
      internalSendTs: this.internalSendTs,
      uid: this.uid,
      streamType: this.streamType
    }
  }
}

export enum VideoMirrorModeType {
  VideoMirrorModeAuto = 0,
  VideoMirrorModeEnabled = 1,
  VideoMirrorModeDisabled = 2,
}

export class VideoEncoderConfiguration {
  codecType?: VideoCodecType
  dimensions?: VideoDimensions
  frameRate?: number
  bitrate?: number
  minBitrate?: number
  orientationMode?: OrientationMode
  degradationPreference?: DegradationPreference
  mirrorMode?: VideoMirrorModeType
  static fromJSON(json: any): VideoEncoderConfiguration {
    const obj = new VideoEncoderConfiguration()
    obj.codecType = json.codecType
    obj.dimensions = VideoDimensions.fromJSON(json.dimensions)
    obj.frameRate = json.frameRate
    obj.bitrate = json.bitrate
    obj.minBitrate = json.minBitrate
    obj.orientationMode = json.orientationMode
    obj.degradationPreference = json.degradationPreference
    obj.mirrorMode = json.mirrorMode
    return obj
  }

  toJSON() {
    return {
      codecType: this.codecType,
      dimensions: this.dimensions,
      frameRate: this.frameRate,
      bitrate: this.bitrate,
      minBitrate: this.minBitrate,
      orientationMode: this.orientationMode,
      degradationPreference: this.degradationPreference,
      mirrorMode: this.mirrorMode
    }
  }
}

export class DataStreamConfig {
  syncWithAudio?: boolean
  ordered?: boolean
  static fromJSON(json: any): DataStreamConfig {
    const obj = new DataStreamConfig()
    obj.syncWithAudio = json.syncWithAudio
    obj.ordered = json.ordered
    return obj
  }

  toJSON() {
    return {
      syncWithAudio: this.syncWithAudio,
      ordered: this.ordered
    }
  }
}

export class SimulcastStreamConfig {
  dimensions?: VideoDimensions
  bitrate?: number
  framerate?: number
  static fromJSON(json: any): SimulcastStreamConfig {
    const obj = new SimulcastStreamConfig()
    obj.dimensions = VideoDimensions.fromJSON(json.dimensions)
    obj.bitrate = json.bitrate
    obj.framerate = json.framerate
    return obj
  }

  toJSON() {
    return {
      dimensions: this.dimensions,
      bitrate: this.bitrate,
      framerate: this.framerate
    }
  }
}

export class Rectangle {
  x?: number
  y?: number
  width?: number
  height?: number
  static fromJSON(json: any): Rectangle {
    const obj = new Rectangle()
    obj.x = json.x
    obj.y = json.y
    obj.width = json.width
    obj.height = json.height
    return obj
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    }
  }
}

export class WatermarkRatio {
  xRatio?: number
  yRatio?: number
  widthRatio?: number
  static fromJSON(json: any): WatermarkRatio {
    const obj = new WatermarkRatio()
    obj.xRatio = json.xRatio
    obj.yRatio = json.yRatio
    obj.widthRatio = json.widthRatio
    return obj
  }

  toJSON() {
    return {
      xRatio: this.xRatio,
      yRatio: this.yRatio,
      widthRatio: this.widthRatio
    }
  }
}

export class WatermarkOptions {
  visibleInPreview?: boolean
  positionInLandscapeMode?: Rectangle
  positionInPortraitMode?: Rectangle
  watermarkRatio?: WatermarkRatio
  mode?: WatermarkFitMode
  static fromJSON(json: any): WatermarkOptions {
    const obj = new WatermarkOptions()
    obj.visibleInPreview = json.visibleInPreview
    obj.positionInLandscapeMode = Rectangle.fromJSON(json.positionInLandscapeMode)
    obj.positionInPortraitMode = Rectangle.fromJSON(json.positionInPortraitMode)
    obj.watermarkRatio = WatermarkRatio.fromJSON(json.watermarkRatio)
    obj.mode = json.mode
    return obj
  }

  toJSON() {
    return {
      visibleInPreview: this.visibleInPreview,
      positionInLandscapeMode: this.positionInLandscapeMode,
      positionInPortraitMode: this.positionInPortraitMode,
      watermarkRatio: this.watermarkRatio,
      mode: this.mode
    }
  }
}

export class RtcStats {
  duration?: number
  txBytes?: number
  rxBytes?: number
  txAudioBytes?: number
  txVideoBytes?: number
  rxAudioBytes?: number
  rxVideoBytes?: number
  txKBitRate?: number
  rxKBitRate?: number
  rxAudioKBitRate?: number
  txAudioKBitRate?: number
  rxVideoKBitRate?: number
  txVideoKBitRate?: number
  lastmileDelay?: number
  userCount?: number
  cpuAppUsage?: number
  cpuTotalUsage?: number
  gatewayRtt?: number
  memoryAppUsageRatio?: number
  memoryTotalUsageRatio?: number
  memoryAppUsageInKbytes?: number
  connectTimeMs?: number
  firstAudioPacketDuration?: number
  firstVideoPacketDuration?: number
  firstVideoKeyFramePacketDuration?: number
  packetsBeforeFirstKeyFramePacket?: number
  firstAudioPacketDurationAfterUnmute?: number
  firstVideoPacketDurationAfterUnmute?: number
  firstVideoKeyFramePacketDurationAfterUnmute?: number
  firstVideoKeyFrameDecodedDurationAfterUnmute?: number
  firstVideoKeyFrameRenderedDurationAfterUnmute?: number
  txPacketLossRate?: number
  rxPacketLossRate?: number
  static fromJSON(json: any): RtcStats {
    const obj = new RtcStats()
    obj.duration = json.duration
    obj.txBytes = json.txBytes
    obj.rxBytes = json.rxBytes
    obj.txAudioBytes = json.txAudioBytes
    obj.txVideoBytes = json.txVideoBytes
    obj.rxAudioBytes = json.rxAudioBytes
    obj.rxVideoBytes = json.rxVideoBytes
    obj.txKBitRate = json.txKBitRate
    obj.rxKBitRate = json.rxKBitRate
    obj.rxAudioKBitRate = json.rxAudioKBitRate
    obj.txAudioKBitRate = json.txAudioKBitRate
    obj.rxVideoKBitRate = json.rxVideoKBitRate
    obj.txVideoKBitRate = json.txVideoKBitRate
    obj.lastmileDelay = json.lastmileDelay
    obj.userCount = json.userCount
    obj.cpuAppUsage = json.cpuAppUsage
    obj.cpuTotalUsage = json.cpuTotalUsage
    obj.gatewayRtt = json.gatewayRtt
    obj.memoryAppUsageRatio = json.memoryAppUsageRatio
    obj.memoryTotalUsageRatio = json.memoryTotalUsageRatio
    obj.memoryAppUsageInKbytes = json.memoryAppUsageInKbytes
    obj.connectTimeMs = json.connectTimeMs
    obj.firstAudioPacketDuration = json.firstAudioPacketDuration
    obj.firstVideoPacketDuration = json.firstVideoPacketDuration
    obj.firstVideoKeyFramePacketDuration = json.firstVideoKeyFramePacketDuration
    obj.packetsBeforeFirstKeyFramePacket = json.packetsBeforeFirstKeyFramePacket
    obj.firstAudioPacketDurationAfterUnmute = json.firstAudioPacketDurationAfterUnmute
    obj.firstVideoPacketDurationAfterUnmute = json.firstVideoPacketDurationAfterUnmute
    obj.firstVideoKeyFramePacketDurationAfterUnmute = json.firstVideoKeyFramePacketDurationAfterUnmute
    obj.firstVideoKeyFrameDecodedDurationAfterUnmute = json.firstVideoKeyFrameDecodedDurationAfterUnmute
    obj.firstVideoKeyFrameRenderedDurationAfterUnmute = json.firstVideoKeyFrameRenderedDurationAfterUnmute
    obj.txPacketLossRate = json.txPacketLossRate
    obj.rxPacketLossRate = json.rxPacketLossRate
    return obj
  }

  toJSON() {
    return {
      duration: this.duration,
      txBytes: this.txBytes,
      rxBytes: this.rxBytes,
      txAudioBytes: this.txAudioBytes,
      txVideoBytes: this.txVideoBytes,
      rxAudioBytes: this.rxAudioBytes,
      rxVideoBytes: this.rxVideoBytes,
      txKBitRate: this.txKBitRate,
      rxKBitRate: this.rxKBitRate,
      rxAudioKBitRate: this.rxAudioKBitRate,
      txAudioKBitRate: this.txAudioKBitRate,
      rxVideoKBitRate: this.rxVideoKBitRate,
      txVideoKBitRate: this.txVideoKBitRate,
      lastmileDelay: this.lastmileDelay,
      userCount: this.userCount,
      cpuAppUsage: this.cpuAppUsage,
      cpuTotalUsage: this.cpuTotalUsage,
      gatewayRtt: this.gatewayRtt,
      memoryAppUsageRatio: this.memoryAppUsageRatio,
      memoryTotalUsageRatio: this.memoryTotalUsageRatio,
      memoryAppUsageInKbytes: this.memoryAppUsageInKbytes,
      connectTimeMs: this.connectTimeMs,
      firstAudioPacketDuration: this.firstAudioPacketDuration,
      firstVideoPacketDuration: this.firstVideoPacketDuration,
      firstVideoKeyFramePacketDuration: this.firstVideoKeyFramePacketDuration,
      packetsBeforeFirstKeyFramePacket: this.packetsBeforeFirstKeyFramePacket,
      firstAudioPacketDurationAfterUnmute: this.firstAudioPacketDurationAfterUnmute,
      firstVideoPacketDurationAfterUnmute: this.firstVideoPacketDurationAfterUnmute,
      firstVideoKeyFramePacketDurationAfterUnmute: this.firstVideoKeyFramePacketDurationAfterUnmute,
      firstVideoKeyFrameDecodedDurationAfterUnmute: this.firstVideoKeyFrameDecodedDurationAfterUnmute,
      firstVideoKeyFrameRenderedDurationAfterUnmute: this.firstVideoKeyFrameRenderedDurationAfterUnmute,
      txPacketLossRate: this.txPacketLossRate,
      rxPacketLossRate: this.rxPacketLossRate
    }
  }
}

export enum VideoSourceType {
  VideoSourceCameraPrimary = 0,
  VideoSourceCamera = 0,
  VideoSourceCameraSecondary = 1,
  VideoSourceScreenPrimary = 2,
  VideoSourceScreen = 2,
  VideoSourceScreenSecondary = 3,
  VideoSourceCustom = 4,
  VideoSourceMediaPlayer = 5,
  VideoSourceRtcImagePng = 6,
  VideoSourceRtcImageJpeg = 7,
  VideoSourceRtcImageGif = 8,
  VideoSourceRemote = 9,
  VideoSourceTranscoded = 10,
  VideoSourceUnknown = 100,
}

export enum ClientRoleType {
  ClientRoleBroadcaster = 1,
  ClientRoleAudience = 2,
}

export enum QualityAdaptIndication {
  AdaptNone = 0,
  AdaptUpBandwidth = 1,
  AdaptDownBandwidth = 2,
}

export enum AudienceLatencyLevelType {
  AudienceLatencyLevelLowLatency = 1,
  AudienceLatencyLevelUltraLowLatency = 2,
  AudienceLatencyLevelHighLatency = 3,
}

export class ClientRoleOptions {
  audienceLatencyLevel?: AudienceLatencyLevelType
  static fromJSON(json: any): ClientRoleOptions {
    const obj = new ClientRoleOptions()
    obj.audienceLatencyLevel = json.audienceLatencyLevel
    return obj
  }

  toJSON() {
    return {
      audienceLatencyLevel: this.audienceLatencyLevel
    }
  }
}

export enum ExperienceQualityType {
  ExperienceQualityGood = 0,
  ExperienceQualityBad = 1,
}

export class RemoteAudioStats {
  uid?: number
  quality?: number
  networkTransportDelay?: number
  jitterBufferDelay?: number
  audioLossRate?: number
  numChannels?: number
  receivedSampleRate?: number
  receivedBitrate?: number
  totalFrozenTime?: number
  frozenRate?: number
  mosValue?: number
  totalActiveTime?: number
  publishDuration?: number
  qoeQuality?: number
  static fromJSON(json: any): RemoteAudioStats {
    const obj = new RemoteAudioStats()
    obj.uid = json.uid
    obj.quality = json.quality
    obj.networkTransportDelay = json.networkTransportDelay
    obj.jitterBufferDelay = json.jitterBufferDelay
    obj.audioLossRate = json.audioLossRate
    obj.numChannels = json.numChannels
    obj.receivedSampleRate = json.receivedSampleRate
    obj.receivedBitrate = json.receivedBitrate
    obj.totalFrozenTime = json.totalFrozenTime
    obj.frozenRate = json.frozenRate
    obj.mosValue = json.mosValue
    obj.totalActiveTime = json.totalActiveTime
    obj.publishDuration = json.publishDuration
    obj.qoeQuality = json.qoeQuality
    return obj
  }

  toJSON() {
    return {
      uid: this.uid,
      quality: this.quality,
      networkTransportDelay: this.networkTransportDelay,
      jitterBufferDelay: this.jitterBufferDelay,
      audioLossRate: this.audioLossRate,
      numChannels: this.numChannels,
      receivedSampleRate: this.receivedSampleRate,
      receivedBitrate: this.receivedBitrate,
      totalFrozenTime: this.totalFrozenTime,
      frozenRate: this.frozenRate,
      mosValue: this.mosValue,
      totalActiveTime: this.totalActiveTime,
      publishDuration: this.publishDuration,
      qoeQuality: this.qoeQuality
    }
  }
}

export enum AudioProfileType {
  AudioProfileDefault = 0,
  AudioProfileSpeechStandard = 1,
  AudioProfileMusicStandard = 2,
  AudioProfileMusicStandardStereo = 3,
  AudioProfileMusicHighQuality = 4,
  AudioProfileMusicHighQualityStereo = 5,
  AudioProfileIot = 6,
  AudioProfileNum = 7,
}

export enum AudioScenarioType {
  AudioScenarioDefault = 0,
  AudioScenarioGameStreaming = 3,
  AudioScenarioChatroom = 5,
  AudioScenarioHighDefinition = 6,
  AudioScenarioChorus = 7,
  AudioScenarioNum = 8,
}

export class VideoFormat {
  width?: number
  height?: number
  fps?: number
  static fromJSON(json: any): VideoFormat {
    const obj = new VideoFormat()
    obj.width = json.width
    obj.height = json.height
    obj.fps = json.fps
    return obj
  }

  toJSON() {
    return {
      width: this.width,
      height: this.height,
      fps: this.fps
    }
  }
}

export enum VideoContentHint {
  ContentHintNone = 0,
  ContentHintMotion = 1,
  ContentHintDetails = 2,
}

export enum LocalAudioStreamState {
  LocalAudioStreamStateStopped = 0,
  LocalAudioStreamStateRecording = 1,
  LocalAudioStreamStateEncoding = 2,
  LocalAudioStreamStateFailed = 3,
}

export enum LocalAudioStreamError {
  LocalAudioStreamErrorOk = 0,
  LocalAudioStreamErrorFailure = 1,
  LocalAudioStreamErrorDeviceNoPermission = 2,
  LocalAudioStreamErrorDeviceBusy = 3,
  LocalAudioStreamErrorRecordFailure = 4,
  LocalAudioStreamErrorEncodeFailure = 5,
}

export enum LocalVideoStreamState {
  LocalVideoStreamStateStopped = 0,
  LocalVideoStreamStateCapturing = 1,
  LocalVideoStreamStateEncoding = 2,
  LocalVideoStreamStateFailed = 3,
}

export enum LocalVideoStreamError {
  LocalVideoStreamErrorOk = 0,
  LocalVideoStreamErrorFailure = 1,
  LocalVideoStreamErrorDeviceNoPermission = 2,
  LocalVideoStreamErrorDeviceBusy = 3,
  LocalVideoStreamErrorCaptureFailure = 4,
  LocalVideoStreamErrorEncodeFailure = 5,
  LocalVideoStreamErrorCaptureInbackground = 6,
  LocalVideoStreamErrorCaptureMultipleForegroundApps = 7,
  LocalVideoStreamErrorDeviceNotFound = 8,
  LocalVideoStreamErrorDeviceDisconnected = 9,
  LocalVideoStreamErrorDeviceInvalidId = 10,
  LocalVideoStreamErrorDeviceSystemPressure = 101,
  LocalVideoStreamErrorScreenCaptureWindowMinimized = 11,
  LocalVideoStreamErrorScreenCaptureWindowClosed = 12,
  LocalVideoStreamErrorScreenCaptureWindowOccluded = 13,
  LocalVideoStreamErrorScreenCaptureWindowNotSupported = 20,
}

export enum RemoteAudioState {
  RemoteAudioStateStopped = 0,
  RemoteAudioStateStarting = 1,
  RemoteAudioStateDecoding = 2,
  RemoteAudioStateFrozen = 3,
  RemoteAudioStateFailed = 4,
}

export enum RemoteAudioStateReason {
  RemoteAudioReasonInternal = 0,
  RemoteAudioReasonNetworkCongestion = 1,
  RemoteAudioReasonNetworkRecovery = 2,
  RemoteAudioReasonLocalMuted = 3,
  RemoteAudioReasonLocalUnmuted = 4,
  RemoteAudioReasonRemoteMuted = 5,
  RemoteAudioReasonRemoteUnmuted = 6,
  RemoteAudioReasonRemoteOffline = 7,
}

export enum RemoteVideoState {
  RemoteVideoStateStopped = 0,
  RemoteVideoStateStarting = 1,
  RemoteVideoStateDecoding = 2,
  RemoteVideoStateFrozen = 3,
  RemoteVideoStateFailed = 4,
}

export enum RemoteVideoStateReason {
  RemoteVideoStateReasonInternal = 0,
  RemoteVideoStateReasonNetworkCongestion = 1,
  RemoteVideoStateReasonNetworkRecovery = 2,
  RemoteVideoStateReasonLocalMuted = 3,
  RemoteVideoStateReasonLocalUnmuted = 4,
  RemoteVideoStateReasonRemoteMuted = 5,
  RemoteVideoStateReasonRemoteUnmuted = 6,
  RemoteVideoStateReasonRemoteOffline = 7,
  RemoteVideoStateReasonAudioFallback = 8,
  RemoteVideoStateReasonAudioFallbackRecovery = 9,
  RemoteVideoStateReasonVideoStreamTypeChangeToLow = 10,
  RemoteVideoStateReasonVideoStreamTypeChangeToHigh = 11,
}

export enum RemoteUserState {
  UserStateMuteAudio = (1 << 0),
  UserStateMuteVideo = (1 << 1),
  UserStateEnableVideo = (1 << 4),
  UserStateEnableLocalVideo = (1 << 8),
}

export class VideoTrackInfo {
  isLocal?: boolean
  ownerUid?: number
  trackId?: number
  channelId?: string
  streamType?: VideoStreamType
  codecType?: VideoCodecType
  encodedFrameOnly?: boolean
  sourceType?: VideoSourceType
  observationPosition?: number
  static fromJSON(json: any): VideoTrackInfo {
    const obj = new VideoTrackInfo()
    obj.isLocal = json.isLocal
    obj.ownerUid = json.ownerUid
    obj.trackId = json.trackId
    obj.channelId = json.channelId
    obj.streamType = json.streamType
    obj.codecType = json.codecType
    obj.encodedFrameOnly = json.encodedFrameOnly
    obj.sourceType = json.sourceType
    obj.observationPosition = json.observationPosition
    return obj
  }

  toJSON() {
    return {
      isLocal: this.isLocal,
      ownerUid: this.ownerUid,
      trackId: this.trackId,
      channelId: this.channelId,
      streamType: this.streamType,
      codecType: this.codecType,
      encodedFrameOnly: this.encodedFrameOnly,
      sourceType: this.sourceType,
      observationPosition: this.observationPosition
    }
  }
}

export enum RemoteVideoDownscaleLevel {
  RemoteVideoDownscaleLevelNone = 0,
  RemoteVideoDownscaleLevel1 = 1,
  RemoteVideoDownscaleLevel2 = 2,
  RemoteVideoDownscaleLevel3 = 3,
  RemoteVideoDownscaleLevel4 = 4,
}

export class AudioVolumeInfo {
  uid?: number
  volume?: number
  vad?: number
  voicePitch?: number
  static fromJSON(json: any): AudioVolumeInfo {
    const obj = new AudioVolumeInfo()
    obj.uid = json.uid
    obj.volume = json.volume
    obj.vad = json.vad
    obj.voicePitch = json.voicePitch
    return obj
  }

  toJSON() {
    return {
      uid: this.uid,
      volume: this.volume,
      vad: this.vad,
      voicePitch: this.voicePitch
    }
  }
}

export class DeviceInfo {
  isLowLatencyAudioSupported?: boolean
  static fromJSON(json: any): DeviceInfo {
    const obj = new DeviceInfo()
    obj.isLowLatencyAudioSupported = json.isLowLatencyAudioSupported
    return obj
  }

  toJSON() {
    return {
      isLowLatencyAudioSupported: this.isLowLatencyAudioSupported
    }
  }
}

export class Packet {
  buffer?: number[]
  size?: number
  static fromJSON(json: any): Packet {
    const obj = new Packet()
    obj.buffer = json.buffer
    obj.size = json.size
    return obj
  }

  toJSON() {
    return {
      buffer: this.buffer,
      size: this.size
    }
  }
}

export abstract class IPacketObserver {
  onSendAudioPacket?(packet: Packet): boolean;

  onSendVideoPacket?(packet: Packet): boolean;

  onReceiveAudioPacket?(packet: Packet): boolean;

  onReceiveVideoPacket?(packet: Packet): boolean;
}

export abstract class IVideoEncodedImageReceiver {
  OnEncodedVideoImageReceived?(imageBuffer: number[], length: number, videoEncodedFrameInfo: EncodedVideoFrameInfo): boolean;
}

export enum AudioSampleRateType {
  AudioSampleRate32000 = 32000,
  AudioSampleRate44100 = 44100,
  AudioSampleRate48000 = 48000,
}

export enum VideoCodecTypeForStream {
  VideoCodecH264ForStream = 1,
  VideoCodecH265ForStream = 2,
}

export enum VideoCodecProfileType {
  VideoCodecProfileBaseline = 66,
  VideoCodecProfileMain = 77,
  VideoCodecProfileHigh = 100,
}

export enum AudioCodecProfileType {
  AudioCodecProfileLcAac = 0,
  AudioCodecProfileHeAac = 1,
  AudioCodecProfileHeAacV2 = 2,
}

export class LocalAudioStats {
  numChannels?: number
  sentSampleRate?: number
  sentBitrate?: number
  internalCodec?: number
  txPacketLossRate?: number
  static fromJSON(json: any): LocalAudioStats {
    const obj = new LocalAudioStats()
    obj.numChannels = json.numChannels
    obj.sentSampleRate = json.sentSampleRate
    obj.sentBitrate = json.sentBitrate
    obj.internalCodec = json.internalCodec
    obj.txPacketLossRate = json.txPacketLossRate
    return obj
  }

  toJSON() {
    return {
      numChannels: this.numChannels,
      sentSampleRate: this.sentSampleRate,
      sentBitrate: this.sentBitrate,
      internalCodec: this.internalCodec,
      txPacketLossRate: this.txPacketLossRate
    }
  }
}

export enum RtmpStreamPublishState {
  RtmpStreamPublishStateIdle = 0,
  RtmpStreamPublishStateConnecting = 1,
  RtmpStreamPublishStateRunning = 2,
  RtmpStreamPublishStateRecovering = 3,
  RtmpStreamPublishStateFailure = 4,
  RtmpStreamPublishStateDisconnecting = 5,
}

export enum RtmpStreamPublishErrorType {
  RtmpStreamPublishErrorOk = 0,
  RtmpStreamPublishErrorInvalidArgument = 1,
  RtmpStreamPublishErrorEncryptedStreamNotAllowed = 2,
  RtmpStreamPublishErrorConnectionTimeout = 3,
  RtmpStreamPublishErrorInternalServerError = 4,
  RtmpStreamPublishErrorRtmpServerError = 5,
  RtmpStreamPublishErrorTooOften = 6,
  RtmpStreamPublishErrorReachLimit = 7,
  RtmpStreamPublishErrorNotAuthorized = 8,
  RtmpStreamPublishErrorStreamNotFound = 9,
  RtmpStreamPublishErrorFormatNotSupported = 10,
  RtmpStreamPublishErrorNotBroadcaster = 11,
  RtmpStreamPublishErrorTranscodingNoMixStream = 13,
  RtmpStreamPublishErrorNetDown = 14,
  RtmpStreamPublishErrorInvalidAppid = 15,
  RtmpStreamUnpublishErrorOk = 100,
}

export enum RtmpStreamingEvent {
  RtmpStreamingEventFailedLoadImage = 1,
  RtmpStreamingEventUrlAlreadyInUse = 2,
  RtmpStreamingEventAdvancedFeatureNotSupport = 3,
  RtmpStreamingEventRequestTooOften = 4,
}

export class RtcImage {
  url?: string
  x?: number
  y?: number
  width?: number
  height?: number
  zOrder?: number
  alpha?: number
  static fromJSON(json: any): RtcImage {
    const obj = new RtcImage()
    obj.url = json.url
    obj.x = json.x
    obj.y = json.y
    obj.width = json.width
    obj.height = json.height
    obj.zOrder = json.zOrder
    obj.alpha = json.alpha
    return obj
  }

  toJSON() {
    return {
      url: this.url,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      zOrder: this.zOrder,
      alpha: this.alpha
    }
  }
}

export class LiveStreamAdvancedFeature {
  featureName?: string
  opened?: boolean
  static fromJSON(json: any): LiveStreamAdvancedFeature {
    const obj = new LiveStreamAdvancedFeature()
    obj.featureName = json.featureName
    obj.opened = json.opened
    return obj
  }

  toJSON() {
    return {
      featureName: this.featureName,
      opened: this.opened
    }
  }
}

export enum ConnectionStateType {
  ConnectionStateDisconnected = 1,
  ConnectionStateConnecting = 2,
  ConnectionStateConnected = 3,
  ConnectionStateReconnecting = 4,
  ConnectionStateFailed = 5,
}

export class TranscodingUser {
  uid?: number
  x?: number
  y?: number
  width?: number
  height?: number
  zOrder?: number
  alpha?: number
  audioChannel?: number
  static fromJSON(json: any): TranscodingUser {
    const obj = new TranscodingUser()
    obj.uid = json.uid
    obj.x = json.x
    obj.y = json.y
    obj.width = json.width
    obj.height = json.height
    obj.zOrder = json.zOrder
    obj.alpha = json.alpha
    obj.audioChannel = json.audioChannel
    return obj
  }

  toJSON() {
    return {
      uid: this.uid,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      zOrder: this.zOrder,
      alpha: this.alpha,
      audioChannel: this.audioChannel
    }
  }
}

export class LiveTranscoding {
  width?: number
  height?: number
  videoBitrate?: number
  videoFramerate?: number
  lowLatency?: boolean
  videoGop?: number
  videoCodecProfile?: VideoCodecProfileType
  backgroundColor?: number
  videoCodecType?: VideoCodecTypeForStream
  userCount?: number
  transcodingUsers?: TranscodingUser[]
  transcodingExtraInfo?: string
  metadata?: string
  watermark?: RtcImage[]
  watermarkCount?: number
  backgroundImage?: RtcImage[]
  backgroundImageCount?: number
  audioSampleRate?: AudioSampleRateType
  audioBitrate?: number
  audioChannels?: number
  audioCodecProfile?: AudioCodecProfileType
  advancedFeatures?: LiveStreamAdvancedFeature[]
  advancedFeatureCount?: number
  static fromJSON(json: any): LiveTranscoding {
    const obj = new LiveTranscoding()
    obj.width = json.width
    obj.height = json.height
    obj.videoBitrate = json.videoBitrate
    obj.videoFramerate = json.videoFramerate
    obj.lowLatency = json.lowLatency
    obj.videoGop = json.videoGop
    obj.videoCodecProfile = json.videoCodecProfile
    obj.backgroundColor = json.backgroundColor
    obj.videoCodecType = json.videoCodecType
    obj.userCount = json.userCount
    obj.transcodingUsers = json.transcodingUsers?.map((it: any) => TranscodingUser.fromJSON(it))
    obj.transcodingExtraInfo = json.transcodingExtraInfo
    obj.metadata = json.metadata
    obj.watermark = json.watermark?.map((it: any) => RtcImage.fromJSON(it))
    obj.watermarkCount = json.watermarkCount
    obj.backgroundImage = json.backgroundImage?.map((it: any) => RtcImage.fromJSON(it))
    obj.backgroundImageCount = json.backgroundImageCount
    obj.audioSampleRate = json.audioSampleRate
    obj.audioBitrate = json.audioBitrate
    obj.audioChannels = json.audioChannels
    obj.audioCodecProfile = json.audioCodecProfile
    obj.advancedFeatures = json.advancedFeatures?.map((it: any) => LiveStreamAdvancedFeature.fromJSON(it))
    obj.advancedFeatureCount = json.advancedFeatureCount
    return obj
  }

  toJSON() {
    return {
      width: this.width,
      height: this.height,
      videoBitrate: this.videoBitrate,
      videoFramerate: this.videoFramerate,
      lowLatency: this.lowLatency,
      videoGop: this.videoGop,
      videoCodecProfile: this.videoCodecProfile,
      backgroundColor: this.backgroundColor,
      videoCodecType: this.videoCodecType,
      userCount: this.userCount,
      transcodingUsers: this.transcodingUsers,
      transcodingExtraInfo: this.transcodingExtraInfo,
      metadata: this.metadata,
      watermark: this.watermark,
      watermarkCount: this.watermarkCount,
      backgroundImage: this.backgroundImage,
      backgroundImageCount: this.backgroundImageCount,
      audioSampleRate: this.audioSampleRate,
      audioBitrate: this.audioBitrate,
      audioChannels: this.audioChannels,
      audioCodecProfile: this.audioCodecProfile,
      advancedFeatures: this.advancedFeatures,
      advancedFeatureCount: this.advancedFeatureCount
    }
  }
}

export class TranscodingVideoStream {
  sourceType?: MediaSourceType
  remoteUserUid?: number
  imageUrl?: string
  x?: number
  y?: number
  width?: number
  height?: number
  zOrder?: number
  alpha?: number
  mirror?: boolean
  static fromJSON(json: any): TranscodingVideoStream {
    const obj = new TranscodingVideoStream()
    obj.sourceType = json.sourceType
    obj.remoteUserUid = json.remoteUserUid
    obj.imageUrl = json.imageUrl
    obj.x = json.x
    obj.y = json.y
    obj.width = json.width
    obj.height = json.height
    obj.zOrder = json.zOrder
    obj.alpha = json.alpha
    obj.mirror = json.mirror
    return obj
  }

  toJSON() {
    return {
      sourceType: this.sourceType,
      remoteUserUid: this.remoteUserUid,
      imageUrl: this.imageUrl,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      zOrder: this.zOrder,
      alpha: this.alpha,
      mirror: this.mirror
    }
  }
}

export class LocalTranscoderConfiguration {
  streamCount?: number
  VideoInputStreams?: TranscodingVideoStream[]
  videoOutputConfiguration?: VideoEncoderConfiguration
  static fromJSON(json: any): LocalTranscoderConfiguration {
    const obj = new LocalTranscoderConfiguration()
    obj.streamCount = json.streamCount
    obj.VideoInputStreams = json.VideoInputStreams?.map((it: any) => TranscodingVideoStream.fromJSON(it))
    obj.videoOutputConfiguration = VideoEncoderConfiguration.fromJSON(json.videoOutputConfiguration)
    return obj
  }

  toJSON() {
    return {
      streamCount: this.streamCount,
      VideoInputStreams: this.VideoInputStreams,
      videoOutputConfiguration: this.videoOutputConfiguration
    }
  }
}

export class LastmileProbeConfig {
  probeUplink?: boolean
  probeDownlink?: boolean
  expectedUplinkBitrate?: number
  expectedDownlinkBitrate?: number
  static fromJSON(json: any): LastmileProbeConfig {
    const obj = new LastmileProbeConfig()
    obj.probeUplink = json.probeUplink
    obj.probeDownlink = json.probeDownlink
    obj.expectedUplinkBitrate = json.expectedUplinkBitrate
    obj.expectedDownlinkBitrate = json.expectedDownlinkBitrate
    return obj
  }

  toJSON() {
    return {
      probeUplink: this.probeUplink,
      probeDownlink: this.probeDownlink,
      expectedUplinkBitrate: this.expectedUplinkBitrate,
      expectedDownlinkBitrate: this.expectedDownlinkBitrate
    }
  }
}

export enum LastmileProbeResultState {
  LastmileProbeResultComplete = 1,
  LastmileProbeResultIncompleteNoBwe = 2,
  LastmileProbeResultUnavailable = 3,
}

export class LastmileProbeOneWayResult {
  packetLossRate?: number
  jitter?: number
  availableBandwidth?: number
  static fromJSON(json: any): LastmileProbeOneWayResult {
    const obj = new LastmileProbeOneWayResult()
    obj.packetLossRate = json.packetLossRate
    obj.jitter = json.jitter
    obj.availableBandwidth = json.availableBandwidth
    return obj
  }

  toJSON() {
    return {
      packetLossRate: this.packetLossRate,
      jitter: this.jitter,
      availableBandwidth: this.availableBandwidth
    }
  }
}

export class LastmileProbeResult {
  state?: LastmileProbeResultState
  uplinkReport?: LastmileProbeOneWayResult
  downlinkReport?: LastmileProbeOneWayResult
  rtt?: number
  static fromJSON(json: any): LastmileProbeResult {
    const obj = new LastmileProbeResult()
    obj.state = json.state
    obj.uplinkReport = LastmileProbeOneWayResult.fromJSON(json.uplinkReport)
    obj.downlinkReport = LastmileProbeOneWayResult.fromJSON(json.downlinkReport)
    obj.rtt = json.rtt
    return obj
  }

  toJSON() {
    return {
      state: this.state,
      uplinkReport: this.uplinkReport,
      downlinkReport: this.downlinkReport,
      rtt: this.rtt
    }
  }
}

export enum ConnectionChangedReasonType {
  ConnectionChangedConnecting = 0,
  ConnectionChangedJoinSuccess = 1,
  ConnectionChangedInterrupted = 2,
  ConnectionChangedBannedByServer = 3,
  ConnectionChangedJoinFailed = 4,
  ConnectionChangedLeaveChannel = 5,
  ConnectionChangedInvalidAppId = 6,
  ConnectionChangedInvalidChannelName = 7,
  ConnectionChangedInvalidToken = 8,
  ConnectionChangedTokenExpired = 9,
  ConnectionChangedRejectedByServer = 10,
  ConnectionChangedSettingProxyServer = 11,
  ConnectionChangedRenewToken = 12,
  ConnectionChangedClientIpAddressChanged = 13,
  ConnectionChangedKeepAliveTimeout = 14,
  ConnectionChangedRejoinSuccess = 15,
  ConnectionChangedLost = 16,
  ConnectionChangedEchoTest = 17,
  ConnectionChangedClientIpAddressChangedByUser = 18,
  ConnectionChangedSameUidLogin = 19,
  ConnectionChangedTooManyBroadcasters = 20,
}

export enum ClientRoleChangeFailedReason {
  ClientRoleChangeFailedTooManyBroadcasters = 1,
  ClientRoleChangeFailedNotAuthorized = 2,
  ClientRoleChangeFailedRequestTimeOut = 3,
  ClientRoleChangeFailedConnectionFailed = 4,
}

export enum NetworkType {
  NetworkTypeUnknown = -1,
  NetworkTypeDisconnected = 0,
  NetworkTypeLan = 1,
  NetworkTypeWifi = 2,
  NetworkTypeMobile2g = 3,
  NetworkTypeMobile3g = 4,
  NetworkTypeMobile4g = 5,
}

export enum VideoViewSetupMode {
  VideoViewSetupReplace = 0,
  VideoViewSetupAdd = 1,
  VideoViewSetupRemove = 2,
}

export class VideoCanvas {
  view?: any
  renderMode?: RenderModeType
  mirrorMode?: VideoMirrorModeType
  uid?: number
  isScreenView?: boolean
  priv?: number[]
  privSize?: number
  sourceType?: VideoSourceType
  cropArea?: Rectangle
  setupMode?: VideoViewSetupMode
  static fromJSON(json: any): VideoCanvas {
    const obj = new VideoCanvas()
    obj.view = json.view
    obj.renderMode = json.renderMode
    obj.mirrorMode = json.mirrorMode
    obj.uid = json.uid
    obj.isScreenView = json.isScreenView
    obj.priv = json.priv
    obj.privSize = json.priv_size
    obj.sourceType = json.sourceType
    obj.cropArea = Rectangle.fromJSON(json.cropArea)
    obj.setupMode = json.setupMode
    return obj
  }

  toJSON() {
    return {
      view: this.view,
      renderMode: this.renderMode,
      mirrorMode: this.mirrorMode,
      uid: this.uid,
      isScreenView: this.isScreenView,
      priv_size: this.privSize,
      sourceType: this.sourceType,
      cropArea: this.cropArea,
      setupMode: this.setupMode
    }
  }
}

export enum LighteningContrastLevel {
  LighteningContrastLow = 0,
  LighteningContrastNormal = 1,
  LighteningContrastHigh = 2,
}

export class BeautyOptions {
  lighteningContrastLevel?: LighteningContrastLevel
  lighteningLevel?: number
  smoothnessLevel?: number
  rednessLevel?: number
  sharpnessLevel?: number
  static fromJSON(json: any): BeautyOptions {
    const obj = new BeautyOptions()
    obj.lighteningContrastLevel = json.lighteningContrastLevel
    obj.lighteningLevel = json.lighteningLevel
    obj.smoothnessLevel = json.smoothnessLevel
    obj.rednessLevel = json.rednessLevel
    obj.sharpnessLevel = json.sharpnessLevel
    return obj
  }

  toJSON() {
    return {
      lighteningContrastLevel: this.lighteningContrastLevel,
      lighteningLevel: this.lighteningLevel,
      smoothnessLevel: this.smoothnessLevel,
      rednessLevel: this.rednessLevel,
      sharpnessLevel: this.sharpnessLevel
    }
  }
}

export enum BackgroundSourceType {
  BackgroundColor = 1,
  BackgroundImg = 2,
  BackgroundBlur = 3,
}

export enum BackgroundBlurDegree {
  BlurDegreeLow = 1,
  BlurDegreeMedium = 2,
  BlurDegreeHigh = 3,
}

export class VirtualBackgroundSource {
  backgroundSourceType?: BackgroundSourceType
  color?: number
  source?: string
  blurDegree?: BackgroundBlurDegree
  static fromJSON(json: any): VirtualBackgroundSource {
    const obj = new VirtualBackgroundSource()
    obj.backgroundSourceType = json.background_source_type
    obj.color = json.color
    obj.source = json.source
    obj.blurDegree = json.blur_degree
    return obj
  }

  toJSON() {
    return {
      background_source_type: this.backgroundSourceType,
      color: this.color,
      source: this.source,
      blur_degree: this.blurDegree
    }
  }
}

export class FishCorrectionParams {
  XCenter?: number
  YCenter?: number
  ScaleFactor?: number
  FocalLength?: number
  PolFocalLength?: number
  SplitHeight?: number
  Ss?: number[]
  static fromJSON(json: any): FishCorrectionParams {
    const obj = new FishCorrectionParams()
    obj.XCenter = json._x_center
    obj.YCenter = json._y_center
    obj.ScaleFactor = json._scale_factor
    obj.FocalLength = json._focal_length
    obj.PolFocalLength = json._pol_focal_length
    obj.SplitHeight = json._split_height
    obj.Ss = json._ss
    return obj
  }

  toJSON() {
    return {
      _x_center: this.XCenter,
      _y_center: this.YCenter,
      _scale_factor: this.ScaleFactor,
      _focal_length: this.FocalLength,
      _pol_focal_length: this.PolFocalLength,
      _split_height: this.SplitHeight,
      _ss: this.Ss
    }
  }
}

export enum VoiceBeautifierPreset {
  VoiceBeautifierOff = 0x00000000,
  ChatBeautifierMagnetic = 0x01010100,
  ChatBeautifierFresh = 0x01010200,
  ChatBeautifierVitality = 0x01010300,
  SingingBeautifier = 0x01020100,
  TimbreTransformationVigorous = 0x01030100,
  TimbreTransformationDeep = 0x01030200,
  TimbreTransformationMellow = 0x01030300,
  TimbreTransformationFalsetto = 0x01030400,
  TimbreTransformationFull = 0x01030500,
  TimbreTransformationClear = 0x01030600,
  TimbreTransformationResounding = 0x01030700,
  TimbreTransformationRinging = 0x01030800,
  UltraHighQualityVoice = 0x01040100,
}

export enum AudioEffectPreset {
  AudioEffectOff = 0x00000000,
  RoomAcousticsKtv = 0x02010100,
  RoomAcousticsVocalConcert = 0x02010200,
  RoomAcousticsStudio = 0x02010300,
  RoomAcousticsPhonograph = 0x02010400,
  RoomAcousticsVirtualStereo = 0x02010500,
  RoomAcousticsSpacial = 0x02010600,
  RoomAcousticsEthereal = 0x02010700,
  RoomAcoustics3dVoice = 0x02010800,
  VoiceChangerEffectUncle = 0x02020100,
  VoiceChangerEffectOldman = 0x02020200,
  VoiceChangerEffectBoy = 0x02020300,
  VoiceChangerEffectSister = 0x02020400,
  VoiceChangerEffectGirl = 0x02020500,
  VoiceChangerEffectPigking = 0x02020600,
  VoiceChangerEffectHulk = 0x02020700,
  StyleTransformationRnb = 0x02030100,
  StyleTransformationPopular = 0x02030200,
  PitchCorrection = 0x02040100,
}

export enum VoiceConversionPreset {
  VoiceConversionOff = 0x00000000,
  VoiceChangerNeutral = 0x03010100,
  VoiceChangerSweet = 0x03010200,
  VoiceChangerSolid = 0x03010300,
  VoiceChangerBass = 0x03010400,
}

export class ScreenCaptureParameters {
  dimensions?: VideoDimensions
  frameRate?: number
  bitrate?: number
  captureMouseCursor?: boolean
  windowFocus?: boolean
  excludeWindowList?: any[]
  excludeWindowCount?: number
  static fromJSON(json: any): ScreenCaptureParameters {
    const obj = new ScreenCaptureParameters()
    obj.dimensions = VideoDimensions.fromJSON(json.dimensions)
    obj.frameRate = json.frameRate
    obj.bitrate = json.bitrate
    obj.captureMouseCursor = json.captureMouseCursor
    obj.windowFocus = json.windowFocus
    obj.excludeWindowList = json.excludeWindowList
    obj.excludeWindowCount = json.excludeWindowCount
    return obj
  }

  toJSON() {
    return {
      dimensions: this.dimensions,
      frameRate: this.frameRate,
      bitrate: this.bitrate,
      captureMouseCursor: this.captureMouseCursor,
      windowFocus: this.windowFocus,
      excludeWindowList: this.excludeWindowList,
      excludeWindowCount: this.excludeWindowCount
    }
  }
}

export enum AudioRecordingQualityType {
  AudioRecordingQualityLow = 0,
  AudioRecordingQualityMedium = 1,
  AudioRecordingQualityHigh = 2,
}

export enum AudioFileRecordingType {
  AudioFileRecordingMic = 1,
  AudioFileRecordingPlayback = 2,
  AudioFileRecordingMixed = 3,
}

export enum AudioEncodedFrameObserverPosition {
  AudioEncodedFrameObserverPositionRecord = 1,
  AudioEncodedFrameObserverPositionPlayback = 2,
  AudioEncodedFrameObserverPositionMixed = 3,
}

export class AudioRecordingConfiguration {
  filePath?: string
  encode?: boolean
  sampleRate?: number
  fileRecordingType?: AudioFileRecordingType
  quality?: AudioRecordingQualityType
  static fromJSON(json: any): AudioRecordingConfiguration {
    const obj = new AudioRecordingConfiguration()
    obj.filePath = json.filePath
    obj.encode = json.encode
    obj.sampleRate = json.sampleRate
    obj.fileRecordingType = json.fileRecordingType
    obj.quality = json.quality
    return obj
  }

  toJSON() {
    return {
      filePath: this.filePath,
      encode: this.encode,
      sampleRate: this.sampleRate,
      fileRecordingType: this.fileRecordingType,
      quality: this.quality
    }
  }
}

export class AudioEncodedFrameObserverConfig {
  postionType?: AudioEncodedFrameObserverPosition
  encodingType?: AudioEncodingType
  static fromJSON(json: any): AudioEncodedFrameObserverConfig {
    const obj = new AudioEncodedFrameObserverConfig()
    obj.postionType = json.postionType
    obj.encodingType = json.encodingType
    return obj
  }

  toJSON() {
    return {
      postionType: this.postionType,
      encodingType: this.encodingType
    }
  }
}

export abstract class IAudioEncodedFrameObserver {
  OnRecordAudioEncodedFrame?(frameBuffer: number[], length: number, audioEncodedFrameInfo: EncodedAudioFrameInfo): void;

  OnPlaybackAudioEncodedFrame?(frameBuffer: number[], length: number, audioEncodedFrameInfo: EncodedAudioFrameInfo): void;

  OnMixedAudioEncodedFrame?(frameBuffer: number[], length: number, audioEncodedFrameInfo: EncodedAudioFrameInfo): void;
}

export enum AreaCode {
  AreaCodeCn = 0x00000001,
  AreaCodeNa = 0x00000002,
  AreaCodeEu = 0x00000004,
  AreaCodeAs = 0x00000008,
  AreaCodeJp = 0x00000010,
  AreaCodeIn = 0x00000020,
  AreaCodeGlob = (0xFFFFFFFF),
}

export enum AreaCodeEx {
  AreaCodeOc = 0x00000040,
  AreaCodeSa = 0x00000080,
  AreaCodeAf = 0x00000100,
  AreaCodeKr = 0x00000200,
  AreaCodeOvs = 0xFFFFFFFE,
}

export enum ChannelMediaRelayError {
  RelayOk = 0,
  RelayErrorServerErrorResponse = 1,
  RelayErrorServerNoResponse = 2,
  RelayErrorNoResourceAvailable = 3,
  RelayErrorFailedJoinSrc = 4,
  RelayErrorFailedJoinDest = 5,
  RelayErrorFailedPacketReceivedFromSrc = 6,
  RelayErrorFailedPacketSentToDest = 7,
  RelayErrorServerConnectionLost = 8,
  RelayErrorInternalError = 9,
  RelayErrorSrcTokenExpired = 10,
  RelayErrorDestTokenExpired = 11,
}

export enum ChannelMediaRelayEvent {
  RelayEventNetworkDisconnected = 0,
  RelayEventNetworkConnected = 1,
  RelayEventPacketJoinedSrcChannel = 2,
  RelayEventPacketJoinedDestChannel = 3,
  RelayEventPacketSentToDestChannel = 4,
  RelayEventPacketReceivedVideoFromSrc = 5,
  RelayEventPacketReceivedAudioFromSrc = 6,
  RelayEventPacketUpdateDestChannel = 7,
  RelayEventPacketUpdateDestChannelRefused = 8,
  RelayEventPacketUpdateDestChannelNotChange = 9,
  RelayEventPacketUpdateDestChannelIsNull = 10,
  RelayEventVideoProfileUpdate = 11,
  RelayEventPauseSendPacketToDestChannelSuccess = 12,
  RelayEventPauseSendPacketToDestChannelFailed = 13,
  RelayEventResumeSendPacketToDestChannelSuccess = 14,
  RelayEventResumeSendPacketToDestChannelFailed = 15,
}

export enum ChannelMediaRelayState {
  RelayStateIdle = 0,
  RelayStateConnecting = 1,
  RelayStateRunning = 2,
  RelayStateFailure = 3,
}

export class ChannelMediaInfo {
  channelName?: string
  token?: string
  uid?: number
  static fromJSON(json: any): ChannelMediaInfo {
    const obj = new ChannelMediaInfo()
    obj.channelName = json.channelName
    obj.token = json.token
    obj.uid = json.uid
    return obj
  }

  toJSON() {
    return {
      channelName: this.channelName,
      token: this.token,
      uid: this.uid
    }
  }
}

export class ChannelMediaRelayConfiguration {
  srcInfo?: ChannelMediaInfo
  destInfos?: ChannelMediaInfo[]
  destCount?: number
  static fromJSON(json: any): ChannelMediaRelayConfiguration {
    const obj = new ChannelMediaRelayConfiguration()
    obj.srcInfo = ChannelMediaInfo.fromJSON(json.srcInfo)
    obj.destInfos = json.destInfos?.map((it: any) => ChannelMediaInfo.fromJSON(it))
    obj.destCount = json.destCount
    return obj
  }

  toJSON() {
    return {
      srcInfo: this.srcInfo,
      destInfos: this.destInfos,
      destCount: this.destCount
    }
  }
}

export class UplinkNetworkInfo {
  videoEncoderTargetBitrateBps?: number
  static fromJSON(json: any): UplinkNetworkInfo {
    const obj = new UplinkNetworkInfo()
    obj.videoEncoderTargetBitrateBps = json.video_encoder_target_bitrate_bps
    return obj
  }

  toJSON() {
    return {
      video_encoder_target_bitrate_bps: this.videoEncoderTargetBitrateBps
    }
  }
}

export class PeerDownlinkInfo {
  uid?: string
  streamType?: VideoStreamType
  currentDownscaleLevel?: RemoteVideoDownscaleLevel
  expectedBitrateBps?: number
  static fromJSON(json: any): PeerDownlinkInfo {
    const obj = new PeerDownlinkInfo()
    obj.uid = json.uid
    obj.streamType = json.stream_type
    obj.currentDownscaleLevel = json.current_downscale_level
    obj.expectedBitrateBps = json.expected_bitrate_bps
    return obj
  }

  toJSON() {
    return {
      uid: this.uid,
      stream_type: this.streamType,
      current_downscale_level: this.currentDownscaleLevel,
      expected_bitrate_bps: this.expectedBitrateBps
    }
  }
}

export class DownlinkNetworkInfo {
  lastmileBufferDelayTimeMs?: number
  bandwidthEstimationBps?: number
  totalDownscaleLevelCount?: number
  peerDownlinkInfo?: PeerDownlinkInfo[]
  totalReceivedVideoCount?: number
  static fromJSON(json: any): DownlinkNetworkInfo {
    const obj = new DownlinkNetworkInfo()
    obj.lastmileBufferDelayTimeMs = json.lastmile_buffer_delay_time_ms
    obj.bandwidthEstimationBps = json.bandwidth_estimation_bps
    obj.totalDownscaleLevelCount = json.total_downscale_level_count
    obj.peerDownlinkInfo = json.peer_downlink_info?.map((it: any) => PeerDownlinkInfo.fromJSON(it))
    obj.totalReceivedVideoCount = json.total_received_video_count
    return obj
  }

  toJSON() {
    return {
      lastmile_buffer_delay_time_ms: this.lastmileBufferDelayTimeMs,
      bandwidth_estimation_bps: this.bandwidthEstimationBps,
      total_downscale_level_count: this.totalDownscaleLevelCount,
      peer_downlink_info: this.peerDownlinkInfo,
      total_received_video_count: this.totalReceivedVideoCount
    }
  }
}

export enum EncryptionMode {
  Aes128Xts = 1,
  Aes128Ecb = 2,
  Aes256Xts = 3,
  Sm4128Ecb = 4,
  Aes128Gcm = 5,
  Aes256Gcm = 6,
  Aes128Gcm2 = 7,
  Aes256Gcm2 = 8,
  ModeEnd = 9,
}

export class EncryptionConfig {
  encryptionMode?: EncryptionMode
  encryptionKey?: string
  encryptionKdfSalt?: number[]
  static fromJSON(json: any): EncryptionConfig {
    const obj = new EncryptionConfig()
    obj.encryptionMode = json.encryptionMode
    obj.encryptionKey = json.encryptionKey
    obj.encryptionKdfSalt = json.encryptionKdfSalt
    return obj
  }

  toJSON() {
    return {
      encryptionMode: this.encryptionMode,
      encryptionKey: this.encryptionKey
    }
  }
}

export enum EncryptionErrorType {
  EncryptionErrorInternalFailure = 0,
  EncryptionErrorDecryptionFailure = 1,
  EncryptionErrorEncryptionFailure = 2,
}

export enum UploadErrorReason {
  UploadSuccess = 0,
  UploadNetError = 1,
  UploadServerError = 2,
}

export enum PermissionType {
  RecordAudio = 0,
  CAMERA = 1,
}

export enum MaxUserAccountLengthType {
  MaxUserAccountLength = 256,
}

export enum StreamSubscribeState {
  SubStateIdle = 0,
  SubStateNoSubscribed = 1,
  SubStateSubscribing = 2,
  SubStateSubscribed = 3,
}

export enum StreamPublishState {
  PubStateIdle = 0,
  PubStateNoPublished = 1,
  PubStatePublishing = 2,
  PubStatePublished = 3,
}

export class UserInfo {
  uid?: number
  userAccount?: string
  static fromJSON(json: any): UserInfo {
    const obj = new UserInfo()
    obj.uid = json.uid
    obj.userAccount = json.userAccount
    return obj
  }

  toJSON() {
    return {
      uid: this.uid,
      userAccount: this.userAccount
    }
  }
}

export enum EarMonitoringFilterType {
  EarMonitoringFilterNone = (1 << 0),
  EarMonitoringFilterBuiltInAudioFilters = (1 << 1),
  EarMonitoringFilterNoiseSuppression = (1 << 2),
}

export enum ThreadPriorityType {
  LOWEST = 0,
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
  HIGHEST = 4,
  CRITICAL = 5,
}

export abstract class LicenseCallback {
  onCertificateRequired?(): void;

  onLicenseRequest?(): void;

  onLicenseValidated?(): void;

  onLicenseError?(result: number): void;
}

export class SpatialAudioParams {
  speakerAzimuth?: number
  speakerElevation?: number
  speakerDistance?: number
  speakerOrientation?: number
  enableBlur?: boolean
  enableAirAbsorb?: boolean
  static fromJSON(json: any): SpatialAudioParams {
    const obj = new SpatialAudioParams()
    obj.speakerAzimuth = json.speaker_azimuth
    obj.speakerElevation = json.speaker_elevation
    obj.speakerDistance = json.speaker_distance
    obj.speakerOrientation = json.speaker_orientation
    obj.enableBlur = json.enable_blur
    obj.enableAirAbsorb = json.enable_air_absorb
    return obj
  }

  toJSON() {
    return {
      speaker_azimuth: this.speakerAzimuth,
      speaker_elevation: this.speakerElevation,
      speaker_distance: this.speakerDistance,
      speaker_orientation: this.speakerOrientation,
      enable_blur: this.enableBlur,
      enable_air_absorb: this.enableAirAbsorb
    }
  }
}
