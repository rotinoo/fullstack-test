import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createBarang,
  deleteBarang,
  fetchBarangById,
  fetchBarangList,
  updateBarang,
  type BarangPayload,
} from '../api/barang.api';
import type { BarangListParams } from '../types';

const barangKeys = {
  all: ['barang'] as const,
  list: (params: BarangListParams) => ['barang', 'list', params] as const,
  detail: (id: number) => ['barang', 'detail', id] as const,
};

export function useBarangList(params: BarangListParams) {
  return useQuery({
    queryKey: barangKeys.list(params),
    queryFn: () => fetchBarangList(params),
    placeholderData: keepPreviousData,
  });
}

export function useBarangDetail(id: number | undefined) {
  return useQuery({
    queryKey: barangKeys.detail(id ?? -1),
    queryFn: () => fetchBarangById(id as number),
    enabled: typeof id === 'number' && !Number.isNaN(id),
  });
}

export function useCreateBarang() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BarangPayload) => createBarang(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: barangKeys.all });
    },
  });
}

export function useUpdateBarang(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BarangPayload) => updateBarang(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: barangKeys.all });
    },
  });
}

export function useDeleteBarang() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteBarang(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: barangKeys.all });
    },
  });
}
