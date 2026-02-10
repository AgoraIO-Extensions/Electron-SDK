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
  CameraFocalLengthType,
  CameraStabilizationMode,
  CaptureBrightnessLevelType,
  ChannelMediaRelayConfiguration,
  ChannelMediaRelayError,
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
  FaceShapeArea,
  FaceShapeAreaOptions,
  FaceShapeBeautyOptions,
  FilterEffectOptions,
  FocalLengthInfo,
  HdrCapability,
  HeadphoneEqualizerPreset,
  IAudioEncodedFrameObserver,
  LastmileProbeConfig,
  LastmileProbeResult,
  LicenseErrorType,
  LiveTranscoding,
  LocalAccessPointConfiguration,
  LocalAudioMixerConfiguration,
  LocalAudioStats,
  LocalAudioStreamReason,
  LocalAudioStreamState,
  LocalTranscoderConfiguration,
  LocalVideoStreamReason,
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
  RtmpStreamPublishReason,
  RtmpStreamPublishState,
  RtmpStreamingEvent,
  ScreenCaptureParameters,
  ScreenCaptureParameters2,
  ScreenScenarioType,
  SegmentationProperty,
  SenderOptions,
  SimulcastConfig,
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
  VideoDimensions,
  VideoEncoderConfiguration,
  VideoFormat,
  VideoLayout,
  VideoMirrorModeType,
  VideoModuleType,
  VideoOrientation,
  VideoQoePreferenceType,
  VideoRenderingTracingInfo,
  VideoStreamType,
  VideoSubscriptionOptions,
  VideoTranscoderError,
  VirtualBackgroundSource,
  VoiceAiTunerType,
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
  ExtensionContext,
  IAudioSpectrumObserver,
  MediaSourceType,
  RawAudioFrameOpModeType,
  RenderModeType,
  SnapshotConfig,
  VideoSourceType,
} from './AgoraMediaBase';
import { IH265Transcoder } from './IAgoraH265Transcoder';
import { LogConfig, LogFilterType, LogLevel } from './IAgoraLog';
import { AudioMixingDualMonoMode, IMediaEngine } from './IAgoraMediaEngine';
import { IMediaPlayer } from './IAgoraMediaPlayer';
import { IMediaRecorder } from './IAgoraMediaRecorder';
import { IMusicContentCenter } from './IAgoraMusicContentCenter';
import {
  AgoraRhythmPlayerConfig,
  RhythmPlayerReason,
  RhythmPlayerStateType,
} from './IAgoraRhythmPlayer';
import { RtcConnection } from './IAgoraRtcEngineEx';
import { ILocalSpatialAudioEngine } from './IAgoraSpatialAudio';
import { IAudioDeviceManager } from './IAudioDeviceManager';

/**
 * Device type.
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
   * 1: Audio recording device.
   */
  AudioRecordingDevice = 1,
  /**
   * 2: Video rendering device (GPU).
   */
  VideoRenderDevice = 2,
  /**
   * 3: Video capture device.
   */
  VideoCaptureDevice = 3,
  /**
   * 4: Audio application playback device.
   */
  AudioApplicationPlayoutDevice = 4,
  /**
   * (macOS only) 5: Virtual audio playback device (virtual sound card).
   */
  AudioVirtualPlayoutDevice = 5,
  /**
   * (macOS only) 6: Virtual audio recording device (virtual sound card).
   */
  AudioVirtualRecordingDevice = 6,
}

/**
 * Music file playback state.
 */
export enum AudioMixingStateType {
  /**
   * 710: Music file is playing normally.
   */
  AudioMixingStatePlaying = 710,
  /**
   * 711: Music file playback is paused.
   */
  AudioMixingStatePaused = 711,
  /**
   * 713: Music file playback is stopped.
   * This state may be caused by the following reasons:
   *  AudioMixingReasonAllLoopsCompleted(723)
   *  AudioMixingReasonStoppedByUser(724)
   */
  AudioMixingStateStopped = 713,
  /**
   * 714: Error occurred during music file playback.
   * This state may be caused by the following reasons:
   *  AudioMixingReasonCanNotOpen(701)
   *  AudioMixingReasonTooFrequentCall(702)
   *  AudioMixingReasonInterruptedEof(703)
   */
  AudioMixingStateFailed = 714,
}

/**
 * Reason for music file playback state change. Reported in the onAudioMixingStateChanged callback.
 */
export enum AudioMixingReasonType {
  /**
   * 701: Failed to open the music file. For example, the local music file does not exist, the file format is not supported, or the online music file URL is not accessible.
   */
  AudioMixingReasonCanNotOpen = 701,
  /**
   * 702: Music file opened too frequently. If you need to call startAudioMixing multiple times, make sure the interval between calls is greater than 500 ms.
   */
  AudioMixingReasonTooFrequentCall = 702,
  /**
   * 703: Music file playback was interrupted.
   */
  AudioMixingReasonInterruptedEof = 703,
  /**
   * 721: One loop of the music file playback completed.
   */
  AudioMixingReasonOneLoopCompleted = 721,
  /**
   * 723: All loops of the music file playback completed.
   */
  AudioMixingReasonAllLoopsCompleted = 723,
  /**
   * 724: Successfully called stopAudioMixing to stop music file playback.
   */
  AudioMixingReasonStoppedByUser = 724,
  /**
   * @ignore
   */
  AudioMixingReasonResumedByUser = 726,
  /**
   * 0: Successfully opened the music file.
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
 * Center frequency of voice effect equalization bands.
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
 * Audio reverb types.
 */
export enum AudioReverbType {
  /**
   * 0: Original sound intensity, also known as dry signal, range [-20,10], unit: dB.
   */
  AudioReverbDryLevel = 0,
  /**
   * 1: Early reflection signal intensity, also known as wet signal, range [-20,10], unit: dB.
   */
  AudioReverbWetLevel = 1,
  /**
   * 2: Room size for desired reverb effect. Generally, the larger the room, the stronger the reverb. Range [0,100], unit: dB.
   */
  AudioReverbRoomSize = 2,
  /**
   * 3: Initial delay length of the wet signal, range [0,200], unit: milliseconds.
   */
  AudioReverbWetDelay = 3,
  /**
   * 4: Intensity of reverb persistence, range [0,100].
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
  /**
   * @ignore
   */
  StreamFallbackOptionVideoStreamLayer1 = 3,
  /**
   * @ignore
   */
  StreamFallbackOptionVideoStreamLayer2 = 4,
  /**
   * @ignore
   */
  StreamFallbackOptionVideoStreamLayer3 = 5,
  /**
   * @ignore
   */
  StreamFallbackOptionVideoStreamLayer4 = 6,
  /**
   * @ignore
   */
  StreamFallbackOptionVideoStreamLayer5 = 7,
  /**
   * @ignore
   */
  StreamFallbackOptionVideoStreamLayer6 = 8,
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
 * Local video stream statistics.
 */
export class LocalVideoStats {
  /**
   * User ID of the local user.
   */
  uid?: number;
  /**
   * Actual sending bitrate (Kbps) Does not include bitrate for retransmitted video due to packet loss.
   */
  sentBitrate?: number;
  /**
   * Actual sending frame rate (fps). Does not include frame rate for retransmitted video due to packet loss.
   */
  sentFrameRate?: number;
  /**
   * Local video capture frame rate (fps).
   */
  captureFrameRate?: number;
  /**
   * Local video capture width (px).
   */
  captureFrameWidth?: number;
  /**
   * Local video capture height (px).
   */
  captureFrameHeight?: number;
  /**
   * Camera capture frame rate (fps) adjusted by the SDK's built-in video capture adapter (regulator). The regulator adjusts the frame rate based on video encoding configuration.
   */
  regulatedCaptureFrameRate?: number;
  /**
   * Camera capture width (px) adjusted by the SDK's built-in video capture adapter (regulator). The regulator adjusts the resolution based on video encoding configuration.
   */
  regulatedCaptureFrameWidth?: number;
  /**
   * Camera capture height (px) adjusted by the SDK's built-in video capture adapter (regulator). The regulator adjusts the resolution based on video encoding configuration.
   */
  regulatedCaptureFrameHeight?: number;
  /**
   * Output frame rate of the local video encoder, in fps.
   */
  encoderOutputFrameRate?: number;
  /**
   * Video encoding width (px).
   */
  encodedFrameWidth?: number;
  /**
   * Video encoding height (px).
   */
  encodedFrameHeight?: number;
  /**
   * Output frame rate of the local video renderer, in fps.
   */
  rendererOutputFrameRate?: number;
  /**
   * Target encoding bitrate (Kbps) of the current encoder. This value is estimated by the SDK based on current network conditions.
   */
  targetBitrate?: number;
  /**
   * Target encoding frame rate (fps) of the current encoder.
   */
  targetFrameRate?: number;
  /**
   * Adaptation status of local video quality (based on target frame rate and target bitrate) during the statistics interval. See QualityAdaptIndication.
   */
  qualityAdaptIndication?: QualityAdaptIndication;
  /**
   * Video encoding bitrate (Kbps). Does not include bitrate for retransmitted video due to packet loss.
   */
  encodedBitrate?: number;
  /**
   * Number of video frames sent, cumulative.
   */
  encodedFrameCount?: number;
  /**
   * Video codec type. See VideoCodecType.
   */
  codecType?: VideoCodecType;
  /**
   * Video packet loss rate (%) from the local end to the Agora edge server before anti-packet-loss strategies are applied.
   */
  txPacketLossRate?: number;
  /**
   * Brightness level of the locally captured video. See CaptureBrightnessLevelType.
   */
  captureBrightnessLevel?: CaptureBrightnessLevelType;
  /**
   * @ignore
   */
  dualStreamEnabled?: boolean;
  /**
   * Local video encoder acceleration type.
   *  0: Software encoding, no acceleration.
   *  1: Hardware encoding acceleration.
   */
  hwEncoderAccelerating?: number;
  /**
   * @ignore
   */
  simulcastDimensions?: VideoDimensions[];
}

/**
 * Audio statistics of the remote user.
 */
export class RemoteAudioStats {
  /**
   * User ID of the remote user.
   */
  uid?: number;
  /**
   * Audio stream quality sent by the remote user. See QualityType.
   */
  quality?: number;
  /**
   * Network delay from the sender to the receiver (ms).
   */
  networkTransportDelay?: number;
  /**
   * Network delay from the receiver to the jitter buffer (ms). This parameter is not effective when the receiver is an audience member and audienceLatencyLevel in ClientRoleOptions is 1.
   */
  jitterBufferDelay?: number;
  /**
   * Audio frame loss rate (%) of the remote stream during the reporting interval.
   */
  audioLossRate?: number;
  /**
   * Number of audio channels.
   */
  numChannels?: number;
  /**
   * Sampling rate of the received remote audio stream during the reporting interval.
   */
  receivedSampleRate?: number;
  /**
   * Average bitrate (Kbps) of the received remote audio stream during the reporting interval.
   */
  receivedBitrate?: number;
  /**
   * Total duration (ms) of audio freezes after the remote user joined the channel. An audio freeze is counted when the audio frame loss rate exceeds 4% during a call.
   */
  totalFrozenTime?: number;
  /**
   * Percentage (%) of total freeze duration over total effective audio duration. Effective duration refers to the time after the remote user joins the channel and the audio is neither stopped nor disabled.
   */
  frozenRate?: number;
  /**
   * Quality score of the received remote audio stream during the reporting interval, based on Agora's real-time audio MOS (Mean Opinion Score) evaluation method. The return value ranges from [0,500]. Divide the value by 100 to get the MOS score, which ranges from [0,5]. The higher the score, the better the audio quality.
   * The subjective audio quality corresponding to Agora's real-time MOS score is as follows: MOS Score Audio Quality Greater than 4 Excellent audio quality, clear and smooth. 3.5 - 4 Good audio quality, occasional artifacts but still clear. 3 - 3.5 Fair audio quality, occasional stutters, requires some attention to understand. 2.5 - 3 Poor audio quality, frequent stutters, requires concentration to understand. 2 - 2.5 Very poor audio quality, occasional noise, partial loss of meaning, difficult to communicate. Less than 2 Extremely poor audio quality, frequent noise, significant loss of meaning, communication impossible.
   */
  mosValue?: number;
  /**
   * @ignore
   */
  frozenRateByCustomPlcCount?: number;
  /**
   * @ignore
   */
  plcCount?: number;
  /**
   * Effective duration (ms) from the start of the audio call to this callback.
   * Effective duration excludes the total time the remote user was muted.
   */
  totalActiveTime?: number;
  /**
   * Total duration (ms) of the remote audio stream being published.
   */
  publishDuration?: number;
  /**
   * Subjective experience quality of the local user when receiving remote audio. See ExperienceQualityType.
   */
  qoeQuality?: number;
  /**
   * Reason for poor subjective experience quality of the local user when receiving remote audio. See ExperiencePoorReason.
   */
  qualityChangedReason?: number;
  /**
   * @ignore
   */
  rxAudioBytes?: number;
  /**
   * End-to-end audio delay (ms), i.e., the total time from when the remote user starts audio capture to when the local user starts playback.
   */
  e2eDelay?: number;
}

/**
 * Statistics of the remote video stream.
 */
export class RemoteVideoStats {
  /**
   * User ID specifying whose video stream it is.
   */
  uid?: number;
  /**
   * Delay (ms). Deprecated: In audio-video scenarios with audio-video sync, refer to networkTransportDelay and jitterBufferDelay in RemoteAudioStats to understand video delay data.
   */
  delay?: number;
  /**
   * End-to-end video delay (ms). That is, the total time from when the remote user starts video capture to when the local user receives and renders the video.
   */
  e2eDelay?: number;
  /**
   * Width of the video stream (pixels).
   */
  width?: number;
  /**
   * Height of the video stream (pixels).
   */
  height?: number;
  /**
   * Bitrate (Kbps) received since the last report.
   */
  receivedBitrate?: number;
  /**
   * @ignore
   */
  decoderInputFrameRate?: number;
  /**
   * Frame rate output by the remote video decoder, in fps.
   */
  decoderOutputFrameRate?: number;
  /**
   * Frame rate output by the remote video renderer, in fps.
   */
  rendererOutputFrameRate?: number;
  /**
   * Packet loss rate (%) of the remote video.
   */
  frameLossRate?: number;
  /**
   * Packet loss rate (%) of the remote video after applying anti-packet-loss techniques.
   */
  packetLossRate?: number;
  /**
   * Video stream type: high or low. See VideoStreamType.
   */
  rxStreamType?: VideoStreamType;
  /**
   * Total duration (ms) of video freezes after the remote user joined the channel. During the call, if the video frame rate is not lower than 5 fps and the interval between two consecutive rendered frames exceeds 500 ms, it is counted as a video freeze.
   */
  totalFrozenTime?: number;
  /**
   * Percentage (%) of total freeze duration over total effective video duration after the remote user joined the channel. Effective duration refers to the time after the remote user joins the channel and the video is neither stopped nor disabled.
   */
  frozenRate?: number;
  /**
   * Time (ms) by which audio leads video. If negative, it indicates that audio lags behind video.
   */
  avSyncTimeMs?: number;
  /**
   * Effective video duration (ms).
   * Total effective video duration refers to the time after the remote user or host joins the channel and neither stops sending the video stream nor disables the video module.
   */
  totalActiveTime?: number;
  /**
   * Total duration (ms) of the remote video stream being published.
   */
  publishDuration?: number;
  /**
   * Quality of the remote audio stream during the reporting interval. This quality is determined by Agora's real-time audio MOS (Mean Opinion Score) evaluation method. The return value ranges from [0, 500]; divide by 100 to get the MOS score, ranging from 0 to 5. The higher the score, the better the audio quality. The subjective audio quality corresponding to Agora's real-time MOS score is as follows:
   *  Greater than 4: Excellent audio quality, clear and smooth.
   *  3.5 - 4: Good audio quality, occasional artifacts but still clear.
   *  3 - 3.5: Fair audio quality, occasional stutters, not very smooth, requires some attention to understand.
   *  2.5 - 3: Poor audio quality, frequent stutters, requires concentration to understand.
   *  2 - 2.5: Very poor audio quality, occasional noise, partial loss of meaning, difficult to communicate.
   *  Less than 2: Extremely poor audio quality, frequent noise, significant loss of meaning, communication impossible.
   */
  mosValue?: number;
  /**
   * @ignore
   */
  rxVideoBytes?: number;
}

/**
 * @ignore
 */
export class Region {
  /**
   * @ignore
   */
  uid?: number;
  /**
   * @ignore
   */
  x?: number;
  /**
   * @ignore
   */
  y?: number;
  /**
   * @ignore
   */
  width?: number;
  /**
   * @ignore
   */
  height?: number;
  /**
   * @ignore
   */
  zOrder?: number;
  /**
   * @ignore
   */
  alpha?: number;
  /**
   * @ignore
   */
  renderMode?: RenderModeType;
}

/**
 * @ignore
 */
export class VideoCompositingLayout {
  /**
   * @ignore
   */
  canvasWidth?: number;
  /**
   * @ignore
   */
  canvasHeight?: number;
  /**
   * @ignore
   */
  backgroundColor?: string;
  /**
   * @ignore
   */
  regions?: Region[];
  /**
   * @ignore
   */
  regionCount?: number;
  /**
   * @ignore
   */
  appData?: Uint8Array;
  /**
   * @ignore
   */
  appDataLength?: number;
}

/**
 * @ignore
 */
export class InjectStreamConfig {
  /**
   * @ignore
   */
  width?: number;
  /**
   * @ignore
   */
  height?: number;
  /**
   * @ignore
   */
  videoGop?: number;
  /**
   * @ignore
   */
  videoFramerate?: number;
  /**
   * @ignore
   */
  videoBitrate?: number;
  /**
   * @ignore
   */
  audioSampleRate?: AudioSampleRateType;
  /**
   * @ignore
   */
  audioBitrate?: number;
  /**
   * @ignore
   */
  audioChannels?: number;
}

/**
 * Lifecycle of server-side transcoding streaming.
 *
 * Deprecated Deprecated
 */
export enum RtmpStreamLifeCycleType {
  /**
   * Bound to the channel lifecycle. When all hosts leave the channel, server-side transcoding streaming stops after 30 seconds.
   */
  RtmpStreamLifeCycleBind2channel = 1,
  /**
   * Bound to the lifecycle of the host who starts the server-side transcoding streaming. When the host leaves, the streaming stops immediately.
   */
  RtmpStreamLifeCycleBind2owner = 2,
}

/**
 * @ignore
 */
export class PublisherConfiguration {
  /**
   * @ignore
   */
  width?: number;
  /**
   * @ignore
   */
  height?: number;
  /**
   * @ignore
   */
  framerate?: number;
  /**
   * @ignore
   */
  bitrate?: number;
  /**
   * @ignore
   */
  defaultLayout?: number;
  /**
   * @ignore
   */
  lifecycle?: number;
  /**
   * @ignore
   */
  owner?: boolean;
  /**
   * @ignore
   */
  injectStreamWidth?: number;
  /**
   * @ignore
   */
  injectStreamHeight?: number;
  /**
   * @ignore
   */
  injectStreamUrl?: string;
  /**
   * @ignore
   */
  publishUrl?: string;
  /**
   * @ignore
   */
  rawStreamUrl?: string;
  /**
   * @ignore
   */
  extraInfo?: string;
}

/**
 * Camera direction.
 */
export enum CameraDirection {
  /**
   * 0: Rear camera.
   */
  CameraRear = 0,
  /**
   * 1: (Default) Front camera.
   */
  CameraFront = 1,
}

/**
 * Cloud proxy types.
 */
export enum CloudProxyType {
  /**
   * 0: Auto mode. This is the default mode enabled by the SDK. In this mode, the SDK first tries to connect via SD-RTN™. If that fails, it automatically switches to TLS 443.
   */
  NoneProxy = 0,
  /**
   * 1: UDP protocol cloud proxy, i.e., Force UDP mode. In this mode, the SDK always transmits data using the UDP protocol.
   */
  UdpProxy = 1,
  /**
   * 2: TCP (encrypted) protocol cloud proxy, i.e., Force TCP mode. In this mode, the SDK always transmits data using TLS 443.
   */
  TcpProxy = 2,
}

/**
 * Camera capture configuration.
 */
export class CameraCapturerConfiguration {
  /**
   * @ignore
   */
  cameraDirection?: CameraDirection;
  /**
   * @ignore
   */
  cameraFocalLengthType?: CameraFocalLengthType;
  /**
   * (Optional) Camera ID. Maximum length is MaxDeviceIdLengthType.
   */
  deviceId?: string;
  /**
   * @ignore
   */
  cameraId?: string;
  /**
   * (Optional) Whether to follow the video aspect ratio set in setVideoEncoderConfiguration : true : (Default) Follow. The SDK crops the captured video according to the set aspect ratio, which also affects the local preview, and the video frames in onCaptureVideoFrame and onPreEncodeVideoFrame. false : Do not follow. The SDK does not change the aspect ratio of the captured video frame.
   */
  followEncodeDimensionRatio?: boolean;
  /**
   * (Optional) Video frame format. See VideoFormat.
   */
  format?: VideoFormat;
}

/**
 * Screen capture configuration.
 */
export class ScreenCaptureConfiguration {
  /**
   * Whether to capture a window on the screen: true : Capture the window. false : (Default) Capture the screen, not the window.
   */
  isCaptureWindow?: boolean;
  /**
   * (macOS only) Display ID of the screen. Use this parameter only when capturing the screen on Mac devices.
   */
  displayId?: number;
  /**
   * (Windows only) Position of the screen to be shared relative to the virtual screen. Use this parameter only when capturing the screen on Windows devices.
   */
  screenRect?: Rectangle;
  /**
   * Window ID. Use this parameter only when capturing a window.
   */
  windowId?: number;
  /**
   * Encoding parameter configuration for the screen sharing stream. See ScreenCaptureParameters.
   */
  params?: ScreenCaptureParameters;
  /**
   * Position of the region to be shared relative to the entire screen. See Rectangle. If not specified, the entire screen is shared. If the specified region exceeds the screen boundaries, only the content within the screen is shared. If the width or height in Rectangle is set to 0, the entire screen is shared.
   */
  regionRect?: Rectangle;
}

/**
 * @ignore
 */
export class Size {
  /**
   * @ignore
   */
  width?: number;
  /**
   * @ignore
   */
  height?: number;
}

/**
 * Image content of a thumbnail or icon. Set in ScreenCaptureSourceInfo.
 *
 * The image is in ARGB format by default. If you need another format, please convert it manually.
 */
export class ThumbImageBuffer {
  /**
   * Buffer of the thumbnail or icon.
   */
  buffer?: Uint8Array;
  /**
   * Length of the thumbnail or icon buffer, in bytes.
   */
  length?: number;
  /**
   * Actual width of the thumbnail or icon (px).
   */
  width?: number;
  /**
   * Actual height of the thumbnail or icon (px).
   */
  height?: number;
}

/**
 * Type of the sharing target. Set in ScreenCaptureSourceInfo.
 */
export enum ScreenCaptureSourceType {
  /**
   * -1: Unknown.
   */
  ScreencapturesourcetypeUnknown = -1,
  /**
   * 0: The sharing target is a specific window.
   */
  ScreencapturesourcetypeWindow = 0,
  /**
   * 1: The sharing target is the screen of a specific monitor.
   */
  ScreencapturesourcetypeScreen = 1,
  /**
   * 2: Reserved parameter.
   */
  ScreencapturesourcetypeCustom = 2,
}

/**
 * Information about shareable windows or screens.
 */
export class ScreenCaptureSourceInfo {
  /**
   * Type of the sharing target. See ScreenCaptureSourceType.
   */
  type?: ScreenCaptureSourceType;
  /**
   * For windows, indicates the Window ID; for screens, indicates the Display ID.
   */
  sourceId?: number;
  /**
   * Name of the window or screen. UTF-8 encoded.
   */
  sourceName?: string;
  /**
   * Image content of the thumbnail. See ThumbImageBuffer.
   */
  thumbImage?: ThumbImageBuffer;
  /**
   * Image content of the icon. See ThumbImageBuffer.
   */
  iconImage?: ThumbImageBuffer;
  /**
   * Process to which the window belongs. UTF-8 encoded.
   */
  processPath?: string;
  /**
   * Window title. UTF-8 encoded.
   */
  sourceTitle?: string;
  /**
   * Whether the screen is the primary display: true : The screen is the primary display. false : The screen is not the primary display.
   */
  primaryMonitor?: boolean;
  /**
   * @ignore
   */
  isOccluded?: boolean;
  /**
   * Position of the window relative to the entire screen space (including all shareable screens). See Rectangle.
   */
  position?: Rectangle;
  /**
   * (Windows only) Whether the window is minimized: true : The window is minimized. false : The window is not minimized.
   */
  minimizeWindow?: boolean;
  /**
   * (Windows only) ID of the screen where the window is located. If the window spans multiple screens, it refers to the screen with the largest intersecting area. If the window is outside the visible screen, the value is -2.
   */
  sourceDisplayId?: number;
}

/**
 * Advanced options for audio.
 */
export class AdvancedAudioOptions {
  /**
   * Number of channels for audio pre-processing. See AudioProcessingChannels.
   */
  audioProcessingChannels?: number;
}

/**
 * Settings options for filler image.
 */
export class ImageTrackOptions {
  /**
   * URL of the filler image. Currently supports JPEG, JPG, PNG, and GIF formats. You can add filler images from local absolute or relative paths.
   */
  imageUrl?: string;
  /**
   * Video frame rate. Value range: [1,30]. Default is 1.
   */
  fps?: number;
  /**
   * @ignore
   */
  mirrorMode?: VideoMirrorModeType;
}

/**
 * Channel media configuration options.
 *
 * RtcConnection publishMicrophoneTrack publishCustomAudioTrack publishMediaPlayerAudioTrack true publishCameraTrack publishScreenTrack 、 publishCustomVideoTrack publishEncodedVideoTrack true It is recommended that you configure the member parameters based on your business scenario. Otherwise, the SDK will automatically assign values to the member parameters.
 */
export class ChannelMediaOptions {
  /**
   * Sets whether to publish the video captured by the camera: true : Publish the video captured by the camera. false : Do not publish the video captured by the camera.
   */
  publishCameraTrack?: boolean;
  /**
   * Sets whether to publish the video captured by the second camera: true : Publish the video captured by the second camera. false : Do not publish the video captured by the second camera.
   */
  publishSecondaryCameraTrack?: boolean;
  /**
   * Sets whether to publish the video captured by the third camera: true : Publish the video captured by the third camera. false : Do not publish the video captured by the third camera.
   */
  publishThirdCameraTrack?: boolean;
  /**
   * Sets whether to publish the video captured by the fourth camera: true : Publish the video captured by the fourth camera. false : Do not publish the video captured by the fourth camera.
   */
  publishFourthCameraTrack?: boolean;
  /**
   * Sets whether to publish the audio captured by the microphone: true : Publish the audio captured by the microphone. false : Do not publish the audio captured by the microphone.
   */
  publishMicrophoneTrack?: boolean;
  /**
   * @ignore
   */
  publishScreenCaptureAudio?: boolean;
  /**
   * @ignore
   */
  publishScreenCaptureVideo?: boolean;
  /**
   * Sets whether to publish the video captured from the screen: true : Publish the video captured from the screen. false : Do not publish the video captured from the screen.
   */
  publishScreenTrack?: boolean;
  /**
   * Sets whether to publish the video captured from the second screen: true : Publish the video captured from the second screen. false : Do not publish the video captured from the second screen.
   */
  publishSecondaryScreenTrack?: boolean;
  /**
   * Sets whether to publish the video captured from the third screen: true : Publish the video captured from the third screen. false : Do not publish the video captured from the third screen.
   */
  publishThirdScreenTrack?: boolean;
  /**
   * Sets whether to publish the video captured from the fourth screen: true : Publish the video captured from the fourth screen. false : Do not publish the video captured from the fourth screen.
   */
  publishFourthScreenTrack?: boolean;
  /**
   * Sets whether to publish custom captured audio: true : Publish the custom captured audio. false : Do not publish the custom captured audio.
   */
  publishCustomAudioTrack?: boolean;
  /**
   * The ID of the custom audio track to be published. The default value is 0. You can get the custom audio track ID by calling the createCustomAudioTrack method.
   */
  publishCustomAudioTrackId?: number;
  /**
   * Sets whether to publish custom captured video: true : Publish the custom captured video. false : Do not publish the custom captured video.
   */
  publishCustomVideoTrack?: boolean;
  /**
   * Sets whether to publish the encoded video: true : Publish the encoded video. false : Do not publish the encoded video.
   */
  publishEncodedVideoTrack?: boolean;
  /**
   * Sets whether to publish the audio from the media player: true : Publish the audio from the media player. false : Do not publish the audio from the media player.
   */
  publishMediaPlayerAudioTrack?: boolean;
  /**
   * Sets whether to publish the video from the media player: true : Publish the video from the media player. false : Do not publish the video from the media player.
   */
  publishMediaPlayerVideoTrack?: boolean;
  /**
   * Sets whether to publish the local transcoded video: true : Publish the local transcoded video. false : Do not publish the local transcoded video.
   */
  publishTranscodedVideoTrack?: boolean;
  /**
   * Sets whether to publish the local audio mixing: true : Publish the local audio mixing. false : Do not publish the local audio mixing.
   */
  publishMixedAudioTrack?: boolean;
  /**
   * Sets whether to publish the video processed by the voice-driven plugin: true : Publish the video processed by the voice-driven plugin. false : (Default) Do not publish the video processed by the voice-driven plugin.
   */
  publishLipSyncTrack?: boolean;
  /**
   * Sets whether to automatically subscribe to all audio streams: true : Automatically subscribe to all audio streams. false : Do not automatically subscribe to any audio streams.
   */
  autoSubscribeAudio?: boolean;
  /**
   * Sets whether to automatically subscribe to all video streams: true : Automatically subscribe to all video streams. false : Do not automatically subscribe to any video streams.
   */
  autoSubscribeVideo?: boolean;
  /**
   * If you need to publish the audio stream captured by the microphone, make sure this parameter is set to true. Sets whether to enable audio recording or playback: true : Enable audio recording or playback. false : Do not enable audio recording or playback.
   */
  enableAudioRecordingOrPlayout?: boolean;
  /**
   * The ID of the media player to be published. The default value is 0.
   */
  publishMediaPlayerId?: number;
  /**
   * User role. See ClientRoleType.
   */
  clientRoleType?: ClientRoleType;
  /**
   * Audience latency level. See AudienceLatencyLevelType.
   */
  audienceLatencyLevel?: AudienceLatencyLevelType;
  /**
   * Default video stream type to subscribe to: VideoStreamType.
   */
  defaultVideoStreamType?: VideoStreamType;
  /**
   * Channel usage scenario. See ChannelProfileType.
   */
  channelProfile?: ChannelProfileType;
  /**
   * Delay (in milliseconds) for sending audio frames. You can use this parameter to set the audio frame delay to ensure audio-video synchronization.
   * To disable delay, set this parameter to 0.
   */
  audioDelayMs?: number;
  /**
   * @ignore
   */
  mediaPlayerAudioDelayMs?: number;
  /**
   * (Optional) A dynamic key generated on the server for authentication. See [Token Authentication](https://doc.shengwang.cn/doc/rtc/electron/basic-features/token-authentication).
   *  This parameter only takes effect when calling updateChannelMediaOptions or updateChannelMediaOptionsEx.
   *  Make sure the App ID, channel name, and user name used to generate the token match the App ID used in the initialize method and the channel name and user name set in the joinChannel or joinChannelEx method.
   */
  token?: string;
  /**
   * @ignore
   */
  enableBuiltInMediaEncryption?: boolean;
  /**
   * Sets whether to publish the virtual metronome sound to remote users: true : Publish. Both local and remote users can hear the metronome. false : Do not publish. Only the local user can hear the metronome.
   */
  publishRhythmPlayerTrack?: boolean;
  /**
   * This parameter is used for cross-room co-hosting scenarios. The co-host needs to call the joinChannelEx method to join the other host's room as an audience and set isInteractiveAudience to true.
   *  This parameter only takes effect when the user role is ClientRoleAudience. Whether to enable interactive audience mode: true : Enable interactive audience mode. Once enabled, the local user acts as an interactive audience and receives low-latency and smooth remote video. false : Do not enable interactive audience mode. The local user acts as a regular audience and receives remote video with default settings.
   */
  isInteractiveAudience?: boolean;
  /**
   * The video track ID returned by calling the createCustomVideoTrack method. The default value is 0.
   */
  customVideoTrackId?: number;
  /**
   * To enable this feature, please [contact sales](https://www.shengwang.cn/contact-sales/). Sets whether the current audio stream participates in stream selection based on audio volume algorithm. true : Participate in volume-based stream selection. If volume-based stream selection is not enabled, this parameter has no effect. false : Do not participate in volume-based stream selection.
   */
  isAudioFilterable?: boolean;
  /**
   * @ignore
   */
  parameters?: string;
}

/**
 * Proxy type.
 */
export enum ProxyType {
  /**
   * 0: Reserved parameter, not supported yet.
   */
  NoneProxyType = 0,
  /**
   * 1: Cloud proxy using UDP protocol, i.e., Force UDP cloud proxy mode. In this mode, the SDK always transmits data via the UDP protocol.
   */
  UdpProxyType = 1,
  /**
   * 2: Cloud proxy using TCP (encrypted) protocol, i.e., Force TCP cloud proxy mode. In this mode, the SDK always transmits data via TLS 443.
   */
  TcpProxyType = 2,
  /**
   * 3: Reserved parameter, not supported yet.
   */
  LocalProxyType = 3,
  /**
   * 4: Auto mode. In this mode, the SDK first attempts to connect to SD-RTN™. If the connection fails, it automatically switches to TLS 443.
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
 * Advanced feature types.
 */
export enum FeatureType {
  /**
   * 1: Virtual background feature.
   */
  VideoVirtualBackground = 1,
  /**
   * 2: Beauty effect feature.
   */
  VideoBeautyEffect = 2,
}

/**
 * Options for leaving the channel.
 */
export class LeaveChannelOptions {
  /**
   * Whether to stop playing music files and audio mixing when leaving the channel: true : (Default) Stop playing music files and audio mixing. false : Do not stop playing music files and audio mixing.
   */
  stopAudioMixing?: boolean;
  /**
   * Whether to stop playing sound effects when leaving the channel: true : (Default) Stop playing sound effects. false : Do not stop playing sound effects.
   */
  stopAllEffect?: boolean;
  /**
   * @ignore
   */
  unloadAllEffect?: boolean;
  /**
   * Whether to stop microphone recording when leaving the channel: true : (Default) Stop microphone recording. false : Do not stop microphone recording.
   */
  stopMicrophoneRecording?: boolean;
}

/**
 * The IRtcEngineEventHandler interface class is used by the SDK to send event notifications to the app. The app receives these notifications by inheriting methods of this interface class.
 *
 * All methods in this interface class have default (empty) implementations. The app can override only the events it is interested in.
 *  In the callback methods, the app should not perform time-consuming operations or call APIs that may block (such as sendMessage), otherwise it may affect the operation of the SDK.
 *  The SDK no longer catches exceptions thrown from the app's own logic implemented in IRtcEngineEventHandler callbacks. You need to handle such exceptions yourself, otherwise they may crash the app.
 */
export interface IRtcEngineEventHandler {
  /**
   * Callback when successfully joining a channel.
   *
   * This callback indicates that the client has successfully joined the specified channel.
   *
   * @param connection Connection information. See RtcConnection.
   * @param elapsed Time elapsed (in milliseconds) from the local call to joinChannel until this event occurs.
   */
  onJoinChannelSuccess?(connection: RtcConnection, elapsed: number): void;

