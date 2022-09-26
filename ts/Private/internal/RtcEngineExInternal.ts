import { CallBackModule, Channel } from '../../Types';
import { AgoraEnv, logDebug, logError, logWarn } from '../../Utils';
import {
  AudioEncodedFrameObserverConfig,
  AudioRecordingConfiguration,
  ClientRoleOptions,
  ClientRoleType,
  DataStreamConfig,
  ErrorCodeType,
  IAudioEncodedFrameObserver,
  SimulcastStreamConfig,
  VideoCanvas,
  VideoMirrorModeType,
  VideoSourceType,
  WatermarkOptions,
} from '../AgoraBase';
import { IAudioSpectrumObserver } from '../AgoraMediaBase';
import { IMediaEngine } from '../IAgoraMediaEngine';
import { IMediaPlayer } from '../IAgoraMediaPlayer';
import { IMediaRecorder } from '../IAgoraMediaRecorder';
import {
  ChannelMediaOptions,
  DirectCdnStreamingMediaOptions,
  IDirectCdnStreamingEventHandler,
  IMetadataObserver,
  IRtcEngineEventHandler,
  IVideoDeviceManager,
  LeaveChannelOptions,
  Metadata,
  MetadataType,
  RtcEngineContext,
  ScreenCaptureSourceInfo,
  SDKBuildInfo,
  Size,
} from '../IAgoraRtcEngine';
import { RtcConnection } from '../IAgoraRtcEngineEx';
import { IAudioDeviceManager } from '../IAudioDeviceManager';
import { IRtcEngineExImpl } from '../impl/IAgoraRtcEngineExImpl';
import {
  callIrisApi,
  DeviceEventEmitter,
  EVENT_TYPE,
  getBridge,
  handleEvent,
} from './IrisApiEngine';
import { MediaEngineInternal } from './MediaEngineInternal';
import { MediaPlayerInternal } from './MediaPlayerInternal';
import { MediaRecorderInternal } from './MediaRecorderInternal';
import { ILocalSpatialAudioEngine } from '../IAgoraSpatialAudio';
import { LocalSpatialAudioEngineInternal } from './LocalSpatialAudioEngineInternal';
import { IAudioDeviceManagerImpl } from '../impl/IAudioDeviceManagerImpl';
import {
  processIDirectCdnStreamingEventHandler,
  processIMetadataObserver,
  IVideoDeviceManagerImpl,
  processIRtcEngineEventHandler,
} from '../impl/IAgoraRtcEngineImpl';
import { IRtcEngineEvent } from '../extension/IAgoraRtcEngineExtension';
import { processIAudioEncodedFrameObserver } from '../impl/AgoraBaseImpl';
import { processIAudioSpectrumObserver } from '../impl/AgoraMediaBaseImpl';

export class RtcEngineExInternal extends IRtcEngineExImpl {
  static _handlers: (
    | IRtcEngineEventHandler
    | IDirectCdnStreamingEventHandler
    | IMetadataObserver
  )[] = [];
  static _audio_encoded_frame_observers: IAudioEncodedFrameObserver[] = [];
  static _audio_spectrum_observers: IAudioSpectrumObserver[] = [];
  private readonly eventKey: string;
  private _audio_device_manager: IAudioDeviceManager =
    new IAudioDeviceManagerImpl();
  private _video_device_manager: IVideoDeviceManager =
    new IVideoDeviceManagerImpl();
  private _media_engine: IMediaEngine = new MediaEngineInternal();
  private _media_recorder: IMediaRecorder = new MediaRecorderInternal();
  private _local_spatial_audio_engine: ILocalSpatialAudioEngine =
    new LocalSpatialAudioEngineInternal();
  private _events: Map<
    any,
    { eventType: string; listener: (...args: any[]) => any }
  > = new Map<any, { eventType: string; listener: (...args: any[]) => any }>();

  constructor() {
    super();
    if (AgoraEnv.isInitializeEngine) {
      logError('initialize: already initialize rtcEngine');
    }

    logDebug('AgoraRtcEngine constructor()');
    this.eventKey = 'call_back_with_buffer';
  }

  initialize(context: RtcEngineContext): number {
    if (AgoraEnv.isInitializeEngine) {
      logWarn('initialize: already initialize rtcEngine');
      return -ErrorCodeType.ErrNotInitialized;
    }
    AgoraEnv.isInitializeEngine = true;
    const bridge = getBridge();
    bridge.InitializeEnv();
    bridge.OnEvent(CallBackModule.RTC, this.eventKey, handleEvent);
    bridge.OnEvent(CallBackModule.MPK, this.eventKey, handleEvent);
    bridge.OnEvent(CallBackModule.OBSERVER, this.eventKey, handleEvent);
    AgoraEnv.AgoraRendererManager?.enableRender();
    const ret = super.initialize(context);
    callIrisApi.call(this, 'RtcEngine_setAppType', {
      appType: 3,
    });
    return ret;
  }

