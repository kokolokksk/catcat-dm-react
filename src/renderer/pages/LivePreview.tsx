/* eslint-disable @typescript-eslint/no-shadow */
import { Flex, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import CatLog from 'renderer/utils/CatLog';
import { catConfigItem } from '../components/CatCat';
import Hls from 'hls.js';
import styles from '../styles/live_preview.module.scss';
import { tauriGetJson } from '../tauri/http';

const LivePreview = () => {
  const pRef = React.useRef<HTMLVideoElement | null>(null);
  const toast = useToast();
  const obj: { [K: string]: any } = {};
  const [catConfigData, setCatConfigData] = useState(obj);

  useEffect(() => {
    // init data
    CatLog.console('init data');
    const arr = catConfigItem.map((item) =>
      window.electron.store.get(item.name)
    );
    // eslint-disable-next-line promise/catch-or-return
    Promise.all(arr).then((e) => {
      console.log(e);
      // eslint-disable-next-line array-callback-return
      e.map((item: any, index: number) => {
        if (typeof item === catConfigItem[index].type) {
          CatLog.console(item);
          catConfigData[catConfigItem[index].name] = item;
        }
      });
      // eslint-disable-next-line promise/always-return
      try {
        setCatConfigData({
          ...catConfigData,
        });
      } catch (e) {
        CatLog.console(e);
      }
    });
    window.theme.change((_event: any, data: any) => {
      setCatConfigData((prev: any) => ({
        ...prev,
        theme: Array.isArray(data) ? data[0] : data,
      }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    toast({
      title: '',
      description: '正在获取直播流',
      status: 'info',
      duration: 2000,
      isClosable: false,
    });
    if (!catConfigData.roomid) {
      console.error('roomid is null');
      return;
    }
    tauriGetJson(
      `https://api.live.bilibili.com/room/v1/Room/playUrl?cid=${catConfigData.roomid}&qn=10000&platform=h5`
    )
      .then((res: any) => {
        console.info(res);
        if (Hls.isSupported()) {
          console.info('hls is supported');
          const hls = new Hls();
          hls.loadSource(res.data.durl[0].url);
          hls.attachMedia(pRef.current as HTMLVideoElement);
        } else if (pRef.current) {
          console.info('hls is not supported');
          pRef.current.src = res.data.durl[0].url;
        }
        return res;
      })
      .catch((err) => {
        console.error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catConfigData.roomid]);
  return (
    <Flex className={catConfigData.theme === 'dark' ? styles.rootDark : styles.root}>
      <div className={styles.panel}>
        <div className={styles.head}>
          <span className={styles.title}>Live Preview</span>
          <span className={styles.status}>Room: {catConfigData.roomid || '-'}</span>
        </div>
        <video
          ref={pRef}
          className={styles.video}
          controls
          autoPlay
          playsInline
          muted
          controlsList="nodownload"
        />
      </div>
    </Flex>
  );
};

export default LivePreview;
