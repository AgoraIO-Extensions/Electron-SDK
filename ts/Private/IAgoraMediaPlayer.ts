import './extension/IAgoraMediaPlayerExtension';
import { SpatialAudioParams } from './AgoraBase';
import {
  AudioDualMonoMode,
  IAudioPcmFrameSink,
  IAudioSpectrumObserver,
  RawAudioFrameOpModeType,
  RenderModeType,
  VideoFrame,
} from './AgoraMediaBase';
import {
  MediaPlayerState,
  MediaSource,
  PlayerStreamInfo,
} from './AgoraMediaPlayerTypes';
import { IMediaPlayerSourceObserver } from './IAgoraMediaPlayerSource';

/**
 * Class that provides media player functionality and supports multiple instances.
 */
export abstract class IMediaPlayer {
  /**
   * Gets the media player ID.
   *
   * @returns
   * On success, returns the media player ID.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract getMediaPlayerId(): number;

  /**
   * Opens a media resource.
   *
   * This method is asynchronous.
   *
   * @param url The path to the media file, supporting both local and online files.
   * @param startPos The starting playback position in milliseconds. The default value is 0.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract open(url: string, startPos: number): number;

  /**
   * Opens a media resource and configures playback.
   *
   * This method allows you to open different types of media resources, including custom media files, and configure playback. This method is asynchronous. To play the media file, call the play method after receiving the onPlayerSourceStateChanged callback with status PlayerStateOpenCompleted.
   *
   * @param source The media resource. See MediaSource.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract openWithMediaSource(source: MediaSource): number;

  /**
   * Plays the media file.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract play(): number;

  /**
   * Pauses playback.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract pause(): number;

  /**
   * Stops playback.
   *
   * After calling this method to stop playback, you need to call open or openWithMediaSource again to reopen the media resource if you want to play again.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract stop(): number;

  /**
   * Resumes playback after pause.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract resume(): number;

  /**
   * Seeks to the specified playback position in the media file.
   *
   * If you call seek after playback has completed (when the onPlayerSourceStateChanged callback reports the playback state as PlayerStatePlaybackCompleted or PlayerStatePlaybackAllLoopsCompleted), and the call succeeds, the SDK automatically starts playback from the specified position. In this case, you receive the onPlayerSourceStateChanged callback reporting the playback state as PlayerStatePlaying.
   *  If you call seek while playback is paused, upon successful call, the SDK seeks to the specified position. To resume playback, call resume or play.
   *
   * @param newPos The target position in milliseconds.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract seek(newPos: number): number;

  /**
   * Adjusts the pitch of the currently playing media resource.
   *
   * You need to call this method after calling open.
   *
   * @param pitch Adjusts the pitch of the locally played music file in semitone scale. Default is 0, meaning no pitch adjustment. Value range is [-12,12], where each adjacent value differs by a semitone. The greater the absolute value, the more the pitch is raised or lowered.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setAudioPitch(pitch: number): number;

  /**
   * Gets the total duration of the media file.
   *
   * @returns
   * The total duration of the media file in milliseconds.
   */
  abstract getDuration(): number;

  /**
   * Gets the current playback position.
   *
   * @returns
   * On success, returns the current playback position in milliseconds.
   *  < 0: Failure. See MediaPlayerReason.
   */
  abstract getPlayPosition(): number;

  /**
   * Gets the number of media streams in the current media file.
   *
   * Call this method after open and after receiving the onPlayerSourceStateChanged callback reporting the playback state as PlayerStateOpenCompleted.
   *
   * @returns
   * On success, returns the number of media streams in the media file.
   *  < 0: Failure. See MediaPlayerReason.
   */
  abstract getStreamCount(): number;

  /**
   * Gets media stream information by the index of the media stream.
   *
   * @param index The index of the media stream. The value must be less than the return value of getStreamCount.
   *
   * @returns
   * If the method call succeeds, returns the media stream information. See PlayerStreamInfo.
   *  If the method call fails, returns null.
   */
  abstract getStreamInfo(index: number): PlayerStreamInfo;

