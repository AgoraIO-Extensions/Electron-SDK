import { NodeIrisRtcEngine } from "../Api/internal/native_interface";
import {
  logError,
  logInfo,
  logWarn,
  getRendererConfigInternal,
} from "../Utils";

import { IRenderer } from "./IRender";
import {
  CONTENT_MODE,
  RENDER_MODE,
  RendererConfig,
  User,
  VideoFrame,
  VideoFrameCacheConfig,
  VideoSourceType,
  Channel,
  RendererConfigInternal,
} from "./type";
import { YUVCanvasRenderer } from "./YUVCanvasRenderer";

class RendererManager {
  _config: {
    videoFps: number;
    videoFrameUpdateInterval?: NodeJS.Timeout;
    renderers: Map<
      string,
      Map<
        number,
        {
          render?: IRenderer[];
          cachedVideoFrame?: VideoFrame;
        }
      >
    >;
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

  resizeBuffer(
    uid: number,
    channelId: string,
    yStride: number,
    height: number
  ): VideoFrame {
    return {
      uid,
      channelId,
      yBuffer: Buffer.alloc(yStride * height),
      uBuffer: Buffer.alloc((yStride * height) / 4),
      vBuffer: Buffer.alloc((yStride * height) / 4),
      yStride,
      width: 0,
      height,
    };
  }

  /**
   * @private
   * @ignore
   */
  setRenderer(rendererConfig: RendererConfigInternal): void {
    const { uid, channelId } = rendererConfig;
    let _renders = this.getRenderer(uid, channelId);

    if (_renders && _renders.length > 0) {
      rendererConfig.rendererOptions?.append
        ? _renders.forEach((item) => {
            if (rendererConfig.view) {
              if (item.equalsElement(rendererConfig.view)) {
                console.warn("setVideoView: this view exists in list, ignore");
                return;
              }
            }
          })
        : this.removeRenderer(uid, channelId);
    }

    let config: VideoFrameCacheConfig = {
      uid,
      channelId,
      width: 0,
      height: 0,
    };

    this.enableVideoFrameCache(config);
    this.addRenderer(uid, rendererConfig.view!, channelId);
    this.setupViewContentMode(rendererConfig);
  }

  /**
   * @private
   * @ignore
   */
  createRenderer(): IRenderer {
    return new YUVCanvasRenderer(this._config.renderMode === RENDER_MODE.WEBGL);
  }

  /**
   * @private
   * @ignore
   */
  addRenderer(uid: number, view: Element, channelId: Channel): void {
    let rendererMap = this.ensureRendererMap(uid, channelId);

    let renderer = this.createRenderer();
    renderer.bind(view);
    rendererMap?.get(uid)?.render?.push(renderer);
  }

  /**
   * @private
   * @ignore
   */
  getRenderer(uid: number, channelId: Channel = ""): IRenderer[] | undefined {
    return this._config.renderers.get(channelId)?.get(uid)?.render;
  }

  removeRenderer(uid: number, channelId: Channel = ""): void {
    let videoFramCacheConfig: VideoFrameCacheConfig = {
      uid,
      channelId,
    };
    this.disableVideoFrameCache(videoFramCacheConfig);
    this.removeVideoFrameCacheFromMap(uid, channelId);
    this._config.renderers
      .get(channelId)
      ?.get(uid)
      ?.render?.forEach((renderItem) => {
        renderItem.unbind();
      });

    this._config.renderers.get(channelId)?.delete(uid);
  }

  removeAllRenderer(): void {
    this._config.renderers.forEach((renderMap, channelId) => {
      renderMap.forEach((renderObject, uid) => {
        let videoFramCacheConfig: VideoFrameCacheConfig = {
          uid,
          channelId,
        };

        this.disableVideoFrameCache(videoFramCacheConfig);
        this.removeVideoFrameCacheFromMap(uid, channelId);
        renderObject.render?.forEach((renderItem) => {
          renderItem.unbind();
        });
        renderMap.delete(uid);
      });
      this._config.renderers.delete(channelId);
    });
    this._config.renderers.clear();
  }

  /**
   * @private
   * @ignore
   */
  startRenderer(): void {
    this._config.videoFrameUpdateInterval = setInterval(() => {
      this._config.renderers.forEach((rendererCache, channelId) => {
        rendererCache.forEach((rendererItem, uid) => {
          let cachedVideoFrame = rendererItem.cachedVideoFrame;
          if (!cachedVideoFrame) {
            logWarn(
              `Channel: ${channelId} Uid: ${uid} have no cachedVideoFrame`
            );
            return;
          }

          let retObj;
          retObj = this._rtcEngine.GetVideoStreamData(cachedVideoFrame);

          if (!retObj || !retObj.ret) {
            logWarn(`Channel: ${channelId} Uid: ${uid} have no stream`);
            return;
          }

          if (!retObj.isNewFrame) return;

          let render = this.getRenderer(uid, cachedVideoFrame.channelId);
          let videoFrame: VideoFrame = {
            width: retObj.width,
            height: retObj.height,
            yBuffer: cachedVideoFrame.yBuffer,
            uBuffer: cachedVideoFrame.uBuffer,
            vBuffer: cachedVideoFrame.vBuffer,
            mirror: false,
            yStride: retObj.yStride,
            rotation: retObj.rotation,
          };

          if (render) {
            render.forEach((renderItem) => {
              renderItem.drawFrame(videoFrame);
            });
          } else {
            logWarn(`Channel: ${channelId} Uid: ${uid} have no renderer`);
          }
        });
      });
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

  ensureRendererMap(
    uid: number,
    channelId: string
  ):
    | Map<
        number,
        {
          cachedVideoFrame?: VideoFrame;
          render?: IRenderer[];
        }
      >
    | undefined {
    let rendererMap = this._config.renderers.get(channelId);
    if (!rendererMap) {
      this._config.renderers.set(channelId, new Map([[uid, { render: [] }]]));
      logWarn(
        `ensureRendererMap channel map for channelId:${channelId}  uid:${uid}`
      );
    }
    rendererMap = this._config.renderers.get(channelId);
    const uidMap = rendererMap?.get(uid);
    if (!uidMap) {
      rendererMap?.set(uid, { render: [] });
      logWarn(
        `ensureRendererMap uid map for channelId:${channelId}  uid:${uid}`
      );
    }
    return rendererMap;
  }

  addVideoFrameCacheToMap(
    uid: number,
    channelId: string,
    videoFrame: VideoFrame
  ): void {
    let rendererMap = this.ensureRendererMap(uid, channelId);
    rendererMap
      ? Object.assign(rendererMap.get(uid), {
          cachedVideoFrame: videoFrame,
        })
      : logWarn(
          `addVideoFrameCacheToMap rendererMap ${channelId}  ${uid} is null`
        );
  }

  removeVideoFrameCacheFromMap(uid: number, channelId: string): void {
    let rendererMap = this._config.renderers.get(channelId);
    let rendererItem = rendererMap?.get(uid);
    rendererItem
      ? Object.assign(rendererItem, { cachedVideoFrame: undefined })
      : logWarn(
          `removeVideoFrameCacheFromMap rendererItem ${channelId}  ${uid} is null`
        );
  }

  setupViewContentMode(rendererConfig: RendererConfig): number {
    const {
      uid,
      channelId,
      rendererOptions,
      videoSourceType,
    }: RendererConfigInternal = getRendererConfigInternal(rendererConfig);

    const renderList = this.getRenderer(uid, channelId);
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
