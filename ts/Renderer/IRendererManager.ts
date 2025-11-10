import { VideoMirrorModeType, VideoViewSetupMode } from '../Private/AgoraBase';
import { RenderModeType, VideoSourceType } from '../Private/AgoraMediaBase';
import { RendererContext, RendererType } from '../Types';
import { logInfo } from '../Utils';

import { IRenderer } from './IRenderer';
import { RendererCache, generateRendererCacheKey } from './RendererCache';

/**
 * @ignore
 */
export abstract class IRendererManager {
  /**
   * @ignore
   */
  private _renderingFps: number;
  /**
   * @ignore
   */
  private _currentFrameCount: number;
  /**
   * @ignore
   */
  private _previousFirstFrameTime: number;
  /**
   * @ignore
   */
  private _renderingTimer?: number;
  /**
   * @ignore
   */
  private _rendererCaches: RendererCache[];
  /**
   * @ignore
   */
  private _context: RendererContext;

  constructor() {
    this._renderingFps = 30;
    this._currentFrameCount = 0;
    this._previousFirstFrameTime = 0;
    this._rendererCaches = [];
    this._context = {
      renderMode: RenderModeType.RenderModeHidden,
      mirrorMode: VideoMirrorModeType.VideoMirrorModeDisabled,
    };
  }

  public set renderingFps(fps: number) {
    if (this._renderingFps !== fps) {
      logInfo('[FPS_INFO] 帧率设置变更:', this._renderingFps, '->', fps);
      this._renderingFps = fps;

      // 更新所有渲染缓存的帧率
      for (const rendererCache of this._rendererCaches) {
        rendererCache.renderingFps = fps;
      }

      // 如果数据获取循环正在运行，重启它以应用新帧率
      if (this._renderingTimer) {
        logInfo('[FPS_INFO] 重启数据获取循环以应用新帧率');
        this.stopRendering();
        this.startRendering();
      }
    }
  }

  public get renderingFps(): number {
    return this._renderingFps;
  }

  public set defaultChannelId(channelId: string) {
    this._context.channelId = channelId;
  }

  public get defaultChannelId(): string {
    return this._context.channelId ?? '';
  }

  public get defaultRenderMode(): RenderModeType {
    return this._context.renderMode!;
  }

  public get defaultMirrorMode(): VideoMirrorModeType {
    return this._context.mirrorMode!;
  }

  public release(): void {
    this.stopRendering();
    this.clearRendererCache();
  }

  private precheckRendererContext(context: RendererContext): RendererContext {
    let {
      sourceType,
      uid,
      channelId,
      mediaPlayerId,
      renderMode = this.defaultRenderMode,
      mirrorMode = this.defaultMirrorMode,
    } = context;
    switch (sourceType) {
      case VideoSourceType.VideoSourceRemote:
        if (uid === undefined) {
          throw new Error('uid is required');
        }
        channelId = channelId ?? this.defaultChannelId;
        break;
      case VideoSourceType.VideoSourceMediaPlayer:
        if (mediaPlayerId === undefined) {
          throw new Error('mediaPlayerId is required');
        }
        channelId = '';
        uid = mediaPlayerId;
        break;
      case undefined:
        if (uid) {
          sourceType = VideoSourceType.VideoSourceRemote;
        }
        break;
      default:
        channelId = '';
        uid = 0;
        break;
    }
    return { ...context, sourceType, uid, channelId, renderMode, mirrorMode };
  }

  public addOrRemoveRenderer(
    context: RendererContext
  ): RendererCache | undefined {
    // To be compatible with the old API
    let { setupMode = VideoViewSetupMode.VideoViewSetupAdd } = context;
    if (!context.view) setupMode = VideoViewSetupMode.VideoViewSetupRemove;
    switch (setupMode) {
      case VideoViewSetupMode.VideoViewSetupAdd:
        return this.addRendererToCache(context);
      case VideoViewSetupMode.VideoViewSetupRemove:
        this.removeRendererFromCache(context);
        return undefined;
      case VideoViewSetupMode.VideoViewSetupReplace:
        this.removeRendererFromCache(context);
        return this.addRendererToCache(context);
    }
  }

