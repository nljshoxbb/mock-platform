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
   *         size:
   *           type: number
   *           description: 每页数目
   *         page:
   *           type: number
   *           description: 页数
   *     InterfaceExpectedListResponse:
   *       type: object
   *       properties:
   *         data:
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
   *
   *
   * /api/v1/expected:
   *   get:
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
  router.get('/v1/expected', async (ctx: Context) => {
    await initController(ctx).list(ctx);
  });
  /**
   * @openapi
   * /api/v1/expected:
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
  router.post('/v1/expected', async (ctx: Context) => {
    await initController(ctx).list(ctx);
  });
  /**
   * @openapi
   * /api/v1/expected:
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
  router.put('/v1/expected', async (ctx: Context) => {
    await initController(ctx).list(ctx);
  });
  /**
   * @openapi
   * /api/v1/expected:
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
  router.delete('/v1/expected', async (ctx: Context) => {
    await initController(ctx).list(ctx);
  });
}
