import { Button, Input, Spin, Tree, message } from "antd";
import { InterfaceList, ProjectRemove } from "@/services";
import React, { Key, useEffect, useState } from "react";

import { DownOutlined } from "@ant-design/icons";
import Eidt from "./edit";
import Item from "antd/lib/list/Item";
import Modal from "@/components/Modal";
import { PlusCircleOutlined } from "@ant-design/icons";
import type { TreeProps } from "antd";
import { isEmpty } from "lodash";
import { listToTreeWithOption } from "@/hooks/useTree";
import styles from "./index.less";
import useModal from "@/hooks/useModal";

const { DirectoryTree } = Tree;
const { Search } = Input;
type DataList = {
  key: string;
  title: string;
};
type TreeData = {
  key: string;
  title: string;
  children: TreeData[];
};
interface ItemListProps {
  getIinterface?: (node: any) => void;

}
const dataList: DataList[] = [];

const ItemList: React.FC<ItemListProps> = ({ getIinterface }) => {
  const [treeData, setTreeData] = useState<TreeData[]>([]);
  const [itemName, setItemName] = useState({
    name: "",
    desc: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [selNode, setSelNode] = useState();
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");

  const editModal = useModal();
  useEffect(() => {
    reqList();
    treeData && generateList(treeData);
  }, []);
  const reqList = (params?: number) => {
    setLoading(true);
    InterfaceList({ project_id: params })
      .then((res) => {
        setTreeData(
          treeChagenName(
            res.data.list,
            "project_name",
            "project_id",
            "category_list",
            true
          )
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log(err, "err");
        setLoading(false);
      });
  };
  const generateList = (data: string | any[]) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, title } = node;
      dataList.push({ key, title: title });
      if (node.children) {
        generateList(node.children);
      }
    }
  };

  const treeChagenName = (
    data: any[],
    title: string,
    key: string,
    children: string,
    isEdit?: boolean
  ) => {
    let newData: [] = [];
    return data.map((item) => {
      if (item.id) {
        return {
          ...item,
          key: item.id,
          title: item.path,
        };
      } else {
        if (item[children].length) {
          //@ts-ignore
          newData = treeChagenName(
            item[children],
            "category_name",
            "category_id",
            "interface_list",
            false
          );
        } else {
          newData = [];
        }
        return {
          ...item,
          title: item[title],
          key: item[key],
          children: newData,
          isEdit: isEdit,
        };
      }
    });
  };
  const onSelect = (keys: React.Key[], info: any) => {
    // console.log(info, "info");
    if (info.node?.isEdit) {
      setItemName({
        name: info.node?.title || "",
        desc: info.node?.desc || "",
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
  const onExpand: TreeProps["onExpand"] = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };
  const onSearch = (value: any) => {
    const expandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };
  const loop = (data: TreeData[]): any => {
    return data?.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substring(0, index);
      const afterStr = item.title.substring(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: "#ff5500" }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return { ...item, title, key: item.key, children: loop(item.children) };
      }
      return {
        ...item,
        title,
        key: item.key,
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
              editModal.setTypeWithVisible("add");
            }}
          >
            <PlusCircleOutlined />
            新增
          </div>
        </div>
        <div>
          <span className={styles.desc}>项目描述:{itemName.desc}</span>
        </div>
        <Search
          allowClear
          placeholder="输入项目名称或者接口地址"
          onSearch={(value) => onSearch(value)}
        />
      </header>
      <main>
        <Spin spinning={loading}>
          <DirectoryTree
            // multiple
            // defaultExpandAll
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            switcherIcon={<DownOutlined />}
            onSelect={onSelect}
            showIcon={false}
            onExpand={onExpand}
            treeData={loop(treeData)}
            titleRender={(node: any) => {
              return (
                <div
                  className="flex just-between align-center pr10"
                  style={{
                    position: "relative",
                    minWidth: 250,
                    justifyContent: "space-between",
                  }}
                >
                  <div className="flex align-center">
                    {isEmpty(node.children) && (
                      <span className={styles.method}>{node?.method}</span>
                    )}

                    <div>{node.title}</div>
                  </div>
                  {node?.isEdit ? (
                    <div>
                      <span
                        onClick={(e) => {
                          setSelNode(node);
                          e.stopPropagation();
                          editModal.setTypeWithVisible("info");
                        }}
                      >
                        编辑
                      </span>
                      <span
                        style={{ marginLeft: 15 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          Modal.confirm({
                            title: "提示",
                            content: `是否要删除${node.title}`,
                            onOk: () => {
                              console.log(node, 66);
                              setLoading(true);

                              ProjectRemove({ id: node.project_id })
                                .then((res) => {
                                  if (!res.hasError) {
                                    message.success("删除成功");
                                    reqList();
                                    setLoading(false);
                                  }
                                })
                                .catch((err) => {
                                  setLoading(false);
                                });
                            },
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
          />
        </Spin>
      </main>

      <Eidt
        title={editModal.type === "add" ? "新增" : "编辑"}
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
