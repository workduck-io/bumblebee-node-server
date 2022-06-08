import express from 'express';
import { jsonErrorHandler } from './middlewares/jsonerrorhandler';
import cors from 'cors';
import TwitterController from './controllers/twittercontroller';
import { errorCodes } from './libs/constants';
import 'dotenv/config';
import { LogRequest } from './middlewares/logrequest';
import logger from './libs/logger';
import 'reflect-metadata';
import SlackController from './controllers/slackcontroller';
import ViewController from './controllers/viewcontroller';
import TestimonialController from './controllers/testimonialcontroller';
import { TestimonialRepository as Repository } from './repository/testimonialrepository';
import container from './inversify.config';
import mustache from 'mustache-express';
import path from 'path';
import DiscordController from './controllers/discordcontroller';

class App {
  public _app: express.Application;
  public _port: number;
  private readonly _controllers: unknown;

  private _testimonialRepository: Repository =
    container.get<Repository>(Repository);

  constructor(controllers) {
    this._port = parseInt(process.env.PORT) || 5050;
    this._controllers = controllers;
  }

  public build() {
    this._app = express();
    this.initializeTemplateEngine();
    this.initializeMiddlewares();
    this.initializeControllers(this._controllers);
    this.initializeErrorHandlers();
    this.initializeDB();
  }

  private initializeTemplateEngine() {
    this._app.engine('mustache', mustache());
    this._app.set('view engine', 'mustache');
  }

  private initializeMiddlewares() {
    this._app.use(cors());
    this._app.use(express.json());
    this._app.use(LogRequest);
    this._app.use(express.static(path.join(__dirname, '/src/views')));
  }

  private initializeErrorHandlers() {
    this._app.use(jsonErrorHandler);
  }

  private initializeDB() {
    this._testimonialRepository.createTable();
  }

  private initializeControllers(controllers) {
    controllers.forEach(controller => {
      if (controller.isViewController)
        this._app.use('/view/', controller.router);
      else this._app.use('/api/v1/', controller.router);
    });
    this._app.use((req, res, next) => {
      res.status(404);
      logger.error('Route not found');
      res.json({
        statusCode: 404,
        message: 'Route not found',
        errorCode: errorCodes.NOT_FOUND,
      });
      next();
    });
  }
}

const application = new App([
  new TwitterController(),
  new SlackController(),
  new DiscordController(),
  new ViewController(),
  new TestimonialController(),
]);
application.build();
application._app.listen(application._port, () => {
  return logger.info(`Express is listening at port :${application._port}`);
});
