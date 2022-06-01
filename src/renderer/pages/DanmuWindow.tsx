import React, { useEffect, useState } from 'react';
import styles from '../styles/danmu.module.scss';
import {
  catConfigItem,
  getNewSessionId,
  transformMsg,
} from '../components/CatCat';

import Danmu from '../components/Danmu';
import ComeInDisplay from '../components/ComeInDisplay';
import ChatContainer from '../components/ChatContainer';
import { channel } from 'diagnostics_channel';

const DanmuWindow = () => {
  const [allDmList, setAllDmList] = useState<any[]>([]);
  const tenpDmList: { [K: string]: any }[] = [];
  // eslint-disable-next-line prefer-const
  let [comeInLisnt, setComeInLisnt] = useState<any[]>([]);
  const obj: { [K: string]: any } = {};
  const [muaConfig, setMuaConfig] = useState(obj);
  const [autoHeight] = useState(0);
  const copyObj = (cc: any) => {
    const copyOne = cc;
    return copyOne;
  };

  const connectLive = () => {
    window.ipcRenderer.send('onLive', muaConfig);
    window.danmuApi.onUpdateOnliner((_event: any, value: any) => {
      muaConfig.count = value;
      setMuaConfig({
        ...copyObj(muaConfig),
      });
    });
    window.danmuApi.onUpdateMsg((_event: any, data: any) => {
      const dm = transformMsg(data);
      if (JSON.stringify(dm) !== '{}') {
        if (dm.type !== 3) {
          tenpDmList.push(dm);
          console.info(tenpDmList);

          if (dm.length > 32) {
            if (tenpDmList.length > 6) {
              tenpDmList.shift();
            }
          } else if (tenpDmList.length > 6) {
            tenpDmList.shift();
          }
          setAllDmList([...tenpDmList]);
        } else {
          comeInLisnt = [];
          // setComeInLisnt([...comeInLisnt,dm])
          setComeInLisnt([...comeInLisnt, dm]);
        }

        // console.info(dm)
      }
    });
  };
  useEffect(() => {
    console.info(muaConfig.count);
  }, [muaConfig.count]);
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
        // set is on top
        window.electron.ipcRenderer.sendMessage(
          'setOnTop',
          muaConfig.alwaysOnTop
        ); // .getCurrentWindow().setAlwaysOnTop(true)
        connectLive();
        return '';
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={styles.root}>
        <div className={styles.m_bg_top} />
        <div className={styles.online}>{`人气: ${muaConfig.count}`}</div>
        <div className={styles.comeinLastMinute} />
        <div className={styles.c_bg}>
          <div style={{ transform: `translateY(${autoHeight}vh)` }}>
            {allDmList.map((dm: any, index: any) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <div key={`${index}1`}>
                  {' '}
                  <Danmu
                    nickname={dm.nickname}
                    content={dm.content}
                    data={dm}
                  />
                </div>
              );
              //    faceImg={danmu.origin.data.face}
            })}
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
