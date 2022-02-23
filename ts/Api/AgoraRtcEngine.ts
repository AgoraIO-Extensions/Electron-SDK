import {
  ApiTypeEngine,
  ApiTypeAudioDeviceManager,
  ApiTypeVideoDeviceManager,
  ApiTypeRawDataPluginManager,
  PROCESS_TYPE,
  VOICE_CONVERSION_PRESET,
  IrisVideoSourceType,
  AUDIO_MIXING_DUAL_MONO_MODE,
  SIZE,
} from "./internal/native_type";
import {
  NodeIrisRtcEngine,
  NodeIrisRtcDeviceManager,
} from "./internal/native_interface";
import {
  Rect,
  Rectangle,
  RtcStats,
  QUALITY_TYPE,
  LocalVideoStats,
  LocalAudioStats,
  RemoteVideoStats,
  RemoteAudioStats,
  REMOTE_AUDIO_STATE_REASON,
  REMOTE_VIDEO_STATE,
  REMOTE_VIDEO_STATE_REASON,
  REMOTE_AUDIO_STATE,
  LastmileProbeResult,
  CLIENT_ROLE_TYPE,
  REMOTE_VIDEO_STREAM_TYPE,
  CONNECTION_STATE_TYPE,
  CONNECTION_CHANGED_REASON_TYPE,
  MEDIA_DEVICE_TYPE,
  VIDEO_PROFILE_TYPE,
  LiveTranscoding,
  InjectStreamConfig,
  VOICE_CHANGER_PRESET,
  AUDIO_REVERB_PRESET,
  LastmileProbeConfig,
  PRIORITY_TYPE,
  CameraCapturerConfiguration,
  ScreenSymbol,
  ScreenCaptureParameters,
  VideoContentHint,
  VideoEncoderConfiguration,
  UserInfo,
  Metadata,
  RTMP_STREAMING_EVENT,
  AREA_CODE,
  STREAM_PUBLISH_STATE,
  STREAM_SUBSCRIBE_STATE,
  AUDIO_ROUTE_TYPE,
  EncryptionConfig,
  AUDIO_EFFECT_PRESET,
  VOICE_BEAUTIFIER_PRESET,
  ClientRoleOptions,
  CLOUD_PROXY_TYPE,
  LogConfig,
  RtcEngineContext,
  BeautyOptions,
  AUDIO_PROFILE_TYPE,
  AUDIO_SCENARIO_TYPE,
  VIDEO_MIRROR_MODE_TYPE,
  STREAM_FALLBACK_OPTIONS,
  USER_OFFLINE_REASON_TYPE,
  LOCAL_AUDIO_STREAM_STATE,
  LOCAL_AUDIO_STREAM_ERROR,
  AudioVolumeInfo,
  AUDIO_MIXING_STATE_TYPE,
  AUDIO_MIXING_REASON_TYPE,
  LOCAL_VIDEO_STREAM_ERROR,
  LOCAL_VIDEO_STREAM_STATE,
  SUPER_RESOLUTION_STATE_REASON,
  NETWORK_TYPE,
  ChannelMediaOptions,
  WatermarkOptions,
  CHANNEL_MEDIA_RELAY_EVENT,
  CHANNEL_MEDIA_RELAY_STATE,
  CHANNEL_MEDIA_RELAY_ERROR,
  ChannelMediaRelayConfiguration,
  METADATA_TYPE,
  CHANNEL_PROFILE_TYPE,
  WindowInfo,
  Device,
  MacScreenId,
  AUDIO_EQUALIZATION_BAND_FREQUENCY,
  AUDIO_RECORDING_QUALITY_TYPE,
  AUDIO_REVERB_TYPE,
  INJECT_STREAM_STATUS,
  LOG_FILTER_TYPE,
  MEDIA_DEVICE_STATE_TYPE,
  DataStreamConfig,
  RAW_AUDIO_FRAME_OP_MODE_TYPE,
  AudioRecordingConfiguration,
  VirtualBackgroundSource,
  DisplayInfo,
} from "./types";
import { EventEmitter } from "events";
import {
  deprecate,
  logWarn,
  logInfo,
  logError,
  objsKeysToLowerCase,
  changeEventNameForOnXX,
  jsonStringToArray,
  changeEventNameForVideoSource,
  forwardEvent,
} from "../Utils";
import { PluginInfo, Plugin } from "./plugin";
import { RendererManager } from "../Renderer/RendererManager";
import {
  User,
  Channel,
  RENDER_MODE,
  RendererOptions,
  CONTENT_MODE,
  RendererConfig,
  VideoFrame,
} from "../Renderer/type";
import { EngineEvents, VideoSourceEvents } from "../Common/JSEvents";
import { AgoraRtcChannel } from "./AgoraRtcChannel";
import {
  NativeEngineEvents,
  NativeVideoSourceEvents,
} from "../Common/NativeEvents";

const agora = require("../../build/Release/agora_node_ext");

/**
 * The AgoraRtcEngine class.
 */
export class AgoraRtcEngine extends EventEmitter {
  _rtcEngine: NodeIrisRtcEngine;
  _rtcDeviceManager: NodeIrisRtcDeviceManager;
  _rendererManager?: RendererManager;
  _info: { currentChannel?: string } = {
    currentChannel: "",
  };

  fire = (event: string, ...args: Array<any>) => {
    setImmediate(() => {
      this.emit(event, ...args);
    });
  };

  constructor() {
    super();
    logInfo("AgoraRtcEngine constructor()");
    this._rtcEngine = new agora.NodeIrisRtcEngine();
    this._rtcDeviceManager = this._rtcEngine.GetDeviceManager();

    this._rtcEngine.OnEvent(
      "call_back",
      (processType: PROCESS_TYPE, eventName: string, eventData: string) =>
        forwardEvent({
          event: {
            eventName,
            params: eventData,
            changeNameHandler:
              processType === PROCESS_TYPE.MAIN
                ? changeEventNameForOnXX
                : changeEventNameForVideoSource,
          },
          fire: this.fire,
          filter:
            processType === PROCESS_TYPE.MAIN
              ? this.engineFilterEvent
              : this.videoSourceFilterEvent,
        })
    );

    this._rtcEngine.OnEvent(
      "call_back_with_buffer",
      (
        processType: PROCESS_TYPE,
        eventName: string,
        eventData: string,
        eventBuffer: string
      ) =>
        forwardEvent({
          event: {
            eventName,
            params: eventData,
            buffer: eventBuffer,
            changeNameHandler:
              processType === PROCESS_TYPE.MAIN
                ? changeEventNameForOnXX
                : changeEventNameForVideoSource,
          },
          fire: this.fire,
          filter:
            processType === PROCESS_TYPE.MAIN
              ? this.engineFilterEventWithBuffer
              : this.videoSourceFilterEventWithBuffer,
        })
    );
    this._rendererManager = new RendererManager(this._rtcEngine);
  }

  setAddonLogFile(filePath: string): number {
    let ret = this._rtcEngine.SetAddonLogFile(PROCESS_TYPE.MAIN, filePath);
    return ret.retCode;
  }

  /**
   * Decide whether to use webgl/software/custom rendering.
   * @param {RENDER_MODE} mode:
   * - 1 for old webgl rendering.
   * - 2 for software rendering.
   * - 3 for custom rendering.
   */
  setRenderMode(mode: RENDER_MODE): void {
    this._rendererManager?.setRenderMode(mode);
  }

  /**
   * @private
   * @ignore
   * check if WebGL will be available with appropriate features
   * @return {boolean}
   */
  _checkWebGL(): boolean {
    let gl;
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const options = {
      // Turn off things we don't need
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      preferLowPowerToHighPerformance: true,
    };

    try {
      gl =
        canvas.getContext("webgl", options) ||
        canvas.getContext("experimental-webgl", options);
    } catch (e) {
      logWarn("webGL not support");
      return false;
    }

    if (gl) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @private
   * @ignore
   */
  resizeBuffer(
    uid: number,
    channelId: string,
    yStride: number,
    height: number,
    videoSourceType: IrisVideoSourceType
  ): VideoFrame {
    yStride = ((yStride + 15) >> 4) << 4;
    return {
      uid,
      channelId,
      yBuffer: Buffer.alloc(yStride * height),
      uBuffer: Buffer.alloc((yStride * height) / 4),
      vBuffer: Buffer.alloc((yStride * height) / 4),
      yStride,
      width: 0,
      height,
      videoSourceType,
    };
  }

  engineFilterEvent = (_eventName: string, params: Array<any>): Boolean => {
    switch (_eventName) {
      case NativeEngineEvents.onJoinChannelSuccess:
        {
          const [channel] = params;
          this._info.currentChannel = channel;
          this.fire(EngineEvents.JOINED_CHANNEL, ...params);
          this.fire(EngineEvents.JOINEDCHANNEL, ...params);
        }
        return true;
      case NativeEngineEvents.onLeaveChannel:
        {
          this._info.currentChannel = undefined;
          this.fire(EngineEvents.LEAVE_CHANNEL, ...params);
          this.fire(EngineEvents.LEAVECHANNEL, ...params);
        }
        return true;

      case NativeEngineEvents.onUserOffline:
        {
          this.fire(EngineEvents.USER_OFFLINE, ...params);

          if (!this._info.currentChannel) {
            return true;
          }
          const [uid] = params;
          this._rendererManager?.removeRenderer(
            String(uid),
            this._info.currentChannel
          );
          this.fire(EngineEvents.REMOVE_STREAM, ...params);
        }
        return true;

      case NativeEngineEvents.onVideoSourceFrameSizeChangedIris:
        {
          const [uid, channelId, sourceType, width, height] = params;

          this.fire(EngineEvents.FIRST_REMOTE_VIDEO_FRAME, ...params);
          let user;
          let newUid;
          if (sourceType === IrisVideoSourceType.kVideoSourceTypeRemote) {
            user = uid;
            newUid = uid;
          } else {
            user = "local";
            newUid = 0;
          }

          logWarn(
            `onVideoSourceFrameSizeChangedIris uid: ${newUid}, channelId ${channelId}`
          );
          let videoFrameItem = this.resizeBuffer(
            newUid,
            channelId,
            width,
            height,
            sourceType
          );

          this._rendererManager?.addVideoFrameCacheToMap(
            user,
            channelId,
            videoFrameItem
          );
        }
        return true;
      default:
        return false;
    }
  };

  engineFilterEventWithBuffer = (
    _eventName: string,
    _eventData: Array<any>,
    _eventBuffer?: string
  ): Boolean => {
    switch (_eventName) {
      case "onStreamMessage":
        {
          const [uid, streamId, length] = _eventData;
          this.fire(EngineEvents.STREAM_MESSAGE, uid, streamId, _eventBuffer);
        }
        return true;

      case "onReadyToSendMetadata":
        {
          const eventData: Array<Metadata> = _eventData;
          const [metadata] = eventData;
          metadata.buffer = _eventBuffer!;
          this.fire(EngineEvents.READY_TO_SEND_METADATA, metadata);
        }
        return true;
      case "onMetadataReceived":
        {
          const eventData: Array<Metadata> = _eventData;
          const [metadata] = eventData;
          metadata.buffer = _eventBuffer!;
          this.fire(EngineEvents.METADATA_RECEIVED, metadata);
        }
        return true;
      default:
        return false;
    }
  };

  videoSourceFilterEvent = (
    _eventName: string,
    params: Array<any>
  ): Boolean => {
    switch (_eventName) {
      case NativeVideoSourceEvents.onVideoSourceFrameSizeChangedIris:
        {
          const [uid, channelId, sourceType, width, height] = params;
          this.fire(
            VideoSourceEvents.VIDEO_SOURCE_FIRST_LOCAL_VIDEO_FRAME,
            ...params
          );
          logError(`videoSourceFirstLocalVideoFrame ${width} ${height}`);
          let videoFrameItem = this.resizeBuffer(
            0,
            "",
            width,
            height,
            sourceType
          );
          this._rendererManager?.addVideoFrameCacheToMap(
            "videoSource",
            "",
            videoFrameItem
          );
        }
        return true;

      default:
        return false;
    }
  };

  videoSourceFilterEventWithBuffer = (
    _eventName: string,
    _eventData: Array<any>,
    _eventBuffer?: string
  ) => false;

  setView(rendererConfig: RendererConfig): void {
    let defaultConfig: RendererConfig = Object.assign(
      this._rendererManager?.getDefaultRenderConfig(),
      rendererConfig
    );

    logWarn(`setView: ${rendererConfig}`);
    if (rendererConfig.view) {
      this._rendererManager?.setRenderer(defaultConfig);
    } else {
      logWarn("Note: setView view is null!");
      this._rendererManager?.removeRenderer(
        defaultConfig.user,
        defaultConfig.channelId
      );
    }
  }

  /**
   * Destroys the renderer.
   * @param key Key for the map that store the renderers,
   * e.g, `uid` or `videosource` or `local`.
   * @param onFailure The error callback for the {@link destroyRenderer}
   * method.
   */
  destroyRenderer(
    user: User,
    channelId?: Channel,
    onFailure?: (err: Error) => void
  ) {
    this._rendererManager?.removeRenderer(user, channelId ? channelId : "");
  }

  // ===========================================================================
  // BASIC METHODS
  // ===========================================================================

  /**
   * Initializes the Agora service.
   *
   * @param appid The App ID issued to you by Agora.
   * See [How to get the App ID](https://docs.agora.io/en/Agora%20Platform/token#get-an-app-id).
   * Only users in apps with the same App ID can join the same channel and
   * communicate with each other. Use an App ID to create only
   * one `AgoraRtcEngine` . To change your App ID, call `release` to destroy
   * the current `AgoraRtcEngine`e and then call `initialize` to create
   * `AgoraRtcEngine` with the new App ID.
   * @param areaCode The region for connection. This advanced feature applies
   * to scenarios that have regional restrictions. For the regions that Agora
   * supports, see {@link AREA_CODE}. After specifying the region, the SDK
   * connects to the Agora servers within that region. Note: The SDK supports
   * specify only one region.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  initialize(
    appId: string,
    areaCode?: AREA_CODE,
    logConfig?: LogConfig
  ): number {
    deprecate("initialize", "initializeWithContext");
    let context: RtcEngineContext = {
      appId: appId,
      areaCode: areaCode,
      logConfig: logConfig,
    };
    return this.initializeWithContext(context);
  }

  initializeWithContext(context: RtcEngineContext): number {
    let param = {
      context,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineInitialize,
      JSON.stringify(param)
    );

    this._rendererManager?.startRenderer();
    return ret.retCode;
  }

  /**
   * Creates and gets an `AgoraRtcChannel` object.
   *
   * To join more than one channel, call this method multiple times to create
   * as many `AgoraRtcChannel` objects as needed, and call the
   * {@link AgoraRtcChannel.joinChannel joinChannel} method of each created
   * `AgoraRtcChannel` object.
   *
   * After joining multiple channels, you can simultaneously subscribe to
   * streams of all the channels, but publish a stream in only one channel
   * at one time.
   * @param channelName The unique channel name for an Agora RTC session.
   * It must be in the string format and not exceed 64 bytes in length.
   * Supported character scopes are:
   * - All lowercase English letters: a to z.
   * - All uppercase English letters: A to Z.
   * - All numeric characters: 0 to 9.
   * - The space character.
   * - Punctuation characters and other symbols, including: "!", "#", "$",
   * "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@",
   * "[", "]", "^", "_", " {", "}", "|", "~", ",".
   *
   * @note
   * - This parameter does not have a default value. You must set it.
   * - Do not set it as the empty string "". Otherwise, the SDK returns
   * `ERR_REFUSED (5)`.
   *
   * @return
   * - If the method call succeeds, returns the `AgoraRtcChannel` object.
   * - If the method call fails, returns empty or `ERR_REFUSED (5)`.
   */
  createChannel(channelId: string): AgoraRtcChannel | null {
    let _rtcChannel = this._rtcEngine.CreateChannel(
      PROCESS_TYPE.MAIN,
      channelId
    );
    return new AgoraRtcChannel(channelId, _rtcChannel, this);
  }

  /**
   * Returns the version and the build information of the current SDK.
   * @return The version of the current SDK.
   */
  getVersion(): string {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineGetVersion,
      ""
    );
    return ret.retCode === 0 ? ret.result : ret.retCode.toString();
  }

