import { Request, Response, NextFunction } from 'express';
import { getFirebaseAuth } from '../config/firebase';

export interface AuthRequest extends Request {
  user?: any;
}

export const verifyFirebaseToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await getFirebaseAuth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
};