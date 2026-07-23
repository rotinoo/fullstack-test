import axios from 'axios';
import type { ErrorResponse, FieldError } from '../types';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

/** Normalized error carrying the human message plus optional per-field errors. */
export class ApiError extends Error {
  status?: number;
  fieldErrors: FieldError[];

  constructor(message: string, status?: number, fieldErrors: FieldError[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    const data = error.response?.data;
    const message = data?.message ?? error.message ?? 'Terjadi kesalahan pada jaringan.';
    return new ApiError(message, error.response?.status, data?.errors ?? []);
  }
  if (error instanceof Error) {
    return new ApiError(error.message);
  }
  return new ApiError('Terjadi kesalahan yang tidak diketahui.');
}
