export {};

declare global {
  interface Window {
    // Expose some Api through preload script
    fs: typeof import('fs');
    // IPC listener
    electron: {
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
        // any other methods you've defined...
      };
    };
    ipcRenderer: import('electron').IpcRenderer;
    danmuApi: {
      onUpdateOnliner: (arg0: (_event: any, value: any) => void) => void;
      onUpdateMsg: (arg0: (_event: any, data: any) => void) => void;
    };
    removeLoading: () => void;
  }
}
