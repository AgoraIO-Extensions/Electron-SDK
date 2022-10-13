import React, { Component, ReactNode } from 'react';
import {
  ErrorCodeType,
  IRtcEngine,
  IRtcEngineEventHandler,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
} from 'agora-electron-sdk';
import { Card, List } from 'antd';

import AgoraStyle from '../examples/config/public.scss';
import {
  AgoraButton,
  AgoraDivider,
  AgoraText,
  AgoraTextInput,
  AgoraView,
} from './ui';
import RtcSurfaceView from './RtcSurfaceView';

export interface BaseComponentState {
  appId: string;
  enableVideo: boolean;
  channelId?: string;
  token?: string;
  uid?: number;
  joinChannelSuccess?: boolean;
  remoteUsers?: number[];
  startPreview?: boolean;
}

export interface BaseAudioComponentState extends BaseComponentState {
  channelId: string;
  token: string;
  uid: number;
  joinChannelSuccess: boolean;
  remoteUsers: number[];
}

export interface BaseVideoComponentState extends BaseAudioComponentState {
  startPreview: boolean;
}

export abstract class BaseComponent<
    P = {},
    S extends BaseComponentState = BaseComponentState
  >
  extends Component<P, S>
  implements IRtcEngineEventHandler
{
  protected engine?: IRtcEngine;

  protected constructor(props: P) {
    super(props);
    this.state = this.createState();
  }

  componentDidMount() {
    this.initRtcEngine();
    // @ts-ignore
    window.agoraRtcEngine = this.engine;
  }

  componentWillUnmount() {
    this.releaseRtcEngine();
  }

  protected abstract createState(): S;

  protected abstract initRtcEngine(): void;

  protected joinChannel() {}

  protected leaveChannel() {}

  protected abstract releaseRtcEngine(): void;

  onError(err: ErrorCodeType, msg: string) {
    this.info('onError', 'err', err, 'msg', msg);
  }

  onJoinChannelSuccess(connection: RtcConnection, elapsed: number) {
    this.info(
      'onJoinChannelSuccess',
      'connection',
      connection,
      'elapsed',
      elapsed
    );
    this.setState({ joinChannelSuccess: true });
  }

  onLeaveChannel(connection: RtcConnection, stats: RtcStats) {
    this.info('onLeaveChannel', 'connection', connection, 'stats', stats);
    this.setState(this.createState());
  }

  onUserJoined(connection: RtcConnection, remoteUid: number, elapsed: number) {
    this.info(
      'onUserJoined',
      'connection',
      connection,
      'remoteUid',
      remoteUid,
      'elapsed',
      elapsed
    );
    const { remoteUsers } = this.state;
    if (remoteUsers === undefined) return;
    this.setState({
      remoteUsers: [...remoteUsers!, remoteUid],
    });
  }

  onUserOffline(
    connection: RtcConnection,
    remoteUid: number,
    reason: UserOfflineReasonType
  ) {
    this.info(
      'onUserOffline',
      'connection',
      connection,
      'remoteUid',
      remoteUid,
      'reason',
      reason
    );
    const { remoteUsers } = this.state;
    if (remoteUsers === undefined) return;
    this.setState({
      remoteUsers: remoteUsers!.filter((value) => value !== remoteUid),
    });
  }

  render() {
    const configuration = this.renderConfiguration();
    return (
      <AgoraView className={AgoraStyle.screen}>
        <AgoraView className={AgoraStyle.content}>
          {this.renderUsers()}
        </AgoraView>
        <AgoraView className={AgoraStyle.rightBar}>
          {this.renderChannel()}
          {configuration ? (
            <>
              <AgoraDivider>
                The Configuration of {this.constructor.name}
              </AgoraDivider>
              {configuration}
            </>
          ) : undefined}
          <AgoraDivider />
          {this.renderAction()}
        </AgoraView>
      </AgoraView>
    );
  }

  protected renderChannel(): ReactNode {
    const { channelId, joinChannelSuccess } = this.state;
    return (
      <>
        <AgoraTextInput
          onChangeText={(text) => {
            this.setState({ channelId: text });
          }}
          placeholder={`channelId`}
          value={channelId}
        />
        <AgoraButton
          title={`${joinChannelSuccess ? 'leave' : 'join'} Channel`}
          onPress={() => {
            joinChannelSuccess ? this.leaveChannel() : this.joinChannel();
          }}
        />
      </>
    );
  }

  protected renderUsers(): ReactNode {
    const {
      enableVideo,
      startPreview,
      channelId,
      joinChannelSuccess,
      remoteUsers,
    } = this.state;
    return (
      <>
        {startPreview || joinChannelSuccess ? (
          <List
            style={{ width: '100%' }}
            grid={
              enableVideo
                ? {
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 1,
                    lg: 1,
                    xl: 1,
                    xxl: 2,
                  }
                : {
                    gutter: 16,
                    column: 4,
                  }
            }
            dataSource={[0, ...remoteUsers]}
            renderItem={(item) => {
              return this.renderVideo(item, channelId);
            }}
          />
        ) : undefined}
      </>
    );
  }

  protected renderVideo(uid: number, channelId?: string): ReactNode {
    const { enableVideo } = this.state;
    return (
      <List.Item>
        <Card title={`${uid === 0 ? 'Local' : 'Remote'} Uid: ${uid}`}>
          {enableVideo ? (
            <>
              <AgoraText>Click view to mirror</AgoraText>
              <RtcSurfaceView canvas={{ uid }} connection={{ channelId }} />
            </>
          ) : undefined}
        </Card>
      </List.Item>
    );
  }

  protected renderConfiguration(): ReactNode {
    return undefined;
  }

  protected renderAction(): ReactNode {
    return undefined;
  }

  private _logSink(
    level: 'debug' | 'log' | 'info' | 'warn' | 'error',
    message?: any,
    ...optionalParams: any[]
  ): string {
    console[level](message, optionalParams);
    return `${optionalParams.map((v) => JSON.stringify(v))}`;
  }

  protected debug(message?: any, ...optionalParams: any[]): void {
    this.alert(message, this._logSink('debug', message, optionalParams));
  }

  protected log(message?: any, ...optionalParams: any[]): void {
    this._logSink('log', message, optionalParams);
  }

  protected info(message?: any, ...optionalParams: any[]): void {
    this._logSink('info', message, optionalParams);
  }

  protected warn(message?: any, ...optionalParams: any[]): void {
    this._logSink('warn', message, optionalParams);
  }

  protected error(message?: any, ...optionalParams: any[]): void {
    this._logSink('error', message, optionalParams);
  }

  protected alert(title: string, message?: string): void {
    alert(`${title}: ${message}`);
  }
}
