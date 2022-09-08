import React, { Component } from 'react'
import AgoraRtcEngine from '../../../';
import {
  voiceChangerList,
  videoProfileList,
  audioProfileList,
  audioScenarioList,
  SHARE_ID,
  RTMP_URL,
  LOCAL_USER_ID,
  voiceReverbList,
} from '../utils/settings'
import { readImage } from '../utils/base64'
import WindowPicker from './components/WindowPicker/index.js'
import DisplayPicker from './components/DisplayPicker/index.js'
import Window from './components/Window'
import os from 'os'


export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      appid: '',
      token: '',
      local: '',
      isShowLocalVideoSource: '',
      localSharing: false,
      users: [],
      channel: 'test',
      role: 1,
      voiceReverbPreset: 0,
      voiceChangerPreset: 0,
      videoDevices: [],
      audioDevices: [],
      audioPlaybackDevices: [],
      camera: 0,
      mic: 0,
      speaker: 0,
      encoderConfiguration: 3,
      showScreenPicker: false,
      showDisplayPicker: false,
      recordingTestOn: false,
      playbackTestOn: false,
      lastmileTestOn: false,
      rtmpTestOn: false,
      windowList: [],
      displayList: [],
      screenShareConnectionId: 0,
    }
  }

  getRtcEngine() {
    if (!this.state.appid) {
      alert('Please enter appid')
      return
    }
    if (!this.rtcEngine) {
      this.rtcEngine = new AgoraRtcEngine()
      const filePath = os.homedir();
      // const filePath = `./`;
      console.log('filePath',filePath);
      const res = this.rtcEngine.initialize(this.state.appid, 0xFFFFFFFF, {
        filePath:"./",
        fileSizeInKB:1024,
        level:1
      })
      console.log('initialize', res,__dirname)
      let ret = this.rtcEngine.setLogFileSize(2000)
      
      this.subscribeEvents(this.rtcEngine)
      window.rtcEngine = this.rtcEngine
      this.rtcEngine.enableVideo();

      this.setState({
        videoDevices: rtcEngine.getVideoDevices(),
        audioDevices: rtcEngine.getAudioRecordingDevices(),
        audioPlaybackDevices: rtcEngine.getAudioPlaybackDevices(),
      })
    }

    return this.rtcEngine
  }

  subscribeEvents = (rtcEngine) => {
    rtcEngine.on('joinedChannel', (rtcConnection, elapsed) => {
      let channel = rtcConnection.channelId;
      let uid = rtcConnection.localUid;
      console.log('joinedChannel---------', channel, uid, elapsed)

      if (uid === SHARE_ID) {
        return
      }
      console.log(
        `onJoinChannel channel: ${channel}  uid: ${uid}  version: ${JSON.stringify(
          rtcEngine.getVersion()
        )})`
      )
      this.setState({
        local: uid,
      })
      let ret = rtcEngine.addPublishStreamUrl(
        'rtmp://vid-218.push.chinanetcenter.broadcastapp.agora.io/live/rawPublishStrem',
        false
      )
      console.log(`addPublishStreamUrl ret: ${ret}`)
    })
    rtcEngine.on('userjoined', (connection, uid, elapsed) => {
      if (
        [SHARE_ID, LOCAL_USER_ID].includes(uid) ||
        this.state.users.includes(uid)
      ) {
        return
      }
      console.log(`userJoined ---- ${uid}`)
      // rtcEngine.muteRemoteVideoStream(uid, false)
      this.setState({
        users: this.state.users.concat([uid]),
      })
    })
    rtcEngine.on('removestream', (connection, uid, reason) => {
      console.log(`useroffline ${uid}`)
      this.setState({
        users: this.state.users.filter((u) => u != uid),
      })
    })
    rtcEngine.on('leavechannel', (connection, rtcStats) => {
      console.log(`onleaveChannel----`)
      this.setState({
        local: '',
        users: [],
        localSharing: false,
        isShowLocalVideoSource: '',
      })
    })
    rtcEngine.on('audiodevicestatechanged', () => {
      this.setState({
        audioDevices: rtcEngine.getAudioRecordingDevices(),
        audioPlaybackDevices: rtcEngine.getAudioPlaybackDevices(),
      })
    })
    rtcEngine.on('videodevicestatechanged', () => {
      this.setState({
        videoDevices: rtcEngine.getVideoDevices(),
      })
    })
    rtcEngine.on('streamPublished', (url, error) => {
      console.log(`url: ${url}, err: ${error}`)
    })
    rtcEngine.on('streamUnpublished', (url) => {
      console.log(`url: ${url}`)
    })
    rtcEngine.on('lastmileProbeResult', (result) => {
      console.log(`lastmileproberesult: ${JSON.stringify(result)}`)
    })
    rtcEngine.on('lastMileQuality', (quality) => {
      console.log(`lastmilequality: ${JSON.stringify(quality)}`)
    })
    rtcEngine.on(
      'audiovolumeindication',
      (connection, speakers, speakerNumber, totalVolume) => {
        console.log(
          `uid${uid} volume${connection} speakerNumber${speakerNumber} totalVolume${totalVolume}`
        )
      }
    )
    rtcEngine.on('error', (connId, err, msg) => {
      console.error(err)
    })
  }

  handleJoin = () => {
    if (!this.state.channel) {
      alert('Please enter channel')
      return
    }
    let rtcEngine = this.getRtcEngine()
    // rtcEngine.setLogFile('./agora_native.log')
    rtcEngine.setChannelProfile(1)
    rtcEngine.setClientRole(this.state.role)
    rtcEngine.setAudioProfile(0, 1)
    rtcEngine.enableVideo()

    rtcEngine.enableWebSdkInteroperability(true)
    let encoderProfile = videoProfileList[this.state.encoderConfiguration]
    let rett = rtcEngine.setVideoEncoderConfiguration({
      width: encoderProfile.width,
      height: encoderProfile.height,
      frameRate: encoderProfile.fps,
      bitrate: encoderProfile.bitrate,
    })
    console.log(
      `setVideoEncoderConfiguration --- ${JSON.stringify(
        encoderProfile
      )}  ret: ${rett}`
    )

    let ret1 = rtcEngine.setLocalVoiceChanger(this.state.voiceChangerPreset)
    console.log(
      `setLocalVoiceChanger : ${ret1} -- e ${this.state.voiceChangerPreset}`
    )

    let ret2 = rtcEngine.setLocalVoiceReverbPreset(this.state.voiceReverbPreset)
    console.log(
      `setLocalVoiceReverbPreset : ${ret2} -- e ${this.state.voiceReverbPreset}`
    )

    if (this.state.videoDevices.length > 0) {
      rtcEngine.setVideoDevice(
        this.state.videoDevices[this.state.camera].deviceid
      )
    }
    if (this.state.audioDevices.length > 0) {
      rtcEngine.setAudioRecordingDevice(
        this.state.audioDevices[this.state.mic].deviceid
      )
    }
    if (this.state.audioPlaybackDevices.length > 0) {
      rtcEngine.setAudioPlaybackDevice(
        this.state.audioDevices[this.state.speaker].deviceid
      )
    }

    rtcEngine.enableDualStreamMode(true)
    rtcEngine.enableAudioVolumeIndication(1000, 3, false)

    rtcEngine.setRenderMode(2)
    rtcEngine.joinChannel(
      this.state.token || null,
      this.state.channel,
      '',
      LOCAL_USER_ID
    )
  }

  handleLeave = () => {
    let rtcEngine = this.getRtcEngine()
    rtcEngine.leaveChannel()
    rtcEngine.leaveChannelEx({
      localUid:this.state.screenShareConnectionId,
      channelId:this.state.channel,
    })
  }

  handleCameraChange = (e) => {
    this.setState({ camera: e.currentTarget.value })
    this.getRtcEngine().setVideoDevice(
      this.state.videoDevices[e.currentTarget.value].deviceid
    )
  }

  handleMicChange = (e) => {
    this.setState({ mic: e.currentTarget.value })
    this.getRtcEngine().setAudioRecordingDevice(
      this.state.audioDevices[e.currentTarget.value].deviceid
    )
  }

  handleSpeakerChange = (e) => {
    this.setState({ speaker: e.currentTarget.value })
    this.getRtcEngine().setAudioPlaybackDevice(
      this.state.audioPlaybackDevices[e.currentTarget.value].deviceid
    )
  }

  handleEncoderConfiguration = (e) => {
    this.setState({
      encoderConfiguration: Number(e.currentTarget.value),
    })
  }

  handleVoiceChanger = (e) => {
    console.log(`handleVoiceChanger  ${e.currentTarget.value}`)
    this.setState(
      {
        voiceChangerPreset: Number(e.currentTarget.value),
      },
      () => {
        this.rtcEngine.setLocalVoiceChanger(this.state.voiceChangerPreset)
      }
    )
  }

  handleVoiceReverbPreset = (e) => {
    console.log(`handleVoiceReverbPreset  ${e.currentTarget.value}`)
    this.setState({
      voiceReverbPreset: Number(e.currentTarget.value),
    })
  }

  /**
   * start screen share
   * @param {*} windowId windows id to capture
   * @param {*} captureFreq fps of video source screencapture, 1 - 15
   * @param {*} rect null/if specified, {x: 0, y: 0, width: 0, height: 0}
   * @param {*} bitrate bitrate of video source screencapture
   */
  startScreenShare(
    windowId = 0,
    captureFreq = 15,
    rect = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    bitrate = 0
  ) {
    let rtcEngine = this.getRtcEngine()
    // rtcEngine.startScreenCapture2(windowId, captureFreq, rect, bitrate);
    // there's a known limitation that, videosourcesetvideoprofile has to be called at least once
    // note although it's called, it's not taking any effect, to control the screenshare dimension, use captureParam instead
    let res = rtcEngine.startScreenCaptureByWindow(
      windowId,
      { x: 0, y: 0, width: 0, height: 0 },
      {
        width: 1920,
        height: 1080,
        bitrate: 500,
        frameRate: 15,
        captureMouseCursor: false,
        windowFocus: false,
      }
    )
    console.warn(
      'ce sho',
      '',
      {
        localUid: SHARE_ID,
        channelId: this.state.channel,
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
    )
    this.state.screenShareConnectionId = rtcEngine.joinChannelEx(
      '',
      {
        localUid: SHARE_ID,
        channelId: this.state.channel,
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
    )
  }

  startScreenShareByDisplay(displayId) {
    let rtcEngine = this.getRtcEngine()

    let excludeWindowList = []

    rtcEngine.startScreenCaptureByScreen(
      displayId,
      { x: 0, y: 0, width: 0, height: 0 },
      {
        width: 1920,
        height: 1080,
        bitrate: 1000,
        frameRate: 15,
        captureMouseCursor: false,
        windowFocus: false,
        excludeWindowList,
        excludeWindowCount: excludeWindowList.length,
      }
    )
    this.state.screenShareConnectionId = rtcEngine.joinChannelEx(
      '',
      {
        localUid: SHARE_ID,
        channelId:this.state.channel
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
    )
  }

  handleWindowSharing = e => {
    // getWindowInfo and open Modal
    let rtcEngine = this.getRtcEngine();
    // let list = rtcEngine.getScreenWindowsInfo();
    let list = rtcEngine.getScreenCaptureSources(
      { width: 400, height: 400 },
      { width: 400, height: 400 },
      false
    );

    Promise.all(list.map(item => readImage(item.thumbImage.buffer))).then(
      imageList => {
        let windowList = list.map((item, index) => {
          console.log(item.sourceTitle, item, item.sourceId);
          return {
            ownerName: item.sourceName,
            name: item.sourceTitle,
            windowId: item.sourceId,
            image: imageList[index],
          };
        });

        this.setState({
          showScreenPicker: true,
          windowList: windowList,
        });
      }
    );
  };

  handleDisplaySharing = (e) => {
    let rtcEngine = this.getRtcEngine()
    let list = rtcEngine.getScreenCaptureSources(
        { width: 400, height: 400 },
        { width: 400, height: 400 },
        true
    ).filter(obj => obj.type === 1);
    Promise.all(list.map(item => readImage(item.thumbImage.buffer))).then(
      imageList => {
        let displayList = list.map((item, index) => {
          return {
            ownerName: '',
            name: `Display ${index + 1}`,
            displayId: {x: 0, y: 0, width:400, height:400, id: item.sourceId},//item.sourceId,
            image: imageList[index],
          };
        });
        this.setState({
          showDisplayPicker: true,
          displayList: displayList,
        });
      }
    );
  }

  handleRelease = () => {
    this.setState({
      isShowLocalVideoSource: '',
      users: [],
      localSharing: false,
      local: '',
    })
    if (this.rtcEngine) {
      this.rtcEngine.release()
      this.rtcEngine = null
    }
  }

  handleRtmp = () => {
    const engine = this.rtcEngine
    engine.enableLocalTrapezoidCorrection(true, false)
    const opt = {
      dragSrcPoint: { x: 2.2, y: 3.3 },
      dragDstPoint: { x: 4.4, y: 5.5 },
      dragFinished: 1,
      dragSrcPoints: new Float32Array([0.1, 0.2, 0.3]).buffer,
      dragDstPoints: new Float32Array([0.4, 0.5, 0.6]).buffer,
      hasMultiPoints: true,
      assistLine: 2,
      resetDragPoints: 3,
    }
    let res;
    // engine.setLocalTrapezoidCorrectionOptions(opt)
    // res = engine.getLocalTrapezoidCorrectionOptions()
    // console.log('getLocalTrapezoidCorrectionOptions', res)

    res = engine.enableRemoteTrapezoidCorrection(1,true)
    console.log('enableRemoteTrapezoidCorrection 1', res)

    res = engine.enableRemoteTrapezoidCorrection(2,true, {
      localUid: 3,
      channelId: 'enableRemoteTrapezoidCorrection',
    })
    console.log('enableRemoteTrapezoidCorrection 2', res)


    res = engine.setRemoteTrapezoidCorrectionOptions(4, opt)
    console.log('setRemoteTrapezoidCorrectionOptions 1', res)

    res = engine.setRemoteTrapezoidCorrectionOptions(5, opt, {
      localUid: 6,
      channelId: 'setRemoteTrapezoidCorrectionOptions',
    })
    console.log('setRemoteTrapezoidCorrectionOptions 2', res)

    res = engine.getRemoteTrapezoidCorrectionOptions(7)
    console.log('getRemoteTrapezoidCorrectionOptions ', res)

    res = engine.applyTrapezoidCorrectionToRemote(8, true)
    console.log('applyTrapezoidCorrectionToRemote 1', res)

    res = engine.applyTrapezoidCorrectionToRemote(9, true, {
      localUid: 10,
      channelId: 'applyTrapezoidCorrectionToRemote',
    })
    console.log('applyTrapezoidCorrectionToRemote 2', res)
  }

  handleScreenPicker = (windowId) => {
    this.setState({
      showScreenPicker: false,
      localSharing: true,
    })
    this.startScreenShare(windowId)
    this.setState({
      isShowLocalVideoSource: true,
    })
  }

  handleDisplayPicker = (displayId) => {
    this.setState({
      showDisplayPicker: false,
      localSharing: true,
    })
    this.sharingPrepared = true
    this.startScreenShareByDisplay(displayId)
    this.setState({
      isShowLocalVideoSource: true,
    })
  }

  stopSharing = () => {
    let rtcEngine = this.getRtcEngine()
    rtcEngine.stopScreenCapture()
    this.setState({
      localSharing: false,
      isShowLocalVideoSource: false,
    })
  }

  togglePlaybackTest = (e) => {
    let rtcEngine = this.getRtcEngine()
    if (!this.state.playbackTestOn) {
      let filepath =
        '/Users/menthays/Projects/Agora-RTC-SDK-for-Electron/example/temp/music.mp3'
      let result = rtcEngine.startAudioPlaybackDeviceTest(filepath)
      console.log(result)
    } else {
      rtcEngine.stopAudioPlaybackDeviceTest()
    }
    this.setState({
      playbackTestOn: !this.state.playbackTestOn,
    })
  }

  toggleRecordingTest = (e) => {
    let rtcEngine = this.getRtcEngine()
    if (!this.state.recordingTestOn) {
      let result = rtcEngine.startAudioRecordingDeviceTest(1000)
      console.log(result)
    } else {
      rtcEngine.stopAudioRecordingDeviceTest()
    }
    this.setState({
      recordingTestOn: !this.state.recordingTestOn,
    })
  }
  onPressTestBtn = () => {
    //setExtensionProviderProperty(provider_name: string, key: string, json_value: string): number;
    let rtcEngine = this.getRtcEngine();
    let res;
    
    res = rtcEngine.enableExtension("enableExtension", "key1", "jvvvvvvvvv");
    console.log('enableExtension',res);
    res = rtcEngine.enableExtension("enableExtension1", "key1", "jvvvvvvvvv", 2);
    console.log('enableExtension',res);
    res = rtcEngine.getExtensionProperty("getExtensionProperty", "extension_name", "key", "json_value")
    console.log('getExtensionProperty',res);
    res = rtcEngine.getExtensionProperty("getExtensionProperty", "extension_name", "key", "json_value",2)
    console.log('getExtensionProperty',res);

    res = rtcEngine.setExtensionProperty("setExtensionProperty", "key1", "jvvvvvvvvv","jjjjjjjj1");
    console.log('setExtensionProperty',res);
    res = rtcEngine.setExtensionProperty("setExtensionProperty", "key1", "jvvvvvvvvv","jjjjjjj2", 2);
    console.log('setExtensionProperty',res);

    rtcEngine.setExtensionProviderProperty('provider_name', 'key', 'json_value');
    console.log('setExtensionProviderProperty', res);
    
  }

  toggleLastmileTest = (e) => {
    let rtcEngine = this.getRtcEngine()
    if (!this.state.lastmileTestOn) {
      let result = rtcEngine.startLastmileProbeTest({
        probeUplink: true,
        probeDownlink: true,
        expectedDownlinkBitrate: 500,
        expectedUplinkBitrate: 500,
      })
      console.log(result)
    } else {
      rtcEngine.stopLastmileProbeTest()
    }
    this.setState({
      lastmileTestOn: !this.state.lastmileTestOn,
    })
  }

  render() {
    let windowPicker, displayPicker
    if (this.state.showScreenPicker) {
      windowPicker = (
        <WindowPicker
          onSubmit={this.handleScreenPicker}
          onCancel={(e) => this.setState({ showScreenPicker: false })}
          windowList={this.state.windowList}
        />
      )
    }

    if (this.state.showDisplayPicker) {
      displayPicker = (
        <DisplayPicker
          onSubmit={this.handleDisplayPicker}
          onCancel={(e) => this.setState({ showScreenPicker: false })}
          displayList={this.state.displayList}
        />
      )
    }

    return (
      <div
        className='columns'
        style={{ padding: '20px', height: '100%', margin: '0' }}
      >
        {this.state.showScreenPicker ? windowPicker : ''}
        {this.state.showDisplayPicker ? displayPicker : ''}
        <div className='column is-one-quarter' style={{ overflowY: 'auto' }}>
          <div className='field'>
            <label className='label'>App ID</label>
            <div className='control'>
              <input
                onChange={(e) =>
                  this.setState({ appid: e.currentTarget.value })
                }
                value={this.state.appid}
                className='input'
                type='text'
                placeholder='APP ID'
              />
            </div>
          </div>
          <div className='field'>
            <label className='label'>Token(Optional)</label>
            <div className='control'>
              <input
                onChange={(e) =>
                  this.setState({ token: e.currentTarget.value })
                }
                value={this.state.token}
                className='input'
                type='text'
                placeholder="Token(Leave it empty if you didn't enable it)"
              />
            </div>
          </div>
          <div className='field'>
            <label className='label'>Channel</label>
            <div className='control'>
              <input
                onChange={(e) =>
                  this.setState({ channel: e.currentTarget.value })
                }
                value={this.state.channel}
                className='input'
                type='text'
                placeholder='Input a channel name'
              />
            </div>
          </div>
          <div className='field'>
            <label className='label'>Role</label>
            <div className='control'>
              <div className='select' style={{ width: '100%' }}>
                <select
                  onChange={(e) =>
                    this.setState({ role: Number(e.currentTarget.value) })
                  }
                  value={this.state.role}
                  style={{ width: '100%' }}
                >
                  <option value={1}>Anchor</option>
                  <option value={2}>Audience</option>
                </select>
              </div>
            </div>
          </div>
          <div className='field'>
            <label className='label'>VoiceChanger</label>
            <div className='control'>
              <div className='select' style={{ width: '100%' }}>
                <select
                  onChange={this.handleVoiceChanger}
                  value={this.state.voiceChangerPreset}
                  style={{ width: '100%' }}
                >
                  {voiceChangerList.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className='field'>
            <label className='label'>VoiceReverbPreset</label>
            <div className='control'>
              <div className='select' style={{ width: '100%' }}>
                <select
                  onChange={this.handleVoiceReverbPreset}
                  value={this.state.voiceReverbPreset}
                  style={{ width: '100%' }}
                >
                  {voiceReverbList.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className='field'>
            <label className='label'>Video Encoder</label>
            <div className='control'>
              <div className='select' style={{ width: '100%' }}>
                <select
                  onChange={this.handleEncoderConfiguration}
                  value={this.state.encoderConfiguration}
                  style={{ width: '100%' }}
                >
                  {videoProfileList.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className='field'>
            <label className='label'>AudioProfile</label>
            <div className='control'>
              <div className='select' style={{ width: '50%' }}>
                <select
                  onChange={this.handleAudioProfile}
                  value={this.state.audioProfile}
                  style={{ width: '100%' }}
                >
                  {audioProfileList.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='select' style={{ width: '50%' }}>
                <select
                  onChange={this.handleAudioScenario}
                  value={this.state.audioScenario}
                  style={{ width: '100%' }}
                >
                  {audioScenarioList.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className='field'>
            <label className='label'>Camera</label>
            <div className='control'>
              <div className='select' style={{ width: '100%' }}>
                <select
                  onChange={this.handleCameraChange}
                  value={this.state.camera}
                  style={{ width: '100%' }}
                >
                  {this.state.videoDevices.map((item, index) => (
                    <option key={index} value={index}>
                      {item.devicename}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className='field'>
            <label className='label'>Microphone</label>
            <div className='control'>
              <div className='select' style={{ width: '100%' }}>
                <select
                  onChange={this.handleMicChange}
                  value={this.state.mic}
                  style={{ width: '100%' }}
                >
                  {this.state.audioDevices.map((item, index) => (
                    <option key={index} value={index}>
                      {item.devicename}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className='field'>
            <label className='label'>Loudspeaker</label>
            <div className='control'>
              <div className='select' style={{ width: '100%' }}>
                <select
                  onChange={this.handleSpeakerChange}
                  value={this.state.speaker}
                  style={{ width: '100%' }}
                >
                  {this.state.audioPlaybackDevices.map((item, index) => (
                    <option key={index} value={index}>
                      {item.devicename}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className='field is-grouped is-grouped-right'>
            <div className='control'>
              <button onClick={this.handleLeave} className='button is-link'>
                Leave
              </button>
            </div>
            <div className='control'>
              <button onClick={this.handleJoin} className='button is-link'>
                Join
              </button>
            </div>
          </div>
          <hr />
          <div className='field'>
            <label className='label'>Test</label>
            <div className='control'>
              <button
                onClick={this.onPressTestBtn}
                className='button is-link'
              >
                Call Test API
              </button>
            </div>
          </div>
          <div className='field'>
            <label className='label'>Network Test</label>
            <div className='control'>
              <button
                onClick={this.toggleLastmileTest}
                className='button is-link'
              >
                {this.state.lastmileTestOn ? 'stop' : 'start'}
              </button>
            </div>
          </div>   
          <label className='label'>Screen Share</label>
          <div
            className={
              this.state.users.filter((u) => u === 2).length > 0
                ? 'hidden field is-grouped'
                : 'field is-grouped'
            }
          >
            <div className="control">
              <button
                onClick={this.handleWindowSharing}
                className="button is-link"
              >
                Window Share
              </button>
            </div>
            <div
              className={this.state.localSharing ? 'hidden control' : 'control'}
            >
              <button
                onClick={this.handleDisplaySharing}
                className='button is-link'
              >
                Display Share
              </button>
            </div>
            <div
              className={this.state.localSharing ? 'control' : 'hidden control'}
            >
              <button onClick={this.stopSharing} className='button is-link'>
                Stop Share
              </button>
            </div>
          </div>
          <div className='field'>
            <label className='label'>Testaaa</label>
            <div className='control'>
              <button onClick={this.handleRtmp} className='button is-link'>
                {this.state.rtmpTestOn ? 'stop' : 'start'}
              </button>
            </div>
          </div>
          <div className='field'>
            <label className='label'>Release</label>
            <div className='control'>
              <button onClick={this.handleRelease} className='button is-link'>
                Release
              </button>
            </div>
          </div>
          <div className='field'>
            <label className='label'>Audio Playback Test</label>
            <div className='control'>
              <button
                onClick={this.togglePlaybackTest}
                className='button is-link'
              >
                {this.state.playbackTestOn ? 'stop' : 'start'}
              </button>
            </div>
          </div>
          <div className='field'>
            <label className='label'>Audio Recording Test</label>
            <div className='control'>
              <button
                onClick={this.toggleRecordingTest}
                className='button is-link'
              >
                {this.state.recordingTestOn ? 'stop' : 'start'}
              </button>
            </div>
          </div>
        </div>
        <div className='column is-three-quarters window-container'>
          {this.state.users.map((item, key) => (
            <Window
              channelId={this.state.channel}
              key={item}
              uid={item}
              rtcEngine={this.rtcEngine}
              role={item === SHARE_ID ? 'remoteVideoSource' : 'remote'}
            ></Window>
          ))}
          {this.state.local ? (
            <Window
              channelId={this.state.channel}
              uid={this.state.local}
              rtcEngine={this.rtcEngine}
              role='local'
            ></Window>
          ) : (
            ''
          )}
          {this.state.isShowLocalVideoSource ? (
            <Window
              rtcEngine={this.rtcEngine}
              role='localVideoSource'
              channelId={this.state.channel}
            ></Window>
          ) : (
            ''
          )}
        </div>
      </div>
    )
  }
}
