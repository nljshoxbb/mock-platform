import { BASE_URL, REQUEST_TIMEOUT } from "../configs/request";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { LocalStorage } from "@/utils/LocalStorage";
import { debounce } from "lodash";
import { notification } from "antd";

// import { RouteEnum } from "@/constants/RouteEnum";

// import { history } from 'umi';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export const showDebounceMsg = debounce((callback?: any) => {
  if (callback) callback();
}, 500);

/** request过滤器 */
instance.interceptors.request.use(
  (config) => {
    const Authorization =
      "Bearer " + localStorage.getItem(LocalStorage.MOCK_TOKEN) || "";
    if (!Authorization) {
      showDebounceMsg(() => {
        notification.error({
          message: "提示",
          description: "session失效，请重新登录！",
        });
      });
      setTimeout(() => {
        // history.push(RouteEnum.LOGIN);
      }, 200);
      return config;
    }
    if (config.headers) {
      config.headers.Authorization = Authorization;
    }
    return config;
    // return {};
  },
  (err) => {
    return Promise.reject(err);
  }
);

/** response过滤器 */
instance.interceptors.response.use(
  (response) => {
    /** 接口全部走200，通过判断 errorId */

    /** 存在错误 */
    if (
      response.data?.hasError &&
      (response.data?.errorId === "NoLoginError" ||
        response.data.errorId === "SessionNotFoundOrExpired")
    ) {
      showDebounceMsg(() => {
        notification.error({
          message: "提示",
          description: `session失效，请重新登录！`,
        });
      });

      setTimeout(() => {
        // history.push(RouteEnum.LOGIN);
      }, 200);

      // InternalError
    } else if (response.data?.hasError) {
      notification.error({
        message: "提示",
        description: response.data.errorDesc,
      });
    }

    /** 特殊处理,获取请求头中的文件 */
    if (response.config.url === "/v1/file/exportDoc") {
      return response;
    }

    return response.data;
  },
  (err) => {
    // console.log(err.message, axios.isCancel(err));
    /** custom 用于过滤多个上传提示重复 */
    if (axios.isCancel(err) && err.message !== "custom") {
      // message.warn(err.message);
      return;
    }

    notification.error({
      message: "提示",
      description: "网络异常",
    });
    return Promise.reject(err);
  }
);

export type { AxiosRequestConfig, AxiosResponse };

/** 当需要 终止请求的时候 请求参数使用该方法构造一下，终止时，调用 fn['abort']() 即可 */
export const InjectAbort = (fn: Function, param?: object) => {
  // return {};
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const _param =
    Object.prototype.toString.call(param) === "[object Object]" ? param : {};
  // @ts-ignore
  fn["abort"] = source.cancel;
  return {
    ..._param,
    cancelToken: source.token,
  };
};

/** 返回axios实例 */
export default instance;
