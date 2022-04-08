import {} from '@/services';

import AntdDivideTable from '@/components/AntdDivideTable';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import useModal from '@/hooks/useModal';
import { UserItemTypes, UserList, UserListRequest, UserListResponse, UserRemove } from '@/services';
import { Col, DatePicker, Form, Input, Row, Spin, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { Columns } from './Columns';
import styles from './index.less';
import Edit from './modal/index';

const { RangePicker } = DatePicker;
const User = () => {
  const [currentItem, setCurrentItem] = useState<UserItemTypes>();
  const [loadding, setLoadding] = useState<boolean>(false);
  const [data, setData] = useState<UserListResponse>();
  const editModal = useModal();
  const [form] = useForm();
  const [parms, setParms] = useState<UserListRequest>({
    /** 每页数目 */
    size: 10,
    /** 页数 */
    page: 1,
    username: '',
    begin: 0,
    end: 0
  });
  useEffect(() => {}, []);

  const onFinish = (value: { dateRange: moment.MomentInput[]; role_name: string }) => {
    // let newSearchValues = {
    //   ...value,
    //   end: (value?.dateRange && moment(value?.dateRange[1]).valueOf()) || 0,
    //   begin: (value?.dateRange && moment(value?.dateRange[0]).valueOf()) || 0,
    //   offset: 1,
    //   size: 10
    // };
    // setParms(newSearchValues);
  };
  useEffect(() => {
    reqUserList(parms);
  }, [parms]);

  const reqUserList = (parms: UserListRequest) => {
    setLoadding(true);
    UserList({ ...parms })
      .then((res) => {
        if (!res.hasError) {
          setLoadding(false);

          setData(res.data);
        }
      })
      .catch((err) => {
        setLoadding(false);
      });
  };

  const onSearch = () => {
    const value = form.getFieldsValue();
    console.log(value);
    setParms({
      ...parms,
      page: 1,
      end: (value?.dateRange && moment(value?.dateRange[1]).unix()) || '',
      begin: (value?.dateRange && moment(value?.dateRange[0]).unix()) || '',
      username: value.username
    });
  };

  return (
    <div className={styles.main}>
      <Form className={styles.commonSearchForm} onFinish={onFinish} form={form}>
        <Row gutter={[32, 8]}>
          <Col sm={6} md={6} lg={6} xl={6}>
            <div className={styles.filterTitle}>用户</div>

            <Form.Item name="username">
              <Input style={{ width: '100%' }} placeholder="请输入角色名称" />
            </Form.Item>
          </Col>
          <Col sm={6} md={6} lg={6} xl={6}>
            <div className={styles.filterTitle}>更新时间</div>

            <Form.Item name="dateRange">
              <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" allowClear showTime />
            </Form.Item>
          </Col>
          <Col sm={6} md={6} lg={6} xl={6}>
            <div className={styles.formBtn}>
              <Button type="primary" htmlType="submit" className={styles.submitStyle} onClick={onSearch}>
                搜索
              </Button>
              <Button
                className={styles.reset}
                onClick={() => {
                  editModal.setTypeWithVisible('add');
                }}
                type="primary"
              >
                新增
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
      <Spin spinning={loadding}>
        <AntdDivideTable
          dataSource={data?.list}
          rowKey="update_at"
          columns={Columns({
            onEdit: (record: UserItemTypes) => {
              setCurrentItem(record);
              editModal.setTypeWithVisible('info');
            },
            onDelete: (record: { id: string; username: string }) => {
              Modal.confirm({
                title: '删除角色',
                content: `是否确认删除"${record.username}"`,
                onOk: () => {
                  setLoadding(true);
                  UserRemove({ id: record.id }).then((res) => {
                    if (!res.hasError) {
                      message.success('删除成功');
                      reqUserList(parms);
                    }
                    setLoadding(false);
                  });
                }
              });
            }
          })}
          listSummary={{
            pageCurrent: parms.page as number,
            pageSize: parms.size as number,
            totalItems: data?.total as number,
            totalPages: 0
          }}
          onPaginationChange={(page, size) => {
            setParms((x) => ({
              ...x,
              page,
              size: size || x.size
            }));
          }}
        />
      </Spin>

      <Edit
        title={editModal.type === 'add' ? '新增用户' : '编辑用户'}
        visible={editModal.visible}
        onCancel={() => {
          editModal.setVisible(false);
        }}
        onSuccess={() => {
          reqUserList(parms);
        }}
        currentItem={currentItem}
        type={editModal.type}
        width={560}
      />
    </div>
  );
};

export default User;
