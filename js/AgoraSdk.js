const EventEmitter = require("events").EventEmitter;
const AgoraRender = require("./AgoraRender");
const agora = require("../build/Release/agora_node_ext");

class AgoraRtcEngine extends EventEmitter {
  constructor() {
    super();
    this.rtcengine = new agora.NodeRtcEngine();
    this.initEventHandler();
    this.streams = {};
  }

  initEventHandler() {
    var self = this;
    this.rtcengine.onEvent("joinchannel", function(channel, uid, elapsed) {
      self.emit("joinedchannel", channel, uid, elapsed);
    });

    this.rtcengine.onEvent("rejoinchannel", function(channel, uid, elapsed) {
      self.emit("rejoinedchannel", channel, uid, elapsed);
    });

    this.rtcengine.onEvent("warning", function(warn, msg) {
      self.emit("warning", warn, msg);
    });

    this.rtcengine.onEvent("error", function(err, msg) {
      self.emit("error", err, msg);
    });

    this.rtcengine.onEvent("audioquality", function(uid, quality, delay, lost) {
      self.emit("audioquality", uid, quality, delay, lost);
    });

    this.rtcengine.onEvent("audiovolumeindication", function(
      uid,
      volume,
      speakerNumber,
      totalVolume
    ) {
      self.emit(
        "audiovolumeindication",
        uid,
        volume,
        speakerNumber,
        totalVolume
      );
    });

    this.rtcengine.onEvent("leavechannel", function() {
      self.emit("leavechannel");
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
    this.rtcengine.onEvent("rtcstats", function(stats) {
      self.emit("rtcstats", stats);
    });

    /**
     *
     *        Int sentBitrate;
     *        int sentFrameRate;
     */
    this.rtcengine.onEvent("localvideostats", function(stats) {
      self.emit("localvideostats", stats);
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
    this.rtcengine.onEvent("remotevideostats", function(stats) {
      self.emit("remotevideostats", stats);
    });

    this.rtcengine.onEvent("audiodevicestatechanged", function(
      deviceId,
      deviceType,
      deviceState
    ) {
      self.emit("audiodevicestatechanged", deviceId, deviceType, deviceState);
    });

    this.rtcengine.onEvent("audiomixingfinished", function() {
      self.emit("audiomixingfinished");
    });

    this.rtcengine.onEvent("apicallexecuted", function(api, err) {
      self.emit("apicallexecuted", api, err);
    });

    this.rtcengine.onEvent("remoteaudiomixingbegin", function() {
      self.emit("remoteaudiomixingbegin");
    });

    this.rtcengine.onEvent("remoteaudiomixingend", function() {
      self.emit("remoteaudiomixingend");
    });

    this.rtcengine.onEvent("audioeffectfinished", function(soundId) {
      self.emit("audioeffectfinished", soundId);
    });

    this.rtcengine.onEvent("videodevicestatechanged", function(
      deviceId,
      deviceType,
      deviceState
    ) {
      self.emit("videodevicestatechanged", deviceId, deviceType, deviceState);
    });

    this.rtcengine.onEvent("networkquality", function(
      uid,
      txquality,
      rxquality
    ) {
      self.emit("networkquality", uid, txquality, rxquality);
    });

    this.rtcengine.onEvent("lastmilequality", function(quality) {
      self.emit("lastmilequality", quality);
    });

    this.rtcengine.onEvent("firstlocalvideoframe", function(
      width,
      height,
      elapsed
    ) {
      self.emit("firstlocalvideoframe", width, height, elapsed);
    });

    this.rtcengine.onEvent("firstremotevideodecoded", function(
      uid,
      width,
      height,
      elapsed
    ) {
      // Self.emit("addstream", uid, width, height, elapsed);
      self.emit("addstream", uid, elapsed);
    });

    this.rtcengine.onEvent("videosizechanged", function(
      uid,
      width,
      height,
      rotation
    ) {
      self.emit("videosizechanged", uid, width, height, rotation);
    });

    this.rtcengine.onEvent("firstremotevideoframe", function(
      uid,
      width,
      height,
      elapsed
    ) {
      self.emit("firstremotevideoframe", uid, width, height, elapsed);
    });

    this.rtcengine.onEvent("userjoined", function(uid, elapsed) {
      console.log("user : " + uid + " joined.");
      // Self.emit("userjoined", uid, elapsed);
      self.emit("userjoined", uid, elapsed);
    });

    this.rtcengine.onEvent("useroffline", function(uid, reason) {
      if (!self.streams) {
        self.streams = {};
        console.log("Warning!!!!!!, streams is undefined.");
        return;
      }
      self.streams[uid] = undefined;
      self.rtcengine.unsubscribe(uid);
      self.emit("removestream", uid, reason);
    });

    this.rtcengine.onEvent("usermuteaudio", function(uid, muted) {
      self.emit("usermuteaudio", uid, muted);
    });

    this.rtcengine.onEvent("usermutevideo", function(uid, muted) {
      self.emit("usermutevideo", uid, muted);
    });

    this.rtcengine.onEvent("userenablevideo", function(uid, enabled) {
      self.emit("userenablevideo", uid, enabled);
    });

    this.rtcengine.onEvent("userenablelocalvideo", function(uid, enabled) {
      self.emit("userenablelocalvideo", uid, enabled);
    });

    this.rtcengine.onEvent("cameraready", function() {
      self.emit("cameraready");
    });

    this.rtcengine.onEvent("videostopped", function() {
      self.emit("videostopped");
    });

    this.rtcengine.onEvent("connectionlost", function() {
      self.emit("connectionlost");
    });

    this.rtcengine.onEvent("connectioninterrupted", function() {
      self.emit("connectioninterrupted");
    });

    this.rtcengine.onEvent("connectionbanned", function() {
      self.emit("connectionbanned");
    });

    this.rtcengine.onEvent("refreshrecordingservicestatus", function(status) {
      self.emit("refreshrecordingservicestatus", status);
    });

    this.rtcengine.onEvent("streammessage", function(uid, streamId, msg, len) {
      self.emit("streammessage", uid, streamId, msg, len);
    });

    this.rtcengine.onEvent("streammessageerror", function(
      uid,
      streamId,
      code,
      missed,
      cached
    ) {
      self.emit("streammessageerror", uid, streamId, code, missed, cached);
    });

    this.rtcengine.onEvent("mediaenginestartcallsuccess", function() {
      self.emit("mediaenginestartcallsuccess");
    });

    this.rtcengine.onEvent("requestchannelkey", function() {
      self.emit("requestchannelkey");
    });

    this.rtcengine.onEvent("fristlocalaudioframe", function(elapsed) {
      self.emit("firstlocalaudioframe", elapsed);
    });

    this.rtcengine.onEvent("firstremoteaudioframe", function(uid, elapsed) {
      self.emit("firstremoteaudioframe", uid, elapsed);
    });

    this.rtcengine.onEvent("activespeaker", function(uid) {
      self.emit("activespeaker", uid);
    });

    this.rtcengine.onEvent("clientrolechanged", function(oldRole, newRole) {
      self.emit("clientrolechanged", oldRole, newRole);
    });

    this.rtcengine.onEvent("audiodevicevolumechanged", function(
      deviceType,
      volume,
      muted
    ) {
      self.emit("audiodevicevolumechanged", deviceType, volume, muted);
    });

    this.rtcengine.onEvent("videosourcejoinsuccess", function(uid) {
      self.emit("videosourcejoinedsuccess", uid);
    });

    this.rtcengine.onEvent("videosourcerequestnewtoken", function() {
      self.emit("videosourcerequestnewtoken");
    });

    this.rtcengine.onEvent("videosourceleavechannel", function() {
      self.emit("videosourceleavechannel");
    });
    this.rtcengine.registerDeliverFrame(function(infos) {
      self.onRegisterDeliverFrame(infos);
    });
  }

  onRegisterDeliverFrame(infos) {
    var len = infos.length;
    // Console.log("len : " + len);
    for (var i = 0; i < len; i++) {
      var info = infos[i];
      var type = info.type;
      var uid = info.uid;
      var header = info.header;
      var ydata = info.ydata;
      var udata = info.udata;
      var vdata = info.vdata;
      // Console.log("uid : " + uid);
      if (!header || !ydata || !udata || !vdata) {
        console.log(
          "Invalid data param ： " +
            header +
            " " +
            ydata +
            " " +
            udata +
            " " +
            vdata
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
      console.error("invalid image header " + header.byteLength);
      return;
    }
    if (yplanedata.byteLength === 20) {
      console.error("invalid image yplane " + yplane.byteLength);
      return;
    }
    if (uplanedata.byteLength === 20) {
      console.error("invalid image uplanedata " + uplanedata.byteLength);
      return;
    }
    if (
      yplanedata.byteLength != uplanedata.byteLength * 4 ||
      uplanedata.byteLength != vplanedata.byteLength
    ) {
      console.error(
        "invalid image header " +
          yplanedata.byteLength +
          " " +
          uplanedata.byteLength +
          " " +
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

  /**
   *
   * @description initialize agora real-time-communicating engine with appid
   * @param {String} appid
   */
  initialize(appid) {
    return this.rtcengine.initialize(appid);
  }

  /**
   *
   * @description return current version and build of sdk
   */
  getVersion() {
    return this.rtcengine.getVersion();
  }

  /**
   *
   * @description Get error description of the given errorCode
   * @param {Number} errorCode
   */
  getErrorDescription(errorCode) {
    return this.rtcengine.getErrorDescription();
  }

  /**
   *
   * @description Join channel with token, channel, channel_info and uid
   * @requires channel
   * @param {String} token token
   * @param {String} channel channel
   * @param {String} chan_info channel info
   * @param {Number} uid uid
   * @returns {int} 0 for success, <0 for failure
   */
  joinChannel(token, channel, chan_info, uid) {
    return this.rtcengine.joinChannel(token, channel, chan_info, uid);
  }

  /**
   * @description Leave channel
   * @returns {int} 0 for success, <0 for failure
   */
  leaveChannel() {
    return this.rtcengine.leaveChannel();
  }

  subscribe(uid, view) {
    this.streams[uid] = this.initRender(view);
    return this.rtcengine.subscribe(uid);
  }

  setupLocalVideo(view) {
    this.streams.local = this.initRender(view);
    return this.rtcengine.setupLocalVideo();
  }

  setupLocalDevTest(view) {
    this.streams.devtest = this.initRender(view);
  }

  setVideoRenderDimension(rendertype, uid, width, height) {
    this.rtcengine.setVideoRenderDimension(rendertype, uid, width, height);
  }

  setVideoRenderHighFPS(fps) {
    this.rtcengine.setHighFPS(fps);
  }

  setVideoRenderFPS(fps) {
    this.rtcengine.setFPS(fps);
  }

  addVideoRenderToHighFPS(uid) {
    this.rtcengine.addToHighVideo(uid);
  }

  remoteVideoRenderFromHighFPS(uid) {
    this.rtcengine.removeFromHighVideo(uid);
  }

  setupLocalVideoSource(view) {
    this.streams.videosource = this.initRender(view);
  }

  setupViewContentMode(uid, mode) {
    let render = this.streams[uid];
    if (!render) {
      return false;
    }

    render.contentMode = mode;
    return true;
  }

  renewToken(newtoken) {
    return this.rtcengine.renewToken(newtoken);
  }

  /**
   * @description Set channel profile(before join channel) since sdk will do optimization according to scenario.
   * @description 0 (default) for communication, 1 for live broadcasting, 2 for in-game
   * @param {Number} profile profile
   * @returns {int} 0 for success, <0 for failure
   */
  setChannelProfile(profile) {
    return this.rtcengine.setChannelProfile(profile);
  }

  /**
   *
   * @description In live broadcasting mode, set client role, 1 for anchor, 2 for audience
   * @param {Number} role client role
   * @param {*} permissionKey permission key
   * @returns {int} 0 for success, <0 for failure
   */
  setClientRole(role, permissionKey) {
    return this.rtcengine.setClientRole(role, permissionKey);
  }

  startEchoTest() {
    return this.rtcengine.startEchoTest();
  }

  stopEchoTest() {
    return this.rtcengine.stopEchoTest();
  }

  enableLastmileTest() {
    return this.rtcengine.enableLastmileTest();
  }

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
   * @param {number} profile - enumeration values represent video profile
   * @param {boolean} [swapWidthAndHeight = false] - Whether to swap width and height
   * @returns {int} 0 for success, <0 for failure
   */
  setVideoProfile(profile, swapWidthAndHeight = false) {
    return this.rtcengine.setVideoProfile(profile, swapWidthAndHeight);
  }

  enableAudio() {
    return this.rtcengine.enableAudio();
  }

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

  getCallId() {
    return this.rtcengine.getCallId();
  }

  rate(callid, rating, desc) {
    return this.rtcengine.rate(callid, rating, desc);
  }

  complain(callid, desc) {
    return this.rtcengine.complain(callid, desc);
  }

  setEncryptionSecret(secret) {
    return this.rtcengine.setEncryptionSecret(secret);
  }

  createDataStream(reliable, ordered) {
    return this.rtcengine.createDataStream(reliable, ordered);
  }

  sendStreamMessage(streamId, msg) {
    return this.rtcengine.sendStreamMessage(streamId, msg);
  }

  muteLocalAudioStream(mute) {
    return this.rtcengine.muteLocalAudioStream(mute);
  }

  muteAllRemoteAudioStreams(mute) {
    return this.rtcengine.muteAllRemoteAudioStreams(mute);
  }

  setDefaultMuteAllRemoteAudioStreams(mute) {
    return this.rtcengine.setDefaultMuteAllRemoteAudioStreams(mute);
  }

  muteRemoteAudioStream(uid, mute) {
    return this.rtcengine.muteRemoteAudioStream(uid, mute);
  }

  muteLocalVideoStream(mute) {
    return this.rtcengine.muteLocalVideoStream(mute);
  }

  enableLocalVideo(enable) {
    return this.rtcengine.enableLocalVideo(enable);
  }

  muteAllRemoteVideoStreams(mute) {
    return this.rtcengine.muteAllRemoteVideoStreams(mute);
  }

  setDefaultMuteAllRemoteVideoStreams(mute) {
    return this.rtcengine.setDefaultMuteAllRemoteVideoStreams(mute);
  }

  enableAudioVolumeIndication(interval, smooth) {
    return this.rtcengine.enableAudioVolumeIndication(interval, smooth);
  }

  muteRemoteVideoStream(uid, mute) {
    return this.rtcengine.muteRemoteVideoStream(uid, mute);
  }

  setRemoteVideoStreamType(uid, streamType) {
    return this.rtcengine.setRemoteVideoStreamType(uid, streamType);
  }

  setRemoteDefaultVideoStreamType(streamType) {
    return this.rtcengine.setRemoteDefaultVideoStreamType(streamType);
  }

  startAudioRecording(filePath) {
    return this.rtcengine.startAudioRecording(filePath);
  }

  stopAudioRecording() {
    return this.rtcengine.stopAudioRecording();
  }

  startAudioMixing(filepath, loopback, replace, cycle) {
    return this.rtcengine.startAudioMixing(filepath, loopback, replace, cycle);
  }

  stopAudioMixing() {
    return this.rtcengine.stopAudioMixing();
  }

  pauseAudioMixing() {
    return this.rtcengine.pauseAudioMixing();
  }

  resumeAudioMixing() {
    return this.rtcengine.resumeAudioMixing();
  }

  adjustAudioMixingVolume(volume) {
    return this.rtcengine.adjustAudioMixingVolume(volume);
  }

  getAudioMixingDuration() {
    return this.rtcengine.getAudioMixingDuration();
  }

  getAudioMixingCurrentPosition() {
    return this.rtcengine.getAudioMixingCurrentPosition();
  }

  getAudioMixingCurrentPosistion() {
    return this.rtcengine.getAudioMixingCurrentPosistion();
  }

  setAudioMixingPosition(position) {
    return this.rtcengine.setAudioMixingPosition(position);
  }

  setLocalVoicePitch(pitch) {
    return this.rtcengine.setLocalVoicePitch(pitch);
  }

  setInEarMonitoringVolume(volume) {
    return this.rtcengine.setInEarMonitoringVolume(volume);
  }

  pauseAudio() {
    return this.rtcengine.pauseAudio();
  }

  resumeAudio() {
    return this.rtcengine.resumeAudio();
  }

  stopScreenCapture() {
    return this.rtcengine.stopScreenCapture();
  }

  clearVideoCompositingLayout() {
    return this.rtcengine.clearVideoCompositingLayout();
  }

  setLogFile(filepath) {
    return this.rtcengine.setLogFile(filepath);
  }

  setLogFilter(filter) {
    return this.rtcengine.setLogFilter(filter);
  }

  startRecordingService(recordingKey) {
    return this.rtcengine.startRecordingService(recordingKey);
  }

  stopRecordingService(recordingKey) {
    return this.rtcengine.stopRecordingService(recordingKey);
  }

  refreshRecrodingServiceStatus() {
    return this.rtcengine.refreshRecrodingServiceStatus();
  }

  enableDualStreamMode(enable) {
    return this.rtcengine.enableDualStreamMode(enable);
  }

  setRecordingAudioFrameParameters(sampleRate, channel, mode, samplesPerCall) {
    return this.rtcengine.setRecordingAudioFrameParameters(
      sampleRate,
      channel,
      mode,
      samplesPerCall
    );
  }

  setPlaybackAudioFrameParameters(sampleRate, channel, mode, sampelsPerCall) {
    return this.rtcengine.setPlaybackAudioFrameParameters(
      sampleRate,
      channel,
      mode,
      samplesPerCall
    );
  }

  setMixedAudioFrameParameters(sampleRate, samplesPerCall) {
    return this.rtcengine.setMixedAudioFrameParameters(
      sampleRate,
      samplesPerCall
    );
  }

  adjustRecordingSignalVolume(volume) {
    return this.rtcengine.adjustRecordingSignalVolume(volume);
  }

  adjustPlaybackSignalVolume(volume) {
    return this.rtcengine.adjustPlaybackSignalVolume(volume);
  }

  enableWebSdkInteroperability(enable) {
    return this.rtcengine.enableWebSdkInteroperability(enable);
  }

  setHighQualityAudioParameters(fullband, stereo, fullBitrate) {
    return this.rtcengine.setHighQualityAudioParameters(
      fullband,
      stereo,
      fullBitrate
    );
  }

  setVideoQualityParameters(preferFrameRateOverImageQuality) {
    return this.rtcengine.setVideoQualityParameters(
      preferFrameRateOverImageQuality
    );
  }

  /**
   *
   * @param {*} windowId
   * @param {*} captureFreq
   * @param {*} rect
   *            right > left, top > bottom
   * @param {*} bitrate
   */
  startScreenCapture(windowId, captureFreq, rect, bitrate) {
    return this.rtcengine.startScreenCapture(
      windowId,
      captureFreq,
      rect,
      bitrate
    );
  }

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

  addPublishStreamUrl(url, transcodingEnabled) {
    return this.rtcengine.addPublishStreamUrl(url, transcodingEnabled);
  }

  removePublishStreamUrl(url) {
    return this.rtcengine.removePublishStreamUrl(url);
  }

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

  removeInjectStreamUrl(url) {
    return this.rtcengine.removeInjectStreamUrl(url);
  }

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

  setLocalVoiceEqualization(freq, bandgain) {
    return this.rtcengine.setLocalVoiceEqualization(freq, bandgain);
  }

  setLocalVoiceReverb(key, value) {
    return this.rtcengine.setLocalVoiceReverb(key, value);
  }

  setExternalAudioSource(enabled, samplerate, channels) {
    return this.rtcengine.setExternalAudioSource(enabled, samplerate, channels);
  }

  setLocalVideoMirrorMode(mirrortype) {
    return this.rtcengine.setLocalVideoMirrorMode(mirrortype);
  }

  // SendPublishingRequest(uid) {
  //     return this.rtcengine.sendPublishingRequest(uid);
  // }

  // answerPublishingRequest(uid, accepted) {
  //     return this.rtcengine.answerPublishingRequest(uid, accepted);
  // }

  // sendUnpublishingRequest(uid) {
  //     return this.rtcengine.sendUnpublishingRequest(uid);
  // }

  enableLoopbackRecording(enabled) {
    return this.rtcengine.enableLoopbackRecording(enabled);
  }

  setProfile(profile, merge) {
    return this.rtcengine.setProfile(profile, merge);
  }

  videoSourceInitialize(appid) {
    return this.rtcengine.videoSourceInitialize(appid);
  }

  /**
   * @description Set it to true to enable web interoperability
   * @param {Boolean} enabled enalbe/disable web interoperability
   * @returns {int} 0 for success, <0 for failure
   */
  videoSourceEnableWebSdkInteroperability(enabled) {
    return this.rtcengine.videoSourceEnableWebSdkInteroperability(enabled);
  }

  videoSourceJoin(token, cname, chanInfo, uid) {
    return this.rtcengine.videoSourceJoin(token, cname, chanInfo, uid);
  }

  videoSourceLeave() {
    return this.rtcengine.videoSourceLeave();
  }

  videoSourceRenewToken(token) {
    return this.rtcengine.videoSourceRenewToken(token);
  }

  videoSourceSetChannelProfile(profile) {
    return this.rtcengine.videoSourceSetChannelProfile(profile);
  }

  videoSourceSetVideoProfile(profile, swapWidthAndHeight) {
    return this.rtcengine.videoSourceSetVideoProfile(
      profile,
      swapWidthAndHeight
    );
  }

  startScreenCapture2(wndid, captureFreq, rect, bitrate) {
    return this.rtcengine.startScreenCapture2(
      wndid,
      captureFreq,
      rect,
      bitrate
    );
  }

  stopScreenCapture2() {
    return this.rtcengine.stopScreenCatpure2();
  }

  videoSourceRelease() {
    return this.rtcengine.videoSourceRelease();
  }

  updateScreenCaptureRegion(rect) {
    return this.rtcengine.updateScreenCaptureRegion(rect);
  }

  startScreenCapturePreview() {
    return this.rtcengine.videoSourceStartPreview();
  }

  stopScreenCapturePreview() {
    return this.rtcengine.videoSourceStopPreview();
  }

  videoSourceSetParameters(parameter) {
    return this.rtcengine.videoSourceSetParameter(parameter);
  }

  getVideoDevices() {
    return this.rtcengine.getVideoDevices();
  }

  setVideoDevice(deviceid) {
    return this.rtcengine.setVideoDevice(deviceid);
  }

  getCurrentVideoDevice() {
    return this.rtcengine.getCurrentVideoDevice();
  }

  startVideoDeviceTest() {
    return this.rtcengine.startVideoDeviceTest();
  }

  stopVideoDeviceTest() {
    return this.rtcengine.stopVideoDeviceTest();
  }

  getAudioPlaybackDevices() {
    return this.rtcengine.getAudioPlaybackDevices();
  }

  setAudioPlaybackDevice(deviceid) {
    return this.rtcengine.setAudioPlaybackDevice(deviceid);
  }

  getCurrentAudioPlaybackDevice() {
    return this.rtcengine.getCurrentAudioPlaybackDevice();
  }

  setAudioPlaybackVolume(volume) {
    return this.rtcengine.setAudioPlaybackVolume(volume);
  }

  getAudioPlaybackVolume() {
    return this.rtcengine.getAudioPlaybackVolume();
  }

  getAudioRecordingDevices() {
    return this.rtcengine.getAudioRecordingDevices();
  }

  setAudioRecordingDevice(deviceid) {
    return this.rtcengine.setAudioRecordingDevice(deviceid);
  }

  getCurrentAudioRecordingDevice() {
    return this.rtcengine.getCurrentAudioRecordingDevice();
  }

  getAudioRecordingVolume() {
    return this.rtcengine.getAudioRecordingVolume();
  }

  setAudioRecordingVolume(volume) {
    return this.rtcengine.setAudioRecordingVolume(volume);
  }

  startAudioPlaybackDeviceTest(filepath) {
    return this.rtcengine.startAudioPlaybackDeviceTest(filepath);
  }

  stopAudioPlaybackDeviceTest() {
    return this.rtcengine.stopAudioPlaybackDeviceTest();
  }

  startAudioRecordingDeviceTest(indicateInterval) {
    return this.rtcengine.startAudioRecordingDeviceTest(indicateInterval);
  }

  stopAudioRecordingDeviceTest() {
    return this.rtcengine.stopAudioRecordingDeviceTest();
  }

  getAudioPlaybackDeviceMute() {
    return this.rtcengine.getAudioPlaybackDeviceMute();
  }

  setAudioPlaybackDeviceMute(mute) {
    return this.rtcengine.setAudioPlaybackDeviceMute(mute);
  }

  getAudioRecordingDeviceMute() {
    return this.rtcengine.getAudioRecordingDeviceMute();
  }

  setAudioRecordingDeviceMute(mute) {
    return this.rtcengine.setAudioRecordingDeviceMute(mute);
  }

  /*------------------------------------------------
    |   v2.2.0 apis
    \*----------------------------------------------*/
  getEffectsVolume() {
    return this.rtcengine.getEffectsVolume();
  }

  /**
   * @param {int} volume - [0.0, 100.0]
   * @returns {int} 0 for success, <0 for failure
   */
  setEffectsVolume(volume) {
    return this.rtcengine.setEffectsVolume(volume);
  }

  /**
   * @param {int} soundId soundId
   * @param {int} volume - [0.0, 100.0]
   * @returns {int} 0 for success, <0 for failure
   */
  setVolumeOfEffect(soundId, volume) {
    return this.setVolumeOfEffect(soundId, volume);
  }

  /**
   *
   * @param {int} soundId soundId
   * @param {String} filePath filepath
   * @param {int} loopcount - 0: once, 1: twice, -1: infinite
   * @param {double} pitch - [0.5, 2]
   * @param {double} pan - [-1, 1]
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
   *
   * @param {int} soundId soundId
   * @returns {int} 0 for success, <0 for failure
   */
  stopEffect(soundId) {
    return this.rtcengine.stopEffect(soundId);
  }

  /**
   *
   * @param {int} soundId soundId
   * @param {String} filePath filepath
   * @returns {int} 0 for success, <0 for failure
   */
  preloadEffect(soundId, filePath) {
    return this.rtcengine.preloadEffect(soundId, filePath);
  }

  /**
   *
   * @param {int} soundId soundId
   * @returns {int} 0 for success, <0 for failure
   */
  unloadEffect(soundId) {
    return this.rtcengine.unloadEffect(soundId);
  }

  pauseEffect(soundId) {
    return this.rtcengine.pauseEffect(soundId);
  }

  pauseAllEffects() {
    return this.rtcengine.pauseAllEffects();
  }

  resumeEffect(soundId) {
    return this.rtcengine.resumeEffect(soundId);
  }

  resumeAllEffects() {
    return this.rtcengine.resumeAllEffects();
  }
}

module.exports = AgoraRtcEngine;
