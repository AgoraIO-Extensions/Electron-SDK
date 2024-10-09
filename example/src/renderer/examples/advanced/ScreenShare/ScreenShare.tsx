import {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngineEventHandler,
  IRtcEngineEx,
  LocalVideoStreamReason,
  LocalVideoStreamState,
  RenderModeType,
  RtcConnection,
  RtcStats,
  ScreenCaptureSourceInfo,
  ScreenCaptureSourceType,
  UserOfflineReasonType,
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
  AgoraDivider,
  AgoraDropdown,
  AgoraImage,
  AgoraSlider,
  AgoraSwitch,
  AgoraTextInput,
  AgoraView,
  RtcSurfaceView,
} from '../../../components/ui';
import Config from '../../../config/agora.config';
import { thumbImageBufferToBase64 } from '../../../utils/base64';
import { askMediaAccess } from '../../../utils/permissions';

interface State extends BaseVideoComponentState {
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
}

export default class ScreenShare
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
    this.engine.startPreview();
    this.setState({ startPreview: true });

    this.getScreenCaptureSources();
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
   * Step 3-1: getScreenCaptureSources
   */
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
        targetSource.sourceId!,
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
        targetSource.sourceId!,
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

  protected renderUsers(): ReactElement | undefined {
    const { startScreenCapture } = this.state;
    return (
      <>
        {super.renderUsers()}
        {startScreenCapture ? (
          <RtcSurfaceView
            canvas={{
              sourceType: VideoSourceType.VideoSourceScreen,
              renderMode: RenderModeType.RenderModeFit,
            }}
          />
        ) : undefined}
      </>
    );
  }

  protected renderConfiguration(): ReactElement | undefined {
    const {
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
    } = this.state;
    return (
      <>
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
                      excludeWindowList: [...preState.excludeWindowList, value],
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
    );
  }

  protected renderAction(): ReactElement | undefined {
    const { startScreenCapture, publishScreenCapture } = this.state;
    return (
      <>
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
    );
  }
}
