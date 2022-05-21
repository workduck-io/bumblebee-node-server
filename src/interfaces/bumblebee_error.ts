import { errorCodes, statusCodes } from '../libs/constants';

export interface BumblebeeErrorType {
  message: string;
  errorObject?: any;
  errorCode?: errorCodes;
  statusCode?: statusCodes;
  metaData?: string;
}
