import { createCheckers } from 'ts-interface-checker';

import {
  IMusicContentCenterEventHandler,
  IMusicPlayer,
  Music,
} from '../IAgoraMusicContentCenter';

import { IMusicContentCenterEvent } from '../extension/IAgoraMusicContentCenterExtension';

import {
  IMusicContentCenterImpl,
  IMusicPlayerImpl,
  MusicCollectionImpl,
  processIMusicContentCenterEventHandler,
} from '../impl/IAgoraMusicContentCenterImpl';

import IAgoraMusicContentCenterTI from '../ti/IAgoraMusicContentCenter-ti';
const checkers = createCheckers(IAgoraMusicContentCenterTI);

import { MediaPlayerInternal } from './MediaPlayerInternal';

import { DeviceEventEmitter, EVENT_TYPE } from './IrisApiEngine';

export class MusicContentCenterInternal extends IMusicContentCenterImpl {
  static _event_handlers: IMusicContentCenterEventHandler[] = [];

  _addListenerPreCheck<EventType extends keyof IMusicContentCenterEvent>(
    eventType: EventType
  ): boolean {
    if (
      checkers.IMusicContentCenterEventHandler?.strictTest({
        [eventType]: undefined,
      })
    ) {
      if (MusicContentCenterInternal._event_handlers.length === 0) {
        this.registerEventHandler({});
      }
    }
    return true;
  }

  addListener<EventType extends keyof IMusicContentCenterEvent>(
    eventType: EventType,
    listener: IMusicContentCenterEvent[EventType]
  ): void {
    this._addListenerPreCheck(eventType);
    const callback = (...data: any[]) => {
      if (data[0] !== EVENT_TYPE.IMusicContentCenter) {
        return;
      }
      processIMusicContentCenterEventHandler(
        { [eventType]: listener },
        eventType,
        data[1]
      );
    };
    DeviceEventEmitter.addListener(eventType, callback);
  }

  removeListener<EventType extends keyof IMusicContentCenterEvent>(
    eventType: EventType,
    listener: IMusicContentCenterEvent[EventType]
  ) {
    DeviceEventEmitter.removeListener(eventType, listener);
  }

  removeAllListeners<EventType extends keyof IMusicContentCenterEvent>(
    eventType?: EventType
  ) {
    DeviceEventEmitter.removeAllListeners(eventType);
  }

  registerEventHandler(eventHandler: IMusicContentCenterEventHandler): number {
    if (
      !MusicContentCenterInternal._event_handlers.find(
        (value) => value === eventHandler
      )
    ) {
      MusicContentCenterInternal._event_handlers.push(eventHandler);
    }
    return super.registerEventHandler(eventHandler);
  }

  unregisterEventHandler(): number {
    MusicContentCenterInternal._event_handlers = [];
    return super.unregisterEventHandler();
  }

  release() {
    MusicContentCenterInternal._event_handlers = [];
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
    return this._musicCollection.music[index] ?? {};
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
