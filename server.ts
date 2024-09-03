if (process.env.SQREEN_TOKEN) {
  // tslint:disable-next-line:no-var-requires
  require('sqreen');
}

import * as fs from 'fs';
import { createServer } from 'http';

import config from './config';
import app from './index';
import logger from './logger';

// tslint:disable-next-line:no-var-requires
const http = require('http');
http.globalAgent.maxSockets = 100;

const server = createServer(app);


let mask: number | null = process.umask(0);

if (typeof config.port === 'string') {
  if (fs.existsSync(config.port)) {
    fs.unlinkSync(config.port);
  }
}

export async function start(port = config.port) {
  return new Promise((resolve, reject) => {
    server.listen(port, (error: any) => {
      if (error) {
        reject(error);
      }

      if (mask) {
        mask = null;
      }
      resolve();
    });
  }).then(() => {
    logger.info(`Listening on ${port}`);
  });
}

if (require.main === module) {
  start().catch(error => {
    console.error(error);
    process.exit(1);
  });
}
