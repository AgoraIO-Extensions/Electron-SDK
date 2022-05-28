import { VideoSourceType } from "./AgoraSdk";
import { RtcEngineContext } from "./Private/IAgoraRtcEngine";
import { IRtcEngineExImpl } from "./Private/impl/IAgoraRtcEngineExImpl";
import { getBridge, sendMsg } from "./Private/internal/IrisApiEngine";
import { RendererManager } from "./Renderer/RendererManager";
import {
  Channel,
  CONTENT_MODE,
  RendererConfig,
  RendererConfigInternal,
  RENDER_MODE,
} from "./types";
import {
  formatVideoFrameBufferConfig,
  getRendererConfigInternal,
  logInfo,
  logWarn,
} from "./Utils";

/**
 * The AgoraRtcEngine class.
 */
export class AgoraRtcEngine extends IRtcEngineExImpl {
  // _rtcDeviceManager: NodeIrisRtcDeviceManager;

  engineId = `${parseInt(`${Math.random() * 100000}`)}`;
  _rendererManager?: RendererManager;
  constructor() {
    super();

    logInfo("AgoraRtcEngine constructor()");
    this._rendererManager = new RendererManager();

    // forwardEvent({
    //   event: {
    //     eventName,
    //     params: eventData,
    //     changeNameHandler: changeEventNameForOnXX,
    //   },
    //   fire: this.fire,
    //   filter: this.engineFilterEvent,
    // })

    // forwardEvent({
    //   event: {
    //     eventName,
    //     params: eventData,
    //     buffer: eventBuffer,
    //     changeNameHandler: changeEventNameForOnXX,
    //   },
    //   fire: this.fire,
    //   filter: this.engineFilterEventWithBuffer,
    // })
    // this._rendererManager = new RendererManager(this._rtcEngine);
  }
  setView(rendererConfig: RendererConfig): void {
    const config: RendererConfigInternal =
      getRendererConfigInternal(rendererConfig);

    if (rendererConfig.view) {
      this._rendererManager?.setRenderer(config);
    } else {
      logWarn("Note: setView view is null!");
      this._rendererManager?.removeRendererByConfig(config);
    }
  }
  destroyRendererByView(view: Element): void {
    this._rendererManager?.removeRendererByView(view);
  }

  destroyRendererByConfig(
    videoSourceType: VideoSourceType,
    channelId?: Channel,
    uid?: number
  ) {
    const config = formatVideoFrameBufferConfig(
      videoSourceType,
      channelId,
      uid
    );
    this._rendererManager?.removeRendererByConfig(config);
  }

  setRenderOption(
    view: HTMLElement,
    contentMode = CONTENT_MODE.FIT,
    mirror: boolean = false
  ): void {
    this._rendererManager?.setRenderOption(view, contentMode, mirror);
  }

  setRenderMode(mode = RENDER_MODE.WEBGL): void {
    this._rendererManager?.setRenderMode(mode);
  }

  // /**
  //  * @private
  //  * @ignore
  //  */
  // resizeBuffer(
  //   uid: number,
  //   channelId: string,
  //   yStride: number,
  //   height: number,
  //   videoSourceType: VideoSourceType
  // ): VideoFrame {
  //   yStride = ((yStride + 15) >> 4) << 4;
  //   return {
  //     uid,
  //     channelId,
  //     yBuffer: Buffer.alloc(yStride * height),
  //     uBuffer: Buffer.alloc((yStride * height) / 4),
  //     vBuffer: Buffer.alloc((yStride * height) / 4),
  //     yStride,
  //     width: 0,
  //     height,
  //     videoSourceType,
  //   };
  // }

  override initialize(context: RtcEngineContext): number {
    const apiType = "RtcEngine_initialize";
    const jsonParams = {
      context,
      toJSON: () => {
        return { context };
      },
    };
    const bridge = getBridge();
    bridge.InitializeEnv();
    return bridge.sendMsg(apiType, jsonParams).retCode;
  }
  override release(sync?: boolean): void {
    this._rendererManager?.enableRender(false);
    const apiType = "RtcEngine_release";
    const jsonParams = {
      sync,
      toJSON: () => {
        return { sync };
      },
    };
    const bridge = getBridge();
    bridge.sendMsg(apiType, jsonParams);
    bridge.ReleaseEnv();
  }
}
