import { Checkbox, Col, Form, Input, Radio, Row, message,Button } from "antd";
import React, { useEffect, useState } from "react";

import { CheckboxChangeEvent } from "antd/lib/checkbox";
// import { LocalStorage } from '@/constants/LocalStorage';
import Modal from "@/components/Modal";
import type { ModalProps } from "antd";
import { UserCreate,UserEdit } from "@/services";
import { UserItemTypes,UserResetPwd } from "@/services";
import styles from "./index.less";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
interface EditProps extends ModalProps {
  onSuccess?: () => void;
  currentItem?: UserItemTypes;
  type: string;
}
const Edit: React.FC<EditProps> = ({
  onSuccess,
  type,
  currentItem,
  ...modalProps
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [checkAll, setCheckAll] = React.useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  // const superadmin = JSON.parse(localStorage.getItem(LocalStorage.USER_INFO) || '{}')?.role_info
  // ?.role_name;
  const onSubmit = () => {
    form.validateFields().then(async (values) => {
      if (type === "add") {
        setLoading(true);
        UserCreate({ ...values }).then((res) => {
          if (!res.hasError) {
            message.success("新增成功");
            onSuccess && onSuccess();
               //@ts-ignore
            modalProps.onCancel && modalProps.onCancel();
          }
          console.log(res, "de");
        });
        try {
        } catch (error) {
          setLoading(false);
        }
      } else {
        try {
          UserEdit({id:currentItem?.id,...values}).then((res)=>{
            message.success("编辑成功");
            onSuccess && onSuccess();
               //@ts-ignore
            modalProps.onCancel && modalProps.onCancel();
          })
        } catch (error) {
          setLoading(false);
        }
      }
    });
  };
  
  useEffect(() => {
    if (modalProps.visible && type === "add") {
      form.resetFields();
    }
    if (type === "info") {
      const values: any = {
        ...currentItem,
      };

      form.setFieldsValue(values);
    }
  }, [currentItem, modalProps.visible]);
const onResetPwd=()=>{
  UserResetPwd({uid:currentItem?.id as string}).then((res)=>{
    if(!res.hasError) {
      message.success('重置成功');

    }
  })
}
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
            role: "1",
          }}
        >
          <Form.Item
            name="username"
            label="用户名称"
            rules={[
              {
                required: true,
                message: "请输入用户名称",
              },
              {
                required: true,
                // validator: (rule, value) => {
                //   if (
                //     value &&
                //     !/^[A-Za-z\d_\-\u4e00-\u9fa5]{1,8}$/.test(value)
                //   ) {
                //     return Promise.reject("格式错误");
                //   }
                //   return Promise.resolve();
                // },
              },
            ]}
            extra="提示:新创建的用户密码默认为123456"
          >
            <Input maxLength={8} />
          </Form.Item>
    {
      type==='info'?
      <Form.Item name="role" label="重置密码"
      extra="说明:默认为123456"
      >
        <Button type="primary" className="mt10 mb10" onClick={onResetPwd}>
                重置密码
              </Button>
    </Form.Item>
      :null
    }

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
