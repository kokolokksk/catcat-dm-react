/* eslint-disable jsx-a11y/label-has-associated-control */
import '../styles/wave.css';

const BackgroundWave = (prop: any | undefined) => {
  let color = {
    color: '#efefef',
  };
  // eslint-disable-next-line react/destructuring-assignment
  if (prop.color) {
    // eslint-disable-next-line react/destructuring-assignment
    color = prop.color;
  }
  return <div>{/* <div className={styles.snow} /> */}</div>;
};
export default BackgroundWave;
