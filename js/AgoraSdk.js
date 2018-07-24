const EventEmitter = require('events').EventEmitter;
const AgoraRender = require('./AgoraRender');
const agora = require('../build/Release/agora_node_ext');

class AgoraRtcEngine extends EventEmitter {
  constructor() {
    super();
    this.rtcengine = new agora.NodeRtcEngine();
    this.initEventHandler();
    this.streams = {};
  }

  initEventHandler() {
    var self = this;

    this.rtcengine.onEvent('apierror', funcName => {
      console.error(`api ${funcName} failed. this is an error 
              thrown by c++ addon layer. it often means sth is 
              going wrong with this function call and it refused 
              to do what is asked. kindly check your parameter types 
              to see if it matches properly.`);
    });

    this.rtcengine.onEvent('joinchannel', function(channel, uid, elapsed) {
      self.emit('joinedchannel', channel, uid, elapsed);
    });

    this.rtcengine.onEvent('rejoinchannel', function(channel, uid, elapsed) {
      self.emit('rejoinedchannel', channel, uid, elapsed);
    });

    this.rtcengine.onEvent('warning', function(warn, msg) {
      self.emit('warning', warn, msg);
    });

    this.rtcengine.onEvent('error', function(err, msg) {
      self.emit('error', err, msg);
    });

    this.rtcengine.onEvent('audioquality', function(uid, quality, delay, lost) {
      self.emit('audioquality', uid, quality, delay, lost);
    });

    this.rtcengine.onEvent('audiovolumeindication', function(
      uid,
      volume,
      speakerNumber,
      totalVolume
    ) {
      self.emit(
        'audiovolumeindication',
        uid,
        volume,
        speakerNumber,
        totalVolume
      );
    });

    this.rtcengine.onEvent('leavechannel', function() {
      self.emit('leavechannel');
    });

    /**
     * Stats Properties:
     *      unsigned int duration;
     *        unsigned int txBytes;
     *       unsigned int rxBytes;
     *        unsigned short txKBitRate;
     *        unsigned short rxKBitRate;
     *        unsigned short rxAudioKBitRate;
     *        unsigned short txAudioKBitRate;
     *        unsigned short rxVideoKBitRate;
     *        unsigned short txVideoKBitRate;
     *       unsigned int userCount;
     *        double cpuAppUsage;
     *        double cpuTotalUsage;
     */
    this.rtcengine.onEvent('rtcstats', function(stats) {
      self.emit('rtcstats', stats);
    });

    /**
     *
     *        Int sentBitrate;
     *        int sentFrameRate;
     */
    this.rtcengine.onEvent('localvideostats', function(stats) {
      self.emit('localvideostats', stats);
    });

    /**
     *
     *        Uid_t uid;
     *        int delay;  // obsolete
     *        int width;
     *        int height;
     *        int receivedBitrate;
     *        int receivedFrameRate;
     *         REMOTE_VIDEO_STREAM_TYPE rxStreamType;
     *
     */
    this.rtcengine.onEvent('remotevideostats', function(stats) {
      self.emit('remotevideostats', stats);
    });

    this.rtcengine.onEvent('audiodevicestatechanged', function(
      deviceId,
      deviceType,
      deviceState
    ) {
      self.emit('audiodevicestatechanged', deviceId, deviceType, deviceState);
    });

    this.rtcengine.onEvent('audiomixingfinished', function() {
      self.emit('audiomixingfinished');
    });

    this.rtcengine.onEvent('apicallexecuted', function(api, err) {
      self.emit('apicallexecuted', api, err);
    });

    this.rtcengine.onEvent('remoteaudiomixingbegin', function() {
      self.emit('remoteaudiomixingbegin');
    });

    this.rtcengine.onEvent('remoteaudiomixingend', function() {
      self.emit('remoteaudiomixingend');
    });

    this.rtcengine.onEvent('audioeffectfinished', function(soundId) {
      self.emit('audioeffectfinished', soundId);
    });

    this.rtcengine.onEvent('videodevicestatechanged', function(
      deviceId,
      deviceType,
      deviceState
    ) {
      self.emit('videodevicestatechanged', deviceId, deviceType, deviceState);
    });

    this.rtcengine.onEvent('networkquality', function(uid, txquality, rxquality) {
      self.emit('networkquality', uid, txquality, rxquality);
    });

    this.rtcengine.onEvent('lastmilequality', function(quality) {
      self.emit('lastmilequality', quality);
    });

    this.rtcengine.onEvent('firstlocalvideoframe', function(width, height, elapsed) {
      self.emit('firstlocalvideoframe', width, height, elapsed);
    });

    this.rtcengine.onEvent('firstremotevideodecoded', function(
      uid,
      width,
      height,
      elapsed
    ) {
      // Self.emit('addstream', uid, width, height, elapsed);
      self.emit('addstream', uid, elapsed);
    });

    this.rtcengine.onEvent('videosizechanged', function(uid, width, height, rotation) {
      self.emit('videosizechanged', uid, width, height, rotation);
    });

    this.rtcengine.onEvent('firstremotevideoframe', function(
      uid,
      width,
      height,
      elapsed
    ) {
      self.emit('firstremotevideoframe', uid, width, height, elapsed);
    });

    this.rtcengine.onEvent('userjoined', function(uid, elapsed) {
      console.log('user : ' + uid + ' joined.');
      // Self.emit('userjoined', uid, elapsed);
      self.emit('userjoined', uid, elapsed);
    });

    this.rtcengine.onEvent('useroffline', function(uid, reason) {
      if (!self.streams) {
        self.streams = {};
        console.log('Warning!!!!!!, streams is undefined.');
        return;
      }
      self.streams[uid] = undefined;
      self.rtcengine.unsubscribe(uid);
      self.emit('removestream', uid, reason);
    });

    this.rtcengine.onEvent('usermuteaudio', function(uid, muted) {
      self.emit('usermuteaudio', uid, muted);
    });

    this.rtcengine.onEvent('usermutevideo', function(uid, muted) {
      self.emit('usermutevideo', uid, muted);
    });

    this.rtcengine.onEvent('userenablevideo', function(uid, enabled) {
      self.emit('userenablevideo', uid, enabled);
    });

    this.rtcengine.onEvent('userenablelocalvideo', function(uid, enabled) {
      self.emit('userenablelocalvideo', uid, enabled);
    });

    this.rtcengine.onEvent('cameraready', function() {
      self.emit('cameraready');
    });

    this.rtcengine.onEvent('videostopped', function() {
      self.emit('videostopped');
    });

    this.rtcengine.onEvent('connectionlost', function() {
      self.emit('connectionlost');
    });

    this.rtcengine.onEvent('connectioninterrupted', function() {
      self.emit('connectioninterrupted');
    });

    this.rtcengine.onEvent('connectionbanned', function() {
      self.emit('connectionbanned');
    });

    this.rtcengine.onEvent('refreshrecordingservicestatus', function(status) {
      self.emit('refreshrecordingservicestatus', status);
    });

    this.rtcengine.onEvent('streammessage', function(uid, streamId, msg, len) {
      self.emit('streammessage', uid, streamId, msg, len);
    });

    this.rtcengine.onEvent('streammessageerror', function(
      uid,
      streamId,
      code,
      missed,
      cached
    ) {
      self.emit('streammessageerror', uid, streamId, code, missed, cached);
    });

    this.rtcengine.onEvent('mediaenginestartcallsuccess', function() {
      self.emit('mediaenginestartcallsuccess');
    });

    this.rtcengine.onEvent('requestchannelkey', function() {
      self.emit('requestchannelkey');
    });

    this.rtcengine.onEvent('fristlocalaudioframe', function(elapsed) {
      self.emit('firstlocalaudioframe', elapsed);
    });

    this.rtcengine.onEvent('firstremoteaudioframe', function(uid, elapsed) {
      self.emit('firstremoteaudioframe', uid, elapsed);
    });

    this.rtcengine.onEvent('activespeaker', function(uid) {
      self.emit('activespeaker', uid);
    });

    this.rtcengine.onEvent('clientrolechanged', function(oldRole, newRole) {
      self.emit('clientrolechanged', oldRole, newRole);
    });

    this.rtcengine.onEvent('audiodevicevolumechanged', function(
      deviceType,
      volume,
      muted
    ) {
      self.emit('audiodevicevolumechanged', deviceType, volume, muted);
    });

    this.rtcengine.onEvent('videosourcejoinsuccess', function(uid) {
      self.emit('videosourcejoinedsuccess', uid);
    });

    this.rtcengine.onEvent('videosourcerequestnewtoken', function() {
      self.emit('videosourcerequestnewtoken');
    });

    this.rtcengine.onEvent('videosourceleavechannel', function() {
      self.emit('videosourceleavechannel');
    });
    this.rtcengine.registerDeliverFrame(function(infos) {
      self.onRegisterDeliverFrame(infos);
    });
  }

