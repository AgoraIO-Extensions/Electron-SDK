import {
  IMusicContentCenterImpl,
  IMusicPlayerImpl,
  MusicCollectionImpl,
} from '../impl/IAgoraMusicContentCenterImpl';
import {
  IMusicContentCenterEventHandler,
  IMusicPlayer,
  Music,
} from '../IAgoraMusicContentCenter';
import { MediaPlayerInternal } from './MediaPlayerInternal';

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

  unregisterEventHandler(): number {
    MusicContentCenterInternal._handlers = [];
    return super.unregisterEventHandler();
  }

  release() {
    MusicContentCenterInternal._handlers = [];
    super.release();
  }

  createMusicPlayer(): IMusicPlayer {
    // @ts-ignore
    const mediaPlayerId = super.createMusicPlayer() as number;
    return new MusicPlayerInternal(mediaPlayerId);
  }
}

class _MusicPlayerInternal extends IMusicPlayerImpl {
  private readonly _mediaPlayerId: number;

  constructor(mediaPlayerId: number) {
    super();
    this._mediaPlayerId = mediaPlayerId;
  }

  getMediaPlayerId(): number {
    return this._mediaPlayerId;
  }

  protected getApiTypeFromOpenWithSongCode(
    songCode: number,
    startPos = 0
  ): string {
    return 'MusicPlayer_open';
  }
}

export class MusicPlayerInternal
  extends MediaPlayerInternal
  implements IMusicPlayer
{
  private readonly _musicPlayer: IMusicPlayer;

  constructor(mediaPlayerId: number) {
    super(mediaPlayerId);
    // @ts-ignore
    this._musicPlayer = new _MusicPlayerInternal(mediaPlayerId);
  }

  openWithSongCode(songCode: number, startPos?: number): number {
    return this._musicPlayer.openWithSongCode(songCode, startPos);
  }
}

interface _MusicCollection {
  count: number;
  music: Music[];
  page: number;
  pageSize: number;
  total: number;
}

export class MusicCollectionInternal extends MusicCollectionImpl {
  private readonly _musicCollection: _MusicCollection;

  constructor(musicCollection: _MusicCollection) {
    super();
    this._musicCollection = musicCollection;
  }

  getCount(): number {
    return this._musicCollection.count;
  }

  getMusic(index: number): Music {
    return this._musicCollection.music[index];
  }

  getPage(): number {
    return this._musicCollection.page;
  }

  getPageSize(): number {
    return this._musicCollection.pageSize;
  }

  getTotal(): number {
    return this._musicCollection.total;
  }
}
