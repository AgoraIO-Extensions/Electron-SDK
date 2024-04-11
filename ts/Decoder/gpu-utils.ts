import { BrowserWindow } from 'electron';

/**
 * @ignore
 */
export const getGpuInfoInternal = () => {
  const gpuPage = new BrowserWindow({
    show: false,
    webPreferences: { offscreen: true },
  });
  gpuPage.loadURL('chrome://gpu');
  gpuPage.webContents.on('did-finish-load', () => {
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
          return;
        }
        let filterResult = JSON.parse(result).filter((item: any) => {
          return item.title.indexOf('Decode') !== -1;
        });
        console.log(filterResult);
      })
      .catch((error: any) => {});
  });
};
