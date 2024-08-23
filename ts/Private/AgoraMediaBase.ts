import './extension/AgoraMediaBaseExtension';
import { EncodedVideoFrameInfo } from './AgoraBase';

/**
 * The type of the video source.
 */
export enum VideoSourceType {
  /**
   * 0: (Default) The primary camera.
   */
  VideoSourceCameraPrimary = 0,
  /**
   * 0: (Default) The primary camera.
   */
  VideoSourceCamera = 0,
  /**
   * 1: The secondary camera.
   */
  VideoSourceCameraSecondary = 1,
  /**
   * 2: The primary screen.
   */
  VideoSourceScreenPrimary = 2,
  /**
   * 2: The primary screen.
   */
  VideoSourceScreen = 2,
  /**
   * 3: The secondary screen.
   */
  VideoSourceScreenSecondary = 3,
  /**
   * 4: A custom video source.
   */
  VideoSourceCustom = 4,
  /**
   * 5: The media player.
   */
  VideoSourceMediaPlayer = 5,
  /**
   * 6: One PNG image.
   */
  VideoSourceRtcImagePng = 6,
  /**
   * 7: One JPEG image.
   */
  VideoSourceRtcImageJpeg = 7,
  /**
   * 8: One GIF image.
   */
  VideoSourceRtcImageGif = 8,
  /**
   * 9: One remote video acquired by the network.
   */
  VideoSourceRemote = 9,
  /**
   * 10: One transcoded video source.
   */
  VideoSourceTranscoded = 10,
  /**
   * 11: The third camera.
   */
  VideoSourceCameraThird = 11,
  /**
   * 12: The fourth camera.
   */
  VideoSourceCameraFourth = 12,
  /**
   * 13: The third screen.
   */
  VideoSourceScreenThird = 13,
  /**
   * 14: The fourth screen.
   */
  VideoSourceScreenFourth = 14,
  /**
   * @ignore
   */
  VideoSourceSpeechDriven = 15,
  /**
   * 100: An unknown video source.
   */
  VideoSourceUnknown = 100,
}

/**
 * The type of the audio route.
 */
export enum AudioRoute {
  /**
   * -1: The default audio route.
   */
  RouteDefault = -1,
  /**
   * 0: Audio output routing is a headset with microphone.
   */
  RouteHeadset = 0,
  /**
   * 1: The audio route is an earpiece.
   */
  RouteEarpiece = 1,
  /**
   * 2: The audio route is a headset without a microphone.
   */
  RouteHeadsetnomic = 2,
  /**
   * 3: The audio route is the speaker that comes with the device.
   */
  RouteSpeakerphone = 3,
  /**
   * 4: The audio route is an external speaker. (macOS only)
   */
  RouteLoudspeaker = 4,
  /**
   * @ignore
   */
  RouteHeadsetbluetooth = 5,
  /**
   * 6: The audio route is a USB peripheral device. (For macOS only)
   */
  RouteUsb = 6,
  /**
   * 7: The audio route is an HDMI peripheral device. (For macOS only)
   */
  RouteHdmi = 7,
  /**
   * 8: The audio route is a DisplayPort peripheral device. (For macOS only)
   */
  RouteDisplayport = 8,
  /**
   * 9: The audio route is Apple AirPlay. (For macOS only)
   */
  RouteAirplay = 9,
  /**
   * @ignore
   */
  RouteVirtual = 10,
  /**
   * @ignore
   */
  RouteContinuity = 11,
}

/**
 * @ignore
 */
export enum BytesPerSample {
  /**
   * @ignore
   */
  TwoBytesPerSample = 2,
}

/**
 * @ignore
 */
export class AudioParameters {
  sample_rate?: number;
  channels?: number;
  frames_per_buffer?: number;
}

/**
 * The use mode of the audio data.
 */