  release(sync: boolean = false) {
    if (!AgoraEnv.isInitializeEngine) {
      logWarn('release: rtcEngine have not initialize');
      return;
    }
    this._audio_device_manager.release();
    this._video_device_manager.release();
    this._media_engine.release();
    this._media_recorder.release();
    this._local_spatial_audio_engine.release();
    RtcEngineExInternal._handlers = [];
    RtcEngineExInternal._audio_encoded_frame_observers = [];
    RtcEngineExInternal._audio_spectrum_observers = [];
    MediaPlayerInternal._source_observers.clear();
    MediaPlayerInternal._audio_frame_observers.clear();
    MediaPlayerInternal._video_frame_observers.clear();
    MediaPlayerInternal._audio_spectrum_observers.clear();
    this._events.forEach((value) => {
      DeviceEventEmitter.removeListener(value.eventType, value.listener);
    });
    this._events.clear();
    AgoraEnv.AgoraRendererManager?.enableRender(false);
    AgoraEnv.isInitializeEngine = false;
    super.release(sync);
    getBridge().ReleaseEnv();
  }

  addListener<EventType extends keyof IRtcEngineEvent>(
    eventType: EventType,
    listener: IRtcEngineEvent[EventType]
  ): void {
    const callback = (...data: any[]) => {
      if (data[0] !== EVENT_TYPE.IRtcEngine) {
        return;
      }
      processIRtcEngineEventHandler(
        { [eventType]: listener },
        eventType,
        data[1]
      );
      processIDirectCdnStreamingEventHandler(
        { [eventType]: listener },
        eventType,
        data[1]
      );
      processIMetadataObserver({ [eventType]: listener }, eventType, data[1]);
      processIAudioEncodedFrameObserver(
        { [eventType]: listener },
        eventType,
        data[1]
      );
      processIAudioSpectrumObserver(
        { [eventType]: listener },
        eventType,
        data[1]
      );
    };
    this._events.set(listener, { eventType, listener: callback });
    DeviceEventEmitter.addListener(eventType, callback);
  }

  removeListener<EventType extends keyof IRtcEngineEvent>(
    eventType: EventType,
    listener: IRtcEngineEvent[EventType]
  ) {
    if (!this._events.has(listener)) return;
    DeviceEventEmitter.removeListener(
      eventType,
      this._events.get(listener)!.listener
    );
  }

  removeAllListeners<EventType extends keyof IRtcEngineEvent>(
    eventType?: EventType
  ) {
    DeviceEventEmitter.removeAllListeners(eventType);
  }

  getVersion(): SDKBuildInfo {
    const ret: any = super.getVersion();
    return {
      build: ret.build,
      version: ret.result,
    };
  }

  registerEventHandler(eventHandler: IRtcEngineEventHandler): boolean {
    if (
      !RtcEngineExInternal._handlers.find((value) => value === eventHandler)
    ) {
      RtcEngineExInternal._handlers.push(eventHandler);
    }
    return super.registerEventHandler(eventHandler);
  }

  unregisterEventHandler(eventHandler: IRtcEngineEventHandler): boolean {
    RtcEngineExInternal._handlers = RtcEngineExInternal._handlers.filter(
      (value) => value !== eventHandler
    );
    return super.unregisterEventHandler(eventHandler);
  }

  createMediaPlayer(): IMediaPlayer {
    if (!AgoraEnv.isInitializeEngine) {
      logError('createMediaPlayer: rtcEngine have not initialize');
    }
    // @ts-ignore
    const mediaPlayerId = super.createMediaPlayer() as number;
    return new MediaPlayerInternal(mediaPlayerId);
  }

  destroyMediaPlayer(mediaPlayer: IMediaPlayer): number {
    const ret = super.destroyMediaPlayer(mediaPlayer);
    mediaPlayer.release?.call(mediaPlayer);
    return ret;
  }

  startDirectCdnStreaming(
    eventHandler: IDirectCdnStreamingEventHandler,
    publishUrl: string,
    options: DirectCdnStreamingMediaOptions
  ): number {
    if (
      !RtcEngineExInternal._handlers.find((value) => value === eventHandler)
    ) {
      RtcEngineExInternal._handlers.push(eventHandler);
    }
    return super.startDirectCdnStreaming(eventHandler, publishUrl, options);
  }

  registerMediaMetadataObserver(
    observer: IMetadataObserver,
    type: MetadataType
  ): number {
    if (!RtcEngineExInternal._handlers.find((value) => value === observer)) {
      RtcEngineExInternal._handlers.push(observer);
    }
    return super.registerMediaMetadataObserver(observer, type);
  }

