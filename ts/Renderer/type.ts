/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-28 13:34:39
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-19 15:51:34
 */

import { IrisVideoSourceType } from "ts/Api/internal/native_type";

export enum CONTENT_MODE {
  CROPPED = 0,
  FIT = 1,
}
export interface CanvasOptions {
  frameWidth: number;
  frameHeight: number;
  rotation: number;
  mirror: boolean;
  contentMode: CONTENT_MODE;
  clientWidth: number;
  clientHeight: number;
}

export interface RendererOptions {
  append: boolean;
  contentMode: CONTENT_MODE;
  mirror: boolean;
}

export enum RENDER_MODE {
  WEBGL = 1,
  SOFTWARE = 2,
  CUSTOM = 3,
}

export interface VideoFrameCacheConfig {
  user?: User;
  uid?: number;
  channelId: string;
  width?: number;
  height?: number;
  videoSourceType?: IrisVideoSourceType;
}

export type User = "local" | "videoSource" | number | string;

export type Channel = "" | string;

export interface RendererConfig {
  user: User;
  view: Element | undefined;
  rendererOptions?: RendererOptions;
  channelId?: Channel;
  fps?: number;
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
  videoSourceType?: IrisVideoSourceType;
}
