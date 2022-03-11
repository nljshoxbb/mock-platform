import Button from "@/components/Button";
import type { ColumnsType } from "antd/lib/table";
import { InterfaceExpectedItemItemTypes } from "@/services";
import { Switch } from "antd";
import type { TableProps } from "antd";
import { formatDate } from "@/utils/utils";

type CallbackFn = (
  record: InterfaceExpectedItemItemTypes,
  checked?: boolean | undefined
) => void;

interface ColumnsProps extends TableProps<InterfaceExpectedItemItemTypes> {
  onEdit?: CallbackFn;
  onDelete?: CallbackFn;
  onSwitch?: CallbackFn;
}
const noop = () => {};

export const Columns = ({
  onEdit = noop,
  onDelete = noop,
  onSwitch = noop,
}: ColumnsProps): ColumnsType<InterfaceExpectedItemItemTypes> => {
  return [
    {
      title: "期望名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "参数值",
      dataIndex: "delay",
      key: "delay",
    },
    {
      title: "编辑时间",
      dataIndex: "updated_at",
      key: "updated_at",
      width: 300,

      render: (val) => formatDate(val),
    },
    {
      title: "操作",
      dataIndex: "13",
      key: "13",
      width: 300,
      render: (val: any, record: InterfaceExpectedItemItemTypes) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button type="primary" onClick={() => onEdit(record)}>
              编辑
            </Button>
            <Button onClick={() => onDelete(record)}>删除</Button>
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              // defaultChecked
              onClick={(checked) => onSwitch(record, checked)}
            />
          </div>
        );
      },
    },
  ];
};
