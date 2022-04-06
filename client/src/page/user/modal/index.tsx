import Modal from '@/components/Modal';
import { UserCreate, UserEdit } from '@/services';
import { UserItemTypes, UserResetPwd } from '@/services';
import { Button, Form, Input, Radio, message } from 'antd';
import type { ModalProps } from 'antd';
import React, { useEffect, useState } from 'react';

import styles from './index.less';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};
interface EditProps extends ModalProps {
  onSuccess?: () => void;
  currentItem?: UserItemTypes;
  type: string;
}
const Edit: React.FC<EditProps> = ({ onSuccess, type, currentItem, ...modalProps }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const onSubmit = () => {
    form.validateFields().then(async (values) => {
      if (type === 'add') {
        setLoading(true);
        UserCreate({ ...values })
          .then((res) => {
            if (!res.hasError) {
              message.success('新增成功');
              onSuccess && onSuccess();
              //@ts-ignore
              modalProps.onCancel && modalProps.onCancel();
            }
            console.log(res, 'de');
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        UserEdit({ id: currentItem?.id, ...values })
          .then((res) => {
            message.success('编辑成功');
            onSuccess && onSuccess();
            //@ts-ignore
            modalProps.onCancel && modalProps.onCancel();
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  useEffect(() => {
    if (modalProps.visible && type === 'add') {
      form.resetFields();
    }
    if (type === 'info') {
      const values: any = {
        ...currentItem
      };

      form.setFieldsValue(values);
    }
  }, [currentItem, modalProps.visible]);

  const onResetPwd = () => {
    UserResetPwd({ uid: currentItem?.id as string }).then((res) => {
      if (!res.hasError) {
        message.success('重置成功');
      }
    });
  };

  const disabledOperation = currentItem?.role === '0';

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
        <Form
          {...layout}
          form={form}
          initialValues={{
            role: '1'
          }}
        >
          <Form.Item
            name="username"
            label="用户名称"
            rules={[
              {
                required: true,
                message: '请输入用户名称'
              },
              {
                required: true
              }
            ]}
            extra="提示:新创建的用户密码默认为123456"
          >
            <Input maxLength={8} disabled={disabledOperation} />
          </Form.Item>
          {type === 'info' ? (
            <Form.Item name="role" label="重置密码" extra="说明:默认为123456">
              <Button type="primary" className="mt10 mb10" onClick={onResetPwd} disabled={disabledOperation}>
                重置密码
              </Button>
            </Form.Item>
          ) : null}

          <Form.Item name="role" label="选择权限" rules={[{ required: true }]}>
            <Radio.Group disabled>
              <Radio value="0">超级管理员</Radio>
              <Radio value="1">普通管理员</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="mark" label="备注">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Edit;
