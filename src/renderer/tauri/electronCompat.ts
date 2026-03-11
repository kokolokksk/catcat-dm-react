import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { tauriGetJson } from './http';

type Listener = (_event: any, payload: any) => void;
type StoreShape = Record<string, any>;

const STORE_KEY = 'catcat-store';
let storeCache: StoreShape = {};
const listeners = new Map<string, Set<Listener>>();
let liveInstance: any = null;

const { LiveWS } = require('bilibili-live-ws/browser');

const readStore = () => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    storeCache = raw ? JSON.parse(raw) : {};
  } catch (_e) {
    storeCache = {};
  }
};

const saveStore = () => {
  localStorage.setItem(STORE_KEY, JSON.stringify(storeCache));
};

const emitEvent = (name: string, payload: any) => {
  const set = listeners.get(name);
  if (!set) return;
  set.forEach((handler) => handler({}, payload));
};

const onEvent = (name: string, cb: Listener) => {
  if (!listeners.has(name)) {
    listeners.set(name, new Set());
  }
  listeners.get(name)!.add(cb);
};

const sendDanmu = async (args: unknown[]) => {
  try {
    const payload: any = args?.[0] ?? {};
    await invoke('send_danmu', { payload });
  } catch (error: any) {
    emitEvent('msg-tips', error?.message || String(error));
  }
};

const updateRoom = async (args: unknown[]) => {
  try {
    const payload: any = args?.[0] ?? {};
    const res = (await invoke('update_room_title', { payload })) as any;
    if (res?.code === 0) {
      emitEvent('msg-tips', '修改成功');
    } else {
      emitEvent('msg-tips', res?.msg || '修改失败');
    }
  } catch (error: any) {
    emitEvent('msg-tips', error?.message || String(error));
  }
};

const stopLive = () => {
  if (liveInstance) {
    try {
      liveInstance.close();
    } catch (_e) {
      // ignore
    }
    liveInstance = null;
  }
};

const extractWsConf = (res: any): { token: string; address: string } | null => {
  const data = res?.data;
  const token = data?.token;
  const hostFromList = data?.host_list?.[0]?.host;
  const hostFromServerList = data?.host_server_list?.[0]?.host;
  const host = hostFromList || hostFromServerList;
  if (!token || !host) return null;
  return { token, address: `wss://${host}/sub` };
};

const startLive = async (args: unknown[]) => {
  try {
    const roomId = Number(args?.[0]);
    const uid = Number(args?.[1] || storeCache.uid || 0);
    if (!roomId) {
      emitEvent('msg-tips', '房间号无效');
      return;
    }

    const cookieParts = [];
    if (storeCache.SESSDATA)
      cookieParts.push(`SESSDATA=${storeCache.SESSDATA}`);
    if (storeCache.csrf) cookieParts.push(`bili_jct=${storeCache.csrf}`);
    const cookie = cookieParts.join('; ');
    const headers: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Referer: `https://live.bilibili.com/${roomId}`,
      Origin: 'https://live.bilibili.com',
      Accept: 'application/json, text/plain, */*',
    };
    if (cookie) headers.Cookie = cookie;

    const primary = await tauriGetJson(
      `https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id=${roomId}&type=0`,
      headers
    );
    let conf = extractWsConf(primary);

    if (!conf) {
      const fallback = await tauriGetJson(
        `https://api.live.bilibili.com/room/v1/Danmu/getConf?room_id=${roomId}&platform=pc&player=web`,
        headers
      );
      conf = extractWsConf(fallback);
    }

    if (!conf) {
      const apiCode = primary?.code;
      const apiMsg = primary?.message || primary?.msg || 'unknown';
      emitEvent(
        'msg-tips',
        `弹幕连接初始化失败 (code=${apiCode}, msg=${apiMsg})`
      );
      return;
    }

    const { token, address } = conf;
    if (token) {
      storeCache.key = token;
      saveStore();
      void invoke('store_set', { key: 'key', val: token });
    }

    stopLive();
    liveInstance = new LiveWS(roomId, {
      uid,
      key: token,
      buvid: String(storeCache.buvid2 || ''),
      protover: 3,
      address,
    });

    liveInstance.on('open', () =>
      emitEvent('main-process-message', 'trying connect to server······')
    );
    liveInstance.on('live', () =>
      emitEvent('main-process-message', 'success connected server')
    );
    liveInstance.on('error', (err: any) => {
      emitEvent(
        'msg-tips',
        `弹幕连接失败: ${err?.message || 'socket error'} (${address})`
      );
    });
    liveInstance.on('close', () => {
      emitEvent('main-process-message', 'danmu socket closed');
    });
    liveInstance.on('msg', (data: any) => {
      if (data?.cmd === 'ONLINE_RANK_COUNT') {
        const online = data?.data?.online_count || data?.data?.count || 0;
        emitEvent('update-online', online);
      }
      emitEvent('update-msg', data);
    });
  } catch (error: any) {
    emitEvent('msg-tips', error?.message || String(error));
  }
};

