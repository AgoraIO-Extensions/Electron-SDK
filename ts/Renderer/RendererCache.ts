import { VideoFrame } from '../Private/AgoraMediaBase';
import { AgoraElectronBridge } from '../Private/internal/IrisApiEngine';

import { RendererContext } from '../Types';
import { AgoraEnv, logDebug, logInfo } from '../Utils';

import { IRenderer } from './IRenderer';
import { IRendererCache } from './IRendererCache';

export class RendererCache extends IRendererCache {
  private videoFrame: VideoFrame;
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
  private _statsInterval: number = 100; // 每100帧输出一次统计

  constructor(context: RendererContext) {
    super(context);
    this.videoFrame = {
      yBuffer: Buffer.alloc(0),
      uBuffer: Buffer.alloc(0),
      vBuffer: Buffer.alloc(0),
      alphaBuffer: Buffer.alloc(0),
      width: 0,
      height: 0,
      yStride: 0,
      uStride: 0,
      vStride: 0,
      rotation: 0,
      colorSpace: undefined,
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
    AgoraElectronBridge.EnableVideoFrameCache(this.cacheContext);
    this._enabled = true;
    if (AgoraEnv.AgoraRendererManager) {
      this._renderingFps = AgoraEnv.AgoraRendererManager.renderingFps;
    }
    this.startRendering();
  }

  private disable() {
    if (!this._enabled) return;
    AgoraElectronBridge.DisableVideoFrameCache(this.cacheContext);
    this._enabled = false;
  }

  private shouldEnable() {
    if (this.renderers.length > 0) {
      this.enable();
    } else {
      this.disable();
    }
  }

  override draw(): void {}

  public fetchVideoFrame(): { hasMoreFrame: boolean; needRender: boolean } {
    const renderAlpha = this.cacheContext.enableAlphaMask ?? false;
    let needRender = false;
    let { ret, hasMoreFrame } = AgoraElectronBridge.GetVideoFrame(
      this.cacheContext,
      this.videoFrame,
      {
        renderAlpha: renderAlpha,
      }
    );

    switch (ret) {
      case 0: // GET_VIDEO_FRAME_CACHE_RETURN_TYPE::OK = 0
        //
        needRender = true;
        break;
      case 1: // GET_VIDEO_FRAME_CACHE_RETURN_TYPE::RESIZED = 1
        const { yStride, uStride, vStride, height } = this.videoFrame;
        this.videoFrame.yBuffer = Buffer.alloc(yStride! * height!);
        this.videoFrame.uBuffer = Buffer.alloc(uStride! * height!);
        this.videoFrame.vBuffer = Buffer.alloc(vStride! * height!);
        if (renderAlpha) {
          this.videoFrame.alphaBuffer = Buffer.alloc(
            this.videoFrame.width! * this.videoFrame.height!
          );
        }

        const result = AgoraElectronBridge.GetVideoFrame(
          this.cacheContext,
          this.videoFrame,
          {
            renderAlpha: renderAlpha,
          }
        );
        ret = result.ret;
        hasMoreFrame = result.hasMoreFrame;
        needRender = false;
        break;
      case 2: // GET_VIDEO_FRAME_CACHE_RETURN_TYPE::NO_CACHE = 2
        logDebug('No renderer cache, please enable cache first');
        return { hasMoreFrame: false, needRender: false };
    }

    if (!renderAlpha) {
      if (
        this.videoFrame.alphaBuffer &&
        this.videoFrame.alphaBuffer.length > 0
      ) {
        this.videoFrame.alphaBuffer = Buffer.alloc(0);
      }
    } else {
      if (
        !this.videoFrame.alphaBuffer ||
        this.videoFrame.alphaBuffer.length === 0
      ) {
        this.videoFrame.alphaBuffer = Buffer.alloc(
          this.videoFrame.width! * this.videoFrame.height!
        );
      }
    }

    if (hasMoreFrame) {
      this.renderers.forEach((renderer) => {
        renderer.drawFrame(this.cacheContext.uid!, this.videoFrame);
      });
    }

    return { hasMoreFrame, needRender };
  }

  override addRenderer(renderer: IRenderer): void {
    super.addRenderer(renderer);
    this.shouldEnable();
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
    }
    this._lastFrameTimestamp = now;

    // 使用高精度计数器测量渲染时间
    const renderStartTime = performance.now();

    // 执行渲染
    this.renderers.forEach((renderer) => {
      renderer.drawFrame(this.cacheContext.uid!, this.videoFrame);
    });

    // 计算渲染耗时
    const renderEndTime = performance.now();
    const frameTime = renderEndTime - renderStartTime;

    // 更新帧时间统计
    this._frameTimes.push(frameTime);

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
      `[FPS_STATS][UID:${this.cacheContext.uid}] 帧时间统计(${this._frameTimes.length}帧):`,
      `平均=${avgFrameTime.toFixed(2)}ms`,
      `最大=${maxFrameTime.toFixed(2)}ms`,
      `最小=${minFrameTime.toFixed(2)}ms`
    );

    // 输出帧间隔统计
    if (this._frameIntervals.length > 0) {
      logInfo(
        `[FPS_STATS][UID:${this.cacheContext.uid}] 帧间隔统计(${this._frameIntervals.length}帧):`,
        `实际帧率=${actualFps.toFixed(2)}fps`,
        `目标帧率=${this._renderingFps}fps`,
        `平均=${avgFrameInterval.toFixed(2)}ms`,
        `最大=${maxFrameInterval.toFixed(2)}ms`,
        `最小=${minFrameInterval.toFixed(2)}ms`
      );
    }

    // 重置统计数据
    this._frameTimes = [];
    this._frameIntervals = [];
  }

  /**
   * 开始独立渲染循环
   */
  public startRendering() {
    if (this._renderingTimer || this._isRendering) return;

    this._isRendering = true;
    logInfo(
      `[FPS_INFO][UID:${this.cacheContext.uid}] 开始独立渲染循环，目标帧率:`,
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

      // 获取第一帧并渲染
      // 无论hasMoreFrame是true还是false，都渲染当前帧
      // 因为fetchVideoFrame总是会获取一帧数据（如果有的话）
      let { hasMoreFrame, needRender } = this.fetchVideoFrame();
      if (needRender) {
        this.renderFrame();
      }

      // 如果hasMoreFrame为true，表示还有更多帧需要获取
      while (hasMoreFrame) {
        // 获取下一帧
        let { hasMoreFrame: nextHasMoreFrame, needRender } =
          this.fetchVideoFrame();
        hasMoreFrame = nextHasMoreFrame;
        if (needRender) {
          this.renderFrame();
        }
      }

      // 安排下一帧
      this._renderingTimer = window.setTimeout(renderingLooper, 0);
    };

    // 启动渲染循环
    this._renderingTimer = window.setTimeout(renderingLooper, 0);
  }

  /**
   * Remove the specified renderer if it is specified, otherwise remove all renderers
   */
  override removeRenderer(renderer?: IRenderer): void {
    super.removeRenderer(renderer);
    this.shouldEnable();
  }

  public stopRendering() {
    if (!this._isRendering) return;

    if (this._renderingTimer) {
      window.clearTimeout(this._renderingTimer);
      this._renderingTimer = undefined;
    }

    this._isRendering = false;
  }

  public release(): void {
    super.release();
  }
}
