import type { Response } from 'express';
import type { FieldError, PaginationMeta } from '../types';

export function sendList<T>(res: Response, data: T[], pagination: PaginationMeta): Response {
  return res.status(200).json({ success: true, data, pagination });
}

export function sendItem<T>(
  res: Response,
  data: T,
  message: string,
  status = 200
): Response {
  return res.status(status).json({ success: true, message, data });
}

export function sendValidationError(res: Response, errors: FieldError[]): Response {
  return res.status(400).json({ success: false, message: 'Validasi gagal.', errors });
}

export function sendNotFound(res: Response, message: string): Response {
  return res.status(404).json({ success: false, message });
}

export function sendServerError(res: Response): Response {
  return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
}
