import { Context } from '@src/core/context';
import debug from 'debug';
const log = debug('clone');
interface CloneActionOptions {
  list: boolean;
}

const cloneAction = (name: string, directory: string | undefined, options: CloneActionOptions) => {
  return async (context: Context) => {
    log('name', name);
  };
};

export { cloneAction };