  onRegisterDeliverFrame(infos) {
    var len = infos.length;
    // Console.log('len : ' + len);
    for (var i = 0; i < len; i++) {
      var info = infos[i];
      var type = info.type;
      var uid = info.uid;
      var header = info.header;
      var ydata = info.ydata;
      var udata = info.udata;
      var vdata = info.vdata;
      // Console.log('uid : ' + uid);
      if (!header || !ydata || !udata || !vdata) {
        console.log(
          'Invalid data param ： ' + header + ' ' + ydata + ' ' + udata + ' ' + vdata
        );
        continue;
      }
      var render = null;
      /*
      * Type 0 is local video
      * type 1 is remote video
      * type 2 is device test video
      * type 3 is video source video
      */
      if (type < 2) {
        if (uid === 0) {
          render = this.streams.local;
        } else {
          render = this.streams[uid];
        }
      } else if (type === 2) {
        render = this.streams.devtest;
      } else if (type === 3) {
        render = this.streams.videosource;
      }
      if (!render) {
        console.log("Can't find render for uid : " + uid);
        continue;
      }
      this.drawImage(render, header, ydata, udata, vdata);
    }
  }

  drawImage(render, header, yplanedata, uplanedata, vplanedata) {
    if (header.byteLength != 20) {
      //
      console.error('invalid image header ' + header.byteLength);
      return;
    }
    if (yplanedata.byteLength === 20) {
      console.error('invalid image yplane ' + yplane.byteLength);
      return;
    }
    if (uplanedata.byteLength === 20) {
      console.error('invalid image uplanedata ' + uplanedata.byteLength);
      return;
    }
    if (
      yplanedata.byteLength != uplanedata.byteLength * 4 ||
      uplanedata.byteLength != vplanedata.byteLength
    ) {
      console.error(
        'invalid image header ' +
          yplanedata.byteLength +
          ' ' +
          uplanedata.byteLength +
          ' ' +
          vplanedata.byteLength
      );
      return;
    }
    var headerLength = 20;
    var dv = new DataView(header);
    var format = dv.getUint8(0);
    var mirror = dv.getUint8(1);
    var width = dv.getUint16(2);
    var height = dv.getUint16(4);
    var left = dv.getUint16(6);
    var top = dv.getUint16(8);
    var right = dv.getUint16(10);
    var bottom = dv.getUint16(12);
    var rotation = dv.getUint16(14);
    var ts = dv.getUint32(16);
    var xWidth = width + left + right;
    var xHeight = height + top + bottom;
    var yLength = xWidth * xHeight;
    var yBegin = headerLength;
    var yEnd = yBegin + yLength;
    var uLength = yLength / 4;
    var uBegin = yEnd;
    var uEnd = uBegin + uLength;
    var vLength = yLength / 4;
    var vBegin = uEnd;
    var vEnd = vBegin + vLength;
    render.renderImage({
      mirror: mirror,
      width: width,
      height: height,
      left: left,
      top: top,
      right: right,
      bottom: bottom,
      rotation: rotation,
      yplane: new Uint8Array(yplanedata),
      uplane: new Uint8Array(uplanedata),
      vplane: new Uint8Array(vplanedata)
    });
    var now32 = (Date.now() & 0xffffffff) >>> 0;
    var latency = now32 - ts;
  }

