import { app, ipcMain, ipcRenderer } from 'electron';

import { logError } from 'types/Utils';

import { getGpuInfoInternal } from '../../Decoder/gpu-utils';

import { logInfo } from '../../Utils';

export enum IPCMessageType {
  AGORA_IPC_GET_GPU_INFO = 'AGORA_IPC_GET_GPU_INFO',
}

if (process.type === 'browser') {
  ipcMain.handle(IPCMessageType.AGORA_IPC_GET_GPU_INFO, async (event, arg) => {
    getGpuInfoInternal();
  });

  app.on('quit', () => {
    // release resource
    ipcMain.removeHandler(IPCMessageType.AGORA_IPC_GET_GPU_INFO);
  });
} else {
  logInfo('Not in main process, skip ipc registration');
}

export async function ipcSend(
  channel: IPCMessageType,
  ...args: any[]
): Promise<any> {
  if (!Object.values(IPCMessageType).includes(channel)) {
    logError('Invalid IPCMessageType');
    return;
  }
  if (process.type === 'renderer') {
    return await ipcRenderer.invoke(channel, ...args);
  } else {
    logError('Not in renderer process, cannot send ipc message');
  }
}
