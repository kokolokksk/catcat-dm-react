/* eslint-disable jsx-a11y/anchor-is-valid */
import { Configuration, OpenAIApi } from 'openai';
import { createStandaloneToast } from '@chakra-ui/toast';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  List,
  ListItem,
  ListIcon,
  Divider,
  Button,
  Link,
} from '@chakra-ui/react';
import { stringify } from 'querystring';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { BiliBiliDanmu, MuaConfig } from 'renderer/@types/catcat';
import BackgroundWave from 'renderer/components/BackgroundWave';
import Titlebar from 'renderer/components/Titlebar';
import dayjs from 'dayjs';
import React from 'react';
import CatLog from 'renderer/utils/CatLog';
import SuperChatBar from 'renderer/components/SuperChatBar';
import BackgroundMiku from 'renderer/components/BackgroundMiku';
import * as CONSTANT from 'renderer/@types/catcat/constan';
import { MdCheckCircle, MdBlock, MdCopyAll, MdOpenInBrowser, MdLiveTv } from 'react-icons/md';
import axios from 'axios';
import {
  catConfigItem,
  getNewSessionId,
  transformMsg,
} from '../components/CatCat';

import Danmu from '../components/Danmu';
import ComeInDisplay from '../components/ComeInDisplay';
import ChatContainer from '../components/ChatContainer';

import styles from '../styles/danmu.module.scss';
import '../styles/dm_a.css';
import { rejects } from 'assert';

