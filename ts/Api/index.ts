import {
  SoftwareRenderer,
  GlRenderer,
  IRenderer,
  CustomRenderer
} from '../Renderer';
import {
  NodeRtcEngine,
  RtcStats,
  LocalVideoStats,
  LocalAudioStats,
  RemoteVideoStats,
  RemoteAudioStats,
  RemoteVideoTransportStats,
  RemoteAudioTransportStats,
  RemoteVideoState,
  RemoteVideoStateReason,
  RemoteAudioState,
  RemoteAudioStateReason,
  AgoraNetworkQuality,
  LastmileProbeResult,
  ClientRoleType,
  StreamType,
  ConnectionState,
  ConnectionChangeReason,
  MediaDeviceType,
  TranscodingConfig,
  InjectStreamConfig,
  VoiceChangerPreset,
  AudioReverbPreset,
  LastmileProbeConfig,
  Priority,
  ScreenSymbol,
  CaptureRect,
  CaptureParam,
  VideoContentHint,
  VideoEncoderConfiguration,
  UserInfo,
  RendererOptions,
  Metadata,
  RTMP_STREAMING_EVENT,
  AREA_CODE,
  STREAM_PUBLISH_STATE,
  STREAM_SUBSCRIBE_STATE,
  AUDIO_ROUTE_TYPE,
  EncryptionConfig,
  LocalTranscoderConfiguration,
  RenderType,
  MediaStreamInfo,
  MEDIA_PLAYER_PLAY_SPEED,
  NodeMediaPlayer,
  MEDIA_PLAYER_STATE,
  MEDIA_PLAYER_ERROR,
  MEDIA_PLAYER_EVENT,
  CameraCapturerConfiguration,
  ScreenCaptureConfiguration,
  VIDEO_SOURCE_TYPE
} from './native_type';
import { EventEmitter } from 'events';
import { deprecate, config, Config } from '../Utils';
import { ChannelMediaOptions, WatermarkOptions } from './native_type';
import {
  ChannelMediaRelayEvent,
  ChannelMediaRelayState,
  ChannelMediaRelayError,
  ChannelMediaRelayConfiguration
} from './native_type';
import {
  PluginInfo,
  Plugin
} from './plugin';
const agora = require('../../build/Release/agora_node_ext');

/**
 * The AgoraRtcEngine class.
 */
class AgoraRtcEngine extends EventEmitter {
  rtcEngine: NodeRtcEngine;
  streams: Map<number, Map<number, IRenderer[]>>;
  localStreams: Map<number, Map<number, IRenderer[]>>;
  renderMode: 1 | 2 | 3;
  customRenderer: any;
  constructor() {
    super();
    this.rtcEngine = new agora.NodeRtcEngine();
    this.initEventHandler();
    this.streams = new Map();
    this.localStreams = new Map();
    this.renderMode = this._checkWebGL() ? 1 : 2;
    this.customRenderer = CustomRenderer;
  }

  /**
   * return sdk config object
   */
  getConfigObject(): Config {
    return config
  }

  /**
   * Decide whether to use webgl/software/custom rendering.
   * @param {1|2|3} mode:
   * - 1 for old webgl rendering.
   * - 2 for software rendering.
   * - 3 for custom rendering.
   */
  setRenderMode(mode: 1 | 2 | 3 = 1): void {
    this.renderMode = mode;
  }

  /**
   * Use this method to set custom Renderer when set renderMode in the 
   * {@link setRenderMode} method to 3.
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
   * @return {boolean}
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
      gl =
        canvas.getContext('webgl', options) ||
        canvas.getContext('experimental-webgl', options);
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

    this.rtcEngine.onEvent('joinchannel', function(
      connId: number,
      channel: string,
      uid: number,
      elapsed: number
    ) {
      fire('joinedchannel', connId, channel, uid, elapsed);
      fire('joinedChannel', connId, channel, uid, elapsed);
    });

    this.rtcEngine.onEvent('rejoinchannel', function(
      connId: number,
      channel: string,
      uid: number,
      elapsed: number
    ) {
      fire('rejoinedchannel', connId, channel, uid, elapsed);
      fire('rejoinedChannel', connId, channel, uid, elapsed);
    });

    this.rtcEngine.onEvent('warning', function(connId: number, warn: number, msg: string) {
      fire('warning', connId, warn, msg);
    });

    this.rtcEngine.onEvent('error', function(connId: number, err: number, msg: string) {
      fire('error', connId, err, msg);
    });

    // this.rtcEngine.onEvent('audioquality', function(uid: number, quality: AgoraNetworkQuality, delay: number, lost: number) {
    //   fire('audioquality', uid, quality, delay, lost);
    //   fire('audioQuality', uid, quality, delay, lost);
    // });

    this.rtcEngine.onEvent('audiovolumeindication', function(
      connId: number,
      speakers: {
        uid: number;
        volume: number;
        vad: boolean;
      }[],
      speakerNumber: number,
      totalVolume: number
    ) {
      fire('audioVolumeIndication', connId, speakers, speakerNumber, totalVolume);
      fire('groupAudioVolumeIndication', connId, speakers, speakerNumber, totalVolume);
    });

    this.rtcEngine.onEvent('leavechannel', function(connId: number, rtcStats: RtcStats) {
      fire('leavechannel', connId, rtcStats);
      fire('leaveChannel', connId, rtcStats);
    });

    this.rtcEngine.onEvent('rtcstats', function(connId: number, stats: RtcStats) {
      fire('rtcstats', connId, stats);
      fire('rtcStats', connId, stats);
    });

    this.rtcEngine.onEvent('localvideostats', function(connId: number, stats: LocalVideoStats) {
      fire('localvideostats', connId, stats);
      fire('localVideoStats', connId, stats);
    });

    this.rtcEngine.onEvent('localAudioStats', function(connId: number, stats: LocalAudioStats) {
      fire('localAudioStats', connId, stats);
    });

    this.rtcEngine.onEvent('remotevideostats', function(
      connId: number,
      stats: RemoteVideoStats
    ) {
      fire('remotevideostats', connId, stats);
      fire('remoteVideoStats', connId, stats);
    });

    this.rtcEngine.onEvent('remoteAudioStats', function(
      connId: number,
      stats: RemoteAudioStats
    ) {
      fire('remoteAudioStats', connId, stats);
    });

    this.rtcEngine.onEvent('remoteAudioTransportStats', function(
      connId: number,
      uid: number,
      delay: number,
      lost: number,
      rxKBitRate: number
    ) {
      fire('remoteAudioTransportStats', connId, {
        uid,
        delay,
        lost,
        rxKBitRate
      });
    });

    this.rtcEngine.onEvent('remoteVideoTransportStats', function(
      connId: number,
      uid: number,
      delay: number,
      lost: number,
      rxKBitRate: number
    ) {
      fire('remoteVideoTransportStats', connId, {
        uid,
        delay,
        lost,
        rxKBitRate
      });
    });

    this.rtcEngine.onEvent('audiodevicestatechanged', function(
      connId: number,
      deviceId: string,
      deviceType: number,
      deviceState: number
    ) {
      fire('audiodevicestatechanged', connId, deviceId, deviceType, deviceState);
      fire('audioDeviceStateChanged', connId, deviceId, deviceType, deviceState);
    });

    // this.rtcEngine.onEvent('audiomixingfinished', function() {
    //   fire('audiomixingfinished');
    //   fire('audioMixingFinished');
    // });

    this.rtcEngine.onEvent('audioMixingStateChanged', function(
      connId: number,
      state: number,
      err: number
    ) {
      fire('audioMixingStateChanged', connId, state, err);
    });

    this.rtcEngine.onEvent('apicallexecuted', function(
      connId: number,
      api: string,
      err: number
    ) {
      fire('apicallexecuted', connId, api, err);
      fire('apiCallExecuted', connId, api, err);
    });

    // this.rtcEngine.onEvent('remoteaudiomixingbegin', function() {
    //   fire('remoteaudiomixingbegin');
    //   fire('remoteAudioMixingBegin');
    // });

    // this.rtcEngine.onEvent('remoteaudiomixingend', function() {
    //   fire('remoteaudiomixingend');
    //   fire('remoteAudioMixingEnd');
    // });

    this.rtcEngine.onEvent('audioeffectfinished', function(connId: number, soundId: number) {
      fire('audioeffectfinished', connId, soundId);
      fire('audioEffectFinished', connId, soundId);
    });

    this.rtcEngine.onEvent('videodevicestatechanged', function(
      connId: number,
      deviceId: string,
      deviceType: number,
      deviceState: number
    ) {
      fire('videodevicestatechanged', connId, deviceId, deviceType, deviceState);
      fire('videoDeviceStateChanged', connId, deviceId, deviceType, deviceState);
    });

    this.rtcEngine.onEvent('networkquality', function(
      connId: number,
      uid: number,
      txquality: AgoraNetworkQuality,
      rxquality: AgoraNetworkQuality
    ) {
      fire('networkquality', connId, uid, txquality, rxquality);
      fire('networkQuality', connId, uid, txquality, rxquality);
    });

    this.rtcEngine.onEvent('lastmilequality', function(
      connId: number,
      quality: AgoraNetworkQuality
    ) {
      fire('lastmilequality', connId, quality);
      fire('lastMileQuality', connId, quality);
    });

    this.rtcEngine.onEvent('lastmileProbeResult', function(
      connId: number,
      result: LastmileProbeResult
    ) {
      fire('lastmileProbeResult', connId, result);
    });

    this.rtcEngine.onEvent('firstlocalvideoframe', function(
      connId: number,
      width: number,
      height: number,
      elapsed: number
    ) {
      fire('firstlocalvideoframe', connId, width, height, elapsed);
      fire('firstLocalVideoFrame', connId, width, height, elapsed);
    });

    this.rtcEngine.onEvent('firstremotevideodecoded', function(
      connId: number,
      uid: number,
      width: number,
      height: number,
      elapsed: number
    ) {
      fire('addstream', connId, uid, elapsed);
      fire('addStream', connId, uid, elapsed);
      fire('firstRemoteVideoDecoded', connId, uid, width, height, elapsed);
    });

    this.rtcEngine.onEvent('videosizechanged', function(
      connId: number,
      uid: number,
      width: number,
      height: number,
      rotation: number
    ) {
      fire('videosizechanged', connId, uid, width, height, rotation);
      fire('videoSizeChanged', connId, uid, width, height, rotation);
    });

    // this.rtcEngine.onEvent('firstremotevideoframe', function(
    //   uid: number,
    //   width: number,
    //   height: number,
    //   elapsed: number
    // ) {
    //   fire('firstremotevideoframe', uid, width, height, elapsed);
    //   fire('firstRemoteVideoFrame', uid, width, height, elapsed);
    // });

    this.rtcEngine.onEvent('userjoined', function(
      connId: number,
      uid: number,
      elapsed: number
    ) {
      console.log('user : ' + uid + 'connid :' + connId + ' joined.');
      fire('userjoined', connId, uid, elapsed);
      fire('userJoined', connId, uid, elapsed);
    });

    this.rtcEngine.onEvent('useroffline', function(
      connId: number,
      uid: number,
      reason: number
    ) {
      fire('userOffline', connId, uid, reason);
      if (!self.streams) {
        self.streams = new Map();
        console.log('Warning!!!!!!, streams is undefined.');
        return;
      }
      self.destroyRemoteRender(uid, connId);
      self.rtcEngine.unsubscribe(1, uid, connId, 0);
      fire('removestream', connId, uid, reason);
      fire('removeStream', connId, uid, reason);
    });

    // this.rtcEngine.onEvent('usermuteaudio', function(
    //   uid: number,
    //   muted: boolean
    // ) {
    //   fire('usermuteaudio', uid, muted);
    //   fire('userMuteAudio', uid, muted);
    // });

    this.rtcEngine.onEvent('usermutevideo', function(
      connId: number,
      uid: number,
      muted: boolean
    ) {
      fire('usermutevideo', connId, uid, muted);
      fire('userMuteVideo', connId, uid, muted);
    });

    this.rtcEngine.onEvent('userenablevideo', function(
      connId: number,
      uid: number,
      enabled: boolean
    ) {
      fire('userenablevideo', connId, uid, enabled);
      fire('userEnableVideo', connId, uid, enabled);
    });

    this.rtcEngine.onEvent('userenablelocalvideo', function(
      connId: number,
      uid: number,
      enabled: boolean
    ) {
      fire('userenablelocalvideo', connId, uid, enabled);
      fire('userEnableLocalVideo', connId, uid, enabled);
    });

    this.rtcEngine.onEvent('cameraready', function(connId: number) {
      fire('cameraready', connId);
      fire('cameraReady', connId);
    });

    this.rtcEngine.onEvent('videostopped', function(connId: number) {
      fire('videostopped', connId);
      fire('videoStopped', connId);
    });

    this.rtcEngine.onEvent('connectionlost', function(connId: number) {
      fire('connectionlost', connId);
      fire('connectionLost', connId);
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
      connId: number,
      uid: number,
      streamId: number,
      msg: string,
      len: number
    ) {
      fire('streammessage', connId, uid, streamId, msg, len);
      fire('streamMessage', connId, uid, streamId, msg, len);
    });

    this.rtcEngine.onEvent('streammessageerror', function(
      connId: number,
      uid: number,
      streamId: number,
      code: number,
      missed: number,
      cached: number
    ) {
      fire('streammessageerror', connId, uid, streamId, code, missed, cached);
      fire('streamMessageError', connId, uid, streamId, code, missed, cached);
    });

    this.rtcEngine.onEvent('mediaenginestartcallsuccess', function(connId: number) {
      fire('mediaenginestartcallsuccess', connId);
      fire('mediaEngineStartCallSuccess', connId);
    });

    // this.rtcEngine.onEvent('requestchannelkey', function() {
    //   fire('requestchannelkey');
    //   fire('requestChannelKey');
    // });

    // this.rtcEngine.onEvent('firstlocalaudioframe', function(elapsed: number) {
    //   fire('firstlocalaudioframe', elapsed);
    //   fire('firstLocalAudioFrame', elapsed);
    // });

    // this.rtcEngine.onEvent('firstremoteaudioframe', function(
    //   uid: number,
    //   elapsed: number
    // ) {
    //   fire('firstremoteaudioframe', uid, elapsed);
    //   fire('firstRemoteAudioFrame', uid, elapsed);
    // });

    // this.rtcEngine.onEvent('firstRemoteAudioDecoded', function(
    //   uid: number,
    //   elapsed: number
    // ) {
    //   fire('firstRemoteAudioDecoded', uid, elapsed);
    // });

    this.rtcEngine.onEvent('remoteVideoStateChanged', function(
      connId: number,
      uid: number,
      state: RemoteVideoState,
      reason: RemoteVideoStateReason,
      elapsed: number
    ) {
      fire('remoteVideoStateChanged', connId, uid, state, reason, elapsed);
    });

    this.rtcEngine.onEvent('cameraFocusAreaChanged', function(
      connId: number,
      x: number,
      y: number,
      width: number,
      height: number
    ) {
      fire('cameraFocusAreaChanged', connId, x, y, width, height);
    });

    this.rtcEngine.onEvent('cameraExposureAreaChanged', function(
      connId: number,
      x: number,
      y: number,
      width: number,
      height: number
    ) {
      fire('cameraExposureAreaChanged', connId, x, y, width, height);
    });

    this.rtcEngine.onEvent('tokenPrivilegeWillExpire', function(connId: number, token: string) {
      fire('tokenPrivilegeWillExpire', connId, token);
    });

    this.rtcEngine.onEvent('streamPublished', function(
      connId: number, 
      url: string,
      error: number
    ) {
      fire('streamPublished', connId, url, error);
    });

    this.rtcEngine.onEvent('streamUnpublished', function(connId: number, url: string) {
      fire('streamUnpublished', connId, url);
    });

    this.rtcEngine.onEvent('transcodingUpdated', function(connId: number) {
      fire('transcodingUpdated', connId);
    });

    this.rtcEngine.onEvent('streamInjectStatus', function(
      connId: number, 
      url: string,
      uid: number,
      status: number
    ) {
      fire('streamInjectStatus', connId, url, uid, status);
    });

    this.rtcEngine.onEvent('localPublishFallbackToAudioOnly', function(
      connId: number, 
      isFallbackOrRecover: boolean
    ) {
      fire('localPublishFallbackToAudioOnly', connId, isFallbackOrRecover);
    });

    this.rtcEngine.onEvent('remoteSubscribeFallbackToAudioOnly', function(
      connId: number, 
      uid: number,
      isFallbackOrRecover: boolean
    ) {
      fire('remoteSubscribeFallbackToAudioOnly', connId, uid, isFallbackOrRecover);
    });

    // this.rtcEngine.onEvent('microphoneEnabled', function(enabled: boolean) {
    //   fire('microphoneEnabled', enabled);
    // });

    this.rtcEngine.onEvent('connectionStateChanged', function(
      connId: number, 
      state: ConnectionState,
      reason: ConnectionChangeReason
    ) {
      fire('connectionStateChanged', connId, state, reason);
    });

    this.rtcEngine.onEvent('activespeaker', function(connId: number, uid: number) {
      fire('activespeaker', connId, uid);
      fire('activeSpeaker', connId, uid);
    });

    this.rtcEngine.onEvent('clientrolechanged', function(
      connId: number, 
      oldRole: ClientRoleType,
      newRole: ClientRoleType
    ) {
      fire('clientrolechanged', connId, oldRole, newRole);
      fire('clientRoleChanged', connId, oldRole, newRole);
    });

    this.rtcEngine.onEvent('audiodevicevolumechanged', function(
      connId: number, 
      deviceType: MediaDeviceType,
      volume: number,
      muted: boolean
    ) {
      fire('audiodevicevolumechanged', connId, deviceType, volume, muted);
      fire('audioDeviceVolumeChanged', connId, deviceType, volume, muted);
    });

    // this.rtcEngine.onEvent('localUserRegistered', function(
    //   uid: number,
    //   userAccount: string
    // ) {
    //   fire('localUserRegistered', uid, userAccount);
    // });

    // this.rtcEngine.onEvent('userInfoUpdated', function(
    //   uid: number,
    //   userInfo: UserInfo
    // ) {
    //   fire('userInfoUpdated', uid, userInfo);
    // });

    this.rtcEngine.onEvent('localVideoStateChanged', function(
      connId: number, 
      localVideoState: number,
      err: number
    ) {
      fire('localVideoStateChanged', connId, localVideoState, err);
    });

    this.rtcEngine.onEvent('localAudioStateChanged', function(
      connId: number, 
      state: number,
      err: number
    ) {
      fire('localAudioStateChanged', connId, state, err);
    });

    this.rtcEngine.onEvent('remoteAudioStateChanged', function(
      connId: number, 
      uid: number,
      state: RemoteAudioState,
      reason: RemoteAudioStateReason,
      elapsed: number
    ) {
      fire('remoteAudioStateChanged', connId, uid, state, reason, elapsed);
    });

    // this.rtcEngine.onEvent('audioMixingStateChanged', function(
    //   state: number,
    //   errorCode: number
    // ) {
    //   fire('audioMixingStateChanged', state, errorCode);
    // });

    // this.rtcEngine.onEvent('channelMediaRelayState', function(
    //   state: ChannelMediaRelayState,
    //   code: ChannelMediaRelayError
    // ) {
    //   fire('channelMediaRelayState', state, code);
    // });

    // this.rtcEngine.onEvent('channelMediaRelayEvent', function(
    //   event: ChannelMediaRelayEvent
    // ) {
    //   fire('channelMediaRelayEvent', event);
    // });

    this.rtcEngine.onEvent('rtmpStreamingStateChanged', function(connId: number, url:string, state: number, errCode: number) {
      fire('rtmpStreamingStateChanged', connId, url, state, errCode);
    })

    this.rtcEngine.onEvent('firstLocalAudioFramePublished', function(connId: number, elapsed: number) {
      fire('firstLocalAudioFramePublished', connId, elapsed);
    })

    this.rtcEngine.onEvent('videoSourceFrameSizeChanged', function(sourceType: VIDEO_SOURCE_TYPE, width: number, height: number) {
      fire('videoSourceFrameSizeChanged', sourceType, width, height);
    })

    this.rtcEngine.onEvent('mediaDeviceChanged', function(connId: number, deviceType: number) {
      fire('mediaDeviceChanged', connId, deviceType);
    })

    this.rtcEngine.onEvent('extensionEvent', function(id: string, key: string, jsonValue: string) {
      fire('extensionEvent', id, key, jsonValue);
    })
    

    // this.rtcEngine.onEvent('firstLocalVideoFramePublished', function(elapsed: number) {
    //   fire('firstLocalVideoFramePublished', elapsed);
    // })

    // this.rtcEngine.onEvent('rtmpStreamingEvent', function(url: string, eventCode: RTMP_STREAMING_EVENT) {
    //   fire('rtmpStreamingEvent', url, eventCode);
    // })

    // this.rtcEngine.onEvent('audioPublishStateChanged', function(channel: string, oldState: STREAM_PUBLISH_STATE, newState: STREAM_PUBLISH_STATE, elapseSinceLastState: number) {
    //   fire('audioPublishStateChanged', channel, oldState, newState, elapseSinceLastState);
    // })

    // this.rtcEngine.onEvent('videoPublishStateChanged', function(channel: string, oldState: STREAM_PUBLISH_STATE, newState: STREAM_PUBLISH_STATE, elapseSinceLastState: number) {
    //   fire('videoPublishStateChanged', channel, oldState, newState, elapseSinceLastState);
    // })

    // this.rtcEngine.onEvent('audioSubscribeStateChanged', function(channel: string, uid: number, oldState: STREAM_SUBSCRIBE_STATE, newState: STREAM_SUBSCRIBE_STATE, elapseSinceLastState: number) {
    //   fire('audioSubscribeStateChanged', channel, uid, oldState, newState, elapseSinceLastState);
    // })
  
    // this.rtcEngine.onEvent('videoSubscribeStateChanged', function(channel: string, uid: number, oldState: STREAM_SUBSCRIBE_STATE, newState: STREAM_SUBSCRIBE_STATE, elapseSinceLastState: number) {
    //   fire('videoSubscribeStateChanged', channel, uid, oldState, newState, elapseSinceLastState);
    // })

    this.rtcEngine.onEvent('audioRouteChanged', function(connId: number, routing: AUDIO_ROUTE_TYPE) {
      fire('audioRouteChanged', connId, routing);
    })

    this.rtcEngine.registerDeliverFrame(function(infos: any) {
      self.onRegisterDeliverFrame(infos);
    });
  }

  /**
   * @private
   * @ignore
   * @param {number} type 0-local 1-remote 2-device_test 3-screen_share 4-transcoded
   * @param {number} uid uid get from native engine, differ from electron engine's uid
   * @param {number} connId connId get from native engine when join channel
   * @param {number} deviceId deviceId local device id, support multiple cameras or screen share
   */
  _getRenderers(type: number, uid: number, connId: number, deviceId: number): IRenderer[] | undefined {
    if (type === 1) {
      let channelStreams = this._getChannelRenderers(connId);
      return channelStreams.get(uid)
    } else if (type === 0 || type === 3 || type === 4) {
      let localRenderers = this._getLocalRenderers(type);
      return localRenderers.get(deviceId);
    } else if (type === 2) {
      console.warn('Type 2 not support in production mode.');
      return;
    } else {
      console.warn('Invalid type for getRenderer, only accept 0~4.');
      return;
    }
  }

