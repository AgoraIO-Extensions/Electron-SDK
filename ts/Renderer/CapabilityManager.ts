import semver from 'semver';

import createAgoraRtcEngine from '../AgoraSdk';

import {
  GpuInfo,
  VideoDecodeAcceleratorSupportedProfile,
} from '../Decoder/gpu-utils';
import { VideoCodecType } from '../Private/AgoraBase';
import { IRtcEngineEx } from '../Private/IAgoraRtcEngineEx';
import { ipcSend } from '../Private/ipc/renderer';

import { IPCMessageType, codecMapping } from '../Types';
import { AgoraEnv, logDebug, logError } from '../Utils';

/**
 * @ignore
 */
export class CapabilityManager {
  gpuInfo: GpuInfo = new GpuInfo();
  frameCodecMapping: {
    [key in VideoCodecType]?: VideoDecodeAcceleratorSupportedProfile;
  } = {};
  webCodecsDecoderEnabled: boolean = AgoraEnv.enableWebCodecsDecoder;
  private _engine: IRtcEngineEx;

  constructor() {
    this._engine = createAgoraRtcEngine();
    if (AgoraEnv.enableWebCodecsDecoder) {
      this.getGpuInfo(() => {
        if (AgoraEnv.videoFallbackStrategy === 0) {
          if (!this.isSupportedH265()) {
            if (this.isSupportedH264()) {
              this._engine.setParameters(
                JSON.stringify({ 'che.video.h265_dec_enable': false })
              );
              logDebug('H265 is not supported, fallback to H264');
            } else {
              this.webCodecsDecoderEnabled = false;
              logDebug(
                'H264 and H265 are not supported, fallback to native decoder'
              );
            }
          }
        }
      });
    }
  }

  public getGpuInfo(callback?: () => void): void {
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
          this.webCodecsDecoderEnabled = (AgoraEnv.enableWebCodecsDecoder &&
            this.gpuInfo.videoDecodeAcceleratorSupportedProfile.length > 0)!;

          result.forEach((profile: VideoDecodeAcceleratorSupportedProfile) => {
            const match = codecMapping.find((item) =>
              profile.codec.includes(item.profile)
            );
            if (match) {
              //Normally, the range of compatible widths and heights should be the same under the same codec.
              //there is no need to differentiate between different profiles. This could be optimized in the future.
              this.frameCodecMapping[match.type] = {
                codec: match.codec,
                minWidth: profile.minWidth,
                minHeight: profile.minHeight,
                maxWidth: profile.maxWidth,
                maxHeight: profile.maxHeight,
              };
            }
          });
          callback && callback();
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