export enum RawAudioFrameOpModeType {
  /**
   * 0: Read-only mode, Users only read the data returned by the SDK without modifying anything. For example, when users acquire the data with the Agora SDK, then start the media push.
   */
  RawAudioFrameOpModeReadOnly = 0,
  /**
   * 2: Read and write mode, Users read the data returned by the SDK, modify it, and then play it. For example, when users have their own audio-effect processing module and perform some voice preprocessing, such as a voice change.
   */
  RawAudioFrameOpModeReadWrite = 2,
}

/**
 * @ignore
 */
export enum TrackAudioMixedPolicyType {
  /**
   * @ignore
   */
  TrackAudioMixedLocal = 1 << 0,
  /**
   * @ignore
   */
  TrackAudioMixedRemote = 1 << 1,
}

/**
 * The AudioDeviceInfo class that contains the ID, name and type of the audio devices.
 */
export class AudioDeviceInfo {
  deviceName?: string;
  deviceId?: string;
  isCurrentSelected?: boolean;
  isPlayoutDevice?: boolean;
  routing?: AudioRoute;
}

/**
 * Media source type.
 */
export enum MediaSourceType {
  /**
   * 0: Audio playback device.
   */
  AudioPlayoutSource = 0,
  /**
   * 1: Audio capturing device.
   */
  AudioRecordingSource = 1,
  /**
   * 2: The primary camera.
   */
  PrimaryCameraSource = 2,
  /**
   * 3: A secondary camera.
   */
  SecondaryCameraSource = 3,
  /**
   * @ignore
   */
  PrimaryScreenSource = 4,
  /**
   * @ignore
   */
  SecondaryScreenSource = 5,
  /**
   * 6: Custom video source.
   */
  CustomVideoSource = 6,
  /**
   * @ignore
   */
  MediaPlayerSource = 7,
  /**
   * @ignore
   */
  RtcImagePngSource = 8,
  /**
   * @ignore
   */
  RtcImageJpegSource = 9,
  /**
   * @ignore
   */
  RtcImageGifSource = 10,
  /**
   * @ignore
   */
  RemoteVideoSource = 11,
  /**
   * @ignore
   */
  TranscodedVideoSource = 12,
  /**
   * @ignore
   */
  SpeechDrivenVideoSource = 13,
  /**
   * 100: Unknown media source.
   */
  UnknownMediaSource = 100,
}

/**
 * @ignore
 */
export enum ContentInspectResult {
  /**
   * @ignore
   */
  ContentInspectNeutral = 1,
  /**
   * @ignore
   */
  ContentInspectSexy = 2,
  /**
   * @ignore
   */
  ContentInspectPorn = 3,
}

/**
 * The type of video content moderation module.
 */
export enum ContentInspectType {
  /**
   * 0: (Default) This module has no actual function. Do not set type to this value.
   */
  ContentInspectInvalid = 0,
  /**
   * @ignore
   */
  ContentInspectModeration = 1,
  /**
   * 2: Video screenshot and upload via Agora self-developed extension. SDK takes screenshots of the video stream in the channel and uploads them.
   */
  ContentInspectSupervision = 2,
  /**
   * 3: Video screenshot and upload via extensions from Agora Extensions Marketplace. SDK uses video moderation extensions from Agora Extensions Marketplace to take screenshots of the video stream in the channel and uploads them.
   */
  ContentInspectImageModeration = 3,
}

/**
 * ContentInspectModule A structure used to configure the frequency of video screenshot and upload.
 */
export class ContentInspectModule {
  type?: ContentInspectType;
  interval?: number;
}

/**
 * Screenshot and upload configuration.
 */
export class ContentInspectConfig {
  extraInfo?: string;
  serverConfig?: string;
  modules?: ContentInspectModule[];
  moduleCount?: number;
}

/**
 * @ignore
 */
export class PacketOptions {
  timestamp?: number;
  audioLevelIndication?: number;
}

/**
 * @ignore
 */
export class AudioEncodedFrameInfo {
  sendTs?: number;
  codec?: number;
}

/**
 * The parameters of the audio frame in PCM format.
 */
export class AudioPcmFrame {
  capture_timestamp?: number;
  samples_per_channel_?: number;
  sample_rate_hz_?: number;
  num_channels_?: number;
  bytes_per_sample?: BytesPerSample;
  data_?: number[];
}

