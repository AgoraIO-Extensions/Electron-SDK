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
import ApiHandler from './ApiHandler'
import Logger from './logger'

const device_id = "electron_001"

export default class App extends Component {
  constructor(props) {
    super(props)
    if (!APP_ID) {
      alert('APP_ID cannot be empty!')
    } else {
      this.initLogger()
      this.apiHandler = null
      this.state = {
        logs: []
      }
    }
    this.ws = null
    this.enableAudioMixing = false;
  }

  initLogger() {
    Logger.on('log', ({ts, level, m, type}) => {
      let {logs} = this.state
      logs.push({ts, level, m, type})
      this.setState(logs)
      console.log(`${ts} [${type}][${level}] ${m}`)
    })
  }

  registerDevice(device_id) {
    this.ws.send(JSON.stringify({"device": device_id, "cmd": "register" ,"type": 2, "sequence": new Date().getTime()}))
  }

  componentDidMount() {
    Logger.info((<span>connecting to wayang server as <span style={{fontWeight: "bold"}}>{device_id}</span>...</span>), 'socket')
    let ws = new WebSocket(`ws://114.236.93.153:8083/iov/websocket/dual?topic=${device_id}`)
    ws.onopen = () => {
      Logger.info(`connected.`, 'socket')
      this.apiHandler = new ApiHandler(device_id, ws)
      this.registerDevice(device_id)
    }

    ws.onmessage = e => {
      Logger.info(e.data, 'socket-in')
      this.apiHandler.handleMessage(e.data)
    }
    this.ws = ws
  }

  
  render() {
    return (
      <div style={{padding: "20px", height: '100%', margin: '0'}}>
        {this.state.logs.map((item, idx) => {
          let className = `${item.type} logitem`
          return (
          <div key={idx} className={className} style={{width: "100%"}}>{item.ts} | <span>[{item.type.toUpperCase()}] {item.m}</span></div>
          );
        })}
      </div>
    )
  }

}