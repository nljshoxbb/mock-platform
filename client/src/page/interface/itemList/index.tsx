import Modal from '@/components/Modal';
import { MethodsColorEnum, ProxyColorEnum } from '@/constant/color';
import useModal from '@/hooks/useModal';
import { TreeData } from '@/models/tree';
import { InterfaceFlatlist, ProjectRemove } from '@/services';
import { Dispatch, RootState } from '@/store';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Spin, Tag, Tooltip, Tree, message } from 'antd';
import type { TreeProps } from 'antd';
import { cloneDeep, isEmpty } from 'lodash';
import React, { Key, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Eidt from './edit';
import styles from './index.less';

const { DirectoryTree } = Tree;
const { Search } = Input;
type DataList = {
  key: string;
  title: string;
  path: string;
};

interface ItemListProps {
  getIinterface?: (node: any) => void;
  interfaceId: string;
}

const ItemList: React.FC<ItemListProps> = ({ getIinterface, interfaceId }) => {
  const [itemName, setItemName] = useState({
    name: '',
    desc: ''
  });
  const [selNode, setSelNode] = useState();
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');
  const [dataList, setDataList] = useState<DataList[]>([]);
  const dispatch = useDispatch<Dispatch>();
  const { treeData, loading } = useSelector((state: RootState) => state.tree);
  const [displayTreeData, setDisplayTreeData] = useState<TreeData[]>([]);

  const editModal = useModal();
  useEffect(() => {
    reqList();

    InterfaceFlatlist({}).then((res) => {
      if (!res.hasError) {
        const list = res.data.list.map((i) => {
          return {
            key: i._id,
            title: i.summary,
            path: i.path
          };
        });
        setDataList(list);
      }
    });
  }, []);

  useEffect(() => {
    setDisplayTreeData(cloneDeep(treeData));
  }, [treeData]);

  const findPath = (key: string, data: any[], path: any = {}) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        return path;
      } else {
        const item = data[i];
        // path[data[i].key] = data[i].key;
        const dataKey = path[item.key];
        path[item.key] = dataKey ? dataKey.push(data[i].key) : [item.key];
        findPath(key, data[i].children, path);
      }
    }
  };

  useEffect(() => {
    if (!expandedKeys.includes(interfaceId)) {
      // findPath(interfaceId, treeData, {});
      // 展开到指定节点
      // setExpandedKeys([...expandedKeys, interfaceId]);
    }
  }, [interfaceId, expandedKeys, displayTreeData]);

  const reqList = (params?: number) => {
    dispatch.tree.getInterfaceList({});
  };

  const onSelect = (keys: React.Key[], info: any) => {
    if (info.node?.isEdit) {
      setItemName({
        name: info.node?.title || '',
        desc: info.node?.desc || ''
      });
    }
    if (info.node?.path) {
      getIinterface && getIinterface(info.node);
    } else {
      getIinterface && getIinterface(undefined);
    }
  };

  const getParentKey = (key: any, tree: string | any[]) => {
    let parentKey = null as any;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item: { key: any }) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const onExpand: TreeProps['onExpand'] = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onSearch = (value: any) => {
    const expandedKeys = dataList
      .map((item) => {
        if (item?.path?.indexOf(value) !== -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setDisplayTreeData((list) => {
      list.forEach((i) => {
        console.log(i);
      });
      return list;
    });
    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const loop = (data: TreeData[]): any => {
    return data?.map((item) => {
      let index = item.title.indexOf(searchValue);
      let beforeStr = item.title.substring(0, index);
      let afterStr = item.title.substring(index + searchValue.length);

      let title: any = '';

      if (index > -1) {
        title = (
          <span>
            {beforeStr}
            <span style={{ color: '#ff5500' }}>{searchValue}</span>
            {afterStr}
          </span>
        );
      } else {
        const pathIndex = item?.path?.indexOf(searchValue);
        if (pathIndex !== undefined && pathIndex > -1) {
          title = <span style={{ color: '#ff5500' }}>{item.title}</span>;
        } else {
          title = <span>{item.title}</span>;
        }
      }

      if (item.children) {
        return { ...item, title, key: item.key, children: loop(item.children) };
      }
      return {
        ...item,
        title,
        key: item.key,
        isLeaf: true,
        icon: null
      };
    });
  };

  return (
    <div className={styles.bigBox}>
      <header className={styles.header}>
        <div className={styles.headerlayout}>
          <div className={styles.headerTitle} title={itemName.name}>
            项目名称: {itemName.name}
          </div>
          <div
            className={styles.newItem}
            onClick={() => {
              editModal.setTypeWithVisible('add');
            }}
          >
            <Button type="primary" icon={<PlusOutlined />}>
              新增
            </Button>
          </div>
        </div>
        <div className={styles.desc}>项目描述:{itemName.desc}</div>
        <Search allowClear placeholder="输入接口地址查找" onSearch={(value) => onSearch(value)} enterButton />
      </header>
      <main>
        <Spin spinning={loading}>
          <DirectoryTree
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            switcherIcon={<DownOutlined />}
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={loop(displayTreeData)}
            titleRender={(node: any) => {
              const method = node?.method as keyof typeof MethodsColorEnum;
              return (
                <div
                  className="flex just-between align-center pr10"
                  style={{
                    position: 'relative',
                    justifyContent: 'space-between'
                  }}
                >
                  <div className="flex align-center">
                    {isEmpty(node.children) && (
                      <>
                        {method && (
                          <Tag className={styles.method} color={MethodsColorEnum[method]} style={{ width: 50, textAlign: 'center' }}>
                            {method}
                          </Tag>
                        )}
                        <Tag className={styles.method} color={ProxyColorEnum[node.proxy ? 'open' : 'close']}>
                          proxy
                        </Tag>
                      </>
                    )}

                    <div className="ellipsis" style={{ display: 'inline-block', width: 200 }}>
                      <Tooltip title={node.path}>{node.title}</Tooltip>
                    </div>
                  </div>
                  {node?.isEdit ? (
                    <div>
                      <span
                        onClick={(e) => {
                          setSelNode(node);
                          e.stopPropagation();
                          editModal.setTypeWithVisible('info');
                        }}
                      >
                        编辑
                      </span>
                      <span
                        style={{ marginLeft: 15 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          Modal.confirm({
                            title: '提示',
                            content: `是否要删除"${node.project_name}"项目`,
                            onOk: () => {
                              ProjectRemove({ id: node.project_id }).then((res) => {
                                if (!res.hasError) {
                                  message.success('删除成功');
                                  reqList();
                                }
                              });
                            }
                          });
                        }}
                      >
                        删除
                      </span>
                    </div>
                  ) : null}
                </div>
              );
            }}
            blockNode
            virtual
            height={560}
          />
        </Spin>
      </main>

      <Eidt
        title={editModal.type === 'add' ? '新增项目' : '编辑项目'}
        visible={editModal.visible}
        onCancel={() => {
          editModal.setVisible(false);
        }}
        onSuccess={() => {
          reqList();
        }}
        selNode={selNode}
        type={editModal.type}
      />
    </div>
  );
};
export default ItemList;
