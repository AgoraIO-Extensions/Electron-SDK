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
  private _rendererCaches: RendererCache[];
  /**
   * @ignore
   */
  private _context: RendererContext;

  constructor() {
    this._renderingFps = 60;
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
    this.clearRendererCache();
    logInfo('[FPS_INFO] 渲染管理已释放');
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
