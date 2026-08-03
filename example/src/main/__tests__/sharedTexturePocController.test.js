const { SharedTexturePocController } = require('../sharedTexturePocController');

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
      handle: { ntHandle: Buffer.alloc(8, frameId) },
      codedSize: { width: 640, height: 360 },
      timestamp: frameId * 1000,
      pixelFormat: 'bgra',
    },
    release: jest.fn(),
  };
}

function createHarness(overrides = {}) {
  const join = deferred();
  const submissions = [];
  const statusSnapshots = [];
  const gpuListeners = [];
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
      this.handlers = new Map();
      this.webContentsHandlers = new Map();
      this.webContents = {
        on: jest.fn((event, listener) => {
          this.webContentsHandlers.set(event, listener);
          if (event === 'paint') this.paint = listener;
        }),
        removeListener: jest.fn((event) =>
          this.webContentsHandlers.delete(event)
        ),
        setFrameRate: jest.fn((value) => {
          this.frameRate = value;
        }),
        getFrameRate: jest.fn(() => this.frameRate),
      };
      this.loadFile = overrides.loadFile || jest.fn(() => Promise.resolve());
      this.destroy = jest.fn();
      this.minimize = jest.fn();
      this.on = jest.fn((event, listener) =>
        this.handlers.set(event, listener)
      );
      this.removeListener = jest.fn((event) => this.handlers.delete(event));
      this.emitWindow = (event, ...args) => this.handlers.get(event)?.(...args);
      this.emitWebContents = (event, ...args) =>
        this.webContentsHandlers.get(event)?.(...args);
    }
  }
  const subscribeGpuProcessGone = jest.fn((listener) => {
    gpuListeners.push(listener);
    return jest.fn(() => {
      const index = gpuListeners.indexOf(listener);
      if (index >= 0) gpuListeners.splice(index, 1);
    });
  });
  const controller = new SharedTexturePocController({
    BrowserWindow: FakeBrowserWindow,
    createRtcEngine: () => engine,
    scenePath: '/test/sharedTextureScene.html',
    logger: { error: jest.fn() },
    onStatus: (snapshot) => statusSnapshots.push(snapshot),
    subscribeGpuProcessGone,
    ...overrides,
  });
  return {
    controller,
    engine,
    mediaEngine,
    submissions,
    join,
    statusSnapshots,
    gpuListeners,
    subscribeGpuProcessGone,
  };
}

async function start(harness, overrides = {}) {
  const promise = harness.controller.start({
    appId: 'app',
    channelId: 'channel',
    token: '',
    uid: 42,
    ...overrides,
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
      publishCameraTrack: false,
      publishMicrophoneTrack: false,
      publishCustomVideoTrack: true,
      customVideoTrackId: 1,
      clientRoleType: 1,
    })
  );
  expect(harness.controller.window.options.webPreferences).toEqual({
    offscreen: { useSharedTexture: true },
    backgroundThrottling: false,
  });
  expect(
    harness.controller.window.webContents.setFrameRate
  ).toHaveBeenCalledWith(30);
});

test.each([
  ['hidden', false, false],
  ['visible', true, false],
  ['minimized', true, true],
])(
  'configures the %s capture window at 60 fps',
  async (state, show, minimized) => {
    const harness = createHarness();
    await start(harness, { frameRate: 60, captureWindowState: state });

    expect(harness.controller.window.options.show).toBe(show);
    expect(
      harness.controller.window.webContents.setFrameRate
    ).toHaveBeenCalledWith(60);
    expect(harness.controller.window.minimize).toHaveBeenCalledTimes(
      minimized ? 1 : 0
    );
  }
);

