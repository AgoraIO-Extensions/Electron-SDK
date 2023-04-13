import { AudioDeviceInfo } from '../IAgoraRtcEngine';
import { IAudioDeviceManagerImpl } from '../impl/IAudioDeviceManagerImpl';

import { callIrisApi } from './IrisApiEngine';

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

  getPlaybackDefaultDevice(): AudioDeviceInfo {
    const apiType = this.getApiTypeFromGetPlaybackDefaultDevice();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return {
      deviceId: jsonResults.deviceId,
      deviceName: jsonResults.deviceName,
    };
  }

  getRecordingDefaultDevice(): AudioDeviceInfo {
    const apiType = this.getApiTypeFromGetRecordingDefaultDevice();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return {
      deviceId: jsonResults.deviceId,
      deviceName: jsonResults.deviceName,
    };
  }
}
