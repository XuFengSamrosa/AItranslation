"use strict";
const node_os = require("node:os");
const node_path = require("node:path");
const electron = require("electron");
const electronUpdater = require("electron-updater");
process.env.DIST_ELECTRON = node_path.join(__dirname, "..");
process.env.DIST = node_path.join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? node_path.join(process.env.DIST_ELECTRON, "../public") : process.env.DIST;
if (node_os.release().startsWith("6.1"))
  electron.app.disableHardwareAcceleration();
if (process.platform === "win32")
  electron.app.setAppUserModelId(electron.app.getName());
if (!electron.app.requestSingleInstanceLock()) {
  electron.app.quit();
  process.exit(0);
}
electronUpdater.autoUpdater.autoDownload = false;
electronUpdater.autoUpdater.autoInstallOnAppQuit = true;
let win = null;
const preload = node_path.join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = node_path.join(process.env.DIST, "index.html");
async function createWindow() {
  win = new electron.BrowserWindow({
    title: "Main window",
    icon: node_path.join(process.env.PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(url);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", new Date().toLocaleString());
  });
  win.webContents.setWindowOpenHandler(({ url: url2 }) => {
    if (url2.startsWith("https:"))
      electron.shell.openExternal(url2);
    return { action: "deny" };
  });
}
let settingsWindow = null;
electron.ipcMain.on("open-settings-window", (event) => {
  if (settingsWindow === null) {
    settingsWindow = new electron.BrowserWindow({
      title: "Setting",
      width: 700,
      height: 800,
      x: 600,
      y: 200,
      frame: true,
      titleBarStyle: "default",
      // modal: true, // 模态窗口，会阻塞父窗口 (macOS 不支持)
      parent: win,
      resizable: false,
      fullscreenable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    settingsWindow.on("closed", () => {
      settingsWindow = null;
    });
    if (process.env.VITE_DEV_SERVER_URL) {
      settingsWindow.webContents.openDevTools();
      settingsWindow.loadURL(`${url}#/setting`);
    } else {
      settingsWindow.loadFile(indexHtml, { hash: "/setting" });
    }
  } else {
    settingsWindow.show();
  }
});
electron.app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin")
    electron.app.quit();
});
electron.app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized())
      win.restore();
    win.focus();
  }
});
electron.app.whenReady().then(() => {
  createWindow();
  electronUpdater.autoUpdater.checkForUpdates();
});
electron.app.on("activate", () => {
  const allWindows = electron.BrowserWindow.getAllWindows();
  if (allWindows.length)
    allWindows[0].focus();
  else
    createWindow();
});
process.on("uncaughtException", (err) => {
  console.log(err);
});
electronUpdater.autoUpdater.on("error", (err) => {
  electron.dialog.showErrorBox("AutoUpdater Error", err.message);
});
electronUpdater.autoUpdater.on("update-available", (info) => {
  electron.dialog.showMessageBox({
    type: "info",
    title: `发现新版本：${info.version}`,
    message: "是否立即后台下载更新?",
    buttons: ["是", "否"]
  }).then(({ response }) => {
    if (response === 0)
      electronUpdater.autoUpdater.downloadUpdate();
  });
});
electronUpdater.autoUpdater.on("update-downloaded", () => {
  electron.dialog.showMessageBox({
    type: "info",
    title: "更新已下载",
    message: "是否立即安装并重新启动应用?",
    buttons: ["是", "否"]
  }).then(({ response }) => {
    if (response === 0)
      electronUpdater.autoUpdater.quitAndInstall();
  });
});
//# sourceMappingURL=index.js.map
