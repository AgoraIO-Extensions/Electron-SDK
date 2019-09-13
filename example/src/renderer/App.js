import React, { Component } from 'react';
import AgoraRtcEngine from '../../../';
import { List } from 'immutable';
import path from 'path';
import os from 'os'

import {voiceChangerList, voiceReverbPreset, videoProfileList, audioProfileList, audioScenarioList, APP_ID, SHARE_ID, RTMP_URL, voiceReverbList, FU_AUTH } from '../utils/settings'
import {readImage} from '../utils/base64'
import WindowPicker from './components/WindowPicker/index.js'
import DisplayPicker from './components/DisplayPicker/index.js'
import { VoiceChangerPreset } from '../../../JS/Api/native_type';

export default class App extends Component {
  constructor(props) {
    super(props)
    if (!APP_ID) {
      alert('APP_ID cannot be empty!')
    } else {
      let rtcEngine = this.getRtcEngine()
      this.state = {
        userAccount: '',
        local: '',
        localVideoSource: '',
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
        fuEnabled: false,
      }
    }
    this.enableAudioMixing = false;
  }

  getRtcEngine() {
    if(!this.rtcEngine) {
      this.rtcEngine = new AgoraRtcEngine()
      this.rtcEngine.initialize(APP_ID)
      this.rtcEngine.initializePluginManager();
      const libPath = path.resolve(__static, 'fu-mac/libFaceUnityPlugin.dylib')
      this.rtcEngine.registerPlugin({
        id: 'fu-mac',
        path: libPath
      })
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
        users: this.state.users.push(uid)
      })
    })
    rtcEngine.on('removestream', (uid, reason) => {
      this.setState({
        users: this.state.users.delete(this.state.users.indexOf(uid))
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
    rtcEngine.on('audiovolumeindication', (
      uid,
      volume,
      speakerNumber,
      totalVolume
    ) => {
      console.log(`uid${uid} volume${volume} speakerNumber${speakerNumber} totalVolume${totalVolume}`)
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
    rtcEngine.on('userInfoUpdated', (uid, userInfo) => {
      console.log(`userInfoUpdated: ${uid} ${userInfo.userAccount}`)
    })
  }

  handleJoin = () => {
    let encoderWidth = parseInt(this.state.encoderWidth)
    let encoderHeight = parseInt(this.state.encoderHeight)
    let rtcEngine = this.getRtcEngine()
    rtcEngine.setChannelProfile(1)
    rtcEngine.setClientRole(this.state.role)
    rtcEngine.setAudioProfile(0, 1)
    rtcEngine.enableVideo()
    let logpath = path.resolve(os.homedir(), "./agoramain.sdk")
    rtcEngine.setLogFile(logpath)
    rtcEngine.enableLocalVideo(true)
    rtcEngine.enableWebSdkInteroperability(true)
    if(encoderWidth === 0 && encoderHeight === 0) {
      //use video profile
      rtcEngine.setVideoProfile(this.state.videoProfile, false)
    } else {
      rtcEngine.setVideoEncoderConfiguration({width: encoderWidth, height: encoderHeight})
    }
    rtcEngine.setLocalVoiceChanger(this.state.voiceChangerPreset)
    rtcEngine.setLocalVoiceReverbPreset(this.state.voiceReverbPreset)
    console.log('loop', rtcEngine.enableLoopbackRecording(true, null))
    rtcEngine.enableDualStreamMode(true)
    rtcEngine.enableAudioVolumeIndication(1000, 3)

    //enable beauty options
    rtcEngine.setBeautyEffectOptions(true, {
      lighteningContrastLevel: 2,
      lighteningLevel: 1,
      smoothnessLevel: 1,
      rednessLevel: 0
    })

    rtcEngine.setParameters("{\"rtc.sync_user_account_callback\": true}")
    // rtcEngine.joinChannel(null, this.state.channel, '',  Number(`${new Date().getTime()}`.slice(7)))
    rtcEngine.joinChannelWithUserAccount(null, this.state.channel, this.state.userAccount)
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
        rtcEngine.setVideoRenderDimension(3, SHARE_ID, 1200, 680);
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
      rtcEngine.videoSourceSetVideoProfile(43, false);
      rtcEngine.videosourceStartScreenCaptureByWindow(windowId, {x: 0, y: 0, width: 0, height: 0}, {width: 0, height: 0, bitrate: 500, frameRate: 15})
      rtcEngine.startScreenCapturePreview();
    });
  }


  startScreenShareByDisplay(displayId) {
    if(!this.sharingPrepared) {
      console.error('Sharing not prepared yet.')
      return false
    };
    return new Promise((resolve, reject) => {
      let rtcEngine = this.getRtcEngine()
      // rtcEngine.startScreenCapture2(windowId, captureFreq, rect, bitrate);
      // there's a known limitation that, videosourcesetvideoprofile has to be called at least once
      // note although it's called, it's not taking any effect, to control the screenshare dimension, use captureParam instead
      console.log(`start sharing display ${displayId}`)
      rtcEngine.videoSourceSetVideoProfile(43, false);
      // rtcEngine.videosourceStartScreenCaptureByWindow(windowId, {x: 0, y: 0, width: 0, height: 0}, {width: 0, height: 0, bitrate: 500, frameRate: 15})
      rtcEngine.videosourceStartScreenCaptureByScreen(displayId, {x: 0, y: 0, width: 0, height: 0}, {width: 0, height: 0, bitrate: 500, frameRate: 5})
      rtcEngine.startScreenCapturePreview();
    });
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
    const plugin = this.rtcEngine.getPlugins().find(plugin => plugin.id === 'fu-mac' )
    if (plugin) {
      if(this.state.fuEnabled) {
        plugin.disable();
        this.setState({
          fuEnabled: false
        })
      } else {
        plugin.setParameter(JSON.stringify({"plugin.fu.authdata": FU_AUTH}))
        plugin.enable();
        this.setState({
          fuEnabled: true
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
      // this.rtcEngine.unregisterPlugin('fu-mac')
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
        audioSampleRate: 1,
        audioChannels: 1,
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
            <label className="label">User Account</label>
            <div className="control">
              <input onChange={e => this.setState({userAccount: e.currentTarget.value})} value={this.state.userAccount} className="input" type="text" placeholder="Input your user account" />
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
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button onClick={this.handleJoin} className="button is-link">Join</button>
            </div>
          </div>
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
        </div>
        <div className="column is-three-quarters window-container">
          {this.state.users.map((item, key) => (
            <Window key={key} uid={item} rtcEngine={this.rtcEngine} role={item===SHARE_ID?'remoteVideoSource':'remote'}></Window>
          ))}
          {this.state.local ? (<Window uid={this.state.local} rtcEngine={this.rtcEngine} role="local">

          </Window>) : ''}
          {this.state.localVideoSource ? (<Window uid={this.state.localVideoSource} rtcEngine={this.rtcEngine} role="localVideoSource">

          </Window>) : ''}
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
    let dom = document.querySelector(`#video-${this.props.uid}`)
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
        <div className="video-item" id={'video-' + this.props.uid}></div>

      </div>
    )
  }
}