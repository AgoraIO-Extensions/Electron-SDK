/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 11:38:45
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-19 16:00:18
 */

import {
  Result,
  ApiTypeEngine,
  ApiTypeAudioDeviceManager,
  ApiTypeVideoDeviceManager,
  ApiTypeRawDataPluginManager,
} from "./native_type";
import { WindowInfo, DisplayInfo } from "../types";
import { VideoFrameCacheConfig, VideoFrame } from "../../Renderer/type";

/**
 * interface for c++ addon (.node)
 * @private
 * @ignore
 */
export interface NodeIrisRtcEngine {
  OnEvent(callbackName: string, callback: Function): void;
  GetDeviceManager(): NodeIrisRtcDeviceManager;
  GetScreenDisplaysInfo(): Array<DisplayInfo>;
  GetScreenWindowsInfo(): Array<WindowInfo>;
  SetAddonLogFile(filePath: string): Result;
  CallApi(apiType: ApiTypeEngine, params: string): Result;
  CallApiWithBuffer(
    apiType: ApiTypeEngine,
    params: string,
    buffer: string,
    bufferLength: number
  ): Result;
  PluginCallApi(apiType: ApiTypeRawDataPluginManager, params: string): Result;
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
  VideoSourceInitialize(): Result;
  VideoSourceRelease(): Result;
  Release(): Result;
}

/**
 * @ignore
 */
export interface NodeIrisRtcDeviceManager {
  CallApiAudioDevice(
    apiType: ApiTypeAudioDeviceManager,
    params: string
  ): Result;
  CallApiVideoDevice(
    apiType: ApiTypeVideoDeviceManager,
    params: string
  ): Result;
  Release(): void;
}
