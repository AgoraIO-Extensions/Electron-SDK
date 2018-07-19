const generateRandomString = require('./index.js').generateRandomString;
const exec = require('child_process').exec;
const path = require('path');

class MultiStream {
  constructor(localRtcEngine, channel) {
    this.localRtcEngine = localRtcEngine;
    this.channel = channel;
    this.remoteUid = null;
    this.localUid = null;
  }

  initLocalEngine(options) {
    this.initEngine(this.localRtcEngine, options);
  }

  initEngine(rtcEngine, options) {
    options = options || {};
    let videoProfile = options.videoProfile || 33;
    jest.spyOn(rtcEngine, 'initRender').mockImplementation(() => {});
    rtcEngine.setChannelProfile(1);
    rtcEngine.setClientRole(1);
    rtcEngine.setupLocalVideo();
    rtcEngine.setAudioProfile(0, 1);
    rtcEngine.setVideoProfile(videoProfile, false);
    rtcEngine.enableVideo();
    rtcEngine.enableLocalVideo(true);
  }

  localJoinChannel(uid) {
    return new Promise((resolve, reject) => {
      this.localUid = uid;
      let rtcEngine = this.localRtcEngine;
      jest.spyOn(rtcEngine, 'onRegisterDeliverFrame').mockImplementation(infos => {
        for (let i = 0; i < infos.length; i++) {
          let info = infos[i];
          let uid = info.uid;
          if (uid === this.remoteUid) {
            resolve();
          }
        }
      });

      rtcEngine.on('userjoined', remoteUid => {
        console.log(`subscribe ${remoteUid}`);
        rtcEngine.subscribe(remoteUid);
      });

      rtcEngine.on('error', err => {
        reject(err);
      });
      rtcEngine.joinChannel('', this.channel, '', uid);
    });
  }

  initRemoteStream(uid) {
    return new Promise(resolve => {
      this.remoteUid = uid;
      const appPath = path.join(__dirname, './peer.js');
      exec(`nohup node ${appPath} ${this.channel} ${uid} > /dev/null 2>&1 &`, function(err, stdout, stderr) {
        console.log(`${err} ${stdout} ${stderr}`);
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    });
  }

  leaveLocal() {
    return new Promise((resolve, reject) => {
      let rtcEngine = this.localRtcEngine;
      rtcEngine.on('leavechannel', () => {
        resolve();
      });
      rtcEngine.on('error', err => {
        reject(err);
      });
      // SetTimeout(() => {
      //   reject('timeout')
      // }, 5000)
      rtcEngine.leaveChannel();
    });
  }

  stopRemote() {
    return new Promise(resolve => {
      exec(`kill -s 9 $(ps aux | grep "[n]ode.*peer.js.*"| awk '{print $2}')`, () => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    });
  }
}

module.exports = MultiStream;
