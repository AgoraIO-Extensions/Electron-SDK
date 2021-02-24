import React, { Component } from 'react';
import AgoraRtcEngine from '../../../';
import { List } from 'immutable';
import path from 'path';
import os from 'os'

import {voiceChangerList, voiceReverbPreset, videoProfileList, audioProfileList, audioScenarioList, APP_ID, SHARE_ID, RTMP_URL, voiceReverbList, FU_AUTH } from '../utils/settings'
import {readImage} from '../utils/base64'
import WindowPicker from './components/WindowPicker/index.js'
import DisplayPicker from './components/DisplayPicker/index.js'

const isMac = process.platform === 'darwin'

export default class App extends Component {
  constructor(props) {
    super(props)
    if (!APP_ID) {
      alert('APP_ID cannot be empty!')
    } else {
      let rtcEngine = this.getRtcEngine()
      let channel1
      let channel2
      let mediaPlayer;
      let mediaPlayer2;
      this.state = {
        local: '',
        localVideoSource: '',
        mediaPlayerView: '',
        localSharing: false,
        users: new List(),
        channel: '',
        role: 1,
        voiceReverbPreset: 0,
        voiceChangerPreset: 0,
        videoDevices: rtcEngine.getVideoDevices(),
        audioDevices: rtcEngine.getAudioRecordingDevices(),
        audioPlaybackDevices: rtcEngine.getAudioPlaybackDevices(),
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
        mediaPlayerUrl: "https://big-class-test.oss-cn-hangzhou.aliyuncs.com/61102.1592987815092.mp4",
        
      }
    }
    this.enableAudioMixing = false;
  }

  getRtcEngine() {
    if(!this.rtcEngine) {
      this.rtcEngine = new AgoraRtcEngine()
      this.rtcEngine.initialize(APP_ID)
      this.rtcEngine.initializePluginManager();
      const libPath = isMac ? 
            path.resolve(__static, 'bytedance/libByteDancePlugin.dylib')
          : path.resolve(__static, 'bytedance/ByteDancePlugin.dll')
      if(this.rtcEngine.registerPlugin({
        id: 'bytedance',
        path: libPath
      }) < 0){
        console.error(`load plugin failed`)
      }
      this.subscribeEvents(this.rtcEngine)
      window.rtcEngine = this.rtcEngine;
    }

    return this.rtcEngine
  }

  componentDidMount() {
  }

  subscribeEvents = (rtcEngine) => {
    rtcEngine.on('joinedchannel', (channel, uid, elapsed) => {
      this.setState({
        local: uid
      });
    });
    rtcEngine.on('userjoined', (uid, elapsed) => {
      if (uid === SHARE_ID && this.state.localSharing) {
        return
      }
      this.setState({
        users: this.state.users.push({uid})
      })
    })
    rtcEngine.on('removestream', (uid, reason) => {
      this.setState({
        users: this.state.users.filter(user => user.uid !== uid)
      })
    })
    rtcEngine.on('leavechannel', () => {
      this.setState({
        local: ''
      })
    })
    rtcEngine.on('audiodevicestatechanged', () => {
      this.setState({
        audioDevices: rtcEngine.getAudioRecordingDevices(),
        audioPlaybackDevices: rtcEngine.getAudioPlaybackDevices()
      })
    })
    rtcEngine.on('videodevicestatechanged', () => {
      this.setState({
        videoDevices: rtcEngine.getVideoDevices()
      })
    })
    rtcEngine.on('streamPublished', (url, error) => {
      console.log(`url: ${url}, err: ${error}`)
    })
    rtcEngine.on('streamUnpublished', (url) => {
      console.log(`url: ${url}`)
    })
    rtcEngine.on('lastmileProbeResult', result => {
      console.log(`lastmileproberesult: ${JSON.stringify(result)}`)
    })
    rtcEngine.on('lastMileQuality', quality => {
      console.log(`lastmilequality: ${JSON.stringify(quality)}`)
    })
    rtcEngine.on('audioVolumeIndication', (
      speakers,
      speakerNumber,
      totalVolume
    ) => {
      console.log(`${JSON.stringify(speakers)} speakerNumber${speakerNumber} totalVolume${totalVolume}`)
    })
    rtcEngine.on('error', err => {
      console.error(err)
    })
    rtcEngine.on('executefailed', funcName => {
      console.error(funcName, 'failed to execute')
    })
    rtcEngine.on('localUserRegistered', (uid, userAccount) => {
      console.log(`local user register: ${uid} ${userAccount}`)
    })
    rtcEngine.on('audioPublishStateChange', (channel, oldstate, newstate, elapsed) => {
      console.log(`rtcEngine audioPublishStateChange   channel: ${channel},  oldstate:${oldstate},  newstate:${newstate},  elapsed:${elapsed}`)
    })
    rtcEngine.on('videoPublishStateChange', (channel, oldstate, newstate, elapsed) => {
      console.log(`rtcEngine videoPublishStateChange   channel: ${channel},  oldstate:${oldstate},  newstate:${newstate}, elapsed:${elapsed}`)
    })
    rtcEngine.on('audioSubscribeStateChange', (channel, uid, oldstate, newstate, elapsed) => {
      console.log(`rtcEngine audioSubscribeStateChange   channel: ${channel}, uid:${uid}, oldstate:${oldstate},  newstate:${newstate}, elapsed:${elapsed}`)
    })
    rtcEngine.on('videoSubscribeStateChange', (channel, uid, oldstate, newstate, elapsed) => {
      console.log(`rtcEngine videoSubscribeStateChange   channel: ${channel}, uid:${uid}, oldstate:${oldstate}, newstate:${newstate}, elapsed:${elapsed}`)
    })
    rtcEngine.on("receiveMetadata", (metadata) => {
      let bufferdata = JSON.parse(metadata.buffer)
      console.log("receiveMetadata : " + bufferdata.width)
    })
    rtcEngine.on("sendMetadataSuccess", (metadata) => {
      console.log(`sendMetadataSuccess : ${JSON.stringify(metadata)}`)
    })

    setInterval(()=>{
      let ptr = {
        width: 100,
        height: 210,
        top: 32323
      }
      let data = JSON.stringify(ptr);
      let metadata = {
        uid: 123,
        size: data.length,
        buffer: data,
        timeStampMs: 122323
      }
      let ret = this.rtcEngine.sendMetadata(metadata);
      console.log(`sendMetadata  data: ${data}  ret: ${ret}`)
      }, 1000);
  }

