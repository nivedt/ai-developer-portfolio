import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Prisma errors
  if (err.code === 'P2002') {
    const message = 'Duplicate field value entered';
    error = { ...error, statusCode: 400, message };
  }

  if (err.code === 'P2014') {
    const message = 'Invalid ID';
    error = { ...error, statusCode: 400, message };
  }

  if (err.code === 'P2003') {
    const message = 'Invalid input data';
    error = { ...error, statusCode: 400, message };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { ...error, statusCode: 401, message };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { ...error, statusCode: 401, message };
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const message = 'Validation Error';
    error = { ...error, statusCode: 400, message };
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};