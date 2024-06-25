import './extension/IAgoraRtcEngineExtension';
import {
  AudienceLatencyLevelType,
  AudioAinsMode,
  AudioEffectPreset,
  AudioEncodedFrameObserverConfig,
  AudioProfileType,
  AudioRecordingConfiguration,
  AudioSampleRateType,
  AudioScenarioType,
  AudioSessionOperationRestriction,
  AudioVolumeInfo,
  BeautyOptions,
  CameraStabilizationMode,
  CaptureBrightnessLevelType,
  ChannelMediaRelayConfiguration,
  ChannelMediaRelayError,
  ChannelMediaRelayEvent,
  ChannelMediaRelayState,
  ChannelProfileType,
  ClientRoleChangeFailedReason,
  ClientRoleOptions,
  ClientRoleType,
  CodecCapInfo,
  ColorEnhanceOptions,
  ConnectionChangedReasonType,
  ConnectionStateType,
  DataStreamConfig,
  DeviceInfo,
  DownlinkNetworkInfo,
  EarMonitoringFilterType,
  EchoTestConfiguration,
  EncryptionConfig,
  EncryptionErrorType,
  ErrorCodeType,
  HeadphoneEqualizerPreset,
  IAudioEncodedFrameObserver,
  LastmileProbeConfig,
  LastmileProbeResult,
  LicenseErrorType,
  LiveTranscoding,
  LocalAccessPointConfiguration,
  LocalAudioStats,
  LocalAudioStreamError,
  LocalAudioStreamState,
  LocalTranscoderConfiguration,
  LocalVideoStreamError,
  LocalVideoStreamState,
  LowlightEnhanceOptions,
  MediaTraceEvent,
  NetworkType,
  PermissionType,
  QualityAdaptIndication,
  QualityType,
  RecorderStreamInfo,
  Rectangle,
  RemoteAudioState,
  RemoteAudioStateReason,
  RemoteVideoState,
  RemoteVideoStateReason,
  RtcStats,
  RtmpStreamPublishErrorType,
  RtmpStreamPublishState,
  RtmpStreamingEvent,
  ScreenCaptureParameters,
  ScreenCaptureParameters2,
  ScreenScenarioType,
  SegmentationProperty,
  SenderOptions,
  SimulcastStreamConfig,
  SimulcastStreamMode,
  SpatialAudioParams,
  StreamPublishState,
  StreamSubscribeState,
  ThreadPriorityType,
  TranscodingVideoStream,
  UplinkNetworkInfo,
  UploadErrorReason,
  UserInfo,
  UserOfflineReasonType,
  VideoApplicationScenarioType,
  VideoCanvas,
  VideoCodecType,
  VideoContentHint,
  VideoDenoiserOptions,
  VideoEncoderConfiguration,
  VideoFormat,
  VideoMirrorModeType,
  VideoOrientation,
  VideoRenderingTracingInfo,
  VideoStreamType,
  VideoSubscriptionOptions,
  VideoTranscoderError,
  VirtualBackgroundSource,
  VoiceBeautifierPreset,
  VoiceConversionPreset,
  WatermarkOptions,
  WlAccStats,
  WlaccMessageReason,
  WlaccSuggestAction,
} from './AgoraBase';
import {
  ContentInspectConfig,
  ContentInspectResult,
  IAudioSpectrumObserver,
  MediaSourceType,
  RawAudioFrameOpModeType,
  RenderModeType,
  VideoSourceType,
} from './AgoraMediaBase';
import { LogConfig, LogFilterType, LogLevel } from './IAgoraLog';
import { AudioMixingDualMonoMode, IMediaEngine } from './IAgoraMediaEngine';
import { IMediaPlayer } from './IAgoraMediaPlayer';
import { IMediaRecorder } from './IAgoraMediaRecorder';
import { IMusicContentCenter } from './IAgoraMusicContentCenter';
import {
  AgoraRhythmPlayerConfig,
  RhythmPlayerErrorType,
  RhythmPlayerStateType,
} from './IAgoraRhythmPlayer';
import { RtcConnection } from './IAgoraRtcEngineEx';
import { ILocalSpatialAudioEngine } from './IAgoraSpatialAudio';
import { IAudioDeviceManager } from './IAudioDeviceManager';

/**
 * Media device types.
 */
export enum MediaDeviceType {
  /**
   * -1: Unknown device type.
   */
  UnknownAudioDevice = -1,
  /**
   * 0: Audio playback device.
   */
  AudioPlayoutDevice = 0,
  /**
   * 1: Audio capturing device.
   */
  AudioRecordingDevice = 1,
  /**
   * 2: Video rendering device (graphics card).
   */
  VideoRenderDevice = 2,
  /**
   * 3: Video capturing device.
   */
  VideoCaptureDevice = 3,
  /**
   * 4: Audio playback device for an app.
   */
  AudioApplicationPlayoutDevice = 4,
  /**
   * (For macOS only) 5: Virtual audio playback device (virtual sound card).
   */
  AudioVirtualPlayoutDevice = 5,
  /**
   * (For macOS only) 6: Virtual audio capturing device (virtual sound card).
   */
  AudioVirtualRecordingDevice = 6,
}

/**
 * The playback state of the music file.
 */
export enum AudioMixingStateType {
  /**
   * 710: The music file is playing.
   */
  AudioMixingStatePlaying = 710,
  /**
   * 711: The music file pauses playing.
   */
  AudioMixingStatePaused = 711,
  /**
   * 713: The music file stops playing. The possible reasons include: AudioMixingReasonAllLoopsCompleted (723) AudioMixingReasonStoppedByUser (724)
   */
  AudioMixingStateStopped = 713,
  /**
   * 714: An error occurs during the playback of the audio mixing file. The possible reasons include: AudioMixingReasonCanNotOpen (701) AudioMixingReasonTooFrequentCall (702) AudioMixingReasonInterruptedEof (703)
   */
  AudioMixingStateFailed = 714,
}

/**
 * The reason why the playback state of the music file changes. Reported in the onAudioMixingStateChanged callback.
 */
export enum AudioMixingReasonType {
  /**
   * 701: The SDK cannot open the music file. For example, the local music file does not exist, the SDK does not support the file format, or the the SDK cannot access the music file URL.
   */
  AudioMixingReasonCanNotOpen = 701,
  /**
   * 702: The SDK opens the music file too frequently. If you need to call startAudioMixing multiple times, ensure that the call interval is more than 500 ms.
   */
  AudioMixingReasonTooFrequentCall = 702,
  /**
   * 703: The music file playback is interrupted.
   */
  AudioMixingReasonInterruptedEof = 703,
  /**
   * 721: The music file completes a loop playback.
   */
  AudioMixingReasonOneLoopCompleted = 721,
  /**
   * 723: The music file completes all loop playback.
   */
  AudioMixingReasonAllLoopsCompleted = 723,
  /**
   * 724: Successfully call stopAudioMixing to stop playing the music file.
   */
  AudioMixingReasonStoppedByUser = 724,
  /**
   * 0: The SDK opens music file successfully.
   */
  AudioMixingReasonOk = 0,
}

/**
 * @ignore
 */
export enum InjectStreamStatus {
  /**
   * @ignore
   */
  InjectStreamStatusStartSuccess = 0,
  /**
   * @ignore
   */
  InjectStreamStatusStartAlreadyExists = 1,
  /**
   * @ignore
   */
  InjectStreamStatusStartUnauthorized = 2,
  /**
   * @ignore
   */
  InjectStreamStatusStartTimedout = 3,
  /**
   * @ignore
   */
  InjectStreamStatusStartFailed = 4,
  /**
   * @ignore
   */
  InjectStreamStatusStopSuccess = 5,
  /**
   * @ignore
   */
  InjectStreamStatusStopNotFound = 6,
  /**
   * @ignore
   */
  InjectStreamStatusStopUnauthorized = 7,
  /**
   * @ignore
   */
  InjectStreamStatusStopTimedout = 8,
  /**
   * @ignore
   */
  InjectStreamStatusStopFailed = 9,
  /**
   * @ignore
   */
  InjectStreamStatusBroken = 10,
}

/**
 * The midrange frequency for audio equalization.
 */
export enum AudioEqualizationBandFrequency {
  /**
   * 0: 31 Hz
   */
  AudioEqualizationBand31 = 0,
  /**
   * 1: 62 Hz
   */
  AudioEqualizationBand62 = 1,
  /**
   * 2: 125 Hz
   */
  AudioEqualizationBand125 = 2,
  /**
   * 3: 250 Hz
   */
  AudioEqualizationBand250 = 3,
  /**
   * 4: 500 Hz
   */
  AudioEqualizationBand500 = 4,
  /**
   * 5: 1 kHz
   */
  AudioEqualizationBand1k = 5,
  /**
   * 6: 2 kHz
   */
  AudioEqualizationBand2k = 6,
  /**
   * 7: 4 kHz
   */
  AudioEqualizationBand4k = 7,
  /**
   * 8: 8 kHz
   */
  AudioEqualizationBand8k = 8,
  /**
   * 9: 16 kHz
   */
  AudioEqualizationBand16k = 9,
}

/**
 * Audio reverberation types.
 */
export enum AudioReverbType {
  /**
   * 0: The level of the dry signal (dB). The value is between -20 and 10.
   */
  AudioReverbDryLevel = 0,
  /**
   * 1: The level of the early reflection signal (wet signal) (dB). The value is between -20 and 10.
   */
  AudioReverbWetLevel = 1,
  /**
   * 2: The room size of the reflection. The value is between 0 and 100.
   */
  AudioReverbRoomSize = 2,
  /**
   * 3: The length of the initial delay of the wet signal (ms). The value is between 0 and 200.
   */
  AudioReverbWetDelay = 3,
  /**
   * 4: The reverberation strength. The value is between 0 and 100.
   */
  AudioReverbStrength = 4,
}

/**
 * @ignore
 */
export enum StreamFallbackOptions {
  /**
   * @ignore
   */
  StreamFallbackOptionDisabled = 0,
  /**
   * @ignore
   */
  StreamFallbackOptionVideoStreamLow = 1,
  /**
   * @ignore
   */
  StreamFallbackOptionAudioOnly = 2,
}

/**
 * @ignore
 */
export enum PriorityType {
  /**
   * @ignore
   */
  PriorityHigh = 50,
  /**
   * @ignore
   */
  PriorityNormal = 100,
}

/**
 * The statistics of the local video stream.
 */
export class LocalVideoStats {
  uid?: number;
  sentBitrate?: number;
  sentFrameRate?: number;
  captureFrameRate?: number;
  captureFrameWidth?: number;
  captureFrameHeight?: number;
  regulatedCaptureFrameRate?: number;
  regulatedCaptureFrameWidth?: number;
  regulatedCaptureFrameHeight?: number;
  encoderOutputFrameRate?: number;
  encodedFrameWidth?: number;
  encodedFrameHeight?: number;
  rendererOutputFrameRate?: number;
  targetBitrate?: number;
  targetFrameRate?: number;
  qualityAdaptIndication?: QualityAdaptIndication;
  encodedBitrate?: number;
  encodedFrameCount?: number;
  codecType?: VideoCodecType;
  txPacketLossRate?: number;
  captureBrightnessLevel?: CaptureBrightnessLevelType;
  dualStreamEnabled?: boolean;
  hwEncoderAccelerating?: number;
}

/**
 * Audio statistics of the remote user.
 */
export class RemoteAudioStats {
  uid?: number;
  quality?: number;
  networkTransportDelay?: number;
  jitterBufferDelay?: number;
  audioLossRate?: number;
  numChannels?: number;
  receivedSampleRate?: number;
  receivedBitrate?: number;
  totalFrozenTime?: number;
  frozenRate?: number;
  mosValue?: number;
  frozenRateByCustomPlcCount?: number;
  plcCount?: number;
  totalActiveTime?: number;
  publishDuration?: number;
  qoeQuality?: number;
  qualityChangedReason?: number;
  rxAudioBytes?: number;
}

/**
 * Statistics of the remote video stream.
 */
export class RemoteVideoStats {
  uid?: number;
  delay?: number;
  e2eDelay?: number;
  width?: number;
  height?: number;
  receivedBitrate?: number;
  decoderOutputFrameRate?: number;
  rendererOutputFrameRate?: number;
  frameLossRate?: number;
  packetLossRate?: number;
  rxStreamType?: VideoStreamType;
  totalFrozenTime?: number;
  frozenRate?: number;
  avSyncTimeMs?: number;
  totalActiveTime?: number;
  publishDuration?: number;
  mosValue?: number;
  rxVideoBytes?: number;
}

/**
 * @ignore
 */
export class Region {
  uid?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  zOrder?: number;
  alpha?: number;
  renderMode?: RenderModeType;
}

/**
 * @ignore
 */
export class VideoCompositingLayout {
  canvasWidth?: number;
  canvasHeight?: number;
  backgroundColor?: string;
  regions?: Region[];
  regionCount?: number;
  appData?: Uint8Array;
  appDataLength?: number;
}

/**
 * @ignore
 */
export class InjectStreamConfig {
  width?: number;
  height?: number;
  videoGop?: number;
  videoFramerate?: number;
  videoBitrate?: number;
  audioSampleRate?: AudioSampleRateType;
  audioBitrate?: number;
  audioChannels?: number;
}

/**
 * Lifecycle of the CDN live video stream.
 *
 * Deprecated
 */
export enum RtmpStreamLifeCycleType {
  /**
   * Bind to the channel lifecycle. If all hosts leave the channel, the CDN live streaming stops after 30 seconds.
   */
  RtmpStreamLifeCycleBind2channel = 1,
  /**
   * Bind to the owner of the RTMP stream. If the owner leaves the channel, the CDN live streaming stops immediately.
   */
  RtmpStreamLifeCycleBind2owner = 2,
}

/**
 * @ignore
 */
export class PublisherConfiguration {
  width?: number;
  height?: number;
  framerate?: number;
  bitrate?: number;
  defaultLayout?: number;
  lifecycle?: number;
  owner?: boolean;
  injectStreamWidth?: number;
  injectStreamHeight?: number;
  injectStreamUrl?: string;
  publishUrl?: string;
  rawStreamUrl?: string;
  extraInfo?: string;
}

/**
 * The camera direction.
 */
export enum CameraDirection {
  /**
   * 0: The rear camera.
   */
  CameraRear = 0,
  /**
   * 1: (Default) The front camera.
   */
  CameraFront = 1,
}

/**
 * The cloud proxy type.
 */
export enum CloudProxyType {
  /**
   * 0: The automatic mode. The SDK has this mode enabled by default. In this mode, the SDK attempts a direct connection to SD-RTN™ and automatically switches to TCP/TLS 443 if the attempt fails.
   */
  NoneProxy = 0,
  /**
   * 1: The cloud proxy for the UDP protocol, that is, the Force UDP cloud proxy mode. In this mode, the SDK always transmits data over UDP.
   */
  UdpProxy = 1,
  /**
   * 2: The cloud proxy for the TCP (encryption) protocol, that is, the Force TCP cloud proxy mode. In this mode, the SDK always transmits data over TCP/TLS 443.
   */
  TcpProxy = 2,
}

/**
 * The camera capturer preference.
 */
export class CameraCapturerConfiguration {
  cameraDirection?: CameraDirection;
  deviceId?: string;
  cameraId?: string;
  format?: VideoFormat;
  followEncodeDimensionRatio?: boolean;
}

/**
 * The configuration of the captured screen.
 */
export class ScreenCaptureConfiguration {
  isCaptureWindow?: boolean;
  displayId?: number;
  screenRect?: Rectangle;
  windowId?: any;
  params?: ScreenCaptureParameters;
  regionRect?: Rectangle;
}

/**
 * @ignore
 */
export class Size {
  width?: number;
  height?: number;
}

/**
 * The image content of the thumbnail or icon. Set in ScreenCaptureSourceInfo.
 *
 * The default image is in the ARGB format. If you need to use another format, you need to convert the image on your own.
 */
export class ThumbImageBuffer {
  buffer?: Uint8Array;
  length?: number;
  width?: number;
  height?: number;
}

/**
 * The type of the shared target. Set in ScreenCaptureSourceInfo.
 */
export enum ScreenCaptureSourceType {
  /**
   * -1: Unknown type.
   */
  ScreencapturesourcetypeUnknown = -1,
  /**
   * 0: The shared target is a window.
   */
  ScreencapturesourcetypeWindow = 0,
  /**
   * 1: The shared target is a screen of a particular monitor.
   */
  ScreencapturesourcetypeScreen = 1,
  /**
   * 2: Reserved parameter
   */
  ScreencapturesourcetypeCustom = 2,
}

/**
 * The information about the specified shareable window or screen.
 */
export class ScreenCaptureSourceInfo {
  type?: ScreenCaptureSourceType;
  sourceId?: any;
  sourceName?: string;
  thumbImage?: ThumbImageBuffer;
  iconImage?: ThumbImageBuffer;
  processPath?: string;
  sourceTitle?: string;
  primaryMonitor?: boolean;
  isOccluded?: boolean;
  position?: Rectangle;
  minimizeWindow?: boolean;
  sourceDisplayId?: any;
}

/**
 * The advanced options for audio.
 */
export class AdvancedAudioOptions {
  audioProcessingChannels?: number;
}

/**
 * Image configurations.
 */
export class ImageTrackOptions {
  imageUrl?: string;
  fps?: number;
  mirrorMode?: VideoMirrorModeType;
}

/**
 * The channel media options.
 *
 * Agora supports publishing multiple audio streams and one video stream at the same time and in the same RtcConnection. For example, publishMicrophoneTrack, publishCustomAudioTrack, and publishMediaPlayerAudioTrack can be set as true at the same time, but only one of publishCameraTrack, publishScreenTrack, publishCustomVideoTrack, or publishEncodedVideoTrack can be set as true. Agora recommends that you set member parameter values yourself according to your business scenario, otherwise the SDK will automatically assign values to member parameters.
 */
export class ChannelMediaOptions {
  publishCameraTrack?: boolean;
  publishSecondaryCameraTrack?: boolean;
  publishThirdCameraTrack?: boolean;
  publishFourthCameraTrack?: boolean;
  publishMicrophoneTrack?: boolean;
  publishScreenCaptureVideo?: boolean;
  publishScreenCaptureAudio?: boolean;
  publishScreenTrack?: boolean;
  publishSecondaryScreenTrack?: boolean;
  publishThirdScreenTrack?: boolean;
  publishFourthScreenTrack?: boolean;
  publishCustomAudioTrack?: boolean;
  publishCustomAudioTrackId?: number;
  publishCustomVideoTrack?: boolean;
  publishEncodedVideoTrack?: boolean;
  publishMediaPlayerAudioTrack?: boolean;
  publishMediaPlayerVideoTrack?: boolean;
  publishTranscodedVideoTrack?: boolean;
  publishMixedAudioTrack?: boolean;
  mixPolicyForMixedTrack?: number;
  publishLipSyncTrack?: boolean;
  autoSubscribeAudio?: boolean;
  autoSubscribeVideo?: boolean;
  enableAudioRecordingOrPlayout?: boolean;
  publishMediaPlayerId?: number;
  clientRoleType?: ClientRoleType;
  audienceLatencyLevel?: AudienceLatencyLevelType;
  defaultVideoStreamType?: VideoStreamType;
  channelProfile?: ChannelProfileType;
  audioDelayMs?: number;
  mediaPlayerAudioDelayMs?: number;
  token?: string;
  enableBuiltInMediaEncryption?: boolean;
  publishRhythmPlayerTrack?: boolean;
  isInteractiveAudience?: boolean;
  customVideoTrackId?: number;
  isAudioFilterable?: boolean;
}

/**
 * The cloud proxy type.
 */
export enum ProxyType {
  /**
   * 0: Reserved for future use.
   */
  NoneProxyType = 0,
  /**
   * 1: The cloud proxy for the UDP protocol, that is, the Force UDP cloud proxy mode. In this mode, the SDK always transmits data over UDP.
   */
  UdpProxyType = 1,
  /**
   * 2: The cloud proxy for the TCP (encryption) protocol, that is, the Force TCP cloud proxy mode. In this mode, the SDK always transmits data over TCP/TLS 443.
   */
  TcpProxyType = 2,
  /**
   * 3: Reserved for future use.
   */
  LocalProxyType = 3,
  /**
   * 4: Automatic mode. In this mode, the SDK attempts a direct connection to SD-RTN™ and automatically switches to TCP/TLS 443 if the attempt fails.
   */
  TcpProxyAutoFallbackType = 4,
  /**
   * @ignore
   */
  HttpProxyType = 5,
  /**
   * @ignore
   */
  HttpsProxyType = 6,
}

/**
 * The type of the advanced feature.
 */
export enum FeatureType {
  /**
   * 1: Virtual background.
   */
  VideoVirtualBackground = 1,
  /**
   * 2: Image enhancement.
   */
  VideoBeautyEffect = 2,
}

/**
 * The options for leaving a channel.
 */
export class LeaveChannelOptions {
  stopAudioMixing?: boolean;
  stopAllEffect?: boolean;
  stopMicrophoneRecording?: boolean;
}

/**
 * The SDK uses the IRtcEngineEventHandler interface to send event notifications to your app. Your app can get those notifications through methods that inherit this interface.
 *
 * All methods in this interface have default (empty) implementation. You can choose to inherit events related to your app scenario.
 *  In the callbacks, avoid implementing time-consuming tasks or calling APIs that may cause thread blocking (such as sendMessage). Otherwise, the SDK may not work properly.
 *  The SDK no longer catches exceptions in the code logic that developers implement themselves in IRtcEngineEventHandler class. You need to handle this exception yourself, otherwise the app may crash when the exception occurs.
 */
export interface IRtcEngineEventHandler {
  /**
   * Occurs when a user joins a channel.
   *
   * This callback notifies the application that a user joins a specified channel.
   *
   * @param connection The connection information. See RtcConnection.
   * @param elapsed The time elapsed (ms) from the local user calling joinChannel until the SDK triggers this callback.
   */
  onJoinChannelSuccess?(connection: RtcConnection, elapsed: number): void;

  /**
   * Occurs when a user rejoins the channel.
   *
   * When a user loses connection with the server because of network problems, the SDK automatically tries to reconnect and triggers this callback upon reconnection.
   *
   * @param uid The ID of the user who rejoins the channel.
   * @param connection The connection information. See RtcConnection.
   * @param elapsed Time elapsed (ms) from the local user calling joinChannel until the SDK triggers this callback.
   */
  onRejoinChannelSuccess?(connection: RtcConnection, elapsed: number): void;

  /**
   * Reports the proxy connection state.
   *
   * You can use this callback to listen for the state of the SDK connecting to a proxy. For example, when a user calls setCloudProxy and joins a channel successfully, the SDK triggers this callback to report the user ID, the proxy type connected, and the time elapsed fromthe user calling joinChannel until this callback is triggered.
   *
   * @param channel The channel name.
   * @param uid The user ID.
   * @param proxyType The proxy type connected. See ProxyType.
   * @param localProxyIp Reserved for future use.
   * @param elapsed The time elapsed (ms) from the user calling joinChannel until this callback is triggered.
   */
  onProxyConnected?(
    channel: string,
    uid: number,
    proxyType: ProxyType,
    localProxyIp: string,
    elapsed: number
  ): void;

  /**
   * Reports an error during SDK runtime.
   *
   * This callback indicates that an error (concerning network or media) occurs during SDK runtime. In most cases, the SDK cannot fix the issue and resume running. The SDK requires the app to take action or informs the user about the issue.
   *
   * @param err Error code. See ErrorCodeType.
   * @param msg The error message.
   */
  onError?(err: ErrorCodeType, msg: string): void;

  /**
   * Reports the statistics of the audio stream sent by each remote user.
   *
   * Deprecated: Use onRemoteAudioStats instead. The SDK triggers this callback once every two seconds to report the audio quality of each remote user who is sending an audio stream. If a channel has multiple users sending audio streams, the SDK triggers this callback as many times.
   *
   * @param connection The connection information. See RtcConnection.
   * @param remoteUid The user ID of the remote user sending the audio stream.
   * @param quality Audio quality of the user. See QualityType.
   * @param delay The network delay (ms) from the sender to the receiver, including the delay caused by audio sampling pre-processing, network transmission, and network jitter buffering.
   * @param lost The packet loss rate (%) of the audio packet sent from the remote user to the receiver.
   */
  onAudioQuality?(
    connection: RtcConnection,
    remoteUid: number,
    quality: QualityType,
    delay: number,
    lost: number
  ): void;

  /**
   * Reports the last mile network probe result.
   *
   * The SDK triggers this callback within 30 seconds after the app calls startLastmileProbeTest.
   *
   * @param result The uplink and downlink last-mile network probe test result. See LastmileProbeResult.
   */
  onLastmileProbeResult?(result: LastmileProbeResult): void;

  /**
   * Reports the volume information of users.
   *
   * By default, this callback is disabled. You can enable it by calling enableAudioVolumeIndication. Once this callback is enabled and users send streams in the channel, the SDK triggers the onAudioVolumeIndication callback according to the time interval set in enableAudioVolumeIndication. The SDK triggers two independent onAudioVolumeIndication callbacks simultaneously, which separately report the volume information of the local user who sends a stream and the remote users (up to three) whose instantaneous volume is the highest. Once this callback is enabled, if the local user calls the muteLocalAudioStream method to mute, the SDK continues to report the volume indication of the local user. If a remote user whose volume is one of the three highest in the channel stops publishing the audio stream for 20 seconds, the callback excludes this user's information; if all remote users stop publishing audio streams for 20 seconds, the SDK stops triggering the callback for remote users.
   *
   * @param connection The connection information. See RtcConnection.
   * @param speakers The volume information of the users. See AudioVolumeInfo. An empty speakers array in the callback indicates that no remote user is in the channel or is sending a stream.
   * @param speakerNumber The total number of users.
   *  In the callback for the local user, if the local user is sending streams, the value of speakerNumber is 1.
   *  In the callback for remote users, the value range of speakerNumber is [0,3]. If the number of remote users who send streams is greater than or equal to three, the value of speakerNumber is 3.
   * @param totalVolume The volume of the speaker. The value range is [0,255].
   *  In the callback for the local user, totalVolume is the volume of the local user who sends a stream. In the callback for remote users, totalVolume is the sum of the volume of all remote users (up to three) whose instantaneous volume is the highest.
   */
  onAudioVolumeIndication?(
    connection: RtcConnection,
    speakers: AudioVolumeInfo[],
    speakerNumber: number,
    totalVolume: number
  ): void;

  /**
   * Occurs when a user leaves a channel.
   *
   * You can obtain information such as the total duration of a call, and the data traffic that the SDK transmits and receives.
   *
   * @param connection The connection information. See RtcConnection.
   * @param stats Call statistics. See RtcStats.
   */
  onLeaveChannel?(connection: RtcConnection, stats: RtcStats): void;

  /**
   * Reports the statistics about the current call.
   *
   * @param connection The connection information. See RtcConnection.
   * @param stats Statistics of the RTC engine. See RtcStats.
   */
  onRtcStats?(connection: RtcConnection, stats: RtcStats): void;

  /**
   * Occurs when the audio device state changes.
   *
   * This callback notifies the application that the system's audio device state is changed. For example, a headset is unplugged from the device.
   *
   * @param deviceId The device ID.
   * @param deviceType The device type. See MediaDeviceType.
   * @param deviceState The device state. See MediaDeviceStateType.
   */
  onAudioDeviceStateChanged?(
    deviceId: string,
    deviceType: MediaDeviceType,
    deviceState: MediaDeviceStateType
  ): void;

  /**
   * Reports the playback progress of a music file.
   *
   * After you called the startAudioMixing method to play a music file, the SDK triggers this callback every two seconds to report the playback progress.
   *
   * @param position The playback progress (ms).
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  onAudioMixingPositionChanged?(position: number): void;

  /**
   * Occurs when the playback of the local music file finishes.
   *
   * Deprecated: Use onAudioMixingStateChanged instead. After you call startAudioMixing to play a local music file, this callback occurs when the playback finishes. If the call of startAudioMixing fails, the error code WARN_AUDIO_MIXING_OPEN_ERROR is returned.
   */
  onAudioMixingFinished?(): void;

  /**
   * Occurs when the playback of the local music file finishes.
   *
   * This callback occurs when the local audio effect file finishes playing.
   *
   * @param soundId The ID of the audio effect. The ID of each audio effect file is unique.
   */
  onAudioEffectFinished?(soundId: number): void;

  /**
   * Occurs when the video device state changes.
   *
   * This callback reports the change of system video devices, such as being unplugged or removed. On a Windows device with an external camera for video capturing, the video disables once the external camera is unplugged.
   *
   * @param deviceId The device ID.
   * @param deviceType Media device types. See MediaDeviceType.
   * @param deviceState Media device states. See MediaDeviceStateType.
   */
  onVideoDeviceStateChanged?(
    deviceId: string,
    deviceType: MediaDeviceType,
    deviceState: MediaDeviceStateType
  ): void;

  /**
   * Reports the last mile network quality of each user in the channel.
   *
   * This callback reports the last mile network conditions of each user in the channel. Last mile refers to the connection between the local device and Agora's edge server. The SDK triggers this callback once every two seconds. If a channel includes multiple users, the SDK triggers this callback as many times. This callback provides feedback on network quality through sending and receiving broadcast packets within the channel. Excessive broadcast packets can lead to broadcast storms. To prevent broadcast storms from causing a large amount of data transmission within the channel, this callback supports feedback on the network quality of up to 4 remote hosts simultaneously by default. txQuality is Unknown when the user is not sending a stream; rxQuality is Unknown when the user is not receiving a stream.
   *
   * @param connection The connection information. See RtcConnection.
   * @param remoteUid The user ID. The network quality of the user with this user ID is reported. If the uid is 0, the local network quality is reported.
   * @param txQuality Uplink network quality rating of the user in terms of the transmission bit rate, packet loss rate, average RTT (Round-Trip Time) and jitter of the uplink network. This parameter is a quality rating helping you understand how well the current uplink network conditions can support the selected video encoder configuration. For example, a 1000 Kbps uplink network may be adequate for video frames with a resolution of 640 × 480 and a frame rate of 15 fps in the LIVE_BROADCASTING profile, but might be inadequate for resolutions higher than 1280 × 720. See QualityType.
   * @param rxQuality Downlink network quality rating of the user in terms of packet loss rate, average RTT, and jitter of the downlink network. See QualityType.
   */
  onNetworkQuality?(
    connection: RtcConnection,
    remoteUid: number,
    txQuality: QualityType,
    rxQuality: QualityType
  ): void;

