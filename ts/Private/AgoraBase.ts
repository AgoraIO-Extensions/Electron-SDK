import './extension/AgoraBaseExtension';
import { RenderModeType, VideoSourceType } from './AgoraMediaBase';

/**
 * Channel scenarios.
 */
export enum ChannelProfileType {
  /**
   * 0: Communication scenario. Agora recommends using the live broadcasting scenario for better audio and video experience.
   */
  ChannelProfileCommunication = 0,
  /**
   * 1: (Default) Live broadcasting scenario.
   */
  ChannelProfileLiveBroadcasting = 1,
  /**
   * 2: Gaming scenario. Deprecated: Use ChannelProfileLiveBroadcasting instead.
   */
  ChannelProfileGame = 2,
  /**
   * 3: Interactive scenario. This scenario is optimized for latency. If your scenario involves frequent user interaction, it is recommended to use this one. Deprecated: Use ChannelProfileLiveBroadcasting instead.
   */
  ChannelProfileCloudGaming = 3,
  /**
   * @ignore
   */
  ChannelProfileCommunication1v1 = 4,
}

/**
 * @ignore
 */
export enum WarnCodeType {
  /**
   * @ignore
   */
  WarnInvalidView = 8,
  /**
   * @ignore
   */
  WarnInitVideo = 16,
  /**
   * @ignore
   */
  WarnPending = 20,
  /**
   * @ignore
   */
  WarnNoAvailableChannel = 103,
  /**
   * @ignore
   */
  WarnLookupChannelTimeout = 104,
  /**
   * @ignore
   */
  WarnLookupChannelRejected = 105,
  /**
   * @ignore
   */
  WarnOpenChannelTimeout = 106,
  /**
   * @ignore
   */
  WarnOpenChannelRejected = 107,
  /**
   * @ignore
   */
  WarnSwitchLiveVideoTimeout = 111,
  /**
   * @ignore
   */
  WarnSetClientRoleTimeout = 118,
  /**
   * @ignore
   */
  WarnOpenChannelInvalidTicket = 121,
  /**
   * @ignore
   */
  WarnOpenChannelTryNextVos = 122,
  /**
   * @ignore
   */
  WarnChannelConnectionUnrecoverable = 131,
  /**
   * @ignore
   */
  WarnChannelConnectionIpChanged = 132,
  /**
   * @ignore
   */
  WarnChannelConnectionPortChanged = 133,
  /**
   * @ignore
   */
  WarnChannelSocketError = 134,
  /**
   * @ignore
   */
  WarnAudioMixingOpenError = 701,
  /**
   * @ignore
   */
  WarnAdmRuntimePlayoutWarning = 1014,
  /**
   * @ignore
   */
  WarnAdmRuntimeRecordingWarning = 1016,
  /**
   * @ignore
   */
  WarnAdmRecordAudioSilence = 1019,
  /**
   * @ignore
   */
  WarnAdmPlayoutMalfunction = 1020,
  /**
   * @ignore
   */
  WarnAdmRecordMalfunction = 1021,
  /**
   * @ignore
   */
  WarnAdmRecordAudioLowlevel = 1031,
  /**
   * @ignore
   */
  WarnAdmPlayoutAudioLowlevel = 1032,
  /**
   * @ignore
   */
  WarnAdmWindowsNoDataReadyEvent = 1040,
  /**
   * @ignore
   */
  WarnApmHowling = 1051,
  /**
   * @ignore
   */
  WarnAdmGlitchState = 1052,
  /**
   * @ignore
   */
  WarnAdmImproperSettings = 1053,
  /**
   * @ignore
   */
  WarnAdmWinCoreNoRecordingDevice = 1322,
  /**
   * @ignore
   */
  WarnAdmWinCoreNoPlayoutDevice = 1323,
  /**
   * @ignore
   */
  WarnAdmWinCoreImproperCaptureRelease = 1324,
}

/**
 * Error codes.
 *
 * Error codes indicate that the SDK has encountered an unrecoverable error and requires intervention from the application. For example, an error is returned when the camera fails to open, and the app needs to prompt the user that the camera cannot be used.
 */
export enum ErrorCodeType {
  /**
   * 0: No error.
   */
  ErrOk = 0,
  /**
   * 1: A general error (no specific classification of the error cause). Please try calling the method again.
   */
  ErrFailed = 1,
  /**
   * 2: An invalid parameter was set in the method. For example, the specified channel name contains illegal characters. Please reset the parameter.
   */
  ErrInvalidArgument = 2,
  /**
   * 3: The SDK is not ready. Possible reasons: IRtcEngine failed to initialize. Please reinitialize IRtcEngine.
   *  The user has not joined the channel when calling the method. Please check the method call logic.
   *  The user has not left the channel when calling the rate or complain method. Please check the method call logic.
   *  The audio module is not enabled.
   *  The assembly is incomplete.
   */
  ErrNotReady = 3,
  /**
   * 4: The current state of IRtcEngine does not support this operation. Possible reasons:
   *  When using built-in encryption, the encryption mode is incorrect, or loading the external encryption library failed. Please check whether the encryption enum value is correct or reload the external encryption library.
   */
  ErrNotSupported = 4,
  /**
   * 5: This method call was rejected. Possible reasons: IRtcEngine failed to initialize. Please reinitialize IRtcEngine.
   *  The channel name was set to an empty string "" when joining the channel. Please reset the channel name.
   *  In multi-channel scenarios, the channel name already exists when calling joinChannelEx to join a channel. Please reset the channel name.
   */
  ErrRefused = 5,
  /**
   * 6: The buffer size is insufficient to store the returned data.
   */
  ErrBufferTooSmall = 6,
  /**
   * 7: The method was called before IRtcEngine was initialized. Please ensure that the IRtcEngine object is created and initialized before calling this method.
   */
  ErrNotInitialized = 7,
  /**
   * 8: The current state is invalid.
   */
  ErrInvalidState = 8,
  /**
   * 9: No permission to operate. Please check whether the user has granted the app permission to use audio and video devices.
   */
  ErrNoPermission = 9,
  /**
   * 10: Method call timed out. Some method calls require a response from the SDK. If the SDK takes too long to process the event and does not return within 10 seconds, this error occurs.
   */
  ErrTimedout = 10,
  /**
   * @ignore
   */
  ErrCanceled = 11,
  /**
   * @ignore
   */
  ErrTooOften = 12,
  /**
   * @ignore
   */
  ErrBindSocket = 13,
  /**
   * @ignore
   */
  ErrNetDown = 14,
  /**
   * 17: Joining the channel was rejected. Possible reasons:
   *  The user is already in the channel. It is recommended to determine whether the user is in the channel via the onConnectionStateChanged callback. Do not call this method again to join the channel unless receiving the ConnectionStateDisconnected (1) state.
   *  The user attempted to join the channel without calling stopEchoTest after initiating a call test with startEchoTest. After starting a call test, you must call stopEchoTest to end the current test before joining the channel.
   */
  ErrJoinChannelRejected = 17,
  /**
   * 18: Failed to leave the channel. Possible reasons:
   *  The user has already left the channel before calling leaveChannel. Stop calling this method.
   *  The user called leaveChannel before joining the channel. No additional action is needed in this case.
   */
  ErrLeaveChannelRejected = 18,
  /**
   * 19: The resource is already in use and cannot be reused.
   */
  ErrAlreadyInUse = 19,
  /**
   * 20: The SDK aborted the request, possibly due to too many requests.
   */
  ErrAborted = 20,
  /**
   * 21: On Windows, specific firewall settings caused IRtcEngine to fail initialization and crash.
   */
  ErrInitNetEngine = 21,
  /**
   * 22: The SDK failed to allocate resources, possibly because the app is using too many resources or system resources are exhausted.
   */
  ErrResourceLimited = 22,
  /**
   * 101: Invalid App ID. Please use a valid App ID to rejoin the channel.
   */
  ErrInvalidAppId = 101,
  /**
   * 102: Invalid channel name. Possible reason is an incorrect data type for the parameter. Please use a valid channel name to rejoin the channel.
   */
  ErrInvalidChannelName = 102,
  /**
   * 103: Unable to obtain server resources in the current region. Try specifying another region when initializing IRtcEngine.
   */
  ErrNoServerResources = 103,
  /**
   * 109: The current Token has expired and is no longer valid. Please request a new Token from your server and call renewToken to update the Token. Deprecated: This enum is deprecated. Use the ConnectionChangedTokenExpired (9) in the onConnectionStateChanged callback instead.
   */
  ErrTokenExpired = 109,
  /**
   * Deprecated: This enum is deprecated. Use the ConnectionChangedInvalidToken (8) in the onConnectionStateChanged callback instead. 110: Invalid Token. Common reasons:
   *  App certificate is enabled in the console, but App ID + Token authentication is not used. When the project has App certificate enabled, Token authentication must be used.
   *  The uid field used when generating the Token does not match the uid used when joining the channel.
   */
  ErrInvalidToken = 110,
  /**
   * 111: Network connection interrupted. After the SDK establishes a connection with the server, it loses the network connection for more than 4 seconds.
   */
  ErrConnectionInterrupted = 111,
  /**
   * 112: Network connection lost. The network is disconnected and the SDK fails to reconnect to the server within 10 seconds.
   */
  ErrConnectionLost = 112,
  /**
   * 113: The user is not in the channel when calling the sendStreamMessage method.
   */
  ErrNotInChannel = 113,
  /**
   * 114: The data length exceeds 1 KB when calling sendStreamMessage.
   */
  ErrSizeTooLarge = 114,
  /**
   * 115: The data sending frequency exceeds the limit (6 KB/s) when calling sendStreamMessage.
   */
  ErrBitrateLimit = 115,
  /**
   * 116: The number of data streams created exceeds the limit (5 streams) when calling createDataStream.
   */
  ErrTooManyDataStreams = 116,
  /**
   * 117: Data stream sending timed out.
   */
  ErrStreamMessageTimeout = 117,
  /**
   * 119: Failed to switch user role. Please try rejoining the channel.
   */
  ErrSetClientRoleNotAuthorized = 119,
  /**
   * 120: Media stream decryption failed. Possibly due to an incorrect key used when the user joined the channel. Please check the key entered when joining the channel or guide the user to try rejoining the channel.
   */
  ErrDecryptionFailed = 120,
  /**
   * 121: Invalid user ID.
   */
  ErrInvalidUserId = 121,
  /**
   * 122: Data stream decryption failed. Possibly due to an incorrect key used when the user joined the channel. Please check the key entered when joining the channel or guide the user to try rejoining the channel.
   */
  ErrDatastreamDecryptionFailed = 122,
  /**
   * 123: The user is banned by the server.
   */
  ErrClientIsBannedByServer = 123,
  /**
   * 130: The SDK does not support pushing encrypted streams to the CDN.
   */
  ErrEncryptedStreamNotAllowedPublish = 130,
  /**
   * @ignore
   */
  ErrLicenseCredentialInvalid = 131,
  /**
   * 134: Invalid user account, possibly due to invalid parameters.
   */
  ErrInvalidUserAccount = 134,
  /**
   * @ignore
   */
  ErrModuleNotFound = 157,
  /**
   * 1001: Failed to load media engine.
   */
  ErrCertRaw = 157,
  /**
   * @ignore
   */
  ErrCertJsonPart = 158,
  /**
   * @ignore
   */
  ErrCertJsonInval = 159,
  /**
   * @ignore
   */
  ErrCertJsonNomem = 160,
  /**
   * @ignore
   */
  ErrCertCustom = 161,
  /**
   * @ignore
   */
  ErrCertCredential = 162,
  /**
   * @ignore
   */
  ErrCertSign = 163,
  /**
   * @ignore
   */
  ErrCertFail = 164,
  /**
   * @ignore
   */
  ErrCertBuf = 165,
  /**
   * @ignore
   */
  ErrCertNull = 166,
  /**
   * @ignore
   */
  ErrCertDuedate = 167,
  /**
   * @ignore
   */
  ErrCertRequest = 168,
  /**
   * 200: Unsupported PCM format.
   */
  ErrPcmsendFormat = 200,
  /**
   * 201: Buffer overflow due to PCM sending rate being too fast.
   */
  ErrPcmsendBufferoverflow = 201,
  /**
   * @ignore
   */
  ErrLoginAlreadyLogin = 428,
  /**
   * @ignore
   */
  ErrLoadMediaEngine = 1001,
  /**
   * 1005: Audio device error (unspecified). Please check whether the audio device is occupied by another application or try rejoining the channel.
   */
  ErrAdmGeneralError = 1005,
  /**
   * 1008: Failed to initialize playback device. Please check whether the playback device is occupied by another application or try rejoining the channel.
   */
  ErrAdmInitPlayout = 1008,
  /**
   * 1009: Failed to start playback device. Please check whether the playback device is functioning properly.
   */
  ErrAdmStartPlayout = 1009,
  /**
   * 1010: Failed to stop playback device.
   */
  ErrAdmStopPlayout = 1010,
  /**
   * 1011: Failed to initialize recording device. Please check whether the recording device is functioning properly or try rejoining the channel.
   */
  ErrAdmInitRecording = 1011,
  /**
   * 1012: Failed to start recording device. Please check whether the recording device is functioning properly.
   */
  ErrAdmStartRecording = 1012,
  /**
   * 1013: Failed to stop recording device.
   */
  ErrAdmStopRecording = 1013,
  /**
   * 1501: No permission to use the camera. Please check whether camera permission is enabled.
   */
  ErrVdmCameraNotAuthorized = 1501,
  /**
   * @ignore
   */
  ErrAdmApplicationLoopback = 2007,
  /**
   * @ignore
   */
  ErrAdmApplicationLoopbackStopped = 2008,
  /**
   * @ignore
   */
  ErrAdmSystemLoopback = 2009,
  /**
   * @ignore
   */
  ErrAdmSystemLoopbackStopped = 2010,
  /**
   * @ignore
   */
  ErrAdmLoopbackNoPermission = 2011,
  /**
   * @ignore
   */
  ErrAdmLoopbackSilentDetected = 2012,
  /**
   * @ignore
   */
  ErrAdmLoopbackSilentRecovered = 2013,
}

/**
 * @ignore
 */
export enum LicenseErrorType {
  /**
   * @ignore
   */
  LicenseErrInvalid = 1,
  /**
   * @ignore
   */
  LicenseErrExpire = 2,
  /**
   * @ignore
   */
  LicenseErrMinutesExceed = 3,
  /**
   * @ignore
   */
  LicenseErrLimitedPeriod = 4,
  /**
   * @ignore
   */
  LicenseErrDiffDevices = 5,
  /**
   * @ignore
   */
  LicenseErrInternal = 99,
}

/**
 * SDK operation permissions for Audio Session.
 */
export enum AudioSessionOperationRestriction {
  /**
   * 0: No restriction. The SDK can modify the Audio Session.
   */
  AudioSessionOperationRestrictionNone = 0,
  /**
   * 1: The SDK cannot change the Audio Session category.
   */
  AudioSessionOperationRestrictionSetCategory = 1,
  /**
   * 2: The SDK cannot change the Audio Session category, mode, or categoryOptions.
   */
  AudioSessionOperationRestrictionConfigureSession = 1 << 1,
  /**
   * 4: When leaving the channel, the SDK keeps the Audio Session active, for example, to play audio in the background.
   */
  AudioSessionOperationRestrictionDeactivateSession = 1 << 2,
  /**
   * 128: Completely restricts the SDK from operating on the Audio Session. The SDK can no longer make any changes to the Audio Session.
   */
  AudioSessionOperationRestrictionAll = 1 << 7,
}

/**
 * Reason for user going offline.
 */
export enum UserOfflineReasonType {
  /**
   * 0: User left voluntarily.
   */
  UserOfflineQuit = 0,
  /**
   * 1: Timed out due to not receiving packets from the peer for a long time. Since the SDK uses an unreliable channel, it is also possible that the peer left the channel voluntarily, but the local side did not receive the leave message and mistakenly judged it as a timeout.
   */
  UserOfflineDropped = 1,
  /**
   * 2: User role changed from broadcaster to audience.
   */
  UserOfflineBecomeAudience = 2,
}

/**
 * Interface classes.
 */
export enum InterfaceIdType {
  /**
   * 1: IAudioDeviceManager interface class.
   */
  AgoraIidAudioDeviceManager = 1,
  /**
   * 2: IVideoDeviceManager interface class.
   */
  AgoraIidVideoDeviceManager = 2,
  /**
   * @ignore
   */
  AgoraIidParameterEngine = 3,
  /**
   * 4: IMediaEngine interface class.
   */
  AgoraIidMediaEngine = 4,
  /**
   * @ignore
   */
  AgoraIidAudioEngine = 5,
  /**
   * @ignore
   */
  AgoraIidVideoEngine = 6,
  /**
   * @ignore
   */
  AgoraIidRtcConnection = 7,
  /**
   * 8: This interface class is deprecated.
   */
  AgoraIidSignalingEngine = 8,
  /**
   * @ignore
   */
  AgoraIidMediaEngineRegulator = 9,
  /**
   * @ignore
   */
  AgoraIidCloudSpatialAudio = 10,
  /**
   * 11: ILocalSpatialAudioEngine interface class.
   */
  AgoraIidLocalSpatialAudio = 11,
  /**
   * @ignore
   */
  AgoraIidStateSync = 13,
  /**
   * @ignore
   */
  AgoraIidMetachatService = 14,
  /**
   * 15: IMusicContentCenter interface class.
   */
  AgoraIidMusicContentCenter = 15,
  /**
   * @ignore
   */
  AgoraIidH265Transcoder = 16,
}

/**
 * Network quality.
 */
export enum QualityType {
  /**
   * 0: Network quality unknown.
   */
  QualityUnknown = 0,
  /**
   * 1: Excellent network quality.
   */
  QualityExcellent = 1,
  /**
   * 2: User perception is similar to excellent, but the bitrate may be slightly lower.
   */
  QualityGood = 2,
  /**
   * 3: Slight flaws in user experience but communication is not affected.
   */
  QualityPoor = 3,
  /**
   * 4: Barely able to communicate, but not smoothly.
   */
  QualityBad = 4,
  /**
   * 5: Very poor network quality, communication is nearly impossible.
   */
  QualityVbad = 5,
  /**
   * 6: Completely unable to communicate.
   */
  QualityDown = 6,
  /**
   * @ignore
   */
  QualityUnsupported = 7,
  /**
   * 8: Network quality detection in progress.
   */
  QualityDetecting = 8,
}

/**
 * @ignore
 */
export enum FitModeType {
  /**
   * @ignore
   */
  ModeCover = 1,
  /**
   * @ignore
   */
  ModeContain = 2,
}

/**
 * Clockwise video rotation information.
 */
export enum VideoOrientation {
  /**
   * 0: (Default) Rotates clockwise by 0 degrees.
   */
  VideoOrientation0 = 0,
  /**
   * 90: Rotates clockwise by 90 degrees.
   */
  VideoOrientation90 = 90,
  /**
   * 180: Rotates clockwise by 180 degrees.
   */
  VideoOrientation180 = 180,
  /**
   * 270: Rotates clockwise by 270 degrees.
   */
  VideoOrientation270 = 270,
}

/**
 * Video frame rate.
 */
