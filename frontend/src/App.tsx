import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Search, Command, X, Camera } from 'lucide-react';
import { useDevAnalyzer } from './hooks/useDevAnalyzer';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { UserProfile, RepoProfile } from './components/ProfileViews';
import { DevBattle, RepoBattle } from './components/BattleViews';
import html2canvas from 'html2canvas';

type Mode = 'user' | 'singlerepo' | 'repo' | 'devcompare';

const LOADING_STEPS = [
  'Connecting to GitHub API...',
  'Fetching repository data...',
  'Scanning codebase structure...',
  'Running deterministic analysis engine...',
  'Evaluating code quality signals...',
  'Analyzing architecture patterns...',
  'Computing security audit...',
  'Generating intelligence report...',
  'Finalizing scores...',
];

function LoadingScreen() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => Math.min(s + 1, LOADING_STEPS.length - 1));
      setProgress(p => Math.min(p + 8 + Math.random() * 7, 95));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen mt-16 animate-slide-up">
      <div className="loading-pulse" />
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1A1A1A', marginBottom: '8px' }}>
          Analyzing Profile
        </h3>
        <p style={{ fontSize: '13px', color: '#8A8A8A', fontWeight: 500 }}>
          Deterministic Analysis Engine
        </p>
      </div>
      <div className="loading-progress">
        <div className="loading-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="loading-status">{LOADING_STEPS[step]}</p>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState<Mode>('user');
  const [usernameInput, setUsernameInput] = useState('');
  const [singleRepoInput, setSingleRepoInput] = useState('');
  const [repo1Input, setRepo1Input] = useState('');
  const [repo2Input, setRepo2Input] = useState('');
  const [dev1Input, setDev1Input] = useState('');
  const [dev2Input, setDev2Input] = useState('');

  const { analyze, analyzeRepo, compareRepos, compareDevs, loading, error, data, repoData, compareData, compareDevsData } = useDevAnalyzer();
  const [cmdOpen, setCmdOpen] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get('mode') as Mode;
    if (urlMode) setMode(urlMode);
    if (urlMode === 'user' && params.get('user')) { setUsernameInput(params.get('user')!); analyze(params.get('user')!); }
    else if (urlMode === 'singlerepo' && params.get('repo')) { setSingleRepoInput(params.get('repo')!); analyzeRepo(params.get('repo')!); }
    else if (urlMode === 'repo' && params.get('r1') && params.get('r2')) { setRepo1Input(params.get('r1')!); setRepo2Input(params.get('r2')!); compareRepos(params.get('r1')!, params.get('r2')!); }
    else if (urlMode === 'devcompare' && params.get('d1') && params.get('d2')) { setDev1Input(params.get('d1')!); setDev2Input(params.get('d2')!); compareDevs(params.get('d1')!, params.get('d2')!); }

    const handleKeyDown = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(o => !o); } };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateUrl = (newMode: Mode, params: Record<string, string>) => {
    const url = new URL(window.location.href);
    url.search = new URLSearchParams({ mode: newMode, ...params }).toString();
    window.history.pushState({}, '', url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'user' && usernameInput.trim()) { analyze(usernameInput.trim()); updateUrl('user', { user: usernameInput.trim() }); }
    else if (mode === 'singlerepo' && singleRepoInput.trim()) { analyzeRepo(singleRepoInput.trim()); updateUrl('singlerepo', { repo: singleRepoInput.trim() }); }
    else if (mode === 'repo' && repo1Input.trim() && repo2Input.trim()) { compareRepos(repo1Input.trim(), repo2Input.trim()); updateUrl('repo', { r1: repo1Input.trim(), r2: repo2Input.trim() }); }
    else if (mode === 'devcompare' && dev1Input.trim() && dev2Input.trim()) { compareDevs(dev1Input.trim(), dev2Input.trim()); updateUrl('devcompare', { d1: dev1Input.trim(), d2: dev2Input.trim() }); }
  };

  const handleExport = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await html2canvas(resultRef.current, { backgroundColor: '#FFFDF7', scale: 2 });
      const link = document.createElement('a');
      link.download = 'dev-analyzer-report.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) { console.error('Export failed:', err); }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb w-[600px] h-[600px] -top-32 -left-32" style={{ background: 'rgba(232, 168, 0, 0.06)', animationDelay: '0s' }} />
        <div className="orb w-[500px] h-[500px] top-1/2 -right-48" style={{ background: 'rgba(212, 120, 10, 0.04)', animationDelay: '3s' }} />
        <div className="orb w-[400px] h-[400px] bottom-0 left-1/3" style={{ background: 'rgba(255, 200, 50, 0.04)', animationDelay: '6s' }} />
      </div>

      <Header mode={mode} setMode={setMode} />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <SearchBar
          mode={mode} loading={loading} onSubmit={handleSubmit}
          usernameInput={usernameInput} setUsernameInput={setUsernameInput}
          singleRepoInput={singleRepoInput} setSingleRepoInput={setSingleRepoInput}
          repo1Input={repo1Input} setRepo1Input={setRepo1Input}
          repo2Input={repo2Input} setRepo2Input={setRepo2Input}
          dev1Input={dev1Input} setDev1Input={setDev1Input}
          dev2Input={dev2Input} setDev2Input={setDev2Input}
        />

        {loading && <LoadingScreen />}

        {error && !loading && (
          <div className="mt-12 p-6 rounded-2xl flex items-start gap-4 max-w-2xl mx-auto animate-slide-up" style={{ background: '#FFF0F0', border: '1px solid #FFD0D0' }}>
            <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" style={{ color: '#E53E3E' }} />
            <div>
              <p className="font-bold text-lg" style={{ color: '#C53030' }}>Analysis Failed</p>
              <p className="text-sm mt-1" style={{ color: '#9B2C2C' }}>{error}</p>
            </div>
          </div>
        )}

        {!loading && (
          <div className="mt-16 relative">
            {(data || repoData || compareDevsData || compareData) && (
              <div className="absolute -top-12 right-0 z-50">
                <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all" style={{ background: 'var(--accent-light)', color: '#8B6914', border: '1px solid var(--border-accent)' }}>
                  <Camera className="w-4 h-4" /> Export Report
                </button>
              </div>
            )}
            <div ref={resultRef} className="p-4 rounded-3xl">
              {data && mode === 'user' && <UserProfile data={data} />}
              {repoData && mode === 'singlerepo' && <RepoProfile data={repoData} />}
              {compareDevsData && mode === 'devcompare' && <DevBattle data={compareDevsData} />}
              {compareData && mode === 'repo' && <RepoBattle data={compareData} />}
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 text-center py-8 mt-8 flex flex-col items-center gap-2" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          Built with ❤️ by{' '}
          <a href="https://github.com/ajisth69" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 700 }}>@ajisth69</a>
          {' '}· Powered by Deterministic Analysis Engine
        </p>
        <button onClick={() => setCmdOpen(true)} className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 transition-colors" style={{ color: 'var(--text-muted)' }}>
          <Command className="w-3 h-3" /> Press Cmd + K to open menu
        </button>
      </footer>

      {cmdOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] p-4" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-scale-in" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <Search className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input autoFocus type="text" placeholder="Jump to a mode..."
                className="bg-transparent border-none outline-none w-full" style={{ color: 'var(--text-primary)' }}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase();
                  if (val.includes('user')) { setMode('user'); setCmdOpen(false); }
                  if (val.includes('repo')) { setMode('singlerepo'); setCmdOpen(false); }
                  if (val.includes('battle') || val.includes('compare')) { setMode('devcompare'); setCmdOpen(false); }
                }}
              />
              <button onClick={() => setCmdOpen(false)} style={{ color: 'var(--text-muted)' }} aria-label="Close menu"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-2 space-y-1">
              <p className="px-3 py-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Quick Actions</p>
              {[
                ['user', '👤 Analyze Developer'],
                ['singlerepo', '📦 Analyze Single Repo'],
                ['devcompare', '⚔️ Battle Mode'],
              ].map(([m, label]) => (
                <button key={m} onClick={() => { setMode(m as Mode); setCmdOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors" style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-light)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
