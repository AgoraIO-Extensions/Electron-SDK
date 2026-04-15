const doLeave = rtcEngine => {
  return new Promise((resolve, reject) => {
    rtcEngine.on('leavechannel', (stats) => {
      if(!stats){
        return reject(new Error(`rtc stats missing`))
      }
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
