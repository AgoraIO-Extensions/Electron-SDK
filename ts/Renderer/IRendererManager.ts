import { VideoMirrorModeType } from '../Private/AgoraBase';
import { RenderModeType } from '../Private/AgoraMediaBase';
import { RendererContext, RendererType } from '../Types';

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
    this._renderingFps = 15;
    this._rendererCaches = [];
    this._context = {
      renderMode: RenderModeType.RenderModeHidden,
      mirrorMode: VideoMirrorModeType.VideoMirrorModeDisabled,
    };
  }

  public set renderingFps(fps: number) {
    if (this._renderingFps !== fps) {
      this._renderingFps = fps;
      if (this._renderingTimer) {
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

  public release(): void {
    this.stopRendering();
    this.clearRendererCache();
  }

  public addRendererToCache(context: RendererContext): RendererCache {
    let rendererCache = this.getRendererCache(context);
    if (rendererCache) {
      rendererCache.addRenderer(this.createRenderer(context));
    } else {
      rendererCache = new RendererCache(context);
      rendererCache.enable();
      this._rendererCaches.push(rendererCache);
    }
    this.startRendering();
    return rendererCache;
  }

  public removeRendererFromCache(context: RendererContext): void {
    const rendererCache = this.getRendererCache(context);
    if (!rendererCache) return;
    if (context.view) {
      const renderer = rendererCache.findRenderer(context.view);
      if (!renderer) return;
      rendererCache.removeRenderer(renderer);
    } else {
      rendererCache.disable();
      this._rendererCaches = this._rendererCaches.filter(
        (it) => it !== rendererCache
      );
    }
  }

  public clearRendererCache(): void {
    for (const rendererCache of this._rendererCaches) {
      rendererCache.disable();
    }
    this._rendererCaches = [];
  }

  public getRendererCache(context: RendererContext): RendererCache | undefined {
    return this._rendererCaches.find(
      (cache) => cache.key === generateRendererCacheKey(context)
    );
  }

  public getRenderers(context: RendererContext): IRenderer[] {
    return this.getRendererCache(context)?.renderers || [];
  }

  protected abstract createRenderer(
    context: RendererContext,
    rendererType?: RendererType
  ): IRenderer;

  public startRendering(): void {
    if (this._renderingTimer) return;

    const renderingLooper = () => {
      // If there is no renderer, stop rendering
      if (this._rendererCaches.length === 0) {
        this.stopRendering();
        return;
      }

      for (const rendererCache of this._rendererCaches) {
        this.doRendering(rendererCache);
      }
      this._renderingTimer = window.setTimeout(
        renderingLooper,
        1000 / this.renderingFps
      );
    };
    renderingLooper();
  }

  public abstract doRendering(rendererCache: RendererCache): void;

  public stopRendering(): void {
    if (this._renderingTimer) {
      window.clearTimeout(this._renderingTimer);
      this._renderingTimer = undefined;
    }
  }

  public setRendererContext(context: RendererContext): void {
    for (const rendererCache of this._rendererCaches) {
      rendererCache.setRendererContext(context);
    }
  }
}
