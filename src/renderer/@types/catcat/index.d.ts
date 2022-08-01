declare interface BiliBiliDanmu {
  type: number;
  origin?: object;
  uid: number;
  nickname: string;
  content?: string;
  price: number | 0;
  giftName?: string;
  giftType?: number;
  giftNum: number;
  color?: string;
  borderColor?: string;
  priceColor?: string;
  noBorder?: boolean;
  giftImg?: string;
  timestamp: number;
  fansLevel?: number;
  fansName?: string;
  avatarFace?: string;
  [propName: string]: number | object | 0 | boolean | string | undefined;
}

declare interface MuaConfig {
  roomid: number;
  clientId?: string;
  ttsDanmu?: boolean;
  ttsGift?: boolean;
  ttsKey?: string;
  alwaysOnTop?: boolean;
  catdb?: boolean;
  dmTs?: string;
  SESSDATA?: string;
  csrf?: string;
  v1?: string;
  v2?: string;
  fansDisplay?: string;
  darkMode?: boolean;
  proxyApi?: boolean;
  sessionId?: string;
  started?: boolean;
  count: number;
  wave?: boolean;
  [propName: string]: number|object|0|boolean|string|undefined;
}
export { BiliBiliDanmu, MuaConfig };
