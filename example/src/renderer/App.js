import React, { Component, useEffect } from "react";
import AgoraRtcEngine, {
  ApiTypeEngine,
  CHANNEL_PROFILE_TYPE,
  CLIENT_ROLE_TYPE,
  AUDIO_PROFILE_TYPE,
  AUDIO_SCENARIO_TYPE,
  VideoSourceType,
  FRAME_RATE,
  EngineEvents,
} from "../../../";
import { List } from "immutable";
import path from "path";
import { APP_ID } from "../utils/settings";

const isMac = process.platform === "darwin";
let rtcEngine = new AgoraRtcEngine();
rtcEngine = null;

const RemoteWindow = ({ uid, channelId }) => {
  const id = `remoteVideo-${uid}`;
  console.log("users", uid);
  useEffect(() => {
    try {
      let dom = document.getElementById(id);
      console.log("dom", dom);
      setTimeout(() => {
        rtcEngine.setView({
          videoSourceType: VideoSourceType.kVideoSourceRemote,
          uid,
          channelId,

          view: dom,
          rendererOptions: { mirror: true, contentMode: 1 },
        });
      }, 2000);
    } catch (error) {
      console.log(error);
    } finally {
      console.log("finish setView");
    }
    return () => {
      // rtcEngine.setView({
      //   videoSourceType: VideoSourceType.kVideoSourceRemote,
      //   uid,
      //   channelId,
      //   view: dom,
      //   rendererOptions: { mirror: true, contentMode: 1 },
      // });
    };
  }, []);

  return (
    <div
      key={id}
      className="render-view"
      id={id}
      style={{ backgroundColor: "green" }}
    />
  );
};
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
  channelId: "testLH123",
};
export default class App extends Component {
  constructor(props) {
    super(props);
  }
  state = Object.assign({}, defaultState);
  componentDidMount() {
    console.log("## pid", process.pid);
    window.ApiTypeEngine = ApiTypeEngine;
    window.rtcEngine = new AgoraRtcEngine();
  }

  onPressInitialize = () => {
    if (rtcEngine) {
      return;
    }
    rtcEngine = new AgoraRtcEngine();
    window.rtcEngine = rtcEngine;

    let res = rtcEngine.initialize({
      appId: APP_ID,
      areaCode: 1,
      logConfig: {
        filePath: "/Users/jerry/Downloads/111",
        fileSize: 1024,
        level: 1,
      },
    });

    console.log("initialize res", res);

    res = rtcEngine.setChannelProfile(
      CHANNEL_PROFILE_TYPE.CHANNEL_PROFILE_LIVE_BROADCASTING
    );
    console.log("setChannelProfile", res);

    res = rtcEngine.setClientRole(CLIENT_ROLE_TYPE.CLIENT_ROLE_BROADCASTER);
    console.log("setClientRole", res);

    res = rtcEngine.setAudioProfile(
      AUDIO_PROFILE_TYPE.AUDIO_PROFILE_DEFAULT,
      AUDIO_SCENARIO_TYPE.AUDIO_SCENARIO_CHATROOM_ENTERTAINMENT
    );
    console.log("setAudioProfile", res);

    res = rtcEngine.enableVideo();
    console.log("enableVideo", res);

    res = rtcEngine.enableWebSdkInteroperability(true);
    console.log("enableWebSdkInteroperability", res);

    res = rtcEngine.setVideoEncoderConfiguration({
      //      label: "160x120	15fps	65kbps",
      width: 160,
      height: 120,
      frameRate: 15,
      bitrate: 65,
    });
    console.log("setVideoEncoderConfiguration", res);

    res = rtcEngine.enableDualStreamMode(true);
    console.log("enableDualStreamMode", res);

    const ver = rtcEngine.getVersion();
    console.log("getVersion", ver);
    // rtcEngine.startPreview();
    this.subscribeEvent();
  };
  subscribeEvent = () => {
    rtcEngine.on(EngineEvents.JOINED_CHANNEL, (connection, elapsed) => {
      console.info("JOINED_CHANNEL", connection, elapsed);
    });
    rtcEngine.on(EngineEvents.LEAVE_CHANNEL, (stats) => {
      console.info("LEAVE_CHANNEL", stats);
    });

    rtcEngine.on(EngineEvents.USER_OFFLINE, (connection, remoteUid, reason) => {
      console.info("USER_OFFLINE", connection, remoteUid, reason);

      const { users } = this.state;
      this.setState({ users: users.filter((uid) => uid !== remoteUid) });
    });

    rtcEngine.on(EngineEvents.USER_JOINED, (connection, uid, elapsed) => {
      console.info("USER_JOINED", connection, uid, elapsed);
      const { users } = this.state;
      this.setState({ users: [...users, uid] });
    });
  };
  onPressJoin = () => {
    const { channelId } = this.state;
    let res = rtcEngine.joinChannel(null, channelId, "", window.uid || 10086, {
      autoSubscribeAudio: true,
      autoSubscribeVideo: true,
      publishAudioTrack: true,
      publishCameraTrack: true,
      publishScreenTrack: false,
      clientRoleType: CLIENT_ROLE_TYPE.CLIENT_ROLE_BROADCASTER,
      channelProfile: CHANNEL_PROFILE_TYPE.CHANNEL_PROFILE_LIVE_BROADCASTING,
    });
    console.log("joinChannel", res);
  };
  onPressRelease = () => {
    if (!rtcEngine) {
      return;
    }
    rtcEngine.release();
    rtcEngine = null;
    this.setState(defaultState);
  };

