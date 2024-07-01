import { VideoMirrorModeType, VideoViewSetupMode } from '../Private/AgoraBase';
import { RenderModeType, VideoSourceType } from '../Private/AgoraMediaBase';
import { RendererContext, RendererType } from '../Types';
import { logDebug } from '../Utils';

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
    this._renderingFps = 15;
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

    let rendererCache = this.getRendererCache(checkedContext);
    if (!rendererCache) {
      rendererCache = new RendererCache(checkedContext);
      this._rendererCaches.push(rendererCache);
    }
    rendererCache.addRenderer(this.createRenderer(checkedContext));
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
    if (this._renderingTimer) return;

    const renderingLooper = () => {
      if (this._previousFirstFrameTime === 0) {
        // Get the current time as the time of the first frame of per second
        this._previousFirstFrameTime = performance.now();
        // Reset the frame count
        this._currentFrameCount = 0;
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
      logDebug(
        new Date().toLocaleTimeString(),
        'currentFrameCount',
        this._currentFrameCount,
        'expectedTime',
        expectedTime,
        'deltaTime',
        deltaTime
      );

      if (this._rendererCaches.length === 0) {
        // If there is no renderer, stop rendering
        this.stopRendering();
        return;
      }

      // Render all renderers
      for (const rendererCache of this._rendererCaches) {
        this.doRendering(rendererCache);
      }

      if (this._currentFrameCount >= this.renderingFps) {
        this._previousFirstFrameTime = 0;
      }

      if (deltaTime < expectedTime) {
        // If the time difference between the current frame and the previous frame is less than the expected time, then wait for the difference
        this._renderingTimer = window.setTimeout(
          renderingLooper,
          expectedTime - deltaTime
        );
      } else {
        // If the time difference between the current frame and the previous frame is greater than the expected time, then render immediately
        renderingLooper();
      }
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
