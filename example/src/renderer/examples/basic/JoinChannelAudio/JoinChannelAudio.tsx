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
  // Loopback 音频轨道相关状态
  loopbackTrackId: number | null;
  loopbackAppName: string;
  loopbackVolume: number;
  loopbackType: LoopbackAudioTrackType;
  // 系统 Loopback 录制相关状态
  systemLoopbackEnabled: boolean;
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
      // Loopback 音频轨道相关状态
      loopbackTrackId: null,
      loopbackAppName: 'System Audio',
      loopbackVolume: 100,
      loopbackType: LoopbackAudioTrackType.LoopbackSystem,
      // 系统 Loopback 录制相关状态
      systemLoopbackEnabled: false,
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

    this.engine?.setParameters('{"che.audio.loopback.use_standalone":false}');
    this.engine?.setParameters('{"che.audio.loopback.enable_aec":true}');

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
    const { loopbackAppName, loopbackVolume, loopbackType } = this.state;

    const config: LoopbackAudioTrackConfig = {
      appName: loopbackAppName,
      volume: loopbackVolume,
      loopbackType: loopbackType,
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
          this.info(`Loopback 音频轨道创建成功，Track ID: ${trackId}`);
        } else {
          this.error(`Loopback 音频轨道创建失败，错误码: ${trackId}`);
        }
      } else {
        this.error('无法获取 MediaEngine 实例');
      }
    } catch (error) {
      this.error(`创建 Loopback 音频轨道时发生错误: ${error}`);
    }
  };

  /**
   * 销毁 Loopback 音频轨道
   */
  destroyLoopbackAudioTrack = () => {
    const { loopbackTrackId } = this.state;

    if (loopbackTrackId === null) {
      this.error('没有可销毁的 Loopback 音频轨道');
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
          this.info(`Loopback 音频轨道销毁成功，Track ID: ${loopbackTrackId}`);
        } else {
          this.error(`Loopback 音频轨道销毁失败，错误码: ${result}`);
        }
      } else {
        this.error('无法获取 MediaEngine 实例');
      }
    } catch (error) {
      this.error(`销毁 Loopback 音频轨道时发生错误: ${error}`);
    }
  };

  /**
   * 更新 Loopback 音频轨道配置
   */
  updateLoopbackAudioTrackConfig = () => {
    const { loopbackTrackId, loopbackAppName, loopbackVolume, loopbackType } =
      this.state;

    if (loopbackTrackId === null) {
      this.error('没有可更新的 Loopback 音频轨道');
      return;
    }

    const config: LoopbackAudioTrackConfig = {
      appName: loopbackAppName,
      volume: loopbackVolume,
      loopbackType: loopbackType,
    };

    try {
      const mediaEngine = this.engine?.getMediaEngine();
      if (mediaEngine) {
        const result = mediaEngine.updateLoopbackAudioTrackConfig(
          loopbackTrackId,
          config
        );
        if (result === 0) {
          this.info(`Loopback 音频轨道配置更新成功`);
        } else {
          this.error(`Loopback 音频轨道配置更新失败，错误码: ${result}`);
        }
      } else {
        this.error('无法获取 MediaEngine 实例');
      }
    } catch (error) {
      this.error(`更新 Loopback 音频轨道配置时发生错误: ${error}`);
    }
  };

  /**
   * 启用/禁用系统 Loopback 录制
   */
  toggleSystemLoopbackRecording = () => {
    const { systemLoopbackEnabled } = this.state;
    const newEnabled = !systemLoopbackEnabled;

    try {
      const result = this.engine?.enableLoopbackRecording(newEnabled, '');
      if (result === 0) {
        this.setState({ systemLoopbackEnabled: newEnabled });
        this.info(`系统 Loopback 录制${newEnabled ? '启用' : '禁用'}成功`);
      } else {
        this.error(
          `系统 Loopback 录制${
            newEnabled ? '启用' : '禁用'
          }失败，错误码: ${result}`
        );
      }
    } catch (error) {
      this.error(`系统 Loopback 录制操作时发生错误: ${error}`);
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
      systemLoopbackEnabled,
      loopbackAppName,
      loopbackVolume,
      loopbackType,
    } = this.state;
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
        <h3>Loopback 音频轨道配置</h3>

        <div style={{ marginBottom: 10 }}>
          <label>应用名称:</label>
          <input
            type="text"
            value={loopbackAppName}
            onChange={(e) => this.setState({ loopbackAppName: e.target.value })}
            style={{ marginLeft: 10, padding: 5, width: 200 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>音量:</label>
          <AgoraSlider
            title={`音量 ${loopbackVolume}`}
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
          <label>Loopback 类型:</label>
          <select
            value={loopbackType}
            onChange={(e) =>
              this.setState({ loopbackType: Number(e.target.value) })
            }
            style={{ marginLeft: 10, padding: 5 }}
          >
            <option value={LoopbackAudioTrackType.LoopbackSystem}>
              系统音频
            </option>
            <option value={LoopbackAudioTrackType.LoopbackSystemExcludeSelf}>
              系统音频（排除自己）
            </option>
            <option value={LoopbackAudioTrackType.LoopbackApplication}>
              应用音频
            </option>
          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <span>
            当前轨道 ID: {loopbackTrackId !== null ? loopbackTrackId : '无'}
          </span>
        </div>

        <AgoraButton
          title="创建 Loopback 音频轨道"
          onPress={this.createLoopbackAudioTrack}
          disabled={loopbackTrackId !== null}
        />

        <AgoraButton
          title="销毁 Loopback 音频轨道"
          onPress={this.destroyLoopbackAudioTrack}
          disabled={loopbackTrackId === null}
        />

        <AgoraButton
          title="更新 Loopback 音频轨道配置"
          onPress={this.updateLoopbackAudioTrackConfig}
          disabled={loopbackTrackId === null}
        />

        <AgoraDivider />
        <h3>系统 Loopback 录制操作</h3>

        <AgoraButton
          title={`${
            systemLoopbackEnabled ? '禁用' : '启用'
          } 系统 Loopback 录制`}
          onPress={this.toggleSystemLoopbackRecording}
        />
      </>
    );
  }
}
