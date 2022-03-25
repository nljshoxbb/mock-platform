import { UserLoginResponse, UserLogout } from '@/services';
import { LocalStorage } from '@/utils/LocalStorage';
import { LogoutOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link, Redirect, Route } from 'react-router-dom';

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
  const Onlogout = () => {
    // @ts-ignore
    UserLogout({ uid: userInfo?.uid }).then((res) => {
      history.push({ pathname: '/login' });
    });
  };
  const [activeKey, setActiveKey] = useState<string>('mock');

  const onTabChanged = (key: string) => {
    setActiveKey(key);
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
        <LogoutOutlined title="退出登录" className={styles.logoutIcon} onClick={Onlogout} />
      </div>
      <div className={styles.tabs}>
        <Tabs
          defaultActiveKey="mock"
          destroyInactiveTabPane
          // activeKey={props.location.state && props.location.state.tabKey ? props.location.state.tabKey : 'mock'}
          activeKey={pathname}
          onChange={onTabChanged}
          style={{ height: 100 }}
        >
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
