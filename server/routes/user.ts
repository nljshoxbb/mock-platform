import UserController from '@/server/controllers/user';
import { Context } from 'koa';
import Router from 'koa-router';

const initController = (ctx) => {
  return new UserController(ctx);
};

export default function userRouter(router: Router) {
  /**
   * @openapi
   * components:
   *   schemas:
   *     UserListRequest:
   *       type: object
   *       properties:
   *         size:
   *           type: number
   *           description: 每页数目
   *         page:
   *           type: number
   *           description: 当前页数
   *     UserItem:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           description: id
   *         username:
   *           type: string
   *           description: 用户名
   *         role:
   *           type: string
   *           description: 角色id
   *         update_at:
   *           type: number
   *           description: 更新时间
   *         mark:
   *           type: string
   *           description: 备注
   *     UserListResponse:
   *       type: object
   *       properties:
   *         data:
   *           type: array
   *           items:
   *             $ref : '#/components/schemas/UserItem'
   *         size:
   *           type: number
   *           description: 每页数目
   *         page:
   *           type: number
   *           description: 当前页数
   *         total:
   *           type: number
   *           description: 总数
   *     UserCreateRequest:
   *       type: object
   *       properties:
   *         username:
   *           type: string
   *           description: 用户名
   *           required: true
   *         role:
   *           type: string
   *           description: 角色id
   *           required: true
   *         mark:
   *           type: string
   *           description: 备注
   *     UserCreateResponse:
   *        type: object
   *        properties:
   *          id:
   *            type: string
   *            description: 用户id
   *     UserEditRequest:
   *       type: object
   *       properties:
   *         uid:
   *           type: string
   *           required: true
   *           description: 用户id
   *         username:
   *           type: string
   *           description: 用户名
   *         mark:
   *           type: string
   *           description: 备注
   *     UserEditResponse:
   *       type: object
   *     UserDeleteRequest:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           required: true
   *           description: 用户id
   *     UserLoginRequest:
   *       type: object
   *       properties:
   *         username:
   *           type: string
   *           description: 用户名
   *         password:
   *           type: string
   *           description: 登录密码
   *
   *     UserLoginResponse:
   *       type: object
   *       properties:
   *         username:
   *           type: string
   *           description: 用户名
   *         role:
   *           type: string
   *           description: 用户角色
   *           enum:
   *             - admin
   *             - user
   *         uid:
   *           type: string
   *           description: 用户id
   *
   *     UserLogoutRequest:
   *       type: object
   *       properties:
   *         uid:
   *           type: string
   *
   *
   * /api/v1/user:
   *   get:
   *     summary: 用户列表.
   *     tags:
   *       - user
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserListRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserListResponse'
   */
  router.get('/v1/user', async (ctx: Context) => {
    await initController(ctx).getList(ctx);
  });
  /**
   * @openapi
   * /api/v1/user:
   *   post:
   *     summary: 创建用户.
   *     tags:
   *       - user
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserCreateRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/UserCreateResponse'
   */
  router.post('/v1/user', async (ctx: Context) => {
    await initController(ctx).create(ctx);
  });
  /**
   * @openapi
   * /api/v1/user:
   *   put:
   *     summary: 编辑用户.
   *     tags:
   *       - user
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserEditRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/UserEditResponse'
   */
  router.put('/v1/user', async (ctx: Context) => {
    await initController(ctx).edit(ctx);
  });
  /**
   * @openapi
   * /api/v1/user:
   *   delete:
   *     summary: 删除用户.
   *     tags:
   *       - user
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserDeleteRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   */
  router.delete('/v1/user', async (ctx: Context) => {
    await initController(ctx).remove(ctx);
  });
  /**
   * @openapi
   * /api/v1/user/login:
   *   post:
   *     summary: 用户登录.
   *     tags:
   *       - user
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserLoginRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/UserLoginResponse'
   */
  router.post('/v1/user/login', async (ctx: Context) => {
    await initController(ctx).login(ctx);
  });
  /**
   * @openapi
   * /api/v1/user/logout:
   *   post:
   *     summary: 退出登录.
   *     tags:
   *       - user
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserLogoutRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/UserLoginResponse'
   */
  router.post('/v1/user/logout', async (ctx: Context) => {
    await initController(ctx).login(ctx);
  });
}
