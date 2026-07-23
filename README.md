<p align="center">
  <img src="./logo_mitraplus.webp" alt="Mitraplus" width="45" />
  <img src="./logo_mitraplus_typography.png" alt="Mitraplus" width="200" />
</p>

<h1 align="center">Master Barang - Fullstack Test</h1>

Implementasi modul **Master Barang** secara utuh: REST API dengan **Node.js + Express (TypeScript)** yang menyimpan data sebagai array in-memory (di-load dari file JSON, tanpa database engine), dan frontend **React + Vite (TypeScript)** dengan **Tailwind CSS** + **TanStack Query** yang memanggil API sungguhan.

Spesifikasi tugas lengkap ada di [TASK.md](./TASK.md).

## Daftar Isi

- [Teknologi](#teknologi)
- [Struktur Proyek](#struktur-proyek)
- [Prasyarat](#prasyarat)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Environment Variables](#environment-variables)
- [Dokumentasi API](#dokumentasi-api)
- [Fitur Frontend](#fitur-frontend)
- [Screenshot](#screenshot)
- [Catatan](#catatan)

## Teknologi

| Layer | Teknologi |
|-------|-----------|
| Backend | Node.js, Express 4, TypeScript, tsx |
| Data | Array in-memory di-seed dari `data/*.json` (tanpa DB/ORM) |
| Frontend | React 18, Vite 5, TypeScript |
| UI | Tailwind CSS v3 |
| Data fetching | TanStack Query v5 + Axios |
| Routing | React Router v6 |
| Notifikasi | react-hot-toast |

## Struktur Proyek

```
fullstack-test/
├── data/                     # Data contoh asli (referensi)
├── backend/                  # API Express + TypeScript
│   ├── src/
│   │   ├── data/             # barang.json & kategori.json (di-load in-memory)
│   │   ├── store/            # State in-memory + auto-increment id
│   │   ├── types/            # Tipe bersama
│   │   ├── utils/            # Helper response envelope
│   │   ├── validators/       # Aturan validasi barang
│   │   ├── services/         # Logika bisnis (barang, kategori)
│   │   ├── controllers/      # Handler request/response
│   │   ├── routes/           # Definisi rute /api
│   │   ├── middleware/       # Error handler & 404
│   │   └── index.ts          # Bootstrap server (CORS, JSON, routes)
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
└── frontend/                 # React + Vite + Tailwind
    ├── src/
    │   ├── api/              # Axios client + fungsi endpoint
    │   ├── hooks/            # TanStack Query hooks + useDebounce
    │   ├── components/       # Komponen reusable (tabel, dialog, dll)
    │   ├── pages/            # Halaman daftar & form
    │   ├── types/           # Tipe bersama
    │   └── utils/           # Format Rupiah
    ├── .env.example
    ├── package.json
    └── vite.config.ts
```

## Prasyarat

- **Node.js ≥ 18** (dikembangkan & diuji dengan Node 22)
- npm

## Menjalankan Aplikasi

Jalankan backend dan frontend di dua terminal terpisah.

### 1. Backend (port 4000)

```bash
cd backend
npm install
cp .env.example .env      # Windows PowerShell: copy .env.example .env
npm run dev
```

API berjalan di `http://localhost:4000`. Cek kesehatan: `http://localhost:4000/health`.

### 2. Frontend (port 5173)

```bash
cd frontend
npm install
cp .env.example .env      # Windows PowerShell: copy .env.example .env
npm run dev
```

Buka `http://localhost:5173` — otomatis diarahkan ke `/master/barang`.

### Build produksi (opsional)

```bash
cd backend && npm run build && npm start
cd frontend && npm run build && npm run preview
```

## Environment Variables

**Backend** (`backend/.env`):

| Variabel | Default | Keterangan |
|----------|---------|------------|
| `PORT` | `4000` | Port server API |
| `CORS_ORIGIN` | `http://localhost:5173` | Origin frontend yang diizinkan (pisahkan dengan koma untuk banyak origin) |

**Frontend** (`frontend/.env`):

| Variabel | Default | Keterangan |
|----------|---------|------------|
| `VITE_API_URL` | `http://localhost:4000/api` | Base URL API (termasuk prefix `/api`) |

## Dokumentasi API

Semua rute berprefiks `/api` dan memakai envelope response yang konsisten.

| Method | Endpoint | Deskripsi | Sukses |
|--------|----------|-----------|--------|
| GET | `/api/barang` | Daftar barang (+ filter & paginasi) | 200 |
| GET | `/api/barang/:id` | Detail satu barang | 200 |
| POST | `/api/barang` | Tambah barang | 201 |
| PUT | `/api/barang/:id` | Ubah barang | 200 |
| DELETE | `/api/barang/:id` | Nonaktifkan barang (soft delete) | 200 |
| GET | `/api/kategori` | Daftar kategori untuk dropdown | 200 |

**Query parameter `GET /api/barang`:** `page` (default 1), `limit` (default 10, max 100), `search` (cari di `kode_barang`/`nama_barang`), `is_aktif` (`true`/`false`), `id_kategori`.

**Contoh response list:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "kode_barang": "BRG-001",
      "nama_barang": "Kertas A4 80gsm",
      "id_kategori": 2,
      "satuan": "rim",
      "harga_beli": 45000,
      "harga_jual": 55000,
      "is_aktif": true,
      "created_at": "2026-01-10T08:00:00.000Z",
      "updated_at": "2026-01-10T08:00:00.000Z",
      "kategori": { "id": 2, "nama_kategori": "Alat Tulis" }
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 }
}
```

**Contoh error validasi (400):**

```json
{
  "success": false,
  "message": "Validasi gagal.",
  "errors": [
    { "field": "kode_barang", "message": "Kode barang sudah digunakan." }
  ]
}
```

Aturan validasi (backend & frontend disinkronkan): `kode_barang` wajib/unik/max 50/alfanumerik+tanda hubung, `nama_barang` wajib/max 200, `id_kategori` wajib & harus ada, `satuan` wajib/max 30, `harga_beli` ≥ 0, `harga_jual` ≥ `harga_beli`. Pengecekan unik `kode_barang` pada update mengecualikan record itu sendiri.

## Fitur Frontend

- Tabel daftar barang: No, Kode (monospace), Nama, Kategori, Satuan, Harga Beli/Jual (format Rupiah), Status (chip), Aksi.
- Pencarian dengan **debounce 300 ms**, filter kategori, dan filter status.
- Paginasi mengikuti field API (`page`, `totalPages`).
- Loading state, **empty state**, dan notifikasi error (toast).
- Form tambah/ubah reusable dengan validasi per-field di sisi client; error server (mis. kode duplikat) dipetakan ke field terkait.
- Konfirmasi sebelum nonaktifkan (soft delete) dengan toast feedback.
- Caching & invalidation otomatis via TanStack Query setelah create/update/delete.

## Screenshot

**Halaman daftar barang**

![Daftar Barang](./docs/screenshots/daftar-barang.png)

**Form dengan validasi (kode duplikat dari backend)**

![Form Validasi](./docs/screenshots/form-validasi.png)

## Catatan

- **Data bersifat in-memory.** Setiap kali server backend di-restart, data kembali ke isi awal `backend/src/data/*.json`. Ini perilaku yang diharapkan (bukan bug) sesuai spesifikasi tugas.
- Tidak ada autentikasi — semua endpoint `/api/*` dapat diakses tanpa token, sesuai lingkup tes.