  initRender(view) {
    var render = new AgoraRender();
    render.start(view, function(e) {
      console.log(`render start fail: ${e.error}`);
    });
    return render;
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
    return this.rtcengine.initialize(appid);
  }

  /**
   * @description return current version and build of sdk
   * @returns {string} version
   */
  getVersion() {
    return this.rtcengine.getVersion();
  }

  /**
   * @description Get error description of the given errorCode
   * @param {int} errorCode error code
   * @returns {string} error description
   */
  getErrorDescription(errorCode) {
    return this.rtcengine.getErrorDescription(errorCode);
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
    return this.rtcengine.joinChannel(token, channel, info, uid);
  }

  /**
   * @description Leave channel
   * @returns {int} 0 for success, <0 for failure
   */
  leaveChannel() {
    return this.rtcengine.leaveChannel();
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
    return this.rtcengine.setHighQualityAudioParameters(fullband, stereo, fullBitrate);
  }

  /**
   * @description subscribe remote uid and initialize corresponding render
   * @param {int} uid remote uid
   * @param {*} view dom where to initialize render
   * @returns {int} 0 for success, <0 for failure
   */
  subscribe(uid, view) {
    this.streams[uid] = this.initRender(view);
    return this.rtcengine.subscribe(uid);
  }

  /**
   * @description setup local video and corresponding render
   * @param {*} view dom element where we will initialize our view
   * @returns {int} 0 for success, <0 for failure
   */
  setupLocalVideo(view) {
    this.streams.local = this.initRender(view);
    return this.rtcengine.setupLocalVideo();
  }

  /**
   *
   * @description force set render dimension of video, this ONLY affects size of data sent to js layer, native video size is determined by setVideoProfile
   * @param {*} rendertype type of render, 0 - local, 1 - remote, 2 - device test, 3 - video source
   * @param {*} uid target uid
   * @param {*} width target width
   * @param {*} height target height
   */
  setVideoRenderDimension(rendertype, uid, width, height) {
    this.rtcengine.setVideoRenderDimension(rendertype, uid, width, height);
  }

  /**
   * @description force set render fps globally. This is mainly used to improve the performance for js rendering
   * once set, data will be forced to be sent with this fps. This can reduce cpu frequency of js rendering.
   * This applies to ALL views except ones added to High FPS stream.
   * @param {int} fps frame/s
   */
  setVideoRenderFPS(fps) {
    this.rtcengine.setFPS(fps);
  }

  /**
   * @description force set render fps for high stream. High stream here MEANS uid streams which has been
   * added to high ones by calling addVideoRenderToHighFPS, note this has nothing to do with dual stream
   * high stream. This is often used when we want to set low fps for most of views, but high fps for one
   * or two special views, e.g. screenshare
   * @param {int} fps frame/s
   */
  setVideoRenderHighFPS(fps) {
    this.rtcengine.setHighFPS(fps);
  }

  /**
   * @description add stream to high fps stream by uid. fps of streams added to high fps stream will be
   * controlled by setVideoRenderHighFPS
   * @param {*} uid stream uid
   */
  addVideoRenderToHighFPS(uid) {
    this.rtcengine.addToHighVideo(uid);
  }

  /**
   * @description remove stream from high fps stream by uid. fps of streams removed from high fps stream
   * will be controlled by setVideoRenderFPS
   * @param {*} uid stream uid
   */
  remoteVideoRenderFromHighFPS(uid) {
    this.rtcengine.removeFromHighVideo(uid);
  }

  /**
   * @description setup view content mode
   * @param {*} uid stream uid to operate
   * @param {*} mode view content mode, 0 - fit, 1 - fill
   * @returns {int} 0 - success, -1 - fail
   */
  setupViewContentMode(uid, mode) {
    let render = this.streams[uid];
    if (!render) {
      return -1;
    }

    render.contentMode = mode;
    return 0;
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
    return this.rtcengine.renewToken(newtoken);
  }

  /**
   * @description Set channel profile(before join channel) since sdk will do optimization according to scenario.
   * @description 0 (default) for communication, 1 for live broadcasting, 2 for in-game
   * @param {int} profile profile
   * @returns {int} 0 for success, <0 for failure
   */
  setChannelProfile(profile) {
    return this.rtcengine.setChannelProfile(profile);
  }

  /**
   *
   * @description In live broadcasting mode, set client role, 1 for anchor, 2 for audience
   * @param {Number} role client role
   * @returns {int} 0 for success, <0 for failure
   */
  setClientRole(role) {
    return this.rtcengine.setClientRole(role);
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
    return this.rtcengine.startEchoTest();
  }

  /**
   * @description This method stops an audio call test.
   * @returns {int} 0 for success, <0 for failure
   */
  stopEchoTest() {
    return this.rtcengine.stopEchoTest();
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
    return this.rtcengine.enableLastmileTest();
  }

  /**
   * @description This method disables the network connection quality test.
   * @returns {int} 0 for success, <0 for failure
   */
  disableLastmileTest() {
    return this.rtcengine.disableLastmileTest();
  }

  /**
   * @description Use before join channel to enable video communication, or you will only join with audio-enabled
   * @returns {int} 0 for success, <0 for failure
   */
  enableVideo() {
    return this.rtcengine.enableVideo();
  }

  /**
   * @description Use to disable video and use pure audio communication
   * @returns {int} 0 for success, <0 for failure
   */
  disableVideo() {
    return this.rtcengine.disableVideo();
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
    return this.rtcengine.startPreview();
  }

  /**
   * @description This method stops the local video preview and closes the video.
   * @returns {int} 0 for success, <0 for failure
   */
  stopPreview() {
    return this.rtcengine.stopPreview();
  }

