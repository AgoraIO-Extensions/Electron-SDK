import { VideoFrame } from '../Private/AgoraMediaBase';
import { RendererCacheContext, RendererContext } from '../Types';
import { AgoraEnv, logDebug, logInfo } from '../Utils';

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
  private _enabled: boolean;

  // 渲染相关属性
  private _renderingTimer?: number;
  private _renderingFps: number = 30;
  private _isRendering: boolean = false;
  private _hasNewFrame: boolean = false;
  private _lastRenderTime: number = 0;
  private _frameCount: number = 0;

  constructor({ channelId, uid, sourceType }: RendererContext) {
    this._renderers = [];
    this._videoFrame = {
      yBuffer: Buffer.alloc(0) as unknown as Uint8Array,
      uBuffer: Buffer.alloc(0) as unknown as Uint8Array,
      vBuffer: Buffer.alloc(0) as unknown as Uint8Array,
      width: 0,
      height: 0,
      yStride: 0,
      uStride: 0,
      vStride: 0,
      rotation: 0,
    };
    this._context = { channelId, uid, sourceType };
    this._enabled = false;
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

  private enable() {
    if (this._enabled) return;
    this.bridge.EnableVideoFrameCache(this._context);
    this._enabled = true;
  }

  private disable() {
    if (!this._enabled) return;
    this.bridge.DisableVideoFrameCache(this._context);
    this._enabled = false;
  }

  private shouldEnable() {
    if (this.renderers.length > 0) {
      this.enable();
    } else {
      this.disable();
    }
  }

  /**
   * 获取视频帧数据但不渲染
   * @returns 是否获取到新帧
   */
  public fetchVideoFrame(): boolean {
    logInfo(`[FPS_INFO][UID:${this.context.uid}]fetchVideoFrame start`);
    let { ret, isNewFrame } = this.bridge.GetVideoFrame(
      this.context,
      this.videoFrame
    );
    logInfo(`[FPS_INFO][UID:${this.context.uid}]fetchVideoFrame end`);

    switch (ret) {
      case 0: // GET_VIDEO_FRAME_CACHE_RETURN_TYPE::OK = 0
        //
        break;
      case 1: // GET_VIDEO_FRAME_CACHE_RETURN_TYPE::RESIZED = 1
        const { yStride, uStride, vStride, height } = this.videoFrame;
        this.videoFrame.yBuffer = Buffer.alloc(
          yStride! * height!
        ) as unknown as Uint8Array;
        this.videoFrame.uBuffer = Buffer.alloc(
          uStride! * height!
        ) as unknown as Uint8Array;
        this.videoFrame.vBuffer = Buffer.alloc(
          vStride! * height!
        ) as unknown as Uint8Array;

        const result = this.bridge.GetVideoFrame(this.context, this.videoFrame);
        ret = result.ret;
        isNewFrame = result.isNewFrame;
        break;
      case 2: // GET_VIDEO_FRAME_CACHE_RETURN_TYPE::NO_CACHE = 2
        logDebug('No renderer cache, please enable cache first');
        return false;
    }

    if (isNewFrame) {
      this._hasNewFrame = true;
    }

    return isNewFrame;
  }

  /**
   * 仅渲染当前帧，不从C++获取新数据
   */
  public renderFrame() {
    if (this._hasNewFrame && this.renderers.length > 0) {
      logInfo(`[FPS_INFO][UID:${this.context.uid}]renderFrame start`);

      const renderStartTime = performance.now();
      this.renderers.forEach((renderer) => {
        renderer.drawFrame(this.context.uid!, this.videoFrame);
      });
      const renderEndTime = performance.now();

      this._frameCount++;
      this._hasNewFrame = false; // 标记帧已渲染

      logInfo(
        `[FPS_INFO][UID:${this.context.uid}]renderFrame end:`,
        '耗时:',
        (renderEndTime - renderStartTime).toFixed(2) + 'ms',
        '帧ID:',
        this._frameCount
      );
    }
  }

  public draw() {
    if (this._hasNewFrame) {
      this.renderFrame();
    }
  }

  /**
   * 开始独立渲染循环
   */
  public startRendering() {
    if (this._renderingTimer || this._isRendering) return;

    this._isRendering = true;
    logInfo(
      `[FPS_INFO][UID:${this.context.uid}] 开始独立渲染循环，目标帧率:`,
      this._renderingFps
    );

    const renderingLooper = () => {
      if (!this._isRendering) return;

      const currentTime = performance.now();
      const timeSinceLastRender = this._lastRenderTime
        ? currentTime - this._lastRenderTime
        : 0;
      const frameInterval = 1000 / this._renderingFps;

      // 如果距离上次渲染的时间不足一帧间隔，等待
      if (this._lastRenderTime && timeSinceLastRender < frameInterval) {
        const waitTime = frameInterval - timeSinceLastRender;
        logInfo(
          `[FPS_INFO][UID:${this.context.uid}] 等待下一帧:`,
          waitTime.toFixed(2) + 'ms'
        );

        this._renderingTimer = window.setTimeout(renderingLooper, waitTime);
        return;
      }

      // 执行渲染
      this._lastRenderTime = currentTime;
      this.renderFrame();

      // 安排下一帧
      this._renderingTimer = window.setTimeout(renderingLooper, 0);
    };

    // 启动渲染循环
    this._renderingTimer = window.setTimeout(renderingLooper, 0);
  }

  /**
   * 停止独立渲染循环
   */
  public stopRendering() {
    if (!this._isRendering) return;

    if (this._renderingTimer) {
      window.clearTimeout(this._renderingTimer);
      this._renderingTimer = undefined;
    }

    this._isRendering = false;
    logInfo(`[FPS_INFO][UID:${this.context.uid}] 停止独立渲染循环`);
  }

  /**
   * 设置渲染帧率
   */
  public set renderingFps(fps: number) {
    if (this._renderingFps !== fps) {
      logInfo(
        `[FPS_INFO][UID:${this.context.uid}] 帧率设置变更:`,
        this._renderingFps,
        '->',
        fps
      );
      this._renderingFps = fps;

      // 如果正在渲染，重启渲染循环以应用新帧率
      if (this._isRendering) {
        this.stopRendering();
        this.startRendering();
      }
    }
  }

  /**
   * 获取渲染帧率
   */
  public get renderingFps(): number {
    return this._renderingFps;
  }

  public findRenderer(view: Element): IRenderer | undefined {
    return this._renderers.find((renderer) => renderer.parentElement === view);
  }

  public addRenderer(renderer: IRenderer): void {
    this._renderers.push(renderer);
    this.shouldEnable();
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
    this.shouldEnable();
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
}