  /**
   * @ignore
   */
  onIntraRequestReceived?(connection: RtcConnection): void;

  /**
   * Occurs when the uplink network information changes.
   *
   * The SDK triggers this callback when the uplink network information changes. This callback only applies to scenarios where you push externally encoded video data in H.264 format to the SDK.
   *
   * @param info The uplink network information. See UplinkNetworkInfo.
   */
  onUplinkNetworkInfoUpdated?(info: UplinkNetworkInfo): void;

  /**
   * @ignore
   */
  onDownlinkNetworkInfoUpdated?(info: DownlinkNetworkInfo): void;

  /**
   * Reports the last-mile network quality of the local user.
   *
   * This callback reports the last-mile network conditions of the local user before the user joins the channel. Last mile refers to the connection between the local device and Agora's edge server. Before the user joins the channel, this callback is triggered by the SDK once startLastmileProbeTest is called and reports the last-mile network conditions of the local user.
   *
   * @param quality The last-mile network quality. QualityUnknown (0): The quality is unknown. QualityExcellent (1): The quality is excellent. QualityGood (2): The network quality seems excellent, but the bitrate can be slightly lower than excellent. QualityPoor (3): Users can feel the communication is slightly impaired. QualityBad (4): Users cannot communicate smoothly. QualityVbad (5): The quality is so bad that users can barely communicate. QualityDown (6): The network is down, and users cannot communicate at all. See QualityType.
   */
  onLastmileQuality?(quality: QualityType): void;

  /**
   * Occurs when the first local video frame is displayed on the local video view.
   *
   * The SDK triggers this callback when the first local video frame is displayed on the local video view.
   *
   * @param source The type of the video source. See VideoSourceType.
   * @param width The width (px) of the first local video frame.
   * @param height The height (px) of the first local video frame.
   * @param elapsed The time elapsed (ms) from the local user calling joinChannel to join the channel to when the SDK triggers this callback. If startPreviewWithoutSourceType / startPreview is called before joining the channel, this parameter indicates the time elapsed from calling startPreviewWithoutSourceType or startPreview to when this event occurred.
   */
  onFirstLocalVideoFrame?(
    source: VideoSourceType,
    width: number,
    height: number,
    elapsed: number
  ): void;

  /**
   * Occurs when the first video frame is published.
   *
   * The SDK triggers this callback under one of the following circumstances:
   *  The local client enables the video module and calls joinChannel to join the channel successfully.
   *  The local client calls muteLocalVideoStream (true) and muteLocalVideoStream (false) in sequence.
   *  The local client calls disableVideo and enableVideo in sequence.
   *
   * @param connection The connection information. See RtcConnection.
   * @param elapsed Time elapsed (ms) from the local user calling joinChannel until this callback is triggered.
   */
  onFirstLocalVideoFramePublished?(
    source: VideoSourceType,
    elapsed: number
  ): void;

  /**
   * Occurs when the first remote video frame is received and decoded.
   *
   * The SDK triggers this callback under one of the following circumstances:
   *  The remote user joins the channel and sends the video stream.
   *  The remote user stops sending the video stream and re-sends it after 15 seconds. Reasons for such an interruption include:
   *  The remote user leaves the channel.
   *  The remote user drops offline.
   *  The remote user calls disableVideo to disable video.
   *
   * @param connection The connection information. See RtcConnection.
   * @param remoteUid The user ID of the remote user sending the video stream.
   * @param width The width (px) of the video stream.
   * @param height The height (px) of the video stream.
   * @param elapsed The time elapsed (ms) from the local user calling joinChannel until the SDK triggers this callback.
   */
  onFirstRemoteVideoDecoded?(
    connection: RtcConnection,
    remoteUid: number,
    width: number,
    height: number,
    elapsed: number
  ): void;

  /**
   * Occurs when the video size or rotation of a specified user changes.
   *
   * @param connection The connection information. See RtcConnection.
   * @param sourceType The type of the video source. See VideoSourceType.
   * @param uid The ID of the user whose video size or rotation changes. (The uid for the local user is 0. The video is the local user's video preview).
   * @param width The width (pixels) of the video stream.
   * @param height The height (pixels) of the video stream.
   * @param rotation The rotation information. The value range is [0,360).
   */
  onVideoSizeChanged?(
    connection: RtcConnection,
    sourceType: VideoSourceType,
    uid: number,
    width: number,
    height: number,
    rotation: number
  ): void;

  /**
   * Occurs when the local video stream state changes.
   *
   * When the status of the local video changes, the SDK triggers this callback to report the current local video state and the reason for the state change.
   *
   * @param source The type of the video source. See VideoSourceType.
   * @param state The state of the local video, see LocalVideoStreamState.
   * @param reason The reasons for changes in local video state. See LocalVideoStreamReason.
   */
  onLocalVideoStateChanged?(
    source: VideoSourceType,
    state: LocalVideoStreamState,
    error: LocalVideoStreamError
  ): void;

  /**
   * Occurs when the remote video stream state changes.
   *
   * This callback does not work properly when the number of users (in the communication profile) or hosts (in the live streaming channel) in a channel exceeds 17.
   *
   * @param connection The connection information. See RtcConnection.
   * @param remoteUid The ID of the remote user whose video state changes.
   * @param state The state of the remote video. See RemoteVideoState.
   * @param reason The reason for the remote video state change. See RemoteVideoStateReason.
   * @param elapsed Time elapsed (ms) from the local user calling the joinChannel method until the SDK triggers this callback.
   */
  onRemoteVideoStateChanged?(
    connection: RtcConnection,
    remoteUid: number,
    state: RemoteVideoState,
    reason: RemoteVideoStateReason,
    elapsed: number
  ): void;

  /**
   * Occurs when the renderer receives the first frame of the remote video.
   *
   * This callback is only triggered when the video frame is rendered by the SDK; it will not be triggered if the user employs custom video rendering.You need to implement this independently using methods outside the SDK.
   *
   * @param connection The connection information. See RtcConnection.
   * @param remoteUid The user ID of the remote user sending the video stream.
   * @param width The width (px) of the video stream.
   * @param height The height (px) of the video stream.
   * @param elapsed The time elapsed (ms) from the local user calling joinChannel until the SDK triggers this callback.
   */
  onFirstRemoteVideoFrame?(
    connection: RtcConnection,
    remoteUid: number,
    width: number,
    height: number,
    elapsed: number
  ): void;

  /**
   * Occurs when a remote user (in the communication profile)/ host (in the live streaming profile) joins the channel.
   *
   * In a communication channel, this callback indicates that a remote user joins the channel. The SDK also triggers this callback to report the existing users in the channel when a user joins the channel.
   *  In a live-broadcast channel, this callback indicates that a host joins the channel. The SDK also triggers this callback to report the existing hosts in the channel when a host joins the channel. Agora recommends limiting the number of hosts to 17. The SDK triggers this callback under one of the following circumstances:
   *  A remote user/host joins the channel.
   *  A remote user switches the user role to the host after joining the channel.
   *  A remote user/host rejoins the channel after a network interruption.
   *
   * @param connection The connection information. See RtcConnection.
   * @param remoteUid The ID of the user or host who joins the channel.
   * @param elapsed Time delay (ms) from the local user calling joinChannel until this callback is triggered.
   */
  onUserJoined?(
    connection: RtcConnection,
    remoteUid: number,
    elapsed: number
  ): void;

  /**
   * Occurs when a remote user (in the communication profile)/ host (in the live streaming profile) leaves the channel.
   *
   * There are two reasons for users to become offline:
   *  Leave the channel: When a user/host leaves the channel, the user/host sends a goodbye message. When this message is received, the SDK determines that the user/host leaves the channel.
   *  Drop offline: When no data packet of the user or host is received for a certain period of time (20 seconds for the communication profile, and more for the live broadcast profile), the SDK assumes that the user/host drops offline. A poor network connection may lead to false detections. It's recommended to use the Agora RTM SDK for reliable offline detection.
   *
   * @param connection The connection information. See RtcConnection.
   * @param remoteUid The ID of the user who leaves the channel or goes offline.
   * @param reason Reasons why the user goes offline: UserOfflineReasonType.
   */
  onUserOffline?(
    connection: RtcConnection,
    remoteUid: number,
    reason: UserOfflineReasonType
  ): void;

  /**
   * Occurs when a remote user (in the communication profile) or a host (in the live streaming profile) stops/resumes sending the audio stream.
   *
   * The SDK triggers this callback when the remote user stops or resumes sending the audio stream by calling the muteLocalAudioStream method. This callback does not work properly when the number of users (in the communication profile) or hosts (in the live streaming channel) in a channel exceeds 17.
   *
   * @param connection The connection information. See RtcConnection.
   * @param remoteUid The user ID.
   * @param muted Whether the remote user's audio stream is muted: true : User's audio stream is muted. false : User's audio stream is unmuted.
   */
  onUserMuteAudio?(
    connection: RtcConnection,
    remoteUid: number,
    muted: boolean
  ): void;

  /**
   * Occurs when a remote user stops or resumes publishing the video stream.
   *
   * When a remote user calls muteLocalVideoStream to stop or resume publishing the video stream, the SDK triggers this callback to report to the local user the state of the streams published by the remote user. This callback can be inaccurate when the number of users (in the communication profile) or hosts (in the live streaming profile) in a channel exceeds 17.
   *
   * @param connection The connection information. See RtcConnection.
   * @param remoteUid The user ID of the remote user.
   * @param muted Whether the remote user stops publishing the video stream: true : The remote user stops publishing the video stream. false : The remote user resumes publishing the video stream.
   */
  onUserMuteVideo?(
    connection: RtcConnection,
    remoteUid: number,
    muted: boolean
  ): void;

  /**
   * Occurs when a remote user enables or disables the video module.
   *
   * Once the video module is disabled, the user can only use a voice call. The user cannot send or receive any video. The SDK triggers this callback when a remote user enables or disables the video module by calling the enableVideo or disableVideo method.
   *
   * @param connection The connection information. See RtcConnection.
   * @param remoteUid The user ID of the remote user.
   * @param enabled true : The video module is enabled. false : The video module is disabled.
   */
  onUserEnableVideo?(
    connection: RtcConnection,
    remoteUid: number,
    enabled: boolean
  ): void;

  /**
   * @ignore
   */
  onUserStateChanged?(
    connection: RtcConnection,
    remoteUid: number,
    state: number
  ): void;

  /**
   * Occurs when a specific remote user enables/disables the local video capturing function.
   *
   * Deprecated: This callback is deprecated, use the following enumerations in the onRemoteVideoStateChanged callback: RemoteVideoStateStopped (0) and RemoteVideoStateReasonRemoteMuted (5). RemoteVideoStateDecoding (2) and RemoteVideoStateReasonRemoteUnmuted (6). The SDK triggers this callback when the remote user resumes or stops capturing the video stream by calling the enableLocalVideo method.
   *
   * @param connection The connection information. See RtcConnection.
   * @param remoteUid The user ID of the remote user.
   * @param enabled Whether the specified remote user enables/disables local video capturing: true : The video module is enabled. Other users in the channel can see the video of this remote user. false : The video module is disabled. Other users in the channel can no longer receive the video stream from this remote user, while this remote user can still receive the video streams from other users.
   */
  onUserEnableLocalVideo?(
    connection: RtcConnection,
    remoteUid: number,
    enabled: boolean
  ): void;

  /**
   * Reports the statistics of the local audio stream.
   *
   * The SDK triggers this callback once every two seconds.
   *
   * @param connection The connection information. See RtcConnection.
   * @param stats Local audio statistics. See LocalAudioStats.
   */
  onLocalAudioStats?(connection: RtcConnection, stats: LocalAudioStats): void;

  /**
   * Reports the transport-layer statistics of each remote audio stream.
   *
   * The SDK triggers this callback once every two seconds for each remote user who is sending audio streams. If a channel includes multiple remote users, the SDK triggers this callback as many times.
   *
   * @param connection The connection information. See RtcConnection.
   * @param stats The statistics of the received remote audio streams. See RemoteAudioStats.
   */
  onRemoteAudioStats?(connection: RtcConnection, stats: RemoteAudioStats): void;

  /**
   * Reports the statistics of the local video stream.
   *
   * The SDK triggers this callback once every two seconds to report the statistics of the local video stream.
   *
   * @param connection The connection information. See RtcConnection.
   * @param stats The statistics of the local video stream. See LocalVideoStats.
   */
  onLocalVideoStats?(source: VideoSourceType, stats: LocalVideoStats): void;

  /**
   * Reports the statistics of the video stream sent by each remote users.
   *
   * Reports the statistics of the video stream from the remote users. The SDK triggers this callback once every two seconds for each remote user. If a channel has multiple users/hosts sending video streams, the SDK triggers this callback as many times.
   *
   * @param connection The connection information. See RtcConnection.
   * @param stats Statistics of the remote video stream. See RemoteVideoStats.
   */
  onRemoteVideoStats?(connection: RtcConnection, stats: RemoteVideoStats): void;

  /**
   * Occurs when the camera turns on and is ready to capture the video.
   *
   * Deprecated: Use LocalVideoStreamStateCapturing (1) in onLocalVideoStateChanged instead. This callback indicates that the camera has been successfully turned on and you can start to capture video.
   */
  onCameraReady?(): void;

  /**
   * @ignore
   */
  onCameraFocusAreaChanged?(
    x: number,
    y: number,
    width: number,
    height: number
  ): void;

  /**
   * @ignore
   */
  onCameraExposureAreaChanged?(
    x: number,
    y: number,
    width: number,
    height: number
  ): void;

  /**
   * @ignore
   */
  onFacePositionChanged?(
    imageWidth: number,
    imageHeight: number,
    vecRectangle: Rectangle[],
    vecDistance: number[],
    numFaces: number
  ): void;

  /**
   * Occurs when the video stops playing.
   *
   * Deprecated: Use LocalVideoStreamStateStopped (0) in the onLocalVideoStateChanged callback instead. The application can use this callback to change the configuration of the view (for example, displaying other pictures in the view) after the video stops playing.
   */
  onVideoStopped?(): void;

  /**
   * Occurs when the playback state of the music file changes.
   *
   * This callback occurs when the playback state of the music file changes, and reports the current state and error code.
   *
   * @param state The playback state of the music file. See AudioMixingStateType.
   * @param reason Error code. See AudioMixingReasonType.
   */
  onAudioMixingStateChanged?(
    state: AudioMixingStateType,
    reason: AudioMixingReasonType
  ): void;

  /**
   * @ignore
   */
  onRhythmPlayerStateChanged?(
    state: RhythmPlayerStateType,
    errorCode: RhythmPlayerErrorType
  ): void;

  /**
   * Occurs when the SDK cannot reconnect to Agora's edge server 10 seconds after its connection to the server is interrupted.
   *
   * The SDK triggers this callback when it cannot connect to the server 10 seconds after calling the joinChannel method, regardless of whether it is in the channel. If the SDK fails to rejoin the channel 20 minutes after being disconnected from Agora's edge server, the SDK stops rejoining the channel.
   *
   * @param connection The connection information. See RtcConnection.
   */
  onConnectionLost?(connection: RtcConnection): void;

  /**
   * Occurs when the connection between the SDK and the server is interrupted.
   *
   * Deprecated: Use onConnectionStateChanged instead. The SDK triggers this callback when it loses connection with the server for more than four seconds after the connection is established. After triggering this callback, the SDK tries to reconnect to the server. You can use this callback to implement pop-up reminders. The differences between this callback and onConnectionLost are as follow:
   *  The SDK triggers the onConnectionInterrupted callback when it loses connection with the server for more than four seconds after it successfully joins the channel.
   *  The SDK triggers the onConnectionLost callback when it loses connection with the server for more than 10 seconds, whether or not it joins the channel. If the SDK fails to rejoin the channel 20 minutes after being disconnected from Agora's edge server, the SDK stops rejoining the channel.
   *
   * @param connection The connection information. See RtcConnection.
   */
  onConnectionInterrupted?(connection: RtcConnection): void;

  /**
   * Occurs when the connection is banned by the Agora server.
   *
   * Deprecated: Use onConnectionStateChanged instead.
   *
   * @param connection The connection information. See RtcConnection.
   */
  onConnectionBanned?(connection: RtcConnection): void;

  /**
   * Occurs when the local user receives the data stream from the remote user.
   *
   * The SDK triggers this callback when the local user receives the stream message that the remote user sends by calling the sendStreamMessage method.
   *
   * @param connection The connection information. See RtcConnection.
   * @param remoteUid The ID of the remote user sending the message.
   * @param streamId The stream ID of the received message.
   * @param data The data received.
   * @param length The data length (byte).
   * @param sentTs The time when the data stream is sent.
   */
  onStreamMessage?(
    connection: RtcConnection,
    remoteUid: number,
    streamId: number,
    data: Uint8Array,
    length: number,
    sentTs: number
  ): void;

  /**
   * Occurs when the local user does not receive the data stream from the remote user.
   *
   * The SDK triggers this callback when the local user fails to receive the stream message that the remote user sends by calling the sendStreamMessage method.
   *
   * @param connection The connection information. See RtcConnection.
   * @param uid The ID of the remote user sending the message.
   * @param streamId The stream ID of the received message.
   * @param code The error code. See ErrorCodeType.
   * @param missed The number of lost messages.
   * @param cached Number of incoming cached messages when the data stream is interrupted.
   */
  onStreamMessageError?(
    connection: RtcConnection,
    remoteUid: number,
    streamId: number,
    code: ErrorCodeType,
    missed: number,
    cached: number
  ): void;

  /**
   * Occurs when the token expires.
   *
   * The SDK triggers this callback if the token expires. When receiving this callback, you need to generate a new token on your token server and you can renew your token through one of the following ways:
   *  In scenarios involving one channel:
   *  Call renewToken to pass in the new token.
   *  Call leaveChannel to leave the current channel and then pass in the new token when you call joinChannel to join a channel.
   *  In scenarios involving mutiple channels: Call updateChannelMediaOptionsEx to pass in the new token.
   *
   * @param connection The connection information. See RtcConnection.
   */
  onRequestToken?(connection: RtcConnection): void;

  /**
   * Occurs when the token expires in 30 seconds.
   *
   * When receiving this callback, you need to generate a new token on your token server and you can renew your token through one of the following ways:
   *  In scenarios involving one channel:
   *  Call renewToken to pass in the new token.
   *  Call leaveChannel to leave the current channel and then pass in the new token when you call joinChannel to join a channel.
   *  In scenarios involving mutiple channels: Call updateChannelMediaOptionsEx to pass in the new token.
   *
   * @param connection The connection information. See RtcConnection.
   * @param token The token that is about to expire.
   */
  onTokenPrivilegeWillExpire?(connection: RtcConnection, token: string): void;

  /**
   * @ignore
   */
  onLicenseValidationFailure?(
    connection: RtcConnection,
    reason: LicenseErrorType
  ): void;

  /**
   * Occurs when the first audio frame is published.
   *
   * The SDK triggers this callback under one of the following circumstances:
   *  The local client enables the audio module and calls joinChannel successfully.
   *  The local client calls muteLocalAudioStream (true) and muteLocalAudioStream (false) in sequence.
   *  The local client calls disableAudio and enableAudio in sequence.
   *
   * @param connection The connection information. See RtcConnection.
   * @param elapsed Time elapsed (ms) from the local user calling joinChannel until the SDK triggers this callback.
   */
  onFirstLocalAudioFramePublished?(
    connection: RtcConnection,
    elapsed: number
  ): void;

  /**
   * Occurs when the SDK receives the first audio frame from a specific remote user.
   *
   * Deprecated: Use onRemoteAudioStateChanged instead.
   *
   * @param connection The connection information. See RtcConnection.
   * @param userId The user ID of the remote user.
   * @param elapsed The time elapsed (ms) from the local user calling joinChannel until the SDK triggers this callback.
   */
  onFirstRemoteAudioFrame?(
    connection: RtcConnection,
    userId: number,
    elapsed: number
  ): void;

  /**
   * Occurs when the SDK decodes the first remote audio frame for playback.
   *
   * Deprecated: Use onRemoteAudioStateChanged instead. The SDK triggers this callback under one of the following circumstances:
   *  The remote user joins the channel and sends the audio stream for the first time.
   *  The remote user's audio is offline and then goes online to re-send audio. It means the local user cannot receive audio in 15 seconds. Reasons for such an interruption include:
   *  The remote user leaves channel.
   *  The remote user drops offline.
   *  The remote user calls muteLocalAudioStream to stop sending the audio stream.
   *  The remote user calls disableAudio to disable audio.
   *
   * @param connection The connection information. See RtcConnection.
   * @param uid The user ID of the remote user.
   * @param elapsed The time elapsed (ms) from the local user calling joinChannel until the SDK triggers this callback.
   */
  onFirstRemoteAudioDecoded?(
    connection: RtcConnection,
    uid: number,
    elapsed: number
  ): void;

  /**
   * Occurs when the local audio stream state changes.
   *
   * When the state of the local audio stream changes (including the state of the audio capture and encoding), the SDK triggers this callback to report the current state. This callback indicates the state of the local audio stream, and allows you to troubleshoot issues when audio exceptions occur. When the state is LocalAudioStreamStateFailed (3), you can view the error information in the error parameter.
   *
   * @param connection The connection information. See RtcConnection.
   * @param state The state of the local audio. See LocalAudioStreamState.
   * @param reason Reasons for local audio state changes. See LocalAudioStreamReason.
   */
  onLocalAudioStateChanged?(
    connection: RtcConnection,
    state: LocalAudioStreamState,
    error: LocalAudioStreamError
  ): void;

  /**
   * Occurs when the remote audio state changes.
   *
   * When the audio state of a remote user (in a voice/video call channel) or host (in a live streaming channel) changes, the SDK triggers this callback to report the current state of the remote audio stream. This callback does not work properly when the number of users (in the communication profile) or hosts (in the live streaming channel) in a channel exceeds 17.
   *
   * @param connection The connection information. See RtcConnection.
   * @param remoteUid The ID of the remote user whose audio state changes.
   * @param state The state of the remote audio. See RemoteAudioState.
   * @param reason The reason of the remote audio state change. See RemoteAudioStateReason.
   * @param elapsed Time elapsed (ms) from the local user calling the joinChannel method until the SDK triggers this callback.
   */
  onRemoteAudioStateChanged?(
    connection: RtcConnection,
    remoteUid: number,
    state: RemoteAudioState,
    reason: RemoteAudioStateReason,
    elapsed: number
  ): void;

  /**
   * Occurs when the most active remote speaker is detected.
   *
   * After a successful call of enableAudioVolumeIndication, the SDK continuously detects which remote user has the loudest volume. During the current period, the remote user whose volume is detected as the loudest for the most times, is the most active user. When the number of users is no less than two and an active remote speaker exists, the SDK triggers this callback and reports the uid of the most active remote speaker.
   *  If the most active remote speaker is always the same user, the SDK triggers the onActiveSpeaker callback only once.
   *  If the most active remote speaker changes to another user, the SDK triggers this callback again and reports the uid of the new active remote speaker.
   *
   * @param connection The connection information. See RtcConnection.
   * @param uid The user ID of the most active speaker.
   */
  onActiveSpeaker?(connection: RtcConnection, uid: number): void;

  /**
   * @ignore
   */
  onContentInspectResult?(result: ContentInspectResult): void;

  /**
   * Reports the result of taking a video snapshot.
   *
   * After a successful takeSnapshot method call, the SDK triggers this callback to report whether the snapshot is successfully taken as well as the details for the snapshot taken.
   *
   * @param connection The connection information. See RtcConnection.
   * @param uid The user ID. One uid of 0 indicates the local user.
   * @param filePath The local path of the snapshot.
   * @param width The width (px) of the snapshot.
   * @param height The height (px) of the snapshot.
   * @param errCode The message that confirms success or gives the reason why the snapshot is not successfully taken:
   *  0: Success.
   *  < 0: Failure:
   *  -1: The SDK fails to write data to a file or encode a JPEG image.
   *  -2: The SDK does not find the video stream of the specified user within one second after the takeSnapshot method call succeeds. The possible reasons are: local capture stops, remote end stops publishing, or video data processing is blocked.
   *  -3: Calling the takeSnapshot method too frequently.
   */
  onSnapshotTaken?(
    connection: RtcConnection,
    uid: number,
    filePath: string,
    width: number,
    height: number,
    errCode: number
  ): void;

  /**
   * Occurs when the user role or the audience latency level changes.
   *
   * @param connection The connection information. See RtcConnection.
   * @param oldRole Role that the user switches from: ClientRoleType.
   * @param newRole Role that the user switches to: ClientRoleType.
   * @param newRoleOptions Properties of the role that the user switches to. See ClientRoleOptions.
   */
  onClientRoleChanged?(
    connection: RtcConnection,
    oldRole: ClientRoleType,
    newRole: ClientRoleType,
    newRoleOptions: ClientRoleOptions
  ): void;

  /**
   * Occurs when switching a user role fails.
   *
   * This callback informs you about the reason for failing to switching and your current user role.
   *
   * @param connection The connection information. See RtcConnection.
   * @param reason The reason for a user role switch failure. See ClientRoleChangeFailedReason.
   * @param currentRole Current user role. See ClientRoleType.
   */
  onClientRoleChangeFailed?(
    connection: RtcConnection,
    reason: ClientRoleChangeFailedReason,
    currentRole: ClientRoleType
  ): void;

  /**
   * Reports the volume change of the audio device or app.
   *
   * Occurs when the volume on the playback device, audio capture device, or the volume of the app changes.
   *
   * @param deviceType The device type. See MediaDeviceType.
   * @param volume The volume value. The range is [0, 255].
   * @param muted Whether the audio device is muted: true : The audio device is muted. false : The audio device is not muted.
   */
  onAudioDeviceVolumeChanged?(
    deviceType: MediaDeviceType,
    volume: number,
    muted: boolean
  ): void;

  /**
   * Occurs when the state of Media Push changes.
   *
   * When the state of Media Push changes, the SDK triggers this callback and reports the URL address and the current state of the Media Push. This callback indicates the state of the Media Push. When exceptions occur, you can troubleshoot issues by referring to the detailed error descriptions in the error code parameter.
   *
   * @param url The URL address where the state of the Media Push changes.
   * @param state The current state of the Media Push. See RtmpStreamPublishState.
   * @param reason Reasons for the changes in the Media Push status. See RtmpStreamPublishReason.
   */
  onRtmpStreamingStateChanged?(
    url: string,
    state: RtmpStreamPublishState,
    errCode: RtmpStreamPublishErrorType
  ): void;

  /**
   * Reports events during the Media Push.
   *
   * @param url The URL for Media Push.
   * @param eventCode The event code of Media Push. See RtmpStreamingEvent.
   */
  onRtmpStreamingEvent?(url: string, eventCode: RtmpStreamingEvent): void;

  /**
   * Occurs when the publisher's transcoding is updated.
   *
   * When the LiveTranscoding class in the startRtmpStreamWithTranscoding method updates, the SDK triggers the onTranscodingUpdated callback to report the update information. If you call the startRtmpStreamWithTranscoding method to set the LiveTranscoding class for the first time, the SDK does not trigger this callback.
   */
  onTranscodingUpdated?(): void;

  /**
   * Occurs when the local audio route changes.
   *
   * This callback applies to macOS only.
   *
   * @param routing The current audio routing.
   *  -1: The default audio route.
   *  0: The audio route is a headset with a microphone.
   *  1: The audio route is an earpiece.
   *  2: The audio route is a headset without a microphone.
   *  3: The audio route is the speaker that comes with the device.
   *  4: The audio route is an external speaker. (For iOS and macOS only)
   *  (5): The audio route is a Bluetooth headset.
   */
  onAudioRoutingChanged?(deviceType: number, routing: number): void;

  /**
   * Occurs when the state of the media stream relay changes.
   *
   * The SDK returns the state of the current media relay with any error message.
   *
   * @param state The state code. See ChannelMediaRelayState.
   * @param code The error code of the channel media relay. See ChannelMediaRelayError.
   */
  onChannelMediaRelayStateChanged?(
    state: ChannelMediaRelayState,
    code: ChannelMediaRelayError
  ): void;

  /**
   * @ignore
   */
  onChannelMediaRelayEvent?(code: ChannelMediaRelayEvent): void;

  /**
   * @ignore
   */
  onLocalPublishFallbackToAudioOnly?(isFallbackOrRecover: boolean): void;

  /**
   * Occurs when the remote media stream falls back to the audio-only stream due to poor network conditions or switches back to the video stream after the network conditions improve.
   *
   * If you call setRemoteSubscribeFallbackOption and set option to StreamFallbackOptionAudioOnly, the SDK triggers this callback in the following situations:
   *  The downstream network condition is poor, and the subscribed video stream is downgraded to audio-only stream.
   *  The downstream network condition has improved, and the subscribed stream has been restored to video stream. Once the remote media stream switches to the low-quality video stream due to weak network conditions, you can monitor the stream switch between a high-quality and low-quality stream in the onRemoteVideoStats callback.
   *
   * @param uid The user ID of the remote user.
   * @param isFallbackOrRecover true : The subscribed media stream falls back to audio-only due to poor network conditions. false : The subscribed media stream switches back to the video stream after the network conditions improve.
   */
  onRemoteSubscribeFallbackToAudioOnly?(
    uid: number,
    isFallbackOrRecover: boolean
  ): void;

  /**
   * Reports the transport-layer statistics of each remote audio stream.
   *
   * Deprecated: Use onRemoteAudioStats instead. This callback reports the transport-layer statistics, such as the packet loss rate and network time delay after the local user receives an audio packet from a remote user. During a call, when the user receives the audio packet sent by the remote user, the callback is triggered every 2 seconds.
   *
   * @param connection The connection information. See RtcConnection.
   * @param remoteUid The ID of the remote user sending the audio streams.
   * @param delay The network delay (ms) from the remote user to the receiver.
   * @param lost The packet loss rate (%) of the audio packet sent from the remote user to the receiver.
   * @param rxKBitrate The bitrate of the received audio (Kbps).
   */
  onRemoteAudioTransportStats?(
    connection: RtcConnection,
    remoteUid: number,
    delay: number,
    lost: number,
    rxKBitRate: number
  ): void;

