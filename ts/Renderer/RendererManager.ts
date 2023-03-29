import { ErrorCodeType, VideoSourceType } from '../Private/AgoraBase';
import { RenderModeType } from '../Private/AgoraMediaBase';
import {
  AgoraElectronBridge,
  Channel,
  ChannelIdMap,
  FormatRendererVideoConfig,
  RENDER_MODE,
  RenderConfig,
  RendererVideoConfig,
  RenderMap,
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
import GlRenderer from './GlRenderer';
import { IRenderer, RenderFailCallback } from './IRenderer';
import { YUVCanvasRenderer } from './YUVCanvasRenderer';

/**
 * @ignore
 */
export class RendererManager {
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
  renderMode: RENDER_MODE;
  /**
   * @ignore
   */
  msgBridge: AgoraElectronBridge;
  /**
   * @ignore
   */
  defaultRenderConfig: RendererVideoConfig;

  /**
   * @ignore
   */
  constructor() {
    this.renderFps = 10;
    this.renderers = new Map();
    this.renderMode = this.checkWebglEnv()
      ? RENDER_MODE.WEBGL
      : RENDER_MODE.SOFTWARE;
    this.msgBridge = AgoraEnv.AgoraElectronBridge;
    this.defaultRenderConfig = {
      rendererOptions: {
        contentMode: RenderModeType.RenderModeFit,
        mirror: false,
      },
    };
  }

  /**
   * Sets dual-stream mode on the sender side.
   * The SDK enables the low-quality video stream auto mode on the sender by default, which is equivalent to calling this method and setting the mode to AutoSimulcastStream. If you want to modify this behavior, you can call this method and modify the mode to DisableSimulcastStream(never send low-quality video streams) or EnableSimulcastStream (always send low-quality video streams).The difference and connection between this method and enableDualStreamMode [1/3] is as follows:When calling this method and setting mode to DisableSimulcastStream, it has the same effect as enableDualStreamMode [1/3](false).When calling this method and setting mode to EnableSimulcastStream, it has the same effect as enableDualStreamMode [1/3](true).Both methods can be called before and after joining a channel. If they are used at the same time, the settings in the method called later shall prevail.
   *
   * @param mode The mode in which the video stream is sent. See SimulcastStreamMode .
   *
   * @returns
   * 0: Success.< 0: Failure.
   */
  setRenderMode(mode: RENDER_MODE) {
    this.renderMode = mode;
    logInfo(
      'setRenderMode:  new render mode will take effect only if new view bind to render'
    );
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

  public checkWebglEnv(): boolean {
    let gl;
    let canvas: HTMLCanvasElement = document.createElement('canvas');

    try {
      gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      logInfo('Your browser support webGL');
    } catch (e) {
      logWarn('Your browser may not support webGL');
      return false;
    }

    return !!gl;
  }

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
    render.setRenderOption(rendererOptions);

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

  public setupLocalVideo(rendererConfig: RendererVideoConfig): number {
    const { videoSourceType } = rendererConfig;
    if (videoSourceType === VideoSourceType.VideoSourceRemote) {
      logError('setupLocalVideo videoSourceType error', videoSourceType);
      return -ErrorCodeType.ErrInvalidArgument;
    }
    this.setupVideo({ ...rendererConfig });
    return ErrorCodeType.ErrOk;
  }

  public setupRemoteVideo(rendererConfig: RendererVideoConfig): number {
    const { videoSourceType } = rendererConfig;
    if (videoSourceType !== VideoSourceType.VideoSourceRemote) {
      logError('setupRemoteVideo videoSourceType error', videoSourceType);
      return -ErrorCodeType.ErrInvalidArgument;
    }
    this.setupVideo({ ...rendererConfig });
    return ErrorCodeType.ErrOk;
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
          // IRIS_VIDEO_PROCESS_ERR::ERR_OK = 0,
          // everything is ok
          break;
        case 1:
          // IRIS_VIDEO_PROCESS_ERR::ERR_NULL_POINTER = 1,
          break;
        case 2: {
          // IRIS_VIDEO_PROCESS_ERR::ERR_SIZE_NOT_MATCHING
          const { width, height } = finalResult;
          const newShareVideoFrame = this.resizeShareVideoFrame(
            videoSourceType,
            channelId,
            uid,
            width,
            height
          );
          rendererItem.shareVideoFrame = newShareVideoFrame;
          finalResult = this.msgBridge.GetVideoFrame(newShareVideoFrame);
          break;
        }
        case 5:
          // IRIS_VIDEO_PROCESS_ERR::ERR_BUFFER_EMPTY
          // setupVideo/AgoraView render before initialize
          this.enableVideoFrameCache({ videoSourceType, channelId, uid });
          return;
        default:
          return;
      }
      if (finalResult.ret !== 0) {
        logWarn('GetVideoFrame ret is', finalResult.ret, rendererItem);
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
      logInfo(`restartRender: Fps: ${this.renderFps} restartInterval`);
    }
  }

  private createRenderer(failCallback?: RenderFailCallback): IRenderer {
    if (this.renderMode === RENDER_MODE.SOFTWARE) {
      return new YUVCanvasRenderer();
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
    config: FormatRendererVideoConfig,
    view: HTMLElement
  ): IRenderer {
    this.ensureRendererConfig(config);
    const renders = this.getRenderers(config);
    const filterRenders =
      renders?.filter((render) => render.equalsElement(view)) || [];
    const hasBeenAdd = filterRenders.length > 0;
    if (hasBeenAdd) {
      logWarn(
        'bindHTMLElementToRender: this view has bind to render',
        filterRenders
      );
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
  ): void {
    logDebug(`enableVideoFrameCache ${JSON.stringify(videoFrameCacheConfig)}`);
    this.msgBridge.EnableVideoFrameCache(videoFrameCacheConfig);
  }

  private disableVideoFrameCache(
    videoFrameCacheConfig: VideoFrameCacheConfig
  ): void {
    logDebug(`disableVideoFrameCache ${JSON.stringify(videoFrameCacheConfig)}`);
    this.msgBridge.DisableVideoFrameCache(videoFrameCacheConfig);
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
      ? // @ts-ignore
        Object.assign(rendererConfigMap.get(config.uid), {
          shareVideoFrame,
        })
      : logWarn(
          `updateVideoFrameCacheInMap videoSourceType:${config.videoSourceType} channelId:${config.channelId} uid:${config.uid} rendererConfigMap is null`
        );
  }
}
