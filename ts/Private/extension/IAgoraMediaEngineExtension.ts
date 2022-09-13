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
    addListener?<EventType extends keyof IMediaEngineEvent>(
      eventType: EventType,
      listener: IMediaEngineEvent[EventType]
    ): void;

    removeListener?<EventType extends keyof IMediaEngineEvent>(
      eventType: EventType,
      listener: IMediaEngineEvent[EventType]
    ): void;

    removeAllListeners?<EventType extends keyof IMediaEngineEvent>(
      eventType?: EventType
    ): void;
  }
}
