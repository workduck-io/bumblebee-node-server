import { injectable } from 'inversify';
import Interfaces from '../interfaces';
import { schemaValidator } from './schemavalidator';

@injectable()
export class RequestParser<T extends keyof Interfaces> {
  data?: Interfaces[T];
  params?: any;
  query?: any;
  authToken?: string;
  constructor(req: any, type?: T) {
    if (req.body) {
      if (type) this.data = schemaValidator<T>(req.body, type);
      else this.data = JSON.parse(req.body);
    }
    this.params = req.params ? req.params : {};
    this.query = req.query ? req.query : {};
    this.authToken = req.headers.authorization
      ? req.headers.authorization.toString()
      : null;
  }
}
