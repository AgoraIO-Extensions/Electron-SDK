import './extension/IAgoraRhythmPlayerExtension';
/**
 * @ignore
 */
export enum RhythmPlayerStateType {
  /**
   * @ignore
   */
  RhythmPlayerStateIdle = 810,
  /**
   * @ignore
   */
  RhythmPlayerStateOpening = 811,
  /**
   * @ignore
   */
  RhythmPlayerStateDecoding = 812,
  /**
   * @ignore
   */
  RhythmPlayerStatePlaying = 813,
  /**
   * @ignore
   */
  RhythmPlayerStateFailed = 814,
}

/**
 * @ignore
 */
export enum RhythmPlayerErrorType {
  /**
   * @ignore
   */
  RhythmPlayerErrorOk = 0,
  /**
   * @ignore
   */
  RhythmPlayerErrorFailed = 1,
  /**
   * @ignore
   */
  RhythmPlayerErrorCanNotOpen = 801,
  /**
   * @ignore
   */
  RhythmPlayerErrorCanNotPlay = 802,
  /**
   * @ignore
   */
  RhythmPlayerErrorFileOverDurationLimit = 803,
}

/**
 * The metronome configuration.
 */
export class AgoraRhythmPlayerConfig {
  beatsPerMeasure?: number;
  beatsPerMinute?: number;
}
