import { Card, List, Switch } from 'antd';
import createAgoraRtcEngine, {
  ChannelProfileType,
  ClientRoleType,
  DegradationPreference,
  ErrorCodeType,
  IMediaPlayer,
  IMediaPlayerSourceObserver,
  IRtcEngineEventHandler,
  IRtcEngineEx,
  IVideoDeviceManager,
  LocalTranscoderConfiguration,
  MediaPlayerError,
  MediaPlayerState,
  MediaSourceType,
  OrientationMode,
  RtcConnection,
  RtcStats,
  TranscodingVideoStream,
  UserOfflineReasonType,
  VideoCodecType,
  VideoMirrorModeType,
  VideoSourceType,
} from 'electron-agora-rtc-ng';
import { Component } from 'react';
import DropDownButton from '../../component/DropDownButton';
import JoinChannelBar from '../../component/JoinChannelBar';
import { FpsMap, ResolutionMap } from '../../config';
import config from '../../../config/agora.config';
import styles from '../../config/public.scss';
import {
  configMapToOptions,
  getRandomInt,
  getResourcePath,
} from '../../../utils';
import RtcSurfaceView from '../../../components/RtcSurfaceView';

const localUid1 = getRandomInt();

interface Device {
  deviceId: string;
  deviceName: string;
}

interface User {
  isMyself: boolean;
  uid: number;
}

interface State {
  isJoined: boolean;
  channelId: string;
  allUser: User[];
  cameraDevices: Device[];
  currentFps?: number;
  currentResolution?: { width: number; height: number };
  isAddScreenShare: boolean;
  videoDeviceId: string;
  isAddPNG: boolean;
  isAddGIF: boolean;
  isAddMPK: boolean;
}

