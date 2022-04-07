import { Table } from 'antd';
import type { TablePaginationConfig, TableProps } from 'antd/lib/table';
import type { CSSProperties, Ref } from 'react';
import { forwardRef, useState } from 'react';

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
  rowSelection?: TableProps<T>['rowSelection'] & {
    selectedRows?: T[];
    onClear?: () => void;
    selectLimit?: number | [number, number];
  };
  wrapStyle?: CSSProperties;
}

function AntdDivideTable<T>(tableprops: AntdDivideTableProps<T>, ref: Ref<HTMLDivElement>) {
  const defaultListSummary: BaseListSummary = {
    pageCurrent: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
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

  /** 当前分页 */
  const [pageParams, setPageParams] = useState({
    page: pageCurrent,
    pageSize: pageSize
  });

  // 每页二维数据转为一维数据
  const mapRows = (arr: string | any[]) => {
    let res: T[] = [];
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        res = res.concat(mapRows(arr[i]));
      } else {
        res.push(arr[i]);
      }
    }
    return res.filter(Boolean);
  };

  const common = {
    showTotal: (total: number) => `共${total}条`,
    showQuickJumper: true,
    pageSizeOptions: ['10', '50', '100'],
    showSizeChanger: false
  };

  return (
    <div ref={ref} style={wrapStyle}>
      <Table
        {...rest}
        scroll={scroll}
        pagination={
          pagination
            ? {
                ...pagination,
                ...common,
                onShowSizeChange: pagination.onChange
              }
            : showPagination && {
                ...common,
                current: pageCurrent,
                pageSize,
                total: totalItems,
                onChange: (page, pageSizeVal) => {
                  setPageParams({
                    ...pageParams,
                    page,
                    pageSize: pageSizeVal || defaultListSummary.pageSize
                  });
                  onPaginationChange && onPaginationChange(page, pageSizeVal);
                },
                ...paginationConfig
              }
        }
        // @ts-ignore

        rowSelection={
          rowSelection
            ? {
                ...rowSelection
              }
            : undefined
        }
      />
    </div>
  );
}

export default forwardRef(AntdDivideTable) as typeof AntdDivideTable;
