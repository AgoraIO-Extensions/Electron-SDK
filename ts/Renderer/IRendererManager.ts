import { WebCodecsRendererCache } from '../Decoder/WebCodecsRendererCache';

import { VideoMirrorModeType, VideoViewSetupMode } from '../Private/AgoraBase';
import { RenderModeType, VideoSourceType } from '../Private/AgoraMediaBase';
import { RendererCacheType, RendererContext, RendererType } from '../Types';
import { logDebug } from '../Utils';

import { IRenderer } from './IRenderer';
import { generateRendererCacheKey } from './IRendererCache';
import { RendererCache } from './RendererCache';

/**
 * @ignore
 */
export abstract class IRendererManager {
  /**
   * @ignore
   */
  private renderingFps: number;
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
  private _rendererCaches: RendererCacheType[];
  /**
   * @ignore
   */
  private _context: RendererContext;

  constructor() {
    this.renderingFps = 60;
    this._currentFrameCount = 0;
    this._previousFirstFrameTime = 0;
    this._rendererCaches = [];
    this._context = {
      renderMode: RenderModeType.RenderModeHidden,
      mirrorMode: VideoMirrorModeType.VideoMirrorModeDisabled,
    };
  }

  public setRenderingFps(fps: number) {
    this.renderingFps = fps;
    if (this._renderingTimer) {
      this.stopRendering();
      this.startRendering();
    }
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

  private presetRendererContext(context: RendererContext): RendererContext {
    //this is for preset default value
    context.renderMode = context.renderMode || this.defaultRenderMode;
    context.mirrorMode = context.mirrorMode || this.defaultMirrorMode;
    context.useWebCodecsDecoder = context.useWebCodecsDecoder || false;
    context.enableFps = context.enableFps || false;

    switch (context.sourceType) {
      case VideoSourceType.VideoSourceRemote:
        if (context.uid === undefined) {
          throw new Error('uid is required');
        }
        context.channelId = context.channelId ?? this.defaultChannelId;
        break;
      case VideoSourceType.VideoSourceMediaPlayer:
        if (context.mediaPlayerId === undefined) {
          throw new Error('mediaPlayerId is required');
        }
        context.channelId = '';
        context.uid = context.mediaPlayerId;
        break;
      case undefined:
        if (context.uid) {
          context.sourceType = VideoSourceType.VideoSourceRemote;
        }
        break;
      default:
        context.channelId = '';
        context.uid = 0;
        break;
    }
    return context;
  }

  public addOrRemoveRenderer(
    context: RendererContext
  ): RendererCacheType | undefined {
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
  ): RendererCacheType | undefined {
    const checkedContext = this.presetRendererContext(context);

    if (!checkedContext.view) return undefined;

    if (this.findRenderer(checkedContext.view)) {
      throw new Error('You have already added this view to the renderer');
    }

    let rendererCache = this.getRendererCache(checkedContext);
    if (!rendererCache) {
      if (context.useWebCodecsDecoder) {
        rendererCache = new WebCodecsRendererCache(checkedContext);
      } else {
        rendererCache = new RendererCache(checkedContext);
      }
      this._rendererCaches.push(rendererCache);
    }
    rendererCache.addRenderer(this.createRenderer(checkedContext));
    if (!context.useWebCodecsDecoder) {
      this.startRendering();
    }
    return rendererCache;
  }

  public removeRendererFromCache(context: RendererContext): void {
    const checkedContext = this.presetRendererContext(context);

    const rendererCache = this.getRendererCache(checkedContext);
    if (!rendererCache) return;
    if (checkedContext.view) {
      const renderer = rendererCache.findRenderer(checkedContext.view);
      if (!renderer) return;
      rendererCache.removeRenderer(renderer);
    } else {
      rendererCache.removeRenderer();
    }
    if (rendererCache.renderers.length === 0) {
      rendererCache.release();
      this._rendererCaches.splice(
        this._rendererCaches.indexOf(rendererCache),
        1
      );
    }
  }

  public clearRendererCache(): void {
    for (const rendererCache of this._rendererCaches) {
      rendererCache.release();
    }
    this._rendererCaches.splice(0);
  }

  public getRendererCache(
    context: RendererContext
  ): RendererCacheType | undefined {
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
      const expectedTime = (this._currentFrameCount * 1000) / this.renderingFps;
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

  public abstract doRendering(rendererCache: RendererCacheType): void;

  public stopRendering(): void {
    if (this._renderingTimer) {
      window.clearTimeout(this._renderingTimer);
      this._renderingTimer = undefined;
    }
  }

  public setRendererContext(context: RendererContext): boolean {
    const checkedContext = this.presetRendererContext(context);

    for (const rendererCache of this._rendererCaches) {
      const result = rendererCache.setRendererContext(checkedContext);
      if (result) {
        return true;
      }
    }
    return false;
  }
}
