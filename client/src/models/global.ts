import type { RootModel } from '.';
import { createModel } from '@rematch/core';
import type { UserLoginResponse } from '@/services';

interface GlobalState {
  collapsed: boolean;
  /** 当前选中的词 */
  userInfo: UserLoginResponse;
}

export const global = createModel<RootModel>()({
  state: {
    collapsed: false,
    userInfo: {},
  } as GlobalState,
  reducers: {
    setCollapsed(state, payload: boolean) {
      return { ...state, collapsed: payload };
    },
    setUserInfo(state, payload: UserLoginResponse) {
      return { ...state, userInfo: payload };
    },
  },
  effects: (dispatch) => ({
    async changeLayoutCollapsed(payload: boolean, state) {
      console.log('This is current root state', state);
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // dispatch.global.setCollapsed(payload);
      dispatch.global.setCollapsed(payload);
    },
  }),
});
