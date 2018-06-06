const AgoraRtcEngine = require('../js/AgoraSdk')
const generateRandomString = require('./utils/index.js').generateRandomString
const generateRandomNumber = require('./utils/index.js').generateRandomNumber

const rtcEngine = new AgoraRtcEngine()

describe('Basic API Coverage', () => {
  beforeAll(() => {
    rtcEngine.initialize('aab8b8f5a8cd4469a63042fcfafe7063')
  })
  afterAll(() => setTimeout(() => process.exit(), 1000))

  it('Get version', () => {
    expect(rtcEngine.getVersion()).toHaveProperty('version')
    expect(rtcEngine.getVersion()).toHaveProperty('build')
  })

  // it('Get error description by code', () => {
  //   console.log(rtcEngine.getErrorDescription(0))
  //   expect(rtcEngine.getErrorDescription(0)).toBeDefined()
  // })

  // it('Join channel', async () => {
  //   const joinHandler = jest.fn();
  //   const promise = new Promise((resolve, reject) => {
  //     rtcEngine.on('joinchannel', (res) => {
  //       console.log('aa')
  //       resolve(res)
  //     })
  //     rtcEngine.on('error', (err) => {
  //       reject(err)
  //     })
  //     setTimeout(() => {
  //       reject('timeout')
  //     }, 9000)
  //     rtcEngine.joinChannel('', generateRandomString(10), '', generateRandomNumber(100000))
  //   })
    
  //   return promise.then(() => {
  //     expect(joinHandler).toBeCalled()
  //   }).catch(err => {
  //     console.error(err)
  //     expect(err).toBeDefined()
  //   })
  // }, 10000)


})