import { PlayerStreamInfo } from './AgoraMediaPlayerTypes'

export enum StreamingSrcErr {
StreamingSrcErrNone = 0,
StreamingSrcErrUnknown = 1,
StreamingSrcErrInvalidParam = 2,
StreamingSrcErrBadState = 3,
StreamingSrcErrNoMem = 4,
StreamingSrcErrBufferOverflow = 5,
StreamingSrcErrBufferUnderflow = 6,
StreamingSrcErrNotFound = 7,
StreamingSrcErrTimeout = 8,
StreamingSrcErrExpired = 9,
StreamingSrcErrUnsupported = 10,
StreamingSrcErrNotExist = 11,
StreamingSrcErrExist = 12,
StreamingSrcErrOpen = 13,
StreamingSrcErrClose = 14,
StreamingSrcErrRead = 15,
StreamingSrcErrWrite = 16,
StreamingSrcErrSeek = 17,
StreamingSrcErrEof = 18,
StreamingSrcErrCodecopen = 19,
StreamingSrcErrCodecclose = 20,
StreamingSrcErrCodecproc = 21,
}

export enum StreamingSrcState {
StreamingSrcStateClosed = 0,
StreamingSrcStateOpening = 1,
StreamingSrcStateIdle = 2,
StreamingSrcStatePlaying = 3,
StreamingSrcStateSeeking = 4,
StreamingSrcStateEof = 5,
StreamingSrcStateError = 6,
}

export class InputSeiData {
  type?: number
  timestamp?: number
  frameIndex?: number
  privateData?: number[]
  dataSize?: number
  static fromJSON (json: any): InputSeiData {
    const obj = new InputSeiData()
    obj.type = json.type
    obj.timestamp = json.timestamp
    obj.frameIndex = json.frame_index
    obj.privateData = json.private_data
    obj.dataSize = json.data_size
    return obj
  }

  toJSON? () {
    return {
      type: this.type,
      timestamp: this.timestamp,
      frame_index: this.frameIndex,
      data_size: this.dataSize
    }
  }
}

export abstract class IMediaStreamingSource {
abstract open(url: string, startPos: number, autoPlay?: boolean): number;

abstract close(): number;

abstract getSourceId(): number;

abstract isVideoValid(): boolean;

abstract isAudioValid(): boolean;

abstract getDuration(): number;

abstract getStreamCount(): number;

abstract getStreamInfo(index: number): PlayerStreamInfo;

abstract setLoopCount(loopCount: number): number;

abstract play(): number;

abstract pause(): number;

abstract stop(): number;

abstract seek(newPos: number): number;

abstract getCurrPosition(): number;

abstract getCurrState(): StreamingSrcState;

abstract appendSeiData(inSeiData: InputSeiData): number;

abstract registerObserver(observer: IMediaStreamingSourceObserver): number;

abstract unregisterObserver(observer: IMediaStreamingSourceObserver): number;

abstract parseMediaInfo(url: string, videoInfo: PlayerStreamInfo, audioInfo: PlayerStreamInfo): number;
}

export abstract class IMediaStreamingSourceObserver {
  onStateChanged?(state: StreamingSrcState, errCode: StreamingSrcErr): void;

  onOpenDone?(errCode: StreamingSrcErr): void;

  onSeekDone?(errCode: StreamingSrcErr): void;

  onEofOnce?(progressMs: number, repeatCount: number): void;

  onProgress?(positionMs: number): void;

  onMetaData?(data: number[], length: number): void;
}
