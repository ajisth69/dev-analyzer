import { CompareDevsResponse, CompareResponse } from '../hooks/useDevAnalyzer';
import { DevRadarChart } from './RadarChart';
import { createLocalFeaturePack, createBattleInsights, LocalFeaturePack } from '../utils/localFeatures';
import { TagPills, ScoreRing, WinnerBadge } from './UI';
import { AIAnalysisPanel } from './AIAnalysisPanel';
import { Trophy, BarChart3, Users, ClipboardCheck } from 'lucide-react';

function formatDevIq(iq: number) {
  if (iq >= 1_000_000) return `${(iq / 1_000_000).toFixed(1)}M`;
  if (iq >= 1_000) return `${(iq / 1_000).toFixed(1)}K`;
  return iq.toString();
}

function getWinner(a: number, b: number) { return a > b ? 1 : b > a ? 2 : 0; }

function AIDeclarationReport({ report, winnerName }: { report?: string; winnerName: string }) {
  if (!report) return null;
  return (
    <div className="glass rounded-3xl p-8 border border-amber-500/35 relative overflow-hidden noise bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-cyan-500/10 shadow-2xl shadow-amber-500/5">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse" />
      <div className="relative flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/20">
          <Trophy className="w-8 h-8" />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md bg-amber-500/25 text-amber-300 border border-amber-500/30">
              Engine Champion Declaration
            </span>
            {winnerName !== 'Tie' && (
              <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 animate-pulse">
                Winner: {winnerName}
              </span>
            )}
          </div>
          <p className="text-lg md:text-xl font-mono font-bold italic text-slate-100 leading-relaxed tracking-tight bg-slate-950/40 p-4 rounded-2xl border border-white/5 mt-2">
            "{report}"
          </p>
        </div>
      </div>
    </div>
  );
}