  _getChannelRenderers(connId: number): Map<number, IRenderer[]> {
    let channel: Map<number, IRenderer[]>;
    if(!this.streams.has(connId)) {
      channel = new Map()
      this.streams.set(connId, channel)
    } else {
      channel = this.streams.get(connId) as Map<number, IRenderer[]>
    }
    return channel
  }

  _getLocalRenderers(type: number): Map<number, IRenderer[]> {
    let renderers: Map<number, IRenderer[]>;
    if (!this.localStreams.has(type)) {
      renderers = new Map();
      this.localStreams.set(type, renderers);
    } else {
      renderers = this.localStreams.get(type) as Map<number, IRenderer[]>;
    }
    return renderers;
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
    vdata: ArrayBuffer
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
      const { type, uid, connectionId, deviceId, header, ydata, udata, vdata } = info;
      if (!header || !ydata || !udata || !vdata) {
        console.log(
          'Invalid data param ： ' +
            header +
            ' ' +
            ydata +
            ' ' +
            udata +
            ' ' +
            vdata
        );
        continue;
      }
      const renderers = this._getRenderers(type, uid, connectionId, deviceId);
      if (!renderers || renderers.length === 0) {
        console.warn(`Can't find renderer for uid : ${uid} `);
        continue;
      }

      if (this._checkData(header, ydata, udata, vdata)) {
        renderers.forEach(renderer => {
          renderer.drawFrame({
            header,
            yUint8Array: ydata,
            uUint8Array: udata,
            vUint8Array: vdata
          });
        })
      }
    }
  }

  /**
   * Resizes the renderer.
   *
   * When the size of the view changes, this method refresh the zoom level so 
   * that video is sized appropriately while waiting for the next video frame 
   * to arrive.
   * 
   * Calling this method prevents a view discontinutity.
   * @param {number} type 0-local 3-screen_share 4-transcoded
   * @param {number} uid uid get from native engine, differ from electron engine's uid
   * @param {number} connId connId get from native engine when join channel
   * @param {number} deviceId deviceId local device id, support multiple cameras or screen share
   */
  resizeRender(type: number, uid: number, connId: number, deviceId: number) {
    const renderers = this._getRenderers(type, uid, connId, deviceId) || [];
    renderers.forEach(renderer => renderer.refreshCanvas());
  }

    /**
   * Initializes the local renderer.
   * @param {number} type 0-local 3-screen_share 4-transcoded
   * @param {number} deviceId deviceId local device id, support multiple cameras or screen share
   * @param view The Dom elements to render the video.
   */
  initLocalRender(type: number, devicdId: number, view: Element, options?: RendererOptions) {
    if (type != 0 && type != 3 && type != 4) {
      console.warn('Invalid type for initLocalRender, local render type should be 0, 3, 4.');
      return;
    }
    let rendererOptions = {
      append: options ? options.append : false
    }
    let localRenderers = this._getLocalRenderers(type);

    if (localRenderers.has(devicdId)) {
      if(!rendererOptions.append) {
        this.destroyLocalRender(type, devicdId);
      } else {
        let renderers = localRenderers.get(devicdId) || []
        for(let i = 0; i < renderers.length; i++) {
          if(renderers[i].equalsElement(view)){
            console.log(`view exists in renderer list, ignore`)
            return
          }
        }
      }
    }
    localRenderers = this._getLocalRenderers(type);
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

    if(!rendererOptions.append) {
      localRenderers.set(devicdId, [renderer]);
    } else {
      let renderers = localRenderers.get(devicdId) || []
      renderers.push(renderer)
      localRenderers.set(devicdId, renderers)
    }
  }

  /**
   * Initializes the remote renderer.
   * @param {number} uid uid get from native engine, differ from electron engine's uid
   * @param {number} connId connId get from native engine when join channel
   * @param view The Dom elements to render the video.
   */
  initRemoteRender(uid: number, connId: number, view: Element, options?: RendererOptions) {
    let rendererOptions = {
      append: options ? options.append : false
    }
    let channelStreams = this._getChannelRenderers(connId)

    if (channelStreams.has(uid)) {
      if(!rendererOptions.append) {
        this.destroyRemoteRender(uid, connId);
      } else {
        let renderers = channelStreams.get(uid) || []
        for(let i = 0; i < renderers.length; i++) {
          if(renderers[i].equalsElement(view)){
            console.log(`view exists in renderer list, ignore`)
            return
          }
        }
      }
    }
    channelStreams = this._getChannelRenderers(connId)
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

    if(!rendererOptions.append) {
      channelStreams.set(uid, [renderer]);
    } else {
      let renderers = channelStreams.get(uid) || []
      renderers.push(renderer)
      channelStreams.set(uid, renderers)
    }
  }

  destroyLocalRenderView(
    type: number, deviceId: number, view: Element,
    onFailure?: (err: Error) => void
  ) {
    if (type != 0 && type != 3 && type != 4) {
      console.warn('Invalid type for destroyLocalRenderView, local render type should be 0, 3, 4.');
      return;
    }

    let localRenderers = this._getLocalRenderers(type)
    if (!localRenderers.has(deviceId)) {
      return;
    }
    const renderers = localRenderers.get(deviceId) || [];
    const matchRenderers = renderers.filter(renderer => renderer.equalsElement(view))
    const otherRenderers = renderers.filter(renderer => !renderer.equalsElement(view))

    if(matchRenderers.length > 0) {
      let renderer = matchRenderers[0]
      try {
        (renderer as IRenderer).unbind();
        if(otherRenderers.length > 0) {
          // has other renderers left, update
          localRenderers.set(deviceId, otherRenderers)
        } else {
          // removed renderer is the only one, remove
          localRenderers.delete(deviceId);
        }
        if(localRenderers.size === 0) {
          this.localStreams.delete(type)
        }
      } catch (err) {
        onFailure && onFailure(err)
      }
    }

  }

  destroyRemoteRenderView(
    uid: number, connId: number, view: Element,
    onFailure?: (err: Error) => void
  ) {
    let channelStreams = this._getChannelRenderers(connId)
    if (!channelStreams.has(uid)) {
      return;
    }
    const renderers = channelStreams.get(uid) || [];
    const matchRenderers = renderers.filter(renderer => renderer.equalsElement(view))
    const otherRenderers = renderers.filter(renderer => !renderer.equalsElement(view))

    if(matchRenderers.length > 0) {
      let renderer = matchRenderers[0]
      try {
        (renderer as IRenderer).unbind();
        if(otherRenderers.length > 0) {
          // has other renderers left, update
          channelStreams.set(uid, otherRenderers)
        } else {
          // removed renderer is the only one, remove
          channelStreams.delete(uid);
        }
        if(channelStreams.size === 0) {
          this.streams.delete(connId)
        }
      } catch (err) {
        onFailure && onFailure(err)
      }
    }

  }


  /**
   * Destroys the local renderer.
   * @param {number} type 0-local 2-device_test 3-screen_share 4-transcoded
   * @param {number} deviceId deviceId local device id, support multiple cameras or screen share
   * @param onFailure The error callback for the {@link destroyLocalRender} 
   * method.
   */
  destroyLocalRender(
    type: number, deviceId: number,
    onFailure?: (err: Error) => void
  ) {
    if (type != 0 && type != 3 && type != 4) {
      console.warn('Invalid type for destroyLocalRender, local render type should be 0, 3, 4.');
      return;
    }
    let localRenderers = this._getLocalRenderers(type)
    if (!localRenderers.has(deviceId)) {
      return;
    }
    const renderers = localRenderers.get(deviceId) || [];

    let exception = null
    for(let i = 0; i < renderers.length; i++) {
      let renderer = renderers[i]
      try {
        (renderer as IRenderer).unbind();
        localRenderers.delete(deviceId);
        if(localRenderers.size === 0) {
          this.localStreams.delete(type);
        }
      } catch (err) {
        exception = err
        console.error(`${err.stack}`)
      }
    }
    if(exception) {
      onFailure && onFailure(exception)
    }
  }


  /**
   * Destroys the remote renderer.
   * @param {number} uid uid get from native engine, differ from electron engine's uid
   * @param {number} connId connId get from native engine when join channel
   * @param onFailure The error callback for the {@link destroyRemoteRender} 
   * method.
   */
  destroyRemoteRender(
    uid: number, connId: number,
    onFailure?: (err: Error) => void
  ) {
    let channelStreams = this._getChannelRenderers(connId)
    if (!channelStreams.has(uid)) {
      return;
    }
    const renderers = channelStreams.get(uid) || [];

    let exception = null
    for(let i = 0; i < renderers.length; i++) {
      let renderer = renderers[i]
      try {
        (renderer as IRenderer).unbind();
        channelStreams.delete(uid);
        if(channelStreams.size === 0) {
          this.streams.delete(connId)
        }
      } catch (err) {
        exception = err
        console.error(`${err.stack}`)
      }
    }
    if(exception) {
      onFailure && onFailure(exception)
    }
  }

  // ===========================================================================
  // BASIC METHODS
  // ===========================================================================

  /**
   * Initializes the agora real-time-communicating engine with your App ID.
   * @param appid The App ID issued to you by Agora.
   * @return 
   * - 0: Success.
   * - < 0: Failure.
   *  - `ERR_INVALID_APP_ID (101)`: The app ID is invalid. Check if it is in 
   * the correct format.
   */
  initialize(appid: string, areaCode: AREA_CODE = (0xFFFFFFFF)): number {
    return this.rtcEngine.initialize(appid, areaCode);
  }

  createMediaPlayer(): AgoraMediaPlayer {
    let mediaPlayer = this.rtcEngine.createMediaPlayer()
    return new AgoraMediaPlayer(mediaPlayer);
  }

  /**
   * Returns the version and the build information of the current SDK.
   * @return The version of the current SDK.
   */
  getVersion(): string {
    return this.rtcEngine.getVersion();
  }

  /**
   * Retrieves the error description.
   * @param {number} errorCode The error code.
   * @return The error description.
   */
  getErrorDescription(errorCode: number): string {
    return this.rtcEngine.getErrorDescription(errorCode);
  }

  /**
   * Gets the connection state of the SDK.
   * @return {ConnectionState} Connect states. See {@link ConnectionState}.
   */
  getConnectionState(): ConnectionState {
    return this.rtcEngine.getConnectionState();
  }

  /**
   * Allows a user to join a channel.
   *
   * Users in the same channel can talk to each other, and multiple users in 
   * the same channel can start a group chat.
   * Users with different App IDs cannot call each other.You must call the 
   * {@link leaveChannel} method to exit the current call
   * before entering another channel.
   *
   * This method call triggers the following callbacks:
   *
   * - The local client: joinedChannel
   * - The remote client: userJoined, if the user joining the channel is in 
   * the Communication profile,
   * or is a BROADCASTER in the Live Broadcast profile.
   *
   * When the connection between the client and Agora's server is interrupted 
   * due to poor network conditions,
   * the SDK tries reconnecting to the server. When the local client 
   * successfully rejoins the channel, the SDK
   * triggers the rejoinedChannel callback on the local client.
   *
   * @param {string} token token The token generated at your server:
   * - For low-security requirements: You can use the temporary token 
   * generated at Console. For details, see 
   * [Get a temporary token](https://docs.agora.io/en/Voice/token?platform=All%20Platforms#get-a-temporary-token).
   * - For high-security requirements: Set it as the token generated at your 
   * server. For details, see 
   * [Get a token](https://docs.agora.io/en/Voice/token?platform=All%20Platforms#get-a-token).
   * @param {string} channel (Required) Pointer to the unique channel name for 
   * the Agora RTC session in the string format smaller than 64 bytes. 
   * Supported characters:
   * - The 26 lowercase English letters: a to z.
   * - The 26 uppercase English letters: A to Z.
   * - The 10 numbers: 0 to 9.
   * - The space.
   * - "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", 
   * ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
   * @param {string} info (Optional) Pointer to additional information about 
   * the channel. This parameter can be set to NULL or contain channel related 
   * information.
   * Other users in the channel will not receive this message.
   * @param {number} uid The User ID. A 32-bit unsigned integer with a value 
   * ranging from 1 to 2<sup>32</sup>-1. The `uid` must be unique. If a `uid` 
   * is not assigned (or set to 0),
   * the SDK assigns a `uid`.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *  - `ERR_INVALID_ARGUMENT (2)`
   *  - `ERR_NOT_READY (3)`
   *  - `ERR_REFUSED (5) `
   */
  joinChannel(
    token: string,
    channel: string,
    info: string,
    uid: number
  ): number {
    return this.rtcEngine.joinChannel(token, channel, info, uid);
  }

  /**
   * Allows a user to leave a channel.
   *
   * Allows a user to leave a channel, such as hanging up or exiting a call. 
   * The user must call the method to end the call before
   * joining another channel after call the {@link joinChannel} method.
   * This method returns 0 if the user leaves the channel and releases all 
   * resources related to the call.
   * This method call is asynchronous, and the user has not left the channel 
   * when the method call returns.
   *
   * Once the user leaves the channel, the SDK triggers the leavechannel 
   * callback.
   *
   * A successful leavechannel method call triggers the removeStream callback 
   * for the remote client when the user leaving the channel
   * is in the Communication channel, or is a BROADCASTER in the Live Broadcast 
   * profile.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  leaveChannel(): number {
    return this.rtcEngine.leaveChannel();
  }

  /**
   * Releases the AgoraRtcEngine instance.
   *
   * Once the App calls this method to release the created AgoraRtcEngine 
   * instance, no other methods in the SDK
   * can be used and no callbacks can occur. To start it again, initialize 
   * {@link initialize} to establish a new
   * AgoraRtcEngine instance.
   *
   * **Note**: Call this method in the subthread.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  release(): number {
    return this.rtcEngine.release();
  }

  /**
   * Subscribes to a remote user and initializes the corresponding renderer.
   * @param {number} uid The user ID of the remote user.
   * @param {number} connId connId get from native engine when join channel
   * @param {Element} view The Dom where to initialize the renderer.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */

  setupRemoteView(uid: number, connId: number, view?: Element, options?: RendererOptions): number {
    if(view) {
      //bind
      this.initRemoteRender(uid, connId, view, options);
      return this.rtcEngine.subscribe(1, uid, connId, 0);
    } else {
      //unbind
      this.destroyRemoteRender(uid, connId);
      return this.rtcEngine.unsubscribe(1, uid, connId, 0);
    }
  }

  /**
   * Sets the local video view and the corresponding renderer.
   * @param {number} type 0-local 3-screen_share 4-transcoded
   * @param {number} deviceId deviceId local device id, support multiple cameras or screen share
   * @param {Element} view The Dom element where you initialize your view.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setupLocalView(type: number, deviceId: number, view: Element, options?: RendererOptions): number {
    if (view) {
      this.initLocalRender(type, deviceId, view, options);
      return this.rtcEngine.subscribe(type, 0, 0, deviceId);
    } else {
      this.destroyLocalRender(type, deviceId);
      return this.rtcEngine.unsubscribe(type, 0, 0, deviceId);
    }
  }

  /**
   * Sets the renderer dimension of video.
   *
   * This method ONLY affects size of data sent to js layer, while native video 
   * size is determined by {@link setVideoEncoderConfiguration}.
   * @param {*} rendertype The renderer type:
   * - 0: The local renderer.
   * - 1: The remote renderer.
   * - 2: The device test
   * - 3: The video source.
   * - 4: The transcoded video
   * @param {*} uid The user ID of the targeted user.
   * @param {*} width The target width.
   * @param {*} height The target height.
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
   * Sets the global renderer frame rate (fps).
   *
   * This method is mainly used to improve the performance of js rendering
   * once set, the video data will be sent with this frame rate. This can 
   * reduce the CPU consumption of js rendering.
   * This applies to ALL views except the ones added to the high frame rate 
   * stream.
   * @param {number} fps The renderer frame rate (fps).
   */
  setVideoRenderFPS(fps: number) {
    this.rtcEngine.setFPS(fps);
  }

  /**
   * Sets renderer frame rate for the high stream.
   *
   * The high stream here has nothing to do with the dual stream.
   * It means the stream that is added to the high frame rate stream by calling 
   * the {@link addVideoRenderToHighFPS} method.
   *
   * This is often used when we want to set the low frame rate for most of 
   * views, but high frame rate for one
   * or two special views, e.g. screen sharing.
   * @param {number} fps The renderer high frame rate (fps).
   */
  setVideoRenderHighFPS(fps: number) {
    this.rtcEngine.setHighFPS(fps);
  }

  /**
   * Adds a video stream to the high frame rate stream.
   * Streams added to the high frame rate stream will be controlled by the 
   * {@link setVideoRenderHighFPS} method.
   * @param {number} uid The User ID.
   */
  addVideoRenderToHighFPS(uid: number) {
    this.rtcEngine.addToHighVideo(uid);
  }

  /**
   * Removes a stream from the high frame rate stream.
   * Streams removed from the high frame rate stream will be controlled by the 
   * {@link setVideoRenderFPS} method.
   * @param {number} uid The User ID.
   */
  removeVideoRenderFromHighFPS(uid: number) {
    this.rtcEngine.removeFromHighVideo(uid);
  }

  /**
   * Sets the remote view content mode.
   * When setting up the view content of the remote user's stream, 
   * make sure you have subscribed to that stream by calling the 
   * {@link setupRemoteView} method.
   * @param {number} uid The user ID of the remote user.
   * @param {number} connId connId get from native engine when join channel
   * @param {0|1} mode The view content mode:
   * - 0: Cropped mode. Uniformly scale the video until it fills the visible 
   * boundaries (cropped). One dimension of the video may have clipped 
   * contents.
   * - 1: Fit mode. Uniformly scale the video until one of its dimension fits 
   * the boundary (zoomed to fit). Areas that are not filled due to the 
   * disparity
   * in the aspect ratio will be filled with black.
   * @return
   * - 0: Success.
   * - -1: Failure.
   */
  setupRemoteViewContentMode(
    uid: number,
    connId: number,
    mode: 0 | 1
  ): number {
    let channelStreams = this._getChannelRenderers(connId)
    if (channelStreams.has(uid)) {
      const renderers = channelStreams.get(uid) || [];
      for(let i = 0; i < renderers.length; i++) {
        let renderer = renderers[i];
        (renderer as IRenderer).setContentMode(mode);
      }
      return 0;
    } else {
      return -1;
    }
  }

  /**
   * Sets the local view content mode.
   * When setting up the view content of the local user's stream, 
   * make sure you have subscribed to that stream by calling the 
   * {@link setupLocalView} method.
   * @param {number} type 0-local 3-screen_share 4-transcoded
   * @param {number} deviceId deviceId local device id, support multiple cameras or screen share
   * @param {0|1} mode The view content mode:
   * - 0: Cropped mode. Uniformly scale the video until it fills the visible 
   * boundaries (cropped). One dimension of the video may have clipped 
   * contents.
   * - 1: Fit mode. Uniformly scale the video until one of its dimension fits 
   * the boundary (zoomed to fit). Areas that are not filled due to the 
   * disparity
   * in the aspect ratio will be filled with black.
   * @return
   * - 0: Success.
   * - -1: Failure.
   */
  setupLocalViewContentMode(
    type: number,
    deviceId: number,
    mode: 0 | 1
  ): number {
    if (type != 0 && type != 3 && type != 4) {
      console.warn('Invalid type for initLocalRender, local render type should be 0, 3, 4.');
      return -1;
    }
    let localRenderers = this._getLocalRenderers(type)
    if (localRenderers.has(deviceId)) {
      const renderers = localRenderers.get(deviceId) || [];
      for(let i = 0; i < renderers.length; i++) {
        let renderer = renderers[i];
        (renderer as IRenderer).setContentMode(mode);
      }
      return 0;
    } else {
      return -1;
    }
  }

  /**
   * Renews the token when the current token expires.
   *
   * The key expires after a certain period of time once the Token schema is 
   * enabled when:
   * - The onError callback reports the ERR_TOKEN_EXPIRED(109) error, or
   * - The requestChannelKey callback reports the ERR_TOKEN_EXPIRED(109) error, 
   * or
   * - The user receives the tokenPrivilegeWillExpire callback.
   *
   * The app should retrieve a new token from the server and then call this 
   * method to renew it. Failure to do so results in the SDK disconnecting 
   * from the server.
   * @param {string} newtoken The new token.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  renewToken(newtoken: string): number {
    return this.rtcEngine.renewToken(newtoken);
  }

  /**
   * Sets the channel profile.
   *
   * The AgoraRtcEngine applies different optimization according to the app 
   * scenario.
   *
   * **Note**:
   * -  Call this method before the {@link joinChannel} method.
   * - Users in the same channel must use the same channel profile.
   * @param {number} profile The channel profile:
   * - 0: for communication
   * - 1: for live broadcasting
   * - 2: for in-game
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setChannelProfile(profile: number): number {
    return this.rtcEngine.setChannelProfile(profile);
  }

  /**
   * Sets the role of a user (Live Broadcast only).
   *
   * This method sets the role of a user, such as a host or an audience 
   * (default), before joining a channel.
   *
   * This method can be used to switch the user role after a user joins a 
   * channel. In the Live Broadcast profile,
   * when a user switches user roles after joining a channel, a successful 
   * {@link setClientRole} method call triggers the following callbacks:
   * - The local client: clientRoleChanged
   * - The remote client: userJoined
   *
   * @param {ClientRoleType} role The client role:
   *
   * - 1: The broadcaster
   * - 2: The audience
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setClientRole(role: ClientRoleType): number {
    return this.rtcEngine.setClientRole(role);
  }

  /**
   * @deprecated The method is deprecated. Use 
   * {@link startEchoTestWithInterval} instead.
   * Starts an audio call test.
   *
   * This method launches an audio call test to determine whether the audio 
   * devices (for example, headset and speaker) and the network connection are 
   * working properly.
   *
   * To conduct the test, the user speaks, and the recording is played back 
   * within 10 seconds.
   * 
   * If the user can hear the recording in 10 seconds, it indicates that 
   * the audio devices
   * and network connection work properly.
   *
   * **Note**:
   * - Call this method before the {@link joinChannel} method.
   * - After calling this method, call the {@link stopEchoTest} method to end 
   * the test. Otherwise, the app cannot run the next echo test,
   * nor can it call the {@link joinChannel} method to start a new call.
   * - In the Live Broadcast profile, only hosts can call this method.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  startEchoTest(): number {
    deprecate('startEchoTestWithInterval');
    return this.rtcEngine.startEchoTest();
  }

  /**
   * Stops the audio call test.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  stopEchoTest(): number {
    return this.rtcEngine.stopEchoTest();
  }

  /**
   * @since v3.0.0
   * 
   * Adds a watermark image to the local video.
   * 
   * This method adds a PNG watermark image to the local video in a live 
   * broadcast. Once the watermark image is added, all the audience in the 
   * channel (CDN audience included), and the recording device can see and 
   * capture it. Agora supports adding only one watermark image onto the local 
   * video, and the newly watermark image replaces the previous one.
   * 
   * The watermark position depends on the settings in the 
   * {@link setVideoEncoderConfiguration} method:
   * - If the orientation mode of the encoding video is LANDSCAPE, the 
   * landscape mode in ADAPTIVE, the watermark uses the landscape orientation.
   * - If the orientation mode of the encoding video is PORTRAIT, or the 
   * portrait mode in ADAPTIVE, the watermark uses the portrait orientation.
   * - hen setting the watermark position, the region must be less than the 
   * dimensions set in the {@link setVideoEncoderConfiguration} method. 
   * Otherwise, the watermark image will be cropped.
   * 
   * @note
   * - Ensure that you have called {@link enableVideo} before this method.
   * - If you only want to add a watermark image to the local video for the 
   * audience in the CDN live broadcast channel to see and capture, you can 
   * call this method or {@link setLiveTranscoding}.
   * - This method supports adding a watermark image in the PNG file format 
   * only. Supported pixel formats of the PNG image are RGBA, RGB, Palette, 
   * Gray, and Alpha_gray.
   * - If the dimensions of the PNG image differ from your settings in this 
   * method, the image will be cropped or zoomed to conform to your settings.
   * - If you have enabled the local video preview by calling 
   * {@link startPreview}, you can use the `visibleInPreview` member in the 
   * WatermarkOptions class to set whether or not the watermark is visible in 
   * preview.
   * - If you have enabled the mirror mode for the local video, the watermark 
   * on the local video is also mirrored. To avoid mirroring the watermark, 
   * Agora recommends that you do not use the mirror and watermark functions 
   * for the local video at the same time. You can implement the watermark 
   * function in your application layer.
   * @param path The local file path of the watermark image to be added. This 
   * method supports adding a watermark image from the local absolute or 
   * relative file path.
   * @param options The watermark's options. See {@link WatermarkOptions}
   * 
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  addVideoWatermark(path:string, options: WatermarkOptions){
    return this.rtcEngine.addVideoWatermark(path, options)
  }
  /**
   * Removes the watermark image from the video stream added by the
   * {@link addVideoWatermark} method.
   * 
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  clearVideoWatermarks(){
    return this.rtcEngine.clearVideoWatermarks();
  }

  /**
   * Starts the last-mile network probe test before
   * joining a channel to get the uplink and downlink last-mile network 
   * statistics,
   * including the bandwidth, packet loss, jitter, and average round-trip 
   * time (RTT).
   *
   * Once this method is enabled, the SDK returns the following callbacks:
   * - lastmileQuality: the SDK triggers this callback within two seconds 
   * depending on the network conditions.
   * This callback rates the network conditions with a score and is more 
   * closely linked to the user experience.
   * - lastmileProbeResult: the SDK triggers this callback within 30 seconds 
   * depending on the network conditions.
   * This callback returns the real-time statistics of the network conditions 
   * and is more objective.
   *
   * Call this method to check the uplink network quality before users join 
   * a channel or before an audience switches to a host.
   *
   * **Note**:
   * - This method consumes extra network traffic and may affect communication 
   * quality. We do not recommend calling this method together with 
   * {@link enableLastmileTest}.
   * - Do not call other methods before receiving the lastmileQuality and 
   * lastmileProbeResult callbacks. Otherwise, the callbacks may be interrupted 
   * by other methods.
   * - In the Live Broadcast profile, a host should not call this method after 
   * joining a channel.
   *
   * @param {LastmileProbeConfig} config The configurations of the last-mile 
   * network probe test. See  {@link LastmileProbeConfig}.
   */
  startLastmileProbeTest(config: LastmileProbeConfig): number {
    return this.rtcEngine.startLastmileProbeTest(config);
  }

  /**
   * Stops the last-mile network probe test.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  stopLastmileProbeTest(): number {
    return this.rtcEngine.stopLastmileProbeTest();
  }

  /**
   * Enables the video module.
   *
   * You can call this method either before joining a channel or during a call. 
   * If you call this method before joining a channel,
   * the service starts in the video mode. If you call this method during an 
   * audio call, the audio mode switches to the video mode.
   *
   * To disable the video, call the {@link disableVideo} method.
   *
   * **Note**:
   * - This method affects the internal engine and can be called after calling 
   * the {@link leaveChannel} method. You can call this method either before 
   * or after joining a channel.
   * - This method resets the internal engine and takes some time to take 
   * effect. We recommend using the following API methods to control the video 
   * engine modules separately:
   *   - {@link enableLocalVideo}: Whether to enable the camera to create the 
   * local video stream.
   *   - {@link muteLocalVideoStream}: Whether to publish the local video 
   * stream.
   *   - {@link muteLocalVideoStream}: Whether to publish the local video 
   * stream.
   *   - {@link muteAllRemoteVideoStreams}: Whether to subscribe to and play 
   * all remote video streams.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  enableVideo(): number {
    return this.rtcEngine.enableVideo();
  }

  /**
   * Disables the video module.
   *
   * You can call this method before joining a channel or during a call. If you 
   * call this method before joining a channel,
   * the service starts in audio mode. If you call this method during a video 
   * call, the video mode switches to the audio mode.
   *
   * To enable the video mode, call the {@link enableVideo} method.
   *
   * **Note**:
   * - This method affects the internal engine and can be called after calling 
   * the {@link leaveChannel} method. You can call this method either before 
   * or after joining a channel.
   * - This method resets the internal engine and takes some time to take 
   * effect. We recommend using the following API methods to control the video 
   * engine modules separately:
   *   - {@link enableLocalVideo}: Whether to enable the camera to create the 
   * local video stream.
   *   - {@link muteLocalVideoStream}: Whether to publish the local video 
   * stream.
   *   - {@link muteLocalVideoStream}: Whether to publish the local video 
   * stream.
   *   - {@link muteAllRemoteVideoStreams}: Whether to subscribe to and play 
   * all remote video streams.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  disableVideo(): number {
    return this.rtcEngine.disableVideo();
  }

  /**
   * Starts the local video preview before joining a channel.
   *
   * Before starting the preview, always call {@link setupLocalVideo} to set 
   * up the preview window and configure the attributes,
   * and also call the {@link enableVideo} method to enable video.
   *
   * If startPreview is called to start the local video preview before 
   * calling {@link joinChannel} to join a channel, the local preview
   * remains after after you call {@link leaveChannel} to leave the channel. 
   * Call {@link stopPreview} to disable the local preview.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  startPreview(): number {
    return this.rtcEngine.startPreview();
  }

  /**
   * Stops the local video preview and closes the video.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  stopPreview(): number {
    return this.rtcEngine.stopPreview();
  }

  /**
   * Sets the video encoder configuration.
   *
   * Each video encoder configuration corresponds to a set of video parameters, 
   * including the resolution, frame rate, bitrate, and video orientation.
   * The parameters specified in this method are the maximum values under ideal 
   * network conditions. If the video engine cannot render the video using
   * the specified parameters due to poor network conditions, the parameters 
   * further down the list are considered until a successful configuration is 
   * found.
   *
   * If you do not set the video encoder configuration after joining the 
   * channel, you can call this method before calling the {@link enableVideo}
   * method to reduce the render time of the first video frame.
   * @param {VideoEncoderConfiguration} config - The local video encoder 
   * configuration. See {@link VideoEncoderConfiguration}.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setVideoEncoderConfiguration(config: VideoEncoderConfiguration): number {
    const {
      width = 640,
      height = 480,
      frameRate = 15,
      bitrate = 0,
      minBitrate = -1,
      orientationMode = 0,
      degradationPreference = 0,
      mirrorMode = 0
    } = config;
    return this.rtcEngine.setVideoEncoderConfiguration({
      width,
      height,
      frameRate,
      bitrate,
      minBitrate,
      orientationMode,
      degradationPreference,
      mirrorMode
    });
  }

  /**
   * Sets the priority of a remote user's media stream.
   *
   * Use this method with the {@link setRemoteSubscribeFallbackOption} method. 
   * If the fallback function is enabled for a subscribed stream, the SDK 
   * ensures
   * the high-priority user gets the best possible stream quality.
   *
   * **Note**: The Agora SDK supports setting userPriority as high for one 
   * user only.
   * @param {number} uid The ID of the remote user.
   * @param {Priority} priority The priority of the remote user. See {@link Priority}.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setRemoteUserPriority(uid: number, priority: Priority) {
    return this.rtcEngine.setRemoteUserPriority(uid, priority);
  }

  /**
   * Enables the audio module.
   *
   * The audio module is enabled by default.
   *
   * **Note**:
   * - This method affects the internal engine and can be called after calling 
   * the {@link leaveChannel} method. You can call this method either before 
   * or after joining a channel.
   * - This method resets the internal engine and takes some time to take 
   * effect. We recommend using the following API methods to control the 
   * audio engine modules separately:
   *   - {@link enableLocalAudio}: Whether to enable the microphone to create 
   * the local audio stream.
   *   - {@link muteLocalAudioStream}: Whether to publish the local audio 
   * stream.
   *   - {@link muteRemoteAudioStream}: Whether to subscribe to and play the 
   * remote audio stream.
   *   - {@link muteAllRemoteAudioStreams}: Whether to subscribe to and play 
   * all remote audio streams.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  enableAudio(): number {
    return this.rtcEngine.enableAudio();
  }

  /**
   * Disables the audio module.
   *
   * **Note**:
   * - This method affects the internal engine and can be called after calling 
   * the {@link leaveChannel} method. You can call this method either before 
   * or after joining a channel.
   * - This method resets the internal engine and takes some time to take 
   * effect. We recommend using the following API methods to control the audio 
   * engine modules separately:
   *   - {@link enableLocalAudio}: Whether to enable the microphone to create 
   * the local audio stream.
   *   - {@link muteLocalAudioStream}: Whether to publish the local audio 
   * stream.
   *   - {@link muteRemoteAudioStream}: Whether to subscribe to and play the 
   * remote audio stream.
   *   - {@link muteAllRemoteAudioStreams}: Whether to subscribe to and play 
   * all remote audio streams.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  disableAudio(): number {
    return this.rtcEngine.disableAudio();
  }

  /**
   * Sets audio parameters and application scenarios.
   * @param {number} profile Sets the sample rate, bitrate, encoding mode, and 
   * the number of channels:
   * - 0: Default. 
   *  - macOS: A sample rate of 32 kHz, music encoding, mono, and a bitrate of 
   * up to 44 Kbps.
   *  - Windows: A sample rate of 32 kHz, music encoding, mono, and a bitrate 
   * of up to 64 Kbps.
   * - 1: speech standard. A sample rate of 32 kHz, audio encoding, mono, and 
   * a bitrate of up to 18 Kbps.
   * - 2: Music standard. A sample rate of 48 kHz, music encoding, mono, and 
   * a bitrate of up to 48 Kbps.
   * - 3: Music standard stereo. A sample rate of 48 kHz, music encoding, 
   * stereo, and a bitrate of up to 56 Kbps.
   * - 4: Music high quality. A sample rate of 48 kHz, music encoding, mono, 
   * and a bitrate of up to 128 Kbps.
   * - 5: Music high quality stereo.  A sample rate of 48 kHz, music encoding, 
   * stereo, and a bitrate of up to 192 Kbps.
   * @param {number} scenario Sets the audio application scenarios:
   * - 0: Default.
   * - 1: Chatroom entertainment. The entertainment scenario, supporting voice 
   * during gameplay.
   * - 2: Education. The education scenario, prioritizing fluency and 
   * stability.
   * - 3: Game streaming. The live gaming scenario, enabling the gaming audio 
   * effects in the speaker mode in a live broadcast scenario. Choose this 
   * scenario for high-fidelity music playback.
   * - 4: Showroom. The showroom scenario, optimizing the audio quality with 
   * external professional equipment.
   * - 5: Chatroom gaming. The game chatting scenario.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setAudioProfile(
    profile: 0 | 1 | 2 | 3 | 4 | 5,
    scenario: 0 | 1 | 2 | 3 | 4 | 5
  ): number {
    return this.rtcEngine.setAudioProfile(profile, scenario);
  }

  /**
   * Enables built-in encryption with an encryption password before joining 
   * a channel.
   *
   * All users in a channel must set the same encryption password.
   * The encryption password is automatically cleared once a user has left 
   * the channel.
   * If the encryption password is not specified or set to empty, the 
   * encryption function will be disabled.
   *
   * **Note**:
   * - For optimal transmission, ensure that the encrypted data size does not 
   * exceed the original data size + 16 bytes. 16 bytes is the maximum padding 
   * size for AES encryption.
   * - Do not use this method for CDN live streaming.
   * @param {string} secret Encryption Password
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setEncryptionSecret(secret: string): number {
    return this.rtcEngine.setEncryptionSecret(secret);
  }

  /**
   * Sets the built-in encryption mode.
   *
   * The Agora SDK supports built-in encryption, which is set to aes-128-xts 
   * mode by default.
   * Call this method to set the encryption mode to use other encryption modes.
   * All users in the same channel must use the same encryption mode and 
   * password.
   *
   * Refer to the information related to the AES encryption algorithm on the 
   * differences between the encryption modes.
   *
   * **Note**: Call the {@link setEncryptionSecret} method before calling 
   * this method.
   * @param mode Sets the encryption mode:
   * - "aes-128-xts": 128-bit AES encryption, XTS mode.
   * - "aes-128-ecb": 128-bit AES encryption, ECB mode.
   * - "aes-256-xts": 256-bit AES encryption, XTS mode.
   * - "": When encryptionMode is set as null, the encryption is in 
   * “aes-128-xts” by default.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setEncryptionMode(mode: string): number {
    return this.rtcEngine.setEncryptionMode(mode);
  }

  /**
   * Stops/Resumes sending the local audio stream.
   *
   * A successful muteLocalAudioStream method call triggers the userMuteAudio 
   * callback on the remote client.
   * 
   * If you call {@link setChannelProfile} after this method, the SDK resets 
   * whether or not to mute the local audio according to the channel profile 
   * and user role. Therefore, we recommend calling this method after the 
   * {@link setChannelProfile} method.
   *
   * **Note**: muteLocalAudioStream(true) does not disable the microphone and 
   * thus does not affect any ongoing recording.
   * @param {boolean} mute Sets whether to send/stop sending the local audio 
   * stream:
   * - true: Stop sending the local audio stream.
   * - false: (Default) Send the local audio stream.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  muteLocalAudioStream(mute: boolean): number {
    return this.rtcEngine.muteLocalAudioStream(mute);
  }

  /**
   * Stops/Resumes receiving all remote audio streams.
   * @param {boolean} mute Sets whether to receive/stop receiving all remote 
   * audio streams:
   * - true: Stop receiving all remote audio streams.
   * - false: (Default) Receive all remote audio streams.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  muteAllRemoteAudioStreams(mute: boolean): number {
    return this.rtcEngine.muteAllRemoteAudioStreams(mute);
  }

  /**
   * Sets whether to receive all remote audio streams by default.
   *
   * You can call this method either before or after joining a channel. If you 
   * call `setDefaultMuteAllRemoteAudioStreams(true)` after joining a channel,
   * the remote audio streams of all subsequent users are not received.
   * 
   * @note If you want to resume receiving the audio stream, call 
   * {@link muteRemoteAudioStream}(false), and specify the ID of the remote 
   * user whose audio stream you want to receive. To receive the audio streams 
   * of multiple remote users, call {@link muteRemoteAudioStream}(false) as 
   * many times. Calling `setDefaultMuteAllRemoteAudioStreams(false)` resumes 
   * receiving the audio streams of subsequent users only.
   * @param {boolean} mute Sets whether or not to receive/stop receiving all 
   * remote audio streams by default:
   * - true: Stop receiving all remote audio streams by default.
   * - false: (Default) Receive all remote audio streams by default.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setDefaultMuteAllRemoteAudioStreams(mute: boolean): number {
    return this.rtcEngine.setDefaultMuteAllRemoteAudioStreams(mute);
  }

  /**
   * Stops/Resumes receiving a specified audio stream.
   * @param {number} uid ID of the specified remote user.
   * @param {boolean} mute Sets whether to receive/stop receiving the specified 
   * remote user's audio stream:
   * - true: Stop receiving the specified remote user’s audio stream.
   * - false: (Default) Receive the specified remote user’s audio stream.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  muteRemoteAudioStream(uid: number, mute: boolean, connectionId = 0): number {
    return this.rtcEngine.muteRemoteAudioStream(uid, mute, connectionId);
  }

  /**
   * Stops/Resumes sending the local video stream.
   *
   * A successful muteLocalVideoStream method call triggers the userMuteVideo 
   * callback on the remote client.
   * 
   * If you call {@link setChannelProfile} after this method, the SDK resets 
   * whether or not to mute the local video according to the channel profile 
   * and user role. Therefore, we recommend calling this method after the 
   * {@link setChannelProfile} method.
   *
   * **Note**: muteLocalVideoStream(true) does not disable the camera and thus 
   * does not affect the retrieval of the local video streams.
   * @param {boolean} mute Sets whether to send/stop sending the local video 
   * stream:
   * - true: Stop sending the local video stream.
   * - false: (Default) Send the local video stream.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  muteLocalVideoStream(mute: boolean): number {
    return this.rtcEngine.muteLocalVideoStream(mute);
  }

  /**
   * Disables/Re-enables the local video capture.
   *
   * This method disables or re-enables the local video capturer, and does not 
   * affect receiving the remote video stream.
   * 
   * After you call the {@link enableVideo} method, the local video capturer 
   * is enabled 
   * by default. You can call enableLocalVideo(false) to disable the local 
   * video capturer. If you want to re-enable it, call enableLocalVideo(true).
   * 
   * After the local video capturer is successfully disabled or re-enabled, 
   * the SDK triggers the userEnableVideo callback on the remote client.
   * 
   * @param {boolean} enable Sets whether to disable/re-enable the local video, 
   * including the capturer, renderer, and sender:
   * - true: (Default) Re-enable the local video.
   * - false: Disable the local video. Once the local video is disabled, the 
   * remote users can no longer receive the video stream of this user,
   * while this user can still receive the video streams of other remote users. 
   * When you set enabled as false, this method does not require a local 
   * camera.
   * 
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  enableLocalVideo(enable: boolean): number {
    return this.rtcEngine.enableLocalVideo(enable);
  }

  /**
   * Enables/Disables the local audio capture.
   *
   * The audio function is enabled by default. This method disables/re-enables 
   * the local audio function, that is, to stop or restart local audio capture 
   * and processing.
   *
   * This method does not affect receiving or playing the remote audio streams, 
   * and enableLocalAudio(false) is applicable to scenarios where the user 
   * wants to receive remote
   * audio streams without sending any audio stream to other users in the 
   * channel.
   * 
   * The SDK triggers the microphoneEnabled callback once the local audio 
   * function is disabled or re-enabled.
   *
   * @param {boolean} enable Sets whether to disable/re-enable the local audio 
   * function:
   * - true: (Default) Re-enable the local audio function, that is, to start 
   * local audio capture and processing.
   * - false: Disable the local audio function, that is, to stop local audio 
   * capture and processing.
   * 
   * **Note**:
   * - After you disable local audio recording using the 
   * `enableLocalAudio(false)` method, the system volume switches to the media 
   * volume. Re-enabling local audio recording using the 
   * `enableLocalAudio(true)` method switches the system volume back to the 
   * in-call volume.
   * - This method is different from the {@link muteLocalAudioStream} method:
   *  - enableLocalAudio: If you disable or re-enable local audio recording 
   * using the enableLocalAudio method, the local user may hear a pause in the 
   * remote audio playback.
   *  - {@link }muteLocalAudioStream: Stops/Continues sending the local audio 
   * streams and the local user will not hear a pause in the remote audio 
   * playback.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  enableLocalAudio(enable: boolean): number {
    return this.rtcEngine.enableLocalAudio(enable);
  }

  /**
   * Stops/Resumes receiving all remote video streams.
   *
   * @param {boolean} mute Sets whether to receive/stop receiving all remote 
   * video streams:
   * - true: Stop receiving all remote video streams.
   * - false: (Default) Receive all remote video streams.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  muteAllRemoteVideoStreams(mute: boolean): number {
    return this.rtcEngine.muteAllRemoteVideoStreams(mute);
  }

  /**
   * Sets whether to receive all remote video streams by default.
   * 
   * You can call this method either before or after joining a channel. If you 
   * call `setDefaultMuteAllRemoteVideoStreams(true)` after joining a channel,
   * the remote audio streams of all subsequent users are not received.
   * 
   * @note If you want to resume receiving the video stream, call 
   * {@link muteRemoteVideoStream}(false), and specify the ID of the remote 
   * user whose audio stream you want to receive. To receive the audio streams 
   * of multiple remote users, call {@link muteRemoteVideoStream}(false) as 
   * many times. Calling `setDefaultMuteAllRemoteVideoStreams(false)` resumes 
   * receiving the audio streams of subsequent users only.
   * Sets whether to receive all remote video streams by default.
   * 
   * @param {boolean} mute Sets whether to receive/stop receiving all remote 
   * video streams by default:
   * - true: Stop receiving all remote video streams by default.
   * - false: (Default) Receive all remote video streams by default.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setDefaultMuteAllRemoteVideoStreams(mute: boolean): number {
    return this.rtcEngine.setDefaultMuteAllRemoteVideoStreams(mute);
  }

  /**
   * Enables the `groupAudioVolumeIndication` callback at a set time interval to 
   * report on which users are speaking and the speakers' volume.
   *
   * Once this method is enabled, the SDK returns the volume indication in the 
   * groupAudioVolumeIndication callback at the set time interval,
   * regardless of whether any user is speaking in the channel.
   * 
   * @param {number} interval Sets the time interval between two consecutive 
   * volume indications:
   * - ≤ 0: Disables the volume indication.
   * - &gt; 0: Time interval (ms) between two consecutive volume indications. 
   * We recommend setting interval &ge; 200 ms.
   * @param {number} smooth The smoothing factor sets the sensitivity of the 
   * audio volume indicator. The value ranges between 0 and 10.
   * The greater the value, the more sensitive the indicator. The recommended 
   * value is 3.
   * @param {boolean} report_vad 
   * - `true`: Enable the voice activity detection of the local user. Once it is 
   * enabled, `vad` in the `groupAudioVolumeIndication` callback reports 
   * the voice activity status of the local user.
   * - `false`: (Default) Disables the voice activity detection of the local user. 
   * Once it is disabled, `vad` in the `groupAudioVolumeIndication` callback 
   * does not report the voice activity status of the local 
   * user, except for scenarios where the engine automatically detects 
   * the voice activity of the local user.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  enableAudioVolumeIndication(interval: number, smooth: number): number {
    return this.rtcEngine.enableAudioVolumeIndication(interval, smooth);
  }

  /**
   * Stops/Resumes receiving a specified remote user's video stream.
   * @param {number} uid User ID of the specified remote user.
   * @param {boolean} mute Sets whether to receive/stop receiving a specified 
   * remote user's video stream:
   * - true: Stop receiving a specified remote user’s video stream.
   * - false: (Default) Receive a specified remote user’s video stream.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  muteRemoteVideoStream(uid: number, mute: boolean, connectionId = 0): number {
    return this.rtcEngine.muteRemoteVideoStream(uid, mute, connectionId);
  }

  /**
   * @deprecated This method is deprecated. Use {@link disableAudio} instead.
   * Disables the audio function in the channel.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  pauseAudio() {
    deprecate('disableAudio');
    return this.rtcEngine.pauseAudio();
  }

  /**
   * @deprecated  This method is deprecated. Use {@link enableAudio} instead.
   * Resumes the audio function in the channel.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  resumeAudio() {
    deprecate('enableAudio');
    return this.rtcEngine.resumeAudio();
  }

  /**
   * Specifies an SDK output log file.
   *
   * The log file records all log data for the SDK’s operation. Ensure that 
   * the directory for the log file exists and is writable.
   *
   * @param {string} filepath File path of the log file. The string of the 
   * log file is in UTF-8.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setLogFile(filepath: string): number {
    return this.rtcEngine.setLogFile(filepath);
  }

  /**
   * Sets the log file size (KB).
   *
   * The Agora SDK has two log files, each with a default size of 512 KB.
   * If you set size as 1024 KB, the SDK outputs log files with a total 
   * maximum size of 2 MB.
   * If the total size of the log files exceed the set value, the new output 
   * log files overwrite the old output log files.
   * @param {number} size The SDK log file size (KB).
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setLogFileSize(size: number): number {
    return this.rtcEngine.setLogFileSize(size);
  }

  /**
   * Sets the output log level of the SDK.
   *
   * You can use one or a combination of the filters. The log level follows 
   * the sequence of OFF, CRITICAL, ERROR, WARNING, INFO, and DEBUG.
   * Choose a level to see the logs preceding that level. For example, if you 
   * set the log level to WARNING, you see the logs within levels CRITICAL,
   * ERROR, and WARNING.
   * @param {number} filter Sets the filter level:
   * - `0`: Do not output any log.
   * - `0x080f`: Output all the API logs. Set your log filter 
   * as DEBUG if you want to get the most complete log file.
   * - `0x000f`: Output logs of the CRITICAL, ERROR, WARNING and 
   * INFO level. We recommend setting your log filter as this level.
   * - `0x000e`: Output logs of the CRITICAL, ERROR and 
   * WARNING level.
   * - `0x000c`: Output logs of the CRITICAL and ERROR level.
   * - `0x0008`: Output logs of the CRITICAL level.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setLogFilter(filter: number): number {
    return this.rtcEngine.setLogFilter(filter);
  }

  /**
   * Enables/Disables the dual video stream mode.
   *
   * If dual-stream mode is enabled, the receiver can choose to receive the 
   * high stream (high-resolution high-bitrate video stream)
   * or low stream (low-resolution low-bitrate video stream) video.
   * @param {boolean} enable Sets the stream mode:
   * - true: Dual-stream mode.
   * - false: (Default) Single-stream mode.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  enableDualStreamMode(enable: boolean): number {
    return this.rtcEngine.enableDualStreamMode(enable);
  }

  /**
   * Sets the video stream type of the remotely subscribed video stream when 
   * the remote user sends dual streams.
   *
   * If the dual-stream mode is enabled by calling enableDualStreamMode, you 
   * will receive the
   * high-video stream by default. This method allows the application to adjust 
   * the
   * corresponding video-stream type according to the size of the video windows 
   * to save the bandwidth
   * and calculation resources.
   *
   * If the dual-stream mode is not enabled, you will receive the high-video 
   * stream by default.
   * The result after calling this method will be returned in 
   * apiCallExecuted. The Agora SDK receives
   * the high-video stream by default to save the bandwidth. If needed, users 
   * can switch to the low-video
   * stream using this method.
   * @param {number} uid ID of the remote user sending the video stream.
   * @param {StreamType} streamType Sets the video stream type:
   * - 0: High-stream video, the high-resolution, high-bitrate video.
   * - 1: Low-stream video, the low-resolution, low-bitrate video.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setRemoteVideoStreamType(uid: number, streamType: StreamType): number {
    return this.rtcEngine.setRemoteVideoStreamType(uid, streamType);
  }

  /**
   * Sets the default video-stream type of the remotely subscribed video stream 
   * when the remote user sends dual streams.
   * @param {StreamType} streamType Sets the video stream type:
   * - 0: High-stream video, the high-resolution, high-bitrate video.
   * - 1: Low-stream video, the low-resolution, low-bitrate video.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setRemoteDefaultVideoStreamType(streamType: StreamType): number {
    return this.rtcEngine.setRemoteDefaultVideoStreamType(streamType);
  }

  /** 
   * @deprecated This method is deprecated. As of v3.0.0, the Electron SDK 
   * automatically enables interoperability with the Web SDK, so you no longer 
   * need to call this method.
   * 
   * Enables interoperability with the Agora Web SDK (Live Broadcast only).
   *
   * Use this method when the channel profile is Live Broadcast.
   * Interoperability with the Agora Web SDK is enabled by default when the 
   * channel profile is Communication. 
   * 
   * If the channel has Web SDK users, ensure that you call this method, or 
   * the video of the Native user will be a black screen for the Web user.
   * @param {boolean} enable Sets whether to enable/disable interoperability 
   * with the Agora Web SDK:
   * - true: Enable.
   * - false: (Default) Disable.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  enableWebSdkInteroperability(enable: boolean): number {
    return this.rtcEngine.enableWebSdkInteroperability(enable);
  }

  /**
   * Sets the local video mirror mode.
   *
   * Use this method before {@link startPreview}, or it does not take effect 
   * until you re-enable startPreview.
   * 
   * @param {number} mirrortype Sets the local video mirror mode:
   * - 0: (Default) The SDK determines whether enable the mirror mode. If you 
   * use a front camera, the SDK enables the mirror mode; if you use a rear 
   * camera, the SDK disables the mirror mode.
   * - 1: Enable the mirror mode
   * - 2: Disable the mirror mode
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setLocalVideoMirrorMode(mirrortype: 0 | 1 | 2): number {
    return this.rtcEngine.setLocalVideoMirrorMode(mirrortype);
  }

  /**
   * Changes the voice pitch of the local speaker.
   * @param {number} pitch - The value ranges between 0.5 and 2.0.
   * The lower the value, the lower the voice pitch.
   * The default value is 1.0 (no change to the local voice pitch).
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setLocalVoicePitch(pitch: number): number {
    return this.rtcEngine.setLocalVoicePitch(pitch);
  }

  /**
   * Sets the local voice equalization effect.
   * 
   * @param {number} bandFrequency Sets the index of the band center frequency.
   * The value ranges between 0 and 9, representing the respective band 
   * center frequencies of the voice effects
   * including 31, 62, 125, 500, 1k, 2k, 4k, 8k, and 16kHz.
   * @param {number} bandGain Sets the gain (dB) of each band. The value 
   * ranges between -15 and 15. The default value is 0. 
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setLocalVoiceEqualization(bandFrequency: number, bandGain: number): number {
    return this.rtcEngine.setLocalVoiceEqualization(bandFrequency, bandGain);
  }

  /**
   * Sets the local voice reverberation.
   * 
   * @param {number} reverbKey Sets the audio reverberation key.
   * - `0`: Level (dB) of the dry signal. The value ranges between -20 and 10.
   * - `1`: Level (dB) of the early reflection signal 
   * (wet signal). The value ranges between -20 and 10.
   * - `2`: Room size of the reflection. A larger
   * room size means a stronger reverbration. The value ranges between 0 and 
   * 100.
   * - `3`: Length (ms) of the initial delay of the wet 
   * signal. The value ranges between 0 and 200.
   * - `4`: The reverberation strength. The value ranges between 0 and 100.
   * 
   * @param {number} value Sets the effect of the reverberation key. See 
   * `reverbKey` for the value range.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setLocalVoiceReverb(reverbKey: number, value: number): number {
    return this.rtcEngine.setLocalVoiceReverb(reverbKey, value);
  }

  /**
   * Sets the local voice changer option.
   * @param {VoiceChangerPreset} preset The local voice changer option. 
   * See {@link VoiceChangerPreset}.
   */
  setLocalVoiceChanger(preset: VoiceChangerPreset): number {
    return this.rtcEngine.setLocalVoiceChanger(preset);
  }

  /**
   * Sets the preset local voice reverberation effect.
   *
   * **Note**:
   * - Do not use this method together with {@link setLocalVoiceReverb}.
   * - Do not use this method together with {@link setLocalVoiceChanger}, 
   * or the method called eariler does not take effect.
   * @param {AudioReverbPreset} preset The local voice reverberation preset. 
   * See {@link AudioReverbPreset}.
   */
  setLocalVoiceReverbPreset(preset: AudioReverbPreset) {
    return this.rtcEngine.setLocalVoiceReverbPreset(preset);
  }

  /**
   * Adjusts the recording volume.
   * @param {number} volume Recording volume. The value ranges between 0 and 
   * 400:
   * - 0: Mute.
   * - 100: Original volume.
   * - 400: (Maximum) Four times the original volume with signal-clipping 
   * protection.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  adjustRecordingSignalVolume(volume: number): number {
    return this.rtcEngine.adjustRecordingSignalVolume(volume);
  }
  /**
   * Adjusts the playback volume of the voice.
   * @param volume Playback volume of the voice. The value ranges between 0 
   * and 400:
   * - 0: Mute.
   * - 100: Original volume.
   * - 400: (Maximum) Four times the original volume with signal-clipping 
   * protection.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  adjustPlaybackSignalVolume(volume: number): number {
    return this.rtcEngine.adjustPlaybackSignalVolume(volume);
  }

  // ===========================================================================
  // DEVICE MANAGEMENT
  // ===========================================================================
  /**
   * Gets the list of the video devices.
   * @return {Array} The array of the video devices.
   */
  getVideoDevices(): Array<Object> {
    return this.rtcEngine.getVideoDevices();
  }

  /**
   * Sets the video device using the device Id.
   * @param {string} deviceId The device Id.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setVideoDevice(deviceId: string): number {
    return this.rtcEngine.setVideoDevice(deviceId);
  }

  /**
   * Gets the current video device.
   * @return {Object} The video device.
   */
  getCurrentVideoDevice(): Object {
    return this.rtcEngine.getCurrentVideoDevice();
  }

  /**
   * Starts a video-capture device test.
   *
   * **Note**:
   * This method tests whether the video-capture device works properly.
   * Ensure that you call the {@link enableVideo} method before calling this 
   * method and that the HWND window handle of the incoming parameter is valid.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  startVideoDeviceTest(): number {
    return this.rtcEngine.startVideoDeviceTest();
  }

  /**
   * Stops the video-capture device test.
   *
   * **Note**:
   * This method stops testing the video-capture device.
   * You must call this method to stop the test after calling the 
   * {@link startVideoDeviceTest} method.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  stopVideoDeviceTest(): number {
    return this.rtcEngine.stopVideoDeviceTest();
  }

  /**
   * Retrieves the audio playback device associated with the device ID.
   * @return {Array} The array of the audio playback device.
   */
  getAudioPlaybackDevices(): Array<Object> {
    return this.rtcEngine.getAudioPlaybackDevices();
  }

  /**
   * Sets the audio playback device using the device ID.
   * @param {string} deviceId The device ID of the audio playback device.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setAudioPlaybackDevice(deviceId: string): number {
    return this.rtcEngine.setAudioPlaybackDevice(deviceId);
  }

  /**
   * Retrieves the audio playback device information associated with the 
   * device ID and device name.
   * @param {string} deviceId The device ID of the audio playback device.
   * @param {string} deviceName The device name of the audio playback device.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */

  getPlaybackDeviceInfo(deviceId: string, deviceName: string): number {
    return this.rtcEngine.getPlaybackDeviceInfo(deviceId, deviceName);
  }

  /**
   * Gets the current audio playback device.
   * @return {Object} The current audio playback device.
   */
  getCurrentAudioPlaybackDevice(): Object {
    return this.rtcEngine.getCurrentAudioPlaybackDevice();
  }

  /**
   * Sets the volume of the audio playback device.
   * @param {number} volume Sets the volume of the audio playback device. The 
   * value ranges between 0 (lowest volume) and 255 (highest volume).
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setAudioPlaybackVolume(volume: number): number {
    return this.rtcEngine.setAudioPlaybackVolume(volume);
  }

  /**
   * Retrieves the volume of the audio playback device.
   * @return The audio playback device volume.
   */
  getAudioPlaybackVolume(): number {
    return this.rtcEngine.getAudioPlaybackVolume();
  }

  /**
   * Retrieves the audio recording device associated with the device ID.
   * @return {Array} The array of the audio recording device.
   */
  getAudioRecordingDevices(): Array<Object> {
    return this.rtcEngine.getAudioRecordingDevices();
  }

  /**
   * Sets the audio recording device using the device ID.
   * @param {string} deviceId The device ID of the audio recording device.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setAudioRecordingDevice(deviceId: string): number {
    return this.rtcEngine.setAudioRecordingDevice(deviceId);
  }

  /**
   * Retrieves the audio recording device information associated with the 
   * device ID and device name.
   * @param {string} deviceId The device ID of the recording audio device.
   * @param {string} deviceName  The device name of the recording audio device.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  getRecordingDeviceInfo(deviceId: string, deviceName: string): number {
    return this.rtcEngine.getRecordingDeviceInfo(deviceId, deviceName);
  }

  /**
   * Gets the current audio recording device.
   * @return {Object} The audio recording device.
   */
  getCurrentAudioRecordingDevice(): Object {
    return this.rtcEngine.getCurrentAudioRecordingDevice();
  }

  /**
   * Retrieves the volume of the microphone.
   * @return {number} The microphone volume. The volume value ranges between 
   * 0 (lowest volume) and 255 (highest volume).
   */
  getAudioRecordingVolume(): number {
    return this.rtcEngine.getAudioRecordingVolume();
  }

  /**
   * Sets the volume of the microphone.
   * @param {number} volume Sets the volume of the microphone. The value 
   * ranges between 0 (lowest volume) and 255 (highest volume).
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setAudioRecordingVolume(volume: number): number {
    return this.rtcEngine.setAudioRecordingVolume(volume);
  }

  /**
   * Starts the audio playback device test.
   *
   * This method tests if the playback device works properly. In the test, 
   * the SDK plays an audio file specified by the user.
   * If the user can hear the audio, the playback device works properly.
   * @param {string} filepath The path of the audio file for the audio playback 
   * device test in UTF-8:
   * - Supported file formats: wav, mp3, m4a, and aac.
   * - Supported file sample rates: 8000, 16000, 32000, 44100, and 48000 Hz.
   * @return
   * - 0: Success, and you can hear the sound of the specified audio file.
   * - < 0: Failure.
   */
  startAudioPlaybackDeviceTest(filepath: string): number {
    return this.rtcEngine.startAudioPlaybackDeviceTest(filepath);
  }

  /**
   * Stops the audio playback device test.
   *
   * This method stops testing the audio playback device.
   * You must call this method to stop the test after calling the 
   * {@link startAudioPlaybackDeviceTest} method.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  stopAudioPlaybackDeviceTest(): number {
    return this.rtcEngine.stopAudioPlaybackDeviceTest();
  }

  /**
   * Starts the audio device loopback test.
   *
   * This method tests whether the local audio devices are working properly.
   * After calling this method, the microphone captures the local audio and 
   * plays it through the speaker.
   *
   * **Note**:
   * This method tests the local audio devices and does not report the network 
   * conditions.
   * @param {number} interval The time interval (ms).
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  startRecordingDeviceTest(interval: number): number {
    return this.rtcEngine.startRecordingDeviceTest(interval);
  }

  /**
   * Stops the audio device loopback test.
   *
   * **Note**:
   * Ensure that you call this method to stop the loopback test after calling 
   * the {@link startAudioDeviceLoopbackTest} method.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  stopAudioDeviceLoopbackTest(): number {
    return this.rtcEngine.stopAudioDeviceLoopbackTest();
  }

  /**
   * Enables the loopback recording. Once enabled, the SDK collects all local 
   * sounds.
   * @param {boolean} [enable = false] Enable the loop back recording.
   * @param {string|null} [deviceName = null] The audio device.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  enableLoopbackRecording(
    enable = false
  ): number {
    return this.rtcEngine.enableLoopbackRecording(enable);
  }

  enableLoopbackRecordingByConnectionId(
    connection_id:Number,
    enable: boolean
  ): number {
    return this.rtcEngine.enableLoopbackRecording2(connection_id, enable);
  }
  /**
   * @since v3.0.0
   * 
   * Starts an audio recording on the client.
   * 
   * The SDK allows recording during a call. After successfully calling this 
   * method, you can record the audio of all the users in the channel and get 
   * an audio recording file. 
   * Supported formats of the recording file are as follows:
   * - .wav: Large file size with high fidelity.
   * - .aac: Small file size with low fidelity.
   * 
   * @note
   * - Ensure that the directory you use to save the recording file exists and 
   * is writable.
   * - This method is usually called after {@link joinChannel}. The 
   * recording automatically stops when you call {@link leaveChannel}.
   * - For better recording effects, set quality as MEDIUM or HIGH when 
   * `sampleRate` is 44.1 kHz or 48 kHz.
   * 
   * @param filePath The absolute file path of the recording file. The string 
   * of the file name is in UTF-8, such as c:/music/audio.aac.
   * @param sampleRate Sample rate (Hz) of the recording file. Supported 
   * values are as follows:
   * - 16000
   * - (Default) 32000
   * - 44100
   * - 48000
   * @param quality The audio recording quality:
   * - `0`: Low quality. The sample rate is 32 kHz, and the file size is around
   * 1.2 MB after 10 minutes of recording.
   * - `1`: Medium quality. The sample rate is 32 kHz, and the file size is
   * around 2 MB after 10 minutes of recording.
   * - `2`: High quality. The sample rate is 32 kHz, and the file size is
   * around 3.75 MB after 10 minutes of recording.
   * 
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  startAudioRecording(filePath: string, quality: number):number {
    return this.rtcEngine.startAudioRecording(filePath, quality)
  }
  /**
   * Stops an audio recording on the client.
   * 
   * You can call this method before calling the {@link leaveChannel} method
   * else to stop the recording automatically.
   * 
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  stopAudioRecording():number {
    return this.rtcEngine.stopAudioRecording()
  }

  /**
   * Starts the microphone test.
   *
   * This method checks whether the microphone works properly.
   * @param {number} indicateInterval The interval period (ms).
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  startAudioRecordingDeviceTest(indicateInterval: number): number {
    return this.rtcEngine.startAudioRecordingDeviceTest(indicateInterval);
  }

  /**
   * Stops the microphone test.
   *
   * **Note**:
   * This method stops the microphone test.
   * You must call this method to stop the test after calling the 
   * {@link startAudioRecordingDeviceTest} method.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  stopAudioRecordingDeviceTest(): number {
    return this.rtcEngine.stopAudioRecordingDeviceTest();
  }

  /**
   * check whether selected audio playback device is muted
   * @return {boolean} muted/unmuted
   */
  getAudioPlaybackDeviceMute(): boolean {
    return this.rtcEngine.getAudioPlaybackDeviceMute();
  }

  /**
   * Mutes the audio playback device.
   * @param {boolean} mute Sets whether to mute/unmute the audio playback 
   * device:
   * - true: Mutes.
   * - false: Unmutes.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setAudioPlaybackDeviceMute(mute: boolean): number {
    return this.rtcEngine.setAudioPlaybackDeviceMute(mute);
  }

  /**
   * Retrieves the mute status of the audio playback device.
   * @return {boolean} Whether to mute/unmute the audio playback device:
   * - true: Mutes.
   * - false: Unmutes.
   */
  getAudioRecordingDeviceMute(): boolean {
    return this.rtcEngine.getAudioRecordingDeviceMute();
  }

  /**
   * Mutes/Unmutes the microphone.
   * @param {boolean} mute Sets whether to mute/unmute the audio playback 
   * device:
   * - true: Mutes.
   * - false: Unmutes.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setAudioRecordingDeviceMute(mute: boolean): number {
    return this.rtcEngine.setAudioRecordingDeviceMute(mute);
  }

  /**
   * Gets the window ID when using the video source.
   *
   * This method gets the ID of the whole window and relevant inforamtion.
   * You can share the whole or part of a window by specifying the window ID.
   * @return {Array} The array list of the window ID and relevant information.
   */
  getScreenWindowsInfo(): Array<Object> {
    return this.rtcEngine.getScreenWindowsInfo();
  }

  /**
   * Gets the display ID when using the video source.
   *
   * This method gets the ID of the whole display and relevant inforamtion.
   * You can share the whole or part of a display by specifying the window ID.
   * @return {Array} The array list of the display ID and relevant information.
   * The display ID returned is different on Windows and macOS systems. 
   * You don't need to pay attention to the specific content of the returned 
   * object, just use it for screen sharing.
   */
  getScreenDisplaysInfo(): Array<Object> {
    return this.rtcEngine.getScreenDisplaysInfo();
  }


  /**
   * Shares the whole or part of a window by specifying the window symbol.
   * 
   * @param windowSymbol The symbol of the windows to be shared.
   * @param rect (Optional) The relative location of the region to the window. 
   * NULL/NIL means sharing the whole window. See {@link CaptureRect}. If the 
   * specified region overruns the window, the SDK shares only the region 
   * within it; if you set width or height as 0, the SDK shares the whole 
   * window.
   * @param param Window sharing encoding parameters. See {@link CaptureParam}
   * 
   * @return 
   * - 0: Success
   * - < 0: Failure
   */
  startScreenCaptureByWindow(windowSymbol: number, rect: CaptureRect, param: CaptureParam): number {
    return this.rtcEngine.startScreenCaptureByWindow(windowSymbol, rect, param)
  }
  /**
   * Shares the whole or part of a screen by specifying the screen symbol.
   * @param screenSymbol The screen symbol. See {@link screenSymbol}
   * @param rect (Optional) The relative location of the region to the screen. 
   * NULL means sharing the whole screen. See {@link CaptureRect}. If the 
   * specified region overruns the screen, the SDK shares only the region 
   * within it; if you set width or height as 0, the SDK shares the whole 
   * screen.
   * @param param The screen sharing encoding parameters. See 
   * {@link CaptureParam}
   * 
   * @return 
   * - 0: Success
   * - < 0: Failure
   */
  startScreenCaptureByScreen(screenSymbol: ScreenSymbol, rect: CaptureRect, param: CaptureParam): number {
    return this.rtcEngine.startScreenCaptureByScreen(screenSymbol, rect, param)
  }
  /**
   * Updates the screen sharing parameters.
   * 
   * @param param The screen sharing encoding parameters. 
   * See {@link CaptureParam}
   * 
   * @return 
   * - 0: Success
   * - < 0: Failure
   */
  updateScreenCaptureParameters(param: CaptureParam): number {
    return this.rtcEngine.updateScreenCaptureParameters(param)
  }
  /**
   * Sets the content hint for screen sharing.
   * 
   * A content hint suggests the type of the content being shared, so that the 
   * SDK applies different optimization algorithm to different types of 
   * content.
   * @param hint The content hint for screen sharing. 
   * See {@link VideoContentHint}
   * 
   * @return 
   * - 0: Success
   * - < 0: Failure
   */
  setScreenCaptureContentHint(hint: VideoContentHint): number {
    return this.rtcEngine.setScreenCaptureContentHint(hint)
  }

  /**
   * Stops screen sharing.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  stopScreenCapture(): number {
    return this.rtcEngine.stopScreenCapture();
  }

  /**
   * Updates the screen capture region.
   * @param {*} rect {left: 0, right: 100, top: 0, bottom: 100} (relative 
   * distance from the left-top corner of the screen)
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  updateScreenCaptureRegion(rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): number {
    return this.rtcEngine.updateScreenCaptureRegion(rect);
  }

  // ===========================================================================
  // AUDIO MIXING
  // ===========================================================================
  /**
   * Starts playing and mixing the music file.
   *
   * This method mixes the specified local audio file with the audio stream
   * from the microphone, or replaces the microphone’s audio stream with the 
   * specified
   * local audio file. You can choose whether the other user can hear the 
   * local audio playback
   * and specify the number of loop playbacks. This API also supports online 
   * music playback.
   *
   * The SDK returns the state of the audio mixing file playback in the 
   * audioMixingStateChanged callback.
   *
   * **Note**:
   * - Call this method when you are in the channel, otherwise it may cause 
   * issues.
   * - If the local audio mixing file does not exist, or if the SDK does not 
   * support the file format
   * or cannot access the music file URL, the SDK returns the warning code 701.
   *
   * @param {string} filepath Specifies the absolute path (including the 
   * suffixes of the filename) of the local or online audio file to be mixed. 
   * Supported audio formats: mp3, mp4, m4a, aac, 3gp, mkv and wav.
   * @param {boolean} loopback Sets which user can hear the audio mixing:
   * - true: Only the local user can hear the audio mixing.
   * - false: Both users can hear the audio mixing.
   * @param {boolean} replace Sets the audio mixing content:
   * - true: Only publish the specified audio file; the audio stream from the 
   * microphone is not published.
   * - false: The local audio file is mixed with the audio stream from the 
   * microphone.
   * @param {number} cycle Sets the number of playback loops:
   * - Positive integer: Number of playback loops.
   * - -1: Infinite playback loops.
   * @return
   * - 0: Success.
   * - < 0: Failure.
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
   * Stops playing or mixing the music file.
   *
   * Call this API when you are in a channel.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  stopAudioMixing(): number {
    return this.rtcEngine.stopAudioMixing();
  }

  /**
   * Pauses playing and mixing the music file.
   *
   *  Call this API when you are in a channel.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  pauseAudioMixing(): number {
    return this.rtcEngine.pauseAudioMixing();
  }

  /**
   * Resumes playing and mixing the music file.
   *
   *  Call this API when you are in a channel.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  resumeAudioMixing(): number {
    return this.rtcEngine.resumeAudioMixing();
  }

  /**
   * Adjusts the volume of audio mixing.
   *
   * Call this API when you are in a channel.
   * 
   * **Note**: Calling this method does not affect the volume of audio effect 
   * file playback invoked by the playEffect method.
   * @param {number} volume Audio mixing volume. The value ranges between 0 
   * and 100 (default). 100 is the original volume.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  adjustAudioMixingVolume(volume: number): number {
    return this.rtcEngine.adjustAudioMixingVolume(volume);
  }

  /**
   * Adjusts the audio mixing volume for local playback.
   * @param {number} volume Audio mixing volume for local playback. The value 
   * ranges between 0 and 100 (default). 100 is the original volume.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  adjustAudioMixingPlayoutVolume(volume: number): number {
    return this.rtcEngine.adjustAudioMixingPlayoutVolume(volume);
  }

  /**
   * Adjusts the audio mixing volume for publishing (sending to other users).
   * @param {number} volume Audio mixing volume for publishing. The value 
   * ranges between 0 and 100 (default). 100 is the original volume.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  adjustAudioMixingPublishVolume(volume: number): number {
    return this.rtcEngine.adjustAudioMixingPublishVolume(volume);
  }

  /**
   * Gets the duration (ms) of the music file.
   *
   * Call this API when you are in a channel.
   * @return
   * - ≥ 0: The audio mixing duration, if this method call succeeds.
   * - < 0: Failure.
   */
  getAudioMixingDuration(): number {
    return this.rtcEngine.getAudioMixingDuration();
  }

  /**
   * Gets the playback position (ms) of the music file.
   *
   * Call this API when you are in a channel.
   * @return
   * - ≥ 0: The current playback position of the audio mixing, if this method 
   * call succeeds.
   * - < 0: Failure.
   */
  getAudioMixingCurrentPosition(): number {
    return this.rtcEngine.getAudioMixingCurrentPosition();
  }

  /**
   * Adjusts the audio mixing volume for publishing (for remote users).
   *
   * Call this API when you are in a channel.
   *
   * @return
   * - ≥ 0: The audio mixing volume for local playout, if this method call 
   * succeeds. The value range is [0,100].
   * - < 0: Failure.
   */
  getAudioMixingPlayoutVolume(): number {
    return this.rtcEngine.getAudioMixingPlayoutVolume();
  }

  /**
   * Retrieves the audio mixing volume for publishing.
   *
   * Call this API when you are in a channel.
   *
   * @return
   * - ≥ 0: The audio mixing volume for publishing, if this method call 
   * succeeds. The value range is [0,100].
   * - < 0: Failure.
   */
  getAudioMixingPublishVolume(): number {
    return this.rtcEngine.getAudioMixingPublishVolume();
  }

  /**
   * Sets the playback position of the music file to a different starting 
   * position.
   *
   * This method drags the playback progress bar of the audio mixing file to 
   * where
   * you want to play instead of playing it from the beginning.
   * @param {number} position The playback starting position (ms) of the music 
   * file.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setAudioMixingPosition(position: number): number {
    return this.rtcEngine.setAudioMixingPosition(position);
  }

  /** Sets the pitch of the local music file.
   * @since v3.0.1
   *
   * When a local music file is mixed with a local human voice, call this method to set the pitch of the local music file only.
   *
   * @note
   * Call this method after calling `startAudioMixing`.
   *
   * @param {number} pitch Sets the pitch of the local music file by chromatic scale. The default value is 0,
   * which means keeping the original pitch. The value ranges from -12 to 12, and the pitch value between
   * consecutive values is a chromatic value. The greater the absolute value of this parameter, the
   * higher or lower the pitch of the local music file.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  // setAudioMixingPitch(pitch: number): number {
  //   return this.rtcEngine.setAudioMixingPitch(pitch);
  // }

  // ===========================================================================
  // CDN STREAMING
  // ===========================================================================
   /**
    * Publishes the local stream to a specified CDN live RTMP address. (CDN 
    * live only)
    *
    * The SDK returns the result of this method call in the streamPublished 
    * callback.
    * 
    * **Note**:
    * - This method applies to Live Broadcast only.
    * - Ensure that you enable the RTMP Converter service before using this 
    * function. See [Prerequisites](https://docs.agora.io/en/Interactive%20Broadcast/cdn_streaming_windows?platform=Windows#implementation).
    * - This method adds only one stream URL address each time it is 
    * called.
    * 
    * @param {string} url The CDN streaming URL in the RTMP format. The 
    * maximum length of this parameter is 1024 bytes. The RTMP URL address must 
    * not contain special characters, such as Chinese language characters.
    * @param {bool} transcodingEnabled Sets whether transcoding is 
    * enabled/disabled:
    * - true: Enable transcoding. To transcode the audio or video streams when 
    * publishing them to CDN live,
    * often used for combining the audio and video streams of multiple hosts 
    * in CDN live. If set the parameter as `true`, you should call the 
    * {@link setLiveTranscoding} method before this method.
    * - false: Disable transcoding.
    * @return
    * - 0: Success.
    * - < 0: Failure.
    */
  addPublishStreamUrl(url: string, transcodingEnabled: boolean): number {
    return this.rtcEngine.addPublishStreamUrl(url, transcodingEnabled);
  }

  /**
   * Removes an RTMP stream from the CDN. (CDN live only)
   * **Note**:
   * - This method removes only one RTMP URL address each time it is called.
   * - The RTMP URL address must not contain special characters, such as 
   * Chinese language characters.
   * - This method applies to Live Broadcast only.
   * @param {string} url The RTMP URL address to be removed. The maximum 
   * length of this parameter is 1024 bytes.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  removePublishStreamUrl(url: string): number {
    return this.rtcEngine.removePublishStreamUrl(url);
  }

  /**
   * Sets the video layout and audio settings for CDN live. (CDN live only)
   * 
   * The SDK triggers the otranscodingUpdated callback when you call the 
   * {@link setLiveTranscoding} method to update the LiveTranscoding class.
   * 
   * **Note**: 
   * - Ensure that you enable the RTMP Converter service before using 
   * this function. See 
   * [Prerequisites](https://docs.agora.io/en/Interactive%20Broadcast/cdn_streaming_windows?platform=Windows#prerequisites).
   * - If you call the {@link setLiveTranscoding} method to set the 
   * LiveTranscoding class for the first time, the SDK does not trigger the 
   * transcodingUpdated callback.
   * 
   * @param {TranscodingConfig} transcoding Sets the CDN live audio/video 
   * transcoding settings. See {@link TranscodingConfig}.
   * 
   *
   * @return {number}
   * - 0: Success.
   * - < 0: Failure.
   */
  setLiveTranscoding(transcoding: TranscodingConfig): number {
    return this.rtcEngine.setLiveTranscoding(transcoding);
  }

  // ===========================================================================
  // STREAM INJECTION
  // ===========================================================================
  /**
   * Adds a voice or video stream HTTP/HTTPS URL address to a live broadcast.
   * 
   * This method applies to the Native SDK v2.4.1 and later.
   * 
   * If this method call is successful, the server pulls the voice or video 
   * stream and injects it into a live channel. 
   * This is applicable to scenarios where all audience members in the channel 
   * can watch a live show and interact with each other.
   *
   * The `addInjectStreamUrl` method call triggers the following 
   * callbacks:
   * - The local client:
   *  - streamInjectStatus, with the state of the injecting the online stream.
   *  - `userJoined (uid: 666)`, if the method call is successful and the online 
   * media stream is injected into the channel.
   * - The remote client:
   *  - `userJoined (uid: 666)`, if the method call is successful and the online 
   * media stream is injected into the channel.
   *
   * **Note**:
   * - This method applies to Live Broadcast only.
   * - Ensure that you enable the RTMP Converter service before using this 
   * function. See [Prerequisites](https://docs.agora.io/en/Interactive%20Broadcast/cdn_streaming_windows?platform=Windows#prerequisites).
   * - Ensure that the user joins a channel before calling this method.
   * - This method adds only one stream URL address each time it is called.
   * 
   * @param {string} url The HTTP/HTTPS URL address to be added to the ongoing 
   * live broadcast. Valid protocols are RTMP, HLS, and FLV.
   * - Supported FLV audio codec type: AAC.
   * - Supported FLV video codec type: H264 (AVC).
   * @param {InjectStreamConfig} config The InjectStreamConfig object which 
   * contains the configuration information for the added voice or video stream.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *  - `ERR_INVALID_ARGUMENT (2)`: The injected URL does not exist. Call this 
   * method again to inject the stream and ensure that the URL is valid.
   *  - `ERR_NOT_READY (3)`: The user is not in the channel.
   *  - `ERR_NOT_SUPPORTED (4)`: The channel profile is not Live Broadcast. 
   * Call the {@link setChannelProfile} method and set the channel profile to 
   * Live Broadcast before calling this method.
   *  - `ERR_NOT_INITIALIZED (7)`: The SDK is not initialized. Ensure that 
   * the `AgoraRtcEngine` object is initialized before using this method.
   */
  addInjectStreamUrl(url: string, config: InjectStreamConfig): number {
    return this.rtcEngine.addInjectStreamUrl(url, config);
  }

  /**
   * Removes the injected online media stream from a live broadcast.
   *
   * @param {string} url HTTP/HTTPS URL address of the added stream to be 
   * removed.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  removeInjectStreamUrl(url: string): number {
    return this.rtcEngine.removeInjectStreamUrl(url);
  }

  // ===========================================================================
  // DATA CHANNEL
  // ===========================================================================
  /**
   * Creates a data stream.
   *
   * Each user can create up to five data streams during the lifecycle of the 
   * AgoraRtcEngine.
   *
   * **Note**:
   * Set both the `reliable` and `ordered` parameters to true or false. Do not 
   * set one as true and the other as false.
   * @param {boolean} reliable Sets whether or not the recipients are 
   * guaranteed to receive the data stream from the sender within five seconds:
   * - true: The recipients will receive data from the sender within 5 seconds. 
   * If the recipient does not receive the sent data within 5 seconds, the data 
   * channel will report an error to the application.
   * - false: There is no guarantee that the recipients receive the data stream 
   * within five seconds and no error message is reported for any delay or 
   * missing data stream.
   * @param {boolean} ordered Sets whether or not the recipients receive the 
   * data stream in the sent order:
   * - true: The recipients receive the data stream in the sent order.
   * - false: The recipients do not receive the data stream in the sent order.
   * @return
   * - Returns the ID of the data stream, if this method call succeeds.
   * - < 0: Failure and returns an error code.
   */
  createDataStream(reliable: boolean, ordered: boolean): number {
    return this.rtcEngine.createDataStream(reliable, ordered);
  }

  /**
   * Sends data stream messages to all users in a channel.
   *
   * The SDK has the following restrictions on this method:
   * - Up to 30 packets can be sent per second in a channel with each packet 
   * having a maximum size of 1 kB.
   * - Each client can send up to 6 kB of data per second.
   * - Each user can have up to five data streams simultaneously.
   *
   * A successful {@link sendStreamMessage} method call triggers the 
   * streamMessage callback on the remote client, from which the remote user 
   * gets the stream message.
   *
   * A failed {@link sendStreamMessage} method call triggers the 
   * streamMessageError callback on the remote client.
   *
   * **Note**:
   * This method applies only to the Communication profile or to the hosts in 
   * the Live-broadcast profile.
   * If an audience in the Live-broadcast profile calls this method, the 
   * audience may be switched to a host.
   * @param {number} streamId ID of the sent data stream, returned in the 
   * {@link createDataStream} method.
   * @param {string} msg Data to be sent.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  sendStreamMessage(streamId: number, msg: string): number {
    return this.rtcEngine.sendStreamMessage(streamId, msg);
  }

  // ===========================================================================
  // CHANNEL MEDIA RELAY
  // ===========================================================================
  /**
   * Starts to relay media streams across channels.
   * 
   * After a successful method call, the SDK triggers the 
   * channelMediaRelayState and channelMediaRelayEvent callbacks, 
   * and these callbacks report the states and events of the media stream 
   * relay.
   * 
   * - If the channelMediaRelayState callback reports the state code `1` and 
   * the error code `0`, and the and the 
   * `channelMediaRelayEvent`
   * callback reports the event code `4` in {@link ChannelMediaRelayEvent}, the
   * SDK starts relaying media streams between the original and the 
   * destination channel.
   * - If the channelMediaRelayState callback  reports the state code `3` in
   * {@link ChannelMediaRelayState}, an exception occurs during the media 
   * stream relay.
   * 
   * **Note**: 
   * - Contact sales-us@agora.io before implementing this function.
   * - Call this method after the {@link joinChannel} method.
   * - This method takes effect only when you are a broadcaster in a 
   * Live-broadcast channel.
   * - We do not support using string user accounts in this function.
   * - After a successful method call, if you want to call this method again, 
   * ensure that you call the {@link stopChannelMediaRelay} method to quit 
   * the current relay.
   * 
   * @param config The configuration of the media stream relay: 
   * {@link ChannelMediaRelayConfiguration}.
   * 
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  startChannelMediaRelay(config: ChannelMediaRelayConfiguration): number {
    return this.rtcEngine.startChannelMediaRelay(config);
  }
  /**
   * Updates the channels for media stream relay. 
   * 
   * After the channel media relay starts, if you want to relay the media 
   * stream to more channels, or leave the current relay channel, you can call 
   * the {@link updateChannelMediaRelay} method.
   * 
   * After a successful method call, the SDK triggers the 
   * channelMediaRelayState callback with the state code `7` in 
   * {@link ChannelMediaRelayEvent}.
   * 
   * **Note**: 
   * 
   * Call this method after the {@link startChannelMediaRelay} method to 
   * update the destination channel.
   * 
   * @param config The media stream relay configuration: 
   * {@link ChannelMediaRelayConfiguration}.
   * 
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  updateChannelMediaRelay(config: ChannelMediaRelayConfiguration): number {
    return this.rtcEngine.updateChannelMediaRelay(config);
  }
  /**
   * Stops the media stream relay.
   * 
   * Once the relay stops, the broadcaster quits all the destination channels.
   * 
   * After a successful method call, the SDK triggers the 
   * channelMediaRelayState callback. If the callback reports the state 
   * code `0` and the error code `1`, the broadcaster 
   * successfully stops the relay.
   * 
   * **Note**:
   * If the method call fails, the SDK triggers the 
   * channelMediaRelayState callback with the error code `2` and `8` in 
   * {@link ChannelMediaRelayError}. You can leave the channel by calling 
   * the {@link leaveChannel} method, and 
   * the media stream relay automatically stops.
   * 
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  stopChannelMediaRelay(): number {
    return this.rtcEngine.stopChannelMediaRelay();
  }

  // ===========================================================================
  // MANAGE AUDIO EFFECT
  // ===========================================================================
  /**
   * Retrieves the volume of the audio effects.
   *
   * The value ranges between 0.0 and 100.0.
   * @return
   * - ≥ 0: Volume of the audio effects, if this method call succeeds.
   * - < 0: Failure.
   */
  getEffectsVolume(): number {
    return this.rtcEngine.getEffectsVolume();
  }
  /**
   * Sets the volume of the audio effects.
   * @param {number} volume Sets the volume of the audio effects. The value 
   * ranges between 0 and 100 (default).
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setEffectsVolume(volume: number): number {
    return this.rtcEngine.setEffectsVolume(volume);
  }
  /**
   * Sets the volume of a specified audio effect.
   * @param {number} soundId ID of the audio effect. Each audio effect has a 
   * unique ID.
   * @param {number} volume Sets the volume of the specified audio effect. 
   * The value ranges between 0.0 and 100.0 (default).
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setVolumeOfEffect(soundId: number, volume: number): number {
    return this.rtcEngine.setVolumeOfEffect(soundId, volume);
  }
  /**
   * Plays a specified local or online audio effect file.
   *
   * This method allows you to set the loop count, pitch, pan, and gain of the 
   * audio effect file, as well as whether the remote user can hear the audio 
   * effect.
   *
   * To play multiple audio effect files simultaneously, call this method 
   * multiple times with different soundIds and filePaths.
   * We recommend playing no more than three audio effect files at the same 
   * time.
   *
   * When the audio effect file playback finishes, the SDK returns the 
   * audioEffectFinished callback.
   * @param {number} soundId ID of the specified audio effect. Each audio 
   * effect has a unique ID.
   * @param {string} filePath TSpecifies the absolute path (including the 
   * suffixes of the filename) to the local audio effect file or the URL of 
   * the online audio effect file. Supported audio formats: mp3, mp4, m4a, 
   * aac, 3gp, mkv and wav.
   * @param {number} loopcount Sets the number of times the audio effect 
   * loops:
   * - 0: Play the audio effect once.
   * - 1: Play the audio effect twice.
   * - -1: Play the audio effect in an indefinite loop until the 
   * {@link stopEffect} or {@link stopEffect} method is called.
   * @param {number} pitch Sets the pitch of the audio effect. The value ranges 
   * between 0.5 and 2.
   * The default value is 1 (no change to the pitch). The lower the value, the 
   * lower the pitch.
   * @param {number} pan Sets the spatial position of the audio effect. The 
   * value ranges between -1.0 and 1.0:
   * - 0.0: The audio effect displays ahead.
   * - 1.0: The audio effect displays to the right.
   * - -1.0: The audio effect displays to the left.
   * @param {number} gain Sets the volume of the audio effect. The value ranges 
   * between 0.0 and 100.0 (default).
   * The lower the value, the lower the volume of the audio effect.
   * @param {boolean} publish Sets whether or not to publish the specified 
   * audio effect to the remote stream:
   * - true: The locally played audio effect is published to the Agora Cloud 
   * and the remote users can hear it.
   * - false: The locally played audio effect is not published to the Agora 
   * Cloud and the remote users cannot hear it.
   * @return
   * - 0: Success.
   * - < 0: Failure.
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
   * Stops playing a specified audio effect.
   * @param {number} soundId ID of the audio effect to stop playing. Each 
   * audio effect has a unique ID.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  stopEffect(soundId: number): number {
    return this.rtcEngine.stopEffect(soundId);
  }
  /**
   * Stops playing all audio effects.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  stopAllEffects(): number {
    return this.rtcEngine.stopAllEffects();
  }
  /**
   * Preloads a specified audio effect file into the memory.
   *
   * To ensure smooth communication, limit the size of the audio effect file.
   * We recommend using this method to preload the audio effect before calling 
   * the {@link joinChannel} method.
   *
   * Supported audio formats: mp3, aac, m4a, 3gp, and wav.
   *
   * **Note**:
   * This method does not support online audio effect files.
   *
   * @param {number} soundId ID of the audio effect. Each audio effect has a 
   * unique ID.
   * @param {string} filePath The absolute path of the audio effect file.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  preloadEffect(soundId: number, filePath: string): number {
    return this.rtcEngine.preloadEffect(soundId, filePath);
  }
  /**
   * Releases a specified preloaded audio effect from the memory.
   * @param {number} soundId ID of the audio effect. Each audio effect has a 
   * unique ID.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  unloadEffect(soundId: number): number {
    return this.rtcEngine.unloadEffect(soundId);
  }
  /**
   * Pauses a specified audio effect.
   * @param {number} soundId ID of the audio effect. Each audio effect has a 
   * unique ID.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  pauseEffect(soundId: number): number {
    return this.rtcEngine.pauseEffect(soundId);
  }
  /**
   * Pauses all the audio effects.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  pauseAllEffects(): number {
    return this.rtcEngine.pauseAllEffects();
  }
  /**
   * Resumes playing a specified audio effect.
   * @param {number} soundId sound id
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  resumeEffect(soundId: number): number {
    return this.rtcEngine.resumeEffect(soundId);
  }
  /**
   * Resumes playing all audio effects.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  resumeAllEffects(): number {
    return this.rtcEngine.resumeAllEffects();
  }

  // ===========================================================================
  // EXTRA
  // ===========================================================================

  /**
   * Retrieves the current call ID.
   * When a user joins a channel on a client, a `callId` is generated to 
   * identify the call from the client.
   * Feedback methods, such as {@link rate} and {@link complain}, must be 
   * called after the call ends to submit feedback to the SDK.
   *
   * The {@link rate} and {@link complain} methods require the `callId` 
   * parameter retrieved from the {@link getCallId} method during a call.
   * `callId` is passed as an argument into the {@link rate} and 
   * {@link complain} methods after the call ends.
   *
   * @return The current call ID.
   */
  getCallId(): string {
    return this.rtcEngine.getCallId();
  }

  /**
   * Allows a user to rate a call after the call ends.
   * @param {string} callId Pointer to the ID of the call, retrieved from 
   * the {@link getCallId} method.
   * @param {number} rating Rating of the call. The value is between 1 
   * (lowest score) and 5 (highest score).
   * @param {string} desc (Optional) Pointer to the description of the rating, 
   * with a string length of less than 800 bytes.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  rate(callId: string, rating: number, desc: string): number {
    return this.rtcEngine.rate(callId, rating, desc);
  }

  /**
   * Allows a user to complain about the call quality after a call ends.
   * @param {string} callId Call ID retrieved from the {@link getCallId} method.
   * @param {string} desc (Optional) The description of the 
   * complaint, with a string length of less than 800 bytes.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  complain(callId: string, desc: string): number {
    return this.rtcEngine.complain(callId, desc);
  }

  // ===========================================================================
  // replacement for setParameters call
  // ===========================================================================
  /** 
   * Private Interfaces. 
   * @ignore
  */
  setBool(key: string, value: boolean): number {
    return this.rtcEngine.setBool(key, value);
  }
  /** 
   * Private Interfaces. 
   * @ignore
   */
  setInt(key: string, value: number): number {
    return this.rtcEngine.setInt(key, value);
  }
  /** 
   * Private Interfaces. 
   * @ignore
   */
  setUInt(key: string, value: number): number {
    return this.rtcEngine.setUInt(key, value);
  }
  /** 
   * Private Interfaces. 
   * @ignore
   */
  setNumber(key: string, value: number): number {
    return this.rtcEngine.setNumber(key, value);
  }
  /** 
   * Private Interfaces. 
   * @ignore
   */
  setString(key: string, value: string): number {
    return this.rtcEngine.setString(key, value);
  }
  /**     
   * Private Interfaces.     
   * @ignore    
   */
  setObject(key: string, value: string): number {
    return this.rtcEngine.setObject(key, value);
  }
  /**     
   * Private Interfaces.     
   * @ignore    
   */
  getBool(key: string): boolean {
    return this.rtcEngine.getBool(key);
  }
  /**     
   * Private Interfaces.     
   * @ignore    
   */
  getInt(key: string): number {
    return this.rtcEngine.getInt(key);
  }
  /**     
   * Private Interfaces.     
   * @ignore    
   */
  getUInt(key: string): number {
    return this.rtcEngine.getUInt(key);
  }
  /**     
   * Private Interfaces.     
   * @ignore    
   */
  getNumber(key: string): number {
    return this.rtcEngine.getNumber(key);
  }
  /**     
   * Private Interfaces.     
   * @ignore    
   */
  getString(key: string): string {
    return this.rtcEngine.getString(key);
  }
  /**     
   * Private Interfaces.     
   * @ignore    
   */
  getObject(key: string): string {
    return this.rtcEngine.getObject(key);
  }
  /**     
   * Private Interfaces.     
   * @ignore    
   */
  getArray(key: string): string {
    return this.rtcEngine.getArray(key);
  }
  /**     
   * Provides technical preview functionalities or special customizations by 
   * configuring the SDK with JSON options.   
   * 
   * The JSON options are not public by default. Agora is working on making 
   * commonly used JSON options public in a standard way.
   * 
   * @param param The parameter as a JSON string in the specified format.
   * 
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setParameters(param: string): number {
    return this.rtcEngine.setParameters(param);
  }
  /**     
   * Private Interfaces.     
   * @ignore    
   */
  convertPath(path: string): string {
    return this.rtcEngine.convertPath(path);
  }

  // ===========================================================================
  // plugin apis
  // ===========================================================================
  /**
   * @ignore
   */
  initializePluginManager(): number {
    return this.rtcEngine.initializePluginManager();
  }
  /**
   * @ignore
   */
  releasePluginManager(): number {
    return this.rtcEngine.releasePluginManager();
  }
  /**
   * @ignore
   */
  registerPlugin(info: PluginInfo): number {
    return this.rtcEngine.registerPlugin(info);
  }
  /**
   * @ignore
   */
  unregisterPlugin(pluginId: string): number {
    return this.rtcEngine.unregisterPlugin(pluginId);
  }
  /**
   * @ignore
   */
  getPlugins() {
    return this.rtcEngine.getPlugins().map(item => {
      return this.createPlugin(item.id)
    })
  }
  /**
   * @ignore
   * @param pluginId 
   */
  createPlugin(pluginId: string): Plugin {
    return {
      id: pluginId,
      enable:() => {
        return this.enablePlugin(pluginId, true)
      },
      disable:() => {
        return this.enablePlugin(pluginId, false)
      },
      setParameter: (param: string) => {
        return this.setPluginParameter(pluginId, param)
      },
      getParameter: (paramKey: string) => {
        return this.getPluginParameter(pluginId, paramKey)
      }
    }
  }

  /**
   * @ignore
   * @param pluginId 
   * @param enabled 
   */
  enablePlugin(pluginId: string, enabled: boolean): number {
    return this.rtcEngine.enablePlugin(pluginId, enabled);
  }

  /**
   * @ignore
   * @param pluginId 
   * @param param 
   */
  setPluginParameter(pluginId: string, param: string): number {
    return this.rtcEngine.setPluginParameter(pluginId, param);
  }

  /**
   * @ignore
   * @param pluginId 
   * @param paramKey
   */
  getPluginParameter(pluginId: string, paramKey: string): string {
    return this.rtcEngine.getPluginParameter(pluginId, paramKey);
  }
 
  unRegisterMediaMetadataObserver(): number {
    return this.rtcEngine.unRegisterMediaMetadataObserver();
  }

  registerMediaMetadataObserver(): number {
    const fire = (event: string, ...args: Array<any>) => {
      setImmediate(() => {
        this.emit(event, ...args);
      });
    };

    this.rtcEngine.addMetadataEventHandler((metadata: Metadata) => {
      fire('receiveMetadata', metadata);
    }, (metadata: Metadata) => {
      fire('sendMetadataSuccess', metadata);
    });
    return this.rtcEngine.registerMediaMetadataObserver();
  }

  sendMetadata(metadata: Metadata): number {
    return this.rtcEngine.sendMetadata(metadata);
  }

  setMaxMetadataSize(size: number): number {
    return this.rtcEngine.setMaxMetadataSize(size);
  }
  
  sendCustomReportMessage(id: string, category: string, event: string, label: string, value: number): number {
    return this.rtcEngine.sendCustomReportMessage(id, category, event, label, value);
  }

  enableEncryption(enabled: boolean, config: EncryptionConfig): number {
    return this.rtcEngine.enableEncryption(enabled, config);
  }

  startLocalVideoTranscoder(config: LocalTranscoderConfiguration): number {
    return this.rtcEngine.startLocalVideoTranscoder(config);
  }

  updateLocalTranscoderConfiguration(config: LocalTranscoderConfiguration): number {
    return this.rtcEngine.updateLocalTranscoderConfiguration(config);
  }

  stopLocalVideoTranscoder(): number {
    return this.rtcEngine.stopLocalVideoTranscoder();
  }

  joinChannelWithMediaOptions(token: string, channelId: string, userId: number, options: ChannelMediaOptions): number {
    return this.rtcEngine.joinChannel2(token, channelId, userId, options);
  }

  joinChannelEx(token: string, channelId: string, userId: number, options: ChannelMediaOptions): number {
    return this.rtcEngine.joinChannelEx(token, channelId, userId, options);
  }

  updateChannelMediaOptions(options: ChannelMediaOptions, connectionId: number = 0): number {
    return this.rtcEngine.updateChannelMediaOptions(options, connectionId);
  }

  startPrimaryCameraCapture(config: CameraCapturerConfiguration): number {
    return this.rtcEngine.startPrimaryCameraCapture(config);
  }

  startSecondaryCameraCapture(config: CameraCapturerConfiguration): number {
    return this.rtcEngine.startSecondaryCameraCapture(config);
  }

  stopPrimaryCameraCapture(): number {
    return this.rtcEngine.stopPrimaryCameraCapture();
  }

  stopSecondaryCameraCapture(): number {
    return this.rtcEngine.stopSecondaryCameraCapture();
  }

  startPrimaryScreenCapture(config: ScreenCaptureConfiguration): number {
    return this.rtcEngine.startPrimaryScreenCapture(config);
  }

  startSecondaryScreenCapture(config: ScreenCaptureConfiguration): number {
    return this.rtcEngine.startSecondaryScreenCapture(config);
  }

  stopPrimaryScreenCapture(): number {
    return this.rtcEngine.stopPrimaryScreenCapture();
  }

  stopSecondaryScreenCapture(): number {
    return this.rtcEngine.stopSecondaryScreenCapture();
  }

  adjustLoopbackRecordingVolume(volume: number): number {
    return this.rtcEngine.adjustLoopbackRecordingVolume(volume);
  }

  /**
   * Enable/Disable extension.
   *
   * @param id id for extension, e.g. agora.beauty.
   * @param enable enable or disable.
   * - true: enable.
   * - false: disable.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
 enableExtension(id: string, enable: boolean): number {
   return this.rtcEngine.enableExtension(id, enable);
 }

 /**
   * Set extension specific property.
   *
   * @param id id for extension, e.g. agora.beauty.
   * @param key key for the property.
   * @param jsonValue property value.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
 setExtensionProperty(id: string, key: string, jsonValue: string): number {
   return this.rtcEngine.setExtensionProperty(id, key, jsonValue);
 }
}
/** The AgoraRtcEngine interface. */
declare interface AgoraRtcEngine {
  /**
   * Occurs when an API method is executed.
   * 
   * `api`: The method executed by the SDK.
   * 
   * `err`: Error code that the SDK returns when the method call fails.
   */
  on(evt: 'apiCallExecuted', cb: (connId: number, api: string, err: number) => void): this;
  /**
   * Reports a warning during SDK runtime.
   * @param cb.warn Warning code.
   * @param cb.msg The warning message.
   */
  on(evt: 'warning', cb: (connId: number, warn: number, msg: string) => void): this;
  /** Reports an error during SDK runtime.
   * @param cb.err Error code.
   * @param cb.msg The error message.
   */
  on(evt: 'error', cb: (connId: number, err: number, msg: string) => void): this;
  /** Occurs when a user joins a specified channel.
   * @param cb.channel The channel name.
   * @param cb.uid User ID of the user joining the channel.
   * @param cb.elapsed Time elapsed (ms) from the user calling the 
   * {@link joinChannel} 
   * method until the SDK triggers this callback.
   */
  on(
    evt: 'joinedChannel',
    cb: (connId: number, channel: string, uid: number, elapsed: number) => void
  ): this;
  /** Occurs when a user rejoins the channel after disconnection due to network 
   * problems.
   * When a user loses connection with the server because of network problems, 
   * the SDK automatically tries to reconnect and triggers this callback upon 
   * reconnection.
   * @param cb.channel The channel name.
   * @param cb.uid User ID of the user joining the channel.
   * @param cb.elapsed Time elapsed (ms) from the user calling the 
   * {@link joinChannel} 
   * method until the SDK triggers this callback.
   */
  on(
    evt: 'rejoinedChannel',
    cb: (connId: number, channel: string, uid: number, elapsed: number) => void
  ): this;
  // on(evt: 'audioQuality', cb: (
  //   uid: number, quality: AgoraNetworkQuality, delay: number, lost: number
  // ) => void): this;
  on(
    evt: 'audioVolumeIndication',
    cb: (
      connId: number, 
      uid: number,
      volume: number,
      speakerNumber: number,
      totalVolume: number
    ) => void
  ): this;
  /** Reports which users are speaking, the speakers' volume and whether the 
   * local user is speaking.
   *  
   * This callback reports the IDs and volumes of the loudest speakers 
   * (at most 3 users) at the moment in the channel, and whether the local user 
   * is speaking.
   * 
   * By default, this callback is disabled. You can enable it by calling the
   * {@link enableAudioVolumeIndication} method.
   * 
   * The SDK triggers two independent `groupudioVolumeIndication` callbacks at 
   * one time, which separately report the volume information of the local user 
   * and all the remote speakers. For more information, see the detailed 
   * parameter descriptions.
   *
   * @note
   * - To enable the voice activity detection of the local user, ensure that 
   * - Calling the {@link muteLocalAudioStream} method affects the SDK's 
   * behavior:
   *  - If the local user calls `muteLocalAudioStream`, the SDK stops 
   * triggering the local user's callback.
   *  - 20 seconds after a remote speaker calls `muteLocalAudioStream`, the 
   * remote speakers' callback excludes this remote user's information; 20 
   * seconds after all remote users call `muteLocalAudioStream`, the SDK stops 
   * triggering the remote speakers' callback.
   * 
   * @param cb.speakers The speakers' information:
   * - In the local client:
   *  - `uid`: 0.
   *  - `volume`: The volume of the local speaker.
   * - In each remote client:
   *  - `uid`: The ID of the remote user.
   *  - `volume`: The sum of the voice volume and audio-mixing volume of 
   * each remote speaker.
   *  - `vad`: 0.
   *  
   * @param cb.speakerNumber Total number of speakers. The value range is 
   * [0, 3].
   * - In the local client: 1.
   * - In each remote client: 3, the three loudest speakers.
   * @param cb.totalVolume Total volume after audio mixing. The value ranges 
   * between 0 (lowest volume) and 255 (highest volume).
   * - In the local client: The sum of the voice volume and audio-mixing volume 
   * of the local user.
   * - In each remote client: The sum of the voice volume and audio-mixing 
   * volume of all the remote speakers.
   */
  on(
    evt: 'groupAudioVolumeIndication',
    cb: (
      connId: number, 
      speakers: {
        uid: number;
        volume: number;
      }[],
      speakerNumber: number,
      totalVolume: number
    ) => void
  ): this;
  /** Occurs when the user leaves the channel. When the app calls the 
   * {@link leaveChannel} method, the SDK uses
   * this callback to notify the app when the user leaves the channel.
   */
  on(evt: 'leaveChannel', cb: (connId: number, stats: RtcStats) => void): this;
  /** Reports the statistics of the AgoraRtcEngine once every two seconds.
   * 
   * @param cb.stats AgoraRtcEngine's statistics, see {@link RtcStats}
   */
  on(evt: 'rtcStats', cb: (connId: number, stats: RtcStats) => void): this;
  /** 
   * Reports the statistics of the local video streams.
   * 
   * **Note**:
   * 
   * If you have called the {@link enableDualStream} method, the 
   * localVideoStats callback reports the statistics of the high-video 
   * stream (high bitrate, and high-resolution video stream).
   * 
   * - stats: The statistics of the local video stream. See 
   * {@link LocalVideoStats}.
   */
  on(evt: 'localVideoStats', cb: (connId: number, stats: LocalVideoStats) => void): this;
  /** 
   * Reports the statistics of the local audio streams.
   * 
   * The SDK triggers this callback once every two seconds.
   * 
   * - stats: The statistics of the local audio stream. See 
   * {@link LocalAudioStats}.
   */
  on(evt: 'localAudioStats', cb: (connId: number, stats: LocalAudioStats) => void): this;
  /** Reports the statistics of the video stream from each remote user/host.
   * 
   * @param cb.stats Statistics of the received remote video streams. See 
   * {@link RemoteVideoState}.
   */
  on(evt: 'remoteVideoStats', cb: (connId: number, stats: RemoteVideoStats) => void): this;
  /** Reports the statistics of the audio stream from each remote user/host.
   * 
   * @param cb.stats Statistics of the received remote audio streams. See 
   * {@link RemoteAudioStats}.
   */
  on(evt: 'remoteAudioStats', cb: (connId: number, stats: RemoteAudioStats) => void): this;
  /** 
   * @deprecated This callback is deprecated. Use remoteVideoStats instead.
   * 
   * Reports the transport-layer statistics of each remote video stream.
   * 
   * This callback reports the transport-layer statistics, such as the packet 
   * loss rate and time delay, once every two seconds
   * after the local user receives the video packet from a remote user.
   * - stats: The transport-layer statistics. See 
   * {@link RemoteVideoTransportStats}.
   */
  on(evt: 'remoteVideoTransportStats', cb: (connId: number, stats: RemoteVideoTransportStats) => void): this;
  /** 
   * @deprecated This callback is deprecated. Use remoteAudioStats instead.
   * 
   * Reports the transport-layer statistics of each remote audio stream.
   * 
   * - stats: The transport-layer statistics. See 
   * {@link remoteAudioTransportStats}.
   */
  on(
    evt: 'remoteAudioTransportStats',
    cb: (connId: number, stats: RemoteAudioTransportStats) => void
  ): this;
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
  on(
    evt: 'audioDeviceStateChanged',
    cb: (connId: number, deviceId: string, deviceType: number, deviceState: number) => void
  ): this;
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
  on(
    evt: 'audioMixingStateChanged',
    cb: (connId: number, state: number, err: number) => void
  ): this;
  /** Occurs when a remote user starts audio mixing.
   * When a remote user calls {@link startAudioMixing} to play the background 
   * music, the SDK reports this callback.
   */
  // on(evt: 'remoteAudioMixingBegin', cb: () => void): this;
  /** Occurs when a remote user finishes audio mixing. */
  // on(evt: 'remoteAudioMixingEnd', cb: () => void): this;
  /** Occurs when the local audio effect playback finishes. */
  on(evt: 'audioEffectFinished', cb: (connId: number, soundId: number) => void): this;
  /** Occurs when the video device state changes.
   * - deviceId: Pointer to the device ID.
   * - deviceType: Device type. See {@link MediaDeviceType}.
   * - deviceState: Device state：
   *
   *  - 1: The device is active.
   *  - 2: The device is disabled.
   *  - 4: The device is not present.
   *  - 8: The device is unplugged.
   */
  on(
    evt: 'videoDeviceStateChanged',
    cb: (connId: number, deviceId: string, deviceType: number, deviceState: number) => void
  ): this;
  /**
   * Reports the last mile network quality of each user in the channel 
   * once every two seconds.
   * 
   * Last mile refers to the connection between the local device and Agora's 
   * edge server.
   *
   * @param cb.uid User ID. The network quality of the user with this uid is 
   * reported. 
   * If uid is 0, the local network quality is reported.
   * @param cb.txquality Uplink transmission quality rating of the user in 
   * terms of 
   * the transmission bitrate, packet loss rate, average RTT (Round-Trip Time), 
   * and jitter of the uplink network. See {@link AgoraNetworkQuality}.
   * @param cb.rxquality Downlink network quality rating of the user in terms 
   * of the 
   * packet loss rate, average RTT, and jitter of the downlink network. 
   * See {@link AgoraNetworkQuality}.
   */
  on(
    evt: 'networkQuality',
    cb: (
      connId: number, 
      uid: number,
      txquality: AgoraNetworkQuality,
      rxquality: AgoraNetworkQuality
    ) => void
  ): this;
  /** Reports the last mile network quality of the local user once every two 
   * seconds before the user joins the channel.
   * - quality: The last mile network quality. See {@link AgoraNetworkQuality}.
   *
   * Last mile refers to the connection between the local device and Agora's 
   * edge server. After the application calls the 
   * {@link enableLastmileTest} method,
   * this callback reports once every two seconds the uplink and downlink last 
   * mile network conditions of the local user before the user joins the 
   * channel.
   */
  on(evt: 'lastMileQuality', cb: (connId: number, quality: AgoraNetworkQuality) => void): this;
  /** Reports the last-mile network probe result.
   * - result: The uplink and downlink last-mile network probe test result. 
   * See {@link LastmileProbeResult}.
   *
   * The SDK triggers this callback within 30 seconds after the app calls 
   * the {@link startLastmileProbeTest} method.
   */
  on(
    evt: 'lastmileProbeResult',
    cb: (connId: number, result: LastmileProbeResult) => void
  ): this;
  /** Occurs when the first local video frame is displayed/rendered on the 
   * local video view.
   * 
   * - width: Width (px) of the first local video frame.
   * - height: Height (px) of the first local video frame.
   * - elapsed: Time elapsed (ms) from the local user calling the 
   * {@link joinChannel} method until the SDK triggers this callback.
   */
  on(
    evt: 'firstLocalVideoFrame',
    cb: (connId: number, width: number, height: number, elapsed: number) => void
  ): this;
  /** 
   * @deprecated This callback is deprecated. Use the remoteVideoStateChanged
   * callback instead.
   * 
   * Occurs when the first remote video frame is received and decoded.
   * - uid: User ID of the remote user sending the video stream.
   * - elapsed: Time elapsed (ms) from the local user calling the 
   * {@link joinChannel} method until the SDK triggers this callback.
   * This callback is triggered in either of the following scenarios:
   * - The remote user joins the channel and sends the video stream.
   * - The remote user stops sending the video stream and re-sends it after 
   * 15 seconds. Reasons for such an interruption include:
   *  - The remote user leaves the channel.
   *  - The remote user drops offline.
   *  - The remote user calls the {@link muteLocalVideoStream} method to stop 
   * sending the video stream.
   *  - The remote user calls the {@link disableVideo} method to disable video.
   */
  on(evt: 'addStream', cb: (connId: number, uid: number, elapsed: number) => void): this;
  /** Occurs when the video size or rotation of a specified user changes.
   * @param cb.uid User ID of the remote user or local user (0) whose video 
   * size or 
   * rotation changes.
   * @param cb.width New width (pixels) of the video.
   * @param cb.height New height (pixels) of the video.
   * @param cb.roation New height (pixels) of the video.
   */
  on(
    evt: 'videoSizeChanged',
    cb: (connId: number, uid: number, width: number, height: number, rotation: number) => void
  ): this;
  /** @deprecated This callback is deprecated, please use 
   * `remoteVideoStateChanged` instead.
   * 
   * Occurs when the first remote video frame is rendered.
   * 
   * The SDK triggers this callback when the first frame of the remote video 
   * is displayed in the user's video window.
   * 
   * @param cb.uid User ID of the remote user sending the video stream.
   * @param cb.width Width (pixels) of the video frame.
   * @param cb.height Height (pixels) of the video stream.
   * @param cb.elapsed Time elapsed (ms) from the local user calling the 
   * {@link joinChannel} method until the SDK triggers this callback.
   */
  // on(
  //   evt: 'firstRemoteVideoFrame',
  //   cb: (uid: number, width: number, height: number, elapsed: number) => void
  // ): this;
  /** Occurs when the first remote video frame is decoded.
   * The SDK triggers this callback when the first frame of the remote video 
   * is decoded.
   * - uid: User ID of the remote user sending the video stream.
   * - width: Width (pixels) of the video frame.
   * - height: Height (pixels) of the video stream.
   * - elapsed: Time elapsed (ms) from the local user calling the 
   * {@link joinChannel} method until the SDK triggers this callback.
   */
  on(
    evt: 'firstRemoteVideoDecoded',
    cb: (connId: number, uid: number, width: number, height: number, elapsed: number) => void
  ): this;
  /** Occurs when a user or host joins the channel.
   *
   * The SDK triggers this callback under one of the following circumstances:
   * - A remote user/host joins the channel by calling the {@link joinChannel} 
   * method.
   * - A remote user switches the user role to the host by calling the 
   * {@link setClientRole} method after joining the channel.
   * - A remote user/host rejoins the channel after a network interruption.
   * - The host injects an online media stream into the channel by calling 
   * the {@link addInjectStreamUrl} method.
   *
   * @note In the Live-broadcast profile:
   * - The host receives this callback when another host joins the channel.
   * - The audience in the channel receives this callback when a new host 
   * joins the channel.
   * - When a web application joins the channel, the SDK triggers this 
   * callback as long as the web application publishes streams.
   * 
   * @param cb.uid User ID of the user or host joining the channel.
   * @param cb.elapsed Time delay (ms) from the local user calling the 
   * {@link joinChannel} method until the SDK triggers this callback.
   */
  on(evt: 'userJoined', cb: (connId: number, uid: number, elapsed: number) => void): this;
  /** Occurs when a remote user leaves the channel.
   * - uid: User ID of the user leaving the channel or going offline.
   * - reason: Reason why the user is offline:
   *  - 0: The user quits the call.
   *  - 1: The SDK times out and the user drops offline because no data packet 
   * is received within a certain period of time.
   *  If the user quits the call and the message is not passed to the SDK 
   * (due to an unreliable channel), the SDK assumes the user dropped offline.
   *  - 2: The client role switched from the host to the audience.
   * Reasons why the user is offline:
   * - Leave the channel: When the user leaves the channel, the user sends 
   * a goodbye message. When the message is received, the SDK assumes that 
   * the user leaves the channel.
   * - Drop offline: When no data packet of the user or host is received for 
   * a certain period of time (20 seconds for the Communication profile,
   * and more for the Live-broadcast profile), the SDK assumes that the user 
   * drops offline. Unreliable network connections may lead to false 
   * detections, so we recommend using a signaling system for more reliable 
   * offline detection.
   */
  on(evt: 'removeStream', cb: (connId: number, uid: number, reason: number) => void): this;
  /** Occurs when a remote user (Communication)/host (Live Broadcast) leaves 
   * the channel.
   * 
   * There are two reasons for users to become offline:
   * - Leave the channel: When the user/host leaves the channel, the user/host 
   * sends a goodbye message. When this message is received, the SDK determines 
   * that the user/host leaves the channel.
   * - Drop offline: When no data packet of the user or host is received for a 
   * certain period of time (20 seconds for the communication profile, and more 
   * for the live broadcast profile), the SDK assumes that the user/host drops 
   * offline. A poor network connection may lead to false detections, so we 
   * recommend using the signaling system for reliable offline detection.
   * 
   * @param cb.uid ID of the user or host who leaves the channel or goes 
   * offline.
   * @param cb.reason Reason why the user goes offline:
   *  - The user left the current channel.
   *  - The SDK timed out and the user dropped offline because no data packet 
   * was received within a certain period of time. If a user quits the call 
   * and the message is not passed to the SDK (due to an unreliable channel), 
   * the SDK assumes the user dropped offline.
   *  - (Live broadcast only.) The client role switched from the host to the 
   * audience.
   */
  on(evt: 'userOffline', cb: (connId: number, uid: number, reason: number) => void): this;
  /** @deprecated This callback is deprecated, please use
   * `remoteAudioStateChanged` instead.
   * 
   * Occurs when a remote user's audio stream is muted/unmuted.
   *
   * The SDK triggers this callback when the remote user stops or resumes 
   * sending the audio stream by calling the {@link muteLocalAudioStream} 
   * method.
   * - uid: User ID of the remote user.
   * - muted: Whether the remote user's audio stream is muted/unmuted:
   *  - true: Muted.
   *  - false: Unmuted.
   */
  // on(evt: 'userMuteAudio', cb: (uid: number, muted: boolean) => void): this;
  
