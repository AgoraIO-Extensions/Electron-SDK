import {
  AREAS,
  AudienceLatencyLevelType,
  ChannelMediaRelayError,
  ChannelMediaRelayEvent,
  ChannelMediaRelayState,
  ClientRole,
  ConnectionDisconnectedReason,
  ConnectionState,
  EncryptionMode,
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  ILocalAudioTrack,
  ILocalTrack,
  ILocalVideoTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
  NetworkQuality,
  RemoteStreamFallbackType,
  RemoteStreamType,
  SDK_MODE,
  UID,
} from 'agora-rtc-sdk-ng';
import {
  AREA_CODE,
  AUDIENCE_LATENCY_LEVEL_TYPE,
  BeautyOptions,
  CHANNEL_MEDIA_RELAY_ERROR,
  CHANNEL_MEDIA_RELAY_EVENT,
  CHANNEL_MEDIA_RELAY_STATE,
  CHANNEL_PROFILE_TYPE,
  ChannelMediaOptions,
  ChannelMediaRelayConfiguration,
  CLIENT_ROLE_TYPE,
  ClientRoleOptions,
  CONNECTION_CHANGED_REASON_TYPE,
  CONNECTION_STATE_TYPE,
  ENCRYPTION_MODE,
  EncryptionConfig,
  ERROR_CODE_TYPE,
  INJECT_STREAM_STATUS,
  InjectStreamConfig,
  LiveTranscoding,
  LOG_LEVEL,
  QUALITY_TYPE,
  REMOTE_AUDIO_STATE,
  REMOTE_AUDIO_STATE_REASON,
  REMOTE_VIDEO_STATE,
  REMOTE_VIDEO_STATE_REASON,
  REMOTE_VIDEO_STREAM_TYPE,
  RENDER_MODE_TYPE,
  RtcEngineContext,
  RtcStats,
  RTMP_STREAM_PUBLISH_ERROR,
  RTMP_STREAM_PUBLISH_STATE,
  RTMP_STREAMING_EVENT,
  STREAM_FALLBACK_OPTIONS,
  USER_OFFLINE_REASON_TYPE,
  VIDEO_MIRROR_MODE_TYPE,
  VideoCanvas,
  VideoEncoderConfiguration,
} from './types.native';

function printf(tag: string, ...params: any[]) {
  console.log('agora-iris', tag, ...params);
}

namespace iris {
  const AgoraRTC = require('agora-rtc-sdk-ng');

  export class IrisEngine {
    _mode: SDK_MODE;
    _client?: IAgoraRTCClient;
    _appId?: string;
    handler?: (event: string) => {};
    _enableAudio: boolean;
    _enableVideo: boolean;
    _enableLocalAudio: boolean;
    _enableLocalVideo: boolean;
    _muteLocalAudio: boolean;
    _muteLocalVideo: boolean;
    _defaultMuteAllRemoteAudioStreams: boolean;
    _defaultMuteAllRemoteVideoStreams: boolean;
    _encryptionMode?:
      | 'aes-128-xts'
      | 'aes-256-xts'
      | 'aes-128-ecb'
      | 'sm4-128-ecb'
      | 'aes-128-gcm'
      | 'aes-256-gcm'
      | 'none';
    _secret?: string;
    _localAudioTrack?: ILocalAudioTrack;
    _localVideoTrack?: ILocalVideoTrack;
    _remoteAudioTracks: IRemoteAudioTrack[] = [];
    _remoteVideoTracks: IRemoteVideoTrack[] = [];

    constructor() {
      this._mode = 'rtc';
      this._enableAudio = true;
      this._enableVideo = false;
      this._enableLocalAudio = true;
      this._enableLocalVideo = true;
      this._muteLocalAudio = false;
      this._muteLocalVideo = false;
      this._defaultMuteAllRemoteAudioStreams = false;
      this._defaultMuteAllRemoteVideoStreams = false;
    }