  subscribeChannelEvents = (rtcChannel, publish) => {
    let channelId = rtcChannel.channelId()
    rtcChannel.on('joinChannelSuccess', (uid, elapsed) => {
      console.log(`join channel success: ${uid} ${elapsed}`)
      if(publish) {
        this.setState({
          local: uid
        });
      }
    })

    rtcChannel.on('userJoined', (uid, elapsed) => {
      if (uid === SHARE_ID && this.state.localSharing) {
        return
      }
      this.setState({
        users: this.state.users.push({channelId, uid})
      })
    })

    rtcChannel.on('userOffline', (uid, reason) => {
      this.setState({
        users: this.state.users.delete(this.state.users.indexOf({channelId, uid}))
      })
    })

    rtcChannel.on('rtcStats', (stats) => {
      console.log(stats)
    })
    rtcChannel.on('audioPublishStateChange', (oldstate, newstate, elapsed) => {
      console.log(`audioPublishStateChange  oldstate:${oldstate},  newstate:${newstate},  elapsed:${elapsed}`)
    })
    rtcChannel.on('videoPublishStateChange', (oldstate, newstate, elapsed) => {
      console.log(`videoPublishStateChange  oldstate:${oldstate},  newstate:${newstate}, elapsed:${elapsed}`)
    })
    rtcChannel.on('audioSubscribeStateChange', (uid, oldstate, newstate, elapsed) => {
      console.log(`audioSubscribeStateChange  uid:${uid}, oldstate:${oldstate},  newstate:${newstate}, elapsed:${elapsed}`)
    })
    rtcChannel.on('videoSubscribeStateChange', (uid, oldstate, newstate, elapsed) => {
      console.log(`videoSubscribeStateChange uid:${uid}, oldstate:${oldstate}, newstate:${newstate}, elapsed:${elapsed}`)
    })
    rtcChannel.on("receiveMetadata", (metadata) => {
      console.log(`channel receiveMetadata  ${metadata.uid}  size: ${metadata.size}  buffer: ${metadata.buffer}  timeStampMs: ${metadata.timeStampMs}`)
    })

    rtcChannel.on("sendMetadataSuccess", (metadata) => {
      console.log(`channel sendMetadataSuccess  ${metadata.uid}  size: ${metadata.size}  buffer: ${metadata.buffer}  timeStampMs: ${metadata.timeStampMs}`)
    })
  }

