import {
  AgoraEnv,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngineEventHandler,
  IRtcEngineEx,
  LogFilterType,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
  VideoSourceType,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import React, { ReactElement } from 'react';

import {
  BaseAudioComponentState,
  BaseComponent,
} from '../../../components/BaseComponent';
import { AgoraButton, AgoraTextInput } from '../../../components/ui';
import Config from '../../../config/agora.config';
import { askMediaAccess } from '../../../utils/permissions';

interface State extends BaseAudioComponentState {
  token2: string;
  uid2: number;
  fps: number;
  joinChannelExSuccess: boolean;
  decodeRemoteUserUid: number;
}

export default class VideoDecoder
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler
{
  protected engine?: IRtcEngineEx;

  protected createState(): State {
    return {
      appId: Config.appId,
      fps: 0,
      enableVideo: true,
      channelId: Config.channelId,
      token: Config.token,
      uid: Config.uid,
      joinChannelSuccess: false,
      decodeRemoteUserUid: 0,
      token2: '',
      uid2: 0,
      remoteUsers: [],
      joinChannelExSuccess: false,
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
    this.engine = createAgoraRtcEngine() as IRtcEngineEx;
    // need to enable WebCodecsDecoder before call engine.initialize
    // if enableWebCodecsDecoder is true, the video stream will be decoded by WebCodecs
    // will automatically register videoEncodedFrameObserver
    // videoEncodedFrameObserver will be released when engine.release
    AgoraEnv.enableWebCodecsDecoder = true;
    this.engine.initialize({
      appId,
      logConfig: { filePath: Config.logFilePath },
      // Should use ChannelProfileLiveBroadcasting on most of cases
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });
    this.engine.setLogFilter(LogFilterType.LogFilterDebug);
    this.engine.registerEventHandler(this);

    // Need granted the microphone and camera permission
    await askMediaAccess(['microphone', 'camera', 'screen']);

    // Need to enable video on this case
    // If you only call `enableAudio`, only relay the audio stream to the target channel
    this.engine.enableVideo();
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
   * Step 2-1(optional): joinChannelEx
   */
  protected joinChannelEx = () => {
    const { channelId, token2, uid2 } = this.state;
    if (!channelId) {
      this.error('channelId is invalid');
      return;
    }
    if (uid2 <= 0) {
      this.error('uid2 is invalid');
      return;
    }
    // publish screen share stream
    this.engine?.joinChannelEx(
      token2,
      { channelId, localUid: uid2 },
      {
        autoSubscribeAudio: true,
        autoSubscribeVideo: true,
        publishMicrophoneTrack: false,
        publishCameraTrack: false,
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      }
    );
  };

  /**
   * Step 2-2(optional): leaveChannelEx
   */
  leaveChannelEx = () => {
    const { channelId, uid2 } = this.state;
    this.engine?.leaveChannelEx({ channelId, localUid: uid2 });
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

  onJoinChannelSuccess(connection: RtcConnection, elapsed: number) {
    const { uid2 } = this.state;
    if (connection.localUid === uid2) {
      this.setState({ joinChannelExSuccess: true });
    } else {
      this.setState({ joinChannelSuccess: true });
    }
    this.info(
      'onJoinChannelSuccess',
      'connection',
      connection,
      'elapsed',
      elapsed
    );
  }

  onLeaveChannel(connection: RtcConnection, stats: RtcStats) {
    const { uid2 } = this.state;
    if (connection.localUid === uid2) {
      this.setState({ joinChannelExSuccess: false });
    } else {
      this.setState({ joinChannelSuccess: false });
    }
    this.info('onLeaveChannel', 'connection', connection, 'stats', stats);
    this.setState(this.createState());
  }

  protected renderUsers(): ReactElement | undefined {
    let {
      decodeRemoteUserUid,
      remoteUsers,
      joinChannelSuccess,
      joinChannelExSuccess,
    } = this.state;
    return (
      <>
        {joinChannelSuccess
          ? remoteUsers.map((item) =>
              this.renderUser({
                uid: item,
                // Use WebCodecs to decode video stream
                // only support one remote stream to decode at the same time for now
                useWebCodecsDecoder: item === decodeRemoteUserUid,
                enableFps: item === decodeRemoteUserUid,
                sourceType: VideoSourceType.VideoSourceRemote,
              })
            )
          : undefined}
        {joinChannelExSuccess
          ? remoteUsers.map((item) =>
              this.renderUser({
                uid: item,
                // Use WebCodecs to decode video stream
                // only support one remote stream to decode at the same time for now
                useWebCodecsDecoder: item === decodeRemoteUserUid,
                enableFps: item === decodeRemoteUserUid,
                sourceType: VideoSourceType.VideoSourceRemote,
              })
            )
          : undefined}
      </>
    );
  }

  protected renderChannel(): ReactElement | undefined {
    const { channelId, joinChannelSuccess, joinChannelExSuccess } = this.state;
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
          disabled={joinChannelExSuccess}
          onPress={() => {
            joinChannelSuccess ? this.leaveChannel() : this.joinChannel();
          }}
        />
      </>
    );
  }

  protected renderConfiguration(): ReactElement | undefined {
    let {
      joinChannelExSuccess,
      uid2,
      joinChannelSuccess,
      decodeRemoteUserUid,
    } = this.state;
    return (
      <>
        <AgoraTextInput
          disabled={this.state.joinChannelSuccess}
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              decodeRemoteUserUid:
                text === '' ? this.createState().decodeRemoteUserUid : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`useWebCodecsDecoder Uid (defaults: ${
            this.createState().decodeRemoteUserUid
          })`}
          value={decodeRemoteUserUid > 0 ? decodeRemoteUserUid.toString() : ''}
        />
        <AgoraTextInput
          editable={!joinChannelExSuccess && !joinChannelSuccess}
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              uid2: text === '' ? this.createState().uid2 : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`uid2 (must > 0)`}
          value={uid2 > 0 ? uid2.toString() : ''}
        />
        <AgoraButton
          title={`${joinChannelExSuccess ? 'leave' : 'join'} channelEx`}
          disabled={joinChannelSuccess}
          onPress={
            joinChannelExSuccess ? this.leaveChannelEx : this.joinChannelEx
          }
        />
      </>
    );
  }
}
