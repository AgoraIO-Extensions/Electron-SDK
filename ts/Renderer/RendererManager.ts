import { WebCodecsRenderer } from '../Decoder/WebCodecsRenderer';

import {
  RENDER_MODE,
  RendererCacheContext,
  RendererCacheType,
  RendererContext,
  RendererType,
} from '../Types';
import { isSupportWebGL } from '../Utils';

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
  private _rendererType: RendererType;

  public set rendererType(rendererType: RendererType) {
    if (this._rendererType !== rendererType) {
      this._rendererType = rendererType;
    }
  }

  public get rendererType(): RendererType {
    return this._rendererType;
  }

  constructor() {
    super();
    this._rendererType = isSupportWebGL()
      ? RendererType.WEBGL
      : RendererType.SOFTWARE;
  }

  /**
   * @deprecated Use rendererType instead
   */
  public setRenderMode(mode: RENDER_MODE) {
    this.rendererType = mode;
  }

  /**
   * @deprecated Use renderingFps instead
   */
  public setFPS(fps: number) {
    this.renderingFps = fps;
  }

  /**
   * @deprecated Use getRendererCache instead
   */
  public getRender(
    context: RendererCacheContext
  ): RendererCacheType | undefined {
    return this.getRendererCache(context);
  }

  protected override createRenderer(
    context: RendererContext,
    rendererType?: RendererType
  ): IRenderer {
    if (rendererType === undefined) {
      rendererType = this.rendererType;
    }

    let renderer: IRenderer;
    switch (rendererType) {
      case RendererType.WEBGL:
        if (context.useWebCodecsDecoder) {
          renderer = new WebCodecsRenderer();
        } else {
          renderer = new WebGLRenderer(
            this.handleWebGLFallback(context).bind(this)
          );
        }
        break;
      case RendererType.SOFTWARE:
        renderer = new YUVCanvasRenderer();
        break;
      default:
        throw new Error('Unknown renderer type');
    }

    renderer.bind(context.view);
    renderer.context = {
      renderMode: context.renderMode,
      mirrorMode: context.mirrorMode,
    };
    return renderer;
  }

  public override doRendering(rendererCache: RendererCacheType): void {
    rendererCache.draw();
  }

  private handleWebGLFallback(context: RendererContext): WebGLFallback {
    return (renderer: WebGLRenderer) => {
      const {
        context: { renderMode, mirrorMode },
      } = renderer;
      const renderers = this.getRenderers(context);
      renderer.unbind();
      const newRenderer = this.createRenderer(
        { ...context, renderMode, mirrorMode },
        RendererType.SOFTWARE
      );
      renderers.splice(renderers.indexOf(renderer), 1, newRenderer);
    };
  }
}
