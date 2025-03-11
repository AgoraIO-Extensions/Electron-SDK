import {
  ChannelProfileType,
  ClientRoleType,
  CompressionPreference,
  DegradationPreference,
  EncodingPreference,
  IRtcEngineEventHandler,
  OrientationMode,
  RenderModeType,
  VideoCodecType,
  VideoMirrorModeType,
  VideoModulePosition,
  VideoSourceType,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import { Checkbox, List } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { ReactElement } from 'react';

import {
  BaseComponent,
  BaseVideoComponentState,
} from '../../../components/BaseComponent';
import {
  AgoraButton,
  AgoraDivider,
  AgoraDropdown,
  AgoraList,
  AgoraStyle,
  AgoraSwitch,
  AgoraTextInput,
  AgoraView,
} from '../../../components/ui';
import Config from '../../../config/agora.config';
import { enumToItems } from '../../../utils';
import { askMediaAccess } from '../../../utils/permissions';

interface State extends BaseVideoComponentState {
  codecType: VideoCodecType;
  width: number;
  height: number;
  frameRate: number;
  bitrate: number;
  minBitrate: number;
  orientationMode: OrientationMode;
  renderMode: RenderModeType;
  degradationPreference: DegradationPreference;
  mirrorMode: VideoMirrorModeType;
  encodingPreference: EncodingPreference;
  compressionPreference: CompressionPreference;
  encodeAlpha: boolean;
  video_module_position: VideoModulePosition;
  checked_video_module_position_list: CheckboxValueType[];
}

export default class VideoEncoderConfiguration
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
      codecType: VideoCodecType.VideoCodecH264,
      width: 640,
      height: 360,
      frameRate: 15,
      bitrate: 0,
      minBitrate: -1,
      orientationMode: OrientationMode.OrientationModeAdaptive,
      renderMode: RenderModeType.RenderModeHidden,
      degradationPreference: DegradationPreference.MaintainQuality,
      mirrorMode: VideoMirrorModeType.VideoMirrorModeDisabled,
      encodingPreference: EncodingPreference.PreferAuto,
      compressionPreference: CompressionPreference.PreferQuality,
      encodeAlpha: false,
      video_module_position: VideoModulePosition.PositionPreEncoder,
      checked_video_module_position_list: [
        VideoModulePosition.PositionPreEncoder,
      ],
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

    // Need granted the microphone and camera permission
    await askMediaAccess(['microphone', 'camera']);

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
   * Step 3-1: setVideoRenderMode
   */
  setVideoRenderMode = () => {
    const { renderMode, mirrorMode } = this.state;
    this.engine?.setLocalRenderMode(renderMode, mirrorMode);
  };

  /**
   * Step 3-2: setVideoEncoderConfiguration
   */
  setVideoEncoderConfiguration = () => {
    const {
      codecType,
      width,
      height,
      frameRate,
      bitrate,
      minBitrate,
      orientationMode,
      degradationPreference,
      mirrorMode,
      encodeAlpha,
      encodingPreference,
      compressionPreference,
    } = this.state;
    this.engine?.setVideoEncoderConfiguration({
      codecType,
      dimensions: {
        width: width,
        height: height,
      },
      frameRate,
      bitrate,
      minBitrate,
      orientationMode,
      degradationPreference,
      mirrorMode,
      advanceOptions: {
        encodingPreference,
        compressionPreference,
        encodeAlpha,
      },
    });
  };

  handleStartPreview = () => {
    this.engine?.startPreview();
    this.setState({ startPreview: true });
    console.log(
      `startPreview with position:${this.state.video_module_position}`
    );
  };

  handleStopPreview = () => {
    this.engine?.stopPreview();
    this.setState({ startPreview: false });
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
              position: video_module_position,
              sourceType: VideoSourceType.VideoSourceCamera,
            })
          : undefined}
        {!!startPreview || joinChannelSuccess ? (
          <AgoraList
            data={remoteUsers ?? []}
            renderItem={(item) =>
              this.renderUser({
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
      startPreview,
      checked_video_module_position_list,
      codecType,
      orientationMode,
      renderMode,
      degradationPreference,
      mirrorMode,
      encodingPreference,
      encodeAlpha,
      compressionPreference,
    } = this.state;
    return (
      <>
        <>
          <p>local video module position</p>
          <Checkbox.Group
            style={{ width: '100%' }}
            value={checked_video_module_position_list}
            disabled={startPreview}
            onChange={(checkedValues) => {
              let result = 0;
              checkedValues.forEach((value: CheckboxValueType) => {
                result |= value as number;
              });
              this.setState({
                checked_video_module_position_list: checkedValues,
                video_module_position: result,
              });
            }}
          >
            <List
              itemLayout="horizontal"
              dataSource={enumToItems(VideoModulePosition)}
              renderItem={(item) =>
                item.value !== VideoModulePosition.PositionPreRenderer ? (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Checkbox value={item.value} />}
                      title={item.label}
                    />
                  </List.Item>
                ) : undefined
              }
            />
          </Checkbox.Group>
        </>
        <AgoraDropdown
          title={'codecType'}
          items={enumToItems(VideoCodecType)}
          value={codecType}
          onValueChange={(value) => {
            this.setState({ codecType: value });
          }}
        />
        <AgoraDivider />
        <AgoraView>
          <AgoraTextInput
            style={AgoraStyle.fullSize}
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
            style={AgoraStyle.fullSize}
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
              minBitrate: text === '' ? this.createState().minBitrate : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`minBitrate (defaults: ${
            this.createState().minBitrate
          })`}
        />
        <AgoraDropdown
          title={'orientationMode'}
          items={enumToItems(OrientationMode)}
          value={orientationMode}
          onValueChange={(value) => {
            this.setState({ orientationMode: value });
          }}
        />
        <AgoraDivider />
        <AgoraDropdown
          title={'degradationPreference'}
          items={enumToItems(DegradationPreference)}
          value={degradationPreference}
          onValueChange={(value) => {
            this.setState({ degradationPreference: value });
          }}
        />
        <AgoraDivider />
        <AgoraDropdown
          title={'mirrorMode'}
          items={enumToItems(VideoMirrorModeType)}
          value={mirrorMode}
          onValueChange={(value) => {
            this.setState({ mirrorMode: value });
          }}
        />
        <AgoraDropdown
          title={'renderMode'}
          items={enumToItems(RenderModeType)}
          value={renderMode}
          onValueChange={(value) => {
            this.setState({ renderMode: value });
          }}
        />
        <AgoraDropdown
          title={'encodingPreference'}
          items={enumToItems(EncodingPreference)}
          value={encodingPreference}
          onValueChange={(value) => {
            this.setState({ encodingPreference: value });
          }}
        />
        <AgoraDropdown
          title={'compressionPreference'}
          items={enumToItems(CompressionPreference)}
          value={compressionPreference}
          onValueChange={(value) => {
            this.setState({ compressionPreference: value });
          }}
        />
        <AgoraSwitch
          title={'encodeAlpha'}
          value={encodeAlpha}
          onValueChange={(value) => {
            this.setState({ encodeAlpha: value });
          }}
        />
        <AgoraButton
          title={`set Video Render Mode`}
          onPress={this.setVideoRenderMode}
        />
      </>
    );
  }

  protected renderAction(): ReactElement | undefined {
    const { startPreview, joinChannelSuccess } = this.state;
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
          title={`set Video Encoder Configuration`}
          onPress={this.setVideoEncoderConfiguration}
        />
      </>
    );
  }
}
