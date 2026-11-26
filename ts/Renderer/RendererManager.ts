import createAgoraRtcEngine from '../AgoraSdk';
import {
  VideoMirrorModeType,
  VideoStreamType,
  VideoViewSetupMode,
} from '../Private/AgoraBase';
import {
  RenderModeType,
  VideoModulePosition,
  VideoSourceType,
} from '../Private/AgoraMediaBase';
import {
  RendererCacheContext,
  RendererCacheType,
  RendererContext,
  RendererType,
} from '../Types';
import { AgoraEnv, isSupportWebGL, logInfo, logWarn } from '../Utils';

import { IRenderer } from './IRenderer';
import {
  IRendererCache,
  generateRendererCacheKey,
  isUseConnection,
} from './IRendererCache';
import { RendererCache } from './RendererCache';
import { WebCodecsRenderer } from './WebCodecsRenderer';
import { WebCodecsRendererCache } from './WebCodecsRendererCache';
import { VideoElementRenderer } from './VideoElementRenderer';
import {
  ENABLE_VIDEO_ELEMENT,
  isVideoElementRendererEnabled,
} from './RenderParameters';
import { WebGLFallback, WebGLRenderer } from './WebGLRenderer';
import { YUVCanvasRenderer } from './YUVCanvasRenderer';

type TimerHandle = number | ReturnType<typeof globalThis.setTimeout>;

class RenderLoopScheduler {
  private caches = new Set<IRendererCache>();
  private timer?: TimerHandle;

  public register(cache: IRendererCache): void {
    this.caches.add(cache);
    this.reschedule();
  }

  public unregister(cache: IRendererCache): void {
    this.caches.delete(cache);
    this.reschedule();
  }

  public clear(): void {
    this.caches.clear();
    this.reschedule();
  }

  private tick = () => {
    this.timer = undefined;
    const now = performance.now();

    for (const cache of this.caches) {
      if (cache.getTimeUntilNextRender(now) <= 0) {
        cache.runRenderCycle(now);
      }
    }

    this.reschedule();
  };

  private reschedule(): void {
    if (this.timer !== undefined) {
      window.clearTimeout(this.timer);
      this.timer = undefined;
    }

    if (this.caches.size === 0) {
      return;
    }

    const now = performance.now();
    let minDelay = Number.POSITIVE_INFINITY;

    for (const cache of this.caches) {
      minDelay = Math.min(minDelay, cache.getTimeUntilNextRender(now));
    }

    const delay = Number.isFinite(minDelay) ? Math.max(0, minDelay) : 0;
    this.timer = window.setTimeout(this.tick, delay);
  }
}

/**
 * @ignore
 */
export class RendererManager {
  /**
   * @ignore
   */
  renderingFps: number;
  /**
   * @ignore
   */
  private _rendererCaches: RendererCacheType[];
  /**
   * @ignore
   */
  private _context: RendererContext;

  /**
   * @ignore
   */
  private rendererType: RendererType;
  private renderLoopScheduler: RenderLoopScheduler;

  /**
   * Currently, the remote video frame is observed in the pre-renderer position and you can not change it.
   * the local video frame is observed in the pre-encoder position by default, and you can change it.
   * @ignore
   */
  private defaultObservedFramePosition: number =
    VideoModulePosition.PositionPreRenderer |
    VideoModulePosition.PositionPostCapturer;

  constructor() {
    this.renderingFps = 15;
    this._rendererCaches = [];
    this._context = {
      renderMode: RenderModeType.RenderModeHidden,
      mirrorMode: VideoMirrorModeType.VideoMirrorModeDisabled,
    };
    this.renderLoopScheduler = new RenderLoopScheduler();
    this.rendererType = isSupportWebGL()
      ? RendererType.WEBGL
      : RendererType.SOFTWARE;
  }

  public setRenderingFps(fps: number) {
    this.renderingFps = fps;
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
    this.renderLoopScheduler.clear();
  }

  public registerRendererCacheForScheduling(cache: RendererCache): void {
    this.renderLoopScheduler.register(cache);
  }

  public unregisterRendererCacheForScheduling(cache: RendererCache): void {
    this.renderLoopScheduler.unregister(cache);
  }

