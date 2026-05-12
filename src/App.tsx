import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Search, Command, X, Camera } from 'lucide-react';
import { useDevAnalyzer } from './hooks/useDevAnalyzer';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { UserProfile, RepoProfile } from './components/ProfileViews';
import { DevBattle, RepoBattle } from './components/BattleViews';
import html2canvas from 'html2canvas';

type Mode = 'user' | 'singlerepo' | 'repo' | 'devcompare';

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
    // Deep Linking: Parse URL on mount
    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get('mode') as Mode;
    if (urlMode) setMode(urlMode);

    if (urlMode === 'user' && params.get('user')) {
      setUsernameInput(params.get('user')!);
      analyze(params.get('user')!);
    } else if (urlMode === 'singlerepo' && params.get('repo')) {
      setSingleRepoInput(params.get('repo')!);
      analyzeRepo(params.get('repo')!);
    } else if (urlMode === 'repo' && params.get('r1') && params.get('r2')) {
      setRepo1Input(params.get('r1')!);
      setRepo2Input(params.get('r2')!);
      compareRepos(params.get('r1')!, params.get('r2')!);
    } else if (urlMode === 'devcompare' && params.get('d1') && params.get('d2')) {
      setDev1Input(params.get('d1')!);
      setDev2Input(params.get('d2')!);
      compareDevs(params.get('d1')!, params.get('d2')!);
    }

    // Command Palette Listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
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
    if (mode === 'user' && usernameInput.trim()) {
      analyze(usernameInput.trim());
      updateUrl('user', { user: usernameInput.trim() });
    } else if (mode === 'singlerepo' && singleRepoInput.trim()) {
      analyzeRepo(singleRepoInput.trim());
      updateUrl('singlerepo', { repo: singleRepoInput.trim() });
    } else if (mode === 'repo' && repo1Input.trim() && repo2Input.trim()) {
      compareRepos(repo1Input.trim(), repo2Input.trim());
      updateUrl('repo', { r1: repo1Input.trim(), r2: repo2Input.trim() });
    } else if (mode === 'devcompare' && dev1Input.trim() && dev2Input.trim()) {
      compareDevs(dev1Input.trim(), dev2Input.trim());
      updateUrl('devcompare', { d1: dev1Input.trim(), d2: dev2Input.trim() });
    }
  };

  const handleExport = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await html2canvas(resultRef.current, { backgroundColor: '#050812', scale: 2 });
      const link = document.createElement('a');
      link.download = 'dev-analyzer-report.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050812] text-slate-200 relative overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb w-[600px] h-[600px] bg-sky-600/8 -top-32 -left-32" style={{ animationDelay: '0s' }} />
        <div className="orb w-[500px] h-[500px] bg-violet-600/6 top-1/2 -right-48" style={{ animationDelay: '3s' }} />
        <div className="orb w-[400px] h-[400px] bg-rose-600/5 bottom-0 left-1/3" style={{ animationDelay: '6s' }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
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

        {/* Loading Skeleton */}
        {loading && (
          <div className="mt-16 space-y-5">
            <div className="shimmer h-48 rounded-3xl" />
            <div className="grid grid-cols-5 gap-5">
              <div className="shimmer h-64 rounded-3xl col-span-2" />
              <div className="shimmer h-64 rounded-3xl col-span-3" />
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mt-12 p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-4 max-w-2xl mx-auto animate-slide-up">
            <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-300 text-lg">Analysis Failed</p>
              <p className="text-rose-400/80 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && (
          <div className="mt-16 relative">
            {(data || repoData || compareDevsData || compareData) && (
              <div className="absolute -top-12 right-0 z-50">
                <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 rounded-full text-sm font-medium transition-colors">
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

      {/* Footer Credit */}
      <footer className="relative z-10 text-center py-8 mt-8 border-t border-white/4 flex flex-col items-center gap-2">
        <p className="text-slate-600 text-xs font-mono">
          Built with ❤️ by{' '}
          <a href="https://github.com/ajisth69" target="_blank" rel="noopener noreferrer"
            className="text-sky-500 hover:text-sky-400 font-bold transition-colors">
            @ajisth69
          </a>
          {' '}· Powered by Deterministic Analysis Engine
        </p>
        <button onClick={() => setCmdOpen(true)} className="text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-400 font-bold flex items-center gap-1 transition-colors">
          <Command className="w-3 h-3" /> Press Cmd + K to open menu
        </button>
      </footer>

      {/* Command Palette Modal */}
      {cmdOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] bg-black/60 backdrop-blur-sm p-4">
          <div className="glass bg-[#050812]/90 border border-white/10 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
              <Search className="w-5 h-5 text-slate-400" />
              <input 
                autoFocus
                type="text" 
                placeholder="Jump to a mode (e.g. 'User', 'Repo', 'Battle')..."
                className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-600"
                onChange={(e) => {
                  const val = e.target.value.toLowerCase();
                  if (val.includes('user')) { setMode('user'); setCmdOpen(false); }
                  if (val.includes('repo')) { setMode('singlerepo'); setCmdOpen(false); }
                  if (val.includes('battle') || val.includes('compare')) { setMode('devcompare'); setCmdOpen(false); }
                }}
              />
              <button onClick={() => setCmdOpen(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-2 space-y-1">
              <p className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-500">Quick Actions</p>
              <button onClick={() => { setMode('user'); setCmdOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 flex items-center gap-3 text-slate-300">
                 Analyze Developer
              </button>
              <button onClick={() => { setMode('singlerepo'); setCmdOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 flex items-center gap-3 text-slate-300">
                 Analyze Single Repo
              </button>
              <button onClick={() => { setMode('devcompare'); setCmdOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 flex items-center gap-3 text-slate-300">
                 Battle Mode
              </button>
              <button onClick={() => { handleExport(); setCmdOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 flex items-center gap-3 text-sky-400">
                 <Camera className="w-4 h-4" /> Export Current View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
