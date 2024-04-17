import semver from 'semver';

import {
  GpuInfo,
  VideoDecodeAcceleratorSupportedProfile,
} from '../Decoder/gpu-utils';
import { VideoCodecType } from '../Private/AgoraBase';
import { ipcSend } from '../Private/ipc/renderer';

import { IPCMessageType, codecMapping } from '../Types';
import { AgoraEnv, logError } from '../Utils';

/**
 * @ignore
 */
export class CapabilityManager {
  gpuInfo: GpuInfo = new GpuInfo();
  frameCodecMapping: { [key in VideoCodecType]?: string } = {};
  enableWebCodecsDecoder: boolean = AgoraEnv.enableWebCodecsDecoder;

  constructor() {
    if (AgoraEnv.enableWebCodecsDecoder) {
      this.getGpuInfo();
    }
  }

  public getGpuInfo(): void {
    //getGpuInfo and videoDecoder is not supported in electron version < 22.0.0
    //@ts-ignore
    if (semver.lt(process.versions.electron, '22.0.0')) {
      logError(
        'WebCodecsDecoder is not supported in electron version < 22.0.0, please upgrade electron to 22.0.0 or later.'
      );
      return;
    }
    //@ts-ignore
    if (process.type === 'renderer') {
      ipcSend(IPCMessageType.AGORA_IPC_GET_GPU_INFO)
        .then((result) => {
          this.gpuInfo.videoDecodeAcceleratorSupportedProfile = result;
          this.enableWebCodecsDecoder = (AgoraEnv.enableWebCodecsDecoder &&
            this.gpuInfo.videoDecodeAcceleratorSupportedProfile.length > 0)!;

          result.forEach((profile: VideoDecodeAcceleratorSupportedProfile) => {
            const match = codecMapping.find((item) =>
              profile.title.includes(item.profile)
            );
            if (match) {
              this.frameCodecMapping[match.type] = match.codec;
            }
          });
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

  public isSupportedH264(): boolean {
    return this.frameCodecMapping[VideoCodecType.VideoCodecH264] !== undefined;
  }

  public isSupportedH265(): boolean {
    return this.frameCodecMapping[VideoCodecType.VideoCodecH265] !== undefined;
  }

  release(): void {
    AgoraEnv.enableWebCodecsDecoder = false;
  }
}
