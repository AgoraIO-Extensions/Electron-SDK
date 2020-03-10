const doLeave = rtcChannel => {
  return new Promise((resolve, reject) => {
    rtcChannel.on('leaveChannel', () => {
      resolve();
    });
    rtcChannel.on('channelError', err => {
      reject(err);
    });
    // SetTimeout(() => {
    //   reject('timeout')
    // }, 5000)
    rtcChannel.leaveChannel();
  });
};
module.exports = doLeave;
