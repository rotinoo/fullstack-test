import type { Barang, Kategori } from '../types';
import barangSeed from '../data/barang.json';
import kategoriSeed from '../data/kategori.json';

/**
 * In-memory data store. Seeds are loaded once at module import (server start).
 * All CRUD operations mutate these arrays directly. Data resets on restart,
 * which is expected behaviour for this in-memory setup.
 */

// Clone the seed so mutations never leak back into the imported JSON module cache.
export const barangList: Barang[] = (barangSeed as Barang[]).map((item) => ({ ...item }));
export const kategoriList: Kategori[] = (kategoriSeed as Kategori[]).map((item) => ({ ...item }));

/** Next auto-increment id = highest existing id + 1 (1 when the list is empty). */
export function nextBarangId(): number {
  return barangList.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}
