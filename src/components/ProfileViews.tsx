import { Github } from 'lucide-react';
import { AnalyzerResponse, RepoAnalysisResponse } from '../hooks/useDevAnalyzer';
import { DevRadarChart } from './RadarChart';
import { FeatureSuite } from './FeatureSuite';
import { createLocalFeaturePack } from '../utils/localFeatures';
import { TagPills, ScoreRing, DeepAnalysisSummary } from './UI';

export function UserProfile({ data }: { data: AnalyzerResponse }) {
  const pack = createLocalFeaturePack(data, 'dev');
  return (
    <div className="animate-slide-up space-y-6">
      {/* Header Card */}
      <div className="glass border-white/6 rounded-3xl p-7 relative overflow-hidden card-hover noise">
        <div className="orb w-72 h-72 bg-sky-500/10 top-[-20%] right-[-10%]" />
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative">
          <div className="flex items-center gap-4">
            <a href={`https://github.com/${data.username}`} target="_blank" rel="noopener noreferrer"
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-600/20 border border-sky-500/20 flex items-center justify-center hover:border-sky-400/50 transition-all">
              <Github className="w-8 h-8 text-sky-400" />
            </a>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">@{data.username}</h2>
              <p className="text-slate-500 text-sm font-mono mt-0.5">{data.analyzedReposCount} repos analyzed</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <ScoreRing value={pack.algorithmicScore} label="Algorithm" color="#38bdf8" />
            <ScoreRing value={Math.min(Math.round(data.devIq / 40), 100)} max={100} label="Dev IQ" color="#818cf8" />
          </div>
        </div>
        <div className="mt-5 relative">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-2">Language Expertise</p>
          <TagPills tags={data.languageTags} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-5">
          <DevRadarChart data={pack.algorithmicMetrics} />
        </div>
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
      <div className="glass border-white/6 rounded-3xl p-7 relative overflow-hidden card-hover noise">
        <div className="orb w-72 h-72 bg-violet-500/10 top-[-20%] right-[-10%]" />
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative">
          <div>
            <p className="text-slate-500 font-mono text-sm">{data.owner}</p>
            <h2 className="text-3xl font-black tracking-tight gradient-purple">{data.repoName}</h2>
          </div>
          <div className="flex items-center gap-8">
            <ScoreRing value={pack.algorithmicScore} label="Algorithm" color="#a78bfa" />
            <ScoreRing value={Math.min(Math.round(data.devIq / 40), 100)} max={100} label="Repo IQ" color="#818cf8" />
          </div>
        </div>
        <div className="mt-5 relative">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-2">Codebase Composition</p>
          <TagPills tags={data.languageTags} />
        </div>
      </div>
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
