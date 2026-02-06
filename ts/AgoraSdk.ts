import { IMediaPlayerCacheManager } from './Private/IAgoraMediaPlayer';
import { IRtcEngineEx } from './Private/IAgoraRtcEngineEx';
import { RtcEngineExInternal } from './Private/internal/RtcEngineExInternal';
import { AgoraEnvOptions } from './Types';
import { AgoraEnv } from './Utils';

export * from './Private/AgoraBase';
export * from './Private/AgoraMediaBase';
export * from './Private/AgoraMediaPlayerTypes';
export * from './Private/IAgoraLog';
export * from './Private/IAgoraMediaEngine';
export * from './Private/IAgoraMediaPlayer';
export * from './Private/IAgoraMediaPlayerSource';
export * from './Private/IAgoraMediaRecorder';
export * from './Private/IAgoraMusicContentCenter';
export * from './Private/IAgoraRhythmPlayer';
export * from './Private/IAgoraRtcEngine';
export * from './Private/IAgoraRtcEngineEx';
export * from './Private/IAgoraSpatialAudio';
export * from './Private/IAudioDeviceManager';
export * from './Renderer';
export * from './Types';
export * from './Utils';

const instance = new RtcEngineExInternal();

/**
 * @ignore
 */
export function createAgoraRtcEngine(options?: AgoraEnvOptions): IRtcEngineEx {
  Object.assign(AgoraEnv, options);
  return instance;
}

/**
 * @ignore
 */
export function getMediaPlayerCacheManager(): IMediaPlayerCacheManager {
  return new IMediaPlayerCacheManagerImpl();
}

export default createAgoraRtcEngine;

import { IMediaPlayerCacheManagerImpl } from './Private/impl/IAgoraMediaPlayerImpl';
