import type { Request, Response, NextFunction } from 'express';
import { findAllKategori } from '../services/kategori.service';
import { sendItem } from '../utils/response';

export function getKategoriList(_req: Request, res: Response, next: NextFunction): void {
  try {
    sendItem(res, findAllKategori(), 'Daftar kategori ditemukan.');
  } catch (err) {
    next(err);
  }
}
