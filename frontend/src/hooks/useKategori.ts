import { useQuery } from '@tanstack/react-query';
import { fetchKategoriList } from '../api/kategori.api';

export function useKategori() {
  return useQuery({
    queryKey: ['kategori'],
    queryFn: fetchKategoriList,
    staleTime: 5 * 60 * 1000,
  });
}
