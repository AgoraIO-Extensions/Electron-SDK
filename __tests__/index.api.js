require('./utils/mock')
const AgoraRtcEngine = require('../js/AgoraSdk').default;
const generateRandomNumber = require('./utils/index.js').generateRandomNumber;
const generateRandomString = require('./utils/index.js').generateRandomString;
const {doJoin, doJoinWithOptions} = require('./utils/doJoin');
const doLeave = require('./utils/doLeave');
const channelJoin = require('./utils/channelJoin')
const channelLeave = require('./utils/channelLeave')
const LiveStreaming = require('./utils/cdn');
const VideoSource = require('./utils/videosource');
const MultiStream = require('./utils/multistream');
const {UploadLogFile} = require('./utils/uploadLog');
const path = require('path')
const fs = require('fs')
// const APPID = process.env.APPID
const APPID = "***REMOVED***"
let localRtcEngine = null;
let localRtcChannel = null;
let multistream = null;
let streaming = null;
let videosource = null;
let testChannel = null;
let testUid = null;


if(!APPID){
  throw new Error('NO APPID FOUND')
}

describe('Basic API Coverage', () => {
  beforeAll(() => {
    localRtcEngine = new AgoraRtcEngine();
    localRtcEngine.setLogFile('/')
    localRtcEngine.initialize(APPID);
  });
  afterEach(() => {
    // Restore mocks after each test
    jest.restoreAllMocks();
  });
  afterAll(() => {
    localRtcEngine.release();
  })

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

  it('Enable/Disable Audio', () => {
    expect(localRtcEngine.disableAudio() == 0).toBeTruthy();
    expect(localRtcEngine.enableAudio() == 0).toBeTruthy();
  });

  it('Enable/Disable Video', () => {
    expect(localRtcEngine.disableVideo() == 0).toBeTruthy();
    expect(localRtcEngine.enableVideo() == 0).toBeTruthy();
  });

  it('enable sournd position indication', () => {
    expect(localRtcEngine.enableSoundPositionIndication() === 0).toBeTruthy();
  });

  it('set remote voice position', () => {
    expect(localRtcEngine.setRemoteVoicePosition(1, 0, 0)).toBe(0);
  });

  it('set remote user priority', () => {
    expect(localRtcEngine.setRemoteUserPriority(1, 1)).toBeLessThan(0);
    expect(localRtcEngine.setRemoteUserPriority(1, 50)).toBe(0);
  });

  it('set capture preference', () => {
    expect(localRtcEngine.setCameraCapturerConfiguration({preference: 1})).toBe(0);
    expect(localRtcEngine.setCameraCapturerConfiguration({preference: 3})).toBe(0);
  });

  it('setEncryptionSecret', () => {
    expect(localRtcEngine.setEncryptionSecret("testtoken")).toBe(0);
  });

  it('setEncryptionMode', () => {
    expect(localRtcEngine.setEncryptionMode("aes-256-xts")).toBe(0);
  });

  it('muteLocalAudioStream', () => {
    expect(localRtcEngine.muteLocalAudioStream(true)).toBe(0);
    expect(localRtcEngine.muteLocalAudioStream(false)).toBe(0);
  });

  it('muteAllRemoteAudioStreams', () => {
    expect(localRtcEngine.muteAllRemoteAudioStreams(true)).toBe(0);
    expect(localRtcEngine.muteAllRemoteAudioStreams(false)).toBe(0);
  });

  it('setDefaultMuteAllRemoteAudioStreams', () => {
    expect(localRtcEngine.setDefaultMuteAllRemoteAudioStreams(true)).toBe(0);
    expect(localRtcEngine.setDefaultMuteAllRemoteAudioStreams(false)).toBe(0);
  });

  it('muteRemoteAudioStream', () => {
    expect(localRtcEngine.muteRemoteAudioStream(12345, true)).toBe(0);
    expect(localRtcEngine.muteRemoteAudioStream(12345, false)).toBe(0);
  });

  it('muteLocalVideoStream', () => {
    expect(localRtcEngine.muteLocalVideoStream(true)).toBe(0);
    expect(localRtcEngine.muteLocalVideoStream(false)).toBe(0);
  });

  it('enableLocalAudio', () => {
    expect(localRtcEngine.enableLocalAudio(false)).toBe(0);
    expect(localRtcEngine.enableLocalAudio(true)).toBe(0);
  });

  it('muteAllRemoteVideoStreams', () => {
    expect(localRtcEngine.muteAllRemoteVideoStreams(false)).toBe(0);
    expect(localRtcEngine.muteAllRemoteVideoStreams(true)).toBe(0);
  });

  it('adjustUserPlaybackSignalVolume', () => {
    expect(localRtcEngine.adjustUserPlaybackSignalVolume(12345, 50)).toBe(0);
  })

  it('Join channel', async () => {
    localRtcEngine.setChannelProfile(1);
    localRtcEngine.setClientRole(1);
    testChannel = generateRandomString(10);
    testUid = generateRandomNumber(100000);
    await doJoin(localRtcEngine, testChannel, testUid);
  });

  it('setBeautyEffectOptions', () => {
    let returnvalue = 0
    expect(
      localRtcEngine.setBeautyEffectOptions(true, {
        lighteningContrastLevel: 1,
        lighteningLevel: 0.5,
        smoothnessLevel: 0.5,
        rednessLevel: 0.5,
        mirrorMode: 0
      })
    ).toBe(returnvalue);
    expect(
      localRtcEngine.setBeautyEffectOptions(false)
    ).toBe(returnvalue);
  });

  it('leave channel', async () => {
    await doLeave(localRtcEngine);
  });

  it('Join channel with options', async () => {
    localRtcEngine.setChannelProfile(1);
    localRtcEngine.setClientRole(1);
    testChannel = generateRandomString(10);
    testUid = generateRandomNumber(100000);
    await doJoinWithOptions(localRtcEngine, testChannel, testUid, {autoSubscribeAudio:true, autoSubscribeVideo:true});
  });

  it('leave channel', async () => {
    await doLeave(localRtcEngine);
  });
});

