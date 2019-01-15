const generateRandomString = require('./index.js').generateRandomString;

const host = 'rtmp://vid-218.push.chinanetcenter.broadcastapp.agora.io/live';

class LiveStreaming {
  constructor(localRtcEngine) {
    this.ns = generateRandomString(4);
    this.localRtcEngine = localRtcEngine;
  }

  publish(uid) {
    return new Promise(resolve => {
      this.localRtcEngine.on('streamPublished', () => {
        console.log('stream published');
        resolve();
      });
      // this.localRtcEngine.setLiveTranscoding({
      //   width: 640,
      //   height: 480,
      //   videoBitrate: 800,
      //   videoFramerate: 15,
      //   lowLatency: true,
      //   videoGop: 30,
      //   videoCodecProfile: 66,
      //   transcodingUsers: [
      //     {
      //       uid: uid,
      //       width: 360,
      //       height: 240,
      //       zOrder: 1,
      //       alpha: 1,
      //       audioChannel: 0
      //     }
      //   ],
      //   backgroundColor: 0x0,
      //   audioSampleRate: 32000,
      //   audioBitrate: 48,
      //   audioChannels: 1
      // });
      this.localRtcEngine.addPublishStreamUrl(`${host}/${this.ns}`, false);
    });
  }

  unpublish() {
    this.localRtcEngine.removePublishStreamUrl(`${host}/${this.ns}`);
  }
}

module.exports = LiveStreaming;
