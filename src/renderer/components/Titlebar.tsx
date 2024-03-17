/* eslint-disable jsx-a11y/label-has-associated-control */
import { CloseIcon, LockIcon, MinusIcon, UnlockIcon } from '@chakra-ui/icons';
import style from '../styles/titlebar.module.css';

const Titlebar = (prop: any | undefined) => {
  const { theme } = prop;
  let titlebarClass = style.titlebar;
  let titlebarCloseClass = style.titlebarClose;
  let titlebarMinusClass = style.titlebarMinus;
  let titlebaIgnoreClass = style.titlebarIgnore;
  switch (theme) {
    case 'light':
      titlebarClass = style.titlebarLight;
      titlebarCloseClass = style.titlebarCloseLight;
      titlebarMinusClass = style.titlebarMinusLight;
      break;
    case 'dark':
      titlebarClass = style.titlebarDark;
      titlebarCloseClass = style.titlebarCloseDark;
      titlebarMinusClass = style.titlebarMinusDark;
      break;
    case 'wave':
      titlebarClass = style.titlebarWave;
      titlebarCloseClass = style.titlebarCloseWave;
      titlebarMinusClass = style.titlebarMinusWave;
      break;
    case 'miku':
      titlebarClass = style.titlebarMiku;
      titlebarCloseClass = style.titlebarCloseMiku;
      titlebarMinusClass = style.titlebarMinusMiku;
      break;
    default:
      titlebarClass = style.titlebar;
      titlebarCloseClass = style.titlebarClose;
      titlebarMinusClass = style.titlebarMinus;
      titlebaIgnoreClass = style.titlebarIgnore;
      break;
  }
  const handleClick = () => {
    console.info('close');
    window.electron.ipcRenderer.sendMessage('closeWindow', ['dm-close']);
  };
  const handleMinusClick = () => {
    console.info('minus');
    window.electron.ipcRenderer.sendMessage('minusWindow', ['dm-minus']);
  };
  const ignoreMouse = async () => {
    // const lastSetting = await window.electron.store.get('setIgnoreMouseEvents');
    window.electron.ipcRenderer.sendMessage('setIgnoreMouseEvents', [true]);
    //window.electron.store.set('setIgnoreMouseEvents', true);
    titlebarCloseClass = style.classNone;
    titlebarMinusClass = style.classNone;
  };
  return (
    <>
      <div className={titlebarClass}>
        <div className={style.dragArea} />
        <div
          aria-hidden="true"
          className={`${titlebaIgnoreClass}`}
          onClick={ignoreMouse}
        >
          <LockIcon width={3} height={3} />
        </div>
        <div
          aria-hidden="true"
          className={titlebarMinusClass}
          onClick={handleMinusClick}
        >
          <MinusIcon width={3} height={3} />
        </div>
        <div
          aria-hidden="true"
          className={`${titlebarCloseClass}`}
          onClick={handleClick}
        >
          <CloseIcon width={3} height={3} />
        </div>
      </div>
    </>
  );
};
export default Titlebar;
