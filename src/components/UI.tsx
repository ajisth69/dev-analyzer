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
export function ScoreRing({ value, max = 100, size = 88, color = '#38bdf8', label }: ScoreRingProps) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={6} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
            strokeDasharray={`${circ * pct} ${circ * (1-pct)}`}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-black text-white font-mono">{value}</span>
        </div>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
    </div>
  );
}

export function WinnerBadge({ color = 'text-emerald-400' }: { color?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${color === 'text-emerald-400' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : color === 'text-sky-400' ? 'border-sky-500/30 bg-sky-500/10 text-sky-400' : color === 'text-amber-400' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-rose-500/30 bg-rose-500/10 text-rose-400'} winner-pulse`}>
      🏆 Winner
    </span>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-2">{children}</p>;
}

export function DeepAnalysisSummary({ summary }: { summary: string }) {
  if (!summary) return null;
  return (
    <div className="relative group overflow-hidden rounded-3xl p-[1px] mt-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/30 via-indigo-500/30 to-purple-500/30 opacity-50 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
      <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 rounded-3xl opacity-20 group-hover:opacity-50 transition-opacity duration-500" />
      <div className="relative glass bg-[#050812]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <svg className="w-32 h-32 animate-[spin_30s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="0.5">
            <defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#818cf8" /></linearGradient></defs>
            <path d="M12 2v20M17 5l-10 14M21.1 9.5l-18.2 5M21.1 14.5l-18.2-5M17 19L7 5" />
          </svg>
        </div>
        <SectionLabel>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 font-black tracking-[0.2em] text-xs">
            🧠 Deep Analysis Engine
          </span>
        </SectionLabel>
        <div className="relative z-10 mt-6 space-y-4">
          {summary.split('\n').filter(Boolean).map((p, i) => (
            <p key={i} className="text-slate-200 text-[15px] leading-loose font-medium border-l-2 border-indigo-500/30 pl-4">{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