  /** 
   * Occurs when a remote user's video stream playback pauses/resumes.
   *
   * The SDK triggers this callback when the remote user stops or resumes 
   * sending the video stream by calling the {@link muteLocalVideoStream} 
   * method.
   *
   * - uid: User ID of the remote user.
   * - muted: Whether the remote user's video stream playback is paused/resumed:
   *  - true: Paused.
   *  - false: Resumed.
   *
   * **Note**: This callback returns invalid when the number of users in a 
   * channel exceeds 20.
   */
  on(evt: 'userMuteVideo', cb: (connId: number, uid: number, muted: boolean) => void): this;
  /** 
   * @deprecated This callback is deprecated. Use the remoteVideoStateChanged
   * callback instead.
   * 
   * Occurs when a specific remote user enables/disables the video module.
   *
   * The SDK triggers this callback when the remote user enables or disables 
   * the video module by calling the {@link enableVideo} or 
   * {@link disableVideo} method.
   * - uid: User ID of the remote user.
   * - enabled: Whether the remote user enables/disables the video module:
   *  - true: Enable. The remote user can enter a video session.
   *  - false: Disable. The remote user can only enter a voice session, and 
   * cannot send or receive any video stream.
   */
  on(evt: 'userEnableVideo', cb: (connId: number, uid: number, enabled: boolean) => void): this;
  /** 
   * @deprecated This callback is deprecated. Use the remoteVideoStateChanged 
   * callback instead.
   * 
   * Occurs when a specified remote user enables/disables the local video 
   * capturing function.
   *
   * The SDK triggers this callback when the remote user resumes or stops 
   * capturing the video stream by calling the {@link enableLocalVideo} method.
   * - uid: User ID of the remote user.
   * - enabled: Whether the remote user enables/disables the local video 
   * capturing function:
   *  - true: Enable. Other users in the channel can see the video of this 
   * remote user.
   *  - false: Disable. Other users in the channel can no longer receive the 
   * video stream from this remote user, while this remote user can still 
   * receive the video streams from other users.
   */
  on(
    evt: 'userEnableLocalVideo',
    cb: (connId: number, uid: number, enabled: boolean) => void
  ): this;
  /**
   * @deprecated Replaced by the localVideoStateChanged callback.
   * Occurs when the camera turns on and is ready to capture the video.
   */
  on(evt: 'cameraReady', cb: (connId: number) => void): this;
  /**
   * @deprecated Replaced by the localVideoStateChanged callback.
   * Occurs when the video stops playing.
   */
  on(evt: 'videoStopped', cb: (connId: number) => void): this;
  /** Occurs when the SDK cannot reconnect to Agora's edge server 10 seconds 
   * after its connection to the server is interrupted.
   * 
   * The SDK triggers this callback when it cannot connect to the server 10 
   * seconds after calling the {@link joinChannel} method, whether or not it 
   * is in the channel.
   * - If the SDK fails to rejoin the channel 20 minutes after being 
   * disconnected from Agora's edge server, the SDK stops rejoining the 
   * channel.
   */
  on(evt: 'connectionLost', cb: (connId: number) => void): this;
  // on(evt: 'connectionInterrupted', cb: () => void): this;
  /**
   * @deprecated Replaced by the connectionStateChanged callback.
   * Occurs when your connection is banned by the Agora Server.
   */
  // on(evt: 'connectionBanned', cb: () => void): this;
  // on(evt: 'refreshRecordingServiceStatus', cb: () => void): this;
  /** Occurs when the local user receives the data stream from the remote 
   * user within five seconds.
   *
   * The SDK triggers this callback when the local user receives the stream 
   * message that the remote user sends by calling the 
   * {@link sendStreamMessage} method.
   * @param cb.uid User ID of the remote user sending the message.
   * @param cb.streamId Stream ID.
   * @param cb.msg The data received bt the local user.
   * @param cb.len Length of the data in bytes.
   */
  on(
    evt: 'streamMessage',
    cb: (connId: number, uid: number, streamId: number, msg: string, len: number) => void
  ): this;
  /** Occurs when the local user does not receive the data stream from the 
   * remote user within five seconds.
   * 
   * The SDK triggers this callback when the local user fails to receive the 
   * stream message that the remote user sends by calling the 
   * {@link sendStreamMessage} method.
   * 
   * @param cb.uid User ID of the remote user sending the message.
   * @param cb.streamId Stream ID.
   * @param cb.err Error code.
   * @param cb.missed Number of the lost messages.
   * @param cb.cached Number of incoming cached messages when the data stream 
   * is interrupted.
   */
  on(
    evt: 'streamMessageError',
    cb: (
      connId: number, 
      uid: number,
      streamId: number,
      code: number,
      missed: number,
      cached: number
    ) => void
  ): this;
  /** Occurs when the media engine call starts. */
  on(evt: 'mediaEngineStartCallSuccess', cb: (connId: number) => void): this;
  /** Occurs when the token expires.
   * 
   * After a token(channel key) is specified by calling the {@link joinChannel} 
   * method, 
   * if the SDK losses connection with the Agora server due to network issues, 
   * the token may expire after a certain period
   * of time and a new token may be required to reconnect to the server.
   *
   * This callback notifies the application to generate a new token. Call 
   * the {@link renewToken} method to renew the token
   */
  // on(evt: 'requestChannelKey', cb: () => void): this;
  /** Occurs when the engine sends the first local audio frame.
   * - elapsed: Time elapsed (ms) from the local user calling 
   * {@link joinChannel} until the
   * SDK triggers this callback.
   */
  // on(evt: 'firstLocalAudioFrame', cb: (elapsed: number) => void): this;
  /** @deprecated This callback is deprecated. Please use
   * `remoteAudioStateChanged` instead.
   * 
   * Occurs when the engine receives the first audio frame from a specific 
   * remote user.
   * - uid: User ID of the remote user.
   * - elapsed: Time elapsed (ms) from the local user calling 
   * {@link joinChannel} until the
   * SDK triggers this callback.
   */
  // on(
  //   evt: 'firstRemoteAudioFrame',
  //   cb: (uid: number, elapsed: number) => void
  // ): this;
  /** @deprecated This callback is deprecated, please use
   * `remoteAudioStateChanged` instead.
   * 
   * Occurs when the engine receives the first audio frame from a specified 
   * remote user.
   * @param cb.uid User ID of the remote user sending the audio stream.
   * @param cb.elapsed The time elapsed (ms) from the local user calling the 
   * {@link joinChannel} method until the SDK triggers this callback.
   */
  // on(
  //   evt: 'firstRemoteAudioDecoded',
  //   cb: (uid: number, elapsed: number) => void
  // ): this;
  /**
   * Reports which user is the loudest speaker.
   * 
   * This callback returns the user ID of the user with the highest voice 
   * volume during a period of time, instead of at the moment.
   * 
   * @note To receive this callback, you need to call the 
   * {@link enableAudioVolumeIndication} method.
   * 
   * @param cb.uid User ID of the active speaker. A uid of 0 represents the 
   * local user.
   * If the user enables the audio volume indication by calling the 
   * {@link enableAudioVolumeIndication} method, this callback returns the uid 
   * of the
   * active speaker detected by the audio volume detection module of the SDK.
   *
   */
  on(evt: 'activeSpeaker', cb: (connId: number, uid: number) => void): this;
  /** Occurs when the user role switches in a live broadcast.
   * 
   * For example, 
   * from a host to an audience or vice versa.
   *
   * This callback notifies the application of a user role switch when the 
   * application calls the {@link setClientRole} method.
   *
   * @param cb.oldRole The old role, see {@link ClientRoleType}
   * @param cb.newRole The new role, see {@link ClientRoleType}
   */
  on(
    evt: 'clientRoleChanged',
    cb: (connId: number, oldRole: ClientRoleType, newRole: ClientRoleType) => void
  ): this;
  /** Occurs when the volume of the playback device, microphone, or 
   * application changes.
   * - deviceType: Device type. See {
   * @link AgoraRtcEngine.MediaDeviceType MediaDeviceType}.
   * - volume: Volume of the device. The value ranges between 0 and 255.
   * - muted:
   *  - true: Volume of the device. The value ranges between 0 and 255.
   *  - false: The audio device is not muted.
   */
  on(
    evt: 'audioDeviceVolumeChanged',
    cb: (connId: number, deviceType: MediaDeviceType, volume: number, muted: boolean) => void
  ): this;
  /** Occurs when the remote video state changes.
   * 
   * @param cb.uid ID of the user whose video state changes.
   * @param cb.state State of the remote video. 
   * See {@link RemoteVideoState}.
   * @param cb.reason The reason of the remote video state change. 
   * See {@link RemoteVideoStateReason}
   * @param cb.elapsed Time elapsed (ms) from the local user calling the 
   * {@link joinChannel} method until the SDK triggers this callback.
   */
  on(
    evt: 'remoteVideoStateChanged',
    cb: (
      connId: number, 
      uid: number,
      state: RemoteVideoState,
      reason: RemoteVideoStateReason,
      elapsed: number
    ) => void
  ): this;
  /** Occurs when the camera focus area changes.
   * - x: x coordinate of the changed camera focus area.
   * - y: y coordinate of the changed camera focus area.
   * - width: Width of the changed camera focus area.
   * - height: Height of the changed camera focus area.
   */
  on(
    evt: 'cameraFocusAreaChanged',
    cb: (connId: number, x: number, y: number, width: number, height: number) => void
  ): this;
  /** Occurs when the camera exposure area changes.
   * - x: x coordinate of the changed camera exposure area.
   * - y: y coordinate of the changed camera exposure area.
   * - width: Width of the changed camera exposure area.
   * - height: Height of the changed camera exposure area.
   */
  on(
    evt: 'cameraExposureAreaChanged',
    cb: (connId: number, x: number, y: number, width: number, height: number) => void
  ): this;
  /** Occurs when the token expires in 30 seconds.
   *
   * The user becomes offline if the token used in the {@link joinChannel} 
   * method expires. The SDK triggers this callback 30 seconds
   * before the token expires to remind the application to get a new token. 
   * Upon receiving this callback, generate a new token
   * on the server and call the {@link renewToken} method to pass the new 
   * token to the SDK.
   *
   * @param cb.token The token that expires in 30 seconds.
   */
  on(evt: 'tokenPrivilegeWillExpire', cb: (connId: number, token: string) => void): this;
  /** @deprecated This callback is deprecated. Please use
   * `rtmpStreamingStateChanged` instead.
   * 
   * Reports the result of CDN live streaming.
   *
   * - url: The RTMP URL address.
   * - error: Error code:
   *  - 0: The publishing succeeds.
   *  - 1: The publishing fails.
   *  - 2: Invalid argument used. For example, you did not call 
   * {@link setLiveTranscoding} to configure LiveTranscoding before 
   * calling {@link addPublishStreamUrl}.
   *  - 10: The publishing timed out.
   *  - 19: The publishing timed out.
   *  - 130: You cannot publish an encrypted stream.
   */
  on(evt: 'streamPublished', cb: (connId: number, url: string, error: number) => void): this;
  /** @deprecated This callback is deprecated. Please use
   * `rtmpStreamingStateChanged` instead.
   * 
   * This callback indicates whether you have successfully removed an RTMP 
   * stream from the CDN.
   *
   * Reports the result of calling the {@link removePublishStreamUrl} method.
   * - url: The RTMP URL address.
   */
  on(evt: 'streamUnpublished', cb: (connId: number, url: string) => void): this;
  /**
   * Occurs when the state of the RTMP streaming changes.
   * 
   * The SDK triggers this callback to report the result of the local user 
   * calling the {@link addPublishStreamUrl} and {@link removePublishStreamUrl}
   * method.
   * 
   * This callback indicates the state of the RTMP streaming. When exceptions 
   * occur, you can troubleshoot issues by referring to the detailed error 
   * descriptions in the `code` parameter.
   * @param cb.url The RTMP URL address.
   * @param cb.state The RTMP streaming state:
   * - `0`: The RTMP streaming has not started or has ended. This state is also 
   * triggered after you remove an RTMP address from the CDN by calling 
   * {@link removePublishStreamUrl}.
   * - `1`: The SDK is connecting to Agora's streaming server and the RTMP 
   * server. This state is triggered after you call the 
   * {@link addPublishStreamUrl} method.
   * - `2`: The RTMP streaming publishes. The SDK successfully publishes the 
   * RTMP streaming and returns this state.
   * - `3`: The RTMP streaming is recovering. When exceptions occur to the CDN, 
   * or the streaming is interrupted, the SDK tries to resume RTMP streaming 
   * and returns this state. 
   *  - If the SDK successfully resumes the streaming, `2` returns.
   *  - If the streaming does not resume within 60 seconds or server errors 
   * occur, `4` returns. You can also reconnect to the server by calling the
   * {@link removePublishStreamUrl} and then {@link addPublishStreamUrl} 
   * method.
   * - `4`: The RTMP streaming fails. See the `code` parameter for the 
   * detailed error information. You can also call the 
   * {@link addPublishStreamUrl} method to publish the RTMP streaming again.
   * @param cb.code The detailed error information:
   * - `0`: The RTMP streaming publishes successfully.
   * - `1`: Invalid argument used. 
   * - `2`: The RTMP streams is encrypted and cannot be published.
   * - `3`: Timeout for the RTMP streaming. Call the 
   * {@link addPublishStreamUrl} to publish the stream again.
   * - `4`: An error occurs in Agora's streaming server. Call the 
   * {@link addPublishStreamUrl} to publish the stream again.
   * - `5`: An error occurs in the RTMP server.
   * - `6`: The RTMP streaming publishes too frequently.
   * - `7`: The host publishes more than 10 URLs. Delete the unnecessary URLs 
   * before adding new ones.
   * - `8`: The broadcaster manipulates other hosts' URLs. Check your app 
   * logic.
   * - `9`: Agora's server fails to find the RTMP stream.
   * - `10`: The format of the stream's URL address is not supported. Check 
   * whether the URL format is correct.
   */
  on(evt: 'rtmpStreamingStateChanged', cb: (connId: number, url: string, state: number, code: number) => void): this;
  /** Occurs when the publisher's transcoding is updated.
   * 
   * When the LiveTranscoding class in the setLiveTranscoding method updates, 
   * the SDK triggers the transcodingUpdated callback to report the update 
   * information to the local host.
   * 
   * **Note**: If you call the {@link setLiveTranscoding} method to set the 
   * LiveTranscoding class for the first time, the SDK does not trigger the 
   * transcodingUpdated callback.
   */
  on(evt: 'transcodingUpdated', cb: (connId: number) => void): this;
  /** Occurs when a voice or video stream URL address is added to a live 
   * broadcast.
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
  on(
    evt: 'streamInjectStatus',
    cb: (connId: number, url: string, uid: number, status: number) => void
  ): this;
  /** Occurs when the locally published media stream falls back to an 
   * audio-only stream due to poor network conditions or switches back
   * to the video after the network conditions improve.
   *
   * If you call {@link setLocalPublishFallbackOption} and set option as 
   * AUDIO_ONLY(2), the SDK triggers this callback when
   * the locally published stream falls back to audio-only mode due to poor 
   * uplink conditions, or when the audio stream switches back to
   * the video after the uplink network condition improves.
   *
   * - isFallbackOrRecover: Whether the locally published stream falls back to 
   * audio-only or switches back to the video:
   *  - true: The locally published stream falls back to audio-only due to poor 
   * network conditions.
   *  - false: The locally published stream switches back to the video after 
   * the network conditions improve.
   */
  on(evt: 'localPublishFallbackToAudioOnly', cb: (connId: number, isFallbackOrRecover: boolean) => void): this;
  /** Occurs when the remote media stream falls back to audio-only stream due 
   * to poor network conditions or switches back to the video stream after the 
   * network conditions improve.
   *
   * If you call {@link setRemoteSubscribeFallbackOption} and set option as 
   * AUDIO_ONLY(2), the SDK triggers this callback when
   * the remotely subscribed media stream falls back to audio-only mode due to
   * poor uplink conditions, or when the remotely subscribed media stream 
   * switches back to the video after the uplink network condition improves.
   * @param cb.uid ID of the remote user sending the stream.
   * @param cb.isFallbackOrRecover Whether the remote media stream falls back 
   * to audio-only or switches back to the video:
   *  - `true`: The remote media stream falls back to audio-only due to poor 
   * network conditions.
   *  - `false`: The remote media stream switches back to the video stream 
   * after the network conditions improved.
   */
  on(evt: 'remoteSubscribeFallbackToAudioOnly', cb: (
    connId: number, 
    uid: number,
    isFallbackOrRecover: boolean
  ) => void): this;
  /** 
   * @deprecated This callback is deprecated. Use the localAudioStateChanged 
   * callback instead.
   * 
   * Occurs when the microphone is enabled/disabled.
   * - enabled: Whether the microphone is enabled/disabled:
   *  - true: Enabled.
   *  - false: Disabled.
   */
  // on(evt: 'microphoneEnabled', cb: (enabled: boolean) => void): this;
  /** Occurs when the connection state between the SDK and the server changes.
   * @param cb.state The connection state, see {@link ConnectionState}.
   * @param cb.reason The connection reason, see {@link ConnectionState}.
   */
  on(evt: 'connectionStateChanged', cb: (
    connId: number, 
    state: ConnectionState,
    reason: ConnectionChangeReason
  ) => void): this;
  /** Occurs when the local user successfully registers a user account by 
   * calling the {@link registerLocalUserAccount} method.
   * This callback reports the user ID and user account of the local user.
   * - uid: The ID of the local user.
   * - userAccount: The user account of the local user.
   */
  // on(
  //   evt: 'localUserRegistered',
  //   cb: (uid: number, userAccount: string) => void
  // ): this;
  /** Occurs when the SDK gets the user ID and user account of the remote user.
   *
   * After a remote user joins the channel, the SDK gets the UID and user 
   * account of the remote user, caches them in a mapping table
   * object (UserInfo), and triggers this callback on the local client.
   * - uid: The ID of the remote user.
   * - userInfo: The UserInfo Object that contains the user ID and user 
   * account of the remote user.
   */
  // on(
  //   evt: 'userInfoUpdated',
  //   cb: (uid: number, userInfo: UserInfo) => void
  // ): this;
  /**
   * Occurs when the local video state changes.
   * - localVideoState: The local video state:
   *  - 0: The local video is in the initial state.
   *  - 1: The local video capturer starts successfully.
   *  - 2: The local video capturer starts successfully.
   *  - 3: The local video fails to start.
   * - error: The detailed error information of the local video:
   *  - 0: The local video is normal.
   *  - 1: No specified reason for the local video failure.
   *  - 2: No permission to use the local video device.
   *  - 3: The local video capturer is in use.
   *  - 4: The local video capture fails. Check whether the capturer is 
   * working properly.
   *  - 5: The local video encoding fails.
   */
  on(evt: 'localVideoStateChanged', cb: (
    connId: number, 
    localVideoState: number,
    error: number
  ) => void): this;
  /**
   * Occurs when the local audio state changes.
   * 
   * This callback indicates the state change of the local audio stream, 
   * including the state of the audio recording and encoding, and allows you 
   * to troubleshoot issues when exceptions occur.
   * 
   * **Note**:
   * When the state is 3 in the `state` code, see the `error` code.
   * 
   * - state State of the local audio:
   *  - 0: The local audio is in the initial state. 
   *  - 1: The recording device starts successfully. 
   *  - 2: The first audio frame encodes successfully. 
   *  - 3: The local audio fails to start.
   * 
   * - error The error information of the local audio:
   *  - 0: The local audio is normal. 
   *  - 1: No specified reason for the local audio failure. 
   *  - 2: No permission to use the local audio device. 
   *  - 3: The microphone is in use. 
   *  - 4: The local audio recording fails. Check whether the recording device 
   * is working properly. 
   *  - 5: The local audio encoding fails.
   */
  on(evt: 'localAudioStateChanged', cb: (
    connId: number, 
    state: number,
    error: number
  ) => void): this;
  /**
   * Occurs when the remote audio state changes.
   * 
   * This callback indicates the state change of the remote audio stream.
   * 
   * @param cb.uid ID of the remote user whose audio state changes.
   * 
   * @param cb.state State of the remote audio: 
   * {@link RemoteAudioState}.
   * 
   * @param cb.reason The reason of the remote audio state change: 
   * {@link RemoteAudioStateReason}.
   * 
   * @param cb.elapsed Time elapsed (ms) from the local user calling the 
   * {@link joinChannel} method until the SDK triggers this callback.
   */
  on(evt: 'remoteAudioStateChanged', cb: (
    connId: number, 
    uid: number,
    state: RemoteAudioState,
    reason: RemoteAudioStateReason,
    elapsed: number
  ) => void): this;
  /**
   * Occurs when the state of the media stream relay changes.
   * 
   * The SDK reports the state of the current media relay and possible error 
   * messages in this callback.
   * 
   * @param cb.state The state code. See {@link ChannelMediaRelayState}.
   * @param cb.code The error code. See {@link ChannelMediaRelayError}.
   */
  // on(evt: 'channelMediaRelayState', cb: (
  //   state: ChannelMediaRelayState,
  //   code: ChannelMediaRelayError
  // ) => void): this;
  /**
   * Reports events during the media stream relay.
   * 
   * @param cb.event The event code. See {@link ChannelMediaRelayEvent}.
   */
  // on(evt: 'channelMediaRelayEvent', cb: (
  //   event: ChannelMediaRelayEvent
  // ) => void): this;
  on(evt: 'receiveMetadata', cb: (
    metadata: Metadata
    ) => void): this;

