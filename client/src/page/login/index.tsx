import { Button, Checkbox, Form, Input, message } from "antd";
import { LocalStorage } from "@/utils/LocalStorage";
import { UserLogin } from "@/services";
import { formatPassword } from "@/utils/utils";
import styles from "./index.less";
import { useHistory } from "react-router";


const Login = () => {
  const history = useHistory();

  const onFinish = (values: any) => {
    UserLogin({...values }).then((res) => {
      console.log(66);
      
      if (!res.hasError) {
        localStorage.setItem(LocalStorage.MOCK_TOKEN, res.data.token);
        window.localStorage.setItem(
          LocalStorage.MOCK_USER_INFO,
          JSON.stringify(res.data)
        );
        message.success("登录成功", 0.5, () => {
          history.push({ pathname: "/main" });
        });
      } else {
        message.error("账号或密码错误，请检查后重新输入");
      }
    });
  };
  return (
    <div className={styles.container}>
      <div style={{ margin: " auto" }}>
        <div className={styles.form}>
          <div className="tc">
            <div className={styles.title}>Mock数据平台</div>
          </div>

          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <div className={styles.item}>
              <div className="desalt-color">账号</div>
              <Form.Item
                label=""
                name="username"
                rules={[{ required: true, message: "请输入用户名" }]}
                noStyle
              >
                <Input bordered={false} autoComplete="off" />
              </Form.Item>
            </div>
            <div className={styles.item}>
              <div className="desalt-color">密码</div>
              <Form.Item
                label=""
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
                noStyle
              >
                <Input.Password bordered={false} autoComplete="off" />
              </Form.Item>
            </div>

            <div className={styles.checked}>
              <Form.Item noStyle name="remember" valuePropName="checked">
                <Checkbox>记住密码</Checkbox>
              </Form.Item>
            </div>
            <div>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.btn}
                // loading={loginRequest.loading}
              >
                登录
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
