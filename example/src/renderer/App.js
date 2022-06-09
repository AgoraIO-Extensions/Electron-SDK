import electron, { ipcRenderer } from "electron";
import React, { Component } from "react";
import createAgoraRtcEngine, {
  AgoraEnv,
  AudioProfileType,
  AudioScenarioType,
  ChannelProfileType,
  ClientRoleType,
  DegradationPreference,
  IAudioDeviceManagerImpl,
  IVideoDeviceManagerImpl,
  logDebug,
  OrientationMode,
  RenderModeType,
  VideoCodecType,
  VideoMirrorModeType,
  VideoSourceType,
} from "../../../";
import { APP_ID } from "../utils/settings";
const desktopCapturer = {
  getSources: (opts) =>
    ipcRenderer.invoke("DESKTOP_CAPTURER_GET_SOURCES", opts),
};
window.electron = electron;

AgoraEnv.enableLogging = true;
AgoraEnv.enableDebugLogging = true;
const { AgoraRendererManager } = AgoraEnv;

const rtcEngine = createAgoraRtcEngine();
window.rtcEngine = rtcEngine;
let mpk;

class RemoteWindow extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { uid, channelId } = this.props;
    const id = `remoteVideo-${uid}`;
    let dom = document.getElementById(id);
    AgoraRendererManager.setupVideo({
      videoSourceType: VideoSourceType.VideoSourceRemote,
      uid,
      channelId,
      view: dom,
      rendererOptions: { mirror: true, contentMode: 1 },
    });
  }
  componentWillUnmount() {
    const { uid, channelId } = this.props;
    const id = `remoteVideo-${uid}`;
    let dom = document.getElementById(id);
    rtcEngine && rtcEngine.destroyRendererByView(dom);
  }

  render() {
    const { uid } = this.props;
    const id = `remoteVideo-${uid}`;
    return (
      <div
        key={id}
        className="render-view"
        id={id}
        style={{ backgroundColor: "green" }}
      />
    );
  }
}

const defaultState = {
  isSetFirstCameraView: false,
  isSetSecondCameraView: false,
  isSetFirstScreenShareView: false,
  isSetSecondScreenShareView: false,

  isOpenFirstCamera: true,
  isOpenSecondCamera: false,
  isStartFirstScreenShare: false,
  isStartSecondScreenShare: false,

  users: [],
  channelId: "testElectron",
};
export default class App extends Component {
  constructor(props) {
    super(props);
  }
  state = Object.assign({}, defaultState);
  componentDidMount() {
    console.log("## pid", process.pid);
    rtcEngine.registerEventHandler(this);
  }
  componentWillUnmount() {
    rtcEngine.unregisterEventHandler(this);
    mpk.unregisterPlayerSourceObserver(this);
  }

  onPressInitialize = () => {
    console.log("onPressInitialize", rtcEngine);
    if (!rtcEngine) {
      return;
    }

    let res = rtcEngine.initialize({ appId: APP_ID });
    console.log("initialize", res);
    // rtcEngine.getScreenCaptureSources({width: 100, height: 100}, {width: 100, height: 100}, true)
    // console.log("initialize res", res);
    // rtcEngine.setRenderMode(1);

    res = rtcEngine.setChannelProfile(
      ChannelProfileType.ChannelProfileLiveBroadcasting
    );
    console.log("setChannelProfile", res);

    res = rtcEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
    console.log("setClientRole", res);

    res = rtcEngine.setAudioProfile(
      AudioProfileType.AudioProfileDefault,
      AudioScenarioType.AudioScenarioChatroom
    );

    console.log("setAudioProfile", res);

    res = rtcEngine.enableVideo();
    console.log("enableVideo", res);

    res = rtcEngine.enableWebSdkInteroperability(true);
    console.log("enableWebSdkInteroperability", res);
    // rtcEngine.setRenderMode(2);

    res = rtcEngine.setVideoEncoderConfiguration({
      codecType: VideoCodecType.VideoCodecH264,
      dimensions: { width: 300, height: 120 },
      frameRate: 15,
      bitrate: 65,
      minBitrate: 1,
      orientationMode: OrientationMode.OrientationModeAdaptive,
      degradationPreference: DegradationPreference.MaintainBalanced,
      mirrorMode: VideoMirrorModeType.VideoMirrorModeAuto,
    });
    console.log("setVideoEncoderConfiguration", res);

    const ver = rtcEngine.getVersion();
    console.log("getVersion", ver);
    rtcEngine.startPreview();
  };
  onJoinChannelSuccessEx(connection, elapsed) {
    this.setState({ isJoin: true });
    console.info("JOINED_CHANNEL", connection, elapsed);
    let streamId = rtcEngine.createDataStream(true, true);
    setInterval(() => {
      console.log('streamId:  ', streamId)
      let buffer = new Uint8Array(6)
      buffer[0] = 100
      buffer[1] = 9
      buffer[2] = 8
      buffer[3] = 4
      buffer[4] = 6
      let streamMessage  = rtcEngine.sendStreamMessage(streamId, buffer, buffer.length)
      console.log('sendStreamMessage:  ', streamMessage, buffer.length, buffer[3])
    }, 50);
  }

