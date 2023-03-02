import './extension/AgoraMediaBaseExtension';
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
   * 7: The audio route is a USB peripheral device. (For macOS only)
   */
  RouteUsb = 6,
  /**
   * 6: The audio route is an HDMI peripheral device. (For macOS only)
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
   * 3: The secondary camera.
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
   * @ignore
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
   * 1: Video content moderation. SDK takes screenshots, inspects video content of the video stream in the channel, and uploads the screenshots and moderation results.
   */
  ContentInspectModeration = 1,
  /**
   * @ignore
   */
  ContentInspectSupervision = 2,
}

/**
 * A structure used to configure the frequency of video screenshot and upload.ContentInspectModule
 */
export class ContentInspectModule {
  type?: ContentInspectType;
  interval?: number;
}

/**
 * Configuration of video screenshot and upload.
 */
export class ContentInspectConfig {
  extraInfo?: string;
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
   * 8: The format is NV12.
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
}

/**
 * Configurations of the video frame.
 * The video data format is YUV420. Note that the buffer provides a pointer to a pointer. This interface cannot modify the pointer of the buffer, but it can modify the content of the buffer.
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
   * 1: The post-capturer position, which corresponds to the video data in the onCaptureVideoFrame callback.
   */
  PositionPostCapturer = 1 << 0,
  /**
   * 2: The pre-renderer position, which corresponds to the video data in the onRenderVideoFrame callback.
   */
  PositionPreRenderer = 1 << 1,
  /**
   * 4: The pre-encoder position, which corresponds to the video data in the onPreEncodeVideoFrame callback.
   */
  PositionPreEncoder = 1 << 2,
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
 * The SDK sets the audio data format in the following callbacks according to AudioParams. onRecordAudioFrame onPlaybackAudioFrame onMixedAudioFrame The SDK calculates the sampling interval through the samplesPerCall, sampleRate, and channel parameters in AudioParams, and triggers the onRecordAudioFrame, onPlaybackAudioFrame, onMixedAudioFrame, and onEarMonitoringAudioFrame callbacks according to the sampling interval.Sample interval (sec) = samplePerCall/(sampleRate × channel).Ensure that the sample interval ≥ 0.01 (s).
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
   * Retrieves the mixed captured and playback audio frame.
   * To ensure that the data format of mixed captured and playback audio frame meets the expectations, Agora recommends that you set the data format as follows: After calling setMixedAudioFrameParameters to set the audio data format and registerAudioFrameObserver to register the audio frame observer object, the SDK calculates the sampling interval according to the parameters set in the methods, and triggers the onMixedAudioFrame callback according to the sampling interval.
   *
   * @param channelId The channel ID.
   * @param audioFrame The raw audio data. See AudioFrame .
   *
   * @returns
   * Reserved for future use.
   */
  onRecordAudioFrame?(channelId: string, audioFrame: AudioFrame): boolean;

  /**
   * Retrieves the mixed captured and playback audio frame.
   * To ensure that the data format of mixed captured and playback audio frame meets the expectations, Agora recommends that you set the data format as follows: After calling setMixedAudioFrameParameters to set the audio data format and registerAudioFrameObserver to register the audio frame observer object, the SDK calculates the sampling interval according to the parameters set in the methods, and triggers the onMixedAudioFrame callback according to the sampling interval.
   *
   * @param channelId The channel ID.
   * @param audioFrame The raw audio data. See AudioFrame .
   *
   * @returns
   * Reserved for future use.
   */
  onPlaybackAudioFrame?(channelId: string, audioFrame: AudioFrame): boolean;

  /**
   * Retrieves the mixed captured and playback audio frame.
   * To ensure that the data format of mixed captured and playback audio frame meets the expectations, Agora recommends that you set the data format as follows: After calling setMixedAudioFrameParameters to set the audio data format and registerAudioFrameObserver to register the audio frame observer object, the SDK calculates the sampling interval according to the parameters set in the methods, and triggers the onMixedAudioFrame callback according to the sampling interval.
   *
   * @param channelId The channel ID.
   * @param audioFrame The raw audio data. See AudioFrame .
   *
   * @returns
   * Reserved for future use.
   */
  onMixedAudioFrame?(channelId: string, audioFrame: AudioFrame): boolean;

  /**
   * Gets the in-ear monitoring audio frame.
   * In order to ensure that the obtained in-ear audio data meets the expectations, Agora recommends that you set the in-ear monitoring-ear audio data format as follows: After calling setEarMonitoringAudioFrameParameters to set the audio data format and registerAudioFrameObserver to register the audio frame observer object, the SDK calculates the sampling interval according to the parameters set in the methods, and triggers the onEarMonitoringAudioFrame callback according to the sampling interval.
   *
   * @returns
   * Reserved for future use.
   */
  onEarMonitoringAudioFrame?(audioFrame: AudioFrame): boolean;
}