const emitWindowName = () => {
  const name = window.location.search.replace('?', '') || 'main';
  emitEvent('create_windows_name', name);
};

const syncStoreFromRust = async () => {
  try {
    const all = (await invoke('store_dump')) as StoreShape;
    if (all && typeof all === 'object') {
      storeCache = { ...all, ...storeCache };
      saveStore();
    }
  } catch (_e) {
    // ignore when running in pure web mode
  }
};

readStore();
void syncStoreFromRust().finally(emitWindowName);
void listen('theme:change', (event) => {
  emitEvent('theme:change', event.payload);
});
void listen('opacity:change', (event) => {
  emitEvent('opacity:change', event.payload);
});
void listen('app-font:change', (event) => {
  emitEvent('app-font:change', event.payload);
});
void listen('dm-font:change', (event) => {
  emitEvent('dm-font:change', event.payload);
});

window.removeLoading = () => {};

window.electron = {
  store: {
    get: (key: string) => storeCache[key],
    set: (key: string, val: any) => {
      storeCache[key] = val;
      saveStore();
      void invoke('store_set', { key, val }).catch(() => {});
    },
  },
  dialog: {
    pickFolder: async () => {
      try {
        const result = (await invoke('pick_folder')) as string | null;
        return result || null;
      } catch (_e) {
        return null;
      }
    },
  },
  ipcRenderer: {
    sendMessage: (channel: string, args: unknown[] | unknown) => {
      const normalizedArgs = Array.isArray(args) ? args : [args];
      if (channel === 'sendDanmu') {
        void sendDanmu(normalizedArgs);
        return;
      }
      if (channel === 'updateRoomTitle') {
        void updateRoom(normalizedArgs);
        return;
      }
      if (channel === 'onLive') {
        void startLive(normalizedArgs);
        return;
      }
      if (channel === 'closeWindow' && normalizedArgs.includes('dm-close')) {
        stopLive();
      }
      if (channel === 'theme:change') {
        emitEvent('theme:change', normalizedArgs);
      }
      if (channel === 'opacity:change') {
        emitEvent('opacity:change', normalizedArgs);
      }
      if (channel === 'app-font:change') {
        emitEvent('app-font:change', normalizedArgs);
      }
      if (channel === 'dm-font:change') {
        emitEvent('dm-font:change', normalizedArgs);
      }
      void invoke('ipc_send_message', { channel, args: normalizedArgs }).catch(
        (e) => {
          console.error(`[ipc_send_message] ${channel} failed`, e);
        }
      );
    },
    updateRoomTitle: (channel: string, args: unknown[] | unknown) => {
      const normalizedArgs = Array.isArray(args) ? args : [args];
      if (channel === 'updateRoomTitle') {
        void updateRoom(normalizedArgs);
        return;
      }
      void invoke('ipc_send_message', { channel, args: normalizedArgs }).catch(
        () => {}
      );
    },
    spaceInfo: (channel: string, args: unknown[] | unknown) => {
      const normalizedArgs = Array.isArray(args) ? args : [args];
      void invoke('ipc_send_message', { channel, args: normalizedArgs }).catch(
        () => {}
      );
    },
  },
};

window.darkMode = {
  toggle: (_checked: boolean) => false,
};

window.theme = {
  change: (cb: Listener) => onEvent('theme:change', cb),
};

window.opacity = {
  change: (cb: Listener) => onEvent('opacity:change', cb),
};

window.appFont = {
  change: (cb: Listener) => onEvent('app-font:change', cb),
};

window.dmFont = {
  change: (cb: Listener) => onEvent('dm-font:change', cb),
};

window.danmuApi = {
  onUpdateOnliner: (cb: Listener) => onEvent('update-online', cb),
  onUpdateMsg: (cb: Listener) => onEvent('update-msg', cb),
  mainProcessMessage: (cb: Listener) => onEvent('main-process-message', cb),
  updateMessage: (cb: Listener) => onEvent('update-message', cb),
  createWindowsName: (cb: Listener) => onEvent('create_windows_name', cb),
  msgTips: (cb: Listener) => onEvent('msg-tips', cb),
  downProgress: (cb: Listener) => onEvent('down-progress', cb),
  spaceInfo: (cb: Listener) => onEvent('space_info', cb),
  loadPlugins: (cb: Listener) => onEvent('load_plugins', cb),
};
