(global as any).window = {
  localStorage: { getItem: jest.fn(() => 'configured-app-id') },
};

export {};

const Config = require('../../../config/agora.config').default;
const {
  createSharedTexturePocConfig,
  getInitialSharedTextureChannel,
  shouldStopOnUnmount,
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
  });
});

test('maps join and leave to the existing main-process IPC channels', async () => {
  const invoke = jest.fn().mockResolvedValue({ state: 'running' });
  const config = createSharedTexturePocConfig('temporary-channel');

  await startSharedTexturePoc(invoke, config);
  await stopSharedTexturePoc(invoke);

  expect(invoke).toHaveBeenCalledWith(
    'SHARED_TEXTURE_POC_START',
    config
  );
  expect(invoke).toHaveBeenCalledWith('SHARED_TEXTURE_POC_STOP');
});

test.each(['joining', 'joined', 'leaving'])(
  'requests cleanup when unmounted in %s state',
  (state) => expect(shouldStopOnUnmount(state)).toBe(true)
);

test('does not request cleanup when unmounted idle', () => {
  expect(shouldStopOnUnmount('idle')).toBe(false);
});