  /**
   * Sets loop playback.
   *
   * If you want to enable loop playback, call this method and set the number of loops.
   * When loop playback ends, the SDK triggers the onPlayerSourceStateChanged callback to report the playback state as PlayerStatePlaybackAllLoopsCompleted.
   *
   * @param loopCount Number of times to loop playback.
   *  ≥0: Number of loops. For example, 0 means no loop, play once; 1 means loop once, play twice in total.
   *  -1: Loop infinitely.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setLoopCount(loopCount: number): number;

  /**
   * Sets the playback speed of the current audio file.
   *
   * You need to call this method after open.
   *
   * @param speed Playback speed. Recommended range is [30,400], where:
   *  30: 0.3x speed.
   *  100: Original speed.
   *  400: 4x speed.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setPlaybackSpeed(speed: number): number;

  /**
   * Specifies the audio track to play in the current audio file.
   *
   * After obtaining the audio track index of the audio file, you can call this method to specify any track for playback. If different tracks in a multi-track file contain songs in different languages, you can call this method to set the playback language. You need to call this method after calling getStreamInfo to obtain the audio stream index.
   *
   * @param index The index of the audio track.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract selectAudioTrack(index: number): number;

  /**
   * Selects the audio tracks for local playback and remote transmission.
   *
   * You can call this method to separately set the audio tracks for local playback and remote transmission.
   * Before calling this method, you need to open the media file using openWithMediaSource and set enableMultiAudioTrack to true via MediaSource.
   *
   * @param playoutTrackIndex The index of the audio track used for local playback. You can get the index via getStreamInfo.
   * @param publishTrackIndex The index of the audio track used for remote transmission. You can get the index via getStreamInfo.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure.
   */
  abstract selectMultiAudioTrack(
    playoutTrackIndex: number,
    publishTrackIndex: number
  ): number;

  /**
   * @ignore
   */
  abstract takeScreenshot(filename: string): number;

  /**
   * @ignore
   */
  abstract selectInternalSubtitle(index: number): number;

  /**
   * @ignore
   */
  abstract setExternalSubtitle(url: string): number;

  /**
   * Gets the current state of the media player.
   *
   * @returns
   * The current state of the media player. See MediaPlayerState.
   */
  abstract getState(): MediaPlayerState;

  /**
   * Sets whether to mute.
   *
   * @param muted Mute option. true : Mute. false : (Default) Do not mute.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract mute(muted: boolean): number;

  /**
   * Gets whether the currently playing media file is muted.
   *
   * @returns
   * true : The currently playing media file is muted. false : The currently playing media file is not muted.
   */
  abstract getMute(): boolean;

  /**
   * Adjusts the local playback volume.
   *
   * @param volume Local playback volume, ranging from 0 to 100:
   *  0: Mute.
   *  100: (Default) Original playback volume of the media file.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract adjustPlayoutVolume(volume: number): number;

  /**
   * Gets the current local playback volume.
   *
   * @returns
   * Returns the current local playback volume, ranging from 0 to 100:
   *  0: Silent.
   *  100: (Default) Original playback volume of the media file.
   */
  abstract getPlayoutVolume(): number;

