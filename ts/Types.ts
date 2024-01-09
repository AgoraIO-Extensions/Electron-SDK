import { RenderModeType, VideoSourceType } from './Private/AgoraMediaBase';
import { IRenderer, IRendererManager } from './Renderer';

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
  AgoraRendererManager?: IRendererManager;
}

/**
 * @ignore
 */
export interface CanvasOptions {
  /**
   * @ignore
   */
  frameWidth: number;
  /**
   * @ignore
   */
  frameHeight: number;
  /**
   * @ignore
   */
  rotation: number;
  /**
   * @ignore
   */
  contentMode: RenderModeType;
  /**
   * @ignore
   */
  clientWidth: number;
  /**
   * @ignore
   */
  clientHeight: number;
}

/**
 * @ignore
 */
export interface RendererOptions {
  /**
   * @ignore
   */
  contentMode?: RenderModeType;
  /**
   * @ignore
   */
  mirror?: boolean;
}

/**
 * @ignore
 */
export enum RENDER_MODE {
  /**
   * @ignore
   */
  WEBGL = 1,
  /**
   * @ignore
   */
  SOFTWARE = 2,
}

export type User = 'local' | 'videoSource' | number | string;

export type Channel = '' | string;

/**
 * @ignore
 */
export interface RendererVideoConfig {
  /**
   * @ignore
   */
  videoSourceType?: VideoSourceType;
  /**
   * @ignore
   */
  channelId?: Channel;
  /**
   * @ignore
   */
  uid?: number;
  /**
   * @ignore
   */
  view?: HTMLElement;
  /**
   * @ignore
   */
  rendererOptions?: RendererOptions;
}

/**
 * @ignore
 */
export interface FormatRendererVideoConfig {
  /**
   * @ignore
   */
  videoSourceType: VideoSourceType;
  /**
   * @ignore
   */
  channelId: Channel;
  /**
   * @ignore
   */
  uid: number;
  /**
   * @ignore
   */
  view?: HTMLElement;
  /**
   * @ignore
   */
  rendererOptions: RendererOptions;
}

/**
 * @ignore
 */
export interface VideoFrameCacheConfig {
  /**
   * @ignore
   */
  uid: number;
  /**
   * @ignore
   */
  channelId: string;
  /**
   * @ignore
   */
  videoSourceType: VideoSourceType;
}

/**
 * @ignore
 */
export interface ShareVideoFrame {
  /**
   * @ignore
   */
  width: number;
  /**
   * @ignore
   */
  height: number;
  /**
   * @ignore
   */
  yStride: number;
  /**
   * @ignore
   */
  uStride: number;
  /**
   * @ignore
   */
  vStride: number;
  /**
   * @ignore
   */
  yBuffer: Buffer | Uint8Array;
  /**
   * @ignore
   */
  uBuffer: Buffer | Uint8Array;
  /**
   * @ignore
   */
  vBuffer: Buffer | Uint8Array;
  /**
   * @ignore
   */
  mirror?: boolean;
  /**
   * @ignore
   */
  rotation?: number;
  /**
   * @ignore
   */
  uid?: number;
  /**
   * @ignore
   */
  channelId?: string;
  /**
   * @ignore
   */
  videoSourceType?: VideoSourceType;
}

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

  InitializeEnv(): void;

  ReleaseEnv(): void;

  ReleaseRenderer(): void;

  EnableVideoFrameCache(config: VideoFrameCacheConfig): void;

  DisableVideoFrameCache(config: VideoFrameCacheConfig): void;

  GetBuffer(ptr: number, length: number): Buffer;

  GetVideoFrame(streamInfo: ShareVideoFrame): {
    ret: number;
    isNewFrame: boolean;
    yStride: number;
    uStride: number;
    vStride: number;
    width: number;
    height: number;
    rotation: number;
    timestamp: number;
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
export interface RenderConfig {
  /**
   * @ignore
   */
  renders: IRenderer[];
  /**
   * @ignore
   */
  shareVideoFrame: ShareVideoFrame;
}

export type UidMap = Map<number, RenderConfig>;
export type ChannelIdMap = Map<Channel, UidMap>;
export type RenderMap = Map<VideoSourceType, ChannelIdMap>;
