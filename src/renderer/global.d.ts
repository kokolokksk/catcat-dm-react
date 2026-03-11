export {};

declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
      };
      dialog: {
        pickFolder: () => Promise<string | null>;
      };
      ipcRenderer: {
        sendMessage: (channel: string, args: unknown[]) => void;
        updateRoomTitle: (channel: string, args: unknown[]) => void;
        spaceInfo: (channel: string, args: unknown[]) => void;
      };
    };
    darkMode: {
      toggle: (checked: boolean) => boolean;
    };
    theme: {
      change: (handler: (_event: any, data: any) => void) => void;
    };
    opacity: {
      change: (handler: (_event: any, data: any) => void) => void;
    };
    appFont: {
      change: (handler: (_event: any, data: any) => void) => void;
    };
    dmFont: {
      change: (handler: (_event: any, data: any) => void) => void;
    };
    danmuApi: {
      onUpdateOnliner: (handler: (_event: any, value: any) => void) => void;
      onUpdateMsg: (handler: (_event: any, data: any) => void) => void;
      mainProcessMessage: (handler: (_event: any, data: any) => void) => void;
      updateMessage: (handler: (_event: any, data: any) => void) => void;
      createWindowsName: (handler: (_event: any, data: any) => void) => void;
      msgTips: (handler: (_event: any, data: any) => void) => void;
      downProgress: (handler: (_event: any, data: any) => void) => void;
      spaceInfo: (handler: (_event: any, data: any) => void) => void;
      loadPlugins: (handler: (_event: any, data: any) => void) => void;
    };
    removeLoading: () => void;
  }
}
