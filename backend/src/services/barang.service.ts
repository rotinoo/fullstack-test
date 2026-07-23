import type {
  Barang,
  BarangPayload,
  BarangWithKategori,
  ListQuery,
  PaginationMeta,
} from '../types';
import { barangList, nextBarangId } from '../store/store';
import { findKategoriById } from './kategori.service';

function attachKategori(barang: Barang): BarangWithKategori {
  return { ...barang, kategori: findKategoriById(barang.id_kategori) };
}

export interface ListResult {
  data: BarangWithKategori[];
  pagination: PaginationMeta;
}

export function listBarang(query: ListQuery): ListResult {
  let filtered = [...barangList];

  if (query.search) {
    const term = query.search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.kode_barang.toLowerCase().includes(term) ||
        item.nama_barang.toLowerCase().includes(term)
    );
  }

  if (query.is_aktif !== undefined) {
    filtered = filtered.filter((item) => item.is_aktif === query.is_aktif);
  }

  if (query.id_kategori !== undefined) {
    filtered = filtered.filter((item) => item.id_kategori === query.id_kategori);
  }

  const total = filtered.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / query.limit);
  const start = (query.page - 1) * query.limit;
  const paged = filtered.slice(start, start + query.limit);

  return {
    data: paged.map(attachKategori),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
    },
  };
}

export function getBarangById(id: number): BarangWithKategori | null {
  const found = barangList.find((item) => item.id === id);
  return found ? attachKategori(found) : null;
}

export function createBarang(payload: BarangPayload): BarangWithKategori {
  const now = new Date().toISOString();
  const barang: Barang = {
    id: nextBarangId(),
    ...payload,
    created_at: now,
    updated_at: now,
  };
  barangList.push(barang);
  return attachKategori(barang);
}

export function updateBarang(id: number, payload: BarangPayload): BarangWithKategori | null {
  const index = barangList.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const existing = barangList[index];
  const updated: Barang = {
    ...existing,
    ...payload,
    id: existing.id,
    created_at: existing.created_at,
    updated_at: new Date().toISOString(),
  };
  barangList[index] = updated;
  return attachKategori(updated);
}

/** Soft delete: sets is_aktif to false and returns the affected record. */
export function deactivateBarang(id: number): BarangWithKategori | null {
  const index = barangList.findIndex((item) => item.id === id);
  if (index === -1) return null;

  barangList[index] = {
    ...barangList[index],
    is_aktif: false,
    updated_at: new Date().toISOString(),
  };
  return attachKategori(barangList[index]);
}
