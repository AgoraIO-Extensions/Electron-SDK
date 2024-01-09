import { ErrorCodeType } from '../Private/AgoraBase';
import { RenderModeType, VideoSourceType } from '../Private/AgoraMediaBase';
import {
  AgoraElectronBridge,
  Channel,
  ChannelIdMap,
  FormatRendererVideoConfig,
  RENDER_MODE,
  RenderConfig,
  RenderMap,
  RendererVideoConfig,
  ShareVideoFrame,
  UidMap,
  VideoFrameCacheConfig,
} from '../Types';
import {
  AgoraEnv,
  formatConfigByVideoSourceType,
  getDefaultRendererVideoConfig,
  logDebug,
  logError,
  logInfo,
  logWarn,
} from '../Utils';

import { IRenderer } from './IRenderer';
import { IRendererManager } from './IRendererManager';
import { WebGLFallback, WebGLRenderer } from './WebGLRenderer';
import { YUVCanvasRenderer } from './YUVCanvasRenderer';

/**
 * @ignore
 */
export class RendererManager extends IRendererManager {
  /**
   * @ignore
   */
  isRendering = false;
  renderFps: number;
  /**
   * @ignore
   */
  videoFrameUpdateInterval?: NodeJS.Timer;
  /**
   * @ignore
   */
  renderers: RenderMap;
  /**
   * @ignore
   */
  renderMode?: RENDER_MODE;
  /**
   * @ignore
   */
  msgBridge: AgoraElectronBridge;
  /**
   * @ignore
   */
  defaultRenderConfig: RendererVideoConfig;

  constructor() {
    super();
    this.renderFps = 15;
    this.renderers = new Map();
    this.setRenderMode();
    this.msgBridge = AgoraEnv.AgoraElectronBridge;
    this.defaultRenderConfig = {
      rendererOptions: {
        contentMode: RenderModeType.RenderModeFit,
        mirror: false,
      },
    };
  }

  /**
   * Sets the channel mode of the current audio file.
   * In a stereo music file, the left and right channels can store different audio data. According to your needs, you can set the channel mode to original mode, left channel mode, right channel mode, or mixed channel mode. For example, in the KTV scenario, the left channel of the music file stores the musical accompaniment, and the right channel stores the singing voice. If you only need to listen to the accompaniment, call this method to set the channel mode of the music file to left channel mode; if you need to listen to the accompaniment and the singing voice at the same time, call this method to set the channel mode to mixed channel mode.Call this method after calling open .This method only applies to stereo audio files.
   *
   * @param mode The channel mode. See AudioDualMonoMode .
   *
   * @returns
   * 0: Success.< 0: Failure.
   */
  public setRenderMode(mode?: RENDER_MODE) {
    if (mode === undefined) {
      this.renderMode = this.checkWebglEnv()
        ? RENDER_MODE.WEBGL
        : RENDER_MODE.SOFTWARE;
      return;
    }

    if (mode !== this.renderMode) {
      this.renderMode = mode;
      logInfo(
        'setRenderMode:  new render mode will take effect only if new view bind to render'
      );
    }
  }

  /**
   * @ignore
   */
  public setFPS(fps: number) {
    this.renderFps = fps;
    this.restartRender();
  }

  /**
   * @ignore
   */
  public setRenderOption(
    view: HTMLElement,
    contentMode = RenderModeType.RenderModeFit,
    mirror: boolean = false
  ): void {
    if (!view) {
      logError('setRenderOption: view not exist', view);
    }
    this.forEachStream(({ renders }) => {
      renders?.forEach((render) => {
        if (render.equalsElement(view)) {
          render.setRenderOption({ contentMode, mirror });
        }
      });
    });
  }