  /**
   *
   * @param {int} profile - enumeration values represent video profile
   * @param {boolean} [swapWidthAndHeight = false] - Whether to swap width and height
   * @returns {int} 0 for success, <0 for failure
   */
  setVideoProfile(profile, swapWidthAndHeight = false) {
    return this.rtcengine.setVideoProfile(profile, swapWidthAndHeight);
  }

  /**
   * @description This method enables the audio mode, which is enabled by default.
   * @returns {int} 0 for success, <0 for failure
   */
  enableAudio() {
    return this.rtcengine.enableAudio();
  }

  /**
   * @description This method disables the audio mode.
   * @returns {int} 0 for success, <0 for failure
   */
  disableAudio() {
    return this.rtcengine.disableAudio();
  }

  /**
   * @description Set audio profile (before join channel) depending on your scenario
   * @param {Number} profile audio profile
   * @param {Number} scenario audio scenario
   * @returns {int} 0 for success, <0 for failure
   */
  setAudioProfile(profile, scenario) {
    return this.rtcengine.setAudioProfile(profile, scenario);
  }

  /**
   * @description This method allows users to set video preferences.
   * @param {boolean} preferFrameRateOverImageQuality enable/disable framerate over image quality
   * @returns {int} 0 for success, <0 for failure
   */
  setVideoQualityParameters(preferFrameRateOverImageQuality) {
    return this.rtcengine.setVideoQualityParameters(preferFrameRateOverImageQuality);
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
    return this.rtcengine.setEncryptionSecret(secret);
  }

  /**
   * @description This method mutes/unmutes local audio. It enables/disables 
   * sending local audio streams to the network.
   * @param {boolean} mute mute/unmute audio
   * @returns {int} 0 for success, <0 for failure
   */
  muteLocalAudioStream(mute) {
    return this.rtcengine.muteLocalAudioStream(mute);
  }

  /**
   * @description This method mutes/unmutes all remote users’ audio streams.
   * @param {boolean} mute mute/unmute audio
   * @returns {int} 0 for success, <0 for failure
   */
  muteAllRemoteAudioStreams(mute) {
    return this.rtcengine.muteAllRemoteAudioStreams(mute);
  }

  /**
   * @description set default mute/unmute all the remote audio stream receiving
   * @param {boolean} mute mute/unmute audio
   * @returns {int} 0 for success, <0 for failure
   */
  setDefaultMuteAllRemoteAudioStreams(mute) {
    return this.rtcengine.setDefaultMuteAllRemoteAudioStreams(mute);
  }

  /**
   * @description This method mutes/unmutes a specified user’s audio stream.
   * @param {int} uid user to mute/unmute
   * @param {boolean} mute mute/unmute audio
   * @returns {int} 0 for success, <0 for failure
   */
  muteRemoteAudioStream(uid, mute) {
    return this.rtcengine.muteRemoteAudioStream(uid, mute);
  }

  /**
   * @description This method mutes/unmutes video stream
   * @param {boolean} mute mute/unmute video
   * @returns {int} 0 for success, <0 for failure
   */
  muteLocalVideoStream(mute) {
    return this.rtcengine.muteLocalVideoStream(mute);
  }

  /**
   * @description This method disables the local video, which is only applicable to
   * the scenario when the user only wants to watch the remote video without sending
   * any video stream to the other user. This method does not require a local camera.
   * @param {boolean} enable enable/disable video
   * @returns {int} 0 for success, <0 for failure
   */
  enableLocalVideo(enable) {
    return this.rtcengine.enableLocalVideo(enable);
  }

  /**
   * @description This method mutes/unmutes all remote users’ video streams.
   * @param {boolean} mute mute/unmute video
   * @returns {int} 0 for success, <0 for failure
   */
  muteAllRemoteVideoStreams(mute) {
    return this.rtcengine.muteAllRemoteVideoStreams(mute);
  }

  /**
   * @description set default mute/unmute all the remote video stream receiving
   * @param {boolean} mute mute/unmute video
   * @returns {int} 0 for success, <0 for failure
   */
  setDefaultMuteAllRemoteVideoStreams(mute) {
    return this.rtcengine.setDefaultMuteAllRemoteVideoStreams(mute);
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
    return this.rtcengine.enableAudioVolumeIndication(interval, smooth);
  }

  /**
   * @description This method mutes/unmutes a specified user’s video stream.
   * @param {int} uid user to mute/unmute
   * @param {boolean} mute mute/unmute video
   * @returns {int} 0 for success, <0 for failure
   */
  muteRemoteVideoStream(uid, mute) {
    return this.rtcengine.muteRemoteVideoStream(uid, mute);
  }

  /**
   * @description This method sets the in ear monitoring volume.
   * @param {*} volume Volume of the in-ear monitor, ranging from 0 to 100. The default value is 100.
   * @returns {int} 0 for success, <0 for failure
   */
  setInEarMonitoringVolume(volume) {
    return this.rtcengine.setInEarMonitoringVolume(volume);
  }

  /**
   * @description disable audio function in channel, which will be recovered when leave channel.
   * @returns {int} 0 for success, <0 for failure
   */
  pauseAudio() {
    return this.rtcengine.pauseAudio();
  }

  /**
   * @description resume audio function in channel.
   * @returns {int} 0 for success, <0 for failure
   */
  resumeAudio() {
    return this.rtcengine.resumeAudio();
  }

  /**
   * @description set filepath of log
   * @param {string} filepath filepath of log
   * @returns {int} 0 for success, <0 for failure
   */
  setLogFile(filepath) {
    return this.rtcengine.setLogFile(filepath);
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
    return this.rtcengine.setLogFilter(filter);
  }

