import { callIrisApi } from '../internal/IrisApiEngine'
import { IMediaStreamingSource, StreamingSrcState, InputSeiData, IMediaStreamingSourceObserver } from '../IAgoraMediaStreamingSource'
import { PlayerStreamInfo } from '../AgoraMediaPlayerTypes'

export class IMediaStreamingSourceImpl implements IMediaStreamingSource {
  open (url: string, startPos: number, autoPlay = true): number {
    const apiType = 'MediaStreamingSource_open'
    const jsonParams = {
      url,
      start_pos: startPos,
      auto_play: autoPlay,
      toJSON: () => {
        return {
          url,
          start_pos: startPos,
          auto_play: autoPlay
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  close (): number {
    const apiType = 'MediaStreamingSource_close'
    const jsonParams = {
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  getSourceId (): number {
    const apiType = 'MediaStreamingSource_getSourceId'
    const jsonParams = {
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  isVideoValid (): boolean {
    const apiType = 'MediaStreamingSource_isVideoValid'
    const jsonParams = {
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  isAudioValid (): boolean {
    const apiType = 'MediaStreamingSource_isAudioValid'
    const jsonParams = {
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  getDuration (): number {
    const apiType = 'MediaStreamingSource_getDuration'
    const jsonParams = {
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    const duration = jsonResults.duration
    return duration
  }

  getStreamCount (): number {
    const apiType = 'MediaStreamingSource_getStreamCount'
    const jsonParams = {
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    const count = jsonResults.count
    return count
  }

  getStreamInfo (index: number): PlayerStreamInfo {
    const apiType = 'MediaStreamingSource_getStreamInfo'
    const jsonParams = {
      index,
      toJSON: () => {
        return { index }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    const outInfo = jsonResults.out_info
    return outInfo
  }

  setLoopCount (loopCount: number): number {
    const apiType = 'MediaStreamingSource_setLoopCount'
    const jsonParams = {
      loop_count: loopCount,
      toJSON: () => {
        return { loop_count: loopCount }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  play (): number {
    const apiType = 'MediaStreamingSource_play'
    const jsonParams = {
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  pause (): number {
    const apiType = 'MediaStreamingSource_pause'
    const jsonParams = {
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  stop (): number {
    const apiType = 'MediaStreamingSource_stop'
    const jsonParams = {
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  seek (newPos: number): number {
    const apiType = 'MediaStreamingSource_seek'
    const jsonParams = {
      new_pos: newPos,
      toJSON: () => {
        return { new_pos: newPos }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  getCurrPosition (): number {
    const apiType = 'MediaStreamingSource_getCurrPosition'
    const jsonParams = {
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    const pos = jsonResults.pos
    return pos
  }

  getCurrState (): StreamingSrcState {
    const apiType = 'MediaStreamingSource_getCurrState'
    const jsonParams = {
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  appendSeiData (inSeiData: InputSeiData): number {
    const apiType = 'MediaStreamingSource_appendSeiData'
    const jsonParams = {
      inSeiData,
      toJSON: () => {
        return { inSeiData }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  registerObserver (observer: IMediaStreamingSourceObserver): number {
    const apiType = 'MediaStreamingSource_registerObserver'
    const jsonParams = {
      observer,
      toJSON: () => {
        return {
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  unregisterObserver (observer: IMediaStreamingSourceObserver): number {
    const apiType = 'MediaStreamingSource_unregisterObserver'
    const jsonParams = {
      observer,
      toJSON: () => {
        return {
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  parseMediaInfo (url: string, videoInfo: PlayerStreamInfo, audioInfo: PlayerStreamInfo): number {
    const apiType = 'MediaStreamingSource_parseMediaInfo'
    const jsonParams = {
      url,
      video_info: videoInfo,
      audio_info: audioInfo,
      toJSON: () => {
        return {
          url,
          video_info: videoInfo,
          audio_info: audioInfo
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }
}

export function processIMediaStreamingSourceObserver (handler: IMediaStreamingSourceObserver, event: string, jsonParams: any) {
  switch (event) {
    case 'onStateChanged':
      if (handler.onStateChanged !== undefined) {
        handler.onStateChanged(jsonParams.state, jsonParams.err_code)
      }
      break

    case 'onOpenDone':
      if (handler.onOpenDone !== undefined) {
        handler.onOpenDone(jsonParams.err_code)
      }
      break

    case 'onSeekDone':
      if (handler.onSeekDone !== undefined) {
        handler.onSeekDone(jsonParams.err_code)
      }
      break

    case 'onEofOnce':
      if (handler.onEofOnce !== undefined) {
        handler.onEofOnce(jsonParams.progress_ms, jsonParams.repeat_count)
      }
      break

    case 'onProgress':
      if (handler.onProgress !== undefined) {
        handler.onProgress(jsonParams.position_ms)
      }
      break

    case 'onMetaData':
      if (handler.onMetaData !== undefined) {
        handler.onMetaData(jsonParams.data, jsonParams.length)
      }
      break
  }
}
