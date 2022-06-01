import fs from 'fs';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { useLoading } from '../preload/loading';

// eslint-disable-next-line react-hooks/rules-of-hooks
const { appendLoading, removeLoading } = useLoading();

// (async () => {
//   await domReady();

//   appendLoading();
// })();

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: string, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});

// --------- Expose some API to the Renderer process. ---------
contextBridge.exposeInMainWorld('fs', fs);
contextBridge.exposeInMainWorld('removeLoading', removeLoading);
contextBridge.exposeInMainWorld('danmuApi', {
  onUpdateOnliner: (
    callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ) => ipcRenderer.on('update-online', callback),
  onUpdateMsg: (
    callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ) => ipcRenderer.on('update-msg', callback),
});

// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
contextBridge.exposeInMainWorld('electron', {
  store: {
    get(val: any) {
      return ipcRenderer.sendSync('electron-store-get', val);
    },
    set(property: any, val: any) {
      ipcRenderer.send('electron-store-set', property, val);
    },
    // Other method you want to add like has(), reset(), etc.
  },
  // Any other methods you want to expose in the window object.
  // ...
});
