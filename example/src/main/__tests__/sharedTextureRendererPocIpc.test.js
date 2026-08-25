const {
  FRAME_RESULT_CHANNEL,
  FRAME_CHANNEL,
  START_CHANNEL,
  STATS_CHANNEL,
  STATUS_CHANNEL,
  STOP_CHANNEL,
  registerSharedTextureRendererPocIpc,
} = require('../sharedTextureRendererPocIpc');

function createHarness(overrides = {}) {
  const handlers = new Map();
  const listeners = new Map();
  const ipcMain = {
    handle: jest.fn((channel, handler) => handlers.set(channel, handler)),
    on: jest.fn((channel, listener) => listeners.set(channel, listener)),
    removeHandler: jest.fn((channel) => handlers.delete(channel)),
    removeListener: jest.fn((channel) => listeners.delete(channel)),
  };
  const controller = {
    state: 'idle',
    setStatusListener: jest.fn((listener) => {
      controller.statusListener = listener;
      return jest.fn();
    }),
    startRendererCapture: jest.fn(async (_config, submitFrame) => {
      controller.submitFrame = submitFrame;
      controller.state = 'running';
    }),
    stop: jest.fn(async () => {
      controller.state = 'idle';
    }),
    recordRendererRtcTimestamp: jest.fn(),
    recordRendererRtcStats: jest.fn(),
    recordRendererLocalVideoStats: jest.fn(),
  };
  const sender = {
    isDestroyed: jest.fn(() => false),
    once: jest.fn(),
    removeListener: jest.fn(),
    send: jest.fn(),
  };
  const dispose = registerSharedTextureRendererPocIpc({
    ipcMain,
    controller,
    ...overrides,
  });
  return { controller, dispose, handlers, ipcMain, listeners, sender };
}

test('routes frames and RTC statistics to a renderer-owned Engine', async () => {
  const harness = createHarness();
  const config = {
    appId: 'app',
    channelId: 'channel',
    token: '',
    uid: 42,
    frameRate: 48,
    captureWindowState: 'hidden',
  };

  await harness.handlers.get(START_CHANNEL)({ sender: harness.sender }, config);
  expect(harness.controller.startRendererCapture).toHaveBeenCalledWith(
    config,
    expect.any(Function)
  );

  const frame = { frameId: 7, nativeHandle: Buffer.alloc(8) };
  const submitted = harness.controller.submitFrame(frame);
  expect(harness.sender.send).toHaveBeenCalledWith(FRAME_CHANNEL, frame);
  harness.listeners.get(FRAME_RESULT_CHANNEL)(
    { sender: harness.sender },
    { frameId: 7, result: 0, rtcTimestampMs: 4242 }
  );
  await expect(submitted).resolves.toBe(0);
  expect(harness.controller.recordRendererRtcTimestamp).toHaveBeenCalledWith(
    4242
  );

  harness.listeners.get(STATS_CHANNEL)(
    { sender: harness.sender },
    { type: 'rtc', stats: { txVideoKBitRate: 256 } }
  );
  harness.listeners.get(STATS_CHANNEL)(
    { sender: harness.sender },
    { type: 'localVideo', stats: { sentFrameRate: 48 } }
  );
  expect(harness.controller.recordRendererRtcStats).toHaveBeenCalledWith({
    txVideoKBitRate: 256,
  });
  expect(harness.controller.recordRendererLocalVideoStats).toHaveBeenCalledWith(
    { sentFrameRate: 48 }
  );

  harness.controller.statusListener({ state: 'running', paintCount: 3 });
  expect(harness.sender.send).toHaveBeenCalledWith(STATUS_CHANNEL, {
    state: 'running',
    paintCount: 3,
  });
});

test('does not stop an unrelated main-process run without a renderer owner', async () => {
  const harness = createHarness();
  harness.controller.state = 'running';

  await expect(harness.handlers.get(STOP_CHANNEL)()).resolves.toEqual({
    state: 'running',
  });
  expect(harness.controller.stop).not.toHaveBeenCalled();
});

test('prepares a main-process IOSurface before sending it to renderer', async () => {
  const prepareFrame = jest.fn((frame) => ({ ...frame, ioSurfaceId: 77 }));
  const releaseFrame = jest.fn();
  const harness = createHarness({ prepareFrame, releaseFrame });
  await harness.handlers.get(START_CHANNEL)(
    { sender: harness.sender },
    { appId: 'app', channelId: 'channel', token: '', uid: 42 }
  );

  const frame = { frameId: 1, nativeHandle: Buffer.alloc(8) };
  const submitted = harness.controller.submitFrame(frame);
  expect(prepareFrame).toHaveBeenCalledWith(frame);
  expect(harness.sender.send).toHaveBeenCalledWith(
    FRAME_CHANNEL,
    expect.objectContaining({ ioSurfaceId: 77 })
  );
  harness.listeners.get(FRAME_RESULT_CHANNEL)(
    { sender: harness.sender },
    { frameId: 1, result: 0 }
  );
  await submitted;
  expect(releaseFrame).toHaveBeenCalledWith(
    expect.objectContaining({ ioSurfaceId: 77 })
  );
});

test('cancels an in-flight frame without reporting a stop-time failure', async () => {
  const harness = createHarness();
  await harness.handlers.get(START_CHANNEL)(
    { sender: harness.sender },
    { appId: 'app', channelId: 'channel', token: '', uid: 42 }
  );
  const submitted = harness.controller.submitFrame({ frameId: 1 });

  await harness.handlers.get(STOP_CHANNEL)();

  await expect(submitted).resolves.toEqual({ cancelled: true });
  expect(harness.controller.stop).toHaveBeenCalledTimes(1);
  expect(harness.controller.state).toBe('idle');
});

test('removes renderer IPC handlers and listeners', () => {
  const harness = createHarness();
  harness.dispose();

  expect(harness.ipcMain.removeHandler).toHaveBeenCalledWith(START_CHANNEL);
  expect(harness.ipcMain.removeHandler).toHaveBeenCalledWith(STOP_CHANNEL);
  expect(harness.ipcMain.removeListener).toHaveBeenCalledWith(
    FRAME_RESULT_CHANNEL,
    expect.any(Function)
  );
  expect(harness.ipcMain.removeListener).toHaveBeenCalledWith(
    STATS_CHANNEL,
    expect.any(Function)
  );
});
