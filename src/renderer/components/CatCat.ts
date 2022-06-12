// const utils = () =>{
//  let items = [
//     { name:'roomid',type:'number' },
//     { name:'clientId',type:'string' },
//     { name:'tts',type:'boolean' },
//     { name:'ttsGift',type:'boolean' },
//     { name:'waveD',type:'boolean' },
//     { name:'alwaysOnTop',type:'boolean' },
//     { name:'catdb',type:'boolean' },
//     { name:'dmTs',type:'string' },
//     { name:'bgc',type:'string' },
//     { name:'btc',type:'string' },
//     { name:'bbc',type:'string' },
//     { name:'dmc',type:'string' },
//     { name:'dmf',type:'string' },
//     { name:'voice',type:'string' },
//     { name:'SESSDATA',type:'string' },
//     { name:'csrf',type:'string' },
//     { name:'v1',type:'string' },
//     { name:'v2',type:'string' },
//     { name:'fansDisplay',type:'boolean' }

import axios from 'axios';
import { stringify } from 'querystring';

//     ]
// const getConfigItem = () => {
//   return items
// }
// const getNewSessionId = () => {
//   let index = 0
//   let charArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', '1', '2', '9']
//   let stringBuilder = ''
//   while (index < 10) {
//     const randomIndex = Math.floor(Math.random() * 10) + 7
//     stringBuilder += charArray[randomIndex]
//     index++
//   }
//   return stringBuilder
// }
// }

const catConfigItem = [
  { name: 'roomid', type: 'number' },
  { name: 'clientId', type: 'string' },
  { name: 'tts', type: 'boolean' },
  { name: 'ttsGift', type: 'boolean' },
  { name: 'waveD', type: 'boolean' },
  { name: 'alwaysOnTop', type: 'boolean' },
  { name: 'catdb', type: 'boolean' },
  { name: 'dmTs', type: 'string' },
  { name: 'bgc', type: 'string' },
  { name: 'btc', type: 'string' },
  { name: 'bbc', type: 'string' },
  { name: 'dmc', type: 'string' },
  { name: 'dmf', type: 'string' },
  { name: 'voice', type: 'string' },
  { name: 'SESSDATA', type: 'string' },
  { name: 'csrf', type: 'string' },
  { name: 'v1', type: 'string' },
  { name: 'v2', type: 'string' },
  { name: 'fansDisplay', type: 'boolean' },
  { name: 'darkMode', type: 'boolean' },
  { name: 'proxyApi', type: 'boolean' },
];

