import { AgoraEnv, logDebug, logWarn, parseJSON } from "../../Utils";
import { VideoSourceType } from "../AgoraBase";
import { IMediaPlayerSourceObserver } from "../IAgoraMediaPlayerSource";
import { IMediaPlayerImpl } from "../impl/IAgoraMediaPlayerImpl";
import { processIMediaPlayerSourceObserver } from "../impl/IAgoraMediaPlayerSourceImpl";

// event: string,
// data: string,
// buffer: Uint8Array[],
// bufferLength: number,
// bufferCount: number
export const handlerMPKEvent = function (
  event: string,
  data: string,
  buffer: Uint8Array[],
  bufferLength: number,
  bufferCount: number
) {
  const obj = parseJSON(data);
  logDebug(
    "event",
    event,
    "data",
    obj,
    "buffer",
    buffer,
    "bufferLength",
    bufferLength,
    "bufferCount",
    bufferCount
  );

  AgoraEnv.mediaPlayerEventHandlers.forEach((value) => {
    processIMediaPlayerSourceObserver(value, event, obj);
  });
};

export class MediaPlayerInternal extends IMediaPlayerImpl {
  static _observers: IMediaPlayerSourceObserver[] = [];
  _mediaPlayerId: number;

  constructor(mediaPlayerId: number) {
    super();
    this._mediaPlayerId = mediaPlayerId;
  }

  getMediaPlayerId(): number {
    return this._mediaPlayerId;
  }

  registerPlayerSourceObserver(observer: IMediaPlayerSourceObserver): number {
    AgoraEnv.mediaPlayerEventHandlers.push(observer);

    return 0;
  }

  unregisterPlayerSourceObserver(observer: IMediaPlayerSourceObserver): number {
    AgoraEnv.mediaPlayerEventHandlers =
      AgoraEnv.mediaPlayerEventHandlers.filter((value) => value !== observer);
    return 0;
  }
  override setView(view: HTMLElement): number {
    logWarn("Also can use other api (setupVideo or setupLocalVideo) ");
    AgoraEnv.AgoraRendererManager?.setupVideo({
      videoSourceType: VideoSourceType.VideoSourceMediaPlayer,
      uid: this._mediaPlayerId,
      view,
    });
    return 0;
  }
}
