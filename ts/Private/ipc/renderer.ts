//@ts-ignore
import { ipcRenderer } from 'electron';

import { IPCMessageType } from '../../Types';
import { logError } from '../../Utils';

export async function ipcSend(
  channel: IPCMessageType,
  ...args: any[]
): Promise<any> {
  if (!Object.values(IPCMessageType).includes(channel)) {
    logError('Invalid IPCMessageType');
    return;
  }
  //@ts-ignore
  if (process.type === 'renderer') {
    return await ipcRenderer.invoke(channel, ...args);
  } else {
    logError('Not in renderer process, cannot send ipc message');
  }
}
