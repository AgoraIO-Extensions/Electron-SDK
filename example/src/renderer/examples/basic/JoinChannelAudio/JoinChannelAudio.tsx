import {
  AudioAinsMode,
  AudioVolumeInfo,
  ChannelProfileType,
  ClientRoleType,
  ErrorCodeType,
  IRtcEngineEventHandler,
  LocalAudioStats,
  LocalAudioStreamReason,
  LocalAudioStreamState,
  MediaDeviceType,
  QualityType,
  RemoteAudioStats,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
  VideoCanvas,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import React, { ReactElement } from 'react';

import {
  BaseAudioComponentState,
  BaseComponent,
} from '../../../components/BaseComponent';
import {
  AgoraButton,
  AgoraCard,
  AgoraDivider,
  AgoraDropdown,
  AgoraSlider,
  AgoraSwitch,
  AgoraText,
  AgoraTextInput,
} from '../../../components/ui';
import Config from '../../../config/agora.config';
import { enumToItems } from '../../../utils';
import { askMediaAccess } from '../../../utils/permissions';

interface State extends BaseAudioComponentState {
  enableLocalAudio: boolean;
  muteLocalAudioStream: boolean;
  recordingSignalVolume: number;
  playbackSignalVolume: number;
  localVolume?: number;
  lastmileDelay?: number;
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
    { volume: number; remoteAudioStats: RemoteAudioStats }
  >;
}

export default class JoinChannelAudio
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler
{
  protected createState(): State {
    return {
      appId: Config.appId,
      enableVideo: false,
      channelId: Config.channelId,
      token: Config.token,
      uid: Config.uid,
      joinChannelSuccess: false,
      remoteUsers: [],
      enableLocalAudio: true,
      muteLocalAudioStream: false,
      recordingSignalVolume: 100,
      playbackSignalVolume: 100,
      remoteUserStatsList: new Map(),
      localVolume: 0,
      lastmileDelay: 0,
      audioSentBitrate: 0,
      cpuAppUsage: 0,
      cpuTotalUsage: 0,
      txPacketLossRate: 0,
      enableAINSMode: false,
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

    // Need granted the microphone permission
    await askMediaAccess(['microphone']);

    // Only need to enable audio on this case
    this.engine.enableAudio();
    this.engine.enableAudioVolumeIndication(200, 3, true);

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
   * Step 3-1-1 (Optional): enableLocalAudio
   */
  enableLocalAudio = () => {
    this.engine?.enableLocalAudio(true);
    this.setState({ enableLocalAudio: true });
  };

  /**
   * Step 3-1-2 (Optional): disableLocalAudio
   */
  disableLocalAudio = () => {
    this.engine?.enableLocalAudio(false);
    this.setState({ enableLocalAudio: false });
  };

  /**
   * Step 3-2-1 (Optional): muteLocalAudioStream
   */
  muteLocalAudioStream = () => {
    this.engine?.muteLocalAudioStream(true);
    this.setState({ muteLocalAudioStream: true });
  };

  /**
   * Step 3-2-2 (Optional): unmuteLocalAudioStream
   */
  unmuteLocalAudioStream = () => {
    this.engine?.muteLocalAudioStream(false);
    this.setState({ muteLocalAudioStream: false });
  };

  /**
   * Step 3-3 (Optional): adjustRecordingSignalVolume
   */
  adjustRecordingSignalVolume = () => {
    const { recordingSignalVolume } = this.state;
    this.engine?.adjustRecordingSignalVolume(recordingSignalVolume);
  };

  /**
   * Step 3-4 (Optional): adjustPlaybackSignalVolume
   */
  adjustPlaybackSignalVolume = () => {
    const { playbackSignalVolume } = this.state;
    this.engine?.adjustPlaybackSignalVolume(playbackSignalVolume);
  };

  /**
   * Step 4: leaveChannel
   */
  protected leaveChannel() {
    this.engine?.leaveChannel();
  }

  /**
   * Step 5: releaseRtcEngine
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

  onAudioDeviceStateChanged(
    deviceId: string,
    deviceType: number,
    deviceState: number
  ) {
    this.info(
      'onAudioDeviceStateChanged',
      'deviceId',
      deviceId,
      'deviceType',
      deviceType,
      'deviceState',
      deviceState
    );
  }

  onAudioDeviceVolumeChanged(
    deviceType: MediaDeviceType,
    volume: number,
    muted: boolean
  ) {
    this.info(
      'onAudioDeviceVolumeChanged',
      'deviceType',
      deviceType,
      'volume',
      volume,
      'muted',
      muted
    );
  }

  onLocalAudioStateChanged(
    connection: RtcConnection,
    state: LocalAudioStreamState,
    error: LocalAudioStreamReason
  ) {
    this.info(
      'onLocalAudioStateChanged',
      'connection',
      connection,
      'state',
      state,
      'error',
      error
    );
  }

  onAudioRoutingChanged(routing: number) {
    this.info('onAudioRoutingChanged', 'routing', routing);
  }

  onAudioVolumeIndication(
    connection: RtcConnection,
    speakers: AudioVolumeInfo[],
    speakerNumber: number,
    totalVolume: number
  ): void {
    speakers.map((speaker) => {
      if (speaker.uid === 0) {
        this.setState({ localVolume: speaker.volume });
      } else {
        if (!speaker.uid) return;
        const { remoteUserStatsList } = this.state;
        remoteUserStatsList.set(speaker.uid, {
          volume: speaker.volume!,
          remoteAudioStats:
            remoteUserStatsList.get(speaker.uid)?.remoteAudioStats || {},
        });
      }
    });
  }

  onRtcStats(connection: RtcConnection, stats: RtcStats): void {
    this.setState({
      lastmileDelay: stats.lastmileDelay,
      cpuAppUsage: stats.cpuAppUsage,
      cpuTotalUsage: stats.cpuTotalUsage,
      txPacketLossRate: stats.txPacketLossRate,
    });
  }

  onLocalAudioStats(connection: RtcConnection, stats: LocalAudioStats): void {
    this.setState({
      audioSentBitrate: stats.sentBitrate,
    });
  }

  onRemoteAudioStats(connection: RtcConnection, stats: RemoteAudioStats): void {
    const { remoteUserStatsList } = this.state;
    if (stats.uid) {
      remoteUserStatsList.set(stats.uid, {
        volume: remoteUserStatsList.get(stats.uid)?.volume || 0,
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

  protected renderUser(user: VideoCanvas): ReactElement | undefined {
    return (
      <AgoraCard
        key={`${user.uid} - ${user.sourceType}`}
        title={`${user.uid} - ${user.sourceType}`}
      >
        {this.renderVideo(user)}
      </AgoraCard>
    );
  }

  protected renderVideo(user: VideoCanvas): ReactElement | undefined {
    const {
      joinChannelSuccess,
      localVolume,
      lastmileDelay,
      audioSentBitrate,
      cpuAppUsage,
      cpuTotalUsage,
      txPacketLossRate,
      remoteUserStatsList,
    } = this.state;
    return (
      <>
        {joinChannelSuccess && user.sourceType === 0 && (
          <div className="status-bar">
            <p>Volume: {localVolume}</p>
            <p>LM Delay: {lastmileDelay}ms</p>
            <p>ASend: {audioSentBitrate}kbps</p>
            <p>
              CPU: {cpuAppUsage}%/{cpuTotalUsage}%
            </p>
            <p>Send Loss: {txPacketLossRate}%</p>
          </div>
        )}
        {joinChannelSuccess && user.sourceType != 0 && user.uid && (
          <div className="status-bar">
            <p>Volume: {remoteUserStatsList.get(user.uid)?.volume}</p>
            <p>
              ARecv:{' '}
              {
                remoteUserStatsList.get(user.uid)?.remoteAudioStats
                  .receivedBitrate
              }
              kbps
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
      </>
    );
  }

  protected renderConfiguration(): ReactElement | undefined {
    const {
      recordingSignalVolume,
      playbackSignalVolume,
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
        <AgoraSlider
          title={`recordingSignalVolume ${recordingSignalVolume}`}
          minimumValue={0}
          maximumValue={400}
          step={1}
          value={recordingSignalVolume}
          onSlidingComplete={(value) => {
            this.setState({ recordingSignalVolume: value });
          }}
        />
        <AgoraButton
          title={'adjust Recording Signal Volume'}
          onPress={this.adjustRecordingSignalVolume}
        />
        <AgoraDivider />
        <AgoraSlider
          title={`playbackSignalVolume ${playbackSignalVolume}`}
          minimumValue={0}
          maximumValue={400}
          step={1}
          value={playbackSignalVolume}
          onSlidingComplete={(value) => {
            this.setState({ playbackSignalVolume: value });
          }}
        />
        <AgoraButton
          title={'adjust Playback Signal Volume'}
          onPress={this.adjustPlaybackSignalVolume}
        />
      </>
    );
  }

  protected renderAction(): ReactElement | undefined {
    const { enableLocalAudio, muteLocalAudioStream } = this.state;
    return (
      <>
        <AgoraButton
          title={`${enableLocalAudio ? 'disable' : 'enable'} Local Audio`}
          onPress={
            enableLocalAudio ? this.disableLocalAudio : this.enableLocalAudio
          }
        />
        <AgoraButton
          title={`${
            muteLocalAudioStream ? 'unmute' : 'mute'
          } Local Audio Stream`}
          onPress={
            muteLocalAudioStream
              ? this.unmuteLocalAudioStream
              : this.muteLocalAudioStream
          }
        />
      </>
    );
  }
}
