import {
  BackgroundBlurDegree,
  BackgroundSourceType,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngineEventHandler,
  RenderModeType,
  VideoModulePosition,
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
  encodeAlpha: boolean;
  video_module_position: VideoModulePosition;
  enableVirtualBackground?: boolean;
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
      encodeAlpha: false,
      video_module_position: VideoModulePosition.PositionPreEncoder,
      background_source_type: BackgroundSourceType.BackgroundNone,
      color: 0xff0000,
      source: getResourcePath('agora-logo.png'),
      blur_degree: BackgroundBlurDegree.BlurDegreeMedium,
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

    // if you want to use the alpha channel, you need to set the following parameters to let remoteView support alpha channel
    this.engine?.setParameters('{"rtc.video.dec_split_alpha":true}');
    this.engine?.setVideoEncoderConfiguration({
      advanceOptions: {
        encodeAlpha: true,
      },
    });
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

  /**
   * Step 5: releaseRtcEngine
   */
  protected releaseRtcEngine() {
    this.engine?.unregisterEventHandler(this);
    this.engine?.release();
  }

  protected renderUsers(): ReactElement | undefined {
    const {
      startPreview,
      joinChannelSuccess,
      remoteUsers,
      video_module_position,
    } = this.state;
    return (
      <>
        {!!startPreview || joinChannelSuccess
          ? this.renderUser({
              position:
                video_module_position | VideoModulePosition.PositionPreRenderer,
              sourceType: VideoSourceType.VideoSourceCamera,
              renderMode: RenderModeType.RenderModeFit,
            })
          : undefined}
        {!!startPreview || joinChannelSuccess ? (
          <AgoraList
            data={remoteUsers ?? []}
            renderItem={(item) =>
              this.renderUser({
                position:
                  video_module_position |
                  VideoModulePosition.PositionPreRenderer,
                uid: item,
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
      encodeAlpha,
      startPreview,
      joinChannelSuccess,
      video_module_position,
    } = this.state;
    return (
      <>
        <AgoraDropdown
          title={'backgroundSourceType'}
          items={enumToItems(BackgroundSourceType)}
          value={background_source_type}
          onValueChange={(value) => {
            if (value !== BackgroundSourceType.BackgroundNone) {
              this.engine?.setVideoEncoderConfiguration({
                advanceOptions: {
                  encodeAlpha: false,
                },
              });
              this.setState({
                video_module_position: VideoModulePosition.PositionPreEncoder,
                encodeAlpha: false,
              });
            }
            this.disableVirtualBackground();
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
        {background_source_type === BackgroundSourceType.BackgroundImg ? (
          <AgoraTextInput
            onChangeText={(text) => {
              this.setState({
                source: text,
              });
            }}
            placeholder={'source'}
            value={source}
          />
        ) : null}
        {background_source_type === BackgroundSourceType.BackgroundBlur ? (
          <AgoraDropdown
            title={'blurDegree'}
            items={enumToItems(BackgroundBlurDegree)}
            value={blur_degree}
            onValueChange={(value) => {
              this.setState({ blur_degree: value });
            }}
          />
        ) : null}
        {background_source_type === BackgroundSourceType.BackgroundNone ? (
          <AgoraSwitch
            title={'PositionPostCapturer'}
            disabled={startPreview || joinChannelSuccess}
            value={
              video_module_position === VideoModulePosition.PositionPostCapturer
            }
            onValueChange={(value) => {
              this.setState({
                video_module_position: value
                  ? VideoModulePosition.PositionPostCapturer
                  : VideoModulePosition.PositionPreEncoder,
              });
            }}
          />
        ) : null}
        {background_source_type === BackgroundSourceType.BackgroundNone ? (
          <AgoraSwitch
            title={'encodeAlpha'}
            //attention: encodeAlpha can only change before rendering, when rendering, you can't change it, otherwise, it will cause rendering error and crash
            disabled={startPreview || joinChannelSuccess}
            value={encodeAlpha}
            onValueChange={(value) => {
              this.setState({ encodeAlpha: value });
              this.engine?.setVideoEncoderConfiguration({
                advanceOptions: {
                  encodeAlpha: value,
                },
              });
            }}
          />
        ) : null}
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