  private presetRendererContext(context: RendererContext): RendererContext {
    //this is for preset default value
    context.renderMode = context.renderMode || this.defaultRenderMode;
    context.mirrorMode = context.mirrorMode || this.defaultMirrorMode;
    context.useWebCodecsDecoder = context.useWebCodecsDecoder || false;
    context.enableFps = context.enableFps || false;
    context.position = context.position || this.defaultObservedFramePosition;
    context.enableAlphaMask = context.enableAlphaMask || false;

    if (!AgoraEnv.CapabilityManager?.webCodecsDecoderEnabled) {
      context.useWebCodecsDecoder = false;
    }

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
    const renderer = this.createRenderer(checkedContext);
    rendererCache.addRenderer(renderer);
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
      rendererCache.stopRendering();
      rendererCache.release();
      this._rendererCaches.splice(
        this._rendererCaches.indexOf(rendererCache),
        1
      );
    }
  }

  public clearRendererCache(): void {
    for (const rendererCache of this._rendererCaches) {
      rendererCache.stopRendering();
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

  public getRendererCachesBySourceType(
    sourceType: VideoSourceType
  ): RendererCacheType[] {
    return this._rendererCaches.filter(
      (cache) => cache.cacheContext.sourceType === sourceType
    );
  }

  public getRendererCaches(): RendererCacheType[] {
    return this._rendererCaches;
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

  protected createRenderer(
    context: RendererContext,
    rendererType: RendererType = this.rendererType
  ): IRenderer {
    let renderer: IRenderer;
    switch (rendererType) {
      case RendererType.WEBGL:
        if (context.useWebCodecsDecoder) {
          renderer = new WebCodecsRenderer();
        } else {
          const videoRenderer = this.useVideoElementRenderer(
            context,
            RendererType.WEBGL
          )
            ? this.createVideoElementRenderer(context)
            : undefined;
          if (videoRenderer) {
            renderer = videoRenderer;
          } else {
            renderer = new WebGLRenderer(
              this.handleWebGLFallback(context).bind(this)
            );
            renderer.bind(context);
          }
        }
        break;
      case RendererType.SOFTWARE: {
        // No WebGL, e.g. hardware acceleration off on a Chromium that no longer falls back to
        // SwiftShader WebGL (deprecated since Chromium 137). <video> does not need WebGL.
        const videoRenderer = this.useVideoElementRenderer(
          context,
          RendererType.SOFTWARE
        )
          ? this.createVideoElementRenderer(context)
          : undefined;
        if (videoRenderer) {
          renderer = videoRenderer;
        } else {
          renderer = new YUVCanvasRenderer();
          renderer.bind(context);
        }
        break;
      }
      default:
        throw new Error('Unknown renderer type');
    }

    renderer.setContext(context);
    return renderer;
  }

  /**
   * MediaStreamTrackGenerator is a Chromium-only API: if constructing the <video> renderer fails
   * (API renamed, removed or worker-only in a later Chromium), fall back to WebGL.
   */
  private createVideoElementRenderer(
    context: RendererContext
  ): IRenderer | undefined {
    const renderer = new VideoElementRenderer();
    try {
      renderer.bind(context);
      return renderer;
    } catch (e) {
      logWarn('VideoElementRenderer bind failed, fall back to WebGL', e);
      try {
        renderer.unbind();
      } catch (e2) {
        // nothing to clean up
      }
      return undefined;
    }
  }

  /**
   * electron.video.render.enable_video_element: views (local, remote, media player alike) are
   * rendered into a <video>, whether the default renderer is WebGL or SOFTWARE. Views with an
   * alpha mask and environments without MediaStreamTrackGenerator / VideoFrame keep `otherwise`.
   */
  private useVideoElementRenderer(
    context: RendererContext,
    otherwise: RendererType
  ): boolean {
    const enabled = isVideoElementRendererEnabled();
    const use =
      enabled && !context.enableAlphaMask && VideoElementRenderer.isSupported();
    logInfo(
      'createRenderer',
      `sourceType=${context.sourceType} uid=${context.uid}`,
      `${ENABLE_VIDEO_ELEMENT}=${enabled}`,
      `rendererType=${use ? RendererType.VIDEOELEMENT : otherwise}`
    );
    return use;
  }

  private handleWebGLFallback(context: RendererContext): WebGLFallback {
    return (renderer: WebGLRenderer) => {
      const renderers = this.getRenderers(context);
      renderer.unbind();
      const newRenderer = this.createRenderer(context, RendererType.SOFTWARE);
      renderers.splice(renderers.indexOf(renderer), 1, newRenderer);
    };
  }

  public handleWebCodecsFallback(context: RendererCacheContext): void {
    let engine = createAgoraRtcEngine();
    engine.getMediaEngine().unregisterVideoEncodedFrameObserver({});
    if (context.uid) {
      if (isUseConnection(context)) {
        engine.setRemoteVideoSubscriptionOptionsEx(
          context.uid,
          {
            type: VideoStreamType.VideoStreamHigh,
            encodedFrameOnly: false,
          },
          {
            channelId: context.channelId,
            localUid: context.localUid,
          }
        );
      } else {
        engine.setRemoteVideoSubscriptionOptions(context.uid, {
          type: VideoStreamType.VideoStreamHigh,
          encodedFrameOnly: false,
        });
      }
    }
    AgoraEnv.enableWebCodecsDecoder = false;
    AgoraEnv.CapabilityManager?.setWebCodecsDecoderEnabled(false);
    let renderers = this.getRenderers(context);
    for (let renderer of renderers) {
      this.addOrRemoveRenderer({
        ...renderer.context,
        setupMode: VideoViewSetupMode.VideoViewSetupReplace,
      });
    }
  }

  public setRendererContext(context: RendererContext): boolean {
    const checkedContext = this.presetRendererContext(context);

    if (checkedContext.view) {
      const renderer = this.findRenderer(checkedContext.view);
      if (
        renderer?.rendererType === RendererType.WEBGL &&
        renderer.context.enableAlphaMask !== checkedContext.enableAlphaMask
      ) {
        this.addOrRemoveRenderer({
          ...renderer.context,
          ...checkedContext,
          setupMode: VideoViewSetupMode.VideoViewSetupReplace,
        });
        return true;
      }
    }

    for (const rendererCache of this._rendererCaches) {
      const result = rendererCache.setRendererContext(checkedContext);
      if (result) {
        return true;
      }
    }
    return false;
  }
}
