import Button from '@/components/Button';
import { UserItemTypes } from '@/services';
import { formatDate } from '@/utils/utils';
import type { TableProps } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import React from 'react';

type CallbackFn = (record: UserItemTypes) => void;
interface ColumnsProps extends TableProps<UserItemTypes> {
  onEdit?: CallbackFn;
  onDelete?: CallbackFn;
}
const noop = () => {};

export const Columns = ({ onEdit = noop, onDelete = noop }: ColumnsProps): ColumnsType<UserItemTypes> => {
  return [
    {
      title: '序号',
      dataIndex: '',
      key: '1',
      align: 'center',
      render: (text: any, record: any, index: number) => `${index + 1}`
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      ellipsis: true
    },

    {
      title: '更新时间',
      dataIndex: 'update_at',
      key: 'update_at',
      render: (val: any) => formatDate(val)
    },
    {
      title: '操作',
      dataIndex: '13',
      key: '13',
      width: 200,
      render: (val: any, record: UserItemTypes) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button type="primary" onClick={() => onEdit(record)}>
              编辑
            </Button>
            <Button type="primary" danger onClick={() => onDelete(record)}>
              删除
            </Button>
          </div>
        );
      }
    }
  ];
};
