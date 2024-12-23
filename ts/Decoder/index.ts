import { EncodedVideoFrameInfo, VideoFrameType } from '../Private/AgoraBase';

import { WebCodecsRenderer } from '../Renderer/WebCodecsRenderer/index';
import { CodecConfigInfo, RendererCacheContext, RendererType } from '../Types';
import { AgoraEnv, logDebug, logInfo } from '../Utils';

const frameTypeMapping = {
  [VideoFrameType.VideoFrameTypeDeltaFrame]: 'delta',
  [VideoFrameType.VideoFrameTypeKeyFrame]: 'key',
  [VideoFrameType.VideoFrameTypeDroppableFrame]: 'delta', // this is a workaround for the issue that the frameType is not correct
};

export class WebCodecsDecoder {
  private _decoder: VideoDecoder;
  private renderers: WebCodecsRenderer[] = [];
  private _cacheContext: RendererCacheContext;
  private pendingFrame: VideoFrame | null = null;
  private _currentCodecConfig: CodecConfigInfo | null = null;

  private _base_ts = 0;
  private _base_ts_ntp = 1;
  private _last_ts_ntp = 1;
  private _decode_retry_count = 0;

  constructor(
    renders: WebCodecsRenderer[],
    onError: (e: any) => void,
    context: RendererCacheContext
  ) {
    this.renderers = renders;
    this._cacheContext = context;
    this._decoder = new VideoDecoder({
      // @ts-ignore
      output: this._output.bind(this),
      error: (e) => {
        onError(e);
      },
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
      renderer.drawFrame(this.pendingFrame, this._currentCodecConfig!);
      this.pendingFrame = null;
    }
  }

  decoderConfigure(frameInfo: EncodedVideoFrameInfo) {
    this.pendingFrame = null;
    // @ts-ignore
    let codec =
      AgoraEnv.CapabilityManager?.frameCodecMapping[frameInfo.codecType!]
        ?.codec;
    if (!codec) {
      AgoraEnv.AgoraRendererManager?.handleWebCodecsFallback(
        this._cacheContext
      );
      throw new Error(
        'codec is not in frameCodecMapping,failed to configure decoder, fallback to native decoder'
      );
    }
    this._currentCodecConfig = {
      codecType: frameInfo.codecType,
      codedWidth: frameInfo.width,
      codedHeight: frameInfo.height,
      rotation: frameInfo.rotation,
    };
    this._decoder!.configure({
      codec: codec,
      codedWidth: frameInfo.width,
      codedHeight: frameInfo.height,
    });
    logInfo(
      `configure decoder: codedWidth: ${frameInfo.width}, codedHeight: ${frameInfo.height},codec: ${codec}`
    );
  }

  updateTimestamps(ts: number) {
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
  }

  handleCodecIsChanged(frameInfo: EncodedVideoFrameInfo) {
    if (
      this._currentCodecConfig?.codecType !== frameInfo.codecType ||
      this._currentCodecConfig?.codedWidth !== frameInfo.width ||
      this._currentCodecConfig?.codedHeight !== frameInfo.height ||
      this._currentCodecConfig?.rotation !== frameInfo.rotation
    ) {
      logInfo('frameInfo has changed, reconfigure decoder');
      this._decoder.reset();
      this.decoderConfigure(frameInfo);
    }
  }

  // @ts-ignore
  decodeFrame(
    imageBuffer: Uint8Array,
    frameInfo: EncodedVideoFrameInfo,
    ts: number
  ) {
    try {
      this.handleCodecIsChanged(frameInfo);
    } catch (error: any) {
      logInfo(error);
      return;
    }

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

    this.updateTimestamps(ts);

    try {
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
      this._decode_retry_count = 0;
    } catch (e) {
      /// There are some cases that the decoder failed to decode the frame, we will retry for a few times
      /// If the decoder still failed to decode the frame, we will fallback to native decoder
      /// The retry count is defined in AgoraEnv.maxDecodeRetryCount
      /// The retry count will be reset to 0 when the decoder successfully decode a frame
      if (this._decode_retry_count >= AgoraEnv.maxDecodeRetryCount) {
        AgoraEnv.AgoraRendererManager?.handleWebCodecsFallback(
          this._cacheContext
        );
        throw new Error(
          `failed to decode frame over ${this._decode_retry_count} times, fallback to native decoder`
        );
      }
      this._decode_retry_count++;
    }
  }

  reset() {
    this._base_ts = 0;
    this._base_ts_ntp = 1;
    this._last_ts_ntp = 1;
    this._decoder.reset();
  }

  release() {
    try {
      if (this.pendingFrame) {
        this.pendingFrame.close();
      }
      this._decoder.close();
    } catch (e) {}
    this.pendingFrame = null;
  }
}
