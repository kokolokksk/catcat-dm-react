import fs from 'fs';
import catConfig from 'electron-json-storage';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { domReady } from '../preload/utils';
import { useLoading } from '../preload/loading';

// eslint-disable-next-line react-hooks/rules-of-hooks
const { appendLoading, removeLoading } = useLoading();

// (async () => {
//   await domReady();

//   appendLoading();
// })();

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});

// --------- Expose some API to the Renderer process. ---------
contextBridge.exposeInMainWorld('fs', fs);
contextBridge.exposeInMainWorld('catConfig', catConfig);
contextBridge.exposeInMainWorld('removeLoading', removeLoading);
contextBridge.exposeInMainWorld('danmuApi', {
  onUpdateOnliner: (
    callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ) => ipcRenderer.on('update-online', callback),
  onUpdateMsg: (
    callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ) => ipcRenderer.on('update-msg', callback),
});
