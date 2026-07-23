import type { Request, Response, NextFunction } from 'express';
import type { ListQuery } from '../types';
import {
  createBarang,
  deactivateBarang,
  getBarangById,
  listBarang,
  updateBarang,
} from '../services/barang.service';
import { validateBarang } from '../validators/barang.validator';
import {
  sendItem,
  sendList,
  sendNotFound,
  sendValidationError,
} from '../utils/response';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function parseListQuery(req: Request): ListQuery {
  const page = clampInt(req.query.page, DEFAULT_PAGE, 1, Number.MAX_SAFE_INTEGER);
  const limit = clampInt(req.query.limit, DEFAULT_LIMIT, 1, MAX_LIMIT);

  const query: ListQuery = { page, limit };

  if (typeof req.query.search === 'string' && req.query.search.trim() !== '') {
    query.search = req.query.search.trim();
  }

  if (req.query.is_aktif !== undefined) {
    const raw = String(req.query.is_aktif).toLowerCase();
    if (raw === 'true') query.is_aktif = true;
    else if (raw === 'false') query.is_aktif = false;
  }

  const idKategori = Number(req.query.id_kategori);
  if (req.query.id_kategori !== undefined && Number.isInteger(idKategori)) {
    query.id_kategori = idKategori;
  }

  return query;
}

function clampInt(value: unknown, fallback: number, min: number, max: number): number {
  const n = Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function getBarangList(req: Request, res: Response, next: NextFunction): void {
  try {
    const { data, pagination } = listBarang(parseListQuery(req));
    sendList(res, data, pagination);
  } catch (err) {
    next(err);
  }
}

export function getBarangDetail(req: Request, res: Response, next: NextFunction): void {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      sendNotFound(res, 'Barang tidak ditemukan.');
      return;
    }
    const barang = getBarangById(id);
    if (!barang) {
      sendNotFound(res, 'Barang tidak ditemukan.');
      return;
    }
    sendItem(res, barang, 'Detail barang ditemukan.');
  } catch (err) {
    next(err);
  }
}

export function postBarang(req: Request, res: Response, next: NextFunction): void {
  try {
    const { errors, payload } = validateBarang(req.body ?? {});
    if (!payload) {
      sendValidationError(res, errors);
      return;
    }
    const created = createBarang(payload);
    sendItem(res, created, 'Barang berhasil disimpan.', 201);
  } catch (err) {
    next(err);
  }
}

export function putBarang(req: Request, res: Response, next: NextFunction): void {
  try {
    const id = parseId(req.params.id);
    if (id === null || !getBarangById(id)) {
      sendNotFound(res, 'Barang tidak ditemukan.');
      return;
    }
    const { errors, payload } = validateBarang(req.body ?? {}, id);
    if (!payload) {
      sendValidationError(res, errors);
      return;
    }
    const updated = updateBarang(id, payload);
    if (!updated) {
      sendNotFound(res, 'Barang tidak ditemukan.');
      return;
    }
    sendItem(res, updated, 'Barang berhasil diperbarui.');
  } catch (err) {
    next(err);
  }
}

export function deleteBarang(req: Request, res: Response, next: NextFunction): void {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      sendNotFound(res, 'Barang tidak ditemukan.');
      return;
    }
    const deactivated = deactivateBarang(id);
    if (!deactivated) {
      sendNotFound(res, 'Barang tidak ditemukan.');
      return;
    }
    sendItem(res, deactivated, 'Barang berhasil dinonaktifkan.');
  } catch (err) {
    next(err);
  }
}