  /**
   * Reports the transport-layer statistics of each remote video stream.
   *
   * Deprecated: This callback is deprecated. Use onRemoteVideoStats instead. This callback reports the transport-layer statistics, such as the packet loss rate and network time delay after the local user receives a video packet from a remote user. During a call, when the user receives the video packet sent by the remote user/host, the callback is triggered every 2 seconds.
   *
   * @param connection The connection information. See RtcConnection.
   * @param remoteUid The ID of the remote user sending the video packets.
   * @param delay The network delay (ms) from the sender to the receiver.
   * @param lost The packet loss rate (%) of the video packet sent from the remote user.
   * @param rxKBitRate The bitrate of the received video (Kbps).
   */
  onRemoteVideoTransportStats?(
    connection: RtcConnection,
    remoteUid: number,
    delay: number,
    lost: number,
    rxKBitRate: number
  ): void;

  /**
   * Occurs when the network connection state changes.
   *
   * When the network connection state changes, the SDK triggers this callback and reports the current connection state and the reason for the change.
   *
   * @param connection The connection information. See RtcConnection.
   * @param state The current connection state. See ConnectionStateType.
   * @param reason The reason for a connection state change. See ConnectionChangedReasonType.
   */
  onConnectionStateChanged?(
    connection: RtcConnection,
    state: ConnectionStateType,
    reason: ConnectionChangedReasonType
  ): void;

  /**
   * @ignore
   */
  onWlAccMessage?(
    connection: RtcConnection,
    reason: WlaccMessageReason,
    action: WlaccSuggestAction,
    wlAccMsg: string
  ): void;

  /**
   * @ignore
   */
  onWlAccStats?(
    connection: RtcConnection,
    currentStats: WlAccStats,
    averageStats: WlAccStats
  ): void;

  /**
   * Occurs when the local network type changes.
   *
   * This callback occurs when the connection state of the local user changes. You can get the connection state and reason for the state change in this callback. When the network connection is interrupted, this callback indicates whether the interruption is caused by a network type change or poor network conditions.
   *
   * @param connection The connection information. See RtcConnection.
   * @param type The type of the local network connection. See NetworkType.
   */
  onNetworkTypeChanged?(connection: RtcConnection, type: NetworkType): void;

  /**
   * Reports the built-in encryption errors.
   *
   * When encryption is enabled by calling enableEncryption, the SDK triggers this callback if an error occurs in encryption or decryption on the sender or the receiver side.
   *
   * @param connection The connection information. See RtcConnection.
   * @param errorType Details about the error type. See EncryptionErrorType.
   */
  onEncryptionError?(
    connection: RtcConnection,
    errorType: EncryptionErrorType
  ): void;

  /**
   * Occurs when the SDK cannot get the device permission.
   *
   * When the SDK fails to get the device permission, the SDK triggers this callback to report which device permission cannot be got.
   *
   * @param permissionType The type of the device permission. See PermissionType.
   */
  onPermissionError?(permissionType: PermissionType): void;

  /**
   * Occurs when the local user registers a user account.
   *
   * After the local user successfully calls registerLocalUserAccount to register the user account or calls joinChannelWithUserAccount to join a channel, the SDK triggers the callback and informs the local user's UID and User Account.
   *
   * @param uid The ID of the local user.
   * @param userAccount The user account of the local user.
   */
  onLocalUserRegistered?(uid: number, userAccount: string): void;

  /**
   * Occurs when the SDK gets the user ID and user account of the remote user.
   *
   * After a remote user joins the channel, the SDK gets the UID and user account of the remote user, caches them in a mapping table object, and triggers this callback on the local client.
   *
   * @param uid The user ID of the remote user.
   * @param info The UserInfo object that contains the user ID and user account of the remote user. See UserInfo for details.
   */
  onUserInfoUpdated?(uid: number, info: UserInfo): void;

  /**
   * @ignore
   */
  onUploadLogResult?(
    connection: RtcConnection,
    requestId: string,
    success: boolean,
    reason: UploadErrorReason
  ): void;

  /**
   * Occurs when the audio subscribing state changes.
   *
   * @param channel The channel name.
   * @param uid The user ID of the remote user.
   * @param oldState The previous subscribing status. See StreamSubscribeState.
   * @param newState The current subscribing status. See StreamSubscribeState.
   * @param elapseSinceLastState The time elapsed (ms) from the previous state to the current state.
   */
  onAudioSubscribeStateChanged?(
    channel: string,
    uid: number,
    oldState: StreamSubscribeState,
    newState: StreamSubscribeState,
    elapseSinceLastState: number
  ): void;

  /**
   * Occurs when the video subscribing state changes.
   *
   * @param channel The channel name.
   * @param uid The user ID of the remote user.
   * @param oldState The previous subscribing status. See StreamSubscribeState.
   * @param newState The current subscribing status. See StreamSubscribeState.
   * @param elapseSinceLastState The time elapsed (ms) from the previous state to the current state.
   */
  onVideoSubscribeStateChanged?(
    channel: string,
    uid: number,
    oldState: StreamSubscribeState,
    newState: StreamSubscribeState,
    elapseSinceLastState: number
  ): void;

  /**
   * Occurs when the audio publishing state changes.
   *
   * @param channel The channel name.
   * @param oldState The previous publishing state. See StreamPublishState.
   * @param newState The current publishing stat. See StreamPublishState.
   * @param elapseSinceLastState The time elapsed (ms) from the previous state to the current state.
   */
  onAudioPublishStateChanged?(
    channel: string,
    oldState: StreamPublishState,
    newState: StreamPublishState,
    elapseSinceLastState: number
  ): void;

  /**
   * Occurs when the video publishing state changes.
   *
   * @param source The type of the video source. See VideoSourceType.
   * @param channel The channel name.
   * @param oldState The previous publishing state. See StreamPublishState.
   * @param newState The current publishing stat. See StreamPublishState.
   * @param elapseSinceLastState The time elapsed (ms) from the previous state to the current state.
   */
  onVideoPublishStateChanged?(
    source: VideoSourceType,
    channel: string,
    oldState: StreamPublishState,
    newState: StreamPublishState,
    elapseSinceLastState: number
  ): void;

  /**
   * The event callback of the extension.
   *
   * To listen for events while the extension is running, you need to register this callback.
   *
   * @param provider The name of the extension provider.
   * @param extension The name of the extension.
   * @param key The key of the extension.
   * @param value The value of the extension key.
   */
  onExtensionEvent?(
    provider: string,
    extension: string,
    key: string,
    value: string
  ): void;

  /**
   * Occurs when the extension is enabled.
   *
   * The extension triggers this callback after it is successfully enabled.
   *
   * @param provider The name of the extension provider.
   * @param extension The name of the extension.
   */
  onExtensionStarted?(provider: string, extension: string): void;

  /**
   * Occurs when the extension is disabled.
   *
   * The extension triggers this callback after it is successfully destroyed.
   *
   * @param provider The name of the extension provider.
   * @param extension The name of the extension.
   */
  onExtensionStopped?(provider: string, extension: string): void;

  /**
   * Occurs when the extension runs incorrectly.
   *
   * In case of extension enabling failure or runtime errors, the extension triggers this callback and reports the error code along with the reasons.
   *
   * @param provider The name of the extension provider.
   * @param extension The name of the extension.
   * @param error Error code. For details, see the extension documentation provided by the extension provider.
   * @param message Reason. For details, see the extension documentation provided by the extension provider.
   */
  onExtensionError?(
    provider: string,
    extension: string,
    error: number,
    message: string
  ): void;

  /**
   * @ignore
   */
  onUserAccountUpdated?(
    connection: RtcConnection,
    remoteUid: number,
    userAccount: string
  ): void;

  /**
   * Occurs when there's an error during the local video mixing.
   *
   * When you fail to call startLocalVideoTranscoder or updateLocalTranscoderConfiguration, the SDK triggers this callback to report the reason.
   *
   * @param stream The video streams that cannot be mixed during video mixing. See TranscodingVideoStream.
   * @param error The reason for local video mixing error. See VideoTranscoderError.
   */
  onLocalVideoTranscoderError?(
    stream: TranscodingVideoStream,
    error: VideoTranscoderError
  ): void;

  /**
   * Video frame rendering event callback.
   *
   * After calling the startMediaRenderingTracing method or joining the channel, the SDK triggers this callback to report the events of video frame rendering and the indicators during the rendering process. Developers can optimize the indicators to improve the efficiency of the first video frame rendering.
   *
   * @param connection The connection information. See RtcConnection.
   * @param uid The user ID.
   * @param currentEvent The current video frame rendering event. See MediaTraceEvent.
   * @param tracingInfo The indicators during the video frame rendering process. Developers need to reduce the value of indicators as much as possible in order to improve the efficiency of the first video frame rendering. See VideoRenderingTracingInfo.
   */
  onVideoRenderingTracingResult?(
    connection: RtcConnection,
    uid: number,
    currentEvent: MediaTraceEvent,
    tracingInfo: VideoRenderingTracingInfo
  ): void;
}

/**
 * Video device management methods.
 */
export abstract class IVideoDeviceManager {
  /**
   * Enumerates the video devices.
   *
   * @returns
   * Success: A VideoDeviceInfo array including all video devices in the system.
   *  Failure: An empty array.
   */
  abstract enumerateVideoDevices(): VideoDeviceInfo[];

  /**
   * Specifies the video capture device with the device ID.
   *
   * Plugging or unplugging a device does not change its device ID.
   *
   * @param deviceIdUTF8 The device ID. You can get the device ID by calling enumerateVideoDevices. The maximum length is MaxDeviceIdLengthType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setDevice(deviceIdUTF8: string): number;

  /**
   * Retrieves the current video capture device.
   *
   * @returns
   * The video capture device.
   */
  abstract getDevice(): string;

  /**
   * Gets the number of video formats supported by the specified video capture device.
   *
   * Video capture devices may support multiple video formats, and each format supports different combinations of video frame width, video frame height, and frame rate. You can call this method to get how many video formats the specified video capture device can support, and then call getCapability to get the specific video frame information in the specified video format.
   *
   * @param deviceIdUTF8 The ID of the video capture device.
   *
   * @returns
   * > 0: Success. Returns the number of video formats supported by this device. For example: If the specified camera supports 10 different video formats, the return value is 10.
   *  ≤ 0: Failure.
   */
  abstract numberOfCapabilities(deviceIdUTF8: string): number;

  /**
   * Gets the detailed video frame information of the video capture device in the specified video format.
   *
   * After calling numberOfCapabilities to get the number of video formats supported by the video capture device, you can call this method to get the specific video frame information supported by the specified index number.
   *
   * @param deviceIdUTF8 The ID of the video capture device.
   * @param deviceCapabilityNumber The index number of the video format. If the return value of numberOfCapabilities is i, the value range of this parameter is [0,i).
   *
   * @returns
   * The specific information of the specified video format, including width (px), height (px), and frame rate (fps). See VideoFormat.
   */
  abstract getCapability(
    deviceIdUTF8: string,
    deviceCapabilityNumber: number
  ): VideoFormat;

  /**
   * @ignore
   */
  abstract startDeviceTest(hwnd: any): number;

  /**
   * @ignore
   */
  abstract stopDeviceTest(): number;

  /**
   * @ignore
   */
  abstract release(): void;
}

/**
 * Configurations for the RtcEngineContext instance.
 */
export class RtcEngineContext {
  appId?: string;
  channelProfile?: ChannelProfileType;
  license?: string;
  audioScenario?: AudioScenarioType;
  areaCode?: number;
  logConfig?: LogConfig;
  threadPriority?: ThreadPriorityType;
  useExternalEglContext?: boolean;
  domainLimit?: boolean;
  autoRegisterAgoraExtensions?: boolean;
}

/**
 * Metadata type of the observer. We only support video metadata for now.
 */
export enum MetadataType {
  /**
   * The type of metadata is unknown.
   */
  UnknownMetadata = -1,
  /**
   * The type of metadata is video.
   */
  VideoMetadata = 0,
}

/**
 * @ignore
 */
export enum MaxMetadataSizeType {
  /**
   * @ignore
   */
  InvalidMetadataSizeInByte = -1,
  /**
   * @ignore
   */
  DefaultMetadataSizeInByte = 512,
  /**
   * @ignore
   */
  MaxMetadataSizeInByte = 1024,
}

/**
 * Media metadata.
 */
export class Metadata {
  uid?: number;
  size?: number;
  buffer?: Uint8Array;
  timeStampMs?: number;
}

/**
 * The metadata observer.
 */
export interface IMetadataObserver {
  /**
   * Occurs when the local user receives the metadata.
   *
   * @param metadata The metadata received. See Metadata.
   */
  onMetadataReceived?(metadata: Metadata): void;
}

/**
 * @ignore
 */
export enum DirectCdnStreamingError {
  /**
   * @ignore
   */
  DirectCdnStreamingErrorOk = 0,
  /**
   * @ignore
   */
  DirectCdnStreamingErrorFailed = 1,
  /**
   * @ignore
   */
  DirectCdnStreamingErrorAudioPublication = 2,
  /**
   * @ignore
   */
  DirectCdnStreamingErrorVideoPublication = 3,
  /**
   * @ignore
   */
  DirectCdnStreamingErrorNetConnect = 4,
  /**
   * @ignore
   */
  DirectCdnStreamingErrorBadName = 5,
}

/**
 * The current CDN streaming state.
 */
export enum DirectCdnStreamingState {
  /**
   * 0: The initial state before the CDN streaming starts.
   */
  DirectCdnStreamingStateIdle = 0,
  /**
   * 1: Streams are being pushed to the CDN. The SDK returns this value when you call the startDirectCdnStreaming method to push streams to the CDN.
   */
  DirectCdnStreamingStateRunning = 1,
  /**
   * 2: Stops pushing streams to the CDN. The SDK returns this value when you call the stopDirectCdnStreaming method to stop pushing streams to the CDN.
   */
  DirectCdnStreamingStateStopped = 2,
  /**
   * 3: Fails to push streams to the CDN. You can troubleshoot the issue with the information reported by the onDirectCdnStreamingStateChanged callback, and then push streams to the CDN again.
   */
  DirectCdnStreamingStateFailed = 3,
  /**
   * 4: Tries to reconnect the Agora server to the CDN. The SDK attempts to reconnect a maximum of 10 times; if the connection is not restored, the streaming state becomes DirectCdnStreamingStateFailed.
   */
  DirectCdnStreamingStateRecovering = 4,
}

/**
 * The statistics of the current CDN streaming.
 */
export class DirectCdnStreamingStats {
  videoWidth?: number;
  videoHeight?: number;
  fps?: number;
  videoBitrate?: number;
  audioBitrate?: number;
}

/**
 * The IDirectCdnStreamingEventHandler interface class is used by the SDK to send event notifications of CDN streaming to your app. Your app can get those notifications through methods that inherit this interface class.
 */
export interface IDirectCdnStreamingEventHandler {
  /**
   * Occurs when the CDN streaming state changes.
   *
   * When the host directly pushes streams to the CDN, if the streaming state changes, the SDK triggers this callback to report the changed streaming state, error codes, and other information. You can troubleshoot issues by referring to this callback.
   *
   * @param state The current CDN streaming state. See DirectCdnStreamingState.
   * @param reason Reasons for changes in the status of CDN streaming. See DirectCdnStreamingReason.
   * @param message The information about the changed streaming state.
   */
  onDirectCdnStreamingStateChanged?(
    state: DirectCdnStreamingState,
    error: DirectCdnStreamingError,
    message: string
  ): void;

  /**
   * Reports the CDN streaming statistics.
   *
   * When the host directly pushes media streams to the CDN, the SDK triggers this callback every one second.
   *
   * @param stats The statistics of the current CDN streaming. See DirectCdnStreamingStats.
   */
  onDirectCdnStreamingStats?(stats: DirectCdnStreamingStats): void;
}

/**
 * The media setting options for the host.
 */
export class DirectCdnStreamingMediaOptions {
  publishCameraTrack?: boolean;
  publishMicrophoneTrack?: boolean;
  publishCustomAudioTrack?: boolean;
  publishCustomVideoTrack?: boolean;
  publishMediaPlayerAudioTrack?: boolean;
  publishMediaPlayerId?: number;
  customVideoTrackId?: number;
  publishScreenTrack?: boolean;
  publishSecondaryScreenTrack?: boolean;
  publishThirdScreenTrack?: boolean;
  publishFourthScreenTrack?: boolean;
  publishLoopbackAudioTrack?: boolean;
  publishLoopbackDeviceName?: string;
}

/**
 * @ignore
 */
export class ExtensionInfo {
  mediaSourceType?: MediaSourceType;
  remoteUid?: number;
  channelId?: string;
  localUid?: number;
}

/**
 * The basic interface of the Agora SDK that implements the core functions of real-time communication.
 *
 * IRtcEngine provides the main methods that your app can call. Before calling other APIs, you must call createAgoraRtcEngine to create an IRtcEngine object.
 */
export abstract class IRtcEngine {
  /**
   * Releases the IRtcEngine instance.
   *
   * This method releases all resources used by the Agora SDK. Use this method for apps in which users occasionally make voice or video calls. When users do not make calls, you can free up resources for other operations. After a successful method call, you can no longer use any method or callback in the SDK anymore. If you want to use the real-time communication functions again, you must call createAgoraRtcEngine and initialize to create a new IRtcEngine instance.
   *  This method can be called synchronously. You need to wait for the resource of IRtcEngine to be released before performing other operations (for example, create a new IRtcEngine object). Therefore, Agora recommends calling this method in the child thread to avoid blocking the main thread.
   *  Besides, Agora does not recommend you calling release in any callback of the SDK. Otherwise, the SDK cannot release the resources until the callbacks return results, which may result in a deadlock.
   *
   * @param sync Whether the method is called synchronously: true : Synchronous call. false : Asynchronous call. Currently this method only supports synchronous calls. Do not set this parameter to this value.
   */
  abstract release(sync?: boolean): void;

  /**
   * Creates and initializes IRtcEngine.
   *
   * All called methods provided by the IRtcEngine class are executed asynchronously. Agora recommends calling these methods in the same thread.
   *
   * @param context Configurations for the IRtcEngine instance. See RtcEngineContext.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -1: A general error occurs (no specified reason).
   *  -2: The parameter is invalid.
   *  -7: The SDK is not initialized.
   *  -22: The resource request failed. The SDK fails to allocate resources because your app consumes too much system resource or the system resources are insufficient.
   *  -101: The App ID is invalid.
   */
  abstract initialize(context: RtcEngineContext): number;

  /**
   * Gets the SDK version.
   *
   * @returns
   * One SDKBuildInfo object.
   */
  abstract getVersion(): SDKBuildInfo;

  /**
   * Gets the warning or error description.
   *
   * @param code The error code or warning code reported by the SDK.
   *
   * @returns
   * The specific error or warning description.
   */
  abstract getErrorDescription(code: number): string;

  /**
   * Queries the video codec capabilities of the SDK.
   *
   * @returns
   * If the call is successful, an object containing the following attributes is returned: codecInfo : The CodecCapInfo array, indicating the video codec capabillity of the device. size : The size of the CodecCapInfo array.
   *  If the call timeouts, please modify the call logic and do not invoke the method in the main thread.
   */
  abstract queryCodecCapability(): { codecInfo: CodecCapInfo[]; size: number };

  /**
   * Queries device score.
   *
   * @returns
   * >0: The method call succeeeds, the value is the current device's score, the range is [0,100], the larger the value, the stronger the device capability. Most devices are rated between 60 and 100.
   *  < 0: Failure.
   */
  abstract queryDeviceScore(): number;

  /**
   * Preloads a channel with token, channelId, and uid.
   *
   * When audience members need to switch between different channels frequently, calling the method can help shortening the time of joining a channel, thus reducing the time it takes for audience members to hear and see the host. If you join a preloaded channel, leave it and want to rejoin the same channel, you do not need to call this method unless the token for preloading the channel expires. Failing to preload a channel does not mean that you can't join a channel, nor will it increase the time of joining a channel.
   *
   * @param token The token generated on your server for authentication. When the token for preloading channels expires, you can update the token based on the number of channels you preload.
   *  When preloading one channel, calling this method to pass in the new token.
   *  When preloading more than one channels:
   *  If you use a wildcard token for all preloaded channels, call updatePreloadChannelToken to update the token. When generating a wildcard token, ensure the user ID is not set as 0.
   *  If you use different tokens to preload different channels, call this method to pass in your user ID, channel name and the new token.
   * @param channelId The channel name that you want to preload. This parameter signifies the channel in which users engage in real-time audio and video interaction. Under the premise of the same App ID, users who fill in the same channel ID enter the same channel for audio and video interaction. The string length must be less than 64 bytes. Supported characters (89 characters in total):
   *  All lowercase English letters: a to z.
   *  All uppercase English letters: A to Z.
   *  All numeric characters: 0 to 9.
   *  "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
   * @param uid The user ID. This parameter is used to identify the user in the channel for real-time audio and video interaction. You need to set and manage user IDs yourself, and ensure that each user ID in the same channel is unique. This parameter is a 32-bit unsigned integer. The value range is 1 to 2 32 -1. If the user ID is not assigned (or set to 0), the SDK assigns a random user ID and onJoinChannelSuccess returns it in the callback. Your application must record and maintain the returned user ID, because the SDK does not do so.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -7: The IRtcEngine object has not been initialized. You need to initialize the IRtcEngine object before calling this method.
   *  -102: The channel name is invalid. You need to pass in a valid channel name and join the channel again.
   */
  abstract preloadChannel(
    token: string,
    channelId: string,
    uid: number
  ): number;

  /**
   * @ignore
   */
  abstract preloadChannelWithUserAccount(
    token: string,
    channelId: string,
    userAccount: string
  ): number;

  /**
   * Updates the wildcard token for preloading channels.
   *
   * You need to maintain the life cycle of the wildcard token by yourself. When the token expires, you need to generate a new wildcard token and then call this method to pass in the new token.
   *
   * @param token The new token.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -2: The parameter is invalid. For example, the token is invalid. You need to pass in a valid parameter and join the channel again.
   *  -7: The IRtcEngine object has not been initialized. You need to initialize the IRtcEngine object before calling this method.
   */
  abstract updatePreloadChannelToken(token: string): number;

  /**
   * Joins a channel with media options.
   *
   * This method enables users to join a channel. Users in the same channel can talk to each other, and multiple users in the same channel can start a group chat. Users with different App IDs cannot call each other. A successful call of this method triggers the following callbacks:
   *  The local client: The onJoinChannelSuccess and onConnectionStateChanged callbacks.
   *  The remote client: onUserJoined, if the user joining the channel is in the Communication profile or is a host in the Live-broadcasting profile. When the connection between the client and Agora's server is interrupted due to poor network conditions, the SDK tries reconnecting to the server. When the local client successfully rejoins the channel, the SDK triggers the onRejoinChannelSuccess callback on the local client.
   *  This method allows users to join only one channel at a time.
   *  Ensure that the app ID you use to generate the token is the same app ID that you pass in the initialize method; otherwise, you may fail to join the channel by token.
   *  If you choose the Testing Mode (using an App ID for authentication) for your project and call this method to join a channel, you will automatically exit the channel after 24 hours.
   *
   * @param token The token generated on your server for authentication. If you need to join different channels at the same time or switch between channels, Agora recommends using a wildcard token so that you don't need to apply for a new token every time joining a channel.
   * @param channelId The channel name. This parameter signifies the channel in which users engage in real-time audio and video interaction. Under the premise of the same App ID, users who fill in the same channel ID enter the same channel for audio and video interaction. The string length must be less than 64 bytes. Supported characters (89 characters in total):
   *  All lowercase English letters: a to z.
   *  All uppercase English letters: A to Z.
   *  All numeric characters: 0 to 9.
   *  "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
   * @param uid The user ID. This parameter is used to identify the user in the channel for real-time audio and video interaction. You need to set and manage user IDs yourself, and ensure that each user ID in the same channel is unique. This parameter is a 32-bit unsigned integer. The value range is 1 to 2 32 -1. If the user ID is not assigned (or set to 0), the SDK assigns a random user ID and onJoinChannelSuccess returns it in the callback. Your application must record and maintain the returned user ID, because the SDK does not do so.
   * @param options The channel media options. See ChannelMediaOptions.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -2: The parameter is invalid. For example, the token is invalid, the uid parameter is not set to an integer, or the value of a member in ChannelMediaOptions is invalid. You need to pass in a valid parameter and join the channel again.
   *  -3: Failes to initialize the IRtcEngine object. You need to reinitialize the IRtcEngine object.
   *  -7: The IRtcEngine object has not been initialized. You need to initialize the IRtcEngine object before calling this method.
   *  -8: The internal state of the IRtcEngine object is wrong. The typical cause is that you call this method to join the channel without calling startEchoTest to stop the test after calling stopEchoTest to start a call loop test. You need to call stopEchoTest before calling this method.
   *  -17: The request to join the channel is rejected. The typical cause is that the user is in the channel. Agora recommends that you use the onConnectionStateChanged callback to determine whether the user exists in the channel. Do not call this method to join the channel unless you receive the ConnectionStateDisconnected (1) state.
   *  -102: The channel name is invalid. You need to pass in a valid channelname in channelId to rejoin the channel.
   *  -121: The user ID is invalid. You need to pass in a valid user ID in uid to rejoin the channel.
   */
  abstract joinChannel(
    token: string,
    channelId: string,
    uid: number,
    options: ChannelMediaOptions
  ): number;

  /**
   * Updates the channel media options after joining the channel.
   *
   * @param options The channel media options. See ChannelMediaOptions.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -2: The value of a member in the ChannelMediaOptions structure is invalid. For example, the token or the user ID is invalid. You need to fill in a valid parameter.
   *  -7: The IRtcEngine object has not been initialized. You need to initialize the IRtcEngine object before calling this method.
   *  -8: The internal state of the IRtcEngine object is wrong. The possible reason is that the user is not in the channel. Agora recommends that you use the onConnectionStateChanged callback to determine whether the user exists in the channel. If you receive the ConnectionStateDisconnected (1) or ConnectionStateFailed (5) state, the user is not in the channel. You need to call joinChannel to join a channel before calling this method.
   */
  abstract updateChannelMediaOptions(options: ChannelMediaOptions): number;

  /**
   * Sets channel options and leaves the channel.
   *
   * After calling this method, the SDK terminates the audio and video interaction, leaves the current channel, and releases all resources related to the session. After joining the channel, you must call this method to end the call; otherwise, the next call cannot be started. If you have called joinChannelEx to join multiple channels, calling this method will leave all the channels you joined. This method call is asynchronous. When this method returns, it does not necessarily mean that the user has left the channel.
   *
   * @param options The options for leaving the channel. See LeaveChannelOptions.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract leaveChannel(options?: LeaveChannelOptions): number;

  /**
   * Renews the token.
   *
   * You can call this method to pass a new token to the SDK. A token will expire after a certain period of time, at which point the SDK will be unable to establish a connection with the server.
   *
   * @param token The new token.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -2: The parameter is invalid. For example, the token is empty.
   *  -7: The IRtcEngine object has not been initialized. You need to initialize the IRtcEngine object before calling this method.
   *  110: Invalid token. Ensure the following:
   *  The user ID specified when generating the token is consistent with the user ID used when joining the channel.
   *  The generated token is the same as the token passed in to join the channel.
   */
  abstract renewToken(token: string): number;

  /**
   * Sets the channel profile.
   *
   * You can call this method to set the channel profile. The SDK adopts different optimization strategies for different channel profiles. For example, in a live streaming scenario, the SDK prioritizes video quality. After initializing the SDK, the default channel profile is the live streaming profile.
   *
   * @param profile The channel profile. See ChannelProfileType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -2: The parameter is invalid.
   *  -7: The SDK is not initialized.
   */
  abstract setChannelProfile(profile: ChannelProfileType): number;

  /**
   * Set the user role and the audience latency level in a live streaming scenario.
   *
   * By default,the SDK sets the user role as audience. You can call this method to set the user role as host. The user role (roles) determines the users' permissions at the SDK level, including whether they can publish audio and video streams in a channel.
   *
   * @param role The user role. See ClientRoleType. If you set the user role as an audience member, you cannot publish audio and video streams in the channel. If you want to publish media streams in a channel during live streaming, ensure you set the user role as broadcaster.
   * @param options The detailed options of a user, including the user level. See ClientRoleOptions.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -1: A general error occurs (no specified reason).
   *  -2: The parameter is invalid.
   *  -5: The request is rejected.
   *  -7: The SDK is not initialized.
   */
  abstract setClientRole(
    role: ClientRoleType,
    options?: ClientRoleOptions
  ): number;

  /**
   * Starts an audio device loopback test.
   *
   * To test whether the user's local sending and receiving streams are normal, you can call this method to perform an audio and video call loop test, which tests whether the audio and video devices and the user's upstream and downstream networks are working properly. After starting the test, the user needs to make a sound or face the camera. The audio or video is output after about two seconds. If the audio playback is normal, the audio device and the user's upstream and downstream networks are working properly; if the video playback is normal, the video device and the user's upstream and downstream networks are working properly.
   *  You can call this method either before or after joining a channel. When calling in a channel, make sure that no audio or video stream is being published.
   *  After calling this method, call stopEchoTest to end the test; otherwise, the user cannot perform the next audio and video call loop test and cannot join the channel.
   *  In live streaming scenarios, this method only applies to hosts.
   *
   * @param config The configuration of the audio and video call loop test. See EchoTestConfiguration.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract startEchoTest(config: EchoTestConfiguration): number;

  /**
   * Stops the audio call test.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -5(ERR_REFUSED): Failed to stop the echo test. The echo test may not be running.
   */
  abstract stopEchoTest(): number;

  /**
   * @ignore
   */
  abstract enableMultiCamera(
    enabled: boolean,
    config: CameraCapturerConfiguration
  ): number;

