import { app, BrowserWindow, ipcMain, clipboard, screen } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import Store from "electron-store";
const store = new Store();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let overlayAberto: BrowserWindow | undefined;

function createOverlayWindow() {
  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize;

  const windowWidth = 100;
  const windowHeight = 50;

  const x = Math.floor((screenWidth - windowWidth) / 2);
  const y = 10;

  overlayAberto = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x,
    y,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  overlayAberto.setAlwaysOnTop(true, "screen-saver");
  overlayAberto.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  overlayAberto.setFullScreenable(false);
  overlayAberto.moveTop();

  
  if (VITE_DEV_SERVER_URL) {
    overlayAberto.loadURL(VITE_DEV_SERVER_URL + 'overlay');
  } else {
    overlayAberto.loadFile(path.join(RENDERER_DIST, "overlay.html"));
  }

  overlayAberto.on("closed", () => {
    overlayAberto = undefined;
  });
}

function createWindow() {
  win = new BrowserWindow({
    frame: false,
    titleBarStyle: "hidden",
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  // win.webContents.openDevTools();
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

ipcMain.on("app:close", () => {
  app.quit();
});

// Salvar no storage
ipcMain.on("storage:save", (_event, { key, value }) => {
  store.set(key, value);
});

// Ler do storage
ipcMain.handle("storage:get", (_event, key) => {
  return store.get(key);
});

ipcMain.on("clipboard:copy", (_event, text) => {
  clipboard.writeText(text);
  overlayAberto?.webContents.send("set-numero");
});

ipcMain.on("clipboard:export", (_event, text) => {
  const base64 = Buffer.from(text).toString("base64");
  clipboard.writeText(base64);
});

ipcMain.handle("show-overlay", () => {
  createOverlayWindow();
  console.log(overlayAberto);
});

ipcMain.handle("hide-overlay", () => {
  overlayAberto?.close();
});

ipcMain.handle("clipboard:get", async (_event) => {
  const textFromClipboard = await clipboard.readText();
  const base64 = Buffer.from(textFromClipboard, "base64").toString("utf-8");
  return base64;
});
