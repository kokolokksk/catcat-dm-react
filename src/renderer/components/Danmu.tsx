import { Avatar } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../styles/danmuc.module.scss';
import { giftData } from '../components/CatCat';

const Danmu = (prop: any) => {
  const data = {
    ...prop,
  };
  console.info(data);
  const [isDisplayble, setIsDisplayble] = useState('inline');
  const [isGiftImgDisplayble, setIsGiftImgDisplayble] = useState('none');
  const [containerClass, setContainerClass] = useState(styles.danmuContainer);
  const [avatarFace, setAvatarFace] = useState('');
  const [giftImg, setGiftImg] = useState('');
  const faceImg = '';
  const changeDisplay = () => {
    setIsDisplayble('none');
  };
  const changeGiftDisplay = () => {
    setIsGiftImgDisplayble('none');
  };
  let danmuClass;
  useEffect(() => {
    if (data.data.type === 1) {
      const uid = data.data.origin.info[2][0];
      console.info(uid);
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
          setAvatarFace(response1.data.data.info.face);
          setIsDisplayble('inline');
        })
        // eslint-disable-next-line func-names
        .catch(function (error) {
          console.log(error);
        });
      // todo get img from web
    }
    if (data.data.type === 2) {
      setAvatarFace(data.data.origin.data.face);
      giftData.forEach((item) => {
        if (item.name === data.data.giftName) {
          setGiftImg(item.img);
        }
      });
      setIsDisplayble('inline');
      setIsGiftImgDisplayble('inline');
      setContainerClass(styles.giftContainer);
    }
    // eslint-disable-next-line prettier/prettier
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={containerClass}>
      <img
        alt=""
        className={styles.avatar}
        style={{ display: isDisplayble }}
        key={avatarFace}
        onError={changeDisplay}
        src={avatarFace}
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
        key={giftImg}
        onError={changeGiftDisplay}
        src={giftImg}
      />
    </div>
  );
};

export default Danmu;