  handleJoin = () => {
    let encoderWidth = parseInt(this.state.encoderWidth)
    let encoderHeight = parseInt(this.state.encoderHeight)
    let rtcEngine = this.getRtcEngine()
    rtcEngine.setParameters("{\"rtc.user_account_server_list\":[\"58.211.82.170\"]}")
    let result = rtcEngine.registerLocalUserAccount(APP_ID, "TEST")
    console.log(result)
    rtcEngine.setChannelProfile(1)
    rtcEngine.setClientRole(this.state.role)
    rtcEngine.registerMediaMetadataObserver();
    rtcEngine.setAudioProfile(0, 1)
    // rtcEngine.enableVideo()
    let logpath = path.resolve(os.homedir(), "./agoramain.sdk")
    rtcEngine.setLogFile(logpath)
    rtcEngine.enableWebSdkInteroperability(true)
    if(encoderWidth === 0 && encoderHeight === 0) {
      //use video profile
      rtcEngine.setVideoProfile(this.state.videoProfile, false)
    } else {
      rtcEngine.setVideoEncoderConfiguration({width: encoderWidth, height: encoderHeight})
    }
    rtcEngine.setLocalVoiceChanger(this.state.voiceChangerPreset)
    rtcEngine.setLocalVoiceReverbPreset(this.state.voiceReverbPreset)
    // console.log('loop', rtcEngine.enableLoopbackRecording(true, null))
    rtcEngine.enableDualStreamMode(true)
    rtcEngine.enableAudioVolumeIndication(1000, 3, false)

    //enable beauty options
    rtcEngine.setBeautyEffectOptions(true, {
      lighteningContrastLevel: 2,
      lighteningLevel: 1,
      smoothnessLevel: 1,
      rednessLevel: 0
    })
    rtcEngine.setAudioEffectPreset(0x02010100);
    rtcEngine.setVoiceBeautifierPreset(0x01010100);
    rtcEngine.setAudioEffectParameters(0x02010100, 1, 1);

    // joinning two channels together
    // let channel = rtcEngine.createChannel(this.state.channel)
    // this.subscribeChannelEvents(channel, true)
    // channel.joinChannel(null, '', Number(`${new Date().getTime()}`.slice(7)));
    // channel.publish();
    //rtcEngine.joinChannel("", "123", "", 0);

    //joinning two channels together
    this.channel1 = rtcEngine.createChannel(this.state.channel)
    this.channel1.registerMediaMetadataObserver();
    setInterval(()=>{
      let ptr = {
        width: 100,
        height: 210,
        top: 32323
      }
      let data = JSON.stringify(ptr);
      let metadata = {
        uid: 123,
        size: data.length,
        buffer: data,
        timeStampMs: 122323
      }
      let ret = this.channel1.sendMetadata(metadata);
      console.log(`channel: ${this.channel1.channelId()}  sendMetadata  data: ${data}  ret: ${ret}`)
   }, 1000);
    this.channel1.setClientRole(1);
    this.subscribeChannelEvents(this.channel1, true)
    this.channel1.joinChannel(null, '', Number(`${new Date().getTime()}`.slice(7)));
    this.channel1.publish();

    this.channel1.setClientRole(1);
    this.channel2 = rtcEngine.createChannel(`${this.state.channel}-2`)
    this.channel2.registerMediaMetadataObserver()
    this.subscribeChannelEvents(this.channel2, false)
    this.channel2.joinChannel(null, '', Number(`${new Date().getTime()}`.slice(7)));

  }
  
  
  openMediaPlayer = e => {
    if (this.mediaPlayer) {
      this.setState({
        mediaPlayerView: ""
      })
      this.mediaPlayer.stop();
    }
    let rtcEngine = this.getRtcEngine()
    this.mediaPlayer = rtcEngine.createMediaPlayer();
      let ret1 = this.mediaPlayer.initialize();
      console.log(`initialize  ${ret1}`)
      this.mediaPlayer.on('onPlayerStateChanged', (state, ec)=>{
        console.log(`onPlayerStateChanged  state: ${state}  ec:${ec}`);
        if (state == 2) {
          this.setState({
            mediaPlayerView: "mediaPlayerView"
        })
        let a19 = this.mediaPlayer.setLogFile("log.txt")
        console.log(`mediaPlayer.setLogFile ${a19}`);
        
        let mediaInfo = this.mediaPlayer.getStreamInfo(0);
        if (mediaInfo.streamType == 1) {
          let rotation = mediaInfo.videoRotation;
          this.mediaPlayer.setVideoRotation(rotation)
        } else {
          let mediaInfo1 = this.mediaPlayer.getStreamInfo(1);
          if (mediaInfo1.streamType == 1) {
            let rotation = mediaInfo1.videoRotation;
            this.mediaPlayer.setVideoRotation(rotation)
          }
        }

        let a = this.mediaPlayer.play();
        console.log(`mediaPlayer.play ${a}`);

          // let a21 = this.mediaPlayer.setPlayerOption("", 1)
          // console.log(`mediaPlayer.setPlayerOption ${a21}`);

          // let a1 = this.mediaPlayer.pause()
          // console.log(`mediaPlayer.pause ${a1}`);

          // let a3 = this.mediaPlayer.seek(5)
          // console.log(`mediaPlayer.seek ${a3}`);
          // let a4 = this.mediaPlayer.mute(true)
          // console.log(`mediaPlayer.mute ${a4}`);
          // let a5 = this.mediaPlayer.getMute()
          // console.log(`mediaPlayer.getMute ${a5}`);
          let a6 = this.mediaPlayer.adjustPlayoutVolume(100)
          console.log(`mediaPlayer.adjustPlayoutVolume ${a6}`);
          // let a7 = this.mediaPlayer.getPlayoutVolume()
          // console.log(`mediaPlayer.getPlayoutVolume ${a7}`);
          // let a8 = this.mediaPlayer.getPlayPosition()
          // console.log(`mediaPlayer.getPlayPosition ${a8}`);
          let a9 = this.mediaPlayer.getDuration()
          console.log(`mediaPlayer.getDuration ${a9}`);
          let a10 = this.mediaPlayer.getState()
          console.log(`mediaPlayer.getState ${a10}`);
          // let a11 = this.mediaPlayer.getStreamCount()
          // console.log(`mediaPlayer.getStreamCount ${a11}`);
          // let a12 = this.mediaPlayer.connect("", "123", "")
          // console.log(`mediaPlayer.connect ${a12}`);
          // let a13 = this.mediaPlayer.disconnect()
          // console.log(`mediaPlayer.disconnect ${a13}`);
          // let a14 = this.mediaPlayer.publishVideo()
          // console.log(`mediaPlayer.publishVideo ${a14}`);
          // let a15 = this.mediaPlayer.unpublishVideo()
          // console.log(`mediaPlayer.unpublishVideo ${a15}`);
          // let a16 = this.mediaPlayer.publishAudio()
          // console.log(`mediaPlayer.publishAudio ${a16}`);
          // let a17 = this.mediaPlayer.unpublishAudio()
          // console.log(`mediaPlayer.unpublishAudio ${a17}`);
          let a18 = this.mediaPlayer.adjustPublishSignalVolume(90)
          // console.log(`mediaPlayer.adjustPublishSignalVolume ${a18}`);
          // let a20 = this.mediaPlayer.setLogFilter(1)
          // console.log(`mediaPlayer.setLogFilter ${a20}`);
          // let a22 = this.mediaPlayer.changePlaybackSpeed(200)
          // console.log(`mediaPlayer.changePlaybackSpeed ${a22}`);
          // let a23 = this.mediaPlayer.selectAudioTrack(1)
          // console.log(`mediaPlayer.selectAudioTrack ${a23}`);
          // let a2 = this.mediaPlayer.stop()
          // console.log(`mediaPlayer.stop ${a2}`);
          // this.mediaPlayer.publishVideoToRtc();

        }
      })

      this.mediaPlayer.on('onPlayEvent', (event)=>{
        console.log(`onPlayEvent  event: ${event}`);
      })

      this.mediaPlayer.on('onPositionChanged', (position)=>{
        console.log(`onPositionChanged  position: ${position}`);
          // this.setState({
          //   mediaPlayerView: "mediaPlayerView"
          // })
      })

      this.mediaPlayer.open(this.state.mediaPlayerUrl, 0);
      // this.mediaPlayer.open("/Users/dyf/Documents/project/Electron/61102.1592987815092.mp4", 0);

  }

  handlePublishVideo = e => {
    this.mediaPlayer.publishVideoToRtc();
  }

  handleUnpublishVideo = e => {
    this.mediaPlayer.unpublishVideoFromRtc();
  }

  handlePublishAudio = e => {
    this.mediaPlayer.mute(true);
    this.mediaPlayer.publishAudioToRtc(true, true);
  }

  handleUnpublishAudio = e => {
    this.mediaPlayer.mute(false);
    this.mediaPlayer.unpublishAudioFromRtc();
  }

  attachMediaPlayerToRtc = e => {
    let ret = this.mediaPlayer.attachPlayerToRtc();
  }

