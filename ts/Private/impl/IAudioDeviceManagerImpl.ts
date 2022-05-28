import IrisApiEngine from '../internal/IrisApiEngine'
import { IAudioDeviceCollection, IAudioDeviceManager } from '../IAudioDeviceManager'

export class IAudioDeviceCollectionImpl implements IAudioDeviceCollection {
  getCount (): number {
    const apiType = 'AudioDeviceCollection_getCount'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  getDevice (index: number): { deviceName: string, deviceId: string } {
    const apiType = 'AudioDeviceCollection_getDevice'
    const jsonParams = {
      index,
      toJSON: () => {
        return { index }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const deviceName = jsonResults.deviceName
    const deviceId = jsonResults.deviceId
    return {
      deviceName,
      deviceId
    }
  }

  setDevice (deviceId: string): number {
    const apiType = 'AudioDeviceCollection_setDevice'
    const jsonParams = {
      deviceId,
      toJSON: () => {
        return { deviceId }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  setApplicationVolume (volume: number): number {
    const apiType = 'AudioDeviceCollection_setApplicationVolume'
    const jsonParams = {
      volume,
      toJSON: () => {
        return { volume }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  getApplicationVolume (): number {
    const apiType = 'AudioDeviceCollection_getApplicationVolume'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const volume = jsonResults.volume
    return volume
  }

  setApplicationMute (mute: boolean): number {
    const apiType = 'AudioDeviceCollection_setApplicationMute'
    const jsonParams = {
      mute,
      toJSON: () => {
        return { mute }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  isApplicationMute (): boolean {
    const apiType = 'AudioDeviceCollection_isApplicationMute'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const mute = jsonResults.mute
    return mute
  }

  release (): void {
    const apiType = 'AudioDeviceCollection_release'
    const jsonParams = {
    }
    IrisApiEngine.callApi(apiType, jsonParams)
  }
}

export class IAudioDeviceManagerImpl implements IAudioDeviceManager {
  enumeratePlaybackDevices (): IAudioDeviceCollection {
    const apiType = 'AudioDeviceManager_enumeratePlaybackDevices'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  enumerateRecordingDevices (): IAudioDeviceCollection {
    const apiType = 'AudioDeviceManager_enumerateRecordingDevices'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  setPlaybackDevice (deviceId: string): number {
    const apiType = 'AudioDeviceManager_setPlaybackDevice'
    const jsonParams = {
      deviceId,
      toJSON: () => {
        return { deviceId }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  getPlaybackDevice (): string {
    const apiType = 'AudioDeviceManager_getPlaybackDevice'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const deviceId = jsonResults.deviceId
    return deviceId
  }

  getPlaybackDeviceInfo (): { deviceId: string, deviceName: string } {
    const apiType = 'AudioDeviceManager_getPlaybackDeviceInfo'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const deviceId = jsonResults.deviceId
    const deviceName = jsonResults.deviceName
    return {
      deviceId,
      deviceName
    }
  }

  setPlaybackDeviceVolume (volume: number): number {
    const apiType = 'AudioDeviceManager_setPlaybackDeviceVolume'
    const jsonParams = {
      volume,
      toJSON: () => {
        return { volume }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  getPlaybackDeviceVolume (): number {
    const apiType = 'AudioDeviceManager_getPlaybackDeviceVolume'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const volume = jsonResults.volume
    return volume
  }

  setRecordingDevice (deviceId: string): number {
    const apiType = 'AudioDeviceManager_setRecordingDevice'
    const jsonParams = {
      deviceId,
      toJSON: () => {
        return { deviceId }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  getRecordingDevice (): string {
    const apiType = 'AudioDeviceManager_getRecordingDevice'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const deviceId = jsonResults.deviceId
    return deviceId
  }

  getRecordingDeviceInfo (): { deviceId: string, deviceName: string } {
    const apiType = 'AudioDeviceManager_getRecordingDeviceInfo'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const deviceId = jsonResults.deviceId
    const deviceName = jsonResults.deviceName
    return {
      deviceId,
      deviceName
    }
  }

  setRecordingDeviceVolume (volume: number): number {
    const apiType = 'AudioDeviceManager_setRecordingDeviceVolume'
    const jsonParams = {
      volume,
      toJSON: () => {
        return { volume }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  getRecordingDeviceVolume (): number {
    const apiType = 'AudioDeviceManager_getRecordingDeviceVolume'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const volume = jsonResults.volume
    return volume
  }

  setPlaybackDeviceMute (mute: boolean): number {
    const apiType = 'AudioDeviceManager_setPlaybackDeviceMute'
    const jsonParams = {
      mute,
      toJSON: () => {
        return { mute }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  getPlaybackDeviceMute (): boolean {
    const apiType = 'AudioDeviceManager_getPlaybackDeviceMute'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const mute = jsonResults.mute
    return mute
  }

  setRecordingDeviceMute (mute: boolean): number {
    const apiType = 'AudioDeviceManager_setRecordingDeviceMute'
    const jsonParams = {
      mute,
      toJSON: () => {
        return { mute }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  getRecordingDeviceMute (): boolean {
    const apiType = 'AudioDeviceManager_getRecordingDeviceMute'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const mute = jsonResults.mute
    return mute
  }

  startPlaybackDeviceTest (testAudioFilePath: string): number {
    const apiType = 'AudioDeviceManager_startPlaybackDeviceTest'
    const jsonParams = {
      testAudioFilePath,
      toJSON: () => {
        return { testAudioFilePath }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  stopPlaybackDeviceTest (): number {
    const apiType = 'AudioDeviceManager_stopPlaybackDeviceTest'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  startRecordingDeviceTest (indicationInterval: number): number {
    const apiType = 'AudioDeviceManager_startRecordingDeviceTest'
    const jsonParams = {
      indicationInterval,
      toJSON: () => {
        return { indicationInterval }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  stopRecordingDeviceTest (): number {
    const apiType = 'AudioDeviceManager_stopRecordingDeviceTest'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  startAudioDeviceLoopbackTest (indicationInterval: number): number {
    const apiType = 'AudioDeviceManager_startAudioDeviceLoopbackTest'
    const jsonParams = {
      indicationInterval,
      toJSON: () => {
        return { indicationInterval }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  stopAudioDeviceLoopbackTest (): number {
    const apiType = 'AudioDeviceManager_stopAudioDeviceLoopbackTest'
    const jsonParams = {
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  release (): void {
    const apiType = 'AudioDeviceManager_release'
    const jsonParams = {
    }
    IrisApiEngine.callApi(apiType, jsonParams)
  }
}
