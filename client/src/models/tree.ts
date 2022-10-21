import { InterfaceFlatlist, InterfaceList, UserLoginResponse } from '@/services';
import { createModel } from '@rematch/core';

import type { RootModel } from '.';

export type TreeData = {
  key: string;
  title: string;
  children: TreeData[];
  path?: string;
};

interface TreeState {
  treeData: TreeData[];
  loading: boolean;
}

const treeChagenName = (data: any[], title: string, key: string, children: string, isEdit?: boolean) => {
  let newData: [] = [];
  return data.map((item) => {
    if (item.id) {
      return {
        ...item,
        key: item.id,
        title: item.summary || item.path
      };
    } else {
      if (item[children].length) {
        //@ts-ignore
        newData = treeChagenName(item[children], 'category_name', 'category_id', 'interface_list', false);
      } else {
        newData = [];
      }
      return {
        ...item,
        title: item[title],
        key: item[key],
        children: newData,
        isEdit: isEdit
      };
    }
  });
};

export const tree = createModel<RootModel>()({
  state: {
    treeData: [],
    loading: false
  } as TreeState,
  reducers: {
    setUserInfo(state, payload: UserLoginResponse) {
      return { ...state, userInfo: payload };
    },
    setTreeData(state, payload: any) {
      return { ...state, treeData: payload };
    },
    setTreeLoading(state, payload: boolean) {
      return { ...state, loading: payload };
    }
  },
  effects: (dispatch) => ({
    async getInterfaceList(payload?: any) {
      try {
        dispatch.tree.setTreeLoading(true);
        const res = await InterfaceList({});
        if (!res.hasError) {
          const data = treeChagenName(res.data.list, 'project_name', 'project_id', 'category_list', true);
          dispatch.tree.setTreeData(data);
        }
        dispatch.tree.setTreeLoading(false);
      } catch (error) {
        dispatch.tree.setTreeLoading(false);
      }
    }
  })
});
