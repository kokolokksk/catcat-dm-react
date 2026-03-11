import { Component, ReactNode } from 'react';
import { BiliBiliDanmu, MuaConfig } from 'renderer/@types/catcat';
import MMD from '../components/mmd';
import styles from '../styles/yin.module.scss';

type StateType = {
  pause: boolean;
  comeInLastMinute: number;
  count: number;
  allDmList: { list: Array<BiliBiliDanmu>; autoHeight: number };
  scList: { list: Array<BiliBiliDanmu>; autoHeight: number };
  comeInList: Array<BiliBiliDanmu>;
  muaConfig: MuaConfig;
  theme: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type PropType = {};

interface Yin {
  state: StateType;
  props: PropType;
}
class Yin extends Component {
  state = {
    theme: 'light',
  };

  constructor(props: PropType) {
    super(props);
    console.info('Yin');
  }

  componentDidMount(): void {
    console.log('Yin');
    new MMD().render();
    const theme = window.electron.store.get('theme');
    if (theme) {
      this.setState({ theme });
    }
    window.theme.change((_event: any, data: any) => {
      this.setState({
        theme: Array.isArray(data) ? data[0] : data,
      });
    });
  }

  render(): ReactNode {
    const { theme } = this.state;
    return (
      <div className={theme === 'dark' ? styles.rootDark : styles.root}>
        <div id="three" className={styles.three} />
        <div className={styles.badge}>Yin Overlay</div>
      </div>
    );
  }
}

export default Yin;
