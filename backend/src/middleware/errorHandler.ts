import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../config/logger';
import { env } from '../config/env';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error?.errors, false);
  }

  const { statusCode, message, errors, isOperational } = error as ApiError;

  // Log error
  if (!isOperational || statusCode >= 500) {
    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    if (env.NODE_ENV === 'development') {
      logger.error(err.stack);
    }
  }

  const response = ApiResponse.error(
    message,
    env.NODE_ENV === 'development' ? errors || err.stack : errors
  );

  res.status(statusCode).json(response);
};
