import type { CSSProperties, Ref } from "react";
import { Empty, Table } from "antd";
import React, { forwardRef, useCallback, useRef, useState } from "react";
import type { TablePaginationConfig, TableProps } from "antd/lib/table";

import styles from "./index.less";

export interface BaseListSummary {
  pageCurrent: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
interface AntdDivideTableProps<T> extends TableProps<T> {
  fixed?: boolean;
  showPagination?: boolean;
  listSummary?: BaseListSummary;
  paginationConfig?: TablePaginationConfig;
  onPaginationChange?: (page: number, pageSize?: number) => void;
  rowSelection?: TableProps<T>["rowSelection"] & {
    selectedRows?: T[];
    onClear?: () => void;
    selectLimit?: number | [number, number];
  };
  wrapStyle?: CSSProperties;
}

function AntdDivideTable<T>(
  tableprops: AntdDivideTableProps<T>,
  ref: Ref<HTMLDivElement>
) {
  const defaultListSummary: BaseListSummary = {
    pageCurrent: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  };
  const {
    fixed,
    pagination,
    scroll,
    listSummary = defaultListSummary,
    showPagination = true,
    paginationConfig,
    onPaginationChange,
    rowSelection,
    wrapStyle = {},
    ...rest
  } = tableprops;
  const { pageCurrent, pageSize, totalItems } = listSummary;

  /** 多选行数据 */
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  /** 每页多选的数据 */
  const [, setSelectKeys] = useState<T[][]>([]);
  /** 当前分页 */
  const [pageParams, setPageParams] = useState({
    page: pageCurrent,
    pageSize: pageSize,
  });
  const activeRowClassName = useCallback(
    (record, index: number, indent: number): string => {
      if (selectedRowKeys.includes(record.id)) return "theme-row-active";
      return "";
    },
    [selectedRowKeys]
  );
  // 每页二维数据转为一维数据
  const mapRows = (arr: string | any[]) => {
    let res: T[] = [];
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        res = res.concat(mapRows(arr[i]));
      } else {
        res.push(arr[i]);
      }
    }
    return res.filter(Boolean);
  };

  /** 表格单选和多选 */
  const onSelectChange = (keys: number[], selectedRows: T[]) => {
    // @ts-ignore
    setSelectedRowKeys(selectedRows);
  };

  const common = {
    showTotal: (total: number) => `共${total}条`,
    showQuickJumper: true,
    pageSizeOptions: ["10", "50", "100"],
    showSizeChanger: false,
  };

  return (
    <div
      ref={ref}
      className={`${styles.main} ${fixed ? styles["fixed-table"] : ""}`}
      style={wrapStyle}
    >
      <Table
        {...rest}
        scroll={scroll}
        rowClassName={activeRowClassName}
        pagination={
          pagination
            ? {
                ...pagination,
                ...common,
                onShowSizeChange: pagination.onChange,
              }
            : showPagination && {
                // className: "m-pagination",
                ...common,
                current: pageCurrent,
                pageSize,
                total: totalItems,
                onChange: (page, pageSizeVal) => {
                  setPageParams({
                    ...pageParams,
                    page,
                    pageSize: pageSizeVal || defaultListSummary.pageSize,
                  });
                  onPaginationChange && onPaginationChange(page, pageSizeVal);
                },
                ...paginationConfig,
              }
        }
        // @ts-ignore

        rowSelection={
          rowSelection
            ? {
                ...rowSelection,
                // selectedRowKeys,
                // onChange: onSelectChange,
              }
            : undefined
        }
        // locale={{
        //   emptyText: (
        //     <div className="flex flex-center ">
        //       <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        //     </div>
        //   ),
        // }}
      />
    </div>
  );
}

export default forwardRef(AntdDivideTable) as typeof AntdDivideTable;
