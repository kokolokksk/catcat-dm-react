export {};

declare global {
  interface Window {
    // Expose some Api through preload script
    fs: typeof import('fs');
    // IPC listener
    electron: {
      store: {
        get: (key: string) => Promise<any>;
        set: (key: string, val: any) => void;
        // any other methods you've defined...
      };
      ipcRenderer: {
        sendMessage: (channel: string, args: unknown[]) => void;
      };
    };
    darkMode: {
      toggle: (arg0: (_event: any, args: unknown[]) => void) => boolean;
    };
    theme: {
      change: (arg0: (_event: any, data: any) => void) => void;
    };
    danmuApi: {
      onUpdateOnliner: (arg0: (_event: any, value: any) => void) => void;
      onUpdateMsg: (arg0: (_event: any, data: any) => void) => void;
      mainProcessMessage: (arg0: (_event: any, data: any) => void) => void;
      updateMessage: (arg0: (_event: any, data: any) => void) => void;
      msgTips: (arg0: (_event: any, data: any) => void) => void;
      downProgress: (arg0: (_event: any, data: any) => void) => void;
    };
    removeLoading: () => void;
  }
}
