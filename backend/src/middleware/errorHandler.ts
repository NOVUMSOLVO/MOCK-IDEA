import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ApiError(404, message);
  }

  // Mongoose duplicate key
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ApiError(400, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors).map((val: any) => val.message);
    error = new ApiError(400, message.join(', '));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new ApiError(401, message);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new ApiError(401, message);
  }

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    if (prismaError.code === 'P2002') {
      const message = 'Duplicate field value entered';
      error = new ApiError(400, message);
    } else if (prismaError.code === 'P2025') {
      const message = 'Record not found';
      error = new ApiError(404, message);
    }
  }

  // Multer errors
  if (err.name === 'MulterError') {
    const multerError = err as any;
    if (multerError.code === 'LIMIT_FILE_SIZE') {
      const message = 'File too large';
      error = new ApiError(400, message);
    } else if (multerError.code === 'LIMIT_UNEXPECTED_FILE') {
      const message = 'Unexpected file field';
      error = new ApiError(400, message);
    }
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    const zodError = err as any;
    const message = zodError.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
    error = new ApiError(400, message);
  }

  res.status((error as ApiError).statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
