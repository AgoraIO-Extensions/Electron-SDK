const doLeave = rtcEngine => {
  return new Promise((resolve, reject) => {
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
};
module.exports = doLeave;
