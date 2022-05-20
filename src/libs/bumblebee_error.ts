import { GenericType } from '../interfaces/generics';

export interface BumblebeeErrorResponse {
  message: GenericType;
  code: GenericType;
  statusCode: GenericType;
  metadata?: GenericType;
  stackTrace?: GenericType;
}

export default class BumblebeeError extends Error {
  response: BumblebeeErrorResponse;

  constructor(response: BumblebeeErrorResponse) {
    super(response?.message?.toString());
    this.response = response;
  }
}
