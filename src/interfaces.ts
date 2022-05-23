import {
  GenericObjectType,
  GenericResponse,
  GenericThread,
  GenericType,
  Provider,
} from './interfaces/generics';
import { GotResponse, GotClientType } from './interfaces/gotclient';
import { BumblebeeErrorType } from './interfaces/bumblebee_error';
import { errorCodes, statusCodes } from './libs/constants';
import schema from './types.json';
import { TwitterLookup } from './interfaces/twitter';

type SchemaType = typeof schema.definitions;
type Definitions = { [x in keyof SchemaType]: unknown };
export default class Interfaces implements Definitions {
  BumblebeeErrorType: BumblebeeErrorType;
  errorCodes: errorCodes;
  statusCodes: statusCodes;
  GenericType: GenericType;
  GenericObjectType: GenericObjectType;
  GotResponse: GotResponse;
  GotClientType: GotClientType;
  TwitterLookup: TwitterLookup;
  Provider: Provider;
  GenericThread: GenericThread;
  GenericResponse: GenericResponse;
}
