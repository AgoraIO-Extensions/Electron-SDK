import path from 'path';
import { format as formatUrl } from 'url';

import createAgoraRtcEngine, {
  ScreenCaptureSourceType,
} from 'agora-electron-sdk';
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
    // Fix for https://bugs.chromium.org/p/chromium/issues/detail?id=306348
    ipcMain.handle('IPC_AGORA_RTC_INITIALIZE', (_, { appId }) => {
      const engine = createAgoraRtcEngine({ webEnvReady: false });
      const result = engine.initialize({ appId });
      engine.enableVideo();
      engine.addListener(
        'onVideoDeviceStateChanged',
        (deviceId, deviceType, deviceState) => {
          window.webContents.send(
            'IPC_AGORA_RTC_VIDEO_DEVICE_STATE_CHANGED',
            deviceId,
            deviceType,
            deviceState
          );
        }
      );
      return result;
    });
    ipcMain.handle('IPC_AGORA_RTC_RELEASE', () => {
      const engine = createAgoraRtcEngine();
      return engine.release();
    });
    ipcMain.handle('IPC_AGORA_RTC_ENUMERATE_VIDEO_DEVICES', () => {
      const engine = createAgoraRtcEngine();
      return engine.getVideoDeviceManager().enumerateVideoDevices();
    });
    ipcMain.handle(
      'IPC_AGORA_RTC_START_SCREEN_CAPTURE',
      (_, { source, captureParams }) => {
        const engine = createAgoraRtcEngine();
        let result;
        if (
          source.type === ScreenCaptureSourceType.ScreencapturesourcetypeScreen
        ) {
          result = engine.startScreenCaptureByDisplayId(
            source.sourceId,
            {},
            captureParams
          );
        } else {
          result = engine.startScreenCaptureByWindowId(
            source.sourceId,
            {},
            captureParams
          );
        }
        return result;
      }
    );
    ipcMain.handle(
      'IPC_AGORA_RTC_UPDATE_SCREEN_CAPTURE_PARAMETERS',
      (_, { captureParams }) => {
        const engine = createAgoraRtcEngine();
        return engine.updateScreenCaptureParameters(captureParams);
      }
    );
    ipcMain.handle('IPC_AGORA_RTC_STOP_SCREEN_CAPTURE', () => {
      const engine = createAgoraRtcEngine();
      return engine.stopScreenCapture();
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
