import GGError from '@core/error.js';
import { logger } from '@utils/log.js';
import path from 'path';
import debug from 'debug';
import { findRoot } from '@src/plugin/findRoot.js';

const log = debug('find:root');

const find = (directory: string) => async (context: any) => {
  return true;
};

const findRootAction = (directory: string, options: { depth: number; markers: string[] }) => {
  const { depth, markers } = options;
  const dir = directory ? path.resolve(directory) : process.cwd();
  log(directory, options, dir);

  const root = findRoot(dir, { maxDepth: depth, markers });

  const notFoundMsg = 'not found root dir, please set options try again';
  log('root %s', root);

  logger.info(root ? `root dir: ${root}` : notFoundMsg);
};

export default findRootAction;
