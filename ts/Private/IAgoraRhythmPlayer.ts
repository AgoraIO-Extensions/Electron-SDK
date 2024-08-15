import './extension/IAgoraRhythmPlayerExtension';
/**
 * Virtual metronome state.
 */
export enum RhythmPlayerStateType {
  /**
   * (810): The virtual metronome is not enabled or disabled already.
   */
  RhythmPlayerStateIdle = 810,
  /**
   * 811: Opening the beat files.
   */
  RhythmPlayerStateOpening = 811,
  /**
   * 812: Decoding the beat files.
   */
  RhythmPlayerStateDecoding = 812,
  /**
   * 813: The beat files are playing.
   */
  RhythmPlayerStatePlaying = 813,
  /**
   * 814: Failed to start virtual metronome. You can use the reported errorCode to troubleshoot the cause of the error, or you can try to start the virtual metronome again.
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
