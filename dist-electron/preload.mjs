"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // Fechar o app
  closeApp: () => electron.ipcRenderer.send("app:close"),
  // Salvar dados no storage
  saveData: (key, value) => electron.ipcRenderer.send("storage:save", { key, value }),
  // Ler dados do storage
  getData: (key) => electron.ipcRenderer.invoke("storage:get", key),
  copyToClipboard: (text) => electron.ipcRenderer.send("clipboard:copy", text),
  exportToClipboard: (text) => electron.ipcRenderer.send("clipboard:export", text),
  importData: () => electron.ipcRenderer.invoke("clipboard:get"),
  showOverlay: () => electron.ipcRenderer.invoke("show-overlay"),
  hideOverlay: () => electron.ipcRenderer.invoke("hide-overlay"),
  onNumero: (callback) => electron.ipcRenderer.on("set-numero", (_event) => callback())
});
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
