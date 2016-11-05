import http from 'http';
import express from 'express';
import winston from 'winston';

import initializeDb from './db';
import middleware from './middleware';
import healthcheck from './healthcheck';
import items from './items';
import { topLevelErrorHandler } from './utils';

const app = express();

app.server = http.createServer(app);

initializeDb((db) => {
  app.use(middleware());
  app.use(healthcheck({ db }));
  app.use(items({ db }));
  app.use(topLevelErrorHandler);

  app.server.listen(process.env.PORT || 3000);
  winston.info(`${process.env.SERVICE_NAME} started on port ${process.env.PORT || 3000}`);
});

export default app;
