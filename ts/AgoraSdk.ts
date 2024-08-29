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
 * Creates one IRtcEngineEx object.
 *
 * Currently, the Agora RTC SDK v4.x supports creating only one IRtcEngineEx object for each app.
 *
 * @returns
 * One IRtcEngineEx object.
 */
export function createAgoraRtcEngine(options?: AgoraEnvOptions): IRtcEngineEx {
  Object.assign(AgoraEnv, options);
  return instance;
}

/**
 * Gets one IMediaPlayerCacheManager instance.
 *
 * Before calling any APIs in the IMediaPlayerCacheManager class, you need to call this method to get a cache manager instance of a media player.
 *
 * @returns
 * The IMediaPlayerCacheManager instance.
 */
export function getMediaPlayerCacheManager(): IMediaPlayerCacheManager {
  return new IMediaPlayerCacheManagerImpl();
}

export default createAgoraRtcEngine;

import { IMediaPlayerCacheManagerImpl } from './Private/impl/IAgoraMediaPlayerImpl';
