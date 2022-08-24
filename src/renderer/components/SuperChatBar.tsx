/* eslint-disable jsx-a11y/label-has-associated-control */
import { CloseIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Progress,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { BiliBiliDanmu } from 'renderer/@types/catcat';
import style from '../styles/super_chat_bar.module.scss';
import danmucStyle from '../styles/danmuc.module.scss';

const MiniSuperChat = (prop: any | undefined) => {
  const { data } = prop;
  const [scLength, setScLength] = useState('100%');
  const [isDisplayble, setIsDisplayble] = useState(true);

  const { theme, data: dm } = prop;
  let { superChatContainer } = style;
  let hoverClass = 'hover:bg-red-200';
  useEffect(() => {
    let x = 100;
    let time = 30;
    const a = setInterval(() => {
      try {
        if (dm.origin.data.time) {
          time = dm.origin.data.time;
        }
      } catch (e) {
        console.error(e);
      }
      x -= 100 / time;
      setScLength(`${x}%`);
      if (x <= 0) {
        setScLength('0vw');
        setIsDisplayble(false);
        clearInterval(a);
      }
    }, 1000);
  }, []);
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
      <Popover>
        <PopoverTrigger>
          <div style={{ display: isDisplayble ? 'inline' : 'none' }}>
            <div
              className={`${superChatContainer} ${hoverClass} ${' rounded-full shadow-lg cursor-pointer '}`}
              style={{
                overflow: 'hidden',
                backgroundColor: '#fff',
              }}
            >
              <div
                style={{
                  backgroundColor: dm.color,
                  width: scLength,
                  height: '50px',
                  display: 'flex',
                }}
              />
              <div style={{ position: 'absolute', width: '24vw' }}>
                {dm.price / 1000}¥
              </div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            <img
              alt=""
              className={danmucStyle.avatar}
              src={data.data.user_info.face}
            />
            {data.nickname}
          </PopoverHeader>
          <PopoverBody>{data.content}</PopoverBody>
        </PopoverContent>
      </Popover>
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
          <div
            style={{
              flexDirection: 'row',
              display: 'flex',
            }}
          >
            {scList.list.map((danmu: BiliBiliDanmu) => (
              // eslint-disable-next-line react/jsx-no-undef

              <MiniSuperChat
                theme={theme}
                nickname={danmu.nickname}
                content={danmu.content}
                data={danmu}
              />
            ))}
          </div>
        </TransitionGroup>
      </div>
    </>
  );
};

export default SuperChatBar;
