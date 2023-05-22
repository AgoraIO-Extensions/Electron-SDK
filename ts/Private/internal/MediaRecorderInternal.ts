import { createCheckers } from 'ts-interface-checker';

import { ErrorCodeType } from '../AgoraBase';
import { IMediaRecorderObserver } from '../AgoraMediaBase';
import { RtcConnection } from '../IAgoraRtcEngineEx';

import { IMediaRecorderEvent } from '../extension/IAgoraMediaRecorderExtension';

import AgoraMediaBaseTI from '../ti/AgoraMediaBase-ti';
const checkers = createCheckers(AgoraMediaBaseTI);

import {
  DeviceEventEmitter,
  EVENT_TYPE,
  EventProcessor,
} from './IrisApiEngine';

export class MediaRecorderInternal extends IMediaRecorderImpl {
  static _observers: Map<string, IMediaRecorderObserver> = new Map<
    string,
    IMediaRecorderObserver
  >();

  override setMediaRecorderObserver(
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

  override release() {
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
    const callback = (eventProcessor: EventProcessor<any>, data: any) => {
      if (eventProcessor.type(data) !== EVENT_TYPE.IMediaRecorder) {
        return;
      }
      const key =
        (data.connection?.channelId ?? '') + data.connection?.localUid;
      if (!MediaRecorderInternal._observers.has(key)) {
        return;
      }
      eventProcessor.func.map((it) => {
        it({ [eventType]: listener }, eventType, data);
      });
    };
    listener!.prototype.callback = callback;
    DeviceEventEmitter.addListener(eventType, callback);
  }

  removeListener<EventType extends keyof IMediaRecorderEvent>(
    eventType: EventType,
    listener?: IMediaRecorderEvent[EventType]
  ) {
    DeviceEventEmitter.removeListener(
      eventType,
      listener?.prototype.callback ?? listener
    );
  }

  removeAllListeners<EventType extends keyof IMediaRecorderEvent>(
    eventType?: EventType
  ) {
    DeviceEventEmitter.removeAllListeners(eventType);
  }
}

import { IMediaRecorderImpl } from '../impl/IAgoraMediaRecorderImpl';
