import { Brain, Code2, Flame, Globe, Layout, Lightbulb, MessageSquare, Rocket, Shield, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { AIRepoAnalysis } from '../hooks/useDevAnalyzer';

interface AIAnalysisPanelProps {
  ai_score?: number;
  ai_grade?: string;
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
}

function GradeBadge({ grade }: { grade: string }) {
  const color = grade === 'S' || grade === 'A+' ? 'from-emerald-400 to-cyan-400' : grade === 'A' || grade === 'B+' ? 'from-sky-400 to-indigo-400' : grade === 'B' || grade === 'C' ? 'from-amber-400 to-orange-400' : 'from-rose-400 to-pink-500';
  return <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${color} text-slate-950 font-black text-2xl shadow-lg shadow-current/20`}>{grade}</div>;
}

function ScoreBadge({ value }: { value: number }) {
  const color = value >= 80 ? 'from-emerald-400 to-cyan-400' : value >= 60 ? 'from-sky-400 to-indigo-400' : value >= 40 ? 'from-amber-400 to-orange-400' : 'from-rose-400 to-pink-500';
  return <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${color} text-slate-950 font-black text-lg shadow-lg`}>{value}</div>;
}

function VerdictCard({ icon, label, text, accent }: { icon: React.ReactNode; label: string; text: string; accent: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-current/5" style={{ borderColor: `${accent}30`, background: `${accent}08` }}>
      <div className="flex items-center gap-2 mb-3" style={{ color: accent }}>
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>{text || '—'}</p>
    </div>
  );
}

export function AIAnalysisPanel(props: AIAnalysisPanelProps) {
  const { ai_score, ai_grade, profile_verdict, code_quality_verdict, architecture_verdict, security_verdict, scalability_verdict, documentation_verdict, innovation_verdict, community_verdict, role_fit_verdict, growth_verdict, roast, top_repos_analysis } = props;

  const hasAI = ai_score !== undefined || ai_grade || profile_verdict || code_quality_verdict || architecture_verdict || security_verdict || roast || (top_repos_analysis && top_repos_analysis.length > 0);
  if (!hasAI) return null;

  const verdicts = [
    { text: profile_verdict, icon: <MessageSquare className="w-4 h-4" />, label: 'Overall Verdict', accent: '#38bdf8' },
    { text: code_quality_verdict, icon: <Code2 className="w-4 h-4" />, label: 'Code Quality', accent: '#818cf8' },
    { text: architecture_verdict, icon: <Layout className="w-4 h-4" />, label: 'Architecture', accent: '#a78bfa' },
    { text: security_verdict, icon: <Shield className="w-4 h-4" />, label: 'Security', accent: '#10b981' },
    { text: scalability_verdict, icon: <Rocket className="w-4 h-4" />, label: 'Scalability', accent: '#f59e0b' },
    { text: documentation_verdict, icon: <Globe className="w-4 h-4" />, label: 'Documentation', accent: '#06b6d4' },
    { text: innovation_verdict, icon: <Lightbulb className="w-4 h-4" />, label: 'Innovation', accent: '#f43f5e' },
    { text: community_verdict, icon: <Users className="w-4 h-4" />, label: 'Community Impact', accent: '#8b5cf6' },
    { text: role_fit_verdict, icon: <Zap className="w-4 h-4" />, label: 'Best Role Fit', accent: '#14b8a6' },
    { text: growth_verdict, icon: <TrendingUp className="w-4 h-4" />, label: 'Growth Path', accent: '#fb923c' },
  ].filter(v => v.text);

  return (
    <section className="mt-10 space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Intelligence Report</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Deterministic Analysis Engine</p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          {ai_grade && <div className="flex items-center gap-2"><span className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Grade</span><GradeBadge grade={ai_grade} /></div>}
          {ai_score !== undefined && <div className="flex items-center gap-2"><span className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Score</span><ScoreBadge value={ai_score} /></div>}
        </div>
      </div>

      {/* 🔥 Roast Section */}
      {roast && (
        <div className="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-pink-500/10 p-6 transition-all hover:border-orange-400/50">
          <div className="absolute top-3 right-4 text-4xl opacity-20 animate-bounce">🔥</div>
          <div className="flex items-center gap-2" style={{ color: '#C05621' }}>
            <Flame className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Roast</span>
          </div>
          <p className="text-sm leading-relaxed font-medium italic" style={{ color: 'var(--text-secondary)' }}>{roast}</p>
        </div>
      )}

      {/* Verdict Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {verdicts.map((v, i) => <VerdictCard key={i} icon={v.icon} label={v.label} text={v.text!} accent={v.accent} />)}
      </div>

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