test('records paint, submission, and RTC statistics in status snapshots', async () => {
  let monotonic = 100;
  const harness = createHarness({ monotonicMs: () => monotonic });
  await start(harness);
  const texture = createTexture(1);

  harness.engine.handler.onRtcStats({}, { txVideoKBitRate: 256 });
  harness.engine.handler.onLocalVideoStats(
    {},
    { encodedFrameCount: 10, sentFrameRate: 30 }
  );
  harness.controller.handlePaint(texture);
  monotonic = 107;
  harness.submissions[0].resolve({ frameId: 1, result: 0 });
  await new Promise(setImmediate);

  expect(harness.controller.getTelemetrySnapshot()).toEqual(
    expect.objectContaining({
      paintCount: 1,
      submittedCount: 1,
      lastElectronTimestampUs: 1000,
      rtcTimestamp: 0,
      rtc: {
        encodedFrameCount: 10,
        sentFrameRate: 30,
        txVideoKBitRate: 256,
      },
    })
  );
});

test('maps renderer responsiveness to a degradation reason', async () => {
  const harness = createHarness();
  await start(harness);

  const initialStatusCount = harness.statusSnapshots.length;
  harness.controller.window.emitWindow('unresponsive');
  expect(
    harness.controller.getTelemetrySnapshot().degradationReasons
  ).toContain('renderer-unresponsive');
  expect(harness.statusSnapshots).toHaveLength(initialStatusCount + 1);
  harness.controller.window.emitWindow('unresponsive');
  expect(harness.statusSnapshots).toHaveLength(initialStatusCount + 1);
  harness.controller.window.emitWindow('responsive');
  expect(
    harness.controller.getTelemetrySnapshot().degradationReasons
  ).not.toContain('renderer-unresponsive');
  expect(harness.statusSnapshots).toHaveLength(initialStatusCount + 2);
});

test('clears GPU loss only after a subsequent valid paint', async () => {
  const harness = createHarness();
  await start(harness);
  harness.gpuListeners[0]({ reason: 'crashed' });
  expect(
    harness.controller.getTelemetrySnapshot().degradationReasons
  ).toContain('gpu-process-gone');

  const invalid = { textureInfo: {}, release: jest.fn() };
  harness.controller.handlePaint(invalid);
  expect(
    harness.controller.getTelemetrySnapshot().degradationReasons
  ).toContain('gpu-process-gone');

  const valid = createTexture(1);
  const statusCountBeforeRecovery = harness.statusSnapshots.length;
  harness.controller.handlePaint(valid);
  expect(
    harness.controller.getTelemetrySnapshot().degradationReasons
  ).not.toContain('gpu-process-gone');
  expect(harness.statusSnapshots).toHaveLength(statusCountBeforeRecovery + 1);
  harness.submissions[0].resolve({ result: 0 });
  await new Promise(setImmediate);
});

test('clears WebGL loss only after restoration and a valid paint', async () => {
  const harness = createHarness();
  await start(harness);
  const prefix = 'AGORA_SHARED_TEXTURE_POC_V1 ';
  const diagnostic = (type, contextState) =>
    `${prefix}${JSON.stringify({
      version: 1,
      type,
      sequence: 1,
      requestedFrameRate: 30,
      timeOriginMs: 1000,
      monotonicTimeMs: 100,
      drawIntervalsMs: [],
      contextState,
    })}`;

  harness.controller.window.emitWebContents(
    'console-message',
    {},
    1,
    diagnostic('context-lost', 'lost')
  );
  expect(
    harness.controller.getTelemetrySnapshot().degradationReasons
  ).toContain('webgl-context-lost');
  harness.controller.window.emitWebContents(
    'console-message',
    {},
    1,
    diagnostic('context-restored', 'active')
  );
  expect(
    harness.controller.getTelemetrySnapshot().degradationReasons
  ).toContain('webgl-context-lost');

  const texture = createTexture(1);
  harness.controller.handlePaint(texture);
  expect(
    harness.controller.getTelemetrySnapshot().degradationReasons
  ).not.toContain('webgl-context-lost');
  harness.submissions[0].resolve({ result: 0 });
  await new Promise(setImmediate);
});

test('accepts the Electron details-object console-message signature', async () => {
  const harness = createHarness();
  await start(harness);
  const message = `AGORA_SHARED_TEXTURE_POC_V1 ${JSON.stringify({
    version: 1,
    type: 'stats',
    sequence: 9,
    requestedFrameRate: 30,
    timeOriginMs: 1000,
    monotonicTimeMs: 200,
    drawIntervalsMs: [33],
    contextState: 'active',
  })}`;

  harness.controller.window.emitWebContents('console-message', {}, { message });

  expect(harness.controller.getTelemetrySnapshot().worker.sequence).toBe(9);
});

