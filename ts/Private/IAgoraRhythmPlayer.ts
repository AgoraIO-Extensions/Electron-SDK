import './extension/IAgoraRhythmPlayerExtension';

/**
 * State of the virtual metronome.
 */
export enum RhythmPlayerStateType {
  /**
   * 810: The virtual metronome is not started or has been stopped.
   */
  RhythmPlayerStateIdle = 810,
  /**
   * 811: Opening the beat audio file.
   */
  RhythmPlayerStateOpening = 811,
  /**
   * 812: Decoding the beat audio file.
   */
  RhythmPlayerStateDecoding = 812,
  /**
   * 813: Playing the beat audio file.
   */
  RhythmPlayerStatePlaying = 813,
  /**
   * 814: Failed to start the virtual metronome. You can troubleshoot the issue using the reported error code errorCode, or try restarting the virtual metronome.
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
 * Virtual metronome configuration.
 */
export class AgoraRhythmPlayerConfig {
  /**
   * Number of beats per measure, range [1,9]. Default is 4, meaning 1 strong beat and 3 weak beats per measure.
   */
  beatsPerMeasure?: number;
  /**
   * Tempo (beats per minute), range [60,360]. Default is 60, meaning 60 beats per minute.
   */
  beatsPerMinute?: number;
}