  detachMediaPlayerToRtc = e => {
    this.mediaPlayer.detachPlayerFromRtc();
  }

  handleCameraChange = e => {
    this.setState({camera: e.currentTarget.value});
    this.getRtcEngine().setVideoDevice(this.state.videoDevices[e.currentTarget.value].deviceid);
  }

  handleMicChange = e => {
    this.setState({mic: e.currentTarget.value});
    this.getRtcEngine().setAudioRecordingDevice(this.state.audioDevices[e.currentTarget.value].deviceid);
  }

  handleSpeakerChange = e => {
    this.setState({speaker: e.currentTarget.value});
    this.getRtcEngine().setAudioPlaybackDevice(this.state.audioPlaybackDevices[e.currentTarget.value].deviceid);
  }

  handleVideoProfile = e => {
    this.setState({
      videoProfile: Number(e.currentTarget.value)
    })
  }

  handleVoiceChanger = e => {
    this.setState({
      voiceChangerPreset: Number(e.currentTarget.value)
    })
  }

  handleVoiceReverbPreset = e => {
    this.setState({
      voiceReverbPreset: Number(e.currentTarget.value)
    })
  }

    /**
   * prepare screen share: initialize and join
   * @param {string} token 
   * @param {string} info 
   * @param {number} timeout 
   */
  prepareScreenShare(token = null, info = '', timeout = 30000) {
    return new Promise((resolve, reject) => {
      let timer = setTimeout(() => {
        reject(new Error('Timeout'))
      }, timeout)
      let rtcEngine = this.getRtcEngine()
      rtcEngine.once('videosourcejoinedsuccess', uid => {
        clearTimeout(timer)
        this.sharingPrepared = true
        resolve(uid)
      });
      try {
        rtcEngine.videoSourceInitialize(APP_ID);
        let logpath = path.resolve(os.homedir(), "./agorascreenshare.log")
        rtcEngine.videoSourceSetLogFile(logpath)
        rtcEngine.videoSourceSetChannelProfile(1);
        rtcEngine.videoSourceEnableWebSdkInteroperability(true)
        // rtcEngine.videoSourceSetVideoProfile(50, false);
        // to adjust render dimension to optimize performance
        // rtcEngine.setVideoRenderDimension(3, SHARE_ID, 1200, 680);
        rtcEngine.videoSourceJoin(token, this.state.channel, info, SHARE_ID);
      } catch(err) {
        clearTimeout(timer)
        reject(err)
      }
    })
  }

    /**
   * start screen share
   * @param {*} windowId windows id to capture
   * @param {*} captureFreq fps of video source screencapture, 1 - 15
   * @param {*} rect null/if specified, {x: 0, y: 0, width: 0, height: 0}
   * @param {*} bitrate bitrate of video source screencapture
   */
  startScreenShare(windowId=0, captureFreq=15, 
    rect={
      top: 0, left: 0, right: 0, bottom: 0
    }, bitrate=0
  ) {
    if(!this.sharingPrepared) {
      console.error('Sharing not prepared yet.')
      return false
    };
    return new Promise((resolve, reject) => {
      let rtcEngine = this.getRtcEngine()
      // rtcEngine.startScreenCapture2(windowId, captureFreq, rect, bitrate);
      // there's a known limitation that, videosourcesetvideoprofile has to be called at least once
      // note although it's called, it's not taking any effect, to control the screenshare dimension, use captureParam instead
      // rtcEngine.videoSourceSetVideoProfile(43, false);
      // rtcEngine.startScreenCaptureByWindow(windowId, {x: 0, y: 0, width: 0, height: 0}, {width: 0, height: 0, bitrate: 500, frameRate: 15, captureMouseCursor: false, windowFocus: false})
      rtcEngine.videoSourceStartScreenCaptureByWindow(windowId, {x: 0, y: 0, width: 0, height: 0}, {width: 0, height: 0, bitrate: 500, frameRate: 15, captureMouseCursor: false, windowFocus: false})
      rtcEngine.startScreenCapturePreview();
    });
  }


  startScreenShareByDisplay(displayId) {
    if(!this.sharingPrepared) {
      console.error('Sharing not prepared yet.')
      return false
    };
    return new Promise((resolve, reject) => {
      let rtcEngine = this.getRtcEngine();
      rtcEngine.videoSourceSetLogFile("videosource.txt");
      // rtcEngine.videoSourceSetParameters("{\"rtc.log_filter\": 65535}");
      // rtcEngine.startScreenCapture2(windowId, captureFreq, rect, bitrate);
      // there's a known limitation that, videosourcesetvideoprofile has to be called at least once
      // note although it's called, it's not taking any effect, to control the screenshare dimension, use captureParam instead
      console.log(`start sharing display ${JSON.stringify(displayId)}`);
      // rtcEngine.videoSourceSetVideoProfile(43, false);
      // rtcEngine.videosourceStartScreenCaptureByWindow(windowId, {x: 0, y: 0, width: 0, height: 0}, {width: 0, height: 0, bitrate: 500, frameRate: 15})

      rtcEngine.videoSourceStartScreenCaptureByScreen(displayId, {x: 0, y: 0, width: 0, height: 0}, {width: 0, height: 0, bitrate: 500, frameRate: 5, captureMouseCursor: false, windowFocus: false});

      // let list = rtcEngine.getScreenWindowsInfo();
      // let exculdeList = list.map((item, index) => {
      //   return item.windowId
      // });
      // rtcEngine.videoSourceStartScreenCaptureByScreen(displayId, {x: 0, y: 0, width: 0, height: 0}, {width: 0, height: 0, bitrate: 500, frameRate: 5, captureMouseCursor: false, windowFocus: false, excludeWindowList: exculdeList, excludeWindowCount: exculdeList.length});
      
      rtcEngine.startScreenCapturePreview();
    });
  }

