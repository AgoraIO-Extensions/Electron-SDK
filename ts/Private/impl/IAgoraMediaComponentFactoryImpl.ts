import IrisApiEngine from '../internal/IrisApiEngine'
import { IMediaComponentFactory } from '../IAgoraMediaComponentFactory'
import { MediaPlayerSourceType } from '../AgoraMediaBase'
import { IMediaPlayer } from '../IAgoraMediaPlayer'
export class IMediaComponentFactoryImpl implements IMediaComponentFactory {
  createMediaPlayer (type: MediaPlayerSourceType = MediaPlayerSourceType.MediaPlayerSourceDefault): IMediaPlayer {
    const apiType = 'MediaComponentFactory_createMediaPlayer'
    const jsonParams = {
      type,
      toJSON: () => {
        return { type }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }
}
