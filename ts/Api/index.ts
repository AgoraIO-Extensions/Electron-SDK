import { SoftwareRenderer, GlRenderer, IRenderer, CustomRenderer } from '../Renderer';
import {
  NodeRtcEngine,
  RtcStats,
  LocalVideoStats,
  RemoteVideoStats,
  RemoteAudioStats,
  RemoteVideoTransportStats,
  RemoteAudioTransportStats,
  RemoteVideoState,
  AgoraNetworkQuality,
  LastmileProbeResult,
  ClientRoleType,
  StreamType,
  ConnectionState,
  ConnectionChangeReason,
  MediaDeviceType,
  VIDEO_PROFILE_TYPE,
  TranscodingConfig,
  InjectStreamConfig,
  VoiceChangerPreset,
  AudioReverbPreset,
  LastmileProbeConfig,
  Priority,
  CameraCapturerConfiguration,
  ScreenSymbol,
  CaptureRect,
  CaptureParam,
  VideoContentHint,
  VideoEncoderConfiguration,
  UserInfo
} from './native_type';
import { EventEmitter } from 'events';
import { deprecate } from '../Utils';

const agora = require('../../build/Release/agora_node_ext');


/**
 * The AgoraRtcEngine class.
 */
class AgoraRtcEngine extends EventEmitter {
  rtcEngine: NodeRtcEngine;
  streams: Map<string, IRenderer>;
  renderMode: 1 | 2 | 3;
  customRenderer: any;
  constructor() {
    super();
    this.rtcEngine = new agora.NodeRtcEngine();
    this.initEventHandler();
    this.streams = new Map();
    this.renderMode = this._checkWebGL() ? 1 : 2;
    this.customRenderer = CustomRenderer;
  }

  /**
   * Decide whether to use webgl/software/custom rendering.
   * @param {1|2|3} mode:
   * - 1 for old webgl rendering
   * - 2 for software rendering
   * - 3 for custom rendering
   */
  setRenderMode (mode: 1|2|3 = 1): void {
    this.renderMode = mode;
  }

  /**
   * Use this method to set custom Renderer when set renderMode in the {@link setRenderMode} method to 3.
   * CustomRender should be a class.
   * @param {IRenderer} customRenderer Customizes the video renderer.
   */
  setCustomRenderer(customRenderer: IRenderer) {
    this.customRenderer = customRenderer;
  }

  /**
   * @private
   * @ignore
   * check if WebGL will be available with appropriate features
   * @returns {boolean}
   */
  _checkWebGL(): boolean {
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
   * @ignore
   */
  initEventHandler(): void {
    const self = this;

    const fire = (event: string, ...args: Array<any>) => {
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
      fire('joinedChannel', channel, uid, elapsed);
    });

    this.rtcEngine.onEvent('rejoinchannel', function(channel: string, uid: number, elapsed: number) {
      fire('rejoinedchannel', channel, uid, elapsed);
      fire('rejoinedChannel', channel, uid, elapsed);
    });

    this.rtcEngine.onEvent('warning', function(warn: number, msg: string) {
      fire('warning', warn, msg);
    });

    this.rtcEngine.onEvent('error', function(err: number, msg: string) {
      fire('error', err, msg);
    });

    // this.rtcEngine.onEvent('audioquality', function(uid: number, quality: AgoraNetworkQuality, delay: number, lost: number) {
    //   fire('audioquality', uid, quality, delay, lost);
    //   fire('audioQuality', uid, quality, delay, lost);
    // });

    this.rtcEngine.onEvent('audiovolumeindication', function(
      speakers: {
        uid: number,
        volume: number
      }[],
      speakerNumber: number,
      totalVolume: number
    ) {
      if (speakers[0]) {
        fire(
          'audiovolumeindication',
          speakers[0]['uid'],
          speakers[0]['volume'],
          speakerNumber,
          totalVolume
        );
        fire(
          'audioVolumeIndication',
          speakers[0]['uid'],
          speakers[0]['volume'],
          speakerNumber,
          totalVolume
        );
      }
      fire('groupAudioVolumeIndication', speakers, speakerNumber, totalVolume);
    });

    this.rtcEngine.onEvent('leavechannel', function() {
      fire('leavechannel');
      fire('leaveChannel');
    });

    this.rtcEngine.onEvent('rtcstats', function(stats: RtcStats) {
      fire('rtcstats', stats);
      fire('rtcStats', stats);
    });

    this.rtcEngine.onEvent('localvideostats', function(stats: LocalVideoStats) {
      fire('localvideostats', stats);
      fire('localVideoStats', stats);
    });

    this.rtcEngine.onEvent('remotevideostats', function(stats: RemoteVideoStats) {
      fire('remotevideostats', stats);
      fire('remoteVideoStats', stats);
    });

    this.rtcEngine.onEvent('remoteAudioStats', function(stats: RemoteAudioStats) {
      fire('remoteAudioStats', stats);
    });

    this.rtcEngine.onEvent('remoteAudioTransportStats', function(uid: number, delay: number, lost: number, rxKBitRate: number) {
      fire('remoteAudioTransportStats', {
        uid, delay, lost, rxKBitRate
      });
    });

    this.rtcEngine.onEvent('remoteVideoTransportStats', function(uid: number, delay: number, lost: number, rxKBitRate: number) {
      fire('remoteVideoTransportStats', {
        uid, delay, lost, rxKBitRate
      });
    });

    this.rtcEngine.onEvent('audiodevicestatechanged', function(
      deviceId: string,
      deviceType: number,
      deviceState: number,
    ) {
      fire('audiodevicestatechanged', deviceId, deviceType, deviceState);
      fire('audioDeviceStateChanged', deviceId, deviceType, deviceState);
    });

    // this.rtcEngine.onEvent('audiomixingfinished', function() {
    //   fire('audiomixingfinished');
    //   fire('audioMixingFinished');
    // });

    this.rtcEngine.onEvent('audioMixingStateChanged', function(state: number, err: number) {
      fire('audioMixingStateChanged', state, err);
    });

    this.rtcEngine.onEvent('apicallexecuted', function(api: string, err: number) {
      fire('apicallexecuted', api, err);
      fire('apiCallExecuted', api, err);
    });

    this.rtcEngine.onEvent('remoteaudiomixingbegin', function() {
      fire('remoteaudiomixingbegin');
      fire('remoteAudioMixingBegin');
    });

    this.rtcEngine.onEvent('remoteaudiomixingend', function() {
      fire('remoteaudiomixingend');
      fire('remoteAudioMixingEnd');
    });

    this.rtcEngine.onEvent('audioeffectfinished', function(soundId: number) {
      fire('audioeffectfinished', soundId);
      fire('audioEffectFinished', soundId);
    });

    this.rtcEngine.onEvent('videodevicestatechanged', function(
      deviceId: string,
      deviceType: number,
      deviceState: number,
    ) {
      fire('videodevicestatechanged', deviceId, deviceType, deviceState);
      fire('videoDeviceStateChanged', deviceId, deviceType, deviceState);
    });

    this.rtcEngine.onEvent('networkquality', function(
      uid: number,
      txquality: AgoraNetworkQuality,
      rxquality: AgoraNetworkQuality
    ) {
      fire('networkquality', uid, txquality, rxquality);
      fire('networkQuality', uid, txquality, rxquality);
    });

    this.rtcEngine.onEvent('lastmilequality', function(quality: AgoraNetworkQuality) {
      fire('lastmilequality', quality);
      fire('lastMileQuality', quality);
    });

    this.rtcEngine.onEvent('lastmileProbeResult', function(result: LastmileProbeResult) {
      fire('lastmileProbeResult', result);
    });

    this.rtcEngine.onEvent('firstlocalvideoframe', function(
      width: number, height: number, elapsed: number
    ) {
      fire('firstlocalvideoframe', width, height, elapsed);
      fire('firstLocalVideoFrame', width, height, elapsed);
    });

    this.rtcEngine.onEvent('firstremotevideodecoded', function(
      uid: number,
      width: number,
      height: number,
      elapsed: number
    ) {
      fire('addstream', uid, elapsed);
      fire('addStream', uid, elapsed);
    });

    this.rtcEngine.onEvent('videosizechanged', function(
      uid: number, width: number, height: number, rotation: number
    ) {
      fire('videosizechanged', uid, width, height, rotation);
      fire('videoSizeChanged', uid, width, height, rotation);
    });

    this.rtcEngine.onEvent('firstremotevideoframe', function(
      uid: number,
      width: number,
      height: number,
      elapsed: number
    ) {
      fire('firstremotevideoframe', uid, width, height, elapsed);
      fire('firstRemoteVideoFrame', uid, width, height, elapsed);
    });

    this.rtcEngine.onEvent('userjoined', function(uid: number, elapsed: number) {
      console.log('user : ' + uid + ' joined.');
      fire('userjoined', uid, elapsed);
      fire('userJoined', uid, elapsed);
    });

    this.rtcEngine.onEvent('useroffline', function(uid: number, reason: number) {
      if (!self.streams) {
        self.streams = new Map();
        console.log('Warning!!!!!!, streams is undefined.');
        return;
      }
      self.destroyRender(uid);
      self.rtcEngine.unsubscribe(uid);
      fire('removestream', uid, reason);
      fire('removeStream', uid, reason);
    });

    this.rtcEngine.onEvent('usermuteaudio', function(uid: number, muted: boolean) {
      fire('usermuteaudio', uid, muted);
      fire('userMuteAudio', uid, muted);
    });

    this.rtcEngine.onEvent('usermutevideo', function(uid: number, muted: boolean) {
      fire('usermutevideo', uid, muted);
      fire('userMuteVideo', uid, muted);
    });

    this.rtcEngine.onEvent('userenablevideo', function(uid: number, enabled: boolean) {
      fire('userenablevideo', uid, enabled);
      fire('userEnableVideo', uid, enabled);
    });

    this.rtcEngine.onEvent('userenablelocalvideo', function(uid: number, enabled: boolean) {
      fire('userenablelocalvideo', uid, enabled);
      fire('userEnableLocalVideo', uid, enabled);
    });

    this.rtcEngine.onEvent('cameraready', function() {
      fire('cameraready');
      fire('cameraReady');
    });

    this.rtcEngine.onEvent('videostopped', function() {
      fire('videostopped');
      fire('videoStopped');
    });

    this.rtcEngine.onEvent('connectionlost', function() {
      fire('connectionlost');
      fire('connectionLost');
    });

    // this.rtcEngine.onEvent('connectioninterrupted', function() {
    //   fire('connectioninterrupted');
    //   fire('connectionInterrupted');
    // });

    // this.rtcEngine.onEvent('connectionbanned', function() {
    //   fire('connectionbanned');
    //   fire('connectionBanned');
    // });

    // this.rtcEngine.onEvent('refreshrecordingservicestatus', function(status: any) {
    //   fire('refreshrecordingservicestatus', status);
    //   fire('refreshRecordingServiceStatus', status);
    // });

    this.rtcEngine.onEvent('streammessage', function(
      uid: number,
      streamId: number,
      msg: string,
      len: number
    ) {
      fire('streammessage', uid, streamId, msg, len);
      fire('streamMessage', uid, streamId, msg, len);
    });

    this.rtcEngine.onEvent('streammessageerror', function(
      uid: number,
      streamId: number,
      code: number,
      missed: number,
      cached: number
    ) {
      fire('streammessageerror', uid, streamId, code, missed, cached);
      fire('streamMessageError', uid, streamId, code, missed, cached);
    });

    this.rtcEngine.onEvent('mediaenginestartcallsuccess', function() {
      fire('mediaenginestartcallsuccess');
      fire('mediaEngineStartCallSuccess');
    });

    this.rtcEngine.onEvent('requestchannelkey', function() {
      fire('requestchannelkey');
      fire('requestChannelKey');
    });

    this.rtcEngine.onEvent('fristlocalaudioframe', function(elapsed: number) {
      fire('firstlocalaudioframe', elapsed);
      fire('firstLocalAudioFrame', elapsed);
    });

    this.rtcEngine.onEvent('firstremoteaudioframe', function(uid: number, elapsed: number) {
      fire('firstremoteaudioframe', uid, elapsed);
      fire('firstRemoteAudioFrame', uid, elapsed);
    });

    this.rtcEngine.onEvent('remoteVideoStateChanged', function(uid: number, state: RemoteVideoState) {
      fire('remoteVideoStateChanged', uid, state);
    });

    this.rtcEngine.onEvent('cameraFocusAreaChanged', function(
      x: number, y: number, width: number, height: number
    ) {
      fire('cameraFocusAreaChanged', x, y, width, height);
    });

    this.rtcEngine.onEvent('cameraExposureAreaChanged', function(
      x: number, y: number, width: number, height: number
    ) {
      fire('cameraExposureAreaChanged', x, y, width, height);
    });

    this.rtcEngine.onEvent('tokenPrivilegeWillExpire', function(token: string) {
      fire('tokenPrivilegeWillExpire', token);
    });

    this.rtcEngine.onEvent('streamPublished', function(url: string, error: number) {
      fire('streamPublished', url, error);
    });

    this.rtcEngine.onEvent('streamUnpublished', function(url: string) {
      fire('streamUnpublished', url);
    });

    this.rtcEngine.onEvent('transcodingUpdated', function() {
      fire('transcodingUpdated');
    });

    this.rtcEngine.onEvent('streamInjectStatus', function(
      url: string, uid: number, status: number
    ) {
      fire('streamInjectStatus', url, uid, status);
    });

    this.rtcEngine.onEvent('localPublishFallbackToAudioOnly', function(
      isFallbackOrRecover: boolean
    ) {
      fire('localPublishFallbackToAudioOnly', isFallbackOrRecover);
    });

    this.rtcEngine.onEvent('remoteSubscribeFallbackToAudioOnly', function(
      uid: number,
      isFallbackOrRecover: boolean
    ) {
      fire('remoteSubscribeFallbackToAudioOnly', uid, isFallbackOrRecover);
    });

    this.rtcEngine.onEvent('microphoneEnabled', function(enabled: boolean) {
      fire('microphoneEnabled', enabled);
    });

    this.rtcEngine.onEvent('connectionStateChanged', function(
      state: ConnectionState,
      reason: ConnectionChangeReason
    ) {
      fire('connectionStateChanged', state, reason);
    });

    this.rtcEngine.onEvent('activespeaker', function(uid: number) {
      fire('activespeaker', uid);
      fire('activeSpeaker', uid);
    });

    this.rtcEngine.onEvent('clientrolechanged', function(oldRole: ClientRoleType, newRole: ClientRoleType) {
      fire('clientrolechanged', oldRole, newRole);
      fire('clientRoleChanged', oldRole, newRole);
    });

    this.rtcEngine.onEvent('audiodevicevolumechanged', function(
      deviceType: MediaDeviceType,
      volume: number,
      muted: boolean
    ) {
      fire('audiodevicevolumechanged', deviceType, volume, muted);
      fire('audioDeviceVolumeChanged', deviceType, volume, muted);
    });

    this.rtcEngine.onEvent('videosourcejoinsuccess', function(uid: number) {
      fire('videosourcejoinedsuccess', uid);
      fire('videoSourceJoinedSuccess', uid);
    });

    this.rtcEngine.onEvent('videosourcerequestnewtoken', function() {
      fire('videosourcerequestnewtoken');
      fire('videoSourceRequestNewToken');
    });

    this.rtcEngine.onEvent('videosourceleavechannel', function() {
      fire('videosourceleavechannel');
      fire('videoSourceLeaveChannel');
    });
 
    this.rtcEngine.onEvent('localUserRegistered', function(uid:number, userAccount:string) {
      fire('localUserRegistered', uid, userAccount);
    });

    this.rtcEngine.onEvent('userInfoUpdated', function(uid:number, userInfo: UserInfo) {
      fire('userInfoUpdated', uid, userInfo);
    });

    this.rtcEngine.registerDeliverFrame(function(infos: any) {
      self.onRegisterDeliverFrame(infos);
    });
  }

