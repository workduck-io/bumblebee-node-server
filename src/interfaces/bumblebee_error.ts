import { errorCodes, statusCodes } from '../libs/constants';

export interface BumblebeeErrorType {
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorObject?: any;
  errorCode?: errorCodes;
  statusCode?: statusCodes;
  metaData?: string;
}
