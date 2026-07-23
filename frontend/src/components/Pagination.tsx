interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, onChange }: PaginationProps) {
  const canPrev = page > 1;
  const canNext = totalPages > 0 && page < totalPages;

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row">
      <p className="text-sm text-slate-500">
        Halaman <span className="font-medium">{totalPages === 0 ? 0 : page}</span> dari{' '}
        <span className="font-medium">{totalPages}</span> &middot; {total} data
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={!canPrev}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sebelumnya
        </button>
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={!canNext}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}
