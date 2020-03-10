const doJoin = (rtcChannel) => {
  return new Promise((resolve, reject) => {
    rtcChannel.on('joinChannelSuccess', () => {
      resolve();
    });
    rtcChannel.on('channelError', err => {
      reject(err);
    });
    // SetTimeout(() => {
    //   reject('timeout')
    // }, 5000)
    rtcChannel.joinChannel(null, '', Number(`${new Date().getTime()}`.slice(7)));
  });
};
module.exports = doJoin;
