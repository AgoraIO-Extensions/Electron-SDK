import { RendererCacheContext, RendererContext } from '../Types';

import { IRenderer } from './IRenderer';

export function generateRendererCacheKey({
  channelId,
  uid,
  sourceType,
}: RendererContext): string {
  return `${channelId}_${uid}_${sourceType}`;
}

export abstract class IRendererCache {
  _renderers: IRenderer[];
  _context: RendererCacheContext;
  selfDecode: boolean = false;

  constructor({ channelId, uid, sourceType }: RendererContext) {
    this._renderers = [];
    this._context = { channelId, uid, sourceType };
  }

  public get key(): string {
    return generateRendererCacheKey(this._context);
  }

  public get renderers(): IRenderer[] {
    return this._renderers;
  }

  public get context(): RendererCacheContext {
    return this._context;
  }

  /**
   * @deprecated Use renderers instead
   */
  public get renders(): IRenderer[] {
    return this.renderers;
  }

  public abstract draw(): void;

  public findRenderer(view: Element): IRenderer | undefined {
    return this._renderers.find((renderer) => renderer.parentElement === view);
  }

  public addRenderer(renderer: IRenderer): void {
    this._renderers.push(renderer);
  }

  /**
   * Remove the specified renderer if it is specified, otherwise remove all renderers
   */
  public removeRenderer(renderer?: IRenderer): void {
    let start = 0;
    let deleteCount = this._renderers.length;
    if (renderer) {
      start = this._renderers.indexOf(renderer);
      if (start < 0) return;
      deleteCount = 1;
    }
    this._renderers.splice(start, deleteCount).forEach((it) => it.unbind());
  }

  public setRendererContext({
    view,
    renderMode,
    mirrorMode,
  }: RendererContext): boolean {
    if (view) {
      const renderer = this.findRenderer(view);
      if (renderer) {
        renderer.context = { renderMode, mirrorMode };
        return true;
      }
      return false;
    } else {
      this._renderers.forEach((it) => {
        it.context = { renderMode, mirrorMode };
      });
      return this._renderers.length > 0;
    }
  }

  public release(): void {
    this.removeRenderer();
  }
}
