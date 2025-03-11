import fs from 'fs';
import os from 'os';
import path from 'path';

import {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngineEventHandler,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import download from 'download';

import React, { ReactElement } from 'react';

import {
  BaseAudioComponentState,
  BaseComponent,
} from '../../../components/BaseComponent';
import { AgoraButton, AgoraDivider, AgoraSwitch } from '../../../components/ui';
import Config from '../../../config/agora.config';
import { askMediaAccess } from '../../../utils/permissions';

interface State extends BaseAudioComponentState {
  loopbackRecording: boolean;
}

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
      loopbackRecording: false,
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
		//@ts-ignore
		window.aEngine = this.engine;
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

    const url = `https://github.com/AgoraIO-Extensions/Electron-SDK/releases/download/v4.2.6-build.9-rc.1/AgoraALD.zip`;
    const dllPath = path.resolve(os.tmpdir(), 'AgoraALD.driver');
    if (fs.existsSync(dllPath)) {
      fs.rmSync(dllPath, { recursive: true, force: true });
    }
    console.log(`start downloading plugin ${url} to ${dllPath}`);
    await download(encodeURI(url), os.tmpdir(), { extract: true });
    console.log(`download success`);
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
        'che.audio.mac.loopback.custom_install_path': path.resolve(
          os.tmpdir(),
          'AgoraALD.driver'
        ),
      })
    );
    // to enable AgoraALD, you need to enable loopback recording first and then disable it immediately.
    this.engine?.enableLoopbackRecording(true, 'AgoraALD');
    this.engine?.enableLoopbackRecording(false, 'AgoraALD');
  };

  _enableLoopbackRecording = (enabled: boolean) => {
    this.engine?.enableLoopbackRecording(enabled);
  };

  protected renderConfiguration(): ReactElement | undefined {
    const { loopbackRecording } = this.state;
    return (
      <>
        <AgoraSwitch
          title={'loopbackRecording'}
          value={loopbackRecording}
          onValueChange={(value) => {
            this.setState({ loopbackRecording: value });
            this.engine?.enableLoopbackRecording(value);
          }}
        />
        <AgoraDivider />
      </>
    );
  }

  protected renderAction(): ReactElement | undefined {
    return (
      <>
        <AgoraButton title={`setup AgoraALD`} onPress={this._setupAgoraALD} />
      </>
    );
  }
}
