import { Github, Code2 } from 'lucide-react';

type Mode = 'user' | 'singlerepo' | 'repo' | 'devcompare';

interface Props {
  mode: Mode;
  setMode: (m: Mode) => void;
}

const tabs: { id: Mode; label: string }[] = [
  { id: 'user',       label: '⚡ Dev Profile' },
  { id: 'singlerepo', label: '📦 Repo Profile' },
  { id: 'repo',       label: '⚔️ Repos Battle' },
  { id: 'devcompare', label: '🔥 Devs Battle' },
];

export function Header({ mode, setMode }: Props) {
  return (
    <header className="sticky top-0 z-50" style={{ background: 'rgba(255, 253, 247, 0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[70px] flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'var(--accent)', color: 'white' }}>
            <Code2 className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Dev<span className="gradient-amber">Analyzer</span>
            </span>
            <div className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Deterministic Analysis Engine</div>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav className="flex items-center gap-1 rounded-2xl p-1.5 overflow-x-auto" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-accent)' }}>
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all"
              style={{
                background: mode === id ? 'var(--accent)' : 'transparent',
                color: mode === id ? 'white' : 'var(--text-secondary)',
                boxShadow: mode === id ? '0 2px 8px rgba(232, 168, 0, 0.3)' : 'none',
              }}
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
          className="hidden md:flex items-center gap-2 shrink-0 transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <Github className="w-4 h-4" />
          <span className="text-xs font-semibold font-mono">ajisth69</span>
        </a>
      </div>
    </header>
  );
}
