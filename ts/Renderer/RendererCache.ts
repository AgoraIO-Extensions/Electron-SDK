import { VideoFrame } from '../Private/AgoraMediaBase';
import { RendererCacheContext, RendererContext } from '../Types';
import { AgoraEnv, logWarn } from '../Utils';

import { IRenderer } from './IRenderer';

export function generateRendererCacheKey({
  channelId,
  uid,
  sourceType,
}: RendererContext): string {
  return `${channelId}_${uid}_${sourceType}`;
}

export class RendererCache {
  private _renderers: IRenderer[];
  private _videoFrame: VideoFrame;
  private _context: RendererCacheContext;

  constructor({ channelId, uid, sourceType }: RendererContext) {
    this._renderers = [];
    this._videoFrame = {
      yBuffer: Buffer.alloc(0),
      uBuffer: Buffer.alloc(0),
      vBuffer: Buffer.alloc(0),
    };
    this._context = { channelId, uid, sourceType };
  }

  public get key(): string {
    return generateRendererCacheKey(this._context);
  }

  public get renderers(): IRenderer[] {
    return this._renderers;
  }

  public get videoFrame(): VideoFrame {
    return this._videoFrame;
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

  /**
   * @deprecated Use videoFrame instead
   */
  public get shareVideoFrame(): VideoFrame | undefined {
    return this.videoFrame;
  }

  private get bridge() {
    return AgoraEnv.AgoraElectronBridge;
  }

  public enable() {
    this.bridge.EnableVideoFrameCache(this._context);
  }

  public disable() {
    this.bridge.DisableVideoFrameCache(this._context);
  }

  public draw() {
    let { ret, isNewFrame } = this.bridge.GetVideoFrame(
      this.context,
      this.videoFrame
    );

    switch (ret) {
      case 0: // GET_VIDEO_FRAME_CACHE_RETURN_TYPE::OK = 0
        //
        break;
      case 1: // GET_VIDEO_FRAME_CACHE_RETURN_TYPE::RESIZED = 1
        const { yStride, uStride, vStride, height } = this.videoFrame;
        this.videoFrame.yBuffer = Buffer.alloc(yStride! * height!);
        this.videoFrame.uBuffer = Buffer.alloc(uStride! * height!);
        this.videoFrame.vBuffer = Buffer.alloc(vStride! * height!);

        const result = this.bridge.GetVideoFrame(this.context, this.videoFrame);
        ret = result.ret;
        isNewFrame = result.isNewFrame;
        break;
      case 2: // GET_VIDEO_FRAME_CACHE_RETURN_TYPE::NO_CACHE = 2
        logWarn('No renderer cache, please enable cache first');
        return;
    }

    if (isNewFrame) {
      this.renderers.forEach((renderer) => {
        renderer.drawFrame(this.videoFrame);
      });
    }
  }

  public findRenderer(view: Element): IRenderer | undefined {
    return this._renderers.find((renderer) => renderer.parentElement === view);
  }

  public addRenderer(renderer: IRenderer): void {
    this._renderers.push(renderer);
  }

  public removeRenderer(renderer: IRenderer): void {
    const index = this._renderers.indexOf(renderer);
    if (index >= 0) {
      this._renderers.splice(index, 1);
    }
  }

  public setRendererContext({
    view,
    renderMode,
    mirrorMode,
  }: RendererContext): void {
    const renderer = this.findRenderer(view);
    if (renderer) {
      renderer.rendererContext = { renderMode, mirrorMode };
    } else {
      this._renderers.forEach((it) => {
        it.rendererContext = { renderMode, mirrorMode };
      });
    }
  }
}
