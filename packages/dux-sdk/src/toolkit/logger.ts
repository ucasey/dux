import ora from 'ora';
import chalk from 'chalk';
import dayjs from 'dayjs';

export const LOGGER_LEVEL_PREFIX = {
  INFO: chalk.cyanBright('[ ℹ︎ ]'),
  SUCCESS: chalk.greenBright('[ ✔ ]'),
  WARN: chalk.yellowBright('[ ℹ︎ ]'),
  ERROR: chalk.redBright('[ ✖ ]'),
};

export interface LoggerProps {
  mute?: boolean;
}

export class Logger {
  private _mute?: boolean;
  private _ora = ora({ spinner: 'point' });
  private _prefix = LOGGER_LEVEL_PREFIX;
  private _consoleLog = console.log;

  constructor(props?: LoggerProps) {
    this._mute = Boolean(props?.mute);
  }

  private _print = (...args: string[]) => {
    if (!this._mute) {
      const timer = this._timePrefix();
      console.log(timer, ...args);
    }
  };

  private _timePrefix = () => {
    const timer = dayjs().format('HH:mm:ss');
    return chalk.rgb(63, 245, 217)(`[${timer}]`);
  };

  oraStart = (text: string) => {
    this._ora.stop();
    this._ora.start(text);
  };

  oraSucceed = (text: string) => {
    const timer = this._timePrefix();
    this._ora.stopAndPersist({ symbol: `${timer} ${this._prefix.SUCCESS}`, text });
  };

  oraFail = (text: string) => {
    const timer = this._timePrefix();
    this._ora.stopAndPersist({ symbol: `${timer} ${this._prefix.ERROR}`, text });
  };

  oraStop = () => {
    this._ora.stopAndPersist();
  };

  info = (msg: string) => {
    this._print(this._prefix.INFO, msg);
  };

  warn = (msg: string) => {
    this._print(this._prefix.WARN, msg);
  };

  success = (msg: string) => {
    this._print(this._prefix.SUCCESS, msg);
  };

  error = (msg: string) => {
    this._print(this._prefix.ERROR, msg);
  };

  hint = (msg: string, rgb?: number[]) => {
    if (rgb && rgb.length >= 3) {
      this._print(chalk.rgb(rgb[0], rgb[2], rgb[2])(msg));
    } else {
      this._print(chalk.magentaBright(msg));
    }
  };

  /**
   * 慎用！劫持其他库的输出
   */
  consoleMute = () => {
    console.log = () => {};
  };
  /**
   * 恢复
   */
  consoleUnMute = () => {
    console.log = this._consoleLog;
  };
}

export const logger = new Logger();
