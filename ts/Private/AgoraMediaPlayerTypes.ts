import './extension/AgoraMediaPlayerTypesExtension';

/**
 * Player states.
 */
export enum MediaPlayerState {
  /**
   * 0: Default state. The player returns this state before opening a media file and after playback ends.
   */
  PlayerStateIdle = 0,
  /**
   * 1: Opening media file.
   */
  PlayerStateOpening = 1,
  /**
   * 2: Media file opened successfully.
   */
  PlayerStateOpenCompleted = 2,
  /**
   * 3: Playing.
   */
  PlayerStatePlaying = 3,
  /**
   * 4: Paused.
   */
  PlayerStatePaused = 4,
  /**
   * 5: Playback completed.
   */
  PlayerStatePlaybackCompleted = 5,
  /**
   * 6: Loop playback ended.
   */
  PlayerStatePlaybackAllLoopsCompleted = 6,
  /**
   * 7: Playback stopped.
   */
  PlayerStateStopped = 7,
  /**
   * @ignore
   */
  PlayerStatePausingInternal = 50,
  /**
   * @ignore
   */
  PlayerStateStoppingInternal = 51,
  /**
   * @ignore
   */
  PlayerStateSeekingInternal = 52,
  /**
   * @ignore
   */
  PlayerStateGettingInternal = 53,
  /**
   * @ignore
   */
  PlayerStateNoneInternal = 54,
  /**
   * @ignore
   */
  PlayerStateDoNothingInternal = 55,
  /**
   * @ignore
   */
  PlayerStateSetTrackInternal = 56,
  /**
   * 100: Playback failed.
   */
  PlayerStateFailed = 100,
}

/**
 * Reason for player state change.
 */
export enum MediaPlayerReason {
  /**
   * 0: No error.
   */
  PlayerReasonNone = 0,
  /**
   * -1: Invalid arguments.
   */
  PlayerReasonInvalidArguments = -1,
  /**
   * -2: Internal error.
   */
  PlayerReasonInternal = -2,
  /**
   * -3: No resource.
   */
  PlayerReasonNoResource = -3,
  /**
   * -4: Invalid resource.
   */
  PlayerReasonInvalidMediaSource = -4,
  /**
   * -5: Unknown media stream type.
   */
  PlayerReasonUnknownStreamType = -5,
  /**
   * -6: Object not initialized.
   */
  PlayerReasonObjNotInitialized = -6,
  /**
   * -7: Codec not supported by decoder.
   */
  PlayerReasonCodecNotSupported = -7,
  /**
   * -8: Invalid renderer.
   */
  PlayerReasonVideoRenderFailed = -8,
  /**
   * -9: Internal player state error.
   */
  PlayerReasonInvalidState = -9,
  /**
   * -10: URL not found.
   */
  PlayerReasonUrlNotFound = -10,
  /**
   * -11: Invalid connection between player and Agora server.
   */
  PlayerReasonInvalidConnectionState = -11,
  /**
   * -12: Insufficient data in playback buffer.
   */
  PlayerReasonSrcBufferUnderflow = -12,
  /**
   * -13: Playback interrupted abnormally and ended.
   */
  PlayerReasonInterrupted = -13,
  /**
   * -14: API call not supported by the SDK.
   */
  PlayerReasonNotSupported = -14,
  /**
   * @ignore
   */
  PlayerReasonTokenExpired = -15,
  /**
   * @ignore
   */
  PlayerReasonIpExpired = -16,
  /**
   * -17: Unknown error.
   */
  PlayerReasonUnknown = -17,
}

/**
 * Media stream types.
 */
export enum MediaStreamType {
  /**
   * 0: Unknown type.
   */
  StreamTypeUnknown = 0,
  /**
   * 1: Video stream.
   */
  StreamTypeVideo = 1,
  /**
   * 2: Audio stream.
   */
  StreamTypeAudio = 2,
  /**
   * 3: Subtitle stream.
   */
  StreamTypeSubtitle = 3,
}

/**
 * Player events.
 */
