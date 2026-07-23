import type { Kategori } from '../types';
import { kategoriList } from '../store/store';

export function findAllKategori(): Kategori[] {
  return kategoriList;
}

export function findKategoriById(id: number): Kategori | null {
  return kategoriList.find((k) => k.id === id) ?? null;
}
