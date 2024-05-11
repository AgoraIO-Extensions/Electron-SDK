import createAgoraRtcEngine from '../AgoraSdk';
import { WebCodecsDecoder } from '../Decoder/index';
import { EncodedVideoFrameInfo, VideoStreamType } from '../Private/AgoraBase';
import { IVideoEncodedFrameObserver } from '../Private/AgoraMediaBase';
import { IRtcEngineEx } from '../Private/IAgoraRtcEngineEx';

import { RendererContext, RendererType } from '../Types';
import { AgoraEnv, logInfo } from '../Utils';

import { IRendererCache } from './IRendererCache';
import { WebCodecsRenderer } from './WebCodecsRenderer/index';

export class WebCodecsRendererCache
  extends IRendererCache
  implements IVideoEncodedFrameObserver
{
  private _decoder?: WebCodecsDecoder | null;
  private _engine?: IRtcEngineEx;
  private _firstFrame = true;

  constructor(context: RendererContext) {
    super(context);
    this._engine = createAgoraRtcEngine();
    this._decoder = new WebCodecsDecoder(
      this.renderers as WebCodecsRenderer[],
      this.onDecoderError.bind(this),
      context
    );
    this.draw();
  }

  onDecoderError() {
    logInfo('webCodecsDecoder decode failed, fallback to native decoder');
    AgoraEnv.AgoraRendererManager?.handleWebCodecsFallback(this.cacheContext);
  }

  onEncodedVideoFrameReceived(
    uid: number,
    imageBuffer: Uint8Array,
    length: number,
    videoEncodedFrameInfo: EncodedVideoFrameInfo
  ) {
    if (!this._decoder || this.cacheContext.uid !== uid) return;
    if (this._firstFrame) {
      for (let renderer of this.renderers) {
        if (renderer.rendererType !== RendererType.WEBCODECSRENDERER) {
          continue;
        }
        renderer.bind(renderer.context.view, {
          width: videoEncodedFrameInfo.width!,
          height: videoEncodedFrameInfo.height!,
        });
      }

      try {
        this._decoder.decoderConfigure(videoEncodedFrameInfo);
      } catch (error: any) {
        logInfo(error);
        return;
      }
      this._firstFrame = false;
    }
    if (this.shouldFallback(videoEncodedFrameInfo)) {
      AgoraEnv.AgoraRendererManager?.handleWebCodecsFallback(this.cacheContext);
    } else {
      this._decoder.decodeFrame(
        imageBuffer,
        videoEncodedFrameInfo,
        new Date().getTime()
      );
    }
  }

  public draw() {
    this._engine?.setRemoteVideoSubscriptionOptions(this.cacheContext.uid!, {
      type: VideoStreamType.VideoStreamHigh,
      encodedFrameOnly: true,
    });
    this._engine?.getMediaEngine().registerVideoEncodedFrameObserver(this);
  }

  public shouldFallback(frameInfo: EncodedVideoFrameInfo): boolean {
    let shouldFallback = false;
    if (!frameInfo.codecType) {
      shouldFallback = true;
      logInfo('codecType is not supported, fallback to native decoder');
    } else {
      const mapping =
        AgoraEnv.CapabilityManager?.frameCodecMapping[frameInfo.codecType];
      if (mapping === undefined) {
        shouldFallback = true;
        logInfo('codecType is not supported, fallback to native decoder');
      } else if (
        mapping.minWidth >= frameInfo.width! &&
        mapping.minHeight >= frameInfo.height! &&
        mapping.maxWidth <= frameInfo.width! &&
        mapping.maxHeight <= frameInfo.height!
      ) {
        shouldFallback = true;
        logInfo('frame size is not supported, fallback to native decoder');
      }
    }
    return shouldFallback;
  }

  public release(): void {
    logInfo('call_back_with_encoded_video_frame release');
    this._engine?.getMediaEngine().unregisterVideoEncodedFrameObserver(this);
    this._decoder?.release();
    this._decoder = null;
    super.release();
  }
}