/**
 * The audio frame observer.
 */
export interface IAudioFrameObserver extends IAudioFrameObserverBase {
  /**
   * Retrieves the audio frame of a specified user before mixing.
   *
   * @param channelId The channel ID.
   * @param uid The user ID of the specified user.
   * @param audioFrame The raw audio data. See AudioFrame .
   *
   * @returns
   * Reserved for future use.
   */
  onPlaybackAudioFrameBeforeMixing?(
    channelId: string,
    uid: number,
    audioFrame: AudioFrame
  ): boolean;
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
   * After successfully calling registerAudioSpectrumObserver to implement the onLocalAudioSpectrumcallback in IAudioSpectrumObserver and calling enableAudioSpectrumMonitor to enable audio spectrum monitoring, the SDK will trigger the callback as the time interval you set to report the received remote audio data spectrum.
   *
   * @param data The audio spectrum data of the local user. See AudioSpectrumData .
   *
   * @returns
   * Whether the spectrum data is received:true: Spectrum data is received.false: No spectrum data is received.
   */
  onLocalAudioSpectrum?(data: AudioSpectrumData): boolean;

  /**
   * Gets the remote audio spectrum.
   * After successfully calling registerAudioSpectrumObserver to implement the onRemoteAudioSpectrum callback in the IAudioSpectrumObserver and calling enableAudioSpectrumMonitor to enable audio spectrum monitoring, the SDK will trigger the callback as the time interval you set to report the received remote audio data spectrum.
   *
   * @param spectrums The audio spectrum information of the remote user, see UserAudioSpectrumInfo . The number of arrays is the number of remote users monitored by the SDK. If the array is null, it means that no audio spectrum of remote users is detected.
   * @param spectrumNumber The number of remote users.
   *
   * @returns
   * Whether the spectrum data is received:true: Spectrum data is received.false: No spectrum data is received.
   */
  onRemoteAudioSpectrum?(
    spectrums: UserAudioSpectrumInfo[],
    spectrumNumber: number
  ): boolean;
}

/**
 * Receives encoded video images.
 */
export interface IVideoEncodedFrameObserver {
  /**
   * Reports that the receiver has received the to-be-decoded video frame sent by the remote end.
   * If you call the setRemoteVideoSubscriptionOptions method and set encodedFrameOnly to true, the SDK triggers this callback locally to report the received encoded video frame information.
   *
   * @param uid The user ID of the remote user.
   * @param imageBuffer The encoded video image buffer.
   * @param length The data length of the video image.
   * @param videoEncodedFrameInfo For the information of the encoded video frame, see EncodedVideoFrameInfo .
   *
   * @returns
   * Reserved for future use.
   */
  onEncodedVideoFrameReceived?(
    uid: number,
    imageBuffer: Uint8Array,
    length: number,
    videoEncodedFrameInfo: EncodedVideoFrameInfo
  ): boolean;
}

/**
 * The process mode of the video frame:
 */
