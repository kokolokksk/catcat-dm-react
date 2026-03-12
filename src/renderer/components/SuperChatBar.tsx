/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  Divider,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { BiliBiliDanmu } from 'renderer/@types/catcat';
import danmucStyle from '../styles/danmuc.module.scss';
import localAvatar from '../assets/icon.png';
import { cacheAvatarSrc } from '../tauri/http';

const themeMap = {
  light: danmucStyle.superChatContainerLight,
  dark: danmucStyle.superChatContainerDark,
  wave: danmucStyle.superChatContainerWave,
  miku: danmucStyle.superChatContainerMiku,
  default: danmucStyle.superChatContainer,
};

const MiniSuperChat = (prop: {
  data: BiliBiliDanmu;
  theme: string;
  nickname: string;
  content: string;
}) => {
  const { data, theme, nickname, content } = prop;
  const [scLength, setScLength] = useState('100%');
  const [visible, setVisible] = useState(true);
  const [avatarSrc, setAvatarSrc] = useState(localAvatar);
  const priceText = useMemo(
    () => `${Math.max((data.price || 0) / 1000, 0)}¥`,
    [data.price]
  );

  useEffect(() => {
    let width = 100;
    let time = 30;
    const timer = window.setInterval(() => {
      try {
        if (data?.origin && (data.origin as any)?.data?.time) {
          time = (data.origin as any).data.time;
        }
      } catch (e) {
        console.error(e);
      }

      width -= 100 / time;
      setScLength(`${Math.max(width, 0)}%`);
      if (width <= 0) {
        setVisible(false);
        window.clearInterval(timer);
      }
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [data]);

  useEffect(() => {
    let canceled = false;
    const url = data?.origin && (data.origin as any)?.data?.user_info?.face;
    if (!url) {
      setAvatarSrc(localAvatar);
      return () => {
        canceled = true;
      };
    }

    cacheAvatarSrc(url)
      .then((src) => {
        if (!canceled) {
          setAvatarSrc(src || localAvatar);
        }
      })
      .catch(() => {
        if (!canceled) {
          setAvatarSrc(localAvatar);
        }
      });

    return () => {
      canceled = true;
    };
  }, [data]);

  if (!visible) {
    return null;
  }

  const containerClass =
    themeMap[theme as keyof typeof themeMap] || themeMap.default;
  const progressColor =
    data.color ||
    (theme === 'miku'
      ? 'linear-gradient(90deg, rgba(87, 214, 198, 0.95), rgba(48, 179, 167, 0.92))'
      : 'linear-gradient(90deg, rgba(117, 168, 232, 0.96), rgba(83, 131, 205, 0.92))');

  return (
    <Popover>
      <PopoverTrigger>
        <button
          type="button"
          className={`${containerClass} ${danmucStyle.superChatMini}`}
        >
          <div
            className={danmucStyle.superChatMeter}
            style={{
              width: scLength,
              background: progressColor,
            }}
          />
          <div className={danmucStyle.superChatMain}>
            <img
              alt=""
              className={danmucStyle.avatar}
              src={avatarSrc}
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (img.src !== localAvatar) {
                  img.src = localAvatar;
                }
              }}
            />
            <Divider orientation="vertical" className={danmucStyle.divider} />
            <div className={danmucStyle.superChatContent}>
              <div className={danmucStyle.messageMeta}>
                <span className={danmucStyle.nickname}>{nickname}</span>
                <span className={danmucStyle.messageTag}>SUPER CHAT</span>
              </div>
              <div className={danmucStyle.danmuContent}>{content}</div>
            </div>
            <div className={danmucStyle.priceBadge}>
              <small>¥</small>
              <b>{Math.max((data.price || 0) / 1000, 0)}</b>
            </div>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className={danmucStyle.superChatPopover}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader className={danmucStyle.superChatPopoverHeader}>
          <img
            alt=""
            className={danmucStyle.avatar}
            src={avatarSrc}
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.src !== localAvatar) {
                img.src = localAvatar;
              }
            }}
          />
          <span>{nickname}</span>
          <span className={danmucStyle.superChatPriceText}>{priceText}</span>
        </PopoverHeader>
        <PopoverBody className={danmucStyle.superChatPopoverBody}>
          {content}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const SuperChatBar = (prop: { theme: string; scList: { list: BiliBiliDanmu[] } }) => {
  const { theme, scList } = prop;

  if (!scList?.list?.length) {
    return null;
  }

  return (
    <div className={danmucStyle.superChatRail}>
      {scList.list.map((danmu: BiliBiliDanmu) => (
        <MiniSuperChat
          key={`sc-${danmu.id || danmu.keyy || danmu.timestamp}-${danmu.uid}`}
          theme={theme}
          nickname={danmu.nickname}
          content={danmu.content || ''}
          data={danmu}
        />
      ))}
    </div>
  );
};

export default SuperChatBar;
