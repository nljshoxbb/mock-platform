import InterfaceController from '@/server/controllers/interface';
import { Context } from 'koa';
import KoaRouter from 'koa-router';

const initController = (ctx) => {
  return new InterfaceController(ctx);
};

export default function interfaceRouter(router: KoaRouter) {
  /**
   * @openapi
   * components:
   *   schemas:
   *     InterfaceSyncRequest:
   *        type: object
   *        properties:
   *          api_address:
   *            type: string
   *            description: 需要同步的 swagger 文档地址,只支持http
   *          type:
   *            type: string
   *            enum:
   *              - yaml
   *              - json
   *            description: 文档类型
   *     InterfaceSyncResponse:
   *       type: object
   *       properties:
   *     InterfaceDetail:
   *        type: object
   *        properties:
   *          id:
   *            type: string
   *            description: 接口id
   *          name:
   *            type: string
   *            description: 接口名
   *          path:
   *            type: string
   *            description: 接口地址
   *          description:
   *            type: string
   *            description: 备注信息
   *          mock_url:
   *            type: string
   *            description: 接口mock地址
   *          method:
   *            type: string
   *            description: 请求类型
   *          request_body:
   *            type: string
   *            description: 同步的swagger对应的接口请求body。json 格式字符串
   *          responses:
   *            type: string
   *            description: 同步的swagger对应的接口返回内容。json 格式字符串
   *          parameters:
   *            type: string
   *            description: 同步的swagger对应的接口query请求参数。json 格式字符串
   *          proxy:
   *            type: boolean
   *            description: 是否走代理
   *          auto_proxy:
   *            type: boolean
   *            description: 项目是否开启了代理
   *          auto_proxy_url:
   *            type: string
   *            description: 开启代理代理地址
   *     Category:
   *       type: object
   *       properties:
   *         id:
   *            type: number
   *            description: 类目id
   *         name:
   *             type: string
   *             description: 类目名
   *         interface_list:
   *             type: string
   *             description: api列表
   *     InterfaceListRequest:
   *       type: object
   *       properties:
   *     InterfaceListApi:
   *       type: object
   *       description: iterface列表 api 详情
   *       properties:
   *         id:
   *           type: string
   *           description: 接口id
   *         name:
   *           type: string
   *           description: 接口名
   *         path:
   *           type: string
   *           description: 接口地址
   *         proxy:
   *           type: boolean
   *           description: 是否走代理
   *     InterfaceListCategory:
   *       type: object
   *       properties:
   *         category_id:
   *           type: string
   *           description: 类目id
   *         category_name:
   *           type: string
   *           description: 类目名
   *         interface_list:
   *           type: array
   *           items:
   *             $ref: "#/components/schemas/InterfaceListApi"
   *           description: 接口列表
   *     InterfaceList:
   *       type: object
   *       properties:
   *         api_address:
   *           type: string
   *           description: 同步的文档地址
   *         project_id:
   *           type: string
   *           description: 项目id
   *         project_name:
   *            type: string
   *            description: 项目名称
   *         auto_sync:
   *           type: boolean
   *           description: 是否开启同步
   *         auto_sync_time:
   *           type: number
   *           description: 同步间隔
   *         type:
   *           type: string
   *           description: 同步文件类型
   *         category_list:
   *            type: array
   *            items:
   *              $ref: '#/components/schemas/InterfaceListCategory'
   *            description: "分类列表"
   *     InterfaceListResponse:
   *       type: object
   *       properties:
   *         list:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/InterfaceList'
   *           description: "列表"
   *       description: 详情
   *     InterfaceDeleteRequest:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           required: true
   *           description: 项目id
   *     InterfaceOperationRequest:
   *       type: object
   *       properties:
   *         api:
   *           type: string
   *           required: true
   *           description: 请求地址, 格式为/mock/project_id/api地址
   *         method:
   *           type: string
   *           required: true
   *           description: 请求方法
   *     InterfaceOperationResponse:
   *       type: object
   *     InterfaceCreateResponse:
   *       type: object
   *       properties:
   *     InterfaceDetailRequest:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           description: 接口id
   *     InterfaceUpdateResponse:
   *       tyoe: object
   *       properties:
   *     InterfaceFlatListRequest:
   *       type: object
   *     InterfaceFlatListItem:
   *       type: object
   *       properties:
   *         _id:
   *           type: string
   *           description: 接口id
   *         path:
   *           type: string
   *           description: 接口地址
   *         category_id:
   *           type: string
   *           description: 分类id
   *         project_id:
   *           type: string
   *           description: 项目id
   *         summary:
   *           type: string
   *           description: 接口描述
   *     InterfaceFlatListResponse:
   *       type: object
   *       properties:
   *         list:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/InterfaceFlatListItem'
   *           description: "列表"
   *     InterfaceEditProxyRequest:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           description: 接口id
   *         proxy:
   *           type: boolean
   *           description: 是否开启代理
   *     InterfaceEditProxyResponse:
   *       type: object
   * /api/v1/interface/list:
   *   post:
   *     summary: 接口列表.
   *     tags:
   *       - interface
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InterfaceListRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/InterfaceListResponse'
   */
  router.post('/v1/interface/list', async (ctx: Context) => {
    await initController(ctx).list();
  });
  /**
   * @openapi
   * /api/v1/interface/sync:
   *   post:
   *     summary: 同步接口数据.
   *     tags:
   *       - interface
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InterfaceSyncRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/InterfaceSyncResponse'
   */
  router.post('/v1/interface/sync', async (ctx: Context) => {
    await initController(ctx).syncData();
  });
  /**
   * @openapi
   * /api/v1/interface/operation:
   *   post:
   *     summary: 调用mock接口，检查返回的mock数据是否设置正确.
   *     tags:
   *       - interface
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InterfaceOperationRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/InterfaceOperationResponse'
   */
  router.post('/v1/interface/operation', async (ctx: Context) => {
    await initController(ctx).operation();
  });
  /**
   * @openapi
   * /api/v1/interface/detail:
   *   post:
   *     summary: 接口详情
   *     tags:
   *       - interface
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InterfaceDetailRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/InterfaceDetail'
   */
  router.post('/v1/interface/detail', async (ctx: Context) => {
    await initController(ctx).detail();
  });
  /**
   * @openapi
   * components:
   *   schemas:
   *     InterfaceUpdateRequest:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           description: 接口id
   *         responses:
   *           type: string
   *           description: response_body ,根据字段获取应响应的mockl数据。每个字段都可添加以下属性:1.如果该字段为数组类型，则可以添加max,min属性(代表mock数量最大最小值). 2.所有字段都可添加value属性（为编辑的值）
   *
   * /api/v1/interface/edit:
   *   put:
   *     summary: 编辑接口mock字段
   *     tags:
   *       - interface
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InterfaceUpdateRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/InterfaceUpdateResponse'
   */
  router.put('/v1/interface/edit', async (ctx: Context) => {
    await initController(ctx).edit();
  });
  /**
   * @openapi
   * /api/v1/interface/flatlist:
   *   post:
   *     summary: 接口列表.
   *     tags:
   *       - interface
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InterfaceFlatListRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/InterfaceFlatListResponse'
   */
  router.post('/v1/interface/flatlist', async (ctx: Context) => {
    await initController(ctx).flatlist();
  });
  /**
   * @openapi
   * /api/v1/interface/edit_proxy:
   *   post:
   *     summary: 针对此接口开启代理
   *     tags:
   *       - interface
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InterfaceEditProxyRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/InterfaceEditProxyResponse'
   */
  router.post('/v1/interface/edit_proxy', async (ctx: Context) => {
    await initController(ctx).editProxy();
  });
}
