import Modal from '@/components/Modal';
import { ProjectCreate, ProjectEdit } from '@/services';
import { Col, Form, Input, InputNumber, Radio, Select, Switch, Tooltip, TreeSelect, message } from 'antd';
import type { ModalProps } from 'antd';
import React, { useEffect, useState } from 'react';

interface EditProps extends ModalProps {
  onSuccess?: (id?: number) => void;
  selNode?: any;
  type: string;
}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};
const Eidt: React.FC<EditProps> = ({ onSuccess, type, selNode, ...modalProps }) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (modalProps.visible) {
      if (type === 'info') {
        form.setFieldsValue({
          name: selNode.project_name,
          auto_sync: selNode.auto_sync,
          auto_sync_time: selNode.auto_sync_time / 60,
          desc: selNode.desc
        });
      }
    } else {
      form.resetFields();
    }
  }, [modalProps.visible, type]);

  const onSubmit = () => {
    let autoTime: number;
    setSubmitLoading(true);
    if (type === 'add') {
      form
        .validateFields()
        .then(async (values) => {
          autoTime = values.auto_sync_time * 60;
          ProjectCreate({ ...values, auto_sync: disabled, auto_sync_time: autoTime }).then((res) => {
            if (!res.hasError) {
              message.success('新增成功');
              onSuccess && onSuccess();
            }
            //@ts-ignore
            modalProps.onCancel && modalProps.onCancel();
          });
        })
        .finally(() => {
          setSubmitLoading(true);
        });
    } else {
      form.validateFields().then(async (values) => {
        autoTime = values.auto_sync_time * 60;
        ProjectEdit({ ...values, id: selNode.project_id, auto_sync: disabled, auto_sync_time: autoTime })
          .then((res) => {
            if (!res.hasError) {
              message.success('修改成功');
              onSuccess && onSuccess();
              //@ts-ignore
              modalProps.onCancel && modalProps.onCancel();
            }
          })
          .finally(() => {
            setSubmitLoading(true);
          });
      });
    }
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
            type: 'yaml'
          }}
        >
          <Form.Item name="name" label="项目名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          {type === 'add' ? (
            <Form.Item name="api_address" label="同步地址" rules={[{ required: true }]}>
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
            <Form.Item noStyle valuePropName="checked" name="auto_sync">
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                className="mr10"
                onChange={(e) => {
                  setDisabled(e);
                }}
              />
            </Form.Item>

            <Form.Item name="auto_sync_time" noStyle>
              <InputNumber disabled={!disabled} />
            </Form.Item>
            <span className="ant-form-text ">分钟同步一次</span>
          </Form.Item>
          <Form.Item name="desc" label="描述">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Eidt;
