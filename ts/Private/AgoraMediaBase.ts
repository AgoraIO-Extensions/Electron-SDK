import './extension/AgoraMediaBaseExtension';
import { EncodedVideoFrameInfo } from './AgoraBase';

/**
 * Type of video source.
 */
export enum VideoSourceType {
  /**
   * 0: (Default) The video source is the first camera.
   */
  VideoSourceCameraPrimary = 0,
  /**
   * 0: (Default) The video source is the first camera.
   */
  VideoSourceCamera = 0,
  /**
   * 1: The video source is the second camera.
   */
  VideoSourceCameraSecondary = 1,
  /**
   * 2: The video source is the first screen.
   */
  VideoSourceScreenPrimary = 2,
  /**
   * 2: The video source is the first screen.
   */
  VideoSourceScreen = 2,
  /**
   * 3: The video source is the second screen.
   */
  VideoSourceScreenSecondary = 3,
  /**
   * 4: Custom video source.
   */
  VideoSourceCustom = 4,
  /**
   * 5: The video source is a media player.
   */
  VideoSourceMediaPlayer = 5,
  /**
   * 6: The video source is a PNG image.
   */
  VideoSourceRtcImagePng = 6,
  /**
   * 7: The video source is a JPEG image.
   */
  VideoSourceRtcImageJpeg = 7,
  /**
   * 8: The video source is a GIF image.
   */
  VideoSourceRtcImageGif = 8,
  /**
   * 9: The video source is remote video obtained over the network.
   */
  VideoSourceRemote = 9,
  /**
   * 10: Transcoded video source.
   */
  VideoSourceTranscoded = 10,
  /**
   * 11: The video source is the third camera.
   */
  VideoSourceCameraThird = 11,
  /**
   * 12: The video source is the fourth camera.
   */
  VideoSourceCameraFourth = 12,
  /**
   * 13: The video source is the third screen.
   */
  VideoSourceScreenThird = 13,
  /**
   * 14: The video source is the fourth screen.
   */
  VideoSourceScreenFourth = 14,
  /**
   * 15: The video source is video processed by a speech-driven plugin.
   */
  VideoSourceSpeechDriven = 15,
  /**
   * 100: Unknown video source.
   */
  VideoSourceUnknown = 100,
}

/**
 * Types of audio routing.
 */
export enum AudioRoute {
  /**
   * -1: Use the default audio route.
   */
  RouteDefault = -1,
  /**
   * 0: Audio routed to headset with microphone.
   */
  RouteHeadset = 0,
  /**
   * 1: Audio routed to earpiece.
   */
  RouteEarpiece = 1,
  /**
   * 2: Audio routed to headset without microphone.
   */
  RouteHeadsetnomic = 2,
  /**
   * 3: Audio routed to built-in speaker.
   */
  RouteSpeakerphone = 3,
  /**
   * 4: Audio routed to external speaker. (macOS only)
   */
  RouteLoudspeaker = 4,
  /**
   * @ignore
   */
  RouteHeadsetbluetooth = 5,
  /**
   * 6: Audio routed to USB peripheral device. (macOS only)
   */
  RouteUsb = 6,
  /**
   * 7: Audio routed to HDMI peripheral device. (macOS only)
   */
  RouteHdmi = 7,
  /**
   * 8: Audio routed to DisplayPort peripheral device. (macOS only)
   */
  RouteDisplayport = 8,
  /**
   * 9: Audio routed to Apple AirPlay. (macOS only)
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
  /**
   * @ignore
   */
  sample_rate?: number;
  /**
   * @ignore
   */
  channels?: number;
  /**
   * @ignore
   */
  frames_per_buffer?: number;
}

/**
 * Usage mode of audio data.
 */
