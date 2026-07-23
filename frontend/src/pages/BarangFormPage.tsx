import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  useBarangDetail,
  useCreateBarang,
  useUpdateBarang,
} from '../hooks/useBarang';
import { useKategori } from '../hooks/useKategori';
import { FormField, inputClass, inputErrorClass } from '../components/FormField';
import { Spinner } from '../components/Spinner';
import { ApiError } from '../api/client';
import type { BarangFormValues } from '../types';
import type { BarangPayload } from '../api/barang.api';

type FieldErrors = Partial<Record<keyof BarangFormValues, string>>;

const emptyForm: BarangFormValues = {
  kode_barang: '',
  nama_barang: '',
  id_kategori: '',
  satuan: '',
  harga_beli: '',
  harga_jual: '',
  is_aktif: true,
};

const KODE_PATTERN = /^[a-zA-Z0-9-]+$/;

export function BarangFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const barangId = id ? Number(id) : undefined;
  const isEdit = barangId !== undefined;

  const [values, setValues] = useState<BarangFormValues>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});

  const { data: kategoriList } = useKategori();
  const {
    data: detail,
    isLoading: loadingDetail,
    isError: detailError,
  } = useBarangDetail(barangId);
  const createMutation = useCreateBarang();
  const updateMutation = useUpdateBarang(barangId ?? -1);
  const submitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (isEdit && detail) {
      setValues({
        kode_barang: detail.kode_barang,
        nama_barang: detail.nama_barang,
        id_kategori: detail.id_kategori,
        satuan: detail.satuan,
        harga_beli: detail.harga_beli,
        harga_jual: detail.harga_jual,
        is_aktif: detail.is_aktif,
      });
    }
  }, [isEdit, detail]);

  useEffect(() => {
    if (detailError) {
      toast.error('Barang tidak ditemukan.');
      navigate('/master/barang', { replace: true });
    }
  }, [detailError, navigate]);

  const title = isEdit ? 'Ubah Barang' : 'Tambah Barang';

  function setField<K extends keyof BarangFormValues>(
    key: K,
    value: BarangFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    const kode = values.kode_barang.trim();
    if (!kode) next.kode_barang = 'Kode barang wajib diisi.';
    else if (kode.length > 50) next.kode_barang = 'Maksimal 50 karakter.';
    else if (!KODE_PATTERN.test(kode))
      next.kode_barang = 'Hanya huruf, angka, dan tanda hubung.';

    const nama = values.nama_barang.trim();
    if (!nama) next.nama_barang = 'Nama barang wajib diisi.';
    else if (nama.length > 200) next.nama_barang = 'Maksimal 200 karakter.';

    if (values.id_kategori === '') next.id_kategori = 'Kategori wajib dipilih.';

    const satuan = values.satuan.trim();
    if (!satuan) next.satuan = 'Satuan wajib diisi.';
    else if (satuan.length > 30) next.satuan = 'Maksimal 30 karakter.';

    if (values.harga_beli === '') next.harga_beli = 'Harga beli wajib diisi.';
    else if (Number(values.harga_beli) < 0)
      next.harga_beli = 'Harga beli tidak boleh negatif.';

    if (values.harga_jual === '') next.harga_jual = 'Harga jual wajib diisi.';
    else if (Number(values.harga_jual) < 0)
      next.harga_jual = 'Harga jual tidak boleh negatif.';
    else if (
      values.harga_beli !== '' &&
      Number(values.harga_jual) < Number(values.harga_beli)
    )
      next.harga_jual = 'Harga jual tidak boleh lebih kecil dari harga beli.';

    return next;
  }

  function mapServerErrors(apiError: ApiError) {
    if (apiError.fieldErrors.length > 0) {
      const mapped: FieldErrors = {};
      for (const fe of apiError.fieldErrors) {
        mapped[fe.field as keyof BarangFormValues] = fe.message;
      }
      setErrors(mapped);
      toast.error('Periksa kembali isian form.');
    } else {
      toast.error(apiError.message);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload: BarangPayload = {
      kode_barang: values.kode_barang.trim(),
      nama_barang: values.nama_barang.trim(),
      id_kategori: Number(values.id_kategori),
      satuan: values.satuan.trim(),
      harga_beli: Number(values.harga_beli),
      harga_jual: Number(values.harga_jual),
      is_aktif: values.is_aktif,
    };

    try {
      if (isEdit) {
        await updateMutation.mutateAsync(payload);
        toast.success('Barang berhasil diperbarui.');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Barang berhasil disimpan.');
      }
      navigate('/master/barang');
    } catch (err) {
      if (err instanceof ApiError) mapServerErrors(err);
      else toast.error('Gagal menyimpan barang.');
    }
  }

  const showForm = !isEdit || !loadingDetail;
  const kategoriOptions = useMemo(() => kategoriList ?? [], [kategoriList]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate('/master/barang')}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          &larr; Kembali ke daftar
        </button>
        <h2 className="mt-2 text-xl font-semibold text-slate-800">{title}</h2>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        {isEdit && loadingDetail ? (
          <Spinner label="Memuat data barang..." />
        ) : showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormField
              label="Kode Barang"
              htmlFor="kode_barang"
              required
              error={errors.kode_barang}
              hint="Contoh: BRG-006"
            >
              <input
                id="kode_barang"
                type="text"
                value={values.kode_barang}
                onChange={(e) => setField('kode_barang', e.target.value)}
                className={errors.kode_barang ? inputErrorClass : inputClass}
              />
            </FormField>

            <FormField
              label="Nama Barang"
              htmlFor="nama_barang"
              required
              error={errors.nama_barang}
            >
              <input
                id="nama_barang"
                type="text"
                value={values.nama_barang}
                onChange={(e) => setField('nama_barang', e.target.value)}
                className={errors.nama_barang ? inputErrorClass : inputClass}
              />
            </FormField>

            <FormField
              label="Kategori"
              htmlFor="id_kategori"
              required
              error={errors.id_kategori}
            >
              <select
                id="id_kategori"
                value={values.id_kategori}
                onChange={(e) =>
                  setField(
                    'id_kategori',
                    e.target.value === '' ? '' : Number(e.target.value)
                  )
                }
                className={errors.id_kategori ? inputErrorClass : inputClass}
              >
                <option value="">Pilih kategori...</option>
                {kategoriOptions.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama_kategori}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Satuan"
              htmlFor="satuan"
              required
              error={errors.satuan}
              hint="Contoh: pcs, kg, liter, box"
            >
              <input
                id="satuan"
                type="text"
                value={values.satuan}
                onChange={(e) => setField('satuan', e.target.value)}
                className={errors.satuan ? inputErrorClass : inputClass}
              />
            </FormField>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Harga Beli"
                htmlFor="harga_beli"
                required
                error={errors.harga_beli}
              >
                <input
                  id="harga_beli"
                  type="number"
                  min={0}
                  value={values.harga_beli}
                  onChange={(e) =>
                    setField(
                      'harga_beli',
                      e.target.value === '' ? '' : Number(e.target.value)
                    )
                  }
                  className={errors.harga_beli ? inputErrorClass : inputClass}
                />
              </FormField>

              <FormField
                label="Harga Jual"
                htmlFor="harga_jual"
                required
                error={errors.harga_jual}
              >
                <input
                  id="harga_jual"
                  type="number"
                  min={0}
                  value={values.harga_jual}
                  onChange={(e) =>
                    setField(
                      'harga_jual',
                      e.target.value === '' ? '' : Number(e.target.value)
                    )
                  }
                  className={errors.harga_jual ? inputErrorClass : inputClass}
                />
              </FormField>
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={values.is_aktif}
                onChange={(e) => setField('is_aktif', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Barang aktif</span>
            </label>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => navigate('/master/barang')}
                disabled={submitting}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}