export enum FrameRate {
  /**
   * 1: 1 fps.
   */
  FrameRateFps1 = 1,
  /**
   * 7: 7 fps.
   */
  FrameRateFps7 = 7,
  /**
   * 10: 10 fps.
   */
  FrameRateFps10 = 10,
  /**
   * 15: 15 fps.
   */
  FrameRateFps15 = 15,
  /**
   * 24: 24 fps.
   */
  FrameRateFps24 = 24,
  /**
   * 30: 30 fps.
   */
  FrameRateFps30 = 30,
  /**
   * 60: 60 fps.
   */
  FrameRateFps60 = 60,
}

/**
 * @ignore
 */
export enum FrameWidth {
  /**
   * @ignore
   */
  FrameWidth960 = 960,
}

/**
 * @ignore
 */
export enum FrameHeight {
  /**
   * @ignore
   */
  FrameHeight540 = 540,
}

/**
 * Video frame type.
 */
export enum VideoFrameType {
  /**
   * 0: Black frame.
   */
  VideoFrameTypeBlankFrame = 0,
  /**
   * 3: Key frame.
   */
  VideoFrameTypeKeyFrame = 3,
  /**
   * 4: Delta frame.
   */
  VideoFrameTypeDeltaFrame = 4,
  /**
   * 5: B frame.
   */
  VideoFrameTypeBFrame = 5,
  /**
   * 6: Droppable frame.
   */
  VideoFrameTypeDroppableFrame = 6,
  /**
   * Unknown frame.
   */
  VideoFrameTypeUnknow = 7,
}

/**
 * Orientation mode for video encoding.
 */
export enum OrientationMode {
  /**
   * 0: (Default) In this mode, the SDK outputs video in the same orientation as the captured video. The receiver rotates the video according to the rotation information. This mode is suitable when the receiver can adjust the video orientation.
   *  If the captured video is in landscape mode, the output video is also in landscape mode.
   *  If the captured video is in portrait mode, the output video is also in portrait mode.
   */
  OrientationModeAdaptive = 0,
  /**
   * @ignore
   */
  OrientationModeFixedLandscape = 1,
  /**
   * @ignore
   */
  OrientationModeFixedPortrait = 2,
}

/**
 * Video encoding degradation preference when bandwidth is limited.
 */
export enum DegradationPreference {
  /**
   * 0: When bandwidth is limited, the SDK prioritizes reducing frame rate while maintaining resolution during video encoding. This preference is suitable for scenarios where video quality is prioritized. Deprecated: This enum is deprecated. Use other enums instead.
   */
  MaintainQuality = 0,
  /**
   * 1: When bandwidth is limited, the SDK prioritizes reducing resolution while maintaining frame rate during video encoding. This preference is suitable for scenarios where smoothness is prioritized and some quality degradation is acceptable.
   */
  MaintainFramerate = 1,
  /**
   * 2: When bandwidth is limited, the SDK reduces both frame rate and resolution during video encoding. The degradation is less severe than MaintainQuality and MaintainFramerate, and is suitable for scenarios where both smoothness and quality are moderately important. The resolution of locally sent video may change. Remote users must be able to handle this. See onVideoSizeChanged.
   */
  MaintainBalanced = 2,
  /**
   * 3: When bandwidth is limited, the SDK prioritizes reducing frame rate while maintaining resolution during video encoding. This preference is suitable for scenarios where video quality is prioritized.
   */
  MaintainResolution = 3,
  /**
   * @ignore
   */
  Disabled = 100,
}

/**
 * Video dimensions.
 */
export class VideoDimensions {
  /**
   * Video width in pixels.
   */
  width?: number;
  /**
   * Video height in pixels.
   */
  height?: number;
}

/**
 * @ignore
 */
export enum ScreenCaptureFramerateCapability {
  /**
   * @ignore
   */
  ScreenCaptureFramerateCapability15Fps = 0,
  /**
   * @ignore
   */
  ScreenCaptureFramerateCapability30Fps = 1,
  /**
   * @ignore
   */
  ScreenCaptureFramerateCapability60Fps = 2,
}

/**
 * @ignore
 */
export enum VideoCodecCapabilityLevel {
  /**
   * @ignore
   */
  CodecCapabilityLevelUnspecified = -1,
  /**
   * @ignore
   */
  CodecCapabilityLevelBasicSupport = 5,
  /**
   * @ignore
   */
  CodecCapabilityLevel1080p30fps = 10,
  /**
   * @ignore
   */
  CodecCapabilityLevel1080p60fps = 20,
  /**
   * @ignore
   */
  CodecCapabilityLevel4k60fps = 30,
}

/**
 * Video codec format.
 */
export enum VideoCodecType {
  /**
   * 0: (Default) No specific codec format. The SDK automatically selects a suitable codec format based on the resolution of the current video stream and device performance.
   */
  VideoCodecNone = 0,
  /**
   * 1: Standard VP8.
   */
  VideoCodecVp8 = 1,
  /**
   * 2: Standard H.264.
   */
  VideoCodecH264 = 2,
  /**
   * 3: Standard H.265.
   */
  VideoCodecH265 = 3,
  /**
   * 6: Generic. This type is mainly used for transmitting raw video data (such as user-encrypted video frames). The video frames of this type are returned to the user via callback, and you need to decode and render them yourself.
   */
  VideoCodecGeneric = 6,
  /**
   * @ignore
   */
  VideoCodecGenericH264 = 7,
  /**
   * @ignore
   */
  VideoCodecAv1 = 12,
  /**
   * @ignore
   */
  VideoCodecVp9 = 13,
  /**
   * 20: Generic JPEG. This type requires less computing power and can be used on IoT devices with limited capabilities.
   */
  VideoCodecGenericJpeg = 20,
}

/**
 * @ignore
 */
export enum TCcMode {
  /**
   * @ignore
   */
  CcEnabled = 0,
  /**
   * @ignore
   */
  CcDisabled = 1,
}

/**
 * @ignore
 */
export class SenderOptions {
  /**
   * @ignore
   */
  ccMode?: TCcMode;
  /**
   * @ignore
   */
  codecType?: VideoCodecType;
  /**
   * @ignore
   */
  targetBitrate?: number;
}

/**
 * Audio codec format.
 */
export enum AudioCodecType {
  /**
   * 1: OPUS.
   */
  AudioCodecOpus = 1,
  /**
   * @ignore
   */
  AudioCodecPcma = 3,
  /**
   * @ignore
   */
  AudioCodecPcmu = 4,
  /**
   * @ignore
   */
  AudioCodecG722 = 5,
  /**
   * 8: LC-AAC.
   */
  AudioCodecAaclc = 8,
  /**
   * 9: HE-AAC.
   */
  AudioCodecHeaac = 9,
  /**
   * @ignore
   */
  AudioCodecJc1 = 10,
  /**
   * 11: HE-AAC v2.
   */
  AudioCodecHeaac2 = 11,
  /**
   * @ignore
   */
  AudioCodecLpcnet = 12,
  /**
   * @ignore
   */
  AudioCodecOpus4c = 13,
  /**
   * @ignore
   */
  AudioCodecOpus6c = 14,
  /**
   * @ignore
   */
  AudioCodecOpus8c = 15,
}

/**
 * Audio encoding type.
 */
export enum AudioEncodingType {
  /**
   * 0x010101: AAC encoding format, 16000 Hz sample rate, low quality. The encoded file size of a 10-minute audio is approximately 1.2 MB.
   */
  AudioEncodingTypeAac16000Low = 0x010101,
  /**
   * 0x010102: AAC encoding format, 16000 Hz sample rate, medium quality. The encoded file size of a 10-minute audio is approximately 2 MB.
   */
  AudioEncodingTypeAac16000Medium = 0x010102,
  /**
   * 0x010201: AAC encoding format, 32000 Hz sample rate, low quality. The encoded file size of a 10-minute audio is approximately 1.2 MB.
   */
  AudioEncodingTypeAac32000Low = 0x010201,
  /**
   * 0x010202: AAC encoding format, 32000 Hz sample rate, medium quality. The encoded file size of a 10-minute audio is approximately 2 MB.
   */
  AudioEncodingTypeAac32000Medium = 0x010202,
  /**
   * 0x010203: AAC encoding format, 32000 Hz sample rate, high quality. The encoded file size of a 10-minute audio is approximately 3.5 MB.
   */
  AudioEncodingTypeAac32000High = 0x010203,
  /**
   * 0x010302: AAC encoding format, 48000 Hz sample rate, medium quality. The encoded file size of a 10-minute audio is approximately 2 MB.
   */
  AudioEncodingTypeAac48000Medium = 0x010302,
  /**
   * 0x010303: AAC encoding format, 48000 Hz sample rate, high quality. The encoded file size of a 10-minute audio is approximately 3.5 MB.
   */
  AudioEncodingTypeAac48000High = 0x010303,
  /**
   * 0x020101: OPUS encoding format, 16000 Hz sample rate, low quality. The encoded file size of a 10-minute audio is approximately 2 MB.
   */
  AudioEncodingTypeOpus16000Low = 0x020101,
  /**
   * 0x020102: OPUS encoding format, 16000 Hz sample rate, medium quality. The encoded file size of a 10-minute audio is approximately 2 MB.
   */
  AudioEncodingTypeOpus16000Medium = 0x020102,
  /**
   * 0x020302: OPUS encoding format, 48000 Hz sample rate, medium quality. The encoded file size of a 10-minute audio is approximately 2 MB.
   */
  AudioEncodingTypeOpus48000Medium = 0x020302,
  /**
   * 0x020303: OPUS encoding format, 48000 Hz sample rate, high quality. The encoded file size of a 10-minute audio is approximately 3.5 MB.
   */
  AudioEncodingTypeOpus48000High = 0x020303,
}

/**
 * Watermark fit mode.
 */
export enum WatermarkFitMode {
  /**
   * 0: Uses the positionInLandscapeMode and positionInPortraitMode values set in WatermarkOptions. In this case, the settings in WatermarkRatio are ignored.
   */
  FitModeCoverPosition = 0,
  /**
   * 1: Uses the values set in WatermarkRatio. In this case, the positionInLandscapeMode and positionInPortraitMode settings in WatermarkOptions are ignored.
   */
  FitModeUseImageRatio = 1,
}

/**
 * @ignore
 */
export class EncodedAudioFrameAdvancedSettings {
  /**
   * @ignore
   */
  speech?: boolean;
  /**
   * @ignore
   */
  sendEvenIfEmpty?: boolean;
}

/**
 * Information of the encoded audio.
 */
export class EncodedAudioFrameInfo {
  /**
   * Audio codec specification: AudioCodecType.
   */
  codec?: AudioCodecType;
  /**
   * Audio sample rate (Hz).
   */
  sampleRateHz?: number;
  /**
   * Number of audio samples per channel.
   */
  samplesPerChannel?: number;
  /**
   * Number of channels.
   */
  numberOfChannels?: number;
  /**
   * This feature is not supported yet.
   */
  advancedSettings?: EncodedAudioFrameAdvancedSettings;
  /**
   * Unix timestamp (ms) when the external encoded video frame is captured.
   */
  captureTimeMs?: number;
}

/**
 * @ignore
 */
export class AudioPcmDataInfo {
  /**
   * @ignore
   */
  samplesPerChannel?: number;
  /**
   * @ignore
   */
  channelNum?: number;
  /**
   * @ignore
   */
  samplesOut?: number;
  /**
   * @ignore
   */
  elapsedTimeMs?: number;
  /**
   * @ignore
   */
  ntpTimeMs?: number;
}

/**
 * @ignore
 */
export enum H264PacketizeMode {
  /**
   * @ignore
   */
  NonInterleaved = 0,
  /**
   * @ignore
   */
  SingleNalUnit = 1,
}

/**
 * Video stream type.
 */
export enum VideoStreamType {
  /**
   * 0: High stream, i.e., high-resolution and high-bitrate video stream.
   */
  VideoStreamHigh = 0,
  /**
   * 1: Low stream, i.e., low-resolution and low-bitrate video stream.
   */
  VideoStreamLow = 1,
}

/**
 * Video subscription settings.
 */
export class VideoSubscriptionOptions {
  /**
   * Type of video stream to subscribe to. Default is VideoStreamHigh, i.e., subscribe to the high-quality video stream. See VideoStreamType.
   */
  type?: VideoStreamType;
  /**
   * Whether to subscribe only to encoded video streams: true : Subscribe only to encoded video data (structured data); the SDK does not decode or render this video data. false : (Default) Subscribe to both raw and encoded video data.
   */
  encodedFrameOnly?: boolean;
}

/**
 * Information about externally encoded video frames.
 */
export class EncodedVideoFrameInfo {
  /**
   * Video codec type. See VideoCodecType. Default value is VideoCodecH264 (2).
   */
  codecType?: VideoCodecType;
  /**
   * Width of the video frame (px).
   */
  width?: number;
  /**
   * Height of the video frame (px).
   */
  height?: number;
  /**
   * Number of video frames per second.
   * When this parameter is not 0, you can use it to calculate the Unix timestamp of the externally encoded video frame.
   */
  framesPerSecond?: number;
  /**
   * Type of the video frame. See VideoFrameType.
   */
  frameType?: VideoFrameType;
  /**
   * Rotation information of the video frame. See VideoOrientation.
   */
  rotation?: VideoOrientation;
  /**
   * Reserved parameter.
   */
  trackId?: number;
  /**
   * Unix timestamp (ms) when the externally encoded video frame was captured.
   */
  captureTimeMs?: number;
  /**
   * @ignore
   */
  decodeTimeMs?: number;
  /**
   * @ignore
   */
  uid?: number;
  /**
   * Type of video stream. See VideoStreamType.
   */
  streamType?: VideoStreamType;
}

/**
 * Compression preference types for video encoding.
 */
export enum CompressionPreference {
  /**
   * 0: Low latency preference. The SDK compresses video frames to reduce latency. This preference is suitable for scenarios where smoothness is prioritized and some quality loss is acceptable.
   */
  PreferLowLatency = 0,
  /**
   * 1: High quality preference. The SDK compresses video frames while maintaining video quality. This preference is suitable for scenarios where video quality is a priority.
   */
  PreferQuality = 1,
}

/**
 * Video encoder preference.
 */
export enum EncodingPreference {
  /**
   * -1: Adaptive preference. The SDK automatically selects the optimal encoding type based on platform, device type, and other factors.
   */
  PreferAuto = -1,
  /**
   * 0: Software encoding preference. The SDK prioritizes using software encoders for video encoding.
   */
  PreferSoftware = 0,
  /**
   * 1: Hardware encoding preference. The SDK prioritizes using hardware encoders for video encoding. If the device does not support hardware encoding, the SDK automatically switches to software encoding and reports the current encoder type via the onLocalVideoStats callback's hwEncoderAccelerating field.
   */
  PreferHardware = 1,
}

/**
 * Advanced options for video encoding.
 */
export class AdvanceOptions {
  /**
   * Video encoder preference. See EncodingPreference.
   */
  encodingPreference?: EncodingPreference;
  /**
   * Compression preference for video encoding. See CompressionPreference.
   */
  compressionPreference?: CompressionPreference;
}

/**
 * Mirror mode type.
 */
export enum VideoMirrorModeType {
  /**
   * 0: Mirror mode determined by SDK.
   *  Local view mirror mode: If you use the front camera, local view mirror mode is enabled by default; if you use the rear camera, it is disabled by default.
   *  Remote user view mirror mode: Disabled by default.
   */
  VideoMirrorModeAuto = 0,
  /**
   * 1: Enable mirror mode.
   */
  VideoMirrorModeEnabled = 1,
  /**
   * 2: Disable mirror mode.
   */
  VideoMirrorModeDisabled = 2,
}

/**
 * Bit mask for codec capabilities.
 */
export enum CodecCapMask {
  /**
   * (0): Codec not supported.
   */
  CodecCapMaskNone = 0,
  /**
   * (1 << 0): Supports hardware decoding.
   */
  CodecCapMaskHwDec = 1 << 0,
  /**
   * (1 << 1): Supports hardware encoding.
   */
  CodecCapMaskHwEnc = 1 << 1,
  /**
   * (1 << 2): Supports software decoding.
   */
  CodecCapMaskSwDec = 1 << 2,
  /**
   * (1 << 3): Supports software encoding.
   */
  CodecCapMaskSwEnc = 1 << 3,
}

/**
 * Codec capability levels.
 */
export class CodecCapLevels {
  /**
   * Hardware decoding capability level, indicating the device's ability to decode videos of different quality using hardware. See VIDEO_CODEC_CAPABILITY_LEVEL.
   */
  hwDecodingLevel?: VideoCodecCapabilityLevel;
  /**
   * Software decoding capability level, indicating the device's ability to decode videos of different quality using software. See VIDEO_CODEC_CAPABILITY_LEVEL.
   */
  swDecodingLevel?: VideoCodecCapabilityLevel;
}

/**
 * Codec capability information supported by the SDK.
 */
export class CodecCapInfo {
  /**
   * Video codec type. See VideoCodecType.
   */
  codecType?: VideoCodecType;
  /**
   * Bit mask of codec capabilities supported by the SDK. See CodecCapMask.
   */
  codecCapMask?: number;
  /**
   * Codec capability levels supported by the SDK. See CodecCapLevels.
   */
  codecLevels?: CodecCapLevels;
}

/**
 * Configuration of the video encoder.
 */
export class VideoEncoderConfiguration {
  /**
   * Video codec type. See VideoCodecType.
   */
  codecType?: VideoCodecType;
  /**
   * Resolution (px) for video encoding. See VideoDimensions. This parameter is used to measure encoding quality, expressed as width × height. The default value is 960 × 540. You can set the resolution as needed.
   */
  dimensions?: VideoDimensions;
  /**
   * Frame rate (fps) for video encoding. Default is 15. See FrameRate.
   */
  frameRate?: number;
  /**
   * Bitrate for video encoding in Kbps. This parameter does not need to be set; keep the default value STANDARD_BITRATE. The SDK automatically matches the optimal bitrate based on your video resolution and frame rate. For details on the relationship between resolution and frame rate, see [Video Profile](https://doc.shengwang.cn/doc/rtc/electron/basic-features/video-profile#%E8%A7%86%E9%A2%91%E5%B1%9E%E6%80%A7%E5%8F%82%E8%80%83).
   *  STANDARD_BITRATE (0): (Default) Standard bitrate mode.
   *  COMPATIBLE_BITRATE (-1): Compatible bitrate mode. In general, Agora recommends not using this value.
   */
  bitrate?: number;
  /**
   * Minimum encoding bitrate in Kbps.
   * The SDK automatically adjusts the video encoding bitrate based on network conditions. Setting this parameter higher than the default can force the encoder to output higher quality images, but may cause packet loss and stuttering under poor network conditions. Therefore, unless you have special requirements for image quality, Agora recommends not modifying this parameter. This parameter is only applicable in live streaming scenarios.
   */
  minBitrate?: number;
  /**
   * Orientation mode for video encoding. See OrientationMode.
   */
  orientationMode?: OrientationMode;
  /**
   * Video encoding degradation preference under limited bandwidth. See DegradationPreference. When this parameter is set to MaintainFramerate (1) or MaintainBalanced (2), you must also set orientationMode to OrientationModeAdaptive (0), otherwise the setting will not take effect.
   */
  degradationPreference?: DegradationPreference;
  /**
   * Whether to enable mirror mode when sending encoded video. This only affects the video seen by remote users. See VideoMirrorModeType. Mirror mode is disabled by default.
   */
  mirrorMode?: VideoMirrorModeType;
  /**
   * Advanced options for video encoding. See AdvanceOptions.
   */
  advanceOptions?: AdvanceOptions;
}

