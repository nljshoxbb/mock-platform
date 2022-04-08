import Empty from '@/components/Empty';
import { MethodsColorEnum, MethodsColorEnumType } from '@/constant/color';
import { InterfaceDetail, InterfaceDetailResponse } from '@/services';
import { transformSchemaToArray } from '@/utils/transformSchemaToArray';
import { Button, Col, Row, Spin, Table, Tabs, Tag, message } from 'antd';
import ClipboardJS from 'clipboard';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';

import { generateBodyColumns, headersColumns, parameterColumns } from './columns';
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
  const [parameterData, setParameterData] = useState<any[]>([]);
  const [responsesData, setResponsesData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>('1');

  useEffect(() => {
    if (!infoData) return;

    const { parameters, request_body, responses } = infoData;

    if (parameters) {
      const parametersJson = JSON.parse(parameters);
      const data = parametersJson.map((i: any) => {
        return {
          name: i.name,
          type: i.schema.type,
          description: i.description
        };
      });
      setParameterData(data);
    }

    if (request_body) {
      let requestBody = JSON.parse(request_body || '{}');
      const keys = Object.keys(requestBody.content);
      const arr = Object.keys(requestBody.content).map((i) => {
        return requestBody.content[i];
      });

      const headerData: any[] = [
        {
          name: 'content',
          params: keys.join(';'),
          required: '是',
          mark: requestBody.description
        }
      ];
      setHeadersData(headerData);
      setRequestBody(transformSchemaToArray(arr[0].schema));
    } else {
      setHeadersData([]);
      setRequestBody([]);
    }

    if (responses) {
      const resData = JSON.parse(infoData.responses);
      if (resData.content) {
        setResponsesData(resData);
      } else {
        setResponsesData({});
      }
    }
  }, [infoData]);

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

  useEffect(() => {
    const copy = new ClipboardJS('.copy-btn');
    copy.on('success', (e) => {
      message.success('已复制到剪切板');
    });
    copy.on('error', function (e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
    });
  }, []);

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
                    {/* <Col span={6}>{renderItem('接口名称', infoData?.name || '-')}</Col> */}
                    <Col span={6}>{renderItem('请求类型', method ? <Tag color={MethodsColorEnum[method]}>{infoData?.method}</Tag> : '-')}</Col>
                    <Col span={18}>{renderItem('接口信息', infoData?.path || '-')}</Col>
                  </Row>
                  <Row gutter={[16, 6]} style={{ paddingLeft: 25, marginBottom: 10 }}>
                    <Col span={18}>
                      {renderItem('mock地址', infoData?.mock_url || '-')}{' '}
                      <Button type="primary" className="ml10 copy-btn" data-clipboard-text={JSON.stringify(infoData?.mock_url)}>
                        复制
                      </Button>
                    </Col>
                  </Row>
                  <Row gutter={[16, 6]} style={{ paddingLeft: 25, marginBottom: 10 }}>
                    <Col span={6}>{renderItem('接口描述', infoData?.description || '-')}</Col>
                  </Row>

                  <h2 className={styles.title}>请求参数</h2>
                  <div style={{ paddingLeft: 25 }}>
                    {!isEmpty(parameterData) && (
                      <div className={styles.reqData}>
                        <span className={styles.name}>Parameter:</span>
                        <Table columns={parameterColumns} dataSource={parameterData} pagination={false} rowKey="name"></Table>
                      </div>
                    )}
                    {!isEmpty(headersData) && (
                      <div className={styles.reqData}>
                        <span className={styles.name}>Headers：</span>
                        <Table columns={headersColumns} dataSource={headersData} pagination={false} rowKey="name"></Table>
                      </div>
                    )}
                    {!isEmpty(requestBody) && (
                      <div className={styles.reqData}>
                        <span className={styles.name}>Body:</span>
                        <Table columns={generateBodyColumns()} dataSource={requestBody} pagination={false} expandable={{ defaultExpandAllRows: true }}></Table>
                      </div>
                    )}
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
