import semver from 'semver';

import createAgoraRtcEngine from '../AgoraSdk';

import {
  GpuInfo,
  VideoDecodeAcceleratorSupportedProfile,
} from '../Decoder/gpu-utils';
import { VideoCodecType } from '../Private/AgoraBase';
import { IRtcEngineEx } from '../Private/IAgoraRtcEngineEx';
import { ipcSend } from '../Private/ipc/renderer';

import {
  CodecMappingItem,
  IPCMessageType,
  VideoFallbackStrategy,
  codecMapping,
  webCodecsProbeList,
} from '../Types';
import { AgoraEnv, logDebug, logError, logInfo } from '../Utils';

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

  setWebCodecsDecoderEnabled(enabled: boolean): void {
    this.webCodecsDecoderEnabled = enabled;
  }

  constructor() {
    this._engine = createAgoraRtcEngine();
    if (AgoraEnv.enableWebCodecsVideoElement) {
      this.webCodecsDecoderEnabled = false;
      this.probeWebCodecs();
    } else if (AgoraEnv.enableWebCodecsDecoder) {
      this.getGpuInfo(() => {
        if (
          AgoraEnv.videoFallbackStrategy ===
          VideoFallbackStrategy.PerformancePriority
        ) {
          if (!this.isSupportedH265()) {
            if (this.isSupportedH264()) {
              this._engine.setParameters(
                JSON.stringify({ 'che.video.h265_dec_enable': false })
              );
              logInfo(
                'the videoFallbackStrategy is PerformancePriority, H265 is not supported, fallback to H264'
              );
            } else {
              this.webCodecsDecoderEnabled = false;
              logInfo(
                'the videoFallbackStrategy is PerformancePriority, H264 and H265 are not supported, fallback to native decoder'
              );
            }
          }
        } else if (
          AgoraEnv.videoFallbackStrategy ===
          VideoFallbackStrategy.BandwidthPriority
        ) {
          if (!this.isSupportedH265()) {
            this.webCodecsDecoderEnabled = false;
            logInfo(
              'the videoFallbackStrategy is BandwidthPriority, H265 is not supported, fallback to native decoder'
            );
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

  /** Resolves when the last probeWebCodecs() finished. */
  public webCodecsReady: Promise<void> = Promise.resolve();
  private _probeSeq = 0;
  /** Native decode-capability keys this class set to false, restored by resetWebCodecsCapability(). */
  private _disabledNativeKeys: string[] = [];

  /**
   * Ask Chromium which codecs WebCodecs can decode (VideoDecoder.isConfigSupported, hardware or
   * software), fill frameCodecMapping, and report the same set to the SDK as its decode
   * capability (rtc.video.dec_caps_allowlist, plus che.video.h265_dec_enable / av1_dec_enable for
   * SDKs without the allowlist key). Takes effect for the next joinChannel.
   */
  public probeWebCodecs(): Promise<void> {
    const seq = ++this._probeSeq;
    this.webCodecsDecoderEnabled = false;
    const VideoDecoderCtor = (globalThis as any).VideoDecoder;
    if (typeof VideoDecoderCtor?.isConfigSupported !== 'function') {
      logError('WebCodecs VideoDecoder is not available, keep SDK decoding');
      this.webCodecsReady = Promise.resolve();
      return this.webCodecsReady;
    }
    const sizes = [
      [4096, 2304],
      [1920, 1080],
    ];
    const probeOne = async (item: CodecMappingItem) => {
      for (const [w, h] of sizes) {
        try {
          const r = await VideoDecoderCtor.isConfigSupported({
            codec: item.codec,
            codedWidth: w,
            codedHeight: h,
            hardwareAcceleration: 'no-preference',
          });
          if (r?.supported) {
            return { minWidth: 16, minHeight: 16, maxWidth: w!, maxHeight: h! };
          }
        } catch (e) {
          logDebug('isConfigSupported failed', item.codec, e);
        }
      }
      return undefined;
    };
    this.webCodecsReady = (async () => {
      const mapping: CapabilityManager['frameCodecMapping'] = {};
      for (const item of webCodecsProbeList) {
        const range = await probeOne(item);
        if (range) mapping[item.type] = { codec: item.codec, ...range };
      }
      if (seq !== this._probeSeq || !AgoraEnv.enableWebCodecsVideoElement)
        return;
      this.frameCodecMapping = mapping;
      const names = webCodecsProbeList
        .filter((item) => mapping[item.type])
        .map((item) => item.profile);
      const h264 = mapping[VideoCodecType.VideoCodecH264] !== undefined;
      this.webCodecsDecoderEnabled = h264;
      logInfo('WebCodecs decode capability', names, 'enabled', h264);
      if (!h264) {
        this.resetWebCodecsCapability();
        return;
      }
      this.setNativeParameter('rtc.video.dec_caps_allowlist', names);
      const legacy: [string, VideoCodecType][] = [
        ['che.video.h265_dec_enable', VideoCodecType.VideoCodecH265],
        ['che.video.av1_dec_enable', VideoCodecType.VideoCodecAv1],
      ];
      for (const [key, type] of legacy) {
        if (
          mapping[type] === undefined &&
          !this._disabledNativeKeys.includes(key)
        ) {
          this.setNativeParameter(key, false);
          this._disabledNativeKeys.push(key);
        }
      }
    })();
    return this.webCodecsReady;
  }

  /** Undo what probeWebCodecs() reported to the SDK. Takes effect for the next joinChannel. */
  public resetWebCodecsCapability(): void {
    this._probeSeq++;
    this.webCodecsDecoderEnabled = false;
    this.frameCodecMapping = {};
    this.setNativeParameter('rtc.video.dec_caps_allowlist', null);
    for (const key of this._disabledNativeKeys)
      this.setNativeParameter(key, true);
    this._disabledNativeKeys = [];
  }

  private setNativeParameter(key: string, value: any): void {
    const ret = this._engine.setParameters(JSON.stringify({ [key]: value }));
    logInfo('setParameters', key, JSON.stringify(value), 'ret', ret);
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