/**
 * Data stream settings.
 *
 * The table below shows the SDK behavior under different parameter settings: syncWithAudio ordered
 * SDK behavior false false
 * The SDK immediately triggers the onStreamMessage callback when the receiver receives the data packet. true false
 * If the data packet delay is within the audio delay range, the SDK triggers the onStreamMessage callback synchronized with the audio packet during audio playback. If the data packet delay exceeds the audio delay, the SDK immediately triggers the onStreamMessage callback upon receiving the packet; this may cause desynchronization between audio and data packets. false true
 * If the data packet delay is within 5 seconds, the SDK corrects the packet disorder. If the delay exceeds 5 seconds, the SDK discards the packet. true true
 * If the data packet delay is within the audio delay range, the SDK corrects the packet disorder. If the delay exceeds the audio delay, the SDK discards the packet.
 */
export class DataStreamConfig {
  /**
   * Whether to synchronize with the locally sent audio stream. true : The data stream is synchronized with the audio stream. This setting is suitable for special scenarios such as lyrics synchronization. false : The data stream is not synchronized with the audio stream. This setting is suitable for scenarios where data packets need to reach the receiver immediately. When data stream is synchronized with the audio stream, if the data packet delay is within the audio delay range, the SDK triggers the onStreamMessage callback synchronized with the audio packet during audio playback.
   */
  syncWithAudio?: boolean;
  /**
   * Whether to ensure that the received data is in the order it was sent. true : Ensures that the SDK outputs data packets in the order sent by the sender. false : Does not ensure that the SDK outputs data packets in the order sent by the sender. If data packets need to reach the receiver immediately, do not set this parameter to true.
   */
  ordered?: boolean;
}

/**
 * Mode for sending video streams.
 */
export enum SimulcastStreamMode {
  /**
   * -1: By default, small streams are not sent until a subscription request for small streams is received from the receiver, at which point small streams are automatically sent.
   */
  AutoSimulcastStream = -1,
  /**
   * 0: Never send small streams.
   */
  DisableSimulcastStream = 0,
  /**
   * 1: Always send small streams.
   */
  EnableSimulcastStream = 1,
}

/**
 * Configuration for the low-quality video stream.
 */
export class SimulcastStreamConfig {
  /**
   * Video dimensions. See VideoDimensions. The default value is 50% of the high-quality video stream.
   */
  dimensions?: VideoDimensions;
  /**
   * Video bitrate (Kbps). The default value is -1. You do not need to set this parameter. The SDK automatically selects the optimal bitrate based on the configured video resolution and frame rate.
   */
  kBitrate?: number;
  /**
   * Video frame rate (fps). The default value is 5.
   */
  framerate?: number;
}

/**
 * The position of the target area relative to the entire screen or window. If not specified, it refers to the entire screen or window.
 */
export class Rectangle {
  /**
   * Horizontal offset of the top-left corner.
   */
  x?: number;
  /**
   * Vertical offset of the top-left corner.
   */
  y?: number;
  /**
   * Width of the target area.
   */
  width?: number;
  /**
   * Height of the target area.
   */
  height?: number;
}

/**
 * Watermark position and size on screen.
 *
 * The watermark's position and size on screen are determined by xRatio, yRatio, and widthRatio :
 *  (xRatio, yRatio) represents the coordinates of the top-left corner of the watermark, determining the distance from the top-left corner of the screen. widthRatio determines the width of the watermark.
 */
export class WatermarkRatio {
  /**
   * X coordinate of the top-left corner of the watermark. Using the top-left corner of the screen as the origin, the x coordinate is the horizontal offset of the watermark's top-left corner from the origin. Value range: [0.0, 1.0], default is 0.
   */
  xRatio?: number;
  /**
   * Y coordinate of the top-left corner of the watermark. Using the top-left corner of the screen as the origin, the y coordinate is the vertical offset of the watermark's top-left corner from the origin. Value range: [0.0, 1.0], default is 0.
   */
  yRatio?: number;
  /**
   * Width of the watermark. The SDK calculates the height proportionally based on this value to ensure the watermark image is not distorted when scaled. Value range: [0.0, 1.0], default is 0, which means the watermark is not displayed.
   */
  widthRatio?: number;
}

/**
 * Configure watermark image.
 *
 * Used to configure the watermark image to be added.
 */
export class WatermarkOptions {
  /**
   * Whether the watermark is visible in the local preview view: true : (default) The watermark is visible in the local preview view. false : The watermark is not visible in the local preview view.
   */
  visibleInPreview?: boolean;
  /**
   * When the watermark fit mode is FitModeCoverPosition, this sets the watermark image area in landscape mode. See Rectangle.
   */
  positionInLandscapeMode?: Rectangle;
  /**
   * When the watermark fit mode is FitModeCoverPosition, this sets the watermark image area in portrait mode. See Rectangle.
   */
  positionInPortraitMode?: Rectangle;
  /**
   * When the watermark fit mode is FitModeUseImageRatio, this parameter sets the watermark coordinates in scaling mode. See WatermarkRatio.
   */
  watermarkRatio?: WatermarkRatio;
  /**
   * Watermark fit mode. See WatermarkFitMode.
   */
  mode?: WatermarkFitMode;
}

/**
 * Call-related statistics.
 */
export class RtcStats {
  /**
   * Call duration (seconds) of the local user, cumulative.
   */
  duration?: number;
  /**
   * Bytes sent.
   */
  txBytes?: number;
  /**
   * Bytes received.
   */
  rxBytes?: number;
  /**
   * Audio bytes sent, cumulative.
   */
  txAudioBytes?: number;
  /**
   * Video bytes sent, cumulative.
   */
  txVideoBytes?: number;
  /**
   * Audio bytes received, cumulative.
   */
  rxAudioBytes?: number;
  /**
   * Video bytes received, cumulative.
   */
  rxVideoBytes?: number;
  /**
   * Sending bitrate (Kbps).
   */
  txKBitRate?: number;
  /**
   * Receiving bitrate (Kbps).
   */
  rxKBitRate?: number;
  /**
   * Audio receiving bitrate (Kbps).
   */
  rxAudioKBitRate?: number;
  /**
   * Audio sending bitrate (Kbps).
   */
  txAudioKBitRate?: number;
  /**
   * Video receiving bitrate (Kbps).
   */
  rxVideoKBitRate?: number;
  /**
   * Video sending bitrate (Kbps).
   */
  txVideoKBitRate?: number;
  /**
   * Client-to-access server delay (ms).
   */
  lastmileDelay?: number;
  /**
   * Number of users in the current channel.
   */
  userCount?: number;
  /**
   * CPU usage (%) of the current App.
   *  The cpuAppUsage reported in the onLeaveChannel callback is always 0.
   */
  cpuAppUsage?: number;
  /**
   * CPU usage (%) of the current system.
   * On Windows platforms with multi-core CPUs, this represents the average usage across all cores. Calculated as (100 - CPU usage of the System Idle Process shown in Task Manager)/100.
   *  The cpuTotalUsage reported in the onLeaveChannel callback is always 0.
   */
  cpuTotalUsage?: number;
  /**
   * Round-trip time (ms) from the client to the local router.
   */
  gatewayRtt?: number;
  /**
   * Memory usage ratio (%) of the current App. This value is for reference only. It may not be retrievable due to system limitations.
   */
  memoryAppUsageRatio?: number;
  /**
   * Memory usage ratio (%) of the current system. This value is for reference only. It may not be retrievable due to system limitations.
   */
  memoryTotalUsageRatio?: number;
  /**
   * Memory usage (KB) of the current App. This value is for reference only. It may not be retrievable due to system limitations.
   */
  memoryAppUsageInKbytes?: number;
  /**
   * Time (ms) from starting to establish the connection to successful connection. A value of 0 indicates invalid.
   */
  connectTimeMs?: number;
  /**
   * @ignore
   */
  firstAudioPacketDuration?: number;
  /**
   * @ignore
   */
  firstVideoPacketDuration?: number;
  /**
   * @ignore
   */
  firstVideoKeyFramePacketDuration?: number;
  /**
   * @ignore
   */
  packetsBeforeFirstKeyFramePacket?: number;
  /**
   * @ignore
   */
  firstAudioPacketDurationAfterUnmute?: number;
  /**
   * @ignore
   */
  firstVideoPacketDurationAfterUnmute?: number;
  /**
   * @ignore
   */
  firstVideoKeyFramePacketDurationAfterUnmute?: number;
  /**
   * @ignore
   */
  firstVideoKeyFrameDecodedDurationAfterUnmute?: number;
  /**
   * @ignore
   */
  firstVideoKeyFrameRenderedDurationAfterUnmute?: number;
  /**
   * Uplink packet loss rate (%) before applying anti-packet-loss technology.
   */
  txPacketLossRate?: number;
  /**
   * Downlink packet loss rate (%) before applying anti-packet-loss technology.
   */
  rxPacketLossRate?: number;
}

/**
 * User roles in live broadcasting scenario.
 */
export enum ClientRoleType {
  /**
   * 1: Broadcaster. A broadcaster can both send and receive streams.
   */
  ClientRoleBroadcaster = 1,
  /**
   * 2: (Default) Audience. An audience member can only receive streams but not send them.
   */
  ClientRoleAudience = 2,
}

/**
 * Adaptation of local video quality since the last statistics (based on target frame rate and bitrate).
 */
export enum QualityAdaptIndication {
  /**
   * 0: No change in local video quality.
   */
  AdaptNone = 0,
  /**
   * 1: Local video quality improves due to increased network bandwidth.
   */
  AdaptUpBandwidth = 1,
  /**
   * 2: Local video quality degrades due to decreased network bandwidth.
   */
  AdaptDownBandwidth = 2,
}

/**
 * Latency level of audience in a live broadcast channel. This enumeration is effective only when the user role is set to ClientRoleAudience.
 */
export enum AudienceLatencyLevelType {
  /**
   * 1: Low latency.
   */
  AudienceLatencyLevelLowLatency = 1,
  /**
   * 2: (Default) Ultra-low latency.
   */
  AudienceLatencyLevelUltraLowLatency = 2,
}

/**
 * User role property settings.
 */
export class ClientRoleOptions {
  /**
   * Latency level for audience. See AudienceLatencyLevelType.
   */
  audienceLatencyLevel?: AudienceLatencyLevelType;
}

/**
 * The subjective experience quality of the local user when receiving remote audio.
 */
export enum ExperienceQualityType {
  /**
   * 0: Good subjective experience quality.
   */
  ExperienceQualityGood = 0,
  /**
   * 1: Poor subjective experience quality.
   */
  ExperienceQualityBad = 1,
}

/**
 * The reason for poor subjective experience quality of the local user when receiving remote audio.
 */
export enum ExperiencePoorReason {
  /**
   * 0: No reason, indicating good subjective experience quality.
   */
  ExperienceReasonNone = 0,
  /**
   * 1: Poor network quality of the remote user.
   */
  RemoteNetworkQualityPoor = 1,
  /**
   * 2: Poor network quality of the local user.
   */
  LocalNetworkQualityPoor = 2,
  /**
   * 4: Weak Wi-Fi or mobile data signal of the local user.
   */
  WirelessSignalPoor = 4,
  /**
   * 8: Wi-Fi and Bluetooth are enabled simultaneously on the local device, causing signal interference and degraded audio transmission quality.
   */
  WifiBluetoothCoexist = 8,
}

/**
 * AI noise reduction mode.
 */
export enum AudioAinsMode {
  /**
   * 0: (Default) Balanced noise reduction mode. Choose this mode if you want a balance between noise suppression and latency.
   */
  AinsModeBalanced = 0,
  /**
   * 1: Aggressive noise reduction mode. Suitable for scenarios requiring strong noise suppression, such as outdoor live streaming. This mode can significantly reduce noise but may slightly distort voice.
   */
  AinsModeAggressive = 1,
  /**
   * 2: Low-latency aggressive noise reduction mode. This mode has approximately half the latency of weak and aggressive noise reduction modes, making it suitable for scenarios requiring both noise reduction and low latency, such as real-time chorus.
   */
  AinsModeUltralowlatency = 2,
}

/**
 * Audio encoding properties.
 */
export enum AudioProfileType {
  /**
   * 0: Default value.
   *  In live broadcast scenarios: 48 kHz sampling rate, music encoding, mono channel, maximum bitrate 64 Kbps.
   *  In communication scenarios:
   *  Windows platform: 16 kHz sampling rate, speech encoding, mono channel, maximum bitrate 16 Kbps.
   *  macOS platform: 32 kHz sampling rate, speech encoding, mono channel, maximum bitrate 18 Kbps.
   */
  AudioProfileDefault = 0,
  /**
   * 1: Specifies 32 kHz sampling rate, speech encoding, mono channel, maximum bitrate 18 Kbps.
   */
  AudioProfileSpeechStandard = 1,
  /**
   * 2: Specifies 48 kHz sampling rate, music encoding, mono channel, maximum bitrate 64 Kbps.
   */
  AudioProfileMusicStandard = 2,
  /**
   * 3: Specifies 48 kHz sampling rate, music encoding, stereo channel, maximum bitrate 80 Kbps.
   * To achieve stereo, you also need to call setAdvancedAudioOptions and set audioProcessingChannels to AudioProcessingStereo in AdvancedAudioOptions.
   */
  AudioProfileMusicStandardStereo = 3,
  /**
   * 4: Specifies 48 kHz sampling rate, music encoding, mono channel, maximum bitrate 96 Kbps.
   */
  AudioProfileMusicHighQuality = 4,
  /**
   * 5: Specifies 48 kHz sampling rate, music encoding, stereo channel, maximum bitrate 128 Kbps.
   * To achieve stereo, you also need to call setAdvancedAudioOptions and set audioProcessingChannels to AudioProcessingStereo in AdvancedAudioOptions.
   */
  AudioProfileMusicHighQualityStereo = 5,
  /**
   * 6: Specifies 16 kHz sampling rate, speech encoding, mono channel, applies echo cancellation algorithm AEC.
   */
  AudioProfileIot = 6,
  /**
   * Enumeration value boundary.
   */
  AudioProfileNum = 7,
}

/**
 * Audio scenario.
 */
export enum AudioScenarioType {
  /**
   * 0: (Default) Automatic scenario. Automatically matches the appropriate audio quality based on user role and audio routing.
   */
  AudioScenarioDefault = 0,
  /**
   * 3: High-quality audio scenario, suitable for music-centric use cases. For example: instrument practice.
   */
  AudioScenarioGameStreaming = 3,
  /**
   * 5: Chatroom scenario, suitable for cases where users frequently join and leave the mic. For example: educational scenarios.
   */
  AudioScenarioChatroom = 5,
  /**
   * 7: Chorus scenario. Suitable for real-time chorus with good network conditions and ultra-low latency requirements.
   */
  AudioScenarioChorus = 7,
  /**
   * 8: Meeting scenario, suitable for multi-person voice-centric conferences.
   */
  AudioScenarioMeeting = 8,
  /**
   * Number of enumerations.
   */
  AudioScenarioNum = 9,
}

/**
 * Video frame format.
 */
export class VideoFormat {
  /**
   * Width of the video frame (px). Default is 960.
   */
  width?: number;
  /**
   * Height of the video frame (px). Default is 540.
   */
  height?: number;
  /**
   * Frame rate of the video frame. Default is 15.
   */
  fps?: number;
}

/**
 * Content type for screen sharing.
 */
export enum VideoContentHint {
  /**
   * (Default) No specified content type.
   */
  ContentHintNone = 0,
  /**
   * Content type is motion. Recommended when sharing videos, movies, or video games.
   */
  ContentHintMotion = 1,
  /**
   * Content type is details. Recommended when sharing images or text.
   */
  ContentHintDetails = 2,
}

/**
 * Screen sharing scenario.
 */
export enum ScreenScenarioType {
  /**
   * 1: (Default) Document. This scenario prioritizes the quality of the shared content and reduces the latency seen by the receiver. Use this scenario when sharing documents, slides, or spreadsheets.
   */
  ScreenScenarioDocument = 1,
  /**
   * 2: Gaming. This scenario prioritizes the smoothness of the shared stream. Use this scenario when sharing games.
   */
  ScreenScenarioGaming = 2,
  /**
   * 3: Video. This scenario prioritizes the smoothness of the shared stream. Use this scenario when sharing movies or live video.
   */
  ScreenScenarioVideo = 3,
  /**
   * 4: Remote control. This scenario prioritizes the quality of the shared content and reduces the latency seen by the receiver. Use this scenario when sharing the desktop of a remotely controlled device.
   */
  ScreenScenarioRdc = 4,
}

/**
 * Video application scenario type.
 */
export enum VideoApplicationScenarioType {
  /**
   * 0: (Default) General scenario.
   */
  ApplicationScenarioGeneral = 0,
  /**
   * 1: Meeting scenario.
   */
  ApplicationScenarioMeeting = 1,
}

/**
 * Brightness level of locally captured video quality.
 */
export enum CaptureBrightnessLevelType {
  /**
   * @ignore
   */
  CaptureBrightnessLevelInvalid = -1,
  /**
   * @ignore
   */
  CaptureBrightnessLevelNormal = 0,
  /**
   * @ignore
   */
  CaptureBrightnessLevelBright = 1,
  /**
   * @ignore
   */
  CaptureBrightnessLevelDark = 2,
}

/**
 * @ignore
 */
export enum CameraStabilizationMode {
  /**
   * @ignore
   */
  CameraStabilizationModeOff = -1,
  /**
   * @ignore
   */
  CameraStabilizationModeAuto = 0,
  /**
   * @ignore
   */
  CameraStabilizationModeLevel1 = 1,
  /**
   * @ignore
   */
  CameraStabilizationModeLevel2 = 2,
  /**
   * @ignore
   */
  CameraStabilizationModeLevel3 = 3,
  /**
   * @ignore
   */
  CameraStabilizationModeMaxLevel = 3,
}

/**
 * Local audio state.
 */
export enum LocalAudioStreamState {
  /**
   * 0: Default initial state of the local audio.
   */
  LocalAudioStreamStateStopped = 0,
  /**
   * 1: The local audio capture device is started successfully.
   */
  LocalAudioStreamStateRecording = 1,
  /**
   * 2: The first frame of local audio is encoded successfully.
   */
  LocalAudioStreamStateEncoding = 2,
  /**
   * 3: Failed to start local audio.
   */
  LocalAudioStreamStateFailed = 3,
}

/**
 * @ignore
 */
export enum LocalAudioStreamError {
  /**
   * @ignore
   */
  LocalAudioStreamErrorOk = 0,
  /**
   * @ignore
   */
  LocalAudioStreamErrorFailure = 1,
  /**
   * @ignore
   */
  LocalAudioStreamErrorDeviceNoPermission = 2,
  /**
   * @ignore
   */
  LocalAudioStreamErrorDeviceBusy = 3,
  /**
   * @ignore
   */
  LocalAudioStreamErrorRecordFailure = 4,
  /**
   * @ignore
   */
  LocalAudioStreamErrorEncodeFailure = 5,
  /**
   * @ignore
   */
  LocalAudioStreamErrorNoRecordingDevice = 6,
  /**
   * @ignore
   */
  LocalAudioStreamErrorNoPlayoutDevice = 7,
  /**
   * @ignore
   */
  LocalAudioStreamErrorInterrupted = 8,
  /**
   * @ignore
   */
  LocalAudioStreamErrorRecordInvalidId = 9,
  /**
   * @ignore
   */
  LocalAudioStreamErrorPlayoutInvalidId = 10,
}