  /**
   * Retrieves the error description.
   * @param {number} code The error code.
   * @return The error description.
   */
  getErrorDescription(code: number): string {
    let param = {
      code,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineGetErrorDescription,
      JSON.stringify(param)
    );
    return ret.retCode === 0 ? ret.result : ret.retCode.toString();
  }

  /**
   * Gets the connection state of the SDK.
   * @return {ConnectionState} Connect states. See {@link ConnectionState}.
   */
  getConnectionState(): CONNECTION_STATE_TYPE {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineGetConnectionState,
      ""
    );
    return ret.retCode;
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
   * the communication(`0`) profile,
   * or is a host in the `1` (live streaming) profile.
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
    channelId: string,
    info: string,
    uid: number,
    options?: ChannelMediaOptions
  ): number {
    let param = {
      token,
      channelId,
      info,
      uid,
      options,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineJoinChannel,
      JSON.stringify(param)
    );
    return ret.retCode;
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
   * is in the Communication channel, or is a host in the `1` (live streaming)
   * profile.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  leaveChannel(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineLeaveChannel,
      ""
    );
    return ret.retCode;
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
  release(sync = false): number {
    this._rendererManager?.clear();
    this._rendererManager = undefined;
    let param = {
      sync,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineRelease,
      JSON.stringify(param)
    );
    this._rtcDeviceManager.Release();
    this._rtcEngine.Release();
    logInfo(`AgoraRtcEngine release done`);
    return ret.retCode;
  }

  /**
   * @deprecated This method is deprecated. Agora does not recommend using
   * this method. Use {@link setAudioProfile} instead.
   * Sets the high-quality audio preferences.
   *
   * Call this method and set all parameters before joining a channel.
   * @param {boolean} fullband Sets whether to enable/disable full-band
   * codec (48-kHz sample rate).
   * - true: Enable full-band codec.
   * - false: Disable full-band codec.
   * @param {boolean} stereo Sets whether to enable/disable stereo codec.
   * - true: Enable stereo codec.
   * - false: Disable stereo codec.
   * @param {boolean} fullBitrate Sets whether to enable/disable high-bitrate
   * mode.
   * - true: Enable high-bitrate mode.
   * - false: Disable high-bitrate mode.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setHighQualityAudioParameters(
    fullband: boolean,
    stereo: boolean,
    fullBitrate: boolean
  ): number {
    let param = {
      fullband,
      stereo,
      fullBitrate,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetHighQualityAudioParameters,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  setupRemoteVideo(
    uid: number,
    view?: Element,
    channel?: string,
    rendererOptions: RendererOptions = {
      append: false,
      contentMode: CONTENT_MODE.FIT,
      mirror: false,
    }
  ): number {
    deprecate("setupRemoteVideo", "setView");
    if (view) {
      //bind
      let config: RendererConfig = {
        user: uid,
        view,
        channelId: channel,
        rendererOptions,
      };
      this.setView(config);
      return 0;
    } else {
      //unbind
      this._rendererManager?.removeRenderer(uid, channel ? channel : "");
      return 0;
    }
  }

  /**
   * Sets the local video view and the corresponding renderer.
   * @param {Element} view The Dom element where you initialize your view.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setupLocalVideo(
    view: Element,
    rendererOptions: RendererOptions = {
      append: false,
      contentMode: CONTENT_MODE.FIT,
      mirror: false,
    }
  ): number {
    deprecate("setupLocalVideo", "setView");
    let rendererConfig: RendererConfig = {
      user: "local",
      view,
      rendererOptions,
      channelId: "",
    };
    this.setView(rendererConfig);
    return 0;
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
   * @param {*} uid The user ID of the targeted user.
   * @param {*} width The target width.
   * @param {*} height The target height.
   */
  setVideoRenderDimension(
    user: User,
    width: number,
    height: number,
    channelId: string = ""
  ) {
    this._rendererManager?.stopRenderer();

    let videoFrameCacheConfig = {
      user,
      width,
      height,
      channelId,
    };
    this._rendererManager?.enableVideoFrameCache(videoFrameCacheConfig);
    this._rendererManager?.startRenderer();
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
   *
   */
  setVideoRenderFPS(fps: number) {
    if (this._rendererManager) {
      this._rendererManager._config.videoFps = fps;
      this._rendererManager.restartRenderer();
    }
  }

  /**
   * Sets the view content mode.
   * @param {number | 'local' | 'videosource'} uid The user ID for operating
   * streams. When setting up the view content of the remote user's stream,
   * make sure you have subscribed to that stream by calling the
   * {@link subscribe} method.
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
  setupViewContentMode(
    user: User,
    channelId: Channel = "",
    mode: CONTENT_MODE = CONTENT_MODE.FIT,
    mirror: boolean = false
  ): number {
    let renderList = this._rendererManager?.getRenderer(user, channelId);
    renderList
      ? renderList.forEach((renderItem) =>
          renderItem.setContentMode(mode, mirror)
        )
      : console.warn(
          `User: ${user} have no render view, you need to call this api after setView`
        );
    return 0;
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
  renewToken(token: string): number {
    let param = {
      token,
    };
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineRenewToken,
      JSON.stringify(param)
    );
    return ret.retCode;
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
   * @param {CHANNEL_PROFILE_TYPE} profile The channel profile:
   * - 0: for communication
   * - 1: for live streaming
   * - 2: for in-game
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setChannelProfile(profile: CHANNEL_PROFILE_TYPE): number {
    let param = {
      profile,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetChannelProfile,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Sets the role of a user (live streaming only).
   *
   * This method sets the role of a user, such as a host or an audience
   * (default), before joining a channel.
   *
   * This method can be used to switch the user role after a user joins a
   * channel. In the `1` (live streaming)profile,
   * when a user switches user roles after joining a channel, a successful
   * {@link setClientRole} method call triggers the following callbacks:
   * - The local client: clientRoleChanged
   * - The remote client: userJoined
   *
   * @param {ClientRoleType} role The client role:
   *
   * - 1: The host
   * - 2: The audience
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setClientRole(role: CLIENT_ROLE_TYPE): number {
    let param = {
      role,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetClientRole,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /** Sets the role of a user in interactive live streaming.
   *
   * @since v3.2.0
   *
   * You can call this method either before or after joining the channel to
   * set the user role as audience or host. If
   * you call this method to switch the user role after joining the channel,
   * the SDK triggers the following callbacks:
   * - The local client: `clientRoleChanged`.
   * - The remote client: `userJoined` or `userOffline`.
   *
   * @note
   * - This method applies to the `LIVE_BROADCASTING` profile only.
   * - The difference between this method and {@link setClientRole} is that
   * this method can set the user level in addition to the user role.
   *  - The user role determines the permissions that the SDK grants to a
   * user, such as permission to send local
   * streams, receive remote streams, and push streams to a CDN address.
   *  - The user level determines the level of services that a user can
   * enjoy within the permissions of the user's
   * role. For example, an audience can choose to receive remote streams with
   * low latency or ultra low latency. Levels
   * affect prices.
   *
   * @param role The role of a user in interactive live streaming.
   * @param options The detailed options of a user, including user level.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setClientRoleWithOptions(
    role: CLIENT_ROLE_TYPE,
    options: ClientRoleOptions
  ): number {
    let param = {
      role,
      options,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetClientRole,
      JSON.stringify(param)
    );
    return ret.retCode;
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
   * - In the `1` (live streaming) profile, only hosts can call this method.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  startEchoTest(intervalInSeconds?: number): number {
    let jsonString = "";
    if (intervalInSeconds !== undefined) {
      jsonString = JSON.stringify({ intervalInSeconds });
    }

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineStartEchoTest,
      jsonString
    );
    return ret.retCode;
  }

  /**
   * Stops the audio call test.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  stopEchoTest(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineStopEchoTest,
      ""
    );
    return ret.retCode;
  }

  /**
   * Starts an audio call test.
   *
   * This method starts an audio call test to determine whether the audio
   * devices
   * (for example, headset and speaker) and the network connection are working
   * properly.
   *
   * In the audio call test, you record your voice. If the recording plays back
   * within the set time interval,
   * the audio devices and the network connection are working properly.
   *
   * **Note**:
   * - Call this method before the {@link joinChannel} method.
   * - After calling this method, call the {@link stopEchoTest} method to end
   * the test. Otherwise, the app cannot run the next echo test,
   * nor can it call the {@link joinChannel} method to start a new call.
   * - In the `1` (live streaming) profile, only hosts can call this method.
   * @param interval The time interval (s) between when you speak and when the
   * recording plays back.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  startEchoTestWithInterval(intervalInSeconds: number): number {
    deprecate("startEchoTestWithInterval", "startEchoTest");
    let param = {
      intervalInSeconds,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineStartEchoTest,
      JSON.stringify(param)
    );
    return ret.retCode;
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
   * audience in the CDN live streaming channel to see and capture, you can
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
  addVideoWatermark(watermarkUrl: string, options: WatermarkOptions): number {
    let param = {
      watermarkUrl,
      options,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineAddVideoWaterMark,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Removes the watermark image from the video stream added by the
   * {@link addVideoWatermark} method.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  clearVideoWatermarks(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineClearVideoWaterMarks,
      ""
    );
    return ret.retCode;
  }

  /**
   * Enables the network connection quality test.
   *
   * This method tests the quality of the users' network connections and is
   * disabled by default.
   *
   * Before users join a channel or before an audience switches to a host,
   * call this method to check the uplink network quality.
   *
   * This method consumes additional network traffic, which may affect the
   * communication quality.
   *
   * Call the {@link disableLastmileTest} method to disable this test after
   * receiving the lastMileQuality callback, and before the user joins
   * a channel or switches the user role.
   * @note
   * - Do not call any other methods before receiving the
   * lastMileQuality callback. Otherwise,
   * the callback may be interrupted by other methods, and hence may not be
   * triggered.
   * - A host should not call this method after joining a channel
   * (when in a call).
   * - If you call this method to test the last-mile quality, the SDK consumes
   * the bandwidth of a video stream, whose bitrate corresponds to the bitrate
   * you set in the {@link setVideoEncoderConfiguration} method. After you
   * join the channel, whether you have called the {@link disableLastmileTest}
   * method or not, the SDK automatically stops consuming the bandwidth.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  enableLastmileTest(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineEnableLastMileTest,
      ""
    );
    return ret.retCode;
  }

  /**
   * This method disables the network connection quality test.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  disableLastmileTest(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineDisableLastMileTest,
      ""
    );
    return ret.retCode;
  }

  /**
   * Starts the last-mile network probe test before
   * joining a channel to get the uplink and downlink last-mile network
   * statistics,
   * including the bandwidth, packet loss, jitter, and average round-trip
   * time (RTT).
   *
   * Once this method is enabled, the SDK returns the following callbacks:
   * - `lastMileQuality`: the SDK triggers this callback within two
   * seconds depending on the network conditions.
   * This callback rates the network conditions with a score and is more
   * closely linked to the user experience.
   * - `lastmileProbeResult`: the SDK triggers this callback within
   * 30 seconds depending on the network conditions.
   * This callback returns the real-time statistics of the network conditions
   * and is more objective.
   *
   * Call this method to check the uplink network quality before users join
   * a channel or before an audience switches to a host.
   *
   * @note
   * - This method consumes extra network traffic and may affect communication
   * quality. We do not recommend calling this method together with
   * {@link enableLastmileTest}.
   * - Do not call other methods before receiving the lastMileQuality and
   * lastmileProbeResult callbacks. Otherwise, the callbacks may be interrupted
   * by other methods.
   * - In the `1` (live streaming) profile, a host should not call this method after
   * joining a channel.
   *
   * @param {LastmileProbeConfig} config The configurations of the last-mile
   * network probe test. See {@link LastmileProbeConfig}.
   */
  startLastmileProbeTest(config: LastmileProbeConfig): number {
    let param = {
      config,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineStartLastMileProbeTest,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Stops the last-mile network probe test.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  stopLastmileProbeTest(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineStopLastMileProbeTest,
      ""
    );
    return ret.retCode;
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
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineEnableVideo,
      ""
    );
    return ret.retCode;
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
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineDisableVideo,
      ""
    );
    return ret.retCode;
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
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineStartPreview,
      ""
    );
    return ret.retCode;
  }

  /**
   * Stops the local video preview and closes the video.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  stopPreview(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineStopPreview,
      ""
    );
    return ret.retCode;
  }

  /**
   * @deprecated This method is deprecated. Use
   * {@link setVideoEncoderConfiguration} instead.
   *
   * Sets the video profile.
   *
   * @param {VIDEO_PROFILE_TYPE} profile The video profile. See
   * {@link VIDEO_PROFILE_TYPE}.
   * @param {boolean} [swapWidthAndHeight = false] Whether to swap width and
   * height:
   * - true: Swap the width and height.
   * - false: Do not swap the width and height.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setVideoProfile(
    profile: VIDEO_PROFILE_TYPE,
    swapWidthAndHeight: boolean = false
  ): number {
    let param = {
      profile,
      swapWidthAndHeight,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetVideoProfile,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Sets the camera capturer configuration.
   *
   * For a video call or live streaming, generally the SDK controls the camera
   * output parameters.
   * When the default camera capture settings do not meet special requirements
   * or cause performance problems, we recommend using this method to set the
   * camera capture preference:
   * - If the resolution or frame rate of the captured raw video data are
   * higher than those set by {@link setVideoEncoderConfiguration},
   * processing video frames requires extra CPU and RAM usage and degrades
   * performance. We recommend setting config as
   * CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE(1) to avoid such problems.
   * - If you do not need local video preview or are willing to sacrifice
   * preview quality,
   * we recommend setting config as CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE(1)
   * to optimize CPU and RAM usage.
   * - If you want better quality for the local video preview, we recommend
   * setting config as CAPTURER_OUTPUT_PREFERENCE_PREVIEW(2).
   * **Note**: Call this method before enabling the local camera. That said,
   * you can call this method before calling {@link joinChannel},
   * {@link enableVideo}, or {@link enableLocalVideo},
   * depending on which method you use to turn on your local camera.
   * @param {CameraCapturerConfiguration} config The camera capturer
   * configuration. See {@link CameraCapturerConfiguration}.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setCameraCapturerConfiguration(config: CameraCapturerConfiguration): number {
    let param = {
      config,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetCameraCapturerConfiguration,
      JSON.stringify(param)
    );
    return ret.retCode;
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
   * @param {VideoEncoderConfiguration} config The local video encoder
   * configuration. See {@link VideoEncoderConfiguration}.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setVideoEncoderConfiguration(config: VideoEncoderConfiguration): number {
    const param = {
      config: Object.assign(
        {
          dimensions: { width: 640, height: 360 },
          frameRate: 15,
          minFrameRate: -1,
          bitrate: 0,
          minBitrate: -1,
          orientationMode: 0,
          degradationPreference: 0,
          mirrorMode: 0,
        },
        config
      ),
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetVideoEncoderConfiguration,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Enables/Disables image enhancement and sets the options.
   *
   * @since v3.0.0 for Windows
   * @since v3.2.0 for macOS
   *
   * @note Call this method after calling the {@link enableVideo} method.
   *
   * @param {boolean} enable Sets whether or not to enable image enhancement:
   * - true: Enables image enhancement.
   * - false: Disables image enhancement.
   * @param {Object} options The image enhancement options. It contains the
   * following parameters:
   * @param {number} options.lighteningContrastLevel The contrast
   * level:
   * - `0`: Low contrast level.
   * - `1`: (Default) Normal contrast level.
   * - `2`: High contrast level.
   * @param {number} options.lighteningLevel The brightness level. The value
   * ranges from 0.0 (original) to 1.0.
   * @param {number} options.smoothnessLevel The sharpness level. The value
   * ranges between 0 (original) and 1. This parameter is usually used to
   * remove blemishes.
   * @param {number} options.rednessLevel The redness level. The value ranges
   * between 0 (original) and 1. This parameter adjusts the red saturation
   * level.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setBeautyEffectOptions(enabled: boolean, options: BeautyOptions): number {
    let param = {
      enabled,
      options,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetBeautyEffectOptions,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  setRemoteUserPriority(uid: number, userPriority: PRIORITY_TYPE) {
    let param = {
      uid,
      userPriority,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetRemoteUserPriority,
      JSON.stringify(param)
    );
    return ret.retCode;
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
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineEnableAudio,
      ""
    );
    return ret.retCode;
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
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineDisableAudio,
      ""
    );
    return ret.retCode;
  }

  /**
   * Sets audio parameters and application scenarios.
   *
   * **Note**:
   * - This method must be called before the {@link joinChannel} method.
   * - In the communication(`0`) and `1` (live streaming) profiles, the bitrate
   * may be different from your settings due to network self-adaptation.
   * - In scenarios requiring high-quality audio, for example, a music
   * teaching scenario, we recommend setting profile
   * as `4` and  scenario as `3`.
   *
   * @param {number} profile Sets the sample rate, bitrate, encoding mode,
   * and the number of channels.
   * - 0: Default audio profile.
   *   - For the `1` (live streaming) profile: A sample rate of 48 KHz, music
   * encoding, mono, and a bitrate of up to 64 Kbps.
   *   - For the communication(`0`) profile:
   *      - macOS: A sample rate of 32 KHz, music encoding, mono, and a
   * bitrate of up to 18 Kbps.
   *      - Windows: A sample rate of 16 KHz, music encoding, mono, and a
   * bitrate of up to 16 Kbps.
   * - 1: Speech standard. A sample rate of 32 kHz, audio encoding, mono, and
   * a bitrate of up to 18 Kbps.
   * - 2: Music standard. A sample rate of 48 kHz, music encoding, mono, and
   * a bitrate of up to 48 Kbps.
   * - 3: Music standard stereo. A sample rate of 48 kHz, music encoding,
   * stereo, and a bitrate of up to 56 Kbps.
   * - 4: Music high quality. A sample rate of 48 kHz, music encoding, mono,
   * and a bitrate of up to 128 Kbps.
   * - 5: Music high quality stereo. A sample rate of 48 kHz, music encoding,
   * stereo, and a bitrate of up to 192 Kbps.
   * - 6: IOT.
   * @param {number} scenario Sets the audio application scenario.
   * - 0: (Default) Standard audio scenario.
   * - 1: Entertainment scenario where users need to frequently switch the
   * user role.
   * - 2: Education scenario where users want smoothness and stability.
   * - 3: High-quality audio chatroom scenario where hosts mainly play music.
   * - 4: Showroom scenario where a single host wants high-quality audio.
   * - 5: Gaming scenario for group chat that only contains the human voice.
   * - 8: Meeting scenario that mainly contains the human voice.
   *
   * Under different audio scenarios, the device uses different volume types.
   * For details, see
   * [What is the difference between the in-call volume and the media volume?](https://docs.agora.io/en/faq/system_volume).
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setAudioProfile(
    profile: AUDIO_PROFILE_TYPE,
    scenario: AUDIO_SCENARIO_TYPE
  ): number {
    let param = {
      profile,
      scenario,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetAudioProfile,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * @deprecated This method is deprecated. Use
   * {@link setCameraCapturerConfiguration} and
   * {@link setVideoEncoderConfiguration} instead.
   * Sets the preference option for the video quality (live streaming only).
   * @param {boolean} preferFrameRateOverImageQuality Sets the video quality
   * preference:
   * - true: Frame rate over image quality.
   * - false: (Default) Image quality over frame rate.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setVideoQualityParameters(preferFrameRateOverImageQuality = false): number {
    let param = {
      preferFrameRateOverImageQuality,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetVideoQualityParameters,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * @deprecated This method is deprecated from v3.2.0. Use the
   * {@link enableEncryption} method instead.
   *
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
    let param = {
      secret,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetEncryptionSecret,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Sets the built-in encryption mode.
   *
   * @depercated This method is deprecated from v3.2.0. Use
   * the {@link enableEncryption} method instead.
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
  setEncryptionMode(encryptionMode: string): number {
    let param = {
      encryptionMode,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetEncryptionMode,
      JSON.stringify(param)
    );
    return ret.retCode;
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
    let param = {
      mute,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineMuteLocalAudioStream,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  muteAllRemoteAudioStreams(mute = false): number {
    let param = {
      mute,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineMuteAllRemoteAudioStreams,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Sets whether to receive all remote audio streams by default.
   *
   * You can call this method either before or after joining a channel. If you
   * call `setDefaultMuteAllRemoteAudioStreams(true)` after joining a channel,
   * you will not receive the audio streams of any subsequent user.
   *
   * @note If you want to resume receiving the audio stream, call
   * {@link muteRemoteAudioStream}(false), and specify the ID of the remote
   * user whose audio stream you want to receive. To resume receiving
   * the audio streams
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
  setDefaultMuteAllRemoteAudioStreams(mute = false): number {
    let param = {
      mute,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetDefaultMuteAllRemoteAudioStreams,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  muteRemoteAudioStream(userId: number, mute = false): number {
    let param = {
      userId,
      mute,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineMuteRemoteAudioStream,
      JSON.stringify(param)
    );
    return ret.retCode;
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
    let param = {
      mute,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineMuteLocalVideoStream,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  enableLocalVideo(enabled = true): number {
    let param = {
      enabled,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineEnableLocalVideo,
      JSON.stringify(param)
    );
    return ret.retCode;
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
   * @note This method is different from the {@link muteLocalAudioStream}
   * method:
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
  enableLocalAudio(enabled = true): number {
    let param = {
      enabled,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineEnableLocalAudio,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  muteAllRemoteVideoStreams(mute = false): number {
    let param = {
      mute,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineMuteAllRemoteVideoStreams,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Sets whether to receive all remote video streams by default.
   *
   * You can call this method either before or after joining a channel. If you
   * call `setDefaultMuteAllRemoteVideoStreams(true)` after joining a channel,
   * you will not receive the video stream of any subsequent user.
   *
   * @note If you want to resume receiving the video stream, call
   * {@link muteRemoteVideoStream}(false), and specify the ID of the remote
   * user whose audio stream you want to receive. To resume receiving
   * the audio streams
   * of multiple remote users, call {@link muteRemoteVideoStream}(false) as
   * many times. Calling `setDefaultMuteAllRemoteVideoStreams(false)` resumes
   * receiving the audio streams of subsequent users only.
   *
   * @param {boolean} mute Sets whether to receive/stop receiving all remote
   * video streams by default:
   * - true: Stop receiving all remote video streams by default.
   * - false: (Default) Receive all remote video streams by default.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setDefaultMuteAllRemoteVideoStreams(mute = false): number {
    let param = {
      mute,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetDefaultMuteAllRemoteVideoStreams,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  enableAudioVolumeIndication(
    interval: number,
    smooth: number,
    report_vad: boolean = false
  ): number {
    let param = {
      interval,
      smooth,
      report_vad,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineEnableAudioVolumeIndication,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  muteRemoteVideoStream(userId: number, mute = false): number {
    let param = {
      userId,
      mute,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineMuteRemoteVideoStream,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  setLogFile(filePath: string): number {
    let param = {
      filePath,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetLogFile,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /** Sets the size of a log file that the SDK outputs.
   *
   *
   * @note If you want to set the log file size, ensure that you call
   * this method before {@link setLogFile}, or the logs are cleared.
   *
   * By default, the SDK outputs five log files, `agorasdk.log`,
   * `agorasdk_1.log`, `agorasdk_2.log`, `agorasdk_3.log`, `agorasdk_4.log`,
   * each with a default size of 1024 KB.
   * These log files are encoded in UTF-8. The SDK writes the latest logs in
   * `agorasdk.log`. When `agorasdk.log` is full, the SDK deletes the log
   * file with the earliest
   * modification time among the other four, renames `agorasdk.log` to the
   * name of the deleted log file, and create a new `agorasdk.log` to record
   * latest logs.
   *
   * Related APIs:
   * - {@link setLogFile}
   * - {@link setLogFilter}
   *
   * @param size The size (KB) of a log file. The default value is 1024 KB.
   * If you set `size` to 1024 KB,
   * the SDK outputs at most 5 MB log files; if you set it to less than
   * 1024 KB, the maximum size of a log file is still 1024 KB.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setLogFileSize(fileSizeInKBytes: number): number {
    let param = {
      fileSizeInKBytes,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetLogFileSize,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  setLogFilter(filter: LOG_FILTER_TYPE): number {
    let param = {
      filter,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetLogFilter,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  enableDualStreamMode(enabled: boolean): number {
    let param = {
      enabled,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineEnableDualStreamMode,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Sets the stream type of the remote video.
   *
   * Under limited network conditions, if the publisher has not disabled the
   * dual-stream mode using {@link enableDualStreamMode}(`false`), the receiver
   * can choose to receive either the high-video stream (the high resolution,
   * and high bitrate video stream) or the low-video stream (the low
   * resolution, and low bitrate video stream).
   *
   * By default, users receive the high-video stream. Call this method if you
   * want to switch to the low-video stream. This method allows the app to
   * adjust the corresponding video stream type based on the size of the video
   * window to reduce the bandwidth and resources.
   *
   * The aspect ratio of the low-video stream is the same as the high-video
   * stream. Once the resolution of the high-video stream is set, the system
   * automatically sets the resolution, frame rate, and bitrate of the
   * low-video stream.
   * The SDK reports the result of calling this method in the
   * `apiCallExecuted` callback.
   * @param {number} uid ID of the remote user sending the video stream.
   * @param {StreamType} streamType Sets the video stream type:
   * - 0: High-stream video, the high-resolution, high-bitrate video.
   * - 1: Low-stream video, the low-resolution, low-bitrate video.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setRemoteVideoStreamType(
    userId: number,
    streamType: REMOTE_VIDEO_STREAM_TYPE
  ): number {
    let param = {
      userId,
      streamType,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetRemoteVideoStreamType,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  setRemoteDefaultVideoStreamType(
    streamType: REMOTE_VIDEO_STREAM_TYPE
  ): number {
    let param = {
      streamType,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetRemoteDefaultVideoStreamType,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * @deprecated This method is deprecated. As of v3.0.0, the Electron SDK
   * automatically enables interoperability with the Web SDK, so you no longer
   * need to call this method.
   *
   * Enables interoperability with the Agora Web SDK (live streaming only).
   *
   * Use this method when the channel profile is `1` (live streaming).
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
  enableWebSdkInteroperability(enabled = false): number {
    let param = {
      enabled,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineEnableWebSdkInteroperability,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Sets the local video mirror mode.
   *
   * Use this method before {@link startPreview}, or it does not take effect
   * until you re-enable startPreview.
   *
   * @param {number} mirrorMode Sets the local video mirror mode:
   * - 0: (Default) The SDK enables the mirror mode.
   * - 1: Enable the mirror mode
   * - 2: Disable the mirror mode
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setLocalVideoMirrorMode(mirrorMode: VIDEO_MIRROR_MODE_TYPE): number {
    let param = {
      mirrorMode,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetLocalVideoMirrorMode,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  setLocalVoicePitch(pitch = 1.0): number {
    let param = {
      pitch,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetLocalVoicePitch,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  setLocalVoiceEqualization(
    bandFrequency: AUDIO_EQUALIZATION_BAND_FREQUENCY,
    bandGain: number
  ): number {
    let param = {
      bandFrequency,
      bandGain,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetLocalVoiceEqualization,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  setLocalVoiceReverb(reverbKey: AUDIO_REVERB_TYPE, value: number): number {
    let param = {
      reverbKey,
      value,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetLocalVoiceReverb,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * @deprecated This method is deprecated from v3.2.0
   * Use the {@link setAudioEffectPreset} or {@link setVoiceBeautifierPreset}
   * method instead.
   *
   * Sets the local voice changer option.
   * @param {VoiceChangerPreset} preset The local voice changer option.
   * See {@link VoiceChangerPreset}.
   */
  setLocalVoiceChanger(
    voiceChanger = VOICE_CHANGER_PRESET.VOICE_CHANGER_OFF
  ): number {
    let param = {
      voiceChanger,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetLocalVoiceChanger,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * @deprecated This method is deprecated from v3.2.0.
   * Use the {@link setAudioEffectPreset} or {@link setVoiceBeautifierPreset}
   * method instead.
   *
   * Sets the preset local voice reverberation effect.
   *
   * **Note**:
   * - Do not use this method together with {@link setLocalVoiceReverb}.
   * - Do not use this method together with {@link setLocalVoiceChanger},
   * or the method called eariler does not take effect.
   * @param {AudioReverbPreset} preset The local voice reverberation preset.
   * See {@link AudioReverbPreset}.
   */
  setLocalVoiceReverbPreset(
    reverbPreset = AUDIO_REVERB_PRESET.AUDIO_REVERB_OFF
  ) {
    let param = {
      reverbPreset,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetLocalVoiceReverbPreset,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Sets the fallback option for the locally published video stream based on
   * the network conditions.
   *
   * The default setting for option is `STREAM_FALLBACK_OPTION_AUDIO_ONLY (2)`,
   * where
   * there is no fallback for the locally published video stream when the
   * uplink network conditions are poor.
   * If `option` is set to `STREAM_FALLBACK_OPTION_AUDIO_ONLY (2)`, the SDK
   * will:
   * - Disable the upstream video but enable audio only when the network
   * conditions worsen and cannot support both video and audio.
   * - Re-enable the video when the network conditions improve.
   * When the locally published stream falls back to audio only or when the
   * audio stream switches back to the video,
   * the `localPublishFallbackToAudioOnly` callback is triggered.
   *
   * @note
   * Agora does not recommend using this method for CDN live streaming, because
   * the CDN audience will have a noticeable lag when the locally
   * publish stream falls back to audio-only.
   *
   * @param {number} option Sets the fallback option for the locally published
   * video stream.
   * - `STREAM_FALLBACK_OPTION_DISABLED (0)`: (Default) No fallback behavior
   * for the local/remote video stream when the uplink/downlink network
   * conditions are poor. The quality of the stream is not guaranteed.
   * - `STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW (1)`: (Default) The remote
   * video stream falls back to the low-stream video when the downlink network
   * condition worsens. This option works not for the
   * {@link setLocalPublishFallbackOption} method.
   * - `STREAM_FALLBACK_OPTION_AUDIO_ONLY (2)`: Under poor uplink network
   * conditions, the locally published video stream falls back to audio only.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setLocalPublishFallbackOption(
    option = STREAM_FALLBACK_OPTIONS.STREAM_FALLBACK_OPTION_DISABLED
  ): number {
    let param = {
      option,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetLocalPublishFallbackOption,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Sets the fallback option for the remote video stream based
   * on the network conditions.
   *
   * If `option` is set as `STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW (1)` or
   * `STREAM_FALLBACK_OPTION_AUDIO_ONLY (2)`:
   * - the SDK automatically switches the video from a high-stream to a
   * low-stream, or disables the video when the downlink network condition
   * cannot support both audio and video
   * to guarantee the quality of the audio.
   * - The SDK monitors the network quality and restores the video stream when
   * the network conditions improve.
   *
   * When the remote video stream falls back to audio only or when
   * the audio-only stream switches back to the video stream,
   * the SDK triggers the `remoteSubscribeFallbackToAudioOnly` callback.
   *
   * @param {number} option Sets the fallback option for the remote stream.
   * - `STREAM_FALLBACK_OPTION_DISABLED (0)`: No fallback behavior for the
   * local/remote video stream when the uplink/downlink network conditions
   * are poor. The quality of the stream is not guaranteed.
   * - `STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW (1)`: (Default) The remote
   * video stream falls back to the low-stream video when the downlink network
   * condition worsens. This option works only
   * for this method and not for the {@link setLocalPublishFallbackOption}
   * method.
   * - `STREAM_FALLBACK_OPTION_AUDIO_ONLY (2)`: Under poor downlink network
   * conditions, the remote video stream first falls back to the
   * low-stream video; and then to an audio-only stream if the network
   * condition worsens.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setRemoteSubscribeFallbackOption(
    option: STREAM_FALLBACK_OPTIONS.STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW
  ): number {
    let param = {
      option,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetRemoteSubscribeFallbackOption,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Registers a user account.
   * Once registered, the user account can be used to identify the local user
   * when the user joins the channel. After the user successfully registers a
   * user account,  the SDK triggers the onLocalUserRegistered callback on the
   * local client,
   * reporting the user ID and user account of the local user.
   *
   * To join a channel with a user account, you can choose either of the
   * following:
   * - Call the {@link registerLocalUserAccount} method to create a user
   * account, and then the {@link joinChannelWithUserAccount} method to
   * join the channel.
   * - Call the {@link joinChannelWithUserAccount} method to join the
   * channel.
   *
   * The difference between the two is that for the former, the time elapsed
   * between calling the {@link joinChannelWithUserAccount} method and joining
   * the channel is shorter than the latter.
   *
   * To ensure smooth communication, use the same parameter type to identify
   * the user. For example, if a user joins the channel with a user ID, then
   * ensure all the other users use the user ID too. The same applies to the
   * user account. If a user joins the channel with the Agora Web SDK, ensure
   * that the `uid` of the user is set to the same parameter type.
   *
   * **Note**:
   * - Ensure that you set the `userAccount` parameter. Otherwise, this method
   * does not take effect.
   * - Ensure that the value of the `userAccount` parameter is unique in the
   * channel.
   *
   * @param {string} appId The App ID of your project.
   * @param {string} userAccount The user account. The maximum length of this
   * parameter is 255 bytes. Ensure that you set this parameter and do not
   * set it as null. Ensure that you set this parameter and do not set it as
   * null.
   * Supported character scopes are:
   * - All lowercase English letters: a to z.
   * - All uppercase English letters: A to Z.
   * - All numeric characters: 0 to 9.
   * - The space character.
   * - Punctuation characters and other symbols, including: "!", "#", "$",
   * "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".",
   * ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  registerLocalUserAccount(appId: string, userAccount: string): number {
    let param = {
      appId,
      userAccount,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineRegisterLocalUserAccount,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Joins the channel with a user account.
   *
   * After the user successfully joins the channel, the SDK triggers the
   * following callbacks:
   * - The local client: localUserRegistered and userInfoUpdated.
   * - The remote client: userJoined and userInfoUpdated, if the user joining
   * the channel is in the communication(`0`) profile, or is a host in the
   * `1` (live streaming) profile.
   *
   * **Note**: To ensure smooth communication, use the same parameter type to
   * identify the user. For example, if a user joins the channel with a user
   * ID, then ensure all the other users use the user ID too.
   * The same applies to the user account. If a user joins the channel with
   * the Agora Web SDK, ensure that the `uid` of the user is set to the same
   * parameter type.
   * @param {string} token The token generated at your server.
   * - For low-security requirements: You can use the temporary token generated
   * at Dashboard. For details, see
   * [Get a temporary token](https://docs.agora.io/en/Voice/token?platform=All%20Platforms#get-a-temporary-token).
   * - For high-security requirements: Set it as the token generated at your
   * server. For details, see
   * [Get a token](https://docs.agora.io/en/Voice/token?platform=All%20Platforms#get-a-token).
   * @param {string} channel The channel name. The maximum length of this
   * parameter is 64 bytes. Supported character scopes are:
   * - The 26 lowercase English letters: a to z.
   * - The 26 uppercase English letters: A to Z.
   * - The 10 numbers: 0 to 9.
   * - The space.
   * - "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".",
   * ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
   * @param {string} userAccount The user account. The maximum length of this
   * parameter is 255 bytes. Ensure that you set this parameter and do not set
   * it as null.
   * Supported character scopes are:
   * - The 26 lowercase English letters: a to z.
   * - The 26 uppercase English letters: A to Z.
   * - The 10 numbers: 0 to 9.
   * - The space.
   * - "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".",
   * ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *  - `ERR_INVALID_ARGUMENT (2)`
   *  - `ERR_NOT_READY (3)`
   *  - `ERR_REFUSED (5)`
   */
  joinChannelWithUserAccount(
    token: string,
    channelId: string,
    userAccount: string,
    options?: ChannelMediaOptions
  ): number {
    const param = {
      token,
      channelId,
      userAccount,
      options,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineJoinChannelWithUserAccount,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Gets the user information by passing in the user account.
   *
   * After a remote user joins the channel, the SDK gets the user ID and user
   * account of the remote user, caches them in a mapping table object
   * (UserInfo),
   * and triggers the `userInfoUpdated` callback on the local client.
   * After receiving the callback, you can call this method to get the user ID
   * of the remote user from the `UserInfo` object by passing in the user
   * account.
   * @param userAccount The user account. Ensure that you set this parameter.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  /**
   *
   * @param userAccount
   */
  getUserInfoByUserAccount(userAccount: string): {
    errCode: number;
    userInfo: UserInfo;
  } {
    let param = {
      userAccount,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineGetUserInfoByUserAccount,
      JSON.stringify(param)
    );

    let returnValue = {
      errCode: ret.retCode,
      userInfo: JSON.parse(ret.result),
    };

    return returnValue;
  }
  /**
   * Gets the user information by passing in the user ID.
   *
   * After a remote user joins the channel, the SDK gets the user ID and user
   * account of the remote user, caches them in a mapping table object
   * (UserInfo), and triggers the userInfoUpdated callback on the local client.
   * After receiving the callback, you can call this method to get the user
   * account of the remote user from the UserInfo object by passing in the
   * user ID.
   * @param uid The user ID. Ensure that you set this parameter.
   *
   * @return
   * - errCode Error code.
   * - userInfo [in/out] A UserInfo object that identifies the user:
   *  - Input: A UserInfo object.
   *  - Output: A UserInfo object that contains the user account and user ID
   * of the user.
   */
  getUserInfoByUid(uid: number): { errCode: number; userInfo: UserInfo } {
    let param = {
      uid,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineGetUserInfoByUid,
      JSON.stringify(param)
    );

    let returnValue = {
      errCode: ret.retCode,
      userInfo: JSON.parse(ret.result),
    };
    return returnValue;
  }
  /**
   * Switches to a different channel.
   *
   * This method allows the audience of a Live-broadcast channel to switch to
   * a different channel.
   *
   * After the user successfully switches to another channel, the leavechannel
   * and joinedChannel callbacks are triggered to indicate that the user has
   * left the original channel and joined a new one.
   *
   * @note
   * This method applies to the audience in a `1` (live streaming) profile only.
   *
   * @param token The token generated at your server:
   * - For low-security requirements: You can use the temporary token generated
   * at Console. For details,
   * see [Get a temporary token](https://docs.agora.io/en/Voice/token?platform=All%20Platforms#get-a-temporary-token).
   * - For high-security requirements: Set it as the token generated at your
   * server. For details,
   * see [Get a token](https://docs.agora.io/en/Voice/token?platform=All%20Platforms#get-a-token).
   * @param channel (Required) Pointer to the unique channel name for the
   * Agora RTC session in the string format smaller than 64 bytes.
   * Supported characters:
   * - The 26 lowercase English letters: a to z.
   * - The 26 uppercase English letters: A to Z.
   * - The 10 numbers: 0 to 9.
   * - The space.
   * - "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".",
   * ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *  - `ERR_INVALID_ARGUMENT (2)`
   *  - `ERR_NOT_READY (3)`
   *  - `ERR_REFUSED (5)`
   */
  switchChannel(
    token: string,
    channelId: string,
    options?: ChannelMediaOptions
  ): number {
    let param = {
      token,
      channelId,
      options,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSwitchChannel,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Adjusts the recording volume.
   * @param {number} volume Recording volume. To avoid echoes and improve call
   * quality, Agora recommends setting the value of volume between 0 and 100.
   * If you need to set the value higher than 100, contact support@agora.io
   * first.
   * - 0: Mute.
   * - 100: Original volume.
   * protection.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  adjustRecordingSignalVolume(volume = 100): number {
    let param = {
      volume,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineAdjustRecordingSignalVolume,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Adjusts the playback volume of the voice.
   * @param volume Playback volume of the voice. To avoid echoes and improve
   * call quality, Agora recommends setting the value of volume between 0 and
   * 100. If you need to set the value higher than 100, contact
   * support@agora.io first.
   * - 0: Mute.
   * - 100: Original volume.
   * protection.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  adjustPlaybackSignalVolume(volume = 100): number {
    let param = {
      volume,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineAdjustPlaybackSignalVolume,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * * @TODO
   * 3.3.2 ~ 3.4.2
   * @param volume
   * @returns
   */
  adjustLoopbackRecordingSignalVolume(volume = 100): number {
    const param = {
      volume,
    };

    const ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineAdjustLoopBackRecordingSignalVolume,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * * @TODO
   * 3.3.2 ~ 3.4.2
   * @param soundId
   * @param pos
   * @returns
   */
  setEffectPosition(soundId: number, pos: number): number {
    const param = {
      soundId,
      pos,
    };

    const ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetEffectPosition,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * * @TODO
   * * 3.3.2 ~ 3.4.2
   * @param filePath
   * @returns
   */
  getEffectDuration(filePath: string): number {
    const param = {
      filePath,
    };

    const ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineGetEffectDuration,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * * @TODO
   * 3.3.2 ~ 3.4.2
   * @param soundId
   * @returns
   */
  getEffectCurrentPosition(soundId: number): number {
    const param = {
      soundId,
    };

    const ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineGetEffectCurrentPosition,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Adjusts the playback volume of a specified remote user.
   *
   * You can call this method as many times as necessary to adjust the playback
   * volume of different remote users, or to repeatedly adjust the playback
   * volume of the same remote user.
   *
   * @note
   * - Call this method after joining a channel.
   * - The playback volume here refers to the mixed volume of a specified
   * remote user.
   * - This method can only adjust the playback volume of one specified remote
   * user at a time. To adjust the playback volume of different remote users,
   * call the method as many times, once for each remote user.
   *
   * @param uid The ID of the remote user.
   * @param volume The playback volume of the specified remote user. The value
   * ranges from 0 to 100:
   * - 0: Mute.
   * - 100: Original volume.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  adjustUserPlaybackSignalVolume(uid: number, volume: number): number {
    let param = {
      uid,
      volume,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineAdjustUserPlaybackSignalVolume,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * @private
   * @ignore
   */
  convertDeviceInfoToObject(deviceInfo: string): Device {
    let _device: { deviceName: string; deviceId: string } =
      JSON.parse(deviceInfo);
    let realDevice: Device = {
      devicename: _device.deviceName,
      deviceid: _device.deviceId,
      deviceName: _device.deviceName,
      deviceId: _device.deviceId,
    };
    return realDevice;
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
   * of the file name is in UTF-8, such as `c:/music/audio.aac` for Windows and
   * `file:///Users/Agora/Music/audio.aac` for macOS.
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
  startAudioRecording(
    filePath: string,
    sampleRate: number,
    quality: AUDIO_RECORDING_QUALITY_TYPE
  ): number {
    let param = {
      filePath,
      sampleRate,
      quality,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineStartAudioRecording,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * * @TODO
   * * 3.3.2 ~ 3.4.2
   * @param config
   * @returns
   */
  startAudioRecordingWithConfig(config: AudioRecordingConfiguration): number {
    const param = {
      config,
    };

    const ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineStartAudioRecording,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  stopAudioRecording(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineStopAudioRecording,
      ""
    );
    return ret.retCode;
  }

  // ===========================================================================
  // DEVICE MANAGEMENT
  // ===========================================================================
  /**
   * Gets the list of the video devices.
   * @return {Array} The array of the video devices.
   */
  getVideoDevices(): Array<Device> {
    const ret = this._rtcDeviceManager.CallApiVideoDevice(
      ApiTypeVideoDeviceManager.kVDMEnumerateVideoDevices,
      ""
    );
    try {
      const res: Array<any> = JSON.parse(ret.result);
      objsKeysToLowerCase(res);
      return res;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  /**
   * Sets the video device using the device Id.
   * @param {string} deviceId The device Id.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setVideoDevice(deviceId: string): number {
    let param = {
      deviceId,
    };

    let ret = this._rtcDeviceManager.CallApiVideoDevice(
      ApiTypeVideoDeviceManager.kVDMSetDevice,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Gets the current video device.
   * @return {Object} The video device.
   */
  getCurrentVideoDevice(): Device {
    let ret = this._rtcDeviceManager.CallApiVideoDevice(
      ApiTypeVideoDeviceManager.kVDMGetDevice,
      ""
    );

    let device: Device = {
      deviceId: ret.result,
      deviceid: ret.result,
      deviceName: "",
      devicename: "",
    };
    return device;
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
    let param = {
      hwnd: 1,
    };

    let ret = this._rtcDeviceManager.CallApiVideoDevice(
      ApiTypeVideoDeviceManager.kVDMStartDeviceTest,
      JSON.stringify(param)
    );
    return ret.retCode;
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
    let ret = this._rtcDeviceManager.CallApiVideoDevice(
      ApiTypeVideoDeviceManager.kVDMStopDeviceTest,
      ""
    );
    return ret.retCode;
  }

  /**
   * Retrieves the audio playback device associated with the device ID.
   * @return {Array} The array of the audio playback device.
   */
  getAudioPlaybackDevices(): Array<Device> {
    const ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMEnumeratePlaybackDevices,
      ""
    );

    return JSON.parse(ret.result);
  }

  /**
   * Sets the audio playback device using the device ID.
   * @param {string} deviceId The device ID of the audio playback device.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setAudioPlaybackDevice(deviceId: string): number {
    let param = {
      deviceId,
    };

    let ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMSetPlaybackDevice,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * @deprecated
   * Retrieves the audio playback device information associated with the
   * device ID and device name.
   * @param {string} deviceId The device ID of the audio playback device.
   * @param {string} deviceName The device name of the audio playback device.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */

  getPlaybackDeviceInfo(): Array<Device> {
    return this.getAudioPlaybackDevices();
  }

  /**
   * Gets the current audio playback device.
   * @return {Object} The current audio playback device.
   */
  getCurrentAudioPlaybackDevice(): Device {
    let ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMGetPlaybackDevice,
      ""
    );

    let device: Device = {
      deviceId: ret.result,
      deviceid: ret.result,
      devicename: "",
      deviceName: "",
    };
    return device;
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
    let param = {
      volume,
    };

    let ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMSetPlaybackDeviceVolume,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Retrieves the volume of the audio playback device.
   * @return The audio playback device volume.
   */
  getAudioPlaybackVolume(): number {
    let ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMGetPlaybackDeviceVolume,
      ""
    );
    return ret.retCode;
  }

  /**
   * Retrieves the audio recording device associated with the device ID.
   * @return {Array} The array of the audio recording device.
   */
  getAudioRecordingDevices(): Array<Device> {
    const ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMEnumerateRecordingDevices,
      ""
    );
    try {
      const res: Array<any> = JSON.parse(ret.result);
      objsKeysToLowerCase(res);
      return res;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  /**
   * Sets the audio recording device using the device ID.
   * @param {string} deviceId The device ID of the audio recording device.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setAudioRecordingDevice(deviceId: string): number {
    let param = {
      deviceId,
    };

    let ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMSetRecordingDevice,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * @deprecated ({@link getAudioRecordingDevices instead})
   * Retrieves the audio recording device information associated with the
   * device ID and device name.
   * @param {string} deviceId The device ID of the recording audio device.
   * @param {string} deviceName  The device name of the recording audio device.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  getRecordingDeviceInfo(): Array<Device> {
    deprecate("getRecordingDeviceInfo", "getAudioRecordingDevices");
    return this.getAudioRecordingDevices();
  }

  /**
   * Gets the current audio recording device.
   * @return {Object} The audio recording device.
   */
  getCurrentAudioRecordingDevice(): Device {
    let ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMGetPlaybackDeviceInfo,
      ""
    );
    let deviceObject = this.convertDeviceInfoToObject(ret.result);
    return deviceObject;
  }

  /**
   * Retrieves the volume of the microphone.
   * @return {number} The microphone volume. The volume value ranges between
   * 0 (lowest volume) and 255 (highest volume).
   */
  getAudioRecordingVolume(): number {
    let ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMGetRecordingDeviceVolume,
      ""
    );
    return ret.retCode;
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
    let param = {
      volume,
    };

    let ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMSetRecordingDeviceVolume,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  startAudioPlaybackDeviceTest(testAudioFilePath: string): number {
    let param = {
      testAudioFilePath,
    };

    let ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMStartPlaybackDeviceTest,
      JSON.stringify(param)
    );
    return ret.retCode;
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
    let ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMStopPlaybackDeviceTest,
      ""
    );
    return ret.retCode;
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
  startAudioDeviceLoopbackTest(indicationInterval: number): number {
    let param = {
      indicationInterval,
    };

    let ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMStartAudioDeviceLoopbackTest,
      JSON.stringify(param)
    );
    return ret.retCode;
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
    let ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMStopAudioDeviceLoopbackTest,
      ""
    );
    return ret.retCode;
  }

  /** Enables loopback audio capturing.
   *
   * If you enable loopback audio capturing, the output of the sound card is
   * mixed into the audio stream sent to the other end.
   *
   * @note You can call this method either before or after joining a channel.
   *
   * @param enable Sets whether to enable/disable loopback capturing.
   * - true: Enable loopback capturing.
   * - false: (Default) Disable loopback capturing.
   * @param deviceName The device name of the sound card. The default value
   * is NULL (the default sound card). **Note**: macOS does not support
   * loopback capturing of the default sound card.
   * If you need to use this method, please use a virtual sound card and pass
   * its name to the deviceName parameter. Agora has tested and recommends
   * using soundflower.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  enableLoopbackRecording(enabled = false, deviceName?: string): number {
    let param = {
      enabled,
      deviceName,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineEnableLoopBackRecording,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  startAudioRecordingDeviceTest(indicationInterval: number): number {
    let param = {
      indicationInterval,
    };

    let ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMStartRecordingDeviceTest,
      JSON.stringify(param)
    );
    return ret.retCode;
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
    let ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMStopRecordingDeviceTest,
      ""
    );
    return ret.retCode;
  }

  /**
   * check whether selected audio playback device is muted
   * @return {boolean} muted/unmuted
   */
  getAudioPlaybackDeviceMute(): boolean {
    let ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMGetPlaybackDeviceMute,
      ""
    );
    return ret.retCode !== 0;
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
    let param = {
      mute,
    };

    let ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMSetPlaybackDeviceMute,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Retrieves the mute status of the audio playback device.
   * @return {boolean} Whether to mute/unmute the audio playback device:
   * - true: Mutes.
   * - false: Unmutes.
   */
  getAudioRecordingDeviceMute(): boolean {
    let ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMGetRecordingDeviceMute,
      ""
    );
    return ret.retCode !== 0;
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
    let param = {
      mute,
    };

    let ret = this._rtcDeviceManager.CallApiAudioDevice(
      ApiTypeAudioDeviceManager.kADMSetRecordingDeviceMute,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * @private
   * @ignore
   */
  getScreenWindowsInfo(): Array<WindowInfo> {
    deprecate("getScreenWindowsInfo", "getWindowsInfo");
    return this.getWindowsInfo();
  }

  /**
   * Gets the window ID when using the video source.
   *
   * This method gets the ID of the whole window and relevant inforamtion.
   * You can share the whole or part of a window by specifying the window ID.
   * @return {Array} The array list of the window ID and relevant information.
   */
  getWindowsInfo(): Array<WindowInfo> {
    return this._rtcEngine.GetScreenWindowsInfo();
  }

  /**
   * @private
   * @ignore
   */
  getScreenDisplaysInfo(): Array<DisplayInfo> {
    deprecate("getScreenDisplaysInfo", "getScreensInfo");
    return this.getScreensInfo();
  }

  getScreensInfo(): Array<DisplayInfo> {
    return this._rtcEngine.GetScreenDisplaysInfo();
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
  startScreenCaptureByWindow(
    windowId: number,
    regionRect: Rectangle,
    captureParams: ScreenCaptureParameters
  ): number {
    let param = {
      windowId,
      regionRect,
      captureParams,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineStartScreenCaptureByWindowId,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  startScreenCaptureByScreen(
    screenSymbol: ScreenSymbol,
    regionRect: Rectangle,
    captureParams: ScreenCaptureParameters
  ): number {
    if (process.platform === "darwin") {
      let param = {
        displayId: (screenSymbol as MacScreenId).id,
        regionRect,
        captureParams,
      };

      let ret = this._rtcEngine.CallApi(
        PROCESS_TYPE.MAIN,
        ApiTypeEngine.kEngineStartScreenCaptureByDisplayId,
        JSON.stringify(param)
      );

      if (ret.retCode === 0) {
        this.enableLocalVideo(true);
      } else {
        this.enableLocalVideo(false);
      }

      return ret.retCode;
    } else process.platform === "win32";
    {
      let param = {
        screenRect: screenSymbol,
        regionRect,
        captureParams,
      };

      let ret = this._rtcEngine.CallApi(
        PROCESS_TYPE.MAIN,
        ApiTypeEngine.kEngineStartScreenCaptureByScreenRect,
        JSON.stringify(param)
      );

      if (ret.retCode === 0) {
        this.enableLocalVideo(true);
      } else {
        this.enableLocalVideo(false);
      }
      return ret.retCode;
    }
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
  updateScreenCaptureParameters(
    captureParams: ScreenCaptureParameters
  ): number {
    let param = {
      captureParams,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineUpdateScreenCaptureParameters,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  setScreenCaptureContentHint(contentHint: VideoContentHint): number {
    let param = {
      contentHint,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetScreenCaptureContentHint,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Stops screen sharing.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  stopScreenCapture(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineStopScreenCapture,
      ""
    );

    this.enableLocalVideo(false);
    return ret.retCode;
  }

  /**
   * Updates the screen capture region.
   * @param {*} rect {left: 0, right: 100, top: 0, bottom: 100} (relative
   * distance from the left-top corner of the screen)
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  updateScreenCaptureRegion(regionRect: Rectangle): number {
    let param = {
      regionRect,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineUpdateScreenCaptureRegion,
      JSON.stringify(param)
    );
    return ret.retCode;
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
    filePath: string,
    loopback: boolean,
    replace: boolean,
    cycle: number,
    startPos?: number
  ): number {
    let param = {
      filePath,
      loopback,
      replace,
      cycle,
      startPos,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineStartAudioMixing,
      JSON.stringify(param)
    );
    return ret.retCode;
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
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineStopAudioMixing,
      ""
    );
    return ret.retCode;
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
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEnginePauseAudioMixing,
      ""
    );
    return ret.retCode;
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
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineResumeAudioMixing,
      ""
    );
    return ret.retCode;
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
  adjustAudioMixingVolume(volume = 100): number {
    let param = {
      volume,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineAdjustAudioMixingVolume,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Adjusts the audio mixing volume for local playback.
   * @param {number} volume Audio mixing volume for local playback. The value
   * ranges between 0 and 100 (default). 100 is the original volume.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  adjustAudioMixingPlayoutVolume(volume = 100): number {
    let param = {
      volume,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineAdjustAudioMixingPlayoutVolume,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Adjusts the audio mixing volume for publishing (sending to other users).
   * @param {number} volume Audio mixing volume for publishing. The value
   * ranges between 0 and 100 (default). 100 is the original volume.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  adjustAudioMixingPublishVolume(volume = 100): number {
    let param = {
      volume,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineAdjustAudioMixingPublishVolume,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Gets the duration (ms) of the music file.
   *
   * Call this API when you are in a channel.
   * @return
   * - ≥ 0: The audio mixing duration, if this method call succeeds.
   * - < 0: Failure.
   */
  getAudioMixingDuration(filePath?: string): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineGetAudioMixingDuration,
      filePath ? JSON.stringify({ filePath }) : ""
    );
    return ret.retCode;
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
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineGetAudioMixingCurrentPosition,
      ""
    );
    return ret.retCode;
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
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineGetAudioMixingPlayoutVolume,
      ""
    );
    return ret.retCode;
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
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineGetAudioMixingPublishVolume,
      ""
    );
    return ret.retCode;
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
  setAudioMixingPosition(pos: number): number {
    let param = {
      pos,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetAudioMixingPosition,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /** Sets the pitch of the local music file.
   *
   * @since v3.2.0
   *
   * When a local music file is mixed with a local human voice, call this
   * method to set the pitch of the local music file only.
   *
   * @note Call this method after calling {@link startAudioMixing}.
   *
   * @param pitch Sets the pitch of the local music file by chromatic scale.
   * The default value is 0,
   * which means keeping the original pitch. The value ranges from -12 to 12,
   * and the pitch value between
   * consecutive values is a chromatic value. The greater the absolute value
   * of this parameter, the
   * higher or lower the pitch of the local music file.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setAudioMixingPitch(pitch: number): number {
    let param = {
      pitch,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetAudioMixingPitch,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  // ===========================================================================
  // CDN STREAMING
  // ===========================================================================
  /**
   * Publishes the local stream to a specified CDN live RTMP address.
   *
   * The SDK returns the result of this method call in the streamPublished
   * callback.
   *
   * @note
   * - Only the host in the `1` (live streaming) profile can call this
   * method.
   * - Call this method after the host joins the channel.
   * - Ensure that you enable the RTMP Converter service before using this
   * function. See *Prerequisites* in the *Push Streams to CDN* guide.
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
    let param = {
      url,
      transcodingEnabled,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineAddPublishStreamUrl,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Removes an RTMP stream from the CDN.
   * @note
   * - Only the host in the `1` (live streaming) profile can call this
   * method.
   * - This method removes only one RTMP URL address each time it is called.
   * - The RTMP URL address must not contain special characters, such as
   * Chinese language characters.
   * @param {string} url The RTMP URL address to be removed. The maximum
   * length of this parameter is 1024 bytes.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  removePublishStreamUrl(url: string): number {
    let param = {
      url,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineRemovePublishStreamUrl,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Sets the video layout and audio settings for CDN live. (CDN live only)
   *
   * The SDK triggers the otranscodingUpdated callback when you call the
   * {@link setLiveTranscoding} method to update the LiveTranscoding class.
   *
   * @note
   * - Only the host in the Live-broadcast porfile can call this method.
   * - Ensure that you enable the RTMP Converter service before using
   * this function. See *Prerequisites* in the *Push Streams to CDN* guide.
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
  setLiveTranscoding(transcoding: LiveTranscoding): number {
    let param = {
      transcoding,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetLiveTranscoding,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  // ===========================================================================
  // STREAM INJECTION
  // ===========================================================================
  /**
   * Adds a voice or video stream HTTP/HTTPS URL address to a live streaming.
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
   * @note
   * - Only the host in the Live-braodcast profile can call this method.
   * - Ensure that you enable the RTMP Converter service before using this
   * function. See *Prerequisites* in the *Push Streams to CDN* guide.
   * - Ensure that the user joins a channel before calling this method.
   * - This method adds only one stream URL address each time it is called.
   *
   * @param {string} url The HTTP/HTTPS URL address to be added to the ongoing
   * live streaming. Valid protocols are RTMP, HLS, and FLV.
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
   *  - `ERR_NOT_SUPPORTED (4)`: The channel profile is not Live streaming.
   * Call the {@link setChannelProfile} method and set the channel profile to
   * Live streaming before calling this method.
   *  - `ERR_NOT_INITIALIZED (7)`: The SDK is not initialized. Ensure that
   * the `AgoraRtcEngine` object is initialized before using this method.
   */
  addInjectStreamUrl(url: string, config: InjectStreamConfig): number {
    let param = {
      url,
      config,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineAddInjectStreamUrl,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Removes the injected online media stream from a live streaming.
   *
   * @param {string} url HTTP/HTTPS URL address of the added stream to be
   * removed.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  removeInjectStreamUrl(url: string): number {
    let param = {
      url,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineRemoveInjectStreamUrl,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  createDataStream(reliable: boolean, ordered?: boolean): number {
    const param = {
      reliable,
      ordered,
    };

    const ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineCreateDataStream,
      JSON.stringify(param)
    );

    return ret.retCode;
  }
  createDataStreamWithConfig(config: DataStreamConfig): number {
    const ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineCreateDataStream,
      JSON.stringify({ config })
    );

    return ret.retCode;
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
   * @note
   * This method applies only to the communication(`0`) profile or to the hosts in
   * the `1` (live streaming) profile.
   * If an audience in the `1` (live streaming) profile calls this method, the
   * audience may be switched to a host.
   * @param {number} streamId ID of the sent data stream, returned in the
   * {@link createDataStream} method.
   * @param {string} data Data to be sent.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  sendStreamMessage(streamId: number, data: string): number {
    let param = {
      streamId,
      length: data.length,
    };

    let ret = this._rtcEngine.CallApiWithBuffer(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSendStreamMessage,
      JSON.stringify(param),
      data,
      data.length
    );
    return ret.retCode;
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
   * @note
   * - Contact sales-us@agora.io before implementing this function.
   * - Call this method after the {@link joinChannel} method.
   * - This method takes effect only when you are a host in a
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
  startChannelMediaRelay(
    configuration: ChannelMediaRelayConfiguration
  ): number {
    let param = {
      configuration,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineStartChannelMediaRelay,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  updateChannelMediaRelay(
    configuration: ChannelMediaRelayConfiguration
  ): number {
    let param = {
      configuration,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineUpdateChannelMediaRelay,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Stops the media stream relay.
   *
   * Once the relay stops, the host quits all the destination channels.
   *
   * After a successful method call, the SDK triggers the
   * channelMediaRelayState callback. If the callback reports the state
   * code `0` and the error code `1`, the host
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
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineStopChannelMediaRelay,
      ""
    );
    return ret.retCode;
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
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineGetEffectsVolume,
      ""
    );
    return ret.retCode;
  }
  /**
   * Sets the volume of the audio effects.
   * @param {number} volume Sets the volume of the audio effects. The value
   * ranges between 0 and 100 (default).
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setEffectsVolume(volume = 100): number {
    let param = {
      volume,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetEffectsVolume,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  setVolumeOfEffect(soundId: number, volume = 100): number {
    let param = {
      soundId,
      volume,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetVolumeOfEffect,
      JSON.stringify(param)
    );
    return ret.retCode;
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
    loopCount: number,
    pitch: number,
    pan: number,
    gain: number,
    publish: boolean,
    startPos?: number
  ): number {
    let param = {
      soundId,
      filePath,
      loopCount,
      pitch,
      pan,
      gain,
      publish,
      startPos,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEnginePlayEffect,
      JSON.stringify(param)
    );
    return ret.retCode;
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
    let param = {
      soundId,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineStopEffect,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Stops playing all audio effects.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  stopAllEffects(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineStopAllEffects,
      ""
    );
    return ret.retCode;
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
    let param = {
      soundId,
      filePath,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEnginePreloadEffect,
      JSON.stringify(param)
    );
    return ret.retCode;
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
    let param = {
      soundId,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineUnloadEffect,
      JSON.stringify(param)
    );
    return ret.retCode;
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
    let param = {
      soundId,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEnginePauseEffect,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Pauses all the audio effects.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  pauseAllEffects(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEnginePauseAllEffects,
      ""
    );
    return ret.retCode;
  }
  /**
   * Resumes playing a specified audio effect.
   * @param {number} soundId sound id
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  resumeEffect(soundId: number): number {
    let param = {
      soundId,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineResumeEffect,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Resumes playing all audio effects.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  resumeAllEffects(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineResumeAllEffects,
      ""
    );
    return ret.retCode;
  }

  /**
   * Enables/Disables stereo panning for remote users.
   *
   * Ensure that you call this method before {@link joinChannel} to enable
   * stereo panning
   * for remote users so that the local user can track the position of a
   * remote user
   * by calling {@link setRemoteVoicePosition}.
   * @param {boolean} enable Sets whether or not to enable stereo panning for
   * remote users:
   * - true: enables stereo panning.
   * - false: disables stereo panning.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  enableSoundPositionIndication(enabled: boolean) {
    let param = {
      enabled,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineEnableSoundPositionIndication,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Sets the sound position and gain of a remote user.
   *
   * When the local user calls this method to set the sound position of a
   * remote user, the sound difference between the left and right channels
   * allows
   * the local user to track the real-time position of the remote user,
   * creating a real sense of space. This method applies to massively
   * multiplayer online games, such as Battle Royale games.
   *
   * **Note**:
   * - For this method to work, enable stereo panning for remote users by
   * calling the {@link enableSoundPositionIndication} method before joining
   * a channel.
   * - This method requires hardware support. For the best sound positioning,
   * we recommend using a stereo speaker.
   * @param {number} uid The ID of the remote user.
   * @param {number} pan The sound position of the remote user. The value
   * ranges from -1.0 to 1.0:
   * - 0.0: The remote sound comes from the front.
   * - -1.0: The remote sound comes from the left.
   * - 1.0: The remote sound comes from the right.
   * @param {number} gain Gain of the remote user. The value ranges from 0.0
   * to 100.0. The default value is 100.0 (the original gain of the
   * remote user).
   * The smaller the value, the less the gain.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setRemoteVoicePosition(uid: number, pan: number, gain = 100): number {
    let param = {
      uid,
      pan,
      gain,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetRemoteVoicePosition,
      JSON.stringify(param)
    );
    return ret.retCode;
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
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineGetCallId,
      ""
    );
    return ret.retCode === 0 ? ret.result : ret.retCode.toString();
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
  rate(callId: string, rating: number, description?: string): number {
    let param = {
      callId,
      rating,
      description,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineRate,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  complain(callId: string, description?: string): number {
    let param = {
      callId,
      description,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineComplain,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  setRecordingAudioFrameParameters(
    sampleRate: number,
    channel: 1 | 2,
    mode: RAW_AUDIO_FRAME_OP_MODE_TYPE,
    samplesPerCall: number
  ): number {
    let param = {
      sampleRate,
      channel,
      mode,
      samplesPerCall,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetRecordingAudioFrameParameters,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  setParameters(parameters: string): number {
    let param = {
      parameters,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetParameters,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /** Unregisters a media metadata observer.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  unregisterMediaMetadataObserver(type: METADATA_TYPE = 0): number {
    let param = {
      type,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineUnRegisterMediaMetadataObserver,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /** Registers a media metadata observer.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  registerMediaMetadataObserver(type: METADATA_TYPE = 0): number {
    let param = {
      type,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineRegisterMediaMetadataObserver,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /** Sends the media metadata.
   *
   * After calling the {@link registerMediaMetadataObserver} method, you can
   * call the `setMetadata` method to send the media metadata.
   *
   * If it is a successful sending, the sender receives the
   * `sendMetadataSuccess` callback, and the receiver receives the
   * `receiveMetadata` callback.
   *
   * @param metadata The media metadata.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  sendMetadata(metadata: Metadata): number {
    let param = {
      metadata,
    };

    let ret = this._rtcEngine.CallApiWithBuffer(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSendMetadata,
      JSON.stringify(param),
      metadata.buffer,
      metadata.buffer.length
    );
    return ret.retCode;
  }
  /** Sets the maximum size of the media metadata.
   *
   * After calling the {@link registerMediaMetadataObserver} method, you can
   * call the `setMaxMetadataSize` method to set the maximum size.
   *
   * @param size The maximum size of your metadata.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setMaxMetadataSize(size: number): number {
    let param = {
      size,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetMaxMetadataSize,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /** Agora supports reporting and analyzing customized messages.
   *
   * @since v3.2.0
   *
   * This function is in the beta stage with a free trial. The ability
   * provided in its beta test version is reporting a maximum of 10 message
   * pieces within 6 seconds, with each message piece not exceeding 256 bytes
   * and each string not exceeding 100 bytes.
   *
   * To try out this function, contact support@agora.io and discuss the
   * format of customized messages with us.
   */
  sendCustomReportMessage(
    id: string,
    category: string,
    event: string,
    label: string,
    value: number
  ): number {
    let param = {
      id,
      category,
      event,
      label,
      value,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSendCustomReportMessage,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /** Enables/Disables the built-in encryption.
   *
   * @since v3.2.0
   *
   * In scenarios requiring high security, Agora recommends calling this
   * method to enable the built-in encryption before joining a channel.
   *
   * All users in the same channel must use the same encryption mode and
   * encryption key. Once all users leave the channel, the encryption key of
   * this channel is automatically cleared.
   *
   * **Note**:
   * - If you enable the built-in encryption, you cannot use the RTMP or
   * RTMPS streaming function.
   * - The SDK returns `-4` when the encryption mode is incorrect or
   * the SDK fails to load the external encryption library.
   * Check the enumeration or reload the external encryption library.
   *
   * @param enabled Whether to enable the built-in encryption:
   * - true: Enable the built-in encryption.
   * - false: Disable the built-in encryption.
   * @param config Configurations of built-in encryption schemas.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  enableEncryption(enabled: boolean, config: EncryptionConfig): number {
    let param = {
      enabled,
      config,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineEnableEncryption,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /** Sets an SDK preset audio effect.
   *
   * @since v3.2.0
   *
   * Call this method to set an SDK preset audio effect for the local user
   * who sends an audio stream. This audio effect
   * does not change the gender characteristics of the original voice.
   * After setting an audio effect, all users in the
   * channel can hear the effect.
   *
   * You can set different audio effects for different scenarios.
   *
   * To achieve better audio effect quality, Agora recommends calling
   * {@link setAudioProfile}
   * and setting the `scenario` parameter to `3` before calling this method.
   *
   * **Note**:
   * - You can call this method either before or after joining a channel.
   * - Do not set the profile `parameter` of `setAudioProfile` to `1` or `6`;
   * otherwise, this method call fails.
   * - This method works best with the human voice. Agora does not recommend
   * using this method for audio containing music.
   * - If you call this method and set the `preset` parameter to enumerators
   * except `ROOM_ACOUSTICS_3D_VOICE` or `PITCH_CORRECTION`,
   * do not call {@link setAudioEffectParameters}; otherwise,
   * {@link setAudioEffectParameters}
   * overrides this method.
   * - After calling this method, Agora recommends not calling the following
   * methods, because they can override `setAudioEffectPreset`:
   *  - {@link setVoiceBeautifierPreset}
   *  - {@link setLocalVoiceReverbPreset}
   *  - {@link setLocalVoiceChanger}
   *  - {@link setLocalVoicePitch}
   *  - {@link setLocalVoiceEqualization}
   *  - {@link setLocalVoiceReverb}
   *
   * @param preset The options for SDK preset audio effects.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setAudioEffectPreset(preset: AUDIO_EFFECT_PRESET): number {
    let param = {
      preset,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetAudioEffectPreset,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /** Sets an SDK preset voice beautifier effect.
   *
   * @since v3.2.0
   *
   * Call this method to set an SDK preset voice beautifier effect for the
   * local user who sends an audio stream. After
   * setting a voice beautifier effect, all users in the channel can hear
   * the effect.
   *
   * You can set different voice beautifier effects for different scenarios.
   *
   * To achieve better audio effect quality, Agora recommends calling
   * {@link setAudioProfile} and
   * setting the `scenario` parameter to `3` and the `profile` parameter to
   * `4` or `5` before calling this method.
   *
   * @note
   * - You can call this method either before or after joining a channel.
   * - Do not set the `profile` parameter of {@link setAudioProfile} to
   * `1`
   * or `6`; otherwise, this method call fails.
   * - This method works best with the human voice. Agora does not recommend
   * using this method for audio containing music.
   * - After calling this method, Agora recommends not calling the following
   * methods, because they can override {@link setVoiceBeautifierPreset}:
   *  - {@link setAudioEffectPreset}
   *  - {@link setAudioEffectParameters}
   *  - {@link setLocalVoiceReverbPreset}
   *  - {@link setLocalVoiceChanger}
   *  - {@link setLocalVoicePitch}
   *  - {@link setLocalVoiceEqualization}
   *  - {@link setLocalVoiceReverb}
   *
   * @param preset The options for SDK preset voice beautifier effects.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setVoiceBeautifierPreset(preset: VOICE_BEAUTIFIER_PRESET): number {
    let param = {
      preset,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetVoiceBeautifierPreset,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /** Sets parameters for SDK preset audio effects.
   *
   * @since v3.2.0
   *
   * Call this method to set the following parameters for the local user who
   * send an audio stream:
   * - 3D voice effect: Sets the cycle period of the 3D voice effect.
   * - Pitch correction effect: Sets the basic mode and tonic pitch of the
   * pitch correction effect. Different songs
   * have different modes and tonic pitches. Agora recommends bounding this
   * method with interface elements to enable
   * users to adjust the pitch correction interactively.
   *
   * After setting parameters, all users in the channel can hear the relevant
   * effect.
   *
   * You can call this method directly or after {@link setAudioEffectPreset}.
   * If you
   * call this method after {@link setAudioEffectPreset}, ensure that you set
   * the preset
   * parameter of {@link setAudioEffectPreset} to `ROOM_ACOUSTICS_3D_VOICE` or
   * `PITCH_CORRECTION` and then call this method
   * to set the same enumerator; otherwise, this method overrides
   * {@link setAudioEffectPreset}.
   *
   * @note
   * - You can call this method either before or after joining a channel.
   * - To achieve better audio effect quality, Agora recommends
   * calling {@link setAudioProfile}
   * and setting the `scenario` parameter to `3` before calling this method.
   * - Do not set the `profile` parameter of {@link setAudioProfile} to
   * `1` or
   * `6`; otherwise, this method call fails.
   * - This method works best with the human voice. Agora does not recommend
   * using this method for audio containing music.
   * - After calling this method, Agora recommends not calling the following
   * methods, because they can override `setAudioEffectParameters`:
   *  - {@link setAudioEffectPreset}
   *  - {@link setVoiceBeautifierPreset}
   *  - {@link setLocalVoiceReverbPreset}
   *  - {@link setLocalVoiceChanger}
   *  - {@link setLocalVoicePitch}
   *  - {@link setLocalVoiceEqualization}
   *  - {@link setLocalVoiceReverb}
   *
   * @param preset The options for SDK preset audio effects:
   * - 3D voice effect: `ROOM_ACOUSTICS_3D_VOICE`.
   *  - Call {@link setAudioProfile} and set the `profile` parameter to
   * `3`
   * or `5` before setting this enumerator; otherwise, the enumerator setting
   * does not take effect.
   *  - If the 3D voice effect is enabled, users need to use stereo audio
   * playback devices to hear the anticipated voice effect.
   * - Pitch correction effect: `PITCH_CORRECTION`. To achieve better audio
   *  effect quality, Agora recommends calling
   * {@link setAudioProfile} and setting the `profile` parameter to
   * `4` or
   * `5` before setting this enumerator.
   * @param param1
   * - If you set `preset` to `ROOM_ACOUSTICS_3D_VOICE`, the `param1` sets
   * the cycle period of the 3D voice effect.
   * The value range is [1,60] and the unit is a second. The default value is
   * 10 seconds, indicating that the voice moves
   * around you every 10 seconds.
   * - If you set `preset` to `PITCH_CORRECTION`, `param1` sets the basic
   * mode of the pitch correction effect:
   *  - `1`: (Default) Natural major scale.
   *  - `2`: Natural minor scale.
   *  - `3`: Japanese pentatonic scale.
   * @param param2
   * - If you set `preset` to `ROOM_ACOUSTICS_3D_VOICE`, you need to set
   * `param2` to `0`.
   * - If you set `preset` to `PITCH_CORRECTION`, `param2` sets the
   * tonic pitch of the pitch correction effect:
   *  - `1`: A
   *  - `2`: A#
   *  - `3`: B
   *  - `4`: (Default) C
   *  - `5`: C#
   *  - `6`: D
   *  - `7`: D#
   *  - `8`: E
   *  - `9`: F
   *  - `10`: F#
   *  - `11`: G
   *  - `12`: G#
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  setAudioEffectParameters(
    preset: AUDIO_EFFECT_PRESET,
    param1: number,
    param2: number
  ): number {
    let param = {
      preset,
      param1,
      param2,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetAudioEffectParameters,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  // 3.3.0 apis
  setCloudProxy(proxyType: CLOUD_PROXY_TYPE): number {
    const param = {
      proxyType,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetCloudProxy,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  enableDeepLearningDenoise(enable = true): number {
    let param = {
      enable,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineEnableDeepLearningDenoise,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  setVoiceBeautifierParameters(
    preset: VOICE_BEAUTIFIER_PRESET,
    param1: number,
    param2: number
  ): number {
    let param = {
      preset,
      param1,
      param2,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetVoiceBeautifierParameters,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  uploadLogFile(): string {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineUploadLogFile,
      ""
    );
    return ret.result;
  }
  /**
   * Enables/Disables the virtual background. (beta function)
   *
   * @since 3.4.5
   *
   * After enabling the virtual background function, you can replace the
   * original background image of the local user with a custom background image.
   * After the replacement, all users in the channel can see the custom
   * background image. You can find out from the
   * `virtualBackgroundSourceEnabled` callback whether the virtual background
   * is successfully enabled or the cause of any errors.
   *
   * @note
   * - Before calling this method, ensure that you have integrated the following
   * dynamic library into your project:
   *    - macOS: `AgoraVideoSegmentationExtension.framework`
   *    - Windows: `libagora_segmentation_extension.dll`
   * - Call this method after {@link enableVideo}.
   * - This functions requires a high-performance device. Agora recommends that
   * you use this function on devices with an i5 CPU and better.
   * - Agora recommends that you use this function in scenarios that meet the
   * following conditions:
   * - A high-definition camera device is used, and the environment is
   * uniformly lit.
   * - The captured video image is uncluttered, the user's portrait is
   * half-length and largely unobstructed, and the background is a single color
   * that differs from the color of the user's clothing.
   *
   * @param enabled Sets whether to enable the virtual background:
   * - true: Enable.
   * - false: Disable.
   * @param backgroundSource The custom background image. See
   * {@link VirtualBackgroundSource}.
   *
   * **Note: To adapt the resolution of the custom background image to the
   * resolution of the SDK capturing video, the SDK scales and crops the custom
   * background image while ensuring that the content of the custom background
   * image is not distorted.**
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  enableVirtualBackground(
    enabled: Boolean,
    backgroundSource: VirtualBackgroundSource
  ): number {
    const param = {
      enabled,
      backgroundSource,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineEnableVirtualBackground,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  // ===========================================================================
  // plugin apis
  // ===========================================================================

  registerPlugin(pluginInfo: PluginInfo): number {
    let param = {
      pluginId: pluginInfo.pluginId,
      pluginPath: pluginInfo.pluginPath,
      order: pluginInfo.order,
    };

    let ret = this._rtcEngine.PluginCallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeRawDataPluginManager.kRDPMRegisterPlugin,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  unregisterPlugin(pluginId: string): number {
    let param = {
      pluginId,
    };

    let ret = this._rtcEngine.PluginCallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeRawDataPluginManager.kRDPMUnregisterPlugin,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  getPlugins(): Plugin[] {
    let ret = this._rtcEngine.PluginCallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeRawDataPluginManager.kRDPMGetPlugins,
      ""
    );
    let pluginIdArray: string[] = JSON.parse(ret.result);

    return pluginIdArray.map((item) => {
      return this.createPlugin(item);
    });
  }

  /**
   * @private
   * @ignore
   */
  createPlugin(pluginId: string): Plugin {
    return {
      pluginId,
      enable: () => {
        return this.enablePlugin(pluginId, true);
      },
      disable: () => {
        return this.enablePlugin(pluginId, false);
      },
      setParameter: (param: string) => {
        return this.setPluginParameter(pluginId, param);
      },
      getParameter: (paramKey: string) => {
        return this.getPluginParameter(pluginId, paramKey);
      },
    };
  }

  enablePlugin(pluginId: string, enabled: boolean): number {
    let param = {
      pluginId,
      enabled,
    };

    let ret = this._rtcEngine.PluginCallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeRawDataPluginManager.kRDPMEnablePlugin,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  setPluginParameter(pluginId: string, parameter: string): number {
    let param = {
      pluginId,
      parameter,
    };

    let ret = this._rtcEngine.PluginCallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeRawDataPluginManager.kRDPMSetPluginParameter,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  getPluginParameter(pluginId: string, key: string): string {
    let param = {
      pluginId,
      key,
    };

    let ret = this._rtcEngine.PluginCallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeRawDataPluginManager.kRDPMGetPluginParameter,
      JSON.stringify(param)
    );
    return ret.result;
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
   * Initializes agora real-time-communicating video source with the app Id.
   * @param {string} appId The app ID issued to you by Agora.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *  - `ERR_INVALID_APP_ID (101)`: The app ID is invalid. Check if it is in
   * the correct format.
   */
  videoSourceInitialize(
    appId: string,
    areaCode?: AREA_CODE,
    logConfig?: LogConfig
  ): number {
    deprecate("videoSourceInitialize", "videoSourceInitializeWithContext");
    let context = {
      appId,
      areaCode,
      logConfig,
    };

    return this.videoSourceInitializeWithContext(context);
  }

  videoSourceInitializeWithContext(context: RtcEngineContext): number {
    let param = {
      context,
    };
    const ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineInitialize,
      JSON.stringify(param)
    );
    this.videoSourceEnableLocalVideo(false);
    this.videoSourceEnableLocalAudio(false);
    this.videoSourceMuteAllRemoteVideoStreams(true);
    this.videoSourceMuteAllRemoteAudioStreams(true);
    return ret.retCode;
  }

  /**
   * Specifies an SDK output log file for the video source object.
   *
   * **Note**: Call this method after the {@link videoSourceInitialize} method.
   * @param {string} filepath filepath of log. The string of the log file is
   * in UTF-8.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  videoSourceSetLogFile(filePath: string) {
    let param = {
      filePath,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineSetLogFile,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * @private
   * @ignore
   * @deprecated
   */
  setupLocalVideoSource(
    view: Element,
    rendererOptions: RendererOptions = {
      append: false,
      contentMode: CONTENT_MODE.FIT,
      mirror: false,
    }
  ): void {
    deprecate("setupLocalVideoSource", "setView");
    let rendererConfig: RendererConfig = {
      user: "videoSource",
      view,
      rendererOptions,
    };
    this.setView(rendererConfig);
  }

  /**
   * @deprecated This method is deprecated. As of v3.0.0, the Electron SDK
   * automatically enables interoperability with the Web SDK, so you no longer
   * need to call this method.
   *
   * Enables the web interoperability of the video source, if you set it to
   * true.
   *
   * **Note**:
   * You must call this method after calling the {@link videoSourceInitialize}
   * method.
   *
   * @param {boolean} enabled Set whether or not to enable the web
   * interoperability of the video source.
   * - true: Enables the web interoperability.
   * - false: Disables web interoperability.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  videoSourceEnableWebSdkInteroperability(enabled = false): number {
    let param = {
      enabled,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineEnableWebSdkInteroperability,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * @deprecated
   * @ignore
   * @private
   */
  videoSourceJoin(
    token: string,
    channelId: string,
    info: string,
    uid: number,
    options?: ChannelMediaOptions
  ): number {
    deprecate("videoSourceJoin", "videoSourceJoinChannel");
    return this.videoSourceJoinChannel(token, channelId, info, uid, options);
  }

  videoSourceJoinChannel(
    token: string,
    channelId: string,
    info: string,
    uid: number,
    options?: ChannelMediaOptions
  ): number {
    let param = {
      token,
      channelId,
      info,
      uid,
      options,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineJoinChannel,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * @private
   * @ignore
   * @deprecated
   */
  videoSourceLeave(): number {
    deprecate("videoSourceLeave", "videoSourceLeaveChannel");
    return this.videoSourceLeaveChannel();
  }

  videoSourceLeaveChannel(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineLeaveChannel,
      ""
    );
    return ret.retCode;
  }

  /**
   * Gets a new token for a user using the video source when the current token
   * expires after a period of time.
   *
   * The application should call this method to get the new `token`.
   * Failure to do so will result in the SDK disconnecting from the server.
   *
   * @param {string} token The new token.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  videoSourceRenewToken(token: string): number {
    let param = {
      token,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineRenewToken,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Sets the channel profile when using the video source.
   *
   * @param {number} profile Sets the channel profile:
   * - 0:(Default) Communication.
   * - 1: Live streaming.
   * - 2: Gaming.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  videoSourceSetChannelProfile(profile: CHANNEL_PROFILE_TYPE): number {
    let param = {
      profile,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineSetChannelProfile,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Sets the video profile when using the video source.
   * @param {VIDEO_PROFILE_TYPE} profile The video profile. See
   * {@link VIDEO_PROFILE_TYPE}.
   * @param {boolean} [swapWidthAndHeight = false] Whether to swap width and
   * height:
   * - true: Swap the width and height.
   * - false: Do not swap the width and height.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  videoSourceSetVideoProfile(
    profile: VIDEO_PROFILE_TYPE,
    swapWidthAndHeight: boolean = false
  ): number {
    deprecate(
      "videoSourceSetVideoProfile",
      "videoSourceSetVideoEncoderConfiguration"
    );
    let param = {
      profile,
      swapWidthAndHeight,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineSetVideoProfile,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  videoSourceSetVideoEncoderConfiguration(
    config: VideoEncoderConfiguration
  ): number {
    Object.assign(
      {
        dimensions: { width: 640, height: 360 },
        frameRate: 15,
        minFrameRate: -1,
        bitrate: 0,
        minBitrate: -1,
        orientationMode: 0,
        degradationPreference: 0,
        mirrorMode: 0,
      },
      config
    );

    let param = {
      config,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineSetVideoEncoderConfiguration,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Enables the dual-stream mode for the video source.
   * @param {boolean} enable Whether or not to enable the dual-stream mode:
   * - true: Enables the dual-stream mode.
   * - false: Disables the dual-stream mode.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  videoSourceEnableDualStreamMode(enabled: boolean): number {
    let param = {
      enabled,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineEnableDualStreamMode,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Sets the video source parameters.
   * @param {string} parameter Sets the video source encoding parameters.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  videoSourceSetParameters(parameters: string): number {
    let param = {
      parameters,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineSetParameters,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Updates the screen capture region for the video source.
   * @param {*} rect {left: 0, right: 100, top: 0, bottom: 100} (relative
   * distance from the left-top corner of the screen)
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  videoSourceUpdateScreenCaptureRegion(regionRect: Rectangle): number {
    let param = {
      regionRect,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineUpdateScreenCaptureRegion,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /** Enables loopback audio capturing.
   *
   * If you enable loopback audio capturing, the output of the sound card is
   * mixed into the audio stream sent to the other end.
   *
   * @note You can call this method either before or after joining a channel.
   *
   * @param enable Sets whether to enable/disable loopback capturing.
   * - true: Enable loopback capturing.
   * - false: (Default) Disable loopback capturing.
   * @param deviceName The device name of the sound card. The default value
   * is NULL (the default sound card). **Note**: macOS does not support
   * loopback capturing of the default sound card.
   * If you need to use this method, please use a virtual sound card and pass
   * its name to the deviceName parameter. Agora has tested and recommends
   * using soundflower.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  videoSourceEnableLoopbackRecording(
    enabled = false,
    deviceName?: string
  ): number {
    let param = {
      enabled,
      deviceName,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineEnableLoopBackRecording,
      JSON.stringify(param)
    );
    return ret.retCode;
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
  videoSourceEnableAudio(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineEnableAudio,
      ""
    );
    return ret.retCode;
  }

  videoSourceDisableAudio(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineDisableAudio,
      ""
    );
    return ret.retCode;
  }

  videoSourceEnableVideo(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineEnableVideo,
      ""
    );
    return ret.retCode;
  }

  videoSourceDisableVideo(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineDisableVideo,
      ""
    );
    return ret.retCode;
  }
  /** Enables/Disables the built-in encryption.
   *
   * @since v3.2.0
   *
   * In scenarios requiring high security, Agora recommends calling this
   * method to enable the built-in encryption before joining a channel.
   *
   * All users in the same channel must use the same encryption mode and
   * encryption key. Once all users leave the channel, the encryption key of
   * this channel is automatically cleared.
   *
   * **Note**:
   * - If you enable the built-in encryption, you cannot use the RTMP or
   * RTMPS streaming function.
   * - The SDK returns `-4` when the encryption mode is incorrect or
   * the SDK fails to load the external encryption library.
   * Check the enumeration or reload the external encryption library.
   *
   * @param enabled Whether to enable the built-in encryption:
   * - true: Enable the built-in encryption.
   * - false: Disable the built-in encryption.
   * @param encryptionConfig Configurations of built-in encryption schemas.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  videoSourceEnableEncryption(
    enabled: boolean,
    config: EncryptionConfig
  ): number {
    let param = {
      enabled,
      config,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineEnableEncryption,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * @deprecated This method is deprecated from v3.2.0. Use the
   * {@link videoSourceEnableEncryption} method instead.
   *
   * Sets the built-in encryption mode.
   *
   * @param encryptionMode Pointer to the set encryption mode:
   * - `"aes-128-xts"`: (Default) 128-bit AES encryption, XTS mode.
   * - `"aes-128-ecb"`: 128-bit AES encryption, ECB mode.
   * - `"aes-256-xts"`: 256-bit AES encryption, XTS mode.
   * - `""`: The encryption mode is set as `"aes-128-xts"` by default.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  videoSourceSetEncryptionMode(encryptionMode: string): number {
    let param = {
      encryptionMode,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineSetEncryptionMode,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /** Enables built-in encryption with an encryption password before users
   * join a channel.
   *
   * @deprecated This method is deprecated from v3.2.0. Use the
   * {@link videoSourceEnableEncryption} method instead.
   *
   * @param secret Pointer to the encryption password.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  videoSourceSetEncryptionSecret(secret: string): number {
    let param = {
      secret,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineSetEncryptionSecret,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  videoSourceStartScreenCaptureByDisplayId(
    screenSymbol: ScreenSymbol,
    regionRect: Rectangle,
    captureParams: ScreenCaptureParameters
  ): number {
    let param = {
      displayId: (screenSymbol as MacScreenId).id,
      regionRect,
      captureParams,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineStartScreenCaptureByDisplayId,
      JSON.stringify(param)
    );

    if (ret.retCode === 0) {
      this.videoSourceEnableLocalVideo(true);
    } else {
      this.videoSourceEnableLocalVideo(false);
    }

    return ret.retCode;
  }

  // 2.4 new Apis
  /**
   * Shares the whole or part of a screen by specifying the screen rect.
   * @param {ScreenSymbol} screenSymbol The display ID：
   * - macOS: The display ID.
   * - Windows: The screen rect.
   * @param {CaptureRect} rect Sets the relative location of the region
   * to the screen.
   * @param {CaptureParam} param Sets the video source encoding parameters.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  videoSourceStartScreenCaptureByScreen(
    screenSymbol: ScreenSymbol,
    regionRect: Rectangle,
    captureParams: ScreenCaptureParameters
  ): number {
    if (process.platform === "darwin") {
      let param = {
        displayId: (screenSymbol as MacScreenId).id,
        regionRect,
        captureParams,
      };

      let ret = this._rtcEngine.CallApi(
        PROCESS_TYPE.SCREEN_SHARE,
        ApiTypeEngine.kEngineStartScreenCaptureByDisplayId,
        JSON.stringify(param)
      );

      if (ret.retCode === 0) {
        this.videoSourceEnableLocalVideo(true);
      } else {
        this.videoSourceEnableLocalVideo(false);
      }

      return ret.retCode;
    } else process.platform === "win32";
    {
      let param = {
        screenRect: screenSymbol,
        regionRect,
        captureParams,
      };

      let ret = this._rtcEngine.CallApi(
        PROCESS_TYPE.SCREEN_SHARE,
        ApiTypeEngine.kEngineStartScreenCaptureByScreenRect,
        JSON.stringify(param)
      );

      if (ret.retCode === 0) {
        this.videoSourceEnableLocalVideo(true);
      } else {
        this.videoSourceEnableLocalVideo(false);
      }

      return ret.retCode;
    }
  }

  /**
   * Shares the whole or part of a window by specifying the window ID.
   * @param {number} windowSymbol The ID of the window to be shared.
   * @param {CaptureRect} rect The ID of the window to be shared.
   * @param {CaptureParam} param Sets the video source encoding parameters.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  videoSourceStartScreenCaptureByWindow(
    windowId: number,
    regionRect: Rectangle,
    captureParams: ScreenCaptureParameters
  ): number {
    let param = {
      windowId,
      regionRect,
      captureParams,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineStartScreenCaptureByWindowId,
      JSON.stringify(param)
    );

    if (ret.retCode === 0) {
      this.videoSourceEnableLocalVideo(true);
    } else {
      this.videoSourceEnableLocalVideo(false);
    }

    return ret.retCode;
  }

  /**
   * Updates the video source parameters.
   * @param {CaptureParam} param Sets the video source encoding parameters.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  videoSourceUpdateScreenCaptureParameters(
    captureParams: ScreenCaptureParameters
  ): number {
    let param = {
      captureParams,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineUpdateScreenCaptureParameters,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   *  Updates the video source parameters.
   * @param {VideoContentHint} hint Sets the content hint for the video source.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  videoSourceSetScreenCaptureContentHint(
    contentHint: VideoContentHint
  ): number {
    let param = {
      contentHint,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineSetScreenCaptureContentHint,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * @private
   * @ignore
   * @deprecated
   */
  startScreenCapture2(
    windowId: number,
    captureFreq: number,
    rect: Rect,
    bitrate: number
  ): number {
    deprecate(
      "startScreenCapture2",
      '"videoSourceStartScreenCaptureByScreen" or "videoSourceStartScreenCaptureByWindow"'
    );
    return this.videoSourceStartScreenCapture(
      windowId,
      captureFreq,
      rect,
      bitrate
    );
  }

  /**
   * @deprecated
   */
  videoSourceStartScreenCapture(
    windowId: number,
    captureFreq: number,
    rect: Rect,
    bitrate: number
  ): number {
    deprecate(
      "videoSourceStartScreenCapture",
      '"videoSourceStartScreenCaptureByScreen" or "videoSourceStartScreenCaptureByWindow"'
    );
    let param = {
      windowId,
      captureFreq,
      rect,
      bitrate,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineStartScreenCapture,
      JSON.stringify(param)
    );

    if (ret.retCode === 0) {
      this.videoSourceEnableLocalVideo(true);
    } else {
      this.videoSourceEnableLocalVideo(false);
    }

    return ret.retCode;
  }

  /**
   * @private
   * @ignore
   * @deprecated
   */
  stopScreenCapture2(): number {
    deprecate("stopScreenCapture2", "videoSourceStopScreenCapture");
    return this.videoSourceStopScreenCapture();
  }

  videoSourceStopScreenCapture(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineStopScreenCapture,
      ""
    );

    this.videoSourceEnableLocalVideo(false);
    return ret.retCode;
  }

  /**
   * @private
   * @ignore
   * @deprecated
   */
  startScreenCapturePreview(): number {
    deprecate("startScreenCapturePreview", "videoSourceStartPreview");
    return this.videoSourceStartPreview();
  }

  videoSourceStartPreview(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineStartPreview,
      ""
    );
    return ret.retCode;
  }

  /**
   * @private
   * @ignore
   * @deprecated
   */
  stopScreenCapturePreview(): number {
    deprecate("stopScreenCapturePreview", "videoSourceStopPreview");
    return this.videoSourceStopPreview();
  }

  videoSourceStopPreview(): number {
    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineStopPreview,
      ""
    );
    return ret.retCode;
  }

  videoSourceEnableLocalVideo(enabled = true): number {
    let param = {
      enabled,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineEnableLocalVideo,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  videoSourceEnableLocalAudio(enabled = true): number {
    let param = {
      enabled,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineEnableLocalAudio,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  videoSourceMuteAllRemoteVideoStreams(mute = false): number {
    let param = {
      mute,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineMuteAllRemoteVideoStreams,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  videoSourceMuteAllRemoteAudioStreams(mute = false): number {
    let param = {
      mute,
    };

    let ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineMuteAllRemoteAudioStreams,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  videoSourceRegisterPlugin(pluginInfo: PluginInfo): number {
    let param = {
      pluginId: pluginInfo.pluginId,
      pluginPath: pluginInfo.pluginPath,
      order: pluginInfo.order,
    };

    let ret = this._rtcEngine.PluginCallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeRawDataPluginManager.kRDPMRegisterPlugin,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  videoSourceUnregisterPlugin(pluginId: string): number {
    let param = {
      pluginId,
    };

    let ret = this._rtcEngine.PluginCallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeRawDataPluginManager.kRDPMUnregisterPlugin,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  videoSourceGetPlugins(): Plugin[] {
    let ret = this._rtcEngine.PluginCallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeRawDataPluginManager.kRDPMGetPlugins,
      ""
    );
    let pluginIdArray: string[] = JSON.parse(ret.result);

    return pluginIdArray.map((item) => {
      return this.createPlugin(item);
    });
  }

  /**
   * @private
   * @ignore
   */
  videoSourceCreatePlugin(pluginId: string): Plugin {
    return {
      pluginId,
      enable: () => {
        return this.videoSourceEnablePlugin(pluginId, true);
      },
      disable: () => {
        return this.videoSourceEnablePlugin(pluginId, false);
      },
      setParameter: (param: string) => {
        return this.videoSourceSetPluginParameter(pluginId, param);
      },
      getParameter: (paramKey: string) => {
        return this.videoSourceGetPluginParameter(pluginId, paramKey);
      },
    };
  }

  videoSourceEnablePlugin(pluginId: string, enabled: boolean): number {
    let param = {
      pluginId,
      enabled,
    };

    let ret = this._rtcEngine.PluginCallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeRawDataPluginManager.kRDPMEnablePlugin,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  videoSourceSetPluginParameter(pluginId: string, parameter: string): number {
    let param = {
      pluginId,
      parameter,
    };

    let ret = this._rtcEngine.PluginCallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeRawDataPluginManager.kRDPMSetPluginParameter,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  videoSourceGetPluginParameter(pluginId: string, key: string): string {
    let param = {
      pluginId,
      key,
    };

    let ret = this._rtcEngine.PluginCallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeRawDataPluginManager.kRDPMGetPluginParameter,
      JSON.stringify(param)
    );
    return ret.result;
  }

  /**
   * Releases the video source object.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  videoSourceRelease(sync = false): number {
    const param = {
      sync,
    };
    const ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.SCREEN_SHARE,
      ApiTypeEngine.kEngineRelease,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  setVoiceConversionPreset(preset: VOICE_CONVERSION_PRESET): number {
    const param = {
      preset,
    };
    const ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetVoiceConversionPreset,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  setAudioMixingPlaybackSpeed(speed: number): number {
    const param = { speed };
    const ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetAudioMixingPlaybackSpeed,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  selectAudioTrack(index: number): number {
    const param = { index };
    const ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSelectAudioTrack,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  getAudioTrackCount(): number {
    const param = {};
    const ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineGetAudioTrackCount,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  setAudioMixingDualMonoMode(mode: AUDIO_MIXING_DUAL_MONO_MODE): number {
    const param = { mode };
    const ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetAudioMixingDualMonoMode,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  getAudioFileInfo(filePath: string): number {
    const param = { filePath };
    const ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineGetAudioFileInfo,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  setVideoProfileEx(
    width: number,
    height: number,
    frameRate: number,
    bitrate: number
  ): number {
    const param = { width, height, frameRate, bitrate };
    const ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kEngineSetVideoProfileEx,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  setExternalAudioSourceVolume(sourcePos: number, volume: number): number {
    const param = { sourcePos, volume };
    const ret = this._rtcEngine.CallApi(
      PROCESS_TYPE.MAIN,
      ApiTypeEngine.kMediaSetExternalAudioSourceVolume,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  // setLogWriter(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineSetLogWriter,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // releaseLogWriter(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineReleaseLogWriter,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // setLocalVideoRenderer(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineSetLocalVideoRenderer,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // setRemoteVideoRenderer(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineSetRemoteVideoRenderer,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // setCameraTorchOn(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineSetCameraTorchOn,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // isCameraTorchSupported(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineIsCameraTorchSupported,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // getCameraMaxZoomFactor(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineGetCameraMaxZoomFactor,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // isCameraAutoFocusFaceModeSupported(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineIsCameraAutoFocusFaceModeSupported,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // isCameraExposurePositionSupported(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineIsCameraExposurePositionSupported,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // isCameraFocusSupported(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineIsCameraFocusSupported,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // isCameraZoomSupported(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineIsCameraZoomSupported,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // setCameraAutoFocusFaceModeEnabled(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineSetCameraAutoFocusFaceModeEnabled,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // setCameraExposurePosition(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineSetCameraExposurePosition,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // setCameraFocusPositionInPreview(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineSetCameraFocusPositionInPreview,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // setCameraZoomFactor(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineSetCameraZoomFactor,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // startRhythmPlayer(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineStartRhythmPlayer,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // stopRhythmPlayer(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineStopRhythmPlayer,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // configRhythmPlayer(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineConfigRhythmPlayer,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // getNativeHandle(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineGetNativeHandle,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // getScreenCaptureSources(
  //   thumbSize: SIZE,
  //   iconSize: SIZE,
  //   includeScreen: boolean
  // ): any {
  //   const param = { thumbSize, iconSize, includeScreen };
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineGetScreenCaptureSources,
  //     JSON.stringify(param)
  //   );
  //   return ret;
  // }
  // takeSnapshot(channel: string, uid: number, filePath: string): number {
  //   const param = { channel, uid, filePath };
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineTakeSnapshot,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
  // enableContentInspect(): number {
  //   const param = {};
  //   const ret = this._rtcEngine.CallApi(
  //     PROCESS_TYPE.MAIN,
  //     ApiTypeEngine.kEngineEnableContentInspect,
  //     JSON.stringify(param)
  //   );
  //   return ret.retCode;
  // }
}
