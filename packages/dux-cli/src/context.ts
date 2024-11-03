import debug from 'debug';
import { Context } from './core/context.js';
const log = debug('wrapper');

type Fn<T extends any[]> = (...args: T) => Promise<void>;

type ActionFn<T extends any[], G> = (...args: T) => (context: Context) => G;

export const wrapContext = <T extends any[], G>(command: string, fn: ActionFn<T, G>): Fn<T> => {
  return async (...args) => {
    const context = new Context({ args, command });
    log('🚀 ~ command:', command);
    fn(...args)(context);
  };
};
