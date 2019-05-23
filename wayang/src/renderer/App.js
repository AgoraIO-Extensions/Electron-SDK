import React, { Component } from 'react';
import AgoraRtcEngine from '../../../';
import { List } from 'immutable';
import path from 'path';
import os from 'os'

import {voiceChangerList, voiceReverbPreset, videoProfileList, audioProfileList, audioScenarioList, APP_ID, SHARE_ID, RTMP_URL, voiceReverbList } from '../utils/settings'
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
        logs: []
      }
    }
    this.enableAudioMixing = false;
  }

  getRtcEngine() {
    if(!this.rtcEngine) {
      this.rtcEngine = new AgoraRtcEngine()
      this.rtcEngine.initialize(APP_ID)
      this.subscribeEvents(this.rtcEngine)
      window.rtcEngine = this.rtcEngine;
    }

    return this.rtcEngine
  }

  log = m => {
    let logs = this.state.logs
    logs.push(m)
    this.setState({
      logs
    })
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
  }


  render() {
    
    return (
      <div className="columns" style={{padding: "20px", height: '100%', margin: '0'}}>

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