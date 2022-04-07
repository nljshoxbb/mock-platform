import { UserLoginResponse, UserLogout } from '@/services';
import { LocalStorage } from '@/utils/LocalStorage';
import { LogoutOutlined } from '@ant-design/icons';
import { Popconfirm, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Route } from 'react-router-dom';

import Account from '../account';
import Interface from '../interface';
import User from '../user';
import styles from './index.less';

const { TabPane } = Tabs;
const Main = (props: any) => {
  const [userInfo, setUserInfo] = useState<UserLoginResponse>();
  const history = useHistory();

  useEffect(() => {
    setUserInfo(JSON.parse(localStorage.getItem(LocalStorage.MOCK_USER_INFO) || ''));
  }, []);
  const onLogout = () => {
    // @ts-ignore
    UserLogout({ uid: userInfo?.uid }).then((res) => {
      history.push({ pathname: '/login' });
    });
  };

  const onTabChanged = (key: string) => {
    history.push({
      pathname: key
    });
  };

  const { location } = history;
  const { pathname } = location;

  return (
    <div className={styles.mainBigBox}>
      <div className={styles.logout}>
        <span>{userInfo?.username}</span>
        <Popconfirm title="确定要退出登录吗？" onConfirm={onLogout} placement="leftBottom">
          <LogoutOutlined title="退出登录" className={styles.logoutIcon} />
        </Popconfirm>
      </div>
      <div className={styles.tabs}>
        <Tabs defaultActiveKey="mock" destroyInactiveTabPane activeKey={pathname} onChange={onTabChanged} style={{ height: 100 }}>
          <TabPane tab="mock数据" key="/main/mock"></TabPane>
          <TabPane tab="用户管理" key="/main/user"></TabPane>
          <TabPane tab="账户管理" key="/main/account"></TabPane>
        </Tabs>
      </div>
      <Route exact path="/main/mock" component={Interface} />
      <Route exact path="/main/user" component={User} />
      <Route exact path="/main/account" component={Account} />
    </div>
  );
};
export default Main;