  onStreamMessageEx(connection, remoteUid, streamId, data, length, sentTs) {
    console.log("onStreamMessageEx ======= ", connection, remoteUid, streamId, data[0], data[1], data[2], data[3], data[4], length, sentTs);
  }

  onApiCallExecuted(err, api, result) {
    console.log("onApiCallExecuted  ", err, api, result)
  }

  onLeaveChannelEx(connection, stats) {
    console.info("LEAVE_CHANNEL", connection, stats);
  }
  
  onUserJoinedEx(connection, remoteUid, elapsed) {
    // console.info("USER_JOINED", connection, remoteUid, elapsed);
    // if (remoteUid === 10001 || remoteUid === 10011 || remoteUid === 10012) {
    //   console.log("USER_JOINED 过滤", remoteUid);
    //   return;
    // }
    // const { users } = this.state;
    // console.log("USER_JOINED", users);

    // if (users.filter((id) => id === remoteUid).length > 0) {
    //   console.log("USER_JOINED filterUser length", filterUser);
    //   return;
    // }

    // console.log("USER_JOINED 没有过滤", remoteUid);
    // this.setState({ users: [...users, remoteUid] });
  }
  onUserOfflineEx(connection, remoteUid, reason) {
    // console.info("USER_OFFLINE", connection, remoteUid, reason);

    // const { users } = this.state;
    // this.setState({ users: users.filter((uid) => uid !== remoteUid) });
  }
  onPlayerSourceStateChanged(state, ec) {
    switch (state) {
      case 2:
        console.log("onPlayerSourceStateChanged1:open finish");
        mpk?.play();
        break;
      default:
        break;
    }
    console.log("onPlayerSourceStateChanged", state, ec);
  }

  onPressJoin = () => {
    const { channelId } = this.state;
    let res = rtcEngine.joinChannel("", channelId, "", 0);
    console.log("joinChannel", res);
  };
  onPressLeaveChannel = () => {
    rtcEngine.leaveChannel();
  };
  onPressTestDeviceManager = () => {
    const videoDeviceManager = new IVideoDeviceManagerImpl();
    window.videoDeviceManage = videoDeviceManager;
    console.log(
      "videoDeviceManager:enumerateVideoDevices",
      videoDeviceManager.enumerateVideoDevices()
    );

    const audioDeviceManager = new IAudioDeviceManagerImpl();
    window.audioDeviceManager = audioDeviceManager;
    console.log(
      "audioDeviceManager::enumeratePlaybackDevices",
      audioDeviceManager.enumeratePlaybackDevices()
    );
    console.log(
      "audioDeviceManager::enumerateRecordingDevices",
      audioDeviceManager.enumerateRecordingDevices()
    );
  };
  onPressCreateMediaPlayer = () => {
    window.mpk = mpk = rtcEngine.createMediaPlayer();
    mpk.registerPlayerSourceObserver(this);
    console.log("createMediaPlayer", mpk);
    let res = mpk.open(
      "https://agora-adc-artifacts.oss-cn-beijing.aliyuncs.com/video/meta_live_mpk.mov",
      0
    );
    console.log("mpk::open", res);

    this.setState({ isPlaying: true });
  };

  onPressMpkStopOrResume = () => {
    const { isPlaying } = this.state;
    if (isPlaying) {
      mpk?.pause();
    } else {
      mpk?.resume();
    }
    this.setState({ isPlaying: !isPlaying });
  };

  onPressRelease = () => {
    if (!rtcEngine) {
      return;
    }
    rtcEngine.release();
    this.setState(defaultState);
  };