const giftData = [
  {
    name: '辣条',
    img: 'https://i0.hdslb.com/bfs/live/07d4dad91d7f68d92cb6a324ad9395ae2adefd47.webp',
  },
  {
    name: 'B坷垃',
    img: 'https://i0.hdslb.com/bfs/live/ad01f5b786fa6272adf0e985576b20a93ea11c6c.webp',
  },
  {
    name: '小花花',
    img: 'https://i0.hdslb.com/bfs/live/a4c8a134c059665d8d477a803b12430222d8e7b8.webp',
  },
  {
    name: '这个好哎',
    img: 'https://i0.hdslb.com/bfs/live/f3057d838ff4c2f7b5d930db9c03ed6513aaf36c.webp',
  },
  {
    name: '白银宝盒',
    img: 'https://i0.hdslb.com/bfs/live/fd1d1be20bbdfef70220e1d789e12535de7702a3.webp',
  },
  {
    name: '紫金宝盒',
    img: 'https://i0.hdslb.com/bfs/live/452904539bec706d776297f8eaefdcab23f0a913.webp',
  },
  {
    name: '古董八音盒',
    img: 'https://i0.hdslb.com/bfs/live/12aa8c41056b6f81c5e188e9718710194666e385.webp',
  },
  {
    name: '发红包',
    img: 'https://i0.hdslb.com/bfs/live/95d10e699a6368d638b00b10ec4362c19ae32bd7.webp',
  },
  {
    name: '超感摩托',
    img: 'https://i0.hdslb.com/bfs/live/2b0607ee7fbcc96ef9fe0344bb3587a2df944be8.webp',
  },
  {
    name: '次元之城',
    img: 'https://i0.hdslb.com/bfs/live/8809417dc5632138f1b45e07e39edc379bd514d3.webp',
  },
  {
    name: '牛哇牛哇',
    img: 'https://i0.hdslb.com/bfs/live/419bf4e5bd6fb4e1185fb73a466c6c884d0f2ba2.webp',
  },
  {
    name: '情书',
    img: 'https://i0.hdslb.com/bfs/live/e9a574947740617a907184e8e4d6792aa571ca32.webp',
  },
  {
    name: '告白花束',
    img: 'https://i0.hdslb.com/bfs/live/1bca516b95fa878407e96c640567221a74f8cadf.webp',
  },
  {
    name: 'D言D语',
    img: 'https://i0.hdslb.com/bfs/live/9bc9a5e03e7c33d386a1e8f5ad3bbf25b5033789.webp',
  },
  {
    name: '疯狂心动',
    img: 'https://i0.hdslb.com/bfs/live/8cf4b349611da383e2d9db196c16fb8b18d3f1ca.webp',
  },
  {
    name: '愿望水晶球',
    img: 'https://i0.hdslb.com/bfs/live/0f8dd4dda2d0ff22bca99a4a2cef7ede37902bf2.webp',
  },
  {
    name: '探索者启航',
    img: 'https://i0.hdslb.com/bfs/live/e77c2a95958b4dfb9e386af357a12a2848995c7d.webp',
  },
  {
    name: '打call',
    img: 'https://i0.hdslb.com/bfs/live/7dad99cce8772d1045dec6916a55642491989819.webp',
  },
  {
    name: '干杯',
    img: 'https://i0.hdslb.com/bfs/live/817e0ef58cee5aa5b143459c46c8ab288da5db25.webp',
  },
  {
    name: '撒花',
    img: 'https://i0.hdslb.com/bfs/live/9e9191dbfc72d26ed78e3fafe3fa10c14e2f19b8.webp',
  },
  {
    name: '守护之翼',
    img: 'https://i0.hdslb.com/bfs/live/a83bf6648b5585e6117afc60bd9826a989f043f5.webp',
  },
  {
    name: '为你加冕',
    img: 'https://i0.hdslb.com/bfs/live/dbd610f5d5a51481308715fd594a30b480a58ea7.webp',
  },
  {
    name: '节奏风暴',
    img: 'https://i0.hdslb.com/bfs/live/99c26fd0cf591a7639e862ed1f20bbc337578ce3.webp',
  },
  {
    name: 'BLS能量石',
    img: 'https://i0.hdslb.com/bfs/live/4ce8119c246f17fcad311e4c2b1feec97b41d060.webp',
  },
  {
    name: 'PK票',
    img: 'https://i0.hdslb.com/bfs/live/6da3775ae5b7169836a3df68909dbb2292d3776d.webp',
  },
  {
    name: '心动卡',
    img: 'https://i0.hdslb.com/bfs/live/9e8a419973840fae4e62089476a0c39d367788e1.webp',
  },
  {
    name: '泡泡机',
    img: 'https://i0.hdslb.com/bfs/live/412f3820c32233fb69293f2f1185fe742918c842.webp',
  },
  {
    name: '爱的魔力',
    img: 'https://i0.hdslb.com/bfs/live/b927abad4749f050b3a5fb514aa5c64861e0ecc1.webp',
  },
  {
    name: '摩天轮',
    img: 'https://i0.hdslb.com/bfs/live/c69a34217f4b60ca99804fa54d675483703fdaab.webp',
  },
  {
    name: '转运锦鲤',
    img: 'https://i0.hdslb.com/bfs/live/182e990a43dc1f6b9b03fb77d478856cdb5410e9.webp',
  },
  {
    name: '领航者飞船',
    img: 'https://i0.hdslb.com/bfs/live/3ae0aec459c1ff6e2dc82146fb6ac5f730386117.webp',
  },
  {
    name: '海湾之旅',
    img: 'https://i0.hdslb.com/bfs/live/a4667de09de544d776a62f1cc9d2d0678fc06dab.webp',
  },
  {
    name: '海底历险记',
    img: 'https://i0.hdslb.com/bfs/live/0df23fb6a6dcae2f6cccd8a6646766e1f1f9e99a.webp',
  },
  {
    name: '友谊的小船',
    img: 'https://i0.hdslb.com/bfs/live/24a007b0299c5e7f652d9eec0e0a51afd5a652f3.webp',
  },
  {
    name: '冲浪',
    img: 'https://i0.hdslb.com/bfs/live/a717aee458bc31fa4737d0b2fffe89d9b56f410c.webp',
  },
  {
    name: '鸿运小电视',
    img: 'https://i0.hdslb.com/bfs/live/5a02f041d03912d589b8abba6b8680c6b52bc09b.webp',
  },
];