    private _addListener() {
      if (this._client === undefined) {
        throw 'please create first';
      }
      this._client.on(
        'connection-state-change',
        (
          curState: ConnectionState,
          revState: ConnectionState,
          reason?: ConnectionDisconnectedReason
        ) => {
          printf('connection-state-change', curState, revState, revState);
          this._emitEvent('ConnectionStateChanged', [
            ConnectionStateToNative(curState),
            ConnectionDisconnectedReasonToNative(reason),
          ]);
        }
      );
      this._client.on('user-joined', (user: IAgoraRTCRemoteUser) => {
        printf('user-joined', user);
        this._emitEvent('UserJoined', [user.uid, 0]);
      });
      this._client.on(
        'user-left',
        (user: IAgoraRTCRemoteUser, reason: string) => {
          printf('user-left', user, reason);
          this._emitEvent('UserOffline', [
            user.uid,
            UserLeftReasonToNative(reason),
          ]);
        }
      );
      this._client.on(
        'user-published',
        async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
          printf('user-published', user, mediaType);
          switch (mediaType) {
            case 'audio':
              // TODO
              // emitEvent('AudioPublishStateChanged', []);
              await this.muteRemoteAudioStream({ uid: user, muted: false });
              this._emitEvent('RemoteAudioStateChanged', [
                user.uid,
                REMOTE_AUDIO_STATE.REMOTE_AUDIO_STATE_DECODING,
                REMOTE_AUDIO_STATE_REASON.REMOTE_AUDIO_REASON_REMOTE_UNMUTED,
                0,
              ]);
              break;
            case 'video':
              // TODO
              // emitEvent('VideoPublishStateChanged', []);
              await this.muteRemoteVideoStream({ uid: user, muted: false });
              this._emitEvent('RemoteVideoStateChanged', [
                user.uid,
                REMOTE_VIDEO_STATE.REMOTE_VIDEO_STATE_DECODING,
                REMOTE_VIDEO_STATE_REASON.REMOTE_VIDEO_STATE_REASON_REMOTE_UNMUTED,
                0,
              ]);
              break;
          }
        }
      );
      this._client.on(
        'user-unpublished',
        (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
          printf('user-unpublished', user, mediaType);
          switch (mediaType) {
            case 'audio':
              // TODO
              // emitEvent('AudioPublishStateChanged', []);
              this._remoteAudioTracks = this._remoteAudioTracks.filter(
                (track) => track.getUserId() !== user.uid
              );
              this._emitEvent('RemoteAudioStateChanged', [
                user.uid,
                REMOTE_AUDIO_STATE.REMOTE_AUDIO_STATE_STOPPED,
                REMOTE_AUDIO_STATE_REASON.REMOTE_AUDIO_REASON_REMOTE_MUTED,
                0,
              ]);
              break;
            case 'video':
              // TODO
              // emitEvent('VideoPublishStateChanged', []);
              this._remoteVideoTracks = this._remoteVideoTracks.filter(
                (track) => track.getUserId() !== user.uid
              );
              this._emitEvent('RemoteVideoStateChanged', [
                user.uid,
                REMOTE_VIDEO_STATE.REMOTE_VIDEO_STATE_STOPPED,
                REMOTE_VIDEO_STATE_REASON.REMOTE_VIDEO_STATE_REASON_REMOTE_MUTED,
                0,
              ]);
              break;
          }
        }
      );
      this._client.on(
        'user-info-updated',
        (
          uid: UID,
          msg:
            | 'mute-audio'
            | 'mute-video'
            | 'enable-local-video'
            | 'unmute-audio'
            | 'unmute-video'
            | 'disable-local-video'
        ) => {
          printf('user-info-updated', uid, msg);
          switch (msg) {
            case 'mute-audio':
              this._emitEvent('RemoteAudioStateChanged', [
                uid,
                REMOTE_AUDIO_STATE.REMOTE_AUDIO_STATE_STOPPED,
                REMOTE_AUDIO_STATE_REASON.REMOTE_AUDIO_REASON_REMOTE_MUTED,
                0,
              ]);
              break;
            case 'mute-video':
            case 'disable-local-video':
              this._emitEvent('RemoteVideoStateChanged', [
                uid,
                REMOTE_VIDEO_STATE.REMOTE_VIDEO_STATE_STOPPED,
                REMOTE_VIDEO_STATE_REASON.REMOTE_VIDEO_STATE_REASON_REMOTE_MUTED,
                0,
              ]);
              break;
            case 'unmute-audio':
              this._emitEvent('RemoteAudioStateChanged', [
                uid,
                REMOTE_AUDIO_STATE.REMOTE_AUDIO_STATE_DECODING,
                REMOTE_AUDIO_STATE_REASON.REMOTE_AUDIO_REASON_REMOTE_UNMUTED,
                0,
              ]);
              break;
            case 'unmute-video':
            case 'enable-local-video':
              this._emitEvent('RemoteVideoStateChanged', [
                uid,
                REMOTE_VIDEO_STATE.REMOTE_VIDEO_STATE_DECODING,
                REMOTE_VIDEO_STATE_REASON.REMOTE_VIDEO_STATE_REASON_REMOTE_UNMUTED,
                0,
              ]);
              break;
          }
        }
      );
      this._client.on('media-reconnect-start', (uid: UID) => {
        printf('media-reconnect-start', uid);
      });
      this._client.on('media-reconnect-end', (uid: UID) => {
        printf('media-reconnect-end', uid);
      });
      this._client.on(
        'stream-type-changed',
        (uid: UID, streamType: RemoteStreamType) => {
          printf('stream-type-changed', uid, streamType);
        }
      );
      this._client.on(
        'stream-fallback',
        (uid: UID, isFallbackOrRecover: 'fallback' | 'recover') => {
          printf('stream-fallback', uid, isFallbackOrRecover);
          this._emitEvent('RemoteSubscribeFallbackToAudioOnly', [
            uid,
            isFallbackOrRecover === 'fallback',
          ]);
        }
      );
      this._client.on(
        'channel-media-relay-state',
        (state: ChannelMediaRelayState, code: ChannelMediaRelayError) => {
          printf('channel-media-relay-state', state, code);
          this._emitEvent('ChannelMediaRelayStateChanged', [
            ChannelMediaRelayStateToNative(state),
            ChannelMediaRelayErrorToNative(code),
          ]);
        }
      );
      this._client.on(
        'channel-media-relay-event',
        (event: ChannelMediaRelayEvent) => {
          printf('channel-media-relay-event', event);
          this._emitEvent('ChannelMediaRelayEvent', [
            ChannelMediaRelayEventToNative(event),
          ]);
        }
      );
      this._client.on(
        'volume-indicator',
        (
          result: {
            level: number;
            uid: UID;
          }[]
        ) => {
          printf('volume-indicator', result);
          let totalVolume = 0;
          const speakers = result.map((value) => {
            totalVolume += value.level;
            return { uid: value.uid, volume: value.level };
          });
          this._emitEvent('AudioVolumeIndication', [speakers, totalVolume]);
        }
      );
      this._client.on('crypt-error', () => {
        printf('crypt-error');
      });
      this._client.on('token-privilege-will-expire', () => {
        printf('token-privilege-will-expire');
        this._emitEvent('TokenPrivilegeWillExpire', []);
      });
      this._client.on('token-privilege-did-expire', () => {
        printf('token-privilege-did-expire');
      });
      this._client.on('network-quality', (stats: NetworkQuality) => {
        printf('network-quality', stats);
        this._emitEvent('NetworkQuality', [
          0,
          NetworkQualityToNative(stats.uplinkNetworkQuality),
          NetworkQualityToNative(stats.downlinkNetworkQuality),
        ]);
      });
      this._client.on(
        'live-streaming-error',
        (url: string, err: { code: string }) => {
          printf('live-streaming-error', url, err);
          this._emitEvent('RtmpStreamingStateChanged', [
            url,
            RTMP_STREAM_PUBLISH_STATE.RTMP_STREAM_PUBLISH_STATE_IDLE,
            RtmpStreamingErrorToNative(err.code),
          ]);
        }
      );
      this._client.on(
        'live-streaming-warning',
        (url: string, warning: { code: string }) => {
          printf('live-streaming-warning', url, warning);
          if (warning.code === 'LIVE_STREAMING_WARN_FAILED_LOAD_IMAGE') {
            this._emitEvent('RtmpStreamingEvent', [
              url,
              RTMP_STREAMING_EVENT.RTMP_STREAMING_EVENT_FAILED_LOAD_IMAGE,
            ]);
          } else {
            this._emitEvent('RtmpStreamingStateChanged', [
              url,
              RTMP_STREAM_PUBLISH_STATE.RTMP_STREAM_PUBLISH_STATE_IDLE,
              RtmpStreamingErrorToNative(warning.code),
            ]);
          }
        }
      );
      this._client.on(
        'stream-inject-status',
        (status: number, uid: UID, url: string) => {
          printf('stream-inject-status', status, uid, url);
          this._emitEvent('StreamInjectedStatus', [
            url,
            uid,
            InjectStreamEventStatusToNative(status),
          ]);
        }
      );
      this._client.on(
        'exception',
        (event: { code: number; msg: string; uid: UID }) => {
          printf('exception', event);
          if (event.code in ERROR_CODE_TYPE) {
            this._emitEvent('Error', [event.code]);
          }
        }
      );
      this._client.on('is-using-cloud-proxy', (isUsingProxy: boolean) => {
        printf('is-using-cloud-proxy', isUsingProxy);
      });
    }

