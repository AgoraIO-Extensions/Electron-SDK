import path from 'path';
import { format as formatUrl } from 'url';

import 'agora-electron-sdk/js/Private/ipc/main.js';
import { createAgoraRtcEngine } from 'agora-electron-sdk';
import { AgoraElectronBridge } from 'agora-electron-sdk/js/Private/internal/IrisApiEngine.js';
import {
  BrowserWindow,
  app,
  dialog,
  ipcMain,
  systemPreferences,
} from 'electron';

import { SharedTexturePocController } from './sharedTexturePocController';
import { registerSharedTexturePocIpc } from './sharedTexturePocIpc';
import { registerSharedTextureRendererPocIpc } from './sharedTextureRendererPocIpc';

const isDevelopment = process.env.NODE_ENV !== 'production';
app.allowRendererProcessReuse = false;

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;
let sharedTexturePocController;
let disposeSharedTexturePocIpc;
let disposeSharedTextureRendererPocIpc;
let sharedTextureShutdownComplete = false;

function getSharedTextureScenePath() {
  return isDevelopment
    ? path.resolve(__dirname, '../../extraResources/sharedTextureScene.html')
    : path.join(
        process.resourcesPath,
        'extraResources',
        'sharedTextureScene.html'
      );
}

function subscribeGpuProcessGone(listener) {
  const handler = (_event, details) => {
    if (details.type === 'GPU') listener(details);
  };
  app.on('child-process-gone', handler);
  return () => app.removeListener('child-process-gone', handler);
}

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

    ipcMain.handle('IPC_SHOW_MESSAGE_BOX', async (event, options) => {
      const result = await dialog.showMessageBox(window, {
        type: options.type || 'info',
        title: options.title || 'message',
        message: options.message || '',
        buttons: options.buttons || ['confirm'],
        defaultId: 0,
        cancelId: 0,
        noLink: true,
      });
      return result;
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
  void sharedTexturePocController?.stop();
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
  sharedTexturePocController = new SharedTexturePocController({
    BrowserWindow,
    createRtcEngine: createAgoraRtcEngine,
    nativeBridge: AgoraElectronBridge,
    scenePath: getSharedTextureScenePath(),
    subscribeGpuProcessGone,
  });
  disposeSharedTexturePocIpc = registerSharedTexturePocIpc({
    ipcMain,
    controller: sharedTexturePocController,
  });
  disposeSharedTextureRendererPocIpc = registerSharedTextureRendererPocIpc({
    ipcMain,
    controller: sharedTexturePocController,
    prepareFrame: (frame) =>
      process.platform === 'darwin'
        ? {
            ...frame,
            ioSurfaceId: AgoraElectronBridge.CreateSharedIOSurface(
              frame.nativeHandle,
              frame.pixelFormat
            ),
          }
        : frame,
    releaseFrame: (frame) => {
      if (process.platform === 'darwin' && frame.ioSurfaceId) {
        AgoraElectronBridge.ReleaseSharedIOSurface(frame.ioSurfaceId);
      }
    },
  });
  mainWindow = createMainWindow();
});

app.on('before-quit', (event) => {
  if (sharedTextureShutdownComplete) return;
  event.preventDefault();
  disposeSharedTexturePocIpc?.();
  disposeSharedTexturePocIpc = null;
  disposeSharedTextureRendererPocIpc?.();
  disposeSharedTextureRendererPocIpc = null;
  void Promise.resolve(sharedTexturePocController?.stop())
    .catch((error) => console.error('Shared Texture PoC cleanup failed', error))
    .finally(() => {
      sharedTextureShutdownComplete = true;
      app.quit();
    });
});
