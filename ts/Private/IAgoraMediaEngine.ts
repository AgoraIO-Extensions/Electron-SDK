import './extension/IAgoraMediaEngineExtension';
import {
  AudioTrackConfig,
  AudioTrackType,
  EncodedVideoFrameInfo,
  LoopbackAudioTrackConfig,
  SenderOptions,
} from './AgoraBase';
import {
  AudioFrame,
  ExternalVideoFrame,
  ExternalVideoSourceType,
  IAudioFrameObserver,
  IFaceInfoObserver,
  IVideoEncodedFrameObserver,
  IVideoFrameObserver,
} from './AgoraMediaBase';

/**
 * Channel mode.
 */
export enum AudioMixingDualMonoMode {
  /**
   * @ignore
   */
  AudioMixingDualMonoAuto = 0,
  /**
   * 1: Left channel mode. This mode replaces the right channel audio with the left channel audio, so the user hears only the left channel.
   */
  AudioMixingDualMonoL = 1,
  /**
   * 2: Right channel mode. This mode replaces the left channel audio with the right channel audio, so the user hears only the right channel.
   */
  AudioMixingDualMonoR = 2,
  /**
   * 3: Mixed mode. This mode overlays the left and right channel data, so the user hears both the left and right channels simultaneously.
   */
  AudioMixingDualMonoMix = 3,
}

/**
 * The IMediaEngine class.
 */
export abstract class IMediaEngine {
  /**
   * Registers an audio frame observer object.
   *
   * This method registers an audio frame observer object, i.e., registers callbacks. You need to call this method to register callbacks if you want the SDK to trigger the onMixedAudioFrame, onRecordAudioFrame, onPlaybackAudioFrame, onPlaybackAudioFrameBeforeMixing, and onEarMonitoringAudioFrame callbacks.
   *
   * @param observer Instance of the interface object. See IAudioFrameObserver. It is recommended to call this after receiving onLeaveChannel to release the audio frame observer object.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract registerAudioFrameObserver(observer: IAudioFrameObserver): number;

  /**
   * Registers a raw video frame observer object.
   *
   * If you want to observe raw video frames (such as YUV or RGBA format), Agora recommends registering an IVideoFrameObserver class using this method.
   * When registering the video observer, you can choose to register callbacks from the IVideoFrameObserver class as needed. Once registered successfully, the SDK triggers the registered callbacks whenever a video frame is captured. When handling callbacks, you need to consider changes in the width and height parameters of the video frame, as the observed video frame may vary due to the following conditions:
   *  When the network condition is poor, the resolution may drop in steps.
   *  When the user adjusts the resolution manually, the resolution reported in the callback will also change.
   *
   * @param observer Instance of the interface object. See IVideoFrameObserver.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract registerVideoFrameObserver(observer: IVideoFrameObserver): number;

  /**
   * Registers a video frame observer for encoded video frames.
   *
   * If you only want to observe encoded video frames (e.g., H.264 format) and do not need to decode or render them, Agora recommends using this method to register an IVideoEncodedFrameObserver class. This method must be called before joining a channel.
   *
   * @param observer Video frame observer. See IVideoEncodedFrameObserver.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract registerVideoEncodedFrameObserver(
    observer: IVideoEncodedFrameObserver
  ): number;

  /**
   * Registers a face information observer.
   *
   * You can call this method to register the onFaceInfo callback to obtain face information processed by the Agora voice driver plugin. When registering a face information observer using this method, you can register the callbacks in the IFaceInfoObserver class as needed. After successful registration, the SDK triggers the registered callback when face information converted by the voice driver plugin is detected.
   *  This method must be called before joining a channel.
   *  Before calling this method, make sure you have called enableExtension to enable the voice driver plugin.
   *
   * @param observer The face information observer. See IFaceInfoObserver.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract registerFaceInfoObserver(observer: IFaceInfoObserver): number;

  /**
   * Pushes external audio frames.
   *
   * Call this method to push external audio frames through an audio track.
   *
   * @param frame The external audio frame. See AudioFrame.
   * @param trackId The audio track ID. If you want to publish a custom external audio source, set this parameter to the custom audio track ID you want to publish.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract pushAudioFrame(frame: AudioFrame, trackId?: number): number;

  /**
   * Pulls remote audio data.
   *
   * After calling this method, the app actively pulls the decoded and mixed remote audio data for audio playback. This method and the onPlaybackAudioFrame callback can both be used to obtain the mixed remote audio playback data. After calling setExternalAudioSink to enable external audio rendering, the app will no longer receive data from the onPlaybackAudioFrame callback. Therefore, choose between this method and the onPlaybackAudioFrame callback based on your actual business needs. The two have different handling mechanisms. The differences are as follows:
   *  After calling this method, the app actively pulls audio data. By setting the audio data, the SDK can adjust the buffer to help the app handle latency, effectively avoiding audio playback jitter.
   *  After registering the onPlaybackAudioFrame callback, the SDK delivers audio data to the app through the callback. When the app handles audio frame latency, it may cause audio playback jitter. This method is only used to pull mixed remote audio playback data. To obtain the original captured audio data, or the original playback data of each stream before mixing, call registerAudioFrameObserver to register the corresponding callback.
   *
   * @returns
   * If the method call succeeds, returns an AudioFrame object.
   *  If the method call fails, returns an error code.
   */
  abstract pullAudioFrame(frame: AudioFrame): number;