  onPressSetViewForFirstCamera = () => {
    const { isSetFirstCameraView } = this.state;
    let dom = document.getElementById("firstCamera");
    let domAppend = document.getElementById("firstCamera-append");
    AgoraRendererManager.setupVideo({
      videoSourceType: VideoSourceType.VideoSourceCameraPrimary,

      view: isSetFirstCameraView ? null : dom,
      rendererOptions: {
        mirror: false,
        contentMode: RenderModeType.RenderModeFit,
      },
    });
    AgoraRendererManager.setupVideo({
      videoSourceType: VideoSourceType.VideoSourceCameraPrimary,

      view: isSetFirstCameraView ? null : domAppend,
      rendererOptions: {
        mirror: true,
        contentMode: RenderModeType.RenderModeHidden,
      },
    });
    this.setState({ isSetFirstCameraView: !isSetFirstCameraView });
  };
  onPressToggleFirstCamera = () => {
    const { isOpenFirstCamera } = this.state;
    if (isOpenFirstCamera) {
      rtcEngine.stopPrimaryCameraCapture();
    } else {
      const videoList = rtcEngine.getVideoDevices();
      rtcEngine.startPrimaryCameraCapture({
        deviceId: videoList[0].deviceId,
        format: { width: 640, height: 320, fps: FRAME_RATE.FRAME_RATE_FPS_10 },
      });
    }
    this.setState({ isOpenFirstCamera: !isOpenFirstCamera });
  };
  onPressSetViewForSecondCamera = () => {
    const { isSetSecondCameraView } = this.state;
    // rtcEngine.setRenderMode(2);
    let dom = document.getElementById("secondCamera");
    AgoraRendererManager.setupVideo({
      videoSourceType: VideoSourceType.kVideoSourceTypeCameraSecondary,

      view: isSetSecondCameraView ? null : dom,
      rendererOptions: { mirror: true, contentMode: 1 },
    });
    this.setState({ isSetSecondCameraView: !isSetSecondCameraView });
  };
  onPressToggleSecondCamera = () => {
    const { isOpenSecondCamera } = this.state;
    if (isOpenSecondCamera) {
      rtcEngine.stopSecondaryCameraCapture();
    } else {
      const videoList = rtcEngine.getVideoDevices();
      rtcEngine.startSecondaryCameraCapture({
        deviceId: videoList[1].deviceId,
        format: { width: 640, height: 320, fps: FRAME_RATE.FRAME_RATE_FPS_10 },
      });
    }
    this.setState({ isOpenSecondCamera: !isOpenSecondCamera });
  };
  onPressSetViewForFirstScreenShare = () => {
    const { isSetFirstScreenShareView } = this.state;
    // rtcEngine.setRenderMode(2);
    let dom = document.getElementById("scrrenShare1");
    AgoraRendererManager.setupVideo({
      videoSourceType: VideoSourceType.VideoSourceScreen,

      view: isSetFirstScreenShareView ? null : dom,
      rendererOptions: { mirror: true, contentMode: 1 },
    });
    this.setState({ isSetFirstScreenShareView: !isSetFirstScreenShareView });
  };
  onPressToggleFirstScreenShare = async () => {
    const { isStartFirstScreenShare } = this.state;

    const res = await desktopCapturer.getSources({
      types: ["window", "screen"],
    });
    const id = res[0].id.split(":")[1];
    const windowId = res[1].id.split(":")[1];
    console.log("getSources", res);
    console.log("getSources  id", id, "  windowId", windowId);
    if (!isStartFirstScreenShare) {
      const res = rtcEngine.startPrimaryScreenCapture({
        isCaptureWindow: false,
        displayId: parseInt(id),
        screenRect: { width: 0, height: 0, x: 0, y: 0 },
        windowId: parseInt(windowId),
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
      rtcEngine.joinChannelEx(
        "",
        {
          localUid: 10011,
          channelId: this.state.channelId,
        },
        {
          publishCameraTrack: false,
          publishAudioTrack: false,
          publishScreenTrack: true,
          publishCustomAudioTrack: false,
          publishCustomVideoTrack: false,
          publishEncodedVideoTrack: false,
          publishMediaPlayerAudioTrack: false,
          publishMediaPlayerVideoTrack: false,
          autoSubscribeAudio: false,
          autoSubscribeVideo: false,
          clientRoleType: 1,
        }
      );
      console.log("startSecondaryScreenCapture", res);
    } else {
      const res = rtcEngine.stopPrimaryScreenCapture();
      console.log("stopPrimaryScreenCapture", res);
    }
    this.setState({ isStartFirstScreenShare: !isStartFirstScreenShare });
  };
  onPressSetViewForSecondScreenShare = () => {
    const { isSetSecondScreenShareView } = this.state;
    // rtcEngine.setRenderMode(2);
    let dom = document.getElementById("scrrenShare2");
    AgoraRendererManager.setupVideo({
      videoSourceType: VideoSourceType.VideoSourceScreenSecondary,
      view: isSetSecondScreenShareView ? null : dom,
      rendererOptions: { mirror: true, contentMode: 1 },
    });
    this.setState({ isSetSecondScreenShareView: !isSetSecondScreenShareView });
  };
  onPressToggleSecondScreenShare = async () => {
    const { isStartSecondScreenShare } = this.state;
    const res = await desktopCapturer.getSources({
      types: ["window", "screen"],
    });
    const id = res[0].id.split(":")[1];
    const windowId = res[1].id.split(":")[1];
    console.log("getSources", res);
    console.log("getSources  id", id, "  windowId", windowId);

    if (!isStartSecondScreenShare) {
      const res = rtcEngine.startSecondaryScreenCapture({
        isCaptureWindow: true,
        displayId: parseInt(id),
        screenRect: { width: 0, height: 0, x: 0, y: 0 },
        windowId: parseInt(windowId),
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
      rtcEngine.joinChannelEx(
        "",
        {
          localUid: 10012,
          channelId: this.state.channelId,
        },
        {
          publishCameraTrack: false,
          publishAudioTrack: false,
          publishScreenTrack: false,
          publishSecondaryScreenTrack: true,
          publishCustomAudioTrack: false,
          publishCustomVideoTrack: false,
          publishEncodedVideoTrack: false,
          publishMediaPlayerAudioTrack: false,
          publishMediaPlayerVideoTrack: false,
          autoSubscribeAudio: false,
          autoSubscribeVideo: false,
          clientRoleType: 1,
        }
      );
      console.log("startSecondaryScreenCapture", res);
    } else {
      rtcEngine.stopSecondaryScreenCapture();
    }
    this.setState({ isStartSecondScreenShare: !isStartSecondScreenShare });
  };
  renderViews = () => {
    return (
      <div className="renderViewList">
        <div className="renderViewListForRow">
          <div
            className="render-view"
            id={"firstCamera"}
            style={{ backgroundColor: "yellow" }}
          />
          <div
            className="render-view"
            id={"firstCamera-append"}
            style={{ backgroundColor: "yellow" }}
          />
          <div
            className="render-view"
            id={"secondCamera"}
            style={{ backgroundColor: "red" }}
          />

          <div
            className="render-view"
            id={"scrrenShare1"}
            style={{ backgroundColor: "gray" }}
          />
          <div
            className="render-view"
            id={"scrrenShare2"}
            style={{ backgroundColor: "blue" }}
          />
        </div>
      </div>
    );
  };
  onPressTest = async () => {
    const res = rtcEngine.getScreenCaptureSources(200, 200, true);
    console.log("getScreenCaptureSources", res);

    // return;
    // const res = await electron.desktopCapturer.getSources({
    //   types: ["window", "screen"],
    // });
    // console.log("getScreenSources", res);
    return;
    const mediaOpt = {
      autoSubscribeAudio: true,
      autoSubscribeVideo: true,
      publishAudioTrack: true,
      publishCameraTrack: true,
      publishScreenTrack: false,
      clientRoleType: CLIENT_ROLE_TYPE.CLIENT_ROLE_BROADCASTER,
      channelProfile: CHANNEL_PROFILE_TYPE.CHANNEL_PROFILE_LIVE_BROADCASTING,
    };
    const rtcConnection = {
      channelId: "asda",
      localUid: 2,
    };
    const rect = { x: 1, y: 2, width: 111, height: 222 };
    const watermarkOpt = {
      visibleInPreview: true,
      positionInLandscapeMode: rect,
      positionInPortraitMode: rect,
    };
    const VideoInputStreams = [
      {
        sourceType: MEDIA_SOURCE_TYPE.AUDIO_PLAYOUT_SOURCE,
        remoteUserUid: 1,
        imageUrl: "ads",
        x: 1,
        y: 1,
        width: 1,
        height: 1,
        zOrder: 1,
        alpha: 1,
        mirror: true,
      },
    ];
    const videoOutputConfiguration = {
      codecType: 1,
      dimensions: { width: 300, height: 300 },
      frameRate: 1,
      bitrate: 1,
      minFrameRate: 1,
      minBitrate: 1,
      orientationMode: 1,
      degradationPreference: 1,
      mirrorMode: 1,
    };
    const LocalTranscoderConfiguration = {
      streamCount: 0,
      VideoInputStreams,
      videoOutputConfiguration,
    };
    const EncodedVideoTrackOptions = {
      ccMode: TCcMode.CC_DISABLED,
      codecType: VIDEO_CODEC_TYPE.VIDEO_CODEC_E264,
      targetBitrate: 200,
    };
    const channelMediaOpt = {
      publishCameraTrack: false,
      publishSecondaryCameraTrack: false,
      publishAudioTrack: false,
      publishScreenTrack: false,
      publishSecondaryScreenTrack: false,
      publishCustomAudioTrack: false,
      publishCustomAudioSourceId: false,
      publishCustomAudioTrackEnableAec: false,
      publishDirectCustomAudioTrack: false,
      publishCustomVideoTrack: false,
      publishEncodedVideoTrack: false,
      publishMediaPlayerAudioTrack: false,
      publishMediaPlayerVideoTrack: false,
      publishTrancodedVideoTrack: false,
      autoSubscribeAudio: false,
      autoSubscribeVideo: false,
      enableAudioRecordingOrPlayout: false,
      publishMediaPlayerId: false,
      clientRoleType: CLIENT_ROLE_TYPE.CLIENT_ROLE_AUDIENCE,
      audienceLatencyLevel:
        AUDIENCE_LATENCY_LEVEL_TYPE.AUDIENCE_LATENCY_LEVEL_LOW_LATENCY,
      defaultVideoStreamType: VIDEO_STREAM_TYPE.VIDEO_STREAM_HIGH,
      channelProfile: CHANNEL_PROFILE_TYPE.CHANNEL_PROFILE_COMMUNICATION,
      audioDelayMs: 10,
      token: "token",
      encodedVideoTrackOption: EncodedVideoTrackOptions,
    };
    const videoEncoderConf = {
      codecType: VIDEO_CODEC_TYPE.VIDEO_CODEC_E264,
      dimensions: { width: 640, height: 300 },
      frameRate: FRAME_RATE.FRAME_RATE_FPS_10,
      bitrate: 200,
      minFrameRate: 200,
      minBitrate: 200,
      orientationMode: ORIENTATION_MODE.ORIENTATION_MODE_ADAPTIVE,
      degradationPreference: DEGRADATION_PREFERENCE.MAINTAIN_BALANCED,
      mirrorMode: VIDEO_MIRROR_MODE_TYPE.AUTO,
    };
    const directCdnStreamingMediaOpt = {
      publishCameraTrack: true,
      publishMicrophoneTrack: true,
      publishCustomAudioTrack: true,
      publishCustomVideoTrack: true,
    };
    // rtcEngine.updateChannelMediaOptions(mediaOpt);
    // rtcEngine.muteRemoteAudioStreamEx(1, true, rtcConnection);

    // rtcEngine.muteRemoteVideoStreamEx(1, true, rtcConnection);
    // rtcEngine.setRemoteVoicePositionEx(1, 2.2, 3.3, rtcConnection);
    // rtcEngine.setRemoteVoice3DPositionEx(1, 2.1, 3.2, 4.1, rtcConnection);
    // rtcEngine.enableLoopBackRecordingEx(true, rtcConnection);
    // rtcEngine.getConnectionStateEx(rtcConnection);
    // rtcEngine.enableEncryptionEx(rtcConnection, true, {
    //   encryptionMode: ENCRYPTION_MODE.AES_128_ECB,
    //   encryptionKey: "asd",
    //   encryptionKdfSalt: [1, 2, 3],
    // });
    // rtcEngine.createDataStreamEx(
    //   { syncWithAudio: true, ordered: true },
    //   rtcConnection
    // );

    rtcEngine.sendStreamMessageEx(1, "12321");
    rtcEngine.addVideoWaterMarkEx("asdasd", watermarkOpt, rtcConnection);
    rtcEngine.clearVideoWatermarkEx(rtcConnection);
    rtcEngine.sendCustomReportMessageEx("1", "2", "3", "4", 5, rtcConnection);
    rtcEngine.registerAudioEncodedFrameObserver({
      postionType:
        AUDIO_ENCODED_FRAME_OBSERVER_POSITION.AUDIO_ENCODED_FRAME_OBSERVER_POSITION_MIXED,
      encodingType: AUDIO_ENCODING_TYPE.AUDIO_ENCODING_TYPE_AAC_16000_MEDIUM,
    });
    rtcEngine.playAllEffects(1, 2.2, 3.3, 4, true);
    rtcEngine.getVolumeOfEffect(1);

    rtcEngine.unloadAllEffects();
    rtcEngine.setRemoteVoice3DPosition(1, 2.2, 3.3, 4.4);
    rtcEngine.setVoiceConversionParameters(
      VOICE_CONVERSION_PRESET.VOICE_CHANGER_BASS,
      1,
      2
    );
    rtcEngine.setLogLevel(1, LOG_LEVEL.LOG_LEVEL_FATAL);
    rtcEngine.setExternalAudioSink(1, 2);
    const audioTrack = { enableLocalPlayback: true };
    rtcEngine.startPrimaryCustomAudioTrack(audioTrack);
    rtcEngine.stopPrimaryCustomAudioTrack();
    rtcEngine.startSecondaryCustomAudioTrack(audioTrack);
    rtcEngine.stopSecondaryCustomAudioTrack();
    //crash
    rtcEngine.setPlaybackAudioFrameParameters(
      8000,
      2,
      RAW_AUDIO_FRAME_OP_MODE_TYPE.RAW_AUDIO_FRAME_OP_MODE_READ_WRITE,
      3
    );
    //crash
    rtcEngine.setMixedAudioFrameParameters(8000, 2, 3);
    //crash
    rtcEngine.setPlaybackAudioFrameBeforeMixingParameters(1, 2);

    rtcEngine.enableAudioSpectrumMonitor(1);
    rtcEngine.disableAudioSpectrumMonitor();
    rtcEngine.muteRecordingSignal(true);
    rtcEngine.enableLoopBackRecording(true);
    rtcEngine.adjustLoopbackRecordingVolume(22);
    rtcEngine.getLoopbackRecordingVolume();
    rtcEngine.enableInEarMonitoring(true, 2);
    rtcEngine.setInEarMonitoringVolume(1);

    rtcEngine.startLocalVideoTranscoder(LocalTranscoderConfiguration);
    rtcEngine.updateLocalTranscoderConfiguration(LocalTranscoderConfiguration);
    rtcEngine.stopLocalVideoTranscoder();
    rtcEngine.setCameraDeviceOrientation(
      VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA,
      VIDEO_ORIENTATION.VIDEO_ORIENTATION_0
    );
    rtcEngine.setScreenCaptureOrientation(
      VIDEO_SOURCE_TYPE.VIDEO_SOURCE_CAMERA,
      VIDEO_ORIENTATION.VIDEO_ORIENTATION_0
    );
    rtcEngine.stopPrimaryScreenCapture();
    rtcEngine.pauseAudio();
    rtcEngine.resumeAudio();
    rtcEngine.unRegisterMediaMetadataObserver(METADATA_TYPE.VIDEO_METADATA);
    rtcEngine.startAudioFrameDump("1", 2, "3", "4", "5", 6, true);
    rtcEngine.stopAudioFrameDump("1", 2, "3");
    rtcEngine.joinChannelWithUserAccountEx("1", "2", "3", channelMediaOpt);
    rtcEngine.setDirectCdnStreamingAudioConfiguration(
      AUDIO_CODEC_PROFILE_TYPE.AUDIO_CODEC_PROFILE_HE_AAC
    );

   // rtcEngine.setDirectCdnStreamingVideoConfiguration(videoEncoderConf);

    rtcEngine.startDirectCdnStreaming("12321", directCdnStreamingMediaOpt);
    rtcEngine.stopDirectCdnStreaming();
    rtcEngine.updateDirectCdnStreamingMediaOptions(directCdnStreamingMediaOpt);
    rtcEngine.joinChannelEx("token", rtcConnection, channelMediaOpt);
    rtcEngine.leaveChannelEx(rtcConnection);
    rtcEngine.updateChannelMediaOptionsEx(channelMediaOpt, rtcConnection);
   // rtcEngine.setVideoEncoderConfigurationEx(videoEncoderConf, rtcConnection);
    rtcEngine.setAppType();

    rtcEngine.setExternalVideoSource(
      true,
      true,
      true,
      EncodedVideoTrackOptions
    );
    rtcEngine.setExternalAudioSource(true, 200, 1, 2, true, true);
    rtcEngine.getCertificateVerifyResult("1", "2");
    rtcEngine.adjustCustomAudioPublishVolume(1, 2);
    rtcEngine.adjustCustomAudioPlayoutVolume(1, 2);
    rtcEngine.enableDirectExternalAudioSource(true);
    rtcEngine.enableCustomAudioLocalPlayback(1, true);
  };

  render() {
    const {
      isOpenFirstCamera,
      isOpenSecondCamera,
      isStartFirstScreenShare,
      isPlaying,
      users,
    } = this.state;
    const mpkId = mpk && mpk.getMediaPlayerId();
    console.log("getMediaPlayerId", mpkId);
    return (
      <div className="content">
        <div>process uid:{process.pid}</div>
        <button onClick={this.onPressInitialize}>Initialize</button>
        <button onClick={this.onPressRelease}>Release</button>
        <button onClick={this.onPressJoin}>JoinChannel</button>
        <button onClick={this.onPressLeaveChannel}>leaveChannel</button>
        <button onClick={this.onPressTestDeviceManager}>testDevice</button>
        <button onClick={this.onPressCreateMediaPlayer}>
          createMediaPlayer
        </button>
        {isPlaying !== undefined && (
          <button onClick={this.onPressMpkStopOrResume}>
            {isPlaying ? "press to stop" : "press to play"}
          </button>
        )}

        <div>
          <div style={{ display: "inline-block" }}>
            FirstCamera:
            <button onClick={this.onPressSetViewForFirstCamera}>
              setViewForFirstCamera
            </button>
            <button onClick={this.onPressToggleFirstCamera}>
              {!isOpenFirstCamera ? "Open FirstCamera" : "Close FirstCamera"}
            </button>
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div style={{ display: "inline-block" }}>
            SecondCamera:
            <button onClick={this.onPressSetViewForSecondCamera}>
              setViewForSecondCamera
            </button>
            <button onClick={this.onPressToggleSecondCamera}>
              {!isOpenSecondCamera ? "Open SecondCamera" : "Close SecondCamera"}
            </button>
          </div>
        </div>
        <div>
          <div style={{ display: "inline-block" }}>
            FirstScreenShare:
            <button onClick={this.onPressSetViewForFirstScreenShare}>
              setViewForFirstScreenShare
            </button>
            <button onClick={this.onPressToggleFirstScreenShare}>
              StartFirstScreenShare
            </button>
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div style={{ display: "inline-block" }}>
            SecondScreenShare:
            <button onClick={this.onPressSetViewForSecondScreenShare}>
              setViewForSecondScreenShare
            </button>
            <button onClick={this.onPressToggleSecondScreenShare}>
              StartSecondScreenShare
            </button>
          </div>
        </div>
        <div>
          <button onClick={this.onPressTest}>test</button>
        </div>
        <div>
          <div style={{ display: "flex" }}>
            <agora-view
              style={{
                width: 250,
                height: 250,
                background: "green",
                display: "inline-block",
              }}
              video-source-type={VideoSourceType.VideoSourceCamera}
              uid={0}
              channel-id={""}
              renderer-content-mode={RenderModeType.RenderModeFit}
              renderer-mirror={false}
            ></agora-view>
            {this.state.isPlaying !== undefined && (
              <agora-view
                style={{
                  width: 250,
                  height: 250,
                  background: "green",
                  display: "inline-block",
                }}
                video-source-type={VideoSourceType.VideoSourceMediaPlayer}
                uid={mpkId}
                channel-id={""}
                renderer-content-mode={RenderModeType.RenderModeFit}
                renderer-mirror={false}
              ></agora-view>
            )}
            <div className="renderViewListForRow">
              {users.map((uid) => (
                <RemoteWindow
                  uid={uid}
                  channelId={channelId}
                  key={"view" + uid}
                />
              ))}
            </div>
          </div>
          {this.renderViews()}
        </div>
      </div>
    );
  }
}
