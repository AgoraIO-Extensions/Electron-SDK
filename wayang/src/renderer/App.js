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
import Utils from '../utils/index'

const device_id = "electron_001"

export default class App extends Component {
  constructor(props) {
    super(props)
    
    this.initLogger()
    this.apiHandler = null
    this.state = {
      logs: [],
      users: []
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
      this.apiHandler.on('setupLocalVideo', () => {

      })
      // this.registerDevice(device_id)
    }

    ws.onmessage = e => {
      Logger.info(`<-- ${Utils.readableMessage(e.data)}`, Utils.getProperty(e.data, 'type'))
      this.apiHandler.handleMessage(e.data)
    }
    this.ws = ws
  }

  
  render() {
    return (
      <div className="columns" style={{padding: "20px", height: '100%', margin: '0'}}>
        <div className="column is-two-quarters window-container">
          {this.state.users.map((item, key) => (
            <Window key={key} uid={item.uid} rtcEngine={this.rtcEngine} role={item.role}></Window>
          ))}
          {this.state.local ? (<Window uid={this.state.local} rtcEngine={this.rtcEngine} role="local">

          </Window>) : ''}
          {this.state.localVideoSource ? (<Window uid={this.state.localVideoSource} rtcEngine={this.rtcEngine} role="localVideoSource">

          </Window>) : ''}
        </div>
        <div className="column is-two-quarter" style={{overflowY: 'auto'}}>
          {this.state.logs.map((item, idx) => {
            let style = {}
            let className = `${item.level} logitem`
            let typeText = Utils.readableType(item.type)
            switch(item.type) {
              case 1:
                  style.backgroundColor = "Cyan"
                  break;
              case 3:
                  style.backgroundColor = "DarkTurquoise"
                  break;
              case 4:
                  style.backgroundColor = "Gold"
                  break;
              case 5:
                  style.backgroundColor = "HotPink"
                  break;
              case 7:
                  style.backgroundColor = "LemonChiffon"
            }
            return (
            <div key={idx} className={className} style={{width: "100%"}}>{item.ts} | <span style={style}>{typeText}</span> <span>{item.m}</span></div>
            );
          })}
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