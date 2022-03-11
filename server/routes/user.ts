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
   *     User:
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
   *           description: 角色id。0管理员，1普通用户
   *         update_at:
   *           type: number
   *           description: 更新时间
   *         mark:
   *           type: string
   *           description: 备注
   *     UserListResponse:
   *       type: object
   *       properties:
   *         list:
   *           type: array
   *           items:
   *             $ref : '#/components/schemas/User'
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
   *         id:
   *           type: string
   *           required: true
   *           description: 用户id
   *         mark:
   *           type: string
   *           description: 备注
   *         role:
   *           type: string
   *           description: 角色
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
   *         token:
   *           type: string
   *           description: 登录令牌
   *     UserLogoutRequest:
   *       type: object
   *       properties:
   *         uid:
   *           type: string
   *           required: true
   *     UserResetpwdRequest:
   *       type: object
   *       properties:
   *         uid:
   *           type: string
   *           required: true
   *     UserResetpwdResponse:
   *       type: object
   *     UserChangepwdRequest:
   *       type: object
   *       properties:
   *         uid:
   *           type: string
   *           required: true
   *         old_pwd:
   *           type: string
   *           required: true
   *         new_pwd:
   *           type: string
   *           required: true
   *     UserChangepwdResponse:
   *       type: object
   *
   *
   * /api/v1/user/list:
   *   post:
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
  router.post('/v1/user/list', async (ctx: Context) => {
    await initController(ctx).getList();
  });
  /**
   * @openapi
   * /api/v1/user/create:
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
  router.post('/v1/user/create', async (ctx: Context) => {
    await initController(ctx).create();
  });
  /**
   * @openapi
   * /api/v1/user/edit:
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
  router.put('/v1/user/edit', async (ctx: Context) => {
    await initController(ctx).edit();
  });
  /**
   * @openapi
   * /api/v1/user/remove:
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
  router.delete('/v1/user/remove', async (ctx: Context) => {
    await initController(ctx).remove();
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
    await initController(ctx).login();
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
    await initController(ctx).login();
  });
  /**
   * @openapi
   * /api/v1/user/resetPwd:
   *   post:
   *     summary: 重置密码.
   *     tags:
   *       - user
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserResetpwdRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/UserResetpwdResponse'
   */
  router.post('/v1/user/resetpwd', async (ctx: Context) => {
    await initController(ctx).resetPwd();
  });
  /**
   * @openapi
   * /api/v1/user/changepwd:
   *   post:
   *     summary: 修改密码.
   *     tags:
   *       - user
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserChangepwdRequest'
   *     responses:
   *       200:
   *         description: 返回结果
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/UserChangepwdResponse'
   */
  router.post('/v1/user/changepwd', async (ctx: Context) => {
    await initController(ctx).changepwd();
  });
}
