import createAgoraRtcEngine from '../AgoraSdk';
import { WebCodecsDecoder } from '../Decoder/index';
import { EncodedVideoFrameInfo, VideoStreamType } from '../Private/AgoraBase';
import { IRtcEngineEventHandler } from '../Private/IAgoraRtcEngine';
import { IRtcEngineEx, RtcConnection } from '../Private/IAgoraRtcEngineEx';
import { AgoraElectronBridge } from '../Private/internal/IrisApiEngine';

import { RendererContext } from '../Types';
import { AgoraEnv, logInfo } from '../Utils';

import { IRendererCache } from './IRendererCache';
import { WebCodecsRenderer } from './WebCodecsRenderer/index';

export class WebCodecsRendererCache
  extends IRendererCache
  implements IRtcEngineEventHandler
{
  private _decoder?: WebCodecsDecoder | null;
  private _engine?: IRtcEngineEx;
  private _firstFrame = true;

  constructor({ channelId, uid, sourceType }: RendererContext) {
    super({ channelId, uid, sourceType });
    this._engine = createAgoraRtcEngine();
    this._decoder = new WebCodecsDecoder(
      this.renderers as WebCodecsRenderer[],
      this.onDecoderError.bind(this)
    );
    this.draw();
  }

  onDecoderError() {
    logInfo('webCodecsDecoder decode failed, fallback to native decoder');
    AgoraEnv.AgoraRendererManager?.handleWebCodecsFallback(this);
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
        AgoraEnv.AgoraRendererManager?.handleWebCodecsFallback(this);
        return;
      }
      this._firstFrame = false;
    }
    if (this.fallback(_data.videoEncodedFrameInfo)) {
      AgoraEnv.AgoraRendererManager?.handleWebCodecsFallback(this);
    } else {
      this._decoder.decodeFrame(
        buffer,
        _data.videoEncodedFrameInfo,
        new Date().getTime()
      );
    }
  }

  onUserJoined(connection: RtcConnection, remoteUid: number, _elapsed: number) {
    if (
      remoteUid === this.context.uid &&
      connection.channelId === this.context.channelId
    ) {
      this._engine?.setRemoteVideoSubscriptionOptions(remoteUid, {
        type: VideoStreamType.VideoStreamHigh,
        encodedFrameOnly: true,
      });
    }
  }

  public draw() {
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
    this._engine?.registerEventHandler(this);
  }

  public fallback(frameInfo: EncodedVideoFrameInfo): boolean {
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
    this._engine?.unregisterEventHandler(this);
    AgoraElectronBridge.UnEvent('call_back_with_encoded_video_frame');
    this._decoder?.release();
    this._decoder = null;
    super.release();
  }
}