/**
 * Local video state.
 */
export enum LocalVideoStreamState {
  /**
   * 0: Default initial state of the local video.
   */
  LocalVideoStreamStateStopped = 0,
  /**
   * 1: The local video capture device is started successfully.
   */
  LocalVideoStreamStateCapturing = 1,
  /**
   * 2: The first frame of local video is encoded successfully.
   */
  LocalVideoStreamStateEncoding = 2,
  /**
   * 3: Failed to start local video.
   */
  LocalVideoStreamStateFailed = 3,
}

/**
 * @ignore
 */
export enum LocalVideoStreamError {
  /**
   * @ignore
   */
  LocalVideoStreamErrorOk = 0,
  /**
   * @ignore
   */
  LocalVideoStreamErrorFailure = 1,
  /**
   * @ignore
   */
  LocalVideoStreamErrorDeviceNoPermission = 2,
  /**
   * @ignore
   */
  LocalVideoStreamErrorDeviceBusy = 3,
  /**
   * @ignore
   */
  LocalVideoStreamErrorCaptureFailure = 4,
  /**
   * @ignore
   */
  LocalVideoStreamErrorEncodeFailure = 5,
  /**
   * @ignore
   */
  LocalVideoStreamErrorCaptureInbackground = 6,
  /**
   * @ignore
   */
  LocalVideoStreamErrorCaptureMultipleForegroundApps = 7,
  /**
   * @ignore
   */
  LocalVideoStreamErrorDeviceNotFound = 8,
  /**
   * @ignore
   */
  LocalVideoStreamErrorDeviceDisconnected = 9,
  /**
   * @ignore
   */
  LocalVideoStreamErrorDeviceInvalidId = 10,
  /**
   * @ignore
   */
  LocalVideoStreamErrorDeviceInterrupt = 14,
  /**
   * @ignore
   */
  LocalVideoStreamErrorDeviceFatalError = 15,
  /**
   * @ignore
   */
  LocalVideoStreamErrorDeviceSystemPressure = 101,
  /**
   * @ignore
   */
  LocalVideoStreamErrorScreenCaptureWindowMinimized = 11,
  /**
   * @ignore
   */
  LocalVideoStreamErrorScreenCaptureWindowClosed = 12,
  /**
   * @ignore
   */
  LocalVideoStreamErrorScreenCaptureWindowOccluded = 13,
  /**
   * @ignore
   */
  LocalVideoStreamErrorScreenCaptureWindowNotSupported = 20,
  /**
   * @ignore
   */
  LocalVideoStreamErrorScreenCaptureFailure = 21,
  /**
   * @ignore
   */
  LocalVideoStreamErrorScreenCaptureNoPermission = 22,
  /**
   * @ignore
   */
  LocalVideoStreamErrorScreenCapturePaused = 23,
  /**
   * @ignore
   */
  LocalVideoStreamErrorScreenCaptureResumed = 24,
  /**
   * @ignore
   */
  LocalVideoStreamErrorScreenCaptureWindowHidden = 25,
  /**
   * @ignore
   */
  LocalVideoStreamErrorScreenCaptureWindowRecoverFromHidden = 26,
  /**
   * @ignore
   */
  LocalVideoStreamErrorScreenCaptureWindowRecoverFromMinimized = 27,
  /**
   * @ignore
   */
  LocalVideoStreamReasonScreenCaptureDisplayDisconnected = 30,
  /**
   * @ignore
   */
  LocalVideoStreamErrorScreenCaptureAutoFallback = 31,
}

/**
 * State of the remote audio stream.
 */
export enum RemoteAudioState {
  /**
   * 0: The default initial state of the remote audio. This state is reported under RemoteAudioReasonLocalMuted, RemoteAudioReasonRemoteMuted, or RemoteAudioReasonRemoteOffline.
   */
  RemoteAudioStateStopped = 0,
  /**
   * 1: The local user has received the first packet of the remote audio.
   */
  RemoteAudioStateStarting = 1,
  /**
   * 2: The remote audio stream is being decoded and playing normally. This state is reported under RemoteAudioReasonNetworkRecovery, RemoteAudioReasonLocalUnmuted, or RemoteAudioReasonRemoteUnmuted.
   */
  RemoteAudioStateDecoding = 2,
  /**
   * 3: The remote audio stream is frozen. This state is reported under RemoteAudioReasonNetworkCongestion.
   */
  RemoteAudioStateFrozen = 3,
  /**
   * 4: Failed to play the remote audio stream. This state is reported under RemoteAudioReasonInternal.
   */
  RemoteAudioStateFailed = 4,
}

/**
 * Reason for remote audio stream state change.
 */
export enum RemoteAudioStateReason {
  /**
   * 0: This reason is reported when the audio state changes.
   */
  RemoteAudioReasonInternal = 0,
  /**
   * 1: Network congestion.
   */
  RemoteAudioReasonNetworkCongestion = 1,
  /**
   * 2: Network recovered.
   */
  RemoteAudioReasonNetworkRecovery = 2,
  /**
   * 3: Local user stopped receiving remote audio stream or disabled the audio module.
   */
  RemoteAudioReasonLocalMuted = 3,
  /**
   * 4: Local user resumed receiving remote audio stream or enabled the audio module.
   */
  RemoteAudioReasonLocalUnmuted = 4,
  /**
   * 5: Remote user stopped sending audio stream or disabled the audio module.
   */
  RemoteAudioReasonRemoteMuted = 5,
  /**
   * 6: Remote user resumed sending audio stream or enabled the audio module.
   */
  RemoteAudioReasonRemoteUnmuted = 6,
  /**
   * 7: Remote user left the channel.
   */
  RemoteAudioReasonRemoteOffline = 7,
  /**
   * @ignore
   */
  RemoteAudioReasonRemoteNoPacketReceive = 8,
  /**
   * @ignore
   */
  RemoteAudioReasonRemoteLocalPlayFailed = 9,
}

/**
 * State of the remote video stream.
 */
export enum RemoteVideoState {
  /**
   * 0: The default initial state of the remote video. This state is reported under RemoteVideoStateReasonLocalMuted, RemoteVideoStateReasonRemoteMuted, or RemoteVideoStateReasonRemoteOffline.
   */
  RemoteVideoStateStopped = 0,
  /**
   * 1: The local user has received the first packet of the remote video.
   */
  RemoteVideoStateStarting = 1,
  /**
   * 2: The remote video stream is being decoded and playing normally. This state is reported under RemoteVideoStateReasonNetworkRecovery, RemoteVideoStateReasonLocalUnmuted, or RemoteVideoStateReasonRemoteUnmuted.
   */
  RemoteVideoStateDecoding = 2,
  /**
   * 3: The remote video stream is frozen. This state is reported under RemoteVideoStateReasonNetworkCongestion.
   */
  RemoteVideoStateFrozen = 3,
  /**
   * 4: Failed to play the remote video stream. This state is reported under RemoteVideoStateReasonInternal.
   */
  RemoteVideoStateFailed = 4,
}

/**
 * Reasons for remote video stream state changes.
 */
export enum RemoteVideoStateReason {
  /**
   * 0: This reason is reported when the video state changes.
   */
  RemoteVideoStateReasonInternal = 0,
  /**
   * 1: Network congestion.
   */
  RemoteVideoStateReasonNetworkCongestion = 1,
  /**
   * 2: Network recovery.
   */
  RemoteVideoStateReasonNetworkRecovery = 2,
  /**
   * 3: The local user stops receiving the remote video stream or disables the video module.
   */
  RemoteVideoStateReasonLocalMuted = 3,
  /**
   * 4: The local user resumes receiving the remote video stream or enables the video module.
   */
  RemoteVideoStateReasonLocalUnmuted = 4,
  /**
   * 5: The remote user stops sending the video stream or disables the video module.
   */
  RemoteVideoStateReasonRemoteMuted = 5,
  /**
   * 6: The remote user resumes sending the video stream or enables the video module.
   */
  RemoteVideoStateReasonRemoteUnmuted = 6,
  /**
   * 7: The remote user leaves the channel.
   */
  RemoteVideoStateReasonRemoteOffline = 7,
  /**
   * 8: Under poor network conditions, the remote audio and video stream falls back to audio only.
   */
  RemoteVideoStateReasonAudioFallback = 8,
  /**
   * 9: When the network improves, the remote audio stream recovers to audio and video.
   */
  RemoteVideoStateReasonAudioFallbackRecovery = 9,
  /**
   * @ignore
   */
  RemoteVideoStateReasonVideoStreamTypeChangeToLow = 10,
  /**
   * @ignore
   */
  RemoteVideoStateReasonVideoStreamTypeChangeToHigh = 11,
  /**
   * @ignore
   */
  RemoteVideoStateReasonSdkInBackground = 12,
  /**
   * 13: The local video decoder does not support decoding the received remote video stream.
   */
  RemoteVideoStateReasonCodecNotSupport = 13,
}

/**
 * @ignore
 */
export enum RemoteUserState {
  /**
   * @ignore
   */
  UserStateMuteAudio = 1 << 0,
  /**
   * @ignore
   */
  UserStateMuteVideo = 1 << 1,
  /**
   * @ignore
   */
  UserStateEnableVideo = 1 << 4,
  /**
   * @ignore
   */
  UserStateEnableLocalVideo = 1 << 8,
}

/**
 * @ignore
 */
export class VideoTrackInfo {
  /**
   * @ignore
   */
  isLocal?: boolean;
  /**
   * @ignore
   */
  ownerUid?: number;
  /**
   * @ignore
   */
  trackId?: number;
  /**
   * @ignore
   */
  channelId?: string;
  /**
   * @ignore
   */
  streamType?: VideoStreamType;
  /**
   * @ignore
   */
  codecType?: VideoCodecType;
  /**
   * @ignore
   */
  encodedFrameOnly?: boolean;
  /**
   * @ignore
   */
  sourceType?: VideoSourceType;
  /**
   * @ignore
   */
  observationPosition?: number;
}

/**
 * @ignore
 */
export enum RemoteVideoDownscaleLevel {
  /**
   * @ignore
   */
  RemoteVideoDownscaleLevelNone = 0,
  /**
   * @ignore
   */
  RemoteVideoDownscaleLevel1 = 1,
  /**
   * @ignore
   */
  RemoteVideoDownscaleLevel2 = 2,
  /**
   * @ignore
   */
  RemoteVideoDownscaleLevel3 = 3,
  /**
   * @ignore
   */
  RemoteVideoDownscaleLevel4 = 4,
}

/**
 * User volume information.
 */
export class AudioVolumeInfo {
  /**
   * User ID.
   *  In local user callbacks, uid is 0.
   *  In remote user callbacks, uid is the ID of the remote user with the highest instantaneous volume (up to 3 users).
   */
  uid?: number;
  /**
   * User volume, ranging from [0, 255]. If the user mutes themselves (muteLocalAudioStream is set to true) but audio capture is enabled, volume represents the volume of the local captured signal.
   */
  volume?: number;
  /**
   * vad does not report remote user voice activity. For remote users, the value of vad is always 1.
   *  To use this parameter, set reportVad to true when calling enableAudioVolumeIndication. Local user voice activity status.
   *  0: No voice detected locally.
   *  1: Voice detected locally.
   */
  vad?: number;
  /**
   * Local user voice pitch (Hz). Value range: [0.0, 4000.0]. voicePitch does not report remote user pitch. For remote users, the value of voicePitch is always 0.0.
   */
  voicePitch?: number;
}

/**
 * Audio device information.
 */
export class DeviceInfo {
  /**
   * @ignore
   */
  isLowLatencyAudioSupported?: boolean;
}

/**
 * @ignore
 */
export class Packet {
  /**
   * @ignore
   */
  buffer?: Uint8Array;
  /**
   * @ignore
   */
  size?: number;
}

/**
 * Sampling rate of audio for stream output.
 */
export enum AudioSampleRateType {
  /**
   * 32000: 32 kHz
   */
  AudioSampleRate32000 = 32000,
  /**
   * 44100: 44.1 kHz
   */
  AudioSampleRate44100 = 44100,
  /**
   * 48000: (Default) 48 kHz
   */
  AudioSampleRate48000 = 48000,
}

/**
 * Codec type for transcoded output video stream.
 */
export enum VideoCodecTypeForStream {
  /**
   * 1: (Default) H.264.
   */
  VideoCodecH264ForStream = 1,
  /**
   * 2: H.265.
   */
  VideoCodecH265ForStream = 2,
}

/**
 * Codec profile for video in CDN streaming.
 */
export enum VideoCodecProfileType {
  /**
   * 66: Baseline level video codec profile, typically used in low-end or error-tolerant applications such as video calls and mobile videos.
   */
  VideoCodecProfileBaseline = 66,
  /**
   * 77: Main level video codec profile, typically used in mainstream consumer electronics such as MP4, portable video players, PSP, iPad, etc.
   */
  VideoCodecProfileMain = 77,
  /**
   * 100: (Default) High level video codec profile, typically used in broadcasting, video disc storage, and HDTV.
   */
  VideoCodecProfileHigh = 100,
}

/**
 * Audio codec profile for stream publishing output. Defaults to LC-AAC.
 */
export enum AudioCodecProfileType {
  /**
   * 0: (Default) LC-AAC profile.
   */
  AudioCodecProfileLcAac = 0,
  /**
   * 1: HE-AAC profile.
   */
  AudioCodecProfileHeAac = 1,
  /**
   * 2: HE-AAC v2 profile.
   */
  AudioCodecProfileHeAacV2 = 2,
}

/**
 * Local audio statistics.
 */
export class LocalAudioStats {
  /**
   * Number of audio channels.
   */
  numChannels?: number;
  /**
   * Sampling rate of the sent local audio, in Hz.
   */
  sentSampleRate?: number;
  /**
   * Average bitrate of the sent local audio, in Kbps.
   */
  sentBitrate?: number;
  /**
   * Internal payload type.
   */
  internalCodec?: number;
  /**
   * Packet loss rate (%) from the local end to the Agora edge server before anti-packet-loss strategies are applied.
   */
  txPacketLossRate?: number;
  /**
   * Delay of the audio device module during playback or recording, in ms.
   */
  audioDeviceDelay?: number;
}

/**
 * RTMP stream publishing state.
 */
export enum RtmpStreamPublishState {
  /**
   * 0: Stream publishing not started or already ended.
   */
  RtmpStreamPublishStateIdle = 0,
  /**
   * 1: Connecting to the streaming server and CDN server.
   */
  RtmpStreamPublishStateConnecting = 1,
  /**
   * 2: Stream publishing is in progress. This state is returned after successful publishing.
   */
  RtmpStreamPublishStateRunning = 2,
  /**
   * 3: Recovering stream publishing. When the CDN encounters an exception or the stream is briefly interrupted, the SDK automatically attempts to recover the stream and returns this state.
   *  If recovery is successful, it enters the RtmpStreamPublishStateRunning(2) state.
   *  If the server encounters an error or recovery fails within 60 seconds, it enters the RtmpStreamPublishStateFailure(4) state. If 60 seconds is too long, you can also try to reconnect manually.
   */
  RtmpStreamPublishStateRecovering = 3,
  /**
   * 4: Stream publishing failed. After failure, you can troubleshoot the issue using the returned error code.
   */
  RtmpStreamPublishStateFailure = 4,
  /**
   * 5: The SDK is disconnecting from the streaming server and CDN server. When you call the stopRtmpStream method to end the stream normally, the SDK sequentially reports the stream states as RtmpStreamPublishStateDisconnecting and RtmpStreamPublishStateIdle.
   */
  RtmpStreamPublishStateDisconnecting = 5,
}

/**
 * @ignore
 */
export enum RtmpStreamPublishErrorType {
  /**
   * @ignore
   */
  RtmpStreamPublishErrorOk = 0,
  /**
   * @ignore
   */
  RtmpStreamPublishErrorInvalidArgument = 1,
  /**
   * @ignore
   */
  RtmpStreamPublishErrorEncryptedStreamNotAllowed = 2,
  /**
   * @ignore
   */
  RtmpStreamPublishErrorConnectionTimeout = 3,
  /**
   * @ignore
   */
  RtmpStreamPublishErrorInternalServerError = 4,
  /**
   * @ignore
   */
  RtmpStreamPublishErrorRtmpServerError = 5,
  /**
   * @ignore
   */
  RtmpStreamPublishErrorTooOften = 6,
  /**
   * @ignore
   */
  RtmpStreamPublishErrorReachLimit = 7,
  /**
   * @ignore
   */
  RtmpStreamPublishErrorNotAuthorized = 8,
  /**
   * @ignore
   */
  RtmpStreamPublishErrorStreamNotFound = 9,
  /**
   * @ignore
   */
  RtmpStreamPublishErrorFormatNotSupported = 10,
  /**
   * @ignore
   */
  RtmpStreamPublishErrorNotBroadcaster = 11,
  /**
   * @ignore
   */
  RtmpStreamPublishErrorTranscodingNoMixStream = 13,
  /**
   * @ignore
   */
  RtmpStreamPublishErrorNetDown = 14,
  /**
   * @ignore
   */
  RtmpStreamPublishErrorInvalidAppid = 15,
  /**
   * @ignore
   */
  RtmpStreamPublishErrorInvalidPrivilege = 16,
  /**
   * @ignore
   */
  RtmpStreamUnpublishErrorOk = 100,
}

/**
 * Events that occur during RTMP streaming.
 */
export enum RtmpStreamingEvent {
  /**
   * 1: Error adding background image or watermark during RTMP streaming.
   */
  RtmpStreamingEventFailedLoadImage = 1,
  /**
   * 2: The stream URL is already in use. If you want to start a new stream, please use a new stream URL.
   */
  RtmpStreamingEventUrlAlreadyInUse = 2,
  /**
   * 3: Feature not supported.
   */
  RtmpStreamingEventAdvancedFeatureNotSupport = 3,
  /**
   * 4: Reserved parameter.
   */
  RtmpStreamingEventRequestTooOften = 4,
}

/**
 * Image properties.
 *
 * Used to set watermark and background image properties for live video.
 */
export class RtcImage {
  /**
   * HTTP/HTTPS URL of the image on the live video. The character length must not exceed 1024 bytes.
   */
  url?: string;
  /**
   * The x-coordinate (px) of the image on the video frame, with the top-left corner of the output video as the origin.
   */
  x?: number;
  /**
   * The y-coordinate (px) of the image on the video frame, with the top-left corner of the output video as the origin.
   */
  y?: number;
  /**
   * The width (px) of the image on the video frame.
   */
  width?: number;
  /**
   * The height (px) of the image on the video frame.
   */
  height?: number;
  /**
   * Layer number of the watermark or background image. When adding one or more watermarks using an array, you must set a value for zOrder, with a valid range of [1,255], otherwise the SDK will report an error. In other cases, zOrder is optional, with a valid range of [0,255], where 0 is the default. 0 indicates the bottom layer, and 255 indicates the top layer.
   */
  zOrder?: number;
  /**
   * Transparency of the watermark or background image. Range: [0.0, 1.0]:
   *  0.0: Fully transparent.
   *  1.0: (Default) Fully opaque.
   */
  alpha?: number;
}

/**
 * Advanced feature configuration for live transcoding.
 *
 * To use advanced features for live transcoding, please [contact sales](https://www.shengwang.cn/contact-sales/).
 */
