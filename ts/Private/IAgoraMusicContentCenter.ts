import './extension/IAgoraMusicContentCenterExtension';
import { IMediaPlayer } from './IAgoraMediaPlayer';

/**
 * @ignore
 */
export enum MusicPlayMode {
  /**
   * @ignore
   */
  KMusicPlayModeOriginal = 0,
  /**
   * @ignore
   */
  KMusicPlayModeAccompany = 1,
  /**
   * @ignore
   */
  KMusicPlayModeLeadSing = 2,
}

/**
 * @ignore
 */
export enum PreloadStatusCode {
  /**
   * @ignore
   */
  KPreloadStatusCompleted = 0,
  /**
   * @ignore
   */
  KPreloadStatusFailed = 1,
  /**
   * @ignore
   */
  KPreloadStatusPreloading = 2,
  /**
   * @ignore
   */
  KPreloadStatusRemoved = 3,
}

/**
 * @ignore
 */
export enum MusicContentCenterStatusCode {
  /**
   * @ignore
   */
  KMusicContentCenterStatusOk = 0,
  /**
   * @ignore
   */
  KMusicContentCenterStatusErr = 1,
  /**
   * @ignore
   */
  KMusicContentCenterStatusErrGateway = 2,
  /**
   * @ignore
   */
  KMusicContentCenterStatusErrPermissionAndResource = 3,
  /**
   * @ignore
   */
  KMusicContentCenterStatusErrInternalDataParse = 4,
  /**
   * @ignore
   */
  KMusicContentCenterStatusErrMusicLoading = 5,
  /**
   * @ignore
   */
  KMusicContentCenterStatusErrMusicDecryption = 6,
  /**
   * @ignore
   */
  KMusicContentCenterStatusErrHttpInternalError = 7,
}

/**
 * @ignore
 */
export class MusicChartInfo {
  chartName?: string;
  id?: number;
}

/**
 * @ignore
 */
export enum MusicCacheStatusType {
  /**
   * @ignore
   */
  MusicCacheStatusTypeCached = 0,
  /**
   * @ignore
   */
  MusicCacheStatusTypeCaching = 1,
}

/**
 * @ignore
 */
export class MusicCacheInfo {
  songCode?: number;
  status?: MusicCacheStatusType;
}

/**
 * @ignore
 */
export abstract class MusicChartCollection {
  /**
   * @ignore
   */
  abstract getCount(): number;

  /**
   * @ignore
   */
  abstract get(index: number): MusicChartInfo;
}

/**
 * @ignore
 */
export class MvProperty {
  resolution?: string;
  bandwidth?: string;
}

/**
 * The climax parts of the music.
 */
export class ClimaxSegment {
  startTimeMs?: number;
  endTimeMs?: number;
}

/**
 * @ignore
 */
export class Music {
  songCode?: number;
  name?: string;
  singer?: string;
  poster?: string;
  releaseTime?: string;
  durationS?: number;
  type?: number;
  pitchType?: number;
  lyricCount?: number;
  lyricList?: number[];
  climaxSegmentCount?: number;
  climaxSegmentList?: ClimaxSegment[];
  mvPropertyCount?: number;
  mvPropertyList?: MvProperty[];
}

/**
 * @ignore
 */
export abstract class MusicCollection {
  /**
   * @ignore
   */
  abstract getCount(): number;

  /**
   * @ignore
   */
  abstract getTotal(): number;

  /**
   * @ignore
   */
  abstract getPage(): number;

  /**
   * @ignore
   */
  abstract getPageSize(): number;

  /**
   * @ignore
   */
  abstract getMusic(index: number): Music;
}

/**
 * @ignore
 */
export interface IMusicContentCenterEventHandler {
  /**
   * @ignore
   */
  onMusicChartsResult?(
    requestId: string,
    result: MusicChartInfo[],
    errorCode: MusicContentCenterStatusCode
  ): void;

