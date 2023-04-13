import { IMediaPlayerCacheManager } from './Private/IAgoraMediaPlayer';
import { IRtcEngineEx } from './Private/IAgoraRtcEngineEx';
import { IMediaPlayerCacheManagerImpl } from './Private/impl/IAgoraMediaPlayerImpl';
import { RtcEngineExInternal } from './Private/internal/RtcEngineExInternal';

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
export * from './Renderer/RendererManager';
export * from './Types';
export * from './Utils';

const instance = new RtcEngineExInternal();

/**
 * Creates an IRtcEngine object.
 * Currently, the Agora RTC SDK v4.x supports creating only one IRtcEngine object for each app.
 *
 * @returns
 * One IRtcEngine object.
 */
export function createAgoraRtcEngine(): IRtcEngineEx {
  return instance;
}

/**
 * Gets one IMediaPlayerCacheManager instance.
 * When you successfully call this method, the SDK returns a media player cache manager instance. The cache manager is a singleton pattern. Therefore, multiple calls to this method returns the same instance.Make sure the IRtcEngine is initialized before you call this method.
 *
 * @returns
 * The IMediaPlayerCacheManager instance.
 */
export function getMediaPlayerCacheManager(): IMediaPlayerCacheManager {
  return new IMediaPlayerCacheManagerImpl();
}

export default createAgoraRtcEngine;