/**
 * The channel mode.
 */
export enum AudioDualMonoMode {
  /**
   * 0: Original mode.
   */
  AudioDualMonoStereo = 0,
  /**
   * 1: Left channel mode. This mode replaces the audio of the right channel with the audio of the left channel, which means the user can only hear the audio of the left channel.
   */
  AudioDualMonoL = 1,
  /**
   * 2: Right channel mode. This mode replaces the audio of the left channel with the audio of the right channel, which means the user can only hear the audio of the right channel.
   */
  AudioDualMonoR = 2,
  /**
   * 3: Mixed channel mode. This mode mixes the audio of the left channel and the right channel, which means the user can hear the audio of the left channel and the right channel at the same time.
   */
  AudioDualMonoMix = 3,
}

/**
 * The video pixel format.
 */
export enum VideoPixelFormat {
  /**
   * 0: Raw video pixel format.
   */
  VideoPixelDefault = 0,
  /**
   * 1: The format is I420.
   */
  VideoPixelI420 = 1,
  /**
   * @ignore
   */
  VideoPixelBgra = 2,
  /**
   * @ignore
   */
  VideoPixelNv21 = 3,
  /**
   * 4: The format is RGBA.
   */
  VideoPixelRgba = 4,
  /**
   * @ignore
   */
  VideoPixelNv12 = 8,
  /**
   * @ignore
   */
  VideoTexture2d = 10,
  /**
   * @ignore
   */
  VideoTextureOes = 11,
  /**
   * @ignore
   */
  VideoCvpixelNv12 = 12,
  /**
   * @ignore
   */
  VideoCvpixelI420 = 13,
  /**
   * @ignore
   */
  VideoCvpixelBgra = 14,
  /**
   * 16: The format is I422.
   */
  VideoPixelI422 = 16,
  /**
   * @ignore
   */
  VideoTextureId3d11texture2d = 17,
  /**
   * @ignore
   */
  VideoPixelI010 = 18,
}

/**
 * Video display modes.
 */
export enum RenderModeType {
  /**
   * 1: Hidden mode. Uniformly scale the video until one of its dimension fits the boundary (zoomed to fit). One dimension of the video may have clipped contents.
   */
  RenderModeHidden = 1,
  /**
   * 2: Fit mode. Uniformly scale the video until one of its dimension fits the boundary (zoomed to fit). Areas that are not filled due to disparity in the aspect ratio are filled with black.
   */
  RenderModeFit = 2,
  /**
   * @ignore
   */
  RenderModeAdaptive = 3,
}

/**
 * @ignore
 */
export enum CameraVideoSourceType {
  /**
   * @ignore
   */
  CameraSourceFront = 0,
  /**
   * @ignore
   */
  CameraSourceBack = 1,
  /**
   * @ignore
   */
  VideoSourceUnspecified = 2,
}

/**
 * @ignore
 */
export enum MetaInfoKey {
  /**
   * @ignore
   */
  KeyFaceCapture = 0,
}

/**
 * @ignore
 */
export abstract class IVideoFrameMetaInfo {
  /**
   * @ignore
   */
  abstract getMetaInfoStr(key: MetaInfoKey): string;
}

/**
 * @ignore
 */
export enum EglContextType {
  /**
   * @ignore
   */
  EglContext10 = 0,
  /**
   * @ignore
   */
  EglContext14 = 1,
}

/**
 * The video buffer type.
 */
export enum VideoBufferType {
  /**
   * 1: The video buffer in the format of raw data.
   */
  VideoBufferRawData = 1,
  /**
   * 2: The video buffer in the format of raw data.
   */
  VideoBufferArray = 2,
  /**
   * 3: The video buffer in the format of Texture.
   */
  VideoBufferTexture = 3,
}

/**
 * The external video frame.
 */
