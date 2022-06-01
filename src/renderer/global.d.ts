export {};

declare global {
  interface Window {
    // Expose some Api through preload script
    fs: typeof import('fs');
    catConfig: typeof import('catConfig');
    ipcRenderer: import('electron').IpcRenderer;
    danmuApi: {
      onUpdateOnliner: (arg0: (_event: any, value: any) => void) => void;
      onUpdateMsg: (arg0: (_event: any, data: any) => void) => void;
    };
    removeLoading: () => void;
  }
}
