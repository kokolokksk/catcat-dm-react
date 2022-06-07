import { useColorMode } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../styles/danmuc.module.scss';
import { giftData } from './CatCat';

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
    if (data?.data.type === 1) {
      setIsDisplayble('inline');
      setContainerClass(styles.danmuContainer);
    }
    if (data?.data?.type === 2) {
      setAvatarFace(data.data.avatarFace);
      setIsDisplayble('inline');
      setIsGiftImgDisplayble('inline');
      if (!data?.data?.noBorder) {
        setContainerClass(styles.giftContainer);
      }
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
    </div>
  );
};

export default Danmu;
