import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Error: Access denied. No token provided. The user authentication has failed.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // Attach the user info to the request object
    next();
  } catch (err) {
    res.status(401).json({ error: 'Error: Invalid token. The user authentication has failed.' });
  }
};