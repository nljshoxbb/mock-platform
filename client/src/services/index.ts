
/**
 * @readOnly {只读， 脚本更改}
 * @Message {来源} {npm run codec:swagger}
 * @Swagger 自动生成接口请求信息
*/
import type { AxiosRequestConfig} from '@/utils/request';
import axiosInstance, { InjectAbort } from '@/utils/request';

import type { BaseServeResponse } from '@/typings/BaseTypes';

/** ========================= **************** ExpectedList ****************** ========================= */

/** undefined 请求参数 */
export interface ExpectedListRequest {
    /** 对应的接口id */
    interface_id: string;
    /** 每页数目 */
    size: number;
    /** 页数 */
    page: number;
}

/** undefined 响应参数*/
export interface ExpectedListResponse {
      /** undefined */
      list: InterfaceExpectedItemItemTypes[];
      /** 每页数目 */
      size: number;
      /** 当前页数 */
      page: number;
      /** 总数 */
      total: number;
}
/** undefined */
export const ExpectedList = (data: ExpectedListRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<ExpectedListResponse>> => {
  return axiosInstance({
    url:'/api/v1/expected/list',
    method: 'post',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(ExpectedList, config)
  })
};

/** ========================= **************** ExpectedCreate ****************** ========================= */

/** undefined 请求参数 */
export interface ExpectedCreateRequest {
    /** 模拟延迟返回时间.单位 ms */
    delay: number;
    /** 指定接口返回的具体数据 jsonstring */
    response_body: string;
    /** 期望名 */
    name: string;
    /** id */
    interface_id: string;
}

/** undefined 响应参数*/
export interface ExpectedCreateResponse {
}
/** undefined */
export const ExpectedCreate = (data: ExpectedCreateRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<ExpectedCreateResponse>> => {
  return axiosInstance({
    url:'/api/v1/expected/create',
    method: 'post',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(ExpectedCreate, config)
  })
};

/** ========================= **************** ExpectedEdit ****************** ========================= */

/** undefined 请求参数 */
export interface ExpectedEditRequest {
    /** 期望id */
    id: string;
    /** 是否开启。0关闭，1开启 */
    status: "0"|"1";
    /** 模拟延迟返回时间.单位 ms */
    delay: number;
    /** 指定接口返回的具体数据 jsonstring */
    response_body: string;
    /** 期望名 */
    name: string;
}

/** undefined 响应参数*/
export interface ExpectedEditResponse {
}
/** undefined */
export const ExpectedEdit = (data: ExpectedEditRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<ExpectedEditResponse>> => {
  return axiosInstance({
    url:'/api/v1/expected/edit',
    method: 'put',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(ExpectedEdit, config)
  })
};

/** ========================= **************** ExpectedRemove ****************** ========================= */

/** undefined 请求参数 */
export interface ExpectedRemoveRequest {
    /** 期望id */
    id: string;
}

/** undefined 响应参数*/
export interface ExpectedRemoveResponse {
}
/** undefined */
export const ExpectedRemove = (data: ExpectedRemoveRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<ExpectedRemoveResponse>> => {
  return axiosInstance({
    url:'/api/v1/expected/remove',
    method: 'delete',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(ExpectedRemove, config)
  })
};

/** ========================= **************** ExpectedStatus ****************** ========================= */

/** undefined 请求参数 */
export interface ExpectedStatusRequest {
    /** 期望id */
    id: string;
    /** 开启状态 */
    status: boolean;
}

/** undefined 响应参数*/
export interface ExpectedStatusResponse {
}
/** undefined */
export const ExpectedStatus = (data: ExpectedStatusRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<ExpectedStatusResponse>> => {
  return axiosInstance({
    url:'/api/v1/expected/status',
    method: 'put',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(ExpectedStatus, config)
  })
};

/** ========================= **************** InterfaceList ****************** ========================= */

/** undefined 请求参数 */
export interface InterfaceListRequest {
}

/** undefined 响应参数*/
export interface InterfaceListResponse {
      /** 列表 */
      list: InterfaceListItemTypes[];
}
/** undefined */
export const InterfaceList = (data: InterfaceListRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<InterfaceListResponse>> => {
  return axiosInstance({
    url:'/api/v1/interface/list',
    method: 'post',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(InterfaceList, config)
  })
};

/** ========================= **************** InterfaceSync ****************** ========================= */

/** undefined 请求参数 */
export interface InterfaceSyncRequest {
    /** 需要同步的 swagger 文档地址,只支持http */
    api_address: string;
    /** 文档类型 */
    type: "yaml"|"json";
}

/** undefined 响应参数*/
export interface InterfaceSyncResponse {
}
/** undefined */
export const InterfaceSync = (data: InterfaceSyncRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<InterfaceSyncResponse>> => {
  return axiosInstance({
    url:'/api/v1/interface/sync',
    method: 'post',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(InterfaceSync, config)
  })
};

/** ========================= **************** InterfaceOperation ****************** ========================= */

/** undefined 请求参数 */
export interface InterfaceOperationRequest {
    /** 请求地址 */
    api: string;
    /** 请求方法 */
    method: string;
}

/** undefined 响应参数*/
export interface InterfaceOperationResponse {
      /** http状态码 */
      status: number;
      /** 响应结果 */
      mock_response: string;
}
/** undefined */
export const InterfaceOperation = (data: InterfaceOperationRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<InterfaceOperationResponse>> => {
  return axiosInstance({
    url:'/api/v1/interface/operation',
    method: 'post',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(InterfaceOperation, config)
  })
};

/** ========================= **************** InterfaceDetail ****************** ========================= */

/** undefined 请求参数 */
export interface InterfaceDetailRequest {
    /** 接口id */
    id: string;
}

/** undefined 响应参数*/
export interface InterfaceDetailResponse {
      /** 接口id */
      id: string;
      /** 接口名 */
      name: string;
      /** 接口地址 */
      path: string;
      /** 备注信息 */
      description: string;
      /** 接口mock地址 */
      mock_url: string;
      /** 请求类型 */
      method: string;
      /** 同步的swagger对应的接口请求body。json 格式字符串 */
      request_body: string;
      /** 同步的swagger对应的接口返回内容。json 格式字符串 */
      responses: string;
      /** 同步的swagger对应的接口query请求参数。json 格式字符串 */
      parameter: string;
}
/** undefined */
export const InterfaceDetail = (data: InterfaceDetailRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<InterfaceDetailResponse>> => {
  return axiosInstance({
    url:'/api/v1/interface/detail',
    method: 'post',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(InterfaceDetail, config)
  })
};

/** ========================= **************** InterfaceEdit ****************** ========================= */

/** undefined 请求参数 */
export interface InterfaceEditRequest {
    /** 接口id */
    id: string;
    /** response_body schema,根据mock字段获取 应响应的数据。每个字段都可添加以下属性:1.max,min(代表mock数量最大最小值). 2.default（为设定值，替代mock数据） */
    schema: string;
}

/** undefined 响应参数*/
export interface InterfaceEditResponse {
}
/** undefined */
export const InterfaceEdit = (data: InterfaceEditRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<InterfaceEditResponse>> => {
  return axiosInstance({
    url:'/api/v1/interface/edit',
    method: 'put',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(InterfaceEdit, config)
  })
};

/** ========================= **************** ProjectList ****************** ========================= */

/** undefined 请求参数 */
export interface ProjectListRequest {}

/** undefined 响应参数*/
export interface ProjectListResponse {
      /** 项目列表 */
      project_list: ProjectListItemItemTypes[];
}
/** undefined */
export const ProjectList = (  config?: AxiosRequestConfig):Promise<BaseServeResponse<ProjectListResponse>> => {
  return axiosInstance({
    url:'/api/v1/project/list',
    method: 'post',
    
    
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(ProjectList, config)
  })
};

/** ========================= **************** ProjectCreate ****************** ========================= */

/** undefined 请求参数 */
export interface ProjectCreateRequest {
    /** 项目名 */
    name: string;
    /** 描述信息 */
    desc: string;
    /** 需要同步的 swagger 文档地址,只支持http */
    api_address: string;
    /** 文档类型 */
    type: "yaml"|"json";
    /** 是否开启自动同步 */
    auto_sync: boolean;
    /** 自动同步时间。单位秒 */
    auto_sync_time: number;
}

/** undefined 响应参数*/
export interface ProjectCreateResponse {
      /** undefined */
      id: number;
}
/** undefined */
export const ProjectCreate = (data: ProjectCreateRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<ProjectCreateResponse>> => {
  return axiosInstance({
    url:'/api/v1/project/create',
    method: 'post',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(ProjectCreate, config)
  })
};

/** ========================= **************** ProjectEdit ****************** ========================= */

/** undefined 请求参数 */
export interface ProjectEditRequest {
    /** 项目id */
    id: string;
    /** 项目名 */
    name: string;
    /** 描述信息 */
    desc: string;
    /** 是否开启自动同步 */
    auto_sync: boolean;
    /** 自动同步时间。单位秒 */
    auto_sync_time: number;
}

/** undefined 响应参数*/
export interface ProjectEditResponse {
      /** undefined */
      id: number;
}
/** undefined */
export const ProjectEdit = (data: ProjectEditRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<ProjectEditResponse>> => {
  return axiosInstance({
    url:'/api/v1/project/edit',
    method: 'put',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(ProjectEdit, config)
  })
};

/** ========================= **************** ProjectRemove ****************** ========================= */

/** undefined 请求参数 */
export interface ProjectRemoveRequest {
    /** 项目id */
    id: string;
}

/** undefined 响应参数*/
export interface ProjectRemoveResponse {}
/** undefined */
export const ProjectRemove = (data: ProjectRemoveRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<ProjectRemoveResponse>> => {
  return axiosInstance({
    url:'/api/v1/project/remove',
    method: 'delete',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(ProjectRemove, config)
  })
};

/** ========================= **************** UserList ****************** ========================= */

/** undefined 请求参数 */
export interface UserListRequest {
    /** 每页数目 */
    size: number;
    /** 当前页数 */
    page: number;
}

/** undefined 响应参数*/
export interface UserListResponse {
      /** undefined */
      list: UserItemTypes[];
      /** 每页数目 */
      size: number;
      /** 当前页数 */
      page: number;
      /** 总数 */
      total: number;
}
/** undefined */
export const UserList = (data: UserListRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<UserListResponse>> => {
  return axiosInstance({
    url:'/api/v1/user/list',
    method: 'post',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(UserList, config)
  })
};

/** ========================= **************** UserCreate ****************** ========================= */

/** undefined 请求参数 */
export interface UserCreateRequest {
    /** 用户名 */
    username: string;
    /** 角色id */
    role: string;
    /** 备注 */
    mark: string;
}

/** undefined 响应参数*/
export interface UserCreateResponse {
      /** 用户id */
      id: string;
}
/** undefined */
export const UserCreate = (data: UserCreateRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<UserCreateResponse>> => {
  return axiosInstance({
    url:'/api/v1/user/create',
    method: 'post',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(UserCreate, config)
  })
};

/** ========================= **************** UserEdit ****************** ========================= */

/** undefined 请求参数 */
export interface UserEditRequest {
    /** 用户id */
    id: string;
    /** 备注 */
    mark: string;
    /** 角色 */
    role: string;
}

/** undefined 响应参数*/
export interface UserEditResponse {
}
/** undefined */
export const UserEdit = (data: UserEditRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<UserEditResponse>> => {
  return axiosInstance({
    url:'/api/v1/user/edit',
    method: 'put',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(UserEdit, config)
  })
};

/** ========================= **************** UserRemove ****************** ========================= */

/** undefined 请求参数 */
export interface UserRemoveRequest {
    /** 用户id */
    id: string;
}

/** undefined 响应参数*/
export interface UserRemoveResponse {}
/** undefined */
export const UserRemove = (data: UserRemoveRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<UserRemoveResponse>> => {
  return axiosInstance({
    url:'/api/v1/user/remove',
    method: 'delete',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(UserRemove, config)
  })
};

/** ========================= **************** UserLogin ****************** ========================= */

/** undefined 请求参数 */
export interface UserLoginRequest {
    /** 用户名 */
    username: string;
    /** 登录密码 */
    password: string;
}

/** undefined 响应参数*/
export interface UserLoginResponse {
      /** 用户名 */
      username: string;
      /** 用户角色 */
      role: string;
      /** 用户id */
      uid: string;
      /** 登录令牌 */
      token: string;
}
/** undefined */
export const UserLogin = (data: UserLoginRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<UserLoginResponse>> => {
  return axiosInstance({
    url:'/api/v1/user/login',
    method: 'post',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(UserLogin, config)
  })
};

/** ========================= **************** UserLogout ****************** ========================= */

/** undefined 请求参数 */
export interface UserLogoutRequest {
    /** undefined */
    uid: string;
}

/** undefined 响应参数*/
export interface UserLogoutResponse {
      /** 用户名 */
      username: string;
      /** 用户角色 */
      role: string;
      /** 用户id */
      uid: string;
      /** 登录令牌 */
      token: string;
}
/** undefined */
export const UserLogout = (data: UserLogoutRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<UserLogoutResponse>> => {
  return axiosInstance({
    url:'/api/v1/user/logout',
    method: 'post',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(UserLogout, config)
  })
};

/** ========================= **************** UserResetPwd ****************** ========================= */

/** undefined 请求参数 */
export interface UserResetPwdRequest {
    /** undefined */
    uid: string;
}

/** undefined 响应参数*/
export interface UserResetPwdResponse {
}
/** undefined */
export const UserResetPwd = (data: UserResetPwdRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<UserResetPwdResponse>> => {
  return axiosInstance({
    url:'/api/v1/user/resetPwd',
    method: 'post',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(UserResetPwd, config)
  })
};

/** ========================= **************** UserChangepwd ****************** ========================= */

/** undefined 请求参数 */
export interface UserChangepwdRequest {
    /** undefined */
    uid: string;
    /** undefined */
    new_pwd: string;
}

/** undefined 响应参数*/
export interface UserChangepwdResponse {
}
/** undefined */
export const UserChangepwd = (data: UserChangepwdRequest,  config?: AxiosRequestConfig):Promise<BaseServeResponse<UserChangepwdResponse>> => {
  return axiosInstance({
    url:'/api/v1/user/changepwd',
    method: 'post',
    
    data,
    headers: { "Content-Type": "application/json" },
    ...InjectAbort(UserChangepwd, config)
  })
};


export interface InterfaceExpectedItemItemTypes {
            /** id */
            id: string;
            /** 模拟延迟返回时间.单位 ms */
            delay: number;
            /** 指定接口返回的具体数据 jsonstring */
            response_body: string;
            /** 期望名 */
            name: string;
            /** 编辑时间 */
            update_at: number;
}
export interface InterfaceListApiItemTypes {
            /** 接口id */
            id: string;
            /** 接口名 */
            name: string;
            /** 接口地址 */
            path: string;
}
export interface InterfaceListCategoryItemTypes {
            /** 类目id */
            category_id: string;
            /** 类目名 */
            category_name: string;
            /** 接口列表 */
            interface_list: InterfaceListApiItemTypes[];
}
export interface InterfaceListItemTypes {
            /** 项目id */
            project_id: string;
            /** 项目名称 */
            project_name: string;
            /** 是否开启同步 */
            auto_sync: boolean;
            /** 同步间隔 */
            auto_sync_time: number;
            /** 分类列表 */
            category_list: InterfaceListCategoryItemTypes[];
}
export interface ProjectListItemItemTypes {
            /** id */
            id: number;
            /** 项目名 */
            name: string;
            /** 描述 */
            desc: string;
            /** 创建时间 */
            created_at: number;
            /** 更新时间 */
            update_at: number;
            /** 是否开启自动同步 */
            auto_sync: boolean;
            /** 自动同步时间。单位秒 */
            auto_sync_time: number;
}
export interface UserItemTypes {
            /** id */
            id: string;
            /** 用户名 */
            username: string;
            /** 角色id。0管理员，1普通用户 */
            role: string;
            /** 更新时间 */
            update_at: number;
            /** 备注 */
            mark: string;
}