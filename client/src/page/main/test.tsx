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
  const [activeKey, setActiveKey] = useState<string>('mock');
  useEffect(() => {
    setUserInfo(JSON.parse(localStorage.getItem(LocalStorage.MOCK_USER_INFO) || ''));
  }, []);
  const Onlogout = () => {
    // @ts-ignore
    UserLogout({ uid: userInfo?.uid }).then((res) => {
      history.push({ pathname: '/login' });
    });
  };
  // console.log(userInfo, "userInfo");
  const onTabChanged = (key: string) => {
    setActiveKey(key);
    history.push({
      pathname: '/main/' + key,
      state: {
        tabKey: key
      }
    });
  };

  console.log(props.location, 6);
  // useEffect(()=>{
  //   if(!props.location.state) {
  //     history.push({pathname:'/main/mock'})
  //   }
  // },)

  return (
    <div className={styles.mainBigBox}>
      <div className={styles.logout}>
        <span>{userInfo?.username}</span>
        <LogoutOutlined title="退出登录" className={styles.logoutIcon} onClick={Onlogout} />
      </div>
      <Tabs
        destroyInactiveTabPane
        onChange={(key) => onTabChanged(key)}
        activeKey={props.location.state && props.location.state.tabKey ? props.location.state.tabKey : 'mock'}
      >
        <TabPane tab="mock数据" key="mock"></TabPane>
        <TabPane tab="用户管理" key="user"></TabPane>
        <TabPane tab="账户管理" key="account"></TabPane>
      </Tabs>
      <Route exact path="/main/mock" component={Interface} />
      <Route exact path="/main/user" component={User} />
      <Route exact path="/main/account" component={Account} />

      {/* <Route
            exact
            path="/main"
            render={() => (<Redirect to='/main/mock'/>)}
            /> */}
    </div>
  );
};
export default Main;
