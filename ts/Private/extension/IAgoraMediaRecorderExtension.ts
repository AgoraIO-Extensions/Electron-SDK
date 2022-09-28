import { IMediaRecorderObserver } from '../AgoraMediaBase';

export type IMediaRecorderEvent = IMediaRecorderObserver;

declare module '../IAgoraMediaRecorder' {
  interface IMediaRecorder {
    /**
     * @ignore
     */
    addListener<EventType extends keyof IMediaRecorderEvent>(
      eventType: EventType,
      listener: IMediaRecorderEvent[EventType]
    ): void;

    /**
     * @ignore
     */
    removeListener<EventType extends keyof IMediaRecorderEvent>(
      eventType: EventType,
      listener: IMediaRecorderEvent[EventType]
    ): void;

    /**
     * @ignore
     */
    removeAllListeners<EventType extends keyof IMediaRecorderEvent>(
      eventType?: EventType
    ): void;
  }
}
