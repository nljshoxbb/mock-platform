import * as interfaceController from '@/server/controllers/project';
import KoaRouter from 'koa-router';

// *     InterfaceItem:
// *       type: object
// *       properties:
// *         id:
// *           type: number
// *           descriptions: 接口id
// *         name:
// *           type: string
// *           descriptions: 接口名称
// *         path:
// *           type: string
// *           descriptions: 接口地址
// *         requestRaw:
// *           type: string
// *           descriptions: 同步的swagger对应的接口请求内容。json 格式字符串
// *         responseRaw:
// *           type: string
// *           descriptions: 同步的swagger对应的接口返回内容。json 格式字符串
// *     CategoryItem:
// *       type: object
// *       properties:
// *         id:
// *           type: number
// *           descriptions: 类目id
// *         name:
// *           type: string
// *           descriptions: 类目名
// *         apiList:
// *           type: array
// *           items:
// *             $ref: '#/components/schemas/InterfaceItem'
// *     InterfaceOperationRequest:
// *       type: object
// *       properties:
// *         id:
// *           type: number
// *           description: 接口id
// *         params:
// *           type: string
// *           description: 接口参数
// *     InterfaceOperationResponse:
// *        type: object
// *        properties:
// *          id:
// *          type: integer
// *     InterfaceListRequest:
// *     InterfaceListResponseProjectItem:
// *       type: object
// *       properties:
// *         project_id:
// *           type: number
// *           description: 项目id
// *         project_name:
// *           type: string
// *           description: 项目名称
// *         categoryList:
// *           type: array
// *           items:
// *             $ref: '#/components/schemas/CategoryItem'

export default function interfaceRouter(router: KoaRouter) {
  /**
   * @openapi
   * components:
   *   schemas:
   *     InterfaceListRequest:
   *     InterfaceListResponse:
   *       type: object
   *       properties:
   *         projectList:
   *           type: string
   *     InterfaceDeleteRequest:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           required: true
   *           description: 项目id
   *
   *
   *
   *
   * /api/v1/interface:
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
  router.get('/v1/interface/list', interfaceController.List);
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
   *             $ref: '#/components/schemas/interfaceCreateRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/InterfaceListResponse'
   */
  router.post('/v1/interface/sync');
  /**
   * @openapi
   * /api/v1/interface/operation:
   *   post:
   *     summary: 运行接口.
   *     tags:
   *       - interface
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/interfaceOperationRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/interfaceCreateResponse'
   */
  router.get('/v1/interface/operation');
}
