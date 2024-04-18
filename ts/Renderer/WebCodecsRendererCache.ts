import createAgoraRtcEngine, { logError, logInfo } from '../AgoraSdk';
import { WebCodecsDecoder } from '../Decoder/index';
import { EncodedVideoFrameInfo, VideoStreamType } from '../Private/AgoraBase';
import { IRtcEngineEventHandler } from '../Private/IAgoraRtcEngine';
import { IRtcEngineEx, RtcConnection } from '../Private/IAgoraRtcEngineEx';
import { AgoraElectronBridge } from '../Private/internal/IrisApiEngine';

import { RendererContext } from '../Types';
import { AgoraEnv } from '../Utils';

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

  onDecoderError(e: any) {
    logError('Decoder error:', e);
    //todo need add some fallback logic
    if (this.context.uid) {
      this._engine?.setRemoteVideoSubscriptionOptions(this.context.uid, {
        type: VideoStreamType.VideoStreamHigh,
        encodedFrameOnly: false,
      });
    }
    this.release();
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
        logInfo('Failed to configure decoder, stop decoding frames.');
        this.release();
        return;
      }
      this._firstFrame = false;
    }
    this._decoder.decodeFrame(
      buffer,
      _data.videoEncodedFrameInfo,
      new Date().getTime()
    );
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

  public fallback(frameInfo: EncodedVideoFrameInfo): void {
    if (
      !frameInfo.codecType ||
      AgoraEnv.CapabilityManager?.frameCodecMapping[frameInfo.codecType] ===
        undefined
    ) {
      logInfo('codecType is not supported, fallback to native decoder');
      return;
    }
    // if (
    //   !frameInfo.codecType ||
    //   AgoraEnv.CapabilityManager?.frameCodecMapping[frameInfo.codecType] ===
    //     undefined
    // ) {
    //   logInfo('codecType is not supported, fallback to native decoder');
    //   return;
    // }
  }

  public release(): void {
    this._engine?.unregisterEventHandler(this);
    AgoraElectronBridge.UnEvent('call_back_with_encoded_video_frame');
    this._decoder?.release();
    this._decoder = null;
    super.release();
  }
}
