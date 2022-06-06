import { NextFunction, Request, Response } from 'express';
import { statusCodes } from '../libs/constants';
import jwt from 'jsonwebtoken';

async function Auth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.headers.authorization || req.query?.token?.toString();

  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY) as any;

      if (decoded.userName) next();
    } else {
      res
        .status(statusCodes.UNAUTHORIZED)
        .send('<p>Protected Page, login to view</p>');
    }
  } catch (error) {
    res.status(statusCodes.UNAUTHORIZED).json({ message: error.toString() });
  }
}

export default Auth;
