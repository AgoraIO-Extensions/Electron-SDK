export declare type AgoraNetworkQuality = 0 | // unknown
1 | // excellent
2 | // good
3 | // poor
4 | // bad
5 | // very bad
6;
/** 1 for broadcaster, 2 for audience */
export declare type ClientRoleType = 1 | 2;
/** 0 for high, 1 for low */
export declare type StreamType = 0 | 1;
export declare type MediaDeviceType = -1 | // Unknown device type
0 | // Audio playback device
1 | // Audio recording device
2 | // Video renderer
3 | // Video capturer
4;
export interface TranscodingUser {
    /** stream uid */
    uid: number;
    /** x start positon of stream */
    x: number;
    /** y start positon of stream */
    y: number;
    /** selected width of stream */
    width: number;
    /** selected height of stream */
    height: number;
    /** zorder of the stream, [1,100] */
    zOrder: number;
    /** (double) transparency alpha of the stream, [0,1] */
    alpha: number;
    /**
     * - 0: (Default) Supports dual channels at most, depending on the upstream of the broadcaster.
     * - 1: The audio stream of the broadcaster uses the FL audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
     * - 2: The audio stream of the broadcaster uses the FC audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
     * - 3: The audio stream of the broadcaster uses the FR audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
     * - 4: The audio stream of the broadcaster uses the BL audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
     * - 5: The audio stream of the broadcaster uses the BR audio channel. If the upstream of the broadcaster uses multiple audio channels, these channels will be mixed into mono first.
     */
    audioChannel: number;
}
/** Transcoding Sets the CDN live audio/video transcoding settings. See LiveTranscoding. */
export interface TranscodingConfig {
    /** width of canvas */
    width: number;
    /** height of canvas */
    height: number;
    /** kbps value, for 1-1 mapping pls look at https://docs.agora.io/cn/Interactive%20Broadcast/API%20Reference/cpp/structagora_1_1rtc_1_1_video_encoder_configuration.html */
    videoBitrate: number;
    /** fps, default 15 */
    videoFrameRate: number;
    /** true for low latency, no video quality garanteed; false - high latency, video quality garanteed */
    lowLatency: boolean;
    /** Video GOP in frames, default 30 */
    videoGop: number;
    /**
     * - VIDEO_CODEC_PROFILE_BASELINE = 66
     * Baseline video codec profile. Generally used in video calls on mobile phones
     * - VIDEO_CODEC_PROFILE_MAIN = 77
     * Main video codec profile. Generally used in mainstream electronics such as MP4 players, portable video players, PSP, and iPads.
     * - VIDEO_CODEC_PROFILE_HIGH = 100
     * (Default) High video codec profile. Generally used in high-resolution broadcasts or television
     */
    videoCodecProfile: number;
    /**
     * RGB hex value. Value only, do not include a #. For example, 0xC0C0C0.
     * number color = (A & 0xff) << 24 | (R & 0xff) << 16 | (G & 0xff) << 8 | (B & 0xff)
     */
    backgroundColor: number;
    /** The number of users in the live broadcast */
    userCount: number;
    /**
     * - AUDIO_SAMPLE_RATE_32000 = 32000
     * - AUDIO_SAMPLE_RATE_44100 = 44100
     * - AUDIO_SAMPLE_RATE_48000 = 48000
     */
    audioSampleRate: number;
    /**
     * - 1: (Default) Mono
     * - 2: Two-channel stereo
     * - 3: Three-channel stereo
     * - 4: Four-channel stereo
     * - 5: Five-channel stereo
     * > A special player is required if you choose option 3, 4, or 5
     */
    audioChannels: number;
    watermark: {
        /**  url of the image */
        url: string;
        /** x start position of image */
        x: number;
        /** y start position of image */
        y: number;
        /** width of image */
        width: number;
        /** height of image */
        height: number;
    };
    /** transcodingusers array */
    transcodingUsers: Array<TranscodingUser>;
}
export interface InjectStreamConfig {
    /** Width of the added stream in the live broadcast. The default value is 0 (same width as the original stream) */
    width: number;
    /** Height of the added stream in the live broadcast. The default value is 0 (same height as the original stream) */
    height: number;
    /** Video bitrate of the added stream in the live broadcast. The default value is 400 Kbps. */
    videoBitrate: number;
    /** Video frame rate of the added stream in the live broadcast. The default value is 15 fps */
    videoFrameRate: number;
    /** Video GOP of the added stream in the live broadcast in frames. The default value is 30 fps */
    videoGop: number;
    /**
     * Audio-sampling rate of the added stream in the live broadcast: #AUDIO_SAMPLE_RATE_TYPE. The default value is 48000 Hz
     * @note Agora recommends setting the default value
     * - AUDIO_SAMPLE_RATE_32000 = 32000
     * - AUDIO_SAMPLE_RATE_44100 = 44100
     * - AUDIO_SAMPLE_RATE_48000 = 48000
     */
    audioSampleRate: number;
    /**
     * @note Agora recommends setting the default value
     * Audio bitrate of the added stream in the live broadcast. The default value is 48
     */
    audioBitrate: number;
    /**
     * @note Agora recommends setting the default value
     * - 1: (Default) Mono
     * - 2: Two-channel stereo
     */
    audioChannels: number;
}
export interface RtcStats {
    duration: number;
    txBytes: number;
    rxBytes: number;
    txKBitRate: number;
    rxKBitRate: number;
    rxAudioKBitRate: number;
    txAudioKBitRate: number;
    rxVideoKBitRate: number;
    txVideoKBitRate: number;
    userCount: number;
    cpuAppUsage: number;
    cpuTotalUsage: number;
}
export interface LocalVideoStats {
    sentBitrate: number;
    sentFrameRate: number;
}
export interface RemoteVideoStats {
    uid: number;
    delay: number;
    width: number;
    height: number;
    receivedBitrate: number;
    receivedFrameRate: number;
    /**
     * 0 for high stream and 1 for low stream
     */
    rxStreamType: StreamType;
}
export declare type RemoteVideoState = 1 | // running
2;
export declare type ConnectionState = 1 | // 1: The SDK is disconnected from Agora's edge server
2 | // 2: The SDK is connecting to Agora's edge server.
3 | // 3: The SDK is connected to Agora's edge server and has joined a channel. You can now publish or subscribe to a media stream in the channel.
4 | // 4: The SDK keeps rejoining the channel after being disconnected from a joined channel because of network issues.
5;
export declare type ConnectionChangeReason = 0 | // 0: The SDK is connecting to Agora's edge server.
1 | // 1: The SDK has joined the channel successfully.
2 | // 2: The connection between the SDK and Agora's edge server is interrupted.
3 | // 3: The connection between the SDK and Agora's edge server is banned by Agora's edge server.
4 | // 4: The SDK fails to join the channel for more than 20 minutes and stops reconnecting to the channel.
5;
/**
 * interface for c++ addon (.node)
 */
