import { IMusicContentCenterImpl } from '../impl/IAgoraMusicContentCenterImpl';

import { IMusicPlayer, IMusicContentCenterEventHandler } from '../IAgoraMusicContentCenter';
import { MediaPlayerInternal } from './MediaPlayerInternal';
import { IMediaPlayer } from '../IAgoraMediaPlayer';

export class MusicContentCenterInternal extends IMusicContentCenterImpl {
  static _handlers: (
    | IMusicContentCenterEventHandler
  )[] = [];

  registerEventHandler(eventHandler: IMusicContentCenterEventHandler): number {
    if (
      !MusicContentCenterInternal._handlers.find((value) => value === eventHandler)
    ) {
      MusicContentCenterInternal._handlers.push(eventHandler);
    }
    return super.registerEventHandler(eventHandler);
  }

}
