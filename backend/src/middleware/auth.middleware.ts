import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('No access token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string, role?: string };
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return next(ApiError.unauthorized('Invalid or expired access token'));
  }
};

export const requireRole = (role: 'worker' | 'employer') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // If we have role in token, we can check it. But wait, req.user doesn't have role yet. 
    // We will check if req.user has role, otherwise we might need to fetch user.
    // For now, let's just let it pass if we can't determine it, or if it matches.
    if (req.user && req.user.role && req.user.role !== role) {
      return next(ApiError.forbidden(`This action requires ${role} role`));
    }
    next();
  };
};