type StateType = {
  pause: boolean;
  comeInLastMinute: number;
  count: number;
  allDmList: { list: Array<BiliBiliDanmu>; autoHeight: number };
  scList: { list: Array<BiliBiliDanmu>; autoHeight: number };
  comeInList: Array<BiliBiliDanmu>;
  muaConfig: MuaConfig;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type PropType = {};

interface DanmuWindow {
  state: StateType;
  props: PropType;
}
const { toast } = createStandaloneToast();

const configuration = new Configuration({
  apiKey: 'sk-',
});

const openai = new OpenAIApi(configuration);

class DanmuWindow extends React.Component {
  listHeightRef: any = '';

  popoverRef: any = '';

  loaded: boolean = false;

  count: number = 0;

  // eslint-disable-next-line global-require
  sdk = require('microsoft-cognitiveservices-speech-sdk');

  speakStatus = false;

  ttsOk = false;

  speakDMList: Array<BiliBiliDanmu> = [];

  speechConfig!: {
    speechSynthesisLanguage: string;
    speechSynthesisVoiceName: string;
  };

  initMsg: BiliBiliDanmu = {
    keyy: 0,
    type: 1,
    uid: 123,
    content: `${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
    avatarFace: CONSTANT.APP_ICON,
    nickname: 'catcat',
    timestamp: new Date().getTime(),
    price: 0,
    giftNum: 0,
  };

  constructor(props: PropType) {
    const muaConfig: MuaConfig = {
      count: 0,
      roomid: 0,
      clientId: '',
      ttsDanmu: false,
      ttsGift: false,
      ttsKey: '',
      alwaysOnTop: false,
      catdb: false,
      dmTs: '',
      SESSDATA: '',
      csrf: '',
      v1: '',
      v2: '',
      fansDisplay: '',
      darkMode: false,
      proxyApi: false,
      sessionId: getNewSessionId(),
      started: true,
      wave: false,
      theme: 'light',
      real_roomid: 0,
      area_id: 102,
      parent_area_id: 2,
      danmuDir: '',
      uid: 0,
    };
    super(props);
    const arr = catConfigItem.map((item) =>
      window.electron.store.get(item.name)
    );
    arr.map((item: any, index: number) => {
      CatLog.console(item);
      const k = catConfigItem[index].name as string;
      muaConfig[k] = item;

      return '';
    });
    this.state = {
      comeInLastMinute: 0,
      count: 0,
      allDmList: {
        list: [this.initMsg],
        autoHeight: 310,
      },
      scList: {
        list: [],
        autoHeight: 310,
      },
      comeInList: [],
      muaConfig,
      pause: false,
    };
    CatLog.console(`muacofig加载完成`);
    CatLog.console(this.state);
    this.load(muaConfig);
  }

  componentDidMount() {
    const { muaConfig, allDmList, scList, comeInList, pause } = this.state;
    CatLog.console('renderer dw');
    setInterval(() => {
      CatLog.console('try to read');
      if (this.ttsOk || muaConfig.ttsServerUrl) {
        this.speakDanmuReal(null);
      }
    }, 2000);
    const countReset = () => {
      const t = new Date();
      if (t.getSeconds() === 0) {
        CatLog.console('try reset count');
        this.setState({
          comeInLastMinute: 0,
        });
      }
    };
    setInterval(() => {
      countReset();
    }, 1000);
    this.connectLive();
    window.danmuApi.msgTips((_event: any, data: any) => {
      toast({
        title: '提示',
        description: data,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    });
    window.theme.change((_event: any, data: any) => {
      console.log(data);
      this.setState({
        muaConfig: {
          ...muaConfig,
          theme: data,
        },
      });
    });
    window.danmuApi.onUpdateMsg(async (_event: any, data: any) => {
      // eslint-disable-next-line no-plusplus
      // eslint-disable-next-line eqeqeq
      const dm = await transformMsg(data, muaConfig.proxyApi as boolean, {
        platform: 'pc',
        room_id: muaConfig.real_roomid as string,
        area_parent_id: muaConfig.parent_area_id as string,
        area_id: muaConfig.area_id as string,
      });
      if (dm && stringify(dm.data) !== '{}') {
        this.uploadDanmu(dm);
        this.writeDanmuToFile(dm, muaConfig.roomid, muaConfig.danmuDir);
        let merged = false;
        if (dm.type !== 3) {
          const listSize = allDmList.list.length;
          const max = Math.min(listSize, 7);
          CatLog.console(max);
          const lastList = allDmList.list.slice(-max);
          for (let index = 0; index < lastList.length; index += 1) {
            const tempDanmu = lastList[index];
            const needmerge = this.needMergeDanmu(tempDanmu, dm);
            CatLog.console('check mergeble');
            if (needmerge) {
              merged = true;
              if (dm.type === 1) {
                allDmList.list[index + (listSize - max)].content += '*2';
              } else if (dm.type === 2) {
                allDmList.list[index + (listSize - max)].content = `赠送了${
                  tempDanmu.giftNum + dm.giftNum
                }个${dm.giftName}`;
                allDmList.list[index + (listSize - max)].price =
                  (tempDanmu.price ? tempDanmu.price : 0) +
                  (dm.price ? dm.price : 0);
                allDmList.list[index + (listSize - max)].giftNum =
                  (tempDanmu.giftNum ? tempDanmu.giftNum : 0) +
                  (dm.giftNum ? dm.giftNum : 0);
              }
            }
          }
          dm.keyy = data.keyy;
          if (!merged) {
            if (allDmList.list.length >= 7) {
              allDmList.list.shift();
              CatLog.info('clear some damuka');
            }
            if (dm.type === 5) {
              scList.list.push(dm);
            }
            allDmList.list.push(dm);
            if (dm.content?.startsWith('【') && dm.content?.endsWith('】')) {
              const content = dm.content
                .replaceAll('【', '')
                .replaceAll('】', '');
              const req = {
                body: {
                  messages: [{ role: 'user', content }],
                },
              };
              const res: any = {
                status: 200,
                json: '',
              };
              // chatgpt(req, res, muaConfig);
            }
            if (!pause) {
              allDmList.autoHeight = 310 - this.listHeightRef?.clientHeight;
            }
          }
          CatLog.console(allDmList);
          this.setState({
            allDmList,
          });
          if (this.ttsOk || muaConfig.ttsServerUrl) {
            this.speakDanmuReal(dm);
          }
        } else {
          comeInList.splice(0);
          comeInList.push(dm);
          // setComeInLisnt([...comeInLisnt,dm])githubtrans translateYtranslateY
          this.setState({ comeInList });
          // eslint-disable-next-line no-plusplus
          const { comeInLastMinute } = this.state;
          CatLog.console(comeInLastMinute);
          this.setState({
            comeInLastMinute: comeInLastMinute + 1,
          });
        }

        // CatLog.console(dm)
      }
    });
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    // FIXME bad usage
    CatLog.console('componentDidUpdate');
    // if (!this.loaded) {
    //   CatLog.console('loading');
    //   if (prevState?.muaConfig?.alwaysOnTop) {
    //     window.electron.ipcRenderer.sendMessage('setOnTop:setting', [
    //       [prevState?.muaConfig?.alwaysOnTop],
    //     ]); // .getCurrentWindow().setAlwaysOnTop(true)
    //   }
    //   this.loaded = true;
    // }
  }

  componentWillUnmount() {}

  load = (muaConfig: MuaConfig) => {
    CatLog.console('load muaconfig');
    CatLog.console(muaConfig);
    window.electron.ipcRenderer.sendMessage('setOnTop:setting', [
      muaConfig.alwaysOnTop,
    ]);
    // fixme : is already sync
    new Promise((resolve) => {
      resolve(window.electron.store.get('ttsKey'));
    })
      .then((res) => {
        if (res && res !== '') {
          this.speechConfig = this.sdk.SpeechConfig.fromSubscription(
            res,
            'eastasia'
          );
          this.speechConfig.speechSynthesisLanguage = 'zh-cn';
          this.speechConfig.speechSynthesisVoiceName = 'zh-CN-XiaoxiaoNeural';
          this.ttsOk = true;
        } else {
          this.ttsOk = false;
        }
        return '';
      })
      .catch((e) => {
        CatLog.console(e);
      });
    CatLog.console('init danmu data');
  };

  needMergeDanmu = (tempDanmu: BiliBiliDanmu, dm: BiliBiliDanmu) => {
    let same = false;
    if (
      (tempDanmu.type === dm.type &&
        tempDanmu.type === 1 &&
        tempDanmu.content === dm.content &&
        tempDanmu.uid === dm.uid) ||
      (tempDanmu.type === dm.type &&
        tempDanmu.type === 2 &&
        tempDanmu.price < 1000 &&
        tempDanmu.giftName === dm.giftName)
    ) {
      same = true;
    }
    return same;
  };

  connectLive = async () => {
    const { muaConfig } = this.state;
    let roomId;
    new Promise(function (resolve, reject) {
      resolve(window.electron.store.get('real_roomid'));
    })
      .then((res) => {
        window.electron.ipcRenderer.sendMessage('onLive', [res, muaConfig.uid]);
        window.danmuApi.onUpdateOnliner((_event: any, value: any) => {
          this.setState({ count: value });
        });
        return '';
      })
      .catch((e) => {
        CatLog.console(e);
      });
  };

  uploadDanmu = (dm: BiliBiliDanmu) => {
    // interface: upload danmu to server
  };

  writeDanmuToFile = (dm: BiliBiliDanmu, roomId: number, danmuDir: string) => {
    // interface: upload danmu to server
    if (dm.content) {
      if (!dm.fansName) {
        dm.fansName = '';
      }
      if (!dm.fansLevel) {
        dm.fansLevel = 0;
      }
      const datetime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const date = dayjs().format('YYYY-MM-DD');
      console.log(danmuDir);
      if (danmuDir) {
        const regex =
          /^[a-zA-Z]:\\([^\\:*<>|"?\r\n/]+\\)*([^\\:*<>|"?\r\n/]+)?$/;
        if (regex.test(danmuDir)) {
          if (!window.fs.existsSync(danmuDir)) {
            window.fs.mkdirSync(danmuDir);
          }
          if (danmuDir.endsWith('\\' || '/')) {
            // eslint-disable-next-line no-param-reassign
            danmuDir = danmuDir.substring(0, danmuDir.length - 1);
          }
          window.fs.appendFile(
            `${danmuDir}/${roomId}-danmu-${date}.txt`,
            `${datetime} ${dm.nickname}[${dm.fansName}${dm.fansLevel}](${dm.uid}) : ${dm.content}\n`,
            (err) => {
              if (err) throw err;
            }
          );
        }
      }
    }
  };

  synthesizeToSpeaker = (text: string) => {
    const player = new this.sdk.SpeakerAudioDestination();
    player.onAudioEnd = function (s: unknown) {
      CatLog.console(s);
    };
    const synthesizer = new this.sdk.SpeechSynthesizer(
      this.speechConfig,
      this.sdk.AudioConfig.fromDefaultSpeakerOutput(player)
    );
    CatLog.console('come in ss');
    CatLog.console(synthesizer);
    try {
      synthesizer.speakTextAsync(
        text,
        (result: any) => {
          this.speakStatus = false;
          synthesizer.close();
          if (result) {
            console.log(JSON.stringify(result));
            this.speakStatus = false;
          }
          // synthesizer.close()
        },
        (error: any) => {
          console.log(error);
          this.speakStatus = false;
          synthesizer.close();
        }
      );
    } catch (e) {
      CatLog.console(e);
      this.speakStatus = false;
    }
  };

  getAudioFromServer = (text: string) => {
    const { muaConfig } = this.state;
    const data = {
      token: muaConfig.ttsServerToken,
      text,
    };
    axios({
      method: 'post',
      url: `${muaConfig.ttsServerUrl}`,
      responseType: 'arraybuffer',
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        CatLog.console(res);
        const pUrl = window.URL.createObjectURL(new Blob([res.data]));
        const audio = new Audio(pUrl);
        audio.play();
        audio.onended = () => {
          this.speakStatus = false;
        };
        return '';
      })
      .catch((e) => {
        CatLog.console(e);
        this.speakStatus = false;
      });
  };

  speakDM = (dm: BiliBiliDanmu) => {
    const { muaConfig } = this.state;
    if (dm.type === 2 && (dm.price as number) > 0 && muaConfig.ttsGift) {
      const speakText = `感谢${dm.nickname}赠送的${dm.count}个${dm.giftName}`;
      if (muaConfig.ttsServerUrl) {
        this.getAudioFromServer(speakText);
      } else {
        this.synthesizeToSpeaker(speakText);
      }
    }
    console.info(`speakDM${muaConfig}`);
    if (muaConfig.ttsDanmu) {
      const speakText = `${dm.nickname}说${dm.content}`;
      if (muaConfig.ttsServerUrl) {
        this.getAudioFromServer(speakText);
      } else {
        this.synthesizeToSpeaker(speakText);
      }
    }
  };

  speakDanmuReal = (dm: BiliBiliDanmu | null) => {
    if (true) {
      // 判断是否在阅读
      if (this.speakStatus) {
        // 不阅读 把其加入阅读list
        if (dm !== null) {
          this.speakDMList.push(dm);
        }
      } else if (this.speakDMList.length !== 0) {
        this.speakStatus = true;
        if (dm !== null) {
          this.speakDMList.push(dm);
        }
        const tempText = this.speakDMList.pop();
        this.speakDM(tempText as BiliBiliDanmu);
      } else if (dm !== null) {
        this.speakStatus = true;
        const tempText = dm;
        this.speakDM(tempText);
      }
    }
  };

  onDanmuPopOpen = (dm: BiliBiliDanmu) => {
    this.setState({ pause: true });
  };

  onDanmuPopClose = (dm: BiliBiliDanmu) => {
    this.setState({ pause: false });
  };

  onDanmuPopClick = (dm: BiliBiliDanmu, type: string) => {
    console.info(type);
    const { muaConfig } = this.state;
    let formData: FormData = new FormData();
    switch (type) {
      case '1':
        formData = new FormData();
        formData.append('tuid', dm.uid as unknown as string);
        formData.append(
          'anchor_id',
          muaConfig.real_roomid as unknown as string
        );
        formData.append('csrf_token', muaConfig.csrf as unknown as string);
        formData.append('csrf', muaConfig.csrf as unknown as string);
        formData.append('visit_id', '');
        axios
          .post(
            `https://api.live.bilibili.com/xlive/app-ucenter/v2/xbanned/banned/AddBlack`,
            formData
          )
          .then((res) => {
            if (res.data.code === 0) {
              // console.error('拉黑成功');
              toast({
                title: '拉黑成功',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
            } else {
              // console.error('拉黑失败');
              toast({
                title: res.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
            }
            return '';
          })
          .catch((e) => {
            console.error('拉黑失败');
          });
        break;
      case '2':
        formData = new FormData();
        formData.append('tuid', dm.uid as unknown as string);
        formData.append('room_id', muaConfig.real_roomid as unknown as string);
        formData.append('msg', dm.content as unknown as string);
        formData.append('mobile_app', 'web');
        formData.append('csrf_token', muaConfig.csrf as unknown as string);
        formData.append('csrf', muaConfig.csrf as unknown as string);
        formData.append('visit_id', '');
        axios
          .post(
            `https://api.live.bilibili.com/xlive/web-ucenter/v1/banned/AddSilentUser`,
            formData
          )
          .then((res) => {
            if (res.data.code === 0) {
              // console.error('拉黑成功');
              toast({
                title: '禁言成功',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
            } else {
              // console.error('拉黑失败');
              toast({
                title: res.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
            }
            return '';
          })
          .catch((e) => {
            console.error('禁言失败');
          });
        break;
      case '3':
        formData = new FormData();
        formData.append('roomid', muaConfig.real_roomid as unknown as string);
        formData.append('uid', dm.uid as unknown as string);
        formData.append('csrf_token', muaConfig.csrf as unknown as string);
        formData.append('csrf', muaConfig.csrf as unknown as string);
        formData.append('visit_id', '');
        axios
          .post(`https://api.live.bilibili.com/liveact/shield_user`, formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((res) => {
            if (res.data.code === 0) {
              // console.error('拉黑成功');
              toast({
                title: '屏蔽成功',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
            } else {
              // console.error('拉黑失败');
              toast({
                title: res.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
            }
            return '';
          })
          .catch((e) => {
            console.error('屏蔽失败');
          });
        break;
      case '4':
        window.electron.ipcRenderer.sendMessage('onCopy', [dm.nickname]);
        break;
      case '5':
        window.electron.ipcRenderer.sendMessage('onCopy', [dm.content]);
        break;
      default:
        break;
    }
  };

  render() {
    const {
      count,
      comeInLastMinute,
      allDmList,
      scList,
      comeInList,
      muaConfig,
    } = this.state;
    const themeMode = muaConfig.theme;
    let rootTheme = styles.root;
    switch (themeMode) {
      case 'light':
        rootTheme = styles.rootLight;
        break;
      case 'dark':
        rootTheme = styles.rootDark;
        break;
      case 'wave':
        rootTheme = styles.rootWave;
        break;
      case 'miku':
        rootTheme = styles.rootMiku;
        break;
      default:
        rootTheme = styles.root;
        break;
    }
    return (
      <>
        <Titlebar theme={themeMode} />
        {/* <BackgroundWave display={muaConfig.wave} /> */}
        {muaConfig.theme === 'wave' && <BackgroundWave />}
        {muaConfig.theme === 'miku' && <BackgroundMiku />}
        <div className={rootTheme}>
          <div className={styles.m_bg_top} />
          <div style={{ width: '100%', height: '5vh', display: 'flex' }}>
            <div className={styles.online}>
              {`人气: `}
              <span style={{ color: 'orange' }}>{count || 0}</span>
            </div>
            <div className={styles.comeinLastMinute}>
              <span>进入/分钟：</span>
              <span style={{ color: 'orange' }}>{comeInLastMinute || 0}</span>
            </div>
          </div>
          <SuperChatBar scList={scList} theme={muaConfig.theme} />
          <div className={styles.c_bg}>
            <div
              style={{
                // transform: `translateY(${allDmList.autoHeight}px)`,
                transition: 'transform 1s ease-in-out',
                transformOrigin: '-24px',
              }}
            >
              <TransitionGroup>
                <div
                  ref={(ref) => {
                    this.listHeightRef = ref;
                  }}
                >
                  {allDmList.list.map((danmu: BiliBiliDanmu) => (
                    <CSSTransition
                      key={`danmu${danmu.keyy}`}
                      timeout={1}
                      classNames="item"
                    >
                      <Popover
                        onOpen={() => {
                          this.onDanmuPopOpen(danmu);
                        }}
                        onClose={() => {
                          this.onDanmuPopClose(danmu);
                        }}
                      >
                        <PopoverTrigger>
                          <a href="#" className="flex">
                            <Danmu
                              theme={themeMode}
                              nickname={danmu.nickname}
                              content={danmu.content}
                              data={danmu}
                            />
                          </a>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>{danmu.nickname}</PopoverHeader>
                          <PopoverBody zIndex={9}>
                            <List spacing={3}>
                              <ListItem>
                                <Button
                                  leftIcon={<MdBlock />}
                                  className=" cursor-pointer hover:bg-gray-300"
                                  onClick={() => {
                                    this.onDanmuPopClick(danmu, '1');
                                  }}
                                >
                                  拉黑
                                </Button>
                                <Button
                                  leftIcon={<MdBlock />}
                                  className=" cursor-pointer hover:bg-gray-300"
                                  onClick={() => {
                                    this.onDanmuPopClick(danmu, '2');
                                  }}
                                >
                                  封禁
                                </Button>
                                <Button
                                  leftIcon={<MdBlock />}
                                  className=" cursor-pointer hover:bg-gray-300"
                                  onClick={() => {
                                    this.onDanmuPopClick(danmu, '3');
                                  }}
                                >
                                  屏蔽
                                </Button>
                              </ListItem>
                              <Divider />
                              <ListItem>
                                <Button
                                  leftIcon={<MdCopyAll />}
                                  className=" cursor-pointer hover:bg-gray-300"
                                  onClick={() => {
                                    this.onDanmuPopClick(danmu, '4');
                                  }}
                                >
                                  复制昵称
                                </Button>
                                <Button
                                  leftIcon={<MdCopyAll />}
                                  className=" cursor-pointer hover:bg-gray-300"
                                  onClick={() => {
                                    this.onDanmuPopClick(danmu, '5');
                                  }}
                                >
                                  复制弹幕
                                </Button>
                              </ListItem>
                              <Divider />
                              <ListItem>
                                <Button
                                  leftIcon={<MdOpenInBrowser />}
                                  className=" cursor-pointer hover:bg-gray-300"
                                  onClick={() => {
                                    this.onDanmuPopClick(danmu, '6');
                                  }}
                                >
                                  <Link target="_blank" href={'https://space.bilibili.com/'+danmu.uid} rel="noreferrer">
                                    打开主页
                                  </Link>
                                </Button>
                              </ListItem>
                            </List>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </CSSTransition>
                  ))}
                </div>
              </TransitionGroup>
            </div>
          </div>
          <>
            <ComeInDisplay data={comeInList} />
          </>
          <div className={styles.chatContainer}>
            <ChatContainer config={muaConfig} theme={themeMode} />
          </div>
        </div>
      </>
    );
  }
}

export default DanmuWindow;
async function chatgpt(
  req: { body: { messages: any } },
  res: any,
  muaConfig: MuaConfig
) {
  if (!configuration.apiKey) {
    res.status = 500;
    res.json = {
      error: {
        message:
          'OpenAI API key not configured, please follow instructions in README.md',
      },
    };
    return;
  }
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: req.body.messages,
    });
    res.status = 200;
    res.json = { result: completion.data.choices[0].message?.content };
    send({
      value: `${`[${completion.data.choices[0].message?.content}` as string}]`,
      roomid: muaConfig.roomid,
      SESSDATA: muaConfig.SESSDATA,
      csrf: muaConfig.csrf,
      muaConfig,
    });
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status = error.response.status;
      res.json = error.response.data;
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status = 500;
      res.json = {
        error: {
          message: 'An error occurred during your request.',
        },
      };
    }
  }
}

async function send(arg0: {
  value: string;
  roomid: any;
  SESSDATA: any;
  csrf: any;
  muaConfig: MuaConfig;
}) {
  window.electron.ipcRenderer.sendMessage('sendDanmu', [arg0]);
}

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
