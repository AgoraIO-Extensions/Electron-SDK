import {
  ChannelProfileType,
  ClientRoleType,
  ErrorCodeType,
  IRtcEngineEventHandler,
  LocalAudioStreamError,
  LocalAudioStreamState,
  LoopbackAudioTrackConfig,
  LoopbackAudioTrackType,
  MediaDeviceType,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import React, { ReactElement } from 'react';

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
  // Loopback audio track related states
  loopbackTrackId: number | null;
  loopbackAppName: string;
  loopbackVolume: number;
  loopbackType: LoopbackAudioTrackType;
  loopbackDeviceName: string;
  loopbackProcessId: number;
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
      // Loopback audio track related states
      loopbackTrackId: null,
      loopbackAppName: 'System Audio',
      loopbackVolume: 100,
      loopbackType: LoopbackAudioTrackType.LoopbackSystem,
      loopbackDeviceName: 'AgoraALD',
      loopbackProcessId: 0,
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

    this.engine?.setParameters('{"che.audio.loopback.enable_aec":false}');

    // Need granted the microphone permission
    await askMediaAccess(['microphone']);

    // Only need to enable audio on this case
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
      publishMicrophoneTrack: true,
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
   * 创建 Loopback 音频轨道
   */
  createLoopbackAudioTrack = () => {
    const {
      loopbackAppName,
      loopbackVolume,
      loopbackType,
      loopbackDeviceName,
      loopbackProcessId,
    } = this.state;

    // Validate processId is required
    if (
      loopbackType === LoopbackAudioTrackType.LoopbackProcess &&
      loopbackProcessId <= 0
    ) {
      this.error('Process ID cannot be empty or less than or equal to 0 in Process Loopback mode');
      return;
    }

    const config: LoopbackAudioTrackConfig = {
      appName: loopbackAppName,
      volume: loopbackVolume,
      loopbackType: loopbackType,
      deviceName: loopbackDeviceName,
      processId: loopbackProcessId,
    };

    try {
      const mediaEngine = this.engine?.getMediaEngine();
      if (mediaEngine) {
        const trackId = mediaEngine.createLoopbackAudioTrack(config);
        if (trackId >= 0) {
          this.setState({ loopbackTrackId: trackId });
          this.engine?.updateChannelMediaOptions({
            clientRoleType: ClientRoleType.ClientRoleBroadcaster,
            publishMicrophoneTrack: true,
            publishLoopbackAudioTrack: true,
            publishLoopbackAudioTrackId: trackId,
          });
          this.info(`Loopback audio track created successfully, Track ID: ${trackId}`);
        } else {
          this.error(`Failed to create Loopback audio track, error code: ${trackId}`);
        }
      } else {
        this.error('Unable to get MediaEngine instance');
      }
    } catch (error) {
      this.error(`Error occurred while creating Loopback audio track: ${error}`);
    }
  };

  /**
   * Destroy Loopback audio track
   */
  destroyLoopbackAudioTrack = () => {
    const { loopbackTrackId } = this.state;

    if (loopbackTrackId === null) {
      this.error('No Loopback audio track to destroy');
      return;
    }

    try {
      const mediaEngine = this.engine?.getMediaEngine();
      if (mediaEngine) {
        this.engine?.updateChannelMediaOptions({
          publishLoopbackAudioTrack: false,
          publishLoopbackAudioTrackId: loopbackTrackId,
        });

        const result = mediaEngine.destroyLoopbackAudioTrack(loopbackTrackId);
        if (result === 0) {
          this.setState({ loopbackTrackId: null });
          this.info(`Loopback audio track destroyed successfully, Track ID: ${loopbackTrackId}`);
        } else {
          this.error(`Failed to destroy Loopback audio track, error code: ${result}`);
        }
      } else {
        this.error('Unable to get MediaEngine instance');
      }
    } catch (error) {
      this.error(`Error occurred while destroying Loopback audio track: ${error}`);
    }
  };

  /**
   * Update Loopback audio track configuration
   */
  updateLoopbackAudioTrackConfig = () => {
    const {
      loopbackTrackId,
      loopbackAppName,
      loopbackVolume,
      loopbackType,
      loopbackDeviceName,
      loopbackProcessId,
    } = this.state;

    if (loopbackTrackId === null) {
      this.error('No Loopback audio track to update');
      return;
    }

    // Validate processId is required
    if (
      loopbackType === LoopbackAudioTrackType.LoopbackProcess &&
      loopbackProcessId <= 0
    ) {
      this.error('Process ID cannot be empty or less than or equal to 0 in Process Loopback mode');
      return;
    }

    const config: LoopbackAudioTrackConfig = {
      appName: loopbackAppName,
      volume: loopbackVolume,
      loopbackType: loopbackType,
      deviceName: loopbackDeviceName,
      processId: loopbackProcessId,
    };

    try {
      const mediaEngine = this.engine?.getMediaEngine();
      if (mediaEngine) {
        const result = mediaEngine.updateLoopbackAudioTrackConfig(
          loopbackTrackId,
          config
        );
        if (result === 0) {
          this.info(`Loopback audio track configuration updated successfully`);
        } else {
          this.error(`Failed to update Loopback audio track configuration, error code: ${result}`);
        }
      } else {
        this.error('Unable to get MediaEngine instance');
      }
    } catch (error) {
      this.error(`Error occurred while updating Loopback audio track configuration: ${error}`);
    }
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

  onAudioRoutingChanged(deviceType: number, routing: number) {
    this.info(
      'onAudioRoutingChanged',
      'deviceType',
      deviceType,
      'routing',
      routing
    );
  }

  protected renderConfiguration(): ReactElement | undefined {
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

        <AgoraDivider />
      </>
    );
  }

  protected renderAction(): ReactElement | undefined {
    const {
      enableLocalAudio,
      muteLocalAudioStream,
      loopbackTrackId,
      loopbackAppName,
      loopbackVolume,
      loopbackType,
      loopbackDeviceName,
      loopbackProcessId,
    } = this.state;

    // 判断是否应该显示 deviceName 输入框
    const shouldShowDeviceName =
      loopbackType === LoopbackAudioTrackType.LoopbackSystem ||
      loopbackType === LoopbackAudioTrackType.LoopbackSystemExcludeSelf;

    // 判断是否应该显示 processId 输入框
    const shouldShowProcessId =
      loopbackType === LoopbackAudioTrackType.LoopbackProcess;

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

        <AgoraDivider />
        <h3>Loopback Audio Track Configuration</h3>

        <div style={{ marginBottom: 10 }}>
          <label>App Name:</label>
          <input
            type="text"
            value={loopbackAppName}
            onChange={(e) => this.setState({ loopbackAppName: e.target.value })}
            style={{ marginLeft: 10, padding: 5, width: 200 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Volume:</label>
          <AgoraSlider
            title={`Volume ${loopbackVolume}`}
            minimumValue={0}
            maximumValue={400}
            step={1}
            value={loopbackVolume}
            onSlidingComplete={(value) => {
              this.setState({ loopbackVolume: value });
            }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Loopback Type:</label>
          <select
            value={loopbackType}
            onChange={(e) =>
              this.setState({ loopbackType: Number(e.target.value) })
            }
            style={{ marginLeft: 10, padding: 5 }}
          >
            <option value={LoopbackAudioTrackType.LoopbackSystem}>
              System Audio
            </option>
            <option value={LoopbackAudioTrackType.LoopbackSystemExcludeSelf}>
              System Audio (Exclude Self)
            </option>
            <option value={LoopbackAudioTrackType.LoopbackApplication}>
              Application Audio
            </option>
            <option value={LoopbackAudioTrackType.LoopbackProcess}>
              Process Audio
            </option>
          </select>
        </div>

        {shouldShowDeviceName && (
          <div style={{ marginBottom: 10 }}>
            <label>Device Name:</label>
            <input
              type="text"
              value={loopbackDeviceName}
              onChange={(e) =>
                this.setState({ loopbackDeviceName: e.target.value })
              }
              placeholder="Default: AgoraALD"
              style={{ marginLeft: 10, padding: 5, width: 200 }}
            />
          </div>
        )}

        {shouldShowProcessId && (
          <div style={{ marginBottom: 10 }}>
            <label>Process ID:</label>
            <input
              type="number"
              value={loopbackProcessId}
              onChange={(e) =>
                this.setState({ loopbackProcessId: Number(e.target.value) })
              }
              placeholder="Required"
              min="1"
              style={{ marginLeft: 10, padding: 5, width: 200 }}
            />
            <span style={{ color: 'red', marginLeft: 10 }}>* Required</span>
          </div>
        )}

        <div style={{ marginBottom: 10 }}>
          <span>
            Current Track ID: {loopbackTrackId !== null ? loopbackTrackId : 'None'}
          </span>
        </div>

        <AgoraButton
          title="Create Loopback Audio Track"
          onPress={this.createLoopbackAudioTrack}
          disabled={loopbackTrackId !== null}
        />

        <AgoraButton
          title="Destroy Loopback Audio Track"
          onPress={this.destroyLoopbackAudioTrack}
          disabled={loopbackTrackId === null}
        />

        <AgoraButton
          title="Update Loopback Audio Track Configuration"
          onPress={this.updateLoopbackAudioTrackConfig}
          disabled={loopbackTrackId === null}
        />

      </>
    );
  }
}
