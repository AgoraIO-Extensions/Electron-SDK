import { VideoSourceType } from "./AgoraSdk";
import { IRenderer } from "./Renderer/IRender";

export enum ContentMode {
  Cropped = 0,
  Fit = 1,
}
export interface CanvasOptions {
  frameWidth: number;
  frameHeight: number;
  rotation: number;
  contentMode: ContentMode;
  clientWidth: number;
  clientHeight: number;
}

export interface RendererOptions {
  contentMode: ContentMode;
  mirror: boolean;
}

export enum RENDER_MODE {
  WEBGL = 1,
  SOFTWARE = 2,
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
}
export interface ShareVideoFrame {
  width: number;
  height: number;
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

  EnableVideoFrameCache(config: VideoFrameCacheConfig): Result;
  DisableVideoFrameCache(config: VideoFrameCacheConfig): Result;
  GetVideoStreamData(streamInfo: ShareVideoFrame): {
    ret: number;
    isNewFrame: boolean;
    yStride: number;
    width: number;
    height: number;
    rotation: number;
    timestamp: number;
  };
  sendMsg: (
    funcName: string,
    params: any,
    buffer?: ArrayBufferLike,
    bufferCount?: number
  ) => Result;
}

export interface RenderConfig {
  renders: IRenderer[];
  shareVideoFrame: ShareVideoFrame;
}

export type UidMap = Map<number, RenderConfig>;
export type ChannelIdMap = Map<Channel, UidMap>;
export type RenderMap = Map<VideoSourceType, ChannelIdMap>;