  private addRendererToCache(
    context: RendererContext
  ): RendererCache | undefined {
    const checkedContext = this.precheckRendererContext(context);

    if (!checkedContext.view) return undefined;

    if (this.findRenderer(checkedContext.view)) {
      throw new Error('You have already added this view to the renderer');
    }

    const startTime = performance.now();
    let rendererCache = this.getRendererCache(checkedContext);
    if (!rendererCache) {
      rendererCache = new RendererCache(checkedContext);
      this._rendererCaches.push(rendererCache);

      // 设置新渲染缓存的帧率
      rendererCache.renderingFps = this._renderingFps;

      // 如果主数据获取循环已经在运行，则启动这个新渲染缓存的独立渲染循环
      if (this._renderingTimer) {
        rendererCache.startRendering();
      }

      logInfo(
        '[FPS_INFO] 创建新的渲染器:',
        '类型:',
        checkedContext.sourceType,
        'UID:',
        checkedContext.uid,
        '通道:',
        checkedContext.channelId || '默认'
      );
    }

    const renderer = this.createRenderer(checkedContext);
    rendererCache.addRenderer(renderer);

    const endTime = performance.now();
    logInfo(
      '[FPS_INFO] 添加渲染器:',
      '耗时:',
      (endTime - startTime).toFixed(2) + 'ms',
      '当前渲染器数:',
      rendererCache.renderers.length
    );

    this.startRendering();
    return rendererCache;
  }

  public removeRendererFromCache(context: RendererContext): void {
    const checkedContext = this.precheckRendererContext(context);

    const rendererCache = this.getRendererCache(checkedContext);
    if (rendererCache) {
      if (checkedContext.view) {
        const renderer = rendererCache.findRenderer(checkedContext.view);
        if (!renderer) return;
        rendererCache.removeRenderer(renderer);
      } else {
        rendererCache.removeRenderer();
      }
      if (rendererCache.renderers.length === 0) {
        // 停止独立渲染循环
        rendererCache.stopRendering();

        // 从渲染缓存列表中移除
        this._rendererCaches.splice(
          this._rendererCaches.indexOf(rendererCache),
          1
        );
      }
    } else {
      this._rendererCaches = this._rendererCaches.filter((_rendererCache) => {
        const renderer = _rendererCache.findRenderer(checkedContext.view);
        if (renderer) {
          _rendererCache.removeRenderer(renderer);
        }
        return _rendererCache.renderers.length > 0;
      });
    }
  }

  public clearRendererCache(): void {
    for (const rendererCache of this._rendererCaches) {
      // 停止独立渲染循环
      rendererCache.stopRendering();

      // 移除所有渲染器
      rendererCache.removeRenderer();
    }
    this._rendererCaches.splice(0);
  }

  public getRendererCache(context: RendererContext): RendererCache | undefined {
    return this._rendererCaches.find(
      (cache) => cache.key === generateRendererCacheKey(context)
    );
  }

  public getRenderers(context: RendererContext): IRenderer[] {
    return this.getRendererCache(context)?.renderers || [];
  }

  public findRenderer(view: Element): IRenderer | undefined {
    for (const rendererCache of this._rendererCaches) {
      const renderer = rendererCache.findRenderer(view);
      if (renderer) return renderer;
    }
    return undefined;
  }

  protected abstract createRenderer(
    context: RendererContext,
    rendererType?: RendererType
  ): IRenderer;

