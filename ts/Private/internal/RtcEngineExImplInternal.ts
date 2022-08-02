import { CallBackModule, Channel } from "../../Types";
import { AgoraEnv, logDebug, logError, logWarn } from "../../Utils";
import {
  AudioRecordingConfiguration,
  ClientRoleOptions,
  ClientRoleType,
  DataStreamConfig,
  ErrorCodeType,
  SimulcastStreamConfig,
  VideoCanvas,
  VideoMirrorModeType,
  VideoSourceType,
  WatermarkOptions,
} from "../AgoraBase";
import { IMediaPlayer } from "../IAgoraMediaPlayer";
import {
  ChannelMediaOptions,
  DirectCdnStreamingMediaOptions,
  IDirectCdnStreamingEventHandler,
  IVideoDeviceManager,
  LeaveChannelOptions,
  Metadata,
  RtcEngineContext,
  SDKBuildInfo,
  SIZE,
} from "../IAgoraRtcEngine";
import { RtcConnection } from "../IAgoraRtcEngineEx";
import { IAudioDeviceManager } from "../IAudioDeviceManager";
import { IRtcEngineExImpl } from "../impl/IAgoraRtcEngineExImpl";
import { IVideoDeviceManagerImpl } from "../impl/IAgoraRtcEngineImpl";
import { AudioDeviceManagerImplInternal } from "./AudioDeviceManagerImplInternal";
import { callIrisApi, getBridge, handlerRTCEvent } from "./IrisApiEngine";
import { handlerMPKEvent, MediaPlayerInternal } from "./MediaPlayerInternal";

export class RtcEngineExImplInternal extends IRtcEngineExImpl {
  constructor() {
    super();
    if (AgoraEnv.isInitializeEngine) {
      logError("initialize: already initialize rtcEngine");
    }

    logDebug("AgoraRtcEngine constructor()");
  }

  override initialize(context: RtcEngineContext): number {
    if (AgoraEnv.isInitializeEngine) {
      logWarn("initialize: already initialize rtcEngine");
      return -1;
    }
    AgoraEnv.isInitializeEngine = true;
    const bridge = getBridge();
    bridge.InitializeEnv();
    bridge.OnEvent(
      CallBackModule.RTC,
      "call_back_with_buffer",
      handlerRTCEvent
    );
    bridge.OnEvent(
      CallBackModule.MPK,
      "call_back_with_buffer",
      handlerMPKEvent
    );
    AgoraEnv.AgoraRendererManager?.enableRender();
    const ret = super.initialize(context);
    callIrisApi("RtcEngine_setAppType", {
      appType: 3,
    });
    return ret;
  }
  override release(sync = false): void {
    if (!AgoraEnv.isInitializeEngine) {
      logWarn("release: rtcEngine have not initialize");
      return;
    }
    AgoraEnv.AgoraRendererManager?.enableRender(false);
    AgoraEnv.isInitializeEngine = false;
    super.release(sync);
    getBridge().ReleaseEnv();
  }

  override getVersion(): SDKBuildInfo {
    const apiType = "RtcEngine_getVersion";
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return {
      build: jsonResults.build,
      version: jsonResults.result,
    };
  }

  override createMediaPlayer(): IMediaPlayer {
    if (!AgoraEnv.isInitializeEngine) {
      logError("createMediaPlayer: rtcEngine have not initialize");
    }
    // @ts-ignore
    const mediaPlayerId = super.createMediaPlayer() as number;
    return new MediaPlayerInternal(mediaPlayerId);
  }

