
/*
 * TODO(doc)
 */
export enum RhythmPlayerStateType {
/*
 * TODO(doc)
 */
RhythmPlayerStateIdle = 810,
/*
 * TODO(doc)
 */
RhythmPlayerStateOpening = 811,
/*
 * TODO(doc)
 */
RhythmPlayerStateDecoding = 812,
/*
 * TODO(doc)
 */
RhythmPlayerStatePlaying = 813,
/*
 * TODO(doc)
 */
RhythmPlayerStateFailed = 814,
}

/*
 * TODO(doc)
 */
export enum RhythmPlayerErrorType {
/*
 * TODO(doc)
 */
RhythmPlayerErrorOk = 0,
/*
 * TODO(doc)
 */
RhythmPlayerErrorFailed = 1,
/*
 * TODO(doc)
 */
RhythmPlayerErrorCanNotOpen = 801,
/*
 * TODO(doc)
 */
RhythmPlayerErrorCanNotPlay = 802,
/*
 * TODO(doc)
 */
RhythmPlayerErrorFileOverDurationLimit = 803,
}

/*
 * TODO(doc)
 */
export class AgoraRhythmPlayerConfig {
/*
 * TODO(doc)
 */
  beatsPerMeasure?: number
  /*
   * TODO(doc)
   */
  beatsPerMinute?: number
}
