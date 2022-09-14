/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import {
  Badge,
  Button,
  Link,
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
import styles from '../styles/slider_menu.module.scss';
import abStyles from '../styles/about.module.scss';
import CatCatSign from './CatCatSign';
import MenuItem from './MenuItem';
import axios from 'axios';

// eslint-disable-next-line import/order

const SliderMenu = (prop: any | undefined) => {
  console.info(prop);
  const dataProp = {
   ...prop
  }
  const { roomid } = dataProp;
  const menuList = ['o(=•ェ•=)m', '启动', '直播画面', '关于'];
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
      svg:<svg className="icon cursor-pointer" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11202" width="25" height="25"><path d="M512 154.304a356.672 356.672 0 1 0 0 713.28A356.672 356.672 0 0 0 512 154.304zM76.16 510.912a435.904 435.904 0 1 1 871.744 0.064 435.904 435.904 0 0 1-871.808 0z m593.408 68.48c22.528-14.848 36.16-40.704 36.16-68.48 0-27.776-13.632-53.568-36.16-68.416l-208.256-136.96c-51.648-33.92-118.848 4.864-118.848 68.48v273.856c0 63.616 67.2 102.336 118.848 68.416l208.192-136.96v0.064z m-41.344-68.48l-208.256 136.96V374.016l208.256 136.96z" fill="#1ba784" fillOpacity=".85" opacity=".85" p-id="11203" /></svg>
    },
    menu_2: {
      name: menuList[2],
      // eslint-disable-next-line prettier/prettier
      svg:<svg className="icon cursor-pointer" viewBox="-210 -250 1024 1024" version="1.1"  xmlns="http://www.w3.org/2000/svg" width="40" height="40"><path d="M488.6 104.1C505.3 122.2 513 143.8 511.9 169.8V372.2C511.5 398.6 502.7 420.3 485.4 437.3C468.2 454.3 446.3 463.2 419.9 464H92.02C65.57 463.2 43.81 454.2 26.74 436.8C9.682 419.4 .7667 396.5 0 368.2V169.8C.7667 143.8 9.682 122.2 26.74 104.1C43.81 87.75 65.57 78.77 92.02 78H121.4L96.05 52.19C90.3 46.46 87.42 39.19 87.42 30.4C87.42 21.6 90.3 14.34 96.05 8.603C101.8 2.868 109.1 0 117.9 0C126.7 0 134 2.868 139.8 8.603L213.1 78H301.1L375.6 8.603C381.7 2.868 389.2 0 398 0C406.8 0 414.1 2.868 419.9 8.603C425.6 14.34 428.5 21.6 428.5 30.4C428.5 39.19 425.6 46.46 419.9 52.19L394.6 78L423.9 78C450.3 78.77 471.9 87.75 488.6 104.1H488.6zM449.8 173.8C449.4 164.2 446.1 156.4 439.1 150.3C433.9 144.2 425.1 140.9 416.4 140.5H96.05C86.46 140.9 78.6 144.2 72.47 150.3C66.33 156.4 63.07 164.2 62.69 173.8V368.2C62.69 377.4 65.95 385.2 72.47 391.7C78.99 398.2 86.85 401.5 96.05 401.5H416.4C425.6 401.5 433.4 398.2 439.7 391.7C446 385.2 449.4 377.4 449.8 368.2L449.8 173.8zM185.5 216.5C191.8 222.8 195.2 230.6 195.6 239.7V273C195.2 282.2 191.9 289.9 185.8 296.2C179.6 302.5 171.8 305.7 162.2 305.7C152.6 305.7 144.7 302.5 138.6 296.2C132.5 289.9 129.2 282.2 128.8 273V239.7C129.2 230.6 132.6 222.8 138.9 216.5C145.2 210.2 152.1 206.9 162.2 206.5C171.4 206.9 179.2 210.2 185.5 216.5H185.5zM377 216.5C383.3 222.8 386.7 230.6 387.1 239.7V273C386.7 282.2 383.4 289.9 377.3 296.2C371.2 302.5 363.3 305.7 353.7 305.7C344.1 305.7 336.3 302.5 330.1 296.2C323.1 289.9 320.7 282.2 320.4 273V239.7C320.7 230.6 324.1 222.8 330.4 216.5C336.7 210.2 344.5 206.9 353.7 206.5C362.9 206.9 370.7 210.2 377 216.5H377z" fill="#1ba784" fillOpacity=".85" opacity=".85" /></svg>
    },
    menu_3: {
      name: menuList[3],
      // eslint-disable-next-line prettier/prettier
      svg:<svg className="icon cursor-pointer" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9082" width="25" height="25"><path d="M509.953388 57.464783c-250.633271 0-454.535217 203.90297-454.535217 454.535217 0 250.662947 203.901946 454.535217 454.535217 454.535217 250.638387 0 454.535217-203.895807 454.535217-454.535217C964.488605 261.368776 760.590751 57.464783 509.953388 57.464783L509.953388 57.464783zM508.23935 923.475516c-227.256864 0-412.150898-184.888917-412.150898-412.150898 0-227.256864 184.895057-412.150898 412.150898-412.150898 227.263004 0 412.150898 184.895057 412.150898 412.150898C920.391271 738.586598 735.502353 923.475516 508.23935 923.475516L508.23935 923.475516zM509.953388 913.060305" p-id="9083" fill="#515151" /><path d="M510.004553 432.933223c-14.559601 0-26.373671 11.812023-26.373671 26.372647l0 303.290561c0 14.583137 11.81407 26.372647 26.373671 26.372647s26.372647-11.789511 26.372647-26.372647L536.3772 459.304847C536.376177 444.745247 524.564154 432.933223 510.004553 432.933223L510.004553 432.933223zM510.004553 432.933223" p-id="9084" fill="#515151"></path><path d="M457.258235 301.068963c0 13.804401 5.686513 27.53103 15.446807 37.292348 9.766434 9.766434 23.486924 15.452947 37.299511 15.452947 13.81054 0 27.53103-5.686513 37.299511-15.452947 9.766434-9.761318 15.446807-23.48897 15.446807-37.292348 0-13.811564-5.680373-27.53717-15.446807-37.299511-9.767458-9.766434-23.48897-15.452947-37.299511-15.452947-13.811564 0-27.533077 5.686513-37.299511 15.452947C462.944747 273.531793 457.258235 287.257399 457.258235 301.068963L457.258235 301.068963zM457.258235 301.068963" p-id="9085" fill="#515151"></path></svg>
    },
  };
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = React.useRef<HTMLButtonElement|null>(null)
  const pRef = React.useRef<HTMLVideoElement|null>(null);
  const [state , setState] = React.useState({
    playUrl: '',
  })
  let love =0 ;
  const toast = useToast();
  const openLove = async () => {
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
    window.electron.ipcRenderer.sendMessage('createDmWindow',[])
  }
  const startLivePreview = ()=> {
    window.electron.ipcRenderer.sendMessage('createLivePreview',[])
  }
  const { theme } = dataProp;
  // eslint-disable-next-line no-nested-ternary
  const liveColor = dataProp.live_status===0?'bg-gray-500' : dataProp.live_status===1?'bg-green-600':'bg-orange-300' ;
  console.info(liveColor);
  let sliderMenu = styles.slideMenuLight;
  switch (theme) {
    case 'light':
      sliderMenu = styles.slideMenuLight;
      break;
    case 'dark':
      sliderMenu = styles.slideMenuDark;
      break;
    default:
      sliderMenu = styles.slideMenuLight;
      break;
  }
    return (
      // eslint-disable-next-line react/jsx-no-comment-textnodes
      <>

      <div className={sliderMenu}>

          <div className="menu-photo">

            <img className="photo" src={dataProp.faceImg} alt='' />
            <p />
            <div className={abStyles.value && abStyles.title}>
              <Link target="_blank" href={`https://live.bilibili.com/${roomid}`} rel="noreferrer">
                {dataProp.nickname}
              </Link>
            </div><div className={`${' w-2 h-2 rounded-full self-center' } ${liveColor}`}/>
          </div>
          <div className="menu-list">
            <MenuItem menu = {data.menu_0} click = {openLove}/>
            <MenuItem menu = {data.menu_1} click = {startDanmuWindow}/>
            <MenuItem menu = {data.menu_2} click = {startLivePreview}/>
            <MenuItem menu = {data.menu_3} click = {onOpen}/>
          </div>
          <CatCatSign color = {data.color} theme={theme} />
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
