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
import { deprecate } from '../Utils';

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
   * 设置渲染模式。该方法确定是使用 WebGL 渲染还是软件渲染。
   * @param {1|2|3} mode 渲染模式：
   * - 1：使用 WebGL 渲染
   * - 2：使用软件渲染
   * - 3：使用自定义渲染
   */
  setRenderMode (mode: 1|2|3 = 1): void {
    this.renderMode = mode;
  }

  /**
   * 当 {@link setRenderMode} 方法中的渲染模式设置为 3 时，调用该方法可以设备自定义的渲染器。
   * customRender 是一个类.
   * @param {IRenderer} customRenderer 自定义渲染器
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
    //
    // this.rtcEngine.onEvent('connectionbanned', function() {
    //   fire('connectionbanned');
    //   fire('connectionBanned');
    // });
    //
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
   * 更新渲染尺寸。
   * 当视图尺寸发生改变时，该方法可以根据视窗尺寸长宽比更新缩放比例，在收到下一个视频帧时，按照新的比例进行渲染。
   * 该方法可以防止视图不连贯的问题。
   * @param {string|number} key 存储渲染器 Map 的关键标识，如 `uid`、`videoSource` 或 `local`
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
   * 初始化渲染器对象。
   * @param {string|number} key 存储渲染器 Map 的关键标识，如 `uid`、`videosource` 或 `local`
   * @param {Element} view 渲染视频的 Dom
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
   * 销毁渲染器对象。
   * @param {string|number} key 存储渲染器 Map 的关键标识，如 `uid`、`videoSource` 或 `local`
   * @param {function} onFailure `destroyRenderer` 方法的错误回调
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
   * @description 获取当前 SDK 的版本和 Build 信息。
   * @returns {string} 当前 SDK 的版本
   */
  getVersion(): string {
    return this.rtcEngine.getVersion();
  }

  /**
   * @description 获取指定错误码的详细错误信息。
   * @param {number} errorCode 错误码
   * @returns {string} 错误描述
   */
  getErrorDescription(errorCode: number): string {
    return this.rtcEngine.getErrorDescription(errorCode);
  }

  /**
   * @description 获取当前网络连接状态。
   * @returns {ConnectionState} connect 网络连接状态，详见 {@link AgoraRtcEngine.ConnectionState ConnectionState}
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
   * @param {string} token 在 App 服务器端生成的用于鉴权的 Token：
   * - 安全要求不高：你可以填入在 Agora Dashboard 获取到的临时 Token。详见[获取临时 Token](https://docs.agora.io/cn/Video/token?platform=All%20Platforms#获取临时-token)
   * - 安全要求高：将值设为在 App 服务端生成的正式 Token。详见[获取 Token](https://docs.agora.io/cn/Video/token?platform=All%20Platforms#获取正式-token)
   *
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
   * 离开频道，机挂断或退出通话。当调用 {@link join} 方法后，必须调用该方法结束通话，否则无法开始下一次通话。
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
     deprecate('setAudioProfile');
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
   * @description 设置视频的全局渲染帧率，单位为 fps。
   * 该方法主要用来提升 js 渲染的性能。完成设置后，视频数据会被强制按设置的帧率进行传输，以降低 js 渲染的 CPU 消耗。
   *
   * 该方法不适用于添加至高帧率传输流的视频视图。
   * @param {number} fps 渲染帧率，单位为 fps
   */
  setVideoRenderFPS(fps: number) {
    this.rtcEngine.setFPS(fps);
  }

  /**
   * @description 设置高帧率流的渲染帧率。其中高帧率流指调用 {@link addVideoRenderToHighFPS} 方法添加至高帧率的视频流。
   * 请注意区分高帧率流和双流模式里的大流。
   * 该方法适用于将大多数视图设置为低帧率，只将一或两路流设置为高帧率的场景，如屏幕共享。
   * @param {number} fps 渲染帧率，单位为 fps
   */
  setVideoRenderHighFPS(fps: number) {
    this.rtcEngine.setHighFPS(fps);
  }

  /**
   * @description 将指定用户的视频流添加为高帧率流。添加为高帧率流后，你可以调用 {@link setVideoRenderHighFPS} 方法对视频流进行控制。
   * @param {number} uid 用户 ID
   */
  addVideoRenderToHighFPS(uid: number) {
    this.rtcEngine.addToHighVideo(uid);
  }

  /**
   * @description 将指定用户的视频从高帧率流中删除。删除后，你可以调用 {@link setVideoRenderFPS} 方法对视频流进行控制。
   * @param {number} uid 用户 ID
   */
  removeVideoRenderFromHighFPS(uid: number) {
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
    deprecate('startEchoTestWithInterval');
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
   * @param {LastmileProbeConfig} config Last-mile 网络探测配置，详见 {@link AgoraRtcEngine.LastmileProbeConfig LastmileProbeConfig}
   */
  startLastmileProbeTest(config: LastmileProbeConfig): number {
    return this.rtcEngine.startLastmileProbeTest(config);
  }

  /**
   * @description 停止通话前 Last-mile ß网络质量探测。
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
   * @returns {number}
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
   * @returns {number}
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
   * @returns {number}
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
   * @description 开/关本地音频采集。
   *
   * 当 App 加入频道时，它的语音功能默认是开启的。该方法可以关闭或重新开启本地语音功能，即停止或重新开始本地音频采集。
   *
   * 该方法不影响接收或播放远端音频流，{@link enableLocalAudio}(false) 适用于只听不发的用户场景。语音功能关闭或重新开启后，会收到回调 microphoneEnabled。
   * @param {boolean} enable
   * - true：开启本地音频采集（默认）
   * - false：关闭本地音频采集
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  enableLocalAudio(enable: boolean): number {
    return this.rtcEngine.enableLocalAudio(enable);
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
    deprecate('disableAudio');
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
    deprecate('enableAudio');
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
   * @description 设置屏幕共享对象的日志。
   * 请在屏幕共享对象初始化后调用。
   * @param {string} filepath 日志文件的完整路径
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
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
   * @description 设置外部音频采集参数。
   * @param {boolean} enabled 是否开启外部音频采集：
   * - true：开启外部音频采集
   * - false：关闭外部音频采集（默认）
   * @param {number} samplerate 外部音频源的采样率，可设置为 8000，16000，32000，44100 或 48000
   * @param {number} channels 外部音频源的通道数（最多支持两个声道）
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setExternalAudioSource(enabled: boolean, samplerate: number, channels: number): number {
    return this.rtcEngine.setExternalAudioSource(enabled, samplerate, channels);
  }

  /**
   * @description 获取视频设备。
   * @returns {Array} 视频设备的 Array
   */
  getVideoDevices(): Array<Object> {
    return this.rtcEngine.getVideoDevices();
  }

  /**
   * @description 设置视频设备。
   * @param {string} deviceId 设备 ID
   * @returns {number}
   * - true：方法调用成功
   * - false：方法调用失败
   */
  setVideoDevice(deviceId: string): number {
    return this.rtcEngine.setVideoDevice(deviceId);
  }

  /**
   * @description 获取当前的视频设备。
   * @return {Object} 视频设备对象
   */
  getCurrentVideoDevice(): Object {
    return this.rtcEngine.getCurrentVideoDevice();
  }

  /**
   * @description 开始视频设备测试。
   *
   * 该方法测试视频采集设备是否正常工作。
   * **Note**：请确保在调用该方法前已调用 {@link enableVideo}，且输入视频的 HWND 手柄是有效的。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  startVideoDeviceTest(): number {
    return this.rtcEngine.startVideoDeviceTest();
  }

  /**
   * @description 停止视频设备测试。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  stopVideoDeviceTest(): number {
    return this.rtcEngine.stopVideoDeviceTest();
  }

  /**
   * @description 获取音频播放设备列表。
   * @returns {Array} 音频播放设备的 Array
   */
  getAudioPlaybackDevices(): Array<Object> {
    return this.rtcEngine.getAudioPlaybackDevices();
  }

  /**
   * @description 通过设备 ID 指定音频播放设备
   * @param {string} deviceId 音频播放设备的 ID
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setAudioPlaybackDevice(deviceId: string): number {
    return this.rtcEngine.setAudioPlaybackDevice(deviceId);
  }

  /**
   * @description 获取播放设备信息。
   * @param {string} deviceId 设备 ID
   * @param {string} deviceName 设备名称
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  getPlaybackDeviceInfo(deviceId: string, deviceName: string): number {
    return this.rtcEngine.getPlaybackDeviceInfo(deviceId, deviceName);
  }

  /**
   * @description 获取当前的音频播放设备。
   * @return {Object} 音频播放设备对象
   */
  getCurrentAudioPlaybackDevice(): Object {
    return this.rtcEngine.getCurrentAudioPlaybackDevice();
  }

  /**
   * @description 设置音频播放设备的音量
   * @param {number} volume 音量，取值范围为 [0, 255]
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setAudioPlaybackVolume(volume: number): number {
    return this.rtcEngine.setAudioPlaybackVolume(volume);
  }

  /**
   * @description 获取音频播放设备的音量
   * @returns {number} 音量
   */
  getAudioPlaybackVolume(): number {
    return this.rtcEngine.getAudioPlaybackVolume();
  }

  /**
   * @description 获取音频录制设备
   * @returns {Array} 音频录制设备的 Array
   */
  getAudioRecordingDevices(): Array<Object> {
    return this.rtcEngine.getAudioRecordingDevices();
  }

  /**
   * @description 设备音频录制设备
   * @param {string} deviceId 设备 ID
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setAudioRecordingDevice(deviceId: string): number {
    return this.rtcEngine.setAudioRecordingDevice(deviceId);
  }

  /**
   * @description 获取录制设备信息。
   * @param {string} deviceId 设备 ID
   * @param {string} deviceName 设备名
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  getRecordingDeviceInfo(deviceId: string, deviceName: string): number {
    return this.rtcEngine.getRecordingDeviceInfo(deviceId, deviceName);
  }

  /**
   * @description 获取当前的音频录制设备。
   * @returns {Object} 音频录制设备对象
   */
  getCurrentAudioRecordingDevice(): Object {
    return this.rtcEngine.getCurrentAudioRecordingDevice();
  }

  /**
   * @description 获取录制设备的音量。
   * @return {number} 音量
   */
  getAudioRecordingVolume(): number {
    return this.rtcEngine.getAudioRecordingVolume();
  }

  /**
   * @description 设置录音设备的音量
   * @param {number} volume 录音设备的音量，取值范围为 [0, 255]
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setAudioRecordingVolume(volume: number): number {
    return this.rtcEngine.setAudioRecordingVolume(volume);
  }

  /**
   * @description 开始音频播放设备测试。
   *
   * 该方法检测音频播放设备是否正常工作。SDK 会播放用户指定的音乐文件，如果用户可以听到声音，则说明播放设备正常工作。
   * @param {string} filepath 用来测试的音乐文件的路径
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  startAudioPlaybackDeviceTest(filepath: string): number {
    return this.rtcEngine.startAudioPlaybackDeviceTest(filepath);
  }

  /**
   * @description 停止播放设备测试。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  stopAudioPlaybackDeviceTest(): number {
    return this.rtcEngine.stopAudioPlaybackDeviceTest();
  }

  /**
   * @description 开始音频设备回路测试。
   *
   * 该方法测试本地的音频设备是否正常工作。
   * 调用该方法后，麦克风会采集本地语音并通过扬声器播放出来，用户需要配合说一段话。SDK 会通过 groupAudioVolumeIndication 回调向 App 上报音量信息。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  startAudioDeviceLoopbackTest(interval: number): number {
    return this.rtcEngine.startAudioDeviceLoopbackTest(interval);
  }

  /**
   * @description 停止音频设备回路测试。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  stopAudioDeviceLoopbackTest(): number {
    return this.rtcEngine.stopAudioDeviceLoopbackTest();
  }

  /**
   * @description 开启声卡采集。
   *
   * 一旦开启声卡采集，SDK 会采集本地所有的声音。
   *
   * @param {boolean} 是否开启声卡采集：
   * - true：开启声卡采集
   * - false：关闭声卡采集（默认）
   * @param {string|null} 声卡的设备名。默认设为 null，即使用当前声卡采集。如果用户使用虚拟声卡，如 “Soundflower”，可以将虚拟声卡名称 “Soundflower” 作为参数，SDK 会找到对应的虚拟声卡设备，并开始采集。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  enableLoopbackRecording(enable = false, deviceName: string | null = null): number {
    return this.rtcEngine.enableLoopbackRecording(enable, deviceName);
  }

  /**
   * @description 开始音频录制设备测试。
   *
   * 该方法测试麦克风是否正常工作。开始测试后，SDK 会通过 groupAudioVolumeIndication 回调向 App 上报音量信息。
   * @param {number} indicateInterval 返回音量的间隔时间，单位为秒
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  startAudioRecordingDeviceTest(indicateInterval: number): number {
    return this.rtcEngine.startAudioRecordingDeviceTest(indicateInterval);
  }

  /**
   * @description 停止音频录制设备测试。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  stopAudioRecordingDeviceTest(): number {
    return this.rtcEngine.stopAudioRecordingDeviceTest();
  }

  /**
   * @description 获取当前音频播放设备的静音状态。
   * @returns {boolean}
   * - true：当前音频播放设备静音
   * - false：当前音频播放设备不静音
   */
  getAudioPlaybackDeviceMute(): boolean {
    return this.rtcEngine.getAudioPlaybackDeviceMute();
  }

  /**
   * @description 设置当前音频播放设备为静音/不静音。
   * @param {boolean} mute 是否设置当前音频播放设备静音：
   * - true：设置当前音频播放设备静音
   * - false：设置当前音频播放设备不静音
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setAudioPlaybackDeviceMute(mute: boolean): number {
    return this.rtcEngine.setAudioPlaybackDeviceMute(mute);
  }

  /**
   * @description 获取当前音频录制设备的静音状态。
   * @returns {boolean}
   * - true：当前音频录制设备静音
   * - false：当前音频录制设备不静音
   */
  getAudioRecordingDeviceMute(): boolean {
    return this.rtcEngine.getAudioRecordingDeviceMute();
  }

  /**
   * @description 设置当前音频录制设备静音/不静音。
   * @param {boolean} mute 是否设置当前音频录制设备静音：
   * - true：设置当前音频录制设备静音
   * - false：设置当前音频录制设备不静音
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
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
   * @description 初始化屏幕共享对象
   * @param {string} appId 你在 Agora Dashbaord 创建的项目 ID
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  videoSourceInitialize(appId: string): number {
    return this.rtcEngine.videoSourceInitialize(appId);
  }

  /**
   * @description 设置屏幕共享的渲染器
   * @param {Element} view 播放屏幕共享的 Dom
   */
  setupLocalVideoSource(view: Element): void {
    this.initRender('videosource', view);
  }

  /**
   * @description 开启与 Web SDK 的屏幕共享互通。
   *
   * **Note**：该方法需要在 {@link videoSourceInitialize} 之后调用。
   * @param {boolean} enabled 是否开启与 Web SDK 之间的互通：
   * - true：开启与 Web SDK 的互通
   * - false：不开启与 Web SDK 的互通
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  videoSourceEnableWebSdkInteroperability(enabled: boolean): number {
    return this.rtcEngine.videoSourceEnableWebSdkInteroperability(enabled);
  }

  /**
   *
   * @description 屏幕共享对象加入频道。
   * @param {string} token 在 App 服务器端生成的用于鉴权的 Token：
   * - 安全要求不高：你可以填入在 Agora Dashboard 获取到的临时 Token。详见[获取临时 Token](https://docs.agora.io/cn/Video/token?platform=All%20Platforms#获取临时-token)
   * - 安全要求高：将值设为在 App 服务端生成的正式 Token。详见[获取 Token](https://docs.agora.io/cn/Video/token?platform=All%20Platforms#获取正式-token)
   * @param {string} cname 标识频道的频道名，最大不超过 64 字节。以下为支持的字符集范围（共 89 个字符）：
   * - 26 个小写英文字母 a-z
   * - 26 个大写英文字母 A-Z
   * - 10 个数字 0-9
   * - 空格
   * - "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ","
   * @param {string} info 频道信息
   * @param {number} uid 用户 ID
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
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
   * @description 屏幕共享对象离开频道。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  videoSourceLeave(): number {
    return this.rtcEngine.videoSourceLeave();
  }

  /**
   * @description 更新屏幕共享对象的 Token
   * @param {string} token 需要更新的新 Token
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  videoSourceRenewToken(token: string): number {
    return this.rtcEngine.videoSourceRenewToken(token);
  }

  /**
   * @description 设置屏幕共享对象的频道模式。
   * @param {number} profile 频道模式：
   * - 0：通信模式（默认）
   * - 1：直播模式
   * - 2：游戏模式
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  videoSourceSetChannelProfile(profile: number): number {
    return this.rtcEngine.videoSourceSetChannelProfile(profile);
  }

  /**
   * @description 设置屏幕共享的视频属性。
   * **Note**：请在 {@link startScreenCapture2} 后调用该方法。
   * @param {VIDEO_PROFILE_TYPE} profile 视频属性，详见 {@link AgoraRtcEngine.VIDEO_PROFILE_TYPE VIDEO_PROFILE_TYPE}
   * @param {boolean} swapWidthAndHeight 是否交换视频的宽和高：
   * - true：交换视频的宽和高
   * - false：不交换视频的宽和高（默认）
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  videoSourceSetVideoProfile(profile: VIDEO_PROFILE_TYPE, swapWidthAndHeight = false): number {
    return this.rtcEngine.videoSourceSetVideoProfile(profile, swapWidthAndHeight);
  }

  /**
   * @description 获取系统窗口 ID。
   *
   * 该方法获取所有所有的系统窗口 ID，以及相关信息。你可以使用获取到的窗口 ID 进行屏幕共享。
   * @returns {Array} 系统窗口 ID 和相关信息列表
   */
  getScreenWindowsInfo(): Array<Object> {
    return this.rtcEngine.getScreenWindowsInfo();
  }

  /**
   * @description 获取屏幕 ID。
   *
   * 该方法获取所有的系统屏幕 ID，以及相关信息。你可以使用获取到的屏幕 ID 进行屏幕共享。
   * @returns {Array} 系统屏幕 ID 和相关信息列表
   */
   getScreenDisplaysInfo(): Array<Object> {
    return this.rtcEngine.getScreenDisplaysInfo();
  }

  /**
   * @deprecated 该方法已废弃，请改用 {@link videoSourceStartScreenCaptureByScreen} 或 {@link videoSourceStartScreenCaptureByWindow}。
   * @description 开始屏幕共享。
   * @param {number} windowId 需要采集的窗口 ID
   * @param {number} captureFreq 屏幕共享帧率，单位为 fps，取值范围为 [1, 15]
   * @param {*} rect 共享窗口相对于屏幕左上角的相对位置和大小，可设为 null
   * @param {number} bitrate 屏幕共享的比特率，单位为 Kbps
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
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
   * @description 停止屏幕共享。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  stopScreenCapture2(): number {
    return this.rtcEngine.stopScreenCapture2();
  }

  /**
   * @description 开始屏幕共享预览。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  startScreenCapturePreview(): number {
    return this.rtcEngine.videoSourceStartPreview();
  }

  /**
   * @description 停止屏幕共享预览。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  stopScreenCapturePreview(): number {
    return this.rtcEngine.videoSourceStopPreview();
  }

  /**
   * @description 开始屏幕共享流的双流模式。
   * @param {boolean} enable 是否开始双流模式：
   * - true：开启屏幕共享双流模式
   * - false：不开启屏幕共享双流模式（默认）
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  videoSourceEnableDualStreamMode(enable: boolean): number {
    return this.rtcEngine.videoSourceEnableDualStreamMode(enable);
  }

  /**
   * @description 双实例方法：启用定制功能。
   * @param {string} parameter 要设置的参数。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  videoSourceSetParameters(parameter: string): number {
    return this.rtcEngine.videoSourceSetParameter(parameter);
  }

  /**
   * @description 更新屏幕共享区域。
   * @param {*} rect {left: 0, right: 100, top: 0, bottom: 100} 共享窗口相对于屏幕左上角的相对位置和大小，可设为 null
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  videoSourceUpdateScreenCaptureRegion(rect: {
    /** 共享窗口相对于屏幕左边的距离。*/
    left: number,
    /** 共享窗口相对于屏幕右边的距离。*/
    right: number,
    /** 共享窗口相对于屏幕顶部的距离。*/
    top: number,
    /** 共享窗口相对于屏幕底部的距离。*/
    bottom: number
  }) {
    return this.rtcEngine.videoSourceUpdateScreenCaptureRegion(rect);
  }

  /**
   * @description 释放屏幕共享对象
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  videoSourceRelease(): number {
    return this.rtcEngine.videoSourceRelease();
  }

  // 2.4 new Apis
  /**
   * @description 通过指定区域共享屏幕。
   * @param {ScreenSymbol} screenSymbol 屏幕标识：
   * - macOS 系统中，指屏幕 ID
   * - Windows 系统中，值屏幕位置
   * @param {CaptureRect} rect 待共享区域相对于整个屏幕的位置
   * @param {CaptureParam} param 屏幕共享的编码参数配置
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  videoSourceStartScreenCaptureByScreen(screenSymbol: ScreenSymbol, rect: CaptureRect, param: CaptureParam): number {
    return this.rtcEngine.videosourceStartScreenCaptureByScreen(screenSymbol, rect, param);
  }

  /**
   * @description 通过指定窗口 ID 共享窗口。
   * @param {number} windowSymbol 窗口 ID
   * @param {CaptureRect} rect 待共享区域相对于整个窗口的位置
   * @param {CaptureParam} param 屏幕共享的编码参数配置
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  videoSourceStartScreenCaptureByWindow(windowSymbol: number, rect: CaptureRect, param: CaptureParam): number {
    return this.rtcEngine.videosourceStartScreenCaptureByWindow(windowSymbol, rect, param);
  }

  /**
   * @description 更新屏幕共享参数配置。
   * @param {CaptureParam} param 屏幕共享的编码参数配置
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  videoSourceUpdateScreenCaptureParameters(param: CaptureParam): number {
    return this.rtcEngine.videosourceUpdateScreenCaptureParameters(param);
  }

  /**
   * @description 设置屏幕共享内容类型。
   * @param {VideoContentHint} hint 屏幕共享的内容类型
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
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
   * @deprecated 该方法已废弃。请改用 {@link videoSourceStartScreenCaptureByScreen} 或 {@link videoSourceStartScreenCaptureByWindow}。
   * @description 开始屏幕共享
   * @param {number} windowId 待共享的窗口 ID
   * @param {number} captureFreq 屏幕共享的编码帧率，单位为 fps，取值范围为 [1, 15]
   * @param {*} rect 共享窗口相对于屏幕左上角的相对位置和大小，可设为 null
   * @param {number} bitrate 屏幕共享的比特率，单位为 Kbps
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
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
   * @description 停止屏幕共享
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  stopScreenCapture(): number {
    return this.rtcEngine.stopScreenCapture();
  }

  /**
   * @description 更新屏幕共享区域。
   * @param {*} rect {left: 0, right: 100, top: 0, bottom: 100} 共享窗口相对于屏幕左上角的相对位置和大小，可设为 null
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
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
   * @description 开始播放音乐文件及混音。
   *
   * 该方法指定本地或在线音频文件来和麦克风采集的音频流进行混音或替换。替换是指用音频文件替换麦克风采集的音频流。该方法可以选择是否让对方听到本地播放的音频，并指定循环播放的次数。
   * 音乐文件开始播放后，本地会收到 audioMixingStateChanged 回调，报告音乐文件播放状态发生改变。
   * @param {string} filepath 指定需要混音的本地或在线音频文件的绝对路径。支持的音频格式包括：mp3、mp4、m4a、aac、3gp、mkv 及 wav
   * @param {boolean} loopback
   * - true：只有本地可以听到混音或替换后的音频流
   * - false：本地和对方都可以听到混音或替换后的音频流
   * @param {boolean} replace
   * - true：只推动设置的本地音频文件或者线上音频文件，不传输麦克风收录的音频
   * - false：音频文件内容将会和麦克风采集的音频流进行混音
   * @param {number} cycle 指定音频文件循环播放的次数：
   * - 正整数：循环的次数
   * - -1：无限循环
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   *
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
   * @description 停止播放音乐文件及混音。请在频道内调用该方法。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  stopAudioMixing(): number {
    return this.rtcEngine.stopAudioMixing();
  }

  /**
   * @description 暂停播放音乐文件及混音。请在频道内调用该方法。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  pauseAudioMixing(): number {
    return this.rtcEngine.pauseAudioMixing();
  }

  /**
   * @description 恢复播放音乐文件及混音。请在频道内调用该方法。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  resumeAudioMixing(): number {
    return this.rtcEngine.resumeAudioMixing();
  }

  /**
   * @description 调节音乐文件的播放音量。请在频道内调用该方法。
   * @param {number} 音乐文件播放音量，取值范围为 [0, 100]，默认值为 100，表示原始文件音量
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  adjustAudioMixingVolume(volume: number): number {
    return this.rtcEngine.adjustAudioMixingVolume(volume);
  }

  /**
   * @description 调节音乐文件的本地播放音量。请在频道内调用该方法。
   * @param {number} 音乐文件的本地播放音量，取值范围为 [0, 100]，默认值为 100，表示原始文件音量
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  adjustAudioMixingPlayoutVolume(volume: number): number {
    return this.rtcEngine.adjustAudioMixingPlayoutVolume(volume);
  }

  /**
   * @description 调节音乐文件的远端播放音量。请在频道内调用该方法。
   * @param {number} 音乐文件的远端播放音量，取值范围为 [0, 100]，默认值为 100，表示原始文件音量
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  adjustAudioMixingPublishVolume(volume: number): number {
    return this.rtcEngine.adjustAudioMixingPublishVolume(volume);
  }

  /**
   * @description 获取音乐文件的时长。请在频道内调用该方法。如果返回值 < 0，表明调用失败。
   * @returns {number}
   * - < 0：方法调用失败
   * - 其他：方法调用成功，并返回伴奏时长
   */
  getAudioMixingDuration(): number {
    return this.rtcEngine.getAudioMixingDuration();
  }

  /**
   * @description 获取音乐文件的播放进度，单位为毫秒。请在频道内调用该方法。
   * @returns {number}
   * - < 0：方法调用失败
   * - 其他值：方法调用成功并返回伴奏播放进度
   */
  getAudioMixingCurrentPosition(): number {
    return this.rtcEngine.getAudioMixingCurrentPosition();
  }

  /**
   * @description 设置音乐文件的播放位置。
   *
   * 该方法可以设置音频文件的播放位置，这样你可以根据实际情况播放文件，而不是非得从头到尾播放一个文件。
   *
   * @param {number} 表示当前播放进度的整数，单位为毫秒
   * @returns
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setAudioMixingPosition(position: number): number {
    return this.rtcEngine.setAudioMixingPosition(position);
  }

  // ===========================================================================
  // CDN STREAMING
  // ===========================================================================
   /**
    * @description 增加旁路推流地址。
    *
    * 调用该方法后，SDK 会在本地触发 streamPublished 回调，报告增加旁路推流地址的状态。
    * **Note**：
    * - 请在加入频道后调用该方法。
    * - 该方法每次只能增加一路旁路推流地址。若需推送多路流，则需多次调用该方法。
    * - 推流地址不支持中文等特殊字符，
    * - 该方法仅适用于直播模式。
    * @param {string} CDN 推流地址，格式为 RTMP。该字符长度不能超过 1024 字节
    * @param {bool} transcodingEnabled 设置是否转码：
    * - true：转码。[转码](https://docs.agora.io/cn/Agora%20Platform/terms?platform=All%20Platforms#转码)是指在旁路推流时对音视频流进行转码处理后，再推送到其他 RTMP 服务器。多适用于频道内有多个主播，需要进行混流、合图的场景
    * @returns
    * - 0：方法调用成功
    * - < 0：方法调用失败
    */
  addPublishStreamUrl(url: string, transcodingEnabled: boolean): number {
    return this.rtcEngine.addPublishStreamUrl(url, transcodingEnabled);
  }

  /**
   * @description 删除旁路推流地址。
   *
   * 调用该方法后，SDK 会在本地触发 streamUnpublished 回调，报告删除旁路推流地址的状态。
   * **Note**：
   * - 该方法每次只能删除一路旁路推流地址。若需删除多路流，则需多次调用该方法。
   * - 推流地址不支持中文等特殊字符。
   * - 该方法只适用于直播模式。
   * @param {string} 待删除的推流地址，格式为 RTMP。该字符长度不能超过 1024 字节
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  removePublishStreamUrl(url: string): number {
    return this.rtcEngine.removePublishStreamUrl(url);
  }

  /**
   * @description 设置直播转码。
   * @param {TranscodingConfig} 旁路推流布局相关设置
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setLiveTranscoding(transcoding: TranscodingConfig): number {
    return this.rtcEngine.setLiveTranscoding(transcoding);
  }

  // ===========================================================================
  // STREAM INJECTION
  // ===========================================================================
  /**
   * @description 导入在线媒体流。
   *
   * 该方法通过在服务端拉取视频流并发送到频道中，将正在播出的视频导入到正在进行的直播中。
   * 可主要应用于赛事直播、多人看视频互动等直播场景。
   *
   * 调用该方法后，SDK 会在本地触发 streamInjectStatus 回调，报告导入在线媒体流的状态。
   * 成功导入媒体流后，该音视频流会出现在频道中，频道内所有用户都会收到 userJoined 回调，其中 uid 为 666。
   *
   * **Note**：请确保已联系 sales@agora.io 开通旁路直播推流功能。
   * @param {string} 添加到直播中的视频流 URL 地址，支持 RTMP， HLS， FLV 协议传输。
   * - 支持的 FLV 音频编码格式：AAC
   * - 支持的 FLV 视频编码格式：H264 (AVC)
   * @param {InjectStreamConfig} 外部导入的音视频流的配置
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  addInjectStreamUrl(url: string, config: InjectStreamConfig): number {
    return this.rtcEngine.addInjectStreamUrl(url, config);
  }

  /**
   * @description 删除导入的在线媒体流。
   * **Note**：成功删除后，会触发 removeStream 回调，其中 uid 为 666。
   * @param {string} url 已导入、待删除的外部视频流 URL 地址，格式为 HTTP 或 HTTPS
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  removeInjectStreamUrl(url: string): number {
    return this.rtcEngine.removeInjectStreamUrl(url);
  }


  // ===========================================================================
  // RAW DATA
  // ===========================================================================
  /**
   * @description 设置录制的声音格式。
   * @param {number} sampleRate 指定返回数据的采样率，可设置为 8000，16000，32000，44100 或 48000。
   * @param {number} 指定返回数据的通道数：
   * - 1：单声道
   * - 2：双声道
   * @param {number} mode 指定使用模式：
   * - 0：只读模式，用户仅从 AudioFrame 获取原始音频数据。例如：若用户通过 Agora SDK 采集数据，自己进行 RTMP 推流，则可以选择该模式。
   * - 1：只写模式，用户替换 AudioFrame 中的数据以供 Agora SDK 编码传输。例如：若用户自行采集数据，可选择该模式。
   * - 2：读写模式，用户从 AudioFrame 获取并修改数据，并返回给 Aogra SDK 进行编码传输。例如：若用户自己有音效处理模块，且想要根据实际需要对数据进行前处理 (例如变声)，则可以选择该模式。
   * @param {number} 指定返回数据的采样点数，如 RTMP 推流应用中通常为 1024。 SamplesPerCall = (int)(SampleRate × sampleInterval)，其中：sample ≥ 0.01，单位为秒
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
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
   * 设置播放的声音格式。
   * @param {number} 指定返回数据的采样率，可设置为 8000，16000，32000，44100 或 48000
   * @param {number} 指定返回数据的通道数：
   * - 1：单声道
   * - 2：双声道
   * @param {number} mode 指定使用模式：
   * - 0：只读模式，用户仅从 AudioFrame 获取原始音频数据。例如：若用户通过 Agora SDK 采集数据，自己进行 RTMP 推流，则可以选择该模式。
   * - 1：只写模式，用户替换 AudioFrame 中的数据以供 Agora SDK 编码传输。例如：若用户自行采集数据，可选择该模式。
   * - 2：读写模式，用户从 AudioFrame 获取并修改数据，并返回给 Aogra SDK 进行编码传输。例如：若用户自己有音效处理模块，且想要根据实际需要对数据进行前处理 (例如变声)，则可以选择该模式。
   * @param {number} 指定返回数据的采样点数，如 RTMP 推流应用中通常为 1024。 SamplesPerCall = (int)(SampleRate × sampleInterval)，其中：sample ≥ 0.01，单位为秒
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
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
   * 设置录制和播放声音混音后的数据格式。
   * @param {number} sampleRate 指定返回数据的采样率，可设置为 8000，16000，32000，44100 或 48000
   * @param {number} samplesPerCall 指定 onMixedAudioFrame 中返回数据的采样点数，如 RTMP 推流应用中通常为 1024。 SamplesPerCall = (int)(SampleRate × sampleInterval)，其中：sample ≥ 0.01，单位为秒
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
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
   * @description 创建数据流。
   *
   * 该方法用于创建数据流。频道内每人最多只能创建 5 个数据流。频道内数据通道最多允许数据延迟 5 秒，若超过 5 秒接收方尚未收到数据流，则数据通道会向 App 报错。
   * **Note**：请将 reliable 和 ordered 同时设置为 true 或 false，暂不支持交叉设置。
   * @param {boolean} reliable
   * - true：接收方 5 秒内会收到发送方所发送的数据，否则会收到 streamMessageError 回调并获得相应报错信息
   * - false：接收方不保证收到，就算数据丢失也不会报错
   * @param {boolean} ordered
   * - true：接收方 5 秒内会按照发送方发送的顺序收到数据包
   * - false：接收方不保证按照发送方发送的顺序收到数据包
   * @returns {number}
   * - 创建数据流成功则返回数据流 ID
   * - < 0：创建数据流失败。如果返回的错误码是负数，对应错误代码和警告代码里的正整数
   */
  createDataStream(reliable: boolean, ordered: boolean): number {
    return this.rtcEngine.createDataStream(reliable, ordered);
  }

  /**
   * @description 发送数据流。
   *
   * 该方法发送数据流消息到频道内所有用户。SDK 对该方法的实现进行了如下限制：频道内每秒最多能发送 30 个包，且每个包最大为 1 KB。 每个客户端每秒最多能发送 6 KB 数据。频道内每人最多能同时有 5 个数据通道。
   *
   * 成功调用该方法后，远端会触发 streamMessage 回调，远端用户可以在该回调中获取接收到的流消息；
   * 若调用失败，远端会触发 streamMessageError 回调。
   * @param {number} 数据流 ID，createDataStream 的返回值
   * @param {string} 待发送的数据
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  sendStreamMessage(streamId: number, msg: string): number {
    return this.rtcEngine.sendStreamMessage(streamId, msg);
  }

  // ===========================================================================
  // MANAGE AUDIO EFFECT
  // ===========================================================================
  /**
   * @description 获取播放音效文件音量。范围为 [0.0, 100.0]。
   * @returns {number}
   * - 方法调用成功则返回音量值
   * - < 0：方法调用失败
   */
  getEffectsVolume(): number {
    return this.rtcEngine.getEffectsVolume();
  }
  /**
   * @description 设置播放音效文件音量。
   * @param {number} volume 音效文件的音量。取值范围为 [0.0, 100.0]。100.0 为默认值
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setEffectsVolume(volume: number): number {
    return this.rtcEngine.setEffectsVolume(volume);
  }
  /**
   * @description 设置单个音效文件的音量。
   * @param {number} soundId 指定音效的 ID。每个音效均有唯一的 ID
   * @param {number} volume 音效文件的音量。取值范围为 [0.0, 100.0]。100.0 为默认值
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  setVolumeOfEffect(soundId: number, volume: number): number {
    return this.rtcEngine.setVolumeOfEffect(soundId, volume);
  }
  /**
   * @description 播放指定音效文件。
   *
   * 该方法播放指定的本地或在线音效文件。你可以在该方法中设置音效文件的播放次数、音调、音效的空间位置和增益，以及远端用户是否能听到该音效。
   *
   * 你可以多次调用该方法，通过传入不同的音效文件的 soundID 和 filePath，同时播放多个音效文件，实现音效叠加。为获得最佳用户体验，我们建议同时播放的音效文件不要超过 3 个。调用该方法播放音效结束后，SDK 会触发 audioEffectFinished 回调。
   * @param {number} soundId 指定音效的 ID。每个音效均有唯一的 ID
   * @param {string} filePath 指定要播放的音效文件的绝对路径或 URL 地址
   * @param {number} loopcount 设置音效循环播放的次数：
   * - 0：播放音效一次
   * - 1：播放音效两次
   * - -1：无限循环播放音效，直至调用 {@link stopEffect} 或 {@link stopAllEffects} 后停止
   * @param {number} pitch 设置音效的音调，取值范围为 [0.5, 2]。默认值为 1.0，表示不需要修改音调。取值越小，则音调越低
   * @param {number} pan 设置是否改变音效的空间位置。取值范围为 [-1.0, 1.0]：
   * - 0.0：音效出现在正前方
   * - 1.0：音效出现在右边
   * - -1.0：音效出现在左边
   * @param {number} gain 设置是否改变单个音效的音量。取值范围为 [0.0, 100.0]。默认值为 100.0。取值越小，则音效的音量越低
   * @param {boolean} publish 设置是否将音效传到远端：
   * - true：音效在本地播放的同时，会发布到 Agora 云上，因此远端用户也能听到该音效
   * - false：音效不会发布到 Agora 云上，因此只能在本地听到该音效
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
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
   * @description 停止播放指定音效文件。
   * @param {number} soundId 指定音效的 ID。每个音效均有唯一的 ID
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  stopEffect(soundId: number): number {
    return this.rtcEngine.stopEffect(soundId);
  }
  /**
   * @description 预加载音效文件。
   *
   * 为保证通信畅通，请注意控制预加载音效文件的大小，并在 {@link join} 前就使用该方法完成音效预加载。
   * 音效文件支持以下音频格式：mp3，aac，m4a，3gp，wav。
   * @param {number} soundId 指定音效的 ID。每个音效均有唯一的 I
   * @param {string} filePath 音效文件的绝对路径
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  preloadEffect(soundId: number, filePath: string): number {
    return this.rtcEngine.preloadEffect(soundId, filePath);
  }
  /**
   * 释放音效文件。
   * @param {number} soundId 指定音效的 ID。每个音效均有唯一的 ID
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  unloadEffect(soundId: number): number {
    return this.rtcEngine.unloadEffect(soundId);
  }
  /**
   * @description 暂停音效文件播放。
   * @param {number} soundId 指定音效的 ID。每个音效均有唯一的 ID
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  pauseEffect(soundId: number): number {
    return this.rtcEngine.pauseEffect(soundId);
  }
  /**
   * @description 暂停所有音效文件播放。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  pauseAllEffects(): number {
    return this.rtcEngine.pauseAllEffects();
  }
  /**
   * @description 恢复播放指定音效文件。
   * @param {number} soundId 指定音效的 ID。每个音效均有唯一的 ID
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  resumeEffect(soundId: number): number {
    return this.rtcEngine.resumeEffect(soundId);
  }
  /**
   * @description 恢复播放所有音效文件。
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  resumeAllEffects(): number {
    return this.rtcEngine.resumeAllEffects();
  }

  /**
   * @description 开启/关闭远端用户的语音立体声。
   *
   * 如果想调用 {@link setRemoteVoicePosition} 实现听声辨位的功能，请确保在调用 {@link join} 方法前调用该方法。
   *
   * @param {boolean} 是否开启远端用户语音立体声：
   * - true：开启
   * - false：（默认）关闭
   *
   */
  enableSoundPositionIndication(enable: boolean) {
    return this.rtcEngine.enableSoundPositionIndication(enable);
  }

  /**
   * @description 设置远端用户声音的空间位置和音量，方便本地用户听声辨位。
   *
   * 用户通过调用该接口，设置远端用户声音出现的位置，左右声道的声音差异会让用户产生声音的方位感，从而判断出远端用户的实时位置。
   * 在多人在线游戏场景，如吃鸡游戏中，该方法能有效增加游戏角色的方位感，模拟真实场景。
   * **Note**：
   * - 使用该方法需要在加入频道前调用 {@link enableSoundPositionIndication} 开启远端用户的语音立体声
   * - 为获得最佳听觉体验，我们建议用户佩戴耳机
   * @param {number} uid 远端用户的 ID
   * @param {number} pan 设置远端用户声音出现的位置，取值范围为 [-1.0, 1.0]：
   * - 0.0：（默认）声音出现在正前方
   * - -1.0：声音出现在左边
   * - 1.0：声音出现在右边
   * @param {number} 设置远端用户声音的音量，取值范围为 [0.0, 100.0]，默认值为 100.0，表示该用户的原始音量。取值越小，则音量越低
   */
  setRemoteVoicePosition(uid: number, pan: number, gain: number): number {
    return this.rtcEngine.setRemoteVoicePosition(uid, pan, gain);
  }


  // ===========================================================================
  // EXTRA
  // ===========================================================================

  /**
   * @description 获取通话 ID。
   *
   * 获取当前的通话 ID。客户端在每次 {@link join} 后会生成一个对应的 CallId，标识该客户端的此次通话。
   * 有些方法如 rate, complain 需要在通话结束后调用，向 SDK 提交反馈，这些方法必须指定 CallId 参数。
   * 使用这些反馈方法，需要在通话过程中调用 getCallId 方法获取 CallId，在通话结束后在反馈方法中作为参数传入。
   * @returns {string} 通话 ID
   */
  getCallId(): string {
    return this.rtcEngine.getCallId();
  }

  /**
   * @description 给通话评分。
   * @param {string} callId 通过 getCallId 函数获取的通话 ID
   * @param {number} rating 给通话的评分，最低 1 分，最高 5 分
   * @param {string} desc （非必选项）给通话的描述，可选，长度应小于 800 字节
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  rate(callId: string, rating: number, desc: string): number {
    return this.rtcEngine.rate(callId, rating, desc);
  }

  /**
   * @description 投诉通话质量。
   * @param {string} callId 通话 getCallId 函数获取的通话 ID
   * @param {string} desc （非必选项）给通话的描述，可选，长度应小于 800 字节
   * @returns {number}
   * - 0：方法调用成功
   * - < 0：方法调用失败
   */
  complain(callId: string, desc: string): number {
    return this.rtcEngine.complain(callId, desc);
  }

  // ===========================================================================
  // replacement for setParameters call
  // ===========================================================================
  /**
   * @description 该方法为私有接口。
   */
  setBool(key: string, value: boolean): number {
    return this.rtcEngine.setBool(key, value);
  }
  /**
   * @description 该方法为私有接口。
   */
  setInt(key: string, value: number): number {
    return this.rtcEngine.setInt(key, value);
  }
  /**
   * @description 该方法为私有接口。
   */
  setUInt(key: string, value: number): number {
    return this.rtcEngine.setUInt(key, value);
  }
  /**
   * @description 该方法为私有接口。
   */
  setNumber(key: string, value: number): number {
    return this.rtcEngine.setNumber(key, value);
  }
  /**
   * @description 该方法为私有接口。
   */
  setString(key: string, value: string): number {
    return this.rtcEngine.setString(key, value);
  }
  /**
   * @description 该方法为私有接口。
   */
  setObject(key: string, value: string): number {
    return this.rtcEngine.setObject(key, value);
  }
  /**
   * @description 该方法为私有接口。
   */
  getBool(key: string): boolean {
    return this.rtcEngine.getBool(key);
  }
  /**
   * @description 该方法为私有接口。
   */
  getInt(key: string): number {
    return this.rtcEngine.getInt(key);
  }
  /**
   * @description 该方法为私有接口。
   */
  getUInt(key: string): number {
    return this.rtcEngine.getUInt(key);
  }
  /**
   * @description 该方法为私有接口。
   */
  getNumber(key: string): number {
    return this.rtcEngine.getNumber(key);
  }
  /**
   * @description 该方法为私有接口。
   */
  getString(key: string): string {
    return this.rtcEngine.getString(key);
  }
  /**
   * @description 该方法为私有接口。
   */
  getObject(key: string): string {
    return this.rtcEngine.getObject(key);
  }
  /**
   * @description 该方法为私有接口。
   */
  getArray(key: string): string {
    return this.rtcEngine.getArray(key);
  }
  /**
   * @description 该方法为私有接口。
   */
  setParameters(param: string): number {
    return this.rtcEngine.setParameters(param);
  }
  /**
   * @description 该方法为私有接口。
   */
  convertPath(path: string): string {
    return this.rtcEngine.convertPath(path);
  }
  /**
   * @description 该方法为私有接口。
   */
  setProfile(profile: string, merge: boolean): number {
    return this.rtcEngine.setProfile(profile, merge);
  }
}

