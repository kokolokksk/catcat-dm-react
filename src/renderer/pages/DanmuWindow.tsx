import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { UnorderedList, useColorMode } from '@chakra-ui/react';
import { stringify } from 'querystring';
import {
  TransitionGroup,
  CSSTransition,
  Transition,
} from 'react-transition-group';
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

const DanmuWindow = () => {
  const listHeight = useRef(null);
  const [comeinLastMinute, setComeInLastMinute] = useState(0);
  let count = 0;
  const countReset = () => {
    const t = new Date();
    if (t.getSeconds() === 0) {
      console.info('try reset count');
      count = 0;
      setComeInLastMinute(count);
    }
  };
  setInterval(() => {
    countReset();
  }, 1000);
  const obj: { [K: string]: any } = {};
  const initMsg: { [K: string]: any } = {
    keyy: 0,
    type: 1,
    uid: 123,
    content: '初始化弹幕列表···',
    nickname: 'CatCat',
    timestamp: '1231',
    price: 0,
  };
  const [allDmList, setAllDmList] = useState({
    list: [initMsg],
    autoHeight: 0,
  });
  // eslint-disable-next-line prefer-const
  let [comeInLisnt, setComeInLisnt] = useState<any[]>([]);
  const [muaConfig, setMuaConfig] = useState(obj);
  let autoHeight; // [autoHeight, setAutoHeight] = useState(0);
  const copyObj = (cc: any) => {
    const copyOne = cc;
    return copyOne;
  };
  function uploadDanmu(dm: { [K: string]: any }) {
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
  }
  const connectLive = () => {
    window.electron.ipcRenderer.sendMessage('onLive', [muaConfig]);
    window.danmuApi.onUpdateOnliner((_event: any, value: any) => {
      muaConfig.count = value;
      setMuaConfig({
        ...copyObj(muaConfig),
      });
    });
  };
  useEffect(() => {
    console.info(muaConfig.count);
  }, [muaConfig.count]);
  useEffect(() => {
    // set is on top
    if (muaConfig.alwaysOnTop) {
      window.electron.ipcRenderer.sendMessage('setOnTop:setting', [
        [muaConfig.alwaysOnTop],
      ]); // .getCurrentWindow().setAlwaysOnTop(true)
    }
    console.info(muaConfig.alwaysOnTop);
  }, [muaConfig.alwaysOnTop]);
  useEffect(() => {
    if (!muaConfig.started) {
      console.info('init danmu data');
      muaConfig.sessionId = getNewSessionId();
      muaConfig.started = true;
      console.info(muaConfig);
      setMuaConfig({
        ...copyObj(muaConfig),
      });
      // if(!a){
      //     a = setInterval(() => {
      //         count()
      //       }, 1000)
      // }
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
        connectLive();
        return '';
      });
    }
    window.danmuApi.onUpdateMsg(async (_event: any, data: any) => {
      // eslint-disable-next-line no-plusplus
      // eslint-disable-next-line eqeqeq
      const dm = await transformMsg(data, muaConfig.proxyApi);
      if (dm && stringify(dm.data) !== '{}') {
        uploadDanmu(dm);
        if (dm.type !== 3) {
          dm.keyy = data.keyy;
          allDmList.list.push(dm);
          console.info(listHeight);
          setAllDmList(() => ({
            autoHeight: 310 - listHeight?.current?.clientHeight,
            list: allDmList.list,
          }));
        } else {
          comeInLisnt = [];
          // setComeInLisnt([...comeInLisnt,dm])githubtrans translateYtranslateY
          setComeInLisnt([...comeInLisnt, dm]);
          // eslint-disable-next-line no-plusplus
          count++;
          setComeInLastMinute(count);
        }

        // console.info(dm)
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className={styles.root}>
        <div className={styles.m_bg_top} />
        <div className={styles.online}>
          {`人气: `}
          <span style={{ color: 'orange' }}>{muaConfig.count}</span>
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
              <div ref={listHeight}>
                {allDmList.list.map((danmu: any, index: any) => (
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
          <ComeInDisplay data={comeInLisnt} />
        </>
        <div className={styles.chatContainer}>
          <ChatContainer config={muaConfig} />
        </div>
      </div>
    </>
  );
};
export default DanmuWindow;
