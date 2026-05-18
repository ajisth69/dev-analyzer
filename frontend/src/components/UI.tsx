import React from 'react';

// Shared display components used across result views

export function TagPills({ tags }: { tags: string[] }) {
  if (!tags?.length) return null;
  const parsed = tags
    .map(tag => { const m = tag.match(/(\d+)%/); return { tag, pct: Number(m?.[1] || 0) }; })
    .filter(t => t.pct >= 3)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 14);
  const hidden = tags.length - parsed.length;
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {parsed.map(({ tag }, i) => <span key={i} className="tag-pill">{tag}</span>)}
      {hidden > 0 && <span className="tag-pill opacity-50">+{hidden} more</span>}
    </div>
  );
}

interface ScoreRingProps { value: number; max?: number; size?: number; color?: string; label: string }
export function ScoreRing({ value, max = 100, size = 88, color = '#E8A800', label }: ScoreRingProps) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={6} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
            strokeDasharray={`${circ * pct} ${circ * (1-pct)}`}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-black font-mono" style={{ color: 'var(--text-primary)' }}>{value}</span>
        </div>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{label}</span>
    </div>
  );
}

export function WinnerBadge({ color: _color = 'text-emerald-400' }: { color?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border winner-pulse`}
      style={{ background: 'var(--accent-light)', borderColor: 'var(--border-accent)', color: '#8B6914' }}>
      🏆 Winner
    </span>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--text-muted)' }}>{children}</p>;
}

export function DeepAnalysisSummary({ summary }: { summary: string }) {
  if (!summary) return null;
  return (
    <div className="relative group overflow-hidden rounded-3xl p-[1px] mt-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
      <div className="absolute inset-0 rounded-3xl opacity-20" style={{ background: 'linear-gradient(to right, var(--accent), #D4780A, #C05621)' }} />
      <div className="relative rounded-3xl p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <SectionLabel>
          <span className="font-black tracking-[0.2em] text-xs gradient-amber">
            🧠 Deep Analysis Engine
          </span>
        </SectionLabel>
        <div className="relative z-10 mt-6 space-y-4">
          {summary.split('\n').filter(Boolean).map((p, i) => (
            <p key={i} className="text-[15px] leading-loose font-medium border-l-2 pl-4" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-accent)' }}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