test('paint watchdog degrades after 500 ms and recovers on valid paint', async () => {
  let monotonic = 0;
  const intervals = new Map();
  const harness = createHarness({
    monotonicMs: () => monotonic,
    setIntervalFn: (callback, delay) => {
      intervals.set(delay, callback);
      return delay;
    },
    clearIntervalFn: (delay) => intervals.delete(delay),
  });
  await start(harness);

  monotonic = 501;
  intervals.get(500)();
  expect(
    harness.controller.getTelemetrySnapshot().degradationReasons
  ).toContain('paint-timeout');
  const texture = createTexture(1);
  harness.controller.handlePaint(texture);
  expect(
    harness.controller.getTelemetrySnapshot().degradationReasons
  ).not.toContain('paint-timeout');
  harness.submissions[0].resolve({ result: 0 });
  await new Promise(setImmediate);
});

test('scene load failure rejects start and cleans RTC resources', async () => {
  const harness = createHarness({
    loadFile: jest.fn(() => Promise.reject(new Error('scene missing'))),
  });
  const starting = harness.controller.start({
    appId: 'app',
    channelId: 'channel',
    token: '',
    uid: 42,
  });
  harness.engine.handler.onJoinChannelSuccess();

  await expect(starting).rejects.toThrow('scene missing');
  expect(harness.engine.leaveChannel).toHaveBeenCalledTimes(1);
  expect(harness.engine.release).toHaveBeenCalledTimes(1);
  expect(harness.controller.state).toBe('idle');
});

test('renderer loss reaches failed state and disposes run listeners', async () => {
  const harness = createHarness();
  await start(harness);

  harness.controller.window.emitWebContents('render-process-gone', {}, {});
  await new Promise(setImmediate);

  expect(harness.controller.state).toBe('failed');
  expect(harness.engine.leaveChannel).toHaveBeenCalledTimes(1);
  expect(harness.engine.release).toHaveBeenCalledTimes(1);
  expect(harness.gpuListeners).toHaveLength(0);
  expect(harness.controller.getTelemetrySnapshot()).toEqual(
    expect.objectContaining({
      health: 'failed',
      failureReason: 'renderer-gone',
    })
  );
});

test('terminal Worker diagnostic uses the renderer failure cleanup path', async () => {
  const harness = createHarness();
  await start(harness);
  const message = `AGORA_SHARED_TEXTURE_POC_V1 ${JSON.stringify({
    version: 1,
    type: 'error',
    sequence: 0,
    requestedFrameRate: 30,
    timeOriginMs: 1000,
    monotonicTimeMs: 100,
    drawIntervalsMs: [],
    contextState: 'failed',
  })}`;

  harness.controller.window.emitWebContents('console-message', {}, 3, message);
  await new Promise(setImmediate);

  expect(harness.controller.state).toBe('failed');
  expect(harness.controller.getTelemetrySnapshot().failureReason).toBe(
    'worker-error'
  );
  expect(harness.engine.release).toHaveBeenCalledTimes(1);
});

test('bounds a never-settling submission drain and releases once', async () => {
  const harness = createHarness({
    setTimeoutFn: (callback) => {
      callback();
      return 1;
    },
    clearTimeoutFn: jest.fn(),
  });
  await start(harness);
  const texture = createTexture(1);
  harness.controller.handlePaint(texture);

  await harness.controller.stop();

  expect(texture.release).toHaveBeenCalledTimes(1);
  expect(harness.controller.getTelemetrySnapshot().drainTimeoutCount).toBe(1);
  expect(harness.controller.state).toBe('idle');
});

