import Empty from '@/components/Empty';
import { InterfaceDetail, InterfaceDetailResponse } from '@/services';
import { Col, Row, Spin, Table, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';

import { bodyColumns, headersColumns } from './columns';
import InterfaceEdit from './edit';
import styles from './index.less';
import ItemList from './itemList';
import MockExpected from './mockExpected';
import Run from './run';

interface baseData {
  name: string;
  data: string;
}
const { TabPane } = Tabs;

const Main = () => {
  const [node, setNode] = useState<any>();
  const [infoData, setInfoData] = useState<InterfaceDetailResponse>();
  const [headersData, setHeadersData] = useState<any[]>([]);
  const [requestBody, setRequestBody] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);

  const [responsesSchema, setResponsesSchema] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>('1');

  useEffect(() => {
    if (!infoData) return;
    if (infoData?.request_body) {
      let requestBody = infoData && infoData?.request_body && JSON.parse(infoData.request_body);
      let { properties } = requestBody.content['application/json'].schema;
      console.log(requestBody['content'], 'requestBody');
      let headerData = [{
        name: 'content',
        params: 'application/json',
        required: '是'
      }];
      setHeadersData(headerData)
      // for (let key in requestBody) {

      // }
      setRequestBody(handleRequestBody(properties));
    }

    if (infoData.responses) {
      const resData = JSON.parse(infoData.responses);
      if (resData.content) {
        const { schema } = resData?.content['application/json'];
        setResponses(handleRequestBody(schema.properties))
        setResponsesSchema(schema);
      }

    }


  }, [infoData]);
  const handleRequestBody = (requestBody: any): any => {

    let bodyData = [];
    for (let key in requestBody) {

      if (requestBody[key].type === "array") {
        bodyData.push({ name: key, children: handleRequestBody(requestBody[key].items), ...requestBody[key] });
      } else {
        bodyData.push({ name: key, ...requestBody[key] });

      }
    }

    return bodyData
  }
  const baseData: baseData[] = [
    { name: '接口名称', data: infoData?.name || '-' },
    { name: '接口信息', data: infoData?.path || '-' },
    { name: '请求类型', data: infoData?.method || '-' },
    { name: 'Mock地址', data: infoData?.mock_url || '-' },
    { name: '备注', data: infoData?.description || '-' }
  ];
  const tabsOnChange = (key: React.SetStateAction<string>) => {
    setActiveKey(key);
  };
  return (
    <div className={styles.mainBigBox}>
      <ItemList
        getIinterface={(node) => {
          setNode(node);
          setActiveKey('1');
          if (node) {
            setLoading(true);
            InterfaceDetail({ id: node?.id })
              .then((res) => {
                if (!res.hasError) {
                  setInfoData(res?.data);
                  setLoading(false);
                }
              })
              .catch((err) => {
                console.log(err, 'err');
                setLoading(false);
              });
          } else {
            setInfoData(undefined);
          }
        }}
      />
      {/* <Info node={node} /> */}
      <div className={styles.infoBigBox}>
        <Tabs activeKey={activeKey} onChange={(key) => tabsOnChange(key)} destroyInactiveTabPane>
          <TabPane tab="接口详情" key="1" style={{ fontSize: 20 }}>
            {infoData ? (
              <Spin spinning={loading}>
                <div>
                  <h2 className={styles.title}>基本信息</h2>
                  <Row gutter={[16, 6]} style={{ paddingLeft: 25 }}>
                    {baseData.map((iitem, j: any) => {
                      return (
                        <Col span={12} key={j}>
                          <span className={styles.name}>{iitem.name}:</span>
                          <span className={styles.data}>{iitem.data}</span>
                        </Col>
                      );
                    })}
                  </Row>
                  <h2 className={styles.title}>请求参数</h2>
                  <div style={{ paddingLeft: 25 }}>
                    <div className={styles.reqData} key="headers">
                      <span className={styles.name}>Headers：</span>
                      <Table
                        columns={headersColumns}
                        key="params"

                        dataSource={headersData}
                      ></Table>
                    </div>
                    <div className={styles.reqData} key="Body">
                      <span className={styles.name}>Body:</span>
                      <Table columns={bodyColumns} dataSource={requestBody}
                        rowKey='name'
                      ></Table>
                    </div>
                  </div>
                  <h2 className={styles.title}>返回数据</h2>
                  <div style={{ paddingLeft: 25 }}>

                    <div className={styles.reqData} key="Body">
                      {/* <span className={styles.name}>Body:</span> */}
                      <Table columns={bodyColumns} dataSource={responses}
                        rowKey='name'
                      ></Table>
                    </div>
                  </div>
                </div>
              </Spin>
            ) : (
              <Empty />
            )}
          </TabPane>
          <TabPane tab="运行" key="2" disabled={node ? false : true}>
            <Run node={node} infoData={infoData} />
          </TabPane>
          <TabPane tab="编辑" key="4" disabled={node ? false : true}>
            <InterfaceEdit schema={responsesSchema} />
          </TabPane>
          <TabPane tab="mock期望 " key="3" disabled={node ? false : true}>
            <MockExpected node={node} />
          </TabPane>
        </Tabs>
      </div>
    </div >
  );
};
export default Main;