export interface NodeRtcEngine {
    initialize(appId: string): number;
    getVersion(): string;
    getErrorDescription(errorCode: number): string;
    joinChannel(token: string, channel: string, info: string, uid: number): number;
    leaveChannel(): number;
    setHighQualityAudioParameters(fullband: boolean, stereo: boolean, fullBitrate: boolean): number;
    setupLocalVideo(): number;
    subscribe(uid: number): number;
    setVideoRenderDimension(rendertype: number, uid: number, width: number, height: number): void;
    setFPS(fps: number): void;
    setHighFPS(fps: number): void;
    addToHighVideo(uid: number): any;
    removeFromHighVideo(uid: number): any;
    renewToken(newToken: string): number;
    setChannelProfile(profile: number): number;
    setClientRole(role: ClientRoleType, permissionKey: string): number;
    startEchoTest(): number;
    stopEchoTest(): number;
    enableLastmileTest(): number;
    disableLastmileTest(): number;
    enableVideo(): number;
    disableVideo(): number;
    startPreview(): number;
    stopPreview(): number;
    setVideoProfile(profile: number, swapWidthAndHeight: boolean): number;
    setVideoEncoderConfiguration(width: number, height: number, fps: number, bitrate: 0 | 1, // 0 for standard and 1 for compatible
    minbitrate: -1, // changing this value is NOT recommended
    orientation: 0 | 1 | 2): number;
    enableAudio(): number;
    disableAudio(): number;
    setAudioProfile(profile: number, scenario: number): number;
    setVideoQualityParameters(preferFrameRateOverImageQuality: boolean): number;
    setEncryptionSecret(secret: string): number;
    muteLocalAudioStream(mute: boolean): number;
    muteAllRemoteAudioStreams(mute: boolean): number;
    setDefaultMuteAllRemoteAudioStreams(mute: boolean): number;
    muteRemoteAudioStream(uid: number, mute: boolean): number;
    muteLocalVideoStream(mute: boolean): number;
    enableLocalVideo(enable: boolean): number;
    muteAllRemoteVideoStreams(mute: boolean): number;
    setDefaultMuteAllRemoteVideoStreams(mute: boolean): number;
    enableAudioVolumeIndication(interval: number, smooth: number): number;
    muteRemoteVideoStream(uid: number, mute: boolean): number;
    setInEarMonitoringVolume(volume: number): number;
    pauseAudio(): number;
    resumeAudio(): number;
    setLogFile(filepath: string): number;
    videoSourceSetLogFile(filepath: string): number;
    setLogFilter(filter: number): number;
    enableDualStreamMode(enable: boolean): number;
    setRemoteVideoStreamType(uid: number, streamType: StreamType): number;
    setRemoteDefaultVideoStreamType(streamType: StreamType): number;
    enableWebSdkInteroperability(enable: boolean): number;
    setLocalVideoMirrorMode(mirrorType: 0 | 1 | 2): number;
    setLocalVoicePitch(pitch: number): number;
    setLocalVoiceEqualization(bandFrequency: number, bandGain: number): number;
    setLocalVoiceReverb(reverbKey: number, value: number): number;
    setLocalPublishFallbackOption(option: 0 | 1 | 2): number;
    setRemoteSubscribeFallbackOption(option: 0 | 1 | 2): number;
    setExternalAudioSource(enabled: boolean, samplerate: number, channels: number): number;
    getVideoDevices(): Array<Object>;
    setVideoDevice(deviceId: string): number;
    getCurrentVideoDevice(): Object;
    startVideoDeviceTest(): number;
    stopVideoDeviceTest(): number;
    getAudioPlaybackDevices(): Array<Object>;
    setAudioPlaybackDevice(deviceId: string): number;
    getPlaybackDeviceInfo(deviceId: string, deviceName: string): number;
    getCurrentAudioPlaybackDevice(): Object;
    setAudioPlaybackVolume(volume: number): number;
    getAudioPlaybackVolume(): number;
    getAudioRecordingDevices(): Array<Object>;
    setAudioRecordingDevice(deviceId: string): number;
    getRecordingDeviceInfo(deviceId: string, deviceName: string): number;
    getCurrentAudioRecordingDevice(): Object;
    getAudioRecordingVolume(): number;
    setAudioRecordingVolume(volume: number): number;
    startAudioPlaybackDeviceTest(filepath: string): number;
    stopAudioPlaybackDeviceTest(): number;
    enableLoopbackRecording(enable: boolean): number;
    startAudioRecordingDeviceTest(indicateInterval: number): number;
    stopAudioRecordingDeviceTest(): number;
    getAudioPlaybackDeviceMute(): boolean;
    setAudioPlaybackDeviceMute(mute: boolean): number;
    getAudioRecordingDeviceMute(): boolean;
    setAudioRecordingDeviceMute(mute: boolean): number;
    videoSourceInitialize(appId: string): number;
    videoSourceEnableWebSdkInteroperability(enabled: boolean): number;
    videoSourceJoin(token: string, cname: string, info: string, uid: number): number;
    videoSourceLeave(): number;
    videoSourceRenewToken(token: string): number;
    videoSourceSetChannelProfile(profile: number): number;
    videoSourceSetVideoProfile(profile: number, swapWidthAndHeight: boolean): number;
    getScreenWindowsInfo(): Array<Object>;
    startScreenCapture2(windowId: number, captureFreq: number, rect: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    }, bitrate: number): number;
    stopScreenCapture2(): number;
    videoSourceStartPreview(): number;
    videoSourceStopPreview(): number;
    videoSourceEnableDualStreamMode(enable: boolean): number;
    videoSourceSetParameter(parameter: string): number;
    videoSourceRelease(): number;
    startScreenCapture(windowId: number, captureFreq: number, rect: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    }, bitrate: number): number;
    stopScreenCapture(): number;
    updateScreenCaptureRegion(rect: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    }): number;
    startAudioMixing(filepath: string, loopback: boolean, replace: boolean, cycle: number): number;
    stopAudioMixing(): number;
    pauseAudioMixing(): number;
    resumeAudioMixing(): number;
    adjustAudioMixingVolume(volume: number): number;
    adjustAudioMixingPlayoutVolume(volume: number): number;
    adjustAudioMixingPublishVolume(volume: number): number;
    getAudioMixingDuration(): number;
    getAudioMixingCurrentPosition(): number;
    setAudioMixingPosition(position: number): number;
    addPublishStreamUrl(url: string, transcodingEnabled: boolean): number;
    removePublishStreamUrl(url: string): number;
    setLiveTranscoding(transcoding: TranscodingConfig): number;
    addInjectStreamUrl(url: string, config: InjectStreamConfig): number;
    removeInjectStreamUrl(url: string): number;
    setRecordingAudioFrameParameters(sampleRate: number, channel: 1 | 2, mode: 0 | 1 | 2, samplesPerCall: number): number;
    setPlaybackAudioFrameParameters(sampleRate: number, channel: 1 | 2, mode: 0 | 1 | 2, samplesPerCall: number): number;
    setMixedAudioFrameParameters(sampleRate: number, samplesPerCall: number): number;
    createDataStream(reliable: boolean, ordered: boolean): number;
    sendStreamMessage(streamId: number, msg: string): number;
    getEffectsVolume(): number;
    setEffectsVolume(volume: number): number;
    setVolumeOfEffect(soundId: number, volume: number): number;
    playEffect(soundId: number, filePath: string, loopcount: number, pitch: number, pan: number, gain: number, publish: number): number;
    stopEffect(soundId: number): number;
    preloadEffect(soundId: number, filePath: string): number;
    unloadEffect(soundId: number): number;
    pauseEffect(soundId: number): number;
    pauseAllEffects(): number;
    resumeEffect(soundId: number): number;
    resumeAllEffects(): number;
    getCallId(): string;
    rate(callId: string, rating: number, desc: string): number;
    complain(callId: string, desc: string): number;
    setBool(key: string, value: boolean): number;
    setInt(key: string, value: number): number;
    setUInt(key: string, value: number): number;
    setNumber(key: string, value: number): number;
    setString(key: string, value: string): number;
    setObject(key: string, value: string): number;
    getBool(key: string): boolean;
    getInt(key: string): number;
    getUInt(key: string): number;
    getNumber(key: string): number;
    getString(key: string): string;
    getObject(key: string): string;
    getArray(key: string): string;
    setParameters(param: string): number;
    convertPath(path: string): string;
    setProfile(profile: string, merge: boolean): number;
    onEvent(event: string, callback: Function): void;
    unsubscribe(uid: number): number;
    registerDeliverFrame(callback: Function): number;
}
