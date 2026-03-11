/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/destructuring-assignment */
import styles from '../styles/slider_menu.module.scss';

const MenuItem = (prop: any | undefined) => {
  return (
    <button className={styles.menuItem} type="button" onClick={prop.click}>
      <span className={styles.menuIcon}>{prop.menu.svg}</span>
      <span className={styles.menuText}>{prop.menu.name}</span>
    </button>
  );
};
export default MenuItem;
