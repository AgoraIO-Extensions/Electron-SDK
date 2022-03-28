import { NodeIrisRtcEngine } from "../Api/internal/native_interface";
import {
  logError,
  logInfo,
  logWarn,
  getRendererConfigInternal,
  logDebug,
} from "../Utils";

import { IRenderer } from "./IRender";
import {
  RENDER_MODE,
  RendererConfig,
  VideoFrame,
  VideoFrameCacheConfig,
  VideoSourceType,
  Channel,
  RendererConfigInternal,
  CONTENT_MODE,
} from "./type";
import { YUVCanvasRenderer } from "./YUVCanvasRenderer";
import GlRenderer from "./GlRenderer";

interface RenderConfig {
  renders?: IRenderer[];
  cachedVideoFrame?: VideoFrame;
}

export type UidMap = Map<number, RenderConfig>;
export type ChannelIdMap = Map<Channel, UidMap>;
export type RenderMap = Map<VideoSourceType, ChannelIdMap>;
class RendererManager {
  videoFps: number;
  videoFrameUpdateInterval?: NodeJS.Timeout;
  renderers: RenderMap;
  renderMode: RENDER_MODE;
  _rtcEngine: NodeIrisRtcEngine;

  constructor(rtcEngine: NodeIrisRtcEngine) {
    this.videoFps = 15;
    this.renderers = new Map();
    this.renderMode = this._checkWebGL()
      ? RENDER_MODE.WEBGL
      : RENDER_MODE.SOFTWARE;

    logDebug(`renderMode: ${this.renderMode === RENDER_MODE.WEBGL}`);

    this._rtcEngine = rtcEngine;
  }

  clear(): void {
    this.stopRenderer();
    this.removeAllRenderer();
  }