export enum RawAudioFrameOpModeType {
  /**
   * 0: (Default) Read-only mode. You only retrieve the raw data returned by the SDK without making any modifications. For example, if you collect data via the SDK and perform your own CDN streaming, you can use this mode.
   */
  RawAudioFrameOpModeReadOnly = 0,
  /**
   * 2: Read-write mode. You modify the raw audio returned by the SDK and send it back to the SDK for encoding and transmission. For example, if you have your own audio effects module and want to pre-process the data (e.g., voice changing), you can use this mode.
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
 * The AudioDeviceInfo class contains the audio device ID and device name.
 */
export class AudioDeviceInfo {
  /**
   * Device name.
   */
  deviceName?: string;
  /**
   * Device ID.
   */
  deviceId?: string;
  /**
   * @ignore
   */
  isCurrentSelected?: boolean;
  /**
   * @ignore
   */
  isPlayoutDevice?: boolean;
  /**
   * @ignore
   */
  routing?: AudioRoute;
}

/**
 * Media source types.
 */
export enum MediaSourceType {
  /**
   * 0: Audio playback device.
   */
  AudioPlayoutSource = 0,
  /**
   * 1: Audio recording device.
   */
  AudioRecordingSource = 1,
  /**
   * 2: Primary camera.
   */
  PrimaryCameraSource = 2,
  /**
   * 3: Secondary camera.
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
   * 13: Video source processed by speech-driven plugin.
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
   * 2: Uses Agora's self-developed plugin to capture and upload screenshots. The SDK captures and uploads screenshots of the video stream.
   */
  ContentInspectSupervision = 2,
  /**
   * 3: Uses a Marketplace plugin to capture and upload screenshots. The SDK uses a Marketplace video moderation plugin to capture and upload screenshots of the video stream.
   */
  ContentInspectImageModeration = 3,
}

/**
 * ContentInspectModule structure used to configure the frequency of local screenshot uploads.
 */
export class ContentInspectModule {
  /**
   * Type of function module. See ContentInspectType.
   */
  type?: ContentInspectType;
  /**
   * Interval for local screenshot uploads in seconds. The value must be greater than 0. Default is 0, which means no screenshot upload. Recommended value is 10 seconds, but you can adjust it based on your business needs.
   */
  interval?: number;
}

/**
 * Local screenshot upload configuration.
 */
export class ContentInspectConfig {
  /**
   * Additional information, maximum length is 1024 bytes.
   * The SDK uploads this information along with the screenshot to the Agora server; after the screenshot is complete, the Agora server sends the additional information to your server along with the callback notification.
   */
  extraInfo?: string;
  /**
   * @ignore
   */
  serverConfig?: string;
  /**
   * Function modules. See ContentInspectModule.
   * You can configure up to 32 ContentInspectModule instances. The value range of MAX_CONTENT_INSPECT_MODULE_COUNT is an integer in [1,32]. Only one instance can be configured per function module. Currently, only screenshot upload is supported.
   */
  modules?: ContentInspectModule[];
  /**
   * Number of function modules, i.e., the number of configured ContentInspectModule instances. Must match the number of instances configured in modules. Maximum value is 32.
   */
  moduleCount?: number;
}

/**
 * @ignore
 */
export class PacketOptions {
  /**
   * @ignore
   */
  timestamp?: number;
  /**
   * @ignore
   */
  audioLevelIndication?: number;
}

/**
 * @ignore
 */
export class AudioEncodedFrameInfo {
  /**
   * @ignore
   */
  sendTs?: number;
  /**
   * @ignore
   */
  codec?: number;
}

/**
 * Information of external PCM format audio frame.
 */
export class AudioPcmFrame {
  /**
   * Timestamp of the audio frame (ms).
   */
  capture_timestamp?: number;
  /**
   * Number of samples per channel.
   */
  samples_per_channel_?: number;
  /**
   * Audio sampling rate (Hz).
   */
  sample_rate_hz_?: number;
  /**
   * Number of audio channels.
   */
  num_channels_?: number;
  /**
   * Number of bytes per audio sample.
   */
  bytes_per_sample?: BytesPerSample;
  /**
   * Audio frame data.
   */
  data_?: number[];
}

/**
 * Channel mode.
 */
export enum AudioDualMonoMode {
  /**
   * 0: Original mode.
   */
  AudioDualMonoStereo = 0,
  /**
   * 1: Left channel mode. Replaces the right channel audio with the left channel audio, so users only hear the left channel.
   */
  AudioDualMonoL = 1,
  /**
   * 2: Right channel mode. Replaces the left channel audio with the right channel audio, so users only hear the right channel.
   */
  AudioDualMonoR = 2,
  /**
   * 3: Mixed mode. Combines left and right channel audio so users hear both channels simultaneously.
   */
  AudioDualMonoMix = 3,
}

/**
 * Video pixel format.
 */
export enum VideoPixelFormat {
  /**
   * 0: Original video pixel format.
   */
  VideoPixelDefault = 0,
  /**
   * 1: I420 format.
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
   * 4: RGBA format.
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
   * 16: I422 format.
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
 * Video display mode.
 */
export enum RenderModeType {
  /**
   * 1: The video is scaled proportionally. Priority is given to filling the view. Excess video beyond the view due to size mismatch is cropped.
   */
  RenderModeHidden = 1,
  /**
   * 2: The video is scaled proportionally. Priority is given to displaying the entire video content. Black bars are added to fill the view if the video size does not match the view size.
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
 * Video buffer type.
 */
export enum VideoBufferType {
  /**
   * 1: Type is raw data.
   */
  VideoBufferRawData = 1,
  /**
   * 2: Type is raw data.
   */
  VideoBufferArray = 2,
  /**
   * 3: Type is Texture.
   */
  VideoBufferTexture = 3,
}

/**
 * External video frame.
 */
export class ExternalVideoFrame {
  /**
   * Video type. See VideoBufferType.
   */
  type?: VideoBufferType;
  /**
   * Pixel format. See VideoPixelFormat.
   */
  format?: VideoPixelFormat;
  /**
   * Video buffer.
   */
  buffer?: Uint8Array;
  /**
   * Stride of the input video frame in pixels (not bytes). For Texture, this value refers to the width of the Texture.
   */
  stride?: number;
  /**
   * Height of the input video frame.
   */
  height?: number;
  /**
   * This parameter applies only to raw video data.
   */
  cropLeft?: number;
  /**
   * This parameter applies only to raw video data.
   */
  cropTop?: number;
  /**
   * This parameter applies only to raw video data.
   */
  cropRight?: number;
  /**
   * This parameter applies only to raw video data.
   */
  cropBottom?: number;
  /**
   * Field related to raw data. Specifies whether to rotate the input video group clockwise. Available values: 0, 90, 180, 270. Default is 0.
   */
  rotation?: number;
  /**
   * Timestamp of the input video frame in milliseconds. Incorrect timestamps may cause frame drops or audio-video desynchronization.
   */
  timestamp?: number;
  /**
   * This parameter applies only to video data in Texture format. Refers to the Texture ID of the video frame.
   */
  eglType?: EglContextType;
  /**
   * This parameter applies only to video data in Texture format. Refers to an input 4x4 transformation matrix, typically an identity matrix.
   */
  textureId?: number;
  /**
   * This parameter applies only to video data in Texture format. Refers to an input 4x4 transformation matrix, typically an identity matrix.
   */
  matrix?: number[];
  /**
   * @ignore
   */
  metadata_buffer?: Uint8Array;
  /**
   * @ignore
   */
  metadata_size?: number;
  /**
   * Alpha channel data output by portrait segmentation algorithm. This data matches the size of the video frame, with pixel values ranging from [0,255], where 0 indicates background and 255 indicates foreground (portrait).
   * You can use this parameter to render the video background into various effects such as transparent, solid color, image, video, etc. In custom video rendering scenarios, ensure that both the input video frame and alphaBuffer are of Full Range type; other types may cause incorrect rendering of alpha data.
   */
  alphaBuffer?: Uint8Array;
  /**
   * For video data in BGRA or RGBA format, you can set the alpha channel data in either of the following ways:
   *  Automatically fill by setting this parameter to true.
   *  Set via the alphaBuffer parameter. This parameter applies only to video data in BGRA or RGBA format. Specifies whether to extract the alpha channel data from the video frame and automatically fill it into alphaBuffer : true : Extract and fill alpha channel data. false : (Default) Do not extract and fill alpha channel data.
   */
  fillAlphaBuffer?: boolean;
  /**
   * @ignore
   */
  texture_slice_index?: number;
}

/**
 * Video frame property settings.
 *
 * The buffer is provided as a pointer to a pointer. This interface cannot modify the buffer pointer, only the buffer content.
 */
export class VideoFrame {
  /**
   * Pixel format. See VideoPixelFormat.
   */
  type?: VideoPixelFormat;
  /**
   * Video pixel width.
   */
  width?: number;
  /**
   * Video pixel height.
   */
  height?: number;
  /**
   * For YUV data, indicates the row stride of the Y buffer; for RGBA data, indicates the total data length. When processing video data, you need to handle the offset between rows of pixel data according to this parameter, otherwise image distortion may occur.
   */
  yStride?: number;
  /**
   * For YUV data, indicates the row stride of the U buffer; for RGBA data, the value is 0. When processing video data, you need to handle the offset between rows of pixel data according to this parameter, otherwise image distortion may occur.
   */
  uStride?: number;
  /**
   * For YUV data, indicates the row stride of the V buffer; for RGBA data, the value is 0. When processing video data, you need to handle the offset between rows of pixel data according to this parameter, otherwise image distortion may occur.
   */
  vStride?: number;
  /**
   * For YUV data, indicates the pointer to the Y buffer; for RGBA data, indicates the data buffer.
   */
  yBuffer?: Uint8Array;
  /**
   * For YUV data, indicates the pointer to the U buffer; for RGBA data, the value is empty.
   */
  uBuffer?: Uint8Array;
  /**
   * For YUV data, indicates the pointer to the V buffer; for RGBA data, the value is empty.
   */
  vBuffer?: Uint8Array;
  /**
   * Sets the clockwise rotation angle of the frame before rendering the video. Currently supports 0, 90, 180, and 270 degrees.
   */
  rotation?: number;
  /**
   * The Unix timestamp (in milliseconds) when the video frame is rendered. This timestamp can be used to guide video frame rendering. This parameter is required.
   */
  renderTimeMs?: number;
  /**
   * Reserved parameter.
   */
  avsync_type?: number;
  /**
   * This parameter applies only to video data in Texture format. Indicates the data buffer of MetaData. Default is NULL.
   */
  metadata_buffer?: Uint8Array;
  /**
   * This parameter applies only to video data in Texture format. Indicates the size of MetaData. Default is 0.
   */
  metadata_size?: number;
  /**
   * This parameter applies only to video data in Texture format. Texture ID.
   */
  textureId?: number;
  /**
   * This parameter applies only to video data in Texture format. A 4x4 transformation matrix input, typically an identity matrix.
   */
  matrix?: number[];
  /**
   * Alpha channel data output by the portrait segmentation algorithm. This data matches the size of the video frame. Each pixel value ranges from [0, 255], where 0 represents the background and 255 represents the foreground (portrait).
   * You can use this parameter to render the video background with various effects, such as transparency, solid color, image, video, etc.
   *  In custom video rendering scenarios, ensure that both the video frame and alphaBuffer are of Full Range type; other types may cause abnormal Alpha data rendering.
   *  Make sure that alphaBuffer matches the video frame size (width × height) exactly, otherwise the app may crash.
   */
  alphaBuffer?: Uint8Array;
  /**
   * @ignore
   */
  pixelBuffer?: Uint8Array;
  /**
   * Metadata in the video frame. This parameter requires [contacting technical support](https://ticket.shengwang.cn/) to use.
   */
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
 * Video observation position.
 */
export enum VideoModulePosition {
  /**
   * 1: Position after local video capture and preprocessing, corresponding to the onCaptureVideoFrame callback. The video observed here includes video preprocessing effects, which can be verified by enabling beauty effects, virtual background, or watermark.
   */
  PositionPostCapturer = 1 << 0,
  /**
   * 2: Position before rendering of received remote video, corresponding to the onRenderVideoFrame callback.
   */
  PositionPreRenderer = 1 << 1,
  /**
   * 4: Position before local video encoding, corresponding to the onPreEncodeVideoFrame callback. The video observed here includes preprocessing and pre-encoding effects:
   *  For preprocessing effects, you can verify by enabling beauty effects, virtual background, or watermark.
   *  For pre-encoding effects, you can verify by setting a low frame rate (e.g., 5 fps).
   */
  PositionPreEncoder = 1 << 2,
}

/**
 * This class is used to obtain raw PCM audio data.
 *
 * You can inherit this class and implement the onFrame callback to get PCM audio data.
 */
export interface IAudioPcmFrameSink {
  /**
   * Callback when an audio frame is received.
   *
   * After registering the audio data observer, this callback is triggered each time an audio frame is received to report the audio frame information.
   *
   * @param frame Audio frame information. See AudioPcmFrame.
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
  /**
   * Audio frame type. See AudioFrameType.
   */
  type?: AudioFrameType;
  /**
   * Number of samples per channel.
   */
  samplesPerChannel?: number;
  /**
   * Number of bytes per sample. For PCM, 16-bit (2 bytes) is typically used.
   */
  bytesPerSample?: BytesPerSample;
  /**
   * Number of channels (if stereo, the data is interleaved).
   *  1: Mono
   *  2: Stereo
   */
  channels?: number;
  /**
   * Number of samples per second per channel.
   */
  samplesPerSec?: number;
  /**
   * Audio data buffer (if stereo, the data is interleaved).
   * Buffer data size buffer = samples × channels × bytesPerSample.
   */
  buffer?: Uint8Array;
  /**
   * Render timestamp of the external audio frame.
   * You can use this timestamp to restore the order of audio frames; in scenarios with video (including those using external video sources), this parameter can be used to achieve audio-video synchronization.
   */
  renderTimeMs?: number;
  /**
   * Reserved parameter.
   */
  avsync_type?: number;
  /**
   * @ignore
   */
  presentationMs?: number;
  /**
   * @ignore
   */
  audioTrackNumber?: number;
  /**
   * @ignore
   */
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
 * The SDK sets the audio data format in the following callbacks based on AudioParams : onRecordAudioFrame onPlaybackAudioFrame onMixedAudioFrame
 *  The SDK calculates the sampling interval using the samplesPerCall, sampleRate, and channel parameters in AudioParams, and triggers the onRecordAudioFrame, onPlaybackAudioFrame, onMixedAudioFrame, and onEarMonitoringAudioFrame callbacks based on that interval.
 *  Sampling interval = samplesPerCall / (sampleRate × channel).
 *  Ensure the sampling interval is not less than 0.01 (s).
 */
export class AudioParams {
  /**
   * Sampling rate of the data in Hz. Supported values:
   *  8000
   *  16000 (default)
   *  32000
   *  44100
   *  48000
   */
  sample_rate?: number;
  /**
   * Number of audio channels. Supported values:
   *  1: Mono (default)
   *  2: Stereo
   */
  channels?: number;
  /**
   * Usage mode of the data. See RawAudioFrameOpModeType.
   */
  mode?: RawAudioFrameOpModeType;
  /**
   * Number of samples per call, typically 1024 in scenarios like media push.
   */
  samples_per_call?: number;
}

/**
 * Audio frame observer.
 *
 * You can call registerAudioFrameObserver to register or unregister the IAudioFrameObserverBase audio observer.
 */
export interface IAudioFrameObserverBase {
  /**
   * Receives the raw audio data for recording.
   *
   * To ensure the recorded audio data format meets expectations, you can set the format as follows: Call setRecordingAudioFrameParameters to set the audio format, then call registerAudioFrameObserver to register the audio frame observer. The SDK calculates the sampling interval based on the parameters in this method and triggers the onRecordAudioFrame callback accordingly.
   *
   * @param channelId The channel ID.
   * @param audioFrame The raw audio data. See AudioFrame.
   */
  onRecordAudioFrame?(channelId: string, audioFrame: AudioFrame): void;

