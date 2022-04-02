import type { ColumnsType } from 'antd/lib/table';

export const parameterColumns = [
  {
    title: '参数名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '参数类型',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: '是否必须',
    dataIndex: 'required',
    key: 'required'
  }
];

export const headersColumns = [
  {
    title: '参数名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '参数值',
    dataIndex: 'params',
    key: 'params'
  },
  // {
  //   title: '是否必须',
  //   dataIndex: 'required',
  //   key: 'required'
  // },\
  {
    title: '备注',
    dataIndex: 'mark',
    key: 'mark'
  },
  {
    title: '示例',
    dataIndex: 'example',
    key: 'example'
  }
];

export const generateBodyColumns = (isEdit: boolean = false) => {
  let common = [
    {
      title: '字段名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '是否必须',
      dataIndex: 'required',
      key: 'required',
      render: (text: any, record: any) => {
        if (text) {
          return '必须';
        } else {
          return '非必须';
        }
      }
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description'
    }
  ];

  if (isEdit) {
    common = [
      ...common,
      {
        title: 'mock',
        dataIndex: 'mock',
        key: 'mock'
      },

      {
        title: '设置',
        dataIndex: 'setting',
        key: 'setting'
      }
    ];
  }

  return common;
};
