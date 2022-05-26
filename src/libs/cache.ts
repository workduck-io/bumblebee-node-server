import { injectable } from 'inversify';
import NodeCache from 'node-cache';
import container from '../inversify.config';
import { Transformer } from './transformer';

@injectable()
export class Cache {
  private _ttl = 120;
  private _refreshPeriod = 125;
  private _maxKeys = 100;
  private _cache;
  private _transformer: Transformer = container.get<Transformer>(Transformer);

  constructor() {
    this._cache = new NodeCache({
      stdTTL: this._ttl,
      checkperiod: this._refreshPeriod,
      maxKeys: this._maxKeys,
      useClones: false,
    });
  }

  set(key: string, entity: string, payload: any) {
    this._cache.set(this._transformer.encodeCacheKey(entity, key), payload);
  }

  get(key: string, entity: string) {
    return this._cache.get(this._transformer.encodeCacheKey(entity, key));
  }
}
