import Modal from '@/components/Modal';
import useModal from '@/hooks/useModal';
import { InterfaceEdit } from '@/services';
import { formatJSONObject } from '@/utils/utils';
import { EditOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Row, Table, message } from 'antd';
import { cloneDeep, isEmpty } from 'lodash';
// import * as monaco from 'monaco-editor';
// import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useEffect, useRef, useState } from 'react';
import Monaco, { MonacoEditorProps } from 'react-monaco-editor';

import { bodyColumns } from '../columns';

interface InterfaceEditI {
  response: any;
  id: string;
}

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

    let obj = {};
    const data = handleResponse(schema, '', [], obj);
    setResData(data);
    form.setFieldsValue(obj);
  }, [response]);

  const handleResponse = (schema: any, namePath = '', result: any[] = [], collection: any = {}) => {
    if (schema) {
      if (schema.type === 'object' && schema.properties) {
        Object.keys(schema.properties).map((i: any) => {
          const item = schema.properties[i];
          const path = namePath ? `${namePath}.${i}` : i;

          if (item.type === 'object') {
            result.push({
              name: i,
              key: path,
              dataIndex: path,
              type: item.type,
              children: handleResponse(item, path, [], collection),
              description: item.description
            });
          } else if (item.type === 'array') {
            const itemsPath = namePath ? `${namePath}.${i}.items` : `items.${i}`;
            return result.push({
              name: i,
              key: path,
              dataIndex: path,
              type: item.type,
              description: item.description,
              children: [
                {
                  name: 'items',
                  key: itemsPath,
                  dataIndex: itemsPath,
                  type: item.type,
                  children: handleResponse(item.items, `${path}.items`, [], collection)
                }
              ],
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
            });
          } else {
            if (item.mock) {
              collection[path] = item.mock.value;
            }

            return result.push({
              name: i,
              key: path,
              dataIndex: path,
              type: item.type,
              description: item.description,
              default: item.default,
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
                    setEditSchema(obj);
                    setCurrentFieldPath(path);
                    schemaModal.setVisible(true);
                  }}
                />
              )
            });
          }
        });
      }
    }
    return result;
  };

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
    form.setFieldsValue({ [currentFieldPath]: editSchema.mock.value });
    obj.mock = editSchema.mock;
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
    }
  }, [schemaModal.visible]);

  return (
    <div style={{ paddingTop: 20 }}>
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
        title="设置"
        width={680}
        onOk={() => {
          handleModifySchema();
        }}
      >
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
              <Form.Item name="num" label="元素数量">
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
        {!isEmpty(resData) && <Table columns={bodyColumns} dataSource={resData} pagination={false} expandable={{ defaultExpandAllRows: true }}></Table>}
      </Form>
      <Button onClick={onSubmit} type="primary" className="mt20">
        提交
      </Button>
    </div>
  );
};

export default InterfaceEditComponent;
