import 'reflect-metadata';
import { Container } from 'inversify';
import { TwitterManager } from './managers/twittermanager';
import { Transformer } from './libs/transformer';
import { Cache } from './libs/cache';

const container = new Container();
container
  .bind<TwitterManager>(TwitterManager)
  .to(TwitterManager)
  .inSingletonScope();

container.bind<Transformer>(Transformer).to(Transformer).inSingletonScope();
container.bind<Cache>(Cache).to(Cache).inSingletonScope();
export default container;
