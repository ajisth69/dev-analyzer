import { Brain, Code2, Flame, Lightbulb, MessageSquare, Shield, Star, TrendingUp, Users, Zap, Layers, Sparkles, Crown, Gem, UserCheck } from 'lucide-react';
import { AIRepoAnalysis, SuggestedProject } from '../hooks/useDevAnalyzer';

interface AIAnalysisPanelProps {
  kind?: 'dev' | 'repo';
  ai_score?: number;
  ai_grade?: string;
  developer_role_title?: string;
  repo_archetype?: string;
  profile_verdict?: string;
  code_quality_verdict?: string;
  architecture_verdict?: string;
  security_verdict?: string;
  scalability_verdict?: string;
  documentation_verdict?: string;
  innovation_verdict?: string;
  community_verdict?: string;
  role_fit_verdict?: string;
  growth_verdict?: string;
  roast?: string;
  top_repos_analysis?: AIRepoAnalysis[];
  suggested_projects?: SuggestedProject[];
}

function ScoreBadge({ value }: { value: number }) {
  const color = value >= 80 ? '#2E7D32' : value >= 60 ? '#1565C0' : value >= 40 ? '#E65100' : '#C62828';
  const bg = value >= 80 ? '#E8F5E9' : value >= 60 ? '#E3F2FD' : value >= 40 ? '#FFF3E0' : '#FFEBEE';
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black font-mono shadow-sm" style={{ background: bg, color }}>
      <Sparkles className="w-3.5 h-3.5" />
      <span>{value}/100</span>
    </div>
  );
}

function GradeBadge({ grade }: { grade: string }) {
  return (
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-md shadow-amber-500/20 font-mono">
      {grade}
    </div>
  );
}

function VerdictCard({ icon: Icon, label, text, accent }: { icon: any; label: string; text: string; accent: string }) {
  if (!text) return null;
  return (
    <div className="group relative overflow-hidden rounded-2xl border p-4 transition-all card-hover noise" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className={`p-1.5 rounded-lg ${accent} bg-opacity-10`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <p className="text-xs leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>{text}</p>
    </div>
  );
}

export function AIAnalysisPanel(props: AIAnalysisPanelProps) {
  const { kind = 'dev', ai_score, ai_grade, developer_role_title, repo_archetype, profile_verdict, code_quality_verdict, architecture_verdict, security_verdict, scalability_verdict, documentation_verdict, innovation_verdict, community_verdict, role_fit_verdict, growth_verdict, roast, top_repos_analysis, suggested_projects } = props;

  const showDevRole = kind === 'dev' && Boolean(developer_role_title);
  const showRepoArchetype = kind === 'repo' && Boolean(repo_archetype);

  const verdicts = [
    { icon: UserCheck, label: 'Profile Summary', text: profile_verdict, accent: 'text-sky-500' },
    { icon: Code2, label: 'Code Quality', text: code_quality_verdict, accent: 'text-emerald-500' },
    { icon: Layers, label: 'Architecture', text: architecture_verdict, accent: 'text-violet-500' },
    { icon: Shield, label: 'Security', text: security_verdict, accent: 'text-rose-500' },
    { icon: Zap, label: 'Scalability', text: scalability_verdict, accent: 'text-amber-500' },
    { icon: MessageSquare, label: 'Documentation', text: documentation_verdict, accent: 'text-teal-500' },
    { icon: Lightbulb, label: 'Innovation', text: innovation_verdict, accent: 'text-yellow-500' },
    { icon: Users, label: 'Community', text: community_verdict, accent: 'text-pink-500' },
    { icon: Star, label: 'Role Fit', text: role_fit_verdict, accent: 'text-indigo-500' },
    { icon: TrendingUp, label: 'Growth Potential', text: growth_verdict, accent: 'text-cyan-500' },
  ].filter((v) => Boolean(v.text));

  return (
    <section className="mt-10 space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      {/* Top Banner */}
      <div className="flex flex-wrap items-center gap-4 p-5 rounded-2xl noise" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-accent)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: 'var(--accent)', color: 'white' }}>
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Intelligence Report</h3>
            {showDevRole && (
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 inline-flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-violet-400" /> {developer_role_title}
              </span>
            )}
            {showRepoArchetype && (
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1.5">
                <Gem className="w-3.5 h-3.5 text-amber-400" /> {repo_archetype}
              </span>
            )}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Deterministic Analysis Engine</p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          {ai_grade && <div className="flex items-center gap-2"><span className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Grade</span><GradeBadge grade={ai_grade} /></div>}
          {ai_score !== undefined && <div className="flex items-center gap-2"><span className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Score</span><ScoreBadge value={ai_score} /></div>}
        </div>
      </div>

      {/* Flame Roast Section */}
      {roast && (
        <div className="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-pink-500/10 p-6 transition-all hover:border-orange-400/50">
          <Flame className="absolute top-3 right-4 w-10 h-10 text-orange-500 opacity-20 animate-pulse" />
          <div className="flex items-center gap-2" style={{ color: '#C05621' }}>
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-black uppercase tracking-widest">Roast</span>
          </div>
          <p className="text-sm leading-relaxed font-medium italic" style={{ color: 'var(--text-secondary)' }}>{roast}</p>
        </div>
      )}

      {/* Verdict Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {verdicts.map((v, i) => <VerdictCard key={i} icon={v.icon} label={v.label} text={v.text!} accent={v.accent} />)}
      </div>

      {/* 🚀 Tailored Project Recommendations */}
      {suggested_projects && suggested_projects.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-800/60 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <p className="text-xs font-black uppercase tracking-[0.15em]" style={{ color: 'var(--text-primary)' }}>
              Tailored Projects to Build Next
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggested_projects.map((proj, idx) => {
              const badgeBg = proj.difficulty === 'Expert' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : proj.difficulty === 'Advanced' ? 'bg-purple-500/10 text-purple-600 border-purple-500/30' : 'bg-amber-500/10 text-amber-600 border-amber-500/30';
              return (
                <div key={idx} className="overflow-hidden rounded-2xl border p-5 space-y-3 transition-all hover:border-amber-500/40" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badgeBg}`}>
                        {proj.difficulty}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>{proj.title}</h4>
                  </div>
                  <p className="text-xs leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>{proj.reason}</p>
                  {proj.impact && (
                    <div className="pt-2 border-t flex items-center gap-1.5 text-[11px] font-semibold" style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}>
                      <Layers className="w-3.5 h-3.5 shrink-0" />
                      <span>{proj.impact}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Per-Repo */}
      {top_repos_analysis && top_repos_analysis.length > 0 && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <Star className="w-3 h-3" style={{ color: 'var(--accent)' }} /> Top Repos — Scored
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {top_repos_analysis.map((repo) => {
              const s = repo.repo_score ?? 0;
              const c = s >= 80 ? '#34d399' : s >= 60 ? '#38bdf8' : s >= 40 ? '#fbbf24' : '#f87171';
              return (
                <div key={repo.repo_name} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-700 transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-black text-slate-100 text-sm truncate">{repo.repo_name}</p>
                    <span className="shrink-0 text-xs font-black px-2 py-0.5 rounded-lg" style={{ color: c, background: `${c}18` }}>{s}/100</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden mb-3">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(4, s)}%`, backgroundColor: c }} />
                  </div>
                  <p className="text-xs leading-relaxed text-slate-400">{repo.verdict}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
