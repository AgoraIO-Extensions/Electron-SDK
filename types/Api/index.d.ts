/// <reference types="node" />
import { IRenderer } from '../Renderer';
import { NodeRtcEngine, RtcStats, LocalVideoStats, RemoteVideoStats, RemoteAudioStats, RemoteVideoState, AgoraNetworkQuality, ClientRoleType, StreamType, ConnectionState, ConnectionChangeReason, MediaDeviceType, VIDEO_PROFILE_TYPE, TranscodingConfig, InjectStreamConfig } from './native_type';
import { EventEmitter } from 'events';
/**
 * @class AgoraRtcEngine
 */
declare class AgoraRtcEngine extends EventEmitter {
    rtcEngine: NodeRtcEngine;
    streams: Map<string, IRenderer>;
    renderMode: 1 | 2;
    constructor();
    /**
     * Decide whether to use webgl or software rending
     * @param {1|2} mode - 1 for old webgl rendering, 2 for software rendering
     */
    setRenderMode(mode?: 1 | 2): void;
    /**
     * @private
     * check if WebGL will be available with appropriate features
     * @returns {boolean}
     */
    _checkWebGL(): boolean;
    /**
     * init event handler
     * @private
     */
    initEventHandler(): void;
    /**
     * @private
     * @param {number} type 0-local 1-remote 2-device_test 3-video_source
     * @param {number} uid uid get from native engine, differ from electron engine's uid
     */
    _getRenderer(type: number, uid: number): IRenderer | undefined;
    /**
     * check if data is valid
     * @private
     * @param {*} header
     * @param {*} ydata
     * @param {*} udata
     * @param {*} vdata
     */
    _checkData(header: ArrayBuffer, ydata: ArrayBuffer, udata: ArrayBuffer, vdata: ArrayBuffer): boolean;
    /**
     * register renderer for target info
     * @private
     * @param {number} infos
     */
    onRegisterDeliverFrame(infos: any): void;
    /**
     * init renderer
     * @param {string|number} key key for the map that store the renderers, e.g, uid or `videosource` or `local`
     * @param {*} view dom elements to render video
     */
    initRender(key: 'local' | 'videosource' | number, view: HTMLElement): void;
    /**
     * destroy renderer
     * @param {string|number} key key for the map that store the renders, e.g, uid or `videosource` or `local`
     * @param {function} onFailure err callback for destroyRenderer
     */
    destroyRender(key: 'local' | 'videosource' | number, onFailure?: (err: Error) => void): void;
    /**
     * @description initialize agora real-time-communicating engine with appid
     * @param {string} appid agora appid
     * @returns {number} 0 for success, <0 for failure
     */
    initialize(appid: string): number;
    /**
     * @description return current version and build of sdk
     * @returns {string} version
     */
    getVersion(): string;
    /**
     * @description get sdk connection state
     * @returns {number} state
     * https://docs.agora.io/en/Interactive%20Broadcast/API%20Reference/cpp/namespaceagora_1_1rtc.html#a430364c3f2cbf4419b898077cf6977f7
     */
    getConnectionState(): ConnectionState;
    /**
     * @description Get error description of the given errorCode
     * @param {number} errorCode error code
     * @returns {string} error description
     */
    getErrorDescription(errorCode: number): string;
    /**
     *
     * @description Join channel with token, channel, channel_info and uid
     * @requires channel
     * @param {string} token token
     * @param {string} channel channel
     * @param {string} info channel info
     * @param {number} uid uid
     * @returns {number} 0 for success, <0 for failure
     */
    joinChannel(token: string, channel: string, info: string, uid: number): number;
    /**
     * @description Leave channel
     * @returns {number} 0 for success, <0 for failure
     */
    leaveChannel(): number;
    /**
     * @description release sdk instance
     * @returns {number} 0 for success, <0 for failure
     */
    release(): number;
    /**
     * @description This method sets high-quality audio preferences. Call this method and set all the three
     * modes before joining a channel. Do NOT call this method again after joining a channel.
     * @param {boolean} fullband enable/disable fullband codec
     * @param {boolean} stereo enable/disable stereo codec
     * @param {boolean} fullBitrate enable/disable high bitrate mode
     * @returns {number} 0 for success, <0 for failure
     */
    setHighQualityAudioParameters(fullband: boolean, stereo: boolean, fullBitrate: boolean): number;
    /**
     * @description subscribe remote uid and initialize corresponding renderer
     * @param {number} uid remote uid
     * @param {Element} view dom where to initialize renderer
     * @returns {number} 0 for success, <0 for failure
     */
    subscribe(uid: number, view: HTMLElement): number;
    /**
     * @description setup local video and corresponding renderer
     * @param {Element} view dom element where we will initialize our view
     * @returns {number} 0 for success, <0 for failure
     */
    setupLocalVideo(view: HTMLElement): number;
    /**
     *
     * @description force set renderer dimension of video, this ONLY affects size of data sent to js layer, native video size is determined by setVideoProfile
     * @param {*} rendertype type of renderer, 0 - local, 1 - remote, 2 - device test, 3 - video source
     * @param {*} uid target uid
     * @param {*} width target width
     * @param {*} height target height
     */
    setVideoRenderDimension(rendertype: number, uid: number, width: number, height: number): void;
    /**
     * @description force set renderer fps globally. This is mainly used to improve the performance for js rendering
     * once set, data will be forced to be sent with this fps. This can reduce cpu frequency of js rendering.
     * This applies to ALL views except ones added to High FPS stream.
     * @param {number} fps frame/s
     */
    setVideoRenderFPS(fps: number): void;
    /**
     * @description force set renderer fps for high stream. High stream here MEANS uid streams which has been
     * added to high ones by calling addVideoRenderToHighFPS, note this has nothing to do with dual stream
     * high stream. This is often used when we want to set low fps for most of views, but high fps for one
     * or two special views, e.g. screenshare
     * @param {number} fps frame/s
     */
    setVideoRenderHighFPS(fps: number): void;
    /**
     * @description add stream to high fps stream by uid. fps of streams added to high fps stream will be
     * controlled by setVideoRenderHighFPS
     * @param {number} uid stream uid
     */
    addVideoRenderToHighFPS(uid: number): void;
    /**
     * @description remove stream from high fps stream by uid. fps of streams removed from high fps stream
     * will be controlled by setVideoRenderFPS
     * @param {number} uid stream uid
     */
    remoteVideoRenderFromHighFPS(uid: number): void;
    /**
     * @description setup view content mode
     * @param {number} uid stream uid to operate
     * @param {0|1} mode view content mode, 0 - fill, 1 - fit
     * @returns {number} 0 - success, -1 - fail
     */
    setupViewContentMode(uid: number, mode: 0 | 1): number;
    /**
     * @description This method updates the Token.
     * The key expires after a certain period of time once the Token schema is enabled when:
     * The onError callback reports the ERR_TOKEN_EXPIRED(109) error, or
     * The onRequestToken callback reports the ERR_TOKEN_EXPIRED(109) error, or
     * The user receives the onTokenPrivilegeWillExpire callback.
     * The application should retrieve a new key and then call this method to renew it. Failure to do so will result in the SDK disconnecting from the server.
     * @param {string} newtoken new token to update
     * @returns {number} 0 for success, <0 for failure
     */
    renewToken(newtoken: string): number;
    /**
     * @description Set channel profile(before join channel) since sdk will do optimization according to scenario.
     * @description 0 (default) for communication, 1 for live broadcasting, 2 for in-game
     * @param {number} profile profile enum
     * @returns {number} 0 for success, <0 for failure
     */
    setChannelProfile(profile: number): number;
    /**
     *
     * @description In live broadcasting mode, set client role, 1 for anchor, 2 for audience
     * @param {ClientRoleType} role client role
     * @param {string} permissionKey permission key
     * @returns {number} 0 for success, <0 for failure
     */
    setClientRole(role: ClientRoleType, permissionKey: string): number;
    /**
     * @description This method launches an audio call test to determine whether the audio devices
     * (for example, headset and speaker) and the network connection are working properly.
     * In the test, the user first speaks, and the recording is played back in 10 seconds.
     * If the user can hear the recording in 10 seconds, it indicates that the audio devices
     * and network connection work properly.
     * @returns {number} 0 for success, <0 for failure
     */
    startEchoTest(): number;
    /**
     * @description This method stops an audio call test.
     * @returns {number} 0 for success, <0 for failure
     */
    stopEchoTest(): number;
    /**
     * @description This method tests the quality of the user’s network connection
     * and is disabled by default. Before users join a channel, they can call this
     * method to check the network quality. Calling this method consumes extra network
     * traffic, which may affect the communication quality. Call disableLastmileTest
     * to disable it immediately once users have received the onLastmileQuality
     * callback before they join the channel.
     * @returns {number} 0 for success, <0 for failure
     */
    enableLastmileTest(): number;
    /**
     * @description This method disables the network connection quality test.
     * @returns {number} 0 for success, <0 for failure
     */
    disableLastmileTest(): number;
    /**
     * @description Use before join channel to enable video communication, or you will only join with audio-enabled
     * @returns {number} 0 for success, <0 for failure
     */
    enableVideo(): number;
    /**
     * @description Use to disable video and use pure audio communication
     * @returns {number} 0 for success, <0 for failure
     */
    disableVideo(): number;
    /**
     * @description This method starts the local video preview. Before starting the preview,
     * always call setupLocalVideo to set up the preview window and configure the attributes,
     * and also call the enableVideo method to enable video. If startPreview is called to start
     * the local video preview before calling joinChannel to join a channel, the local preview
     * will still be in the started state after leaveChannel is called to leave the channel.
     * stopPreview can be called to close the local preview.
     * @returns {number} 0 for success, <0 for failure
     */
    startPreview(): number;
    /**
     * @description This method stops the local video preview and closes the video.
     * @returns {number} 0 for success, <0 for failure
     */
    stopPreview(): number;
    /**
     *
     * @param {VIDEO_PROFILE_TYPE} profile - enumeration values represent video profile
     * @param {boolean} [swapWidthAndHeight = false] - Whether to swap width and height
     * @returns {number} 0 for success, <0 for failure
     */
    setVideoProfile(profile: VIDEO_PROFILE_TYPE, swapWidthAndHeight?: boolean): number;
    /**
     * @param {Object} config - encoder config of video
     * @param {number} config.width - width of video
     * @param {number} config.height - height of video
     * @param {number} config.fps - valid values, 1, 7, 10, 15, 24, 30, 60
     * @param {number} config.bitrate - 0 - standard(recommended), 1 - compatible
     * @param {number} config.minbitrate - by default -1, changing this value is NOT recommended
     * @param {number} config.orientation - 0 - auto adapt to capture source, 1 - Landscape(Horizontal), 2 - Portrait(Vertical)
     * @returns {number} 0 for success, <0 for failure
     */
    setVideoEncoderConfiguration(config: {
        width?: number;
        height?: number;
        fps?: number;
        bitrate?: 0 | 1;
        minbitrate?: -1;
        orientation?: 0 | 1 | 2;
    }): number;
    /**
     * @description This method enables the audio mode, which is enabled by default.
     * @returns {number} 0 for success, <0 for failure
     */
    enableAudio(): number;
    /**
     * @description This method disables the audio mode.
     * @returns {number} 0 for success, <0 for failure
     */
    disableAudio(): number;
    /**
     * @description Set audio profile (before join channel) depending on your scenario
     * @param {number} profile 0: default, 1: speech standard, 2: music standard. 3: music standard stereo, 4: music high quality, 5: music high quality stereo
     * @param {number} scenario 0: default, 1: chatroom entertainment, 2: education, 3: game streaming, 4: showroom, 5: game chating
     * @returns {number} 0 for success, <0 for failure
     */
    setAudioProfile(profile: 0 | 1 | 2 | 3 | 4 | 5, scenario: 0 | 1 | 2 | 3 | 4 | 5): number;
    /**
     * @description This method allows users to set video preferences.
     * @param {boolean} preferFrameRateOverImageQuality enable/disable framerate over image quality
     * @returns {number} 0 for success, <0 for failure
     */
    setVideoQualityParameters(preferFrameRateOverImageQuality: boolean): number;
    /**
     * @description Use setEncryptionSecret to specify an encryption password to enable built-in
     * encryption before joining a channel. All users in a channel must set the same encryption password.
     * The encryption password is automatically cleared once a user has left the channel.
     * If the encryption password is not specified or set to empty, the encryption function will be disabled.
     * @param {string} secret Encryption Password
     * @returns {number} 0 for success, <0 for failure
     */
    setEncryptionSecret(secret: string): number;
    /**
     * @description This method mutes/unmutes local audio. It enables/disables
     * sending local audio streams to the network.
     * @param {boolean} mute mute/unmute audio
     * @returns {number} 0 for success, <0 for failure
     */
    muteLocalAudioStream(mute: boolean): number;
    /**
     * @description This method mutes/unmutes all remote users’ audio streams.
     * @param {boolean} mute mute/unmute audio
     * @returns {number} 0 for success, <0 for failure
     */
    muteAllRemoteAudioStreams(mute: boolean): number;
    /**
     * @description Stops receiving all remote users' audio streams by default.
     * @param {boolean} mute mute/unmute audio
     * @returns {number} 0 for success, <0 for failure
     */
    setDefaultMuteAllRemoteAudioStreams(mute: boolean): number;
    /**
     * @description This method mutes/unmutes a specified user’s audio stream.
     * @param {number} uid user to mute/unmute
     * @param {boolean} mute mute/unmute audio
     * @returns {number} 0 for success, <0 for failure
     */
    muteRemoteAudioStream(uid: number, mute: boolean): number;
    /**
     * @description This method mutes/unmutes video stream
     * @param {boolean} mute mute/unmute video
     * @returns {number} 0 for success, <0 for failure
     */
    muteLocalVideoStream(mute: boolean): number;
    /**
     * @description This method disables the local video, which is only applicable to
     * the scenario when the user only wants to watch the remote video without sending
     * any video stream to the other user. This method does not require a local camera.
     * @param {boolean} enable enable/disable video
     * @returns {number} 0 for success, <0 for failure
     */
    enableLocalVideo(enable: boolean): number;
    /**
     * @description This method mutes/unmutes all remote users’ video streams.
     * @param {boolean} mute mute/unmute video
     * @returns {number} 0 for success, <0 for failure
     */
    muteAllRemoteVideoStreams(mute: boolean): number;
    /**
     * @description Stops receiving all remote users’ video streams.
     * @param {boolean} mute mute/unmute audio
     * @returns {number} 0 for success, <0 for failure
     */
    setDefaultMuteAllRemoteVideoStreams(mute: boolean): number;
    /**
     * @description This method enables the SDK to regularly report to the application
     * on which user is talking and the volume of the speaker. Once the method is enabled,
     * the SDK returns the volume indications at the set time internal in the Audio Volume
     * Indication Callback (onAudioVolumeIndication) callback, regardless of whether anyone
     * is speaking in the channel
     * @param {number} interval < 0 for disable, recommend to set > 200ms, < 10ms will not receive any callbacks
     * @param {number} smooth Smoothing factor. The default value is 3
     * @returns {number} 0 for success, <0 for failure
     */
    enableAudioVolumeIndication(interval: number, smooth: number): number;
    /**
     * @description This method mutes/unmutes a specified user’s video stream.
     * @param {number} uid user to mute/unmute
     * @param {boolean} mute mute/unmute video
     * @returns {number} 0 for success, <0 for failure
     */
    muteRemoteVideoStream(uid: number, mute: boolean): number;
    /**
     * @description This method sets the in ear monitoring volume.
     * @param {number} volume Volume of the in-ear monitor, ranging from 0 to 100. The default value is 100.
     * @returns {number} 0 for success, <0 for failure
     */
    setInEarMonitoringVolume(volume: number): number;
    /**
     * @description disable audio function in channel, which will be recovered when leave channel.
     * @returns {number} 0 for success, <0 for failure
     */
    pauseAudio(): number;
    /**
     * @description resume audio function in channel.
     * @returns {number} 0 for success, <0 for failure
     */
    resumeAudio(): number;
    /**
     * @description set filepath of log
     * @param {string} filepath filepath of log
     * @returns {number} 0 for success, <0 for failure
     */
    setLogFile(filepath: string): number;
    /**
     * @description set filepath of videosource log (Called After videosource initialized)
     * @param {string} filepath filepath of log
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceSetLogFile(filepath: string): number;
    /**
     * @description set log level
     * @param {number} filter filter level
     * LOG_FILTER_OFF = 0: Output no log.
     * LOG_FILTER_DEBUG = 0x80f: Output all the API logs.
     * LOG_FILTER_INFO = 0x0f: Output logs of the CRITICAL, ERROR, WARNING and INFO level.
     * LOG_FILTER_WARNING = 0x0e: Output logs of the CRITICAL, ERROR and WARNING level.
     * LOG_FILTER_ERROR = 0x0c: Output logs of the CRITICAL and ERROR level.
     * LOG_FILTER_CRITICAL = 0x08: Output logs of the CRITICAL level.
     * @returns {number} 0 for success, <0 for failure
     */
    setLogFilter(filter: number): number;
    /**
     * @description This method sets the stream mode (only applicable to live broadcast) to
     * single- (default) or dual-stream mode.
     * @param {boolean} enable enable/disable dual stream
     * @returns {number} 0 for success, <0 for failure
     */
    enableDualStreamMode(enable: boolean): number;
    /**
     * @description This method specifies the video-stream type of the remote user to be
     * received by the local user when the remote user sends dual streams.
     * If dual-stream mode is enabled by calling enableDualStreamMode, you will receive the
     * high-video stream by default. This method allows the application to adjust the
     * corresponding video-stream type according to the size of the video windows to save the bandwidth
     * and calculation resources.
     * If dual-stream mode is not enabled, you will receive the high-video stream by default.
     * The result after calling this method will be returned in onApiCallExecuted. The Agora SDK receives
     * the high-video stream by default to save the bandwidth. If needed, users can switch to the low-video
     * stream using this method.
     * @param {number} uid User ID
     * @param {StreamType} streamType 0 - high, 1 - low
     * @returns {number} 0 for success, <0 for failure
     */
    setRemoteVideoStreamType(uid: number, streamType: StreamType): number;
    /**
     * @description This method sets the default remote video stream type to high or low.
     * @param {StreamType} streamType 0 - high, 1 - low
     * @returns {number} 0 for success, <0 for failure
     */
    setRemoteDefaultVideoStreamType(streamType: StreamType): number;
    /**
     * @description This method enables interoperability with the Agora Web SDK.
     * @param {boolean} enable enable/disable interop
     * @returns {number} 0 for success, <0 for failure
     */
    enableWebSdkInteroperability(enable: boolean): number;
    /**
     * @description This method sets the local video mirror mode. Use this method before startPreview,
     * or it does not take effect until you re-enable startPreview.
     * @param {number} mirrortype mirror type
     * 0: The default mirror mode, that is, the mode set by the SDK
     * 1: Enable the mirror mode
     * 2: Disable the mirror mode
     * @returns {number} 0 for success, <0 for failure
     */
    setLocalVideoMirrorMode(mirrortype: 0 | 1 | 2): number;
    /**
     * @description Changes the voice pitch of the local speaker.
     * @param {number} pitch - The value ranges between 0.5 and 2.0.
     * The lower the value, the lower the voice pitch.
     * The default value is 1.0 (no change to the local voice pitch).
     * @returns {number} 0 for success, <0 for failure
     */
    setLocalVoicePitch(pitch: number): number;
    /**
     * @description Sets the local voice equalization effect.
     * @param {number} bandFrequency - Sets the band frequency.
     * The value ranges between 0 and 9, representing the respective 10-band center frequencies of the voice effects
     * including 31, 62, 125, 500, 1k, 2k, 4k, 8k, and 16k Hz.
     * @param {number} bandGain - Sets the gain of each band in dB. The value ranges between -15 and 15.
     * @returns {number} 0 for success, <0 for failure
     */
    setLocalVoiceEqualization(bandFrequency: number, bandGain: number): number;
    /**
     * @description Sets the local voice reverberation.
     * @param {number} reverbKey - Audio reverberation type.
     * AUDIO_REVERB_DRY_LEVEL = 0, // (dB, [-20,10]), the level of the dry signal
     * AUDIO_REVERB_WET_LEVEL = 1, // (dB, [-20,10]), the level of the early reflection signal (wet signal)
     * AUDIO_REVERB_ROOM_SIZE = 2, // ([0,100]), the room size of the reflection
     * AUDIO_REVERB_WET_DELAY = 3, // (ms, [0,200]), the length of the initial delay of the wet signal in ms
     * AUDIO_REVERB_STRENGTH = 4, // ([0,100]), the strength of the reverberation
     * @param {number} value - value Sets the value of the reverberation key.
     * @returns {number} 0 for success, <0 for failure
     */
    setLocalVoiceReverb(reverbKey: number, value: number): number;
    /**
     * @description Sets the fallback option for the locally published video stream based on the network conditions.
     * The default setting for option is #STREAM_FALLBACK_OPTION_DISABLED, where there is no fallback for the locally published video stream when the uplink network conditions are poor.
     * If *option* is set to #STREAM_FALLBACK_OPTION_AUDIO_ONLY, the SDK will:
     * - Disable the upstream video but enable audio only when the network conditions worsen and cannot support both video and audio.
     * - Re-enable the video when the network conditions improve.
     * When the locally published stream falls back to audio only or when the audio stream switches back to the video,
     * the \ref agora::rtc::IRtcEngineEventHandler::onLocalPublishFallbackToAudioOnly "onLocalPublishFallbackToAudioOnly" callback is triggered.
     * @note Agora does not recommend using this method for CDN live streaming, because the remote CDN live user will have a noticeable lag when the locally publish stream falls back to audio-only.
     * @param {number} option - Sets the fallback option for the locally published video stream.
     * STREAM_FALLBACK_OPTION_DISABLED = 0
     * STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW = 1
     * STREAM_FALLBACK_OPTION_AUDIO_ONLY = 2
     * @returns {number} 0 for success, <0 for failure
     */
    setLocalPublishFallbackOption(option: 0 | 1 | 2): number;
    /**
     * @description Sets the fallback option for the remotely subscribed stream based on the network conditions.
     * The default setting for @p option is #STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW, where the remotely subscribed stream falls back to
     * the low-stream video (low resolution and low bitrate) under poor downlink network conditions.
     * If *option* is set to #STREAM_FALLBACK_OPTION_AUDIO_ONLY, the SDK automatically switches the video from a high-stream to a low-stream,
     * or disable the video when the downlink network conditions cannot support both audio and video to guarantee the quality of the audio.
     * The SDK monitors the network quality and restores the video stream when the network conditions improve.
     * Once the locally published stream falls back to audio only or the audio stream switches back to the video stream,
     * the \ref agora::rtc::IRtcEngineEventHandler::onRemoteSubscribeFallbackToAudioOnly "onRemoteSubscribeFallbackToAudioOnly" callback is triggered.
     * @param {number} option - Sets the fallback option for the remotely subscribed stream.
     * STREAM_FALLBACK_OPTION_DISABLED = 0
     * STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW = 1
     * STREAM_FALLBACK_OPTION_AUDIO_ONLY = 2
     * @returns {number} 0 for success, <0 for failure
     */
    setRemoteSubscribeFallbackOption(option: 0 | 1 | 2): number;
    /**
     * @description This method sets the external audio source.
     * @param {boolean} enabled Enable the function of the external audio source: true/false.
     * @param {number} samplerate Sampling rate of the external audio source.
     * @param {number} channels Number of the external audio source channels (two channels maximum).
     * @returns {number} 0 for success, <0 for failure
     */
    setExternalAudioSource(enabled: boolean, samplerate: number, channels: number): number;
    /**
     * @description return list of video devices
     * @returns {Array} array of device object
     */
    getVideoDevices(): Array<Object>;
    /**
     * @description set video device to use via device id
     * @param {string} deviceId device id
     * @returns {number} 0 for success, <0 for failure
     */
    setVideoDevice(deviceId: string): number;
    /**
     * @description get current using video device
     * @return {Object} video device object
     */
    getCurrentVideoDevice(): Object;
    /**
     * @description This method tests whether the video-capture device works properly.
     * Before calling this method, ensure that you have already called enableVideo,
     * and the HWND window handle of the incoming parameter is valid.
     * @returns {number} 0 for success, <0 for failure
     */
    startVideoDeviceTest(): number;
    /**
     * @description stop video device test
     * @returns {number} 0 for success, <0 for failure
     */
    stopVideoDeviceTest(): number;
    /**
     * @description return list of audio playback devices
     * @returns {Array} array of device object
     */
    getAudioPlaybackDevices(): Array<Object>;
    /**
     * @description set audio playback device to use via device id
     * @param {string} deviceId device id
     * @returns {number} 0 for success, <0 for failure
     */
    setAudioPlaybackDevice(deviceId: string): number;
    /**
     * @description Retrieves the audio playback device information associated with the device ID and device name
     * @param {string} deviceId device id
     * @param {string} deviceName device name
     * @returns {number} 0 for success, <0 for failure
     */
    getPlaybackDeviceInfo(deviceId: string, deviceName: string): number;
    /**
     * @description get current using audio playback device
     * @return {Object} audio playback device object
     */
    getCurrentAudioPlaybackDevice(): Object;
    /**
     * @description set device playback volume
     * @param {number} volume 0 - 255
     * @returns {number} 0 for success, <0 for failure
     */
    setAudioPlaybackVolume(volume: number): number;
    /**
     * @description get device playback volume
     * @returns {number} volume
     */
    getAudioPlaybackVolume(): number;
    /**
     * @description get audio recording devices
     * @returns {Array} array of recording devices
     */
    getAudioRecordingDevices(): Array<Object>;
    /**
     * @description set audio recording device
     * @param {string} deviceId device id
     * @returns {number} 0 for success, <0 for failure
     */
    setAudioRecordingDevice(deviceId: string): number;
    /**
     * @description Retrieves the audio recording device information associated with the device ID and device name.
     * @param {string} deviceId device id
     * @param {string} deviceName device name
     * @returns {number} 0 for success, <0 for failure
     */
    getRecordingDeviceInfo(deviceId: string, deviceName: string): number;
    /**
     * @description get current selected audio recording device
     * @returns {Object} audio recording device object
     */
    getCurrentAudioRecordingDevice(): Object;
    /**
     * @description get audio recording volume
     * @return {number} volume
     */
    getAudioRecordingVolume(): number;
    /**
     * @description set audio recording device volume
     * @param {number} volume 0 - 255
     * @returns {number} 0 for success, <0 for failure
     */
    setAudioRecordingVolume(volume: number): number;
    /**
     * @description This method checks whether the playback device works properly. The SDK plays an audio file
     * specified by the user. If the user can hear the sound, then the playback device works properly.
     * @param {string} filepath filepath of sound file to play test
     * @returns {number} 0 for success, <0 for failure
     */
    startAudioPlaybackDeviceTest(filepath: string): number;
    /**
     * @description stop playback device test
     * @returns {number} 0 for success, <0 for failure
     */
    stopAudioPlaybackDeviceTest(): number;
    /**
     * @description This method enables loopback recording. Once enabled, the SDK collects all local sounds.
     * @param {boolean} [enable = false] whether to enable loop back recording
     * @param {string|null} [deviceName = null] target audio device
     * @returns {number} 0 for success, <0 for failure
     */
    enableLoopbackRecording(enable?: boolean, deviceName?: string | null): number;
    /**
     * @description This method checks whether the microphone works properly. Once the test starts, the SDK uses
     * the onAudioVolumeIndication callback to notify the application about the volume information.
     * @param {number} indicateInterval in second
     * @returns {number} 0 for success, <0 for failure
     */
    startAudioRecordingDeviceTest(indicateInterval: number): number;
    /**
     * @description stop audio recording device test
     * @returns {number} 0 for success, <0 for failure
     */
    stopAudioRecordingDeviceTest(): number;
    /**
     * @description check whether selected audio playback device is muted
     * @returns {boolean} muted/unmuted
     */
    getAudioPlaybackDeviceMute(): boolean;
    /**
     * @description set current audio playback device mute/unmute
     * @param {boolean} mute mute/unmute
     * @returns {number} 0 for success, <0 for failure
     */
    setAudioPlaybackDeviceMute(mute: boolean): number;
    /**
     * @description check whether selected audio recording device is muted
     * @returns {boolean} muted/unmuted
     */
    getAudioRecordingDeviceMute(): boolean;
    /**
     * @description set current audio recording device mute/unmute
     * @param {boolean} mute mute/unmute
     * @returns {number} 0 for success, <0 for failure
     */
    setAudioRecordingDeviceMute(mute: boolean): number;
    /**
     * @description initialize agora real-time-communicating videosource with appid
     * @param {string} appId agora appid
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceInitialize(appId: string): number;
    /**
     * @description setup renderer for video source
     * @param {Element} view dom element where video source should be displayed
     */
    setupLocalVideoSource(view: HTMLElement): void;
    /**
     * @description Set it to true to enable videosource web interoperability (After videosource initialized)
     * @param {boolean} enabled enalbe/disable web interoperability
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceEnableWebSdkInteroperability(enabled: boolean): number;
    /**
     *
     * @description let video source join channel with token, channel, channel_info and uid
     * @param {string} token token
     * @param {string} cname channel
     * @param {string} info channel info
     * @param {number} uid uid
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceJoin(token: string, cname: string, info: string, uid: number): number;
    /**
     * @description let video source Leave channel
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceLeave(): number;
    /**
     * @description This method updates the Token for video source
     * @param {string} token new token to update
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceRenewToken(token: string): number;
    /**
     * @description Set channel profile (after ScreenCapture2) for video source
     * @description 0 (default) for communication, 1 for live broadcasting, 2 for in-game
     * @param {number} profile profile
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceSetChannelProfile(profile: number): number;
    /**
     * @description set video profile for video source (must be called after startScreenCapture2)
     * @param {VIDEO_PROFILE_TYPE} profile - enumeration values represent video profile
     * @param {boolean} [swapWidthAndHeight = false] - Whether to swap width and height
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceSetVideoProfile(profile: VIDEO_PROFILE_TYPE, swapWidthAndHeight?: boolean): number;
    /**
     * @description get list of all system window ids and relevant infos, the window id can be used for screen share
     * @returns {Array} list of window infos
     */
    getScreenWindowsInfo(): Array<Object>;
    /**
     * @description start video source screen capture
     * @param {number} wndid windows id to capture
     * @param {number} captureFreq fps of video source screencapture, 1 - 15
     * @param {*} rect null/if specified, e.g, {left: 0, right: 100, top: 0, bottom: 100} (relative distance from the left-top corner of the screen)
     * @param {number} bitrate bitrate of video source screencapture
     * @returns {number} 0 for success, <0 for failure
     */
    startScreenCapture2(windowId: number, captureFreq: number, rect: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    }, bitrate: number): number;
    /**
     * @description stop video source screen capture
     * @returns {number} 0 for success, <0 for failure
     */
    stopScreenCapture2(): number;
    /**
     * @description start video source preview
     * @returns {number} 0 for success, <0 for failure
     */
    startScreenCapturePreview(): number;
    /**
     * @description stop video source preview
     * @returns {number} 0 for success, <0 for failure
     */
    stopScreenCapturePreview(): number;
    /**
     * @description enable dual stream mode for video source
     * @param {boolean} enable whether dual stream mode is enabled
     * @return {number} 0 for success, <0 for failure
     */
    videoSourceEnableDualStreamMode(enable: boolean): number;
    /**
     * @description setParameters for video source
     * @param {string} parameter parameter to set
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceSetParameters(parameter: string): number;
    /**
     * @description This method updates the screen capture region for video source
     * @param {*} rect {left: 0, right: 100, top: 0, bottom: 100} (relative distance from the left-top corner of the screen)
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceUpdateScreenCaptureRegion(rect: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    }): number;
    /**
     * @description release video source object
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceRelease(): number;
    /**
     * @description start screen capture
     * @param {number} windowId windows id to capture
     * @param {number} captureFreq fps of screencapture, 1 - 15
     * @param {*} rect null/if specified, e.g, {left: 0, right: 100, top: 0, bottom: 100} (relative distance from the left-top corner of the screen)
     * @param {number} bitrate bitrate of screencapture
     * @returns {number} 0 for success, <0 for failure
     */
    startScreenCapture(windowId: number, captureFreq: number, rect: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    }, bitrate: number): number;
    /**
     * @description stop screen capture
     * @returns {number} 0 for success, <0 for failure
     */
    stopScreenCapture(): number;
    /**
     * @description This method updates the screen capture region.
     * @param {*} rect {left: 0, right: 100, top: 0, bottom: 100} (relative distance from the left-top corner of the screen)
     * @returns {number} 0 for success, <0 for failure
     */
    updateScreenCaptureRegion(rect: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    }): number;
    /**
     * @description This method mixes the specified local audio file with the audio stream
     * from the microphone; or, it replaces the microphone’s audio stream with the specified
     * local audio file. You can choose whether the other user can hear the local audio playback
     * and specify the number of loop playbacks. This API also supports online music playback.
     * @param {string} filepath Name and path of the local audio file to be mixed.
     *            Supported audio formats: mp3, aac, m4a, 3gp, and wav.
     * @param {boolean} loopback true - local loopback, false - remote loopback
     * @param {boolean} replace whether audio file replace microphone audio
     * @param {number} cycle number of loop playbacks, -1 for infinite
     * @returns {number} 0 for success, <0 for failure
     */
    startAudioMixing(filepath: string, loopback: boolean, replace: boolean, cycle: number): number;
    /**
     * @description This method stops audio mixing. Call this API when you are in a channel.
     * @returns {number} 0 for success, <0 for failure
     */
    stopAudioMixing(): number;
    /**
     * @description This method pauses audio mixing. Call this API when you are in a channel.
     * @returns {number} 0 for success, <0 for failure
     */
    pauseAudioMixing(): number;
    /**
     * @description This method resumes audio mixing from pausing. Call this API when you are in a channel.
     * @returns {number} 0 for success, <0 for failure
     */
    resumeAudioMixing(): number;
    /**
     * @description This method adjusts the volume during audio mixing. Call this API when you are in a channel.
     * @param {number} volume Volume ranging from 0 to 100. By default, 100 is the original volume.
     * @returns {number} 0 for success, <0 for failure
     */
    adjustAudioMixingVolume(volume: number): number;
    /**
     * @description Adjusts the audio mixing volume for local playback.
     * @param {number} volume Volume ranging from 0 to 100. By default, 100 is the original volume.
     * @returns {number} 0 for success, <0 for failure
     */
    adjustAudioMixingPlayoutVolume(volume: number): number;
    /**
     * @description Adjusts the audio mixing volume for publishing (for remote users).
     * @param {number} volume Volume ranging from 0 to 100. By default, 100 is the original volume.
     * @returns {number} 0 for success, <0 for failure
     */
    adjustAudioMixingPublishVolume(volume: number): number;
    /**
     * @description This method gets the duration (ms) of the audio mixing. Call this API when you are in
     * a channel. A return value of 0 means that this method call has failed.
     * @returns {number} duration of audio mixing
     */
    getAudioMixingDuration(): number;
    /**
     * @description This method gets the playback position (ms) of the audio. Call this API
     * when you are in a channel.
     * @returns {number} current playback position
     */
    getAudioMixingCurrentPosition(): number;
    /**
     * @description This method drags the playback progress bar of the audio mixing file to where
     * you want to play instead of playing it from the beginning.
     * @param {number} position Integer. The position of the audio mixing file in ms
     * @returns {number} 0 for success, <0 for failure
     */
    setAudioMixingPosition(position: number): number;
    /**
     * @description Adds a stream RTMP URL address, to which the host publishes the stream. (CDN live only.)
     * Invoke onStreamPublished when successful
     * @note
     * - Ensure that the user joins the channel before calling this method.
     * - This method adds only one stream RTMP URL address each time it is called.
     * - The RTMP URL address must not contain special characters, such as Chinese language characters.
     * @param {string} url Pointer to the RTMP URL address, to which the host publishes the stream
     * @param {bool} transcodingEnabled Sets whether transcoding is enabled/disabled
     * @returns {number} 0 for success, <0 for failure
     */
    addPublishStreamUrl(url: string, transcodingEnabled: boolean): number;
    /**
     * @description Removes a stream RTMP URL address. (CDN live only.)
     * @note
     * - This method removes only one RTMP URL address each time it is called.
     * - The RTMP URL address must not contain special characters, such as Chinese language characters.
     * @param {string} url Pointer to the RTMP URL address to be removed.
     * @returns {number} 0 for success, <0 for failure
     */
    removePublishStreamUrl(url: string): number;
    /**
     * @description Sets the video layout and audio settings for CDN live. (CDN live only.)
     * @param {TranscodingConfig} transcoding transcoding Sets the CDN live audio/video transcoding settings. See LiveTranscoding.
     * @returns {number} 0 for success, <0 for failure
     */
    setLiveTranscoding(transcoding: TranscodingConfig): number;
    /**
     * @description Adds a voice or video stream HTTP/HTTPS URL address to a live broadcast.
     * - The \ref IRtcEngineEventHandler::onStreamInjectedStatus "onStreamInjectedStatus" callback returns
     * the inject stream status.
     * - The added stream HTTP/HTTPS URL address can be found in the channel with a @p uid of 666, and the
     * \ref IRtcEngineEventHandler::onUserJoined "onUserJoined" and \ref IRtcEngineEventHandler::onFirstRemoteVideoFrame "onFirstRemoteVideoFrame"
     * callbacks are triggered.
     * @param {string} url Pointer to the HTTP/HTTPS URL address to be added to the ongoing live broadcast. Valid protocols are RTMP, HLS, and FLV.
     * - Supported FLV audio codec type: AAC.
     * - Supported FLV video codec type: H264 (AVC).
     * @param {InjectStreamConfig} config Pointer to the InjectStreamConfig object that contains the configuration of the added voice or video stream
     * @returns {number} 0 for success, <0 for failure
     */
    addInjectStreamUrl(url: string, config: InjectStreamConfig): number;
    /**
     * @description Removes the voice or video stream HTTP/HTTPS URL address from a live broadcast.
     * @note If this method is called successfully, the \ref IRtcEngineEventHandler::onUserOffline "onUserOffline" callback is triggered
     * and a stream uid of 666 is returned.
     * @param {string} url Pointer to the HTTP/HTTPS URL address of the added stream to be removed.
     * @returns {number} 0 for success, <0 for failure
     */
    removeInjectStreamUrl(url: string): number;
    /**
     * @description This method sets the format of the callback data in onRecordAudioFrame.
     * @param {number} sampleRate It specifies the sampling rate in the callback data returned by onRecordAudioFrame,
     * which can set be as 8000, 16000, 32000, 44100 or 48000.
     * @param {number} channel 1 - mono, 2 - dual
     * @param {number} mode 0 - read only mode, 1 - write-only mode, 2 - read and white mode
     * @param {number} samplesPerCall It specifies the sampling points in the called data returned in onRecordAudioFrame,
     * for example, it is usually set as 1024 for stream pushing.
     * @returns {number} 0 for success, <0 for failure
     */
    setRecordingAudioFrameParameters(sampleRate: number, channel: 1 | 2, mode: 0 | 1 | 2, samplesPerCall: number): number;
    /**
     * This method sets the format of the callback data in onPlaybackAudioFrame.
     * @param {number} sampleRate Specifies the sampling rate in the callback data returned by onPlaybackAudioFrame,
     * which can set be as 8000, 16000, 32000, 44100, or 48000.
     * @param {number} channel 1 - mono, 2 - dual
     * @param {number} mode 0 - read only mode, 1 - write-only mode, 2 - read and white mode
     * @param {number} samplesPerCall It specifies the sampling points in the called data returned in onRecordAudioFrame,
     * for example, it is usually set as 1024 for stream pushing.
     * @returns {number} 0 for success, <0 for failure
     */
    setPlaybackAudioFrameParameters(sampleRate: number, channel: 1 | 2, mode: 0 | 1 | 2, samplesPerCall: number): number;
    /**
     * This method sets the format of the callback data in onMixedAudioFrame.
     * @param {number} sampleRate Specifies the sampling rate in the callback data returned by onMixedAudioFrame,
     * which can set be as 8000, 16000, 32000, 44100, or 48000.
     * @param {number} samplesPerCall Specifies the sampling points in the called data returned in onMixedAudioFrame,
     * for example, it is usually set as 1024 for stream pushing.
     * @returns {number} 0 for success, <0 for failure
     */
    setMixedAudioFrameParameters(sampleRate: number, samplesPerCall: number): number;
    /**
     * @description This method creates a data stream. Each user can only have up to five data channels at the same time.
     * @param {boolean} reliable true - The recipients will receive data from the sender within 5 seconds. If the recipient does not receive the sent data within 5 seconds, the data channel will report an error to the application.
     * false - The recipients may not receive any data, while it will not report any error upon data missing.
     * @param {boolean} ordered true - The recipients will receive data in the order of the sender.
     * false - The recipients will not receive data in the order of the sender.
     * @returns {number} <0 for failure, > 0 for stream id of data
     */
    createDataStream(reliable: boolean, ordered: boolean): number;
    /**
     * @description This method sends data stream messages to all users in a channel.
     * Up to 30 packets can be sent per second in a channel with each packet having a maximum size of 1 kB.
     * The API controls the data channel transfer rate. Each client can send up to 6 kB of data per second.
     * Each user can have up to five data channels simultaneously.
     * @param {number} streamId Stream ID from createDataStream
     * @param {string} msg Data to be sent
     * @returns {number} 0 for success, <0 for failure
     */
    sendStreamMessage(streamId: number, msg: string): number;
    /**
     * @description get effects volume
     * @returns {number} volume
     */
    getEffectsVolume(): number;
    /**
     * @description set effects volume
     * @param {number} volume - [0.0, 100.0]
     * @returns {number} 0 for success, <0 for failure
     */
    setEffectsVolume(volume: number): number;
    /**
     * @description set effect volume of a sound id
     * @param {number} soundId soundId
     * @param {number} volume - [0.0, 100.0]
     * @returns {number} 0 for success, <0 for failure
     */
    setVolumeOfEffect(soundId: number, volume: number): number;
    /**
     * @description play effect
     * @param {number} soundId soundId
     * @param {string} filePath filepath
     * @param {number} loopcount - 0: once, 1: twice, -1: infinite
     * @param {number} pitch - [0.5, 2]
     * @param {number} pan - [-1, 1]
     * @param {number} gain - [0, 100]
     * @param {boolean} publish publish
     * @returns {number} 0 for success, <0 for failure
     */
    playEffect(soundId: number, filePath: string, loopcount: number, pitch: number, pan: number, gain: number, publish: number): number;
    /**
     * @description stop effect via given sound id
     * @param {number} soundId soundId
     * @returns {number} 0 for success, <0 for failure
     */
    stopEffect(soundId: number): number;
    /**
     * @description preload effect
     * @param {number} soundId soundId
     * @param {string} filePath filepath
     * @returns {number} 0 for success, <0 for failure
     */
    preloadEffect(soundId: number, filePath: string): number;
    /**
     * This method releases a specific preloaded audio effect from the memory.
     * @param {number} soundId soundId
     * @returns {number} 0 for success, <0 for failure
     */
    unloadEffect(soundId: number): number;
    /**
     * @description This method pauses a specific audio effect.
     * @param {number} soundId soundId
     * @returns {number} 0 for success, <0 for failure
     */
    pauseEffect(soundId: number): number;
    /**
     * @description This method pauses all the audio effects.
     * @returns {number} 0 for success, <0 for failure
     */
    pauseAllEffects(): number;
    /**
     * @description This method resumes playing a specific audio effect.
     * @param {number} soundId sound id
     * @returns {number} 0 for success, <0 for failure
     */
    resumeEffect(soundId: number): number;
    /**
     * @description This method resumes playing all the audio effects.
     * @returns {number} 0 for success, <0 for failure
     */
    resumeAllEffects(): number;
    /**
     * @description When a user joins a channel on a client using joinChannelByToken,
     * a CallId is generated to identify the call from the client. Some methods such
     * as rate and complain need to be called after the call ends in order to submit
     * feedback to the SDK. These methods require assigned values of the CallId parameters.
     * To use these feedback methods, call the getCallId method to retrieve the CallId during the call,
     * and then pass the value as an argument in the feedback methods after the call ends.
     * @returns {string} Current call ID.
     */
    getCallId(): string;
    /**
     * @description This method lets the user rate the call. It is usually called after the call ends.
     * @param {string} callId Call ID retrieved from the getCallId method.
     * @param {number} rating Rating for the call between 1 (lowest score) to 10 (highest score).
     * @param {string} desc A given description for the call with a length less than 800 bytes.
     * @returns {number} 0 for success, <0 for failure
     */
    rate(callId: string, rating: number, desc: string): number;
    /**
     * @description This method allows the user to complain about the call quality. It is usually
     * called after the call ends.
     * @param {string} callId Call ID retrieved from the getCallId method.
     * @param {string} desc A given description of the call with a length less than 800 bytes.
     * @returns {number} 0 for success, <0 for failure
     */
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
}
declare interface AgoraRtcEngine {
    on(evt: 'apiCallExecuted', cb: (api: string, err: number) => void): this;
    on(evt: 'warning', cb: (warn: number, msg: string) => void): this;
    on(evt: 'error', cb: (err: number, msg: string) => void): this;
    on(evt: 'joinedChannel', cb: (channel: string, uid: number, elapsed: number) => void): this;
    on(evt: 'rejoinedChannel', cb: (channel: string, uid: number, elapsed: number) => void): this;
    on(evt: 'audioQuality', cb: (uid: number, quality: AgoraNetworkQuality, delay: number, lost: number) => void): this;
    on(evt: 'audioVolumeIndication', cb: (uid: number, volume: number, speakerNumber: number, totalVolume: number) => void): this;
    on(evt: 'groupAudioVolumeIndication', cb: (speakers: {
        uid: number;
        volume: number;
    }[], speakerNumber: number, totalVolume: number) => void): this;
    on(evt: 'leaveChannel', cb: () => void): this;
    on(evt: 'rtcStats', cb: (stats: RtcStats) => void): this;
    on(evt: 'localVideoStats', cb: (stats: LocalVideoStats) => void): this;
    on(evt: 'remoteVideoStats', cb: (stats: RemoteVideoStats) => void): this;
    on(evt: 'remoteAudioStats', cb: (stats: RemoteAudioStats) => void): this;
    on(evt: 'audioDeviceStateChanged', cb: (deviceId: string, deviceType: number, deviceState: number) => void): this;
    on(evt: 'audioMixingFinished', cb: () => void): this;
    on(evt: 'remoteAudioMixingBegin', cb: () => void): this;
    on(evt: 'remoteAudioMixingEnd', cb: () => void): this;
    on(evt: 'audioEffectFinished', cb: (soundId: number) => void): this;
    on(evt: 'videoDeviceStateChanged', cb: (deviceId: string, deviceType: number, deviceState: number) => void): this;
    on(evt: 'networkQuality', cb: (uid: number, txquality: AgoraNetworkQuality, rxquality: AgoraNetworkQuality) => void): this;
    on(evt: 'lastMileQuality', cb: (quality: AgoraNetworkQuality) => void): this;
    on(evt: 'firstLocalVideoFrame', cb: (width: number, height: number, elapsed: number) => void): this;
    on(evt: 'addStream', cb: (uid: number, elapsed: number) => void): this;
    on(evt: 'videoSizeChanged', cb: (uid: number, width: number, height: number, rotation: number) => void): this;
    on(evt: 'firstRemoteVideoFrame', cb: (uid: number, width: number, height: number, elapsed: number) => void): this;
    on(evt: 'userJoined', cb: (uid: number, elapsed: number) => void): this;
    on(evt: 'removeStream', cb: (uid: number, reason: number) => void): this;
    on(evt: 'userMuteAudio', cb: (uid: number, muted: boolean) => void): this;
    on(evt: 'userMuteVideo', cb: (uid: number, muted: boolean) => void): this;
    on(evt: 'userEnableVideo', cb: (uid: number, enabled: boolean) => void): this;
    on(evt: 'userEnableLocalVideo', cb: (uid: number, enabled: boolean) => void): this;
    on(evt: 'cameraReady', cb: () => void): this;
    on(evt: 'videoStopped', cb: () => void): this;
    on(evt: 'connectionLost', cb: () => void): this;
    on(evt: 'connectionInterrupted', cb: () => void): this;
    on(evt: 'connectionBanned', cb: () => void): this;
    on(evt: 'refreshRecordingServiceStatus', cb: () => void): this;
    on(evt: 'streamMessage', cb: (uid: number, streamId: number, msg: string, len: number) => void): this;
    on(evt: 'streamMessageError', cb: (uid: number, streamId: number, code: number, missed: number, cached: number) => void): this;
    on(evt: 'mediaEngineStartCallSuccess', cb: () => void): this;
    on(evt: 'requestChannelKey', cb: () => void): this;
    on(evt: 'fristLocalAudioFrame', cb: (elapsed: number) => void): this;
    on(evt: 'firstRemoteAudioFrame', cb: (uid: number, elapsed: number) => void): this;
    on(evt: 'activeSpeaker', cb: (uid: number) => void): this;
    on(evt: 'clientRoleChanged', cb: (oldRole: ClientRoleType, newRole: ClientRoleType) => void): this;
    on(evt: 'audioDeviceVolumeChanged', cb: (deviceType: MediaDeviceType, volume: number, muted: boolean) => void): this;
    on(evt: 'videoSourceJoinedSuccess', cb: (uid: number) => void): this;
    on(evt: 'videoSourceRequestNewToken', cb: () => void): this;
    on(evt: 'videoSourceLeaveChannel', cb: () => void): this;
    on(evt: 'remoteVideoStateChanged', cb: (uid: number, state: RemoteVideoState) => void): this;
    on(evt: 'cameraFocusAreaChanged', cb: (x: number, y: number, width: number, height: number) => void): this;
    on(evt: 'cameraExposureAreaChanged', cb: (x: number, y: number, width: number, height: number) => void): this;
    on(evt: 'tokenPrivilegeWillExpire', cb: (token: string) => void): this;
    on(evt: 'streamPublished', cb: (url: string, error: number) => void): this;
    on(evt: 'streamUnpublished', cb: (url: string) => void): this;
    on(evt: 'transcodingUpdated', cb: () => void): this;
    on(evt: 'streamInjectStatus', cb: (url: string, uid: number, status: number) => void): this;
    on(evt: 'localPublishFallbackToAudioOnly', cb: (isFallbackOrRecover: boolean) => void): this;
    on(evt: 'remoteSubscribeFallbackToAudioOnly', cb: (uid: number, isFallbackOrRecover: boolean) => void): this;
    on(evt: 'microphoneEnabled', cb: (enabled: boolean) => void): this;
    on(evt: 'connectionStateChanged', cb: (state: ConnectionState, reason: ConnectionChangeReason) => void): this;
    on(evt: string, listener: Function): this;
    /**
     * In future lowercase event name will be deprecated
     */
    on(evt: 'apicallexecuted', cb: (api: string, err: number) => void): this;
    on(evt: 'warning', cb: (warn: number, msg: string) => void): this;
    on(evt: 'error', cb: (err: number, msg: string) => void): this;
    on(evt: 'joinedchannel', cb: (channel: string, uid: number, elapsed: number) => void): this;
    on(evt: 'rejoinedchannel', cb: (channel: string, uid: number, elapsed: number) => void): this;
    on(evt: 'audioquality', cb: (uid: number, quality: AgoraNetworkQuality, delay: number, lost: number) => void): this;
    on(evt: 'audiovolumeindication', cb: (uid: number, volume: number, speakerNumber: number, totalVolume: number) => void): this;
    on(evt: 'leavechannel', cb: () => void): this;
    on(evt: 'rtcstats', cb: (stats: RtcStats) => void): this;
    on(evt: 'localvideostats', cb: (stats: LocalVideoStats) => void): this;
    on(evt: 'remotevideostats', cb: (stats: RemoteVideoStats) => void): this;
    on(evt: 'audiodevicestatechanged', cb: (deviceId: string, deviceType: number, deviceState: number) => void): this;
    on(evt: 'audiomixingfinished', cb: () => void): this;
    on(evt: 'remoteaudiomixingbegin', cb: () => void): this;
    on(evt: 'remoteaudiomixingend', cb: () => void): this;
    on(evt: 'audioeffectfinished', cb: (soundId: number) => void): this;
    on(evt: 'videodevicestatechanged', cb: (deviceId: string, deviceType: number, deviceState: number) => void): this;
    on(evt: 'networkquality', cb: (uid: number, txquality: AgoraNetworkQuality, rxquality: AgoraNetworkQuality) => void): this;
    on(evt: 'lastmilequality', cb: (quality: AgoraNetworkQuality) => void): this;
    on(evt: 'firstlocalvideoframe', cb: (width: number, height: number, elapsed: number) => void): this;
    on(evt: 'addstream', cb: (uid: number, elapsed: number) => void): this;
    on(evt: 'videosizechanged', cb: (uid: number, width: number, height: number, rotation: number) => void): this;
    on(evt: 'firstremotevideoframe', cb: (uid: number, width: number, height: number, elapsed: number) => void): this;
    on(evt: 'userjoined', cb: (uid: number, elapsed: number) => void): this;
    on(evt: 'removestream', cb: (uid: number, reason: number) => void): this;
    on(evt: 'usermuteaudio', cb: (uid: number, muted: boolean) => void): this;
    on(evt: 'usermutevideo', cb: (uid: number, muted: boolean) => void): this;
    on(evt: 'userenablevideo', cb: (uid: number, enabled: boolean) => void): this;
    on(evt: 'userenablelocalvideo', cb: (uid: number, enabled: boolean) => void): this;
    on(evt: 'cameraready', cb: () => void): this;
    on(evt: 'videostopped', cb: () => void): this;
    on(evt: 'connectionlost', cb: () => void): this;
    on(evt: 'connectioninterrupted', cb: () => void): this;
    on(evt: 'connectionbanned', cb: () => void): this;
    on(evt: 'refreshrecordingservicestatus', cb: () => void): this;
    on(evt: 'streammessage', cb: (uid: number, streamId: number, msg: string, len: number) => void): this;
    on(evt: 'streammessageerror', cb: (uid: number, streamId: number, code: number, missed: number, cached: number) => void): this;
    on(evt: 'mediaenginestartcallsuccess', cb: () => void): this;
    on(evt: 'requestchannelkey', cb: () => void): this;
    on(evt: 'fristlocalaudioframe', cb: (elapsed: number) => void): this;
    on(evt: 'firstremoteaudioframe', cb: (uid: number, elapsed: number) => void): this;
    on(evt: 'activespeaker', cb: (uid: number) => void): this;
    on(evt: 'clientrolechanged', cb: (oldRole: ClientRoleType, newRole: ClientRoleType) => void): this;
    on(evt: 'audiodevicevolumechanged', cb: (deviceType: MediaDeviceType, volume: number, muted: boolean) => void): this;
    on(evt: 'videosourcejoinedsuccess', cb: (uid: number) => void): this;
    on(evt: 'videosourcerequestnewtoken', cb: () => void): this;
    on(evt: 'videosourceleavechannel', cb: () => void): this;
}
export default AgoraRtcEngine;
