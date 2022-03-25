// import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import Modal from '@/components/Modal';
import { color } from '@/hooks/useMonacoColor';
import { ExpectedCreate, ExpectedEdit, InterfaceExpectedItemItemTypes } from '@/services';
import { Col, Form, Input, InputNumber, Row, Tabs, message } from 'antd';
import type { ModalProps } from 'antd';
import * as monaco from 'monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useEffect, useState } from 'react';
import Monaco from 'react-monaco-editor';

import styles from './index.less';

interface EditProps extends ModalProps {
  onSuccess?: () => void;
  node: any;
  type: string;
  currentItem?: InterfaceExpectedItemItemTypes;
}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};
const { TabPane } = Tabs;
const AddHopeModal: React.FC<EditProps> = ({ onSuccess, node, type, currentItem, ...modalProps }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (modalProps.visible) {
      form.resetFields();
      if (type === 'info') {
        form.setFieldsValue({ ...currentItem });
      }
    }
  }, [modalProps.visible]);
  const onSubmit = () => {
    form.validateFields().then(async (values) => {
      console.log(values, 'values');

      if (type === 'add') {
        ExpectedCreate({ interface_id: node.id, ...values }).then((res) => {
          if (!res.hasError) {
            message.success('添加成功');
            onSuccess && onSuccess();
            //@ts-ignore
            modalProps.onCancel && modalProps.onCancel();
          }
        });
      } else {
        ExpectedEdit({ id: currentItem?.id, ...values }).then((res) => {
          if (!res.hasError) {
            message.success('编辑');
            onSuccess && onSuccess();
            //@ts-ignore
            modalProps.onCancel && modalProps.onCancel();
          }
        });
      }
    });
  };
  const onChange = (value: any, e: any) => {
    form.setFieldsValue({ response_body: value });
  };
  monaco.editor.defineTheme('vs-moonlight', {
    base: 'vs-dark',
    inherit: false,
    rules: [],
    colors: color
  });
  monaco.editor.setTheme('vs-moonlight');

  return (
    <div>
      <Modal
        {...modalProps}
        onOk={() => {
          onSubmit();
        }}
      >
        <Form {...layout} form={form}>
          <Form.Item name="name" label="期望名称" rules={[{ required: true }]}>
            <Input></Input>
          </Form.Item>

          <Form.Item label="延时" rules={[{ required: true }]}>
            <Form.Item name="delay" noStyle rules={[{ required: true }]}>
              <InputNumber />
            </Form.Item>
            <span className="ant-form-text">ms</span>
          </Form.Item>
          <Form.Item name="response_body" label="Body" rules={[{ required: true }]}>
            <div ref="container" className="monaco-editor">
              <Monaco language="json" height={350} onChange={onChange} value={type === 'add' ? '' : currentItem?.response_body} />
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default AddHopeModal;
