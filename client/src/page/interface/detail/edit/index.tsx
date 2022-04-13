import Modal from '@/components/Modal';
import useModal from '@/hooks/useModal';
import { generateBodyColumns } from '@/page/interface/columns';
import { InterfaceEdit } from '@/services';
import { transformSchemaToArray } from '@/utils/transformSchemaToArray';
import { formatJSONObject } from '@/utils/utils';
import { EditOutlined, MinusCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Input, InputNumber, Switch, Table, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { cloneDeep, isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import Monaco, { MonacoEditorProps } from 'react-monaco-editor';

interface InterfaceEditI {
  response: any;
  id: string;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 }
  }
};

const InterfaceEditComponent: React.FC<InterfaceEditI> = ({ response, id = '' }) => {
  const innerSchema = useRef<any>();
  const schemaModal = useModal();
  const [form] = Form.useForm();
  const [mockForm] = Form.useForm();
  const [arrayConfigForm] = Form.useForm();
  /** 当前选中字段 schema */
  const [editSchema, setEditSchema] = useState<any>({});
  const [currentFieldPath, setCurrentFieldPath] = useState<string>('');
  const monacoRef = useRef<any>(null);
  const fieldMockModal = useModal();
  const [editFieldForm] = useForm();

  const [resData, setResData] = useState<any[]>([]);

  useEffect(() => {
    let schema = {};

    if (response && response.content && response?.content['application/json']) {
      schema = response?.content['application/json'].schema;
    }

    const cloneSchema = cloneDeep(schema);
    if (cloneSchema) {
      innerSchema.current = cloneSchema;
    }

    // 搜集编辑的 字段:值
    let collection = {};

    const data = transformSchemaToArray(schema, '', [], collection, ({ type, path }) => {
      if (type === 'obj') {
      } else if (type === 'array') {
        return {
          setting: (
            <SettingOutlined
              className="cursor ml10"
              onClick={() => {
                // 找出schema
                const obj = findSchemaByPath(innerSchema.current, path);
                setEditSchema(obj);
                if (obj.mock) {
                  arrayConfigForm.setFieldsValue({ num: obj.mock.num });
                }
                setCurrentFieldPath(path);
                schemaModal.setVisible(true);
              }}
            />
          )
        };
      } else {
        return {
          mock: (
            <Form.Item noStyle name={path}>
              <Input
                placeholder={'mock数据'}
                onChange={(e) => {
                  handleFieldChange(e.target.value, path);
                }}
                addonAfter={
                  <EditOutlined
                    className="cursor"
                    onClick={() => {
                      fieldMockModal.setVisible(true);
                      mockForm.setFieldsValue({ mock: form.getFieldValue(path) });
                      setCurrentFieldPath(path);
                    }}
                  />
                }
                className="ml10"
              />
            </Form.Item>
          ),
          setting: (
            <SettingOutlined
              className="cursor ml10"
              onClick={() => {
                // 找出schema
                const obj = findSchemaByPath(innerSchema.current, path);
                console.log(obj, innerSchema.current, path);

                setEditSchema(obj);
                setCurrentFieldPath(path);
                schemaModal.setVisible(true);
              }}
            />
          )
        };
      }
    });

    setResData(data);
    form.setFieldsValue(collection);
  }, [response]);

  const onSubmit = () => {
    /** 保证输入输出格式正确 */
    const data = {
      ...response,
      content: {
        'application/json': {
          schema: innerSchema.current
        }
      }
    };
    InterfaceEdit({
      id,
      responses: JSON.stringify(data)
    }).then((res) => {
      if (!res.hasError) {
        message.success(res?.msg);
      }
    });
  };

  const onMoncaoChange: MonacoEditorProps['onChange'] = (value) => {
    setEditSchema(JSON.parse(value));
  };

  const handleEditorDidMount: MonacoEditorProps['editorDidMount'] = (editor, monaco) => {
    monacoRef.current = editor;
  };

  const findSchemaByPath = (schema: any = {}, path: string = ''): any => {
    if (schema.type === 'object') {
      if (schema.properties) {
        const keys = Object.keys(schema.properties);
        for (let i = 0; i < keys.length; i++) {
          const arrs = path.split('.');
          const target = arrs.shift();
          const key = keys[i];
          if (target === key) {
            const modifySchema = schema.properties[key];
            if (arrs.length === 0) {
              return modifySchema;
            }

            return findSchemaByPath(modifySchema, arrs.join('.'));
          }
        }
      }
    } else if (schema.type === 'array') {
      const arrs = path.split('.');
      if (arrs.length === 1) {
        return schema;
      } else if (arrs[0] === '' && arrs.length === 1) {
        return schema.items;
      } else {
        arrs.shift();
        return findSchemaByPath(schema.items, arrs.join('.'));
      }
    } else {
      return schema;
    }
  };

  const handleFieldChange = (value: any, path: string) => {
    const resultSchema = findSchemaByPath(innerSchema.current, path);
    resultSchema.mock = { value: value };
  };

  const handleModifySchema = () => {
    const obj = findSchemaByPath(innerSchema.current, currentFieldPath);
    obj.mock = editSchema.mock;
    if (editSchema.mock) {
      form.setFieldsValue({ [currentFieldPath]: editSchema.mock.value });
    }
    schemaModal.toggle();
  };

  const handleModifyField = () => {
    const value = mockForm.getFieldValue('mock');
    form.setFieldsValue({ [currentFieldPath]: value });
    fieldMockModal.toggle();
    handleFieldChange(value, currentFieldPath);
  };

  useEffect(() => {
    if (!schemaModal.visible) {
      arrayConfigForm.resetFields();
      editFieldForm.resetFields();
    } else {
      if (editSchema.mock && editSchema.mock.enum) {
        // 处理枚举
        editFieldForm.setFieldsValue({
          names: editSchema.mock.enum,
          switch: true
        });
      }
    }
  }, [schemaModal.visible, editSchema]);
  return (
    <div style={{ paddingTop: 20, paddingBottom: 40, position: 'relative' }}>
      <Modal
        title="mock"
        visible={fieldMockModal.visible}
        onCancel={() => {
          fieldMockModal.toggle();
        }}
        onOk={() => {
          handleModifyField();
        }}
      >
        <Form form={mockForm}>
          <Form.Item noStyle name="mock">
            <Input.TextArea rows={10} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={schemaModal.visible}
        onCancel={() => {
          schemaModal.toggle();
        }}
        title={`schema设置`}
        width={680}
        onOk={() => {
          handleModifySchema();
        }}
      >
        {editSchema.type === 'string' && (
          <Form
            {...formItemLayoutWithOutLabel}
            onValuesChange={(val, values) => {
              const obj = findSchemaByPath(innerSchema.current, currentFieldPath);

              if (values.names) {
                if (obj.mock) {
                  obj.mock.enum = values.names;
                } else {
                  obj.mock = {
                    enum: values.names
                  };
                }
              }

              if (!values.switch) {
                if (obj.mock) {
                  delete obj.mock.enum;
                }
              }

              setEditSchema(cloneDeep(obj));
            }}
            form={editFieldForm}
          >
            <Form.Item label="转为枚举类型" name="switch" valuePropName="checked" {...formItemLayout}>
              <Switch
                onChange={(val) => {
                  if (!val) {
                    editFieldForm.setFieldsValue({ names: undefined });
                  }
                }}
              ></Switch>
            </Form.Item>
            <Form.Item shouldUpdate noStyle>
              {() => {
                const checked = editFieldForm.getFieldValue('switch');
                if (checked) {
                  return (
                    <Form.List
                      name="names"
                      rules={[
                        {
                          validator: async (_, names) => {
                            if (!names || names.length < 1) {
                              return Promise.reject(new Error('至少输入一个枚举值'));
                            }
                          }
                        }
                      ]}
                    >
                      {(fields, { add, remove }, { errors }) => (
                        <>
                          {fields.map((field, index) => (
                            <Form.Item
                              {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                              label={index === 0 ? '枚举值' : ''}
                              required={false}
                              key={field.key}
                            >
                              <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true
                                  }
                                ]}
                                noStyle
                              >
                                <Input placeholder="请输入" style={{ width: '60%' }} />
                              </Form.Item>
                              {fields.length > 1 ? <MinusCircleOutlined className="ml10" onClick={() => remove(field.name)} /> : null}
                            </Form.Item>
                          ))}
                          <Form.Item>
                            <Button type="dashed" onClick={() => add()} style={{ width: '60%' }}>
                              添加
                            </Button>
                            <Form.ErrorList errors={errors} />
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  );
                }
              }}
            </Form.Item>
          </Form>
        )}

        {editSchema.type === 'array' && (
          <>
            <Form
              form={arrayConfigForm}
              layout="inline"
              onValuesChange={(value, values) => {
                const resultSchema = findSchemaByPath(innerSchema.current, currentFieldPath);
                resultSchema.mock = {
                  ...values
                };
                editSchema.mock = {
                  ...values
                };
                setEditSchema(cloneDeep(editSchema));
              }}
            >
              <Form.Item name="num" label="数组元素数量">
                <InputNumber min={1} />
              </Form.Item>
            </Form>
          </>
        )}

        <div>编辑源码</div>
        <div>
          <Monaco
            language="json"
            theme="vs-light"
            height={350}
            width={650}
            onChange={onMoncaoChange}
            value={formatJSONObject(editSchema)}
            editorDidMount={handleEditorDidMount}
          />
        </div>
      </Modal>
      <Form form={form}>
        {isEmpty(resData) ? (
          <div>
            <Empty />
          </div>
        ) : (
          <Table columns={generateBodyColumns(true)} dataSource={resData} pagination={false} expandable={{ defaultExpandAllRows: true }}></Table>
        )}
      </Form>
      <div style={{ position: 'fixed', bottom: 40, right: 0, left: 0, textAlign: 'right' }}>
        {!isEmpty(resData) && (
          <Button onClick={onSubmit} type="primary" style={{ marginRight: 100 }}>
            提交
          </Button>
        )}
      </div>
    </div>
  );
};

export default InterfaceEditComponent;
