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
  return (
    <div>
      <div
        className="waveWrapper waveAnimation waveroot"
        style={{ display: 'inline' }}
      >
        <div className="waveWrapperInner bgTop">
          <div className="wave waveTop bgt" />
        </div>
        <div className="waveWrapperInner bgMiddle">
          <div className="wave waveMiddle bgm" />
        </div>
        <div className="waveWrapperInner bgBottom">
          <div className="wave waveBottom bgb" />
        </div>
      </div>
    </div>
  );
};
export default BackgroundWave;