export class LiveStreamAdvancedFeature {
  /**
   * The name of the advanced feature for live transcoding, including LBHQ (Low Bitrate High Quality video feature) and VEO (Video Encoder Optimization feature).
   */
  featureName?: string;
  /**
   * Whether to enable the advanced feature for live transcoding: true : Enable the advanced feature for live transcoding. false : (Default) Disable the advanced feature for live transcoding.
   */
  opened?: boolean;
}

/**
 * Network connection state.
 */
export enum ConnectionStateType {
  /**
   * 1: Disconnected from the network. This state indicates that the SDK is:
   *  In the initialization phase before calling joinChannel.
   *  Or in the leave phase after calling leaveChannel.
   */
  ConnectionStateDisconnected = 1,
  /**
   * 2: Connecting to the network. This state indicates that the SDK is establishing a connection to the specified channel after calling joinChannel.
   *  If the channel is joined successfully, the app receives the onConnectionStateChanged callback indicating the network state has changed to ConnectionStateConnected.
   *  After the connection is established, the SDK initializes media and triggers the onJoinChannelSuccess callback when ready.
   */
  ConnectionStateConnecting = 2,
  /**
   * 3: Connected to the network. This state indicates that the user has joined the channel and can publish or subscribe to media streams. If the connection is interrupted due to network issues or switching, the SDK automatically reconnects. The app receives the onConnectionStateChanged callback indicating the network state has changed to ConnectionStateReconnecting.
   */
  ConnectionStateConnected = 3,
  /**
   * 4: Reconnecting to the network. This state indicates that the SDK was previously connected to the channel but the connection was interrupted due to network issues. The SDK is now trying to reconnect to the channel.
   *  If the SDK fails to rejoin the channel within 10 seconds, onConnectionLost is triggered. The SDK remains in the ConnectionStateReconnecting state and continues trying to rejoin.
   *  If the SDK fails to rejoin the channel within 20 minutes after disconnection, the app receives the onConnectionStateChanged callback indicating the network state has changed to ConnectionStateFailed, and the SDK stops trying to reconnect.
   */
  ConnectionStateReconnecting = 4,
  /**
   * 5: Network connection failed. This state indicates that the SDK has stopped trying to rejoin the channel. You need to call leaveChannel to leave the channel.
   *  If the user wants to rejoin the channel, call joinChannel again.
   *  If the SDK is banned from joining the channel by the server using RESTful API, the app receives the onConnectionStateChanged callback.
   */
  ConnectionStateFailed = 5,
}

/**
 * Settings for each host participating in the transcoding mix.
 */
export class TranscodingUser {
  /**
   * User ID of the host.
   */
  uid?: number;
  /**
   * The x-coordinate (px) of the host's video on the output video, with the top-left corner of the output video as the origin. Value range: [0,width], where width is set in LiveTranscoding.
   */
  x?: number;
  /**
   * The y-coordinate (px) of the host's video on the output video, with the top-left corner of the output video as the origin. Value range: [0,height], where height is set in LiveTranscoding.
   */
  y?: number;
  /**
   * Width (px) of the host's video.
   */
  width?: number;
  /**
   * Height (px) of the host's video.
   */
  height?: number;
  /**
   * If the value is less than 0 or greater than 100, ErrInvalidArgument is returned.
   *  Setting zOrder to 0 is supported. Layer index of the host's video. Value range: [0,100].
   *  0: (Default) Video is at the bottom layer.
   *  100: Video is at the top layer.
   */
  zOrder?: number;
  /**
   * Transparency of the host's video. Value range: [0.0,1.0].
   *  0.0: Fully transparent.
   *  1.0: (Default) Fully opaque.
   */
  alpha?: number;
  /**
   * When the value is not 0, a special player is required. Audio channel used by the host in the output audio. Default is 0. Value range: [0,5]: 0 : (Recommended) Default audio mixing setting. Supports up to stereo, depending on the host's upstream audio. 1 : Host audio in the FL channel of the output. If the host's upstream audio is multi-channel, the Agora server mixes it down to mono. 2 : Host audio in the FC channel of the output. If the host's upstream audio is multi-channel, the Agora server mixes it down to mono. 3 : Host audio in the FR channel of the output. If the host's upstream audio is multi-channel, the Agora server mixes it down to mono. 4 : Host audio in the BL channel of the output. If the host's upstream audio is multi-channel, the Agora server mixes it down to mono. 5 : Host audio in the BR channel of the output. If the host's upstream audio is multi-channel, the Agora server mixes it down to mono. 0xFF or values greater than 5 : The host's audio is muted and removed by the Agora server.
   */
  audioChannel?: number;
}

/**
 * Transcoding properties for RTMP streaming.
 */
export class LiveTranscoding {
  /**
   * Total width of the video stream, in pixels. Default is 360.
   *  If streaming video, the value range of width is [64,1920]. If the value is less than 64, the Agora server automatically sets it to 64; if greater than 1920, it is set to 1920.
   *  If streaming audio only, set both width and height to 0.
   */
  width?: number;
  /**
   * Total height of the video stream, in pixels. Default is 640.
   *  If streaming video, the value range of height is [64,1080]. If the value is less than 64, the Agora server automatically sets it to 64; if greater than 1080, it is set to 1080.
   *  If streaming audio only, set both width and height to 0.
   */
  height?: number;
  /**
   * Video encoding bitrate in Kbps. This parameter does not need to be set. Keep the default value STANDARD_BITRATE, and the SDK automatically matches the optimal bitrate based on the resolution and frame rate you set. For the relationship between resolution and frame rate, see [Video Profile](https://doc.shengwang.cn/doc/rtc/electron/basic-features/video-profile#%E8%A7%86%E9%A2%91%E5%B1%9E%E6%80%A7%E5%8F%82%E8%80%83).
   */
  videoBitrate?: number;
  /**
   * Frame rate of the output video for RTMP streaming. Value range is (0,30], in fps. Default is 15 fps. The Agora server adjusts frame rates higher than 30 fps to 30 fps.
   */
  videoFramerate?: number;
  /**
   * Deprecated. Not recommended. Low latency mode true : Low latency, quality not guaranteed. false : (default) High latency, quality guaranteed.
   */
  lowLatency?: boolean;
  /**
   * GOP (Group of Pictures) of the output video for RTMP streaming, in frames. Default is 30.
   */
  videoGop?: number;
  /**
   * Codec profile of the output video for RTMP streaming. Can be set to 66, 77, or 100. See VideoCodecProfileType. If you set this parameter to a value other than the above, the Agora server adjusts it to the default value.
   */
  videoCodecProfile?: VideoCodecProfileType;
  /**
   * Background color of the output video for RTMP streaming. Represented as a hexadecimal RGB integer without the # sign. For example, 0xFFB6C1 represents light pink. Default is 0x000000 (black).
   */
  backgroundColor?: number;
  /**
   * Codec type of the output video for RTMP streaming. See VideoCodecTypeForStream.
   */
  videoCodecType?: VideoCodecTypeForStream;
  /**
   * Number of users in the video mixing. Default is 0. Value range: [0,17].
   */
  userCount?: number;
  /**
   * Manages users involved in video mixing for RTMP streaming. Supports up to 17 users simultaneously. See TranscodingUser.
   */
  transcodingUsers?: TranscodingUser[];
  /**
   * Reserved parameter: custom information sent to the RTMP client, used to populate SEI frames in H264/H265 video. Max length: 4096 bytes. For details about SEI, see [SEI Frame FAQ](https://doc.shengwang.cn/faq/quality-issues/sei).
   */
  transcodingExtraInfo?: string;
  /**
   * Metadata sent to the CDN client. Deprecated. Not recommended.
   */
  metadata?: string;
  /**
   * Watermark on the live video. Image format must be PNG. See RtcImage.
   * You can add one watermark or multiple using an array. This parameter is used with watermarkCount.
   */
  watermark?: RtcImage[];
  /**
   * Number of watermarks on the live video. The total number of watermarks and background images must be ≥ 0 and ≤ 10. Used with watermark.
   */
  watermarkCount?: number;
  /**
   * Background image on the live video. Image format must be PNG. See RtcImage.
   * You can add one background image or multiple using an array. This parameter is used with backgroundImageCount.
   */
  backgroundImage?: RtcImage[];
  /**
   * Number of background images on the live video. The total number of watermarks and background images must be ≥ 0 and ≤ 10. Used with backgroundImage.
   */
  backgroundImageCount?: number;
  /**
   * Audio sample rate (Hz) of the output media stream for RTMP streaming. See AudioSampleRateType.
   */
  audioSampleRate?: AudioSampleRateType;
  /**
   * Bitrate of the output audio for RTMP streaming. Unit: Kbps. Default is 48. Maximum is 128.
   */
  audioBitrate?: number;
  /**
   * Number of audio channels in the output audio for RTMP streaming. Default is 1. Value must be an integer in [1,5]. Recommended values are 1 or 2. Values 3, 4, and 5 require special player support:
   *  1: (default) Mono
   *  2: Stereo
   *  3: Three channels
   *  4: Four channels
   *  5: Five channels
   */
  audioChannels?: number;
  /**
   * Codec profile of the output audio for RTMP streaming. See AudioCodecProfileType.
   */
  audioCodecProfile?: AudioCodecProfileType;
  /**
   * Advanced features for transcoding and streaming. See LiveStreamAdvancedFeature.
   */
  advancedFeatures?: LiveStreamAdvancedFeature[];
  /**
   * Number of enabled advanced features. Default is 0.
   */
  advancedFeatureCount?: number;
}

/**
 * Video stream participating in local compositing.
 */
export class TranscodingVideoStream {
  /**
   * Type of video source participating in local compositing. See VideoSourceType.
   */
  sourceType?: VideoSourceType;
  /**
   * Remote user ID. Use this parameter only when the video source type for local compositing is VideoSourceRemote.
   */
  remoteUserUid?: number;
  /**
   * Use this parameter only when the video source type for local compositing is an image. Path to the local image. Example paths:
   *  macOS: ~/Pictures/image.png
   *  Windows: C:\\Users\\{username}\\Pictures\\image.png
   */
  imageUrl?: string;
  /**
   * (Optional) Media player ID. Required when sourceType is set to VideoSourceMediaPlayer.
   */
  mediaPlayerId?: number;
  /**
   * Horizontal offset of the top-left corner of the video relative to the top-left corner (origin) of the composite canvas.
   */
  x?: number;
  /**
   * Vertical offset of the top-left corner of the video relative to the top-left corner (origin) of the composite canvas.
   */
  y?: number;
  /**
   * Width (px) of the video in the local composite.
   */
  width?: number;
  /**
   * Height (px) of the video in the local composite.
   */
  height?: number;
  /**
   * Layer index of the video in the local composite. Value range: [0,100].
   *  0: (Default) Bottom layer.
   *  100: Top layer.
   */
  zOrder?: number;
  /**
   * Transparency of the video in the local composite. Value range: [0.0,1.0]. 0.0 means fully transparent, 1.0 means fully opaque.
   */
  alpha?: number;
  /**
   * This parameter only takes effect for camera video sources. Whether to mirror the video in the local composite: true : Mirror the video. false : (Default) Do not mirror the video.
   */
  mirror?: boolean;
}

/**
 * Configuration for local video compositing.
 */
export class LocalTranscoderConfiguration {
  /**
   * Number of video streams involved in local compositing.
   */
  streamCount?: number;
  /**
   * Video streams involved in local compositing. See TranscodingVideoStream.
   */
  videoInputStreams?: TranscodingVideoStream[];
  /**
   * Encoding configuration for the composited video after local compositing. See VideoEncoderConfiguration.
   */
  videoOutputConfiguration?: VideoEncoderConfiguration;
  /**
   * @ignore
   */
  syncWithPrimaryCamera?: boolean;
}

/**
 * Local composition error codes.
 */
export enum VideoTranscoderError {
  /**
   * 1: The specified video source has not started video capture. You need to create a video track for it and start video capture.
   */
  VtErrVideoSourceNotReady = 1,
  /**
   * 2: Invalid video source type. You need to reassign a supported video source type.
   */
  VtErrInvalidVideoSourceType = 2,
  /**
   * 3: Invalid image path. You need to reassign the correct image path.
   */
  VtErrInvalidImagePath = 3,
  /**
   * 4: Invalid image format. Make sure the image format is one of PNG, JPEG, or GIF.
   */
  VtErrUnsupportImageFormat = 4,
  /**
   * 5: The encoded resolution of the composed video is invalid.
   */
  VtErrInvalidLayout = 5,
  /**
   * 20: Internal unknown error.
   */
  VtErrInternal = 20,
}

/**
 * Configuration for last mile network probe.
 */
export class LastmileProbeConfig {
  /**
   * Whether to probe the uplink network. Some users, such as audience members in a live broadcast channel, do not need to perform network probing: true : Probe the uplink network. false : Do not probe the uplink network.
   */
  probeUplink?: boolean;
  /**
   * Whether to probe the downlink network: true : Probe the downlink network. false : Do not probe the downlink network.
   */
  probeDownlink?: boolean;
  /**
   * The expected maximum uplink bitrate in bps, ranging from [100000, 5000000]. It is recommended to set this value based on the bitrate value in setVideoEncoderConfiguration.
   */
  expectedUplinkBitrate?: number;
  /**
   * The expected maximum downlink bitrate in bps, ranging from [100000, 5000000].
   */
  expectedDownlinkBitrate?: number;
}

/**
 * Status of last mile quality probe result.
 */
export enum LastmileProbeResultState {
  /**
   * 1: Indicates the result of this last mile quality probe is complete.
   */
  LastmileProbeResultComplete = 1,
  /**
   * 2: Indicates the last mile quality probe did not perform bandwidth estimation, so the result is incomplete. One possible reason is temporary limitation of testing resources.
   */
  LastmileProbeResultIncompleteNoBwe = 2,
  /**
   * 3: Last mile quality probe was not performed. One possible reason is network disconnection.
   */
  LastmileProbeResultUnavailable = 3,
}

/**
 * Last mile uplink or downlink network quality probe result.
 */
export class LastmileProbeOneWayResult {
  /**
   * Packet loss rate.
   */
  packetLossRate?: number;
  /**
   * Network jitter (ms).
   */
  jitter?: number;
  /**
   * Estimated available network bandwidth (bps).
   */
  availableBandwidth?: number;
}

/**
 * Last mile uplink and downlink network quality probe result.
 */
export class LastmileProbeResult {
  /**
   * The state of the last mile probe result. See LastmileProbeResultState.
   */
  state?: LastmileProbeResultState;
  /**
   * Uplink network quality report. See LastmileProbeOneWayResult.
   */
  uplinkReport?: LastmileProbeOneWayResult;
  /**
   * Downlink network quality report. See LastmileProbeOneWayResult.
   */
  downlinkReport?: LastmileProbeOneWayResult;
  /**
   * Round-trip time (ms).
   */
  rtt?: number;
}

/**
 * The reason for a change in network connection state.
 */
export enum ConnectionChangedReasonType {
  /**
   * 0: Connecting to the network.
   */
  ConnectionChangedConnecting = 0,
  /**
   * 1: Successfully joined the channel.
   */
  ConnectionChangedJoinSuccess = 1,
  /**
   * 2: Network connection interrupted.
   */
  ConnectionChangedInterrupted = 2,
  /**
   * 3: Network connection is banned by the server. For example, this status is returned when the user is kicked out of the channel.
   */
  ConnectionChangedBannedByServer = 3,
  /**
   * 4: Failed to join the channel. If the SDK fails to join the channel after trying for 20 minutes, this status is returned and the SDK stops attempting to reconnect. Prompt the user to switch networks and try joining the channel again.
   */
  ConnectionChangedJoinFailed = 4,
  /**
   * 5: Left the channel.
   */
  ConnectionChangedLeaveChannel = 5,
  /**
   * 6: The App ID is invalid. Use a valid App ID to rejoin the channel and ensure the App ID matches the one generated in the Agora Console.
   */
  ConnectionChangedInvalidAppId = 6,
  /**
   * 7: The channel name is invalid. Use a valid channel name to rejoin the channel. A valid channel name is a string within 64 bytes. The supported character set includes 89 characters:
   */
  ConnectionChangedInvalidChannelName = 7,
  /**
   * 8: The Token is invalid. Possible reasons include:
   *  Your project has App Certificate enabled but you did not use a Token to join the channel.
   *  The user ID specified when calling joinChannel does not match the one used to generate the Token.
   *  The Token used to join the channel does not match the generated Token. Ensure that:
   *  You use a Token to join the channel if App Certificate is enabled.
   *  The user ID used to generate the Token matches the one used to join the channel.
   *  The Token used to join the channel matches the generated Token.
   */
  ConnectionChangedInvalidToken = 8,
  /**
   * 9: The current Token has expired. Generate a new Token on your server and rejoin the channel with the new Token.
   */
  ConnectionChangedTokenExpired = 9,
  /**
   * 10: This user is banned by the server. Possible reasons include:
   *  The user has already joined the channel and calls the join channel API again, such as joinChannel. Stop calling this method.
   *  The user tries to join a channel during a call test. Wait until the test ends before joining the channel.
   */
  ConnectionChangedRejectedByServer = 10,
  /**
   * 11: The SDK is attempting to reconnect due to proxy server settings.
   */
  ConnectionChangedSettingProxyServer = 11,
  /**
   * 12: The network connection state changed due to a Token renewal.
   */
  ConnectionChangedRenewToken = 12,
  /**
   * 13: The client IP address has changed. If this status code is received multiple times, prompt the user to switch networks and try rejoining the channel.
   */
  ConnectionChangedClientIpAddressChanged = 13,
  /**
   * 14: The connection between the SDK and the server timed out. The SDK enters automatic reconnection mode.
   */
  ConnectionChangedKeepAliveTimeout = 14,
  /**
   * 15: Successfully rejoined the channel.
   */
  ConnectionChangedRejoinSuccess = 15,
  /**
   * 16: The SDK lost connection with the server.
   */
  ConnectionChangedLost = 16,
  /**
   * 17: The connection state changed due to an echo test.
   */
  ConnectionChangedEchoTest = 17,
  /**
   * 18: The local IP address was changed by the user.
   */
  ConnectionChangedClientIpAddressChangedByUser = 18,
  /**
   * 19: The same UID joined the same channel from a different device.
   */
  ConnectionChangedSameUidLogin = 19,
  /**
   * 20: The number of broadcasters in the channel has reached the limit.
   */
  ConnectionChangedTooManyBroadcasters = 20,
  /**
   * @ignore
   */
  ConnectionChangedLicenseValidationFailure = 21,
  /**
   * @ignore
   */
  ConnectionChangedCertificationVeryfyFailure = 22,
}

/**
 * Reasons for user role switch failure.
 */
export enum ClientRoleChangeFailedReason {
  /**
   * 1: The number of broadcasters in the channel has reached the limit. This enum is only reported when the 128-user feature is enabled. The broadcaster limit depends on the configuration when enabling the 128-user feature.
   */
  ClientRoleChangeFailedTooManyBroadcasters = 1,
  /**
   * 2: Request was rejected by the server. It is recommended to prompt the user to try switching roles again.
   */
  ClientRoleChangeFailedNotAuthorized = 2,
  /**
   * 3: Request timed out. It is recommended to prompt the user to check their network connection and try switching roles again. Deprecated: This enum value is deprecated since v4.4.0 and is not recommended for use.
   */
  ClientRoleChangeFailedRequestTimeOut = 3,
  /**
   * 4: Network connection lost. You can troubleshoot the specific cause based on the reason reported by onConnectionStateChanged. Deprecated: This enum value is deprecated since v4.4.0 and is not recommended for use.
   */
  ClientRoleChangeFailedConnectionFailed = 4,
}

