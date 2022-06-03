import { NextFunction, Request, Response } from 'express';
import { statusCodes } from '../libs/constants';
import jwt from 'jsonwebtoken';

async function Auth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.headers.authorization || req.query?.token?.toString();

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY) as any;
    console.log({ decoded });

    if (decoded.userName) next();
  } else {
    res
      .status(statusCodes.FORBIDDEN)
      .send('<p>Protected Page, login to view</p>');
  }
}

export default Auth;
