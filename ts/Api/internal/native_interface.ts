/*
 * @Author: zhangtao@agora.io
 * @Date: 2021-04-22 11:38:45
 * @Last Modified by: zhangtao@agora.io
 * @Last Modified time: 2021-05-19 16:00:18
 */

import {
  Result,
  ApiTypeEngine,
  ApiTypeChannel,
  ApiTypeAudioDeviceManager,
  ApiTypeVideoDeviceManager,
  ApiTypeRawDataPlugin,
  PROCESS_TYPE
} from "./native_type";
import { WindowInfo } from "../types";
import { VideoFrameCacheConfig, VideoFrame } from "../../renderer/type";

/**
 * interface for c++ addon (.node)
 * @private
 * @ignore
 */
export interface NodeIrisRtcEngine {
  OnEvent(callbackName: string, callback: Function): void;
  GetDeviceManager(): NodeIrisRtcDeviceManager;
  GetScreenDisplaysInfo(): Array<Object>;
  GetScreenWindowsInfo(): Array<WindowInfo>;
  SetAddonLogFile(processType: PROCESS_TYPE, filePath: string): Result;
  CallApi(processType: PROCESS_TYPE, apiType: ApiTypeEngine, params: string): Result;
  CallApiWithBuffer(
    processType: PROCESS_TYPE,
    apiType: ApiTypeEngine,
    params: string,
    buffer: string,
    bufferLength: number
  ): Result;
  PluginCallApi(processType: PROCESS_TYPE, apiType: ApiTypeRawDataPlugin, params: string): Result;
  CreateChannel(processType: PROCESS_TYPE, channelId: string): NodeIrisRtcChannel;
  EnableVideoFrameCache(processType: PROCESS_TYPE, config: VideoFrameCacheConfig): Result;
  DisableVideoFrameCache(processType: PROCESS_TYPE, config: VideoFrameCacheConfig): Result;
  GetVideoStreamData(
    processType: PROCESS_TYPE, 
    streamInfo: VideoFrame
  ): {
    ret: boolean;
    isNewFrame: boolean;
    yStride: number;
    width: number;
    height: number;
    rotation: number;
    timestamp: number;
  };
  VideoSourceInitialize(params: string): Result;
  VideoSourceRelease(): Result;
  Release(): Result;
}

/**
 * @private
 * @ignore
 */
export interface NodeIrisRtcChannel {
  CallApi(apiType: ApiTypeChannel, params: string): Result;
  CallApiWithBuffer(
    apiType: ApiTypeChannel,
    params: string,
    buffer: string,
    length: number
  ): Result;
  OnEvent(callbackName: string, callback: Function): void;
  Release(): void;
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
