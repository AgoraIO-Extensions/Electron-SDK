import React, { Component } from 'react';
import AgoraRtcEngine from '../../../js/AgoraSdk';
import { List } from 'immutable';
import path from 'path';

import {videoProfileList, audioProfileList, audioScenarioList, APP_ID } from '../utils/settings'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.rtcEngine = new AgoraRtcEngine()
    if (!APP_ID) {
      alert('APP_ID cannot be empty!')
    } else {
      this.rtcEngine.initialize(APP_ID)
      this.state = {
        local: '',
        users: new List(),
        channel: '',
        role: 1,
        videoDevices: this.rtcEngine.getVideoDevices(),
        audioDevices: this.rtcEngine.getAudioRecordingDevices(),
        audioPlaybackDevices: this.rtcEngine.getAudioPlaybackDevices(),
        camera: 0,
        mic: 0,
        speaker: 0,
        videoProfile: 43,
        showWindowPicker: false,
        recordingTestOn: false,
        playbackTestOn: false
      }
    }
    this.enableAudioMixing = false;
  }

  componentDidMount() {
    this.subscribeEvents()
  }   

  subscribeEvents = () => {
    this.rtcEngine.on('joinedchannel', (channel, uid, elapsed) => {
      this.setState({
        local: uid
      });
    });
    this.rtcEngine.on('userjoined', (uid, elapsed) => {
      this.setState({
        users: this.state.users.push(uid)
      })
    })
    this.rtcEngine.on('removestream', (uid, reason) => {
      this.setState({
        users: this.state.users.delete(this.state.users.indexOf(uid))
      })
    })
    this.rtcEngine.on('leavechannel', () => {
      this.setState({
        local: ''
      })
    })
    this.rtcEngine.on('audiodevicestatechanged', () => {
      this.setState({
        audioDevices: this.rtcEngine.getAudioRecordingDevices(),
        audioPlaybackDevices: this.rtcEngine.getAudioPlaybackDevices()
      })
    })
    this.rtcEngine.on('videodevicestatechanged', () => {
      this.setState({
        videoDevices: this.rtcEngine.getVideoDevices()
      })
    })
    this.rtcEngine.on('audiovolumeindication', (
      uid,
      volume,
      speakerNumber,
      totalVolume
    ) => {
      console.log(`uid${uid} volume${volume} speakerNumber${speakerNumber} totalVolume${totalVolume}`)
    })
    this.rtcEngine.on('error', err => {
      console.error(err)
    })
    this.rtcEngine.on('executefailed', funcName => {
      console.error(funcName, 'failed to execute')
    })
  }

  handleJoin = () => {
    let rtcEngine = this.rtcEngine
    rtcEngine.setChannelProfile(1)
    rtcEngine.setClientRole(this.state.role)
    rtcEngine.setAudioProfile(0, 1)
    rtcEngine.enableVideo()
    rtcEngine.enableLocalVideo(true)
    rtcEngine.enableWebSdkInteroperability(true)
    rtcEngine.setVideoProfile(this.state.videoProfile, false)
    rtcEngine.enableAudioVolumeIndication(1000, 3)
    rtcEngine.joinChannel(null, this.state.channel, '',  Number(`${new Date().getTime()}`.slice(7)))
  }

  handleCameraChange = e => {
    this.setState({camera: e.currentTarget.value});
    this.rtcEngine.setVideoDevice(this.state.videoDevices[e.currentTarget.value].deviceid);
  }

  handleMicChange = e => {
    this.setState({mic: e.currentTarget.value});
    this.rtcEngine.setAudioRecordingDevice(this.state.audioDevices[e.currentTarget.value].deviceid);
  }

  handleSpeakerChange = e => {
    this.setState({speaker: e.currentTarget.value});
    this.rtcEngine.setAudioPlaybackDevice(this.state.audioPlaybackDevices[e.currentTarget.value].deviceid);
  }

  handleVideoProfile = e => {
    this.setState({
      videoProfile: Number(e.currentTarget.value)
    })
  }

  handleGetWindowsInfo = e => {
    let list = this.rtcEngine.getScreenWindowsInfo()
    const fs = require('fs');
    const path = require('path');
    list.map((item,index) => {
      fs.writeFile(index+item.name+'.jpeg', item.image, err => {
        if (err) {
          console.warn(err);
        }
      })
    })
  }

  togglePlaybackTest = e => {
    if (!this.state.playbackTestOn) {
      let filepath = '/Users/menthays/Projects/Agora-RTC-SDK-for-Electron/example/temp/music.mp3';
      let result = this.rtcEngine.startAudioPlaybackDeviceTest(filepath);
      console.log(result);
    } else {
      this.rtcEngine.stopAudioPlaybackDeviceTest();
    }
    this.setState({
      playbackTestOn: !this.state.playbackTestOn
    })
  }

  toggleRecordingTest = e => {
    if (!this.state.recordingTestOn) {
      let result = this.rtcEngine.startAudioRecordingDeviceTest(1000);
      console.log(result);
    } else {
      this.rtcEngine.stopAudioRecordingDeviceTest();
    }
    this.setState({
      recordingTestOn: !this.state.recordingTestOn
    })
  }

  // handleAudioMixing = e => {
  //   const path = require('path')
  //   let filepath = path.join(__dirname, './music.mp3');
  //   if (this.enableAudioMixing) {
  //     this.rtcEngine.stopAudioMixing()
  //   } else {
  //     this.rtcEngine.startAudioMixing(filepath, false, false, -1);
  //   }
  //   this.enableAudioMixing = !this.enableAudioMixing;
  // }

  render() {
    return (
      <div className="columns" style={{padding: "20px", height: '100%', margin: '0'}}>
        { this.state.showWindowPicker ? <WindowPicker></WindowPicker> : '' }
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
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button onClick={this.handleGetWindowsInfo} className="button is-link">Get Window Info</button>
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
        </div>
        <div className="column is-three-quarters window-container">
          {this.state.users.map((item, key) => (
            <Window key={key} uid={item} rtcEngine={this.rtcEngine} local={false}></Window>
          ))}
          {this.state.local ? (<Window uid={this.state.local} rtcEngine={this.rtcEngine} local={true}>

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
    if (this.props.local) {
      dom && this.props.rtcEngine.setupLocalVideo(dom)
    } else {
      dom && this.props.rtcEngine.subscribe(this.props.uid, dom)
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