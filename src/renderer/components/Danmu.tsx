import styles from '../styles/danmuc.module.scss';

const Danmu = (prop: any) => {
  const data = {
    ...prop,
  };
  const faceImg = '';

  if (data.data.type === 1) {
    // todo get img from web
  }

  return (
    <div className={styles.danmuContainer}>
      <img
        alt="face"
        className={styles.avatar}
        src={data.data.type === 2 ? data.data.origin.data.face : ''}
      />
      <div className={styles.fansAndNickname}>
        <div className={styles.nickname}> {data.nickname}</div>
      </div>
      <div className={styles.fansAndNickname}>
        {/* <div className={styles.fans}>1</div> */}
      </div>
      <div className={styles.danmuContent}>{data.content}</div>
    </div>
  );
};

export default Danmu;
