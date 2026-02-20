import { Request, Response, NextFunction } from 'express';
import { error } from '../utils/apiResponse';

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      error(res, 'נדרשת הזדהות', 401);
      return;
    }
    if (!roles.includes(req.user.role)) {
      error(res, 'אין לך הרשאה לבצע פעולה זו', 403);
      return;
    }
    next();
  };
}
