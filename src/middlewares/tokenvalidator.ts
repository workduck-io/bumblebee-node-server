import { NextFunction, Request, Response } from 'express';
import { statusCodes } from '../libs/constants';

export async function SlackTokenValidator(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (process.env.SLACK_BEARER_TOKEN) next();
  else res.status(statusCodes.UNAUTHORIZED).send('Slack Auth token missing');
}

export async function TwitterTokenValidator(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (process.env.TWITTER_BEARER_TOKEN) next();
  else res.status(statusCodes.UNAUTHORIZED).send('Twitter Auth token missing');
}

export async function DiscordTokenValidator(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (process.env.DISCORD_BEARER_TOKEN) next();
  else
    res.status(statusCodes.UNAUTHORIZED).send('Discord Bot Auth token missing');
}
