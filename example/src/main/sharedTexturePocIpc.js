const START_CHANNEL = 'SHARED_TEXTURE_POC_START';
const STOP_CHANNEL = 'SHARED_TEXTURE_POC_STOP';

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
  return {
    appId: config.appId,
    channelId: config.channelId,
    token: config.token || '',
    uid: config.uid,
  };
}

function registerSharedTexturePocIpc({ ipcMain, controller }) {
  ipcMain.handle(START_CHANNEL, async (_event, config) => {
    await controller.start(validateConfig(config));
    return { state: controller.state };
  });
  ipcMain.handle(STOP_CHANNEL, async () => {
    await controller.stop();
    return { state: controller.state };
  });

  return () => {
    ipcMain.removeHandler(START_CHANNEL);
    ipcMain.removeHandler(STOP_CHANNEL);
  };
}

module.exports = {
  START_CHANNEL,
  STOP_CHANNEL,
  registerSharedTexturePocIpc,
  validateConfig,
};
