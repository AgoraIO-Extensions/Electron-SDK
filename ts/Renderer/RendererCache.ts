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
  private _renderingFps: number = 0;
  private _renderingTimer?: number;
  private _isRendering: boolean = false;
  private _lastRenderTime: number = 0;

  // 性能监控相关属性
  private _frameTimes: number[] = []; // 存储最近100帧的渲染时间
  private _frameIntervals: number[] = []; // 存储最近100帧的帧间隔
  private _lastFrameTimestamp: number = 0; // 上一帧的时间戳
  private _longIntervals: number = 0; // 长帧间隔计数
  private _statsInterval: number = 100; // 每100帧输出一次统计
  private _frameTimeHistogram = {
    // 帧时间直方图
    '0-1ms': 0,
    '1-2ms': 0,
    '2-5ms': 0,
    '5-10ms': 0,
    '10-16ms': 0,
    '16-33ms': 0,
    '33+ms': 0,
  };

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
    if (AgoraEnv.AgoraRendererManager) {
      this._renderingFps = AgoraEnv.AgoraRendererManager.renderingFps;
    }
    this.startRendering();
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

    return isNewFrame;
  }

  /**
   * 渲染当前视频帧
   * 此方法假设已经通过fetchVideoFrame获取了新帧
   */
  public renderFrame() {
    if (this.renderers.length === 0) return;

    // 记录当前时间戳，用于计算帧间隔
    const now = performance.now();

    // 计算帧间隔并记录
    if (this._lastFrameTimestamp > 0) {
      const interval = now - this._lastFrameTimestamp;
      this._frameIntervals.push(interval);

      const targetInterval = 1000 / this._renderingFps;
      if (interval > targetInterval) {
        this._longIntervals++;
        logInfo(
          `[FPS_WARN][UID:${this.context.uid}] 检测到长帧间隔:`,
          `${interval.toFixed(2)}ms`,
          `目标间隔=${targetInterval.toFixed(2)}ms`,
          `累计长间隔=${this._longIntervals}`
        );
      }
    }
    this._lastFrameTimestamp = now;

    // 使用高精度计数器测量渲染时间
    const renderStartTime = performance.now();

    // 执行渲染
    this.renderers.forEach((renderer) => {
      renderer.drawFrame(this.context.uid!, this.videoFrame);
    });

    // 计算渲染耗时
    const renderEndTime = performance.now();
    const frameTime = renderEndTime - renderStartTime;

    // 更新帧时间统计
    this._frameTimes.push(frameTime);

    // 更新帧时间直方图
    if (frameTime < 1) this._frameTimeHistogram['0-1ms']++;
    else if (frameTime < 2) this._frameTimeHistogram['1-2ms']++;
    else if (frameTime < 5) this._frameTimeHistogram['2-5ms']++;
    else if (frameTime < 10) this._frameTimeHistogram['5-10ms']++;
    else if (frameTime < 16) this._frameTimeHistogram['10-16ms']++;
    else if (frameTime < 33) this._frameTimeHistogram['16-33ms']++;
    else this._frameTimeHistogram['33+ms']++;

    // 每statsInterval帧输出一次统计信息
    if (this._frameTimes.length >= this._statsInterval) {
      this._outputPerformanceStats();
    }
  }

  /**
   * 输出性能统计信息
   * 包括帧时间和帧间隔的统计数据
   */
  private _outputPerformanceStats(): void {
    if (this._frameTimes.length === 0) return;

    // 记录当前长间隔计数，用于统计输出
    const longIntervalCount = this._longIntervals;

    // 计算帧时间统计
    const avgFrameTime =
      this._frameTimes.reduce((a, b) => a + b, 0) / this._frameTimes.length;
    const maxFrameTime = Math.max(...this._frameTimes);
    const minFrameTime = Math.min(...this._frameTimes);

    // 计算帧间隔统计
    let avgFrameInterval = 0;
    let maxFrameInterval = 0;
    let minFrameInterval = Number.MAX_VALUE;

    if (this._frameIntervals.length > 0) {
      avgFrameInterval =
        this._frameIntervals.reduce((a, b) => a + b, 0) /
        this._frameIntervals.length;
      maxFrameInterval = Math.max(...this._frameIntervals);
      minFrameInterval = Math.min(...this._frameIntervals);
    }

    // 计算实际帧率
    const actualFps =
      this._frameIntervals.length > 0
        ? 1000 / avgFrameInterval
        : this._renderingFps;

    // 输出帧时间统计
    logInfo(
      `[FPS_STATS][UID:${this.context.uid}] 帧时间统计(${this._frameTimes.length}帧):`,
      `平均=${avgFrameTime.toFixed(2)}ms`,
      `最大=${maxFrameTime.toFixed(2)}ms`,
      `最小=${minFrameTime.toFixed(2)}ms`,
      `直方图=${JSON.stringify(this._frameTimeHistogram)}`
    );

    // 输出帧间隔统计
    if (this._frameIntervals.length > 0) {
      logInfo(
        `[FPS_STATS][UID:${this.context.uid}] 帧间隔统计(${this._frameIntervals.length}帧):`,
        `平均=${avgFrameInterval.toFixed(2)}ms`,
        `最大=${maxFrameInterval.toFixed(2)}ms`,
        `最小=${minFrameInterval.toFixed(2)}ms`,
        `实际帧率=${actualFps.toFixed(2)}fps`,
        `目标帧率=${this._renderingFps}fps`,
        `长间隔次数=${longIntervalCount}`
      );
    }

    // 重置统计数据
    this._frameTimes = [];
    this._frameIntervals = [];
    this._longIntervals = 0; // 重置长间隔计数器

    this._frameTimeHistogram = {
      '0-1ms': 0,
      '1-2ms': 0,
      '2-5ms': 0,
      '5-10ms': 0,
      '10-16ms': 0,
      '16-33ms': 0,
      '33+ms': 0,
    };
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
        this._renderingTimer = window.setTimeout(renderingLooper, waitTime);
        return;
      }

      // 记录当前时间作为本次循环的开始时间
      this._lastRenderTime = currentTime;

      // 不断获取并渲染帧，直到没有更多新帧
      let frameCount = 0;
      let hasMoreFrames = true;

      while (hasMoreFrames) {
        // 获取下一帧
        hasMoreFrames = this.fetchVideoFrame();

        if (hasMoreFrames) {
          // 有新帧，立即渲染
          frameCount++;
          this.renderFrame();
        } else if (frameCount === 0) {
          // 一帧也没有获取到
          logInfo(
            `[FPS_WARN][UID:${this.context.uid}] 没有新帧可渲染，等待下一次循环`
          );
        }
      }

      // 记录本次循环获取的帧数
      if (frameCount > 1) {
        logInfo(
          `[FPS_INFO][UID:${this.context.uid}] 本次循环获取并渲染了 ${frameCount} 帧`
        );
      }

      // 安排下一帧
      this._renderingTimer = window.setTimeout(renderingLooper, 0);
    };

    // 启动渲染循环
    this._renderingTimer = window.setTimeout(renderingLooper, 0);
  }

  public stopRendering() {
    if (!this._isRendering) return;

    if (this._renderingTimer) {
      window.clearTimeout(this._renderingTimer);
      this._renderingTimer = undefined;
    }

    this._isRendering = false;
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