export class ExternalVideoFrame {
  type?: VideoBufferType;
  format?: VideoPixelFormat;
  buffer?: Uint8Array;
  stride?: number;
  height?: number;
  cropLeft?: number;
  cropTop?: number;
  cropRight?: number;
  cropBottom?: number;
  rotation?: number;
  timestamp?: number;
  eglType?: EglContextType;
  textureId?: number;
  matrix?: number[];
  metadata_buffer?: Uint8Array;
  metadata_size?: number;
  alphaBuffer?: Uint8Array;
  fillAlphaBuffer?: boolean;
  texture_slice_index?: number;
}

/**
 * Configurations of the video frame.
 *
 * Note that the buffer provides a pointer to a pointer. This interface cannot modify the pointer of the buffer, but it can modify the content of the buffer.
 */
export class VideoFrame {
  type?: VideoPixelFormat;
  width?: number;
  height?: number;
  yStride?: number;
  uStride?: number;
  vStride?: number;
  yBuffer?: Uint8Array;
  uBuffer?: Uint8Array;
  vBuffer?: Uint8Array;
  rotation?: number;
  renderTimeMs?: number;
  avsync_type?: number;
  metadata_buffer?: Uint8Array;
  metadata_size?: number;
  textureId?: number;
  matrix?: number[];
  alphaBuffer?: Uint8Array;
  pixelBuffer?: Uint8Array;
  metaInfo?: IVideoFrameMetaInfo;
}

/**
 * @ignore
 */
export enum MediaPlayerSourceType {
  /**
   * @ignore
   */
  MediaPlayerSourceDefault = 0,
  /**
   * @ignore
   */
  MediaPlayerSourceFullFeatured = 1,
  /**
   * @ignore
   */
  MediaPlayerSourceSimple = 2,
}

/**
 * The frame position of the video observer.
 */
export enum VideoModulePosition {
  /**
   * 1: The location of the locally collected video data after preprocessing corresponds to the onCaptureVideoFrame callback. The observed video here has the effect of video pre-processing, which can be verified by enabling image enhancement, virtual background, or watermark.
   */
  PositionPostCapturer = 1 << 0,
  /**
   * 2: The pre-renderer position, which corresponds to the video data in the onRenderVideoFrame callback.
   */
  PositionPreRenderer = 1 << 1,
  /**
   * 4: The pre-encoder position, which corresponds to the video data in the onPreEncodeVideoFrame callback. The observed video here has the effects of video pre-processing and encoding pre-processing.
   *  To verify the pre-processing effects of the video, you can enable image enhancement, virtual background, or watermark.
   *  To verify the pre-encoding processing effect, you can set a lower frame rate (for example, 5 fps).
   */
  PositionPreEncoder = 1 << 2,
}

/**
 * This class is used to get raw PCM audio.
 *
 * You can inherit this class and implement the onFrame callback to get raw PCM audio.
 */
export interface IAudioPcmFrameSink {
  /**
   * Occurs each time the player receives an audio frame.
   *
   * After registering the audio frame observer, the callback occurs every time the player receives an audio frame, reporting the detailed information of the audio frame.
   *
   * @param frame The audio frame information. See AudioPcmFrame.
   */
  onFrame?(frame: AudioPcmFrame): void;
}

/**
 * Audio frame type.
 */
export enum AudioFrameType {
  /**
   * 0: PCM 16
   */
  FrameTypePcm16 = 0,
}

/**
 * Raw audio data.
 */
export class AudioFrame {
  type?: AudioFrameType;
  samplesPerChannel?: number;
  bytesPerSample?: BytesPerSample;
  channels?: number;
  samplesPerSec?: number;
  buffer?: Uint8Array;
  renderTimeMs?: number;
  avsync_type?: number;
  presentationMs?: number;
  audioTrackNumber?: number;
  rtpTimestamp?: number;
}

/**
 * @ignore
 */
export enum AudioFramePosition {
  /**
   * @ignore
   */
  AudioFramePositionNone = 0x0000,
  /**
   * @ignore
   */
  AudioFramePositionPlayback = 0x0001,
  /**
   * @ignore
   */
  AudioFramePositionRecord = 0x0002,
  /**
   * @ignore
   */
  AudioFramePositionMixed = 0x0004,
  /**
   * @ignore
   */
  AudioFramePositionBeforeMixing = 0x0008,
  /**
   * @ignore
   */
  AudioFramePositionEarMonitoring = 0x0010,
}

