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
export { catConfigItem, getNewSessionId, transformMsg };
