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
          color="gray.300"
          fontSize="1.2em"
          children={leftIcon}
          background={`url(${leftIconBg}) no-repeat`}
          style={{ backgroundSize: '90% 90%' }}
        />
        <Input
          style={
            theme === 'dark'
              ? {
                  background: 'rgba(11,18,31,0.65)',
                  color: '#e7f0ff',
                  borderRadius: '10px',
                  border: '1px solid #4f6a8d',
                }
              : {
                  background: 'rgba(255,255,255,0.84)',
                  color: '#1c3555',
                  borderRadius: '10px',
                  border: '1px solid #a8bfdc',
                }
          }
          placeholder="发送弹幕..."
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <InputRightElement>
          <Button
            color={theme === 'dark' ? '#d9ebff' : '#1f3f66'}
            bg={theme === 'dark' ? '#2e4668' : '#dceaff'}
            border={
              theme === 'dark' ? '1px solid #5f7ea8' : '1px solid #a8bfdc'
            }
            _hover={{
              bg: theme === 'dark' ? '#3b5a84' : '#cddff8',
            }}
            onClick={handleClick}
            style={{ height: '92%', borderRadius: '8px' }}
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
