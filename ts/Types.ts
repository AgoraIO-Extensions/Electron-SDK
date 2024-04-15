import { VideoCanvas } from './Private/AgoraBase';
import { VideoFrame } from './Private/AgoraMediaBase';
import { RtcConnection } from './Private/IAgoraRtcEngineEx';
import { RendererCache } from './Renderer/RendererCache';
import { RendererManager } from './Renderer/RendererManager';
import { WebCodecsRendererCache } from './Renderer/WebCodecsRendererCache';

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
  enableWebCodecsDecoder?: boolean;
}

/**
 * @ignore
 */
export interface AgoraEnvType extends AgoraEnvOptions {
  /**
   * @ignore
   */
  AgoraElectronBridge: AgoraElectronBridge;
  /**
   * @ignore
   */
  AgoraRendererManager?: RendererManager;
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
  'channelId' | 'uid' | 'sourceType' | 'useWebCodecsDecoder' | 'enableFps'
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
export interface AgoraElectronBridge {
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

  CallApi(
    funcName: string,
    params: any,
    buffer?: (Uint8Array | undefined)[],
    bufferCount?: number
  ): Result;

  InitializeEnv(env: AgoraEnvType): void;

  ReleaseEnv(): void;

  ReleaseRenderer(): void;

  EnableVideoFrameCache(context: RendererCacheContext): void;

  DisableVideoFrameCache(context: RendererCacheContext): void;

  GetBuffer(ptr: number, length: number): Buffer;

  GetVideoFrame(
    context: RendererCacheContext,
    videoFrame: VideoFrame
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
