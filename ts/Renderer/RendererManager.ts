import { NodeIrisRtcEngine } from "../Api/internal/native_interface";
import {
  logError,
  logInfo,
  logWarn,
  getRendererConfigInternal,
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
} from "./type";
import { YUVCanvasRenderer } from "./YUVCanvasRenderer";
interface RenderConfig {
  renders?: IRenderer[];
  cachedVideoFrame?: VideoFrame;
}

export type UidMap = Map<number, RenderConfig>;
export type ChannelIdMap = Map<Channel, UidMap>;
export type RenderMap = Map<VideoSourceType, ChannelIdMap>;
class RendererManager {
  _config: {
    videoFps: number;
    videoFrameUpdateInterval?: NodeJS.Timeout;
    renderers: RenderMap;
    renderMode: RENDER_MODE;
  };
  _rtcEngine: NodeIrisRtcEngine;

  constructor(rtcEngine: NodeIrisRtcEngine) {
    this._config = {
      videoFps: 10,
      renderers: new Map(),
      renderMode: this._checkWebGL() ? RENDER_MODE.WEBGL : RENDER_MODE.SOFTWARE,
    };
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
    this._config.renderMode = mode;
  }

  /**
   * @private
   * @ignore
   */
  setRenderer(rendererConfig: RendererConfigInternal): void {
    const { uid, channelId, videoSourceType } = rendererConfig;
    const config = {
      uid,
      channelId,
      videoSourceType,
      width: 0,
      height: 0,
    };
    this.enableVideoFrameCache(config);
    this.addRenderer(config, rendererConfig.view!);
    this.setupViewContentMode(rendererConfig);
  }

  /**
   * @private
   * @ignore
   */
  createRenderer(): IRenderer {
    return new YUVCanvasRenderer(false);
  }

  /**
   * @private
   * @ignore
   */
  addRenderer(config: VideoFrameCacheConfig, view: Element): void {
    this.ensureRendererConfig(config);
    const renders = this.getRenderers(config);
    const filterRenders =
      renders?.filter((render) => render.getView() == view) || [];
    const hasBeenAdd = filterRenders.length > 0;
    if (hasBeenAdd) {
      console.warn("addRenderer: this view exists in list, ignore");
      return;
    }
    const renderer = this.createRenderer();
    renderer.bind(view);
    renders?.push(renderer);
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
      this._config.renderers.get(videoSourceType)?.get(channelId)?.get(uid)
        ?.renders || []
    );
  }

  removeRendererByConfig(config: VideoFrameCacheConfig): void {
    const { videoSourceType, channelId, uid } = config;
    this.disableVideoFrameCache(config);
    const uidMap = this._config.renderers.get(videoSourceType)?.get(channelId);
    const renderMap = uidMap?.get(uid);
    renderMap?.renders?.forEach((renderItem) => {
      renderItem.unbind();
    });
    uidMap?.delete(uid);
  }
  removeRendererByView(view: Element): void {
    let currentRenders: IRenderer[] | undefined;
    let currentUid: number | undefined;
    let currentUidMap: UidMap | undefined;
    this.forEachRenderers((renderConfig, { uid }, { uidMap }) => {
      renderConfig.renders?.forEach((render) => {
        if (render.getView() !== view) {
          return;
        }
        currentUidMap = uidMap;
        currentUid = uid;
        currentRenders = renderConfig.renders;
        render.unbind();
      });
    });
    if (!currentRenders) {
      return;
    }
    currentRenders = currentRenders!.filter(
      (render) => render.getView() !== view
    );
    if (currentRenders.length === 0) {
      currentUidMap?.delete(currentUid!);
    }
  }

  removeAllRenderer(): void {
    const renderMap = this.forEachRenderers(
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

  forEachRenderers(
    callbackfn: (
      renderConfig: RenderConfig,
      videoFrameCacheConfig: VideoFrameCacheConfig,
      maps: {
        channelMap: ChannelIdMap;
        uidMap: UidMap;
      }
    ) => void
  ): RenderMap {
    const renders = this._config.renderers;
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
    this._config.videoFrameUpdateInterval = setInterval(() => {
      this.forEachRenderers(renderFunc);
    }, 1000 / this._config.videoFps);
  }

  /**
   * @private
   * @ignore
   */
  stopRenderer(): void {
    if (this._config.videoFrameUpdateInterval) {
      clearInterval(this._config.videoFrameUpdateInterval);
      this._config.videoFrameUpdateInterval = undefined;
    }
  }

  /**
   * @private
   * @ignore
   */
  restartRenderer(): void {
    if (this._config.videoFrameUpdateInterval) {
      this.stopRenderer();
      this.startRenderer();
      logInfo(`setFps ${this._config.videoFps} restartInterval`);
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

    const renderers = this._config.renderers;
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

  setupViewContentMode(rendererConfig: RendererConfig): number {
    const {
      uid,
      channelId,
      rendererOptions,
      videoSourceType,
    }: RendererConfigInternal = getRendererConfigInternal(rendererConfig);

    const renderList = this.getRenderers({ uid, channelId, videoSourceType });
    renderList
      ? renderList.forEach((renderItem) =>
          renderItem.setContentMode(
            rendererOptions.contentMode,
            rendererOptions.mirror
          )
        )
      : console.warn(
          `RenderStreamType: ${videoSourceType} channelId:${channelId} uid:${uid} have no render view, you need to call this api after setView`
        );
    return 0;
  }
}

export { RendererManager };
