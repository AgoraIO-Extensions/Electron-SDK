import React, { Component } from "react";
import AgoraRtcEngine from "../../../";
import { List } from "immutable";
import path from "path";
import os from "os";

import {
  voiceChangerList,
  voiceReverbPreset,
  videoProfileList,
  audioProfileList,
  audioScenarioList,
  APP_ID,
  SHARE_ID,
  RTMP_URL,
  voiceReverbList,
  FU_AUTH,
} from "../utils/settings";
import { readImage } from "../utils/base64";
import WindowPicker from "./components/WindowPicker/index.js";
import DisplayPicker from "./components/DisplayPicker/index.js";
import { VoiceChangerPreset } from "../../../js/Api/types";

const isMac = process.platform === "darwin";

export default class App extends Component {
  constructor(props) {
    super(props);
    const process = window.process || process;

    if (process) {
      console.log("## pid", process.pid);
    }
    if (!APP_ID) {
      alert("APP_ID cannot be empty!");
    } else {
      let rtcEngine = this.getRtcEngine();
      let channel1;
      let channel2;
      this.state = {
        local: "",
        localVideoSource: "",
        localSharing: false,
        users: new List(),
        channel: "",
        role: 1,
        voiceReverbPreset: 0,
        voiceChangerPreset: 0,
        camera: 0,
        mic: 0,
        speaker: 0,
        videoProfile: 43,
        showWindowPicker: false,
        showDisplayPicker: false,
        recordingTestOn: false,
        playbackTestOn: false,
        lastmileTestOn: false,
        rtmpTestOn: false,
        windowList: [],
        displayList: [],
        encoderWidth: 0,
        encoderHeight: 0,
        hookplayerpath: "",
        audioHookEnabled: false,
      };
    }
    this.enableAudioMixing = false;
  }
  componentDidMount() {}