  on(evt: 'sendMetadataSuccess', cb: (
    metadata: Metadata
    ) => void): this;

  on(evt: 'firstLocalAudioFramePublished', cb: (
    connId: number, 
    elapsed: number
  )=>void): this;

  on(evt: 'videoSourceFrameSizeChanged', cb: (
    sourceType: VIDEO_SOURCE_TYPE,
    width: number,
    height: number
  )=>void): this;

  on(evt: 'mediaDeviceChanged', cb: (
    connId: number, 
    deviceType: number
  )=>void): this;

  on(evt: 'extensionEvent', cb: (
    id: string, 
    key: string, 
    jsonValue: string
  )=>void): this;

  // on(evt: 'firstLocalVideoFramePublished', cb: (
  //   elapsed: number
  // )=>void): this;

  // on(evt: 'rtmpStreamingEvent', cb: (
  //   url: string,
  //   eventCode: RTMP_STREAMING_EVENT
  // )=>void): this;

  // on(evt: 'audioPublishStateChanged', cb: (
  //   channel: string, 
  //   oldState: STREAM_PUBLISH_STATE, 
  //   newState: STREAM_PUBLISH_STATE,
  //   elapseSinceLastState: number
  // )=> void): this;

  // on(evt: 'videoPublishStateChanged', cb: (
  //   channel: string, 
  //   oldState: STREAM_PUBLISH_STATE, 
  //   newState: STREAM_PUBLISH_STATE,
  //   elapseSinceLastState: number
  // )=> void): this;

