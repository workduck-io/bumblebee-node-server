import { injectable } from 'inversify';

@injectable()
export class Transformer {
  private _cacheKeyDelimiter = '+';
  encodeCacheKey = (...keys: string[]) => {
    let result = '';
    keys.map(key => {
      result += key + this._cacheKeyDelimiter;
    });
    return result;
  };
}
