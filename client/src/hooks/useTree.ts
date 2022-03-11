import useDeepCompareEffect, {
  useDeepCompare,
} from "@/hooks/useDeepCompareEffect";
import { useEffect, useMemo, useRef, useState } from "react";

import type { AntTreeNodeProps } from "antd/lib/tree/Tree";
import { cloneDeep } from "lodash";

export function findRootKey(
  list: any,
  key: string = "id",
  parentKey: string = "parent_id"
) {
  let i;
  let rootKey;
  // 存id
  const ids: number[] = [];
  // 存parentId
  const parentIds: number[] = [];
  for (i = 0; i < list.length; i += 1) {
    ids.push(list[i][key]);

    if (list[i][parentKey] > 0) {
      parentIds.push(list[i][parentKey]);
    }
  }

  list.forEach((item: any) => {
    if (!ids.includes(item[parentKey])) {
      rootKey = item[parentKey];
    }
  });
  return rootKey;
}

/**
 *
 * @param list 列表
 * @param key
 * @param parentKey
 */
export function listToTreeWithOption<T>(
  list: any[],
  key: string = "id",
  parentKey: string = "parent_id",
  format: (p: T) => T = (p) => p
) {
  const map = {};
  let node;
  const roots = [];
  let i;

  const rootKey = findRootKey(list, key, parentKey);

  for (i = 0; i < list.length; i += 1) {
    list[i].title = list[i].title || list[i].name;
    list[i].key = list[i][key];
    // @ts-ignore
    map[list[i][key]] = i; // initialize the map
    list[i].children = []; // initialize the children
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node[parentKey] !== rootKey) {
      // @ts-ignore
      if (list[map[node[parentKey]]]) {
        // @ts-ignore
        list[map[node[parentKey]]].children.push(format(node));
      } else {
        roots.push(format(node));
      }
    } else {
      roots.push(format(node));
    }
  }

  return roots;
}

export interface Config {
  /**
   *id
   *
   * @type {string}
   * @memberof Config
   */
  id?: string;
  /**
   *父级id
   *
   * @type {string}
   * @memberof Config
   */
  parentId?: string;
  /**
   *格式化函数
   *
   * @memberof Config
   */
  format?: (data: AntTreeNodeProps[], rootKey: any) => any;
  defaultSelectedKeys?: any[];
  /**
   * 依赖刷新
   */
  refreshDeps?: any[];
}

/**
 *树形组件 hook
 *
 * @export
 * @param {*} data
 * @param {Config} config
 * @returns
 */
export default function useTree(data: any = [], config: Config) {
  const {
    id = "id",
    parentId = "parent_id",
    format,
    defaultSelectedKeys,
    refreshDeps = [],
  } = config;
  const [expandedAllKeys, setExpandedAllKeys] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]);

  const [count, setCount] = useState(0);
  const dataSource = useRef([]);

  function getNewExpandeKeys(arr: any[]) {
    return arr.map((item: any) => item[id]);
  }
  const rootKey = findRootKey(data, id, parentId);

  useDeepCompareEffect(() => {
    dataSource.current = cloneDeep(data);
    if (format) {
      dataSource.current = format(dataSource.current, rootKey);
    }
    if (defaultSelectedKeys) {
      setSelectedKeys(defaultSelectedKeys);
    }

    setCount(count + 1);

    const newExpandeKeys = getNewExpandeKeys(dataSource.current);

    if (newExpandeKeys.length > 1) {
      setExpandedKeys(newExpandeKeys);
      setExpandedAllKeys(true);
    }
  }, [data, ...refreshDeps]);

  useEffect(() => {
    if (expandedAllKeys) {
      const newExpandeKeys = getNewExpandeKeys(dataSource.current);
      setExpandedKeys(newExpandeKeys);
    } else {
      setExpandedKeys([]);
    }
  }, [expandedAllKeys]);

  const treeData = useMemo(() => {
    return listToTreeWithOption(dataSource.current, id, parentId);
  }, [useDeepCompare(dataSource.current)]);

  return useMemo(() => {
    return {
      treeProps: {
        treeData,
        expandedKeys,
        selectedKeys,
        checkedKeys,
        blockNode: true,
      },
      expandedAllKeys,
      setExpandedKeys,
      setExpandedAllKeys,
      setSelectedKeys,
      setCheckedKeys,
    };
  }, [
    useDeepCompare(expandedKeys),
    useDeepCompare(selectedKeys),
    useDeepCompare(treeData),
    useDeepCompare(checkedKeys),
    expandedAllKeys,
  ]);
}
