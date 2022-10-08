import {
  IRtcEngineEventHandler,
  IDirectCdnStreamingEventHandler,
  IMetadataObserver,
} from '../IAgoraRtcEngine';
import { IAudioSpectrumObserver } from '../AgoraMediaBase';
import { IAudioEncodedFrameObserver } from '../AgoraBase';

export type IRtcEngineEvent = IRtcEngineEventHandler &
  IDirectCdnStreamingEventHandler &
  IMetadataObserver &
  IAudioEncodedFrameObserver &
  IAudioSpectrumObserver;

declare module '../IAgoraRtcEngine' {
  interface IRtcEngine {
    /**
     * @ignore
     */
    addListener<EventType extends keyof IRtcEngineEvent>(
      eventType: EventType,
      listener: IRtcEngineEvent[EventType]
    ): void;

    /**
     * @ignore
     */
    removeListener<EventType extends keyof IRtcEngineEvent>(
      eventType: EventType,
      listener: IRtcEngineEvent[EventType]
    ): void;

    /**
     * @ignore
     */
    removeAllListeners<EventType extends keyof IRtcEngineEvent>(
      eventType?: EventType
    ): void;
  }
}
