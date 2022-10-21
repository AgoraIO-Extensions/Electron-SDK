import {
  IMusicContentCenterImpl,
  IMusicPlayerImpl,
  MusicCollectionImpl,
} from '../impl/IAgoraMusicContentCenterImpl';

import {
  IMusicPlayer,
  IMusicContentCenterEventHandler,
  Music,
} from '../IAgoraMusicContentCenter';

import { MediaPlayerInternal } from './MediaPlayerInternal';
import { callIrisApi } from './IrisApiEngine';

interface IMusicCollectionJson {
  count: number;
  music: Music[];
  page: number;
  pageSize: number;
  total: number;
}

export class MusicContentCenterInternal extends IMusicContentCenterImpl {
  static _handlers: IMusicContentCenterEventHandler[] = [];

  registerEventHandler(eventHandler: IMusicContentCenterEventHandler): number {
    if (
      !MusicContentCenterInternal._handlers.find(
        (value) => value === eventHandler
      )
    ) {
      MusicContentCenterInternal._handlers.push(eventHandler);
    }
    return super.registerEventHandler(eventHandler);
  }

  createMusicPlayer(): IMusicPlayer {
    // @ts-ignore
    const mediaPlayerId = super.createMusicPlayer() as number;
    return new MusicPlayerInternal(mediaPlayerId);
  }
}

export class MusicPlayerInternal
  extends MediaPlayerInternal
  implements IMusicPlayer
{
  constructor(mediaPlayerId: number) {
    super(mediaPlayerId);
  }
  
  openWithSongCode(songCode: number, startPos = 0): number {
    const apiType = this.getApiTypeFromOpenWithSongCode(songCode, startPos);
    const jsonParams = {
      songCode: songCode,
      startPos: startPos,
      toJSON: () => {
        return {
          songCode: songCode,
          startPos: startPos,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromOpenWithSongCode(
    songCode: number,
    startPos = 0
  ): string {
    return 'MusicPlayer_open';
  }
}

export class MusicCollectionInternal extends MusicCollectionImpl {
  private readonly _musicCollectionJson: IMusicCollectionJson;

  constructor(musicCollectionJson: IMusicCollectionJson) {
    super();
    this._musicCollectionJson = musicCollectionJson;
  }

  getCount(): number {
    return this._musicCollectionJson.count;
  }

  getMusic(index: number): Music {
    return this._musicCollectionJson.music[index];
  }

  getPage(): number {
    return this._musicCollectionJson.page;
  }

  getPageSize(): number {
    return this._musicCollectionJson.pageSize;
  }

  getTotal(): number {
    return this._musicCollectionJson.total;
  }
}

export function processIMusicContentCenterServer(
  handler: IMusicContentCenterEventHandler,
  event: string,
  jsonParams: any
) {
  switch (event) {
    case 'onMusicChartsResult':
      if (handler.onMusicChartsResult !== undefined) {
        handler.onMusicChartsResult(
          jsonParams.requestId,
          jsonParams.status,
          jsonParams.result
        );
      }
      break;

    case 'onMusicCollectionResult':
      if (handler.onMusicCollectionResult !== undefined) {
        let result = new MusicCollectionInternal(jsonParams.result);
        handler.onMusicCollectionResult(
          jsonParams.requestId,
          jsonParams.status,
          result
        );
      }
      break;

    case 'onLyricResult':
      if (handler.onLyricResult !== undefined) {
        handler.onLyricResult(jsonParams.requestId, jsonParams.lyricUrl);
      }
      break;

    case 'onPreLoadEvent':
      if (handler.onPreLoadEvent !== undefined) {
        handler.onPreLoadEvent(
          jsonParams.songCode,
          jsonParams.percent,
          jsonParams.status,
          jsonParams.msg,
          jsonParams.lyricUrl
        );
      }
      break;
  }
}
