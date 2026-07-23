# Pengujian API Postman — Master Barang

Koleksi Postman untuk menguji API backend.

## Berkas

- `Master-Barang-API.postman_collection.json` — koleksi request beserta skrip pengujian.
- `Master-Barang-API.postman_environment.json` — environment lokal (`baseUrl`, `barangId`).

## Prasyarat

Jalankan backend terlebih dahulu:

```bash
cd backend
npm install
npm run dev
```

API berjalan di `http://localhost:4000` secara default (lihat `backend/.env.example`).

## Impor ke Postman

1. Buka Postman → **Import** → seret kedua berkas JSON tersebut.
2. Pilih environment **Master Barang API - Local** (pojok kanan atas).
3. Buka salah satu request lalu klik **Send**, atau gunakan **Collection Runner** untuk menjalankan semuanya secara berurutan.

## Endpoint yang diuji

| Folder | Request | Method | Path |
| --- | --- | --- | --- |
| Health | Cek kesehatan | GET | `/health` |
| Kategori | Daftar kategori | GET | `/api/kategori` |
| Barang | Daftar (paginasi/filter) | GET | `/api/barang` |
| Barang | Detail | GET | `/api/barang/:id` |
| Barang | Tambah | POST | `/api/barang` |
| Barang | Ubah | PUT | `/api/barang/:id` |
| Barang | Hapus (soft delete) | DELETE | `/api/barang/:id` |
| Negative cases | Tidak ditemukan | GET | `/api/barang/999999` |
| Negative cases | Error validasi | POST | `/api/barang` |
| Negative cases | `kode_barang` duplikat | POST | `/api/barang` |

## Catatan

- Jalankan koleksi **secara berurutan**. Request `POST /api/barang (create)` menyimpan id record
  baru ke variabel koleksi `barangId`, yang kemudian digunakan kembali oleh request ubah dan hapus.
- Request daftar memiliki query param opsional (`search`, `is_aktif`, `id_kategori`) yang
  dinonaktifkan secara default — aktifkan pada tab **Params** untuk menguji filter.
- Setiap request memiliki assertion pada tab **Tests**; jalankan melalui Collection Runner untuk
  melihat ringkasan lulus/gagal.