export enum MediaPlayerEvent {
  /**
   * 0: Start seeking.
   */
  PlayerEventSeekBegin = 0,
  /**
   * 1: Seek completed.
   */
  PlayerEventSeekComplete = 1,
  /**
   * 2: Seek error.
   */
  PlayerEventSeekError = 2,
  /**
   * 5: Current audio track changed.
   */
  PlayerEventAudioTrackChanged = 5,
  /**
   * 6: The current buffered data is insufficient for playback.
   */
  PlayerEventBufferLow = 6,
  /**
   * 7: The current buffered data is just enough for playback.
   */
  PlayerEventBufferRecover = 7,
  /**
   * 8: Audio or video stuttering occurred.
   */
  PlayerEventFreezeStart = 8,
  /**
   * 9: Audio and video stuttering stopped.
   */
  PlayerEventFreezeStop = 9,
  /**
   * 10: Start switching media resource.
   */
  PlayerEventSwitchBegin = 10,
  /**
   * 11: Media resource switch completed.
   */
  PlayerEventSwitchComplete = 11,
  /**
   * 12: Media resource switch error.
   */
  PlayerEventSwitchError = 12,
  /**
   * 13: First video frame rendered.
   */
  PlayerEventFirstDisplayed = 13,
  /**
   * 14: Reached the maximum number of cacheable files.
   */
  PlayerEventReachCacheFileMaxCount = 14,
  /**
   * 15: Reached the maximum size of cacheable files.
   */
  PlayerEventReachCacheFileMaxSize = 15,
  /**
   * @ignore
   */
  PlayerEventTryOpenStart = 16,
  /**
   * @ignore
   */
  PlayerEventTryOpenSucceed = 17,
  /**
   * @ignore
   */
  PlayerEventTryOpenFailed = 18,
}

/**
 * Events that occur during media resource preloading.
 */
export enum PlayerPreloadEvent {
  /**
   * 0: Begin preloading media resource.
   */
  PlayerPreloadEventBegin = 0,
  /**
   * 1: Media resource preloading completed.
   */
  PlayerPreloadEventComplete = 1,
  /**
   * 2: Error occurred during media resource preloading.
   */
  PlayerPreloadEventError = 2,
}

/**
 * All information about the player media stream.
 */
export class PlayerStreamInfo {
  /**
   * The index of the media stream.
   */
  streamIndex?: number;
  /**
   * The type of this media stream. See MediaStreamType.
   */
  streamType?: MediaStreamType;
  /**
   * The codec specification of this media stream.
   */
  codecName?: string;
  /**
   * The language of this media stream.
   */
  language?: string;
  /**
   * This parameter applies only to video streams and indicates the video frame rate (fps).
   */
  videoFrameRate?: number;
  /**
   * This parameter applies only to video streams and indicates the video bitrate (bps).
   */
  videoBitRate?: number;
  /**
   * This parameter applies only to video streams and indicates the video width (px).
   */
  videoWidth?: number;
  /**
   * This parameter applies only to video streams and indicates the video height (px).
   */
  videoHeight?: number;
  /**
   * This parameter applies only to video streams and indicates the rotation angle.
   */
  videoRotation?: number;
  /**
   * This parameter applies only to audio streams and indicates the audio sample rate (Hz).
   */
  audioSampleRate?: number;
  /**
   * This parameter applies only to audio streams and indicates the number of channels.
   */
  audioChannels?: number;
  /**
   * This parameter applies only to audio streams and indicates the number of bits per audio sample (bit).
   */
  audioBitsPerSample?: number;
  /**
   * The duration of the media stream (milliseconds).
   */
  duration?: number;
}

/**
 * Video bitrate information during media playback.
 */
export class SrcInfo {
  /**
   * Video bitrate during media playback (Kbps).
   */
  bitrateInKbps?: number;
  /**
   * Name of the media resource.
   */
  name?: string;
}

/**
 * Media metadata types.
 */