  /**
   * Adjusts the volume heard by remote users.
   *
   * After connecting to the Agora server, you can call this method to adjust the volume of the media file heard by remote users.
   *
   * @param volume Signal volume, ranging from 0 to 400:
   *  0: Mute.
   *  100: (Default) Original volume of the media file.
   *  400: Four times the original volume (with built-in overflow protection).
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract adjustPublishSignalVolume(volume: number): number;

  /**
   * Gets the volume heard by remote users.
   *
   * @returns
   * ≥ 0: The remote playback volume of the media file.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract getPublishSignalVolume(): number;

  /**
   * Sets the rendering view of the player.
   *
   * @param view The rendering view. On Windows, it is a window handle (HWND).
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setView(view: any): number;

  /**
   * Sets the rendering mode of the player view.
   *
   * @param renderMode Rendering mode of the player view. See RenderModeType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setRenderMode(renderMode: RenderModeType): number;

  /**
   * Registers a player source observer.
   *
   * @param observer The player source observer that reports events during playback. See IMediaPlayerSourceObserver.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract registerPlayerSourceObserver(
    observer: IMediaPlayerSourceObserver
  ): number;

  /**
   * Unregisters the player source observer.
   *
   * @param observer The player source observer that reports events during playback. See IMediaPlayerSourceObserver.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract unregisterPlayerSourceObserver(
    observer: IMediaPlayerSourceObserver
  ): number;

  /**
   * Registers an audio frame observer.
   *
   * @param observer The audio frame observer that monitors the reception of each audio frame. See IAudioPcmFrameSink.
   * @param mode The usage mode of the audio frame. See RawAudioFrameOpModeType.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract registerAudioFrameObserver(
    observer: IAudioPcmFrameSink,
    mode?: RawAudioFrameOpModeType
  ): number;

  /**
   * Unregisters the audio frame observer.
   *
   * @param observer The audio frame observer. See IAudioPcmFrameSink.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract unregisterAudioFrameObserver(observer: IAudioPcmFrameSink): number;

  /**
   * Registers a video frame observer.
   *
   * You need to implement a IMediaPlayerVideoFrameObserver class in this method and register the callbacks of that class as needed. After successful registration, the SDK triggers the registered callbacks when each video frame is captured.
   *
   * @param observer The video frame observer that monitors the reception of each video frame. See IMediaPlayerVideoFrameObserver.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract registerVideoFrameObserver(
    observer: IMediaPlayerVideoFrameObserver
  ): number;

  /**
   * Unregisters the video frame observer.
   *
   * @param observer The video frame observer that monitors the reception of each video frame. See IMediaPlayerVideoFrameObserver.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract unregisterVideoFrameObserver(
    observer: IMediaPlayerVideoFrameObserver
  ): number;

  /**
   * @ignore
   */
  abstract registerMediaPlayerAudioSpectrumObserver(
    observer: IAudioSpectrumObserver,
    intervalInMS: number
  ): number;

  /**
   * @ignore
   */
  abstract unregisterMediaPlayerAudioSpectrumObserver(
    observer: IAudioSpectrumObserver
  ): number;

  /**
   * Sets the channel mode of the current audio file.
   *
   * In stereo audio files, the left and right channels can store different audio data. Depending on your needs, you can set the channel mode to original, left channel, right channel, or mixed mode. For example, in a KTV scenario, the left channel of the audio file stores the accompaniment, and the right channel stores the original vocals. If you only want to hear the accompaniment, call this method to set the channel mode to left channel; if you want to hear both accompaniment and vocals, set the mode to mixed.
   *  You need to call this method after calling open.
   *  This method only applies to stereo audio files.
   *
   * @param mode Channel mode. See AudioDualMonoMode.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setAudioDualMonoMode(mode: AudioDualMonoMode): number;

  /**
   * @ignore
   */
  abstract getPlayerSdkVersion(): string;

  /**
   * Gets the path of the media resource being played.
   *
   * @returns
   * The path of the media resource being played.
   */
  abstract getPlaySrc(): string;

  /**
   * @ignore
   */
  abstract openWithAgoraCDNSrc(src: string, startPos: number): number;

  /**
   * @ignore
   */
  abstract getAgoraCDNLineCount(): number;

  /**
   * @ignore
   */
  abstract switchAgoraCDNLineByIndex(index: number): number;

  /**
   * @ignore
   */
  abstract getCurrentAgoraCDNIndex(): number;

  /**
   * @ignore
   */
  abstract enableAutoSwitchAgoraCDN(enable: boolean): number;

  /**
   * @ignore
   */
  abstract renewAgoraCDNSrcToken(token: string, ts: number): number;

  /**
   * @ignore
   */
  abstract switchAgoraCDNSrc(src: string, syncPts?: boolean): number;

