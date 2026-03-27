interface ProsConsBoxProps {
  pros: string[];
  cons: string[];
}

export function ProsConsBox({ pros, cons }: ProsConsBoxProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 rounded overflow-hidden" style={{ border: '1px solid var(--border)', borderTop: '2px solid var(--color-secondary)' }}>
      <div className="p-5">
        <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--pro)' }}>
          A favor
        </h4>
        <ul className="space-y-2.5">
          {pros.map((pro, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
              <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--pro)' }} />
              {pro}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-5" style={{ borderLeft: '1px solid var(--border)', borderTop: 'none' }}>
        <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--con)' }}>
          En contra
        </h4>
        <ul className="space-y-2.5">
          {cons.map((con, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
              <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--con)' }} />
              {con}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
