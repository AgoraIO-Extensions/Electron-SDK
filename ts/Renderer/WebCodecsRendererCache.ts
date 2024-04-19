import createAgoraRtcEngine from '../AgoraSdk';
import { WebCodecsDecoder } from '../Decoder/index';
import { EncodedVideoFrameInfo, VideoStreamType } from '../Private/AgoraBase';
import { IRtcEngineEx } from '../Private/IAgoraRtcEngineEx';
import { AgoraElectronBridge } from '../Private/internal/IrisApiEngine';

import { RendererContext } from '../Types';
import { AgoraEnv, logInfo } from '../Utils';

import { IRendererCache } from './IRendererCache';
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
      this.onDecoderError.bind(this)
    );
    this.draw();
  }

  onDecoderError() {
    logInfo('webCodecsDecoder decode failed, fallback to native decoder');
    AgoraEnv.AgoraRendererManager?.handleWebCodecsFallback(this.context);
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
      this.context.uid !== _data.uid
    )
      return;
    if (this._firstFrame) {
      let result = this._decoder.decoderConfigure(_data.videoEncodedFrameInfo);
      if (!result) {
        logInfo('failed to configure decoder, fallback to native decoder');
        AgoraEnv.AgoraRendererManager?.handleWebCodecsFallback(this.context);
        return;
      }
      this._firstFrame = false;
    }
    if (this.shouldFallback(_data.videoEncodedFrameInfo)) {
      AgoraEnv.AgoraRendererManager?.handleWebCodecsFallback(this.context);
    } else {
      this._decoder.decodeFrame(
        buffer,
        _data.videoEncodedFrameInfo,
        new Date().getTime()
      );
    }
  }

  public draw() {
    this._engine?.setRemoteVideoSubscriptionOptions(this.context.uid!, {
      type: VideoStreamType.VideoStreamHigh,
      encodedFrameOnly: true,
    });
    AgoraElectronBridge.OnEvent(
      'call_back_with_encoded_video_frame',
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
    AgoraElectronBridge.UnEvent('call_back_with_encoded_video_frame');
    this._decoder?.release();
    this._decoder = null;
    super.release();
  }
}