  /**
   * Enables the video module.
   *
   * The video module is disabled by default, call this method to enable it. If you need to disable the video module later, you need to call disableVideo.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract enableVideo(): number;

  /**
   * Disables the video module.
   *
   * This method is used to disable the video module.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract disableVideo(): number;

  /**
   * Enables the local video preview and specifies the video source for the preview.
   *
   * This method is used to start local video preview and specify the video source that appears in the preview screen.
   *
   * @param sourceType The type of the video source. See VideoSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract startPreview(sourceType?: VideoSourceType): number;

  /**
   * Enables the local video preview.
   *
   * You can call this method to enable local video preview.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract startPreviewWithoutSourceType(): number;

  /**
   * Stops the local video preview.
   *
   * @param sourceType The type of the video source. See VideoSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract stopPreview(sourceType?: VideoSourceType): number;

  /**
   * Starts the last mile network probe test.
   *
   * This method starts the last-mile network probe test before joining a channel to get the uplink and downlink last mile network statistics, including the bandwidth, packet loss, jitter, and round-trip time (RTT). Once this method is enabled, the SDK returns the following callbacks: onLastmileQuality : The SDK triggers this callback within two seconds depending on the network conditions. This callback rates the network conditions and is more closely linked to the user experience. onLastmileProbeResult : The SDK triggers this callback within 30 seconds depending on the network conditions. This callback returns the real-time statistics of the network conditions and is more objective. This method must be called before joining the channel, and is used to judge and predict whether the current uplink network quality is good enough.
   *  Do not call other methods before receiving the onLastmileQuality and onLastmileProbeResult callbacks. Otherwise, the callbacks may be interrupted.
   *  A host should not call this method after joining a channel (when in a call).
   *
   * @param config The configurations of the last-mile network probe test. See LastmileProbeConfig.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract startLastmileProbeTest(config: LastmileProbeConfig): number;

  /**
   * Stops the last mile network probe test.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract stopLastmileProbeTest(): number;

  /**
   * Sets the video encoder configuration.
   *
   * Sets the encoder configuration for the local video. Each configuration profile corresponds to a set of video parameters, including the resolution, frame rate, and bitrate.
   *
   * @param config Video profile. See VideoEncoderConfiguration.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setVideoEncoderConfiguration(
    config: VideoEncoderConfiguration
  ): number;

  /**
   * Sets the image enhancement options.
   *
   * Enables or disables image enhancement, and sets the options.
   *  Call this method after calling enableVideo or startPreview.
   *  This method relies on the image enhancement dynamic library libagora_clear_vision_extension.dll. If the dynamic library is deleted, the function cannot be enabled normally.
   *  This feature has high requirements on device performance. When calling this method, the SDK automatically checks the capabilities of the current device.
   *
   * @param enabled Whether to enable the image enhancement function: true : Enable the image enhancement function. false : (Default) Disable the image enhancement function.
   * @param options The image enhancement options. See BeautyOptions.
   * @param type Source type of the extension. See MediaSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -4: The current device does not support this feature. Possible reasons include:
   *  The current device capabilities do not meet the requirements for image enhancement. Agora recommends you replace it with a high-performance device.
   */
  abstract setBeautyEffectOptions(
    enabled: boolean,
    options: BeautyOptions,
    type?: MediaSourceType
  ): number;

  /**
   * Sets low-light enhancement.
   *
   * The low-light enhancement feature can adaptively adjust the brightness value of the video captured in situations with low or uneven lighting, such as backlit, cloudy, or dark scenes. It restores or highlights the image details and improves the overall visual effect of the video. You can call this method to enable the color enhancement feature and set the options of the color enhancement effect.
   *  Call this method after calling enableVideo.
   *  Dark light enhancement has certain requirements for equipment performance. The low-light enhancement feature has certain performance requirements on devices. If your device overheats after you enable low-light enhancement, Agora recommends modifying the low-light enhancement options to a less performance-consuming level or disabling low-light enhancement entirely.
   *  Both this method and setExtensionProperty can turn on low-light enhancement:
   *  When you use the SDK to capture video, Agora recommends this method (this method only works for video captured by the SDK).
   *  When you use an external video source to implement custom video capture, or send an external video source to the SDK, Agora recommends using setExtensionProperty.
   *  This method relies on the image enhancement dynamic library libagora_clear_vision_extension.dll. If the dynamic library is deleted, the function cannot be enabled normally.
   *
   * @param enabled Whether to enable low-light enhancement: true : Enable low-light enhancement. false : (Default) Disable low-light enhancement.
   * @param options The low-light enhancement options. See LowlightEnhanceOptions.
   * @param type The type of the video source. See MediaSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setLowlightEnhanceOptions(
    enabled: boolean,
    options: LowlightEnhanceOptions,
    type?: MediaSourceType
  ): number;

  /**
   * Sets video noise reduction.
   *
   * Underlit environments and low-end video capture devices can cause video images to contain significant noise, which affects video quality. In real-time interactive scenarios, video noise also consumes bitstream resources and reduces encoding efficiency during encoding. You can call this method to enable the video noise reduction feature and set the options of the video noise reduction effect.
   *  Call this method after calling enableVideo.
   *  Video noise reduction has certain requirements for equipment performance. If your device overheats after you enable video noise reduction, Agora recommends modifying the video noise reduction options to a less performance-consuming level or disabling video noise reduction entirely.
   *  Both this method and setExtensionProperty can turn on video noise reduction function:
   *  When you use the SDK to capture video, Agora recommends this method (this method only works for video captured by the SDK).
   *  When you use an external video source to implement custom video capture, or send an external video source to the SDK, Agora recommends using setExtensionProperty.
   *  This method relies on the image enhancement dynamic library libagora_clear_vision_extension.dll. If the dynamic library is deleted, the function cannot be enabled normally.
   *
   * @param enabled Whether to enable video noise reduction: true : Enable video noise reduction. false : (Default) Disable video noise reduction.
   * @param options The video noise reduction options. See VideoDenoiserOptions.
   * @param type The type of the video source. See MediaSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setVideoDenoiserOptions(
    enabled: boolean,
    options: VideoDenoiserOptions,
    type?: MediaSourceType
  ): number;

  /**
   * Sets color enhancement.
   *
   * The video images captured by the camera can have color distortion. The color enhancement feature intelligently adjusts video characteristics such as saturation and contrast to enhance the video color richness and color reproduction, making the video more vivid. You can call this method to enable the color enhancement feature and set the options of the color enhancement effect.
   *  Call this method after calling enableVideo.
   *  The color enhancement feature has certain performance requirements on devices. With color enhancement turned on, Agora recommends that you change the color enhancement level to one that consumes less performance or turn off color enhancement if your device is experiencing severe heat problems.
   *  Both this method and setExtensionProperty can enable color enhancement:
   *  When you use the SDK to capture video, Agora recommends this method (this method only works for video captured by the SDK).
   *  When you use an external video source to implement custom video capture, or send an external video source to the SDK, Agora recommends using setExtensionProperty.
   *  This method relies on the image enhancement dynamic library libagora_clear_vision_extension.dll. If the dynamic library is deleted, the function cannot be enabled normally.
   *
   * @param enabled Whether to enable color enhancement: true Enable color enhancement. false : (Default) Disable color enhancement.
   * @param options The color enhancement options. See ColorEnhanceOptions.
   * @param type The type of the video source. See MediaSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setColorEnhanceOptions(
    enabled: boolean,
    options: ColorEnhanceOptions,
    type?: MediaSourceType
  ): number;

  /**
   * Enables/Disables the virtual background.
   *
   * The virtual background feature enables the local user to replace their original background with a static image, dynamic video, blurred background, or portrait-background segmentation to achieve picture-in-picture effect. Once the virtual background feature is enabled, all users in the channel can see the custom background. Call this method after calling enableVideo or startPreview.
   *  This feature has high requirements on device performance. When calling this method, the SDK automatically checks the capabilities of the current device. Agora recommends you use virtual background on devices with the following processors:
   *  Devices with an i5 CPU and better
   *  Agora recommends that you use this feature in scenarios that meet the following conditions:
   *  A high-definition camera device is used, and the environment is uniformly lit.
   *  There are few objects in the captured video. Portraits are half-length and unobstructed. Ensure that the background is a solid color that is different from the color of the user's clothing.
   *  This method relies on the virtual background dynamic library libagora_segmentation_extension.dll. If the dynamic library is deleted, the function cannot be enabled normally.
   *
   * @param enabled Whether to enable virtual background: true : Enable virtual background. false : Disable virtual background.
   * @param backgroundSource The custom background. See VirtualBackgroundSource. To adapt the resolution of the custom background image to that of the video captured by the SDK, the SDK scales and crops the custom background image while ensuring that the content of the custom background image is not distorted.
   * @param segproperty Processing properties for background images. See SegmentationProperty.
   * @param type The type of the video source. See MediaSourceType. In this method, this parameter supports only the following two settings:
   *  The default value is PrimaryCameraSource.
   *  If you want to use the second camera to capture video, set this parameter to SecondaryCameraSource.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -4: The device capabilities do not meet the requirements for the virtual background feature. Agora recommends you try it on devices with higher performance.
   */
  abstract enableVirtualBackground(
    enabled: boolean,
    backgroundSource: VirtualBackgroundSource,
    segproperty: SegmentationProperty,
    type?: MediaSourceType
  ): number;

  /**
   * Initializes the video view of a remote user.
   *
   * This method initializes the video view of a remote stream on the local device. It affects only the video view that the local user sees. Call this method to bind the remote video stream to a video view and to set the rendering and mirror modes of the video view. You need to specify the ID of the remote user in this method. If the remote user ID is unknown to the application, set it after the app receives the onUserJoined callback. To unbind the remote user from the view, set the view parameter to NULL. Once the remote user leaves the channel, the SDK unbinds the remote user.
   *  If you use the Agora recording function, the recording client joins the channel as a placeholder client, triggering the onUserJoined callback. Do not bind the placeholder client to the app view because the placeholder client does not send any video streams. If your app does not recognize the placeholder client, bind the remote user to the view when the SDK triggers the onFirstRemoteVideoDecoded callback.
   *  If you want to stop rendering the view, set view to null and then call this method again to stop rendering and clear the rendering cache.
   *
   * @param canvas The remote video view and settings. See VideoCanvas.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setupRemoteVideo(canvas: VideoCanvas): number;

  /**
   * Initializes the local video view.
   *
   * This method initializes the video view of a local stream on the local device. It affects only the video view that the local user sees, not the published local video stream. Call this method to bind the local video stream to a video view (view) and to set the rendering and mirror modes of the video view. After initialization, call this method to set the local video and then join the channel. The local video still binds to the view after you leave the channel. To unbind the local video from the view, set the view parameter as null. In real-time interactive scenarios, if you need to simultaneously view multiple preview frames in the local video preview, and each frame is at a different observation position along the video link, you can repeatedly call this method to set different view s and set different observation positions for each view. For example, by setting the video source to the camera and then configuring two view s with position setting to PositionPostCapturerOrigin and PositionPostCapturer, you can simultaneously preview the raw, unprocessed video frame and the video frame that has undergone preprocessing (image enhancement effects, virtual background, watermark) in the local video preview.
   *  You can call this method either before or after joining a channel.
   *  If you want to stop rendering the view, set view to null and then call this method again to stop rendering and clear the rendering cache.
   *
   * @param canvas The local video view and settings. See VideoCanvas.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setupLocalVideo(canvas: VideoCanvas): number;

  /**
   * Sets video application scenarios.
   *
   * After successfully calling this method, the SDK will automatically enable the best practice strategies and adjust key performance metrics based on the specified scenario, to optimize the video experience. Ensure that you call this method before joining a channel.
   *
   * @param scenarioType The type of video application scenario. See VideoApplicationScenarioType. If set to ApplicationScenarioMeeting (1), the SDK automatically enables the following strategies:
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
   *  Bitrate: 500 Kbps
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -1: A general error occurs (no specified reason).
   *  -4: Video application scenarios are not supported. Possible reasons include that you use the Voice SDK instead of the Video SDK.
   *  -7: The IRtcEngine object has not been initialized. You need to initialize the IRtcEngine object before calling this method.
   */
  abstract setVideoScenario(scenarioType: VideoApplicationScenarioType): number;

  /**
   * Enables the audio module.
   *
   * The audio module is enabled by default After calling disableAudio to disable the audio module, you can call this method to re-enable it.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract enableAudio(): number;

  /**
   * Disables the audio module.
   *
   * The audio module is enabled by default, and you can call this method to disable the audio module.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract disableAudio(): number;

  /**
   * Sets the audio profile and audio scenario.
   *
   * @param profile The audio profile, including the sampling rate, bitrate, encoding mode, and the number of channels. See AudioProfileType.
   * @param scenario The audio scenarios. Under different audio scenarios, the device uses different volume types. See AudioScenarioType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setAudioProfile(
    profile: AudioProfileType,
    scenario?: AudioScenarioType
  ): number;

  /**
   * Sets audio scenarios.
   *
   * @param scenario The audio scenarios. Under different audio scenarios, the device uses different volume types. See AudioScenarioType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setAudioScenario(scenario: AudioScenarioType): number;

  /**
   * Enables or disables the local audio capture.
   *
   * The audio function is enabled by default when users joining a channel. This method disables or re-enables the local audio function to stop or restart local audio capturing. The difference between this method and muteLocalAudioStream are as follows: enableLocalAudio : Disables or re-enables the local audio capturing and processing. If you disable or re-enable local audio capturing using the enableLocalAudio method, the local user might hear a pause in the remote audio playback. muteLocalAudioStream : Sends or stops sending the local audio streams without affecting the audio capture status.
   *
   * @param enabled true : (Default) Re-enable the local audio function, that is, to start the local audio capturing device (for example, the microphone). false : Disable the local audio function, that is, to stop local audio capturing.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract enableLocalAudio(enabled: boolean): number;

  /**
   * Stops or resumes publishing the local audio stream.
   *
   * This method is used to control whether to publish the locally captured audio stream. If you call this method to stop publishing locally captured audio streams, the audio capturing device will still work and won't be affected.
   *
   * @param mute Whether to stop publishing the local audio stream: true : Stops publishing the local audio stream. false : (Default) Resumes publishing the local audio stream.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract muteLocalAudioStream(mute: boolean): number;

  /**
   * Stops or resumes subscribing to the audio streams of all remote users.
   *
   * After successfully calling this method, the local user stops or resumes subscribing to the audio streams of all remote users, including all subsequent users. By default, the SDK subscribes to the audio streams of all remote users when joining a channel. To modify this behavior, you can set autoSubscribeAudio to false when calling joinChannel to join the channel, which will cancel the subscription to the audio streams of all users upon joining the channel.
   *
   * @param mute Whether to stop subscribing to the audio streams of all remote users: true : Stops subscribing to the audio streams of all remote users. false : (Default) Subscribes to the audio streams of all remote users by default.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract muteAllRemoteAudioStreams(mute: boolean): number;

  /**
   * @ignore
   */
  abstract setDefaultMuteAllRemoteAudioStreams(mute: boolean): number;

  /**
   * Stops or resumes subscribing to the audio stream of a specified user.
   *
   * @param uid The user ID of the specified user.
   * @param mute Whether to subscribe to the specified remote user's audio stream. true : Stop subscribing to the audio stream of the specified user. false : (Default) Subscribe to the audio stream of the specified user.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract muteRemoteAudioStream(uid: number, mute: boolean): number;

  /**
   * Stops or resumes publishing the local video stream.
   *
   * This method is used to control whether to publish the locally captured video stream. If you call this method to stop publishing locally captured video streams, the video capturing device will still work and won't be affected. Compared to enableLocalVideo (false), which can also cancel the publishing of local video stream by turning off the local video stream capture, this method responds faster.
   *
   * @param mute Whether to stop publishing the local video stream. true : Stop publishing the local video stream. false : (Default) Publish the local video stream.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract muteLocalVideoStream(mute: boolean): number;

  /**
   * Enables/Disables the local video capture.
   *
   * This method disables or re-enables the local video capture, and does not affect receiving the remote video stream. After calling enableVideo, the local video capture is enabled by default. If you call enableLocalVideo (false) to disable local video capture within the channel, it also simultaneously stops publishing the video stream within the channel. If you want to restart video catpure, you can call enableLocalVideo (true) and then call updateChannelMediaOptions to set the options parameter to publish the locally captured video stream in the channel. After the local video capturer is successfully disabled or re-enabled, the SDK triggers the onRemoteVideoStateChanged callback on the remote client.
   *  You can call this method either before or after joining a channel.
   *  This method enables the internal engine and is valid after leaving the channel.
   *
   * @param enabled Whether to enable the local video capture. true : (Default) Enable the local video capture. false : Disable the local video capture. Once the local video is disabled, the remote users cannot receive the video stream of the local user, while the local user can still receive the video streams of remote users. When set to false, this method does not require a local camera.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract enableLocalVideo(enabled: boolean): number;

  /**
   * Stops or resumes subscribing to the video streams of all remote users.
   *
   * After successfully calling this method, the local user stops or resumes subscribing to the video streams of all remote users, including all subsequent users. By default, the SDK subscribes to the video streams of all remote users when joining a channel. To modify this behavior, you can set autoSubscribeVideo to false when calling joinChannel to join the channel, which will cancel the subscription to the video streams of all users upon joining the channel.
   *
   * @param mute Whether to stop subscribing to the video streams of all remote users. true : Stop subscribing to the video streams of all remote users. false : (Default) Subscribe to the video streams of all remote users by default.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract muteAllRemoteVideoStreams(mute: boolean): number;

  /**
   * @ignore
   */
  abstract setDefaultMuteAllRemoteVideoStreams(mute: boolean): number;

  /**
   * Stops or resumes subscribing to the video stream of a specified user.
   *
   * @param uid The user ID of the specified user.
   * @param mute Whether to subscribe to the specified remote user's video stream. true : Stop subscribing to the video streams of the specified user. false : (Default) Subscribe to the video stream of the specified user.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract muteRemoteVideoStream(uid: number, mute: boolean): number;

  /**
   * Sets the video stream type to subscribe to.
   *
   * The SDK defaults to enabling low-quality video stream adaptive mode (AutoSimulcastStream) on the sending end, which means the sender does not actively send low-quality video stream. The receiver with the role of the host can initiate a low-quality video stream request by calling this method, and upon receiving the request, the sending end automatically starts sending the low-quality video stream. The SDK will dynamically adjust the size of the corresponding video stream based on the size of the video window to save bandwidth and computing resources. The default aspect ratio of the low-quality video stream is the same as that of the high-quality video stream. According to the current aspect ratio of the high-quality video stream, the system will automatically allocate the resolution, frame rate, and bitrate of the low-quality video stream.
   *  You can call this method either before or after joining a channel.
   *  If the publisher has already called setDualStreamMode and set mode to DisableSimulcastStream (never send low-quality video stream), calling this method will not take effect, you should call setDualStreamMode again on the sending end and adjust the settings.
   *  Calling this method on the receiving end of the audience role will not take effect.
   *  If you call both setRemoteVideoStreamType and setRemoteDefaultVideoStreamType, the settings in setRemoteVideoStreamType take effect.
   *
   * @param uid The user ID.
   * @param streamType The video stream type, see VideoStreamType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setRemoteVideoStreamType(
    uid: number,
    streamType: VideoStreamType
  ): number;

  /**
   * Options for subscribing to remote video streams.
   *
   * When a remote user has enabled dual-stream mode, you can call this method to choose the option for subscribing to the video streams sent by the remote user.
   *  If you only register one IVideoFrameObserver object, the SDK subscribes to the raw video data and encoded video data by default (the effect is equivalent to setting encodedFrameOnly to false).
   *  If you only register one IVideoEncodedFrameObserver object, the SDK only subscribes to the encoded video data by default (the effect is equivalent to setting encodedFrameOnly to true).
   *  If you register one IVideoFrameObserver object and one IVideoEncodedFrameObserver object successively, the SDK subscribes to the encoded video data by default (the effect is equivalent to setting encodedFrameOnly to false).
   *  If you call this method first with the options parameter set, and then register one IVideoFrameObserver or IVideoEncodedFrameObserver object, you need to call this method again and set the options parameter as described in the above two items to get the desired results. Agora recommends the following steps:
   *  Set autoSubscribeVideo to false when calling joinChannel to join a channel.
   *  Call this method after receiving the onUserJoined callback to set the subscription options for the specified remote user's video stream.
   *  Call the muteRemoteVideoStream method to resume subscribing to the video stream of the specified remote user. If you set encodedFrameOnly to true in the previous step, the SDK triggers the onEncodedVideoFrameReceived callback locally to report the received encoded video frame information.
   *
   * @param uid The user ID of the remote user.
   * @param options The video subscription options. See VideoSubscriptionOptions.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setRemoteVideoSubscriptionOptions(
    uid: number,
    options: VideoSubscriptionOptions
  ): number;

  /**
   * Sets the default video stream type to subscribe to.
   *
   * The SDK will dynamically adjust the size of the corresponding video stream based on the size of the video window to save bandwidth and computing resources. The default aspect ratio of the low-quality video stream is the same as that of the high-quality video stream. According to the current aspect ratio of the high-quality video stream, the system will automatically allocate the resolution, frame rate, and bitrate of the low-quality video stream. The SDK defaults to enabling low-quality video stream adaptive mode (AutoSimulcastStream) on the sending end, which means the sender does not actively send low-quality video stream. The receiver with the role of the host can initiate a low-quality video stream request by calling this method, and upon receiving the request, the sending end automatically starts sending the low-quality video stream.
   *  Call this method before joining a channel. The SDK does not support changing the default subscribed video stream type after joining a channel.
   *  If you call both this method and setRemoteVideoStreamType, the setting of setRemoteVideoStreamType takes effect.
   *
   * @param streamType The default video-stream type. See VideoStreamType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setRemoteDefaultVideoStreamType(streamType: VideoStreamType): number;

  /**
   * Set the blocklist of subscriptions for audio streams.
   *
   * You can call this method to specify the audio streams of a user that you do not want to subscribe to.
   *  You can call this method either before or after joining a channel.
   *  The blocklist is not affected by the setting in muteRemoteAudioStream, muteAllRemoteAudioStreams, and autoSubscribeAudio in ChannelMediaOptions.
   *  Once the blocklist of subscriptions is set, it is effective even if you leave the current channel and rejoin the channel.
   *  If a user is added in the allowlist and blocklist at the same time, only the blocklist takes effect.
   *
   * @param uidList The user ID list of users that you do not want to subscribe to. If you want to specify the audio streams of a user that you do not want to subscribe to, add the user ID in this list. If you want to remove a user from the blocklist, you need to call the setSubscribeAudioBlocklist method to update the user ID list; this means you only add the uid of users that you do not want to subscribe to in the new user ID list.
   * @param uidNumber The number of users in the user ID list.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setSubscribeAudioBlocklist(
    uidList: number[],
    uidNumber: number
  ): number;

  /**
   * Sets the allowlist of subscriptions for audio streams.
   *
   * You can call this method to specify the audio streams of a user that you want to subscribe to.
   *  If a user is added in the allowlist and blocklist at the same time, only the blocklist takes effect.
   *  You can call this method either before or after joining a channel.
   *  The allowlist is not affected by the setting in muteRemoteAudioStream, muteAllRemoteAudioStreams and autoSubscribeAudio in ChannelMediaOptions.
   *  Once the allowlist of subscriptions is set, it is effective even if you leave the current channel and rejoin the channel.
   *
   * @param uidList The user ID list of users that you want to subscribe to. If you want to specify the audio streams of a user for subscription, add the user ID in this list. If you want to remove a user from the allowlist, you need to call the setSubscribeAudioAllowlist method to update the user ID list; this means you only add the uid of users that you want to subscribe to in the new user ID list.
   * @param uidNumber The number of users in the user ID list.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setSubscribeAudioAllowlist(
    uidList: number[],
    uidNumber: number
  ): number;

  /**
   * Set the blocklist of subscriptions for video streams.
   *
   * You can call this method to specify the video streams of a user that you do not want to subscribe to.
   *  If a user is added in the allowlist and blocklist at the same time, only the blocklist takes effect.
   *  Once the blocklist of subscriptions is set, it is effective even if you leave the current channel and rejoin the channel.
   *  You can call this method either before or after joining a channel.
   *  The blocklist is not affected by the setting in muteRemoteVideoStream, muteAllRemoteVideoStreams and autoSubscribeAudio in ChannelMediaOptions.
   *
   * @param uidList The user ID list of users that you do not want to subscribe to. If you want to specify the video streams of a user that you do not want to subscribe to, add the user ID of that user in this list. If you want to remove a user from the blocklist, you need to call the setSubscribeVideoBlocklist method to update the user ID list; this means you only add the uid of users that you do not want to subscribe to in the new user ID list.
   * @param uidNumber The number of users in the user ID list.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setSubscribeVideoBlocklist(
    uidList: number[],
    uidNumber: number
  ): number;

  /**
   * Set the allowlist of subscriptions for video streams.
   *
   * You can call this method to specify the video streams of a user that you want to subscribe to.
   *  If a user is added in the allowlist and blocklist at the same time, only the blocklist takes effect.
   *  Once the allowlist of subscriptions is set, it is effective even if you leave the current channel and rejoin the channel.
   *  You can call this method either before or after joining a channel.
   *  The allowlist is not affected by the setting in muteRemoteVideoStream, muteAllRemoteVideoStreams and autoSubscribeAudio in ChannelMediaOptions.
   *
   * @param uidList The user ID list of users that you want to subscribe to. If you want to specify the video streams of a user for subscription, add the user ID of that user in this list. If you want to remove a user from the allowlist, you need to call the setSubscribeVideoAllowlist method to update the user ID list; this means you only add the uid of users that you want to subscribe to in the new user ID list.
   * @param uidNumber The number of users in the user ID list.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setSubscribeVideoAllowlist(
    uidList: number[],
    uidNumber: number
  ): number;

  /**
   * Enables the reporting of users' volume indication.
   *
   * This method enables the SDK to regularly report the volume information to the app of the local user who sends a stream and remote users (three users at most) whose instantaneous volumes are the highest.
   *
   * @param interval Sets the time interval between two consecutive volume indications:
   *  ≤ 0: Disables the volume indication.
   *  > 0: Time interval (ms) between two consecutive volume indications. Ensure this parameter is set to a value greater than 10, otherwise you will not receive the onAudioVolumeIndication callback. Agora recommends that this value is set as greater than 100.
   * @param smooth The smoothing factor that sets the sensitivity of the audio volume indicator. The value ranges between 0 and 10. The recommended value is 3. The greater the value, the more sensitive the indicator.
   * @param reportVad true : Enables the voice activity detection of the local user. Once it is enabled, the vad parameter of the onAudioVolumeIndication callback reports the voice activity status of the local user. false : (Default) Disables the voice activity detection of the local user. Once it is disabled, the vad parameter of the onAudioVolumeIndication callback does not report the voice activity status of the local user, except for the scenario where the engine automatically detects the voice activity of the local user.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract enableAudioVolumeIndication(
    interval: number,
    smooth: number,
    reportVad: boolean
  ): number;

  /**
   * Starts audio recording on the client and sets recording configurations.
   *
   * The Agora SDK allows recording during a call. After successfully calling this method, you can record the audio of users in the channel and get an audio recording file. Supported formats of the recording file are as follows:
   *  WAV: High-fidelity files with typically larger file sizes. For example, if the sample rate is 32,000 Hz, the file size for 10-minute recording is approximately 73 MB.
   *  AAC: Low-fidelity files with typically smaller file sizes. For example, if the sample rate is 32,000 Hz and the recording quality is AudioRecordingQualityMedium, the file size for 10-minute recording is approximately 2 MB. Once the user leaves the channel, the recording automatically stops. Call this method after joining a channel.
   *
   * @param config Recording configurations. See AudioRecordingConfiguration.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract startAudioRecording(config: AudioRecordingConfiguration): number;

  /**
   * Registers an encoded audio observer.
   *
   * Call this method after joining a channel.
   *  You can call this method or startAudioRecording to set the recording type and quality of audio files, but Agora does not recommend using this method and startAudioRecording at the same time. Only the method called later will take effect.
   *
   * @returns
   * One IAudioEncodedFrameObserver object.
   */
  abstract registerAudioEncodedFrameObserver(
    config: AudioEncodedFrameObserverConfig,
    observer: IAudioEncodedFrameObserver
  ): number;

  /**
   * Stops the audio recording on the client.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract stopAudioRecording(): number;

  /**
   * Creates a media player instance.
   *
   * @returns
   * The IMediaPlayer instance, if the method call succeeds.
   *  An empty pointer, if the method call fails.
   */
  abstract createMediaPlayer(): IMediaPlayer;

  /**
   * Destroys the media player instance.
   *
   * @param mediaPlayer One IMediaPlayer object.
   *
   * @returns
   * ≥ 0: Success. Returns the ID of media player instance.
   *  < 0: Failure.
   */
  abstract destroyMediaPlayer(mediaPlayer: IMediaPlayer): number;

  /**
   * @ignore
   */
  abstract createMediaRecorder(info: RecorderStreamInfo): IMediaRecorder;

  /**
   * @ignore
   */
  abstract destroyMediaRecorder(mediaRecorder: IMediaRecorder): number;

  /**
   * Starts playing the music file.
   *
   * This method mixes the specified local or online audio file with the audio from the microphone, or replaces the microphone's audio with the specified local or remote audio file. A successful method call triggers the onAudioMixingStateChanged (AudioMixingStatePlaying) callback. When the audio mixing file playback finishes, the SDK triggers the onAudioMixingStateChanged (AudioMixingStateStopped) callback on the local client.
   *  You can call this method either before or after joining a channel. If you need to call startAudioMixing multiple times, ensure that the time interval between calling this method is more than 500 ms.
   *  If the local music file does not exist, the SDK does not support the file format, or the the SDK cannot access the music file URL, the SDK reports 701.
   *  For the audio file formats supported by this method, see What formats of audio files does the Agora RTC SDK support.
   *
   * @param filePath File path:
   *  Windows: The absolute path or URL address (including the suffixes of the filename) of the audio effect file. For example : C:\music\audio.mp4.
   *  macOS: The absolute path or URL address (including the suffixes of the filename) of the audio effect file. For example: /var/mobile/Containers/Data/audio.mp4.
   * @param loopback Whether to only play music files on the local client: true : Only play music files on the local client so that only the local user can hear the music. false : Publish music files to remote clients so that both the local user and remote users can hear the music.
   * @param cycle The number of times the music file plays.
   *  ≥ 0: The number of playback times. For example, 0 means that the SDK does not play the music file while 1 means that the SDK plays once.
   *  -1: Play the audio file in an infinite loop.
   * @param startPos The playback position (ms) of the music file.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -1: A general error occurs (no specified reason).
   *  -2: The parameter is invalid.
   *  -3: The SDK is not ready.
   *  The audio module is disabled.
   *  The program is not complete.
   *  The initialization of IRtcEngine fails. Reinitialize the IRtcEngine.
   */
  abstract startAudioMixing(
    filePath: string,
    loopback: boolean,
    cycle: number,
    startPos?: number
  ): number;

