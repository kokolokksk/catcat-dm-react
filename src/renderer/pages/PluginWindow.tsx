// /* eslint-disable jsx-a11y/anchor-is-valid */
// import { createStandaloneToast } from '@chakra-ui/toast';
// import { BiliBiliDanmu, MuaConfig } from 'renderer/@types/catcat';
// import dayjs from 'dayjs';
// import React, { useRef } from 'react';
// import CatLog from 'renderer/utils/CatLog';
// import * as CONSTANT from 'renderer/@types/catcat/constan';
// import { set } from 'electron-json-storage';
// import { catConfigItem, getNewSessionId, transformMsg } from 'renderer/components/CatCat';

// type StateType = {
//   htmlContent: any;
//   pause: boolean;
//   comeInLastMinute: number;
//   count: number;
//   allDmList: { list: Array<BiliBiliDanmu>; autoHeight: number };
//   scList: { list: Array<BiliBiliDanmu>; autoHeight: number };
//   comeInList: Array<BiliBiliDanmu>;
//   muaConfig: MuaConfig;
// };

// // eslint-disable-next-line @typescript-eslint/ban-types
// type PropType = {};

// interface PluginWindow {
//   state: StateType;
//   props: PropType;
// }
// const { toast } = createStandaloneToast();

// class PluginWindow extends React.Component {
//   listHeightRef: any = '';

//   popoverRef: any = '';

//   loaded: boolean = false;

//   count: number = 0;

//   // eslint-disable-next-line global-require
//   speakStatus = false;

//   ttsOk = false;

//   speakDMList: Array<BiliBiliDanmu> = [];

//   initMsg: BiliBiliDanmu = {
//     keyy: 0,
//     type: 1,
//     uid: 123,
//     content: `${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
//     avatarFace: CONSTANT.APP_ICON,
//     nickname: 'catcat',
//     timestamp: new Date().getTime(),
//     price: 0,
//     giftNum: 0,
//   };

//   constructor(props: PropType) {
//     const muaConfig: MuaConfig = {
//       count: 0,
//       roomid: 0,
//       clientId: '',
//       ttsDanmu: false,
//       ttsGift: false,
//       ttsKey: '',
//       alwaysOnTop: false,
//       catdb: false,
//       dmTs: '',
//       SESSDATA: '',
//       csrf: '',
//       v1: '',
//       v2: '',
//       fansDisplay: '',
//       darkMode: false,
//       proxyApi: false,
//       sessionId: getNewSessionId(),
//       started: true,
//       wave: false,
//       theme: 'light',
//       real_roomid: 0,
//       area_id: 102,
//       parent_area_id: 2,
//       danmuDir: '',
//       uid: 0,
//     };
//     super(props);
//     const arr = catConfigItem.map((item) =>
//       window.electron.store.get(item.name)
//     );
//     arr.map((item: any, index: number) => {
//       CatLog.console(item);
//       const k = catConfigItem[index].name as string;
//       muaConfig[k] = item;

//       return '';
//     });
//     this.state = {
//       htmlContent: '',
//       comeInLastMinute: 0,
//       count: 0,
//       allDmList: {
//         list: [this.initMsg],
//         autoHeight: 310,
//       },
//       scList: {
//         list: [],
//         autoHeight: 310,
//       },
//       comeInList: [],
//       muaConfig,
//       pause: false,
//     };
//   }

//   componentDidMount() {
//     const { muaConfig, allDmList, scList, comeInList, pause } = this.state;
//     this.connectLive();
//     window.danmuApi.loadPlugins((_event: any, data: any) => {
//       console.info(data);

//       const { name } = data;
//       // d ata.path.replace(/\\/g, '\\\\');
//       console.info(name);

