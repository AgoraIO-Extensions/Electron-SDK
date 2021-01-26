const UploadLogFile = (rtcEngine) => {
  return new Promise((resolve, reject) => {
    let reqId;
    rtcEngine.on('uploadLogResult', (requestId, success, reason) => {
      console.log(`uploadLogResult ${requestId} ${success} ${reason}`)
      if(reqId === requestId) {
        success ? resolve() : reject(reason)
      }
    });
    reqId = rtcEngine.uploadLogFile()
    if(!reqId) {
      reject("invalid response")
    }
  });
};
module.exports = {UploadLogFile};
