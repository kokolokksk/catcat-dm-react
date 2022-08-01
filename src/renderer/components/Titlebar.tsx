/* eslint-disable jsx-a11y/label-has-associated-control */
import { CloseIcon } from '@chakra-ui/icons';
import style from '../styles/titlebar.module.css';

const Titlebar = (prop: any | undefined) => {
  const { theme } = prop;
  console.info(theme);
  let titlebarClass = style.titlebar;
  let titlebarCloseClass = style.titlebarClose;
  switch (theme) {
    case 'light':
      titlebarClass = style.titlebarLight;
      titlebarCloseClass = style.titlebarCloseLight;
      break;
    case 'dark':
      titlebarClass = style.titlebarDark;
      titlebarCloseClass = style.titlebarCloseDark;
      break;
    case 'wave':
      titlebarClass = style.titlebarWave;
      titlebarCloseClass = style.titlebarCloseWave;
      break;
    default:
      titlebarClass = style.titlebar;
      titlebarCloseClass = style.titlebarClose;
      break;
  }
  const handleClick = () => {
    console.info('close');
    window.electron.ipcRenderer.sendMessage('closeWindow', ['dm-close']);
  };

  return (
    <>
      <div className={titlebarClass}>
        <div className={style.dragArea} />
        <CloseIcon
          width={4}
          height={4}
          className={titlebarCloseClass}
          onClick={handleClick}
        />
      </div>
    </>
  );
};
export default Titlebar;
