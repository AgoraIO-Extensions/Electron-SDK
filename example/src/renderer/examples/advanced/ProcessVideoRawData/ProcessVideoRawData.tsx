import React from 'react';
import {
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngineEventHandler,
} from 'agora-electron-sdk';
import download from 'download';
import fs from 'fs';
import os from 'os';
import path from 'path';

import Config from '../../../config/agora.config';

import {
  BaseComponent,
  BaseVideoComponentState,
} from '../../../components/BaseComponent';
import { getResourcePath } from '../../../utils';
import { AgoraButton } from '../../../components/ui';

const ffi = require('ffi-napi');
const Pointer = 'uint64';

let pluginName = 'VideoObserverPlugin';
let postfix = `_${process.arch}`;
if (process.platform === 'darwin') {
  postfix += '.dylib';
} else if (process.platform === 'win32') {
  postfix += '.dll';
}
pluginName += postfix;

interface State extends BaseVideoComponentState {
  enablePlugin: boolean;
}

export default class ProcessVideoRawData
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler
{
  pluginLibrary?: any;
  plugin?: any;

  protected createState(): State {
    return {
      appId: Config.appId,
      enableVideo: true,
      channelId: Config.channelId,
      token: Config.token,
      uid: Config.uid,
      joinChannelSuccess: false,
      remoteUsers: [],
      startPreview: false,
      enablePlugin: false,
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
      logConfig: { filePath: Config.SDKLogPath },
      // Should use ChannelProfileLiveBroadcasting on most of cases
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });
    this.engine.registerEventHandler(this);

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
   * Step 3: enablePlugin
   */
  enablePlugin = async () => {
    const version = '4.1.0-beta.1';
    const url = `https://github.com/AgoraIO-Extensions/RawDataPluginSample/releases/download/${version}/${pluginName}`;
    const dllPath = path.resolve(os.tmpdir(), pluginName);
    if (!fs.existsSync(dllPath)) {
      console.log(`start downloading plugin ${url} to ${dllPath}`);
      await download(url, os.tmpdir());
      console.log(`download success`);
    }

    this.pluginLibrary ??= ffi.Library(dllPath, {
      EnablePlugin: ['bool', [Pointer]],
      DisablePlugin: ['bool', [Pointer]],
      CreateSamplePlugin: [Pointer, [Pointer]],
      DestroySamplePlugin: ['void', [Pointer]],
    });

    const handle = this.engine?.getNativeHandle();
    this.plugin = this.pluginLibrary.CreateSamplePlugin(handle);
    this.pluginLibrary.EnablePlugin(this.plugin);
    this.setState({ enablePlugin: true });
  };

  /**
   * Step 4: disablePlugin
   */
  disablePlugin = () => {
    if (!this.plugin) {
      this.error('plugin is invalid');
      return;
    }

    this.pluginLibrary.DisablePlugin(this.plugin);
    this.pluginLibrary.DestroySamplePlugin(this.plugin);
    this.plugin = undefined;
    this.setState({ enablePlugin: false });
  };

  /**
   * Step 5: leaveChannel
   */
  protected leaveChannel() {
    this.engine?.leaveChannel();
  }

  /**
   * Step 6: releaseRtcEngine
   */
  protected releaseRtcEngine() {
    this.disablePlugin();
    this.engine?.unregisterEventHandler(this);
    this.engine?.release();
  }

  protected renderAction(): React.ReactNode {
    const { enablePlugin } = this.state;
    return (
      <>
        <AgoraButton
          title={`${enablePlugin ? 'disable' : 'enable'} Plugin`}
          onPress={enablePlugin ? this.disablePlugin : this.enablePlugin}
        />
      </>
    );
  }
}
