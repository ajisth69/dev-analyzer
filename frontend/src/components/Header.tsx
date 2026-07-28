import { Code2, Key, Zap, FolderGit2, Swords, Flame, LucideIcon } from 'lucide-react';
import { Github } from './GithubIcon';
import { getDailyUsage, getCustomGroqKey, DAILY_FREE_LIMIT } from '../hooks/useDevAnalyzer';

type Mode = 'user' | 'singlerepo' | 'repo' | 'devcompare';

interface Props {
  mode: Mode;
  setMode: (m: Mode) => void;
  onOpenKeyModal?: () => void;
}

const tabs: { id: Mode; label: string; Icon: LucideIcon }[] = [
  { id: 'user',       label: 'Dev Profile', Icon: Zap },
  { id: 'singlerepo', label: 'Repo Profile', Icon: FolderGit2 },
  { id: 'repo',       label: 'Repos Battle', Icon: Swords },
  { id: 'devcompare', label: 'Devs Battle', Icon: Flame },
];

export function Header({ mode, setMode, onOpenKeyModal }: Props) {
  const usage = getDailyUsage();
  const customKey = getCustomGroqKey();

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
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5"
              style={{
                background: mode === id ? 'var(--accent)' : 'transparent',
                color: mode === id ? 'white' : 'var(--text-secondary)',
                boxShadow: mode === id ? '0 2px 8px rgba(232, 168, 0, 0.3)' : 'none',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </nav>

        {/* Daily Limit / Custom Key Status */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenKeyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
            style={{
              background: customKey ? '#E6F4EA' : usage.count >= DAILY_FREE_LIMIT ? '#FCE8E6' : 'var(--accent-light)',
              color: customKey ? '#137333' : usage.count >= DAILY_FREE_LIMIT ? '#C5221F' : 'var(--text-secondary)',
              border: '1px solid var(--border-accent)',
            }}
            title={customKey ? 'Custom Groq API Key Active (Unlimited)' : `${usage.count}/${DAILY_FREE_LIMIT} Free Daily Analyses Used`}
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono">
              {customKey ? 'Groq Key Active' : `${usage.count}/${DAILY_FREE_LIMIT} Free Today`}
            </span>
          </button>

          <a
            href="https://github.com/ajisth69"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 shrink-0 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