describe('initialize with context', () => {
  beforeEach(async () => {
    let filePath = path.resolve(__dirname, "../testcontext.log")
    try {
      await fs.unlink(filePath);
    } catch (e) {
      // ignore error as we don't care
    }
    localRtcEngine = new AgoraRtcEngine();
  });
  afterEach(() => {
    // Restore mocks after each test
    jest.restoreAllMocks();
    localRtcEngine.release()
  });

  it("initialize", () => {
    let filePath = path.resolve(__dirname, "../testcontext.log")
    expect(localRtcEngine.initialize(APPID, 0xFFFFFFFF, {logConfig: {filePath}})).toBe(0);
    localRtcEngine.setChannelProfile(1);
    localRtcEngine.setClientRole(1);
    expect(fs.existsSync(filePath)).toBe(true);
  })
})

describe('cdn coverage', () => {
  beforeAll(() => {
    localRtcEngine = new AgoraRtcEngine();
    localRtcEngine.initialize(APPID);
  });
  beforeEach(() => {
    // Restore mocks after each test
    jest.restoreAllMocks();
  });

  afterAll(() => {
    localRtcEngine.release();
  })

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

describe('videosource coverage', () => {
  beforeAll(() => {
    localRtcEngine = new AgoraRtcEngine();
    localRtcEngine.initialize(APPID);
  });
  beforeEach(() => {
    // Restore mocks after each test
    jest.restoreAllMocks();
  });

  afterAll(() => {
    localRtcEngine.release();
  })

  it('share', async () => {
    videosource = new VideoSource(localRtcEngine, APPID);
    testChannel = generateRandomString(10);
    testUid = generateRandomNumber(100000);
    await videosource.join(testChannel, testUid);
  });
});

describe('Basic API Coverage 2', () => {
  beforeAll(() => {
    localRtcEngine = new AgoraRtcEngine();
    localRtcEngine.initialize(APPID);
  });
  afterEach(() => {
    // Restore mocks after each test
    jest.restoreAllMocks();
  });

  afterAll(() => {
    localRtcEngine.release();
  })

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

describe('Basic API Coverage 3', () => {
  beforeEach(async () => {
    localRtcEngine = new AgoraRtcEngine();
    localRtcEngine.initialize(APPID);
    localRtcEngine.setLogFile(path.resolve(__dirname, "../test.log"))

    localRtcEngine.setChannelProfile(1);
    localRtcEngine.setClientRole(1);
    testChannel = generateRandomString(10);
    testUid = generateRandomNumber(100000);
    await doJoin(localRtcEngine, testChannel, testUid);
  });
  afterEach(() => {
    // Restore mocks after each test
    jest.restoreAllMocks();
    localRtcEngine.release()
  });

  it('enableAudioVolumeIndication', () => {
    return new Promise((resolve) => {
      localRtcEngine.on('audioVolumeIndication', () => {
        resolve()
      })
      localRtcEngine.enableAudio()
      expect(
        localRtcEngine.enableAudioVolumeIndication(1000, 3, false)
      ).toBe(0)
    })

  });

  it('local recording', () => {
    expect(localRtcEngine.startAudioRecording(path.resolve(__dirname, '../recording.pcm'), 32000, 1)).toBe(0);
    expect(localRtcEngine.stopAudioRecording()).toBe(0);
  });

  it('watermark', () => {
    expect(localRtcEngine.addVideoWatermark("path", {
      visibleInPreview: true,
      positionInPortraitMode: {
        x: 0, y: 0, width: 0, height: 0
      },
      positionInLandscapeMode: {
        x: 0, y: 0, width: 0, height: 0
      }
    })).toBe(0);
    expect(localRtcEngine.clearVideoWatermarks()).toBe(0);
  })

  it('setCloudProxy', () => {
    expect(localRtcEngine.setCloudProxy(0)).toBe(0);
    expect(localRtcEngine.setCloudProxy(1)).toBe(0);
    expect(localRtcEngine.setCloudProxy(2)).toBe(0);
  })
  
  it('enableDeepLearningDenoise', () => {
    expect(localRtcEngine.enableDeepLearningDenoise(true)).toBe(0);
    expect(localRtcEngine.enableDeepLearningDenoise(false)).toBe(0);
  })

  it('setVoiceBeautifierParameters', () => {
    // expect(localRtcEngine.setVoiceBeautifierParameters(0x01010100, 0, 0)).toBe(0);
  })

  it('uploadLogFile', async () => {
    await UploadLogFile(localRtcEngine)
  })
});


describe('Channel Coverage', () => {
  beforeEach(() => {
    localRtcEngine = new AgoraRtcEngine();
    localRtcEngine.initialize(APPID);
    localRtcEngine.setLogFile(path.resolve(__dirname, "../test.log"))

    localRtcChannel = localRtcEngine.createChannel("test")
  });
  afterEach(() => {
    // Restore mocks after each test
    localRtcChannel.release()
    jest.restoreAllMocks();
    localRtcEngine.release()
  });

  it('get channel id', () => {
    expect(localRtcChannel.channelId()).toBe("test");
  });

  it('get call id', () => {
    expect(localRtcChannel.getCallId() !== null).toBeTruthy();
  });

  it('setClientRole', () => {
    expect(localRtcChannel.setClientRole(1)).toBe(0);
    expect(localRtcChannel.setClientRole(2)).toBe(0);
  });


  it('setRemoteUserPriority', () => {
    expect(localRtcChannel.setRemoteUserPriority(1, 1)).toBe(0);
    expect(localRtcChannel.setRemoteUserPriority(1, 50)).toBe(0);
  });

  it('renewToken', () => {
    expect(localRtcChannel.renewToken("testtoken")).toBe(0);
  });

  it('setEncryptionSecret', () => {
    expect(localRtcChannel.setEncryptionSecret("testtoken")).toBe(0);
  });

  it('setEncryptionMode', () => {
    expect(localRtcChannel.setEncryptionMode("aes-256-xts")).toBe(0);
  });

  it('setRemoteVoicePosition', () => {
    expect(localRtcChannel.setRemoteVoicePosition(12345, 1.0, 50)).toBe(0);
    expect(localRtcChannel.setRemoteVoicePosition(12345, -1.0, 50)).toBe(0);
  });

  it('setDefaultMuteAllRemoteAudioStreams', () => {
    expect(localRtcChannel.setDefaultMuteAllRemoteAudioStreams(true)).toBe(0);
  });

  it('muteAllRemoteAudioStreams', () => {
    expect(localRtcChannel.muteAllRemoteAudioStreams(true)).toBe(0);
  });

  it('muteRemoteAudioStream', () => {
    expect(localRtcChannel.muteRemoteAudioStream(12345, true)).toBe(0);
  });

  it('muteAllRemoteVideoStreams', () => {
    expect(localRtcChannel.muteAllRemoteVideoStreams(true)).toBe(0);
  });

  it('muteRemoteVideoStream', () => {
    expect(localRtcChannel.muteRemoteVideoStream(12345, true)).toBe(0);
  });

  it('setRemoteVideoStreamType', () => {
    expect(localRtcChannel.setRemoteVideoStreamType(12345, 0)).toBe(0);
    expect(localRtcChannel.setRemoteVideoStreamType(12345, 1)).toBe(0);
  });

  it('setRemoteDefaultVideoStreamType', () => {
    expect(localRtcChannel.setRemoteDefaultVideoStreamType(0)).toBe(0);
    expect(localRtcChannel.setRemoteDefaultVideoStreamType(1)).toBe(0);
  });

  it('dataStream', () => {
    let streamId = localRtcChannel.createDataStream(false, false)
    expect(streamId).toBeGreaterThan(0);
    expect(localRtcChannel.sendStreamMessage(streamId, "test")).toBe(0);
  });
});


describe('Channel Coverage', () => {
  beforeAll(() => {
    localRtcEngine = new AgoraRtcEngine();
    localRtcEngine.initialize(APPID);
    localRtcEngine.setLogFile(path.resolve(__dirname, "../test.log"))

    localRtcChannel = localRtcEngine.createChannel("test")
  });
  afterAll(() => {
    // Restore mocks after each test
    localRtcChannel.release()
    jest.restoreAllMocks();
    localRtcEngine.release()
  });

  it('Join channel', async () => {
    localRtcChannel.setClientRole(1)
    await channelJoin(localRtcChannel)
  });

  it('Leave channel', async () => {
    await channelLeave(localRtcChannel)
  });
});

describe.skip('Render coverage', () => {
  beforeAll(() => {
    localRtcEngine = new AgoraRtcEngine();
    localRtcEngine.initialize(APPID);
  });
  beforeEach(() => {
    // Restore mocks after each test
    jest.restoreAllMocks();
    localRtcEngine.release();
  });

  it('Preview test', done => {
    console.log("preview")
    jest.spyOn(localRtcEngine, 'onRegisterDeliverFrame').mockImplementation(infos => {
      console.log(`infos: ${JSON.stringify(infos.length)}`);
      for (let i = 0; i < infos.length; i++) {
        let info = infos[i];
        expect(info.uid).toBe(0);
        // Console.log(`uid: ${info.uid}, ydata: ${info.ydata.length}, udata: ${info.udata.length}, vdata: ${info.vdata.length}`);
      }
      expect(localRtcEngine.stopPreview()).toBe(0);
      done();
    });
    // Ignore render functions
    jest.spyOn(localRtcEngine, 'initRender').mockImplementation(() => {});
    localRtcEngine.setChannelProfile(1);
    localRtcEngine.setClientRole(1);
    localRtcEngine.setupLocalVideo();
    localRtcEngine.setAudioProfile(0, 1);
    localRtcEngine.enableVideo();
    localRtcEngine.enableLocalVideo(true);
    localRtcEngine.setVideoProfile(33, false);
    expect(localRtcEngine.startPreview()).toBe(0);
  });
});

const isMac = process.platform === 'darwin';
const MultiStreamTests = () => {
  beforeAll(() => {
    localRtcEngine = new AgoraRtcEngine();
    localRtcEngine.initialize(APPID);
    multistream = new MultiStream(localRtcEngine, 'basic-coverage');
  });
  afterAll(done => {
    multistream.stopRemote(done);
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
  }, 10000);

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
  describe.skip('Multi-stream coverage', MultiStreamTests);
} else {
  describe.skip('Multi-stream coverage', MultiStreamTests);
}
