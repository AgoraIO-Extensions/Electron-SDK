import AgoraRendererManager from "../../Renderer/RendererManager";
import { CallBackModule, Channel } from "../../Types";
import { AgoraEnv, logDebug, logError, logWarn } from "../../Utils";
import {
  ErrorCodeType,
  VideoCanvas,
  VideoMirrorModeType,
  VideoSourceType,
} from "../AgoraBase";
import { IMediaPlayer } from "../IAgoraMediaPlayer";
import {
  ChannelMediaOptions,
  IVideoDeviceManager,
  Metadata,
  RtcEngineContext,
  SIZE,
} from "../IAgoraRtcEngine";
import { IRtcEngineEventHandlerEx, RtcConnection } from "../IAgoraRtcEngineEx";
import { IAudioDeviceManager } from "../IAudioDeviceManager";
import { IMediaPlayerImpl } from "../impl/IAgoraMediaPlayerImpl";
import { IRtcEngineExImpl } from "../impl/IAgoraRtcEngineExImpl";
import { IVideoDeviceManagerImpl } from "../impl/IAgoraRtcEngineImpl";
import { IAudioDeviceManagerImpl } from "../impl/IAudioDeviceManagerImpl";
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

  override createMediaPlayer(): IMediaPlayer {
    if (!AgoraEnv.isInitializeEngine) {
      logError("createMediaPlayer: rtcEngine have not initialize");
    }
    // @ts-ignore
    const mediaPlayerId = super.createMediaPlayer() as number;
    return new MediaPlayerInternal(mediaPlayerId);
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
    console.log("agora, sendStreamMessage===");
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
    AgoraRendererManager.destroyRendererByView(view);
  }

  override getAudioDeviceManager(): IAudioDeviceManager {
    return new IAudioDeviceManagerImpl();
  }

  override getVideoDeviceManager(): IVideoDeviceManager {
    return new IVideoDeviceManagerImpl();
  }

  override destroyRendererByConfig(
    videoSourceType: VideoSourceType,
    channelId?: Channel,
    uid?: number
  ) {
    AgoraRendererManager.destroyRenderersByConfig(
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
}
