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

const transformMsg = (data: any | undefined) => {
  const danmu: { [K: string]: any } = {};
  // console.info(data)
  // xxxxxxx
  // eslint-disable-next-line default-case
  switch (data.cmd) {
    case 'DANMU_MSG':
      danmu.type = 1;
      danmu.origin = data;
      // eslint-disable-next-line prefer-destructuring
      danmu.uid = data.info[2][0];
      // eslint-disable-next-line prefer-destructuring
      danmu.nickname = data.info[2][1];
      // eslint-disable-next-line prefer-destructuring
      danmu.content = data.info[1];
      // eslint-disable-next-line prefer-destructuring
      danmu.timestamp = data.info[9];
      // eslint-disable-next-line prefer-destructuring
      danmu.fansLevel = data.info[3][0];
      // eslint-disable-next-line prefer-destructuring
      danmu.fansName = data.info[3][1];
      break;
    case 'SEND_GIFT':
      danmu.type = 2;
      danmu.origin = data;
      danmu.giftName = data.data.giftName;
      danmu.giftType = data.data.giftType;
      danmu.uid = data.data.uid;
      danmu.nickname = data.data.uname;
      danmu.timestamp = data.data.timestamp;
      danmu.content = `赠送了${data.data.giftName}`;
      break;
    case 'INTERACT_WORD':
      danmu.type = 3;
      danmu.uid = data.data.uid;
      danmu.nickname = data.data.uname;
      break;
  }
  return danmu;
};
export { catConfigItem, giftData, getNewSessionId, transformMsg };
