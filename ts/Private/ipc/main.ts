//@ts-ignore
import { app, ipcMain } from 'electron';

import { getGpuInfoInternal } from '../../Decoder/gpu-utils';

import { IPCMessageType } from '../../Types';
//@ts-ignore
if (process.type !== 'renderer') {
  ipcMain.handle(IPCMessageType.AGORA_IPC_GET_GPU_INFO, () => {
    return new Promise((resolve) => {
      getGpuInfoInternal((result: any) => {
        resolve(result);
      });
    });
  });
  console.log('[agora-electron] main process AgoraIPCMain handler registered');

  app.on('quit', () => {
    ipcMain.removeHandler(IPCMessageType.AGORA_IPC_GET_GPU_INFO);
    console.log('[agora-electron] main process AgoraIPCMain handler removed');
  });
}
