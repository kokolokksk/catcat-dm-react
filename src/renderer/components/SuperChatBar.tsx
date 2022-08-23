/* eslint-disable jsx-a11y/label-has-associated-control */
import { CloseIcon, MinusIcon } from '@chakra-ui/icons';
import { TransitionGroup } from 'react-transition-group';
import { BiliBiliDanmu } from 'renderer/@types/catcat';
import style from '../styles/super_chat_bar.module.scss';

const MiniSuperChat = (prop: any | undefined) => {
  const { theme, data: dm } = prop;
  let { superChatContainer } = style;
  let hoverClass = 'hover:bg-red-200';
  switch (theme) {
    case 'light':
      superChatContainer = style.superChatContainer;
      break;
    case 'dark':
      break;
    case 'wave':
      break;
    case 'miku':
      hoverClass = style.hoverClassMiku;
      break;
    default:
      break;
  }
  return (
    <>
      <div
        className={`${superChatContainer} ${hoverClass} ${' rounded-full shadow-lg cursor-pointer '}`}
      >
        {dm.price / 1000}¥
      </div>
    </>
  );
};

const SuperChatBar = (prop: any | undefined) => {
  const { theme, scList } = prop;
  console.info(theme);
  let { superChatBarClass } = style;
  let titlebarCloseClass = style.titlebarClose;
  let titlebarMinusClass = style.titlebarMinus;
  switch (theme) {
    case 'light':
      superChatBarClass = style.superChatBarClass;
      titlebarCloseClass = style.titlebarCloseLight;
      titlebarMinusClass = style.titlebarMinusLight;
      break;
    case 'dark':
      superChatBarClass = style.superChatBarClass;
      titlebarCloseClass = style.titlebarCloseDark;
      titlebarMinusClass = style.titlebarMinusDark;
      break;
    case 'wave':
      superChatBarClass = style.superChatBarClass;
      titlebarCloseClass = style.titlebarCloseWave;
      titlebarMinusClass = style.titlebarMinusWave;
      break;
    case 'miku':
      superChatBarClass = style.superChatBarClass;
      titlebarCloseClass = style.titlebarCloseMiku;
      titlebarMinusClass = style.titlebarMinusMiku;
      break;
    default:
      superChatBarClass = style.superChatBarClass;
      titlebarCloseClass = style.titlebarClose;
      titlebarMinusClass = style.titlebarMinus;
      break;
  }
  const handleClick = () => {
    console.info('close');
    window.electron.ipcRenderer.sendMessage('closeWindow', ['dm-close']);
  };
  return (
    <>
      <div className={superChatBarClass}>
        <TransitionGroup>
          <>
            {scList.list.map((danmu: BiliBiliDanmu) => (
              // eslint-disable-next-line react/jsx-no-undef

              <MiniSuperChat
                theme={theme}
                nickname={danmu.nickname}
                content={danmu.content}
                data={danmu}
              />
            ))}
          </>
        </TransitionGroup>
      </div>
    </>
  );
};

export default SuperChatBar;
