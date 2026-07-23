import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

export const inputErrorClass =
  'w-full rounded-md border border-red-400 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100';
