import InterfaceController from '@/server/controllers/expected';
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
   *     InterfaceExpectedItem:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           description: id
   *         delay:
   *           type: number
   *           description: 模拟延迟返回时间.单位 ms
   *         response_body:
   *           type: string
   *           description: 指定接口返回的具体数据 jsonstring
   *         name:
   *           type: string
   *           description: 期望名
   *         update_at:
   *           type: number
   *           description: 编辑时间
   *     InterfaceExpectedListRequest:
   *       type: object
   *       properties:
   *         interface_id:
   *           type: string
   *           description: 对应的接口id
   *           required: true
   *         size:
   *           type: number
   *           description: 每页数目
   *         page:
   *           type: number
   *           description: 页数
   *     InterfaceExpectedListResponse:
   *       type: object
   *       properties:
   *         list:
   *           type: array
   *           items:
   *             $ref : '#/components/schemas/InterfaceExpectedItem'
   *         size:
   *           type: number
   *           description: 每页数目
   *         page:
   *           type: number
   *           description: 当前页数
   *         total:
   *           type: number
   *           description: 总数
   *     InterfaceExpectedAddRequest:
   *       type: object
   *       properties:
   *         delay:
   *           type: number
   *           description: 模拟延迟返回时间.单位 ms
   *         response_body:
   *           type: string
   *           required: true
   *           description: 指定接口返回的具体数据 jsonstring
   *         name:
   *           type: string
   *           required: true
   *           description: 期望名
   *         interface_id:
   *           type: string
   *           required: true
   *           description:  id
   *     InterfaceExpectedAddResponse:
   *       type: string
   *       description: id
   *     InterfaceExpectedUpdateRequest:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           required: true
   *           description: 期望id
   *         status:
   *           type: number
   *           enum:
   *             - 0
   *             - 1
   *           description: 是否开启。0关闭，1开启
   *         delay:
   *           type: number
   *           required: true
   *           description: 模拟延迟返回时间.单位 ms
   *         response_body:
   *           type: string
   *           required: true
   *           description: 指定接口返回的具体数据 jsonstring
   *         name:
   *           type: string
   *           required: true
   *           description: 期望名
   *
   *     InterfaceExpectedUpdateResponse:
   *       type: object
   *       properties:
   *         status:
   *     InterfaceExpectedDeleteRequest:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           description: 期望id
   *     InterfaceExpectedDeleteResponse:
   *       type: object
   *     InterfaceExpectedStatusRequest:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           description: 期望id
   *         status:
   *           type: boolean
   *           description: 开启状态
   *     InterfaceExpectedStatusResponse:
   *       type: object
   *
   * /api/v1/expected/list:
   *   post:
   *     summary: 期望列表
   *     tags:
   *       - expected
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InterfaceExpectedListRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/InterfaceExpectedListResponse'
   */
  router.post('/v1/expected/list', async (ctx: Context) => {
    await initController(ctx).getList(ctx);
  });
  /**
   * @openapi
   * /api/v1/expected/create:
   *   post:
   *     summary: 新增期望
   *     tags:
   *       - expected
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InterfaceExpectedAddRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/InterfaceExpectedAddResponse'
   */
  router.post('/v1/expected/create', async (ctx: Context) => {
    await initController(ctx).create(ctx);
  });
  /**
   * @openapi
   * /api/v1/expected/edit:
   *   put:
   *     summary: 更新期望
   *     tags:
   *       - expected
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InterfaceExpectedUpdateRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/InterfaceExpectedUpdateResponse'
   */
  router.put('/v1/expected/edit', async (ctx: Context) => {
    await initController(ctx).edit(ctx);
  });
  /**
   * @openapi
   * /api/v1/expected/remove:
   *   delete:
   *     summary: 删除期望
   *     tags:
   *       - expected
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InterfaceExpectedDeleteRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/InterfaceExpectedDeleteResponse'
   */
  router.delete('/v1/expected/remove', async (ctx: Context) => {
    await initController(ctx).remove(ctx);
  });
  /**
   * @openapi
   * /api/v1/expected/status:
   *   put:
   *     summary: 开启或关闭期望
   *     tags:
   *       - expected
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InterfaceExpectedStatusRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/InterfaceExpectedStatusResponse'
   */
  router.put('/v1/expected/status', async (ctx: Context) => {
    await initController(ctx).updateStatus(ctx);
  });
}
