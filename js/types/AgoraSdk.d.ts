export type AgoraNetworkQuality = 
  0 | // unknown
  1 | // excellent
  2 | // good
  3 | // poor
  4 | // bad
  5 | // very bad
  6  //down 




export interface RtcStats {
  duration: number,
  txBytes: number,
  rxBytes: number,
  txKBitRate: number,
  rxKBitRate: number,
  rxAudioKBitRate: number,
  txAudioKBitRate: number,
  rxVideoKBitRate: number,
  txVideoKBitRate: number,
  userCount: number,
  cpuAppUsage: number,
  cpuTotalUsage: number,
}

export interface LocalVideoStats {
  sentBitrate: number,
  sentFrameRate: number,
}

export interface RemoteVideoStats {
  uid: number
  delay: number
  width: number,
  height: number,
  receivedBitrate: number,
  receivedFrameRate: number
  /**
   * 0 for high stream and 1 for low stream
   */
  rxStreamType: 0 | 1,
}
/**
 * interface for c++ addon (.node)
 */
export interface NodeRtcEngine {
  onEvent(event: string, callback: Function): void,
  unsubscribe(uid: number): void
}

/**
 * interface for js api
 */
export interface IAgoraRtcEngine {
  on(evt: 'apierror', cb: (api: string) => void): void,
  on(evt: 'apicallexecuted', cb: (api: string, err: number) => void): void,
  on(evt: 'warning', cb: (warn: number, msg: string) => void): void,
  on(evt: 'error', cb: (err: number, msg: string) => void): void,
  on(evt: 'joinedchannel', cb: (
    channel: string, uid: number, elapsed: number
  ) => void): void,
  on(evt: 'rejoinedchannel', cb: (
    channel: string, uid: number, elapsed: number
  ) => void): void,
  on(evt: 'audioquality', cb: (
    uid: number, quality: AgoraNetworkQuality, delay: number, lost: number
  ) => void): void,
  on(evt: 'audiovolumeindication', cb: (
    uid: number,
    volume: number,
    speakerNumber: number,
    totalVolume: number
  ) => void): void,
  on(evt: 'leavechannel', cb: () => void): void,
  on(evt: 'rtcstats', cb: (stats: RtcStats) => void): void,
  on(evt: 'localvideostats', cb: (stats: LocalVideoStats) => void): void,
  on(evt: 'remotevideostats', cb: (stats: RemoteVideoStats) => void): void,
  on(evt: 'audiodevicestatechanged', cb: (
    deviceId: string,
    deviceType: number,
    deviceState: number,
  ) => void): void,
  on(evt: 'audiomixingfinished', cb: () => void): void,
  on(evt: 'remoteaudiomixingbegin', cb: () => void): void,
  on(evt: 'remoteaudiomixingend', cb: () => void): void,
  on(evt: 'audioeffectfinished', cb: (soundId: number) => void): void,
  on(evt: 'videodevicestatechanged', cb: (
    deviceId: string,
    deviceType: number,
    deviceState: number,
  ) => void): void,
  on(evt: 'networkquality', cb: (
    uid: number, 
    txquality: AgoraNetworkQuality, 
    rxquality: AgoraNetworkQuality
  ) => void): void,
  on(evt: 'lastmilequality', cb: (quality: AgoraNetworkQuality) => void): void,
  on(evt: 'firstlocalvideoframe', cb: (
    width: number, 
    height: number, 
    elapsed: number
  ) => void): void,
  on(evt: 'firstremotevideodecoded', cb: (
    uid: number,
    elapsed: number,
  ) => void): void,
  on(evt: 'videosizechanged', cb: (
    uid: number, 
    width: number, 
    height: number, 
    rotation: number
  ) => void): void,
  on(evt: 'firstremotevideoframe', cb: (
    uid: number,
    width: number,
    height: number,
    elapsed: number
  ) => void): void,
  on(evt: 'userjoined', cb: (uid: number, elapsed: number) => void): void,
  on(evt: 'removestream', cb: (uid: number, reason: number) => void): void,
  on(evt: 'usermuteaudio', cb: (uid: number, muted: boolean) => void): void,
  on(evt: 'usermutevideo', cb: (uid: number, muted: boolean) => void): void,
  on(evt: 'userenablevideo', cb: (uid: number, enabled: boolean) => void): void,
  on(evt: 'userenablelocalvideo', cb: (uid: number, enabled: boolean) => void): void,
  on(evt: 'cameraready', cb: () => void): void,
  on(evt: 'videostopped', cb: () => void): void,
  on(evt: 'connectionlost', cb: () => void): void,
  on(evt: 'connectioninterrupted', cb: () => void): void,
  on(evt: 'connectionbanned', cb: () => void): void,
  // tbd
  on(evt: 'refreshrecordingservicestatus', cb: () => void): void,
  on(evt: 'streammessage', cb: (
    uid: number,
    streamId: number,
    msg: string,
    len: number
  ) => void): void,
  on(evt: 'streammessageerror', cb: (
    uid: number,
    streamId: number,
    code: number,
    missed: number,
    cached: number
  ) => void): void,
  on(evt: 'mediaenginestartcallsuccess', cb: () => void): void,
  on(evt: 'requestchannelkey', cb: () => void): void,
  on(evt: 'fristlocalaudioframe', cb: (elapsed: number) => void): void,
  on(evt: 'firstremoteaudioframe', cb: (uid: number, elapsed: number) => void): void,
  on(evt: 'activespeaker', cb: (uid: number) => void): void,
  on(evt: 'clientrolechanged', cb: () => void): void,
  on(evt: 'cameraready', cb: () => void): void,
  on(evt: 'cameraready', cb: () => void): void,
}

