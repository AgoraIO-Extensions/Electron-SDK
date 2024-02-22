import {
  AudioMixingReasonType,
  AudioMixingStateType,
  AudioProfileType,
  ChannelProfileType,
  ClientRoleType,
  DegradationPreference,
  DirectCdnStreamingError,
  DirectCdnStreamingState,
  DirectCdnStreamingStats,
  IDirectCdnStreamingEventHandler,
  IRtcEngineEventHandler,
  OrientationMode,
  RenderModeType,
  RtcConnection,
  RtcStats,
  ScreenCaptureSourceInfo,
  ScreenCaptureSourceType,
  VideoCodecType,
  VideoMirrorModeType,
  VideoSourceType,
  createAgoraRtcEngine,
} from 'agora-electron-sdk';
import React, { ReactElement } from 'react';

import {
  BaseComponent,
  BaseVideoComponentState,
} from '../../../components/BaseComponent';
import {
  AgoraButton,
  AgoraDivider,
  AgoraDropdown,
  AgoraStyle,
  AgoraSwitch,
  AgoraTextInput,
  AgoraView,
  RtcSurfaceView,
} from '../../../components/ui';
import Config from '../../../config/agora.config';
import { enumToItems, getResourcePath } from '../../../utils';
import { askMediaAccess } from '../../../utils/permissions';

interface State extends BaseVideoComponentState {
  url: string;
  publishCustomAudioTrack: boolean;
  publishMediaPlayerAudioTrack: boolean;
  publishScreenTrack: boolean;
  publishLoopbackAudioTrack: boolean;
  publishMicrophoneTrack: boolean;
  codecType: VideoCodecType;
  audioProfileType: AudioProfileType;
  width: number;
  height: number;
  frameRate: number;
  bitrate: number;
  minBitrate: number;
  orientationMode: OrientationMode;
  degradationPreference: DegradationPreference;
  mirrorMode: VideoMirrorModeType;
  filePath: string;
  loopback: boolean;
  cycle: number;
  startPos: number;
  startAudioMixing: boolean;
  pauseAudioMixing: boolean;
  startScreenCapture: boolean;
  sources?: ScreenCaptureSourceInfo[];
  targetSource?: ScreenCaptureSourceInfo;
  captureMouseCursor: boolean;
  windowFocus: boolean;
  excludeWindowList: number[];
  highLightWidth: number;
  highLightColor: number;
  enableHighLight: boolean;
  startDirectCdnStreaming: boolean;

  soundId: number;
  playEffectFilePath: string;
  loopCount: number;
  pitch: number;
  pan: number;
  gain: number;
  publish: boolean;
  playEffectStartPos: number;
  playEffect: boolean;
  pauseEffect: boolean;
}

