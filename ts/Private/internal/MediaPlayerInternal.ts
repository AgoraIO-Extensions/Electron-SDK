import { AgoraEnv, logDebug, logError, logWarn, parseJSON } from "../../Utils";
import { VideoSourceType } from "../AgoraBase";
import { RenderModeType } from "../AgoraMediaBase";
import { IMediaPlayerSourceObserver } from "../IAgoraMediaPlayerSource";
import { IMediaPlayerImpl } from "../impl/IAgoraMediaPlayerImpl";
import { processIMediaPlayerSourceObserver } from "../impl/IAgoraMediaPlayerSourceImpl";
import { callIrisApi } from "./IrisApiEngine";

const MediaPlayerSplitString = "MediaPlayerSourceObserver_";

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

  let splitStr = event.split(MediaPlayerSplitString);
  logDebug("agora  ", splitStr);
  AgoraEnv.mediaPlayerEventManager.forEach((value) => {
    if (!value) {
      return;
    }
    try {
      processIMediaPlayerSourceObserver(value.handler, splitStr[1], obj);
    } catch (error) {
      logError("mediaPlayerEventHandlers::processIMediaPlayerSourceObserver");
    }
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
    AgoraEnv.mediaPlayerEventManager.push({ mpk: this, handler: observer });
    return 0;
  }

  unregisterPlayerSourceObserver(observer: IMediaPlayerSourceObserver): number {
    AgoraEnv.mediaPlayerEventManager = AgoraEnv.mediaPlayerEventManager.filter(
      (value) => value.handler !== observer
    );
    return 0;
  }
  override setView(view: HTMLElement): number {
    logWarn("Also can use other api setupLocalVideo");
    AgoraEnv.AgoraRendererManager?.setupVideo({
      videoSourceType: VideoSourceType.VideoSourceMediaPlayer,
      uid: this._mediaPlayerId,
      view,
    });
    return 0;
  }
  override setRenderMode(renderMode: RenderModeType): number {
    logWarn(
      "Also can use other api setRenderOption or setRenderOptionByConfig"
    );
    AgoraEnv.AgoraRendererManager?.setRenderOptionByConfig({
      videoSourceType: VideoSourceType.VideoSourceMediaPlayer,
      uid: this._mediaPlayerId,
      rendererOptions: {
        contentMode:
          renderMode === RenderModeType.RenderModeFit
            ? RenderModeType.RenderModeFit
            : RenderModeType.RenderModeHidden,
        mirror: true,
      },
    });
    return 0;
  }

  setPlayerOptionInInt(key: string, value: number): number {
    const apiType = "MediaPlayer_setPlayerOption";
    const jsonParams = {
      key,
      value,
      toJSON: () => {
        return {
          key,
          value,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  setPlayerOptionInString(key: string, value: string): number {
    const apiType = "MediaPlayer_setPlayerOption2";
    const jsonParams = {
      key,
      value,
      toJSON: () => {
        return {
          key,
          value,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }
}
