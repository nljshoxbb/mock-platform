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
   * /api/v1/project:
   *   get:
   *     summary: 项目列表.
   *     tags:
   *       - project
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 properties:
   *                   id:
   *                     type: integer
   *                     description: id
   *                   name:
   *                     type: string
   *                     description: 项目名
   *                   desc:
   *                     type: string
   *                     description: 描述
   *                   created_at:
   *                     type: number
   *                     description: 创建时间
   *                   update_at:
   *                     type: number
   *                     description: 更新时间
   * components:
   *   schemas:
   *     ProjectListRequest:
   *       type: object
   *     ProjectListResponse:
   *       type: object
   *       properties:
   *        name
   *     ProjectCreateRequest:
   *       type: object
   *       properties:
   *         name:
   *           type: string
   *           description: 项目名
   *         desc:
   *           type: string
   *           description: 描述信息
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
   *     ProjectDeleteRequest:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           required: true
   *           description: 项目id
   */
  router.get('/v1/project', async (ctx: Context) => {
    await initController(ctx).getList(ctx);
  });
  /**
   * @openapi
   * /api/v1/project:
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
  router.post('/v1/project', async (ctx: Context) => {
    await initController(ctx).create(ctx);
  });
  /**
   * @openapi
   * /api/v1/project:
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
  router.put('/v1/project', async (ctx: Context) => {
    await initController(ctx).edit(ctx);
  });
  /**
   * @openapi
   * /api/v1/project:
   *   delete:
   *     summary: 编辑项目.
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
  router.delete('/v1/project', async (ctx: Context) => {
    await initController(ctx).remove(ctx);
  });
}
