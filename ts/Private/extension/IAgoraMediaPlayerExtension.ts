import { IMediaPlayerSourceObserver } from '../IAgoraMediaPlayerSource';
import {
  IMediaPlayerAudioFrameObserver,
  IMediaPlayerVideoFrameObserver,
} from '../IAgoraMediaPlayer';
import { IAudioSpectrumObserver } from '../AgoraMediaBase';

export type IMediaPlayerEvent = IMediaPlayerSourceObserver &
  IMediaPlayerAudioFrameObserver &
  IMediaPlayerVideoFrameObserver &
  IAudioSpectrumObserver;

declare module '../IAgoraMediaPlayer' {
  interface IMediaPlayer {
    /**
     * @ignore
     */
    addListener<EventType extends keyof IMediaPlayerEvent>(
      eventType: EventType,
      listener: IMediaPlayerEvent[EventType]
    ): void;

    /**
     * @ignore
     */
    removeListener<EventType extends keyof IMediaPlayerEvent>(
      eventType: EventType,
      listener: IMediaPlayerEvent[EventType]
    ): void;

    /**
     * @ignore
     */
    removeAllListeners<EventType extends keyof IMediaPlayerEvent>(
      eventType?: EventType
    ): void;

    /**
     * @ignore
     */
    release(): void;
  }
}
