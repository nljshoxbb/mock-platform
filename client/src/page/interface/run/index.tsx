import * as monaco from "monaco-editor";

import { Button, Col, Form, Input, InputNumber, Row, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";

import Monaco from "react-monaco-editor";
import { color } from "@/hooks/useMonacoColor";
import styles from "./index.less";

const { Option } = Select;
const Run = () => {
  const onFinish = (val: any) => {
    console.log(val, 55);
  };
  monaco.editor.defineTheme("vs-moonlight", {
    base: "vs-dark",
    inherit: false,
    rules: [],
    colors: color,
  });
  monaco.editor.setTheme("vs-moonlight");
  return (
    <div>
      <Form
        onFinish={onFinish}
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
