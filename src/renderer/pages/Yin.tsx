import { Component, ReactNode } from 'react';
import { BiliBiliDanmu, MuaConfig } from 'renderer/@types/catcat';

type StateType = {
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

interface Yin {
  state: StateType;
  props: PropType;
}

class Yin extends Component {
  constructor(props: PropType) {
    super(props);
    console.info('Yin');
  }

  componentDidMount(): void {
    console.log('Yin');
  }

  render(): ReactNode {
    return (
      <>
        <div>
          <h1>Yin</h1>
        </div>
      </>
    );
  }
}

export default Yin;
