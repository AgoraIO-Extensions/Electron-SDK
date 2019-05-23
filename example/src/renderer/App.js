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

const device_id = "electron_001"

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

  log = (m, type, level) => {
    let logs = this.state.logs
    logs.push({
      ts: (new Date()).toString(),
      m,level, type: type || "general"
    })
    this.setState({
      logs
    })
  }

  componentDidMount() {
    this.log((<span>connecting to wayang server as <span style={{fontWeight: "bold"}}>{device_id}</span>...</span>), 'socket')
    let ws = new WebSocket(`ws://114.236.141.253:8083/iov/websocket/dual?topic=${device_id}`)
    ws.onopen = () => {
      this.log(`connected.`, 'socket')
    }

    ws.onmessage = e => {
      this.log((<span>received <span style={{fontWeight: "bold"}}>{e.data}</span></span>), 'socket')
    }
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
      <div style={{padding: "20px", height: '100%', margin: '0'}}>
        {this.state.logs.map((item, idx) => {
          return (
          <div key={idx} style={{width: "100%"}}>{item.ts} | <span style={{color: "green"}}>[{item.type.toUpperCase()}] {item.m}</span></div>
          );
        })}
      </div>
    )
  }

}