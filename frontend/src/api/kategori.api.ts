import { apiClient, toApiError } from './client';
import type { ItemResponse, Kategori } from '../types';

export async function fetchKategoriList(): Promise<Kategori[]> {
  try {
    const { data } = await apiClient.get<ItemResponse<Kategori[]>>('/kategori');
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}