export enum MediaPlayerMetadataType {
  /**
   * 0: Unknown type.
   */
  PlayerMetadataTypeUnknown = 0,
  /**
   * 1: SEI (Supplemental Enhancement Information) type.
   */
  PlayerMetadataTypeSei = 1,
}

/**
 * Statistics of cached files.
 */
export class CacheStatistics {
  /**
   * Size of the media file being played, in bytes.
   */
  fileSize?: number;
  /**
   * Size of the cached data of the media file being played, in bytes.
   */
  cacheSize?: number;
  /**
   * Size of the media file downloaded during playback, in bytes.
   */
  downloadSize?: number;
}

/**
 * Information about the currently playing media resource.
 */
export class PlayerPlaybackStats {
  /**
   * Video frame rate, in fps.
   */
  videoFps?: number;
  /**
   * Video bitrate, in kbps.
   */
  videoBitrateInKbps?: number;
  /**
   * Audio bitrate, in kbps.
   */
  audioBitrateInKbps?: number;
  /**
   * Total bitrate of the media stream, in kbps.
   */
  totalBitrateInKbps?: number;
}

/**
 * Information related to the media player.
 */
export class PlayerUpdatedInfo {
  /**
   * @ignore
   */
  internalPlayerUuid?: string;
  /**
   * Device ID, identifies a device.
   */
  deviceId?: string;
  /**
   * Video height (pixel).
   */
  videoHeight?: number;
  /**
   * Video width (pixel).
   */
  videoWidth?: number;
  /**
   * Audio sample rate (Hz).
   */
  audioSampleRate?: number;
  /**
   * Number of audio channels.
   */
  audioChannels?: number;
  /**
   * Number of bits per audio sample (bit).
   */
  audioBitsPerSample?: number;
}

/**
 * Information and playback settings of the media file to be played.
 */
export class MediaSource {
  /**
   * URL of the media resource to be played.
   */
  url?: string;
  /**
   * URI (Uniform Resource Identifier) of the media file, used to identify the media file.
   */
  uri?: string;
  /**
   * Start playback position in milliseconds. Default is 0.
   */
  startPos?: number;
  /**
   * If you disable auto-play, call the play method after opening the media file to start playback. Whether to enable auto-play after opening the media file: true : (default) Enable auto-play. false : Disable auto-play.
   */
  autoPlay?: boolean;
  /**
   * The SDK currently supports caching for on-demand streams, but not for on-demand streams transmitted via HLS protocol.
   *  Before caching, pass a value to uri, otherwise the player uses the media file's url as the cache index.
   *  When real-time caching is enabled, the player pre-caches part of the media file being played to local storage. The next time you play the file, the player loads data from the cache, saving network traffic. The statistics of the cached media file are updated every second after playback starts. See CacheStatistics. Whether to enable real-time caching for this playback: true : Enable real-time caching. false : (default) Disable real-time caching.
   */
  enableCache?: boolean;
  /**
   * Whether to allow selecting different audio tracks during this playback: true : Allow selecting different audio tracks. false : (default) Do not allow selecting different audio tracks. If you need to set different audio tracks for local playback and publishing to remote, set this parameter to true and then call the selectMultiAudioTrack method to set the audio track.
   */
  enableMultiAudioTrack?: boolean;
  /**
   * If the media resource to be opened is a live or on-demand stream distributed via Agora Fusion CDN, pass the stream URL to url and set isAgoraSource to true. Otherwise, you do not need to set isAgoraSource. Whether the media resource opened is a live or on-demand stream distributed via Agora Fusion CDN: true : The media resource is distributed via Agora Fusion CDN. false : (default) The media resource is not distributed via Agora Fusion CDN.
   */
  isAgoraSource?: boolean;
  /**
   * isLiveSource should be set to true only when the media resource is a live stream to accelerate the opening speed. Whether the media resource opened is a live stream: true : Live stream. false : (default) Not a live stream. If the media resource is a live stream, it is recommended to set this parameter to true to speed up the opening of the live stream.
   */
  isLiveSource?: boolean;
}
