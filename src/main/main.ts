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
  session,
  clipboard,
  systemPreferences,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { LiveWS } from 'bilibili-live-ws';
import Store from 'electron-store';
import { randomUUID } from 'crypto';
import axios from 'axios';
import { getHTMLPathBySearchKey, resolveHtmlPath } from './util';
import url from 'url';
import fs from 'fs';
import { electron } from 'process';
require('electron-referer')('https://live.bilibili.com');
import os, { platform } from 'node:os';
const { send, updateRoomTitle } = require('bilibili-live-danmaku-api');

let live: LiveWS;
const store = new Store();
let mainWindow: BrowserWindow | null = null;
let dm: BrowserWindow | null = null;
let livePreviewWindow: BrowserWindow | null = null;
let pluginWindow: BrowserWindow | null = null;
let lockWindow: BrowserWindow |null = null;

// IPC listener
ipcMain.on('electron-store-get', (event, val) => {
  //  mainWindow?.webContents.send('main-process-message', store.path);
  event.returnValue = store.get(val);
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  console.log(key, val);
  store.set(key, val);
});
export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    const proxyServer = store.get('proxy_server');
    if (proxyServer) {
      autoUpdater.netSession.setProxy({
        proxyRules: `${proxyServer}`,
      });
    }
    const morror = store.get('mirror');
    if (morror) {
      autoUpdater.setFeedURL({
        provider: 'generic',
        url: 'https://ririra.com/update/win',
      });
    }
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
      sandbox: false,
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
  session.defaultSession.cookies.set({
    url: 'https://api.bilibili.com/',
    name: 'SESSDATA',
    value: store.get('SESSDATA') as string,
    sameSite: 'no_restriction',
    domain: 'api.bilibili.com',
  });
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
    mainWindow?.webContents.send('create_windows_name', 'main');
    // const rootPath = path.join(__dirname, '..');
    // const appPackagePath = path.join(appPath, 'package.json');

    // Load each tool dynamically
    const appDataPath = app.getPath('appData');
    console.log('AppData Path:', appDataPath);
    const myAppDataPath = path.join(appDataPath, app.getName());
    const pluginsConfigPath = path.join(myAppDataPath, 'plugins.json');
    console.info(pluginsConfigPath);
    if (fs.existsSync(pluginsConfigPath)) {
      const pluginsConfig = JSON.parse(
        fs.readFileSync(pluginsConfigPath, 'utf-8')
      );
      pluginsConfig.plugins.forEach((plugin: { path: string; name: any; }) => {
        try {
          // Dynamically require the tool's JavaScript file
          // const pluginPath = path.join(myAppDataPath, plugin.path);
          // const pluginModule = require(pluginPath);
          // console.log('Loaded plugin:', pluginModule);
          // // Assuming there's an exports.html function in each tool file
          // const pluginHtml = pluginModule.html;
          // console.log(pluginHtml);
          // // Assuming there's an exports.Events function in each tool file
          // const pluginEvents =  pluginModule.events;
          // console.log(pluginEvents);
          // Do something with the toolHtml (e.g., append it to the main window)
          console.info(mainWindow);
          mainWindow?.webContents.send('load_plugins', { name: plugin.name });
        } catch (error) {
          console.error(`Failed to load tool ${plugin.name}:`, error);
        }
      });
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
      backgroundThrottling: false,
      sandbox: false,
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  dm.setMenuBarVisibility(false);
  dm.loadURL(getHTMLPathBySearchKey('dmWindow'));
  dm.webContents.insertCSS(
    ':root{ --chakra-colors-white: transparent !important;}'
  );
  dm.on('ready-to-show', () => {
    if (!dm) {
      throw new Error('"dm" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      dm.minimize();
    } else {
      dm.show();
    }
    dm?.webContents.send('create_windows_name', 'dm');
    if (dm) {
      const p: number[] = dm.getPosition();
      lockWindow?.setPosition(p[0], p[1]);
    }
  });

  dm.on('closed', () => {
    if (live) {
      live.close();
    }
    if (lockWindow?.closable) {
      lockWindow.close();
    }
    dm = null;
  });

  dm.on('moved', () => {
    // move lock window
    if (dm) {
      const nowPostion: number[] = dm.getPosition();
      lockWindow?.setPosition(nowPostion[0], nowPostion[1]);
    }
  });

  dm.on('resized', () => {
    if (dm) {
      const nowPostion: number[] = dm.getPosition();
      lockWindow?.setPosition(nowPostion[0], nowPostion[1]);
    }
  });

  dm.on('focus', () => {
    if (dm) {
      console.info('top lock');
      lockWindow?.setAlwaysOnTop(true);
      const nowPostion: number[] = dm.getPosition();
      lockWindow?.setPosition(nowPostion[0], nowPostion[1]);
    }
  });
  dm.on('minimize', () => {
    lockWindow?.minimize();
  });
  dm.on('restore', () => {
    lockWindow?.restore();
  });
  dm.on('hide', () => {
    console.info('dm hide');
    lockWindow?.hide();
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

const createLockWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  lockWindow = new BrowserWindow({
    title: '*',
    height: 50,
    useContentSize: false,
    width: 50,
    frame: false,
    transparent: true,
    webPreferences: {
      backgroundThrottling: false,
      sandbox: false,
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  lockWindow.setMenuBarVisibility(false);
  lockWindow.webContents.insertCSS(
    ':root{ --chakra-colors-white: transparent !important;}'
  );
  console.info(process.platform.toString());
  if (
    process.platform.toString() === 'win32' ||
    process.platform.toString() === 'darwin'
  ) {
    console.info('is win32 or darwin ');
    lockWindow.setSkipTaskbar(true);
  }
  lockWindow.loadURL(getHTMLPathBySearchKey('lockWindow'));
  lockWindow.on('ready-to-show', () => {
    if (!lockWindow) {
      throw new Error('"lockWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      lockWindow.minimize();
    } else {
      lockWindow.show();
    }
    lockWindow?.webContents.send('create_windows_name', 'lockWindow');
  });

  lockWindow.on('closed', () => {
    lockWindow = null;
  });

  lockWindow.on('show', () => {
    if (dm) {
      dm.setAlwaysOnTop(false);
      if (store.get('alwayOnTop')) {
        dm.setAlwaysOnTop(true);
      }
      if (lockWindow) {
        lockWindow.setAlwaysOnTop(true);
      }
    } else if (lockWindow) {
      lockWindow.setAlwaysOnTop(true);
    }
  });
  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // Open urls in the user's browser
  lockWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
 // new AppUpdater();
};
const createPluginWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  pluginWindow = new BrowserWindow({
    title: 'Plugin Windwow',
    height: 624,
    useContentSize: false,
    width: 455,
    frame: false,
    transparent: true,
    webPreferences: {
      sandbox: false,
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  pluginWindow.setMenuBarVisibility(false);
  pluginWindow.loadURL(getHTMLPathBySearchKey('pluginWindow'));

  pluginWindow.on('ready-to-show', () => {
    if (!pluginWindow) {
      throw new Error('"pluginWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      pluginWindow.minimize();
    } else {
      pluginWindow.show();
    }
    pluginWindow?.webContents.send('create_windows_name', 'pluginWindow');
    const appDataPath = app.getPath('appData');
    console.log('AppData Path:', appDataPath);
    const myAppDataPath = path.join(appDataPath, app.getName());
    const pluginsConfigPath = path.join(myAppDataPath, 'plugins.json');
    console.info(pluginsConfigPath);
    const pluginsConfig = JSON.parse(
      fs.readFileSync(pluginsConfigPath, 'utf-8')
    );
    pluginsConfig.plugins.forEach((plugin: { path: string; name: any; }) => {
      try {
        // Dynamically require the tool's JavaScript file
        // const pluginPath = path.join(myAppDataPath, plugin.path);
        // const pluginModule = require(pluginPath);
        // console.log('Loaded plugin:', pluginModule);
        // // Assuming there's an exports.html function in each tool file
        // const pluginHtml = pluginModule.html;
        // console.log(pluginHtml);
        // // Assuming there's an exports.Events function in each tool file
        // const pluginEvents =  pluginModule.events;
        // console.log(pluginEvents);
        // Do something with the toolHtml (e.g., append it to the main window)
        console.info(mainWindow);
        pluginWindow?.webContents.send('load_plugins', { name: plugin.name });
      } catch (error) {
        console.error(`Failed to load tool ${plugin.name}:`, error);
      }
    });
  });

  pluginWindow.on('closed', () => {
    live.close();
    pluginWindow = null;
  });

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // Open urls in the user's browser
  pluginWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
 // new AppUpdater();
};

const createYinWindow = async () => {
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
    title: 'Yin',
    frame: false,
    transparent: true,
    autoHideMenuBar: true,
    skipTaskbar: true,
    roundedCorners: false,
    webPreferences: {
      sandbox: false,
      webSecurity: false,
      devTools: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  dm.setIgnoreMouseEvents(true, {
    forward: true,
  });
  dm.maximize();
  dm.setAlwaysOnTop(true, 'screen-saver');
  dm.setMenuBarVisibility(false);
  dm.setVisibleOnAllWorkspaces(true);
  dm.loadURL(getHTMLPathBySearchKey('yin'));
  dm.on('ready-to-show', () => {
    if (!dm) {
      throw new Error('"dm" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      dm.minimize();
    } else {
      dm.show();
    }
    dm?.webContents.send('create_windows_name', 'yin');
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
const createLivePreviewWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  livePreviewWindow = new BrowserWindow({
    title: 'Live Preview',
    width: 800,
    height: 600,
    webPreferences: {
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  livePreviewWindow.setMenuBarVisibility(false);
  livePreviewWindow.loadURL(getHTMLPathBySearchKey('livePreview'));
  livePreviewWindow
    .on('closed', () => {
      livePreviewWindow = null;
    })
    .on('ready-to-show', () => {
      if (!livePreviewWindow) {
        throw new Error('"livePreviewWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        livePreviewWindow.minimize();
      } else {
        livePreviewWindow.show();
      }
      livePreviewWindow?.webContents.send('create_windows_name', 'livePreview');
    });
  livePreviewWindow.loadURL(getHTMLPathBySearchKey('livePreview'));

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // Open urls in the user's browser
  livePreviewWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
 // new AppUpdater();
};

let lockState = true;
ipcMain.on('setIgnoreMouseEvents', async function (arg) {
  if (!dm || !lockWindow) {
    return;
  }
  if (lockState) {
    dm.setAlwaysOnTop(false);
    dm.setIgnoreMouseEvents(true);
    dm.setAlwaysOnTop(true);
    lockWindow.setAlwaysOnTop(true);
    lockState = false;
  } else {
    dm.setIgnoreMouseEvents(false);
    dm.setAlwaysOnTop(false);
    const dmTopState = store.get('alwaysOnTop');
    if (await store.get('alwaysOnTop')) {
      dm.setAlwaysOnTop(true);
    }
    lockWindow.setAlwaysOnTop(true);
    lockState = true;
  }
});

ipcMain.on('createPluginWindow', function (arg) {
  if (pluginWindow == null) {
    createPluginWindow();
  }
});

ipcMain.on('createDmWindow', function (arg) {
  if (dm == null) {
    createDMWindow();
  }
});

ipcMain.on('createLockWindow', function (arg) {
  if (lockWindow == null) {
    createLockWindow();
  }
});

ipcMain.on('createYinWindow', function (arg) {
  if (dm == null) {
    createYinWindow();
  }
});

ipcMain.on('createLivePreview', function (arg) {
  if (livePreviewWindow == null) {
    createLivePreviewWindow();
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
ipcMain.on('updateRoomTitle', (event, arg) => {
  try {
    updateRoomTitle({
      title: arg[0].title,
      room_id: arg[0].roomid,
      SESSDATA: arg[0].SESSDATA,
      csrf: arg[0].csrf,
    })
      .then((res: any) => {
        let { msg } = res;
        console.error('in then');
        console.log(res);
        console.log(res.msg);
        console.log(res.code);
        if (res.code === 0) {
          msg = '修改成功';
        }
        mainWindow?.webContents.send('msg-tips', msg);
      })
      .catch((err: any) => {
        console.error('in error');
        console.log(err.msg);
        console.log(err.code);
        mainWindow?.webContents.send('msg-tips', err.msg);
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
      lockWindow?.close();
    }
    if (arg[i] === 'main-close') {
      mainWindow?.close();
    }
  }
});
ipcMain.on('minusWindow', (event, arg) => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < arg.length; i++) {
    if (arg[i] === 'dm-minus') {
      if (dm?.maximizable) {
        dm?.minimize();
      }
    }
    if (arg[i] === 'main-minus') {
      if (mainWindow?.maximizable) {
        mainWindow?.minimize();
      }
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
  if (dm != null) {
    dm.webContents.send('dark-mode:toggle', arg);
  }
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.on('theme:change', (event, arg) => {
  console.info('come in theme change');
  console.info(nativeTheme.themeSource);
  if (dm != null) {
    dm.webContents.send('theme:change', arg);
  }
});
ipcMain.on('opacity:change', (event, arg) => {
  console.info('come in opacity change');
  console.info(nativeTheme.themeSource);
  if (dm != null) {
    dm.webContents.send('opacity:change', arg);
  }
});
ipcMain.handle('dark-mode:toggle', async (event) => {
  console.info('come in dark toggle');
});

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system';
});
ipcMain.on('onLive', async (event, arg) => {
  console.info(arg);
  if (!live) {
    console.info('new liveWs instance added');
    console.info(arg[1]);
    const cookieKey = {
      url: 'https://live.bilibili.com',
      name: 'SESSDATA',
      value: store.get('SESSDATA') as string,
    };
    // eslint-disable-next-line promise/catch-or-return
    await session.defaultSession.cookies.set(cookieKey);
    await session.defaultSession.cookies.set({
      url: 'https://api.live.bilibili.com',
      name: 'SESSDATA',
      value: store.get('SESSDATA') as string,
    });
    await session.defaultSession.cookies.set({
      url: 'https://api.live.bilibili.com',
      name: 'buvid3',
      value: store.get('buvid2') as string});
    await session.defaultSession.cookies.set({
      url: 'https://api.live.bilibili.com',
      name: 'bili_jct',
      value: store.get('csrf') as string,
    });
    // success
    axios.defaults.withCredentials = true;
    // eslint-disable-next-line promise/no-nesting
    var res = await  axios
          .get(`https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id=${arg[0]}`,{
            headers: {
              'Cookie': `bili_jct=${store.get('csrf')};SESSDATA=${store.get('SESSDATA')};buvid3=${store.get('buvid3')};`
            }

          })
          // eslint-disable-next-line func-names
          // eslint-disable-next-line promise/always-return
          console.log(res);
          store.set('key', res.data.data.token);
          live = new LiveWS(Number(arg[0]), {
            uid: Number(arg[1]),
            key: res.data.data.token as string,
            buvid: store.get('buvid2') as string,
            protover: 3,
            // authBody: {
            //   csrf: store.get('csrf') as string,
            //   SESSDATA: store.get('SESSDATA') as string,
            // },
          });
        console.log('success');

  } else {
    live.close();
    console.info('old closed and new liveWs instance added');
    live = new LiveWS(Number(arg[0]), {
      uid: Number(arg[1]),
      key: store.get('key') as string,
      buvid: store.get('buvid2') as string,
      protover: 3,
      // authBody: {
      //   csrf: store.get('csrf') as string,
      //   SESSDATA: store.get('SESSDATA') as string,
      // },
    });
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
  // live.on('heartbeat', (online: any) => {
  //   dm?.webContents.send('update-online', online);
  // });
  let tempData: any;
  live.on('msg', (data: any) => {
    console.info(data);
    if (data.cmd === 'ONLINE_RANK_COUNT') {
      // { count: 1978, online_count: 2255 }
      let dmCount = data.data.count;
      if (data.data.online_count) {
        dmCount = data.data.online_count;
      }
      dm?.webContents.send('update-online', dmCount);
    }
    if (tempData !== data) {
      data.keyy = randomUUID();
      dm?.webContents.send('update-msg', data);
      tempData = data;
    }
  });
});

ipcMain.on('onCopy', (event, arg) => {
  console.info(arg);
  clipboard.writeText(arg[0]);
  });

ipcMain.on('setOnTop:setting', (event, arg) => {
  console.info(`setOnTop:setting ${arg[0]}`);
  if (arg) {
    dm?.setAlwaysOnTop(arg[0], 'normal');
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
  .then(async () => {
    const filter = { urls: ['https://*/*'] };
        session.defaultSession.webRequest.onHeadersReceived(filter, (details, callback) => {
            if (details.responseHeaders && details.responseHeaders['Set-Cookie']) {
                for (let i = 0; i < details.responseHeaders['Set-Cookie'].length; i++) {
                    details.responseHeaders['Set-Cookie'][i] += ';SameSite=None;Secure';
                }
            }
            callback({ responseHeaders: details.responseHeaders });
        });
    const cookie = {
      url: 'https://data.bilibili.com',
      name: 'bili_jct',
      value: store.get('csrf') as string,
    };
    // eslint-disable-next-line promise/catch-or-return
    await session.defaultSession.cookies.set(cookie);
    const cookie2 = {
      url: 'https://data.bilibili.com',
      name: 'SESSDATA',
      value: store.get('SESSDATA') as string,
    };
    // eslint-disable-next-line promise/catch-or-return
    await session.defaultSession.cookies.set(cookie2);
    axios.defaults.withCredentials = true;

    // eslint-disable-next-line promise/no-nesting
    axios
      .get(`https://data.bilibili.com/v/`,{
        headers: {
          'Cookie': `bili_jct=${store.get('csrf')};SESSDATA=${store.get('SESSDATA')}`
        }
      })
      // eslint-disable-next-line func-names
      // eslint-disable-next-line promise/always-return
      .then((res) => {
        console.log(res);
        console.log(res.headers['set-cookie']);
        if (res.headers['set-cookie']) {
          const buvid2 = res.headers['set-cookie'][0]
            .split(';')[0]
            .split('=')[1];
          const buvid3 = res.headers['set-cookie'][1]
            .split(';')[0]
            .split('=')[1];
          store.set('buvid2', buvid2);
          store.set('buvid3', buvid3);
        }
      })

      session.defaultSession.cookies.get({})
      .then((cookies) => {
        console.log(cookies)
      }).catch((error) => {
        console.log(error)
      })

    if (live) {
      live.close();
    }
    const targetPath = 'C://Users//Public//Roaming//catcat-dm-react//plugins';
    // 判断路径是否存在
    if (!fs.existsSync(targetPath)) {
      // 路径不存在，创建目录
      try {
        fs.mkdirSync(targetPath);
        console.log('Directory created:', targetPath);
      } catch (error) {
        console.error('Error creating directory:', error);
      }
    } else {
      console.log('Directory already exists:', targetPath);
    }

    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

function sendStatusToWindow(text: string) {
  log.info(text);
  mainWindow?.webContents.send('update-message', text);
}

ipcMain.on('update:app', (event, arg) => {
  console.info(arg);
  // eslint-disable-next-line no-new
  new AppUpdater();
});

ipcMain.on('log', (event, arg) => {
  if (arg[0] === 'info') {
    log.info(arg[1]);
  } else if (arg[0] === 'error') {
    log.error(arg[1]);
  } else if (arg[0] === 'warn') {
    log.warn(arg[1]);
  } else if (arg[0] === 'debug') {
    log.debug(arg[1]);
  } else if (arg[0] === 'silly') {
    log.silly(arg[1]);
  } else {
    log.info(arg[1]);
  }
});

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
});
autoUpdater.on('update-not-available', (info) => {
  console.info(info);
  sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', (err) => {
  sendStatusToWindow(`Error in auto-updater. ${err}`);
});
autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
  logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
  logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
  sendStatusToWindow(logMessage);
  mainWindow?.webContents.send('down-progress', [
    progressObj.percent,
    progressObj.transferred,
    progressObj.total,
  ]);
});
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});
