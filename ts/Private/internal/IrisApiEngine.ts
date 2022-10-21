import { EventEmitter } from 'events';

import { AgoraElectronBridge, Result } from '../../Types';
import { AgoraEnv, logDebug, parseJSON } from '../../Utils';
import {
  AudioFrame,
  AudioPcmFrame,
  IAudioFrameObserver,
  IAudioSpectrumObserver,
  IMediaRecorderObserver,
  IVideoEncodedFrameObserver,
  IVideoFrameObserver,
  VideoFrame,
} from '../AgoraMediaBase';
import {
  IMediaPlayer,
  IMediaPlayerAudioFrameObserver,
  IMediaPlayerVideoFrameObserver,
} from '../IAgoraMediaPlayer';

import {
  IMusicContentCenterEventHandler
} from '../IAgoraMusicContentCenter';

import {
  IDirectCdnStreamingEventHandler,
  IMetadataObserver,
  IRtcEngineEventHandler,
  Metadata,
} from '../IAgoraRtcEngine';
import { processIAudioEncodedFrameObserver } from '../impl/AgoraBaseImpl';
import {
  processIAudioFrameObserver,
  processIAudioFrameObserverBase,
  processIAudioSpectrumObserver,
  processIMediaRecorderObserver,
  processIVideoEncodedFrameObserver,
  processIVideoFrameObserver,
} from '../impl/AgoraMediaBaseImpl';
import {
  processIMediaPlayerAudioFrameObserver,
  processIMediaPlayerVideoFrameObserver,
} from '../impl/IAgoraMediaPlayerImpl';
import { processIMediaPlayerSourceObserver } from '../impl/IAgoraMediaPlayerSourceImpl';
import {
  processIDirectCdnStreamingEventHandler,
  processIMetadataObserver,
  processIRtcEngineEventHandler,
} from '../impl/IAgoraRtcEngineImpl';
import { processIMusicContentCenterEventHandler } from '../impl/IAgoraMusicContentCenterImpl'
import { IAudioEncodedFrameObserver } from '../AgoraBase';
import { IMediaPlayerSourceObserver } from '../IAgoraMediaPlayerSource';
import { MediaPlayerInternal } from './MediaPlayerInternal';
import { MediaEngineInternal } from './MediaEngineInternal';
import { RtcEngineExInternal } from './RtcEngineExInternal';
import { MediaRecorderInternal } from './MediaRecorderInternal';
import {
  MusicContentCenterInternal,
  processIMusicContentCenterServer,
} from './MusicContentCenterInternal';

const agora = require('../../../build/Release/agora_node_ext');

export const DeviceEventEmitter = new EventEmitter();

export const getBridge = (): AgoraElectronBridge => {
  let bridge = AgoraEnv.AgoraElectronBridge;
  if (!bridge) {
    bridge = new agora.AgoraElectronBridge();
    bridge!.sendMsg = sendMsg;
    AgoraEnv.AgoraElectronBridge = bridge;
  }
  return bridge!;
};

const sendMsg = (
  funcName: string,
  params: any,
  buffer?: (Uint8Array | undefined)[],
  bufferCount = 0
): Result => {
  const irisReturnValue = getBridge().CallApi(
    funcName,
    JSON.stringify(params),
    buffer,
    bufferCount
  );
  logDebug(
    'sendMsg',
    'funcName',
    funcName,
    'params',
    params,
    'irisReturnValue',
    irisReturnValue
  );

  return parseJSON(irisReturnValue.callApiResult);
};

/**
 * @internal
 */
export type EventProcessor = {
  suffix: string;
  type: EVENT_TYPE;
  func: Function[];
  preprocess?: (event: string, data: any, buffers: Uint8Array[]) => void;
  handlers: (
    data: any
  ) =>
    | (
        | IAudioFrameObserver
        | IVideoFrameObserver
        | IAudioSpectrumObserver
        | IAudioEncodedFrameObserver
        | IVideoEncodedFrameObserver
        | IMediaPlayerSourceObserver
        | IMediaPlayerAudioFrameObserver
        | IMediaPlayerVideoFrameObserver
        | IMediaRecorderObserver
        | IMetadataObserver
        | IDirectCdnStreamingEventHandler
        | IRtcEngineEventHandler
        | IMusicContentCenterEventHandler
      )[];
};

export enum EVENT_TYPE {
  IMediaEngine,
  IMediaPlayer,
  IMediaRecorder,
  IRtcEngine,
  IMusicContentCenter
}

/**
 * @internal
 */
