import {
  AudioAinsMode,
  ChannelProfileType,
  ClientRoleType,
  ErrorCodeType,
  IRtcEngineEventHandler,
  LocalAudioStats,
  LocalVideoStats,
  LocalVideoStreamReason,
  LocalVideoStreamState,
  QualityType,
  RemoteAudioStats,
  RemoteVideoStats,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
  VideoCanvas,
  VideoSourceType,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import React, { ReactElement } from 'react';

import {
  BaseComponent,
  BaseVideoComponentState,
} from '../../../components/BaseComponent';
import {
  AgoraButton,
  AgoraDropdown,
  AgoraSwitch,
  AgoraText,
  AgoraTextInput,
  AgoraView,
  RtcSurfaceView,
} from '../../../components/ui';
import Config from '../../../config/agora.config';
import { arrayToItems, enumToItems } from '../../../utils';
import { askMediaAccess } from '../../../utils/permissions';

interface State extends BaseVideoComponentState {
  selectedUser?: number;
  lastmileDelay?: number;
  videoSentBitrate?: number;
  encodedFrameWidth?: number;
  encodedFrameHeight?: number;
  encoderOutputFrameRate?: number;
  audioSentBitrate?: number;
  cpuAppUsage?: number;
  cpuTotalUsage?: number;
  txPacketLossRate?: number;
  enableAINSMode: boolean;
  AINSMode: AudioAinsMode;
  aec_linear_filter_type: number;
  aec_filter_length_ms: number;
  aec_delay_search_range_ms: number;
  aec_aggressiveness: number;
  remoteUserStatsList: Map<
    number,
    { remoteVideoStats: RemoteVideoStats; remoteAudioStats: RemoteAudioStats }
  >;
}

export default class JoinChannelVideo
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler
{
  protected createState(): State {
    return {
      appId: Config.appId,
      enableVideo: true,
      channelId: Config.channelId,
      token: Config.token,
      uid: Config.uid,
      joinChannelSuccess: false,
      remoteUsers: [],
      remoteUserStatsList: new Map(),
      encodedFrameWidth: 0,
      encodedFrameHeight: 0,
      encoderOutputFrameRate: 0,
      lastmileDelay: 0,
      videoSentBitrate: 0,
      audioSentBitrate: 0,
      cpuAppUsage: 0,
      cpuTotalUsage: 0,
      txPacketLossRate: 0,
      startPreview: false,
      enableAINSMode: true,
      AINSMode: AudioAinsMode.AinsModeBalanced,
      aec_linear_filter_type: 1,
      aec_filter_length_ms: 400,
      aec_delay_search_range_ms: 512,
      aec_aggressiveness: 2,
    };
  }

  /**
   * Step 1: initRtcEngine
   */
  protected async initRtcEngine() {
    const { appId } = this.state;
    if (!appId) {
      this.error(`appId is invalid`);
    }

    this.engine = createAgoraRtcEngine();
    this.engine.initialize({
      appId,
      logConfig: { filePath: Config.logFilePath },
      // Should use ChannelProfileLiveBroadcasting on most of cases
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });
    this.engine.registerEventHandler(this);

    // Need granted the microphone and camera permission
    await askMediaAccess(['microphone', 'camera']);

    // Need to enable video on this case
    // If you only call `enableAudio`, only relay the audio stream to the target channel
    this.engine.enableVideo();

    // Start preview before joinChannel
    this.engine.startPreview();
    this.setState({ startPreview: true });

    this.setAudioAINSMode();
  }

  /**
   * Step 2: joinChannel
   */
  protected joinChannel() {
    const { channelId, token, uid } = this.state;
    if (!channelId) {
      this.error('channelId is invalid');
      return;
    }
    if (uid < 0) {
      this.error('uid is invalid');
      return;
    }

    // start joining channel
    // 1. Users can only see each other after they join the
    // same channel successfully using the same app id.
    // 2. If app certificate is turned on at dashboard, token is needed
    // when joining channel. The channel name and uid used to calculate
    // the token has to match the ones used for channel join
    this.engine?.joinChannel(token, channelId, uid, {
      // Make myself as the broadcaster to send stream to remote
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    });
  }

  /**
   * Step 3: leaveChannel
   */
  protected leaveChannel() {
    this.engine?.leaveChannel();
  }

  /**
   * Step 4: releaseRtcEngine
   */
  protected releaseRtcEngine() {
    this.engine?.unregisterEventHandler(this);
    this.engine?.release();
  }

  onError(err: ErrorCodeType, msg: string) {
    super.onError(err, msg);
  }

  onJoinChannelSuccess(connection: RtcConnection, elapsed: number) {
    super.onJoinChannelSuccess(connection, elapsed);
  }

  onLeaveChannel(connection: RtcConnection, stats: RtcStats) {
    super.onLeaveChannel(connection, stats);
  }

  onUserJoined(connection: RtcConnection, remoteUid: number, elapsed: number) {
    super.onUserJoined(connection, remoteUid, elapsed);
  }

  onUserOffline(
    connection: RtcConnection,
    remoteUid: number,
    reason: UserOfflineReasonType
  ) {
    super.onUserOffline(connection, remoteUid, reason);
  }

  onVideoDeviceStateChanged(
    deviceId: string,
    deviceType: number,
    deviceState: number
  ) {
    this.info(
      'onVideoDeviceStateChanged',
      'deviceId',
      deviceId,
      'deviceType',
      deviceType,
      'deviceState',
      deviceState
    );
  }

  onLocalVideoStateChanged(
    source: VideoSourceType,
    state: LocalVideoStreamState,
    error: LocalVideoStreamReason
  ) {
    this.info(
      'onLocalVideoStateChanged',
      'source',
      source,
      'state',
      state,
      'error',
      error
    );
  }

  onRtcStats(connection: RtcConnection, stats: RtcStats): void {
    this.setState({
      lastmileDelay: stats.lastmileDelay,
      cpuAppUsage: stats.cpuAppUsage,
      cpuTotalUsage: stats.cpuTotalUsage,
      txPacketLossRate: stats.txPacketLossRate,
    });
  }

  onLocalVideoStats(connection: RtcConnection, stats: LocalVideoStats): void {
    this.setState({
      videoSentBitrate: stats.sentBitrate,
      encodedFrameWidth: stats.encodedFrameWidth,
      encodedFrameHeight: stats.encodedFrameHeight,
      encoderOutputFrameRate: stats.encoderOutputFrameRate,
    });
  }

  onLocalAudioStats(connection: RtcConnection, stats: LocalAudioStats): void {
    this.setState({
      audioSentBitrate: stats.sentBitrate,
    });
  }

  onRemoteVideoStats(connection: RtcConnection, stats: RemoteVideoStats): void {
    const { remoteUserStatsList } = this.state;
    if (stats.uid) {
      remoteUserStatsList.set(stats.uid, {
        remoteVideoStats: stats,
        remoteAudioStats:
          remoteUserStatsList.get(stats.uid)?.remoteAudioStats || {},
      });
    }
  }

  onRemoteAudioStats(connection: RtcConnection, stats: RemoteAudioStats): void {
    const { remoteUserStatsList } = this.state;
    if (stats.uid) {
      remoteUserStatsList.set(stats.uid, {
        remoteVideoStats:
          remoteUserStatsList.get(stats.uid)?.remoteVideoStats || {},
        remoteAudioStats: stats,
      });
    }
  }

  setAudioAINSMode = () => {
    const {
      enableAINSMode,
      AINSMode,
      aec_linear_filter_type,
      aec_filter_length_ms,
      aec_delay_search_range_ms,
    } = this.state;
    this.engine?.setParameters(
      JSON.stringify({
        'che.audio.aec.linear_filter_type': aec_linear_filter_type,
      })
    );
    this.engine?.setParameters(
      JSON.stringify({
        'che.audio.aec.filter.length.ms': aec_filter_length_ms,
      })
    );
    this.engine?.setParameters(
      JSON.stringify({
        'che.audio.aec.delay_search_range.ms': aec_delay_search_range_ms,
      })
    );
    this.engine?.setAINSMode(enableAINSMode, AINSMode);
  };

  setAecAggressiveness = () => {
    const { aec_aggressiveness } = this.state;
    this.engine?.setParameters(
      JSON.stringify({ 'che.audio.aec.aggressiveness': aec_aggressiveness })
    );
  };

  protected renderUsers(): ReactElement | undefined {
    return super.renderUsers();
  }

  protected renderVideo(user: VideoCanvas): ReactElement | undefined {
    const {
      joinChannelSuccess,
      encodedFrameWidth,
      encodedFrameHeight,
      encoderOutputFrameRate,
      remoteUserStatsList,
      lastmileDelay,
      videoSentBitrate,
      audioSentBitrate,
      cpuAppUsage,
      cpuTotalUsage,
      txPacketLossRate,
    } = this.state;
    return (
      <div className="video-view-container">
        <RtcSurfaceView canvas={user} />
        {joinChannelSuccess && user.sourceType === 0 && (
          <div className="status-bar">
            <p>
              {encodedFrameWidth}x{encodedFrameHeight},{encoderOutputFrameRate}
              fps
            </p>
            <p>LM Delay: {lastmileDelay}ms</p>
            <p>VSend: {videoSentBitrate}kbps</p>
            <p>ASend: {audioSentBitrate}kbps</p>
            <p>
              CPU: {cpuAppUsage}%/{cpuTotalUsage}%
            </p>
            <p>Send Loss: {txPacketLossRate}%</p>
          </div>
        )}
        {joinChannelSuccess && user.sourceType != 0 && user.uid && (
          <div className="status-bar">
            <p>
              VRecv:{' '}
              {
                remoteUserStatsList.get(user.uid)?.remoteVideoStats
                  .receivedBitrate
              }
              kbps
            </p>
            <p>
              ARecv:{' '}
              {
                remoteUserStatsList.get(user.uid)?.remoteAudioStats
                  .receivedBitrate
              }
              kbps
            </p>
            <p>
              VLoss:{' '}
              {
                remoteUserStatsList.get(user.uid)?.remoteVideoStats
                  .packetLossRate
              }
              %
            </p>
            <p>
              ALoss:{' '}
              {
                remoteUserStatsList.get(user.uid)?.remoteAudioStats
                  .audioLossRate
              }
              %
            </p>
            <p>
              AQuality:{' '}
              {
                QualityType[
                  remoteUserStatsList.get(user.uid)?.remoteAudioStats.quality!
                ]
              }
            </p>
          </div>
        )}
      </div>
    );
  }

  protected renderConfiguration(): ReactElement | undefined {
    const {
      joinChannelSuccess,
      remoteUsers,
      selectedUser,
      AINSMode,
      aec_linear_filter_type,
      aec_filter_length_ms,
      aec_delay_search_range_ms,
      enableAINSMode,
      aec_aggressiveness,
    } = this.state;
    return (
      <>
        <AgoraDropdown
          title={'AINSMode'}
          items={enumToItems(AudioAinsMode)}
          value={AINSMode}
          onValueChange={(value, index) => {
            this.setState({ AINSMode: value });
          }}
        />
        <AgoraText>aec_linear_filter_type:</AgoraText>
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              aec_linear_filter_type:
                text === '' ? this.createState().aec_linear_filter_type : +text,
            });
          }}
          numberKeyboard={true}
          title={`aec_linear_filter_type`}
          placeholder={`aec_linear_filter_type`}
          value={
            aec_linear_filter_type > 0 ? aec_linear_filter_type.toString() : ''
          }
        />
        <AgoraText>aec_filter_length_ms:</AgoraText>
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              aec_filter_length_ms:
                text === '' ? this.createState().aec_filter_length_ms : +text,
            });
          }}
          numberKeyboard={true}
          title={`aec_filter_length_ms`}
          placeholder={`aec_filter_length_ms`}
          value={
            aec_filter_length_ms > 0 ? aec_filter_length_ms.toString() : ''
          }
        />
        <AgoraText>aec_delay_search_range_ms:</AgoraText>
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              aec_delay_search_range_ms:
                text === ''
                  ? this.createState().aec_delay_search_range_ms
                  : +text,
            });
          }}
          numberKeyboard={true}
          title={`aec_delay_search_range_ms`}
          placeholder={`aec_delay_search_range_ms`}
          value={
            aec_delay_search_range_ms > 0
              ? aec_delay_search_range_ms.toString()
              : ''
          }
        />
        <AgoraSwitch
          title={'enableAINSMode'}
          value={enableAINSMode}
          onValueChange={(value) => {
            this.setState({ enableAINSMode: value });
          }}
        />
        <AgoraButton
          title={'setAudioAINSMode'}
          onPress={this.setAudioAINSMode}
        />
        <AgoraText>aec_aggressiveness:</AgoraText>
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              aec_aggressiveness:
                text === '' ? this.createState().aec_aggressiveness : +text,
            });
          }}
          numberKeyboard={true}
          title={`aec_aggressiveness`}
          placeholder={`aec_aggressiveness`}
          value={aec_aggressiveness > 0 ? aec_aggressiveness.toString() : ''}
        />
        <AgoraButton
          title={'setAecAggressiveness'}
          onPress={this.setAecAggressiveness}
        />
        {joinChannelSuccess ? (
          <>
            <AgoraDropdown
              title={'Append renderer to remote users'}
              items={arrayToItems(Array.from(new Set(remoteUsers)))}
              value={selectedUser}
              onValueChange={(value) => {
                this.setState({ selectedUser: value });
              }}
            />
            <AgoraView>
              <AgoraButton
                title="Add"
                onPress={() => {
                  if (selectedUser !== undefined) {
                    this.setState((prev) => {
                      return {
                        remoteUsers: [...prev.remoteUsers, selectedUser],
                      };
                    });
                  }
                }}
              />
              <AgoraButton
                title="Remove"
                onPress={() => {
                  if (selectedUser !== undefined) {
                    this.setState((prev) => {
                      const predicate = (it: number) => it === selectedUser;
                      const firstIndex = prev.remoteUsers.findIndex(predicate);
                      const lastIndex =
                        prev.remoteUsers.findLastIndex(predicate);
                      if (firstIndex !== lastIndex) {
                        prev.remoteUsers.splice(lastIndex, 1);
                      }
                      return {
                        remoteUsers: prev.remoteUsers,
                      };
                    });
                  }
                }}
              />
            </AgoraView>
          </>
        ) : undefined}
      </>
    );
  }
}
