import {
  AgoraEnv,
  BackgroundBlurDegree,
  BackgroundSourceType,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngineEventHandler,
  VideoSourceType,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import React, { ReactElement } from 'react';
import { SketchPicker } from 'react-color';

import {
  BaseComponent,
  BaseVideoComponentState,
} from '../../../components/BaseComponent';
import {
  AgoraButton,
  AgoraDropdown,
  AgoraList,
  AgoraSwitch,
  AgoraTextInput,
} from '../../../components/ui';
import Config from '../../../config/agora.config';
import { enumToItems, getResourcePath } from '../../../utils';
import { askMediaAccess } from '../../../utils/permissions';

interface State extends BaseVideoComponentState {
  background_source_type: BackgroundSourceType;
  color: number;
  source: string;
  blur_degree: BackgroundBlurDegree;
  enableVirtualBackground: boolean;
  enableAlphaMask: boolean;
}

export default class VirtualBackground
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
      startPreview: false,
      background_source_type: BackgroundSourceType.BackgroundNone,
      color: 0xffffff,
      source: getResourcePath('agora-logo.png'),
      blur_degree: BackgroundBlurDegree.BlurDegreeMedium,
      enableVirtualBackground: false,
      enableAlphaMask: true,
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

    this.engine?.enableExtension(
      'agora_video_filters_segmentation',
      'portrait_segmentation',
      true
    );

    // Need to enable video on this case
    // If you only call `enableAudio`, only relay the audio stream to the target channel
    this.engine.enableVideo();
    this.engine.setParameters(
      JSON.stringify({ 'rtc.video.send_alpha_data': true })
    );
    this.engine.setParameters(
      JSON.stringify({ 'rtc.video.alpha_data_codec_type': 3 })
    );
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
   * Step 3-1: enableVirtualBackground
   */
  enableVirtualBackground = async () => {
    const { background_source_type, color, source, blur_degree } = this.state;
    if (
      background_source_type === BackgroundSourceType.BackgroundImg &&
      !source
    ) {
      this.error('source is invalid');
      return;
    }

    this.engine?.enableVirtualBackground(
      true,
      {
        background_source_type,
        color,
        source,
        blur_degree,
      },
      {}
    );
    this.setState({ enableVirtualBackground: true });
  };

  /**
   * Step 3-2: disableVirtualBackground
   */
  disableVirtualBackground = () => {
    this.engine?.enableVirtualBackground(false, {}, {});
    this.setState({ enableVirtualBackground: false });
  };

  /**
   * Step 4: leaveChannel
   */
  protected leaveChannel() {
    this.engine?.leaveChannel();
  }

  handleStartPreview = () => {
    this.engine?.startPreview();
    this.setState({ startPreview: true });
  };

  handleStopPreview = () => {
    this.engine?.stopPreview();
    this.setState({ startPreview: false });
  };

  /**
   * Step 5: releaseRtcEngine
   */
  protected releaseRtcEngine() {
    this.engine?.unregisterEventHandler(this);
    this.engine?.release();
  }

  protected renderUsers(): ReactElement | undefined {
    const { startPreview, joinChannelSuccess, remoteUsers, enableAlphaMask } =
      this.state;
    return (
      <>
        {!!startPreview || joinChannelSuccess
          ? this.renderUser({
              enableAlphaMask: enableAlphaMask,
              sourceType: VideoSourceType.VideoSourceCamera,
            })
          : undefined}
        {!!startPreview || joinChannelSuccess ? (
          <AgoraList
            data={remoteUsers ?? []}
            renderItem={(item) =>
              this.renderUser({
                uid: item,
                enableAlphaMask: enableAlphaMask,

                sourceType: VideoSourceType.VideoSourceRemote,
              })
            }
          />
        ) : undefined}
      </>
    );
  }

  protected renderConfiguration(): ReactElement | undefined {
    const {
      background_source_type,
      color,
      source,
      blur_degree,
      enableAlphaMask,
      startPreview,
      joinChannelSuccess,
    } = this.state;
    return (
      <>
        <AgoraDropdown
          title={'backgroundSourceType'}
          items={enumToItems(BackgroundSourceType)}
          value={background_source_type}
          onValueChange={(value) => {
            this.setState({ background_source_type: value });
          }}
        />
        {background_source_type === BackgroundSourceType.BackgroundColor ? (
          <SketchPicker
            onChangeComplete={({ hex }) => {
              this.setState({
                color: +hex.replace('#', '0x'),
              });
            }}
            color={`#${color?.toString(16)}`}
          />
        ) : undefined}
        <AgoraTextInput
          editable={
            background_source_type === BackgroundSourceType.BackgroundImg
          }
          onChangeText={(text) => {
            this.setState({
              source: text,
            });
          }}
          placeholder={'source'}
          value={source}
        />
        <AgoraDropdown
          enabled={
            background_source_type === BackgroundSourceType.BackgroundBlur
          }
          title={'blurDegree'}
          items={enumToItems(BackgroundBlurDegree)}
          value={blur_degree}
          onValueChange={(value) => {
            this.setState({ blur_degree: value });
          }}
        />
        <AgoraSwitch
          title={'enableAlphaMask'}
          disabled={startPreview && !joinChannelSuccess}
          value={enableAlphaMask}
          onValueChange={(value) => {
            //If you change the enableAlphaMask, you need to clear the renderer manager that will be remove all renderer
            AgoraEnv.AgoraRendererManager?.clear();
            this.setState({ enableAlphaMask: value });
          }}
        />
      </>
    );
  }

  protected renderAction(): ReactElement | undefined {
    const { startPreview, joinChannelSuccess, enableVirtualBackground } =
      this.state;
    return (
      <>
        <AgoraButton
          disabled={joinChannelSuccess}
          title={`${startPreview ? 'stop' : 'start'} Preview`}
          onPress={
            startPreview ? this.handleStopPreview : this.handleStartPreview
          }
        />
        <AgoraButton
          disabled={!(startPreview || joinChannelSuccess)}
          title={`${
            enableVirtualBackground ? 'disable' : 'enable'
          } Virtual Background`}
          onPress={
            enableVirtualBackground
              ? this.disableVirtualBackground
              : this.enableVirtualBackground
          }
        />
      </>
    );
  }
}
