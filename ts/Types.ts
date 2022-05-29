import { VideoSourceType } from "./Private/AgoraBase";
import { IRenderer } from "./Renderer/IRenderer";

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

export interface RendererVideoConfig {
  videoSourceType?: VideoSourceType;
  channelId?: Channel;
  uid?: number;
  view?: HTMLElement;
  rendererOptions?: RendererOptions;
}
export interface FormatRendererVideoConfig {
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

export enum CallBackModule {
  RTC = 0,
  MPK,
}

export interface AgoraElectronBridge {
  OnEvent(
    module: CallBackModule,
    callbackName: string,
    callback: (
      event: string,
      data: string,
      buffer: Uint8Array[],
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
