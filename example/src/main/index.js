"use strict";

import {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  systemPreferences,
} from "electron";
import * as path from "path";
import { format as formatUrl } from "url";

if (systemPreferences.askForMediaAccess) {
  systemPreferences.askForMediaAccess("camera");
  systemPreferences.askForMediaAccess("microphone");
}

const isDevelopment = process.env.NODE_ENV !== "production";
if (process.platform === "linux") {
  app.disableHardwareAcceleration();
}
ipcMain.handle("DESKTOP_CAPTURER_GET_SOURCES", (event, opts) =>
  desktopCapturer.getSources(opts)
);
// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;
app.allowRendererProcessReuse = true;

function createMainWindow() {
  const window = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true,
      })
    );
  }

  window.on("closed", () => {
    mainWindow = null;
  });

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.allowRendererProcessReuse = false;

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
  mainWindow = createMainWindow();
});