const emotionData = [
  {
    name: '赞',
    img: 'https://i0.hdslb.com/bfs/live/bbd9045570d0c022a984c637e406cb0e1f208aa9.png@20h.webp',
  },
  {
    name: '保熟吗',
    img: 'https://i0.hdslb.com/bfs/live/0e28444c8e2faef3169e98e1a41c487144d877d4.png@65w.webp',
  },
  {
    name: '比心',
    img: 'https://i0.hdslb.com/bfs/live/1ba5126b10e5efe3e4e29509d033a37f128beab2.png@65w.webp',
  },
  {
    name: '赢麻了',
    img: 'https://i0.hdslb.com/bfs/live/1d4c71243548a1241f422e90cd8ba2b75c282f6b.png@65w.webp',
  },
  {
    name: '烦死了',
    img: 'https://i0.hdslb.com/bfs/live/2af0e252cc3082384edf8165751f6a49eaf76d94.png@65w.webp',
  },
  {
    name: '保熟吗',
    img: 'https://i0.hdslb.com/bfs/live/0e28444c8e2faef3169e98e1a41c487144d877d4.png@65w.webp',
  },
  {
    name: '好耶',
    img: 'https://i0.hdslb.com/bfs/live/4cf43ac5259589e9239c4e908c8149d5952fcc32.png@65w.webp',
  },
  {
    name: '禁止套娃',
    img: 'https://i0.hdslb.com/bfs/live/6a644577437d0bd8a314990dd8ccbec0f3b30c92.png@65w.webp',
  },
  {
    name: '妙啊',
    img: 'https://i0.hdslb.com/bfs/live/7b7a2567ad1520f962ee226df777eaf3ca368fbc.png@65w.webp',
  },
  {
    name: '咸鱼翻身',
    img: 'https://i0.hdslb.com/bfs/live/7db4188c050f55ec59a1629fbc5a53661e4ba780.png@65w.webp',
  },
  {
    name: 'mua',
    img: 'https://i0.hdslb.com/bfs/live/08f1aebaa4d9c170aa79cbafe521ef0891bdf2b5.png@65w.webp',
  },
  {
    name: '干杯',
    img: 'https://i0.hdslb.com/bfs/live/8fedede4028a72e71dae31270eedff5f706f7d18.png@65w.webp',
  },
  {
    name: '暗中观察',
    img: 'https://i0.hdslb.com/bfs/live/18af5576a4582535a3c828c3ae46a7855d9c6070.png@65w.webp',
  },
  {
    name: '钝角',
    img: 'https://i0.hdslb.com/bfs/live/38cf68c25d9ff5d364468a062fc79571db942ff3.png@65w.webp',
  },
  {
    name: '有点东西',
    img: 'https://i0.hdslb.com/bfs/live/39e518474a3673c35245bf6ef8ebfff2c003fdc3.png@65w.webp',
  },
  {
    name: '???',
    img: 'https://i0.hdslb.com/bfs/live/40db7427f02a2d9417f8eeed0f71860dfb28df5a.png@65w.webp',
  },
  {
    name: '来了来了',
    img: 'https://i0.hdslb.com/bfs/live/61e790813c51eab55ebe0699df1e9834c90b68ba.png@65w.webp',
  },
  {
    name: '上热榜',
    img: 'https://i0.hdslb.com/bfs/live/83d5b9cdaaa820c2756c013031d34dac1fd4156b.png@65w.webp',
  },
  {
    name: '贴贴',
    img: 'https://i0.hdslb.com/bfs/live/88b49dac03bfd5d4cb49672956f78beb2ebd0d0b.png@65w.webp',
  },
  {
    name: 'awsl',
    img: 'https://i0.hdslb.com/bfs/live/328e93ce9304090f4035e3aa7ef031d015bbc915.png@65w.webp',
  },
  {
    name: '牛牛牛',
    img: 'https://i0.hdslb.com/bfs/live/343f7f7e87fa8a07df63f9cba6b776196d9066f0.png@65w.webp',
  },
  {
    name: '多谢款待',
    img: 'https://i0.hdslb.com/bfs/live/4609dad97c0dfa61f8da0b52ab6fff98e0cf1e58.png@65w.webp',
  },
  {
    name: '雀食',
    img: 'https://i0.hdslb.com/bfs/live/7251dc7df587388a3933743bf38394d12a922cd7.png@65w.webp',
  },
  {
    name: '中奖喷雾',
    img: 'https://i0.hdslb.com/bfs/live/9640c6ab1a848497b8082c2111d44493c6982ad3.png@65w.webp',
  },
  {
    name: '颠个勺',
    img: 'https://i0.hdslb.com/bfs/live/625989e78079e3dc38d75cb9ac392fe8c1aa4a75.png@65w.webp',
  },
  {
    name: '离谱',
    img: 'https://i0.hdslb.com/bfs/live/9029486931c3169c3b4f8e69da7589d29a8eadaa.png@20h.webp',
  },
  {
    name: '打扰了',
    img: 'https://i0.hdslb.com/bfs/live/a9e2acaf72b663c6ad9c39cda4ae01470e13d845.png@65w.webp',
  },
  {
    name: '23333',
    img: 'https://i0.hdslb.com/bfs/live/a98e35996545509188fe4d24bd1a56518ea5af48.png@65w.webp',
  },
  {
    name: '泪目',
    img: 'https://i0.hdslb.com/bfs/live/aa93b9af7ba03b50df23b64e9afd0d271955cd71.png@65w.webp',
  },
  {
    name: '笑死',
    img: 'https://i0.hdslb.com/bfs/live/aa48737f877cd328162696a4f784b85d4bfca9ce.png@65w.webp',
  },
  {
    name: '鸡汤来咯',
    img: 'https://i0.hdslb.com/bfs/live/b371151503978177b237afb85185b0f5431d0106.png@65w.webp',
  },
  {
    name: '好家伙',
    img: 'https://i0.hdslb.com/bfs/live/c2650bf9bbc79b682a4b67b24df067fdd3e5e9ca.png@65w.webp',
  },
  {
    name: '那我走',
    img: 'https://i0.hdslb.com/bfs/live/c3326ceb63587c79e5b4106ee4018dc59389b5c0.png@65w.webp',
  },
  {
    name: '下次一定',
    img: 'https://i0.hdslb.com/bfs/live/cc2652cef69b22117f1911391567bd2957f27e08.png@65w.webp',
  },
  {
    name: '很有精神',
    img: 'https://i0.hdslb.com/bfs/live/e91cbe30b2db1e624bd964ad1f949661501f42f8.png@65w.webp',
  },
  {
    name: '不上Ban',
    img: 'https://i0.hdslb.com/bfs/live/eff44c1fc03311573e8817ca8010aca72404f65c.png@65w.webp',
  },
  {
    name: '打call',
    img: 'https://i0.hdslb.com/bfs/live/fa1eb4dce3ad198bb8650499830560886ce1116c.png@65w.webp',
  },
  {
    name: '我不理解',
    img: 'https://i0.hdslb.com/bfs/live/fdefb600cf40d8e5a7e566cc97058b47d946cad6.png@65w.webp',
  },
  {
    name: '就这',
    img: 'https://i0.hdslb.com/bfs/live/ff840c706fffa682ace766696b9f645e40899f67.png@65w.webp',
  },
  // {
  //   name: '痛苦面具',
  //   img: 'https://i0.hdslb.com/bfs/live/ff840c706fffa682ace766696b9f645e40899f67.png@65w.webp',
  // },
  // {
  //   name: '憨厚',
  //   img: 'https://i0.hdslb.com/bfs/live/ff840c706fffa682ace766696b9f645e40899f67.png@65w.webp',
  // },
];

