import { VideoSourceType } from "../AgoraSdk";
import { getBridge } from "../Private/internal/IrisApiEngine";
import {
  AgoraElectronBridge,
  Channel,
  ChannelIdMap,
  ContentMode,
  RenderConfig,
  RendererConfig,
  RendererConfigInternal,
  RenderMap,
  RENDER_MODE,
  ShareVideoFrame,
  UidMap,
  VideoFrameCacheConfig,
} from "../types";
import {
  formatVideoFrameBufferConfig,
  getRendererConfigInternal,
  logError,
  logInfo,
  logWarn,
} from "../Utils";
import GlRenderer from "./GlRenderer";
import { IRenderer, RenderFailCallback } from "./IRender";
import { YUVCanvasRenderer } from "./YUVCanvasRenderer";

class RendererManager {
  isRendering = false;
  renderFps: number;
  videoFrameUpdateInterval?: NodeJS.Timeout;
  renderers: RenderMap;
  renderMode: RENDER_MODE;
  msgBridge: AgoraElectronBridge;

  constructor() {
    this.renderFps = 15;
    this.renderers = new Map();
    this.renderMode = this.checkWebglEnv()
      ? RENDER_MODE.WEBGL
      : RENDER_MODE.SOFTWARE;

    this.msgBridge = getBridge();
  }
  setRenderMode(mode: RENDER_MODE) {
    this.renderMode = mode;
  }
  setFPS(fps: number) {
    this.renderFps = fps;
    this.restartRender();
  }

  public setRenderOption(
    view: HTMLElement,
    contentMode = ContentMode.Fit,
    mirror: boolean = false
  ): void {
    if (!view) {
      console.error("setRenderOption: view not exist", view);
    }
    this.forEachStream(({ renders }) => {
      renders?.forEach((render) => {
        if (render.equalsElement(view)) {
          render.setRenderOption({ contentMode, mirror });
        }
      });
    });
  }
  public setRenderOptionByConfig(rendererConfig: RendererConfig): number {
    const {
      uid,
      channelId,
      rendererOptions,
      videoSourceType,
    }: RendererConfigInternal = getRendererConfigInternal(rendererConfig);

    if (!rendererConfig.view) {
      logError("setRenderOptionByView");
    }
    const renderList = this.getRenderers({ uid, channelId, videoSourceType });
    console.log("renderList", renderList);
    renderList
      ? renderList
          .filter((renderItem) =>
            renderItem.equalsElement(rendererConfig.view!)
          )
          .forEach((renderItem) => renderItem.setRenderOption(rendererOptions))
      : console.warn(
          `RenderStreamType: ${videoSourceType} channelId:${channelId} uid:${uid} have no render view, you need to call this api after setView`
        );
    return 0;
  }
  public checkWebglEnv(): boolean {
    let gl;
    const canvas = document.createElement("canvas");

    try {
      gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      logInfo("Your browser support webGL");
    } catch (e) {
      logWarn("Your browser may not support webGL");
      return false;
    }

    if (gl) {
      return true;
    } else {
      return false;
    }
  }

  public setupVideo(rendererConfig: RendererConfigInternal): void {
    const { uid, channelId, videoSourceType, rendererOptions } = rendererConfig;
    const config = {
      uid,
      channelId,
      videoSourceType,
      width: 0,
      height: 0,
    };
    // ensure a render to RenderMap
    const render = this.bindHTMLElementToRender(
      rendererConfig,
      rendererConfig.view!
    );

    // render config
    render.setRenderOption(rendererOptions);

    // enable iris videoFrame
    this.enableVideoFrameCache(config);

    // enable render
    this.enableRender(true);
  }

  public destroyRendererByView(view: Element): void {
    const renders = this.renderers;
    renders.forEach((channelMap, videoSourceType) => {
      channelMap.forEach((uidMap, channelId) => {
        uidMap.forEach((renderConfig, uid) => {
          let hasRender = false;
          const remainRenders = renderConfig.renders?.filter((render) => {
            const isFilter = render.equalsElement(view);

            if (isFilter) {
              hasRender = true;
              render.unbind();
            }
            return !isFilter;
          });
          if (!hasRender) {
            return;
          }

          if (remainRenders?.length === 0 || !remainRenders) {
            this.disableVideoFrameCache({ uid, channelId, videoSourceType });
          }
          renderConfig.renders = remainRenders;
        });
      });
    });
  }
  public destroyRenderersByConfig(
    videoSourceType: VideoSourceType,
    channelId?: Channel,
    uid?: number
  ): void {
    const config = formatVideoFrameBufferConfig(
      videoSourceType,
      channelId,
      uid
    );
    videoSourceType = config.videoSourceType;
    channelId = config.channelId;
    uid = config.uid;

    this.disableVideoFrameCache(config);
    const uidMap = this.renderers.get(videoSourceType)?.get(channelId);
    const renderMap = uidMap?.get(uid);
    if (!renderMap) {
      return;
    }
    renderMap.renders?.forEach((renderItem) => {
      renderItem.unbind();
    });
    renderMap.renders = [];
  }