/**
 * Audio data format.
 *
 * The SDK sets the audio data format in the following callbacks according to AudioParams. onRecordAudioFrame onPlaybackAudioFrame onMixedAudioFrame
 *  The SDK calculates the sampling interval through the samplesPerCall, sampleRate, and channel parameters in AudioParams, and triggers the onRecordAudioFrame, onPlaybackAudioFrame, onMixedAudioFrame, and onEarMonitoringAudioFrame callbacks according to the sampling interval. Sample interval (sec) = samplePerCall /(sampleRate × channel).
 *  Ensure that the sample interval ≥ 0.01 (s).
 */
export class AudioParams {
  sample_rate?: number;
  channels?: number;
  mode?: RawAudioFrameOpModeType;
  samples_per_call?: number;
}

/**
 * The audio frame observer.
 */
export interface IAudioFrameObserverBase {
  /**
   * Gets the captured audio frame.
   *
   * To ensure that the data format of captured audio frame is as expected, Agora recommends that you set the audio data format as follows: After calling setRecordingAudioFrameParameters to set the audio data format, call registerAudioFrameObserver to register the audio observer object, the SDK will calculate the sampling interval according to the parameters set in this method, and triggers the onRecordAudioFrame callback according to the sampling interval.
   *
   * @param channelId The channel ID.
   * @param audioFrame The raw audio data. See AudioFrame.
   */
  onRecordAudioFrame?(channelId: string, audioFrame: AudioFrame): void;

  /**
   * Gets the raw audio frame for playback.
   *
   * To ensure that the data format of audio frame for playback is as expected, Agora recommends that you set the audio data format as follows: After calling setPlaybackAudioFrameParameters to set the audio data format and registerAudioFrameObserver to register the audio frame observer object, the SDK calculates the sampling interval according to the parameters set in the methods, and triggers the onPlaybackAudioFrame callback according to the sampling interval.
   *
   * @param channelId The channel ID.
   * @param audioFrame The raw audio data. See AudioFrame.
   */
  onPlaybackAudioFrame?(channelId: string, audioFrame: AudioFrame): void;

  /**
   * Retrieves the mixed captured and playback audio frame.
   *
   * To ensure that the data format of mixed captured and playback audio frame meets the expectations, Agora recommends that you set the data format as follows: After calling setMixedAudioFrameParameters to set the audio data format and registerAudioFrameObserver to register the audio frame observer object, the SDK calculates the sampling interval according to the parameters set in the methods, and triggers the onMixedAudioFrame callback according to the sampling interval.
   *
   * @param channelId The channel ID.
   * @param audioFrame The raw audio data. See AudioFrame.
   */
  onMixedAudioFrame?(channelId: string, audioFrame: AudioFrame): void;

  /**
   * Gets the in-ear monitoring audio frame.
   *
   * In order to ensure that the obtained in-ear audio data meets the expectations, Agora recommends that you set the in-ear monitoring-ear audio data format as follows: After calling setEarMonitoringAudioFrameParameters to set the audio data format and registerAudioFrameObserver to register the audio frame observer object, the SDK calculates the sampling interval according to the parameters set in the methods, and triggers the onEarMonitoringAudioFrame callback according to the sampling interval.
   *
   * @param audioFrame The raw audio data. See AudioFrame.
   */
  onEarMonitoringAudioFrame?(audioFrame: AudioFrame): void;
}

/**
 * The audio frame observer.
 */
export interface IAudioFrameObserver extends IAudioFrameObserverBase {
  /**
   * Retrieves the audio frame before mixing of subscribed remote users.
   *
   * Due to framework limitations, this callback does not support sending processed audio data back to the SDK.
   *
   * @param channelId The channel ID.
   * @param uid The ID of subscribed remote users.
   * @param audioFrame The raw audio data. See AudioFrame.
   */
  onPlaybackAudioFrameBeforeMixing?(
    channelId: string,
    uid: number,
    audioFrame: AudioFrame
  ): void;
}

