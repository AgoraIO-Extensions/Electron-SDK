const generateRandomString = require('./index.js').generateRandomString
const generateRandomNumber = require('./index.js').generateRandomNumber

const doJoin = (rtcEngine) => {
  return new Promise((resolve, reject) => {
    rtcEngine.setChannelProfile(1)
    rtcEngine.setClientRole(2)
    rtcEngine.setClientRole(0, 1)
    rtcEngine.on('joinedchannel', () => {
      resolve()
    })
    rtcEngine.on('error', err => {
      reject(err)
    })
    // setTimeout(() => {
    //   reject('timeout')
    // }, 5000)
    rtcEngine.joinChannel('', generateRandomString(10), '', generateRandomNumber(100000))
  })

}
module.exports = doJoin