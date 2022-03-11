interface QueryLocation<T> {
  location: {
    query: T;
    pathname: string;
    search: string;
  };
}

interface RouteConfig {
  path?: string;
  name?: string;
  component?: string;
  routes?: RouteConfig[];
  /** https://umijs.org/zh-CN/plugins/plugin-layout#icon */
  icon?: string;
  /** https://umijs.org/zh-CN/plugins/plugin-layout 隐藏自己和子菜单 */
  hideInMenu?: boolean;
  authority?: string[];
  redirect?: string;
  menuIcon?: string;
  exact?: boolean;
}

declare let BUILD_TIME: string;

declare let DEPENDENCIES: string;

declare let VERSION: string;

interface Window {
  __APP_INFO__: {
    BUILD_TIME: string;
    DEPENDENCIES: string;
    VERSION: string;
  };
}
