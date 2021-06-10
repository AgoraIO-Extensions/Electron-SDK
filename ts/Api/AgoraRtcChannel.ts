import { ApiTypeChannel } from "./internal/native_type";
import { NodeIrisRtcChannel } from "./internal/native_interface";
import {
  RtcStats,
  QUALITY_TYPE,
  RemoteVideoStats,
  RemoteAudioStats,
  REMOTE_AUDIO_STATE_REASON,
  REMOTE_VIDEO_STATE,
  REMOTE_VIDEO_STATE_REASON,
  REMOTE_AUDIO_STATE,
  CLIENT_ROLE_TYPE,
  REMOTE_VIDEO_STREAM_TYPE,
  CONNECTION_STATE_TYPE,
  CONNECTION_CHANGED_REASON_TYPE,
  LiveTranscoding,
  InjectStreamConfig,
  PRIORITY_TYPE,
  Metadata,
  RTMP_STREAMING_EVENT,
  STREAM_PUBLISH_STATE,
  STREAM_SUBSCRIBE_STATE,
  EncryptionConfig,
  ClientRoleOptions,
  USER_OFFLINE_REASON_TYPE,
  SUPER_RESOLUTION_STATE_REASON,
  RTMP_STREAM_PUBLISH_STATE,
  RTMP_STREAM_PUBLISH_ERROR,
  ChannelMediaOptions,
  CHANNEL_MEDIA_RELAY_EVENT,
  CHANNEL_MEDIA_RELAY_STATE,
  CHANNEL_MEDIA_RELAY_ERROR,
  ChannelMediaRelayConfiguration,
  INJECT_STREAM_STATUS,
  DataStreamConfig,
} from "./types";
import { EventEmitter } from "events";
import { logWarn } from "../Utils";

import { User, RendererConfig } from "../Renderer/type";
import { EngineEvents, VideoSourceEvents } from "../Common/JSEvents";
import AgoraRtcEngine from "./AgoraRtcEngine";

class AgoraRtcChannel extends EventEmitter {
  _rtcChannel: NodeIrisRtcChannel;
  _rtcEngine: AgoraRtcEngine;
  _channelId: string;
  constructor(
    channelId: string,
    rtcChannel: NodeIrisRtcChannel,
    rtcEngine: AgoraRtcEngine
  ) {
    super();
    this._rtcChannel = rtcChannel;
    this._channelId = channelId;
    this._rtcEngine = rtcEngine;
    this.createChannel(this._channelId);
    this.initEventHandler();
  }

