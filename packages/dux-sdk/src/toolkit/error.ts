import { logger } from './logger.js';

class CommonError extends Error {
  constructor(msg: string, name: string) {
    super(`${name}: ${msg}`);
    logger.error(`${name}: ${msg}`);
    process.exit(1);
  }
}

class DuxError extends CommonError {
  static notImplemented = (msg: string) => {
    throw new CommonError('NotImplementedError', msg);
  };
  static notFound = (msg: string) => {
    throw new CommonError('NotFoundError', msg);
  };
  static notLegalParam = (msg: string) => {
    throw new CommonError('NotLegalParam', msg);
  };
}

export default DuxError;
