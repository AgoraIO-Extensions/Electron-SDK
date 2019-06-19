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
  VideoEncoderConfiguration
} from './native_type';
import { EventEmitter } from 'events';
const agora = require('../../build/Release/agora_node_ext');


/**
 * AgoraRtcEngine 类。
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
   * Decide whether to use webgl/software rendering
   * @param {1|2|3} mode - 1 for old webgl rendering, 2 for software rendering, 3 for custom rendering
   */
  setRenderMode (mode: 1|2|3 = 1): void {
    this.renderMode = mode;
  }

  /**
   * Use this method to set custom Renderer when set renderMode to 3.
   * customRender should be a class.
   * @param {IRenderer} customRenderer
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

    this.rtcEngine.onEvent('audioquality', function(uid: number, quality: AgoraNetworkQuality, delay: number, lost: number) {
      fire('audioquality', uid, quality, delay, lost);
      fire('audioQuality', uid, quality, delay, lost);
    });

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

    this.rtcEngine.onEvent('audiomixingfinished', function() {
      fire('audiomixingfinished');
      fire('audioMixingFinished');
    });

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

    this.rtcEngine.onEvent('connectioninterrupted', function() {
      fire('connectioninterrupted');
      fire('connectionInterrupted');
    });

    this.rtcEngine.onEvent('connectionbanned', function() {
      fire('connectionbanned');
      fire('connectionBanned');
    });

    this.rtcEngine.onEvent('refreshrecordingservicestatus', function(status: any) {
      fire('refreshrecordingservicestatus', status);
      fire('refreshRecordingServiceStatus', status);
    });

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
   * Size of the view has changed. Refresh zoom level so that video is sized
   * appropriately while waiting for the next video frame to arrive.
   * Calling this can prevent a view discontinutity.
   * @param {string|number} key key for the map that store the renderers, e.g, uid or `videosource` or `local`
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
   * init renderer
   * @param {string|number} key key for the map that store the renderers, e.g, uid or `videosource` or `local`
   * @param {Element} view dom elements to render video
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
   * destroy renderer
   * @param {string|number} key key for the map that store the renders, e.g, uid or `videosource` or `local`
   * @param {function} onFailure err callback for destroyRenderer
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
   * @description 初始化一个 AgoraRtcEngine 实例。
   * @param {string} appid Agora 为 App 开发者签发的 App ID，每个项目都应该有一个独一无二的 App ID
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  initialize(appid: string): number {
    return this.rtcEngine.initialize(appid);
  }

  /**
   * @description return current version and build of sdk
   * @returns {string} version
   */
  getVersion(): string {
    return this.rtcEngine.getVersion();
  }

  /**
   * @description Get error description of the given errorCode
   * @param {number} errorCode error code
   * @returns {string} error description
   */
  getErrorDescription(errorCode: number): string {
    return this.rtcEngine.getErrorDescription(errorCode);
  }

  /**
   * @description 获取当前网络连接状态。
   * @returns {ConnectionState} connect 网络连接状态：
   * - 1：网络连接断开
   * - 2：建立网络连接中
   * - 3：网络已连接
   * - 4：重新建立网络连接中
   * - 5：网络连接失败
   */
  getConnectionState(): ConnectionState {
    return this.rtcEngine.getConnectionState();
  }

  /**
   * @description 加入频道。
   *
   * 该方法让用户加入通话频道，在同一个频道内的用户可以互相通话，多个用户加入同一个频道，可以群聊。使用不同 App ID 的 App 是不能互通的。如果已在通话中，用户必须调用 {@link leaveChannel} 退出当前通话，才能进入下一个频道。
   *
   * 成功调用该方加入频道后，本地会触发 joinedChannel 事件；通信模式下的用户和直播模式下的主播加入频道后，远端会触发 userJoined 事件。
   *
   * 在网络状况不理想的情况下，客户端可能会与 Agora 的服务器失去连接；SDK 会自动尝试重连，重连成功后，本地会触发 rejoinedChannel 事件。
   *
   * @param {string} token 动态密钥：
   * - 安全要求不高：将值设为 null
   * - 安全要求高：将值设为 Token。如果你已经启用的 App 证书，请务必使用 Token
   *
   * **Note**：请确保用于生成 Token 的 App ID 和 {@link initialize} 方法初始化 AgoraRtcEngine 实例时用的是一个 App ID
   * @param {string} channel （必填）标识通话频道的字符，长度在 64 个字节以内的字符串。以下为支持的字符集范围（共 89 个字符）：
   * - 26 个小写英文字母 a-z
   * - 26 个大写英文字母 A-Z
   * - 10 个数字 0-9
   * - 空格
   * - “!”, “#”, “$”, “%”, “&”, “(”, “)”, “+”, “-”, “:”, “;”, “<”, “=”, “.”, “>”, “?”, “@”, “[”, “]”, “^”, “_”, “{”, “}”, “|”, “~”, “,”
   * @param {string} info (非必选项) 开发者需加入的任何附加信息。一般可设置为空字符串，或频道相关信息。该信息不会传递给频道内的其他用户
   * @param {number} uid 用户 ID，32 位无符号整数。建议设置范围：1到 (232-1)，并保证唯一性。如果不指定（即设为 0），SDK 会自动分配一个
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  joinChannel(token: string, channel: string, info: string, uid: number): number {
    return this.rtcEngine.joinChannel(token, channel, info, uid);
  }

  /**
   * @description 离开频道。
   *
   * 离开频道，机挂断或退出通话。当调用 {@link joinChannel} 方法后，必须调用该方法结束通话，否则无法开始下一次通话。
   * 不管当前是否在通话中，都可以调用该方法，没有副作用。该方法会把回话相关的所有资源都释放掉。该方法是异步操作，调用返回时并没有真正退出频道。
   *
   * 在真正退出频道后，本地会触发 leaveChannel 回调；通信模式下的用户和直播模式下的主播离开频道后，远端会触发 removeStream 回调。
   *
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  leaveChannel(): number {
    return this.rtcEngine.leaveChannel();
  }

  /**
   * @description 释放 AgoraRtcEngine 实例。
   *
   * 调用该方法后，用户将无法再使用和回调该 SDK 内的其它方法。如需再次使用，必须重新初始化 {@link initialize} 一个 AgoraRtcEngine 实例。
   *
   * **Note**： 该方法需要在子线程中操作。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  release(): number {
    return this.rtcEngine.release();
  }

  /**
   * @deprecated 该方法已废弃。请改用 {@link setAudioProfile}。
   * @description 设置音频高音质选项。
   *
   * 请在加入频道前调用该方法，对其中的三个模式完成设置。加入频道后调用该方法不生效。
   * @param {boolean} fullband 是否启用全频带编解码器（48 kHz 采样率）：
   * - true：启用全频带编解码器
   * - false：禁用全频带编解码器
   * @param {boolean} stereo 是否启用立体声编解码器：
   * - true：启用立体声编解码器
   * - false：禁用立体声编解码器
   * @param {boolean} fullBitrate 是否启用高码率模式：
   * - true：启用高码率模式
   * - false：禁用高码率模式
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setHighQualityAudioParameters(fullband: boolean, stereo: boolean, fullBitrate: boolean): number {
    return this.rtcEngine.setHighQualityAudioParameters(fullband, stereo, fullBitrate);
  }

  /**
   * @description 订阅远端用户并初始化渲染器。
   *
   * @param {number} uid 想要订阅的远端用户的 ID
   * @param {Element} view 初始化渲染器的 Dom
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  subscribe(uid: number, view: Element): number {
    this.initRender(uid, view);
    return this.rtcEngine.subscribe(uid);
  }

  /**
   * @description 设置本地视图和渲染器。
   * **Note**：请在主线程调用该方法。
   * @param {Element} view 初始化视图的 Dom
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setupLocalVideo(view: Element): number {
    this.initRender('local', view);
    return this.rtcEngine.setupLocalVideo();
  }

  /**
   *
   * @description 设置视频渲染的分辨率。
   *
   * 该方法只对发送给 js 层的视频数据有效。其他端的视频分辨率由 {@link setVideoEncoderConfiguration} 方法决定。
   * @param {number} rendertype 渲染器的类型：
   * - 0：本地渲染器
   * - 1：远端渲染器
   * - 2：设备测试
   * - 3：视频源
   * @param {number} uid 目标用户的 ID
   * @param {number} width 想要发送的视频宽度
   * @param {number} height 想要发送的视频高度
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
   * @description force set renderer fps globally. This is mainly used to improve the performance for js rendering
   * once set, data will be forced to be sent with this fps. This can reduce cpu frequency of js rendering.
   * This applies to ALL views except ones added to High FPS stream.
   * @param {number} fps frame/s
   */
  setVideoRenderFPS(fps: number) {
    this.rtcEngine.setFPS(fps);
  }

  /**
   * @description force set renderer fps for high stream. High stream here MEANS uid streams which has been
   * added to high ones by calling addVideoRenderToHighFPS, note this has nothing to do with dual stream
   * high stream. This is often used when we want to set low fps for most of views, but high fps for one
   * or two special views, e.g. screenshare
   * @param {number} fps frame/s
   */
  setVideoRenderHighFPS(fps: number) {
    this.rtcEngine.setHighFPS(fps);
  }

  /**
   * @description add stream to high fps stream by uid. fps of streams added to high fps stream will be
   * controlled by setVideoRenderHighFPS
   * @param {number} uid stream uid
   */
  addVideoRenderToHighFPS(uid: number) {
    this.rtcEngine.addToHighVideo(uid);
  }

  /**
   * @description remove stream from high fps stream by uid. fps of streams removed from high fps stream
   * will be controlled by setVideoRenderFPS
   * @param {number} uid stream uid
   */
  remoteVideoRenderFromHighFPS(uid: number) {
    this.rtcEngine.removeFromHighVideo(uid);
  }

  /**
   * @description 设置视窗内容显示模式。
   *
   * @param {number | 'local' | 'videosource'} uid 用户 ID，表示设置的是哪个用户的流
   * @param {0|1} mode 视窗内容显示模式：
   * - 0：优先保证视窗被填满。视频尺寸等比缩放，直至整个视窗被视频填满。如果视频长宽与显示窗口不同，多出的视频将被截掉
   * - 1： 优先保证视频内容全部显示。视频尺寸等比缩放，直至视频窗口的一边与视窗边框对齐。如果视频长宽与显示窗口不同，视窗上未被填满的区域将被涂黑
   * @returns {number}
   * - 0：方法调用成功
   * - -1：方法调用失败
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
   * @description 更新 Token。
   *
   * 如果启用了 Token 机制，过一段时间后使用的 Token 会失效。当：
   * - warning 回调报告错误码 ERR_TOKEN_EXPIRED(109)，或
   * - requestChannelKey 回调报告错误码 ERR_TOKEN_EXPIRED(109)，或
   * - 用户收到 tokenPrivilegeWillExpire 回调时，
   * App 应重新获取 Token，然后调用该 API 更新 Token，否则 SDK 无法和服务器建立连接。
   * @param {string} newtoken 需要更新的新 Token
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  renewToken(newtoken: string): number {
    return this.rtcEngine.renewToken(newtoken);
  }

  /**
   * @description 设置频道模式。
   *
   * Agora 会根据 App 的使用场景进行不同的优化。
   *
   * **Note**：
   * - 该方法必须在 {@link joinChannel} 方法之前调用
   * - 相同频道内的所有用户必须使用相同的频道模式
   *
   * @param {number} profile 频道模式：
   * - 0：通信（默认）
   * - 1：直播
   * - 2：游戏
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setChannelProfile(profile: number): number {
    return this.rtcEngine.setChannelProfile(profile);
  }

  /**
   * @description 设置直播模式下的用户角色。
   *
   * 在加入频道前，用户需要通过本方法设置观众（默认）或主播模式。在加入频道后，用户可以通过本方法切换用户模式。
   *
   * 直播模式下，如果你在加入频道后调用该方法切换用户角色，调用成功后，本地会触发 clientRoleChanged 事件；远端会触发 userJoined 事件。
   * @param {ClientRoleType} role 用户角色：
   * - 1：主播
   * - 2：观众
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setClientRole(role: ClientRoleType): number {
    return this.rtcEngine.setClientRole(role);
  }

  /**
   * @deprecated 该方法已废弃。请改用 {@link startEchoTestWithInterval}。
   * @description 开始语音通话回路测试。
   * 该方法启动语音通话测试，目的是测试系统的音频设备（耳麦、扬声器等）和网络连接是否正常。
   * 在测试过程中，用户先说一段话，在 10 秒后，声音会回放出来。如果 10 秒后用户能正常听到自己刚才说的话，
   * 就表示系统音频设备和网络连接都是正常的。
   * **Note**：
   * - 请在加入频道 {@link joinChannel} 前调用该方法
   * - 调用该方法后必须调用 {@link stopEchoTest} 已结束测试，否则不能进行下一次回声测试，也不能调用 {@link joinChannel} 进行通话。
   * - 直播模式下，该方法仅能由用户角色为主播的用户调用
   *
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  startEchoTest(): number {
    return this.rtcEngine.startEchoTest();
  }

  /**
   * @description 停止语音通话回路测试。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  stopEchoTest(): number {
    return this.rtcEngine.stopEchoTest();
  }

  /**
   * @description 开始语音通话回路测试。
   *
   * 该方法启动语音通话测试，目的是测试系统的音频设备（耳麦、扬声器等）和网络连接是否正常。
   * 在测试过程中，用户先说一段话，声音会在设置的时间间隔（单位为秒）后回放出来。如果用户能正常听到自己刚才说的话，
   * 就表示系统音频设备和网络连接都是正常的。
   * **Note**：
   * - 请在加入频道 {@link joinChannel} 前调用该方法
   * - 调用该方法后必须调用 {@link stopEchoTest} 已结束测试，否则不能进行下一次回声测试，也不能调用 {@link joinChannel} 进行通话。
   * - 直播模式下，该方法仅能由用户角色为主播的用户调用
   * @param interval 设置返回语音通话回路测试结果的时间间隔，取值范围为 [2, 10]，单位为秒，默认为 10 秒
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  startEchoTestWithInterval(interval: number): number {
    return this.rtcEngine.startEchoTestWithInterval(interval);
  }

  /**
   * @description 启用网络测试。
   *
   * 该方法启用网络连接质量测试，用于检测用户网络接入质量。默认该功能为关闭状态。该方法主要用于以下两种场景：
   * - 用户加入频道前，可以调用该方法判断和预测目前的上行网络质量是否足够好。
   * - 直播模式下，当用户角色想由观众切换为主播时，可以调用该方法判断和预测目前的上行网络质量是否足够好。
   *
   * 启用该方法会消耗一定的网络流量，影响通话质量。在收到 lastmileQuality 回调后，需调用 {@link stopEchoTest}
   * 方法停止测试，再加入频道或切换用户角色。
   *
   * **Note**：
   * - 该方法请勿与 {@link startLastmileProbeTest} 方法同时使用
   * - 调用该方法后，在收到 lastmileQuality 回调之前请不要调用其他方法，否则可能会由于 API 操作过于频繁导致此回调无法执行
   * - 直播模式下，主播在加入频道后，请勿调用该方法
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  enableLastmileTest(): number {
    return this.rtcEngine.enableLastmileTest();
  }

  /**
   * @description 关闭网络测试。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  disableLastmileTest(): number {
    return this.rtcEngine.disableLastmileTest();
  }

  /**
   * @description 开始通话前网络质量探测。
   *
   * 启用该方法后，SDK 会向用户反馈上下行网络的带宽、丢包、网络抖动和往返时延数据。SDK 会一次返回如下两个回调：
   * - lastmileQuality：视网络情况约 2 秒内返回。该回调通过打分反馈上下行网络质量，更贴近用户的主观感受。
   * - lastmileProbeResult：视网络情况约 30 秒内返回。该回调通过客观数据反馈上下行网络质量，因此更客观。
   *
   * 该方法主要用于以下两种场景：
   * - 用户加入频道前，可以调用该方法判断和预测目前的上行网络质量是否足够好。
   * - 直播模式下，当用户角色想由观众切换为主播时，可以调用该方法判断和预测目前的上行网络质量是否足够好。
   *
   * **Note**：
   * - 该方法会消耗一定的网络流量，影响通话质量，因此我们建议不要同时使用该方法和 {@link enableLastmileTest}
   * - 调用该方法后，在收到 lastmileQuality 和 lastmileProbeResult 回调之前请不用调用其他方法，否则可能会由于 API 操作过于频繁导致此方法无法执行
   * - 直播模式下，如果本地用户为主播，请勿在加入频道后调用该方法
   *
   * @param {LastmileProbeConfig} config
   */
  startLastmileProbeTest(config: LastmileProbeConfig): number {
    return this.rtcEngine.startLastmileProbeTest(config);
  }

  /**
   * @description 停止通话前网络质量探测。
   *
   * @return
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  stopLastmileProbeTest(): number {
    return this.rtcEngine.stopLastmileProbeTest();
  }

  /**
   * @description 启用视频模块。
   *
   * 该方法用于打开视频模式。可以在加入频道前或者通话中调用，在加入频道前调用，则自动开启视频模式，在通话中调用则由音频模式切换为视频模式。
   * 调用 {@link disableVideo} 方法可关闭视频模式。
   *
   * 成功调用该方法后，远端会触发 userEnableVideo(true) 回调。
   *
   * **Note**：
   * - 该方法设置的是内部引擎为开启状态，在频道内和频道外均可调用，且在 {@link leaveChannel} 后仍然有效。
   * - 该方法重置整个引擎，响应速度较慢，因此 Agora 建议使用如下方法来控制视频模块：
   *
   *   - {@link enableLocalVideo}：是否启动摄像头采集并创建本地视频流
   *   - {@link muteLocalVideoStream}：是否发布本地视频流
   *   - {@link muteRemoteVideoStream}：是否接收并播放远端视频流
   *   - {@link muteAllRemoteVideoStreams}：是否接收并播放所有远端视频流
   *
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  enableVideo(): number {
    return this.rtcEngine.enableVideo();
  }

  /**
   * @description 关闭视频模块。
   *
   * 该方法用于关闭视频。可以在加入频道前或者通话中调用，在加入频道前调用，则自动开启纯音频模式，在通话中调用则由视频模式切换为纯音频频模式。
   * 调用 {@link enableVideo} 方法可开启视频模式。
   *
   * 成功掉调用该方法后，远端会触发 userEnableVideo(fasle) 回调。
   *
   * **Note**：
   * - 该方法设置的是内部引擎为开启状态，在频道内和频道外均可调用，且在 {@link leaveChannel} 后仍然有效。
   * - 该方法重置整个引擎，响应速度较慢，因此 Agora 建议使用如下方法来控制视频模块：
   *
   *   - {@link enableLocalVideo}：是否启动摄像头采集并创建本地视频流
   *   - {@link muteLocalVideoStream}：是否发布本地视频流
   *   - {@link muteRemoteVideoStream}：是否接收并播放远端视频流
   *   - {@link muteAllRemoteVideoStreams}：是否接收并播放所有远端视频流
   *
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  disableVideo(): number {
    return this.rtcEngine.disableVideo();
  }

  /**
   * @description 开启视频预览。
   *
   * 该方法用于在进入频道前启动本地视频预览。调用该 API 前，必须：
   * - 调用 {@link enableVideo} 方法开启视频功能
   * - 调用 {@link setupLocalVideo} 方法设置预览敞口及属性
   *
   * **Note**：
   * - 本地预览默认开启镜像功能
   * - 使用该方法启用了本地视频预览后，如果直接调用 {@link leaveChannel} 退出频道，并不会关闭预览。如需关闭预览，请调用 {@link stopPreview}
   *
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  startPreview(): number {
    return this.rtcEngine.startPreview();
  }

  /**
   * @description 停止视频预览。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  stopPreview(): number {
    return this.rtcEngine.stopPreview();
  }

  /**
   * @deprecated 该方法已废弃。请改用 {@link setVideoEncoderConfiguration}。
   * @description 设置视频属性。
   *
   * @param {VIDEO_PROFILE_TYPE} profile
   * @param {boolean} swapWidthAndHeight 是否交换宽高值：
   * - true：交换
   * - false：不交换（默认）
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setVideoProfile(profile: VIDEO_PROFILE_TYPE, swapWidthAndHeight: boolean = false): number {
    return this.rtcEngine.setVideoProfile(profile, swapWidthAndHeight);
  }

  /**
   * @description 设置摄像头的采集偏好。
   *
   * 一般的视频通话或直播中，默认由 SDK 自动控制摄像头的输出参数。在如下特殊场景中，默认的参数通常无法满足需求，或可能引起设备性能问题，我们推荐调用该接口设置摄像头的采集偏好：
   * - 使用裸数据自采集接口时，如果 SDK 输出的分辨率和帧率高于 {@link setVideoEncoderConfiguration} 中指定的参数，在后续处理视频帧的时候，比如美颜功能时，
   会需要更高的 CPU 及内存，容易导致性能问题。在这种情况下，我们推荐将摄像头采集偏好设置为 CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE(1)，避免性能问题。
   * - 如果没有本地预览功能或者对预览质量没有要求，我们推荐将采集偏好设置为 CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE(1)，以优化 CPU 和内存的资源分配
   * - 如果用户希望本地预览视频比实际编码发送的视频清晰，可以将采集偏好设置为 CAPTURER_OUTPUT_PREFERENCE_PREVIEW(2)
   *
   * **Note**：请在启动摄像头之前调用该方法，如 {@link joinChannel}、{@link enableVideo} 或者 {@link enableLocalVideo}。
   * @param {CameraCapturerConfiguration} config
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setCameraCapturerConfiguration(config: CameraCapturerConfiguration) {
    return this.rtcEngine.setCameraCapturerConfiguration(config);
  }

  /**
   * @description 设置视频编码属性。
   *
   * 该方法设置视频编码属性。每个属性对应一套视频参数，如分辨率、帧率、码率、视频方向等。 所有设置的参数均为理想情况下的最大值。当视频引擎因网络环境等原因无法达到设置的分辨率、帧率或码率的最大值时，会取最接近最大值的那个值。
   *
   * 如果用户加入频道后不需要重新设置视频编码属性，则 Agora 建议在 {@link enableVideo} 前调用该方法，可以加快首帧出图的时间。
   *
   * @param {VideoEncoderConfiguration} config
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
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
   * @description 开启或关闭本地美颜功能，并设置美颜效果选项。
   *
   * @param {boolean} enable 是否开启美颜功能：
   * - true：开启
   * - false：（默认）关闭
   *
   * @param {Object} options 设置美颜选项，包含如下字段：
   * @param {number} options.lighteningContrastLevel 亮度明暗对比度：0 为低对比度，1 为正常（默认），2 为高对比度
   * @param {number} options.lighteningLevel 亮度，取值范围为 [0.0, 1.0]，其中 0.0 表示原始亮度。可用来实现美白等视觉效果。
   * @param {number} options.smoothnessLevel 平滑度，取值范围为 [0.0, 1.0]，其中 0.0 表示原始平滑等级。可用来实现祛痘、磨皮等视觉效果。
   * @param {number} options.rednessLevel 红色度，取值范围为 [0.0, 1.0]，其中 0.0 表示原始红色度。可用来实现红润肤色等视觉效果。
   *
   * @return {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
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
   * @description 设置用户媒体流的优先级。
   *
   * 如果将某个用户的优先级设为高，那么发给这个用户的音视频流的优先级就会高于其他用户。
   * 该方法可以与 {@link setRemoteSubscribeFallbackOption} 搭配使用。如果开启了订阅流回退选项，弱网下 SDK 会优先保证高优先级用户收到的流的质量。
   *
   * **Note**：
   * - 该方法仅适用于直播模式。
   * - 目前 Agora SDK 仅允许将一名远端用户设为高优先级。
   *
   * @param {number} uid 远端用户的 ID
   * @param {Priority} priority
   *
   * @return {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setRemoteUserPriority(uid: number, priority: Priority) {
    return this.rtcEngine.setRemoteUserPriority(uid, priority);
  }

  /**
   * @description 启用音频模块（默认为开启状态）。
   *
   * **Note**：
   * - 该方法设置的是内部引擎为开启状态，在频道内和频道外均可调用，且在 {@link leaveChannel} 后仍然有效。
   * - 该方法重置整个引擎，响应速度较慢，因此 Agora 建议使用如下方法来控制音频模块：
   *
   *   - {@link enableLocalAudio}：是否启动麦克风采集并创建本地音频流
   *   - {@link muteLocalAudioStream}：是否发布本地音频流
   *   - {@link muteRemoteAudioStream}：是否接收并播放远端音频流
   *   - {@link muteAllRemoteAudioStreams}：是否接收并播放所有远端音频流
   *
   * @return {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  enableAudio(): number {
    return this.rtcEngine.enableAudio();
  }

  /**
   * @description 关闭音频模块。
   *
   * **Note**：
   * - 该方法设置的是内部引擎为开启状态，在频道内和频道外均可调用，且在 {@link leaveChannel} 后仍然有效。
   * - 该方法重置整个引擎，响应速度较慢，因此 Agora 建议使用如下方法来控制音频模块：
   *
   *   - {@link enableLocalAudio}：是否启动麦克风采集并创建本地音频流
   *   - {@link muteLocalAudioStream}：是否发布本地音频流
   *   - {@link muteRemoteAudioStream}：是否接收并播放远端音频流
   *   - {@link muteAllRemoteAudioStreams}：是否接收并播放所有远端音频流
   *
   * @return {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  disableAudio(): number {
    return this.rtcEngine.disableAudio();
  }

  /**
   * @description 设置音频编码配置。
   *
   * **Note**：该方法需要在 {@link joinChannel} 之前调用，否则不生效。
   *
   * @param {number} profile 设置采样率、码率、编码模式和声道数：
   * - 0：默认设置。通信模式下，为 1：Speech standard；直播模式下，为 2：Music standard
   * - 1：Speech standard，指定 32 KHz 采样率，语音编码, 单声道，编码码率最大值为 18 Kbps
   * - 2：Music standard，指定 48 KHz 采样率，音乐编码, 单声道，编码码率最大值为 48 Kbps
   * - 3：Music standard stereo，指定 48 KHz采样率，音乐编码, 双声道，编码码率最大值为 56 Kbps
   * - 4：Music high quality，指定 48 KHz 采样率，音乐编码, 单声道，编码码率最大值为 128 Kbps
   * - 5：Music high quality stereo，指定 48 KHz 采样率，音乐编码, 双声道，编码码率最大值为 192 Kbps
   *
   * @param {number} scenario 设置音频应用场景：
   * - 0：默认的音频应用场景
   * - 1：Chatroom entertainment，娱乐应用，需要频繁上下麦的场景
   * - 2：Education，教育应用，流畅度和稳定性优先
   * - 3：Game streaming，游戏直播应用，需要外放游戏音效也直播出去的场景
   * - 4：Showroom，秀场应用，音质优先和更好的专业外设支持
   * - 5：Chatroom gaming，游戏开黑
   *
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setAudioProfile(profile: 0|1|2|3|4|5, scenario: 0|1|2|3|4|5): number {
    return this.rtcEngine.setAudioProfile(profile, scenario);
  }

  /**
   * @deprecated 该方法已废弃。请改用 {@link setCameraCapturerConfiguration} 和 {@link setVideoEncoderConfiguration}。
   *
   * @description 设置视频偏好选项。
   * **Note**：该方法仅适用于直播模式。
   * @param {boolean} preferFrameRateOverImageQuality 视频偏好选项：
   * - true：视频画质和流畅度里，优先保证流畅度
   * - false：视频画质和流畅度里，优先保证画质（默认）
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setVideoQualityParameters(preferFrameRateOverImageQuality: boolean): number {
    return this.rtcEngine.setVideoQualityParameters(preferFrameRateOverImageQuality);
  }

  /**
   * @description 启用内置加密，并设置数据加密密码。
   *
   * 如需启用加密，请在 {@link joinChannel} 前调用该方法，并设置加密的密码。
   * 同一频道内的所有用户应设置相同的密码。当用户离开频道时，该频道的密码会自动清除。如果未指定密码或将密码设置为空，则无法激活加密功能。
   * **Note**：为保证最佳传输效果，请确保加密后的数据大小不超过原始数据大小 + 16 字节。16 字节是 AES 通用加密模式下最大填充块大小。
   *
   * @param {string} secret 加密密码
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setEncryptionSecret(secret: string): number {
    return this.rtcEngine.setEncryptionSecret(secret);
  }

  /**
   * @description 停止/恢复发送本地音频流。
   *
   * 该方法用于允许/禁止往网络发送本地音频流。
   * 成功调用该方法后，远端会触发 userMuteAudio 回调。
   * @param {boolean} mute
   * - true：停止发送本地音频流
   * - false：继续发送本地音频流（默认）
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  muteLocalAudioStream(mute: boolean): number {
    return this.rtcEngine.muteLocalAudioStream(mute);
  }

  /**
   * @description 停止/恢复接收所有音频流。
   *
   * @param {boolean} mute
   * - true：停止接收所有音频流
   * - false：继续接收所有音频流（默认）
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  muteAllRemoteAudioStreams(mute: boolean): number {
    return this.rtcEngine.muteAllRemoteAudioStreams(mute);
  }

  /**
   * @description 设置是否默认接收音频流。
   *
   * 该方法在加入频道前后都可调用。如果在加入频道后调用 setDefaultMuteAllRemoteAudioStreams(true)，会接收不到后面加入频道的用户的音频流。
   *
   * @param {boolean} mute
   * - true：默认不接收所有音频流
   * - false：默认接收所有音频流（默认）
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setDefaultMuteAllRemoteAudioStreams(mute: boolean): number {
    return this.rtcEngine.setDefaultMuteAllRemoteAudioStreams(mute);
  }

  /**
   * @description 停止/恢复接收指定音频流。
   *
   * @param {number} uid 指定的用户 ID
   * @param {boolean} mute
   * - true：停止接收指定用户的音频流
   * - false：继续接收指定用户的音频流
   *
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  muteRemoteAudioStream(uid: number, mute: boolean): number {
    return this.rtcEngine.muteRemoteAudioStream(uid, mute);
  }

  /**
   * @description 停止/恢复发送本地视频流。
   *
   * 成功调用该方法后，远端会触发 userMuteVideo 回调。
   * **Note**：调用该方法时，SDK 不再发送本地视频流，但摄像头仍然处于工作状态。
   * @param {boolean} mute
   * - true：停止发送本地视频流
   * - false：发动本地视频流（默认）
   *
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  muteLocalVideoStream(mute: boolean): number {
    return this.rtcEngine.muteLocalVideoStream(mute);
  }

  /**
   * @description 开/关本地视频采集。
   *
   * 该方法禁用/启用本地视频功能。enableLocalVideo(false) 适用于只看不发的视频场景。
   * 成功调用该方法后，远端会触发 userEnableLocalVideo 回调。
   * **Note**：
   * - 请在 {@link enableVideo} 后调用该方法，否则该方法可能无法正常使用。
   * - 该方法设置的是内部引擎为启用或禁用状态，在 {@link leaveChannel} 后仍然有效。
   *
   * @param {boolean} enable
   * - true：开启本地视频采集和渲染（默认）
   * - false：关闭本地视频采集和渲染。关闭后，远端用户会接收不到本地用户的视频流；但本地用户依然可以接收远端用户的视频流
   *
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  enableLocalVideo(enable: boolean): number {
    return this.rtcEngine.enableLocalVideo(enable);
  }

  /**
   * @description 停止/恢复接收所有视频流。
   *
   * @param {boolean} mute
   * - true：停止接收所有视频流
   * - false：继续接收所有视频流（默认）
   *
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  muteAllRemoteVideoStreams(mute: boolean): number {
    return this.rtcEngine.muteAllRemoteVideoStreams(mute);
  }

  /**
   * @description 设置是否默认接收视频流。
   *
   * @param {boolean} mute
   * - true：默认不接收任何视频流
   * - false：默认继续接收所有视频流（默认）
   *
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setDefaultMuteAllRemoteVideoStreams(mute: boolean): number {
    return this.rtcEngine.setDefaultMuteAllRemoteVideoStreams(mute);
  }

  /**
   * @description 启用说话者音量提示。
   *
   * 该方法允许 SDK 定期向 App 反馈当前谁在说话以及说话者的音量。启用该方法后，无论频道内是否有人说话，都会在说话声音音量提示回调
   groupAudioVolumeIndication 回调中按设置的间隔时间返回音量提示。
   *
   * @param {number} interval 指定音量提示的时间间隔：
   * - <= 10：禁用音量提示功能
   * - > 10：返回音量提示的间隔，单位为毫秒。建议设置到大于 200 毫秒
   * @param {number} smooth 平滑系数，指定音量提示的灵敏度。取值范围为 [0, 10]，建议值为 3，数字越大，波动越灵敏；数字越小，波动越平滑
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  enableAudioVolumeIndication(interval: number, smooth: number): number {
    return this.rtcEngine.enableAudioVolumeIndication(interval, smooth);
  }

  /**
   * @description 停止/恢复接收指定视频流。
   *
   * @param {number} uid 指定用户的 ID
   * @param {boolean} mute
   * - true：停止接收指定用户的视频流
   * - false：继续接收指定用户的视频流（默认）
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  muteRemoteVideoStream(uid: number, mute: boolean): number {
    return this.rtcEngine.muteRemoteVideoStream(uid, mute);
  }

  /**
   * @description 设置耳返音量。
   *
   * @param {number} volume 耳返的音量，取值范围为 [0, 100]，默认值为 100
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setInEarMonitoringVolume(volume: number): number {
    return this.rtcEngine.setInEarMonitoringVolume(volume);
  }

  /**
   * @deprecated 该方法已废弃。请改用 {@link disableAudio}。
   * @description 禁用频道内的音频功能。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  pauseAudio() {
    return this.rtcEngine.pauseAudio();
  }

  /**
   * @deprecated 该方法已弃用。请改用 {@link enableAudio}。
   * @description 启用频道内的音频功能。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  resumeAudio() {
    return this.rtcEngine.resumeAudio();
  }

  /**
   * @description 设置日志文件。
   * 设置 SDK 的输出 log 文件。SDK 运行时产生的所有 log 将写入该文件。App 必须保证指定的目录存在而且可写。
   * **Note**：如需调用本方法，请在调用 {@link initialize} 方法初始化 AgoraRtcEngine 对象后立即调用，否则可能造成输出日志不完整。
   * @param {string} filepath 日志文件的完整路径
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setLogFile(filepath: string): number {
    return this.rtcEngine.setLogFile(filepath);
  }

  /**
   * @description 设置 SDK 输出的日志文件大小，单位为 KB。
   *
   * Agora SDK 设有 2 个日志文件，每个文件默认大小为 512 KB。如果你将 `size` 设置为 1024 KB，SDK 会最多输出 2 M 的日志文件。如果日志文件超出设置值，新的日志会覆盖之前的日志。
   * @param {number} size 指定 SDK 输出日志文件的内存大小，单位为 KB
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
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
   * @description 设置日志文件过滤器。
   *
   * 该方法设置 SDK 的输出日志过滤等级。不同的过滤等级可以单独或组合使用。
   * 日志级别顺序依次为 OFF、CRITICAL、ERROR、WARNING、INFO 和 DEBUG。选择一个级别，你就可以看到在该级别之前所有级别的日志信息。
   * 例如，你选择 WARNING 级别，就可以看到在 CRITICAL、ERROR 和 WARNING 级别上的所有日志信息。
   * @param {number} filter 设置过滤器等级：
   * - LOG_FILTER_OFF = 0：不输出任何日志
   * - LOG_FILTER_DEBUG = 0x80f：输出所有的 API 日志。如果你想获取最完整的日志，可将日志级别设为该等级
   * - LOG_FILTER_INFO = 0x0f：输出 CRITICAL、ERROR、WARNING、INFO 级别的日志。我们推荐你将日志级别设为该等级
   * - LOG_FILTER_WARNING = 0x0e：仅输出 CRITICAL、ERROR、WARNING 级别的日志
   * - LOG_FILTER_ERROR = 0x0c：仅输出 CRITICAL、ERROR 级别的日志
   * - LOG_FILTER_CRITICAL = 0x08：仅输出 CRITICAL 级别的日志
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setLogFilter(filter: number): number {
    return this.rtcEngine.setLogFilter(filter);
  }

  /**
   * @description 开/关视频双流模式。
   * 该方法设置单流（默认）或者双流模式。发送端开启双流模式后，接收端可以选择接收大流还是小流。其中，大流指高分辨率、高码率的视频流，小流指低分辨率、低码率的视频流。
   * @param {boolean} enable 指定双流或者单流模式：
   * - true：开启双流
   * - false：不开启双流（默认）
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  enableDualStreamMode(enable: boolean): number {
    return this.rtcEngine.enableDualStreamMode(enable);
  }

  /**
   * @description 设置订阅的视频流类型。
   *
   * 如果发送端选择发送视频双流（大流或小流），接收端可以选择接收大流还是小流。其中大流可以理解为高分辨率高码率的视频流，小流则是低分辨率低码率的视频流。
   * 该方法可以根据视频窗口的大小动态调整对应视频流的大小，以节约带宽和计算资源。
   * - 如果发送端用户已调用 {@link enableDualStreamMode} 启用了双流模式，SDK 默认接收大流。如需使用小流，可调用本方法进行切换。
   * - 如果发送端用户未启用双流模式，SDK 默认接收大流。
   *
   * 视频小流默认的宽高比和视频大流的宽高比一致。根据当前大流的宽高比，系统会自动分配小流的分辨率、帧率及码率。
   *
   * 调用本方法的执行结果将在 onApiCallExecuted 中返回。
   * @param {number} uid 用户 ID
   * @param {StreamType} streamType 视频流类型：
   * - 0：视频大流，即高分辨率、高码率的视频流
   * - 1：视频小流，即低分辨率、低码率的视频流
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setRemoteVideoStreamType(uid: number, streamType: StreamType): number {
    return this.rtcEngine.setRemoteVideoStreamType(uid, streamType);
  }

  /**
   * @description 设置默认订阅的视频流类型。
   *
   * @param {StreamType} streamType 设置视频流的类型：
   * - 0：视频大流，即高分辨、高码率的视频流
   * - 1：视频小流，即低分辨、低码率的视频流
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setRemoteDefaultVideoStreamType(streamType: StreamType): number {
    return this.rtcEngine.setRemoteDefaultVideoStreamType(streamType);
  }

  /**
   * @description 打开与 Web SDK 的互通（仅在直播下适用）。
   *
   * 该方法打开或关闭与 Agora Web SDK 的互通。该方法仅在直播模式下适用，通信模式下默认互通是打开的。
   * @param {boolean} enable 是否打开与 Agora Web SDK 的互通：
   * - true：打开互通
   * - false：关闭互通（默认）
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  enableWebSdkInteroperability(enable: boolean): number {
    return this.rtcEngine.enableWebSdkInteroperability(enable);
  }

  /**
   * @description 设置本地视频镜像。
   *
   * 该方法设置本地视频镜像，须在开启本地预览前设置。如果在开启预览后设置，需要重新开启预览才能生效。
   * @param {number} mirrortype 设置本地视频镜像模式：
   * - 0：默认镜像模式，即由 SDK 决定镜像模式
   * - 1：启用镜像模式
   * - 2：关闭镜像模式
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setLocalVideoMirrorMode(mirrortype: 0|1|2): number {
    return this.rtcEngine.setLocalVideoMirrorMode(mirrortype);
  }

  /**
   * @description 设置本地语音音调。
   *
   * @param {number} pitch 语音频率。可以在 [0.5, 2.0] 范围内设置。取值越小，则音调越低。默认值为 1.0，表示不需要修改音调
   * @returns {number}
   * - 0：方法调用成功
   * - -1：方法调用失败
   */
  setLocalVoicePitch(pitch: number): number {
    return this.rtcEngine.setLocalVoicePitch(pitch);
  }

  /**
   * @description 设置本地语音音效均衡。
   * @param {number} bandFrequency 频谱子带索引，取值范围是 [0-9]，分别代表 10 个频带，对应的中心频率是 [31，62，125，250，500，1k，2k，4k，8k，16k] Hz
   * @param {number} bandGain 每个 band 的增益，单位是 dB，每一个值的范围是 [-15，15]，默认值为 0
   * @returns {number}
   * - 0：方法调用成功
   * - -1：方法调用失败
   */
  setLocalVoiceEqualization(bandFrequency: number, bandGain: number): number {
    return this.rtcEngine.setLocalVoiceEqualization(bandFrequency, bandGain);
  }

  /**
   * @description 设置本地音效混响。
   *
   * **Note**： Agora SDK 在 v2.4.0 版本中提供一个使用更为简便的接口 setLocalVoiceReverbPreset，该
     方法通过一系列内置参数的调整，直接实现流行、R&B、摇滚、嘻哈等预置的混响效果。详见 {@link setLocalVoiceReverbPreset}。
   * @param {number} reverbKey 混响音效 Key。该方法共有 5 个混响音效 Key：
   * - AUDIO_REVERB_DRY_LEVEL = 0：原始声音强度，即所谓的 dry signal，取值范围 [-20, 10]，单位为 dB
   * - AUDIO_REVERB_WET_LEVEL = 1：早期反射信号强度，即所谓的 wet signal，取值范围 [-20, 10]，单位为 dB
   * - AUDIO_REVERB_ROOM_SIZE = 2：所需混响效果的房间尺寸，一般房间越大，混响越强，取值范围 [0, 100]，单位为 dB
   * - AUDIO_REVERB_WET_DELAY = 3：Wet signal 的初始延迟长度，取值范围 [0, 200]，单位为毫秒
   * - AUDIO_REVERB_STRENGTH = 4：混响持续的强度，取值范围为 [0, 100]
   * @param {number} value 各混响音效 Key 所对应的值
   * @returns {number}
   * - 0：方法调用成功
   * - -1：方法调用失败
   */
  setLocalVoiceReverb(reverbKey: number, value: number): number {
    return this.rtcEngine.setLocalVoiceReverb(reverbKey, value);
  }

  /**
   * @description 设置本地语音变声。
   * **Note**：该方法不能与 {@link setLocalVoiceReverbPreset} 方法同时使用，否则先调用的方法会不生效。
   * @param {VoiceChangerPreset} preset 设置本地语音的变声效果选项
   */
  setLocalVoiceChanger(preset: VoiceChangerPreset): number {
    return this.rtcEngine.setLocalVoiceChanger(preset);
  }


  /**
   * @description 设置预设的本地语音混响效果选项。
   * **Note**：
   * - 该方法不能与 {@link setLocalVoiceReverbPreset} 方法同时使用。
   * - 该方法不能与 {@link setLocalVoiceChanger} 方法同时使用，否则先调的方法会不生效。
   * @param {AudioReverbPreset} preset 预设的本地语音混响效果选项
   */
  setLocalVoiceReverbPreset(preset: AudioReverbPreset) {
    return this.rtcEngine.setLocalVoiceReverbPreset(preset);
  }


  /**
   * @description 设置弱网条件下发布的音视频流回退选项。
   *
   * 网络不理想的环境下，直播音视频的质量都会下降。使用该接口并将 option 设置为 STREAM_FALLBACK_OPTION_AUDIO_ONLY后，SDK 会：
   * - 在上行弱网且音视频质量严重受影响时，自动关断视频流，从而保证或提高音频质量。
   * - 持续监控网络质量，并在网络质量改善时恢复音视频流。
   *
   * 当本地推流回退为音频流时，或由音频流恢复为音视频流时，SDK 会触发 localPublishFallbackToAudioOnly 回调。
   * **Note**：旁路推流场景下，设置本地推流回退为 Audio-only 可能会导致远端的 CDN 用户听到声音的时间有所延迟。因此在有旁路推流的场景下，Agora 建议不开启该功能。
   * @param {number} option 本地推流回退处理选项：
   * - STREAM_FALLBACK_OPTION_DISABLED = 0：（默认）上行网络较弱时，不对音视频流作回退处理，但不能保证音视频流的质量
   * - STREAM_FALLBACK_OPTION_AUDIO_ONLY = 2：上行网络较弱时只发布音频流
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setLocalPublishFallbackOption(option: 0|1|2): number {
    return this.rtcEngine.setLocalPublishFallbackOption(option);
  }

  /**
   * @description 设置弱网条件下订阅的音视频流回退选项。
   *
   * 网络不理想的环境下，直播音视频的质量都会下降。使用该接口并将 option 设置为 STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW 或者 STREAM_FALLBACK_OPTION_AUDIO_ONLY(2)后，SDK 会：
   * - 在下行弱网且音视频质量严重受影响时，将视频流切换为小流，或关断视频流，从而保证或提高音频质量。
   * - 持续监控网络质量，并在网络质量改善时恢复音视频流。
   *
   * 当远端订阅流回退为音频流时，或由音频流恢复为音视频流时，SDK 会触发 remoteSubscribeFallbackToAudioOnly 回调。
   * @param {number} option 远端订阅流回退处理选项：
   * - STREAM_FALLBACK_OPTION_DISABLED = 0：下行网络较弱时，不对音视频流作回退处理，但不能保证音视频流的质量
   * - STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW = 1：（默认）下行网络较弱时只接收视频小流。该选项只对该方法有效，对 {@link setLocalPublishFallbackOption} 方法无效
   * - STREAM_FALLBACK_OPTION_AUDIO_ONLY = 2：下行网络较弱时，先尝试只接收视频小流；如果网络环境无法显示视频，则再回退到只接收远端订阅的音频流
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setRemoteSubscribeFallbackOption(option: 0|1|2): number {
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
  videosourceStartScreenCaptureByScreen(screenSymbol: ScreenSymbol, rect: CaptureRect, param: CaptureParam): number {
    return this.rtcEngine.videosourceStartScreenCaptureByScreen(screenSymbol, rect, param);
  }

  /**
   * @description Shares the whole or part of a window by specifying the window ID.
   * @param {number} windowSymbol windowid
   * @param {CaptureRect} rect
   * @param {CaptureParam} param
   */
  videosourceStartScreenCaptureByWindow(windowSymbol: number, rect: CaptureRect, param: CaptureParam): number {
    return this.rtcEngine.videosourceStartScreenCaptureByWindow(windowSymbol, rect, param);
  }

  /**
   * @description Updates the screen sharing parameters.
   * @param {CaptureParam} param
   */
  videosourceUpdateScreenCaptureParameters(param: CaptureParam): number {
    return this.rtcEngine.videosourceUpdateScreenCaptureParameters(param);
  }

  /**
   * @description  Updates the screen sharing parameters.
   * @param {VideoContentHint} hint
   */
  videosourceSetScreenCaptureContentHint(hint: VideoContentHint): number {
    return this.rtcEngine.videosourceSetScreenCaptureContentHint(hint);
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
  startScreenCapture(
    windowId: number,
    captureFreq: number,
    rect: {left: number, right: number, top: number, bottom: number},
    bitrate: number
  ): number {
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
    * **Note**：
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
   * **Note**：
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
   * **Note**： If this method is called successfully, the \ref IRtcEngineEventHandler::onUserOffline "onUserOffline" callback is triggered
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
  on(evt: 'apiCallExecuted', cb: (api: string, err: number) => void): this;
  on(evt: 'warning', cb: (warn: number, msg: string) => void): this;
  on(evt: 'error', cb: (err: number, msg: string) => void): this;
  on(evt: 'joinedChannel', cb: (
    channel: string, uid: number, elapsed: number
  ) => void): this;
  on(evt: 'rejoinedChannel', cb: (
    channel: string, uid: number, elapsed: number
  ) => void): this;
  on(evt: 'audioQuality', cb: (
    uid: number, quality: AgoraNetworkQuality, delay: number, lost: number
  ) => void): this;
  on(evt: 'audioVolumeIndication', cb: (
    uid: number,
    volume: number,
    speakerNumber: number,
    totalVolume: number
  ) => void): this;
  on(evt: 'groupAudioVolumeIndication', cb: (
    speakers: {
      uid: number,
      volume: number
    }[],
    speakerNumber: number,
    totalVolume: number
  ) => void): this;
  on(evt: 'leaveChannel', cb: () => void): this;
  on(evt: 'rtcStats', cb: (stats: RtcStats) => void): this;
  on(evt: 'localVideoStats', cb: (stats: LocalVideoStats) => void): this;
  on(evt: 'remoteVideoStats', cb: (stats: RemoteVideoStats) => void): this;
  on(evt: 'remoteAudioStats', cb: (stats: RemoteAudioStats) => void): this;
  on(evt: 'remoteVideoTransportStats', cb: (stats: RemoteVideoTransportStats) => void): this;
  on(evt: 'remoteAudioTransportStats', cb: (stats: RemoteAudioTransportStats) => void): this;
  on(evt: 'audioDeviceStateChanged', cb: (
    deviceId: string,
    deviceType: number,
    deviceState: number,
  ) => void): this;
  on(evt: 'audioMixingFinished', cb: () => void): this;
  on(evt: 'audioMixingStateChanged', cb: (state: number, err: number) => void): this;
  on(evt: 'remoteAudioMixingBegin', cb: () => void): this;
  on(evt: 'remoteAudioMixingEnd', cb: () => void): this;
  on(evt: 'audioEffectFinished', cb: (soundId: number) => void): this;
  on(evt: 'videoDeviceStateChanged', cb: (
    deviceId: string,
    deviceType: number,
    deviceState: number,
  ) => void): this;
  on(evt: 'networkQuality', cb: (
    uid: number,
    txquality: AgoraNetworkQuality,
    rxquality: AgoraNetworkQuality
  ) => void): this;
  on(evt: 'lastMileQuality', cb: (quality: AgoraNetworkQuality) => void): this;
  on(evt: 'lastmileProbeResult', cb: (result: LastmileProbeResult) => void): this;
  on(evt: 'firstLocalVideoFrame', cb: (
    width: number,
    height: number,
    elapsed: number
  ) => void): this;
  on(evt: 'addStream', cb: (
    uid: number,
    elapsed: number,
  ) => void): this;
  on(evt: 'videoSizeChanged', cb: (
    uid: number,
    width: number,
    height: number,
    rotation: number
  ) => void): this;
  on(evt: 'firstRemoteVideoFrame', cb: (
    uid: number,
    width: number,
    height: number,
    elapsed: number
  ) => void): this;
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
  on(evt: 'streamMessage', cb: (
    uid: number,
    streamId: number,
    msg: string,
    len: number
  ) => void): this;
  on(evt: 'streamMessageError', cb: (
    uid: number,
    streamId: number,
    code: number,
    missed: number,
    cached: number
  ) => void): this;
  on(evt: 'mediaEngineStartCallSuccess', cb: () => void): this;
  on(evt: 'requestChannelKey', cb: () => void): this;
  on(evt: 'fristLocalAudioFrame', cb: (elapsed: number) => void): this;
  on(evt: 'firstRemoteAudioFrame', cb: (uid: number, elapsed: number) => void): this;
  on(evt: 'activeSpeaker', cb: (uid: number) => void): this;
  on(evt: 'clientRoleChanged', cb: (
    oldRole: ClientRoleType,
    newRole: ClientRoleType
  ) => void): this;
  on(evt: 'audioDeviceVolumeChanged', cb: (
    deviceType: MediaDeviceType,
    volume: number,
    muted: boolean
  ) => void): this;
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
  on(evt: 'remoteSubscribeFallbackToAudioOnly', cb: (
    uid: number,
    isFallbackOrRecover: boolean
  ) => void): this;
  on(evt: 'microphoneEnabled', cb: (enabled: boolean) => void): this;
  on(evt: 'connectionStateChanged', cb: (
    state: ConnectionState,
    reason: ConnectionChangeReason
  ) => void): this;
  on(evt: string, listener: Function): this;

  /**
   * In future lowercase event name will be deprecated
   */
  on(evt: 'apicallexecuted', cb: (api: string, err: number) => void): this;
  on(evt: 'warning', cb: (warn: number, msg: string) => void): this;
  on(evt: 'error', cb: (err: number, msg: string) => void): this;
  on(evt: 'joinedchannel', cb: (
    channel: string, uid: number, elapsed: number
  ) => void): this;
  on(evt: 'rejoinedchannel', cb: (
    channel: string, uid: number, elapsed: number
  ) => void): this;
  on(evt: 'audioquality', cb: (
    uid: number, quality: AgoraNetworkQuality, delay: number, lost: number
  ) => void): this;
  on(evt: 'audiovolumeindication', cb: (
    uid: number,
    volume: number,
    speakerNumber: number,
    totalVolume: number
  ) => void): this;
  on(evt: 'leavechannel', cb: () => void): this;
  on(evt: 'rtcstats', cb: (stats: RtcStats) => void): this;
  on(evt: 'localvideostats', cb: (stats: LocalVideoStats) => void): this;
  on(evt: 'remotevideostats', cb: (stats: RemoteVideoStats) => void): this;
  on(evt: 'audiodevicestatechanged', cb: (
    deviceId: string,
    deviceType: number,
    deviceState: number,
  ) => void): this;
  on(evt: 'audiomixingfinished', cb: () => void): this;
  on(evt: 'remoteaudiomixingbegin', cb: () => void): this;
  on(evt: 'remoteaudiomixingend', cb: () => void): this;
  on(evt: 'audioeffectfinished', cb: (soundId: number) => void): this;
  on(evt: 'videodevicestatechanged', cb: (
    deviceId: string,
    deviceType: number,
    deviceState: number,
  ) => void): this;
  on(evt: 'networkquality', cb: (
    uid: number,
    txquality: AgoraNetworkQuality,
    rxquality: AgoraNetworkQuality
  ) => void): this;
  on(evt: 'lastmilequality', cb: (quality: AgoraNetworkQuality) => void): this;
  on(evt: 'firstlocalvideoframe', cb: (
    width: number,
    height: number,
    elapsed: number
  ) => void): this;
  on(evt: 'addstream', cb: (
    uid: number,
    elapsed: number,
  ) => void): this;
  on(evt: 'videosizechanged', cb: (
    uid: number,
    width: number,
    height: number,
    rotation: number
  ) => void): this;
  on(evt: 'firstremotevideoframe', cb: (
    uid: number,
    width: number,
    height: number,
    elapsed: number
  ) => void): this;
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
  on(evt: 'streammessage', cb: (
    uid: number,
    streamId: number,
    msg: string,
    len: number
  ) => void): this;
  on(evt: 'streammessageerror', cb: (
    uid: number,
    streamId: number,
    code: number,
    missed: number,
    cached: number
  ) => void): this;
  on(evt: 'mediaenginestartcallsuccess', cb: () => void): this;
  on(evt: 'requestchannelkey', cb: () => void): this;
  on(evt: 'fristlocalaudioframe', cb: (elapsed: number) => void): this;
  on(evt: 'firstremoteaudioframe', cb: (uid: number, elapsed: number) => void): this;
  on(evt: 'activespeaker', cb: (uid: number) => void): this;
  on(evt: 'clientrolechanged', cb: (
    oldRole: ClientRoleType,
    newRole: ClientRoleType
  ) => void): this;
  on(evt: 'audiodevicevolumechanged', cb: (
    deviceType: MediaDeviceType,
    volume: number,
    muted: boolean
  ) => void): this;
  on(evt: 'videosourcejoinedsuccess', cb: (uid: number) => void): this;
  on(evt: 'videosourcerequestnewtoken', cb: () => void): this;
  on(evt: 'videosourceleavechannel', cb: () => void): this;
}

export default AgoraRtcEngine;
