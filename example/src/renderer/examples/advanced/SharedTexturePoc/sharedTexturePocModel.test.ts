(global as any).window = {
  localStorage: { getItem: jest.fn(() => 'configured-app-id') },
};

export {};

const Config = require('../../../config/agora.config').default;

const {
  createSharedTexturePocConfig,
  getSharedTexturePocAction,
  getInitialSharedTextureChannel,
  shouldStopOnUnmount,
  subscribeSharedTexturePocStatus,
  startSharedTexturePoc,
  stopSharedTexturePoc,
} = require('./sharedTexturePocModel');

test('reads current Settings values and applies the temporary channel', () => {
  Config.appId = 'saved-app-id';
  Config.channelId = 'saved-channel';
  Config.token = 'saved-token';
  Config.uid = 73;

  expect(getInitialSharedTextureChannel()).toBe('saved-channel');
  expect(createSharedTexturePocConfig('temporary-channel')).toEqual({
    appId: 'saved-app-id',
    channelId: 'temporary-channel',
    token: 'saved-token',
    uid: 73,
    frameRate: 30,
    captureWindowState: 'hidden',
  });
});

test('reads Settings changed after the model was imported', () => {
  Config.appId = 'new-app-id';
  Config.token = 'new-token';
  Config.uid = 99;

  expect(createSharedTexturePocConfig('page-channel')).toEqual({
    appId: 'new-app-id',
    channelId: 'page-channel',
    token: 'new-token',
    uid: 99,
    frameRate: 30,
    captureWindowState: 'hidden',
  });
});

test('includes temporary pacing options without changing Settings', () => {
  expect(createSharedTexturePocConfig('page-channel', 60, 'minimized')).toEqual(
    expect.objectContaining({
      channelId: 'page-channel',
      frameRate: 60,
      captureWindowState: 'minimized',
    })
  );
});

test('subscribes to status and removes the exact listener', () => {
  const ipc = { on: jest.fn(), removeListener: jest.fn() };
  const onStatus = jest.fn();
  const dispose = subscribeSharedTexturePocStatus(ipc, onStatus);
  const listener = ipc.on.mock.calls[0][1];

  expect(ipc.on).toHaveBeenCalledWith(
    'SHARED_TEXTURE_POC_STATUS',
    expect.any(Function)
  );
  listener({}, { health: 'healthy', paintCount: 4 });
  expect(onStatus).toHaveBeenCalledWith({ health: 'healthy', paintCount: 4 });

  dispose();
  expect(ipc.removeListener).toHaveBeenCalledWith(
    'SHARED_TEXTURE_POC_STATUS',
    listener
  );
});

test('maps join and leave to the existing main-process IPC channels', async () => {
  const invoke = jest.fn().mockResolvedValue({ state: 'running' });
  const config = createSharedTexturePocConfig('temporary-channel');

  await startSharedTexturePoc(invoke, config);
  await stopSharedTexturePoc(invoke);

  expect(invoke).toHaveBeenCalledWith('SHARED_TEXTURE_POC_START', config);
  expect(invoke).toHaveBeenCalledWith('SHARED_TEXTURE_POC_STOP');
});

test.each(['joining', 'joined', 'leaving'])(
  'requests cleanup when unmounted in %s state',
  (state) => expect(shouldStopOnUnmount(state)).toBe(true)
);

test('does not request cleanup when unmounted idle', () => {
  expect(shouldStopOnUnmount('idle')).toBe(false);
});

test.each([
  ['idle', 'join Channel', false],
  ['joining', 'join Channel', true],
  ['joined', 'leave Channel', false],
  ['leaving', 'leave Channel', true],
])('presents the standard Advanced action for %s', (state, title, disabled) => {
  expect(getSharedTexturePocAction(state)).toEqual({ title, disabled });
});