  /**
   * @ignore
   */
  onMusicCollectionResult?(
    requestId: string,
    result: MusicCollection,
    errorCode: MusicContentCenterStatusCode
  ): void;

  /**
   * @ignore
   */
  onLyricResult?(
    requestId: string,
    songCode: number,
    lyricUrl: string,
    errorCode: MusicContentCenterStatusCode
  ): void;

  /**
   * 音乐资源的详细信息回调。
   *
   * 当你调用 getSongSimpleInfo 获取某一音乐资源的详细信息后，SDK 会触发该回调。
   *
   * @param reason 音乐内容中心的请求状态码，详见 MusicContentCenterStateReason 。
   * @param requestId The request ID. 本次请求的唯一标识。
   * @param songCode The code of the music, which is an unique identifier of the music.
   * @param simpleInfo 音乐资源的相关信息，包含下列内容：
   *  副歌片段的开始和结束的时间（ms）
   *  副歌片段的歌词下载地址
   *  副歌片段时长（ms）
   *  歌曲名称
   *  歌手名
   */
  onSongSimpleInfoResult?(
    requestId: string,
    songCode: number,
    simpleInfo: string,
    errorCode: MusicContentCenterStatusCode
  ): void;

  /**
   * @ignore
   */
  onPreLoadEvent?(
    requestId: string,
    songCode: number,
    percent: number,
    lyricUrl: string,
    status: PreloadStatusCode,
    errorCode: MusicContentCenterStatusCode
  ): void;
}

/**
 * @ignore
 */
export class MusicContentCenterConfiguration {
  appId?: string;
  token?: string;
  mccUid?: number;
  maxCacheSize?: number;
  mccDomain?: string;
}

/**
 * @ignore
 */
export abstract class IMusicPlayer extends IMediaPlayer {
  /**
   * @ignore
   */
  abstract setPlayMode(mode: MusicPlayMode): number;

  /**
   * @ignore
   */
  abstract openWithSongCode(songCode: number, startPos?: number): number;
}

/**
 * @ignore
 */
export abstract class IMusicContentCenter {
  /**
   * @ignore
   */
  abstract initialize(configuration: MusicContentCenterConfiguration): number;

  /**
   * @ignore
   */
  abstract renewToken(token: string): number;

  /**
   * @ignore
   */
  abstract release(): void;

  /**
   * @ignore
   */
  abstract registerEventHandler(
    eventHandler: IMusicContentCenterEventHandler
  ): number;

  /**
   * @ignore
   */
  abstract unregisterEventHandler(): number;

  /**
   * @ignore
   */
  abstract createMusicPlayer(): IMusicPlayer;

  /**
   * @ignore
   */
  abstract destroyMusicPlayer(musicPlayer: IMusicPlayer): number;

  /**
   * @ignore
   */
  abstract getMusicCharts(): string;

  /**
   * @ignore
   */
  abstract getMusicCollectionByMusicChartId(
    musicChartId: number,
    page: number,
    pageSize: number,
    jsonOption?: string
  ): string;

  /**
   * @ignore
   */
  abstract searchMusic(
    keyWord: string,
    page: number,
    pageSize: number,
    jsonOption?: string
  ): string;

  /**
   * @ignore
   */
  abstract preload(songCode: number): string;

  /**
   * @ignore
   */
  abstract removeCache(songCode: number): number;

  /**
   * @ignore
   */
  abstract getCaches(): { cacheInfo: MusicCacheInfo[]; cacheInfoSize: number };

  /**
   * @ignore
   */
  abstract isPreloaded(songCode: number): boolean;

  /**
   * @ignore
   */
  abstract getLyric(songCode: number, lyricType?: number): string;

  /**
   * @ignore
   */
  abstract getSongSimpleInfo(songCode: number): string;

  /**
   * @ignore
   */
  abstract getInternalSongCode(songCode: number, jsonOption: string): number;
}
