import { Request, Response, NextFunction } from 'express';

// Type for controller function that may return a value but we don't care about it
type AsyncController = (req: Request, res: Response, next?: NextFunction) => Promise<any>;

/**
 * Wraps an async controller function to properly handle Express request/response
 * This fixes TypeScript errors related to controller return types
 */
export const wrapAsync = (fn: AsyncController) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}; 