  unregisterMediaMetadataObserver(
    observer: IMetadataObserver,
    type: MetadataType
  ): number {
    RtcEngineExInternal._handlers = RtcEngineExInternal._handlers.filter(
      (value) => value !== observer
    );
    return super.unregisterMediaMetadataObserver(observer, type);
  }

  protected getApiTypeFromJoinChannel(
    token: string,
    channelId: string,
    uid: number,
    options: ChannelMediaOptions
  ): string {
    return 'RtcEngine_joinChannel2';
  }

  protected getApiTypeFromLeaveChannel(options?: LeaveChannelOptions): string {
    return options === undefined
      ? 'RtcEngine_leaveChannel'
      : 'RtcEngine_leaveChannel2';
  }

  protected getApiTypeFromSetClientRole(
    role: ClientRoleType,
    options?: ClientRoleOptions
  ): string {
    return options === undefined
      ? 'RtcEngine_setClientRole'
      : 'RtcEngine_setClientRole2';
  }

  protected getApiTypeFromStartEchoTest(
    intervalInSeconds: number = 10
  ): string {
    return 'RtcEngine_startEchoTest2';
  }

  protected getApiTypeFromStartPreview(
    sourceType: VideoSourceType = VideoSourceType.VideoSourceCameraPrimary
  ): string {
    return 'RtcEngine_startPreview2';
  }

  protected getApiTypeFromStopPreview(
    sourceType: VideoSourceType = VideoSourceType.VideoSourceCameraPrimary
  ): string {
    return 'RtcEngine_stopPreview2';
  }

  protected getApiTypeFromStartAudioRecording(
    config: AudioRecordingConfiguration
  ): string {
    return 'RtcEngine_startAudioRecording3';
  }

  protected getApiTypeFromStartAudioMixing(
    filePath: string,
    loopback: boolean,
    cycle: number,
    startPos: number = 0
  ): string {
    return 'RtcEngine_startAudioMixing2';
  }

  protected getApiTypeFromEnableDualStreamMode(
    enabled: boolean,
    sourceType: VideoSourceType = VideoSourceType.VideoSourceCameraPrimary,
    streamConfig?: SimulcastStreamConfig
  ): string {
    return streamConfig === undefined
      ? 'RtcEngine_enableDualStreamMode2'
      : 'RtcEngine_enableDualStreamMode3';
  }

  protected getApiTypeFromCreateDataStream(config: DataStreamConfig): string {
    return 'RtcEngine_createDataStream2';
  }

  protected getApiTypeFromAddVideoWatermark(
    watermarkUrl: string,
    options: WatermarkOptions
  ): string {
    return 'RtcEngine_addVideoWatermark2';
  }

  protected getApiTypeFromJoinChannelWithUserAccount(
    token: string,
    channelId: string,
    userAccount: string,
    options?: ChannelMediaOptions
  ): string {
    return options === undefined
      ? 'RtcEngine_joinChannelWithUserAccount'
      : 'RtcEngine_joinChannelWithUserAccount2';
  }

  protected getApiTypeFromCreateDataStreamEx(
    config: DataStreamConfig,
    connection: RtcConnection
  ): string {
    return 'RtcEngineEx_createDataStreamEx2';
  }

  getAudioDeviceManager(): IAudioDeviceManager {
    return this._audio_device_manager;
  }

  getVideoDeviceManager(): IVideoDeviceManager {
    return this._video_device_manager;
  }

  getMediaEngine(): IMediaEngine {
    return this._media_engine;
  }

  getMediaRecorder(): IMediaRecorder {
    return this._media_recorder;
  }

  getLocalSpatialAudioEngine(): ILocalSpatialAudioEngine {
    return this._local_spatial_audio_engine;
  }

  registerAudioEncodedFrameObserver(
    config: AudioEncodedFrameObserverConfig,
    observer: IAudioEncodedFrameObserver
  ): number {
    if (
      !RtcEngineExInternal._audio_encoded_frame_observers.find(
        (value) => value === observer
      )
    ) {
      RtcEngineExInternal._audio_encoded_frame_observers.push(observer);
    }
    return super.registerAudioEncodedFrameObserver(config, observer);
  }

  unregisterAudioEncodedFrameObserver(
    observer: IAudioEncodedFrameObserver
  ): number {
    RtcEngineExInternal._audio_encoded_frame_observers =
      RtcEngineExInternal._audio_encoded_frame_observers.filter(
        (value) => value !== observer
      );
    return super.unregisterAudioEncodedFrameObserver(observer);
  }

  registerAudioSpectrumObserver(observer: IAudioSpectrumObserver): number {
    if (
      !RtcEngineExInternal._audio_spectrum_observers.find(
        (value) => value === observer
      )
    ) {
      RtcEngineExInternal._audio_spectrum_observers.push(observer);
    }
    return super.registerAudioSpectrumObserver(observer);
  }