export enum VideoFrameProcessMode {
  /**
   * Read-only mode.In this mode, you do not modify the video frame. The video frame observer is a renderer.
   */
  ProcessModeReadOnly = 0,
  /**
   * Read and write mode.In this mode, you modify the video frame. The video frame observer is a video filter.
   */
  ProcessModeReadWrite = 1,
}

/**
 * The IVideoFrameObserver class.
 */
export interface IVideoFrameObserver {
  /**
   * Occurs each time the SDK receives a video frame captured by the local camera.
   * After you successfully register the video frame observer, the SDK triggers this callback each time it receives a video frame. In this callback, you can get the video data captured by the local camera. You can then pre-process the data according to your scenarios.After pre-processing, you can send the processed video data back to the SDK through this callback.The video data that this callback gets has not been pre-processed, and is not watermarked, cropped, rotated or beautified.If the video data type you get is RGBA, Agora does not support processing the data of the alpha channel.
   *
   * @param videoFrame The video frame. See VideoFrame .
   *
   * @returns
   * When the video processing mode is ProcessModeReadOnly:true: Reserved for future use.false: Reserved for future use.When the video processing mode is ProcessModeReadWrite:true: Sets the SDK to receive the video frame.false: Sets the SDK to discard the video frame.
   */
  onCaptureVideoFrame?(videoFrame: VideoFrame): boolean;

  /**
   * Occurs each time the SDK receives a video frame before encoding.
   * After you successfully register the video frame observer, the SDK triggers this callback each time it receives a video frame. In this callback, you can get the video data before encoding and then process the data according to your particular scenarios.After processing, you can send the processed video data back to the SDK in this callback.The video data that this callback gets has been preprocessed, with its content cropped and rotated, and the image enhanced.
   *
   * @param videoFrame The video frame. See VideoFrame .
   *
   * @returns
   * When the video processing mode is ProcessModeReadOnly:true: Reserved for future use.false: Reserved for future use.When the video processing mode is ProcessModeReadWrite:true: Sets the SDK to receive the video frame.false: Sets the SDK to discard the video frame.
   */
  onPreEncodeVideoFrame?(videoFrame: VideoFrame): boolean;

  /**
   * Occurs each time the SDK receives a video frame captured by the local camera.
   * After you successfully register the video frame observer, the SDK triggers this callback each time it receives a video frame. In this callback, you can get the video data captured by the local camera. You can then pre-process the data according to your scenarios.After pre-processing, you can send the processed video data back to the SDK through this callback.The video data that this callback gets has not been pre-processed, and is not watermarked, cropped, rotated or beautified.If the video data type you get is RGBA, Agora does not support processing the data of the alpha channel.
   *
   * @param videoFrame The video frame. See VideoFrame .
   *
   * @returns
   * When the video processing mode is ProcessModeReadOnly:true: Reserved for future use.false: Reserved for future use.When the video processing mode is ProcessModeReadWrite:true: Sets the SDK to receive the video frame.false: Sets the SDK to discard the video frame.
   */
  onSecondaryCameraCaptureVideoFrame?(videoFrame: VideoFrame): boolean;

  /**
   * Gets the video data captured from the second camera before encoding.
   * After you successfully register the video frame observer, the SDK triggers this callback each time it receives a video frame. In this callback, you can get the video data captured from the second camera before encoding and then process the data according to your particular scenarios.After processing, you can send the processed video data back to the SDK in this callback.
   *
   * @param videoFrame The video frame. See VideoFrame .
   *
   * @returns
   * true: Sets the SDK to receive the video frame.false: Sets the SDK to discard the video frame.
   */
  onSecondaryPreEncodeCameraVideoFrame?(videoFrame: VideoFrame): boolean;

