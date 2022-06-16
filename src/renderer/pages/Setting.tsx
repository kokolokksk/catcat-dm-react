/* eslint-disable @typescript-eslint/no-shadow */
import { Flex, Divider, useColorMode } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SliderMenu from '../components/SliderMenu';
import styles from '../styles/setting.module.scss';
import SettingInputItem from '../components/SettingInputItem';
import { catConfigItem } from '../components/CatCat';
// import '../samples/electron-store'
import SettingSwitchItem from '../components/SettingSwitchItem';
// const catConfig = window.catConfig
// catConfig.setDataPath('F://catConfig.json')

const Setting = () => {
  const tempRoomId = 0;
  const obj: { [K: string]: any } = {};
  const [catConfigData, setCatConfigData] = useState(obj);
  const load = (num: number) => {
    console.info('on load user img and nickname');
    axios
      .get(`https://api.live.bilibili.com/room/v1/Room/room_init?id=${num}`)
      // eslint-disable-next-line func-names
      // eslint-disable-next-line promise/always-return
      .then(function (response) {
        // handle success
        console.log(response);
        const { uid } = response.data.data;
        axios.defaults.withCredentials = true;
        document.cookie = 'SESSDATA=xxxx';
        // eslint-disable-next-line promise/no-nesting
        axios({
          url: `https://api.live.bilibili.com/live_user/v1/Master/info?uid=${uid}`,
        })
          // eslint-disable-next-line func-names
          // eslint-disable-next-line promise/always-return
          // eslint-disable-next-line @typescript-eslint/no-shadow
          // eslint-disable-next-line func-names
          // eslint-disable-next-line promise/always-return
          .then(function (response1) {
            console.log(response1);
            setCatConfigData({
              ...catConfigData,
              faceImg: response1.data.data.info.face,
              nickname: response1.data.data.info.uname,
            });
          })
          // eslint-disable-next-line func-names
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  const setRoomId = (room: any) => {};
  const commonInputItemSave = (skey: any, value: string) => {
    let t: unknown = value;
    if (skey === 'roomid') {
      t = Number(value);
      setCatConfigData({
        ...catConfigData,
        roomid: Number(t),
      });
    }
    window.electron.store.set(skey, t);
  };
  const { colorMode, toggleColorMode } = useColorMode();
  console.info(colorMode);
  useEffect(() => {
    if (catConfigData.roomid) {
      load(catConfigData.roomid);
      commonInputItemSave('roomid', catConfigData.roomid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catConfigData.roomid]);
  const commonSwitchItemSave = async (skey: any, value: any) => {
    console.info(value.target.checked);
    window.electron.store.set(skey, value.target.checked);
    if (skey === 'darkMode') {
      toggleColorMode();
      // const isDarkMode = window.darkMode.toggle(value.target.checked);
      window.electron.ipcRenderer.sendMessage(
        'dark-mode:toggle',
        value.target.checked
      );
    }
    if (skey === 'alwaysOnTop') {
      // set is on top
      window.electron.ipcRenderer.sendMessage('setOnTop:setting', [
        value.target.checked,
      ]);
    }
  };
  useEffect(() => {
    // init data
    console.info('init data');
    const arr = catConfigItem.map((item) =>
      window.electron.store.get(item.name)
    );
    // eslint-disable-next-line promise/catch-or-return
    Promise.all(arr).then((e) => {
      console.log(e);
      // eslint-disable-next-line array-callback-return
      e.map((item: any, index: number) => {
        if (typeof item === catConfigItem[index].type) {
          console.info(item);
          catConfigData[catConfigItem[index].name] = item;
        }
      });
      // eslint-disable-next-line promise/always-return
      try {
        if (!catConfigData.clientId) {
          // eslint-disable-next-line promise/no-nesting
          axios
            .get('https://db.loli.monster/cat/client/generateClientId')
            // eslint-disable-next-line promise/always-return
            .then(function (response) {
              // handle success
              console.log(response);
              catConfigData.clientId = response.data;
              commonInputItemSave('clientId', response.data);
            })
            .catch(function (error: unknown) {
              // handle error
              console.log(error);
            });
        }
        if (catConfigData.roomid) {
          load(catConfigData.roomid);
        }
      } catch (e) {
        catConfigData.clientId = 'NetworkError';
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Flex height="100vh">
      <SliderMenu
        nickname={catConfigData.nickname}
        faceImg={catConfigData.faceImg}
      />
      <Divider orientation="vertical" />
      <div className={styles.page}>
        <div className={styles.setting}>
          <SettingInputItem
            name="房间号"
            v={catConfigData.roomid}
            c={commonInputItemSave}
            skey="roomid"
          />
          <Divider />
          <SettingInputItem
            name="弹幕阴影"
            v={catConfigData.dmTs || '1px 1px 1px #fff'}
            c={commonInputItemSave}
            skey="dmTs"
          />
          <Divider />
          <SettingSwitchItem
            name="弹幕窗口置顶"
            v={catConfigData.alwaysOnTop}
            c={commonSwitchItemSave}
            skey="alwaysOnTop"
          />
          <Divider />
          <SettingSwitchItem
            name="弹幕上传"
            v={catConfigData.catdb}
            c={commonSwitchItemSave}
            skey="catdb"
          />
          <Divider />
          {/* <SettingSwitchItem
            name="波浪"
            v={catConfigData.waveD || false}
            c={commonSwitchItemSave}
            skey="waveD"
          />
          <Divider />
          <SettingSwitchItem
            name="粉丝牌显示"
            v={catConfigData.fansDisplay || false}
            c={commonSwitchItemSave}
            skey="fansDisplay"
          />
          <Divider /> */}
          <SettingSwitchItem
            name="深浅模式"
            v={catConfigData.darkMode || false}
            c={commonSwitchItemSave}
            skey="darkMode"
          />
          <Divider />
          <SettingSwitchItem
            name="使用代理服务器请求弹幕用户头像"
            v={catConfigData.proxyApi || false}
            c={commonSwitchItemSave}
            skey="proxyApi"
          />
          <Divider />
          <SettingSwitchItem
            name="TTS感谢礼物"
            v={catConfigData.ttsGift || false}
            c={commonSwitchItemSave}
            skey="ttsGift"
          />
          <Divider />
          <SettingSwitchItem
            name="TTS阅读弹幕"
            v={catConfigData.ttsDanmu || false}
            c={commonSwitchItemSave}
            skey="ttsDanmu"
          />
          {/* <Divider/>
        <SettingSwitchItem name='TTS' v={catConfigData.tts || false} c={commonSwitchItemSave} skey={'tts'}/>
        <Divider/>
        <SettingSwitchItem name='礼物感谢' v={catConfigData.ttsGift || false} c={commonSwitchItemSave} skey={'ttsGift'}/> */}
          <Divider />
          <SettingInputItem
            name="SESSDATA"
            v={catConfigData.SESSDATA || '-'}
            c={commonInputItemSave}
            skey="SESSDATA"
          />
          <Divider />
          <SettingInputItem
            name="csrf"
            v={catConfigData.csrf || '-'}
            c={commonInputItemSave}
            skey="csrf"
          />
          <Divider />
          <SettingInputItem
            name="TTS KEY"
            v={catConfigData.ttsKey || '-'}
            c={commonInputItemSave}
            skey="ttsKey"
          />
          <Divider />
          {/* <ColorSelectContainer c={commonInputItemSave}/> */}
        </div>
      </div>
    </Flex>
  );
};
export default Setting;
