interface RatingBarProps {
  label: string;
  value: number;
}

export function RatingBar({ label, value }: RatingBarProps) {
  const width = (value / 10) * 100;
  const color =
    value <= 3 ? 'var(--con)' :
    value <= 6 ? '#eab308' :
    value <= 8 ? 'var(--accent)' :
    'var(--pro)';

  return (
    <div
      className="flex items-center gap-3"
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={10}
      aria-label={`${label}: ${value} de 10`}
    >
      <span className="text-xs font-medium w-36 shrink-0" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
      <span className="mono text-xs font-bold w-8 text-right">
        {value}
      </span>
    </div>
  );
}