    private _emitEvent(methodName: string, data: any[]) {
      printf('_emitEvent', methodName, data, this.handler);
      this.handler?.call(
        this,
        JSON.stringify({
          methodName,
          data,
        })
      );
    }

    private _createClient() {
      this._client = AgoraRTC.createClient({ codec: 'h264', mode: this._mode });
      this._addListener();
    }

    private async _createMicrophoneAudioTrack() {
      if (!this._enableAudio) {
        printf('_createMicrophoneAudioTrack', this._enableAudio);
        return;
      }
      if (this._localAudioTrack === undefined) {
        this._localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      }
    }

    private async _createCameraVideoTrack() {
      if (!this._enableVideo) {
        printf('_createCameraVideoTrack', this._enableVideo);
        return;
      }
      if (this._localVideoTrack === undefined) {
        this._localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      }
    }

    private async _createScreenVideoTrack() {
      if (!this._enableVideo) {
        printf('_createScreenVideoTrack', this._enableVideo);
        return;
      }
      if (this._localVideoTrack === undefined) {
        this._localVideoTrack = await AgoraRTC.createScreenVideoTrack(
          {},
          'disable'
        );
      }
    }

    private async _publish() {
      if (this._client === undefined) {
        throw 'please create first';
      }
      const tracks: ILocalTrack[] = [];
      if (this._localAudioTrack !== undefined) {
        if (!this._muteLocalAudio) {
          tracks.push(this._localAudioTrack);
        }
      }
      if (this._localVideoTrack !== undefined) {
        if (!this._muteLocalVideo) {
          tracks.push(this._localVideoTrack);
        }
      }
      await this._client.publish(tracks);
    }

    public async getSdkVersion(): Promise<string> {
      return AgoraRTC.VERSION;
    }

    public async create(params: {
      config: RtcEngineContext;
      appType: number;
    }): Promise<void> {
      this._appId = params.config.appId;
      await this.setArea(params.config.areaCode);
      await this.setLogLevel({ level: params.config.logConfig?.level });
      await this.setAppType({ appType: params.appType });
      this._createClient();
    }

    public async destroy(): Promise<void> {
      await this.leaveChannel({});
      this._localAudioTrack?.close();
      this._localAudioTrack = undefined;
      this._localVideoTrack?.close();
      this._localVideoTrack = undefined;
      this._client = undefined;
      this._appId = undefined;
      this.handler = undefined;
    }

    public async setChannelProfile(params: {
      profile: CHANNEL_PROFILE_TYPE;
    }): Promise<void> {
      let mode: SDK_MODE | undefined;
      switch (params.profile) {
        case CHANNEL_PROFILE_TYPE.CHANNEL_PROFILE_COMMUNICATION:
          mode = 'rtc';
          break;
        case CHANNEL_PROFILE_TYPE.CHANNEL_PROFILE_LIVE_BROADCASTING:
          mode = 'live';
          break;
        case CHANNEL_PROFILE_TYPE.CHANNEL_PROFILE_GAME:
          break;
      }
      if (mode !== undefined && mode !== this._mode) {
        this._mode = mode;
        this._createClient();
      }
    }

    public async setClientRole(params: {
      role: CLIENT_ROLE_TYPE;
      options?: ClientRoleOptions;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      let role: ClientRole;
      switch (params.role) {
        case CLIENT_ROLE_TYPE.CLIENT_ROLE_BROADCASTER:
          role = 'host';
          break;
        case CLIENT_ROLE_TYPE.CLIENT_ROLE_AUDIENCE:
          role = 'audience';
          break;
      }
      let level: AudienceLatencyLevelType | undefined;
      switch (params.options?.audienceLatencyLevel) {
        case AUDIENCE_LATENCY_LEVEL_TYPE.AUDIENCE_LATENCY_LEVEL_LOW_LATENCY:
          level = AudienceLatencyLevelType.AUDIENCE_LEVEL_LOW_LATENCY;
          break;
        case AUDIENCE_LATENCY_LEVEL_TYPE.AUDIENCE_LATENCY_LEVEL_ULTRA_LOW_LATENCY:
          level = AudienceLatencyLevelType.AUDIENCE_LEVEL_ULTRA_LOW_LATENCY;
          break;
      }
      return this._client.setClientRole(role, level ? { level } : undefined);
    }

    public async joinChannel(params: {
      token: string | null;
      channelName: string;
      optionalInfo?: string;
      optionalUid?: number | string;
      options?: ChannelMediaOptions;
    }): Promise<void> {
      if (this._appId === undefined) {
        throw 'please create first';
      }
      const { channelName, token, optionalUid } = params;
      return this._client
        ?.join(this._appId, channelName, token, optionalUid)
        .then(async (uid) => {
          await this._createMicrophoneAudioTrack();
          await this._createCameraVideoTrack();
          await this._publish();
          this._emitEvent('JoinChannelSuccess', [channelName, uid, 0]);
        });
    }

    public async leaveChannel(_: {}): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      return this._client.leave().then(() => {
        this._remoteAudioTracks = [];
        this._remoteVideoTracks = [];
        let stats: RtcStats = {
          cpuAppUsage: 0,
          cpuTotalUsage: 0,
          duration: 0,
          gatewayRtt: 0,
          lastmileDelay: 0,
          memoryAppUsageInKbytes: 0,
          memoryAppUsageRatio: 0,
          memoryTotalUsageRatio: 0,
          rxAudioBytes: 0,
          rxAudioKBitRate: 0,
          rxBytes: 0,
          rxKBitRate: 0,
          rxPacketLossRate: 0,
          rxVideoBytes: 0,
          rxVideoKBitRate: 0,
          txAudioBytes: 0,
          txAudioKBitRate: 0,
          txBytes: 0,
          txKBitRate: 0,
          txPacketLossRate: 0,
          txVideoBytes: 0,
          txVideoKBitRate: 0,
          userCount: 0,
        };
        const res = this._client?.getRTCStats();
        if (res) {
          stats.duration = res.Duration;
          stats.rxKBitRate = res.RecvBitrate;
          stats.rxBytes = res.RecvBytes;
          stats.txKBitRate = res.SendBitrate;
          stats.txBytes = res.SendBytes;
          stats.userCount = res.UserCount;
          stats.gatewayRtt = res.RTT;
          // stats. = res.OutgoingAvailableBandwidth;
        }
        this._emitEvent('LeaveChannel', [stats]);
      });
    }

