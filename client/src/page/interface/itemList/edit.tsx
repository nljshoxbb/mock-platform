import {
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  Tooltip,
  TreeSelect,
  message,
} from "antd";
import { ProjectCreate, ProjectEdit } from "@/services";
import React, { useEffect, useState } from "react";

import Modal from "@/components/Modal";
import type { ModalProps } from "antd";

interface EditProps extends ModalProps {
  onSuccess?: (id?: number) => void;
  selNode?: any;
  type: string;
}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const Eidt: React.FC<EditProps> = ({
  onSuccess,
  type,
  selNode,
  ...modalProps
}) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    if (modalProps.visible) {
      form.resetFields();
    }
  }, [modalProps.visible]);
  const onSubmit = () => {
    if (type === "add") {
      form.validateFields().then(async (values) => {
        console.log(values, "values");
        message.success("新增成功");
        ProjectCreate({ ...values }).then((res) => {
          onSuccess && onSuccess();
          //@ts-ignore
          modalProps.onCancel && modalProps.onCancel();
        });
      });
    } else {
      form.validateFields().then(async (values) => {
        ProjectEdit({ id: selNode.project_id, ...values }).then((res) => {
          if (!res.hasError) {
            message.success("修改成功");
            console.log(modalProps.visible, "modalProps.visible");

            onSuccess && onSuccess();
            //@ts-ignore
            modalProps.onCancel && modalProps.onCancel();
          }
        });
      });
    }
  };
  const SwitchOnChange = (checked: boolean) => {
    setDisabled(checked);
  };
  return (
    <>
      <Modal
        {...modalProps}
        onOk={() => {
          onSubmit();
        }}
      >
        <Form
          {...layout}
          form={form}
          initialValues={{
            type: "yaml",
          }}
        >
          <Form.Item name="name" label="项目名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          {type === "add" ? (
            <Form.Item
              name="api_address"
              label="同步地址"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          ) : null}

          <Form.Item name="type" label="文档类型" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="yaml">yaml</Radio>
              <Radio value="json">json</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="是否自动同步">
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              // defaultChecked
              onChange={(e) => {
                SwitchOnChange(e);
              }}
            />
            <Form.Item name="input-number" noStyle>
              <InputNumber disabled={!disabled} />
            </Form.Item>
            <span className="ant-form-text">分</span>
          </Form.Item>
          <Form.Item name="desc" label="备注">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Eidt;
