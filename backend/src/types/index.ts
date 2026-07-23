export interface Kategori {
  id: number;
  nama_kategori: string;
}

export interface Barang {
  id: number;
  kode_barang: string;
  nama_barang: string;
  id_kategori: number;
  satuan: string;
  harga_beli: number;
  harga_jual: number;
  is_aktif: boolean;
  created_at: string;
  updated_at: string;
}

/** Barang enriched with its related kategori object, as returned by the API. */
export interface BarangWithKategori extends Barang {
  kategori: Kategori | null;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Payload accepted for create/update. All optional here; the validator enforces requirements. */
export interface BarangInput {
  kode_barang?: unknown;
  nama_barang?: unknown;
  id_kategori?: unknown;
  satuan?: unknown;
  harga_beli?: unknown;
  harga_jual?: unknown;
  is_aktif?: unknown;
}

/** A fully validated and normalized barang payload. */
export interface BarangPayload {
  kode_barang: string;
  nama_barang: string;
  id_kategori: number;
  satuan: string;
  harga_beli: number;
  harga_jual: number;
  is_aktif: boolean;
}

export interface ListQuery {
  page: number;
  limit: number;
  search?: string;
  is_aktif?: boolean;
  id_kategori?: number;
}
