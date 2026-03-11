/* eslint-disable no-nested-ternary */
import { Divider, useColorMode } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import * as CONSTANT from '../@types/catcat/constan';
import localAvatar from '../assets/icon.png';
import { cacheAvatarSrc } from '../tauri/http';
import styles from '../styles/danmuc.module.scss';
import themes from '../styles/themes.module.scss';

const Danmu = (prop: any) => {
  const data = {
    ...prop,
  };
  // console.info(data);
  const [isDisplayble, setIsDisplayble] = useState('inline');
  const [isGiftImgDisplayble, setIsGiftImgDisplayble] = useState('none');
  const [isChatImgDisplayble, setIsChatImgDisplayble] = useState('none');
  const [isGiftPriceDisplayble, setIsGiftPriceDisplayble] = useState('none');
  const [containerClass, setContainerClass] = useState(styles.danmuContainer);
  const { superChatContainer } = styles;
  const [avatarFace, setAvatarFace] = useState('');
  const [giftImg, setGiftImg] = useState('');
  const faceImg = '';
  const [avatarSrc, setAvatarSrc] = useState(localAvatar);
  const [giftImgSrc, setGiftImgSrc] = useState('');
  const [scBorder, setScBorder] = useState('');
  const theme = useColorMode();
  console.info(theme);
  const changeDisplay = () => {
    setIsDisplayble('none');
  };
  const onAvatarError = (e: any) => {
    const img = e.currentTarget as HTMLImageElement;
    if (img.src !== localAvatar) {
      img.src = localAvatar;
      return;
    }
    changeDisplay();
  };
  const changeGiftDisplay = () => {
    setIsGiftImgDisplayble('none');
  };
  const changeChatDisplay = () => {
    setIsChatImgDisplayble('none');
  };
  let danmuClass;
  useEffect(() => {
    // danmu
    if (data?.data.type === 1) {
      setIsDisplayble('inline');
      setIsChatImgDisplayble('inline');
      setContainerClass(styles.danmuContainer);
    } else if (data?.data?.type === 2) {
      setIsDisplayble('inline');
      setIsGiftImgDisplayble('inline');
      if (data?.data?.noBorder) {
        setContainerClass(styles.danmuContainer);
      }
      if (data.data.price <= 0) {
        setIsGiftPriceDisplayble('none');
      } else {
        setIsGiftPriceDisplayble('inline');
      }
    } else if (data.data.type === 3) {
      console.info('3');
    } else if (data.data.type === 4) {
      console.info('4');
    } else {
      console.info('5');
    }
    setScBorder(`solid 1px teal`);
    // 舰长
    // if (data.data.type === 4) {

    // }
    // eslint-disable-next-line prettier/prettier
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let canceled = false;
    const url = data?.data?.avatarFace;
    if (!url) {
      setAvatarSrc(localAvatar);
      return () => {
        canceled = true;
      };
    }

    cacheAvatarSrc(url)
      .then((src) => {
        if (!canceled) {
          setAvatarSrc(src || localAvatar);
        }
      })
      .catch(() => {
        if (!canceled) {
          setAvatarSrc(localAvatar);
        }
      });

    return () => {
      canceled = true;
    };
  }, [data?.data?.avatarFace]);

  useEffect(() => {
    let canceled = false;
    const url = data?.data?.giftImg;
    if (!url) {
      setGiftImgSrc('');
      return () => {
        canceled = true;
      };
    }

    cacheAvatarSrc(url)
      .then((src) => {
        if (!canceled) {
          setGiftImgSrc(src || '');
        }
      })
      .catch(() => {
        if (!canceled) {
          setGiftImgSrc(url);
        }
      });

    return () => {
      canceled = true;
    };
  }, [data?.data?.giftImg]);
  let danmuContainer;
  let gbContainer;
  let themeBackColor;
  let themeColor;
  let scContainer;
  let hoverClass = 'hover:bg-red-200';
  switch (data.theme) {
    case 'dark':
      danmuContainer = styles.danmuContainerDark;
      gbContainer = styles.gbContainer;
      scContainer = styles.superChatContainerDark;
      break;
    case 'light':
      danmuContainer = styles.danmuContainer;
      gbContainer = styles.gbContainer;
      scContainer = styles.superChatContainerLight;
      break;
    case 'wave':
      danmuContainer = styles.danmuContainer;
      gbContainer = styles.gbContainer;
      scContainer = styles.superChatContainerWave;
      break;
    case 'miku':
      danmuContainer = styles.danmuContainerMiku;
      gbContainer = styles.gbContainerMiku;
      hoverClass = styles.hoverClassMiku;
      scContainer = styles.superChatContainerMiku;
      themeBackColor = themes.mikuBaseBackground;
      break;
    default:
      danmuContainer = styles.danmuContainer;
      gbContainer = styles.gbContainer;
      scContainer = styles.scContainer;
      break;
  }
  return data?.data.type === 1 ? (
    <div
      className={`${danmuContainer} ${hoverClass} ${'rounded-2xl shadow-lg cursor-pointer '} ${
        styles.noDrag
      }`}
    >
      <div className={styles.avatarRail}>
        <img
          alt=""
          className={styles.avatar}
          style={{ display: isDisplayble }}
          onError={onAvatarError}
          src={avatarSrc}
        />
        <Divider
          orientation="vertical"
          className={
            theme.colorMode === 'dark' ? styles.dividerDark : styles.divider
          }
        />
      </div>
      <div className={styles.messageBody}>
        <div className={styles.messageMeta}>
          <div className={styles.nickname}>{data.nickname}</div>
          <div className={styles.messageTag}>DANMU</div>
        </div>
        <div className={styles.danmuContent}>{data.content}</div>
      </div>
      {giftImgSrc ? (
        <img
          alt=""
          className={styles.chatImage}
          style={{ display: isChatImgDisplayble }}
          key={giftImgSrc}
          onError={changeChatDisplay}
          src={giftImgSrc}
        />
      ) : null}
    </div>
  ) : data?.data.type === 2 ? (
    <div
      className={`${danmuContainer} ${hoverClass} ${' rounded-2xl shadow-lg cursor-pointer '} ${
        styles.noDrag
      }`}
    >
      <div className={styles.avatarRail}>
        <img
          alt=""
          className={styles.avatar}
          style={{ display: isDisplayble }}
          onError={onAvatarError}
          src={avatarSrc}
        />
        <Divider
          orientation="vertical"
          className={
            theme.colorMode === 'dark' ? styles.dividerDark : styles.divider
          }
        />
      </div>
      <div className={styles.messageBody}>
        <div className={styles.messageMeta}>
          <div className={styles.nickname}>{data.nickname}</div>
          <div className={styles.messageTag}>GIFT</div>
        </div>
        <div className={styles.danmuContent}>{data.content}</div>
      </div>
      {giftImgSrc ? (
        <img
          alt=""
          className={styles.chatImage}
          style={{ display: isGiftImgDisplayble }}
          key={giftImgSrc}
          onError={changeGiftDisplay}
          src={giftImgSrc}
        />
      ) : null}
      <div
        className={styles.priceBadge}
        style={{
          display: isGiftPriceDisplayble,
        }}
      >
        <small>￥</small>
        <b>{data.data.price / 1000}</b>
      </div>
    </div>
  ) : data?.data.type === 4 ? (
    <div
      className={`${gbContainer} ${hoverClass} ${' rounded-2xl shadow-lg cursor-pointer '} ${
        styles.noDrag
      }`}
      style={
        data.data.giftName === '舰长'
          ? {
              backgroundImage: `linear-gradient(90deg,rgba(255,255,255,0) 0,#fff 100%),url(${CONSTANT.BGI_JIANZHANG})`,
              filter: 'drop-shadow(-9px 4px 10px rgba(131,184,255,.51))',
            }
          : data.data.giftName === '提督'
          ? {
              backgroundImage: `linear-gradient(90deg,rgba(255,255,255,0) 0,#fff 100%),url(${CONSTANT.BGI_TIDU})`,
              filter: 'drop-shadow(-9px 4px 10px rgba(215,134,255,.37))',
            }
          : data.data.giftName === '总督'
          ? {
              backgroundImage: `linear-gradient(90deg,rgba(255,255,255,0) 0,#fff 100%),url(${CONSTANT.BGI_ZONGDU})`,
              filter: 'drop-shadow(-9px 4px 10px rgba(215,134,255,.37))',
            }
          : {}
      }
    >
      <img
        alt=""
        className={styles.avatar}
        style={{ display: isDisplayble }}
        onError={onAvatarError}
        src={avatarSrc}
      />
      <Divider
        orientation="vertical"
        className={
          theme.colorMode === 'dark' ? styles.dividerDark : styles.divider
        }
      />
      <div className={styles.fansAndNickname}>
        <div className={styles.nickname}> {data.nickname}</div>
      </div>
      <div className={styles.fansAndNickname}>
        {/* <div className={styles.fans}>1</div> */}
      </div>
      <div className={styles.danmuContent}>{data.content}</div>
      <span
        className={styles.chatImage}
        style={
          data.data.giftName === '舰长'
            ? {
                width: '32px',
                backgroundSize: 'contain',
                display: 'inline',
                backgroundImage:
                  'url(//https:s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/star.d40d9a4..png),url(https://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/icon-l-3.402ac8f..png)',
              }
            : data.data.giftName === '提督'
            ? {
                width: '32px',
                backgroundSize: 'contain',
                display: 'inline',
                backgroundImage:
                  'url(https://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/star.d40d9a4..png),url(https://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/icon-l-2.6f68d77..png)',
              }
            : data.data.giftName === '总督'
            ? {
                width: '32px',
                backgroundSize: 'contain',
                display: 'inline',
                backgroundImage:
                  'url(https://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/star.d40d9a4..png),url(https://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/icon-l-1.fde1190..png)',
              }
            : {}
        }
        key={data.data.giftImg}
        onError={changeGiftDisplay}
      />
      <div
        style={{
          color: 'orange',
          backgroundColor: '#6F4D76',
          border: 'solid 1px teal',
        }}
      >
        <small>¥</small>
        <b>{data.data.price / 1000}</b>
      </div>
    </div>
  ) : (
    <div
      className={`${scContainer} ${hoverClass} ${'rounded-2xl shadow-lg cursor-pointer '} ${
        styles.noDrag
      }`}
      style={{
        border: scBorder,
        backgroundColor: data.data.background_color,
        height: 'auto',
      }}
    >
      <img
        alt=""
        className={styles.avatar}
        style={{ display: isDisplayble }}
        onError={onAvatarError}
        src={avatarSrc}
      />
      <Divider
        orientation="vertical"
        className={
          theme.colorMode === 'dark' ? styles.dividerDark : styles.divider
        }
      />
      <div className={styles.fansAndNickname}>
        <div className={styles.nickname}> {data.nickname}</div>
      </div>
      <div className={styles.fansAndNickname}>
        {/* <div className={styles.fans}>1</div> */}
      </div>
      <div
        className={styles.superChatContent}
        style={{ color: data.color, fontSize: '1.2rem', fontWeight: 'bold' }}
      >
        {data.content}
      </div>
      <div
        style={{
          color: 'orange',
          backgroundColor: '#6F4D76',
          border: 'solid 1px teal',
        }}
      >
        <small>￥</small>
        <b>{data.data.price / 1000}</b>
      </div>
    </div>
  );
};

export default Danmu;
