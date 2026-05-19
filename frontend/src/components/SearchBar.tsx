import React from 'react';
import { Search, Box } from 'lucide-react';

type Mode = 'user' | 'singlerepo' | 'repo' | 'devcompare';

interface Props {
  mode: Mode;
  loading: boolean;
  usernameInput: string; setUsernameInput: (v: string) => void;
  singleRepoInput: string; setSingleRepoInput: (v: string) => void;
  repo1Input: string; setRepo1Input: (v: string) => void;
  repo2Input: string; setRepo2Input: (v: string) => void;
  dev1Input: string; setDev1Input: (v: string) => void;
  dev2Input: string; setDev2Input: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const headings: Record<Mode, { title: string; sub: string }> = {
  user:       { title: 'Analyze Engineering Caliber',  sub: 'Enter a GitHub username for Dev IQ, role fit, language profile & deep analysis.' },
  singlerepo: { title: 'Analyze Repository Profile',  sub: 'Enter a repo (owner/repo) for architecture signals, quality score & insights.' },
  repo:       { title: 'Repository Battle Mode',      sub: 'Compare two repositories head-to-head and crown the winner.' },
  devcompare: { title: 'Developer Battle Mode',       sub: 'Compare two GitHub developers and declare a champion.' },
};

const btnStyle: React.CSSProperties = {
  background: 'var(--accent)',
  color: 'white',
  boxShadow: '0 4px 14px rgba(232, 168, 0, 0.3)',
};

const wrapStyle: React.CSSProperties = {
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border)',
  borderRadius: '24px',
  padding: '12px',
  boxShadow: 'var(--shadow-lg)',
};

function SpinnerBtn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button type="submit" disabled={loading} className="shrink-0 px-7 py-3 rounded-2xl font-black text-sm tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2" style={btnStyle}>
      {loading ? <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" /> : label}
    </button>
  );
}

interface DualInputProps {
  val1: string;
  setVal1: (v: string) => void;
  ph1: string;
  val2: string;
  setVal2: (v: string) => void;
  ph2: string;
  loading: boolean;
  btnLabel: string;
}

function DualInput({ val1, setVal1, ph1, val2, setVal2, ph2, loading, btnLabel }: DualInputProps) {
  const canSubmit = val1.trim() && val2.trim() && !loading;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3" style={wrapStyle}>
      <input value={val1} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVal1(e.target.value)} placeholder={ph1} className="search-input py-3.5 px-5" />
      <div className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'var(--accent-light)', color: '#8B6914' }}>VS</div>
      <input value={val2} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVal2(e.target.value)} placeholder={ph2} className="search-input py-3.5 px-5" />
      <button type="submit" disabled={!canSubmit} className="shrink-0 w-full sm:w-auto px-7 py-3.5 rounded-2xl font-black text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2" style={btnStyle}>
        {loading ? <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" /> : btnLabel}
      </button>
    </div>
  );
}

export function SearchBar(props: Props) {
  const { mode, loading, onSubmit } = props;
  const h = headings[mode];
  return (
    <div className="flex flex-col items-center text-center space-y-8 pb-4">
      <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider" style={{ background: 'var(--accent-light)', color: '#8B6914', border: '1px solid var(--border-accent)' }}>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
        Deterministic Analysis Engine
      </div>
      <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tighter" style={{ color: 'var(--text-primary)' }}>
        {h.title.split(' ').slice(0, -1).join(' ')}{' '}
        <span className="gradient-amber">{h.title.split(' ').slice(-1)}</span>
      </h1>
      <p className="max-w-xl text-base md:text-lg font-medium leading-relaxed" style={{ color: 'var(--text-muted)' }}>{h.sub}</p>

      <form onSubmit={onSubmit} className="w-full max-w-3xl">
        {mode === 'user' && (
          <div className="flex gap-3" style={wrapStyle}>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input value={props.usernameInput} onChange={e => props.setUsernameInput(e.target.value)}
                placeholder="e.g. torvalds, gaearon, ajisth69..."
                className="search-input pl-12 pr-4 py-4 text-base" />
            </div>
            <SpinnerBtn loading={loading} label="Analyze →" />
          </div>
        )}

        {mode === 'singlerepo' && (
          <div className="flex gap-3" style={wrapStyle}>
            <div className="relative flex-1">
              <Box className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input value={props.singleRepoInput} onChange={e => props.setSingleRepoInput(e.target.value)}
                placeholder="e.g. facebook/react, vercel/next.js..."
                className="search-input pl-12 pr-4 py-4 text-base" />
            </div>
            <SpinnerBtn loading={loading} label="Analyze →" />
          </div>
        )}

        {mode === 'repo' && (
          <DualInput
            val1={props.repo1Input} setVal1={props.setRepo1Input} ph1="e.g. vuejs/core"
            val2={props.repo2Input} setVal2={props.setRepo2Input} ph2="e.g. facebook/react"
            loading={loading} btnLabel="⚔️ Battle!"
          />
        )}

        {mode === 'devcompare' && (
          <DualInput
            val1={props.dev1Input} setVal1={props.setDev1Input} ph1="e.g. torvalds"
            val2={props.dev2Input} setVal2={props.setDev2Input} ph2="e.g. gaearon"
            loading={loading} btnLabel="🔥 Battle!"
          />
        )}
      </form>
    </div>
  );
}
