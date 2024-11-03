import { Logger } from '@ucasey/dux-sdk';

interface ContextProps {
  args?: any;
  command: string;
}

/** 上下文信息信息 */
export class Context {
  logger = new Logger();
  args = {};
  cwd = process.cwd();

  constructor(props: ContextProps) {
    this.logger.info(`args>>>${props.args}`);
    if (props?.args) {
      const argsArr: string[] = props?.args[props?.args.length - 1]?.args || [];
      this.args = formatArgs(argsArr);
    }
  }
  register(key: string) {}
}

const formatArgs = (argsArr: string[]) => {
  if (!argsArr.length) {
    return {};
  }
  // 遇到 -- 转义, 后续参数都在 passthrough 中存一份
  let flag = false;
  const passthrough: string[] = [];

  return argsArr
    ?.map((arg: string) => {
      if (arg.startsWith('-')) {
        flag = true;
        passthrough.push(arg);
        return { [arg]: arg };
      }
      if (flag) {
        passthrough.push(arg);
      }
      if (arg.includes('=')) {
        const [key, value] = arg.split('=');
        return { [key]: value };
      }
      return { [arg]: true };
    })
    ?.concat({ passthrough: passthrough.join(' ') })
    ?.reduce((a, b) => Object.assign(a, b));
};