/**
 * The audio spectrum data.
 */
export class AudioSpectrumData {
  audioSpectrumData?: number[];
  dataLength?: number;
}

/**
 * Audio spectrum information of the remote user.
 */
export class UserAudioSpectrumInfo {
  uid?: number;
  spectrumData?: AudioSpectrumData;
}

/**
 * The audio spectrum observer.
 */
export interface IAudioSpectrumObserver {
  /**
   * Gets the statistics of a local audio spectrum.
   *
   * After successfully calling registerAudioSpectrumObserver to implement the onLocalAudioSpectrum callback in IAudioSpectrumObserver and calling enableAudioSpectrumMonitor to enable audio spectrum monitoring, the SDK triggers this callback as the time interval you set to report the received remote audio data spectrum before encoding.
   *
   * @param data The audio spectrum data of the local user. See AudioSpectrumData.
   */
  onLocalAudioSpectrum?(data: AudioSpectrumData): void;

  /**
   * Gets the remote audio spectrum.
   *
   * After successfully calling registerAudioSpectrumObserver to implement the onRemoteAudioSpectrum callback in the IAudioSpectrumObserver and calling enableAudioSpectrumMonitor to enable audio spectrum monitoring, the SDK will trigger the callback as the time interval you set to report the received remote audio data spectrum.
   *
   * @param spectrums The audio spectrum information of the remote user, see UserAudioSpectrumInfo. The number of arrays is the number of remote users monitored by the SDK. If the array is null, it means that no audio spectrum of remote users is detected.
   * @param spectrumNumber The number of remote users.
   */
  onRemoteAudioSpectrum?(
    spectrums: UserAudioSpectrumInfo[],
    spectrumNumber: number
  ): void;
}

/**
 * Receives encoded video images.
 */
export interface IVideoEncodedFrameObserver {
  /**
   * Reports that the receiver has received the to-be-decoded video frame sent by the remote end.
   *
   * If you call the setRemoteVideoSubscriptionOptions method and set encodedFrameOnly to true, the SDK triggers this callback locally to report the received encoded video frame information.
   *
   * @param uid The user ID of the remote user.
   * @param imageBuffer The encoded video image buffer.
   * @param length The data length of the video image.
   * @param videoEncodedFrameInfo For the information of the encoded video frame, see EncodedVideoFrameInfo.
   */
  onEncodedVideoFrameReceived?(
    uid: number,
    imageBuffer: Uint8Array,
    length: number,
    videoEncodedFrameInfo: EncodedVideoFrameInfo
  ): void;
}

/**
 * The process mode of the video frame:
 */
export enum VideoFrameProcessMode {
  /**
   * Read-only mode. In this mode, you do not modify the video frame. The video frame observer is a renderer.
   */
  ProcessModeReadOnly = 0,
  /**
   * Read and write mode. In this mode, you modify the video frame. The video frame observer is a video filter.
   */
  ProcessModeReadWrite = 1,
}

/**
 * The IVideoFrameObserver class.
 */
export interface IVideoFrameObserver {
  /**
   * Occurs each time the SDK receives a video frame captured by local devices.
   *
   * You can get raw video data collected by the local device through this callback.
   *
   * @param sourceType Video source types, including cameras, screens, or media player. See VideoSourceType.
   * @param videoFrame The video frame. See VideoFrame. The default value of the video frame data format obtained through this callback is as follows:
   *  macOS: I420
   *  Windows: YUV420
   */
  onCaptureVideoFrame?(
    sourceType: VideoSourceType,
    videoFrame: VideoFrame
  ): void;