  /**
   * Switches the media source.
   *
   * You can call this method to switch the bitrate of the media source being played based on the current network condition. For example:
   *  When the network is poor, switch to a lower bitrate media source URL.
   *  When the network is good, switch to a higher bitrate media source URL. After calling this method, if you receive the onPlayerEvent callback reporting the PlayerEventSwitchComplete event, the media source has been switched successfully. If the switch fails, the SDK automatically retries 3 times. If it still fails, you will receive the onPlayerEvent callback reporting the PlayerEventSwitchError event, indicating an error occurred during the media source switch.
   *  Make sure to call this method after open.
   *  To ensure normal playback, pay attention to the following when calling this method:
   *  Do not call this method while playback is paused.
   *  Do not call seek during bitrate switching.
   *  Ensure the playback position before switching is not greater than the total duration of the target media source.
   *
   * @param src The network path of the media source.
   * @param syncPts Whether to synchronize the starting playback position before and after the switch: true : Synchronize. false : (Default) Do not synchronize.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract switchSrc(src: string, syncPts?: boolean): number;

  /**
   * Preloads a media resource.
   *
   * You can call this method to preload a media resource into the playlist. To preload multiple media resources, call this method multiple times.
   * After calling this method, if you receive the onPreloadEvent callback with event PlayerPreloadEventComplete, the preload is successful; if you receive the onPreloadEvent callback with event PlayerPreloadEventError, the preload has failed.
   * After successful preload, call playPreloadedSrc to play the media resource, or call stop to clear the playlist.
   *  Before calling this method, make sure you have successfully opened the media resource using open or openWithMediaSource.
   *  The SDK does not support preloading duplicate media resources into the playlist, but it does support preloading the currently playing media resource again into the playlist.
   *
   * @param src The network path of the media resource.
   * @param startPos The starting position (in milliseconds) when playback begins after preloading into the playlist. For live streams, set this parameter to 0.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract preloadSrc(src: string, startPos: number): number;

  /**
   * Plays a preloaded media resource.
   *
   * After calling the preloadSrc method to preload a media resource into the playlist, you can call this method to play the preloaded media resource. If you receive the onPlayerSourceStateChanged callback reporting the status PlayerStatePlaying, it indicates that playback was successful.
   * If you want to switch to another preloaded media resource, you can call this method again and specify a new media resource path. If you want to replay a media resource, you need to call preloadSrc again to preload it into the playlist before playback. To clear the playlist, call stop. If you call this method while playback is paused, it will take effect only after playback resumes.
   *
   * @param src The URL of the media resource in the playlist. It must match the src set by the preloadSrc method, otherwise playback will fail.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract playPreloadedSrc(src: string): number;

  /**
   * Releases the preloaded media source.
   *
   * @param src The network path of the media source.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract unloadSrc(src: string): number;

  /**
   * Enables or disables spatial audio for the media player.
   *
   * After successfully setting the spatial audio parameters for the media player, the SDK enables spatial audio for the media player, allowing the local user to hear the media content with a sense of spatiality.
   * To disable spatial audio for the media player, set the params parameter to null.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setSpatialAudioParams(params: SpatialAudioParams): number;

  /**
   * @ignore
   */
  abstract setSoundPositionParams(pan: number, gain: number): number;

  /**
   * Sets media player options.
   *
   * The media player supports setting options via key and value.
   * The difference between this method and setPlayerOptionInString is that the value in this method is of type Int, while in setPlayerOptionInString it is of type String. The two cannot be used interchangeably.
   *
   * @param key The key value.
   * @param value The value.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setPlayerOptionInInt(key: string, value: number): number;

  /**
   * Sets media player options.
   *
   * The media player allows you to set options using key and value.
   * The difference between this method and setPlayerOptionInInt is that the value in this method is of type String, while in setPlayerOptionInInt, the value is of type Int. These two methods cannot be used interchangeably.
   *
   * @param key The key value.
   * @param value The value.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See [Error Codes](https://docs.agora.io/en/video-calling/troubleshooting/error-codes) for details and resolution suggestions.
   */
  abstract setPlayerOptionInString(key: string, value: string): number;
}

/**
 * This class provides methods to manage cached media files in the media player.
 */
