import AgoraRendererManager from "../../Renderer/RendererManager";
import { CallBackModule, Channel } from "../../Types";
import { AgoraEnv, logDebug, logError, logWarn } from "../../Utils";
import {
  VideoCanvas,
  VideoMirrorModeType,
  VideoSourceType,
} from "../AgoraBase";
import { IMediaPlayer } from "../IAgoraMediaPlayer";
import {
  ChannelMediaOptions,
  IScreenCaptureSourceList,
  RtcEngineContext,
} from "../IAgoraRtcEngine";
import { IRtcEngineEventHandlerEx, RtcConnection } from "../IAgoraRtcEngineEx";
import { IRtcEngineExImpl } from "../impl/IAgoraRtcEngineExImpl";
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

  override joinChannelEx(
    token: string,
    connection: RtcConnection,
    options: ChannelMediaOptions,
    eventHandler?: IRtcEngineEventHandlerEx
  ): number {
    if (eventHandler) {
      this.registerEventHandler(eventHandler);
    }

    return super.joinChannelEx(token, connection, options, eventHandler!);
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
    thumbSize: { width: number; height: number },
    iconSize: { width: number; height: number },
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
    return jsonResults.result;
  }

  destroyRendererByView(view: Element): void {
    AgoraRendererManager.destroyRendererByView(view);
  }

  destroyRendererByConfig(
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
}
