import ProjectController from '@/server/controllers/project';
import { Context } from 'koa';
import Router from 'koa-router';

const initController = (ctx) => {
  return new ProjectController(ctx);
};

export default function projectRouter(router: Router) {
  /**
   * @openapi
   *
   * /api/v1/project/list:
   *   post:
   *     summary: 项目列表.
   *     tags:
   *       - project
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProjectListResponse'
   * components:
   *   schemas:
   *     ProjectRequest:
   *       type: object
   *       properties:
   *     ProjectListItem:
   *       type: object
   *       properties:
   *         id:
   *           type: integer
   *           description: id
   *         name:
   *           type: string
   *           description: 项目名
   *         desc:
   *           type: string
   *           description: 描述
   *         created_at:
   *           type: number
   *           description: 创建时间
   *         update_at:
   *           type: number
   *           description: 更新时间
   *         auto_sync:
   *           type: boolean
   *           description: 是否开启自动同步
   *         auto_sync_time:
   *           type: number
   *           description: 自动同步时间。单位秒
   *     ProjectListResponse:
   *       type: object
   *       properties:
   *         project_list:
   *           type: array
   *           items:
   *             $ref : '#/components/schemas/ProjectListItem'
   *           description: 项目列表
   *     ProjectCreateRequest:
   *       type: object
   *       properties:
   *         name:
   *           type: string
   *           description: 项目名
   *           required: true
   *         desc:
   *           type: string
   *           description: 描述信息
   *         api_address:
   *           type: string
   *           description: 需要同步的 swagger 文档地址,只支持http
   *           required: true
   *         type:
   *           type: string
   *           enum:
   *             - yaml
   *             - json
   *           description: 文档类型
   *           required: true
   *         auto_sync:
   *           type: boolean
   *           description: 是否开启自动同步
   *         auto_sync_time:
   *           type: number
   *           description: 自动同步时间。单位秒
   *         auto_proxy_url:
   *           type: string
   *           description: 优先代理地址
   *         auto_proxy:
   *           type: boolean
   *           description: 优先代理地址开启
   *         proxy_all:
   *           type: boolean
   *           description: 是否全部接口开启代理
   *     ProjectCreateResponse:
   *        type: object
   *        properties:
   *              id:
   *                type: integer
   *     ProjectEditRequest:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           required: true
   *           description: 项目id
   *         name:
   *           type: string
   *           description: 项目名
   *         desc:
   *           type: string
   *           description: 描述信息
   *         auto_sync:
   *           type: boolean
   *           description: 是否开启自动同步
   *         auto_sync_time:
   *           type: number
   *           description: 自动同步时间。单位秒
   *         update_interface:
   *           type: boolean
   *           description: 是否更新接口
   *     ProjectDeleteRequest:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           required: true
   *           description: 项目id
   */
  router.post('/v1/project/list', async (ctx: Context) => {
    await initController(ctx).getList();
  });
  /**
   * @openapi
   * /api/v1/project/create:
   *   post:
   *     summary: 创建项目.
   *     tags:
   *       - project
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProjectCreateRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/ProjectCreateResponse'
   */
  router.post('/v1/project/create', async (ctx: Context) => {
    await initController(ctx).create();
  });
  /**
   * @openapi
   * /api/v1/project/edit:
   *   put:
   *     summary: 编辑项目.
   *     tags:
   *       - project
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProjectEditRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/ProjectCreateResponse'
   */
  router.put('/v1/project/edit', async (ctx: Context) => {
    await initController(ctx).edit();
  });
  /**
   * @openapi
   * /api/v1/project/remove:
   *   delete:
   *     summary: 删除项目.
   *     tags:
   *       - project
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProjectDeleteRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   */
  router.delete('/v1/project/remove', async (ctx: Context) => {
    await initController(ctx).remove();
  });
}
