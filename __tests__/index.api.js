require('./utils/mock')
const AgoraRtcEngine = require('../js/AgoraSdk').default;
const generateRandomNumber = require('./utils/index.js').generateRandomNumber;
const generateRandomString = require('./utils/index.js').generateRandomString;
const doJoin = require('./utils/doJoin');
const doLeave = require('./utils/doLeave');
const LiveStreaming = require('./utils/cdn');
const MultiStream = require('./utils/multistream');

let localRtcEngine = null;
let multistream = null;
let streaming = null;
let testChannel = null;
let testUid = null;

describe('Basic API Coverage', () => {
  beforeAll(() => {
    localRtcEngine = new AgoraRtcEngine();
    localRtcEngine.setLogFile('/')
    localRtcEngine.initialize('aab8b8f5a8cd4469a63042fcfafe7063');
  });
  afterEach(() => {
    // Restore mocks after each test
    jest.restoreAllMocks();
  });

  it('Get version', () => {
    expect(localRtcEngine.getVersion()).toHaveProperty('version');
    expect(localRtcEngine.getVersion()).toHaveProperty('build');
  });

  // It('Get error description by code', () => {
  //   expect(localRtcEngine.getErrorDescription(2)).toBeDefined()
  // })

  it('Set Channel Profile', () => {
    expect(localRtcEngine.setChannelProfile(0)).toBe(0);
    expect(localRtcEngine.setChannelProfile(4) < 0).toBeTruthy();
    // Expect(localRtcEngine.setChannelProfile('0')).toBeDefined()
  });

  it('Set Client Role in live broadcasting mode', () => {
    localRtcEngine.setChannelProfile(1);
    expect(localRtcEngine.setClientRole(1)).toBe(0);
    expect(localRtcEngine.setClientRole(2)).toBe(0);
    expect(localRtcEngine.setClientRole(3) < 0).toBeTruthy();
  });

  it('Set Audio Profile', () => {
    expect(
      localRtcEngine.setAudioProfile(generateRandomNumber(5.9), generateRandomNumber(5.9))
    ).toBe(0);
    expect(localRtcEngine.setAudioProfile(20, 20) < 0).toBeTruthy();
  });

  it('Set Video Encoding Configs', () => {
    expect(
      localRtcEngine.setVideoEncoderConfiguration({
        width: 640,
        height: 360
      })
    ).toBe(0);
  });

  it('Set Default Mute All Remote Audio Streams', () => {
    expect(localRtcEngine.setDefaultMuteAllRemoteAudioStreams(true)).toBe(0);
    expect(localRtcEngine.setDefaultMuteAllRemoteAudioStreams(false)).toBe(0);
  });

  it('Set Default Mute All Remote Video Streams', () => {
    expect(localRtcEngine.setDefaultMuteAllRemoteVideoStreams(true)).toBe(0);
    expect(localRtcEngine.setDefaultMuteAllRemoteVideoStreams(false)).toBe(0);
  });

  it('Enable/Disable Video', () => {
    expect(localRtcEngine.disableVideo() <= 0).toBeTruthy();
    expect(localRtcEngine.enableVideo() <= 0).toBeTruthy();
  });

  it('Join channel', async () => {
    localRtcEngine.setChannelProfile(1);
    localRtcEngine.setClientRole(1);
    testChannel = generateRandomString(10);
    testUid = generateRandomNumber(100000);
    await doJoin(localRtcEngine, testChannel, testUid);
  });

  it('leave channel', async () => {
    await doLeave(localRtcEngine);
  });
});

describe('cdn coverage', () => {
  beforeAll(() => {
    localRtcEngine = new AgoraRtcEngine();
    localRtcEngine.initialize('aab8b8f5a8cd4469a63042fcfafe7063');
  });
  beforeEach(() => {
    // Restore mocks after each test
    jest.restoreAllMocks();
  });

  it('Join channel', async () => {
    streaming = new LiveStreaming(localRtcEngine);
    testChannel = generateRandomString(10);
    testUid = generateRandomNumber(100000);
    await streaming.join(testChannel, testUid);
  });

  it('publish cdn', async () => {
    await streaming.publish();
  });

  it('unpublish cdn', async () => {
    await streaming.unpublish();
  });
});