  /**
   * Receives the raw audio data for playback.
   *
   * To ensure the playback audio data format meets expectations, you can set the format as follows: Call setPlaybackAudioFrameParameters to set the audio format, then call registerAudioFrameObserver to register the audio frame observer. The SDK calculates the sampling interval based on the parameters in this method and triggers the onPlaybackAudioFrame callback accordingly.
   *
   * @param channelId The channel ID.
   * @param audioFrame The raw audio data. See AudioFrame.
   */
  onPlaybackAudioFrame?(channelId: string, audioFrame: AudioFrame): void;

  /**
   * Retrieves the audio data after mixing the captured and playback audio.
   *
   * To ensure that the format of the mixed audio data from capture and playback meets expectations, you can set the audio data format using the following method: After calling setMixedAudioFrameParameters to set the audio data format, call registerAudioFrameObserver to register the audio observer object. The SDK calculates the sampling interval based on the parameters in this method and triggers the onMixedAudioFrame callback accordingly.
   *
   * @param channelId Channel ID.
   * @param audioFrame Raw audio data. See AudioFrame.
   */
  onMixedAudioFrame?(channelId: string, audioFrame: AudioFrame): void;

  /**
   * Receives the raw audio data for ear monitoring.
   *
   * To ensure the ear monitoring audio data format meets expectations, you can set it as follows: Call setEarMonitoringAudioFrameParameters to set the audio format, then call registerAudioFrameObserver to register the audio frame observer. The SDK calculates the sampling interval based on the parameters in this method and triggers the onEarMonitoringAudioFrame callback accordingly.
   *
   * @param audioFrame The raw audio data. See AudioFrame.
   */
  onEarMonitoringAudioFrame?(audioFrame: AudioFrame): void;
}

/**
 * Audio frame observer.
 *
 * You can call registerAudioFrameObserver to register or unregister the IAudioFrameObserver.
 */
export interface IAudioFrameObserver extends IAudioFrameObserverBase {
  /**
   * Receives the audio of subscribed remote users before mixing.
   *
   * Due to framework limitations, this callback does not support sending processed audio data back to the SDK.
   *
   * @param channelId The channel ID.
   * @param uid The ID of the subscribed remote user.
   * @param audioFrame The raw audio data. See AudioFrame.
   */
  onPlaybackAudioFrameBeforeMixing?(
    channelId: string,
    uid: number,
    audioFrame: AudioFrame
  ): void;
}

/**
 * Audio spectrum data.
 */
export class AudioSpectrumData {
  /**
   * Audio spectrum data. The SDK divides the sound frequency into 256 bands and reports the energy value of each band through this parameter. Each energy value ranges from [-300, 1], in dBFS.
   */
  audioSpectrumData?: number[];
  /**
   * The length of the audio spectrum data is 256.
   */
  dataLength?: number;
}

/**
 * Audio spectrum information of a remote user.
 */
export class UserAudioSpectrumInfo {
  /**
   * Remote user ID.
   */
  uid?: number;
  /**
   * Audio spectrum data of the remote user. See AudioSpectrumData.
   */
  spectrumData?: AudioSpectrumData;
}

/**
 * Audio spectrum observer.
 */
export interface IAudioSpectrumObserver {
  /**
   * Gets the local audio spectrum.
   *
   * After successfully calling registerAudioSpectrumObserver to implement the onLocalAudioSpectrum callback in IAudioSpectrumObserver and calling enableAudioSpectrumMonitor to enable audio spectrum monitoring, the SDK triggers this callback at the interval you set to report the spectrum of local audio data before encoding.
   *
   * @param data The local user's audio spectrum data. See AudioSpectrumData.
   */
  onLocalAudioSpectrum?(data: AudioSpectrumData): void;

