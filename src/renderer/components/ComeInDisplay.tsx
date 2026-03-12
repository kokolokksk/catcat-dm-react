import { BiliBiliDanmu } from 'renderer/@types/catcat';
import styles from '../styles/danmuc.module.scss';

const ComeInDisplay = (prop: any) => {
  const data = {
    ...prop,
  };
  const themeClass =
    data.theme === 'light'
      ? styles.comeinContainerLight
      : data.theme === 'miku'
        ? styles.comeinContainerMiku
        : styles.comeinContainerDark;
  return (
    <>
      <div className={`${styles.comeinContainer} ${themeClass}`}>
        {data.data.map((comein: BiliBiliDanmu, index: number) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className={styles.comeinPill}>
              <span className={styles.comeinTag}>JOIN</span>
              <span className={styles.comeinText}>
                {comein.nickname} 进入了房间
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default ComeInDisplay;
