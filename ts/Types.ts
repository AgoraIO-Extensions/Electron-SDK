import { VideoSourceType } from './Private/AgoraBase';
import { RenderModeType } from './Private/AgoraMediaBase';
import { IRenderer } from './Renderer/IRenderer';
import { RendererManager } from './Renderer/RendererManager';

export interface AgoraEnvType {
  enableLogging: boolean;
  enableDebugLogging: boolean;
  AgoraElectronBridge: AgoraElectronBridge;
  AgoraRendererManager?: RendererManager;
}

export interface CanvasOptions {
  frameWidth: number;
  frameHeight: number;
  rotation: number;
  contentMode: RenderModeType;
  clientWidth: number;
  clientHeight: number;
}

export interface RendererOptions {
  contentMode?: RenderModeType;
  mirror?: boolean;
}

export enum RENDER_MODE {
  WEBGL = 1,
  SOFTWARE = 2,
}

export type User = 'local' | 'videoSource' | number | string;

export type Channel = '' | string;

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
  callApiReturnCode: number;
  callApiResult: any;
}

export enum CallBackModule {
  RTC = 0,
  MPK,
  OBSERVER,
}

export interface AgoraElectronBridge {
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

  EnableVideoFrameCache(config: VideoFrameCacheConfig): void;

  DisableVideoFrameCache(config: VideoFrameCacheConfig): void;

  GetBuffer(ptr: number, length: number): Buffer;

  GetVideoFrame(streamInfo: ShareVideoFrame): {
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
    buffer?: Uint8Array[],
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
