import { Component, ReactNode } from 'react';
import { BiliBiliDanmu, MuaConfig } from 'renderer/@types/catcat';
import style from '../styles/lock.module.css';
import { LockIcon } from '@chakra-ui/icons';

type StateType = {
  titlebaIgnoreClass: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type PropType = {};

interface LockWindow {
  state: StateType;
  props: PropType;
}
class LockWindow extends Component {
  constructor(props: PropType) {
    super(props);
    console.info('LockWindow');
    this.state = {
      titlebaIgnoreClass: style.lockIgnore,
    };
  }

  componentDidMount(): void {
    console.log('LockWindow');
  }

  ignoreMouse = async () => {
    // const lastSetting = await window.electron.store.get('setIgnoreMouseEvents');
    window.electron.ipcRenderer.sendMessage('setIgnoreMouseEvents', [true]);
  };

  render(): ReactNode {
    const { titlebaIgnoreClass } = this.state;
    return (
      <>
        <div>
          <div
            aria-hidden="true"
            className={`${titlebaIgnoreClass}`}
            onClick={this.ignoreMouse}
          >
            <LockIcon width={3} height={3} />
          </div>
        </div>
      </>
    );
  }
}

export default LockWindow;
