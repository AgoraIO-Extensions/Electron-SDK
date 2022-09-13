import { EncodedVideoFrameInfo, ErrorCodeType } from '../AgoraBase';
import { IMediaEngineImpl } from '../impl/IAgoraMediaEngineImpl';
import {
  AudioFrame,
  ExternalVideoFrame,
  IAudioFrameObserver,
  IVideoEncodedFrameObserver,
  IVideoFrameObserver,
  MediaSourceType,
} from '../AgoraMediaBase';
import { IMediaEngineEvent } from '../extension/IAgoraMediaEngineExtension';
import {
  processIAudioFrameObserver,
  processIVideoEncodedFrameObserver,
  processIVideoFrameObserver,
} from '../impl/AgoraMediaBaseImpl';
import { callIrisApi, DeviceEventEmitter, EVENT_TYPE } from './IrisApiEngine';

export class MediaEngineInternal extends IMediaEngineImpl {
  static _audio_frame_observers: IAudioFrameObserver[] = [];
  static _video_frame_observers: IVideoFrameObserver[] = [];
  static _video_encoded_frame_observers: IVideoEncodedFrameObserver[] = [];
  private _events: Map<
    any,
    { eventType: string; listener: (...args: any[]) => any }
  > = new Map<any, { eventType: string; listener: (...args: any[]) => any }>();

  registerAudioFrameObserver(observer: IAudioFrameObserver): number {
    if (
      !MediaEngineInternal._audio_frame_observers.find(
        (value) => value === observer
      )
    ) {
      MediaEngineInternal._audio_frame_observers.push(observer);
    }
    return super.registerAudioFrameObserver(observer);
  }

  unregisterAudioFrameObserver(observer: IAudioFrameObserver): number {
    MediaEngineInternal._audio_frame_observers =
      MediaEngineInternal._audio_frame_observers.filter(
        (value) => value !== observer
      );
    return super.unregisterAudioFrameObserver(observer);
  }

  registerVideoFrameObserver(observer: IVideoFrameObserver): number {
    if (
      !MediaEngineInternal._video_frame_observers.find(
        (value) => value === observer
      )
    ) {
      MediaEngineInternal._video_frame_observers.push(observer);
    }
    return super.registerVideoFrameObserver(observer);
  }

  unregisterVideoFrameObserver(observer: IVideoFrameObserver): number {
    MediaEngineInternal._video_frame_observers =
      MediaEngineInternal._video_frame_observers.filter(
        (value) => value !== observer
      );
    return super.unregisterVideoFrameObserver(observer);
  }

  registerVideoEncodedFrameObserver(
    observer: IVideoEncodedFrameObserver
  ): number {
    if (
      !MediaEngineInternal._video_encoded_frame_observers.find(
        (value) => value === observer
      )
    ) {
      MediaEngineInternal._video_encoded_frame_observers.push(observer);
    }
    return super.registerVideoEncodedFrameObserver(observer);
  }

  unregisterVideoEncodedFrameObserver(
    observer: IVideoEncodedFrameObserver
  ): number {
    MediaEngineInternal._video_encoded_frame_observers =
      MediaEngineInternal._video_encoded_frame_observers.filter(
        (value) => value !== observer
      );
    return super.unregisterVideoEncodedFrameObserver(observer);
  }

  release() {
    MediaEngineInternal._audio_frame_observers = [];
    MediaEngineInternal._video_frame_observers = [];
    MediaEngineInternal._video_encoded_frame_observers = [];
    this._events.forEach((value) => {
      DeviceEventEmitter.removeListener(value.eventType, value.listener);
    });
    this._events.clear();
    super.release();
  }

  addListener<EventType extends keyof IMediaEngineEvent>(
    eventType: EventType,
    listener: IMediaEngineEvent[EventType]
  ): void {
    const callback = (...data: any[]) => {
      if (data[0] !== EVENT_TYPE.IMediaEngine) {
        return;
      }
      processIAudioFrameObserver({ [eventType]: listener }, eventType, data[1]);
      processIVideoFrameObserver({ [eventType]: listener }, eventType, data[1]);
      processIVideoEncodedFrameObserver(
        { [eventType]: listener },
        eventType,
        data[1]
      );
    };
    this._events.set(listener, { eventType, listener: callback });
    DeviceEventEmitter.addListener(eventType, callback);
  }

  removeListener<EventType extends keyof IMediaEngineEvent>(
    eventType: EventType,
    listener: IMediaEngineEvent[EventType]
  ) {
    if (!this._events.has(listener)) return;
    DeviceEventEmitter.removeListener(
      eventType,
      this._events.get(listener)!.listener
    );
  }

  removeAllListeners<EventType extends keyof IMediaEngineEvent>(
    eventType?: EventType
  ) {
    DeviceEventEmitter.removeAllListeners(eventType);
  }

  pushVideoFrame(frame: ExternalVideoFrame, videoTrackId = 0): number {
    const apiType = 'MediaEngine_pushVideoFrame';
    const jsonParams = {
      frame,
      videoTrackId,
      toJSON: () => {
        return {
          frame,
          videoTrackId,
        };
      },
    };

    if (!frame.buffer == null) return ErrorCodeType.ErrInvalidArgument;

    let buffers = [frame.buffer, undefined, undefined];
    frame.buffer = undefined;
    const jsonResults = callIrisApi.call(
      this,
      apiType,
      jsonParams,
      buffers,
      buffers.length
    );
    return jsonResults.result;
  }

  pushEncodedVideoImage(
    imageBuffer: Uint8Array,
    length: number,
    videoEncodedFrameInfo: EncodedVideoFrameInfo,
    videoTrackId?: number
  ): number {
    const apiType = 'MediaEngine_pushEncodedVideoImage';
    const jsonParams = {
      length,
      videoEncodedFrameInfo,
      videoTrackId,
      toJSON: () => {
        return {
          length,
          videoEncodedFrameInfo,
          videoTrackId,
        };
      },
    };

    if (!imageBuffer) return ErrorCodeType.ErrInvalidArgument;

    let bufferArray = [imageBuffer];

    const jsonResults = callIrisApi.call(
      this,
      apiType,
      jsonParams,
      bufferArray,
      bufferArray.length
    );
    return jsonResults.result;
  }

  pushAudioFrame(
    type: MediaSourceType,
    frame: AudioFrame,
    wrap = false,
    sourceId = 0
  ): number {
    const apiType = 'MediaEngine_pushAudioFrame';
    const jsonParams = {
      type,
      frame,
      wrap,
      sourceId,
      toJSON: () => {
        return {
          type,
          frame,
          wrap,
          sourceId,
        };
      },
    };
    if (!frame.buffer) return ErrorCodeType.ErrInvalidArgument;

    let bufferArray = [frame.buffer];
    frame.buffer = undefined;

    const jsonResults = callIrisApi.call(
      this,
      apiType,
      jsonParams,
      bufferArray,
      bufferArray.length
    );
    return jsonResults.result;
  }
}