  /**
   * Occurs each time the SDK receives a video frame before encoding.
   *
   * After you successfully register the video frame observer, the SDK triggers this callback each time it receives a video frame. In this callback, you can get the video data before encoding and then process the data according to your particular scenarios. After processing, you can send the processed video data back to the SDK in this callback.
   *  It is recommended that you ensure the modified parameters in videoFrame are consistent with the actual situation of the video frames in the video frame buffer. Otherwise, it may cause unexpected rotation, distortion, and other issues in the local preview and remote video display.
   *  It's recommended that you implement this callback through the C++ API.
   *  Due to framework limitations, this callback does not support sending processed video data back to the SDK.
   *  The video data that this callback gets has been preprocessed, with its content cropped and rotated, and the image enhanced.
   *
   * @param sourceType The type of the video source. See VideoSourceType.
   * @param videoFrame The video frame. See VideoFrame. The default value of the video frame data format obtained through this callback is as follows:
   *  macOS: I420
   *  Windows: YUV420
   */
  onPreEncodeVideoFrame?(
    sourceType: VideoSourceType,
    videoFrame: VideoFrame
  ): void;

  /**
   * @ignore
   */
  onMediaPlayerVideoFrame?(videoFrame: VideoFrame, mediaPlayerId: number): void;

  /**
   * Occurs each time the SDK receives a video frame sent by the remote user.
   *
   * After you successfully register the video frame observer, the SDK triggers this callback each time it receives a video frame. In this callback, you can get the video data sent from the remote end before rendering, and then process it according to the particular scenarios.
   *  It is recommended that you ensure the modified parameters in videoFrame are consistent with the actual situation of the video frames in the video frame buffer. Otherwise, it may cause unexpected rotation, distortion, and other issues in the local preview and remote video display.
   *  If the video data type you get is RGBA, the SDK does not support processing the data of the alpha channel.
   *  It's recommended that you implement this callback through the C++ API.
   *  Due to framework limitations, this callback does not support sending processed video data back to the SDK.
   *
   * @param channelId The channel ID.
   * @param remoteUid The user ID of the remote user who sends the current video frame.
   * @param videoFrame The video frame. See VideoFrame. The default value of the video frame data format obtained through this callback is as follows:
   *  macOS: I420
   *  Windows: YUV420
   */
  onRenderVideoFrame?(
    channelId: string,
    remoteUid: number,
    videoFrame: VideoFrame
  ): void;

  /**
   * @ignore
   */
  onTranscodedVideoFrame?(videoFrame: VideoFrame): void;
}

/**
 * The external video frame encoding type.
 */
export enum ExternalVideoSourceType {
  /**
   * 0: The video frame is not encoded.
   */
  VideoFrame = 0,
  /**
   * 1: The video frame is encoded.
   */
  EncodedVideoFrame = 1,
}

/**
 * @ignore
 */
export enum MediaRecorderContainerFormat {
  /**
   * @ignore
   */
  FormatMp4 = 1,
}

/**
 * The recording content.
 */
export enum MediaRecorderStreamType {
  /**
   * Only audio.
   */
  StreamTypeAudio = 0x01,
  /**
   * Only video.
   */
  StreamTypeVideo = 0x02,
  /**
   * (Default) Audio and video.
   */
  StreamTypeBoth = 0x01 | 0x02,
}

/**
 * The current recording state.
 */
export enum RecorderState {
  /**
   * -1: An error occurs during the recording. See RecorderReasonCode for the reason.
   */
  RecorderStateError = -1,
  /**
   * 2: The audio and video recording starts.
   */
  RecorderStateStart = 2,
  /**
   * 3: The audio and video recording stops.
   */
  RecorderStateStop = 3,
}

/**
 * @ignore
 */
export enum RecorderErrorCode {
  /**
   * @ignore
   */
  RecorderErrorNone = 0,
  /**
   * @ignore
   */
  RecorderErrorWriteFailed = 1,
  /**
   * @ignore
   */
  RecorderErrorNoStream = 2,
  /**
   * @ignore
   */
  RecorderErrorOverMaxDuration = 3,
  /**
   * @ignore
   */
  RecorderErrorConfigChanged = 4,
}

/**
 * @ignore
 */
export class MediaRecorderConfiguration {
  storagePath?: string;
  containerFormat?: MediaRecorderContainerFormat;
  streamType?: MediaRecorderStreamType;
  maxDurationMs?: number;
  recorderInfoUpdateInterval?: number;
}