  /**
   * Callback when successfully rejoining a channel.
   *
   * @param uid The user ID of the user who rejoined the channel.
   * @param connection Connection information. See RtcConnection.
   * @param elapsed The time interval (in milliseconds) from calling the joinChannel method to the triggering of this callback.
   */
  onRejoinChannelSuccess?(connection: RtcConnection, elapsed: number): void;

  /**
   * Callback for proxy connection status.
   *
   * You can use this callback to monitor the SDK’s proxy connection status. For example, when a user calls setCloudProxy to set a proxy and successfully joins a channel, the SDK triggers this callback to report the user ID, the type of connected proxy, and the time elapsed from calling joinChannel to triggering this callback.
   *
   * @param channel Channel name.
   * @param uid User ID
   * @param proxyType Type of connected proxy. See ProxyType.
   * @param localProxyIp Reserved parameter, currently not supported.
   * @param elapsed Time elapsed (in milliseconds) from calling joinChannel to the SDK triggering this callback.
   */
  onProxyConnected?(
    channel: string,
    uid: number,
    proxyType: ProxyType,
    localProxyIp: string,
    elapsed: number
  ): void;

  /**
   * Callback when an error occurs.
   *
   * This callback indicates that a network or media-related error occurred during SDK runtime. Typically, errors reported by the SDK mean that the SDK cannot recover automatically and require intervention from the app or user notification.
   *
   * @param err Error code. See ErrorCodeType.
   * @param msg Error description.
   */
  onError?(err: ErrorCodeType, msg: string): void;

  /**
   * Callback for remote audio quality.
   *
   * Deprecated Deprecated: Use onRemoteAudioStats instead. This callback describes the audio quality of remote users during a call. It is triggered once every 2 seconds for each remote user/host. If there are multiple remote users/hosts, this callback is triggered multiple times every 2 seconds.
   *
   * @param connection Connection information. See RtcConnection.
   * @param remoteUid The user ID of the sender of the audio stream.
   * @param quality Audio quality. See QualityType.
   * @param delay The delay (ms) from the sender to the receiver, including delays caused by audio pre-processing, network transmission, and jitter buffering.
   * @param lost The packet loss rate (%) from the sender to the receiver.
   */
  onAudioQuality?(
    connection: RtcConnection,
    remoteUid: number,
    quality: QualityType,
    delay: number,
    lost: number
  ): void;

  /**
   * Reports the last-mile network probe result before a call.
   *
   * After calling startLastmileProbeTest, the SDK returns this callback within approximately 30 seconds.
   *
   * @param result Result of the last-mile uplink and downlink network probe. See LastmileProbeResult.
   */
  onLastmileProbeResult?(result: LastmileProbeResult): void;

  /**
   * Callback for user audio volume indication.
   *
   * This callback is disabled by default. You can enable it by calling enableAudioVolumeIndication. Once enabled, as long as there are users publishing streams in the channel, the SDK triggers the onAudioVolumeIndication callback at the interval set in enableAudioVolumeIndication after joining the channel. Two onAudioVolumeIndication callbacks are triggered each time: one reporting volume information of the local user, and the other reporting volume information of up to 3 remote users with the highest instantaneous volume. After enabling this feature, if a user mutes themselves (by calling muteLocalAudioStream), the SDK continues to report the local user's volume indication callback.
   * If the remote user with the highest instantaneous volume mutes themselves, they will be excluded from the remote volume indication callback after 20 seconds. If all remote users mute themselves, the SDK stops reporting the remote volume indication callback after 20 seconds.
   *
   * @param connection Connection information. See RtcConnection.
   * @param speakers User volume information. See AudioVolumeInfo array. If speakers is empty, it means no remote users are publishing streams or there are no remote users.
   * @param speakerNumber Number of users.
   *  In the local user's callback, as long as the local user is publishing, speakerNumber is always 1.
   *  In the remote users' callback, speakerNumber ranges from [0,3]. If the number of remote users publishing is greater than 3, the value of speakerNumber in this callback is 3.
   * @param totalVolume Total mixed volume, ranging from [0,255].
   *  In the local user's callback, totalVolume is the volume of the local user publishing.
   *  In the remote users' callback, totalVolume is the total mixed volume of up to 3 remote users with the highest instantaneous volume.
   */
  onAudioVolumeIndication?(
    connection: RtcConnection,
    speakers: AudioVolumeInfo[],
    speakerNumber: number,
    totalVolume: number
  ): void;

  /**
   * Callback when leaving a channel.
   *
   * You can use this callback to obtain information such as the total call duration and the amount of data sent and received by the SDK during the call.
   *
   * @param connection Connection information. See RtcConnection.
   * @param stats Call statistics. See RtcStats.
   */
  onLeaveChannel?(connection: RtcConnection, stats: RtcStats): void;

  /**
   * Callback for current call-related statistics.
   *
   * @param connection Connection information. See RtcConnection.
   * @param stats RTC engine statistics. See RtcStats.
   */
  onRtcStats?(connection: RtcConnection, stats: RtcStats): void;

  /**
   * Callback for changes in audio device state.
   *
   * Indicates that the system audio device state has changed, such as when a headset is unplugged.
   *
   * @param deviceId Device ID.
   * @param deviceType Device type definition. See MediaDeviceType.
   * @param deviceState Device state. See MediaDeviceStateType.
   */
  onAudioDeviceStateChanged?(
    deviceId: string,
    deviceType: MediaDeviceType,
    deviceState: MediaDeviceStateType
  ): void;

  /**
   * Callback for music file playback progress.
   *
   * After you call startAudioMixing to play a music file, the SDK triggers this callback every second to report the current playback progress of the music file.
   *
   * @param position The current playback progress of the music file in ms.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  onAudioMixingPositionChanged?(position: number): void;

  /**
   * Callback when local music file playback is finished.
   *
   * Deprecated Deprecated: Use onAudioMixingStateChanged instead. This callback is triggered when playback of the local music file started by startAudioMixing ends. If startAudioMixing fails, it returns the error code WARN_AUDIO_MIXING_OPEN_ERROR.
   */
  onAudioMixingFinished?(): void;

  /**
   * Callback when a local audio effect file finishes playing.
   *
   * This callback is triggered when the playback of an audio effect finishes.
   *
   * @param soundId The ID of the specified audio effect. Each audio effect has a unique ID.
   */
  onAudioEffectFinished?(soundId: number): void;

  /**
   * Video device state change callback.
   *
   * This callback indicates that the system video device state has changed, such as being unplugged or removed. If an external camera is being used for capture and it is unplugged, video will be interrupted.
   *
   * @param deviceId Device ID.
   * @param deviceType Device type. See MediaDeviceType.
   * @param deviceState Device state. See MediaDeviceStateType.
   */
  onVideoDeviceStateChanged?(
    deviceId: string,
    deviceType: MediaDeviceType,
    deviceState: MediaDeviceStateType
  ): void;

  /**
   * Reports the last-mile network quality of each user during a call.
   *
   * This callback describes the last-mile network status of each user during a call. Last mile refers to the network status between the device and the Agora edge server.
   * This callback is triggered every 2 seconds. If there are multiple remote users, it is triggered multiple times every 2 seconds.
   * The callback reports network quality using broadcast packets within the channel. Excessive broadcast packets may cause a broadcast storm. To prevent this from causing a large amount of data transmission in the channel, this callback by default supports reporting the network quality of up to 4 remote hosts simultaneously. When the user is not sending streams, txQuality is Unknown; when not receiving streams, rxQuality is Unknown.
   *
   * @param connection Connection information. See RtcConnection.
   * @param remoteUid User ID. Indicates the network quality reported for the user with this ID. If uid is 0, the local user's network quality is reported.
   * @param txQuality Uplink network quality of the user, calculated based on sending bitrate, uplink packet loss rate, average round-trip time, and network jitter. This value reflects the current uplink network quality and helps determine whether the current video encoding settings are supported. For example, if the uplink bitrate is 1000 Kbps, it can support 640 × 480 resolution at 15 fps in live broadcast scenarios, but may struggle to support 1280 × 720 resolution. See QualityType.
   * @param rxQuality Downlink network quality of the user, calculated based on downlink packet loss rate, average round-trip time, and network jitter. See QualityType.
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
   * Callback when uplink network information changes.
   *
   * The SDK triggers this callback only when uplink network information changes. This callback applies only when pushing externally encoded video data in H.264 format to the SDK.
   *
   * @param info Uplink network information. See UplinkNetworkInfo.
   */
  onUplinkNetworkInfoUpdated?(info: UplinkNetworkInfo): void;

  /**
   * @ignore
   */
  onDownlinkNetworkInfoUpdated?(info: DownlinkNetworkInfo): void;

  /**
   * Reports the last-mile network quality before a call.
   *
   * This callback reports the result of the last-mile network probe for the local user before joining a channel. Last mile refers to the network status between the device and the Agora edge server.
   * Before joining a channel, after calling startLastmileProbeTest, the SDK triggers this callback to report the probe result.
   *
   * @param quality Last-mile network quality. See QualityType.
   */
  onLastmileQuality?(quality: QualityType): void;

  /**
   * Occurs when the first local video frame is displayed.
   *
   * This callback is triggered when the first local video frame is displayed in the local view.
   *
   * @param source The type of video source. See VideoSourceType.
   * @param width The width (px) of the locally rendered video.
   * @param height The height (px) of the locally rendered video.
   * @param elapsed Time elapsed (ms) from calling joinChannel to the occurrence of this event. If startPreviewWithoutSourceType / startPreview was called before joining the channel, this parameter indicates the time elapsed from calling startPreviewWithoutSourceType or startPreview to the occurrence of this event.
   */
  onFirstLocalVideoFrame?(
    source: VideoSourceType,
    width: number,
    height: number,
    elapsed: number
  ): void;

  /**
   * Occurs when the first local video frame is published.
   *
   * The SDK triggers this callback in the following scenarios:
   *  After successfully joining a channel by calling joinChannel with the local video module enabled.
   *  After calling muteLocalVideoStream(true) followed by muteLocalVideoStream(false).
   *  After calling disableVideo followed by enableVideo.
   *
   * @param connection Connection information. See RtcConnection.
   * @param elapsed Time interval (ms) from calling joinChannel to the triggering of this callback.
   */
  onFirstLocalVideoFramePublished?(
    connection: RtcConnection,
    elapsed: number
  ): void;

  /**
   * Occurs when the remote video is received and decoded.
   *
   * The SDK triggers this callback under the following circumstances:
   *  The remote user sends video after joining the channel for the first time.
   *  The remote user sends video after going offline and coming back online. Possible causes of such interruptions include:
   *  The remote user leaves the channel.
   *  The remote user gets disconnected.
   *  The remote user calls the disableVideo method to disable the video module.
   *
   * @param connection Connection information. See RtcConnection.
   * @param remoteUid The user ID that identifies the video stream.
   * @param width Width of the video stream (px).
   * @param height Height of the video stream (px).
   * @param elapsed The time elapsed (ms) from calling joinChannel until this callback is triggered.
   */
  onFirstRemoteVideoDecoded?(
    connection: RtcConnection,
    remoteUid: number,
    width: number,
    height: number,
    elapsed: number
  ): void;

  /**
   * Occurs when the local or remote video size or rotation changes.
   *
   * @param connection Connection information. See RtcConnection.
   * @param sourceType The type of video source. See VideoSourceType.
   * @param uid The user ID whose video size or rotation changed (uid is 0 for the local user, indicating the video is from the local preview).
   * @param width The width (pixels) of the video stream.
   * @param height The height (pixels) of the video stream.
   * @param rotation The rotation information, in the range [0, 360).
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
   * Occurs when the local video state changes.
   *
   * The SDK triggers this callback when the local video state changes, reporting the current state and the reason for the change.
   *  Frame duplication detection only applies to video frames with resolution greater than 200 × 200, frame rate ≥ 10 fps, and bitrate < 20 Kbps.
   *  If an exception occurs during video capture, you can usually troubleshoot it using the reason parameter in this callback. However, on some devices, when a capture issue occurs (e.g., freeze), Android may not throw any error callback, so the SDK cannot report the reason for the local video state change. In this case, you can determine whether the capture has no frames by checking: this callback reports state as LocalVideoStreamStateCapturing or LocalVideoStreamStateEncoding, and the captureFrameRate in the onLocalVideoStats callback is 0.
   *
   * @param source The type of video source. See VideoSourceType.
   * @param state The local video state. See LocalVideoStreamState.
   * @param reason The reason for the local video state change. See LocalVideoStreamReason.
   */
  onLocalVideoStateChanged?(
    source: VideoSourceType,
    state: LocalVideoStreamState,
    reason: LocalVideoStreamReason
  ): void;

  /**
   * Occurs when the remote video state changes.
   *
   * When the number of users (in communication) or hosts (in live streaming) in the channel exceeds 32, this callback may be inaccurate.
   *
   * @param connection Connection information. See RtcConnection.
   * @param remoteUid The remote user ID whose video state has changed.
   * @param state The remote video stream state. See RemoteVideoState.
   * @param reason The reason for the remote video stream state change. See RemoteVideoStateReason.
   * @param elapsed Time elapsed in milliseconds from the local user calling joinChannel to the occurrence of this event.
   */
  onRemoteVideoStateChanged?(
    connection: RtcConnection,
    remoteUid: number,
    state: RemoteVideoState,
    reason: RemoteVideoStateReason,
    elapsed: number
  ): void;

  /**
   * Occurs when the renderer receives the first frame of remote video.
   *
   * This callback is triggered only when the SDK handles rendering. If you use custom video rendering, this callback is not triggered and you need to implement it yourself outside the SDK.
   *
   * @param connection Connection information. See RtcConnection.
   * @param remoteUid The user ID that identifies the video stream.
   * @param width Width of the video stream (px).
   * @param height Height of the video stream (px).
   * @param elapsed The time elapsed (ms) from calling joinChannel until this event occurs.
   */
  onFirstRemoteVideoFrame?(
    connection: RtcConnection,
    remoteUid: number,
    width: number,
    height: number,
    elapsed: number
  ): void;

  /**
   * Callback when a remote user (in communication) or host (in live broadcast) joins the current channel.
   *
   * In communication scenarios, this callback indicates that a remote user has joined the channel. If there are already other users in the channel before the new user joins, the new user also receives callbacks for those existing users.
   *  In live broadcast scenarios, this callback indicates that a host has joined the channel. If there are already hosts in the channel before the new one joins, the new user also receives callbacks for those existing hosts. It is recommended to have no more than 32 co-hosts (including no more than 17 video co-hosts).
   *
   * @param connection Connection information. See RtcConnection.
   * @param remoteUid The ID of the newly joined remote user/host.
   * @param elapsed The time elapsed (ms) from the local user calling joinChannel to the triggering of this callback.
   */
  onUserJoined?(
    connection: RtcConnection,
    remoteUid: number,
    elapsed: number
  ): void;

  /**
   * Callback when a remote user (in communication) or host (in live broadcast) leaves the current channel.
   *
   * Users leave the channel generally due to the following reasons:
   *  Normal departure: The remote user or host sends a 'goodbye' message and leaves the channel voluntarily.
   *  Timeout disconnection: If no data packets are received from the peer within a certain time (20 seconds for communication, slightly longer for live broadcast), the user is considered offline. In poor network conditions, false positives may occur. It is recommended to use the RTM SDK for reliable offline detection.
   *
   * @param connection Connection information. See RtcConnection.
   * @param remoteUid The ID of the remote user or host who went offline.
   * @param reason The reason why the remote user (in communication) or host (in live broadcast) went offline. See UserOfflineReasonType.
   */
  onUserOffline?(
    connection: RtcConnection,
    remoteUid: number,
    reason: UserOfflineReasonType
  ): void;

  /**
   * Callback when a remote user (in communication) or host (in live streaming) stops or resumes sending audio streams.
   *
   * This callback is triggered when the remote user calls the muteLocalAudioStream method to disable or enable audio sending. When the number of users (in communication) or hosts (in live streaming) in the channel exceeds 32, this callback may be inaccurate.
   *
   * @param connection Connection information. See RtcConnection.
   * @param remoteUid User ID.
   * @param muted Whether the user is muted: true : The user has muted the audio. false : The user has unmuted the audio.
   */
  onUserMuteAudio?(
    connection: RtcConnection,
    remoteUid: number,
    muted: boolean
  ): void;

  /**
   * Occurs when a remote user stops or resumes publishing the video stream.
   *
   * When a remote user calls muteLocalVideoStream to stop or resume publishing the video stream, the SDK triggers this callback to inform the local user of the remote user’s publishing status. When the number of users (in communication) or hosts (in live streaming) in the channel exceeds 32, this callback may be inaccurate.
   *
   * @param connection Connection information. See RtcConnection.
   * @param remoteUid The remote user ID.
   * @param muted Whether the remote user stops publishing the video stream: true : Stops publishing the video stream. false : Publishes the video stream.
   */
  onUserMuteVideo?(
    connection: RtcConnection,
    remoteUid: number,
    muted: boolean
  ): void;

  /**
   * Occurs when a remote user enables or disables the video module.
   *
   * Disabling the video module means the user can only make voice calls, and cannot display or send their own video, nor receive or display others’ video.
   * This callback is triggered when the remote user calls the enableVideo or disableVideo method to enable or disable the video module.
   *
   * @param connection Connection information. See RtcConnection.
   * @param remoteUid The user ID indicating whose video stream it is.
   * @param enabled true : The user has enabled video. false : The user has disabled video.
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
   * Occurs when a remote user enables or disables the local video capture.
   *
   * Deprecated Deprecated: This callback is deprecated. Use the following enumerations of the onRemoteVideoStateChanged callback instead: RemoteVideoStateStopped (0) and RemoteVideoStateReasonRemoteMuted (5). RemoteVideoStateDecoding (2) and RemoteVideoStateReasonRemoteUnmuted (6). This callback is triggered when the remote user calls the enableLocalVideo method to enable or disable video capture.
   *
   * @param connection Connection information. See RtcConnection.
   * @param remoteUid The user ID indicating whose video stream it is.
   * @param enabled Whether the remote user enables video capture: true : The user has enabled video. Other users can receive this user’s video stream. false : The user has disabled video. The user can still receive video streams from others, but others cannot receive this user’s video stream.
   */
  onUserEnableLocalVideo?(
    connection: RtcConnection,
    remoteUid: number,
    enabled: boolean
  ): void;

  /**
   * Reports the statistics of the remote audio stream during a call.
   *
   * The SDK triggers this callback every 2 seconds for each remote user/host sending an audio stream. If multiple remote users/hosts are sending audio streams, this callback is triggered multiple times every 2 seconds.
   *
   * @param connection Connection information. See RtcConnection.
   * @param stats Received remote audio statistics. See RemoteAudioStats.
   */
  onRemoteAudioStats?(connection: RtcConnection, stats: RemoteAudioStats): void;

  /**
   * Reports the statistics of the local audio stream during a call.
   *
   * The SDK triggers this callback every 2 seconds.
   *
   * @param connection Connection information. See RtcConnection.
   * @param stats Local audio statistics. See LocalAudioStats.
   */
  onLocalAudioStats?(connection: RtcConnection, stats: LocalAudioStats): void;

  /**
   * Reports the statistics of the local video stream.
   *
   * This callback reports the statistics of the video stream sent by the local device and is triggered every 2 seconds.
   *
   * @param connection Connection information. See RtcConnection.
   * @param stats Local video stream statistics. See LocalVideoStats.
   */
  onLocalVideoStats?(connection: RtcConnection, stats: LocalVideoStats): void;

  /**
   * Reports the statistics of the video stream sent by each remote user during a call.
   *
   * This callback reports end-to-end video stream statistics of remote users during a call. It is triggered every 2 seconds for each remote user/host. If there are multiple remote users/hosts, this callback is triggered multiple times every 2 seconds.
   *
   * @param connection Connection information. See RtcConnection.
   * @param stats Remote video statistics. See RemoteVideoStats.
   */
  onRemoteVideoStats?(connection: RtcConnection, stats: RemoteVideoStats): void;

  /**
   * Camera ready callback.
   *
   * Deprecated Deprecated: Use onLocalVideoStateChanged with LocalVideoStreamStateCapturing(1) instead. This callback indicates that the camera has been successfully opened and video capture can begin.
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
   * Occurs when the video function is stopped.
   *
   * Deprecated Deprecated: Use the LocalVideoStreamStateStopped (0) state in the onLocalVideoStateChanged callback instead. If the app needs to perform other operations on the view after stopping the video (e.g., displaying another image), it can be done in this callback.
   */
  onVideoStopped?(): void;

  /**
   * Callback when the music file playback state changes.
   *
   * This callback is triggered when the playback state of the music file changes and reports the current playback state and error code.
   *
   * @param state The playback state of the music file. See AudioMixingStateType.
   * @param reason Error code. See AudioMixingReasonType.
   */
  onAudioMixingStateChanged?(
    state: AudioMixingStateType,
    reason: AudioMixingReasonType
  ): void;

  /**
   * Callback when the virtual metronome state changes.
   *
   * Deprecated Deprecated since v4.6.2. When the virtual metronome state changes, the SDK triggers this callback to report the current state. If the metronome encounters an issue, this callback helps you identify the current state and the cause of the issue for troubleshooting.
   *
   * @param state Current state of the virtual metronome. See RhythmPlayerStateType.
   * @param reason Error code and message when the virtual metronome encounters an error. See RhythmPlayerReason.
   */
  onRhythmPlayerStateChanged?(
    state: RhythmPlayerStateType,
    reason: RhythmPlayerReason
  ): void;

  /**
   * Occurs when the network connection is lost and the SDK fails to reconnect to the server within 10 seconds.
   *
   * After calling joinChannel, regardless of whether the channel is joined successfully, if the SDK fails to connect to the server within 10 seconds, this callback is triggered. If the SDK still fails to rejoin the channel within 20 minutes after disconnection, it will stop trying to reconnect.
   *
   * @param connection Connection information. See RtcConnection.
   */
  onConnectionLost?(connection: RtcConnection): void;

  /**
   * Occurs when the network connection is interrupted.
   *
   * Deprecated Deprecated: Use the onConnectionStateChanged callback instead. After the SDK establishes a connection with the server, if the network connection is lost for more than 4 seconds, this callback is triggered. After the event is triggered, the SDK will attempt to reconnect to the server, so this event can be used for UI prompts. The difference between this callback and onConnectionLost is: onConnectionInterrupted is triggered only after successfully joining a channel and when the SDK has just lost connection to the server for more than 4 seconds. onConnectionLost is triggered regardless of whether the channel is joined successfully, as long as the SDK cannot connect to the server within 10 seconds. If the SDK still fails to rejoin the channel within 20 minutes after disconnection, it will stop trying to reconnect.
   *
   * @param connection Connection information. See RtcConnection.
   */
  onConnectionInterrupted?(connection: RtcConnection): void;

  /**
   * Occurs when the network connection is banned by the server.
   *
   * Deprecated Deprecated: Use onConnectionStateChanged instead.
   *
   * @param connection Connection information. See RtcConnection.
   */
  onConnectionBanned?(connection: RtcConnection): void;

  /**
   * Callback when receiving a data stream message from a remote user.
   *
   * This callback indicates that the local user has received a data stream message sent by the remote user using the sendStreamMessage method.
   *
   * @param connection Connection information. See RtcConnection.
   * @param remoteUid User ID of the sender.
   * @param streamId Stream ID of the received message.
   * @param data The received data.
   * @param length Length of the data in bytes.
   * @param sentTs Timestamp when the data stream was sent.
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
   * Callback when an error occurs in receiving a data stream message from a remote user.
   *
   * This callback indicates that the local user failed to receive the data stream message sent by the remote user using the sendStreamMessage method.
   *
   * @param connection Connection information. See RtcConnection.
   * @param uid User ID of the sender.
   * @param streamId Stream ID of the received message.
   * @param code Error code. See ErrorCodeType.
   * @param missed Number of missed messages.
   * @param cached Number of cached messages after data stream interruption.
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
   * Callback when the Token has expired.
   *
   * During audio and video interaction, if the Token becomes invalid, the SDK triggers this callback to report that the Token has expired.
   * When you receive this callback, you need to generate a new Token on your server and update it using one of the following methods:
   *  Single-channel scenario:
   *  Call renewToken to pass in the new Token.
   *  Call leaveChannel to leave the current channel, then pass in the new Token when calling joinChannel to rejoin the channel.
   *  Multi-channel scenario: Call updateChannelMediaOptionsEx to pass in the new Token.
   *
   * @param connection Connection information. See RtcConnection.
   */
  onRequestToken?(connection: RtcConnection): void;

  /**
   * Callback when the token is about to expire in 30 seconds.
   *
   * When you receive this callback, you need to generate a new token on your server and update it using one of the following methods:
   *  Single-channel scenario:
   *  Call renewToken to pass in the new token.
   *  Call leaveChannel to leave the current channel, then call joinChannel with the new token to rejoin.
   *  Multi-channel scenario: Call updateChannelMediaOptionsEx with the new token.
   *
   * @param connection Connection information. See RtcConnection.
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
   * Callback when the first local audio frame is published.
   *
   * The SDK triggers this callback in the following situations:
   *  After successfully joining a channel by calling joinChannel with local audio enabled.
   *  After calling muteLocalAudioStream(true) followed by muteLocalAudioStream(false).
   *  After calling disableAudio followed by enableAudio.
   *
   * @param connection Connection information. See RtcConnection.
   * @param elapsed The time elapsed (ms) from calling joinChannel to the triggering of this callback.
   */
  onFirstLocalAudioFramePublished?(
    connection: RtcConnection,
    elapsed: number
  ): void;

  /**
   * Occurs when the first frame of remote audio is decoded.
   *
   * Deprecated Deprecated: Use onRemoteAudioStateChanged instead. The SDK triggers this callback when:
   *  The remote user sends audio after joining the channel for the first time.
   *  The remote user sends audio again after going offline. Offline means that no audio packet is received locally within 15 seconds, which may be caused by:
   *  The remote user leaves the channel
   *  The remote user drops offline
   *  The remote user calls the muteLocalAudioStream method to stop sending the audio stream
   *  The remote user calls the disableAudio method to disable audio
   *
   * @param connection Connection information. See RtcConnection.
   * @param uid Remote user ID.
   * @param elapsed Time elapsed (ms) from the local user calling joinChannel to this callback being triggered.
   */
  onFirstRemoteAudioDecoded?(
    connection: RtcConnection,
    uid: number,
    elapsed: number
  ): void;

  /**
   * Occurs when the first frame of remote audio is received.
   *
   * Deprecated Deprecated: Use onRemoteAudioStateChanged instead.
   *
   * @param connection Connection information. See RtcConnection.
   * @param userId User ID of the remote user who sends the audio frame.
   * @param elapsed Time elapsed (ms) from the local user calling joinChannel to this callback being triggered.
   */
  onFirstRemoteAudioFrame?(
    connection: RtcConnection,
    userId: number,
    elapsed: number
  ): void;

  /**
   * Occurs when the local audio state changes.
   *
   * The SDK triggers this callback to report the current local audio state when it changes, including the microphone capture state and audio encoding state. When a local audio issue occurs, this callback helps you understand the current state and the reason for the issue, facilitating troubleshooting. When the state is LocalAudioStreamStateFailed (3), you can check the returned error information in the error parameter.
   *
   * @param connection Connection information. See RtcConnection.
   * @param state Current local audio state. See LocalAudioStreamState.
   * @param reason Reason for the local audio state change. See LocalAudioStreamReason.
   */
  onLocalAudioStateChanged?(
    connection: RtcConnection,
    state: LocalAudioStreamState,
    reason: LocalAudioStreamReason
  ): void;

  /**
   * Occurs when the remote audio stream state changes.
   *
   * The SDK triggers this callback to report the current remote audio stream state when the audio state of a remote user (in a communication scenario) or host (in a live streaming scenario) changes. When the number of users (in a communication scenario) or hosts (in a live streaming scenario) in the channel exceeds 32, this callback may be inaccurate.
   *
   * @param connection Connection information. See RtcConnection.
   * @param remoteUid User ID of the remote user whose audio state changed.
   * @param state Remote audio stream state. See RemoteAudioState.
   * @param reason Reason for the remote audio stream state change. See RemoteAudioStateReason.
   * @param elapsed Time elapsed (ms) from the local user calling joinChannel to the occurrence of this event.
   */
  onRemoteAudioStateChanged?(
    connection: RtcConnection,
    remoteUid: number,
    state: RemoteAudioState,
    reason: RemoteAudioStateReason,
    elapsed: number
  ): void;

  /**
   * Callback when the most active remote speaker is detected.
   *
   * After successfully calling enableAudioVolumeIndication, the SDK continuously monitors the remote user with the highest volume and counts how many times this user is identified as the loudest. The remote user with the highest count during a period is considered the most active speaker.
   * When there are two or more users in the channel and there is an active remote speaker, the SDK triggers this callback and reports the uid of the most active remote user.
   *  If the most active remote speaker remains the same, the SDK does not trigger the onActiveSpeaker callback again.
   *  If the most active remote speaker changes, the SDK triggers this callback again and reports the uid of the new most active remote user.
   *
   * @param connection Connection information. See RtcConnection.
   * @param uid The ID of the most active remote speaker.
   */
  onActiveSpeaker?(connection: RtcConnection, uid: number): void;

  /**
   * @ignore
   */
  onContentInspectResult?(result: ContentInspectResult): void;

  /**
   * Callback for video snapshot result.
   *
   * After takeSnapshot is successfully called, the SDK triggers this callback to report whether the snapshot was successful and provide details.
   *
   * @param connection Connection information. See RtcConnection.
   * @param uid User ID. If uid is 0, it refers to the local user.
   * @param filePath The local path where the snapshot is saved.
   * @param width Width of the image (px).
   * @param height Height of the image (px).
   * @param errCode Indicates success or reason for failure:
   *  0: Snapshot successful.
   *  < 0: Snapshot failed.
   *  -1: Failed to write file or JPEG encoding failed.
   *  -2: No video frame received from the specified user within 1 second after calling takeSnapshot. Possible reasons: local capture stopped, remote user stopped publishing, or video data processing is blocked.
   *  -3: takeSnapshot was called too frequently.
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
   * Occurs when the user role or audience latency level is switched.
   *
   * This callback is not triggered if you call setClientRole before joining a channel and set the user role to BROADCASTER.
   *
   * @param connection Connection information. See RtcConnection.
   * @param oldRole The previous role: ClientRoleType.
   * @param newRole The new role: ClientRoleType.
   * @param newRoleOptions The properties of the new role. See ClientRoleOptions.
   */
  onClientRoleChanged?(
    connection: RtcConnection,
    oldRole: ClientRoleType,
    newRole: ClientRoleType,
    newRoleOptions: ClientRoleOptions
  ): void;

