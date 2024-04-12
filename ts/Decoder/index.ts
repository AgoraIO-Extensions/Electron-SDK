import {
  EncodedVideoFrameInfo,
  VideoCodecType,
  VideoFrameType,
} from '../Private/AgoraBase';

import { WebCodecsRenderer } from '../Renderer/WebCodecsRenderer/index';
import { RendererType } from '../Types';
import { logDebug, logInfo } from '../Utils';

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
  private _decoder: VideoDecoder;
  private renderers: WebCodecsRenderer[] = [];
  private pendingFrame: VideoFrame | null = null;

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
    // Schedule the frame to be rendered.
    this._renderFrame(frame);
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
      if (renderer.rendererType !== RendererType.WEBCODECSRENDERER) {
        continue;
      }
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
      if (renderer.rendererType !== RendererType.WEBCODECSRENDERER) {
        continue;
      }
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
    logDebug(
      'FRAMETYPE',
      frameInfo.uid,
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
    this.pendingFrame = null;
    try {
      this._decoder.close();
    } catch (e) {}
  }
}
