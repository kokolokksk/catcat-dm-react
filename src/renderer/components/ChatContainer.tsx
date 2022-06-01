/* eslint-disable react/no-children-prop */
/* eslint-disable react/destructuring-assignment */
import {
  useToast,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import React, { SetStateAction, useState } from 'react';

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
    alert(edit);
    setEdit(edit);
  };
  return (
    <>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          color="gray.300"
          fontSize="1.2em"
          children="❤"
        />
        <Input
          placeholder="Say Something"
          value={value}
          onChange={handleChange}
        />
        <InputRightElement>
          <Button color="green.500" onClick={handleClick}>
            {' '}
            发送
          </Button>
        </InputRightElement>
      </InputGroup>
    </>
  );
};
export default ChatContainer;

function send(arg0: { value: string; roomid: any; SESSDATA: any; csrf: any }) {
  window.ipcRenderer.send('sendDanmu', arg0);
}
