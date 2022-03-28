/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-28 13:34:39
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-19 15:51:34
 */

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

export interface VideoFrameCacheConfig {
  uid: number;
  channelId: string;
  videoSourceType: VideoSourceType;
  width?: number;
  height?: number;
}

export type User = "local" | "videoSource" | number | string;

export type Channel = "" | string;

/**
 * Video source types definition.
 **/
export enum VideoSourceType {
  kVideoSourceTypeCameraPrimary,
  kVideoSourceTypeCameraSecondary,
  kVideoSourceTypeScreenPrimary,
  kVideoSourceTypeScreenSecondary,
  kVideoSourceTypeCustom,
  kVideoSourceTypeMediaPlayer,
  kVideoSourceTypeRtcImagePng,
  kVideoSourceTypeRtcImageJpeg,
  kVideoSourceTypeRtcImageGif,
  kVideoSourceTypeRemote,
  kVideoSourceTypeTranscoded,
  kVideoSourceTypeUnknown,
}

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
