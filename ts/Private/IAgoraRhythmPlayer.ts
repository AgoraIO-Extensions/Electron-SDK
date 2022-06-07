
export enum RhythmPlayerStateType {
RhythmPlayerStateIdle = 810,
RhythmPlayerStateOpening = 811,
RhythmPlayerStateDecoding = 812,
RhythmPlayerStatePlaying = 813,
RhythmPlayerStateFailed = 814,
}

export enum RhythmPlayerErrorType {
RhythmPlayerErrorOk = 0,
RhythmPlayerErrorFailed = 1,
RhythmPlayerErrorCanNotOpen = 801,
RhythmPlayerErrorCanNotPlay = 802,
RhythmPlayerErrorFileOverDurationLimit = 803,
}

export class AgoraRhythmPlayerConfig {
  beatsPerMeasure?: number
  beatsPerMinute?: number
  static fromJSON (json: any): AgoraRhythmPlayerConfig {
    const obj = new AgoraRhythmPlayerConfig()
    obj.beatsPerMeasure = json.beatsPerMeasure
    obj.beatsPerMinute = json.beatsPerMinute
    return obj
  }

  toJSON? () {
    return {
      beatsPerMeasure: this.beatsPerMeasure,
      beatsPerMinute: this.beatsPerMinute
    }
  }
}
