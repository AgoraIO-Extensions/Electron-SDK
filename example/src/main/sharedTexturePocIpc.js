const START_CHANNEL = 'SHARED_TEXTURE_POC_START';
const STOP_CHANNEL = 'SHARED_TEXTURE_POC_STOP';
const STATUS_CHANNEL = 'SHARED_TEXTURE_POC_STATUS';
const SET_PUSHING_CHANNEL = 'SHARED_TEXTURE_POC_SET_PUSHING';

function validateConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new TypeError('config is required');
  }
  if (typeof config.appId !== 'string' || !config.appId.trim()) {
    throw new TypeError('appId is required');
  }
  if (typeof config.channelId !== 'string' || !config.channelId.trim()) {
    throw new TypeError('channelId is required');
  }
  if (config.token != null && typeof config.token !== 'string') {
    throw new TypeError('token must be a string');
  }
  if (!Number.isInteger(config.uid) || config.uid < 0) {
    throw new TypeError('uid must be a nonnegative integer');
  }
  const frameRate = config.frameRate == null ? 30 : config.frameRate;
  if (![30, 48, 60].includes(frameRate)) {
    throw new TypeError('frameRate must be 30, 48, or 60');
  }
  const captureWindowState = config.captureWindowState || 'hidden';
  if (!['hidden', 'visible', 'minimized'].includes(captureWindowState)) {
    throw new TypeError(
      'captureWindowState must be hidden, visible, or minimized'
    );
  }
  return {
    appId: config.appId,
    channelId: config.channelId,
    token: config.token || '',
    uid: config.uid,
    frameRate,
    captureWindowState,
  };
}

function registerSharedTexturePocIpc({ ipcMain, controller }) {
  let disposeStatusListener = null;
  let statusSender = null;
  let senderDestroyedListener = null;
  const clearStatusListener = () => {
    if (disposeStatusListener) {
      disposeStatusListener();
      disposeStatusListener = null;
    }
    if (statusSender && senderDestroyedListener) {
      statusSender.removeListener?.('destroyed', senderDestroyedListener);
    }
    statusSender = null;
    senderDestroyedListener = null;
  };

  ipcMain.handle(START_CHANNEL, async (event, config) => {
    const validated = validateConfig(config);
    if (controller.state !== 'idle' && controller.state !== 'failed') {
      throw new Error('Shared Texture PoC is busy');
    }
    clearStatusListener();
    const sender = event.sender;
    statusSender = sender;
    disposeStatusListener = controller.setStatusListener((snapshot) => {
      if (!sender.isDestroyed || !sender.isDestroyed()) {
        sender.send(STATUS_CHANNEL, snapshot);
      }
    });
    senderDestroyedListener = clearStatusListener;
    sender.once('destroyed', senderDestroyedListener);
    try {
      await controller.start(validated);
      return { state: controller.state };
    } catch (error) {
      clearStatusListener();
      throw error;
    }
  });
  ipcMain.handle(STOP_CHANNEL, async () => {
    await controller.stop();
    clearStatusListener();
    return { state: controller.state };
  });
  ipcMain.handle(SET_PUSHING_CHANNEL, async (event, pushing) => {
    if (event.sender !== statusSender) {
      throw new Error('Shared Texture PoC owner is unavailable');
    }
    controller.setPushing(pushing);
    return { pushing: controller.pushing };
  });

  return () => {
    clearStatusListener();
    ipcMain.removeHandler(START_CHANNEL);
    ipcMain.removeHandler(STOP_CHANNEL);
    ipcMain.removeHandler(SET_PUSHING_CHANNEL);
  };
}

module.exports = {
  SET_PUSHING_CHANNEL,
  START_CHANNEL,
  STATUS_CHANNEL,
  STOP_CHANNEL,
  registerSharedTexturePocIpc,
  validateConfig,
};
