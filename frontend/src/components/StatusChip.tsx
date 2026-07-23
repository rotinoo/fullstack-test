interface StatusChipProps {
  active: boolean;
}

export function StatusChip({ active }: StatusChipProps) {
  return (
    <span
      className={
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' +
        (active
          ? 'bg-green-100 text-green-700'
          : 'bg-slate-200 text-slate-600')
      }
    >
      {active ? 'Aktif' : 'Nonaktif'}
    </span>
  );
}
