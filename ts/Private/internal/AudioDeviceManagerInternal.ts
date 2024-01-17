import { AudioDeviceInfo } from '../IAgoraRtcEngine';
import { IAudioDeviceManagerImpl } from '../impl/IAudioDeviceManagerImpl';

import { callIrisApi } from './IrisApiEngine';

export class AudioDeviceManagerInternal extends IAudioDeviceManagerImpl {
  override getPlaybackDeviceInfo(): AudioDeviceInfo {
    const apiType = this.getApiTypeFromGetPlaybackDeviceInfo();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return {
      deviceId: jsonResults.deviceId,
      deviceName: jsonResults.deviceName,
    };
  }

  override getRecordingDeviceInfo(): AudioDeviceInfo {
    const apiType = this.getApiTypeFromGetRecordingDeviceInfo();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return {
      deviceId: jsonResults.deviceId,
      deviceName: jsonResults.deviceName,
    };
  }

  protected override getApiTypeFromGetPlaybackDefaultDevice(): string {
    return 'AudioDeviceManager_getPlaybackDefaultDevice';
  }

  override getPlaybackDefaultDevice(): AudioDeviceInfo {
    const apiType = this.getApiTypeFromGetPlaybackDefaultDevice();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return {
      deviceId: jsonResults.deviceId,
      deviceName: jsonResults.deviceName,
    };
  }

  protected override getApiTypeFromGetRecordingDefaultDevice(): string {
    return 'AudioDeviceManager_getRecordingDefaultDevice';
  }

  override getRecordingDefaultDevice(): AudioDeviceInfo {
    const apiType = this.getApiTypeFromGetRecordingDefaultDevice();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return {
      deviceId: jsonResults.deviceId,
      deviceName: jsonResults.deviceName,
    };
  }
}