  // on(evt: 'audioSubscribeStateChanged', cb: (
  //   channel: string,
  //   uid: number, 
  //   oldState: STREAM_SUBSCRIBE_STATE, 
  //   newState: STREAM_SUBSCRIBE_STATE, 
  //   elapseSinceLastState: number
  // )=> void): this;

  // on(evt: 'videoSubscribeStateChanged', cb: (
  //   channel: string,
  //   uid: number, 
  //   oldState: STREAM_SUBSCRIBE_STATE, 
  //   newState: STREAM_SUBSCRIBE_STATE, 
  //   elapseSinceLastState: number
  // )=> void): this;

  on(evt: string, listener: Function): this;
}

class AgoraMediaPlayer extends EventEmitter {
  mediaPlayer: NodeMediaPlayer;
  constructor(mediaPlayer:NodeMediaPlayer) {
    super();
    this.mediaPlayer = mediaPlayer;
  }

  initEventHandler(): void {
    const fire = (event: string, ...args: Array<any>) => {
      setImmediate(() => {
        this.emit(event, ...args);
      });
    };

    this.mediaPlayer.onEvent('onApiError', (funcName: string) => {
      console.error(`api ${funcName} failed. this is an error
              thrown by c++ addon layer. it often means sth is
              going wrong with this function call and it refused
              to do what is asked. kindly check your parameter types
              to see if it matches properly.`);
    });

    this.mediaPlayer.onEvent('onPlayerStateChanged', (
      state: MEDIA_PLAYER_STATE,
      ec: MEDIA_PLAYER_ERROR
    ) => {
      fire('onPlayerStateChanged', state, ec);
    });

    this.mediaPlayer.onEvent('onPlayEvent', (
      event: MEDIA_PLAYER_EVENT
    ) => {
      fire('onPlayEvent', event);
    });

    // this.mediaPlayer.onEvent('onMetaData', (
    //   error: number,
    //   message: string
    // ) => {
    //   fire('onMetaData', error, message);
    // });

    this.mediaPlayer.onEvent('onPositionChanged', (
      position: number
    ) => {
      fire('onPositionChanged', position);
    });
  }