  /**
   * @private
   * @ignore
   * check if WebGL will be available with appropriate features
   * @return {boolean}
   */
  _checkWebGL(): boolean {
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

  setRenderMode(mode: RENDER_MODE) {
    this.renderMode = mode;
  }

  /**
   * @private
   * @ignore
   */
  setRenderer(rendererConfig: RendererConfigInternal): void {
    const { uid, channelId, videoSourceType, rendererOptions } = rendererConfig;
    const config = {
      uid,
      channelId,
      videoSourceType,
      width: 0,
      height: 0,
    };
    this.enableVideoFrameCache(config);
    const render = this.addRenderer(rendererConfig, rendererConfig.view!);
    render.setRenderOption(rendererOptions);
  }

  /**
   * @private
   * @ignore
   */
  createRenderer(): IRenderer {
    if (this.renderMode === RENDER_MODE.SOFTWARE) {
      return new YUVCanvasRenderer(false);
    } else {
      let render = new GlRenderer(() => {});
      return render as IRenderer;
    }
  }

  /**
   * @private
   * @ignore
   */
  addRenderer(config: RendererConfigInternal, view: HTMLElement): IRenderer {
    this.ensureRendererConfig(config);
    const renders = this.getRenderers(config);
    const filterRenders =
      renders?.filter((render) => render.equalsElement(view)) || [];
    const hasBeenAdd = filterRenders.length > 0;
    if (hasBeenAdd) {
      console.warn("addRenderer: this view exists in list, ignore");
      return filterRenders[0];
    }
    const renderer = this.createRenderer();
    renderer.bind(view);
    renders.push(renderer);
    return renderer;
  }

  /**
   * @private
   * @ignore
   */
  getRenderers({
    videoSourceType,
    channelId,
    uid,
  }: VideoFrameCacheConfig): IRenderer[] {
    return (
      this.renderers.get(videoSourceType)?.get(channelId)?.get(uid)?.renders ||
      []
    );
  }

  removeRendererByConfig(config: VideoFrameCacheConfig): void {
    const { videoSourceType, channelId, uid } = config;
    // this.disableVideoFrameCache(config);
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
  removeRendererByView(view: Element): void {
    this.forEachStream(
      (renderConfig, { uid, channelId, videoSourceType }, { uidMap }) => {
        const render = renderConfig.renders?.find((render) =>
          render.equalsElement(view)
        );
        if (!render) {
          return;
        }
        renderConfig.renders = renderConfig.renders?.filter(
          (render) => !render.equalsElement(view)
        );
        render.unbind();

        if (renderConfig.renders?.length === 0) {
          this.disableVideoFrameCache({ uid, channelId, videoSourceType });
        }
      }
    );
  }

  removeAllRenderer(): void {
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

  forEachStream(
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

  /**
   * @private
   * @ignore
   */
  startRenderer(): void {
    const renderFunc = (
      rendererItem: RenderConfig,
      config: VideoFrameCacheConfig
    ) => {
      const { videoSourceType, channelId, uid } = config;
      const { cachedVideoFrame, renders } = rendererItem;
      if (!renders || renders?.length === 0) {
        return;
      }

      if (!cachedVideoFrame) {
        logWarn(
          `VideoSourceType:${videoSourceType} Channel: ${channelId} Uid: ${uid} have no cachedVideoFrame`
        );
        return;
      }

      let retObj;
      retObj = this._rtcEngine.GetVideoStreamData(cachedVideoFrame);

      if (!retObj || !retObj.ret) {
        logWarn(
          `VideoSourceType:${videoSourceType} Channel: ${channelId} Uid: ${uid} have no stream`
        );
        return;
      }

      if (!retObj.isNewFrame) return;
      const { yBuffer, uBuffer, vBuffer } = cachedVideoFrame;
      let videoFrame: VideoFrame = {
        width: retObj.width,
        height: retObj.height,
        yBuffer,
        uBuffer,
        vBuffer,
        mirror: false,
        yStride: retObj.yStride,
        rotation: retObj.rotation,
        videoSourceType: config.videoSourceType,
      };

      if (renders) {
        renders.forEach((renderItem) => {
          renderItem.drawFrame(videoFrame);
        });
      } else {
        logWarn(
          `VideoSourceType:${videoSourceType} Channel: ${channelId} Uid: ${uid} have no renderer`
        );
      }
    };
    this.videoFrameUpdateInterval = setInterval(() => {
      this.forEachStream(renderFunc);
    }, 1000 / this.videoFps);
  }

  /**
   * @private
   * @ignore
   */
  stopRenderer(): void {
    if (this.videoFrameUpdateInterval) {
      clearInterval(this.videoFrameUpdateInterval);
      this.videoFrameUpdateInterval = undefined;
    }
  }

  /**
   * @private
   * @ignore
   */
  restartRenderer(): void {
    if (this.videoFrameUpdateInterval) {
      this.stopRenderer();
      this.startRenderer();
      logInfo(`setFps ${this.videoFps} restartInterval`);
    }
  }

  enableVideoFrameCache(videoFrameCacheConfig: VideoFrameCacheConfig): number {
    logInfo(`enableVideoFrameCache ${JSON.stringify(videoFrameCacheConfig)}`);
    let ret = this._rtcEngine.EnableVideoFrameCache(videoFrameCacheConfig);
    return ret.retCode;
  }

  disableVideoFrameCache(videoFrameCacheConfig: VideoFrameCacheConfig): number {
    let ret = this._rtcEngine.DisableVideoFrameCache(videoFrameCacheConfig);
    return ret.retCode;
  }

  ensureRendererConfig(config: VideoFrameCacheConfig):
    | Map<
        number,
        {
          cachedVideoFrame?: VideoFrame;
          renders?: IRenderer[];
        }
      >
    | undefined {
    const { videoSourceType, uid, channelId } = config;
    const emptyRenderConfig = { renders: [] };
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

  updateVideoFrameCacheInMap(
    config: VideoFrameCacheConfig,
    videoFrame: VideoFrame
  ): void {
    let rendererConfigMap = this.ensureRendererConfig(config);
    rendererConfigMap
      ? Object.assign(rendererConfigMap.get(config.uid), {
          cachedVideoFrame: videoFrame,
        })
      : logWarn(
          `updateVideoFrameCacheInMap videoSourceType:${config.videoSourceType} channelId:${config.channelId} uid:${config.uid} rendererConfigMap is null`
        );
  }

  // setRenderOptionByView(rendererConfig: RendererConfig): number {
  //   const {
  //     uid,
  //     channelId,
  //     rendererOptions,
  //     videoSourceType,
  //   }: RendererConfigInternal = getRendererConfigInternal(rendererConfig);

  //   if (!rendererConfig.view) {
  //     logError("setRenderOptionByView");
  //   }
  //   const renderList = this.getRenderers({ uid, channelId, videoSourceType });
  //   renderList
  //     ? renderList
  //         .filter((renderItem) =>
  //           renderItem.equalsElement(rendererConfig.view!)
  //         )
  //         .forEach((renderItem) => renderItem.setRenderOption(rendererOptions))
  //     : console.warn(
  //         `RenderStreamType: ${videoSourceType} channelId:${channelId} uid:${uid} have no render view, you need to call this api after setView`
  //       );
  //   return 0;
  // }
  setRenderOption(
    view: HTMLElement,
    contentMode = CONTENT_MODE.FIT,
    mirror: boolean = false
  ): void {
    this.forEachStream(({ renders }) => {
      renders?.forEach((render) => {
        if (render.equalsElement(view)) {
          render.setRenderOption({ contentMode, mirror });
        }
      });
    });
  }
}

export { RendererManager };
