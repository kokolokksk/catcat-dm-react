export interface BiliBiliDanmu {
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
  [propName: string]: any;
}
