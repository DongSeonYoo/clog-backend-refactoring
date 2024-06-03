import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * wrapping try-catch
 * use promise
 */
export const wrapper = (cb: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(cb(req, res, next)).catch(next);
  };
};
