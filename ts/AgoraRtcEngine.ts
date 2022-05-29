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
import { logInfo, logWarn } from "./Utils";

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
      console.error("already initialize rtcEngine");
      return -1;
    }
    AgoraRtcEngine.hasInitialize = true;
    const bridge = getBridge();
    bridge.InitializeEnv();
    const { retCode } = bridge.sendMsg("RtcEngine_initialize", {
      context,
      toJSON: () => {
        return { context };
      },
    });
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

    return retCode;
  }
  override release(sync = false): void {
    if (!AgoraRtcEngine.hasInitialize) {
      console.error("have not initialize rtcEngine");
      return;
    }
    AgoraRtcEngine.hasInitialize = false;
    const bridge = getBridge();
    bridge.sendMsg("RtcEngine_release", {
      sync,
      toJSON: () => {
        return { sync };
      },
    });
    bridge.ReleaseEnv();
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
