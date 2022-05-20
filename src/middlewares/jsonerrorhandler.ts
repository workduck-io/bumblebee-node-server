import { ErrorRequestHandler } from 'express';
import logger from '../libs/logger';
import { BumblebeeErrorResponse } from '../libs/bumblebee_error';

export const jsonErrorHandler: ErrorRequestHandler = async (
  err,
  req,
  res,
  next
) => {
  const { response } = err;
  const error: BumblebeeErrorResponse = response;
  if (!res) next();
  logger.error(error);
  res.setHeader('Content-Type', 'application/json');
  res.status(parseInt(error?.statusCode?.toString())).send(error);
};