  /**
   * Occurs each time the SDK receives a video frame captured by the screen.
   * After you successfully register the video frame observer, the SDK triggers this callback each time it receives a video frame. In this callback, you can get the video data for screen sharing. You can then pre-process the data according to your scenarios.After pre-processing, you can send the processed video data back to the SDK through this callback.This callback does not support sending processed RGBA video data back to the SDK.The video data that this callback gets has not been pre-processed, and is not watermarked, cropped, rotated or beautified.
   *
   * @param videoFrame The video frame. See VideoFrame .
   *
   * @returns
   * When the video processing mode is ProcessModeReadOnly:true: Reserved for future use.false: Reserved for future use.When the video processing mode is ProcessModeReadWrite:true: Sets the SDK to receive the video frame.false: Sets the SDK to discard the video frame.
   */
  onScreenCaptureVideoFrame?(videoFrame: VideoFrame): boolean;

  /**
   * Gets the video data captured from the screen before encoding.
   * After you successfully register the video frame observer, the SDK triggers this callback each time it receives a video frame. In this callback, you can get the video data captured from the screen before encoding and then process the data according to your particular scenarios.After processing, you can send the processed video data back to the SDK in this callback.The video data that this callback gets has been preprocessed, with its content cropped and rotated, and the image enhanced.This callback does not support sending processed RGBA video data back to the SDK.
   *
   * @param videoFrame The video frame. See VideoFrame .
   *
   * @returns
   * When the video processing mode is ProcessModeReadOnly:true: Reserved for future use.false: Reserved for future use.When the video processing mode is ProcessModeReadWrite:true: Sets the SDK to receive the video frame.false: Sets the SDK to discard the video frame.
   */
  onPreEncodeScreenVideoFrame?(videoFrame: VideoFrame): boolean;

  /**
   * Gets the video data of the media player.
   * After you successfully register the video frame observer and calling the createMediaPlayer method, the SDK triggers this callback each time when it receives a video frame. In this callback, you can get the video data of the media player. You can then process the data according to your particular scenarios.This callback only supports read-only mode.
   *
   * @param videoFrame The video frame. See VideoFrame .
   * @param mediaPlayerId The ID of the media player.
   *
   * @returns
   * true: Reserved for future use.false: Reserved for future use.
   */
  onMediaPlayerVideoFrame?(
    videoFrame: VideoFrame,
    mediaPlayerId: number
  ): boolean;

  /**
   * Occurs each time the SDK receives a video frame captured by the local camera.
   * After you successfully register the video frame observer, the SDK triggers this callback each time it receives a video frame. In this callback, you can get the video data captured by the local camera. You can then pre-process the data according to your scenarios.After pre-processing, you can send the processed video data back to the SDK through this callback.The video data that this callback gets has not been pre-processed, and is not watermarked, cropped, rotated or beautified.If the video data type you get is RGBA, Agora does not support processing the data of the alpha channel.
   *
   * @param videoFrame The video frame. See VideoFrame .
   *
   * @returns
   * When the video processing mode is ProcessModeReadOnly:true: Reserved for future use.false: Reserved for future use.When the video processing mode is ProcessModeReadWrite:true: Sets the SDK to receive the video frame.false: Sets the SDK to discard the video frame.
   */
  onSecondaryScreenCaptureVideoFrame?(videoFrame: VideoFrame): boolean;

  /**
   * Gets the video data captured from the second screen before encoding.
   * After you successfully register the video frame observer, the SDK triggers this callback each time it receives a video frame. In this callback, you can get the video data captured from the second screen before encoding and then process the data according to your particular scenarios.After processing, you can send the processed video data back to the SDK in this callback.
   *
   * @param videoFrame The video frame. See VideoFrame .
   *
   * @returns
   * true: Sets the SDK to receive the video frame.false: Sets the SDK to discard the video frame.
   */
  onSecondaryPreEncodeScreenVideoFrame?(videoFrame: VideoFrame): boolean;

