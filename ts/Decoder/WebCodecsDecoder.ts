import {
  EncodedVideoFrameInfo,
  VideoCodecType,
  VideoFrameType,
} from '../Private/AgoraBase';

import { logDebug, logInfo } from '../Utils';

import { WebCodecsRenderer } from './WebCodecsRenderer';

const frameTypeMapping = {
  [VideoFrameType.VideoFrameTypeDeltaFrame]: 'delta',
  [VideoFrameType.VideoFrameTypeKeyFrame]: 'key',
};

export const frameCodecMapping = {
  [VideoCodecType.VideoCodecH265]: 'hvc1.1.6.L5.90',
  [VideoCodecType.VideoCodecH264]: 'avc1.64e01f',
  [VideoCodecType.VideoCodecVp8]: 'vp8',
  [VideoCodecType.VideoCodecVp9]: 'vp9',
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

  constructor(renders: WebCodecsRenderer[], onError: (e: any) => void) {
    this.renderers = renders;
    this._decoder = new VideoDecoder({
      // @ts-ignore
      output: this._output.bind(this),
      error: onError,
    });
  }

  _output(frame: VideoFrame) {
    this.getFps();
    // Schedule the frame to be rendered.
    this._renderFrame(frame);
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
    }

    for (let renderer of this.renderers) {
      if (!renderer.container) continue;

      let span = renderer.container.querySelector('span');
      if (!span) {
        span = document.createElement('span');

        Object.assign(span.style, {
          position: 'absolute',
          bottom: '0',
          left: '0',
          zIndex: '10',
          width: '55px',
          background: '#fff',
        });

        renderer.container.style.position = 'relative';

        renderer.container.appendChild(span);
      }

      span.innerText = `fps: ${fps.toFixed(0)}`;
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

  decoderConfigure(frameInfo: EncodedVideoFrameInfo): boolean {
    // @ts-ignore
    let codec = frameCodecMapping[frameInfo.codecType];
    if (!codec) {
      logInfo('codec is not in frameCodecMapping, stop decode frame');
      return false;
    }
    this._decoder!.configure({
      codec: codec,
      codedWidth: frameInfo.width,
      codedHeight: frameInfo.height,
    });
    logInfo(
      `configure decoder: codedWidth: ${frameInfo.width}, codedHeight: ${frameInfo.height},codec: ${codec}`
    );
    for (let renderer of this.renderers) {
      renderer.setFrameSize({
        width: frameInfo.width!,
        height: frameInfo.height!,
      });
      this.pendingFrame = null;
    }
    return true;
  }

  // @ts-ignore
  decodeFrame(
    imageBuffer: Uint8Array,
    frameInfo: EncodedVideoFrameInfo,
    ts: number
  ) {
    console.log(
      'FRAMETYPE',
      frameInfo.uid,
      // frameInfo.frameType,
      // frameInfo,
      // imageBuffer,
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
    this.pendingFrame = null;
    try {
      this._decoder.close();
    } catch (e) {}
  }
}
