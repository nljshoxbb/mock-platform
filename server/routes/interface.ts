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
   *          response:
   *            type: string
   *            description: 同步的swagger对应的接口返回内容。json 格式字符串
   *          parameter:
   *            type: string
   *            description: 同步的swagger对应的接口query请求参数。json 格式字符串

   *     CategoryItem:
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
   *         project_id:
   *           type: number
   *           descriptions: 项目id
   *     InterfaceListResponse:
   *       type: array
   *       items:
   *         type: object
   *         properties:
   *           project_id:
   *             type: number
   *             description: 项目id
   *           project_name:
   *              type: string
   *              description: 项目名称
   *           category_list:
   *              type: array
   *              items:
   *                type: object
   *                properties:
   *                   category_id:
   *                      type: string
   *                      description: 类目id
   *                   category_name:
   *                      type: string
   *                      description: 类目名
   *                   interface_list:
   *                      type: array
   *                      items:
   *                        type: object
   *                        properties:
   *                          id:
   *                            type: string
   *                            description: 接口id
   *                          name:
   *                            type: string
   *                            description: 接口名
   *                          path:
   *                            type: string
   *                            description: 接口地址
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
   *           description: 请求地址
   *     InterfaceOperationResponse:
   *       type: object
   *       properties:
   *           status:
   *             type: number
   *             description: http状态码
   *           mock_response:
   *             type: string
   *             description: 响应结果
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
   *
   * /api/v1/interface/list:
   *   get:
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
  router.get('/v1/interface/list', async (ctx: Context) => {
    await initController(ctx).list(ctx);
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
    await initController(ctx).syncData(ctx);
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
  router.get('/v1/interface/operation');
  /**
   * @openapi
   * /api/v1/interface/detail:
   *   get:
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
  router.get('/v1/interface/detail', async (ctx: Context) => {
    await initController(ctx).detail(ctx);
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
   *         schema:
   *           type: string
   *           description: response_body schema,根据mock字段获取 应响应的数据
   *
   * /api/v1/interface:
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
  router.put('/v1/interface', async (ctx: Context) => {
    await initController(ctx).detail(ctx);
  });
}