  /**
   * Callback when the user role switch fails.
   *
   * When the user role switch fails, you can use this callback to learn the reason for the failure and the current user role.
   *
   * @param connection Connection information. See RtcConnection.
   * @param reason The reason for the failure to switch user roles. See ClientRoleChangeFailedReason.
   * @param currentRole The current user role. See ClientRoleType.
   */
  onClientRoleChangeFailed?(
    connection: RtcConnection,
    reason: ClientRoleChangeFailedReason,
    currentRole: ClientRoleType
  ): void;

  /**
   * Callback when the volume of an audio device or app changes.
   *
   * This callback is triggered when the volume of an audio playback or recording device, or the app, changes.
   *
   * @param deviceType Device type definition. See MediaDeviceType.
   * @param volume Volume. Range: [0,255].
   * @param muted Whether the audio device is muted: true : The audio device is muted. false : The audio device is not muted.
   */
  onAudioDeviceVolumeChanged?(
    deviceType: MediaDeviceType,
    volume: number,
    muted: boolean
  ): void;

  /**
   * Callback when the RTMP streaming state changes.
   *
   * When the RTMP streaming state changes, the SDK triggers this callback and reports the URL whose state has changed and the current streaming state. This callback helps streaming users understand the current streaming state. If an error occurs, you can determine the cause from the returned error code to facilitate troubleshooting.
   *
   * @param url The URL whose streaming state has changed.
   * @param state The current streaming state. See RtmpStreamPublishState.
   * @param reason The reason for the change in streaming state. See RtmpStreamPublishReason.
   */
  onRtmpStreamingStateChanged?(
    url: string,
    state: RtmpStreamPublishState,
    reason: RtmpStreamPublishReason
  ): void;

  /**
   * Callback for CDN streaming events.
   *
   * @param url The CDN streaming URL.
   * @param eventCode The CDN streaming event code. See RtmpStreamingEvent.
   */
  onRtmpStreamingEvent?(url: string, eventCode: RtmpStreamingEvent): void;

  /**
   * Callback when the RTMP transcoding settings are updated.
   *
   * When the live streaming parameters LiveTranscoding in the startRtmpStreamWithTranscoding method are updated, the onTranscodingUpdated callback is triggered and reports the update to the host. This callback is not triggered the first time you call the startRtmpStreamWithTranscoding method to set the transcoding parameters LiveTranscoding.
   */
  onTranscodingUpdated?(): void;

  /**
   * Callback triggered when the audio routing changes.
   *
   * This callback is applicable to macOS only.
   *
   * @param routing The current audio routing:
   *  -1: Default audio routing.
   *  0: Headset with microphone.
   *  1: Earpiece.
   *  2: Headset without microphone.
   *  3: Built-in speaker.
   *  4: External speaker. (Applicable to iOS and macOS only)
   *  5: Bluetooth headset.
   */
  onAudioRoutingChanged?(routing: number): void;

  /**
   * Occurs when the state of media stream relay across channels changes.
   *
   * Occurs when the state of media stream relay across channels changes. The SDK triggers this callback and reports the current relay state and any associated error information.
   *
   * @param state The state of the media stream relay across channels. See ChannelMediaRelayState.
   * @param code The error code for media stream relay across channels. See ChannelMediaRelayError.
   */
  onChannelMediaRelayStateChanged?(
    state: ChannelMediaRelayState,
    code: ChannelMediaRelayError
  ): void;

  /**
   * @ignore
   */
  onLocalPublishFallbackToAudioOnly?(isFallbackOrRecover: boolean): void;

  /**
   * Callback when the subscribed stream falls back to audio-only or recovers to audio-video.
   *
   * After you call setRemoteSubscribeFallbackOption and set option to StreamFallbackOptionAudioOnly, this callback is triggered in the following situations:
   *  The subscribed audio-video stream falls back to audio-only due to poor downlink network conditions
   *  The subscribed audio stream recovers to audio-video as the network improves When the subscribed stream falls back to a lower-quality video stream due to weak network conditions, you can monitor the switch between high and low video streams via the onRemoteVideoStats callback.
   *
   * @param uid User ID of the remote user.
   * @param isFallbackOrRecover true : The subscribed stream has fallen back to audio-only due to poor network conditions. false : The subscribed stream has recovered to audio-video due to improved network conditions.
   */
  onRemoteSubscribeFallbackToAudioOnly?(
    uid: number,
    isFallbackOrRecover: boolean
  ): void;

  /**
   * Reports the transport statistics of the remote audio stream during a call.
   *
   * Deprecated:
   * Use onRemoteAudioStats instead.
   * This callback reports end-to-end network statistics of the remote user during a call, calculated based on audio packets. It provides objective data such as packet loss and network delay to indicate the current network status. During a call, this callback is triggered every 2 seconds when the user receives audio packets from a remote user/host.
   *
   * @param connection Connection information. See RtcConnection.
   * @param remoteUid User ID indicating which user/host the audio packet belongs to.
   * @param delay Delay (ms) from the sender to the receiver for the audio packet.
   * @param lost Packet loss rate (%) from the sender to the receiver for the audio packet.
   * @param rxKBitrate Received bitrate (Kbps) of the remote audio packet.
   */
  onRemoteAudioTransportStats?(
    connection: RtcConnection,
    remoteUid: number,
    delay: number,
    lost: number,
    rxKBitRate: number
  ): void;

  /**
   * Reports the statistics of the video stream sent by each remote users.
   *
   * Deprecated Deprecated: This callback is deprecated. Use onRemoteVideoStats instead. This callback reports end-to-end network statistics of a remote user during a call, calculated based on video packets. It provides objective data such as packet loss and network latency to reflect the current network status.
   * During a call, when a user receives video data packets from a remote user/host, this callback is triggered every 2 seconds.
   *
   * @param connection Connection information. See RtcConnection.
   * @param remoteUid The user ID indicating which user/host the video packet belongs to.
   * @param delay The latency (ms) from the sender to the receiver of the video packet.
   * @param lost The packet loss rate (%) from the sender to the receiver of the video packet.
   * @param rxKBitRate The received bitrate (Kbps) of the remote video packet.
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
   * This callback is triggered when the network connection state changes, informing you of the current connection state and the reason for the change.
   *
   * @param connection Connection information. See RtcConnection.
   * @param state Current network connection state. See ConnectionStateType.
   * @param reason Reason for the current connection state change. See ConnectionChangedReasonType.
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
   * Callback when the local network type changes.
   *
   * When the type of local network connection changes, the SDK triggers this callback and specifies the current network connection type. You can use this callback to get the type of network currently in use. When the connection is interrupted, this callback helps determine whether the cause is a network switch or poor network conditions.
   *
   * @param connection Connection information. See RtcConnection.
   * @param type Type of local network connection. See NetworkType.
   */
  onNetworkTypeChanged?(connection: RtcConnection, type: NetworkType): void;

  /**
   * Occurs when an error occurs in built-in encryption.
   *
   * After calling enableEncryption to enable encryption, if an encryption or decryption error occurs on the sender or receiver side, the SDK triggers this callback.
   *
   * @param connection Connection information. See RtcConnection.
   * @param errorType Error type. See EncryptionErrorType.
   */
  onEncryptionError?(
    connection: RtcConnection,
    errorType: EncryptionErrorType
  ): void;

  /**
   * Callback when failing to obtain device permission.
   *
   * When the SDK fails to obtain device permission, it triggers this callback to report which device's permission could not be obtained.
   *
   * @param permissionType Type of device permission. See PermissionType.
   */
  onPermissionError?(permissionType: PermissionType): void;

  /**
   * Callback when the local user successfully registers a User Account.
   *
   * After the local user successfully calls registerLocalUserAccount to register a User Account or calls joinChannelWithUserAccount to join a channel, the SDK triggers this callback and reports the UID and User Account of the local user.
   *
   * @param uid The ID of the local user.
   * @param userAccount The User Account of the local user.
   */
  onLocalUserRegistered?(uid: number, userAccount: string): void;

  /**
   * Callback when remote user information is updated.
   *
   * After a remote user joins the channel, the SDK obtains the UID and User Account of the remote user, then caches a mapping table containing the UID and User Account, and triggers this callback locally.
   *
   * @param uid The ID of the remote user.
   * @param info The UserInfo object that identifies the user information, including the UID and User Account. See the UserInfo class.
   */
  onUserInfoUpdated?(uid: number, info: UserInfo): void;

  /**
   * @ignore
   */
  onUserAccountUpdated?(
    connection: RtcConnection,
    remoteUid: number,
    remoteUserAccount: string
  ): void;

  /**
   * Video frame rendering event callback.
   *
   * After calling startMediaRenderingTracing or joining a channel, the SDK triggers this callback to report events and metrics during the video frame rendering process. Developers can optimize based on these metrics to improve rendering efficiency.
   *
   * @param connection Connection information. See RtcConnection.
   * @param uid User ID.
   * @param currentEvent Current video frame rendering event. See MediaTraceEvent.
   * @param tracingInfo Metrics during video frame rendering. Developers should minimize these values to improve rendering efficiency. See VideoRenderingTracingInfo.
   */
  onVideoRenderingTracingResult?(
    connection: RtcConnection,
    uid: number,
    currentEvent: MediaTraceEvent,
    tracingInfo: VideoRenderingTracingInfo
  ): void;

  /**
   * Callback when a local video mixing error occurs.
   *
   * When startLocalVideoTranscoder or updateLocalTranscoderConfiguration fails, the SDK triggers this callback to report the reason for the mixing failure.
   *
   * @param stream The video stream that failed to mix. See TranscodingVideoStream.
   * @param error The reason for the local video mixing error. See VideoTranscoderError.
   */
  onLocalVideoTranscoderError?(
    stream: TranscodingVideoStream,
    error: VideoTranscoderError
  ): void;

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
   * Callback for audio subscription state changes.
   *
   * @param channel Channel name.
   * @param uid Remote user ID.
   * @param oldState Previous subscription state. See StreamSubscribeState.
   * @param newState Current subscription state. See StreamSubscribeState.
   * @param elapseSinceLastState Time interval between the two state changes (ms).
   */
  onAudioSubscribeStateChanged?(
    channel: string,
    uid: number,
    oldState: StreamSubscribeState,
    newState: StreamSubscribeState,
    elapseSinceLastState: number
  ): void;

  /**
   * Callback for video subscription state changes.
   *
   * @param channel Channel name.
   * @param uid Remote user ID.
   * @param oldState Previous subscription state. See StreamSubscribeState.
   * @param newState Current subscription state. See StreamSubscribeState.
   * @param elapseSinceLastState Time interval between the two state changes (ms).
   */
  onVideoSubscribeStateChanged?(
    channel: string,
    uid: number,
    oldState: StreamSubscribeState,
    newState: StreamSubscribeState,
    elapseSinceLastState: number
  ): void;

  /**
   * Callback for audio publish state changes.
   *
   * @param channel Channel name.
   * @param oldState Previous publish state. See StreamPublishState.
   * @param newState Current publish state. See StreamPublishState.
   * @param elapseSinceLastState Time interval between the two state changes (ms).
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
   * @param source The type of video source. See VideoSourceType.
   * @param channel The channel name.
   * @param oldState The previous publishing state. See StreamPublishState.
   * @param newState The current publishing state. See StreamPublishState.
   * @param elapseSinceLastState The time interval (ms) between the two state changes.
   */
  onVideoPublishStateChanged?(
    source: VideoSourceType,
    channel: string,
    oldState: StreamPublishState,
    newState: StreamPublishState,
    elapseSinceLastState: number
  ): void;

  /**
   * @ignore
   */
  onTranscodedStreamLayoutInfo?(
    connection: RtcConnection,
    uid: number,
    width: number,
    height: number,
    layoutCount: number,
    layoutlist: VideoLayout[]
  ): void;

  /**
   * @ignore
   */
  onAudioMetadataReceived?(
    connection: RtcConnection,
    uid: number,
    metadata: string,
    length: number
  ): void;

  /**
   * Callback for extension events.
   *
   * To listen to extension events, you need to register this callback.
   *
   * @param context Extension context information. See ExtensionContext.
   * @param key The key of the extension property.
   * @param value The value corresponding to the extension property key.
   */
  onExtensionEventWithContext?(
    context: ExtensionContext,
    key: string,
    value: string
  ): void;

  /**
   * Callback when an extension is successfully enabled.
   *
   * This callback is triggered after the extension is successfully enabled.
   *
   * @param context Extension context information. See ExtensionContext.
   */
  onExtensionStartedWithContext?(context: ExtensionContext): void;

  /**
   * Callback when an extension is disabled.
   *
   * This callback is triggered after the extension is successfully disabled.
   *
   * @param context Extension context information. See ExtensionContext.
   */
  onExtensionStoppedWithContext?(context: ExtensionContext): void;

  /**
   * Callback when an extension error occurs.
   *
   * When enabling the extension fails or the extension runs into an error, this callback is triggered and reports the error code and reason.
   *
   * @param context Extension context information. See ExtensionContext.
   * @param error Error code. See the documentation provided by the extension provider.
   * @param message Error reason. See the documentation provided by the extension provider.
   */
  onExtensionErrorWithContext?(
    context: ExtensionContext,
    error: number,
    message: string
  ): void;

  /**
   * @ignore
   */
  onSetRtmFlagResult?(connection: RtcConnection, code: number): void;
}

/**
 * Video device management methods.
 */
export abstract class IVideoDeviceManager {
  /**
   * Gets the list of all video devices in the system.
   *
   * @returns
   * If the method call succeeds: returns an array of VideoDeviceInfo containing all video devices in the system.
   *  If the method call fails: returns an empty list.
   */
  abstract enumerateVideoDevices(): VideoDeviceInfo[];

  /**
   * Specifies the video capture device by device ID.
   *
   * Plugging or unplugging the device does not change the device ID.
   *
   * @param deviceIdUTF8 Device ID. You can get it by calling the enumerateVideoDevices method.
   * Maximum length is MaxDeviceIdLengthType.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setDevice(deviceIdUTF8: string): number;

  /**
   * Gets the currently used video capture device.
   *
   * @returns
   * The video capture device.
   */
  abstract getDevice(): string;

  /**
   * Gets the number of video formats supported by the specified video capture device.
   *
   * A video capture device may support multiple video formats, each supporting different combinations of frame width, frame height, and frame rate.
   * You can call this method to get the number of video formats supported by the specified video capture device, and then call getCapability to get the specific frame information under a given format.
   *
   * @param deviceIdUTF8 The ID of the video capture device.
   *
   * @returns
   * > 0: The method call succeeds. Returns the number of video formats supported by the device. For example, if the specified camera supports 10 different video formats, the return value is 10.
   *  ≤ 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract numberOfCapabilities(deviceIdUTF8: string): number;

  /**
   * Gets the detailed video frame information of the video capture device under the specified video format.
   *
   * After calling numberOfCapabilities to get the number of supported video formats of the video capture device, you can call this method to get the detailed video frame information supported by the specified index.
   *
   * @param deviceIdUTF8 The ID of the video capture device.
   * @param deviceCapabilityNumber The index of the video format. If the return value of numberOfCapabilities is i, the valid range for this parameter is [0, i).
   *
   * @returns
   * Detailed information of the specified video format, including width (px), height (px), and frame rate (fps). See VideoFormat.
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
 * Video effect node types.
 *
 * Since Available since v4.6.2.
 */
export enum VideoEffectNodeId {
  /**
   * (1): Beauty effect node.
   */
  Beauty = 1 << 0,
  /**
   * (2): Style makeup effect node.
   */
  StyleMakeup = 1 << 1,
  /**
   * (4): Filter effect node.
   */
  Filter = 1 << 2,
  /**
   * @ignore
   */
  Sticker = 1 << 3,
}

/**
 * Action types performed on video effect nodes.
 *
 * Since Available since v4.6.2.
 */
export enum VideoEffectAction {
  /**
   * (1): Save the current parameters of the video effect.
   */
  Save = 1,
  /**
   * (2): Reset the video effect to its default parameters.
   */
  Reset = 2,
}

/**
 * Used to manage and configure video effects, such as beauty filters, style makeup, and filters.
 *
 * Since Available since v4.6.2.
 */
export abstract class IVideoEffectObject {
  /**
   * Adds or updates the effect for the specified video effect node and template.
   *
   * Since Available since v4.6.2. Priority rules:
   *  Style makeup nodes take precedence over filter effect nodes.
   *  To apply filter effects, you must first remove the style makeup effect node.
   *
   * @param nodeId The unique identifier or combination of identifiers for the video effect node. See VideoEffectNodeId.
   * @param templateName Name of the effect template. If set to NULL or an empty string, the SDK loads the default configuration from the resource package.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails.
   */
  abstract addOrUpdateVideoEffect(nodeId: number, templateName: string): number;

  /**
   * Removes the video effect for the specified node ID.
   *
   * Since Available since v4.6.2.
   *
   * @param nodeId The unique identifier of the video effect node to be removed. See VideoEffectNodeId.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails.
   */
  abstract removeVideoEffect(nodeId: number): number;

  /**
   * Performs an action on the specified video effect node.
   *
   * Since Available since v4.6.2.
   *
   * @param nodeId The unique identifier of the video effect node.
   * @param actionId The action to perform. See VideoEffectAction.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails.
   */
  abstract performVideoEffectAction(
    nodeId: number,
    actionId: VideoEffectAction
  ): number;

  /**
   * @ignore
   */
  abstract setVideoEffectStringParam(
    option: string,
    key: string,
    param: string
  ): number;

  /**
   * Sets the float parameter of a video effect.
   *
   * Since Available since v4.6.2.
   *
   * @param option The category of the parameter option.
   * @param key The key name of the parameter.
   * @param param The float value to set.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails.
   */
  abstract setVideoEffectFloatParam(
    option: string,
    key: string,
    param: number
  ): number;

  /**
   * setVideoEffectIntParam : Sets an integer parameter for the video effect.
   *
   * Since Available since v4.6.2.
   *
   * @param option The category of the option to which the parameter belongs.
   * @param key The key name of the parameter.
   * @param param The integer value to set.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setVideoEffectIntParam(
    option: string,
    key: string,
    param: number
  ): number;

  /**
   * Sets a boolean parameter for the video effect.
   *
   * Since Available since v4.6.2.
   *
   * @param option The category of the parameter option.
   * @param key The key name of the parameter.
   * @param param The boolean value to set: true : Enable the option. false : Disable the option.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract setVideoEffectBoolParam(
    option: string,
    key: string,
    param: boolean
  ): number;

  /**
   * Gets the value of the specified float type parameter in the video effect.
   *
   * Since Available since v4.6.2.
   *
   * @param option The category of the option to which the parameter belongs.
   * @param key The key name of the parameter.
   *
   * @returns
   * If the parameter exists, returns the corresponding float value.
   *  If the parameter does not exist or an error occurs, returns 0.0f.
   */
  abstract getVideoEffectFloatParam(option: string, key: string): number;

  /**
   * Gets the integer type parameter in the video effect.
   *
   * Since Available since v4.6.2.
   *
   * @param option The category of the parameter option.
   * @param key The key name of the parameter.
   *
   * @returns
   * If the parameter exists, returns the corresponding integer value.
   *  If the parameter does not exist or an error occurs, returns 0.
   */
  abstract getVideoEffectIntParam(option: string, key: string): number;

  /**
   * Gets the boolean parameter in the video effect.
   *
   * Since Available since v4.6.2.
   *
   * @param option The category of the option to which the parameter belongs.
   * @param key The key name of the parameter.
   *
   * @returns
   * true : The parameter is enabled. false : The parameter is not enabled or does not exist.
   */
  abstract getVideoEffectBoolParam(option: string, key: string): boolean;
}

/**
 * Defines RtcEngineContext.
 */
export class RtcEngineContext {
  /**
   * The App ID issued by Agora to the App developer. Apps using the same App ID can join the same channel for communication or live streaming. An App ID can only be used to create one IRtcEngine. To change the App ID, you must call release to destroy the current IRtcEngine before creating a new one.
   */
  appId?: string;
  /**
   * Channel profile. See ChannelProfileType.
   */
  channelProfile?: ChannelProfileType;
  /**
   * @ignore
   */
  license?: string;
  /**
   * Audio scenario. Different scenarios correspond to different volume types on the device.
   * See AudioScenarioType.
   */
  audioScenario?: AudioScenarioType;
  /**
   * Region for accessing the server. This is an advanced setting suitable for scenarios with restricted access. Supported regions are listed in AreaCode. Bitwise operations are supported for region codes.
   */
  areaCode?: number;
  /**
   * Sets the log files output by the SDK. See LogConfig.
   * By default, the SDK generates 5 SDK log files and 5 API call log files, with the following rules:
   */
  logConfig?: LogConfig;
  /**
   * @ignore
   */
  threadPriority?: ThreadPriorityType;
  /**
   * @ignore
   */
  useExternalEglContext?: boolean;
  /**
   * Whether to enable domain restriction: true : Enable domain restriction. This setting is suitable for IoT devices accessing the network via IoT SIM cards. The SDK only connects to servers in the domain or IP whitelist registered with the carrier. false : (Default) Disable domain restriction. This setting is suitable for most general scenarios.
   */
  domainLimit?: boolean;
  /**
   * Whether to automatically register Agora extensions when initializing IRtcEngine : true : (Default) Automatically register Agora extensions when initializing IRtcEngine. false : Do not register Agora extensions when initializing IRtcEngine. You need to call enableExtension to register them.
   */
  autoRegisterAgoraExtensions?: boolean;
}

/**
 * The Metadata type of the observer. Currently supports video Metadata only.
 */
export enum MetadataType {
  /**
   * -1: Unknown Metadata type.
   */
  UnknownMetadata = -1,
  /**
   * 0: Metadata type is video.
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
  /**
   * Channel name.
   */
  channelId?: string;
  /**
   * User ID.
   *  For receivers: ID of the remote user who sent this Metadata.
   *  For senders: Ignore this field.
   */
  uid?: number;
  /**
   * Buffer size of the received or sent Metadata.
   */
  size?: number;
  /**
   * Buffer address of the received Metadata.
   */
  buffer?: Uint8Array;
  /**
   * Timestamp when the Metadata is sent, in milliseconds.
   */
  timeStampMs?: number;
}

/**
 * Metadata observer.
 */
export interface IMetadataObserver {
  /**
   * Triggered when metadata is received on the receiving end.
   *
   * @param metadata The received metadata. See Metadata.
   */
  onMetadataReceived?(metadata: Metadata): void;
}

/**
 * The reason for a change in CDN streaming state.
 *
 * Deprecated Deprecated since v4.6.2.
 */
export enum DirectCdnStreamingReason {
  /**
   * 0: Streaming is normal.
   */
  DirectCdnStreamingReasonOk = 0,
  /**
   * 1: General error with no specific reason. You can try to restart the stream.
   */
  DirectCdnStreamingReasonFailed = 1,
  /**
   * 2: Audio streaming error. For example, the local audio capture device is not working properly, is occupied by another process, or lacks permission.
   */
  DirectCdnStreamingReasonAudioPublication = 2,
  /**
   * 3: Video streaming error. For example, the local video capture device is not working properly, is occupied by another process, or lacks permission.
   */
  DirectCdnStreamingReasonVideoPublication = 3,
  /**
   * 4: Failed to connect to the CDN.
   */
  DirectCdnStreamingReasonNetConnect = 4,
  /**
   * 5: The URL is already used for streaming. Please use a new URL.
   */
  DirectCdnStreamingReasonBadName = 5,
}

/**
 * Current CDN streaming state.
 *
 * Deprecated Deprecated since v4.6.2.
 */
export enum DirectCdnStreamingState {
  /**
   * 0: Initial state, streaming has not started yet.
   */
  DirectCdnStreamingStateIdle = 0,
  /**
   * 1: Streaming is in progress. When you call startDirectCdnStreaming and streaming starts successfully, the SDK returns this value.
   */
  DirectCdnStreamingStateRunning = 1,
  /**
   * 2: Streaming has ended normally. When you call stopDirectCdnStreaming to stop streaming, the SDK returns this value.
   */
  DirectCdnStreamingStateStopped = 2,
  /**
   * 3: Streaming failed. You can troubleshoot based on the information reported by the onDirectCdnStreamingStateChanged callback, and then restart streaming.
   */
  DirectCdnStreamingStateFailed = 3,
  /**
   * 4: Attempting to reconnect to Agora server and CDN. Up to 10 reconnection attempts are made. If reconnection still fails, the streaming state changes to DirectCdnStreamingStateFailed.
   */
  DirectCdnStreamingStateRecovering = 4,
}

/**
 * Statistics of the current CDN stream.
 *
 * Deprecated Deprecated since v4.6.2.
 */
export class DirectCdnStreamingStats {
  /**
   * Width of the video (px).
   */
  videoWidth?: number;
  /**
   * Height of the video (px).
   */
  videoHeight?: number;
  /**
   * Current video frame rate (fps).
   */
  fps?: number;
  /**
   * Current video bitrate (bps).
   */
  videoBitrate?: number;
  /**
   * Current audio bitrate (bps).
   */
  audioBitrate?: number;
}

/**
 * The IDirectCdnStreamingEventHandler interface is used by the SDK to send CDN streaming event notifications to the app. The app receives SDK event notifications by inheriting methods from this interface.
 */
export interface IDirectCdnStreamingEventHandler {
  /**
   * Callback when the CDN streaming state changes.
   *
   * After the host starts streaming directly to the CDN, when the streaming state changes, the SDK triggers this callback to report the new state, error code, and message. You can use this information to troubleshoot.
   *
   * @param state The current streaming state. See DirectCdnStreamingState.
   * @param reason The reason for the change in streaming state. See DirectCdnStreamingReason.
   * @param message The message corresponding to the state change.
   */
  onDirectCdnStreamingStateChanged?(
    state: DirectCdnStreamingState,
    reason: DirectCdnStreamingReason,
    message: string
  ): void;

  /**
   * Callback for CDN streaming statistics.
   *
   * During the process of pushing streams directly to CDN by the host, the SDK triggers this callback once every second.
   *
   * @param stats Current streaming statistics. See DirectCdnStreamingStats.
   */
  onDirectCdnStreamingStats?(stats: DirectCdnStreamingStats): void;
}

/**
 * Media options for the host.
 *
 * Deprecated Deprecated since v4.6.2.
 */
export class DirectCdnStreamingMediaOptions {
  /**
   * Sets whether to publish video captured by the camera. true : Publish video captured by the camera. false : (Default) Do not publish video captured by the camera.
   */
  publishCameraTrack?: boolean;
  /**
   * Sets whether to publish audio captured by the microphone. true : Publish audio captured by the microphone. false : (Default) Do not publish audio captured by the microphone.
   */
  publishMicrophoneTrack?: boolean;
  /**
   * Sets whether to publish custom captured audio. true : Publish custom captured audio. false : (Default) Do not publish custom captured audio.
   */
  publishCustomAudioTrack?: boolean;
  /**
   * Sets whether to publish custom captured video. true : Publish custom captured video. false : (Default) Do not publish custom captured video.
   */
  publishCustomVideoTrack?: boolean;
  /**
   * @ignore
   */
  publishMediaPlayerAudioTrack?: boolean;
  /**
   * @ignore
   */
  publishMediaPlayerId?: number;
  /**
   * The video track ID returned by the createCustomVideoTrack method. Default is 0.
   */
  customVideoTrackId?: number;
}

/**
 * @ignore
 */
export class ExtensionInfo {
  /**
   * @ignore
   */
  mediaSourceType?: MediaSourceType;
  /**
   * @ignore
   */
  remoteUid?: number;
  /**
   * @ignore
   */
  channelId?: string;
  /**
   * @ignore
   */
  localUid?: number;
}

/**
 * The base interface class of the RTC SDK that implements the main functions of real-time audio and video.
 *
 * IRtcEngine provides the main methods for the app to call.
 * You must call createAgoraRtcEngine to create an IRtcEngine object before calling other APIs.
 */
export abstract class IRtcEngine {
  /**
   * Creates and initializes IRtcEngine.
   *
   * All interface functions of the IRtcEngine class are asynchronous calls unless otherwise specified. It is recommended to call the interfaces in the same thread.
   * The SDK supports only one IRtcEngine instance per app.
   *
   * @param context Configuration for the IRtcEngine instance. See RtcEngineContext.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   *  -1: General error (not categorized).
   *  -2: Invalid parameter.
   *  -7: SDK initialization failed.
   *  -22: Resource allocation failed. This error occurs when the app uses too many resources or system resources are exhausted.
   *  -101: Invalid App ID.
   */
  abstract initialize(context: RtcEngineContext): number;

  /**
   * Gets the SDK version.
   *
   * @returns
   * SDKBuildInfo object.
   */
  abstract getVersion(): SDKBuildInfo;

  /**
   * Gets the description of a warning or error.
   *
   * @param code The error code reported by the SDK.
   *
   * @returns
   * The specific error description.
   */
  abstract getErrorDescription(code: number): string;

  /**
   * Queries the video codec capabilities supported by the SDK.
   *
   * @returns
   * If the call succeeds, it returns an object with the following properties: codecInfo : An array of CodecCapInfo representing the SDK's video encoding capabilities. size : The size of the CodecCapInfo array.
   *  If the call times out, adjust your logic to avoid calling this method on the main thread.
   */
  abstract queryCodecCapability(): { codecInfo: CodecCapInfo[]; size: number };

  /**
   * Queries the device score level.
   *
   * @returns
   * > 0: Success. The value is the current device score, ranging from [0,100]. A higher score indicates better device capability. Most devices score between 60 and 100.
   *  < 0: Failure.
   */
  abstract queryDeviceScore(): number;

  /**
   * Preloads a channel using token, channelId, and uid.
   *
   * Calling this method can reduce the time it takes for an audience member to join a channel when frequently switching channels, thereby shortening the delay before they hear the host's first audio frame and see the first video frame, improving the video experience on the audience side.
   * If the channel has already been successfully preloaded, and the audience leaves and rejoins the channel, as long as the Token passed during preloading is still valid, re-preloading is not required. Preloading failure does not affect subsequent normal channel joining, nor does it increase the time to join the channel.
   *  When calling this method, ensure the user role is set to audience and the audio scenario is not set to AudioScenarioChorus; otherwise, preloading will not take effect.
   *  Ensure that the channel name, user ID, and Token passed during preloading are the same as those used when joining the channel; otherwise, preloading will not take effect.
   *  Currently, one IRtcEngine instance supports preloading up to 20 channels. If this limit is exceeded, only the latest 20 preloaded channels will take effect.
   *
   * @param token The dynamic key generated on the server for authentication. See [Token Authentication](https://doc.shengwang.cn/doc/rtc/electron/basic-features/token-authentication).
   * When the token expires, depending on the number of preloaded channels, you can pass a new token for preloading in different ways:
   *  To preload one channel: call this method to pass the new token.
   *  To preload multiple channels:
   *  If you use a wildcard token, call updatePreloadChannelToken to update the token for all preloaded channels. When generating a wildcard token, the user ID must not be set to 0. See [Using Wildcard Tokens](https://doc.shengwang.cn/doc/rtc/electron/best-practice/wildcard-token).
   *  If you use different tokens: call this method and pass your user ID, corresponding channel name, and the updated token.
   * @param channelId The name of the channel to preload. This parameter identifies the channel for real-time audio and video interaction. Under the same App ID, users who enter the same channel name will join the same channel for audio and video interaction.
   * This parameter is a string with a maximum length of 64 bytes. The following character set is supported (a total of 89 characters):
   *  26 lowercase English letters a~z
   *  26 uppercase English letters A~Z
   *  10 digits 0~9
   *  "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
   * @param uid User ID. This parameter identifies the user in the real-time audio and video interaction channel. You must set and manage the user ID yourself and ensure that each user ID is unique within the same channel. This parameter is a 32-bit unsigned integer. Recommended range: 1 to 2^32-1. If not specified (i.e., set to 0), the SDK will automatically assign one and return it in the onJoinChannelSuccess callback. The application must remember and manage this return value, as the SDK does not maintain it.
   *
   * @returns
   * 0: Method call succeeds.
   *  < 0: Method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -7: IRtcEngine object is not initialized. You need to initialize the IRtcEngine object successfully before calling this method.
   *  -102: Invalid channel name. You need to enter a valid channel name and rejoin the channel.
   */
  abstract preloadChannel(
    token: string,
    channelId: string,
    uid: number
  ): number;

