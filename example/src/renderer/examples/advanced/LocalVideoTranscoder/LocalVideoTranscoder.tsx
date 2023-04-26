import createAgoraRtcEngine, {
  ChannelProfileType,
  ClientRoleType,
  IMediaPlayer,
  IMediaPlayerSourceObserver,
  IRtcEngineEventHandler,
  LocalTranscoderConfiguration,
  MediaPlayerError,
  MediaPlayerState,
  RtcConnection,
  RtcStats,
  ScreenCaptureSourceInfo,
  ScreenCaptureSourceType,
  TranscodingVideoStream,
  VideoDeviceInfo,
  VideoSourceType,
} from 'agora-electron-sdk';
import React from 'react';

import {
  BaseComponent,
  BaseVideoComponentState,
} from '../../../components/BaseComponent';
import RtcSurfaceView from '../../../components/RtcSurfaceView';
import {
  AgoraButton,
  AgoraDivider,
  AgoraDropdown,
  AgoraImage,
  AgoraTextInput,
} from '../../../components/ui';
import Config from '../../../config/agora.config';

import { getResourcePath } from '../../../utils';
import { rgbImageBufferToBase64 } from '../../../utils/base64';
import { askMediaAccess } from '../../../utils/permissions';

interface State extends BaseVideoComponentState {
  videoDevices?: VideoDeviceInfo[];
  videoDeviceId?: string[];
  sources?: ScreenCaptureSourceInfo[];
  targetSource?: ScreenCaptureSourceInfo;
  startScreenCapture: boolean;
  url: string;
  open: boolean;
  imageUrl: string;
  startLocalVideoTranscoder: boolean;
  VideoInputStreams: TranscodingVideoStream[];
}

