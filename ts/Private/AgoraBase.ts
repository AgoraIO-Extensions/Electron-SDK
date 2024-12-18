import './extension/AgoraBaseExtension';
import { RenderModeType, VideoSourceType } from './AgoraMediaBase';

/**
 * The channel profile.
 */
export enum ChannelProfileType {
  /**
   * 0: Communication. Use this profile when there are only two users in the channel.
   */
  ChannelProfileCommunication = 0,
  /**
   * 1: Live streaming. Live streaming. Use this profile when there are more than two users in the channel.
   */
  ChannelProfileLiveBroadcasting = 1,
  /**
   * 2: Gaming. This profile is deprecated.
   */
  ChannelProfileGame = 2,
  /**
   * Cloud gaming. The scenario is optimized for latency. Use this profile if the use case requires frequent interactions between users.
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
 * An error code indicates that the SDK encountered an unrecoverable error that requires application intervention. For example, an error is returned when the camera fails to open, and the app needs to inform the user that the camera cannot be used.
 */
export enum ErrorCodeType {
  /**
   * 0: No error.
   */
  ErrOk = 0,
  /**
   * 1: General error with no classified reason. Try calling the method again.
   */
  ErrFailed = 1,
  /**
   * 2: An invalid parameter is used. For example, the specified channel name includes illegal characters. Reset the parameter.
   */
  ErrInvalidArgument = 2,
  /**
   * 3: The SDK is not ready. Possible reasons include the following:
   *  The initialization of IRtcEngine fails. Reinitialize the IRtcEngine.
   *  No user has joined the channel when the method is called. Check the code logic.
   *  The user has not left the channel when the rate or complain method is called. Check the code logic.
   *  The audio module is disabled.
   *  The program is not complete.
   */
  ErrNotReady = 3,
  /**
   * 4: The IRtcEngine does not support the request. Possible reasons include the following:
   *  The built-in encryption mode is incorrect, or the SDK fails to load the external encryption library. Check the encryption mode setting, or reload the external encryption library.
   */
  ErrNotSupported = 4,
  /**
   * 5: The request is rejected. Possible reasons include the following:
   *  The IRtcEngine initialization fails. Reinitialize the IRtcEngine.
   *  The channel name is set as the empty string "" when joining the channel. Reset the channel name.
   *  When the joinChannelEx method is called to join multiple channels, the specified channel name is already in use. Reset the channel name.
   */
  ErrRefused = 5,
  /**
   * 6: The buffer size is insufficient to store the returned data.
   */
  ErrBufferTooSmall = 6,
  /**
   * 7: A method is called before the initialization of IRtcEngine. Ensure that the IRtcEngine object is initialized before using this method.
   */
  ErrNotInitialized = 7,
  /**
   * 8: Invalid state.
   */
  ErrInvalidState = 8,
  /**
   * 9: Permission to access is not granted. Check whether your app has access to the audio and video device.
   */
  ErrNoPermission = 9,
  /**
   * 10: A timeout occurs. Some API calls require the SDK to return the execution result. This error occurs if the SDK takes too long (more than 10 seconds) to return the result.
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
   * 17: The request to join the channel is rejected. Possible reasons include the following:
   *  The user is already in the channel. Agora recommends that you use the onConnectionStateChanged callback to see whether the user is in the channel. Do not call this method to join the channel unless you receive the ConnectionStateDisconnected (1) state.
   *  After calling startEchoTest for the call test, the user tries to join the channel without calling stopEchoTest to end the current test. To join a channel, the call test must be ended by calling stopEchoTest.
   */
  ErrJoinChannelRejected = 17,
  /**
   * 18: Fails to leave the channel. Possible reasons include the following:
   *  The user has left the channel before calling the leaveChannel method. Stop calling this method to clear this error.
   *  The user calls the leaveChannel method to leave the channel before joining the channel. In this case, no extra operation is needed.
   */
  ErrLeaveChannelRejected = 18,
  /**
   * 19: Resources are already in use.
   */
  ErrAlreadyInUse = 19,
  /**
   * 20: The request is abandoned by the SDK, possibly because the request has been sent too frequently.
   */
  ErrAborted = 20,
  /**
   * 21: The IRtcEngine fails to initialize and has crashed because of specific Windows firewall settings.
   */
  ErrInitNetEngine = 21,
  /**
   * 22: The SDK fails to allocate resources because your app uses too many system resources or system resources are insufficient.
   */
  ErrResourceLimited = 22,
  /**
   * 101: The specified App ID is invalid. Rejoin the channel with a valid App ID.
   */
  ErrInvalidAppId = 101,
  /**
   * 102: The specified channel name is invalid. A possible reason is that the parameter's data type is incorrect. Rejoin the channel with a valid channel name.
   */
  ErrInvalidChannelName = 102,
  /**
   * 103: Fails to get server resources in the specified region. Try another region when initializing IRtcEngine.
   */
  ErrNoServerResources = 103,
  /**
   * 109: The current token has expired. Apply for a new token on the server and call renewToken. Deprecated: This enumerator is deprecated. Use ConnectionChangedTokenExpired (9) in the onConnectionStateChanged callback instead.
   */
  ErrTokenExpired = 109,
  /**
   * 110: Invalid token. Typical reasons include the following:
   *  App Certificate is enabled in Agora Console, but the code still uses App ID for authentication. Once App Certificate is enabled for a project, you must use token-based authentication.
   *  The uid used to generate the token is not the same as the uid used to join the channel. Deprecated: This enumerator is deprecated. Use ConnectionChangedInvalidToken (8) in the onConnectionStateChanged callback instead.
   */
  ErrInvalidToken = 110,
  /**
   * 111: The network connection is interrupted. The SDK triggers this callback when it loses connection with the server for more than four seconds after the connection is established.
   */
  ErrConnectionInterrupted = 111,
  /**
   * 112: The network connection is lost. Occurs when the SDK cannot reconnect to Agora's edge server 10 seconds after its connection to the server is interrupted.
   */
  ErrConnectionLost = 112,
  /**
   * 113: The user is not in the channel when calling the sendStreamMessage method.
   */
  ErrNotInChannel = 113,
  /**
   * 114: The data size exceeds 1 KB when calling the sendStreamMessage method.
   */
  ErrSizeTooLarge = 114,
  /**
   * 115: The data bitrate exceeds 6 KB/s when calling the sendStreamMessage method.
   */
  ErrBitrateLimit = 115,
  /**
   * 116: More than five data streams are created when calling the createDataStream method.
   */
  ErrTooManyDataStreams = 116,
  /**
   * 117: The data stream transmission times out.
   */
  ErrStreamMessageTimeout = 117,
  /**
   * 119: Switching roles fails, try rejoining the channel.
   */
  ErrSetClientRoleNotAuthorized = 119,
  /**
   * 120: Media streams decryption fails. The user might use an incorrect password to join the channel. Check the entered password, or tell the user to try rejoining the channel.
   */
  ErrDecryptionFailed = 120,
  /**
   * 121: The user ID is invalid.
   */
  ErrInvalidUserId = 121,
  /**
   * 122: Data streams decryption fails. The user might use an incorrect password to join the channel. Check the entered password, or tell the user to try rejoining the channel.
   */
  ErrDatastreamDecryptionFailed = 122,
  /**
   * 123: The user is banned from the server.
   */
  ErrClientIsBannedByServer = 123,
  /**
   * 130: The SDK does not support pushing encrypted streams to CDN.
   */
  ErrEncryptedStreamNotAllowedPublish = 130,
  /**
   * @ignore
   */
  ErrLicenseCredentialInvalid = 131,
  /**
   * 134: The user account is invalid, possibly because it contains invalid parameters.
   */
  ErrInvalidUserAccount = 134,
  /**
   * @ignore
   */
  ErrModuleNotFound = 157,
  /**
   * 1001: The SDK fails to load the media engine.
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
   * @ignore
   */
  ErrPcmsendFormat = 200,
  /**
   * @ignore
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
   * 1005: A general error occurs (no specified reason). Check whether the audio device is already in use by another app, or try rejoining the channel.
   */
  ErrAdmGeneralError = 1005,
  /**
   * 1008: An error occurs when initializing the playback device. Check whether the playback device is already in use by another app, or try rejoining the channel.
   */
  ErrAdmInitPlayout = 1008,
  /**
   * 1009: An error occurs when starting the playback device. Check the playback device.
   */
  ErrAdmStartPlayout = 1009,
  /**
   * 1010: An error occurs when stopping the playback device.
   */
  ErrAdmStopPlayout = 1010,
  /**
   * 1011: An error occurs when initializing the recording device. Check the recording device, or try rejoining the channel.
   */
  ErrAdmInitRecording = 1011,
  /**
   * 1012: An error occurs when starting the recording device. Check the recording device.
   */
  ErrAdmStartRecording = 1012,
  /**
   * 1013: An error occurs when stopping the recording device.
   */
  ErrAdmStopRecording = 1013,
  /**
   * 1501: Permission to access the camera is not granted. Check whether permission to access the camera permission is granted.
   */
  ErrVdmCameraNotAuthorized = 1501,
  /**
   * @ignore
   */
  ErrAdmApplicationLoopback = 2007,
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
 * The operation permissions of the SDK on the audio session.
 */
export enum AudioSessionOperationRestriction {
  /**
   * No restriction, the SDK can change the audio session.
   */
  AudioSessionOperationRestrictionNone = 0,
  /**
   * The SDK cannot change the audio session category.
   */
  AudioSessionOperationRestrictionSetCategory = 1,
  /**
   * The SDK cannot change the audio session category, mode, or categoryOptions.
   */
  AudioSessionOperationRestrictionConfigureSession = 1 << 1,
  /**
   * The SDK keeps the audio session active when the user leaves the channel, for example, to play an audio file in the background.
   */
  AudioSessionOperationRestrictionDeactivateSession = 1 << 2,
  /**
   * Completely restricts the operation permissions of the SDK on the audio session; the SDK cannot change the audio session.
   */
  AudioSessionOperationRestrictionAll = 1 << 7,
}

/**
 * Reasons for a user being offline.
 */
export enum UserOfflineReasonType {
  /**
   * 0: The user quits the call.
   */
  UserOfflineQuit = 0,
  /**
   * 1: The SDK times out and the user drops offline because no data packet is received within a certain period of time. If the user quits the call and the message is not passed to the SDK (due to an unreliable channel), the SDK assumes the user dropped offline.
   */
  UserOfflineDropped = 1,
  /**
   * 2: The user switches the client role from the host to the audience.
   */
  UserOfflineBecomeAudience = 2,
}

/**
 * The interface class.
 */
export enum InterfaceIdType {
  /**
   * 1: The IAudioDeviceManager interface class.
   */
  AgoraIidAudioDeviceManager = 1,
  /**
   * 2: The IVideoDeviceManager interface class.
   */
  AgoraIidVideoDeviceManager = 2,
  /**
   * @ignore
   */
  AgoraIidParameterEngine = 3,
  /**
   * 4: The IMediaEngine interface class.
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
   * @ignore
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
   * @ignore
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
   * @ignore
   */
  AgoraIidMusicContentCenter = 15,
  /**
   * @ignore
   */
  AgoraIidH265Transcoder = 16,
}

/**
 * Network quality types.
 */
export enum QualityType {
  /**
   * 0: The network quality is unknown.
   */
  QualityUnknown = 0,
  /**
   * 1: The network quality is excellent.
   */
  QualityExcellent = 1,
  /**
   * 2: The network quality is quite good, but the bitrate may be slightly lower than excellent.
   */
  QualityGood = 2,
  /**
   * 3: Users can feel the communication is slightly impaired.
   */
  QualityPoor = 3,
  /**
   * 4: Users cannot communicate smoothly.
   */
  QualityBad = 4,
  /**
   * 5: The quality is so bad that users can barely communicate.
   */
  QualityVbad = 5,
  /**
   * 6: The network is down and users cannot communicate at all.
   */
  QualityDown = 6,
  /**
   * @ignore
   */
  QualityUnsupported = 7,
  /**
   * 8: The last-mile network probe test is in progress.
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
 * The clockwise rotation of the video.
 */
export enum VideoOrientation {
  /**
   * 0: (Default) No rotation.
   */
  VideoOrientation0 = 0,
  /**
   * 90: 90 degrees.
   */
  VideoOrientation90 = 90,
  /**
   * 180: 180 degrees.
   */
  VideoOrientation180 = 180,
  /**
   * 270: 270 degrees.
   */
  VideoOrientation270 = 270,
}

/**
 * The video frame rate.
 */
export enum FrameRate {
  /**
   * 1: 1 fps
   */
  FrameRateFps1 = 1,
  /**
   * 7: 7 fps
   */
  FrameRateFps7 = 7,
  /**
   * 10: 10 fps
   */
  FrameRateFps10 = 10,
  /**
   * 15: 15 fps
   */
  FrameRateFps15 = 15,
  /**
   * 24: 24 fps
   */
  FrameRateFps24 = 24,
  /**
   * 30: 30 fps
   */
  FrameRateFps30 = 30,
  /**
   * 60: 60 fps
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
 * The video frame type.
 */
export enum VideoFrameType {
  /**
   * 0: A black frame.
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
   * 5: The B frame.
   */
  VideoFrameTypeBFrame = 5,
  /**
   * 6: A discarded frame.
   */
  VideoFrameTypeDroppableFrame = 6,
  /**
   * Unknown frame.
   */
  VideoFrameTypeUnknow = 7,
}

/**
 * Video output orientation mode.
 */
export enum OrientationMode {
  /**
   * 0: (Default) The output video always follows the orientation of the captured video. The receiver takes the rotational information passed on from the video encoder. This mode applies to scenarios where video orientation can be adjusted on the receiver.
   *  If the captured video is in landscape mode, the output video is in landscape mode.
   *  If the captured video is in portrait mode, the output video is in portrait mode.
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
 * Video degradation preferences when the bandwidth is a constraint.
 */
export enum DegradationPreference {
  /**
   * 0: Prefers to reduce the video frame rate while maintaining video resolution during video encoding under limited bandwidth. This degradation preference is suitable for scenarios where video quality is prioritized. Deprecated: This enumerator is deprecated. Use other enumerations instead.
   */
  MaintainQuality = 0,
  /**
   * 1: Reduces the video resolution while maintaining the video frame rate during video encoding under limited bandwidth. This degradation preference is suitable for scenarios where smoothness is prioritized and video quality is allowed to be reduced.
   */
  MaintainFramerate = 1,
  /**
   * 2: Reduces the video frame rate and video resolution simultaneously during video encoding under limited bandwidth. The MaintainBalanced has a lower reduction than MaintainQuality and MaintainFramerate, and this preference is suitable for scenarios where both smoothness and video quality are a priority. The resolution of the video sent may change, so remote users need to handle this issue. See onVideoSizeChanged.
   */
  MaintainBalanced = 2,
  /**
   * 3: Reduces the video frame rate while maintaining the video resolution during video encoding under limited bandwidth. This degradation preference is suitable for scenarios where video quality is prioritized.
   */
  MaintainResolution = 3,
  /**
   * @ignore
   */
  Disabled = 100,
}

/**
 * The video dimension.
 */
export class VideoDimensions {
  width?: number;
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
 * Video codec types.
 */
export enum VideoCodecType {
  /**
   * 0: (Default) Unspecified codec format. The SDK automatically matches the appropriate codec format based on the current video stream's resolution and device performance.
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
   * 6: Generic. This type is used for transmitting raw video data, such as encrypted video frames. The SDK returns this type of video frames in callbacks, and you need to decode and render the frames yourself.
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
   * 20: Generic JPEG. This type consumes minimum computing resources and applies to IoT devices.
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
  ccMode?: TCcMode;
  codecType?: VideoCodecType;
  targetBitrate?: number;
}

/**
 * The codec type of audio.
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
   * AAC encoding format, 16000 Hz sampling rate, bass quality. A file with an audio duration of 10 minutes is approximately 1.2 MB after encoding.
   */
  AudioEncodingTypeAac16000Low = 0x010101,
  /**
   * AAC encoding format, 16000 Hz sampling rate, medium sound quality. A file with an audio duration of 10 minutes is approximately 2 MB after encoding.
   */
  AudioEncodingTypeAac16000Medium = 0x010102,
  /**
   * AAC encoding format, 32000 Hz sampling rate, bass quality. A file with an audio duration of 10 minutes is approximately 1.2 MB after encoding.
   */
  AudioEncodingTypeAac32000Low = 0x010201,
  /**
   * AAC encoding format, 32000 Hz sampling rate, medium sound quality. A file with an audio duration of 10 minutes is approximately 2 MB after encoding.
   */
  AudioEncodingTypeAac32000Medium = 0x010202,
  /**
   * AAC encoding format, 32000 Hz sampling rate, high sound quality. A file with an audio duration of 10 minutes is approximately 3.5 MB after encoding.
   */
  AudioEncodingTypeAac32000High = 0x010203,
  /**
   * AAC encoding format, 48000 Hz sampling rate, medium sound quality. A file with an audio duration of 10 minutes is approximately 2 MB after encoding.
   */
  AudioEncodingTypeAac48000Medium = 0x010302,
  /**
   * AAC encoding format, 48000 Hz sampling rate, high sound quality. A file with an audio duration of 10 minutes is approximately 3.5 MB after encoding.
   */
  AudioEncodingTypeAac48000High = 0x010303,
  /**
   * OPUS encoding format, 16000 Hz sampling rate, bass quality. A file with an audio duration of 10 minutes is approximately 2 MB after encoding.
   */
  AudioEncodingTypeOpus16000Low = 0x020101,
  /**
   * OPUS encoding format, 16000 Hz sampling rate, medium sound quality. A file with an audio duration of 10 minutes is approximately 2 MB after encoding.
   */
  AudioEncodingTypeOpus16000Medium = 0x020102,
  /**
   * OPUS encoding format, 48000 Hz sampling rate, medium sound quality. A file with an audio duration of 10 minutes is approximately 2 MB after encoding.
   */
  AudioEncodingTypeOpus48000Medium = 0x020302,
  /**
   * OPUS encoding format, 48000 Hz sampling rate, high sound quality. A file with an audio duration of 10 minutes is approximately 3.5 MB after encoding.
   */
  AudioEncodingTypeOpus48000High = 0x020303,
}

/**
 * The adaptation mode of the watermark.
 */
export enum WatermarkFitMode {
  /**
   * Use the positionInLandscapeMode and positionInPortraitMode values you set in WatermarkOptions. The settings in WatermarkRatio are invalid.
   */
  FitModeCoverPosition = 0,
  /**
   * Use the value you set in WatermarkRatio. The settings in positionInLandscapeMode and positionInPortraitMode in WatermarkOptions are invalid.
   */
  FitModeUseImageRatio = 1,
}

/**
 * @ignore
 */
export class EncodedAudioFrameAdvancedSettings {
  speech?: boolean;
  sendEvenIfEmpty?: boolean;
}

/**
 * Audio information after encoding.
 */
export class EncodedAudioFrameInfo {
  codec?: AudioCodecType;
  sampleRateHz?: number;
  samplesPerChannel?: number;
  numberOfChannels?: number;
  advancedSettings?: EncodedAudioFrameAdvancedSettings;
  captureTimeMs?: number;
}

/**
 * @ignore
 */
export class AudioPcmDataInfo {
  samplesPerChannel?: number;
  channelNum?: number;
  samplesOut?: number;
  elapsedTimeMs?: number;
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
 * The type of video streams.
 */
export enum VideoStreamType {
  /**
   * 0: High-quality video stream.
   */
  VideoStreamHigh = 0,
  /**
   * 1: Low-quality video stream.
   */
  VideoStreamLow = 1,
}

/**
 * Video subscription options.
 */
export class VideoSubscriptionOptions {
  type?: VideoStreamType;
  encodedFrameOnly?: boolean;
}

/**
 * Information about externally encoded video frames.
 */
export class EncodedVideoFrameInfo {
  codecType?: VideoCodecType;
  width?: number;
  height?: number;
  framesPerSecond?: number;
  frameType?: VideoFrameType;
  rotation?: VideoOrientation;
  trackId?: number;
  captureTimeMs?: number;
  decodeTimeMs?: number;
  uid?: number;
  streamType?: VideoStreamType;
}

/**
 * Compression preference for video encoding.
 */
export enum CompressionPreference {
  /**
   * 0: Low latency preference. The SDK compresses video frames to reduce latency. This preference is suitable for scenarios where smoothness is prioritized and reduced video quality is acceptable.
   */
  PreferLowLatency = 0,
  /**
   * 1: High quality preference. The SDK compresses video frames while maintaining video quality. This preference is suitable for scenarios where video quality is prioritized.
   */
  PreferQuality = 1,
}

/**
 * Video encoder preference.
 */
export enum EncodingPreference {
  /**
   * -1: Adaptive preference. The SDK automatically selects the optimal encoding type for encoding based on factors such as platform and device type.
   */
  PreferAuto = -1,
  /**
   * 0: Software coding preference. The SDK prefers software encoders for video encoding.
   */
  PreferSoftware = 0,
  /**
   * 1: Hardware encoding preference. The SDK prefers a hardware encoder for video encoding. When the device does not support hardware encoding, the SDK automatically uses software encoding and reports the currently used video encoder type through hwEncoderAccelerating in the onLocalVideoStats callback.
   */
  PreferHardware = 1,
}

/**
 * Advanced options for video encoding.
 */
export class AdvanceOptions {
  encodingPreference?: EncodingPreference;
  compressionPreference?: CompressionPreference;
}

/**
 * Video mirror mode.
 */
export enum VideoMirrorModeType {
  /**
   * 0: The SDK determines the mirror mode.
   *  For the mirror mode of the local video view: If you use a front camera, the SDK enables the mirror mode by default; if you use a rear camera, the SDK disables the mirror mode by default.
   *  For the remote user: The mirror mode is disabled by default.
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
 * The bit mask of the codec type.
 */
export enum CodecCapMask {
  /**
   * (0): The device does not support encoding or decoding.
   */
  CodecCapMaskNone = 0,
  /**
   * (1 << 0): The device supports hardware decoding.
   */
  CodecCapMaskHwDec = 1 << 0,
  /**
   * (1 << 1): The device supports hardware encoding.
   */
  CodecCapMaskHwEnc = 1 << 1,
  /**
   * (1 << 2): The device supports software decoding.
   */
  CodecCapMaskSwDec = 1 << 2,
  /**
   * (1 << 3): The device supports software ecoding.
   */
  CodecCapMaskSwEnc = 1 << 3,
}

/**
 * The level of the codec capability.
 */
export class CodecCapLevels {
  hwDecodingLevel?: VideoCodecCapabilityLevel;
  swDecodingLevel?: VideoCodecCapabilityLevel;
}

/**
 * The codec capability of the SDK.
 */
export class CodecCapInfo {
  codecType?: VideoCodecType;
  codecCapMask?: number;
  codecLevels?: CodecCapLevels;
}

/**
 * Video encoder configurations.
 */
export class VideoEncoderConfiguration {
  codecType?: VideoCodecType;
  dimensions?: VideoDimensions;
  frameRate?: number;
  bitrate?: number;
  minBitrate?: number;
  orientationMode?: OrientationMode;
  degradationPreference?: DegradationPreference;
  mirrorMode?: VideoMirrorModeType;
  advanceOptions?: AdvanceOptions;
}

/**
 * The configurations for the data stream.
 *
 * The following table shows the SDK behaviors under different parameter settings:
 */
export class DataStreamConfig {
  syncWithAudio?: boolean;
  ordered?: boolean;
}

/**
 * The mode in which the video stream is sent.
 */
export enum SimulcastStreamMode {
  /**
   * -1: By default, do not send the low-quality video stream until a subscription request for the low-quality video stream is received from the receiving end, then automatically start sending low-quality video stream.
   */
  AutoSimulcastStream = -1,
  /**
   * 0: Never send low-quality video stream.
   */
  DisableSimulcastStream = 0,
  /**
   * 1: Always send low-quality video stream.
   */
  EnableSimulcastStream = 1,
}

/**
 * The configuration of the low-quality video stream.
 */
export class SimulcastStreamConfig {
  dimensions?: VideoDimensions;
  kBitrate?: number;
  framerate?: number;
}

/**
 * The location of the target area relative to the screen or window. If you do not set this parameter, the SDK selects the whole screen or window.
 */
export class Rectangle {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

/**
 * The position and size of the watermark on the screen.
 *
 * The position and size of the watermark on the screen are determined by xRatio, yRatio, and widthRatio :
 *  (xRatio, yRatio) refers to the coordinates of the upper left corner of the watermark, which determines the distance from the upper left corner of the watermark to the upper left corner of the screen.
 *  The widthRatio determines the width of the watermark.
 */
export class WatermarkRatio {
  xRatio?: number;
  yRatio?: number;
  widthRatio?: number;
}

/**
 * Configurations of the watermark image.
 */
export class WatermarkOptions {
  visibleInPreview?: boolean;
  positionInLandscapeMode?: Rectangle;
  positionInPortraitMode?: Rectangle;
  watermarkRatio?: WatermarkRatio;
  mode?: WatermarkFitMode;
}

/**
 * Statistics of a call session.
 */
export class RtcStats {
  duration?: number;
  txBytes?: number;
  rxBytes?: number;
  txAudioBytes?: number;
  txVideoBytes?: number;
  rxAudioBytes?: number;
  rxVideoBytes?: number;
  txKBitRate?: number;
  rxKBitRate?: number;
  rxAudioKBitRate?: number;
  txAudioKBitRate?: number;
  rxVideoKBitRate?: number;
  txVideoKBitRate?: number;
  lastmileDelay?: number;
  userCount?: number;
  cpuAppUsage?: number;
  cpuTotalUsage?: number;
  gatewayRtt?: number;
  memoryAppUsageRatio?: number;
  memoryTotalUsageRatio?: number;
  memoryAppUsageInKbytes?: number;
  connectTimeMs?: number;
  firstAudioPacketDuration?: number;
  firstVideoPacketDuration?: number;
  firstVideoKeyFramePacketDuration?: number;
  packetsBeforeFirstKeyFramePacket?: number;
  firstAudioPacketDurationAfterUnmute?: number;
  firstVideoPacketDurationAfterUnmute?: number;
  firstVideoKeyFramePacketDurationAfterUnmute?: number;
  firstVideoKeyFrameDecodedDurationAfterUnmute?: number;
  firstVideoKeyFrameRenderedDurationAfterUnmute?: number;
  txPacketLossRate?: number;
  rxPacketLossRate?: number;
}

/**
 * The user role in the interactive live streaming.
 */
export enum ClientRoleType {
  /**
   * 1: Host. A host can both send and receive streams.
   */
  ClientRoleBroadcaster = 1,
  /**
   * 2: (Default) Audience. An audience member can only receive streams.
   */
  ClientRoleAudience = 2,
}

/**
 * Quality change of the local video in terms of target frame rate and target bit rate since last count.
 */
export enum QualityAdaptIndication {
  /**
   * 0: The local video quality stays the same.
   */
  AdaptNone = 0,
  /**
   * 1: The local video quality improves because the network bandwidth increases.
   */
  AdaptUpBandwidth = 1,
  /**
   * 2: The local video quality deteriorates because the network bandwidth decreases.
   */
  AdaptDownBandwidth = 2,
}

/**
 * The latency level of an audience member in interactive live streaming. This enum takes effect only when the user role is set to ClientRoleAudience .
 */
export enum AudienceLatencyLevelType {
  /**
   * 1: Low latency.
   */
  AudienceLatencyLevelLowLatency = 1,
  /**
   * 2: (Default) Ultra low latency.
   */
  AudienceLatencyLevelUltraLowLatency = 2,
}

/**
 * Setting of user role properties.
 */
export class ClientRoleOptions {
  audienceLatencyLevel?: AudienceLatencyLevelType;
}

/**
 * The Quality of Experience (QoE) of the local user when receiving a remote audio stream.
 */
export enum ExperienceQualityType {
  /**
   * 0: The QoE of the local user is good.
   */
  ExperienceQualityGood = 0,
  /**
   * 1: The QoE of the local user is poor.
   */
  ExperienceQualityBad = 1,
}

/**
 * Reasons why the QoE of the local user when receiving a remote audio stream is poor.
 */
export enum ExperiencePoorReason {
  /**
   * 0: No reason, indicating a good QoE of the local user.
   */
  ExperienceReasonNone = 0,
  /**
   * 1: The remote user's network quality is poor.
   */
  RemoteNetworkQualityPoor = 1,
  /**
   * 2: The local user's network quality is poor.
   */
  LocalNetworkQualityPoor = 2,
  /**
   * 4: The local user's Wi-Fi or mobile network signal is weak.
   */
  WirelessSignalPoor = 4,
  /**
   * 8: The local user enables both Wi-Fi and bluetooth, and their signals interfere with each other. As a result, audio transmission quality is undermined.
   */
  WifiBluetoothCoexist = 8,
}

/**
 * AI noise suppression modes.
 */
export enum AudioAinsMode {
  /**
   * 0: (Default) Balance mode. This mode allows for a balanced performance on noice suppression and time delay.
   */
  AinsModeBalanced = 0,
  /**
   * 1: Aggressive mode. In scenarios where high performance on noise suppression is required, such as live streaming outdoor events, this mode reduces nosie more dramatically, but may sometimes affect the original character of the audio.
   */
  AinsModeAggressive = 1,
  /**
   * 2: Aggressive mode with low latency. The noise suppression delay of this mode is about only half of that of the balance and aggressive modes. It is suitable for scenarios that have high requirements on noise suppression with low latency, such as sing together online in real time.
   */
  AinsModeUltralowlatency = 2,
}

/**
 * The audio profile.
 */
export enum AudioProfileType {
  /**
   * 0: The default audio profile.
   *  For the interactive streaming profile: A sample rate of 48 kHz, music encoding, mono, and a bitrate of up to 64 Kbps.
   *  For the communication profile:
   *  Windows: A sample rate of 16 kHz, audio encoding, mono, and a bitrate of up to 16 Kbps. macOS: A sample rate of 32 kHz, audio encoding, mono, and a bitrate of up to 18 Kbps.
   */
  AudioProfileDefault = 0,
  /**
   * 1: A sample rate of 32 kHz, audio encoding, mono, and a bitrate of up to 18 Kbps.
   */
  AudioProfileSpeechStandard = 1,
  /**
   * 2: A sample rate of 48 kHz, music encoding, mono, and a bitrate of up to 64 Kbps.
   */
  AudioProfileMusicStandard = 2,
  /**
   * 3: A sample rate of 48 kHz, music encoding, stereo, and a bitrate of up to 80 Kbps. To implement stereo audio, you also need to call setAdvancedAudioOptions and set audioProcessingChannels to AudioProcessingStereo in AdvancedAudioOptions.
   */
  AudioProfileMusicStandardStereo = 3,
  /**
   * 4: A sample rate of 48 kHz, music encoding, mono, and a bitrate of up to 96 Kbps.
   */
  AudioProfileMusicHighQuality = 4,
  /**
   * 5: A sample rate of 48 kHz, music encoding, stereo, and a bitrate of up to 128 Kbps. To implement stereo audio, you also need to call setAdvancedAudioOptions and set audioProcessingChannels to AudioProcessingStereo in AdvancedAudioOptions.
   */
  AudioProfileMusicHighQualityStereo = 5,
  /**
   * 6: A sample rate of 16 kHz, audio encoding, mono, and Acoustic Echo Cancellation (AES) enabled.
   */
  AudioProfileIot = 6,
  /**
   * Enumerator boundary.
   */
  AudioProfileNum = 7,
}

/**
 * The audio scenarios.
 */
export enum AudioScenarioType {
  /**
   * 0: (Default) Automatic scenario match, where the SDK chooses the appropriate audio quality according to the user role and audio route.
   */
  AudioScenarioDefault = 0,
  /**
   * 3: High-quality audio scenario, where users mainly play music. For example, instrument tutoring.
   */
  AudioScenarioGameStreaming = 3,
  /**
   * 5: Chatroom scenario, where users need to frequently switch the user role or mute and unmute the microphone. For example, education scenarios.
   */
  AudioScenarioChatroom = 5,
  /**
   * 7: Real-time chorus scenario, where users have good network conditions and require ultra-low latency.
   */
  AudioScenarioChorus = 7,
  /**
   * 8: Meeting scenario that mainly contains the human voice.
   */
  AudioScenarioMeeting = 8,
  /**
   * The number of enumerations.
   */
  AudioScenarioNum = 9,
}

/**
 * The format of the video frame.
 */
export class VideoFormat {
  width?: number;
  height?: number;
  fps?: number;
}

/**
 * The content hint for screen sharing.
 */
export enum VideoContentHint {
  /**
   * (Default) No content hint.
   */
  ContentHintNone = 0,
  /**
   * Motion-intensive content. Choose this option if you prefer smoothness or when you are sharing a video clip, movie, or video game.
   */
  ContentHintMotion = 1,
  /**
   * Motionless content. Choose this option if you prefer sharpness or when you are sharing a picture, PowerPoint slides, or texts.
   */
  ContentHintDetails = 2,
}

/**
 * The screen sharing scenario.
 */
export enum ScreenScenarioType {
  /**
   * 1: (Default) Document. This scenario prioritizes the video quality of screen sharing and reduces the latency of the shared video for the receiver. If you share documents, slides, and tables, you can set this scenario.
   */
  ScreenScenarioDocument = 1,
  /**
   * 2: Game. This scenario prioritizes the smoothness of screen sharing. If you share games, you can set this scenario.
   */
  ScreenScenarioGaming = 2,
  /**
   * 3: Video. This scenario prioritizes the smoothness of screen sharing. If you share movies or live videos, you can set this scenario.
   */
  ScreenScenarioVideo = 3,
  /**
   * 4: Remote control. This scenario prioritizes the video quality of screen sharing and reduces the latency of the shared video for the receiver. If you share the device desktop being remotely controlled, you can set this scenario.
   */
  ScreenScenarioRdc = 4,
}

/**
 * The video application scenarios.
 */
export enum VideoApplicationScenarioType {
  /**
   * 0: (Default) The general scenario.
   */
  ApplicationScenarioGeneral = 0,
  /**
   * ApplicationScenarioMeeting (1) is suitable for meeting scenarios. The SDK automatically enables the following strategies:
   *  In meeting scenarios where low-quality video streams are required to have a high bitrate, the SDK automatically enables multiple technologies used to deal with network congestions, to enhance the performance of the low-quality streams and to ensure the smooth reception by subscribers.
   *  The SDK monitors the number of subscribers to the high-quality video stream in real time and dynamically adjusts its configuration based on the number of subscribers.
   *  If nobody subscribers to the high-quality stream, the SDK automatically reduces its bitrate and frame rate to save upstream bandwidth.
   *  If someone subscribes to the high-quality stream, the SDK resets the high-quality stream to the VideoEncoderConfiguration configuration used in the most recent calling of setVideoEncoderConfiguration. If no configuration has been set by the user previously, the following values are used:
   *  Resolution: 1280 × 720
   *  Frame rate: 15 fps
   *  Bitrate: 1600 Kbps
   *  The SDK monitors the number of subscribers to the low-quality video stream in real time and dynamically enables or disables it based on the number of subscribers. If the user has called setDualStreamMode to set that never send low-quality video stream (DisableSimulcastStream), the dynamic adjustment of the low-quality stream in meeting scenarios will not take effect.
   *  If nobody subscribes to the low-quality stream, the SDK automatically disables it to save upstream bandwidth.
   *  If someone subscribes to the low-quality stream, the SDK enables the low-quality stream and resets it to the SimulcastStreamConfig configuration used in the most recent calling of setDualStreamMode. If no configuration has been set by the user previously, the following values are used:
   *  Resolution: 480 × 272
   *  Frame rate: 15 fps
   *  Bitrate: 500 Kbps 1: The meeting scenario.
   */
  ApplicationScenarioMeeting = 1,
}

/**
 * The brightness level of the video image captured by the local camera.
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
 * The state of the local audio.
 */
export enum LocalAudioStreamState {
  /**
   * 0: The local audio is in the initial state.
   */
  LocalAudioStreamStateStopped = 0,
  /**
   * 1: The local audio capturing device starts successfully.
   */
  LocalAudioStreamStateRecording = 1,
  /**
   * 2: The first audio frame encodes successfully.
   */
  LocalAudioStreamStateEncoding = 2,
  /**
   * 3: The local audio fails to start.
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
 * Local video state types.
 */
export enum LocalVideoStreamState {
  /**
   * 0: The local video is in the initial state.
   */
  LocalVideoStreamStateStopped = 0,
  /**
   * 1: The local video capturing device starts successfully.
   */
  LocalVideoStreamStateCapturing = 1,
  /**
   * 2: The first video frame is successfully encoded.
   */
  LocalVideoStreamStateEncoding = 2,
  /**
   * 3: Fails to start the local video.
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
}

/**
 * Remote audio states.
 */
export enum RemoteAudioState {
  /**
   * 0: The local audio is in the initial state. The SDK reports this state in the case of RemoteAudioReasonLocalMuted, RemoteAudioReasonRemoteMuted or RemoteAudioReasonRemoteOffline.
   */
  RemoteAudioStateStopped = 0,
  /**
   * 1: The first remote audio packet is received.
   */
  RemoteAudioStateStarting = 1,
  /**
   * 2: The remote audio stream is decoded and plays normally. The SDK reports this state in the case of RemoteAudioReasonNetworkRecovery, RemoteAudioReasonLocalUnmuted or RemoteAudioReasonRemoteUnmuted.
   */
  RemoteAudioStateDecoding = 2,
  /**
   * 3: The remote audio is frozen. The SDK reports this state in the case of RemoteAudioReasonNetworkCongestion.
   */
  RemoteAudioStateFrozen = 3,
  /**
   * 4: The remote audio fails to start. The SDK reports this state in the case of RemoteAudioReasonInternal.
   */
  RemoteAudioStateFailed = 4,
}

/**
 * The reason for the remote audio state change.
 */
export enum RemoteAudioStateReason {
  /**
   * 0: The SDK reports this reason when the audio state changes.
   */
  RemoteAudioReasonInternal = 0,
  /**
   * 1: Network congestion.
   */
  RemoteAudioReasonNetworkCongestion = 1,
  /**
   * 2: Network recovery.
   */
  RemoteAudioReasonNetworkRecovery = 2,
  /**
   * 3: The local user stops receiving the remote audio stream or disables the audio module.
   */
  RemoteAudioReasonLocalMuted = 3,
  /**
   * 4: The local user resumes receiving the remote audio stream or enables the audio module.
   */
  RemoteAudioReasonLocalUnmuted = 4,
  /**
   * 5: The remote user stops sending the audio stream or disables the audio module.
   */
  RemoteAudioReasonRemoteMuted = 5,
  /**
   * 6: The remote user resumes sending the audio stream or enables the audio module.
   */
  RemoteAudioReasonRemoteUnmuted = 6,
  /**
   * 7: The remote user leaves the channel.
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
 * The state of the remote video stream.
 */
export enum RemoteVideoState {
  /**
   * 0: The remote video is in the initial state. The SDK reports this state in the case of RemoteVideoStateReasonLocalMuted, RemoteVideoStateReasonRemoteMuted, or RemoteVideoStateReasonRemoteOffline.
   */
  RemoteVideoStateStopped = 0,
  /**
   * 1: The first remote video packet is received.
   */
  RemoteVideoStateStarting = 1,
  /**
   * 2: The remote video stream is decoded and plays normally. The SDK reports this state in the case of RemoteVideoStateReasonNetworkRecovery, RemoteVideoStateReasonLocalUnmuted, or RemoteVideoStateReasonRemoteUnmuted.
   */
  RemoteVideoStateDecoding = 2,
  /**
   * 3: The remote video is frozen. The SDK reports this state in the case of RemoteVideoStateReasonNetworkCongestion.
   */
  RemoteVideoStateFrozen = 3,
  /**
   * 4: The remote video fails to start. The SDK reports this state in the case of RemoteVideoStateReasonInternal.
   */
  RemoteVideoStateFailed = 4,
}

/**
 * The reason for the remote video state change.
 */
export enum RemoteVideoStateReason {
  /**
   * 0: The SDK reports this reason when the video state changes.
   */
  RemoteVideoStateReasonInternal = 0,
  /**
   * 1: Network congestion.
   */
  RemoteVideoStateReasonNetworkCongestion = 1,
  /**
   * 2: Network is recovered.
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
   * 8: The remote audio-and-video stream falls back to the audio-only stream due to poor network conditions.
   */
  RemoteVideoStateReasonAudioFallback = 8,
  /**
   * 9: The remote audio-only stream switches back to the audio-and-video stream after the network conditions improve.
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
   * 13: The local video decoder does not support decoding the remote video stream.
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
  isLocal?: boolean;
  ownerUid?: number;
  trackId?: number;
  channelId?: string;
  streamType?: VideoStreamType;
  codecType?: VideoCodecType;
  encodedFrameOnly?: boolean;
  sourceType?: VideoSourceType;
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
 * The volume information of users.
 */
export class AudioVolumeInfo {
  uid?: number;
  volume?: number;
  vad?: number;
  voicePitch?: number;
}

/**
 * The audio device information.
 */
export class DeviceInfo {
  isLowLatencyAudioSupported?: boolean;
}

/**
 * @ignore
 */
export class Packet {
  buffer?: Uint8Array;
  size?: number;
}

/**
 * The audio sampling rate of the stream to be pushed to the CDN.
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
 * The codec type of the output video.
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
 * Video codec profile types.
 */
export enum VideoCodecProfileType {
  /**
   * 66: Baseline video codec profile; generally used for video calls on mobile phones.
   */
  VideoCodecProfileBaseline = 66,
  /**
   * 77: Main video codec profile; generally used in mainstream electronics such as MP4 players, portable video players, PSP, and iPads.
   */
  VideoCodecProfileMain = 77,
  /**
   * 100: (Default) High video codec profile; generally used in high-resolution live streaming or television.
   */
  VideoCodecProfileHigh = 100,
}

/**
 * Self-defined audio codec profile.
 */
export enum AudioCodecProfileType {
  /**
   * 0: (Default) LC-AAC.
   */
  AudioCodecProfileLcAac = 0,
  /**
   * 1: HE-AAC.
   */
  AudioCodecProfileHeAac = 1,
  /**
   * 2: HE-AAC v2.
   */
  AudioCodecProfileHeAacV2 = 2,
}

/**
 * Local audio statistics.
 */
export class LocalAudioStats {
  numChannels?: number;
  sentSampleRate?: number;
  sentBitrate?: number;
  internalCodec?: number;
  txPacketLossRate?: number;
  audioDeviceDelay?: number;
}

/**
 * States of the Media Push.
 */
export enum RtmpStreamPublishState {
  /**
   * 0: The Media Push has not started or has ended.
   */
  RtmpStreamPublishStateIdle = 0,
  /**
   * 1: The streaming server and CDN server are being connected.
   */
  RtmpStreamPublishStateConnecting = 1,
  /**
   * 2: The RTMP or RTMPS streaming publishes. The SDK successfully publishes the RTMP or RTMPS streaming and returns this state.
   */
  RtmpStreamPublishStateRunning = 2,
  /**
   * 3: The RTMP or RTMPS streaming is recovering. When exceptions occur to the CDN, or the streaming is interrupted, the SDK tries to resume RTMP or RTMPS streaming and returns this state.
   *  If the SDK successfully resumes the streaming, RtmpStreamPublishStateRunning (2) returns.
   *  If the streaming does not resume within 60 seconds or server errors occur, RtmpStreamPublishStateFailure (4) returns. If you feel that 60 seconds is too long, you can also actively try to reconnect.
   */
  RtmpStreamPublishStateRecovering = 3,
  /**
   * 4: The RTMP or RTMPS streaming fails. After a failure, you can troubleshoot the cause of the error through the returned error code.
   */
  RtmpStreamPublishStateFailure = 4,
  /**
   * 5: The SDK is disconnecting from the Agora streaming server and CDN. When you call stopRtmpStream to stop the Media Push normally, the SDK reports the Media Push state as RtmpStreamPublishStateDisconnecting and RtmpStreamPublishStateIdle in sequence.
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
 * Events during the Media Push.
 */
export enum RtmpStreamingEvent {
  /**
   * 1: An error occurs when you add a background image or a watermark image in the Media Push.
   */
  RtmpStreamingEventFailedLoadImage = 1,
  /**
   * 2: The streaming URL is already being used for Media Push. If you want to start new streaming, use a new streaming URL.
   */
  RtmpStreamingEventUrlAlreadyInUse = 2,
  /**
   * 3: The feature is not supported.
   */
  RtmpStreamingEventAdvancedFeatureNotSupport = 3,
  /**
   * 4: Reserved.
   */
  RtmpStreamingEventRequestTooOften = 4,
}

/**
 * Image properties.
 *
 * This class sets the properties of the watermark and background images in the live video.
 */
export class RtcImage {
  url?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  zOrder?: number;
  alpha?: number;
}

/**
 * The configuration for advanced features of the RTMP or RTMPS streaming with transcoding.
 *
 * If you want to enable the advanced features of streaming with transcoding, contact.
 */
export class LiveStreamAdvancedFeature {
  featureName?: string;
  opened?: boolean;
}

/**
 * Connection states.
 */
export enum ConnectionStateType {
  /**
   * 1: The SDK is disconnected from the Agora edge server. The state indicates the SDK is in one of the following phases:
   *  Theinitial state before calling the joinChannel method.
   *  The app calls the leaveChannel method.
   */
  ConnectionStateDisconnected = 1,
  /**
   * 2: The SDK is connecting to the Agora edge server. This state indicates that the SDK is establishing a connection with the specified channel after the app calls joinChannel.
   *  If the SDK successfully joins the channel, it triggers the onConnectionStateChanged callback and the connection state switches to ConnectionStateConnected.
   *  After the connection is established, the SDK also initializes the media and triggers onJoinChannelSuccess when everything is ready.
   */
  ConnectionStateConnecting = 2,
  /**
   * 3: The SDK is connected to the Agora edge server. This state also indicates that the user has joined a channel and can now publish or subscribe to a media stream in the channel. If the connection to the channel is lost because, for example, if the network is down or switched, the SDK automatically tries to reconnect and triggers onConnectionStateChanged callback, notifying that the current network state becomes ConnectionStateReconnecting.
   */
  ConnectionStateConnected = 3,
  /**
   * 4: The SDK keeps reconnecting to the Agora edge server. The SDK keeps rejoining the channel after being disconnected from a joined channel because of network issues.
   *  If the SDK cannot rejoin the channel within 10 seconds, it triggers onConnectionLost, stays in the ConnectionStateReconnecting state, and keeps rejoining the channel.
   *  If the SDK fails to rejoin the channel 20 minutes after being disconnected from the Agora edge server, the SDK triggers the onConnectionStateChanged callback, switches to the ConnectionStateFailed state, and stops rejoining the channel.
   */
  ConnectionStateReconnecting = 4,
  /**
   * 5: The SDK fails to connect to the Agora edge server or join the channel. This state indicates that the SDK stops trying to rejoin the channel. You must call leaveChannel to leave the channel.
   *  You can call joinChannel to rejoin the channel.
   *  If the SDK is banned from joining the channel by the Agora edge server through the RESTful API, the SDK triggers the onConnectionStateChanged callback.
   */
  ConnectionStateFailed = 5,
}

/**
 * Transcoding configurations of each host.
 */
export class TranscodingUser {
  uid?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  zOrder?: number;
  alpha?: number;
  audioChannel?: number;
}

/**
 * Transcoding configurations for Media Push.
 */
export class LiveTranscoding {
  width?: number;
  height?: number;
  videoBitrate?: number;
  videoFramerate?: number;
  lowLatency?: boolean;
  videoGop?: number;
  videoCodecProfile?: VideoCodecProfileType;
  backgroundColor?: number;
  videoCodecType?: VideoCodecTypeForStream;
  userCount?: number;
  transcodingUsers?: TranscodingUser[];
  transcodingExtraInfo?: string;
  metadata?: string;
  watermark?: RtcImage[];
  watermarkCount?: number;
  backgroundImage?: RtcImage[];
  backgroundImageCount?: number;
  audioSampleRate?: AudioSampleRateType;
  audioBitrate?: number;
  audioChannels?: number;
  audioCodecProfile?: AudioCodecProfileType;
  advancedFeatures?: LiveStreamAdvancedFeature[];
  advancedFeatureCount?: number;
}

/**
 * The video streams for local video mixing.
 */
export class TranscodingVideoStream {
  sourceType?: VideoSourceType;
  remoteUserUid?: number;
  imageUrl?: string;
  mediaPlayerId?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  zOrder?: number;
  alpha?: number;
  mirror?: boolean;
}

/**
 * The configuration of the video mixing on the local client.
 */
export class LocalTranscoderConfiguration {
  streamCount?: number;
  videoInputStreams?: TranscodingVideoStream[];
  videoOutputConfiguration?: VideoEncoderConfiguration;
  syncWithPrimaryCamera?: boolean;
}

/**
 * The error code of the local video mixing failure.
 */
export enum VideoTranscoderError {
  /**
   * 1: The selected video source has not started video capture. You need to create a video track for it and start video capture.
   */
  VtErrVideoSourceNotReady = 1,
  /**
   * 2: The video source type is invalid. You need to re-specify the supported video source type.
   */
  VtErrInvalidVideoSourceType = 2,
  /**
   * 3: The image path is invalid. You need to re-specify the correct image path.
   */
  VtErrInvalidImagePath = 3,
  /**
   * 4: The image format is invalid. Make sure the image format is one of PNG, JPEG, or GIF.
   */
  VtErrUnsupportImageFormat = 4,
  /**
   * 5: The video encoding resolution after video mixing is invalid.
   */
  VtErrInvalidLayout = 5,
  /**
   * 20: Unknown internal error.
   */
  VtErrInternal = 20,
}

/**
 * Configurations of the last-mile network test.
 */
export class LastmileProbeConfig {
  probeUplink?: boolean;
  probeDownlink?: boolean;
  expectedUplinkBitrate?: number;
  expectedDownlinkBitrate?: number;
}

/**
 * The status of the last-mile probe test.
 */
export enum LastmileProbeResultState {
  /**
   * 1: The last-mile network probe test is complete.
   */
  LastmileProbeResultComplete = 1,
  /**
   * 2: The last-mile network probe test is incomplete because the bandwidth estimation is not available due to limited test resources. One possible reason is that testing resources are temporarily limited.
   */
  LastmileProbeResultIncompleteNoBwe = 2,
  /**
   * 3: The last-mile network probe test is not carried out. Probably due to poor network conditions.
   */
  LastmileProbeResultUnavailable = 3,
}

/**
 * Results of the uplink or downlink last-mile network test.
 */
export class LastmileProbeOneWayResult {
  packetLossRate?: number;
  jitter?: number;
  availableBandwidth?: number;
}

/**
 * Results of the uplink and downlink last-mile network tests.
 */
export class LastmileProbeResult {
  state?: LastmileProbeResultState;
  uplinkReport?: LastmileProbeOneWayResult;
  downlinkReport?: LastmileProbeOneWayResult;
  rtt?: number;
}

/**
 * Reasons causing the change of the connection state.
 */
export enum ConnectionChangedReasonType {
  /**
   * 0: The SDK is connecting to the Agora edge server.
   */
  ConnectionChangedConnecting = 0,
  /**
   * 1: The SDK has joined the channel successfully.
   */
  ConnectionChangedJoinSuccess = 1,
  /**
   * 2: The connection between the SDK and the Agora edge server is interrupted.
   */
  ConnectionChangedInterrupted = 2,
  /**
   * 3: The connection between the SDK and the Agora edge server is banned by the Agora edge server. For example, when a user is kicked out of the channel, this status will be returned.
   */
  ConnectionChangedBannedByServer = 3,
  /**
   * 4: The SDK fails to join the channel. When the SDK fails to join the channel for more than 20 minutes, this code will be returned and the SDK stops reconnecting to the channel. You need to prompt the user to try to switch to another network and rejoin the channel.
   */
  ConnectionChangedJoinFailed = 4,
  /**
   * 5: The SDK has left the channel.
   */
  ConnectionChangedLeaveChannel = 5,
  /**
   * 6: The App ID is invalid. You need to rejoin the channel with a valid APP ID and make sure the App ID you are using is consistent with the one generated in the Agora Console.
   */
  ConnectionChangedInvalidAppId = 6,
  /**
   * 7: Invalid channel name. Rejoin the channel with a valid channel name. A valid channel name is a string of up to 64 bytes in length. Supported characters (89 characters in total):
   *  All lowercase English letters: a to z.
   *  All uppercase English letters: A to Z.
   *  All numeric characters: 0 to 9.
   *  "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
   */
  ConnectionChangedInvalidChannelName = 7,
  /**
   * 8: Invalid token. Possible reasons are as follows:
   *  The App Certificate for the project is enabled in Agora Console, but you do not pass in a token when joining a channel.
   *  The uid specified when calling joinChannel to join the channel is inconsistent with the uid passed in when generating the token.
   *  The generated token and the token used to join the channel are not consistent. Ensure the following:
   *  When your project enables App Certificate, you need to pass in a token to join a channel.
   *  The user ID specified when generating the token is consistent with the user ID used when joining the channel.
   *  The generated token is the same as the token passed in to join the channel.
   */
  ConnectionChangedInvalidToken = 8,
  /**
   * (9): The token currently being used has expired. You need to generate a new token on your server and rejoin the channel with the new token.
   */
  ConnectionChangedTokenExpired = 9,
  /**
   * 10: The connection is rejected by server. Possible reasons are as follows:
   *  The user is already in the channel and still calls a method, for example, joinChannel, to join the channel. Stop calling this method to clear this error.
   *  The user tries to join a channel while a test call is in progress. The user needs to join the channel after the call test ends.
   */
  ConnectionChangedRejectedByServer = 10,
  /**
   * 11: The connection state changed to reconnecting because the SDK has set a proxy server.
   */
  ConnectionChangedSettingProxyServer = 11,
  /**
   * 12: The connection state changed because the token is renewed.
   */
  ConnectionChangedRenewToken = 12,
  /**
   * (13): Client IP address changed. If you receive this code multiple times, You need to prompt the user to switch networks and try joining the channel again.
   */
  ConnectionChangedClientIpAddressChanged = 13,
  /**
   * 14: Timeout for the keep-alive of the connection between the SDK and the Agora edge server. The SDK tries to reconnect to the server automatically.
   */
  ConnectionChangedKeepAliveTimeout = 14,
  /**
   * 15: The user has rejoined the channel successfully.
   */
  ConnectionChangedRejoinSuccess = 15,
  /**
   * 16: The connection between the SDK and the server is lost.
   */
  ConnectionChangedLost = 16,
  /**
   * 17: The connection state changes due to the echo test.
   */
  ConnectionChangedEchoTest = 17,
  /**
   * 18: The local IP address was changed by the user.
   */
  ConnectionChangedClientIpAddressChangedByUser = 18,
  /**
   * 19: The user joined the same channel from different devices with the same UID.
   */
  ConnectionChangedSameUidLogin = 19,
  /**
   * 20: The number of hosts in the channel has reached the upper limit.
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
 * The reason for a user role switch failure.
 */
export enum ClientRoleChangeFailedReason {
  /**
   * 1: The number of hosts in the channel exceeds the limit. This enumerator is reported only when the support for 128 users is enabled. The maximum number of hosts is based on the actual number of hosts configured when you enable the 128-user feature.
   */
  ClientRoleChangeFailedTooManyBroadcasters = 1,
  /**
   * 2: The request is rejected by the Agora server. Agora recommends you prompt the user to try to switch their user role again.
   */
  ClientRoleChangeFailedNotAuthorized = 2,
  /**
   * 3: The request is timed out. Agora recommends you prompt the user to check the network connection and try to switch their user role again. Deprecated: This enumerator is deprecated since v4.4.0 and is not recommended for use.
   */
  ClientRoleChangeFailedRequestTimeOut = 3,
  /**
   * 4: The SDK is disconnected from the Agora edge server. You can troubleshoot the failure through the reason reported by onConnectionStateChanged. Deprecated: This enumerator is deprecated since v4.4.0 and is not recommended for use.
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
  e2eDelayPercent?: number;
  frozenRatioPercent?: number;
  lossRatePercent?: number;
}

/**
 * Network type.
 */
export enum NetworkType {
  /**
   * -1: The network type is unknown.
   */
  NetworkTypeUnknown = -1,
  /**
   * 0: The SDK disconnects from the network.
   */
  NetworkTypeDisconnected = 0,
  /**
   * 1: The network type is LAN.
   */
  NetworkTypeLan = 1,
  /**
   * 2: The network type is Wi-Fi (including hotspots).
   */
  NetworkTypeWifi = 2,
  /**
   * 3: The network type is mobile 2G.
   */
  NetworkTypeMobile2g = 3,
  /**
   * 4: The network type is mobile 3G.
   */
  NetworkTypeMobile3g = 4,
  /**
   * 5: The network type is mobile 4G.
   */
  NetworkTypeMobile4g = 5,
  /**
   * 6: The network type is mobile 5G.
   */
  NetworkTypeMobile5g = 6,
}

/**
 * Setting mode of the view.
 */
export enum VideoViewSetupMode {
  /**
   * 0: (Default) Clear all added views and replace with a new view.
   */
  VideoViewSetupReplace = 0,
  /**
   * 1: Adds a view.
   */
  VideoViewSetupAdd = 1,
  /**
   * 2: Deletes a view.
   */
  VideoViewSetupRemove = 2,
}

/**
 * Attributes of the video canvas object.
 */
export class VideoCanvas {
  view?: any;
  uid?: number;
  backgroundColor?: number;
  renderMode?: RenderModeType;
  mirrorMode?: VideoMirrorModeType;
  setupMode?: VideoViewSetupMode;
  sourceType?: VideoSourceType;
  mediaPlayerId?: number;
  cropArea?: Rectangle;
  enableAlphaMask?: boolean;
  rotation?: VideoOrientation;
}

/**
 * The contrast level.
 */
export enum LighteningContrastLevel {
  /**
   * 0: Low contrast level.
   */
  LighteningContrastLow = 0,
  /**
   * 1: (Default) Normal contrast level.
   */
  LighteningContrastNormal = 1,
  /**
   * 2: High contrast level.
   */
  LighteningContrastHigh = 2,
}

/**
 * Image enhancement options.
 */
export class BeautyOptions {
  lighteningContrastLevel?: LighteningContrastLevel;
  lighteningLevel?: number;
  smoothnessLevel?: number;
  rednessLevel?: number;
  sharpnessLevel?: number;
}

/**
 * The low-light enhancement mode.
 */
export enum LowLightEnhanceMode {
  /**
   * 0: (Default) Automatic mode. The SDK automatically enables or disables the low-light enhancement feature according to the ambient light to compensate for the lighting level or prevent overexposure, as necessary.
   */
  LowLightEnhanceAuto = 0,
  /**
   * 1: Manual mode. Users need to enable or disable the low-light enhancement feature manually.
   */
  LowLightEnhanceManual = 1,
}

/**
 * The low-light enhancement level.
 */
export enum LowLightEnhanceLevel {
  /**
   * 0: (Default) Promotes video quality during low-light enhancement. It processes the brightness, details, and noise of the video image. The performance consumption is moderate, the processing speed is moderate, and the overall video quality is optimal.
   */
  LowLightEnhanceLevelHighQuality = 0,
  /**
   * 1: Promotes performance during low-light enhancement. It processes the brightness and details of the video image. The processing speed is faster.
   */
  LowLightEnhanceLevelFast = 1,
}

/**
 * The low-light enhancement options.
 */
export class LowlightEnhanceOptions {
  mode?: LowLightEnhanceMode;
  level?: LowLightEnhanceLevel;
}

/**
 * Video noise reduction mode.
 */
export enum VideoDenoiserMode {
  /**
   * 0: (Default) Automatic mode. The SDK automatically enables or disables the video noise reduction feature according to the ambient light.
   */
  VideoDenoiserAuto = 0,
  /**
   * 1: Manual mode. Users need to enable or disable the video noise reduction feature manually.
   */
  VideoDenoiserManual = 1,
}

/**
 * Video noise reduction level.
 */
export enum VideoDenoiserLevel {
  /**
   * 0: (Default) Promotes video quality during video noise reduction. balances performance consumption and video noise reduction quality. The performance consumption is moderate, the video noise reduction speed is moderate, and the overall video quality is optimal.
   */
  VideoDenoiserLevelHighQuality = 0,
  /**
   * 1: Promotes reducing performance consumption during video noise reduction. It prioritizes reducing performance consumption over video noise reduction quality. The performance consumption is lower, and the video noise reduction speed is faster. To avoid a noticeable shadowing effect (shadows trailing behind moving objects) in the processed video, Agora recommends that you use this setting when the camera is fixed.
   */
  VideoDenoiserLevelFast = 1,
  /**
   * @ignore
   */
  VideoDenoiserLevelStrength = 2,
}

/**
 * Video noise reduction options.
 */
export class VideoDenoiserOptions {
  mode?: VideoDenoiserMode;
  level?: VideoDenoiserLevel;
}

/**
 * The color enhancement options.
 */
export class ColorEnhanceOptions {
  strengthLevel?: number;
  skinProtectLevel?: number;
}

/**
 * The custom background.
 */
export enum BackgroundSourceType {
  /**
   * @ignore
   */
  BackgroundNone = 0,
  /**
   * 1: (Default) The background image is a solid color.
   */
  BackgroundColor = 1,
  /**
   * 2: The background is an image in PNG or JPG format.
   */
  BackgroundImg = 2,
  /**
   * 3: The background is a blurred version of the original background.
   */
  BackgroundBlur = 3,
  /**
   * 4: The background is a local video in MP4, AVI, MKV, FLV, or other supported formats.
   */
  BackgroundVideo = 4,
}

/**
 * The degree of blurring applied to the custom background image.
 */
export enum BackgroundBlurDegree {
  /**
   * 1: The degree of blurring applied to the custom background image is low. The user can almost see the background clearly.
   */
  BlurDegreeLow = 1,
  /**
   * 2: The degree of blurring applied to the custom background image is medium. It is difficult for the user to recognize details in the background.
   */
  BlurDegreeMedium = 2,
  /**
   * 3: (Default) The degree of blurring applied to the custom background image is high. The user can barely see any distinguishing features in the background.
   */
  BlurDegreeHigh = 3,
}

/**
 * The custom background.
 */
export class VirtualBackgroundSource {
  background_source_type?: BackgroundSourceType;
  color?: number;
  source?: string;
  blur_degree?: BackgroundBlurDegree;
}

/**
 * The type of algorithms to user for background processing.
 */
export enum SegModelType {
  /**
   * 1: (Default) Use the algorithm suitable for all scenarios.
   */
  SegModelAi = 1,
  /**
   * 2: Use the algorithm designed specifically for scenarios with a green screen background.
   */
  SegModelGreen = 2,
}

/**
 * Processing properties for background images.
 */
export class SegmentationProperty {
  modelType?: SegModelType;
  greenCapacity?: number;
}

/**
 * The type of the audio track.
 */
export enum AudioTrackType {
  /**
   * @ignore
   */
  AudioTrackInvalid = -1,
  /**
   * 0: Mixable audio tracks. This type of audio track supports mixing with other audio streams (such as audio streams captured by microphone) and playing locally or publishing to channels after mixing. The latency of mixable audio tracks is higher than that of direct audio tracks.
   */
  AudioTrackMixable = 0,
  /**
   * 1: Direct audio tracks. This type of audio track will replace the audio streams captured by the microphone and does not support mixing with other audio streams. The latency of direct audio tracks is lower than that of mixable audio tracks. If AudioTrackDirect is specified for this parameter, you must set publishMicrophoneTrack to false in ChannelMediaOptions when calling joinChannel to join the channel; otherwise, joining the channel fails and returns the error code -2.
   */
  AudioTrackDirect = 1,
}

/**
 * The configuration of custom audio tracks.
 */
export class AudioTrackConfig {
  enableLocalPlayback?: boolean;
}

/**
 * The options for SDK preset voice beautifier effects.
 */
export enum VoiceBeautifierPreset {
  /**
   * Turn off voice beautifier effects and use the original voice.
   */
  VoiceBeautifierOff = 0x00000000,
  /**
   * A more magnetic voice. Agora recommends using this enumerator to process a male-sounding voice; otherwise, you may experience vocal distortion.
   */
  ChatBeautifierMagnetic = 0x01010100,
  /**
   * A fresher voice. Agora recommends using this enumerator to process a female-sounding voice; otherwise, you may experience vocal distortion.
   */
  ChatBeautifierFresh = 0x01010200,
  /**
   * A more vital voice. Agora recommends using this enumerator to process a female-sounding voice; otherwise, you may experience vocal distortion.
   */
  ChatBeautifierVitality = 0x01010300,
  /**
   * Singing beautifier effect.
   *  If you call setVoiceBeautifierPreset (SingingBeautifier), you can beautify a male-sounding voice and add a reverberation effect that sounds like singing in a small room. Agora recommends using this enumerator to process a male-sounding voice; otherwise, you might experience vocal distortion.
   *  If you call setVoiceBeautifierParameters (SingingBeautifier, param1, param2), you can beautify a male or female-sounding voice and add a reverberation effect.
   */
  SingingBeautifier = 0x01020100,
  /**
   * A more vigorous voice.
   */
  TimbreTransformationVigorous = 0x01030100,
  /**
   * A deep voice.
   */
  TimbreTransformationDeep = 0x01030200,
  /**
   * A mellower voice.
   */
  TimbreTransformationMellow = 0x01030300,
  /**
   * Falsetto.
   */
  TimbreTransformationFalsetto = 0x01030400,
  /**
   * A fuller voice.
   */
  TimbreTransformationFull = 0x01030500,
  /**
   * A clearer voice.
   */
  TimbreTransformationClear = 0x01030600,
  /**
   * A more resounding voice.
   */
  TimbreTransformationResounding = 0x01030700,
  /**
   * A more ringing voice.
   */
  TimbreTransformationRinging = 0x01030800,
  /**
   * A ultra-high quality voice, which makes the audio clearer and restores more details.
   *  To achieve better audio effect quality, Agora recommends that you set the profile of to AudioProfileMusicHighQuality (4) or AudioProfileMusicHighQualityStereo (5) and scenario to AudioScenarioGameStreaming (3) before calling setVoiceBeautifierPreset.
   *  If you have an audio capturing device that can already restore audio details to a high degree, Agora recommends that you do not enable ultra-high quality; otherwise, the SDK may over-restore audio details, and you may not hear the anticipated voice effect.
   */
  UltraHighQualityVoice = 0x01040100,
}

/**
 * Preset audio effects.
 *
 * To get better audio effects, Agora recommends calling setAudioProfile and setting the profile parameter as recommended below before using the preset audio effects.
 */
export enum AudioEffectPreset {
  /**
   * Turn off voice effects, that is, use the original voice.
   */
  AudioEffectOff = 0x00000000,
  /**
   * The voice effect typical of a KTV venue.
   */
  RoomAcousticsKtv = 0x02010100,
  /**
   * The voice effect typical of a concert hall.
   */
  RoomAcousticsVocalConcert = 0x02010200,
  /**
   * The voice effect typical of a recording studio.
   */
  RoomAcousticsStudio = 0x02010300,
  /**
   * The voice effect typical of a vintage phonograph.
   */
  RoomAcousticsPhonograph = 0x02010400,
  /**
   * The virtual stereo effect, which renders monophonic audio as stereo audio.
   */
  RoomAcousticsVirtualStereo = 0x02010500,
  /**
   * A more spatial voice effect.
   */
  RoomAcousticsSpacial = 0x02010600,
  /**
   * A more ethereal voice effect.
   */
  RoomAcousticsEthereal = 0x02010700,
  /**
   * A 3D voice effect that makes the voice appear to be moving around the user. The default cycle period is 10 seconds. After setting this effect, you can call setAudioEffectParameters to modify the movement period. If the 3D voice effect is enabled, users need to use stereo audio playback devices to hear the anticipated voice effect.
   */
  RoomAcoustics3dVoice = 0x02010800,
  /**
   * Virtual surround sound, that is, the SDK generates a simulated surround sound field on the basis of stereo channels, thereby creating a surround sound effect. If the virtual surround sound is enabled, users need to use stereo audio playback devices to hear the anticipated audio effect.
   */
  RoomAcousticsVirtualSurroundSound = 0x02010900,
  /**
   * A middle-aged man's voice. Agora recommends using this preset to process a male-sounding voice; otherwise, you may not hear the anticipated voice effect.
   */
  VoiceChangerEffectUncle = 0x02020100,
  /**
   * An older man's voice. Agora recommends using this preset to process a male-sounding voice; otherwise, you may not hear the anticipated voice effect.
   */
  VoiceChangerEffectOldman = 0x02020200,
  /**
   * A boy's voice. Agora recommends using this preset to process a male-sounding voice; otherwise, you may not hear the anticipated voice effect.
   */
  VoiceChangerEffectBoy = 0x02020300,
  /**
   * A young woman's voice. Agora recommends using this preset to process a female-sounding voice; otherwise, you may not hear the anticipated voice effect.
   */
  VoiceChangerEffectSister = 0x02020400,
  /**
   * A girl's voice. Agora recommends using this preset to process a female-sounding voice; otherwise, you may not hear the anticipated voice effect.
   */
  VoiceChangerEffectGirl = 0x02020500,
  /**
   * The voice of Pig King, a character in Journey to the West who has a voice like a growling bear.
   */
  VoiceChangerEffectPigking = 0x02020600,
  /**
   * The Hulk's voice.
   */
  VoiceChangerEffectHulk = 0x02020700,
  /**
   * The voice effect typical of R&B music.
   */
  StyleTransformationRnb = 0x02030100,
  /**
   * The voice effect typical of popular music.
   */
  StyleTransformationPopular = 0x02030200,
  /**
   * A pitch correction effect that corrects the user's pitch based on the pitch of the natural C major scale. After setting this voice effect, you can call setAudioEffectParameters to adjust the basic mode of tuning and the pitch of the main tone.
   */
  PitchCorrection = 0x02040100,
}

/**
 * The options for SDK preset voice conversion effects.
 */
export enum VoiceConversionPreset {
  /**
   * Turn off voice conversion effects and use the original voice.
   */
  VoiceConversionOff = 0x00000000,
  /**
   * A gender-neutral voice. To avoid audio distortion, ensure that you use this enumerator to process a female-sounding voice.
   */
  VoiceChangerNeutral = 0x03010100,
  /**
   * A sweet voice. To avoid audio distortion, ensure that you use this enumerator to process a female-sounding voice.
   */
  VoiceChangerSweet = 0x03010200,
  /**
   * A steady voice. To avoid audio distortion, ensure that you use this enumerator to process a male-sounding voice.
   */
  VoiceChangerSolid = 0x03010300,
  /**
   * A deep voice. To avoid audio distortion, ensure that you use this enumerator to process a male-sounding voice.
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
   * The headphone equalizer is disabled, and the original audio is heard.
   */
  HeadphoneEqualizerOff = 0x00000000,
  /**
   * An equalizer is used for headphones.
   */
  HeadphoneEqualizerOverear = 0x04000001,
  /**
   * An equalizer is used for in-ear headphones.
   */
  HeadphoneEqualizerInear = 0x04000002,
}

/**
 * Screen sharing configurations.
 */
export class ScreenCaptureParameters {
  dimensions?: VideoDimensions;
  frameRate?: number;
  bitrate?: number;
  captureMouseCursor?: boolean;
  windowFocus?: boolean;
  excludeWindowList?: any[];
  excludeWindowCount?: number;
  highLightWidth?: number;
  highLightColor?: number;
  enableHighLight?: boolean;
}

/**
 * Recording quality.
 */
export enum AudioRecordingQualityType {
  /**
   * 0: Low quality. The sample rate is 32 kHz, and the file size is around 1.2 MB after 10 minutes of recording.
   */
  AudioRecordingQualityLow = 0,
  /**
   * 1: Medium quality. The sample rate is 32 kHz, and the file size is around 2 MB after 10 minutes of recording.
   */
  AudioRecordingQualityMedium = 1,
  /**
   * 2: High quality. The sample rate is 32 kHz, and the file size is around 3.75 MB after 10 minutes of recording.
   */
  AudioRecordingQualityHigh = 2,
  /**
   * 3: Ultra high quality. The sample rate is 32 kHz, and the file size is around 7.5 MB after 10 minutes of recording.
   */
  AudioRecordingQualityUltraHigh = 3,
}

/**
 * Recording content. Set in startAudioRecording.
 */
export enum AudioFileRecordingType {
  /**
   * 1: Only records the audio of the local user.
   */
  AudioFileRecordingMic = 1,
  /**
   * 2: Only records the audio of all remote users.
   */
  AudioFileRecordingPlayback = 2,
  /**
   * 3: Records the mixed audio of the local and all remote users.
   */
  AudioFileRecordingMixed = 3,
}

/**
 * Audio profile.
 */
export enum AudioEncodedFrameObserverPosition {
  /**
   * 1: Only records the audio of the local user.
   */
  AudioEncodedFrameObserverPositionRecord = 1,
  /**
   * 2: Only records the audio of all remote users.
   */
  AudioEncodedFrameObserverPositionPlayback = 2,
  /**
   * 3: Records the mixed audio of the local and all remote users.
   */
  AudioEncodedFrameObserverPositionMixed = 3,
}

/**
 * Recording configurations.
 */
export class AudioRecordingConfiguration {
  filePath?: string;
  encode?: boolean;
  sampleRate?: number;
  fileRecordingType?: AudioFileRecordingType;
  quality?: AudioRecordingQualityType;
  recordingChannel?: number;
}

/**
 * Observer settings for the encoded audio.
 */
export class AudioEncodedFrameObserverConfig {
  postionType?: AudioEncodedFrameObserverPosition;
  encodingType?: AudioEncodingType;
}

/**
 * The encoded audio observer.
 */
export interface IAudioEncodedFrameObserver {
  /**
   * Gets the encoded audio data of the local user.
   *
   * After calling registerAudioEncodedFrameObserver and setting the encoded audio as AudioEncodedFrameObserverPositionRecord, you can get the encoded audio data of the local user from this callback.
   *
   * @param channels The number of channels.
   *  1: Mono.
   *  2: Stereo. If the channel uses stereo, the data is interleaved.
   * @param frameBuffer The audio buffer.
   * @param length The data length (byte).
   * @param audioEncodedFrameInfo Audio information after encoding. See EncodedAudioFrameInfo.
   */
  onRecordAudioEncodedFrame?(
    frameBuffer: Uint8Array,
    length: number,
    audioEncodedFrameInfo: EncodedAudioFrameInfo
  ): void;