  getRtcEngine() {
    if (!this.rtcEngine) {
      this.rtcEngine = new AgoraRtcEngine();
      console.log("new AgoraRtcEngine111");
      let ret = this.rtcEngine.initialize(APP_ID);

      this.rtcEngine.enableVideo();

      this.rtcEngine.on("firstLocalVideoFrame", (width, height, elapsed) => {
        console.log(`firstLocalVideoFrame width: ${width}, ${height}`);
      });

      this.rtcEngine.on(
        "firstRemoteVideoFrame",
        (uid, width, height, elapsed) => {
          console.log(`firstRemoteVideoFrame ${uid}, ${width} ${height}`);
        }
      );

      //   let channel1 = this.rtcEngine.createChannel("channel1")
      //   channel1.on('joinChannelSuccess', (channelId, uid, elapsed)=>{
      //     console.log(`channel  joinChannelSuccess ${channelId}`)
      //     if (channelId === "channel1") {
      //       setTimeout(() => {
      //         this.rtcEngine.setRenderMode(2)
      //         let dom = document.getElementById("localVideo")
      //         console.log(`joinedChannel dom is ${dom}`)
      //         this.rtcEngine.setView({view: dom, rendererOptions: {mirror: true, contentMode: 1}})
      //         // this.rtcEngine.setupViewContentMode('local', '', 1, true)
      //       }, 5000)
      //     }
      //   })

      //   channel1.on('userJoined', (channelId, uid, elapsed) => {
      //     let dom = document.getElementById("remoteVideo")
      //     console.log(`channel userJoined ${channelId}, ${uid}`)
      //     this.rtcEngine.setView({
      //       user: uid,
      //       view: dom,
      //       channelId: "channel1",
      //       rendererOptions: {
      //         append: true,
      //         contentMode: 1,
      //         mirror: true
      //       }
      //     })
      //   })

      //   channel1.setClientRole(1)

      //   let ret1 = channel1.joinChannel("", "", 0, {
      //     autoSubscribeAudio: true,
      //     autoSubscribeVideo: true
      //   })

      //   let channel2 = this.rtcEngine.createChannel("channel2")
      //   channel2.on('joinChannelSuccess', (channelId, uid, elapsed)=>{
      //     console.log(`channel2  joinChannelSuccess ${channelId}`)
      //   })

      //   channel2.on('userJoined', (channelId, uid, elapsed)=>{
      //     console.log(`channel2 userJoined ${channelId} ${uid} ${elapsed}`)

      //   })

      //   channel2.setClientRole(1)

      //   channel2.joinChannel('', "", 0, {
      //     autoSubscribeAudio: true,
      //     autoSubscribeVideo: true
      //   })

      //   let ret2 = channel1.publish()
      //   console.log(`channel join ${ret1}, ${ret2}`)
      //   channel1.publish()
      // }

      setTimeout(() => {
        this.rtcEngine.setRenderMode(2);
        let dom = document.getElementById("localVideo");
        this.rtcEngine.setView({
          user: "local",
          view: dom,
          rendererOptions: { mirror: true, contentMode: 1 },
        });
        // this.rtcEngine.setupViewContentMode('local', '', 1, true)
      }, 5000);

      // setTimeout(() => {
      //   this.rtcEngine.videoSourceStartPreview()
      //   this.rtcEngine.videoSourceSetChannelProfile(0)
      // }, 10000)

      this.rtcEngine.on("joinedChannel", (channel, uid, elapsed) => {
        console.log(`joinChannelSuccess channel: ${channel}, uid: ${uid}`);
      });

      this.rtcEngine.on("userJoined", (uid, elapsed) => {
        let dom = document.getElementById("remoteVideo");
        console.log(`userJoined dom is ${dom}`);
        this.rtcEngine.setView({
          user: uid,
          view: dom,
          channelId: "456",
          rendererOptions: { mirror: true, contentMode: 1 },
        });
      });

      this.rtcEngine.on("apiError", (msg) => {
        console.log(`apiError : ${msg}`);
      });

      this.rtcEngine.on("warning", (msg) => {
        console.log(`warning  ${msg}`);
      });

      this.rtcEngine.on("apiCallExecuted", (api, err) =>
        console.log(`apiCallExecuted ${api} ${err}`)
      );

      this.rtcEngine.on("videoSourceApiCallExecuted", (api, err) =>
        console.log(`videoSourceApiCallExecuted ${api} ${err}`)
      );
      window.rtcEngine = this.rtcEngine;
      console.log(`initialize ${ret}`);

      let ret2 = this.rtcEngine.videoSourceInitialize(APP_ID);
      this.rtcEngine.videoSourceEnableVideo();
      this.rtcEngine.videoSourceEnableAudio();

      this.rtcEngine.on(
        "videoSourceJoinChannelSuccess",
        (channel, uid, elapsed) => {
          console.log(
            `videoSourceJoinChannelSuccess  channel: ${channel}, uid: ${uid}, elapsed:${elapsed}`
          );
          this.rtcEngine.videoSourceStartScreenCaptureByScreen(
            { id: 69734208 },
            { x: 0, y: 0, width: 1920, height: 1080 },
            {
              dimensions: {
                width: 1920,
                height: 1080,
              },
            }
          );

          let dom2 = document.getElementById("videoSource");
          this.rtcEngine.setupLocalVideoSource(dom2);
        }
      );
      this.rtcEngine.on("firstLocalVideoFrame", (width, height, elapsed) => {
        console.log(`firstLocalVideoFrame width: ${width}, ${height}`);
      });

      this.rtcEngine.on(
        "videoSourceFirstRemoteVideoFrame",
        (uid, width, height, elapsed) => {
          console.log(
            `videoSourceFirstRemoteVideoFrame  ${uid}, ${width}, ${height}`
          );
        }
      );

      this.rtcEngine.on(
        "videoSourceFirstLocalVideoFrame",
        (width, height, elapsed) => {
          console.log(`videoSourceFirstLocalVideoFrame ${width}, ${height} `);
        }
      );

      let pluginPath = path.resolve(__static, "libagoraElectronPlugin.dylib");
      let videoSourceret1 = this.rtcEngine.videoSourceRegisterPlugin({
        pluginId: "121",
        pluginPath:
          " /Users/zt/Documents/work/cross-platform-sdk/Electron/SDK/Electron-SDK-iris/example/static/libagoraElectronPlugin.dylib",
        order: 1,
      });

      // this.rtcEngine.videoSourceEnableAudio();
      // this.rtcEngine.videoSourceEnableVideo();
      console.log(`videoSourceRegisterPlugin ${videoSourceret1}`);
      let ret3 = this.rtcEngine.enableAudio();
      console.log(`enableAduio  ${ret3}`);

      this.rtcEngine.enableVideo();

      // console.log(`pluginPath:  ${pluginPath}`);
      // let ret222 = this.rtcEngine.registerPlugin({
      //   pluginId: "121",
      //   pluginPath,
      //   order: 2,
      // });
      // this.rtcEngine.startPreview();
      // console.log(`registerPlugin ${ret222}`)
      let ret4 = this.rtcEngine.joinChannel("", "456", "", 0);
      console.log(`joinChannel ${ret4}`);

      this.rtcEngine.videoSourceJoinChannel("", "456", "", 0);
    }

    return this.rtcEngine;
  }

  render() {
    return (
      <div className="window-item">
        <div className="local-video-item" id={"localVideo"}></div>
        <div className="local-video-item" id={"remoteVideo"}></div>
        <div className="local-video-item" id={"videoSource"}></div>
      </div>
    );
  }
}
