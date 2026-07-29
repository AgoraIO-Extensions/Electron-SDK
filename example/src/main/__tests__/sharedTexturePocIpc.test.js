const {
  registerSharedTexturePocIpc,
} = require('../sharedTexturePocIpc');

function createHarness() {
  const handlers = new Map();
  const ipcMain = {
    handle: jest.fn((channel, handler) => handlers.set(channel, handler)),
    removeHandler: jest.fn((channel) => handlers.delete(channel)),
  };
  const controller = {
    state: 'idle',
    start: jest.fn(async () => {
      controller.state = 'running';
    }),
    stop: jest.fn(async () => {
      controller.state = 'idle';
    }),
  };
  const dispose = registerSharedTexturePocIpc({ ipcMain, controller });
  return { handlers, ipcMain, controller, dispose };
}

test('starts with App ID, channel, token, and UID from the renderer', async () => {
  const harness = createHarness();
  const config = {
    appId: 'app',
    channelId: 'channel',
    token: 'token',
    uid: 42,
  };

  await expect(
    harness.handlers.get('SHARED_TEXTURE_POC_START')({}, config)
  ).resolves.toEqual({ state: 'running' });
  expect(harness.controller.start).toHaveBeenCalledWith(config);
});

test.each([
  [{ appId: '', channelId: 'channel', token: '', uid: 1 }, 'appId'],
  [{ appId: 'app', channelId: '', token: '', uid: 1 }, 'channelId'],
  [{ appId: 'app', channelId: 'channel', token: '', uid: -1 }, 'uid'],
])('rejects invalid start configuration', async (config, field) => {
  const harness = createHarness();
  await expect(
    harness.handlers.get('SHARED_TEXTURE_POC_START')({}, config)
  ).rejects.toThrow(field);
  expect(harness.controller.start).not.toHaveBeenCalled();
});

test('stops and removes both handlers during teardown', async () => {
  const harness = createHarness();
  await expect(
    harness.handlers.get('SHARED_TEXTURE_POC_STOP')()
  ).resolves.toEqual({ state: 'idle' });
  expect(harness.controller.stop).toHaveBeenCalled();

  harness.dispose();
  expect(harness.ipcMain.removeHandler).toHaveBeenCalledWith(
    'SHARED_TEXTURE_POC_START'
  );
  expect(harness.ipcMain.removeHandler).toHaveBeenCalledWith(
    'SHARED_TEXTURE_POC_STOP'
  );
});
