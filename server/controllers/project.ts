import BaseController from '@/server/controllers/base';
import ProjectModel from '@/server/models/project';
import { Context } from 'koa';
import { isEmpty } from 'lodash';

import ExpectedModel from '../models/expected';
import InterfaceModel from '../models/interface';
import Log from '../utils/Log';
import { getModelInstance, objectIdToString, responseBody } from '../utils/utils';
import InterfaceController from './interface';

type Timer = ReturnType<typeof setInterval>;

/** 10分钟同步一次 */
const DEFAULT_SYNC_TIME = 60 * 5;

const timerMap: Map<string, Timer> = new Map();

export default class ProjectController extends BaseController {
  model: ProjectModel;
  interfaceMode: InterfaceModel;
  expectedMode: ExpectedModel;
  interfaceController: InterfaceController;
  constructor(ctx: Context) {
    super(ctx);
    this.model = getModelInstance<ProjectModel>(ProjectModel);
    this.interfaceMode = getModelInstance<InterfaceModel>(InterfaceModel);
    this.expectedMode = getModelInstance<ExpectedModel>(ExpectedModel);
    this.interfaceController = new InterfaceController(ctx);
    /** 检测是否用同步任务，重启 */
    const recoveryTask = async () => {
      const data = await this.model.get({ auto_sync: true });
      if (data) {
        data.forEach((i) => {
          const projectId = objectIdToString(i._id);
          this.handleTimer(projectId, i.auto_sync, i.auto_sync_time, async () => {
            await this.interfaceController.syncByPorjectId(projectId, i.api_address, i.type);
          });
        });
      }
    };

    recoveryTask();
  }

  private async handleTimer(id, autoSync, autoSyncTime, cb) {
    if (autoSync) {
      const timer = setInterval(() => {
        cb();
      }, autoSyncTime * 1000);

      if (timerMap.get(id)) {
        const timer = timerMap.get(id) as any;
        clearInterval(timer);
      }

      timerMap.set(id, timer);
    } else {
      const timer = timerMap.get(id) as any;
      clearInterval(timer);
    }
  }

  public async create() {
    try {
      const { name, desc, api_address, type, auto_sync, auto_sync_time = DEFAULT_SYNC_TIME, auto_proxy_url, auto_proxy, proxy_all } = this.ctx.request.body;
      const uid = await this.getUid();

      const count = await this.model.checkNameRepeat(name, uid);
      if (isEmpty(name) || isEmpty(api_address) || isEmpty(type)) {
        return (this.ctx.body = responseBody(null, 400, '参数错误'));
      }

      if (count > 0) {
        return (this.ctx.body = responseBody(null, 400, '项目名重复'));
      }

      if (auto_sync && (auto_sync_time === null || auto_sync_time < 60)) {
        return (this.ctx.body = responseBody(null, 400, '同步时间不能小于1分钟'));
      }

      /** 是否开启事务，如果同步数据出错则添加不成功 */
      const res = await this.model.create({
        name,
        desc,
        uid,
        api_address,
        auto_sync,
        auto_sync_time,
        type,
        auto_proxy_url,
        auto_proxy,
        proxy_all
      });

      const porjectId = objectIdToString(res._id);

      if (res) {
        await this.interfaceController.syncByPorjectId(porjectId, api_address, type, proxy_all);

        this.handleTimer(porjectId, auto_sync, auto_sync_time, async () => {
          await this.interfaceController.syncByPorjectId(porjectId, api_address, type);
        });
      }

      return (this.ctx.body = responseBody({ project_id: objectIdToString(res._id) }, 200, '成功'));
    } catch (error) {
      throw Error(error);
    }
  }

  public async getList() {
    try {
      const params = this.ctx.request.body;
      const uid = await this.getUid();

      const data = await this.model.get({ ...params, uid });
      const list = data.map((i) => {
        return {
          id: i._id,
          name: i.name,
          desc: i.desc,
          soft_del: i.soft_del,
          created_at: i.created_at,
          updated_at: i.update_at
        };
      });
      return (this.ctx.body = responseBody(list, 200));
    } catch (error) {
      throw Error(error);
    }
  }

  public async edit() {
    try {
      const { id, name, desc, api_address, auto_sync, auto_sync_time, type, auto_proxy_url, auto_proxy, update_interface, proxy_all } = this.ctx.request.body;
      const uid = await this.getUid();
      if (!id) {
        return (this.ctx.body = responseBody(null, 400, '缺少id'));
      }

      const isExist = await this.model.isExist(id);

      if (!isExist) {
        return (this.ctx.body = responseBody(null, 400, 'id不存在'));
      }

      if (!type) {
        return (this.ctx.body = responseBody(null, 400, '确实类型type'));
      }

      const apiDoc = api_address || isExist.api_address;

      // console.log(id, apiDoc, type);
      /** 地址解析失败 */
      console.log(update_interface);
      if (update_interface) {
        const result = await this.interfaceController.syncByPorjectId(id, apiDoc, type, proxy_all);
        if (result === 'addressError') {
          return (this.ctx.body = responseBody(null, 400, '地址错误,解析失败'));
        }
      }

      // if (auto_sync && (auto_sync_time === null || auto_sync_time < 60)) {
      //   return (this.ctx.body = responseBody(null, 400, '同步时间不能小于1分钟'));
      // }
      // console.log(`auto_sync --------- ${auto_sync}`);
      /** 更新同时 同步新的接口文档地址；重新开启定时同步任务 */
      // this.handleTimer(id, auto_sync, auto_sync_time, async () => {
      //   await this.interfaceController.syncByPorjectId(id, apiDoc, type);
      // });

      await this.model.update(id, {
        name,
        desc,
        uid,
        api_address: apiDoc,
        auto_sync,
        auto_sync_time,
        auto_proxy_url,
        auto_proxy,
        type
      });
      this.ctx.body = responseBody(null, 200, '更新成功');
    } catch (error) {
      throw Error(error);
    }
  }

  public async remove() {
    try {
      const { id } = this.ctx.request.body;

      const isExist = await this.model.isExist(id);
      if (!isExist) {
        return (this.ctx.body = responseBody(null, 400, 'id不存在'));
      }
      await this.model.remove(id);
      /** 删除接口、expected */
      await this.interfaceMode.batchRemove(id);
      await this.expectedMode.batchRemove(id);
      this.ctx.body = responseBody(null, 200, '操作成功');
    } catch (error) {
      throw Error(error);
    }
  }
}