  /**
   * Preloads a channel using token, channelId, and userAccount.
   *
   * Calling this method can reduce the time it takes for an audience member to join a channel when frequently switching channels, thereby shortening the delay before they hear the host's first audio frame and see the first video frame, improving the video experience on the audience side.
   * If the channel has already been successfully preloaded, and the audience leaves and rejoins the channel, as long as the Token passed during preloading is still valid, re-preloading is not required. Preloading failure does not affect subsequent normal channel joining, nor does it increase the time to join the channel.
   *  When calling this method, ensure the user role is set to audience and the audio scenario is not set to AudioScenarioChorus; otherwise, preloading will not take effect.
   *  Ensure that the channel name, user User Account, and Token passed during preloading are the same as those used when joining the channel; otherwise, preloading will not take effect.
   *  Currently, one IRtcEngine instance supports preloading up to 20 channels. If this limit is exceeded, only the latest 20 preloaded channels will take effect.
   *
   * @param token The dynamic key generated on the server for authentication. See [Token Authentication](https://doc.shengwang.cn/doc/rtc/electron/basic-features/token-authentication).
   * When the token expires, depending on the number of preloaded channels, you can pass a new token for preloading in different ways:
   *  To preload one channel: call this method to pass the new token.
   *  To preload multiple channels:
   *  If you use a wildcard token, call updatePreloadChannelToken to update the token for all preloaded channels. When generating a wildcard token, the user ID must not be set to 0. See [Using Wildcard Tokens](https://doc.shengwang.cn/doc/rtc/electron/best-practice/wildcard-token).
   *  If you use different tokens: call this method and pass your user ID, corresponding channel name, and the updated token.
   * @param channelId The name of the channel to preload. This parameter identifies the channel for real-time audio and video interaction. Under the same App ID, users who enter the same channel name will join the same channel for audio and video interaction.
   * This parameter is a string with a maximum length of 64 bytes. The following character set is supported (a total of 89 characters):
   *  26 lowercase English letters a~z
   *  26 uppercase English letters A~Z
   *  10 digits 0~9
   *  "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
   * @param userAccount User User Account. This parameter identifies the user in the real-time audio and video interaction channel. You must set and manage the user's User Account yourself and ensure that each User Account is unique within the same channel. This parameter is required, must not exceed 255 bytes, and cannot be null. The following character set is supported (a total of 89 characters):
   *  26 lowercase English letters a-z
   *  26 uppercase English letters A-Z
   *  10 digits 0-9
   *  space
   *  "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
   *
   * @returns
   * 0: Method call succeeds.
   *  < 0: Method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -2: Invalid parameter. For example, User Account is empty. You need to enter valid parameters and rejoin the channel.
   *  -7: IRtcEngine object is not initialized. You need to initialize the IRtcEngine object successfully before calling this method.
   *  -102: Invalid channel name. You need to enter a valid channel name and rejoin the channel.
   */
  abstract preloadChannelWithUserAccount(
    token: string,
    channelId: string,
    userAccount: string
  ): number;

  /**
   * Updates the wildcard token for the preloaded channel.
   *
   * You need to manage the lifecycle of the wildcard token yourself. When the token expires, you must generate a new one on your server and pass it to the SDK using this method.
   *
   * @param token The new token.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   *  -2: Invalid parameter. For example, an invalid token. You must provide valid parameters and rejoin the channel.
   *  -7: The IRtcEngine object is not initialized. You must initialize the IRtcEngine object before calling this method.
   */
  abstract updatePreloadChannelToken(token: string): number;

  /**
   * Sets media options and joins a channel.
   *
   * This method allows you to set media options when joining a channel, such as whether to publish audio and video streams in the channel. Whether the user automatically subscribes to all remote audio and video streams in the channel upon joining. By default, the user subscribes to all other users' audio and video streams in the channel, which incurs usage and affects billing. If you want to unsubscribe, you can do so by setting the options parameter or using the corresponding mute methods.
   *  This method only supports joining one channel at a time.
   *  Apps with different App IDs cannot communicate with each other.
   *  Before joining a channel, make sure the App ID used to generate the Token is the same as the one used to initialize the engine with the initialize method. Otherwise, joining the channel with the Token will fail.
   *
   * @param token A dynamic key generated on the server for authentication. See [Token Authentication](https://doc.shengwang.cn/doc/rtc/electron/basic-features/token-authentication).
   *  (Recommended) If your project enables security mode (i.e., using APP ID + Token for authentication), this parameter is required.
   *  If your project only enables debug mode (i.e., using APP ID for authentication), you can join a channel without providing a Token. You will automatically leave the channel 24 hours after joining.
   *  If you need to join multiple channels simultaneously or switch channels frequently, Agora recommends using a wildcard Token to avoid requesting a new Token from the server each time. See [Using Wildcard Token](https://doc.shengwang.cn/doc/rtc/electron/best-practice/wildcard-token).
   * @param channelId Channel name. This parameter identifies the channel for real-time audio and video interaction. Users with the same App ID and channel name will join the same channel. The value must be a string no longer than 64 bytes. Supported character set (89 characters total):
   *  26 lowercase English letters a~z
   *  26 uppercase English letters A~Z
   *  10 digits 0~9
   *  "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
   * @param uid User ID. This parameter identifies the user in the real-time audio and video channel. You need to set and manage the user ID yourself and ensure that each user ID in the same channel is unique. The value is a 32-bit unsigned integer. Recommended range: 1 to 2^32-1. If not specified (i.e., set to 0), the SDK automatically assigns one and returns it in the onJoinChannelSuccess callback. The application must remember and maintain this return value, as the SDK does not maintain it.
   * @param options Channel media options. See ChannelMediaOptions.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   *  -2: Invalid parameters. For example, invalid Token, uid is not an integer, or ChannelMediaOptions contains invalid values. Provide valid parameters and rejoin the channel.
   *  -3: IRtcEngine initialization failed. Reinitialize the IRtcEngine object.
   *  -7: IRtcEngine is not initialized. Initialize the IRtcEngine object before calling this method.
   *  -8: Internal state error in IRtcEngine. Possible cause: startEchoTest was called to start echo test but stopEchoTest was not called before joining the channel. Call stopEchoTest before this method.
   *  -17: Join channel rejected. Possible cause: the user is already in the channel. Use onConnectionStateChanged to check the connection state. Do not call this method again unless you receive ConnectionStateDisconnected (1).
   *  -102: Invalid channel name. Provide a valid channelId and rejoin the channel.
   *  -121: Invalid user ID. Provide a valid uid and rejoin the channel.
   */
  abstract joinChannel(
    token: string,
    channelId: string,
    uid: number,
    options: ChannelMediaOptions
  ): number;

  /**
   * Updates channel media options after joining the channel.
   *
   * @param options Channel media options. See ChannelMediaOptions.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   *  -2: Invalid ChannelMediaOptions values. For example, using an invalid token or setting an invalid user role. You must provide valid parameters.
   *  -7: The IRtcEngine object is not initialized. You must initialize the IRtcEngine object before calling this method.
   *  -8: The internal state of the IRtcEngine object is incorrect. This may happen if the user is not in a channel. Use the onConnectionStateChanged callback to determine whether the user is in a channel. If you receive ConnectionStateDisconnected (1) or ConnectionStateFailed (5), the user is not in a channel. You must call joinChannel before using this method.
   */
  abstract updateChannelMediaOptions(options: ChannelMediaOptions): number;

  /**
   * Sets channel options and leaves the channel.
   *
   * After calling this method, the SDK stops all audio and video interactions, leaves the current channel, and releases all session-related resources.
   * After successfully joining a channel, you must call this method to end the call, otherwise you cannot start a new one. If you have joined multiple channels using joinChannelEx, calling this method will leave all joined channels. This method is asynchronous. When the call returns, it does not mean the user has actually left the channel.
   * If you call release immediately after this method, the SDK will not trigger the onLeaveChannel callback.
   *
   * @param options Options for leaving the channel. See LeaveChannelOptions.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract leaveChannel(options?: LeaveChannelOptions): number;

  /**
   * Renews the Token.
   *
   * This method renews the Token. The Token will expire after a certain period, and the SDK will then be unable to connect to the server.
   *
   * @param token The newly generated Token.
   *
   * @returns
   * 0: Method call succeeds.
   *  < 0: Method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -2: Invalid parameter. For example, the Token is empty.
   *  -7: IRtcEngine object is not initialized. You need to initialize the IRtcEngine object successfully before calling this method.
   *  -110: Invalid Token. Make sure that:
   *  The user ID specified when generating the Token is the same as the one used when joining the channel,
   *  The generated Token is the same as the one used to join the channel.
   */
  abstract renewToken(token: string): number;

  /**
   * Sets the channel profile.
   *
   * You can call this method to set the channel profile. The SDK applies different optimization strategies based on the profile. For example, in the live streaming profile, the SDK prioritizes video quality. The default channel profile after SDK initialization is live streaming. To ensure the quality of real-time audio and video, all users in the same channel must use the same channel profile.
   *
   * @param profile The channel profile. See ChannelProfileType.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   *  -2: Invalid parameter.
   *  -7: The SDK is not initialized.
   */
  abstract setChannelProfile(profile: ChannelProfileType): number;

  /**
   * Sets the user role and audience latency level in live streaming.
   *
   * By default, the SDK sets the user role to audience. You can call this method to set the user role to broadcaster. The user role (role) determines the user's permissions at the SDK level, such as whether the user can publish streams. When the user role is set to broadcaster, the audience latency level only supports AudienceLatencyLevelUltraLowLatency.
   * If you call this method before joining a channel and set role to BROADCASTER, the local user will not receive the onClientRoleChanged callback.
   *
   * @param role The user role. See ClientRoleType. Users with the audience role cannot publish audio or video streams in the channel. To publish in live streaming, make sure the user role is switched to broadcaster.
   * @param options Detailed user settings, including user level. See ClientRoleOptions.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   *  -1: General error (not categorized).
   *  -2: Invalid parameter.
   *  -5: This method call was rejected.
   *  -7: The SDK is not initialized.
   */
  abstract setClientRole(
    role: ClientRoleType,
    options?: ClientRoleOptions
  ): number;

  /**
   * Starts an audio and video call loop test.
   *
   * To test whether local audio and video transmission is functioning properly, you can call this method to perform an audio and video call loop test. This checks whether the system's audio and video devices and the user's uplink and downlink networks are working properly.
   * After starting the test, the user should speak or face the camera. The audio or video will play back after about 2 seconds. If audio plays normally, it indicates the system audio devices and network are functioning well. If video plays normally, it indicates the system video devices and network are functioning well.
   *  When calling this method in a channel, ensure that no audio/video streams are being published.
   *  After calling this method, you must call stopEchoTest to end the test. Otherwise, the user cannot perform another loop test or join a channel.
   *  In live broadcast scenarios, only the host can call this method.
   *
   * @param config Configuration for the audio and video call loop test. See EchoTestConfiguration.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract startEchoTest(config: EchoTestConfiguration): number;

  /**
   * Stops the audio loopback test.
   *
   * After calling startEchoTest, you must call this method to end the test. Otherwise, the user will not be able to perform another loop test or join a channel.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -5(ERR_REFUSED): Failed to stop the test. The test may not be running.
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
   * The video module is disabled by default. You need to call this method to enable it. To disable the video module later, call the disableVideo method.
   *  This method sets the internal engine to an enabled state and remains effective after leaving the channel.
   *  Calling this method resets the entire engine and has a relatively slow response time. Depending on your needs, you can use the following methods to control specific video module features independently: enableLocalVideo : Whether to start the camera capture and create a local video stream. muteLocalVideoStream : Whether to publish the local video stream. muteRemoteVideoStream : Whether to receive and play the remote video stream. muteAllRemoteVideoStreams : Whether to receive and play all remote video streams.
   *  When this method is called in a channel, it resets the settings of enableLocalVideo, muteRemoteVideoStream, and muteAllRemoteVideoStreams, so use with caution.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting tips.
   */
  abstract enableVideo(): number;

  /**
   * Disables the video module.
   *
   * This method disables the video module.
   *  This method sets the internal engine to a disabled state, which remains effective after leaving the channel.
   *  Calling this method resets the entire engine and has a relatively slow response time. Depending on your needs, you can use the following methods to control specific video module features independently: enableLocalVideo : Whether to start the camera capture and create a local video stream. muteLocalVideoStream : Whether to publish the local video stream. muteRemoteVideoStream : Whether to receive and play the remote video stream. muteAllRemoteVideoStreams : Whether to receive and play all remote video streams.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting tips.
   */
  abstract disableVideo(): number;

  /**
   * Starts video preview and specifies the video source to preview.
   *
   * This method starts the local video preview and specifies the video source to appear in the preview.
   *  Mirror mode is enabled by default for local preview.
   *  After leaving the channel, the local preview remains active. You need to call stopPreview to stop the local preview.
   *
   * @param sourceType The type of video source. See VideoSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract startPreview(sourceType?: VideoSourceType): number;

  /**
   * Stops video preview.
   *
   * @param sourceType The type of video source. See VideoSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract stopPreview(sourceType?: VideoSourceType): number;

  /**
   * Starts a last-mile network probe test before a call.
   *
   * Performs a last-mile network probe test before a call to report uplink and downlink bandwidth, packet loss, jitter, and round-trip time.
   *
   * @param config Last mile probe configuration. See LastmileProbeConfig.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract startLastmileProbeTest(config: LastmileProbeConfig): number;

  /**
   * Stops the last-mile network probe test.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract stopLastmileProbeTest(): number;

  /**
   * Sets the video encoding configuration.
   *
   * Sets the encoding configuration for the local video. Each video encoding configuration corresponds to a set of video parameters, including resolution, frame rate, and bitrate.
   *  The config parameter of this method specifies the maximum values achievable under ideal network conditions. If the network condition is poor, the video engine may not use this config to render the local video and will automatically downgrade to a suitable video parameter configuration.
   *
   * @param config Video encoding configuration. See VideoEncoderConfiguration.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting tips.
   */
  abstract setVideoEncoderConfiguration(
    config: VideoEncoderConfiguration
  ): number;

  /**
   * Sets beauty effect options.
   *
   * Enables local beauty effects and sets the beauty effect options.
   *  This method depends on the video enhancement dynamic library libagora_clear_vision_extension.dll. Deleting this library will prevent the feature from functioning properly.
   *  This feature requires high device performance. When calling this method, the SDK automatically checks the device's capabilities.
   *
   * @param enabled Whether to enable the beauty effect: true : Enable the beauty effect. false : (default) Disable the beauty effect.
   * @param options Beauty effect options. See BeautyOptions for details.
   * @param type The media source type to apply the effect to. See MediaSourceType. This method only supports the following two settings:
   *  When using the camera to capture local video, keep the default value PrimaryCameraSource.
   *  To use custom captured video, set this parameter to CustomVideoSource.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -4: The current device does not support this feature. Possible reasons include:
   *  The device does not meet the performance requirements for beauty effects. It is recommended to use a higher-performance device.
   */
  abstract setBeautyEffectOptions(
    enabled: boolean,
    options: BeautyOptions,
    type?: MediaSourceType
  ): number;

  /**
   * Sets face shaping effect options and specifies the media source.
   *
   * Call this method to enhance facial features using preset parameters to achieve effects such as face slimming, eye enlargement, and nose slimming in one step. You can also adjust the overall intensity of the effect. Face shaping is a value-added service. See [Billing Strategy](https://doc.shengwang.cn/doc/rtc/android/billing/billing-strategy) for billing details.
   *  This method depends on the video enhancement dynamic library libagora_clear_vision_extension.dll. Removing this library will prevent the feature from functioning properly.
   *  This feature requires high device performance. When you call this method, the SDK automatically checks the device capability.
   *
   * @param enabled Whether to enable the face shaping effect: true : Enable face shaping. false : (default) Disable face shaping.
   * @param options Face shaping style options. See FaceShapeBeautyOptions.
   * @param type The media source type to which the effect is applied. See MediaSourceType. In this method, this parameter only supports the following settings:
   *  When capturing local video using the camera, keep the default value PrimaryCameraSource.
   *  To use custom captured video, set this parameter to CustomVideoSource.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -4: The current device does not support this feature. Possible reasons include:
   *  The device does not meet the performance requirements for beauty effects. Consider using a higher-performance device.
   */
  abstract setFaceShapeBeautyOptions(
    enabled: boolean,
    options: FaceShapeBeautyOptions,
    type?: MediaSourceType
  ): number;

  /**
   * Sets face shaping area options and specifies the media source.
   *
   * If the preset face shaping effects implemented in the setFaceShapeBeautyOptions method do not meet your expectations, you can use this method to set face shaping area options and fine-tune individual facial features for more refined results. Face shaping is a value-added service. See [Billing Strategy](https://doc.shengwang.cn/doc/rtc/android/billing/billing-strategy) for billing details.
   *  This method depends on the video enhancement dynamic library libagora_clear_vision_extension.dll. Removing this library will prevent the feature from functioning properly.
   *  This feature requires high device performance. When you call this method, the SDK automatically checks the device capability.
   *
   * @param options Face shaping area options. See FaceShapeAreaOptions.
   * @param type The media source type to which the effect is applied. See MediaSourceType. In this method, this parameter only supports the following settings:
   *  When capturing local video using the camera, keep the default value PrimaryCameraSource.
   *  To use custom captured video, set this parameter to CustomVideoSource.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -4: The current device does not support this feature. Possible reasons include:
   *  The device does not meet the performance requirements for beauty effects. Consider using a higher-performance device.
   */
  abstract setFaceShapeAreaOptions(
    options: FaceShapeAreaOptions,
    type?: MediaSourceType
  ): number;

  /**
   * Gets options for facial beauty effects.
   *
   * Call this method to get the current parameter settings for facial beauty effects.
   *
   * @param type The media source type to apply the effect to. See MediaSourceType. This method only supports the following two settings:
   *  When using the camera to capture local video, keep the default value PrimaryCameraSource.
   *  To use custom captured video, set this parameter to CustomVideoSource.
   *
   * @returns
   * The FaceShapeBeautyOptions object, if the method call succeeds. null, if the method call fails.
   */
  abstract getFaceShapeBeautyOptions(
    type?: MediaSourceType
  ): FaceShapeBeautyOptions;

  /**
   * Gets options for facial area enhancement.
   *
   * Call this method to get the current parameter settings for the facial area enhancement.
   *
   * @param shapeArea Facial area. See FaceShapeArea.
   * @param type The media source type to apply the effect to. See MediaSourceType. This method only supports the following two settings:
   *  When using the camera to capture local video, keep the default value PrimaryCameraSource.
   *  To use custom captured video, set this parameter to CustomVideoSource.
   *
   * @returns
   * The FaceShapeAreaOptions object, if the method call succeeds. null, if the method call fails.
   */
  abstract getFaceShapeAreaOptions(
    shapeArea: FaceShapeArea,
    type?: MediaSourceType
  ): FaceShapeAreaOptions;

  /**
   * Sets filter effect options and specifies the media source.
   *
   * This method depends on the video enhancement dynamic library libagora_clear_vision_extension.dll. Removing this library will prevent the feature from functioning properly.
   *  This feature requires high device performance. When you call this method, the SDK automatically checks the device capability.
   *
   * @param enabled Whether to enable the filter effect: true : Enable filter. false : (default) Disable filter.
   * @param options Filter options. See FilterEffectOptions.
   * @param type The media source type to which the effect is applied. See MediaSourceType. In this method, this parameter only supports the following settings:
   *  When capturing local video using the camera, keep the default value PrimaryCameraSource.
   *  To use custom captured video, set this parameter to CustomVideoSource.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setFilterEffectOptions(
    enabled: boolean,
    options: FilterEffectOptions,
    type?: MediaSourceType
  ): number;

  /**
   * Creates an IVideoEffectObject video effect object.
   *
   * Since Available since v4.6.2.
   *
   * @param bundlePath The path to the video effect resource bundle.
   * @param type The media source type. See MediaSourceType.
   *
   * @returns
   * The IVideoEffectObject object, if the method call succeeds. See IVideoEffectObject.
   *  An empty pointer , if the method call fails.
   */
  abstract createVideoEffectObject(
    bundlePath: string,
    type?: MediaSourceType
  ): IVideoEffectObject;

  /**
   * Destroys a video effect object.
   *
   * Since Available since v4.6.2.
   *
   * @param videoEffectObject The video effect object to destroy. See IVideoEffectObject.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract destroyVideoEffectObject(
    videoEffectObject: IVideoEffectObject
  ): number;

  /**
   * Sets low-light enhancement.
   *
   * You can call this method to enable low-light enhancement and configure its effect.
   *  This method depends on the video enhancement dynamic library libagora_clear_vision_extension.dll. Removing this library will prevent the feature from functioning properly.
   *  Low-light enhancement requires certain device performance. If the device overheats after enabling this feature, consider lowering the enhancement level or disabling the feature.
   *  To achieve high-quality low-light enhancement (LowLightEnhanceLevelHighQuality), you must first enable video denoising using setVideoDenoiserOptions. The corresponding configurations are:
   *  For automatic mode (LowLightEnhanceAuto), video denoising must be set to high quality (VideoDenoiserLevelHighQuality) and auto mode (VideoDenoiserAuto).
   *  For manual mode (LowLightEnhanceManual), video denoising must be set to high quality (VideoDenoiserLevelHighQuality) and manual mode (VideoDenoiserManual).
   *
   * @param enabled Whether to enable low-light enhancement: true : Enable low-light enhancement. false : (default) Disable low-light enhancement.
   * @param options Low-light enhancement options used to configure the effect. See LowlightEnhanceOptions.
   * @param type The media source type to which the effect is applied. See MediaSourceType. In this method, this parameter only supports the following settings:
   *  When capturing local video using the camera, keep the default value PrimaryCameraSource.
   *  To use custom captured video, set this parameter to CustomVideoSource.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setLowlightEnhanceOptions(
    enabled: boolean,
    options: LowlightEnhanceOptions,
    type?: MediaSourceType
  ): number;

  /**
   * Sets video denoising.
   *
   * You can call this method to enable video denoising and configure its effect. If the denoising strength provided by this method does not meet your needs, Agora recommends that you call the setBeautyEffectOptions method to enable the beauty skin smoothing feature for better video denoising. Recommended BeautyOptions settings for strong denoising: lighteningContrastLevel : LighteningContrastNormal lighteningLevel : 0.0 smoothnessLevel : 0.5 rednessLevel : 0.0 sharpnessLevel : 0.1
   *  This method depends on the video enhancement dynamic library libagora_clear_vision_extension.dll. Removing this library will prevent the feature from functioning properly.
   *  Video denoising requires certain device performance. If the device overheats after enabling this feature, consider lowering the denoising level or disabling the feature.
   *
   * @param enabled Whether to enable video denoising: true : Enable video denoising. false : (default) Disable video denoising.
   * @param options Video denoising options used to configure the effect. See VideoDenoiserOptions.
   * @param type The media source type to which the effect is applied. See MediaSourceType. In this method, this parameter only supports the following settings:
   *  When capturing local video using the camera, keep the default value PrimaryCameraSource.
   *  To use custom captured video, set this parameter to CustomVideoSource.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setVideoDenoiserOptions(
    enabled: boolean,
    options: VideoDenoiserOptions,
    type?: MediaSourceType
  ): number;

  /**
   * Enables color enhancement.
   *
   * Video captured by the camera may suffer from color distortion. The color enhancement feature improves color richness and accuracy by intelligently adjusting video characteristics such as saturation and contrast, making the video more vivid.
   * You can call this method to enable color enhancement and configure its effects.
   *  Call this method after enableVideo.
   *  Color enhancement requires certain device performance. If the device overheats or experiences issues after enabling color enhancement, it is recommended to lower the enhancement level or disable the feature.
   *  This method depends on the video enhancement dynamic library libagora_clear_vision_extension.dll. Deleting this library will prevent the feature from functioning properly.
   *
   * @param enabled Whether to enable color enhancement: true : Enable color enhancement. false : (default) Disable color enhancement.
   * @param options Color enhancement options used to configure the effect. See ColorEnhanceOptions.
   * @param type The media source type to apply the effect to. See MediaSourceType. This method only supports the following two settings:
   *  When using the camera to capture local video, keep the default value PrimaryCameraSource.
   *  To use custom captured video, set this parameter to CustomVideoSource.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setColorEnhanceOptions(
    enabled: boolean,
    options: ColorEnhanceOptions,
    type?: MediaSourceType
  ): number;

  /**
   * Enables/disables the virtual background.
   *
   * The virtual background feature allows you to replace the original background of the local user with a static image, dynamic video, blur effect, or separate the portrait from the background to achieve picture-in-picture. Once successfully enabled, all users in the channel can see the customized background.
   * Call this method after enableVideo or startPreview.
   *  Using a video as a virtual background may cause continuous memory usage growth, which could lead to app crashes. To avoid this, reduce the resolution and frame rate of the video.
   *  This feature requires high device performance. When this method is called, the SDK automatically checks the device capability. It is recommended to use devices with the following specs:
   *  CPU: i5 or better
   *  It is recommended to use this feature in scenarios that meet the following conditions:
   *  Use a high-definition camera and ensure even lighting.
   *  The video frame contains few objects, the user is shown as a half-body portrait with minimal occlusion, and the background color is simple and different from the user's clothing.
   *  This method depends on the virtual background dynamic library libagora_segmentation_extension.dll. Deleting this library will prevent the feature from functioning properly.
   *
   * @param enabled Whether to enable the virtual background: true : Enable virtual background. false : Disable virtual background.
   * @param backgroundSource Custom background. See VirtualBackgroundSource. To adapt the resolution of the custom background image to the SDK's video capture resolution, the SDK scales and crops the image without distortion.
   * @param segproperty Processing properties of the background image. See SegmentationProperty.
   * @param type Media source type for applying the effect. See MediaSourceType. This parameter only supports the following settings in this method:
   *  For camera-captured local video, keep the default value PrimaryCameraSource.
   *  For custom captured video, set this parameter to CustomVideoSource.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   *  -4: Device capability does not meet the requirements for using virtual background. Consider using a higher-performance device.
   */
  abstract enableVirtualBackground(
    enabled: boolean,
    backgroundSource: VirtualBackgroundSource,
    segproperty: SegmentationProperty,
    type?: MediaSourceType
  ): number;

  /**
   * Initializes the remote user view.
   *
   * This method binds the remote user to a display view and sets the rendering and mirror mode of the remote user view for local display. It only affects the video seen by the local user.
   * You need to specify the remote user's ID when calling this method. It is recommended to set it before joining the channel. If the ID is not available beforehand, you can call this method upon receiving the onUserJoined callback.
   * To unbind a remote user from a view, call this method and set view to null.
   * After leaving the channel, the SDK clears the binding between the remote user and the view.
   *  When using the recording service, since it does not send video streams, the app does not need to bind a view for it. If the app cannot identify the recording service, bind the remote user view upon receiving the onFirstRemoteVideoDecoded callback.
   *  To stop rendering the view, set view to null and call this method again to stop rendering and clear the rendering cache.
   *
   * @param canvas Display properties of the remote video. See VideoCanvas.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setupRemoteVideo(canvas: VideoCanvas): number;

  /**
   * Initializes the local view.
   *
   * This method initializes the local view and sets the display properties of the local user video. It only affects the video seen by the local user and does not affect the publishing of the local video. Call this method to bind the local video stream to a display window (view), and set the rendering and mirror mode of the local user view.
   * The binding remains effective after leaving the channel. To stop rendering or unbind, call this method and set the view parameter to null to stop rendering and clear the rendering cache.
   *  In Flutter, you do not need to call this method manually. Use AgoraVideoView to render local and remote views.
   *
   * @param canvas Display properties of the local video. See VideoCanvas.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setupLocalVideo(canvas: VideoCanvas): number;

  /**
   * Sets the video application scenario.
   *
   * After successfully calling this method to set the video application scenario, the SDK enables best practice strategies based on the specified scenario and automatically adjusts key performance indicators to optimize video experience quality. You must call this method before joining a channel.
   *
   * @param scenarioType The video application scenario. See VideoApplicationScenarioType. ApplicationScenarioMeeting (1) is suitable for meeting scenarios. If you have called setDualStreamMode to set the low stream to never send (DisableSimulcastStream), the dynamic switching of the low stream is not effective in meeting scenarios.
   * This enum value only applies to broadcaster vs broadcaster scenarios. The SDK enables the following strategies for this scenario:
   *  For meeting scenarios with higher requirements for low stream bitrate, multiple anti-weak network techniques are automatically enabled to improve the low stream's resistance to poor network conditions and ensure smooth reception of multiple streams.
   *  Monitors the number of subscribers to the high stream in real time and dynamically adjusts the high stream configuration based on the number of subscribers:
   *  If no one subscribes to the high stream, its bitrate and frame rate are automatically reduced to save upstream bandwidth and consumption.
   *  If someone subscribes to the high stream, it resets to the VideoEncoderConfiguration set by the most recent call to setVideoEncoderConfiguration. If no configuration was set previously, the following values are used:
   *  Video resolution: 1280 × 720
   *  Frame rate: 15 fps
   *  Bitrate: 1600 Kbps
   *  Monitors the number of subscribers to the low stream in real time and dynamically enables or disables the low stream:
   *  If no one subscribes to the low stream, it is automatically disabled to save upstream bandwidth and consumption.
   *  If someone subscribes to the low stream, it is enabled and reset to the SimulcastStreamConfig set by the most recent call to setDualStreamMode. If no configuration was set previously, the following values are used:
   *  Video resolution: 480 × 272
   *  Frame rate: 15 fps
   *  Bitrate: 500 Kbps ApplicationScenario1v1 (2) is suitable for [1v1 video call](https://doc.shengwang.cn/doc/one-to-one-live/android/rtm/overview/product-overview) scenarios. The SDK optimizes strategies for this scenario to meet the requirements of low latency and high video quality, improving performance in terms of image quality, first frame rendering, latency on mid-to-low-end devices, and smoothness under poor network conditions. ApplicationScenarioLiveshow (3) is suitable for [showroom live streaming](https://doc.shengwang.cn/doc/showroom/android/overview/product-overview) scenarios. The SDK optimizes strategies for this scenario to meet the high demands on first frame rendering time and image clarity. For example, it enables audio and video frame accelerated rendering by default to improve first frame rendering experience, eliminating the need to call enableInstantMediaRendering separately. It also enables B-frames by default to ensure high image quality and transmission efficiency. Additionally, it enhances video quality and smoothness under poor network conditions and on low-end devices.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -1: General error (not specifically classified).
   *  -4: Setting the video application scenario is not supported. This may occur if the audio SDK is currently in use.
   *  -7: IRtcEngine object is not initialized. You need to successfully initialize the IRtcEngine object before calling this method.
   */
  abstract setVideoScenario(scenarioType: VideoApplicationScenarioType): number;

  /**
   * @ignore
   */
  abstract setVideoQoEPreference(qoePreference: VideoQoePreferenceType): number;

  /**
   * Enables the audio module.
   *
   * The audio module is enabled by default. If you have disabled it using disableAudio, you can call this method to re-enable it.
   *  Calling this method resets the entire engine and has a relatively slow response time. You can use the following methods to control specific audio module features as needed: enableLocalAudio : Whether to enable microphone capture and create a local audio stream. muteLocalAudioStream : Whether to publish the local audio stream. muteRemoteAudioStream : Whether to receive and play the remote audio stream. muteAllRemoteAudioStreams : Whether to receive and play all remote audio streams.
   *  When calling this method in a channel, it resets the settings of enableLocalAudio, muteRemoteAudioStream, and muteAllRemoteAudioStreams, so use with caution.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract enableAudio(): number;

  /**
   * Disables the audio module.
   *
   * The audio module is enabled by default. You can call this method to disable it. This method resets the entire engine and has a relatively slow response time. Therefore, we recommend using the following methods to control the audio module: enableLocalAudio : Whether to enable microphone capture and create a local audio stream. enableLoopbackRecording : Whether to enable sound card capture. muteLocalAudioStream : Whether to publish the local audio stream. muteRemoteAudioStream : Whether to receive and play the remote audio stream. muteAllRemoteAudioStreams : Whether to receive and play all remote audio streams.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract disableAudio(): number;

  /**
   * Sets the audio encoding profile and audio scenario.
   *
   * @param profile The audio encoding profile, including sample rate, bitrate, encoding mode, and the number of channels. See AudioProfileType.
   * @param scenario The audio scenario. The volume type of the device varies depending on the audio scenario.
   * See AudioScenarioType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setAudioProfile(
    profile: AudioProfileType,
    scenario?: AudioScenarioType
  ): number;

  /**
   * Sets the audio scenario.
   *
   * @param scenario The audio scenario. The volume type of the device varies depending on the audio scenario.
   * See AudioScenarioType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setAudioScenario(scenario: AudioScenarioType): number;

  /**
   * Enables or disables local audio capture.
   *
   * When a user joins a channel, audio is enabled by default. This method can disable or re-enable local audio, i.e., stop or restart local audio capture.
   * The difference between this method and muteLocalAudioStream is: enableLocalAudio : Enables or disables local audio capture and processing. After using enableLocalAudio to disable or enable local capture, there will be a brief interruption when listening to remote playback locally. muteLocalAudioStream : Stops or resumes sending the local audio stream without affecting the audio capture status.
   *
   * @param enabled true : Re-enable local audio, i.e., enable local audio capture (default); false : Disable local audio, i.e., stop local audio capture.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract enableLocalAudio(enabled: boolean): number;

  /**
   * Stops or resumes publishing the local audio stream.
   *
   * This method controls whether to publish the locally captured audio stream. If the local audio stream is not published, the audio capture device is not disabled, so the audio capture state is not affected.
   *
   * @param mute Whether to stop publishing the local audio stream. true : Stop publishing. false : (Default) Publish.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract muteLocalAudioStream(mute: boolean): number;

  /**
   * Stops or resumes subscribing to all remote users' audio streams.
   *
   * After this method is successfully called, the local user stops or resumes subscribing to all remote users' audio streams, including the streams of users who join the channel after this method is called. By default, the SDK subscribes to all remote users' audio streams when joining a channel. To change this behavior, set autoSubscribeAudio to false when calling joinChannel to join the channel. This disables subscription to all users' audio streams upon joining.
   * If you call enableAudio or disableAudio after this method, the latter takes effect.
   *
   * @param mute Whether to stop subscribing to all remote users' audio streams: true : Stop subscribing to all remote users' audio streams. false : (Default) Subscribe to all remote users' audio streams.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract muteAllRemoteAudioStreams(mute: boolean): number;

  /**
   * Stops or resumes subscribing to the audio stream of a specified remote user.
   *
   * @param uid The user ID of the specified remote user.
   * @param mute Whether to stop subscribing to the audio stream of the specified remote user. true : Stop subscribing to the specified user's audio stream. false : (Default) Subscribe to the specified user's audio stream.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   */
  abstract muteRemoteAudioStream(uid: number, mute: boolean): number;

