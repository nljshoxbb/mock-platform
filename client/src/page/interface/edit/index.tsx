import { Button, Col, Form, Input, Row, Table } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';

interface InterfaceEditI {
  schema: any;
}

const InterfaceEdit: React.FC<InterfaceEditI> = ({ schema }) => {
  const [innerSchema, setInnerSchema] = useState<any>();
  const [content, setContent] = useState<any>();
  const [form] = Form.useForm();

  useEffect(() => {
    const cloneSchema = cloneDeep(schema);
    if (cloneSchema) {
      setInnerSchema(cloneSchema);
    }

    const data = getFields(schema);

    setContent(data);
  }, [schema]);

  const getFields = (schema: any, result: any[] = [], level = 0) => {
    if (schema) {
      if (schema.type === 'object') {
        Object.keys(schema.properties).map((i: any) => {
          const item = schema.properties[i];

          const renderItem = (name: string, record: any = {}, ml = 0) => {
            return (
              <Row key={name} style={{ marginBottom: 10 }}>
                <Col span={6}>
                  <span style={{ marginRight: 10, marginLeft: ml * 20 }}>{name}</span>
                </Col>
                <Col span={3}>{record.type}</Col>
                <Col span={6} style={{ paddingRight: 16 }}>
                  <Form.Item noStyle>
                    <Input placeholder={'mock数据'} />
                  </Form.Item>
                </Col>
                <Col span={6}>{record.description}</Col>
              </Row>
            );
          };

          if (item.type === 'object') {
            const arr: any[] = [];
            const data = getFields(item, arr, level + 1);
            result.push(
              <>
                {renderItem(i, item)}
                <div>{data}</div>
              </>
            );
          } else if (item.type === 'array') {
            const arr: any[] = [];
            const data = getFields(item.items, arr, level + 2);
            result.push(
              <>
                {renderItem(i, item, level)}
                {renderItem('items', item.items, level + 1)}
                <div>{data}</div>
              </>
            );
          } else {
            result.push(renderItem(i, item, level));
          }
        });
      }
    }
    return result;
  };

  const onSubmit = () => {};

  return (
    <div>
      <Form form={form}>{content}</Form>
      <Button onClick={onSubmit}>提交</Button>
    </div>
  );
};

export default InterfaceEdit;
