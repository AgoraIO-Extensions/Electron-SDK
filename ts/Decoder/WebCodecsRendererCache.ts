import { createAgoraRtcEngine } from '../AgoraSdk';
import { EncodedVideoFrameInfo, VideoStreamType } from '../Private/AgoraBase';
import { IVideoEncodedFrameObserver } from '../Private/AgoraMediaBase';
import { IRtcEngineEventHandler } from '../Private/IAgoraRtcEngine';
import { IRtcEngineEx, RtcConnection } from '../Private/IAgoraRtcEngineEx';
import { IRendererCache } from '../Renderer/IRendererCache';
import { RendererContext } from '../Types';

import { WebCodecsDecoder } from './WebCodecsDecoder';
import { WebCodecsRenderer } from './WebCodecsRenderer';

export class WebCodecsRendererCache
  extends IRendererCache
  implements IVideoEncodedFrameObserver, IRtcEngineEventHandler
{
  private _decoder?: WebCodecsDecoder | null;
  private _engine?: IRtcEngineEx;

  constructor({ channelId, uid, sourceType }: RendererContext) {
    super({ channelId, uid, sourceType });
    this._engine = createAgoraRtcEngine();
    this._decoder = new WebCodecsDecoder(
      this._renderers as WebCodecsRenderer[]
    );
    this._decoder.enableFps = true;
    this._engine.registerEventHandler(this);
  }

  onEncodedVideoFrameReceived(
    uid: number,
    imageBuffer: Uint8Array,
    length: number,
    videoEncodedFrameInfo: EncodedVideoFrameInfo
  ) {
    if (!this._decoder) return;
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
