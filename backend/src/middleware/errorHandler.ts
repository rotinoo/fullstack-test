import type { NextFunction, Request, Response } from 'express';
import { sendNotFound, sendServerError } from '../utils/response';

export function notFoundHandler(req: Request, res: Response): void {
  sendNotFound(res, `Rute tidak ditemukan: ${req.method} ${req.originalUrl}`);
}

// Express identifies error handlers by their 4-arg signature; `next` must stay.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // eslint-disable-next-line no-console
  console.error('[error]', err);
  sendServerError(res);
}