test('late settlement from a timed-out generation cannot disturb a restarted run', async () => {
  const harness = createHarness({
    setTimeoutFn: (callback) => {
      callback();
      return 1;
    },
    clearTimeoutFn: jest.fn(),
  });
  await start(harness);
  const oldTexture = createTexture(1);
  harness.controller.handlePaint(oldTexture);
  await harness.controller.stop();

  await start(harness);
  const currentTexture = createTexture(2);
  const pendingTexture = createTexture(3);
  harness.controller.handlePaint(currentTexture);
  harness.controller.handlePaint(pendingTexture);
  expect(harness.submissions).toHaveLength(2);

  harness.submissions[0].resolve({ result: 0 });
  await new Promise(setImmediate);
  expect(harness.submissions).toHaveLength(2);
  expect(currentTexture.release).not.toHaveBeenCalled();

  harness.submissions[1].resolve({ result: 0 });
  await new Promise(setImmediate);
  expect(harness.submissions).toHaveLength(3);
  harness.submissions[2].resolve({ result: 0 });
  await new Promise(setImmediate);
  expect(oldTexture.release).toHaveBeenCalledTimes(1);
  expect(currentTexture.release).toHaveBeenCalledTimes(1);
  expect(pendingTexture.release).toHaveBeenCalledTimes(1);
});

test('submits a shared texture from the Electron paint event', async () => {
  const harness = createHarness();
  await start(harness);
  const texture = createTexture(1);

  harness.controller.window.paint({ texture });

  expect(harness.submissions).toHaveLength(1);
  expect(harness.submissions[0].frame.ntHandle).toEqual(
    texture.textureInfo.handle.ntHandle
  );
  harness.submissions[0].resolve({ frameId: 1, result: 0 });
  await new Promise(setImmediate);
  expect(texture.release).toHaveBeenCalledTimes(1);
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
  expect(harness.submissions[1].frame.ntHandle).toEqual(
    third.textureInfo.handle.ntHandle
  );
  harness.submissions[1].resolve({ frameId: 2, result: 0 });
  await new Promise(setImmediate);
  expect(third.release).toHaveBeenCalledTimes(1);
});

test('submits frames before the join callback and releases failed frames', async () => {
  const harness = createHarness();
  const starting = harness.controller.start({
    appId: 'app',
    channelId: 'channel',
    token: '',
    uid: 42,
  });
  const early = createTexture(1);
  harness.controller.handlePaint(early);
  expect(harness.submissions).toHaveLength(1);
  expect(early.release).not.toHaveBeenCalled();
  harness.submissions[0].resolve({ frameId: 1, result: 0 });
  await new Promise(setImmediate);
  expect(early.release).toHaveBeenCalledTimes(1);
  harness.engine.handler.onJoinChannelSuccess();
  await starting;

  const failed = createTexture(2);
  harness.controller.handlePaint(failed);
  harness.submissions[1].reject(new Error('native failed'));
  await new Promise(setImmediate);
  expect(failed.release).toHaveBeenCalledTimes(1);
});

test('continues with the latest pending frame while join is starting', async () => {
  const harness = createHarness();
  const starting = harness.controller.start({
    appId: 'app',
    channelId: 'channel',
    token: '',
    uid: 42,
  });
  const first = createTexture(1);
  const second = createTexture(2);

  harness.controller.handlePaint(first);
  harness.controller.handlePaint(second);
  expect(harness.submissions).toHaveLength(1);

  harness.submissions[0].resolve({ frameId: 1, result: 0 });
  await new Promise(setImmediate);
  expect(harness.submissions).toHaveLength(2);
  expect(harness.submissions[1].frame.ntHandle).toEqual(
    second.textureInfo.handle.ntHandle
  );

  harness.submissions[1].resolve({ frameId: 2, result: 0 });
  harness.engine.handler.onJoinChannelSuccess();
  await Promise.all([starting, new Promise(setImmediate)]);
  expect(first.release).toHaveBeenCalledTimes(1);
  expect(second.release).toHaveBeenCalledTimes(1);
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
  expect(harness.mediaEngine.setExternalVideoSource).toHaveBeenLastCalledWith(
    false,
    true,
    0
  );
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
  harness.submissions[0].resolve({ frameId: 1, result: 0 });
  const settled = await Promise.race([
    Promise.all([startResult, stopping]),
    new Promise((resolve) => setTimeout(() => resolve('timed out'), 50)),
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
