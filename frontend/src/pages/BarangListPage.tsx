import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useBarangList, useDeleteBarang } from '../hooks/useBarang';
import { useKategori } from '../hooks/useKategori';
import { useDebounce } from '../hooks/useDebounce';
import { formatRupiah } from '../utils/format';
import { StatusChip } from '../components/StatusChip';
import { Spinner } from '../components/Spinner';
import { Pagination } from '../components/Pagination';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Barang, BarangListParams } from '../types';
import { ApiError } from '../api/client';

const LIMIT = 10;

type StatusFilter = 'all' | 'aktif' | 'nonaktif';

export function BarangListPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState<number | ''>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [target, setTarget] = useState<Barang | null>(null);

  const debouncedSearch = useDebounce(searchInput, 300);

  // Any filter change should reset back to the first page.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, kategoriFilter, statusFilter]);

  const params = useMemo<BarangListParams>(() => {
    const p: BarangListParams = { page, limit: LIMIT };
    if (debouncedSearch.trim()) p.search = debouncedSearch.trim();
    if (kategoriFilter !== '') p.id_kategori = kategoriFilter;
    if (statusFilter === 'aktif') p.is_aktif = true;
    if (statusFilter === 'nonaktif') p.is_aktif = false;
    return p;
  }, [page, debouncedSearch, kategoriFilter, statusFilter]);

  const { data, isLoading, isError, error, isFetching } = useBarangList(params);
  const { data: kategoriList } = useKategori();
  const deleteMutation = useDeleteBarang();

  useEffect(() => {
    if (isError) {
      const message =
        error instanceof ApiError ? error.message : 'Gagal memuat data barang.';
      toast.error(message);
    }
  }, [isError, error]);

  const rows = data?.data ?? [];
  const pagination = data?.pagination;

  async function handleDelete() {
    if (!target) return;
    try {
      await deleteMutation.mutateAsync(target.id);
      toast.success(`"${target.nama_barang}" berhasil dinonaktifkan.`);
      setTarget(null);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Gagal menonaktifkan barang.';
      toast.error(message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Daftar Barang</h2>
          <p className="text-sm text-slate-500">
            Kelola data master barang beserta kategorinya.
          </p>
        </div>
        <Link
          to="/master/barang/tambah"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Tambah Barang
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-lg bg-white p-4 shadow-sm sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="search" className="text-xs font-medium text-slate-500">
            Cari
          </label>
          <input
            id="search"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari kode atau nama barang..."
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="kategori" className="text-xs font-medium text-slate-500">
            Kategori
          </label>
          <select
            id="kategori"
            value={kategoriFilter}
            onChange={(e) =>
              setKategoriFilter(e.target.value === '' ? '' : Number(e.target.value))
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Semua kategori</option>
            {kategoriList?.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama_kategori}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-xs font-medium text-slate-500">
            Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">Semua status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Nama Barang</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Satuan</th>
                <th className="px-4 py-3 text-right">Harga Beli</th>
                <th className="px-4 py-3 text-right">Harga Jual</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={9}>
                    <Spinner />
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                    Tidak ada barang yang cocok dengan filter saat ini.
                  </td>
                </tr>
              ) : (
                rows.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-500">
                      {(pagination ? (pagination.page - 1) * pagination.limit : 0) +
                        index +
                        1}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-700">
                        {item.kode_barang}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {item.nama_barang}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.kategori?.nama_kategori ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.satuan}</td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {formatRupiah(item.harga_beli)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {formatRupiah(item.harga_jual)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusChip active={item.is_aktif} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/master/barang/${item.id}/ubah`)}
                          className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Ubah
                        </button>
                        <button
                          type="button"
                          onClick={() => setTarget(item)}
                          disabled={!item.is_aktif}
                          className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Nonaktifkan
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onChange={setPage}
          />
        )}
      </div>

      {isFetching && !isLoading && (
        <p className="text-right text-xs text-slate-400">Memperbarui data...</p>
      )}

      <ConfirmDialog
        open={target !== null}
        title="Nonaktifkan barang?"
        message={
          target
            ? `Barang "${target.nama_barang}" (${target.kode_barang}) akan dinonaktifkan (soft delete).`
            : ''
        }
        confirmLabel="Nonaktifkan"
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}
