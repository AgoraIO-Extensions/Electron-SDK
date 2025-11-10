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

/**
 * 视频帧缓冲，用于存储一帧视频数据
 */
class VideoFrameBuffer {
  // 视频帧数据
  public frame: VideoFrame;
  // 是否已经使用
  public inUse: boolean = false;
  // 帧ID，用于调试
  public frameId: number = 0;
  // 时间戳，用于计算帧率
  public timestamp: number = 0;
  // 缓冲区分配大小，用于避免不必要的重新分配
  private _allocatedYSize: number = 0;
  private _allocatedUSize: number = 0;
  private _allocatedVSize: number = 0;

  constructor(initialWidth: number = 0, initialHeight: number = 0) {
    this.frame = {
      yBuffer: Buffer.alloc(0) as unknown as Uint8Array,
      uBuffer: Buffer.alloc(0) as unknown as Uint8Array,
      vBuffer: Buffer.alloc(0) as unknown as Uint8Array,
      width: initialWidth,
      height: initialHeight,
      yStride: 0,
      uStride: 0,
      vStride: 0,
      rotation: 0,
    };
  }

  /**
   * 重置缓冲区大小，只在必要时重新分配内存
   */
  public resize(
    yStride: number,
    uStride: number,
    vStride: number,
    height: number
  ): void {
    const ySize = yStride * height;
    const uSize = uStride * height;
    const vSize = vStride * height;

    // 只有当需要的缓冲区大小大于已分配的大小时，才重新分配内存
    // 这样可以避免频繁的内存分配和释放，提高性能
    if (ySize > this._allocatedYSize) {
      // 分配比实际需要大一些的内存，以减少未来可能的重新分配
      const newYSize = Math.ceil(ySize * 1.2); // 增加20%的缓冲
      this.frame.yBuffer = Buffer.alloc(newYSize) as unknown as Uint8Array;
      this._allocatedYSize = newYSize;
    }

    if (uSize > this._allocatedUSize) {
      const newUSize = Math.ceil(uSize * 1.2);
      this.frame.uBuffer = Buffer.alloc(newUSize) as unknown as Uint8Array;
      this._allocatedUSize = newUSize;
    }

    if (vSize > this._allocatedVSize) {
      const newVSize = Math.ceil(vSize * 1.2);
      this.frame.vBuffer = Buffer.alloc(newVSize) as unknown as Uint8Array;
      this._allocatedVSize = newVSize;
    }

    // 更新帧参数
    this.frame.yStride = yStride;
    this.frame.uStride = uStride;
    this.frame.vStride = vStride;
    this.frame.height = height;
  }

  /**
   * 释放缓冲区内存
   */
  public release(): void {
    // 将缓冲区设置为最小大小，释放内存
    if (this._allocatedYSize > 0) {
      this.frame.yBuffer = Buffer.alloc(0) as unknown as Uint8Array;
      this._allocatedYSize = 0;
    }

    if (this._allocatedUSize > 0) {
      this.frame.uBuffer = Buffer.alloc(0) as unknown as Uint8Array;
      this._allocatedUSize = 0;
    }

    if (this._allocatedVSize > 0) {
      this.frame.vBuffer = Buffer.alloc(0) as unknown as Uint8Array;
      this._allocatedVSize = 0;
    }

    this.frame.yStride = 0;
    this.frame.uStride = 0;
    this.frame.vStride = 0;
    this.frame.height = 0;
    this.frame.width = 0;
    this.inUse = false;
  }
}

export class RendererCache {
  private _renderers: IRenderer[];
  private _context: RendererCacheContext;
  private _enabled: boolean;

  // 渲染相关属性
  private _renderingTimer?: number;
  private _renderingFps: number = 30;
  private _isRendering: boolean = false;
  private _lastRenderTime: number = 0;
  private _frameCount: number = 0;

  // 双缓冲队列
  private _frameBuffers: VideoFrameBuffer[] = [];
  private _writeIndex: number = 0; // 用于写入(获取数据)的缓冲区索引
  private _readIndex: number = 1; // 用于读取(渲染)的缓冲区索引
  private _hasNewFrame: boolean = false; // 是否有新帧可渲染

  constructor({ channelId, uid, sourceType }: RendererContext) {
    this._renderers = [];
    this._context = { channelId, uid, sourceType };
    this._enabled = false;

    // 初始化双缓冲队列 - 只需要两个缓冲区
    this._frameBuffers.push(new VideoFrameBuffer()); // 写缓冲区
    this._frameBuffers.push(new VideoFrameBuffer()); // 读缓冲区
  }

  public get key(): string {
    return generateRendererCacheKey(this._context);
  }

  public get renderers(): IRenderer[] {
    return this._renderers;
  }

