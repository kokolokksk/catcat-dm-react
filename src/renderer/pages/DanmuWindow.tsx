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

type StateType = {
  comeinLastMinute: number;
  count: number;
  allDmList: { list: { [K: string]: any }; autoHeight: number };
  comeInList: { [K: string]: any };
  muaConfig: {
    [K: string]: any;
  };
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

  speechConfig!: {
    speechSynthesisLanguage: string;
    speechSynthesisVoiceName: any;
  };

  initMsg: { [K: string]: any } = {
    keyy: 0,
    type: 1,
    uid: 123,
    content: `${new Date().toLocaleString()}`,
    nickname: 'catcat',
    timestamp: new Date().getTime(),
    price: 0,
  };

  constructor(props) {
    super(props);
    this.load();
    this.state = {
      comeinLastMinute: 0,
      count: 0,
      allDmList: {
        list: [this.initMsg],
        autoHeight: 310,
      },
      comeInList: [],
      muaConfig: {},
    };
  }

  componentDidMount() {
    const { muaConfig } = this.state;
    let speakStatus = false;
    const speakDMList = [];
    let count = 0;
    const copyObj = (cc: any) => {
      const copyOne = cc;
      return copyOne;
    };
    console.info('renderer dw');
    // console.info(this.state.muaConfig);

    const synthesizeToSpeaker = (text: any) => {
      const player = new this.sdk.SpeakerAudioDestination();
      player.onAudioEnd = function (s: any) {
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
            speakStatus = false;
            synthesizer.close();
            if (result) {
              console.log(JSON.stringify(result));
              speakStatus = false;
            }
            // synthesizer.close()
          },
          (error: any) => {
            console.log(error);
            speakStatus = false;
            synthesizer.close();
          }
        );
      } catch (e) {
        console.info(e);
        speakStatus = false;
      }
    };
    const speakDM = (dm: any) => {
      if (dm.type === 2 && dm.price > 0 && muaConfig.ttsGift) {
        const speakText = `感谢${dm.nickname}赠送的${dm.count}个${dm.giftName}`;
        synthesizeToSpeaker(speakText);
      }
      if (muaConfig.ttsDanmu) {
        synthesizeToSpeaker(`${dm.content}`);
      }
    };

    const speakDanmuReal = (dm: { [K: string]: any } | null) => {
      if (true) {
        // 判断是否在阅读
        if (speakStatus) {
          // 不阅读 把其加入阅读list
          if (dm !== null) {
            speakDMList.push(dm);
          }
        } else if (speakDMList.length !== 0) {
          speakStatus = true;
          if (dm !== null) {
            speakDMList.push(dm);
          }
          const tempText = speakDMList.pop();
          speakDM(tempText);
        } else if (dm !== null) {
          speakStatus = true;
          const tempText = dm;
          speakDM(tempText);
        }
      }
    };
    setInterval(() => {
      console.info('try to read');
      speakDanmuReal(null);
    }, 2000);
  }

  componentWillUnmount() {}

  load = () => {
    const { muaConfig, allDmList, comeInList } = this.state;
    const countReset = () => {
      const t = new Date();
      if (t.getSeconds() === 0) {
        console.info('try reset count');
        this.setState({
          comeinLastMinute: 0,
        });
      }
    };
    setInterval(() => {
      countReset();
    }, 1000);
    if (true) {
      this.speechConfig = this.sdk.SpeechConfig.fromSubscription(
        'b431d048b5234ec187ffb676ea939ad1',
        'eastasia'
      );
      this.speechConfig.speechSynthesisLanguage = 'zh-cn';
      this.speechConfig.speechSynthesisVoiceName = 'zh-CN-XiaoxiaoNeural';
    }
    console.info('init danmu data');
    muaConfig.sessionId = getNewSessionId();
    muaConfig.started = true;
    console.info(muaConfig);
    this.setState(muaConfig);
    const arr = catConfigItem.map((item) =>
      window.electron.store.get(item.name)
    );
    // eslint-disable-next-line promise/catch-or-return
    // eslint-disable-next-line promise/always-return
    // eslint-disable-next-line promise/catch-or-return
    Promise.all(arr).then((e) => {
      console.log(e);
      // eslint-disable-next-line array-callback-return
      e.map((item: any, index: number) => {
        if (typeof item === catConfigItem[index].type) {
          console.info(item);
          muaConfig[catConfigItem[index].name] = item;
        }
      });
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
        const dm = await transformMsg(data, muaConfig.proxyApi);
        if (dm && stringify(dm.data) !== '{}') {
          this.uploadDanmu(dm);
          if (dm.type !== 3) {
            dm.keyy = data.keyy;
            allDmList.list.push(dm);
            allDmList.autoHeight =
              310 - this.listHeightRef?.current?.clientHeight;
            console.info(this.listHeightRef);
            this.setState({
              allDmList
            });
            speakDanmuReal(dm);
          } else {
            comeInList.clear();
            comeInList.push(dm);
            // setComeInLisnt([...comeInLisnt,dm])githubtrans translateYtranslateY
            this.setState([comeInList]);
            // eslint-disable-next-line no-plusplus
            this.count++;
            comeInList = 1;
            this.setState({
              comeInList:
            });
          }

          // console.info(dm)
        }
      });
      return '';
    });
  };

  connectLive = () => {
    const { muaConfig } = this.state;
    window.electron.ipcRenderer.sendMessage('onLive', [muaConfig]);
    window.danmuApi.onUpdateOnliner((_event: any, value: any) => {
      muaConfig.count = value;
      this.setState(muaConfig);
    });
  };

  uploadDanmu =(dm: { [K: string]: any }) => {
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

  render() {
    const { comeinLastMinute, count, allDmList, comeInList, muaConfig } =
      this.state;
    return (
      <>
        <div className={styles.root}>
          <div className={styles.m_bg_top} />
          <div className={styles.online}>
            {`人气: `}
            <span style={{ color: 'orange' }}>{count}</span>
          </div>
          <div className={styles.comeinLastMinute}>
            <span>进入/分钟：</span>
            <span style={{ color: 'orange' }}>{comeinLastMinute}</span>
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
                  {allDmList.list.map((danmu: any) => (
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
