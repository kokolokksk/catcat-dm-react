/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path, { join } from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  globalShortcut,
  nativeTheme,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { LiveWS } from 'bilibili-live-ws';
import Store from 'electron-store';
import { randomUUID } from 'crypto';
import { getHTMLPathBySearchKey, resolveHtmlPath } from './util';

require('electron-referer')('https://www.bilibili.com/');
const send = require('bilibili-live-danmaku-api');

let live: LiveWS;
const store = new Store();

let mainWindow: BrowserWindow | null = null;
let dm: BrowserWindow | null = null;

// IPC listener
ipcMain.on('electron-store-get', (event, val) => {
  mainWindow?.webContents.send('main-process-message', store.path);
  event.returnValue = store.get(val);
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val);
});
export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    title: 'Setting Windwow',
    height: 650,
    useContentSize: false,
    width: 700,
    frame: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL(getHTMLPathBySearchKey('main'));
  mainWindow.webContents.send(
    'main-process-message',
    resolveHtmlPath('index.html')
  );
  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
  globalShortcut.register('CommandOrControl+Shift+M', () => {
    console.log('CommandOrControl+Shift+M is pressed');
    if (mainWindow != null && dm == null) {
      mainWindow.webContents.openDevTools();
    }
    if (dm != null) {
      dm.webContents.openDevTools();
    }
  });
};

const createDMWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  dm = new BrowserWindow({
    title: 'Danmu Windwow',
    height: 624,
    useContentSize: false,
    width: 455,
    frame: false,
    transparent: true,
    webPreferences: {
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  dm.setMenuBarVisibility(false);
  dm.loadURL(getHTMLPathBySearchKey('dmWindow'));

  dm.on('ready-to-show', () => {
    if (!dm) {
      throw new Error('"dm" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      dm.minimize();
    } else {
      dm.show();
    }
  });

  dm.on('closed', () => {
    live.close();
    dm = null;
  });

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // Open urls in the user's browser
  dm.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
 // new AppUpdater();
};

ipcMain.on('createDmWindow', function (arg) {
  if (dm == null) {
    createDMWindow();
  }
});
ipcMain.on('sendDanmu', (event, arg) => {
  try {
    send({
      msg: arg[0].value,
      roomid: arg[0].roomid,
      SESSDATA: arg[0].SESSDATA,
      csrf: arg[0].csrf,
      // extra
    }).catch((e: any) => {
      console.info(e);
      dm?.webContents.send('main-process-message', e);
      dm?.webContents.send('msg-tips', e);
    });
  } catch (err: any) {
    console.error(err);
  }
});
ipcMain.on('closeWindow', (event, arg) => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < arg.length; i++) {
    if (arg[i] === 'dm-close') {
      dm?.close();
    }
    if (arg[i] === 'main-close') {
      mainWindow?.close();
    }
  }
});
ipcMain.on('dark-mode:toggle', (event, arg) => {
  console.info('come in dark toggle');
  console.info(nativeTheme.themeSource);
  if (arg) {
    nativeTheme.themeSource = 'light';
  } else {
    nativeTheme.themeSource = 'dark';
  }
  // todo: 通知所有窗口更新主题
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system';
});
ipcMain.on('onLive', (event, arg) => {
  console.info(arg);
  if (!live) {
    console.info('new liveWs instance added');
    live = new LiveWS(Number(arg[0]));
  } else {
    live.close();
    console.info('old closed and new liveWs instance added');
    live = new LiveWS(Number(arg[0]));
  }
  live.on('open', () => {
    dm?.webContents.send(
      'main-process-message',
      'trying connect to server······'
    );
  });
  live.on('live', () => {
    dm?.webContents.send('main-process-message', 'success connected server');
  });
  live.on('heartbeat', (online: any) => {
    dm?.webContents.send('update-online', online);
  });
  let tempData: any;
  live.on('msg', (data: any) => {
    if (tempData !== data) {
      data.keyy = randomUUID();
      dm?.webContents.send('update-msg', data);
      tempData = data;
    }
  });
});

ipcMain.on('setOnTop:setting', (event, arg) => {
  console.info(`setOnTop:setting ${arg[0]}`);
  if (arg) {
    dm?.setAlwaysOnTop(arg[0]);
  }
});
/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    if (live) {
      live.close();
    }
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    if (live) {
      live.close();
    }
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
