import { IMediaRecorderObserver } from '../AgoraMediaBase';

export type IMediaRecorderEvent = IMediaRecorderObserver;

declare module '../IAgoraMediaRecorder' {
  interface IMediaRecorder {
    addListener<EventType extends keyof IMediaRecorderEvent>(
      eventType: EventType,
      listener: IMediaRecorderEvent[EventType]
    ): void;

    removeListener<EventType extends keyof IMediaRecorderEvent>(
      eventType: EventType,
      listener: IMediaRecorderEvent[EventType]
    ): void;

    removeAllListeners<EventType extends keyof IMediaRecorderEvent>(
      eventType?: EventType
    ): void;
  }
}
