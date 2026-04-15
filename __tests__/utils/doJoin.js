const doJoin = (rtcEngine, channel, uid) => {
  return new Promise((resolve, reject) => {
    rtcEngine.setChannelProfile(1);
    rtcEngine.setClientRole(2);
    rtcEngine.setAudioProfile(0, 1);
    rtcEngine.on('joinedchannel', () => {
      resolve();
    });
    rtcEngine.on('error', err => {
      reject(err);
    });
    rtcEngine.joinChannel('', channel, '', uid);
  });
};

const doJoinWithOptions = (rtcEngine, channel, uid, options) => {
  return new Promise((resolve, reject) => {
    rtcEngine.setChannelProfile(1);
    rtcEngine.setClientRole(2);
    rtcEngine.setAudioProfile(0, 1);
    rtcEngine.on('joinedchannel', () => {
      resolve();
    });
    rtcEngine.on('error', err => {
      reject(err);
    });
    rtcEngine.joinChannel('', channel, '', uid, options);
  });
};
module.exports = {doJoin, doJoinWithOptions};
