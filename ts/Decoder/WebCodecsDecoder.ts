import { EncodedVideoFrameInfo, VideoFrameType } from '../Private/AgoraBase';

import { logDebug, logError } from '../Utils';

import { WebGLRenderer } from './renderer_webgl';

const frameTypeMapping = {
  [VideoFrameType.VideoFrameTypeDeltaFrame]: 'delta',
  [VideoFrameType.VideoFrameTypeKeyFrame]: 'key',
};

export class WebCodecsDecoder {
  public enableFps = false;

  private _decoder: VideoDecoder;
  private _startTime: number | null = null;
  private renderer: any;
  private pendingFrame: VideoFrame | null = null;
  private _frameCount = 0;

  private _frame_ts: number[] = [];
  private _base_ts = 0;
  private _base_ts_ntp = 1;
  private _last_ts_ntp = 1;

  constructor() {
    this.renderer = new WebGLRenderer(
      'webgl2',
      document.querySelector('canvas')!.transferControlToOffscreen()
    );
    this._decoder = new VideoDecoder({
      // @ts-ignore
      output: this._output.bind(this),
      error: this._error.bind(this),
    });
    this.decoder!.configure({
      codec: 'hvc1.1.2.H153.90',
      codedWidth: 3840,
      codedHeight: 2160,
    });
  }

  getDecoder(): VideoDecoder {
    return this._decoder;
  }

  _output(frame: VideoFrame) {
    this.getFps();
    // Schedule the frame to be rendered.
    this._renderFrame(frame);
  }

  _error(e: any) {
    console.error('Decoder error:', e);
  }

  get decoder() {
    return this._decoder;
  }

  getFps(): number {
    let fps = 0;
    if (!this.enableFps) {
      return fps;
    }
    // Update statistics.
    if (this._startTime == null) {
      this._startTime = performance.now();
    } else {
      const elapsed = (performance.now() - this._startTime) / 1000;
      fps = ++this._frameCount / elapsed;
      logDebug('render', `${fps.toFixed(0)} fps`);
    }
    return fps;
  }

  _renderFrame(frame: VideoFrame) {
    if (!this.pendingFrame) {
      // Schedule rendering in the next animation frame.
      // eslint-disable-next-line auto-import/auto-import
      requestAnimationFrame(this.renderAnimationFrame.bind(this));
    } else {
      // Close the current pending frame before replacing it.
      this.pendingFrame.close();
    }
    // Set or replace the pending frame.
    this.pendingFrame = frame;
  }

  renderAnimationFrame() {
    this.renderer.draw(this.pendingFrame);
    this.pendingFrame = null;
  }

  // @ts-ignore
  decodeFrame(
    imageBuffer: Uint8Array,
    frameInfo: EncodedVideoFrameInfo,
    ts: number
  ) {
    if (!imageBuffer) {
      logError('imageBuffer is empty, cannot decode frame');
      return;
    }
    this._frame_ts.push(ts);
    if (this._base_ts !== 0) {
      if (ts > this._base_ts) {
        this._last_ts_ntp =
          this._base_ts_ntp + Math.floor(((ts - this._base_ts) * 1000) / 90);
      } else {
        this._base_ts = ts;
        this._last_ts_ntp++;
        this._base_ts_ntp = this._last_ts_ntp;
      }
    } else {
      this._base_ts = ts;
      this._last_ts_ntp = 1;
    }
    let frameType: string | undefined;
    if (frameInfo.frameType !== undefined) {
      // @ts-ignore
      frameType = frameTypeMapping[frameInfo.frameType];
    }
    if (!frameType) {
      logError('frameType is incorrect, cannot decode frame');
      return;
    }
    this._decoder.decode(
      new EncodedVideoChunk({
        data: imageBuffer,
        timestamp: this._last_ts_ntp,
        // @ts-ignore
        type: frameType,
        // @ts-ignore
        transfer: [imageBuffer.buffer],
      })
    );
  }

  release() {
    this._decoder.reset();
    this._decoder.close();
  }
}
