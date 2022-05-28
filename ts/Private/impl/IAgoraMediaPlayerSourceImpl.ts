import IrisApiEngine from '../internal/IrisApiEngine'
import { IMediaPlayerCustomDataProvider, IMediaPlayerSource, IMediaPlayerSourceObserver } from '../IAgoraMediaPlayerSource'
import { PlayerStreamInfo, MediaPlayerState } from '../AgoraMediaPlayerTypes'
import { IAudioFrameObserver } from '../AgoraMediaBase'
export class IMediaPlayerCustomDataProviderImpl implements IMediaPlayerCustomDataProvider {
  onReadData (buf: number[], bufSize: number): number {
    const apiType = 'MediaPlayerCustomDataProvider_onReadData'
    const jsonParams = {
      buf,
      buf_size: bufSize,
      toJSON: () => {
        return {
          buf,
          buf_size: bufSize
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  onSeek (offset: number, whence: number): number {
    const apiType = 'MediaPlayerCustomDataProvider_onSeek'
    const jsonParams = {
      offset,
      whence,
      toJSON: () => {
        return {
          offset,
          whence
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }
}

export class IMediaPlayerSourceImpl implements IMediaPlayerSource {
  getSourceId (): number {
    const apiType = 'MediaPlayerSource_getSourceId'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  open (url: string, startPos: number): number {
    const apiType = 'MediaPlayerSource_open'
    const jsonParams = {
      url,
      startPos,
      toJSON: () => {
        return {
          url,
          startPos
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  openWithCustomSource (startPos: number, provider: IMediaPlayerCustomDataProvider): number {
    const apiType = 'MediaPlayerSource_openWithCustomSource'
    const jsonParams = {
      startPos,
      provider,
      toJSON: () => {
        return { startPos }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  play (): number {
    const apiType = 'MediaPlayerSource_play'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  pause (): number {
    const apiType = 'MediaPlayerSource_pause'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  stop (): number {
    const apiType = 'MediaPlayerSource_stop'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  resume (): number {
    const apiType = 'MediaPlayerSource_resume'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  seek (newPos: number): number {
    const apiType = 'MediaPlayerSource_seek'
    const jsonParams = {
      newPos,
      toJSON: () => {
        return { newPos }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  getDuration (): number {
    const apiType = 'MediaPlayerSource_getDuration'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const duration = jsonResults.duration
    return duration
  }

  getPlayPosition (): number {
    const apiType = 'MediaPlayerSource_getPlayPosition'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const pos = jsonResults.pos
    return pos
  }

  getStreamCount (): number {
    const apiType = 'MediaPlayerSource_getStreamCount'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const count = jsonResults.count
    return count
  }

  getStreamInfo (index: number): PlayerStreamInfo {
    const apiType = 'MediaPlayerSource_getStreamInfo'
    const jsonParams = {
      index,
      toJSON: () => {
        return { index }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const info = jsonResults.info
    return info
  }

  setLoopCount (loopCount: number): number {
    const apiType = 'MediaPlayerSource_setLoopCount'
    const jsonParams = {
      loopCount,
      toJSON: () => {
        return { loopCount }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  muteAudio (audioMute: boolean): number {
    const apiType = 'MediaPlayerSource_muteAudio'
    const jsonParams = {
      audio_mute: audioMute,
      toJSON: () => {
        return { audio_mute: audioMute }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  isAudioMuted (): boolean {
    const apiType = 'MediaPlayerSource_isAudioMuted'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  muteVideo (audioMute: boolean): number {
    const apiType = 'MediaPlayerSource_muteVideo'
    const jsonParams = {
      audio_mute: audioMute,
      toJSON: () => {
        return { audio_mute: audioMute }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  isVideoMuted (): boolean {
    const apiType = 'MediaPlayerSource_isVideoMuted'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  setPlaybackSpeed (speed: number): number {
    const apiType = 'MediaPlayerSource_setPlaybackSpeed'
    const jsonParams = {
      speed,
      toJSON: () => {
        return { speed }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  selectAudioTrack (index: number): number {
    const apiType = 'MediaPlayerSource_selectAudioTrack'
    const jsonParams = {
      index,
      toJSON: () => {
        return { index }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  setPlayerOption (key: string, value: number): number {
    const apiType = 'MediaPlayerSource_setPlayerOption'
    const jsonParams = {
      key,
      value,
      toJSON: () => {
        return {
          key,
          value
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  setPlayerOption2 (key: string, value: string): number {
    const apiType = 'MediaPlayerSource_setPlayerOption2'
    const jsonParams = {
      key,
      value,
      toJSON: () => {
        return {
          key,
          value
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  takeScreenshot (filename: string): number {
    const apiType = 'MediaPlayerSource_takeScreenshot'
    const jsonParams = {
      filename,
      toJSON: () => {
        return { filename }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  selectInternalSubtitle (index: number): number {
    const apiType = 'MediaPlayerSource_selectInternalSubtitle'
    const jsonParams = {
      index,
      toJSON: () => {
        return { index }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  setExternalSubtitle (url: string): number {
    const apiType = 'MediaPlayerSource_setExternalSubtitle'
    const jsonParams = {
      url,
      toJSON: () => {
        return { url }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  getState (): MediaPlayerState {
    const apiType = 'MediaPlayerSource_getState'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  registerPlayerSourceObserver (observer: IMediaPlayerSourceObserver): number {
    const apiType = 'MediaPlayerSource_registerPlayerSourceObserver'
    const jsonParams = {
      observer,
      toJSON: () => {
        return {
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  unregisterPlayerSourceObserver (observer: IMediaPlayerSourceObserver): number {
    const apiType = 'MediaPlayerSource_unregisterPlayerSourceObserver'
    const jsonParams = {
      observer,
      toJSON: () => {
        return {
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  registerAudioFrameObserver (observer: IAudioFrameObserver): number {
    const apiType = 'MediaPlayerSource_registerAudioFrameObserver'
    const jsonParams = {
      observer,
      toJSON: () => {
        return {
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  unregisterAudioFrameObserver (observer: IAudioFrameObserver): number {
    const apiType = 'MediaPlayerSource_unregisterAudioFrameObserver'
    const jsonParams = {
      observer,
      toJSON: () => {
        return {
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  openWithAgoraCDNSrc (src: string, startPos: number): number {
    const apiType = 'MediaPlayerSource_openWithAgoraCDNSrc'
    const jsonParams = {
      src,
      startPos,
      toJSON: () => {
        return {
          src,
          startPos
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  getAgoraCDNLineCount (): number {
    const apiType = 'MediaPlayerSource_getAgoraCDNLineCount'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  switchAgoraCDNLineByIndex (index: number): number {
    const apiType = 'MediaPlayerSource_switchAgoraCDNLineByIndex'
    const jsonParams = {
      index,
      toJSON: () => {
        return { index }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  getCurrentAgoraCDNIndex (): number {
    const apiType = 'MediaPlayerSource_getCurrentAgoraCDNIndex'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  enableAutoSwitchAgoraCDN (enable: boolean): number {
    const apiType = 'MediaPlayerSource_enableAutoSwitchAgoraCDN'
    const jsonParams = {
      enable,
      toJSON: () => {
        return { enable }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  renewAgoraCDNSrcToken (token: string, ts: number): number {
    const apiType = 'MediaPlayerSource_renewAgoraCDNSrcToken'
    const jsonParams = {
      token,
      ts,
      toJSON: () => {
        return {
          token,
          ts
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  switchAgoraCDNSrc (src: string, syncPts = false): number {
    const apiType = 'MediaPlayerSource_switchAgoraCDNSrc'
    const jsonParams = {
      src,
      syncPts,
      toJSON: () => {
        return {
          src,
          syncPts
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  switchSrc (src: string, syncPts: boolean): number {
    const apiType = 'MediaPlayerSource_switchSrc'
    const jsonParams = {
      src,
      syncPts,
      toJSON: () => {
        return {
          src,
          syncPts
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  preloadSrc (src: string, startPos: number): number {
    const apiType = 'MediaPlayerSource_preloadSrc'
    const jsonParams = {
      src,
      startPos,
      toJSON: () => {
        return {
          src,
          startPos
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  unloadSrc (src: string): number {
    const apiType = 'MediaPlayerSource_unloadSrc'
    const jsonParams = {
      src,
      toJSON: () => {
        return { src }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  playPreloadedSrc (src: string): number {
    const apiType = 'MediaPlayerSource_playPreloadedSrc'
    const jsonParams = {
      src,
      toJSON: () => {
        return { src }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }
}

export function processIMediaPlayerSourceObserver (handler: IMediaPlayerSourceObserver, event: string, jsonParams: any) {
  switch (event) {
    case 'onPlayerSourceStateChanged':
      if (handler.onPlayerSourceStateChanged !== undefined) {
        handler.onPlayerSourceStateChanged(jsonParams.state, jsonParams.ec)
      }
      break

    case 'onPositionChanged':
      if (handler.onPositionChanged !== undefined) {
        handler.onPositionChanged(jsonParams.position)
      }
      break

    case 'onPlayerEvent':
      if (handler.onPlayerEvent !== undefined) {
        handler.onPlayerEvent(jsonParams.eventCode, jsonParams.elapsedTime, jsonParams.message)
      }
      break

    case 'onMetaData':
      if (handler.onMetaData !== undefined) {
        handler.onMetaData(jsonParams.data, jsonParams.length)
      }
      break

    case 'onPlayBufferUpdated':
      if (handler.onPlayBufferUpdated !== undefined) {
        handler.onPlayBufferUpdated(jsonParams.playCachedBuffer)
      }
      break

    case 'onPreloadEvent':
      if (handler.onPreloadEvent !== undefined) {
        handler.onPreloadEvent(jsonParams.src, jsonParams.event)
      }
      break

    case 'onCompleted':
      if (handler.onCompleted !== undefined) {
        handler.onCompleted()
      }
      break

    case 'onAgoraCDNTokenWillExpire':
      if (handler.onAgoraCDNTokenWillExpire !== undefined) {
        handler.onAgoraCDNTokenWillExpire()
      }
      break

    case 'onPlayerSrcInfoChanged':
      if (handler.onPlayerSrcInfoChanged !== undefined) {
        handler.onPlayerSrcInfoChanged(jsonParams.from, jsonParams.to)
      }
      break

    case 'onPlayerInfoUpdated':
      if (handler.onPlayerInfoUpdated !== undefined) {
        handler.onPlayerInfoUpdated(jsonParams.info)
      }
      break

    case 'onAudioVolumeIndication':
      if (handler.onAudioVolumeIndication !== undefined) {
        handler.onAudioVolumeIndication(jsonParams.volume)
      }
      break
  }
}
