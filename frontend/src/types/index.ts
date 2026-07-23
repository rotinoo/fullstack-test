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
  kategori: Kategori | null;
}

export interface BarangFormValues {
  kode_barang: string;
  nama_barang: string;
  id_kategori: number | '';
  satuan: string;
  harga_beli: number | '';
  harga_jual: number | '';
  is_aktif: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ListResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

export interface ItemResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: FieldError[];
}

export interface BarangListParams {
  page: number;
  limit: number;
  search?: string;
  is_aktif?: boolean;
  id_kategori?: number;
}