  /**
   * Sets the external video source.
   *
   * After calling this method to enable the external video source, you can call pushVideoFrame to push external video data to the SDK. Dynamic switching of video sources within a channel is not supported. If you have enabled the external video source and joined a channel, to switch to the internal video source, you must leave the channel first, then call this method to disable the external video source, and rejoin the channel.
   *
   * @param enabled Whether to enable the external video source: true : Enable the external video source. The SDK is ready to receive external video frames. false : (Default) Do not enable the external video source.
   * @param useTexture Whether to use external video frames in Texture format: true : Use external video frames in Texture format. false : Do not use external video frames in Texture format.
   * @param sourceType Whether the external video frame is encoded. See ExternalVideoSourceType.
   * @param encodedVideoOption Video encoding options. If sourceType is EncodedVideoFrame, you need to set this parameter. You can [contact technical support](https://ticket.shengwang.cn/) to learn how to configure this parameter.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setExternalVideoSource(
    enabled: boolean,
    useTexture: boolean,
    sourceType?: ExternalVideoSourceType,
    encodedVideoOption?: SenderOptions
  ): number;

  /**
   * Sets external audio capture parameters.
   *
   * Deprecated Deprecated: This method is deprecated. Use createCustomAudioTrack instead.
   *
   * @param enabled Whether to enable the use of external audio sources: true : Enable external audio source. false : (Default) Disable external audio source.
   * @param sampleRate Sampling rate (Hz) of the external audio source. Can be set to 8000, 16000, 32000, 44100, or 48000.
   * @param channels Number of channels of the external audio source. Can be set to 1 (mono) or 2 (stereo).
   * @param localPlayback Whether to play the external audio source locally: true : Play locally. false : (Default) Do not play locally.
   * @param publish Whether to publish the audio to the remote end: true : (Default) Publish to remote. false : Do not publish to remote.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setExternalAudioSource(
    enabled: boolean,
    sampleRate: number,
    channels: number,
    localPlayback?: boolean,
    publish?: boolean
  ): number;

  /**
   * Creates a custom audio capture track.
   *
   * To publish custom captured audio in a channel, follow these steps:
   *  Call this method to create an audio track and obtain the audio track ID.
   *  When calling joinChannel to join a channel, set publishCustomAudioTrackId in ChannelMediaOptions to the audio track ID you want to publish, and set publishCustomAudioTrack to true.
   *  Call pushAudioFrame and set trackId to the audio track ID specified in step 2 to publish the corresponding custom audio source in the channel. This method must be called before joining a channel.
   *
   * @param trackType Custom audio track type. See AudioTrackType. If AudioTrackDirect is specified, you must set publishMicrophoneTrack in ChannelMediaOptions to false when calling joinChannel, otherwise joining the channel will fail and return error code -2.
   * @param config Custom audio track configuration. See AudioTrackConfig.
   *
   * @returns
   * If the method call succeeds, returns the audio track ID as the unique identifier of the audio track.
   *  If the method call fails, returns 0xffffffff. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract createCustomAudioTrack(
    trackType: AudioTrackType,
    config: AudioTrackConfig
  ): number;

  /**
   * Destroys the specified audio track.
   *
   * @param trackId Custom audio track ID returned by the createCustomAudioTrack method.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract destroyCustomAudioTrack(trackId: number): number;

  /**
   * Sets external audio rendering.
   *
   * After calling this method to enable external audio rendering, you can call pullAudioFrame to pull remote audio data. The app can process the pulled raw audio data before rendering to achieve the desired audio effect. After calling this method to enable external audio rendering, the app will no longer receive data from the onPlaybackAudioFrame callback.
   *
   * @param enabled Whether to enable external audio rendering: true : Enable external audio rendering. false : (Default) Disable external audio rendering.
   * @param sampleRate The sample rate (Hz) for external audio rendering. Can be set to 16000, 32000, 44100, or 48000.
   * @param channels The number of channels for external audio rendering:
   *  1: Mono
   *  2: Stereo
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setExternalAudioSink(
    enabled: boolean,
    sampleRate: number,
    channels: number
  ): number;

  /**
   * @ignore
   */
  abstract enableCustomAudioLocalPlayback(
    trackId: number,
    enabled: boolean
  ): number;