export default class LocalVideoTranscoder
  extends BaseComponent<{}, State>
  implements IRtcEngineEventHandler, IMediaPlayerSourceObserver
{
  protected player?: IMediaPlayer;

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
      videoDevices: [],
      videoDeviceId: [],
      sources: [],
      targetSource: undefined,
      startScreenCapture: false,
      url: 'https://agora-adc-artifacts.oss-cn-beijing.aliyuncs.com/video/meta_live_mpk.mov',
      open: false,
      imageUrl: getResourcePath('png.png'),
      startLocalVideoTranscoder: false,
      VideoInputStreams: [],
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
    this.engine.registerEventHandler(this);
    this.engine.initialize({
      appId,
      logConfig: { filePath: Config.SDKLogPath },
      // Should use ChannelProfileLiveBroadcasting on most of cases
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });

    // Need to enable video on this case
    // If you only call `enableAudio`, only relay the audio stream to the target channel
    askMediaAccess(['microphone', 'camera']);
    this.engine.enableVideo();

    // Start preview before joinChannel
    this.engine.startPreview();
    this.setState({ startPreview: true });

    this.enumerateDevices();
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
      publishMicrophoneTrack: false,
      publishCameraTrack: false,
      publishTranscodedVideoTrack: true,
    });
  }

  /**
   * Step 3-1: enumerateDevices
   */
  enumerateDevices = () => {
    const videoDevices = this.engine
      ?.getVideoDeviceManager()
      .enumerateVideoDevices();

    this.setState({
      videoDevices,
      videoDeviceId: videoDevices?.length
        ? [videoDevices!.at(0)!.deviceId!]
        : [],
    });
  };

  startCameraCapture = (deviceId: string) => {
    const sourceType = this._getVideoSourceTypeCamera(deviceId);
    if (sourceType === undefined) {
      this.error('sourceType is invalid');
      return;
    }
    this.engine?.startCameraCapture(sourceType, { deviceId });
  };

  stopCameraCapture = (deviceId: string) => {
    const sourceType = this._getVideoSourceTypeCamera(deviceId);
    if (sourceType === undefined) {
      this.error('sourceType is invalid');
      return;
    }
    this.engine?.stopScreenCaptureBySourceType(sourceType);
  };

  /**
   * Step 3-2: getScreenCaptureSources
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
   * Step 3-3 (Optional): startScreenCapture
   */
  startScreenCapture = () => {
    const { targetSource } = this.state;
    if (!targetSource) {
      this.error(`targetSource is invalid`);
    }

    this.engine?.startScreenCaptureBySourceType(
      VideoSourceType.VideoSourceScreenPrimary,
      {
        isCaptureWindow:
          targetSource!.type ===
          ScreenCaptureSourceType.ScreencapturesourcetypeWindow,
        screenRect: { width: 0, height: 0, x: 0, y: 0 },
        windowId: targetSource!.sourceId,
        displayId: targetSource!.sourceId,
        params: {
          dimensions: { width: 1920, height: 1080 },
          bitrate: 1000,
          frameRate: 15,
          captureMouseCursor: false,
          windowFocus: false,
          excludeWindowList: [],
          excludeWindowCount: 0,
        },

        regionRect: { x: 0, y: 0, width: 0, height: 0 },
      }
    );
    this.setState({ startScreenCapture: true });
  };

  /**
   * Step 3-4 (Optional): stopScreenCapture
   */
  stopScreenCapture = () => {
    this.engine?.stopScreenCaptureBySourceType(
      VideoSourceType.VideoSourceScreenPrimary
    );
    this.setState({ startScreenCapture: false });
  };

  /**
   * Step 3-3 (Optional): createMediaPlayer
   */
  createMediaPlayer = () => {
    const { url } = this.state;

    if (!url) {
      this.error('url is invalid');
    }

    this.player = this.engine?.createMediaPlayer();
    this.player?.registerPlayerSourceObserver(this);
    this.player?.open(url, 0);
  };

  /**
   * Step 3-4 (Optional): destroyMediaPlayer
   */
  destroyMediaPlayer = () => {
    if (!this.player) {
      return;
    }

    this.engine?.destroyMediaPlayer(this.player);
    this.setState({ open: false });
  };

  /**
   * Step 3-5: startLocalVideoTranscoder
   */
  startLocalVideoTranscoder = () => {
    const config = this._generateLocalTranscoderConfiguration();

    this.engine?.startLocalVideoTranscoder(config);
    this.setState({ startLocalVideoTranscoder: true });
  };

  /**
   * Step 3-6 (Optional): updateLocalTranscoderConfiguration
   */
  updateLocalTranscoderConfiguration = () => {
    this.engine?.updateLocalTranscoderConfiguration(
      this._generateLocalTranscoderConfiguration()
    );
  };

  /**
   * Step 3-7: stopLocalVideoTranscoder
   */
  stopLocalVideoTranscoder = () => {
    this.engine?.stopLocalVideoTranscoder();
    this.setState({ startLocalVideoTranscoder: false });
  };

  _getVideoSourceTypeCamera = (value: string) => {
    const { videoDevices } = this.state;
    return [
      VideoSourceType.VideoSourceCameraPrimary,
      VideoSourceType.VideoSourceCameraSecondary,
      VideoSourceType.VideoSourceCameraThird,
      VideoSourceType.VideoSourceCameraFourth,
    ][videoDevices?.findIndex(({ deviceId }) => deviceId === value) ?? -1];
  };

  _generateLocalTranscoderConfiguration = (): LocalTranscoderConfiguration => {
    const { videoDeviceId, startScreenCapture, open, imageUrl } = this.state;
    const max_width = 1080,
      max_height = 720,
      width = 300,
      height = 300;

    const streams: TranscodingVideoStream[] = [];
    videoDeviceId?.map((v) => {
      streams.push({
        sourceType: this._getVideoSourceTypeCamera(v),
      });
    });

    if (startScreenCapture) {
      streams.push({
        sourceType: VideoSourceType.VideoSourceScreenPrimary,
      });
    }

    if (open) {
      streams.push({
        sourceType: VideoSourceType.VideoSourceMediaPlayer,
        mediaPlayerId: this.player?.getMediaPlayerId(),
      });
    }

    if (imageUrl) {
      const getImageType = (url: string): VideoSourceType | undefined => {
        if (url.endsWith('.png')) {
          return VideoSourceType.VideoSourceRtcImagePng;
        } else if (url.endsWith('.jepg') || url.endsWith('.jpg')) {
          return VideoSourceType.VideoSourceRtcImageJpeg;
        } else if (url.endsWith('.gif')) {
          return VideoSourceType.VideoSourceRtcImageGif;
        }
        return undefined;
      };
      streams.push({
        sourceType: getImageType(imageUrl),
        imageUrl: imageUrl,
      });
    }

    streams.map((value, index) => {
      const maxNumPerRow = Math.floor(max_width / width);
      const numOfRow = Math.floor(index / maxNumPerRow);
      const numOfColumn = Math.floor(index % maxNumPerRow);
      value.x = numOfColumn * width;
      value.y = numOfRow * height;
      value.width = width;
      value.height = height;
      value.zOrder = 1;
      value.alpha = 1;
      value.mirror = false;
    });

    return {
      streamCount: streams.length,
      videoInputStreams: streams,
      videoOutputConfiguration: {
        dimensions: { width: max_width, height: max_height },
      },
    };
  };

  /**
   * Step 4: leaveChannel
   */
  protected leaveChannel() {
    this.destroyMediaPlayer();
    this.engine?.leaveChannel();
  }

  /**
   * Step 5: releaseRtcEngine
   */
  protected releaseRtcEngine() {
    this.engine?.release();
  }

  onLeaveChannel(connection: RtcConnection, stats: RtcStats) {
    this.info('onLeaveChannel', 'connection', connection, 'stats', stats);
    const state = this.createState();
    delete state.videoDevices;
    delete state.videoDeviceId;
    delete state.sources;
    delete state.targetSource;
    this.setState(state);
  }

  onPlayerSourceStateChanged(state: MediaPlayerState, ec: MediaPlayerError) {
    this.info('onPlayerSourceStateChanged', 'state', state, 'ec', ec);
    switch (state) {
      case MediaPlayerState.PlayerStateIdle:
        break;
      case MediaPlayerState.PlayerStateOpening:
        break;
      case MediaPlayerState.PlayerStateOpenCompleted:
        this.setState({ open: true });
        // Auto play on this case
        this.player?.play();
        break;
      case MediaPlayerState.PlayerStatePlaying:
        break;
      case MediaPlayerState.PlayerStatePaused:
        break;
      case MediaPlayerState.PlayerStatePlaybackCompleted:
        break;
      case MediaPlayerState.PlayerStatePlaybackAllLoopsCompleted:
        break;
      case MediaPlayerState.PlayerStateStopped:
        break;
      case MediaPlayerState.PlayerStatePausingInternal:
        break;
      case MediaPlayerState.PlayerStateStoppingInternal:
        break;
      case MediaPlayerState.PlayerStateSeekingInternal:
        break;
      case MediaPlayerState.PlayerStateGettingInternal:
        break;
      case MediaPlayerState.PlayerStateNoneInternal:
        break;
      case MediaPlayerState.PlayerStateDoNothingInternal:
        break;
      case MediaPlayerState.PlayerStateSetTrackInternal:
        break;
      case MediaPlayerState.PlayerStateFailed:
        break;
    }
  }

  protected renderUsers(): React.ReactNode {
    const {
      startPreview,
      joinChannelSuccess,
      startLocalVideoTranscoder,
      videoDeviceId,
    } = this.state;
    return (
      <>
        {startLocalVideoTranscoder
          ? this.renderUser({
              uid: 0,
              sourceType: VideoSourceType.VideoSourceTranscoded,
            })
          : undefined}
        {startPreview || joinChannelSuccess
          ? videoDeviceId?.map((value) =>
              this.renderUser({
                uid: 0,
                sourceType: this._getVideoSourceTypeCamera(value),
              })
            )
          : undefined}
      </>
    );
  }

  protected renderConfiguration(): React.ReactNode {
    const {
      videoDevices,
      videoDeviceId,
      sources,
      targetSource,
      startScreenCapture,
      url,
      open,
      imageUrl,
    } = this.state;
    return (
      <>
        <AgoraDropdown
          title={'videoDeviceId'}
          items={videoDevices?.map((value) => {
            return {
              value: value.deviceId!,
              label: value.deviceName!,
            };
          })}
          value={videoDeviceId}
          onValueChange={(value, index) => {
            if (videoDeviceId?.indexOf(value) === -1) {
              this.startCameraCapture(value);
              this.setState({
                videoDeviceId: [...videoDeviceId, value],
              });
            } else {
              this.stopCameraCapture(value);
              this.setState({
                videoDeviceId: videoDeviceId?.filter((v) => v !== value),
              });
            }
          }}
        />
        <AgoraDivider />
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
            this.setState({ targetSource: sources?.at(index) });
          }}
        />
        {targetSource ? (
          <AgoraImage
            source={rgbImageBufferToBase64(targetSource.thumbImage)}
          />
        ) : undefined}
        <AgoraButton
          title={`${startScreenCapture ? 'stop' : 'start'} Screen Capture`}
          onPress={
            startScreenCapture
              ? this.stopScreenCapture
              : this.startScreenCapture
          }
        />
        <AgoraDivider />
        <AgoraTextInput
          onChangeText={(text) => {
            this.setState({ url: text });
          }}
          placeholder={'url'}
          value={url}
        />
        {open ? (
          <RtcSurfaceView
            canvas={{
              mediaPlayerId: this.player?.getMediaPlayerId(),
              sourceType: VideoSourceType.VideoSourceMediaPlayer,
            }}
          />
        ) : undefined}
        <AgoraButton
          title={`${open ? 'destroy' : 'create'} Media Player`}
          onPress={open ? this.destroyMediaPlayer : this.createMediaPlayer}
        />
        <AgoraDivider />
        <AgoraTextInput
          onChangeText={(text) => {
            this.setState({ imageUrl: text });
          }}
          placeholder={'imageUrl'}
          value={imageUrl}
        />
      </>
    );
  }

  protected renderAction(): React.ReactNode {
    const { startLocalVideoTranscoder } = this.state;
    return (
      <>
        <AgoraButton
          title={`${
            startLocalVideoTranscoder ? 'stop' : 'start'
          } Local Video Transcoder`}
          onPress={
            startLocalVideoTranscoder
              ? this.stopLocalVideoTranscoder
              : this.startLocalVideoTranscoder
          }
        />
        <AgoraButton
          disabled={!startLocalVideoTranscoder}
          title={`update Local Transcoder Configuration`}
          onPress={this.updateLocalTranscoderConfiguration}
        />
      </>
    );
  }
}
