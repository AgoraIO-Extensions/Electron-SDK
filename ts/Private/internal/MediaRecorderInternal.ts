import { createCheckers } from 'ts-interface-checker';

import { ErrorCodeType } from '../AgoraBase';
import { IMediaRecorderObserver } from '../AgoraMediaBase';
import { RtcConnection } from '../IAgoraRtcEngineEx';

import { IMediaRecorderEvent } from '../extension/IAgoraMediaRecorderExtension';

import { processIMediaRecorderObserver } from '../impl/AgoraMediaBaseImpl';
import { IMediaRecorderImpl } from '../impl/IAgoraMediaRecorderImpl';

import AgoraMediaBaseTI from '../ti/AgoraMediaBase-ti';
const checkers = createCheckers(AgoraMediaBaseTI);

import { DeviceEventEmitter, EVENT_TYPE } from './IrisApiEngine';

export class MediaRecorderInternal extends IMediaRecorderImpl {
  static _observers: Map<string, IMediaRecorderObserver> = new Map<
    string,
    IMediaRecorderObserver
  >();

  setMediaRecorderObserver(
    connection: RtcConnection,
    callback: IMediaRecorderObserver
  ): number {
    const key = (connection.channelId ?? '') + connection.localUid;
    if (MediaRecorderInternal._observers.has(key)) {
      return ErrorCodeType.ErrOk;
    }
    MediaRecorderInternal._observers.set(key, callback);
    return super.setMediaRecorderObserver(connection, callback);
  }

  release() {
    MediaRecorderInternal._observers.clear();
    this.removeAllListeners();
    super.release();
  }

  _addListenerPreCheck<EventType extends keyof IMediaRecorderEvent>(
    eventType: EventType
  ): boolean {
    if (
      checkers.IMediaRecorderObserver?.strictTest({
        [eventType]: undefined,
      })
    ) {
      if (MediaRecorderInternal._observers.size === 0) {
        console.error(
          'Please call `setMediaRecorderObserver` before you want to receive event by `addListener`'
        );
        return false;
      }
    }
    return true;
  }

  addListener<EventType extends keyof IMediaRecorderEvent>(
    eventType: EventType,
    listener: IMediaRecorderEvent[EventType]
  ): void {
    this._addListenerPreCheck(eventType);
    const callback = (...data: any[]) => {
      if (data[0] !== EVENT_TYPE.IMediaRecorder) {
        return;
      }
      processIMediaRecorderObserver(
        { [eventType]: listener },
        eventType,
        data[1]
      );
    };
    DeviceEventEmitter.addListener(eventType, callback);
  }

  removeListener<EventType extends keyof IMediaRecorderEvent>(
    eventType: EventType,
    listener: IMediaRecorderEvent[EventType]
  ) {
    DeviceEventEmitter.removeListener(eventType, listener);
  }

  removeAllListeners<EventType extends keyof IMediaRecorderEvent>(
    eventType?: EventType
  ) {
    DeviceEventEmitter.removeAllListeners(eventType);
  }
}