  override destroyMediaPlayer(mediaPlayer: IMediaPlayer): number {
    const apiType = "RtcEngine_destroyMediaPlayer";
    const jsonParams = {
      playerId: mediaPlayer.getMediaPlayerId(),
    };
    AgoraEnv.mediaPlayerEventManager = AgoraEnv.mediaPlayerEventManager.filter(
      (obj) => obj.mpk !== mediaPlayer
    );
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  override setupLocalVideo(canvas: VideoCanvas): number {
    const { sourceType, uid, view, renderMode, mirrorMode } = canvas;
    AgoraEnv.AgoraRendererManager?.setupLocalVideo({
      videoSourceType: sourceType,
      channelId: "",
      uid,
      view,
      rendererOptions: {
        contentMode: renderMode,
        mirror: mirrorMode === VideoMirrorModeType.VideoMirrorModeEnabled,
      },
    });
    return 0;
  }

  override setupRemoteVideo(canvas: VideoCanvas): number {
    const { sourceType, uid, view, renderMode, mirrorMode } = canvas;
    AgoraEnv.AgoraRendererManager?.setupRemoteVideo({
      videoSourceType: sourceType,
      channelId: "",
      uid,
      view,
      rendererOptions: {
        contentMode: renderMode,
        mirror: mirrorMode === VideoMirrorModeType.VideoMirrorModeEnabled,
      },
    });
    return 0;
  }

  override setupRemoteVideoEx(
    canvas: VideoCanvas,
    connection: RtcConnection
  ): number {
    const { sourceType, uid, view, renderMode, mirrorMode } = canvas;
    const { channelId } = connection;
    AgoraEnv.AgoraRendererManager?.setupRemoteVideo({
      videoSourceType: sourceType,
      channelId,
      uid,
      view,
      rendererOptions: {
        contentMode: renderMode,
        mirror: mirrorMode === VideoMirrorModeType.VideoMirrorModeEnabled,
      },
    });
    return 0;
  }

  override sendStreamMessage(
    streamId: number,
    data: Uint8Array,
    length: number
  ): number {
    const apiType = "RtcEngine_sendStreamMessage";
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

    if (data == null || data == undefined)
      return ErrorCodeType.ErrInvalidArgument;

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

  override startDirectCdnStreaming(
    eventHandler: IDirectCdnStreamingEventHandler,
    publishUrl: string,
    options: DirectCdnStreamingMediaOptions
  ): number {
    const result = AgoraEnv.cdnEventHandlers.filter(
      (handler) => handler === eventHandler
    );
    if (result.length === 0) {
      AgoraEnv.cdnEventHandlers.push(eventHandler);
    }
    return super.startDirectCdnStreaming(eventHandler, publishUrl, options);
  }

  override stopDirectCdnStreaming(): number {
    AgoraEnv.cdnEventHandlers = [];
    return super.stopDirectCdnStreaming();
  }

  override getScreenCaptureSources(
    thumbSize: SIZE,
    iconSize: SIZE,
    includeScreen: boolean
  ): any[] {
    const apiType = "RtcEngine_getScreenCaptureSources";
    const jsonParams = {
      thumbSize,
      iconSize,
      includeScreen,
      toJSON: () => {
        return {
          thumbSize,
          iconSize,
          includeScreen,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);

    jsonResults.result.forEach(function (element: any) {
      if (element.thumbImage.buffer == 0) {
        element.thumbImage.buffer = null;
      } else {
        element.thumbImage.buffer = getBridge().GetBuffer(
          element.thumbImage.buffer,
          element.thumbImage.length
        );
      }

      if (element.iconImage.buffer == 0) {
        element.iconImage.buffer = null;
      } else {
        element.iconImage.buffer = getBridge().GetBuffer(
          element.iconImage.buffer,
          element.iconImage.length
        );
      }
    });

    logDebug("getScreenCaptureSource ===== ", jsonResults.result);
    return jsonResults.result;
  }

  override destroyRendererByView(view: Element): void {
    AgoraEnv.AgoraRendererManager?.destroyRendererByView(view);
  }

  override getAudioDeviceManager(): IAudioDeviceManager {
    return new AudioDeviceManagerImplInternal();
  }

  override getVideoDeviceManager(): IVideoDeviceManager {
    return new IVideoDeviceManagerImpl();
  }

  override destroyRendererByConfig(
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

  override sendMetaData(
    metadata: Metadata,
    sourceType: VideoSourceType
  ): number {
    const apiType = "RtcEngine_sendMetaData";
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

    if (metadata.buffer == null || metadata.buffer == undefined)
      return ErrorCodeType.ErrInvalidArgument;

    let bufferArray = [metadata.buffer!];

    const jsonResults = callIrisApi.call(
      this,
      apiType,
      jsonParams,
      bufferArray,
      bufferArray.length
    );

    return jsonResults.result;
  }

  joinChannelWithOptions(
    token: string,
    channelId: string,
    uid: number,
    options: ChannelMediaOptions
  ): number {
    const apiType = "RtcEngine_joinChannel2";
    const jsonParams = {
      token,
      channelId,
      uid,
      options,
      toJSON: () => {
        return {
          token,
          channelId,
          uid,
          options,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  leaveChannel(options?: LeaveChannelOptions): number {
    const apiType =
      options === undefined
        ? "RtcEngine_leaveChannel"
        : "RtcEngine_leaveChannel2";
    const jsonParams = {
      options,
      toJSON: () => {
        return { options };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  setClientRole(role: ClientRoleType, options?: ClientRoleOptions): number {
    const apiType =
      options === undefined
        ? "RtcEngine_setClientRole"
        : "RtcEngine_setClientRole2";
    const jsonParams = {
      role,
      options,
      toJSON: () => {
        return {
          role,
          options,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  startEchoTest(intervalInSeconds: number = 10): number {
    const apiType = "RtcEngine_startEchoTest2";
    const jsonParams = {
      intervalInSeconds,
      toJSON: () => {
        return { intervalInSeconds };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  startPreview(
    sourceType: VideoSourceType = VideoSourceType.VideoSourceCameraPrimary
  ): number {
    const apiType = "RtcEngine_startPreview2";
    const jsonParams = {
      sourceType,
      toJSON: () => {
        return { sourceType };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  stopPreview(
    sourceType: VideoSourceType = VideoSourceType.VideoSourceCameraPrimary
  ): number {
    const apiType = "RtcEngine_stopPreview2";
    const jsonParams = {
      sourceType,
      toJSON: () => {
        return { sourceType };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  startAudioRecording(config: AudioRecordingConfiguration): number {
    const apiType = "RtcEngine_startAudioRecording3";
    const jsonParams = {
      config,
      toJSON: () => {
        return { config };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  startAudioMixing(
    filePath: string,
    loopback: boolean,
    replace: boolean,
    cycle: number,
    startPos: number = 0
  ): number {
    const apiType = "RtcEngine_startAudioMixing2";
    const jsonParams = {
      filePath,
      loopback,
      replace,
      cycle,
      startPos,
      toJSON: () => {
        return {
          filePath,
          loopback,
          replace,
          cycle,
          startPos,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  enableDualStreamMode(
    enabled: boolean,
    sourceType: VideoSourceType = VideoSourceType.VideoSourceCameraPrimary,
    streamConfig?: SimulcastStreamConfig
  ): number {
    const apiType =
      streamConfig === undefined
        ? "RtcEngine_enableDualStreamMode2"
        : "RtcEngine_enableDualStreamMode3";
    const jsonParams = {
      enabled,
      sourceType,
      streamConfig,
      toJSON: () => {
        return {
          enabled,
          sourceType,
          streamConfig,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  createDataStream(config: DataStreamConfig): number {
    const apiType = "RtcEngine_createDataStream2";
    const jsonParams = {
      config,
      toJSON: () => {
        return { config };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.streamId;
  }

  addVideoWatermark(watermarkUrl: string, options: WatermarkOptions): number {
    const apiType = "RtcEngine_addVideoWatermark2";
    const jsonParams = {
      watermarkUrl,
      options,
      toJSON: () => {
        return {
          watermarkUrl,
          options,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  joinChannelWithUserAccount(
    token: string,
    channelId: string,
    userAccount: string,
    options?: ChannelMediaOptions
  ): number {
    const apiType =
      options === undefined
        ? "RtcEngine_joinChannelWithUserAccount"
        : "RtcEngine_joinChannelWithUserAccount2";
    const jsonParams = {
      token,
      channelId,
      userAccount,
      options,
      toJSON: () => {
        return {
          token,
          channelId,
          userAccount,
          options,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  createDataStreamEx(
    config: DataStreamConfig,
    connection: RtcConnection
  ): number {
    const apiType = "RtcEngineEx_createDataStreamEx2";
    const jsonParams = {
      config,
      connection,
      toJSON: () => {
        return {
          config,
          connection,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.streamId;
  }
}
