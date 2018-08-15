const AgoraRtcEngine = require('../js/AgoraSdk');
const generateRandomString = require('./utils/index.js').generateRandomString;
const generateRandomNumber = require('./utils/index.js').generateRandomNumber;
const doJoin = require('./utils/doJoin');
const doLeave = require('./utils/doLeave');
const MultiStream = require('./utils/multistream');

let localRtcEngine = null;
let multistream = null;

describe('Basic API Coverage', () => {
  beforeAll(() => {
    localRtcEngine = new AgoraRtcEngine();
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
    expect(localRtcEngine.setAudioProfile(6, 6) < 0).toBeTruthy();
  });

  it('Enable/Disable Video', () => {
    expect(localRtcEngine.enableVideo() <= 0).toBeTruthy();
    expect(localRtcEngine.disableVideo() <= 0).toBeTruthy();
  });

  it('Join/Leave channel and event:joinedchannel/leavechannel', async () => {
    await doJoin(localRtcEngine)
      .then(() => {
        doLeave(localRtcEngine)
          .then(() => {
            // Expect(1).toBe(1);
          })
          .catch(err => {
            console.error(err);
            expect(2).toBe(1);
          });
      })
      .catch(err => {
        console.error(err);
        expect(2).toBe(1);
      });
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

  it('get share windows', () => {
    const winIds = localRtcEngine.getShareWindowIds();
    expect(winIds.length > 0).toBeTruthy();
  });
});

describe('Render coverage', () => {
  beforeAll(() => {
    localRtcEngine = new AgoraRtcEngine();
    localRtcEngine.initialize('aab8b8f5a8cd4469a63042fcfafe7063');
  });
  beforeEach(() => {
    // Restore mocks after each test
    jest.restoreAllMocks();
  });

  it('Preview test', () => {
    return new Promise(resolve => {
      jest.spyOn(localRtcEngine, 'onRegisterDeliverFrame').mockImplementation(infos => {
        console.log(`infos: ${JSON.stringify(infos.length)}`);
        for (let i = 0; i < infos.length; i++) {
          let info = infos[i];
          expect(info.uid).toBe(0);
          // Console.log(`uid: ${info.uid}, ydata: ${info.ydata.length}, udata: ${info.udata.length}, vdata: ${info.vdata.length}`);
        }
        expect(localRtcEngine.stopPreview()).toBe(0);
        resolve();
      });
      // Ignore render functions
      jest.spyOn(localRtcEngine, 'initRender').mockImplementation(() => {});
      localRtcEngine.setChannelProfile(1);
      localRtcEngine.setClientRole(1);
      localRtcEngine.setupLocalVideo();
      localRtcEngine.setAudioProfile(0, 1);
      localRtcEngine.setVideoProfile(33, false);
      localRtcEngine.enableVideo();
      localRtcEngine.enableLocalVideo(true);
      expect(localRtcEngine.startPreview()).toBe(0);
    });
  });
});

const isMac = process.platform === 'darwin';
const MultiStreamTests = () => {
  beforeAll(() => {
    localRtcEngine = new AgoraRtcEngine();
    localRtcEngine.initialize('aab8b8f5a8cd4469a63042fcfafe7063');
    multistream = new MultiStream(localRtcEngine, 'basic-coverage');
  });
  afterAll(() => {
    multistream.stopRemote();
  });
  afterEach(() => {
    // Restore mocks after each test
  });

  it('Prepare remote', async () => {
    console.log(`preparing remote...`);
    let uid = generateRandomNumber(100000);
    await multistream.initRemoteStream(uid);
  });

  it('Local join', async () => {
    let uid = generateRandomNumber(100000);
    console.log(`local uid ${uid}`);

    // Wait remote stream to join channel first
    multistream.initLocalEngine();
    await multistream.localJoinChannel(uid);
  });

  it('Prepare videosource share', async () => {
    await multistream.prepareScreenShare();
  });

  it('start videosource share', async () => {
    await multistream.startShare();
  });

  it('Local leave', async () => {
    multistream.stopShare();
    await multistream.leaveLocal();
  });
};

if (isMac) {
  describe('Multi-stream coverage', MultiStreamTests);
} else {
  describe.skip('Multi-stream coverage', MultiStreamTests);
}

describe('Exiting', () => {
  afterAll(() => {
    multistream.stopRemote();
    setTimeout(() => {
      process.exit();
    }, 1000);
  });
  it('Cleanup', async () => {
    expect(1).toBe(1);
  });
});
