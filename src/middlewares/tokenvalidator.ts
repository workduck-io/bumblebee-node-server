import { NextFunction, Request, Response } from 'express';
import { statusCodes } from '../libs/constants';

export async function SlackTokenValidator(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (process.env.SLACK_BEARER_TOKEN) next();
  else res.status(statusCodes.FORBIDDEN).send('Slack Auth token missing');
}

export async function TwitterTokenValidator(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (process.env.TWITTER_BEARER_TOKEN) next();
  else res.status(statusCodes.FORBIDDEN).send('Twitter Auth token missing');
}
