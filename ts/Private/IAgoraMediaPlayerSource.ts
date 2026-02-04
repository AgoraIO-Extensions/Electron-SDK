import './extension/IAgoraMediaPlayerSourceExtension';
import {
  CacheStatistics,
  MediaPlayerEvent,
  MediaPlayerReason,
  MediaPlayerState,
  PlayerPlaybackStats,
  PlayerPreloadEvent,
  PlayerUpdatedInfo,
  SrcInfo,
} from './AgoraMediaPlayerTypes';

/**
 * Provides callbacks for the media player.
 */
export interface IMediaPlayerSourceObserver {
  /**
   * Reports changes in the player state.
   *
   * When the player state changes, the SDK triggers this callback to report the new playback state.
   *
   * @param state The new playback state. See MediaPlayerState.
   * @param reason The reason for the player state change. See MediaPlayerReason.
   */
  onPlayerSourceStateChanged?(
    state: MediaPlayerState,
    reason: MediaPlayerReason
  ): void;

  /**
   * Reports the current playback progress of the media resource.
   *
   * When playing a media file, the SDK automatically triggers this callback every second to report the current playback progress.
   *
   * @param positionMs The current playback progress in ms.
   * @param timestampMs The NTP timestamp of the current playback progress in ms.
   */
  onPositionChanged?(positionMs: number, timestampMs: number): void;

  /**
   * Reports events from the media player.
   *
   * After calling seek to seek playback, the SDK triggers this callback to report the result of the seek operation.
   *
   * @param eventCode Media player event. See MediaPlayerEvent.
   * @param elapsedTime The time (ms) when the event occurred.
   * @param message Information about the event.
   */
  onPlayerEvent?(
    eventCode: MediaPlayerEvent,
    elapsedTime: number,
    message: string
  ): void;

  /**
   * Reports retrieved media metadata.
   *
   * After parsing the media metadata, the SDK triggers this callback to report the data type and content of the metadata.
   *
   * @param data The actual data in a user-defined format.
   * @param length The length of the data in bytes.
   */
  onMetaData?(data: Uint8Array, length: number): void;

  /**
   * Reports the playable duration of the current buffer.
   *
   * While playing online media resources, the SDK triggers this callback every second to report the duration that the current buffered data can support for playback.
   *  If the buffered duration is less than the threshold (default is 0), it returns PlayerEventBufferLow (6).
   *  If the buffered duration is greater than the threshold (default is 0), it returns PlayerEventBufferRecover (7).
   *
   * @param playCachedBuffer The duration (ms) that the current buffered data can support for playback.
   */
  onPlayBufferUpdated?(playCachedBuffer: number): void;

  /**
   * Reports events related to preloading media resources.
   *
   * @param src The path of the media resource.
   * @param event The event that occurs during media resource preloading. See PlayerPreloadEvent.
   */
  onPreloadEvent?(src: string, event: PlayerPreloadEvent): void;

  /**
   * @ignore
   */
  onCompleted?(): void;

  /**
   * @ignore
   */
  onAgoraCDNTokenWillExpire?(): void;

  /**
   * Callback for video bitrate change of media resource.
   *
   * @param from Information about the video bitrate of the media resource before the change. See SrcInfo.
   * @param to Information about the video bitrate of the media resource after the change. See SrcInfo.
   */
  onPlayerSrcInfoChanged?(from: SrcInfo, to: SrcInfo): void;

  /**
   * Callback when media player-related information changes.
   *
   * When media player-related information changes, the SDK triggers this callback. You can use it for troubleshooting and diagnostics.
   *
   * @param info Media player-related information. See PlayerUpdatedInfo.
   */
  onPlayerInfoUpdated?(info: PlayerUpdatedInfo): void;

  /**
   * Reports information about the media resources currently in cache.
   *
   * After calling the openWithMediaSource method and setting the enableCache member to true, the SDK triggers this callback once per second after the media file is opened to report statistics of the cached media files.
   *
   * @param stats Information about the media resources in cache. See CacheStatistics.
   */
  onPlayerCacheStats?(stats: CacheStatistics): void;

  /**
   * Reports information about the currently playing media resource.
   *
   * After the media resource starts playing, the SDK triggers this callback once per second to report information about the media resource.
   *
   * @param stats Information about the media resource. See PlayerPlaybackStats.
   */
  onPlayerPlaybackStats?(stats: PlayerPlaybackStats): void;

  /**
   * @ignore
   */
  onAudioVolumeIndication?(volume: number): void;
}