  /**
   * Publishes external raw video frames to the channel through a custom video track.
   *
   * When you need to publish a custom captured video in the channel, follow these steps:
   *  Call createCustomVideoTrack to create a video track and get the video track ID.
   *  When calling joinChannel to join the channel, set customVideoTrackId in ChannelMediaOptions to the video track ID you want to publish, and set publishCustomVideoTrack to true.
   *  Call this method and specify videoTrackId as the video track ID from step 2 to publish the corresponding custom video source in the channel. After calling this method, even if you stop pushing external video frames to the SDK, the custom captured video stream will still be counted in video duration usage and incur charges. Agora recommends taking appropriate actions based on your actual needs to avoid such video billing:
   *  If you no longer need to capture external video data, call destroyCustomVideoTrack to destroy the custom captured video track.
   *  If you only want to use the captured external video data for local preview and not publish it in the channel, call muteLocalVideoStream to stop sending the video stream, or call updateChannelMediaOptions and set publishCustomVideoTrack to false.
   *
   * @param frame The video frame to be pushed. See ExternalVideoFrame.
   * @param videoTrackId The video track ID returned by the createCustomVideoTrack method. If you only need to push a single external video stream, set videoTrackId to 0.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract pushVideoFrame(
    frame: ExternalVideoFrame,
    videoTrackId?: number
  ): number;

  /**
   * @ignore
   */
  abstract pushEncodedVideoImage(
    imageBuffer: Uint8Array,
    length: number,
    videoEncodedFrameInfo: EncodedVideoFrameInfo,
    videoTrackId?: number
  ): number;

  /**
   * @ignore
   */
  abstract createLoopbackAudioTrack(config: LoopbackAudioTrackConfig): number;

  /**
   * @ignore
   */
  abstract destroyLoopbackAudioTrack(trackId: number): number;

  /**
   * @ignore
   */
  abstract updateLoopbackAudioTrackConfig(
    trackId: number,
    config: LoopbackAudioTrackConfig
  ): number;

  /**
   * @ignore
   */
  abstract release(): void;

  /**
   * Unregisters the audio frame observer.
   *
   * @param observer The audio frame observer that monitors each received audio frame. See IAudioFrameObserver.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and troubleshooting.
   */
  abstract unregisterAudioFrameObserver(observer: IAudioFrameObserver): number;

  /**
   * Unregisters the video frame observer.
   *
   * @param observer The video frame observer that observes the reception of each video frame. See IVideoFrameObserver.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract unregisterVideoFrameObserver(observer: IVideoFrameObserver): number;

  /**
   * Unregisters the video frame observer for encoded video frames.
   *
   * @param observer Video frame observer that observes the reception of each video frame. See IVideoEncodedFrameObserver.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract unregisterVideoEncodedFrameObserver(
    observer: IVideoEncodedFrameObserver
  ): number;
}
