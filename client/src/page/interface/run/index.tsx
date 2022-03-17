import * as monaco from "monaco-editor";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row, Select, Space, Checkbox, Tooltip, Spin } from "antd";
import React, { useEffect, useState } from "react";
// import {InterfaceOperation}  from '@/servives/'
import { InterfaceOperation, InterfaceDetailResponse, InterfaceOperationResponse } from "@/services";

import Monaco from "react-monaco-editor";
import { color } from '@/hooks/useMonacoColor'
// import { typeAll } from "@/page/interface/run/useType";
import styles from "./index.less";
interface RunProps {
  node: any;
  infoData?: InterfaceDetailResponse
}
const { Option } = Select;
const Run: React.FC<RunProps> = ({ node, infoData }) => {
  const [runLoading, setRunLoading] = useState<boolean>(false)
  const [runData, setRunData] = useState<InterfaceOperationResponse>()

  const runOnFinish = (val: any) => {
    console.log(val, 55);
    setRunLoading(true)
    InterfaceOperation({ ...val }).then((res) => {
      if (!res.hasError) {
        setRunData(res.data)
        setRunLoading(false)
      }

    }).catch((err) => {
      console.log(err);
      setRunLoading(false)
    })
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
  // console.log(window.location.host, 'typeAll');

  return (
    <div>
      {/* <Form onFinish={responesRunOnFinish} autoComplete="off">
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
      </Form> */}

      <Form
        onFinish={runOnFinish}
        style={{ width: "100%", marginTop: 30 }}
        initialValues={{
          method: node?.method,
          api: infoData?.mock_url

        }}
      >
        <Row justify="start" style={{ display: "flex" }}>
          <Col span={2}>
            <Form.Item name="method">
              <Select disabled>
                <Option value="post">post</Option>
                <Option value="get">get</Option>
                <Option value="head">head</Option>
                <Option value="put">put</Option>

              </Select>
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item name="api" >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={2} style={{ marginLeft: 20 }}>
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
        <Spin spinning={runLoading}>
          <Row>
            {/* <Col span={8}>
              <Monaco
                language="json"
                height={540}
              
              />
            </Col> */}
            <Col span={24}>
              <Monaco
                // {...monacoEditorProps}
                language="json"
                height={540}
                // onChange={onChange}
                // editorDidMount={editorDidMount}
                // className={styles.monacoStyle}
                // theme="vs-dark"

                // minimap={enabled: false}
                defaultValue={runData && JSON.parse(runData.mock_response)}
              />
            </Col>
          </Row>
        </Spin>
      </div>
    </div>
  );
};
export default Run;
