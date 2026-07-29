(global as any).window = {
  localStorage: { getItem: jest.fn(() => 'configured-app-id') },
};

export {};

const Config = require('../../../config/agora.config').default;
const {
  initialSharedTexturePocConfig,
  startSharedTexturePoc,
} = require('./sharedTexturePocModel');

test('uses the existing App ID, channel, token, and UID configuration', () => {
  expect(initialSharedTexturePocConfig).toEqual({
    appId: Config.appId,
    channelId: Config.channelId,
    token: Config.token,
    uid: Config.uid,
  });
});

test('passes the configuration unchanged to main process', async () => {
  const invoke = jest.fn().mockResolvedValue({ state: 'running' });
  await startSharedTexturePoc(invoke, initialSharedTexturePocConfig);
  expect(invoke).toHaveBeenCalledWith(
    'SHARED_TEXTURE_POC_START',
    initialSharedTexturePocConfig
  );
});