function DeterministicEngineReport({ left, right }: { left: LocalFeaturePack; right: LocalFeaturePack }) {
  const insights = createBattleInsights(left, right);
  return (
    <div className="glass rounded-3xl p-8 border border-white/5 noise">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-center text-sky-400">
          <ClipboardCheck className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-black text-white tracking-tight">Deterministic Battle Insights</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item) => (
          <div key={item.title} className="rounded-xl bg-slate-900/55 border border-slate-800 p-4">
            <div className="flex items-center gap-2 text-sky-400 mb-2">
              <Users className="w-4 h-4" />
              <h4 className="font-bold text-slate-100">{item.title}</h4>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LanguageMiniGraph({ pack }: { pack: any }) {
  return (
    <div className="rounded-xl bg-slate-900/55 border border-slate-800 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="min-w-0 truncate font-black text-slate-100">{pack.name}</h4>
        <span className="shrink-0 text-xs font-black text-sky-400">100%</span>
      </div>
      <div className="flex h-7 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
        {(pack.languageDistribution || []).map((language: any) => (
          <div
            key={language.name}
            style={{ width: `${Math.max(language.pct, 2)}%`, backgroundColor: language.color }}
            title={`${language.name}: ${language.pct}%`}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {(pack.languageDistribution || []).map((language: any) => (
          <span key={language.name} className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs font-bold text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: language.color }} />
            {language.name} {language.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}

function LanguageUsageBattle({ left, right }: { left: LocalFeaturePack; right: LocalFeaturePack }) {
  return (
    <div className="glass rounded-3xl p-8 border border-white/5 noise">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-center text-violet-400">
          <BarChart3 className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-black text-white tracking-tight">Language Composition Battle /100</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LanguageMiniGraph pack={left} />
        <LanguageMiniGraph pack={right} />
      </div>
    </div>
  );
}

interface BattleCardProps {
  title: string; sub?: string; iq: number; algorithmicScore: number;
  isWinner: boolean; tags: string[]; summary: string;
  accentColor: string; glowClass: string; side: 1 | 2;
}
function BattleCard({ title, sub, iq, algorithmicScore, isWinner, tags, summary, accentColor, glowClass, side }: BattleCardProps) {
  return (
    <div className={`glass rounded-3xl p-7 border transition-all card-hover relative overflow-hidden noise ${isWinner ? `border-[${accentColor}]/40 ${glowClass}` : 'border-white/5'}`}>
      {isWinner && <div className={`orb w-48 h-48 bg-[${accentColor}]/10 -top-10 -right-10`} />}
      <div className="relative">
        {sub && <p className="text-slate-500 font-mono text-xs mb-1">{sub}</p>}
        <h3 className="text-3xl font-black text-white tracking-tight mb-5">{title}</h3>

        <div className="flex items-center gap-6 mb-5">
          <ScoreRing value={algorithmicScore} label="Algorithm" color={accentColor} />
          <div className="flex flex-col items-center gap-1">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-accent)' }}>
              <span className="text-lg font-black font-mono" style={{ color: 'var(--text-primary)' }}>{formatDevIq(iq)}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Dev IQ</span>
          </div>
          <div className="flex flex-col gap-2">
            {isWinner && <WinnerBadge color={side === 1 ? 'text-sky-400' : 'text-amber-400'} />}
          </div>
        </div>

        <TagPills tags={tags} />
        <div className="mt-5 pt-5 border-t border-white/5">
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-4">{summary}</p>
        </div>
      </div>
    </div>
  );
}

export function DevBattle({ data }: { data: CompareDevsResponse }) {
  const { dev1, dev2, battle_report } = data;
  const p1 = createLocalFeaturePack(dev1, 'dev');
  const p2 = createLocalFeaturePack(dev2, 'dev');
  const aiW = getWinner(dev1.ai_score || 0, dev2.ai_score || 0);
  const winnerName = aiW === 1 ? `@${dev1.username}` : aiW === 2 ? `@${dev2.username}` : 'Tie';

  return (
    <div className="animate-slide-up space-y-8">
      {/* 1. AI Declaration Report at the absolute top */}
      <AIDeclarationReport report={battle_report} winnerName={winnerName} />

      {/* 2. Deterministic Engine Report */}
      <DeterministicEngineReport left={p1} right={p2} />

      {/* 3. Language Composition Battle */}
      <LanguageUsageBattle left={p1} right={p2} />

      {/* 4. Algorithm Profile Analysis */}
      <div className="glass border-white/5 rounded-3xl p-8">
        <h3 className="text-xl font-black text-white text-center mb-6">Algorithm Profile Comparison</h3>
        <DevRadarChart compareData={{ name1: dev1.username, name2: dev2.username, metrics1: p1.algorithmicMetrics, metrics2: p2.algorithmicMetrics, color1: '#38bdf8', color2: '#fbbf24' }} />
      </div>

      {/* 5. Battle Candidate Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <BattleCard title={`@${dev1.username}`} iq={dev1.devIq} algorithmicScore={p1.algorithmicScore}
          isWinner={aiW===1} tags={dev1.languageTags} summary={dev1.maturityAnalysis?.summary || dev1.seniorityAnalysis?.summary || ''}
          accentColor="#38bdf8" glowClass="glow-blue" side={1} />
        <BattleCard title={`@${dev2.username}`} iq={dev2.devIq} algorithmicScore={p2.algorithmicScore}
          isWinner={aiW===2} tags={dev2.languageTags} summary={dev2.maturityAnalysis?.summary || dev2.seniorityAnalysis?.summary || ''}
          accentColor="#fbbf24" glowClass="glow-amber" side={2} />
      </div>

      {/* 6. Side-by-Side Deep AI Assessments */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="glass border-white/5 rounded-3xl p-6">
          <h4 className="text-base font-black text-white mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            @{dev1.username}'s Intelligence Report
          </h4>
          <AIAnalysisPanel {...dev1} />
        </div>
        <div className="glass border-white/5 rounded-3xl p-6">
          <h4 className="text-base font-black text-white mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            @{dev2.username}'s Intelligence Report
          </h4>
          <AIAnalysisPanel {...dev2} />
        </div>
      </div>
    </div>
  );
}

export function RepoBattle({ data }: { data: CompareResponse }) {
  const { repo1, repo2, battle_report } = data;
  const p1 = createLocalFeaturePack(repo1, 'repo');
  const p2 = createLocalFeaturePack(repo2, 'repo');
  const aiW = getWinner(repo1.ai_score || 0, repo2.ai_score || 0);
  const winnerName = aiW === 1 ? `${repo1.owner}/${repo1.repoName}` : aiW === 2 ? `${repo2.owner}/${repo2.repoName}` : 'Tie';

  return (
    <div className="animate-slide-up space-y-8">
      {/* 1. AI Declaration Report at the absolute top */}
      <AIDeclarationReport report={battle_report} winnerName={winnerName} />

      {/* 2. Deterministic Engine Report */}
      <DeterministicEngineReport left={p1} right={p2} />

      {/* 3. Language Composition Battle */}
      <LanguageUsageBattle left={p1} right={p2} />

      {/* 4. Architecture Comparison */}
      <div className="glass border-white/5 rounded-3xl p-8">
        <h3 className="text-xl font-black text-white text-center mb-6">Architecture Comparison</h3>
        <DevRadarChart compareData={{ name1: repo1.repoName, name2: repo2.repoName, metrics1: p1.algorithmicMetrics, metrics2: p2.algorithmicMetrics, color1: '#f43f5e', color2: '#38bdf8' }} />
      </div>

      {/* 5. Battle Candidate Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <BattleCard title={repo1.repoName} sub={repo1.owner} iq={repo1.devIq} algorithmicScore={p1.algorithmicScore}
          isWinner={aiW===1} tags={repo1.languageTags} summary={repo1.maturityAnalysis?.summary || repo1.seniorityAnalysis?.summary || ''}
          accentColor="#f43f5e" glowClass="glow-rose" side={1} />
        <BattleCard title={repo2.repoName} sub={repo2.owner} iq={repo2.devIq} algorithmicScore={p2.algorithmicScore}
          isWinner={aiW===2} tags={repo2.languageTags} summary={repo2.maturityAnalysis?.summary || repo2.seniorityAnalysis?.summary || ''}
          accentColor="#38bdf8" glowClass="glow-blue" side={2} />
      </div>

      {/* 6. Side-by-Side Deep AI Assessments */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="glass border-white/5 rounded-3xl p-6">
          <h4 className="text-base font-black text-white mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            {repo1.repoName} Intelligence Report
          </h4>
          <AIAnalysisPanel {...repo1} />
        </div>
        <div className="glass border-white/5 rounded-3xl p-6">
          <h4 className="text-base font-black text-white mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            {repo2.repoName} Intelligence Report
          </h4>
          <AIAnalysisPanel {...repo2} />
        </div>
      </div>
    </div>
  );
}