  public removeAllRenderer(): void {
    const renderMap = this.forEachStream(
      (renderConfig, videoFrameCacheConfig) => {
        this.disableVideoFrameCache(videoFrameCacheConfig);
        renderConfig.renders?.forEach((renderItem) => {
          renderItem.unbind();
        });
        renderConfig.renders = [];
      }
    );
    renderMap.clear();
  }
  clear(): void {
    this.stopRender();
    this.removeAllRenderer();
  }

  public enableRender(enabled = true): void {
    if (enabled && this.isRendering) {
      //is already _isRendering
    } else if (enabled && !this.isRendering) {
      this.startRenderer();
    } else {
      this.stopRender();
    }
  }

  public startRenderer(): void {
    this.isRendering = true;
    const renderFunc = (
      rendererItem: RenderConfig,
      config: VideoFrameCacheConfig
    ) => {
      const { renders } = rendererItem;
      if (!renders || renders?.length === 0) {
        return;
      }
      let finalResult = this.msgBridge.GetVideoStreamData(
        rendererItem.shareVideoFrame
      );

      switch (finalResult.ret) {
        case 0: // IRIS_VIDEO_PROCESS_ERR::ERR_OK = 0,
          break;
        case 1: // IRIS_VIDEO_PROCESS_ERR::ERR_NULL_POINTER = 1,
          return;
        case 2: // IRIS_VIDEO_PROCESS_ERR::ERR_SIZE_NOT_MATCHING
          const { width, height } = finalResult;
          const { videoSourceType, channelId, uid } = config;
          const newShareVideoFrame = this.resizeShareVideoFrame(
            videoSourceType,
            channelId,
            uid,
            width,
            height
          );
          rendererItem.shareVideoFrame = newShareVideoFrame;
          finalResult = this.msgBridge.GetVideoStreamData(newShareVideoFrame);
          break;
        case 5: // IRIS_VIDEO_PROCESS_ERR::ERR_BUFFER_EMPTY
          return;
        default:
          return;
      }
      if (finalResult.ret !== 0) {
        console.log("native get size error");
        return;
      }
      const renderVideoFrame = rendererItem.shareVideoFrame;
      if (renderVideoFrame.width > 0 && renderVideoFrame.height > 0) {
        renders.forEach((renderItem) => {
          renderItem.drawFrame(rendererItem.shareVideoFrame);
        });
      }
    };
    this.videoFrameUpdateInterval = setInterval(() => {
      this.forEachStream(renderFunc);
    }, 1000 / this.renderFps);
  }

  public stopRender(): void {
    this.isRendering = false;
    if (this.videoFrameUpdateInterval) {
      clearInterval(this.videoFrameUpdateInterval);
      this.videoFrameUpdateInterval = undefined;
    }
  }

  public restartRender(): void {
    if (this.videoFrameUpdateInterval) {
      this.stopRender();
      this.startRenderer();
      logInfo(`setFps ${this.renderFps} restartInterval`);
    }
  }
  private createRenderer(failCallback?: RenderFailCallback): IRenderer {
    if (this.renderMode === RENDER_MODE.SOFTWARE) {
      return new YUVCanvasRenderer(false);
    } else {
      return new GlRenderer(failCallback);
    }
  }
  private getRender({
    videoSourceType,
    channelId,
    uid,
  }: VideoFrameCacheConfig) {
    return this.renderers.get(videoSourceType)?.get(channelId)?.get(uid);
  }
  private getRenderers({
    videoSourceType,
    channelId,
    uid,
  }: VideoFrameCacheConfig): IRenderer[] {
    return (
      this.renderers.get(videoSourceType)?.get(channelId)?.get(uid)?.renders ||
      []
    );
  }