    public async renewToken(params: { token: string }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      return this._client.renewToken(params.token);
    }

    public async getConnectionState(_: {}): Promise<CONNECTION_STATE_TYPE> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      return ConnectionStateToNative(this._client.connectionState);
    }

    public async setLogFilter(params: { filter: LOG_LEVEL }): Promise<void> {
      return this.setLogLevel({ level: params.filter });
    }

    public async setParameters(params: { parameters: string }): Promise<void> {
      const obj = JSON.parse(params.parameters);
      const key = Object.keys(obj)[0];
      return AgoraRTC.setParameter(key, obj[key]);
    }

    public async joinChannelWithUserAccount(params: {
      token: string | null;
      channelName: string;
      userAccount: string;
      options?: ChannelMediaOptions;
    }): Promise<void> {
      if (this._appId === undefined) {
        throw 'please create first';
      }
      const { channelName, token, userAccount } = params;
      return this._client
        ?.join(this._appId, channelName, token, userAccount)
        .then(async (uid) => {
          await this._createMicrophoneAudioTrack();
          await this._createCameraVideoTrack();
          await this._publish();
          this._emitEvent('JoinChannelSuccess', [channelName, uid, 0]);
        });
    }

    public async adjustPlaybackSignalVolume(params: {
      volume: number;
    }): Promise<void> {
      await Promise.all(
        this._remoteAudioTracks.map((track) => {
          return track.setVolume(params.volume);
        })
      );
    }

    public async adjustRecordingSignalVolume(params: {
      volume: number;
    }): Promise<void> {
      return this._localAudioTrack?.setVolume(params.volume);
    }

    public async adjustUserPlaybackSignalVolume(params: {
      uid: number;
      volume: number;
    }): Promise<void> {
      await Promise.all(
        this._remoteAudioTracks.map((track) => {
          if (track.getUserId() === params.uid) {
            return track.setVolume(params.volume);
          }
        })
      );
    }

    public async disableAudio(_: {}): Promise<void> {
      this._enableAudio = false;
      await Promise.all([
        this.enableLocalAudio({ enabled: false }),
        // TODO
        this._remoteAudioTracks.map((track) => {
          return track.stop();
        }),
      ]);
    }

    public async enableAudio(_: {}): Promise<void> {
      this._enableAudio = true;
      await Promise.all([
        this.enableLocalAudio({ enabled: true }),
        // TODO
        this._remoteAudioTracks.map((track) => {
          return track.play();
        }),
      ]);
    }

    public async enableAudioVolumeIndication(_: {
      interval: number;
      smooth: number;
      report_vad: number;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      return this._client.enableAudioVolumeIndicator();
    }

    public async enableLocalAudio(params: { enabled: boolean }): Promise<void> {
      return this._localAudioTrack?.setEnabled(params.enabled);
    }

    public async muteAllRemoteAudioStreams(params: {
      muted: boolean;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      await Promise.all(
        this._client.remoteUsers.map((user) => {
          return this.muteRemoteAudioStream({ uid: user, muted: params.muted });
        })
      );
    }

    public async muteLocalAudioStream(params: {
      muted: boolean;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      this._muteLocalAudio = params.muted;
      if (this._localAudioTrack === undefined) {
        throw 'localAudioTrack not init';
      }
      if (params.muted) {
        return this._client.unpublish(this._localAudioTrack);
      } else {
        return this._client.publish(this._localAudioTrack);
      }
    }

    public async muteRemoteAudioStream(params: {
      uid: number | IAgoraRTCRemoteUser;
      muted: boolean;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      const muteRemoteAudioStream = async (
        user: IAgoraRTCRemoteUser
      ): Promise<void> => {
        if (this._client === undefined) {
          throw 'please create first';
        }
        if (!params.muted) {
          return this._client.subscribe(user, 'audio').then((track) => {
            track.on('first-frame-decoded', () => {
              printf('first-frame-decoded', 'audio', track);
              this._emitEvent('RemoteAudioStateChanged', [
                user.uid,
                REMOTE_AUDIO_STATE.REMOTE_AUDIO_STATE_STARTING,
                REMOTE_AUDIO_STATE_REASON.REMOTE_AUDIO_REASON_REMOTE_UNMUTED,
                0,
              ]);
            });
            this._remoteAudioTracks.push(track);
          });
        } else {
          return this._client.unsubscribe(user, 'audio').then(() => {
            this._remoteAudioTracks = this._remoteAudioTracks.filter(
              (track) => track.getUserId() !== user.uid
            );
          });
        }
      };
      if (typeof params.uid === 'number') {
        await Promise.all(
          this._client.remoteUsers.map((user) => {
            if (user.uid === params.uid) {
              return muteRemoteAudioStream(user);
            }
          })
        );
      } else {
        return muteRemoteAudioStream(params.uid);
      }
    }

    public async setDefaultMuteAllRemoteAudioStreams(params: {
      muted: boolean;
    }): Promise<void> {
      this._defaultMuteAllRemoteAudioStreams = params.muted;
    }

    public async disableVideo(_: {}): Promise<void> {
      this._enableVideo = false;
      await Promise.all([
        this.enableLocalVideo({ enabled: false }),
        // TODO
        this._remoteVideoTracks.map((track) => {
          return track.stop();
        }),
      ]);
    }

    public async enableLocalVideo(params: { enabled: boolean }): Promise<void> {
      await this._localVideoTrack?.setEnabled(params.enabled);
    }

    public async enableVideo(_: {}): Promise<void> {
      this._enableVideo = true;
      await Promise.all([
        this.enableLocalVideo({ enabled: true }),
        // TODO
        this._remoteVideoTracks.map((track) => {
          return track.play('');
        }),
      ]);
    }

    public async muteAllRemoteVideoStreams(params: {
      muted: boolean;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      await Promise.all(
        this._client.remoteUsers.map((user) => {
          return this.muteRemoteVideoStream({ uid: user, muted: params.muted });
        })
      );
    }

    public async muteLocalVideoStream(params: {
      muted: boolean;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      this._muteLocalVideo = params.muted;
      if (this._localVideoTrack === undefined) {
        throw 'localVideoTrack not init';
      }
      if (!params.muted) {
        return this._client.publish(this._localVideoTrack);
      } else {
        return this._client.unpublish(this._localVideoTrack);
      }
    }

    public async muteRemoteVideoStream(params: {
      uid: number | IAgoraRTCRemoteUser;
      muted: boolean;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      const muteRemoteVideoStream = async (
        user: IAgoraRTCRemoteUser
      ): Promise<void> => {
        if (this._client === undefined) {
          throw 'please create first';
        }
        if (!params.muted) {
          return this._client.subscribe(user, 'video').then((track) => {
            track.on('first-frame-decoded', () => {
              printf('first-frame-decoded', 'video', track);
              this._emitEvent('RemoteVideoStateChanged', [
                user.uid,
                REMOTE_VIDEO_STATE.REMOTE_VIDEO_STATE_STARTING,
                REMOTE_VIDEO_STATE_REASON.REMOTE_VIDEO_STATE_REASON_REMOTE_UNMUTED,
                0,
              ]);
            });
            this._remoteVideoTracks.push(track);
          });
        } else {
          return this._client.unsubscribe(user, 'video').then(() => {
            this._remoteVideoTracks = this._remoteVideoTracks.filter(
              (track) => track.getUserId() !== user.uid
            );
          });
        }
      };
      if (typeof params.uid === 'number') {
        await Promise.all(
          this._client.remoteUsers.map((user) => {
            if (user.uid === params.uid) {
              return muteRemoteVideoStream(user);
            }
          })
        );
      } else {
        return muteRemoteVideoStream(params.uid);
      }
    }

    public async setBeautyEffectOptions(params: {
      enabled: boolean;
      options: BeautyOptions;
    }): Promise<void> {
      const func = (this._localVideoTrack as ICameraVideoTrack | undefined)
        ?.setBeautyEffect;
      if (func !== undefined) {
        await func(params.enabled, {
          smoothnessLevel: params.options.smoothnessLevel,
          lighteningLevel: params.options.lighteningLevel,
          rednessLevel: params.options.rednessLevel,
          lighteningContrastLevel: params.options.lighteningContrastLevel,
        });
      }
    }

    public async setDefaultMuteAllRemoteVideoStreams(params: {
      muted: boolean;
    }): Promise<void> {
      this._defaultMuteAllRemoteVideoStreams = params.muted;
    }

    public async setVideoEncoderConfiguration(params: {
      config: VideoEncoderConfiguration;
    }): Promise<void> {
      const func = (this._localVideoTrack as ICameraVideoTrack | undefined)
        ?.setEncoderConfiguration;
      if (func !== undefined) {
        await func({
          width: params.config.dimensions.width,
          height: params.config.dimensions.height,
          frameRate: params.config.frameRate,
          bitrateMin: params.config.minBitrate,
          bitrateMax: params.config.bitrate,
        });
      }
    }

    public async startPreview(_: {}): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      if (!this._enableVideo) return;
      if (this._client.channelName !== undefined) return;
      await this._createCameraVideoTrack();
    }

    public async stopPreview(_: {}): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      if (this._client.channelName !== undefined) return;
      if (this._localVideoTrack !== undefined) {
        await this._localVideoTrack.close();
        this._localVideoTrack = undefined;
      }
    }

    public async addInjectStreamUrl(params: {
      url: string;
      config: InjectStreamConfig;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      return this._client.addInjectStreamUrl(params.url, {
        audioBitrate: params.config.audioBitrate,
        audioChannels: params.config.audioChannels,
        audioSampleRate: params.config.audioSampleRate,
        height: params.config.height,
        width: params.config.width,
        videoBitrate: params.config.videoBitrate,
        videoFramerate: params.config.videoFramerate,
        videoGop: params.config.videoGop,
      });
    }

    public async addPublishStreamUrl(params: {
      url: string;
      transcodingEnabled: boolean;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      return this._client.startLiveStreaming(
        params.url,
        params.transcodingEnabled
      );
    }

    public async enableDualStreamMode(params: {
      enabled: boolean;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      if (params.enabled) {
        return this._client.enableDualStream();
      } else {
        return this._client.disableDualStream();
      }
    }

    public async removeInjectStreamUrl(_: { url: string }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      return this._client.removeInjectStreamUrl();
    }

    public async removePublishStreamUrl(params: {
      url: string;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      return this._client.stopLiveStreaming(params.url);
    }

    public async setEncryptionMode(params: {
      encryptionMode:
        | 'aes-128-xts'
        | 'aes-256-xts'
        | 'aes-128-ecb'
        | 'sm4-128-ecb'
        | 'aes-128-gcm'
        | 'aes-256-gcm'
        | 'none';
    }): Promise<void> {
      this._encryptionMode = params.encryptionMode;
      if (this._client === undefined) {
        throw 'please create first';
      }
      if (this._encryptionMode && this._secret) {
        return this._client.setEncryptionConfig(
          this._encryptionMode,
          this._secret
        );
      } else {
        return this._client.setEncryptionConfig('none', '');
      }
    }

    public async setEncryptionSecret(params: {
      secret: string;
    }): Promise<void> {
      this._secret = params.secret;
      if (this._client === undefined) {
        throw 'please create first';
      }
      if (this._encryptionMode && this._secret) {
        return this._client.setEncryptionConfig(
          this._encryptionMode,
          this._secret
        );
      } else {
        return this._client.setEncryptionConfig('none', '');
      }
    }

    public async setLiveTranscoding(params: {
      transcoding: LiveTranscoding;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      return this._client.setLiveTranscoding({
        audioBitrate: params.transcoding.audioBitrate,
        audioChannels: params.transcoding.audioChannels,
        audioSampleRate: params.transcoding.audioSampleRate,
        backgroundColor: params.transcoding.backgroundColor,
        height: params.transcoding.height,
        width: params.transcoding.width,
        lowLatency: params.transcoding.lowLatency,
        videoBitrate: params.transcoding.videoBitrate,
        videoCodecProfile: params.transcoding.videoCodecProfile,
        videoFrameRate: params.transcoding.videoFramerate,
        videoGop: params.transcoding.videoGop,
        watermark: params.transcoding.watermark,
        backgroundImage: params.transcoding.backgroundImage,
        transcodingUsers: params.transcoding.transcodingUsers,
        userConfigExtraInfo: params.transcoding.transcodingExtraInfo,
      });
    }

    public async setRemoteDefaultVideoStreamType(params: {
      streamType: REMOTE_VIDEO_STREAM_TYPE;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      await Promise.all(
        this._client.remoteUsers.map((user) => {
          // TODO
          return this.setRemoteVideoStreamType({
            uid: user.uid,
            streamType: params.streamType,
          });
        })
      );
    }

    public async setRemoteSubscribeFallbackOption(params: {
      option: STREAM_FALLBACK_OPTIONS;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      await Promise.all(
        this._client.remoteUsers.map((user) => {
          let option: RemoteStreamFallbackType;
          switch (params.option) {
            case STREAM_FALLBACK_OPTIONS.STREAM_FALLBACK_OPTION_DISABLED:
              option = RemoteStreamFallbackType.DISABLE;
              break;
            case STREAM_FALLBACK_OPTIONS.STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW:
              option = RemoteStreamFallbackType.LOW_STREAM;
              break;
            case STREAM_FALLBACK_OPTIONS.STREAM_FALLBACK_OPTION_AUDIO_ONLY:
              option = RemoteStreamFallbackType.AUDIO_ONLY;
              break;
          }
          return this._client?.setStreamFallbackOption(user.uid, option);
        })
      );
    }

    public async setRemoteVideoStreamType(params: {
      uid: UID;
      streamType: REMOTE_VIDEO_STREAM_TYPE;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      let streamType: RemoteStreamType;
      switch (params.streamType) {
        case REMOTE_VIDEO_STREAM_TYPE.REMOTE_VIDEO_STREAM_HIGH:
          streamType = RemoteStreamType.HIGH_STREAM;
          break;
        case REMOTE_VIDEO_STREAM_TYPE.REMOTE_VIDEO_STREAM_LOW:
          streamType = RemoteStreamType.LOW_STREAM;
          break;
      }
      await this._client.setRemoteVideoStreamType(params.uid, streamType);
    }

    public async startChannelMediaRelay(params: {
      channelMediaRelayConfiguration: ChannelMediaRelayConfiguration;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      const config = AgoraRTC.createChannelMediaRelayConfiguration();
      config?.setSrcChannelInfo(params.channelMediaRelayConfiguration.srcInfo);
      params.channelMediaRelayConfiguration.destInfos.map((info) => {
        config?.addDestChannelInfo(info);
      });
      return this._client.startChannelMediaRelay(config);
    }

    public async stopChannelMediaRelay(_: {}): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      return this._client.stopChannelMediaRelay();
    }

    public async updateChannelMediaRelay(params: {
      channelMediaRelayConfiguration: ChannelMediaRelayConfiguration;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      const config = AgoraRTC.createChannelMediaRelayConfiguration();
      config?.setSrcChannelInfo(params.channelMediaRelayConfiguration.srcInfo);
      params.channelMediaRelayConfiguration.destInfos.map((info) => {
        config?.addDestChannelInfo(info);
      });
      return this._client.updateChannelMediaRelay(config);
    }

    public async enableEncryption(params: {
      enabled: boolean;
      config: EncryptionConfig;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      let encryptionMode: EncryptionMode;
      if (params.enabled) {
        switch (params.config.encryptionMode) {
          case ENCRYPTION_MODE.AES_128_XTS:
            encryptionMode = 'aes-128-xts';
            break;
          case ENCRYPTION_MODE.AES_128_ECB:
            encryptionMode = 'aes-128-ecb';
            break;
          case ENCRYPTION_MODE.AES_256_XTS:
            encryptionMode = 'aes-256-xts';
            break;
          case ENCRYPTION_MODE.SM4_128_ECB:
            encryptionMode = 'sm4-128-ecb';
            break;
          case ENCRYPTION_MODE.AES_128_GCM:
            encryptionMode = 'aes-128-gcm';
            break;
          case ENCRYPTION_MODE.AES_256_GCM:
            encryptionMode = 'aes-256-gcm';
            break;
          case ENCRYPTION_MODE.MODE_END:
            encryptionMode = 'none';
            break;
        }
      } else {
        encryptionMode = 'none';
      }
      return this._client.setEncryptionConfig(
        encryptionMode,
        params.config.encryptionKey ?? ''
      );
    }

    public async sendCustomReportMessage(params: {
      id: string;
      category: string;
      event: string;
      label: string;
      value: number;
    }): Promise<void> {
      if (this._client === undefined) {
        throw 'please create first';
      }
      await this._client.sendCustomReportMessage({
        category: params.id,
        event: params.category,
        label: params.event,
        reportId: params.label,
        value: params.value,
      });
    }

    public async setupLocalVideo(
      params: { canvas: VideoCanvas },
      element?: HTMLElement
    ): Promise<void> {
      let fit: 'cover' | 'contain' | 'fill';
      switch (params.canvas.renderMode) {
        case RENDER_MODE_TYPE.RENDER_MODE_HIDDEN:
          fit = 'cover';
          break;
        case RENDER_MODE_TYPE.RENDER_MODE_FIT:
          fit = 'contain';
          break;
        case RENDER_MODE_TYPE.RENDER_MODE_ADAPTIVE:
          fit = 'cover';
          break;
        case RENDER_MODE_TYPE.RENDER_MODE_FILL:
          fit = 'fill';
          break;
      }
      this._localVideoTrack?.play(element ?? params.canvas.view, {
        mirror:
          params.canvas.mirrorMode ===
          VIDEO_MIRROR_MODE_TYPE.VIDEO_MIRROR_MODE_ENABLED,
        fit,
      });
    }

    public async setupRemoteVideo(
      params: { canvas: VideoCanvas },
      element?: HTMLElement
    ): Promise<void> {
      await Promise.all(
        this._remoteVideoTracks.map((track) => {
          if (track.getUserId() === params.canvas.uid) {
            printf('setupRemoteVideo', track, params, element);
            let fit: 'cover' | 'contain' | 'fill';
            switch (params.canvas.renderMode) {
              case RENDER_MODE_TYPE.RENDER_MODE_HIDDEN:
                fit = 'cover';
                break;
              case RENDER_MODE_TYPE.RENDER_MODE_FIT:
                fit = 'contain';
                break;
              case RENDER_MODE_TYPE.RENDER_MODE_ADAPTIVE:
                fit = 'cover';
                break;
              case RENDER_MODE_TYPE.RENDER_MODE_FILL:
                fit = 'fill';
                break;
            }
            track.play(element ?? params.canvas.view, {
              mirror:
                params.canvas.mirrorMode ===
                VIDEO_MIRROR_MODE_TYPE.VIDEO_MIRROR_MODE_ENABLED,
              fit,
            });
          }
        })
      );
    }

    public async uploadLogFile(): Promise<string> {
      // TODO
      return AgoraRTC.enableLogUpload();
    }

    public async setLogLevel(params: { level?: LOG_LEVEL }): Promise<void> {
      if (params.level !== undefined) {
        let logLevel: number = 0;
        switch (params.level) {
          case LOG_LEVEL.LOG_LEVEL_NONE:
            logLevel = 4;
            break;
          case LOG_LEVEL.LOG_LEVEL_INFO:
            logLevel = 1;
            break;
          case LOG_LEVEL.LOG_LEVEL_WARN:
            logLevel = 2;
            break;
          case LOG_LEVEL.LOG_LEVEL_ERROR:
          case LOG_LEVEL.LOG_LEVEL_FATAL:
            logLevel = 3;
            break;
        }
        return AgoraRTC.setLogLevel(logLevel);
      }
    }

    public async setArea(code?: AREA_CODE): Promise<void> {
      if (code !== undefined) {
        let areaCode: AREAS = AREAS.GLOBAL;
        switch (code) {
          case AREA_CODE.AREA_CODE_CN:
            areaCode = AREAS.CHINA;
            break;
          case AREA_CODE.AREA_CODE_NA:
            areaCode = AREAS.NORTH_AMERICA;
            break;
          case AREA_CODE.AREA_CODE_EU:
            areaCode = AREAS.EUROPE;
            break;
          case AREA_CODE.AREA_CODE_AS:
            areaCode = AREAS.ASIA;
            break;
          case AREA_CODE.AREA_CODE_JP:
            areaCode = AREAS.JAPAN;
            break;
          case AREA_CODE.AREA_CODE_IN:
            areaCode = AREAS.INDIA;
            break;
          case AREA_CODE.AREA_CODE_GLOB:
            areaCode = AREAS.GLOBAL;
            break;
        }
        return AgoraRTC.setArea([areaCode]);
      }
    }

    public async setAppType(params: { appType: number }): Promise<void> {
      // @ts-ignore
      return AgoraRTC.setParameter(
        'REPORT_APP_SCENARIO',
        params.appType.toString()
      );
    }
  }

  function ConnectionStateToNative(
    state?: ConnectionState
  ): CONNECTION_STATE_TYPE {
    switch (state) {
      case 'DISCONNECTED':
        return CONNECTION_STATE_TYPE.CONNECTION_STATE_DISCONNECTED;
      case 'CONNECTING':
        return CONNECTION_STATE_TYPE.CONNECTION_STATE_CONNECTING;
      case 'RECONNECTING':
        return CONNECTION_STATE_TYPE.CONNECTION_STATE_RECONNECTING;
      case 'CONNECTED':
        return CONNECTION_STATE_TYPE.CONNECTION_STATE_CONNECTED;
      case 'DISCONNECTING':
      default:
        return CONNECTION_STATE_TYPE.CONNECTION_STATE_DISCONNECTED;
    }
  }

  function ConnectionDisconnectedReasonToNative(
    reason?: ConnectionDisconnectedReason
  ): CONNECTION_CHANGED_REASON_TYPE {
    switch (reason) {
      case ConnectionDisconnectedReason.LEAVE:
        return CONNECTION_CHANGED_REASON_TYPE.CONNECTION_CHANGED_LEAVE_CHANNEL;
      case ConnectionDisconnectedReason.NETWORK_ERROR:
      case ConnectionDisconnectedReason.SERVER_ERROR:
        return CONNECTION_CHANGED_REASON_TYPE.CONNECTION_CHANGED_INTERRUPTED;
      case ConnectionDisconnectedReason.UID_BANNED:
        return CONNECTION_CHANGED_REASON_TYPE.CONNECTION_CHANGED_REJECTED_BY_SERVER;
      case ConnectionDisconnectedReason.IP_BANNED:
      case ConnectionDisconnectedReason.CHANNEL_BANNED:
        return CONNECTION_CHANGED_REASON_TYPE.CONNECTION_CHANGED_BANNED_BY_SERVER;
      default:
        return CONNECTION_CHANGED_REASON_TYPE.CONNECTION_CHANGED_JOIN_SUCCESS;
    }
  }

  function UserLeftReasonToNative(reason?: string): USER_OFFLINE_REASON_TYPE {
    switch (reason) {
      case 'Quit':
        return USER_OFFLINE_REASON_TYPE.USER_OFFLINE_QUIT;
      case 'ServerTimeOut':
        return USER_OFFLINE_REASON_TYPE.USER_OFFLINE_DROPPED;
      case 'BecomeAudience':
        return USER_OFFLINE_REASON_TYPE.USER_OFFLINE_BECOME_AUDIENCE;
      default:
        return USER_OFFLINE_REASON_TYPE.USER_OFFLINE_QUIT;
    }
  }

  function NetworkQualityToNative(
    quality: 0 | 1 | 2 | 3 | 4 | 5 | 6
  ): QUALITY_TYPE {
    switch (quality) {
      case 0:
        return QUALITY_TYPE.QUALITY_UNKNOWN;
      case 1:
        return QUALITY_TYPE.QUALITY_EXCELLENT;
      case 2:
        return QUALITY_TYPE.QUALITY_GOOD;
      case 3:
        return QUALITY_TYPE.QUALITY_POOR;
      case 4:
        return QUALITY_TYPE.QUALITY_BAD;
      case 5:
        return QUALITY_TYPE.QUALITY_VBAD;
      case 6:
        return QUALITY_TYPE.QUALITY_DOWN;
    }
  }

  function RtmpStreamingErrorToNative(code: string): RTMP_STREAM_PUBLISH_ERROR {
    switch (code) {
      case 'LIVE_STREAMING_INVALID_ARGUMENT':
        return RTMP_STREAM_PUBLISH_ERROR.RTMP_STREAM_PUBLISH_ERROR_INVALID_ARGUMENT;
      case 'LIVE_STREAMING_INTERNAL_SERVER_ERROR':
        return RTMP_STREAM_PUBLISH_ERROR.RTMP_STREAM_PUBLISH_ERROR_INTERNAL_SERVER_ERROR;
      case 'LIVE_STREAMING_PUBLISH_STREAM_NOT_AUTHORIZED':
        return RTMP_STREAM_PUBLISH_ERROR.RTMP_STREAM_PUBLISH_ERROR_NOT_AUTHORIZED;
      case 'LIVE_STREAMING_TRANSCODING_NOT_SUPPORTED':
        return RTMP_STREAM_PUBLISH_ERROR.RTMP_STREAM_PUBLISH_ERROR_FORMAT_NOT_SUPPORTED;
      case 'LIVE_STREAMING_CDN_ERROR':
        return RTMP_STREAM_PUBLISH_ERROR.RTMP_STREAM_PUBLISH_ERROR_RTMP_SERVER_ERROR;
      case 'LIVE_STREAMING_INVALID_RAW_STREAM':
        return RTMP_STREAM_PUBLISH_ERROR.RTMP_STREAM_PUBLISH_ERROR_CONNECTION_TIMEOUT;
      case 'LIVE_STREAMING_WARN_STREAM_NUM_REACH_LIMIT':
        return RTMP_STREAM_PUBLISH_ERROR.RTMP_STREAM_PUBLISH_ERROR_REACH_LIMIT;
      case 'LIVE_STREAMING_WARN_FREQUENT_REQUEST':
        return RTMP_STREAM_PUBLISH_ERROR.RTMP_STREAM_PUBLISH_ERROR_TOO_OFTEN;
      default:
        return RTMP_STREAM_PUBLISH_ERROR.RTMP_STREAM_PUBLISH_ERROR_OK;
    }
  }

  function InjectStreamEventStatusToNative(
    status: number
  ): INJECT_STREAM_STATUS {
    switch (status) {
      case 0:
        return INJECT_STREAM_STATUS.INJECT_STREAM_STATUS_START_SUCCESS;
      case 1:
        return INJECT_STREAM_STATUS.INJECT_STREAM_STATUS_START_ALREADY_EXISTS;
      case 2:
        return INJECT_STREAM_STATUS.INJECT_STREAM_STATUS_START_UNAUTHORIZED;
      case 3:
        return INJECT_STREAM_STATUS.INJECT_STREAM_STATUS_START_TIMEDOUT;
      case 4:
        return INJECT_STREAM_STATUS.INJECT_STREAM_STATUS_START_FAILED;
      case 5:
        return INJECT_STREAM_STATUS.INJECT_STREAM_STATUS_STOP_SUCCESS;
      case 6:
        return INJECT_STREAM_STATUS.INJECT_STREAM_STATUS_STOP_NOT_FOUND;
      case 7:
        return INJECT_STREAM_STATUS.INJECT_STREAM_STATUS_STOP_UNAUTHORIZED;
      case 8:
        return INJECT_STREAM_STATUS.INJECT_STREAM_STATUS_STOP_TIMEDOUT;
      case 9:
        return INJECT_STREAM_STATUS.INJECT_STREAM_STATUS_STOP_FAILED;
      case 10:
        return INJECT_STREAM_STATUS.INJECT_STREAM_STATUS_BROKEN;
      default:
        return INJECT_STREAM_STATUS.INJECT_STREAM_STATUS_START_UNAUTHORIZED;
    }
  }

  function ChannelMediaRelayStateToNative(
    state: ChannelMediaRelayState
  ): CHANNEL_MEDIA_RELAY_STATE {
    switch (state) {
      case ChannelMediaRelayState.RELAY_STATE_IDLE:
        return CHANNEL_MEDIA_RELAY_STATE.RELAY_STATE_IDLE;
      case ChannelMediaRelayState.RELAY_STATE_CONNECTING:
        return CHANNEL_MEDIA_RELAY_STATE.RELAY_STATE_CONNECTING;
      case ChannelMediaRelayState.RELAY_STATE_RUNNING:
        return CHANNEL_MEDIA_RELAY_STATE.RELAY_STATE_RUNNING;
      case ChannelMediaRelayState.RELAY_STATE_FAILURE:
        return CHANNEL_MEDIA_RELAY_STATE.RELAY_STATE_FAILURE;
    }
  }

  function ChannelMediaRelayErrorToNative(
    error: ChannelMediaRelayError
  ): CHANNEL_MEDIA_RELAY_ERROR {
    switch (error) {
      case ChannelMediaRelayError.RELAY_OK:
        return CHANNEL_MEDIA_RELAY_ERROR.RELAY_OK;
      case ChannelMediaRelayError.SERVER_CONNECTION_LOST:
        return CHANNEL_MEDIA_RELAY_ERROR.RELAY_ERROR_SERVER_CONNECTION_LOST;
      case ChannelMediaRelayError.SRC_TOKEN_EXPIRED:
        return CHANNEL_MEDIA_RELAY_ERROR.RELAY_ERROR_SRC_TOKEN_EXPIRED;
      case ChannelMediaRelayError.DEST_TOKEN_EXPIRED:
        return CHANNEL_MEDIA_RELAY_ERROR.RELAY_ERROR_DEST_TOKEN_EXPIRED;
    }
  }

  function ChannelMediaRelayEventToNative(
    event: ChannelMediaRelayEvent
  ): CHANNEL_MEDIA_RELAY_EVENT {
    switch (event) {
      case ChannelMediaRelayEvent.NETWORK_DISCONNECTED:
        return CHANNEL_MEDIA_RELAY_EVENT.RELAY_EVENT_NETWORK_DISCONNECTED;
      case ChannelMediaRelayEvent.NETWORK_CONNECTED:
        return CHANNEL_MEDIA_RELAY_EVENT.RELAY_EVENT_NETWORK_CONNECTED;
      case ChannelMediaRelayEvent.PACKET_JOINED_SRC_CHANNEL:
        return CHANNEL_MEDIA_RELAY_EVENT.RELAY_EVENT_PACKET_JOINED_SRC_CHANNEL;
      case ChannelMediaRelayEvent.PACKET_JOINED_DEST_CHANNEL:
        return CHANNEL_MEDIA_RELAY_EVENT.RELAY_EVENT_PACKET_JOINED_DEST_CHANNEL;
      case ChannelMediaRelayEvent.PACKET_SENT_TO_DEST_CHANNEL:
        return CHANNEL_MEDIA_RELAY_EVENT.RELAY_EVENT_PACKET_SENT_TO_DEST_CHANNEL;
      case ChannelMediaRelayEvent.PACKET_RECEIVED_VIDEO_FROM_SRC:
        return CHANNEL_MEDIA_RELAY_EVENT.RELAY_EVENT_PACKET_RECEIVED_VIDEO_FROM_SRC;
      case ChannelMediaRelayEvent.PACKET_RECEIVED_AUDIO_FROM_SRC:
        return CHANNEL_MEDIA_RELAY_EVENT.RELAY_EVENT_PACKET_RECEIVED_AUDIO_FROM_SRC;
      case ChannelMediaRelayEvent.PACKET_UPDATE_DEST_CHANNEL:
        return CHANNEL_MEDIA_RELAY_EVENT.RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL;
      case ChannelMediaRelayEvent.PACKET_UPDATE_DEST_CHANNEL_REFUSED:
        return CHANNEL_MEDIA_RELAY_EVENT.RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_REFUSED;
      case ChannelMediaRelayEvent.PACKET_UPDATE_DEST_CHANNEL_NOT_CHANGE:
        return CHANNEL_MEDIA_RELAY_EVENT.RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_NOT_CHANGE;
    }
  }
}

const engine: iris.IrisEngine = new iris.IrisEngine();

export async function callApi(
  apiType: string,
  params: string,
  extra?: any
): Promise<void> {
  printf('callApi', apiType, params, extra, engine);
  return engine[apiType]?.call(engine, JSON.parse(params), extra);
}

export function setEventHandler(handler: (event: string) => {}) {
  engine.handler = handler;
}
