import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import { verifyToken } from '../utils/jwtUtils';
import User from '../models/user.model';
import { asyncHandler } from '../utils/asyncHandler';

// Extend Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware to check if user is authenticated
export const isAuthenticated = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Check if token exists in headers
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Please login to access this resource', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = verifyToken(token);

    // Find the user
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Check if user is active
    if (!user.is_active) {
      return next(new AppError('User account is deactivated', 403));
    }

    // Set user in request
    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Invalid authentication token', 401));
  }
});

// Middleware to check user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Please login first', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(`Role (${req.user.role}) is not allowed to access this resource`, 403));
    }

    next();
  };
}; 