import { VideoFrame } from '../Private/AgoraMediaBase';
import { AgoraElectronBridge } from '../Private/internal/IrisApiEngine';

import { RendererContext } from '../Types';
import { logDebug } from '../Utils';

import { IRenderer } from './IRenderer';
import { IRendererCache } from './IRendererCache';

export class RendererCache extends IRendererCache {
  private videoFrame: VideoFrame;
  private _enabled: boolean;

  constructor({ channelId, uid, sourceType }: RendererContext) {
    super({ channelId, uid, sourceType });
    this.videoFrame = {
      yBuffer: Buffer.alloc(0),
      uBuffer: Buffer.alloc(0),
      vBuffer: Buffer.alloc(0),
      width: 0,
      height: 0,
      yStride: 0,
      uStride: 0,
      vStride: 0,
      rotation: 0,
    };
    this._enabled = false;
  }

  /**
   * @deprecated Use videoFrame instead
   */
  public get shareVideoFrame(): VideoFrame | undefined {
    return this.videoFrame;
  }

  private enable() {
    if (this._enabled) return;
    AgoraElectronBridge.EnableVideoFrameCache(this.context);
    this._enabled = true;
  }

  private disable() {
    if (!this._enabled) return;
    AgoraElectronBridge.DisableVideoFrameCache(this.context);
    this._enabled = false;
  }

  private shouldEnable() {
    if (this.renderers.length > 0) {
      this.enable();
    } else {
      this.disable();
    }
  }

  override draw() {
    let { ret, isNewFrame } = AgoraElectronBridge.GetVideoFrame(
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

        const result = AgoraElectronBridge.GetVideoFrame(
          this.context,
          this.videoFrame
        );
        ret = result.ret;
        isNewFrame = result.isNewFrame;
        break;
      case 2: // GET_VIDEO_FRAME_CACHE_RETURN_TYPE::NO_CACHE = 2
        logDebug('No renderer cache, please enable cache first');
        return;
    }

    if (isNewFrame) {
      this.renderers.forEach((renderer) => {
        renderer.drawFrame(this.videoFrame);
      });
    }
  }

  override addRenderer(renderer: IRenderer): void {
    super.addRenderer(renderer);
    this.shouldEnable();
  }

  /**
   * Remove the specified renderer if it is specified, otherwise remove all renderers
   */
  override removeRenderer(renderer?: IRenderer): void {
    super.removeRenderer(renderer);
    this.shouldEnable();
  }

  public release(): void {
    super.release();
  }
}
