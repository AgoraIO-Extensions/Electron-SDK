import { MediaPlayerState, MediaPlayerError, MediaPlayerEvent, PlayerPreloadEvent, SrcInfo, PlayerUpdatedInfo } from './AgoraMediaPlayerTypes'

/*
 * Provides callbacks for media players.
 */
export abstract class IMediaPlayerSourceObserver {
/*
 * Reports the playback state change.
 * When the state of the media player changes, the SDK triggers this callback to report the current playback state.
 *
 * @param state The playback state, see MediaPlayerState .
 *
 * @param ec The error code. See MediaPlayerError .
 */
  onPlayerSourceStateChanged?(state: MediaPlayerState, ec: MediaPlayerError): void;

  /*
   * Reports the current playback progress.
   * When playing media files, the SDK triggers this callback every one second to report current playback progress.
   *
   * @param position The playback position (ms) of media files.
   */
  onPositionChanged?(position: number): void;

  /*
   * Reports the playback event.
   * After calling the seek method, the SDK triggers the callback to report the results of the seek operation.
   *
   * @param eventCode The playback event. See MediaPlayerEvent .
   *
   * @param elapsedTime The time (ms) when the event occurs.
   *
   * @param message Information about the event.
   */
  onPlayerEvent?(eventCode: MediaPlayerEvent, elapsedTime: number, message: string): void;

  /*
   * Occurs when the media metadata is received.
   * The callback occurs when the player receives the media metadata and reports the detailed information of the media metadata.
   *
   * @param data The detailed data of the media metadata.
   *
   * @param length The data length (bytes).
   */
  onMetaData?(data: Uint8Array, length: number): void;

  /*
@ignore   */
  onPlayBufferUpdated?(playCachedBuffer: number): void;

  /*
@ignore   */
  onPreloadEvent?(src: string, event: PlayerPreloadEvent): void;

  /*
   * @ignore
   */
  onCompleted?(): void;

  /*
@ignore   */
  onAgoraCDNTokenWillExpire?(): void;

  /*
@ignore   */
  onPlayerSrcInfoChanged?(from: SrcInfo, to: SrcInfo): void;

  /*
@ignore   */
  onPlayerInfoUpdated?(info: PlayerUpdatedInfo): void;

  /*
@ignore   */
  onAudioVolumeIndication?(volume: number): void;
}