  unregisterAudioSpectrumObserver(observer: IAudioSpectrumObserver): number {
    RtcEngineExInternal._audio_spectrum_observers =
      RtcEngineExInternal._audio_spectrum_observers.filter(
        (value) => value !== observer
      );
    return super.unregisterAudioSpectrumObserver(observer);
  }

  getScreenCaptureSources(
    thumbSize: Size,
    iconSize: Size,
    includeScreen: boolean
  ): ScreenCaptureSourceInfo[] {
    return super
      .getScreenCaptureSources(thumbSize, iconSize, includeScreen)
      .map((value: any) => {
        if (value.thumbImage.buffer == 0) {
          value.thumbImage.buffer = undefined;
        } else {
          value.thumbImage.buffer = getBridge().GetBuffer(
            value.thumbImage.buffer,
            value.thumbImage?.length
          );
        }
        if (value.iconImage.buffer == 0) {
          value.iconImage.buffer = undefined;
        } else {
          value.iconImage.buffer = getBridge().GetBuffer(
            value.iconImage.buffer,
            value.iconImage.length
          );
        }
        return value;
      });
  }

  setupLocalVideo(canvas: VideoCanvas): number {
    const {
      sourceType = VideoSourceType.VideoSourceCamera,
      uid,
      view,
      renderMode,
      mirrorMode,
    } = canvas;
    return (
      AgoraEnv.AgoraRendererManager?.setupLocalVideo({
        videoSourceType: sourceType,
        channelId: '',
        uid,
        view,
        rendererOptions: {
          contentMode: renderMode,
          mirror: mirrorMode === VideoMirrorModeType.VideoMirrorModeEnabled,
        },
      }) ?? -ErrorCodeType.ErrNotInitialized
    );
  }

  setupRemoteVideo(canvas: VideoCanvas): number {
    const {
      sourceType = VideoSourceType.VideoSourceRemote,
      uid,
      view,
      renderMode,
      mirrorMode,
    } = canvas;
    return (
      AgoraEnv.AgoraRendererManager?.setupRemoteVideo({
        videoSourceType: sourceType,
        channelId: '',
        uid,
        view,
        rendererOptions: {
          contentMode: renderMode,
          mirror: mirrorMode === VideoMirrorModeType.VideoMirrorModeEnabled,
        },
      }) ?? -ErrorCodeType.ErrNotInitialized
    );
  }

  setupRemoteVideoEx(canvas: VideoCanvas, connection: RtcConnection): number {
    const {
      sourceType = VideoSourceType.VideoSourceRemote,
      uid,
      view,
      renderMode,
      mirrorMode,
    } = canvas;
    const { channelId } = connection;
    return (
      AgoraEnv.AgoraRendererManager?.setupRemoteVideo({
        videoSourceType: sourceType,
        channelId,
        uid,
        view,
        rendererOptions: {
          contentMode: renderMode,
          mirror: mirrorMode === VideoMirrorModeType.VideoMirrorModeEnabled,
        },
      }) ?? -ErrorCodeType.ErrNotInitialized
    );
  }

  sendStreamMessage(
    streamId: number,
    data: Uint8Array,
    length: number
  ): number {
    const apiType = 'RtcEngine_sendStreamMessage';
    const jsonParams = {
      streamId,
      length,
      toJSON: () => {
        return {
          streamId,
          length,
        };
      },
    };

    if (!data) return ErrorCodeType.ErrInvalidArgument;

    let bufferArray = [data];
    const jsonResults = callIrisApi.call(
      this,
      apiType,
      jsonParams,
      bufferArray,
      bufferArray.length
    );
    return jsonResults.result;
  }

  destroyRendererByView(view: any) {
    AgoraEnv.AgoraRendererManager?.destroyRendererByView(view);
  }

  destroyRendererByConfig(
    videoSourceType: VideoSourceType,
    channelId?: Channel,
    uid?: number
  ) {
    AgoraEnv.AgoraRendererManager?.destroyRenderersByConfig(
      videoSourceType,
      channelId,
      uid
    );
  }

  sendMetaData(metadata: Metadata, sourceType: VideoSourceType): number {
    const apiType = 'RtcEngine_sendMetaData';
    const jsonParams = {
      metadata,
      source_type: sourceType,
      toJSON: () => {
        return {
          metadata,
          source_type: sourceType,
        };
      },
    };

    if (!metadata.buffer) return ErrorCodeType.ErrInvalidArgument;

    let bufferArray = [metadata.buffer!];
    metadata.buffer = undefined;

    const jsonResults = callIrisApi.call(
      this,
      apiType,
      jsonParams,
      bufferArray,
      bufferArray.length
    );

    return jsonResults.result;
  }
}