/**
 * @ignore
 */
export enum WlaccMessageReason {
  /**
   * @ignore
   */
  WlaccMessageReasonWeakSignal = 0,
  /**
   * @ignore
   */
  WlaccMessageReasonChannelCongestion = 1,
}

/**
 * @ignore
 */
export enum WlaccSuggestAction {
  /**
   * @ignore
   */
  WlaccSuggestActionCloseToWifi = 0,
  /**
   * @ignore
   */
  WlaccSuggestActionConnectSsid = 1,
  /**
   * @ignore
   */
  WlaccSuggestActionCheck5g = 2,
  /**
   * @ignore
   */
  WlaccSuggestActionModifySsid = 3,
}

/**
 * @ignore
 */
export class WlAccStats {
  /**
   * @ignore
   */
  e2eDelayPercent?: number;
  /**
   * @ignore
   */
  frozenRatioPercent?: number;
  /**
   * @ignore
   */
  lossRatePercent?: number;
}

/**
 * Type of network connection.
 */
export enum NetworkType {
  /**
   * -1: Unknown network connection type.
   */
  NetworkTypeUnknown = -1,
  /**
   * 0: Network connection is disconnected.
   */
  NetworkTypeDisconnected = 0,
  /**
   * 1: Network type is LAN.
   */
  NetworkTypeLan = 1,
  /**
   * 2: Network type is Wi-Fi (including hotspot).
   */
  NetworkTypeWifi = 2,
  /**
   * 3: Network type is 2G mobile network.
   */
  NetworkTypeMobile2g = 3,
  /**
   * 4: Network type is 3G mobile network.
   */
  NetworkTypeMobile3g = 4,
  /**
   * 5: Network type is 4G mobile network.
   */
  NetworkTypeMobile4g = 5,
  /**
   * 6: Network type is 5G mobile network.
   */
  NetworkTypeMobile5g = 6,
}

/**
 * View setup mode.
 */
export enum VideoViewSetupMode {
  /**
   * 0: (Default) Clears all added views and replaces them with new views.
   */
  VideoViewSetupReplace = 0,
  /**
   * 1: Adds a view.
   */
  VideoViewSetupAdd = 1,
  /**
   * 2: Removes a view. When a view is no longer needed, it is recommended to set setupMode to VideoViewSetupRemove in a timely manner to remove the view, otherwise it may cause rendering resource leaks.
   */
  VideoViewSetupRemove = 2,
}

/**
 * Properties of the video canvas object.
 */
export class VideoCanvas {
  /**
   * Video display window.
   */
  view?: any;
  /**
   * User ID of the published video source.
   */
  uid?: number;
  /**
   * Background color of the video canvas in RGBA format. Default is 0x00000000, which represents black.
   */
  backgroundColor?: number;
  /**
   * Video rendering mode. See RenderModeType.
   */
  renderMode?: RenderModeType;
  /**
   * View mirroring mode. See VideoMirrorModeType.
   *  Local view mirroring mode: If you use the front camera, local view mirroring is enabled by default; if you use the rear camera, it is disabled by default.
   *  Remote user view mirroring mode: Disabled by default.
   */
  mirrorMode?: VideoMirrorModeType;
  /**
   * View setup mode. See VideoViewSetupMode.
   */
  setupMode?: VideoViewSetupMode;
  /**
   * Type of video source. See VideoSourceType.
   */
  sourceType?: VideoSourceType;
  /**
   * Media player ID. You can get it via getMediaPlayerId.
   */
  mediaPlayerId?: number;
  /**
   * (Optional) Display area of the video frame. See Rectangle. width and height represent the pixel width and height of the area. The default is an empty value (width or height is 0), which means the actual resolution of the video frame is displayed.
   */
  cropArea?: Rectangle;
  /**
   * The receiver can render alpha channel information only when the sender enables the alpha transmission feature.
   *  To enable the alpha transmission feature, please [contact technical support](https://ticket.shengwang.cn/). (Optional) Whether to enable alpha mask rendering: true : Enable alpha mask rendering. false : (Default) Disable alpha mask rendering. Alpha mask rendering can create transparent images and extract portraits from video. When used with other methods, it can achieve effects such as picture-in-picture portraits or watermarking.
   */
  enableAlphaMask?: boolean;
  /**
   * @ignore
   */
  rotation?: VideoOrientation;
}

/**
 * Light contrast level.
 */
export enum LighteningContrastLevel {
  /**
   * 0: Low contrast.
   */
  LighteningContrastLow = 0,
  /**
   * 1: Normal contrast.
   */
  LighteningContrastNormal = 1,
  /**
   * 2: High contrast.
   */
  LighteningContrastHigh = 2,
}

/**
 * Beauty effect options.
 */
export class BeautyOptions {
  /**
   * Contrast level, usually used with lighteningLevel. The higher the value, the greater the contrast. See LighteningContrastLevel.
   */
  lighteningContrastLevel?: LighteningContrastLevel;
  /**
   * Whitening level. Value range is [0.0,1.0], where 0.0 means original brightness. Default is 0.0. The higher the value, the greater the whitening effect.
   */
  lighteningLevel?: number;
  /**
   * Smoothing level. Value range is [0.0,1.0], where 0.0 means original smoothness. Default is 0.0. The higher the value, the smoother the skin.
   */
  smoothnessLevel?: number;
  /**
   * Redness level. Value range is [0.0,1.0], where 0.0 means original redness. Default is 0.0. The higher the value, the redder the skin tone.
   */
  rednessLevel?: number;
  /**
   * Sharpening level. Value range is [0.0,1.0], where 0.0 means original sharpness. Default is 0.0. The higher the value, the sharper the image.
   */
  sharpnessLevel?: number;
}

/**
 * Low-light enhancement mode.
 */
export enum LowLightEnhanceMode {
  /**
   * 0: (Default) Auto mode. The SDK automatically enables or disables the low-light enhancement feature based on ambient light levels to provide appropriate lighting and prevent overexposure.
   */
  LowLightEnhanceAuto = 0,
  /**
   * 1: Manual mode. You need to manually enable or disable the low-light enhancement feature.
   */
  LowLightEnhanceManual = 1,
}

/**
 * Low-light enhancement level.
 */
export enum LowLightEnhanceLevel {
  /**
   * 0: (Default) Low-light enhancement prioritizing image quality, processes video brightness, details, and noise with moderate performance consumption and processing speed, providing optimal overall image quality.
   */
  LowLightEnhanceLevelHighQuality = 0,
  /**
   * 1: Low-light enhancement prioritizing performance, processes video brightness and details with lower performance consumption and faster processing speed.
   */
  LowLightEnhanceLevelFast = 1,
}

/**
 * Low-light enhancement options.
 */
export class LowlightEnhanceOptions {
  /**
   * Low-light enhancement mode. See LowLightEnhanceMode.
   */
  mode?: LowLightEnhanceMode;
  /**
   * Low-light enhancement level. See LowLightEnhanceLevel.
   */
  level?: LowLightEnhanceLevel;
}

/**
 * Video denoising mode.
 */
export enum VideoDenoiserMode {
  /**
   * 0: (Default) Auto mode. The SDK automatically enables or disables video denoising based on ambient light brightness.
   */
  VideoDenoiserAuto = 0,
  /**
   * 1: Manual mode. You need to manually enable or disable the video denoising feature.
   */
  VideoDenoiserManual = 1,
}

/**
 * Video denoising level.
 */
export enum VideoDenoiserLevel {
  /**
   * 0: (Default) Denoising prioritizing video quality. This level balances performance consumption and denoising effect. It has moderate performance consumption, moderate denoising speed, and optimal overall image quality.
   */
  VideoDenoiserLevelHighQuality = 0,
  /**
   * 1: Denoising prioritizing performance. This level focuses on saving performance at the cost of denoising effect. It has lower performance consumption and faster denoising speed. To avoid noticeable trailing artifacts in the processed video, it is recommended to use this setting when the camera is stationary.
   */
  VideoDenoiserLevelFast = 1,
  /**
   * @ignore
   */
  VideoDenoiserLevelStrength = 2,
}

/**
 * Video denoising options.
 */
export class VideoDenoiserOptions {
  /**
   * Video denoising mode.
   */
  mode?: VideoDenoiserMode;
  /**
   * Video denoising level.
   */
  level?: VideoDenoiserLevel;
}

/**
 * Color enhancement options.
 */
export class ColorEnhanceOptions {
  /**
   * Color enhancement intensity. Value range: [0.0,1.0]. 0.0 means no color enhancement is applied to the video. The higher the value, the stronger the enhancement. Default is 0.5.
   */
  strengthLevel?: number;
  /**
   * Skin tone protection level. Value range: [0.0,1.0]. 0.0 means no skin tone protection is applied. The higher the value, the stronger the protection. Default is 1.0.
   *  When the color enhancement level is high, facial skin tones may become noticeably distorted. You should set the skin tone protection level.
   *  A higher skin tone protection level may slightly reduce the color enhancement effect. Therefore, to achieve the best color enhancement effect, it is recommended that you dynamically adjust strengthLevel and skinProtectLevel to achieve the optimal result.
   */
  skinProtectLevel?: number;
}

/**
 * Custom background.
 */
export enum BackgroundSourceType {
  /**
   * @ignore
   */
  BackgroundNone = 0,
  /**
   * 1: (Default) Solid color background.
   */
  BackgroundColor = 1,
  /**
   * 2: Background image in PNG or JPG format.
   */
  BackgroundImg = 2,
  /**
   * 3: Background with blur effect.
   */
  BackgroundBlur = 3,
  /**
   * 4: Local video background in formats such as MP4, AVI, MKV, FLV.
   */
  BackgroundVideo = 4,
}

/**
 * Blur level of custom background image.
 */
export enum BackgroundBlurDegree {
  /**
   * 1: Low blur level for the custom background image. Users can almost clearly see the background.
   */
  BlurDegreeLow = 1,
  /**
   * 2: Medium blur level for the custom background image. Users have difficulty seeing the background clearly.
   */
  BlurDegreeMedium = 2,
  /**
   * 3: (Default) High blur level for the custom background image. Users can barely see the background.
   */
  BlurDegreeHigh = 3,
}

/**
 * Custom background.
 */
export class VirtualBackgroundSource {
  /**
   * Custom background. See BackgroundSourceType.
   */
  background_source_type?: BackgroundSourceType;
  /**
   * Color of the custom background image. The format is a hexadecimal integer defined in RGB, without the # symbol. For example, 0xFFB6C1 represents light pink. The default value is 0xFFFFFF, which represents white. The valid range is [0x000000, 0xffffff]. If the value is invalid, the SDK replaces the original background image with a white background. This parameter takes effect only when the custom background is of the following types:
   *  BackgroundColor: The background image is a solid color image of the color specified by this parameter.
   *  BackgroundImg: If the image in source has a transparent background, the color specified by this parameter is used to fill the transparent area.
   */
  color?: number;
  /**
   * Absolute local path of the custom background. Supports PNG, JPG, MP4, AVI, MKV, and FLV formats. If the path is invalid, the SDK uses the original background image or the solid color background specified by color. This parameter takes effect only when the custom background type is BackgroundImg or BackgroundVideo.
   */
  source?: string;
  /**
   * Blur level of the custom background image. See BackgroundBlurDegree. This parameter takes effect only when the custom background type is BackgroundBlur.
   */
  blur_degree?: BackgroundBlurDegree;
}

/**
 * Algorithm for background processing.
 */
export enum SegModelType {
  /**
   * 1: (Default) Background processing algorithm suitable for all scenarios.
   */
  SegModelAi = 1,
  /**
   * 2: Background processing algorithm suitable only for green screen scenarios.
   */
  SegModelGreen = 2,
}

/**
 * Processing properties for background images.
 */
export class SegmentationProperty {
  /**
   * Algorithm used for background processing. See SegModelType.
   */
  modelType?: SegModelType;
  /**
   * Accuracy range for identifying background colors in the image. Value range: [0,1], default is 0.5. The higher the value, the wider the range of solid colors that can be identified. If the value is too high, solid colors at the edge or within the portrait may also be identified. It is recommended to adjust this value dynamically based on actual effects. This parameter takes effect only when modelType is set to SegModelGreen.
   */
  greenCapacity?: number;
}

/**
 * Type of custom audio capture track.
 */
export enum AudioTrackType {
  /**
   * @ignore
   */
  AudioTrackInvalid = -1,
  /**
   * 0: Mixable audio track. Supports mixing with other audio streams (e.g., microphone-captured audio) before local playback or publishing to the channel. Has higher latency compared to non-mixable audio tracks.
   */
  AudioTrackMixable = 0,
  /**
   * 1: Non-mixable audio track. Replaces microphone capture and does not support mixing with other audio streams. Has lower latency compared to mixable audio tracks. If AudioTrackDirect is specified, publishMicrophoneTrack in ChannelMediaOptions must be set to false when calling joinChannel, otherwise joining the channel will fail and return error code -2.
   */
  AudioTrackDirect = 1,
}

/**
 * Configuration options for custom audio tracks.
 */
export class AudioTrackConfig {
  /**
   * Whether to enable local audio playback: true : (default) Enable local audio playback. false : Disable local audio playback.
   */
  enableLocalPlayback?: boolean;
}

/**
 * @ignore
 */
export enum LoopbackAudioTrackType {
  /**
   * @ignore
   */
  LoopbackSystem = 0,
  /**
   * @ignore
   */
  LoopbackSystemExcludeSelf = 1,
  /**
   * @ignore
   */
  LoopbackApplication = 2,
  /**
   * @ignore
   */
  LoopbackProcess = 3,
}

/**
 * @ignore
 */
export class LoopbackAudioTrackConfig {
  /**
   * @ignore
   */
  loopbackType?: LoopbackAudioTrackType;
  /**
   * @ignore
   */
  volume?: number;
  /**
   * @ignore
   */
  deviceName?: string;
  /**
   * @ignore
   */
  appName?: string;
  /**
   * @ignore
   */
  processId?: number;
}

/**
 * Preset voice beautifier options.
 */
export enum VoiceBeautifierPreset {
  /**
   * Original voice, i.e., disables voice beautifier effects.
   */
  VoiceBeautifierOff = 0x00000000,
  /**
   * Magnetic (male). This setting is only effective for male voices. Do not apply to female voices, or audio distortion may occur.
   */
  ChatBeautifierMagnetic = 0x01010100,
  /**
   * Fresh (female). This setting is only effective for female voices. Do not apply to male voices, or audio distortion may occur.
   */
  ChatBeautifierFresh = 0x01010200,
  /**
   * Energetic (female). This setting is only effective for female voices. Do not apply to male voices, or audio distortion may occur.
   */
  ChatBeautifierVitality = 0x01010300,
  /**
   * Singing beautifier.
   *  If you call setVoiceBeautifierPreset (SingingBeautifier), you can beautify male voices and add small-room reverb effects. Do not apply to female voices, or audio distortion may occur.
   *  If you call setVoiceBeautifierParameters (SingingBeautifier, param1, param2), you can beautify either male or female voices and add reverb effects.
   */
  SingingBeautifier = 0x01020100,
  /**
   * Vigorous.
   */
  TimbreTransformationVigorous = 0x01030100,
  /**
   * Deep.
   */
  TimbreTransformationDeep = 0x01030200,
  /**
   * Mellow.
   */
  TimbreTransformationMellow = 0x01030300,
  /**
   * Falsetto.
   */
  TimbreTransformationFalsetto = 0x01030400,
  /**
   * Full.
   */
  TimbreTransformationFull = 0x01030500,
  /**
   * Clear.
   */
  TimbreTransformationClear = 0x01030600,
  /**
   * Resounding.
   */
  TimbreTransformationResounding = 0x01030700,
  /**
   * Ringing.
   */
  TimbreTransformationRinging = 0x01030800,
  /**
   * Ultra-high quality voice, which makes audio clearer and richer in detail.
   *  For better results, it is recommended to set the profile parameter of setAudioProfile2 to AudioProfileMusicHighQuality (4) or AudioProfileMusicHighQualityStereo (5), and the scenario parameter to AudioScenarioGameStreaming (3) before calling setVoiceBeautifierPreset.
   *  If the user's audio capture device can highly reproduce audio details, it is recommended not to enable ultra-high quality voice, otherwise the SDK may over-enhance the audio details and fail to achieve the expected effect.
   */
  UltraHighQualityVoice = 0x01040100,
}

/**
 * Preset audio effect options.
 *
 * setAudioProfile profile
 * Preset audio effects profile
 *  RoomAcousticsVirtualStereo
 *  RoomAcoustics3dVoice
 *  RoomAcousticsVirtualSurroundSound AudioProfileMusicHighQualityStereo or AudioProfileMusicStandardStereo Other preset effects (excluding AudioEffectOff) AudioProfileMusicHighQuality or AudioProfileMusicHighQualityStereo
 */
export enum AudioEffectPreset {
  /**
   * Original sound, disables voice effects.
   */
  AudioEffectOff = 0x00000000,
  /**
   * KTV.
   */
  RoomAcousticsKtv = 0x02010100,
  /**
   * Concert.
   */
  RoomAcousticsVocalConcert = 0x02010200,
  /**
   * Studio.
   */
  RoomAcousticsStudio = 0x02010300,
  /**
   * Phonograph.
   */
  RoomAcousticsPhonograph = 0x02010400,
  /**
   * Virtual stereo, where the SDK renders mono audio into stereo effect.
   */
  RoomAcousticsVirtualStereo = 0x02010500,
  /**
   * Spacious.
   */
  RoomAcousticsSpacial = 0x02010600,
  /**
   * Ethereal.
   */
  RoomAcousticsEthereal = 0x02010700,
  /**
   * 3D voice, where the SDK renders audio to surround the user. The default surround cycle is 10 seconds. After setting this effect, you can also call setAudioEffectParameters to modify the surround cycle. To hear the expected effect, users must use audio playback devices that support stereo when 3D voice is enabled.
   */
  RoomAcoustics3dVoice = 0x02010800,
  /**
   * Virtual surround sound, where the SDK generates a simulated surround sound field based on stereo to create a surround effect. To hear the expected effect, users must use audio playback devices that support stereo when virtual surround sound is enabled.
   */
  RoomAcousticsVirtualSurroundSound = 0x02010900,
  /**
   * Deep male voice. Recommended for processing male voices; otherwise, the effect may not be as expected.
   */
  VoiceChangerEffectUncle = 0x02020100,
  /**
   * Elderly male. Recommended for processing male voices; otherwise, the effect may not be as expected.
   */
  VoiceChangerEffectOldman = 0x02020200,
  /**
   * Boy. Recommended for processing male voices; otherwise, the effect may not be as expected.
   */
  VoiceChangerEffectBoy = 0x02020300,
  /**
   * Young woman. Recommended for processing female voices; otherwise, the effect may not be as expected.
   */
  VoiceChangerEffectSister = 0x02020400,
  /**
   * Girl. Recommended for processing female voices; otherwise, the effect may not be as expected.
   */
  VoiceChangerEffectGirl = 0x02020500,
  /**
   * Pig King.
   */
  VoiceChangerEffectPigking = 0x02020600,
  /**
   * Hulk.
   */
  VoiceChangerEffectHulk = 0x02020700,
  /**
   * R&B.
   */
  StyleTransformationRnb = 0x02030100,
  /**
   * Pop.
   */
  StyleTransformationPopular = 0x02030200,
  /**
   * Auto-tune, where the SDK corrects the actual pitch based on a natural major scale with C as the tonic. After setting this effect, you can also call setAudioEffectParameters to adjust the base scale and tonic pitch.
   */
  PitchCorrection = 0x02040100,
}