const getNewSessionId = () => {
  let index = 0;
  const charArray = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    '1',
    '2',
    '9',
  ];
  let stringBuilder = '';
  while (index < 10) {
    const randomIndex = Math.floor(Math.random() * 10) + 7;
    stringBuilder += charArray[randomIndex];
    // eslint-disable-next-line no-plusplus
    index++;
  }
  return stringBuilder;
};

async function setFace(danmu: any, proxyApi: boolean) {
  let url = `https://db.loli.monster/cat/client/getUserInfo?uid=${danmu.uid}`;
  if (!proxyApi) {
    url = `https://api.live.bilibili.com/live_user/v1/Master/info?uid=${danmu.uid}`;
  }
  await axios({
    url,
    // https://api.live.bilibili.com/live_user/v1/Master/info?uid=${danmu.uid}
  })
    // eslint-disable-next-line func-names
    // eslint-disable-next-line promise/always-return
    // eslint-disable-next-line @typescript-eslint/no-shadow
    // eslint-disable-next-line func-names
    // eslint-disable-next-line promise/always-return
    .then(function (response1) {
      // eslint-disable-next-line promise/always-return
      if (danmu) {
        if (proxyApi) {
          danmu.avatarFace = response1.data.face;
        } else {
          danmu.avatarFace = response1.data.data.info.face;
        }
        // response1.data.data.info.face
      }
    })
    // eslint-disable-next-line func-names
    .catch(function (error) {
      console.log(error);
    });
}