export const EVENT_PROCESSORS = {
  IAudioFrameObserver: {
    suffix: 'AudioFrameObserver_',
    type: EVENT_TYPE.IMediaEngine,
    func: [processIAudioFrameObserver, processIAudioFrameObserverBase],
    preprocess: (event: string, data: any, buffers: Uint8Array[]) => {
      if (data.audioFrame) {
        (data.audioFrame as AudioFrame).buffer = buffers[0];
      }
    },
    handlers: () => MediaEngineInternal._audio_frame_observers,
  },
  IVideoFrameObserver: {
    suffix: 'VideoFrameObserver_',
    type: EVENT_TYPE.IMediaEngine,
    func: [processIVideoFrameObserver],
    preprocess: (event: string, data: any, buffers: Uint8Array[]) => {
      if (data.videoFrame) {
        (data.videoFrame as VideoFrame).yBuffer = buffers[0];
        (data.videoFrame as VideoFrame).uBuffer = buffers[1];
        (data.videoFrame as VideoFrame).vBuffer = buffers[2];
        (data.videoFrame as VideoFrame).metadata_buffer = buffers[3];
        (data.videoFrame as VideoFrame).alphaBuffer = buffers[4];
      }
    },
    handlers: () => MediaEngineInternal._video_frame_observers,
  },
  IAudioSpectrumObserver: {
    suffix: 'AudioSpectrumObserver_',
    type: EVENT_TYPE.IRtcEngine,
    func: [processIAudioSpectrumObserver],
    preprocess: (event: string, data: any, buffers: Uint8Array[]) => {
      // if (data.data) {
      //   (data.data as AudioSpectrumData).audioSpectrumData = buffers[0];
      // }
    },
    handlers: (data: any) =>
      data.playerId === 0
        ? RtcEngineExInternal._audio_spectrum_observers
        : undefined,
  },
  IMediaPlayerAudioSpectrumObserver: {
    suffix: 'AudioSpectrumObserver_',
    type: EVENT_TYPE.IMediaPlayer,
    func: [processIAudioSpectrumObserver],
    preprocess: (event: string, data: any, buffers: Uint8Array[]) => {
      // if (data.data) {
      //   (data.data as AudioSpectrumData).audioSpectrumData = buffers[0];
      // }
    },
    handlers: (data: any) =>
      data.playerId !== 0
        ? MediaPlayerInternal._audio_spectrum_observers.get(data.playerId)
        : undefined,
  },
  IAudioEncodedFrameObserver: {
    suffix: 'AudioEncodedFrameObserver_',
    type: EVENT_TYPE.IRtcEngine,
    func: [processIAudioEncodedFrameObserver],
    preprocess: (event: string, data: any, buffers: Uint8Array[]) => {
      switch (event) {
        case 'OnRecordAudioEncodedFrame':
        case 'OnPlaybackAudioEncodedFrame':
        case 'OnMixedAudioEncodedFrame':
          (data.frameBuffer as Uint8Array) = buffers[0];
          break;
      }
    },
    handlers: () => RtcEngineExInternal._audio_encoded_frame_observers,
  },
  IVideoEncodedFrameObserver: {
    suffix: 'VideoEncodedFrameObserver_',
    type: EVENT_TYPE.IMediaEngine,
    func: [processIVideoEncodedFrameObserver],
    preprocess: (event: string, data: any, buffers: Uint8Array[]) => {
      switch (event) {
        case 'OnEncodedVideoFrameReceived':
          (data.imageBuffer as Uint8Array) = buffers[0];
          break;
      }
    },
    handlers: () => MediaEngineInternal._video_encoded_frame_observers,
  },
  IMediaPlayerSourceObserver: {
    suffix: 'MediaPlayerSourceObserver_',
    type: EVENT_TYPE.IMediaPlayer,
    func: [processIMediaPlayerSourceObserver],
    handlers: (data: any) =>
      MediaPlayerInternal._source_observers.get(data.playerId),
  },
  IMediaPlayerAudioFrameObserver: {
    suffix: 'MediaPlayer_AudioFrameObserver_',
    type: EVENT_TYPE.IMediaPlayer,
    func: [processIMediaPlayerAudioFrameObserver],
    preprocess: (event: string, data: any, buffers: Uint8Array[]) => {
      if (data.frame) {
        (data.frame as AudioPcmFrame).data_ = Array.from(buffers[0]);
      }
    },
    handlers: (data: any) =>
      MediaPlayerInternal._audio_frame_observers.get(data.playerId),
  },
  IMediaPlayerVideoFrameObserver: {
    suffix: 'MediaPlayer_VideoFrameObserver_',
    type: EVENT_TYPE.IMediaPlayer,
    func: [processIMediaPlayerVideoFrameObserver],
    preprocess: (event: string, data: any, buffers: Uint8Array[]) => {
      if (data.frame) {
        (data.frame as VideoFrame).yBuffer = buffers[0];
        (data.frame as VideoFrame).uBuffer = buffers[1];
        (data.frame as VideoFrame).vBuffer = buffers[2];
        (data.frame as VideoFrame).metadata_buffer = buffers[3];
        (data.frame as VideoFrame).alphaBuffer = buffers[4];
      }
    },
    handlers: (data: any) =>
      MediaPlayerInternal._video_frame_observers.get(data.playerId),
  },
  IMediaRecorderObserver: {
    suffix: 'MediaRecorderObserver_',
    type: EVENT_TYPE.IMediaRecorder,
    func: [processIMediaRecorderObserver],
    handlers: (data: any) => [
      MediaRecorderInternal._observers.get(
        (data.connection.channelId ?? '') + data.connection.localUid
      ),
    ],
  },
  IMetadataObserver: {
    suffix: 'MetadataObserver_',
    type: EVENT_TYPE.IRtcEngine,
    func: [processIMetadataObserver],
    preprocess: (event: string, data: any, buffers: Uint8Array[]) => {
      switch (event) {
        case 'onMetadataReceived':
          if (data.metadata) {
            (data.metadata as Metadata).buffer = buffers[0];
          }
          break;
      }
    },
    handlers: () => RtcEngineExInternal._handlers,
  },
  IDirectCdnStreamingEventHandler: {
    suffix: 'DirectCdnStreamingEventHandler_',
    type: EVENT_TYPE.IRtcEngine,
    func: [processIDirectCdnStreamingEventHandler],
    handlers: () => RtcEngineExInternal._handlers,
  },
  IRtcEngineEventHandler: {
    suffix: 'RtcEngineEventHandler_',
    type: EVENT_TYPE.IRtcEngine,
    func: [processIRtcEngineEventHandler],
    preprocess: (event: string, data: any, buffers: Uint8Array[]) => {
      switch (event) {
        case 'onStreamMessage':
        case 'onStreamMessageEx':
          data.data = buffers[0];
          break;
      }
    },
    handlers: () => RtcEngineExInternal._handlers,
  },
  IMusicContentCenterEventHandler: {
    suffix: 'MusicContentCenterEventHandler_',
    type: EVENT_TYPE.IRtcEngine,
    func: [processIMusicContentCenterServer],
    handlers: () => MusicContentCenterInternal._handlers,
  },
};

