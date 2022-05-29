import { callIrisApi } from '../internal/IrisApiEngine'
import { IRhythmPlayer, AgoraRhythmPlayerConfig } from '../IAgoraRhythmPlayer'

export class IRhythmPlayerImpl implements IRhythmPlayer {
  playRhythm (sound1: string, sound2: string, config: AgoraRhythmPlayerConfig): number {
    const apiType = 'RhythmPlayer_playRhythm'
    const jsonParams = {
      sound1,
      sound2,
      config,
      toJSON: () => {
        return {
          sound1,
          sound2,
          config
        }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  stopRhythm (): number {
    const apiType = 'RhythmPlayer_stopRhythm'
    const jsonParams = {
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }

  configRhythmPlayer (config: AgoraRhythmPlayerConfig): number {
    const apiType = 'RhythmPlayer_configRhythmPlayer'
    const jsonParams = {
      config,
      toJSON: () => {
        return { config }
      }
    }
    const jsonResults = callIrisApi.call(this, apiType, jsonParams)
    return jsonResults.result
  }
}
