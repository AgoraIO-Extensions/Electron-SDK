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
  private _rafId?: number;

  /**
   * @ignore
   */
  private _lastFrameTime: number = 0;
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
    this._lastFrameTime = 0;
    this._rendererCaches = [];
    this._context = {
      renderMode: RenderModeType.RenderModeHidden,
      mirrorMode: VideoMirrorModeType.VideoMirrorModeDisabled,
    };
  }

  public set renderingFps(fps: number) {
    if (this._renderingFps !== fps) {
      logInfo('[FPS_INFO][RAF] 帧率设置变更:', this._renderingFps, '->', fps);
      this._renderingFps = fps;

      // 如果渲染循环正在运行，重启它以应用新帧率
      const isRendering = this._rafId !== undefined;
      if (isRendering) {
        logInfo('[FPS_INFO][RAF] 重启渲染循环以应用新帧率');
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
    if (this._rafId) return;

    logInfo('[FPS_INFO] 开始渲染循环，目标帧率:', this._renderingFps);

    // 使用requestAnimationFrame实现的渲染循环
    const rafRenderingLooper = (timestamp: number) => {
      // 计算帧间隔时间
      const frameInterval = 1000 / this._renderingFps; // 理想帧间隔时间，单位ms

      // 如果是首次调用或者需要重置
      if (this._previousFirstFrameTime === 0) {
        this._previousFirstFrameTime = timestamp;
        this._lastFrameTime = timestamp;
        this._currentFrameCount = 0;
        logInfo(
          '[FPS_INFO] 重置帧计数和时间基准点:',
          this._previousFirstFrameTime
        );
      }

      // 计算从上一帧到现在经过的时间
      const timeSinceLastFrame = timestamp - this._lastFrameTime;

      // 移除跳过渲染的逻辑，让它尽可能频繁地渲染
      // 记录每一帧的时间间隔，以便观察
      logInfo(
        '[FPS_INFO][RAF] 原生帧间隔:',
        timeSinceLastFrame.toFixed(2) + 'ms',
        '理想帧间隔:',
        frameInterval.toFixed(2) + 'ms'
      );

      // 简单更新上一帧的时间戳为当前时间
      this._lastFrameTime = timestamp;

      // 增加帧计数
      ++this._currentFrameCount;

      // 增加帧计数后直接进行帧率控制

      // 详细的帧率调试信息
      const idealFrameInterval = 1000 / this._renderingFps; // 理想帧间隔
      const frameIntervalDiff = timeSinceLastFrame - idealFrameInterval; // 实际与理想帧间隔的差异

      logInfo(
        '[FPS_INFO][RAF]',
        '时间:',
        new Date().toLocaleTimeString(),
        '帧数:',
        this._currentFrameCount,
        '目标帧率:',
        this._renderingFps,
        '理想帧间隔:',
        idealFrameInterval.toFixed(2) + 'ms',
        '实际帧间隔:',
        timeSinceLastFrame.toFixed(2) + 'ms',
        '帧间隔差异:',
        frameIntervalDiff.toFixed(2) + 'ms'
      );

      // 如果没有渲染器，停止渲染循环
      if (this._rendererCaches.length === 0) {
        logInfo('[FPS_INFO][RAF] 没有渲染器，停止渲染循环');
        this.stopRendering();
        return;
      }

      // 渲染所有渲染器
      const renderStartTime = performance.now();
      let renderedCount = 0;

      for (const rendererCache of this._rendererCaches) {
        this.doRendering(rendererCache);
        renderedCount += rendererCache.renderers.length;
      }

      const renderEndTime = performance.now();
      const renderTime = renderEndTime - renderStartTime;

      logInfo(
        '[FPS_INFO][RAF] 渲染性能:',
        '渲染器总数:',
        renderedCount,
        '渲染耗时:',
        renderTime.toFixed(2) + 'ms'
      );

      // 每秒重置一次计数器，用于FPS统计
      const secondsElapsed = (timestamp - this._previousFirstFrameTime) / 1000;
      if (secondsElapsed >= 1.0) {
        const actualFps = this._currentFrameCount / secondsElapsed;
        logInfo(
          '[FPS_INFO][RAF] 每秒统计:',
          '实际FPS:',
          actualFps.toFixed(2),
          '目标FPS:',
          this._renderingFps,
          '差异:',
          (actualFps - this._renderingFps).toFixed(2)
        );
        this._previousFirstFrameTime = timestamp;
        this._currentFrameCount = 0;
      }

      // 继续请求下一帧
      this._rafId = requestAnimationFrame(rafRenderingLooper);
    };

    // 启动渲染循环
    this._rafId = requestAnimationFrame(rafRenderingLooper);
  }

  public abstract doRendering(rendererCache: RendererCache): void;

  public stopRendering(): void {
    // 取消requestAnimationFrame
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = undefined;
      logInfo('[FPS_INFO][RAF] 停止渲染循环，取消动画帧');

      // 记录最终帧率统计
      const totalTime = performance.now() - this._previousFirstFrameTime;
      if (totalTime > 0 && this._currentFrameCount > 0) {
        const actualFps = (this._currentFrameCount * 1000) / totalTime;
        logInfo(
          '[FPS_INFO][RAF] 渲染循环统计:',
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

      // 重置状态
      this._lastFrameTime = 0;
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
