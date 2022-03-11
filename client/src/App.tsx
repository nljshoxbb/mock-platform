import "antd/dist/antd.css";
import "@/assets/css/global.css";
import "@/assets/css/styles.css";

import React, { Suspense } from "react";
// import { Route, Router } from "react-router";
import {
  Redirect,
  Route,
  HashRouter as Router,
  Switch,
} from "react-router-dom";

import { ConfigProvider } from "antd";
// import { BrowserRouter } from "react-router-dom";
import Interface from "@/page/interface";
import Login from "@/page/login";
import Main from "@/page/main";
// import Router from "./router/router";
import User from "@/page/user";
import moment from "moment";
import zh_CN from "antd/es/locale/zh_CN";

moment.locale("zh-cn");

function App() {
  // return <Router />;
  return (
    <ConfigProvider locale={zh_CN} componentSize="middle">
      <Router>
        <Switch>
          <Redirect exact={true} from="/" to="/login" />

          <Route path="/login" component={Login} />
          {/* <Redirect to="/main" path="/main"> */}
          <Route path="/main" component={Main} />

          {/* <Route path="/user" component={User} />
          <Route path="/interface" component={Interface} /> */}
          {/* </Redirect> */}
        </Switch>
      </Router>
    </ConfigProvider>
  );
}

export default App;
