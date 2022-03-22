import Modal from '@/components/Modal';
import useModal from '@/hooks/useModal';
import { InterfaceEdit } from '@/services';
import { formatJSONObject, guid } from '@/utils/utils';
import { EditOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Form, Input, Row, message } from 'antd';
import { cloneDeep, fromPairs } from 'lodash';
import * as monaco from 'monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useEffect, useRef, useState } from 'react';
import Monaco, { MonacoEditorProps } from 'react-monaco-editor';

interface InterfaceEditI {
  response: any;
  id: string;
}

const { Panel } = Collapse;

const FlodField: React.FC<any> = ({ children }) => {
  return <div>{children}</div>;
};

const InterfaceEditComponent: React.FC<InterfaceEditI> = ({ response, id = '' }) => {
  const innerSchema = useRef<any>();
  const [content, setContent] = useState<any>();
  const schemaModal = useModal();
  const [form] = Form.useForm();
  const [mockForm] = Form.useForm();
  /** 当前选中字段 schema */
  const [editSchema, setEditSchema] = useState<any>({});
  const [currentFieldPath, setCurrentFieldPath] = useState<string>('');
  const monacoRef = useRef<any>(null);
  const fieldMockModal = useModal();

  useEffect(() => {
    const { schema } = response?.content['application/json'];
    if (schema) {
      const cloneSchema = cloneDeep(schema);
      if (cloneSchema) {
        innerSchema.current = cloneSchema;
      }

      const data = getFields(schema, '');
      console.log(cloneSchema);
      setContent(data);
    }
  }, [response]);

  const getFields = (schema: any, namePath = '', result: any[] = []) => {
    if (schema) {
      if (schema.type === 'object') {
        Object.keys(schema.properties).map((i: any) => {
          const item = schema.properties[i];

          const renderItem = (name: string, record: any = {}, fieldPath = '', showControl = false) => {
            const ml = fieldPath.split('.').length;
            return (
              <Row key={guid()} style={{ marginBottom: 10 }}>
                <Col span={4}>
                  <span style={{ marginRight: 10, marginLeft: ml * 20 }}>{name}</span>
                </Col>
                <Col span={3}>{record.type}</Col>
                <Col span={3}>{record.description}</Col>
                <Col span={6} style={{ paddingRight: 16 }}>
                  {showControl && (
                    <Form.Item noStyle name={fieldPath}>
                      <Input
                        placeholder={'mock数据'}
                        onChange={(e) => {
                          handleFieldChange(e.target.value, fieldPath);
                        }}
                        addonAfter={
                          <EditOutlined
                            className="cursor"
                            onClick={() => {
                              fieldMockModal.setVisible(true);
                              mockForm.setFieldsValue({ mock: form.getFieldValue(fieldPath) });
                              setCurrentFieldPath(fieldPath);
                            }}
                          />
                        }
                      />
                    </Form.Item>
                  )}
                </Col>
                <Col span={3}>
                  <SettingOutlined
                    className="cursor"
                    onClick={() => {
                      // 找出schema
                      const obj = findSchemaByPath(innerSchema.current, fieldPath);
                      setEditSchema(obj);
                      setCurrentFieldPath(fieldPath);
                      schemaModal.setVisible(true);
                    }}
                  />
                </Col>
              </Row>
            );
          };
          const path = namePath ? `${namePath}.${i}` : i;

          if (item.type === 'object') {
            const arr: any[] = [];
            const data = getFields(item, `${path}`, arr);
            result.push(
              <>
                {renderItem(i, item, `${path}`)}
                <FlodField>{data}</FlodField>
              </>
            );
          } else if (item.type === 'array') {
            const arr: any[] = [];
            const data = getFields(item.items, `${path}.items`, arr);
            const itemsPath = namePath ? `${namePath}.${i}.items` : `items.${i}`;
            result.push(
              <>
                {renderItem(i, item, `${path}`)}
                {renderItem('items', item.items, `${itemsPath}`)}
                <FlodField>{data}</FlodField>
              </>
            );
          } else {
            result.push(renderItem(i, item, `${path}`, true));
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

  return (
    <div>
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
            <Input.TextArea />
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
      <Form form={form}>{content}</Form>
      <Button onClick={onSubmit}>提交</Button>
    </div>
  );
};

export default InterfaceEditComponent;