  /**
   * init event handler
   * @private
   * @ignore
   */
  initEventHandler(): void {
    const fire = (event: string, ...args: Array<any>) => {
      setImmediate(() => {
        this.emit(event, ...args);
      });
    };

    this._rtcChannel.OnEvent(
      "call_back",
      (_eventName: string, _eventData: string) => {
        switch (_eventName) {
          case "onChannelWarning":
            {
              let data: {
                channelId: string;
                warn: number;
                msg: string;
              } = JSON.parse(_eventData);
              fire("channelWarning", data.channelId, data.warn, data.msg);
            }
            break;

          case "onChannelError":
            {
              let data: {
                channelId: string;
                err: number;
                msg: string;
              } = JSON.parse(_eventData);
              fire("channelError", data.channelId, data.err, data.msg);
            }
            break;

          case "onJoinChannelSuccess":
            {
              let data: {
                channelId: string;
                uid: number;
                elapsed: number;
              } = JSON.parse(_eventData);
              fire(
                "joinChannelSuccess",
                data.channelId,
                data.uid,
                data.elapsed
              );
            }
            break;

          case "onRejoinChannelSuccess":
            {
              let data: {
                channelId: string;
                uid: number;
                elapsed: number;
              } = JSON.parse(_eventData);
              fire(
                "rejoinChannelSuccess",
                data.channelId,
                data.uid,
                data.elapsed
              );
            }
            break;

          case "onLeaveChannel":
            {
              let data: { channelId: string; stats: RtcStats } =
                JSON.parse(_eventData);
              fire("leaveChannel", data.channelId, data.stats);
            }
            break;

          case "onClientRoleChanged":
            {
              let data: {
                channelId: string;
                oldRole: CLIENT_ROLE_TYPE;
                newRole: CLIENT_ROLE_TYPE;
              } = JSON.parse(_eventData);
              fire(
                "clientRoleChanged",
                data.channelId,
                data.oldRole,
                data.newRole
              );
            }
            break;

          case "onUserJoined":
            {
              let data: {
                channelId: string;
                uid: number;
                elapsed: number;
              } = JSON.parse(_eventData);
              fire("userJoined", data.channelId, data.uid, data.elapsed);
            }
            break;

          case "onUserOffline":
            {
              let data: {
                channelId: string;
                uid: number;
                reason: USER_OFFLINE_REASON_TYPE;
              } = JSON.parse(_eventData);
              fire("userOffline", data.channelId, data.uid, data.reason);
              this.destroyRenderer(data.uid);
            }
            break;

          case "onConnectionLost":
            {
              let data: { channelId: string } = JSON.parse(_eventData);
              fire("connectionlost", data.channelId);
            }
            break;

          case "onRequestToken":
            {
              let data: { channelId: string } = JSON.parse(_eventData);
              fire("requestToken", data.channelId);
            }
            break;

          case "onTokenPrivilegeWillExpire":
            {
              let data: { channelId: string; token: string } =
                JSON.parse(_eventData);
              fire("tokenPrivilegeWillExpire", data.channelId, data.token);
            }
            break;

          case "onRtcStats":
            {
              let data: { channelId: string; stats: RtcStats } =
                JSON.parse(_eventData);
              fire("rtcstats", data.channelId, data.stats);
            }
            break;

          case "onNetworkQuality":
            {
              let data: {
                channelId: string;
                uid: number;
                txQuality: QUALITY_TYPE;
                rxQuality: QUALITY_TYPE;
              } = JSON.parse(_eventData);
              fire(
                "networkquality",
                data.channelId,
                data.uid,
                data.txQuality,
                data.rxQuality
              );
            }
            break;

          case "onRemoteVideoStats":
            {
              let data: {
                channelId: string;
                stats: RemoteVideoStats;
              } = JSON.parse(_eventData);
              fire("remoteVideoStats", data.channelId, data.stats);
            }
            break;

          case "onRemoteAudioStats":
            {
              let data: {
                channelId: string;
                stats: RemoteAudioStats;
              } = JSON.parse(_eventData);
              fire("remoteAudioStats", data.channelId, data.stats);
            }
            break;

          case "onRemoteAudioStateChanged":
            {
              let data: {
                channelId: string;
                uid: number;
                state: REMOTE_AUDIO_STATE;
                reason: REMOTE_AUDIO_STATE_REASON;
                elapsed: number;
              } = JSON.parse(_eventData);
              fire(
                "remoteAudioStateChanged",
                data.channelId,
                data.uid,
                data.state,
                data.reason,
                data.elapsed
              );
            }
            break;

          case "onAudioPublishStateChanged":
            {
              let data: {
                channelId: string;
                oldState: STREAM_PUBLISH_STATE;
                newState: STREAM_PUBLISH_STATE;
                elapseSinceLastState: number;
              } = JSON.parse(_eventData);
              fire(
                "audioPublishStateChanged",
                data.channelId,
                data.oldState,
                data.newState,
                data.elapseSinceLastState
              );
            }
            break;

          case "onVideoPublishStateChanged":
            {
              let data: {
                channelId: string;
                oldState: STREAM_PUBLISH_STATE;
                newState: STREAM_PUBLISH_STATE;
                elapseSinceLastState: number;
              } = JSON.parse(_eventData);
              fire(
                "videoPublishStateChanged",
                data.channelId,
                data.oldState,
                data.newState,
                data.elapseSinceLastState
              );
            }
            break;

          case "onAudioSubscribeStateChanged":
            {
              let data: {
                channelId: string;
                uid: number;
                oldState: STREAM_SUBSCRIBE_STATE;
                newState: STREAM_SUBSCRIBE_STATE;
                elapseSinceLastState: number;
              } = JSON.parse(_eventData);
              fire(
                "audioSubscribeStateChanged",
                data.channelId,
                data.uid,
                data.oldState,
                data.newState,
                data.elapseSinceLastState
              );
            }
            break;

          case "onVideoSubscribeStateChanged":
            {
              let data: {
                channelId: string;
                uid: number;
                oldState: STREAM_SUBSCRIBE_STATE;
                newState: STREAM_SUBSCRIBE_STATE;
                elapseSinceLastState: number;
              } = JSON.parse(_eventData);
              fire(
                "videoSubscribeStateChanged",
                data.channelId,
                data.uid,
                data.oldState,
                data.newState,
                data.elapseSinceLastState
              );
            }
            break;

          case "onActiveSpeaker":
            {
              let data: { channelId: string; uid: number } =
                JSON.parse(_eventData);
              fire("activeSpeaker", data.channelId, data.uid);
            }
            break;

          case "onVideoSizeChanged":
            {
              let data: {
                channelId: string;
                uid: number;
                width: number;
                height: number;
                rotation: number;
              } = JSON.parse(_eventData);
              fire(
                "videoSizeChanged",
                data.channelId,
                data.uid,
                data.width,
                data.height,
                data.rotation
              );
            }
            break;

          case "onRemoteVideoStateChanged":
            {
              let data: {
                channelId: string;
                uid: number;
                state: REMOTE_VIDEO_STATE;
                reason: REMOTE_VIDEO_STATE_REASON;
                elapsed: number;
              } = JSON.parse(_eventData);
              fire(
                "remoteVideoStateChanged",
                data.channelId,
                data.uid,
                data.state,
                data.reason,
                data.elapsed
              );
            }
            break;

          case "onStreamMessageError":
            {
              let data: {
                channelId: string;
                uid: number;
                streamId: number;
                code: number;
                missed: number;
                cached: number;
              } = JSON.parse(_eventData);
              fire(
                "streamMessageError",
                data.channelId,
                data.uid,
                data.streamId,
                data.code,
                data.missed,
                data.cached
              );
            }
            break;

          case "onUserSuperResolutionEnabled":
            {
              let data: {
                channelId: string;
                uid: number;
                enabled: boolean;
                reason: SUPER_RESOLUTION_STATE_REASON;
              } = JSON.parse(_eventData);
              fire(
                "userSuperResolutionEnabled",
                data.channelId,
                data.uid,
                data.enabled,
                data.reason
              );
            }
            break;

          case "onChannelMediaRelayStateChanged":
            {
              let data: {
                channelId: string;
                state: CHANNEL_MEDIA_RELAY_STATE;
                code: CHANNEL_MEDIA_RELAY_ERROR;
              } = JSON.parse(_eventData);
              fire(
                "channelMediaRelayStateChanged",
                data.channelId,
                data.state,
                data.code
              );
            }
            break;

          case "onChannelMediaRelayEvent":
            {
              let data: {
                channelId: string;
                code: CHANNEL_MEDIA_RELAY_EVENT;
              } = JSON.parse(_eventData);
              fire("channelMediaRelayEvent", data.channelId, data.code);
            }
            break;

          case "onRtmpStreamingStateChanged":
            {
              let data: {
                channelId: string;
                url: string;
                state: RTMP_STREAM_PUBLISH_STATE;
                errCode: RTMP_STREAM_PUBLISH_ERROR;
              } = JSON.parse(_eventData);
              fire(
                "rtmpStreamingStateChanged",
                data.channelId,
                data.url,
                data.state,
                data.errCode
              );
            }
            break;

          case "onRtmpStreamingEvent":
            {
              let data: {
                channelId: string;
                url: string;
                eventCode: RTMP_STREAMING_EVENT;
              } = JSON.parse(_eventData);
              fire(
                "rtmpStreamingEvent",
                data.channelId,
                data.url,
                data.eventCode
              );
            }
            break;

          case "onTranscodingUpdated":
            {
              let data: { channelId: string } = JSON.parse(_eventData);
              fire("transcodingUpdated", data.channelId);
            }
            break;

          case "onStreamInjectedStatus":
            {
              let data: {
                channelId: string;
                url: string;
                uid: number;
                status: INJECT_STREAM_STATUS;
              } = JSON.parse(_eventData);
              fire(
                "streamInjectedStatus",
                data.channelId,
                data.url,
                data.uid,
                data.status
              );
            }
            break;

          case "onLocalPublishFallbackToAudioOnly":
            {
              let data: {
                channelId: string;
                isFallbackOrRecover: boolean;
              } = JSON.parse(_eventData);
              fire(
                "localPublishFallbackToAudioOnly",
                data.channelId,
                data.isFallbackOrRecover
              );
            }
            break;

          case "onRemoteSubscribeFallbackToAudioOnly":
            {
              let data: {
                channelId: string;
                uid: number;
                isFallbackOrRecover: boolean;
              } = JSON.parse(_eventData);
              fire(
                "remoteSubscribeFallbackToAudioOnly",
                data.channelId,
                data.uid,
                data.isFallbackOrRecover
              );
            }
            break;

          case "onConnectionStateChanged":
            {
              let data: {
                channelId: string;
                state: CONNECTION_STATE_TYPE;
                reason: CONNECTION_CHANGED_REASON_TYPE;
              } = JSON.parse(_eventData);
              fire(
                "connectionStateChanged",
                data.channelId,
                data.state,
                data.reason
              );
            }
            break;

          case "onReadyToSendMetadata":
            {
              let data: {
                uid: number;
                size: number;
                buffer: string;
                timeStampMs: number;
              } = JSON.parse(_eventData);

              fire("readyToSendMetadata", data);
            }
            break;

          default:
            break;
        }
      }
    );

    this._rtcChannel.OnEvent(
      "call_back_with_buffer",
      (_eventName: string, _eventData: string, _eventBuffer: string) => {
        switch (_eventName) {
          case "onStreamMessage":
            {
              let data: { uid: number; streamId: number } =
                JSON.parse(_eventData);
              fire("streamMessage", data.uid, data.streamId, _eventBuffer);
            }
            break;

          case "onReadyToSendMetadata":
            {
              let data: { metadata: Metadata } = JSON.parse(_eventData);
              data.metadata.buffer = _eventBuffer;
              fire("readyToSendMetadata", data.metadata);
            }
            break;

          case "onMetadataReceived":
            {
              let data: { metadata: Metadata } = JSON.parse(_eventData);
              data.metadata.buffer = _eventBuffer;
              fire("metadataReceived", data.metadata);
            }
            break;

          default:
            break;
        }
      }
    );
  }

