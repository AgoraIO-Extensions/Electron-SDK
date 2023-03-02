import './extension/IAgoraMusicContentCenterExtension';
import { IMediaPlayer } from './IAgoraMediaPlayer';
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
    lyricUrl: string,
    errorCode: MusicContentCenterStatusCode
  ): void;

  /**
   * @ignore
   */
  onPreLoadEvent?(
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
}

/**
 * @ignore
 */
export abstract class IMusicPlayer extends IMediaPlayer {
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
    requestId: string,
    keyWord: string,
    page: number,
    pageSize: number,
    jsonOption?: string
  ): number;

  /**
   * @ignore
   */
  abstract preload(songCode: number, jsonOption?: string): number;

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
  abstract isPreloaded(songCode: number): number;

  /**
   * @ignore
   */
  abstract getLyric(songCode: number, lyricType?: number): string;
}