  /**
   * @ignore
   */
  public setRenderOptionByConfig(rendererConfig: RendererVideoConfig): number {
    const {
      uid,
      channelId,
      rendererOptions,
      videoSourceType,
    }: FormatRendererVideoConfig =
      getDefaultRendererVideoConfig(rendererConfig);

    const renderList = this.getRenderers({ uid, channelId, videoSourceType });
    renderList
      ? renderList
          .filter((renderItem) => {
            if (rendererConfig.view) {
              return renderItem.equalsElement(rendererConfig.view);
            } else {
              return true;
            }
          })
          .forEach((renderItem) => renderItem.setRenderOption(rendererOptions))
      : logWarn(
          `RenderStreamType: ${videoSourceType} channelId:${channelId} uid:${uid} have no render view, you need to call this api after setView`
        );
    return ErrorCodeType.ErrOk;
  }

  /**
   * @ignore
   */
  public checkWebglEnv(): boolean {
    let flag = false;
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    try {
      const getContext = (
        contextNames = ['webgl2', 'webgl', 'experimental-webgl']
      ): WebGLRenderingContext | WebGLRenderingContext | null => {
        for (let i = 0; i < contextNames.length; i++) {
          const contextName = contextNames[i]!;
          const context = canvas?.getContext(contextName);
          if (context) {
            return context as WebGLRenderingContext | WebGLRenderingContext;
          }
        }
        return null;
      };
      let gl = getContext();
      flag = !!gl;
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      gl = null;
      logInfo('Your browser support webGL');
    } catch (e) {
      logWarn('Your browser may not support webGL');
      flag = false;
    }
    return flag;
  }

  /**
   * @ignore
   */
  public setupVideo(rendererVideoConfig: RendererVideoConfig): number {
    const formatConfig = getDefaultRendererVideoConfig(rendererVideoConfig);

    const { uid, channelId, videoSourceType, rendererOptions, view } =
      formatConfig;

    if (!formatConfig.view) {
      logWarn('setupVideo->destroyRenderersByConfig, because of view is null');
      this.destroyRenderersByConfig(videoSourceType, channelId, uid);
      return -ErrorCodeType.ErrInvalidArgument;
    }

    // ensure a render to RenderMap
    const render = this.bindHTMLElementToRender(formatConfig, view!);

    // render config
    render?.setRenderOption(rendererOptions);

    // enable iris videoFrame
    this.enableVideoFrameCache({
      uid,
      channelId,
      videoSourceType,
    });

    // enable render
    this.enableRender(true);
    return ErrorCodeType.ErrOk;
  }

  /**
   * @ignore
   */
  public setupLocalVideo(rendererConfig: RendererVideoConfig): number {
    const { videoSourceType } = rendererConfig;
    if (videoSourceType === VideoSourceType.VideoSourceRemote) {
      logError('setupLocalVideo videoSourceType error', videoSourceType);
      return -ErrorCodeType.ErrInvalidArgument;
    }
    this.setupVideo({ ...rendererConfig });
    return ErrorCodeType.ErrOk;
  }

  /**
   * @ignore
   */
  public setupRemoteVideo(rendererConfig: RendererVideoConfig): number {
    const { videoSourceType } = rendererConfig;
    if (videoSourceType !== VideoSourceType.VideoSourceRemote) {
      logError('setupRemoteVideo videoSourceType error', videoSourceType);
      return -ErrorCodeType.ErrInvalidArgument;
    }
    this.setupVideo({ ...rendererConfig });
    return ErrorCodeType.ErrOk;
  }

  /**
   * Destroys a video renderer object.
   *
   * @param view The HTMLElement object to be destroyed.
   */
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

