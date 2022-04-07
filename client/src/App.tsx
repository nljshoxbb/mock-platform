import 'antd/dist/antd.min.css';
import '@/assets/css/global.css';
import '@/assets/css/styles.css';

import { color } from '@/hooks/useMonacoColor';
import Login from '@/page/login';
import Main from '@/page/main';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import * as monaco from 'monaco-editor';
import { Redirect, Route, HashRouter as Router, Switch } from 'react-router-dom';

moment.locale('zh-cn');

monaco.editor.defineTheme('vs-moonlight', {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: color
});
monaco.editor.setTheme('vs-moonlight');

function App() {
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