async function handleDanMuMSG(
  data: any,
  danmu: { [K: string]: any },
  proxyApi: boolean
) {
  danmu.type = 1;
  danmu.origin = data;
  // eslint-disable-next-line prefer-destructuring
  danmu.uid = data.info[2][0];
  // eslint-disable-next-line prefer-destructuring
  danmu.nickname = data.info[2][1];
  // eslint-disable-next-line prefer-destructuring
  danmu.content = data.info[1];
  if (danmu.content.indexOf('cat2') !== -1) {
    danmu.type = 2;
  }
  if (danmu.content.indexOf('cat4') !== -1) {
    danmu.type = 4;
    danmu.giftName = '提督';
    danmu.price = '1998000';
    danmu.origin = data;
    danmu.content = '续费了1个提督';
  }
  if (danmu.content.indexOf('cat5') !== -1) {
    danmu.type = 5;
    danmu.giftName = 'sc';
    danmu.content = 'sc测试';
    danmu.price = 30000;
    danmu.color = '#A3F6FF';
    danmu.borderColor = '#DBFFFD';
    danmu.priceColor = '#7DA4BD';
  }
  danmu.price = 0;
  danmu.noBorder = true;
  emotionData.forEach((item) => {
    if (item.name === danmu?.content) {
      danmu.type = 2;
      danmu.content = '';
      danmu.giftImg = item.img;
    }
  });
  // eslint-disable-next-line prefer-destructuring
  danmu.timestamp = data.info[9].ts;
  // eslint-disable-next-line prefer-destructuring
  danmu.fansLevel = data.info[3][0];
  // eslint-disable-next-line prefer-destructuring
  danmu.fansName = data.info[3][1];
  await setFace(danmu, proxyApi);
}

function handleSENDGIFT(data: any, danmu: { [K: string]: any }) {
  console.info('is gift msg');
  danmu.type = 2;
  danmu.noBorder = false;
  danmu.origin = data;
  danmu.giftName = data.data.giftName;
  danmu.giftType = data.data.giftType;
  danmu.uid = data.data.uid;
  danmu.nickname = data.data.uname;
  danmu.timestamp = data.data.timestamp;
  danmu.content = `赠送了${data.data.num}个${data.data.giftName}`;
  danmu.price = data.data.num * data.data.discount_price;
  danmu.avatarFace = data.data.face;
  giftData.forEach((item) => {
    if (item.name === danmu?.giftName) {
      danmu.giftImg = item.img;
    }
  });
}

