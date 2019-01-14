export type AgoraNetworkQuality = 
  0 | // unknown
  1 | // excellent
  2 | // good
  3 | // poor
  4 | // bad
  5 | // very bad
  6  //down 

/** 1 for broadcaster, 2 for audience */
export type ClientRoleType = 1 | 2 

/** 0 for high, 1 for low */
export type StreamType = 0 | 1

export type MediaDeviceType = 
  -1 | // Unknown device type
  0 | // Audio playback device
  1 | // Audio recording device
  2 | // Video renderer
  3 |  // Video capturer
  4 // Application audio playback device

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
  rxStreamType: StreamType,
}
/**
 * interface for c++ addon (.node)
 */
export interface NodeRtcEngine {
  initialize(appId: string): number,
  getVersion(): string,
  getErrorDescription(errorCode: number): string,
  joinChannel(
    token: string,
    channel: string,
    info: string,
    uid: number
  ): number,
  leaveChannel(): number,
  setHighQualityAudioParameters(
    fullband: boolean,
    stereo: boolean,
    fullBitrate: boolean
  ): number,
  setupLocalVideo(): number,
  subscribe(uid: number): number,
  setVideoRenderDimension(
    rendertype: number,
    uid: number,
    width: number,
    height: number
  ): void,
  setFPS(fps: number): void,
  setHighFPS(fps: number): void,
  addToHighVideo(uid: number),
  removeFromHighVideo(uid: number),
  renewToken(newToken: string): number,
  setChannelProfile(profile: number): number,
  setClientRole(role: ClientRoleType, permissionKey: string): number,
  startEchoTest(): number,
  stopEchoTest(): number,
  enableLastmileTest(): number,
  disableLastmileTest(): number,
  enableVideo(): number,
  disableVideo(): number,
  startPreview(): number,
  stopPreview(): number,
  setVideoProfile(profile: number, swapWidthAndHeight: boolean): number,
  setVideoEncoderConfiguration(
    width: number,
    height: number,
    fps: number,
    bitrate: 0 | 1, // 0 for standard and 1 for compatible
    minbitrate: -1, // changing this value is NOT recommended
    orientation: 0 | 1 | 2, // 0: auto, 1: horizontal, 2: vertical
  ): number,
  enableAudio(): number,
  disableAudio(): number,
  setAudioProfile(profile: number, scenario: number): number,
  setVideoQualityParameters(preferFrameRateOverImageQuality: boolean): number,
  setEncryptionSecret(secret: string): number,
  muteLocalAudioStream(mute: boolean): number,
  muteAllRemoteAudioStreams(mute: boolean): number,
  setDefaultMuteAllRemoteAudioStreams(mute: boolean): number,
  muteRemoteAudioStream(uid: number, mute: boolean): number,
  muteLocalVideoStream(mute: boolean): number,
  enableLocalVideo(enable: boolean): number,
  muteAllRemoteVideoStreams(mute: boolean): number,
  setDefaultMuteAllRemoteVideoStreams(mute: boolean): number,
  enableAudioVolumeIndication(interval: number, smooth: number): number,
  muteRemoteVideoStream(uid: number, mute: boolean): number,
  setInEarMonitoringVolume(volume: number): number,
  pauseAudio(): number,
  resumeAudio(): number,
  setLogFile(filepath: string): number,
  videoSourceSetLogFile(filepath: string): number,
  setLogFilter(filter: number): number,
  enableDualStreamMode(enable: boolean): number,
  setRemoteVideoStreamType(uid: number, streamType: StreamType): number,
  setRemoteDefaultVideoStreamType(streamType: StreamType): number,
  enableWebSdkInteroperability(enable: boolean): number,
  setLocalVideoMirrorMode(mirrorType: 0|1|2): number,
  setLocalVoicePitch(pitch: number): number,
  setLocalVoiceEqualization(bandFrequency: number, bandGain: number): number,
  setLocalVoiceReverb(reverbKey: number, value: number): number,
  setLocalPublishFallbackOption(option: 0|1|2): number,
  setRemoteSubscribeFallbackOption(option: 0|1|2): number,
  setExternalAudioSource(enabled: boolean, samplerate: number, channels: number): number,
  getVideoDevices(): Array<Object>,
  setVideoDevice(deviceId: string): number,
  getCurrentVideoDevice(): Object,
  startVideoDeviceTest(): number,
  stopVideoDeviceTest(): number,
  getAudioPlaybackDevices(): Array<Object>,
  setAudioPlaybackDevice(deviceId: string): number,
  getPlaybackDeviceInfo(deviceId: string, deviceName: string): number,
  getCurrentAudioPlaybackDevice(): Object,
  setAudioPlaybackVolume(volume: number): number,
  getAudioPlaybackVolume(): number,
  getAudioRecordingDevices(): Array<Object>,
  setAudioRecordingDevice(deviceId: string): number,
  getRecordingDeviceInfo(deviceId: string, deviceName: string): number,
  getCurrentAudioRecordingDevice(): Object,
  getAudioRecordingVolume(): number,
  setAudioRecordingVolume(volume: number): number,
  startAudioPlaybackDeviceTest(filepath: string): number,
  stopAudioPlaybackDeviceTest(): number,
  enableLoopbackRecording(enable: boolean): number,
  startAudioRecordingDeviceTest(indicateInterval: number): number,
  stopAudioRecordingDeviceTest(): number,
  getAudioPlaybackDeviceMute(): boolean,
  setAudioPlaybackDeviceMute(mute: boolean): number,
  getAudioRecordingDeviceMute(): boolean,
  setAudioRecordingDeviceMute(mute: boolean): number,
  videoSourceInitialize(appId: string): number,
  videoSourceEnableWebSdkInteroperability(enabled: boolean): number,
  videoSourceJoin(
    token: string,
    cname: string,
    info: string,
    uid: number
  ): number,
  videoSourceLeave(): number,
  videoSourceRenewToken(token: string): number,
  videoSourceSetChannelProfile(profile: number): number,
  videoSourceSetVideoProfile(profile: number, swapWidthAndHeight: boolean): number,
  getScreenWindowsInfo(): Array<Object>,
  startScreenCapture2(
    windowId: number,
    captureFreq: number,
    rect: {left: number, right: number, top: number, bottom: number},
    bitrate: number
  ): number,
  stopScreenCapture2(): number,
  videoSourceStartPreview(): number,
  videoSourceStopPreview(): number,
  videoSourceEnableDualStreamMode(enable: boolean): number, 
  videoSourceSetParameter(parameter: string): number,
  videoSourceRelease(): number,
  startScreenCapture(
    windowId: number,
    captureFreq: number,
    rect: {left: number, right: number, top: number, bottom: number},
    bitrate: number,
  ): number,
  stopScreenCapture(): number,
  updateScreenCaptureRegion(
    rect: {
      left: number,
      right: number,
      top: number,
      bottom: number
    }
  ): number,
  startAudioMixing(
    filepath: string,
    loopback: boolean,
    replace: boolean,
    cycle: number
  ): number,
  stopAudioMixing(): number,
  pauseAudioMixing(): number,
  resumeAudioMixing(): number,
  adjustAudioMixingVolume(volume: number): number,
  adjustAudioMixingPlayoutVolume(volume: number): number,
  adjustAudioMixingPublishVolume(volume: number): number,
  getAudioMixingDuration(): number,
  getAudioMixingCurrentPosition(): number,
  setAudioMixingPosition(position: number): number,
  setRecordingAudioFrameParameters(
    sampleRate: number,
    channel: 1|2,
    mode: 0|1|2,
    samplesPerCall: number
  ): number,
  setPlaybackAudioFrameParameters(
    sampleRate: number,
    channel: 1|2,
    mode: 0|1|2,
    samplesPerCall: number
  ): number,
  setMixedAudioFrameParameters(
    sampleRate: number,
    samplesPerCall: number
  ): number,
  createDataStream(reliable: boolean, ordered: boolean): number,
  sendStreamMessage(streamId: number, msg: string): number,
  getEffectsVolume(): number,
  setEffectsVolume(volume: number): number,
  setVolumeOfEffect(soundId: number, volume: number): number,
  playEffect(
    soundId: number,
    filePath: string,
    loopcount: number,
    pitch: number,
    pan: number,
    gain: number,
    publish: number
  ): number,
  stopEffect(soundId: number): number,
  preloadEffect(soundId: number, filePath: string): number,
  unloadEffect(soundId: number): number,
  pauseEffect(soundId: number): number,
  pauseAllEffects(): number,
  resumeEffect(soundId: number): number ,
  resumeAllEffects(): number,
  getCallId(): string,
  rate(callId: string, rating: number, desc: string): number,
  complain(callId: string, desc: string): number,
  setBool(key: string, value: boolean): number,
  setInt(key: string, value: number): number,
  setUInt(key: string, value: number): number,
  setNumber(key: string, value: number): number,
  setString(key: string, value: string): number
  setObject(key: string, value: string): number,
  getBool(key: string): boolean,
  getInt(key: string): number,
  getUInt(key: string): number,
  getNumber(key: string): number
  getString(key: string): string,
  getObject(key: string): string,
  getArray(key: string): string,
  setParameters(param: string): number,
  convertPath(path: string): string,
  setProfile(profile: string, merge: boolean): number,
  onEvent(event: string, callback: Function): void,
  unsubscribe(uid: number): number,
  registerDeliverFrame(callback: Function): number,
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
  on(evt: 'clientrolechanged', cb: (
    oldRole: ClientRoleType,
    newRole: ClientRoleType
  ) => void): void,
  on(evt: 'audiodevicevolumechanged', cb: (
    deviceType: MediaDeviceType,
    volume: number,
    muted: boolean
  ) => void): void,
  on(evt: 'videosourcejoinsuccess', cb: (uid: number) => void): void,
  on(evt: 'videosourcerequestnewtoken', cb: () => void): void,
  on(evt: 'videosourceleavechannel', cb: () => void): void,
  on(evt: 'cameraready', cb: () => void): void,
}