  updateScreenShareParam = (e) => {
    // let rtcEngine = this.getRtcEngine()
    // let list = rtcEngine.getScreenWindowsInfo();
    // let exculdeList = list.map((item, index) => {
    //   return item.windowId
    // });
    // rtcEngine.videoSourceUpdateScreenCaptureParameters({width: 0, height: 0, bitrate: 500, frameRate: 5, captureMouseCursor: false, windowFocus: false, excludeWindowList: exculdeList, excludeWindowCount: exculdeList.length});
  }

  handleScreenSharing = (e) => {
    // getWindowInfo and open Modal
    let rtcEngine = this.getRtcEngine()
    let list = rtcEngine.getScreenWindowsInfo();
    Promise.all(list.map(item => readImage(item.image))).then(imageList => {
      let windowList = list.map((item, index) => {
        return {
          ownerName: item.ownerName,
          name: item.name,
          windowId: item.windowId,
          image: imageList[index],
        }
      })
      this.setState({
        showWindowPicker: true,
        windowList: windowList
      });
    })
  }

  handleDisplaySharing = (e) => {
    // getWindowInfo and open Modal
    let rtcEngine = this.getRtcEngine()
    let list = rtcEngine.getScreenDisplaysInfo();
    Promise.all(list.map(item => readImage(item.image))).then(imageList => {
      let displayList = list.map((item, index) => {
        let name = `Display ${index + 1}`
        return {
          ownerName: "",
          name: name,
          displayId: item.displayId,
          image: imageList[index],
        }
      })
      this.setState({
        showDisplayPicker: true,
        displayList: displayList
      });
    })
  }

  toggleFuPlugin = () => {
    const plugin = this.rtcEngine.getPlugins().find(plugin => plugin.id === 'bytedance' )
    if (plugin) {
      if(this.state.fuEnabled) {
        plugin.disable();
        this.setState({
          fuEnabled: false
        })
      } else {
        plugin.setParameter(JSON.stringify({"plugin.fu.authdata": FU_AUTH}))
        plugin.setParameter(JSON.stringify({"plugin.fu.bundles.load": [{
          bundleName: "face_beautification.bundle",
          bundleOptions: {
            "filter_name": "tokyo",
            "filter_level": 1.0,
            "color_level": 0.2,
            "red_level": 0.5,
            "blur_level": 6.0,
            "skin_detect": 0.0,
            "nonshin_blur_scale": 0.45,
            "heavy_blur": 0,
            "face_shape": 3,
            "face_shape_level": 1.0,
            "eye_enlarging": 0.5,
            "cheek_thinning": 0.0,
            "cheek_v": 0.0,
            "cheek_narrow": 0.0,
            "cheek_small": 0.0,
            "cheek_oval": 0.0,
            "intensity_nose": 0.0,
            "intensity_forehead": 0.5,
            "intensity_mouth": 0.5,
            "intensity_chin": 0.0,
            "change_frames": 0.0,
            "eye_bright": 1.0,
            "tooth_whiten": 1.0,
            "is_beauty_on": 1.0
          }
        }]}))
        plugin.enable();
        this.setState({
          fuEnabled: true
        })
      }
    }
  }

  toggleByteDancePlugin = () => {
    const plugin = this.rtcEngine.getPlugins().find(plugin => plugin.id === 'bytedance' )
    if (plugin) {
      if(this.state.bdEnabled) {
        plugin.disable();
        clearInterval(this.byteTimer)
        this.byteTimer = null
        this.setState({
          bdEnabled: false
        })
      } else {
        if(isMac) {
          plugin.setParameter(JSON.stringify({
            "plugin.bytedance.licensePath": path.join(__static, "bytedance/resource/license.licbag")
          }))
          plugin.setParameter(JSON.stringify({
            "plugin.bytedance.stickerPath": path.join(__static, "bytedance/resource/StickerResource.bundle")
          }))
          plugin.setParameter(JSON.stringify({
            "plugin.bytedance.beauty.resourcepath": path.join(__static, "bytedance/resource/BeautyResource.bundle/IESBeauty")
          }))
          plugin.setParameter(JSON.stringify({
            "plugin.bytedance.beauty.intensity": {
              1: 1.0,
              2: 1.0,
              9: 1.0
            }
          }))
          plugin.setParameter(JSON.stringify({
            "plugin.bytedance.faceDetectModelPath": path.join(__static, "bytedance/resource/StickerResource.bundle/ttfacemodel/tt_face_v6.0.model"),
            "plugin.bytedance.faceDetectExtraModelPath": path.join(__static, "bytedance/resource/StickerResource.bundle/ttfacemodel/tt_face_extra_v9.0.model"),
            "plugin.bytedance.faceAttributeModelPath": path.join(__static, "bytedance/resource/StickerResource.bundle/ttfaceattri/tt_face_attribute_v4.1.model"),
            "plugin.bytedance.faceAttributeEnabled": true
          }))
          plugin.setParameter(JSON.stringify({
            "plugin.bytedance.handDetectEnabled": true,
            "plugin.bytedance.handDetectModelPath": path.join(__static, "bytedance/resource/StickerResource.bundle/handmodel/tt_hand_det_v9.0.model"),
            "plugin.bytedance.handBoxModelPath": path.join(__static, "bytedance/resource/StickerResource.bundle/handmodel/tt_hand_box_reg_v10.0.model"),
            "plugin.bytedance.handGestureModelPath": path.join(__static, "bytedance/resource/StickerResource.bundle/handmodel/tt_hand_gesture_v8.1.model"),
            "plugin.bytedance.handKPModelPath": path.join(__static, "bytedance/resource/StickerResource.bundle/handmodel/tt_hand_kp_v5.0.model"),
          }))

          this.byteTimer = setInterval(() => {
            console.log(plugin.getParameter("plugin.bytedance.face.attribute"))
            console.log(plugin.getParameter("plugin.bytedance.hand.info"))
          }, 1000)
        } else {
          plugin.setParameter(JSON.stringify({
            "plugin.bytedance.licensePath": path.join(__static, "bytedance/resource/license.bag")
          }))
          // plugin.setParameter(JSON.stringify({
          //   "plugin.bytedance.stickerPath": path.join(__static, "bytedance/resource/StickerResource.bundle")
          // }))
          // plugin.setParameter(JSON.stringify({
          //   "plugin.bytedance.beauty.resourcepath": path.join(__static, "bytedance/resource/BeautyResource.bundle/IESBeauty")
          // }))
          // plugin.setParameter(JSON.stringify({
          //   "plugin.bytedance.beauty.intensity": {
          //     1: 1.0,
          //     2: 1.0,
          //     9: 1.0
          //   }
          // }))
          plugin.setParameter(JSON.stringify({
            "plugin.bytedance.faceDetectModelPath": path.join(__static, "bytedance/resource/model/ttfacemodel/tt_face_v6.0.model")
          }))
          plugin.setParameter(JSON.stringify({
            "plugin.bytedance.faceAttributeModelPath": path.join(__static, "bytedance/resource/model/ttfaceattrmodel/tt_face_attribute_v4.1.model")
          }))
        }
        
        plugin.enable();
        this.setState({
          bdEnabled: true
        })
      }
    }
  }

