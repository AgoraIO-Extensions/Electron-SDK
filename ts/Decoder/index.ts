import {
  EncodedVideoFrameInfo,
  VideoCodecType,
  VideoFrameType,
} from '../Private/AgoraBase';
import {
  isFullySpecified,
  parseH264SpsColor,
  rewriteH264SpsColor,
  videoElementColorSpace,
} from '../Renderer/VideoElementRenderer/colorSpace';

import { IRenderer } from '../Renderer/IRenderer';
import { CodecConfigInfo, RendererCacheContext, RendererType } from '../Types';
import { AgoraEnv, logDebug, logInfo } from '../Utils';

const frameTypeMapping = {
  [VideoFrameType.VideoFrameTypeDeltaFrame]: 'delta',
  [VideoFrameType.VideoFrameTypeKeyFrame]: 'key',
  [VideoFrameType.VideoFrameTypeDroppableFrame]: 'delta', // this is a workaround for the issue that the frameType is not correct
};

export class WebCodecsDecoder {
  private _decoder: VideoDecoder;
  private renderers: IRenderer[] = [];
  private _cacheContext: RendererCacheContext;
  // eslint-disable-next-line auto-import/auto-import
  private pendingFrame: VideoFrame | null = null;
  private _currentCodecConfig: CodecConfigInfo | null = null;

  private _base_ts = 0;
  private _base_ts_ntp = 1;
  private _last_ts_ntp = 1;
  private _decode_retry_count = 0;
  // WebCodecs requires a key frame after configure(); delta frames before it are skipped.
  private _waitKeyFrame = true;
  private _colorSpaceKey = '';

  constructor(
    renders: IRenderer[],
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

  // eslint-disable-next-line auto-import/auto-import
  _output(frame: VideoFrame) {
    // <video> renderers take every decoded frame right away (the video pipeline paces them);
    // each needs its own VideoFrame because the renderer closes it.
    const videoElements = this.renderers.filter(
      (r) => r.rendererType === RendererType.VIDEOELEMENT
    );
    const hasCanvas = this.renderers.some(
      (r) => r.rendererType === RendererType.WEBCODECSRENDERER
    );
    if (videoElements.length > 0) {
      videoElements.forEach((renderer, i) => {
        const f =
          hasCanvas || i < videoElements.length - 1 ? frame.clone() : frame;
        renderer.drawFrame(
          this._cacheContext.uid!,
          f as any,
          this._currentCodecConfig!
        );
      });
      if (!hasCanvas) return;
    }
    // Schedule the frame to be rendered.
    this._renderFrame(frame);
  }

  // eslint-disable-next-line auto-import/auto-import
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
      renderer.drawFrame(
        this._cacheContext.uid!,
        this.pendingFrame as any,
        this._currentCodecConfig!
      );
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
        `codec ${frameInfo.codecType} is not in frameCodecMapping,failed to configure decoder, fallback to native decoder`
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
    this._colorSpaceKey = '';
    this._waitKeyFrame = true;
    logInfo(
      `configure decoder: codedWidth: ${frameInfo.width}, codedHeight: ${frameInfo.height},codec: ${codec}`
    );
  }

  /**
   * electron.rtc.video.enable_webcodec + video_element_color_mode "browser": make Chromium show the
   * stream the way its WebRTC decoder does. Chromium WebCodecs decodes an H.264 stream with an
   * incomplete VUI (e.g. 2/2/5 from SDK screen sharing) by its matrix, while WebRTC falls back to
   * BT.709 at >= 720 lines. The decoders take the color space from the bitstream and ignore
   * VideoDecoderConfig.colorSpace (Chrome 108, D3D11), so the SPS of each key frame is rewritten.
   * Mode "sdk" leaves the stream as is (WebCodecs then matches the SDK WebGL renderer, measured).
   */
  private applyColorSpace(
    buf: Uint8Array,
    frameInfo: EncodedVideoFrameInfo
  ): Uint8Array {
    if (AgoraEnv.videoElementColorMode !== 'browser') return buf;
    if (frameInfo.codecType !== VideoCodecType.VideoCodecH264) return buf;
    const coded = parseH264SpsColor(buf);
    if (!coded) return buf;
    if (isFullySpecified(coded)) return buf;
    const cs = videoElementColorSpace(coded, frameInfo.height ?? 0, 'browser');
    const key = JSON.stringify(cs);
    if (key !== this._colorSpaceKey) {
      this._colorSpaceKey = key;
      logInfo('WebCodecs: rewrite SPS color', JSON.stringify(coded), '->', key);
    }
    return rewriteH264SpsColor(buf, cs);
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

    if (this._waitKeyFrame) {
      if (frameType !== 'key') {
        logDebug('waiting for a key frame, skip delta frame');
        return;
      }
      this._waitKeyFrame = false;
    }

    if (frameType === 'key' && AgoraEnv.enableWebCodecsVideoElement) {
      imageBuffer = this.applyColorSpace(imageBuffer, frameInfo);
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
    this._waitKeyFrame = true;
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
