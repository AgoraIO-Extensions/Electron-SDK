import semver from 'semver';

import { ipcSend } from 'ts/Private/ipc/renderer';

import { GpuInfo } from '../Decoder/gpu-utils';
import { IPCMessageType } from '../Types';
import { AgoraEnv, logError } from '../Utils';

/**
 * @ignore
 */
export class CapabilityManager {
  gpuInfo: GpuInfo = new GpuInfo();
  isSupportH265: boolean = false;
  isSupportH264: boolean = false;
  enableWebCodecsDecoder: boolean = AgoraEnv.enableWebCodecsDecoder;

  constructor() {
    if (AgoraEnv.enableWebCodecsDecoder) {
      this.getGpuInfo();
      this.checkIfSupportWebCodecsDecoder();
    }
  }

  public getGpuInfo(): void {
    //getGpuInfo and videoDecoder is not supported in electron version >= 20.0.0
    //@ts-ignore
    if (semver.gte(process.versions.electron, '20.0.0')) {
      return;
    }
    //@ts-ignore
    if (process.type === 'renderer') {
      ipcSend(IPCMessageType.AGORA_IPC_GET_GPU_INFO)
        .then((result) => {
          this.gpuInfo.videoDecodeAcceleratorSupportedProfile = result;
        })
        .catch((error) => {
          logError(
            'Failed to get GPU info, please check if you are already import agora-electron-sdk in the main process.',
            error
          );
        });
    } else {
      logError('This function only works in renderer process');
    }
  }

  private checkIfSupportWebCodecsDecoder() {
    this.enableWebCodecsDecoder = (AgoraEnv.enableWebCodecsDecoder &&
      this.gpuInfo.videoDecodeAcceleratorSupportedProfile.length > 0)!;
  }

  release(): void {
    AgoraEnv.enableWebCodecsDecoder = false;
  }
}