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
import { WebCodecsRenderer } from './WebCodecsRenderer/index';
import { WebGLFallback, WebGLRenderer } from './WebGLRenderer';
import { YUVCanvasRenderer } from './YUVCanvasRenderer';

/**
 * @ignore
 */
export class RendererManager extends IRendererManager {
  /**
   * @ignore
   */
  rendererType: RendererType;

  constructor() {
    super();
    this.rendererType = isSupportWebGL()
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
   * @deprecated Use getRendererCache instead
   */
  public getRender(
    context: RendererCacheContext
  ): RendererCacheType | undefined {
    return this.getRendererCache(context);
  }

  protected override createRenderer(
    context: RendererContext,
    rendererType: RendererType = this.rendererType
  ): IRenderer {
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
    renderer.setContext(context);
    return renderer;
  }

  public override doRendering(rendererCache: RendererCacheType): void {
    rendererCache.draw();
  }

  private handleWebGLFallback(context: RendererContext): WebGLFallback {
    return (renderer: WebGLRenderer) => {
      const renderers = this.getRenderers(context);
      renderer.unbind();
      const newRenderer = this.createRenderer(context, RendererType.SOFTWARE);
      renderers.splice(renderers.indexOf(renderer), 1, newRenderer);
    };
  }
}
