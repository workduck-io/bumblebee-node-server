import 'reflect-metadata';
import { Container } from 'inversify';
import { GotClient } from './libs/gotclient';
import { TwitterManager } from './managers/twittermanager';

const container = new Container();

container.bind<GotClient>(GotClient).to(GotClient).inSingletonScope();
container
  .bind<TwitterManager>(TwitterManager)
  .to(TwitterManager)
  .inSingletonScope();
export default container;
