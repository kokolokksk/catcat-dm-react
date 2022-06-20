/* eslint-disable no-nested-ternary */
import { useColorMode } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../styles/danmuc.module.scss';
import { giftData } from './CatCat';

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
  const { superChatContainer, gbContainer } = styles;
  const [avatarFace, setAvatarFace] = useState('');
  const [giftImg, setGiftImg] = useState('');
  const faceImg = '';
  const [scBorder, setScBorder] = useState('');
  const changeDisplay = () => {
    setIsDisplayble('none');
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
  return data?.data.type === 1 ? (
    <div className={styles.danmuContainer}>
      <img
        alt=""
        className={styles.avatar}
        style={{ display: isDisplayble }}
        onError={changeDisplay}
        src={data.data.avatarFace}
      />
      <div className={styles.fansAndNickname}>
        <div className={styles.nickname}> {data.nickname}</div>
      </div>
      <div className={styles.fansAndNickname}>
        {/* <div className={styles.fans}>1</div> */}
      </div>
      <div className={styles.danmuContent}>{data.content}</div>
      <img
        alt=""
        className={styles.avatar}
        style={{ display: isChatImgDisplayble }}
        key={data.data.giftImg}
        onError={changeChatDisplay}
        src={data.data.giftImg}
      />
    </div>
  ) : data?.data.type === 2 ? (
    <div className={containerClass}>
      <img
        alt=""
        className={styles.avatar}
        style={{ display: isDisplayble }}
        onError={changeDisplay}
        src={data.data.avatarFace}
      />
      <div className={styles.fansAndNickname}>
        <div className={styles.nickname}> {data.nickname}</div>
      </div>
      <div className={styles.fansAndNickname}>
        {/* <div className={styles.fans}>1</div> */}
      </div>
      <div className={styles.danmuContent}>{data.content}</div>
      <img
        alt=""
        className={styles.avatar}
        style={{ display: isGiftImgDisplayble }}
        key={data.data.giftImg}
        onError={changeGiftDisplay}
        src={data.data.giftImg}
      />
      <div
        style={{
          color: 'orange',
          backgroundColor: '#6F4D76',
          border: 'solid 1px teal',
          display: isGiftPriceDisplayble,
        }}
      >
        <small>￥</small>
        <b>{data.data.price / 1000}</b>
      </div>
    </div>
  ) : data?.data.type === 4 ? (
    <div
      className={gbContainer}
      style={
        data.data.giftName === '舰长'
          ? {
              backgroundImage:
                'linear-gradient(90deg,rgba(255,255,255,0) 0,#fff 100%),url(https://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/bg-3.5bf39ce..png)',
              filter: 'drop-shadow(-9px 4px 10px rgba(131,184,255,.51))',
            }
          : data.data.giftName === '提督'
          ? {
              backgroundImage:
                'linear-gradient(90deg,rgba(255,255,255,0) 0,#fff 100%),url(https://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/bg-2.013eeff..png)',
              filter: 'drop-shadow(-9px 4px 10px rgba(215,134,255,.37))',
            }
          : data.data.giftName === '总督'
          ? {
              backgroundImage:
                'linear-gradient(90deg,rgba(255,255,255,0) 0,#fff 100%),url(https://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/bg-1.61830d7..png)',
              filter: 'drop-shadow(-9px 4px 10px rgba(215,134,255,.37))',
            }
          : {}
      }
    >
      <img
        alt=""
        className={styles.avatar}
        style={{ display: isDisplayble }}
        onError={changeDisplay}
        src={data.data.avatarFace}
      />
      <div className={styles.fansAndNickname}>
        <div className={styles.nickname}> {data.nickname}</div>
      </div>
      <div className={styles.fansAndNickname}>
        {/* <div className={styles.fans}>1</div> */}
      </div>
      <div className={styles.danmuContent}>{data.content}</div>
      <span
        className={styles.avatar}
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
        <small>￥</small>
        <b>{data.data.price / 1000}</b>
      </div>
    </div>
  ) : (
    <div className={superChatContainer} style={{ border: scBorder }}>
      <img
        alt=""
        className={styles.avatar}
        style={{ display: isDisplayble }}
        onError={changeDisplay}
        src={data.data.avatarFace}
      />
      <div className={styles.fansAndNickname}>
        <div className={styles.nickname}> {data.nickname}</div>
      </div>
      <div className={styles.fansAndNickname}>
        {/* <div className={styles.fans}>1</div> */}
      </div>
      <div className={styles.superChatContent}>{data.content}</div>
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
