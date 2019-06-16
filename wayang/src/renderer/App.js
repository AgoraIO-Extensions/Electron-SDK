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
      // this.registerDevice(device_id)
      this.subscribeApiCalls(this.apiHandler)
      this.subscribeNonApiCalls(this.apiHandler)
      this.subscribeDataRequestCalls(this.apiHandler)
    }

    ws.onmessage = e => {
      Logger.info(`<-- ${Utils.readableMessage(e.data)}`, Utils.getProperty(e.data, 'type'))
      this.apiHandler.handleMessage(e.data)
    }
    this.ws = ws
  }

  update(uid, viewId, role) {
    let {users = []} = this.state
    let updated = false
    for(let i = 0; i < users.length; i++) {
      let user = users[i]
      if(user.viewId === viewId) {
        user.role = role
        user.uid = uid
        updated = true
        break;
      }
    }
    if(!updated) {
      throw `canvas ${viewId} not exist`
    }
    this.setState({users})
  }

  subscribeDataRequestCalls = apiHandler => {
    let respType = 6
    let events = ["getImageOfView"]

    events.forEach(e => {
      apiHandler.dataRequest.on(e, (device, cmd, sequence, info) => {
        let result = 0
        let error = 0
        var canvas
        switch(e) {
          case "getImageOfView":
            canvas = document.querySelector(`#${info.id} canvas`);
            result = canvas.toDataURL("image/jpeg", 0.2)
            result = result.replace('data:image/jpeg;base64,', '')
            break;
        }
        apiHandler.callResult(respType, device, cmd, sequence, {
          error,
          "return": result
        }, {})
      })
    })
  }

  subscribeNonApiCalls = apiHandler => {
    let respType = 7
    let events = ["createView", "removeView", "removeAllView", "removeAllView"]

    events.forEach(e => {
      apiHandler.asyncNonApi.on(e, (device, cmd, sequence, info) => {
        let result = 0
        let error = 0
        switch(e) {
          case "removeAllViews":
          case "removeAllView":
            this.setState({users: []})
            break;
          case "createView":
            let viewId = `view-${new Date().getTime()}`
            this.state.users.push({
              viewId
            })
            this.setState({users: this.state.users})
            result = viewId
            break;
          case "removeView":
            break;
        }
        apiHandler.callResult(respType, device, cmd, sequence, {
          error,
          "return": result
        }, {})
      })
    })
  }

  subscribeApiCalls = apiHandler => {
    let respType = 5
    let events = ["setupLocalVideo", "setupRemoteVideo"]

    events.forEach(e => {
      apiHandler.asyncApi.on(e, (device, cmd, sequence, info) => {
        let result = 0
        let error = 0
        switch(e) {
          case "setupLocalVideo":
            this.update(info.canvas.uid, info.canvas.view, 'local')
            break;
          case "setupRemoteVideo":
            this.update(info.canvas.uid, info.canvas.view, 'remote')
            break;
        }
        apiHandler.callResult(respType, device, cmd, sequence, {
          error,
          "return": result
        }, {})
      })
    })

    // apiHandler.asyncApi.on('getImageOfView', (device, sequence, viewId) => {
    //   debugger
    //   this.asyncApiResponse(device, cmd, sequence, {
    //     "error": 0,
    //     "return": 0
    //   }, {})
    // })
  }
  
  render() {
    return (
      <div className="columns" style={{padding: "20px", height: '100%', margin: '0'}}>
        <div className="column is-two-quarters window-container">
          {this.state.users.map((item, key) => {
            if (item.viewId && item.role) {
              return (<Window key={key} uid={item.uid} viewId={item.viewId} rtcEngine={this.apiHandler ? this.apiHandler.rtcEngine : null} role={item.role}></Window>)
            }
          })}
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
    let dom = document.querySelector(`#${this.props.viewId}`)
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
        <div className="video-item" id={this.props.viewId}></div>

      </div>
    )
  }
}