  createChannel(channelId: string): number {
    let param = {
      channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelCreateChannel,
      JSON.stringify(param)
    );

    return ret.retCode;
  }

  /**
   * @param user
   * - local video set-> 'local'
   * - local video source set-> 'videoSource'
   * - remote video set-> uid
   *
   * @param view
   * - dom which render video
   *
   * @param channelId
   *
   * -local video set->''
   * -remteo video set->channelId
   *
   */
  setView(rendererConfig: RendererConfig): void {
    rendererConfig.view ? {} : logWarn("Note: setView view is null!!!");

    this._rtcEngine.setView(rendererConfig);
  }

  destroyRenderer(user: User): void {
    this._rtcEngine.destroyRenderer(user, this.channelId());
  }

  /**
   * Joins the channel with a user ID.
   *
   * This method differs from the `joinChannel` method in the `AgoraRtcEngine`
   * class in the following aspects:
   * - For the `joinChannel` method in the `AgoraRtcChannel` class:
   *  - Does not contain the `channel` parameter, because `channel` is
   * specified when creating the `AgoraRtcChannel` object.
   *  - Contains the `options` parameter, which decides whether to subscribe
   * to all streams before joining the channel.
   *  - Users can join multiple channels simultaneously by creating multiple
   * `AgoraRtcChannel` objects and calling the `joinChannel` method of each
   * object.
   *  - By default, the SDK does not publish any stream after the user joins
   * the channel. You need to call the {@link publish} method to do that.
   * - For the `joinChannel` method in the `AgoraRtcEngine` class:
   *  - Contains the `channel` parameter, which specifies the channel to join.
   *  - Does not contain the `options` parameter. By default, users subscribe
   * to all streams when joining the channel.
   *  - Users can join only one channel.
   *  - By default, the SDK publishes streams once the user joins the channel.
   * @note
   * - If you are already in a channel, you cannot rejoin it with the same `uid`.
   * - We recommend using different UIDs for different channels.
   * - If you want to join the same channel from different devices, ensure
   * that the UIDs in all devices are different.
   * - Ensure that the app ID you use to generate the token is the same with
   * the app ID used when creating the `AgoraRtcChannel` object.
   * @param token The token for authentication:
   * - In situations not requiring high security: You can use the temporary
   * token generated at Console. For details, see
   * [Get a temporary token](https://docs.agora.io/en/Agora%20Platform/token?platfor%20*%20m=All%20Platforms#get-a-temporary-token).
   * - In situations requiring high security: Set it as the token generated at
   * your server. For details, see
   * [Generate a token](https://docs.agora.io/en/Agora%20Platform/token?platfor%20*%20m=All%20Platforms#get-a-token).
   * @param info (Optional) Additional information about the channel. This parameter can be set as null. Other users in the channel do not receive this information.
   * @param uid The user ID. A 32-bit unsigned integer with a value ranging
   * from 1 to (232-1). This parameter must be unique. If `uid` is not
   * assigned (or set as `0`), the SDK assigns a `uid` and reports it in
   * the `joinChannelSuccess` callback.
   * The app must maintain this user ID.
   * @param options The channel media options, see
   * {@link ChannelMediaOptions}
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *  - `ERR_INVALID_ARGUMENT (2)`
   *  - `ERR_NOT_READY (3)`
   *  - `ERR_REFUSED (5)`
   */
  joinChannel(
    token: string,
    info: string,
    uid: number,
    options: ChannelMediaOptions
  ): number {
    let param = {
      token,
      info,
      uid,
      options,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelJoinChannel,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Joins the channel with a user account.
   *
   * After the user successfully joins the channel, the SDK triggers the
   * following callbacks:
   * - The local client: `localUserRegistered` and `joinChannelSuccess`.
   * - The remote client: `userJoined` and `userInfoUpdated`, if the user
   * joining the channel is in the communication(`0`) profile, or is a host
   * in the `1` (live streaming) profile.
   *
   * @note To ensure smooth communication, use the same parameter type to
   * identify the user. For example, if a user joins the channel with a user
   * ID, then ensure all the other users use the user ID too. The same applies
   * to the user account. If a user joins the channel with the Agora Web SDK,
   * ensure that the uid of the user is set to the same parameter type.
   * @param token The token generated at your server:
   * - In situations not requiring high security: You can use the temporary
   * token generated at Console. For details, see
   * [Get a temporary token](https://docs.agora.io/en/Agora%20Platform/token?platfor%20*%20m=All%20Platforms#get-a-temporary-token).
   * - In situations requiring high security: Set it as the token generated at
   * your server. For details, see
   * [Generate a token](https://docs.agora.io/en/Agora%20Platform/token?platfor%20*%20m=All%20Platforms#get-a-token).
   * @param userAccount The user account. The maximum length of this parameter
   * is 255 bytes. Ensure that you set this parameter and do not set it as
   * null. Supported character scopes are:
   * - All lowercase English letters: a to z.
   * - All uppercase English letters: A to Z.
   * - All numeric characters: 0 to 9.
   * - The space character.
   * - Punctuation characters and other symbols, including: "!", "#", "$",
   * "%", "&", "(", ")", "+", "-", ":", "", "<", "=", ".", ">", "?", "@",
   * "[", "]", "^", "_", " {", "}", "|", "~", ",".
   * @param options The channel media options, see
   * {@link ChannelMediaOptions}
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *  - `ERR_INVALID_ARGUMENT (2)`
   *  - `ERR_NOT_READY (3)`
   *  - `ERR_REFUSED (5)`
   */
  joinChannelWithUserAccount(
    token: string,
    userAccount: string,
    options: ChannelMediaOptions
  ): number {
    let param = {
      token,
      userAccount,
      options,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelJoinChannelWithUserAccount,
      JSON.stringify(param)
    );
    return ret.retCode;
  }

  /**
   * Gets the channel ID of the current `AgoraRtcChannel` object.
   *
   * @return
   * - The channel ID of the current `AgoraRtcChannel` object, if the method
   * call succeeds.
   * - The empty string "", if the method call fails.
   */
  channelId(): string {
    let param = {
      channelId: this._channelId,
    };
    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelChannelId,
      JSON.stringify(param)
    );
    return ret.result;
  }
  /**
   * Retrieves the current call ID.
   *
   * When a user joins a channel on a client, a `callId` is generated to
   * identify the call from the client. Feedback methods, such as
   * {@link AgoraRtcChannel.rate rate} and
   * {@link AgoraRtcChannel.complain complain}, must be called after the call
   * ends to submit feedback to the SDK.
   *
   * The `rate` and `complain` methods require the `callId` parameter retrieved
   * from the `getCallId` method during a call.
   *
   * @return
   * - The call ID, if the method call succeeds.
   * - The empty string "", if the method call fails.
   */
  getCallId(): string {
    let param = {
      channelId: this._channelId,
    };
    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelGetCallId,
      JSON.stringify(param)
    );
    return ret.result;
  }
  /**
   * Sets the role of the user.
   *
   * - This method can be used to set the user's role before the user joins a
   * channel in a live streaming.
   * - This method can be used to switch the user role in a live streaming after
   * the user joins a channel.
   *
   * In the `1` (live streaming) profile, when a user calls this method to switch
   * user roles after joining a channel, SDK triggers the follwoing callbacks:
   * - The local client: `clientRoleChanged` in the `AgoraRtcChannel`
   * interface.
   * - The remote clinet: `userjoined` or `userOffline`.
   *
   * @note This method applies only to the `1` (live streaming) profile.
   * @param role Sets the role of the user. See
   * {@link AgoraRtcChannel.role role}
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  setClientRole(role: CLIENT_ROLE_TYPE): number {
    let param = {
      role,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelSetClientRole,
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
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelSetClientRole,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Prioritizes a remote user's stream.
   *
   * Use this method with the
   * {@link setRemoteSubscribeFallbackOption} method.
   *
   * If the fallback function is enabled for a subscribed stream, the SDK
   * ensures the high-priority user gets the best possible stream quality.
   *
   * @note The Agora SDK supports setting `serPriority` as high for one user
   * only.
   * @param uid The ID of the remote user.
   * @param priority The priority of the remote user. See
   * {@link Priority}.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  setRemoteUserPriority(uid: number, userPriority: PRIORITY_TYPE): number {
    let param = {
      uid,
      userPriority,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelSetRemoteUserPriority,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Gets a new token when the current token expires after a period of time.
   *
   * The `token` expires after a period of time once the token schema is
   * enabled when the SDK triggers the `onTokenPrivilegeWillExpire` callback or
   * `CONNECTION_CHANGED_TOKEN_EXPIRED(9)` of `onConnectionStateChanged`
   * callback.
   *
   * You should call this method to renew `token`, or the SDK disconnects from
   * Agora' server.
   *
   * @param newtoken The new Token.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  renewToken(token: string): number {
    let param = {
      token,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelRenewToken,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * @deprecated This method is deprecated from v3.2.0. Use the
   * {@link enableEncryption} method instead.
   *
   * Enables built-in encryption with an encryption password before users
   * join a channel.
   *
   * All users in a channel must use the same encryption password. The
   * encryption password is automatically cleared once a user leaves the
   * channel. If an encryption password is not specified, the encryption
   * functionality will be disabled.
   *
   * @note
   * - Do not use this method for the CDN live streaming function.
   * - For optimal transmission, ensure that the encrypted data size does not
   * exceed the original data size + 16 bytes. 16 bytes is the maximum padding
   * size for AES encryption.
   *
   * @param secret The encryption password.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  setEncryptionSecret(secret: string): number {
    let param = {
      secret,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelSetEncryptionSecret,
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
   * The Agora SDK supports built-in encryption, which is set to the
   * `aes-128-xts` mode by default. To use other encryption modes, call this
   * method.
   *
   * All users in the same channel must use the same encryption mode and
   * password.
   *
   * Refer to the information related to the AES encryption algorithm on the
   * differences between the encryption modes.
   *
   * @note Call the {@link setEncryptionSecret} method before calling this
   * method.
   *
   * @param mode The set encryption mode:
   * - "aes-128-xts": (Default) 128-bit AES encryption, XTS mode.
   * - "aes-128-ecb": 128-bit AES encryption, ECB mode.
   * - "aes-256-xts": 256-bit AES encryption, XTS mode.
   * - "": When encryptionMode is set as NULL, the encryption mode is set as
   * "aes-128-xts" by default.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  setEncryptionMode(encryptionMode: string): number {
    let param = {
      encryptionMode,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelSetEncryptionMode,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Sets the sound position and gain of a remote user.
   *
   * When the local user calls this method to set the sound position of a
   * remote user, the sound difference between the left and right channels
   * allows the local user to track the real-time position of the remote user,
   * creating a real sense of space. This method applies to massively
   * multiplayer online games, such as Battle Royale games.
   *
   * @note
   * - For this method to work, enable stereo panning for remote users by
   * calling the {@link enableSoundPositionIndication} method before joining a
   * channel.
   * - This method requires hardware support. For the best sound positioning,
   * we recommend using a stereo speaker.
   * @param uid The ID of the remote user.
   * @param pan The sound position of the remote user. The value ranges from
   * -1.0 to 1.0:
   * - 0.0: The remote sound comes from the front.
   * - -1.0: The remote sound comes from the left.
   * - 1.0: The remote sound comes from the right.
   * @param gain Gain of the remote user. The value ranges from 0.0 to 100.0.
   * The default value is 100.0 (the original gain of the remote user). The
   * smaller the value, the less the gain.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  setRemoteVoicePosition(uid: number, pan: number, gain: number): number {
    let param = {
      uid,
      pan,
      gain,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelSetRemoteVoicePosition,
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
   *
   * @param mute Sets whether to receive/stop receiving all remote users'
   * audio streams by default:
   * - true:  Stop receiving all remote users' audio streams by default.
   * - false: (Default) Receive all remote users' audio streams by default.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  setDefaultMuteAllRemoteAudioStreams(mute: boolean): number {
    let param = {
      mute,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelSetDefaultMuteAllRemoteAudioStreams,
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
   * @param mute Sets whether to receive/stop receiving all remote users' video
   * streams by default:
   * - true: Stop receiving all remote users' video streams by default.
   * - false: (Default) Receive all remote users' video streams by default.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  setDefaultMuteAllRemoteVideoStreams(mute: boolean): number {
    let param = {
      mute,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelSetDefaultMuteAllRemoteVideoStreams,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Stops/Resumes receiving all remote users' audio streams.
   *
   * @param mute Sets whether to receive/stop receiving all remote users'
   * audio streams.
   * - true: Stop receiving all remote users' audio streams.
   * - false: (Default) Receive all remote users' audio streams.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  muteAllRemoteAudioStreams(mute: boolean): number {
    let param = {
      mute,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelMuteAllRemoteAudioStreams,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Stops/Resumes receiving a specified remote user's audio stream.
   *
   * If you called the {@link muteAllRemoteAudioStreams}(true) method to stop
   * receiving all remote users' audio streams, please call
   * the `muteAllRemoteAudioStreams`(false) method before calling the
   * `muteRemoteAudioStream` method.
   *
   * The `muteAllRemoteAudioStreams` method sets all remote audio streams,
   * while the `muteRemoteAudioStream` method sets a specified remote audio
   * stream.
   * @param uid The user ID of the specified remote user sending the audio.
   * @param mute Sets whether to receive/stop receiving a specified remote
   * user's audio stream:
   * - true: Stop receiving the specified remote user's audio stream.
   * - false: (Default) Receive the specified remote user's audio stream.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  muteRemoteAudioStream(userId: number, mute: boolean): number {
    let param = {
      userId,
      mute,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelMuteRemoteAudioStream,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Stops/Resumes receiving all video stream from a specified remote user.
   *
   * @param mute Sets whether to receive/stop receiving all remote users'
   * video streams:
   * - true: Stop receiving all remote users' video streams.
   * - false: (Default) Receive all remote users' video streams.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  muteAllRemoteVideoStreams(mute: boolean): number {
    let param = {
      mute,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelMuteAllRemoteVideoStreams,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Stops/Resumes receiving the video stream from a specified remote user.
   *
   * It you called the {@link muteAllRemoteVideoStreams}(true) to stop
   * receiving all remote video streams, please call the
   * `muteAllRemoteVideoStreams`(false) before calling `muteRemoteVideoStream`
   * method.
   * @param uid The user ID of the specified remote user.
   * @param mute Sets whether to stop/resume receiving the video stream from a
   * specified remote user:
   * - true: Stop receiving the specified remote user's video stream.
   * - false: (Default) Receive the specified remote user's video stream.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  muteRemoteVideoStream(userId: number, mute: boolean): number {
    let param = {
      userId,
      mute,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelMuteRemoteVideoStream,
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
   *
   * @param uid The ID of the remote user sending the video stream.
   * @param streamType The video-stream type. See {@link StreamType}
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  setRemoteVideoStreamType(
    userId: number,
    streamType: REMOTE_VIDEO_STREAM_TYPE
  ): number {
    let param = {
      userId,
      streamType,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelSetRemoteVideoStreamType,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Sets the default type of receiving video stream.
   *
   * Under limited network conditions, if the publisher has not disabled the
   * dual-stream mode using {@link enableDualStreamMode}(false), the receiver
   * can choose to receive either the high-video stream (the high resolution,
   * and high bitrate video stream) or the low-video stream (the low
   * resolution, and low bitrate video stream) by default.
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
   *
   * @param streamType The video-stream type. See {@link StreamType}
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  setRemoteDefaultVideoStreamType(
    streamType: REMOTE_VIDEO_STREAM_TYPE
  ): number {
    let param = {
      streamType,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelSetRemoteDefaultVideoStreamType,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Creates a data stream.
   *
   * Each user can create up to five data streams during the lifecycle of the
   * AgoraRtcChannel.
   *
   * @note Set both the `reliable` and `ordered` parameters to `true` or
   * `false`. Do not set one as `true` and the other as `false`.
   *
   * @param reliable Sets whether or not the recipients are guaranteed to
   * receive the data stream from the sender within five seconds:
   * - true: The recipients receive the data stream from the sender within five
   * seconds. If the recipient does not receive the data stream within five
   * seconds, an error is reported to the application.
   * - false: There is no guarantee that the recipients receive the data stream
   * within five seconds and no error message is reported for any delay or
   * missing data stream.
   * @param ordered Sets whether or not the recipients receive the data stream
   * in the sent order:
   * - true: The recipients receive the data stream in the sent order.
   * - false: The recipients do not receive the data stream in the sent order.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  createDataStream(reliable: boolean, ordered?: boolean): number {
    let param = {
      reliable,
      ordered,
      channelId: this._channelId,
    };

    const ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelCreateDataStream,
      JSON.stringify(param)
    );

    return ret.retCode;
  }
  createDataStreamWithConfig(config: DataStreamConfig): number {
    const ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelCreateDataStream,
      JSON.stringify(config)
    );

    return ret.retCode;
  }
  /**
   * Sends data stream messages to all users in the channel.
   *
   * The SDK has the following restrictions on this method:
   * - Up to 30 packets can be sent per second in a channel with each packet
   * having a maximum size of 1 kB.
   * - Each client can send up to 6 kB of data per second.
   * - Each user can have up to five data streams simultaneously.
   *
   * Ensure that you have created the data stream using
   * {@link createDataStream} before calling this method.
   *
   * If the method call succeeds, the remote user receives the `streamMessage`
   * callback; If the method call fails, the remote user receives the
   * `streamMessageError` callback.
   *
   * @note This method applies to the users in the communication(`0`) profile or the
   * hosts in the `1` (live streaming) profile. If an audience in the
   * `1` (live streaming) profile calls this method, the role of the audience may be
   * switched to the host.
   *
   * @param streamId he ID of the sent data stream, returned in the
   * {@link createDataStream} method.
   * @param msg The data stream messages.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  sendStreamMessage(streamId: number, msg: string): number {
    let param = {
      streamId,
      length: msg.length,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApiWithBuffer(
      ApiTypeChannel.kChannelSendStreamMessage,
      JSON.stringify(param),
      msg,
      msg.length
    );
    return ret.retCode;
  }
  /**
   * Publishes the local stream to a specified CDN URL address.
   *
   * In the `1` (live streaming) profile, the host can call this method to
   * publish the local stream to a specified CDN URL address, which is called
   * "Push Streams to CDN" or "CDN live streaming."
   *
   * During the CDN live streaming, the SDK triggers the
   * `rtmpStreamingStateChanged` callback is any streaming state changes.
   *
   * @note
   * - Only the host in the `1` (live streaming) profile can call this method.
   * - Call this method after the host joins the channel.
   * - Ensure that you enable the RTMP Converter service before using this
   * function. See *Prerequisites* in the *Push Streams to CDN* guide.
   * - This method adds only one stream RTMP URL address each time it is
   * called.
   *
   * @param url The CDN streaming URL in the RTMP format. The maximum length
   * of this parameter is 1024 bytes. The RTMP URL address must not contain
   * special characters, such as Chinese language characters.
   * @param transcodingEnabled Sets whether transcoding is enabled/disabled:
   * - true: Enable transcoding. To
   * [transcode](https://docs.agora.io/en/Agora%20Platform/terms?platform=All%20Platforms#transcoding)
   * the audio or video streams when publishing them to CDN live, often used
   * for combining the audio and video streams of multiple hosts in CDN live.
   * When you set this parameter as `true`, ensure that you call the
   * {@link setLiveTranscoding} method before this method.
   * - false: Disable transcoding.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   *  - `ERR_INVALID_ARGUMENT (2)`: The RTMP URL address is NULL or has a
   * string length of 0.
   *  - `ERR_NOT_INITIALIZED (7)`: You have not initialized `AgoraRtcChannel`
   * when publishing the stream.
   */
  addPublishStreamUrl(url: string, transcodingEnabled: boolean): number {
    let param = {
      url,
      transcodingEnabled,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelAddPublishStreamUrl,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Removes the RTMP stream from the CDN.
   *
   * This method removes the RTMP URL address (added by
   * {@link addPublishStreamUrl}) and stops the CDN live streaming.
   *
   * This method call triggers the `rtmpStreamingStateChanged` callback to
   * report the state of removing the URL address.
   *
   * @note
   * - Only the host in the `1` (live streaming) profile can call this
   * method.
   * - This method removes only one RTMP URL address each time it is
   * called.
   * - This method applies to the `1` (live streaming) profile only.
   * - Call this method after {@link addPublishStreamUrl}.
   * @param url The RTMP URL address to be removed. The maximum length of this
   * parameter is 1024 bytes. The RTMP URL address must not contain special
   * characters, such as Chinese language characters.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  removePublishStreamUrl(url: string): number {
    let param = {
      url,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelRemovePublishStreamUrl,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Sets the video layout and audio settings for CDN live.
   *
   * The SDK triggers the `transcodingUpdated` callback when you call this
   * method to **update** the transcoding setting. If you call this method for
   * the first time to **set** the transcoding setting, the SDK does not
   * trigger the `transcodingUpdated` callback.
   *
   * @note
   * - Only the host in the Live-broadcast porfile can call this method.
   * - Ensure that you enable the RTMP Converter service before using
   * this function. See *Prerequisites* in the *Push Streams to CDN* guide.
   * - If you call the {@link setLiveTranscoding} method to set the
   * LiveTranscoding class for the first time, the SDK does not trigger the
   * transcodingUpdated callback.
   * @param transcoding The transcoding setting for the audio and video streams
   * during the CDN live streaming. See {@link LiveTranscoding}
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  setLiveTranscoding(transcoding: LiveTranscoding): number {
    let param = {
      transcoding,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelSetLiveTranscoding,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Injects the online media stream to a live streaming.
   *
   * If this method call is successful, the server pulls the voice or video
   * stream and injects it into a live channel. And all audience members in the
   * channel can watch a live show and interact with each other.
   *
   * This method call triggers the following callbacks:
   * - The local client:
   *  - `streamInjectedStatus`, reports the injecting status.
   *  - `userJoined`(uid:666), reports the stream is injected successfully and
   * the UID of this stream is 666.
   * - The remote client:
   *  - `userJoined`(uid:666), reports the stream is injected successfully and
   * the UID of this stream is 666.
   *
   * @note
   * - Only the host in the `1` (live streaming) profile can call this method.
   * - Ensure that you enable the RTMP Converter service before using this
   * function. See *Prerequisites* in the *Push Streams to CDN* guide.
   * - This method applies to the `1` (live streaming) profile only.
   * - You can inject only one media stream into the channel at the same time.
   *
   * @param url The URL address to be added to the ongoing live streaming.
   * Valid protocols are RTMP, HLS, and HTTP-FLV.
   * - Supported audio codec type: AAC.
   * - Supported video codec type: H264 (AVC).
   * @param config The configuration of the injected stream.
   * See InjectStreamConfig
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   *  - ERR_INVALID_ARGUMENT (2): The injected URL does not exist. Call this
   * method again to inject the stream and ensure that the URL is valid.
   *  - ERR_NOT_READY (3): The user is not in the channel.
   *  - ERR_NOT_SUPPORTED (4): The channel profile is not live streaming.
   * Call the {@link setChannelProfile} method and set the channel profile to
   * live streaming before calling this method.
   *  - ERR_NOT_INITIALIZED (7): The SDK is not initialized. Ensure that the
   * `AgoraRtcChannel` object is initialized before calling this method.
   */
  addInjectStreamUrl(url: string, config: InjectStreamConfig): number {
    let param = {
      url,
      config,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelAddInjectStreamUrl,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Removes the injected the online media stream in a live streaming.
   *
   * This method removes the URL address (added by the
   * {@link addInjectStreamUrl} method) in a live streaming.
   *
   * If this method call is successful, the SDK triggers the `userOffline`
   * (uid:666) callback and report the UID of the removed stream is 666.
   *
   * @param url The URL address of the injected stream to be removed.
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  removeInjectStreamUrl(url: string): number {
    let param = {
      url,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelRemoveInjectStreamUrl,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Starts to relay media streams across channels.
   *
   * After a successful method call, the SDK triggers the
   * `channelMediaRelayState` and `channelMediaRelayEvent` callbacks, which
   * returns the state and event of the media stream relay.
   *
   * - If `channelMediaRelayState` returns the state code `2` and the error
   * code` 0`, and `channelMediaRelayEvent` returns the event code `4`, the
   * host starts sending data to the destination channel.
   * - If the `channelMediaRelayState` returns the state code `3`, an exception
   * occurs during the media stream relay.
   *
   * @note
   * - Contact sales-us@agora.io before implementing this function.
   * - Call this method after joining the channel.
   * - This method takes effect only when you are a host in a
   * live-broadcast channel.
   * - After a successful method call, if you want to call this method again,
   * ensure that you call the {@link stopChannelMediaRelay} method to quit the
   * current relay.
   * - We do not support string user accounts in this API.
   *
   * @param config The configuration of the media stream relay. See
   * ChannelMediaRelayConfiguration
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  startChannelMediaRelay(
    configuration: ChannelMediaRelayConfiguration
  ): number {
    let param = {
      configuration,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelStartChannelMediaRelay,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Updates the channels for media stream relay.
   *
   * After a successful {@link startChannelMediaRelay} method call, if you want
   * to relay the media stream to more channels, or leave the current relay
   * channel, you can call the `updateChannelMediaRelay` method.
   *
   * After a successful method call, the SDK triggers the
   * `channelMediaRelayEvent` callback with the event code `7`.
   *
   * @note Call this method after the {@link startChannelMediaRelay} method to
   * update the destination channel.
   * @param config The configuration of the media stream relay. See
   * ChannelMediaRelayConfiguration
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   */
  updateChannelMediaRelay(
    configuration: ChannelMediaRelayConfiguration
  ): number {
    let param = {
      configuration,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelUpdateChannelMediaRelay,
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
   * `channelMediaRelayState` callback. If the callback returns the state code
   * `0` and the error code `1`, the host successfully stops the relay.
   *
   * @note If the method call fails, the SDK triggers the
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
    let param = {
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelStopChannelMediaRelay,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Gets the connection state of the SDK.
   * @return {ConnectionState} Connect states. See {@link ConnectionState}.
   */
  getConnectionState(): CONNECTION_STATE_TYPE {
    let param = {
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelGetConnectionState,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Publishes the local stream to the channel.
   *
   * You must keep the following restrictions in mind when calling this method.
   * Otherwise, the SDK returns the `ERR_REFUSED (5)`:
   * - This method publishes one stream only to the channel corresponding to
   * the current `AgoraRtcChannel` object.
   * - In a live streaming channel, only a host can call this method.
   * To switch the client role, call {@link setClientRole} of the current
   * `AgoraRtcChannel` object.
   * - You can publish a stream to only one channel at a time. For details on
   * joining multiple channels, see the advanced guide *Join Multiple Channels*
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   *  - ERR_REFUSED (5): The method call is refused.
   */
  publish(): number {
    let param = {
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelPublish,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Stops publishing a stream to the channel.
   *
   * If you call this method in a channel where you are not publishing streams,
   * the SDK returns #ERR_REFUSED (5).
   *
   * @return
   * - 0: Success
   * - < 0: Failure
   *  - ERR_REFUSED (5): The method call is refused.
   */
  unpublish(): number {
    let param = {
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelUnPublish,
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
   * is in the Communication channel, or is a host in the Live streaming
   * profile.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  leaveChannel(): number {
    let param = {
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelLeaveChannel,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
  /**
   * Releases all AgoraRtcChannel resource
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   *  - `ERR_NOT_INITIALIZED (7)`: The SDK is not initialized before calling
   * this method.
   */
  release(): number {
    let param = {
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelRelease,
      JSON.stringify(param)
    );
    this._rtcChannel.Release();
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
  adjustUserPlaybackSignalVolume(userId: number, volume: number): number {
    let param = {
      userId,
      volume,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelAdjustUserPlaybackSignalVolume,
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
  unregisterMediaMetadataObserver(): number {
    let param = {
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelUnRegisterMediaMetadataObserver,
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
  registerMediaMetadataObserver(): number {
    let param = {
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelRegisterMediaMetadataObserver,
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
      uid: metadata.uid,
      size: metadata.size,
      timeStampMs: metadata.timeStampMs,
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApiWithBuffer(
      ApiTypeChannel.kChannelSendMetadata,
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
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelSetMaxMetadataSize,
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
   * encryption key. Once all users leave the channel, the encryption key
   * of this channel is automatically cleared.
   *
   * @note
   * - If you enable the built-in encryption, you cannot use the RTMP
   * or RTMPS streaming function.
   * - The SDK returns `-4` when the encryption mode is incorrect or the SDK
   * fails to load the external encryption library. Check the enumeration or
   * reload the external encryption library.
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
      channelId: this._channelId,
    };

    let ret = this._rtcChannel.CallApi(
      ApiTypeChannel.kChannelEnableEncryption,
      JSON.stringify(param)
    );
    return ret.retCode;
  }
}

export default AgoraRtcChannel;