  /**
   * Gets the remote audio spectrum.
   *
   * After successfully calling registerAudioSpectrumObserver to implement the onRemoteAudioSpectrum callback in IAudioSpectrumObserver and calling enableAudioSpectrumMonitor to enable audio spectrum monitoring, the SDK triggers this callback at the interval you set to report the spectrum of received remote audio data.
   *
   * @param spectrums The audio spectrum information of remote users. See UserAudioSpectrumInfo. The number of elements in the array equals the number of remote users monitored by the SDK. An empty array indicates no remote user audio spectrum is detected.
   * @param spectrumNumber The number of remote users.
   */
  onRemoteAudioSpectrum?(
    spectrums: UserAudioSpectrumInfo[],
    spectrumNumber: number
  ): void;
}

/**
 * Class used to receive encoded video frames.
 */
export interface IVideoEncodedFrameObserver {
  /**
   * Reports that a remote encoded video frame has been received.
   *
   * When you call setRemoteVideoSubscriptionOptions and set encodedFrameOnly to true, the SDK triggers this callback locally to report the received encoded video frame information.
   *
   * @param channelId Channel name.
   * @param uid Remote user ID.
   * @param imageBuffer Video image buffer.
   * @param length Length of the video image data.
   * @param videoEncodedFrameInfo Encoded video frame information. See EncodedVideoFrameInfo.
   */
  onEncodedVideoFrameReceived?(
    uid: number,
    imageBuffer: Uint8Array,
    length: number,
    videoEncodedFrameInfo: EncodedVideoFrameInfo
  ): void;
}

/**
 * Video frame processing mode.
 */
export enum VideoFrameProcessMode {
  /**
   * Read-only mode.
   * In read-only mode, you do not modify the video frame. The video observer acts as a renderer.
   */
  ProcessModeReadOnly = 0,
  /**
   * Read-write mode.
   * In read-write mode, you modify the video frame. The video observer acts as a video filter.
   */
  ProcessModeReadWrite = 1,
}

/**
 * Video frame observer.
 *
 * You can call registerVideoFrameObserver to register or unregister the IVideoFrameObserver video observer.
 */
export interface IVideoFrameObserver {
  /**
   * Gets the video data captured by the local device.
   *
   * You can get the raw video data captured by the local device in this callback.
   *  If the video data format you receive is RGBA, the SDK does not support processing the Alpha channel.
   *  When modifying parameters in videoFrame, ensure they match the actual video frame data in the buffer. Otherwise, unexpected rotation or distortion may occur in the local preview or remote video.
   *  It is recommended to implement this callback using the C++ API.
   *  Due to framework limitations, this callback does not support sending the processed video data back to the SDK.
   *
   * @param sourceType Type of video source, which may include camera, screen, or media player. See VideoSourceType.
   * @param videoFrame Video frame data. See VideoFrame. The default format of the video frame data obtained through this callback is:
   *  macOS: I420
   *  Windows: YUV420
   */
  onCaptureVideoFrame?(
    sourceType: VideoSourceType,
    videoFrame: VideoFrame
  ): void;

