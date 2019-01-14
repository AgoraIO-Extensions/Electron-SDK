import EventEmitter from 'events';
import Renderer from './Renderer';
import OldRenderer from './OldRenderer';
import {
  RtcStats,
  LocalVideoStats,
  RemoteVideoStats,
  NodeRtcEngine,
  AgoraNetworkQuality,
} from './types/AgoraSdk';
const agora = require('../build/Release/agora_node_ext');

/**
 * @class AgoraRtcEngine
 */
export default class AgoraRtcEngine extends EventEmitter {
  rtcEngine: NodeRtcEngine;
  streams: Map<number, Renderer>;
  renderMode: 1 | 2;
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
  setRenderMode (mode: 1|2 = 1): void {
    this.renderMode = mode;
  }

  /**
   * @private
   * check if WebGL will be available with appropriate features
   * @returns {boolean}
   */
  _checkWebGL(): boolean {
    let canvas = document.createElement('canvas');
    let gl;

    canvas.width = 1;
    canvas.height = 1;

    let options = {
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
    } catch (e) {
      return false;
    }
    if (gl) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * init event handler
   * @private
   */
  initEventHandler(): void {
    let self = this;

    let fire = (event, ...args) => {
      setImmediate(() => {
        this.emit(event, ...args);
      });
    };

    this.rtcEngine.onEvent('apierror', (funcName: string) => {
      console.error(`api ${funcName} failed. this is an error
              thrown by c++ addon layer. it often means sth is
              going wrong with this function call and it refused
              to do what is asked. kindly check your parameter types
              to see if it matches properly.`);
    });

    this.rtcEngine.onEvent('joinchannel', function(channel: string, uid: number, elapsed: number) {
      fire('joinedchannel', channel, uid, elapsed);
    });

    this.rtcEngine.onEvent('rejoinchannel', function(channel: string, uid: number, elapsed: number) {
      fire('rejoinedchannel', channel, uid, elapsed);
    });

    this.rtcEngine.onEvent('warning', function(warn: number, msg: string) {
      fire('warning', warn, msg);
    });

    this.rtcEngine.onEvent('error', function(err: number, msg: string) {
      fire('error', err, msg);
    });

    this.rtcEngine.onEvent('audioquality', function(uid: number, quality: AgoraNetworkQuality, delay: number, lost: number) {
      fire('audioquality', uid, quality, delay, lost);
    });

    this.rtcEngine.onEvent('audiovolumeindication', function(
      uid: number,
      volume: number,
      speakerNumber: number,
      totalVolume: number
    ) {
      fire(
        'audiovolumeindication',
        uid,
        volume,
        speakerNumber,
        totalVolume
      );
    });

    this.rtcEngine.onEvent('leavechannel', function() {
      fire('leavechannel');
    });

    this.rtcEngine.onEvent('rtcstats', function(stats: RtcStats) {
      fire('rtcstats', stats);
    });

    this.rtcEngine.onEvent('localvideostats', function(stats: LocalVideoStats) {
      fire('localvideostats', stats);
    });

    this.rtcEngine.onEvent('remotevideostats', function(stats: RemoteVideoStats) {
      fire('remotevideostats', stats);
    });

    this.rtcEngine.onEvent('audiodevicestatechanged', function(
      deviceId: string,
      deviceType: number,
      deviceState: number,
    ) {
      fire('audiodevicestatechanged', deviceId, deviceType, deviceState);
    });

    this.rtcEngine.onEvent('audiomixingfinished', function() {
      fire('audiomixingfinished');
    });

    this.rtcEngine.onEvent('apicallexecuted', function(api: string, err: number) {
      fire('apicallexecuted', api, err);
    });

    this.rtcEngine.onEvent('remoteaudiomixingbegin', function() {
      fire('remoteaudiomixingbegin');
    });

    this.rtcEngine.onEvent('remoteaudiomixingend', function() {
      fire('remoteaudiomixingend');
    });

    this.rtcEngine.onEvent('audioeffectfinished', function(soundId: number) {
      fire('audioeffectfinished', soundId);
    });

    this.rtcEngine.onEvent('videodevicestatechanged', function(
      deviceId: string,
      deviceType: number,
      deviceState: number,
    ) {
      fire('videodevicestatechanged', deviceId, deviceType, deviceState);
    });

    this.rtcEngine.onEvent('networkquality', function(
      uid: number,
      txquality: AgoraNetworkQuality,
      rxquality: AgoraNetworkQuality
    ) {
      fire('networkquality', uid, txquality, rxquality);
    });

    this.rtcEngine.onEvent('lastmilequality', function(quality: AgoraNetworkQuality) {
      fire('lastmilequality', quality);
    });

    this.rtcEngine.onEvent('firstlocalvideoframe', function(
      width: number, height: number, elapsed: number
    ) {
      fire('firstlocalvideoframe', width, height, elapsed);
    });

    this.rtcEngine.onEvent('firstremotevideodecoded', function(
      uid: number,
      width: number,
      height: number,
      elapsed: number
    ) {
      fire('addstream', uid, elapsed);
    });

    this.rtcEngine.onEvent('videosizechanged', function(
      uid: number, width: number, height: number, rotation: number
    ) {
      fire('videosizechanged', uid, width, height, rotation);
    });

    this.rtcEngine.onEvent('firstremotevideoframe', function(
      uid: number,
      width: number,
      height: number,
      elapsed: number
    ) {
      fire('firstremotevideoframe', uid, width, height, elapsed);
    });

    this.rtcEngine.onEvent('userjoined', function(uid: number, elapsed: number) {
      console.log('user : ' + uid + ' joined.');
      fire('userjoined', uid, elapsed);
    });

    this.rtcEngine.onEvent('useroffline', function(uid: number, reason: number) {
      if (!self.streams) {
        self.streams = new Map();
        console.log('Warning!!!!!!, streams is undefined.');
        return;
      }
      self.streams[uid] = undefined;
      self.rtcEngine.unsubscribe(uid);
      fire('removestream', uid, reason);
    });

    this.rtcEngine.onEvent('usermuteaudio', function(uid: number, muted: boolean) {
      fire('usermuteaudio', uid, muted);
    });

    this.rtcEngine.onEvent('usermutevideo', function(uid: number, muted: boolean) {
      fire('usermutevideo', uid, muted);
    });

    this.rtcEngine.onEvent('userenablevideo', function(uid: number, enabled: boolean) {
      fire('userenablevideo', uid, enabled);
    });

    this.rtcEngine.onEvent('userenablelocalvideo', function(uid: number, enabled: boolean) {
      fire('userenablelocalvideo', uid, enabled);
    });

    this.rtcEngine.onEvent('cameraready', function() {
      fire('cameraready');
    });

    this.rtcEngine.onEvent('videostopped', function() {
      fire('videostopped');
    });

    this.rtcEngine.onEvent('connectionlost', function() {
      fire('connectionlost');
    });

    this.rtcEngine.onEvent('connectioninterrupted', function() {
      fire('connectioninterrupted');
    });

    this.rtcEngine.onEvent('connectionbanned', function() {
      fire('connectionbanned');
    });

    this.rtcEngine.onEvent('refreshrecordingservicestatus', function(status) {
      fire('refreshrecordingservicestatus', status);
    });

    this.rtcEngine.onEvent('streammessage', function(
      uid: number,
      streamId: number,
      msg: string,
      len: number
    ) {
      fire('streammessage', uid, streamId, msg, len);
    });

    this.rtcEngine.onEvent('streammessageerror', function(
      uid: number,
      streamId: number,
      code: number,
      missed: number,
      cached: number
    ) {
      fire('streammessageerror', uid, streamId, code, missed, cached);
    });

    this.rtcEngine.onEvent('mediaenginestartcallsuccess', function() {
      fire('mediaenginestartcallsuccess');
    });

    this.rtcEngine.onEvent('requestchannelkey', function() {
      fire('requestchannelkey');
    });

    this.rtcEngine.onEvent('fristlocalaudioframe', function(elapsed: number) {
      fire('firstlocalaudioframe', elapsed);
    });

    this.rtcEngine.onEvent('firstremoteaudioframe', function(uid: number, elapsed: number) {
      fire('firstremoteaudioframe', uid, elapsed);
    });

    this.rtcEngine.onEvent('activespeaker', function(uid: number) {
      fire('activespeaker', uid);
    });

    this.rtcEngine.onEvent('clientrolechanged', function(oldRole, newRole) {
      fire('clientrolechanged', oldRole, newRole);
    });

    this.rtcEngine.onEvent('audiodevicevolumechanged', function(
      deviceType,
      volume,
      muted
    ) {
      fire('audiodevicevolumechanged', deviceType, volume, muted);
    });

    this.rtcEngine.onEvent('videosourcejoinsuccess', function(uid) {
      fire('videosourcejoinedsuccess', uid);
    });

    this.rtcEngine.onEvent('videosourcerequestnewtoken', function() {
      fire('videosourcerequestnewtoken');
    });

    this.rtcEngine.onEvent('videosourceleavechannel', function() {
      fire('videosourceleavechannel');
    });
    this.rtcEngine.registerDeliverFrame(function(infos) {
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
        return this.streams['local'];
      } else {
        return this.streams[uid];
      }
    } else if (type === 2) {
      // return this.streams.devtest;
      console.warn('Type 2 not support in production mode.');
      return false;
    } else if (type === 3) {
      return this.streams.videosource;
    } else {
      console.warn('Invalid type for getRenderer, only accept 0~3.')
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
    if (
      ydata.byteLength != udata.byteLength * 4 ||
      udata.byteLength != vdata.byteLength
    ) {
      console.error(
        'invalid image header ' +
          ydata.byteLength +
          ' ' +
          udata.byteLength +
          ' ' +
          vdata.byteLength
      );
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
    var len = infos.length;
    for (var i = 0; i < len; i++) {
      var info = infos[i];
      var type = info.type;
      var uid = info.uid;
      var header = info.header;
      var ydata = info.ydata;
      var udata = info.udata;
      var vdata = info.vdata;
      if (!header || !ydata || !udata || !vdata) {
        console.log(
          'Invalid data param ： ' + header + ' ' + ydata + ' ' + udata + ' ' + vdata
        );
        continue;
      }
      let renderer = this._getRenderer(type, uid);
      if (!renderer) {
        console.warn("Can't find renderer for uid : " + uid);
        continue;
      }

      if(this._checkData(header, ydata, udata, vdata)) {
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
   * @param {string} key key for the map that store the renderers, e.g, uid or `videosource` or `local`
   * @param {*} view dom elements to render video
   */
  initRender(key, view) {
    if (this.streams.hasOwnProperty(key)) {
      this.destroyRender(key);
    }
    let renderer;
    if (this.renderMode === 1) {
      renderer = new OldRenderer();
    } else if (this.renderMode === 2) {
      renderer = new Renderer();
    } else {
      console.warn('Unknown render mode, fallback to 1')
      renderer = new OldRenderer();
    }
    renderer.bind(view);
    this.streams[key] = renderer;
    
  }

  /**
   * destroy renderer
   * @param {string} key key for the map that store the renders, e.g, uid or `videosource` or `local`
   * @param {function} onFailure err callback for destroyRenderer
   */
  destroyRender(key, onFailure) {
    let renderer = this.streams[key];
    try {
      renderer.unbind();
      delete this.streams[key];
    } catch (err) {
      onFailure && onFailure(err)
    }
  }

  // ===========================================================================
  // BASIC METHODS
  // ===========================================================================

  /**
   * @description initialize agora real-time-communicating engine with appid
   * @param {string} appid agora appid
   * @returns {int} 0 for success, <0 for failure
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
   * @param {int} errorCode error code
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
   * @param {int} uid uid
   * @returns {int} 0 for success, <0 for failure
   */
  joinChannel(token, channel, info, uid) {
    return this.rtcEngine.joinChannel(token, channel, info, uid);
  }

  /**
   * @description Leave channel
   * @returns {int} 0 for success, <0 for failure
   */
  leaveChannel() {
    return this.rtcEngine.leaveChannel();
  }

  /**
   * @description This method sets high-quality audio preferences. Call this method and set all the three
   * modes before joining a channel. Do NOT call this method again after joining a channel.
   * @param {*} fullband enable/disable fullband codec
   * @param {*} stereo enable/disable stereo codec
   * @param {*} fullBitrate enable/disable high bitrate mode
   * @returns {int} 0 for success, <0 for failure
   */
  setHighQualityAudioParameters(fullband, stereo, fullBitrate) {
    return this.rtcEngine.setHighQualityAudioParameters(fullband, stereo, fullBitrate);
  }

  /**
   * @description subscribe remote uid and initialize corresponding renderer
   * @param {int} uid remote uid
   * @param {*} view dom where to initialize renderer
   * @returns {int} 0 for success, <0 for failure
   */
  subscribe(uid, view) {
    this.initRender(uid, view);
    return this.rtcEngine.subscribe(uid);
  }

  /**
   * @description setup local video and corresponding renderer
   * @param {*} view dom element where we will initialize our view
   * @returns {int} 0 for success, <0 for failure
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
   * @param {int} fps frame/s
   */
  setVideoRenderFPS(fps) {
    this.rtcEngine.setFPS(fps);
  }

  /**
   * @description force set renderer fps for high stream. High stream here MEANS uid streams which has been
   * added to high ones by calling addVideoRenderToHighFPS, note this has nothing to do with dual stream
   * high stream. This is often used when we want to set low fps for most of views, but high fps for one
   * or two special views, e.g. screenshare
   * @param {int} fps frame/s
   */
  setVideoRenderHighFPS(fps) {
    this.rtcEngine.setHighFPS(fps);
  }

  /**
   * @description add stream to high fps stream by uid. fps of streams added to high fps stream will be
   * controlled by setVideoRenderHighFPS
   * @param {*} uid stream uid
   */
  addVideoRenderToHighFPS(uid) {
    this.rtcEngine.addToHighVideo(uid);
  }

  /**
   * @description remove stream from high fps stream by uid. fps of streams removed from high fps stream
   * will be controlled by setVideoRenderFPS
   * @param {*} uid stream uid
   */
  remoteVideoRenderFromHighFPS(uid) {
    this.rtcEngine.removeFromHighVideo(uid);
  }

  /**
   * @description setup view content mode
   * @param {*} uid stream uid to operate
   * @param {*} mode view content mode, 0 - fill, 1 - fit
   * @returns {int} 0 - success, -1 - fail
   */
  setupViewContentMode(uid, mode) {
    if (this.streams.hasOwnProperty(uid)) {
      let renderer = this.streams[uid];
      renderer.contentMode = mode;
      return 0;
    } else {
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
   * @param {*} newtoken new token to update
   * @returns {int} 0 for success, <0 for failure
   */
  renewToken(newtoken) {
    return this.rtcEngine.renewToken(newtoken);
  }

  /**
   * @description Set channel profile(before join channel) since sdk will do optimization according to scenario.
   * @description 0 (default) for communication, 1 for live broadcasting, 2 for in-game
   * @param {int} profile profile
   * @returns {int} 0 for success, <0 for failure
   */
  setChannelProfile(profile) {
    return this.rtcEngine.setChannelProfile(profile);
  }

  /**
   *
   * @description In live broadcasting mode, set client role, 1 for anchor, 2 for audience
   * @param {Number} role client role
   * @param {string} permissionKey permission key
   * @returns {int} 0 for success, <0 for failure
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
   * @returns {int} 0 for success, <0 for failure
   */
  startEchoTest() {
    return this.rtcEngine.startEchoTest();
  }

  /**
   * @description This method stops an audio call test.
   * @returns {int} 0 for success, <0 for failure
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
   * @returns {int} 0 for success, <0 for failure
   */
  enableLastmileTest() {
    return this.rtcEngine.enableLastmileTest();
  }

  /**
   * @description This method disables the network connection quality test.
   * @returns {int} 0 for success, <0 for failure
   */
  disableLastmileTest() {
    return this.rtcEngine.disableLastmileTest();
  }

  /**
   * @description Use before join channel to enable video communication, or you will only join with audio-enabled
   * @returns {int} 0 for success, <0 for failure
   */
  enableVideo() {
    return this.rtcEngine.enableVideo();
  }

  /**
   * @description Use to disable video and use pure audio communication
   * @returns {int} 0 for success, <0 for failure
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
   * @returns {int} 0 for success, <0 for failure
   */
  startPreview() {
    return this.rtcEngine.startPreview();
  }

  /**
   * @description This method stops the local video preview and closes the video.
   * @returns {int} 0 for success, <0 for failure
   */
  stopPreview() {
    return this.rtcEngine.stopPreview();
  }

  /**
   *
   * @param {int} profile - enumeration values represent video profile
   * @param {boolean} [swapWidthAndHeight = false] - Whether to swap width and height
   * @returns {int} 0 for success, <0 for failure
   */
  setVideoProfile(profile, swapWidthAndHeight = false) {
    return this.rtcEngine.setVideoProfile(profile, swapWidthAndHeight);
  }

  /**
   * @param {Object} config - encoder config of video
   * @param {int} config.width - width of video
   * @param {int} config.height - height of video
   * @param {int} config.fps - valid values, 1, 7, 10, 15, 24, 30, 60
   * @param {int} config.bitrate - 0 - standard(recommended), 1 - compatible
   * @param {int} config.minbitrate - by default -1, changing this value is NOT recommended
   * @param {int} config.orientation - 0 - auto adapt to capture source, 1 - Landscape(Horizontal), 2 - Portrait(Vertical)
   * @returns {int} 0 for success, <0 for failure
   */
  setVideoEncoderConfiguration(config) {
    const {
      width = 640,
      height = 480,
      fps = 15,
      bitrate = 0,
      orientation = 0,
      minbitrate = -1
    } = config;
    return this.rtcEngine.setVideoEncoderConfiguration(
      width,
      height,
      fps,
      bitrate,
      minbitrate,
      orientation
    );
  }

  /**
   * @description This method enables the audio mode, which is enabled by default.
   * @returns {int} 0 for success, <0 for failure
   */
  enableAudio() {
    return this.rtcEngine.enableAudio();
  }

  /**
   * @description This method disables the audio mode.
   * @returns {int} 0 for success, <0 for failure
   */
  disableAudio() {
    return this.rtcEngine.disableAudio();
  }

  /**
   * @description Set audio profile (before join channel) depending on your scenario
   * @param {Number} profile audio profile
   * @param {Number} scenario audio scenario
   * @returns {int} 0 for success, <0 for failure
   */
  setAudioProfile(profile, scenario) {
    return this.rtcEngine.setAudioProfile(profile, scenario);
  }

  /**
   * @description This method allows users to set video preferences.
   * @param {boolean} preferFrameRateOverImageQuality enable/disable framerate over image quality
   * @returns {int} 0 for success, <0 for failure
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
   * @returns {int} 0 for success, <0 for failure
   */
  setEncryptionSecret(secret) {
    return this.rtcEngine.setEncryptionSecret(secret);
  }

  /**
   * @description This method mutes/unmutes local audio. It enables/disables 
   * sending local audio streams to the network.
   * @param {boolean} mute mute/unmute audio
   * @returns {int} 0 for success, <0 for failure
   */
  muteLocalAudioStream(mute) {
    return this.rtcEngine.muteLocalAudioStream(mute);
  }

  /**
   * @description This method mutes/unmutes all remote users’ audio streams.
   * @param {boolean} mute mute/unmute audio
   * @returns {int} 0 for success, <0 for failure
   */
  muteAllRemoteAudioStreams(mute) {
    return this.rtcEngine.muteAllRemoteAudioStreams(mute);
  }

  /**
   * @description Stops receiving all remote users' audio streams by default.
   * @param {boolean} mute mute/unmute audio
   * @returns {int} 0 for success, <0 for failure
   */
  setDefaultMuteAllRemoteAudioStreams(mute) {
    return this.rtcEngine.setDefaultMuteAllRemoteAudioStreams(mute);
  }

  /**
   * @description This method mutes/unmutes a specified user’s audio stream.
   * @param {int} uid user to mute/unmute
   * @param {boolean} mute mute/unmute audio
   * @returns {int} 0 for success, <0 for failure
   */
  muteRemoteAudioStream(uid, mute) {
    return this.rtcEngine.muteRemoteAudioStream(uid, mute);
  }

  /**
   * @description This method mutes/unmutes video stream
   * @param {boolean} mute mute/unmute video
   * @returns {int} 0 for success, <0 for failure
   */
  muteLocalVideoStream(mute) {
    return this.rtcEngine.muteLocalVideoStream(mute);
  }

  /**
   * @description This method disables the local video, which is only applicable to
   * the scenario when the user only wants to watch the remote video without sending
   * any video stream to the other user. This method does not require a local camera.
   * @param {boolean} enable enable/disable video
   * @returns {int} 0 for success, <0 for failure
   */
  enableLocalVideo(enable) {
    return this.rtcEngine.enableLocalVideo(enable);
  }

  /**
   * @description This method mutes/unmutes all remote users’ video streams.
   * @param {boolean} mute mute/unmute video
   * @returns {int} 0 for success, <0 for failure
   */
  muteAllRemoteVideoStreams(mute) {
    return this.rtcEngine.muteAllRemoteVideoStreams(mute);
  }

  /**
   * @description Stops receiving all remote users’ video streams.
   * @param {boolean} mute mute/unmute audio
   * @returns {int} 0 for success, <0 for failure
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
   * @param {*} interval < 0 for disable, recommend to set > 200ms, < 10ms will not receive any callbacks
   * @param {*} smooth Smoothing factor. The default value is 3
   * @returns {int} 0 for success, <0 for failure
   */
  enableAudioVolumeIndication(interval, smooth) {
    return this.rtcEngine.enableAudioVolumeIndication(interval, smooth);
  }

  /**
   * @description This method mutes/unmutes a specified user’s video stream.
   * @param {int} uid user to mute/unmute
   * @param {boolean} mute mute/unmute video
   * @returns {int} 0 for success, <0 for failure
   */
  muteRemoteVideoStream(uid, mute) {
    return this.rtcEngine.muteRemoteVideoStream(uid, mute);
  }

  /**
   * @description This method sets the in ear monitoring volume.
   * @param {*} volume Volume of the in-ear monitor, ranging from 0 to 100. The default value is 100.
   * @returns {int} 0 for success, <0 for failure
   */
  setInEarMonitoringVolume(volume) {
    return this.rtcEngine.setInEarMonitoringVolume(volume);
  }

  /**
   * @description disable audio function in channel, which will be recovered when leave channel.
   * @returns {int} 0 for success, <0 for failure
   */
  pauseAudio() {
    return this.rtcEngine.pauseAudio();
  }

  /**
   * @description resume audio function in channel.
   * @returns {int} 0 for success, <0 for failure
   */
  resumeAudio() {
    return this.rtcEngine.resumeAudio();
  }

  /**
   * @description set filepath of log
   * @param {string} filepath filepath of log
   * @returns {int} 0 for success, <0 for failure
   */
  setLogFile(filepath) {
    return this.rtcEngine.setLogFile(filepath);
  }

  /**
   * @description set filepath of videosource log, must be called after videosource initialized
   * @param {string} filepath filepath of log
   * @returns {int} 0 for success, <0 for failure
   */
  videoSourceSetLogFile(filepath) {
    return this.rtcEngine.videoSourceSetLogFile(filepath)
  }

  /**
   * @description set log level
   * @param {int} filter filter level
   * LOG_FILTER_OFF = 0: Output no log.
   * LOG_FILTER_DEBUG = 0x80f: Output all the API logs.
   * LOG_FILTER_INFO = 0x0f: Output logs of the CRITICAL, ERROR, WARNING and INFO level.
   * LOG_FILTER_WARNING = 0x0e: Output logs of the CRITICAL, ERROR and WARNING level.
   * LOG_FILTER_ERROR = 0x0c: Output logs of the CRITICAL and ERROR level.
   * LOG_FILTER_CRITICAL = 0x08: Output logs of the CRITICAL level.
   * @returns {int} 0 for success, <0 for failure
   */
  setLogFilter(filter) {
    return this.rtcEngine.setLogFilter(filter);
  }

  /**
   * @description This method sets the stream mode (only applicable to live broadcast) to 
   * single- (default) or dual-stream mode.
   * @param {boolean} enable enable/disable dual stream
   * @returns {int} 0 for success, <0 for failure
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
   * @param {int} uid User ID
   * @param {int} streamType 0 - high, 1 - low
   * @returns {int} 0 for success, <0 for failure
   */
  setRemoteVideoStreamType(uid, streamType) {
    return this.rtcEngine.setRemoteVideoStreamType(uid, streamType);
  }

  /**
   * @description This method sets the default remote video stream type to high or low.
   * @param {int} streamType 0 - high, 1 - low
   * @returns {int} 0 for success, <0 for failure
   */
  setRemoteDefaultVideoStreamType(streamType) {
    return this.rtcEngine.setRemoteDefaultVideoStreamType(streamType);
  }

  /**
   * @description This method enables interoperability with the Agora Web SDK.
   * @param {*} enable enable/disable interop
   * @returns {int} 0 for success, <0 for failure
   */
  enableWebSdkInteroperability(enable) {
    return this.rtcEngine.enableWebSdkInteroperability(enable);
  }

  /**
   * @description This method sets the local video mirror mode. Use this method before startPreview, 
   * or it does not take effect until you re-enable startPreview.
   * @param {*} mirrortype mirror type
   * 0: The default mirror mode, that is, the mode set by the SDK
   * 1: Enable the mirror mode
   * 2: Disable the mirror mode
   * @returns {int} 0 for success, <0 for failure
   */
  setLocalVideoMirrorMode(mirrortype) {
    return this.rtcEngine.setLocalVideoMirrorMode(mirrortype);
  }

  /**
   * @description Changes the voice pitch of the local speaker.
   * @param {int} pitch - The value ranges between 0.5 and 2.0.
   * The lower the value, the lower the voice pitch.
   * The default value is 1.0 (no change to the local voice pitch).
   * @returns {int} 0 for success, <0 for failure
   */
  setLocalVoicePitch(pitch) {
    return this.rtcEngine.setLocalVoicePitch(pitch);
  }

  /**
   * @description Sets the local voice equalization effect.
   * @param {int} bandFrequency - Sets the band frequency.
   * The value ranges between 0 and 9, representing the respective 10-band center frequencies of the voice effects
   * including 31, 62, 125, 500, 1k, 2k, 4k, 8k, and 16k Hz.
   * @param {int} bandGain - Sets the gain of each band in dB. The value ranges between -15 and 15.
   * @returns {int} 0 for success, <0 for failure
   */
  setLocalVoiceEqualization(bandFrequency, bandGain) {
    return this.rtcEngine.setLocalVoiceEqualization(bandFrequency, bandGain);
  }

  /**
   * @description Sets the local voice reverberation.
   * @param {int} reverbKey - Audio reverberation type.
   * AUDIO_REVERB_DRY_LEVEL = 0, // (dB, [-20,10]), the level of the dry signal
   * AUDIO_REVERB_WET_LEVEL = 1, // (dB, [-20,10]), the level of the early reflection signal (wet signal)
   * AUDIO_REVERB_ROOM_SIZE = 2, // ([0,100]), the room size of the reflection
   * AUDIO_REVERB_WET_DELAY = 3, // (ms, [0,200]), the length of the initial delay of the wet signal in ms
   * AUDIO_REVERB_STRENGTH = 4, // ([0,100]), the strength of the reverberation
   * @param {int} value - value Sets the value of the reverberation key.
   * @returns {int} 0 for success, <0 for failure
   */
  setLocalVoiceReverb(reverbKey, value) {
    return this.rtcEngine.setLocalVoiceReverb(reverbKey, value);
  }

  /**
   * @description Sets the fallback option for the locally published video stream based on the network conditions.
   * The default setting for @p option is #STREAM_FALLBACK_OPTION_DISABLED, where there is no fallback for the locally published video stream when the uplink network conditions are poor.
   * If *option* is set to #STREAM_FALLBACK_OPTION_AUDIO_ONLY, the SDK will:
   * - Disable the upstream video but enable audio only when the network conditions worsen and cannot support both video and audio.
   * - Re-enable the video when the network conditions improve.
   * When the locally published stream falls back to audio only or when the audio stream switches back to the video,
   * the \ref agora::rtc::IRtcEngineEventHandler::onLocalPublishFallbackToAudioOnly "onLocalPublishFallbackToAudioOnly" callback is triggered.
   * @note Agora does not recommend using this method for CDN live streaming, because the remote CDN live user will have a noticeable lag when the locally publish stream falls back to audio-only.
   * @param {int} option - Sets the fallback option for the locally published video stream.
   * STREAM_FALLBACK_OPTION_DISABLED = 0
   * STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW = 1
   * STREAM_FALLBACK_OPTION_AUDIO_ONLY = 2
   * @returns {int} 0 for success, <0 for failure
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
   * @param {int} option - Sets the fallback option for the remotely subscribed stream.
   * STREAM_FALLBACK_OPTION_DISABLED = 0
   * STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW = 1
   * STREAM_FALLBACK_OPTION_AUDIO_ONLY = 2
   * @returns {int} 0 for success, <0 for failure
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
   * @param {int} samplerate Sampling rate of the external audio source.
   * @param {int} channels Number of the external audio source channels (two channels maximum).
   * @returns {int} 0 for success, <0 for failure
   */
  setExternalAudioSource(enabled, samplerate, channels) {
    return this.rtcEngine.setExternalAudioSource(enabled, samplerate, channels);
  }

  /**
   * @description return list of video devices
   * @returns {array} array of device object
   */
  getVideoDevices() {
    return this.rtcEngine.getVideoDevices();
  }

  /**
   * @description set video device to use via device id
   * @param {*} deviceid device id
   * @returns {int} 0 for success, <0 for failure
   */
  setVideoDevice(deviceid) {
    return this.rtcEngine.setVideoDevice(deviceid);
  }

  /**
   * @description get current using video device
   * @return {object} video device object
   */
  getCurrentVideoDevice() {
    return this.rtcEngine.getCurrentVideoDevice();
  }

  /**
   * @description This method tests whether the video-capture device works properly.
   * Before calling this method, ensure that you have already called enableVideo,
   * and the HWND window handle of the incoming parameter is valid.
   * @returns {int} 0 for success, <0 for failure
   */
  startVideoDeviceTest() {
    return this.rtcEngine.startVideoDeviceTest();
  }

  /**
   * @description stop video device test
   * @returns {int} 0 for success, <0 for failure
   */
  stopVideoDeviceTest() {
    return this.rtcEngine.stopVideoDeviceTest();
  }

  /**
   * @description return list of audio playback devices
   * @returns {array} array of device object
   */
  getAudioPlaybackDevices() {
    return this.rtcEngine.getAudioPlaybackDevices();
  }

  /**
   * @description set audio playback device to use via device id
   * @param {*} deviceid device id
   * @returns {int} 0 for success, <0 for failure
   */
  setAudioPlaybackDevice(deviceid) {
    return this.rtcEngine.setAudioPlaybackDevice(deviceid);
  }

  /**
   * @description Retrieves the audio playback device information associated with the device ID and device name
   * @param {string} deviceId device id
   * @param {string} deviceName device name
   * @returns {int} 0 for success, <0 for failure
   */
  getPlaybackDeviceInfo(deviceId, deviceName) {
    return this.rtcEngine.getPlaybackDeviceInfo(deviceId, deviceName);
  }

  /**
   * @description get current using audio playback device
   * @return {object} audio playback device object
   */
  getCurrentAudioPlaybackDevice() {
    return this.rtcEngine.getCurrentAudioPlaybackDevice();
  }

  /**
   * @description set device playback volume
   * @param {int} volume 0 - 255
   * @returns {int} 0 for success, <0 for failure
   */
  setAudioPlaybackVolume(volume) {
    return this.rtcEngine.setAudioPlaybackVolume(volume);
  }

  /**
   * @description get device playback volume
   * @returns {int} volume
   */
  getAudioPlaybackVolume() {
    return this.rtcEngine.getAudioPlaybackVolume();
  }

  /**
   * @description get audio recording devices
   * @returns {array} array of recording devices
   */
  getAudioRecordingDevices() {
    return this.rtcEngine.getAudioRecordingDevices();
  }

  /**
   * @description set audio recording device
   * @param {*} deviceid device id
   * @returns {int} 0 for success, <0 for failure
   */
  setAudioRecordingDevice(deviceid) {
    return this.rtcEngine.setAudioRecordingDevice(deviceid);
  }

  /**
   * @description Retrieves the audio recording device information associated with the device ID and device name.
   * @param {string} deviceId device id
   * @param {string} deviceName device name
   * @returns {int} 0 for success, <0 for failure
   */
  getRecordingDeviceInfo(deviceId, deviceName) {
    return this.rtcEngine.getRecordingDeviceInfo(deviceId, deviceName);
  }

  /**
   * @description get current selected audio recording device
   * @returns {object} audio recording device object
   */
  getCurrentAudioRecordingDevice() {
    return this.rtcEngine.getCurrentAudioRecordingDevice();
  }

  /**
   * @description get audio recording volume
   * @return {int} volume
   */
  getAudioRecordingVolume() {
    return this.rtcEngine.getAudioRecordingVolume();
  }

  /**
   * @description set audio recording device volume
   * @param {*} volume 0 - 255
   * @returns {int} 0 for success, <0 for failure
   */
  setAudioRecordingVolume(volume) {
    return this.rtcEngine.setAudioRecordingVolume(volume);
  }

  /**
   * @description This method checks whether the playback device works properly. The SDK plays an audio file
   * specified by the user. If the user can hear the sound, then the playback device works properly.
   * @param {string} filepath filepath of sound file to play test
   * @returns {int} 0 for success, <0 for failure
   */
  startAudioPlaybackDeviceTest(filepath) {
    return this.rtcEngine.startAudioPlaybackDeviceTest(filepath);
  }

  /**
   * @description stop playback device test
   * @returns {int} 0 for success, <0 for failure
   */
  stopAudioPlaybackDeviceTest() {
    return this.rtcEngine.stopAudioPlaybackDeviceTest();
  }

  /**
   * @description This method enables loopback recording. Once enabled, the SDK collects all local sounds.
   * @param {boolean} [enable = false] whether to enable loop back recording
   */
  enableLoopbackRecording(enable = false) {
    return this.rtcEngine.enableLoopbackRecording(enable)
  }

  /**
   * @description This method checks whether the microphone works properly. Once the test starts, the SDK uses
   * the onAudioVolumeIndication callback to notify the application about the volume information.
   * @param {*} indicateInterval in second
   * @returns {int} 0 for success, <0 for failure
   */
  startAudioRecordingDeviceTest(indicateInterval) {
    return this.rtcEngine.startAudioRecordingDeviceTest(indicateInterval);
  }

  /**
   * @description stop audio recording device test
   * @returns {int} 0 for success, <0 for failure
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
   * @returns {int} 0 for success, <0 for failure
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
   * @returns {int} 0 for success, <0 for failure
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
   * @param {string} appid agora appid
   * @returns {int} 0 for success, <0 for failure
   */
  videoSourceInitialize(appid) {
    return this.rtcEngine.videoSourceInitialize(appid);
  }

  /**
   * @description setup renderer for video source
   * @param {*} view dom element where video source should be displayed
   */
  setupLocalVideoSource(view) {
    this.initRender('videosource', view);
  }

  /**
   * @description Set it to true to enable videosource web interoperability
   * @param {Boolean} enabled enalbe/disable web interoperability
   * @returns {int} 0 for success, <0 for failure
   */
  videoSourceEnableWebSdkInteroperability(enabled) {
    return this.rtcEngine.videoSourceEnableWebSdkInteroperability(enabled);
  }

  /**
   *
   * @description let video source join channel with token, channel, channel_info and uid
   * @requires channel
   * @param {string} token token
   * @param {string} cname channel
   * @param {string} info channel info
   * @param {int} uid uid
   * @returns {int} 0 for success, <0 for failure
   */
  videoSourceJoin(token, cname, info, uid) {
    return this.rtcEngine.videoSourceJoin(token, cname, info, uid);
  }

  /**
   * @description let video source Leave channel
   * @returns {int} 0 for success, <0 for failure
   */
  videoSourceLeave() {
    return this.rtcEngine.videoSourceLeave();
  }

  /**
   * @description This method updates the Token for video source
   * @param {*} token new token to update
   * @returns {int} 0 for success, <0 for failure
   */
  videoSourceRenewToken(token) {
    return this.rtcEngine.videoSourceRenewToken(token);
  }

  /**
   * @description Set channel profile(before join channel) for video source
   * @description 0 (default) for communication, 1 for live broadcasting, 2 for in-game
   * @param {int} profile profile
   * @returns {int} 0 for success, <0 for failure
   */
  videoSourceSetChannelProfile(profile) {
    return this.rtcEngine.videoSourceSetChannelProfile(profile);
  }

  /**
   * @description set video profile for video source (must be called after startScreenCapture2)
   * @param {int} profile - enumeration values represent video profile
   * @param {boolean} [swapWidthAndHeight = false] - Whether to swap width and height
   * @returns {int} 0 for success, <0 for failure
   */
  videoSourceSetVideoProfile(profile, swapWidthAndHeight) {
    return this.rtcEngine.videoSourceSetVideoProfile(profile, swapWidthAndHeight);
  }

  /**
   * @description get list of all system window ids and relevant infos, the window id can be used for screen share
   * @returns {array} list of window infos
   */
  getScreenWindowsInfo() {
    return this.rtcEngine.getScreenWindowsInfo();
  }

  /**
   * @description start video source screen capture
   * @param {*} wndid windows id to capture
   * @param {*} captureFreq fps of video source screencapture, 1 - 15
   * @param {*} rect null/if specified, e.g, {left: 0, right: 100, top: 0, bottom: 100} (relative distance from the left-top corner of the screen)
   * @param {*} bitrate bitrate of video source screencapture
   * @returns {int} 0 for success, <0 for failure
   */
  startScreenCapture2(wndid, captureFreq, rect, bitrate) {
    return this.rtcEngine.startScreenCapture2(wndid, captureFreq, rect, bitrate);
  }

  /**
   * @description stop video source screen capture
   * @returns {int} 0 for success, <0 for failure
   */
  stopScreenCapture2() {
    return this.rtcEngine.stopScreenCatpure2();
  }

  /**
   * @description start video source preview
   * @returns {int} 0 for success, <0 for failure
   */
  startScreenCapturePreview() {
    return this.rtcEngine.videoSourceStartPreview();
  }

  /**
   * @description stop video source preview
   * @returns {int} 0 for success, <0 for failure
   */
  stopScreenCapturePreview() {
    return this.rtcEngine.videoSourceStopPreview();
  }

  /**
   * @description enable dual stream mode for video source
   * @param {*} enable whether dual stream mode is enabled
   * @return {int} 0 for success, <0 for failure
   */
  videoSourceEnableDualStreamMode(enable) {
    return this.rtcEngine.videoSourceEnableDualStreamMode(enable);
  }

  /**
   * @description setParameters for video source
   * @param {*} parameter parameter to set
   * @returns {int} 0 for success, <0 for failure
   */
  videoSourceSetParameters(parameter) {
    return this.rtcEngine.videoSourceSetParameter(parameter);
  }

  /**
   * @description release video source object
   * @returns {int} 0 for success, <0 for failure
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
   * @param {*} windowId windows id to capture
   * @param {*} captureFreq fps of screencapture, 1 - 15
   * @param {*} rect null/if specified, e.g, {left: 0, right: 100, top: 0, bottom: 100} (relative distance from the left-top corner of the screen)
   * @param {*} bitrate bitrate of screencapture
   * @returns {int} 0 for success, <0 for failure
   */
  startScreenCapture(windowId, captureFreq, rect, bitrate) {
    return this.rtcEngine.startScreenCapture(windowId, captureFreq, rect, bitrate);
  }

  /**
   * @description stop screen capture
   * @returns {int} 0 for success, <0 for failure
   */
  stopScreenCapture() {
    return this.rtcEngine.stopScreenCapture();
  }

  /**
   * @description This method updates the screen capture region.
   * @param {*} rect {x: 0, y: 0, width: 0, height: 0}
   * @returns {int} 0 for success, <0 for failure
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
   * @param {int} cycle number of loop playbacks, -1 for infinite
   * @returns {int} 0 for success, <0 for failure
   */
  startAudioMixing(filepath, loopback, replace, cycle) {
    return this.rtcEngine.startAudioMixing(filepath, loopback, replace, cycle);
  }

  /**
   * @description This method stops audio mixing. Call this API when you are in a channel.
   * @returns {int} 0 for success, <0 for failure
   */
  stopAudioMixing() {
    return this.rtcEngine.stopAudioMixing();
  }

  /**
   * @description This method pauses audio mixing. Call this API when you are in a channel.
   * @returns {int} 0 for success, <0 for failure
   */
  pauseAudioMixing() {
    return this.rtcEngine.pauseAudioMixing();
  }

  /**
   * @description This method resumes audio mixing from pausing. Call this API when you are in a channel.
   * @returns {int} 0 for success, <0 for failure
   */
  resumeAudioMixing() {
    return this.rtcEngine.resumeAudioMixing();
  }

  /**
   * @description This method adjusts the volume during audio mixing. Call this API when you are in a channel.
   * @param {int} volume Volume ranging from 0 to 100. By default, 100 is the original volume.
   * @returns {int} 0 for success, <0 for failure
   */
  adjustAudioMixingVolume(volume) {
    return this.rtcEngine.adjustAudioMixingVolume(volume);
  }

  /**
   * @description Adjusts the audio mixing volume for local playback.
   * @param {int} volume Volume ranging from 0 to 100. By default, 100 is the original volume.
   * @returns {int} 0 for success, <0 for failure
   */
  adjustAudioMixingPlayoutVolume(volume) {
    return this.rtcEngine.adjustAudioMixingPlayoutVolume(volume);
  }

  /**
   * @description Adjusts the audio mixing volume for publishing (for remote users).
   * @param {int} volume Volume ranging from 0 to 100. By default, 100 is the original volume.
   * @returns {int} 0 for success, <0 for failure
   */
  adjustAudioMixingPublishVolume(volume) {
    return this.rtcEngine.adjustAudioMixingPublishVolume(volume);
  }

  /**
   * @description This method gets the duration (ms) of the audio mixing. Call this API when you are in 
   * a channel. A return value of 0 means that this method call has failed.
   * @returns {int} duration of audio mixing
   */
  getAudioMixingDuration() {
    return this.rtcEngine.getAudioMixingDuration();
  }

  /**
   * @description This method gets the playback position (ms) of the audio. Call this API 
   * when you are in a channel.
   * @returns {int} current playback position
   */
  getAudioMixingCurrentPosition() {
    return this.rtcEngine.getAudioMixingCurrentPosition();
  }

  /**
   * @description This method drags the playback progress bar of the audio mixing file to where 
   * you want to play instead of playing it from the beginning.
   * @param {int} position Integer. The position of the audio mixing file in ms
   * @returns {int} 0 for success, <0 for failure
   */
  setAudioMixingPosition(position) {
    return this.rtcEngine.setAudioMixingPosition(position);
  }

  // ===========================================================================
  // RAW DATA
  // ===========================================================================
  /**
   * @description This method sets the format of the callback data in onRecordAudioFrame.
   * @param {*} sampleRate It specifies the sampling rate in the callback data returned by onRecordAudioFrame, 
   * which can set be as 8000, 16000, 32000, 44100 or 48000.
   * @param {*} channel 1 - mono, 2 - dual
   * @param {*} mode 0 - read only mode, 1 - write-only mode, 2 - read and white mode
   * @param {*} samplesPerCall It specifies the sampling points in the called data returned in onRecordAudioFrame, 
   * for example, it is usually set as 1024 for stream pushing.
   * @returns {int} 0 for success, <0 for failure
   */
  setRecordingAudioFrameParameters(sampleRate, channel, mode, samplesPerCall) {
    return this.rtcEngine.setRecordingAudioFrameParameters(
      sampleRate,
      channel,
      mode,
      samplesPerCall
    );
  }

  /**
   * This method sets the format of the callback data in onPlaybackAudioFrame.
   * @param {*} sampleRate Specifies the sampling rate in the callback data returned by onPlaybackAudioFrame, 
   * which can set be as 8000, 16000, 32000, 44100, or 48000.
   * @param {*} channel 1 - mono, 2 - dual
   * @param {*} mode 0 - read only mode, 1 - write-only mode, 2 - read and white mode
   * @param {*} samplesPerCall It specifies the sampling points in the called data returned in onRecordAudioFrame, 
   * for example, it is usually set as 1024 for stream pushing.
   * @returns {int} 0 for success, <0 for failure
   */
  setPlaybackAudioFrameParameters(sampleRate, channel, mode, samplesPerCall) {
    return this.rtcEngine.setPlaybackAudioFrameParameters(
      sampleRate,
      channel,
      mode,
      samplesPerCall
    );
  }

  /**
   * This method sets the format of the callback data in onMixedAudioFrame.
   * @param {*} sampleRate Specifies the sampling rate in the callback data returned by onMixedAudioFrame,
   * which can set be as 8000, 16000, 32000, 44100, or 48000.
   * @param {*} samplesPerCall Specifies the sampling points in the called data returned in onMixedAudioFrame,
   * for example, it is usually set as 1024 for stream pushing.
   * @returns {int} 0 for success, <0 for failure
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
   *                     false - The recipients may not receive any data, while it will not report any error upon data missing.
   * @param {boolean} ordered true - The recipients will receive data in the order of the sender.
   *                    false - The recipients will not receive data in the order of the sender.
   * @returns {int} <0 for failure, > 0 for stream id of data
   */
  createDataStream(reliable, ordered) {
    return this.rtcEngine.createDataStream(reliable, ordered);
  }

  /**
   * @description This method sends data stream messages to all users in a channel.
   * Up to 30 packets can be sent per second in a channel with each packet having a maximum size of 1 kB.
   * The API controls the data channel transfer rate. Each client can send up to 6 kB of data per second.
   * Each user can have up to five data channels simultaneously.
   * @param {int} streamId Stream ID from createDataStream
   * @param {string} msg Data to be sent
   * @returns {int} 0 for success, <0 for failure
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
   * @param {int} volume - [0.0, 100.0]	
   * @returns {int} 0 for success, <0 for failure	
   */	
  setEffectsVolume(volume) {	
    return this.rtcEngine.setEffectsVolume(volume);	
  }	
   /**	
   * @description set effect volume of a sound id	
   * @param {int} soundId soundId	
   * @param {int} volume - [0.0, 100.0]	
   * @returns {int} 0 for success, <0 for failure	
   */	
  setVolumeOfEffect(soundId, volume) {	
    return this.setVolumeOfEffect(soundId, volume);	
  }	
   /**	
   * @description play effect	
   * @param {int} soundId soundId	
   * @param {string} filePath filepath	
   * @param {int} loopcount - 0: once, 1: twice, -1: infinite	
   * @param {number} pitch - [0.5, 2]	
   * @param {number} pan - [-1, 1]	
   * @param {int} gain - [0, 100]	
   * @param {boolean} publish publish	
   * @returns {int} 0 for success, <0 for failure	
   */	
  playEffect(soundId, filePath, loopcount, pitch, pan, gain, publish) {	
    return this.rtcEngine.playEffect(	
      soundId,	
      filePath,	
      loopcount,	
      pitch,	
      pan,	
      gain,	
      publish	
    );	
  }	
   /**	
   * @description stop effect via given sound id	
   * @param {int} soundId soundId	
   * @returns {int} 0 for success, <0 for failure	
   */	
  stopEffect(soundId) {	
    return this.rtcEngine.stopEffect(soundId);	
  }	
   /**	
   * @description preload effect	
   * @param {int} soundId soundId	
   * @param {String} filePath filepath	
   * @returns {int} 0 for success, <0 for failure	
   */	
  preloadEffect(soundId, filePath) {	
    return this.rtcEngine.preloadEffect(soundId, filePath);	
  }	
   /**	
   * This method releases a specific preloaded audio effect from the memory.	
   * @param {int} soundId soundId	
   * @returns {int} 0 for success, <0 for failure	
   */	
  unloadEffect(soundId) {	
    return this.rtcEngine.unloadEffect(soundId);	
  }	
   /**	
   * @description This method pauses a specific audio effect.	
   * @param {*} soundId soundId	
   * @returns {int} 0 for success, <0 for failure	
   */	
  pauseEffect(soundId) {	
    return this.rtcEngine.pauseEffect(soundId);	
  }	
   /**	
   * @description This method pauses all the audio effects.	
   * @returns {int} 0 for success, <0 for failure	
   */	
  pauseAllEffects() {	
    return this.rtcEngine.pauseAllEffects();	
  }	
   /**	
   * @description This method resumes playing a specific audio effect.	
   * @param {*} soundId soundid	
   * @returns {int} 0 for success, <0 for failure	
   */	
  resumeEffect(soundId) {	
    return this.rtcEngine.resumeEffect(soundId);	
  }	
   /**	
   * @description This method resumes playing all the audio effects.	
   * @returns {int} 0 for success, <0 for failure	
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
   * @param {string} callid Call ID retrieved from the getCallId method.
   * @param {int} rating Rating for the call between 1 (lowest score) to 10 (highest score).
   * @param {*} desc A given description for the call with a length less than 800 bytes.
   * @returns {int} 0 for success, <0 for failure
   */
  rate(callid, rating, desc) {
    return this.rtcEngine.rate(callid, rating, desc);
  }

  /**
   * @description This method allows the user to complain about the call quality. It is usually
   * called after the call ends.
   * @param {string} callid Call ID retrieved from the getCallId method.
   * @param {string} desc A given description of the call with a length less than 800 bytes.
   * @returns {int} 0 for success, <0 for failure
   */
  complain(callid, desc) {
    return this.rtcEngine.complain(callid, desc);
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

