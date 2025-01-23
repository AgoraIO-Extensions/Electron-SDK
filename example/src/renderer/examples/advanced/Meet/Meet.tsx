import {
  BackgroundBlurDegree,
  BackgroundSourceType,
  ChannelProfileType,
  ClientRoleType,
  EncodingPreference,
  IRtcEngineEventHandler,
  IRtcEngineEx,
  LighteningContrastLevel,
  LocalVideoStreamReason,
  LocalVideoStreamState,
  RenderModeType,
  RtcConnection,
  RtcStats,
  ScreenCaptureSourceInfo,
  ScreenCaptureSourceType,
  ScreenScenarioType,
  SimulcastStreamMode,
  UserOfflineReasonType,
  VideoCanvas,
  VideoSourceType,
  VideoStreamType,
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
  AgoraCard,
  AgoraDivider,
  AgoraDropdown,
  AgoraImage,
  AgoraList,
  AgoraSlider,
  AgoraStyle,
  AgoraSwitch,
  AgoraText,
  AgoraTextInput,
  AgoraView,
  RtcSurfaceView,
} from '../../../components/ui';
import Config from '../../../config/agora.config';
import { enumToItems, getResourcePath } from '../../../utils';
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
  camWidth: number;
  camHeight: number;
  camFrameRate: number;
  camBitrate: number;
  camEncodingPreference: EncodingPreference;
  screenWidth: number;
  screenHeight: number;
  screenFrameRate: number;
  screenBitrate: number;
  captureMouseCursor: boolean;
  windowFocus: boolean;
  excludeWindowList: number[];
  screenScenarioType: number;
  highLightWidth: number;
  highLightColor: number;
  enableHighLight: boolean;
  startScreenCapture: boolean;
  publishScreenCapture: boolean;
  remoteRenderLimit: number;
  remoteUserUid: number;
  videoStreamType: number;
  lighteningContrastLevel: LighteningContrastLevel;
  lighteningLevel: number;
  smoothnessLevel: number;
  rednessLevel: number;
  sharpnessLevel: number;
  enableBeautyEffect: boolean;
  background_source_type: BackgroundSourceType;
  color: number;
  source: string;
  blur_degree: BackgroundBlurDegree;
  enableVirtualBackground?: boolean;
  renderLocalCamera: boolean;
  renderLocalScreen: boolean;
}

