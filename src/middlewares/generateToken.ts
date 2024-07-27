import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

export const generateToken = (id: string, username: string): string => {
  return jwt.sign({ id, username }, jwtSecret, { expiresIn: '1h' });
};
