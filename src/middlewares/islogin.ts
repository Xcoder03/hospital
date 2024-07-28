import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/verifyToken';

// Middleware to check if the user is logged in
export const isLogin = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, next);
};
