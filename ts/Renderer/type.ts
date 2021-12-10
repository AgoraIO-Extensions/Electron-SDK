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
  uid: number;
  channelId: string;
  width?: number;
  height?: number;
}

export type User = "local" | "videoSource" | number | string;

export type Channel = "" | string;

/**
 * Video source types definition.
 **/
export enum VideoSourceType {
  /** Video captured by the camera.
   */
  kVideoSourceCameraPrimary = 0,
  kVideoSourceCamera = kVideoSourceCameraPrimary,
  /** Video captured by the secondary camera.
   */
  kVideoSourceCameraSecondary,
  /** Video for screen sharing.
   */
  kVideoSourceScreenPrimary,
  kVideoSourceScreen = kVideoSourceScreenPrimary,
  /** Video for secondary screen sharing.
   */
  kVideoSourceScreenSecondary,
  /** Not define.
   */
  kVideoSourceCustom,
  /** Video for media player sharing.
   */
  kVideoSourceMediaPlayer,
  /** Video for png image.
   */
  kVideoSourceRtmImagePng,
  /** Video for png image.
   */
  kVideoSourceRtcImageJpeg,
  /** Video for png image.
   */
  kVideoSourceRtcImageGif,
  /** Remote video received from network.
   */
  kVideoSourceRemote,
  /** Video for transcoded.
   */
  kVideoSourceTranscoded,
  kVideoSourceUnknown,
}

export interface RendererConfig {
  videoSourceType: VideoSourceType;
  channelId?: Channel;
  uid?: number;
  view?: Element;
  rendererOptions?: RendererOptions;
}
export interface RendererConfigInternal {
  videoSourceType: VideoSourceType;
  channelId: Channel;
  uid: number;
  view?: Element;
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
}
