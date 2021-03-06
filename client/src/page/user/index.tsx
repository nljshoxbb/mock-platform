import {} from "@/services";

import { Col, DatePicker, Form, Input, Row, Spin, message } from "antd";
import React, { useEffect, useState } from "react";

import {
  UserItemTypes,
  UserList,
  UserListRequest,
  UserListResponse,
  UserRemove,
} from "@/services";

import AntdDivideTable from "@/components/AntdDivideTable";
import Button from "@/components/Button";
import { Columns } from "./Columns";
import Edit from "./modal/index";
import Modal from "@/components/Modal";
import moment from "moment";
import styles from "./index.less";
import useModal from "@/hooks/useModal";

const { RangePicker } = DatePicker;
const User = () => {
  const [currentItem, setCurrentItem] = useState<UserItemTypes>();
  const [loadding, setLoadding] = useState<boolean>(false);
  const [data, setData] = useState<UserListResponse>();
  const editModal = useModal();
  const [parms, setParms] = useState<UserListRequest>({
    /** 每页数目 */
    size: 10,
    /** 页数 */
    page: 1,
  });
  useEffect(() => {}, []);

  const onFinish = (value: {
    dateRange: moment.MomentInput[];
    role_name: string;
  }) => {
    let newSearchValues = {
      ...value,
      end: (value?.dateRange && moment(value?.dateRange[1]).valueOf()) || 0,
      begin: (value?.dateRange && moment(value?.dateRange[0]).valueOf()) || 0,
      offset: 1,
      size: 10,
    };
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
  
  return (
    <div style={{ padding: 20 }}>
      <Form className={styles.commonSearchForm} onFinish={onFinish}>
        <Row gutter={[32, 8]}>
          <Col sm={6} md={6} lg={6} xl={6}>
            <div className={styles.filterTitle}>角色</div>

            <Form.Item name="role_name">
              <Input style={{ width: "100%" }} placeholder="请输入角色名称" />
            </Form.Item>
          </Col>
          <Col sm={6} md={6} lg={6} xl={6}>
            <div className={styles.filterTitle}>更新时间</div>

            <Form.Item name="dateRange">
              <RangePicker
                style={{ width: "100%" }}
                // value={[
                //   timeMomentFormart(item.value[0]),
                //   timeMomentFormart(item.value[1]),
                // ]}
                format="YYYY-MM-DD HH:mm:ss"
                allowClear
                showTime
                // onChange={this.changeTime}
              />
            </Form.Item>
          </Col>
          <Col sm={6} md={6} lg={6} xl={6}>
            <div className={styles.formBtn}>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.submitStyle}
              >
                搜索
              </Button>
              <Button
                className={styles.reset}
                onClick={() => {
                  editModal.setTypeWithVisible("add");
                }}
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
              console.log(record,'record');
              
              setCurrentItem(record);
              editModal.setTypeWithVisible("info");
            },
            onDelete: (record: { id: string; username: string }) => {
              Modal.confirm({
                title: "删除角色",
                content: `是否确认删除"${record.username}"`,
                onOk: () => {
                  setLoadding(true);
                  UserRemove({ id: record.id }).then((res) => {
                    if (!res.hasError) {
                      message.success("删除成功");
                      reqUserList(parms);
                    }
                    setLoadding(false);
                  });
                },
              });
            },
          })}
          listSummary={{
            pageCurrent: parms.page as number,
            pageSize: parms.size as number,
            totalItems: data?.total as number,
            totalPages: 0,
          }}
          onPaginationChange={(page, size) => {
            setParms((x) => ({
              ...x,
              page,
              size: size || x.size,
            }));
          }}
        />
      </Spin>

      <Edit
        title={editModal.type === "add" ? "新增角色" : "编辑角色"}
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