  /**
   * @description This method sets the stream mode (only applicable to live broadcast) to 
   * single- (default) or dual-stream mode.
   * @param {boolean} enable enable/disable dual stream
   * @returns {int} 0 for success, <0 for failure
   */
  enableDualStreamMode(enable) {
    return this.rtcengine.enableDualStreamMode(enable);
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
    return this.rtcengine.setRemoteVideoStreamType(uid, streamType);
  }

  /**
   * @description This method sets the default remote video stream type to high or low.
   * @param {int} streamType 0 - high, 1 - low
   * @returns {int} 0 for success, <0 for failure
   */
  setRemoteDefaultVideoStreamType(streamType) {
    return this.rtcengine.setRemoteDefaultVideoStreamType(streamType);
  }

  /**
   * @description This method enables interoperability with the Agora Web SDK.
   * @param {*} enable enable/disable interop
   * @returns {int} 0 for success, <0 for failure
   */
  enableWebSdkInteroperability(enable) {
    return this.rtcengine.enableWebSdkInteroperability(enable);
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
    return this.rtcengine.setLocalVideoMirrorMode(mirrortype);
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
    return this.rtcengine.setExternalAudioSource(enabled, samplerate, channels);
  }

  /**
   * @description return list of video devices
   * @returns {array} array of device object
   */
  getVideoDevices() {
    return this.rtcengine.getVideoDevices();
  }

  /**
   * @description set video device to use via device id
   * @param {*} deviceid device id
   * @returns {int} 0 for success, <0 for failure
   */
  setVideoDevice(deviceid) {
    return this.rtcengine.setVideoDevice(deviceid);
  }

  /**
   * @description get current using video device
   * @return {object} video device object
   */
  getCurrentVideoDevice() {
    return this.rtcengine.getCurrentVideoDevice();
  }

  /**
   * @description This method tests whether the video-capture device works properly.
   * Before calling this method, ensure that you have already called enableVideo,
   * and the HWND window handle of the incoming parameter is valid.
   * @returns {int} 0 for success, <0 for failure
   */
  startVideoDeviceTest() {
    return this.rtcengine.startVideoDeviceTest();
  }

  /**
   * @description stop video device test
   * @returns {int} 0 for success, <0 for failure
   */
  stopVideoDeviceTest() {
    return this.rtcengine.stopVideoDeviceTest();
  }

  /**
   * @description return list of audio playback devices
   * @returns {array} array of device object
   */
  getAudioPlaybackDevices() {
    return this.rtcengine.getAudioPlaybackDevices();
  }

  /**
   * @description set audio playback device to use via device id
   * @param {*} deviceid device id
   * @returns {int} 0 for success, <0 for failure
   */
  setAudioPlaybackDevice(deviceid) {
    return this.rtcengine.setAudioPlaybackDevice(deviceid);
  }

  /**
   * @description get current using audio playback device
   * @return {object} audio playback device object
   */
  getCurrentAudioPlaybackDevice() {
    return this.rtcengine.getCurrentAudioPlaybackDevice();
  }

  /**
   * @description set device playback volume
   * @param {int} volume 0 - 255
   * @returns {int} 0 for success, <0 for failure
   */
  setAudioPlaybackVolume(volume) {
    return this.rtcengine.setAudioPlaybackVolume(volume);
  }

  /**
   * @description get device playback volume
   * @returns {int} volume
   */
  getAudioPlaybackVolume() {
    return this.rtcengine.getAudioPlaybackVolume();
  }

  /**
   * @description get audio recording devices
   * @returns {array} array of recording devices
   */
  getAudioRecordingDevices() {
    return this.rtcengine.getAudioRecordingDevices();
  }

  /**
   * @description set audio recording device
   * @param {*} deviceid device id
   * @returns {int} 0 for success, <0 for failure
   */
  setAudioRecordingDevice(deviceid) {
    return this.rtcengine.setAudioRecordingDevice(deviceid);
  }

  /**
   * @description get current selected audio recording device
   * @returns {object} audio recording device object
   */
  getCurrentAudioRecordingDevice() {
    return this.rtcengine.getCurrentAudioRecordingDevice();
  }

  /**
   * @description get audio recording volume
   * @return {int} volume
   */
  getAudioRecordingVolume() {
    return this.rtcengine.getAudioRecordingVolume();
  }

  /**
   * @description set audio recording device volume
   * @param {*} volume 0 - 255
   * @returns {int} 0 for success, <0 for failure
   */
  setAudioRecordingVolume(volume) {
    return this.rtcengine.setAudioRecordingVolume(volume);
  }

  /**
   * @description This method checks whether the playback device works properly. The SDK plays an audio file
   * specified by the user. If the user can hear the sound, then the playback device works properly.
   * @param {string} filepath filepath of sound file to play test
   * @returns {int} 0 for success, <0 for failure
   */
  startAudioPlaybackDeviceTest(filepath) {
    return this.rtcengine.startAudioPlaybackDeviceTest(filepath);
  }

  /**
   * @description stop playback device test
   * @returns {int} 0 for success, <0 for failure
   */
  stopAudioPlaybackDeviceTest() {
    return this.rtcengine.stopAudioPlaybackDeviceTest();
  }

  /**
   * @description This method checks whether the microphone works properly. Once the test starts, the SDK uses
   * the onAudioVolumeIndication callback to notify the application about the volume information.
   * @param {*} indicateInterval in second
   * @returns {int} 0 for success, <0 for failure
   */
  startAudioRecordingDeviceTest(indicateInterval) {
    return this.rtcengine.startAudioRecordingDeviceTest(indicateInterval);
  }

  /**
   * @description stop audio recording device test
   * @returns {int} 0 for success, <0 for failure
   */
  stopAudioRecordingDeviceTest() {
    return this.rtcengine.stopAudioRecordingDeviceTest();
  }

  /**
   * @description check whether selected audio playback device is muted
   * @returns {boolean} muted/unmuted
   */
  getAudioPlaybackDeviceMute() {
    return this.rtcengine.getAudioPlaybackDeviceMute();
  }

