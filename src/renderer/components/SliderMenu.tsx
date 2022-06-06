/* eslint-disable prettier/prettier */
import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import About from '../pages/About';
import '../styles/slider-menu.css';
import CatCatSign from './CatCatSign';
import MenuItem from './MenuItem';

// eslint-disable-next-line import/order

const SliderMenu = (prop: any | undefined) => {
  console.info(prop);
  const dataProp = {
   ...prop
  }
  const menuList = ['🐱', '启动', '关于'];
  const data = {
    color: {
      color: '#efefef',
    },
    menu_0: {
      name: menuList[0],
      // eslint-disable-next-line prettier/prettier
      svg: ''
    // eslint-disable-next-line prettier/prettier
    // eslint-disable-next-line prettier/prettier
    },
    menu_1: {
      name: menuList[1],
      // eslint-disable-next-line prettier/prettier
      svg:<svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11202" width="25" height="25"><path d="M512 154.304a356.672 356.672 0 1 0 0 713.28A356.672 356.672 0 0 0 512 154.304zM76.16 510.912a435.904 435.904 0 1 1 871.744 0.064 435.904 435.904 0 0 1-871.808 0z m593.408 68.48c22.528-14.848 36.16-40.704 36.16-68.48 0-27.776-13.632-53.568-36.16-68.416l-208.256-136.96c-51.648-33.92-118.848 4.864-118.848 68.48v273.856c0 63.616 67.2 102.336 118.848 68.416l208.192-136.96v0.064z m-41.344-68.48l-208.256 136.96V374.016l208.256 136.96z" fill="#1ba784" fillOpacity=".85" opacity=".85" p-id="11203" /></svg>
    },
    menu_2: {
      name: menuList[2],
      // eslint-disable-next-line prettier/prettier
      svg:<svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9082" width="25" height="25"><path d="M509.953388 57.464783c-250.633271 0-454.535217 203.90297-454.535217 454.535217 0 250.662947 203.901946 454.535217 454.535217 454.535217 250.638387 0 454.535217-203.895807 454.535217-454.535217C964.488605 261.368776 760.590751 57.464783 509.953388 57.464783L509.953388 57.464783zM508.23935 923.475516c-227.256864 0-412.150898-184.888917-412.150898-412.150898 0-227.256864 184.895057-412.150898 412.150898-412.150898 227.263004 0 412.150898 184.895057 412.150898 412.150898C920.391271 738.586598 735.502353 923.475516 508.23935 923.475516L508.23935 923.475516zM509.953388 913.060305" p-id="9083" fill="#515151" /><path d="M510.004553 432.933223c-14.559601 0-26.373671 11.812023-26.373671 26.372647l0 303.290561c0 14.583137 11.81407 26.372647 26.373671 26.372647s26.372647-11.789511 26.372647-26.372647L536.3772 459.304847C536.376177 444.745247 524.564154 432.933223 510.004553 432.933223L510.004553 432.933223zM510.004553 432.933223" p-id="9084" fill="#515151"></path><path d="M457.258235 301.068963c0 13.804401 5.686513 27.53103 15.446807 37.292348 9.766434 9.766434 23.486924 15.452947 37.299511 15.452947 13.81054 0 27.53103-5.686513 37.299511-15.452947 9.766434-9.761318 15.446807-23.48897 15.446807-37.292348 0-13.811564-5.680373-27.53717-15.446807-37.299511-9.767458-9.766434-23.48897-15.452947-37.299511-15.452947-13.811564 0-27.533077 5.686513-37.299511 15.452947C462.944747 273.531793 457.258235 287.257399 457.258235 301.068963L457.258235 301.068963zM457.258235 301.068963" p-id="9085" fill="#515151"></path></svg>
    },
  };
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = React.useRef()
  let love =0 ;
  const toast = useToast();
  const openLove = () => {
    // eslint-disable-next-line no-plusplus
    love++;
    if(love >4){
      toast({
        title: '',
        description: '🐱🐱🐱🐱🐱🐱❤❤❤❤❤❤🐱🐱🐱🐱🐱🐱🐱',
        status: undefined,
        duration: 2000,
        isClosable: false,
      });
      love =0;
    }

  }
  const startDanmuWindow = ()=> {
    console.info(window.electron.store)
    window.electron.ipcRenderer.sendMessage('createDmWindow',[])
  }
    return (
      // eslint-disable-next-line react/jsx-no-comment-textnodes
      <>

      <div className="slider-menu">

          <div className="menu-photo">

            <img className="photo" src={dataProp.faceImg} alt='' />
            <p />
            {dataProp.nickname}
          </div>
          <div className="menu-list">
            <MenuItem menu = {data.menu_0} click = {openLove}/>
            <MenuItem menu = {data.menu_1} click = {startDanmuWindow}/>
            <MenuItem menu = {data.menu_2} click = {onOpen}/>
          </div>
          <CatCatSign color = {data.color} />
        </div>
        <Modal autoFocus={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay
              bg='blackAlpha.300'
              backdropFilter='blur(10px) hue-rotate(90deg)'
            />
            <ModalContent>
              <ModalHeader>关于</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <About />
              </ModalBody>

              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose} ref={initialRef}>
                  关闭
                </Button>
              </ModalFooter>
            </ModalContent>
        </Modal>
      </>
    )

}
export default SliderMenu
