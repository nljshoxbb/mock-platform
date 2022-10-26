import Modal from '@/components/Modal';
import { ProjectCreate, ProjectEdit } from '@/services';
import { Form, Input, InputNumber, Radio, Switch, message } from 'antd';
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
  const [proxyDisabled, setProxyDisabled] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [disabledSwitch, setDisabledSwitch] = useState(false);

  useEffect(() => {
    if (modalProps.visible) {
      if (type === 'info') {
        form.setFieldsValue({
          name: selNode.project_name,
          auto_sync: selNode.auto_sync,
          auto_sync_time: selNode.auto_sync_time / 60,
          desc: selNode.desc,
          auto_proxy_url: selNode.auto_proxy_url,
          auto_proxy: selNode.auto_proxy,
          api_address: selNode.api_address
        });
        setDisabledSwitch(true);
        setDisabled(false);
      }
      /** 无法修改接口同步，回覆盖mock设置 */
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
        // okButtonProps={{c}}
        confirmLoading={submitLoading}
      >
        <Form
          {...layout}
          form={form}
          initialValues={{
            type: 'yaml'
          }}
        >
          <Form.Item name="name" label="项目名称" rules={[{ required: true }]}>
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item name="api_address" label="同步地址" rules={[{ type: 'url', required: true }]}>
            <Input disabled={type === 'info'} placeholder="请输入同步地址" />
          </Form.Item>

          <Form.Item name="type" label="文档类型" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="yaml">yaml</Radio>
              <Radio value="json">json</Radio>
            </Radio.Group>
          </Form.Item>

          {/* <Form.Item label="是否自动同步">
            <Form.Item noStyle valuePropName="checked" name="auto_sync">
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                className="mr10"
                onChange={(e) => {
                  setDisabled(e);
                }}
                disabled={disabledSwitch}
              />
            </Form.Item>
            <Form.Item name="auto_sync_time" noStyle>
              <InputNumber disabled={!disabled} />
            </Form.Item>
            <span className="ant-form-text ">分钟同步一次</span>
          </Form.Item> */}

          <Form.Item label="优先使用代理">
            <Form.Item noStyle valuePropName="checked" name="auto_proxy">
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                className="mr10"
                onChange={(e) => {
                  setProxyDisabled(e);
                }}
              />
            </Form.Item>
            <Form.Item name="auto_proxy_url" label="代理地址" noStyle rules={[{ type: 'url', required: proxyDisabled }]}>
              <Input disabled={!proxyDisabled} style={{ width: 248 }} placeholder="请输入代理地址" />
            </Form.Item>
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {() => {
              if (form.getFieldValue('auto_proxy')) {
                return (
                  <Form.Item label="开启全部接口" name="proxy_all" valuePropName="checked">
                    <Switch
                      className="mr10"
                      onChange={(e) => {
                        setProxyDisabled(e);
                      }}
                    />
                  </Form.Item>
                );
              }
            }}
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
