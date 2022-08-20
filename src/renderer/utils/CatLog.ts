class CatLog {
  public static info = (args: any) => {
    window.electron.ipcRenderer.sendMessage('log', ['info', args]);
  };

  public static error = (args: any) => {
    window.electron.ipcRenderer.sendMessage('log', ['error', args]);
  };

  public static warn = (args: any) => {
    window.electron.ipcRenderer.sendMessage('log', ['warn', args]);
  };

  public static debug = (args: any) => {
    window.electron.ipcRenderer.sendMessage('log', ['debug', args]);
  };

  public static log = (args: any) => {
    window.electron.ipcRenderer.sendMessage('log', ['log', args]);
  };

  public static console = (args?: any, ...optionalParams: any[]) => {
    console.log(args, ...optionalParams);
  };
}

export default CatLog;
// # sourceMappingURL=CatLog.js.map
// CONCATENATED MODULE: ./src/renderer/utils/CatLog.ts