export default class Meet
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
      camWidth: 320,
      camHeight: 180,
      camFrameRate: 10,
      camBitrate: 200,
      camEncodingPreference: EncodingPreference.PreferHardware,
      screenWidth: 320,
      screenHeight: 180,
      screenFrameRate: 10,
      screenBitrate: 200,
      captureMouseCursor: true,
      windowFocus: false,
      excludeWindowList: [],
      screenScenarioType: ScreenScenarioType.ScreenScenarioDocument,
      highLightWidth: 0,
      highLightColor: 0xff8cbf26,
      enableHighLight: false,
      startScreenCapture: false,
      publishScreenCapture: false,
      remoteRenderLimit: 4,
      remoteUserUid: 0,
      videoStreamType: VideoStreamType.VideoStreamLow,
      lighteningContrastLevel: LighteningContrastLevel.LighteningContrastLow,
      lighteningLevel: 0.5,
      smoothnessLevel: 0.5,
      rednessLevel: 0.5,
      sharpnessLevel: 0.5,
      enableBeautyEffect: false,
      background_source_type: BackgroundSourceType.BackgroundImg,
      color: 0xffaabb,
      source: getResourcePath('agora-logo.png'),
      blur_degree: BackgroundBlurDegree.BlurDegreeHigh,
      renderLocalCamera: true,
      renderLocalScreen: true,
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

    this.getScreenCaptureSources();

    this.engine.setParameters(
      JSON.stringify({ 'engine.video.hw_decoder_provider': 'qsv' })
    );
    this.engine.setParameters(
      JSON.stringify({ 'rtc.video.default_hw_decoder_thres': 921600 })
    );
    this.engine.setParameters(
      JSON.stringify({ 'rtc.video.enable_pvc': false })
    );
    this.engine.setParameters(
      JSON.stringify({ 'che.video.brightness_detection_enable': false })
    );
    this.engine.setParameters(
      JSON.stringify({ 'che.video.videoCodecIndex': 1 })
    );
    this.engine.setParameters(
      JSON.stringify({ 'rtc.video.enable_sr': { mode: 2, enabled: false } })
    );
    this.engine.setParameters(
      JSON.stringify({ 'che.video.h265_screen_enable': 0 })
    );
    this.engine?.setScreenCaptureScenario(
      ScreenScenarioType.ScreenScenarioDocument
    );
  }

  setVideoEncoderConfiguration = () => {
    const {
      camWidth,
      camHeight,
      camBitrate,
      camFrameRate,
      camEncodingPreference,
    } = this.state;

    this.engine?.setVideoEncoderConfiguration({
      dimensions: {
        width: camWidth,
        height: camHeight,
      },
      frameRate: camFrameRate,
      bitrate: camBitrate,
      advanceOptions: {
        encodingPreference: camEncodingPreference,
      },
    });
  };

  setCameraStreamDualStreamMode = () => {
    const { camWidth, camHeight, camBitrate, camFrameRate } = this.state;

    this.engine?.setDualStreamMode(SimulcastStreamMode.EnableSimulcastStream, {
      dimensions: {
        width: camWidth,
        height: camHeight,
      },
      framerate: camFrameRate,
      kBitrate: camBitrate,
    });
  };
  setScreenStreamDualStreamMode = () => {
    const {
      uid2,
      channelId,
      screenWidth,
      screenHeight,
      screenBitrate,
      screenFrameRate,
    } = this.state;

    if (!channelId) {
      this.error('channelId is invalid');
      return;
    }
    if (uid2 <= 0) {
      this.error('uid2 is invalid');
      return;
    }

    this.engine?.setDualStreamModeEx(
      SimulcastStreamMode.EnableSimulcastStream,
      {
        dimensions: {
          width: screenWidth,
          height: screenHeight,
        },
        framerate: screenFrameRate,
        kBitrate: screenBitrate,
      },
      { localUid: uid2, channelId: channelId }
    );
  };

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

    this.setCameraStreamDualStreamMode();
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
        { x: 0, y: 0, width: 0, height: 0 },
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
        publishCustomVideoTrack: false,
        publishEncodedVideoTrack: false,
        defaultVideoStreamType: VideoStreamType.VideoStreamHigh,
      }
    );

    this.setScreenStreamDualStreamMode();
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

  enableBeautyEffect = () => {
    const {
      lighteningContrastLevel,
      lighteningLevel,
      smoothnessLevel,
      rednessLevel,
      sharpnessLevel,
    } = this.state;

    this.engine?.setBeautyEffectOptions(true, {
      lighteningContrastLevel,
      lighteningLevel,
      smoothnessLevel,
      rednessLevel,
      sharpnessLevel,
    });
    this.setState({ enableBeautyEffect: true });
  };

  disableBeautyEffect = () => {
    this.engine?.setBeautyEffectOptions(false, {});
    this.setState({ enableBeautyEffect: false });
  };

  protected setScreenScenarioType = () => {
    const { screenScenarioType } = this.state;
    this.engine?.setScreenCaptureScenario(screenScenarioType);
  };

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

  disableVirtualBackground = () => {
    this.engine?.enableVirtualBackground(false, {}, {});
    this.setState({ enableVirtualBackground: false });
  };

  protected renderUsers(): ReactElement | undefined {
    const {
      startPreview,
      joinChannelSuccess,
      startScreenCapture,
      remoteUsers,
      remoteRenderLimit,
      renderLocalCamera,
      renderLocalScreen,
    } = this.state;
    return (
      <div className={AgoraStyle.meetContainer}>
        {startScreenCapture && renderLocalScreen ? (
          <div className={AgoraStyle.meetMain}>
            <div className={AgoraStyle.meetRenderContainer}>
              <span>{`${'local-screen'} - ${
                VideoSourceType.VideoSourceCamera
              }`}</span>
              <RtcSurfaceView
                containerClass={AgoraStyle.meetSurfaceViewContainer}
                videoClass={AgoraStyle.meetSurfaceViewVideo}
                canvas={{
                  sourceType: VideoSourceType.VideoSourceScreen,
                  renderMode: RenderModeType.RenderModeFit,
                }}
              />
            </div>
          </div>
        ) : undefined}
        <div className={AgoraStyle.meetRight}>
          {(!!startPreview || joinChannelSuccess) && renderLocalCamera ? (
            <>
              <div className={AgoraStyle.meetRenderContainer}>
                <span>{`${'local-cam'} - ${
                  VideoSourceType.VideoSourceCamera
                }`}</span>
                <RtcSurfaceView
                  containerClass={AgoraStyle.meetSurfaceViewContainer}
                  videoClass={AgoraStyle.meetSurfaceViewVideo}
                  canvas={{
                    sourceType: VideoSourceType.VideoSourceCamera,
                    renderMode: RenderModeType.RenderModeFit,
                  }}
                />
              </div>
            </>
          ) : undefined}
          {!!startPreview || joinChannelSuccess ? (
            <>
              {(remoteUsers.slice(0, remoteRenderLimit) ?? []).map(
                (uid, index) => {
                  return (
                    <div key={index}>
                      <div className={AgoraStyle.meetRenderContainer}>
                        <span>{`${'local-cam'} - ${
                          VideoSourceType.VideoSourceCamera
                        }`}</span>
                        <RtcSurfaceView
                          containerClass={AgoraStyle.meetSurfaceViewContainer}
                          videoClass={AgoraStyle.meetSurfaceViewVideo}
                          canvas={{
                            uid: uid,
                            sourceType: VideoSourceType.VideoSourceRemote,
                            renderMode: RenderModeType.RenderModeFit,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </>
          ) : undefined}
        </div>
      </div>
    );
  }

  protected renderChannel(): ReactElement | undefined {
    const {
      channelId,
      startPreview,
      joinChannelSuccess,
      camEncodingPreference,
      renderLocalCamera,
    } = this.state;
    return (
      <>
        <>
          <AgoraTextInput
            onChangeText={(text) => {
              this.setState({ channelId: text });
            }}
            placeholder={`channelId`}
            value={channelId}
          />
          <AgoraButton
            title={`${joinChannelSuccess ? 'leave' : 'join'} Channel`}
            onPress={() => {
              joinChannelSuccess ? this.leaveChannel() : this.joinChannel();
            }}
          />
        </>
        <AgoraButton
          disabled={joinChannelSuccess}
          title={`${startPreview ? 'stop' : 'start'} Preview`}
          onPress={
            startPreview ? this.handleStopPreview : this.handleStartPreview
          }
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              camWidth: text === '' ? this.createState().camWidth : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`camWidth (defaults: ${this.createState().camWidth})`}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              camHeight: text === '' ? this.createState().camHeight : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`camHeight (defaults: ${this.createState().camHeight})`}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              camFrameRate:
                text === '' ? this.createState().camFrameRate : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`camFrameRate (defaults: ${
            this.createState().camFrameRate
          })`}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              camBitrate: text === '' ? this.createState().camBitrate : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`camBitrate (defaults: ${
            this.createState().camBitrate
          })`}
        />
        <AgoraDropdown
          title={'EncodingPreference'}
          items={enumToItems(EncodingPreference)}
          value={camEncodingPreference}
          onValueChange={(value) => {
            this.setState({ camEncodingPreference: value });
          }}
        />
        <AgoraButton
          title={`setVideoEncoderConfiguration`}
          onPress={this.setVideoEncoderConfiguration}
        />
        <AgoraButton
          title={`setCameraStreamDualStreamMode`}
          onPress={this.setCameraStreamDualStreamMode}
        />
        <AgoraSwitch
          title={`renderLocalCamera`}
          value={renderLocalCamera}
          onValueChange={(value) => {
            this.setState({ renderLocalCamera: value });
          }}
        />
      </>
    );
  }

  protected renderConfiguration(): ReactElement | undefined {
    const {
      sources,
      targetSource,
      uid2,
      channelId,
      captureMouseCursor,
      windowFocus,
      excludeWindowList,
      highLightWidth,
      highLightColor,
      enableHighLight,
      publishScreenCapture,
      screenScenarioType,
      joinChannelSuccess,
      remoteUserUid,
      videoStreamType,
      lighteningContrastLevel,
      lighteningLevel,
      smoothnessLevel,
      rednessLevel,
      sharpnessLevel,
      enableBeautyEffect,
      background_source_type,
      color,
      source,
      blur_degree,
      enableVirtualBackground,
      startScreenCapture,
      renderLocalScreen,
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
          onChangeText={(text) => {
            if (text === '') {
              text = '0';
            }
            if (isNaN(+text)) return;
            this.setState({
              remoteRenderLimit:
                text === '' ? this.createState().remoteRenderLimit : +text,
            });
            if (joinChannelSuccess) {
              this.state.remoteUsers.map((uid, index) => {
                if (index + 1 > +text) {
                  this.engine?.muteRemoteVideoStream(uid, true);
                  this.engine?.muteRemoteAudioStream(uid, true);
                } else {
                  this.engine?.muteRemoteVideoStream(uid, false);
                  this.engine?.muteRemoteAudioStream(uid, false);
                }
              });
            }
          }}
          numberKeyboard={true}
          placeholder={`remoteRenderLimit (defaults: ${
            this.createState().remoteRenderLimit
          })`}
        />
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
        <AgoraDropdown
          title={'ScreenScenarioType'}
          items={enumToItems(ScreenScenarioType)}
          value={screenScenarioType}
          onValueChange={(value) => {
            this.engine?.setScreenCaptureScenario(value);
          }}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              screenWidth: text === '' ? this.createState().screenWidth : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`screenWidth (defaults: ${
            this.createState().screenWidth
          })`}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              screenHeight:
                text === '' ? this.createState().screenHeight : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`screenHeight (defaults: ${
            this.createState().screenHeight
          })`}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              screenFrameRate:
                text === '' ? this.createState().screenFrameRate : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`screenFrameRate (defaults: ${
            this.createState().screenFrameRate
          })`}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              screenBitrate:
                text === '' ? this.createState().screenBitrate : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`screenBitrate (defaults: ${
            this.createState().screenBitrate
          })`}
        />
        <AgoraButton
          title={`set ScreenStreamDualStreamMode`}
          onPress={this.setScreenStreamDualStreamMode}
        />
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
          <AgoraSwitch
            title={`renderLocalScreen`}
            value={renderLocalScreen}
            onValueChange={(value) => {
              this.setState({ renderLocalScreen: value });
            }}
          />
        </>
        <>
          <AgoraDivider />
          <AgoraTextInput
            onChangeText={(text) => {
              if (isNaN(+text)) return;
              this.setState({
                remoteUserUid:
                  text === '' ? this.createState().remoteUserUid : +text,
              });
            }}
            numberKeyboard={true}
            placeholder={`remoteUserUid`}
          />
          <AgoraDropdown
            title={'VideoStreamType'}
            items={enumToItems(VideoStreamType)}
            value={videoStreamType}
            onValueChange={(value) => {
              this.setState({ videoStreamType: value });
            }}
          />
          <AgoraButton
            title={`set RemoteVideoStreamType`}
            onPress={() => {
              this.engine?.setRemoteVideoStreamType(
                remoteUserUid,
                videoStreamType
              );
            }}
          />
          <AgoraButton
            title={`set RemoteVideoStreamTypeEx`}
            onPress={() => {
              this.engine?.setRemoteVideoStreamTypeEx(
                this.state.remoteUserUid,
                videoStreamType,
                { channelId: channelId, localUid: uid2 }
              );
            }}
          />
          <AgoraDivider />
        </>
        <>
          <AgoraDropdown
            title={'lighteningContrastLevel'}
            items={enumToItems(LighteningContrastLevel)}
            value={lighteningContrastLevel}
            onValueChange={(value) => {
              this.setState({ lighteningContrastLevel: value });
            }}
          />
          <AgoraSlider
            title={`lighteningLevel ${lighteningLevel}`}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
            value={lighteningLevel}
            onSlidingComplete={(value) => {
              this.setState({
                lighteningLevel: value,
              });
            }}
          />
          <AgoraSlider
            title={`smoothnessLevel ${smoothnessLevel}`}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
            value={smoothnessLevel}
            onSlidingComplete={(value) => {
              this.setState({
                smoothnessLevel: value,
              });
            }}
          />
          <AgoraSlider
            title={`rednessLevel ${rednessLevel}`}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
            value={rednessLevel}
            onSlidingComplete={(value) => {
              this.setState({
                rednessLevel: value,
              });
            }}
          />
          <AgoraSlider
            title={`sharpnessLevel ${sharpnessLevel}`}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
            value={sharpnessLevel}
            onSlidingComplete={(value) => {
              this.setState({
                sharpnessLevel: value,
              });
            }}
          />
          <AgoraButton
            title={`${enableBeautyEffect ? 'disable' : 'enable'} Beauty Effect`}
            onPress={
              enableBeautyEffect
                ? this.disableBeautyEffect
                : this.enableBeautyEffect
            }
          />
        </>
        <>
          <AgoraDivider />
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
          <AgoraButton
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
      </>
    );
  }
}