  /**
   * Stops or resumes publishing the local video stream.
   *
   * This method controls whether to publish the locally captured video stream. If the local video stream is not published, the video capture device is not disabled, so the video capture state is not affected.
   * Compared with calling enableLocalVideo(false) to stop local video capture and thus cancel publishing, this method responds faster.
   *
   * @param mute Whether to stop sending the local video stream. true : Stop sending the local video stream. false : (Default) Send the local video stream.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract muteLocalVideoStream(mute: boolean): number;

  /**
   * Enables or disables local video capture.
   *
   * This method disables or re-enables local video capture without affecting the reception of remote video.
   * After calling enableVideo, local video capture is enabled by default.
   * If you call enableLocalVideo(false) in a channel to disable local video capture, it also stops publishing the video stream in the channel. To re-enable it, call enableLocalVideo(true), then call updateChannelMediaOptions and set the options parameter to publish the locally captured video stream to the channel.
   * After successfully disabling or enabling local video capture, the remote user receives the onRemoteVideoStateChanged callback.
   *  This method can be called before or after joining a channel, but settings made before joining take effect only after joining.
   *  This method sets the internal engine to an enabled state and remains effective after leaving the channel.
   *
   * @param enabled Whether to enable local video capture. true : (Default) Enables local video capture. false : Disables local video capture. After disabling, the remote user will not receive the local user's video stream; however, the local user can still receive the remote user's video stream. When set to false, this method does not require a local camera.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting tips.
   */
  abstract enableLocalVideo(enabled: boolean): number;

  /**
   * Stops or resumes subscribing to all remote users' video streams.
   *
   * After this method is successfully called, the local user stops or resumes subscribing to all remote users' video streams, including the streams of users who join the channel after this method is called. By default, the SDK subscribes to all remote users' video streams when joining a channel. To change this behavior, set autoSubscribeVideo to false when calling joinChannel to join the channel. This disables subscription to all users' video streams upon joining.
   * If you call enableVideo or disableVideo after this method, the latter takes effect.
   *
   * @param mute Whether to stop subscribing to all remote users' video streams. true : Stop subscribing to all users' video streams. false : (Default) Subscribe to all users' video streams.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract muteAllRemoteVideoStreams(mute: boolean): number;

  /**
   * Sets the default video stream type to subscribe to.
   *
   * Depending on the sender's default behavior and the configuration of setDualStreamMode, the receiver's use of this method falls into the following cases:
   *  By default, the SDK enables the adaptive low stream mode (AutoSimulcastStream) on the sender side. That is, the sender only sends the high stream. Only receivers with host role can call this method to request the low stream. Once the sender receives the request, it starts sending the low stream automatically. At this point, all users in the channel can call this method to switch to low stream subscription mode.
   *  If the sender calls setDualStreamMode and sets mode to DisableSimulcastStream (never send low stream), then this method has no effect.
   *  If the sender calls setDualStreamMode and sets mode to EnableSimulcastStream (always send low stream), then both host and audience receivers can call this method to switch to low stream subscription mode. When receiving low video streams, the SDK dynamically adjusts the video stream size based on the size of the video window to save bandwidth and computing resources. The aspect ratio of the low stream is the same as that of the high stream. Based on the current aspect ratio of the high stream, the system automatically allocates resolution, frame rate, and bitrate for the low stream. If you call both this method and setRemoteVideoStreamType, the SDK uses the settings in setRemoteVideoStreamType.
   *
   * @param streamType Default video stream type to subscribe to: VideoStreamType.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setRemoteDefaultVideoStreamType(streamType: VideoStreamType): number;

  /**
   * Stops or resumes subscribing to the video stream of a specified remote user.
   *
   * @param uid The user ID of the specified remote user.
   * @param mute Whether to stop subscribing to the video stream of the specified remote user. true : Stop subscribing to the specified user's video stream. false : (Default) Subscribe to the specified user's video stream.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   */
  abstract muteRemoteVideoStream(uid: number, mute: boolean): number;

  /**
   * Sets the video stream type to subscribe to.
   *
   * Depending on the sender's default behavior and the configuration of setDualStreamMode, the receiver's use of this method falls into the following cases:
   *  By default, the SDK enables the adaptive low stream mode (AutoSimulcastStream) on the sender side. That is, the sender only sends the high stream. Only receivers with host role can call this method to request the low stream. Once the sender receives the request, it starts sending the low stream automatically. At this point, all users in the channel can call this method to switch to low stream subscription mode.
   *  If the sender calls setDualStreamMode and sets mode to DisableSimulcastStream (never send low stream), then this method has no effect.
   *  If the sender calls setDualStreamMode and sets mode to EnableSimulcastStream (always send low stream), then both host and audience receivers can call this method to switch to low stream subscription mode. When receiving low video streams, the SDK dynamically adjusts the video stream size based on the size of the video window to save bandwidth and computing resources. The aspect ratio of the low stream is the same as that of the high stream. Based on the current aspect ratio of the high stream, the system automatically allocates resolution, frame rate, and bitrate for the low stream.
   *  This method can be called before or after joining a channel.
   *  If you call both this method and setRemoteDefaultVideoStreamType, the SDK uses the settings in this method.
   *
   * @param uid User ID.
   * @param streamType Video stream type: VideoStreamType.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setRemoteVideoStreamType(
    uid: number,
    streamType: VideoStreamType
  ): number;

  /**
   * Sets subscription options for the remote video stream.
   *
   * When the remote side sends dual streams, you can call this method to set subscription options for the remote video stream. The SDK's default subscription behavior for remote video streams depends on the type of registered video observer:
   *  If IVideoFrameObserver is registered, the SDK subscribes to both raw and encoded data by default.
   *  If IVideoEncodedFrameObserver is registered, the SDK subscribes only to encoded data by default.
   *  If both observers are registered, the SDK follows the one registered later. For example, if IVideoFrameObserver is registered later, the SDK subscribes to both raw and encoded data by default. If you want to change the default behavior above, or set different subscription options for different uid s, you can call this method to configure.
   *
   * @param uid Remote user ID.
   * @param options Subscription settings for the video stream. See VideoSubscriptionOptions.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setRemoteVideoSubscriptionOptions(
    uid: number,
    options: VideoSubscriptionOptions
  ): number;

  /**
   * Sets the audio subscription blocklist.
   *
   * You can call this method to specify the audio streams you do not want to subscribe to.
   *  This method can be called before or after joining a channel.
   *  The audio subscription blocklist is not affected by muteRemoteAudioStream, muteAllRemoteAudioStreams, or autoSubscribeAudio in ChannelMediaOptions.
   *  After setting the blocklist, if you leave and rejoin the channel, the blocklist remains effective.
   *  If a user is in both the audio subscription blocklist and allowlist, only the blocklist takes effect.
   *
   * @param uidList List of user IDs in the audio subscription blocklist.
   * If you want to block the audio stream of a specific user, add that user's ID to this list. If you want to remove a user from the blocklist, call setSubscribeAudioBlocklist again with an updated list that excludes the user's uid.
   * @param uidNumber Number of users in the blocklist.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setSubscribeAudioBlocklist(
    uidList: number[],
    uidNumber: number
  ): number;

  /**
   * Sets the audio subscription allowlist.
   *
   * You can call this method to specify the audio streams you want to subscribe to.
   *  This method can be called before or after joining a channel.
   *  The audio subscription allowlist is not affected by muteRemoteAudioStream, muteAllRemoteAudioStreams, or autoSubscribeAudio in ChannelMediaOptions.
   *  After setting the allowlist, if you leave and rejoin the channel, the allowlist remains effective.
   *  If a user is in both the audio subscription blocklist and allowlist, only the blocklist takes effect.
   *
   * @param uidList List of user IDs in the audio subscription allowlist.
   * If you want to subscribe to the audio stream of a specific user, add that user's ID to this list. If you want to remove a user from the allowlist, call setSubscribeAudioAllowlist again with an updated list that excludes the user's uid.
   * @param uidNumber Number of users in the allowlist.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setSubscribeAudioAllowlist(
    uidList: number[],
    uidNumber: number
  ): number;

  /**
   * Sets the video subscription blocklist.
   *
   * You can call this method to specify the video streams you do not want to subscribe to.
   *  You can call this method either before or after joining a channel.
   *  The video subscription blocklist is not affected by muteRemoteVideoStream, muteAllRemoteVideoStreams, or autoSubscribeVideo in ChannelMediaOptions.
   *  After setting the blocklist, it remains effective even if you leave and rejoin the channel.
   *  If a user is in both the audio subscription allowlist and blocklist, only the blocklist takes effect.
   *
   * @param uidList The user ID list for the video subscription blocklist.
   * If you want to block the video stream from a specific user, add that user's ID to this list. If you want to remove a user from the blocklist, you need to call the setSubscribeVideoBlocklist method again to update the list so that it no longer includes the uid of the user you want to remove.
   * @param uidNumber The number of users in the blocklist.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setSubscribeVideoBlocklist(
    uidList: number[],
    uidNumber: number
  ): number;

  /**
   * Sets the video subscription allowlist.
   *
   * You can call this method to specify the video streams you want to subscribe to.
   *  This method can be called before or after joining a channel.
   *  The video subscription allowlist is not affected by muteRemoteVideoStream, muteAllRemoteVideoStreams, or autoSubscribeVideo in ChannelMediaOptions.
   *  After setting the allowlist, if you leave and rejoin the channel, the allowlist remains effective.
   *  If a user is in both the audio subscription blocklist and allowlist, only the blocklist takes effect.
   *
   * @param uidList List of user IDs in the video subscription allowlist.
   * If you want to subscribe only to the video stream of a specific user, add that user's ID to this list. If you want to remove a user from the allowlist, call setSubscribeVideoAllowlist again with an updated list that excludes the user's uid.
   * @param uidNumber Number of users in the allowlist.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setSubscribeVideoAllowlist(
    uidList: number[],
    uidNumber: number
  ): number;

  /**
   * Enables audio volume indication.
   *
   * This method allows the SDK to periodically report to the app the volume information of the local user who is sending streams and the remote users (up to 3) with the highest instantaneous volume.
   *
   * @param interval The time interval for the volume indication:
   *  ≤ 0: Disables the volume indication feature.
   *  > 0: Returns the interval for volume indication, in milliseconds. It is recommended to set it above 100 ms. Must not be less than 10 ms, otherwise the onAudioVolumeIndication callback will not be received.
   * @param smooth The smoothing factor that specifies the sensitivity of the volume indication. The range is [0,10], and the recommended value is 3. The larger the value, the more sensitive the fluctuation; the smaller the value, the smoother the fluctuation.
   * @param reportVad true : Enables the local voice detection feature. When enabled, the vad parameter in the onAudioVolumeIndication callback reports whether a human voice is detected locally. false : (Default) Disables the local voice detection feature. Except in scenarios where the engine automatically performs local voice detection, the vad parameter in the onAudioVolumeIndication callback does not report whether a human voice is detected locally.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract enableAudioVolumeIndication(
    interval: number,
    smooth: number,
    reportVad: boolean
  ): number;

  /**
   * @ignore
   */
  abstract startAudioRecording(config: AudioRecordingConfiguration): number;

  /**
   * Registers an audio encoded frame observer.
   *
   * Call this method after joining a channel.
   *  Since this method and startAudioRecording both set audio content and quality, it is not recommended to use this method together with startAudioRecording. Otherwise, only the method called later takes effect.
   *
   * @param config Settings for the encoded audio observer. See AudioEncodedFrameObserverConfig.
   *
   * @returns
   * An IAudioEncodedFrameObserver object.
   */
  abstract registerAudioEncodedFrameObserver(
    config: AudioEncodedFrameObserverConfig,
    observer: IAudioEncodedFrameObserver
  ): number;

  /**
   * @ignore
   */
  abstract stopAudioRecording(): number;

  /**
   * @ignore
   */
  abstract createMediaPlayer(): IMediaPlayer;

  /**
   * Destroys the media player.
   *
   * @param mediaPlayer IMediaPlayer object.
   *
   * @returns
   * ≥ 0: The method call succeeds and returns the media player ID.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
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
   * Starts playing a music file.
   *
   * For supported audio file formats, see [What audio file formats does RTC SDK support](https://doc.shengwang.cn/faq/general-product-inquiry/audio-format). If the local music file does not exist, the file format is not supported, or the online music file URL is inaccessible, the SDK reports AudioMixingReasonCanNotOpen.
   *  Using this method to play short sound effect files may result in playback failure. To play sound effects, use playEffect.
   *  If you need to call this method multiple times, ensure that the interval between calls is greater than 500 ms.
   *
   * @param filePath File path:
   *  Windows: The absolute path or URL of the audio file, including the file name and extension. For example: C:\music\audio.mp4.
   *  macOS: The absolute path or URL of the audio file, including the file name and extension. For example: /var/mobile/Containers/Data/audio.mp4.
   * @param loopback Whether to play the music file only locally: true : Play only locally. Only the local user can hear the music. false : Publish the music file to remote users. Both local and remote users can hear the music.
   * @param cycle Number of times to play the music file.
   *  > 0: Number of times to play. For example, 1 means play once.
   *  -1: Play in an infinite loop.
   * @param startPos The playback position of the music file in milliseconds.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure:
   *  -1: General error (not specifically categorized).
   *  -2: Invalid parameter.
   *  -3: SDK not ready:
   *  Check whether the audio module is enabled.
   *  Check the integrity of the assembly. IRtcEngine initialization failed. Please reinitialize IRtcEngine.
   */
  abstract startAudioMixing(
    filePath: string,
    loopback: boolean,
    cycle: number,
    startPos?: number
  ): number;

  /**
   * Stops playing the music file.
   *
   * After calling startAudioMixing to play a music file, call this method to stop playback. To pause playback instead, call pauseAudioMixing.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract stopAudioMixing(): number;

  /**
   * Pauses the playback of the music file.
   *
   * After calling startAudioMixing to play a music file, call this method to pause the playback. To stop playback, call stopAudioMixing.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract pauseAudioMixing(): number;

  /**
   * Resumes the playback of the music file.
   *
   * After calling pauseAudioMixing to pause the music file, call this method to resume playback.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract resumeAudioMixing(): number;

  /**
   * Specifies the playback audio track of the current music file.
   *
   * After getting the number of audio tracks in the music file, you can call this method to specify any track for playback. For example, if a multi-track file contains songs in different languages on different tracks, you can use this method to set the playback language.
   *  For supported audio file formats, see [What audio file formats does the RTC SDK support?](https://doc.shengwang.cn/faq/general-product-inquiry/audio-format).
   *  You need to call this method after calling startAudioMixing and receiving the onAudioMixingStateChanged(AudioMixingStatePlaying) callback.
   *
   * @param index The specified playback track. The value range should be greater than or equal to 0 and less than the return value of getAudioTrackCount.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract selectAudioTrack(index: number): number;

  /**
   * Gets the audio track index of the current music file.
   *
   * You need to call this method after calling startAudioMixing and receiving the onAudioMixingStateChanged(AudioMixingStatePlaying) callback.
   *
   * @returns
   * Returns the audio track index of the current music file if the method call succeeds.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract getAudioTrackCount(): number;

  /**
   * Adjusts the playback volume of the music file.
   *
   * This method adjusts the playback volume of the mixed music file on both the local and remote ends. Calling this method does not affect the playback volume of sound effect files set by the playEffect method.
   *
   * @param volume The volume range of the music file is 0~100. 100 (default) is the original file volume.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract adjustAudioMixingVolume(volume: number): number;

  /**
   * Adjusts the remote playback volume of the music file.
   *
   * This method adjusts the playback volume of the mixed music file on the remote end.
   *
   * @param volume Volume of the music file. The range is [0,100], where 100 (default) is the original volume.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract adjustAudioMixingPublishVolume(volume: number): number;

  /**
   * Gets the remote playback volume of the music file.
   *
   * This API helps you troubleshoot volume-related issues. You need to call this method after calling startAudioMixing and receiving the onAudioMixingStateChanged(AudioMixingStatePlaying) callback.
   *
   * @returns
   * ≥ 0: Returns the volume value if the method call succeeds. The range is [0,100].
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract getAudioMixingPublishVolume(): number;

  /**
   * Adjusts the local playback volume of the music file.
   *
   * @param volume Volume of the music file. The range is [0,100], where 100 (default) is the original volume.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract adjustAudioMixingPlayoutVolume(volume: number): number;

  /**
   * Gets the local playback volume of the music file.
   *
   * You can call this method to get the local playback volume of the mixed music file, which helps troubleshoot volume-related issues.
   *
   * @returns
   * ≥ 0: Success. Returns the volume value in the range [0,100].
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract getAudioMixingPlayoutVolume(): number;

  /**
   * Gets the total duration of the music file.
   *
   * This method gets the total duration of the music file in milliseconds.
   *
   * @returns
   * ≥ 0: Success. Returns the duration of the music file.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract getAudioMixingDuration(): number;

  /**
   * Gets the playback progress of the music file.
   *
   * This method gets the current playback progress of the music file in milliseconds.
   *  You must call this method after calling startAudioMixing and receiving the onAudioMixingStateChanged(AudioMixingStatePlaying) callback.
   *  If you need to call getAudioMixingCurrentPosition multiple times, make sure the interval between calls is greater than 500 ms.
   *
   * @returns
   * ≥ 0: Success. Returns the current playback position of the music file (ms). 0 indicates the music file has not started playing.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract getAudioMixingCurrentPosition(): number;

  /**
   * Sets the playback position of the music file.
   *
   * This method allows you to set the playback position of the audio file, so you can play the file from a specific position instead of from the beginning.
   *
   * @param pos Integer. The position of the progress bar in milliseconds.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setAudioMixingPosition(pos: number): number;

  /**
   * Sets the channel mode of the current audio file.
   *
   * In stereo audio files, the left and right channels can store different audio data. Depending on your needs, you can set the channel mode to original, left, right, or mixed. This method applies only to stereo audio files.
   *
   * @param mode The channel mode. See AudioMixingDualMonoMode.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setAudioMixingDualMonoMode(mode: AudioMixingDualMonoMode): number;

  /**
   * Adjusts the pitch of the locally played music file.
   *
   * When mixing local vocals with a music file, you can call this method to adjust only the pitch of the music file.
   *
   * @param pitch Adjusts the pitch of the locally played music file in semitone steps. The default value is 0, meaning no pitch adjustment. The range is [-12,12], where each adjacent value differs by one semitone. The greater the absolute value, the more the pitch is raised or lowered.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setAudioMixingPitch(pitch: number): number;

  /**
   * Sets the playback speed of the current music file.
   *
   * You need to call this method after calling startAudioMixing and receiving the onAudioMixingStateChanged callback reporting the playback state as AudioMixingStatePlaying.
   *
   * @param speed The playback speed of the music file. The recommended range is [50,400], where:
   *  50: 0.5x speed.
   *  100: Original speed.
   *  400: 4x speed.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setAudioMixingPlaybackSpeed(speed: number): number;

  /**
   * Gets the playback volume of audio effect files.
   *
   * The volume range is 0~100. 100 (default) is the original file volume. You must call this method after playEffect.
   *
   * @returns
   * The volume of the audio effect file.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract getEffectsVolume(): number;

  /**
   * Sets the playback volume of audio effect files.
   *
   * @param volume Playback volume. The range is [0,100]. The default is 100, representing the original volume.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setEffectsVolume(volume: number): number;

  /**
   * Loads the audio effect file into memory.
   *
   * To ensure smooth communication, be mindful of the size of the preloaded audio effect files.
   * For supported audio formats, see [What audio formats are supported by the RTC SDK](https://doc.shengwang.cn/faq/general-product-inquiry/audio-format).
   *
   * @param soundId The ID of the audio effect. Each audio effect has a unique ID.
   * @param filePath File path:
   *  Windows: Absolute path or URL of the audio file, including the file name and extension. For example, C:\music\audio.mp4.
   *  macOS: Absolute path or URL of the audio file, including the file name and extension. For example, /var/mobile/Containers/Data/audio.mp4.
   * @param startPos The start position for loading the audio effect file, in milliseconds.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract preloadEffect(
    soundId: number,
    filePath: string,
    startPos?: number
  ): number;

  /**
   * Plays the specified local or online audio effect file.
   *
   * You can call this method multiple times with different soundID and filePath to play multiple audio effects simultaneously. For optimal user experience, it is recommended to play no more than 3 audio effects at the same time. If you need to play online audio effect files, Agora recommends caching the online files to the local device first, then calling preloadEffect to preload them into memory before calling this method for playback. Otherwise, playback failures or no sound may occur due to timeout or failure in loading online files.
   *
   * @param soundId The ID of the audio effect. Each audio effect has a unique ID. If you have preloaded the effect using preloadEffect, make sure this parameter matches the soundId used in preloadEffect.
   * @param filePath The path of the audio file to play. Supports URLs of online files and absolute file paths, including the file name and extension. Supported formats include MP3, AAC, M4A, MP4, WAV, 3GP, etc. If you have preloaded the effect using preloadEffect, make sure this parameter matches the filePath used in preloadEffect.
   * @param loopCount The number of times to loop the audio effect.
   *  ≥ 0: Number of loops. For example, 1 means play twice in total.
   *  -1: Infinite loop.
   * @param pitch The pitch of the audio effect. Range: [0.5,2.0]. Default is 1.0, which is the original pitch. The smaller the value, the lower the pitch.
   * @param pan The spatial position of the audio effect. Range: [-1.0,1.0], for example:
   *  -1.0: Audio appears on the left
   *  0.0: Audio appears in the center
   *  1.0: Audio appears on the right
   * @param gain The volume of the audio effect. Range: [0.0,100.0]. Default is 100.0, which is the original volume. The smaller the value, the lower the volume.
   * @param publish Whether to publish the audio effect to remote users: true : Publishes the audio effect. Both local and remote users can hear it. false : Does not publish the audio effect. Only local users can hear it.
   * @param startPos The playback position of the audio effect file in milliseconds.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
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
   * After calling preloadEffect multiple times to preload several audio effect files, you can call this method to play all preloaded audio effects.
   *
   * @param loopCount The number of times to loop the audio effect:
   *  -1: Loops indefinitely until stopEffect or stopAllEffects is called.
   *  0: Plays the audio effect once.
   *  1: Plays the audio effect twice.
   * @param pitch The pitch of the audio effect. Range: [0.5,2.0]. Default is 1.0, which is the original pitch. The smaller the value, the lower the pitch.
   * @param pan The spatial position of the audio effect. Range: [-1.0,1.0]:
   *  -1.0: Audio appears on the left.
   *  0: Audio appears in the center.
   *  1.0: Audio appears on the right.
   * @param gain The volume of the audio effect. Range: [0,100]. 100 is the default and represents the original volume. The smaller the value, the lower the volume.
   * @param publish Whether to publish the audio effect to remote users: true : Publishes the audio effect to remote users. Both local and remote users can hear it. false : (Default) Does not publish the audio effect. Only local users can hear it.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract playAllEffects(
    loopCount: number,
    pitch: number,
    pan: number,
    gain: number,
    publish?: boolean
  ): number;

  /**
   * Gets the playback volume of the specified audio effect file.
   *
   * @param soundId The ID of the audio effect file.
   *
   * @returns
   * ≥ 0: The method call succeeds and returns the playback volume. Volume range is [0,100]. 100 is the original volume.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract getVolumeOfEffect(soundId: number): number;

  /**
   * Sets the playback volume of the specified audio effect file.
   *
   * @param soundId The ID of the specified audio effect. Each audio effect has a unique ID.
   * @param volume Playback volume. The range is [0,100]. The default is 100, representing the original volume.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setVolumeOfEffect(soundId: number, volume: number): number;

  /**
   * Pauses playback of an audio effect file.
   *
   * @param soundId The ID of the audio effect. Each audio effect has a unique ID.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract pauseEffect(soundId: number): number;

  /**
   * Pauses playback of all audio effect files.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract pauseAllEffects(): number;

  /**
   * Resumes playback of the specified audio effect file.
   *
   * @param soundId The ID of the audio effect. Each audio effect has a unique ID.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract resumeEffect(soundId: number): number;

  /**
   * Resumes playback of all audio effect files.
   *
   * After calling pauseAllEffects to pause all audio effects, you can call this method to resume playback.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract resumeAllEffects(): number;

  /**
   * Stops playback of the specified audio effect file.
   *
   * When you no longer need to play a specific audio effect file, you can call this method to stop playback. If you only need to pause playback, call pauseEffect.
   *
   * @param soundId The ID of the specified audio effect file. Each audio effect file has a unique ID.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract stopEffect(soundId: number): number;

  /**
   * Stops playback of all audio effect files.
   *
   * When you no longer need to play audio effects, you can call this method to stop playback. If you only need to pause playback, call pauseAllEffects.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract stopAllEffects(): number;

  /**
   * Releases a preloaded audio effect file from memory.
   *
   * After loading an audio effect file into memory using preloadEffect, call this method to release the audio effect file.
   *
   * @param soundId The ID of the specified audio effect file. Each audio effect file has a unique ID.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract unloadEffect(soundId: number): number;

  /**
   * Releases all preloaded audio effect files from memory.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract unloadAllEffects(): number;

  /**
   * Gets the total duration of the specified audio effect file.
   *
   * You must call this method after joining a channel.
   *
   * @param filePath File path:
   *  Windows: The absolute path or URL of the audio file, including the file name and extension. For example, C:\music\audio.mp4.
   *  macOS: The absolute path or URL of the audio file, including the file name and extension. For example, /var/mobile/Containers/Data/audio.mp4.
   *
   * @returns
   * If the method call succeeds, returns the duration (ms) of the specified audio effect file.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract getEffectDuration(filePath: string): number;

  /**
   * Sets the playback position of the specified audio effect file.
   *
   * After successful setting, the local audio effect file plays from the specified position. Call this method after playEffect.
   *
   * @param soundId The ID of the audio effect. Each audio effect has a unique ID.
   * @param pos The playback position of the audio effect file, in milliseconds.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setEffectPosition(soundId: number, pos: number): number;

  /**
   * Gets the playback progress of the specified sound effect file.
   *
   * You need to call this method after playEffect.
   *
   * @param soundId The ID of the sound effect. Each sound effect has a unique ID.
   *
   * @returns
   * If the method call succeeds, returns the playback progress of the specified sound effect file (in milliseconds).
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract getEffectCurrentPosition(soundId: number): number;

  /**
   * Enables/disables stereo sound for remote users.
   *
   * To use setRemoteVoicePosition for spatial audio positioning, make sure to call this method before joining the channel to enable stereo sound for remote users.
   *
   * @param enabled Whether to enable stereo sound for remote users: true : Enable stereo sound. false : Disable stereo sound.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract enableSoundPositionIndication(enabled: boolean): number;

  /**
   * Sets the 2D position of a remote user's voice, that is, the horizontal position.
   *
   * Sets the 2D position and volume of a remote user's voice to help the local user determine the direction of the sound.
   * By calling this method to set the position where the remote user's voice appears, the difference in sound between the left and right channels creates a sense of direction, allowing the user to determine the remote user's real-time position. In multiplayer online games, such as battle royale games, this method can effectively enhance the directional perception of game characters and simulate realistic scenarios.
   *  To use this method, you must call enableSoundPositionIndication before joining the channel to enable stereo sound for remote users.
   *  For the best listening experience, it is recommended to use wired headphones when using this method.
   *  This method must be called after joining the channel.
   *
   * @param uid The ID of the remote user
   * @param pan Sets the 2D position of the remote user's voice. The range is [-1.0, 1.0]:
   *  (Default) 0.0: The sound appears in the center.
   *  -1.0: The sound appears on the left.
   *  1.0: The sound appears on the right.
   * @param gain Sets the volume of the remote user's voice. The range is [0.0, 100.0], and the default is 100.0, which represents the user's original volume. The smaller the value, the lower the volume.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setRemoteVoicePosition(
    uid: number,
    pan: number,
    gain: number
  ): number;

  /**
   * Enables or disables spatial audio.
   *
   * After enabling spatial audio, you can call setRemoteUserSpatialAudioParams to set spatial audio parameters for remote users.
   *  This method can be called before or after joining a channel.
   *  This method depends on the spatial audio dynamic library libagora_spatial_audio_extension.dll. Removing the library will prevent the feature from working properly.
   *
   * @param enabled Whether to enable spatial audio: true : Enable spatial audio. false : Disable spatial audio.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract enableSpatialAudio(enabled: boolean): number;

  /**
   * Sets the spatial audio parameters for a remote user.
   *
   * You must call this method after enableSpatialAudio. After successfully setting the spatial audio parameters for the remote user, the local user hears the remote user with a sense of spatiality.
   *
   * @param uid User ID. Must be the same as the user ID used when joining the channel.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setRemoteUserSpatialAudioParams(
    uid: number,
    params: SpatialAudioParams
  ): number;

  /**
   * Sets a preset voice beautifier effect.
   *
   * Call this method to set a preset voice beautifier effect for the local user who sends the stream. After the effect is set, all users in the channel can hear the effect. You can set different beautifier effects for users depending on the scenario.
   *  Do not set the profile parameter of setAudioProfile to AudioProfileSpeechStandard (1) or AudioProfileIot (6), otherwise this method does not take effect.
   *  This method provides the best result for voice processing. It is not recommended for processing audio that contains music.
   *  After calling setVoiceBeautifierPreset, do not call the following methods, or the effect set by setVoiceBeautifierPreset will be overridden: setAudioEffectPreset setAudioEffectParameters setLocalVoicePitch setLocalVoiceEqualization setLocalVoiceReverb setVoiceBeautifierParameters setVoiceConversionPreset
   *  This method depends on the voice beautifier dynamic library libagora_audio_beauty_extension.dll. If the library is deleted, this feature cannot be used properly.
   *
   * @param preset The preset voice beautifier option. See VoiceBeautifierPreset.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setVoiceBeautifierPreset(preset: VoiceBeautifierPreset): number;

  /**
   * Sets the SDK's preset voice effects.
   *
   * Call this method to set the SDK's preset voice effects for the local user who is sending the stream. This does not change the gender characteristics of the original voice. Once the effect is set, all users in the channel can hear it.
   *  Do not set the profile parameter in setAudioProfile to AudioProfileSpeechStandard (1) or AudioProfileIot (6), otherwise this method will not take effect.
   *  If you call setAudioEffectPreset and set an enum value other than RoomAcoustics3dVoice or PitchCorrection, do not call setAudioEffectParameters, or the effect set by setAudioEffectPreset will be overridden.
   *  After calling setAudioEffectPreset, it is not recommended to call the following methods, or the effect set by setAudioEffectPreset will be overridden: setVoiceBeautifierPreset setLocalVoicePitch setLocalVoiceEqualization setLocalVoiceReverb setVoiceBeautifierParameters setVoiceConversionPreset
   *  This method depends on the voice beautifier dynamic library libagora_audio_beauty_extension.dll. If this library is deleted, the feature cannot be enabled properly.
   *
   * @param preset The preset audio effect option. See AudioEffectPreset.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setAudioEffectPreset(preset: AudioEffectPreset): number;

  /**
   * Sets a preset voice conversion effect.
   *
   * Call this method to set a preset voice conversion effect provided by the SDK for the local user who sends the stream. After the effect is set, all users in the channel can hear the effect. You can set different voice conversion effects for users depending on the scenario.
   *  Do not set the profile parameter of setAudioProfile to AudioProfileSpeechStandard (1) or AudioProfileIot (6), otherwise this method does not take effect.
   *  This method provides the best result for voice processing. It is not recommended for processing audio that contains music.
   *  After calling setVoiceConversionPreset, do not call the following methods, or the effect set by setVoiceConversionPreset will be overridden: setAudioEffectPreset setAudioEffectParameters setVoiceBeautifierPreset setVoiceBeautifierParameters setLocalVoicePitch setLocalVoiceFormant setLocalVoiceEqualization setLocalVoiceReverb
   *  This method depends on the voice beautifier dynamic library libagora_audio_beauty_extension.dll. If the library is deleted, this feature cannot be used properly.
   *
   * @param preset The preset voice conversion option: VoiceConversionPreset.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setVoiceConversionPreset(preset: VoiceConversionPreset): number;

  /**
   * Sets parameters for SDK preset voice effects.
   *
   * Call this method to configure the following for local stream publishing users:
   *  3D voice effect: Set the surround cycle of the 3D voice effect.
   *  Pitch correction effect: Set the base scale and main pitch of the pitch correction effect. To allow users to adjust the pitch correction effect themselves, it is recommended to bind the base scale and main pitch configuration options to UI elements in your application. After setting, all users in the channel can hear the effect. To achieve better voice effects, it is recommended to do the following before calling this method:
   *  Call setAudioScenario to set the audio scenario to high-quality, i.e., AudioScenarioGameStreaming (3).
   *  Call setAudioProfile and set profile to AudioProfileMusicHighQuality (4) or AudioProfileMusicHighQualityStereo (5).
   *  This method can be called before or after joining a channel.
   *  Do not set the profile parameter of setAudioProfile to AudioProfileSpeechStandard (1) or AudioProfileIot (6), otherwise this method will not take effect.
   *  This method is best suited for voice processing. It is not recommended for audio data containing music.
   *  After calling setAudioEffectParameters, avoid calling the following methods, as they will override the effect set by setAudioEffectParameters : setAudioEffectPreset setVoiceBeautifierPreset setLocalVoicePitch setLocalVoiceEqualization setLocalVoiceReverb setVoiceBeautifierParameters setVoiceConversionPreset
   *  This method depends on the voice beautifier dynamic library libagora_audio_beauty_extension.dll. Deleting this library will cause the feature to fail to work properly.
   *
   * @param preset SDK preset effects. Supports the following settings: RoomAcoustics3dVoice : 3D voice effect.
   *  Before using this enum, you need to set the profile parameter of setAudioProfile to AudioProfileMusicStandardStereo (3) or AudioProfileMusicHighQualityStereo (5), otherwise the setting is invalid.
   *  After enabling 3D voice, users need to use audio playback devices that support stereo to hear the expected effect. PitchCorrection : Pitch correction effect.
   * @param param1 If preset is set to RoomAcoustics3dVoice, then param1 indicates the surround cycle of the 3D voice effect. Range: [1,60], in seconds. Default is 10, meaning the voice surrounds 360 degrees in 10 seconds.
   *  If preset is set to PitchCorrection, then param1 indicates the base scale of the pitch correction effect: 1 : (Default) Natural major scale. 2 : Natural minor scale. 3 : Japanese minor scale.
   * @param param2 If preset is set to RoomAcoustics3dVoice, you need to set param2 to 0.
   *  If preset is set to PitchCorrection, then param2 indicates the main pitch of the pitch correction effect: 1 : A 2 : A# 3 : B 4 : (Default) C 5 : C# 6 : D 7 : D# 8 : E 9 : F 10 : F# 11 : G 12 : G#
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setAudioEffectParameters(
    preset: AudioEffectPreset,
    param1: number,
    param2: number
  ): number;

  /**
   * Sets the parameters for preset voice beautifier effects.
   *
   * Call this method to set the gender characteristics and reverb effect of the singing beautifier. This method applies to the local user who is sending the stream. Once set, all users in the channel can hear the effect.
   * To achieve better voice effects, it is recommended to perform the following before calling this method:
   *  Call setAudioScenario to set the audio scenario to high quality, i.e., AudioScenarioGameStreaming (3).
   *  Call setAudioProfile to set profile to AudioProfileMusicHighQuality (4) or AudioProfileMusicHighQualityStereo (5).
   *  This method can be called before or after joining a channel.
   *  Do not set the profile parameter in setAudioProfile to AudioProfileSpeechStandard (1) or AudioProfileIot (6), otherwise this method will not take effect.
   *  This method is best suited for voice processing and is not recommended for audio that contains music.
   *  After calling setVoiceBeautifierParameters, it is not recommended to call the following methods, or the effect set by setVoiceBeautifierParameters will be overridden: setAudioEffectPreset setAudioEffectParameters setVoiceBeautifierPreset setLocalVoicePitch setLocalVoiceEqualization setLocalVoiceReverb setVoiceConversionPreset
   *  This method depends on the voice beautifier dynamic library libagora_audio_beauty_extension.dll. If this library is deleted, the feature cannot be enabled properly.
   *
   * @param preset Preset effect: SINGING_BEAUTIFIER : Singing beautifier.
   * @param param1 Gender characteristic of the singing voice: 1 : Male. 2 : Female.
   * @param param2 Reverb effect of the singing voice: 1 : Small room reverb. 2 : Large room reverb. 3 : Hall reverb.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
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
   * Sets the pitch of the local voice.
   *
   * @param pitch Voice frequency. Can be set in the range [0.5, 2.0]. Lower values result in lower pitch. Default is 1.0, meaning no pitch change.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setLocalVoicePitch(pitch: number): number;

  /**
   * Sets the formant ratio to change the voice timbre.
   *
   * Formant ratio is a parameter that affects the timbre of the voice. A smaller value results in a deeper voice, while a larger value results in a sharper voice. Once set, all users in the channel can hear the effect. If you want to change both timbre and pitch, it is recommended to use this method together with setLocalVoicePitch.
   *
   * @param formantRatio Formant ratio. The range is [-1.0, 1.0]. Default is 0.0, which means no change to the original timbre. Recommended range is [-0.4, 0.6]. Effects may be suboptimal outside this range.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setLocalVoiceFormant(formantRatio: number): number;

  /**
   * Sets the local voice equalization effect.
   *
   * @param bandFrequency Index of the frequency band. The range is [0,9], representing 10 frequency bands. The corresponding center frequencies are [31, 62, 125, 250, 500, 1k, 2k, 4k, 8k, 16k] Hz. See AudioEqualizationBandFrequency.
   * @param bandGain Gain of each band in dB. The value range is [-15,15], with a default of 0.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setLocalVoiceEqualization(
    bandFrequency: AudioEqualizationBandFrequency,
    bandGain: number
  ): number;

  /**
   * Sets the reverb effect for the local voice.
   *
   * The SDK provides a simpler method setAudioEffectPreset to directly apply preset reverb effects such as pop, R&B, and KTV. This method can be called before or after joining a channel.
   *
   * @param reverbKey Reverb effect key. This method supports 5 reverb keys. See AudioReverbType.
   * @param value The value corresponding to each reverb effect key.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setLocalVoiceReverb(
    reverbKey: AudioReverbType,
    value: number
  ): number;

  /**
   * Sets a preset headphone equalizer effect.
   *
   * This method is mainly used in spatial audio scenarios. You can select a preset headphone equalizer to listen to audio and achieve the desired audio experience. If your headphones already have good equalization effects, calling this method may not significantly enhance the experience and may even degrade it.
   *
   * @param preset Preset headphone equalizer effect. See HeadphoneEqualizerPreset.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure
   *  -1: General error (not specifically classified).
   */
  abstract setHeadphoneEQPreset(preset: HeadphoneEqualizerPreset): number;

