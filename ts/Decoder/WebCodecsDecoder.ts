import { EncodedVideoFrameInfo, VideoFrameType } from '../Private/AgoraBase';

import { AgoraEnv, logDebug } from '../Utils';

import { WebCodecsRenderer } from './WebCodecsRenderer';

const frameTypeMapping = {
  [VideoFrameType.VideoFrameTypeDeltaFrame]: 'delta',
  [VideoFrameType.VideoFrameTypeKeyFrame]: 'key',
};

export class WebCodecsDecoder {
  public enableFps = false;

  private _decoder: VideoDecoder;
  private _startTime: number | null = null;
  private renderers: WebCodecsRenderer[] = [];
  private pendingFrame: VideoFrame | null = null;
  private _frameCount = 0;

  private _frame_ts: number[] = [];
  private _base_ts = 0;
  private _base_ts_ntp = 1;
  private _last_ts_ntp = 1;

  constructor(renders: WebCodecsRenderer[]) {
    this.renderers = renders;
    this._decoder = new VideoDecoder({
      // @ts-ignore
      output: this._output.bind(this),
      error: this._error.bind(this),
    });
    this._decoder!.configure({
      codec: 'hvc1.1.2.H153.90',
      codedWidth: 3840,
      codedHeight: 2160,
    });
  }

  _output(frame: VideoFrame) {
    this.getFps();
    // Schedule the frame to be rendered.
    this._renderFrame(frame);
  }

  _error(e: any) {
    console.error('Decoder error:', e);
  }

  public getFps(): number {
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
      // logDebug('render', `${fps.toFixed(0)} fps`);
    }

    if (AgoraEnv.enableWebCodecDecode) {
      let span = document.createElement('span');
      span.innerText = `fps: ${fps.toFixed(0)}`;

      for (let renderer of this.renderers) {
        renderer.container?.appendChild(span);
      }
    }

    return fps;
  }

  private _renderFrame(frame: VideoFrame) {
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
    for (let renderer of this.renderers) {
      renderer.drawFrame(this.pendingFrame);
      this.pendingFrame = null;
    }
  }

  // @ts-ignore
  decodeFrame(
    imageBuffer: Uint8Array,
    frameInfo: EncodedVideoFrameInfo,
    ts: number
  ) {
    console.log(
      'FRAMETYPE',
      frameInfo.frameType,
      frameInfo,
      imageBuffer,
      imageBuffer.length
    );
    if (!imageBuffer) {
      logDebug('imageBuffer is empty, skip decode frame');
      return;
    }
    let frameType: string | undefined;
    if (frameInfo.frameType !== undefined) {
      // @ts-ignore
      frameType = frameTypeMapping[frameInfo.frameType];
    }
    if (!frameType) {
      logDebug('frameType is not in frameTypeMapping, skip decode frame');
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