  /**
   * Stops playing and mixing the music file.
   *
   * This method stops the audio mixing. Call this method when you are in a channel.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract stopAudioMixing(): number;

  /**
   * Pauses playing and mixing the music file.
   *
   * Call this method after joining a channel.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract pauseAudioMixing(): number;

  /**
   * Resumes playing and mixing the music file.
   *
   * This method resumes playing and mixing the music file. Call this method when you are in a channel.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract resumeAudioMixing(): number;

  /**
   * Selects the audio track used during playback.
   *
   * After getting the track index of the audio file, you can call this method to specify any track to play. For example, if different tracks of a multi-track file store songs in different languages, you can call this method to set the playback language.
   *  For the supported formats of audio files, see.
   *  You need to call this method after calling startAudioMixing and receiving the onAudioMixingStateChanged (AudioMixingStatePlaying) callback.
   *
   * @param index The audio track you want to specify. The value range is [0, getAudioTrackCount ()].
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract selectAudioTrack(index: number): number;

  /**
   * Gets the index of audio tracks of the current music file.
   *
   * You need to call this method after calling startAudioMixing and receiving the onAudioMixingStateChanged (AudioMixingStatePlaying) callback.
   *
   * @returns
   * The SDK returns the index of the audio tracks if the method call succeeds.
   *  < 0: Failure.
   */
  abstract getAudioTrackCount(): number;

  /**
   * Adjusts the volume during audio mixing.
   *
   * This method adjusts the audio mixing volume on both the local client and remote clients.
   *  Call this method after startAudioMixing.
   *
   * @param volume Audio mixing volume. The value ranges between 0 and 100. The default value is 100, which means the original volume.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract adjustAudioMixingVolume(volume: number): number;

  /**
   * Adjusts the volume of audio mixing for publishing.
   *
   * This method adjusts the volume of audio mixing for publishing (sending to other users). Call this method after calling startAudioMixing and receiving the onAudioMixingStateChanged (AudioMixingStatePlaying) callback.
   *
   * @param volume The volume of audio mixing for local playback. The value ranges between 0 and 100 (default). 100 represents the original volume.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract adjustAudioMixingPublishVolume(volume: number): number;

  /**
   * Retrieves the audio mixing volume for publishing.
   *
   * This method helps troubleshoot audio volume‑related issues. You need to call this method after calling startAudioMixing and receiving the onAudioMixingStateChanged (AudioMixingStatePlaying) callback.
   *
   * @returns
   * ≥ 0: The audio mixing volume, if this method call succeeds. The value range is [0,100].
   *  < 0: Failure.
   */
  abstract getAudioMixingPublishVolume(): number;

  /**
   * Adjusts the volume of audio mixing for local playback.
   *
   * Call this method after calling startAudioMixing and receiving the onAudioMixingStateChanged (AudioMixingStatePlaying) callback.
   *
   * @param volume The volume of audio mixing for local playback. The value ranges between 0 and 100 (default). 100 represents the original volume.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract adjustAudioMixingPlayoutVolume(volume: number): number;

  /**
   * Retrieves the audio mixing volume for local playback.
   *
   * This method helps troubleshoot audio volume‑related issues. You need to call this method after calling startAudioMixing and receiving the onAudioMixingStateChanged (AudioMixingStatePlaying) callback.
   *
   * @returns
   * ≥ 0: The audio mixing volume, if this method call succeeds. The value range is [0,100].
   *  < 0: Failure.
   */
  abstract getAudioMixingPlayoutVolume(): number;

  /**
   * Retrieves the duration (ms) of the music file.
   *
   * Retrieves the total duration (ms) of the audio. You need to call this method after calling startAudioMixing and receiving the onAudioMixingStateChanged (AudioMixingStatePlaying) callback.
   *
   * @returns
   * ≥ 0: The audio mixing duration, if this method call succeeds.
   *  < 0: Failure.
   */
  abstract getAudioMixingDuration(): number;

  /**
   * Retrieves the playback position (ms) of the music file.
   *
   * Retrieves the playback position (ms) of the audio. You need to call this method after calling startAudioMixing and receiving the onAudioMixingStateChanged (AudioMixingStatePlaying) callback.
   *  If you need to call getAudioMixingCurrentPosition multiple times, ensure that the time interval between calling this method is more than 500 ms.
   *
   * @returns
   * ≥ 0: The current playback position (ms) of the audio mixing, if this method call succeeds. 0 represents that the current music file does not start playing.
   *  < 0: Failure.
   */
  abstract getAudioMixingCurrentPosition(): number;

  /**
   * Sets the audio mixing position.
   *
   * Call this method to set the playback position of the music file to a different starting position (the default plays from the beginning). You need to call this method after calling startAudioMixing and receiving the onAudioMixingStateChanged (AudioMixingStatePlaying) callback.
   *
   * @param pos Integer. The playback position (ms).
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setAudioMixingPosition(pos: number): number;

  /**
   * Sets the channel mode of the current audio file.
   *
   * In a stereo music file, the left and right channels can store different audio data. According to your needs, you can set the channel mode to original mode, left channel mode, right channel mode, or mixed channel mode. For example, in the KTV scenario, the left channel of the music file stores the musical accompaniment, and the right channel stores the singing voice. If you only need to listen to the accompaniment, call this method to set the channel mode of the music file to left channel mode; if you need to listen to the accompaniment and the singing voice at the same time, call this method to set the channel mode to mixed channel mode.
   *  You need to call this method after calling startAudioMixing and receiving the onAudioMixingStateChanged (AudioMixingStatePlaying) callback.
   *  This method only applies to stereo audio files.
   *
   * @param mode The channel mode. See AudioMixingDualMonoMode.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setAudioMixingDualMonoMode(mode: AudioMixingDualMonoMode): number;

  /**
   * Sets the pitch of the local music file.
   *
   * When a local music file is mixed with a local human voice, call this method to set the pitch of the local music file only. You need to call this method after calling startAudioMixing and receiving the onAudioMixingStateChanged (AudioMixingStatePlaying) callback.
   *
   * @param pitch Sets the pitch of the local music file by the chromatic scale. The default value is 0, which means keeping the original pitch. The value ranges from -12 to 12, and the pitch value between consecutive values is a chromatic value. The greater the absolute value of this parameter, the higher or lower the pitch of the local music file.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setAudioMixingPitch(pitch: number): number;

  /**
   * Retrieves the volume of the audio effects.
   *
   * The volume is an integer ranging from 0 to 100. The default value is 100, which means the original volume. Call this method after playEffect.
   *
   * @returns
   * Volume of the audio effects, if this method call succeeds.
   *  < 0: Failure.
   */
  abstract getEffectsVolume(): number;

  /**
   * Sets the volume of the audio effects.
   *
   * Call this method after playEffect.
   *
   * @param volume The playback volume. The value range is [0, 100]. The default value is 100, which represents the original volume.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setEffectsVolume(volume: number): number;

  /**
   * Preloads a specified audio effect file into the memory.
   *
   * To ensure smooth communication, It is recommended that you limit the size of the audio effect file. You can call this method to preload the audio effect before calling joinChannel. For the audio file formats supported by this method, see What formats of audio files does the Agora RTC SDK support.
   *
   * @param soundId The audio effect ID. The ID of each audio effect file is unique.
   * @param filePath File path:
   *  Windows: The absolute path or URL address (including the suffixes of the filename) of the audio effect file. For example : C:\music\audio.mp4.
   *  macOS: The absolute path or URL address (including the suffixes of the filename) of the audio effect file. For example: /var/mobile/Containers/Data/audio.mp4.
   * @param startPos The playback position (ms) of the audio effect file.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract preloadEffect(
    soundId: number,
    filePath: string,
    startPos?: number
  ): number;

  /**
   * Plays the specified local or online audio effect file.
   *
   * If you use this method to play an online audio effect file, Agora recommends that you cache the online audio effect file to your local device, call preloadEffect to preload the cached audio effect file into memory, and then call this method to play the audio effect. Otherwise, you might encounter playback failures or no sound during playback due to loading timeouts or failures. To play multiple audio effect files at the same time, call this method multiple times with different soundId and filePath. To achieve the optimal user experience, Agora recommends that do not playing more than three audio files at the same time. After the playback of an audio effect file completes, the SDK triggers the onAudioEffectFinished callback.
   *
   * @param soundId The audio effect ID. The ID of each audio effect file is unique. If you have preloaded an audio effect into memory by calling preloadEffect, ensure that the value of this parameter is the same as that of soundId in preloadEffect.
   * @param filePath The absolute path or URL address (including the suffixes of the filename) of the audio effect file. For example, C:\music\audio.mp4. Supported audio formats include MP3, AAC, M4A, MP4, WAV, and 3GP. See supported audio formats. If you have preloaded an audio effect into memory by calling preloadEffect, ensure that the value of this parameter is the same as that of filePath in preloadEffect.
   * @param loopCount The number of times the audio effect loops.
   *  ≥ 0: The number of playback times. For example, 1 means looping one time, which means playing the audio effect two times in total.
   *  -1: Play the audio file in an infinite loop.
   * @param pitch The pitch of the audio effect. The value range is 0.5 to 2.0. The default value is 1.0, which means the original pitch. The lower the value, the lower the pitch.
   * @param pan The spatial position of the audio effect. The value ranges between -1.0 and 1.0:
   *  -1.0: The audio effect is heard on the left of the user.
   *  0.0: The audio effect is heard in front of the user.
   *  1.0: The audio effect is heard on the right of the user.
   * @param gain The volume of the audio effect. The value range is 0.0 to 100.0. The default value is 100.0, which means the original volume. The smaller the value, the lower the volume.
   * @param publish Whether to publish the audio effect to the remote users: true : Publish the audio effect to the remote users. Both the local user and remote users can hear the audio effect. false : Do not publish the audio effect to the remote users. Only the local user can hear the audio effect.
   * @param startPos The playback position (ms) of the audio effect file.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract playEffect(
    soundId: number,
    filePath: string,
    loopCount: number,
    pitch: number,
    pan: number,
    gain: number,
    publish?: boolean,
    startPos?: number
  ): number;

  /**
   * Plays all audio effect files.
   *
   * After calling preloadEffect multiple times to preload multiple audio effects into the memory, you can call this method to play all the specified audio effects for all users in the channel.
   *
   * @param loopCount The number of times the audio effect loops:
   *  -1: Play the audio effect files in an indefinite loop until you call stopEffect or stopAllEffects.
   *  0: Play the audio effect once.
   *  1: Play the audio effect twice.
   * @param pitch The pitch of the audio effect. The value ranges between 0.5 and 2.0. The default value is 1.0 (original pitch). The lower the value, the lower the pitch.
   * @param pan The spatial position of the audio effect. The value ranges between -1.0 and 1.0:
   *  -1.0: The audio effect shows on the left.
   *  0: The audio effect shows ahead.
   *  1.0: The audio effect shows on the right.
   * @param gain The volume of the audio effect. The value range is [0, 100]. The default value is 100 (original volume). The smaller the value, the lower the volume.
   * @param publish Whether to publish the audio effect to the remote users: true : Publish the audio effect to the remote users. Both the local user and remote users can hear the audio effect. false : (Default) Do not publish the audio effect to the remote users. Only the local user can hear the audio effect.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract playAllEffects(
    loopCount: number,
    pitch: number,
    pan: number,
    gain: number,
    publish?: boolean
  ): number;

  /**
   * Gets the volume of a specified audio effect file.
   *
   * @param soundId The ID of the audio effect file.
   *
   * @returns
   * ≥ 0: Returns the volume of the specified audio effect, if the method call is successful. The value ranges between 0 and 100. 100 represents the original volume.
   *  < 0: Failure.
   */
  abstract getVolumeOfEffect(soundId: number): number;

  /**
   * Sets the volume of a specified audio effect.
   *
   * @param soundId The ID of the audio effect. The ID of each audio effect file is unique.
   * @param volume The playback volume. The value range is [0, 100]. The default value is 100, which represents the original volume.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setVolumeOfEffect(soundId: number, volume: number): number;

  /**
   * Pauses a specified audio effect file.
   *
   * @param soundId The audio effect ID. The ID of each audio effect file is unique.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract pauseEffect(soundId: number): number;

  /**
   * Pauses all audio effects.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract pauseAllEffects(): number;

  /**
   * Resumes playing a specified audio effect.
   *
   * @param soundId The audio effect ID. The ID of each audio effect file is unique.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract resumeEffect(soundId: number): number;

  /**
   * Resumes playing all audio effect files.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract resumeAllEffects(): number;

  /**
   * Stops playing a specified audio effect.
   *
   * @param soundId The ID of the audio effect. Each audio effect has a unique ID.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract stopEffect(soundId: number): number;

  /**
   * Stops playing all audio effects.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract stopAllEffects(): number;

  /**
   * Releases a specified preloaded audio effect from the memory.
   *
   * @param soundId The ID of the audio effect. Each audio effect has a unique ID.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract unloadEffect(soundId: number): number;

  /**
   * Releases a specified preloaded audio effect from the memory.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract unloadAllEffects(): number;

  /**
   * Retrieves the duration of the audio effect file.
   *
   * Call this method after joining a channel.
   *
   * @param filePath File path:
   *  Windows: The absolute path or URL address (including the suffixes of the filename) of the audio effect file. For example : C:\music\audio.mp4.
   *  macOS: The absolute path or URL address (including the suffixes of the filename) of the audio effect file. For example: /var/mobile/Containers/Data/audio.mp4.
   *
   * @returns
   * The total duration (ms) of the specified audio effect file, if the method call succeeds.
   *  < 0: Failure.
   */
  abstract getEffectDuration(filePath: string): number;

  /**
   * Sets the playback position of an audio effect file.
   *
   * After a successful setting, the local audio effect file starts playing at the specified position. Call this method after playEffect.
   *
   * @param soundId The audio effect ID. The ID of each audio effect file is unique.
   * @param pos The playback position (ms) of the audio effect file.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setEffectPosition(soundId: number, pos: number): number;

  /**
   * Retrieves the playback position of the audio effect file.
   *
   * Call this method after playEffect.
   *
   * @param soundId The audio effect ID. The ID of each audio effect file is unique.
   *
   * @returns
   * The playback position (ms) of the specified audio effect file, if the method call succeeds.
   *  < 0: Failure.
   */
  abstract getEffectCurrentPosition(soundId: number): number;

  /**
   * Enables or disables stereo panning for remote users.
   *
   * Ensure that you call this method before joining a channel to enable stereo panning for remote users so that the local user can track the position of a remote user by calling setRemoteVoicePosition.
   *
   * @param enabled Whether to enable stereo panning for remote users: true : Enable stereo panning. false : Disable stereo panning.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract enableSoundPositionIndication(enabled: boolean): number;

  /**
   * Sets the 2D position (the position on the horizontal plane) of the remote user's voice.
   *
   * This method sets the 2D position and volume of a remote user, so that the local user can easily hear and identify the remote user's position. When the local user calls this method to set the voice position of a remote user, the voice difference between the left and right channels allows the local user to track the real-time position of the remote user, creating a sense of space. This method applies to massive multiplayer online games, such as Battle Royale games.
   *  For this method to work, enable stereo panning for remote users by calling the enableSoundPositionIndication method before joining a channel.
   *  For the best voice positioning, Agora recommends using a wired headset.
   *  Call this method after joining a channel.
   *
   * @param uid The user ID of the remote user.
   * @param pan The voice position of the remote user. The value ranges from -1.0 to 1.0:
   *  0.0: (Default) The remote voice comes from the front.
   *  -1.0: The remote voice comes from the left.
   *  1.0: The remote voice comes from the right.
   * @param gain The volume of the remote user. The value ranges from 0.0 to 100.0. The default value is 100.0 (the original volume of the remote user). The smaller the value, the lower the volume.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setRemoteVoicePosition(
    uid: number,
    pan: number,
    gain: number
  ): number;

  /**
   * Enables or disables the spatial audio effect.
   *
   * After enabling the spatial audio effect, you can call setRemoteUserSpatialAudioParams to set the spatial audio effect parameters of the remote user.
   *  You can call this method either before or after joining a channel.
   *  This method relies on the spatial audio dynamic library libagora_spatial_audio_extension.dll. If the dynamic library is deleted, the function cannot be enabled normally.
   *
   * @param enabled Whether to enable the spatial audio effect: true : Enable the spatial audio effect. false : Disable the spatial audio effect.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract enableSpatialAudio(enabled: boolean): number;

  /**
   * Sets the spatial audio effect parameters of the remote user.
   *
   * Call this method after enableSpatialAudio. After successfully setting the spatial audio effect parameters of the remote user, the local user can hear the remote user with a sense of space.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setRemoteUserSpatialAudioParams(
    uid: number,
    params: SpatialAudioParams
  ): number;

  /**
   * Sets a preset voice beautifier effect.
   *
   * Call this method to set a preset voice beautifier effect for the local user who sends an audio stream. After setting a voice beautifier effect, all users in the channel can hear the effect. You can set different voice beautifier effects for different scenarios. To achieve better vocal effects, it is recommended that you call the following APIs before calling this method:
   *  Call setAudioScenario to set the audio scenario to high-quality audio scenario, namely AudioScenarioGameStreaming (3).
   *  Call setAudioProfile to set the profile parameter to AudioProfileMusicHighQuality (4) or AudioProfileMusicHighQualityStereo (5).
   *  You can call this method either before or after joining a channel.
   *  Do not set the profile parameter in setAudioProfile to AudioProfileSpeechStandard (1) or AudioProfileIot (6), or the method does not take effect.
   *  This method has the best effect on human voice processing, and Agora does not recommend calling this method to process audio data containing music.
   *  After calling setVoiceBeautifierPreset, Agora does not recommend calling the following methods, otherwise the effect set by setVoiceBeautifierPreset will be overwritten: setAudioEffectPreset setAudioEffectParameters setLocalVoicePitch setLocalVoiceEqualization setLocalVoiceReverb setVoiceBeautifierParameters setVoiceConversionPreset
   *  This method relies on the voice beautifier dynamic library libagora_audio_beauty_extension.dll. If the dynamic library is deleted, the function cannot be enabled normally.
   *
   * @param preset The preset voice beautifier effect options: VoiceBeautifierPreset.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setVoiceBeautifierPreset(preset: VoiceBeautifierPreset): number;

  /**
   * Sets an SDK preset audio effect.
   *
   * To achieve better vocal effects, it is recommended that you call the following APIs before calling this method:
   *  Call setAudioScenario to set the audio scenario to high-quality audio scenario, namely AudioScenarioGameStreaming (3).
   *  Call setAudioProfile to set the profile parameter to AudioProfileMusicHighQuality (4) or AudioProfileMusicHighQualityStereo (5). Call this method to set an SDK preset audio effect for the local user who sends an audio stream. This audio effect does not change the gender characteristics of the original voice. After setting an audio effect, all users in the channel can hear the effect.
   *  Do not set the profile parameter in setAudioProfile to AudioProfileSpeechStandard (1) or AudioProfileIot (6), or the method does not take effect.
   *  You can call this method either before or after joining a channel.
   *  If you call setAudioEffectPreset and set enumerators except for RoomAcoustics3dVoice or PitchCorrection, do not call setAudioEffectParameters; otherwise, setAudioEffectPreset is overridden.
   *  After calling setAudioEffectPreset, Agora does not recommend you to call the following methods, otherwise the effect set by setAudioEffectPreset will be overwritten: setVoiceBeautifierPreset setLocalVoicePitch setLocalVoiceEqualization setLocalVoiceReverb setVoiceBeautifierParameters setVoiceConversionPreset
   *  This method relies on the voice beautifier dynamic library libagora_audio_beauty_extension.dll. If the dynamic library is deleted, the function cannot be enabled normally.
   *
   * @param preset The options for SDK preset audio effects. See AudioEffectPreset.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setAudioEffectPreset(preset: AudioEffectPreset): number;

  /**
   * Sets a preset voice beautifier effect.
   *
   * To achieve better vocal effects, it is recommended that you call the following APIs before calling this method:
   *  Call setAudioScenario to set the audio scenario to high-quality audio scenario, namely AudioScenarioGameStreaming (3).
   *  Call setAudioProfile to set the profile parameter to AudioProfileMusicHighQuality (4) or AudioProfileMusicHighQualityStereo (5). Call this method to set a preset voice beautifier effect for the local user who sends an audio stream. After setting an audio effect, all users in the channel can hear the effect. You can set different voice beautifier effects for different scenarios.
   *  Do not set the profile parameter in setAudioProfile to AudioProfileSpeechStandard (1) or AudioProfileIot (6), or the method does not take effect.
   *  You can call this method either before or after joining a channel.
   *  This method has the best effect on human voice processing, and Agora does not recommend calling this method to process audio data containing music.
   *  After calling setVoiceConversionPreset, Agora does not recommend you to call the following methods, otherwise the effect set by setVoiceConversionPreset will be overwritten: setAudioEffectPreset setAudioEffectParameters setVoiceBeautifierPreset setVoiceBeautifierParameters setLocalVoicePitch setLocalVoiceFormant setLocalVoiceEqualization setLocalVoiceReverb
   *  This method relies on the voice beautifier dynamic library libagora_audio_beauty_extension.dll. If the dynamic library is deleted, the function cannot be enabled normally.
   *
   * @param preset The options for the preset voice beautifier effects: VoiceConversionPreset.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setVoiceConversionPreset(preset: VoiceConversionPreset): number;

  /**
   * Sets parameters for SDK preset audio effects.
   *
   * To achieve better vocal effects, it is recommended that you call the following APIs before calling this method:
   *  Call setAudioScenario to set the audio scenario to high-quality audio scenario, namely AudioScenarioGameStreaming (3).
   *  Call setAudioProfile to set the profile parameter to AudioProfileMusicHighQuality (4) or AudioProfileMusicHighQualityStereo (5). Call this method to set the following parameters for the local user who sends an audio stream:
   *  3D voice effect: Sets the cycle period of the 3D voice effect.
   *  Pitch correction effect: Sets the basic mode and tonic pitch of the pitch correction effect. Different songs have different modes and tonic pitches. Agora recommends bounding this method with interface elements to enable users to adjust the pitch correction interactively. After setting the audio parameters, all users in the channel can hear the effect.
   *  Do not set the profile parameter in setAudioProfile to AudioProfileSpeechStandard (1) or AudioProfileIot (6), or the method does not take effect.
   *  You can call this method either before or after joining a channel.
   *  This method has the best effect on human voice processing, and Agora does not recommend calling this method to process audio data containing music.
   *  After calling setAudioEffectParameters, Agora does not recommend you to call the following methods, otherwise the effect set by setAudioEffectParameters will be overwritten: setAudioEffectPreset setVoiceBeautifierPreset setLocalVoicePitch setLocalVoiceEqualization setLocalVoiceReverb setVoiceBeautifierParameters setVoiceConversionPreset
   *
   * @param preset The options for SDK preset audio effects: RoomAcoustics3dVoice, 3D voice effect:
   *  You need to set the profile parameter in setAudioProfile to AudioProfileMusicStandardStereo (3) or AudioProfileMusicHighQualityStereo (5) before setting this enumerator; otherwise, the enumerator setting does not take effect.
   *  If the 3D voice effect is enabled, users need to use stereo audio playback devices to hear the anticipated voice effect. PitchCorrection, Pitch correction effect:
   * @param param1 If you set preset to RoomAcoustics3dVoice, param1 sets the cycle period of the 3D voice effect. The value range is [1,60] and the unit is seconds. The default value is 10, indicating that the voice moves around you every 10 seconds.
   *  If you set preset to PitchCorrection, param1 indicates the basic mode of the pitch correction effect: 1 : (Default) Natural major scale. 2 : Natural minor scale. 3 : Japanese pentatonic scale.
   * @param param2 If you set preset to RoomAcoustics3dVoice , you need to set param2 to 0.
   *  If you set preset to PitchCorrection, param2 indicates the tonic pitch of the pitch correction effect: 1 : A 2 : A# 3 : B 4 : (Default) C 5 : C# 6 : D 7 : D# 8 : E 9 : F 10 : F# 11 : G 12 : G#
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setAudioEffectParameters(
    preset: AudioEffectPreset,
    param1: number,
    param2: number
  ): number;

  /**
   * Sets parameters for the preset voice beautifier effects.
   *
   * To achieve better vocal effects, it is recommended that you call the following APIs before calling this method:
   *  Call setAudioScenario to set the audio scenario to high-quality audio scenario, namely AudioScenarioGameStreaming (3).
   *  Call setAudioProfile to set the profile parameter to AudioProfileMusicHighQuality (4) or AudioProfileMusicHighQualityStereo (5). Call this method to set a gender characteristic and a reverberation effect for the singing beautifier effect. This method sets parameters for the local user who sends an audio stream. After setting the audio parameters, all users in the channel can hear the effect.
   *  Do not set the profile parameter in setAudioProfile to AudioProfileSpeechStandard (1) or AudioProfileIot (6), or the method does not take effect.
   *  You can call this method either before or after joining a channel.
   *  This method has the best effect on human voice processing, and Agora does not recommend calling this method to process audio data containing music.
   *  After calling setVoiceBeautifierParameters, Agora does not recommend calling the following methods, otherwise the effect set by setVoiceBeautifierParameters will be overwritten: setAudioEffectPreset setAudioEffectParameters setVoiceBeautifierPreset setLocalVoicePitch setLocalVoiceEqualization setLocalVoiceReverb setVoiceConversionPreset
   *
   * @param preset The option for the preset audio effect: SINGING_BEAUTIFIER : The singing beautifier effect.
   * @param param1 The gender characteristics options for the singing voice: 1 : A male-sounding voice. 2 : A female-sounding voice.
   * @param param2 The reverberation effect options for the singing voice: 1 : The reverberation effect sounds like singing in a small room. 2 : The reverberation effect sounds like singing in a large room. 3 : The reverberation effect sounds like singing in a hall.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setVoiceBeautifierParameters(
    preset: VoiceBeautifierPreset,
    param1: number,
    param2: number
  ): number;

  /**
   * @ignore
   */
  abstract setVoiceConversionParameters(
    preset: VoiceConversionPreset,
    param1: number,
    param2: number
  ): number;

  /**
   * Changes the voice pitch of the local speaker.
   *
   * You can call this method either before or after joining a channel.
   *
   * @param pitch The local voice pitch. The value range is [0.5,2.0]. The lower the value, the lower the pitch. The default value is 1.0 (no change to the pitch).
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setLocalVoicePitch(pitch: number): number;

  /**
   * Set the formant ratio to change the timbre of human voice.
   *
   * Formant ratio affects the timbre of voice. The smaller the value, the deeper the sound will be, and the larger, the sharper. You can call this method to set the formant ratio of local audio to change the timbre of human voice. After you set the formant ratio, all users in the channel can hear the changed voice. If you want to change the timbre and pitch of voice at the same time, Agora recommends using this method together with setLocalVoicePitch. You can call this method either before or after joining a channel.
   *
   * @param formantRatio The formant ratio. The value range is [-1.0, 1.0]. The default value is 0.0, which means do not change the timbre of the voice. Agora recommends setting this value within the range of [-0.4, 0.6]. Otherwise, the voice may be seriously distorted.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setLocalVoiceFormant(formantRatio: number): number;

  /**
   * Sets the local voice equalization effect.
   *
   * You can call this method either before or after joining a channel.
   *
   * @param bandFrequency The band frequency. The value ranges between 0 and 9; representing the respective 10-band center frequencies of the voice effects, including 31, 62, 125, 250, 500, 1k, 2k, 4k, 8k, and 16k Hz. See AudioEqualizationBandFrequency.
   * @param bandGain The gain of each band in dB. The value ranges between -15 and 15. The default value is 0.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setLocalVoiceEqualization(
    bandFrequency: AudioEqualizationBandFrequency,
    bandGain: number
  ): number;

  /**
   * Sets the local voice reverberation.
   *
   * The SDK provides an easier-to-use method, setAudioEffectPreset, to directly implement preset reverb effects for such as pop, R&B, and KTV. You can call this method either before or after joining a channel.
   *
   * @param reverbKey The reverberation key. Agora provides five reverberation keys, see AudioReverbType.
   * @param value The value of the reverberation key.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setLocalVoiceReverb(
    reverbKey: AudioReverbType,
    value: number
  ): number;

  /**
   * Sets the preset headphone equalization effect.
   *
   * This method is mainly used in spatial audio effect scenarios. You can select the preset headphone equalizer to listen to the audio to achieve the expected audio experience. If the headphones you use already have a good equalization effect, you may not get a significant improvement when you call this method, and could even diminish the experience.
   *
   * @param preset The preset headphone equalization effect. See HeadphoneEqualizerPreset.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -1: A general error occurs (no specified reason).
   */
  abstract setHeadphoneEQPreset(preset: HeadphoneEqualizerPreset): number;

  /**
   * Sets the low- and high-frequency parameters of the headphone equalizer.
   *
   * In a spatial audio effect scenario, if the preset headphone equalization effect is not achieved after calling the setHeadphoneEQPreset method, you can further adjust the headphone equalization effect by calling this method.
   *
   * @param lowGain The low-frequency parameters of the headphone equalizer. The value range is [-10,10]. The larger the value, the deeper the sound.
   * @param highGain The high-frequency parameters of the headphone equalizer. The value range is [-10,10]. The larger the value, the sharper the sound.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -1: A general error occurs (no specified reason).
   */
  abstract setHeadphoneEQParameters(lowGain: number, highGain: number): number;