/**
 * Facial information observer.
 *
 * You can call registerFaceInfoObserver to register one IFaceInfoObserver observer.
 */
export interface IFaceInfoObserver {
  /**
   * Occurs when the facial information processed by speech driven extension is received.
   *
   * @param outFaceInfo Output parameter, the JSON string of the facial information processed by the voice driver plugin, including the following fields:
   *  faces: Object sequence. The collection of facial information, with each face corresponding to an object.
   *  blendshapes: Object. The collection of face capture coefficients, named according to ARkit standards, with each key-value pair representing a blendshape coefficient. The blendshape coefficient is a floating point number with a range of [0.0, 1.0].
   *  rotation: Object sequence. The rotation of the head, which includes the following three key-value pairs, with values as floating point numbers ranging from -180.0 to 180.0:
   *  pitch: Head pitch angle. A positve value means looking down, while a negative value means looking up.
   *  yaw: Head yaw angle. A positve value means turning left, while a negative value means turning right.
   *  roll: Head roll angle. A positve value means tilting to the right, while a negative value means tilting to the left.
   *  timestamp: String. The timestamp of the output result, in milliseconds. Here is an example of JSON:
   * { "faces":[{ "blendshapes":{ "eyeBlinkLeft":0.9, "eyeLookDownLeft":0.0, "eyeLookInLeft":0.0, "eyeLookOutLeft":0.0, "eyeLookUpLeft":0.0, "eyeSquintLeft":0.0, "eyeWideLeft":0.0, "eyeBlinkRight":0.0, "eyeLookDownRight":0.0, "eyeLookInRight":0.0, "eyeLookOutRight":0.0, "eyeLookUpRight":0.0, "eyeSquintRight":0.0, "eyeWideRight":0.0, "jawForward":0.0, "jawLeft":0.0, "jawRight":0.0, "jawOpen":0.0, "mouthClose":0.0, "mouthFunnel":0.0, "mouthPucker":0.0, "mouthLeft":0.0, "mouthRight":0.0, "mouthSmileLeft":0.0, "mouthSmileRight":0.0, "mouthFrownLeft":0.0, "mouthFrownRight":0.0, "mouthDimpleLeft":0.0, "mouthDimpleRight":0.0, "mouthStretchLeft":0.0, "mouthStretchRight":0.0, "mouthRollLower":0.0, "mouthRollUpper":0.0, "mouthShrugLower":0.0, "mouthShrugUpper":0.0, "mouthPressLeft":0.0, "mouthPressRight":0.0, "mouthLowerDownLeft":0.0, "mouthLowerDownRight":0.0, "mouthUpperUpLeft":0.0, "mouthUpperUpRight":0.0, "browDownLeft":0.0, "browDownRight":0.0, "browInnerUp":0.0, "browOuterUpLeft":0.0, "browOuterUpRight":0.0, "cheekPuff":0.0, "cheekSquintLeft":0.0, "cheekSquintRight":0.0, "noseSneerLeft":0.0, "noseSneerRight":0.0, "tongueOut":0.0 }, "rotation":{"pitch":30.0, "yaw":25.5, "roll":-15.5},
   *  }], "timestamp":"654879876546" }
   *
   * @returns
   * true : Facial information JSON parsing successful. false : Facial information JSON parsing failed.
   */
  onFaceInfo?(outFaceInfo: string): boolean;
}

/**
 * @ignore
 */
export class RecorderInfo {
  fileName?: string;
  durationMs?: number;
  fileSize?: number;
}

/**
 * @ignore
 */
export interface IMediaRecorderObserver {
  /**
   * @ignore
   */
  onRecorderStateChanged?(
    channelId: string,
    uid: number,
    state: RecorderState,
    error: RecorderErrorCode
  ): void;

  /**
   * @ignore
   */
  onRecorderInfoUpdated?(
    channelId: string,
    uid: number,
    info: RecorderInfo
  ): void;
}
