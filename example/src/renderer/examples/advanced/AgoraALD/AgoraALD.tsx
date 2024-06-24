import {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngineEventHandler,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';

import React, { ReactElement } from 'react';

import {
  BaseAudioComponentState,
  BaseComponent,
} from '../../../components/BaseComponent';
import { AgoraButton } from '../../../components/ui';
import Config from '../../../config/agora.config';
import { getResourcePath } from '../../../utils';
import { askMediaAccess } from '../../../utils/permissions';

interface State extends BaseAudioComponentState {}

export default class AgoraALD
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

  _setupAgoraALD = () => {
    this.engine?.setParameters(
      JSON.stringify({
        'che.audio.mac.loopback.custom_install_path':
          getResourcePath('AgoraALD.driver'),
      })
    );
    // to enable AgoraALD, you need to enable loopback recording first and then disable it immediately.
    this.engine?.enableLoopbackRecording(true, 'AgoraALD');
    this.engine?.enableLoopbackRecording(false, 'AgoraALD');
  };

  protected renderAction(): ReactElement | undefined {
    return (
      <>
        <AgoraButton title={`setup AgoraALD`} onPress={this._setupAgoraALD} />
      </>
    );
  }
}
