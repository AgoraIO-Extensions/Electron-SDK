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
import { deprecate, logDebug, logError, logInfo, logWarn } from "./Utils";

/**
 * The AgoraRtcEngine class.
 */
export class AgoraRtcEngine extends IRtcEngineExImpl {
  static hasInitialize = false;
  constructor() {
    super();

    logDebug("AgoraRtcEngine constructor()");
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

  setRenderOptionByConfig(rendererConfig: RendererVideoConfig): void {
    AgoraRendererManager.setRenderOptionByConfig(rendererConfig);
  }

  setRenderMode(mode = RENDER_MODE.WEBGL): void {
    AgoraRendererManager.setRenderMode(mode);
  }

  // @mark old api will deprecate
  // @mark old api will deprecate
  // @mark old api will deprecate
  // @mark old api will deprecate
  // @mark old api will deprecate
  // @mark old api will deprecate
  // @mark old api will deprecate

  _setupLocalVideo(view: Element): number {
    deprecate("_setupLocalVideo", "setupVideo or setupLocalVideo");
    this.setupLocalVideo({
      videoSourceType: VideoSourceType.VideoSourceCamera,
    });
    return 0;
  }

  _setupViewContentMode(
    uid: number | "local" | "videosource",
    mode: 0 | 1,
    channelId: string
  ): number {
    deprecate(
      "_setupViewContentMode",
      "setRenderOptionByConfig or setRenderOption"
    );

    const contentMode = mode === 1 ? ContentMode.Fit : ContentMode.Cropped;
    const mirror = false;
    switch (uid) {
      case "local":
        this.setRenderOptionByConfig({
          videoSourceType: VideoSourceType.VideoSourceCamera,
          rendererOptions: {
            contentMode,
            mirror,
          },
        });
        break;
      case "videosource":
        this.setRenderOptionByConfig({
          videoSourceType: VideoSourceType.VideoSourceScreen,
          rendererOptions: {
            contentMode,
            mirror,
          },
        });
        break;
      default:
        this.setRenderOptionByConfig({
          videoSourceType: VideoSourceType.VideoSourceRemote,
          channelId,
          rendererOptions: {
            contentMode,
            mirror,
          },
        });
        break;
    }
    return 0;
  }
  _destroyRenderView(
    key: "local" | "videosource" | number,
    channelId: string | undefined,
    view: Element,
    onFailure?: (err: Error) => void
  ) {
    deprecate(
      "_destroyRenderView",
      "destroyRendererByView or destroyRendererByConfig"
    );
    switch (key) {
      case "local":
        break;
      case "videosource":
        break;

      default:
        break;
    }
  }
  _subscribe(
    uid: number,
    view: Element,
    options?: {
      append: boolean;
    }
  ) {
    deprecate("_subscribe", "setupVideo or setupRemoteVideo");
  }
  _setupLocalVideoSource(view: HTMLElement) {
    deprecate("_setupLocalVideoSource", "setupVideo or setupLocalVideo");
    this.setupVideo({
      videoSourceType: VideoSourceType.VideoSourceScreen,
      view,
    });
  }
  _setupRemoteVideo(
    uid: number,
    view?: HTMLElement,
    channelId?: string,
    options?: {
      append: boolean;
    }
  ) {
    deprecate("_setupRemoteVideo", "setupVideo or setupRemoteVideo");
    this.setupVideo({
      videoSourceType: VideoSourceType.VideoSourceRemote,
      view,
      channelId,
    });
  }
}
