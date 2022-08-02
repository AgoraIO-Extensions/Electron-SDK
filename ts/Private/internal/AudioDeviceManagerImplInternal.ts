import { AudioDeviceInfo } from "../IAgoraRtcEngine";
import { IAudioDeviceManagerImpl } from "../impl/IAudioDeviceManagerImpl";
import { callIrisApi } from "./IrisApiEngine";

export class AudioDeviceManagerImplInternal extends IAudioDeviceManagerImpl {
  override getPlaybackDeviceInfo(): AudioDeviceInfo {
    const apiType = "AudioDeviceManager_getPlaybackDeviceInfo";
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    if (jsonResults.result === 0) {
      delete jsonResults.result;
    }
    return jsonResults;
  }

  override getRecordingDeviceInfo(): AudioDeviceInfo {
    const apiType = "AudioDeviceManager_getRecordingDeviceInfo";
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    if (jsonResults.result === 0) {
      delete jsonResults.result;
    }
    return jsonResults;
  }
}