  /**
   * @description set current audio playback device mute/unmute
   * @param {boolean} mute mute/unmute
   * @returns {int} 0 for success, <0 for failure
   */
  setAudioPlaybackDeviceMute(mute) {
    return this.rtcengine.setAudioPlaybackDeviceMute(mute);
  }

  /**
   * @description check whether selected audio recording device is muted
   * @returns {boolean} muted/unmuted
   */
  getAudioRecordingDeviceMute() {
    return this.rtcengine.getAudioRecordingDeviceMute();
  }

  /**
   * @description set current audio recording device mute/unmute
   * @param {boolean} mute mute/unmute
   * @returns {int} 0 for success, <0 for failure
   */
  setAudioRecordingDeviceMute(mute) {
    return this.rtcengine.setAudioRecordingDeviceMute(mute);
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
    return this.rtcengine.videoSourceInitialize(appid);
  }

  /**
   * @description setup render for video source
   * @param {*} view dom element where video source should be displayed
   */
  setupLocalVideoSource(view) {
    this.streams.videosource = this.initRender(view);
  }

  /**
   * @description Set it to true to enable videosource web interoperability
   * @param {Boolean} enabled enalbe/disable web interoperability
   * @returns {int} 0 for success, <0 for failure
   */
  videoSourceEnableWebSdkInteroperability(enabled) {
    return this.rtcengine.videoSourceEnableWebSdkInteroperability(enabled);
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
    return this.rtcengine.videoSourceJoin(token, cname, info, uid);
  }

  /**
   * @description let video source Leave channel
   * @returns {int} 0 for success, <0 for failure
   */
  videoSourceLeave() {
    return this.rtcengine.videoSourceLeave();
  }

  /**
   * @description This method updates the Token for video source
   * @param {*} token new token to update
   * @returns {int} 0 for success, <0 for failure
   */
  videoSourceRenewToken(token) {
    return this.rtcengine.videoSourceRenewToken(token);
  }

  /**
   * @description Set channel profile(before join channel) for video source
   * @description 0 (default) for communication, 1 for live broadcasting, 2 for in-game
   * @param {int} profile profile
   * @returns {int} 0 for success, <0 for failure
   */
  videoSourceSetChannelProfile(profile) {
    return this.rtcengine.videoSourceSetChannelProfile(profile);
  }

  /**
   * @description set video profile for video source
   * @param {int} profile - enumeration values represent video profile
   * @param {boolean} [swapWidthAndHeight = false] - Whether to swap width and height
   * @returns {int} 0 for success, <0 for failure
   */
  videoSourceSetVideoProfile(profile, swapWidthAndHeight) {
    return this.rtcengine.videoSourceSetVideoProfile(profile, swapWidthAndHeight);
  }

  /**
   * @description start video source screen capture
   * @param {*} wndid windows id to capture
   * @param {*} captureFreq fps of video source screencapture, 1 - 15
   * @param {*} rect null/if specified, {x: 0, y: 0, width: 0, height: 0}
   * @param {*} bitrate bitrate of video source screencapture
   * @returns {int} 0 for success, <0 for failure
   */
  startScreenCapture2(wndid, captureFreq, rect, bitrate) {
    return this.rtcengine.startScreenCapture2(wndid, captureFreq, rect, bitrate);
  }

  /**
   * @description stop video source screen capture
   * @returns {int} 0 for success, <0 for failure
   */
  stopScreenCapture2() {
    return this.rtcengine.stopScreenCatpure2();
  }

  /**
   * @description start video source preview
   * @returns {int} 0 for success, <0 for failure
   */
  startScreenCapturePreview() {
    return this.rtcengine.videoSourceStartPreview();
  }

  /**
   * @description stop video source preview
   * @returns {int} 0 for success, <0 for failure
   */
  stopScreenCapturePreview() {
    return this.rtcengine.videoSourceStopPreview();
  }

  /**
   * @description setParameters for video source
   * @param {*} parameter parameter to set
   * @returns {int} 0 for success, <0 for failure
   */
  videoSourceSetParameters(parameter) {
    return this.rtcengine.videoSourceSetParameter(parameter);
  }