  /**
   * Gets the video data before local encoding.
   *
   * After successfully registering the video data observer, the SDK triggers this callback when each video frame is captured. You can get the video data before encoding and process it as needed.
   * After processing, you can pass the processed video data back to the SDK in this callback.
   *  It is recommended to implement this callback using the C++ API.
   *  Due to framework limitations, this callback does not support sending the processed video data back to the SDK.
   *  The video data obtained here has already been pre-processed, such as cropping, rotation, beautification, etc.
   *  When modifying parameters in videoFrame, ensure they match the actual video frame data in the buffer. Otherwise, unexpected rotation or distortion may occur in the local preview or remote video.
   *
   * @param sourceType Type of video source. See VideoSourceType.
   * @param videoFrame Video frame data. See VideoFrame. The default format of the video frame data obtained through this callback is:
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
   * Gets the video data sent by the remote user.
   *
   * After successfully registering the video data observer, the SDK triggers this callback when each video frame is captured. You can get the video data sent by the remote user before rendering and process it as needed.
   *  If the video data format you receive is RGBA, the SDK does not support processing the Alpha channel.
   *  It is recommended to implement this callback using the C++ API.
   *  Due to framework limitations, this callback does not support sending the processed video data back to the SDK.
   *  When modifying parameters in videoFrame, ensure they match the actual video frame data in the buffer. Otherwise, unexpected rotation or distortion may occur in the local preview or remote video.
   *
   * @param channelId Channel ID.
   * @param remoteUid The user ID of the remote user who sent the video frame.
   * @param videoFrame Video frame data. See VideoFrame. The default format of the video frame data obtained through this callback is:
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
 * Encoding type of external video frames.
 */
export enum ExternalVideoSourceType {
  /**
   * 0: Unencoded video frame.
   */
  VideoFrame = 0,
  /**
   * 1: Encoded video frame.
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
 * @ignore
 */
export enum MediaRecorderStreamType {
  /**
   * @ignore
   */
  StreamTypeAudio = 0x01,
  /**
   * @ignore
   */
  StreamTypeVideo = 0x02,
  /**
   * @ignore
   */
  StreamTypeBoth = 0x01 | 0x02,
}

/**
 * Current recording state.
 */
export enum RecorderState {
  /**
   * -1: Audio/video stream recording error. See RecorderReasonCode for details.
   */
  RecorderStateError = -1,
  /**
   * 2: Audio/video stream recording started.
   */
  RecorderStateStart = 2,
  /**
   * 3: Audio/video stream recording stopped.
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
  /**
   * @ignore
   */
  storagePath?: string;
  /**
   * @ignore
   */
  containerFormat?: MediaRecorderContainerFormat;
  /**
   * @ignore
   */
  streamType?: MediaRecorderStreamType;
  /**
   * @ignore
   */
  maxDurationMs?: number;
  /**
   * @ignore
   */
  recorderInfoUpdateInterval?: number;
}

/**
 * Face information observer.
 *
 * You can call registerFaceInfoObserver to register the IFaceInfoObserver observer.
 */
export interface IFaceInfoObserver {
  /**
   * Reports face information processed by the voice driver plugin.
   *
   * @param outFaceInfo Output parameter. A JSON string of the face information processed by the voice driver plugin, containing the following fields:
   *  faces: An array of objects. Each object contains information about a detected face.
   *  blendshapes: Object. A set of blendshape coefficients named according to the ARKit standard. Each key-value pair represents a blendshape coefficient. The coefficient is a float in the range [0.0, 1.0].
   *  rotation: An array of objects. Head rotation values, including the following key-value pairs with float values in the range [-180.0, 180.0]:
   *  pitch: Head pitch angle. Positive when looking down, negative when looking up.
   *  yaw: Head yaw angle. Positive when turning left, negative when turning right.
   *  roll: Head roll angle. Positive when tilting right, negative when tilting left.
   *  timestamp: String. The timestamp of the output result in milliseconds. Example JSON: { "faces":[{ "blendshapes":{ "eyeBlinkLeft":0.9, "eyeLookDownLeft":0.0, "eyeLookInLeft":0.0, "eyeLookOutLeft":0.0, "eyeLookUpLeft":0.0, "eyeSquintLeft":0.0, "eyeWideLeft":0.0, "eyeBlinkRight":0.0, "eyeLookDownRight":0.0, "eyeLookInRight":0.0, "eyeLookOutRight":0.0, "eyeLookUpRight":0.0, "eyeSquintRight":0.0, "eyeWideRight":0.0, "jawForward":0.0, "jawLeft":0.0, "jawRight":0.0, "jawOpen":0.0, "mouthClose":0.0, "mouthFunnel":0.0, "mouthPucker":0.0, "mouthLeft":0.0, "mouthRight":0.0, "mouthSmileLeft":0.0, "mouthSmileRight":0.0, "mouthFrownLeft":0.0, "mouthFrownRight":0.0, "mouthDimpleLeft":0.0, "mouthDimpleRight":0.0, "mouthStretchLeft":0.0, "mouthStretchRight":0.0, "mouthRollLower":0.0, "mouthRollUpper":0.0, "mouthShrugLower":0.0, "mouthShrugUpper":0.0, "mouthPressLeft":0.0, "mouthPressRight":0.0, "mouthLowerDownLeft":0.0, "mouthLowerDownRight":0.0, "mouthUpperUpLeft":0.0, "mouthUpperUpRight":0.0, "browDownLeft":0.0, "browDownRight":0.0, "browInnerUp":0.0, "browOuterUpLeft":0.0, "browOuterUpRight":0.0, "cheekPuff":0.0, "cheekSquintLeft":0.0, "cheekSquintRight":0.0, "noseSneerLeft":0.0, "noseSneerRight":0.0, "tongueOut":0.0 }, "rotation":{"pitch":30.0, "yaw":25.5, "roll":-15.5}, }], "timestamp":"654879876546" }
   *
   * @returns
   * true : Successfully parsed the face information JSON. false : Failed to parse the face information JSON.
   */
  onFaceInfo?(outFaceInfo: string): void;
}

/**
 * @ignore
 */
export class RecorderInfo {
  /**
   * @ignore
   */
  fileName?: string;
  /**
   * @ignore
   */
  durationMs?: number;
  /**
   * @ignore
   */
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