  onPressSetViewForFirstCamera = () => {
    const { isSetFirstCameraView } = this.state;
    rtcEngine.setRenderMode(2);
    let dom = document.getElementById("firstCamera");
    rtcEngine.setView({
      videoSourceType: VideoSourceType.kVideoSourceCamera,

      view: isSetFirstCameraView ? null : dom,
      rendererOptions: { mirror: true, contentMode: 1 },
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
    rtcEngine.setRenderMode(2);
    let dom = document.getElementById("secondCamera");
    rtcEngine.setView({
      videoSourceType: VideoSourceType.kVideoSourceCameraSecondary,

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
    rtcEngine.setRenderMode(2);
    let dom = document.getElementById("scrrenShare1");
    rtcEngine.setView({
      videoSourceType: VideoSourceType.kVideoSourceScreenPrimary,

      view: isSetFirstScreenShareView ? null : dom,
      rendererOptions: { mirror: true, contentMode: 1 },
    });
    this.setState({ isSetFirstScreenShareView: !isSetFirstScreenShareView });
  };
  onPressToggleFirstScreenShare = () => {
    const { isStartFirstScreenShare } = this.state;
    const displayList = rtcEngine.getScreenDisplaysInfo();
    const windowList = rtcEngine.getScreenWindowsInfo();
    const {
      displayId: { id },
    } = displayList[0];
    const { windowId } = windowList[0];
    console.log("getScreenDisplaysInfo", displayList);
    console.log("getScreenWindowsInfo", windowList);

    if (!isStartFirstScreenShare) {
      const res = rtcEngine.startPrimaryScreenCapture({
        isCaptureWindow: false,
        displayId: id,
        screenRect: { width: 0, height: 0, x: 0, y: 0 },
        windowId: windowId,
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
      // const res = rtcEngine.startScreenCaptureByScreen(
      //   list[0].displayId,
      //   { x: 0, y: 0, width: 0, height: 0 },
      //   {
      //     width: 1920,
      //     height: 1080,
      //     bitrate: 1000,
      //     frameRate: 15,
      //     captureMouseCursor: false,
      //     windowFocus: false,
      //     excludeWindowList: [],
      //     excludeWindowCount: [],
      //   }
      // );
      console.log("startSecondaryScreenCapture", res);
    } else {
      rtcEngine.stopPrimaryScreenCapture();
    }
    this.setState({ isStartFirstScreenShare: !isStartFirstScreenShare });
  };
  onPressSetViewForSecondScreenShare = () => {
    const { isSetSecondScreenShareView } = this.state;
    rtcEngine.setRenderMode(2);
    let dom = document.getElementById("scrrenShare2");
    rtcEngine.setView({
      videoSourceType: VideoSourceType.kVideoSourceScreenSecondary,

      view: isSetSecondScreenShareView ? null : dom,
      rendererOptions: { mirror: true, contentMode: 1 },
    });
    this.setState({ isSetSecondScreenShareView: !isSetSecondScreenShareView });
  };
  onPressToggleSecondScreenShare = () => {
    const { isStartSecondScreenShare } = this.state;
    const displayList = rtcEngine.getScreenDisplaysInfo();
    const windowList = rtcEngine.getScreenWindowsInfo();
    const {
      displayId: { id },
    } = displayList[1];
    const { windowId } = windowList[2];
    console.log("getScreenDisplaysInfo", displayList);
    console.log("getScreenWindowsInfo", windowList);

    if (!isStartSecondScreenShare) {
      const res = rtcEngine.startSecondaryScreenCapture({
        isCaptureWindow: false,
        displayId: id,
        screenRect: { width: 0, height: 0, x: 0, y: 0 },
        windowId: windowId,
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
      console.log("startSecondaryScreenCapture", res);
    } else {
      rtcEngine.stopSecondaryScreenCapture();
    }
    this.setState({ isStartSecondScreenShare: !isStartSecondScreenShare });
  };
  renderViews = () => {
    const { users, channelId } = this.state;
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
        <div className="renderViewListForRow">
          {users.map((uid) => (
            <RemoteWindow uid={uid} channelId={channelId} />
          ))}
        </div>
      </div>
    );
  };

  render() {
    const { isOpenFirstCamera, isOpenSecondCamera, isStartFirstScreenShare } =
      this.state;
    return (
      <div className="content">
        <button onClick={this.onPressInitialize}>Initialize</button>
        <button onClick={this.onPressRelease}>Release</button>
        <button onClick={this.onPressJoin}>JoinChannel</button>
        <button
          onClick={() => {
            // console.log(rtcEngine.getVideoDevices());
            // const res = rtcEngine.startPreview();
            // console.log("startPreview", res);

            console.log(this.state.users);
          }}
        >
          Test
        </button>
        <div>
          FirstCamera:
          <button onClick={this.onPressSetViewForFirstCamera}>
            setViewForFirstCamera
          </button>
          <button onClick={this.onPressToggleFirstCamera}>
            {!isOpenFirstCamera ? "Open FirstCamera" : "Close FirstCamera"}
          </button>
        </div>
        <div>
          SecondCamera:
          <button onClick={this.onPressSetViewForSecondCamera}>
            setViewForSecondCamera
          </button>
          <button onClick={this.onPressToggleSecondCamera}>
            {!isOpenSecondCamera ? "Open SecondCamera" : "Close SecondCamera"}
          </button>
        </div>
        <div>
          FirstScreenShare:
          <button onClick={this.onPressSetViewForFirstScreenShare}>
            setViewForFirstScreenShare
          </button>
          <button onClick={this.onPressToggleFirstScreenShare}>
            StartFirstScreenShare
          </button>
        </div>
        <div>
          SecondScreenShare:
          <button onClick={this.onPressSetViewForSecondScreenShare}>
            setViewForSecondScreenShare
          </button>
          <button onClick={this.onPressToggleSecondScreenShare}>
            StartSecondScreenShare
          </button>
        </div>
        {this.renderViews()}
      </div>
    );
  }
}
