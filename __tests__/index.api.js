const AgoraRtcEngine = require('../js/AgoraSdk');
const generateRandomString = require('./utils/index.js').generateRandomString;
const generateRandomNumber = require('./utils/index.js').generateRandomNumber;

const rtcEngine = new AgoraRtcEngine();

describe('Basic API Coverage', () => {
  beforeAll(() => {
    rtcEngine.initialize('***REMOVED***');
  });
  afterAll(() => setTimeout(() => process.exit(), 1000));

  it('Get version', () => {
    expect(rtcEngine.getVersion()).toHaveProperty('version');
    expect(rtcEngine.getVersion()).toHaveProperty('build');
  });

  // It('Get error description by code', () => {
  //   expect(rtcEngine.getErrorDescription(2)).toBeDefined()
  // })

  it('Set Channel Profile', () => {
    expect(rtcEngine.setChannelProfile(0)).toBe(0);
    expect(rtcEngine.setChannelProfile(4) < 0).toBeTruthy();
    // Expect(rtcEngine.setChannelProfile('0')).toBeDefined()
  });

  it('Set Client Role in live broadcasting mode', () => {
    rtcEngine.setChannelProfile(1);
    expect(rtcEngine.setClientRole(1)).toBe(0);
    expect(rtcEngine.setClientRole(2)).toBe(0);
    expect(rtcEngine.setClientRole(3) < 0).toBeTruthy();
  });

  it('Set Audio Profile', () => {
    expect(
      rtcEngine.setAudioProfile(generateRandomNumber(5.9), generateRandomNumber(5.9))
    ).toBe(0);
    expect(rtcEngine.setAudioProfile(6, 6) < 0).toBeTruthy();
  });

  it(
    'Join channel and event:joinnedchannel',
    async () => {
      const doJoin = require('./utils/doJoin');
      await doJoin(rtcEngine)
        .then(() => {
          expect();
        })
        .catch(err => {
          console.error(err);
          expect(2).toBe(1);
        });
    },
    6000
  );
});
