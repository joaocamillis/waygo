import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Unauthorized' });
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Unauthorized' });
  const token = parts[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload: any = verifyJwt(token);
    req.userId = payload.userId || payload.sub || null;
    if (!req.userId) return res.status(401).json({ error: 'Unauthorized' });
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
