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

const headings: Record<Mode, { title: string; sub: string; gradient: string }> = {
  user:       { title: 'Analyze Engineering Caliber',  gradient: 'gradient-blue',   sub: 'Enter a GitHub username for Dev IQ, role fit, language profile & Deep Analysis.' },
  singlerepo: { title: 'Analyze Repository Profile',  gradient: 'gradient-purple',  sub: 'Enter a repo (owner/repo) for architecture signals, quality score & Deep Analysis insights.' },
  repo:       { title: 'Repository Battle Mode',      gradient: 'gradient-rose',    sub: 'Compare two repositories head-to-head and crown the winner.' },
  devcompare: { title: 'Developer Battle Mode',       gradient: 'gradient-amber',   sub: 'Compare two GitHub developers and declare a champion.' },
};

function SpinnerBtn({ loading, label, colorClass }: { loading: boolean; label: string; colorClass: string }) {
  return (
    <button type="submit" disabled={loading} className={`shrink-0 px-7 py-3 rounded-2xl font-black text-sm tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 ${colorClass}`}>
      {loading
        ? <div className="w-5 h-5 border-[3px] border-current/30 border-t-current rounded-full animate-spin" />
        : label}
    </button>
  );
}

function DualInput({ val1, setVal1, ph1, val2, setVal2, ph2, loading, btnLabel, btnClass, borderFocus1, borderFocus2 }: any) {
  const canSubmit = val1.trim() && val2.trim() && !loading;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/3 border border-white/6 rounded-3xl p-3 shadow-2xl">
      <input value={val1} onChange={e => setVal1(e.target.value)} placeholder={ph1}
        className={`search-input py-3.5 px-5 ${borderFocus1}`} />
      <div className="vs-badge text-[11px]">VS</div>
      <input value={val2} onChange={e => setVal2(e.target.value)} placeholder={ph2}
        className={`search-input py-3.5 px-5 ${borderFocus2}`} />
      <button type="submit" disabled={!canSubmit}
        className={`shrink-0 w-full sm:w-auto px-7 py-3.5 rounded-2xl font-black text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${btnClass}`}>
        {loading ? <div className="w-5 h-5 border-[3px] border-current/30 border-t-current rounded-full animate-spin" /> : btnLabel}
      </button>
    </div>
  );
}

export function SearchBar(props: Props) {
  const { mode, loading, onSubmit } = props;
  const h = headings[mode];
  return (
    <div className="flex flex-col items-center text-center space-y-8 pb-4">
      <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-1.5 text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        AI-Powered GitHub Intelligence
      </div>
      <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-[1.05] tracking-tighter">
        {h.title.split(' ').slice(0, -1).join(' ')}{' '}
        <span className={h.gradient}>{h.title.split(' ').slice(-1)}</span>
      </h1>
      <p className="text-slate-400 max-w-xl text-base md:text-lg font-medium leading-relaxed">{h.sub}</p>

      <form onSubmit={onSubmit} className="w-full max-w-3xl">
        {mode === 'user' && (
          <div className="flex gap-3 bg-white/3 border border-white/6 rounded-3xl p-3 shadow-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
              <input value={props.usernameInput} onChange={e => props.setUsernameInput(e.target.value)}
                placeholder="e.g. torvalds, gaearon, ajisth69..."
                className="search-input pl-12 pr-4 py-4 text-base" />
            </div>
            <SpinnerBtn loading={loading} label="Analyze →" colorClass="bg-gradient-to-r from-sky-500 to-indigo-500 text-white glow-blue" />
          </div>
        )}

        {mode === 'singlerepo' && (
          <div className="flex gap-3 bg-white/3 border border-white/6 rounded-3xl p-3 shadow-2xl">
            <div className="relative flex-1">
              <Box className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
              <input value={props.singleRepoInput} onChange={e => props.setSingleRepoInput(e.target.value)}
                placeholder="e.g. facebook/react, vercel/next.js..."
                className="search-input pl-12 pr-4 py-4 text-base" />
            </div>
            <SpinnerBtn loading={loading} label="Analyze →" colorClass="bg-gradient-to-r from-violet-600 to-purple-500 text-white glow-purple" />
          </div>
        )}

        {mode === 'repo' && (
          <DualInput
            val1={props.repo1Input} setVal1={props.setRepo1Input} ph1="e.g. vuejs/core"
            val2={props.repo2Input} setVal2={props.setRepo2Input} ph2="e.g. facebook/react"
            loading={loading} btnLabel="⚔️ Battle!" btnClass="bg-gradient-to-r from-rose-600 to-red-500 text-white glow-rose"
            borderFocus1="focus:border-rose-500/50" borderFocus2="focus:border-sky-500/50"
          />
        )}

        {mode === 'devcompare' && (
          <DualInput
            val1={props.dev1Input} setVal1={props.setDev1Input} ph1="e.g. torvalds"
            val2={props.dev2Input} setVal2={props.setDev2Input} ph2="e.g. gaearon"
            loading={loading} btnLabel="🔥 Battle!" btnClass="bg-gradient-to-r from-amber-500 to-orange-500 text-white glow-amber"
            borderFocus1="focus:border-amber-500/50" borderFocus2="focus:border-orange-500/50"
          />
        )}
      </form>
    </div>
  );
}