const transformMsg = async (data: any | undefined, proxyApi: boolean) => {
  let danmu: { [K: string]: any } | undefined = {};
  // console.info(data)
  // xxxxxxx
  // eslint-disable-next-line default-case
  switch (data.cmd) {
    case 'DANMU_MSG':
      await handleDanMuMSG(data, danmu, proxyApi);
      break;
    case 'SEND_GIFT':
      handleSENDGIFT(data, danmu);
      break;
    case 'INTERACT_WORD':
      danmu.type = 3;
      danmu.uid = data.data.uid;
      danmu.nickname = data.data.uname;
      break;
    case 'GUARD_BUY':
      //   {
      //     "cmd": "GUARD_BUY",
      //     "data": {
      //         "uid": xxx,
      //         "username": "xxx",
      //         "guard_level": 3,
      //         "num": 1,
      //         "price": 198000,
      //         "gift_id": 10003,
      //         "gift_name": "舰长",
      //         "start_time": 1654828049,
      //         "end_time": 1654828049
      //     }
      // }
      //   {
      //     "cmd": "USER_TOAST_MSG",
      //     "data": {
      //         "anchor_show": true,
      //         "color": "#00D1F1",
      //         "dmscore": 90,
      //         "effect_id": 397,
      //         "end_time": 1654828049,
      //         "guard_level": 3,
      //         "is_show": 0,
      //         "num": 1,
      //         "op_type": 3,
      //         "payflow_id": "2206101026467132167746887",
      //         "price": 138000,
      //         "role_name": "舰长",
      //         "start_time": 1654828049,
      //         "svga_block": 0,
      //         "target_guard_count": 133,
      //         "toast_msg": "<%xxx%> 自动续费了舰长",
      //         "uid": xxx,
      //         "unit": "月",
      //         "user_show": true,
      //         "username": "xxx"
      //     }
      // }
      console.error('is GUARD_BUY');
      console.error(data);
      danmu.type = 4;
      danmu.ts = data.data.start_time;
      danmu.uid = data.data.uid;
      setFace(danmu, proxyApi);
      danmu.username = data.data.username;
      danmu.giftName = data.data.gift_name;
      // if (danmu.giftName === '舰长') {
      //   danmu.giftImg =
      //     'https://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/icon-l-3.402ac8f..png';
      // } else if (danmu.giftName === '提督') {
      //   danmu.giftImg =
      //     'https://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/icon-l-2.6f68d77..png';
      // } else if (danmu.giftName === '总督') {
      //   danmu.giftImg =
      //     'https://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/icon-l-1.fde1190..png';
      // }
      danmu.num = data.data.num;
      danmu.price = data.data.price * data.data.num;
      danmu.origin = data;
      danmu.content = `续费了${data.data.num}个${data.data.gift_name}`;
      danmu.nickname = data.data.username;
      break;
    case 'USER_TOAST_MSG':
      console.error('is USER_TOAST_MSG');
      console.error(data);
      danmu = undefined;
      break;
    case 'NOTICE_MSG':
      console.error('is NOTICE_MSG');
      console.error(data);
      danmu = undefined;
      break;
    case 'SUPER_CHAT_MESSAGE':
      //   {
      //     "cmd": "SUPER_CHAT_MESSAGE",
      //     "data": {
      //         "background_bottom_color": "#427D9E",
      //         "background_color": "#DBFFFD",
      //         "background_color_end": "#29718B",
      //         "background_color_start": "#4EA4C5",
      //         "background_icon": "",
      //         "background_image": "https://i0.hdslb.com/bfs/live/a712efa5c6ebc67bafbe8352d3e74b820a00c13e.png",
      //         "background_price_color": "#7DA4BD",
      //         "color_point": 0.7,
      //         "dmscore": 72,
      //         "end_time": 1654847874,
      //         "gift": {
      //             "gift_id": 12000,
      //             "gift_name": "醒目留言",
      //             "num": 1
      //         },
      //         "id": 4242153,
      //         "is_ranked": 1,
      //         "is_send_audit": 1,
      //         "medal_info": {
      //             "anchor_roomid": 7777,
      //             "anchor_uname": "xxx",
      //             "guard_level": 0,
      //             "icon_id": 0,
      //             "is_lighted": 1,
      //             "medal_color": "#6154c",
      //             "medal_color_border": 398668,
      //             "medal_color_end": 6850801,
      //             "medal_color_start": 398668,
      //             "medal_level": 27,
      //             "medal_name": "xxx",
      //             "special": "",
      //             "target_id": 8739477
      //         },
      //         "message": "xxx",
      //         "message_font_color": "#A3F6FF",
      //         "message_trans": "",
      //         "price": 50,
      //         "rate": 1000,
      //         "start_time": 1654847754,
      //         "time": 120,
      //         "token": "3A11DB43",
      //         "trans_mark": 0,
      //         "ts": 1654847754,
      //         "uid": xxx,
      //         "user_info": {
      //             "face": "xxx",
      //             "face_frame": "",
      //             "guard_level": 0,
      //             "is_main_vip": 0,
      //             "is_svip": 0,
      //             "is_vip": 0,
      //             "level_color": "#61c05a",
      //             "manager": 0,
      //             "name_color": "#666666",
      //             "title": "0",
      //             "uname": "xxx",
      //             "user_level": 19
      //         }
      //     },
      //     "roomid": xxx
      // }
      console.error('is SUPER_CHAT_MESSAGE');
      console.error(data);
      danmu.type = 5;
      danmu.giftName = data.data.gift.gift_name;
      danmu.content = data.data.message;
      danmu.avatarFace = data.data.user_info.face;
      danmu.nickname = data.data.user_info.uname;
      danmu.ts = data.data.ts;
      danmu.price = data.data.price * data.data.rate;
      danmu.color = data.data.message_font_color;
      danmu.borderColor = data.data.background_color;
      danmu.origin = data;
      break;
    default:
      danmu = undefined;
      break;
  }
  return danmu;
};
export { catConfigItem, giftData, getNewSessionId, transformMsg };
