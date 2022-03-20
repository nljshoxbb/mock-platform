import type { ColumnsType } from "antd/lib/table";

export const headersColumns = [
  {
    title: "参数名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "参数值",
    dataIndex: "params",
    key: "params",
  },
  {
    title: "是否必须",
    dataIndex: "required",
    key: "required",
  },
  {
    title: "示例",
    dataIndex: "address1",
    key: "address1",
  },
  {
    title: "备注",
    dataIndex: "address2",
    key: "address2",
  },
];

export const bodyColumns = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "是否必须",
    dataIndex: "required",
    key: "required",
    render: (text: any, record: any) => {
      if (text) {
        return "必须";
      } else {
        return "非必须";
      }
    },
  },
  {
    title: "默认值",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "备注",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "其他信息",
    dataIndex: "address3",
    key: "address",
  },
];
