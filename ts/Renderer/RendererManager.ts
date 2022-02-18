import { NodeIrisRtcEngine } from "../Api/internal/native_interface";
import { IrisVideoSourceType, PROCESS_TYPE } from "../Api/internal/native_type";
import { logError, logInfo, logWarn } from "../Utils";

import { IRenderer } from "./IRender";
import {
  Channel,
  CONTENT_MODE,
  RENDER_MODE,
  RendererConfig,
  User,
  VideoFrame,
  VideoFrameCacheConfig,
} from "./type";
import { YUVCanvasRenderer } from "./YUVCanvasRenderer";

class RendererManager {
  _config: {
    videoFps: number;
    videoFrameUpdateInterval?: NodeJS.Timeout;
    renderers: Map<
      string,
      Map<
        string,
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

  /**
   * @private
   * @ignore
   */
  setRenderer(rendererConfig: RendererConfig): void {
    let _renders = this.getRenderer(
      rendererConfig.user,
      rendererConfig.channelId
    );

    if (_renders) {
      rendererConfig.rendererOptions?.append
        ? _renders.forEach((item) => {
            if (rendererConfig.view) {
              if (item.equalsElement(rendererConfig.view)) {
                console.warn("setVideoView: this view exists in list, ignore");
                return;
              }
            }
          })
        : this.removeRenderer(rendererConfig.user, rendererConfig.channelId);
    }

    let config: VideoFrameCacheConfig = {
      user: rendererConfig.user,
      channelId: rendererConfig.channelId ? rendererConfig.channelId : "",
      width: 0,
      height: 0,
    };

    rendererConfig.user === "local" || rendererConfig.user === "videoSource"
      ? Object.assign(config, { channelId: "" })
      : {};

    this.enableVideoFrameCache(config);
    this.addRenderer(
      rendererConfig.user,
      rendererConfig.view!,
      rendererConfig.channelId!
    );
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
  addRenderer(user: User, view: Element, channelId: Channel): void {
    let rendererMap = this.ensureRendererMap(user, channelId);
    if (!rendererMap?.get(String(user))) {
      rendererMap?.set(String(user), { render: [] });
    }

    let renderer = this.createRenderer();
    renderer.bind(view);
    rendererMap?.get(String(user))?.render?.push(renderer);
  }

  /**
   * @private
   * @ignore
   */
  getRenderer(user: User, channelId: Channel = ""): IRenderer[] | undefined {
    return this._config.renderers.get(channelId)?.get(String(user))?.render;
  }

  removeRenderer(user: User, channelId: Channel = ""): void {
    let videoFramCacheConfig: VideoFrameCacheConfig = {
      user,
      channelId,
    };
    this.disableVideoFrameCache(videoFramCacheConfig);
    this.removeVideoFrameCacheFromMap(user, channelId);
    this._config.renderers
      .get(channelId)
      ?.get(String(user))
      ?.render?.forEach((renderItem) => {
        renderItem.unbind();
      });

    this._config.renderers.get(channelId)?.delete(String(user));
  }

  removeAllRenderer(): void {
    this._config.renderers.forEach((renderMap, channelId) => {
      renderMap.forEach((renderObject, user) => {
        let videoFramCacheConfig: VideoFrameCacheConfig = {
          user,
          channelId,
        };

        this.disableVideoFrameCache(videoFramCacheConfig);
        this.removeVideoFrameCacheFromMap(user, channelId);
        renderObject.render?.forEach((renderItem) => {
          renderItem.unbind();
        });
        renderMap.delete(user);
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
        rendererCache.forEach((rendererItem, user) => {
          let cachedVideoFrame = rendererItem.cachedVideoFrame;
          if (!cachedVideoFrame) {
            logWarn(
              `Channel: ${channelId} User: ${user} have no cachedVideoFrame`
            );
            return;
          }

          let retObj;
          if (user !== "videoSource") {
            retObj = this._rtcEngine.GetVideoStreamData(
              PROCESS_TYPE.MAIN,
              cachedVideoFrame
            );
          } else {
            retObj = this._rtcEngine.GetVideoStreamData(
              PROCESS_TYPE.SCREEN_SHARE,
              cachedVideoFrame
            );
          }

          if (!retObj || !retObj.ret) {
            logWarn(
              `Channel: ${channelId} User: ${user} uid: ${cachedVideoFrame.uid} have no stream`
            );
            return;
          }

          let render = this.getRenderer(user, cachedVideoFrame.channelId);
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
            logWarn(`Channel: ${channelId} User: ${user} have no renderer`);
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

  userToUid(user: User): number {
    let uid;
    if (user === "local") {
      uid = 0;
    } else if (user === "videoSource") {
      uid = 0;
    } else {
      uid = user as number;
    }

    return uid;
  }

  uidToUser(uid: number): User {
    let user: User;
    if (uid === 0) {
      user = "local";
    } else {
      user = String(uid);
    }
    /**
     * @todo
     */
    return user;
  }

  enableVideoFrameCache(videoFrameCacheConfig: VideoFrameCacheConfig): number {
    videoFrameCacheConfig.uid = videoFrameCacheConfig.user
      ? this.userToUid(videoFrameCacheConfig.user)
      : 0;
    switch (videoFrameCacheConfig.user) {
      case "local":
      case "videoSource":
        {
          videoFrameCacheConfig.videoSourceType =
            IrisVideoSourceType.kVideoSourceTypeCameraPrimary;
        }
        break;
      default:
        videoFrameCacheConfig.videoSourceType =
          IrisVideoSourceType.kVideoSourceTypeRemote;
        break;
    }
    logInfo(`enableVideoFrameCache ${JSON.stringify(videoFrameCacheConfig)}`);

    if (videoFrameCacheConfig.user === "videoSource") {
      let ret = this._rtcEngine.EnableVideoFrameCache(
        PROCESS_TYPE.SCREEN_SHARE,
        videoFrameCacheConfig
      );
      return ret.retCode;
    } else {
      logInfo(`enableVideoFrameCache ${JSON.stringify(videoFrameCacheConfig)}`);
      let ret = this._rtcEngine.EnableVideoFrameCache(
        PROCESS_TYPE.MAIN,
        videoFrameCacheConfig
      );
      return ret.retCode;
    }
  }

  disableVideoFrameCache(videoFrameCacheConfig: VideoFrameCacheConfig): number {
    videoFrameCacheConfig.uid = videoFrameCacheConfig.user
      ? this.userToUid(videoFrameCacheConfig.user)
      : 0;
    switch (videoFrameCacheConfig.user) {
      case "local":
      case "videoSource":
        {
          videoFrameCacheConfig.videoSourceType =
            IrisVideoSourceType.kVideoSourceTypeCameraPrimary;
        }
        break;
      default:
        videoFrameCacheConfig.videoSourceType =
          IrisVideoSourceType.kVideoSourceTypeRemote;
        break;
    }
    if (videoFrameCacheConfig.user === "videoSource") {
      logInfo(
        `disableVideoFrameCache ${JSON.stringify(videoFrameCacheConfig)}`
      );
      let ret = this._rtcEngine.DisableVideoFrameCache(
        PROCESS_TYPE.SCREEN_SHARE,
        videoFrameCacheConfig
      );
      return ret.retCode;
    } else {
      logInfo(
        `disableVideoFrameCache ${JSON.stringify(videoFrameCacheConfig)}`
      );
      let ret = this._rtcEngine.DisableVideoFrameCache(
        PROCESS_TYPE.MAIN,
        videoFrameCacheConfig
      );
      return ret.retCode;
    }
  }

  ensureRendererMap(
    user: User,
    channelId: string
  ):
    | Map<
        string,
        {
          cachedVideoFrame?: VideoFrame;
          render?: IRenderer[];
        }
      >
    | undefined {
    let rendererMap = this._config.renderers.get(channelId);
    if (!rendererMap) {
      logWarn(`ensureRendererMap for ${channelId}  ${user}`);
      this._config.renderers.set(channelId, new Map());
    }
    rendererMap = this._config.renderers.get(channelId);
    return rendererMap;
  }

  addVideoFrameCacheToMap(
    user: User,
    channelId: string,
    videoFrame: VideoFrame
  ): void {
    let rendererMap = this.ensureRendererMap(user, channelId);
    rendererMap
      ? Object.assign(rendererMap.get(String(user)), {
          cachedVideoFrame: videoFrame,
        })
      : logWarn(
          `addVideoFrameCacheToMap rendererMap ${channelId}  ${user} is null`
        );
  }

  removeVideoFrameCacheFromMap(user: User, channelId: string): void {
    let rendererMap = this._config.renderers.get(channelId);
    let rendererItem = rendererMap?.get(String(user));
    rendererItem
      ? Object.assign(rendererItem, { cachedVideoFrame: undefined })
      : logWarn(
          `removeVideoFrameCacheFromMap rendererItem ${channelId}  ${user} is null`
        );
  }

  getDefaultRenderConfig(): RendererConfig {
    let rendererConfig: RendererConfig = {
      user: "local",
      view: undefined,
      channelId: "",
      rendererOptions: {
        append: false,
        contentMode: CONTENT_MODE.FIT,
        mirror: false,
      },
    };
    return rendererConfig;
  }

  setupViewContentMode(rendererConfig: RendererConfig): number {
    let defaultConfig: RendererConfig = Object.assign(
      this.getDefaultRenderConfig(),
      rendererConfig
    );

    let renderList = this.getRenderer(
      rendererConfig.user,
      rendererConfig.channelId
    );
    renderList
      ? renderList.forEach((renderItem) =>
          renderItem.setContentMode(
            defaultConfig.rendererOptions!.contentMode,
            defaultConfig.rendererOptions!.mirror
          )
        )
      : console.warn(
          `User: ${defaultConfig.user} have no render view, you need to call this api after setView`
        );
    return 0;
  }
}

export { RendererManager };
