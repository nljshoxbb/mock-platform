import * as monaco from "monaco-editor";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row, Select, Spin, Space, Checkbox, Tooltip } from "antd";
import React, { useEffect, useState } from "react";

import Monaco from "react-monaco-editor";
import { color } from '@/hooks/useMonacoColor'
import { typeAll } from "@/page/interface/run/useType";
import styles from "./index.less";

const { Option } = Select;
const Run = () => {
  const runOnFinish = (val: any) => {
    console.log(val, 55);
  };
  const responesRunOnFinish = (val: any) => {
    console.log(val, 55);

  }
  monaco.editor.defineTheme("vs-moonlight", {
    base: "vs-dark",
    inherit: false,
    rules: [],
    colors: color,
  });
  monaco.editor.setTheme("vs-moonlight");
  console.log(typeAll, 'typeAll');

  return (
    <div>
      <Form onFinish={responesRunOnFinish} autoComplete="off">
        <Form.List name="users">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'first']}
                    rules={[{ required: true, message: '请填写参数名' }]}
                  >
                    <Input defaultValue="field_1" />
                  </Form.Item>
                  <Tooltip title={<pre>是否必须</pre>}>

                    <Form.Item
                      {...restField}
                      valuePropName="checked"
                      name={[name, 'is']}
                    >
                      <Checkbox />
                    </Form.Item>
                  </Tooltip>
                  <Form.Item
                    {...restField}
                    valuePropName="checked"
                    name={[name, 'type']}
                  >
                    <Select style={{ width: 130 }}>
                      {
                        typeAll.map((item, i) => {
                          return <Option value={item.value}>{item.name}</Option>

                        })
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'last']}
                    rules={[{ required: true, message: 'Missing last name' }]}
                  >
                    <Input placeholder="备注" />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  增加
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>

      <Form
        onFinish={runOnFinish}
        style={{ width: "100%", marginTop: 30 }}
        initialValues={{
          Select: "POST",
        }}
      >
        <Row justify="start" style={{ display: "flex" }}>
          <Col span={2}>
            <Form.Item name="Select">
              <Select>
                <Option value="POST">POST</Option>
                <Option value="GET">GET</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="Input">
              <Input />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                发送
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div>
        <div className={styles.response}>Response</div>
        <Row>
          <Col span={8}>
            <Monaco
              // {...monacoEditorProps}
              language="json"
              height={540}
            // onChange={onChange}
            // editorDidMount={editorDidMount}
            // className={styles.monacoStyle}
            // theme="vs-dark"

            // minimap={enabled: false}
            // defaultValue="6666"
            />
          </Col>
          <Col span={16}>
            <Monaco
              // {...monacoEditorProps}
              language="json"
              height={540}
            // onChange={onChange}
            // editorDidMount={editorDidMount}
            // className={styles.monacoStyle}
            // theme="vs-dark"

            // minimap={enabled: false}
            // defaultValue="6666"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default Run;
