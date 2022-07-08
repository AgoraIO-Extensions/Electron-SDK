
/*
 * The type of the audio route.
 */
export enum AudioRoute {
/*
 * -1: Default audio route.
 */
RouteDefault = -1,
/*
 * Audio output routing is a headset with microphone.
 */
RouteHeadset = 0,
/*
 * 1: The audio route is an earpiece.
 */
RouteEarpiece = 1,
/*
 * 2: The audio route is a headset without a microphone.
 */
RouteHeadsetnomic = 2,
/*
 * 3: The audio route is the speaker that comes with the device.
 */
RouteSpeakerphone = 3,
/*
 * 4: The audio route is an external speaker. (macOS only)
 */
RouteLoudspeaker = 4,
/*
 * @ignore
 */
RouteHeadsetbluetooth = 5,
/*
 * 7: (macOS only) The audio route is an HDMI peripheral device.
 */
RouteHdmi = 6,
/*
 * 6: (macOS only) The audio route is a USB peripheral device.
 */
RouteUsb = 7,
}

/*
 * @ignore
 */
export enum NlpAggressiveness {
/*
 * @ignore
 */
NlpNotSpecified = 0,
/*
 * @ignore
 */
NlpMild = 1,
/*
 * @ignore
 */
NlpNormal = 2,
/*
 * @ignore
 */
NlpAggressive = 3,
/*
 * @ignore
 */
NlpSuperAggressive = 4,
/*
 * @ignore
 */
NlpExtreme = 5,
}

/*
 * @ignore
 */
export enum BytesPerSample {
/*
 * @ignore
 */
TwoBytesPerSample = 2,
}

/*
 * @ignore
 */
export class AudioParameters {
/*
 * @ignore
 */
  sample_rate?: number
  /*
   * @ignore
   */
  channels?: number
  /*
   * @ignore
   */
  frames_per_buffer?: number
}

/*
 * The use mode of the audio data.
 */
export enum RawAudioFrameOpModeType {
/*
 * 0: Read-only mode: Users only read the data returned by the SDK without modifying anything. For example, when users acquire the data with the Agora SDK, then start the media push.
 */
RawAudioFrameOpModeReadOnly = 0,
/*
 * 2: Read and write mode: Users read the data returned by the SDK, modify it, and then play it. For example, when users have their own audio-effect processing module and perform some voice pre-processing, such as a voice change.
 */
RawAudioFrameOpModeReadWrite = 2,
}

/*
 * Media source type.
 */
export enum MediaSourceType {
/*
 * 0: Audio playback device.
 */
AudioPlayoutSource = 0,
/*
 * 1: Audio capturing device.
 */
AudioRecordingSource = 1,
/*
 * @ignore
 */
PrimaryCameraSource = 2,
/*
 * @ignore
 */
SecondaryCameraSource = 3,
/*
 * @ignore
 */
PrimaryScreenSource = 4,
/*
 * @ignore
 */
SecondaryScreenSource = 5,
/*
 * @ignore
 */
CustomVideoSource = 6,
/*
 * @ignore
 */
MediaPlayerSource = 7,
/*
 * @ignore
 */
RtcImagePngSource = 8,
/*
 * @ignore
 */
RtcImageJpegSource = 9,
/*
 * @ignore
 */
RtcImageGifSource = 10,
/*
 * @ignore
 */
RemoteVideoSource = 11,
/*
 * @ignore
 */
TranscodedVideoSource = 12,
/*
 * @ignore
 */
UnknownMediaSource = 100,
}

/*
 * @ignore
 */
export class PacketOptions {
/*
 * @ignore
 */
  timestamp?: number
  /*
   * @ignore
   */
  audioLevelIndication?: number
}

