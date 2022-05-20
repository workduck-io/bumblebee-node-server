import { errorCodes } from './constants';
import { statusCodes } from './constants';
import BumblebeeError from './bumblebee_error';
import { BumblebeeErrorType } from '../interfaces/bumblebee_error';

export function errorlib(params: BumblebeeErrorType) {
  const { message, errorObject, errorCode, statusCode, metaData } = params;

  const errorcode = errorCode ?? errorCodes.UNKNOWN;
  const statuscode = statusCode ?? statusCodes.INTERNAL_SERVER_ERROR;
  const metadata = metaData ?? '';

  if (errorObject && errorObject.response) {
    throw new BumblebeeError({
      message: errorObject.response.message,
      code: errorObject.response.code,
      statusCode: errorObject.response.statusCode,
      metadata: errorObject.response.metadata,
      stackTrace: errorObject.stack,
    });
  }
  const stack = errorObject ? errorObject.stack : '';

  throw new BumblebeeError({
    message,
    code: errorcode,
    statusCode: statuscode,
    metadata,
    stackTrace: stack,
  });
}
