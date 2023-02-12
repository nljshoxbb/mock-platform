import { promises as fsPromises } from 'fs';
import path from 'path';

import BaseController from '@/server/controllers/base';
import SouceMapModel from '@/server/models/sourceMap';
import { Context } from 'koa';
import { isEmpty } from 'lodash';
import sourceMap from 'source-map-js';

import { getModelInstance, responseBody } from '../utils/utils';

export default class SourceMapController extends BaseController {
  model: SouceMapModel;
  constructor(ctx: Context) {
    super(ctx);
    this.model = getModelInstance<SouceMapModel>(SouceMapModel);
  }

  public async create() {
    try {
      // @ts-expect-error
      const { filepath, originalFilename } = this.ctx.request.files.file;
      const { project, version, buildNumber } = this.ctx.request.body;

      console.log(filepath, originalFilename);

      const count = await this.model.count({ filename: originalFilename });
      if (count > 0) {
        return (this.ctx.body = responseBody(null, 400, '重复添加'));
      }
      const content = await fsPromises.readFile(filepath, 'utf-8');
      await this.model.create({ content, version, project, buildNumber, file: originalFilename });
      return (this.ctx.body = responseBody({}, 200, '成功'));
    } catch (error) {
      throw Error(error);
    }
  }

  private async getCode(rawSourceMap, line, column) {
    const { sourcesContent, sources } = rawSourceMap;
    const consumer = await new sourceMap.SourceMapConsumer(rawSourceMap);
    // 输入错误的发生行和列，可以得到源码对应原始文件、行和列信息
    const result = consumer.originalPositionFor({
      line: Number(line),
      column: Number(column)
    });
    result.source = result.source.replace('src', './src');
    console.log(result);
    // 从sourcesContent得到具体的源码信息
    const code = sourcesContent[sources.indexOf(result.source)];
    return { code, result };
  }

  public async view() {
    try {
      // @ts-expect-error
      const { filepath } = this.ctx.request.files.file;

      const sourceMapcontent = (await fsPromises.readFile(filepath, 'utf-8')) as any;
      if (sourceMapcontent) {
        const { version, content, project } = JSON.parse(sourceMapcontent);
        const target = content[content.length - 1];
        const file = path.basename(target.fileName);
        const fileName = file.split('?')[0] + '.map';
        // console.log(sourceMapcontent, fileName, version, project);
        const res = await this.model.get({ version, project, file: fileName });
        if (res[0]) {
          const { content, created_at } = res[0];
          const { code, result } = await this.getCode(JSON.parse(content), target.line, target.column);
          return (this.ctx.body = responseBody(
            {
              project,
              version,
              filepath: target.fileName,
              fileMap: fileName,
              result,
              created_at,
              content: code
            },
            200,
            '成功'
          ));
        }
      }
    } catch (error) {
      throw Error(error);
    }
  }
}
