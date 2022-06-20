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

export async function InBuiltTokenValidator(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (
    process.env.ADMIN_USERNAME &&
    process.env.ADMIN_PASSWORD &&
    process.env.JWT_PRIVATE_KEY
  )
    next();
  else
    res
      .status(statusCodes.UNAUTHORIZED)
      .send(
        'Missing one or all of this<br> 1) admin username<br> 2) admin password<br> 3) jwt secret key<br>'
      );
}
