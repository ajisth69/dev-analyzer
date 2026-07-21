import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Search, Command, X, FileText, Printer, Heart, User, FolderGit2, Swords } from 'lucide-react';
import { useDevAnalyzer, getDailyUsage, getCustomGroqKey, DAILY_FREE_LIMIT } from './hooks/useDevAnalyzer';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { UserProfile, RepoProfile } from './components/ProfileViews';
import { DevBattle, RepoBattle } from './components/BattleViews';
import { LimitModal } from './components/LimitModal';
import { ReportPdfTemplate } from './components/ReportPdfTemplate';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  const [cmdOpen, setCmdOpen] = useState(false);
  const [limitModalOpen, setLimitModalOpen] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const pdfTemplateRef = useRef<HTMLDivElement>(null);

  const {
    loading,
    error,
    data,
    repoData,
    compareData,
    compareDevsData,
    analyze,
    analyzeRepo,
    compareRepos,
    compareDevs,
  } = useDevAnalyzer();

  const [pendingAction, setPendingAction] = useState<((key: string) => void) | null>(null);

  const checkLimitAndExecute = (action: (customKey?: string) => void) => {
    const usage = getDailyUsage();
    const customKey = getCustomGroqKey();
    if (usage.count >= DAILY_FREE_LIMIT && !customKey) {
      setPendingAction(() => (k: string) => action(k));
      setLimitModalOpen(true);
      return;
    }
    action(customKey);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get('mode') as Mode;
    const u = params.get('u');
    const r = params.get('r');
    const r1 = params.get('r1');
    const r2 = params.get('r2');
    const d1 = params.get('d1');
    const d2 = params.get('d2');

    if (m) setMode(m);

    if (m === 'user' && u) {
      setUsernameInput(u);
      checkLimitAndExecute((key) => analyze(u, key));
    } else if (m === 'singlerepo' && r) {
      setSingleRepoInput(r);
      checkLimitAndExecute((key) => analyzeRepo(r, key));
    } else if (m === 'repo' && r1 && r2) {
      setRepo1Input(r1);
      setRepo2Input(r2);
      checkLimitAndExecute((key) => compareRepos(r1, r2, key));
    } else if (m === 'devcompare' && d1 && d2) {
      setDev1Input(d1);
      setDev2Input(d2);
      checkLimitAndExecute((key) => compareDevs(d1, d2, key));
    }
  }, []);

  const updateUrl = (newMode: Mode, paramsObj: Record<string, string>) => {
    const url = new URL(window.location.href);
    url.searchParams.set('mode', newMode);
    Object.entries(paramsObj).forEach(([k, v]) => url.searchParams.set(k, v));
    window.history.pushState({}, '', url.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'user' && usernameInput.trim()) {
      checkLimitAndExecute((key) => {
        analyze(usernameInput.trim(), key);
        updateUrl('user', { u: usernameInput.trim() });
      });
    } else if (mode === 'singlerepo' && singleRepoInput.trim()) {
      checkLimitAndExecute((key) => {
        analyzeRepo(singleRepoInput.trim(), key);
        updateUrl('singlerepo', { r: singleRepoInput.trim() });
      });
    } else if (mode === 'repo' && repo1Input.trim() && repo2Input.trim()) {
      checkLimitAndExecute((key) => {
        compareRepos(repo1Input.trim(), repo2Input.trim(), key);
        updateUrl('repo', { r1: repo1Input.trim(), r2: repo2Input.trim() });
      });
    } else if (mode === 'devcompare' && dev1Input.trim() && dev2Input.trim()) {
      checkLimitAndExecute((key) => {
        compareDevs(dev1Input.trim(), dev2Input.trim(), key);
        updateUrl('devcompare', { d1: dev1Input.trim(), d2: dev2Input.trim() });
      });
    }
  };

  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleExportPdf = async () => {
    if (!pdfTemplateRef.current || isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      const root = pdfTemplateRef.current;
      const pageElements = Array.from(root.querySelectorAll('.pdf-page')) as HTMLElement[];
      if (pageElements.length === 0) {
        setIsExportingPdf(false);
        return;
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i];
        const canvas = await html2canvas(pageEl, {
          backgroundColor: '#ffffff',
          scale: 2.5,
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      const reportTitle = data?.username || repoData?.repoName || (compareDevsData ? `${compareDevsData.dev1.username}-vs-${compareDevsData.dev2.username}` : 'dev-analyzer');
      pdf.save(`${reportTitle}-executive-report.pdf`);
    } catch (err) {
      console.error('Executive PDF Export failed:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb w-[600px] h-[600px] -top-32 -left-32" style={{ background: 'rgba(232, 168, 0, 0.06)', animationDelay: '0s' }} />
        <div className="orb w-[500px] h-[500px] top-1/2 -right-48" style={{ background: 'rgba(212, 120, 10, 0.04)', animationDelay: '3s' }} />
        <div className="orb w-[400px] h-[400px] bottom-0 left-1/3" style={{ background: 'rgba(255, 200, 50, 0.04)', animationDelay: '6s' }} />
      </div>

      <Header mode={mode} setMode={setMode} onOpenKeyModal={() => setLimitModalOpen(true)} />

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
              <div className="absolute -top-12 right-0 z-50 flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-sm border border-slate-300 hover:bg-slate-100"
                  style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}
                  title="Print or Save Crisp Vector PDF via Browser"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Vector PDF
                </button>
                <button
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-md hover:scale-105 active:scale-95 disabled:opacity-50"
                  style={{ background: 'var(--accent)', color: '#FFFFFF' }}
                >
                  <FileText className="w-4 h-4" />
                  {isExportingPdf ? 'Exporting PDF...' : 'Download Multi-Page PDF'}
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
        <p className="text-xs font-mono inline-flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" /> by{' '}
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
                ['user', 'Analyze Developer', User],
                ['singlerepo', 'Analyze Single Repo', FolderGit2],
                ['devcompare', 'Battle Mode', Swords],
              ].map(([m, label, Icon]: any) => (
                <button key={m} onClick={() => { setMode(m as Mode); setCmdOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors" style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-light)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <Icon className="w-4 h-4 text-amber-500" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {limitModalOpen && (
        <LimitModal
          onClose={() => {
            setLimitModalOpen(false);
            setPendingAction(null);
          }}
          onSuccess={(savedKey) => {
            setLimitModalOpen(false);
            if (pendingAction) {
              pendingAction(savedKey);
              setPendingAction(null);
            }
          }}
        />
      )}

      {/* Hidden Offscreen Container for Executive 4-Page PDF Template Generation */}
      <div style={{ position: 'fixed', left: '-9999px', top: '-9999px', pointerEvents: 'none', zIndex: -100 }}>
        <ReportPdfTemplate
          ref={pdfTemplateRef}
          mode={mode}
          data={data}
          repoData={repoData}
          compareDevsData={compareDevsData}
          compareData={compareData}
        />
      </div>
    </div>
  );
}