  /**
   * Gets the encoded audio data of all remote users.
   *
   * After calling registerAudioEncodedFrameObserver and setting the encoded audio as AudioEncodedFrameObserverPositionPlayback, you can get encoded audio data of all remote users through this callback.
   *
   * @param samplesPerSec Recording sample rate (Hz).
   * @param channels The number of channels.
   *  1: Mono.
   *  2: Stereo. If the channel uses stereo, the data is interleaved.
   * @param samplesPerChannel The number of samples per channel in the audio frame.
   * @param frameBuffer The audio buffer.
   * @param length The data length (byte).
   * @param audioEncodedFrameInfo Audio information after encoding. See EncodedAudioFrameInfo.
   */
  onPlaybackAudioEncodedFrame?(
    frameBuffer: Uint8Array,
    length: number,
    audioEncodedFrameInfo: EncodedAudioFrameInfo
  ): void;

  /**
   * Gets the mixed and encoded audio data of the local and all remote users.
   *
   * After calling registerAudioEncodedFrameObserver and setting the audio profile as AudioEncodedFrameObserverPositionMixed, you can get the mixed and encoded audio data of the local and all remote users through this callback.
   *
   * @param samplesPerSec Recording sample rate (Hz).
   * @param channels The number of channels.
   *  1: Mono.
   *  2: Stereo. If the channel uses stereo, the data is interleaved.
   * @param samplesPerChannel The number of samples per channel in the audio frame.
   * @param frameBuffer The audio buffer.
   * @param length The data length (byte).
   * @param audioEncodedFrameInfo Audio information after encoding. See EncodedAudioFrameInfo.
   */
  onMixedAudioEncodedFrame?(
    frameBuffer: Uint8Array,
    length: number,
    audioEncodedFrameInfo: EncodedAudioFrameInfo
  ): void;
}

/**
 * The region for connection, which is the region where the server the SDK connects to is located.
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
   * Asia, excluding Mainland China.
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
 * The error code of the channel media relay.
 */
export enum ChannelMediaRelayError {
  /**
   * 0: No error.
   */
  RelayOk = 0,
  /**
   * 1: An error occurs in the server response.
   */
  RelayErrorServerErrorResponse = 1,
  /**
   * 2: No server response. This error may be caused by poor network connections. If this error occurs when initiating a channel media relay, you can try again later; if this error occurs during channel media relay, you can call leaveChannel to leave the channel. This error can also occur if the channel media relay service is not enabled in the project. You can contact to enable the service.
   */
  RelayErrorServerNoResponse = 2,
  /**
   * 3: The SDK fails to access the service, probably due to limited resources of the server.
   */
  RelayErrorNoResourceAvailable = 3,
  /**
   * 4: Fails to send the relay request.
   */
  RelayErrorFailedJoinSrc = 4,
  /**
   * 5: Fails to accept the relay request.
   */
  RelayErrorFailedJoinDest = 5,
  /**
   * 6: The server fails to receive the media stream.
   */
  RelayErrorFailedPacketReceivedFromSrc = 6,
  /**
   * 7: The server fails to send the media stream.
   */
  RelayErrorFailedPacketSentToDest = 7,
  /**
   * 8: The SDK disconnects from the server due to poor network connections. You can call leaveChannel to leave the channel.
   */
  RelayErrorServerConnectionLost = 8,
  /**
   * 9: An internal error occurs in the server.
   */
  RelayErrorInternalError = 9,
  /**
   * 10: The token of the source channel has expired.
   */
  RelayErrorSrcTokenExpired = 10,
  /**
   * 11: The token of the destination channel has expired.
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
 * The state code of the channel media relay.
 */
export enum ChannelMediaRelayState {
  /**
   * 0: The initial state. After you successfully stop the channel media relay by calling stopChannelMediaRelay, the onChannelMediaRelayStateChanged callback returns this state.
   */
  RelayStateIdle = 0,
  /**
   * 1: The SDK tries to relay the media stream to the destination channel.
   */
  RelayStateConnecting = 1,
  /**
   * 2: The SDK successfully relays the media stream to the destination channel.
   */
  RelayStateRunning = 2,
  /**
   * 3: An error occurs. See code in onChannelMediaRelayStateChanged for the error code.
   */
  RelayStateFailure = 3,
}

/**
 * Channel media information.
 */
export class ChannelMediaInfo {
  channelName?: string;
  token?: string;
  uid?: number;
}

/**
 * Configuration of cross channel media relay.
 */
export class ChannelMediaRelayConfiguration {
  srcInfo?: ChannelMediaInfo;
  destInfos?: ChannelMediaInfo[];
  destCount?: number;
}

/**
 * The uplink network information.
 */
export class UplinkNetworkInfo {
  video_encoder_target_bitrate_bps?: number;
}

/**
 * @ignore
 */
export class PeerDownlinkInfo {
  uid?: string;
  stream_type?: VideoStreamType;
  current_downscale_level?: RemoteVideoDownscaleLevel;
  expected_bitrate_bps?: number;
}

/**
 * @ignore
 */
export class DownlinkNetworkInfo {
  lastmile_buffer_delay_time_ms?: number;
  bandwidth_estimation_bps?: number;
  total_downscale_level_count?: number;
  peer_downlink_info?: PeerDownlinkInfo[];
  total_received_video_count?: number;
}

/**
 * The built-in encryption mode.
 *
 * Agora recommends using Aes128Gcm2 or Aes256Gcm2 encrypted mode. These two modes support the use of salt for higher security.
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
   * 7: (Default) 128-bit AES encryption, GCM mode. This encryption mode requires the setting of salt (encryptionKdfSalt).
   */
  Aes128Gcm2 = 7,
  /**
   * 8: 256-bit AES encryption, GCM mode. This encryption mode requires the setting of salt (encryptionKdfSalt).
   */
  Aes256Gcm2 = 8,
  /**
   * Enumerator boundary.
   */
  ModeEnd = 9,
}

/**
 * Built-in encryption configurations.
 */
export class EncryptionConfig {
  encryptionMode?: EncryptionMode;
  encryptionKey?: string;
  encryptionKdfSalt?: number[];
  datastreamEncryptionEnabled?: boolean;
}

/**
 * Encryption error type.
 */
export enum EncryptionErrorType {
  /**
   * 0: Internal reason.
   */
  EncryptionErrorInternalFailure = 0,
  /**
   * 1: Media stream decryption error. Ensure that the receiver and the sender use the same encryption mode and key.
   */
  EncryptionErrorDecryptionFailure = 1,
  /**
   * 2: Media stream encryption error.
   */
  EncryptionErrorEncryptionFailure = 2,
  /**
   * 3: Data stream decryption error. Ensure that the receiver and the sender use the same encryption mode and key.
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
 * The type of the device permission.
 */
export enum PermissionType {
  /**
   * 0: Permission for the audio capture device.
   */
  RecordAudio = 0,
  /**
   * 1: Permission for the camera.
   */
  Camera = 1,
  /**
   * @ignore
   */
  ScreenCapture = 2,
}

/**
 * The maximum length of the user account.
 */
export enum MaxUserAccountLengthType {
  /**
   * The maximum length of the user account is 256 bytes.
   */
  MaxUserAccountLength = 256,
}

/**
 * The subscribing state.
 */
export enum StreamSubscribeState {
  /**
   * 0: The initial publishing state after joining the channel.
   */
  SubStateIdle = 0,
  /**
   * 1: Fails to subscribe to the remote stream. Possible reasons:
   *  The remote user:
   *  Calls muteLocalAudioStream (true) or muteLocalVideoStream (true) to stop sending local media stream.
   *  Calls disableAudio or disableVideo to disable the local audio or video module.
   *  Calls enableLocalAudio (false) or enableLocalVideo (false) to disable local audio or video capture.
   *  The role of the remote user is audience.
   *  The local user calls the following methods to stop receiving remote streams:
   *  Call muteRemoteAudioStream (true) or muteAllRemoteAudioStreams (true) to stop receiving the remote audio stream.
   *  Call muteRemoteVideoStream (true) or muteAllRemoteVideoStreams (true) to stop receiving the remote video stream.
   */
  SubStateNoSubscribed = 1,
  /**
   * 2: Subscribing.
   */
  SubStateSubscribing = 2,
  /**
   * 3: The remote stream is received, and the subscription is successful.
   */
  SubStateSubscribed = 3,
}

/**
 * The publishing state.
 */
export enum StreamPublishState {
  /**
   * 0: The initial publishing state after joining the channel.
   */
  PubStateIdle = 0,
  /**
   * 1: Fails to publish the local stream. Possible reasons:
   *  The local user calls muteLocalAudioStream (true) or muteLocalVideoStream (true) to stop sending local media streams.
   *  The local user calls disableAudio or disableVideo to disable the local audio or video module.
   *  The local user calls enableLocalAudio (false) or enableLocalVideo (false) to disable the local audio or video capture.
   *  The role of the local user is audience.
   */
  PubStateNoPublished = 1,
  /**
   * 2: Publishing.
   */
  PubStatePublishing = 2,
  /**
   * 3: Publishes successfully.
   */
  PubStatePublished = 3,
}

/**
 * The configuration of the audio and video call loop test.
 */
export class EchoTestConfiguration {
  view?: any;
  enableAudio?: boolean;
  enableVideo?: boolean;
  token?: string;
  channelId?: string;
  intervalInSeconds?: number;
}

/**
 * The information of the user.
 */
export class UserInfo {
  uid?: number;
  userAccount?: string;
}

/**
 * The audio filter types of in-ear monitoring.
 */
export enum EarMonitoringFilterType {
  /**
   * 1<<0: No audio filter added to in-ear monitoring.
   */
  EarMonitoringFilterNone = 1 << 0,
  /**
   * 1<<1: Add vocal effects audio filter to in-ear monitoring. If you implement functions such as voice beautifier and audio effect, users can hear the voice after adding these effects.
   */
  EarMonitoringFilterBuiltInAudioFilters = 1 << 1,
  /**
   * 1<<2: Add noise suppression audio filter to in-ear monitoring.
   */
  EarMonitoringFilterNoiseSuppression = 1 << 2,
  /**
   * 1<<15: Reuse the audio filter that has been processed on the sending end for in-ear monitoring. This enumerator reduces CPU usage while increasing in-ear monitoring latency, which is suitable for latency-tolerant scenarios requiring low CPU consumption.
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
 * The video configuration for the shared screen stream.
 */
export class ScreenVideoParameters {
  dimensions?: VideoDimensions;
  frameRate?: number;
  bitrate?: number;
  contentHint?: VideoContentHint;
}

/**
 * The audio configuration for the shared screen stream.
 *
 * Only available where captureAudio is true.
 */
export class ScreenAudioParameters {
  sampleRate?: number;
  channels?: number;
  captureSignalVolume?: number;
}

/**
 * @ignore
 */
export class ScreenCaptureParameters2 {
  captureAudio?: boolean;
  audioParams?: ScreenAudioParameters;
  captureVideo?: boolean;
  videoParams?: ScreenVideoParameters;
}

/**
 * The rendering state of the media frame.
 */
export enum MediaTraceEvent {
  /**
   * 0: The video frame has been rendered.
   */
  MediaTraceEventVideoRendered = 0,
  /**
   * 1: The video frame has been decoded.
   */
  MediaTraceEventVideoDecoded = 1,
}

/**
 * Indicators during video frame rendering progress.
 */
export class VideoRenderingTracingInfo {
  elapsedTime?: number;
  start2JoinChannel?: number;
  join2JoinSuccess?: number;
  joinSuccess2RemoteJoined?: number;
  remoteJoined2SetView?: number;
  remoteJoined2UnmuteVideo?: number;
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
  channelId?: string;
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
 * @ignore
 */
export class LogUploadServerInfo {
  serverDomain?: string;
  serverPath?: string;
  serverPort?: number;
  serverHttps?: boolean;
}

/**
 * @ignore
 */
export class AdvancedConfigInfo {
  logUploadServer?: LogUploadServerInfo;
}

/**
 * @ignore
 */
export class LocalAccessPointConfiguration {
  ipList?: string[];
  ipListSize?: number;
  domainList?: string[];
  domainListSize?: number;
  verifyDomainName?: string;
  mode?: LocalProxyMode;
  advancedConfig?: AdvancedConfigInfo;
}

/**
 * The spatial audio parameters.
 */
export class SpatialAudioParams {
  speaker_azimuth?: number;
  speaker_elevation?: number;
  speaker_distance?: number;
  speaker_orientation?: number;
  enable_blur?: boolean;
  enable_air_absorb?: boolean;
  speaker_attenuation?: number;
  enable_doppler?: boolean;
}