  /**
   * @private
   * @ignore
   * @param {number} type 0-local 1-remote 2-device_test 3-video_source
   * @param {number} uid uid get from native engine, differ from electron engine's uid
   */
  _getRenderer(type: number, uid: number): IRenderer | undefined {
    if (type < 2) {
      if (uid === 0) {
        return this.streams.get('local');
      } else {
        return this.streams.get(String(uid));
      }
    } else if (type === 2) {
      // return this.streams.devtest;
      console.warn('Type 2 not support in production mode.');
      return;
    } else if (type === 3) {
      return this.streams.get('videosource');
    } else {
      console.warn('Invalid type for getRenderer, only accept 0~3.');
      return;
    }
  }

  /**
   * check if data is valid
   * @private
   * @ignore
   * @param {*} header
   * @param {*} ydata
   * @param {*} udata
   * @param {*} vdata
   */
  _checkData(
    header: ArrayBuffer,
    ydata: ArrayBuffer,
    udata: ArrayBuffer,
    vdata: ArrayBuffer,
  ) {
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
   * @ignore
   * @param {number} infos
   */
  onRegisterDeliverFrame(infos: any) {
    const len = infos.length;
    for (let i = 0; i < len; i++) {
      const info = infos[i];
      const {
        type, uid, header, ydata, udata, vdata
      } = info;
      if (!header || !ydata || !udata || !vdata) {
        console.log(
          'Invalid data param ： ' + header + ' ' + ydata + ' ' + udata + ' ' + vdata
        );
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
   * Size of the view has changed. Refresh zoom level so that video is sized.
   * Appropriately while waiting for the next video frame to arrive.
   * Calling this can prevent a view discontinutity.
   * @param {string|number} key Key for the map that store the renderers, e.g, `uid` or `videosource` or `local`.
   */
  resizeRender(key: 'local' | 'videosource' | number) {
    if (this.streams.has(String(key))) {
        const renderer = this.streams.get(String(key));
        if (renderer) {
          renderer.refreshCanvas();
      }
    }
  }

  /**
   * Initializes the renderer.
   * @param {string|number} key Key for the map that store the renderers, e.g, uid or `videosource` or `local`.
   * @param {Element} view Dom elements to render video.
   */
  initRender(key: 'local' | 'videosource' | number, view: Element) {
    if (this.streams.has(String(key))) {
      this.destroyRender(key);
    }
    let renderer: IRenderer;
    if (this.renderMode === 1) {
      renderer = new GlRenderer();
    } else if (this.renderMode === 2) {
      renderer = new SoftwareRenderer();
    } else if (this.renderMode === 3) {
      renderer = new this.customRenderer();
    } else {
      console.warn('Unknown render mode, fallback to 1');
      renderer = new GlRenderer();
    }
    renderer.bind(view);
    this.streams.set(String(key), renderer);
  }

  /**
   * Destroys the renderer.
   * @param {string|number} key key for the map that store the renders, e.g, `uid` or `videosource` or `local`.
   * @param {function} onFailure The error callback for the `destroyRenderer` method.
   */
  destroyRender(key: 'local' | 'videosource' | number, onFailure?: (err: Error) => void) {
    if (!this.streams.has(String(key))) {
      return;
    }
    const renderer = this.streams.get(String(key));
    try {
      (renderer as IRenderer).unbind();
      this.streams.delete(String(key));
    } catch (err) {
      onFailure && onFailure(err);
    }
  }

  // ===========================================================================
  // BASIC METHODS
  // ===========================================================================

  /**
   * @description Initializes agora real-time-communicating engine with your App ID.
   * @param {string} appid App ID issued to you by Agora.
   * @returns {number} 
   * - 0: Success.
   * - < 0: Failure.
   */
  initialize(appid: string): number {
    return this.rtcEngine.initialize(appid);
  }

  /**
   * @description Returns the version and the build information of the current SDK.
   * @returns {string} The version of the current SDK.
   */
  getVersion(): string {
    return this.rtcEngine.getVersion();
  }

  /**
   * @description Retrieves the error description.
   * @param {number} errorCode The error code.
   * @returns {string} The error description.
   */
  getErrorDescription(errorCode: number): string {
    return this.rtcEngine.getErrorDescription(errorCode);
  }

  /**
   * @description Gets the connection state of the SDK.
   * @returns {ConnectionState} Connect states. See {@link AgoraRtcEngine.ConnectionState ConnectionState}
   */
  getConnectionState(): ConnectionState {
    return this.rtcEngine.getConnectionState();
  }

  /**
   * @description Allows a user to join a channel.
   * 
   * Users in the same channel can talk to each other, and multiple users in the same channel can start a group chat. 
   * Users with different App IDs cannot call each other.You must call the {@link leaveChannel} method to exit the current call 
   * before entering another channel.
   * 
   * This method call triggers the following callbacks:
   *
   * - The local client: joinedChannel
   * - The remote client: userJoined, if the user joining the channel is in the Communication profile, 
   * or is a BROADCASTER in the Live Broadcast profile.
   *
   * When the connection between the client and Agora's server is interrupted due to poor network conditions, 
   * the SDK tries reconnecting to the server. When the local client successfully rejoins the channel, the SDK 
   * triggers the rejoinedChannel callback on the local client.
   * 
   * @param {string} token token The token generated at your server:
   * - For low-security requirements: You can use the temporary token generated at Dashboard. For details, see [Get a temporary token](https://docs.agora.io/en/Voice/token?platform=All%20Platforms#get-a-temporary-token)
   * - For high-security requirements: Set it as the token generated at your server. For details, see [Get a token](https://docs.agora.io/en/Voice/token?platform=All%20Platforms#get-a-token)
   * @param {string} channel (Required) Pointer to the unique channel name for the Agora RTC session in the string format smaller than 64 bytes. Supported characters:
   * - The 26 lowercase English letters: a to z
   * - The 26 uppercase English letters: A to Z
   * - The 10 numbers: 0 to 9
   * - The space
   * - "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ","
   * @param {string} info (Optional) Pointer to additional information about the channel. This parameter can be set to NULL or contain channel related information. 
   * Other users in the channel will not receive this message.
   * @param {number} uid User ID. A 32-bit unsigned integer with a value ranging from 1 to 2<sup>32</sup>-1. The `uid` must be unique. If a `uid` is not assigned (or set to 0), 
   * the SDK assigns a `uid`.
   * @returns {number} 
   * - 0: Success.
   * - < 0: Failure.
   */
  joinChannel(token: string, channel: string, info: string, uid: number): number {
    return this.rtcEngine.joinChannel(token, channel, info, uid);
  }

  /**
   * @description Allows a user to leave a channel.
   * 
   * Allows a user to leave a channel, such as hanging up or exiting a call. The user must call the method to end the call before 
   * joining another channel after call the {@link joinChannel} method.
   * This method returns 0 if the user leaves the channel and releases all resources related to the call. 
   * This method call is asynchronous, and the user has not left the channel when the method call returns.
   * 
   * Once the user leaves the channel, the SDK triggers the leavechannel callback.
   * 
   * A successful leavechannel method call triggers the removeStream callback for the remote client when the user leaving the channel 
   * is in the Communication channel, or is a BROADCASTER in the Live Broadcast profile.
   *
   * @returns {number} 
   * - 0: Success.
   * - < 0: Failure.
   */
  leaveChannel(): number {
    return this.rtcEngine.leaveChannel();
  }

  /**
   * @description Releases the AgoraRtcEngine instance.
   * 
   * Once the App calls this method to release the created AgoraRtcEngine instance, no other methods in the SDK
   * can be used and no callbacks can occur. To start it again, initialize {@link initialize} to establish a new 
   * AgoraRtcEngine instance.
   * 
   * **Note**: Call this method in the subthread.
   * @returns {number} 
   * - 0: Success.
   * - < 0: Failure.
   */
  release(): number {
    return this.rtcEngine.release();
  }

  /**
   * @deprecated Agora does not recommend using this method. Use {@link setAudioProfile} instead.
   * @description Sets the high-quality audio preferences.
   * 
   * Call this method and set all parameters before joining a channel.
   * @param {boolean} fullband Sets whether to enable/disable full-band codec (48-kHz sample rate).
   * - true: Enable full-band codec.
   * - false: Disable full-band codec.
   * @param {boolean} stereo Sets whether to enable/disable stereo codec.
   * - true: Enable stereo codec.
   * - false: Disable stereo codec.
   * @param {boolean} fullBitrate Sets whether to enable/disable high-bitrate mode.
   * - true: Enable high-bitrate mode.
   * - false: Disable high-bitrate mode.
   * @returns {number} 
   * - 0: Success.
   * - < 0: Failure.
   */
  setHighQualityAudioParameters(fullband: boolean, stereo: boolean, fullBitrate: boolean): number {
    deprecate('setAudioProfile');
    return this.rtcEngine.setHighQualityAudioParameters(fullband, stereo, fullBitrate);
  }

  /**
   * @description Subscribes the remote user and initializes the corresponding renderer.
   * @param {number} uid The user ID of the remote user.
   * @param {Element} view Dom where to initialize the renderer.
   * @returns {number} 
   * - 0: Success.
   * - < 0: Failure.
   */
  subscribe(uid: number, view: Element): number {
    this.initRender(uid, view);
    return this.rtcEngine.subscribe(uid);
  }

  /**
   * @description Setup the local video and corresponding renderer.
   * @param {Element} view Dom element where we will initialize our view.
   * @returns {number}
   * - 0: Success.
   * - < 0: Failure.
   */
  setupLocalVideo(view: Element): number {
    this.initRender('local', view);
    return this.rtcEngine.setupLocalVideo();
  }

  /**
   *
   * @description Sets the renderer dimension of video.
   * 
   * This method ONLY affects size of data sent to js layer, while native video size is determined by {@link setVideoEncoderConfiguration}.
   * @param {*} rendertype The renderer type:
   * - 0: local
   * - 1: remote
   * - 2: device test
   * - 3: video source
   * @param {*} uid The user ID of the targeted user.
   * @param {*} width target width
   * @param {*} height target height
   */
  setVideoRenderDimension(
    rendertype: number,
    uid: number,
    width: number,
    height: number
  ) {
    this.rtcEngine.setVideoRenderDimension(rendertype, uid, width, height);
  }

  /**
   * @description Sets renderer fps globally. This is mainly used to improve the performance for js rendering
   * once set, data will be forced to be sent with this fps. This can reduce cpu frequency of js rendering.
   * This applies to ALL views except ones added to High FPS stream.
   * @param {number} fps frame(fps).
   */
  setVideoRenderFPS(fps: number) {
    this.rtcEngine.setFPS(fps);
  }

  /**
   * @description Sets renderer fps for high stream. High stream here MEANS uid streams which has been
   * added to high ones by calling {@link addVideoRenderToHighFPS}, note this has nothing to do with dual stream
   * high stream. This is often used when we want to set low fps for most of views, but high fps for one
   * or two special views, e.g. screenshare
   * @param {number} fps frame(fps).
   */
  setVideoRenderHighFPS(fps: number) {
    this.rtcEngine.setHighFPS(fps);
  }

  /**
   * @description Add streams to high fps stream by uid. fps of streams added to high fps stream will be
   * controlled by {@link setVideoRenderHighFPS}.
   * @param {number} uid The User ID.
   */
  addVideoRenderToHighFPS(uid: number) {
    this.rtcEngine.addToHighVideo(uid);
  }

  /**
   * @description Remove streams from high fps stream by uid. fps of streams removed from high fps stream
   * will be controlled by  {@link setVideoRenderFPS}.
   * @param {number} uid The User ID.
   */
  removeVideoRenderFromHighFPS(uid: number) {
    this.rtcEngine.removeFromHighVideo(uid);
  }

  /**
   * @description setup view content mode
   * @param {number | 'local' | 'videosource'} uid stream uid to operate
   * @param {0|1} mode view content mode, 0 - fill, 1 - fit
   * @returns {number} 0 - success, -1 - fail
   */
  setupViewContentMode(uid: number | 'local' | 'videosource', mode: 0|1): number {
    if (this.streams.has(String(uid))) {
      const renderer = this.streams.get(String(uid));
      (renderer as IRenderer).setContentMode(mode);
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
   * @param {string} newtoken new token to update
   * @returns {number} 0 for success, <0 for failure
   */
  renewToken(newtoken: string): number {
    return this.rtcEngine.renewToken(newtoken);
  }

  /**
   * @description Set channel profile(before join channel) since sdk will do optimization according to scenario.
   * @description 0 (default) for communication, 1 for live broadcasting, 2 for in-game
   * @param {number} profile profile enum
   * @returns {number} 0 for success, <0 for failure
   */
  setChannelProfile(profile: number): number {
    return this.rtcEngine.setChannelProfile(profile);
  }

  /**
   *
   * @description In live broadcasting mode, set client role, 1 for anchor, 2 for audience
   * @param {ClientRoleType} role client role
   * @returns {number} 0 for success, <0 for failure
   */
  setClientRole(role: ClientRoleType): number {
    return this.rtcEngine.setClientRole(role);
  }

  /**
   * @deprecated use startEchoTestWithInterval instead
   * @description This method launches an audio call test to determine whether the audio devices
   * (for example, headset and speaker) and the network connection are working properly.
   * In the test, the user first speaks, and the recording is played back in 10 seconds.
   * If the user can hear the recording in 10 seconds, it indicates that the audio devices
   * and network connection work properly.
   * @returns {number} 0 for success, <0 for failure
   */
  startEchoTest(): number {
    deprecate('startEchoTestWithInterval');
    return this.rtcEngine.startEchoTest();
  }

  /**
   * @description This method stops an audio call test.
   * @returns {number} 0 for success, <0 for failure
   */
  stopEchoTest(): number {
    return this.rtcEngine.stopEchoTest();
  }

  /**
   * @description startEchoTest with interval
   * @param interval time interval (seconds)
   */
  startEchoTestWithInterval(interval: number): number {
    return this.rtcEngine.startEchoTestWithInterval(interval);
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
  enableLastmileTest(): number {
    return this.rtcEngine.enableLastmileTest();
  }

  /**
   * @description This method disables the network connection quality test.
   * @returns {number} 0 for success, <0 for failure
   */
  disableLastmileTest(): number {
    return this.rtcEngine.disableLastmileTest();
  }

  /**
   * @description start the last-mile network probe test before
   * joining a channel to get the uplink and downlink last-mile network statistics,
   *  including the bandwidth, packet loss, jitter, and round-trip time (RTT).
   * @param {LastmileProbeConfig} config
   */
  startLastmileProbeTest(config: LastmileProbeConfig): number {
    return this.rtcEngine.startLastmileProbeTest(config);
  }

  /**
   * @description stop the last-mile network probe test
   */
  stopLastmileProbeTest(): number {
    return this.rtcEngine.stopLastmileProbeTest();
  }

  /**
   * @description Use before join channel to enable video communication, or you will only join with audio-enabled
   * @returns {number} 0 for success, <0 for failure
   */
  enableVideo(): number {
    return this.rtcEngine.enableVideo();
  }

  /**
   * @description Use to disable video and use pure audio communication
   * @returns {number} 0 for success, <0 for failure
   */
  disableVideo(): number {
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
  startPreview(): number {
    return this.rtcEngine.startPreview();
  }

  /**
   * @description This method stops the local video preview and closes the video.
   * @returns {number} 0 for success, <0 for failure
   */
  stopPreview(): number {
    return this.rtcEngine.stopPreview();
  }

  /**
   * @deprecated use setVideoEncoderConfiguration
   * @param {VIDEO_PROFILE_TYPE} profile - enumeration values represent video profile
   * @param {boolean} [swapWidthAndHeight = false] - Whether to swap width and height
   * @returns {number} 0 for success, <0 for failure
   */
  setVideoProfile(profile: VIDEO_PROFILE_TYPE, swapWidthAndHeight: boolean = false): number {
    return this.rtcEngine.setVideoProfile(profile, swapWidthAndHeight);
  }

  /**
   * @description For a video call or live broadcast, generally the SDK controls the camera output parameters. When the default camera capture settings do not meet special requirements or cause performance problems, we recommend using this method to set the camera capture preference:
   * - If the resolution or frame rate of the captured raw video data are higher than those set by \ref IRtcEngine::setVideoEncoderConfiguration "setVideoEncoderConfiguration", processing video frames requires extra CPU and RAM usage and degrades performance. We recommend setting config as CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE = 1 to avoid such problems.
   * - If you do not need local video preview or are willing to sacrifice preview quality, we recommend setting config as CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE = 1 to optimize CPU and RAM usage.
   * - If you want better quality for the local video preview, we recommend setting config as CAPTURER_OUTPUT_PREFERENCE_PREVIEW = 2.
   * @param {CameraCapturerConfiguration} config
   */
  setCameraCapturerConfiguration(config: CameraCapturerConfiguration) {
    return this.rtcEngine.setCameraCapturerConfiguration(config);
  }

  /**
   * @description set video encoder configuration
   * @param {VideoEncoderConfiguration} config - encoder config of video
   */
  setVideoEncoderConfiguration(config: VideoEncoderConfiguration): number {
    const {
      width = 640,
      height = 480,
      frameRate = 15,
      minFrameRate = -1,
      bitrate = 0,
      minBitrate = -1,
      orientationMode = 0,
      degradationPreference = 0
    } = config;
    return this.rtcEngine.setVideoEncoderConfiguration({
      width,
      height,
      frameRate,
      minFrameRate,
      bitrate,
      minBitrate,
      orientationMode,
      degradationPreference
    });
  }

  /**
   * @description Enables/Disables image enhancement and sets the options
   * @param {boolean} enable If to enable
   * @param {Object} options beauty options
   * @param {number} options.lighteningContrastLevel 0 for low, 1 for normal, 2 for high
   * @param {number} options.lighteningLevel The brightness level. The value ranges from 0.0 (original) to 1.0.
   * @param {number} options.smoothnessLevel The sharpness level. The value ranges between 0 (original) and 1. This parameter is usually used to remove blemishes.
   * @param {number} options.rednessLevel The redness level. The value ranges between 0 (original) and 1. This parameter adjusts the red saturation level.
   */
  setBeautyEffectOptions(enable: boolean, options: {
    lighteningContrastLevel: 0 | 1 | 2,
    lighteningLevel: number,
    smoothnessLevel: number,
    rednessLevel: number
  }): number {
    return this.rtcEngine.setBeautyEffectOptions(enable, options);
  }

  /**
   * @description set the priority of a remote user
   * @param {number} uid
   * @param {Priority} priority
   */
  setRemoteUserPriority(uid: number, priority: Priority) {
    return this.rtcEngine.setRemoteUserPriority(uid, priority);
  }

  /**
   * @description This method enables the audio mode, which is enabled by default.
   * @returns {number} 0 for success, <0 for failure
   */
  enableAudio(): number {
    return this.rtcEngine.enableAudio();
  }

  /**
   * @description This method disables the audio mode.
   * @returns {number} 0 for success, <0 for failure
   */
  disableAudio(): number {
    return this.rtcEngine.disableAudio();
  }

  /**
   * @description Set audio profile (before join channel) depending on your scenario
   * @param {number} profile 0: default, 1: speech standard, 2: music standard. 3: music standard stereo, 4: music high quality, 5: music high quality stereo
   * @param {number} scenario 0: default, 1: chatroom entertainment, 2: education, 3: game streaming, 4: showroom, 5: game chating
   * @returns {number} 0 for success, <0 for failure
   */
  setAudioProfile(profile: 0|1|2|3|4|5, scenario: 0|1|2|3|4|5): number {
    return this.rtcEngine.setAudioProfile(profile, scenario);
  }

  /**
   * @deprecated use setCameraCapturerConfiguration and setVideoEncoderConfiguration instead
   * @description This method allows users to set video preferences.
   * @param {boolean} preferFrameRateOverImageQuality enable/disable framerate over image quality
   * @returns {number} 0 for success, <0 for failure
   */
  setVideoQualityParameters(preferFrameRateOverImageQuality: boolean): number {
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
  setEncryptionSecret(secret: string): number {
    return this.rtcEngine.setEncryptionSecret(secret);
  }

  /**
   * @description This method mutes/unmutes local audio. It enables/disables
   * sending local audio streams to the network.
   * @param {boolean} mute mute/unmute audio
   * @returns {number} 0 for success, <0 for failure
   */
  muteLocalAudioStream(mute: boolean): number {
    return this.rtcEngine.muteLocalAudioStream(mute);
  }

  /**
   * @description This method mutes/unmutes all remote users’ audio streams.
   * @param {boolean} mute mute/unmute audio
   * @returns {number} 0 for success, <0 for failure
   */
  muteAllRemoteAudioStreams(mute: boolean): number {
    return this.rtcEngine.muteAllRemoteAudioStreams(mute);
  }

  /**
   * @description Stops receiving all remote users' audio streams by default.
   * @param {boolean} mute mute/unmute audio
   * @returns {number} 0 for success, <0 for failure
   */
  setDefaultMuteAllRemoteAudioStreams(mute: boolean): number {
    return this.rtcEngine.setDefaultMuteAllRemoteAudioStreams(mute);
  }

  /**
   * @description This method mutes/unmutes a specified user’s audio stream.
   * @param {number} uid user to mute/unmute
   * @param {boolean} mute mute/unmute audio
   * @returns {number} 0 for success, <0 for failure
   */
  muteRemoteAudioStream(uid: number, mute: boolean): number {
    return this.rtcEngine.muteRemoteAudioStream(uid, mute);
  }

  /**
   * @description This method mutes/unmutes video stream
   * @param {boolean} mute mute/unmute video
   * @returns {number} 0 for success, <0 for failure
   */
  muteLocalVideoStream(mute: boolean): number {
    return this.rtcEngine.muteLocalVideoStream(mute);
  }

  /**
   * @description This method disables the local video, which is only applicable to
   * the scenario when the user only wants to watch the remote video without sending
   * any video stream to the other user. This method does not require a local camera.
   * @param {boolean} enable enable/disable video
   * @returns {number} 0 for success, <0 for failure
   */
  enableLocalVideo(enable: boolean): number {
    return this.rtcEngine.enableLocalVideo(enable);
  }

  /**
   * @description Whether to enable the microphone to create the local audio stream.
   * @param {boolean} enable enable/disable video
   * @returns {number} 0 for success, <0 for failure
   */
  enableLocalAudio(enable: boolean): number {
    return this.rtcEngine.enableLocalAudio(enable);
  }

  /**
   * @description This method mutes/unmutes all remote users’ video streams.
   * @param {boolean} mute mute/unmute video
   * @returns {number} 0 for success, <0 for failure
   */
  muteAllRemoteVideoStreams(mute: boolean): number {
    return this.rtcEngine.muteAllRemoteVideoStreams(mute);
  }

  /**
   * @description Stops receiving all remote users’ video streams.
   * @param {boolean} mute mute/unmute audio
   * @returns {number} 0 for success, <0 for failure
   */
  setDefaultMuteAllRemoteVideoStreams(mute: boolean): number {
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
  enableAudioVolumeIndication(interval: number, smooth: number): number {
    return this.rtcEngine.enableAudioVolumeIndication(interval, smooth);
  }

  /**
   * @description This method mutes/unmutes a specified user’s video stream.
   * @param {number} uid user to mute/unmute
   * @param {boolean} mute mute/unmute video
   * @returns {number} 0 for success, <0 for failure
   */
  muteRemoteVideoStream(uid: number, mute: boolean): number {
    return this.rtcEngine.muteRemoteVideoStream(uid, mute);
  }

  /**
   * @description This method sets the in ear monitoring volume.
   * @param {number} volume Volume of the in-ear monitor, ranging from 0 to 100. The default value is 100.
   * @returns {number} 0 for success, <0 for failure
   */
  setInEarMonitoringVolume(volume: number): number {
    return this.rtcEngine.setInEarMonitoringVolume(volume);
  }

  /**
   * @deprecated
   * @description disable audio function in channel, which will be recovered when leave channel.
   * @returns {number} 0 for success, <0 for failure
   */
  pauseAudio() {
    deprecate('disableAudio');
    return this.rtcEngine.pauseAudio();
  }

  /**
   * @deprecated
   * @description resume audio function in channel.
   * @returns {number} 0 for success, <0 for failure
   */
  resumeAudio() {
    deprecate('enableAudio');
    return this.rtcEngine.resumeAudio();
  }

  /**
   * @description set filepath of log
   * @param {string} filepath filepath of log
   * @returns {number} 0 for success, <0 for failure
   */
  setLogFile(filepath: string): number {
    return this.rtcEngine.setLogFile(filepath);
  }

  /**
   * @description set the log file size (KB).
   * @param {number} size size of the log file. if exceed, old one will be overwrite
   * @returns {number} 0 for success, <0 for failure
   */
  setLogFileSize(size: number): number {
    return this.rtcEngine.setLogFileSize(size);
  }

  /**
   * @description set filepath of videosource log (Called After videosource initialized)
   * @param {string} filepath filepath of log
   * @returns {number} 0 for success, <0 for failure
   */
  videoSourceSetLogFile(filepath: string) {
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
  setLogFilter(filter: number): number {
    return this.rtcEngine.setLogFilter(filter);
  }

  /**
   * @description This method sets the stream mode (only applicable to live broadcast) to
   * single- (default) or dual-stream mode.
   * @param {boolean} enable enable/disable dual stream
   * @returns {number} 0 for success, <0 for failure
   */
  enableDualStreamMode(enable: boolean): number {
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
  setRemoteVideoStreamType(uid: number, streamType: StreamType): number {
    return this.rtcEngine.setRemoteVideoStreamType(uid, streamType);
  }

  /**
   * @description This method sets the default remote video stream type to high or low.
   * @param {StreamType} streamType 0 - high, 1 - low
   * @returns {number} 0 for success, <0 for failure
   */
  setRemoteDefaultVideoStreamType(streamType: StreamType): number {
    return this.rtcEngine.setRemoteDefaultVideoStreamType(streamType);
  }

  /**
   * @description This method enables interoperability with the Agora Web SDK.
   * @param {boolean} enable enable/disable interop
   * @returns {number} 0 for success, <0 for failure
   */
  enableWebSdkInteroperability(enable: boolean): number {
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
  setLocalVideoMirrorMode(mirrortype: 0|1|2): number {
    return this.rtcEngine.setLocalVideoMirrorMode(mirrortype);
  }

  /**
   * @description Changes the voice pitch of the local speaker.
   * @param {number} pitch - The value ranges between 0.5 and 2.0.
   * The lower the value, the lower the voice pitch.
   * The default value is 1.0 (no change to the local voice pitch).
   * @returns {number} 0 for success, <0 for failure
   */
  setLocalVoicePitch(pitch: number): number {
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
  setLocalVoiceEqualization(bandFrequency: number, bandGain: number): number {
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
  setLocalVoiceReverb(reverbKey: number, value: number): number {
    return this.rtcEngine.setLocalVoiceReverb(reverbKey, value);
  }

  /**
   * @description set the local voice changer option.
   * @param {VoiceChangerPreset} preset voice change preset
   */
  setLocalVoiceChanger(preset: VoiceChangerPreset): number {
    return this.rtcEngine.setLocalVoiceChanger(preset);
  }


  /**
   * @description set the preset local voice reverberation effect.
   * @param {AudioReverbPreset} preset local voice reverberation presets
   */
  setLocalVoiceReverbPreset(preset: AudioReverbPreset) {
    return this.rtcEngine.setLocalVoiceReverbPreset(preset);
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
  setLocalPublishFallbackOption(option: 0|1|2): number {
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
  setRemoteSubscribeFallbackOption(option: 0|1|2): number {
    return this.rtcEngine.setRemoteSubscribeFallbackOption(option);
  }

  registerLocalUserAccount(appId: string, userAccount: string): number {
    return this.rtcEngine.registerLocalUserAccount(appId, userAccount)
  }

  joinChannelWithUserAccount(token: string, channel: string, userAccount: string): number {
    return this.rtcEngine.joinChannelWithUserAccount(token, channel, userAccount)
  }

  getUserInfoByUserAccount(userAccount: string): {errCode: number, userInfo: UserInfo} {
    return this.rtcEngine.getUserInfoByUserAccount(userAccount)
  }

  getUserInfoByUid(uid: number): {errCode: number, userInfo: UserInfo}  {
    return this.rtcEngine.getUserInfoByUid(uid)
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
  setExternalAudioSource(enabled: boolean, samplerate: number, channels: number): number {
    return this.rtcEngine.setExternalAudioSource(enabled, samplerate, channels);
  }

  /**
   * @description return list of video devices
   * @returns {Array} array of device object
   */
  getVideoDevices(): Array<Object> {
    return this.rtcEngine.getVideoDevices();
  }

  /**
   * @description set video device to use via device id
   * @param {string} deviceId device id
   * @returns {number} 0 for success, <0 for failure
   */
  setVideoDevice(deviceId: string): number {
    return this.rtcEngine.setVideoDevice(deviceId);
  }

  /**
   * @description get current using video device
   * @return {Object} video device object
   */
  getCurrentVideoDevice(): Object {
    return this.rtcEngine.getCurrentVideoDevice();
  }

  /**
   * @description This method tests whether the video-capture device works properly.
   * Before calling this method, ensure that you have already called enableVideo,
   * and the HWND window handle of the incoming parameter is valid.
   * @returns {number} 0 for success, <0 for failure
   */
  startVideoDeviceTest(): number {
    return this.rtcEngine.startVideoDeviceTest();
  }

  /**
   * @description stop video device test
   * @returns {number} 0 for success, <0 for failure
   */
  stopVideoDeviceTest(): number {
    return this.rtcEngine.stopVideoDeviceTest();
  }

  /**
   * @description return list of audio playback devices
   * @returns {Array} array of device object
   */
  getAudioPlaybackDevices(): Array<Object> {
    return this.rtcEngine.getAudioPlaybackDevices();
  }

  /**
   * @description set audio playback device to use via device id
   * @param {string} deviceId device id
   * @returns {number} 0 for success, <0 for failure
   */
  setAudioPlaybackDevice(deviceId: string): number {
    return this.rtcEngine.setAudioPlaybackDevice(deviceId);
  }

  /**
   * @description Retrieves the audio playback device information associated with the device ID and device name
   * @param {string} deviceId device id
   * @param {string} deviceName device name
   * @returns {number} 0 for success, <0 for failure
   */
  getPlaybackDeviceInfo(deviceId: string, deviceName: string): number {
    return this.rtcEngine.getPlaybackDeviceInfo(deviceId, deviceName);
  }

  /**
   * @description get current using audio playback device
   * @return {Object} audio playback device object
   */
  getCurrentAudioPlaybackDevice(): Object {
    return this.rtcEngine.getCurrentAudioPlaybackDevice();
  }

  /**
   * @description set device playback volume
   * @param {number} volume 0 - 255
   * @returns {number} 0 for success, <0 for failure
   */
  setAudioPlaybackVolume(volume: number): number {
    return this.rtcEngine.setAudioPlaybackVolume(volume);
  }

  /**
   * @description get device playback volume
   * @returns {number} volume
   */
  getAudioPlaybackVolume(): number {
    return this.rtcEngine.getAudioPlaybackVolume();
  }

  /**
   * @description get audio recording devices
   * @returns {Array} array of recording devices
   */
  getAudioRecordingDevices(): Array<Object> {
    return this.rtcEngine.getAudioRecordingDevices();
  }

  /**
   * @description set audio recording device
   * @param {string} deviceId device id
   * @returns {number} 0 for success, <0 for failure
   */
  setAudioRecordingDevice(deviceId: string): number {
    return this.rtcEngine.setAudioRecordingDevice(deviceId);
  }

  /**
   * @description Retrieves the audio recording device information associated with the device ID and device name.
   * @param {string} deviceId device id
   * @param {string} deviceName device name
   * @returns {number} 0 for success, <0 for failure
   */
  getRecordingDeviceInfo(deviceId: string, deviceName: string): number {
    return this.rtcEngine.getRecordingDeviceInfo(deviceId, deviceName);
  }

  /**
   * @description get current selected audio recording device
   * @returns {Object} audio recording device object
   */
  getCurrentAudioRecordingDevice(): Object {
    return this.rtcEngine.getCurrentAudioRecordingDevice();
  }

  /**
   * @description get audio recording volume
   * @return {number} volume
   */
  getAudioRecordingVolume(): number {
    return this.rtcEngine.getAudioRecordingVolume();
  }

  /**
   * @description set audio recording device volume
   * @param {number} volume 0 - 255
   * @returns {number} 0 for success, <0 for failure
   */
  setAudioRecordingVolume(volume: number): number {
    return this.rtcEngine.setAudioRecordingVolume(volume);
  }

  /**
   * @description This method checks whether the playback device works properly. The SDK plays an audio file
   * specified by the user. If the user can hear the sound, then the playback device works properly.
   * @param {string} filepath filepath of sound file to play test
   * @returns {number} 0 for success, <0 for failure
   */
  startAudioPlaybackDeviceTest(filepath: string): number {
    return this.rtcEngine.startAudioPlaybackDeviceTest(filepath);
  }

  /**
   * @description stop playback device test
   * @returns {number} 0 for success, <0 for failure
   */
  stopAudioPlaybackDeviceTest(): number {
    return this.rtcEngine.stopAudioPlaybackDeviceTest();
  }

  /**
   * @description This method tests whether the local audio devices are working properly.
   * After calling this method, the microphone captures the local audio
   * and plays it through the speaker. The \ref IRtcEngineEventHandler::onAudioVolumeIndication "onAudioVolumeIndication" callback
   * returns the local audio volume information at the set interval.
   * @param {number} interval indication interval (ms)
   */
  startAudioDeviceLoopbackTest(interval: number): number {
    return this.rtcEngine.startAudioDeviceLoopbackTest(interval);
  }

  /**
   * @description stop AudioDeviceLoopbackTest
   */
  stopAudioDeviceLoopbackTest(): number {
    return this.rtcEngine.stopAudioDeviceLoopbackTest();
  }

  /**
   * @description This method enables loopback recording. Once enabled, the SDK collects all local sounds.
   * @param {boolean} [enable = false] whether to enable loop back recording
   * @param {string|null} [deviceName = null] target audio device
   * @returns {number} 0 for success, <0 for failure
   */
  enableLoopbackRecording(enable = false, deviceName: string | null = null): number {
    return this.rtcEngine.enableLoopbackRecording(enable, deviceName);
  }

  /**
   * @description This method checks whether the microphone works properly. Once the test starts, the SDK uses
   * the onAudioVolumeIndication callback to notify the application about the volume information.
   * @param {number} indicateInterval in second
   * @returns {number} 0 for success, <0 for failure
   */
  startAudioRecordingDeviceTest(indicateInterval: number): number {
    return this.rtcEngine.startAudioRecordingDeviceTest(indicateInterval);
  }

  /**
   * @description stop audio recording device test
   * @returns {number} 0 for success, <0 for failure
   */
  stopAudioRecordingDeviceTest(): number {
    return this.rtcEngine.stopAudioRecordingDeviceTest();
  }

  /**
   * @description check whether selected audio playback device is muted
   * @returns {boolean} muted/unmuted
   */
  getAudioPlaybackDeviceMute(): boolean {
    return this.rtcEngine.getAudioPlaybackDeviceMute();
  }

  /**
   * @description set current audio playback device mute/unmute
   * @param {boolean} mute mute/unmute
   * @returns {number} 0 for success, <0 for failure
   */
  setAudioPlaybackDeviceMute(mute: boolean): number {
    return this.rtcEngine.setAudioPlaybackDeviceMute(mute);
  }

  /**
   * @description check whether selected audio recording device is muted
   * @returns {boolean} muted/unmuted
   */
  getAudioRecordingDeviceMute(): boolean {
    return this.rtcEngine.getAudioRecordingDeviceMute();
  }

  /**
   * @description set current audio recording device mute/unmute
   * @param {boolean} mute mute/unmute
   * @returns {number} 0 for success, <0 for failure
   */
  setAudioRecordingDeviceMute(mute: boolean): number {
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
  videoSourceInitialize(appId: string): number {
    return this.rtcEngine.videoSourceInitialize(appId);
  }

  /**
   * @description setup renderer for video source
   * @param {Element} view dom element where video source should be displayed
   */
  setupLocalVideoSource(view: Element): void {
    this.initRender('videosource', view);
  }

  /**
   * @description Set it to true to enable videosource web interoperability (After videosource initialized)
   * @param {boolean} enabled enalbe/disable web interoperability
   * @returns {number} 0 for success, <0 for failure
   */
  videoSourceEnableWebSdkInteroperability(enabled: boolean): number {
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
  videoSourceJoin(
    token: string,
    cname: string,
    info: string,
    uid: number
  ): number {
    return this.rtcEngine.videoSourceJoin(token, cname, info, uid);
  }

  /**
   * @description let video source Leave channel
   * @returns {number} 0 for success, <0 for failure
   */
  videoSourceLeave(): number {
    return this.rtcEngine.videoSourceLeave();
  }

  /**
   * @description This method updates the Token for video source
   * @param {string} token new token to update
   * @returns {number} 0 for success, <0 for failure
   */
  videoSourceRenewToken(token: string): number {
    return this.rtcEngine.videoSourceRenewToken(token);
  }

  /**
   * @description Set channel profile (after ScreenCapture2) for video source
   * @description 0 (default) for communication, 1 for live broadcasting, 2 for in-game
   * @param {number} profile profile
   * @returns {number} 0 for success, <0 for failure
   */
  videoSourceSetChannelProfile(profile: number): number {
    return this.rtcEngine.videoSourceSetChannelProfile(profile);
  }

  /**
   * @description set video profile for video source (must be called after startScreenCapture2)
   * @param {VIDEO_PROFILE_TYPE} profile - enumeration values represent video profile
   * @param {boolean} [swapWidthAndHeight = false] - Whether to swap width and height
   * @returns {number} 0 for success, <0 for failure
   */
  videoSourceSetVideoProfile(profile: VIDEO_PROFILE_TYPE, swapWidthAndHeight = false): number {
    return this.rtcEngine.videoSourceSetVideoProfile(profile, swapWidthAndHeight);
  }

  /**
   * @description get list of all system window ids and relevant infos, the window id can be used for screen share
   * @returns {Array} list of window infos
   */
  getScreenWindowsInfo(): Array<Object> {
    return this.rtcEngine.getScreenWindowsInfo();
  }

  /**
   * @description get list of all system display ids and relevant infos, the display id can be used for screen share
   * @returns {Array} list of display infos
   */
  getScreenDisplaysInfo(): Array<Object> {
    return this.rtcEngine.getScreenDisplaysInfo();
  }

  /**
   * @deprecated
   * @description start video source screen capture
   * @param {number} wndid windows id to capture
   * @param {number} captureFreq fps of video source screencapture, 1 - 15
   * @param {*} rect null/if specified, e.g, {left: 0, right: 100, top: 0, bottom: 100} (relative distance from the left-top corner of the screen)
   * @param {number} bitrate bitrate of video source screencapture
   * @returns {number} 0 for success, <0 for failure
   */
  startScreenCapture2(
    windowId: number,
    captureFreq: number,
    rect: {left: number, right: number, top: number, bottom: number},
    bitrate: number
  ): number {
    deprecate('"videoSourceStartScreenCaptureByScreen" or "videoSourceStartScreenCaptureByWindow"');
    return this.rtcEngine.startScreenCapture2(windowId, captureFreq, rect, bitrate);
  }

  /**
   * @description stop video source screen capture
   * @returns {number} 0 for success, <0 for failure
   */
  stopScreenCapture2(): number {
    return this.rtcEngine.stopScreenCapture2();
  }

  /**
   * @description start video source preview
   * @returns {number} 0 for success, <0 for failure
   */
  startScreenCapturePreview(): number {
    return this.rtcEngine.videoSourceStartPreview();
  }

  /**
   * @description stop video source preview
   * @returns {number} 0 for success, <0 for failure
   */
  stopScreenCapturePreview(): number {
    return this.rtcEngine.videoSourceStopPreview();
  }

  /**
   * @description enable dual stream mode for video source
   * @param {boolean} enable whether dual stream mode is enabled
   * @return {number} 0 for success, <0 for failure
   */
  videoSourceEnableDualStreamMode(enable: boolean): number {
    return this.rtcEngine.videoSourceEnableDualStreamMode(enable);
  }

  /**
   * @description setParameters for video source
   * @param {string} parameter parameter to set
   * @returns {number} 0 for success, <0 for failure
   */
  videoSourceSetParameters(parameter: string): number {
    return this.rtcEngine.videoSourceSetParameter(parameter);
  }

  /**
   * @description This method updates the screen capture region for video source
   * @param {*} rect {left: 0, right: 100, top: 0, bottom: 100} (relative distance from the left-top corner of the screen)
   * @returns {number} 0 for success, <0 for failure
   */
  videoSourceUpdateScreenCaptureRegion(rect: {
    left: number,
    right: number,
    top: number,
    bottom: number
  }) {
    return this.rtcEngine.videoSourceUpdateScreenCaptureRegion(rect);
  }

  /**
   * @description release video source object
   * @returns {number} 0 for success, <0 for failure
   */
  videoSourceRelease(): number {
    return this.rtcEngine.videoSourceRelease();
  }

  // 2.4 new Apis
  /**
   * @description Shares the whole or part of a screen by specifying the screen rect.
   * @param {ScreenSymbol} screenSymbol screenid on mac / screen position on windows
   * @param {CaptureRect} rect
   * @param {CaptureParam} param
   */
  videoSourceStartScreenCaptureByScreen(screenSymbol: ScreenSymbol, rect: CaptureRect, param: CaptureParam): number {
    return this.rtcEngine.videosourceStartScreenCaptureByScreen(screenSymbol, rect, param);
  }

  /**
   * @description Shares the whole or part of a window by specifying the window ID.
   * @param {number} windowSymbol windowid
   * @param {CaptureRect} rect
   * @param {CaptureParam} param
   */
  videoSourceStartScreenCaptureByWindow(windowSymbol: number, rect: CaptureRect, param: CaptureParam): number {
    return this.rtcEngine.videosourceStartScreenCaptureByWindow(windowSymbol, rect, param);
  }

  /**
   * @description Updates the screen sharing parameters.
   * @param {CaptureParam} param
   */
  videoSourceUpdateScreenCaptureParameters(param: CaptureParam): number {
    return this.rtcEngine.videosourceUpdateScreenCaptureParameters(param);
  }

  /**
   * @description  Updates the screen sharing parameters.
   * @param {VideoContentHint} hint
   */
  videoSourceSetScreenCaptureContentHint(hint: VideoContentHint): number {
    return this.rtcEngine.videosourceSetScreenCaptureContentHint(hint);
  }



  // ===========================================================================
  // SCREEN SHARE
  // When this api is called, your camera stream will be replaced with
  // screenshare view. i.e. you can only see camera video or screenshare
  // one at a time via this section's api
  // ===========================================================================
  /**
   * @deprecated
   * @description start screen capture
   * @param {number} windowId windows id to capture
   * @param {number} captureFreq fps of screencapture, 1 - 15
   * @param {*} rect null/if specified, e.g, {left: 0, right: 100, top: 0, bottom: 100} (relative distance from the left-top corner of the screen)
   * @param {number} bitrate bitrate of screencapture
   * @returns {number} 0 for success, <0 for failure
   */
  startScreenCapture(
    windowId: number,
    captureFreq: number,
    rect: {left: number, right: number, top: number, bottom: number},
    bitrate: number
  ): number {
    deprecate();
    return this.rtcEngine.startScreenCapture(windowId, captureFreq, rect, bitrate);
  }

  /**
   * @description stop screen capture
   * @returns {number} 0 for success, <0 for failure
   */
  stopScreenCapture(): number {
    return this.rtcEngine.stopScreenCapture();
  }

  /**
   * @description This method updates the screen capture region.
   * @param {*} rect {left: 0, right: 100, top: 0, bottom: 100} (relative distance from the left-top corner of the screen)
   * @returns {number} 0 for success, <0 for failure
   */
  updateScreenCaptureRegion(
    rect: {
      left: number,
      right: number,
      top: number,
      bottom: number
    }
  ): number {
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
  startAudioMixing(
    filepath: string,
    loopback: boolean,
    replace: boolean,
    cycle: number
  ): number {
    return this.rtcEngine.startAudioMixing(filepath, loopback, replace, cycle);
  }

  /**
   * @description This method stops audio mixing. Call this API when you are in a channel.
   * @returns {number} 0 for success, <0 for failure
   */
  stopAudioMixing(): number {
    return this.rtcEngine.stopAudioMixing();
  }

  /**
   * @description This method pauses audio mixing. Call this API when you are in a channel.
   * @returns {number} 0 for success, <0 for failure
   */
  pauseAudioMixing(): number {
    return this.rtcEngine.pauseAudioMixing();
  }

  /**
   * @description This method resumes audio mixing from pausing. Call this API when you are in a channel.
   * @returns {number} 0 for success, <0 for failure
   */
  resumeAudioMixing(): number {
    return this.rtcEngine.resumeAudioMixing();
  }

  /**
   * @description This method adjusts the volume during audio mixing. Call this API when you are in a channel.
   * @param {number} volume Volume ranging from 0 to 100. By default, 100 is the original volume.
   * @returns {number} 0 for success, <0 for failure
   */
  adjustAudioMixingVolume(volume: number): number {
    return this.rtcEngine.adjustAudioMixingVolume(volume);
  }

  /**
   * @description Adjusts the audio mixing volume for local playback.
   * @param {number} volume Volume ranging from 0 to 100. By default, 100 is the original volume.
   * @returns {number} 0 for success, <0 for failure
   */
  adjustAudioMixingPlayoutVolume(volume: number): number {
    return this.rtcEngine.adjustAudioMixingPlayoutVolume(volume);
  }

  /**
   * @description Adjusts the audio mixing volume for publishing (for remote users).
   * @param {number} volume Volume ranging from 0 to 100. By default, 100 is the original volume.
   * @returns {number} 0 for success, <0 for failure
   */
  adjustAudioMixingPublishVolume(volume: number): number {
    return this.rtcEngine.adjustAudioMixingPublishVolume(volume);
  }

  /**
   * @description This method gets the duration (ms) of the audio mixing. Call this API when you are in
   * a channel. A return value of 0 means that this method call has failed.
   * @returns {number} duration of audio mixing
   */
  getAudioMixingDuration(): number {
    return this.rtcEngine.getAudioMixingDuration();
  }

  /**
   * @description This method gets the playback position (ms) of the audio. Call this API
   * when you are in a channel.
   * @returns {number} current playback position
   */
  getAudioMixingCurrentPosition(): number {
    return this.rtcEngine.getAudioMixingCurrentPosition();
  }

  /**
   * @description This method drags the playback progress bar of the audio mixing file to where
   * you want to play instead of playing it from the beginning.
   * @param {number} position Integer. The position of the audio mixing file in ms
   * @returns {number} 0 for success, <0 for failure
   */
  setAudioMixingPosition(position: number): number {
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
  addPublishStreamUrl(url: string, transcodingEnabled: boolean): number {
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
  removePublishStreamUrl(url: string): number {
    return this.rtcEngine.removePublishStreamUrl(url);
  }

  /**
   * @description Sets the video layout and audio settings for CDN live. (CDN live only.)
   * @param {TranscodingConfig} transcoding transcoding Sets the CDN live audio/video transcoding settings. See LiveTranscoding.
   * @returns {number} 0 for success, <0 for failure
   */
  setLiveTranscoding(transcoding: TranscodingConfig): number {
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
  addInjectStreamUrl(url: string, config: InjectStreamConfig): number {
    return this.rtcEngine.addInjectStreamUrl(url, config);
  }

  /**
   * @description Removes the voice or video stream HTTP/HTTPS URL address from a live broadcast.
   * @note If this method is called successfully, the \ref IRtcEngineEventHandler::onUserOffline "onUserOffline" callback is triggered
   * and a stream uid of 666 is returned.
   * @param {string} url Pointer to the HTTP/HTTPS URL address of the added stream to be removed.
   * @returns {number} 0 for success, <0 for failure
   */
  removeInjectStreamUrl(url: string): number {
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
  setRecordingAudioFrameParameters(
    sampleRate: number,
    channel: 1|2,
    mode: 0|1|2,
    samplesPerCall: number
  ): number {
    return this.rtcEngine.setRecordingAudioFrameParameters(
      sampleRate,
      channel,
      mode,
      samplesPerCall
    );
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
  setPlaybackAudioFrameParameters(
    sampleRate: number,
    channel: 1|2,
    mode: 0|1|2,
    samplesPerCall: number
  ): number {
    return this.rtcEngine.setPlaybackAudioFrameParameters(
      sampleRate,
      channel,
      mode,
      samplesPerCall
    );
  }

  /**
   * This method sets the format of the callback data in onMixedAudioFrame.
   * @param {number} sampleRate Specifies the sampling rate in the callback data returned by onMixedAudioFrame,
   * which can set be as 8000, 16000, 32000, 44100, or 48000.
   * @param {number} samplesPerCall Specifies the sampling points in the called data returned in onMixedAudioFrame,
   * for example, it is usually set as 1024 for stream pushing.
   * @returns {number} 0 for success, <0 for failure
   */
  setMixedAudioFrameParameters(
    sampleRate: number,
    samplesPerCall: number
  ): number {
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
  createDataStream(reliable: boolean, ordered: boolean): number {
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
  sendStreamMessage(streamId: number, msg: string): number {
    return this.rtcEngine.sendStreamMessage(streamId, msg);
  }

  // ===========================================================================
  // MANAGE AUDIO EFFECT
  // ===========================================================================
  /**
   * @description get effects volume
   * @returns {number} volume
   */
  getEffectsVolume(): number {
    return this.rtcEngine.getEffectsVolume();
  }
  /**
   * @description set effects volume
   * @param {number} volume - [0.0, 100.0]
   * @returns {number} 0 for success, <0 for failure
   */
  setEffectsVolume(volume: number): number {
    return this.rtcEngine.setEffectsVolume(volume);
  }
  /**
   * @description set effect volume of a sound id
   * @param {number} soundId soundId
   * @param {number} volume - [0.0, 100.0]
   * @returns {number} 0 for success, <0 for failure
   */
  setVolumeOfEffect(soundId: number, volume: number): number {
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
  playEffect(
    soundId: number,
    filePath: string,
    loopcount: number,
    pitch: number,
    pan: number,
    gain: number,
    publish: number
  ): number {
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
   * @param {number} soundId soundId
   * @returns {number} 0 for success, <0 for failure
   */
  stopEffect(soundId: number): number {
    return this.rtcEngine.stopEffect(soundId);
  }
  /**
   * @description preload effect
   * @param {number} soundId soundId
   * @param {string} filePath filepath
   * @returns {number} 0 for success, <0 for failure
   */
  preloadEffect(soundId: number, filePath: string): number {
    return this.rtcEngine.preloadEffect(soundId, filePath);
  }
  /**
   * This method releases a specific preloaded audio effect from the memory.
   * @param {number} soundId soundId
   * @returns {number} 0 for success, <0 for failure
   */
  unloadEffect(soundId: number): number {
    return this.rtcEngine.unloadEffect(soundId);
  }
  /**
   * @description This method pauses a specific audio effect.
   * @param {number} soundId soundId
   * @returns {number} 0 for success, <0 for failure
   */
  pauseEffect(soundId: number): number {
    return this.rtcEngine.pauseEffect(soundId);
  }
  /**
   * @description This method pauses all the audio effects.
   * @returns {number} 0 for success, <0 for failure
   */
  pauseAllEffects(): number {
    return this.rtcEngine.pauseAllEffects();
  }
  /**
   * @description This method resumes playing a specific audio effect.
   * @param {number} soundId sound id
   * @returns {number} 0 for success, <0 for failure
   */
  resumeEffect(soundId: number): number {
    return this.rtcEngine.resumeEffect(soundId);
  }
  /**
   * @description This method resumes playing all the audio effects.
   * @returns {number} 0 for success, <0 for failure
   */
  resumeAllEffects(): number {
    return this.rtcEngine.resumeAllEffects();
  }

  /**
   * @description Enables/Disables stereo panning for remote users.
   * Ensure that you call this method before joinChannel to enable stereo panning
   * for remote users so that the local user can track the position of a remote user
   * by calling \ref agora::rtc::RtcEngineParameters::setRemoteVoicePosition "setRemoteVoicePosition".
   * @param {boolean} enable
   */
  enableSoundPositionIndication(enable: boolean) {
    return this.rtcEngine.enableSoundPositionIndication(enable);
  }

  /**
   * @description For this method to work, enable stereo panning for remote users
   * by calling enableSoundPositionIndication before joining a channel.
   * This method requires hardware support. For the best sound positioning,
   * we recommend using a stereo speaker.
   * @param {number} uid uid
   * @param {number} pan The sound position of the remote user. The value ranges from -1.0 to 1.0.
   * - 0.0: the remote sound comes from the front. -1.0: the remote sound comes from the left.
   * - -1.0: the remote sound comes from the left.
   * - 1.0: the remote sound comes from the right.
   * @param {number} gain Gain of the remote user.
   * The value ranges from 0.0 to 100.0.
   * The default value is 100.0 (the original gain of the remote user).
   * The smaller the value, the less the gain.
   */
  setRemoteVoicePosition(uid: number, pan: number, gain: number): number {
    return this.rtcEngine.setRemoteVoicePosition(uid, pan, gain);
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
  getCallId(): string {
    return this.rtcEngine.getCallId();
  }

  /**
   * @description This method lets the user rate the call. It is usually called after the call ends.
   * @param {string} callId Call ID retrieved from the getCallId method.
   * @param {number} rating Rating for the call between 1 (lowest score) to 10 (highest score).
   * @param {string} desc A given description for the call with a length less than 800 bytes.
   * @returns {number} 0 for success, <0 for failure
   */
  rate(callId: string, rating: number, desc: string): number {
    return this.rtcEngine.rate(callId, rating, desc);
  }

  /**
   * @description This method allows the user to complain about the call quality. It is usually
   * called after the call ends.
   * @param {string} callId Call ID retrieved from the getCallId method.
   * @param {string} desc A given description of the call with a length less than 800 bytes.
   * @returns {number} 0 for success, <0 for failure
   */
  complain(callId: string, desc: string): number {
    return this.rtcEngine.complain(callId, desc);
  }

  // ===========================================================================
  // replacement for setParameters call
  // ===========================================================================
  setBool(key: string, value: boolean): number {
    return this.rtcEngine.setBool(key, value);
  }

  setInt(key: string, value: number): number {
    return this.rtcEngine.setInt(key, value);
  }

  setUInt(key: string, value: number): number {
    return this.rtcEngine.setUInt(key, value);
  }

  setNumber(key: string, value: number): number {
    return this.rtcEngine.setNumber(key, value);
  }

  setString(key: string, value: string): number {
    return this.rtcEngine.setString(key, value);
  }

  setObject(key: string, value: string): number {
    return this.rtcEngine.setObject(key, value);
  }

  getBool(key: string): boolean {
    return this.rtcEngine.getBool(key);
  }

  getInt(key: string): number {
    return this.rtcEngine.getInt(key);
  }

  getUInt(key: string): number {
    return this.rtcEngine.getUInt(key);
  }

  getNumber(key: string): number {
    return this.rtcEngine.getNumber(key);
  }

  getString(key: string): string {
    return this.rtcEngine.getString(key);
  }

  getObject(key: string): string {
    return this.rtcEngine.getObject(key);
  }

  getArray(key: string): string {
    return this.rtcEngine.getArray(key);
  }

  setParameters(param: string): number {
    return this.rtcEngine.setParameters(param);
  }

  convertPath(path: string): string {
    return this.rtcEngine.convertPath(path);
  }

  setProfile(profile: string, merge: boolean): number {
    return this.rtcEngine.setProfile(profile, merge);
  }
}

declare interface AgoraRtcEngine {
  /**
   * Occurs when an API method is executed.
   * - api: The method executed by the SDK.
   * - err: Error code that the SDK returns when the method call fails.
   */
  on(evt: 'apiCallExecuted', cb: (api: string, err: number) => void): this;
  /**
   * Reports a warning during SDK runtime.
   * - warn: Warning code.
   * - msg: Pointer to the warning message.
   */
  on(evt: 'warning', cb: (warn: number, msg: string) => void): this;
  /** Reports an error during SDK runtime.
   * - err: Error code.
   * - msg: Pointer to the error message.
   */
  on(evt: 'error', cb: (err: number, msg: string) => void): this;
  /** Occurs when a user joins a specified channel.
   * - channel: Pointer to the channel name.
   * - uid: User ID of the user joining the channel.
   * - elapsed: Time elapsed (ms) from the user calling the {@link joinChannel} method until the SDK triggers this callback.
   */
  on(evt: 'joinedChannel', cb: (
    channel: string, uid: number, elapsed: number
  ) => void): this;
  /** Occurs when a user rejoins the channel after disconnection due to network problems.
   * When a user loses connection with the server because of network problems, the SDK automatically tries to reconnect and triggers this callback upon reconnection.
   * - channel: Pointer to the channel name.
   * - uid: User ID of the user joining the channel.
   * - elapsed: Time elapsed (ms) from the user calling the {@link joinChannel} method until the SDK triggers this callback.
   */
  on(evt: 'rejoinedChannel', cb: (
    channel: string, uid: number, elapsed: number
  ) => void): this;
  // on(evt: 'audioQuality', cb: (
  //   uid: number, quality: AgoraNetworkQuality, delay: number, lost: number
  // ) => void): this;
  /** Reports which users are speaking and the speakers' volume. */
  on(evt: 'audioVolumeIndication', cb: (
    uid: number,
    volume: number,
    speakerNumber: number,
    totalVolume: number
  ) => void): this;
  /** Reports which users are speaking and the speakers' volume.
   * - speakers: A struct containing each speaker's user ID and volume information.
   * - speakerNumber: Total number of speakers.
   * - volume: Total volume after audio mixing. The value ranges between 0 (lowest volume) and 255 (highest volume).
   */
  on(evt: 'groupAudioVolumeIndication', cb: (
    speakers: {
      uid: number,
      volume: number
    }[],
    speakerNumber: number,
    totalVolume: number
  ) => void): this;
  /** Occurs when the recording application leaves the channel.
   */
  on(evt: 'leaveChannel', cb: () => void): this;
  /** Reports the statistics of the AgoraRtcEngine once every two seconds.
   * - stats: Agora RTC engine statistics, see {@link RtcStats}.
   */
  on(evt: 'rtcStats', cb: (stats: RtcStats) => void): this;
  /** Reports the statistics of the local video streams.
   * - stats: The statistics of the local video stream. See {@link LocalVideoStats}.
   */
  on(evt: 'localVideoStats', cb: (stats: LocalVideoStats) => void): this;
  /** Reports the statistics of the video stream from each remote user/host. 
   * - stats: Statistics of the received remote video streams. See {@link RemoteVideoState}. 
   */
  on(evt: 'remoteVideoStats', cb: (stats: RemoteVideoStats) => void): this;
  /** Reports the statistics of the audio stream from each remote user/host.
   * - stats: Statistics of the received remote audio streams. See {@link RemoteAudioStats}.
   */
  on(evt: 'remoteAudioStats', cb: (stats: RemoteAudioStats) => void): this;
  /** Reports the transport-layer statistics of each remote video stream.
   * This callback reports the transport-layer statistics, such as the packet loss rate and time delay, once every two seconds 
   * after the local user receives the video packet from a remote user.
   * - stats: The transport-layer statistics. See {@link RemoteVideoTransportStats}.
   */
  on(evt: 'remoteVideoTransportStats', cb: (stats: RemoteVideoTransportStats) => void): this;
  /** Reports the transport-layer statistics of each remote audio stream. 
   * - stats: The transport-layer statistics. See {@link remoteAudioTransportStats}.
  */
  on(evt: 'remoteAudioTransportStats', cb: (stats: RemoteAudioTransportStats) => void): this;
  /** Occurs when the audio device state changes.
   * - deviceId: Pointer to the device ID.
   * - deviceType: Device type. See {@link MediaDeviceType}.
   * - deviceState: Device state：
   * 
   *  - 1: The device is active
   *  - 2: The device is disabled.
   *  - 4: The device is not present.
   *  - 8: The device is unplugged.
   */
  on(evt: 'audioDeviceStateChanged', cb: (
    deviceId: string,
    deviceType: number,
    deviceState: number,
  ) => void): this;
  // on(evt: 'audioMixingFinished', cb: () => void): this;
  /** Occurs when the state of the local user's audio mixing file changes.
   * - state: The state code.
   *  - 710: The audio mixing file is playing.
   *  - 711: The audio mixing file pauses playing.
   *  - 713: The audio mixing file stops playing.
   *  - 714: An exception occurs when playing the audio mixing file.
   * 
   * - err: The error code.
   *  - 701: The SDK cannot open the audio mixing file.
   *  - 702: The SDK opens the audio mixing file too frequently.
   *  - 703: The audio mixing file playback is interrupted.
   * 
   */
  on(evt: 'audioMixingStateChanged', cb: (state: number, err: number) => void): this;
  /** Occurs when a remote user starts audio mixing.
   * When a remote user calls {@link startAudioMixing} to play the background music, the SDK reports this callback.
   */
  on(evt: 'remoteAudioMixingBegin', cb: () => void): this;
  /** Occurs when a remote user finishes audio mixing. */
  on(evt: 'remoteAudioMixingEnd', cb: () => void): this;
  /** Occurs when the local audio effect playback finishes. */
  on(evt: 'audioEffectFinished', cb: (soundId: number) => void): this;
  /** Occurs when the video device state changes.
   * - deviceId: Pointer to the device ID.
   * - deviceType: Device type. See {@link MediaDeviceType}.
   * - deviceState: Device state：
   * 
   *  - 1: The device is active
   *  - 2: The device is disabled.
   *  - 4: The device is not present.
   *  - 8: The device is unplugged.
   */
  on(evt: 'videoDeviceStateChanged', cb: (
    deviceId: string,
    deviceType: number,
    deviceState: number,
  ) => void): this;
  /**
   * Reports the last mile network quality of each user in the channel once every two seconds.
   * Last mile refers to the connection between the local device and Agora's edge server.
   * 
   * - uid: User ID. The network quality of the user with this uid is reported. If uid is 0, 
   * the local network quality is reported.
   * - txquality: Uplink transmission quality rating of the user in terms of the transmission bitrate, packet loss rate, 
   * average RTT (Round-Trip Time), and jitter of the uplink network. See {@link AgoraNetworkQuality}.
   * - rxquality: Downlink network quality rating of the user in terms of the packet loss rate, average RTT, and jitter 
   * of the downlink network. See {@link AgoraNetworkQuality}.
   */
  on(evt: 'networkQuality', cb: (
    uid: number,
    txquality: AgoraNetworkQuality,
    rxquality: AgoraNetworkQuality
  ) => void): this;
  /** Reports the last mile network quality of the local user once every two seconds before the user joins the channel.
   * - quality: The last mile network quality. See {@link AgoraNetworkQuality}.
   * 
   * Last mile refers to the connection between the local device and Agora's edge server. After the application calls the {@link enableLastmileTest} method, 
   * this callback reports once every two seconds the uplink and downlink last mile network conditions of the local user before the user joins the channel.
   */
  on(evt: 'lastMileQuality', cb: (quality: AgoraNetworkQuality) => void): this;
  /** Reports the last-mile network probe result.
   * - result: The uplink and downlink last-mile network probe test result. See {@link LastmileProbeResult}.
   * 
   * The SDK triggers this callback within 30 seconds after the app calls the {@link startLastmileProbeTest} method.
   */
  on(evt: 'lastmileProbeResult', cb: (result: LastmileProbeResult) => void): this;
  /** Occurs when the engine receives and renders the first local video frame on the video window.
   * - width: Width (pixels) of the first local video frame.
   * - height: Height (pixels) of the first local video frame.
   * - elapsed: Time elapsed (ms) from the local user calling the {@link joinChannel} method until the SDK triggers this callback.
   */
  on(evt: 'firstLocalVideoFrame', cb: (
    width: number,
    height: number,
    elapsed: number
  ) => void): this;
  /** Occurs when the first remote video frame is received and decoded.
   * - uid: User ID of the remote user sending the video stream.
   * - elapsed: Time elapsed (ms) from the local user calling the {@link joinChannel} method until the SDK triggers this callback.
   * This callback is triggered in either of the following scenarios:
   * - The remote user joins the channel and sends the video stream.
   * - The remote user stops sending the video stream and re-sends it after 15 seconds. Reasons for such an interruption include:
   *  - The remote user leaves the channel.
   *  - The remote user drops offline.
   *  - The remote user calls the {@link muteLocalVideoStream} method to stop sending the video stream.
   *  - The remote user calls the {@link disableVideo} method to disable video.
   */
  on(evt: 'addStream', cb: (
    uid: number,
    elapsed: number,
  ) => void): this;
  /** Occurs when the video size or rotation of a specified user changes.
   * - uid: User ID of the remote user or local user (0) whose video size or rotation changes.
   * - width: New width (pixels) of the video.
   * - height: New height (pixels) of the video.
   * - roation: New height (pixels) of the video.
   */
  on(evt: 'videoSizeChanged', cb: (
    uid: number,
    width: number,
    height: number,
    rotation: number
  ) => void): this;
  /** Occurs when the first remote video frame is rendered.
   * The SDK triggers this callback when the first frame of the remote video is displayed in the user's video window. 
   * - uid: User ID of the remote user sending the video stream.
   * - width: Width (pixels) of the video frame.
   * - height: Height (pixels) of the video stream.
   * - elapsed: Time elapsed (ms) from the local user calling the {@link joinChannel} method until the SDK triggers this callback.
   */
  on(evt: 'firstRemoteVideoFrame', cb: (
    uid: number,
    width: number,
    height: number,
    elapsed: number
  ) => void): this;
  /** Occurs when a user or host joins the channel.
   * - uid: User ID of the user or host joining the channel.
   * - elapsed: Time delay (ms) from the local user calling the {@link joinChannel} method until the SDK triggers this callback.
   * 
   * The SDK triggers this callback under one of the following circumstances:
   * - A remote user/host joins the channel by calling the {@link joinChannel} method.
   * - A remote user switches the user role to the host by calling the {@link setClientRole} method after joining the channel.
   * - A remote user/host rejoins the channel after a network interruption.
   * - The host injects an online media stream into the channel by calling the {@link addInjectStreamUrl} method.
   * 
   * **Note**: In the Live-broadcast profile:
   * - The host receives this callback when another host joins the channel.
   * - The audience in the channel receives this callback when a new host joins the channel.
   * - When a web application joins the channel, the SDK triggers this callback as long as the web application publishes streams.
   */
  on(evt: 'userJoined', cb: (uid: number, elapsed: number) => void): this;
  /** Occurs when a remote user leaves the channel. 
   * - uid: User ID of the user leaving the channel or going offline.
   * - reason: Reason why the user is offline:
   *  - 0: The user quits the call.
   *  - 1: The SDK times out and the user drops offline because no data packet is received within a certain period of time. 
   *  If the user quits the call and the message is not passed to the SDK (due to an unreliable channel), the SDK assumes the user dropped offline.
   *  - 2: The client role switched from the host to the audience.
   * Reasons why the user is offline:
   * - Leave the channel: When the user leaves the channel, the user sends a goodbye message. When the message is received, the SDK assumes that the user leaves the channel.
   * - Drop offline: When no data packet of the user or host is received for a certain period of time (20 seconds for the Communication profile, 
   * and more for the Live-broadcast profile), the SDK assumes that the user drops offline. Unreliable network connections may lead to false detections, so we recommend using a signaling system for more reliable offline detection.
  */
  on(evt: 'removeStream', cb: (uid: number, reason: number) => void): this;
  /** Occurs when a remote user's audio stream is muted/unmuted.
   * 
   * The SDK triggers this callback when the remote user stops or resumes sending the audio stream by calling the {@link muteLocalAudioStream} method.
   * - uid: User ID of the remote user.
   * - muted: Whether the remote user's audio stream is muted/unmuted:
   *  - true: Muted.
   *  - false: Unmuted.
   */
  on(evt: 'userMuteAudio', cb: (uid: number, muted: boolean) => void): this;
  /** Occurs when a remote user's video stream playback pauses/resumes.
   * 
   *
   * The SDK triggers this callback when the remote user stops or resumes sending the video stream by calling the {@link muteLocalVideoStream} method.
   * 
   * - uid: User ID of the remote user.
   * - muted: Whether the remote user's video stream playback is paused/resumed:
   *  - true: Paused.
   *  - false: Resumed.
   * 
   * **Note**: This callback returns invalid when the number of users in a channel exceeds 20.
   */
  on(evt: 'userMuteVideo', cb: (uid: number, muted: boolean) => void): this;
  /** Occurs when a specific remote user enables/disables the video module.
   * 
   * The SDK triggers this callback when the remote user enables or disables the video module by calling the {@link enableVideo} or {@link disableVideo} method.
   * - uid: User ID of the remote user.
   * - enabled: Whether the remote user enables/disables the video module:
   *  - true: Enable. The remote user can enter a video session.
   *  - false: Disable. The remote user can only enter a voice session, and cannot send or receive any video stream.
   */
  on(evt: 'userEnableVideo', cb: (uid: number, enabled: boolean) => void): this;
  /** Occurs when a specified remote user enables/disables the local video capturing function.
   * 
   * The SDK triggers this callback when the remote user resumes or stops capturing the video stream by calling the {@link enableLocalVideo} method.
   * - uid: User ID of the remote user.
   * - enabled: Whether the remote user enables/disables the local video capturing function:
   *  - true: Enable. Other users in the channel can see the video of this remote user.
   *  - false: Disable. Other users in the channel can no longer receive the video stream from this remote user, while this remote user can still receive the video streams from other users.
   */
  on(evt: 'userEnableLocalVideo', cb: (uid: number, enabled: boolean) => void): this;
  /** Occurs when the camera turns on and is ready to capture the video. */
  on(evt: 'cameraReady', cb: () => void): this;
  /** Occurs when the video stops playing. */
  on(evt: 'videoStopped', cb: () => void): this;
  /** Occurs when the SDK cannot reconnect to Agora's edge server 10 seconds after its connection to the server is interrupted.
   * The SDK triggers this callback when it cannot connect to the server 10 seconds after calling the {@link joinChannel} method, whether or not it is in the channel.
   */
  on(evt: 'connectionLost', cb: () => void): this;
  // on(evt: 'connectionInterrupted', cb: () => void): this;
  /** ccurs when your connection is banned by the Agora Server.
   * @deprecated Replaced by the connectionStateChanged callback.
   */
  on(evt: 'connectionBanned', cb: () => void): this;
  // on(evt: 'refreshRecordingServiceStatus', cb: () => void): this;
  /** Occurs when the local user receives the data stream from the remote user within five seconds.
   * 
   * The SDK triggers this callback when the local user receives the stream message that the remote user sends by calling the {@link sendStreamMessage} method.
   * - uid: User ID of the remote user sending the message.
   * - streamId: Stream ID.
   * - msg: Pointer to the data received bt the local user.
   * - len: Length of the data in bytes.
   */
  on(evt: 'streamMessage', cb: (
    uid: number,
    streamId: number,
    msg: string,
    len: number
  ) => void): this;
  /** Occurs when the local user does not receive the data stream from the remote user within five seconds.
   * The SDK triggers this callback when the local user fails to receive the stream message that the remote user sends by calling the {@link sendStreamMessage} method.
   * - uid: User ID of the remote user sending the message.
   * - streamId: Stream ID.
   * - err: Error code.
   * - missed: Number of the lost messages.
   * - cached: Number of incoming cached messages when the data stream is interrupted.
   */
  on(evt: 'streamMessageError', cb: (
    uid: number,
    streamId: number,
    code: number,
    missed: number,
    cached: number
  ) => void): this;
  /** Occurs when the media engine call starts. */
  on(evt: 'mediaEngineStartCallSuccess', cb: () => void): this;
  /** Occurs when the token expires.
   * After a token is specified by calling the {@link joinChannel} method, if the SDK losses connection with the Agora server due to network issues, the token may expire after a certain period 
   * of time and a new token may be required to reconnect to the server.
   * 
   * This callback notifies the application to generate a new token. Call the {@link renewToken} method to renew the token
   */
  on(evt: 'requestChannelKey', cb: () => void): this;
  /** Occurs when the engine sends the first local audio frame.
   * -elapsed: Time elapsed (ms) from the local user calling {@link joinChannel} until the 
   * SDK triggers this callback.
   */
  on(evt: 'fristLocalAudioFrame', cb: (elapsed: number) => void): this;
  /** Occurs when the engine receives the first audio frame from a specific remote user.
   * - uid: User ID of the remote user.
   * - elapsed: Time elapsed (ms) from the local user calling {@link joinChannel} until the 
   * SDK triggers this callback.
   */
  on(evt: 'firstRemoteAudioFrame', cb: (uid: number, elapsed: number) => void): this;
  /**
   * Reports which user is the loudest speaker.
   * - uid: User ID of the active speaker. A uid of 0 represents the local user.
   * If the user enables the audio volume indication by calling the {@link enableAudioVolumeIndication} method, this callback returns the uid of the 
   * active speaker detected by the audio volume detection module of the SDK.
   * 
   * **Note**: 
   * - To receive this callback, you need to call the {@link enableAudioVolumeIndication} method.
   * - This callback returns the user ID of the user with the highest voice volume during a period of time, instead of at the moment.
   */
  on(evt: 'activeSpeaker', cb: (uid: number) => void): this;
  /** Occurs when the user role switches in a live broadcast. For example, from a host to an audience or vice versa.
   * 
   * This callback notifies the application of a user role switch when the application calls the {@link setClientRole} method.
   * 
   * - oldRole: Role that the user switches from ClientRoleType.
   * - newRole: Role that the user switches to ClientRoleType.
   */
  on(evt: 'clientRoleChanged', cb: (
    oldRole: ClientRoleType,
    newRole: ClientRoleType
  ) => void): this;
  /** Occurs when the volume of the playback device, microphone, or application changes.
   * - deviceType: Device type. See {@link AgoraRtcEngine.MediaDeviceType MediaDeviceType}.
   * - volume: Volume of the device. The value ranges between 0 and 255.
   * - muted: 
   *  - true: Volume of the device. The value ranges between 0 and 255.
   *  - false: The audio device is not muted.
   */
  on(evt: 'audioDeviceVolumeChanged', cb: (
    deviceType: MediaDeviceType,
    volume: number,
    muted: boolean
  ) => void): this;
  /** Occurs when the user for sharing screen joined the channel.
   * - uid: The User ID.
    */
  on(evt: 'videoSourceJoinedSuccess', cb: (uid: number) => void): this;
  /** Occurs when the token expires. */
  on(evt: 'videoSourceRequestNewToken', cb: () => void): this;
  /** Occurs when the user for sharing screen leaved the channel.
   * - uid: The User ID.
    */
  on(evt: 'videoSourceLeaveChannel', cb: () => void): this;
  /** Occurs when the remote video state changes.
   *  - uid: ID of the user whose video state changes.
   *  - state: State of the remote video: Playing normally or frozen. See {@link AgoraRtcEngine.RemoteVideoState RemoteVideoState}.
   */
  on(evt: 'remoteVideoStateChanged', cb: (uid: number, state: RemoteVideoState) => void): this;
  /** Occurs when the camera focus area changes.
   * - x: x coordinate of the changed camera focus area.
   * - y: y coordinate of the changed camera focus area.
   * - width: Width of the changed camera focus area.
   * - height: Height of the changed camera focus area.
   */
  on(evt: 'cameraFocusAreaChanged', cb: (x: number, y: number, width: number, height: number) => void): this;
  /** Occurs when the camera exposure area changes.
   * - x: x coordinate of the changed camera exposure area.
   * - y: y coordinate of the changed camera exposure area.
   * - width: Width of the changed camera exposure area.
   * - height: Height of the changed camera exposure area.
   */
  on(evt: 'cameraExposureAreaChanged', cb: (x: number, y: number, width: number, height: number) => void): this;
  /** Occurs when the token expires in 30 seconds.
   * 
   * The user becomes offline if the token used in the {@link joinChannel} method expires. The SDK triggers this callback 30 seconds 
   * before the token expires to remind the application to get a new token. Upon receiving this callback, generate a new token 
   * on the server and call the {@link renewToken} method to pass the new token to the SDK.
   * 
   * - token: Pointer to the token that expires in 30 seconds.
   */
  on(evt: 'tokenPrivilegeWillExpire', cb: (token: string) => void): this;
  /** Reports the result of CDN live streaming. 
   * 
   * - url: The RTMP URL address.
   * - error: Error code:
   *  - 0: The publishing succeeds.
   *  - 1: The publishing fails.
   *  - 2: Invalid argument used. For example, you did not call {@link setLiveTranscoding} to configure LiveTranscoding before calling {@link addPublishStreamUrl}.
   *  - 10: The publishing timed out.
   *  - 19: The publishing timed out.
   *  - 130: You cannot publish an encrypted stream.
   */
  on(evt: 'streamPublished', cb: (url: string, error: number) => void): this;
  /** This callback indicates whether you have successfully removed an RTMP stream from the CDN.
   * 
   * Reports the result of calling the {@link removePublishStreamUrl} method.
   * - url: The RTMP URL address.
   */
  on(evt: 'streamUnpublished', cb: (url: string) => void): this;
  /** Occurs when the publisher's transcoding is updated. */
  on(evt: 'transcodingUpdated', cb: () => void): this;
  /** Occurs when a voice or video stream URL address is added to a live broadcast.
   * - url: Pointer to the URL address of the externally injected stream.
   * - uid: User ID.
   * - status: State of the externally injected stream:
   *  - 0: The external video stream imported successfully.
   *  - 1: The external video stream already exists.
   *  - 2: The external video stream to be imported is unauthorized.
   *  - 3: Import external video stream timeout.
   *  - 4: Import external video stream failed.
   *  - 5: The external video stream stopped importing successfully.
   *  - 6: No external video stream is found.
   *  - 7: No external video stream is found.
   *  - 8: Stop importing external video stream timeout.
   *  - 9: Stop importing external video stream failed.
   *  - 10: The external video stream is corrupted.
   *  
   */
  on(evt: 'streamInjectStatus', cb: (url: string, uid: number, status: number) => void): this;
  /** Occurs when the locally published media stream falls back to an audio-only stream due to poor network conditions or switches back 
   * to the video after the network conditions improve.
   * 
   * If you call {@link setLocalPublishFallbackOption} and set option as AUDIO_ONLY(2), the SDK triggers this callback when 
   * the locally published stream falls back to audio-only mode due to poor uplink conditions, or when the audio stream switches back to 
   * the video after the uplink network condition improves.
   * 
   * - isFallbackOrRecover: Whether the locally published stream falls back to audio-only or switches back to the video:
   *  - true: The locally published stream falls back to audio-only due to poor network conditions.
   *  - false: The locally published stream switches back to the video after the network conditions improve.
   */
  on(evt: 'localPublishFallbackToAudioOnly', cb: (isFallbackOrRecover: boolean) => void): this;
  /** Occurs when the remotely subscribed media stream falls back to audio-only due to poor network conditions or switches back to the video 
   * after the network conditions improve.
   * 
   * If you call {@link setRemoteSubscribeFallbackOption} and set option as AUDIO_ONLY(2), the SDK triggers this callback when 
   * the remotely subscribed media stream falls back to audio-only mode due to poor uplink conditions, or when the remotely subscribed media stream switches back to the video
   *  after the uplink network condition improves.
   * - uid: ID of the remote user sending the stream.
   * - isFallbackOrRecover: Whether the remotely subscribed media stream falls back to audio-only or switches back to the video:
   *  - true: The remotely subscribed media stream falls back to audio-only due to poor network conditions.
   *  - false: The remotely subscribed media stream switches back to the video stream after the network conditions improved.
   */
  on(evt: 'remoteSubscribeFallbackToAudioOnly', cb: (
    uid: number,
    isFallbackOrRecover: boolean
  ) => void): this;
  /** Occurs when the microphone is enabled/disabled.
   * - enabled: Whether the microphone is enabled/disabled:
   *  - true: Enabled.
   *  - false: Disabled.
   */
  on(evt: 'microphoneEnabled', cb: (enabled: boolean) => void): this;
  /** Occurs when the connection state between the SDK and the server changes.
   * - state: See {@link AgoraRtcEngine.ConnectionState ConnectionState}.
   * - reason: See {@link AgoraRtcEngine.ConnectionState ConnectionState}.
   */
  on(evt: 'connectionStateChanged', cb: (
    state: ConnectionState,
    reason: ConnectionChangeReason
  ) => void): this;
  /** Occurs when the local user successfully registers a user account by calling the `registerLocalUserAccount` method. 
   * This callback reports the user ID and user account of the local user.
   * - uid: The ID of the local user.
   * - userAccount: The user account of the local user.
   */
  on(evt: 'localUserRegistered', cb: (
    uid: number,
    userAccount: string
  ) => void): this;
  /** Occurs when the SDK gets the user ID and user account of the remote user.
   * 
   * After a remote user joins the channel, the SDK gets the UID and user account of the remote user, caches them in a mapping table 
   * object (UserInfo), and triggers this callback on the local client.
   * - uid: The ID of the remote user.
   * - userInfo: The UserInfo Object  that contains the user ID and user account of the remote user.
   */
  on(evt: 'userInfoUpdated', cb: (
    uid: number,
    userInfo: UserInfo
  ) => void): this;
  on(evt: string, listener: Function): this;

  // on(evt: 'apicallexecuted', cb: (api: string, err: number) => void): this;
  // on(evt: 'warning', cb: (warn: number, msg: string) => void): this;
  // on(evt: 'error', cb: (err: number, msg: string) => void): this;
  // on(evt: 'joinedchannel', cb: (
  //   channel: string, uid: number, elapsed: number
  // ) => void): this;
  // on(evt: 'rejoinedchannel', cb: (
  //   channel: string, uid: number, elapsed: number
  // ) => void): this;
  // on(evt: 'audioquality', cb: (
  //   uid: number, quality: AgoraNetworkQuality, delay: number, lost: number
  // ) => void): this;
  // on(evt: 'audiovolumeindication', cb: (
  //   uid: number,
  //   volume: number,
  //   speakerNumber: number,
  //   totalVolume: number
  // ) => void): this;
  // on(evt: 'leavechannel', cb: () => void): this;
  // on(evt: 'rtcstats', cb: (stats: RtcStats) => void): this;
  // on(evt: 'localvideostats', cb: (stats: LocalVideoStats) => void): this;
  // on(evt: 'remotevideostats', cb: (stats: RemoteVideoStats) => void): this;
  // on(evt: 'audiodevicestatechanged', cb: (
  //   deviceId: string,
  //   deviceType: number,
  //   deviceState: number,
  // ) => void): this;
  // on(evt: 'audiomixingfinished', cb: () => void): this;
  // on(evt: 'remoteaudiomixingbegin', cb: () => void): this;
  // on(evt: 'remoteaudiomixingend', cb: () => void): this;
  // on(evt: 'audioeffectfinished', cb: (soundId: number) => void): this;
  // on(evt: 'videodevicestatechanged', cb: (
  //   deviceId: string,
  //   deviceType: number,
  //   deviceState: number,
  // ) => void): this;
  // on(evt: 'networkquality', cb: (
  //   uid: number,
  //   txquality: AgoraNetworkQuality,
  //   rxquality: AgoraNetworkQuality
  // ) => void): this;
  // on(evt: 'lastmilequality', cb: (quality: AgoraNetworkQuality) => void): this;
  // on(evt: 'firstlocalvideoframe', cb: (
  //   width: number,
  //   height: number,
  //   elapsed: number
  // ) => void): this;
  // on(evt: 'addstream', cb: (
  //   uid: number,
  //   elapsed: number,
  // ) => void): this;
  // on(evt: 'videosizechanged', cb: (
  //   uid: number,
  //   width: number,
  //   height: number,
  //   rotation: number
  // ) => void): this;
  // on(evt: 'firstremotevideoframe', cb: (
  //   uid: number,
  //   width: number,
  //   height: number,
  //   elapsed: number
  // ) => void): this;
  // on(evt: 'userjoined', cb: (uid: number, elapsed: number) => void): this;
  // on(evt: 'removestream', cb: (uid: number, reason: number) => void): this;
  // on(evt: 'usermuteaudio', cb: (uid: number, muted: boolean) => void): this;
  // on(evt: 'usermutevideo', cb: (uid: number, muted: boolean) => void): this;
  // on(evt: 'userenablevideo', cb: (uid: number, enabled: boolean) => void): this;
  // on(evt: 'userenablelocalvideo', cb: (uid: number, enabled: boolean) => void): this;
  // on(evt: 'cameraready', cb: () => void): this;
  // on(evt: 'videostopped', cb: () => void): this;
  // on(evt: 'connectionlost', cb: () => void): this;
  // on(evt: 'connectioninterrupted', cb: () => void): this;
  // on(evt: 'connectionbanned', cb: () => void): this;
  // on(evt: 'refreshrecordingservicestatus', cb: () => void): this;
  // on(evt: 'streammessage', cb: (
  //   uid: number,
  //   streamId: number,
  //   msg: string,
  //   len: number
  // ) => void): this;
  // on(evt: 'streammessageerror', cb: (
  //   uid: number,
  //   streamId: number,
  //   code: number,
  //   missed: number,
  //   cached: number
  // ) => void): this;
  // on(evt: 'mediaenginestartcallsuccess', cb: () => void): this;
  // on(evt: 'requestchannelkey', cb: () => void): this;
  // on(evt: 'fristlocalaudioframe', cb: (elapsed: number) => void): this;
  // on(evt: 'firstremoteaudioframe', cb: (uid: number, elapsed: number) => void): this;
  // on(evt: 'activespeaker', cb: (uid: number) => void): this;
  // on(evt: 'clientrolechanged', cb: (
  //   oldRole: ClientRoleType,
  //   newRole: ClientRoleType
  // ) => void): this;
  // on(evt: 'audiodevicevolumechanged', cb: (
  //   deviceType: MediaDeviceType,
  //   volume: number,
  //   muted: boolean
  // ) => void): this;
  // on(evt: 'videosourcejoinedsuccess', cb: (uid: number) => void): this;
  // on(evt: 'videosourcerequestnewtoken', cb: () => void): this;
  // on(evt: 'videosourceleavechannel', cb: () => void): this;
}

export default AgoraRtcEngine;