  handleRelease = () => {
    this.setState({
      localVideoSource: "",
      localSharing: false
    })
    if(this.rtcEngine) {
      this.rtcEngine.releasePluginManager()
      this.rtcEngine.release();
      this.rtcEngine = null;
    }
  }

  handleRtmp = () => {
    const url = RTMP_URL
    if(!url) {
      alert("RTMP URL Empty")
      return
    }
    if(!this.state.rtmpTestOn) {
      this.rtcEngine.setLiveTranscoding({
        /** width of canvas */
        width: 640,
        /** height of canvas */
        height: 480,
        /** kbps value, for 1-1 mapping pls look at https://docs.agora.io/cn/Interactive%20Broadcast/API%20Reference/cpp/structagora_1_1rtc_1_1_video_encoder_configuration.html */
        videoBitrate: 500,
        /** fps, default 15 */
        videoFrameRate: 15,
        /** true for low latency, no video quality garanteed; false - high latency, video quality garanteed */
        lowLatency: true,
        /** Video GOP in frames, default 30 */
        videoGop: 30,
        videoCodecProfile: 77,
        /**
         * RGB hex value. Value only, do not include a #. For example, 0xC0C0C0.
         * number color = (A & 0xff) << 24 | (R & 0xff) << 16 | (G & 0xff) << 8 | (B & 0xff)
         */
        backgroundColor: 0xc0c0c0,
        /** The number of users in the live broadcast */
        userCount: 1,
        audioSampleRate: 44800,
        audioChannels: 1,
        audioBitrate: 48,
        /** transcodingusers array */
        transcodingUsers: [
          {
            uid: this.state.local,
            x: 0,
            y: 0,
            width: 320,
            height: 240,
            zOrder: 1,
            alpha: 1,
            audioChannel: 1
          }
        ],
        watermark: {
          url: "",
          x: 0,
          y:0,
          width: 0,
          height: 0
        }
      });
      this.rtcEngine.addPublishStreamUrl(
        url,
        true
      );
    } else {
      this.rtcEngine.removePublishStreamUrl(url)
    }
    
    this.setState({
      rtmpTestOn: !this.state.rtmpTestOn
    })
  }

