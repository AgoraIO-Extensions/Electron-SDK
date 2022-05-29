import { VideoSourceType } from "./Private/AgoraBase";
import { RtcEngineContext } from "./Private/IAgoraRtcEngine";
import { IRtcEngineExImpl } from "./Private/impl/IAgoraRtcEngineExImpl";
import {
  getBridge,
  handlerMPKEvent,
  handlerRTCEvent,
} from "./Private/internal/IrisApiEngine";
import AgoraRendererManager from "./Renderer/RendererManager";
import {
  Channel,
  ContentMode,
  RendererVideoConfig,
  RENDER_MODE,
  CallBackModule,
} from "./Types";
import { logError, logInfo, logWarn } from "./Utils";

/**
 * The AgoraRtcEngine class.
 */
export class AgoraRtcEngine extends IRtcEngineExImpl {
  static hasInitialize = false;
  constructor() {
    super();

    logInfo("AgoraRtcEngine constructor()");
  }

  override initialize(context: RtcEngineContext): number {
    if (AgoraRtcEngine.hasInitialize) {
      logWarn("initialize: already initialize rtcEngine");
      return -1;
    }
    AgoraRtcEngine.hasInitialize = true;
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
    const ret = super.initialize(context);
    return ret;
  }
  override release(sync = false): void {
    if (!AgoraRtcEngine.hasInitialize) {
      logWarn("release: rtcEngine have not initialize");
      return;
    }
    AgoraRtcEngine.hasInitialize = false;
    super.release(sync);
    getBridge().ReleaseEnv();
  }
  override setupLocalVideo(rendererConfig: RendererVideoConfig): number {
    return AgoraRendererManager.setupLocalVideo(rendererConfig);
  }
  override setupRemoteVideo(rendererConfig: RendererVideoConfig): number {
    return AgoraRendererManager.setupRemoteVideo(rendererConfig);
  }
  setupVideo(rendererConfig: RendererVideoConfig): void {
    AgoraRendererManager.setupVideo(rendererConfig);
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

  setRenderOption(
    view: HTMLElement,
    contentMode = ContentMode.Fit,
    mirror: boolean = false
  ): void {
    AgoraRendererManager.setRenderOption(view, contentMode, mirror);
  }

  setRenderMode(mode = RENDER_MODE.WEBGL): void {
    AgoraRendererManager.setRenderMode(mode);
  }
}
