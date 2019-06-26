
import AgoraRtcEngine from '../../../js/AgoraSdk';
import Logger from './logger';
import Utils from '../utils/index'
import { EventEmitter } from 'events';
import os from 'os'
import path from 'path'

const executeFunctionByName = (...args) => {
  let functionName = args[0]
  let context = args[1]
  let params = args[2]
  let namespaces = functionName.split(".");
  let func = namespaces.pop();
  for(let i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(context, params);
}

const isString = (str) => {
  return typeof str === 'string' || str instanceof String
}

const func_name_convention = {
  "iepSetParameters": "setParameters",
  "admSetPlaybackDeviceVolume": "setAudioPlaybackVolume"
}

const generic_call_table = {
  //cmd : parameter key array
  "initialize": ["appId"],
  "getErrorDescription": ["errorCode"],
  "getConnectionState": [],
  "joinChannel": ["token", "channelId", "info", "uid"],
  "leaveChannel": [],
  "release": [],
  "setHighQualityAudioParameters": ["fullband", "stereo", "fullBitrate"],
  "renewToken": ["newToken"],
  "setChannelProfile": ["profile"],
  "setClientRole": ["role"],
  "startEchoTest": [],
  "stopEchoTest": [],
  "startEchoTestWithInterval": ["interval"],
  "enableLastmileTest": [],
  "disableLastmileTest": [],
  "startLastmileProbeTest": [{
    "name": "config"
  }],
  "stopLastmileProbeTest": [],
  "enableVideo": [],
  "disableVideo": [],
  "startPreview": [],
  "stopPreview": [],
  "setVideoProfile": ["profile", "swapWidthAndHeight"],
  "setCameraCapturerConfiguration": [{
    "name": "config"
  }],
  "setVideoEncoderConfiguration": [{
    "name": "config"
  }],
  "setBeautyEffectOptions": ["enabled", {
    "name": "options"
  }],
  "setRemoteUserPriority": ["uid", "priority"],
  "enableAudio": [],
  "disableAudio": [],
  "setAudioProfile": ["profile", "scenario"],
  "setVideoQualityParameters": ["preferFrameRateOverImageQuality"],
  "setEncryptionMode": ["encryptionMode"],
  "setEncryptionSecret": ["secret"],
  "muteLocalAudioStream": ["mute"],
  "muteAllRemoteAudioStreams": ["mute"],
  "setDefaultMuteAllRemoteAudioStreams": ["mute"],
  "muteRemoteAudioStream": ["uid", "mute"],
  "muteLocalVideoStream": ["mute"],
  "enableLocalVideo": ["enabled"],
  "muteAllRemoteVideoStreams": ["mute"],
  "setDefaultMuteAllRemoteVideoStreams": ["mute"],
  "enableAudioVolumeIndication": ["interval", "smooth"],
  "muteRemoteVideoStream": ["uid", "mute"],
  "setInEarMonitoringVolume": ["volume"],
  "pauseAudio": [],
  "resumeAudio": [],
  "setLogFile": ["filePath"],
  "setLogFileSize": ["size"],
  "setLogFilter": ["filter"],
  "enableDualStreamMode": ["enabled"],
  "setRemoteVideoStreamType": ["uid", "streamType"],
  "setRemoteDefaultVideoStreamType": ["streamType"],
  "enableWebSdkInteroperability": ["enabled"],
  "setLocalVideoMirrorMode": ["mirrorMode"],
  "setLocalVoicePitch": ["pitch"],
  "setLocalVoiceEqualization": ["bandFrequency", "bandGain"],
  "setLocalVoiceReverb": ["reverbKey", "value"],
  "setLocalVoiceChanger": ["preset"],
  "setLocalVoiceReverbPreset": ["preset"],
  "setLocalPublishFallbackOption": ["option"],
  "setRemoteSubscribeFallbackOption": ["option"],
  "setExternalAudioSource": ["enabled", "samplerate", "channels"],
  "startVideoDeviceTest": [],
  "stopVideoDeviceTest": [],
  "admSetPlaybackDeviceVolume": ["volume"],
  "getAudioPlaybackVolume": [],
  "getAudioRecordingVolume": [],
  "setAudioRecordingVolume": ["volume"],
  "startAudioPlaybackDeviceTest": ["filePath"],
  "stopAudioPlaybackDeviceTest": [],
  "startAudioDeviceLoopbackTest": ["interval"],
  "stopAudioDeviceLoopbackTest": [],
  "enableLoopbackRecording": ["enabled", "deviceName"],
  "startAudioRecordingDeviceTest": ["interval"],
  "stopAudioRecordingDeviceTest": [],
  "getAudioPlaybackDeviceMute": [],
  "setAudioPlaybackDeviceMute": ["mute"],
  "getAudioRecordingDeviceMute": [],
  "setAudioRecordingDeviceMute": ["mute"],
  "startAudioMixing": ["filePath", "loopback", "replace", "cycle"],
  "stopAudioMixing": [],
  "pauseAudioMixing": [],
  "resumeAudioMixing": [],
  "adjustAudioMixingVolume": ["volume"],
  "adjustAudioMixingPlayoutVolume": ["volume"],
  "adjustAudioMixingPublishVolume": ["volume"],
  "getAudioMixingDuration": [],
  "getAudioMixingCurrentPosition": [],
  "setAudioMixingPosition": ["position"],
  "playEffect": ["soundId", "filePath", "loopCount", "pitch", "pan", "gain", "publish"],
  "preloadEffect": ["soundId", "filePath"],
  "unloadEffect": ["soundId"],
  "pauseEffect": ["soundId"],
  "pauseAllEffects": [],
  "resumeEffect": ["soundId"],
  "resumeAllEffects": [],
  "stopEffect": ["soundId"],
  "enableSoundPositionIndication": ["enabled"],
  "setRemoteVoicePosition": ["uid", "pan", "gain"],
  "getCallId": [],
  "rate": ["callId", "rating", "desc"],
  "complain": ["callId", "desc"],
  "iepSetParameters": ["parameters"]
}

const return_table = {
  "getAudioMixingDuration": [],
  "getAudioMixingCurrentPosition": []
}

const custom_call_table = {
  "setupRemoteVideo": [],
  "setupLocalVideo": [],
  "removeAllViews": [],
  "removeAllView": [],
  "removeView": [],
  "createView": [],
  "getImageOfView": [],
  "getVersion": []
  // "getVideoDevices": [],
  // "setVideoDevice": [],
  // "getCurrentVideoDevice": [],
  // "getAudioPlaybackDevices": [],
  // "getPlaybackDeviceInfo": [],
  // "getCurrentAudioPlaybackDevice": [],
  // "getAudioRecordingDevices": [],
  // "setAudioRecordingDevice": [],
  // "getRecordingDeviceInfo": [],
  // "getCurrentAudioRecordingDevice": [],
}

const ignore_call_table = {
  "iepRelease": [],
  "setLocalRenderMode": []
}

class ApiHandler {
  constructor(device_id, ws) {
    this.device_id = device_id
    this.ws = ws
    this.rtcEngine = null
    this.asyncApi = new EventEmitter()
    this.asyncNonApi = new EventEmitter()
    this.dataRequest = new EventEmitter()
  }
  handleMessage(msg) {
    let json = JSON.parse(msg)
    let {type, device, cmd, sequence, info, extra} = json

    if(type === 1) {
      this.handleApiCall(device, cmd, sequence, info, extra)
    } else if(type === 2) {
      this.handleDataRequestCall(device, cmd, sequence, info, extra)
    } else if(type === 3) {
      this.handleNonApiCall(device, cmd, sequence, info, extra)
    }
  }

  genericApiCall = (cmd, context, parameters) => {
    let result = executeFunctionByName(cmd, context, parameters)
    if(return_table[cmd]) {
      return result
    }
    return 0
  }

  customApiCall = (device, cmd, sequence, info, extra) => {
    this.asyncApi.emit(cmd, device, cmd, sequence, info, extra)
  }

  customNonApiCall = (device, cmd, sequence, info, extra) => {
    this.asyncNonApi.emit(cmd, device, cmd, sequence, info, extra)
  }

  handleDataRequestCall(device, cmd, sequence, info, extra) {
    this.dataRequest.emit(cmd, device, cmd, sequence, info, extra)
  }

  handleNonApiCall(device, cmd, sequence, info, extra) {
    let result = 0
    let error = 0
    if(ignore_call_table[cmd] !== undefined) {
      //ignore, not applicable
    } else if(custom_call_table[cmd] !== undefined) {
      return this.customNonApiCall(device, cmd, sequence, info, extra)
    } else {
      error = 1
    }
    this.callResult(7, device, cmd, sequence, {
      error,
      "return": result
    }, {})
  }

  handleApiCall(device, cmd, sequence, info, extra) {
    let result = 0
    let error = 0
    if(cmd === "createAgoraRtcEngine") {
      this.rtcEngine = new AgoraRtcEngine()
      this.subscribeEvents(this.rtcEngine)
      // let logfile = path.resolve(os.homedir(), `./wayang-${new Date().getTime()}.log`)
      // Logger.info(`log file: ${logfile}`, 'info')
      // this.rtcEngine.setLogFile(logfile)
      this.device = device
    } else if(generic_call_table[cmd]) {
      let params = []
      let paramNames = generic_call_table[cmd]
      paramNames.forEach(n => {
        if(isString(n)) {
          params.push(info[n])
        } else {
          //for object params
          let obj = info[n.name]
          let mapping = n.mapping || {}
          Object.keys(mapping).forEach(src => {
            let dest = obj[src]
            obj[dest] = obj[src]
            delete obj[src]
          })
          params.push(obj)
        }
      })
      let converted = func_name_convention[cmd] || cmd;
      result = this.genericApiCall(converted, this.rtcEngine, params)
    } else if(ignore_call_table[cmd] !== undefined) {
      //ignore, not applicable
    } else if(custom_call_table[cmd] !== undefined) {
      return this.customApiCall(device, cmd, sequence, info, extra)
    } else {
      error = 1
    }
    this.callResult(5, device, cmd, sequence, {
      error,
      "return": result
    }, {})
  }

  callResult(type, device, cmd, sequence, info, extra) {
    let res = JSON.stringify({
      type,
      device, sequence, cmd, info, extra
    })
    if(info.error !== 0) {
      Logger.info(`${res}`, 'error')
    } else {
      Logger.info(`--> ${Utils.readableMessage(res)}`, type)
    }
    this.ws.send(res)
  }

  eventResult(cmd, info, extra) {
    let data = JSON.stringify({device:this.device, type: 4, cmd, info, extra})
    Logger.info(`--> ${Utils.readableMessage(data)}`, 4)
    this.ws.send(data)
  }

  subscribeEvents = (rtcEngine) => {
    rtcEngine.on('joinedchannel', (channel, uid, elapsed) => {
      this.eventResult('onJoinChannelSuccess', {channel, uid, elapsed}, {})
    });
    rtcEngine.on('userjoined', (uid, elapsed) => {
      this.eventResult('onUserJoined', {uid, elapsed})
    })
    rtcEngine.on('removestream', (uid, reason) => {
      this.eventResult('onUserOffline', {uid, reason})
    })
    rtcEngine.on('leavechannel', () => {
      this.eventResult('onLeaveChannel', {})
    })
    rtcEngine.on('streamPublished', (url, error) => {
      console.log(`url: ${url}, err: ${error}`)
    })
    rtcEngine.on('streamUnpublished', (url) => {
      console.log(`url: ${url}`)
    })
    rtcEngine.on('lastmileProbeResult', result => {
      console.log(`lastmileproberesult: ${JSON.stringify(result)}`)
      this.eventResult('onLastmileProbeResult', result)
    })
    rtcEngine.on('lastMileQuality', quality => {
      console.log(`lastmilequality: ${JSON.stringify(quality)}`)
      this.eventResult('onLastmileQuality', {quality})
    })
    rtcEngine.on('connectionLost', () => {
      this.eventResult('onConnectionLost', {})
    })
    rtcEngine.on('audiovolumeindication', (
      uid,
      volume,
      speakerNumber,
      totalVolume
    ) => {
      console.log(`uid${uid} volume${volume} speakerNumber${speakerNumber} totalVolume${totalVolume}`)
    })
    rtcEngine.on('rtcStats', stats => {
      this.eventResult("onRtcStats", {stat:stats})
    })
    rtcEngine.on('error', err => {
      console.error(err)
      this.eventResult('onError', {err})
    })
    rtcEngine.on('executefailed', funcName => {
      console.error(funcName, 'failed to execute')
    })
    rtcEngine.on('networkQuality', (uid, txquality, rxquality) => {
      this.eventResult('onNetworkQuality', {uid, txQuality:txquality, rxQuality:rxquality})
    })
    rtcEngine.on('tokenPrivilegeWillExpire', token => {
      this.eventResult('onTokenPrivilegeWillExpire', {token})
    })
    rtcEngine.on('remoteVideoStats', stats => {
      this.eventResult('onRemoteVideoStats', {stats})
    })
  }

}

export default ApiHandler