  /**
   * Sets the log file.
   *
   * Deprecated: Use the mLogConfig parameter in initialize method instead. Specifies an SDK output log file. The log file records all log data for the SDK’s operation. Ensure that the directory for the log file exists and is writable. Ensure that you call initialize immediately after calling the IRtcEngine method, or the output log may not be complete.
   *
   * @param filePath The complete path of the log files. These log files are encoded in UTF-8.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setLogFile(filePath: string): number;

  /**
   * Sets the log output level of the SDK.
   *
   * Deprecated: Use logConfig in initialize instead. This method sets the output log level of the SDK. You can use one or a combination of the log filter levels. The log level follows the sequence of LogFilterOff, LogFilterCritical, LogFilterError, LogFilterWarn, LogFilterInfo, and LogFilterDebug. Choose a level to see the logs preceding that level. If, for example, you set the log level to LogFilterWarn, you see the logs within levels LogFilterCritical, LogFilterError and LogFilterWarn.
   *
   * @param filter The output log level of the SDK. See LogFilterType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setLogFilter(filter: LogFilterType): number;

  /**
   * Sets the output log level of the SDK.
   *
   * Deprecated: This method is deprecated. Use RtcEngineContext instead to set the log output level. Choose a level to see the logs preceding that level.
   *
   * @param level The log level: LogLevel.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setLogLevel(level: LogLevel): number;

  /**
   * Sets the log file size.
   *
   * Deprecated: Use the logConfig parameter in initialize instead. By default, the SDK generates five SDK log files and five API call log files with the following rules:
   *  The SDK log files are: agorasdk.log, agorasdk.1.log, agorasdk.2.log, agorasdk.3.log, and agorasdk.4.log.
   *  The API call log files are: agoraapi.log, agoraapi.1.log, agoraapi.2.log, agoraapi.3.log, and agoraapi.4.log.
   *  The default size of each SDK log file and API log file is 2,048 KB. These log files are encoded in UTF-8.
   *  The SDK writes the latest logs in agorasdk.log or agoraapi.log.
   *  When agorasdk.log is full, the SDK processes the log files in the following order:
   *  Delete the agorasdk.4.log file (if any).
   *  Rename agorasdk.3.log to agorasdk.4.log.
   *  Rename agorasdk.2.log to agorasdk.3.log.
   *  Rename agorasdk.1.log to agorasdk.2.log.
   *  Create a new agorasdk.log file.
   *  The overwrite rules for the agoraapi.log file are the same as for agorasdk.log. This method is used to set the size of the agorasdk.log file only and does not effect the agoraapi.log file.
   *
   * @param fileSizeInKBytes The size (KB) of an agorasdk.log file. The value range is [128,20480]. The default value is 2,048 KB. If you set fileSizeInKByte smaller than 128 KB, the SDK automatically adjusts it to 128 KB; if you set fileSizeInKByte greater than 20,480 KB, the SDK automatically adjusts it to 20,480 KB.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setLogFileSize(fileSizeInKBytes: number): number;

  /**
   * @ignore
   */
  abstract uploadLogFile(): string;

  /**
   * @ignore
   */
  abstract writeLog(level: LogLevel, fmt: string): number;

  /**
   * Updates the display mode of the local video view.
   *
   * After initializing the local video view, you can call this method to update its rendering and mirror modes. It affects only the video view that the local user sees, not the published local video stream.
   *  Ensure that you have called the setupLocalVideo method to initialize the local video view before calling this method.
   *  During a call, you can call this method as many times as necessary to update the display mode of the local video view.
   *  This method only takes effect on the primary camera (PrimaryCameraSource). In scenarios involving custom video capture or the use of alternative video sources, you need to use setupLocalVideo instead of this method.
   *
   * @param renderMode The local video display mode. See RenderModeType.
   * @param mirrorMode The mirror mode of the local video view. See VideoMirrorModeType. If you use a front camera, the SDK enables the mirror mode by default; if you use a rear camera, the SDK disables the mirror mode by default.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setLocalRenderMode(
    renderMode: RenderModeType,
    mirrorMode?: VideoMirrorModeType
  ): number;

  /**
   * Updates the display mode of the video view of a remote user.
   *
   * After initializing the video view of a remote user, you can call this method to update its rendering and mirror modes. This method affects only the video view that the local user sees.
   *  Call this method after initializing the remote view by calling the setupRemoteVideo method.
   *  During a call, you can call this method as many times as necessary to update the display mode of the video view of a remote user.
   *
   * @param uid The user ID of the remote user.
   * @param renderMode The rendering mode of the remote user view.
   * @param mirrorMode The mirror mode of the remote user view. See VideoMirrorModeType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setRemoteRenderMode(
    uid: number,
    renderMode: RenderModeType,
    mirrorMode: VideoMirrorModeType
  ): number;

  /**
   * Sets the local video mirror mode.
   *
   * Deprecated: This method is deprecated. Use setupLocalVideo or setLocalRenderMode instead.
   *
   * @param mirrorMode The local video mirror mode. See VideoMirrorModeType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setLocalVideoMirrorMode(mirrorMode: VideoMirrorModeType): number;

  /**
   * Sets the dual-stream mode on the sender side and the low-quality video stream.
   *
   * Deprecated: This method is deprecated as of v4.2.0. Use setDualStreamMode instead. You can call this method to enable or disable the dual-stream mode on the publisher side. Dual streams are a pairing of a high-quality video stream and a low-quality video stream:
   *  High-quality video stream: High bitrate, high resolution.
   *  Low-quality video stream: Low bitrate, low resolution. After you enable dual-stream mode, you can call setRemoteVideoStreamType to choose to receive either the high-quality video stream or the low-quality video stream on the subscriber side.
   *  This method is applicable to all types of streams from the sender, including but not limited to video streams collected from cameras, screen sharing streams, and custom-collected video streams.
   *  If you need to enable dual video streams in a multi-channel scenario, you can call the enableDualStreamModeEx method.
   *  You can call this method either before or after joining a channel.
   *
   * @param enabled Whether to enable dual-stream mode: true : Enable dual-stream mode. false : (Default) Disable dual-stream mode.
   * @param streamConfig The configuration of the low-quality video stream. See SimulcastStreamConfig. When setting mode to DisableSimulcastStream, setting streamConfig will not take effect.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract enableDualStreamMode(
    enabled: boolean,
    streamConfig?: SimulcastStreamConfig
  ): number;

  /**
   * Sets dual-stream mode configuration on the sender side.
   *
   * The SDK defaults to enabling low-quality video stream adaptive mode (AutoSimulcastStream) on the sender side, which means the sender does not actively send low-quality video stream. The receiving end with the role of the host can initiate a low-quality video stream request by calling setRemoteVideoStreamType, and upon receiving the request, the sending end automatically starts sending low-quality stream.
   *  If you want to modify this behavior, you can call this method and set mode to DisableSimulcastStream (never send low-quality video streams) or EnableSimulcastStream (always send low-quality video streams).
   *  If you want to restore the default behavior after making changes, you can call this method again with mode set to AutoSimulcastStream. The difference and connection between this method and enableDualStreamMode is as follows:
   *  When calling this method and setting mode to DisableSimulcastStream, it has the same effect as calling enableDualStreamMode and setting enabled to false.
   *  When calling this method and setting mode to EnableSimulcastStream, it has the same effect as calling enableDualStreamMode and setting enabled to true.
   *  Both methods can be called before and after joining a channel. If both methods are used, the settings in the method called later takes precedence.
   *
   * @param mode The mode in which the video stream is sent. See SimulcastStreamMode.
   * @param streamConfig The configuration of the low-quality video stream. See SimulcastStreamConfig. When setting mode to DisableSimulcastStream, setting streamConfig will not take effect.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setDualStreamMode(
    mode: SimulcastStreamMode,
    streamConfig?: SimulcastStreamConfig
  ): number;

  /**
   * Sets whether to enable the local playback of external audio source.
   *
   * Ensure you have called the createCustomAudioTrack method to create a custom audio track before calling this method. After calling this method to enable the local playback of external audio source, if you need to stop local playback, you can call this method again and set enabled to false. You can call adjustCustomAudioPlayoutVolume to adjust the local playback volume of the custom audio track.
   *
   * @param trackId The audio track ID. Set this parameter to the custom audio track ID returned in createCustomAudioTrack.
   * @param enabled Whether to play the external audio source: true : Play the external audio source. false : (Default) Do not play the external source.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract enableCustomAudioLocalPlayback(
    trackId: number,
    enabled: boolean
  ): number;

  /**
   * Sets the format of the captured raw audio data.
   *
   * Sets the audio format for the onRecordAudioFrame callback.
   *  Ensure that you call this method before joining a channel.
   *  The SDK calculates the sampling interval based on the samplesPerCall, sampleRate and channel parameters set in this method. Sample interval (sec) = samplePerCall /(sampleRate × channel). Ensure that the sample interval ≥ 0.01 (s).
   *
   * @param sampleRate The sample rate returned in the SDK, which can be set as 8000, 16000, 32000, 44100, or 48000 Hz.
   * @param channel The number of channels returned by the SDK. You can set the value as 1 or 2:
   *  1: Mono.
   *  2: Stereo.
   * @param mode The use mode of the audio frame. See RawAudioFrameOpModeType.
   * @param samplesPerCall The number of data samples returned in the SDK, such as 1024 for the Media Push.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setRecordingAudioFrameParameters(
    sampleRate: number,
    channel: number,
    mode: RawAudioFrameOpModeType,
    samplesPerCall: number
  ): number;

  /**
   * Sets the audio data format for playback.
   *
   * Sets the data format for the onPlaybackAudioFrame callback.
   *  Ensure that you call this method before joining a channel.
   *  The SDK calculates the sampling interval based on the samplesPerCall, sampleRate and channel parameters set in this method. Sample interval (sec) = samplePerCall /(sampleRate × channel). Ensure that the sample interval ≥ 0.01 (s). The SDK triggers the onPlaybackAudioFrame callback according to the sampling interval.
   *
   * @param sampleRate The sample rate returned in the onPlaybackAudioFrame callback, which can be set as 8000, 16000, 32000, 44100, or 48000 Hz.
   * @param channel The number of channels returned in the onPlaybackAudioFrame callback:
   *  1: Mono.
   *  2: Stereo.
   * @param mode The use mode of the audio frame. See RawAudioFrameOpModeType.
   * @param samplesPerCall The number of data samples returned in the onPlaybackAudioFrame callback, such as 1024 for the Media Push.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setPlaybackAudioFrameParameters(
    sampleRate: number,
    channel: number,
    mode: RawAudioFrameOpModeType,
    samplesPerCall: number
  ): number;

  /**
   * Sets the audio data format reported by onMixedAudioFrame.
   *
   * @param sampleRate The sample rate (Hz) of the audio data, which can be set as 8000, 16000, 32000, 44100, or 48000.
   * @param channel The number of channels of the audio data, which can be set as 1(Mono) or 2(Stereo).
   * @param samplesPerCall Sets the number of samples. In Media Push scenarios, set it as 1024.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setMixedAudioFrameParameters(
    sampleRate: number,
    channel: number,
    samplesPerCall: number
  ): number;

  /**
   * Sets the format of the in-ear monitoring raw audio data.
   *
   * This method is used to set the in-ear monitoring audio data format reported by the onEarMonitoringAudioFrame callback.
   *  Before calling this method, you need to call enableInEarMonitoring, and set includeAudioFilters to EarMonitoringFilterBuiltInAudioFilters or EarMonitoringFilterNoiseSuppression.
   *  The SDK calculates the sampling interval based on the samplesPerCall, sampleRate and channel parameters set in this method. Sample interval (sec) = samplePerCall /(sampleRate × channel). Ensure that the sample interval ≥ 0.01 (s). The SDK triggers the onEarMonitoringAudioFrame callback according to the sampling interval.
   *
   * @param sampleRate The sample rate of the audio data reported in the onEarMonitoringAudioFrame callback, which can be set as 8,000, 16,000, 32,000, 44,100, or 48,000 Hz.
   * @param channel The number of audio channels reported in the onEarMonitoringAudioFrame callback.
   *  1: Mono.
   *  2: Stereo.
   * @param mode The use mode of the audio frame. See RawAudioFrameOpModeType.
   * @param samplesPerCall The number of data samples reported in the onEarMonitoringAudioFrame callback, such as 1,024 for the Media Push.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setEarMonitoringAudioFrameParameters(
    sampleRate: number,
    channel: number,
    mode: RawAudioFrameOpModeType,
    samplesPerCall: number
  ): number;

  /**
   * Sets the audio data format reported by onPlaybackAudioFrameBeforeMixing.
   *
   * @param sampleRate The sample rate (Hz) of the audio data, which can be set as 8000, 16000, 32000, 44100, or 48000.
   * @param channel The number of channels of the audio data, which can be set as 1 (Mono) or 2 (Stereo).
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setPlaybackAudioFrameBeforeMixingParameters(
    sampleRate: number,
    channel: number
  ): number;

  /**
   * Turns on audio spectrum monitoring.
   *
   * If you want to obtain the audio spectrum data of local or remote users, you can register the audio spectrum observer and enable audio spectrum monitoring. You can call this method either before or after joining a channel.
   *
   * @param intervalInMS The interval (in milliseconds) at which the SDK triggers the onLocalAudioSpectrum and onRemoteAudioSpectrum callbacks. The default value is 100. Do not set this parameter to a value less than 10, otherwise calling this method would fail.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -2: Invalid parameters.
   */
  abstract enableAudioSpectrumMonitor(intervalInMS?: number): number;

  /**
   * Disables audio spectrum monitoring.
   *
   * After calling enableAudioSpectrumMonitor, if you want to disable audio spectrum monitoring, you can call this method. You can call this method either before or after joining a channel.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract disableAudioSpectrumMonitor(): number;

  /**
   * Register an audio spectrum observer.
   *
   * After successfully registering the audio spectrum observer and calling enableAudioSpectrumMonitor to enable the audio spectrum monitoring, the SDK reports the callback that you implement in the IAudioSpectrumObserver class according to the time interval you set. You can call this method either before or after joining a channel.
   *
   * @param observer The audio spectrum observer. See IAudioSpectrumObserver.
   *
   * @returns
   * One IAudioSpectrumObserver object.
   */
  abstract registerAudioSpectrumObserver(
    observer: IAudioSpectrumObserver
  ): number;

  /**
   * Unregisters the audio spectrum observer.
   *
   * After calling registerAudioSpectrumObserver, if you want to disable audio spectrum monitoring, you can call this method. You can call this method either before or after joining a channel.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract unregisterAudioSpectrumObserver(
    observer: IAudioSpectrumObserver
  ): number;

  /**
   * Adjusts the capturing signal volume.
   *
   * If you only need to mute the audio signal, Agora recommends that you use muteRecordingSignal instead.
   *
   * @param volume The volume of the user. The value range is [0,400].
   *  0: Mute.
   *  100: (Default) The original volume.
   *  400: Four times the original volume (amplifying the audio signals by four times).
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract adjustRecordingSignalVolume(volume: number): number;

  /**
   * Whether to mute the recording signal.
   *
   * If you have already called adjustRecordingSignalVolume to adjust the recording signal volume, when you call this method and set it to true, the SDK behaves as follows:
   *  Records the adjusted volume.
   *  Mutes the recording signal. When you call this method again and set it to false, the recording signal volume will be restored to the volume recorded by the SDK before muting.
   *
   * @param mute true : Mute the recording signal. false : (Default) Do not mute the recording signal.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract muteRecordingSignal(mute: boolean): number;

  /**
   * Adjusts the playback signal volume of all remote users.
   *
   * This method is used to adjust the signal volume of all remote users mixed and played locally. If you need to adjust the signal volume of a specified remote user played locally, it is recommended that you call adjustUserPlaybackSignalVolume instead.
   *
   * @param volume The volume of the user. The value range is [0,400].
   *  0: Mute.
   *  100: (Default) The original volume.
   *  400: Four times the original volume (amplifying the audio signals by four times).
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract adjustPlaybackSignalVolume(volume: number): number;

  /**
   * Adjusts the playback signal volume of a specified remote user.
   *
   * You can call this method to adjust the playback volume of a specified remote user. To adjust the playback volume of different remote users, call the method as many times, once for each remote user.
   *
   * @param uid The user ID of the remote user.
   * @param volume The volume of the user. The value range is [0,400].
   *  0: Mute.
   *  100: (Default) The original volume.
   *  400: Four times the original volume (amplifying the audio signals by four times).
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract adjustUserPlaybackSignalVolume(uid: number, volume: number): number;

  /**
   * @ignore
   */
  abstract setLocalPublishFallbackOption(option: StreamFallbackOptions): number;

  /**
   * Sets the fallback option for the subscribed video stream based on the network conditions.
   *
   * An unstable network affects the audio and video quality in a video call or interactive live video streaming. If option is set as StreamFallbackOptionVideoStreamLow or StreamFallbackOptionAudioOnly, the SDK automatically switches the video from a high-quality stream to a low-quality stream or disables the video when the downlink network conditions cannot support both audio and video to guarantee the quality of the audio. Meanwhile, the SDK continuously monitors network quality and resumes subscribing to audio and video streams when the network quality improves. When the subscribed video stream falls back to an audio-only stream, or recovers from an audio-only stream to an audio-video stream, the SDK triggers the onRemoteSubscribeFallbackToAudioOnly callback.
   *
   * @param option Fallback options for the subscribed stream. See STREAM_FALLBACK_OPTIONS.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setRemoteSubscribeFallbackOption(
    option: StreamFallbackOptions
  ): number;

  /**
   * @ignore
   */
  abstract setHighPriorityUserList(
    uidList: number[],
    uidNum: number,
    option: StreamFallbackOptions
  ): number;

  /**
   * Enables loopback audio capturing.
   *
   * If you enable loopback audio capturing, the output of the sound card is mixed into the audio stream sent to the other end.
   *  macOS does not support loopback audio capture of the default sound card. If you need to use this function, use a virtual sound card and pass its name to the deviceName parameter. Agora recommends using AgoraALD as the virtual sound card for audio capturing.
   *  You can call this method either before or after joining a channel.
   *  If you call the disableAudio method to disable the audio module, audio capturing will be disabled as well. If you need to enable audio capturing, call the enableAudio method to enable the audio module and then call the enableLoopbackRecording method.
   *
   * @param enabled Sets whether to enable loopback audio capturing. true : Enable loopback audio capturing. false : (Default) Disable loopback audio capturing.
   * @param deviceName macOS: The device name of the virtual sound card. The default value is set to NULL, which means using AgoraALD for loopback audio capturing.
   *  Windows: The device name of the sound card. The default is set to NULL, which means the SDK uses the sound card of your device for loopback audio capturing.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract enableLoopbackRecording(
    enabled: boolean,
    deviceName?: string
  ): number;

  /**
   * Adjusts the volume of the signal captured by the sound card.
   *
   * After calling enableLoopbackRecording to enable loopback audio capturing, you can call this method to adjust the volume of the signal captured by the sound card.
   *
   * @param volume Audio mixing volume. The value ranges between 0 and 100. The default value is 100, which means the original volume.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract adjustLoopbackSignalVolume(volume: number): number;

  /**
   * @ignore
   */
  abstract getLoopbackRecordingVolume(): number;

  /**
   * Enables in-ear monitoring.
   *
   * This method enables or disables in-ear monitoring.
   *
   * @param enabled Enables or disables in-ear monitoring. true : Enables in-ear monitoring. false : (Default) Disables in-ear monitoring.
   * @param includeAudioFilters The audio filter types of in-ear monitoring. See EarMonitoringFilterType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  - 8: Make sure the current audio routing is Bluetooth or headset.
   */
  abstract enableInEarMonitoring(
    enabled: boolean,
    includeAudioFilters: EarMonitoringFilterType
  ): number;

  /**
   * Sets the volume of the in-ear monitor.
   *
   * @param volume The volume of the user. The value range is [0,400].
   *  0: Mute.
   *  100: (Default) The original volume.
   *  400: Four times the original volume (amplifying the audio signals by four times).
   */
  abstract setInEarMonitoringVolume(volume: number): number;

  /**
   * Loads an extension.
   *
   * This method is used to add extensions external to the SDK (such as those from Extensions Marketplace and SDK extensions) to the SDK.
   *
   * @param path The extension library path and name. For example: /library/libagora_segmentation_extension.dll.
   * @param unloadAfterUse Whether to uninstall the current extension when you no longer using it: true : Uninstall the extension when the IRtcEngine is destroyed. false : (Rcommended) Do not uninstall the extension until the process terminates.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract loadExtensionProvider(
    path: string,
    unloadAfterUse?: boolean
  ): number;

  /**
   * Sets the properties of the extension provider.
   *
   * You can call this method to set the attributes of the extension provider and initialize the relevant parameters according to the type of the provider.
   *
   * @param provider The name of the extension provider.
   * @param key The key of the extension.
   * @param value The value of the extension key.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setExtensionProviderProperty(
    provider: string,
    key: string,
    value: string
  ): number;

  /**
   * Registers an extension.
   *
   * For extensions external to the SDK (such as those from Extensions Marketplace and SDK Extensions), you need to load them before calling this method. Extensions internal to the SDK (those included in the full SDK package) are automatically loaded and registered after the initialization of IRtcEngine.
   *
   * @param provider The name of the extension provider.
   * @param extension The name of the extension.
   * @param type Source type of the extension. See MediaSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -3: The extension library is not loaded. Agora recommends that you check the storage location or the name of the dynamic library.
   */
  abstract registerExtension(
    provider: string,
    extension: string,
    type?: MediaSourceType
  ): number;

  /**
   * Enables or disables extensions.
   *
   * @param provider The name of the extension provider.
   * @param extension The name of the extension.
   * @param enable Whether to enable the extension: true : Enable the extension. false : Disable the extension.
   * @param type Source type of the extension. See MediaSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -3: The extension library is not loaded. Agora recommends that you check the storage location or the name of the dynamic library.
   */
  abstract enableExtension(
    provider: string,
    extension: string,
    enable?: boolean,
    type?: MediaSourceType
  ): number;

  /**
   * Sets the properties of the extension.
   *
   * After enabling the extension, you can call this method to set the properties of the extension.
   *
   * @param provider The name of the extension provider.
   * @param extension The name of the extension.
   * @param key The key of the extension.
   * @param value The value of the extension key.
   * @param type Source type of the extension. See MediaSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setExtensionProperty(
    provider: string,
    extension: string,
    key: string,
    value: string,
    type?: MediaSourceType
  ): number;

  /**
   * Gets detailed information on the extensions.
   *
   * @param provider The name of the extension provider.
   * @param extension The name of the extension.
   * @param key The key of the extension.
   * @param bufLen Maximum length of the JSON string indicating the extension property. The maximum value is 512 bytes.
   * @param type Source type of the extension. See MediaSourceType.
   *
   * @returns
   * The extension information, if the method call succeeds.
   *  An empty string, if the method call fails.
   */
  abstract getExtensionProperty(
    provider: string,
    extension: string,
    key: string,
    bufLen: number,
    type?: MediaSourceType
  ): string;

  /**
   * @ignore
   */
  abstract setCameraCapturerConfiguration(
    config: CameraCapturerConfiguration
  ): number;

  /**
   * Creates a custom video track.
   *
   * To publish a custom video source, see the following steps:
   *  Call this method to create a video track and get the video track ID.
   *  Call joinChannel to join the channel. In ChannelMediaOptions, set customVideoTrackId to the video track ID that you want to publish, and set publishCustomVideoTrack to true.
   *  Call pushVideoFrame and specify videoTrackId as the video track ID set in step 2. You can then publish the corresponding custom video source in the channel.
   *
   * @returns
   * If the method call is successful, the video track ID is returned as the unique identifier of the video track.
   *  If the method call fails, 0xffffffff is returned.
   */
  abstract createCustomVideoTrack(): number;

  /**
   * @ignore
   */
  abstract createCustomEncodedVideoTrack(senderOption: SenderOptions): number;

  /**
   * Destroys the specified video track.
   *
   * @param videoTrackId The video track ID returned by calling the createCustomVideoTrack method.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract destroyCustomVideoTrack(videoTrackId: number): number;

  /**
   * @ignore
   */
  abstract destroyCustomEncodedVideoTrack(videoTrackId: number): number;

  /**
   * @ignore
   */
  abstract switchCamera(): number;

  /**
   * @ignore
   */
  abstract isCameraZoomSupported(): boolean;

  /**
   * @ignore
   */
  abstract isCameraFaceDetectSupported(): boolean;

  /**
   * @ignore
   */
  abstract isCameraTorchSupported(): boolean;

  /**
   * @ignore
   */
  abstract isCameraFocusSupported(): boolean;

  /**
   * @ignore
   */
  abstract isCameraAutoFocusFaceModeSupported(): boolean;

  /**
   * @ignore
   */
  abstract setCameraZoomFactor(factor: number): number;

  /**
   * @ignore
   */
  abstract enableFaceDetection(enabled: boolean): number;

  /**
   * @ignore
   */
  abstract getCameraMaxZoomFactor(): number;

  /**
   * @ignore
   */
  abstract setCameraFocusPositionInPreview(
    positionX: number,
    positionY: number
  ): number;

  /**
   * @ignore
   */
  abstract setCameraTorchOn(isOn: boolean): number;

  /**
   * @ignore
   */
  abstract setCameraAutoFocusFaceModeEnabled(enabled: boolean): number;

  /**
   * @ignore
   */
  abstract isCameraExposurePositionSupported(): boolean;

  /**
   * @ignore
   */
  abstract setCameraExposurePosition(
    positionXinView: number,
    positionYinView: number
  ): number;

  /**
   * @ignore
   */
  abstract isCameraExposureSupported(): boolean;

  /**
   * @ignore
   */
  abstract setCameraExposureFactor(factor: number): number;

  /**
   * @ignore
   */
  abstract isCameraAutoExposureFaceModeSupported(): boolean;

  /**
   * @ignore
   */
  abstract setCameraAutoExposureFaceModeEnabled(enabled: boolean): number;

  /**
   * @ignore
   */
  abstract setCameraStabilizationMode(mode: CameraStabilizationMode): number;

  /**
   * @ignore
   */
  abstract setDefaultAudioRouteToSpeakerphone(
    defaultToSpeaker: boolean
  ): number;

  /**
   * @ignore
   */
  abstract setEnableSpeakerphone(speakerOn: boolean): number;

  /**
   * @ignore
   */
  abstract isSpeakerphoneEnabled(): boolean;

  /**
   * @ignore
   */
  abstract setRouteInCommunicationMode(route: number): number;

  /**
   * @ignore
   */
  abstract isSupportPortraitCenterStage(): boolean;

  /**
   * @ignore
   */
  abstract enablePortraitCenterStage(enabled: boolean): number;

  /**
   * Gets a list of shareable screens and windows.
   *
   * You can call this method before sharing a screen or window to get a list of shareable screens and windows, which enables a user to use thumbnails in the list to easily choose a particular screen or window to share. This list also contains important information such as window ID and screen ID, with which you can call startScreenCaptureByWindowId or startScreenCaptureByDisplayId to start the sharing.
   *
   * @param thumbSize The target size of the screen or window thumbnail (the width and height are in pixels). The SDK scales the original image to make the length of the longest side of the image the same as that of the target size without distorting the original image. For example, if the original image is 400 × 300 and thumbSize is 100 × 100, the actual size of the thumbnail is 100 × 75. If the target size is larger than the original size, the thumbnail is the original image and the SDK does not scale it.
   * @param iconSize The target size of the icon corresponding to the application program (the width and height are in pixels). The SDK scales the original image to make the length of the longest side of the image the same as that of the target size without distorting the original image. For example, if the original image is 400 × 300 and iconSize is 100 × 100, the actual size of the icon is 100 × 75. If the target size is larger than the original size, the icon is the original image and the SDK does not scale it.
   * @param includeScreen Whether the SDK returns the screen information in addition to the window information: true : The SDK returns screen and window information. false : The SDK returns window information only.
   *
   * @returns
   * The ScreenCaptureSourceInfo array.
   */
  abstract getScreenCaptureSources(
    thumbSize: Size,
    iconSize: Size,
    includeScreen: boolean
  ): ScreenCaptureSourceInfo[];

  /**
   * @ignore
   */
  abstract setAudioSessionOperationRestriction(
    restriction: AudioSessionOperationRestriction
  ): number;

  /**
   * Captures the screen by specifying the display ID.
   *
   * Captures the video stream of a screen or a part of the screen area.
   *
   * @param displayId The display ID of the screen to be shared. For the Windows platform, if you need to simultaneously share two screens (main screen and secondary screen), you can set displayId to -1 when calling this method.
   * @param regionRect (Optional) Sets the relative location of the region to the screen. Pass in nil to share the entire screen.
   * @param captureParams Screen sharing configurations. The default video dimension is 1920 x 1080, that is, 2,073,600 pixels. Agora uses the value of this parameter to calculate the charges. See ScreenCaptureParameters. The video properties of the screen sharing stream only need to be set through this parameter, and are unrelated to setVideoEncoderConfiguration.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -2: The parameter is invalid.
   *  -8: The screen sharing state is invalid. Probably because you have shared other screens or windows. Try calling stopScreenCapture to stop the current sharing and start sharing the screen again.
   */
  abstract startScreenCaptureByDisplayId(
    displayId: number,
    regionRect: Rectangle,
    captureParams: ScreenCaptureParameters
  ): number;

  /**
   * Captures the whole or part of a screen by specifying the screen rect.
   *
   * You can call this method either before or after joining the channel, with the following differences:
   *  Call this method before joining a channel, and then call joinChannel to join a channel and set publishScreenTrack or publishSecondaryScreenTrack to true to start screen sharing.
   *  Call this method after joining a channel, and then call updateChannelMediaOptions to join a channel and set publishScreenTrack or publishSecondaryScreenTrack to true to start screen sharing. Deprecated: This method is deprecated. Use startScreenCaptureByDisplayId instead. Agora strongly recommends using startScreenCaptureByDisplayId if you need to start screen sharing on a device connected to another display. This method shares a screen or part of the screen. You need to specify the area of the screen to be shared. This method applies to Windows only.
   *
   * @param screenRect Sets the relative location of the screen to the virtual screen.
   * @param regionRect Sets the relative location of the region to the screen. If you do not set this parameter, the SDK shares the whole screen. See Rectangle. If the specified region overruns the screen, the SDK shares only the region within it; if you set width or height as 0, the SDK shares the whole screen.
   * @param captureParams The screen sharing encoding parameters. The default video resolution is 1920 × 1080, that is, 2,073,600 pixels. Agora uses the value of this parameter to calculate the charges. See ScreenCaptureParameters.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -2: The parameter is invalid.
   *  -8: The screen sharing state is invalid. Probably because you have shared other screens or windows. Try calling stopScreenCapture to stop the current sharing and start sharing the screen again.
   */
  abstract startScreenCaptureByScreenRect(
    screenRect: Rectangle,
    regionRect: Rectangle,
    captureParams: ScreenCaptureParameters
  ): number;

  /**
   * @ignore
   */
  abstract getAudioDeviceInfo(): DeviceInfo;