/**
 * Preset voice conversion options.
 */
export enum VoiceConversionPreset {
  /**
   * Original voice, i.e., disables voice conversion effects.
   */
  VoiceConversionOff = 0x00000000,
  /**
   * Neutral. To avoid audio distortion, ensure this effect is only applied to female voices.
   */
  VoiceChangerNeutral = 0x03010100,
  /**
   * Sweet. To avoid audio distortion, ensure this effect is only applied to female voices.
   */
  VoiceChangerSweet = 0x03010200,
  /**
   * Steady. To avoid audio distortion, ensure this effect is only applied to male voices.
   */
  VoiceChangerSolid = 0x03010300,
  /**
   * Deep. To avoid audio distortion, ensure this effect is only applied to male voices.
   */
  VoiceChangerBass = 0x03010400,
  /**
   * @ignore
   */
  VoiceChangerCartoon = 0x03010500,
  /**
   * @ignore
   */
  VoiceChangerChildlike = 0x03010600,
  /**
   * @ignore
   */
  VoiceChangerPhoneOperator = 0x03010700,
  /**
   * @ignore
   */
  VoiceChangerMonster = 0x03010800,
  /**
   * @ignore
   */
  VoiceChangerTransformers = 0x03010900,
  /**
   * @ignore
   */
  VoiceChangerGroot = 0x03010a00,
  /**
   * @ignore
   */
  VoiceChangerDarthVader = 0x03010b00,
  /**
   * @ignore
   */
  VoiceChangerIronLady = 0x03010c00,
  /**
   * @ignore
   */
  VoiceChangerShinChan = 0x03010d00,
  /**
   * @ignore
   */
  VoiceChangerGirlishMan = 0x03010e00,
  /**
   * @ignore
   */
  VoiceChangerChipmunk = 0x03010f00,
}

/**
 * Preset headphone equalizer types.
 */
export enum HeadphoneEqualizerPreset {
  /**
   * Turn off headphone equalizer and listen to original audio.
   */
  HeadphoneEqualizerOff = 0x00000000,
  /**
   * Use over-ear headphone equalizer.
   */
  HeadphoneEqualizerOverear = 0x04000001,
  /**
   * Use in-ear headphone equalizer.
   */
  HeadphoneEqualizerInear = 0x04000002,
}

/**
 * Parameter configuration for screen sharing.
 */
export class ScreenCaptureParameters {
  /**
   * When setting the encoding resolution in a document sharing scenario (ScreenScenarioDocument), choose one of the following:
   *  For optimal image quality, set the encoding resolution equal to the capture resolution.
   *  To balance image quality, bandwidth, and system performance:
   *  If the capture resolution is greater than 1920 × 1080, set the encoding resolution no lower than 1920 × 1080.
   *  If the capture resolution is less than 1920 × 1080, set the encoding resolution no lower than 1280 × 720. Video encoding resolution of the screen sharing stream. See VideoDimensions. Default value is 1920 × 1080, i.e., 2073600 pixels. This pixel value is used for billing. When the aspect ratio of the shared screen resolution differs from this setting, the SDK encodes based on the following strategy. Assuming dimensions is set to 1920 × 1080:
   *  If the screen resolution is smaller than dimensions, such as 1000 × 1000, the SDK encodes at 1000 × 1000.
   *  If the screen resolution is larger than dimensions, such as 2000 × 1500, the SDK encodes at the maximum resolution within dimensions that matches the screen's aspect ratio, i.e., 1440 × 1080.
   */
  dimensions?: VideoDimensions;
  /**
   * On Windows and macOS, indicates the video encoding frame rate of the screen sharing stream. Unit: fps; default is 5. It is recommended not to exceed 15.
   */
  frameRate?: number;
  /**
   * On Windows and macOS, indicates the video encoding bitrate of the screen sharing stream. Unit: Kbps; default is 0, which means the SDK calculates a reasonable value based on the current shared screen resolution.
   */
  bitrate?: number;
  /**
   * Due to macOS system limitations, setting this parameter to false has no effect when sharing the screen (no effect when sharing a window). Whether to capture the mouse for screen sharing: true : (Default) Capture the mouse. false : Do not capture the mouse.
   */
  captureMouseCursor?: boolean;
  /**
   * Due to macOS system limitations, when setting this member to bring the window to the front, only the main window is brought to the front if the application has multiple windows. When calling startScreenCaptureByWindowId to share a window, whether to bring the window to the front: true : Bring the window to the front. false : (Default) Do not bring the window to the front.
   */
  windowFocus?: boolean;
  /**
   * List of IDs of windows to be excluded. When calling startScreenCaptureByDisplayId to start screen sharing, you can use this parameter to exclude specified windows. You can also dynamically exclude windows by using this parameter when calling updateScreenCaptureParameters to update screen sharing configuration. This parameter is not supported in Electron for UnionTech OS SDK.
   */
  excludeWindowList?: any[];
  /**
   * Number of windows to be excluded. On Windows, the maximum value of this parameter is 24. If it exceeds this value, the window exclusion feature becomes invalid.
   * This parameter is not supported in Electron for Kylin OS SDK.
   */
  excludeWindowCount?: number;
  /**
   * Highlight border width (px). Default is 5. Value range: (0,50]. This parameter takes effect only when highLighted is set to true.
   */
  highLightWidth?: number;
  /**
   * On Windows, specifies the ARGB color of the highlight. Default value is 0xFF8CBF26.
   *  On macOS, COLOR_CLASS refers to NSColor.
   */
  highLightColor?: number;
  /**
   * When sharing a partial region of a window or screen, if this parameter is set to true, the SDK highlights the entire window or screen. Whether to highlight the shared window or screen: true : Highlight. false : (Default) Do not highlight.
   */
  enableHighLight?: boolean;
}

/**
 * Audio recording quality.
 */
export enum AudioRecordingQualityType {
  /**
   * 0: Low quality. Sampling rate is 32 kHz, file size for 10 minutes of recording is approximately 1.2 MB.
   */
  AudioRecordingQualityLow = 0,
  /**
   * 1: Medium quality. Sampling rate is 32 kHz, file size for 10 minutes of recording is approximately 2 MB.
   */
  AudioRecordingQualityMedium = 1,
  /**
   * 2: High quality. Sampling rate is 32 kHz, file size for 10 minutes of recording is approximately 3.75 MB.
   */
  AudioRecordingQualityHigh = 2,
  /**
   * 3: Ultra-high quality. Sampling rate is 32 kHz, file size for 10 minutes of recording is approximately 7.5 MB.
   */
  AudioRecordingQualityUltraHigh = 3,
}

/**
 * Recording content. Set in startAudioRecording.
 */
export enum AudioFileRecordingType {
  /**
   * 1: Record only the local user's audio.
   */
  AudioFileRecordingMic = 1,
  /**
   * 2: Record only the audio of all remote users.
   */
  AudioFileRecordingPlayback = 2,
  /**
   * 3: Record the mixed audio of the local and all remote users.
   */
  AudioFileRecordingMixed = 3,
}

/**
 * Audio encoding content.
 */
export enum AudioEncodedFrameObserverPosition {
  /**
   * 1: Encode only the local user's audio.
   */
  AudioEncodedFrameObserverPositionRecord = 1,
  /**
   * 2: Encode only the audio of all remote users.
   */
  AudioEncodedFrameObserverPositionPlayback = 2,
  /**
   * 3: Encode the mixed audio of the local and all remote users.
   */
  AudioEncodedFrameObserverPositionMixed = 3,
}

/**
 * Recording configuration.
 */
export class AudioRecordingConfiguration {
  /**
   * Absolute path to save the recording file locally, including file name and extension. For example: C:\music\audio.aac. Make sure the specified path exists and is writable.
   */
  filePath?: string;
  /**
   * Whether to encode the audio data: true : Encode the audio data using AAC. false : (default) Do not encode, save the raw recorded audio data.
   */
  encode?: boolean;
  /**
   * If you set this parameter to 44100 or 48000, to ensure recording quality, it is recommended to record in WAV format or AAC files with quality set to AudioRecordingQualityMedium or AudioRecordingQualityHigh. Recording sample rate (Hz).
   *  16000
   *  32000 (default)
   *  44100
   *  48000
   */
  sampleRate?: number;
  /**
   * Recording content. See AudioFileRecordingType.
   */
  fileRecordingType?: AudioFileRecordingType;
  /**
   * Recording quality. See AudioRecordingQualityType. This parameter applies to AAC files only.
   */
  quality?: AudioRecordingQualityType;
  /**
   * The actual recorded audio channel depends on the captured audio channel:
   *  If the captured audio is mono and recordingChannel is set to 2, the recorded audio will be stereo with duplicated mono data, not true stereo.
   *  If the captured audio is stereo and recordingChannel is set to 1, the recorded audio will be mono with mixed stereo data. Additionally, the integration scheme may affect the final recorded audio channel. If you want to record stereo, please [contact technical support](https://ticket.shengwang.cn/) for assistance. Audio channel for recording. Supported values:
   *  1: (default) Mono.
   *  2: Stereo.
   */
  recordingChannel?: number;
}

/**
 * Observer settings for encoded audio.
 */
export class AudioEncodedFrameObserverConfig {
  /**
   * Audio encoding content. See AudioEncodedFrameObserverPosition.
   */
  postionType?: AudioEncodedFrameObserverPosition;
  /**
   * Audio encoding type. See AudioEncodingType.
   */
  encodingType?: AudioEncodingType;
}

/**
 * Observer for encoded audio frames.
 */
export interface IAudioEncodedFrameObserver {
  /**
   * Retrieves the encoded audio data of the local user.
   *
   * After calling registerAudioEncodedFrameObserver and setting the audio encoding content to AudioEncodedFrameObserverPositionRecord, you can use this callback to get the encoded audio data of the local user.
   *
   * @param frameBuffer Audio buffer.
   * @param length Length of the audio data, in bytes.
   * @param audioEncodedFrameInfo Information about the encoded audio. See EncodedAudioFrameInfo.
   */
  onRecordAudioEncodedFrame?(
    frameBuffer: Uint8Array,
    length: number,
    audioEncodedFrameInfo: EncodedAudioFrameInfo
  ): void;

  /**
   * Retrieves the encoded audio data of all remote users.
   *
   * After calling registerAudioEncodedFrameObserver and setting the audio encoding content to AudioEncodedFrameObserverPositionPlayback, you can use this callback to get the encoded audio data of all remote users.
   *
   * @param frameBuffer Audio buffer.
   * @param length Length of the audio data, in bytes.
   * @param audioEncodedFrameInfo Information about the encoded audio. See EncodedAudioFrameInfo.
   */
  onPlaybackAudioEncodedFrame?(
    frameBuffer: Uint8Array,
    length: number,
    audioEncodedFrameInfo: EncodedAudioFrameInfo
  ): void;

  /**
   * Retrieves the encoded audio data after mixing local and all remote users' audio.
   *
   * After calling registerAudioEncodedFrameObserver and setting the audio encoding content to AudioEncodedFrameObserverPositionMixed, you can use this callback to get the encoded audio data after mixing local and all remote users' audio.
   *
   * @param frameBuffer Audio buffer.
   * @param length Length of the audio data, in bytes.
   * @param audioEncodedFrameInfo Information about the encoded audio. See EncodedAudioFrameInfo.
   */
  onMixedAudioEncodedFrame?(
    frameBuffer: Uint8Array,
    length: number,
    audioEncodedFrameInfo: EncodedAudioFrameInfo
  ): void;
}

/**
 * The region where the SDK connects to the server.
 */
export enum AreaCode {
  /**
   * Mainland China.
   */
  AreaCodeCn = 0x00000001,
  /**
   * North America.
   */
  AreaCodeNa = 0x00000002,
  /**
   * Europe.
   */
  AreaCodeEu = 0x00000004,
  /**
   * Asia excluding Mainland China.
   */
  AreaCodeAs = 0x00000008,
  /**
   * Japan.
   */
  AreaCodeJp = 0x00000010,
  /**
   * India.
   */
  AreaCodeIn = 0x00000020,
  /**
   * Global.
   */
  AreaCodeGlob = 0xffffffff,
}

/**
 * @ignore
 */
export enum AreaCodeEx {
  /**
   * @ignore
   */
  AreaCodeOc = 0x00000040,
  /**
   * @ignore
   */
  AreaCodeSa = 0x00000080,
  /**
   * @ignore
   */
  AreaCodeAf = 0x00000100,
  /**
   * @ignore
   */
  AreaCodeKr = 0x00000200,
  /**
   * @ignore
   */
  AreaCodeHkmc = 0x00000400,
  /**
   * @ignore
   */
  AreaCodeUs = 0x00000800,
  /**
   * @ignore
   */
  AreaCodeRu = 0x00001000,
  /**
   * @ignore
   */
  AreaCodeOvs = 0xfffffffe,
}

/**
 * Error codes for cross-channel media stream relay.
 */
export enum ChannelMediaRelayError {
  /**
   * 0: Everything is working properly.
   */
  RelayOk = 0,
  /**
   * 1: Server returned an error.
   */
  RelayErrorServerErrorResponse = 1,
  /**
   * 2: No response from the server.
   * This error may be caused by poor network conditions. If this error occurs when initiating cross-channel media relay, you can try again later; if it occurs during the relay process, you can call the leaveChannel method to leave the channel.
   * It may also be due to the current App ID not having cross-channel media relay enabled. You can [contact technical support](https://ticket.shengwang.cn/) to request enabling this feature.
   */
  RelayErrorServerNoResponse = 2,
  /**
   * 3: The SDK cannot access the service, possibly due to limited server resources.
   */
  RelayErrorNoResourceAvailable = 3,
  /**
   * 4: Failed to initiate cross-channel media stream relay request.
   */
  RelayErrorFailedJoinSrc = 4,
  /**
   * 5: Failed to accept cross-channel media stream relay request.
   */
  RelayErrorFailedJoinDest = 5,
  /**
   * 6: Server failed to receive cross-channel media stream.
   */
  RelayErrorFailedPacketReceivedFromSrc = 6,
  /**
   * 7: Server failed to send cross-channel media stream.
   */
  RelayErrorFailedPacketSentToDest = 7,
  /**
   * 8: SDK disconnected from the server due to poor network quality. You can call the leaveChannel method to leave the current channel.
   */
  RelayErrorServerConnectionLost = 8,
  /**
   * 9: Internal server error.
   */
  RelayErrorInternalError = 9,
  /**
   * 10: The token for the source channel has expired.
   */
  RelayErrorSrcTokenExpired = 10,
  /**
   * 11: The token for the destination channel has expired.
   */
  RelayErrorDestTokenExpired = 11,
}

/**
 * @ignore
 */
export enum ChannelMediaRelayEvent {
  /**
   * @ignore
   */
  RelayEventNetworkDisconnected = 0,
  /**
   * @ignore
   */
  RelayEventNetworkConnected = 1,
  /**
   * @ignore
   */
  RelayEventPacketJoinedSrcChannel = 2,
  /**
   * @ignore
   */
  RelayEventPacketJoinedDestChannel = 3,
  /**
   * @ignore
   */
  RelayEventPacketSentToDestChannel = 4,
  /**
   * @ignore
   */
  RelayEventPacketReceivedVideoFromSrc = 5,
  /**
   * @ignore
   */
  RelayEventPacketReceivedAudioFromSrc = 6,
  /**
   * @ignore
   */
  RelayEventPacketUpdateDestChannel = 7,
  /**
   * @ignore
   */
  RelayEventPacketUpdateDestChannelRefused = 8,
  /**
   * @ignore
   */
  RelayEventPacketUpdateDestChannelNotChange = 9,
  /**
   * @ignore
   */
  RelayEventPacketUpdateDestChannelIsNull = 10,
  /**
   * @ignore
   */
  RelayEventVideoProfileUpdate = 11,
  /**
   * @ignore
   */
  RelayEventPauseSendPacketToDestChannelSuccess = 12,
  /**
   * @ignore
   */
  RelayEventPauseSendPacketToDestChannelFailed = 13,
  /**
   * @ignore
   */
  RelayEventResumeSendPacketToDestChannelSuccess = 14,
  /**
   * @ignore
   */
  RelayEventResumeSendPacketToDestChannelFailed = 15,
}

/**
 * State codes for cross-channel media stream relay.
 */
export enum ChannelMediaRelayState {
  /**
   * 0: Initial state. After successfully calling stopChannelMediaRelay to stop the relay, onChannelMediaRelayStateChanged will return this state.
   */
  RelayStateIdle = 0,
  /**
   * 1: SDK is attempting cross-channel relay.
   */
  RelayStateConnecting = 1,
  /**
   * 2: The broadcaster from the source channel has successfully joined the destination channel.
   */
  RelayStateRunning = 2,
  /**
   * 3: An error occurred. See the code parameter in onChannelMediaRelayStateChanged for details.
   */
  RelayStateFailure = 3,
}

/**
 * Channel media information.
 */
export class ChannelMediaInfo {
  /**
   * Channel name.
   */
  channelName?: string;
  /**
   * Token used to join the channel.
   */
  token?: string;
  /**
   * User ID.
   */
  uid?: number;
}

/**
 * Cross-channel media stream relay configuration.
 */
export class ChannelMediaRelayConfiguration {
  /**
   * Source channel information ChannelMediaInfo, including the following members: channelName : Name of the source channel. The default value is null, which means the SDK populates the current channel name. token : The token used to join the source channel. It is generated based on the channelName and uid you set in srcInfo.
   *  If App Certificate is not enabled, you can set this parameter to the default value null, indicating the SDK uses the App ID.
   *  If App Certificate is enabled, you must provide a token generated using channelName and uid, and the uid must be 0. uid : The UID identifying the media stream to be relayed in the source channel. The default value is 0. Do not modify it.
   */
  srcInfo?: ChannelMediaInfo;
  /**
   * If the token of any destination channel expires, all cross-channel relays will stop. Therefore, it is recommended that you set the same expiration duration for all destination channel tokens. Destination channel information ChannelMediaInfo, including the following members: channelName : Name of the destination channel. token : The token used to join the destination channel. It is generated based on the channelName and uid you set in destInfos.
   *  If App Certificate is not enabled, you can set this parameter to the default value null, indicating the SDK uses the App ID.
   *  If App Certificate is enabled, you must provide a token generated using channelName and uid. uid : The UID identifying the media stream to be relayed in the destination channel. The value range is [0, 2^32 - 1]. Ensure it is different from all UIDs in the destination channel. The default value is 0, which means the SDK randomly assigns a UID.
   */
  destInfos?: ChannelMediaInfo[];
  /**
   * Number of destination channels. The default value is 0. Value range: [0,6]. This parameter should match the number of ChannelMediaInfo objects defined in destInfos.
   */
  destCount?: number;
}

/**
 * Uplink network information.
 */
export class UplinkNetworkInfo {
  /**
   * Target bitrate (bps) for the video encoder.
   */
  video_encoder_target_bitrate_bps?: number;
}

/**
 * @ignore
 */
