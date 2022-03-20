import * as monaco from "monaco-editor";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row, Select, Space, Checkbox, Tooltip, Spin } from "antd";
import React, { useEffect, useState } from "react";
// import {InterfaceOperation}  from '@/servives/'
import { InterfaceOperation, InterfaceDetailResponse, InterfaceOperationResponse } from "@/services";
import 'monaco-editor/esm/vs/basic-languages/html/html.contribution';

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
  const [runData, setRunData] = useState<any>()

  const runOnFinish = (val: any) => {
    setRunLoading(true)
    InterfaceOperation({ ...val }).then((res) => {
      if (!res.hasError) {
        setRunData(res)
        setRunLoading(false)
      }

    }).catch((err) => {
      console.log(err);
      setRunLoading(false)
    })
  };

  monaco.editor.defineTheme("vs-moonlight", {
    base: "vs",
    inherit: true,
    rules: [
    ],
    colors: color,
  });
  monaco.editor.setTheme("vs-moonlight");
  // console.log(window.location.host, 'typeAll');
  // console.log(runData, 'JSON.stringify(runData?.mock_response)');

  const editorDidMountHandle = (editor: any, monaco: any) => {

    editor.trigger('anyString', 'editor.action.formatDocument')

    // editor.setValue('{"status":200,"mock_response":{"task_id":"tvpskkocljqnimirjgdu"}}')
    // editor.trigger('anyString', 'editor.action.formatDocument');//自动格式化代码
    // editor.setValue(editor.getValue());//再次设置



    // editor.getAction('editor.action.formatDocument').run();//自动格式化代码
    // editor.setValue(editor.getValue());//再次设置
    // editor.setValue('{"status":200,"mock_response":{"task_id":"tvpskkocljqnimirjgdu"}}');//再次设置

    // editor.setValue(editor.getValue())
    // if (runData) {
    //   editor.setValue(JSON.stringify(runData));
    //   console.log(
    //     editor.setValue(JSON.stringify(runData)), 999
    //   );

    //   editor.getAction('anyString', 'editor.action.formatDocument').run()  //格式化
    //   editor.setValue(editor.getValue());
    //   // console.log(editor.getAction('editor.action.formatDocument').run(), '00');
    // }



  }

  function checkJsonCode(strJsonCode: string) {
    let res = '';
    try {
      for (let i = 0, j = 0, k = 0, ii, ele; i < strJsonCode.length; i++) {
        ele = strJsonCode.charAt(i);
        if (j % 2 === 0 && ele === '}') {
          // eslint-disable-next-line no-plusplus
          k--;
          for (ii = 0; ii < k; ii++) ele = `${ele}`;
          ele = `\t${ele}`;
        } else if (j % 2 === 0 && ele === '{') {
          ele += '\t';
          // eslint-disable-next-line no-plusplus
          k++;
          for (ii = 0; ii < k; ii++) ele += '';
        } else if (j % 2 === 0 && ele === ',') {
          ele += '\n';
          for (ii = 0; ii < k; ii++) ele += '    ';
          // eslint-disable-next-line no-plusplus
        } else if (ele === '"') j++;
        res += ele;
      }
    } catch (error) {
      res = strJsonCode;
    }
    return res;

  }
  return (
    <div>

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
                // theme="vs-light"
                // options={{ selectOnLineNumbers: true, automaticLayout: true, wordWrap: 'wordWrapColumn', wrappingStrategy: 'simple', wordWrapBreakBeforeCharacters: ',', wordWrapBreakAfterCharacters: ',', disableLayerHinting: true }}
                editorDidMount={editorDidMountHandle}

                // minimap={enabled: false}
                // defaultValue={JSON.stringify(runData)}
                // defaultValue='{"status":200,"mock_response":{"task_id":"tvpskkocljqnimirjgdu"}}'
                value={JSON.stringify(runData)}
              // readOnly={false}
              />
            </Col>
          </Row>
        </Spin>
      </div>
    </div>
  );
};
export default Run;