  /**
   * Sets the low and high frequency parameters of the headphone equalizer.
   *
   * In spatial audio scenarios, if the expected effect is not achieved after calling the setHeadphoneEQPreset method to use a preset headphone equalizer, you can further adjust the headphone equalizer effect by calling this method.
   *
   * @param lowGain Low frequency parameter of the headphone equalizer. Value range: [-10,10]. The higher the value, the deeper the sound.
   * @param highGain High frequency parameter of the headphone equalizer. Value range: [-10,10]. The higher the value, the sharper the sound.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure
   *  -1: General error (not specifically classified).
   */
  abstract setHeadphoneEQParameters(lowGain: number, highGain: number): number;

  /**
   * Enables or disables the AI voice tuner feature.
   *
   * The AI voice tuner feature enhances voice quality and adjusts voice tone styles.
   *
   * @param enabled Whether to enable the AI voice tuner feature: true : Enable the AI voice tuner. false : (Default) Disable the AI voice tuner.
   * @param type AI tuner effect type. See VoiceAiTunerType.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract enableVoiceAITuner(enabled: boolean, type: VoiceAiTunerType): number;

  /**
   * Sets the log file.
   *
   * Deprecated Deprecated: This method is deprecated. Set the log file path using the context parameter when calling initialize. Sets the output log file for the SDK. All logs generated during SDK runtime will be written to this file. The app must ensure the specified directory exists and is writable.
   *
   * @param filePath The full path of the log file. The log file is encoded in UTF-8.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   */
  abstract setLogFile(filePath: string): number;

  /**
   * Sets the log output level.
   *
   * Deprecated Deprecated: Use logConfig in initialize instead. This method sets the SDK log output level. Different output levels can be used individually or in combination. The log levels are, in order: LogFilterOff, LogFilterCritical, LogFilterError, LogFilterWarn, LogFilterInfo, and LogFilterDebug.
   * By selecting a level, you can see log messages for that level and all levels above it.
   * For example, if you select LogFilterWarn, you will see log messages for LogFilterCritical, LogFilterError, and LogFilterWarn.
   *
   * @param filter Log filter level. See LogFilterType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setLogFilter(filter: LogFilterType): number;

  /**
   * Sets the SDK log output level.
   *
   * Deprecated Deprecated: This method is deprecated. Set the log output level via the context parameter when calling initialize. By selecting a level, you can see log messages for that level.
   *
   * @param level Log level. See LogLevel.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setLogLevel(level: LogLevel): number;

  /**
   * Sets the size of SDK output log files.
   *
   * Deprecated Deprecated: This method is deprecated. Use the logConfig parameter in initialize to set the log file size instead. By default, the SDK generates 5 SDK log files and 5 API call log files, as follows:
   *  SDK log files are named: agorasdk.log, agorasdk.1.log, agorasdk.2.log, agorasdk.3.log, agorasdk.4.log.
   *  API call log files are named: agoraapi.log, agoraapi.1.log, agoraapi.2.log, agoraapi.3.log, agoraapi.4.log.
   *  Each SDK log file has a default size of 2,048 KB; each API call log file also has a default size of 2,048 KB. All log files are UTF-8 encoded.
   *  The latest logs are always written to agorasdk.log and agoraapi.log.
   *  When agorasdk.log is full, the SDK performs the following operations:
   *  Deletes agorasdk.4.log (if it exists).
   *  Renames agorasdk.3.log to agorasdk.4.log.
   *  Renames agorasdk.2.log to agorasdk.3.log.
   *  Renames agorasdk.1.log to agorasdk.2.log.
   *  Creates a new agorasdk.log file.
   *  The rotation rule for agoraapi.log is the same as for agorasdk.log. This method only sets the size of the agorasdk.log file and does not affect agoraapi.log.
   *
   * @param fileSizeInKBytes The size of a single agorasdk.log file in KB. Value range: [128,20480]. Default is 2,048 KB. If you set fileSizeInKBytes to less than 128 KB, the SDK automatically adjusts it to 128 KB. If you set it to more than 20,480 KB, the SDK adjusts it to 20,480 KB.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
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
   * Updates the local view display mode.
   *
   * After initializing the local user view, you can call this method to update the rendering and mirroring mode of the local user view. This method only affects the video seen by the local user and does not affect the published video. This method only takes effect for the first camera (PrimaryCameraSource). In scenarios using custom video capture or other video sources, use the setupLocalVideo method instead.
   *
   * @param renderMode Local view display mode. See RenderModeType.
   * @param mirrorMode Local view mirror mode. See VideoMirrorModeType. If you are using the front camera, the local view mirror mode is enabled by default. If you are using the rear camera, it is disabled by default.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setLocalRenderMode(
    renderMode: RenderModeType,
    mirrorMode?: VideoMirrorModeType
  ): number;

  /**
   * Updates the display mode of the remote view.
   *
   * After initializing the remote user view, you can call this method to update the rendering and mirror mode of the remote user view as displayed locally. This method only affects the video seen by the local user.
   *  Call this method after initializing the remote view using setupRemoteVideo.
   *  You can call this method multiple times during a call to update the display mode of the remote user view.
   *
   * @param uid Remote user ID.
   * @param renderMode The rendering mode of the remote user view. See RenderModeType.
   * @param mirrorMode The mirror mode of the remote user view. See VideoMirrorModeType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setRemoteRenderMode(
    uid: number,
    renderMode: RenderModeType,
    mirrorMode: VideoMirrorModeType
  ): number;

  /**
   * Sets the maximum frame rate for local video rendering.
   *
   * @param sourceType Type of video source. See VideoSourceType.
   * @param targetFps Maximum rendering frame rate (fps). Supported values: 1, 7, 10, 15, 24, 30, 60. Set this parameter to a value lower than the actual video frame rate; otherwise, the setting will not take effect.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setLocalRenderTargetFps(
    sourceType: VideoSourceType,
    targetFps: number
  ): number;

  /**
   * Sets the maximum frame rate for remote video rendering.
   *
   * @param targetFps Maximum rendering frame rate (fps). Supported values: 1, 7, 10, 15, 24, 30, 60. Set this parameter to a rendering frame rate lower than the actual video frame rate, otherwise the setting will not take effect.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setRemoteRenderTargetFps(targetFps: number): number;

  /**
   * Sets the local video mirror mode.
   *
   * Deprecated Deprecated: This method is deprecated.
   *
   * @param mirrorMode The local video mirror mode. See VideoMirrorModeType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setLocalVideoMirrorMode(mirrorMode: VideoMirrorModeType): number;

  /**
   * Enables or disables dual-stream mode on the sender and sets the low-quality video stream.
   *
   * Deprecated Deprecated: Deprecated since v4.2.0. Use setDualStreamMode instead. You can call this method on the sending side to enable or disable dual-stream mode. Dual-stream refers to high-quality and low-quality video streams:
   *  High-quality stream: High resolution and high frame rate video stream.
   *  Low-quality stream: Low resolution and low frame rate video stream. After enabling dual-stream mode, you can call setRemoteVideoStreamType on the receiving side to choose whether to receive the high-quality or low-quality video stream.
   *  This method applies to all types of streams sent by the sender, including but not limited to camera-captured video streams, screen sharing streams, and custom captured video streams.
   *  To enable dual-stream in multi-channel scenarios, call the enableDualStreamModeEx method.
   *  This method can be called before or after joining a channel.
   *
   * @param enabled Whether to enable dual-stream mode: true : Enable dual-stream mode. false : (Default) Disable dual-stream mode.
   * @param streamConfig Configuration of the low-quality video stream. See SimulcastStreamConfig. If mode is set to DisableSimulcastStream, then streamConfig will not take effect.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract enableDualStreamMode(
    enabled: boolean,
    streamConfig?: SimulcastStreamConfig
  ): number;

  /**
   * Sets the dual-stream mode on the sender and configures the low-quality video stream.
   *
   * By default, the SDK enables the adaptive low-quality stream mode (AutoSimulcastStream) on the sender. In this mode, the sender does not actively send the low-quality stream. A receiver with host privileges can call setRemoteVideoStreamType to request the low-quality stream, and the sender starts sending it automatically upon receiving the request.
   *  If you want to change this behavior, you can call this method and set mode to DisableSimulcastStream (never send low-quality stream) or EnableSimulcastStream (always send low-quality stream).
   *  To revert to the default behavior after making changes, call this method again and set mode to AutoSimulcastStream. The differences and relationship between this method and enableDualStreamMode are as follows:
   *  Calling this method with mode set to DisableSimulcastStream has the same effect as calling enableDualStreamMode with enabled set to false.
   *  Calling this method with mode set to EnableSimulcastStream has the same effect as calling enableDualStreamMode with enabled set to true.
   *  Both methods can be called before or after joining a channel. If both are used, the settings in the method called later take effect.
   *
   * @param mode The mode for sending video streams. See SimulcastStreamMode.
   * @param streamConfig The configuration for the low-quality video stream. See SimulcastStreamConfig. If mode is set to DisableSimulcastStream, streamConfig will not take effect.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   */
  abstract setDualStreamMode(
    mode: SimulcastStreamMode,
    streamConfig?: SimulcastStreamConfig
  ): number;

  /**
   * @ignore
   */
  abstract setSimulcastConfig(simulcastConfig: SimulcastConfig): number;

  /**
   * Sets whether to play external audio sources locally.
   *
   * After calling this method to enable local playback of externally captured audio sources, you can call this method again and set enabled to false to stop local playback.
   * You can call adjustCustomAudioPlayoutVolume to adjust the local playback volume of the custom audio capture track. Before calling this method, make sure you have called the createCustomAudioTrack method to create a custom audio capture track.
   *
   * @param trackId Audio track ID. Set this parameter to the custom audio track ID returned by the createCustomAudioTrack method.
   * @param enabled Whether to play the external audio source locally: true : Play locally. false : (Default) Do not play locally.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract enableCustomAudioLocalPlayback(
    trackId: number,
    enabled: boolean
  ): number;

  /**
   * Sets the format of the raw audio data for recording.
   *
   * The SDK calculates the sampling interval based on the samplesPerCall, sampleRate, and channel parameters in this method. The formula is: sampling interval = samplesPerCall / (sampleRate × channel). Make sure the sampling interval is no less than 0.01 seconds. The SDK triggers the onRecordAudioFrame callback based on this interval.
   *
   * @param sampleRate The sampling rate (Hz) of the audio data. You can set it to 8000, 16000, 32000, 44100, or 48000.
   * @param channel The number of audio channels. You can set it to 1 or 2:
   *  1: Mono.
   *  2: Stereo.
   * @param mode The usage mode of the audio frame. See RawAudioFrameOpModeType.
   * @param samplesPerCall The number of audio samples per call. Typically set to 1024 in scenarios like CDN streaming.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   */
  abstract setRecordingAudioFrameParameters(
    sampleRate: number,
    channel: number,
    mode: RawAudioFrameOpModeType,
    samplesPerCall: number
  ): number;

  /**
   * Sets the format of the raw audio data for playback.
   *
   * The SDK calculates the sampling interval based on the samplesPerCall, sampleRate, and channel parameters in this method. The formula is: sampling interval = samplesPerCall / (sampleRate × channel). Make sure the sampling interval is no less than 0.01 seconds. The SDK triggers the onPlaybackAudioFrame callback based on this interval.
   *
   * @param sampleRate The sampling rate (Hz) of the audio data. You can set it to 8000, 16000, 24000, 32000, 44100, or 48000.
   * @param channel The number of audio channels. You can set it to 1 or 2:
   *  1: Mono.
   *  2: Stereo.
   * @param mode The usage mode of the audio frame. See RawAudioFrameOpModeType.
   * @param samplesPerCall The number of audio samples per call. Typically set to 1024 in scenarios like CDN streaming.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   */
  abstract setPlaybackAudioFrameParameters(
    sampleRate: number,
    channel: number,
    mode: RawAudioFrameOpModeType,
    samplesPerCall: number
  ): number;

  /**
   * Sets the raw audio data format after audio mixing of captured and playback audio.
   *
   * The SDK calculates the sampling interval using the samplesPerCall, sampleRate, and channel parameters in this method. The formula is: sampling interval = samplesPerCall / (sampleRate × channel). Make sure the sampling interval is not less than 0.01 seconds. The SDK triggers the onMixedAudioFrame callback based on this interval.
   *
   * @param sampleRate Sampling rate (Hz) of the audio data. Can be set to 8000, 16000, 32000, 44100, or 48000.
   * @param channel Number of audio channels. Can be set to 1 or 2:
   *  1: Mono.
   *  2: Stereo.
   * @param samplesPerCall Number of audio samples, typically 1024 in scenarios like CDN streaming.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setMixedAudioFrameParameters(
    sampleRate: number,
    channel: number,
    samplesPerCall: number
  ): number;

  /**
   * Sets the audio data format for in-ear monitoring.
   *
   * This method sets the audio data format for the onEarMonitoringAudioFrame callback.
   *  Before calling this method, you need to call enableInEarMonitoring and set includeAudioFilters to EarMonitoringFilterBuiltInAudioFilters or EarMonitoringFilterNoiseSuppression.
   *  The SDK calculates the sampling interval using the samplesPerCall, sampleRate, and channel parameters in this method. The formula is: sampling interval = samplesPerCall / (sampleRate × channel). Make sure the sampling interval is not less than 0.01 seconds. The SDK triggers the onEarMonitoringAudioFrame callback based on this interval.
   *
   * @param sampleRate Sampling rate (Hz) of the audio reported in onEarMonitoringAudioFrame. Can be set to 8000, 16000, 32000, 44100, or 48000.
   * @param channel Number of audio channels reported in onEarMonitoringAudioFrame. Can be set to 1 or 2:
   *  1: Mono.
   *  2: Stereo.
   * @param mode Usage mode of the audio frame. See RawAudioFrameOpModeType.
   * @param samplesPerCall Number of audio samples reported in onEarMonitoringAudioFrame, typically 1024 in scenarios like CDN streaming.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setEarMonitoringAudioFrameParameters(
    sampleRate: number,
    channel: number,
    mode: RawAudioFrameOpModeType,
    samplesPerCall: number
  ): number;

  /**
   * Sets the raw audio playback data format before mixing.
   *
   * The SDK triggers the onPlaybackAudioFrameBeforeMixing callback based on this sampling interval.
   *
   * @param sampleRate Sampling rate (Hz) of the audio data. Can be set to 8000, 16000, 32000, 44100, or 48000.
   * @param channel Number of audio channels. Can be set to 1 or 2:
   *  1: Mono.
   *  2: Stereo.
   * @param samplesPerCall Sets the number of samples in the audio data returned in the onPlaybackAudioFrameBeforeMixing callback. In RTMP streaming scenarios, it is recommended to set this to 1024.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setPlaybackAudioFrameBeforeMixingParameters(
    sampleRate: number,
    channel: number
  ): number;

  /**
   * Enables audio spectrum monitoring.
   *
   * If you want to obtain audio spectrum data of local or remote users, register an audio spectrum observer and enable audio spectrum monitoring. This method can be called before or after joining a channel.
   *
   * @param intervalInMS The time interval (ms) at which the SDK triggers the onLocalAudioSpectrum and onRemoteAudioSpectrum callbacks. The default is 100 ms. The value must not be less than 10 ms; otherwise, the method call fails.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -2: Invalid parameter settings.
   */
  abstract enableAudioSpectrumMonitor(intervalInMS?: number): number;

  /**
   * Disables audio spectrum monitoring.
   *
   * After calling enableAudioSpectrumMonitor, if you want to disable audio spectrum monitoring, call this method. This method can be called before or after joining a channel.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract disableAudioSpectrumMonitor(): number;

  /**
   * Registers an audio spectrum observer.
   *
   * After successfully registering the audio spectrum observer and calling enableAudioSpectrumMonitor to enable audio spectrum monitoring, the SDK reports the callbacks implemented in the IAudioSpectrumObserver class at the interval you set. This method can be called before or after joining a channel.
   *
   * @param observer The audio spectrum observer. See IAudioSpectrumObserver.
   *
   * @returns
   * The IAudioSpectrumObserver object.
   */
  abstract registerAudioSpectrumObserver(
    observer: IAudioSpectrumObserver
  ): number;

  /**
   * Unregisters the audio spectrum observer.
   *
   * After calling registerAudioSpectrumObserver, if you want to unregister the audio spectrum observer, call this method. This method can be called before or after joining a channel.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract unregisterAudioSpectrumObserver(
    observer: IAudioSpectrumObserver
  ): number;

  /**
   * Adjusts the volume of the recording audio signal.
   *
   * If you only need to mute the audio signal, it is recommended to use muteRecordingSignal.
   *
   * @param volume Volume, ranging from [0,400].
   *  0: Mute.
   *  100: (Default) Original volume.
   *  400: Four times the original volume, with built-in overflow protection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract adjustRecordingSignalVolume(volume: number): number;

  /**
   * Whether to mute the recording signal.
   *
   * If you have already called adjustRecordingSignalVolume to adjust the volume of the audio capture signal, then calling this method and setting it to true causes the SDK to:
   *  Record the adjusted volume.
   *  Mute the audio capture signal. When you call this method again and set it to false, the recording signal is restored to the volume recorded by the SDK before muting.
   *
   * @param mute true : Mute. false : (Default) Original volume.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract muteRecordingSignal(mute: boolean): number;

  /**
   * Adjusts the playback volume of all remote users' signal locally.
   *
   * This method adjusts the signal volume of all remote users after mixing and playing back locally. If you want to adjust the signal volume of a specific remote user locally, we recommend calling adjustUserPlaybackSignalVolume.
   *
   * @param volume Volume, range is [0,400].
   *  0: Mute.
   *  100: (Default) Original volume.
   *  400: 4 times the original volume, with overflow protection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract adjustPlaybackSignalVolume(volume: number): number;

  /**
   * Adjusts the playback volume of a specified remote user.
   *
   * You can call this method during a call to adjust the playback volume of a specified remote user. To adjust the playback volume of multiple users, call this method multiple times.
   *
   * @param uid The ID of the remote user.
   * @param volume The volume, with a range of [0,400].
   *  0: Mute.
   *  100: (Default) Original volume.
   *  400: Four times the original volume, with overflow protection.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract adjustUserPlaybackSignalVolume(uid: number, volume: number): number;

  /**
   * @ignore
   */
  abstract setLocalPublishFallbackOption(option: StreamFallbackOptions): number;

  /**
   * Sets fallback options for subscribed audio and video streams under poor network conditions.
   *
   * Under poor network conditions, the quality of real-time audio and video may degrade. You can call this method and set option to StreamFallbackOptionVideoStreamLow or StreamFallbackOptionAudioOnly. When the downlink network is poor and audio/video quality is severely affected, the SDK will switch the video stream to a lower quality or disable it to ensure audio quality. The SDK continuously monitors network quality and resumes audio/video subscription when the network improves.
   * When the subscribed stream falls back to audio-only or recovers to audio and video, the SDK triggers the onRemoteSubscribeFallbackToAudioOnly callback.
   *
   * @param option Fallback options for the subscribed stream. See STREAM_FALLBACK_OPTIONS.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
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
   * Enables or disables an extension.
   *
   * To enable multiple extensions, call this method multiple times.
   *  Once this method is called successfully, no other extensions can be loaded.
   *
   * @param provider Name of the extension provider.
   * @param extension Name of the extension.
   * @param enable Whether to enable the extension: true : Enable the extension. false : Disable the extension.
   * @param type Media source type of the extension. See MediaSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -3: The extension dynamic library is not loaded. Agora recommends checking whether the library is in the expected location or whether the library name is correct.
   */
  abstract enableExtension(
    provider: string,
    extension: string,
    enable?: boolean,
    type?: MediaSourceType
  ): number;

  /**
   * Sets the properties of an extension.
   *
   * After enabling an extension, you can call this method to set its properties. To set properties for multiple extensions, you need to call this method multiple times.
   *
   * @param provider The name of the extension provider.
   * @param extension The name of the extension.
   * @param key The key of the extension property.
   * @param value The value corresponding to the extension property key.
   * @param type The media source type of the extension. See MediaSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setExtensionProperty(
    provider: string,
    extension: string,
    key: string,
    value: string,
    type?: MediaSourceType
  ): number;

  /**
   * Retrieves detailed information about an extension.
   *
   * @param provider Name of the extension provider.
   * @param extension Name of the extension.
   * @param key Key of the extension property.
   * @param bufLen Maximum length of the extension property JSON string. Maximum is 512 bytes.
   * @param type Media source type of the extension. See MediaSourceType.
   *
   * @returns
   * If the method call succeeds, returns the extension information.
   *  If the method call fails, returns an empty string.
   */
  abstract getExtensionProperty(
    provider: string,
    extension: string,
    key: string,
    bufLen: number,
    type?: MediaSourceType
  ): string;

  /**
   * Enables loopback recording.
   *
   * After enabling loopback recording, the sound played by the sound card will be mixed into the local audio stream and can be sent to the remote side.
   *  This method can be called before or after joining a channel.
   *  If you call disableAudio to disable the audio module, loopback recording will also be disabled. To re-enable loopback recording, you need to call enableAudio to enable the audio module and then call enableLoopbackRecording again.
   *
   * @param enabled Whether to enable loopback recording: true : Enable loopback recording; the system sound > output interface displays the virtual sound card name. false : (Default) Disable loopback recording; the system sound > output interface does not display the virtual sound card name.
   * @param deviceName Electron for UnionTech OS SDK does not support this parameter.
   *  macOS: The device name of the virtual sound card. Default is empty, which means using the AgoraALD virtual sound card for recording.
   *  Windows: The device name of the sound card. Default is empty, which means using the built-in sound card of the device.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract enableLoopbackRecording(
    enabled: boolean,
    deviceName?: string
  ): number;

  /**
   * Adjusts the volume of the loopback audio signal.
   *
   * After calling enableLoopbackRecording to enable loopback recording, you can call this method to adjust the volume of the loopback signal.
   *
   * @param volume The volume of the music file, ranging from 0 to 100. 100 (default) represents the original volume of the file.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract adjustLoopbackSignalVolume(volume: number): number;

  /**
   * @ignore
   */
  abstract getLoopbackRecordingVolume(): number;

  /**
   * Enables in-ear monitoring.
   *
   * This method is used to enable or disable in-ear monitoring. Users must use headphones (wired or Bluetooth) to hear the in-ear monitoring effect.
   *
   * @param enabled Enable/disable in-ear monitoring: true : Enable in-ear monitoring. false : (Default) Disable in-ear monitoring.
   * @param includeAudioFilters Type of in-ear monitoring audio filter. See EarMonitoringFilterType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -8: Please ensure the current audio route is Bluetooth or headphones.
   */
  abstract enableInEarMonitoring(
    enabled: boolean,
    includeAudioFilters: EarMonitoringFilterType
  ): number;

  /**
   * Sets the in-ear monitoring volume.
   *
   * @param volume Volume, range is [0,400].
   *  0: Mute.
   *  100: (Default) Original volume.
   *  400: 4 times the original volume, with overflow protection.
   */
  abstract setInEarMonitoringVolume(volume: number): number;

  /**
   * Loads an extension.
   *
   * This method adds external SDK extensions (such as Marketplace extensions and SDK extension plugins) to the SDK. To load multiple extensions, call this method multiple times.
   * This method is only supported on Windows.
   *
   * @param path Path and name of the extension dynamic library. For example: /library/libagora_segmentation_extension.dll.
   * @param unloadAfterUse Whether to automatically unload the extension after use: true : Automatically unloads the extension when IRtcEngine is destroyed. false : Does not automatically unload the extension until the process exits (recommended).
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract loadExtensionProvider(
    path: string,
    unloadAfterUse?: boolean
  ): number;

  /**
   * Sets the properties of an extension provider.
   *
   * You can call this method to set the properties of an extension provider and initialize related parameters based on the provider type. To set properties for multiple extension providers, you need to call this method multiple times.
   *
   * @param provider The name of the extension provider.
   * @param key The key of the extension property.
   * @param value The value corresponding to the extension property key.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setExtensionProviderProperty(
    provider: string,
    key: string,
    value: string
  ): number;

  /**
   * Registers an extension.
   *
   * For external extensions (such as cloud marketplace extensions and SDK expansion extensions), after loading the extension, you need to call this method to register it. Internal SDK extensions (those included in the SDK package) are automatically loaded and registered after initializing IRtcEngine, so you do not need to call this method.
   *  To register multiple extensions, you need to call this method multiple times.
   *  The order in which different extensions process data in the SDK is determined by the order of registration. That is, extensions registered earlier process data first.
   *
   * @param provider The name of the extension provider.
   * @param extension The name of the extension.
   * @param type The media source type of the extension. See MediaSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -3: The extension dynamic library was not loaded. Agora recommends checking whether the dynamic library is placed in the expected location or whether the library name is correct.
   */
  abstract registerExtension(
    provider: string,
    extension: string,
    type?: MediaSourceType
  ): number;

  /**
   * Sets the camera capture configuration.
   *
   * @param config Camera capture configuration. See CameraCapturerConfiguration.
   *
   * @returns
   * < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setCameraCapturerConfiguration(
    config: CameraCapturerConfiguration
  ): number;

  /**
   * Creates a custom video track.
   *
   * When you need to publish a custom captured video in the channel, follow these steps:
   *  Call this method to create a video track and get the video track ID.
   *  When calling joinChannel to join the channel, set customVideoTrackId in ChannelMediaOptions to the video track ID you want to publish, and set publishCustomVideoTrack to true.
   *  Call pushVideoFrame and specify videoTrackId as the video track ID from step 2 to publish the corresponding custom video source in the channel.
   *
   * @returns
   * If the method call succeeds, returns the video track ID as the unique identifier for the video track.
   *  If the method call fails, returns 0xffffffff. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract createCustomVideoTrack(): number;

  /**
   * @ignore
   */
  abstract createCustomEncodedVideoTrack(senderOption: SenderOptions): number;