  public startRendering(): void {
    if (this._renderingTimer) return;

    logInfo('[FPS_INFO] 开始数据获取循环，目标帧率:', this._renderingFps);

    // 首先为所有渲染缓存启动独立的渲染循环
    for (const rendererCache of this._rendererCaches) {
      rendererCache.renderingFps = this._renderingFps;
      rendererCache.startRendering();
    }

    // 数据获取循环
    const dataFetchLooper = () => {
      const loopStartTime = performance.now();

      if (this._previousFirstFrameTime === 0) {
        // Get the current time as the time of the first frame of per second
        this._previousFirstFrameTime = loopStartTime;
        // Reset the frame count
        this._currentFrameCount = 0;
        logInfo(
          '[FPS_INFO] 重置帧计数和时间基准点:',
          this._previousFirstFrameTime
        );
      }

      // Increase the frame count
      ++this._currentFrameCount;

      // Get the current time
      const currentFrameTime = performance.now();
      // Calculate the time difference between the current frame and the previous frame
      const deltaTime = currentFrameTime - this._previousFirstFrameTime;
      // Calculate the expected time of the current frame
      const expectedTime =
        (this._currentFrameCount * 1000) / this._renderingFps;

      // 详细的帧率调试信息
      logInfo(
        '[FPS_INFO]',
        '帧数:',
        this._currentFrameCount,
        '目标帧率:',
        this._renderingFps,
        '预期时间:',
        expectedTime.toFixed(2) + 'ms', //帧的预期时间，参数为毫秒
        '实际时间差:',
        deltaTime.toFixed(2) + 'ms', //帧的实际时间差，时间差是正数表示延迟，负数表示超前,参数为毫秒
        '延迟:',
        (deltaTime - expectedTime).toFixed(2) + 'ms' //帧的延迟，参数为毫秒
      );

      if (this._rendererCaches.length === 0) {
        // If there is no renderer, stop rendering
        logInfo('[FPS_INFO] 没有渲染器，停止数据获取循环');
        this.stopRendering();
        return;
      }

      // 只获取数据，不渲染
      const fetchStartTime = performance.now();
      let fetchedCount = 0;

      for (const rendererCache of this._rendererCaches) {
        // 只获取数据，渲染由每个rendererCache自己的循环负责
        rendererCache.fetchVideoFrame();
        fetchedCount++;
      }

      const fetchEndTime = performance.now();
      const fetchTime = fetchEndTime - fetchStartTime;

      logInfo(
        '[FPS_INFO] 数据获取性能:',
        '渲染缓存数量:',
        fetchedCount,
        '获取耗时:',
        fetchTime.toFixed(2) + 'ms'
      );

      if (this._currentFrameCount >= this.renderingFps) {
        logInfo('[FPS_INFO] 达到每秒帧数限制，重置计数器');
        this._previousFirstFrameTime = 0;
      }

      if (deltaTime < expectedTime) {
        // If the time difference between the current frame and the previous frame is less than the expected time, then wait for the difference
        const waitTime = expectedTime - deltaTime;
        logInfo('[FPS_INFO] 等待下一次数据获取:', waitTime.toFixed(2) + 'ms');

        this._renderingTimer = window.setTimeout(dataFetchLooper, waitTime);
      } else {
        // If the time difference between the current frame and the previous frame is greater than the expected time, then fetch immediately
        logInfo('[FPS_INFO] 数据获取延迟，立即获取下一帧');
        dataFetchLooper();
      }
    };
    dataFetchLooper();
  }

  public stopRendering(): void {
    // 停止主数据获取循环
    if (this._renderingTimer) {
      window.clearTimeout(this._renderingTimer);
      this._renderingTimer = undefined;
      logInfo('[FPS_INFO] 停止数据获取循环，清除定时器');

      // 记录最终帧率统计
      const totalTime = performance.now() - this._previousFirstFrameTime;
      if (totalTime > 0 && this._currentFrameCount > 0) {
        const actualFps = (this._currentFrameCount * 1000) / totalTime;
        logInfo(
          '[FPS_INFO] 数据获取循环统计:',
          '总帧数:',
          this._currentFrameCount,
          '总时间:',
          totalTime.toFixed(2) + 'ms',
          '实际帧率:',
          actualFps.toFixed(2) + 'fps',
          '目标帧率:',
          this._renderingFps + 'fps',
          '帧率差异:',
          (actualFps - this._renderingFps).toFixed(2)
        );
      }
    }

    // 停止所有渲染缓存的独立渲染循环
    for (const rendererCache of this._rendererCaches) {
      rendererCache.stopRendering();
    }
  }

  public setRendererContext(context: RendererContext): boolean {
    const checkedContext = this.precheckRendererContext(context);

    for (const rendererCache of this._rendererCaches) {
      const result = rendererCache.setRendererContext(checkedContext);
      if (result) {
        return true;
      }
    }
    return false;
  }
}
