import React from 'react';
import {
  AlertTriangle,
  BarChart3,
  ClipboardCheck,
  Flag,
  GitBranch,
  GitCompare,
  HeartPulse,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Shield,
  Zap,
  Layout,
  Clock,
} from 'lucide-react';
import { createBattleInsights, InsightItem, LocalFeaturePack } from '../utils/localFeatures';

interface FeatureSuiteProps {
  pack: LocalFeaturePack;
}

interface BattleInsightsProps {
  left: LocalFeaturePack;
  right: LocalFeaturePack;
}

const iconClass = 'w-5 h-5';

function Meter({ value, color = 'bg-primary' }: { value: number; color?: string }) {
  return (
    <div className="h-2.5 w-full rounded-full bg-slate-900/80 border border-slate-800 overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${Math.max(4, Math.min(value, 100))}%` }} />
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-[#131b2f] border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/10">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-center text-primary">
          {icon}
        </div>
        <h3 className="text-lg font-black text-white tracking-tight">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function InsightList({ items }: { items: InsightItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-400 leading-relaxed">No major local risk found in this category.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-xl bg-slate-900/55 border border-slate-800 p-4">
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-bold text-slate-100">{item.title}</h4>
            {item.impact && (
              <span className="shrink-0 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                {item.impact}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}

function severityTone(severity: string) {
  if (severity === 'critical') return 'border-red-400/40 bg-red-500/10 text-red-200';
  if (severity === 'high') return 'border-orange-400/40 bg-orange-500/10 text-orange-200';
  if (severity === 'medium') return 'border-amber-400/40 bg-amber-500/10 text-amber-200';
  return 'border-slate-700 bg-slate-950 text-slate-300';
}

function LanguageMiniGraph({ pack }: { pack: LocalFeaturePack }) {
  return (
    <div className="rounded-xl bg-slate-900/55 border border-slate-800 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="min-w-0 truncate font-black text-slate-100">{pack.name}</h4>
        <span className="shrink-0 text-xs font-black text-primary">100%</span>
      </div>
      <div className="flex h-7 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
        {pack.languageDistribution.map((language) => (
          <div
            key={language.name}
            style={{ width: `${Math.max(language.pct, 2)}%`, backgroundColor: language.color }}
            title={`${language.name}: ${language.pct}%`}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {pack.languageDistribution.map((language) => (
          <span key={language.name} className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs font-bold text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: language.color }} />
            {language.name} {language.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}

function AlgorithmicMetrics({ metrics }: { metrics: LocalFeaturePack['algorithmicMetrics'] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Object.entries(metrics).map(([label, value]) => (
        <div key={label} className="bg-[#131b2f] border border-slate-800 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider font-black text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-white">{value || 0}<span className="text-sm text-slate-500">/100</span></p>
          <Meter value={value || 0} />
        </div>
      ))}
    </div>
  );
}

function SoftwareTrackPanel({ pack }: { pack: LocalFeaturePack }) {
  return (
    <Panel title="Detected Software Track" icon={<ClipboardCheck className={iconClass} />}>
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.9fr] gap-5">
        <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5">
          <p className="text-xs font-black uppercase tracking-wider text-primary">Primary track</p>
          <h3 className="mt-2 text-2xl font-black text-white">{pack.primaryTrack.name}</h3>
          <p className="mt-2 text-4xl font-black text-primary">{pack.primaryTrack.score}<span className="text-sm text-slate-500">/100</span></p>
          <div className="mt-3"><Meter value={pack.primaryTrack.score} color="bg-primary" /></div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            The score is judged inside this lane, so a frontend-only app is not punished for missing a backend, and a backend service is not punished for missing a UI.
          </p>
        </div>
        <div className="space-y-3">
          {pack.trackSignals.slice(0, 4).map((track) => (
            <div key={track.name} className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
              <div className="flex items-center justify-between gap-4">
                <h4 className="font-bold text-slate-100">{track.name}</h4>
                <span className="text-sm font-black text-primary">{track.score}/100</span>
              </div>
              <div className="mt-3"><Meter value={track.score} color="bg-indigo-500" /></div>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{track.evidence.join(' | ')}</p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function LanguageUsagePanel({ pack }: { pack: LocalFeaturePack }) {
  return (
    <Panel title="Language Usage /100" icon={<BarChart3 className={iconClass} />}>
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
        <div className="flex h-8 w-full">
          {pack.languageDistribution.map((language) => (
            <div
              key={language.name}
              className="h-full"
              style={{ width: `${Math.max(language.pct, 2)}%`, backgroundColor: language.color }}
              title={`${language.name}: ${language.pct}%`}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pack.languageDistribution.map((language) => (
          <div key={language.name} className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: language.color }} />
                <span className="truncate font-bold text-slate-100">{language.name}</span>
              </div>
              <span className="font-black text-primary">{language.pct}%</span>
            </div>
            <div className="mt-3">
              <Meter value={language.pct} color="bg-primary" />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function DeepAnalysisPanel({ analysis }: { analysis: NonNullable<LocalFeaturePack['deepAnalysis']> }) {
  return (
    <Panel title="Deep Analysis Domain Matrix" icon={<Sparkles className={iconClass} />}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="relative group overflow-hidden rounded-2xl p-[1px]">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
          <div className="glass h-full relative bg-[#050812]/90 border border-sky-500/20 p-5 rounded-2xl hover:bg-sky-500/10 transition-all cursor-default">
            <div className="flex items-center gap-2 text-sky-400 mb-3">
              <Layout className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Architecture</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">{analysis.architecture}</p>
          </div>
        </div>

        <div className="relative group overflow-hidden rounded-2xl p-[1px]">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
          <div className="glass h-full relative bg-[#050812]/90 border border-violet-500/20 p-5 rounded-2xl hover:bg-violet-500/10 transition-all cursor-default">
            <div className="flex items-center gap-2 text-violet-400 mb-3">
              <Zap className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Modernity</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">{analysis.modernity}</p>
          </div>
        </div>

        <div className="relative group overflow-hidden rounded-2xl p-[1px]">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
          <div className="glass h-full relative bg-[#050812]/90 border border-emerald-500/20 p-5 rounded-2xl hover:bg-emerald-500/10 transition-all cursor-default">
            <div className="flex items-center gap-2 text-emerald-400 mb-3">
              <Shield className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Security</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">{analysis.security}</p>
          </div>
        </div>

        <div className="relative group overflow-hidden rounded-2xl p-[1px]">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
          <div className="glass h-full relative bg-[#050812]/90 border border-amber-500/20 p-5 rounded-2xl hover:bg-amber-500/10 transition-all cursor-default">
            <div className="flex items-center gap-2 text-amber-400 mb-3">
              <Clock className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Scalability</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">{analysis.scalability}</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function SecurityAuditPanel({ pack }: { pack: LocalFeaturePack }) {
  return (
    <Panel title="Strict Security Audit" icon={<Shield className={iconClass} />}>
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          ['Security', `${pack.securityScore}/100`],
          ['Critical', pack.severityCounts.critical],
          ['High', pack.severityCounts.high],
          ['Medium', pack.severityCounts.medium],
          ['Low', pack.severityCounts.low],
          ['API Evidence', pack.externalSignals?.dependencySignals.length || pack.externalSignals?.repoSignals.length ? 'Yes' : 'No'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="font-black text-slate-100">Vulnerabilities</h4>
            <span className="text-xs font-black text-primary">{pack.vulnerabilities.length}</span>
          </div>
          <div className="space-y-3">
            {pack.vulnerabilities.length === 0 ? (
              <p className="text-sm text-slate-400">No deterministic vulnerability pattern found in scanned evidence.</p>
            ) : pack.vulnerabilities.slice(0, 5).map((finding) => (
              <div key={`${finding.ruleId}-${finding.file}-${finding.line}`} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                <div className="flex items-start justify-between gap-3">
                  <h5 className="font-bold text-slate-100">{finding.title}</h5>
                  <span className={`shrink-0 rounded-md border px-2 py-1 text-[10px] font-black uppercase ${severityTone(finding.severity)}`}>
                    {finding.severity}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{finding.detail}</p>
                <p className="mt-2 text-[11px] text-slate-500">{finding.file}{finding.line ? `:${finding.line}` : ''}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-black text-slate-100">Dependencies</h4>
              <span className="text-xs font-black text-primary">{pack.algorithmicMetrics.Dependencies ?? 0}/100</span>
            </div>
            <Meter value={pack.algorithmicMetrics.Dependencies ?? 0} color="bg-amber-400" />
            {pack.externalSignals && (
              <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Sources: {pack.externalSignals.sources.join(', ')} | Packages checked: {pack.externalSignals.dependencyQueries.length}
              </p>
            )}
            <div className="mt-3 space-y-2">
              {pack.dependencyRisks.length === 0 ? (
                <p className="text-sm text-slate-400">No dependency risk found in scanned manifests.</p>
              ) : pack.dependencyRisks.slice(0, 4).map((risk) => (
                <p key={`${risk.ecosystem}-${risk.packageName}-${risk.title}`} className="text-xs leading-relaxed text-slate-400">
                  <span className="font-bold text-slate-200">{risk.title}</span> - {risk.detail}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-black text-slate-100">Production Readiness</h4>
              <span className="text-xs font-black text-primary">{pack.productionReadiness.score}/100</span>
            </div>
            <Meter value={pack.productionReadiness.score} color="bg-emerald-500" />
            <p className="mt-3 text-xs leading-relaxed text-slate-400">{pack.productionReadiness.evidence.join(' | ')}</p>
            {pack.productionReadiness.blockers.length > 0 && (
              <p className="mt-2 text-xs leading-relaxed text-amber-300">{pack.productionReadiness.blockers.slice(0, 3).join(' | ')}</p>
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function RoleFitPanel({ roleFits }: { roleFits: LocalFeaturePack['roleFits'] }) {
  return (
    <Panel title="2. Skill Gap vs Role" icon={<Target className={iconClass} />}>
      <div className="space-y-4">
        {roleFits.slice(0, 4).map((role) => (
          <div key={role.role} className="rounded-xl bg-slate-900/55 border border-slate-800 p-4">
            <div className="flex items-center justify-between gap-4">
              <h4 className="font-bold text-slate-100">{role.role}</h4>
              <span className="text-sm font-black text-primary">{role.score}/100</span>
            </div>
            <div className="mt-3"><Meter value={role.score} color="bg-indigo-500" /></div>
            <p className="mt-3 text-sm text-slate-400">{role.matched.slice(0, 3).join(', ') || 'Needs stronger matching evidence.'}</p>
            <p className="mt-2 text-xs text-amber-300/90">{role.gaps.slice(0, 2).join(' | ') || 'Role alignment looks healthy.'}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function CodebaseHealthPanel({ health }: { health: LocalFeaturePack['codebaseHealth'] }) {
  return (
    <Panel title="3. Codebase Health" icon={<HeartPulse className={iconClass} />}>
      <div className="mb-5 rounded-xl bg-slate-900/55 border border-slate-800 p-4">
        <div className="flex items-end justify-between">
          <span className="text-sm font-bold text-slate-400">Overall health</span>
          <span className="text-3xl font-black text-white">{health.overall}<span className="text-sm text-slate-500">/100</span></span>
        </div>
        <div className="mt-3"><Meter value={health.overall} color="bg-emerald-500" /></div>
      </div>
      <div className="space-y-3">
        {health.categories.map((category) => (
          <div key={category.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-300">{category.label}</span>
              <span className="text-slate-500">{category.score}</span>
            </div>
            <Meter value={category.score} />
            <p className="mt-1 text-xs text-slate-500">{category.evidence}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function EvolutionTimelinePanel({ timeline }: { timeline: LocalFeaturePack['timeline'] }) {
  return (
    <Panel title="6. Evolution Timeline" icon={<TrendingUp className={iconClass} />}>
      <div className="space-y-4">
        {timeline.map((item) => (
          <div key={item.label} className="grid grid-cols-[92px_1fr] gap-4">
            <div className="text-sm font-black text-primary">{item.label}</div>
            <div>
              <Meter value={item.intensity} color="bg-amber-400" />
              <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ExplanationModesPanel({ explanations }: { explanations: LocalFeaturePack['explanations'] }) {
  return (
    <Panel title="7. Explanation Modes" icon={<Sparkles className={iconClass} />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          ['Recruiter', explanations.recruiter],
          ['CTO', explanations.cto],
          ['Peer', explanations.peer],
          ['Beginner', explanations.beginner],
        ].map(([label, text]) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
            <h4 className="font-black text-slate-100">{label}</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
        <h4 className="font-black text-amber-200">Analysis Explanation</h4>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
          {explanations.report}
        </p>
      </div>
    </Panel>
  );
}

function BattleModePrepPanel({ pack }: { pack: LocalFeaturePack }) {
  return (
    <Panel title="8. Battle Mode Prep" icon={<GitCompare className={iconClass} />}>
      <div className="space-y-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
          <h4 className="font-bold text-slate-100">Category Edge</h4>
          <p className="mt-2 text-sm text-slate-400">Strongest axis: {Object.entries(pack.algorithmicMetrics).sort((a, b) => (b[1] || 0) - (a[1] || 0))[0]?.[0]}.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
          <h4 className="font-bold text-slate-100">Best Matchup Angle</h4>
          <p className="mt-2 text-sm text-slate-400">{pack.name} should be compared on {pack.roleFits[0]?.role || 'general engineering'} readiness and health score.</p>
        </div>
      </div>
    </Panel>
  );
}

function ShareableDevCardPanel({ pack }: { pack: LocalFeaturePack }) {
  return (
    <Panel title="10. Shareable Dev Card" icon={<Share2 className={iconClass} />}>
      <div className="rounded-2xl border border-primary/30 bg-slate-950 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wider text-primary">{pack.kindLabel}</p>
            <h4 className="mt-2 text-2xl font-black text-white">{pack.shareCard.title}</h4>
            <p className="mt-1 text-sm text-slate-400">{pack.shareCard.subtitle}</p>
          </div>
          <ShieldCheck className="w-9 h-9 text-emerald-400" />
        </div>
        <div className="mt-5 grid gap-2">
          {pack.shareCard.highlights.map((highlight) => (
            <div key={highlight} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm font-semibold text-slate-300">
              {highlight}
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

export function FeatureSuite({ pack }: FeatureSuiteProps) {
  return (
    <div className="mt-10 space-y-8">
      <AlgorithmicMetrics metrics={pack.algorithmicMetrics} />
      <SoftwareTrackPanel pack={pack} />
      <LanguageUsagePanel pack={pack} />
      {pack.deepAnalysis && <DeepAnalysisPanel analysis={pack.deepAnalysis} />}
      <SecurityAuditPanel pack={pack} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="1. Growth Roadmap" icon={<Flag className={iconClass} />}>
          <InsightList items={pack.roadmap} />
        </Panel>

        <RoleFitPanel roleFits={pack.roleFits} />
        <CodebaseHealthPanel health={pack.codebaseHealth} />

        <Panel title="5. Contribution Fingerprint" icon={<GitBranch className={iconClass} />}>
          <InsightList items={pack.contributionFingerprint} />
        </Panel>

        <EvolutionTimelinePanel timeline={pack.timeline} />
        <ExplanationModesPanel explanations={pack.explanations} />
        <BattleModePrepPanel pack={pack} />

        <Panel title="9. Weakness Detector" icon={<AlertTriangle className={iconClass} />}>
          <InsightList items={pack.weaknessDetector} />
        </Panel>

        <ShareableDevCardPanel pack={pack} />
      </div>
    </div>
  );
}

export function BattleInsightsPanel({ left, right }: BattleInsightsProps) {
  const insights = createBattleInsights(left, right);

  return (
    <div className="space-y-6">
      <Panel title="Language Usage Battle /100" icon={<BarChart3 className={iconClass} />}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LanguageMiniGraph pack={left} />
          <LanguageMiniGraph pack={right} />
        </div>
      </Panel>

      <Panel title="Battle Mode Upgrades" icon={<ClipboardCheck className={iconClass} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((item) => (
            <div key={item.title} className="rounded-xl bg-slate-900/55 border border-slate-800 p-4">
              <div className="flex items-center gap-2 text-primary">
                <Users className="w-4 h-4" />
                <h4 className="font-black text-slate-100">{item.title}</h4>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.detail}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
