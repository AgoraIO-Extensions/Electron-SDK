import createAgoraRtcEngine from '../AgoraSdk';
import { WebCodecsDecoder } from '../Decoder/index';
import { EncodedVideoFrameInfo, VideoStreamType } from '../Private/AgoraBase';
import { IRtcEngineEx } from '../Private/IAgoraRtcEngineEx';
import { AgoraElectronBridge } from '../Private/internal/IrisApiEngine';

import { RendererContext, RendererType } from '../Types';
import { AgoraEnv, logInfo } from '../Utils';

import { IRendererCache, isUseConnection } from './IRendererCache';
import { WebCodecsRenderer } from './WebCodecsRenderer/index';

export class WebCodecsRendererCache extends IRendererCache {
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

  onDecoderError(e: any) {
    logInfo('webCodecsDecoder decode failed, fallback to native decoder', e);
    AgoraEnv.AgoraRendererManager?.handleWebCodecsFallback(this.cacheContext);
  }

  onEncodedVideoFrameReceived(...[data, buffer]: any) {
    let _data: any;
    try {
      _data = JSON.parse(data) ?? {};
    } catch (e) {
      _data = {};
    }
    if (
      Object.keys(_data).length === 0 ||
      !this._decoder ||
      this.cacheContext.uid !== _data.uid
    )
      return;
    if (this._firstFrame) {
      for (let renderer of this.renderers) {
        if (renderer.rendererType !== RendererType.WEBCODECSRENDERER) {
          continue;
        }
        renderer.bind(renderer.context.view, {
          width: _data.videoEncodedFrameInfo.width!,
          height: _data.videoEncodedFrameInfo.height!,
        });
      }

      try {
        this._decoder.decoderConfigure(_data.videoEncodedFrameInfo);
      } catch (error: any) {
        logInfo(error);
        return;
      }
      this._firstFrame = false;
    }
    if (this.shouldFallback(_data.videoEncodedFrameInfo)) {
      AgoraEnv.AgoraRendererManager?.handleWebCodecsFallback(this.cacheContext);
    } else {
      this._decoder.decodeFrame(
        buffer,
        _data.videoEncodedFrameInfo,
        new Date().getTime()
      );
    }
  }

  public draw() {
    if (isUseConnection(this.cacheContext)) {
      this._engine?.setRemoteVideoSubscriptionOptionsEx(
        this.cacheContext.uid!,
        {
          type: VideoStreamType.VideoStreamHigh,
          encodedFrameOnly: true,
        },
        {
          channelId: this.cacheContext.channelId,
          localUid: this.cacheContext.localUid,
        }
      );
    } else {
      this._engine?.setRemoteVideoSubscriptionOptions(this.cacheContext.uid!, {
        type: VideoStreamType.VideoStreamHigh,
        encodedFrameOnly: true,
      });
    }
    AgoraElectronBridge.OnEvent(
      `call_back_with_encoded_video_frame_${this.cacheContext.uid}`,
      (...params: any) => {
        try {
          this.onEncodedVideoFrameReceived(...params);
        } catch (e) {
          console.error(e);
        }
      }
    );
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
    AgoraElectronBridge.UnEvent(
      `call_back_with_encoded_video_frame_${this.cacheContext.uid}`
    );
    this._decoder?.release();
    this._decoder = null;
    super.release();
  }
}
