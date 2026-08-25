const { validateConfig } = require('./sharedTexturePocIpc');

const START_CHANNEL = 'SHARED_TEXTURE_RENDERER_POC_START';
const STOP_CHANNEL = 'SHARED_TEXTURE_RENDERER_POC_STOP';
const STATUS_CHANNEL = 'SHARED_TEXTURE_RENDERER_POC_STATUS';
const FRAME_CHANNEL = 'SHARED_TEXTURE_RENDERER_POC_FRAME';
const FRAME_RESULT_CHANNEL = 'SHARED_TEXTURE_RENDERER_POC_FRAME_RESULT';
const STATS_CHANNEL = 'SHARED_TEXTURE_RENDERER_POC_STATS';

function registerSharedTextureRendererPocIpc({
  ipcMain,
  controller,
  prepareFrame = (frame) => frame,
  releaseFrame = () => {},
}) {
  const pendingFrames = new Map();
  let owner = null;
  let disposeStatusListener = null;
  let ownerDestroyedListener = null;

  const rejectPendingFrames = (message) => {
    for (const pending of pendingFrames.values()) {
      releaseFrame(pending.frame);
      pending.reject(new Error(message));
    }
    pendingFrames.clear();
  };

  const cancelPendingFrames = () => {
    for (const pending of pendingFrames.values()) {
      releaseFrame(pending.frame);
      pending.resolve({ cancelled: true });
    }
    pendingFrames.clear();
  };

  const clearOwner = () => {
    disposeStatusListener?.();
    disposeStatusListener = null;
    if (owner && ownerDestroyedListener) {
      owner.removeListener?.('destroyed', ownerDestroyedListener);
    }
    owner = null;
    ownerDestroyedListener = null;
  };

  const submitFrame = (frame) =>
    new Promise((resolve, reject) => {
      if (!owner || owner.isDestroyed?.()) {
        reject(new Error('Renderer Engine owner is unavailable'));
        return;
      }
      let preparedFrame;
      try {
        preparedFrame = prepareFrame(frame);
      } catch (error) {
        reject(error);
        return;
      }
      pendingFrames.set(frame.frameId, {
        frame: preparedFrame,
        resolve,
        reject,
      });
      try {
        owner.send(FRAME_CHANNEL, preparedFrame);
      } catch (error) {
        pendingFrames.delete(frame.frameId);
        releaseFrame(preparedFrame);
        reject(error);
      }
    });

  const handleFrameResult = (event, result) => {
    if (event.sender !== owner || !Number.isSafeInteger(result?.frameId)) {
      return;
    }
    const pending = pendingFrames.get(result.frameId);
    if (!pending) return;
    pendingFrames.delete(result.frameId);
    releaseFrame(pending.frame);
    if (result.error) pending.reject(new Error(result.error));
    else {
      controller.recordRendererRtcTimestamp(result.rtcTimestampMs);
      pending.resolve(result.result);
    }
  };

  const handleStats = (event, update) => {
    if (event.sender !== owner || !update || typeof update !== 'object') return;
    if (update.type === 'rtc') controller.recordRendererRtcStats(update.stats);
    if (update.type === 'localVideo') {
      controller.recordRendererLocalVideoStats(update.stats);
    }
  };

  ipcMain.on(FRAME_RESULT_CHANNEL, handleFrameResult);
  ipcMain.on(STATS_CHANNEL, handleStats);
  ipcMain.handle(START_CHANNEL, async (event, config) => {
    const validated = validateConfig(config);
    if (controller.state !== 'idle' && controller.state !== 'failed') {
      throw new Error('Shared Texture PoC is busy');
    }
    clearOwner();
    owner = event.sender;
    disposeStatusListener = controller.setStatusListener((snapshot) => {
      if (!owner?.isDestroyed?.()) owner?.send(STATUS_CHANNEL, snapshot);
    });
    ownerDestroyedListener = () => {
      rejectPendingFrames('Renderer Engine owner was destroyed');
      clearOwner();
      void controller.stop();
    };
    owner.once('destroyed', ownerDestroyedListener);
    try {
      await controller.startRendererCapture(validated, submitFrame);
      return { state: controller.state };
    } catch (error) {
      rejectPendingFrames('Renderer Engine capture failed to start');
      clearOwner();
      throw error;
    }
  });
  ipcMain.handle(STOP_CHANNEL, async () => {
    if (!owner) return { state: controller.state };
    await controller.stop();
    cancelPendingFrames();
    clearOwner();
    return { state: controller.state };
  });

  return () => {
    rejectPendingFrames('Renderer Engine IPC disposed');
    clearOwner();
    ipcMain.removeHandler(START_CHANNEL);
    ipcMain.removeHandler(STOP_CHANNEL);
    ipcMain.removeListener(FRAME_RESULT_CHANNEL, handleFrameResult);
    ipcMain.removeListener(STATS_CHANNEL, handleStats);
  };
}

module.exports = {
  FRAME_CHANNEL,
  FRAME_RESULT_CHANNEL,
  START_CHANNEL,
  STATS_CHANNEL,
  STATUS_CHANNEL,
  STOP_CHANNEL,
  registerSharedTextureRendererPocIpc,
};
