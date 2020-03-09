const host = 'rtmp://vid-218.push.chinanetcenter.broadcastapp.agora.io/live';

class LiveStreaming {
  constructor(localRtcEngine) {
    this.ns = 'agoratest';
    this.localRtcEngine = localRtcEngine;
  }

  publish(uid) {
    return new Promise(resolve => {
      this.localRtcEngine.on('rtmpStreamingStateChanged', (url,
        state,
        errCode) => {
        console.log(`rtmpStreamingStateChanged ${url} ${state} ${errCode}`);
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
      let url = `${host}/${this.ns}`;
      console.log(`publish to ${url}`);
      this.localRtcEngine.addPublishStreamUrl(url, false);
    });
  }

  unpublish() {
    this.localRtcEngine.removePublishStreamUrl(`${host}/${this.ns}`);
  }

  join(channel, uid) {
    return new Promise(resolve => {
      let rtcEngine = this.localRtcEngine;
      rtcEngine.on('joinedchannel', () => {
        resolve();
      });
      rtcEngine.setChannelProfile(1);
      rtcEngine.setClientRole(1);
      rtcEngine.setAudioProfile(0, 1);
      rtcEngine.enableVideo();
      rtcEngine.joinChannel(null, channel, '', uid);
    });
  }
}

module.exports = LiveStreaming;