/**
 * @internal
 */
export function handleEvent(
  event: string,
  data: string,
  buffer: Uint8Array[],
  bufferLength: number[],
  bufferCount: number
) {
  logDebug(
    'event',
    event,
    'data',
    data,
    'buffer',
    buffer,
    'bufferLength',
    bufferLength,
    'bufferCount',
    bufferCount
  );

  let _data: any;
  try {
    _data = JSON.parse(data) ?? {};
  } catch (e) {
    _data = {};
  }

  let _event: string = event;
  let processor: EventProcessor = EVENT_PROCESSORS.IRtcEngineEventHandler;

  Object.values(EVENT_PROCESSORS).some((it) => {
    // @ts-ignore
    const p = it as EventProcessor;
    if (
      _event.startsWith(p.suffix) &&
      processor.handlers(_data) !== undefined
    ) {
      processor = p;
      const reg = new RegExp(`^${processor.suffix}`, 'g');
      _event = _event.replace(reg, '');
      return true;
    }
    return false;
  });

  if (_event.endsWith('Ex')) {
    _event = _event.replace(/Ex$/g, '');
  }

  const buffers: Uint8Array[] = buffer;
  if (processor.preprocess) processor.preprocess!(_event, _data, buffers);

  processor.handlers(_data)?.map((value) => {
    if (value) {
      processor.func.map((it) => {
        it(value, _event, _data);
      });
    }
  });

  emitEvent(_event, processor.type, _data);
}

/**
 * @internal
 */
export function callIrisApi(
  funcName: string,
  params: any,
  buffer?: (Uint8Array | undefined)[],
  bufferCount: number = 0
): any {
  const isMediaPlayer = funcName.startsWith('MediaPlayer_');
  if (isMediaPlayer) {
    // @ts-ignore
    params.mediaPlayerId = (this as IMediaPlayer).getMediaPlayerId();
    const json = params.toJSON?.call();
    params.toJSON = function () {
      return { ...json, playerId: params.mediaPlayerId };
    };
  } else if (funcName === 'RtcEngine_destroyMediaPlayer') {
    // @ts-ignore
    params.mediaPlayerId = params.media_player.getMediaPlayerId();
    params.toJSON = function () {
      return { playerId: params.mediaPlayerId };
    };
  }
  return sendMsg(funcName, params, buffer, bufferCount);
}

/**
 * @internal
 */
export function emitEvent(eventType: string, ...params: any[]): void {
  DeviceEventEmitter.emit(eventType, ...params);
}
