/* eslint-disable react/no-children-prop */
/* eslint-disable react/destructuring-assignment */
import {
  useToast,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Button,
} from '@chakra-ui/react';
import { SetStateAction, useState } from 'react';
import miku from '../assets/miku.gif';

const ChatContainer = (prop: any | undefined) => {
  const [value, setValue] = useState('');
  const [edit, setEdit] = useState(false);
  const toast = useToast();
  const handleChange = (event: { target: { value: SetStateAction<string> } }) =>
    setValue(event.target.value);
  const handleClick = () => {
    // eslint-disable-next-line react/destructuring-assignment
    const { SESSDATA } = prop.config;
    const { csrf } = prop.config;
    const { roomid } = prop.config;
    console.info(prop);
    if (SESSDATA && csrf && roomid) {
      if (value !== '') {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        send({
          value,
          roomid,
          SESSDATA,
          csrf,
          // extra
        });
        setValue('');
      } else {
        toast({
          title: '提示',
          description: '发送内容不能为空',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: '提示',
        description: 'SESSDATA 或 csrf 不能为空',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };
  const handleInputClick = () => {
    setEdit(edit);
  };
  const handleKeyDown = (event: { keyCode: number }) => {
    if (event.keyCode === 13) {
      handleClick();
    }
  };
  const { theme } = prop.config;
  let leftIcon;
  let leftIconBg;
  switch (theme) {
    case 'light':
      leftIcon = '❤';
      leftIconBg = '';
      break;
    case 'dark':
      leftIcon = '❤';
      leftIconBg = '';
      break;
    case 'wave':
      leftIcon = '❤';
      leftIconBg = '';
      break;
    case 'miku':
      leftIcon = '';
      leftIconBg = miku;
      break;
    default:
      leftIcon = '❤';
      leftIconBg = '';
      break;
  }
  return (
    <>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          color={theme === 'dark' ? '#88baf2' : '#7f95b6'}
          fontSize="1.2em"
          children={leftIcon}
          background={`url(${leftIconBg}) no-repeat`}
          style={{ backgroundSize: '90% 90%', top: '2px' }}
        />
        <Input
          style={
            theme === 'dark'
                ? {
                    background:
                      'linear-gradient(180deg, rgba(10,18,30,0.78), rgba(16,27,43,0.78))',
                    color: '#e7f0ff',
                    borderRadius: '16px',
                    border: '1px solid rgba(96, 128, 171, 0.8)',
                    height: '68px',
                    paddingLeft: '46px',
                    paddingRight: '102px',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                  }
                : {
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,248,253,0.94))',
                    color: '#1c3555',
                    borderRadius: '16px',
                    border: '1px solid rgba(168, 191, 220, 0.92)',
                    height: '68px',
                    paddingLeft: '46px',
                    paddingRight: '102px',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.72)',
                  }
          }
          _placeholder={{
            color:
              theme === 'dark'
                ? 'rgba(207, 224, 247, 0.52)'
                : 'rgba(91, 117, 154, 0.58)',
          }}
          placeholder="发送弹幕，进入直播间即时展示..."
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <InputRightElement width="96px" height="100%" pr="8px">
          <Button
            color={theme === 'dark' ? '#ecf6ff' : '#1d4d82'}
            bg={
              theme === 'dark'
                ? 'linear-gradient(180deg, #3b5f8f, #2f4d75)'
                : 'linear-gradient(180deg, #d8ebff, #bfdcff)'
            }
            border={
              theme === 'dark' ? '1px solid #6d94c4' : '1px solid #94b6de'
            }
            _hover={{
              bg: theme === 'dark' ? '#476d9f' : '#c8e0ff',
            }}
            onClick={handleClick}
            style={{
              height: '54px',
              width: '78px',
              borderRadius: '14px',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            发送
          </Button>
        </InputRightElement>
      </InputGroup>
    </>
  );
};
export default ChatContainer;

function send(arg0: { value: string; roomid: any; SESSDATA: any; csrf: any }) {
  window.electron.ipcRenderer.sendMessage('sendDanmu', [arg0]);
}