//       import(`C://Users//Public//Roaming//catcat-dm-react//plugins//${name}.js`).then((res: any) => {
//         console.info(res);
//         this.setState({
//           htmlContent: res.default.html(),
//         }, () => {
//           res.default.events();
//         }
//         )
//        // res.default.events();
//        window.danmuApi.onUpdateMsg(async (_event: any, data: any) => {
//         // eslint-disable-next-line no-plusplus
//         // eslint-disable-next-line eqeqeq
//         const dm = await transformMsg(data, muaConfig.proxyApi as boolean, {
//           platform: 'pc',
//           room_id: muaConfig.real_roomid as string,
//           area_parent_id: muaConfig.parent_area_id as string,
//           area_id: muaConfig.area_id as string,
//         });
//         if (dm && stringify(dm.data) !== '{}') {
//           // this.uploadDanmu(dm);
//           this.writeDanmuToFile(dm, muaConfig.roomid, muaConfig.danmuDir);
//           let merged = false;
//           if (dm.type !== 3) {
//             const listSize = allDmList.list.length;
//             const max = Math.min(listSize, 7);
//             CatLog.console(max);
//             const lastList = allDmList.list.slice(-max);
//             for (let index = 0; index < lastList.length; index += 1) {
//               const tempDanmu = lastList[index];
//               const needmerge = this.needMergeDanmu(tempDanmu, dm);
//               CatLog.console('check mergeble');
//               if (needmerge) {
//                 merged = true;
//                 if (dm.type === 1) {
//                   allDmList.list[index + (listSize - max)].content += '*2';
//                 } else if (dm.type === 2) {
//                   allDmList.list[index + (listSize - max)].content = `赠送了${
//                     tempDanmu.giftNum + dm.giftNum
//                   }个${dm.giftName}`;
//                   allDmList.list[index + (listSize - max)].price =
//                     (tempDanmu.price ? tempDanmu.price : 0) +
//                     (dm.price ? dm.price : 0);
//                   allDmList.list[index + (listSize - max)].giftNum =
//                     (tempDanmu.giftNum ? tempDanmu.giftNum : 0) +
//                     (dm.giftNum ? dm.giftNum : 0);
//                 }
//               }
//             }
//             dm.keyy = data.keyy;
//             if (!merged) {
//               if (allDmList.list.length >= 7) {
//                 allDmList.list.shift();
//                 CatLog.info('clear some damuka');
//               }
//               if (dm.type === 5) {
//                 scList.list.push(dm);
//               }
//               allDmList.list.push(dm);
//               if (dm.content?.startsWith('【') && dm.content?.endsWith('】')) {
//                 const content = dm.content
//                   .replaceAll('【', '')
//                   .replaceAll('】', '');
//                 const req = {
//                   body: {
//                     messages: [{ role: 'user', content }],
//                   },
//                 };
//                 const res: any = {
//                   status: 200,
//                   json: '',
//                 };
//                 // chatgpt(req, res, muaConfig);
//               }
//               if (!pause) {
//                 allDmList.autoHeight = 310 - this.listHeightRef?.clientHeight;
//               }
//             }
//             CatLog.console(allDmList);
//             this.setState({
//               allDmList,
//             });
//             if (this.ttsOk || muaConfig.ttsServerUrl) {
//               // this.speakDanmuReal(dm);
//             }
//           } else {
//             comeInList.splice(0);
//             comeInList.push(dm);
//             // setComeInLisnt([...comeInLisnt,dm])githubtrans translateYtranslateY
//             this.setState({ comeInList });
//             // eslint-disable-next-line no-plusplus
//             const { comeInLastMinute } = this.state;
//             CatLog.console(comeInLastMinute);
//             this.setState({
//               comeInLastMinute: comeInLastMinute + 1,
//             });
//           }

//           // CatLog.console(dm)
//           }
//           res.default.dataChannels(allDmList);
//         });
//         return res.default;
//       });
//     });
//   }

//   componentDidUpdate(prevProps: any, prevState: any) {
//     // FIXME bad usage
//     CatLog.console('componentDidUpdate');
//   }

//   componentWillUnmount() {}

//   connectLive = async () => {
//     const { muaConfig } = this.state;
//     let roomId;
//     new Promise(function (resolve, reject) {
//       resolve(window.electron.store.get('real_roomid'));
//     })
//       .then((res) => {
//         window.electron.ipcRenderer.sendMessage('onLive', [res, muaConfig.uid]);
//         window.danmuApi.onUpdateOnliner((_event: any, value: any) => {
//           this.setState({ count: value });
//         });
//         return '';
//       })
//       .catch((e) => {
//         CatLog.console(e);
//       });
//   };

//   needMergeDanmu = (tempDanmu: BiliBiliDanmu, dm: BiliBiliDanmu) => {
//     let same = false;
//     if (
//       (tempDanmu.type === dm.type &&
//         tempDanmu.type === 1 &&
//         tempDanmu.content === dm.content &&
//         tempDanmu.uid === dm.uid) ||
//       (tempDanmu.type === dm.type &&
//         tempDanmu.type === 2 &&
//         tempDanmu.price < 1000 &&
//         tempDanmu.giftName === dm.giftName)
//     ) {
//       same = true;
//     }
//     return same;
//   };

//   render() {
//     const { htmlContent } = this.state;
//     console.info(htmlContent);
//     return (
//       <>
//         <div dangerouslySetInnerHTML={{ __html: this.state.htmlContent }} />
//       </>
//     );
//   }
// }

// export default PluginWindow;
