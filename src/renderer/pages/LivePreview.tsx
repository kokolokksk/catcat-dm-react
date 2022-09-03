/* eslint-disable @typescript-eslint/no-shadow */
import { Flex, useColorMode, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CatLog from 'renderer/utils/CatLog';
import { catConfigItem } from '../components/CatCat';
import Hls from 'hls.js';

const LivePreview = () => {
  const pRef = React.useRef<HTMLVideoElement | null>(null);
  const toast = useToast();
  const obj: { [K: string]: any } = {};
  const [catConfigData, setCatConfigData] = useState(obj);
  const [state, setState] = useState(obj);
  const color = useColorMode();

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
    axios
      .get(
        `http://api.live.bilibili.com/room/v1/Room/playUrl?cid=${catConfigData.roomid}&qn=10000&platform=h5`
      )
      .then((res) => {
        console.info(res);
        if(Hls.isSupported()){
          console.info('hls is supported');
          var hls = new Hls();
          hls.loadSource(res.data.data.durl[0].url);
          hls.attachMedia(pRef.current as HTMLVideoElement);
        } else if (pRef.current) {
          console.info('hls is not supported');
          pRef.current.src = res.data.data.durl[0].url;
        }
        return res;
      })
      .catch((err) => {
        console.error(err);
      });
  }, [catConfigData.roomid]);
  const { theme } = catConfigData;
  let pageTheme;
  // switch (theme) {
  //   case 'light':
  //     pageTheme = styles.page;
  //     break;
  //   case 'dark':
  //     pageTheme = styles.pageDark;
  //     break;
  //   default:
  //     pageTheme = styles.page;
  //     break;
  // }

  return (
    <Flex height="100vh">
      <video
        ref={pRef}
        className="video"
        controls
        autoPlay
        playsInline
        muted
        controlsList="nodownload"
      />
    </Flex>
  );
};

export default LivePreview;
