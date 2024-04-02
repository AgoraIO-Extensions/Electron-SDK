import {
  AgoraEnv,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngineEventHandler,
  IRtcEngineEx,
  RtcConnection,
  UserOfflineReasonType,
  VideoSourceType,
  VideoStreamType,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import React, { ReactElement } from 'react';

import {
  BaseAudioComponentState,
  BaseComponent,
} from '../../../components/BaseComponent';
import { AgoraList } from '../../../components/ui';
import Config from '../../../config/agora.config';
import { askMediaAccess } from '../../../utils/permissions';

interface State extends BaseAudioComponentState {
  fps: number;
}

export default class VideoDecoder
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler
{
  // @ts-ignore
  protected engine?: IRtcEngineEx;
  // private decoder?: WebCodecsDecoder;

  protected createState(): State {
    return {
      appId: Config.appId,
      fps: 0,
      enableVideo: true,
      channelId: Config.channelId,
      token: Config.token,
      uid: Config.uid,
      joinChannelSuccess: false,
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
    AgoraEnv.enableWebCodecDecode = true;
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

  onUserJoined(connection: RtcConnection, remoteUid: number, elapsed: number) {
    this.engine?.setRemoteVideoSubscriptionOptions(remoteUid, {
      type: VideoStreamType.VideoStreamHigh,
      encodedFrameOnly: true,
    });
    super.onUserJoined(connection, remoteUid, elapsed);
  }

  onUserOffline(
    connection: RtcConnection,
    remoteUid: number,
    reason: UserOfflineReasonType
  ) {
    // if (remoteUid == SCREEN_UID) {
    //   // stop decode
    //   this.decoder?.release();
    // }
    super.onUserOffline(connection, remoteUid, reason);
  }

  // protected renderUsers(): ReactElement | undefined {
  //   let { fps } = this.state;
  //   return (
  //     <>
  //       <p>Current Fps: {fps}</p>
  //       <canvas />
  //       {
  //         <RtcSurfaceView
  //           canvas={{
  //             sourceType: VideoSourceType.VideoSourceRemote,
  //             renderMode: RenderModeType.RenderModeFit,
  //           }}
  //         />
  //       }
  //     </>
  //   );
  // }

  protected renderUsers(): ReactElement | undefined {
    let { remoteUsers } = this.state;
    return (
      <>
        <AgoraList
          data={remoteUsers ?? []}
          renderItem={(item) =>
            this.renderUser({
              uid: item,
              sourceType: VideoSourceType.VideoSourceRemote,
            })
          }
        />
      </>
    );
  }
}
