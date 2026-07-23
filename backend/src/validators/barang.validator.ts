import type { BarangInput, BarangPayload, FieldError } from '../types';
import { barangList, kategoriList } from '../store/store';

const KODE_PATTERN = /^[a-zA-Z0-9-]+$/;

export interface ValidationResult {
  errors: FieldError[];
  payload?: BarangPayload;
}

/**
 * Validates a create/update payload against the rules in TASK.md section 3.4.
 * `currentId` is the id of the record being updated (undefined on create) so
 * the unique `kode_barang` check can exclude the record itself.
 */
export function validateBarang(input: BarangInput, currentId?: number): ValidationResult {
  const errors: FieldError[] = [];

  // kode_barang: required, unique, max 50, alphanumeric + hyphen
  const kode = typeof input.kode_barang === 'string' ? input.kode_barang.trim() : '';
  if (!kode) {
    errors.push({ field: 'kode_barang', message: 'Kode barang wajib diisi.' });
  } else if (kode.length > 50) {
    errors.push({ field: 'kode_barang', message: 'Kode barang maksimal 50 karakter.' });
  } else if (!KODE_PATTERN.test(kode)) {
    errors.push({
      field: 'kode_barang',
      message: 'Kode barang hanya boleh berisi huruf, angka, dan tanda hubung.',
    });
  } else {
    const duplicate = barangList.some(
      (item) => item.kode_barang.toLowerCase() === kode.toLowerCase() && item.id !== currentId
    );
    if (duplicate) {
      errors.push({ field: 'kode_barang', message: 'Kode barang sudah digunakan.' });
    }
  }

  // nama_barang: required, max 200
  const nama = typeof input.nama_barang === 'string' ? input.nama_barang.trim() : '';
  if (!nama) {
    errors.push({ field: 'nama_barang', message: 'Nama barang wajib diisi.' });
  } else if (nama.length > 200) {
    errors.push({ field: 'nama_barang', message: 'Nama barang maksimal 200 karakter.' });
  }

  // id_kategori: required, must exist
  const idKategori = toNumber(input.id_kategori);
  if (input.id_kategori === undefined || input.id_kategori === null || input.id_kategori === '') {
    errors.push({ field: 'id_kategori', message: 'Kategori wajib dipilih.' });
  } else if (idKategori === null || !Number.isInteger(idKategori)) {
    errors.push({ field: 'id_kategori', message: 'Kategori tidak valid.' });
  } else if (!kategoriList.some((k) => k.id === idKategori)) {
    errors.push({ field: 'id_kategori', message: 'Kategori tidak ditemukan.' });
  }

  // satuan: required, max 30
  const satuan = typeof input.satuan === 'string' ? input.satuan.trim() : '';
  if (!satuan) {
    errors.push({ field: 'satuan', message: 'Satuan wajib diisi.' });
  } else if (satuan.length > 30) {
    errors.push({ field: 'satuan', message: 'Satuan maksimal 30 karakter.' });
  }

  // harga_beli: required, number >= 0
  const hargaBeli = toNumber(input.harga_beli);
  if (input.harga_beli === undefined || input.harga_beli === null || input.harga_beli === '') {
    errors.push({ field: 'harga_beli', message: 'Harga beli wajib diisi.' });
  } else if (hargaBeli === null || Number.isNaN(hargaBeli)) {
    errors.push({ field: 'harga_beli', message: 'Harga beli harus berupa angka.' });
  } else if (hargaBeli < 0) {
    errors.push({ field: 'harga_beli', message: 'Harga beli tidak boleh negatif.' });
  }

  // harga_jual: required, number >= harga_beli
  const hargaJual = toNumber(input.harga_jual);
  if (input.harga_jual === undefined || input.harga_jual === null || input.harga_jual === '') {
    errors.push({ field: 'harga_jual', message: 'Harga jual wajib diisi.' });
  } else if (hargaJual === null || Number.isNaN(hargaJual)) {
    errors.push({ field: 'harga_jual', message: 'Harga jual harus berupa angka.' });
  } else if (hargaJual < 0) {
    errors.push({ field: 'harga_jual', message: 'Harga jual tidak boleh negatif.' });
  } else if (hargaBeli !== null && !Number.isNaN(hargaBeli) && hargaJual < hargaBeli) {
    errors.push({
      field: 'harga_jual',
      message: 'Harga jual tidak boleh lebih kecil dari harga beli.',
    });
  }

  // is_aktif: optional boolean (defaults to true on create)
  let isAktif = true;
  if (input.is_aktif !== undefined && input.is_aktif !== null) {
    if (typeof input.is_aktif === 'boolean') {
      isAktif = input.is_aktif;
    } else {
      errors.push({ field: 'is_aktif', message: 'Status aktif harus berupa boolean.' });
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    errors: [],
    payload: {
      kode_barang: kode,
      nama_barang: nama,
      id_kategori: idKategori as number,
      satuan,
      harga_beli: hargaBeli as number,
      harga_jual: hargaJual as number,
      is_aktif: isAktif,
    },
  };
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}
