import {
  IAudioFrameObserver,
  IVideoFrameObserver,
  IVideoEncodedFrameObserver,
} from '../AgoraMediaBase';

export type IMediaEngineEvent = IAudioFrameObserver &
  IVideoFrameObserver &
  IVideoEncodedFrameObserver;

declare module '../IAgoraMediaEngine' {
  interface IMediaEngine {
    /**
     * @ignore
     */
    addListener<EventType extends keyof IMediaEngineEvent>(
      eventType: EventType,
      listener: IMediaEngineEvent[EventType]
    ): void;

    /**
     * @ignore
     */
    removeListener<EventType extends keyof IMediaEngineEvent>(
      eventType: EventType,
      listener: IMediaEngineEvent[EventType]
    ): void;

    /**
     * @ignore
     */
    removeAllListeners<EventType extends keyof IMediaEngineEvent>(
      eventType?: EventType
    ): void;
  }
}