export abstract class IMediaPlayerCacheManager {
  /**
   * Deletes all cached media files in the media player.
   *
   * This method does not delete cached media files that are currently being played.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See MediaPlayerReason.
   */
  abstract removeAllCaches(): number;

  /**
   * Deletes the least recently used cached media file in the media player.
   *
   * When cached media files occupy too much space, you can call this method to clean up the cache. After calling this method, the SDK deletes the least recently used cached media file. When you call this method to delete a cached media file, the currently playing cached media file will not be deleted.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See MediaPlayerReason.
   */
  abstract removeOldCache(): number;

  /**
   * Deletes a specified cached media file.
   *
   * This method does not delete cached media files that are currently being played.
   *
   * @param uri The URI (Uniform Resource Identifier) of the cached file to delete. Used to identify the media file.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See MediaPlayerReason.
   */
  abstract removeCacheByUri(uri: string): number;

  /**
   * Sets the storage path for media files to be cached.
   *
   * This method must be called after initializing IRtcEngine.
   *
   * @param path The absolute path where cached files are stored. Ensure the specified directory exists and is writable.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See MediaPlayerReason.
   */
  abstract setCacheDir(path: string): number;

  /**
   * Sets the maximum number of cached media files.
   *
   * @param count The maximum number of media files that can be cached. The default value is 1000.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See MediaPlayerReason.
   */
  abstract setMaxCacheFileCount(count: number): number;

  /**
   * Sets the maximum total cache size for media files.
   *
   * @param cacheSize The maximum total cache size for media files, in bytes. The default is 1 GB.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See MediaPlayerReason.
   */
  abstract setMaxCacheFileSize(cacheSize: number): number;

  /**
   * Sets whether to enable the automatic cache file removal feature.
   *
   * When automatic cache file removal is enabled, if the number or size of cached media files in the player exceeds the set limit, the SDK automatically removes the least recently used cached file.
   *
   * @param enable Whether to automatically remove cached files: true : Enable automatic cache file removal. false : (Default) Disable automatic cache file removal.
   *
   * @returns
   * 0: Success.
   *  < 0: Failure. See MediaPlayerReason.
   */
  abstract enableAutoRemoveCache(enable: boolean): number;

  /**
   * Gets the storage path of cached files.
   *
   * If you do not call the setCacheDir method to customize the cache file storage path before calling this method, it returns the SDK's default cache file storage path.
   *
   * @param length Input parameter. The maximum length of the cache file storage path string.
   *
   * @returns
   * On success, returns the storage path of the cached file.
   *  < 0: Failure. See MediaPlayerReason.
   */
  abstract getCacheDir(length: number): string;

  /**
   * Gets the maximum number of cached files set.
   *
   * The SDK's default maximum number of cached files is 1000.
   *
   * @returns
   * > 0: Success. Returns the maximum number of cached files.
   *  < 0: Failure. See MediaPlayerReason.
   */
  abstract getMaxCacheFileCount(): number;

  /**
   * Gets the upper limit of the total cache size for cached files.
   *
   * The SDK's default upper limit for the total cache size of cached files is 1GB. You can call the setMaxCacheFileSize method to customize the total cache size limit.
   *
   * @returns
   * > 0: Success. Returns the total cache size limit of cached files, in bytes.
   *  < 0: Failure. See MediaPlayerReason.
   */
  abstract getMaxCacheFileSize(): number;

  /**
   * Gets the total number of currently cached media files.
   *
   * @returns
   * ≥ 0: Success. Returns the total number of currently cached media files.
   *  < 0: Failure. See MediaPlayerReason.
   */
  abstract getCacheFileCount(): number;
}

/**
 * Video data observer for media player.
 *
 * You can call registerVideoFrameObserver to register or unregister the IMediaPlayerVideoFrameObserver observer.
 */
export interface IMediaPlayerVideoFrameObserver {
  /**
   * Callback triggered when a video frame is received.
   *
   * After registering the video observer, this callback is triggered each time a video frame is received to report video frame information.
   * It is recommended to implement this callback using the C++ API.
   *
   * @param frame Video frame information. See VideoFrame.
   */
  onFrame?(frame: VideoFrame): void;
}