export class PeerDownlinkInfo {
  /**
   * @ignore
   */
  uid?: string;
  /**
   * @ignore
   */
  stream_type?: VideoStreamType;
  /**
   * @ignore
   */
  current_downscale_level?: RemoteVideoDownscaleLevel;
  /**
   * @ignore
   */
  expected_bitrate_bps?: number;
}

/**
 * @ignore
 */
export class DownlinkNetworkInfo {
  /**
   * @ignore
   */
  lastmile_buffer_delay_time_ms?: number;
  /**
   * @ignore
   */
  bandwidth_estimation_bps?: number;
  /**
   * @ignore
   */
  total_downscale_level_count?: number;
  /**
   * @ignore
   */
  peer_downlink_info?: PeerDownlinkInfo[];
  /**
   * @ignore
   */
  total_received_video_count?: number;
}

/**
 * Built-in encryption modes.
 *
 * It is recommended to use Aes128Gcm2 or Aes256Gcm2 encryption modes. These modes support salt and provide higher security.
 */
export enum EncryptionMode {
  /**
   * 1: 128-bit AES encryption, XTS mode.
   */
  Aes128Xts = 1,
  /**
   * 2: 128-bit AES encryption, ECB mode.
   */
  Aes128Ecb = 2,
  /**
   * 3: 256-bit AES encryption, XTS mode.
   */
  Aes256Xts = 3,
  /**
   * 4: 128-bit SM4 encryption, ECB mode.
   */
  Sm4128Ecb = 4,
  /**
   * 5: 128-bit AES encryption, GCM mode.
   */
  Aes128Gcm = 5,
  /**
   * 6: 256-bit AES encryption, GCM mode.
   */
  Aes256Gcm = 6,
  /**
   * 7: (Default) 128-bit AES encryption, GCM mode. This encryption mode requires setting a salt (encryptionKdfSalt).
   */
  Aes128Gcm2 = 7,
  /**
   * 8: 256-bit AES encryption, GCM mode. This encryption mode requires setting a salt (encryptionKdfSalt).
   */
  Aes256Gcm2 = 8,
  /**
   * Enumeration boundary value.
   */
  ModeEnd = 9,
}

/**
 * Configures the built-in encryption mode and key.
 */
export class EncryptionConfig {
  /**
   * Built-in encryption mode. See EncryptionMode. It is recommended to use Aes128Gcm2 or Aes256Gcm2 encryption modes. These modes support salt and offer higher security.
   */
  encryptionMode?: EncryptionMode;
  /**
   * Built-in encryption key of type string with no length limit. A 32-byte key is recommended. If this parameter is not specified or set to null, built-in encryption cannot be enabled and the SDK returns error code -2.
   */
  encryptionKey?: string;
  /**
   * Salt with a length of 32 bytes. It is recommended to generate the salt on the server using OpenSSL. This parameter is effective only in Aes128Gcm2 or Aes256Gcm2 encryption modes. In this case, ensure the value of this parameter is not all 0.
   */
  encryptionKdfSalt?: number[];
  /**
   * Whether to enable data stream encryption: true : Enable data stream encryption. false : (Default) Disable data stream encryption.
   */
  datastreamEncryptionEnabled?: boolean;
}

/**
 * Error types for built-in encryption.
 */
export enum EncryptionErrorType {
  /**
   * 0: Internal error.
   */
  EncryptionErrorInternalFailure = 0,
  /**
   * 1: Media stream decryption error. Make sure the encryption mode or key used on the receiving and sending ends is the same.
   */
  EncryptionErrorDecryptionFailure = 1,
  /**
   * 2: Media stream encryption error.
   */
  EncryptionErrorEncryptionFailure = 2,
  /**
   * 3: Data stream decryption error. Make sure the encryption mode or key used on the receiving and sending ends is the same.
   */
  EncryptionErrorDatastreamDecryptionFailure = 3,
  /**
   * 4: Data stream encryption error.
   */
  EncryptionErrorDatastreamEncryptionFailure = 4,
}

/**
 * @ignore
 */
export enum UploadErrorReason {
  /**
   * @ignore
   */
  UploadSuccess = 0,
  /**
   * @ignore
   */
  UploadNetError = 1,
  /**
   * @ignore
   */
  UploadServerError = 2,
}

/**
 * Type of device permission.
 */
export enum PermissionType {
  /**
   * 0: Permission for audio recording device.
   */
  RecordAudio = 0,
  /**
   * 1: Permission for camera.
   */
  Camera = 1,
  /**
   * @ignore
   */
  ScreenCapture = 2,
}

/**
 * Maximum length of the user account.
 */
export enum MaxUserAccountLengthType {
  /**
   * The maximum length of the user account is 255 characters.
   */
  MaxUserAccountLength = 256,
}

/**
 * Subscribe state.
 */
export enum StreamSubscribeState {
  /**
   * 0: Initial subscribe state after joining the channel.
   */
  SubStateIdle = 0,
  /**
   * 1: Subscription failed. Possible reasons:
   *  Remote user:
   *  Called muteLocalAudioStream (true) or muteLocalVideoStream (true) to stop sending local media streams.
   *  Called disableAudio or disableVideo to disable local audio or video modules.
   *  Called enableLocalAudio (false) or enableLocalVideo (false) to disable local audio or video capture.
   *  User role is audience.
   *  Local user called the following methods to stop receiving remote media streams:
   *  Called muteRemoteAudioStream (true), muteAllRemoteAudioStreams (true) to stop receiving remote audio streams.
   *  Called muteRemoteVideoStream (true), muteAllRemoteVideoStreams (true) to stop receiving remote video streams.
   */
  SubStateNoSubscribed = 1,
  /**
   * 2: Subscribing.
   */
  SubStateSubscribing = 2,
  /**
   * 3: Remote stream received, subscription successful.
   */
  SubStateSubscribed = 3,
}

/**
 * Publish state.
 */
export enum StreamPublishState {
  /**
   * 0: Initial publish state after joining the channel.
   */
  PubStateIdle = 0,
  /**
   * 1: Publish failed. Possible reasons:
   *  The local user called muteLocalAudioStream (true) or muteLocalVideoStream (true) to stop sending local media streams.
   *  The local user called disableAudio or disableVideo to disable local audio or video modules.
   *  The local user called enableLocalAudio (false) or enableLocalVideo (false) to disable local audio or video capture.
   *  The local user is an audience member.
   */
  PubStateNoPublished = 1,
  /**
   * 2: Publishing.
   */
  PubStatePublishing = 2,
  /**
   * 3: Publish successful.
   */
  PubStatePublished = 3,
}

/**
 * Configuration for audio and video loop test.
 */
export class EchoTestConfiguration {
  /**
   * The view used to render the local user's video. This parameter is only applicable for testing video devices. Make sure enableVideo is set to true.
   */
  view?: any;
  /**
   * Whether to enable the audio device: true : (Default) Enable the audio device. Set to true to test the audio device. false : Disable the audio device.
   */
  enableAudio?: boolean;
  /**
   * Whether to enable the video device. Video device detection is not currently supported. Set this parameter to false.
   */
  enableVideo?: boolean;
  /**
   * The token used to ensure the security of the audio and video loop test. If you have not enabled the App Certificate in the console, you do not need to pass a value for this parameter. If you have enabled the App Certificate in the console, you must pass in a token, and the uid used when generating the token must be 0xFFFFFFFF, and the channel name must uniquely identify each loop test. For how to generate a token on the server, refer to [Use Token Authentication](https://doc.shengwang.cn/doc/rtc/electron/basic-features/token-authentication).
   */
  token?: string;
  /**
   * The channel name that identifies each audio and video loop test. To ensure the loop test functions properly, when users under the same project (App ID) perform loop tests on different devices, the channel names passed in must be different.
   */
  channelId?: string;
  /**
   * Sets the interval or delay for returning the audio and video loop test results. Value range is [2,10] in seconds, default is 2 seconds.
   *  For audio loop tests, the test result is returned based on the interval you set.
   *  For video loop tests, the video is displayed briefly, then the delay gradually increases until it reaches the value you set.
   */
  intervalInSeconds?: number;
}

/**
 * User information.
 */
export class UserInfo {
  /**
   * User ID.
   */
  uid?: number;
  /**
   * User account. Length limit: MaxUserAccountLengthType.
   */
  userAccount?: string;
}

/**
 * Ear monitoring audio filter type.
 */
export enum EarMonitoringFilterType {
  /**
   * 1<<0: Do not add audio filters in ear monitoring.
   */
  EarMonitoringFilterNone = 1 << 0,
  /**
   * 1<<1: Add vocal effect audio filters in ear monitoring. If you implement features such as voice beautifier or sound effects, users can hear the processed sound in ear monitoring.
   */
  EarMonitoringFilterBuiltInAudioFilters = 1 << 1,
  /**
   * 1<<2: Add noise suppression audio filters in ear monitoring.
   */
  EarMonitoringFilterNoiseSuppression = 1 << 2,
  /**
   * 1<<15: Reuse the audio filters already applied on the sending side. Reusing audio filters reduces CPU usage for ear monitoring but increases ear monitoring latency. Suitable for scenarios where low CPU usage is prioritized over latency.
   */
  EarMonitoringFilterReusePostProcessingFilter = 1 << 15,
}

/**
 * @ignore
 */
export enum ThreadPriorityType {
  /**
   * @ignore
   */
  Lowest = 0,
  /**
   * @ignore
   */
  Low = 1,
  /**
   * @ignore
   */
  Normal = 2,
  /**
   * @ignore
   */
  High = 3,
  /**
   * @ignore
   */
  Highest = 4,
  /**
   * @ignore
   */
  Critical = 5,
}

/**
 * @ignore
 */
export class ScreenVideoParameters {
  /**
   * @ignore
   */
  dimensions?: VideoDimensions;
  /**
   * @ignore
   */
  frameRate?: number;
  /**
   * @ignore
   */
  bitrate?: number;
  /**
   * @ignore
   */
  contentHint?: VideoContentHint;
}

/**
 * @ignore
 */
export class ScreenAudioParameters {
  /**
   * @ignore
   */
  sampleRate?: number;
  /**
   * @ignore
   */
  channels?: number;
  /**
   * @ignore
   */
  captureSignalVolume?: number;
}

/**
 * @ignore
 */
export class ScreenCaptureParameters2 {
  /**
   * @ignore
   */
  captureAudio?: boolean;
  /**
   * @ignore
   */
  audioParams?: ScreenAudioParameters;
  /**
   * @ignore
   */
  captureVideo?: boolean;
  /**
   * @ignore
   */
  videoParams?: ScreenVideoParameters;
}

/**
 * Media frame rendering status.
 */
export enum MediaTraceEvent {
  /**
   * 0: Video frame rendered.
   */
  MediaTraceEventVideoRendered = 0,
  /**
   * 1: Video frame decoded.
   */
  MediaTraceEventVideoDecoded = 1,
}

/**
 * Metrics during video frame rendering.
 */
export class VideoRenderingTracingInfo {
  /**
   * Time interval (ms) from calling startMediaRenderingTracing to triggering the onVideoRenderingTracingResult callback. It is recommended to call startMediaRenderingTracing before joining the channel.
   */
  elapsedTime?: number;
  /**
   * Time interval (ms) from calling startMediaRenderingTracing to calling joinChannel. A negative value indicates that startMediaRenderingTracing was called after joinChannel.
   */
  start2JoinChannel?: number;
  /**
   * Time interval (ms) from calling joinChannel1 or joinChannel to successfully joining the channel.
   */
  join2JoinSuccess?: number;
  /**
   * If the local user calls startMediaRenderingTracing after the remote user has joined, this value is 0 and has no reference value.
   *  To improve the remote user's rendering speed, it is recommended that the remote user joins the channel first, followed by the local user, to reduce this value.
   *  If the local user calls startMediaRenderingTracing before successfully joining the channel, this is the time interval (ms) from the local user joining the channel to the remote user joining.
   *  If the local user calls startMediaRenderingTracing after joining the channel, this is the time interval (ms) from calling startMediaRenderingTracing to the remote user joining.
   */
  joinSuccess2RemoteJoined?: number;
  /**
   * If the local user calls startMediaRenderingTracing after setting the remote view, this value is 0 and has no reference value.
   *  To improve the remote user's rendering speed, it is recommended to set the remote view before the remote user joins, or immediately after the remote user joins, to reduce this value.
   *  If the local user calls startMediaRenderingTracing before the remote user joins the channel, this is the time interval (ms) from the remote user joining to the local user setting the remote view.
   *  If the local user calls startMediaRenderingTracing after the remote user joins, this is the time interval (ms) from calling startMediaRenderingTracing to setting the remote view.
   */
  remoteJoined2SetView?: number;
  /**
   * If startMediaRenderingTracing is called after subscribing to the remote video stream, this value is 0 and has no reference value.
   *  To improve the remote user's rendering speed, it is recommended to subscribe to the remote video stream immediately after the remote user joins, to reduce this value.
   *  If the local user calls startMediaRenderingTracing before the remote user joins the channel, this is the time interval (ms) from the remote user joining to subscribing to the remote video stream.
   *  If the local user calls startMediaRenderingTracing after the remote user joins, this is the time interval (ms) from calling startMediaRenderingTracing to subscribing to the remote video stream.
   */
  remoteJoined2UnmuteVideo?: number;
  /**
   * If startMediaRenderingTracing is called after receiving the remote video stream, this value is 0 and has no reference value.
   *  To improve the remote user's rendering speed, it is recommended that the remote user publishes the video stream immediately after joining the channel, and the local user subscribes to the remote video stream immediately, to reduce this value.
   *  If the local user calls startMediaRenderingTracing before the remote user joins the channel, this is the time interval (ms) from the remote user joining to the local user receiving the first remote data packet.
   *  If the local user calls startMediaRenderingTracing after the remote user joins, this is the time interval (ms) from calling startMediaRenderingTracing to receiving the first remote data packet.
   */
  remoteJoined2PacketReceived?: number;
}

/**
 * @ignore
 */
export enum ConfigFetchType {
  /**
   * @ignore
   */
  ConfigFetchTypeInitialize = 1,
  /**
   * @ignore
   */
  ConfigFetchTypeJoinChannel = 2,
}

/**
 * @ignore
 */
export class RecorderStreamInfo {
  /**
   * @ignore
   */
  channelId?: string;
  /**
   * @ignore
   */
  uid?: number;
}

/**
 * @ignore
 */
export enum LocalProxyMode {
  /**
   * @ignore
   */
  ConnectivityFirst = 0,
  /**
   * @ignore
   */
  LocalOnly = 1,
}

/**
 * Configuration information of the log server.
 */
export class LogUploadServerInfo {
  /**
   * Domain name of the log server.
   */
  serverDomain?: string;
  /**
   * Storage path of logs on the server.
   */
  serverPath?: string;
  /**
   * Port of the log server.
   */
  serverPort?: number;
  /**
   * Whether the log server uses HTTPS protocol: true : Uses HTTPS protocol. false : Uses HTTP protocol.
   */
  serverHttps?: boolean;
}

/**
 * Advanced options for Local Access Point.
 */
export class AdvancedConfigInfo {
  /**
   * Custom log upload server. By default, the SDK uploads logs to the Agora log server. You can use this parameter to change the log upload server. See LogUploadServerInfo.
   */
  logUploadServer?: LogUploadServerInfo;
}

/**
 * Local Access Point configuration.
 */
export class LocalAccessPointConfiguration {
  /**
   * Internal IP address list of the Local Access Point. Either ipList or domainList must be provided.
   */
  ipList?: string[];
  /**
   * Number of internal IP addresses for the Local Access Point. Must match the number of IPs you provide.
   */
  ipListSize?: number;
  /**
   * Domain name list of the Local Access Point. The SDK resolves the IPs of the Local Access Point based on the domains you provide. DNS resolution timeout is 10 seconds. Either ipList or domainList must be provided. If both are provided, the SDK merges and deduplicates the resolved and provided IPs, and randomly selects one for load balancing.
   */
  domainList?: string[];
  /**
   * Number of domain names for the Local Access Point. Must match the number of domains you provide.
   */
  domainListSize?: number;
  /**
   * Domain name used for internal certificate verification. If left empty, the SDK uses the default domain secure-edge.local.
   */
  verifyDomainName?: string;
  /**
   * Connection mode. See LocalProxyMode.
   */
  mode?: LocalProxyMode;
  /**
   * Advanced options for the Local Access Point. See AdvancedConfigInfo.
   */
  advancedConfig?: AdvancedConfigInfo;
}

/**
 * Spatial audio parameters.
 */
export class SpatialAudioParams {
  /**
   * The horizontal angle of the remote user or media player relative to the local user. Value range: [0,360], in degrees:
   *  0: (default) 0 degrees, directly in front on the horizontal plane.
   *  90: 90 degrees, to the left on the horizontal plane.
   *  180: 180 degrees, directly behind on the horizontal plane.
   *  270: 270 degrees, to the right on the horizontal plane.
   *  360: 360 degrees, same as 0 degrees.
   */
  speaker_azimuth?: number;
  /**
   * The vertical angle (elevation) of the remote user or media player relative to the local user. Value range: [-90,90], in degrees:
   *  0: (default) 0 degrees, no tilt on the horizontal plane.
   *  -90: -90 degrees, tilted downward 90 degrees.
   *  90: 90 degrees, tilted upward 90 degrees.
   */
  speaker_elevation?: number;
  /**
   * The distance of the remote user or media player from the local user. Value range: [1,50], in meters. Default is 1 meter.
   */
  speaker_distance?: number;
  /**
   * The orientation of the remote user or media player relative to the local user. Value range: [0,180], in degrees:
   *  0: (default) 0 degrees, source and listener face the same direction.
   *  180: 180 degrees, source and listener face each other.
   */
  speaker_orientation?: number;
  /**
   * Whether to enable sound blurring: true : Enable blurring. false : (default) Disable blurring.
   */
  enable_blur?: boolean;
  /**
   * Whether to enable air absorption, simulating the attenuation of sound timbre during air transmission: high frequencies attenuate faster than low frequencies over distance. true : (default) Enable air absorption. Ensure speaker_attenuation is not 0, otherwise this setting has no effect. false : Disable air absorption.
   */
  enable_air_absorb?: boolean;
  /**
   * Attenuation coefficient of the remote user or media player sound. Value range: [0,1]:
   *  0: Broadcast mode. Volume and timbre do not attenuate with distance.
   *  (0,0.5): Weak attenuation. Volume and timbre (requires enable_air_absorb) attenuate slightly, allowing sound to travel farther than in real environments.
   *  0.5: (default) Simulates real-world volume attenuation. Equivalent to not setting speaker_attenuation.
   *  (0.5,1]: Strong attenuation. Volume and timbre (requires enable_air_absorb) attenuate rapidly.
   */
  speaker_attenuation?: number;
  /**
   * This parameter is suitable for scenarios with fast-moving sound sources (e.g., racing games). It is not recommended in typical audio/video interaction scenarios (voice chat, co-hosting, online karaoke).
   *  When enabled, it is recommended to update the relative distance between source and listener periodically (e.g., every 30 ms) by calling updatePlayerPositionInfo, updateSelfPosition, and updateRemotePosition. The Doppler effect may not work as expected or may produce jitter if: update interval is too long, update interval is irregular, or distance info is lost due to network packet loss or latency. Whether to enable Doppler effect: when the sound source and listener move relative to each other, the pitch heard by the listener changes. true : Enable Doppler effect. false : (default) Disable Doppler effect.
   */
  enable_doppler?: boolean;
}