  private bindHTMLElementToRender(
    config: RendererConfigInternal,
    view: HTMLElement
  ): IRenderer {
    this.ensureRendererConfig(config);
    const renders = this.getRenderers(config);
    const filterRenders =
      renders?.filter((render) => render.equalsElement(view)) || [];
    const hasBeenAdd = filterRenders.length > 0;
    if (hasBeenAdd) {
      console.warn("addRenderer: this view exists in list, ignore");
      return filterRenders[0];
    }
    const renderer = this.createRenderer(() => {
      const renderConfig = this.getRender(config);
      if (!renderConfig) {
        return;
      }
      renderConfig.renders = renders.filter((r) => r !== renderer);
      const contentMode = renderer.contentMode;
      renderer.unbind();
      this.setRenderMode(RENDER_MODE.SOFTWARE);
      const newRender = this.createRenderer();
      newRender.contentMode = contentMode;
      newRender.bind(view);
      renderConfig.renders.push(newRender);
    });
    renderer.bind(view);
    renders.push(renderer);
    return renderer;
  }

  private forEachStream(
    callbackfn: (
      renderConfig: RenderConfig,
      videoFrameCacheConfig: VideoFrameCacheConfig,
      maps: {
        channelMap: ChannelIdMap;
        uidMap: UidMap;
      }
    ) => void
  ): RenderMap {
    const renders = this.renderers;
    renders.forEach((channelMap, videoSourceType) => {
      channelMap.forEach((uidMap, channelId) => {
        uidMap.forEach((renderConfig, uid) => {
          callbackfn(
            renderConfig,
            { videoSourceType, channelId, uid },
            { channelMap, uidMap }
          );
        });
      });
    });
    return renders;
  }

  private enableVideoFrameCache(
    videoFrameCacheConfig: VideoFrameCacheConfig
  ): number {
    logInfo(`enableVideoFrameCache ${JSON.stringify(videoFrameCacheConfig)}`);
    let ret = this.msgBridge.EnableVideoFrameCache(videoFrameCacheConfig);
    return ret.retCode;
  }

  private disableVideoFrameCache(
    videoFrameCacheConfig: VideoFrameCacheConfig
  ): number {
    let ret = this.msgBridge.DisableVideoFrameCache(videoFrameCacheConfig);
    return ret.retCode;
  }

  private ensureRendererConfig(config: VideoFrameCacheConfig):
    | Map<
        number,
        {
          shareVideoFrame: ShareVideoFrame;
          renders: IRenderer[];
        }
      >
    | undefined {
    const { videoSourceType, uid, channelId } = config;
    const emptyRenderConfig = {
      renders: [],
      shareVideoFrame: this.resizeShareVideoFrame(
        videoSourceType,
        channelId,
        uid
      ),
    };
    const emptyUidMap = new Map([[uid, emptyRenderConfig]]);
    const emptyChannelMap = new Map([[channelId, emptyUidMap]]);

    const renderers = this.renderers;
    const videoSourceMap = renderers.get(videoSourceType);
    if (!videoSourceMap) {
      renderers.set(videoSourceType, emptyChannelMap);
      return emptyUidMap;
    }
    const channelMap = videoSourceMap.get(channelId);
    if (!channelMap) {
      videoSourceMap.set(channelId, emptyUidMap);
      return emptyUidMap;
    }
    const renderConfig = channelMap?.get(uid);
    if (!renderConfig) {
      channelMap?.set(uid, emptyRenderConfig);
      logWarn(
        `ensureRendererMap uid map for channelId:${channelId}  uid:${uid}`
      );
      return emptyUidMap;
    }
    return channelMap;
  }
  private resizeShareVideoFrame(
    videoSourceType: VideoSourceType,
    channelId: string,
    uid: number,
    width = 0,
    height = 0
  ): ShareVideoFrame {
    return {
      videoSourceType,
      channelId,
      uid,
      yBuffer: Buffer.alloc(width * height),
      uBuffer: Buffer.alloc((width * height) / 4),
      vBuffer: Buffer.alloc((width * height) / 4),
      width,
      height,
    };
  }

  private updateVideoFrameCacheInMap(
    config: VideoFrameCacheConfig,
    shareVideoFrame: ShareVideoFrame
  ): void {
    let rendererConfigMap = this.ensureRendererConfig(config);
    rendererConfigMap
      ? Object.assign(rendererConfigMap.get(config.uid), {
          shareVideoFrame,
        })
      : logWarn(
          `updateVideoFrameCacheInMap videoSourceType:${config.videoSourceType} channelId:${config.channelId} uid:${config.uid} rendererConfigMap is null`
        );
  }
}

export { RendererManager };

const AgoraRenderManager = new RendererManager();
export default AgoraRenderManager;
