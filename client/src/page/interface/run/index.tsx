import 'monaco-editor/esm/vs/basic-languages/html/html.contribution';

import { InterfaceDetailResponse, InterfaceOperation } from '@/services';
import { formatJSONObject } from '@/utils/utils';
import { Button, Col, Form, Input, Row, Select, Spin } from 'antd';
import React, { useState } from 'react';
import Monaco from 'react-monaco-editor';

import styles from './index.less';

interface RunProps {
  node: any;
  infoData?: InterfaceDetailResponse;
}
const { Option } = Select;
const Run: React.FC<RunProps> = ({ node, infoData }) => {
  const [runLoading, setRunLoading] = useState<boolean>(false);
  const [runData, setRunData] = useState<any>();

  const runOnFinish = (val: any) => {
    setRunLoading(true);
    InterfaceOperation({ ...val })
      .then((res) => {
        if (!res.hasError) {
          setRunData(res);
          setRunLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setRunLoading(false);
      });
  };

  const editorDidMountHandle = (editor: any, monaco: any) => {
    editor.trigger('anyString', 'editor.action.formatDocument');
  };

  return (
    <div className={styles.main}>
      <Form
        onFinish={runOnFinish}
        style={{ width: '100%', marginTop: 10 }}
        initialValues={{
          method: node?.method,
          api: infoData?.mock_url
        }}
      >
        <Row justify="start" style={{ display: 'flex' }}>
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
            <Form.Item name="api">
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
            <Col span={24}>
              <Monaco language="json" height={540} editorDidMount={editorDidMountHandle} value={formatJSONObject(runData)} />
            </Col>
          </Row>
        </Spin>
      </div>
    </div>
  );
};
export default Run;
