import {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngineEventHandler,
  IRtcEngineEx,
  RtcConnection,
  RtcStats,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import React, { ReactElement } from 'react';

import {
  BaseComponent,
  BaseVideoComponentState,
} from '../../../components/BaseComponent';
import {
  AgoraButton,
  AgoraList,
  AgoraSwitch,
  AgoraTextInput,
  AgoraView,
} from '../../../components/ui';
import Config from '../../../config/agora.config';
import { askMediaAccess } from '../../../utils/permissions';

interface State extends BaseVideoComponentState {
  channelId2: string;
  token2: string;
  uid2: number;
  joinChannelSuccess2: boolean;
  remoteUsers2: number[];
  width: number;
  height: number;
  frameRate: number;
  bitrate: number;
  width2: number;
  height2: number;
  frameRate2: number;
  bitrate2: number;
  publishCameraRelayTrack: boolean;
  publishCameraRelayTrack2: boolean;
  publishCameraTrack: boolean;
  publishCameraTrack2: boolean;
  muteLocalAudioStreamEx1: boolean;
  muteLocalAudioStreamEx2: boolean;
  muteLocalVideoStreamEx1: boolean;
  muteLocalVideoStreamEx2: boolean;
}

export default class JoinMultipleChannel
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler
{
  // @ts-ignore
  protected engine?: IRtcEngineEx;

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
      channelId2: '',
      token2: '',
      uid2: 0,
      joinChannelSuccess2: false,
      remoteUsers2: [],
      width: 1920,
      height: 1080,
      frameRate: 15,
      bitrate: 2000,
      width2: 1920,
      height2: 1080,
      frameRate2: 15,
      bitrate2: 2000,
      publishCameraRelayTrack: false,
      publishCameraRelayTrack2: false,
      publishCameraTrack: false,
      publishCameraTrack2: false,
      muteLocalAudioStreamEx1: false,
      muteLocalAudioStreamEx2: false,
      muteLocalVideoStreamEx1: false,
      muteLocalVideoStreamEx2: false,
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
    await askMediaAccess(['microphone', 'camera']);

    // Need to enable video on this case
    // If you only call `enableAudio`, only relay the audio stream to the target channel
    this.engine.enableVideo();

    // Need to startPreview before joinChannelEx
    this.engine.startPreview();
    this.setState({ startPreview: true });
  }

  /**
   * Step 2-1: joinChannelEx1
   */
  protected joinChannelEx1() {
    const { channelId, token, uid, publishCameraTrack } = this.state;
    if (!channelId) {
      this.error('channelId is invalid');
      return;
    }
    if (uid <= 0) {
      this.error('uid is invalid');
      return;
    }

    // start joining channel
    // 1. Users can only see each other after they join the
    // same channel successfully using the same app id.
    // 2. If app certificate is turned on at dashboard, token is needed
    // when joining channel. The channel name and uid used to calculate
    // the token has to match the ones used for channel join
    this.engine?.joinChannelEx(
      token,
      {
        channelId,
        localUid: uid,
      },
      {
        // Make myself as the broadcaster to send stream to remote
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        autoSubscribeAudio: false,
        autoSubscribeVideo: false,
        publishCameraTrack: publishCameraTrack,
      }
    );
  }

  /**
   * Step 2-2: joinChannelEx2
   */
  protected joinChannelEx2() {
    const { channelId2, token2, uid2, publishCameraTrack2 } = this.state;
    if (!channelId2) {
      this.error('channelId2 is invalid');
      return;
    }
    if (uid2 <= 0) {
      this.error('uid2 is invalid');
      return;
    }

    // start joining channel
    // 1. Users can only see each other after they join the
    // same channel successfully using the same app id.
    // 2. If app certificate is turned on at dashboard, token is needed
    // when joining channel. The channel name and uid used to calculate
    // the token has to match the ones used for channel join
    this.engine?.joinChannelEx(
      token2,
      {
        channelId: channelId2,
        localUid: uid2,
      },
      {
        // Make myself as the broadcaster to send stream to remote
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        publishCameraTrack: publishCameraTrack2,
        autoSubscribeAudio: false,
        autoSubscribeVideo: false,
      }
    );
  }

  /**
   * Step 4-1: leaveChannelEx1
   */
  protected leaveChannelEx1() {
    const { channelId, uid } = this.state;
    this.engine?.leaveChannelEx({
      channelId,
      localUid: uid,
    });
  }

  /**
   * Step 4-2: leaveChannelEx2
   */
  protected leaveChannelEx2() {
    const { channelId2, uid2 } = this.state;
    this.engine?.leaveChannelEx({
      channelId: channelId2,
      localUid: uid2,
    });
  }

  /**
   * Step 5: releaseRtcEngine
   */
  protected releaseRtcEngine() {
    this.engine?.unregisterEventHandler(this);
    this.engine?.release();
  }

  onJoinChannelSuccess(connection: RtcConnection, elapsed: number) {
    this.info(
      'onJoinChannelSuccess',
      'connection',
      connection,
      'elapsed',
      elapsed
    );
    const { channelId, channelId2, uid, uid2 } = this.state;
    if (connection.channelId === channelId && connection.localUid === uid) {
      this.setState({
        joinChannelSuccess: true,
      });
    } else if (
      connection.channelId === channelId2 &&
      connection.localUid === uid2
    ) {
      this.setState({
        joinChannelSuccess2: true,
      });
    }
  }

  onLeaveChannel(connection: RtcConnection, stats: RtcStats) {
    this.info('onLeaveChannel', 'connection', connection, 'stats', stats);
    const { channelId, channelId2, uid, uid2 } = this.state;
    if (connection.channelId === channelId && connection.localUid === uid) {
      this.setState({
        joinChannelSuccess: false,
        remoteUsers: [],
      });
    } else if (
      connection.channelId === channelId2 &&
      connection.localUid === uid2
    ) {
      this.setState({
        joinChannelSuccess2: false,
        remoteUsers2: [],
      });
    }
    // Keep preview after leave channel
    this.engine?.startPreview();
  }

  setVideoEncoderConfigurationEx = () => {
    const { uid, channelId, width, height, frameRate, bitrate } = this.state;

    if (!channelId) {
      this.error('channelId is invalid');
      return;
    }
    if (uid <= 0) {
      this.error('uid is invalid');
      return;
    }

    this.engine?.setVideoEncoderConfigurationEx(
      {
        dimensions: {
          width,
          height,
        },
        frameRate,
        bitrate,
      },
      { localUid: uid, channelId: channelId }
    );
  };

  setVideoEncoderConfigurationEx2 = () => {
    const { uid2, channelId2, width2, height2, frameRate2, bitrate2 } =
      this.state;

    if (!channelId2) {
      this.error('channelId2 is invalid');
      return;
    }
    if (uid2 <= 0) {
      this.error('uid2 is invalid');
      return;
    }

    this.engine?.setVideoEncoderConfigurationEx(
      {
        dimensions: {
          width: width2,
          height: height2,
        },
        frameRate: frameRate2,
        bitrate: bitrate2,
      },
      { localUid: uid2, channelId: channelId2 }
    );
  };

  muteLocalAudioStreamEx1 = () => {
    const { channelId, uid } = this.state;
    this.engine?.muteLocalAudioStreamEx(true, { channelId, localUid: uid });
    this.setState({ muteLocalAudioStreamEx1: true });
  };

  unmuteLocalAudioStreamEx1 = () => {
    const { channelId, uid } = this.state;
    this.engine?.muteLocalAudioStreamEx(false, { channelId, localUid: uid });
    this.setState({ muteLocalAudioStreamEx1: false });
  };

  muteLocalVideoStreamEx1 = () => {
    const { channelId, uid } = this.state;
    this.engine?.muteLocalVideoStreamEx(true, { channelId, localUid: uid });
    this.setState({ muteLocalVideoStreamEx1: true });
  };

  unmuteLocalVideoStreamEx1 = () => {
    const { channelId, uid } = this.state;
    this.engine?.muteLocalVideoStreamEx(false, { channelId, localUid: uid });
    this.setState({ muteLocalVideoStreamEx1: false });
  };

  muteLocalAudioStreamEx2 = () => {
    const { channelId2, uid2 } = this.state;
    this.engine?.muteLocalAudioStreamEx(true, {
      channelId: channelId2,
      localUid: uid2,
    });
    this.setState({ muteLocalAudioStreamEx2: true });
  };

  unmuteLocalAudioStreamEx2 = () => {
    const { channelId2, uid2 } = this.state;
    this.engine?.muteLocalAudioStreamEx(false, {
      channelId: channelId2,
      localUid: uid2,
    });
    this.setState({ muteLocalAudioStreamEx2: false });
  };

  muteLocalVideoStreamEx2 = () => {
    const { channelId2, uid2 } = this.state;
    this.engine?.muteLocalVideoStreamEx(true, {
      channelId: channelId2,
      localUid: uid2,
    });
    this.setState({ muteLocalVideoStreamEx2: true });
  };

  unmuteLocalVideoStreamEx2 = () => {
    const { channelId2, uid2 } = this.state;
    this.engine?.muteLocalVideoStreamEx(false, {
      channelId: channelId2,
      localUid: uid2,
    });
    this.setState({ muteLocalVideoStreamEx2: false });
  };

  protected renderChannel(): ReactElement | undefined {
    const {
      channelId,
      channelId2,
      uid,
      uid2,
      publishCameraRelayTrack,
      publishCameraTrack,
      joinChannelSuccess,
      joinChannelSuccess2,
      publishCameraRelayTrack2,
      publishCameraTrack2,
    } = this.state;
    return (
      <>
        <AgoraTextInput
          onChangeText={(text) => {
            this.setState({ channelId: text });
          }}
          placeholder={`channelId`}
          value={channelId}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              uid: text === '' ? this.createState().uid : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`uid (must > 0)`}
          value={uid > 0 ? uid.toString() : ''}
        />
        <AgoraView>
          <AgoraSwitch
            title={`publishCameraTrack`}
            value={publishCameraTrack}
            onValueChange={(value) => {
              this.setState({ publishCameraTrack: value });
            }}
          />
          <AgoraSwitch
            title={`publishCameraRelayTrack`}
            value={publishCameraRelayTrack}
            onValueChange={(value) => {
              this.setState({ publishCameraRelayTrack: value });
            }}
          />
          <AgoraTextInput
            onChangeText={(text) => {
              if (isNaN(+text)) return;
              this.setState({
                width: text === '' ? this.createState().width : +text,
              });
            }}
            numberKeyboard={true}
            placeholder={`width (defaults: ${this.createState().width})`}
          />
          <AgoraTextInput
            onChangeText={(text) => {
              if (isNaN(+text)) return;
              this.setState({
                height: text === '' ? this.createState().height : +text,
              });
            }}
            numberKeyboard={true}
            placeholder={`height (defaults: ${this.createState().height})`}
          />
        </AgoraView>
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              frameRate: text === '' ? this.createState().frameRate : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`frameRate (defaults: ${this.createState().frameRate})`}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              bitrate: text === '' ? this.createState().bitrate : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`bitrate (defaults: ${this.createState().bitrate})`}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              width: text === '' ? this.createState().width : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`width (defaults: ${this.createState().width})`}
        />
        <AgoraButton
          title={`setVideoEncoderConfigurationEx`}
          onPress={this.setVideoEncoderConfigurationEx}
        />
        <AgoraButton
          title={`${joinChannelSuccess ? 'leave' : 'join'} Channel`}
          onPress={() => {
            joinChannelSuccess ? this.leaveChannelEx1() : this.joinChannelEx1();
          }}
        />
        <AgoraButton
          title={`muteLocalAudioStreamEx1`}
          onPress={this.muteLocalAudioStreamEx1}
        />
        <AgoraButton
          title={`unmuteLocalAudioStreamEx1`}
          onPress={this.unmuteLocalAudioStreamEx1}
        />
        <AgoraButton
          title={`muteLocalVideoStreamEx1`}
          onPress={this.muteLocalVideoStreamEx1}
        />
        <AgoraButton
          title={`unmuteLocalVideoStreamEx1`}
          onPress={this.unmuteLocalVideoStreamEx1}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            this.setState({ channelId2: text });
          }}
          placeholder={`channelId2`}
          value={channelId2}
        />
        <AgoraTextInput
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
        <AgoraView>
          <AgoraSwitch
            title={`publishCameraTrack2`}
            value={publishCameraTrack2}
            onValueChange={(value) => {
              this.setState({ publishCameraTrack2: value });
            }}
          />
          <AgoraSwitch
            title={`publishCameraRelayTrack2`}
            value={publishCameraRelayTrack2}
            onValueChange={(value) => {
              this.setState({ publishCameraRelayTrack2: value });
            }}
          />
          <AgoraTextInput
            onChangeText={(text) => {
              if (isNaN(+text)) return;
              this.setState({
                width: text === '' ? this.createState().width : +text,
              });
            }}
            numberKeyboard={true}
            placeholder={`width (defaults: ${this.createState().width})`}
          />
          <AgoraTextInput
            onChangeText={(text) => {
              if (isNaN(+text)) return;
              this.setState({
                height: text === '' ? this.createState().height : +text,
              });
            }}
            numberKeyboard={true}
            placeholder={`height (defaults: ${this.createState().height})`}
          />
        </AgoraView>
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              frameRate: text === '' ? this.createState().frameRate : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`frameRate (defaults: ${this.createState().frameRate})`}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              bitrate: text === '' ? this.createState().bitrate : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`bitrate (defaults: ${this.createState().bitrate})`}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              width: text === '' ? this.createState().width : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`width (defaults: ${this.createState().width})`}
        />
        <AgoraButton
          title={`setVideoEncoderConfigurationEx`}
          onPress={this.setVideoEncoderConfigurationEx}
        />
        <AgoraButton
          title={`${joinChannelSuccess2 ? 'leave' : 'join'} Channel2`}
          onPress={() => {
            joinChannelSuccess2
              ? this.leaveChannelEx2()
              : this.joinChannelEx2();
          }}
        />
        <AgoraButton
          title={`muteLocalAudioStreamEx2`}
          onPress={this.muteLocalAudioStreamEx2}
        />
        <AgoraButton
          title={`unmuteLocalAudioStreamEx2`}
          onPress={this.unmuteLocalAudioStreamEx2}
        />
        <AgoraButton
          title={`muteLocalVideoStreamEx2`}
          onPress={this.muteLocalVideoStreamEx2}
        />
        <AgoraButton
          title={`unmuteLocalVideoStreamEx2`}
          onPress={this.unmuteLocalVideoStreamEx2}
        />
      </>
    );
  }

  protected renderUsers(): ReactElement | undefined {
    const {
      startPreview,
      channelId,
      channelId2,
      uid,
      uid2,
      joinChannelSuccess,
      joinChannelSuccess2,
      remoteUsers,
      remoteUsers2,
    } = this.state;
    return (
      <>
        {startPreview || joinChannelSuccess || joinChannelSuccess2 ? (
          <AgoraList
            data={[0, ...remoteUsers, ...remoteUsers2]}
            renderItem={(item) => {
              return this.renderVideo(
                { uid: item },
                {
                  channelId:
                    remoteUsers2.indexOf(item) === -1 ? channelId : channelId2,
                  localUid: remoteUsers2.indexOf(item) === -1 ? uid : uid2,
                }
              );
            }}
          />
        ) : undefined}
      </>
    );
  }
}
