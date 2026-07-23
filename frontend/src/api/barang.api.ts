import { apiClient, toApiError } from './client';
import type {
  Barang,
  BarangListParams,
  ItemResponse,
  ListResponse,
} from '../types';

export interface BarangPayload {
  kode_barang: string;
  nama_barang: string;
  id_kategori: number;
  satuan: string;
  harga_beli: number;
  harga_jual: number;
  is_aktif: boolean;
}

export async function fetchBarangList(
  params: BarangListParams
): Promise<ListResponse<Barang>> {
  try {
    const { data } = await apiClient.get<ListResponse<Barang>>('/barang', { params });
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function fetchBarangById(id: number): Promise<Barang> {
  try {
    const { data } = await apiClient.get<ItemResponse<Barang>>(`/barang/${id}`);
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function createBarang(payload: BarangPayload): Promise<Barang> {
  try {
    const { data } = await apiClient.post<ItemResponse<Barang>>('/barang', payload);
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function updateBarang(id: number, payload: BarangPayload): Promise<Barang> {
  try {
    const { data } = await apiClient.put<ItemResponse<Barang>>(`/barang/${id}`, payload);
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function deleteBarang(id: number): Promise<Barang> {
  try {
    const { data } = await apiClient.delete<ItemResponse<Barang>>(`/barang/${id}`);
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}
