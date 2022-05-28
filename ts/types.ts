import { VideoSourceType } from "./AgoraSdk";

export enum CONTENT_MODE {
  CROPPED = 0,
  FIT = 1,
}
export interface CanvasOptions {
  frameWidth: number;
  frameHeight: number;
  rotation: number;
  contentMode: CONTENT_MODE;
  clientWidth: number;
  clientHeight: number;
}

export interface RendererOptions {
  contentMode: CONTENT_MODE;
  mirror: boolean;
}

export enum RENDER_MODE {
  WEBGL = 1,
  SOFTWARE = 2,
  CUSTOM = 3,
}

export type User = "local" | "videoSource" | number | string;

export type Channel = "" | string;

export interface RendererConfig {
  videoSourceType: VideoSourceType;
  channelId?: Channel;
  uid?: number;
  view?: HTMLElement;
  rendererOptions?: RendererOptions;
}
export interface RendererConfigInternal {
  videoSourceType: VideoSourceType;
  channelId: Channel;
  uid: number;
  view?: HTMLElement;
  rendererOptions: RendererOptions;
}

export interface VideoFrameCacheConfig {
  uid: number;
  channelId: string;
  videoSourceType: VideoSourceType;
  width?: number;
  height?: number;
}
export interface VideoFrame {
  width: number;
  height: number;
  yStride: number;
  yBuffer: Buffer | Uint8Array;
  uBuffer: Buffer | Uint8Array;
  vBuffer: Buffer | Uint8Array;
  mirror?: boolean;
  rotation?: number;
  uid?: number;
  channelId?: string;
  videoSourceType: VideoSourceType;
}
export interface Result {
  retCode: number;
  result: string;
}
export interface AgoraElectronBridge {
  OnEvent(
    callbackName: string,
    callback: (
      event: string,
      data: string,
      buffer: ArrayBufferLike,
      bufferLength: number,
      bufferCount: number
    ) => void
  ): void;
  CallApi(
    funcName: string,
    params: any,
    buffer?: ArrayBufferLike,
    bufferCount?: number
  ): Result;
  InitializeEnv(): void;
  ReleaseEnv(): void;

  sendMsg: (
    funcName: string,
    params: any,
    buffer?: ArrayBufferLike,
    bufferCount?: number
  ) => Result;

  // PluginCallApi(apiType: ApiTypeRawDataPluginManager, params: string): Result;
  EnableVideoFrameCache(config: VideoFrameCacheConfig): Result;
  DisableVideoFrameCache(config: VideoFrameCacheConfig): Result;
  GetVideoStreamData(streamInfo: VideoFrame): {
    ret: boolean;
    isNewFrame: boolean;
    yStride: number;
    width: number;
    height: number;
    rotation: number;
    timestamp: number;
  };
}