  /**
   * Occurs each time the SDK receives a video frame sent by the remote user.
   * After you successfully register the video frame observer, the SDK triggers this callback each time it receives a video frame. In this callback, you can get the video data before encoding. You can then process the data according to your particular scenarios.If the video data type you get is RGBA, Agora does not support processing the data of the alpha channel.
   *
   * @param channelId The channel ID.
   * @param remoteUid The user ID of the remote user who sends the current video frame.
   * @param videoFrame The video frame. See VideoFrame .
   *
   * @returns
   * When the video processing mode is ProcessModeReadOnly:true: Reserved for future use.false: Reserved for future use.When the video processing mode is ProcessModeReadWrite:true: Sets the SDK to receive the video frame.false: Sets the SDK to discard the video frame.
   */
  onRenderVideoFrame?(
    channelId: string,
    remoteUid: number,
    videoFrame: VideoFrame
  ): boolean;

  /**
   * Occurs each time the SDK receives a video frame captured by the local camera.
   * After you successfully register the video frame observer, the SDK triggers this callback each time it receives a video frame. In this callback, you can get the video data captured by the local camera. You can then pre-process the data according to your scenarios.After pre-processing, you can send the processed video data back to the SDK through this callback.The video data that this callback gets has not been pre-processed, and is not watermarked, cropped, rotated or beautified.If the video data type you get is RGBA, Agora does not support processing the data of the alpha channel.
   *
   * @param videoFrame The video frame. See VideoFrame .
   *
   * @returns
   * When the video processing mode is ProcessModeReadOnly:true: Reserved for future use.false: Reserved for future use.When the video processing mode is ProcessModeReadWrite:true: Sets the SDK to receive the video frame.false: Sets the SDK to discard the video frame.
   */
  onTranscodedVideoFrame?(videoFrame: VideoFrame): boolean;
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
 * The format of the recording file.
 */
export enum MediaRecorderContainerFormat {
  /**
   * 1: (Default) MP4.
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
   * -1: An error occurs during the recording. See RecorderErrorCode for the reason.
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
 * The reason for the state change.
 */
export enum RecorderErrorCode {
  /**
   * 0: No error.
   */
  RecorderErrorNone = 0,
  /**
   * 1: The SDK fails to write the recorded data to a file.
   */
  RecorderErrorWriteFailed = 1,
  /**
   * 2: The SDK does not detect any audio and video streams, or audio and video streams are interrupted for more than five seconds during recording.
   */
  RecorderErrorNoStream = 2,
  /**
   * 3: The recording duration exceeds the upper limit.
   */
  RecorderErrorOverMaxDuration = 3,
  /**
   * 4: The recording configuration changes.
   */
  RecorderErrorConfigChanged = 4,
}

/**
 * Configurations for the local audio and video recording.
 */
export class MediaRecorderConfiguration {
  storagePath?: string;
  containerFormat?: MediaRecorderContainerFormat;
  streamType?: MediaRecorderStreamType;
  maxDurationMs?: number;
  recorderInfoUpdateInterval?: number;
}

/**
 * The information about the file that is recorded.
 */
export class RecorderInfo {
  fileName?: string;
  durationMs?: number;
  fileSize?: number;
}

/**
 * The IMediaRecorderObserver class.
 */
export interface IMediaRecorderObserver {
  /**
   * Occurs when the recording state changes.
   * When the local audio or video recording state changes, the SDK triggers this callback to report the current recording state and the reason for the change.
   *
   * @param state The current recording state. See RecorderState .
   * @param error The reason for the state change. See RecorderErrorCode .
   */
  onRecorderStateChanged?(state: RecorderState, error: RecorderErrorCode): void;

  /**
   * Occurs when the recording information is updated.
   * After you successfully enable the local audio and video recording, the SDK periodically triggers this callback based on the value of recorderInfoUpdateInterval set in MediaRecorderConfiguration . This callback reports the file name, duration, and size of the current recording file.
   *
   * @param info The information about the file that is recorded. See RecorderInfo .
   */
  onRecorderInfoUpdated?(info: RecorderInfo): void;
}
