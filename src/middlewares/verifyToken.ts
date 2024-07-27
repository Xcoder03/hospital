import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HttpError } from '../errors/HttpError';

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

interface CustomRequest extends Request {
  userId?: string;
}

export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];

  if (!token) {
    return next(new HttpError(401, 'No token provided'));
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return next(new HttpError(401, 'Failed to authenticate token'));
    }

    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
      req.userId = decoded.id as string;
    } else {
      return next(new HttpError(401, 'Invalid token payload'));
    }

    next();
  });
};
