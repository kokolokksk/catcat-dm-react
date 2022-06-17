import { BiliBiliDanmu } from 'renderer/@types/catcat';
import styles from '../styles/danmuc.module.scss';

const ComeInDisplay = (prop: any) => {
  const data = {
    ...prop,
  };
  return (
    <>
      <div className={styles.comeinContainer}>
        {data.data.map((comein: BiliBiliDanmu, index: number) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className={styles.dmName}>
              {comein.nickname}进入了房间。
            </div>
          );
        })}
      </div>
    </>
  );
};
export default ComeInDisplay;
