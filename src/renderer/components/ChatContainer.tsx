import { useToast } from '@chakra-ui/react'
import { InputGroup, InputLeftElement, Input, InputRightElement, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { SetStateAction, useState } from "react"

const ChatContainer  = (prop:any | undefined) => {
    const [value, setValue] = useState('')
    const [edit, setEdit] = useState(false)
    const toast = useToast()
    const handleChange = (event: { target: { value: SetStateAction<string> } }) => setValue(event.target.value)
    const handleClick = () =>{
        const SESSDATA = prop.config.SESSDATA
        const csrf = prop.config.csrf
        const roomid = prop.config.roomid
        console.info(prop)
        if(SESSDATA&&csrf&&roomid){
            if (value !== '') {
                send({
                 value,
                  roomid,
                  SESSDATA,
                  csrf
                  // extra
                })
                setValue('')
              } else {
                toast({
                    title: '提示',
                    description: "发送内容不能为空",
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                })
              }
        }else{
            toast({
                title: '提示',
                description: "SESSDATA 或 csrf 不能为空",
                status: 'error',
                duration: 2000,
                isClosable: true,
              })
        }
    }
    const handleInputClick = () => {
        alert(edit)
        setEdit(edit)
    }
    return(
        <>
         <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          color='gray.300'
          fontSize='1.2em'
          children='❤'
        />
        <Input  placeholder='Say Something' value={value} onChange={handleChange}  />
        <InputRightElement   >
            <Button color='green.500' onClick={handleClick} > 发送</Button>
        </InputRightElement>
      </InputGroup>
        
         
        </>
       
    )
}
export default ChatContainer

function send(arg0: { value: string; roomid: any; SESSDATA: any; csrf: any }) {
    window.ipcRenderer.send('sendDanmu',arg0)
}
