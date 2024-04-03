import { createAgoraRtcEngine, logInfo } from '../AgoraSdk';
import { WebCodecsDecoder } from '../Decoder/index';
import { EncodedVideoFrameInfo, VideoStreamType } from '../Private/AgoraBase';
import { IVideoEncodedFrameObserver } from '../Private/AgoraMediaBase';
import { IRtcEngineEventHandler } from '../Private/IAgoraRtcEngine';
import { IRtcEngineEx, RtcConnection } from '../Private/IAgoraRtcEngineEx';

import { RendererContext } from '../Types';

import { IRendererCache } from './IRendererCache';
import { WebCodecsRenderer } from './WebCodecsRenderer/index';

export class WebCodecsRendererCache
  extends IRendererCache
  implements IVideoEncodedFrameObserver, IRtcEngineEventHandler
{
  private _decoder?: WebCodecsDecoder | null;
  private _engine?: IRtcEngineEx;
  private _firstFrame = true;

  constructor({ channelId, uid, sourceType }: RendererContext) {
    super({ channelId, uid, sourceType });
    this._engine = createAgoraRtcEngine();
    this._decoder = new WebCodecsDecoder(
      this.renderers as WebCodecsRenderer[],
      this.onDecoderError
    );
    this.selfDecode = true;
    this.draw();
  }

  onDecoderError(e: any) {
    window.alert(`Decoder error:${JSON.stringify(e)}`);
    console.error('Decoder error:', e);
    this.release();
  }

  onEncodedVideoFrameReceived(
    uid: number,
    imageBuffer: Uint8Array,
    length: number,
    videoEncodedFrameInfo: EncodedVideoFrameInfo
  ) {
    if (!this._decoder) return;
    if (this._firstFrame) {
      let result = this._decoder.decoderConfigure(videoEncodedFrameInfo);
      if (!result) {
        logInfo('Failed to configure decoder, stop decoding frames.');
        this.release();
        return;
      }
      this._firstFrame = false;
    }
    this._decoder.decodeFrame(
      imageBuffer,
      videoEncodedFrameInfo,
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
    this._engine?.registerEventHandler(this);
    this._engine?.getMediaEngine().registerVideoEncodedFrameObserver(this);
  }

  public release(): void {
    this._engine?.getMediaEngine().unregisterVideoEncodedFrameObserver(this);
    this._engine?.unregisterEventHandler(this);
    this._decoder?.release();
    this._decoder = null;
    super.release();
  }
}
