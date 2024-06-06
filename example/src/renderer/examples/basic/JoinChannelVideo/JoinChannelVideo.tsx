import {
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
  AgoraView,
  RtcSurfaceView,
} from '../../../components/ui';
import Config from '../../../config/agora.config';
import { arrayToItems } from '../../../utils';
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

  onLocalVideoStats(source: VideoSourceType, stats: LocalVideoStats): void {
    console.log(stats);
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
    const { joinChannelSuccess, remoteUsers, selectedUser } = this.state;
    return (
      <>
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
