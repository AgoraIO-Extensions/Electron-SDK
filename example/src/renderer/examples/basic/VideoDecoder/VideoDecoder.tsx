import {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngineEventHandler,
  IRtcEngineEx,
  RenderModeType,
  RtcConnection,
  UserOfflineReasonType,
  VideoSourceType,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import React, { ReactElement } from 'react';

import {
  BaseAudioComponentState,
  BaseComponent,
} from '../../../components/BaseComponent';
import { AgoraTextInput } from '../../../components/ui';
import Config from '../../../config/agora.config';
import { askMediaAccess } from '../../../utils/permissions';

interface State extends BaseAudioComponentState {
  fps: number;
  decodeRemoteUserUid: number;
  decodeRemoteUserUidJoined: boolean;
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
      decodeRemoteUserUid: 7,
      decodeRemoteUserUidJoined: false,
      remoteUsers: [],
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
    this.engine = createAgoraRtcEngine() as IRtcEngineEx;
    this.engine.initialize({
      appId,
      logConfig: { filePath: Config.logFilePath },
      // Should use ChannelProfileLiveBroadcasting on most of cases
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });
    this.engine.registerEventHandler(this);

    // Need granted the microphone and camera permission
    await askMediaAccess(['microphone', 'camera', 'screen']);

    // Need to enable video on this case
    // If you only call `enableAudio`, only relay the audio stream to the target channel
    this.engine.enableVideo();
    // Start preview before joinChannel
    this.engine?.startPreview();
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
    if (remoteUid === this.state.decodeRemoteUserUid) {
      this.setState({
        decodeRemoteUserUidJoined: false,
      });
    }
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
    if (remoteUid === this.state.decodeRemoteUserUid) {
      this.setState({
        decodeRemoteUserUidJoined: true,
      });
    }
  }

  protected renderUsers(): ReactElement | undefined {
    let {
      decodeRemoteUserUid,
      decodeRemoteUserUidJoined,
      startPreview,
      joinChannelSuccess,
    } = this.state;
    return (
      <>
        {!!startPreview || joinChannelSuccess
          ? this.renderUser({
              sourceType: VideoSourceType.VideoSourceCamera,
            })
          : undefined}
        {joinChannelSuccess && decodeRemoteUserUid && decodeRemoteUserUidJoined
          ? this.renderUser({
              uid: decodeRemoteUserUid,
              sourceType: VideoSourceType.VideoSourceRemote,
              // Use WebCodecs to decode video stream
              // only support one remote stream to decode at the same time for now
              useWebCodecsDecoder: true,
              renderMode: RenderModeType.RenderModeFit,
            })
          : undefined}
      </>
    );
  }

  protected renderConfiguration(): ReactElement | undefined {
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
          placeholder={`remoteUserUid (defaults: ${
            this.createState().decodeRemoteUserUid
          })`}
        />
      </>
    );
  }
}