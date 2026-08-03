const { registerSharedTexturePocIpc } = require('../sharedTexturePocIpc');

function createHarness() {
  const handlers = new Map();
  const ipcMain = {
    handle: jest.fn((channel, handler) => handlers.set(channel, handler)),
    removeHandler: jest.fn((channel) => handlers.delete(channel)),
  };
  const controller = {
    state: 'idle',
    setStatusListener: jest.fn((listener) => {
      controller.statusListener = listener;
      return jest.fn(() => {
        controller.statusListener = null;
      });
    }),
    start: jest.fn(async () => {
      if (controller.state !== 'idle') {
        throw new Error('Shared Texture PoC is busy');
      }
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

  const sender = {
    send: jest.fn(),
    once: jest.fn(),
    removeListener: jest.fn(),
  };
  await expect(
    harness.handlers.get('SHARED_TEXTURE_POC_START')({ sender }, config)
  ).resolves.toEqual({ state: 'running' });
  expect(harness.controller.start).toHaveBeenCalledWith({
    ...config,
    frameRate: 30,
    captureWindowState: 'hidden',
  });
});

test('accepts only supported frame rates and capture window states', async () => {
  const harness = createHarness();
  const sender = {
    send: jest.fn(),
    once: jest.fn(),
    removeListener: jest.fn(),
  };
  const config = {
    appId: 'app',
    channelId: 'channel',
    token: '',
    uid: 1,
    frameRate: 60,
    captureWindowState: 'minimized',
  };

  await harness.handlers.get('SHARED_TEXTURE_POC_START')({ sender }, config);
  expect(harness.controller.start).toHaveBeenCalledWith(config);

  await expect(
    harness.handlers.get('SHARED_TEXTURE_POC_START')(
      { sender },
      { ...config, frameRate: 24 }
    )
  ).rejects.toThrow('frameRate');
  await expect(
    harness.handlers.get('SHARED_TEXTURE_POC_START')(
      { sender },
      { ...config, captureWindowState: 'background' }
    )
  ).rejects.toThrow('captureWindowState');
});

test('routes status only to the start sender and clears ownership on stop', async () => {
  const harness = createHarness();
  const destroyedListeners = [];
  const sender = {
    send: jest.fn(),
    removeListener: jest.fn(),
    once: jest.fn((event, listener) =>
      destroyedListeners.push({ event, listener })
    ),
  };
  const config = { appId: 'app', channelId: 'c', token: '', uid: 1 };

  await harness.handlers.get('SHARED_TEXTURE_POC_START')({ sender }, config);
  harness.controller.statusListener({ health: 'healthy', paintCount: 2 });
  expect(sender.send).toHaveBeenCalledWith('SHARED_TEXTURE_POC_STATUS', {
    health: 'healthy',
    paintCount: 2,
  });
  expect(destroyedListeners[0].event).toBe('destroyed');

  await harness.handlers.get('SHARED_TEXTURE_POC_STOP')();
  expect(harness.controller.statusListener).toBeNull();
  expect(sender.removeListener).toHaveBeenCalledWith(
    'destroyed',
    destroyedListeners[0].listener
  );
});

test('clears status ownership when the start sender is destroyed or IPC disposes', async () => {
  const harness = createHarness();
  let destroyed;
  const sender = {
    send: jest.fn(),
    removeListener: jest.fn(),
    once: jest.fn((_event, listener) => {
      destroyed = listener;
    }),
  };
  const config = { appId: 'app', channelId: 'c', token: '', uid: 1 };

  await harness.handlers.get('SHARED_TEXTURE_POC_START')({ sender }, config);
  const firstDispose =
    harness.controller.setStatusListener.mock.results[0].value;
  destroyed();
  expect(firstDispose).toHaveBeenCalledTimes(1);

  harness.controller.state = 'idle';
  await harness.handlers.get('SHARED_TEXTURE_POC_START')({ sender }, config);
  const secondDispose =
    harness.controller.setStatusListener.mock.results[1].value;
  harness.dispose();
  expect(secondDispose).toHaveBeenCalledTimes(1);
});

test('busy start does not replace the active status owner', async () => {
  const harness = createHarness();
  const activeSender = {
    send: jest.fn(),
    once: jest.fn(),
    removeListener: jest.fn(),
  };
  const competingSender = {
    send: jest.fn(),
    once: jest.fn(),
    removeListener: jest.fn(),
  };
  const config = { appId: 'app', channelId: 'c', token: '', uid: 1 };

  await harness.handlers.get('SHARED_TEXTURE_POC_START')(
    { sender: activeSender },
    config
  );
  const activeListener = harness.controller.statusListener;
  await expect(
    harness.handlers.get('SHARED_TEXTURE_POC_START')(
      { sender: competingSender },
      config
    )
  ).rejects.toThrow('busy');

  expect(harness.controller.statusListener).toBe(activeListener);
  harness.controller.statusListener({ health: 'healthy' });
  expect(activeSender.send).toHaveBeenCalledWith('SHARED_TEXTURE_POC_STATUS', {
    health: 'healthy',
  });
  expect(competingSender.send).not.toHaveBeenCalled();
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
