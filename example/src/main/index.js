import path from 'path';
import { format as formatUrl } from 'url';

require('agora-electron-sdk/js/Private/ipc/main');
import { BrowserWindow, app, ipcMain, systemPreferences } from 'electron';

const isDevelopment = process.env.NODE_ENV !== 'production';
app.allowRendererProcessReuse = false;

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

function createMainWindow() {
  const window = new BrowserWindow({
    width: 1024,
    height: 728,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  window.webContents.openDevTools({
    mode: 'detach',
    activate: true,
  });

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      })
    );
  }

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.once('did-finish-load', async () => {
    ipcMain.handle('IPC_REQUEST_PERMISSION_HANDLER', async (event, arg) => {
      if (
        systemPreferences.getMediaAccessStatus(arg.type) === 'not-determined'
      ) {
        console.log('main process request handler:' + JSON.stringify(arg));
        return await systemPreferences.askForMediaAccess(arg.type);
      }
    });
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
});

// app.whenReady().then(() => {
//   const gpu = new BrowserWindow({
//     show: false,
//     webPreferences: { offscreen: true },
//   });
//   gpu.loadURL('chrome://gpu');
//   // gpu.webContents.on('did-finish-load', () => {
//   let executeJavaScriptText =
//     `` +
//     `let videoAccelerationInfo = [];` +
//     `let nodeList = document.querySelector('info-view')?.shadowRoot?.querySelector('#video-acceleration-info info-view-table')?.shadowRoot?.querySelectorAll('#info-view-table info-view-table-row') || [];` +
//     `for (node of nodeList) {` +
//     `  videoAccelerationInfo.push({` +
//     `     title: node.shadowRoot.querySelector('#title')?.innerText,` +
//     `     value: node.shadowRoot.querySelector('#value')?.innerText,` +
//     ` })` +
//     `}` +
//     `JSON.stringify(videoAccelerationInfo)`;
//   gpu.webContents
//     .executeJavaScript(executeJavaScriptText)
//     .then((result) => {
//       if (!result) {
//         return;
//       }
//       let filterResult = JSON.parse(result).filter((item) => {
//         return item.title.indexOf('Decode') !== -1;
//       });
//       console.log(filterResult);
//       gpu.close();
//     })
//     .catch((error) => {
//       console.log(error);
//     });
//   // });
// });
