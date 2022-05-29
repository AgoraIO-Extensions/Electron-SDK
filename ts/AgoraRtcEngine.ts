import { VideoSourceType } from "./AgoraSdk";
import { RtcEngineContext } from "./Private/IAgoraRtcEngine";
import { IRtcEngineExImpl } from "./Private/impl/IAgoraRtcEngineExImpl";
import { getBridge, sendMsg, handlerMPKEvent, handlerRTCEvent } from "./Private/internal/IrisApiEngine";
import AgoraRenderManager from "./Renderer/RendererManager";
import {
  Channel,
  ContentMode,
  RendererConfig,
  RendererConfigInternal,
  RENDER_MODE,
  CallBackModule
} from "./types";
import { getRendererConfigInternal, logInfo, logWarn } from "./Utils";

/**
 * The AgoraRtcEngine class.
 */
export class AgoraRtcEngine extends IRtcEngineExImpl {
  // _rtcDeviceManager: NodeIrisRtcDeviceManager;
  static hasInitialize = false;
  constructor() {
    super();

    logInfo("AgoraRtcEngine constructor()");
  }
  setView(rendererConfig: RendererConfig): void {
    const config: RendererConfigInternal =
      getRendererConfigInternal(rendererConfig);

    if (rendererConfig.view) {
      AgoraRenderManager.setupVideo(config);
    } else {
      logWarn("Note: setView view is null!");
      AgoraRenderManager.destroyRenderersByConfig(
        rendererConfig.videoSourceType,
        rendererConfig.channelId,
        rendererConfig.uid
      );
    }
  }
  destroyRendererByView(view: Element): void {
    AgoraRenderManager.destroyRendererByView(view);
  }

  destroyRendererByConfig(
    videoSourceType: VideoSourceType,
    channelId?: Channel,
    uid?: number
  ) {
    AgoraRenderManager.destroyRenderersByConfig(
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
    AgoraRenderManager.setRenderOption(view, contentMode, mirror);
  }

  setRenderMode(mode = RENDER_MODE.WEBGL): void {
    AgoraRenderManager.setRenderMode(mode);
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
    bridge.OnEvent(CallBackModule.RTC, "call_back_with_buffer", handlerRTCEvent);
    bridge.OnEvent(CallBackModule.MPK, "call_back_with_buffer", handlerMPKEvent);

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
}
