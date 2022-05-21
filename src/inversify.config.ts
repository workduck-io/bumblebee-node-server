import 'reflect-metadata';
import { Container } from 'inversify';
import { TwitterManager } from './managers/twittermanager';

const container = new Container();
container
  .bind<TwitterManager>(TwitterManager)
  .to(TwitterManager)
  .inSingletonScope();
export default container;
