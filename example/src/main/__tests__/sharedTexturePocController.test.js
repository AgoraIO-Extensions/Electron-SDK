const {
  SharedTexturePocController,
} = require('../sharedTexturePocController');

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function createTexture(frameId) {
  return {
    textureInfo: {
      ntHandle: Buffer.alloc(8, frameId),
      codedSize: { width: 640, height: 360 },
      timestamp: frameId * 1000,
      pixelFormat: 'bgra',
    },
    release: jest.fn(),
  };
}

function createHarness() {
  const join = deferred();
  const submissions = [];
  const mediaEngine = {
    setExternalVideoSource: jest.fn(() => 0),
    pushSharedD3D11Texture: jest.fn((frame) => {
      const submission = deferred();
      submissions.push({ frame, ...submission });
      return submission.promise;
    }),
  };
  const engine = {
    initialize: jest.fn(() => 0),
    enableVideo: jest.fn(() => 0),
    getMediaEngine: jest.fn(() => mediaEngine),
    registerEventHandler: jest.fn((handler) => {
      engine.handler = handler;
    }),
    joinChannel: jest.fn(() => 0),
    leaveChannel: jest.fn(() => 0),
    release: jest.fn(),
  };
  class FakeBrowserWindow {
    constructor(options) {
      this.options = options;
      this.webContents = {
        on: jest.fn((event, listener) => {
          if (event === 'paint') this.paint = listener;
        }),
      };
      this.loadFile = jest.fn(() => Promise.resolve());
      this.destroy = jest.fn();
    }
  }
  const controller = new SharedTexturePocController({
    BrowserWindow: FakeBrowserWindow,
    createRtcEngine: () => engine,
    scenePath: '/test/sharedTextureScene.html',
    logger: { error: jest.fn() },
  });
  return { controller, engine, mediaEngine, submissions, join };
}

async function start(harness) {
  const promise = harness.controller.start({
    appId: 'app',
    channelId: 'channel',
    token: '',
    uid: 42,
  });
  harness.engine.handler.onJoinChannelSuccess();
  await promise;
}

test('starts the default external texture source before accepting frames', async () => {
  const harness = createHarness();
  await start(harness);

  expect(harness.engine.initialize).toHaveBeenCalledWith({ appId: 'app' });
  expect(harness.mediaEngine.setExternalVideoSource).toHaveBeenCalledWith(
    true,
    true,
    0
  );
  expect(harness.engine.joinChannel).toHaveBeenCalledWith(
    '',
    'channel',
    42,
    expect.objectContaining({
      publishCameraTrack: true,
      publishCustomVideoTrack: false,
    })
  );
  expect(harness.controller.window.options.webPreferences).toEqual({
    offscreen: { useSharedTexture: true },
    backgroundThrottling: false,
  });
});

test('keeps only the latest pending texture and releases every texture once', async () => {
  const harness = createHarness();
  await start(harness);
  const first = createTexture(1);
  const second = createTexture(2);
  const third = createTexture(3);

  harness.controller.handlePaint(first);
  harness.controller.handlePaint(second);
  harness.controller.handlePaint(third);

  expect(harness.submissions).toHaveLength(1);
  expect(second.release).toHaveBeenCalledTimes(1);
  harness.submissions[0].resolve({ frameId: 1, result: 0 });
  await new Promise(setImmediate);

  expect(first.release).toHaveBeenCalledTimes(1);
  expect(harness.submissions).toHaveLength(2);
  expect(harness.submissions[1].frame.frameId).toBe(2);
  expect(harness.submissions[1].frame.ntHandle).toEqual(third.textureInfo.ntHandle);
  harness.submissions[1].resolve({ frameId: 2, result: 0 });
  await new Promise(setImmediate);
  expect(third.release).toHaveBeenCalledTimes(1);
});

test('releases pre-join and failed native frames', async () => {
  const harness = createHarness();
  const starting = harness.controller.start({
    appId: 'app',
    channelId: 'channel',
    token: '',
    uid: 42,
  });
  const early = createTexture(1);
  harness.controller.handlePaint(early);
  expect(early.release).toHaveBeenCalledTimes(1);
  harness.engine.handler.onJoinChannelSuccess();
  await starting;

  const failed = createTexture(2);
  harness.controller.handlePaint(failed);
  harness.submissions[0].reject(new Error('native failed'));
  await new Promise(setImmediate);
  expect(failed.release).toHaveBeenCalledTimes(1);
});

test('stop releases pending and waits for the in-flight frame', async () => {
  const harness = createHarness();
  await start(harness);
  const first = createTexture(1);
  const pending = createTexture(2);
  harness.controller.handlePaint(first);
  harness.controller.handlePaint(pending);

  const stopping = harness.controller.stop();
  expect(pending.release).toHaveBeenCalledTimes(1);
  expect(harness.engine.release).not.toHaveBeenCalled();
  harness.submissions[0].resolve({ frameId: 1, result: 0 });
  await stopping;

  expect(first.release).toHaveBeenCalledTimes(1);
  expect(harness.engine.leaveChannel).toHaveBeenCalled();
  expect(harness.engine.release).toHaveBeenCalled();
  expect(harness.controller.state).toBe('idle');
});

test('stop cancels a pending join and cleans resources exactly once', async () => {
  const harness = createHarness();
  const texture = createTexture(1);
  const starting = harness.controller.start({
    appId: 'app',
    channelId: 'channel',
    token: '',
    uid: 42,
  });
  const startResult = starting.then(
    () => ({ status: 'fulfilled' }),
    (reason) => ({ status: 'rejected', reason })
  );
  harness.controller.handlePaint(texture);

  const stopping = harness.controller.stop();
  const settled = await Promise.race([
    Promise.all([startResult, stopping]),
    new Promise((resolve) =>
      setTimeout(() => resolve('timed out'), 50)
    ),
  ]);

  expect(settled).not.toBe('timed out');
  expect(settled[0]).toEqual({
    status: 'rejected',
    reason: expect.objectContaining({
      message: 'Shared Texture PoC start cancelled',
    }),
  });
  expect(texture.release).toHaveBeenCalledTimes(1);
  expect(harness.engine.release).toHaveBeenCalledTimes(1);
  expect(harness.controller.window).toBeNull();
  expect(harness.controller.state).toBe('idle');
});
