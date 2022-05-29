import { PlayerStreamInfo, MediaPlayerState, MediaPlayerError, MediaPlayerEvent, PlayerPreloadEvent, SrcInfo, PlayerUpdatedInfo } from './AgoraMediaPlayerTypes'
import { IAudioFrameObserver } from './AgoraMediaBase'

export abstract class IMediaPlayerCustomDataProvider {
abstract onReadData(buf: number[], bufSize: number): number;

abstract onSeek(offset: number, whence: number): number;
}

export abstract class IMediaPlayerSource {
abstract getSourceId(): number;

abstract open(url: string, startPos: number): number;

abstract openWithCustomSource(startPos: number, provider: IMediaPlayerCustomDataProvider): number;

abstract play(): number;

abstract pause(): number;

abstract stop(): number;

abstract resume(): number;

abstract seek(newPos: number): number;

abstract getDuration(): number;

abstract getPlayPosition(): number;

abstract getStreamCount(): number;

abstract getStreamInfo(index: number): PlayerStreamInfo;

abstract setLoopCount(loopCount: number): number;

abstract muteAudio(audioMute: boolean): number;

abstract isAudioMuted(): boolean;

abstract muteVideo(audioMute: boolean): number;

abstract isVideoMuted(): boolean;

abstract setPlaybackSpeed(speed: number): number;

abstract selectAudioTrack(index: number): number;

abstract setPlayerOption(key: string, value: number): number;

abstract setPlayerOption2(key: string, value: string): number;

abstract takeScreenshot(filename: string): number;

abstract selectInternalSubtitle(index: number): number;

abstract setExternalSubtitle(url: string): number;

abstract getState(): MediaPlayerState;

abstract registerPlayerSourceObserver(observer: IMediaPlayerSourceObserver): number;

abstract unregisterPlayerSourceObserver(observer: IMediaPlayerSourceObserver): number;

abstract registerAudioFrameObserver(observer: IAudioFrameObserver): number;

abstract unregisterAudioFrameObserver(observer: IAudioFrameObserver): number;

abstract openWithAgoraCDNSrc(src: string, startPos: number): number;

abstract getAgoraCDNLineCount(): number;

abstract switchAgoraCDNLineByIndex(index: number): number;

abstract getCurrentAgoraCDNIndex(): number;

abstract enableAutoSwitchAgoraCDN(enable: boolean): number;

abstract renewAgoraCDNSrcToken(token: string, ts: number): number;

abstract switchAgoraCDNSrc(src: string, syncPts?: boolean): number;

abstract switchSrc(src: string, syncPts: boolean): number;

abstract preloadSrc(src: string, startPos: number): number;

abstract unloadSrc(src: string): number;

abstract playPreloadedSrc(src: string): number;
}

export abstract class IMediaPlayerSourceObserver {
  onPlayerSourceStateChanged?(state: MediaPlayerState, ec: MediaPlayerError): void;

  onPositionChanged?(position: number): void;

  onPlayerEvent?(eventCode: MediaPlayerEvent, elapsedTime: number, message: string): void;

  onMetaData?(data: number[], length: number): void;

  onPlayBufferUpdated?(playCachedBuffer: number): void;

  onPreloadEvent?(src: string, event: PlayerPreloadEvent): void;

  onCompleted?(): void;

  onAgoraCDNTokenWillExpire?(): void;

  onPlayerSrcInfoChanged?(from: SrcInfo, to: SrcInfo): void;

  onPlayerInfoUpdated?(info: PlayerUpdatedInfo): void;

  onAudioVolumeIndication?(volume: number): void;
}
