import { Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';

import { LocalStorage } from "@/utils/LocalStorage";

import Modal from '@/components/Modal';
import type { ModalProps } from 'antd';
import { UserChangepwd } from '@/services';
import { formatPassword } from '@/utils/utils';
// import { history } from 'umi';
import styles from './index.less';
import { useHistory } from "react-router";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
interface EditProps extends ModalProps {
  onSuccess?: () => void;
  type: string;
}
const Edit: React.FC<EditProps> = ({ onSuccess, type, ...modalProps }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const history = useHistory();

  const onSubmit = () => {

    form.validateFields().then(async (values) => {
      const params = {
        new_pwd:values.role_name,
        uid: JSON.parse(localStorage.getItem(LocalStorage.MOCK_USER_INFO) || '{}').uid,
      };
      setLoading(true);
      try {
        UserChangepwd(params).then((res: { hasError: any; }) => {
          if (!res.hasError) {
            message.success('修改成功');
            onSuccess && onSuccess();
            setTimeout(() => {
              history.push({ pathname: "/login" });

            }, 300);
            //@ts-ignore
            modalProps.onCancel && modalProps.onCancel();
          }
          setLoading(false);
        });
      } catch (error) {
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    form.resetFields();
  }, []);

  return (
    <>
      <Modal
        {...modalProps}
        className={styles.eidit}
        onOk={() => {
          onSubmit();
        }}
        confirmLoading={loading}
      >
        <Form {...layout} form={form}>
          <Form.Item
            name="role_name"
            label="设置新密码"
            rules={[{ required: true }]}
            // rules={[
            //   ({ getFieldValue }) => ({
            //     required: true,
            //     validator(rule, value) {
            //       if (!value || getFieldValue('permission_list') === value) {
            //         return Promise.resolve();
            //       }
            //       return Promise.reject('两次密码输入不一致');
            //     },
            //   }),
            // ]}
          >
            <Input.Password placeholder="请输入新密码" maxLength={10} showCount />
          </Form.Item>
          <Form.Item
            label="重复新密码"
            name="permission_list"
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                required: true,
                validator(rule, value) {
                  if (!value || getFieldValue('role_name') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('两次密码输入不一致');
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" maxLength={10} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Edit;