declare interface AgoraRtcEngine {
  /**
   * API 方法已执行回调。包含如下参数：
   * - api：已执行的 API 方法
   * - err：执行 API 过程中的错误
   */
  on(evt: 'apiCallExecuted', cb: (api: string, err: number) => void): this;
  /**
   * 发生警告回调。包含如下参数：
   * - warn：警告码
   * - msg：详细的警告信息
   */
  on(evt: 'warning', cb: (warn: number, msg: string) => void): this;
  /**
   * 发生错误警告。包含如下参数：
   * - err：错误码
   * - msg：详细的错误信息
   */
  on(evt: 'error', cb: (err: number, msg: string) => void): this;
  /**
   * 成功加入频道。包含如下参数：
   * - channel：频道名
   * - uid：用户 ID
   * - elapsed：从调用 {@link join} 开始到发生此事件过去的时间（毫秒)
   */
  on(evt: 'joinedChannel', cb: (
    channel: string, uid: number, elapsed: number
  ) => void): this;
  /**
   * 重新加入频道回调。
   * 有时候由于网络原因，客户端可能会和服务器失去连接，SDK 会进行自动重连，自动重连成功后触发此回调方法。
   * 包含如下参数：
   * - channel：频道名
   * - uid：用户 ID
   * - elapsed：从调用 {@link join} 开始到发生此事件过去的时间（毫秒)
   */
  on(evt: 'rejoinedChannel', cb: (
    channel: string, uid: number, elapsed: number
  ) => void): this;
  // on(evt: 'audioQuality', cb: (
  //   uid: number, quality: AgoraNetworkQuality, delay: number, lost: number
  // ) => void): this;
  /**
   * 提示频道内谁在说话以及说话者音量的回调。
   */
  on(evt: 'audioVolumeIndication', cb: (
    uid: number,
    volume: number,
    speakerNumber: number,
    totalVolume: number
  ) => void): this;
  /**
   * 提示频道内谁在说话以及说话者音量的回调。包含如下参数：
   * - speakers：说话者信息的数组，包含：
       - uid：用户 ID
       - volume：用户的说话音量
   * - speakerNumber：频道内说话者的人数
   * - volume：（混音后的）总音量，范围为 [0, 255]
   *
   */
  on(evt: 'groupAudioVolumeIndication', cb: (
    speakers: {
      uid: number,
      volume: number
    }[],
    speakerNumber: number,
    totalVolume: number
  ) => void): this;
  /**
   * 离开频道回调。
   * App 调用 {@link leaveChannel} 方法成功离开频道后，SDK 会触发该回调。
   */
  on(evt: 'leaveChannel', cb: () => void): this;
  /**
   * 通话相关统计信息。包含如下参数：
   * - stats：通话信息详情 {@link RtcStats}
   */
  on(evt: 'rtcStats', cb: (stats: RtcStats) => void): this;
  /**
   * 通话中本地视频流的统计信息回调。包含如下参数：
   * - stats：本地视频流统计信息 {@link LocalVideoStats}
   */
  on(evt: 'localVideoStats', cb: (stats: LocalVideoStats) => void): this;
  /**
   * 通话中远端视频流的统计信息回调。包含如下参数：
   * - stats：远端视频流统计信息 {@link RemoteVideoState}
   */
  on(evt: 'remoteVideoStats', cb: (stats: RemoteVideoStats) => void): this;
  /**
   * 通话中远端音频流的统计信息回调。包含如下参数：
   * - stats：远端音频流统计信息 {@link RemoteAudioStats}
   */
  on(evt: 'remoteAudioStats', cb: (stats: RemoteAudioStats) => void): this;
  /**
   * 通话中远端视频流传输的统计信息回调。包含如下参数：
   * - stats：远端视频流传输的统计信息 {RemoteVideoTransportStats}
   *
   * 该回调描述远端用户通话中端到端的网络统计信息，通过视频包计算，用客观的数据，如丢包、网络延迟等 ，展示当前网络状态。
   *
   * 通话中，当用户收到远端用户/主播发送的视频数据包后，会每 2 秒触发一次该回调。和 remoteVideoStats 回调相比，该回调以数据展示当前网络状态，因此更客观。
   */
  on(evt: 'remoteVideoTransportStats', cb: (stats: RemoteVideoTransportStats) => void): this;
  /**
   * 通话中远端音频流传输的统计信息回调。包含如下参数：
   * - stats：远端音频流传输的统计信息 {@link remoteAudioTransportStats}
   */
  on(evt: 'remoteAudioTransportStats', cb: (stats: RemoteAudioTransportStats) => void): this;
  /**
   * 音频设备状态已改变回调。包含如下参数：
   * - deviceId：设备 ID
   * - deviceType：设备类型，详见 {@link MediaDeviceType}
   * - deviceState：设备状态
   *   - 1：设备正在使用
   *   - 2：设备被禁用
   *   - 4：没有此设备
   *   - 8：设备被拔出
   */
  on(evt: 'audioDeviceStateChanged', cb: (
    deviceId: string,
    deviceType: number,
    deviceState: number,
  ) => void): this;
  // on(evt: 'audioMixingFinished', cb: () => void): this;
  /**
   * 本地用户的音乐文件播放状态改变。包含如下参数：
   * - state：状态码
   *   - 710：音乐文件正常播放
   *   - 711：音乐文件暂停播放
   *   - 713：音乐文件停止播放
   *   - 714：音乐文件报错。SDK 会在 err 参数中返回具体的报错原因
   *
   * - err：错误码：
   *   - 701：音乐文件打开出错
   *   - 702：音乐文件打开太频繁
   *   - 703：音乐文件播放异常中断
   */
  on(evt: 'audioMixingStateChanged', cb: (state: number, err: number) => void): this;
  /**
   * 远端音乐文件播放已开始回调。
   * 当远端有用户调用 {@link startAudioMixing} 播放本地音乐文件，会触发该回调。
   */
  on(evt: 'remoteAudioMixingBegin', cb: () => void): this;
  /**
   * 远端音乐文件播放已结束回调。
   */
  on(evt: 'remoteAudioMixingEnd', cb: () => void): this;
  /**
   * 本地音效文件播放已结束回调。
   */
  on(evt: 'audioEffectFinished', cb: (soundId: number) => void): this;
  /**
   * 视频设备变化回调。包含如下参数：
   * - deviceId：设备 ID
   * - deviceType：设备类型，详见 {@link MediaDeviceType}
   * - deviceState：设备状态
   *   - 1：设备正在使用
   *   - 2：设备被禁用
   *   - 4：没有此设备
   *   - 8：设备被拔出
   *
   * 该回调提示系统视频设备状态发生改变，比如被拔出或移除。如果设备已使用外接摄像头采集，外接摄像头被拔开后，视频会中断。
   */
  on(evt: 'videoDeviceStateChanged', cb: (
    deviceId: string,
    deviceType: number,
    deviceState: number,
  ) => void): this;
  /**
   * 通话中每个用户的网络上下行 last mile 质量报告回调。
   * 其中 last mile 是指设备到 Agora 边缘服务器的网络状态。包含如下参数：
   * - uid：用户 ID。表示该回调报告的是持有该 ID 的用户的网络质量。当 uid 为 0 时，返回的是本地用户的网络质量
   * - txquality：该用户的上行网络质量，基于上行视频的发送码率、上行丢包率、平均往返时延和网络抖动计算。详见 {@link AgoraNetworkQuality}
   * - rxquality：该用户的下行网络质量，基于下行网络的丢包率、平均往返延时和网络抖动计算。详见 {@link AgoraNetworkQuality}
   */
  on(evt: 'networkQuality', cb: (
    uid: number,
    txquality: AgoraNetworkQuality,
    rxquality: AgoraNetworkQuality
  ) => void): this;
  /**
   * 通话前网络上下行 last mile 质量报告回调。包含如下参数：
   * - quality：网络上下行质量，基于上下行网络的丢包率和抖动计算，探测结果主要反映上行网络的状态。详见 {@link AgoraNetworkQuality}
   *
   * 该回调描述本地用户在加入频道前的 last mile 网络探测的结果，其中 last mile 是指设备到 Agora 边缘服务器的网络状态。
   *
   * 在调用 {@link enableLastmileTest} 之后，该回调函数每 2 秒触发一次。如果远端有多个用户/主播，该回调每 2 秒会被触发多次。
   */
  on(evt: 'lastMileQuality', cb: (quality: AgoraNetworkQuality) => void): this;
  /**
   * 通话前网络质量探测报告回调。包含如下参数：
   * - result：上下行 Last mile 质量探测结果。详见 {@link LastmileProbeResult}
   *
   * 话前网络上下行 Last mile 质量探测报告回调。在调用 {@link startLastmileProbeTest} 之后，SDK 会在约 30 秒内返回该回调。
   */
  on(evt: 'lastmileProbeResult', cb: (result: LastmileProbeResult) => void): this;
  /**
   * 已发送本地视频首帧回调。包含如下参数：
   * - width：视频流宽（像素）
   * - height：视频流高（像素）
   * - elapsed：从本地调用 {@link join} 到发生此事件过去的时间（毫秒)
   */
  on(evt: 'firstLocalVideoFrame', cb: (
    width: number,
    height: number,
    elapsed: number
  ) => void): this;
  /**
   * 已接收到远端视频并完成解码回调。包含如下参数：
   * - uid：用户 ID，指定是哪个用户的视频流
   * - elapsed：从本地调用 {@link join} 到发生此事件过去的时间（毫秒)
   *
   * 引擎收到第一帧远端视频流并解码成功时，触发此调用。有两种情况：
   * - 远端用户首次上线后发送视频
   * - 远端用户视频离线再上线后发送视频。出现这种中断的可能原因包括：
   *   - 远端用户离开频道
   *   - 远端用户掉线
   *   - 远端用户调用 {@link muteLocalVideoStream} 方法停止发送本地视频流
   *   - 远端用户调用 {@link disableVideo} 方法关闭视频模块
   */
  on(evt: 'addStream', cb: (
    uid: number,
    elapsed: number,
  ) => void): this;
  /**
   * 本地或远端视频大小和旋转信息发生改变回调。包含如下参数：
   * - uid：图像尺寸和旋转信息发生变化的用户的用户 ID（本地用户的 uid 为 0）
   * - width：视频流的宽度（像素）
   * - height：视频流的高度（像素）
   * - rotation：旋转信息 [0, 360]
   */
  on(evt: 'videoSizeChanged', cb: (
    uid: number,
    width: number,
    height: number,
    rotation: number
  ) => void): this;
  /**
   * 已显示首帧远端视频回调。
   * 第一帧远端视频显示在视图上时，触发此调用。包含如下参数：
   * - uid：用户 ID，指定是哪个用户的视频流
   * - width：视频流宽（像素）
   * - height：视频流高（像素）
   * - elapsed：从本地调用 {@link join} 到发生此事件过去的时间（毫秒)
   */
  on(evt: 'firstRemoteVideoFrame', cb: (
    uid: number,
    width: number,
    height: number,
    elapsed: number
  ) => void): this;
  /**
   * 远端用户加入当前频道回调。包含如下参数：
   * - uid：新加入频道的远端用户/主播 ID
   * - elapsed：从本地调用 {@link join} 到发生此事件过去的时间（毫秒)
   *
   * 该回调在如下情况下会被触发：
   * - 远端用户/主播调用 {@link join} 方法加入频道
   * - 远端用户加入频道后调用 {@link setClientRole} 将用户角色改变为主播
   * - 远端用户/主播网络中断后重新加入频道
   * - 主播通过调用 {@link addInjectStreamUrl} 方法成功导入在线媒体流
   *
   * **Note**：直播场景下，
   * - 主播间能相互收到新主播加入频道的回调，并能获得该主播的 uid
   * - 观众也能收到新主播加入频道的回调，并能获得该主播的 uid
   * - 当 Web 端加入直播频道时，只要 Web 端有推流，SDK 会默认该 Web 端为主播，并触发该回调。
   */
  on(evt: 'userJoined', cb: (uid: number, elapsed: number) => void): this;
  /**
   * 远端用户离开当前频道回调。包含如下参数：
   * - uid 离线用户或主播的用户 ID。
   * - reason 离线原因：
   *   - 0：用户主动离开。
   *   - 1：因过长时间收不到对方数据包，超时掉线。注意：由于 SDK 使用的是不可靠通道，也有可能对方主动离开本方没收到对方离开消息而误判为超时掉线。
   *   - 2：用户身份从主播切换为观众。
   *
   * 用户离开频道有两个原因：
   * - 正常离开的时候，远端用户/主播会发送类似“再见”的消息。接收此消息后，判断用户离开频道。
   * - 超时掉线的依据是，在一定时间内（通信场景为 20 秒，直播场景稍有延时），用户没有收到对方的任何数据包，则判定为对方掉线。
   在网络较差的情况下，有可能会误报。声网建议使用信令系统来做可靠的掉线检测。
   */
  on(evt: 'removeStream', cb: (uid: number, reason: number) => void): this;
  /**
   * 远端用户暂停/重新发送音频流回调。该回调是由远端用户调用 {@link muteLocalAudioStream} 方法关闭或开启音频发送触发的。
   * 包含如下参数：
   * - uid：用户 ID
   * - muted：该用户是否关闭发送音频流：
   *   - true：该用户已关闭发送音频流
   *   - false：该用户已重新发送音频流
   *
   * **Note**：当频道内的用户或主播人数超过 20 时，该回调不生效。
   */
  on(evt: 'userMuteAudio', cb: (uid: number, muted: boolean) => void): this;
  /**
   * 远端用户暂停/重新发送视频流回调。该回调是由远端用户调用 {@link muteLocalVideoStream} 方法关闭或开启音频发送触发的。
   * 包含如下参数：
   * - uid：用户 ID
   * - muted：该用户是否关闭发送视频流：
   *   - true：该用户已关闭发送视频流
   *   - false：该用户已重新发送视频流
   *
   * **Note**：当频道内的用户或主播人数超过 20 时，该回调不生效。
   */
  on(evt: 'userMuteVideo', cb: (uid: number, muted: boolean) => void): this;
  /**
   * 其他用户开启/关闭视频模块回调。该回调是由远端用户调用 {@link enableVideo} 或 {@link disableVideo} 方法开启或关闭视频模块触发的。
   * 包含如下参数：
   * - uid：用户 ID
   * - muted：该用户是否开启或关闭视频模块：
   *   - true：该用户已启用视频模块。启用后，该用户可以进行视频通话或直播。
   *   - false：该用户已关闭视频模块。关闭后，该用户只能进行语音通话或直播，不能显示、发送自己的视频，也不能接收、显示别人的视频。
   */
  on(evt: 'userEnableVideo', cb: (uid: number, enabled: boolean) => void): this;
  /**
   * 远端用户开启/关闭本地视频采集。该回调是由远端用户调用 {@link enableLocalVideo} 方法开启或关闭视频采集触发的。
   * 包含如下参数：
   * - uid：用户 ID
   * - enabled：该用户是否开启或关闭本地视频采集：
   *   - true：该用户已启用本地视频采集。启用后，其他用户可以接收到该用户的视频流。
   *   - false：该用户已关闭视频采集。关闭后，该用户仍然可以接收其他用户的视频流，但其他用户接收不到该用户的视频流。
   */
  on(evt: 'userEnableLocalVideo', cb: (uid: number, enabled: boolean) => void): this;
  /**
   * 摄像头就绪回调。
   */
  on(evt: 'cameraReady', cb: () => void): this;
  /**
   * 视频功能停止回调。
   */
  on(evt: 'videoStopped', cb: () => void): this;
  /**
   * 网络连接中断，且 SDK 无法在 10 秒内连接服务器回调。
   * SDK 在调用 {@link join} 后，无论是否加入成功，只要 10 秒和服务器无法连接就会触发该回调。
   *
   */
  on(evt: 'connectionLost', cb: () => void): this;
  // on(evt: 'connectionInterrupted', cb: () => void): this;
  /**
   * 网络连接已被服务器禁止回调。
   * @deprecated 该回调已废弃。请改用 connectionStateChanged 回调。
   * 当你被服务端禁掉连接的权限时，会触发该回调。
   */
  on(evt: 'connectionBanned', cb: () => void): this;
  // on(evt: 'refreshRecordingServiceStatus', cb: () => void): this;
  /**
   * 接收到对方数据流消息的回调。该回调表示本地用户收到了远端用户调用 {@link sendStreamMessage} 方法发送的流消息。
   * 包含如下参数：
   * - uid：用户 ID
   * - streamId：数据流 ID
   * - msg：接收到的流消息
   * - len：流消息数据长度
   */
  on(evt: 'streamMessage', cb: (
    uid: number,
    streamId: number,
    msg: string,
    len: number
  ) => void): this;
  /**
   * 接收对方数据流小时发生错误回调。该回调表示本地用户未收到远端用户调用 {@link sendStreamMessage} 方法发送的流消息。
   * 包含如下参数：
   * - uid：用户 ID
   * - streamId：数据流 ID
   * - err：错误代码
   * - missed：丢失的消息数量
   * - cached：数据流中断后，后面缓存的消息数量
   */
  on(evt: 'streamMessageError', cb: (
    uid: number,
    streamId: number,
    code: number,
    missed: number,
    cached: number
  ) => void): this;
  /**
   * 媒体引擎成功启动的回调。
   */
  on(evt: 'mediaEngineStartCallSuccess', cb: () => void): this;
  /**
   * Token 已过期回调。
   * 在调用 {@link join} 时如果指定了 Token，由于 Token 具有一定的时效，在通话过程中 SDK 可能由于网络原因和服务器失去连接，
   重连时可能需要新的 Token。该回调通知 App 需要生成新的 Token，并需调用 {@link renewToken} 为 SDK 指定新的 Token。
   */
  on(evt: 'requestChannelKey', cb: () => void): this;
  /**
   * 已发送本地音频首帧回调。包含如下参数：
   * - elapsed：从本地用户调用 {@link join} 方法直至该回调被触发的延迟（毫秒）
   */
  on(evt: 'fristLocalAudioFrame', cb: (elapsed: number) => void): this;
  /**
   * 已接收远端音频首帧回调。包含如下参数：
   * - uid：发送音频帧的远端用户的 ID
   * - elapsed：从调用 {@link join} 方法直至该回调被触发的延迟（毫秒）
   */
  on(evt: 'firstRemoteAudioFrame', cb: (uid: number, elapsed: number) => void): this;
  /**
   * 检测到活跃用户回调。包含如下参数：
   * - uid：当前时间段声音最大的用户的 uid。如果返回的 uid 为 0，则默认为本地用户
   *
   * 如果用户开启了 {@link enableAudioVolumeIndication} 功能，则当音量检测模块监测到频道内有新的活跃用户说话时，会通过本回调返回该用户的 uid。
   * **Note**：
   * - 你需要开启 {@link enableAudioVolumeIndication} 方法才能收到该回调。
   * - uid 返回的是当前时间段内声音最大的用户 ID，而不是瞬时声音最大的用户 ID。
   */
  on(evt: 'activeSpeaker', cb: (uid: number) => void): this;
  /**
   * 用户角色已切换回调。该回调由本地用户在加入频道后调用 {@link setClientRole} 改变用户角色触发的。
   * 包含如下参数：
   * - oldRole：切换前的角色
   * - newRole：切换后的角色
   */
  on(evt: 'clientRoleChanged', cb: (
    oldRole: ClientRoleType,
    newRole: ClientRoleType
  ) => void): this;
  /**
   * 回放、录音设备、或 App 的音量发生改变。包含如下参数：
   * - deviceType：设备类型，详见 {@link AgoraRtcEngine.MediaDeviceType MediaDeviceType}
   * - volume：当前音量，取值范围为 [0, 255]
   * - muted：音频设备是否为静音状态
   *   - true：音频设备已静音
   *   - false：音频设备未被静音
   */
  on(evt: 'audioDeviceVolumeChanged', cb: (
    deviceType: MediaDeviceType,
    volume: number,
    muted: boolean
  ) => void): this;
  /**
   * 屏幕共享对象成功加入频道回调。包含如下参数：
   * - uid：该对象的用户 ID
   */
  on(evt: 'videoSourceJoinedSuccess', cb: (uid: number) => void): this;
  /**
   * 屏幕共享对象 Token 已过期回调。
   */
  on(evt: 'videoSourceRequestNewToken', cb: () => void): this;
  /**
   * 屏幕共享对象离开频道回调。
   */
  on(evt: 'videoSourceLeaveChannel', cb: () => void): this;
  /**
   * 远端用户视频流状态发生改变回调。包含如下参数：
   * - uid：发生视频流状态改变的远端用户的用户 ID
   * - state：远端视频流状态。详见 {@link AgoraRtcEngine.RemoteVideoState RemoteVideoState}
   */
  on(evt: 'remoteVideoStateChanged', cb: (uid: number, state: RemoteVideoState) => void): this;
  /**
   * 相机对焦区域已改变回调。包含如下参数：
   * - x：发生改变的对焦区域的 x 坐标。
   * - y：发生改变的对焦区域的 y 坐标。
   * - width：发生改变的对焦区域的宽度。
   * - height：发生改变的对焦区域的高度。
   */
  on(evt: 'cameraFocusAreaChanged', cb: (x: number, y: number, width: number, height: number) => void): this;
  /**
   * 摄像头曝光区域已改变回调。包含如下参数：
   * - x：发生改变的曝光区域的 x 坐标。
   * - y：发生改变的曝光区域的 y 坐标。
   * - width：发生改变的曝光区域的宽度。
   * - height：发生改变的曝光区域的高度。
   */
  on(evt: 'cameraExposureAreaChanged', cb: (x: number, y: number, width: number, height: number) => void): this;
  /**
   * Token 服务即将过期回调。
   * 在调用 {@link join} 时如果指定了 Token，由于 Token 具有一定的时效，在通话过程中如果 Token 即将失效，SDK 会提前 30 秒触发该回调，提醒 App 更新 Token。
   当收到该回调时，用户需要重新在服务端生成新的 Token，然后调用 {@link renewToken} 将新生成的 Token 传给 SDK。
   * 包含如下参数：
   * - token：即将服务失效的 Token
   */
  on(evt: 'tokenPrivilegeWillExpire', cb: (token: string) => void): this;
  /**
   * 开启旁路推流的结果回调。
   * 该回调返回 {@link addPublishStreamUrl} 方法的调用结果。用于通知主播是否推流成功。
   如果不成功，你可以在 error 参数中查看详细的错误信息。
   * 包含如下参数：
   * - url：新增的推流地址。
   * - error：详细的错误信息：
   *   - 0：推流成功
   *   - 1：推流失败
   *   - 2：参数错误。如果你在调用 {@link addPublishStreamUrl} 前没有调用 {@link setLiveTranscoding} 配置 LiveTranscoding，SDK 会返回该错误
   *   - 10：推流超时未成功
   *   - 19：推流地址已经在推流
   *   - 130：推流已加密不能推流
   */
  on(evt: 'streamPublished', cb: (url: string, error: number) => void): this;
  /**
   * 停止旁路推流的结果回调。
   * 该回调返回 {@link removePublishStreamUrl} 方法的调用结果。用于通知主播是否停止推流成功。
   * 包含如下参数：
   * - url：主播停止推流的 RTMP 地址。
   */
  on(evt: 'streamUnpublished', cb: (url: string) => void): this;
  /**
   * 旁路推流设置被更新回调。该回调用于通知主播 CDN 转码已成功更新。
   */
  on(evt: 'transcodingUpdated', cb: () => void): this;
  /**
   * 导入在线媒体流状态回调。该回调表明向直播导入的外部视频流的状态。
   * 包含如下参数：
   * - url：导入进直播的外部视频源的 URL 地址。
   * - uid：用户 ID。
   * - status：导入的外部视频源状态：
   *   - 0：外部视频流导入成功
   *   - 1：外部视频流已存在
   *   - 2：外部视频流导入未经授权
   *   - 3：导入外部视频流超时
   *   - 4：外部视频流导入失败
   *   - 5：外部视频流停止导入失败
   *   - 6：未找到要停止导入的外部视频流
   *   - 7：要停止导入的外部视频流未经授权
   *   - 8：停止导入外部视频流超时
   *   - 9：停止导入外部视频流失败
   *   - 10：导入的外部视频流被中断
   */
  on(evt: 'streamInjectStatus', cb: (url: string, uid: number, status: number) => void): this;
  /**
   * 本地发布流已回退为音频流回调。
   *
   * 如果你调用了设置本地推流回退选项 {@link setLocalPublishFallbackOption} 接口并将 option 设置为 AUDIO_ONLY(2) 时，
   当上行网络环境不理想、本地发布的媒体流回退为音频流时，或当上行网络改善、媒体流恢复为音视频流时，会触发该回调。
   如果本地推流已回退为音频流，远端的 App 上会收到 userMuteVideo 的回调事件。
   *
   * 包含如下参数：
   * isFallbackOrRecover：本地推流已回退或恢复：
   * - true：由于网络环境不理想，本地发布的媒体流已回退为音频流
   * - false：由于网络环境改善，发布的音频流已恢复为音视频流
   */
  on(evt: 'localPublishFallbackToAudioOnly', cb: (isFallbackOrRecover: boolean) => void): this;
  /**
   * 远端订阅流已回退为音频流回调。
   *
   * 如果你调用了设置远端订阅流回退选项 {@link setRemoteSubscribeFallbackOption} 接口并将 option 设置为 AUDIO_ONLY(2) 时，
   当下行网络环境不理想、仅接收远端音频流时，或当下行网络改善、恢复订阅音视频流时，会触发该回调。
   远端订阅流因弱网环境不能同时满足音视频而回退为小流时，你可以使用 remoteVideoStats 回调来监控远端视频大小流的切换。
   *
   * 包含如下参数：
   * - uid：远端用户的 ID
   * - isFallbackOrRecover：远端订阅流已回退或恢复：
   *   - true：由于网络环境不理想，远端订阅流已回退为音频流
   *   - false：由于网络环境改善，订阅的音频流已恢复为音视频流
   */
  on(evt: 'remoteSubscribeFallbackToAudioOnly', cb: (
    uid: number,
    isFallbackOrRecover: boolean
  ) => void): this;
  /**
   * 麦克风状态已改变回调。该回调由本地用户开启或关闭本地音频采集触发的。
   * 包含如下参数：
   * - enabled：
   *   - true：麦克风已启用
   *   - false：麦克风已禁用
   */
  on(evt: 'microphoneEnabled', cb: (enabled: boolean) => void): this;
  /**
   * 网络连接状态已改变回调。
   * 该回调在网络连接状态发生改变的时候触发，并告知用户当前的网络连接状态，和引起网络状态改变的原因。
   * 包含如下参数：
   * - state：当前的网络连接状态，详见 {@link AgoraRtcEngine.ConnectionState ConnectionState}
   * - reason：引起当前网络连接状态发生改变的原因，详见 {@link AgoraRtcEngine.ConnectionChangeReason ConnectionChangeReason}
   */
  on(evt: 'connectionStateChanged', cb: (
    state: ConnectionState,
    reason: ConnectionChangeReason
  ) => void): this;
  /**
   * 监听 AgoraRtcEngine 运行时的事件。
   */
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
