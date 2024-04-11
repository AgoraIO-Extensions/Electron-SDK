import { ipcMain } from 'electron';

import { getGpuInfoInternal } from '../../Decoder/gpu-utils';

import { IPCMessageType } from '../../Types';

if (process.type === 'browser') {
  ipcMain.handleOnce(IPCMessageType.AGORA_IPC_GET_GPU_INFO, () => {
    return new Promise((resolve) => {
      getGpuInfoInternal((result) => {
        resolve(result);
      });
    });
  });
}
