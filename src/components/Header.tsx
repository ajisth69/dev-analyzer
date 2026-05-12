import { Github, Code2 } from 'lucide-react';

type Mode = 'user' | 'singlerepo' | 'repo' | 'devcompare';

interface Props {
  mode: Mode;
  setMode: (m: Mode) => void;
}

const tabs: { id: Mode; label: string; activeClass: string }[] = [
  { id: 'user',       label: '⚡ Dev Profile',   activeClass: 'active-blue' },
  { id: 'singlerepo', label: '📦 Repo Profile',  activeClass: 'active-indigo' },
  { id: 'repo',       label: '⚔️ Repos Battle',  activeClass: 'active-rose' },
  { id: 'devcompare', label: '🔥 Devs Battle',   activeClass: 'active-amber' },
];

export function Header({ mode, setMode }: Props) {
  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[70px] flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg glow-blue">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-display text-lg font-black text-white tracking-tight">
              Dev<span className="gradient-blue">Analyzer</span>
            </span>
            <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">GitHub Intelligence Engine</div>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav className="flex items-center gap-1 bg-white/3 border border-white/5 rounded-2xl p-1.5 overflow-x-auto">
          {tabs.map(({ id, label, activeClass }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`nav-tab ${mode === id ? activeClass : ''}`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Credit */}
        <a
          href="https://github.com/ajisth69"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 shrink-0 text-slate-500 hover:text-sky-400 transition-colors"
        >
          <Github className="w-4 h-4" />
          <span className="text-xs font-semibold font-mono">ajisth69</span>
        </a>
      </div>
    </header>
  );
}
