import {
  AdvanceOptions,
  VideoCanvas,
  VideoCodecType,
} from './Private/AgoraBase';
import { VideoFrame } from './Private/AgoraMediaBase';
import { RtcConnection } from './Private/IAgoraRtcEngineEx';
import { CapabilityManager } from './Renderer/CapabilityManager';
import { RendererCache } from './Renderer/RendererCache';
import { RendererManager } from './Renderer/RendererManager';
import { WebCodecsRendererCache } from './Renderer/WebCodecsRendererCache';

export enum VideoFallbackStrategy {
  /**
   * @ignore
   */
  PerformancePriority = 0,
  /**
   * @ignore
   */
  BandwidthPriority = 1,
}

/**
 * @ignore
 */
export interface AgoraEnvOptions {
  /**
   * @ignore
   */
  enableLogging?: boolean;
  /**
   * @ignore
   */
  enableDebugLogging?: boolean;
  /**
   * @ignore
   */
  webEnvReady?: boolean;
  /**
   * @ignore
   */
  enableWebCodecsDecoder: boolean;
  /**
   * @ignore
   */
  videoFallbackStrategy: VideoFallbackStrategy;
  /**
   * @ignore
   */
  encodeAlpha: boolean;
}

/**
 * @ignore
 */
export interface AgoraEnvType extends AgoraEnvOptions {
  /**
   * @ignore
   */
  AgoraRendererManager?: RendererManager;
  /**
   * @ignore
   */
  CapabilityManager?: CapabilityManager;
}

/**
 * @ignore
 */
export enum RendererType {
  /**
   * @ignore
   */
  WEBGL = 1,
  /**
   * @ignore
   */
  SOFTWARE = 2,
  /**
   * @ignore
   */
  WEBCODECSRENDERER = 3,
}

export type RENDER_MODE = RendererType;

export type RendererContext = VideoCanvas & RtcConnection;
export type RendererCacheType = RendererCache | WebCodecsRendererCache;

export type RendererCacheContext = Pick<
  RendererContext,
  | 'channelId'
  | 'localUid'
  | 'uid'
  | 'sourceType'
  | 'useWebCodecsDecoder'
  | 'enableFps'
  | 'position'
>;

/**
 * @ignore
 */
export interface Result {
  /**
   * @ignore
   */
  callApiReturnCode: number;
  /**
   * @ignore
   */
  callApiResult: any;
}

/**
 * @ignore
 */
export interface IAgoraElectronBridge {
  /**
   * @ignore
   */
  OnEvent(
    callbackName: string,
    callback: (
      event: string,
      data: string,
      buffer: Uint8Array[],
      bufferLength: number[],
      bufferCount: number
    ) => void
  ): void;

  UnEvent(callbackName: string): void;

  CallApi(
    funcName: string,
    params: any,
    buffer?: (Uint8Array | undefined)[],
    bufferCount?: number
  ): Result;

  InitializeEnv(): void;

  ReleaseEnv(): void;

  ReleaseRenderer(): void;

  EnableVideoFrameCache(context: RendererCacheContext): void;

  DisableVideoFrameCache(context: RendererCacheContext): void;

  GetBuffer(ptr: number, length: number): Buffer;

  GetVideoFrame(
    context: RendererCacheContext,
    videoFrame: VideoFrame,
    advanceOptions: AdvanceOptions
  ): {
    ret: number;
    isNewFrame: boolean;
  };

  sendMsg: (
    funcName: string,
    params: any,
    buffer?: Uint8Array[],
    bufferCount?: number
  ) => Result;
}

/**
 * @ignore
 */
export enum IPCMessageType {
  AGORA_IPC_GET_GPU_INFO = 'AGORA_IPC_GET_GPU_INFO',
}

interface CodecMappingItem {
  codec: string;
  type: VideoCodecType;
  profile: string;
}

/**
 * @ignore
 */
export const codecMapping: CodecMappingItem[] = [
  {
    codec: 'avc1.64e01f',
    type: VideoCodecType.VideoCodecH264,
    profile: 'h264',
  },
  {
    codec: 'hvc1.1.6.L5.90',
    type: VideoCodecType.VideoCodecH265,
    profile: 'hevc',
  },
  { codec: 'vp8', type: VideoCodecType.VideoCodecVp8, profile: 'vp8' },
  { codec: 'vp9', type: VideoCodecType.VideoCodecVp9, profile: 'vp9' },
];

export interface CodecConfigInfo {
  codecType: VideoCodecType | undefined;
  codedWidth: number | undefined;
  codedHeight: number | undefined;
  rotation: number | undefined;
}
