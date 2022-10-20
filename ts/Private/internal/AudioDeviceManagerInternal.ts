import { AudioDeviceInfo } from '../IAgoraRtcEngine';
import { callIrisApi } from './IrisApiEngine';
import { IAudioDeviceManagerImpl } from '../impl/IAudioDeviceManagerImpl';

export class AudioDeviceManagerInternal extends IAudioDeviceManagerImpl {
  getPlaybackDeviceInfo(): AudioDeviceInfo {
    const apiType = this.getApiTypeFromGetPlaybackDeviceInfo();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return {
      deviceId: jsonResults.deviceId,
      deviceName: jsonResults.deviceName,
    };
  }

  getRecordingDeviceInfo(): AudioDeviceInfo {
    const apiType = this.getApiTypeFromGetRecordingDeviceInfo();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return {
      deviceId: jsonResults.deviceId,
      deviceName: jsonResults.deviceName,
    };
  }
}