  open(url: string, position: number): number {
    return this.mediaPlayer.open(url, position);
  }

  play(): number {
    return this.mediaPlayer.play();
  }

  pause(): number {
    return this.mediaPlayer.pause();
  }

  stop(): number {
    return this.mediaPlayer.stop();
  }

  seek(position: number): number {
    return this.mediaPlayer.seek(position);
  }

  getPlayPosition(): number {
    return this.mediaPlayer.getPlayPosition();
  }

  getDuration(): number {
    return this.mediaPlayer.getDuration();
  }

  getStreamCount(): number {
    return this.mediaPlayer.getStreamCount();
  }

  getSourceId(): number {
    return this.mediaPlayer.getSourceId();
  }

  getStreamInfo(index: number) : MediaStreamInfo {
    return this.mediaPlayer.getStreamInfo(index);
  }

  setPlayerOption(key: string, value: number): number {
    return this.mediaPlayer.setPlayerOption(key, value);
  }

  changePlaybackSpeed(speed: MEDIA_PLAYER_PLAY_SPEED): number {
    return this.mediaPlayer.changePlaybackSpeed(speed);
  }

  selectAudioTrack(index: number): number {
    return this.mediaPlayer.selectAudioTrack(index);
  }

}

export default AgoraRtcEngine;
