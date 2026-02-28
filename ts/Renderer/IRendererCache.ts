import { VideoSourceType } from '../Private/AgoraMediaBase';
import { RtcConnection } from '../Private/IAgoraRtcEngineEx';

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
  callbackContext: { connection: RtcConnection; sourceType: VideoSourceType };

  // 性能统计数据
  public actualFps: number = 0;
  public avgFrameTime: number = 0;
  public maxFrameTime: number = 0;
  public minFrameTime: number = 0;
  public avgFrameInterval: number = 0;
  public maxFrameInterval: number = 0;
  public minFrameInterval: number = 0;

  constructor({
    channelId,
    uid,
    useWebCodecsDecoder,
    enableFps,
    sourceType,
    localUid,
    position,
    enableAlphaMask,
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
      enableAlphaMask,
    };
    this.callbackContext = {
      connection: { channelId, localUid },
      sourceType: sourceType!,
    };
  }

  public setCallbackContext(
    connection: RtcConnection,
    sourceType: VideoSourceType
  ): void {
    this.callbackContext = { connection, sourceType };
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
        renderer.setContext(context);
        return true;
      }
      return false;
    } else {
      this.renderers.forEach((it) => {
        it.setContext(context);
      });
      return this.renderers.length > 0;
    }
  }

  public abstract fetchVideoFrame(): {
    hasMoreFrame: boolean;
    needRender: boolean;
  };
  public abstract renderFrame(): void;
  public abstract startRendering(): void;
  public abstract stopRendering(): void;

  public release(): void {
    this.removeRenderer();
  }
}