  /**
   * Destroys the specified video track.
   *
   * @param videoTrackId The video track ID returned by the createCustomVideoTrack method.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
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
   * Checks whether the camera supports Center Stage.
   *
   * Before calling enableCameraCenterStage to enable the Center Stage feature, it is recommended to call this method to check whether the current device supports it. This method is only supported on macOS.
   *
   * @returns
   * true : The current camera supports Center Stage. false : The current camera does not support Center Stage.
   */
  abstract isCameraCenterStageSupported(): boolean;

  /**
   * Enables or disables the Center Stage feature.
   *
   * The Center Stage feature is disabled by default. You need to call this method to enable it. To disable this feature, call this method again and set enabled to false. This method is only supported on macOS.
   * Due to high performance requirements, you need to use this feature on the following or higher-performance devices:
   *  iPad:
   *  12.9-inch iPad Pro (5th generation)
   *  11-inch iPad Pro (3rd generation)
   *  iPad (9th generation)
   *  iPad mini (6th generation)
   *  iPad Air (5th generation)
   *  2020 M1 MacBook Pro 13" + iPhone 11 (using iPhone as an external camera for MacBook) Agora recommends calling isCameraCenterStageSupported before enabling this feature to check whether the current device supports Center Stage.
   *
   * @param enabled Whether to enable the Center Stage feature: true : Enable Center Stage. false : Disable Center Stage.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract enableCameraCenterStage(enabled: boolean): number;

  /**
   * Gets a list of shareable screen and window objects.
   *
   * Before screen or window sharing, you can call this method to get a list of shareable screen and window objects, allowing users to select a screen or window to share via thumbnails. The list contains important information such as window ID and screen ID. After obtaining the ID, you can call startScreenCaptureByWindowId or startScreenCaptureByDisplayId to start sharing.
   *
   * @param thumbSize The target size (width and height in pixels) of the screen or window thumbnail. The SDK scales the original image to match the longest side of the target size without distortion. For example, if the original size is 400 × 300 and thumbSize is 100 × 100, the thumbnail size will be 100 × 75. If the target size is larger than the original, the original image is used without scaling.
   * @param iconSize The target size (width and height in pixels) of the program icon. The SDK scales the original icon to match the longest side of the target size without distortion. For example, if the original size is 400 × 300 and iconSize is 100 × 100, the icon size will be 100 × 75. If the target size is larger than the original, the original icon is used without scaling.
   * @param includeScreen Whether the SDK returns screen information in addition to window information: true : SDK returns both screen and window information. false : SDK returns only window information.
   *
   * @returns
   * ScreenCaptureSourceInfo array.
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
   * Starts capturing video stream from the specified screen.
   *
   * Captures the video stream of a screen or a specific region of the screen.
   *
   * @param displayId Specifies the screen ID to be shared. On Windows, if you want to share two screens (main + secondary) simultaneously, set displayId to -1 when calling this method.
   * @param regionRect (Optional) Specifies the region to be shared relative to the entire screen. To share the entire screen, set this to nil.
   * @param captureParams Configuration parameters for screen sharing. The default video encoding resolution is 1920 × 1080 (2,073,600 pixels), which is used for billing. See ScreenCaptureParameters. The video properties of the screen sharing stream should only be set via this parameter and are unrelated to setVideoEncoderConfiguration.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -2: Invalid parameter.
   *  -8: Invalid screen sharing state. This may occur if you are already sharing another screen or window. Try calling stopScreenCapture to stop the current sharing, then restart screen sharing.
   */
  abstract startScreenCaptureByDisplayId(
    displayId: number,
    regionRect: Rectangle,
    captureParams: ScreenCaptureParameters
  ): number;

  /**
   * Starts capturing the video stream of a specified screen region.
   *
   * Deprecated Deprecated: This method is deprecated. Use startScreenCaptureByDisplayId instead. If you need to share the screen when an external display is connected, it is strongly recommended to use startScreenCaptureByDisplayId. Shares a screen or a portion of the screen. You need to specify the screen region to be shared in this method.
   * This method can be called either before or after joining a channel. The differences are as follows:
   *  If you call this method before joining a channel, then call joinChannel to join the channel and set publishScreenTrack or publishSecondaryScreenTrack to true, screen sharing starts.
   *  If you call this method after joining a channel, then call updateChannelMediaOptions to update the channel media options and set publishScreenTrack or publishSecondaryScreenTrack to true, screen sharing starts. This method is only applicable to Windows platform.
   *
   * @param screenRect Specifies the position of the screen to be shared relative to the virtual screen.
   * @param regionRect Specifies the position of the region to be shared relative to the entire screen. If not specified, the entire screen is shared. See Rectangle. If the shared region exceeds the screen boundaries, only the content within the screen is shared; if width or height is set to 0, the entire screen is shared.
   * @param captureParams Encoding configuration parameters for screen sharing. The default resolution is 1920 x 1080, i.e., 2,073,600 pixels. This pixel count is used for billing purposes. See ScreenCaptureParameters.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -2: Invalid parameter.
   *  -8: Invalid screen sharing state. This may occur if you are already sharing another screen or window. Try calling stopScreenCapture to stop the current sharing, then restart screen sharing.
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
   * Starts capturing the video stream of a specified window.
   *
   * Shares a window or a portion of the window. You need to specify the window ID you want to share in this method.
   * This method supports sharing Universal Windows Platform (UWP) application windows. Agora has tested mainstream UWP applications using the latest SDK. The results are as follows: OS Version Application Compatible Version Supported Windows 10 Chrome 76.0.3809.100 No Office Word 18.1903.1152.0 Yes Office Excel 18.1903.1152.0 No Office PPT 18.1903.1152.0 Yes WPS Word 11.1.0.9145 Yes WPS Excel 11.1.0.9145 Yes WPS PPT 11.1.0.9145 Yes Built-in Media Player All versions Yes Windows 8 Chrome All versions Yes Office Word All versions Yes Office Excel All versions Yes Office PPT All versions Yes WPS Word 11.1.0.9098 Yes WPS Excel 11.1.0.9098 Yes WPS PPT 11.1.0.9098 Yes Built-in Media Player All versions Yes Windows 7 Chrome 73.0.3683.103 No Office Word All versions Yes Office Excel All versions Yes Office PPT All versions Yes WPS Word 11.1.0.9098 No WPS Excel 11.1.0.9098 No WPS PPT 11.1.0.9098 Yes Built-in Media Player All versions No This method is only applicable to macOS and Windows platforms.
   * The SDK's window sharing feature relies on WGC (Windows Graphics Capture) or GDI (Graphics Device Interface). WGC cannot disable mouse capture on systems earlier than Windows 10 version 2004. Therefore, when sharing a window on such systems, captureMouseCursor(false) may not take effect. See ScreenCaptureParameters.
   *
   * @param windowId Specifies the ID of the window to be shared.
   * @param regionRect (Optional) Specifies the position of the region to be shared relative to the entire screen. If not specified, the entire screen is shared. See Rectangle. If the shared region exceeds the window boundaries, only the content within the window is shared; if width or height is 0, the entire window is shared. Electron for UnionTech OS SDK currently does not support this parameter.
   * @param captureParams Configuration parameters for screen sharing. The default resolution is 1920 x 1080, i.e., 2,073,600 pixels. This pixel count is used for billing purposes. See ScreenCaptureParameters.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -2: Invalid parameter.
   *  -8: Invalid screen sharing state. This may occur if you are already sharing another screen or window. Try calling stopScreenCapture to stop the current sharing, then restart screen sharing.
   */
  abstract startScreenCaptureByWindowId(
    windowId: number,
    regionRect: Rectangle,
    captureParams: ScreenCaptureParameters
  ): number;

  /**
   * Sets the content type for screen sharing.
   *
   * The SDK uses different algorithms to optimize the sharing effect based on the content type. If you do not call this method, the SDK defaults the content type of screen sharing to ContentHintNone, meaning no specific content type. This method can be called before or after starting screen sharing.
   *
   * @param contentHint The content type of screen sharing. See VideoContentHint.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -2: Invalid parameter.
   *  -8: Invalid screen sharing state. This may occur if you are already sharing another screen or window. Try calling stopScreenCapture to stop the current sharing, then restart screen sharing.
   */
  abstract setScreenCaptureContentHint(contentHint: VideoContentHint): number;

  /**
   * Updates the screen capture region.
   *
   * Call this method after starting screen or window sharing.
   *
   * @param regionRect The position of the region to be shared relative to the entire screen or window. If not specified, the entire screen or window is shared. See Rectangle. If the shared region exceeds the screen or window boundaries, only the content within the screen or window is shared; if width or height is set to 0, the entire screen or window is shared.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -2: Invalid parameter.
   *  -8: Invalid screen sharing state. This may occur if you are already sharing another screen or window. Try calling stopScreenCapture to stop the current sharing, then restart screen sharing.
   */
  abstract updateScreenCaptureRegion(regionRect: Rectangle): number;

  /**
   * Updates the screen capture configuration parameters.
   *
   * Call this method after starting screen or window sharing.
   *
   * @param captureParams Encoding configuration parameters for screen sharing. See ScreenCaptureParameters. The video properties of the screen sharing stream should be set only through this parameter and are unrelated to setVideoEncoderConfiguration.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -2: Invalid parameter.
   *  -8: Invalid screen sharing state. This may occur if you are already sharing another screen or window. Try calling stopScreenCapture to stop the current sharing, then restart screen sharing.
   */
  abstract updateScreenCaptureParameters(
    captureParams: ScreenCaptureParameters
  ): number;

  /**
   * @ignore
   */
  abstract startScreenCapture(captureParams: ScreenCaptureParameters2): number;

  /**
   * @ignore
   */
  abstract updateScreenCapture(captureParams: ScreenCaptureParameters2): number;

  /**
   * @ignore
   */
  abstract queryScreenCaptureCapability(): number;

  /**
   * @ignore
   */
  abstract queryCameraFocalLengthCapability(): {
    focalLengthInfos: FocalLengthInfo[];
    size: number;
  };

  /**
   * @ignore
   */
  abstract setExternalMediaProjection(mediaProjection: any): number;

  /**
   * Sets the screen sharing scenario.
   *
   * When you start screen sharing or window sharing, you can call this method to set the screen sharing scenario. The SDK adjusts the quality of the shared screen according to the scenario you set. Agora recommends calling this method before joining a channel.
   *
   * @param screenScenario The screen sharing scenario. See ScreenScenarioType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setScreenCaptureScenario(screenScenario: ScreenScenarioType): number;

  /**
   * Stops screen capture.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract stopScreenCapture(): number;

  /**
   * Gets the call ID.
   *
   * Each time the client joins a channel, a corresponding callId is generated to identify the call session. You can call this method to get the callId and then pass it to methods such as rate and complain.
   *
   * @returns
   * Returns the current call ID if the method call succeeds.
   *  Returns an empty string if the method call fails.
   */
  abstract getCallId(): string;

  /**
   * Rates a call.
   *
   * This method must be called after the user leaves the channel.
   *
   * @param callId The call ID. You can get this parameter by calling getCallId.
   * @param rating The rating for the call, from 1 to 5.
   * @param description The description of the call. The length should be less than 800 bytes.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -1: General error (not specifically categorized).
   *  -2: Invalid parameter.
   */
  abstract rate(callId: string, rating: number, description: string): number;

  /**
   * Reports call quality issues.
   *
   * This method allows users to report call quality issues. You need to call it after leaving the channel.
   *
   * @param callId Call ID. You can get this parameter by calling getCallId.
   * @param description Description of the call. The length should be less than 800 bytes.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -1: General error (not categorized).
   *  -2: Invalid parameter.
   *  -7: Method called before IRtcEngine is initialized.
   */
  abstract complain(callId: string, description: string): number;

  /**
   * Starts pushing media streams without transcoding.
   *
   * Agora recommends using the more advanced server-side streaming feature. See [Implement Server-side Streaming](https://doc.shengwang.cn/doc/media-push/restful/landing-page).
   * Call this method to push live audio and video streams to a specified streaming URL. This method supports pushing to only one URL at a time. To push to multiple URLs, call this method multiple times.
   * After calling this method, the SDK triggers the onRtmpStreamingStateChanged callback locally to report the streaming status.
   *  Call this method after joining a channel.
   *  Only broadcasters in a live streaming scenario can call this method.
   *  If the streaming fails and you want to retry, you must call stopRtmpStream before calling this method again. Otherwise, the SDK will return the same error code as the previous failure.
   *
   * @param url The streaming URL. Must be in RTMP or RTMPS format. The maximum length is 1024 bytes. Special characters such as Chinese characters are not supported.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   *  -2: The URL or transcoding parameter is incorrect. Check your URL or parameter settings.
   *  -7: The SDK is not initialized before calling this method.
   *  -19: The streaming URL is already in use. Use a different streaming URL.
   */
  abstract startRtmpStreamWithoutTranscoding(url: string): number;

  /**
   * Starts pushing streams to a CDN and sets the transcoding configuration.
   *
   * Agora recommends using the more comprehensive server-side streaming feature. See [Implement server-side CDN streaming](https://doc.shengwang.cn/doc/media-push/restful/landing-page).
   * Call this method to push live audio and video streams to the specified CDN streaming URL and set the transcoding configuration. This method can only push media streams to one URL at a time. To push to multiple URLs, call this method multiple times.
   * Each stream push represents a streaming task. The default maximum number of concurrent tasks is 200, meaning you can run up to 200 streaming tasks simultaneously under one Agora project. To increase the quota, [contact technical support](https://ticket.shengwang.cn/).
   * After calling this method, the SDK triggers the onRtmpStreamingStateChanged callback locally to report the streaming status.
   *  Call this method after joining a channel.
   *  Only hosts in a live streaming scenario can call this method.
   *  If the stream push fails and you want to retry, you must call stopRtmpStream before calling this method again. Otherwise, the SDK returns the same error code as the previous failure.
   *
   * @param url The CDN streaming URL. Must be in RTMP or RTMPS format. The character length must not exceed 1024 bytes. Special characters such as Chinese characters are not supported.
   * @param transcoding The transcoding configuration for the CDN stream. See LiveTranscoding.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -2: The URL or transcoding parameter is invalid. Check your URL or parameter settings.
   *  -7: The SDK is not initialized before calling this method.
   *  -19: The CDN streaming URL is already in use. Use a different URL.
   */
  abstract startRtmpStreamWithTranscoding(
    url: string,
    transcoding: LiveTranscoding
  ): number;

  /**
   * Updates the CDN transcoding configuration.
   *
   * Agora recommends using the more comprehensive server-side streaming feature. See [Implement server-side CDN streaming](https://doc.shengwang.cn/doc/media-push/restful/landing-page).
   * After enabling transcoding streaming, you can dynamically update the transcoding configuration based on your scenario. After the configuration is updated, the SDK triggers the onTranscodingUpdated callback.
   *
   * @param transcoding The transcoding configuration for the CDN stream. See LiveTranscoding.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract updateRtmpTranscoding(transcoding: LiveTranscoding): number;

  /**
   * Starts local video mixing.
   *
   * After calling this method, you can merge multiple video streams into a single stream locally. For example, merge camera-captured video, screen sharing, media player video, remote video, video files, images, etc., into a single stream, and then publish the mixed stream to the channel.
   *  Local video mixing consumes significant CPU resources. Agora recommends using this feature on high-performance devices.
   *  If you need to mix locally captured video streams, the SDK supports the following combinations:
   *  On Windows: up to 4 camera video streams + 4 screen sharing streams.
   *  On macOS: up to 4 camera video streams + 1 screen sharing stream.
   *  When configuring mixing, ensure that the camera video stream capturing the portrait has a higher layer index than the screen sharing stream, otherwise the portrait may be covered and not displayed in the final mixed stream.
   *
   * @param config Configuration for local video mixing. See LocalTranscoderConfiguration.
   *  The maximum resolution for each video stream in the local mixing is 4096 × 2160. Exceeding this limit will cause the mixing to fail.
   *  The maximum resolution for the mixed video stream is 4096 × 2160.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   */
  abstract startLocalVideoTranscoder(
    config: LocalTranscoderConfiguration
  ): number;

  /**
   * Updates the local video mixing configuration.
   *
   * After calling startLocalVideoTranscoder, if you want to update the local video mixing configuration, call this method. If you want to update the type of local video source used for mixing, such as adding a second camera or screen capture, you need to call this method after startCameraCapture or startScreenCaptureBySourceType.
   *
   * @param config Configuration for local video mixing. See LocalTranscoderConfiguration.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract updateLocalTranscoderConfiguration(
    config: LocalTranscoderConfiguration
  ): number;

  /**
   * Stops pushing streams to a CDN.
   *
   * Agora recommends using the more comprehensive server-side streaming feature. See [Implement server-side CDN streaming](https://doc.shengwang.cn/doc/media-push/restful/landing-page).
   * Call this method to stop the live stream on the specified CDN streaming URL. This method can only stop one URL at a time. To stop multiple URLs, call this method multiple times.
   * After calling this method, the SDK triggers the onRtmpStreamingStateChanged callback locally to report the streaming status.
   *
   * @param url The CDN streaming URL. Must be in RTMP or RTMPS format. The character length must not exceed 1024 bytes. Special characters such as Chinese characters are not supported.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract stopRtmpStream(url: string): number;

  /**
   * Stops local video mixing.
   *
   * After calling startLocalVideoTranscoder, if you want to stop local video mixing, call this method.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract stopLocalVideoTranscoder(): number;

  /**
   * Starts local audio mixing.
   *
   * This method allows you to merge multiple audio streams locally into a single stream. For example, you can merge audio from the local microphone, media player, sound card, and remote users into one stream, and then publish it to the channel.
   *  To mix local audio streams, set publishMixedAudioTrack in ChannelMediaOptions to true to publish the mixed stream to the channel.
   *  To mix remote audio streams, ensure the remote streams are published and subscribed to in the channel. To ensure audio quality, it is recommended not to exceed 10 audio streams in local mixing.
   *
   * @param config Configuration for local audio mixing. See LocalAudioMixerConfiguration.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -7: The IRtcEngine object is not initialized. You must successfully initialize the IRtcEngine object before calling this method.
   */
  abstract startLocalAudioMixer(config: LocalAudioMixerConfiguration): number;

  /**
   * Updates the configuration of local audio mixing.
   *
   * After calling startLocalAudioMixer, if you want to update the configuration of local audio mixing, call this method. To ensure audio quality, it is recommended that the number of audio streams participating in local mixing does not exceed 10.
   *
   * @param config Configuration for local audio mixing. See LocalAudioMixerConfiguration.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -7: The IRtcEngine object has not been initialized. You need to successfully initialize the IRtcEngine object before calling this method.
   */
  abstract updateLocalAudioMixerConfiguration(
    config: LocalAudioMixerConfiguration
  ): number;

  /**
   * Stops local audio mixing.
   *
   * After calling startLocalAudioMixer, if you want to stop local audio mixing, call this method.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -7: The IRtcEngine object has not been initialized. You need to successfully initialize the IRtcEngine object before calling this method.
   */
  abstract stopLocalAudioMixer(): number;

  /**
   * Starts video capture using the camera.
   *
   * Call this method to start multiple camera captures simultaneously by specifying sourceType.
   *
   * @param sourceType The type of video source. See VideoSourceType.
   *  On desktop platforms, up to 4 video streams from camera capture are supported.
   * @param config Video capture configuration. See CameraCapturerConfiguration.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract startCameraCapture(
    sourceType: VideoSourceType,
    config: CameraCapturerConfiguration
  ): number;

  /**
   * Stops video capture using the camera.
   *
   * After calling startCameraCapture to start one or more video streams from camera capture, you can call this method to stop one or more video streams by setting sourceType. If you are using the local compositing feature, calling this method to stop video capture from the first camera will interrupt the local compositing.
   *
   * @param sourceType The type of video source. See VideoSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract stopCameraCapture(sourceType: VideoSourceType): number;

  /**
   * Sets the rotation angle of the captured video.
   *
   * This method is for Windows only.
   *  This method must be called after enableVideo. The setting takes effect after the camera is successfully turned on, that is, after the SDK triggers the onLocalVideoStateChanged callback and returns the local video state as LocalVideoStreamStateCapturing (1).
   *  When the video capture device does not have a gravity sensor, you can call this method to manually adjust the rotation angle of the captured video.
   *
   * @param type Video source type. See VideoSourceType.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
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
   * Gets the current network connection state.
   *
   * @returns
   * The current network connection state. See ConnectionStateType.
   */
  abstract getConnectionState(): ConnectionStateType;

  /**
   * Adds a primary callback event.
   *
   * The interface class IRtcEngineEventHandler is used by the SDK to send callback event notifications to the app. The app receives SDK event notifications by inheriting methods of this interface class.
   * All methods in the interface class have default (empty) implementations. The app can inherit only the events it cares about as needed. In the callback methods, the app should not perform time-consuming operations or call APIs that may block (such as sendStreamMessage),
   * as this may affect the SDK's operation.
   *
   * @param eventHandler The callback event to be added. See IRtcEngineEventHandler.
   *
   * @returns
   * true : Method call succeeds. false : Method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract registerEventHandler(eventHandler: IRtcEngineEventHandler): boolean;

  /**
   * Removes the specified callback event.
   *
   * This method removes all previously added callback events.
   *
   * @param eventHandler The callback event to be removed. See IRtcEngineEventHandler.
   *
   * @returns
   * true : Method call succeeds. false : Method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
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
   * Enables or disables built-in encryption.
   *
   * The SDK automatically disables encryption after the user leaves the channel. To re-enable encryption, you must call this method before the user joins the channel again.
   *  All users in the same channel must use the same encryption mode and key when calling this method.
   *  If built-in encryption is enabled, the RTMP streaming feature cannot be used.
   *
   * @param enabled Whether to enable built-in encryption: true : Enable built-in encryption. false : (Default) Disable built-in encryption.
   * @param config Configure the built-in encryption mode and key. See EncryptionConfig.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure
   *  -2: Invalid parameters. You need to reset the parameters.
   *  -4: Incorrect encryption mode or failed to load external encryption library. Check the enum value or reload the external encryption library.
   *  -7: SDK not initialized. You must create the IRtcEngine object and complete initialization before calling the API.
   */
  abstract enableEncryption(enabled: boolean, config: EncryptionConfig): number;

  /**
   * Creates a data stream.
   *
   * Within the lifecycle of IRtcEngine, each user can create up to 5 data streams. The data streams are destroyed when leaving the channel. To use them again, you need to recreate them.
   *
   * @param config Data stream configuration. See DataStreamConfig.
   *
   * @returns
   * ID of the created data stream: if the method call succeeds.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract createDataStream(config: DataStreamConfig): number;

  /**
   * Sends a data stream.
   *
   * After calling createDataStream, you can use this method to send data stream messages to all users in the channel.
   * The SDK imposes the following restrictions on this method:
   *  Each client in the channel can have up to 5 data channels simultaneously, and the total sending bitrate shared by all data channels is limited to 30 KB/s.
   *  Each data channel can send up to 60 packets per second, with each packet up to 1 KB in size. If the method call succeeds, the remote end triggers the onStreamMessage callback, where the remote user can receive the message; if it fails, the remote end triggers the onStreamMessageError callback.
   *  This method must be called after joining a channel and after calling createDataStream to create a data channel.
   *  This method applies to broadcaster users only.
   *
   * @param streamId Data stream ID. You can get it via createDataStream.
   * @param data The data to be sent.
   * @param length Length of the data.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract sendStreamMessage(
    streamId: number,
    data: Uint8Array,
    length: number
  ): number;

  /**
   * Adds a local video watermark.
   *
   * Deprecated Deprecated: This method is deprecated. Use addVideoWatermarkWithConfig instead. This method adds a PNG image as a watermark to the local published live video stream. Users in the same live channel, audience of CDN live streaming, and capture devices can see or capture the watermark image. Currently, only one watermark can be added to the live video stream. A newly added watermark replaces the previous one.
   * The watermark coordinates depend on the settings in the setVideoEncoderConfiguration method:
   *  If the video orientation (OrientationMode) is fixed to landscape or landscape in adaptive mode, landscape coordinates are used.
   *  If the video orientation is fixed to portrait or portrait in adaptive mode, portrait coordinates are used.
   *  When setting watermark coordinates, the image area of the watermark must not exceed the video dimensions set in setVideoEncoderConfiguration; otherwise, the excess part will be cropped.
   *  You must call this method after calling enableVideo.
   *  If you only want to add a watermark during CDN streaming, you can use this method or startRtmpStreamWithTranscoding to set the watermark.
   *  The watermark image must be in PNG format. This method supports all pixel formats of PNG images: RGBA, RGB, Palette, Gray, and Alpha_gray.
   *  If the size of the PNG image to be added does not match the size set in this method, the SDK will scale or crop the PNG image to match the settings.
   *  If local video is set to mirror mode, the local watermark will also be mirrored. To avoid mirrored watermark when local users view their own video, it is recommended not to use mirroring and watermark features together. Implement the local watermark feature at the application level.
   *
   * @param watermarkUrl The local path of the watermark image to be added. This method supports adding watermark images from local absolute/relative paths.
   * @param options The configuration options for the watermark image to be added. See WatermarkOptions.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract addVideoWatermark(
    watermarkUrl: string,
    options: WatermarkOptions
  ): number;

  /**
   * Removes added video watermarks.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
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
   * Enables interoperability with the Web SDK (applicable only in live broadcast scenarios).
   *
   * Deprecated Deprecated: This method is obsolete. The SDK automatically enables interoperability with the Web SDK. You do not need to call this method. This method enables or disables interoperability with the Web SDK. If there are users joining the channel via the Web SDK, make sure to call this method; otherwise, Web users will see a black screen when viewing the Native stream.
   * This method is only applicable in live broadcast scenarios. In communication scenarios, interoperability is enabled by default.
   *
   * @param enabled Whether to enable interoperability with the Web SDK: true : Enable interoperability. false : (Default) Disable interoperability.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract enableWebSdkInteroperability(enabled: boolean): number;

  /**
   * Sends a custom report message.
   *
   * Agora provides custom data reporting and analysis services. This service is currently in a free beta phase. During the beta, you can report up to 10 data entries within 6 seconds. Each custom data entry must not exceed 256 bytes, and each string must not exceed 100 bytes. To try this service, [contact sales](https://www.shengwang.cn/contact-sales/) to enable it and agree on the custom data format.
   */
  abstract sendCustomReportMessage(
    id: string,
    category: string,
    event: string,
    label: string,
    value: number
  ): number;

  /**
   * Registers a media metadata observer to receive or send metadata.
   *
   * You need to implement the IMetadataObserver class and specify the metadata type in this method. This method allows you to add synchronized metadata to the video stream for diverse live interactive scenarios, such as sending shopping links, e-coupons, and online quizzes. Call this method before joinChannel.
   *
   * @param observer The metadata observer. See IMetadataObserver.
   * @param type The metadata type. Currently, only VideoMetadata is supported. See MetadataType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract registerMediaMetadataObserver(
    observer: IMetadataObserver,
    type: MetadataType
  ): number;

  /**
   * Unregisters the media metadata observer.
   *
   * @param observer The metadata observer. See IMetadataObserver.
   * @param type The metadata type. Currently, only VideoMetadata is supported. See MetadataType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
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
    uid: number,
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
    uid: number,
    location: string
  ): number;

  /**
   * Enables or disables AI noise reduction and sets the noise reduction mode.
   *
   * You can call this method to enable AI noise reduction. This feature intelligently detects and reduces various steady and non-steady background noises while preserving voice quality, making speech clearer.
   * Steady noise refers to noise with the same frequency at any point in time. Common examples include:
   *  TV noise
   *  Air conditioner noise
   *  Factory machinery noise Non-steady noise refers to noise that changes rapidly over time. Common examples include:
   *  Thunder
   *  Explosions
   *  Cracking sounds
   *
   * @param enabled Whether to enable AI noise reduction: true : Enable AI noise reduction. false : (Default) Disable AI noise reduction.
   * @param mode Noise reduction mode. See AudioAinsMode.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setAINSMode(enabled: boolean, mode: AudioAinsMode): number;

  /**
   * Registers the local user's User Account.
   *
   * This method registers a User Account for the local user. After successful registration, the User Account can be used to identify the local user, and the user can use it to join a channel.
   * This method is optional. If you want users to join a channel using a User Account, you can implement it in either of the following ways:
   *  Call registerLocalUserAccount to register the account first, then call joinChannelWithUserAccount to join the channel, which can reduce the time to enter the channel.
   *  Directly call joinChannelWithUserAccount to join the channel.
   *  Ensure that the userAccount set in this method is unique within the channel.
   *  To ensure communication quality, make sure to use the same type of identifier (UID or User Account) for all users in the channel. If users join the channel via Web SDK, ensure they use the same identifier type.
   *
   * @param appId Your project's App ID registered in the console.
   * @param userAccount User User Account. This parameter identifies the user in the real-time audio and video interaction channel. You must set and manage the user's User Account yourself and ensure that each User Account is unique within the same channel. This parameter is required, must not exceed 255 bytes, and cannot be null. The following character set is supported (a total of 89 characters):
   *  26 lowercase English letters a-z
   *  26 uppercase English letters A-Z
   *  10 digits 0-9
   *  space
   *  "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
   *
   * @returns
   * 0: Method call succeeds.
   *  < 0: Method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract registerLocalUserAccount(appId: string, userAccount: string): number;

  /**
   * Joins a channel using a User Account and Token, and sets channel media options.
   *
   * If you do not call registerLocalUserAccount to register a User Account before calling this method, the SDK automatically creates a User Account for you when joining the channel. Calling registerLocalUserAccount to register the account before calling this method can shorten the time to join the channel.
   * After a user successfully joins a channel, the SDK subscribes to all audio and video streams from other users in the channel by default, which incurs usage and affects billing. If you want to unsubscribe, you can call the corresponding mute methods. To ensure communication quality, make sure to use the same type of user identity within the same channel. That is, either UID or User Account must be used consistently. If users join the channel via the Web SDK, ensure they use the same identity type.
   *  This method only supports joining one channel at a time.
   *  Apps with different App IDs cannot communicate with each other.
   *  Before joining a channel, ensure that the App ID used to generate the Token is the same as the one used to initialize the engine via the initialize method. Otherwise, joining the channel with the Token will fail.
   *
   * @param token A dynamic key generated on your server for authentication. See [Token Authentication](https://doc.shengwang.cn/doc/rtc/electron/basic-features/token-authentication).
   *  (Recommended) If your project enables security mode (i.e., uses APP ID + Token for authentication), this parameter is required.
   *  If your project only enables debug mode (i.e., uses APP ID only for authentication), you can join the channel without providing a Token. The user will automatically leave the channel after 24 hours.
   *  If you need to join multiple channels simultaneously or switch channels frequently, Agora recommends using a wildcard Token to avoid requesting a new Token from the server for each new channel. See [Using Wildcard Token](https://doc.shengwang.cn/doc/rtc/electron/best-practice/wildcard-token).
   * @param userAccount The user’s User Account. This parameter identifies the user in the real-time audio and video channel. You need to set and manage the User Account yourself, and ensure that each user in the same channel has a unique User Account. This parameter is required, must not exceed 255 bytes, and cannot be null. Supported character set (89 characters total):
   *  26 lowercase English letters a-z
   *  26 uppercase English letters A-Z
   *  10 digits 0-9
   *  Space
   *  "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
   * @param options Channel media settings. See ChannelMediaOptions.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -2: Invalid parameter. For example, an invalid Token, non-integer uid, or invalid ChannelMediaOptions member value. Provide valid parameters and rejoin the channel.
   *  -3: IRtcEngine object initialization failed. Re-initialize the IRtcEngine object.
   *  -7: IRtcEngine object not initialized. You need to initialize the IRtcEngine object before calling this method.
   *  -8: Internal state error of IRtcEngine object. Possible reason: startEchoTest was called to start the echo test but stopEchoTest was not called before joining the channel. Call stopEchoTest before this method.
   *  -17: Join channel request rejected. Possible reason: the user is already in the channel. Use the onConnectionStateChanged callback to check if the user is in the channel. Do not call this method again unless the state is ConnectionStateDisconnected (1).
   *  -102: Invalid channel name. Provide a valid channel name in channelId and rejoin the channel.
   *  -121: Invalid user ID. Provide a valid user ID in uid and rejoin the channel.
   */
  abstract joinChannelWithUserAccount(
    token: string,
    channelId: string,
    userAccount: string,
    options?: ChannelMediaOptions
  ): number;

