import { createCheckers } from 'ts-interface-checker';

import { AgoraEnv } from '../../Utils';
import {
  IAudioFrameObserver,
  IVideoEncodedFrameObserver,
  IVideoFrameObserver,
} from '../AgoraMediaBase';
import { IMediaEngineEvent } from '../extension/IAgoraMediaEngineExtension';
import { IMediaEngineImpl } from '../impl/IAgoraMediaEngineImpl';
import AgoraMediaBaseTI from '../ti/AgoraMediaBase-ti';
const checkers = createCheckers(AgoraMediaBaseTI);

import {
  DeviceEventEmitter,
  EVENT_TYPE,
  EventProcessor,
} from './IrisApiEngine';

export class MediaEngineInternal extends IMediaEngineImpl {
  static _audio_frame_observers: IAudioFrameObserver[] = [];
  static _video_frame_observers: IVideoFrameObserver[] = [];
  static _video_encoded_frame_observers: IVideoEncodedFrameObserver[] = [];

  override registerAudioFrameObserver(observer: IAudioFrameObserver): number {
    if (
      !MediaEngineInternal._audio_frame_observers.find(
        (value) => value === observer
      )
    ) {
      MediaEngineInternal._audio_frame_observers.push(observer);
    }
    return super.registerAudioFrameObserver(observer);
  }

  override unregisterAudioFrameObserver(observer: IAudioFrameObserver): number {
    MediaEngineInternal._audio_frame_observers =
      MediaEngineInternal._audio_frame_observers.filter(
        (value) => value !== observer
      );
    return super.unregisterAudioFrameObserver(observer);
  }

  override registerVideoFrameObserver(observer: IVideoFrameObserver): number {
    if (
      !MediaEngineInternal._video_frame_observers.find(
        (value) => value === observer
      )
    ) {
      MediaEngineInternal._video_frame_observers.push(observer);
    }
    return super.registerVideoFrameObserver(observer);
  }

  override unregisterVideoFrameObserver(observer: IVideoFrameObserver): number {
    MediaEngineInternal._video_frame_observers =
      MediaEngineInternal._video_frame_observers.filter(
        (value) => value !== observer
      );
    return super.unregisterVideoFrameObserver(observer);
  }

  override registerVideoEncodedFrameObserver(
    observer: IVideoEncodedFrameObserver
  ): number {
    // only call iris when no event handler registered
    let callIris =
      MediaEngineInternal._video_encoded_frame_observers.length === 0;
    if (
      !MediaEngineInternal._video_encoded_frame_observers.find(
        (value) => value === observer
      )
    ) {
      MediaEngineInternal._video_encoded_frame_observers.push(observer);
    }
    return callIris ? super.registerVideoEncodedFrameObserver(observer) : 1;
  }

  override unregisterVideoEncodedFrameObserver(
    observer: IVideoEncodedFrameObserver
  ): number {
    MediaEngineInternal._video_encoded_frame_observers =
      MediaEngineInternal._video_encoded_frame_observers.filter(
        (value) => value !== observer
      );
    // only call iris when no event handler registered
    let callIris =
      MediaEngineInternal._video_encoded_frame_observers.length === 0;
    return callIris ? super.unregisterVideoEncodedFrameObserver(observer) : 1;
  }

  override release() {
    MediaEngineInternal._audio_frame_observers = [];
    MediaEngineInternal._video_frame_observers = [];
    MediaEngineInternal._video_encoded_frame_observers = [];
    if (AgoraEnv.enableWebCodecsDecoder) {
      this.unregisterVideoEncodedFrameObserver({});
    }
    this.removeAllListeners();
    super.release();
  }

  _addListenerPreCheck<EventType extends keyof IMediaEngineEvent>(
    eventType: EventType
  ): boolean {
    if (
      checkers.IAudioFrameObserver?.strictTest({
        [eventType]: undefined,
      })
    ) {
      if (MediaEngineInternal._audio_frame_observers.length === 0) {
        this.registerAudioFrameObserver({});
      }
    }
    if (
      checkers.IVideoFrameObserver?.strictTest({
        [eventType]: undefined,
      })
    ) {
      if (MediaEngineInternal._video_frame_observers.length === 0) {
        this.registerVideoFrameObserver({});
      }
    }
    if (
      checkers.IVideoEncodedFrameObserver?.strictTest({
        [eventType]: undefined,
      })
    ) {
      if (MediaEngineInternal._video_encoded_frame_observers.length === 0) {
        this.registerVideoEncodedFrameObserver({});
      }
    }
    return true;
  }

  addListener<EventType extends keyof IMediaEngineEvent>(
    eventType: EventType,
    listener: IMediaEngineEvent[EventType]
  ) {
    this._addListenerPreCheck(eventType);
    const callback = (eventProcessor: EventProcessor<any>, data: any) => {
      if (eventProcessor.type(data) !== EVENT_TYPE.IMediaEngine) {
        return;
      }
      eventProcessor.func.map((it) => {
        it({ [eventType]: listener }, eventType, data);
      });
    };
    // @ts-ignore
    listener!.agoraCallback = callback;
    DeviceEventEmitter.addListener(eventType, callback);
  }

  removeListener<EventType extends keyof IMediaEngineEvent>(
    eventType: EventType,
    listener?: IMediaEngineEvent[EventType]
  ) {
    DeviceEventEmitter.removeListener(
      eventType,
      // @ts-ignore
      listener?.agoraCallback ?? listener
    );
  }

  removeAllListeners<EventType extends keyof IMediaEngineEvent>(
    eventType?: EventType
  ) {
    DeviceEventEmitter.removeAllListeners(eventType);
  }
}
