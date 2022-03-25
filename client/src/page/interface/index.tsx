import Empty from '@/components/Empty';
import { MethodsColorEnum, MethodsColorEnumType } from '@/constant/color';
import { InterfaceDetail, InterfaceDetailResponse } from '@/services';
import { Col, Row, Spin, Table, Tabs, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

import { bodyColumns, headersColumns } from './columns';
import InterfaceEdit from './edit';
import styles from './index.less';
import ItemList from './itemList';
import MockExpected from './mockExpected';
import Run from './run';

const { TabPane } = Tabs;

const Main = () => {
  const [node, setNode] = useState<any>();
  const [infoData, setInfoData] = useState<InterfaceDetailResponse>();
  const [headersData, setHeadersData] = useState<any[]>([]);
  const [requestBody, setRequestBody] = useState<any[]>([]);

  const [responsesData, setResponsesData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>('1');

  useEffect(() => {
    if (!infoData) return;

    if (infoData?.request_body) {
      let requestBody = infoData && infoData?.request_body && JSON.parse(infoData.request_body);

      const arr = Object.keys(requestBody.content).map((i) => {
        return requestBody.content[i];
      });

      const { properties } = arr[0] || {};

      let headerData = [
        {
          name: 'content',
          params: 'application/json',
          required: '是'
        }
      ];
      setHeadersData(headerData);
      setRequestBody(handleRequestBody(properties));
    }
    if (infoData.responses) {
      const resData = JSON.parse(infoData.responses);
      if (resData.content) {
        const arr = Object.keys(resData.content).map((i) => {
          return resData.content[i];
        });

        setResponsesData(resData);
      } else {
        setResponsesData({});
      }
    }
  }, [infoData]);

  const handleRequestBody = (requestBody: any): any => {
    let bodyData = [];
    for (let key in requestBody) {
      if (requestBody[key].type === 'array') {
        bodyData.push({ name: key, children: handleRequestBody(requestBody[key].items), ...requestBody[key] });
      } else {
        bodyData.push({ name: key, ...requestBody[key] });
      }
    }

    return bodyData;
  };

  const method = infoData?.method as MethodsColorEnumType;

  const tabsOnChange = (key: React.SetStateAction<string>) => {
    setActiveKey(key);
  };

  const renderItem = (name: string, data: any) => {
    return (
      <>
        <span className={styles.name}>{name}:</span>
        <span className={styles.data}>{data}</span>
      </>
    );
  };

  return (
    <div className={styles.mainBigBox}>
      <ItemList
        getIinterface={(node) => {
          if (node) {
            setNode(node);
            setActiveKey('1');
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
          }
        }}
      />
      <div className={styles.infoBigBox}>
        <Tabs activeKey={activeKey} onChange={(key) => tabsOnChange(key)} destroyInactiveTabPane>
          <TabPane tab="接口详情" key="1" style={{ fontSize: 20 }}>
            {infoData ? (
              <Spin spinning={loading}>
                <div>
                  <h2 className={styles.title}>基本信息</h2>
                  <Row gutter={[16, 6]} style={{ paddingLeft: 25, marginBottom: 10 }}>
                    <Col span={6}>{renderItem('接口名称', infoData?.name || '-')}</Col>
                    <Col span={18}>{renderItem('接口信息', infoData?.path || '-')}</Col>
                  </Row>
                  <Row gutter={[16, 6]} style={{ paddingLeft: 25, marginBottom: 10 }}>
                    <Col span={6}>{renderItem('请求类型', method ? <Tag color={MethodsColorEnum[method]}>{infoData?.method}</Tag> : '-')}</Col>
                    <Col span={18}>{renderItem('Mock地址', infoData?.mock_url || '-')}</Col>
                  </Row>
                  <Row gutter={[16, 6]} style={{ paddingLeft: 25, marginBottom: 10 }}>
                    <Col span={6}>{renderItem('备注', infoData?.description || '-')}</Col>
                  </Row>

                  <h2 className={styles.title}>请求参数</h2>
                  <div style={{ paddingLeft: 25 }}>
                    <div className={styles.reqData}>
                      <span className={styles.name}>Headers：</span>
                      <Table columns={headersColumns} dataSource={headersData} pagination={false}></Table>
                    </div>
                    <div className={styles.reqData}>
                      <span className={styles.name}>Body:</span>
                      <Table columns={bodyColumns} dataSource={requestBody} pagination={false} expandable={{ defaultExpandAllRows: true }}></Table>
                    </div>
                  </div>
                  <h2 className={styles.title}>返回数据</h2>
                  <div style={{ paddingLeft: 25 }}>
                    <div className={styles.reqData} key="responseBody">
                      {loading ? null : <InterfaceEdit response={responsesData} id={infoData?.id || ''} />}
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
          <TabPane tab="mock期望 " key="3" disabled={node ? false : true}>
            <MockExpected node={node} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
export default Main;
