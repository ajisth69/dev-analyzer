import { Github } from 'lucide-react';
import { AnalyzerResponse, RepoAnalysisResponse } from '../hooks/useDevAnalyzer';
import { DevRadarChart } from './RadarChart';
import { FeatureSuite } from './FeatureSuite';
import { createLocalFeaturePack } from '../utils/localFeatures';
import { TagPills, ScoreRing, DeepAnalysisSummary } from './UI';
import { AIAnalysisPanel } from './AIAnalysisPanel';

function formatDevIq(iq: number) {
  if (iq >= 1_000_000) return `${(iq / 1_000_000).toFixed(1)}M`;
  if (iq >= 1_000) return `${(iq / 1_000).toFixed(1)}K`;
  return iq.toString();
}

export function UserProfile({ data }: { data: AnalyzerResponse }) {
  const pack = createLocalFeaturePack(data, 'dev');
  return (
    <div className="animate-slide-up space-y-6">
      <div className="glass rounded-3xl p-7 relative overflow-hidden card-hover noise">
        <div className="orb w-72 h-72 top-[-20%] right-[-10%]" style={{ background: 'rgba(232, 168, 0, 0.08)' }} />
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative">
          <div className="flex items-center gap-4">
            <a href={`https://github.com/${data.username}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${data.username}'s GitHub profile`}
              className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-accent)' }}>
              <Github className="w-8 h-8" style={{ color: 'var(--accent)' }} />
            </a>
            <div>
              <h2 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>@{data.username}</h2>
              <p className="text-sm font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{data.analyzedReposCount} repos analyzed</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 md:mt-0">
            {data.ai_grade && (
              <div className="flex flex-col items-center gap-1">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg ${
                  data.ai_grade === 'S' || data.ai_grade === 'A+' ? 'bg-gradient-to-br from-emerald-400 to-cyan-400 text-slate-950' :
                  data.ai_grade === 'A' || data.ai_grade === 'B+' ? 'bg-gradient-to-br from-sky-400 to-indigo-400 text-white' :
                  data.ai_grade === 'B' || data.ai_grade === 'C' ? 'bg-gradient-to-br from-amber-400 to-orange-400 text-slate-950' :
                  'bg-gradient-to-br from-rose-400 to-pink-500 text-white'
                }`}>{data.ai_grade}</div>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Grade</span>
              </div>
            )}
            {data.ai_score !== undefined && <ScoreRing value={data.ai_score} label="Score" color="#E8A800" />}
            <ScoreRing value={pack.algorithmicScore} label="Algorithm" color="#6366f1" />
            <div className="flex flex-col items-center gap-1">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-accent)' }}>
                <span className="text-lg font-black font-mono" style={{ color: 'var(--text-primary)' }}>{formatDevIq(data.devIq)}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Dev IQ</span>
            </div>
          </div>
        </div>
        <div className="mt-5 relative">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--text-muted)' }}>Language Expertise</p>
          <TagPills tags={data.languageTags} />
        </div>
      </div>

      <AIAnalysisPanel
        ai_score={data.ai_score} ai_grade={data.ai_grade}
        profile_verdict={data.profile_verdict} code_quality_verdict={data.code_quality_verdict}
        architecture_verdict={data.architecture_verdict} security_verdict={data.security_verdict}
        scalability_verdict={data.scalability_verdict} documentation_verdict={data.documentation_verdict}
        innovation_verdict={data.innovation_verdict} community_verdict={data.community_verdict}
        role_fit_verdict={data.role_fit_verdict} growth_verdict={data.growth_verdict}
        roast={data.roast} top_repos_analysis={data.top_repos_analysis}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-5"><DevRadarChart data={pack.algorithmicMetrics} /></div>
      </div>
      <FeatureSuite pack={pack} />
      <div className="mt-8">
        <DeepAnalysisSummary summary={data.maturityAnalysis?.summary || data.seniorityAnalysis?.summary || ''} />
      </div>
    </div>
  );
}

export function RepoProfile({ data }: { data: RepoAnalysisResponse }) {
  const pack = createLocalFeaturePack(data, 'repo');
  return (
    <div className="animate-slide-up space-y-6">
      <div className="glass rounded-3xl p-7 relative overflow-hidden card-hover noise">
        <div className="orb w-72 h-72 top-[-20%] right-[-10%]" style={{ background: 'rgba(147, 51, 234, 0.06)' }} />
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative">
          <div>
            <p className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>{data.owner}</p>
            <h2 className="text-3xl font-black tracking-tight gradient-purple">{data.repoName}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 md:mt-0">
            {data.ai_grade && (
              <div className="flex flex-col items-center gap-1">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg ${
                  data.ai_grade === 'S' || data.ai_grade === 'A+' ? 'bg-gradient-to-br from-emerald-400 to-cyan-400 text-slate-950' :
                  data.ai_grade === 'A' || data.ai_grade === 'B+' ? 'bg-gradient-to-br from-sky-400 to-indigo-400 text-white' :
                  data.ai_grade === 'B' || data.ai_grade === 'C' ? 'bg-gradient-to-br from-amber-400 to-orange-400 text-slate-950' :
                  'bg-gradient-to-br from-rose-400 to-pink-500 text-white'
                }`}>{data.ai_grade}</div>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Grade</span>
              </div>
            )}
            {data.ai_score !== undefined && <ScoreRing value={data.ai_score} label="Score" color="#E8A800" />}
            <ScoreRing value={pack.algorithmicScore} label="Algorithm" color="#a78bfa" />
            <div className="flex flex-col items-center gap-1">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-accent)' }}>
                <span className="text-lg font-black font-mono" style={{ color: 'var(--text-primary)' }}>{formatDevIq(data.devIq)}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Repo IQ</span>
            </div>
          </div>
        </div>
        <div className="mt-5 relative">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--text-muted)' }}>Codebase Composition</p>
          <TagPills tags={data.languageTags} />
        </div>
      </div>

      <AIAnalysisPanel
        ai_score={data.ai_score} ai_grade={data.ai_grade}
        profile_verdict={data.profile_verdict} code_quality_verdict={data.code_quality_verdict}
        architecture_verdict={data.architecture_verdict} security_verdict={data.security_verdict}
        scalability_verdict={data.scalability_verdict} documentation_verdict={data.documentation_verdict}
        innovation_verdict={data.innovation_verdict} community_verdict={data.community_verdict}
        role_fit_verdict={data.role_fit_verdict} growth_verdict={data.growth_verdict}
        roast={data.roast} top_repos_analysis={data.top_repos_analysis}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-5"><DevRadarChart data={pack.algorithmicMetrics} /></div>
      </div>
      <FeatureSuite pack={pack} />
      <div className="mt-8">
        <DeepAnalysisSummary summary={data.maturityAnalysis?.summary || data.seniorityAnalysis?.summary || ''} />
      </div>
    </div>
  );
}
