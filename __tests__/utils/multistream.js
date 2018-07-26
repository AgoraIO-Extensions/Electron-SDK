const exec = require('child_process').exec;
const path = require('path');
const SHARE_ID = 2;

class MultiStream {
  constructor(localRtcEngine, channel) {
    this.localRtcEngine = localRtcEngine;
    this.channel = channel;
    this.remoteUid = null;
    this.localUid = null;
    this.appId = 'aab8b8f5a8cd4469a63042fcfafe7063';
  }

  initLocalEngine(options) {
    this.initEngine(this.localRtcEngine, options);
  }

  initEngine(rtcEngine, options) {
    options = options || {};
    let videoProfile = options.videoProfile || 33;
    jest.spyOn(rtcEngine, 'initRender').mockImplementation(() => { });
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
          console.log(uid);
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
      exec(
        `./startpeer.sh`,
        (err, stdout, stderr) => {
          console.log(`${err} ${stdout} ${stderr}`);
          setTimeout(() => {
            resolve();
          }, 2000);
        }
      );
    });
  }

  prepareScreenShare(token = null, info = '') {
    return new Promise(resolve => {
      let rtcEngine = this.localRtcEngine;
      rtcEngine.once('videosourcejoinedsuccess', uid => {
        expect(uid).toBe(SHARE_ID);
        resolve();
      });

      rtcEngine.videoSourceInitialize(this.appId);
      rtcEngine.videoSourceSetChannelProfile(1);
      rtcEngine.videoSourceEnableWebSdkInteroperability(true);
      rtcEngine.videoSourceSetVideoProfile(50, false);
      // To adjust render dimension to optimize performance
      rtcEngine.setVideoRenderDimension(3, SHARE_ID, 1600, 900);
      rtcEngine.videoSourceJoin(token, this.channel, info, SHARE_ID);
    });
  }

  startShare() {
    return new Promise(resolve => {
      let rtcEngine = this.localRtcEngine;
      jest.spyOn(rtcEngine, 'onRegisterDeliverFrame').mockImplementation(infos => {
        for (let i = 0; i < infos.length; i++) {
          let info = infos[i];
          let type = info.type;
          if (type === 3) {
            resolve();
          }
        }
      });
      rtcEngine.startScreenCapture2(
        0,
        15,
        {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        },
        0
      );
      rtcEngine.startScreenCapturePreview();
    });
  }

  stopShare() {
    let rtcEngine = this.localRtcEngine;
    rtcEngine.stopScreenCapture2();
    rtcEngine.stopScreenCapturePreview();
    rtcEngine.videoSourceLeave();
    rtcEngine.videoSourceRelease();
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
      exec(`./stoppeer.sh`, () => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    });
  }
}

module.exports = MultiStream;
