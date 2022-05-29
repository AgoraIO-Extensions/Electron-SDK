import { callIrisApi } from '../internal/IrisApiEngine'
import { IMediaEngine } from '../IAgoraMediaEngine'
import { IAudioFrameObserver, IVideoFrameObserver, MediaSourceType, AudioFrame, ExternalVideoSourceType, ExternalVideoFrame } from '../AgoraMediaBase'
import { IVideoEncodedImageReceiver, EncodedVideoFrameInfo } from '../AgoraBase'
import { RtcConnection } from '../IAgoraRtcEngineEx'
export class IMediaEngineImpl implements IMediaEngine {
  registerAudioFrameObserver (observer: IAudioFrameObserver): number {
    const apiType = 'MediaEngine_registerAudioFrameObserver'
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

  registerVideoFrameObserver (observer: IVideoFrameObserver): number {
    const apiType = 'MediaEngine_registerVideoFrameObserver'
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

  registerVideoEncodedImageReceiver (receiver: IVideoEncodedImageReceiver): number {
    const apiType = 'MediaEngine_registerVideoEncodedImageReceiver'
    const jsonParams = {
      receiver,
      toJSON: () => {
        return {
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  pushAudioFrame (type: MediaSourceType, frame: AudioFrame, wrap = false, sourceId = 0): number {
    const apiType = 'MediaEngine_pushAudioFrame'
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
          sourceId
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  pushCaptureAudioFrame (frame: AudioFrame): number {
    const apiType = 'MediaEngine_pushCaptureAudioFrame'
    const jsonParams = {
      frame,
      toJSON: () => {
        return { frame }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  pushReverseAudioFrame (frame: AudioFrame): number {
    const apiType = 'MediaEngine_pushReverseAudioFrame'
    const jsonParams = {
      frame,
      toJSON: () => {
        return { frame }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  pushDirectAudioFrame (frame: AudioFrame): number {
    const apiType = 'MediaEngine_pushDirectAudioFrame'
    const jsonParams = {
      frame,
      toJSON: () => {
        return { frame }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  pullAudioFrame (): AudioFrame {
    const apiType = 'MediaEngine_pullAudioFrame'
    const jsonParams = {
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    const frame = jsonResults.frame
    return frame
  }

  setExternalVideoSource (enabled: boolean, useTexture: boolean, sourceType: ExternalVideoSourceType = ExternalVideoSourceType.VideoFrame): number {
    const apiType = 'MediaEngine_setExternalVideoSource'
    const jsonParams = {
      enabled,
      useTexture,
      sourceType,
      toJSON: () => {
        return {
          enabled,
          useTexture,
          sourceType
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  setExternalAudioSource (enabled: boolean, sampleRate: number, channels: number, sourceNumber = 1, localPlayback = false, publish = true): number {
    const apiType = 'MediaEngine_setExternalAudioSource'
    const jsonParams = {
      enabled,
      sampleRate,
      channels,
      sourceNumber,
      localPlayback,
      publish,
      toJSON: () => {
        return {
          enabled,
          sampleRate,
          channels,
          sourceNumber,
          localPlayback,
          publish
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  setExternalAudioSink (sampleRate: number, channels: number): number {
    const apiType = 'MediaEngine_setExternalAudioSink'
    const jsonParams = {
      sampleRate,
      channels,
      toJSON: () => {
        return {
          sampleRate,
          channels
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  enableCustomAudioLocalPlayback (sourceId: number, enabled: boolean): number {
    const apiType = 'MediaEngine_enableCustomAudioLocalPlayback'
    const jsonParams = {
      sourceId,
      enabled,
      toJSON: () => {
        return {
          sourceId,
          enabled
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  setDirectExternalAudioSource (enable: boolean, localPlayback = false): number {
    const apiType = 'MediaEngine_setDirectExternalAudioSource'
    const jsonParams = {
      enable,
      localPlayback,
      toJSON: () => {
        return {
          enable,
          localPlayback
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  pushVideoFrame (frame: ExternalVideoFrame): number {
    const apiType = 'MediaEngine_pushVideoFrame'
    const jsonParams = {
      frame,
      toJSON: () => {
        return { frame }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  pushVideoFrame2 (frame: ExternalVideoFrame, connection: RtcConnection): number {
    const apiType = 'MediaEngine_pushVideoFrame2'
    const jsonParams = {
      frame,
      connection,
      toJSON: () => {
        return {
          frame,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  pushEncodedVideoImage (imageBuffer: number[], length: number, videoEncodedFrameInfo: EncodedVideoFrameInfo): number {
    const apiType = 'MediaEngine_pushEncodedVideoImage'
    const jsonParams = {
      imageBuffer,
      length,
      videoEncodedFrameInfo,
      toJSON: () => {
        return {
          length,
          videoEncodedFrameInfo
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  pushEncodedVideoImage2 (imageBuffer: number[], length: number, videoEncodedFrameInfo: EncodedVideoFrameInfo, connection: RtcConnection): number {
    const apiType = 'MediaEngine_pushEncodedVideoImage2'
    const jsonParams = {
      imageBuffer,
      length,
      videoEncodedFrameInfo,
      connection,
      toJSON: () => {
        return {
          length,
          videoEncodedFrameInfo,
          connection
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  release (): void {
    const apiType = 'MediaEngine_release'
    const jsonParams = {
    }
    callIrisApi.call(this, apiType, jsonParams)
  }
}
