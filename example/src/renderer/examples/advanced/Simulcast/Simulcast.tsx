import {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngineEventHandler,
  IRtcEngineEx,
  LocalVideoStreamReason,
  LocalVideoStreamState,
  RemoteVideoStats,
  RtcConnection,
  RtcStats,
  ScreenCaptureSourceInfo,
  ScreenCaptureSourceType,
  SimulcastConfig,
  UserOfflineReasonType,
  VideoSourceType,
  VideoStreamType,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import { Checkbox, List } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { ReactElement } from 'react';

import { SketchPicker } from 'react-color';

import {
  BaseComponent,
  BaseVideoComponentState,
} from '../../../components/BaseComponent';
import {
  AgoraButton,
  AgoraDivider,
  AgoraDropdown,
  AgoraImage,
  AgoraList,
  AgoraSlider,
  AgoraSwitch,
  AgoraTextInput,
  AgoraView,
} from '../../../components/ui';
import Config from '../../../config/agora.config';
import { enumToItems } from '../../../utils';
import { thumbImageBufferToBase64 } from '../../../utils/base64';
import { askMediaAccess } from '../../../utils/permissions';

interface State extends BaseVideoComponentState {
  checkedSimulcastConfigList: CheckboxValueType[];
  clientRoleType: ClientRoleType;
  videoStreamType: VideoStreamType;
  remoteUid: number;
  isSetSimulcastConfig: boolean;
  token2: string;
  uid2: number;
  sources?: ScreenCaptureSourceInfo[];
  targetSource?: ScreenCaptureSourceInfo;
  width: number;
  height: number;
  frameRate: number;
  bitrate: number;
  captureMouseCursor: boolean;
  windowFocus: boolean;
  excludeWindowList: number[];
  highLightWidth: number;
  highLightColor: number;
  enableHighLight: boolean;
  startScreenCapture: boolean;
  publishScreenCapture: boolean;
  videoCodec: number;
  videoCodecList: { key: string; value: number }[];
}

let presetSimulcastConfigList = [
  {
    label: '1920x1080-30fps',
    value: {
      dimensions: {
        width: 1920,
        height: 1080,
      },
      framerate: 30,
      enable: false,
    },
  },
  {
    label: '1280x720-30fps',
    value: {
      dimensions: {
        width: 1280,
        height: 720,
      },
      framerate: 30,
      enable: false,
    },
  },
  {
    label: '960x540-15fps',
    value: {
      dimensions: {
        width: 960,
        height: 540,
      },
      framerate: 15,
      enable: false,
    },
  },
  {
    label: '640x360-15fps',
    value: {
      dimensions: {
        width: 640,
        height: 360,
      },
      framerate: 15,
      enable: false,
    },
  },
  {
    label: '360x270-15fps',
    value: {
      dimensions: {
        width: 360,
        height: 270,
      },
      framerate: 15,
      enable: false,
    },
  },
  {
    label: '270x150-5fps',
    value: {
      dimensions: {
        width: 270,
        height: 150,
      },
      framerate: 5,
      enable: false,
    },
  },
  {
    label: '150x150-5fps',
    value: {
      dimensions: {
        width: 150,
        height: 150,
      },
      framerate: 5,
      enable: false,
    },
  },
];

export default class Simulcast
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler
{
  //@ts-ignore
  protected engine?: IRtcEngineEx;

  protected createState(): State {
    return {
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      appId: Config.appId,
      enableVideo: true,
      channelId: Config.channelId,
      token: Config.token,
      uid: Config.uid,
      joinChannelSuccess: false,
      remoteUsers: [],
      checkedSimulcastConfigList: [],
      startPreview: false,
      isSetSimulcastConfig: false,
      remoteUid: 0,
      videoStreamType: VideoStreamType.VideoStreamLayer1,
      token2: '',
      uid2: 0,
      sources: [],
      targetSource: undefined,
      width: 1920,
      height: 1080,
      frameRate: 15,
      bitrate: 0,
      captureMouseCursor: true,
      windowFocus: false,
      excludeWindowList: [],
      highLightWidth: 0,
      highLightColor: 0xff8cbf26,
      enableHighLight: false,
      startScreenCapture: false,
      publishScreenCapture: false,
      videoCodec: 1,
      videoCodecList: [
        {
          key: 'h264',
          value: 1,
        },
        {
          key: 'h265',
          value: 2,
        },
      ],
    };
  }

  /**
   * Step 1: initRtcEngine
   */
  protected async initRtcEngine() {
    const { appId, videoCodec } = this.state;
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
    this.engine.startPreview();
    this.setState({ startPreview: true });

    this.engine?.setParameters(
      JSON.stringify({ 'che.video.videoCodecIndex': videoCodec })
    );
    this.engine.setParameters(
      JSON.stringify({ 'engine.video.enable_hw_encoder': true })
    );
    this.getScreenCaptureSources();
  }

  /**
   * Step 2: joinChannel
   */
  protected joinChannel() {
    const { channelId, token, uid, clientRoleType } = this.state;
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
      clientRoleType,
    });
  }

  /**
   * Step 3: setSimulcastConfig
   */
  setSimulcastConfig = () => {
    const { checkedSimulcastConfigList } = this.state;
    if (checkedSimulcastConfigList.length === 0) {
      this.error('please choose simulcast config');
      return;
    }

    let configs: SimulcastConfig = {
      configs: presetSimulcastConfigList.map((item) => {
        item.value.enable = checkedSimulcastConfigList.includes(
          item.value as any
        );
        return item.value;
      }),
    };

    this.engine?.setSimulcastConfig(configs);
  };

  /**
   * Step 4: setRemoteVideoStreamType
   */
  setRemoteVideoStreamType = () => {
    const { videoStreamType, remoteUid } = this.state;
    this.engine?.setRemoteVideoStreamType(remoteUid, videoStreamType);
  };

  onRemoteVideoStats(connection: RtcConnection, stats: RemoteVideoStats): void {
    this.info('onRemoteVideoStats', 'connection', connection, 'stats', stats);
  }

  onVideoSizeChanged(
    connection: RtcConnection,
    sourceType: VideoSourceType,
    uid: number,
    width: number,
    height: number,
    rotation: number
  ): void {
    this.info(
      'onVideoSizeChanged',
      'connection',
      connection,
      'sourceType',
      sourceType,
      'uid',
      uid,
      'width',
      width,
      'height',
      height,
      'rotation',
      rotation
    );
  }

  getScreenCaptureSources = () => {
    const sources = this.engine?.getScreenCaptureSources(
      { width: 1920, height: 1080 },
      { width: 64, height: 64 },
      true
    );
    this.setState({
      sources,
      targetSource: sources?.at(0),
    });
  };

  /**
   * Step 3-2: startScreenCapture
   */
  startScreenCapture = () => {
    const {
      targetSource,
      width,
      height,
      frameRate,
      bitrate,
      captureMouseCursor,
      windowFocus,
      excludeWindowList,
      highLightWidth,
      highLightColor,
      enableHighLight,
    } = this.state;

    if (!targetSource) {
      this.error('targetSource is invalid');
      return;
    }

    if (
      targetSource.type ===
      ScreenCaptureSourceType.ScreencapturesourcetypeScreen
    ) {
      this.engine?.startScreenCaptureByDisplayId(
        targetSource.sourceId,
        {},
        {
          dimensions: { width, height },
          frameRate,
          bitrate,
          captureMouseCursor,
          excludeWindowList,
          excludeWindowCount: excludeWindowList.length,
          highLightWidth,
          highLightColor,
          enableHighLight,
        }
      );
    } else {
      this.engine?.startScreenCaptureByWindowId(
        targetSource.sourceId,
        {},
        {
          dimensions: { width, height },
          frameRate,
          bitrate,
          windowFocus,
          highLightWidth,
          highLightColor,
          enableHighLight,
        }
      );
    }
    this.setState({ startScreenCapture: true });
  };

  /**
   * Step 3-2 (Optional): updateScreenCaptureParameters
   */
  updateScreenCaptureParameters = () => {
    const {
      width,
      height,
      frameRate,
      bitrate,
      captureMouseCursor,
      windowFocus,
      excludeWindowList,
      highLightWidth,
      highLightColor,
      enableHighLight,
    } = this.state;
    this.engine?.updateScreenCaptureParameters({
      dimensions: { width, height },
      frameRate,
      bitrate,
      captureMouseCursor,
      windowFocus,
      excludeWindowList,
      excludeWindowCount: excludeWindowList.length,
      highLightWidth,
      highLightColor,
      enableHighLight,
    });
  };

  /**
   * Step 3-4: publishScreenCapture
   */
  publishScreenCapture = () => {
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
        autoSubscribeAudio: false,
        autoSubscribeVideo: false,
        publishMicrophoneTrack: false,
        publishCameraTrack: false,
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        publishScreenTrack: true,
      }
    );
  };

  /**
   * Step 3-5: stopScreenCapture
   */
  stopScreenCapture = () => {
    this.engine?.stopScreenCapture();
    this.setState({ startScreenCapture: false });
  };

  /**
   * Step 3-6: unpublishScreenCapture
   */
  unpublishScreenCapture = () => {
    const { channelId, uid2 } = this.state;
    this.engine?.leaveChannelEx({ channelId, localUid: uid2 });
  };

  onJoinChannelSuccess(connection: RtcConnection, elapsed: number) {
    const { uid2 } = this.state;
    if (connection.localUid === uid2) {
      this.info(
        'onJoinChannelSuccess',
        'connection',
        connection,
        'elapsed',
        elapsed
      );
      this.setState({ publishScreenCapture: true });
      return;
    }
    super.onJoinChannelSuccess(connection, elapsed);
  }

  onLeaveChannel(connection: RtcConnection, stats: RtcStats) {
    this.info('onLeaveChannel', 'connection', connection, 'stats', stats);
    const { uid2 } = this.state;
    if (connection.localUid === uid2) {
      this.setState({ publishScreenCapture: false });
      return;
    }
    const state = this.createState();
    delete state.sources;
    delete state.targetSource;
    this.setState(state);
  }

  onUserJoined(connection: RtcConnection, remoteUid: number, elapsed: number) {
    const { uid2 } = this.state;
    if (connection.localUid === uid2 || remoteUid === uid2) {
      // ⚠️ mute the streams from screen sharing
      this.engine?.muteRemoteAudioStream(uid2, true);
      this.engine?.muteRemoteVideoStream(uid2, true);
      return;
    }
    super.onUserJoined(connection, remoteUid, elapsed);
  }

  onUserOffline(
    connection: RtcConnection,
    remoteUid: number,
    reason: UserOfflineReasonType
  ) {
    const { uid2 } = this.state;
    if (connection.localUid === uid2 || remoteUid === uid2) return;
    super.onUserOffline(connection, remoteUid, reason);
  }

  onLocalVideoStateChanged(
    source: VideoSourceType,
    state: LocalVideoStreamState,
    error: LocalVideoStreamReason
  ) {
    this.info(
      'onLocalVideoStateChanged',
      'source',
      source,
      'state',
      state,
      'error',
      error
    );
    if (source === VideoSourceType.VideoSourceScreen) {
      switch (state) {
        case LocalVideoStreamState.LocalVideoStreamStateStopped:
        case LocalVideoStreamState.LocalVideoStreamStateFailed:
          break;
        case LocalVideoStreamState.LocalVideoStreamStateCapturing:
        case LocalVideoStreamState.LocalVideoStreamStateEncoding:
          this.setState({ startScreenCapture: true });
          break;
      }
    }
  }

  /**
   * Step 3-2: setVideoEncoderConfiguration
   */
  setVideoEncoderConfiguration = () => {
    const { width, height, frameRate, bitrate } = this.state;
    this.engine?.setVideoEncoderConfiguration({
      dimensions: {
        width: width,
        height: height,
      },
      frameRate,
      bitrate,
    });
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
    const { startPreview, joinChannelSuccess, remoteUsers } = this.state;
    return (
      <>
        {!!startPreview || joinChannelSuccess
          ? this.renderUser({
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
      checkedSimulcastConfigList,
      clientRoleType,
      sources,
      targetSource,
      uid2,
      captureMouseCursor,
      windowFocus,
      excludeWindowList,
      highLightWidth,
      highLightColor,
      enableHighLight,
      publishScreenCapture,
      videoStreamType,
      remoteUid,
      videoCodecList,
      videoCodec,
    } = this.state;
    return (
      <>
        <AgoraDropdown
          title={'clientRoleType'}
          items={enumToItems(ClientRoleType)}
          value={clientRoleType}
          onValueChange={(value) => {
            this.setState({ clientRoleType: value });
          }}
        />
        <AgoraDivider />
        {clientRoleType === ClientRoleType.ClientRoleBroadcaster ? (
          <>
            <p>simulcast config list</p>
            <Checkbox.Group
              style={{ width: '100%' }}
              value={checkedSimulcastConfigList}
              onChange={(checkedValues) => {
                this.setState({
                  checkedSimulcastConfigList: checkedValues,
                });
              }}
            >
              <List
                itemLayout="horizontal"
                dataSource={presetSimulcastConfigList}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Checkbox value={item.value} />}
                      title={item.label}
                    />
                  </List.Item>
                )}
              />
            </Checkbox.Group>
            <AgoraDropdown
              title={'targetSource'}
              items={sources?.map((value) => {
                return {
                  value: value.sourceId!,
                  label: value.sourceName!,
                };
              })}
              value={targetSource?.sourceId}
              onValueChange={(value, index) => {
                this.setState((preState) => {
                  return { targetSource: preState.sources?.at(index) };
                });
              }}
            />
            {targetSource ? (
              <AgoraImage
                source={thumbImageBufferToBase64(targetSource.thumbImage)}
              />
            ) : undefined}
            <AgoraTextInput
              editable={!publishScreenCapture}
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
              placeholder={`frameRate (defaults: ${
                this.createState().frameRate
              })`}
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
            {targetSource?.type ===
            ScreenCaptureSourceType.ScreencapturesourcetypeScreen ? (
              <>
                <AgoraSwitch
                  title={`captureMouseCursor`}
                  value={captureMouseCursor}
                  onValueChange={(value) => {
                    this.setState({ captureMouseCursor: value });
                  }}
                />
                <AgoraDivider />
              </>
            ) : undefined}
            {targetSource?.type ===
            ScreenCaptureSourceType.ScreencapturesourcetypeWindow ? (
              <>
                <AgoraSwitch
                  title={`windowFocus`}
                  value={windowFocus}
                  onValueChange={(value) => {
                    this.setState({ windowFocus: value });
                  }}
                />
                <AgoraDivider />
              </>
            ) : undefined}
            {targetSource?.type ===
            ScreenCaptureSourceType.ScreencapturesourcetypeScreen ? (
              <>
                <AgoraDropdown
                  title={'excludeWindowList'}
                  items={sources
                    ?.filter(
                      (value) =>
                        value.type ===
                        ScreenCaptureSourceType.ScreencapturesourcetypeWindow
                    )
                    .map((value) => {
                      return {
                        value: value.sourceId!,
                        label: value.sourceName!,
                      };
                    })}
                  value={excludeWindowList}
                  onValueChange={(value, index) => {
                    if (excludeWindowList.indexOf(value) === -1) {
                      this.setState((preState) => {
                        return {
                          excludeWindowList: [
                            ...preState.excludeWindowList,
                            value,
                          ],
                        };
                      });
                    } else {
                      this.setState((preState) => {
                        return {
                          excludeWindowList: preState.excludeWindowList.filter(
                            (v) => v !== value
                          ),
                        };
                      });
                    }
                  }}
                />
                <AgoraDivider />
              </>
            ) : undefined}
            <AgoraDropdown
              title={'videoCodec'}
              items={videoCodecList?.map((value) => {
                return {
                  value: value.value!,
                  label: value.key!,
                };
              })}
              value={videoCodec}
              onValueChange={(value, index) => {
                let newCodec = videoCodecList?.at(index)?.value!;
                this.engine?.setParameters(
                  JSON.stringify({ 'che.video.videoCodecIndex': newCodec })
                );
                this.setState((preState) => {
                  return {
                    videoCodec: preState.videoCodecList?.at(index)?.value!,
                  };
                });
              }}
            />
            <AgoraSwitch
              title={`enableHighLight`}
              value={enableHighLight}
              onValueChange={(value) => {
                this.setState({ enableHighLight: value });
              }}
            />
            {enableHighLight ? (
              <>
                <AgoraDivider />
                <AgoraSlider
                  title={`highLightWidth ${highLightWidth}`}
                  minimumValue={0}
                  maximumValue={50}
                  step={1}
                  value={highLightWidth}
                  onSlidingComplete={(value) => {
                    this.setState({
                      highLightWidth: value,
                    });
                  }}
                />
                <AgoraDivider />
                <SketchPicker
                  onChangeComplete={(color) => {
                    const { a = 1, r, g, b } = color.rgb;
                    const argbHex =
                      `${((a * 255) | (1 << 8)).toString(16).slice(1)}` +
                      `${(r | (1 << 8)).toString(16).slice(1)}` +
                      `${(g | (1 << 8)).toString(16).slice(1)}` +
                      `${(b | (1 << 8)).toString(16).slice(1)}`;
                    console.log(
                      'onChangeComplete',
                      color.hex,
                      `#${argbHex}`,
                      +`0x${argbHex}`,
                      color
                    );
                    this.setState({
                      highLightColor: +`0x${argbHex}`,
                    });
                  }}
                  color={(function () {
                    const argb = highLightColor?.toString(16);
                    const rgba = `${argb.slice(2)}` + `${argb.slice(0, 2)}`;
                    console.log('argb', `#${argb}`, 'rgba', `#${rgba}`);
                    return `#${rgba}`;
                  })()}
                />
              </>
            ) : undefined}
          </>
        ) : null}
        {clientRoleType === ClientRoleType.ClientRoleAudience ? (
          <>
            <AgoraDropdown
              title={'VideoStreamType'}
              items={enumToItems(VideoStreamType)}
              value={videoStreamType}
              onValueChange={(value) => {
                this.setState({ videoStreamType: value });
              }}
            />
            <AgoraTextInput
              onChangeText={(text) => {
                if (isNaN(+text)) return;
                this.setState({
                  remoteUid: text === '' ? this.createState().remoteUid : +text,
                });
              }}
              numberKeyboard={true}
              placeholder={`remoteUid (must > 0)`}
              value={remoteUid > 0 ? remoteUid.toString() : ''}
            />
          </>
        ) : null}
      </>
    );
  }

  protected renderAction(): ReactElement | undefined {
    const { clientRoleType, startScreenCapture, publishScreenCapture } =
      this.state;
    return (
      <>
        {clientRoleType === ClientRoleType.ClientRoleBroadcaster ? (
          <>
            <AgoraButton
              title={`set Video Encoder Configuration`}
              onPress={this.setVideoEncoderConfiguration}
            />
            <AgoraButton
              title={'setSimulcastConfig'}
              onPress={this.setSimulcastConfig}
            />
            <AgoraButton
              title={`${startScreenCapture ? 'stop' : 'start'} Screen Capture`}
              onPress={
                startScreenCapture
                  ? this.stopScreenCapture
                  : this.startScreenCapture
              }
            />
            <AgoraButton
              disabled={!startScreenCapture}
              title={'updateScreenCaptureParameters'}
              onPress={this.updateScreenCaptureParameters}
            />
            <AgoraButton
              title={`${
                publishScreenCapture ? 'unpublish' : 'publish'
              } Screen Capture`}
              onPress={
                publishScreenCapture
                  ? this.unpublishScreenCapture
                  : this.publishScreenCapture
              }
            />
          </>
        ) : null}
        {clientRoleType === ClientRoleType.ClientRoleAudience ? (
          <AgoraButton
            title={'setRemoteVideoStreamType'}
            onPress={this.setRemoteVideoStreamType}
          />
        ) : null}
      </>
    );
  }
}