  /**
   * Captures the whole or part of a window by specifying the window ID.
   *
   * This method captures a window or part of the window. You need to specify the ID of the window to be captured. This method applies to the macOS and Windows only. This method supports window sharing of UWP (Universal Windows Platform) applications. Agora tests the mainstream UWP applications by using the lastest SDK, see details as follows:
   *
   * @param windowId The ID of the window to be shared.
   * @param regionRect (Optional) Sets the relative location of the region to the screen. If you do not set this parameter, the SDK shares the whole screen. See Rectangle. If the specified region overruns the window, the SDK shares only the region within it; if you set width or height as 0, the SDK shares the whole window.
   * @param captureParams Screen sharing configurations. The default video resolution is 1920 × 1080, that is, 2,073,600 pixels. Agora uses the value of this parameter to calculate the charges. See ScreenCaptureParameters.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -2: The parameter is invalid.
   *  -8: The screen sharing state is invalid. Probably because you have shared other screens or windows. Try calling stopScreenCapture to stop the current sharing and start sharing the screen again.
   */
  abstract startScreenCaptureByWindowId(
    windowId: any,
    regionRect: Rectangle,
    captureParams: ScreenCaptureParameters
  ): number;

  /**
   * Sets the content hint for screen sharing.
   *
   * A content hint suggests the type of the content being shared, so that the SDK applies different optimization algorithms to different types of content. If you don't call this method, the default content hint is ContentHintNone. You can call this method either before or after you start screen sharing.
   *
   * @param contentHint The content hint for screen sharing. See VideoContentHint.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -2: The parameter is invalid.
   *  -8: The screen sharing state is invalid. Probably because you have shared other screens or windows. Try calling stopScreenCapture to stop the current sharing and start sharing the screen again.
   */
  abstract setScreenCaptureContentHint(contentHint: VideoContentHint): number;

  /**
   * Updates the screen capturing region.
   *
   * Call this method after starting screen sharing or window sharing.
   *
   * @param regionRect The relative location of the screen-share area to the screen or window. If you do not set this parameter, the SDK shares the whole screen or window. See Rectangle. If the specified region overruns the screen or window, the SDK shares only the region within it; if you set width or height as 0, the SDK shares the whole screen or window.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -2: The parameter is invalid.
   *  -8: The screen sharing state is invalid. Probably because you have shared other screens or windows. Try calling stopScreenCapture to stop the current sharing and start sharing the screen again.
   */
  abstract updateScreenCaptureRegion(regionRect: Rectangle): number;

  /**
   * Updates the screen capturing parameters.
   *
   * Call this method after starting screen sharing or window sharing.
   *
   * @param captureParams The screen sharing encoding parameters. The default video resolution is 1920 × 1080, that is, 2,073,600 pixels. Agora uses the value of this parameter to calculate the charges. See ScreenCaptureParameters. The video properties of the screen sharing stream only need to be set through this parameter, and are unrelated to setVideoEncoderConfiguration.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -2: The parameter is invalid.
   *  -8: The screen sharing state is invalid. Probably because you have shared other screens or windows. Try calling stopScreenCapture to stop the current sharing and start sharing the screen again.
   */
  abstract updateScreenCaptureParameters(
    captureParams: ScreenCaptureParameters
  ): number;

  /**
   * @ignore
   */
  abstract startScreenCapture(captureParams: ScreenCaptureParameters2): number;

  /**
   * Starts screen capture from the specified video source.
   *
   * This method applies to the macOS and Windows only.
   *
   * @param sourceType The type of the video source. See VideoSourceType. On the macOS platform, this parameter can only be set to VideoSourceScreen (2).
   * @param config The configuration of the captured screen. See ScreenCaptureConfiguration.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract startScreenCaptureBySourceType(
    sourceType: VideoSourceType,
    config: ScreenCaptureConfiguration
  ): number;

  /**
   * @ignore
   */
  abstract updateScreenCapture(captureParams: ScreenCaptureParameters2): number;

  /**
   * @ignore
   */
  abstract queryScreenCaptureCapability(): number;

  /**
   * Sets the screen sharing scenario.
   *
   * When you start screen sharing or window sharing, you can call this method to set the screen sharing scenario. The SDK adjusts the video quality and experience of the sharing according to the scenario. Agora recommends that you call this method before joining a channel.
   *
   * @param screenScenario The screen sharing scenario. See ScreenScenarioType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setScreenCaptureScenario(screenScenario: ScreenScenarioType): number;

  /**
   * Stops screen capture.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract stopScreenCapture(): number;

  /**
   * Stops screen capture from the specified video source.
   *
   * @param sourceType The type of the video source. See VideoSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract stopScreenCaptureBySourceType(sourceType: VideoSourceType): number;

  /**
   * Retrieves the call ID.
   *
   * When a user joins a channel on a client, a callId is generated to identify the call from the client. You can call this method to get the callId parameter, and pass it in when calling methods such as rate and complain. Call this method after joining a channel.
   *
   * @returns
   * The current call ID, if the method succeeds.
   *  An empty string, if the method call fails.
   */
  abstract getCallId(): string;

  /**
   * Allows a user to rate a call after the call ends.
   *
   * Ensure that you call this method after leaving a channel.
   *
   * @param callId The current call ID. You can get the call ID by calling getCallId.
   * @param rating The value is between 1 (the lowest score) and 5 (the highest score).
   * @param description A description of the call. The string length should be less than 800 bytes.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -1: A general error occurs (no specified reason).
   *  -2: The parameter is invalid.
   */
  abstract rate(callId: string, rating: number, description: string): number;

  /**
   * Allows a user to complain about the call quality after a call ends.
   *
   * This method allows users to complain about the quality of the call. Call this method after the user leaves the channel.
   *
   * @param callId The current call ID. You can get the call ID by calling getCallId.
   * @param description A description of the call. The string length should be less than 800 bytes.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -1: A general error occurs (no specified reason).
   *  -2: The parameter is invalid.
   *  -7: The method is called before IRtcEngine is initialized.
   */
  abstract complain(callId: string, description: string): number;

  /**
   * Starts pushing media streams to a CDN without transcoding.
   *
   * Call this method after joining a channel.
   *  Only hosts in the LIVE_BROADCASTING profile can call this method.
   *  If you want to retry pushing streams after a failed push, make sure to call stopRtmpStream first, then call this method to retry pushing streams; otherwise, the SDK returns the same error code as the last failed push. Agora recommends that you use the server-side Media Push function. You can call this method to push an audio or video stream to the specified CDN address. This method can push media streams to only one CDN address at a time, so if you need to push streams to multiple addresses, call this method multiple times. After you call this method, the SDK triggers the onRtmpStreamingStateChanged callback on the local client to report the state of the streaming.
   *
   * @param url The address of Media Push. The format is RTMP or RTMPS. The character length cannot exceed 1024 bytes. Special characters such as Chinese characters are not supported.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -2: The URL or configuration of transcoding is invalid; check your URL and transcoding configurations.
   *  -7: The SDK is not initialized before calling this method.
   *  -19: The Media Push URL is already in use; use another URL instead.
   */
  abstract startRtmpStreamWithoutTranscoding(url: string): number;

  /**
   * Starts Media Push and sets the transcoding configuration.
   *
   * Agora recommends that you use the server-side Media Push function. You can call this method to push a live audio-and-video stream to the specified CDN address and set the transcoding configuration. This method can push media streams to only one CDN address at a time, so if you need to push streams to multiple addresses, call this method multiple times. Under one Agora project, the maximum number of concurrent tasks to push media streams is 200 by default. If you need a higher quota, contact. After you call this method, the SDK triggers the onRtmpStreamingStateChanged callback on the local client to report the state of the streaming.
   *  Call this method after joining a channel.
   *  Only hosts in the LIVE_BROADCASTING profile can call this method.
   *  If you want to retry pushing streams after a failed push, make sure to call stopRtmpStream first, then call this method to retry pushing streams; otherwise, the SDK returns the same error code as the last failed push.
   *
   * @param url The address of Media Push. The format is RTMP or RTMPS. The character length cannot exceed 1024 bytes. Special characters such as Chinese characters are not supported.
   * @param transcoding The transcoding configuration for Media Push. See LiveTranscoding.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -2: The URL or configuration of transcoding is invalid; check your URL and transcoding configurations.
   *  -7: The SDK is not initialized before calling this method.
   *  -19: The Media Push URL is already in use; use another URL instead.
   */
  abstract startRtmpStreamWithTranscoding(
    url: string,
    transcoding: LiveTranscoding
  ): number;

  /**
   * Updates the transcoding configuration.
   *
   * Agora recommends that you use the server-side Media Push function. After you start pushing media streams to CDN with transcoding, you can dynamically update the transcoding configuration according to the scenario. The SDK triggers the onTranscodingUpdated callback after the transcoding configuration is updated.
   *
   * @param transcoding The transcoding configuration for Media Push. See LiveTranscoding.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract updateRtmpTranscoding(transcoding: LiveTranscoding): number;

  /**
   * Stops pushing media streams to a CDN.
   *
   * Agora recommends that you use the server-side Media Push function. You can call this method to stop the live stream on the specified CDN address. This method can stop pushing media streams to only one CDN address at a time, so if you need to stop pushing streams to multiple addresses, call this method multiple times. After you call this method, the SDK triggers the onRtmpStreamingStateChanged callback on the local client to report the state of the streaming.
   *
   * @param url The address of Media Push. The format is RTMP or RTMPS. The character length cannot exceed 1024 bytes. Special characters such as Chinese characters are not supported.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract stopRtmpStream(url: string): number;

  /**
   * Starts the local video mixing.
   *
   * After calling this method, you can merge multiple video streams into one video stream locally. For example, you can merge the video streams captured by the camera, screen sharing, media player, remote video, video files, images, etc. into one video stream, and then publish the mixed video stream to the channel.
   *
   * @param config Configuration of the local video mixing, see LocalTranscoderConfiguration.
   *  The maximum resolution of each video stream participating in the local video mixing is 4096 × 2160. If this limit is exceeded, video mixing does not take effect.
   *  The maximum resolution of the mixed video stream is 4096 × 2160.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract startLocalVideoTranscoder(
    config: LocalTranscoderConfiguration
  ): number;

  /**
   * Updates the local video mixing configuration.
   *
   * After calling startLocalVideoTranscoder, call this method if you want to update the local video mixing configuration. If you want to update the video source type used for local video mixing, such as adding a second camera or screen to capture video, you need to call this method after startCameraCapture or startScreenCaptureBySourceType.
   *
   * @param config Configuration of the local video mixing, see LocalTranscoderConfiguration.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract updateLocalTranscoderConfiguration(
    config: LocalTranscoderConfiguration
  ): number;

  /**
   * Stops the local video mixing.
   *
   * After calling startLocalVideoTranscoder, call this method if you want to stop the local video mixing.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract stopLocalVideoTranscoder(): number;

  /**
   * Starts camera capture.
   *
   * You can call this method to start capturing video from one or more cameras by specifying sourceType.
   *
   * @param sourceType The type of the video source. See VideoSourceType.
   *  On the desktop platforms, you can capture video from up to 4 cameras.
   * @param config The configuration of the video capture. See CameraCapturerConfiguration.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract startCameraCapture(
    sourceType: VideoSourceType,
    config: CameraCapturerConfiguration
  ): number;

  /**
   * Stops camera capture.
   *
   * After calling startCameraCapture to start capturing video through one or more cameras, you can call this method and set the sourceType parameter to stop the capture from the specified cameras. If you are using the local video mixing function, calling this method can cause the local video mixing to be interrupted.
   *
   * @param sourceType The type of the video source. See VideoSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract stopCameraCapture(sourceType: VideoSourceType): number;

  /**
   * Sets the rotation angle of the captured video.
   *
   * This method applies to Windows only.
   *  You must call this method after enableVideo. The setting result will take effect after the camera is successfully turned on, that is, after the SDK triggers the onLocalVideoStateChanged callback and returns the local video state as LocalVideoStreamStateCapturing (1).
   *  When the video capture device does not have the gravity sensing function, you can call this method to manually adjust the rotation angle of the captured video.
   *
   * @param type The video source type. See VideoSourceType.
   * @param orientation The clockwise rotation angle. See VideoOrientation.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setCameraDeviceOrientation(
    type: VideoSourceType,
    orientation: VideoOrientation
  ): number;

  /**
   * @ignore
   */
  abstract setScreenCaptureOrientation(
    type: VideoSourceType,
    orientation: VideoOrientation
  ): number;

  /**
   * Gets the current connection state of the SDK.
   *
   * @returns
   * The current connection state. See ConnectionStateType.
   */
  abstract getConnectionState(): ConnectionStateType;

  /**
   * Adds event handlers
   *
   * The SDK uses the IRtcEngineEventHandler class to send callbacks to the app. The app inherits the methods of this class to receive these callbacks. All methods in this class have default (empty) implementations. Therefore, apps only need to inherits callbacks according to the scenarios. In the callbacks, avoid time-consuming tasks or calling APIs that can block the thread, such as the sendStreamMessage method. Otherwise, the SDK may not work properly.
   *
   * @param eventHandler Callback events to be added. See IRtcEngineEventHandler.
   *
   * @returns
   * true : Success. false : Failure.
   */
  abstract registerEventHandler(eventHandler: IRtcEngineEventHandler): boolean;

  /**
   * Removes the specified callback events.
   *
   * You can call this method too remove all added callback events.
   *
   * @param eventHandler Callback events to be removed. See IRtcEngineEventHandler.
   *
   * @returns
   * true : Success. false : Failure.
   */
  abstract unregisterEventHandler(
    eventHandler: IRtcEngineEventHandler
  ): boolean;

  /**
   * @ignore
   */
  abstract setRemoteUserPriority(
    uid: number,
    userPriority: PriorityType
  ): number;

  /**
   * Sets the built-in encryption mode.
   *
   * Deprecated: Use enableEncryption instead. The SDK supports built-in encryption schemes, AES-128-GCM is supported by default. Call this method to use other encryption modes. All users in the same channel must use the same encryption mode and secret. Refer to the information related to the AES encryption algorithm on the differences between the encryption modes. Before calling this method, please call setEncryptionSecret to enable the built-in encryption function.
   *
   * @param encryptionMode The following encryption modes:
   *  " aes-128-xts ": 128-bit AES encryption, XTS mode.
   *  " aes-128-ecb ": 128-bit AES encryption, ECB mode.
   *  " aes-256-xts ": 256-bit AES encryption, XTS mode.
   *  " sm4-128-ecb ": 128-bit SM4 encryption, ECB mode.
   *  " aes-128-gcm ": 128-bit AES encryption, GCM mode.
   *  " aes-256-gcm ": 256-bit AES encryption, GCM mode.
   *  "": When this parameter is set as null, the encryption mode is set as " aes-128-gcm " by default.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setEncryptionMode(encryptionMode: string): number;

  /**
   * Enables built-in encryption with an encryption password before users join a channel.
   *
   * Deprecated: Use enableEncryption instead. Before joining the channel, you need to call this method to set the secret parameter to enable the built-in encryption. All users in the same channel should use the same secret. The secret is automatically cleared once a user leaves the channel. If you do not specify the secret or secret is set as null, the built-in encryption is disabled.
   *  Do not use this method for Media Push.
   *  For optimal transmission, ensure that the encrypted data size does not exceed the original data size + 16 bytes. 16 bytes is the maximum padding size for AES encryption.
   *
   * @param secret The encryption password.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setEncryptionSecret(secret: string): number;

  /**
   * Enables or disables the built-in encryption.
   *
   * In scenarios requiring high security, Agora recommends calling this method to enable the built-in encryption before joining a channel. All users in the same channel must use the same encryption mode and encryption key. After the user leaves the channel, the SDK automatically disables the built-in encryption. To enable the built-in encryption, call this method before the user joins the channel again. If you enable the built-in encryption, you cannot use the Media Push function.
   *
   * @param enabled Whether to enable built-in encryption: true : Enable the built-in encryption. false : (Default) Disable the built-in encryption.
   * @param config Built-in encryption configurations. See EncryptionConfig.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -2: An invalid parameter is used. Set the parameter with a valid value.
   *  -4: The built-in encryption mode is incorrect or the SDK fails to load the external encryption library. Check the enumeration or reload the external encryption library.
   *  -7: The SDK is not initialized. Initialize the IRtcEngine instance before calling this method.
   */
  abstract enableEncryption(enabled: boolean, config: EncryptionConfig): number;

  /**
   * Creates a data stream.
   *
   * @param config The configurations for the data stream. See DataStreamConfig.
   *
   * @returns
   * ID of the created data stream, if the method call succeeds.
   *  < 0: Failure.
   */
  abstract createDataStream(config: DataStreamConfig): number;

  /**
   * Sends data stream messages.
   *
   * Sends data stream messages to all users in a channel. The SDK has the following restrictions on this method:
   *  Up to 30 packets can be sent per second in a channel with each packet having a maximum size of 1 KB.
   *  Each client can send up to 6 KB of data per second.
   *  Each user can have up to five data streams simultaneously. A successful method call triggers the onStreamMessage callback on the remote client, from which the remote user gets the stream message. A failed method call triggers the onStreamMessageError callback on the remote client.
   *  Ensure that you call createDataStream to create a data channel before calling this method.
   *  In live streaming scenarios, this method only applies to hosts.
   *
   * @param streamId The data stream ID. You can get the data stream ID by calling createDataStream.
   * @param data The message to be sent.
   * @param length The length of the data.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract sendStreamMessage(
    streamId: number,
    data: Uint8Array,
    length: number
  ): number;

  /**
   * Adds a watermark image to the local video.
   *
   * This method adds a PNG watermark image to the local video in the live streaming. Once the watermark image is added, all the audience in the channel (CDN audience included), and the capturing device can see and capture it. The Agora SDK supports adding only one watermark image onto a local video or CDN live stream. The newly added watermark image replaces the previous one. The watermark coordinates are dependent on the settings in the setVideoEncoderConfiguration method:
   *  If the orientation mode of the encoding video (OrientationMode) is fixed landscape mode or the adaptive landscape mode, the watermark uses the landscape orientation.
   *  If the orientation mode of the encoding video (OrientationMode) is fixed portrait mode or the adaptive portrait mode, the watermark uses the portrait orientation.
   *  When setting the watermark position, the region must be less than the dimensions set in the setVideoEncoderConfiguration method; otherwise, the watermark image will be cropped.
   *  Ensure that calling this method after enableVideo.
   *  If you only want to add a watermark to the media push, you can call this method or the startRtmpStreamWithTranscoding method.
   *  This method supports adding a watermark image in the PNG file format only. Supported pixel formats of the PNG image are RGBA, RGB, Palette, Gray, and Alpha_gray.
   *  If the dimensions of the PNG image differ from your settings in this method, the image will be cropped or zoomed to conform to your settings.
   *  If you have enabled the mirror mode for the local video, the watermark on the local video is also mirrored. To avoid mirroring the watermark, Agora recommends that you do not use the mirror and watermark functions for the local video at the same time. You can implement the watermark function in your application layer.
   *
   * @param watermarkUrl The local file path of the watermark image to be added. This method supports adding a watermark image from the local absolute or relative file path.
   * @param options The options of the watermark image to be added. See WatermarkOptions.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract addVideoWatermark(
    watermarkUrl: string,
    options: WatermarkOptions
  ): number;

  /**
   * Removes the watermark image from the video stream.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract clearVideoWatermarks(): number;

  /**
   * @ignore
   */
  abstract pauseAudio(): number;

  /**
   * @ignore
   */
  abstract resumeAudio(): number;

  /**
   * Enables interoperability with the Agora Web SDK (applicable only in the live streaming scenarios).
   *
   * Deprecated: The SDK automatically enables interoperability with the Web SDK, so you no longer need to call this method. You can call this method to enable or disable interoperability with the Agora Web SDK. If a channel has Web SDK users, ensure that you call this method, or the video of the Native user will be a black screen for the Web user. This method is only applicable in live streaming scenarios, and interoperability is enabled by default in communication scenarios.
   *
   * @param enabled Whether to enable interoperability: true : Enable interoperability. false : (Default) Disable interoperability.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract enableWebSdkInteroperability(enabled: boolean): number;

  /**
   * Reports customized messages.
   *
   * Agora supports reporting and analyzing customized messages. This function is in the beta stage with a free trial. The ability provided in its beta test version is reporting a maximum of 10 message pieces within 6 seconds, with each message piece not exceeding 256 bytes and each string not exceeding 100 bytes. To try out this function, contact and discuss the format of customized messages with us.
   */
  abstract sendCustomReportMessage(
    id: string,
    category: string,
    event: string,
    label: string,
    value: number
  ): number;

  /**
   * Registers the metadata observer.
   *
   * You need to implement the IMetadataObserver class and specify the metadata type in this method. This method enables you to add synchronized metadata in the video stream for more diversified
   *  live interactive streaming, such as sending shopping links, digital coupons, and online quizzes. Call this method before joinChannel.
   *
   * @param observer The metadata observer. See IMetadataObserver.
   * @param type The metadata type. The SDK currently only supports VideoMetadata. See MetadataType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract registerMediaMetadataObserver(
    observer: IMetadataObserver,
    type: MetadataType
  ): number;

  /**
   * Unregisters the specified metadata observer.
   *
   * @param observer The metadata observer. See IMetadataObserver.
   * @param type The metadata type. The SDK currently only supports VideoMetadata. See MetadataType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract unregisterMediaMetadataObserver(
    observer: IMetadataObserver,
    type: MetadataType
  ): number;

  /**
   * @ignore
   */
  abstract startAudioFrameDump(
    channelId: string,
    userId: number,
    location: string,
    uuid: string,
    passwd: string,
    durationMs: number,
    autoUpload: boolean
  ): number;

  /**
   * @ignore
   */
  abstract stopAudioFrameDump(
    channelId: string,
    userId: number,
    location: string
  ): number;

  /**
   * Sets whether to enable the AI ​​noise suppression function and set the noise suppression mode.
   *
   * You can call this method to enable AI noise suppression function. Once enabled, the SDK automatically detects and reduces stationary and non-stationary noise from your audio on the premise of ensuring the quality of human voice. Stationary noise refers to noise signal with constant average statistical properties and negligibly small fluctuations of level within the period of observation. Common sources of stationary noises are:
   *  Television;
   *  Air conditioner;
   *  Machinery, etc. Non-stationary noise refers to noise signal with huge fluctuations of level within the period of observation; common sources of non-stationary noises are:
   *  Thunder;
   *  Explosion;
   *  Cracking, etc.
   *
   * @param enabled Whether to enable the AI noise suppression function: true : Enable the AI noise suppression. false : (Default) Disable the AI noise suppression.
   * @param mode The AI noise suppression modes. See AudioAinsMode.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setAINSMode(enabled: boolean, mode: AudioAinsMode): number;

  /**
   * Registers a user account.
   *
   * Once registered, the user account can be used to identify the local user when the user joins the channel. After the registration is successful, the user account can identify the identity of the local user, and the user can use it to join the channel. This method is optional. If you want to join a channel using a user account, you can choose one of the following methods:
   *  Call the registerLocalUserAccount method to register a user account, and then call the joinChannelWithUserAccount method to join a channel, which can shorten the time it takes to enter the channel.
   *  Call the joinChannelWithUserAccount method to join a channel.
   *  Ensure that the userAccount is unique in the channel.
   *  To ensure smooth communication, use the same parameter type to identify the user. For example, if a user joins the channel with a user ID, then ensure all the other users use the user ID too. The same applies to the user account. If a user joins the channel with the Agora Web SDK, ensure that the ID of the user is set to the same parameter type.
   *
   * @param appId The App ID of your project on Agora Console.
   * @param userAccount The user account. This parameter is used to identify the user in the channel for real-time audio and video engagement. You need to set and manage user accounts yourself and ensure that each user account in the same channel is unique. The maximum length of this parameter is 255 bytes. Ensure that you set this parameter and do not set it as null. Supported characters are as follow(89 in total):
   *  The 26 lowercase English letters: a to z.
   *  The 26 uppercase English letters: A to Z.
   *  All numeric characters: 0 to 9.
   *  Space
   *  "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract registerLocalUserAccount(appId: string, userAccount: string): number;

  /**
   * Joins the channel with a user account, and configures whether to automatically subscribe to audio or video streams after joining the channel.
   *
   * To ensure smooth communication, use the same parameter type to identify the user. For example, if a user joins the channel with a user ID, then ensure all the other users use the user ID too. The same applies to the user account. If a user joins the channel with the Agora Web SDK, ensure that the ID of the user is set to the same parameter type.
   *  If you choose the Testing Mode (using an App ID for authentication) for your project and call this method to join a channel, you will automatically exit the channel after 24 hours. This method allows a user to join the channel with the user account. After the user successfully joins the channel, the SDK triggers the following callbacks:
   *  The local client: onLocalUserRegistered, onJoinChannelSuccess and onConnectionStateChanged callbacks.
   *  The remote client: The onUserJoined callback, if the user is in the COMMUNICATION profile, and the onUserInfoUpdated callback if the user is a host in the LIVE_BROADCASTING profile. Once a user joins the channel, the user subscribes to the audio and video streams of all the other users in the channel by default, giving rise to usage and billing calculation. To stop subscribing to a specified stream or all remote streams, call the corresponding mute methods.
   *
   * @param token The token generated on your server for authentication. If you need to join different channels at the same time or switch between channels, Agora recommends using a wildcard token so that you don't need to apply for a new token every time joining a channel.
   * @param channelId The channel name. This parameter signifies the channel in which users engage in real-time audio and video interaction. Under the premise of the same App ID, users who fill in the same channel ID enter the same channel for audio and video interaction. The string length must be less than 64 bytes. Supported characters (89 characters in total):
   *  All lowercase English letters: a to z.
   *  All uppercase English letters: A to Z.
   *  All numeric characters: 0 to 9.
   *  "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
   * @param userAccount The user account. This parameter is used to identify the user in the channel for real-time audio and video engagement. You need to set and manage user accounts yourself and ensure that each user account in the same channel is unique. The maximum length of this parameter is 255 bytes. Ensure that you set this parameter and do not set it as null. Supported characters are as follows(89 in total):
   *  The 26 lowercase English letters: a to z.
   *  The 26 uppercase English letters: A to Z.
   *  All numeric characters: 0 to 9.
   *  Space
   *  "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
   * @param options The channel media options. See ChannelMediaOptions.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -2: The parameter is invalid. For example, the token is invalid, the uid parameter is not set to an integer, or the value of a member in ChannelMediaOptions is invalid. You need to pass in a valid parameter and join the channel again.
   *  -3: Failes to initialize the IRtcEngine object. You need to reinitialize the IRtcEngine object.
   *  -7: The IRtcEngine object has not been initialized. You need to initialize the IRtcEngine object before calling this method.
   *  -8: The internal state of the IRtcEngine object is wrong. The typical cause is that you call this method to join the channel without calling startEchoTest to stop the test after calling stopEchoTest to start a call loop test. You need to call stopEchoTest before calling this method.
   *  -17: The request to join the channel is rejected. The typical cause is that the user is in the channel. Agora recommends that you use the onConnectionStateChanged callback to determine whether the user exists in the channel. Do not call this method to join the channel unless you receive the ConnectionStateDisconnected (1) state.
   *  -102: The channel name is invalid. You need to pass in a valid channelname in channelId to rejoin the channel.
   *  -121: The user ID is invalid. You need to pass in a valid user ID in uid to rejoin the channel.
   */
  abstract joinChannelWithUserAccount(
    token: string,
    channelId: string,
    userAccount: string,
    options?: ChannelMediaOptions
  ): number;

  /**
   * Joins the channel with a user account, and configures whether to automatically subscribe to audio or video streams after joining the channel.
   *
   * This method allows a user to join the channel with the user account. After the user successfully joins the channel, the SDK triggers the following callbacks:
   *  The local client: onLocalUserRegistered, onJoinChannelSuccess and onConnectionStateChanged callbacks.
   *  The remote client: The onUserJoined callback, if the user is in the COMMUNICATION profile, and the onUserInfoUpdated callback if the user is a host in the LIVE_BROADCASTING profile. Once a user joins the channel, the user subscribes to the audio and video streams of all the other users in the channel by default, giving rise to usage and billing calculation. To stop subscribing to a specified stream or all remote streams, call the corresponding mute methods. To ensure smooth communication, use the same parameter type to identify the user. For example, if a user joins the channel with a user ID, then ensure all the other users use the user ID too. The same applies to the user account. If a user joins the channel with the Agora Web SDK, ensure that the ID of the user is set to the same parameter type.
   *
   * @param token The token generated on your server for authentication. If you need to join different channels at the same time or switch between channels, Agora recommends using a wildcard token so that you don't need to apply for a new token every time joining a channel.
   * @param channelId The channel name. This parameter signifies the channel in which users engage in real-time audio and video interaction. Under the premise of the same App ID, users who fill in the same channel ID enter the same channel for audio and video interaction. The string length must be less than 64 bytes. Supported characters (89 characters in total):
   *  All lowercase English letters: a to z.
   *  All uppercase English letters: A to Z.
   *  All numeric characters: 0 to 9.
   *  "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
   * @param userAccount The user account. This parameter is used to identify the user in the channel for real-time audio and video engagement. You need to set and manage user accounts yourself and ensure that each user account in the same channel is unique. The maximum length of this parameter is 255 bytes. Ensure that you set this parameter and do not set it as null. Supported characters are as follows(89 in total):
   *  The 26 lowercase English letters: a to z.
   *  The 26 uppercase English letters: A to Z.
   *  All numeric characters: 0 to 9.
   *  Space
   *  "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
   * @param options The channel media options. See ChannelMediaOptions.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract joinChannelWithUserAccountEx(
    token: string,
    channelId: string,
    userAccount: string,
    options: ChannelMediaOptions
  ): number;

  /**
   * Gets the user information by passing in the user account.
   *
   * After a remote user joins the channel, the SDK gets the UID and user account of the remote user, caches them in a mapping table object, and triggers the onUserInfoUpdated callback on the local client. After receiving the callback, you can call this method and pass in the user account to get the UID of the remote user from the UserInfo object.
   *
   * @param userAccount The user account.
   *
   * @returns
   * A pointer to the UserInfo instance, if the method call succeeds.
   *  If the call fails, returns null.
   */
  abstract getUserInfoByUserAccount(userAccount: string): UserInfo;

  /**
   * Gets the user information by passing in the user ID.
   *
   * After a remote user joins the channel, the SDK gets the UID and user account of the remote user, caches them in a mapping table object, and triggers the onUserInfoUpdated callback on the local client. After receiving the callback, you can call this method and passi in the UID.to get the user account of the specified user from the UserInfo object.
   *
   * @param uid The user ID.
   *
   * @returns
   * A pointer to the UserInfo instance, if the method call succeeds.
   *  If the call fails, returns null.
   */
  abstract getUserInfoByUid(uid: number): UserInfo;

