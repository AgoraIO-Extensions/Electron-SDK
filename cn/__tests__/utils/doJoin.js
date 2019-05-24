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
    // SetTimeout(() => {
    //   reject('timeout')
    // }, 5000)
    rtcEngine.joinChannel('', channel, '', uid);
  });
};
module.exports = doJoin;
