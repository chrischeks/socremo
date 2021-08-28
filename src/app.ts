import path from 'path';
process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '/@universal/configs');

import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { connect, set } from 'mongoose';
import morgan from 'morgan';
import compression from 'compression';
import Routes from '@/@universal/interfaces/route.interface';
import errorMiddleware from '@/@universal/middlewares/error.middleware';
import notFound from './@universal/middlewares/not-found.middleware';
import { dbConnection } from './@universal/database/mongo.database';
import { logger, stream } from './@universal/logger/logger';
import config from 'config';
import { limiter } from './@universal/rate-limiter/mongoexpress.limiter';
const { log, cors: corsConfig } = config.get('config');
const { format } = log;
const { origin, credentials } = corsConfig;

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 3111;
    this.env = process.env.NODE_ENV || 'development';
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
    this.initializeRouteNotFound();
  }

  public getServer() {
    return this.app;
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  private connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }

    connect(dbConnection.url, dbConnection.options);
  }

  private initializeMiddlewares() {
    this.app.set('trust proxy', 1);
    this.app.use(limiter);
    this.app.use(morgan(format, { stream }));
    this.app.use(cors({ origin, credentials }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/api/', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
  private initializeRouteNotFound() {
    this.app.use(notFound);
  }
}

export default App;
