import { ReactElement } from 'react';
import { useLocation } from 'react-router-dom';
import DanmuWindow from 'renderer/pages/DanmuWindow';
import LivePreview from 'renderer/pages/LivePreview';
import Setting from 'renderer/pages/Setting';

const RouteConfig = (_props: any) => {
  const location = useLocation();
  const { search } = location;

  // 视图配置
  const viewsConfig = (): { [key: string]: JSX.Element } => {
    return {
      notFind: <div />,
      dmWindow: <DanmuWindow />,
      main: <Setting />,
      livePreview: <LivePreview />,
    };
  };

  /**
   * 获取视图
   * @returns
   */
  const selectView = () => {
    const name: string = search?.substr(1);
    let view = viewsConfig()[name];
    if (view == null) {
      view = viewsConfig().notFind;
    }
    return view;
  };

  return <div>{selectView()}</div>;
};

export default RouteConfig;
