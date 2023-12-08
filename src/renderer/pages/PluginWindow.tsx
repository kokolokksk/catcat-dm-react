/* eslint-disable jsx-a11y/anchor-is-valid */
import { createStandaloneToast } from '@chakra-ui/toast';
import { BiliBiliDanmu, MuaConfig } from 'renderer/@types/catcat';
import dayjs from 'dayjs';
import React, { useRef } from 'react';
import CatLog from 'renderer/utils/CatLog';
import * as CONSTANT from 'renderer/@types/catcat/constan';
import { set } from 'electron-json-storage';

type StateType = {
  htmlContent: any;
  pause: boolean;
  comeInLastMinute: number;
  count: number;
  allDmList: { list: Array<BiliBiliDanmu>; autoHeight: number };
  scList: { list: Array<BiliBiliDanmu>; autoHeight: number };
  comeInList: Array<BiliBiliDanmu>;
  muaConfig: MuaConfig;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type PropType = {};

interface PluginWindow {
  state: StateType;
  props: PropType;
}
const { toast } = createStandaloneToast();

class PluginWindow extends React.Component {
  listHeightRef: any = '';

  popoverRef: any = '';

  loaded: boolean = false;

  count: number = 0;

  // eslint-disable-next-line global-require
  speakStatus = false;

  ttsOk = false;

  speakDMList: Array<BiliBiliDanmu> = [];

  initMsg: BiliBiliDanmu = {
    keyy: 0,
    type: 1,
    uid: 123,
    content: `${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
    avatarFace: CONSTANT.APP_ICON,
    nickname: 'catcat',
    timestamp: new Date().getTime(),
    price: 0,
    giftNum: 0,
  };

  constructor(props: PropType) {
    super(props);
    this.state = {
      htmlContent: '',
    };
  }

  componentDidMount() {
    window.danmuApi.loadPlugins((_event: any, data: any) => {
      console.info(data);

      const { name } = data;
      // d ata.path.replace(/\\/g, '\\\\');
      console.info(name);

      import(`C://Users//Public//Roaming//catcat-dm-react//plugins//${name}.js`).then((res: any) => {
        console.info(res);
        this.setState({
          htmlContent: res.default.html(),
        }, () => {
          res.default.events();
        }
        );
       // res.default.events();
        return res.default;
      });
    });
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    // FIXME bad usage
    CatLog.console('componentDidUpdate');
  }

  componentWillUnmount() {}

  render() {
    const { htmlContent } = this.state;
    console.info(htmlContent);
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: this.state.htmlContent }} />
      </>
    );
  }
}

export default PluginWindow;
