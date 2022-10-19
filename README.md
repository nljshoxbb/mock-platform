# 接口mock平台

## 前端开发

1. `cd client`
2. `yarn`
3. `yarn start`

## 后端开发

先安装mongodb,数据库配置文件在 `server/config.ts`db中

1. `yarn`
2. `yarn init-db`
3. `yarn dev-server`

### 接口文档地址 

localhost:3888/swagger

### yaml地址

localhost:3888/doc/swagger

## 部署

### 前端

`cd client`

`yarn`

`yarn build`

### docker
`docker-compose up -d --build`