export default class LocalVideoTranscoder
  extends Component<{}, State, any>
  implements IRtcEngineEventHandler, IMediaPlayerSourceObserver
{
  rtcEngine?: IRtcEngineEx;

  videoDeviceManager: IVideoDeviceManager;

  mpk?: IMediaPlayer;

  state: State = {
    channelId: '',
    allUser: [],
    isJoined: false,
    cameraDevices: [],
    isAddScreenShare: false,
    videoDeviceId: '',
    isAddPNG: false,
    isAddGIF: false,
    isAddMPK: false,
  };

  componentDidMount() {
    this.getRtcEngine().registerEventHandler(this);
    this.getMediaPlayer().registerPlayerSourceObserver(this);
    this.videoDeviceManager = this.getRtcEngine().getVideoDeviceManager();

    this.setState({
      cameraDevices: this.videoDeviceManager.enumerateVideoDevices() as any,
    });
  }

  componentWillUnmount() {
    this.getRtcEngine().unregisterEventHandler(this);
    this.getMediaPlayer().unregisterPlayerSourceObserver(this);
    this.onPressLeaveChannel();
    this.getRtcEngine().release();
  }

  getRtcEngine() {
    if (!this.rtcEngine) {
      this.rtcEngine = createAgoraRtcEngine();
      //@ts-ignore
      window.rtcEngine = this.rtcEngine;
      const res = this.rtcEngine.initialize({
        appId: config.appId,
      });
      this.rtcEngine.setLogFile(config.nativeSDKLogPath);
      console.log('initialize:', res);
    }

    return this.rtcEngine;
  }

  onPlayerSourceStateChanged(
    state: MediaPlayerState,
    ec: MediaPlayerError
  ): void {
    switch (state) {
      case MediaPlayerState.PlayerStateOpenCompleted:
        console.log('onPlayerSourceStateChanged1:open finish');
        this.getMediaPlayer().play();

        break;
      default:
        break;
    }
  }

  onJoinChannelSuccess(
    { channelId, localUid }: RtcConnection,
    elapsed: number
  ): void {
    const { allUser: oldAllUser } = this.state;
    const newAllUser = [...oldAllUser];
    newAllUser.push({ isMyself: true, uid: localUid });
    this.setState({
      isJoined: true,
      allUser: newAllUser,
    });
  }

  onUserJoined(
    connection: RtcConnection,
    remoteUid: number,
    elapsed: number
  ): void {
    console.log(
      'onUserJoined',
      'connection',
      connection,
      'remoteUid',
      remoteUid
    );

    const { allUser: oldAllUser } = this.state;
    const newAllUser = [...oldAllUser];
    newAllUser.push({ isMyself: false, uid: remoteUid });
    this.setState({
      allUser: newAllUser,
    });
  }

  onUserOffline(
    { localUid, channelId }: RtcConnection,
    remoteUid: number,
    reason: UserOfflineReasonType
  ): void {
    console.log('onUserOffline', channelId, remoteUid);

    const { allUser: oldAllUser } = this.state;
    const newAllUser = [...oldAllUser.filter((obj) => obj.uid !== remoteUid)];
    this.setState({
      allUser: newAllUser,
    });
  }

  onLeaveChannel(connection: RtcConnection, stats: RtcStats): void {
    this.setState({
      isJoined: false,
      allUser: [],
    });
  }

  onError(err: ErrorCodeType, msg: string): void {
    console.error(err, msg);
  }

  enableScreenShare = (enable: boolean) => {
    const rtcEngine = this.getRtcEngine();
    if (!enable) {
      rtcEngine.stopPrimaryScreenCapture();
      return;
    }
    const list = rtcEngine
      .getScreenCaptureSources(
        { width: 0, height: 0 },
        { width: 0, height: 0 },
        true
      )
      .filter((info) => info.primaryMonitor);
    if (list.length !== 1) {
      return;
    }
    const sourceId = list[0].sourceId;
    const res = rtcEngine.startPrimaryScreenCapture({
      isCaptureWindow: false,
      screenRect: { width: 0, height: 0, x: 0, y: 0 },
      windowId: sourceId,
      displayId: sourceId,
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
    });
    console.log('startPrimaryScreenCapture', res);
  };

  onPressJoinChannel = (channelId: string) => {
    this.setState({ channelId });
    const { videoDeviceId } = this.state;
    this.getRtcEngine().enableVideo();
    this.getRtcEngine().startPrimaryCameraCapture({
      deviceId: videoDeviceId,
    });
    this.enableScreenShare(true);
    const localTranscoderConfiguration = this.getLocalTranscoderConfiguration();
    this.getRtcEngine().startLocalVideoTranscoder(localTranscoderConfiguration);
    this.getMediaPlayer().open(
      'https://agora-adc-artifacts.oss-cn-beijing.aliyuncs.com/video/meta_live_mpk.mov',
      0
    );
    this.getRtcEngine().joinChannel('', channelId, localUid1, {
      publishCameraTrack: false,
      publishScreenTrack: false,
      publishTrancodedVideoTrack: true,
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    });
  };

  setVideoConfig = () => {
    const { currentFps, currentResolution } = this.state;
    if (!currentResolution || !currentFps) {
      return;
    }

    this.getRtcEngine().setVideoEncoderConfiguration({
      codecType: VideoCodecType.VideoCodecH264,
      dimensions: currentResolution!,
      frameRate: currentFps,
      bitrate: 65,
      minBitrate: 1,
      orientationMode: OrientationMode.OrientationModeAdaptive,
      degradationPreference: DegradationPreference.MaintainBalanced,
      mirrorMode: VideoMirrorModeType.VideoMirrorModeAuto,
    });
  };

  getLocalTranscoderConfiguration = () => {
    const { isAddScreenShare, isAddPNG, isAddGIF, isAddMPK } = this.state;
    const cameraStream = {
      sourceType: MediaSourceType.PrimaryCameraSource,
      x: 0,
      y: 0,
      width: 640,
      height: 320,
      zOrder: 1,
      alpha: 1,
      mirror: true,
    };
    const streams: TranscodingVideoStream[] = [cameraStream];
    if (isAddPNG) {
      streams.push({
        sourceType: MediaSourceType.RtcImagePngSource,
        imageUrl: getResourcePath('png.png'),
        x: 640,
        y: 0,
        width: 300,
        height: 300,
        zOrder: 1,
        alpha: 1,
        mirror: true,
      });
    }
    if (isAddGIF) {
      streams.push({
        sourceType: MediaSourceType.RtcImageGifSource,
        imageUrl: getResourcePath('gif.gif'),
        x: 320,
        y: 160,
        width: 300,
        height: 300,
        zOrder: 2,
        alpha: 1,
        mirror: true,
      });
    }

    if (isAddScreenShare) {
      streams.push({
        sourceType: MediaSourceType.PrimaryScreenSource,
        x: 0,
        y: 320,
        width: 640,
        height: 320,
        zOrder: 1,
        alpha: 1,
        mirror: true,
      });
    }

    if (isAddMPK) {
      streams.push({
        sourceType: MediaSourceType.MediaPlayerSource,
        imageUrl: this.getMediaPlayer().getMediaPlayerId().toString(),
        x: 320,
        y: 640,
        width: 640,
        height: 320,
        zOrder: 1,
        alpha: 1,
        mirror: true,
      });
    }
    const localTranscoderConfiguration: LocalTranscoderConfiguration = {
      streamCount: streams.length,
      VideoInputStreams: streams,
      videoOutputConfiguration: { dimensions: { width: 1080, height: 720 } },
    };
    return localTranscoderConfiguration;
  };

  onPressLeaveChannel = () => {
    this.enableScreenShare(false);
    this.getMediaPlayer().stop();
    this.getRtcEngine().leaveChannel();
    this.getRtcEngine().stopLocalVideoTranscoder();
  };

  updateTranscoderConfiguration = () => {
    const newConfig = this.getLocalTranscoderConfiguration();
    this.getRtcEngine().updateLocalTranscoderConfiguration(newConfig);
  };

  getMediaPlayer = () => {
    if (!this.mpk) {
      const mpk = this.getRtcEngine().createMediaPlayer();
      this.mpk = mpk;
      return mpk;
    }
    return this.mpk;
  };

  renderRightBar = () => {
    const { cameraDevices, isJoined } = this.state;

    return (
      <div className={styles.rightBar}>
        <div>
          <DropDownButton
            options={cameraDevices.map((obj) => {
              const { deviceId, deviceName } = obj;
              return { dropId: deviceId, dropText: deviceName, ...obj };
            })}
            onPress={(res) => {
              this.setState({ videoDeviceId: res.dropId });
            }}
            title="Camera"
          />

          <DropDownButton
            title="Resolution"
            options={configMapToOptions(ResolutionMap)}
            onPress={(res) => {
              this.setState(
                { currentResolution: res.dropId },
                this.setVideoConfig
              );
            }}
          />
          <DropDownButton
            title="FPS"
            options={configMapToOptions(FpsMap)}
            onPress={(res) => {
              this.setState({ currentFps: res.dropId }, this.setVideoConfig);
            }}
          />
          {isJoined && (
            <>
              <br />
              <div
                style={{
                  display: 'flex',
                  textAlign: 'center',
                  alignItems: 'center',
                }}
              >
                {'Add Screen Share'}
                <Switch
                  checkedChildren="Enable"
                  unCheckedChildren="Disable"
                  defaultChecked={this.state.isAddScreenShare}
                  onChange={(isAddScreenShare) => {
                    this.setState(
                      { isAddScreenShare },
                      this.updateTranscoderConfiguration
                    );
                  }}
                />
              </div>
              <br />
              <div
                style={{
                  display: 'flex',
                  textAlign: 'center',
                  alignItems: 'center',
                }}
              >
                {'Add PNG'}
                <Switch
                  checkedChildren="Enable"
                  unCheckedChildren="Disable"
                  defaultChecked={this.state.isAddPNG}
                  onChange={(isAddPNG) => {
                    this.setState(
                      { isAddPNG },
                      this.updateTranscoderConfiguration
                    );
                  }}
                />
              </div>
              <br />
              <div
                style={{
                  display: 'flex',
                  textAlign: 'center',
                  alignItems: 'center',
                }}
              >
                {'Add GIF'}
                <Switch
                  checkedChildren="Enable"
                  unCheckedChildren="Disable"
                  defaultChecked={this.state.isAddGIF}
                  onChange={(isAddGIF) => {
                    this.setState(
                      { isAddGIF },
                      this.updateTranscoderConfiguration
                    );
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  textAlign: 'center',
                  alignItems: 'center',
                }}
              >
                {'Add MPK'}
                <Switch
                  checkedChildren="Enable"
                  unCheckedChildren="Disable"
                  defaultChecked={this.state.isAddMPK}
                  onChange={(isAddMPK) => {
                    this.setState(
                      { isAddMPK },
                      this.updateTranscoderConfiguration
                    );
                  }}
                />
              </div>
            </>
          )}
        </div>
        <JoinChannelBar
          onPressJoin={this.onPressJoinChannel}
          onPressLeave={this.onPressLeaveChannel}
        />
      </div>
    );
  };

  renderItem = ({ isMyself, uid }: User) => {
    const { channelId } = this.state;
    const videoSourceType = isMyself
      ? VideoSourceType.VideoSourceTranscoded
      : VideoSourceType.VideoSourceRemote;

    return (
      <List.Item>
        <Card title={`${isMyself ? 'Local' : 'Remote'} Uid: ${uid}`}>
          <RtcSurfaceView
            canvas={{
              uid,
              sourceType: videoSourceType,
            }}
            connection={{ channelId }}
          />
        </Card>
      </List.Item>
    );
  };

  render() {
    const { isJoined, allUser } = this.state;
    return (
      <div className={styles.screen}>
        <div className={styles.content}>
          {isJoined && (
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 1,
                lg: 1,
                xl: 1,
                xxl: 2,
              }}
              dataSource={allUser}
              renderItem={this.renderItem}
            />
          )}
        </div>
        {this.renderRightBar()}
      </div>
    );
  }
}
