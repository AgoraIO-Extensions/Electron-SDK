"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Renderer_1 = require("../Renderer");
const events_1 = require("events");
const agora = require('../build/Release/agora_node_ext');
/**
 * @class AgoraRtcEngine
 */
class AgoraRtcEngine extends events_1.EventEmitter {
    constructor() {
        super();
        this.rtcEngine = new agora.NodeRtcEngine();
        this.initEventHandler();
        this.streams = new Map();
        this.renderMode = this._checkWebGL() ? 1 : 2;
    }
    /**
     * Decide whether to use webgl or software rending
     * @param {1|2} mode - 1 for old webgl rendering, 2 for software rendering
     */
    setRenderMode(mode = 1) {
        this.renderMode = mode;
    }
    /**
     * @private
     * check if WebGL will be available with appropriate features
     * @returns {boolean}
     */
    _checkWebGL() {
        const canvas = document.createElement('canvas');
        let gl;
        canvas.width = 1;
        canvas.height = 1;
        const options = {
            // Turn off things we don't need
            alpha: false,
            depth: false,
            stencil: false,
            antialias: false,
            preferLowPowerToHighPerformance: true
            // Still dithering on whether to use this.
            // Recommend avoiding it, as it's overly conservative
            // failIfMajorPerformanceCaveat: true
        };
        try {
            gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
        }
        catch (e) {
            return false;
        }
        if (gl) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * init event handler
     * @private
     */
    initEventHandler() {
        const self = this;
        const fire = (event, ...args) => {
            setImmediate(() => {
                this.emit(event, ...args);
            });
        };
        this.rtcEngine.onEvent('apierror', (funcName) => {
            console.error(`api ${funcName} failed. this is an error
              thrown by c++ addon layer. it often means sth is
              going wrong with this function call and it refused
              to do what is asked. kindly check your parameter types
              to see if it matches properly.`);
        });
        this.rtcEngine.onEvent('joinchannel', function (channel, uid, elapsed) {
            fire('joinedchannel', channel, uid, elapsed);
            fire('joinedChannel', channel, uid, elapsed);
        });
        this.rtcEngine.onEvent('rejoinchannel', function (channel, uid, elapsed) {
            fire('rejoinedchannel', channel, uid, elapsed);
            fire('rejoinedChannel', channel, uid, elapsed);
        });
        this.rtcEngine.onEvent('warning', function (warn, msg) {
            fire('warning', warn, msg);
        });
        this.rtcEngine.onEvent('error', function (err, msg) {
            fire('error', err, msg);
        });
        this.rtcEngine.onEvent('audioquality', function (uid, quality, delay, lost) {
            fire('audioquality', uid, quality, delay, lost);
            fire('audioQuality', uid, quality, delay, lost);
        });
        this.rtcEngine.onEvent('audiovolumeindication', function (uid, volume, speakerNumber, totalVolume) {
            fire('audiovolumeindication', uid, volume, speakerNumber, totalVolume);
            fire('audioVolumeIndication', uid, volume, speakerNumber, totalVolume);
        });
        this.rtcEngine.onEvent('leavechannel', function () {
            fire('leavechannel');
            fire('leaveChannel');
        });
        this.rtcEngine.onEvent('rtcstats', function (stats) {
            fire('rtcstats', stats);
            fire('rtcStats', stats);
        });
        this.rtcEngine.onEvent('localvideostats', function (stats) {
            fire('localvideostats', stats);
            fire('localVideoStats', stats);
        });
        this.rtcEngine.onEvent('remotevideostats', function (stats) {
            fire('remotevideostats', stats);
            fire('remoteVideoStats', stats);
        });
        this.rtcEngine.onEvent('audiodevicestatechanged', function (deviceId, deviceType, deviceState) {
            fire('audiodevicestatechanged', deviceId, deviceType, deviceState);
            fire('audioDeviceStateChanged', deviceId, deviceType, deviceState);
        });
        this.rtcEngine.onEvent('audiomixingfinished', function () {
            fire('audiomixingfinished');
            fire('audioMixingFinished');
        });
        this.rtcEngine.onEvent('apicallexecuted', function (api, err) {
            fire('apicallexecuted', api, err);
            fire('apiCallExecuted', api, err);
        });
        this.rtcEngine.onEvent('remoteaudiomixingbegin', function () {
            fire('remoteaudiomixingbegin');
            fire('remoteAudioMixingBegin');
        });
        this.rtcEngine.onEvent('remoteaudiomixingend', function () {
            fire('remoteaudiomixingend');
            fire('remoteAudioMixingEnd');
        });
        this.rtcEngine.onEvent('audioeffectfinished', function (soundId) {
            fire('audioeffectfinished', soundId);
            fire('audioEffectFinished', soundId);
        });
        this.rtcEngine.onEvent('videodevicestatechanged', function (deviceId, deviceType, deviceState) {
            fire('videodevicestatechanged', deviceId, deviceType, deviceState);
            fire('videoDeviceStateChanged', deviceId, deviceType, deviceState);
        });
        this.rtcEngine.onEvent('networkquality', function (uid, txquality, rxquality) {
            fire('networkquality', uid, txquality, rxquality);
            fire('networkQuality', uid, txquality, rxquality);
        });
        this.rtcEngine.onEvent('lastmilequality', function (quality) {
            fire('lastmilequality', quality);
            fire('lastMileQuality', quality);
        });
        this.rtcEngine.onEvent('firstlocalvideoframe', function (width, height, elapsed) {
            fire('firstlocalvideoframe', width, height, elapsed);
            fire('firstLocalVideoFrame', width, height, elapsed);
        });
        this.rtcEngine.onEvent('firstremotevideodecoded', function (uid, width, height, elapsed) {
            fire('addstream', uid, elapsed);
            fire('addStream', uid, elapsed);
        });
        this.rtcEngine.onEvent('videosizechanged', function (uid, width, height, rotation) {
            fire('videosizechanged', uid, width, height, rotation);
            fire('videoSizeChanged', uid, width, height, rotation);
        });
        this.rtcEngine.onEvent('firstremotevideoframe', function (uid, width, height, elapsed) {
            fire('firstremotevideoframe', uid, width, height, elapsed);
            fire('firstRemoteVideoFrame', uid, width, height, elapsed);
        });
        this.rtcEngine.onEvent('userjoined', function (uid, elapsed) {
            console.log('user : ' + uid + ' joined.');
            fire('userjoined', uid, elapsed);
            fire('userJoined', uid, elapsed);
        });
        this.rtcEngine.onEvent('useroffline', function (uid, reason) {
            if (!self.streams) {
                self.streams = new Map();
                console.log('Warning!!!!!!, streams is undefined.');
                return;
            }
            self.streams[uid] = undefined;
            self.rtcEngine.unsubscribe(uid);
            fire('removestream', uid, reason);
            fire('removeStream', uid, reason);
        });
        this.rtcEngine.onEvent('usermuteaudio', function (uid, muted) {
            fire('usermuteaudio', uid, muted);
            fire('userMuteAudio', uid, muted);
        });
        this.rtcEngine.onEvent('usermutevideo', function (uid, muted) {
            fire('usermutevideo', uid, muted);
            fire('userMuteVideo', uid, muted);
        });
        this.rtcEngine.onEvent('userenablevideo', function (uid, enabled) {
            fire('userenablevideo', uid, enabled);
            fire('userEnableVideo', uid, enabled);
        });
        this.rtcEngine.onEvent('userenablelocalvideo', function (uid, enabled) {
            fire('userenablelocalvideo', uid, enabled);
            fire('userEnableLocalVideo', uid, enabled);
        });
        this.rtcEngine.onEvent('cameraready', function () {
            fire('cameraready');
            fire('cameraReady');
        });
        this.rtcEngine.onEvent('videostopped', function () {
            fire('videostopped');
            fire('videoStopped');
        });
        this.rtcEngine.onEvent('connectionlost', function () {
            fire('connectionlost');
            fire('connectionLost');
        });
        this.rtcEngine.onEvent('connectioninterrupted', function () {
            fire('connectioninterrupted');
            fire('connectionInterrupted');
        });
        this.rtcEngine.onEvent('connectionbanned', function () {
            fire('connectionbanned');
            fire('connectionBanned');
        });
        this.rtcEngine.onEvent('refreshrecordingservicestatus', function (status) {
            fire('refreshrecordingservicestatus', status);
            fire('refreshRecordingServiceStatus', status);
        });
        this.rtcEngine.onEvent('streammessage', function (uid, streamId, msg, len) {
            fire('streammessage', uid, streamId, msg, len);
            fire('streamMessage', uid, streamId, msg, len);
        });
        this.rtcEngine.onEvent('streammessageerror', function (uid, streamId, code, missed, cached) {
            fire('streammessageerror', uid, streamId, code, missed, cached);
            fire('streamMessageError', uid, streamId, code, missed, cached);
        });
        this.rtcEngine.onEvent('mediaenginestartcallsuccess', function () {
            fire('mediaenginestartcallsuccess');
            fire('mediaEngineStartCallSuccess');
        });
        this.rtcEngine.onEvent('requestchannelkey', function () {
            fire('requestchannelkey');
            fire('requestChannelKey');
        });
        this.rtcEngine.onEvent('fristlocalaudioframe', function (elapsed) {
            fire('firstlocalaudioframe', elapsed);
            fire('firstLocalAudioFrame', elapsed);
        });
        this.rtcEngine.onEvent('firstremoteaudioframe', function (uid, elapsed) {
            fire('firstremoteaudioframe', uid, elapsed);
            fire('firstRemoteAudioFrame', uid, elapsed);
        });
        this.rtcEngine.onEvent('remoteVideoStateChanged', function (uid, state) {
            fire('remoteVideoStateChanged', uid, state);
        });
        this.rtcEngine.onEvent('cameraFocusAreaChanged', function (x, y, width, height) {
            fire('cameraFocusAreaChanged', x, y, width, height);
        });
        this.rtcEngine.onEvent('cameraExposureAreaChanged', function (x, y, width, height) {
            fire('cameraExposureAreaChanged', x, y, width, height);
        });
        this.rtcEngine.onEvent('tokenPrivilegeWillExpire', function (token) {
            fire('tokenPrivilegeWillExpire', token);
        });
        this.rtcEngine.onEvent('streamPublished', function (url, error) {
            fire('streamPublished', url, error);
        });
        this.rtcEngine.onEvent('streamUnpublished', function (url) {
            fire('streamUnpublished', url);
        });
        this.rtcEngine.onEvent('transcodingUpdated', function () {
            fire('transcodingUpdated');
        });
        this.rtcEngine.onEvent('streamInjectStatus', function (url, uid, status) {
            fire('streamInjectStatus', url, uid, status);
        });
        this.rtcEngine.onEvent('localPublishFallbackToAudioOnly', function (isFallbackOrRecover) {
            fire('localPublishFallbackToAudioOnly', isFallbackOrRecover);
        });
        this.rtcEngine.onEvent('remoteSubscribeFallbackToAudioOnly', function (uid, isFallbackOrRecover) {
            fire('remoteSubscribeFallbackToAudioOnly', uid, isFallbackOrRecover);
        });
        this.rtcEngine.onEvent('microphoneEnabled', function (enabled) {
            fire('microphoneEnabled', enabled);
        });
        this.rtcEngine.onEvent('connectionStateChanged', function (state, reason) {
            fire('connectionStateChanged', state, reason);
        });
        this.rtcEngine.onEvent('activespeaker', function (uid) {
            fire('activespeaker', uid);
            fire('activeSpeaker', uid);
        });
        this.rtcEngine.onEvent('clientrolechanged', function (oldRole, newRole) {
            fire('clientrolechanged', oldRole, newRole);
            fire('clientRoleChanged', oldRole, newRole);
        });
        this.rtcEngine.onEvent('audiodevicevolumechanged', function (deviceType, volume, muted) {
            fire('audiodevicevolumechanged', deviceType, volume, muted);
            fire('audioDeviceVolumeChanged', deviceType, volume, muted);
        });
        this.rtcEngine.onEvent('videosourcejoinsuccess', function (uid) {
            fire('videosourcejoinedsuccess', uid);
            fire('videoSourceJoinedSuccess', uid);
        });
        this.rtcEngine.onEvent('videosourcerequestnewtoken', function () {
            fire('videosourcerequestnewtoken');
            fire('videoSourceRequestNewToken');
        });
        this.rtcEngine.onEvent('videosourceleavechannel', function () {
            fire('videosourceleavechannel');
            fire('videoSourceLeaveChannel');
        });
        this.rtcEngine.registerDeliverFrame(function (infos) {
            self.onRegisterDeliverFrame(infos);
        });
    }
    /**
     * @private
     * @param {number} type 0-local 1-remote 2-device_test 3-video_source
     * @param {number} uid uid get from native engine, differ from electron engine's uid
     */
    _getRenderer(type, uid) {
        if (type < 2) {
            if (uid === 0) {
                return this.streams.get('local');
            }
            else {
                return this.streams.get(String(uid));
            }
        }
        else if (type === 2) {
            // return this.streams.devtest;
            console.warn('Type 2 not support in production mode.');
            return false;
        }
        else if (type === 3) {
            return this.streams.get('videosource');
        }
        else {
            console.warn('Invalid type for getRenderer, only accept 0~3.');
            return false;
        }
    }
    /**
     * check if data is valid
     * @private
     * @param {*} header
     * @param {*} ydata
     * @param {*} udata
     * @param {*} vdata
     */
    _checkData(header, ydata, udata, vdata) {
        if (header.byteLength != 20) {
            console.error('invalid image header ' + header.byteLength);
            return false;
        }
        if (ydata.byteLength === 20) {
            console.error('invalid image yplane ' + ydata.byteLength);
            return false;
        }
        if (udata.byteLength === 20) {
            console.error('invalid image uplanedata ' + udata.byteLength);
            return false;
        }
        if (ydata.byteLength != udata.byteLength * 4 ||
            udata.byteLength != vdata.byteLength) {
            console.error('invalid image header ' +
                ydata.byteLength +
                ' ' +
                udata.byteLength +
                ' ' +
                vdata.byteLength);
            return false;
        }
        return true;
    }
    /**
     * register renderer for target info
     * @private
     * @param {number} infos
     */
    onRegisterDeliverFrame(infos) {
        const len = infos.length;
        for (let i = 0; i < len; i++) {
            const info = infos[i];
            const { type, uid, header, ydata, udata, vdata } = info;
            if (!header || !ydata || !udata || !vdata) {
                console.log('Invalid data param ： ' + header + ' ' + ydata + ' ' + udata + ' ' + vdata);
                continue;
            }
            const renderer = this._getRenderer(type, uid);
            if (!renderer) {
                console.warn("Can't find renderer for uid : " + uid);
                continue;
            }
            if (this._checkData(header, ydata, udata, vdata)) {
                renderer.drawFrame({
                    header,
                    yUint8Array: ydata,
                    uUint8Array: udata,
                    vUint8Array: vdata,
                });
            }
        }
    }
    /**
     * init renderer
     * @param {string|number} key key for the map that store the renderers, e.g, uid or `videosource` or `local`
     * @param {*} view dom elements to render video
     */
    initRender(key, view) {
        if (this.streams.has(String(key))) {
            this.destroyRender(key);
        }
        let renderer;
        if (this.renderMode === 1) {
            renderer = new Renderer_1.GlRenderer();
        }
        else if (this.renderMode === 2) {
            renderer = new Renderer_1.SoftwareRenderer();
        }
        else {
            console.warn('Unknown render mode, fallback to 1');
            renderer = new Renderer_1.GlRenderer();
        }
        renderer.bind(view);
        this.streams.set(String(key), renderer);
    }
    /**
     * destroy renderer
     * @param {string|number} key key for the map that store the renders, e.g, uid or `videosource` or `local`
     * @param {function} onFailure err callback for destroyRenderer
     */
    destroyRender(key, onFailure) {
        const renderer = this.streams[String(key)];
        try {
            renderer.unbind();
            this.streams.delete(String(key));
        }
        catch (err) {
            onFailure && onFailure(err);
        }
    }
    // ===========================================================================
    // BASIC METHODS
    // ===========================================================================
    /**
     * @description initialize agora real-time-communicating engine with appid
     * @param {string} appid agora appid
     * @returns {number} 0 for success, <0 for failure
     */
    initialize(appid) {
        return this.rtcEngine.initialize(appid);
    }
    /**
     * @description return current version and build of sdk
     * @returns {string} version
     */
    getVersion() {
        return this.rtcEngine.getVersion();
    }
    /**
     * @description Get error description of the given errorCode
     * @param {number} errorCode error code
     * @returns {string} error description
     */
    getErrorDescription(errorCode) {
        return this.rtcEngine.getErrorDescription(errorCode);
    }
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
    joinChannel(token, channel, info, uid) {
        return this.rtcEngine.joinChannel(token, channel, info, uid);
    }
    /**
     * @description Leave channel
     * @returns {number} 0 for success, <0 for failure
     */
    leaveChannel() {
        return this.rtcEngine.leaveChannel();
    }
    /**
     * @description This method sets high-quality audio preferences. Call this method and set all the three
     * modes before joining a channel. Do NOT call this method again after joining a channel.
     * @param {boolean} fullband enable/disable fullband codec
     * @param {boolean} stereo enable/disable stereo codec
     * @param {boolean} fullBitrate enable/disable high bitrate mode
     * @returns {number} 0 for success, <0 for failure
     */
    setHighQualityAudioParameters(fullband, stereo, fullBitrate) {
        return this.rtcEngine.setHighQualityAudioParameters(fullband, stereo, fullBitrate);
    }
    /**
     * @description subscribe remote uid and initialize corresponding renderer
     * @param {number} uid remote uid
     * @param {Element} view dom where to initialize renderer
     * @returns {number} 0 for success, <0 for failure
     */
    subscribe(uid, view) {
        this.initRender(uid, view);
        return this.rtcEngine.subscribe(uid);
    }
    /**
     * @description setup local video and corresponding renderer
     * @param {Element} view dom element where we will initialize our view
     * @returns {number} 0 for success, <0 for failure
     */
    setupLocalVideo(view) {
        this.initRender('local', view);
        return this.rtcEngine.setupLocalVideo();
    }
    /**
     *
     * @description force set renderer dimension of video, this ONLY affects size of data sent to js layer, native video size is determined by setVideoProfile
     * @param {*} rendertype type of renderer, 0 - local, 1 - remote, 2 - device test, 3 - video source
     * @param {*} uid target uid
     * @param {*} width target width
     * @param {*} height target height
     */
    setVideoRenderDimension(rendertype, uid, width, height) {
        this.rtcEngine.setVideoRenderDimension(rendertype, uid, width, height);
    }
    /**
     * @description force set renderer fps globally. This is mainly used to improve the performance for js rendering
     * once set, data will be forced to be sent with this fps. This can reduce cpu frequency of js rendering.
     * This applies to ALL views except ones added to High FPS stream.
     * @param {number} fps frame/s
     */
    setVideoRenderFPS(fps) {
        this.rtcEngine.setFPS(fps);
    }
    /**
     * @description force set renderer fps for high stream. High stream here MEANS uid streams which has been
     * added to high ones by calling addVideoRenderToHighFPS, note this has nothing to do with dual stream
     * high stream. This is often used when we want to set low fps for most of views, but high fps for one
     * or two special views, e.g. screenshare
     * @param {number} fps frame/s
     */
    setVideoRenderHighFPS(fps) {
        this.rtcEngine.setHighFPS(fps);
    }
    /**
     * @description add stream to high fps stream by uid. fps of streams added to high fps stream will be
     * controlled by setVideoRenderHighFPS
     * @param {number} uid stream uid
     */
    addVideoRenderToHighFPS(uid) {
        this.rtcEngine.addToHighVideo(uid);
    }
    /**
     * @description remove stream from high fps stream by uid. fps of streams removed from high fps stream
     * will be controlled by setVideoRenderFPS
     * @param {number} uid stream uid
     */
    remoteVideoRenderFromHighFPS(uid) {
        this.rtcEngine.removeFromHighVideo(uid);
    }
    /**
     * @description setup view content mode
     * @param {number} uid stream uid to operate
     * @param {0|1} mode view content mode, 0 - fill, 1 - fit
     * @returns {number} 0 - success, -1 - fail
     */
    setupViewContentMode(uid, mode) {
        if (this.streams.has(String(uid))) {
            const renderer = this.streams.get(String(uid));
            renderer.contentMode = mode;
            return 0;
        }
        else {
            return -1;
        }
    }
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
    renewToken(newtoken) {
        return this.rtcEngine.renewToken(newtoken);
    }
    /**
     * @description Set channel profile(before join channel) since sdk will do optimization according to scenario.
     * @description 0 (default) for communication, 1 for live broadcasting, 2 for in-game
     * @param {number} profile profile enum
     * @returns {number} 0 for success, <0 for failure
     */
    setChannelProfile(profile) {
        return this.rtcEngine.setChannelProfile(profile);
    }
    /**
     *
     * @description In live broadcasting mode, set client role, 1 for anchor, 2 for audience
     * @param {ClientRoleType} role client role
     * @param {string} permissionKey permission key
     * @returns {number} 0 for success, <0 for failure
     */
    setClientRole(role, permissionKey) {
        return this.rtcEngine.setClientRole(role, permissionKey);
    }
    /**
     * @description This method launches an audio call test to determine whether the audio devices
     * (for example, headset and speaker) and the network connection are working properly.
     * In the test, the user first speaks, and the recording is played back in 10 seconds.
     * If the user can hear the recording in 10 seconds, it indicates that the audio devices
     * and network connection work properly.
     * @returns {number} 0 for success, <0 for failure
     */
    startEchoTest() {
        return this.rtcEngine.startEchoTest();
    }
    /**
     * @description This method stops an audio call test.
     * @returns {number} 0 for success, <0 for failure
     */
    stopEchoTest() {
        return this.rtcEngine.stopEchoTest();
    }
    /**
     * @description This method tests the quality of the user’s network connection
     * and is disabled by default. Before users join a channel, they can call this
     * method to check the network quality. Calling this method consumes extra network
     * traffic, which may affect the communication quality. Call disableLastmileTest
     * to disable it immediately once users have received the onLastmileQuality
     * callback before they join the channel.
     * @returns {number} 0 for success, <0 for failure
     */
    enableLastmileTest() {
        return this.rtcEngine.enableLastmileTest();
    }
    /**
     * @description This method disables the network connection quality test.
     * @returns {number} 0 for success, <0 for failure
     */
    disableLastmileTest() {
        return this.rtcEngine.disableLastmileTest();
    }
    /**
     * @description Use before join channel to enable video communication, or you will only join with audio-enabled
     * @returns {number} 0 for success, <0 for failure
     */
    enableVideo() {
        return this.rtcEngine.enableVideo();
    }
    /**
     * @description Use to disable video and use pure audio communication
     * @returns {number} 0 for success, <0 for failure
     */
    disableVideo() {
        return this.rtcEngine.disableVideo();
    }
    /**
     * @description This method starts the local video preview. Before starting the preview,
     * always call setupLocalVideo to set up the preview window and configure the attributes,
     * and also call the enableVideo method to enable video. If startPreview is called to start
     * the local video preview before calling joinChannel to join a channel, the local preview
     * will still be in the started state after leaveChannel is called to leave the channel.
     * stopPreview can be called to close the local preview.
     * @returns {number} 0 for success, <0 for failure
     */
    startPreview() {
        return this.rtcEngine.startPreview();
    }
    /**
     * @description This method stops the local video preview and closes the video.
     * @returns {number} 0 for success, <0 for failure
     */
    stopPreview() {
        return this.rtcEngine.stopPreview();
    }
    /**
     *
     * @param {number} profile - enumeration values represent video profile
     * @param {boolean} [swapWidthAndHeight = false] - Whether to swap width and height
     * @returns {number} 0 for success, <0 for failure
     */
    setVideoProfile(profile, swapWidthAndHeight = false) {
        return this.rtcEngine.setVideoProfile(profile, swapWidthAndHeight);
    }
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
    setVideoEncoderConfiguration(config) {
        const { width = 640, height = 480, fps = 15, bitrate = 0, orientation = 0, minbitrate = -1 } = config;
        return this.rtcEngine.setVideoEncoderConfiguration(width, height, fps, bitrate, minbitrate, orientation);
    }
    /**
     * @description This method enables the audio mode, which is enabled by default.
     * @returns {number} 0 for success, <0 for failure
     */
    enableAudio() {
        return this.rtcEngine.enableAudio();
    }
    /**
     * @description This method disables the audio mode.
     * @returns {number} 0 for success, <0 for failure
     */
    disableAudio() {
        return this.rtcEngine.disableAudio();
    }
    /**
     * @description Set audio profile (before join channel) depending on your scenario
     * @param {number} profile 0: default, 1: speech standard, 2: music standard. 3: music standard stereo, 4: music high quality, 5: music high quality stereo
     * @param {number} scenario 0: default, 1: chatroom entertainment, 2: education, 3: game streaming, 4: showroom, 5: game chating
     * @returns {number} 0 for success, <0 for failure
     */
    setAudioProfile(profile, scenario) {
        return this.rtcEngine.setAudioProfile(profile, scenario);
    }
    /**
     * @description This method allows users to set video preferences.
     * @param {boolean} preferFrameRateOverImageQuality enable/disable framerate over image quality
     * @returns {number} 0 for success, <0 for failure
     */
    setVideoQualityParameters(preferFrameRateOverImageQuality) {
        return this.rtcEngine.setVideoQualityParameters(preferFrameRateOverImageQuality);
    }
    /**
     * @description Use setEncryptionSecret to specify an encryption password to enable built-in
     * encryption before joining a channel. All users in a channel must set the same encryption password.
     * The encryption password is automatically cleared once a user has left the channel.
     * If the encryption password is not specified or set to empty, the encryption function will be disabled.
     * @param {string} secret Encryption Password
     * @returns {number} 0 for success, <0 for failure
     */
    setEncryptionSecret(secret) {
        return this.rtcEngine.setEncryptionSecret(secret);
    }
    /**
     * @description This method mutes/unmutes local audio. It enables/disables
     * sending local audio streams to the network.
     * @param {boolean} mute mute/unmute audio
     * @returns {number} 0 for success, <0 for failure
     */
    muteLocalAudioStream(mute) {
        return this.rtcEngine.muteLocalAudioStream(mute);
    }
    /**
     * @description This method mutes/unmutes all remote users’ audio streams.
     * @param {boolean} mute mute/unmute audio
     * @returns {number} 0 for success, <0 for failure
     */
    muteAllRemoteAudioStreams(mute) {
        return this.rtcEngine.muteAllRemoteAudioStreams(mute);
    }
    /**
     * @description Stops receiving all remote users' audio streams by default.
     * @param {boolean} mute mute/unmute audio
     * @returns {number} 0 for success, <0 for failure
     */
    setDefaultMuteAllRemoteAudioStreams(mute) {
        return this.rtcEngine.setDefaultMuteAllRemoteAudioStreams(mute);
    }
    /**
     * @description This method mutes/unmutes a specified user’s audio stream.
     * @param {number} uid user to mute/unmute
     * @param {boolean} mute mute/unmute audio
     * @returns {number} 0 for success, <0 for failure
     */
    muteRemoteAudioStream(uid, mute) {
        return this.rtcEngine.muteRemoteAudioStream(uid, mute);
    }
    /**
     * @description This method mutes/unmutes video stream
     * @param {boolean} mute mute/unmute video
     * @returns {number} 0 for success, <0 for failure
     */
    muteLocalVideoStream(mute) {
        return this.rtcEngine.muteLocalVideoStream(mute);
    }
    /**
     * @description This method disables the local video, which is only applicable to
     * the scenario when the user only wants to watch the remote video without sending
     * any video stream to the other user. This method does not require a local camera.
     * @param {boolean} enable enable/disable video
     * @returns {number} 0 for success, <0 for failure
     */
    enableLocalVideo(enable) {
        return this.rtcEngine.enableLocalVideo(enable);
    }
    /**
     * @description This method mutes/unmutes all remote users’ video streams.
     * @param {boolean} mute mute/unmute video
     * @returns {number} 0 for success, <0 for failure
     */
    muteAllRemoteVideoStreams(mute) {
        return this.rtcEngine.muteAllRemoteVideoStreams(mute);
    }
    /**
     * @description Stops receiving all remote users’ video streams.
     * @param {boolean} mute mute/unmute audio
     * @returns {number} 0 for success, <0 for failure
     */
    setDefaultMuteAllRemoteVideoStreams(mute) {
        return this.rtcEngine.setDefaultMuteAllRemoteVideoStreams(mute);
    }
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
    enableAudioVolumeIndication(interval, smooth) {
        return this.rtcEngine.enableAudioVolumeIndication(interval, smooth);
    }
    /**
     * @description This method mutes/unmutes a specified user’s video stream.
     * @param {number} uid user to mute/unmute
     * @param {boolean} mute mute/unmute video
     * @returns {number} 0 for success, <0 for failure
     */
    muteRemoteVideoStream(uid, mute) {
        return this.rtcEngine.muteRemoteVideoStream(uid, mute);
    }
    /**
     * @description This method sets the in ear monitoring volume.
     * @param {number} volume Volume of the in-ear monitor, ranging from 0 to 100. The default value is 100.
     * @returns {number} 0 for success, <0 for failure
     */
    setInEarMonitoringVolume(volume) {
        return this.rtcEngine.setInEarMonitoringVolume(volume);
    }
    /**
     * @description disable audio function in channel, which will be recovered when leave channel.
     * @returns {number} 0 for success, <0 for failure
     */
    pauseAudio() {
        return this.rtcEngine.pauseAudio();
    }
    /**
     * @description resume audio function in channel.
     * @returns {number} 0 for success, <0 for failure
     */
    resumeAudio() {
        return this.rtcEngine.resumeAudio();
    }
    /**
     * @description set filepath of log
     * @param {string} filepath filepath of log
     * @returns {number} 0 for success, <0 for failure
     */
    setLogFile(filepath) {
        return this.rtcEngine.setLogFile(filepath);
    }
    /**
     * @description set filepath of videosource log (Called After videosource initialized)
     * @param {string} filepath filepath of log
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceSetLogFile(filepath) {
        return this.rtcEngine.videoSourceSetLogFile(filepath);
    }
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
    setLogFilter(filter) {
        return this.rtcEngine.setLogFilter(filter);
    }
    /**
     * @description This method sets the stream mode (only applicable to live broadcast) to
     * single- (default) or dual-stream mode.
     * @param {boolean} enable enable/disable dual stream
     * @returns {number} 0 for success, <0 for failure
     */
    enableDualStreamMode(enable) {
        return this.rtcEngine.enableDualStreamMode(enable);
    }
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
    setRemoteVideoStreamType(uid, streamType) {
        return this.rtcEngine.setRemoteVideoStreamType(uid, streamType);
    }
    /**
     * @description This method sets the default remote video stream type to high or low.
     * @param {StreamType} streamType 0 - high, 1 - low
     * @returns {number} 0 for success, <0 for failure
     */
    setRemoteDefaultVideoStreamType(streamType) {
        return this.rtcEngine.setRemoteDefaultVideoStreamType(streamType);
    }
    /**
     * @description This method enables interoperability with the Agora Web SDK.
     * @param {boolean} enable enable/disable interop
     * @returns {number} 0 for success, <0 for failure
     */
    enableWebSdkInteroperability(enable) {
        return this.rtcEngine.enableWebSdkInteroperability(enable);
    }
    /**
     * @description This method sets the local video mirror mode. Use this method before startPreview,
     * or it does not take effect until you re-enable startPreview.
     * @param {number} mirrortype mirror type
     * 0: The default mirror mode, that is, the mode set by the SDK
     * 1: Enable the mirror mode
     * 2: Disable the mirror mode
     * @returns {number} 0 for success, <0 for failure
     */
    setLocalVideoMirrorMode(mirrortype) {
        return this.rtcEngine.setLocalVideoMirrorMode(mirrortype);
    }
    /**
     * @description Changes the voice pitch of the local speaker.
     * @param {number} pitch - The value ranges between 0.5 and 2.0.
     * The lower the value, the lower the voice pitch.
     * The default value is 1.0 (no change to the local voice pitch).
     * @returns {number} 0 for success, <0 for failure
     */
    setLocalVoicePitch(pitch) {
        return this.rtcEngine.setLocalVoicePitch(pitch);
    }
    /**
     * @description Sets the local voice equalization effect.
     * @param {number} bandFrequency - Sets the band frequency.
     * The value ranges between 0 and 9, representing the respective 10-band center frequencies of the voice effects
     * including 31, 62, 125, 500, 1k, 2k, 4k, 8k, and 16k Hz.
     * @param {number} bandGain - Sets the gain of each band in dB. The value ranges between -15 and 15.
     * @returns {number} 0 for success, <0 for failure
     */
    setLocalVoiceEqualization(bandFrequency, bandGain) {
        return this.rtcEngine.setLocalVoiceEqualization(bandFrequency, bandGain);
    }
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
    setLocalVoiceReverb(reverbKey, value) {
        return this.rtcEngine.setLocalVoiceReverb(reverbKey, value);
    }
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
    setLocalPublishFallbackOption(option) {
        return this.rtcEngine.setLocalPublishFallbackOption(option);
    }
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
    setRemoteSubscribeFallbackOption(option) {
        return this.rtcEngine.setRemoteSubscribeFallbackOption(option);
    }
    // ===========================================================================
    // DEVICE MANAGEMENT
    // ===========================================================================
    /**
     * @description This method sets the external audio source.
     * @param {boolean} enabled Enable the function of the external audio source: true/false.
     * @param {number} samplerate Sampling rate of the external audio source.
     * @param {number} channels Number of the external audio source channels (two channels maximum).
     * @returns {number} 0 for success, <0 for failure
     */
    setExternalAudioSource(enabled, samplerate, channels) {
        return this.rtcEngine.setExternalAudioSource(enabled, samplerate, channels);
    }
    /**
     * @description return list of video devices
     * @returns {Array} array of device object
     */
    getVideoDevices() {
        return this.rtcEngine.getVideoDevices();
    }
    /**
     * @description set video device to use via device id
     * @param {string} deviceId device id
     * @returns {number} 0 for success, <0 for failure
     */
    setVideoDevice(deviceId) {
        return this.rtcEngine.setVideoDevice(deviceId);
    }
    /**
     * @description get current using video device
     * @return {Object} video device object
     */
    getCurrentVideoDevice() {
        return this.rtcEngine.getCurrentVideoDevice();
    }
    /**
     * @description This method tests whether the video-capture device works properly.
     * Before calling this method, ensure that you have already called enableVideo,
     * and the HWND window handle of the incoming parameter is valid.
     * @returns {number} 0 for success, <0 for failure
     */
    startVideoDeviceTest() {
        return this.rtcEngine.startVideoDeviceTest();
    }
    /**
     * @description stop video device test
     * @returns {number} 0 for success, <0 for failure
     */
    stopVideoDeviceTest() {
        return this.rtcEngine.stopVideoDeviceTest();
    }
    /**
     * @description return list of audio playback devices
     * @returns {Array} array of device object
     */
    getAudioPlaybackDevices() {
        return this.rtcEngine.getAudioPlaybackDevices();
    }
    /**
     * @description set audio playback device to use via device id
     * @param {string} deviceId device id
     * @returns {number} 0 for success, <0 for failure
     */
    setAudioPlaybackDevice(deviceId) {
        return this.rtcEngine.setAudioPlaybackDevice(deviceId);
    }
    /**
     * @description Retrieves the audio playback device information associated with the device ID and device name
     * @param {string} deviceId device id
     * @param {string} deviceName device name
     * @returns {number} 0 for success, <0 for failure
     */
    getPlaybackDeviceInfo(deviceId, deviceName) {
        return this.rtcEngine.getPlaybackDeviceInfo(deviceId, deviceName);
    }
    /**
     * @description get current using audio playback device
     * @return {Object} audio playback device object
     */
    getCurrentAudioPlaybackDevice() {
        return this.rtcEngine.getCurrentAudioPlaybackDevice();
    }
    /**
     * @description set device playback volume
     * @param {number} volume 0 - 255
     * @returns {number} 0 for success, <0 for failure
     */
    setAudioPlaybackVolume(volume) {
        return this.rtcEngine.setAudioPlaybackVolume(volume);
    }
    /**
     * @description get device playback volume
     * @returns {number} volume
     */
    getAudioPlaybackVolume() {
        return this.rtcEngine.getAudioPlaybackVolume();
    }
    /**
     * @description get audio recording devices
     * @returns {Array} array of recording devices
     */
    getAudioRecordingDevices() {
        return this.rtcEngine.getAudioRecordingDevices();
    }
    /**
     * @description set audio recording device
     * @param {string} deviceId device id
     * @returns {number} 0 for success, <0 for failure
     */
    setAudioRecordingDevice(deviceId) {
        return this.rtcEngine.setAudioRecordingDevice(deviceId);
    }
    /**
     * @description Retrieves the audio recording device information associated with the device ID and device name.
     * @param {string} deviceId device id
     * @param {string} deviceName device name
     * @returns {number} 0 for success, <0 for failure
     */
    getRecordingDeviceInfo(deviceId, deviceName) {
        return this.rtcEngine.getRecordingDeviceInfo(deviceId, deviceName);
    }
    /**
     * @description get current selected audio recording device
     * @returns {Object} audio recording device object
     */
    getCurrentAudioRecordingDevice() {
        return this.rtcEngine.getCurrentAudioRecordingDevice();
    }
    /**
     * @description get audio recording volume
     * @return {number} volume
     */
    getAudioRecordingVolume() {
        return this.rtcEngine.getAudioRecordingVolume();
    }
    /**
     * @description set audio recording device volume
     * @param {number} volume 0 - 255
     * @returns {number} 0 for success, <0 for failure
     */
    setAudioRecordingVolume(volume) {
        return this.rtcEngine.setAudioRecordingVolume(volume);
    }
    /**
     * @description This method checks whether the playback device works properly. The SDK plays an audio file
     * specified by the user. If the user can hear the sound, then the playback device works properly.
     * @param {string} filepath filepath of sound file to play test
     * @returns {number} 0 for success, <0 for failure
     */
    startAudioPlaybackDeviceTest(filepath) {
        return this.rtcEngine.startAudioPlaybackDeviceTest(filepath);
    }
    /**
     * @description stop playback device test
     * @returns {number} 0 for success, <0 for failure
     */
    stopAudioPlaybackDeviceTest() {
        return this.rtcEngine.stopAudioPlaybackDeviceTest();
    }
    /**
     * @description This method enables loopback recording. Once enabled, the SDK collects all local sounds.
     * @param {boolean} [enable = false] whether to enable loop back recording
     * @returns {number} 0 for success, <0 for failure
     */
    enableLoopbackRecording(enable = false) {
        return this.rtcEngine.enableLoopbackRecording(enable);
    }
    /**
     * @description This method checks whether the microphone works properly. Once the test starts, the SDK uses
     * the onAudioVolumeIndication callback to notify the application about the volume information.
     * @param {number} indicateInterval in second
     * @returns {number} 0 for success, <0 for failure
     */
    startAudioRecordingDeviceTest(indicateInterval) {
        return this.rtcEngine.startAudioRecordingDeviceTest(indicateInterval);
    }
    /**
     * @description stop audio recording device test
     * @returns {number} 0 for success, <0 for failure
     */
    stopAudioRecordingDeviceTest() {
        return this.rtcEngine.stopAudioRecordingDeviceTest();
    }
    /**
     * @description check whether selected audio playback device is muted
     * @returns {boolean} muted/unmuted
     */
    getAudioPlaybackDeviceMute() {
        return this.rtcEngine.getAudioPlaybackDeviceMute();
    }
    /**
     * @description set current audio playback device mute/unmute
     * @param {boolean} mute mute/unmute
     * @returns {number} 0 for success, <0 for failure
     */
    setAudioPlaybackDeviceMute(mute) {
        return this.rtcEngine.setAudioPlaybackDeviceMute(mute);
    }
    /**
     * @description check whether selected audio recording device is muted
     * @returns {boolean} muted/unmuted
     */
    getAudioRecordingDeviceMute() {
        return this.rtcEngine.getAudioRecordingDeviceMute();
    }
    /**
     * @description set current audio recording device mute/unmute
     * @param {boolean} mute mute/unmute
     * @returns {number} 0 for success, <0 for failure
     */
    setAudioRecordingDeviceMute(mute) {
        return this.rtcEngine.setAudioRecordingDeviceMute(mute);
    }
    // ===========================================================================
    // VIDEO SOURCE
    // NOTE. video source is mainly used to do screenshare, the api basically
    // aligns with normal sdk apis, e.g. videoSourceInitialize vs initialize.
    // it is used to do screenshare with a separate process, in that case
    // it allows user to do screensharing and camera stream pushing at the
    // same time - which is not allowed in single sdk process.
    // if you only need to display camera and screensharing one at a time
    // use sdk original screenshare, if you want both, use video source.
    // ===========================================================================
    /**
     * @description initialize agora real-time-communicating videosource with appid
     * @param {string} appId agora appid
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceInitialize(appId) {
        return this.rtcEngine.videoSourceInitialize(appId);
    }
    /**
     * @description setup renderer for video source
     * @param {Element} view dom element where video source should be displayed
     */
    setupLocalVideoSource(view) {
        this.initRender('videosource', view);
    }
    /**
     * @description Set it to true to enable videosource web interoperability (After videosource initialized)
     * @param {boolean} enabled enalbe/disable web interoperability
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceEnableWebSdkInteroperability(enabled) {
        return this.rtcEngine.videoSourceEnableWebSdkInteroperability(enabled);
    }
    /**
     *
     * @description let video source join channel with token, channel, channel_info and uid
     * @param {string} token token
     * @param {string} cname channel
     * @param {string} info channel info
     * @param {number} uid uid
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceJoin(token, cname, info, uid) {
        return this.rtcEngine.videoSourceJoin(token, cname, info, uid);
    }
    /**
     * @description let video source Leave channel
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceLeave() {
        return this.rtcEngine.videoSourceLeave();
    }
    /**
     * @description This method updates the Token for video source
     * @param {string} token new token to update
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceRenewToken(token) {
        return this.rtcEngine.videoSourceRenewToken(token);
    }
    /**
     * @description Set channel profile (after ScreenCapture2) for video source
     * @description 0 (default) for communication, 1 for live broadcasting, 2 for in-game
     * @param {number} profile profile
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceSetChannelProfile(profile) {
        return this.rtcEngine.videoSourceSetChannelProfile(profile);
    }
    /**
     * @description set video profile for video source (must be called after startScreenCapture2)
     * @param {number} profile - enumeration values represent video profile
     * @param {boolean} [swapWidthAndHeight = false] - Whether to swap width and height
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceSetVideoProfile(profile, swapWidthAndHeight = false) {
        return this.rtcEngine.videoSourceSetVideoProfile(profile, swapWidthAndHeight);
    }
    /**
     * @description get list of all system window ids and relevant infos, the window id can be used for screen share
     * @returns {Array} list of window infos
     */
    getScreenWindowsInfo() {
        return this.rtcEngine.getScreenWindowsInfo();
    }
    /**
     * @description start video source screen capture
     * @param {number} wndid windows id to capture
     * @param {number} captureFreq fps of video source screencapture, 1 - 15
     * @param {*} rect null/if specified, e.g, {left: 0, right: 100, top: 0, bottom: 100} (relative distance from the left-top corner of the screen)
     * @param {number} bitrate bitrate of video source screencapture
     * @returns {number} 0 for success, <0 for failure
     */
    startScreenCapture2(windowId, captureFreq, rect, bitrate) {
        return this.rtcEngine.startScreenCapture2(windowId, captureFreq, rect, bitrate);
    }
    /**
     * @description stop video source screen capture
     * @returns {number} 0 for success, <0 for failure
     */
    stopScreenCapture2() {
        return this.rtcEngine.stopScreenCapture2();
    }
    /**
     * @description start video source preview
     * @returns {number} 0 for success, <0 for failure
     */
    startScreenCapturePreview() {
        return this.rtcEngine.videoSourceStartPreview();
    }
    /**
     * @description stop video source preview
     * @returns {number} 0 for success, <0 for failure
     */
    stopScreenCapturePreview() {
        return this.rtcEngine.videoSourceStopPreview();
    }
    /**
     * @description enable dual stream mode for video source
     * @param {boolean} enable whether dual stream mode is enabled
     * @return {number} 0 for success, <0 for failure
     */
    videoSourceEnableDualStreamMode(enable) {
        return this.rtcEngine.videoSourceEnableDualStreamMode(enable);
    }
    /**
     * @description setParameters for video source
     * @param {string} parameter parameter to set
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceSetParameters(parameter) {
        return this.rtcEngine.videoSourceSetParameter(parameter);
    }
    /**
     * @description release video source object
     * @returns {number} 0 for success, <0 for failure
     */
    videoSourceRelease() {
        return this.rtcEngine.videoSourceRelease();
    }
    // ===========================================================================
    // SCREEN SHARE
    // When this api is called, your camera stream will be replaced with
    // screenshare view. i.e. you can only see camera video or screenshare
    // one at a time via this section's api
    // ===========================================================================
    /**
     * @description start screen capture
     * @param {number} windowId windows id to capture
     * @param {number} captureFreq fps of screencapture, 1 - 15
     * @param {*} rect null/if specified, e.g, {left: 0, right: 100, top: 0, bottom: 100} (relative distance from the left-top corner of the screen)
     * @param {number} bitrate bitrate of screencapture
     * @returns {number} 0 for success, <0 for failure
     */
    startScreenCapture(windowId, captureFreq, rect, bitrate) {
        return this.rtcEngine.startScreenCapture(windowId, captureFreq, rect, bitrate);
    }
    /**
     * @description stop screen capture
     * @returns {number} 0 for success, <0 for failure
     */
    stopScreenCapture() {
        return this.rtcEngine.stopScreenCapture();
    }
    /**
     * @description This method updates the screen capture region.
     * @param {*} rect {left: 0, right: 100, top: 0, bottom: 100} (relative distance from the left-top corner of the screen)
     * @returns {number} 0 for success, <0 for failure
     */
    updateScreenCaptureRegion(rect) {
        return this.rtcEngine.updateScreenCaptureRegion(rect);
    }
    // ===========================================================================
    // AUDIO MIXING
    // ===========================================================================
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
    startAudioMixing(filepath, loopback, replace, cycle) {
        return this.rtcEngine.startAudioMixing(filepath, loopback, replace, cycle);
    }
    /**
     * @description This method stops audio mixing. Call this API when you are in a channel.
     * @returns {number} 0 for success, <0 for failure
     */
    stopAudioMixing() {
        return this.rtcEngine.stopAudioMixing();
    }
    /**
     * @description This method pauses audio mixing. Call this API when you are in a channel.
     * @returns {number} 0 for success, <0 for failure
     */
    pauseAudioMixing() {
        return this.rtcEngine.pauseAudioMixing();
    }
    /**
     * @description This method resumes audio mixing from pausing. Call this API when you are in a channel.
     * @returns {number} 0 for success, <0 for failure
     */
    resumeAudioMixing() {
        return this.rtcEngine.resumeAudioMixing();
    }
    /**
     * @description This method adjusts the volume during audio mixing. Call this API when you are in a channel.
     * @param {number} volume Volume ranging from 0 to 100. By default, 100 is the original volume.
     * @returns {number} 0 for success, <0 for failure
     */
    adjustAudioMixingVolume(volume) {
        return this.rtcEngine.adjustAudioMixingVolume(volume);
    }
    /**
     * @description Adjusts the audio mixing volume for local playback.
     * @param {number} volume Volume ranging from 0 to 100. By default, 100 is the original volume.
     * @returns {number} 0 for success, <0 for failure
     */
    adjustAudioMixingPlayoutVolume(volume) {
        return this.rtcEngine.adjustAudioMixingPlayoutVolume(volume);
    }
    /**
     * @description Adjusts the audio mixing volume for publishing (for remote users).
     * @param {number} volume Volume ranging from 0 to 100. By default, 100 is the original volume.
     * @returns {number} 0 for success, <0 for failure
     */
    adjustAudioMixingPublishVolume(volume) {
        return this.rtcEngine.adjustAudioMixingPublishVolume(volume);
    }
    /**
     * @description This method gets the duration (ms) of the audio mixing. Call this API when you are in
     * a channel. A return value of 0 means that this method call has failed.
     * @returns {number} duration of audio mixing
     */
    getAudioMixingDuration() {
        return this.rtcEngine.getAudioMixingDuration();
    }
    /**
     * @description This method gets the playback position (ms) of the audio. Call this API
     * when you are in a channel.
     * @returns {number} current playback position
     */
    getAudioMixingCurrentPosition() {
        return this.rtcEngine.getAudioMixingCurrentPosition();
    }
    /**
     * @description This method drags the playback progress bar of the audio mixing file to where
     * you want to play instead of playing it from the beginning.
     * @param {number} position Integer. The position of the audio mixing file in ms
     * @returns {number} 0 for success, <0 for failure
     */
    setAudioMixingPosition(position) {
        return this.rtcEngine.setAudioMixingPosition(position);
    }
    // ===========================================================================
    // CDN STREAMING
    // ===========================================================================
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
    addPublishStreamUrl(url, transcodingEnabled) {
        return this.rtcEngine.addPublishStreamUrl(url, transcodingEnabled);
    }
    /**
     * @description Removes a stream RTMP URL address. (CDN live only.)
     * @note
     * - This method removes only one RTMP URL address each time it is called.
     * - The RTMP URL address must not contain special characters, such as Chinese language characters.
     * @param {string} url Pointer to the RTMP URL address to be removed.
     * @returns {number} 0 for success, <0 for failure
     */
    removePublishStreamUrl(url) {
        return this.rtcEngine.removePublishStreamUrl(url);
    }
    /**
     * @description Sets the video layout and audio settings for CDN live. (CDN live only.)
     * @param {TranscodingConfig} transcoding transcoding Sets the CDN live audio/video transcoding settings. See LiveTranscoding.
     * @returns {number} 0 for success, <0 for failure
     */
    setLiveTranscoding(transcoding) {
        return this.rtcEngine.setLiveTranscoding(transcoding);
    }
    // ===========================================================================
    // STREAM INJECTION
    // ===========================================================================
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
    addInjectStreamUrl(url, config) {
        return this.rtcEngine.addInjectStreamUrl(url, config);
    }
    /**
     * @description Removes the voice or video stream HTTP/HTTPS URL address from a live broadcast.
     * @note If this method is called successfully, the \ref IRtcEngineEventHandler::onUserOffline "onUserOffline" callback is triggered
     * and a stream uid of 666 is returned.
     * @param {string} url Pointer to the HTTP/HTTPS URL address of the added stream to be removed.
     * @returns {number} 0 for success, <0 for failure
     */
    removeInjectStreamUrl(url) {
        return this.rtcEngine.removeInjectStreamUrl(url);
    }
    // ===========================================================================
    // RAW DATA
    // ===========================================================================
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
    setRecordingAudioFrameParameters(sampleRate, channel, mode, samplesPerCall) {
        return this.rtcEngine.setRecordingAudioFrameParameters(sampleRate, channel, mode, samplesPerCall);
    }
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
    setPlaybackAudioFrameParameters(sampleRate, channel, mode, samplesPerCall) {
        return this.rtcEngine.setPlaybackAudioFrameParameters(sampleRate, channel, mode, samplesPerCall);
    }
    /**
     * This method sets the format of the callback data in onMixedAudioFrame.
     * @param {number} sampleRate Specifies the sampling rate in the callback data returned by onMixedAudioFrame,
     * which can set be as 8000, 16000, 32000, 44100, or 48000.
     * @param {number} samplesPerCall Specifies the sampling points in the called data returned in onMixedAudioFrame,
     * for example, it is usually set as 1024 for stream pushing.
     * @returns {number} 0 for success, <0 for failure
     */
    setMixedAudioFrameParameters(sampleRate, samplesPerCall) {
        return this.rtcEngine.setMixedAudioFrameParameters(sampleRate, samplesPerCall);
    }
    // ===========================================================================
    // DATA CHANNEL
    // ===========================================================================
    /**
     * @description This method creates a data stream. Each user can only have up to five data channels at the same time.
     * @param {boolean} reliable true - The recipients will receive data from the sender within 5 seconds. If the recipient does not receive the sent data within 5 seconds, the data channel will report an error to the application.
     * false - The recipients may not receive any data, while it will not report any error upon data missing.
     * @param {boolean} ordered true - The recipients will receive data in the order of the sender.
     * false - The recipients will not receive data in the order of the sender.
     * @returns {number} <0 for failure, > 0 for stream id of data
     */
    createDataStream(reliable, ordered) {
        return this.rtcEngine.createDataStream(reliable, ordered);
    }
    /**
     * @description This method sends data stream messages to all users in a channel.
     * Up to 30 packets can be sent per second in a channel with each packet having a maximum size of 1 kB.
     * The API controls the data channel transfer rate. Each client can send up to 6 kB of data per second.
     * Each user can have up to five data channels simultaneously.
     * @param {number} streamId Stream ID from createDataStream
     * @param {string} msg Data to be sent
     * @returns {number} 0 for success, <0 for failure
     */
    sendStreamMessage(streamId, msg) {
        return this.rtcEngine.sendStreamMessage(streamId, msg);
    }
    // ===========================================================================
    // MANAGE AUDIO EFFECT
    // ===========================================================================
    /**
     * @description get effects volume
     * @returns {number} volume
     */
    getEffectsVolume() {
        return this.rtcEngine.getEffectsVolume();
    }
    /**
     * @description set effects volume
     * @param {number} volume - [0.0, 100.0]
     * @returns {number} 0 for success, <0 for failure
     */
    setEffectsVolume(volume) {
        return this.rtcEngine.setEffectsVolume(volume);
    }
    /**
     * @description set effect volume of a sound id
     * @param {number} soundId soundId
     * @param {number} volume - [0.0, 100.0]
     * @returns {number} 0 for success, <0 for failure
     */
    setVolumeOfEffect(soundId, volume) {
        return this.rtcEngine.setVolumeOfEffect(soundId, volume);
    }
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
    playEffect(soundId, filePath, loopcount, pitch, pan, gain, publish) {
        return this.rtcEngine.playEffect(soundId, filePath, loopcount, pitch, pan, gain, publish);
    }
    /**
     * @description stop effect via given sound id
     * @param {number} soundId soundId
     * @returns {number} 0 for success, <0 for failure
     */
    stopEffect(soundId) {
        return this.rtcEngine.stopEffect(soundId);
    }
    /**
     * @description preload effect
     * @param {number} soundId soundId
     * @param {string} filePath filepath
     * @returns {number} 0 for success, <0 for failure
     */
    preloadEffect(soundId, filePath) {
        return this.rtcEngine.preloadEffect(soundId, filePath);
    }
    /**
     * This method releases a specific preloaded audio effect from the memory.
     * @param {number} soundId soundId
     * @returns {number} 0 for success, <0 for failure
     */
    unloadEffect(soundId) {
        return this.rtcEngine.unloadEffect(soundId);
    }
    /**
     * @description This method pauses a specific audio effect.
     * @param {number} soundId soundId
     * @returns {number} 0 for success, <0 for failure
     */
    pauseEffect(soundId) {
        return this.rtcEngine.pauseEffect(soundId);
    }
    /**
     * @description This method pauses all the audio effects.
     * @returns {number} 0 for success, <0 for failure
     */
    pauseAllEffects() {
        return this.rtcEngine.pauseAllEffects();
    }
    /**
     * @description This method resumes playing a specific audio effect.
     * @param {number} soundId sound id
     * @returns {number} 0 for success, <0 for failure
     */
    resumeEffect(soundId) {
        return this.rtcEngine.resumeEffect(soundId);
    }
    /**
     * @description This method resumes playing all the audio effects.
     * @returns {number} 0 for success, <0 for failure
     */
    resumeAllEffects() {
        return this.rtcEngine.resumeAllEffects();
    }
    // ===========================================================================
    // EXTRA
    // ===========================================================================
    /**
     * @description When a user joins a channel on a client using joinChannelByToken,
     * a CallId is generated to identify the call from the client. Some methods such
     * as rate and complain need to be called after the call ends in order to submit
     * feedback to the SDK. These methods require assigned values of the CallId parameters.
     * To use these feedback methods, call the getCallId method to retrieve the CallId during the call,
     * and then pass the value as an argument in the feedback methods after the call ends.
     * @returns {string} Current call ID.
     */
    getCallId() {
        return this.rtcEngine.getCallId();
    }
    /**
     * @description This method lets the user rate the call. It is usually called after the call ends.
     * @param {string} callId Call ID retrieved from the getCallId method.
     * @param {number} rating Rating for the call between 1 (lowest score) to 10 (highest score).
     * @param {string} desc A given description for the call with a length less than 800 bytes.
     * @returns {number} 0 for success, <0 for failure
     */
    rate(callId, rating, desc) {
        return this.rtcEngine.rate(callId, rating, desc);
    }
    /**
     * @description This method allows the user to complain about the call quality. It is usually
     * called after the call ends.
     * @param {string} callId Call ID retrieved from the getCallId method.
     * @param {string} desc A given description of the call with a length less than 800 bytes.
     * @returns {number} 0 for success, <0 for failure
     */
    complain(callId, desc) {
        return this.rtcEngine.complain(callId, desc);
    }
    // ===========================================================================
    // replacement for setParameters call
    // ===========================================================================
    setBool(key, value) {
        return this.rtcEngine.setBool(key, value);
    }
    setInt(key, value) {
        return this.rtcEngine.setInt(key, value);
    }
    setUInt(key, value) {
        return this.rtcEngine.setUInt(key, value);
    }
    setNumber(key, value) {
        return this.rtcEngine.setNumber(key, value);
    }
    setString(key, value) {
        return this.rtcEngine.setString(key, value);
    }
    setObject(key, value) {
        return this.rtcEngine.setObject(key, value);
    }
    getBool(key) {
        return this.rtcEngine.getBool(key);
    }
    getInt(key) {
        return this.rtcEngine.getInt(key);
    }
    getUInt(key) {
        return this.rtcEngine.getUInt(key);
    }
    getNumber(key) {
        return this.rtcEngine.getNumber(key);
    }
    getString(key) {
        return this.rtcEngine.getString(key);
    }
    getObject(key) {
        return this.rtcEngine.getObject(key);
    }
    getArray(key) {
        return this.rtcEngine.getArray(key);
    }
    setParameters(param) {
        return this.rtcEngine.setParameters(param);
    }
    convertPath(path) {
        return this.rtcEngine.convertPath(path);
    }
    setProfile(profile, merge) {
        return this.rtcEngine.setProfile(profile, merge);
    }
}
exports.default = AgoraRtcEngine;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy9BcGkvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQ0FBc0U7QUFnQnRFLG1DQUFzQztBQUN0QyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUd6RDs7R0FFRztBQUNILE1BQU0sY0FBZSxTQUFRLHFCQUFZO0lBSXZDO1FBQ0UsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzNDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVEOzs7T0FHRztJQUNILGFBQWEsQ0FBRSxPQUFZLENBQUM7UUFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxXQUFXO1FBQ1QsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoRCxJQUFJLEVBQUUsQ0FBQztRQUVQLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBRWxCLE1BQU0sT0FBTyxHQUFHO1lBQ2QsZ0NBQWdDO1lBQ2hDLEtBQUssRUFBRSxLQUFLO1lBQ1osS0FBSyxFQUFFLEtBQUs7WUFDWixPQUFPLEVBQUUsS0FBSztZQUNkLFNBQVMsRUFBRSxLQUFLO1lBQ2hCLCtCQUErQixFQUFFLElBQUk7WUFFckMsMENBQTBDO1lBQzFDLHFEQUFxRDtZ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