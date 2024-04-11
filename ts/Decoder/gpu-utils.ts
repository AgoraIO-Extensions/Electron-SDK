//@ts-ignore
import { BrowserWindow } from 'electron';

import { logError } from '../Utils';

/**
 * @ignore
 */

export type VideoDecodeAcceleratorSupportedProfile = {
  title: string;
  value: string;
};

/**
 * @ignore
 */
export class GpuInfo {
  videoDecodeAcceleratorSupportedProfile: VideoDecodeAcceleratorSupportedProfile[] =
    [];
}

/**
 * @ignore
 */
export const getGpuInfoInternal = (callback: any): void => {
  //@ts-ignore
  if (process.type !== 'browser') {
    logError('getGpuInfoInternal should be called in main process');
    return;
  }
  const gpuPage = new BrowserWindow({
    show: false,
    webPreferences: { offscreen: true },
  });
  gpuPage.loadURL('chrome://gpu');
  let executeJavaScriptText =
    `` +
    `let videoAccelerationInfo = [];` +
    `let nodeList = document.querySelector('info-view')?.shadowRoot?.querySelector('#video-acceleration-info info-view-table')?.shadowRoot?.querySelectorAll('#info-view-table info-view-table-row') || [];` +
    `for (node of nodeList) {` +
    `  videoAccelerationInfo.push({` +
    `     title: node.shadowRoot.querySelector('#title')?.innerText,` +
    `     value: node.shadowRoot.querySelector('#value')?.innerText,` +
    ` })` +
    `}` +
    `JSON.stringify(videoAccelerationInfo)`;
  gpuPage.webContents
    .executeJavaScript(executeJavaScriptText)
    .then((result: string) => {
      if (!result) {
        logError(
          'Failed to get GPU info, chrome://gpu is not available in this environment.'
        );
      }
      let filterResult: VideoDecodeAcceleratorSupportedProfile[] = JSON.parse(
        result
      ).filter((item: any) => {
        return item.title.indexOf('Decode') !== -1;
      });
      typeof callback === 'function' && callback(filterResult);
    })
    .catch((error: any) => {
      logError(
        'Failed to get GPU info, please import agora-electron-sdk in main process',
        error
      );
      typeof callback === 'function' && callback(error);
    })
    .finally(() => {
      gpuPage.close();
    });
};