/*
 * The number of channels for audio preprocessing.
 * In scenarios that require enhanced realism, such as concerts, local users might need to capture stereo audio and send stereo signals to remote users. For example, the singer, guitarist, and drummer are standing in different positions on the stage. The audio capture device captures their stereo audio and sends stereo signals to remote users. Remote users can hear the song, guitar, and drum from different directions as if they were at the auditorium.
 * You can set the dual-channel processing to implement stereo audio in this class. Agora recommends the following settings:
 * Preprocessing: call setAdvancedAudioOptions and set audioProcessingChannels to AdvancedAudioOptions (2) in AudioProcessingStereo.
 * Post-processing: call setAudioProfile and set profile to AudioProfileMusicStandardStereo (3) or AudioProfileMusicHighQualityStereo (5). 
 * The stereo setting only takes effect when the SDK uses the media volume.
 */
export enum AudioProcessingChannels {
/*
 * 1: (Default) Mono.
 */
AudioProcessingMono = 1,
/*
 * 2: Stereo (two channels).
 */
AudioProcessingStereo = 2,
}

/*
 * The advanced options for audio.
 */
export class AdvancedAudioOptions {
/*
 * The number of channels for audio preprocessing. See AudioProcessingChannels .
 */
  audioProcessingChannels?: AudioProcessingChannels
}

/*
 * @ignore
 */
export class AudioEncodedFrameInfo {
/*
 * @ignore
 */
  sendTs?: number
  /*
   * @ignore
   */
  codec?: number
}

/*
 * @ignore
 */
export class AudioPcmFrame {
/*
 * @ignore
 */
  capture_timestamp?: number
  /*
   * @ignore
   */
  samples_per_channel_?: number
  /*
   * @ignore
   */
  sample_rate_hz_?: number
  /*
   * @ignore
   */
  num_channels_?: number
  /*
   * @ignore
   */
  bytes_per_sample?: BytesPerSample
  /*
   * @ignore
   */
  data_?: number[]
}

/*
 * The channel mode.
 */
export enum AudioDualMonoMode {
/*
 * 0: Original mode.
 */
AudioDualMonoStereo = 0,
/*
 * 1: Left channel mode. This mode replaces the audio of the right channel with the audio of the left channel, which means the user can only hear the audio of the left channel.
 */
AudioDualMonoL = 1,
/*
 * 2: Right channel mode. This mode replaces the audio of the left channel with the audio of the right channel, which means the user can only hear the audio of the right channel.
 */
AudioDualMonoR = 2,
/*
 * 3: Mixed channel mode. This mode mixes the audio of the left channel and the right channel, which means the user can hear the audio of the left channel and the right channel at the same time.
 */
AudioDualMonoMix = 3,
}

/*
 * @ignore
 */
export enum VideoPixelFormat {
/*
 * @ignore
 */
VideoPixelUnknown = 0,
/*
 * @ignore
 */
VideoPixelI420 = 1,
/*
 * @ignore
 */
VideoPixelBgra = 2,
/*
 * @ignore
 */
VideoPixelNv21 = 3,
/*
 * @ignore
 */
VideoPixelRgba = 4,
/*
 * @ignore
 */
VideoPixelNv12 = 8,
/*
 * @ignore
 */
VideoTexture2d = 10,
/*
 * @ignore
 */
VideoTextureOes = 11,
/*
 * @ignore
 */
VideoPixelI422 = 16,
}

/*
 * Video display modes.
 */
export enum RenderModeType {
/*
 * 1: Uniformly scale the video until one of its dimension fits the boundary (zoomed to fit). The window is filled. One dimension of the video might have clipped contents.
 */
RenderModeHidden = 1,
/*
 * 2: Uniformly scale the video until one of its dimension fits the boundary (zoomed to fit). Priority is to ensuring that all video content is displayed. Areas that are not filled due to disparity in the aspect ratio are filled with black.
 */
RenderModeFit = 2,
/*
 * @ignore
 */
RenderModeAdaptive = 3,
}

/*
 * @ignore
 */
export enum EglContextType {
/*
 * @ignore
 */
EglContext10 = 0,
/*
 * @ignore
 */
EglContext14 = 1,
}

/*
 * The video buffer type.
 */
