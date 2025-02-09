import { Response } from 'express';
import * as morgan from 'morgan';
import { createLogger, format, transports } from 'winston';
import config from './config';

export { Logger } from 'winston';

const options = {
  console: {
    level: config.logging.LOG_LEVEL,
    handleExceptions: true,
    colorize: true
  }
};

const consoleTransport = new transports.Console(options.console);

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [consoleTransport],
  exceptionHandlers: [consoleTransport],
  exitOnError: false
});

export default logger;

export const expressLogger = (handler: 'error' | 'warn' | 'info' = 'info', matchFn?: (res: Response) => boolean) => {
  return morgan(morgan.compile(':status :method :url - :response-time ms'), {
    skip: (req: any, res: any) => !!(matchFn && !matchFn(res)),
    stream: {
      write(message: string) {
        logger[handler](message);
      }
    }
  });
};
