import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { UnorderedList, useColorMode, Toast } from '@chakra-ui/react';
import { stringify } from 'querystring';
import {
  TransitionGroup,
  CSSTransition,
  Transition,
} from 'react-transition-group';
import { render } from 'react-dom';
import { BiliBiliDanmu } from 'renderer/@types/catcat';
import styles from '../styles/danmu.module.scss';
import '../styles/dm_a.css';
import {
  catConfigItem,
  getNewSessionId,
  transformMsg,
} from '../components/CatCat';

import Danmu from '../components/Danmu';
import ComeInDisplay from '../components/ComeInDisplay';
import ChatContainer from '../components/ChatContainer';

interface MuaConfig {
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
}

type StateType = {
  comeInLastMinute: number;
  count: number;
  allDmList: { list: BiliBiliDanmu[]; autoHeight: number };
  comeInList: Array<BiliBiliDanmu>;
  muaConfig: MuaConfig;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type PropType = {};

interface DanmuWindow {
  state: StateType;
  props: PropType;
}

class DanmuWindow extends React.Component {
  listHeightRef: any = '';

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
    content: `${new Date().toLocaleString()}`,
    nickname: 'catcat',
    timestamp: new Date().getTime(),
    price: 0,
  };

  constructor(props) {
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
    };
    super(props);
    const arr = catConfigItem.map((item) =>
      window.electron.store.get(item.name)
    );
    // eslint-disable-next-line promise/catch-or-return
    // eslint-disable-next-line promise/always-return
    Promise.all(arr)
      .then((e) => {
        console.log(e);
        // eslint-disable-next-line array-callback-return
        e.map((item: unknown, index: number) => {
          if (typeof item === catConfigItem[index].type) {
            console.info(item);
            muaConfig[catConfigItem[index].name] = item;
          }
        });
        return muaConfig;
      })
      .catch((_e) => {
        console.info(_e);
      });
    this.state = {
      comeInLastMinute: 0,
      count: 0,
      allDmList: {
        list: [this.initMsg],
        autoHeight: 310,
      },
      comeInList: [],
      muaConfig,
    };
    console.info(`muacofig加载完成`);
    console.info(this.state);
    this.load();
  }

  componentDidMount() {
    const { muaConfig, allDmList, comeInList } = this.state;
    console.info('renderer dw');
    setInterval(() => {
      console.info('try to read');
      if (this.ttsOk) {
        this.speakDanmuReal(null);
      }
    }, 2000);
    const countReset = () => {
      const t = new Date();
      if (t.getSeconds() === 0) {
        console.info('try reset count');
        this.setState({
          comeInLastMinute: 0,
        });
      }
    };
    setInterval(() => {
      countReset();
    }, 1000);
    this.connectLive();
    if (muaConfig.alwaysOnTop) {
      window.electron.ipcRenderer.sendMessage('setOnTop:setting', [
        [muaConfig.alwaysOnTop],
      ]); // .getCurrentWindow().setAlwaysOnTop(true)
    }
    window.danmuApi.msgTips((_event: any, data: any) => {
      Toast({
        title: '提示',
        description: data,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    });
    window.danmuApi.onUpdateMsg(async (_event: any, data: any) => {
      // eslint-disable-next-line no-plusplus
      // eslint-disable-next-line eqeqeq
      const dm = await transformMsg(data, muaConfig.proxyApi as boolean);
      if (dm && stringify(dm.data) !== '{}') {
        this.uploadDanmu(dm);
        if (dm.type !== 3) {
          dm.keyy = data.keyy;
          allDmList.list.push(dm);
          allDmList.autoHeight = 310 - this.listHeightRef?.clientHeight;
          console.info(allDmList);
          this.setState({
            allDmList,
          });
          if (this.ttsOk) {
            this.speakDanmuReal(dm);
          }
        } else {
          comeInList.splice(0);
          comeInList.push(dm);
          // setComeInLisnt([...comeInLisnt,dm])githubtrans translateYtranslateY
          this.setState({ comeInList });
          // eslint-disable-next-line no-plusplus
          const { comeInLastMinute } = this.state;
          console.info(comeInLastMinute);
          this.setState({
            comeInLastMinute: comeInLastMinute + 1,
          });
        }

        // console.info(dm)
      }
    });
  }

  componentWillUnmount() {}

  load = () => {
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
        console.info(e);
      });
    console.info('init danmu data');
  };

  connectLive = async () => {
    const { muaConfig } = this.state;
    let roomId;
    new Promise(function (resolve, reject) {
      resolve(window.electron.store.get('roomid'));
    })
      .then((res) => {
        window.electron.ipcRenderer.sendMessage('onLive', [res]);
        window.danmuApi.onUpdateOnliner((_event: any, value: any) => {
          this.setState({ count: value });
        });
        return '';
      })
      .catch((e) => {
        console.info(e);
      });
  };

  uploadDanmu = (dm: BiliBiliDanmu) => {
    const { muaConfig } = this.state;
    if (muaConfig.catdb) {
      if (muaConfig.clientId) {
        axios({
          method: 'post',
          url: `https://db.loli.monster/cat/dm/addDanMu?clientId=${muaConfig.clientId}&roomId=${muaConfig.roomid}`,
          data: dm,
          headers: { 'content-type': 'application/json' },
        })
          // eslint-disable-next-line func-names
          // eslint-disable-next-line promise/always-return
          .then(function (response) {
            // console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  };

  synthesizeToSpeaker = (text: string) => {
    const player = new this.sdk.SpeakerAudioDestination();
    player.onAudioEnd = function (s: unknown) {
      console.info(s);
    };
    const synthesizer = new this.sdk.SpeechSynthesizer(
      this.speechConfig,
      this.sdk.AudioConfig.fromDefaultSpeakerOutput(player)
    );
    console.info('come in ss');
    console.info(synthesizer);
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
      console.info(e);
      this.speakStatus = false;
    }
  };

  speakDM = (dm: BiliBiliDanmu) => {
    const { muaConfig } = this.state;
    if (dm.type === 2 && (dm.price as number) > 0 && muaConfig.ttsGift) {
      const speakText = `感谢${dm.nickname}赠送的${dm.count}个${dm.giftName}`;
      this.synthesizeToSpeaker(speakText);
    }
    if (muaConfig.ttsDanmu) {
      this.synthesizeToSpeaker(`${dm.content}`);
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

  render() {
    const { count, comeInLastMinute, allDmList, comeInList, muaConfig } =
      this.state;
    return (
      <>
        <div className={styles.root}>
          <div className={styles.m_bg_top} />
          <div className={styles.online}>
            {`人气: `}
            <span style={{ color: 'orange' }}>{count || 0}</span>
          </div>
          <div className={styles.comeinLastMinute}>
            <span>进入/分钟：</span>
            <span style={{ color: 'orange' }}>{comeInLastMinute || 0}</span>
          </div>
          <div className={styles.c_bg}>
            <div
              style={{
                transform: `translateY(${allDmList.autoHeight}px)`,
                transition: 'transform 1s ease-in-out',
                transformOrigin: '0px',
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
                      <Danmu
                        nickname={danmu.nickname}
                        content={danmu.content}
                        data={danmu}
                      />
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
            <ChatContainer config={muaConfig} />
          </div>
        </div>
      </>
    );
  }
}

export default DanmuWindow;
