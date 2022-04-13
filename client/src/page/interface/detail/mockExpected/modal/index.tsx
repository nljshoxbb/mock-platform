import Modal from '@/components/Modal';
import { ExpectedCreate, ExpectedEdit, InterfaceExpectedItemItemTypes } from '@/services';
import { Form, Input, InputNumber, message } from 'antd';
import type { ModalProps } from 'antd';
import React, { useEffect } from 'react';
import Monaco from 'react-monaco-editor';

interface EditProps extends ModalProps {
  onSuccess?: () => void;
  node: any;
  type: string;
  currentItem?: InterfaceExpectedItemItemTypes;
}
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
};
const AddHopeModal: React.FC<EditProps> = ({ onSuccess, node, type, currentItem, ...modalProps }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (modalProps.visible) {
      form.resetFields();
      if (type === 'info') {
        form.setFieldsValue({ ...currentItem });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <Input style={{ width: 200 }}></Input>
          </Form.Item>

          <Form.Item label="延时">
            <Form.Item name="delay" noStyle>
              <InputNumber style={{ width: 200 }} addonAfter="ms" />
            </Form.Item>
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