  /**
   * Joins a channel using a User Account and Token, and sets channel media options.
   *
   * If you do not call registerLocalUserAccount to register a User Account before calling this method, the SDK automatically creates a User Account for you when joining the channel. Calling registerLocalUserAccount to register the account before calling this method can shorten the time to join the channel.
   * After a user successfully joins a channel, the SDK subscribes to all audio and video streams from other users in the channel by default, which incurs usage and affects billing. If you want to unsubscribe, you can set the options parameter or call the corresponding mute methods. To ensure communication quality, make sure to use the same type of user identity within the same channel. That is, either UID or User Account must be used consistently. If users join the channel via the Web SDK, ensure they use the same identity type.
   *  This method only supports joining one channel at a time.
   *  Apps with different App IDs cannot communicate with each other.
   *  Before joining a channel, ensure that the App ID used to generate the Token is the same as the one used to initialize the engine via the initialize method. Otherwise, joining the channel with the Token will fail.
   *
   * @param token A dynamic key generated on your server for authentication. See [Token Authentication](https://doc.shengwang.cn/doc/rtc/electron/basic-features/token-authentication).
   *  (Recommended) If your project enables security mode (i.e., uses APP ID + Token for authentication), this parameter is required.
   *  If your project only enables debug mode (i.e., uses APP ID only for authentication), you can join the channel without providing a Token. The user will automatically leave the channel after 24 hours.
   *  If you need to join multiple channels simultaneously or switch channels frequently, Agora recommends using a wildcard Token to avoid requesting a new Token from the server for each new channel. See [Using Wildcard Token](https://doc.shengwang.cn/doc/rtc/electron/best-practice/wildcard-token).
   * @param userAccount The user’s User Account. This parameter identifies the user in the real-time audio and video channel. You need to set and manage the User Account yourself, and ensure that each user in the same channel has a unique User Account. This parameter is required, must not exceed 255 bytes, and cannot be null. Supported character set (89 characters total):
   *  26 lowercase English letters a-z
   *  26 uppercase English letters A-Z
   *  10 digits 0-9
   *  Space
   *  "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
   * @param options Channel media settings. See ChannelMediaOptions.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -2: Invalid parameter. For example, an invalid Token, non-integer uid, or invalid ChannelMediaOptions member value. Provide valid parameters and rejoin the channel.
   *  -3: IRtcEngine object initialization failed. Re-initialize the IRtcEngine object.
   *  -7: IRtcEngine object not initialized. You need to initialize the IRtcEngine object before calling this method.
   *  -8: Internal state error of IRtcEngine object. Possible reason: startEchoTest was called to start the echo test but stopEchoTest was not called before joining the channel. Call stopEchoTest before this method.
   *  -17: Join channel request rejected. Possible reason: the user is already in the channel. Use the onConnectionStateChanged callback to check if the user is in the channel. Do not call this method again unless the state is ConnectionStateDisconnected (1).
   *  -102: Invalid channel name. Provide a valid channel name in channelId and rejoin the channel.
   *  -121: Invalid user ID. Provide a valid user ID in uid and rejoin the channel.
   */
  abstract joinChannelWithUserAccountEx(
    token: string,
    channelId: string,
    userAccount: string,
    options: ChannelMediaOptions
  ): number;

  /**
   * Gets user information by User Account.
   *
   * After a remote user joins a channel, the SDK obtains the UID and User Account of the remote user, then caches a mapping table of UID and User Account, and triggers the onUserInfoUpdated callback locally. After receiving the callback, call this method with the User Account to get the UserInfo object that contains the UID of the specified user.
   *
   * @param userAccount User Account.
   *
   * @returns
   * The UserInfo object, if the method call succeeds. null, if the method call fails.
   */
  abstract getUserInfoByUserAccount(userAccount: string): UserInfo;

  /**
   * Gets user information by UID.
   *
   * After a remote user joins a channel, the SDK obtains the UID and User Account of the remote user, then caches a mapping table of UID and User Account, and triggers the onUserInfoUpdated callback locally. After receiving the callback, call this method with the UID to get the UserInfo object that contains the User Account of the specified user.
   *
   * @param uid User ID.
   *
   * @returns
   * The UserInfo object, if the method call succeeds. null, if the method call fails.
   */
  abstract getUserInfoByUid(uid: number): UserInfo;

  /**
   * Starts or updates cross-channel media stream forwarding.
   *
   * The first successful call to this method starts cross-channel media stream forwarding. To forward streams to multiple destination channels or exit a forwarding channel, you can call this method again to add or remove destination channels. This feature supports forwarding to up to 6 destination channels.
   * After successfully calling this method, the SDK triggers the onChannelMediaRelayStateChanged callback to report the current cross-channel media stream forwarding state. Common states include:
   *  If the onChannelMediaRelayStateChanged callback reports RelayStateRunning (2) and RelayOk (0), it means the SDK has started forwarding media streams between the source and destination channels.
   *  If the onChannelMediaRelayStateChanged callback reports RelayStateFailure (3), it means an error occurred during cross-channel media stream forwarding.
   *  Call this method after successfully joining a channel.
   *  In a live streaming scenario, only users with the broadcaster role can call this method.
   *  The cross-channel media stream forwarding feature requires [technical support](https://ticket.shengwang.cn/) to enable.
   *  This feature does not support string-type UIDs.
   *
   * @param configuration Cross-channel media stream forwarding configuration. See ChannelMediaRelayConfiguration.
   *
   * @returns
   * 0: The method call was successful.
   *  < 0: The method call failed. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -1: General error (not specifically classified).
   *  -2: Invalid parameter.
   *  -8: Internal state error. Possibly because the user role is not broadcaster.
   */
  abstract startOrUpdateChannelMediaRelay(
    configuration: ChannelMediaRelayConfiguration
  ): number;

  /**
   * Stops the media stream relay across channels. Once stopped, the broadcaster leaves all destination channels.
   *
   * After a successful call, the SDK triggers the onChannelMediaRelayStateChanged callback. If it reports RelayStateIdle (0) and RelayOk (0), it indicates that the media stream relay has stopped. If the method call fails, the SDK triggers the onChannelMediaRelayStateChanged callback and reports the error code RelayErrorServerNoResponse (2) or RelayErrorServerConnectionLost (8). You can call the leaveChannel method to leave the channel, and the media stream relay will stop automatically.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   *  -5: The method call is rejected. There is no ongoing media stream relay.
   */
  abstract stopChannelMediaRelay(): number;

  /**
   * Pauses media stream forwarding to all destination channels.
   *
   * After starting media stream forwarding across channels, if you need to pause forwarding to all channels, you can call this method. To resume forwarding, call the resumeAllChannelMediaRelay method. You must call this method after calling startOrUpdateChannelMediaRelay to start cross-channel media stream forwarding.
   *
   * @returns
   * 0: The method call was successful.
   *  < 0: The method call failed. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -5: This method call was rejected. There is no ongoing cross-channel media stream forwarding.
   */
  abstract pauseAllChannelMediaRelay(): number;

  /**
   * Resumes media stream forwarding to all destination channels.
   *
   * After calling the pauseAllChannelMediaRelay method, if you need to resume forwarding media streams to all destination channels, you can call this method. You must call this method after pauseAllChannelMediaRelay.
   *
   * @returns
   * 0: The method call was successful.
   *  < 0: The method call failed. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -5: This method call was rejected. There is no paused cross-channel media stream forwarding.
   */
  abstract resumeAllChannelMediaRelay(): number;

  /**
   * Sets the audio encoding properties when the host streams directly to the CDN.
   *
   * Deprecated Deprecated since v4.6.2.
   */
  abstract setDirectCdnStreamingAudioConfiguration(
    profile: AudioProfileType
  ): number;

  /**
   * Sets the video encoding properties when the host streams directly to the CDN.
   *
   * Deprecated Deprecated since v4.6.2. This method only applies to video captured by the camera, screen sharing, or custom video sources. That is, it applies to video collected when publishCameraTrack or publishCustomVideoTrack is set to true in DirectCdnStreamingMediaOptions.
   * If the resolution you set exceeds the range supported by your camera device, the SDK adapts it based on your settings and selects the closest resolution with the same aspect ratio for capture, encoding, and streaming. You can get the actual resolution of the pushed video stream via the onDirectCdnStreamingStats callback.
   *
   * @param config Video encoding parameter configuration. See VideoEncoderConfiguration. When streaming directly to the CDN, the SDK currently only supports setting OrientationMode to landscape (OrientationFixedLandscape) or portrait (OrientationFixedPortrait).
   *
   * @returns
   * 0: The method call was successful.
   *  < 0: The method call failed. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setDirectCdnStreamingVideoConfiguration(
    config: VideoEncoderConfiguration
  ): number;

  /**
   * Starts direct CDN streaming on the host side.
   *
   * Deprecated Deprecated since v4.6.2. The SDK does not support pushing streams to the same URL more than once at the same time.
   * Media options explanation:
   * The SDK does not support setting both publishCameraTrack and publishCustomVideoTrack to true, nor both publishMicrophoneTrack and publishCustomAudioTrack to true. You can configure media options (DirectCdnStreamingMediaOptions) based on your scenario. For example:
   * If you want to push custom audio and video streams collected by the host, configure the media options as follows:
   *  Set publishCustomAudioTrack to true and call pushAudioFrame
   *  Set publishCustomVideoTrack to true and call pushVideoFrame
   *  Ensure publishCameraTrack is false (default value)
   *  Ensure publishMicrophoneTrack is false (default value) Since v4.2.0, the SDK supports pushing audio-only streams. You can set publishCustomAudioTrack or publishMicrophoneTrack to true in DirectCdnStreamingMediaOptions and call pushAudioFrame to push an audio-only stream.
   *
   * @param eventHandler See onDirectCdnStreamingStateChanged and onDirectCdnStreamingStats.
   * @param publishUrl CDN streaming URL.
   * @param options Media options for the host. See DirectCdnStreamingMediaOptions.
   *
   * @returns
   * 0: The method call was successful.
   *  < 0: The method call failed. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract startDirectCdnStreaming(
    eventHandler: IDirectCdnStreamingEventHandler,
    publishUrl: string,
    options: DirectCdnStreamingMediaOptions
  ): number;

  /**
   * Stops direct CDN streaming on the host side.
   *
   * Deprecated Deprecated since v4.6.2.
   *
   * @returns
   * 0: The method call was successful.
   *  < 0: The method call failed. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract stopDirectCdnStreaming(): number;

  /**
   * @ignore
   */
  abstract updateDirectCdnStreamingMediaOptions(
    options: DirectCdnStreamingMediaOptions
  ): number;

  /**
   * Starts the virtual metronome.
   *
   * Deprecated Deprecated since v4.6.2.
   *  Once the virtual metronome is enabled, the SDK starts playing the specified audio files from the beginning and controls the playback duration of each file based on the beatsPerMinute setting in AgoraRhythmPlayerConfig. For example, if beatsPerMinute is set to 60, the SDK plays one beat per second. If the file duration exceeds the beat duration, the SDK only plays the portion corresponding to the beat duration.
   *  By default, the sound of the virtual metronome is not published to remote users. If you want remote users to hear the metronome, set publishRhythmPlayerTrack in ChannelMediaOptions to true after calling this method.
   *
   * @param sound1 The absolute path or URL of the strong beat file, including the file name and extension. For example, C:\music\audio.mp4. Supported audio formats: see [Supported Audio Formats by RTC SDK](https://doc.shengwang.cn/faq/general-product-inquiry/audio-format).
   * @param sound2 The absolute path or URL of the weak beat file, including the file name and extension. For example, C:\music\audio.mp4. Supported audio formats: see [Supported Audio Formats by RTC SDK](https://doc.shengwang.cn/faq/general-product-inquiry/audio-format).
   * @param config Metronome configuration. See AgoraRhythmPlayerConfig.
   */
  abstract startRhythmPlayer(
    sound1: string,
    sound2: string,
    config: AgoraRhythmPlayerConfig
  ): number;

  /**
   * Stops the virtual metronome.
   *
   * After calling startRhythmPlayer, you can call this method to stop the virtual metronome.
   */
  abstract stopRhythmPlayer(): number;

  /**
   * Configures the virtual metronome.
   *
   * Deprecated Deprecated since v4.6.2.
   *  After calling startRhythmPlayer, you can call this method to reconfigure the virtual metronome.
   *  Once the virtual metronome is enabled, the SDK starts playing the specified audio files from the beginning and controls the playback duration of each file based on the beatsPerMinute setting in AgoraRhythmPlayerConfig. For example, if beatsPerMinute is set to 60, the SDK plays one beat per second. If the file duration exceeds the beat duration, the SDK only plays the portion corresponding to the beat duration.
   *  By default, the sound of the virtual metronome is not published to remote users. If you want remote users to hear the metronome, set publishRhythmPlayerTrack in ChannelMediaOptions to true after calling this method.
   *
   * @param config Metronome configuration. See AgoraRhythmPlayerConfig.
   */
  abstract configRhythmPlayer(config: AgoraRhythmPlayerConfig): number;

  /**
   * Takes a video snapshot.
   *
   * This method captures a snapshot of the specified user's video stream, generates a JPG image, and saves it to the specified path.
   *  This method is asynchronous. When the call returns, the SDK has not yet completed the snapshot.
   *  When used for local video snapshot, it captures the video stream specified in ChannelMediaOptions.
   *  If the video is pre-processed, such as with watermark or beautification, the snapshot includes the effects of the pre-processing.
   *
   * @param uid User ID. Set to 0 to capture a snapshot of the local user's video.
   * @param filePath Make sure the directory exists and is writable. Local path to save the snapshot. Must include the file name and format, for example:
   *  Windows: C:\Users\<user_name>\AppData\Local\Agora\<process_name>\example.jpg
   *  macOS: ～/Library/Logs/example.jpg
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract takeSnapshot(uid: number, filePath: string): number;

  /**
   * Enables/disables local snapshot upload.
   *
   * After enabling local snapshot upload, the SDK captures and uploads snapshots of the video sent by the local user based on the module type and frequency you set in ContentInspectConfig. After capturing, the Agora server sends a callback notification to your server via HTTPS request and uploads all snapshots to the third-party cloud storage you specify.
   *  Before calling this method, make sure you have enabled the local snapshot upload service in the Agora Console.
   *  If you choose the Agora proprietary plugin for video moderation (ContentInspectSupervision), you must integrate the dynamic library libagora_content_inspect_extension.dll. Deleting this library will cause the local snapshot upload feature to fail.
   *
   * @param enabled Whether to enable local snapshot upload: true : Enable local snapshot upload. false : Disable local snapshot upload.
   * @param config Local snapshot upload configuration. See ContentInspectConfig.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract enableContentInspect(
    enabled: boolean,
    config: ContentInspectConfig
  ): number;

  /**
   * Adjusts the playback volume of a custom audio capture track on the remote end.
   *
   * After calling this method to set the playback volume of the audio on the remote end, you can call this method again to readjust the volume. Before calling this method, make sure you have called the createCustomAudioTrack method to create a custom audio capture track.
   *
   * @param trackId Audio track ID. Set this parameter to the custom audio track ID returned by the createCustomAudioTrack method.
   * @param volume Playback volume of the custom captured audio, ranging from [0,100]. 0 means mute, 100 means original volume.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract adjustCustomAudioPublishVolume(
    trackId: number,
    volume: number
  ): number;

  /**
   * Adjusts the playout volume of a custom audio capture track locally.
   *
   * After calling this method to set the local playout volume of the audio, if you want to readjust the volume, you can call this method again. Before calling this method, make sure you have already called the createCustomAudioTrack method to create a custom audio capture track.
   *
   * @param trackId Audio track ID. Set this parameter to the custom audio track ID returned by the createCustomAudioTrack method.
   * @param volume Playout volume of the custom captured audio, ranging from [0, 100]. 0 means mute, and 100 means original volume.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract adjustCustomAudioPlayoutVolume(
    trackId: number,
    volume: number
  ): number;

  /**
   * Sets the cloud proxy service.
   *
   * When a user's network access is restricted by a firewall, you need to add the IP addresses and port numbers provided by Agora to the firewall whitelist, then call this method to enable the cloud proxy and set the proxy type using the proxyType parameter.
   * Once successfully connected to the cloud proxy, the SDK triggers the onConnectionStateChanged (ConnectionStateConnecting, ConnectionChangedSettingProxyServer) callback.
   * To disable an already set Force UDP or Force TCP cloud proxy, call setCloudProxy(NoneProxy).
   * To change the current cloud proxy type, first call setCloudProxy(NoneProxy), then call setCloudProxy again with the desired proxyType value.
   *  It is recommended to call this method outside the channel.
   *  When a user is behind an intranet firewall, the features of CDN live streaming and cross-channel media relay are not available when using Force UDP cloud proxy.
   *  When using Force UDP cloud proxy, the startAudioMixing method cannot play online audio files over HTTP. CDN live streaming and cross-channel media relay use TCP-based cloud proxy.
   *
   * @param proxyType The cloud proxy type. See CloudProxyType.
   * This parameter is required. If not set, the SDK will return an error.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   *  -2: Invalid parameter.
   *  -7: The SDK is not initialized.
   */
  abstract setCloudProxy(proxyType: CloudProxyType): number;

  /**
   * @ignore
   */
  abstract setLocalAccessPoint(config: LocalAccessPointConfiguration): number;

  /**
   * Sets advanced audio options.
   *
   * If you have advanced requirements for audio processing, such as capturing and sending stereo audio, you can call this method to set advanced audio options. You need to call this method before joinChannel, enableAudio, and enableLocalAudio.
   *
   * @param options Advanced audio options. See AdvancedAudioOptions.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
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
   * Enables or disables the placeholder image streaming feature.
   *
   * When publishing a video stream, you can call this method to use a custom image to replace the current video stream content.
   * After enabling this feature, you can customize the placeholder image through the ImageTrackOptions parameter. After disabling the feature, remote users will continue to see the video stream you are publishing.
   *
   * @param enable Whether to enable placeholder image streaming: true : Enable placeholder image streaming. false : (Default) Disable placeholder image streaming.
   * @param options Placeholder image settings. See ImageTrackOptions.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract enableVideoImageSource(
    enable: boolean,
    options: ImageTrackOptions
  ): number;

  /**
   * Gets the SDK's current Monotonic Time.
   *
   * Monotonic Time refers to a monotonically increasing time sequence whose value increases over time. The unit is milliseconds.
   * In custom video and audio capture scenarios, to ensure audio-video synchronization, Agora recommends that you call this method to get the SDK's current Monotonic Time and pass this value into the timestamp parameter of the captured VideoFrame or AudioFrame.
   *
   * @returns
   * ≥ 0: Success. Returns the SDK's current Monotonic Time in milliseconds.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract getCurrentMonotonicTimeInMs(): number;

  /**
   * @ignore
   */
  abstract enableWirelessAccelerate(enabled: boolean): number;

  /**
   * Gets the local network connection type.
   *
   * You can call this method at any time to get the current network type. This method can be called before or after joining a channel.
   *
   * @returns
   * ≥ 0: Success. Returns the local network connection type.
   *  0: Network disconnected.
   *  1: LAN.
   *  2: Wi-Fi (including hotspot).
   *  3: 2G mobile network.
   *  4: 3G mobile network.
   *  5: 4G mobile network.
   *  6: 5G mobile network.
   *  < 0: Failure. Returns an error code.
   *  -1: Unknown network type.
   */
  abstract getNetworkType(): number;

  /**
   * JSON configuration information for the SDK, used to provide technical previews or customized features.
   *
   * @param parameters Parameters in JSON string format.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setParameters(parameters: string): number;

  /**
   * Starts video frame rendering tracing.
   *
   * After this method is successfully called, the SDK uses the time of this call as the starting point and reports video frame rendering information via the onVideoRenderingTracingResult callback.
   *  If you do not call this method, the SDK starts tracing video rendering events automatically using the time of the joinChannel call as the starting point. You can call this method at an appropriate time based on your business scenario to customize the tracing.
   *  After leaving the current channel, the SDK automatically resets the time to the next joinChannel call.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -7: IRtcEngine is not initialized when the method is called.
   */
  abstract startMediaRenderingTracing(): number;

  /**
   * Enables accelerated rendering of audio and video frames.
   *
   * After this method is successfully called, the SDK enables accelerated rendering for both video and audio, speeding up the first frame rendering and audio output after joining a channel. Both broadcaster and audience must call this method to experience accelerated rendering.
   * Once successfully called, you can only disable accelerated rendering by calling the release method to destroy the IRtcEngine object.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   *  -7: The IRtcEngine is not initialized when the method is called.
   */
  abstract enableInstantMediaRendering(): number;

  /**
   * Gets the current NTP (Network Time Protocol) time.
   *
   * In real-time chorus scenarios, especially when the downlink is inconsistent across receiving ends due to network issues, you can call this method to get the current NTP time as a reference to align lyrics and music across multiple receivers, achieving chorus synchronization.
   *
   * @returns
   * The current NTP time as a Unix timestamp (milliseconds).
   */
  abstract getNtpWallTimeInMs(): number;

  /**
   * Checks whether the device supports the specified advanced feature.
   *
   * Checks whether the current device meets the requirements for advanced features such as virtual background and beauty effects.
   *
   * @param type The advanced feature type. See FeatureType.
   *
   * @returns
   * true : The device supports the specified advanced feature. false : The device does not support the specified advanced feature.
   */
  abstract isFeatureAvailableOnDevice(type: FeatureType): boolean;

  /**
   * @ignore
   */
  abstract sendAudioMetadata(metadata: string, length: number): number;

  /**
   * @ignore
   */
  abstract queryHDRCapability(videoModule: VideoModuleType): HdrCapability;

  /**
   * Starts screen capture and specifies the video source.
   *
   * This method is only available on macOS and Windows platforms.
   *  If you start screen capture using this method, you must call stopScreenCaptureBySourceType to stop it.
   *  On Windows, up to 4 screen capture video streams are supported.
   *  On macOS, only 1 screen capture video stream is supported.
   *
   * @param sourceType The type of video source. See VideoSourceType. On macOS, only VideoSourceScreen (2) is supported for this parameter.
   * @param config Screen capture configuration. See ScreenCaptureConfiguration.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract startScreenCaptureBySourceType(
    sourceType: VideoSourceType,
    config: ScreenCaptureConfiguration
  ): number;

  /**
   * Stops screen capture for the specified video source.
   *
   * @param sourceType The type of the video source. See VideoSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract stopScreenCaptureBySourceType(sourceType: VideoSourceType): number;

  /**
   * Destroys the IRtcEngine object.
   *
   * This method releases all resources used by the SDK. Some apps only use real-time audio and video communication when needed and release resources when not in use. This method is suitable for such cases.
   * After calling this method, you can no longer use any other SDK methods or callbacks. To use real-time audio and video communication again, you must call createAgoraRtcEngine and initialize again to create a new IRtcEngine object.
   *  This method is a synchronous call. You must wait for the IRtcEngine resources to be released before performing other operations (e.g., creating a new IRtcEngine object). Therefore, it is recommended to call this method in a sub-thread to avoid blocking the main thread.
   *  It is not recommended to call release in an SDK callback. Otherwise, a deadlock may occur because the SDK needs to wait for the callback to return before reclaiming related object resources.
   *
   * @param sync Whether this method is a synchronous call: true : This method is synchronous. false : This method is asynchronous. Currently, only synchronous calls are supported. Do not set this parameter to false.
   */
  abstract release(sync?: boolean): void;

  /**
   * Starts video preview.
   *
   * This method starts the local video preview.
   *  Mirror mode is enabled by default for local preview.
   *  After leaving the channel, the local preview remains active. You need to call stopPreview to stop the local preview.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract startPreviewWithoutSourceType(): number;

  /**
   * Gets the IAudioDeviceManager object to manage audio devices.
   *
   * @returns
   * The IAudioDeviceManager object.
   */
  abstract getAudioDeviceManager(): IAudioDeviceManager;

  /**
   * Gets the IVideoDeviceManager object to manage video devices.
   *
   * @returns
   * An IVideoDeviceManager object.
   */
  abstract getVideoDeviceManager(): IVideoDeviceManager;

  /**
   * @ignore
   */
  abstract getMusicContentCenter(): IMusicContentCenter;

  /**
   * Gets the IMediaEngine object.
   *
   * You need to call this method after initializing the IRtcEngine object.
   *
   * @returns
   * IMediaEngine object.
   */
  abstract getMediaEngine(): IMediaEngine;

  /**
   * Gets the ILocalSpatialAudioEngine object.
   *
   * This method must be called after initializing the IRtcEngine object.
   *
   * @returns
   * An ILocalSpatialAudioEngine object.
   */
  abstract getLocalSpatialAudioEngine(): ILocalSpatialAudioEngine;

  /**
   * @ignore
   */
  abstract getH265Transcoder(): IH265Transcoder;

  /**
   * Sends media metadata.
   *
   * If the metadata is sent successfully, the receiver will receive the onMetadataReceived callback.
   *
   * @param metadata The media metadata. See Metadata.
   * @param sourceType The type of video source. See VideoSourceType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract sendMetaData(
    metadata: Metadata,
    sourceType: VideoSourceType
  ): number;

  /**
   * Sets the maximum size of media metadata.
   *
   * After calling registerMediaMetadataObserver, you can call this method to set the maximum size of the media metadata.
   *
   * @param size The maximum size of the media metadata.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setMaxMetadataSize(size: number): number;

  /**
   * Destroys a single video renderer object.
   *
   * @param view The HTMLElement object to be destroyed.
   */
  abstract destroyRendererByView(view: any): void;

  /**
   * Destroys multiple video renderer objects.
   *
   * @param sourceType Type of video source. See VideoSourceType.
   * @param uid Remote user ID.
   */
  abstract destroyRendererByConfig(
    sourceType: VideoSourceType,
    channelId?: string,
    uid?: number
  ): void;

  /**
   * Unregisters the audio encoded frame observer.
   *
   * @param observer Audio encoded frame observer. See IAudioEncodedFrameObserver.
   *
   * @returns
   * 0: The method call succeeds.
   *  < 0: The method call fails. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract unregisterAudioEncodedFrameObserver(
    observer: IAudioEncodedFrameObserver
  ): number;

  /**
   * Gets the C++ handle of the Native SDK.
   *
   * This method gets the C++ handle of the Native SDK engine, used in special scenarios such as registering audio and video callbacks.
   *
   * @returns
   * The Native handle of the SDK engine.
   */
  abstract getNativeHandle(): number;

  /**
   * Takes a video snapshot at a specified observation point.
   *
   * This method captures a snapshot of the specified user's video stream, generates a JPG image, and saves it to the specified path.
   *  This method is asynchronous. When the call returns, the SDK has not yet completed the snapshot.
   *  When used for local video snapshot, it captures the video stream specified in ChannelMediaOptions.
   *
   * @param uid User ID. Set to 0 to capture a snapshot of the local user's video.
   * @param config Snapshot configuration. See SnapshotConfig.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract takeSnapshotWithConfig(uid: number, config: SnapshotConfig): number;
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
 * Device state.
 */
export enum MediaDeviceStateType {
  /**
   * 0: Device is ready.
   */
  MediaDeviceStateIdle = 0,
  /**
   * 1: Device is in use.
   */
  MediaDeviceStateActive = 1,
  /**
   * 2: Device is disabled.
   */
  MediaDeviceStateDisabled = 2,
  /**
   * 3: Device is plugged in.
   */
  MediaDeviceStatePluggedIn = 3,
  /**
   * 4: Device not present.
   */
  MediaDeviceStateNotPresent = 4,
  /**
   * 8: Device is unplugged.
   */
  MediaDeviceStateUnplugged = 8,
}

/**
 * @ignore
 */
export enum VideoProfileType {
  /**
   * @ignore
   */
  VideoProfileLandscape120p = 0,
  /**
   * @ignore
   */
  VideoProfileLandscape120p3 = 2,
  /**
   * @ignore
   */
  VideoProfileLandscape180p = 10,
  /**
   * @ignore
   */
  VideoProfileLandscape180p3 = 12,
  /**
   * @ignore
   */
  VideoProfileLandscape180p4 = 13,
  /**
   * @ignore
   */
  VideoProfileLandscape240p = 20,
  /**
   * @ignore
   */
  VideoProfileLandscape240p3 = 22,
  /**
   * @ignore
   */
  VideoProfileLandscape240p4 = 23,
  /**
   * @ignore
   */
  VideoProfileLandscape360p = 30,
  /**
   * @ignore
   */
  VideoProfileLandscape360p3 = 32,
  /**
   * @ignore
   */
  VideoProfileLandscape360p4 = 33,
  /**
   * @ignore
   */
  VideoProfileLandscape360p6 = 35,
  /**
   * @ignore
   */
  VideoProfileLandscape360p7 = 36,
  /**
   * @ignore
   */
  VideoProfileLandscape360p8 = 37,
  /**
   * @ignore
   */
  VideoProfileLandscape360p9 = 38,
  /**
   * @ignore
   */
  VideoProfileLandscape360p10 = 39,
  /**
   * @ignore
   */
  VideoProfileLandscape360p11 = 100,
  /**
   * @ignore
   */
  VideoProfileLandscape480p = 40,
  /**
   * @ignore
   */
  VideoProfileLandscape480p3 = 42,
  /**
   * @ignore
   */
  VideoProfileLandscape480p4 = 43,
  /**
   * @ignore
   */
  VideoProfileLandscape480p6 = 45,
  /**
   * @ignore
   */
  VideoProfileLandscape480p8 = 47,
  /**
   * @ignore
   */
  VideoProfileLandscape480p9 = 48,
  /**
   * @ignore
   */
  VideoProfileLandscape480p10 = 49,
  /**
   * @ignore
   */
  VideoProfileLandscape720p = 50,
  /**
   * @ignore
   */
  VideoProfileLandscape720p3 = 52,
  /**
   * @ignore
   */
  VideoProfileLandscape720p5 = 54,
  /**
   * @ignore
   */
  VideoProfileLandscape720p6 = 55,
  /**
   * @ignore
   */
  VideoProfileLandscape1080p = 60,
  /**
   * @ignore
   */
  VideoProfileLandscape1080p3 = 62,
  /**
   * @ignore
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
   * @ignore
   */
  VideoProfilePortrait120p = 1000,
  /**
   * @ignore
   */
  VideoProfilePortrait120p3 = 1002,
  /**
   * @ignore
   */
  VideoProfilePortrait180p = 1010,
  /**
   * @ignore
   */
  VideoProfilePortrait180p3 = 1012,
  /**
   * @ignore
   */
  VideoProfilePortrait180p4 = 1013,
  /**
   * @ignore
   */
  VideoProfilePortrait240p = 1020,
  /**
   * @ignore
   */
  VideoProfilePortrait240p3 = 1022,
  /**
   * @ignore
   */
  VideoProfilePortrait240p4 = 1023,
  /**
   * @ignore
   */
  VideoProfilePortrait360p = 1030,
  /**
   * @ignore
   */
  VideoProfilePortrait360p3 = 1032,
  /**
   * @ignore
   */
  VideoProfilePortrait360p4 = 1033,
  /**
   * @ignore
   */
  VideoProfilePortrait360p6 = 1035,
  /**
   * @ignore
   */
  VideoProfilePortrait360p7 = 1036,
  /**
   * @ignore
   */
  VideoProfilePortrait360p8 = 1037,
  /**
   * @ignore
   */
  VideoProfilePortrait360p9 = 1038,
  /**
   * @ignore
   */
  VideoProfilePortrait360p10 = 1039,
  /**
   * @ignore
   */
  VideoProfilePortrait360p11 = 1100,
  /**
   * @ignore
   */
  VideoProfilePortrait480p = 1040,
  /**
   * @ignore
   */
  VideoProfilePortrait480p3 = 1042,
  /**
   * @ignore
   */
  VideoProfilePortrait480p4 = 1043,
  /**
   * @ignore
   */
  VideoProfilePortrait480p6 = 1045,
  /**
   * @ignore
   */
  VideoProfilePortrait480p8 = 1047,
  /**
   * @ignore
   */
  VideoProfilePortrait480p9 = 1048,
  /**
   * @ignore
   */
  VideoProfilePortrait480p10 = 1049,
  /**
   * @ignore
   */
  VideoProfilePortrait720p = 1050,
  /**
   * @ignore
   */
  VideoProfilePortrait720p3 = 1052,
  /**
   * @ignore
   */
  VideoProfilePortrait720p5 = 1054,
  /**
   * @ignore
   */
  VideoProfilePortrait720p6 = 1055,
  /**
   * @ignore
   */
  VideoProfilePortrait1080p = 1060,
  /**
   * @ignore
   */
  VideoProfilePortrait1080p3 = 1062,
  /**
   * @ignore
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
   * @ignore
   */
  VideoProfileDefault = 30,
}

/**
 * SDK version information.
 */
export class SDKBuildInfo {
  /**
   * SDK build number.
   */
  build?: number;
  /**
   * SDK version number. Format: string, e.g., 4.0.0.
   */
  version?: string;
}

/**
 * The VideoDeviceInfo class contains the video device ID and device name.
 */
export class VideoDeviceInfo {
  /**
   * Device ID.
   */
  deviceId?: string;
  /**
   * Device name.
   */
  deviceName?: string;
}

/**
 * The AudioDeviceInfo class contains the audio device ID and device name.
 */
export class AudioDeviceInfo {
  /**
   * Device ID.
   */
  deviceId?: string;
  /**
   * Audio device type, such as: built-in, USB, HDMI, etc.
   */
  deviceTypeName?: string;
  /**
   * Device name.
   */
  deviceName?: string;
}
