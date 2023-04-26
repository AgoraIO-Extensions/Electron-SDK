import {
  ChannelProfileType,
  ClientRoleType,
  ErrorCodeType,
  IRtcEngineEventHandler,
  LocalAudioStreamError,
  LocalAudioStreamState,
  MediaDeviceType,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import React from 'react';

import {
  BaseAudioComponentState,
  BaseComponent,
} from '../../../components/BaseComponent';
import { AgoraButton, AgoraDivider, AgoraSlider } from '../../../components/ui';
import Config from '../../../config/agora.config';
import { askMediaAccess } from '../../../utils/permissions';

interface State extends BaseAudioComponentState {
  enableLocalAudio: boolean;
  muteLocalAudioStream: boolean;
  recordingSignalVolume: number;
  playbackSignalVolume: number;
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
      logConfig: { filePath: Config.SDKLogPath },
      // Should use ChannelProfileLiveBroadcasting on most of cases
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });
    this.engine.registerEventHandler(this);

    // Only need to enable audio on this case
    askMediaAccess(['microphone']);
    this.engine.enableAudio();
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
    error: LocalAudioStreamError
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

  protected renderConfiguration(): React.ReactNode {
    const { recordingSignalVolume, playbackSignalVolume } = this.state;
    return (
      <>
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

  protected renderAction(): React.ReactNode {
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