  /**
   * @description release video source object
   * @returns {int} 0 for success, <0 for failure
   */
  videoSourceRelease() {
    return this.rtcengine.videoSourceRelease();
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
   * @param {*} rect null/if specified, {x: 0, y: 0, width: 0, height: 0}
   * @param {*} bitrate bitrate of screencapture
   * @returns {int} 0 for success, <0 for failure
   */
  startScreenCapture(windowId, captureFreq, rect, bitrate) {
    return this.rtcengine.startScreenCapture(windowId, captureFreq, rect, bitrate);
  }

  /**
   * @description stop screen capture
   * @returns {int} 0 for success, <0 for failure
   */
  stopScreenCapture() {
    return this.rtcengine.stopScreenCapture();
  }

  /**
   * @description This method updates the screen capture region.
   * @param {*} rect {x: 0, y: 0, width: 0, height: 0}
   * @returns {int} 0 for success, <0 for failure
   */
  updateScreenCaptureRegion(rect) {
    return this.rtcengine.updateScreenCaptureRegion(rect);
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
    return this.rtcengine.startAudioMixing(filepath, loopback, replace, cycle);
  }

  /**
   * @description This method stops audio mixing. Call this API when you are in a channel.
   * @returns {int} 0 for success, <0 for failure
   */
  stopAudioMixing() {
    return this.rtcengine.stopAudioMixing();
  }

  /**
   * @description This method pauses audio mixing. Call this API when you are in a channel.
   * @returns {int} 0 for success, <0 for failure
   */
  pauseAudioMixing() {
    return this.rtcengine.pauseAudioMixing();
  }

  /**
   * @description This method resumes audio mixing from pausing. Call this API when you are in a channel.
   * @returns {int} 0 for success, <0 for failure
   */
  resumeAudioMixing() {
    return this.rtcengine.resumeAudioMixing();
  }

  /**
   * @description This method adjusts the volume during audio mixing. Call this API when you are in a channel.
   * @param {int} volume Volume ranging from 0 to 100. By default, 100 is the original volume.
   * @returns {int} 0 for success, <0 for failure
   */
  adjustAudioMixingVolume(volume) {
    return this.rtcengine.adjustAudioMixingVolume(volume);
  }

  /**
   * @description This method gets the duration (ms) of the audio mixing. Call this API when you are in 
   * a channel. A return value of 0 means that this method call has failed.
   * @returns {int} duration of audio mixing
   */
  getAudioMixingDuration() {
    return this.rtcengine.getAudioMixingDuration();
  }

  /**
   * @description This method gets the playback position (ms) of the audio. Call this API 
   * when you are in a channel.
   * @returns {int} current playback position
   */
  getAudioMixingCurrentPosition() {
    return this.rtcengine.getAudioMixingCurrentPosition();
  }

  /**
   * @description This method drags the playback progress bar of the audio mixing file to where 
   * you want to play instead of playing it from the beginning.
   * @param {int} position Integer. The position of the audio mixing file in ms
   * @returns {int} 0 for success, <0 for failure
   */
  setAudioMixingPosition(position) {
    return this.rtcengine.setAudioMixingPosition(position);
  }

  // ===========================================================================
  // PUSH STREAMS
  // ===========================================================================
  /**
   *
   * @param {*} publisherConfiguration
   *    propertys :
   *      width : int
   *      height : int
   *      framerate : int
   *      bitrate : int
   *      defaultlayout : int
   *      lifecycle : int
   *      owner : boolean
   *      injectstreamwidth : int
   *      injectstreamheight : int
   *      injectstreamurl: string
   *      publishurl : string
   *      rawstreamurl :string
   *      extrainfo : string
   * @returns {int} 0 for success, <0 for failure
   *
   */
  configPublisher(publisherConfiguration) {
    return this.rtcengine.configPublisher(publisherConfiguration);
  }

  /**
   *
   * @param {*} liveTranscoding
   *    Properties:
   *      width : int
   *      height : int
   *      videobitrate : int
   *      videoframerate : int
   *      lowlatency : boolean
   *      videogop : int
   *      videocodecprofile : int
   *      backgroundcolor : uint
   *      usercount : uint
   *      audiosamplerate : int
   *      audiobitrate : int
   *      audiochannels : int
   *      transcodingusers : Array of object type TranscodingUser
   *
   *   Properties of TranscodingUser
   *      uid : uint
   *      x : int
   *      y : int
   *      width : int
   *      height : int
   *      zorder : int
   *      alpha : double
   *      audiochannel : int
   * @returns {int} 0 for success, <0 for failure
   */
  setLiveTranscoding(liveTranscoding) {
    return this.rtcengine.setLiveTranscoding(liveTranscoding);
  }

  /**
   *
   * @param {*} layout
   *    Properties:
   *      canvaswidth : int
   *      canvasheight : int
   *      backgroundcolor : string
   *      regioncount : int
   *      appdata : string
   *      appdatalength : int
   *      regions : Array of object type Region
   *
   *   Properties of Region
   *      uid : uint
   *      x : double
   *      y : double
   *      width : double
   *      height : double
   *      zorder : int
   *      alpha : double
   *      rendermode : int
   * @returns {int} 0 for success, <0 for failure
   */
  setVideoCompositingLayout(layout) {
    return this.rtcengine.setVideoCompositingLayout(layout);
  }

  /**
   * @description This method removes the settings made after calling setVideoCompositingLayout.
   * @returns {int} 0 for success, <0 for failure
   */
  clearVideoCompositingLayout() {
    return this.rtcengine.clearVideoCompositingLayout();
  }

  /**
   * @description This method is used in CDN live. It adds the URL to which the host publishes the stream.
   * @param {*} url cdn url
   * @param {*} transcodingEnabled enable/disable transcoding
   * @returns {int} 0 for success, <0 for failure
   */
  addPublishStreamUrl(url, transcodingEnabled) {
    return this.rtcengine.addPublishStreamUrl(url, transcodingEnabled);
  }

  /**
   * @description This method is used in CDN live. It removes the URL to which the host publishes the stream.
   * @param {*} url cdn url
   * @returns {int} 0 for success, <0 for failure
   */
  removePublishStreamUrl(url) {
    return this.rtcengine.removePublishStreamUrl(url);
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
    return this.rtcengine.setRecordingAudioFrameParameters(
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
    return this.rtcengine.setPlaybackAudioFrameParameters(
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
    return this.rtcengine.setMixedAudioFrameParameters(sampleRate, samplesPerCall);
  }

  // ===========================================================================
  // INJECT VIDEO STREAM
  // ===========================================================================
  /**
   *
   * @param {*} injectStreamConfig
   *   properties :
   *      width : int
   *      height : int
   *      videogop : int
   *      videoframerate : int
   *      videobitrate : int
   *      audiosamplerate : int
   *      audiobitrate : int
   *      audiochannels : int
   * @returns {int} 0 for success, <0 for failure
   */
  addInjectStreamUrl(injectStreamConfig) {
    return this.rtcengine.addInjectStreamUrl(injectStreamConfig);
  }

  /**
   * @description This method removes an injected stream URL.
   * @param {*} url inject url
   * @returns {int} 0 for success, <0 for failure
   */
  removeInjectStreamUrl(url) {
    return this.rtcengine.removeInjectStreamUrl(url);
  }

  // ===========================================================================
  // AUDIO EFFECT
  // ===========================================================================
  /**
   * @description This method changes the voice pitch of the local speaker.
   * @param {number} pitch Voice frequency, in the range of [0.5, 2.0]. The default value is 1.0.
   * @returns {int} 0 for success, <0 for failure
   */
  setLocalVoicePitch(pitch) {
    return this.rtcengine.setLocalVoicePitch(pitch);
  }

  /**
   * @description This method sets the local voice equalization effect.
   * @param {int} freq The band frequency ranging from 0 to 9; representing the respective 10-band
   * center frequencies of voice effects, including 31, 62, 125, 500, 1k, 2k, 4k, 8k, and 16k Hz.
   * @param {int} bandgain Gain of each band in dB; ranging from -15 to 15.
   * @returns {int} 0 for success, <0 for failure
   */
  setLocalVoiceEqualization(freq, bandgain) {
    return this.rtcengine.setLocalVoiceEqualization(freq, bandgain);
  }

  /**
   * @description This method sets local voice reverberation.
   * @param {int} key The reverberation key. This method contains five reverberation keys.
   * @param {int} value reverb values
   * AUDIO_REVERB_DRY_LEVEL = 0, (dB, [-20,10]), level of the dry signal
   * AUDIO_REVERB_WET_LEVEL = 1, (dB, [-20,10]), level of the early reflection signal (wet signal)
   * AUDIO_REVERB_ROOM_SIZE = 2, ([0, 100]), room size of the reflection
   * AUDIO_REVERB_WET_DELAY = 3, (ms, [0, 200]), length of the initial latency of the wet signal in ms
   * AUDIO_REVERB_STRENGTH = 4, ([0, 100]), length of the late reverberation
   * @returns {int} 0 for success, <0 for failure
   */
  setLocalVoiceReverb(key, value) {
    return this.rtcengine.setLocalVoiceReverb(key, value);
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
    return this.rtcengine.createDataStream(reliable, ordered);
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
    return this.rtcengine.sendStreamMessage(streamId, msg);
  }

  // ===========================================================================
  // MANAGE AUDIO EFFECT
  // ===========================================================================
  /**
   * @description get effects volume
   * @returns {number} volume
   */
  getEffectsVolume() {
    return this.rtcengine.getEffectsVolume();
  }

  /**
   * @description set effects volume
   * @param {int} volume - [0.0, 100.0]
   * @returns {int} 0 for success, <0 for failure
   */
  setEffectsVolume(volume) {
    return this.rtcengine.setEffectsVolume(volume);
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
    return this.rtcengine.playEffect(
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
    return this.rtcengine.stopEffect(soundId);
  }

  /**
   * @description preload effect
   * @param {int} soundId soundId
   * @param {String} filePath filepath
   * @returns {int} 0 for success, <0 for failure
   */
  preloadEffect(soundId, filePath) {
    return this.rtcengine.preloadEffect(soundId, filePath);
  }

  /**
   * This method releases a specific preloaded audio effect from the memory.
   * @param {int} soundId soundId
   * @returns {int} 0 for success, <0 for failure
   */
  unloadEffect(soundId) {
    return this.rtcengine.unloadEffect(soundId);
  }

  /**
   * @description This method pauses a specific audio effect.
   * @param {*} soundId soundId
   * @returns {int} 0 for success, <0 for failure
   */
  pauseEffect(soundId) {
    return this.rtcengine.pauseEffect(soundId);
  }

  /**
   * @description This method pauses all the audio effects.
   * @returns {int} 0 for success, <0 for failure
   */
  pauseAllEffects() {
    return this.rtcengine.pauseAllEffects();
  }

  /**
   * @description This method resumes playing a specific audio effect.
   * @param {*} soundId soundid
   * @returns {int} 0 for success, <0 for failure
   */
  resumeEffect(soundId) {
    return this.rtcengine.resumeEffect(soundId);
  }

  /**
   * @description This method resumes playing all the audio effects.
   * @returns {int} 0 for success, <0 for failure
   */
  resumeAllEffects() {
    return this.rtcengine.resumeAllEffects();
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
    return this.rtcengine.getCallId();
  }

  /**
   * @description This method lets the user rate the call. It is usually called after the call ends.
   * @param {string} callid Call ID retrieved from the getCallId method.
   * @param {int} rating Rating for the call between 1 (lowest score) to 10 (highest score).
   * @param {*} desc A given description for the call with a length less than 800 bytes.
   * @returns {int} 0 for success, <0 for failure
   */
  rate(callid, rating, desc) {
    return this.rtcengine.rate(callid, rating, desc);
  }

  /**
   * @description This method allows the user to complain about the call quality. It is usually
   * called after the call ends.
   * @param {string} callid Call ID retrieved from the getCallId method.
   * @param {string} desc A given description of the call with a length less than 800 bytes.
   * @returns {int} 0 for success, <0 for failure
   */
  complain(callid, desc) {
    return this.rtcengine.complain(callid, desc);
  }

  // ===========================================================================
  // replacement for setParameters call
  // ===========================================================================
  setBool(key, value) {
    return this.rtcengine.setBool(key, value);
  }

  setInt(key, value) {
    return this.rtcengine.setInt(key, value);
  }

  setUInt(key, value) {
    return this.rtcengine.setUInt(key, value);
  }

  setNumber(key, value) {
    return this.rtcengine.setNumber(key, value);
  }

  setString(key, value) {
    return this.rtcengine.setString(key, value);
  }

  setObject(key, value) {
    return this.rtcengine.setObject(key, value);
  }

  getBool(key) {
    return this.rtcengine.getBool(key);
  }

  getInt(key) {
    return this.rtcengine.getInt(key);
  }

  getUInt(key) {
    return this.rtcengine.getUInt(key);
  }

  getNumber(key) {
    return this.rtcengine.getNumber(key);
  }

  getString(key) {
    return this.rtcengine.getString(key);
  }

  getObject(key) {
    return this.rtcengine.getObject(key);
  }

  getArray(key) {
    return this.rtcengine.getArray(key);
  }

  setParameters(param) {
    return this.rtcengine.setParameters(param);
  }

  convertPath(path) {
    return this.rtcengine.convertPath(path);
  }

  enableLoopbackRecording(enabled) {
    return this.rtcengine.enableLoopbackRecording(enabled);
  }

  setProfile(profile, merge) {
    return this.rtcengine.setProfile(profile, merge);
  }
}

module.exports = AgoraRtcEngine;
