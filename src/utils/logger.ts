/**
 * 日志类
 */
export class Logger {
  private debug = false;

  constructor(debug?: boolean) {
    this.debug = debug ?? false;
  }

  info(msg: string) {
    if (this.debug) {
      console.log(msg);
    }
  }

  /**
   * 打印警告信息
   *
   * @param msg 警告信息内容
   */
  warn(msg: string) {
    if (this.debug) {
      console.warn(msg);
    }
  }

  error(msg: string) {
    if (this.debug) {
      console.error(msg);
    }
  }
}
