import {
  DeleteOutlined,
  ReloadOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import {
  AudioTrackVolumeInfo,
  ChannelProfileType,
  ClientRoleType,
  ConnectionChangedReasonType,
  ConnectionStateType,
  ErrorCodeType,
  IAudioTrackObserver,
  IMediaEngine,
  IRtcEngineEventHandler,
  LocalAudioStreamReason,
  LocalAudioStreamState,
  LoopbackAudioTrackConfig,
  LoopbackAudioTrackType,
  LoopbackRecordingSourceFlag,
  LoopbackRecordingSourceInfo,
  RtcConnection,
  RtcStats,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  List,
  Progress,
  Row,
  Select,
  Slider,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { ReactElement } from 'react';

import {
  BaseAudioComponentState,
  BaseComponent,
} from '../../../components/BaseComponent';
import { AgoraButton, AgoraTextInput } from '../../../components/ui';
import Config from '../../../config/agora.config';

import {
  activeChannelLevels,
  isValidLoopbackTrackId,
  loopbackTrackIds,
} from './loopbackAudioTrackModel';

type CaptureState =
  | 'created'
  | 'pending'
  | 'recording'
  | 'waiting'
  | 'paused'
  | 'stopped'
  | 'failed';

interface Track {
  id: number;
  name: string;
  type: LoopbackAudioTrackType;
  volume: number;
  published: boolean;
  enabled: boolean;
  captureState: CaptureState;
  levels: number[];
}

interface State extends BaseAudioComponentState {
  ready: boolean;
  joining: boolean;
  leaving: boolean;
  tracks: Track[];
  loopbackType: LoopbackAudioTrackType;
  appName: string;
  processId: number;
  allowWaiting: boolean;
  excludedNames: string;
  excludedPids: string;
  sources: LoopbackRecordingSourceInfo[];
  audioOutput: boolean;
  runningApplications: boolean;
  initialVolume: number;
  autoStartCapture: boolean;
  publishOnCreation: boolean;
  interval: number;
  lastError: string;
}

const captureLabels: Record<CaptureState, string> = {
  created: 'Created · Not started',
  pending: 'Awaiting capture state',
  recording: 'Capturing',
  waiting: 'Waiting for application audio',
  paused: 'Paused',
  stopped: 'Stopped',
  failed: 'Capture failed',
};

const captureModes = [
  { label: 'System audio', value: LoopbackAudioTrackType.LoopbackSystem },
  {
    label: 'System excluding this app',
    value: LoopbackAudioTrackType.LoopbackSystemExcludeSelf,
  },
  {
    label: 'Application name',
    value: LoopbackAudioTrackType.LoopbackApplication,
  },
  { label: 'Process ID', value: LoopbackAudioTrackType.LoopbackProcess },
];

const verticalSpaceStyle: React.CSSProperties = { display: 'flex' };
const formItemStyle: React.CSSProperties = { marginBottom: 12 };
const creationOptionStyle: React.CSSProperties = {
  fontSize: 12,
  whiteSpace: 'nowrap',
};

export default class LoopbackAudioTrack
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler
{
  private mediaEngine?: IMediaEngine;
  private readonly observedTrackIntervals = new Map<number, number>();
  private readonly volumeObserver: IAudioTrackObserver = {
    onAudioTrackVolumeIndication: (
      trackId: number,
      volumeInfo: AudioTrackVolumeInfo
    ) => {
      if ((this.observedTrackIntervals.get(trackId) ?? 0) <= 0) return;
      const levels = activeChannelLevels(volumeInfo);
      this.setState((state) => {
        const track = state.tracks.find((item) => item.id === trackId);
        if (
          !track ||
          !track.enabled ||
          ['waiting', 'paused', 'stopped', 'failed'].includes(
            track.captureState
          ) ||
          (track.levels.length === levels.length &&
            track.levels.every((level, index) => level === levels[index]))
        )
          return null;
        return {
          tracks: state.tracks.map((item) =>
            item.id === trackId ? { ...item, levels } : item
          ),
        };
      });
    },
    onAudioTrackStateChanged: (trackId, captureState, reason) => {
      if (!this.observedTrackIntervals.has(trackId)) return;
      this.setState((state) => ({
        tracks: state.tracks.map((track) => {
          if (track.id !== trackId) return track;
          let status: CaptureState;
          if (!track.enabled) {
            status = track.captureState === 'created' ? 'created' : 'paused';
          } else if (
            captureState === LocalAudioStreamState.LocalAudioStreamStateFailed
          ) {
            status = 'failed';
          } else if (
            reason ===
              LocalAudioStreamReason.LocalAudioStreamReasonWaitingForTarget &&
            captureState === LocalAudioStreamState.LocalAudioStreamStateStopped
          ) {
            status = 'waiting';
          } else if (
            captureState ===
            LocalAudioStreamState.LocalAudioStreamStateRecording
          ) {
            status = 'recording';
          } else if (
            captureState === LocalAudioStreamState.LocalAudioStreamStateStopped
          ) {
            status = 'stopped';
          } else {
            status = 'pending';
          }
          return {
            ...track,
            captureState: status,
            levels: status === 'recording' ? track.levels : [],
          };
        }),
        lastError:
          captureState === LocalAudioStreamState.LocalAudioStreamStateFailed
            ? `Track #${trackId} capture failed (reason ${reason}).`
            : state.lastError,
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
      joining: false,
      leaving: false,
      tracks: [],
      loopbackType: LoopbackAudioTrackType.LoopbackSystem,
      appName: '',
      processId: 0,
      allowWaiting: true,
      excludedNames: '',
      excludedPids: '',
      sources: [],
      audioOutput: true,
      runningApplications: true,
      initialVolume: 100,
      autoStartCapture: true,
      publishOnCreation: true,
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
    this.engine = engine;
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
    this.mediaEngine = engine.getMediaEngine();
    engine.registerEventHandler(this);
    if (this.check(engine.enableAudio(), 'enableAudio')) {
      this.setState({ ready: true });
    }
  }

  override onError(err: ErrorCodeType, msg: string) {
    super.onError(err, msg);
    this.setState({
      lastError: `SDK error ${err}: ${msg}`,
    });
  }

  onConnectionStateChanged(
    connection: RtcConnection,
    state: ConnectionStateType,
    reason: ConnectionChangedReasonType
  ) {
    if (
      state === ConnectionStateType.ConnectionStateFailed &&
      this.state.joining &&
      (!connection.channelId || connection.channelId === this.state.channelId)
    ) {
      this.setState({
        joining: false,
        lastError: `Channel connection failed (reason ${reason}).`,
      });
    }
  }

  protected joinChannel() {
    const {
      ready,
      channelId,
      token,
      uid,
      joining,
      leaving,
      joinChannelSuccess,
    } = this.state;
    if (joining || leaving || joinChannelSuccess) return;
    if (
      !ready ||
      !this.engine ||
      !channelId.trim() ||
      !Number.isInteger(uid) ||
      uid < 0 ||
      uid >= 0xffffffff
    ) {
      this.setState({
        lastError: 'A channel ID and a valid UID are required.',
      });
      return;
    }
    this.setState({ joining: true, lastError: '' });
    if (
      !this.check(
        this.engine.joinChannel(token, channelId, uid, {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          publishCameraTrack: false,
          publishMicrophoneTrack: false,
          autoSubscribeAudio: false,
          publishLoopbackAudioTrack: false,
        }),
        'joinChannel'
      )
    ) {
      this.setState({ joining: false });
    }
  }

  override onJoinChannelSuccess(connection: RtcConnection, elapsed: number) {
    super.onJoinChannelSuccess(connection, elapsed);
    this.setState({ joining: false, lastError: '' });
  }

  protected leaveChannel() {
    if (!this.engine || this.state.leaving) return;
    this.setState({ leaving: true });
    if (!this.check(this.engine.leaveChannel(), 'leaveChannel')) {
      this.setState({ leaving: false });
    }
  }

  override onLeaveChannel(connection: RtcConnection, stats: RtcStats) {
    this.info('onLeaveChannel', connection, stats);
    this.setState((state) => ({
      joinChannelSuccess: false,
      joining: false,
      leaving: false,
      remoteUsers: [],
      tracks: state.tracks.map((track) => ({ ...track, published: false })),
    }));
  }

  private refreshSources = () => {
    if (!this.engine || !this.state.ready) return;
    const { audioOutput, runningApplications } = this.state;
    const flags =
      (audioOutput
        ? LoopbackRecordingSourceFlag.LoopbackRecordingSourceFlagAudioOutput
        : 0) |
      (runningApplications
        ? LoopbackRecordingSourceFlag.LoopbackRecordingSourceFlagRunningApplication
        : 0);
    this.setState({
      sources: flags ? this.engine.getLoopbackRecordingSources({ flags }) : [],
    });
  };

  private createTrack = () => {
    const mediaEngine = this.mediaEngine;
    if (!mediaEngine || !this.state.ready) return;
    const {
      loopbackType,
      appName,
      processId,
      allowWaiting,
      excludedNames,
      excludedPids,
      initialVolume,
      autoStartCapture,
      publishOnCreation,
    } = this.state;
    const config: LoopbackAudioTrackConfig = {
      loopbackType,
      volume: initialVolume,
    };
    let name = captureModes.find((mode) => mode.value === loopbackType)!.label;
    if (loopbackType === LoopbackAudioTrackType.LoopbackApplication) {
      if (!appName.trim()) {
        this.setState({ lastError: 'Application name is required.' });
        return;
      }
      config.appName = appName;
      config.allowWaitingForApplication = allowWaiting;
      name = appName;
    } else if (loopbackType === LoopbackAudioTrackType.LoopbackProcess) {
      if (
        !Number.isInteger(processId) ||
        processId <= 0 ||
        processId >= 0xffffffff
      ) {
        this.setState({
          lastError: 'Process ID must be an integer from 1 to 4294967294.',
        });
        return;
      }
      config.processId = processId;
      name = `PID ${processId}`;
    } else if (loopbackType === LoopbackAudioTrackType.LoopbackSystem) {
      const names = excludedNames
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      const pids = excludedPids
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
        .map(Number);
      if (
        pids.some(
          (pid) => !Number.isInteger(pid) || pid <= 0 || pid >= 0xffffffff
        )
      ) {
        this.setState({
          lastError:
            'Excluded process IDs must be positive integers separated by commas.',
        });
        return;
      }
      if (names.length) {
        config.excludedAppNames = names;
        config.excludedAppCount = names.length;
      }
      if (pids.length) {
        config.excludedProcessIds = pids;
        config.excludedProcessCount = pids.length;
      }
    }

    const id = mediaEngine.createLoopbackAudioTrack(config, false);
    if (!isValidLoopbackTrackId(id)) {
      this.setState({ lastError: `createLoopbackAudioTrack failed: ${id}` });
      return;
    }
    this.setState(
      (state) => ({
        tracks: [
          ...state.tracks,
          {
            id,
            name,
            type: loopbackType,
            volume: initialVolume,
            published: false,
            enabled: false,
            captureState: 'created' as CaptureState,
            levels: [],
          },
        ],
        lastError: '',
      }),
      () => {
        const observed = this.observeTrack(id);
        const track = this.state.tracks.find((item) => item.id === id);
        if (autoStartCapture && observed && track)
          this.setCapture(track, false);
        if (publishOnCreation) this.updatePublication([id], true, false);
      }
    );
  };

  private setPublished = (track: Track) => {
    this.updatePublication([track.id], !track.published);
  };

  private setAllPublished = () => {
    const { tracks } = this.state;
    if (!tracks.length) return;
    this.updatePublication(
      tracks.map((track) => track.id),
      !tracks.every((track) => track.published)
    );
  };

  private updatePublication(
    ids: number[],
    published: boolean,
    clearError = true
  ): boolean {
    if (
      !this.engine ||
      !this.state.joinChannelSuccess ||
      this.state.leaving ||
      !ids.length
    )
      return false;
    if (
      !this.check(
        this.engine.updateChannelMediaOptions({
          publishLoopbackAudioTrack: published,
          publishLoopbackAudioTrackIds: loopbackTrackIds(ids),
        }),
        'updateChannelMediaOptions'
      )
    ) {
      return false;
    }
    this.setState((state) => ({
      tracks: state.tracks.map((track) =>
        ids.includes(track.id) ? { ...track, published } : track
      ),
      lastError: clearError ? '' : state.lastError,
    }));
    return true;
  }

  private setCapture = (track: Track, clearError = true) => {
    if (!this.mediaEngine || track.captureState === 'failed') return;
    if (clearError) this.setState({ lastError: '' });
    const enabled = !track.enabled;
    if (
      enabled &&
      !this.observedTrackIntervals.has(track.id) &&
      !this.observeTrack(track.id)
    )
      return;
    const previousState = track.captureState;
    this.setState(
      (state) => ({
        tracks: state.tracks.map((item) =>
          item.id === track.id
            ? {
                ...item,
                enabled,
                captureState: enabled ? 'pending' : 'paused',
                levels: [],
              }
            : item
        ),
      }),
      () => {
        if (
          !this.check(
            this.mediaEngine!.enableLoopbackAudioTrack(track.id, enabled),
            'enableLoopbackAudioTrack'
          )
        ) {
          this.setState((state) => ({
            tracks: state.tracks.map((item) =>
              item.id === track.id
                ? {
                    ...item,
                    enabled: track.enabled,
                    captureState: previousState,
                  }
                : item
            ),
          }));
        }
      }
    );
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

  private stopObservation = (id: number): boolean => {
    if (!this.observedTrackIntervals.has(id) || !this.mediaEngine) return true;
    const disabled = this.check(
      this.mediaEngine.enableAudioTrackVolumeIndication(id, 0),
      'enableAudioTrackVolumeIndication'
    );
    if (disabled) this.observedTrackIntervals.set(id, 0);
    if (
      !this.check(
        this.mediaEngine.unregisterAudioTrackObserver(id, this.volumeObserver),
        'unregisterAudioTrackObserver'
      )
    ) {
      return false;
    }
    this.observedTrackIntervals.delete(id);
    this.setState((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === id ? { ...track, levels: [] } : track
      ),
      lastError: disabled ? '' : state.lastError,
    }));
    return true;
  };

  private observeTrack = (id: number): boolean => {
    if (!this.mediaEngine) return false;
    if (this.observedTrackIntervals.has(id)) return true;
    if (
      !this.check(
        this.mediaEngine.registerAudioTrackObserver(id, this.volumeObserver),
        'registerAudioTrackObserver'
      )
    ) {
      return false;
    }
    this.observedTrackIntervals.set(id, 0);
    // Retain the registered observer even if volume indication fails.
    if (
      this.check(
        this.mediaEngine.enableAudioTrackVolumeIndication(
          id,
          this.state.interval
        ),
        'enableAudioTrackVolumeIndication'
      )
    )
      this.observedTrackIntervals.set(id, this.state.interval);
    return true;
  };

  private setInterval = (interval: number | null) => {
    if (interval === null || !Number.isInteger(interval) || interval < 0)
      return;
    if (this.mediaEngine) {
      this.observedTrackIntervals.forEach((_previousInterval, id) => {
        if (
          this.check(
            this.mediaEngine!.enableAudioTrackVolumeIndication(id, interval),
            `enableAudioTrackVolumeIndication (#${id})`
          )
        )
          this.observedTrackIntervals.set(id, interval);
      });
    }
    this.setState((state) => ({
      interval,
      tracks: state.tracks.map((track) =>
        this.observedTrackIntervals.get(track.id) === 0
          ? { ...track, levels: [] }
          : track
      ),
    }));
  };

  private destroyTrack = (track: Track) => {
    if (!this.mediaEngine || this.state.leaving) return;
    if (track.published && !this.updatePublication([track.id], false)) return;
    if (track.enabled) {
      if (
        !this.check(
          this.mediaEngine.enableLoopbackAudioTrack(track.id, false),
          'enableLoopbackAudioTrack'
        )
      )
        return;
      this.setState((state) => ({
        tracks: state.tracks.map((item) =>
          item.id === track.id
            ? { ...item, enabled: false, captureState: 'paused', levels: [] }
            : item
        ),
      }));
    }
    if (!this.stopObservation(track.id)) return;
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
    if (this.state.joinChannelSuccess || this.state.joining)
      this.engine?.leaveChannel();
    const mediaEngine = this.mediaEngine;
    if (mediaEngine) {
      const observedIds = Array.from(this.observedTrackIntervals.keys());
      this.observedTrackIntervals.clear();
      observedIds.forEach((id) => {
        mediaEngine.enableAudioTrackVolumeIndication(id, 0);
        mediaEngine.unregisterAudioTrackObserver(id, this.volumeObserver);
      });
      this.state.tracks.forEach((track) => {
        if (track.enabled)
          mediaEngine.enableLoopbackAudioTrack(track.id, false);
        mediaEngine.destroyLoopbackAudioTrack(track.id);
      });
    }
    this.engine?.release();
  }

  override render(): ReactElement {
    return (
      <div
        style={{
          height: '100%',
          overflow: 'auto',
          padding: 14,
          background: '#eef0f3',
        }}
      >
        <Typography.Title level={4}>Loopback audio sharing</Typography.Title>
        {this.state.lastError ? (
          <Alert
            style={{ marginBottom: 12 }}
            type="error"
            message={this.state.lastError}
            showIcon
            closable
            onClose={() => this.setState({ lastError: '' })}
          />
        ) : null}
        <Row gutter={[12, 12]} align="top">
          <Col xs={24} lg={14} xl={15}>
            {this.renderUsers()}
          </Col>
          <Col xs={24} lg={10} xl={9}>
            <Space style={verticalSpaceStyle} direction="vertical" size={12}>
              {this.renderChannel()}
              <Card size="small" role="group" aria-label="New track">
                {this.renderConfiguration()}
                {this.renderAction()}
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    );
  }

  protected renderChannel(): ReactElement {
    const { channelId, joining, leaving, joinChannelSuccess, ready } =
      this.state;
    return (
      <Card size="small" role="group" aria-label="Channel connection">
        <Row gutter={8} wrap={false} align="middle">
          <Col flex="auto">
            <AgoraTextInput
              aria-label="Channel ID"
              placeholder="channelId"
              value={channelId}
              editable={!joinChannelSuccess && !joining && !leaving}
              style={{ margin: 0 }}
              onChangeText={(text) => this.setState({ channelId: text })}
            />
          </Col>
          <Col flex="none">
            <AgoraButton
              title={`${joinChannelSuccess ? 'leave' : 'join'} Channel`}
              style={{ margin: 0 }}
              disabled={!ready}
              loading={joining || leaving}
              aria-label={joinChannelSuccess ? 'Leave channel' : 'Join channel'}
              onPress={() =>
                joinChannelSuccess ? this.leaveChannel() : this.joinChannel()
              }
            />
          </Col>
        </Row>
      </Card>
    );
  }

  protected renderUsers(): ReactElement {
    const { tracks, interval, joinChannelSuccess, leaving } = this.state;
    const allPublished =
      tracks.length > 0 && tracks.every((track) => track.published);
    return (
      <Card
        size="small"
        title="Audio tracks"
        extra={
          <Typography.Text type="secondary">
            Published: {tracks.filter((track) => track.published).length} /{' '}
            {tracks.length}
          </Typography.Text>
        }
      >
        <Space style={verticalSpaceStyle} direction="vertical" size={12}>
          <Row justify="space-between" align="middle" gutter={[8, 8]}>
            <Col>
              <Space size={8}>
                <label htmlFor="loopback-interval">Level interval</label>
                <InputNumber
                  id="loopback-interval"
                  aria-label="Level interval (ms)"
                  min={0}
                  step={50}
                  precision={0}
                  value={interval}
                  onChange={this.setInterval}
                  size="small"
                />
                <span>ms</span>
              </Space>
            </Col>
            <Col>
              <Button
                size="small"
                disabled={!joinChannelSuccess || leaving || !tracks.length}
                onClick={this.setAllPublished}
              >
                {allPublished ? 'Unpublish All' : 'Publish All'}
              </Button>
            </Col>
          </Row>
          {!tracks.length ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No loopback tracks"
            />
          ) : (
            tracks.map((track) => (
              <Card
                key={track.id}
                size="small"
                role="article"
                aria-label={`Track ${track.id}`}
              >
                <Space style={verticalSpaceStyle} direction="vertical" size={8}>
                  <Row
                    justify="space-between"
                    align="top"
                    gutter={8}
                    wrap={false}
                  >
                    <Col flex="auto">
                      <Space
                        style={verticalSpaceStyle}
                        direction="vertical"
                        size={0}
                      >
                        <strong style={{ overflowWrap: 'anywhere' }}>
                          {track.name}
                        </strong>
                        {(track.type ===
                          LoopbackAudioTrackType.LoopbackApplication ||
                          track.type ===
                            LoopbackAudioTrackType.LoopbackProcess) && (
                          <Typography.Text type="secondary">
                            {
                              captureModes.find(
                                (mode) => mode.value === track.type
                              )?.label
                            }
                          </Typography.Text>
                        )}
                      </Space>
                    </Col>
                    <Col>
                      <Typography.Text type="secondary">
                        #{track.id}
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Row gutter={8}>
                    <Col span={12}>
                      <Space
                        style={verticalSpaceStyle}
                        direction="vertical"
                        size={0}
                      >
                        <Typography.Text type="secondary">
                          Capture
                        </Typography.Text>
                        <Tag
                          style={{ whiteSpace: 'normal' }}
                          color={
                            track.captureState === 'recording'
                              ? 'green'
                              : track.captureState === 'waiting'
                              ? 'gold'
                              : track.captureState === 'failed'
                              ? 'red'
                              : undefined
                          }
                        >
                          {captureLabels[track.captureState]}
                        </Tag>
                      </Space>
                    </Col>
                    <Col span={12}>
                      <Space
                        style={verticalSpaceStyle}
                        direction="vertical"
                        size={0}
                      >
                        <Typography.Text type="secondary">
                          Publication
                        </Typography.Text>
                        <Tag
                          style={{ whiteSpace: 'normal' }}
                          color={track.published ? 'blue' : undefined}
                        >
                          {track.published ? 'Published' : 'Not published'}
                        </Tag>
                      </Space>
                    </Col>
                  </Row>
                  <Row gutter={8} wrap={false} align="middle">
                    <Col>
                      <label htmlFor={`loopback-volume-${track.id}`}>
                        Publish volume
                      </label>
                    </Col>
                    <Col flex="auto">
                      <Slider
                        id={`loopback-volume-${track.id}`}
                        min={0}
                        max={400}
                        value={track.volume}
                        onChange={(value) => this.setVolume(track.id, value)}
                      />
                    </Col>
                    <Col flex="48px">{track.volume}%</Col>
                  </Row>
                  <Space
                    style={verticalSpaceStyle}
                    direction="vertical"
                    size={0}
                  >
                    {(track.levels.length
                      ? track.levels
                      : [undefined, undefined]
                    ).map((level, index) => (
                      <Row gutter={8} wrap={false} align="middle" key={index}>
                        <Col flex="40px">
                          <Typography.Text type="secondary">
                            Ch {index + 1}
                          </Typography.Text>
                        </Col>
                        <Col flex="auto">
                          <Progress
                            percent={
                              level === undefined
                                ? 0
                                : Math.max(
                                    0,
                                    Math.min(100, (level / 255) * 100)
                                  )
                            }
                            showInfo={false}
                            size="small"
                          />
                        </Col>
                        <Col flex="28px">
                          <Typography.Text type="secondary">
                            {level ?? '—'}
                          </Typography.Text>
                        </Col>
                      </Row>
                    ))}
                  </Space>
                  <Row justify="space-between" align="middle" gutter={[8, 8]}>
                    <Col>
                      <Space size={6} wrap>
                        <Button
                          size="small"
                          disabled={track.captureState === 'failed'}
                          onClick={() => this.setCapture(track)}
                        >
                          {track.enabled
                            ? 'Pause capture'
                            : track.captureState === 'created'
                            ? 'Start capture'
                            : 'Resume capture'}
                        </Button>
                        <Button
                          size="small"
                          disabled={!joinChannelSuccess || leaving}
                          onClick={() => this.setPublished(track)}
                        >
                          {track.published ? 'Unpublish' : 'Publish'}
                        </Button>
                      </Space>
                    </Col>
                    <Col>
                      <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        disabled={leaving}
                        aria-label={`Destroy track ${track.id}`}
                        onClick={() => this.destroyTrack(track)}
                      />
                    </Col>
                  </Row>
                </Space>
              </Card>
            ))
          )}
        </Space>
      </Card>
    );
  }

  protected renderConfiguration(): ReactElement {
    const {
      loopbackType,
      appName,
      processId,
      allowWaiting,
      excludedNames,
      excludedPids,
      initialVolume,
      audioOutput,
      runningApplications,
      sources,
      ready,
    } = this.state;
    const applicationMode =
      loopbackType === LoopbackAudioTrackType.LoopbackApplication;
    const processMode = loopbackType === LoopbackAudioTrackType.LoopbackProcess;
    const excludeSelf =
      loopbackType === LoopbackAudioTrackType.LoopbackSystemExcludeSelf;
    const options = sources.flatMap((source) => {
      const pids = (source.processIds ?? [])
        .slice(0, source.processCount ?? 0)
        .filter((pid) => Number.isInteger(pid) && pid > 0 && pid < 0xffffffff);
      return (processMode ? pids : [pids[0]]).map((pid) => ({
        appName: source.appName ?? '',
        title: source.windowTitle || source.appName || 'Unnamed application',
        pid,
      }));
    });
    return (
      <Form
        component="div"
        layout="vertical"
        colon={false}
        labelCol={{ style: { paddingBottom: 4 } }}
      >
        <Row gutter={8} wrap={false} align="middle" style={formItemStyle}>
          <Col>
            <label htmlFor="loopback-type">Type</label>
          </Col>
          <Col flex="auto">
            <Select
              style={{ width: '100%' }}
              id="loopback-type"
              aria-label="Capture source"
              value={loopbackType}
              options={captureModes}
              showSearch={false}
              onChange={(value) =>
                this.setState({ loopbackType: value }, () => {
                  if (value >= LoopbackAudioTrackType.LoopbackApplication)
                    this.refreshSources();
                })
              }
            />
          </Col>
        </Row>
        {applicationMode || processMode ? (
          <>
            <Row justify="space-between" align="middle">
              <Col>
                <strong>Sources</strong>
              </Col>
              <Col>
                <Button
                  size="small"
                  icon={<ReloadOutlined />}
                  disabled={!ready || (!audioOutput && !runningApplications)}
                  onClick={this.refreshSources}
                >
                  Refresh
                </Button>
              </Col>
            </Row>
            <Space size={8} wrap>
              <Checkbox
                checked={audioOutput}
                onChange={(event) =>
                  this.setState(
                    { audioOutput: event.target.checked },
                    this.refreshSources
                  )
                }
              >
                Audio output
              </Checkbox>
              <Checkbox
                checked={runningApplications}
                onChange={(event) =>
                  this.setState(
                    { runningApplications: event.target.checked },
                    this.refreshSources
                  )
                }
              >
                Running apps
              </Checkbox>
            </Space>
            <div
              style={{ maxHeight: 160, overflow: 'auto' }}
              role="group"
              aria-label="Available sources"
            >
              <List
                size="small"
                split={false}
                dataSource={options}
                locale={{
                  emptyText:
                    'No available sources. Refresh or enter a target below.',
                }}
                renderItem={(source, index) => {
                  const selected = applicationMode
                    ? appName === source.appName
                    : processId === source.pid;
                  return (
                    <List.Item key={`${source.appName}-${source.pid}-${index}`}>
                      <Button
                        block
                        type={selected ? 'primary' : 'default'}
                        ghost={selected}
                        style={{
                          height: 'auto',
                          textAlign: 'left',
                          whiteSpace: 'normal',
                          overflowWrap: 'anywhere',
                        }}
                        aria-pressed={selected}
                        disabled={applicationMode && !source.appName}
                        onClick={() =>
                          this.setState({
                            appName: source.appName,
                            processId: source.pid ?? 0,
                          })
                        }
                      >
                        <Typography.Text strong>{source.title}</Typography.Text>
                        <br />
                        <Typography.Text type="secondary">
                          {source.appName}
                          {source.pid ? ` · PID ${source.pid}` : ''}
                        </Typography.Text>
                      </Button>
                    </List.Item>
                  );
                }}
              />
            </div>
            {applicationMode ? (
              <Form.Item
                label="Application name"
                htmlFor="loopback-app"
                style={formItemStyle}
              >
                <Input
                  id="loopback-app"
                  value={appName}
                  onChange={(event) =>
                    this.setState({ appName: event.target.value })
                  }
                />
              </Form.Item>
            ) : (
              <Form.Item
                label="Process ID"
                htmlFor="loopback-pid"
                style={formItemStyle}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  id="loopback-pid"
                  min={1}
                  max={0xfffffffe}
                  precision={0}
                  value={processId || undefined}
                  onChange={(value) => this.setState({ processId: value ?? 0 })}
                />
              </Form.Item>
            )}
            {applicationMode ? (
              <Form.Item style={formItemStyle}>
                <Checkbox
                  checked={allowWaiting}
                  onChange={(event) =>
                    this.setState({ allowWaiting: event.target.checked })
                  }
                >
                  Wait for application audio
                </Checkbox>
              </Form.Item>
            ) : null}
          </>
        ) : (
          <section aria-label="Exclude applications or processes">
            {excludeSelf ? (
              <Typography.Text type="secondary">
                This mode excludes this app automatically.
              </Typography.Text>
            ) : null}
            <Form.Item
              label="Excluded applications"
              htmlFor="loopback-excluded-names"
              style={formItemStyle}
            >
              <Input
                id="loopback-excluded-names"
                value={excludedNames}
                placeholder="Comma-separated application names"
                disabled={excludeSelf}
                onChange={(event) =>
                  this.setState({ excludedNames: event.target.value })
                }
              />
            </Form.Item>
            <Form.Item
              label="Excluded PIDs"
              htmlFor="loopback-excluded-pids"
              style={formItemStyle}
            >
              <Input
                id="loopback-excluded-pids"
                value={excludedPids}
                placeholder="Comma-separated process IDs"
                disabled={excludeSelf}
                onChange={(event) =>
                  this.setState({ excludedPids: event.target.value })
                }
              />
            </Form.Item>
          </section>
        )}
        <Row gutter={8} wrap={false} align="middle">
          <Col>
            <label htmlFor="loopback-initial-volume">
              Initial publish volume
            </label>
          </Col>
          <Col flex="auto">
            <Slider
              id="loopback-initial-volume"
              min={0}
              max={400}
              value={initialVolume}
              onChange={(value) => this.setState({ initialVolume: value })}
            />
          </Col>
          <Col flex="48px">{initialVolume}%</Col>
        </Row>
      </Form>
    );
  }

  protected renderAction(): ReactElement {
    return (
      <Space style={verticalSpaceStyle} direction="vertical" size={12}>
        <Space size={8}>
          <Checkbox
            style={creationOptionStyle}
            checked={this.state.autoStartCapture}
            onChange={(event) =>
              this.setState({ autoStartCapture: event.target.checked })
            }
          >
            Auto-start capture
          </Checkbox>
          <Checkbox
            style={creationOptionStyle}
            checked={this.state.publishOnCreation}
            onChange={(event) =>
              this.setState({ publishOnCreation: event.target.checked })
            }
          >
            Publish on creation
          </Checkbox>
        </Space>
        <Button
          block
          type="primary"
          icon={<SoundOutlined />}
          disabled={!this.state.ready}
          onClick={this.createTrack}
        >
          Create track
        </Button>
      </Space>
    );
  }
}
