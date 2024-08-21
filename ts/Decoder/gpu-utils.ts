//@ts-ignore
import { BrowserWindow } from 'electron';

/**
 * @ignore
 */

export type VideoDecodeAcceleratorSupportedProfile = {
  codec: string;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
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
  if (typeof window === 'undefined') {
    console.error('getGpuInfoInternal should be called in main process');
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
        console.error(
          'Failed to get GPU info, chrome://gpu is not available in this environment.'
        );
      }
      let filterResult: { title: string; value: string }[] = JSON.parse(
        result
      ).filter((item: any) => {
        return item.title.indexOf('Decode') !== -1;
      });
      let convertResult: VideoDecodeAcceleratorSupportedProfile[] = [];
      const resolutionPattern = /(\d+)x(\d+) to (\d+)x(\d+)/;
      for (const profile of filterResult) {
        const match = profile.value.match(resolutionPattern);
        if (!match) {
          continue;
        }

        const [_resolution, minWidth, minHeight, maxWidth, maxHeight] = match;

        convertResult.push({
          codec: profile.title,
          minWidth: minWidth ? Number(minWidth) : 0,
          maxWidth: maxWidth ? Number(maxWidth) : 0,
          minHeight: minHeight ? Number(minHeight) : 0,
          maxHeight: maxHeight ? Number(maxHeight) : 0,
        });
      }
      typeof callback === 'function' && callback(convertResult);
    })
    .catch((error: any) => {
      console.error(
        'Failed to get GPU info, please import agora-electron-sdk in main process',
        error
      );
      typeof callback === 'function' && callback(error);
    })
    .finally(() => {
      gpuPage.close();
    });
};
