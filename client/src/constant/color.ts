export enum MethodsColorEnum {
  'post' = '#49cc90',
  'put' = '#fca130',
  'delete' = '#f93e3e',
  'get' = '#61affe'
}

export enum ProxyColorEnum {
  'close' = 'gray',
  'open' = '#61affe'
}

export type MethodsColorEnumType = keyof typeof MethodsColorEnum;
