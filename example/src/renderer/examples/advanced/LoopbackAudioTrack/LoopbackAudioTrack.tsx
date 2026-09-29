import {
  DeleteOutlined,
  SendOutlined,
  SoundOutlined,
  StopOutlined,
} from '@ant-design/icons';
import {
  AudioTrackVolumeInfo,
  ChannelProfileType,
  ClientRoleType,
  IAudioTrackObserver,
  IMediaEngine,
  IRtcEngineEventHandler,
  LoopbackAudioTrackConfig,
  LoopbackAudioTrackType,
  RtcConnection,
  RtcStats,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import {
  Alert,
  Button,
  InputNumber,
  Progress,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { ReactElement } from 'react';

import {
  BaseAudioComponentState,
  BaseComponent,
} from '../../../components/BaseComponent';
import {
  AgoraButton,
  AgoraDropdown,
  AgoraSlider,
  AgoraText,
  AgoraTextInput,
} from '../../../components/ui';
import Config from '../../../config/agora.config';

import {
  activeChannelLevels,
  isValidLoopbackTrackId,
  loopbackTrackIds,
} from './loopbackAudioTrackModel';

interface Track {
  id: number;
  volume: number;
  published: boolean;
  levels: number[];
}

interface State extends BaseAudioComponentState {
  ready: boolean;
  tracks: Track[];
  observedTrackId?: number;
  loopbackType: LoopbackAudioTrackType;
  deviceName: string;
  appName: string;
  processId: number;
  initialVolume: number;
  interval: number;
  lastError: string;
}

export default class LoopbackAudioTrack
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler
{
  private mediaEngine?: IMediaEngine;
  private joiningTrackIds: number[] = [];
  private readonly volumeObserver: IAudioTrackObserver = {
    onAudioTrackVolumeIndication: (
      trackId: number,
      volumeInfo: AudioTrackVolumeInfo
    ) => {
      const levels = activeChannelLevels(volumeInfo);
      this.setState((state) => ({
        tracks: state.tracks.map((track) =>
          track.id === trackId ? { ...track, levels } : track
        ),
      }));
    },
  };

  protected createState(): State {
    return {
      appId: Config.appId,
      channelId: Config.channelId,
      token: Config.token,
      uid: Config.uid,
      enableVideo: false,
      joinChannelSuccess: false,
      remoteUsers: [],
      ready: false,
      tracks: [],
      loopbackType: LoopbackAudioTrackType.LoopbackSystem,
      deviceName: '',
      appName: '',
      processId: 0,
      initialVolume: 100,
      interval: 100,
      lastError: '',
    };
  }

  private check(result: number, operation: string): boolean {
    if (result === 0) return true;
    this.error(`${operation} failed: ${result}`);
    this.setState({ lastError: `${operation} failed: ${result}` });
    return false;
  }

  protected initRtcEngine() {
    if (!this.state.appId) {
      this.setState({ lastError: 'App ID is required in Settings.' });
      return;
    }
    const engine = createAgoraRtcEngine();
    if (
      !this.check(
        engine.initialize({
          appId: this.state.appId,
          channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
          logConfig: { filePath: Config.logFilePath },
        }),
        'initialize'
      )
    ) {
      return;
    }
    this.engine = engine;
    this.mediaEngine = engine.getMediaEngine();
    engine.registerEventHandler(this);
    if (this.check(engine.enableAudio(), 'enableAudio')) {
      this.setState({ ready: true });
    }
  }

  protected joinChannel() {
    const { channelId, token, uid, tracks } = this.state;
    if (!this.engine || !channelId || uid < 0) {
      this.setState({ lastError: 'Engine, channel ID and UID are required.' });
      return;
    }
    const ids = tracks.map((track) => track.id);
    this.joiningTrackIds = ids;
    if (
      !this.check(
        this.engine.joinChannel(token, channelId, uid, {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          publishCameraTrack: false,
          publishMicrophoneTrack: false,
          autoSubscribeAudio: false,
          publishLoopbackAudioTrack: ids.length > 0,
          ...(ids.length > 0
            ? { publishLoopbackAudioTrackIds: loopbackTrackIds(ids) }
            : {}),
        }),
        'joinChannel'
      )
    ) {
      this.joiningTrackIds = [];
    }
  }

  override onJoinChannelSuccess(connection: RtcConnection, elapsed: number) {
    super.onJoinChannelSuccess(connection, elapsed);
    const publishedIds = this.joiningTrackIds;
    this.joiningTrackIds = [];
    this.setState((state) => ({
      tracks: state.tracks.map((track) => ({
        ...track,
        published: publishedIds.includes(track.id),
      })),
    }));
  }

  protected leaveChannel() {
    if (this.engine) this.check(this.engine.leaveChannel(), 'leaveChannel');
  }

  override onLeaveChannel(connection: RtcConnection, stats: RtcStats) {
    this.info('onLeaveChannel', connection, stats);
    this.joiningTrackIds = [];
    this.setState((state) => ({
      joinChannelSuccess: false,
      remoteUsers: [],
      tracks: state.tracks.map((track) => ({ ...track, published: false })),
    }));
  }

  private createTrack = () => {
    const mediaEngine = this.mediaEngine;
    if (!mediaEngine) return;
    const {
      loopbackType,
      deviceName,
      appName,
      processId,
      initialVolume,
      joinChannelSuccess,
    } = this.state;
    const config: LoopbackAudioTrackConfig = {
      loopbackType,
      volume: initialVolume,
    };
    if (loopbackType === LoopbackAudioTrackType.LoopbackApplication) {
      if (!appName.trim()) {
        this.setState({ lastError: 'Application name is required.' });
        return;
      }
      config.appName = appName.trim();
    } else if (loopbackType === LoopbackAudioTrackType.LoopbackProcess) {
      if (!Number.isInteger(processId) || processId <= 0) {
        this.setState({ lastError: 'A valid process ID is required.' });
        return;
      }
      config.processId = processId;
    } else if (deviceName.trim()) {
      config.deviceName = deviceName.trim();
    }

    const id = mediaEngine.createLoopbackAudioTrack(config);
    if (!isValidLoopbackTrackId(id)) {
      this.setState({ lastError: `createLoopbackAudioTrack failed: ${id}` });
      return;
    }
    let published = false;
    if (joinChannelSuccess && this.engine) {
      published = this.check(
        this.engine.updateChannelMediaOptions({
          publishLoopbackAudioTrack: true,
          publishLoopbackAudioTrackIds: loopbackTrackIds([id]),
        }),
        'updateChannelMediaOptions'
      );
    }
    this.setState((state) => ({
      tracks: [
        ...state.tracks,
        { id, volume: initialVolume, published, levels: [] },
      ],
      lastError: published || !joinChannelSuccess ? '' : state.lastError,
    }));
  };

  private setPublished = (track: Track) => {
    if (!this.engine || !this.state.joinChannelSuccess) return;
    const published = !track.published;
    if (
      this.check(
        this.engine.updateChannelMediaOptions({
          publishLoopbackAudioTrack: published,
          publishLoopbackAudioTrackIds: loopbackTrackIds([track.id]),
        }),
        'updateChannelMediaOptions'
      )
    ) {
      this.setState((state) => ({
        tracks: state.tracks.map((item) =>
          item.id === track.id ? { ...item, published } : item
        ),
        lastError: '',
      }));
    }
  };

  private setVolume = (trackId: number, volume: number | null) => {
    if (!this.mediaEngine || volume === null) return;
    if (
      this.check(
        this.mediaEngine.adjustLoopbackAudioPublishVolume(trackId, volume),
        'adjustLoopbackAudioPublishVolume'
      )
    ) {
      this.setState((state) => ({
        tracks: state.tracks.map((track) =>
          track.id === trackId ? { ...track, volume } : track
        ),
        lastError: '',
      }));
    }
  };

  private stopObservation = (): boolean => {
    const id = this.state.observedTrackId;
    if (id === undefined || !this.mediaEngine) return true;
    const disabled = this.check(
      this.mediaEngine.enableAudioTrackVolumeIndication(id, 0),
      'enableAudioTrackVolumeIndication'
    );
    if (
      !this.check(
        this.mediaEngine.unregisterAudioTrackObserver(id, this.volumeObserver),
        'unregisterAudioTrackObserver'
      )
    ) {
      return false;
    }
    this.setState((state) => ({
      observedTrackId: undefined,
      lastError: disabled ? '' : state.lastError,
    }));
    return true;
  };

  private setObserved = (id: number) => {
    if (!this.mediaEngine) return;
    if (this.state.observedTrackId === id) {
      this.stopObservation();
      return;
    }
    if (!this.stopObservation()) return;
    if (
      !this.check(
        this.mediaEngine.registerAudioTrackObserver(id, this.volumeObserver),
        'registerAudioTrackObserver'
      )
    ) {
      return;
    }
    if (
      !this.check(
        this.mediaEngine.enableAudioTrackVolumeIndication(
          id,
          this.state.interval
        ),
        'enableAudioTrackVolumeIndication'
      )
    ) {
      this.mediaEngine.unregisterAudioTrackObserver(id, this.volumeObserver);
      return;
    }
    this.setState({ observedTrackId: id, lastError: '' });
  };

  private destroyTrack = (track: Track) => {
    if (!this.mediaEngine) return;
    if (this.state.observedTrackId === track.id && !this.stopObservation()) {
      return;
    }
    if (track.published && this.engine) {
      if (
        !this.check(
          this.engine.updateChannelMediaOptions({
            publishLoopbackAudioTrack: false,
            publishLoopbackAudioTrackIds: loopbackTrackIds([track.id]),
          }),
          'updateChannelMediaOptions'
        )
      ) {
        return;
      }
    }
    if (
      this.check(
        this.mediaEngine.destroyLoopbackAudioTrack(track.id),
        'destroyLoopbackAudioTrack'
      )
    ) {
      this.setState((state) => ({
        tracks: state.tracks.filter((item) => item.id !== track.id),
        lastError: '',
      }));
    }
  };

  protected releaseRtcEngine() {
    this.engine?.unregisterEventHandler(this);
    if (this.state.joinChannelSuccess) this.engine?.leaveChannel();
    if (this.mediaEngine) {
      const id = this.state.observedTrackId;
      if (id !== undefined) {
        this.mediaEngine.enableAudioTrackVolumeIndication(id, 0);
        this.mediaEngine.unregisterAudioTrackObserver(id, this.volumeObserver);
      }
      this.state.tracks.forEach((track) =>
        this.mediaEngine?.destroyLoopbackAudioTrack(track.id)
      );
    }
    this.engine?.release();
  }

  protected renderUsers(): ReactElement {
    const { tracks, observedTrackId, lastError } = this.state;
    const columns: ColumnsType<Track> = [
      { title: 'Track ID', dataIndex: 'id', width: 110 },
      {
        title: 'Publishing',
        width: 110,
        render: (_value, track) => (track.published ? 'On' : 'Off'),
      },
      {
        title: 'Publish volume',
        width: 145,
        render: (_value, track) => (
          <InputNumber
            min={0}
            max={400}
            value={track.volume}
            onChange={(value) => this.setVolume(track.id, value)}
          />
        ),
      },
      {
        title: 'Channel levels',
        width: 230,
        render: (_value, track) =>
          track.levels.length ? (
            <Space direction="vertical" style={{ width: '100%' }}>
              {track.levels.map((level, index) => (
                <Space key={index}>
                  <span>{`Ch ${index + 1}: ${level}`}</span>
                  <Progress
                    percent={Math.max(0, Math.min(100, (level / 255) * 100))}
                    showInfo={false}
                    style={{ width: 85 }}
                  />
                </Space>
              ))}
            </Space>
          ) : (
            '-'
          ),
      },
      {
        title: 'Actions',
        width: 145,
        render: (_value, track) => (
          <Space>
            <Tooltip
              title={track.published ? 'Unpublish track' : 'Publish track'}
            >
              <Button
                aria-label={
                  track.published ? 'Unpublish track' : 'Publish track'
                }
                icon={track.published ? <StopOutlined /> : <SendOutlined />}
                disabled={!this.state.joinChannelSuccess}
                onClick={() => this.setPublished(track)}
              />
            </Tooltip>
            <Tooltip
              title={
                observedTrackId === track.id
                  ? 'Stop monitoring'
                  : 'Monitor track'
              }
            >
              <Button
                aria-label={
                  observedTrackId === track.id
                    ? 'Stop monitoring'
                    : 'Monitor track'
                }
                icon={<SoundOutlined />}
                type={observedTrackId === track.id ? 'primary' : 'default'}
                onClick={() => this.setObserved(track.id)}
              />
            </Tooltip>
            <Tooltip title="Destroy track">
              <Button
                aria-label="Destroy track"
                icon={<DeleteOutlined />}
                onClick={() => this.destroyTrack(track)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ];

    return (
      <div style={{ padding: 16, width: '100%' }}>
        <Typography.Title level={5}>Loopback audio tracks</Typography.Title>
        {lastError ? <Alert type="error" message={lastError} showIcon /> : null}
        <Table
          columns={columns}
          dataSource={tracks}
          locale={{ emptyText: 'No loopback tracks' }}
          pagination={false}
          rowKey="id"
          scroll={{ x: 740 }}
          size="small"
        />
      </div>
    );
  }

  protected renderConfiguration(): ReactElement {
    const {
      loopbackType,
      deviceName,
      appName,
      processId,
      initialVolume,
      interval,
    } = this.state;
    return (
      <>
        <AgoraDropdown
          title="Capture source"
          value={loopbackType}
          items={[
            { label: 'System', value: LoopbackAudioTrackType.LoopbackSystem },
            {
              label: 'System excluding this app',
              value: LoopbackAudioTrackType.LoopbackSystemExcludeSelf,
            },
            {
              label: 'Application',
              value: LoopbackAudioTrackType.LoopbackApplication,
            },
            { label: 'Process', value: LoopbackAudioTrackType.LoopbackProcess },
          ]}
          onValueChange={(value) => this.setState({ loopbackType: value })}
        />
        {loopbackType <= LoopbackAudioTrackType.LoopbackSystemExcludeSelf ? (
          <AgoraTextInput
            placeholder="Virtual device name (optional, macOS)"
            value={deviceName}
            onChangeText={(value) => this.setState({ deviceName: value })}
          />
        ) : null}
        {loopbackType === LoopbackAudioTrackType.LoopbackApplication ? (
          <AgoraTextInput
            placeholder="Application name"
            value={appName}
            onChangeText={(value) => this.setState({ appName: value })}
          />
        ) : null}
        {loopbackType === LoopbackAudioTrackType.LoopbackProcess ? (
          <>
            <AgoraText>Process ID</AgoraText>
            <InputNumber
              min={1}
              value={processId || undefined}
              onChange={(value) => this.setState({ processId: value ?? 0 })}
            />
          </>
        ) : null}
        <AgoraSlider
          title={`Initial publish volume: ${initialVolume}`}
          value={initialVolume}
          minimumValue={0}
          maximumValue={400}
          onValueChange={(value) => this.setState({ initialVolume: value })}
        />
        <AgoraText>Volume interval (ms)</AgoraText>
        <InputNumber
          min={0}
          step={50}
          value={interval}
          onChange={(value) => {
            if (value === null) return;
            const id = this.state.observedTrackId;
            if (
              id === undefined ||
              !this.mediaEngine ||
              this.check(
                this.mediaEngine.enableAudioTrackVolumeIndication(id, value),
                'enableAudioTrackVolumeIndication'
              )
            ) {
              this.setState({ interval: value });
            }
          }}
        />
      </>
    );
  }

  protected renderAction(): ReactElement {
    return (
      <AgoraButton
        title="Create loopback track"
        icon={<SoundOutlined />}
        disabled={!this.state.ready}
        onPress={this.createTrack}
      />
    );
  }
}
