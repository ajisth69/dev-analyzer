import { CompareDevsResponse, CompareResponse } from '../hooks/useDevAnalyzer';
import { DevRadarChart } from './RadarChart';
import { BattleInsightsPanel } from './FeatureSuite';
import { createLocalFeaturePack } from '../utils/localFeatures';
import { TagPills, ScoreRing, WinnerBadge } from './UI';
import { AIAnalysisPanel } from './AIAnalysisPanel';

function formatDevIq(iq: number) {
  if (iq >= 1_000_000) return `${(iq / 1_000_000).toFixed(1)}M`;
  if (iq >= 1_000) return `${(iq / 1_000).toFixed(1)}K`;
  return iq.toString();
}

function getWinner(a: number, b: number) { return a > b ? 1 : b > a ? 2 : 0; }

interface BattleCardProps {
  title: string; sub?: string; iq: number; algorithmicScore: number;
  iqWinner: boolean; localWinner: boolean; tags: string[]; summary: string;
  accentColor: string; glowClass: string; side: 1 | 2;
}
function BattleCard({ title, sub, iq, algorithmicScore, iqWinner, localWinner, tags, summary, accentColor, glowClass, side }: BattleCardProps) {
  const isWinner = iqWinner || localWinner;
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
            {iqWinner && <WinnerBadge color={side === 1 ? 'text-sky-400' : 'text-amber-400'} />}
            {localWinner && <WinnerBadge color={side === 1 ? 'text-sky-400' : 'text-amber-400'} />}
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
  const { dev1, dev2 } = data;
  const p1 = createLocalFeaturePack(dev1, 'dev');
  const p2 = createLocalFeaturePack(dev2, 'dev');
  const iqW = getWinner(dev1.devIq, dev2.devIq);
  const lW  = getWinner(p1.algorithmicScore, p2.algorithmicScore);
  return (
    <div className="animate-slide-up space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <BattleCard title={`@${dev1.username}`} iq={dev1.devIq} algorithmicScore={p1.algorithmicScore}
          iqWinner={iqW===1} localWinner={lW===1} tags={dev1.languageTags} summary={dev1.maturityAnalysis?.summary || dev1.seniorityAnalysis?.summary || ''}
          accentColor="#38bdf8" glowClass="glow-blue" side={1} />
        <BattleCard title={`@${dev2.username}`} iq={dev2.devIq} algorithmicScore={p2.algorithmicScore}
          iqWinner={iqW===2} localWinner={lW===2} tags={dev2.languageTags} summary={dev2.maturityAnalysis?.summary || dev2.seniorityAnalysis?.summary || ''}
          accentColor="#fbbf24" glowClass="glow-amber" side={2} />
      </div>
      <BattleInsightsPanel left={p1} right={p2} />
      <div className="glass border-white/5 rounded-3xl p-8">
        <h3 className="text-xl font-black text-white text-center mb-6">Algorithm Profile Comparison</h3>
        <DevRadarChart compareData={{ name1: dev1.username, name2: dev2.username, metrics1: p1.algorithmicMetrics, metrics2: p2.algorithmicMetrics, color1: '#38bdf8', color2: '#fbbf24' }} />
      </div>

      {/* Side-by-Side AI Assessments */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
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
  const { repo1, repo2 } = data;
  const p1 = createLocalFeaturePack(repo1, 'repo');
  const p2 = createLocalFeaturePack(repo2, 'repo');
  const iqW = getWinner(repo1.devIq, repo2.devIq);
  const lW  = getWinner(p1.algorithmicScore, p2.algorithmicScore);
  return (
    <div className="animate-slide-up space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <BattleCard title={repo1.repoName} sub={repo1.owner} iq={repo1.devIq} algorithmicScore={p1.algorithmicScore}
          iqWinner={iqW===1} localWinner={lW===1} tags={repo1.languageTags} summary={repo1.maturityAnalysis?.summary || repo1.seniorityAnalysis?.summary || ''}
          accentColor="#f43f5e" glowClass="glow-rose" side={1} />
        <BattleCard title={repo2.repoName} sub={repo2.owner} iq={repo2.devIq} algorithmicScore={p2.algorithmicScore}
          iqWinner={iqW===2} localWinner={lW===2} tags={repo2.languageTags} summary={repo2.maturityAnalysis?.summary || repo2.seniorityAnalysis?.summary || ''}
          accentColor="#38bdf8" glowClass="glow-blue" side={2} />
      </div>
      <BattleInsightsPanel left={p1} right={p2} />
      <div className="glass border-white/5 rounded-3xl p-8">
        <h3 className="text-xl font-black text-white text-center mb-6">Architecture Comparison</h3>
        <DevRadarChart compareData={{ name1: repo1.repoName, name2: repo2.repoName, metrics1: p1.algorithmicMetrics, metrics2: p2.algorithmicMetrics, color1: '#f43f5e', color2: '#38bdf8' }} />
      </div>

      {/* Side-by-Side AI Assessments */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
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
