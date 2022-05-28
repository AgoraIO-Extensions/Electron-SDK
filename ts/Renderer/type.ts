import { VideoSourceType } from "../AgoraSdk";

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


