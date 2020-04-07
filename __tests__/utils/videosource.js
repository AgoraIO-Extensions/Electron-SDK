
class VideoSource {
  constructor(localRtcEngine, appid) {
    this.ns = 'agoratest';
    this.appid = appid
    this.localRtcEngine = localRtcEngine;
  }

  join(channel, uid) {
    return new Promise(resolve => {
      let rtcEngine = this.localRtcEngine;
      rtcEngine.on('joinedChannel', (channel, uid, elapsed) => {
    
        //start video source
        rtcEngine.videoSourceInitialize(this.appid)
        rtcEngine.videoSourceSetChannelProfile(1);
        rtcEngine.videoSourceJoin(null, channel, "", 1)
        rtcEngine.on('videosourcejoinedsuccess', () => {
          //find a display
          let displays = rtcEngine.getScreenDisplaysInfo()

          if(displays.length === 0) {
            console.log(`no display found`)
            return resolve()
          }
    
          // start screenshare
          rtcEngine.videoSourceSetVideoProfile(43, false);
          rtcEngine.videoSourceStartScreenCaptureByScreen(displays[0].displayId, {
            x: 0, y: 0, width: 0, height: 0
          }, {
            width: 0, height: 0, frameRate: 5, bitrate: 0
          })
          rtcEngine.startScreenCapturePreview()
          resolve()
        })
      })
      
      // set channel profile, 0: video call, 1: live broadcasting
      rtcEngine.setChannelProfile(1)
      rtcEngine.setClientRole(1)
      
      // enable video, call disableVideo() is you don't need video at all
      rtcEngine.enableVideo()
      
      // join channel to rock!
      rtcEngine.joinChannel(null, channel, '', uid);
    });
  }
}

module.exports = VideoSource;