export enum VideoBufferType {
/*
 * 1: The video buffer in the format of raw data.
 */
VideoBufferRawData = 1,
/*
 * @ignore
 */
VideoBufferArray = 2,
/*
 * @ignore
 */
VideoBufferTexture = 3,
}

/*
 * @ignore
 */
export enum MediaPlayerSourceType {
/*
 * @ignore
 */
MediaPlayerSourceDefault = 0,
/*
 * @ignore
 */
MediaPlayerSourceFullFeatured = 1,
/*
 * @ignore
 */
MediaPlayerSourceSimple = 2,
}

/*
 * @ignore
 */
export enum VideoModulePosition {
/*
 * @ignore
 */
PositionPostCapturer = 1 << 0,
/*
 * @ignore
 */
PositionPreRenderer = 1 << 1,
/*
 * @ignore
 */
PositionPreEncoder = 1 << 2,
/*
 * @ignore
 */
PositionPostFilters = 1 << 3,
}

/*
 * Audio frame type.
 */
export enum AudioFrameType {
/*
 * 0: PCM 16
 */
FrameTypePcm16 = 0,
}

/*
 * @ignore
 */
export class AudioSpectrumData {
/*
 * @ignore
 */
  audioSpectrumData?: number[]
  /*
   * @ignore
   */
  dataLength?: number
}

/*
 * @ignore
 */
export class UserAudioSpectrumInfo {
/*
 * @ignore
 */
  uid?: number
  /*
   * @ignore
   */
  spectrumData?: AudioSpectrumData
}

/*
 * @ignore
 */
export enum VideoFrameProcessMode {
/*
 * @ignore
 */
ProcessModeReadOnly = 0,
/*
 * @ignore
 */
ProcessModeReadWrite = 1,
}

/*
 * @ignore
 */
export enum ContentInspectResult {
/*
 * @ignore
 */
ContentInspectNeutral = 1,
/*
 * @ignore
 */
ContentInspectSexy = 2,
/*
 * @ignore
 */
ContentInspectPorn = 3,
}

/*
 * @ignore
 */
export enum ContentInspectDeviceType {
/*
 * @ignore
 */
ContentInspectDeviceInvalid = 0,
/*
 * @ignore
 */
ContentInspectDeviceAgora = 1,
/*
 * @ignore
 */
ContentInspectDeviceHive = 2,
/*
 * @ignore
 */
ContentInspectDeviceTupu = 3,
}

/*
 * @ignore
 */
export enum ContentInspectType {
/*
 * @ignore
 */
ContentInspectInvalide = 0,
/*
 * @ignore
 */
ContentInspectModeration = 1,
/*
 * @ignore
 */
ContentInspectSupervise = 2,
}

/*
 * @ignore
 */
export class ContentInspectModule {
/*
 * @ignore
 */
  type?: ContentInspectType
  /*
   * @ignore
   */
  frequency?: number
}

/*
 * @ignore
 */
export class ContentInspectConfig {
/*
 * @ignore
 */
  enable?: boolean
  /*
   * @ignore
   */
  DeviceWork?: boolean
  /*
   * @ignore
   */
  CloudWork?: boolean
  /*
   * @ignore
   */
  DeviceworkType?: ContentInspectDeviceType
  /*
   * @ignore
   */
  extraInfo?: string
  /*
   * @ignore
   */
  modules?: ContentInspectModule[]
  /*
   * @ignore
   */
  moduleCount?: number
}

/*
 * @ignore
 */
export class SnapShotConfig {
/*
 * @ignore
 */
  channel?: string
  /*
   * @ignore
   */
  uid?: number
  /*
   * @ignore
   */
  filePath?: string
}

/*
 * The external video frame encoding type.
 */
export enum ExternalVideoSourceType {
/*
 * 0: The video frame is not encoded.
 */
VideoFrame = 0,
/*
 * 1: The video frame is encoded.
 */
EncodedVideoFrame = 1,
}