export default class DirectCdnStreaming
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler, IDirectCdnStreamingEventHandler
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
      url: 'rtmp://vid-218.push.chinanetcenter.broadcastapp.agora.io/live/test',
      codecType: VideoCodecType.VideoCodecH264,
      width: 640,
      height: 360,
      frameRate: 15,
      bitrate: 0,
      minBitrate: -1,
      // ⚠️ can not set OrientationMode.OrientationModeAdaptive
      orientationMode: OrientationMode.OrientationModeFixedLandscape,
      degradationPreference: DegradationPreference.MaintainQuality,
      mirrorMode: VideoMirrorModeType.VideoMirrorModeDisabled,
      audioProfileType: AudioProfileType.AudioProfileDefault,
      soundId: 0,
      targetSource: undefined,
      captureMouseCursor: true,
      windowFocus: false,
      excludeWindowList: [],
      highLightWidth: 0,
      highLightColor: 0xff8cbf26,
      enableHighLight: false,
      startScreenCapture: false,
      startDirectCdnStreaming: false,
      filePath: getResourcePath('effect.mp3'),
      loopback: false,
      cycle: -1,
      startPos: 0,
      startAudioMixing: false,
      pauseAudioMixing: false,
      publishCustomAudioTrack: true,
      publishMediaPlayerAudioTrack: true,
      publishScreenTrack: true,
      publishLoopbackAudioTrack: true,
      publishMicrophoneTrack: true,
      playEffectFilePath: getResourcePath('effect.mp3'),
      loopCount: 1,
      pitch: 1.0,
      pan: 0,
      gain: 100,
      publish: false,
      playEffectStartPos: 0,
      playEffect: false,
      pauseEffect: false,
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
   * Step 3-5: stopScreenCapture
   */
  stopScreenCapture = () => {
    this.engine?.stopScreenCapture();
    this.setState({ startScreenCapture: false });
  };

  /**
   * Step 3-1 (Optional): setDirectCdnStreamingVideoConfiguration
   */
  setDirectCdnStreamingVideoConfiguration = () => {
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
    } = this.state;
    if (orientationMode === OrientationMode.OrientationModeAdaptive) {
      this.error(
        'orientationMode is invalid, should not be OrientationMode.OrientationModeAdaptive'
      );
      return;
    }
    this.engine?.setDirectCdnStreamingVideoConfiguration({
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
    });
  };

  /**
   * Step 3-1 (Optional): setDirectCdnStreamingAudioConfiguration
   */
  setDirectCdnStreamingAudioConfiguration = () => {
    const { audioProfileType } = this.state;
    this.engine?.setDirectCdnStreamingAudioConfiguration(audioProfileType);
  };

  /**
   * Step 3-2: startDirectCdnStreaming
   */
  startDirectCdnStreaming = () => {
    const {
      url,
      publishCustomAudioTrack,
      publishMediaPlayerAudioTrack,
      publishScreenTrack,
      publishLoopbackAudioTrack,
      publishMicrophoneTrack,
    } = this.state;
    if (!url) {
      this.error('url is invalid');
      return;
    }

    this.engine?.startDirectCdnStreaming(this, url, {
      publishCustomAudioTrack: publishCustomAudioTrack,
      publishMediaPlayerAudioTrack: publishMediaPlayerAudioTrack,
      publishScreenTrack: publishScreenTrack,
      publishLoopbackAudioTrack: publishLoopbackAudioTrack,
      publishMicrophoneTrack: publishMicrophoneTrack,
    });
  };

  /**
   * Step 3-3: stopDirectCdnStreaming
   */
  stopDirectCdnStreaming = () => {
    this.engine?.stopDirectCdnStreaming();
  };

  /**
   * Step 3-1: startAudioMixing
   */
  startAudioMixing = () => {
    const { filePath, loopback, cycle, startPos } = this.state;
    if (!filePath) {
      this.error('filePath is invalid');
      return;
    }
    if (cycle < -1) {
      this.error('cycle is invalid');
      return;
    }
    if (startPos < 0) {
      this.error('startPos is invalid');
      return;
    }

    this.engine?.startAudioMixing(filePath, loopback, cycle, startPos);
  };

  /**
   * Step 3-2 (Optional): pauseAudioMixing
   */
  pauseAudioMixing = () => {
    this.engine?.pauseAudioMixing();
  };

  /**
   * Step 3-3 (Optional): resumeAudioMixing
   */
  resumeAudioMixing = () => {
    this.engine?.resumeAudioMixing();
  };

  /**
   * Step 3-4 (Optional): getAudioMixingCurrentPosition
   */
  getAudioMixingCurrentPosition = () => {
    const position = this.engine?.getAudioMixingCurrentPosition();
    const duration = this.engine?.getAudioMixingDuration();
    this.debug(
      'getAudioMixingCurrentPosition',
      'position',
      position,
      'duration',
      duration
    );
  };

  /**
   * Step 3-5: stopAudioMixing
   */
  stopAudioMixing = () => {
    this.engine?.stopAudioMixing();
  };

  /**
   * Step 3-1: playEffect
   */
  playEffect = async () => {
    const {
      soundId,
      playEffectFilePath,
      loopCount,
      pitch,
      pan,
      gain,
      publish,
      playEffectStartPos,
    } = this.state;
    if (!playEffectFilePath) {
      this.error('playEffectFilePath is invalid');
      return;
    }
    if (playEffectStartPos < 0) {
      this.error('playEffectStartPos is invalid');
      return;
    }

    this.engine?.playEffect(
      soundId,
      playEffectFilePath,
      loopCount,
      pitch,
      pan,
      gain,
      publish,
      playEffectStartPos
    );
    this.setState({ playEffect: true, pauseEffect: false });
  };

  /**
   * Step 3-2 (Optional): pauseEffect
   */
  pauseEffect = () => {
    const { soundId } = this.state;
    this.engine?.pauseEffect(soundId);
    this.setState({ pauseEffect: true });
  };

  /**
   * Step 3-3 (Optional): resumeEffect
   */
  resumeEffect = () => {
    const { soundId } = this.state;
    this.engine?.resumeEffect(soundId);
    this.setState({ pauseEffect: false });
  };

  /**
   * Step 3-4: stopEffect
   */
  stopEffect = () => {
    const { soundId } = this.state;
    this.engine?.stopEffect(soundId);
    this.setState({ playEffect: false });
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

  onAudioMixingStateChanged(
    state: AudioMixingStateType,
    reason: AudioMixingReasonType
  ) {
    this.info('onAudioMixingStateChanged', 'state', state, 'reason', reason);
    switch (state) {
      case AudioMixingStateType.AudioMixingStatePlaying:
        this.setState({ startAudioMixing: true, pauseAudioMixing: false });
        break;
      case AudioMixingStateType.AudioMixingStatePaused:
        this.setState({ pauseAudioMixing: true });
        break;
      case AudioMixingStateType.AudioMixingStateStopped:
      case AudioMixingStateType.AudioMixingStateFailed:
        this.setState({ startAudioMixing: false });
        break;
    }
  }

  onAudioMixingFinished() {
    this.info('AudioMixingFinished');
  }

  onLeaveChannel(connection: RtcConnection, stats: RtcStats) {
    const { startDirectCdnStreaming } = this.state;
    if (startDirectCdnStreaming) {
      this.stopDirectCdnStreaming();
    }
    const state = this.createState();
    delete state.sources;
    delete state.targetSource;
    this.setState(state);
    super.onLeaveChannel(connection, stats);
  }

  onDirectCdnStreamingStateChanged(
    state: DirectCdnStreamingState,
    error: DirectCdnStreamingError,
    message: string
  ) {
    this.info(
      'onDirectCdnStreamingStateChanged',
      'state',
      state,
      'error',
      error,
      'message',
      message
    );
    switch (state) {
      case DirectCdnStreamingState.DirectCdnStreamingStateIdle:
        break;
      case DirectCdnStreamingState.DirectCdnStreamingStateRunning:
        this.setState({ startDirectCdnStreaming: true });
        break;
      case DirectCdnStreamingState.DirectCdnStreamingStateStopped:
      case DirectCdnStreamingState.DirectCdnStreamingStateFailed:
        this.setState({ startDirectCdnStreaming: false });
        break;
      case DirectCdnStreamingState.DirectCdnStreamingStateRecovering:
        break;
    }
  }

  onAudioEffectFinished(soundId: number) {
    this.info('onAudioEffectFinished', 'soundId', soundId);
    this.setState({ playEffect: false });
  }

  onDirectCdnStreamingStats(stats: DirectCdnStreamingStats) {
    this.info('onDirectCdnStreamingStats', 'stats', stats);
  }

  protected renderUsers(): ReactElement | undefined {
    const { startScreenCapture } = this.state;
    return (
      <div style={{ marginTop: 30 }}>
        {startScreenCapture ? (
          <RtcSurfaceView
            canvas={{
              uid: 0,
              sourceType: VideoSourceType.VideoSourceScreen,
              renderMode: RenderModeType.RenderModeFit,
            }}
          />
        ) : undefined}
      </div>
    );
  }

  protected renderConfiguration(): ReactElement | undefined {
    const {
      url,
      filePath,
      audioProfileType,
      playEffectFilePath,
      loopback,
      codecType,
      orientationMode,
      degradationPreference,
      mirrorMode,
      publishCustomAudioTrack,
      publishLoopbackAudioTrack,
      publishMediaPlayerAudioTrack,
      publishMicrophoneTrack,
      publishScreenTrack,
    } = this.state;
    return (
      <>
        <AgoraTextInput
          onChangeText={(text) => {
            this.setState({ url: text });
          }}
          placeholder={`url`}
          value={url}
        />
        <AgoraDropdown
          title={'codecType'}
          items={enumToItems(VideoCodecType)}
          value={codecType}
          onValueChange={(value) => {
            this.setState({ codecType: value });
          }}
        />
        <AgoraDropdown
          title={'audioProfileType'}
          items={enumToItems(AudioProfileType)}
          value={audioProfileType}
          onValueChange={(value) => {
            this.setState({ audioProfileType: value });
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

        <AgoraTextInput
          onChangeText={(text) => {
            this.setState({ filePath: text });
          }}
          placeholder={'filePath'}
          value={filePath}
        />
        <AgoraSwitch
          title={'loopback'}
          value={loopback}
          onValueChange={(value) => {
            this.setState({ loopback: value });
          }}
        />
        <AgoraDivider />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              cycle: text === '' ? this.createState().cycle : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`cycle (defaults: ${this.createState().cycle})`}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              startPos: text === '' ? this.createState().startPos : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`startPos (defaults: ${this.createState().startPos})`}
        />

        <AgoraTextInput
          onChangeText={(text) => {
            if (isNaN(+text)) return;
            this.setState({
              soundId: text === '' ? this.createState().soundId : +text,
            });
          }}
          numberKeyboard={true}
          placeholder={`soundId (defaults: ${this.createState().soundId})`}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            this.setState({ playEffectFilePath: text });
          }}
          placeholder={'playEffectFilePath'}
          value={playEffectFilePath}
        />

        <AgoraSwitch
          title={'publishCustomAudioTrack'}
          value={publishCustomAudioTrack}
          onValueChange={(value) => {
            this.setState({ publishCustomAudioTrack: value });
          }}
        />
        <AgoraSwitch
          title={'publishMediaPlayerAudioTrack'}
          value={publishMediaPlayerAudioTrack}
          onValueChange={(value) => {
            this.setState({ publishMediaPlayerAudioTrack: value });
          }}
        />
        <AgoraSwitch
          title={'publishScreenTrack'}
          value={publishScreenTrack}
          onValueChange={(value) => {
            this.setState({ publishScreenTrack: value });
          }}
        />
        <AgoraSwitch
          title={'publishLoopbackAudioTrack'}
          value={publishLoopbackAudioTrack}
          onValueChange={(value) => {
            this.setState({ publishLoopbackAudioTrack: value });
          }}
        />
        <AgoraSwitch
          title={'publishMicrophoneTrack'}
          value={publishMicrophoneTrack}
          onValueChange={(value) => {
            this.setState({ publishMicrophoneTrack: value });
          }}
        />
      </>
    );
  }

  protected renderAction(): ReactElement | undefined {
    const {
      startAudioMixing,
      pauseAudioMixing,
      startScreenCapture,
      startDirectCdnStreaming,
      playEffect,
      pauseEffect,
    } = this.state;
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
          title={`${startAudioMixing ? 'stop' : 'start'} Audio Mixing`}
          onPress={
            startAudioMixing ? this.stopAudioMixing : this.startAudioMixing
          }
        />
        <AgoraButton
          disabled={!startAudioMixing}
          title={`${pauseAudioMixing ? 'resume' : 'pause'} Audio Mixing`}
          onPress={
            pauseAudioMixing ? this.resumeAudioMixing : this.pauseAudioMixing
          }
        />
        <AgoraButton
          disabled={!startAudioMixing}
          title={`get Audio Mixing Current Position`}
          onPress={this.getAudioMixingCurrentPosition}
        />
        <AgoraButton
          title={`${playEffect ? 'stop' : 'play'} Effect`}
          onPress={playEffect ? this.stopEffect : this.playEffect}
        />
        <AgoraButton
          disabled={!playEffect}
          title={`${pauseEffect ? 'resume' : 'pause'} Effect`}
          onPress={pauseEffect ? this.resumeEffect : this.pauseEffect}
        />
        <AgoraButton
          disabled={startDirectCdnStreaming}
          title={`set Direct Cdn Streaming Video Configuration`}
          onPress={this.setDirectCdnStreamingVideoConfiguration}
        />
        <AgoraButton
          disabled={startDirectCdnStreaming}
          title={`set Direct Cdn Streaming Audio Configuration`}
          onPress={this.setDirectCdnStreamingAudioConfiguration}
        />
        <AgoraButton
          title={`${
            startDirectCdnStreaming ? 'stop' : 'start'
          } Direct Cdn Streaming`}
          onPress={
            startDirectCdnStreaming
              ? this.stopDirectCdnStreaming
              : this.startDirectCdnStreaming
          }
        />
      </>
    );
  }
}
