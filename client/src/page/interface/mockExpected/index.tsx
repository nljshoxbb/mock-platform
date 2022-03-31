import AntdDivideTable from '@/components/AntdDivideTable';
import Modal from '@/components/Modal';
import useModal from '@/hooks/useModal';
import {
  ExpectedEdit,
  ExpectedEditRequest,
  ExpectedList,
  ExpectedListRequest,
  ExpectedListResponse,
  ExpectedRemove,
  ExpectedStatus,
  InterfaceExpectedItemItemTypes
} from '@/services';
import { Button, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';

import { Columns } from './columns';
import styles from './index.less';
import AddHopeModal from './modal/index';

type MockExpectedInterface = {
  onSuccess?: () => void;
  node?: any;
};
const MockExpected: React.FC<MockExpectedInterface> = (props) => {
  const editModal = useModal();
  const [currentItem, setCurrentItem] = useState<InterfaceExpectedItemItemTypes>();

  const [hopeList, setHopeList] = useState<ExpectedListResponse>();
  const [parms, setParms] = useState<ExpectedListRequest>({
    interface_id: props.node?.id /** 每页数目 */,
    size: 10,
    /** 页数 */
    page: 1
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    reqExpectedList(parms);
  }, [parms]);

  const reqExpectedList = (parms: ExpectedListRequest) => {
    setLoading(true);
    ExpectedList({ ...parms })
      .then((res) => {
        if (!res.hasError) {
          setHopeList(res.data);

          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <div>
      <Button
        onClick={() => {
          editModal.setTypeWithVisible('add');
        }}
        style={{ marginBottom: 30 }}
        type="primary"
      >
        添加期望
      </Button>
      <Spin spinning={loading}>
        <AntdDivideTable
          key="id"
          dataSource={hopeList?.list}
          rowKey="create_time"
          columns={Columns({
            onEdit: (record: InterfaceExpectedItemItemTypes) => {
              setCurrentItem(record);
              editModal.setTypeWithVisible('info');
            },
            onDelete: (record: { id: string; name: string }) => {
              Modal.confirm({
                title: '删除角色',
                content: `是否确认删除"${record.name}"`,
                onOk: () => {
                  setLoading(true);
                  ExpectedRemove({ id: record.id }).then((res) => {
                    if (!res.hasError) {
                      message.success('删除成功');
                      reqExpectedList(parms);
                    }
                    setLoading(false);
                  });
                }
              });
            },
            onSwitch: (record, checked) => {
              ExpectedStatus({ id: record.id, status: checked as boolean })
                .then((res) => {
                  if (!res.hasError) {
                    reqExpectedList(parms);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })}
          listSummary={{
            pageCurrent: parms?.page as number,
            pageSize: parms?.size as number,
            totalItems: hopeList?.total as number,
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
      <AddHopeModal
        title={editModal.type === 'add' ? '添加期望' : '编辑期望'}
        onSuccess={() => {
          reqExpectedList(parms);
        }}
        visible={editModal.visible}
        onCancel={() => {
          editModal.setVisible(false);
        }}
        currentItem={currentItem}
        type={editModal.type}
        node={props.node}
        width={800}
      />
    </div>
  );
};

export default MockExpected;
