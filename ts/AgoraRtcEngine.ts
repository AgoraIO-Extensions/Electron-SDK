import { VideoSourceType } from "./AgoraSdk";
import { RtcEngineContext } from "./Private/IAgoraRtcEngine";
import { IRtcEngineExImpl } from "./Private/impl/IAgoraRtcEngineExImpl";
import { getBridge } from "./Private/internal/IrisApiEngine";
import AgoraRenderManager from "./Renderer/RendererManager";
import { Channel, ContentMode, RenderVideoConfig, RENDER_MODE } from "./types";
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
  override setupLocalVideo(rendererConfig: RenderVideoConfig): number {
    return AgoraRenderManager.setupLocalVideo(rendererConfig);
  }
  override setupRemoteVideo(rendererConfig: RenderVideoConfig): number {
    return AgoraRenderManager.setupRemoteVideo(rendererConfig);
  }
  setupVideo(rendererConfig: RenderVideoConfig): void {
    AgoraRenderManager.setupVideo(rendererConfig);
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
}
