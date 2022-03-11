import { Link, Redirect, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { UserLoginResponse, UserLogout } from "@/services";

import Interface from "../interface";
import { LocalStorage } from "@/utils/LocalStorage";
import { LogoutOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import User from "../user";
import Account from "../account";

import styles from "./index.less";
import { useHistory } from "react-router";

const { TabPane } = Tabs;
const Main = () => {
  const [userInfo, setUserInfo] = useState<UserLoginResponse>();
  const history = useHistory();

  useEffect(() => {
    setUserInfo(
      JSON.parse(localStorage.getItem(LocalStorage.MOCK_USER_INFO) || "")
    );
  }, []);
  const Onlogout = () => {
    // @ts-ignore
    UserLogout({ uid: userInfo?.uid }).then((res) => {
      history.push({ pathname: "/login" });
    });
  };
  // console.log(userInfo, "userInfo");

  return (
    <div className={styles.mainBigBox}>
      <div className={styles.logout}>
        <span>{userInfo?.username}</span>
        <LogoutOutlined
          title="退出登录"
          className={styles.logoutIcon}
          onClick={Onlogout}
        />
      </div>
      <Tabs defaultActiveKey="mock" destroyInactiveTabPane>
        <TabPane tab="mock数据" key="mock">
          <Interface />
        </TabPane>
        <TabPane tab="用户管理" key="user">
          <User />
        </TabPane>
        <TabPane tab="账户管理" key="account">
          <Account />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default Main;