  /**
   * 获取当前正在渲染的视频帧(读缓冲区)
   */
  public get videoFrame(): VideoFrame {
    const buffer = this._frameBuffers[this._readIndex];
    if (!buffer) {
      // 如果缓冲区不存在，返回一个空的VideoFrame
      return {
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
    }
    return buffer.frame;
  }

  /**
   * 获取用于写入数据的视频帧(写缓冲区)
   */
  public get nextVideoFrame(): VideoFrame {
    const buffer = this._frameBuffers[this._writeIndex];
    if (!buffer) {
      // 如果缓冲区不存在，返回一个空的VideoFrame
      return {
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
    }
    return buffer.frame;
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

    // 释放所有缓冲区
    this.releaseBuffers();
  }

  private shouldEnable() {
    if (this.renderers.length > 0) {
      this.enable();
    } else {
      this.disable();
    }
  }

  /**
   * 释放所有缓冲区内存
   */
  private releaseBuffers() {
    for (const buffer of this._frameBuffers) {
      buffer.release();
    }

    logInfo(`[FPS_INFO][UID:${this.context.uid}] 已释放所有视频帧缓冲区`);
  }

  /**
   * 获取视频帧数据但不渲染
   * @returns 是否获取到新帧
   */
  public fetchVideoFrame(): boolean {
    // 使用写缓冲区获取数据
    const frameBuffer = this._frameBuffers[this._writeIndex];
    if (!frameBuffer) {
      logInfo(
        `[FPS_INFO][UID:${this.context.uid}]fetchVideoFrame 错误: 无效的写缓冲区索引 ${this._writeIndex}`
      );
      return false;
    }

    logInfo(
      `[FPS_INFO][UID:${this.context.uid}]fetchVideoFrame start, 写缓冲区索引: ${this._writeIndex}`
    );

    let { ret, isNewFrame } = this.bridge.GetVideoFrame(
      this.context,
      frameBuffer.frame
    );

    logInfo(
      `[FPS_INFO][UID:${this.context.uid}]fetchVideoFrame end, 写缓冲区索引: ${this._writeIndex}`
    );

    switch (ret) {
      case 0: // GET_VIDEO_FRAME_CACHE_RETURN_TYPE::OK = 0
        //
        break;
      case 1: // GET_VIDEO_FRAME_CACHE_RETURN_TYPE::RESIZED = 1
        const { yStride, uStride, vStride, height } = frameBuffer.frame;

        if (yStride && uStride && vStride && height) {
          // 重新分配缓冲区大小
          frameBuffer.resize(yStride, uStride, vStride, height);

          // 重新获取数据
          const result = this.bridge.GetVideoFrame(
            this.context,
            frameBuffer.frame
          );
          ret = result.ret;
          isNewFrame = result.isNewFrame;
        }
        break;
      case 2: // GET_VIDEO_FRAME_CACHE_RETURN_TYPE::NO_CACHE = 2
        logDebug('No renderer cache, please enable cache first');
        return false;
    }

    if (isNewFrame) {
      // 更新帧信息
      frameBuffer.frameId = ++this._frameCount;
      frameBuffer.timestamp = performance.now();

      // 交换读写缓冲区 - 关键优化点
      this._hasNewFrame = true; // 标记有新帧可渲染

      // 交换读写索引
      const temp = this._writeIndex;
      this._writeIndex = this._readIndex;
      this._readIndex = temp;

      logInfo(
        `[FPS_INFO][UID:${this.context.uid}]新帧已获取, 帧ID: ${frameBuffer.frameId}, 交换缓冲区: 读=${this._readIndex}, 写=${this._writeIndex}`
      );
    }

    return isNewFrame;
  }

  /**
   * 仅渲染当前帧，不从C++获取新数据
   */
  public renderFrame() {
    // 检查是否有新帧可渲染
    if (this._hasNewFrame && this.renderers.length > 0) {
      const frameBuffer = this._frameBuffers[this._readIndex];
      if (!frameBuffer) {
        logInfo(
          `[FPS_INFO][UID:${this.context.uid}]renderFrame 错误: 无效的读缓冲区索引 ${this._readIndex}`
        );
        return;
      }

      logInfo(
        `[FPS_INFO][UID:${this.context.uid}]renderFrame start, 读缓冲区索引: ${this._readIndex}, 帧ID: ${frameBuffer.frameId}`
      );

      const renderStartTime = performance.now();

      // 渲染当前帧
      this.renderers.forEach((renderer) => {
        renderer.drawFrame(this.context.uid!, frameBuffer.frame);
      });

      const renderEndTime = performance.now();
      const renderTime = renderEndTime - renderStartTime;

      // 标记帧已渲染 - 这里不再需要重置标志，因为我们使用的是交换缓冲区机制
      // 只有当新的帧被获取并交换缓冲区时，hasNewFrame才会被设置为true
      this._hasNewFrame = false;

      // 计算帧延迟
      const frameDelay = renderStartTime - frameBuffer.timestamp;

      logInfo(
        `[FPS_INFO][UID:${this.context.uid}]renderFrame end:`,
        '读缓冲区索引:',
        this._readIndex,
        '帧ID:',
        frameBuffer.frameId,
        '渲染耗时:',
        renderTime.toFixed(2) + 'ms',
        '帧延迟:',
        frameDelay.toFixed(2) + 'ms'
      );
    }
  }

  // 不再需要advanceToNextFrame方法，因为我们使用的是交换缓冲区机制

  /**
   * 兼容旧的API，同时获取数据并渲染
   */
  public draw() {
    // 先尝试渲染当前帧
    this.renderFrame();

    // 然后获取新帧
    const isNewFrame = this.fetchVideoFrame();

    // 如果获取到新帧，立即尝试渲染
    // 在我们的交换缓冲区机制中，fetchVideoFrame已经交换了读写缓冲区
    // 所以这里可以直接渲染读缓冲区中的新帧
    if (isNewFrame) {
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

      // 检查是否有新帧可渲染
      if (this._hasNewFrame) {
        // 如果有新帧，渲染它
        this.renderFrame();
      } else {
        logInfo(
          `[FPS_INFO][UID:${this.context.uid}] 没有新帧可渲染，等待下一次循环`
        );
      }

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

    // 重置缓冲区状态
    this._hasNewFrame = false;
    this._writeIndex = 0;
    this._readIndex = 1;
    this._isRendering = false;

    // 注意：我们不在这里释放缓冲区，因为停止渲染循环不一定意味着不再需要缓冲区
    // 只有在disable时才释放缓冲区

    logInfo(
      `[FPS_INFO][UID:${this.context.uid}] 停止独立渲染循环，已重置缓冲区状态`
    );
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
