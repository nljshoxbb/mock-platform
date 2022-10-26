import Path from 'path';

import chalk from 'chalk';
import log4js from 'log4js';

log4js.addLayout('json', function (config) {
  return function (logEvent) {
    return JSON.stringify(logEvent) + config.separator;
  };
});

const dirName = 'info.log';

const _path = Path.resolve(__dirname, `../logs/${dirName}`);
log4js.configure({
  // replaceConsole: true,
  appenders: {
    log: {
      type: 'dateFile',
      filename: _path,
      encoding: 'utf-8',
      pattern: 'yyyy-MM-dd',
      // 回滚旧的日志文件时，保证以 .log 结尾 （只有在 alwaysIncludePattern 为 false 生效）
      keepFileExt: true,
      // 输出的日志文件名是都始终包含 pattern 日期结尾
      alwaysIncludePattern: true,
      layout: { type: 'json', separator: ',' }
    },
    console: { type: 'console' }
  },
  categories: { default: { appenders: ['log', 'console'], level: 'debug' } }
});

const logger = log4js.getLogger('log');
class LogC {
  private set() {}

  public info(msg: any) {
    console.log(chalk.blue(msg));
    logger.info(msg);
    logger.debug(msg);
  }

  public error(msg: any) {
    console.log(chalk.red(msg));
  }

  public warning(msg: any) {
    console.log(chalk.yellow(msg));
  }
}

// const Log = new LogC();

export default logger;