  /**
   * Starts relaying media streams across channels or updates channels for media relay.
   *
   * The first successful call to this method starts relaying media streams from the source channel to the destination channels. To relay the media stream to other channels, or exit one of the current media relays, you can call this method again to update the destination channels. This feature supports relaying media streams to a maximum of six destination channels. After a successful method call, the SDK triggers the onChannelMediaRelayStateChanged callback, and this callback returns the state of the media stream relay. Common states are as follows:
   *  If the onChannelMediaRelayStateChanged callback returns RelayStateRunning (2) and RelayOk (0), it means that the SDK starts relaying media streams from the source channel to the destination channel.
   *  If the onChannelMediaRelayStateChanged callback returns RelayStateFailure (3), an exception occurs during the media stream relay.
   *  Call this method after joining the channel.
   *  This method takes effect only when you are a host in a live streaming channel.
   *  The relaying media streams across channels function needs to be enabled by contacting.
   *  Agora does not support string user accounts in this API.
   *
   * @param configuration The configuration of the media stream relay. See ChannelMediaRelayConfiguration.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -1: A general error occurs (no specified reason).
   *  -2: The parameter is invalid.
   *  -7: The method call was rejected. It may be because the SDK has not been initialized successfully, or the user role is not a host.
   *  -8: Internal state error. Probably because the user is not a broadcaster.
   */
  abstract startOrUpdateChannelMediaRelay(
    configuration: ChannelMediaRelayConfiguration
  ): number;

  /**
   * @ignore
   */
  abstract startChannelMediaRelay(
    configuration: ChannelMediaRelayConfiguration
  ): number;

  /**
   * @ignore
   */
  abstract updateChannelMediaRelay(
    configuration: ChannelMediaRelayConfiguration
  ): number;

  /**
   * Stops the media stream relay. Once the relay stops, the host quits all the target channels.
   *
   * After a successful method call, the SDK triggers the onChannelMediaRelayStateChanged callback. If the callback reports RelayStateIdle (0) and RelayOk (0), the host successfully stops the relay. If the method call fails, the SDK triggers the onChannelMediaRelayStateChanged callback with the RelayErrorServerNoResponse (2) or RelayErrorServerConnectionLost (8) status code. You can call the leaveChannel method to leave the channel, and the media stream relay automatically stops.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract stopChannelMediaRelay(): number;

  /**
   * Pauses the media stream relay to all target channels.
   *
   * After the cross-channel media stream relay starts, you can call this method to pause relaying media streams to all target channels; after the pause, if you want to resume the relay, call resumeAllChannelMediaRelay. Call this method after startOrUpdateChannelMediaRelay.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract pauseAllChannelMediaRelay(): number;

  /**
   * Resumes the media stream relay to all target channels.
   *
   * After calling the pauseAllChannelMediaRelay method, you can call this method to resume relaying media streams to all destination channels. Call this method after pauseAllChannelMediaRelay.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract resumeAllChannelMediaRelay(): number;

  /**
   * Sets the audio profile of the audio streams directly pushed to the CDN by the host.
   *
   * @param profile The audio profile, including the sampling rate, bitrate, encoding mode, and the number of channels. See AudioProfileType.
   */
  abstract setDirectCdnStreamingAudioConfiguration(
    profile: AudioProfileType
  ): number;

  /**
   * Sets the video profile of the media streams directly pushed to the CDN by the host.
   *
   * This method only affects video streams captured by cameras or screens, or from custom video capture sources. That is, when you set publishCameraTrack or publishCustomVideoTrack in DirectCdnStreamingMediaOptions as true to capture videos, you can call this method to set the video profiles. If your local camera does not support the video resolution you set,the SDK automatically adjusts the video resolution to a value that is closest to your settings for capture, encoding or streaming, with the same aspect ratio as the resolution you set. You can get the actual resolution of the video streams through the onDirectCdnStreamingStats callback.
   *
   * @param config Video profile. See VideoEncoderConfiguration. During CDN live streaming, Agora only supports setting OrientationMode as OrientationFixedLandscape or OrientationFixedPortrait.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setDirectCdnStreamingVideoConfiguration(
    config: VideoEncoderConfiguration
  ): number;

  /**
   * Starts pushing media streams to the CDN directly.
   *
   * Aogra does not support pushing media streams to one URL repeatedly. Media options Agora does not support setting the value of publishCameraTrack and publishCustomVideoTrack as true, or the value of publishMicrophoneTrack and publishCustomAudioTrack as true at the same time. When choosing media setting options (DirectCdnStreamingMediaOptions), you can refer to the following examples: If you want to push audio and video streams captured by the host from a custom source, the media setting options should be set as follows: publishCustomAudioTrack is set as true and call the pushAudioFrame method publishCustomVideoTrack is set as true and call the pushVideoFrame method publishCameraTrack is set as false (the default value) publishMicrophoneTrack is set as false (the default value) As of v4.2.0, Agora SDK supports audio-only live streaming. You can set publishCustomAudioTrack or publishMicrophoneTrack in DirectCdnStreamingMediaOptions as true and call pushAudioFrame to push audio streams. Agora only supports pushing one audio and video streams or one audio streams to CDN.
   *
   * @param eventHandler See onDirectCdnStreamingStateChanged and onDirectCdnStreamingStats.
   * @param publishUrl The CDN live streaming URL.
   * @param options The media setting options for the host. See DirectCdnStreamingMediaOptions.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract startDirectCdnStreaming(
    eventHandler: IDirectCdnStreamingEventHandler,
    publishUrl: string,
    options: DirectCdnStreamingMediaOptions
  ): number;

  /**
   * Stops pushing media streams to the CDN directly.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract stopDirectCdnStreaming(): number;

  /**
   * @ignore
   */
  abstract updateDirectCdnStreamingMediaOptions(
    options: DirectCdnStreamingMediaOptions
  ): number;

  /**
   * @ignore
   */
  abstract startRhythmPlayer(
    sound1: string,
    sound2: string,
    config: AgoraRhythmPlayerConfig
  ): number;

  /**
   * @ignore
   */
  abstract stopRhythmPlayer(): number;

  /**
   * @ignore
   */
  abstract configRhythmPlayer(config: AgoraRhythmPlayerConfig): number;

  /**
   * Takes a snapshot of a video stream.
   *
   * This method takes a snapshot of a video stream from the specified user, generates a JPG image, and saves it to the specified path. The method is asynchronous, and the SDK has not taken the snapshot when the method call returns. After a successful method call, the SDK triggers the onSnapshotTaken callback to report whether the snapshot is successfully taken, as well as the details for that snapshot.
   *  Call this method after joining a channel.
   *  When used for local video snapshots, this method takes a snapshot for the video streams specified in ChannelMediaOptions.
   *  If the user's video has been preprocessed, for example, watermarked or beautified, the resulting snapshot includes the pre-processing effect.
   *
   * @param uid The user ID. Set uid as 0 if you want to take a snapshot of the local user's video.
   * @param filePath The local path (including filename extensions) of the snapshot. For example:
   *  Windows: C:\Users\<user_name>\AppData\Local\Agora\<process_name>\example.jpg
   *  macOS: ～/Library/Logs/example.jpg Ensure that the path you specify exists and is writable.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract takeSnapshot(uid: number, filePath: string): number;

  /**
   * Enables or disables video screenshot and upload.
   *
   * When video screenshot and upload function is enabled, the SDK takes screenshots and uploads videos sent by local users based on the type and frequency of the module you set in ContentInspectConfig. After video screenshot and upload, the Agora server sends the callback notification to your app server in HTTPS requests and sends all screenshots to the third-party cloud storage service. Before calling this method, ensure that you have contacted to activate the video screenshot upload service.
   *
   * @param enabled Whether to enable video screenshot and upload : true : Enables video screenshot and upload. false : Disables video screenshot and upload.
   * @param config Configuration of video screenshot and upload. See ContentInspectConfig. When the video moderation module is set to video moderation via Agora self-developed extension(ContentInspectSupervision), the video screenshot and upload dynamic library libagora_content_inspect_extension.dll is required. Deleting this library disables the screenshot and upload feature.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract enableContentInspect(
    enabled: boolean,
    config: ContentInspectConfig
  ): number;

  /**
   * Adjusts the volume of the custom audio track played remotely.
   *
   * Ensure you have called the createCustomAudioTrack method to create a custom audio track before calling this method. If you want to change the volume of the audio played remotely, you need to call this method again.
   *
   * @param trackId The audio track ID. Set this parameter to the custom audio track ID returned in createCustomAudioTrack.
   * @param volume The volume of the audio source. The value can range from 0 to 100. 0 means mute; 100 means the original volume.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract adjustCustomAudioPublishVolume(
    trackId: number,
    volume: number
  ): number;

  /**
   * Adjusts the volume of the custom audio track played locally.
   *
   * Ensure you have called the createCustomAudioTrack method to create a custom audio track before calling this method. If you want to change the volume of the audio to be played locally, you need to call this method again.
   *
   * @param trackId The audio track ID. Set this parameter to the custom audio track ID returned in createCustomAudioTrack.
   * @param volume The volume of the audio source. The value can range from 0 to 100. 0 means mute; 100 means the original volume.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract adjustCustomAudioPlayoutVolume(
    trackId: number,
    volume: number
  ): number;

  /**
   * Sets up cloud proxy service.
   *
   * When users' network access is restricted by a firewall, configure the firewall to allow specific IP addresses and ports provided by Agora; then, call this method to enable the cloud proxyType and set the cloud proxy type with the proxyType parameter. After successfully connecting to the cloud proxy, the SDK triggers the onConnectionStateChanged (ConnectionStateConnecting, ConnectionChangedSettingProxyServer) callback. To disable the cloud proxy that has been set, call the setCloudProxy (NoneProxy). To change the cloud proxy type that has been set, call the setCloudProxy (NoneProxy) first, and then call the setCloudProxy to set the proxyType you want.
   *  Agora recommends that you call this method after joining a channel.
   *  When a user is behind a firewall and uses the Force UDP cloud proxy, the services for Media Push and cohosting across channels are not available.
   *  When you use the Force TCP cloud proxy, note that an error would occur when calling the startAudioMixing method to play online music files in the HTTP protocol. The services for Media Push and cohosting across channels use the cloud proxy with the TCP protocol.
   *
   * @param proxyType The type of the cloud proxy. See CloudProxyType. This parameter is mandatory. The SDK reports an error if you do not pass in a value.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -2: The parameter is invalid.
   *  -7: The SDK is not initialized.
   */
  abstract setCloudProxy(proxyType: CloudProxyType): number;

  /**
   * @ignore
   */
  abstract setLocalAccessPoint(config: LocalAccessPointConfiguration): number;

  /**
   * Sets audio advanced options.
   *
   * If you have advanced audio processing requirements, such as capturing and sending stereo audio, you can call this method to set advanced audio options. Call this method after calling joinChannel, enableAudio and enableLocalAudio.
   *
   * @param options The advanced options for audio. See AdvancedAudioOptions.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setAdvancedAudioOptions(
    options: AdvancedAudioOptions,
    sourceType?: number
  ): number;

  /**
   * @ignore
   */
  abstract setAVSyncSource(channelId: string, uid: number): number;

  /**
   * Sets whether to replace the current video feeds with images when publishing video streams.
   *
   * Agora recommends that you call this method after joining a channel. When publishing video streams, you can call this method to replace the current video feeds with custom images. Once you enable this function, you can select images to replace the video feeds through the ImageTrackOptions parameter. If you disable this function, the remote users see the video feeds that you publish.
   *
   * @param enable Whether to replace the current video feeds with custom images: true : Replace the current video feeds with custom images. false : (Default) Do not replace the current video feeds with custom images.
   * @param options Image configurations. See ImageTrackOptions.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract enableVideoImageSource(
    enable: boolean,
    options: ImageTrackOptions
  ): number;

  /**
   * Gets the current Monotonic Time of the SDK.
   *
   * Monotonic Time refers to a monotonically increasing time series whose value increases over time. The unit is milliseconds. In custom video capture and custom audio capture scenarios, in order to ensure audio and video synchronization, Agora recommends that you call this method to obtain the current Monotonic Time of the SDK, and then pass this value into the timestamp parameter in the captured video frame (VideoFrame) and audio frame (AudioFrame).
   *
   * @returns
   * ≥0: The method call is successful, and returns the current Monotonic Time of the SDK (in milliseconds).
   *  < 0: Failure.
   */
  abstract getCurrentMonotonicTimeInMs(): number;

  /**
   * @ignore
   */
  abstract enableWirelessAccelerate(enabled: boolean): number;

  /**
   * Gets the type of the local network connection.
   *
   * You can use this method to get the type of network in use at any stage. You can call this method either before or after joining a channel.
   *
   * @returns
   * ≥ 0: The method call is successful, and the local network connection type is returned.
   *  0: The SDK disconnects from the network.
   *  1: The network type is LAN.
   *  2: The network type is Wi-Fi (including hotspots).
   *  3: The network type is mobile 2G.
   *  4: The network type is mobile 3G.
   *  5: The network type is mobile 4G.
   *  6: The network type is mobile 5G.
   *  < 0: The method call failed with an error code.
   *  -1: The network type is unknown.
   */
  abstract getNetworkType(): number;

  /**
   * Provides technical preview functionalities or special customizations by configuring the SDK with JSON options.
   *
   * @param parameters Pointer to the set parameters in a JSON string.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setParameters(parameters: string): number;

  /**
   * Enables tracing the video frame rendering process.
   *
   * The SDK starts tracing the rendering status of the video frames in the channel from the moment this method is successfully called and reports information about the event through the onVideoRenderingTracingResult callback.
   *  By default, the SDK starts tracing the video rendering event automatically when the local user successfully joins the channel. You can call this method at an appropriate time according to the actual application scenario to customize the tracing process.
   *  After the local user leaves the current channel, the SDK automatically resets the time point to the next time when the user successfully joins the channel.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -7: The method is called before IRtcEngine is initialized.
   */
  abstract startMediaRenderingTracing(): number;

  /**
   * Enables audio and video frame instant rendering.
   *
   * After successfully calling this method, the SDK enables the instant frame rendering mode, which can speed up the first frame rendering speed after the user joins the channel.
   *  Once the instant rendering function is enabled, it can only be canceled by calling the release method to destroy the IRtcEngine object.
   *  In this mode, the SDK uses Agora's custom encryption algorithm to shorten the time required to establish transmission links, and the security is reduced compared to the standard DTLS (Datagram Transport Layer Security). If the application scenario requires higher security standards, Agora recommends that you do not use this method.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -7: The method is called before IRtcEngine is initialized.
   */
  abstract enableInstantMediaRendering(): number;

  /**
   * Gets the current NTP (Network Time Protocol) time.
   *
   * In the real-time chorus scenario, especially when the downlink connections are inconsistent due to network issues among multiple receiving ends, you can call this method to obtain the current NTP time as the reference time, in order to align the lyrics and music of multiple receiving ends and achieve chorus synchronization.
   *
   * @returns
   * The Unix timestamp (ms) of the current NTP time.
   */
  abstract getNtpWallTimeInMs(): number;

  /**
   * Checks whether the device supports the specified advanced feature.
   *
   * Checks whether the capabilities of the current device meet the requirements for advanced features such as virtual background and image enhancement.
   *
   * @param type The type of the advanced feature, see FeatureType.
   *
   * @returns
   * true : The current device supports the specified feature. false : The current device does not support the specified feature.
   */
  abstract isFeatureAvailableOnDevice(type: FeatureType): boolean;

  /**
   * Gets the IAudioDeviceManager object to manage audio devices.
   *
   * @returns
   * One IAudioDeviceManager object.
   */
  abstract getAudioDeviceManager(): IAudioDeviceManager;

  /**
   * Gets the IVideoDeviceManager object to manage video devices.
   *
   * @returns
   * One IVideoDeviceManager object.
   */
  abstract getVideoDeviceManager(): IVideoDeviceManager;

  /**
   * Gets IMusicContentCenter.
   *
   * @returns
   * One IMusicContentCenter object.
   */
  abstract getMusicContentCenter(): IMusicContentCenter;

  /**
   * Gets one IMediaEngine object.
   *
   * Make sure the IRtcEngine is initialized before you call this method.
   *
   * @returns
   * One IMediaEngine object.
   */
  abstract getMediaEngine(): IMediaEngine;

  /**
   * Gets one ILocalSpatialAudioEngine object.
   *
   * Make sure the IRtcEngine is initialized before you call this method.
   *
   * @returns
   * One ILocalSpatialAudioEngine object.
   */
  abstract getLocalSpatialAudioEngine(): ILocalSpatialAudioEngine;

  /**
   * Sends media metadata.
   *
   * If the metadata is sent successfully, the SDK triggers the onMetadataReceived callback on the receiver.
   *
   * @param metadata Media metadata. See Metadata.
   * @param sourceType The type of the video source. See VideoSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract sendMetaData(
    metadata: Metadata,
    sourceType: VideoSourceType
  ): number;

  /**
   * Sets the maximum size of the media metadata.
   *
   * After calling registerMediaMetadataObserver, you can call this method to set the maximum size of the media metadata.
   *
   * @param size The maximum size of media metadata.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setMaxMetadataSize(size: number): number;

  /**
   * Destroys a video renderer object.
   *
   * @param view The HTMLElement object to be destroyed.
   */
  abstract destroyRendererByView(view: any): void;

  /**
   * Destroys multiple video renderer objects at one time.
   *
   * @param sourceType The type of the video source. See VideoSourceType.
   * @param channelId The channel name. This parameter signifies the channel in which users engage in real-time audio and video interaction. Under the premise of the same App ID, users who fill in the same channel ID enter the same channel for audio and video interaction. The string length must be less than 64 bytes. Supported characters (89 characters in total):
   *  All lowercase English letters: a to z.
   *  All uppercase English letters: A to Z.
   *  All numeric characters: 0 to 9.
   *  "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
   * @param uid The user ID of the remote user.
   */
  abstract destroyRendererByConfig(
    sourceType: VideoSourceType,
    channelId?: string,
    uid?: number
  ): void;

  /**
   * Unregisters the encoded audio frame observer.
   *
   * @param observer The encoded audio observer. See IAudioEncodedFrameObserver.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract unregisterAudioEncodedFrameObserver(
    observer: IAudioEncodedFrameObserver
  ): number;

  /**
   * Gets the C++ handle of the Native SDK.
   *
   * This method retrieves the C++ handle of the SDK, which is used for registering the audio and video frame observer.
   *
   * @returns
   * The native handle of the SDK.
   */
  abstract getNativeHandle(): number;
}

/**
 * @ignore
 */
export enum QualityReportFormatType {
  /**
   * @ignore
   */
  QualityReportJson = 0,
  /**
   * @ignore
   */
  QualityReportHtml = 1,
}

/**
 * Media device states.
 */
export enum MediaDeviceStateType {
  /**
   * 0: The device is ready for use.
   */
  MediaDeviceStateIdle = 0,
  /**
   * 1: The device is in use.
   */
  MediaDeviceStateActive = 1,
  /**
   * 2: The device is disabled.
   */
  MediaDeviceStateDisabled = 2,
  /**
   * 4: The device is not found.
   */
  MediaDeviceStateNotPresent = 4,
  /**
   * 8: The device is unplugged.
   */
  MediaDeviceStateUnplugged = 8,
}

/**
 * Video profile.
 */
export enum VideoProfileType {
  /**
   * 0: 160 × 120, frame rate 15 fps, bitrate 65 Kbps.
   */
  VideoProfileLandscape120p = 0,
  /**
   * 2: 120 × 120, frame rate 15 fps, bitrate 50 Kbps.
   */
  VideoProfileLandscape120p3 = 2,
  /**
   * 10: 320 × 180, frame rate 15 fps, bitrate 140 Kbps.
   */
  VideoProfileLandscape180p = 10,
  /**
   * 12: 180 × 180, frame rate 15 fps, bitrate 100 Kbps.
   */
  VideoProfileLandscape180p3 = 12,
  /**
   * 13: 240 × 180, frame rate 15 fps, bitrate 120 Kbps.
   */
  VideoProfileLandscape180p4 = 13,
  /**
   * 20: 320 × 240, frame rate 15 fps, bitrate 200 Kbps.
   */
  VideoProfileLandscape240p = 20,
  /**
   * 22: 240 × 240, frame rate 15 fps, bitrate 140 Kbps.
   */
  VideoProfileLandscape240p3 = 22,
  /**
   * 23: 424 × 240, frame rate 15 fps, bitrate 220 Kbps.
   */
  VideoProfileLandscape240p4 = 23,
  /**
   * 30: 640 × 360, frame rate 15 fps, bitrate 400 Kbps.
   */
  VideoProfileLandscape360p = 30,
  /**
   * 32: 360 × 360, frame rate 15 fps, bitrate 260 Kbps.
   */
  VideoProfileLandscape360p3 = 32,
  /**
   * 33: 640 × 360, frame rate 30 fps, bitrate 600 Kbps.
   */
  VideoProfileLandscape360p4 = 33,
  /**
   * 35: 360 × 360, frame rate 30 fps, bitrate 400 Kbps.
   */
  VideoProfileLandscape360p6 = 35,
  /**
   * 36: 480 × 360, frame rate 15 fps, bitrate 320 Kbps.
   */
  VideoProfileLandscape360p7 = 36,
  /**
   * 37: 480 × 360, frame rate 30 fps, bitrate 490 Kbps.
   */
  VideoProfileLandscape360p8 = 37,
  /**
   * 38: 640 × 360, frame rate 15 fps, bitrate 800 Kbps. This profile applies only to the live streaming channel profile.
   */
  VideoProfileLandscape360p9 = 38,
  /**
   * 39: 640 × 360, frame rate 24 fps, bitrate 800 Kbps. This profile applies only to the live streaming channel profile.
   */
  VideoProfileLandscape360p10 = 39,
  /**
   * 100: 640 × 360, frame rate 24 fps, bitrate 1000 Kbps. This profile applies only to the live streaming channel profile.
   */
  VideoProfileLandscape360p11 = 100,
  /**
   * 40: 640 × 480, frame rate 15 fps, bitrate 500 Kbps.
   */
  VideoProfileLandscape480p = 40,
  /**
   * 42: 480 × 480, frame rate 15 fps, bitrate 400 Kbps.
   */
  VideoProfileLandscape480p3 = 42,
  /**
   * 43: 640 × 480, frame rate 30 fps, bitrate 750 Kbps.
   */
  VideoProfileLandscape480p4 = 43,
  /**
   * 45: 480 × 480, frame rate 30 fps, bitrate 600 Kbps.
   */
  VideoProfileLandscape480p6 = 45,
  /**
   * 47: 848 × 480, frame rate 15 fps, bitrate 610 Kbps.
   */
  VideoProfileLandscape480p8 = 47,
  /**
   * 48: 848 × 480, frame rate 30 fps, bitrate 930 Kbps.
   */
  VideoProfileLandscape480p9 = 48,
  /**
   * 49: 640 × 480, frame rate 10 fps, bitrate 400 Kbps.
   */
  VideoProfileLandscape480p10 = 49,
  /**
   * 50: 1280 × 720, frame rate 15 fps, bitrate 1130 Kbps.
   */
  VideoProfileLandscape720p = 50,
  /**
   * 52: 1280 × 720, frame rate 30 fps, bitrate 1710 Kbps.
   */
  VideoProfileLandscape720p3 = 52,
  /**
   * 54: 960 × 720, frame rate 15 fps, bitrate 910 Kbps.
   */
  VideoProfileLandscape720p5 = 54,
  /**
   * 55: 960 × 720, frame rate 30 fps, bitrate 1380 Kbps.
   */
  VideoProfileLandscape720p6 = 55,
  /**
   * 60: 1920 × 1080, frame rate 15 fps, bitrate 2080 Kbps.
   */
  VideoProfileLandscape1080p = 60,
  /**
   * 60: 1920 × 1080, frame rate 30 fps, bitrate 3150 Kbps.
   */
  VideoProfileLandscape1080p3 = 62,
  /**
   * 64: 1920 × 1080, frame rate 60 fps, bitrate 4780 Kbps.
   */
  VideoProfileLandscape1080p5 = 64,
  /**
   * @ignore
   */
  VideoProfileLandscape1440p = 66,
  /**
   * @ignore
   */
  VideoProfileLandscape1440p2 = 67,
  /**
   * @ignore
   */
  VideoProfileLandscape4k = 70,
  /**
   * @ignore
   */
  VideoProfileLandscape4k3 = 72,
  /**
   * 1000: 120 × 160, frame rate 15 fps, bitrate 65 Kbps.
   */
  VideoProfilePortrait120p = 1000,
  /**
   * 1002: 120 × 120, frame rate 15 fps, bitrate 50 Kbps.
   */
  VideoProfilePortrait120p3 = 1002,
  /**
   * 1010: 180 × 320, frame rate 15 fps, bitrate 140 Kbps.
   */
  VideoProfilePortrait180p = 1010,
  /**
   * 1012: 180 × 180, frame rate 15 fps, bitrate 100 Kbps.
   */
  VideoProfilePortrait180p3 = 1012,
  /**
   * 1013: 180 × 240, frame rate 15 fps, bitrate 120 Kbps.
   */
  VideoProfilePortrait180p4 = 1013,
  /**
   * 1020: 240 × 320, frame rate 15 fps, bitrate 200 Kbps.
   */
  VideoProfilePortrait240p = 1020,
  /**
   * 1022: 240 × 240, frame rate 15 fps, bitrate 140 Kbps.
   */
  VideoProfilePortrait240p3 = 1022,
  /**
   * 1023: 240 × 424, frame rate 15 fps, bitrate 220 Kbps.
   */
  VideoProfilePortrait240p4 = 1023,
  /**
   * 1030: 360 × 640, frame rate 15 fps, bitrate 400 Kbps.
   */
  VideoProfilePortrait360p = 1030,
  /**
   * 1032: 360 × 360, frame rate 15 fps, bitrate 260 Kbps.
   */
  VideoProfilePortrait360p3 = 1032,
  /**
   * 1033: 360 × 640, frame rate 15 fps, bitrate 600 Kbps.
   */
  VideoProfilePortrait360p4 = 1033,
  /**
   * 1035: 360 × 360, frame rate 30 fps, bitrate 400 Kbps.
   */
  VideoProfilePortrait360p6 = 1035,
  /**
   * 1036: 360 × 480, frame rate 15 fps, bitrate 320 Kbps.
   */
  VideoProfilePortrait360p7 = 1036,
  /**
   * 1037: 360 × 480, frame rate 30 fps, bitrate 490 Kbps.
   */
  VideoProfilePortrait360p8 = 1037,
  /**
   * 1038: 360 × 640, frame rate 15 fps, bitrate 800 Kbps. This profile applies only to the live streaming channel profile.
   */
  VideoProfilePortrait360p9 = 1038,
  /**
   * 1039: 360 × 640, frame rate 24 fps, bitrate 800 Kbps. This profile applies only to the live streaming channel profile.
   */
  VideoProfilePortrait360p10 = 1039,
  /**
   * 1100: 360 × 640, frame rate 24 fps, bitrate 1000 Kbps. This profile applies only to the live streaming channel profile.
   */
  VideoProfilePortrait360p11 = 1100,
  /**
   * 1040: 480 × 640, frame rate 15 fps, bitrate 500 Kbps.
   */
  VideoProfilePortrait480p = 1040,
  /**
   * 1042: 480 × 480, frame rate 15 fps, bitrate 400 Kbps.
   */
  VideoProfilePortrait480p3 = 1042,
  /**
   * 1043: 480 × 640, frame rate 30 fps, bitrate 750 Kbps.
   */
  VideoProfilePortrait480p4 = 1043,
  /**
   * 1045: 480 × 480, frame rate 30 fps, bitrate 600 Kbps.
   */
  VideoProfilePortrait480p6 = 1045,
  /**
   * 1047: 480 × 848, frame rate 15 fps, bitrate 610 Kbps.
   */
  VideoProfilePortrait480p8 = 1047,
  /**
   * 1048: 480 × 848, frame rate 30 fps, bitrate 930 Kbps.
   */
  VideoProfilePortrait480p9 = 1048,
  /**
   * 1049: 480 × 640, frame rate 10 fps, bitrate 400 Kbps.
   */
  VideoProfilePortrait480p10 = 1049,
  /**
   * 1050: 720 × 1280, frame rate 15 fps, bitrate 1130 Kbps.
   */
  VideoProfilePortrait720p = 1050,
  /**
   * 1052: 720 × 1280, frame rate 30 fps, bitrate 1710 Kbps.
   */
  VideoProfilePortrait720p3 = 1052,
  /**
   * 1054: 720 × 960, frame rate 15 fps, bitrate 910 Kbps.
   */
  VideoProfilePortrait720p5 = 1054,
  /**
   * 1055: 720 × 960, frame rate 30 fps, bitrate 1380 Kbps.
   */
  VideoProfilePortrait720p6 = 1055,
  /**
   * 1060: 1080 × 1920, frame rate 15 fps, bitrate 2080 Kbps.
   */
  VideoProfilePortrait1080p = 1060,
  /**
   * 1062: 1080 × 1920, frame rate 30 fps, bitrate 3150 Kbps.
   */
  VideoProfilePortrait1080p3 = 1062,
  /**
   * 1064: 1080 × 1920, frame rate 60 fps, bitrate 4780 Kbps.
   */
  VideoProfilePortrait1080p5 = 1064,
  /**
   * @ignore
   */
  VideoProfilePortrait1440p = 1066,
  /**
   * @ignore
   */
  VideoProfilePortrait1440p2 = 1067,
  /**
   * @ignore
   */
  VideoProfilePortrait4k = 1070,
  /**
   * @ignore
   */
  VideoProfilePortrait4k3 = 1072,
  /**
   * (Default) 640 × 360, frame rate 15 fps, bitrate 400 Kbps.
   */
  VideoProfileDefault = 30,
}

/**
 * SDK version information.
 */
export class SDKBuildInfo {
  build?: number;
  version?: string;
}

/**
 * The VideoDeviceInfo class that contains the ID and device name of the video devices.
 */
export class VideoDeviceInfo {
  deviceId?: string;
  deviceName?: string;
}
