import 'reflect-metadata';
import { Container } from 'inversify';
import { TwitterManager } from './managers/twittermanager';
import { Transformer } from './libs/transformer';
import { Cache } from './libs/cache';
import { SlackManager } from './managers/slackmanager';
import { DBManager } from './managers/dbmanager';
import { TestimonialRepository } from './repository/testimonialrepository';

// Application classes
const container = new Container();
container
  .bind<TwitterManager>(TwitterManager)
  .to(TwitterManager)
  .inSingletonScope();
container.bind<SlackManager>(SlackManager).to(SlackManager).inSingletonScope();
container
  .bind<TestimonialRepository>(TestimonialRepository)
  .to(TestimonialRepository)
  .inSingletonScope();

// Library classes
container.bind<Transformer>(Transformer).to(Transformer).inSingletonScope();
container.bind<Cache>(Cache).to(Cache).inSingletonScope();
container.bind<DBManager>(DBManager).to(DBManager).inSingletonScope();
export default container;