  /**
   * @ignore
   */
  public destroyRenderersByConfig(
    videoSourceType: VideoSourceType,
    channelId?: Channel,
    uid?: number
  ): void {
    const config = formatConfigByVideoSourceType(
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

  /**
   * @ignore
   */
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

  /**
   * @ignore
   */
  public clear(): void {
    this.stopRender();
    this.removeAllRenderer();
  }

  /**
   * Enables/Disables the local video capture.
   * This method disables or re-enables the local video capture, and does not affect receiving the remote video stream.After calling enableVideo , the local video capture is enabled by default. You can call enableLocalVideo (false) to disable the local video capture. If you want to re-enable the local video capture, call enableLocalVideo(true).After the local video capturer is successfully disabled or re-enabled, the SDK triggers the onRemoteVideoStateChanged callback on the remote client.You can call this method either before or after joining a channel.This method enables the internal engine and is valid after leaving the channel.
   *
   * @param enabled Whether to enable the local video capture.true: (Default) Enable the local video capture.false: Disable the local video capture. Once the local video is disabled, the remote users cannot receive the video stream of the local user, while the local user can still receive the video streams of remote users. When set to false, this method does not require a local camera.
   *
   * @returns
   * 0: Success.< 0: Failure.
   */
  public enableRender(enabled = true): void {
    if (enabled && this.isRendering) {
      //is already _isRendering
    } else if (enabled && !this.isRendering) {
      this.startRenderer();
    } else {
      this.stopRender();
    }
  }

  /**
   * @ignore
   */
  public startRenderer(): void {
    this.isRendering = true;
    const renderFunc = (
      rendererItem: RenderConfig,
      { videoSourceType, channelId, uid }: VideoFrameCacheConfig
    ) => {
      const { renders } = rendererItem;
      if (!renders || renders?.length === 0) {
        return;
      }
      let finalResult = this.msgBridge.GetVideoFrame(
        rendererItem.shareVideoFrame
      );

      switch (finalResult.ret) {
        case 0:
          // GET_VIDEO_FRAME_CACHE_RETURN_TYPE::OK = 0,
          // everything is ok
          break;
        case 1: {
          // GET_VIDEO_FRAME_CACHE_RETURN_TYPE::RESIZED
          const { width, height, yStride, uStride, vStride } = finalResult;
          const newShareVideoFrame = this.resizeShareVideoFrame(
            videoSourceType,
            channelId,
            uid,
            width,
            height,
            yStride,
            uStride,
            vStride
          );
          rendererItem.shareVideoFrame = newShareVideoFrame;
          finalResult = this.msgBridge.GetVideoFrame(newShareVideoFrame);
          break;
        }
        case 2:
          // GET_VIDEO_FRAME_CACHE_RETURN_TYPE::NO_CACHE
          // setupVideo/AgoraView render before initialize
          // this.enableVideoFrameCache({ videoSourceType, channelId, uid });
          break;
        default:
          break;
      }
      if (finalResult.ret !== 0) {
        logDebug('GetVideoFrame ret is', finalResult.ret, rendererItem);
        return;
      }
      if (!finalResult.isNewFrame) {
        logDebug('GetVideoFrame isNewFrame is false', rendererItem);
        return;
      }
      const renderVideoFrame = rendererItem.shareVideoFrame;
      if (renderVideoFrame.width > 0 && renderVideoFrame.height > 0) {
        renders.forEach((renderItem) => {
          renderItem.drawFrame(rendererItem.shareVideoFrame);
        });
      }
    };
    const render = () => {
      this.forEachStream(renderFunc);
      this.videoFrameUpdateInterval = setTimeout(render, 1000 / this.renderFps);
    };
    render();
  }

  /**
   * @ignore
   */
  public stopRender(): void {
    this.isRendering = false;
    if (this.videoFrameUpdateInterval) {
      clearTimeout(this.videoFrameUpdateInterval);
      this.videoFrameUpdateInterval = undefined;
    }
  }

  /**
   * @ignore
   */
  public restartRender(): void {
    if (this.videoFrameUpdateInterval) {
      this.stopRender();
      this.startRenderer();
      logInfo(`restartRender: Fps: ${this.renderFps} restartInterval`);
    }
  }

  /**
   * @ignore
   */
  private createRenderer(
    renderMode?: RENDER_MODE,
    fallback?: WebGLFallback
  ): IRenderer {
    if (renderMode === RENDER_MODE.SOFTWARE) {
      return new YUVCanvasRenderer();
    } else {
      return new WebGLRenderer(fallback);
    }
  }

  /**
   * @ignore
   */
  private getRender({
    videoSourceType,
    channelId,
    uid,
  }: VideoFrameCacheConfig) {
    return this.renderers.get(videoSourceType)?.get(channelId)?.get(uid);
  }

  /**
   * @ignore
   */
  private getRenderers({
    videoSourceType,
    channelId,
    uid,
  }: VideoFrameCacheConfig): IRenderer[] {
    return this.getRender({ videoSourceType, channelId, uid })?.renders || [];
  }

  /**
   * @ignore
   */
  private bindHTMLElementToRender(
    config: FormatRendererVideoConfig,
    view: HTMLElement
  ): IRenderer | undefined {
    this.ensureRendererConfig(config);
    const renderers = this.getRenderers(config);
    const filterRenders =
      renderers?.filter((render) => render.equalsElement(view)) || [];
    const hasBeenAdd = filterRenders.length > 0;
    if (hasBeenAdd) {
      logWarn(
        'bindHTMLElementToRender: this view has bind to render',
        filterRenders
      );
      return filterRenders[0];
    }
    const renderer = this.createRenderer(
      this.renderMode,
      this.handleWebGLFallback(config)
    );
    renderer.bind(view);
    renderers.push(renderer);
    return renderer;
  }

  /**
   * @ignore
   */
  private handleWebGLFallback =
    (config: FormatRendererVideoConfig) => (renderer: WebGLRenderer) => {
      const { contentMode, mirror } = renderer;
      const view = renderer.parentElement!;
      const renderers = this.getRenderers(config);
      const index = renderers.indexOf(renderer);
      renderer.unbind();
      const newRenderer = this.createRenderer(RENDER_MODE.SOFTWARE);
      newRenderer.bind(view);
      newRenderer.setRenderOption({ contentMode, mirror });
      renderers.splice(index, 1, newRenderer);
    };

  /**
   * @ignore
   */
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

  /**
   * @ignore
   */
  private enableVideoFrameCache(
    videoFrameCacheConfig: VideoFrameCacheConfig
  ): void {
    logDebug(`enableVideoFrameCache ${JSON.stringify(videoFrameCacheConfig)}`);
    this.msgBridge.EnableVideoFrameCache(videoFrameCacheConfig);
  }

  /**
   * @ignore
   */
  private disableVideoFrameCache(
    videoFrameCacheConfig: VideoFrameCacheConfig
  ): void {
    logDebug(`disableVideoFrameCache ${JSON.stringify(videoFrameCacheConfig)}`);
    this.msgBridge.DisableVideoFrameCache(videoFrameCacheConfig);
  }

  /**
   * @ignore
   */
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

  /**
   * @ignore
   */
  private resizeShareVideoFrame(
    videoSourceType: VideoSourceType,
    channelId: string,
    uid: number,
    width = 0,
    height = 0,
    yStride = 0,
    uStride = 0,
    vStride = 0
  ): ShareVideoFrame {
    return {
      videoSourceType,
      channelId,
      uid,
      yBuffer: Buffer.alloc(yStride * height),
      uBuffer: Buffer.alloc((yStride * height) / 4),
      vBuffer: Buffer.alloc((yStride * height) / 4),
      width,
      height,
      yStride,
      uStride,
      vStride,
    };
  }

  /**
   * @ignore
   */
  public updateVideoFrameCacheInMap(
    config: VideoFrameCacheConfig,
    shareVideoFrame: ShareVideoFrame
  ): void {
    let rendererConfigMap = this.ensureRendererConfig(config);
    rendererConfigMap
      ? Object.assign(rendererConfigMap.get(config.uid) ?? {}, {
          shareVideoFrame,
        })
      : logWarn(
          `updateVideoFrameCacheInMap videoSourceType:${config.videoSourceType} channelId:${config.channelId} uid:${config.uid} rendererConfigMap is null`
        );
  }
}
