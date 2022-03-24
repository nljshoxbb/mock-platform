import chalk from 'chalk';

class LogC {
  private set() {}

  public info(msg: any) {
    console.log(chalk.blue(msg));
  }

  public error(msg: any) {
    console.log(chalk.red(msg));
  }

  public warning(msg: any) {
    console.log(chalk.yellow(msg));
  }
}

const Log = new LogC();

export default Log;
