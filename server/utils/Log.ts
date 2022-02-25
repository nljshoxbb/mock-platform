import chalk from 'chalk';

class LogC {
  private set() {}

  public info(msg: string) {
    console.info(chalk.blue(msg));
  }

  public error(msg: string) {
    console.log(chalk.red(msg));
  }

  public warning(msg: string) {
    console.log(chalk.yellow(msg));
  }
}

const Log = new LogC();

export default Log;
