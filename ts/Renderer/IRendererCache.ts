import { RendererCacheContext, RendererContext } from '../Types';

import { IRenderer } from './IRenderer';

/**
 * @ignore
 */
export function generateRendererCacheKey({
  channelId,
  uid,
  sourceType,
}: RendererContext): string {
  return `${channelId}_${uid}_${sourceType}`;
}

/**
 * @ignore
 */
export function isUseConnection(context: RendererCacheContext): boolean {
  // if RtcConnection is not undefined, then use connection
  return !!context.channelId && context.localUid !== undefined;
}

export abstract class IRendererCache {
  renderers: IRenderer[];
  cacheContext: RendererCacheContext;

  constructor({
    channelId,
    uid,
    useWebCodecsDecoder,
    enableFps,
    sourceType,
    localUid,
    position,
  }: RendererContext) {
    this.renderers = [];
    this.cacheContext = {
      channelId,
      uid,
      useWebCodecsDecoder,
      enableFps,
      sourceType,
      localUid,
      position,
    };
  }

  public get key(): string {
    return generateRendererCacheKey(this.cacheContext);
  }

  public abstract draw(): void;

  public findRenderer(view: Element): IRenderer | undefined {
    return this.renderers.find((renderer) => renderer.parentElement === view);
  }

  public addRenderer(renderer: IRenderer): void {
    this.renderers.push(renderer);
  }

  /**
   * Remove the specified renderer if it is specified, otherwise remove all renderers
   */
  public removeRenderer(renderer?: IRenderer): void {
    let start = 0;
    let deleteCount = this.renderers.length;
    if (renderer) {
      start = this.renderers.indexOf(renderer);
      if (start < 0) return;
      deleteCount = 1;
    }
    this.renderers.splice(start, deleteCount).forEach((it) => it.unbind());
  }

  public setRendererContext(context: RendererContext): boolean {
    if (context.view) {
      const renderer = this.findRenderer(context.view);
      if (renderer) {
        renderer.context = context;
        return true;
      }
      return false;
    } else {
      this.renderers.forEach((it) => {
        it.context = context;
      });
      return this.renderers.length > 0;
    }
  }

  public release(): void {
    this.removeRenderer();
  }
}