describe('Basic API Coverage 2', () => {
  beforeAll(() => {
    localRtcEngine = new AgoraRtcEngine();
    localRtcEngine.initialize('aab8b8f5a8cd4469a63042fcfafe7063');
  });
  afterEach(() => {
    // Restore mocks after each test
    jest.restoreAllMocks();
  });

  it('Enable/Disable videosource dualstream', () => {
    expect(localRtcEngine.videoSourceEnableDualStreamMode(true) <= 0).toBeTruthy();
  });

  // it('set videosource log file', () => {
  //   const filepath = path.join(__dirname, './videosource.log');
  //   expect(localRtcEngine.videoSourceSetLogFile(filepath) <= 0).toBeTruthy();
  // });

  it('get share windows', () => {
    const winIds = localRtcEngine.getScreenWindowsInfo();
    expect(winIds.length > 0).toBeTruthy();
  });
});

// describe('Basic API Coverage 3', () => {
//   beforeEach(() => {
//     localRtcEngine = new AgoraRtcEngine();
//     localRtcEngine.initialize('aab8b8f5a8cd4469a63042fcfafe7063');
//     localRtcEngine.setLogFile(path.resolve(__dirname, "../test.log"))
//   });
//   afterEach(() => {
//     // Restore mocks after each test
//     jest.restoreAllMocks();
//     localRtcEngine.release()
//   });
// });

// describe.skip('Render coverage', () => {
//   beforeAll(() => {
//     localRtcEngine = new AgoraRtcEngine();
//     localRtcEngine.initialize('aab8b8f5a8cd4469a63042fcfafe7063');
//   });
//   beforeEach(() => {
//     // Restore mocks after each test
//     jest.restoreAllMocks();
//     localRtcEngine.release();
//   });

//   it('Preview test', done => {
//     console.log("preview")
//     jest.spyOn(localRtcEngine, 'onRegisterDeliverFrame').mockImplementation(infos => {
//       console.log(`infos: ${JSON.stringify(infos.length)}`);
//       for (let i = 0; i < infos.length; i++) {
//         let info = infos[i];
//         expect(info.uid).toBe(0);
//         // Console.log(`uid: ${info.uid}, ydata: ${info.ydata.length}, udata: ${info.udata.length}, vdata: ${info.vdata.length}`);
//       }
//       expect(localRtcEngine.stopPreview()).toBe(0);
//       done();
//     });
//     // Ignore render functions
//     jest.spyOn(localRtcEngine, 'initRender').mockImplementation(() => {});
//     localRtcEngine.setChannelProfile(1);
//     localRtcEngine.setClientRole(1);
//     localRtcEngine.setupLocalVideo();
//     localRtcEngine.setAudioProfile(0, 1);
//     localRtcEngine.enableVideo();
//     localRtcEngine.enableLocalVideo(true);
//     localRtcEngine.setVideoProfile(33, false);
//     expect(localRtcEngine.startPreview()).toBe(0);
//   });
// });

// const isMac = process.platform === 'darwin';
// const MultiStreamTests = () => {
//   beforeAll(() => {
//     localRtcEngine = new AgoraRtcEngine();
//     localRtcEngine.initialize('aab8b8f5a8cd4469a63042fcfafe7063');
//     multistream = new MultiStream(localRtcEngine, 'basic-coverage');
//   });
//   afterAll(done => {
//     multistream.stopRemote(done);
//   });
//   afterEach(() => {
//     // Restore mocks after each test
//   });

//   it('Prepare remote', async () => {
//     console.log(`preparing remote...`);
//     let uid = generateRandomNumber(100000);
//     await multistream.initRemoteStream(uid);
//   });

//   it('Local join', async () => {
//     let uid = generateRandomNumber(100000);
//     console.log(`local uid ${uid}`);

//     // Wait remote stream to join channel first
//     multistream.initLocalEngine();
//     await multistream.localJoinChannel(uid);
//   }, 10000);

//   it('Prepare videosource share', async () => {
//     await multistream.prepareScreenShare();
//   });

//   it('start videosource share', async () => {
//     await multistream.startShare();
//   });

//   it('Local leave', async () => {
//     multistream.stopShare();
//     await multistream.leaveLocal();
//   });
// };

// if (isMac) {
//   describe.skip('Multi-stream coverage', MultiStreamTests);
// } else {
//   describe.skip('Multi-stream coverage', MultiStreamTests);
// }