  handleWindowPicker = windowId => {
    this.setState({
      showWindowPicker: false,
      localSharing: true
    })
    this.prepareScreenShare()
      .then(uid => {
        this.startScreenShare(windowId)
        this.setState({
          localVideoSource: uid
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleDisplayPicker = displayId => {
    this.setState({
      showDisplayPicker: false,
      localSharing: true
    })
    this.prepareScreenShare()
      .then(uid => {
        this.startScreenShareByDisplay(displayId)
        this.setState({
          localVideoSource: uid
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  togglePlaybackTest = e => {
    let rtcEngine = this.getRtcEngine()
    if (!this.state.playbackTestOn) {
      let filepath = '/Users/menthays/Projects/Agora-RTC-SDK-for-Electron/example/temp/music.mp3';
      let result = rtcEngine.startAudioPlaybackDeviceTest(filepath);
      console.log(result);
    } else {
      rtcEngine.stopAudioPlaybackDeviceTest();
    }
    this.setState({
      playbackTestOn: !this.state.playbackTestOn
    })
  }

  toggleRecordingTest = e => {
    let rtcEngine = this.getRtcEngine()
    if (!this.state.recordingTestOn) {
      let result = rtcEngine.startAudioRecordingDeviceTest(1000);
      console.log(result);
    } else {
      rtcEngine.stopAudioRecordingDeviceTest();
    }
    this.setState({
      recordingTestOn: !this.state.recordingTestOn
    })
  }

  toggleLastmileTest = e => {
    let rtcEngine = this.getRtcEngine()
    if (!this.state.lastmileTestOn) {
      let result = rtcEngine.startLastmileProbeTest({
        probeUplink: true,
        probeDownlink: true,
        expectedDownlinkBitrate: 500,
        expectedUplinkBitrate: 500,
      });
      console.log(result);
    } else {
      rtcEngine.stopLastmileProbeTest();
    }
    this.setState({
      lastmileTestOn: !this.state.lastmileTestOn
    })
  }

  handleAudioHook = e => {
    let rtcEngine = this.getRtcEngine()
    if(!this.state.audioHookEnabled){
      rtcEngine.registerAudioFramePluginManager()
      rtcEngine.registerAudioFramePlugin("agora_electron_plugin_audio_hook")
      let dllpath = path.resolve(__dirname, "./plugins/AgoraPlayerHookPlugin.dll")
      rtcEngine.loadPlugin("agora_electron_plugin_audio_hook", dllpath)
      let playerpath = path.resolve(this.state.hookplayerpath)
      rtcEngine.setPluginStringParameter("agora_electron_plugin_audio_hook","plugin.hookAudio.playerPath", playerpath)
      rtcEngine.setPluginBoolParameter("agora_electron_plugin_audio_hook", "plugin.hookAudio.forceRestart", true)
      // important for hook audio quality
      rtcEngine.setRecordingAudioFrameParameters(44100, 2, 2, 882)
      rtcEngine.enablePlugin("agora_electron_plugin_audio_hook")
    } else {
      rtcEngine.disablePlugin("agora_electron_plugin_audio_hook")
      console.log(rtcEngine.unRegisterAudioFramePlugin("agora_electron_plugin_audio_hook"))
      console.log(rtcEngine.unRegisterAudioFramePluginManager())
    }
    this.setState({audioHookEnabled: !this.state.audioHookEnabled})
  }

  // handleAudioMixing = e => {
  //   const path = require('path')
  //   let filepath = path.join(__dirname, './music.mp3');
  //   if (this.enableAudioMixing) {
  //     rtcEngine.stopAudioMixing()
  //   } else {
  //     rtcEngine.startAudioMixing(filepath, false, false, -1);
  //   }
  //   this.enableAudioMixing = !this.enableAudioMixing;
  // }

  render() {
    let windowPicker, displayPicker
    if (this.state.showWindowPicker) {
      windowPicker = <WindowPicker
        onSubmit={this.handleWindowPicker}
        onCancel={e => this.setState({showWindowPicker: false})}
        windowList={this.state.windowList}
      />
    }

    if (this.state.showDisplayPicker) {
      displayPicker = <DisplayPicker
        onSubmit={this.handleDisplayPicker}
        onCancel={e => this.setState({showWindowPicker: false})}
        displayList={this.state.displayList}
      />
    }


    return (
      <div className="columns" style={{padding: "20px", height: '100%', margin: '0'}}>
        { this.state.showWindowPicker ? windowPicker : '' }
        { this.state.showDisplayPicker ? displayPicker : '' }
        <div className="column is-one-quarter" style={{overflowY: 'auto'}}>
          <div className="field">
            <label className="label">Channel</label>
            <div className="control">
              <input onChange={e => this.setState({channel: e.currentTarget.value})} value={this.state.channel} className="input" type="text" placeholder="Input a channel name" />
            </div>
          </div>
          <div className="field">
            <label className="label">Role</label>
            <div className="control">
              <div className="select"  style={{width: '100%'}}>
                <select onChange={e => this.setState({role: Number(e.currentTarget.value)})} value={this.state.role} style={{width: '100%'}}>
                  <option value={1}>Anchor</option>
                  <option value={2}>Audience</option>
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Video Encoder Configuration</label>
            <div className="control">
              <input onChange={e => this.setState({encoderWidth: e.currentTarget.value})} value={this.state.encoderWidth} className="input" type="number" placeholder="Encoder Width" />
              <input onChange={e => this.setState({encoderHeight: e.currentTarget.value})} value={this.state.encoderHeight} className="input" type="number" placeholder="Encoder Height" />
            </div>
          </div>
          <div className="field">
            <label className="label">VoiceChanger</label>
            <div className="control">
              <div className="select"  style={{width: '100%'}}>
                <select onChange={this.handleVoiceChanger} value={this.state.voiceChangerPreset} style={{width: '100%'}}>
                  {voiceChangerList.map(item => (<option key={item.value} value={item.value}>{item.label}</option>))}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">VoiceReverbPreset</label>
            <div className="control">
              <div className="select"  style={{width: '100%'}}>
                <select onChange={this.handleVoiceReverbPreset} value={this.state.voiceReverbPreset} style={{width: '100%'}}>
                  {voiceReverbList.map(item => (<option key={item.value} value={item.value}>{item.label}</option>))}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">VideoProfile</label>
            <div className="control">
              <div className="select"  style={{width: '100%'}}>
                <select onChange={this.handleVideoProfile} value={this.state.videoProfile} style={{width: '100%'}}>
                  {videoProfileList.map(item => (<option key={item.value} value={item.value}>{item.label}</option>))}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">AudioProfile</label>
            <div className="control">
              <div className="select"  style={{width: '50%'}}>
                <select onChange={this.handleAudioProfile} value={this.state.audioProfile} style={{width: '100%'}}>
                  {audioProfileList.map(item => (<option key={item.value} value={item.value}>{item.label}</option>))}
                </select>
              </div>
              <div className="select"  style={{width: '50%'}}>
                <select onChange={this.handleAudioScenario} value={this.state.audioScenario} style={{width: '100%'}}>
                  {audioScenarioList.map(item => (<option key={item.value} value={item.value}>{item.label}</option>))}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Camera</label>
            <div className="control">
              <div className="select"  style={{width: '100%'}}>
                <select onChange={this.handleCameraChange} value={this.state.camera} style={{width: '100%'}}>
                  {this.state.videoDevices.map((item, index) => (<option key={index} value={index}>{item.devicename}</option>))}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Microphone</label>
            <div className="control">
              <div className="select"  style={{width: '100%'}}>
                <select onChange={this.handleMicChange} value={this.state.mic} style={{width: '100%'}}>
                  {this.state.audioDevices.map((item, index) => (<option key={index} value={index}>{item.devicename}</option>))}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Loudspeaker</label>
            <div className="control">
              <div className="select"  style={{width: '100%'}}>
                <select onChange={this.handleSpeakerChange} value={this.state.speaker} style={{width: '100%'}}>
                  {this.state.audioPlaybackDevices.map((item, index) => (<option key={index} value={index}>{item.devicename}</option>))}
                </select>
              </div>
            </div>
          </div>
          {/* <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button onClick={this.handleAudioMixing} className="button is-link">Start/Stop Audio Mixing</button>
            </div>
          </div> */}
          <div className="field">
            <label className="label">Media Player Url</label>
            <div className="control">
              <input onChange={e => this.setState({mediaPlayerUrl: e.currentTarget.value})} value={this.state.mediaPlayerUrl} className="input" type="text" placeholder="Input a MediaPlayer Url" />
            </div>
          </div>
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button onClick={this.attachMediaPlayerToRtc} className="button is-link">Attach Media Player To Rtc</button>
            </div>
          </div>
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button onClick={this.detachMediaPlayerToRtc} className="button is-link">Detach Media Player To Rtc</button>
            </div>
          </div>

          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button onClick={this.openMediaPlayer} className="button is-link">Open Media Player</button>
            </div>
          </div>
    
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button onClick={this.handlePublishVideo} className="button is-link">Publish Video</button>
            </div>
          </div>

          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button onClick={this.handleUnpublishVideo} className="button is-link">Unpublish Video</button>
            </div>
          </div>

          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button onClick={this.handlePublishAudio} className="button is-link">Publish Audio</button>
            </div>
          </div>

          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button onClick={this.handleUnpublishAudio} className="button is-link">Unpublish Audio</button>
            </div>
          </div>
              <button onClick={this.handleJoin} className="button is-link">Join</button>
          <hr/>
          <div className="field">
            <label className="label">Network Test</label>
            <div className="control">
              <button onClick={this.toggleLastmileTest} className="button is-link">{this.state.lastmileTestOn ? 'stop' : 'start'}</button>
            </div>
          </div>
          <div className="field">
            <label className="label">Screen Share</label>
            <div className="control">
              <button onClick={this.handleScreenSharing} className="button is-link">Screen Share</button>
            </div>
            <div className="control">
              <button onClick={this.handleDisplaySharing} className="button is-link">Display Share</button>
            </div>
            <div className="control">
              <button onClick={this.updateScreenShareParam} className="button is-link">Update Screen Share</button>
            </div>
          </div>
          <div className="field">
            <label className="label">RTMP</label>
            <div className="control">
              <button onClick={this.handleRtmp} className="button is-link">{this.state.rtmpTestOn ? 'stop' : 'start'}</button>
            </div>
          </div>
          <div className="field">
            <label className="label">Release</label>
            <div className="control">
              <button onClick={this.handleRelease} className="button is-link">Release</button>
            </div>
          </div>
          <div className="field">
            <label className="label">Audio Hook Player Path</label>
            <div className="control">
              <input onChange={e => this.setState({hookplayerpath: e.currentTarget.value})} value={this.state.hookplayerpath} className="input" type="text" placeholder="Absolute player path" />
            </div>
          </div>
          <div className="field">
            <label className="label">Audio Hook</label>
            <div className="control">
              <button onClick={this.handleAudioHook} className="button is-link">Start</button>
            </div>
          </div>
          <div className="field">
            <label className="label">Audio Playback Test</label>
            <div className="control">
              <button onClick={this.togglePlaybackTest} className="button is-link">{this.state.playbackTestOn ? 'stop' : 'start'}</button>
            </div>
          </div>
          <div className="field">
            <label className="label">Audio Recording Test</label>
            <div className="control">
              <button onClick={this.toggleRecordingTest} className="button is-link">{this.state.recordingTestOn ? 'stop' : 'start'}</button>
            </div>
          </div>
          <div className="field">
            <label className="label">Toggle FU Plugin</label>
            <div className="control">
              <button onClick={this.toggleFuPlugin} className="button is-link">{this.state.fuEnabled ? 'disable' : 'enable'}</button>
            </div>
          </div>
          <div className="field">
            <label className="label">Toggle ByteDance Plugin</label>
            <div className="control">
              <button onClick={this.toggleByteDancePlugin} className="button is-link">{this.state.bdEnabled ? 'disable' : 'enable'}</button>
            </div>
          </div>
        </div>
        <div className="column is-three-quarters window-container">
          {this.state.users.map((item, key) => (
            <Window key={key} uid={item.uid} channel={item.channelId} rtcEngine={this.rtcEngine} role={item===SHARE_ID?'remoteVideoSource':'remote'}></Window>
          ))}
          {this.state.local ? (<Window uid={this.state.local} rtcEngine={this.rtcEngine} role="local">

          </Window>) : ''}
          {this.state.localVideoSource ? (<Window uid={this.state.localVideoSource} rtcEngine={this.rtcEngine} role="localVideoSource">

          </Window>) : ''}
          {this.state.mediaPlayerView ? (<MediaPlayerWindow mediaPlayer={this.mediaPlayer}>

          </MediaPlayerWindow>) : ''}
        </div>
      </div>
    )
  }
}

class MediaPlayerWindow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentDidMount() {
    let dom = document.querySelector("#mediaPlayerView")
    console.log(`MediaPlayerWindow  dom: ${dom}`)
    this.props.mediaPlayer.setView(1, dom);
  }

  render() {
    return (
      <div className="window-item">
        <div className="video-item" id="mediaPlayerView">
        <p className="mirrorRotateHorizontal"></p>
        </div>
      </div>
    )
  }
}

class Window extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentDidMount() {
    let dom = document.querySelector(`#video-${this.props.channel || ""}-${this.props.uid}`)
    if (this.props.role === 'local') {
      dom && this.props.rtcEngine.setupLocalVideo(dom)
    } else if (this.props.role === 'localVideoSource') {
      dom && this.props.rtcEngine.setupLocalVideoSource(dom)
      this.props.rtcEngine.setupViewContentMode('videosource', 1);
      this.props.rtcEngine.setupViewContentMode(String(SHARE_ID), 1);
    } else if (this.props.role === 'remote') {
      dom && this.props.rtcEngine.subscribe(this.props.uid, dom)
      this.props.rtcEngine.setupViewContentMode(this.props.uid, 1);
    } else if (this.props.role === 'remoteVideoSource') {
      dom && this.props.rtcEngine.subscribe(this.props.uid, dom)
      this.props.rtcEngine.setupViewContentMode('videosource', 1);
      this.props.rtcEngine.setupViewContentMode(String(SHARE_ID), 1);
    }
  }

  render() {
    return (
      <div className="window-item">
        <div className="video-item" id={`video-${this.props.channel || ""}-${this.props.uid}`}></div>

      </div>
    )
  }
}