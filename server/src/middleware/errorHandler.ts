import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err);

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: { message: 'נתונים לא תקינים', details: err.flatten().fieldErrors },
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        success: false,
        error: { message: 'הערך כבר קיים במערכת' },
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: { message: 'הרשומה לא נמצאה' },
      });
      return;
    }
  }

  if (err instanceof Error && err.message) {
    const statusCode = (err as Error & { statusCode?: number }).statusCode ?? 500;
    res.status(statusCode).json({
      success: false,
      error: { message: err.message },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: { message: 'שגיאת שרת פנימית' },
  });
}
